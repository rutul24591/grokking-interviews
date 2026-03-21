import { jsonOk } from "@/lib/http";
import { cacheStats } from "@/lib/introspectionCache";

export async function GET() {
  return jsonOk({ ok: true, introspectionCache: cacheStats() });
}

