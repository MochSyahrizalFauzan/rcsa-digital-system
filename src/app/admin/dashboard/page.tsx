"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

import {
  RefreshCw,
  LayoutDashboard,
  Layers,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Search,
  ArrowUpRight,
  Activity,
  Users,
} from "lucide-react";

type MasterStat = { status: string; cnt: number };

type AssessmentStats = {
  draft: number;
  submitted: number;
  reviewed: number;
};

type Coverage = {
  total_assignments: number;
  done: number;
  draft: number;
  missing: number;
};

type MissingByMasterRow = {
  master_id: number;
  rcsa_name: string;
  created_at: string;
  assigned_units: number;
  submitted_units: number;
  draft_units: number;
  missing_units: number;
  not_submitted_unit_names: string | null;
};

type UnitProgressRow = {
  unit_id: number;
  unit_name: string;
  unit_type: string;
  assigned_masters: number;
  submitted: number;
  draft: number;
  missing: number;
};

type RecentLoginRow = {
  id: number;
  user_id: number;
  user_name: string;
  login_time: string;
  logout_time: string | null;
  ip_address: string;
  user_agent: string;
  role_name: string | null;
  unit_name: string | null;
  status: "active" | "inactive";
};

type ApprovalInboxRow = {
  approval_id: number;
  id: number;
  rcsa_name: string;
  description: string | null;
  status: string;
  created_at: string;
  created_by_name: string | null;
  step_order: number;
  approver_user_id: number | null;
};

type ReviewQueueRow = {
  id: number;
  status: string;
  updated_at: string;
  potensi_risiko: string | null;
  unit_name: string;
  unit_type: string;
  created_by_name: string;
  created_by_user_id: string;
};

type DashboardResponse = {
  masterStats: MasterStat[];
  assessmentStats: AssessmentStats;
  coverage: Coverage;
  missingByMaster: MissingByMasterRow[];
  unitProgress: UnitProgressRow[];
  queues: {
    approvalInbox: ApprovalInboxRow[];
    reviewQueue: ReviewQueueRow[];
  };
  recent: {
    logins: RecentLoginRow[];
  };
};

const TOP_N = 10;

function fmtDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" });
}

function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function cx(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(" ");
}

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>{label}</span>
        <span className="font-semibold text-white">{value}%</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-white/15 overflow-hidden">
        <div
          className="h-full rounded-full bg-white transition-all"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  tone = "gray",
}: {
  label: string;
  value: number | string;
  tone?: "gray" | "green" | "yellow" | "blue" | "red" | "slate";
}) {
  const toneClass =
    tone === "green"
      ? "bg-green-100 text-green-800"
      : tone === "yellow"
      ? "bg-yellow-100 text-yellow-800"
      : tone === "blue"
      ? "bg-blue-100 text-blue-800"
      : tone === "red"
      ? "bg-red-100 text-red-800"
      : tone === "slate"
      ? "bg-slate-100 text-slate-800"
      : "bg-gray-100 text-gray-800";

  return (
    <span className={cx("px-2 py-1 rounded-md text-xs", toneClass)}>
      <span className="text-gray-600">{label}:</span>{" "}
      <span className="font-semibold">{value}</span>
    </span>
  );
}

function MiniBadge({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "green" | "yellow" | "red" | "blue" | "gray";
}) {
  const cls =
    tone === "green"
      ? "bg-green-100 text-green-800"
      : tone === "yellow"
      ? "bg-yellow-100 text-yellow-800"
      : tone === "red"
      ? "bg-red-100 text-red-800"
      : tone === "blue"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";

  return <span className={cx("px-2 py-1 rounded text-xs", cls)}>{children}</span>;
}

