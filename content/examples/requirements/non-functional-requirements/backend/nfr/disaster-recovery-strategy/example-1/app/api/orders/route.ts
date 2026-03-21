import { dr } from "@/lib/drStore";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const CreateSchema = z.object({ amountUsd: z.number().positive() }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  try {
    return jsonOk({ ok: true, order: dr.writeOrder(parsed.data.amountUsd) });
  } catch (e) {
    return jsonError(503, "primary_down");
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  if (!id) return jsonError(400, "missing_id");
  const order = dr.getOrder(id);
  if (!order) return jsonError(404, "not_found");
  return jsonOk({ ok: true, order });
}

