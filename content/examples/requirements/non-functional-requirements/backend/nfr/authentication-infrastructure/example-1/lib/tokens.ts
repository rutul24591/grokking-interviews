export type TokenRecord = {
  token: string;
  userId: string;
  issuedAt: number;
  expiresAt: number;
  revokedAt: number | null;
};

const tokens = new Map<string, TokenRecord>();

export function issueAccessToken(userId: string, ttlMs: number) {
  const token = "at_" + crypto.randomUUID();
  const now = Date.now();
  const rec: TokenRecord = {
    token,
    userId,
    issuedAt: now,
    expiresAt: now + ttlMs,
    revokedAt: null
  };
  tokens.set(token, rec);
  return rec;
}

export function revokeToken(token: string) {
  const rec = tokens.get(token);
  if (!rec) return false;
  rec.revokedAt = Date.now();
  tokens.set(token, rec);
  return true;
}

export function introspect(token: string) {
  const rec = tokens.get(token);
  if (!rec) return { active: false as const, reason: "unknown_token" as const };
  if (rec.revokedAt) return { active: false as const, reason: "revoked" as const };
  if (Date.now() >= rec.expiresAt) return { active: false as const, reason: "expired" as const };
  return { active: true as const, userId: rec.userId, exp: rec.expiresAt };
}

