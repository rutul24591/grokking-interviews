import { createHmac, randomBytes } from "node:crypto";

function b64url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function fromB64url(input: string) {
  return Buffer.from(input, "base64url").toString("utf-8");
}

type Key = { kid: string; secret: string; createdAt: string };

class Keyring {
  private keys = new Map<string, Key>();
  private currentKid: string;

  constructor() {
    const initial = process.env.TOKEN_SECRET || randomBytes(32).toString("hex");
    const kid = "k1";
    this.keys.set(kid, { kid, secret: initial, createdAt: new Date().toISOString() });
    this.currentKid = kid;
  }

  rotate() {
    const nextNum = this.keys.size + 1;
    const kid = `k${nextNum}`;
    this.keys.set(kid, { kid, secret: randomBytes(32).toString("hex"), createdAt: new Date().toISOString() });
    this.currentKid = kid;

    // Keep only last 3 keys (grace window).
    const allKids = [...this.keys.keys()].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
    while (allKids.length > 3) {
      const evict = allKids.shift()!;
      this.keys.delete(evict);
    }

    return { kid: this.currentKid, activeKids: [...this.keys.keys()].sort() };
  }

  issue(sub: string) {
    const kid = this.currentKid;
    const payload = { sub, iat: Date.now() };
    const payloadB64 = b64url(JSON.stringify(payload));
    const sig = this.sign(kid, payloadB64);
    return { token: `${kid}.${payloadB64}.${sig}`, kid };
  }

  verify(token: string) {
    const parts = token.split(".");
    if (parts.length !== 3) return { ok: false as const, error: "invalid_format" as const };
    const [kid, payloadB64, sig] = parts as [string, string, string];
    if (!this.keys.has(kid)) return { ok: false as const, error: "unknown_kid" as const };
    const expected = this.sign(kid, payloadB64);
    if (expected !== sig) return { ok: false as const, error: "bad_signature" as const };
    const payload = JSON.parse(fromB64url(payloadB64)) as { sub: string; iat: number };
    return { ok: true as const, payload, kid };
  }

  private sign(kid: string, payloadB64: string) {
    const secret = this.keys.get(kid)!.secret;
    return createHmac("sha256", secret).update(payloadB64).digest("base64url");
  }
}

export const keyring = new Keyring();

