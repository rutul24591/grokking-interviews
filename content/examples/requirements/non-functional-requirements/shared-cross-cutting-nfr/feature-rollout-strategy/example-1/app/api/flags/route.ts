import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";

const BodySchema = z.object({
  enabled: z.boolean(),
  rolloutPct: z.number().min(0).max(100),
  killSwitch: z.boolean(),
  salt: z.string().min(1).default("v1"),
});

export async function GET() {
  return NextResponse.json(getStore().flag);
}

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const s = getStore();
  s.flag = { ...s.flag, ...body };
  return NextResponse.json({ ok: true, flag: s.flag });
}

