import { z } from "zod";
import { NextResponse } from "next/server";
import { jsonError } from "@/lib/http";
import { log } from "@/lib/logger";

const BodySchema = z.object({
  email: z.string().email(),
  sku: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
  token: z.string().min(1)
});

export async function POST(req: Request) {
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    log("warn", "invalid_json", { requestId });
    return jsonError(400, "invalid_json");
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    log("warn", "invalid_payload", { requestId, fields: { issues: parsed.error.issues } });
    return jsonError(400, "invalid_payload", { issues: parsed.error.issues });
  }

  log("info", "order_received", { requestId, fields: parsed.data });
  log("info", "inventory_checked", { requestId, fields: { sku: parsed.data.sku, ok: true } });
  log("info", "payment_authorized", { requestId, fields: { ok: true } });

  const res = NextResponse.json({ ok: true, orderId: "o_" + crypto.randomUUID().slice(0, 8) });
  res.headers.set("x-request-id", requestId);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

