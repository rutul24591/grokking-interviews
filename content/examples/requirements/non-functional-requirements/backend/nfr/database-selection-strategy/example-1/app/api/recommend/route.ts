import { recommend } from "@/lib/recommender";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const ProfileSchema = z
  .object({
    readsPerSecond: z.number().int().nonnegative(),
    writesPerSecond: z.number().int().nonnegative(),
    maxP95LatencyMs: z.number().int().positive(),
    requiresStrongConsistency: z.boolean(),
    needsFullTextSearch: z.boolean(),
    needsGraphQueries: z.boolean(),
    dataSizeGb: z.number().nonnegative(),
    multiRegion: z.boolean()
  })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  return jsonOk({ ok: true, recommendation: recommend(parsed.data) });
}

