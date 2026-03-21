import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const SmokeRequestSchema = z
  .object({
    // A real service would validate dependency connectivity here.
    mustHaveEnv: z.string().optional()
  })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = SmokeRequestSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  }

  if (parsed.data.mustHaveEnv) {
    const value = process.env[parsed.data.mustHaveEnv];
    if (!value) return jsonError(500, "missing_required_env", { key: parsed.data.mustHaveEnv });
  }

  return jsonOk({ ok: true });
}

