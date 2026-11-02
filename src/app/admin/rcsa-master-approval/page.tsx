"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle } from "lucide-react";

type InboxRow = {
  approval_id?: number;

  id: number; // rcsa_master_id
  rcsa_name: string;
  description: string | null;
  status: string;
  created_at: string;
  created_by_name: string | null;

  target_unit_count?: number;
  target_units?: string | null;
};

function HighlightText({ text, q }: { text: string; q: string }) {
  const query = q.trim();
  if (!query) return <>{text}</>;

  const lower = text.toLowerCase();
  const ql = query.toLowerCase();

  const idx = lower.indexOf(ql);
  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const hit = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <>
      {before}
      <mark className="rounded bg-yellow-200 px-1">{hit}</mark>
      {after}
    </>
  );
}

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function RcsaMasterApprovalInbox() {
  const { toast } = useToast();
  const [rows, setRows] = useState<InboxRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [openReview, setOpenReview] = useState(false);
  const [selected, setSelected] = useState<
    (InboxRow & { _targetList?: string[]; _targetCount?: number }) | null
  >(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  // untuk detail target unit di modal review
  const [unitsList, setUnitsList] = useState<string[]>([]);
  const [unitsQuery, setUnitsQuery] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await api<InboxRow[]>("/rcsa/master/approval/inbox");
      setRows(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({ title: "Sistem Mengalami Gangguan", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitDecision = async (decision: "approved" | "rejected") => {
    if (!selected) return;

    if (!note.trim()) {
      toast({ title: "Catatan persetujuan wajib diisi", description: "" });
      return;
    }

    try {
      setSaving(true);
      await api(`/rcsa/master/${selected.id}/decision`, {
        method: "POST",
        json: { decision, note: note.trim() },
      });

      toast({ title: `Potensi Risiko (Data Master) ${decision}`, description: "" });
      setOpenReview(false);
      setSelected(null);
      setUnitsList([]);
      setUnitsQuery("");
      await load();
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    } finally {
      setSaving(false);
    }
  };

  const parsedRows = useMemo(() => {
    return rows.map((r) => {
      const list = (r.target_units || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const count = r.target_unit_count ?? list.length;

      return {
        ...r,
        _targetCount: count || 0,
        _targetList: list,
      };
    });
  }, [rows]);

  //  buka modal review + siapkan detail target unit (di sini, bukan modal lain)
  const openModalReview = (
    row: InboxRow & { _targetList?: string[]; _targetCount?: number }
  ) => {
    setSelected(row);
    setNote("");

    const list =
      row._targetList ??
      (row.target_units || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    setUnitsList(list);
    setUnitsQuery("");
    setOpenReview(true);
  };

  const filteredUnits = useMemo(() => {
    const q = unitsQuery.trim().toLowerCase();
    if (!q) return unitsList;
    return unitsList.filter((u) => u.toLowerCase().includes(q));
  }, [unitsList, unitsQuery]);

  if (loading) return <div className="p-6">Memuat...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Approval Master RCSA</h1>
        <p className="text-sm text-muted-foreground">
          Daftar master yang menunggu persetujuan (ditugaskan ke approver yang
          memiliki hak approve).
        </p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
  <div className="overflow-auto">
    <table className="w-full text-sm">
      <thead className="bg-muted/40">
        <tr>
          <th className="p-3 text-left">Master</th>
          <th className="p-3 text-center w-[160px]">Target Unit</th>
          <th className="p-3 text-right w-[140px]">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {parsedRows.map((r, idx) => {
          const key = r.approval_id ?? `${r.id}-${idx}`;

          return (
            <tr key={key} className="border-t">
              {/* MASTER */}
              <td className="p-3 align-top">
                <div className="font-medium">Potensi Risiko : {r.rcsa_name}</div>

                {r.description ? (
                  <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {r.description}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground mt-1">-</div>
                )}

                <div className="text-xs text-muted-foreground mt-2">
                  <span className="font-medium">Dibuat oleh:</span>{" "}
                  {r.created_by_name ?? "-"} <span className="mx-1">•</span>
                  {formatDate(r.created_at)}
                </div>
              </td>

              {/* TARGET UNIT: badge center (horizontal + vertical) */}
              <td className="p-3 align-middle">
                <div className="flex justify-center">
                  <Badge
                    variant="secondary"
                    className="min-w-[90px] justify-center px-4 py-1 text-sm font-medium"
                  >
                    {r._targetCount ? `${r._targetCount} unit` : "0 unit"}
                  </Badge>
                </div>
              </td>

              {/* AKSI: sejajarkan juga di tengah */}
              <td className="p-3 align-middle text-right">
                <Button size="sm" onClick={() => openModalReview(r)}>
                  Review
                </Button>
              </td>
            </tr>
          );
        })}

        {parsedRows.length === 0 && (
          <tr>
            <td colSpan={3} className="p-6 text-center text-muted-foreground">
              Tidak ada approval yang pending untuk Anda.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


      {/* MODAL: REVIEW MASTER + DETAIL TARGET UNIT */}
      <Dialog
        open={openReview}
        onOpenChange={(v) => {
          setOpenReview(v);
          if (!v) {
            setSelected(null);
            setNote("");
            setUnitsList([]);
            setUnitsQuery("");
          }
        }}>
        <DialogContent
          className="
            max-w-3xl
            w-[95vw]
            max-h-[85vh]
            overflow-hidden
            p-0
            grid
            grid-rows-[auto,1fr,auto]">
          {/* Header (fixed) */}
          <div className="px-6 py-4 border-b">
            <DialogHeader>
              <DialogTitle>Review Master</DialogTitle>
            </DialogHeader>
          </div>

          {/* Body (ONLY scroll here) */}
          <div className="px-6 py-4 overflow-y-auto">
            {selected && (
              <div className="space-y-5">
                {/* Info master */}
                <div className="rounded-lg border p-4 bg-muted/20">
                  <div className="min-w-0">
                    <div className="font-semibold text-base">
                      Potensi Risiko : {selected.rcsa_name}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {selected.description ?? "-"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">Target Unit:</span>{" "}
                      {selected.target_unit_count
                        ? `${selected.target_unit_count} unit`
                        : `${unitsList.length} unit`}
                    </div>
                  </div>
                </div>

                {/* Detail Target Unit */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      Detail Target Unit
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                      {unitsList.length} unit
                    </Badge>
                  </div>

                  <Input
                    value={unitsQuery}
                    onChange={(e) => setUnitsQuery(e.target.value)}
                    placeholder="Cari unit..."
                    className="h-9"
                    onFocus={(e) => e.currentTarget.select()}
                  />

                  <div className="rounded-lg border overflow-hidden">
                    <div className="max-h-56 overflow-y-auto">
                      <div className="divide-y">
                        {filteredUnits.map((u, i) => (
                          <div
                            key={`${u}-${i}`}
                            className="p-3 hover:bg-muted/40"
                          >
                            <div className="font-medium text-sm truncate">
                              <HighlightText text={u} q={unitsQuery} />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              #{i + 1}
                            </div>
                          </div>
                        ))}

                        {unitsList.length === 0 && (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            Tidak ada target unit.
                          </div>
                        )}

                        {unitsList.length > 0 && filteredUnits.length === 0 && (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            Tidak ada unit yang cocok dengan pencarian.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={async () => {
                        const txt = unitsList.join(", ");
                        try {
                          await navigator.clipboard.writeText(txt);
                          toast({
                            title: "Copied",
                            description: "Daftar target unit disalin.",
                          });
                        } catch {
                          toast({
                            title: "Gagal",
                            description: "Browser tidak mengizinkan copy.",
                          });
                        }
                      }}
                      disabled={unitsList.length === 0}
                    >
                      Copy semua unit
                    </Button>
                  </div>
                </div>

                {/* Catatan reviewer */}
                <div>
                  <div className="text-sm font-medium mb-1">
                    Catatan Reviewer
                  </div>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tulis alasan approve/reject..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer (fixed) */}
          <div className="px-6 py-4 border-t">
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setOpenReview(false)}>
                Tutup
              </Button>
              <Button
                variant="destructive"
                onClick={() => submitDecision("rejected")}
                disabled={saving}
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button
                onClick={() => submitDecision("approved")}
                disabled={saving}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
