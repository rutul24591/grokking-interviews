import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";

const BodySchema = z.object({
  strategy: z.enum(["invalidation", "versioned"]),
  ttlMs: z.number().int().min(100).max(30_000),
});

export async function GET() {
  const s = getStore();
  return NextResponse.json({ strategy: s.strategy, ttlMs: s.ttlMs });
}

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const s = getStore();
  s.strategy = body.strategy;
  s.ttlMs = body.ttlMs;
  return NextResponse.json({ ok: true });
}

