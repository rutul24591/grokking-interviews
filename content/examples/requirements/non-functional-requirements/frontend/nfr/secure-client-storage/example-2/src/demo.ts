import crypto from "node:crypto";

function seal(plaintext: string, key: Buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("base64"), tag: tag.toString("base64"), data: enc.toString("base64") };
}

function open(payload: { iv: string; tag: string; data: string }, key: Buffer) {
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const data = Buffer.from(payload.data, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(data), decipher.final()]);
  return out.toString("utf8");
}

const key = crypto.randomBytes(32);
const plaintext = JSON.stringify({ theme: "dark", savedAt: Date.now() });
const sealed = seal(plaintext, key);
const opened = open(sealed, key);

console.log(
  JSON.stringify(
    {
      plaintext,
      sealed,
      opened,
      note: [
        "Encryption can protect data at rest against casual local inspection.",
        "It does NOT protect against XSS: if JS can run, it can use the key too.",
        "Use encryption for local PII only with a strong threat model and key strategy."
      ]
    },
    null,
    2,
  ),
);

