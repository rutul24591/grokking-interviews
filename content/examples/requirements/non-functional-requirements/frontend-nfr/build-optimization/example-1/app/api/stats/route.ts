import { jsonOk } from "@/lib/http";

export async function GET() {
  const count = (globalThis as unknown as { __heavy_load_count?: number }).__heavy_load_count ?? 0;
  return jsonOk({ ok: true, heavyLoadCount: count });
}

