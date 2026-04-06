// ============================================================
// lib/design-tokens.ts
// Authoritative design token definitions
// ============================================================

import type { DesignToken } from "./library-types";

// ── Color Tokens ────────────────────────────────────────────

export const colorTokens: DesignToken[] = [
  // Base palette — neutral scale
  { name: "color-neutral-50", value: "#f9fafb", category: "color", description: "Lightest neutral background" },
  { name: "color-neutral-100", value: "#f3f4f6", category: "color", description: "Subtle neutral background" },
  { name: "color-neutral-200", value: "#e5e7eb", category: "color", description: "Border and divider color" },
  { name: "color-neutral-300", value: "#d1d5db", category: "color", description: "Disabled state background" },
  { name: "color-neutral-400", value: "#9ca3af", category: "color", description: "Placeholder text" },
  { name: "color-neutral-500", value: "#6b7280", category: "color", description: "Secondary text" },
  { name: "color-neutral-600", value: "#4b5563", category: "color", description: "Body text" },
  { name: "color-neutral-700", value: "#374151", category: "color", description: "Heading text" },
  { name: "color-neutral-800", value: "#1f2937", category: "color", description: "High-emphasis text" },
  { name: "color-neutral-900", value: "#111827", category: "color", description: "Darkest neutral" },

  // Base palette — primary brand
  { name: "color-primary-50", value: "#eff6ff", category: "color", description: "Lightest primary tint" },
  { name: "color-primary-100", value: "#dbeafe", category: "color", description: "Primary tint" },
  { name: "color-primary-500", value: "#3b82f6", category: "color", description: "Primary brand color" },
  { name: "color-primary-600", value: "#2563eb", category: "color", description: "Primary hover state" },
  { name: "color-primary-700", value: "#1d4ed8", category: "color", description: "Primary active state" },

  // Base palette — danger
  { name: "color-danger-50", value: "#fef2f2", category: "color", description: "Lightest danger tint" },
  { name: "color-danger-500", value: "#ef4444", category: "color", description: "Danger/error color" },
  { name: "color-danger-600", value: "#dc2626", category: "color", description: "Danger hover state" },

  // Base palette — success
  { name: "color-success-50", value: "#f0fdf4", category: "color", description: "Lightest success tint" },
  { name: "color-success-500", value: "#22c55e", category: "color", description: "Success color" },
  { name: "color-success-600", value: "#16a34a", category: "color", description: "Success hover state" },

  // Base palette — warning
  { name: "color-warning-50", value: "#fffbeb", category: "color", description: "Lightest warning tint" },
  { name: "color-warning-500", value: "#f59e0b", category: "color", description: "Warning color" },
  { name: "color-warning-600", value: "#d97706", category: "color", description: "Warning hover state" },

  // Semantic aliases
  { name: "color-bg-primary", value: "#ffffff", category: "color", description: "Primary page background", alias: "color-neutral-50" },
  { name: "color-bg-secondary", value: "#f9fafb", category: "color", description: "Secondary panel background" },
  { name: "color-bg-tertiary", value: "#f3f4f6", category: "color", description: "Tertiary inset background" },
  { name: "color-text-primary", value: "#111827", category: "color", description: "Primary text color", alias: "color-neutral-900" },
  { name: "color-text-secondary", value: "#6b7280", category: "color", description: "Secondary text color", alias: "color-neutral-500" },
  { name: "color-text-inverse", value: "#ffffff", category: "color", description: "Text on dark backgrounds" },
  { name: "color-border", value: "#e5e7eb", category: "color", description: "Default border color", alias: "color-neutral-200" },
  { name: "color-border-focus", value: "#3b82f6", category: "color", description: "Focus ring border", alias: "color-primary-500" },
  { name: "color-primary", value: "#3b82f6", category: "color", description: "Primary action color", alias: "color-primary-500" },
  { name: "color-danger", value: "#ef4444", category: "color", description: "Danger action color", alias: "color-danger-500" },
  { name: "color-success", value: "#22c55e", category: "color", description: "Success state color", alias: "color-success-500" },
  { name: "color-warning", value: "#f59e0b", category: "color", description: "Warning state color", alias: "color-warning-500" },
];

// ── Typography Tokens ───────────────────────────────────────

