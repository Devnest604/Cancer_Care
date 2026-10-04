export type UserRole = "admin" | "caretaker";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  watchTimeSeconds: number;
  createdAt: number; // ms epoch, converted from Firestore Timestamp
  lastWatched: number | null;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}
