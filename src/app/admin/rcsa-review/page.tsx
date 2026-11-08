"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {History, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RiskTable } from "@/components/rcsa/RcsaTable";
import type { RCSAData } from "@/lib/rcsa-data";
import { toCamelCase } from "@/lib/utils";
import { API_BASE } from "@/lib/api";

type QueueItem = {
  id: number;
  status: "submitted" | "reviewed" | "draft";

  unit_name: string;
  unit_type: string;

  created_by_name: string;
  created_by_user_id: string;

  rcsa_name: string;
  rcsa_description: string;

  potensi_risiko: string;
  jenis_risiko: string | null;
  penyebab_risiko: string | null;
  pengendalian: string | null;
  action_plan: string | null;
  pic: string | null;
  keterangan_user: string | null;

  dampak_inheren: number | null;
  frekuensi_inheren: number | null;
  nilai_inheren: number | null;
  level_inheren: string | null;

  dampak_residual: number | null;
  kemungkinan_residual: number | null;
  nilai_residual: number | null;
  level_residual: string | null;

  created_at: string;
  updated_at: string;

  unit_id?: number;
  rcsa_master_id?: number;
};

type NoteItem = {
  id: number;
  note: string;
  decision: "approved" | "rejected";
  created_at: string;
  reviewer_name: string;
};

function formatDateTime(iso?: string | null) {
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
    return String(iso);
  }
}

