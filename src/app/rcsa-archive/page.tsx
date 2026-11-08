"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Archive } from "lucide-react";
import { formatHumanDate } from "@/lib/date";
import { useAuth } from "@/context/auth-context";

type ArchiveRow = {
  id: number; // assessment_id
  unit_name: string;
  unit_type?: string | null;

  potensi_risiko: string;
  jenis_risiko: string | null;
  penyebab_risiko: string | null;
  pengendalian: string | null;
  action_plan: string | null;
  pic: string | null;

  dampak_inheren: number | null;
  frekuensi_inheren: number | null;

  dampak_residual: number | null;
  kemungkinan_residual: number | null;

  decision: "approved" | "rejected" | null;
  reviewed_at: string | null;

  nilai_inheren?: number | null;
  nilai_residual?: number | null;
  level_inheren?: string | null;
  level_residual?: string | null;
};

function levelFromBesaran(val: number | null) {
  if (val == null) return "-";
  if (val >= 20) return "Sangat Tinggi";
  if (val >= 12) return "Tinggi";
  if (val >= 5) return "Menengah";
  return "Rendah";
}

function levelBadge(level: string) {
  const base = "px-2 py-0.5 text-xs font-semibold";
  if (level === "Sangat Tinggi")
    return <Badge className={`bg-red-700 ${base}`}>{level}</Badge>;
  if (level === "Tinggi")
    return <Badge className={`bg-red-500 ${base}`}>{level}</Badge>;
  if (level === "Menengah")
    return (
      <Badge className={`bg-yellow-400 text-black ${base}`}>{level}</Badge>
    );
  if (level === "Rendah")
    return <Badge className={`bg-green-600 ${base}`}>{level}</Badge>;
  return (
    <Badge variant="secondary" className={base}>
      {level}
    </Badge>
  );
}

function decisionBadge(decision: ArchiveRow["decision"]) {
  if (decision === "approved")
    return <Badge className="bg-green-600">APPROVED</Badge>;
  if (decision === "rejected")
    return <Badge className="bg-red-600">REJECTED</Badge>;
  return <Badge variant="secondary">-</Badge>;
}

function monthKey(iso?: string | null) {
  if (!iso) return "";
  return String(iso).slice(0, 7);
}

function monthLabel(ym: string) {
  try {
    const [y, m] = ym.split("-").map(Number);
    const d = new Date(y, (m || 1) - 1, 1);
    return d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  } catch {
    return ym;
  }
}

