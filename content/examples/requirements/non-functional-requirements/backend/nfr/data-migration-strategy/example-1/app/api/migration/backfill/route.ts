import { db } from "@/lib/migrationDb";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const BackfillSchema = z.object({ batchSize: z.number().int().positive().max(500) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BackfillSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  return jsonOk({ ok: true, ...db.backfill(parsed.data.batchSize) });
}

