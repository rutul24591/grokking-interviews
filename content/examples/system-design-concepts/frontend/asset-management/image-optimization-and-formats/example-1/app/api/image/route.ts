import sharp from "sharp";
import { NextResponse } from "next/server";
import { z } from "zod";
import { FormatSchema } from "@/lib/imageUrl";

const QuerySchema = z.object({
  w: z.coerce.number().int().min(64).max(1920).default(960),
  h: z.coerce.number().int().min(64).max(1080).default(240),
  fmt: FormatSchema.default("webp"),
  q: z.coerce.number().int().min(30).max(90).default(75),
  v: z.string().optional(),
});

function contentType(fmt: string) {
  if (fmt === "avif") return "image/avif";
  if (fmt === "webp") return "image/webp";
  return "image/png";
}

function renderSvg(w: number, h: number) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#60a5fa" stop-opacity="0.95" />
      <stop offset="1" stop-color="#a78bfa" stop-opacity="0.95" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" rx="18" fill="#0b1020" />
  <rect x="18" y="18" width="${w - 36}" height="${h - 36}" rx="14" fill="url(#g)" opacity="0.22" />
  <text x="38" y="${Math.round(h / 2)}" font-family="ui-sans-serif,system-ui" font-size="34" fill="#e6e9f2">
    ${w}×${h}
  </text>
  <text x="38" y="${Math.round(h / 2) + 42}" font-family="ui-sans-serif,system-ui" font-size="18" fill="#e6e9f2" opacity="0.92">
    format negotiated by &lt;picture&gt;
  </text>
</svg>`;
}

export async function GET(request: Request) {
  const u = new URL(request.url);
  const parsed = QuerySchema.parse({
    w: u.searchParams.get("w") ?? undefined,
    h: u.searchParams.get("h") ?? undefined,
    fmt: u.searchParams.get("fmt") ?? undefined,
    q: u.searchParams.get("q") ?? undefined,
    v: u.searchParams.get("v") ?? undefined,
  });

  const svg = renderSvg(parsed.w, parsed.h);
  const base = sharp(Buffer.from(svg));

  let out: Buffer;
  if (parsed.fmt === "avif") out = await base.avif({ quality: parsed.q }).toBuffer();
  else if (parsed.fmt === "webp") out = await base.webp({ quality: parsed.q }).toBuffer();
  else out = await base.png({ compressionLevel: 9 }).toBuffer();

  const headers = new Headers();
  headers.set("Content-Type", contentType(parsed.fmt));
  headers.set("Cache-Control", parsed.v ? "public, max-age=31536000, immutable" : "public, max-age=300");

  return new NextResponse(out, { status: 200, headers });
}

