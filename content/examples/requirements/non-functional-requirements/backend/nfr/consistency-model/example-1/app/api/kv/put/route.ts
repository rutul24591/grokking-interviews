import { kv } from "@/lib/replicatedKv";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const PutSchema = z
  .object({
    key: z.string().min(1).max(64),
    value: z.string().min(1).max(256),
    sessionId: z.string().min(1).optional()
  })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = PutSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  const result = kv.put(parsed.data.key, parsed.data.value, parsed.data.sessionId);
  return jsonOk({ ok: true, ...result });
}

