import { log } from "@/lib/eventLog";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const AppendSchema = z
  .object({ type: z.string().min(1), payload: z.record(z.string(), z.unknown()).default({}) })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = AppendSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  return jsonOk({ ok: true, event: log.append(parsed.data.type, parsed.data.payload) });
}