export default function AdminRcsaReviewPage() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<QueueItem[]>([]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<QueueItem | null>(null);

  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [note, setNote] = useState("");

  const [notesLoading, setNotesLoading] = useState(false);
  const [history, setHistory] = useState<NoteItem[]>([]);

  const count = items.length;

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/rcsa/review/queue`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal ambil queue");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast({
        title: "Gagal memuat queue",
        description: e?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openReview = async (row: QueueItem) => {
    setSelected(row);
    setDecision("approved");
    setNote("");
    setHistory([]);
    setOpen(true);

    setNotesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/rcsa/review/${row.id}/notes`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setNotesLoading(false);
    }
  };

  const submitReview = async () => {
    if (!selected) return;

    if (!note.trim()) {
      toast({ title: "Catatan wajib diisi", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/rcsa/review/${selected.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note.trim(), decision }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Gagal submit review");

      toast({
        title: `Review Assessment  ${decision}`,
        description: `Assessment #${selected.id} ${decision}`,
      });

      setItems((prev) => prev.filter((x) => x.id !== selected.id));
      setOpen(false);
      setSelected(null);
    } catch (e: any) {
      toast({
        title: "Gagal simpan review",
        description: e?.message,
        variant: "destructive",
      });
    }
  };

  const levelBadge = (lvl?: string | null) => {
    if (!lvl) return <Badge variant="outline">-</Badge>;
    const map: Record<string, string> = {
      Rendah: "bg-green-600",
      Sedang: "bg-yellow-500 text-black",
      Tinggi: "bg-red-500",
      "Sangat Tinggi": "bg-red-700",
    };
    return <Badge className={map[lvl] || ""}>{lvl}</Badge>;
  };

  const selectedAsRCSAData = useMemo((): RCSAData[] => {
    if (!selected) return [];

    const c = toCamelCase(selected) as any;

    const row: RCSAData = {
      id: c.id,
      no: 1,

      unit_id: c.unitId ?? c.unit_id ?? null,
      rcsa_master_id: c.rcsaMasterId ?? c.rcsa_master_id ?? null,

      potensiRisiko: c.potensiRisiko ?? c.potensi_risiko ?? c.rcsaName ?? "",
      jenisRisiko: c.jenisRisiko ?? null,
      penyebabRisiko: c.penyebabRisiko ?? null,

      dampakInheren: c.dampakInheren ?? null,
      frekuensiInheren: c.frekuensiInheren ?? null,

      pengendalian: c.pengendalian ?? null,

      dampakResidual: c.dampakResidual ?? null,
      kemungkinanResidual: c.kemungkinanResidual ?? null,

      actionPlan: c.actionPlan ?? null,
      pic: c.pic ?? null,

      keteranganUser: c.keteranganUser ?? null,

      status: (c.status ?? "submitted") as any,
    };

    return [row];
  }, [selected]);

  if (loading) return <div className="p-6">Memuat queue review...</div>;

  return (
    <div className="p-6 space-y-4">
      {/* HEADER (rapi, tidak dobel) */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Queue Review RCSA Asessment</h1>
          <p className="text-muted-foreground text-sm">
            Daftar assessment yang menunggu keputusan reviewer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="gap-2"
          >
            <Link href="/admin/rcsa-review/rcsa-history">
              <History className="h-4 w-4" />
              Riwayat Review
            </Link>
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={fetchQueue}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {count === 0 ? (
        <div className="border rounded-lg p-6 text-muted-foreground bg-white">
          Tidak ada assessment yang menunggu review.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="p-3 w-[80px]">ID</th>
                  <th className="p-3 w-[260px]">Unit</th>
                  <th className="p-3 w-[220px]">PIC</th>
                  <th className="p-3 min-w-[320px]">Potensi Risiko</th>
                  <th className="p-3 w-[180px]">Inheren</th>
                  <th className="p-3 w-[180px]">Residual</th>
                  <th className="p-3 text-right w-[140px]">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {items.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-muted/20">
                    <td className="p-3 font-semibold">#{r.id}</td>

                    <td className="p-3">
                      <div className="font-medium truncate">{r.unit_name}</div>
                      <div className="text-xs text-muted-foreground">{r.unit_type}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium truncate">{r.created_by_name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {r.created_by_user_id}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium">
                        {r.potensi_risiko || r.rcsa_name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {r.rcsa_description}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {levelBadge(r.level_inheren)}
                        <span className="text-xs text-muted-foreground">
                          ({r.nilai_inheren ?? "-"})
                        </span>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {levelBadge(r.level_residual)}
                        <span className="text-xs text-muted-foreground">
                          ({r.nilai_residual ?? "-"})
                        </span>
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      <Button size="sm" onClick={() => openReview(r)}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* footer info kecil */}
          <div className="border-t p-3 text-xs text-muted-foreground">
            Terakhir diperbarui: {formatDateTime(new Date().toISOString())}
          </div>
        </div>
      )}

      {/* MODAL REVIEW (lebih stabil, header/body/footer fixed) */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setSelected(null);
            setHistory([]);
            setNote("");
          }
        }}
      >
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] overflow-hidden p-0">
          {/* HEADER */}
          <div className="p-6 pb-3 border-b">
            <DialogHeader>
              <DialogTitle>
                Review Assessment {selected ? `#${selected.id}` : ""}
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* BODY SCROLL */}
          <div className="px-6 py-4 overflow-y-auto max-h-[78vh] space-y-4">
            {selected && (
              <>
                {/* TABEL RCSA (read-only) */}
                <div className="border rounded-lg bg-white">
                  <div className="max-h-[42vh] overflow-auto">
                    <RiskTable
                      mode="reviewer"
                      data={selectedAsRCSAData}
                      showSubmitButton={false}
                    />
                  </div>
                </div>

                {/* RIWAYAT CATATAN */}
                <div className="border rounded-md p-3 bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">Riwayat Catatan</div>
                    <Badge variant="secondary" className="px-3 py-1">
                      {history.length} catatan
                    </Badge>
                  </div>

                  {notesLoading ? (
                    <div className="text-sm text-muted-foreground mt-2">
                      Memuat riwayat...
                    </div>
                  ) : history.length === 0 ? (
                    <div className="text-sm text-muted-foreground mt-2">
                      Belum ada catatan sebelumnya.
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2 max-h-[22vh] overflow-auto pr-1">
                      {history.map((h) => (
                        <div key={h.id} className="border rounded p-2">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              {h.reviewer_name}
                            </div>
                            <Badge
                              className={
                                h.decision === "approved"
                                  ? "bg-green-600"
                                  : "bg-red-600"
                              }
                            >
                              {h.decision.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="text-sm mt-1 whitespace-pre-wrap">
                            {h.note}
                          </div>

                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDateTime(h.created_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FORM KEPUTUSAN */}
                <div className="border rounded-md p-3 space-y-3 bg-white">
                  <div className="font-semibold">Keputusan Reviewer</div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant={decision === "approved" ? "default" : "outline"}
                      onClick={() => setDecision("approved")}
                      className={
                        decision === "approved"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      Approve
                    </Button>

                    <Button
                      type="button"
                      variant={decision === "rejected" ? "default" : "outline"}
                      onClick={() => setDecision("rejected")}
                      className={
                        decision === "rejected"
                          ? "bg-red-600 hover:bg-red-700"
                          : ""
                      }
                    >
                      Reject
                    </Button>

                    <Badge variant="outline" className="ml-auto">
                      Pilihan: {decision.toUpperCase()}
                    </Badge>
                  </div>

                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Tulis catatan reviewer (wajib)..."
                    className="min-h-[120px]"
                  />
                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 pt-3 border-t">
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button onClick={submitReview} disabled={!note.trim()}>
                Simpan Review
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
