import { dr } from "@/lib/drStore";
import { jsonOk } from "@/lib/http";

export async function POST() {
  const s = dr.snapshot();
  return jsonOk({ ok: true, snapshot: { id: s.id, ts: s.ts } });
}

