import { z } from "zod";

export const FormatSchema = z.enum(["avif", "webp", "png"]);
export type ImgFormat = z.infer<typeof FormatSchema>;

export function imgUrl(params: { w: number; h: number; fmt: ImgFormat; q?: number; v?: string }) {
  const url = new URL("/api/image", "https://example.invalid");
  url.searchParams.set("w", String(params.w));
  url.searchParams.set("h", String(params.h));
  url.searchParams.set("fmt", params.fmt);
  if (params.q) url.searchParams.set("q", String(params.q));
  if (params.v) url.searchParams.set("v", params.v);
  return url.pathname + url.search;
}

