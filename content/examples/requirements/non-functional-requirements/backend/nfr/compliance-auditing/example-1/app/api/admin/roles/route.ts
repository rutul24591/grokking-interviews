import { auditLog } from "@/lib/auditLog";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const ChangeRoleSchema = z
  .object({
    userId: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["viewer", "editor", "admin"])
  })
  .strict();

export async function POST(req: Request) {
  const actorId = req.headers.get("x-actor-id") || "";
  if (!actorId) return jsonError(401, "missing_actor");

  const body = await req.json().catch(() => null);
  const parsed = ChangeRoleSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  const audit = auditLog.append({
    actorId,
    action: "role.changed",
    userId: parsed.data.userId,
    email: parsed.data.email,
    role: parsed.data.role
  });

  return jsonOk({ ok: true, audit: { id: audit.id, hash: audit.hash } });
}

