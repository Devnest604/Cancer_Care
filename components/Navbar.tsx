"use client";

import { Search, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/users": "Users",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const initials = (user?.email ?? "A")[0].toUpperCase();

  const title =
    TITLES[pathname] ??
    (pathname.startsWith("/dashboard/users") ? "User details" : "Dashboard");

  return (
    <header className="flex items-center justify-between border-b border-surface-border bg-surface-card px-6 py-4">
      <h1 className="font-display text-xl font-semibold text-slate-900">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-surface-border bg-surface px-3 py-2 sm:flex">
          <Search size={15} className="text-slate-400" />
          <input
            placeholder="Search users…"
            className="w-40 border-0 bg-transparent p-0 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />
        </div>

        <button
          aria-label="Notifications"
          className="focus-ring relative rounded-lg p-2 text-slate-500 hover:bg-slate-50"
        >
          <Bell size={18} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
