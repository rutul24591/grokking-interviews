import { registry } from "@/lib/schemaRegistry";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const ValidateSchema = z
  .object({
    subject: z.string().min(1),
    version: z.number().int().positive(),
    payload: z.unknown()
  })
  .strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ValidateSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  const res = registry.validate(parsed.data.subject, parsed.data.version, parsed.data.payload);
  if (!res.ok) return jsonError(400, res.error, "errors" in res ? { errors: res.errors } : undefined);
  return jsonOk({ ok: true });
}

