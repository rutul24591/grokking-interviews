import { NextResponse } from "next/server";
import { z } from "zod";
import { computeEtag, getStore } from "@/lib/store";

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = QuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  const store = getStore();

  const payload = {
    version: store.feedVersion,
    items: store.items.slice(0, query.limit),
    generatedAt: new Date().toISOString(),
  };

  const etag = computeEtag({ version: payload.version, items: payload.items });
  const inm = req.headers.get("if-none-match");
  if (inm && inm === etag) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag } });
  }

  return NextResponse.json(payload, {
    headers: {
      ETag: etag,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}

