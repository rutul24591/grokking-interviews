import { NextResponse } from "next/server";
import { z } from "zod";
import { approveChange, getChange } from "@/lib/store";

const BodySchema = z.object({
  actor: z.string().min(1).default("reviewer"),
  role: z.string().min(1).default("eng"),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = BodySchema.parse(await req.json());
  approveChange(id, body.actor, body.role);
  const c = getChange(id);
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, change: c });
}

