import sharp from "sharp";
import { NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  w: z.coerce.number().int().min(64).max(1920).default(960),
  h: z.coerce.number().int().min(64).max(1080).default(240),
  q: z.coerce.number().int().min(30).max(90).default(75),
});

function pickFormat(accept: string | null): "avif" | "webp" | "png" {
  const a = (accept ?? "").toLowerCase();
  if (a.includes("image/avif")) return "avif";
  if (a.includes("image/webp")) return "webp";
  return "png";
}

function renderSvg(w: number, h: number, fmt: string) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" rx="18" fill="#0b1020" />
  <text x="36" y="${Math.round(h / 2)}" font-family="ui-sans-serif,system-ui" font-size="34" fill="#e6e9f2">
    negotiated: ${fmt}
  </text>
</svg>`;
}

export async function GET(request: Request) {
  const u = new URL(request.url);
  const parsed = QuerySchema.parse({
    w: u.searchParams.get("w") ?? undefined,
    h: u.searchParams.get("h") ?? undefined,
    q: u.searchParams.get("q") ?? undefined,
  });

  const fmt = pickFormat(request.headers.get("accept"));
  const svg = renderSvg(parsed.w, parsed.h, fmt);
  const base = sharp(Buffer.from(svg));

  let out: Buffer;
  let ct: string;
  if (fmt === "avif") {
    out = await base.avif({ quality: parsed.q }).toBuffer();
    ct = "image/avif";
  } else if (fmt === "webp") {
    out = await base.webp({ quality: parsed.q }).toBuffer();
    ct = "image/webp";
  } else {
    out = await base.png({ compressionLevel: 9 }).toBuffer();
    ct = "image/png";
  }

  const headers = new Headers();
  headers.set("Content-Type", ct);
  headers.set("Vary", "Accept");
  headers.set("Cache-Control", "public, max-age=300");

  return new NextResponse(out, { status: 200, headers });
}

