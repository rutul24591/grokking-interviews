export type Variant = { w: number; h: number; dpr: number; format: "svg"; key: string };

export function pickVariant(input: { w: number; dpr: number }): Variant {
  const dpr = Math.max(1, Math.min(3, Math.round(input.dpr)));
  const w = Math.max(160, Math.min(1200, Math.round(input.w)));
  const bucket =
    w <= 320 ? 320 : w <= 480 ? 480 : w <= 768 ? 768 : w <= 1024 ? 1024 : 1200;

  return { w: bucket, h: Math.round(bucket * 0.6), dpr, format: "svg", key: `hero-${bucket}@${dpr}` };
}

export function etagFor(key: string) {
  // Deterministic ETag: stable and CDN-friendly. In production you’d use a build hash / content hash.
  return `"${key}-v1"`;
}

export function renderHeroSvg(w: number, h: number, label: string) {
  const safe = label.replace(/[<>"]/g, "");
  const bg1 = "#0ea5e9";
  const bg2 = "#a78bfa";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="24" fill="url(#g)"/>
  <circle cx="${Math.round(w * 0.78)}" cy="${Math.round(h * 0.35)}" r="${Math.round(
    Math.min(w, h) * 0.18,
  )}" fill="rgba(255,255,255,0.25)"/>
  <text x="${Math.round(w * 0.08)}" y="${Math.round(h * 0.55)}" font-size="${Math.round(
    Math.min(w, h) * 0.12,
  )}" font-family="ui-sans-serif, system-ui" fill="white" font-weight="700">${safe}</text>
  <text x="${Math.round(w * 0.08)}" y="${Math.round(h * 0.70)}" font-size="${Math.round(
    Math.min(w, h) * 0.05,
  )}" font-family="ui-sans-serif, system-ui" fill="rgba(255,255,255,0.9)">Variant: ${w}w @${label}</text>
</svg>`;
}

