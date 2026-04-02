import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { submit } from "@/lib/workQueue";

const BodySchema = z.object({ ms: z.number().int().min(50).max(5000).default(800) });

export async function POST(req: Request) {
  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    // allow empty body
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });

  const out = submit(parsed.data.ms);
  if (!out.accepted) {
    return jsonError(429, "backpressure", { reason: out.reason }, { "Retry-After": "2" });
  }
  return jsonOk({ ok: true, jobId: out.jobId });
}

