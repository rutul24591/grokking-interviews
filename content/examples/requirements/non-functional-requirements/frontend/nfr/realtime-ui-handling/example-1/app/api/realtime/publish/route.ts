import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { publish } from "@/lib/realtime";

const BodySchema = z.object({ text: z.string().min(1).max(200) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });
  return jsonOk({ ok: true, message: publish(parsed.data.text) });
}

