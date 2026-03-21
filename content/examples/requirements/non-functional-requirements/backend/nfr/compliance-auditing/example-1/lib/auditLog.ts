import { createHash, createHmac, randomUUID } from "node:crypto";

export type AuditAction = "user.created" | "role.changed";

export type AuditEvent = {
  id: string;
  ts: string;
  actorId: string;
  action: AuditAction;
  resource: { type: "user"; id: string };
  // Store stable identifiers, but avoid raw PII.
  subject: { emailHash: string; role: string };
  prevHash: string;
  hash: string;
};

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function hmacHex(secret: string, input: string) {
  return createHmac("sha256", secret).update(input).digest("hex");
}

function stableEmailHash(email: string) {
  // Deterministic hash for correlation without storing raw email.
  // In production, consider a keyed hash (HMAC) to avoid rainbow-table reversal.
  return sha256Hex(email.trim().toLowerCase());
}

class AuditLog {
  private events: AuditEvent[] = [];

  append(params: {
    actorId: string;
    action: AuditAction;
    userId: string;
    email: string;
    role: string;
  }): AuditEvent {
    const secret = process.env.AUDIT_HMAC_SECRET || "dev-audit-secret";
    const prevHash = this.events.length ? this.events[this.events.length - 1]!.hash : "GENESIS";
    const id = randomUUID();
    const ts = new Date().toISOString();

    const base = {
      id,
      ts,
      actorId: params.actorId,
      action: params.action,
      resource: { type: "user" as const, id: params.userId },
      subject: { emailHash: stableEmailHash(params.email), role: params.role },
      prevHash
    };

    const hash = hmacHex(secret, JSON.stringify(base));
    const event: AuditEvent = { ...base, hash };
    this.events.push(event);
    return event;
  }

  list(limit = 100) {
    return this.events.slice(-limit);
  }

  verify(): { ok: true } | { ok: false; index: number; reason: string } {
    const secret = process.env.AUDIT_HMAC_SECRET || "dev-audit-secret";
    let prevHash = "GENESIS";

    for (let i = 0; i < this.events.length; i++) {
      const e = this.events[i]!;
      if (e.prevHash !== prevHash) return { ok: false, index: i, reason: "prevHash mismatch" };
      const { hash, ...base } = e;
      const expected = hmacHex(secret, JSON.stringify(base));
      if (expected !== hash) return { ok: false, index: i, reason: "hash mismatch" };
      prevHash = hash;
    }

    return { ok: true };
  }
}

export const auditLog = new AuditLog();

