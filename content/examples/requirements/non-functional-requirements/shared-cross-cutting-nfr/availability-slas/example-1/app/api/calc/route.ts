import { NextResponse } from "next/server";
import { z } from "zod";
import {
  errorBudgetMinutes,
  expectedDowntimeMinutes,
  parallelAvailability,
  serialAvailability,
} from "@/lib/availability";

const BodySchema = z.object({
  composition: z.enum(["serial", "parallel"]),
  components: z.array(z.object({ name: z.string().min(1), availability: z.number().min(0).max(1) })).min(1),
  slaTarget: z.number().min(0.9).max(0.99999).default(0.999),
  days: z.number().int().min(1).max(31).default(30),
});

export async function POST(req: Request) {
  const body = BodySchema.parse(await req.json());
  const eff =
    body.composition === "serial"
      ? serialAvailability(body.components)
      : parallelAvailability(body.components);

  return NextResponse.json({
    effectiveAvailability: eff,
    expectedDowntimeMinutes: expectedDowntimeMinutes(eff, body.days),
    errorBudgetMinutes: errorBudgetMinutes({ target: body.slaTarget, days: body.days }),
    meetsTarget: eff >= body.slaTarget,
  });
}

