import { NextResponse } from "next/server";
import { z } from "zod";
import { addAudit, dsarDelete } from "@/lib/store";

const BodySchema = z.object({
  actor: z.string().min(1).default("privacy"),
  userId: z.string().min(1),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const ok = dsarDelete(body.userId);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  addAudit({ ts: new Date().toISOString(), actor: body.actor, userId: body.userId, purpose: "dsar_delete", action: "delete" });
  return NextResponse.json({ ok: true });
}

