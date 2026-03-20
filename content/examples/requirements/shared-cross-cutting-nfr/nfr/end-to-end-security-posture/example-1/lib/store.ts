import { randomId, scryptHash, timingSafeEqual } from "@/lib/security";

export type User = { id: string; email: string; passwordSaltHex: string; passwordHashB64: string };
export type Session = {
  sid: string;
  userId: string;
  csrfToken: string;
  createdAtMs: number;
  expiresAtSec: number;
  revokedAtMs: number | null;
};
export type Note = { id: string; userId: string; title: string; body: string; createdAt: number };

const usersByEmail = new Map<string, User>();
const sessions = new Map<string, Session>();
const notesByUser = new Map<string, Note[]>();

async function seed() {
  if (usersByEmail.size) return;
  const id = randomId(8);
  const email = "staff@example.com";
  const password = "password12345";
  const passwordSaltHex = randomId(16);
  const derived = await scryptHash(password, passwordSaltHex);
  usersByEmail.set(email, {
    id,
    email,
    passwordSaltHex,
    passwordHashB64: Buffer.from(derived).toString("base64"),
  });
}

export async function authenticate(email: string, password: string): Promise<User | null> {
  await seed();
  const user = usersByEmail.get(email);
  if (!user) return null;
  const derived = await scryptHash(password, user.passwordSaltHex);
  const expected = Buffer.from(user.passwordHashB64, "base64");
  if (!timingSafeEqual(new Uint8Array(expected), derived)) return null;
  return user;
}

export function putSession(s: Session) {
  sessions.set(s.sid, s);
}

export function getSession(sid: string): Session | null {
  return sessions.get(sid) ?? null;
}

export function revokeSession(sid: string) {
  const s = sessions.get(sid);
  if (!s) return;
  s.revokedAtMs = Date.now();
}

export function listNotes(userId: string): Note[] {
  return notesByUser.get(userId) ?? [];
}

export function createNote(userId: string, title: string, body: string): Note {
  const note: Note = { id: randomId(8), userId, title, body, createdAt: Date.now() };
  const list = notesByUser.get(userId) ?? [];
  list.unshift(note);
  notesByUser.set(userId, list);
  return note;
}

export function deleteNote(userId: string, id: string): boolean {
  const list = notesByUser.get(userId);
  if (!list) return false;
  const idx = list.findIndex((n) => n.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  return true;
}

