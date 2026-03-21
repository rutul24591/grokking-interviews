function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace(/^#/, "");
  if (h.length !== 6) throw new Error("expected #RRGGBB");
  const n = Number.parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function srgbToLinear(x: number) {
  const s = x / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrastRatio(fg: string, bg: string) {
  const L1 = relativeLuminance(hexToRgb(fg));
  const L2 = relativeLuminance(hexToRgb(bg));
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

function wcag(ratio: number) {
  return {
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
  };
}

const samples = [
  { fg: "#e5e7eb", bg: "#0b1220" },
  { fg: "#94a3b8", bg: "#0b1220" },
  { fg: "#16a34a", bg: "#ffffff" },
];

for (const s of samples) {
  const ratio = contrastRatio(s.fg, s.bg);
  console.log(JSON.stringify({ ...s, ratio: Number(ratio.toFixed(2)), wcag: wcag(ratio) }));
}

console.log(JSON.stringify({ ok: true }, null, 2));

