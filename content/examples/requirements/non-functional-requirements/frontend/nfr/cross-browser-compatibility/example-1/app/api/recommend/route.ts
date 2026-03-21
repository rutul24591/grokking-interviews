import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { recommend } from "@/lib/recommend";

const BodySchema = z.object({
  capabilities: z.object({
    intersectionObserver: z.boolean(),
    resizeObserver: z.boolean(),
    intl: z.boolean(),
    webCrypto: z.boolean(),
    broadcastChannel: z.boolean(),
  }),
});

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type");
  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");
  return jsonOk({ ok: true, recommendations: recommend(body.data.capabilities) });
}

