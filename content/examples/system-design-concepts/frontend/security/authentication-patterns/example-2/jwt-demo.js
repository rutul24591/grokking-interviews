import { createHmac, timingSafeEqual } from "node:crypto";

const secret = "demo-secret";

function b64url(buf) {
  return Buffer.from(buf).toString("base64url");
}

function sign(input) {
  return createHmac("sha256", secret).update(input, "utf8").digest("base64url");
}

function encode(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(payload));
  const input = `${h}.${p}`;
  const sig = sign(input);
  return `${input}.${sig}`;
}

function decode(token) {
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) throw new Error("bad token");
  const input = `${h}.${p}`;
  const expected = sign(input);
  const a = Buffer.from(s, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new Error("bad signature");
  const payload = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
  return payload;
}

function validateClaims(payload, { issuer, audience, now }) {
  if (payload.iss !== issuer) throw new Error("bad iss");
  if (payload.aud !== audience) throw new Error("bad aud");
  if (typeof payload.exp !== "number" || payload.exp <= now) throw new Error("expired");
  return true;
}

const now = Math.floor(Date.now() / 1000);
const token = encode({ iss: "https://issuer.example", aud: "web", sub: "u1", exp: now + 60 });

process.stdout.write(`token: ${token}\n`);
const payload = decode(token);
process.stdout.write(`payload: ${JSON.stringify(payload)}\n`);
validateClaims(payload, { issuer: "https://issuer.example", audience: "web", now });
process.stdout.write("validated ok\n");

