import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/http";
import { revokeToken } from "@/lib/tokens";
import { resetCache } from "@/lib/introspectionCache";

const BodySchema = z.object({ token: z.string().min(1) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_payload", { issues: parsed.error.issues });
  const ok = revokeToken(parsed.data.token);
  resetCache();
  return jsonOk({ ok });
}

