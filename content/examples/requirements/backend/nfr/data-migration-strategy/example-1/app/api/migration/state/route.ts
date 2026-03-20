import { db, type MigrationPhase } from "@/lib/migrationDb";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

export async function GET() {
  return jsonOk({ ok: true, phase: db.phase });
}

const SetPhaseSchema = z.object({ phase: z.enum(["legacy", "dual_write", "read_new", "cutover"]) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = SetPhaseSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  db.setPhase(parsed.data.phase as MigrationPhase);
  return jsonOk({ ok: true, phase: db.phase });
}

