import crypto from "node:crypto";

export function strongEtag(bytes: Buffer): string {
  const hash = crypto.createHash("sha256").update(bytes).digest("base64url");
  return `"${hash}"`;
}

