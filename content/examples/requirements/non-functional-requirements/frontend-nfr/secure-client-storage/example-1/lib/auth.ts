type Session = { sid: string; createdAt: number };

const sessions = new Map<string, Session>();
const tokens = new Map<string, string>(); // token -> userId

export function issueSession(userId: string) {
  const sid = "sid_" + crypto.randomUUID();
  sessions.set(sid, { sid, createdAt: Date.now() });
  return { sid, userId };
}

export function issueBearer(userId: string) {
  const token = "t_" + crypto.randomUUID();
  tokens.set(token, userId);
  return { token, userId };
}

export function validateSession(sid: string | null) {
  if (!sid) return null;
  return sessions.get(sid) ? { userId: "user_1" } : null;
}

export function validateBearer(token: string | null) {
  if (!token) return null;
  const userId = tokens.get(token);
  return userId ? { userId } : null;
}

