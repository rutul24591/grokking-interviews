export function buildSrcSet(params: {
  basePath: string;
  widths: number[];
  format: "webp" | "avif";
  height: number;
}): string {
  const { basePath, widths, format, height } = params;
  return widths
    .map((w) => {
      const url = new URL(basePath, "https://example.invalid");
      url.searchParams.set("w", String(w));
      url.searchParams.set("h", String(height));
      url.searchParams.set("fmt", format);
      return `${url.pathname}${url.search} ${w}w`;
    })
    .join(", ");
}

