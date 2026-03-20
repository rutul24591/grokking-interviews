import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";

const BodySchema = z.object({
  maxP95TtfbMs: z.number().int().min(10).max(5000),
  maxP95LongTaskMs: z.number().int().min(10).max(5000),
  maxP95Bytes: z.number().int().min(1000).max(5_000_000),
});

export async function GET() {
  return NextResponse.json(getStore().budgets);
}

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  getStore().budgets = body;
  return NextResponse.json({ ok: true, budgets: body });
}

