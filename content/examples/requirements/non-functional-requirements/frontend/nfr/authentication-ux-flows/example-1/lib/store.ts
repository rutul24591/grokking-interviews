import crypto from "node:crypto";

export type User = { id: string; email: string; passwordSaltHex: string; passwordHashB64: string };
export type Session = { id: string; userId: string; createdAtMs: number; stepUpAtMs: number | null };
export type StepUp = { id: string; sessionId: string; code: string; expiresAtMs: number };

const usersByEmail = new Map<string, User>();
const sessions = new Map<string, Session>();
const stepUps = new Map<string, StepUp>();

function randomHex(bytes: number) {
  return crypto.randomBytes(bytes).toString("hex");
}

async function scryptHash(password: string, saltHex: string): Promise<Uint8Array> {
  const salt = Buffer.from(saltHex, "hex");
  return await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, derived) => {
      if (err) return reject(err);
      resolve(new Uint8Array(derived));
    });
  });
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

async function seed() {
  if (usersByEmail.size) return;
  const email = "staff@example.com";
  const password = "password12345";
  const passwordSaltHex = randomHex(16);
  const derived = await scryptHash(password, passwordSaltHex);
  usersByEmail.set(email, {
    id: randomHex(8),
    email,
    passwordSaltHex,
    passwordHashB64: Buffer.from(derived).toString("base64"),
  });
}

export async function authenticate(email: string, password: string): Promise<User | null> {
  await seed();
  const u = usersByEmail.get(email);
  if (!u) return null;
  const derived = await scryptHash(password, u.passwordSaltHex);
  const expected = new Uint8Array(Buffer.from(u.passwordHashB64, "base64"));
  if (!timingSafeEqual(expected, derived)) return null;
  return u;
}

export function createSession(userId: string): Session {
  const s: Session = { id: randomHex(16), userId, createdAtMs: Date.now(), stepUpAtMs: null };
  sessions.set(s.id, s);
  return s;
}

export function getSession(sessionId: string): Session | null {
  return sessions.get(sessionId) ?? null;
}

export function deleteSession(sessionId: string) {
  sessions.delete(sessionId);
}

export function stepUpIsFresh(s: Session, nowMs = Date.now()): boolean {
  if (!s.stepUpAtMs) return false;
  return nowMs - s.stepUpAtMs <= 5 * 60_000;
}

export function createStepUp(sessionId: string): StepUp {
  const code = String(Math.floor(100_000 + Math.random() * 900_000));
  const st: StepUp = { id: randomHex(12), sessionId, code, expiresAtMs: Date.now() + 3 * 60_000 };
  stepUps.set(st.id, st);
  return st;
}

export function verifyStepUp(sessionId: string, challengeId: string, code: string): boolean {
  const ch = stepUps.get(challengeId);
  if (!ch) return false;
  if (ch.sessionId !== sessionId) return false;
  if (Date.now() > ch.expiresAtMs) return false;
  if (ch.code !== code) return false;
  stepUps.delete(ch.id);
  const s = sessions.get(sessionId);
  if (s) s.stepUpAtMs = Date.now();
  return true;
}

