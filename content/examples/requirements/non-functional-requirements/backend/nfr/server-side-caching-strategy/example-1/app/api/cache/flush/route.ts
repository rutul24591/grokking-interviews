import { jsonOk } from "@/lib/http";
import { profileCache } from "@/lib/cache";

export async function POST() {
  profileCache.flush();
  return jsonOk({ ok: true });
}

