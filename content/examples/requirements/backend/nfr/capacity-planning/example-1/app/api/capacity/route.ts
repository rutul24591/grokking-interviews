import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { plan } from "@/lib/capacity";

const BodySchema = z.object({
  rps: z.number().positive(),
  p95LatencyMs: z.number().positive(),
  cpuMsPerReq: z.number().positive(),
  coresPerInstance: z.number().positive(),
  targetUtilization: z.number().min(0.1).max(0.95),
  headroomPct: z.number().min(0).max(200)
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });
  return jsonOk({ ok: true, input: parsed.data, plan: plan(parsed.data) });
}

