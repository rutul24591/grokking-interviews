import { NextResponse } from "next/server";
import { z } from "zod";
import { canExecute } from "@/lib/policy";
import { executeChange, getChange, getFreeze } from "@/lib/store";

const BodySchema = z.object({ actor: z.string().default("deployer") });

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = BodySchema.parse(await req.json().catch(() => ({})));
  const c = getChange(id);
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const freeze = getFreeze();
  const decision = canExecute({
    freezeEnabled: freeze.enabled,
    emergency: c.emergency,
    approvals: c.approvals.length,
    risk: c.risk,
  });
  if (!decision.ok) return NextResponse.json({ ok: false, blocked: decision }, { status: 409 });

  executeChange(id, body.actor);
  return NextResponse.json({ ok: true, change: getChange(id) });
}

