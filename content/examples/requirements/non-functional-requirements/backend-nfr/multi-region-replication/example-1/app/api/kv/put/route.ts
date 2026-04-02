import { kv, type Region } from "@/lib/multiRegionKv";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const PutSchema = z
  .object({
    region: z.enum(["us-east", "eu-west"]),
    key: z.string().min(1).max(64),
    value: z.string().min(1).max(256),
    sessionId: z.string().min(1).optional()
  })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = PutSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  const { region, key, value, sessionId } = parsed.data;
  const result = kv.put(region as Region, key, value, sessionId);
  return jsonOk({ ok: true, ...result, sessionId: sessionId || null });
}

