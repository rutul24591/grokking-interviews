import { jsonOk } from "@/lib/http";
import { bumpFeed } from "@/lib/feed";

export async function POST() {
  return jsonOk({ ok: true, ...bumpFeed() });
}

