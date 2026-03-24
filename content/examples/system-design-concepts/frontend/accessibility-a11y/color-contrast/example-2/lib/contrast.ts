function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.trim().replace(/^#/, "");
  const full = normalized.length === 3 ? normalized.split("").map((c) => c + c).join("") : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`Invalid hex color: ${hex}`);
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function srgbToLinear(channel: number) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(fg: string, bg: string) {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function chooseReadableText(bg: string) {
  const white = "#ffffff";
  const black = "#000000";
  const w = contrastRatio(white, bg);
  const b = contrastRatio(black, bg);
  return w >= b ? white : black;
}

