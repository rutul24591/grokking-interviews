import { streams } from "@/lib/orderedStream";
import { jsonOk } from "@/lib/http";

export async function POST() {
  streams.reset();
  return jsonOk({ ok: true });
}

