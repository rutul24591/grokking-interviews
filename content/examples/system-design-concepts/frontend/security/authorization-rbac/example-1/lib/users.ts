import type { Role } from "./rbac";

export type User = { userId: string; username: string; role: Role };

const USERS: Array<User & { password: string }> = [
  { userId: "u1", username: "alice", password: "password", role: "admin" },
  { userId: "u2", username: "bob", password: "password", role: "editor" },
  { userId: "u3", username: "carol", password: "password", role: "reader" }
];

export function authenticate(username: string, password: string): User | null {
  const u = USERS.find((x) => x.username === username && x.password === password);
  if (!u) return null;
  return { userId: u.userId, username: u.username, role: u.role };
}