export const typographyTokens: DesignToken[] = [
  // Font families
  { name: "font-family-sans", value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", category: "typography", description: "Primary UI font" },
  { name: "font-family-mono", value: "'JetBrains Mono', 'Fira Code', monospace", category: "typography", description: "Code and monospace font" },

  // Font sizes
  { name: "font-size-xs", value: "0.75rem", category: "typography", description: "Extra small text (12px)" },
  { name: "font-size-sm", value: "0.875rem", category: "typography", description: "Small text (14px)" },
  { name: "font-size-base", value: "1rem", category: "typography", description: "Base body text (16px)" },
  { name: "font-size-lg", value: "1.125rem", category: "typography", description: "Large text (18px)" },
  { name: "font-size-xl", value: "1.25rem", category: "typography", description: "Extra large text (20px)" },
  { name: "font-size-2xl", value: "1.5rem", category: "typography", description: "Section heading (24px)" },
  { name: "font-size-3xl", value: "1.875rem", category: "typography", description: "Page heading (30px)" },
  { name: "font-size-4xl", value: "2.25rem", category: "typography", description: "Hero heading (36px)" },

  // Line heights
  { name: "line-height-tight", value: "1.25", category: "typography", description: "Tight line height for headings" },
  { name: "line-height-normal", value: "1.5", category: "typography", description: "Normal line height for body" },
  { name: "line-height-relaxed", value: "1.75", category: "typography", description: "Relaxed line height for long-form" },

  // Font weights
  { name: "font-weight-normal", value: "400", category: "typography", description: "Normal weight" },
  { name: "font-weight-medium", value: "500", category: "typography", description: "Medium weight" },
  { name: "font-weight-semibold", value: "600", category: "typography", description: "Semibold weight" },
  { name: "font-weight-bold", value: "700", category: "typography", description: "Bold weight" },
];

// ── Spacing Tokens ──────────────────────────────────────────

export const spacingTokens: DesignToken[] = [
  { name: "spacing-0", value: "0", category: "spacing", description: "No spacing" },
  { name: "spacing-1", value: "0.25rem", category: "spacing", description: "4px — tight spacing" },
  { name: "spacing-2", value: "0.5rem", category: "spacing", description: "8px — small gap" },
  { name: "spacing-3", value: "0.75rem", category: "spacing", description: "12px" },
  { name: "spacing-4", value: "1rem", category: "spacing", description: "16px — standard padding" },
  { name: "spacing-5", value: "1.25rem", category: "spacing", description: "20px" },
  { name: "spacing-6", value: "1.5rem", category: "spacing", description: "24px — section gap" },
  { name: "spacing-8", value: "2rem", category: "spacing", description: "32px — large gap" },
  { name: "spacing-10", value: "2.5rem", category: "spacing", description: "40px" },
  { name: "spacing-12", value: "3rem", category: "spacing", description: "48px — major section" },
  { name: "spacing-16", value: "4rem", category: "spacing", description: "64px — page margin" },
];

// ── Shadow Tokens ───────────────────────────────────────────

export const shadowTokens: DesignToken[] = [
  { name: "shadow-sm", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)", category: "shadow", description: "Subtle elevation (cards, inputs)" },
  { name: "shadow-md", value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", category: "shadow", description: "Medium elevation (dropdowns, menus)" },
  { name: "shadow-lg", value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", category: "shadow", description: "High elevation (popovers, modals)" },
  { name: "shadow-xl", value: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)", category: "shadow", description: "Maximum elevation (fullscreen dialogs)" },
];

// ── Radius Tokens ───────────────────────────────────────────

export const radiusTokens: DesignToken[] = [
  { name: "radius-none", value: "0", category: "radius", description: "No border radius" },
  { name: "radius-sm", value: "0.25rem", category: "radius", description: "Small radius (4px)" },
  { name: "radius-md", value: "0.375rem", category: "radius", description: "Medium radius (6px)" },
  { name: "radius-lg", value: "0.5rem", category: "radius", description: "Large radius (8px)" },
  { name: "radius-xl", value: "0.75rem", category: "radius", description: "Extra large radius (12px)" },
  { name: "radius-full", value: "9999px", category: "radius", description: "Fully rounded (pill, avatar)" },
];

// ── Z-Index Tokens ──────────────────────────────────────────

export const zIndexTokens: DesignToken[] = [
  { name: "z-index-base", value: "0", category: "zIndex", description: "Default stacking" },
  { name: "z-index-dropdown", value: "100", category: "zIndex", description: "Dropdown menus" },
  { name: "z-index-sticky", value: "200", category: "zIndex", description: "Sticky headers" },
  { name: "z-index-overlay", value: "300", category: "zIndex", description: "Overlays and backdrops" },
  { name: "z-index-modal", value: "400", category: "zIndex", description: "Modal dialogs" },
  { name: "z-index-toast", value: "500", category: "zIndex", description: "Toast notifications" },
  { name: "z-index-tooltip", value: "600", category: "zIndex", description: "Tooltips (highest)" },
];

// ── Combined Export ─────────────────────────────────────────

export const allTokens: DesignToken[] = [
  ...colorTokens,
  ...typographyTokens,
  ...spacingTokens,
  ...shadowTokens,
  ...radiusTokens,
  ...zIndexTokens,
];

// ── Token Map (for O(1) lookup) ────────────────────────────

export const tokenMap: Map<string, DesignToken> = new Map(
  allTokens.map((token) => [token.name, token])
);