export default function RcsaArchivePage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ArchiveRow[]>([]);
  const [month, setMonth] = useState<string>("all");
  const { toast } = useToast();
  const { fetchWithAuth } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await fetchWithAuth("/rcsa/assessment/mine-reviewed", {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `Gagal (${res.status})`);
      }

      const data = (await res.json()) as ArchiveRow[];
      setRows(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast({
        title: "Gagal memuat arsip",
        description: err?.message,
        variant: "destructive",
      });
      setRows([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();

  }, []);

  const monthOptions = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) {
      const k = monthKey(r.reviewed_at);
      if (k) set.add(k);
    }
    // desc
    return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
  }, [rows]);

  const filtered = useMemo(() => {
    if (month === "all") return rows;
    return rows.filter((r) => monthKey(r.reviewed_at) === month);
  }, [rows, month]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const approved = filtered.filter((x) => x.decision === "approved").length;
    const rejected = filtered.filter((x) => x.decision === "rejected").length;
    return { total, approved, rejected };
  }, [filtered]);

  if (loading) return <div className="p-6">Memuat arsip RCSA...</div>;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="h-6 w-6" />
            RCSA Assessment Archive
          </h1>
          <p className="text-sm text-muted-foreground">
            Laporan assessment Anda yang sudah final (sudah direview).
          </p>
        </div>
        <Button size="sm" onClick={loadData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Filter Bulan (tanpa filter unit & decision) */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">Filter Bulan</div>
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="all">Semua Bulan</option>
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
          </select>
        </div>

        {/* Summary badges */}
        <div className="md:col-span-2 flex flex-wrap items-end gap-2">
          <Badge variant="secondary">Total: {summary.total}</Badge>
          <Badge className="bg-green-600">Approved: {summary.approved}</Badge>
          <Badge className="bg-red-600">Rejected: {summary.rejected}</Badge>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-3 text-center w-[60px]">NO</th>
                <th className="p-3 text-left min-w-[220px]">UNIT KERJA</th>
                <th className="p-3 text-left min-w-[260px]">POTENSI RISIKO</th>
                <th className="p-3 text-left min-w-[180px]">JENIS RISIKO</th>
                <th className="p-3 text-left min-w-[260px]">PENYEBAB RISIKO</th>

                <th className="p-3 text-center min-w-[120px]">DAMPAK</th>
                <th className="p-3 text-center min-w-[120px]">FREKUENSI</th>
                <th className="p-3 text-center min-w-[140px]">NILAI</th>
                <th className="p-3 text-center min-w-[150px]">LEVEL</th>

                <th className="p-3 text-left min-w-[260px]">PENGENDALIAN</th>

                <th className="p-3 text-center min-w-[120px]">DAMPAK</th>
                <th className="p-3 text-center min-w-[160px]">KEMUNGKINAN</th>
                <th className="p-3 text-center min-w-[140px]">NILAI</th>
                <th className="p-3 text-center min-w-[150px]">LEVEL</th>

                <th className="p-3 text-left min-w-[240px]">ACTION PLAN</th>
                <th className="p-3 text-left min-w-[160px]">PIC</th>

                <th className="p-3 text-center min-w-[140px]">DECISION</th>
                <th className="p-3 text-left min-w-[180px]">REVIEWED AT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const rowKey =
                  (r as any).assessment_id ??
                  r.id ??
                  `${monthKey(r.reviewed_at)}-${r.unit_name}-${
                    r.potensi_risiko
                  }-${idx}`;

                const inherenNilai =
                  r.nilai_inheren ??
                  (r.dampak_inheren != null && r.frekuensi_inheren != null
                    ? r.dampak_inheren * r.frekuensi_inheren
                    : null);

                const residualNilai =
                  r.nilai_residual ??
                  (r.dampak_residual != null && r.kemungkinan_residual != null
                    ? r.dampak_residual * r.kemungkinan_residual
                    : null);

                const inherenLevel =
                  r.level_inheren ?? levelFromBesaran(inherenNilai);
                const residualLevel =
                  r.level_residual ?? levelFromBesaran(residualNilai);

                return (
                  <tr key={rowKey} className="border-t align-top">
                    <td className="p-3 text-center font-medium">{idx + 1}</td>

                    <td className="p-3">
                      <div className="font-medium">{r.unit_name}</div>
                      {r.unit_type ? (
                        <div className="text-xs text-muted-foreground">
                          {r.unit_type}
                        </div>
                      ) : null}
                    </td>

                    <td className="p-3">
                      <div className="font-medium">{r.potensi_risiko}</div>
                    </td>

                    <td className="p-3">{r.jenis_risiko ?? "-"}</td>
                    <td className="p-3">{r.penyebab_risiko ?? "-"}</td>

                    <td className="p-3 text-center">
                      {r.dampak_inheren ?? "-"}
                    </td>
                    <td className="p-3 text-center">
                      {r.frekuensi_inheren ?? "-"}
                    </td>
                    <td className="p-3 text-center">{inherenNilai ?? "-"}</td>
                    <td className="p-3 text-center">
                      {levelBadge(String(inherenLevel))}
                    </td>

                    <td className="p-3">{r.pengendalian ?? "-"}</td>

                    <td className="p-3 text-center">
                      {r.dampak_residual ?? "-"}
                    </td>
                    <td className="p-3 text-center">
                      {r.kemungkinan_residual ?? "-"}
                    </td>
                    <td className="p-3 text-center">{residualNilai ?? "-"}</td>
                    <td className="p-3 text-center">
                      {levelBadge(String(residualLevel))}
                    </td>

                    <td className="p-3">{r.action_plan ?? "-"}</td>
                    <td className="p-3">{r.pic ?? "-"}</td>

                    <td className="p-3 text-center">
                      {decisionBadge(r.decision)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {r.reviewed_at ? formatHumanDate(r.reviewed_at) : "-"}
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={18}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Tidak ada data arsip untuk filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Catatan: halaman ini otomatis mengikuti akun/unit kerja yang sedang
        login, dan hanya menampilkan assessment yang sudah final (reviewed).
      </div>
    </div>
  );
}
