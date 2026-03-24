import sharp from "sharp";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function svg(title: string) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#22c55e"/>
      <stop offset="1" stop-color="#60a5fa"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0b1020"/>
  <rect x="48" y="48" width="1104" height="534" rx="28" fill="url(#g)" opacity="0.20"/>
  <text x="96" y="320" font-family="ui-sans-serif,system-ui" font-size="72" fill="#e6e9f2">${title}</text>
  <text x="96" y="390" font-family="ui-sans-serif,system-ui" font-size="28" fill="#e6e9f2" opacity="0.9">OG image (PNG)</text>
</svg>`;
}

export async function GET(request: Request) {
  const u = new URL(request.url);
  const title = (u.searchParams.get("title") ?? "Social Preview").slice(0, 60);

  const png = await sharp(Buffer.from(svg(title))).png().toBuffer();
  return new NextResponse(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=300"
    }
  });
}

