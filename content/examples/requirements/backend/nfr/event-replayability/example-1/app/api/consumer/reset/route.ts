import { log } from "@/lib/eventLog";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const ResetSchema = z.object({ consumerId: z.string().min(1), toOffset: z.number().int().nonnegative() }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ResetSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  log.reset(parsed.data.consumerId, parsed.data.toOffset);
  return jsonOk({ ok: true });
}

