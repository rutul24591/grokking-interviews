import { NextResponse } from "next/server";
import { getExperiment } from "@/lib/store";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const exp = await getExperiment(id);
  if (!exp) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(exp, { headers: { "Cache-Control": "no-store" } });
}

