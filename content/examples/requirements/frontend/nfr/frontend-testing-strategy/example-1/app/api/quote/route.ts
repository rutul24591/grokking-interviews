import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { QuoteInputSchema, computeQuote } from "@/lib/quote";

const BodySchema = QuoteInputSchema.and(
  z.object({
    requestId: z.string().min(8).optional(),
  }),
);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });

  const quote = computeQuote(parsed.data);
  return jsonOk({ ok: true, quote, requestId: parsed.data.requestId ?? null });
}

