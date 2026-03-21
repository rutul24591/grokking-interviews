import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { send } from "@/lib/store";

const BodySchema = z.object({
  clientId: z.string().min(1),
  opId: z.string().min(1),
  message: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type");
  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");
  const r = send(body.data.clientId, body.data.opId, body.data.message);
  return jsonOk({ ok: true, duplicate: r.duplicate });
}

