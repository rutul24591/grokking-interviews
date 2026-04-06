// ============================================================
// hooks/use-theme-tokens.ts
// Access current theme tokens in components
// ============================================================

import { useMemo } from "react";
import { setTokenContext, type TokenContextValue } from "./use-token-resolution";

// ── Theme Tokens Hook ───────────────────────────────────────

/**
 * Access the current theme's token values as a typed object.
 * Returns the full token map, allowing components to make
 * JavaScript-driven style decisions (e.g., canvas rendering,
 * SVG color generation) that cannot use CSS variables directly.
 *
 * Usage:
 *   const tokens = useThemeTokens();
 *   const primaryColor = tokens["color-primary"];
 *
 *   // For canvas/SVG rendering:
 *   ctx.fillStyle = tokens["color-primary"];
 */
export function useThemeTokens(): Record<string, string> {
  // In a real implementation, this would consume a React Context
  // provided by TokenProvider. For this example, we access the
  // module-level context holder.
  //
  // Real implementation:
  //   const context = useContext(TokenContext);
  //   return context.resolvedTokens;

  // Access the context through the token resolution module
  // This is a simplified version for demonstration
  const getTokenContext = (): TokenContextValue => {
    // This would normally read from React Context
    // For the example, we provide the interface
    throw new Error(
      "useThemeTokens must be used within a TokenProvider. " +
      "The real implementation consumes React Context."
    );
  };

  // In production, the hook reads from React Context:
  // const context = useContext(TokenContext);
  // return context.resolvedTokens;

  // For this example, return a placeholder demonstrating the API
  return useMemo(() => {
    try {
      const context = getTokenContext();
      return Object.fromEntries(context.resolvedTokens);
    } catch {
      return {};
    }
  }, []);
}

// ── Categorized Token Access ────────────────────────────────

/**
 * Get only tokens of a specific category.
 * Useful when a component only needs tokens from
 * one category (e.g., only colors, only spacing).
 *
 * Usage:
 *   const colors = useThemeTokensByCategory("color");
 *   // { "color-primary": "#3b82f6", "color-bg-primary": "#fff", ... }
 */
export function useThemeTokensByCategory(
  category: string
): Record<string, string> {
  const allTokens = useThemeTokens();

  return useMemo(() => {
    const filtered: Record<string, string> = {};
    for (const [name, value] of Object.entries(allTokens)) {
      if (name.startsWith(`${category}-`)) {
        filtered[name] = value;
      }
    }
    return filtered;
  }, [allTokens, category]);
}

// ── Specific Token Accessors ────────────────────────────────

/**
 * Convenience hook for accessing color tokens.
 */
export function useColorTokens(): Record<string, string> {
  return useThemeTokensByCategory("color");
}

/**
 * Convenience hook for accessing spacing tokens.
 */
export function useSpacingTokens(): Record<string, string> {
  return useThemeTokensByCategory("spacing");
}

/**
 * Convenience hook for accessing typography tokens.
 */
export function useTypographyTokens(): Record<string, string> {
  return useThemeTokensByCategory("font");
}
