import { log } from "@/lib/eventLog";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const CommitSchema = z.object({ consumerId: z.string().min(1), nextOffset: z.number().int().nonnegative() }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CommitSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  log.commit(parsed.data.consumerId, parsed.data.nextOffset);
  return jsonOk({ ok: true });
}

