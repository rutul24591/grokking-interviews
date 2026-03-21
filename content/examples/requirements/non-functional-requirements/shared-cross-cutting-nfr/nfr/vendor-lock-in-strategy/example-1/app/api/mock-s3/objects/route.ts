import { jsonOk } from "@/lib/http";
import { mockS3List } from "@/lib/mockS3Store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const prefix = url.searchParams.get("prefix") || undefined;
  const objects = mockS3List(prefix).map((o) => ({
    key: o.key,
    size: o.value.length,
    updatedAt: o.updatedAt,
    etag: o.etag,
  }));
  return jsonOk({ ok: true, objects });
}

