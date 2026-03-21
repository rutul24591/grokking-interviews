import { NextResponse } from "next/server";
import { z } from "zod";
import { redact } from "@/lib/policy";
import { addAudit, getProfile } from "@/lib/store";

const BodySchema = z.object({
  actor: z.string().min(1).default("svc"),
  userId: z.string().min(1),
  purpose: z.enum(["support", "billing", "analytics"]),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const p = getProfile(body.userId);
  if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });
  addAudit({ ts: new Date().toISOString(), actor: body.actor, userId: body.userId, purpose: body.purpose, action: "read" });
  return NextResponse.json({ data: redact(p, body.purpose) });
}

