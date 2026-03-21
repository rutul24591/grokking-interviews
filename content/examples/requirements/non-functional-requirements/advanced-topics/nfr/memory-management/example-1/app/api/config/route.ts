import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore, type Mode } from "@/lib/store";

const BodySchema = z.object({
  mode: z.enum(["none", "leaky", "lru"]),
});

export async function GET() {
  const store = getStore();
  return NextResponse.json({
    mode: store.mode,
    leakSize: store.leak.size,
    lruSize: store.lru.size,
    lruBytes: store.lru.bytes,
  });
}

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const store = getStore();
  store.mode = body.mode as Mode;
  return NextResponse.json({ ok: true, mode: store.mode });
}

