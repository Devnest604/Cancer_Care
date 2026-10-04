"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AppUser } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only caretakers show up in user-management views — admin accounts
    // are excluded so they don't appear in the caretaker table/rankings.
    const q = query(collection(db, "users"), where("role", "==", "caretaker"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rows: AppUser[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name ?? "",
            email: data.email ?? "",
            role: data.role ?? "caretaker",
            watchTimeSeconds: data.watchTimeSeconds ?? 0,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
            lastWatched: data.lastWatched?.toMillis?.() ?? null,
          };
        });
        setUsers(rows);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return unsubscribe;
  }, []);

  return { users, loading };
}
