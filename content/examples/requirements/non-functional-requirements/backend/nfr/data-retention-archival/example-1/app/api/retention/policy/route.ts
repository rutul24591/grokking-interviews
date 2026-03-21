import { store } from "@/lib/retentionStore";
import { jsonOk } from "@/lib/http";

export async function GET() {
  return jsonOk({ ok: true, policy: store.policy, legalHolds: [...store.legalHolds.values()] });
}

