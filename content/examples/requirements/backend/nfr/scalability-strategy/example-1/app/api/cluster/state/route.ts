import { cluster } from "@/lib/cluster";
import { jsonOk } from "@/lib/http";

export async function GET() {
  return jsonOk({ ok: true, state: cluster.state() });
}

