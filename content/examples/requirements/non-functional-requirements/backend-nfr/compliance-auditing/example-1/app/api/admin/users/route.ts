import { auditLog } from "@/lib/auditLog";
import { jsonError, jsonOk } from "@/lib/http";
import { randomUUID } from "node:crypto";
import { z } from "zod";

const CreateUserSchema = z
  .object({
    email: z.string().email(),
    role: z.enum(["viewer", "editor", "admin"])
  })
  .strict();

export async function POST(req: Request) {
  const actorId = req.headers.get("x-actor-id") || "";
  if (!actorId) return jsonError(401, "missing_actor");

  const body = await req.json().catch(() => null);
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });

  const userId = randomUUID();
  const audit = auditLog.append({
    actorId,
    action: "user.created",
    userId,
    email: parsed.data.email,
    role: parsed.data.role
  });

  return jsonOk({
    ok: true,
    user: { id: userId, role: parsed.data.role },
    audit: { id: audit.id, hash: audit.hash }
  });
}

