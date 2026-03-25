import { webcrypto } from "node:crypto";

const subtle = webcrypto.subtle;

const enc = new TextEncoder();
const dec = new TextDecoder();

async function deriveKey(passphrase, salt) {
  const baseKey = await subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encrypt(passphrase, plaintext) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const ct = await subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  return { salt: Buffer.from(salt).toString("base64"), iv: Buffer.from(iv).toString("base64"), ct: Buffer.from(ct).toString("base64") };
}

async function decrypt(passphrase, blob) {
  const salt = Uint8Array.from(Buffer.from(blob.salt, "base64"));
  const iv = Uint8Array.from(Buffer.from(blob.iv, "base64"));
  const key = await deriveKey(passphrase, salt);
  const pt = await subtle.decrypt({ name: "AES-GCM", iv }, key, Buffer.from(blob.ct, "base64"));
  return dec.decode(pt);
}

const pass = "correct-horse-battery-staple";
const blob = await encrypt(pass, "secret offline note");
process.stdout.write(`encrypted: ${JSON.stringify(blob)}\n`);
process.stdout.write(`decrypted: ${await decrypt(pass, blob)}\n`);

