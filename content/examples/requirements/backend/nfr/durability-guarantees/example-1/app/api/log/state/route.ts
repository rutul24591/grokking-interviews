import { log } from "@/lib/durableLog";
import { jsonOk } from "@/lib/http";

export async function GET() {
  return jsonOk({ ok: true, state: log.state() });
}

