import { NextResponse } from "next/server";
import { z } from "zod";
import { getStore } from "@/lib/store";

const BodySchema = z.object({
  type: z.enum(["exposure", "error"]),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const s = getStore();
  if (body.type === "exposure") s.metrics.exposures += 1;
  else s.metrics.errors += 1;
  return NextResponse.json({ ok: true });
}

