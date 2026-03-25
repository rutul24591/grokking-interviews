import { randomUUID } from "node:crypto";

export type Session = {
  sessionId: string;
  userId: string;
  username: string;
  roles: string[];
  createdAt: number;
};

// Demo store (process-local). Production: Redis/DB with TTL.
const sessions = new Map<string, Session>();

export function createSession(user: { userId: string; username: string; roles: string[] }): Session {
  const sessionId = randomUUID();
  const s: Session = { sessionId, ...user, createdAt: Date.now() };
  sessions.set(sessionId, s);
  return s;
}

export function getSession(sessionId: string): Session | null {
  return sessions.get(sessionId) ?? null;
}

export function deleteSession(sessionId: string) {
  sessions.delete(sessionId);
}

