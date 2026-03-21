import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { auditPatterns } from "@/lib/audit";

const BodySchema = z.object({
  patterns: z.array(z.object({ id: z.string().min(1), html: z.string().min(1).max(50_000) })),
});

export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return jsonError(415, "unsupported_content_type");
  const body = BodySchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return jsonError(400, "invalid_body");
  return jsonOk({ ok: true, report: auditPatterns(body.data.patterns) });
}

