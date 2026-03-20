const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlEncode(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padLength = (4 - (value.length % 4)) % 4;
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);
  return base64ToBytes(padded);
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a[i] ^ b[i];
  return out === 0;
}

async function importKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export type SessionPayload = {
  sub: string;
  iat: number;
};

export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const body = encoder.encode(JSON.stringify(payload));
  const key = await importKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, body));
  return `${base64UrlEncode(body)}.${base64UrlEncode(sig)}`;
}

export async function verifySession(value: string, secret: string): Promise<SessionPayload | null> {
  const [b64Body, b64Sig] = value.split(".", 2);
  if (!b64Body || !b64Sig) return null;

  const body = base64UrlDecode(b64Body);
  const sig = base64UrlDecode(b64Sig);

  const key = await importKey(secret);
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, body));
  if (!timingSafeEqual(sig, expected)) return null;

  try {
    const parsed = JSON.parse(decoder.decode(body)) as SessionPayload;
    if (!parsed?.sub || typeof parsed.iat !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

