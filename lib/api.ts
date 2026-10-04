import { auth } from "@/lib/firebase";
import { CreateUserInput, UpdateUserInput } from "@/types/user";

async function authHeader() {
  const token = await auth.currentUser?.getIdToken();
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function createUser(input: CreateUserInput) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: await authHeader(),
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Couldn't create user");
  return data;
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: await authHeader(),
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Couldn't update user");
  return data;
}

export async function deleteUser(id: string) {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: await authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Couldn't delete user");
  return data;
}
