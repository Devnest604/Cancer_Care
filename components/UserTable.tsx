"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";
import { AppUser } from "@/types/user";
import { formatWatchTime, formatDate } from "@/utils/format";

type SortKey = "name" | "watchTimeSeconds" | "createdAt" | "lastWatched";

export default function UserTable({
  users,
  onEdit,
  onDelete,
}: {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onDelete: (user: AppUser) => void;
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = q
      ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
      : users;

    return [...rows].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });
  }, [users, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(-1);
    }
    setPage(1);
  }

  const columns: { key: SortKey | "email" | "actions"; label: string; sortable?: boolean }[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    { key: "watchTimeSeconds", label: "Watch Time", sortable: true },
    { key: "createdAt", label: "Created", sortable: true },
    { key: "lastWatched", label: "Last Watched", sortable: true },
    { key: "actions", label: "" },
  ];

  return (
    <div className="rounded-xl2 border border-surface-border bg-surface-card shadow-soft">
      <div className="flex items-center justify-between border-b border-surface-border p-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email…"
          className="w-64 rounded-lg border border-surface-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <span className="text-xs text-slate-400">
          {filtered.length} caretaker{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-slate-400">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key as SortKey)}
                      className="focus-ring flex items-center gap-1 hover:text-slate-600"
                    >
                      {col.label}
                      <ArrowUpDown size={12} />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((u) => (
              <tr
                key={u.id}
                className="border-b border-surface-border last:border-0 hover:bg-surface/60"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {u.name}
                </td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3 text-slate-700">
                  {formatWatchTime(u.watchTimeSeconds)}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(u.createdAt)}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(u.lastWatched)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/users/${u.id}`}
                      className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-brand-600"
                      aria-label={`View ${u.name}`}
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => onEdit(u)}
                      className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-brand-600"
                      aria-label={`Edit ${u.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(u)}
                      className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${u.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  No caretakers match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4">
        <span className="text-xs text-slate-400">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="focus-ring rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="focus-ring rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
