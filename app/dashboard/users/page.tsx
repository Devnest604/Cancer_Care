"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useUsers } from "@/hooks/useUsers";
import UserTable from "@/components/UserTable";
import UserFormModal from "@/components/UserFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { createUser, updateUser, deleteUser } from "@/lib/api";
import { AppUser } from "@/types/user";

export default function UsersPage() {
  const { users, loading } = useUsers();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [deleting, setDeleting] = useState<AppUser | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Caretaker accounts created here can sign in immediately from the
          mobile app.
        </p>
        <button
          onClick={() => setShowAdd(true)}
          className="focus-ring flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Plus size={16} />
          Add caretaker
        </button>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-400">Loading users…</p>
      ) : (
        <UserTable users={users} onEdit={setEditing} onDelete={setDeleting} />
      )}

      {showAdd && (
        <UserFormModal
          mode="add"
          onClose={() => setShowAdd(false)}
          onSubmit={async (values) => {
            await createUser({
              name: values.name,
              email: values.email,
              password: values.password!,
            });
            toast.success(`${values.name} was added as a caretaker`);
          }}
        />
      )}

      {editing && (
        <UserFormModal
          mode="edit"
          user={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (values) => {
            await updateUser(editing.id, {
              name: values.name,
              email: values.email,
            });
            toast.success("Changes saved");
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete ${deleting.name}?`}
          description="This permanently removes their login and all stored data. This can't be undone."
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            try {
              await deleteUser(deleting.id);
              toast.success(`${deleting.name} was deleted`);
            } catch (err) {
              toast.error((err as Error).message);
            } finally {
              setDeleting(null);
            }
          }}
        />
      )}
    </div>
  );
}
