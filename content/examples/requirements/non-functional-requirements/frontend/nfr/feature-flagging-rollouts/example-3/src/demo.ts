import crypto from "node:crypto";

type Config = { rolloutPct: number; killSwitch: boolean; issuedAtSec: number; ttlSec: number };

function sign(secret: string, payload: object): { payloadB64: string; sigB64: string } {
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return { payloadB64, sigB64: sig };
}

function verify(secret: string, payloadB64: string, sigB64: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sigB64));
}

const secret = "dev-secret";
const now = Math.floor(Date.now() / 1000);
const config: Config = { rolloutPct: 25, killSwitch: false, issuedAtSec: now, ttlSec: 60 };
const signed = sign(secret, config);

const okSig = verify(secret, signed.payloadB64, signed.sigB64);
const decoded = JSON.parse(Buffer.from(signed.payloadB64, "base64url").toString("utf8")) as Config;
const okTtl = now <= decoded.issuedAtSec + decoded.ttlSec;

console.log(JSON.stringify({ okSig, okTtl, decoded }, null, 2));
console.log(JSON.stringify({ ok: true }, null, 2));

