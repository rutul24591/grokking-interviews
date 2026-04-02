import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { analyticsSummary, recordEvent, resetAnalytics } from "@/lib/analytics";

const BodySchema = z.object({
  name: z.string().min(1).max(60),
  props: z.record(z.unknown()).optional()
});

export async function GET(req: Request) {
  if (req.headers.get("x-consent-analytics") !== "1") return jsonError(403, "consent_required");
  return jsonOk({ ok: true, ...analyticsSummary() });
}

export async function POST(req: Request) {
  if (req.headers.get("x-consent-analytics") !== "1") return jsonError(403, "consent_required");
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });
  recordEvent({ id: "e_" + crypto.randomUUID(), ts: Date.now(), name: parsed.data.name, props: parsed.data.props });
  return jsonOk({ ok: true, ...analyticsSummary() });
}

export async function DELETE(req: Request) {
  if (req.headers.get("x-consent-analytics") !== "1") return jsonError(403, "consent_required");
  resetAnalytics();
  return jsonOk({ ok: true, ...analyticsSummary() });
}

