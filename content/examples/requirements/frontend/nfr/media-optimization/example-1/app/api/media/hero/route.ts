import { z } from "zod";
import { jsonError } from "@/lib/http";
import { etagFor, pickVariant, renderHeroSvg } from "@/lib/media";

const QuerySchema = z.object({
  w: z.coerce.number().int().min(160).max(2000).default(768),
  dpr: z.coerce.number().min(1).max(4).default(1),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!q.success) return jsonError(400, "invalid_query", { issues: q.error.issues });

  const v = pickVariant({ w: q.data.w, dpr: q.data.dpr });
  const etag = etagFor(v.key);
  const ifNoneMatch = req.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  const svg = renderHeroSvg(v.w * v.dpr, v.h * v.dpr, `${v.w}w @${v.dpr}x`);
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}

