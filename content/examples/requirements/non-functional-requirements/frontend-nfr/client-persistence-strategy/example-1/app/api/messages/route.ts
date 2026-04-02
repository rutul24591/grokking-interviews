import { jsonOk } from "@/lib/http";
import { list } from "@/lib/store";

export async function GET() {
  return jsonOk({ ok: true, messages: list() });
}

