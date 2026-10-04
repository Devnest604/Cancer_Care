"use client";

import { useMemo } from "react";
import { Users, Activity, Clock, TrendingUp, UserPlus } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import StatCard from "@/components/StatCard";
import { formatWatchTime, formatDateTime } from "@/utils/format";
import Link from "next/link";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function DashboardPage() {
  const { users, loading } = useUsers();

  const stats = useMemo(() => {
    const now = Date.now();
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ).getTime();

    const totalWatch = users.reduce((sum, u) => sum + u.watchTimeSeconds, 0);
    const activeUsers = users.filter(
      (u) => u.lastWatched && now - u.lastWatched < WEEK_MS
    );
    const newThisMonth = users.filter((u) => u.createdAt >= startOfMonth);

    return {
      total: users.length,
      active: activeUsers.length,
      totalWatch,
      avgWatch: users.length ? totalWatch / users.length : 0,
      newThisMonth: newThisMonth.length,
    };
  }, [users]);

  const recentlyWatched = useMemo(
    () =>
      [...users]
        .filter((u) => u.lastWatched)
        .sort((a, b) => (b.lastWatched ?? 0) - (a.lastWatched ?? 0))
        .slice(0, 6),
    [users]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Users" value={String(stats.total)} icon={Users} />
        <StatCard
          label="Active This Week"
          value={String(stats.active)}
          icon={Activity}
          accent="emerald"
        />
        <StatCard
          label="Total Watch Time"
          value={formatWatchTime(stats.totalWatch)}
          icon={Clock}
          accent="amber"
        />
        <StatCard
          label="Avg. Watch Time"
          value={formatWatchTime(stats.avgWatch)}
          icon={TrendingUp}
        />
        <StatCard
          label="New This Month"
          value={String(stats.newThisMonth)}
          icon={UserPlus}
          accent="slate"
        />
      </div>

      <div className="rounded-xl2 border border-surface-border bg-surface-card p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-slate-900">
            Recent Activity
          </h2>
          <Link
            href="/dashboard/users"
            className="focus-ring text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all users →
          </Link>
        </div>

        {loading && (
          <p className="py-6 text-center text-sm text-slate-400">Loading…</p>
        )}

        {!loading && recentlyWatched.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400">
            No activity yet — activity appears here once caretakers start
            watching videos in the app.
          </p>
        )}

        <ul className="divide-y divide-surface-border">
          {recentlyWatched.map((u) => (
            <li key={u.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                  {u.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <p className="text-sm text-slate-700">
                  <span className="font-medium text-slate-900">{u.name}</span>{" "}
                  watched an educational video
                </p>
              </div>
              <span className="text-xs text-slate-400">
                {formatDateTime(u.lastWatched)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
