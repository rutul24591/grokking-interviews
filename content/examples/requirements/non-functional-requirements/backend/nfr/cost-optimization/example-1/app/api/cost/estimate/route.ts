import { estimateMonthlyCost } from "@/lib/costModel";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const ScenarioSchema = z
  .object({
    monthlyRequests: z.number().int().positive(),
    avgResponseKb: z.number().positive(),
    cacheHitRate: z.number().min(0).max(1),
    originComputeUsdPerMillion: z.number().nonnegative(),
    reservedDiscount: z.number().min(0).max(1),
    cdnEgressUsdPerGb: z.number().nonnegative(),
    storageGb: z.number().nonnegative(),
    storageUsdPerGbMonth: z.number().nonnegative(),
    budgetUsd: z.number().positive()
  })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ScenarioSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  return jsonOk({ ok: true, breakdown: estimateMonthlyCost(parsed.data) });
}

