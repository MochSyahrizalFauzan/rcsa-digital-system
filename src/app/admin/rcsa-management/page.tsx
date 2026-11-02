"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle, Send, UploadCloud, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatHumanDate, timeAgo } from "@/lib/date";

type Unit = { id: number; unit_name: string; unit_type: string };

type MasterRow = {
  id: number;
  rcsa_name: string;
  description: string | null;
  status:
    | "draft"
    | "pending_approval"
    | "approved"
    | "rejected"
    | "published"
    | "archived";
  created_at: string;
  created_by_name: string | null;
  target_units: number;
  used_count: number;
};

type TargetUnitRow = Unit & { is_active: number; assigned_at: string | null };
type UsedByUnitRow = Unit & {
  used_assessment_count: number;
  last_used_at: string | null;
};

type MasterDetailResponse = {
  master: {
    id: number;
    rcsa_name: string;
    description: string | null;
    status: MasterRow["status"];
    created_at: string;
  } | null;
  targetUnits: TargetUnitRow[];
  usedByUnits: UsedByUnitRow[];
};

export default function RcsaMasterAdminPage() {
  const { toast } = useToast();

  const [rows, setRows] = useState<MasterRow[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [unitIds, setUnitIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  // Search unit (CREATE modal)
  const [unitQuery, setUnitQuery] = useState("");

  // Assign modal
  const [openAssign, setOpenAssign] = useState(false);
  const [assignId, setAssignId] = useState<number | null>(null);
  const [assignUnitIds, setAssignUnitIds] = useState<number[]>([]);

  // Detail modal
  const [openDetail, setOpenDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<MasterDetailResponse | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  // Simple filter
  const [q, setQ] = useState("");

  const statusBadge = (s: MasterRow["status"]) => {
    const cls =
      s === "draft"
        ? "bg-muted text-foreground"
        : s === "pending_approval"
        ? "bg-amber-500/15 text-amber-700 border-amber-500/20"
        : s === "approved"
        ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/20"
        : s === "published"
        ? "bg-blue-500/15 text-blue-700 border-blue-500/20"
        : s === "rejected"
        ? "bg-red-500/15 text-red-700 border-red-500/20"
        : "bg-slate-500/15 text-slate-700 border-slate-500/20";

    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
          cls
        )}
      >
        {s}
      </span>
    );
  };

  // filter list berdasarkan search (hanya untuk tampilan)
  const filteredUnitsForCreate = useMemo(() => {
    const q = unitQuery.trim().toLowerCase();
    if (!q) return units;
    return units.filter((u) =>
      `${u.unit_name} ${u.unit_type}`.toLowerCase().includes(q)
    );
  }, [units, unitQuery]);

  // Select all = semua unit (bukan hasil search)
  const selectAllUnits = () => setUnitIds(units.map((u) => u.id));
  const unselectAllUnits = () => setUnitIds([]);

  function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function HighlightText({ text, query }: { text: string; query: string }) {
    const q = query.trim();
    if (!q) return <>{text}</>;

    const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
    const parts = String(text).split(re);

    return (
      <>
        {parts.map((p, i) =>
          re.test(p) ? (
            <mark
              key={i}
              className="bg-yellow-200 text-black px-0.5 rounded-sm"
            >
              {p}
            </mark>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
      </>
    );
  }

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((r) =>
      `${r.rcsa_name} ${r.description ?? ""} ${r.status}`
        .toLowerCase()
        .includes(qq)
    );
  }, [rows, q]);

  const load = async () => {
    try {
      setLoading(true);
      const [list, u] = await Promise.all([
        api<MasterRow[]>("/rcsa/master/list"),
        api<Unit[]>("/units"),
      ]);
      setRows(list);
      setUnits(u);
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async () => {
    if (!name.trim()) {
      toast({ title: "Potensi Risiko(Data Master) wajib diisi", description: " " });
      return;
    }
    if (unitIds.length === 0) {
      toast({ title: "Pilih minimal 1 unit target", description: "" });
      return;
    }

    try {
      setSaving(true);
      await api("/rcsa/master", {
        method: "POST",
        json: {
          rcsa_name: name.trim(),
          description: desc.trim() || null,
          unit_ids: unitIds,
        },
      });

      toast({ title: "Sukses Membuat Data Master", description: "(draft)" });
      setOpenCreate(false);
      setName("");
      setDesc("");
      setUnitIds([]);
      await load();
    } catch (err: any) {
      toast({ title: "Sistem Mengalami Gangguan", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const onOpenAssign = (row: MasterRow) => {
    setAssignId(row.id);
    setAssignUnitIds([]);
    setOpenAssign(true);
  };

  const onAssign = async () => {
    if (!assignId) return;
    if (assignUnitIds.length === 0) {
      toast({
        title: "Pilih minimal 1 unit target",
        description: "",
      });
      return;
    }

    try {
      setSaving(true);
      await api(`/rcsa/master/${assignId}/assign-units`, {
        method: "POST",
        json: { unit_ids: assignUnitIds },
      });

      toast({ title: "Sukses Memperbarui Target Unit", description: "" });
      setOpenAssign(false);
      setAssignId(null);
      setAssignUnitIds([]);
      await load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const onOpenDetail = async (row: MasterRow) => {
    setOpenDetail(true);
    setDetailId(row.id);
    setDetail(null);

    try {
      setDetailLoading(true);
      const d = await api<MasterDetailResponse>(
        `/rcsa/master/${row.id}/detail`
      );
      setDetail(d);
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setDetailLoading(false);
    }
  };

  const onSubmit = async (id: number) => {
    try {
      setSaving(true);
      await api(`/rcsa/master/${id}/submit`, { method: "POST" });
      toast({ title: "Sukses Diajukan untuk persetujuan", description: "" });
      await load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const onPublish = async (id: number) => {
    try {
      setSaving(true);
      await api(`/rcsa/master/${id}/publish`, { method: "POST" });
      toast({
        title: "Sukses Master dipublish ke unit target",
        description: "",
      });
      await load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (row: MasterRow) => {
    try {
      setSaving(true);
      await api(`/master-rcsa/${row.id}`, { method: "DELETE" });
      toast({ title: "Dihapus", description: "Master dihapus" });
      await load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Memuat...</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Kelola Master RCSA</h1>
          <p className="text-sm text-muted-foreground">
            Buat master (draft), tentukan unit target, ajukan approval, lalu
            publish.
          </p>
        </div>

        <Button onClick={() => setOpenCreate(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Buat Master
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari master..."
          className="max-w-sm"
        />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-3 text-left">Potensi Risiko (Data Master)</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Target Unit</th>
                <th className="p-3 text-center">Dipakai</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{r.rcsa_name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {r.description ?? "-"}
                    </div>
                  </td>
                  <td className="p-3">{statusBadge(r.status)}</td>
                  <td className="p-3 text-center">{r.target_units}</td>
                  <td className="p-3 text-center">{r.used_count}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenDetail(r)}
                      >
                        Detail
                      </Button>

                      {r.status === "draft" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenAssign(r)}
                          >
                            Atur Unit
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => onSubmit(r.id)}
                            disabled={saving}
                          >
                            <Send className="mr-2 h-4 w-4" /> Submit
                          </Button>

                          {/* <Button
                            variant="destructive"
                            size="sm"
                            disabled={saving || r.used_count > 0}
                            onClick={() => onDelete(r)}
                            title={
                              r.used_count > 0
                                ? "Tidak bisa delete karena sudah dipakai"
                                : "Hapus"
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button> */}
                        </>
                      )}

                      {r.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => onPublish(r.id)}
                          disabled={saving}
                        >
                          <UploadCloud className="mr-2 h-4 w-4" /> Publish
                        </Button>
                      )}

                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    className="p-6 text-center text-muted-foreground"
                    colSpan={5}
                  >
                    Tidak ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Dialog
        open={openCreate}
        onOpenChange={(v) => {
          setOpenCreate(v);
          if (!v) setUnitQuery("");
        }}
      >
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col">
          {/* HEADER (fixed) */}
          <div className="px-6 py-4 border-b shrink-0">
            <DialogHeader>
              <DialogTitle>Buat Master RCSA (Draft)</DialogTitle>
            </DialogHeader>
          </div>

          {/* BODY (scrollable) */}
          <div className="px-6 py-5 overflow-y-auto flex-1">
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium">
                  Nama Potensi Risiko
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Risiko kesalahan input..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <Input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Opsional"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Target Unit (Multi)
                </label>

                {/* SEARCH BOX */}
                <div className="mt-2">
                  <Input
                    value={unitQuery}
                    onChange={(e) => setUnitQuery(e.target.value)}
                    placeholder="Cari unit kerja ..."
                    className="h-10"
                    onFocus={(e) => e.currentTarget.select()}
                  />

                  {/* INFO + BUTTONS (wrap-safe) */}
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="min-w-0 flex-1">
                      Menampilkan {filteredUnitsForCreate.length} dari{" "}
                      {units.length} unit
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 whitespace-nowrap"
                        onClick={selectAllUnits} // (sesuai request kamu: select ALL data, bukan hasil search)
                        disabled={units.length === 0}
                      >
                        Select All
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 whitespace-nowrap"
                        onClick={unselectAllUnits} // unselect ALL data
                        disabled={unitIds.length === 0}
                      >
                        Unselect All
                      </Button>

                      {unitQuery.trim() && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 whitespace-nowrap"
                          onClick={() => setUnitQuery("")}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* LIST */}
                <div className="mt-3 max-h-[420px] overflow-auto rounded-lg border p-2 space-y-1">
                  {filteredUnitsForCreate.map((u) => {
                    const checked = unitIds.includes(u.id);

                    const toggle = () => {
                      setUnitIds((prev) =>
                        checked
                          ? prev.filter((x) => x !== u.id)
                          : [...prev, u.id]
                      );
                    };

                    return (
                      <div
                        key={u.id}
                        className={cn(
                          "w-full flex items-start justify-between gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted/40",
                          checked && "bg-muted/60"
                        )}
                      >
                        <button
                          type="button"
                          onClick={toggle}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="font-medium truncate">
                            <HighlightText
                              text={u.unit_name}
                              query={unitQuery}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <HighlightText
                              text={u.unit_type}
                              query={unitQuery}
                            />
                          </div>
                        </button>

                        <label className="shrink-0 pt-0.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={toggle}
                            className="h-5 w-5 accent-black"
                          />
                        </label>
                      </div>
                    );
                  })}

                  {filteredUnitsForCreate.length === 0 && (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      Unit tidak ditemukan.
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  Dipilih: {unitIds.length} unit
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER (fixed) */}
          <div className="px-6 py-4 border-t shrink-0 bg-background">
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setOpenCreate(false)}>
                Batal
              </Button>
              <Button onClick={onCreate} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Draft"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ASSIGN MODAL */}
      <Dialog open={openAssign} onOpenChange={setOpenAssign}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Atur Target Unit</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Pilih unit yang akan menerima master ini (aktif setelah publish).
            </div>

            <div className="max-h-56 overflow-auto rounded-lg border p-2 space-y-1">
              {units.map((u) => {
                const checked = assignUnitIds.includes(u.id);
                return (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => {
                      setAssignUnitIds((prev) =>
                        checked
                          ? prev.filter((x) => x !== u.id)
                          : [...prev, u.id]
                      );
                    }}
                    className={cn(
                      "w-full flex items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted/40",
                      checked && "bg-muted/60"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{u.unit_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {u.unit_type}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "h-4 w-4 rounded border",
                        checked && "bg-foreground"
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-muted-foreground">
              Dipilih: {assignUnitIds.length} unit
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenAssign(false)}>
              Batal
            </Button>
            <Button onClick={onAssign} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DETAIL MODAL (SIBLING, BUKAN DI DALAM ASSIGN) */}
      <Dialog
        open={openDetail}
        onOpenChange={(v) => {
          setOpenDetail(v);
          if (!v) {
            setDetail(null);
            setDetailId(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0">
          {/* Header fixed */}
          <div className="p-6 border-b">
            <DialogHeader>
              <DialogTitle>Detail Master RCSA</DialogTitle>
            </DialogHeader>
          </div>

          {/* Body scrollable */}
          <div className="px-6 py-4 overflow-y-auto max-h-[calc(85vh-140px)]">
            {detailLoading && (
              <div className="py-6 text-sm text-muted-foreground">
                Memuat detail...
              </div>
            )}

            {!detailLoading && !detail && (
              <div className="py-6 text-sm text-muted-foreground">
                Tidak ada detail.
              </div>
            )}

            {!detailLoading && detail && (
              <div className="space-y-6">
                {/* Header master */}
                <div className="rounded-lg border p-4 bg-muted/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-base truncate">
                        {detail.master?.rcsa_name ?? `Master #${detailId}`}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {detail.master?.description ?? "-"}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {detail.master?.status
                        ? statusBadge(detail.master.status)
                        : null}
                    </div>
                  </div>
                </div>

                {/* Target Units */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Target Unit</div>
                    <Badge variant="secondary" className="px-3 py-1">
                      {detail.targetUnits.length} unit
                    </Badge>
                  </div>

                  <div className="rounded-lg border overflow-hidden">
                    <div className="max-h-64 overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/40 sticky top-0">
                          <tr>
                            <th className="p-3 text-left">Unit</th>
                            <th className="p-3 text-left">Tipe</th>
                            <th className="p-3 text-center">Aktif</th>
                            <th className="p-3 text-left">Assigned At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.targetUnits.map((u) => (
                            <tr key={u.id} className="border-t">
                              <td className="p-3">{u.unit_name}</td>
                              <td className="p-3">{u.unit_type}</td>
                              <td className="p-3 text-center">
                                <Badge
                                  className={
                                    u.is_active
                                      ? "bg-emerald-600 text-white"
                                      : "bg-gray-500 text-white"
                                  }
                                >
                                  {u.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <div>{formatHumanDate(u.assigned_at)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {timeAgo(u.assigned_at)}
                                </div>
                              </td>
                            </tr>
                          ))}

                          {detail.targetUnits.length === 0 && (
                            <tr>
                              <td
                                className="p-6 text-center text-muted-foreground"
                                colSpan={4}
                              >
                                Belum ada target unit.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Used by Units */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Dipakai Oleh Unit</div>
                    <Badge variant="secondary" className="px-3 py-1">
                      {detail.usedByUnits.length} unit
                    </Badge>
                  </div>

                  <div className="rounded-lg border overflow-hidden">
                    <div className="max-h-64 overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/40 sticky top-0">
                          <tr>
                            <th className="p-3 text-left">Unit</th>
                            <th className="p-3 text-left">Tipe</th>
                            <th className="p-3 text-center">
                              Jumlah Assessment
                            </th>
                            <th className="p-3 text-left">Terakhir Dipakai</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detail.usedByUnits.map((u) => (
                            <tr key={u.id} className="border-t">
                              <td className="p-3">{u.unit_name}</td>
                              <td className="p-3">{u.unit_type}</td>
                              <td className="p-3 text-center">
                                {u.used_assessment_count}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <div>{formatHumanDate(u.last_used_at)}</div>
                                <div className="text-xs text-muted-foreground">
                                  {timeAgo(u.last_used_at)}
                                </div>
                              </td>
                            </tr>
                          ))}

                          {detail.usedByUnits.length === 0 && (
                            <tr>
                              <td
                                className="p-6 text-center text-muted-foreground"
                                colSpan={4}
                              >
                                Belum dipakai oleh unit manapun.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Catatan: “Dipakai” artinya unit tersebut sudah membuat
                    assessment dari master ini (rcsa_assessment ada).
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer fixed */}
          <div className="p-6 border-t flex justify-end">
            <Button variant="outline" onClick={() => setOpenDetail(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
