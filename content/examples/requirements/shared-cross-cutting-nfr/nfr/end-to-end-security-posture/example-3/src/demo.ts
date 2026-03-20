import { TokenSigner, type Key } from "./signer.js";

function assert(condition: unknown, msg: string): asserts condition {
  if (!condition) throw new Error(msg);
}

function nowSec(nowMs = Date.now()) {
  return Math.floor(nowMs / 1000);
}

const k1: Key = { kid: "k1", secret: new TextEncoder().encode("old-secret") };
const k2: Key = { kid: "k2", secret: new TextEncoder().encode("new-secret") };

const signer = new TokenSigner("k1", [k1]);

const t0 = nowSec();
const tokenOld = signer.sign({
  sub: "user_123",
  aud: "secure-notes",
  iss: "secure-notes-auth",
  iat: t0,
  exp: t0 + 60,
});

const v0 = signer.verify(tokenOld, t0);
assert(v0.ok, "token signed with k1 should verify with k1 present");

// Rotation stage 1: add new key, switch signing key, but keep old key for verification.
signer.addKey(k2);
signer.setCurrentKid("k2");

const tokenNew = signer.sign({
  sub: "user_123",
  aud: "secure-notes",
  iss: "secure-notes-auth",
  iat: t0,
  exp: t0 + 60,
});

assert(signer.verify(tokenOld, t0).ok, "old token should still verify during overlap");
assert(signer.verify(tokenNew, t0).ok, "new token should verify");

// Rotation stage 2: remove old key after max token TTL.
signer.removeKey("k1");
const v1 = signer.verify(tokenOld, t0);
assert(!v1.ok && v1.reason === "unknown_kid", "old token should fail once k1 is removed");

const v2 = signer.verify(tokenNew, t0);
assert(v2.ok, "new token should keep working");

// Expiry is still enforced independently of rotation.
const vExpired = signer.verify(tokenNew, t0 + 120);
assert(!vExpired.ok && vExpired.reason === "expired", "expired tokens should be rejected");

console.log(JSON.stringify({ ok: true }, null, 2));

