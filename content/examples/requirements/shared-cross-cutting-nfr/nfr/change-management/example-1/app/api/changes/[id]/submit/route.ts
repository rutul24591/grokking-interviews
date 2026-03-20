import { NextResponse } from "next/server";
import { z } from "zod";
import { getChange, submitChange } from "@/lib/store";

const BodySchema = z.object({ actor: z.string().default("author") });

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = BodySchema.parse(await req.json().catch(() => ({})));
  submitChange(id, body.actor);
  const c = getChange(id);
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, change: c });
}

