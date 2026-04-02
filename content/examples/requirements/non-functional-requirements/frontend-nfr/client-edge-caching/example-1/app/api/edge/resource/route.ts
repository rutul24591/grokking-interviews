import { jsonOk } from "@/lib/http";
import { edgeRead } from "@/lib/store";

export async function GET() {
  const r = edgeRead("resource", 2000);
  return jsonOk(
    { ok: true, origin: r.entry.origin, cachedAtMs: r.entry.cachedAtMs, expiresAtMs: r.entry.expiresAtMs },
    {
      headers: {
        "x-edge-cache": r.hit ? "HIT" : "MISS",
        ETag: r.entry.origin.etag,
        "Cache-Control": "public, max-age=2",
      },
    },
  );
}

