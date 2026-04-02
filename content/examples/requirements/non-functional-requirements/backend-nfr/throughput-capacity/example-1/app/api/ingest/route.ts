import { batcher } from "@/lib/batcher";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const Schema = z.object({ items: z.array(z.string().min(1)).min(1).max(1000) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  batcher.accept(parsed.data.items);
  return jsonOk({ ok: true, accepted: parsed.data.items.length });
}

