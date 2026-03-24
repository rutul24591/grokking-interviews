import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function svg(variant: string) {
  const color = variant === "thumb" ? "#0ea5e9" : "#4f46e5";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <rect width="800" height="400" fill="${color}"/>
  <text x="40" y="90" font-size="44" font-weight="700" fill="white" font-family="ui-sans-serif, system-ui">
    ${variant}
  </text>
</svg>`;
}

function etagForBody(body: string) {
  return `"${createHash("sha1").update(body).digest("hex")}"`;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const variant = url.searchParams.get("variant") || "hero";
  const delayMs = Math.max(0, Math.min(1500, Number(url.searchParams.get("delayMs") || "0")));
  if (delayMs) await new Promise((r) => setTimeout(r, delayMs));

  const body = svg(variant);
  const etag = etagForBody(body);
  if (req.headers.get("if-none-match") === etag) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag, "Cache-Control": "public, max-age=86400" } });
  }
  return new NextResponse(body, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", ETag: etag, "Cache-Control": "public, max-age=86400" } });
}

