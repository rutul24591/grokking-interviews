import { NextResponse } from "next/server";
import { resolve } from "@/lib/store";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  resolve(id);
  return NextResponse.json({ ok: true });
}

