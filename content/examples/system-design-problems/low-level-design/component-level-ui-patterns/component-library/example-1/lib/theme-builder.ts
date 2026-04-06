// ============================================================
// lib/theme-builder.ts
// Theme construction with overrides and contrast validation
// ============================================================

import type {
  ThemeDefinition,
  ThemeOverride,
  ThemeWarning,
  DesignToken,
} from "./library-types";
import { allTokens, tokenMap } from "./design-tokens";

// ── Contrast Utilities ──────────────────────────────────────

/**
 * Calculate relative luminance of a color per WCAG 2.1.
 * See: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(hex: string): number {
  const hexStr = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = parseInt(hexStr.substring(offset, offset + 2), 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors per WCAG 2.1.
 * Returns a value between 1 (identical) and 21 (black vs white).
 */
export function contrastRatio(color1: string, color2: string): number {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a foreground/background color pair meets
 * the WCAG 2.1 AA contrast requirement.
 */
export function passesWCAGAA(
  foreground: string,
  background: string,
  largeText: boolean = false
): boolean {
  const ratio = contrastRatio(foreground, background);
  return largeText ? ratio >= 3 : ratio >= 4.5;
}

// ── Theme Builder ───────────────────────────────────────────

interface BuildThemeOptions {
  /** Partial overrides to apply on top of base tokens */
  overrides?: ThemeOverride;
  /** Whether to run contrast validation */
  validateContrast?: boolean;
  /** Known foreground/background token pairs to check */
  contrastPairs?: Array<{ foreground: string; background: string }>;
}

const DEFAULT_CONTRAST_PAIRS: Array<{ foreground: string; background: string }> = [
  { foreground: "color-text-primary", background: "color-bg-primary" },
  { foreground: "color-text-secondary", background: "color-bg-primary" },
  { foreground: "color-text-inverse", background: "color-primary" },
  { foreground: "color-text-primary", background: "color-bg-secondary" },
  { foreground: "color-primary", background: "color-bg-primary" },
];

/**
 * Build a complete ThemeDefinition from base tokens with
 * optional consumer overrides and contrast validation.
 */
export function buildTheme(
  themeId: string,
  themeName: string,
  options: BuildThemeOptions = {}
): ThemeDefinition {
  const {
    overrides = {},
    validateContrast = true,
    contrastPairs = DEFAULT_CONTRAST_PAIRS,
  } = options;

  const warnings: ThemeWarning[] = [];

  // Step 1: Resolve base token values
  const baseTokens = resolveBaseTokens();

  // Step 2: Validate override types
  const validatedOverrides = validateOverrides(overrides, warnings);

  // Step 3: Merge base + overrides (overrides win)
  const mergedTokens: Record<string, string> = {
    ...baseTokens,
    ...validatedOverrides,
  };

  // Step 4: Run contrast checks
  if (validateContrast) {
    for (const pair of contrastPairs) {
      const fg = mergedTokens[pair.foreground];
      const bg = mergedTokens[pair.background];

      if (!fg || !bg) {
        warnings.push({
          type: "validation",
          message: `Missing token for contrast check: ${!fg ? pair.foreground : pair.background}`,
          tokens: [pair.foreground, pair.background],
          severity: "warning",
        });
        continue;
      }

      if (!isHexColor(fg) || !isHexColor(bg)) {
        continue; // Skip non-color values (shadows, spacing, etc.)
      }

      const ratio = contrastRatio(fg, bg);
      if (ratio < 4.5) {
        warnings.push({
          type: "contrast",
          message:
            `Contrast ratio ${ratio.toFixed(2)}:1 between "${pair.foreground}" ` +
            `(${fg}) and "${pair.background}" (${bg}) fails WCAG AA ` +
            `(minimum 4.5:1 for normal text).`,
          tokens: [pair.foreground, pair.background],
          severity: ratio < 3 ? "critical" : "warning",
        });
      }
    }
  }

  return {
    id: themeId,
    name: themeName,
    tokens: mergedTokens,
    warnings,
  };
}

// ── Internal Helpers ────────────────────────────────────────

function resolveBaseTokens(): Record<string, string> {
  const resolved: Record<string, string> = {};

  for (const token of allTokens) {
    if (token.alias) {
      // For simplicity, resolve aliases against the source token map
      const aliasedToken = tokenMap.get(token.alias);
      resolved[token.name] = aliasedToken?.value ?? token.value;
    } else {
      resolved[token.name] = token.value;
    }
  }

  return resolved;
}

function validateOverrides(
  overrides: ThemeOverride,
  warnings: ThemeWarning[]
): ThemeOverride {
  const validated: ThemeOverride = {};

  for (const [name, value] of Object.entries(overrides)) {
    if (!value || value.trim() === "") {
      warnings.push({
        type: "validation",
        message: `Override for "${name}" is empty. Skipping.`,
        tokens: [name],
        severity: "info",
      });
      continue;
    }

    validated[name] = value;
  }

  return validated;
}

function isHexColor(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
}

// ── Pre-built Themes ────────────────────────────────────────

export const lightTheme = buildTheme("light", "Light", {
  validateContrast: true,
});

export const darkTheme = buildTheme("dark", "Dark", {
  overrides: {
    "color-bg-primary": "#111827",
    "color-bg-secondary": "#1f2937",
    "color-bg-tertiary": "#374151",
    "color-text-primary": "#f9fafb",
    "color-text-secondary": "#9ca3af",
    "color-text-inverse": "#111827",
    "color-border": "#374151",
  },
  validateContrast: true,
});
