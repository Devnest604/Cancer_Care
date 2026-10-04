"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useUsers } from "@/hooks/useUsers";
import { formatWatchTime } from "@/utils/format";

const DAY_MS = 24 * 60 * 60 * 1000;

export default function AnalyticsPage() {
  const { users, loading } = useUsers();

  // Watch-time and growth activity is derived from each user's lastWatched /
  // createdAt timestamps, bucketed by day. Because watchTimeSeconds is a
  // running total (not per-session), this approximates daily activity by
  // whether a user was active that day rather than exact per-day seconds —
  // for exact per-day totals, log each session to a separate Firestore
  // collection from the Flutter app and aggregate that here instead.
  const { dailyActivity, growth, topUsers } = useMemo(() => {
    const now = Date.now();
    const days = Array.from({ length: 14 }).map((_, i) => {
      const start = now - (13 - i) * DAY_MS;
      return { label: new Date(start).toLocaleDateString(undefined, { month: "short", day: "numeric" }), start };
    });

    const dailyActivity = days.map((d) => ({
      day: d.label,
      activeUsers: users.filter(
        (u) => u.lastWatched && u.lastWatched >= d.start && u.lastWatched < d.start + DAY_MS
      ).length,
    }));

    let cumulative = 0;
    const sortedByCreation = [...users].sort((a, b) => a.createdAt - b.createdAt);
    const growth = days.map((d) => {
      cumulative = sortedByCreation.filter((u) => u.createdAt <= d.start + DAY_MS).length;
      return { day: d.label, users: cumulative };
    });

    const topUsers = [...users]
      .sort((a, b) => b.watchTimeSeconds - a.watchTimeSeconds)
      .slice(0, 10);

    return { dailyActivity, growth, topUsers };
  }, [users]);

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-400">Loading analytics…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Active Caretakers (Last 14 Days)">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6eaf1" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f6f8fb" }} />
              <Bar dataKey="activeUsers" fill="#2568e8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="User Growth">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6eaf1" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#1a4fc2" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Most Active Caretakers">
        <ol className="divide-y divide-surface-border">
          {topUsers.map((u, i) => (
            <li key={u.id} className="flex items-center justify-between py-2.5 text-sm">
              <span className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs font-semibold text-slate-500">
                  {i + 1}
                </span>
                <span className="font-medium text-slate-800">{u.name}</span>
              </span>
              <span className="text-slate-500">{formatWatchTime(u.watchTimeSeconds)}</span>
            </li>
          ))}
          {topUsers.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">No watch data yet.</p>
          )}
        </ol>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-surface-border bg-surface-card p-5 shadow-soft">
      <h2 className="mb-3 font-display text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}
