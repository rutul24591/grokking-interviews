import { NextResponse } from "next/server";
import { z } from "zod";
import { simulateAvailability } from "@/lib/simulate";

const BodySchema = z.object({
  composition: z.enum(["serial", "parallel"]),
  components: z.array(z.object({ name: z.string(), availability: z.number().min(0).max(1) })).min(1),
  trials: z.number().int().min(100).max(20000).default(3000),
  correlatedDownPct: z.number().min(0).max(1).default(0),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const r = simulateAvailability(body);
  return NextResponse.json(r);
}

