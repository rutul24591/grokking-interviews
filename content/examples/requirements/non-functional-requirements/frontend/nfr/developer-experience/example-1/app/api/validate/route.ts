import { z } from "zod";
import { jsonError, jsonOk, requestId } from "@/lib/http";
import { redactObject } from "@/lib/redact";
import { AppConfigSchema, formatZodErrors } from "@/lib/schema";

const BodySchema = z.object({
  config: z.record(z.unknown()),
});

export async function POST(req: Request) {
  const rid = requestId();
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type", { requestId: rid });
  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body", { requestId: rid });

  const parsed = AppConfigSchema.safeParse(body.data.config);
  const redacted = redactObject(body.data.config);
  if (!parsed.success) {
    return jsonError(400, "config_invalid", {
      requestId: rid,
      redacted,
      errors: formatZodErrors(parsed.error),
    });
  }

  return jsonOk({ ok: true, requestId: rid, redacted, config: parsed.data });
}

