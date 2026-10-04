"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { updatePassword, updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.displayName ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfile(user, { displayName: name });
      toast.success("Profile updated");
    } catch {
      toast.error("Couldn't update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingPassword(true);
    try {
      await updatePassword(user, newPassword);
      setNewPassword("");
      toast.success("Password changed");
    } catch {
      toast.error(
        "Couldn't change password — you may need to sign in again first"
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <form
        onSubmit={handleProfileSave}
        className="rounded-xl2 border border-surface-border bg-surface-card p-5 shadow-soft"
      >
        <h2 className="font-display text-base font-semibold text-slate-900">
          Profile
        </h2>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Display name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-surface-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>
        <label className="mt-3 block text-sm font-medium text-slate-700">
          Email
          <input
            disabled
            value={user?.email ?? ""}
            className="mt-1.5 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-slate-400"
          />
        </label>
        <button
          disabled={savingProfile}
          className="focus-ring mt-4 flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {savingProfile && <Loader2 size={14} className="animate-spin" />}
          Save changes
        </button>
      </form>

      <form
        onSubmit={handlePasswordSave}
        className="rounded-xl2 border border-surface-border bg-surface-card p-5 shadow-soft"
      >
        <h2 className="font-display text-base font-semibold text-slate-900">
          Change password
        </h2>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          New password
          <input
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-1.5 w-full rounded-lg border border-surface-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </label>
        <button
          disabled={savingPassword}
          className="focus-ring mt-4 flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {savingPassword && <Loader2 size={14} className="animate-spin" />}
          Update password
        </button>
      </form>

      <button
        onClick={async () => {
          await signOut();
          router.replace("/login");
        }}
        className="focus-ring text-sm font-medium text-red-600 hover:text-red-700"
      >
        Log out
      </button>
    </div>
  );
}
