import { streams } from "@/lib/orderedStream";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const PublishSchema = z
  .object({
    streamId: z.string().min(1),
    seq: z.number().int().positive(),
    payload: z.record(z.string(), z.unknown()).default({})
  })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = PublishSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  const res = streams.publish(parsed.data);
  return jsonOk({ ok: true, ...res, state: streams.snapshot(parsed.data.streamId) });
}

