import { registry } from "@/lib/schemaRegistry";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const FieldSchema = z
  .object({
    name: z.string().min(1),
    type: z.enum(["string", "number", "boolean", "object"]),
    required: z.boolean()
  })
  .strict();

const RegisterSchema = z.object({ subject: z.string().min(1), fields: z.array(FieldSchema).min(1).max(100) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  const res = registry.register(parsed.data.subject, parsed.data.fields);
  if (!res.ok) return jsonError(409, "incompatible_schema", { reason: res.reason });
  return jsonOk({ ok: true, schema: res.schema });
}

