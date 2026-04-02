import { store } from "@/lib/retentionStore";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const IngestSchema = z
  .object({
    userId: z.string().min(1),
    kind: z.string().min(1),
    createdAt: z.string().datetime().optional(),
    payload: z.record(z.string(), z.unknown()).optional()
  })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = IngestSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  const e = store.ingest(parsed.data);
  return jsonOk({ ok: true, event: e });
}

