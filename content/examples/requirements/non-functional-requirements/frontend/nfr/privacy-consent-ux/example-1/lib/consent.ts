import { z } from "zod";

export const ConsentSchema = z.object({
  version: z.literal(1),
  analytics: z.boolean(),
  marketing: z.boolean()
});

export type Consent = z.infer<typeof ConsentSchema>;

const COOKIE = "consent";

function base64urlEncode(s: string) {
  return Buffer.from(s, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64urlDecode(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64").toString("utf8");
}

export function encodeConsent(consent: Consent) {
  return `v1.${base64urlEncode(JSON.stringify(consent))}`;
}

export function decodeConsent(raw: string | undefined | null): Consent | null {
  if (!raw) return null;
  const [v, payload] = raw.split(".", 2);
  if (v !== "v1" || !payload) return null;
  try {
    const json = JSON.parse(base64urlDecode(payload)) as unknown;
    const parsed = ConsentSchema.safeParse(json);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function cookieName() {
  return COOKIE;
}

