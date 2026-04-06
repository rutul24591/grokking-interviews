// CSS variable manager: injects theme tokens as CSS custom properties

import type { ThemeConfig, ColorPalette, SpacingScale, ShadowToken, RadiusToken } from "./theme-types";
import { checkContrast, ContrastLevel } from "./contrast-checker";

/** Prefix for all CSS custom properties */
const CSS_VAR_PREFIX = "--theme";

/** Convert a camelCase or kebab-case token name to a CSS custom property name */
function toCSSVariableName(tokenName: string): string {
  const kebabName = tokenName.replace(/([A-Z])/g, "-$1").toLowerCase();
  return `--${CSS_VAR_PREFIX}-${kebabName}`;
}

/** Apply all theme tokens as CSS custom properties on the target element */
export function applyThemeVariables(
  element: HTMLElement,
  theme: ThemeConfig
): void {
  const { palette, typography, spacing, shadows, radii } = theme;

  // Apply color tokens
  applyColorTokens(element, palette);

  // Apply typography tokens
  applyTypographyTokens(element, typography);

  // Apply spacing tokens
  applySpacingTokens(element, spacing);

  // Apply shadow tokens
  applyShadowTokens(element, shadows);

  // Apply radius tokens
  applyRadiusTokens(element, radii);

  // Set data-theme attribute for CSS selector targeting
  element.setAttribute("data-theme", theme.id);

  // Validate contrast ratios in development
  if (process.env.NODE_ENV === "development") {
    validateContrastRatios(palette);
  }
}

/** Apply color palette as CSS custom properties */
function applyColorTokens(element: HTMLElement, palette: ColorPalette): void {
  const entries = Object.entries(palette) as [keyof ColorPalette, string][];
  for (const [key, value] of entries) {
    const varName = toCSSVariableName(`color-${key}`);
    element.style.setProperty(varName, value);
  }
}

/** Apply typography tokens as CSS custom properties */
function applyTypographyTokens(
  element: HTMLElement,
  typography: ThemeConfig["typography"]
): void {
  for (const [scaleName, token] of Object.entries(typography)) {
    element.style.setProperty(
      toCSSVariableName(`font-${scaleName}-family`),
      token.fontFamily
    );
    element.style.setProperty(
      toCSSVariableName(`font-${scaleName}-size`),
      token.fontSize
    );
    element.style.setProperty(
      toCSSVariableName(`font-${scaleName}-line-height`),
      token.lineHeight
    );
    element.style.setProperty(
      toCSSVariableName(`font-${scaleName}-weight`),
      String(token.fontWeight)
    );
  }
}

/** Apply spacing tokens as CSS custom properties */
function applySpacingTokens(
  element: HTMLElement,
  spacing: SpacingScale
): void {
  for (const [key, value] of Object.entries(spacing)) {
    element.style.setProperty(toCSSVariableName(`spacing-${key}`), value);
  }
}

/** Apply shadow tokens as CSS custom properties */
function applyShadowTokens(
  element: HTMLElement,
  shadows: ShadowToken
): void {
  for (const [key, value] of Object.entries(shadows)) {
    element.style.setProperty(toCSSVariableName(`shadow-${key}`), value);
  }
}

/** Apply border radius tokens as CSS custom properties */
function applyRadiusTokens(
  element: HTMLElement,
  radii: RadiusToken
): void {
  for (const [key, value] of Object.entries(radii)) {
    element.style.setProperty(toCSSVariableName(`radius-${key}`), value);
  }
}

/** Get the computed value of a CSS custom property from an element */
export function getComputedTokenValue(
  element: Element,
  tokenName: string
): string {
  const varName = toCSSVariableName(tokenName);
  return (
    getComputedStyle(element).getPropertyValue(varName).trim() || ""
  );
}

/** Check contrast between two color tokens */
export function checkTokenContrast(
  element: Element,
  foregroundToken: string,
  backgroundToken: string,
  level: ContrastLevel = "AA"
): boolean {
  const fgValue = getComputedTokenValue(element, foregroundToken);
  const bgValue = getComputedTokenValue(element, backgroundToken);

  if (!fgValue || !bgValue) return false;

  return checkContrast(fgValue, bgValue, level);
}

/** Validate critical contrast ratios in development */
function validateContrastRatios(palette: ColorPalette): void {
  const criticalPairs: [string, string, string][] = [
    ["text-primary", "bg-primary", "Normal text AA"],
    ["text-secondary", "bg-primary", "Normal text AA"],
    ["text-muted", "bg-primary", "Normal text AA"],
    ["text-on-primary", "color-primary", "Text on primary AA"],
    ["text-primary", "bg-surface", "Normal text AA"],
  ];

  for (const [fgKey, bgKey, label] of criticalPairs) {
    const fg = palette[fgKey as keyof ColorPalette];
    const bg = palette[bgKey as keyof ColorPalette];

    if (fg && bg) {
      const passes = checkContrast(fg, bg, "AA");
      if (!passes) {
        console.warn(
          `[Theme] Contrast check failed for ${label}: ${fgKey} (${fg}) on ${bgKey} (${bg})`
        );
      }
    }
  }
}
