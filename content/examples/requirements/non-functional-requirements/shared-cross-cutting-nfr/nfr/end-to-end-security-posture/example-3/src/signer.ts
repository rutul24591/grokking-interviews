import crypto from "node:crypto";

function b64urlEncode(buf: Uint8Array): string {
  return Buffer.from(buf)
    .toString("base64")
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}

function b64urlDecode(s: string): Uint8Array {
  const normalized = s.replaceAll("-", "+").replaceAll("_", "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return new Uint8Array(Buffer.from(normalized + pad, "base64"));
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export type Key = { kid: string; secret: Uint8Array };

export type Claims = {
  sub: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
};

export type Verification =
  | { ok: true; claims: Claims; kid: string }
  | { ok: false; reason: "bad_format" | "unknown_kid" | "bad_sig" | "bad_claims" | "expired" };

export class TokenSigner {
  private keys = new Map<string, Key>();

  constructor(private currentKid: string, keys: Key[]) {
    for (const k of keys) this.keys.set(k.kid, k);
  }

  setCurrentKid(kid: string) {
    if (!this.keys.has(kid)) throw new Error(`unknown kid: ${kid}`);
    this.currentKid = kid;
  }

  addKey(k: Key) {
    this.keys.set(k.kid, k);
  }

  removeKey(kid: string) {
    this.keys.delete(kid);
  }

  sign(claims: Claims): string {
    const key = this.keys.get(this.currentKid);
    if (!key) throw new Error("missing current key");
    const payloadB64 = b64urlEncode(new TextEncoder().encode(JSON.stringify(claims)));
    const sig = crypto.createHmac("sha256", Buffer.from(key.secret)).update(`${key.kid}.${payloadB64}`).digest();
    return `${key.kid}.${payloadB64}.${b64urlEncode(new Uint8Array(sig))}`;
  }

  verify(token: string, nowSec: number): Verification {
    const parts = token.split(".");
    if (parts.length !== 3) return { ok: false, reason: "bad_format" };
    const [kid, payloadB64, sigB64] = parts as [string, string, string];
    const key = this.keys.get(kid);
    if (!key) return { ok: false, reason: "unknown_kid" };
    const expected = crypto
      .createHmac("sha256", Buffer.from(key.secret))
      .update(`${kid}.${payloadB64}`)
      .digest();
    const actual = b64urlDecode(sigB64);
    if (!timingSafeEqual(new Uint8Array(expected), actual)) return { ok: false, reason: "bad_sig" };

    let claims: Claims;
    try {
      claims = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64))) as Claims;
    } catch {
      return { ok: false, reason: "bad_claims" };
    }

    if (
      !claims ||
      typeof claims.sub !== "string" ||
      typeof claims.iat !== "number" ||
      typeof claims.exp !== "number" ||
      typeof claims.aud !== "string" ||
      typeof claims.iss !== "string"
    ) {
      return { ok: false, reason: "bad_claims" };
    }

    if (claims.exp <= nowSec) return { ok: false, reason: "expired" };
    return { ok: true, claims, kid };
  }
}

