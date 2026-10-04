"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppUser } from "@/types/user";
import { formatWatchTime, formatDate, formatDateTime } from "@/utils/format";
import { ArrowLeft, Mail, Clock, Calendar, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", id), (snap) => {
      if (!snap.exists()) {
        setUser(null);
      } else {
        const data = snap.data();
        setUser({
          id: snap.id,
          name: data.name ?? "",
          email: data.email ?? "",
          role: data.role ?? "caretaker",
          watchTimeSeconds: data.watchTimeSeconds ?? 0,
          createdAt: data.createdAt?.toMillis?.() ?? 0,
          lastWatched: data.lastWatched?.toMillis?.() ?? null,
        });
      }
      setLoading(false);
    });
    return unsub;
  }, [id]);

  if (loading) {
    return <p className="py-10 text-center text-sm text-slate-400">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-slate-500">This user doesn&apos;t exist anymore.</p>
        <button
          onClick={() => router.push("/dashboard/users")}
          className="focus-ring mt-3 text-sm font-medium text-brand-600"
        >
          ← Back to users
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Link
        href="/dashboard/users"
        className="focus-ring inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} />
        Back to users
      </Link>

      <div className="rounded-xl2 border border-surface-border bg-surface-card p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-xl font-semibold text-brand-700">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              {user.name}
            </h2>
            <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium capitalize text-brand-700">
              {user.role}
            </span>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailRow icon={Mail} label="Email" value={user.email} />
          <DetailRow
            icon={Clock}
            label="Total Watch Time"
            value={formatWatchTime(user.watchTimeSeconds)}
          />
          <DetailRow
            icon={Calendar}
            label="Created"
            value={formatDate(user.createdAt)}
          />
          <DetailRow
            icon={PlayCircle}
            label="Last Watched"
            value={formatDateTime(user.lastWatched)}
          />
        </dl>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-slate-400">
        <Icon size={15} />
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </dt>
        <dd className="text-sm font-medium text-slate-800">{value}</dd>
      </div>
    </div>
  );
}
