import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  variant: z.string().min(1).max(30).default("hero"),
  delayMs: z.coerce.number().int().min(0).max(2000).default(0),
});

function heroSvg(variant: string) {
  const title = `hero:${variant}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#111827"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="600" fill="url(#g)"/>
  <g font-family="ui-sans-serif, system-ui" fill="white">
    <text x="60" y="120" font-size="54" font-weight="700">Asset Preloading</text>
    <text x="60" y="180" font-size="22" opacity="0.9">${title}</text>
    <text x="60" y="240" font-size="18" opacity="0.75">Preload only what impacts above-the-fold UX.</text>
  </g>
</svg>`;
}

function etagForBody(body: string) {
  return `"${createHash("sha1").update(body).digest("hex")}"`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(Object.fromEntries(url.searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid_query" }, { status: 400 });

  const { variant, delayMs } = parsed.data;
  if (delayMs) await new Promise((r) => setTimeout(r, delayMs));

  const body = heroSvg(variant);
  const etag = etagForBody(body);

  if (req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  return new NextResponse(body, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      ETag: etag,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

