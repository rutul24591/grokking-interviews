import { z } from "zod";
import { NextResponse } from "next/server";
import { jsonError, jsonOk } from "@/lib/http";
import { ConsentSchema, cookieName, decodeConsent, encodeConsent } from "@/lib/consent";

const UpdateSchema = z.object({
  analytics: z.boolean(),
  marketing: z.boolean()
});

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const raw = cookie
    .split(";")
    .map((p) => p.trim())
    .find((p) => p.startsWith(cookieName() + "="))
    ?.split("=")[1];
  const consent = decodeConsent(raw);
  return jsonOk({ ok: true, consent });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }

  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });

  const consent = ConsentSchema.parse({ version: 1, ...parsed.data });
  const value = encodeConsent(consent);

  const res = NextResponse.json({ ok: true, consent });
  res.cookies.set(cookieName(), value, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 180
  });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

