import crypto from "node:crypto";

export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function randomId(bytes = 16): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export async function scryptHash(password: string, saltHex: string): Promise<Uint8Array> {
  const salt = Buffer.from(saltHex, "hex");
  return await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(new Uint8Array(derivedKey));
    });
  });
}

export function hmacSha256(secret: Uint8Array, data: string): Uint8Array {
  return new Uint8Array(crypto.createHmac("sha256", Buffer.from(secret)).update(data).digest());
}

