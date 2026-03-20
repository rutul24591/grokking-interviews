import { NextResponse } from "next/server";
import { stopExperiment } from "@/lib/store";

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const exp = await stopExperiment(id);
    return NextResponse.json(exp, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "failed_to_stop";
    return NextResponse.json({ error: message }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
}

