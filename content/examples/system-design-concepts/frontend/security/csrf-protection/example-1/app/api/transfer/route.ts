import { cookies } from "next/headers";
import { z } from "zod";
import { isAllowedOrigin, timingSafeEquals } from "../../../lib/csrf";
import { randomUUID } from "node:crypto";

const bodySchema = z.object({
  to: z.string().min(3).max(64),
  amount: z.number().positive().max(10_000)
});

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return Response.json({ error: "Bad origin" }, { status: 403 });

  const csrfCookie = (await cookies()).get("csrf")?.value;
  const csrfHeader = req.headers.get("x-csrf-token");
  if (!csrfCookie || !csrfHeader || !timingSafeEquals(csrfCookie, csrfHeader)) {
    return Response.json({ error: "CSRF token missing/invalid" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: parsed.error.message }, { status: 400 });

  return Response.json({
    ok: true,
    transferId: `tr_${randomUUID()}`,
    to: parsed.data.to,
    amount: parsed.data.amount
  });
}

