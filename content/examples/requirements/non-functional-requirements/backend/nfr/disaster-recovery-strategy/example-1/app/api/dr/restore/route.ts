import { dr } from "@/lib/drStore";
import { jsonError, jsonOk } from "@/lib/http";
import { z } from "zod";

const RestoreSchema = z.object({ snapshotId: z.string().min(1) }).strict();

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = RestoreSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "invalid_request", { issues: parsed.error.issues });
  try {
    const s = dr.restore(parsed.data.snapshotId);
    return jsonOk({ ok: true, restored: { id: s.id, ts: s.ts } });
  } catch (e) {
    return jsonError(404, "snapshot_not_found");
  }
}

