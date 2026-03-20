import crypto from "node:crypto";

type Key = { kid: string; secret: Buffer; active: boolean };

function sign(payload: string, key: Key) {
  const sig = crypto.createHmac("sha256", key.secret).update(payload).digest("base64url");
  return { kid: key.kid, payload, sig };
}

function verify(token: { kid: string; payload: string; sig: string }, keys: Key[]) {
  const key = keys.find((k) => k.kid === token.kid);
  if (!key) return false;
  const expected = crypto.createHmac("sha256", key.secret).update(token.payload).digest("base64url");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token.sig));
}

const keys: Key[] = [
  { kid: "k1", secret: crypto.randomBytes(32), active: false },
  { kid: "k2", secret: crypto.randomBytes(32), active: true }
];

const active = keys.find((k) => k.active)!;
const token = sign(JSON.stringify({ sub: "user", iat: Date.now() }), active);

console.log(JSON.stringify({ token, verifyWithAll: verify(token, keys), verifyWithOnlyActive: verify(token, [active]) }, null, 2));

