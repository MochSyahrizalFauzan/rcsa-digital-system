"use client";

import { useMemo, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UserLogin = {
  id: number;
  user_id: number;
  user_name: string;
  login_time: string;
  logout_time: string | null;
  ip_address: string;
  user_agent: string;
  role_name: string;
  unit_name: string;
};

export default function UserLoginHistory({ userLogins }: { userLogins: UserLogin[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return userLogins;

    return userLogins.filter((log) => {
      const haystack = [
        log.user_name,
        String(log.user_id),
        log.role_name,
        log.unit_name,
        log.ip_address,
        log.user_agent,
        formatDate(log.login_time),
        log.logout_time ? formatDate(log.logout_time) : "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [userLogins, query]);

  const totalPages = useMemo(() => {
    if (filtered.length === 0) return 1;
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  // Kalau filter/pageSize berubah dan page jadi out of range, rapikan
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    if (filtered.length === 0) return [];
    const safePage = Math.max(1, Math.min(page, totalPages));
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return filtered.slice(start, end);
  }, [filtered, page, pageSize, totalPages]);

  const showingFrom = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = Math.min(page * pageSize, filtered.length);

  // Render nomor halaman yang "waras" (tanpa numpuk 100 tombol)
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 7; // total tombol angka yang ditampilkan
    const half = Math.floor(maxButtons / 2);

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);

    if (start === 1) {
      end = start + maxButtons - 1;
    } else if (end === totalPages) {
      start = end - maxButtons + 1;
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <Card className="p-6 w-full shadow-md">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">Riwayat Login User</h2>
          <p className="text-sm text-gray-500">
            Aktivitas login dan logout pengguna sistem
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-[360px]">
            <label className="text-xs text-gray-500">Search</label>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari: nama, user id, role, unit, IP, user agent, tanggal..."
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full sm:w-[180px]">
            <label className="text-xs text-gray-500">Rows / page</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {userLogins.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Belum ada riwayat login.
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Tidak ada hasil untuk kata kunci: <span className="font-semibold">{query}</span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-700 border-b">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Login Time</th>
                  <th className="p-3">Logout Time</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">User Agent</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Unit</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">
                      {log.user_name}
                      <div className="text-xs text-gray-500">{log.user_id}</div>
                    </td>
                    <td className="p-3 text-gray-600">{formatDate(log.login_time)}</td>
                    <td className="p-3 text-gray-600">
                      {log.logout_time ? formatDate(log.logout_time) : "—"}
                    </td>
                    <td className="p-3 text-gray-600">{log.ip_address}</td>
                    <td className="p-3 text-gray-600 truncate max-w-[220px]" title={log.user_agent}>
                      {log.user_agent}
                    </td>
                    <td className="p-3">{log.role_name}</td>
                    <td className="p-3">{log.unit_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer: info + pagination */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-medium">{showingFrom}</span>–
              <span className="font-medium">{showingTo}</span> dari{" "}
              <span className="font-medium">{filtered.length}</span>
              {filtered.length !== userLogins.length ? (
                <>
                  {" "}
                  (difilter dari <span className="font-medium">{userLogins.length}</span>)
                </>
              ) : null}
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>

              {pageNumbers[0] !== 1 && (
                <>
                  <Button variant="outline" onClick={() => setPage(1)}>
                    1
                  </Button>
                  <span className="px-1 text-gray-500">…</span>
                </>
              )}

              {pageNumbers.map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}

              {pageNumbers[pageNumbers.length - 1] !== totalPages && (
                <>
                  <span className="px-1 text-gray-500">…</span>
                  <Button variant="outline" onClick={() => setPage(totalPages)}>
                    {totalPages}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
