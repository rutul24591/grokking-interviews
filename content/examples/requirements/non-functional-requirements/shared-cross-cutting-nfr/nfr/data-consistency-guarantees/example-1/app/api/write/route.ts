import { NextResponse } from "next/server";
import { z } from "zod";
import { write } from "@/lib/store";

const BodySchema = z.object({
  sessionId: z.string().min(1),
  value: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const v = write(body.sessionId, body.value);
  return NextResponse.json({ ok: true, value: v });
}

