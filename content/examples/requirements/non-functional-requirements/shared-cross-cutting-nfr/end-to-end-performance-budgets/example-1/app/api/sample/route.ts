import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";

const BodySchema = z.object({
  route: z.string().min(1).default("/"),
  ttfbMs: z.number().min(0).max(30_000),
  longTaskMs: z.number().min(0).max(30_000),
  bytes: z.number().int().min(0).max(10_000_000),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const store = getStore();
  store.samples.push({ ...body, ts: new Date().toISOString() });
  if (store.samples.length > 5000) store.samples.splice(0, store.samples.length - 5000);
  return NextResponse.json({ ok: true, count: store.samples.length });
}

