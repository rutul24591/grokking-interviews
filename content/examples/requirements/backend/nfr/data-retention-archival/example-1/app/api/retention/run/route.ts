import { store } from "@/lib/retentionStore";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const RunSchema = z.object({ nowIso: z.string().datetime().optional() }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = RunSchema.safeParse(body ?? {});
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  const nowMs = parsed.data.nowIso ? new Date(parsed.data.nowIso).getTime() : Date.now();
  return jsonOk({ ok: true, result: store.runRetention(nowMs) });
}

