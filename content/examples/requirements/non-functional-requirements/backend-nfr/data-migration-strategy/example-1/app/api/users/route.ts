import { db } from "@/lib/migrationDb";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const CreateUserSchema = z.object({ email: z.string().email(), fullName: z.string().min(1) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  return jsonOk({ ok: true, ...db.createUser(parsed.data) });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";
  if (!id) return jsonError(400, "missing_id");
  const result = db.getUser(id);
  if (!result) return jsonError(404, "not_found");
  return jsonOk({ ok: true, phase: db.phase, ...result });
}

