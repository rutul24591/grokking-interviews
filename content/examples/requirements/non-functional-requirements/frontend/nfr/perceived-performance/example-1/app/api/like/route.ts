import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { toggleLike } from "@/lib/search";

const BodySchema = z.object({ id: z.string().min(1) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });

  // simulate occasional failure to demonstrate rollback
  if (Math.random() < 0.2) return jsonError(503, "temporary_failure");

  return jsonOk({ ok: true, ...toggleLike(parsed.data.id) });
}

