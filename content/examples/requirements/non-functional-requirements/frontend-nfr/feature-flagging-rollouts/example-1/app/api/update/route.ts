import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { getConfig, update } from "@/lib/store";

const BodySchema = z.object({
  rolloutPct: z.number().min(0).max(100).optional(),
  killSwitch: z.boolean().optional(),
  salt: z.string().min(1).max(32).optional(),
});

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type");
  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");
  update(body.data);
  return jsonOk({ ok: true, config: getConfig() });
}

