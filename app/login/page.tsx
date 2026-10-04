"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Stethoscope, Lock, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { signIn, user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace("/dashboard");
    }
  }, [loading, user, isAdmin, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signIn(email, password);
      // AuthContext re-checks the admin role; the useEffect above redirects
      // once isAdmin resolves. If the account isn't an admin, bounce here.
    } catch (err) {
      toast.error("Couldn't sign in — check your email and password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface">
      {/* Ambient backdrop: a faint waveform, nodding to the app's audio/video
          content and to a pulse-monitor readout — the signature motif. */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] w-full text-brand-100"
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          fillOpacity="0.5"
          d="M0,160 L120,160 L150,60 L180,260 L210,160 L340,160 L370,110 L400,210 L430,160 L1440,160 L1440,0 L0,0 Z"
        />
      </svg>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mb-8 flex items-center gap-2.5">
          <div className="vital-pulse flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Stethoscope size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-slate-900">
              Oral Cancer Awareness
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-600">
              Admin Console
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-xl2 border border-surface-border bg-surface-card p-8 shadow-soft"
        >
          <h1 className="font-display text-2xl font-semibold text-slate-900">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Administrator access only. Caretaker accounts sign in through the
            mobile app.
          </p>

          <label className="mt-6 block text-sm font-medium text-slate-700">
            Email
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-surface-border bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-400">
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.org"
                className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
          </label>

          <label className="mt-4 block text-sm font-medium text-slate-700">
            Password
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-surface-border bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-brand-400">
              <Lock size={16} className="text-slate-400" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="focus-ring mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400">
          Accounts are provisioned by an existing administrator.
        </p>
      </div>
    </div>
  );
}
