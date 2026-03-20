import { jsonError, jsonOk } from "@/lib/http";
import { loadProfile, profileCache } from "@/lib/cache";
import { z } from "zod";

const QuerySchema = z.object({ userId: z.string().min(1).max(64) });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({ userId: url.searchParams.get("userId") ?? "" });
  if (!parsed.success) return jsonError(400, "invalid_query", { issues: parsed.error.issues });

  const res = await profileCache.getOrCompute(`profile:${parsed.data.userId}`, () => loadProfile(parsed.data.userId));
  return jsonOk({ ok: true, profile: res.value, cache: res.cache, computeCount: profileCache.computeCount });
}

