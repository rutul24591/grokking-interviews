import { jsonOk } from "@/lib/http";
import { originRead } from "@/lib/store";

export async function GET() {
  const o = originRead();
  return jsonOk(
    { ok: true, origin: o },
    { headers: { ETag: o.etag, "Cache-Control": "public, max-age=0, must-revalidate" } },
  );
}

