// WCAG 2.1 contrast ratio checker

export type ContrastLevel = "AA" | "AAA";
export type TextSize = "normal" | "large";

/**
 * Parse a hex color string (#RRGGBB or #RGB) to RGB values in range [0, 1].
 */
function parseHexColor(hex: string): { r: number; g: number; b: number } {
  // Remove # prefix
  const clean = hex.replace("#", "");

  // Expand shorthand (#RGB -> #RRGGBB)
  let expanded: string;
  if (clean.length === 3) {
    expanded = clean
      .split("")
      .map((c) => c + c)
      .join("");
  } else {
    expanded = clean;
  }

  const r = parseInt(expanded.substring(0, 2), 16) / 255;
  const g = parseInt(expanded.substring(2, 4), 16) / 255;
  const b = parseInt(expanded.substring(4, 6), 16) / 255;

  return { r, g, b };
}

/**
 * Convert an sRGB channel value (0-1) to linear light.
 * Per WCAG 2.x specification.
 */
function sRGBToLinear(channel: number): number {
  if (channel <= 0.03928) {
    return channel / 12.92;
  }
  return Math.pow((channel + 0.055) / 1.055, 2.4);
}

/**
 * Calculate the relative luminance of a color.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(
  r: number,
  g: number,
  b: number
): number {
  const rLin = sRGBToLinear(r);
  const gLin = sRGBToLinear(g);
  const bLin = sRGBToLinear(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calculate the contrast ratio between two colors.
 * Returns a value between 1 (identical) and 21 (black vs white).
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function contrastRatio(color1: string, color2: string): number {
  const c1 = parseHexColor(color1);
  const c2 = parseHexColor(color2);

  const l1 = relativeLuminance(c1.r, c1.g, c1.b);
  const l2 = relativeLuminance(c2.r, c2.g, c2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get the minimum required contrast ratio for a given level and text size.
 */
function getMinimumRatio(level: ContrastLevel, size: TextSize): number {
  if (level === "AA") {
    return size === "large" ? 3 : 4.5;
  }
  // AAA
  return size === "large" ? 4.5 : 7;
}

/**
 * Check if a foreground/background color pair meets WCAG requirements.
 */
export function checkContrast(
  foreground: string,
  background: string,
  level: ContrastLevel = "AA",
  size: TextSize = "normal"
): boolean {
  const ratio = contrastRatio(foreground, background);
  const minimum = getMinimumRatio(level, size);
  return ratio >= minimum;
}

/**
 * Check AA compliance for normal text (4.5:1 minimum).
 */
export function isAACompliant(foreground: string, background: string): boolean {
  return checkContrast(foreground, background, "AA", "normal");
}

/**
 * Check AAA compliance for normal text (7:1 minimum).
 */
export function isAAACompliant(foreground: string, background: string): boolean {
  return checkContrast(foreground, background, "AAA", "normal");
}

/**
 * Get detailed contrast information for a color pair.
 */
export function getContrastInfo(
  foreground: string,
  background: string
): {
  ratio: number;
  aaNormal: boolean;
  aalLarge: boolean;
  aaanormal: boolean;
  aaalLarge: boolean;
} {
  const ratio = contrastRatio(foreground, background);

  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aalLarge: ratio >= 3,
    aaanormal: ratio >= 7,
    aaalLarge: ratio >= 4.5,
  };
}
