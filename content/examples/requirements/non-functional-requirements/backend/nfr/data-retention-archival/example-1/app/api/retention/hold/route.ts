import { store } from "@/lib/retentionStore";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const HoldSchema = z.object({ userId: z.string().min(1), enabled: z.boolean() }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = HoldSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  store.setLegalHold(parsed.data.userId, parsed.data.enabled);
  return jsonOk({ ok: true });
}

