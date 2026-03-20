type Token = { id: string; family: string; revoked: boolean };

class RefreshTokenService {
  private tokens = new Map<string, Token>();
  private revokedFamilies = new Set<string>();

  issueInitial(): Token {
    const family = "fam_" + Math.random().toString(16).slice(2);
    const t = { id: "rt_" + Math.random().toString(16).slice(2), family, revoked: false };
    this.tokens.set(t.id, t);
    return t;
  }

  rotate(oldId: string): { ok: true; token: Token } | { ok: false; reason: string } {
    const old = this.tokens.get(oldId);
    if (!old) return { ok: false, reason: "unknown_token" };
    if (this.revokedFamilies.has(old.family)) return { ok: false, reason: "family_revoked" };
    if (old.revoked) {
      // Reuse detected => revoke entire family.
      this.revokedFamilies.add(old.family);
      return { ok: false, reason: "reuse_detected_family_revoked" };
    }

    old.revoked = true;
    const next: Token = { id: "rt_" + Math.random().toString(16).slice(2), family: old.family, revoked: false };
    this.tokens.set(next.id, next);
    return { ok: true, token: next };
  }
}

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

const svc = new RefreshTokenService();
const t1 = svc.issueInitial();
const r2 = svc.rotate(t1.id);
assert(r2.ok, "first rotation should succeed");

// Reuse of t1 after rotation => revoke family.
const reuse = svc.rotate(t1.id);
assert(!reuse.ok && reuse.reason.includes("reuse_detected"), "reuse should be detected");

// Even the current token is now invalid due to family revocation.
const after = svc.rotate(r2.token.id);
assert(!after.ok && after.reason === "family_revoked", "family revocation should block further rotations");

console.log(JSON.stringify({ ok: true }, null, 2));

