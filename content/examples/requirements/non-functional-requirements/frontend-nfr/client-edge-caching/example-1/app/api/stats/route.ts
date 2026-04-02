import { jsonOk } from "@/lib/http";
import { stats } from "@/lib/store";

export async function GET() {
  return jsonOk({ ok: true, stats: stats() });
}

