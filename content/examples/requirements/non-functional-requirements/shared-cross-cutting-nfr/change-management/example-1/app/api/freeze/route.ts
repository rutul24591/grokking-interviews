import { NextResponse } from "next/server";
import { z } from "zod";
import { freezeUpdate, getFreeze } from "@/lib/store";

const BodySchema = z.object({
  enabled: z.boolean(),
  reason: z.string().default(""),
  until: z.string().nullable().default(null),
  actor: z.string().default("system"),
});

export async function GET() {
  return NextResponse.json(getFreeze());
}

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  freezeUpdate(body);
  return NextResponse.json({ ok: true, freeze: getFreeze() });
}