export default function AdminDashboardPage() {
  const { fetchWithAuth, user, isReady } = useAuth();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string>("");

  const [tab, setTab] = useState<"ringkasan" | "unit" | "master" | "aktivitas">(
    "ringkasan"
  );

  const [unitQuery, setUnitQuery] = useState("");
  const [masterQuery, setMasterQuery] = useState("");
  const [loginQuery, setLoginQuery] = useState("");

  const canApprove = !!user?.permissions?.can_approve;
  const canRead = !!user?.permissions?.can_read;

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchWithAuth("/dashboard/summary", {
        method: "GET",
      });

      if (!res.ok) {
        const msg = (await res.json().catch(() => ({})))?.message;
        throw new Error(msg || "Gagal memuat dashboard");
      }

      const json = (await res.json()) as DashboardResponse;
      setData(json);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Gagal memuat dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const masterStatsMap = useMemo(() => {
    const m = new Map<string, number>();
    (data?.masterStats || []).forEach((x) =>
      m.set(x.status, Number(x.cnt) || 0)
    );
    return m;
  }, [data]);

  const masterTotal = useMemo(() => {
    let sum = 0;
    masterStatsMap.forEach((v) => (sum += v));
    return sum;
  }, [masterStatsMap]);

  const assessmentTotal = useMemo(() => {
    const a = data?.assessmentStats;
    if (!a) return 0;
    return (a.draft || 0) + (a.submitted || 0) + (a.reviewed || 0);
  }, [data]);

  const coverageTotal = data?.coverage?.total_assignments || 0;
  const coverageDone = data?.coverage?.done || 0;
  const coverageDraft = data?.coverage?.draft || 0;
  const coverageMissing = data?.coverage?.missing || 0;

  const donePct = pct(coverageDone, coverageTotal);
  const draftPct = pct(coverageDraft, coverageTotal);
  const missingPct = pct(coverageMissing, coverageTotal);

  const topLaggingUnit = data?.unitProgress?.[0]?.unit_name || "—";
  const topMissingUnits = data?.missingByMaster?.[0]?.missing_units ?? 0;

  const filteredUnits = useMemo(() => {
    const q = unitQuery.trim().toLowerCase();
    const list = data?.unitProgress || [];
    if (!q) return list;
    return list.filter((u) => {
      const blob =
        `${u.unit_name} ${u.unit_type} ${u.assigned_masters} ${u.submitted} ${u.draft} ${u.missing}`.toLowerCase();
      return blob.includes(q);
    });
  }, [data, unitQuery]);

  const filteredMasters = useMemo(() => {
    const q = masterQuery.trim().toLowerCase();
    const list = data?.missingByMaster || [];
    if (!q) return list;
    return list.filter((m) => {
      const blob =
        `${m.rcsa_name} ${m.not_submitted_unit_names || ""} ${m.assigned_units} ${m.submitted_units} ${m.missing_units}`.toLowerCase();
      return blob.includes(q);
    });
  }, [data, masterQuery]);

  const filteredLogins = useMemo(() => {
    const q = loginQuery.trim().toLowerCase();
    const list = data?.recent?.logins || [];
    if (!q) return list;
    return list.filter((l) => {
      const blob =
        `${l.user_name} ${l.role_name || ""} ${l.unit_name || ""} ${l.ip_address || ""} ${l.status}`.toLowerCase();
      return blob.includes(q);
    });
  }, [data, loginQuery]);

  if (!isReady) {
    return <div className="p-8 text-gray-600">⏳ Menyiapkan sesi...</div>;
  }

  if (!canRead) {
    return (
      <div className="p-8 lg:p-12">
        <Card className="p-6 border border-red-200 bg-red-50 text-red-700">
          Akses ditolak. Role kamu tidak punya izin <b>can_read</b> untuk dashboard.
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6">
      {/* HEADER (lebih rapih + dashboard look) */}
      <div className="rounded-2xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-lg overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col xl:flex-row gap-6 xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-white/80">
                <LayoutDashboard className="h-5 w-5" />
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
              </div>

              <div className="mt-2 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div className="min-w-0">

                  <p className="mt-1 text-white/70 max-w-2xl">
                    Ringkasan progres RCSA, unit yang belum mengirim, antrian approval/review, dan aktivitas login.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm">
                  <b>{user?.name || user?.user_id || "—"}</b>
                </span>
              </div>
            </div>

            {/* quick links */}
            <div className="w-full xl:w-[420px]">
              {/* <div className="grid grid-cols-2 gap-2">
                <Link href="/admin/rcsa-management">
                  <Button variant="secondary" className="w-full justify-between">
                    Master <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/review-rcsa">
                  <Button variant="secondary" className="w-full justify-between">
                    Review <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/approval-master">
                  <Button variant="secondary" className="w-full justify-between">
                    Approval <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/rcsa-report">
                  <Button variant="secondary" className="w-full justify-between">
                    Laporan <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div> */}

              <div className="mt-3 rounded-xl bg-white/10 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Status data</span>
                  <span className="text-white font-semibold">
                    {loading ? "Memuat..." : data ? "Siap" : "—"}
                  </span>
                </div>
                <ProgressBar value={donePct} label="Tingkat penyelesaian (published)" />
              </div>
            </div>
          </div>
        </div>

        {/* strip bawah biar “premium” dikit */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500/60 via-emerald-500/60 to-yellow-500/60" />
      </div>

      {error && (
        <Card className="p-4 border border-red-200 bg-red-50 text-red-700">
          {error}
        </Card>
      )}

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Master</div>
              <div className="mt-1 text-3xl font-semibold">{masterTotal}</div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Layers className="h-5 w-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatPill label="Draft" value={masterStatsMap.get("draft") || 0} tone="gray" />
            <StatPill label="Pending" value={masterStatsMap.get("pending_approval") || 0} tone="yellow" />
            <StatPill label="Approved" value={masterStatsMap.get("approved") || 0} tone="green" />
            <StatPill label="Published" value={masterStatsMap.get("published") || 0} tone="blue" />
            <StatPill label="Arsip" value={masterStatsMap.get("archived") || 0} tone="slate" />
          </div>
        </Card>

        <Card className="p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Assessment</div>
              <div className="mt-1 text-3xl font-semibold">{assessmentTotal}</div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatPill label="Draft" value={data?.assessmentStats?.draft || 0} tone="gray" />
            <StatPill label="Submitted" value={data?.assessmentStats?.submitted || 0} tone="yellow" />
            <StatPill label="Reviewed" value={data?.assessmentStats?.reviewed || 0} tone="blue" />
          </div>
        </Card>

        <Card className="p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">Coverage Published</div>
              <div className="mt-1 text-3xl font-semibold">{coverageTotal}</div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Badge className="justify-center bg-green-600 text-white">
              Selesai: {coverageDone} ({donePct}%)
            </Badge>
            <Badge className="justify-center bg-yellow-500 text-white">
              Draft: {coverageDraft} ({draftPct}%)
            </Badge>
            <Badge className="justify-center bg-red-600 text-white">
              Belum: {coverageMissing} ({missingPct}%)
            </Badge>
          </div>
        </Card>

        <Card className="p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">Sorotan</div>
              <div className="mt-1 text-base font-semibold text-gray-900">
                Fokus perbaikan
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-slate-700" />
            </div>
          </div>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Unit paling tertinggal</span>
              <span className="font-medium text-gray-900 text-right max-w-[180px] truncate">
                {topLaggingUnit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Missing terbesar</span>
              <span className="font-semibold text-gray-900">{topMissingUnits} unit</span>
            </div>
          </div>
        </Card>
      </div>

      {/* TABS */}
      <div className="flex flex-col gap-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
          <TabsList className="bg-white border border-gray-200 rounded-lg p-1 flex shadow-sm overflow-hidden w-full md:w-auto">
            {/* <TabsTrigger
              value="ringkasan"
              className="px-4 py-2 text-sm font-semibold text-gray-600 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Ringkasan
            </TabsTrigger> */}
            <TabsTrigger
              value="unit"
              className="px-4 py-2 text-sm font-semibold text-gray-600 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Unit
            </TabsTrigger>
            <TabsTrigger
              value="master"
              className="px-4 py-2 text-sm font-semibold text-gray-600 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Master
            </TabsTrigger>
            <TabsTrigger
              value="aktivitas"
              className="px-4 py-2 text-sm font-semibold text-gray-600 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:rounded-md"
            >
              Aktivitas
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* RINGKASAN */}
        {tab === "ringkasan" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-slate-700" />
                    <h2 className="text-lg font-semibold">Unit Belum Mengirim (Top 10)</h2>
                  </div>
                  <p className="text-sm text-gray-500">
                    Berdasarkan master published + mapping aktif.
                  </p>
                </div>
                <Badge className="bg-red-100 text-red-800">Urut Missing</Badge>
              </div>

              <div className="relative mb-4">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={unitQuery}
                  onChange={(e) => setUnitQuery(e.target.value)}
                  placeholder="Cari unit / tipe / angka..."
                  className="pl-9"
                />
              </div>

              {!filteredUnits.length ? (
                <div className="text-sm text-gray-500">Tidak ada data.</div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-gray-700 border-b bg-gray-50">
                      <tr>
                        <th className="p-3">Unit</th>
                        <th className="p-3">Assigned</th>
                        <th className="p-3">Submitted</th>
                        <th className="p-3">Draft</th>
                        <th className="p-3">Missing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUnits.slice(0, TOP_N).map((u) => (
                        <tr key={u.unit_id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium text-gray-900">{u.unit_name}</div>
                            <div className="text-xs text-gray-500">{u.unit_type}</div>
                          </td>
                          <td className="p-3">{u.assigned_masters}</td>
                          <td className="p-3">
                            <MiniBadge tone="green">{u.submitted}</MiniBadge>
                          </td>
                          <td className="p-3">
                            <MiniBadge tone="yellow">{u.draft}</MiniBadge>
                          </td>
                          <td className="p-3">
                            <MiniBadge tone="red">{u.missing}</MiniBadge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            <Card className="p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-700" />
                    <h2 className="text-lg font-semibold">Master dengan Missing Terbanyak (Top 10)</h2>
                  </div>
                  <p className="text-sm text-gray-500">
                    Master published yang masih banyak unit belum mengirim.
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Top 10</Badge>
              </div>

              <div className="relative mb-4">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={masterQuery}
                  onChange={(e) => setMasterQuery(e.target.value)}
                  placeholder="Cari master / unit..."
                  className="pl-9"
                />
              </div>

              {!filteredMasters.length ? (
                <div className="text-sm text-gray-500">Tidak ada data.</div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm text-left">
                    <thead className="text-gray-700 border-b bg-gray-50">
                      <tr>
                        <th className="p-3">Master</th>
                        <th className="p-3 text-center">Assigned</th>
                        <th className="p-3 text-center">Submitted</th>
                        <th className="p-3 text-center">Missing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMasters.slice(0, TOP_N).map((m) => {
                        const missing = m.assigned_units - m.submitted_units;
                        return (
                          <tr key={m.master_id} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="p-3">
                              <div className="font-medium text-gray-900">{m.rcsa_name}</div>
                              <div className="text-xs text-gray-500">
                                Dibuat: {fmtDate(m.created_at)}
                              </div>
                              {m.not_submitted_unit_names && (
                                <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  <span className="text-gray-500">Belum mengirim:</span>{" "}
                                  {m.not_submitted_unit_names}
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-center">{m.assigned_units}</td>
                            <td className="p-3 text-center">
                              <MiniBadge tone="green">{m.submitted_units}</MiniBadge>
                            </td>
                            <td className="p-3 text-center">
                              <MiniBadge tone="red">{missing}</MiniBadge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* UNIT */}
        {tab === "unit" && (
          <Card className="p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-slate-700" />
                  <h2 className="text-lg font-semibold">Progres Unit (Top 10)</h2>
                </div>
                <p className="text-sm text-gray-500">
                  Cari unit, lalu lihat assigned/submitted/draft/missing.
                </p>
              </div>

              <div className="relative w-full md:max-w-md">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={unitQuery}
                  onChange={(e) => setUnitQuery(e.target.value)}
                  placeholder="Cari unit..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-700 border-b bg-gray-50">
                  <tr>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Assigned</th>
                    <th className="p-3">Submitted</th>
                    <th className="p-3">Draft</th>
                    <th className="p-3">Missing</th>
                    <th className="p-3">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.slice(0, TOP_N).map((u) => {
                    const rate = pct(u.submitted, u.assigned_masters);
                    return (
                      <tr key={u.unit_id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium text-gray-900">{u.unit_name}</div>
                          <div className="text-xs text-gray-500">{u.unit_type}</div>
                        </td>
                        <td className="p-3">{u.assigned_masters}</td>
                        <td className="p-3">
                          <MiniBadge tone="green">{u.submitted}</MiniBadge>
                        </td>
                        <td className="p-3">
                          <MiniBadge tone="yellow">{u.draft}</MiniBadge>
                        </td>
                        <td className="p-3">
                          <MiniBadge tone="red">{u.missing}</MiniBadge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-28 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-slate-800"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {!filteredUnits.length && (
                    <tr>
                      <td className="p-6 text-center text-gray-500" colSpan={6}>
                        Tidak ada data yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Menampilkan Top {TOP_N}. Gunakan pencarian untuk mempersempit hasil.
            </div>
          </Card>
        )}

        {/* MASTER */}
        {tab === "master" && (
          <Card className="p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-700" />
                  <h2 className="text-lg font-semibold">Cakupan Master (Top 10)</h2>
                </div>
                <p className="text-sm text-gray-500">
                  Fokus ke master published yang masih banyak unit belum mengirim.
                </p>
              </div>

              <div className="relative w-full md:max-w-md">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={masterQuery}
                  onChange={(e) => setMasterQuery(e.target.value)}
                  placeholder="Cari master..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-700 border-b bg-gray-50">
                  <tr>
                    <th className="p-3">Master</th>
                    <th className="p-3 text-center">Assigned</th>
                    <th className="p-3 text-center">Submitted</th>
                    <th className="p-3 text-center">Draft</th>
                    <th className="p-3 text-center">Missing</th>
                    <th className="p-3">Progres</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMasters.slice(0, TOP_N).map((m) => {
                    const missing = m.assigned_units - m.submitted_units;
                    const rate = pct(m.submitted_units, m.assigned_units);

                    return (
                      <tr key={m.master_id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium text-gray-900">{m.rcsa_name}</div>
                          <div className="text-xs text-gray-500">
                            Dibuat: {fmtDate(m.created_at)}
                          </div>
                          {m.not_submitted_unit_names && (
                            <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                              <span className="text-gray-500">Belum mengirim:</span>{" "}
                              {m.not_submitted_unit_names}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-center">{m.assigned_units}</td>
                        <td className="p-3 text-center">
                          <MiniBadge tone="green">{m.submitted_units}</MiniBadge>
                        </td>
                        <td className="p-3 text-center">
                          <MiniBadge tone="yellow">{m.draft_units}</MiniBadge>
                        </td>
                        <td className="p-3 text-center">
                          <MiniBadge tone="red">{missing}</MiniBadge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-32 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-slate-800"
                                style={{ width: `${rate}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {!filteredMasters.length && (
                    <tr>
                      <td className="p-6 text-center text-gray-500" colSpan={6}>
                        Tidak ada data yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Menampilkan Top {TOP_N}. Gunakan pencarian untuk mempersempit hasil.
            </div>
          </Card>
        )}

        {/* AKTIVITAS */}
        {tab === "aktivitas" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-semibold">Login Terbaru (Top 10)</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Aktivitas login terakhir untuk audit cepat.
              </p>

              <div className="relative mb-4">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={loginQuery}
                  onChange={(e) => setLoginQuery(e.target.value)}
                  placeholder="Cari user / role / unit / IP..."
                  className="pl-9"
                />
              </div>

              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead className="text-gray-700 border-b bg-gray-50">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Login</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogins.slice(0, TOP_N).map((l) => (
                      <tr key={l.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-medium text-gray-900">{l.user_name}</div>
                          <div className="text-xs text-gray-500">IP: {l.ip_address || "—"}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-gray-900">{l.role_name || "—"}</div>
                          <div className="text-xs text-gray-500">{l.unit_name || "—"}</div>
                        </td>
                        <td className="p-3">{fmtDate(l.login_time)}</td>
                        <td className="p-3">
                          <span
                            className={cx(
                              "px-2 py-1 rounded text-xs",
                              l.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-200 text-gray-700"
                            )}
                          >
                            {l.status === "active" ? "aktif" : "nonaktif"}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!filteredLogins.length && (
                      <tr>
                        <td className="p-6 text-center text-gray-500" colSpan={4}>
                          Tidak ada data yang cocok.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Menampilkan Top {TOP_N}. Gunakan pencarian untuk mempersempit hasil.
              </div>
            </Card>

            <Card className="p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Antrian (Top 10)</h2>
                  <p className="text-sm text-gray-500">
                    Approval inbox & review queue (butuh akses approve).
                  </p>
                </div>
                <Badge className={canApprove ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}>
                  {canApprove ? "Approve Aktif" : "Tanpa Akses"}
                </Badge>
              </div>

              {!canApprove ? (
                <div className="mt-4 text-sm text-gray-500">
                  Tidak ditampilkan karena role kamu tidak punya <b>can_approve</b>.
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <div className="rounded-lg border p-4">
                    <div className="font-semibold text-gray-900">Approval Master</div>
                    <div className="text-xs text-gray-500 mb-3">Master menunggu persetujuan</div>

                    {!data?.queues?.approvalInbox?.length ? (
                      <div className="text-sm text-gray-500">Tidak ada approval pending.</div>
                    ) : (
                      <div className="space-y-2">
                        {data.queues.approvalInbox.slice(0, TOP_N).map((a) => (
                          <div
                            key={a.approval_id}
                            className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50"
                          >
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{a.rcsa_name}</div>
                              <div className="text-xs text-gray-500">
                                Pembuat: {a.created_by_name || "—"} • {fmtDate(a.created_at)}
                              </div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 whitespace-nowrap">
                              pending
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="font-semibold text-gray-900">Review Assessment</div>
                    <div className="text-xs text-gray-500 mb-3">Assessment submitted menunggu review</div>

                    {!data?.queues?.reviewQueue?.length ? (
                      <div className="text-sm text-gray-500">Tidak ada antrian review.</div>
                    ) : (
                      <div className="space-y-2">
                        {data.queues.reviewQueue.slice(0, TOP_N).map((r) => (
                          <div
                            key={r.id}
                            className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50"
                          >
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {r.potensi_risiko || "—"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {r.unit_name} • {fmtDate(r.updated_at)}
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 whitespace-nowrap">
                              submitted
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
