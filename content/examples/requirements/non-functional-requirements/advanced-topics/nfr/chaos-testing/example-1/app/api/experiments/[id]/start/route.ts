import { NextResponse } from "next/server";
import { startExperiment } from "@/lib/store";

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const exp = await startExperiment(id);
    return NextResponse.json(exp, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "failed_to_start";
    return NextResponse.json({ error: message }, { status: 409, headers: { "Cache-Control": "no-store" } });
  }
}

