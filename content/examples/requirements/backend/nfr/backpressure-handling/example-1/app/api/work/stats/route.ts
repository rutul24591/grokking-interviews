import { jsonOk } from "@/lib/http";
import { stats } from "@/lib/workQueue";

export async function GET() {
  return jsonOk({ ok: true, ...stats() });
}

