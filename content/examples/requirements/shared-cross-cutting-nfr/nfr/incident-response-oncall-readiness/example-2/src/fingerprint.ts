import { createHash } from "node:crypto";

export function fingerprint(fields: Record<string, string>) {
  const stable = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("|");
  return createHash("sha256").update(stable).digest("hex").slice(0, 16);
}

