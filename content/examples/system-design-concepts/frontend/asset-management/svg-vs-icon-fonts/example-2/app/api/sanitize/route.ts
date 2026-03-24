import { NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeSvg } from "@/lib/sanitizeSvg";

const BodySchema = z.object({
  svg: z.string().min(1).max(50_000),
});

export async function POST(request: Request) {
  const body = BodySchema.parse(await request.json());
  return NextResponse.json({ sanitized: sanitizeSvg(body.svg) });
}

