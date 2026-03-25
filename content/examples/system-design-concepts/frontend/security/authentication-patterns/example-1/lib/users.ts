export type User = { userId: string; username: string; roles: string[] };

const USERS: Array<User & { password: string }> = [
  { userId: "u1", username: "alice", password: "password", roles: ["admin"] },
  { userId: "u2", username: "bob", password: "password", roles: ["reader"] }
];

export function authenticate(username: string, password: string): User | null {
  const u = USERS.find((x) => x.username === username && x.password === password);
  if (!u) return null;
  return { userId: u.userId, username: u.username, roles: u.roles };
}

