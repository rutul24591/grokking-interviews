import { jsonError, jsonOk } from "@/lib/http";
import { IdempotencyStore } from "@/lib/idempotencyStore";
import { createCharge } from "@/lib/paymentsProvider";
import { z } from "zod";

const ChargeSchema = z
  .object({
    customerId: z.string().min(1),
    amountUsd: z.number().positive(),
    currency: z.string().min(3).max(3).default("USD"),
    idempotencyKey: z.string().min(1).optional()
  })
  .strict();

type ChargeResponse = Awaited<ReturnType<typeof createCharge>>;

const store = new IdempotencyStore<ChargeResponse>(10 * 60 * 1000);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ChargeSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  const headerKey = req.headers.get("idempotency-key") || undefined;
  const key = parsed.data.idempotencyKey || headerKey;
  if (!key) return jsonError(400, "missing_idempotency_key");

  const idempotencyKey = `${parsed.data.customerId}:${key}`;

  const { value, replayed } = await store.getOrCreate(idempotencyKey, async () => {
    return createCharge({
      customerId: parsed.data.customerId,
      amountUsd: parsed.data.amountUsd,
      currency: parsed.data.currency
    });
  });

  return jsonOk({ ok: true, replayed, charge: value });
}

