export type RGBA = { r: number; g: number; b: number; a: number };

export function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export function srgbToLinear(c: number) {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance({ r, g, b }: Pick<RGBA, "r" | "g" | "b">) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(a: RGBA, b: RGBA) {
  const L1 = relativeLuminance(a) + 0.05;
  const L2 = relativeLuminance(b) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
}

export function rgbaToHex({ r, g, b, a }: RGBA) {
  const to2 = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}${to2(a * 255)}`;
}

