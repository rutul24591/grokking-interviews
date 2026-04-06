// ============================================================
// hooks/use-token-resolution.ts
// Resolve token references to their current theme values
// ============================================================

import { useRef, useCallback } from "react";

// ── Token Context ───────────────────────────────────────────

/**
 * React context that provides the current theme's token values
 * and the container element reference for computed style lookup.
 *
 * This context is created by TokenProvider and consumed by
 * useTokenResolution and useThemeTokens hooks.
 */
export interface TokenContextValue {
  /** The container element with CSS variable injections */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Pre-resolved token values from the theme */
  resolvedTokens: Map<string, string>;
}

// Create a module-level context holder (set by TokenProvider)
let tokenContextHolder: TokenContextValue | null = null;

/**
 * Internal: called by TokenProvider to set the context.
 */
export function setTokenContext(value: TokenContextValue): void {
  tokenContextHolder = value;
}

/**
 * Internal: get the current context.
 */
function getTokenContext(): TokenContextValue {
  if (!tokenContextHolder) {
    throw new Error(
      "useTokenResolution must be used within a TokenProvider. " +
      "Wrap your component tree with <TokenProvider>."
    );
  }
  return tokenContextHolder;
}

// ── Hook ────────────────────────────────────────────────────

/**
 * Resolve a design token name to its current theme value.
 *
 * Primary resolution strategy: look up the value from the
 * pre-resolved token map provided by the theme. This is O(1)
 * and does not require DOM access.
 *
 * Fallback strategy: if the token is not in the resolved map
 * (e.g., a custom CSS variable), read the computed style from
 * the provider container element.
 *
 * Usage:
 *   const primaryColor = useTokenResolution("color-primary");
 *   // Returns "#3b82f6" in light theme, different in dark
 */
export function useTokenResolution(tokenName: string): string {
  const context = getTokenContext();

  const resolveToken = useCallback(
    (name: string): string => {
      // Try the resolved token map first (O(1))
      const resolved = context.resolvedTokens.get(name);
      if (resolved) return resolved;

      // Fallback: read computed style from container
      const container = context.containerRef.current;
      if (container) {
        const computed = window.getComputedStyle(container);
        const cssVarName = name.startsWith("--")
          ? name
          : `--${name}`;
        return computed.getPropertyValue(cssVarName).trim();
      }

      return "";
    },
    [context]
  );

  return resolveToken(tokenName);
}

/**
 * Resolve multiple tokens at once.
 * Returns a map of token name → resolved value.
 *
 * Usage:
 *   const colors = useTokenResolutionMany([
 *     "color-primary",
 *     "color-bg-primary",
 *     "color-text-primary",
 *   ]);
 */
export function useTokenResolutionMany(
  tokenNames: string[]
): Map<string, string> {
  const context = getTokenContext();

  const resolveMany = useCallback(
    (names: string[]): Map<string, string> => {
      const result = new Map<string, string>();

      for (const name of names) {
        const resolved = context.resolvedTokens.get(name);
        if (resolved) {
          result.set(name, resolved);
          continue;
        }

        const container = context.containerRef.current;
        if (container) {
          const computed = window.getComputedStyle(container);
          const cssVarName = name.startsWith("--") ? name : `--${name}`;
          result.set(name, computed.getPropertyValue(cssVarName).trim());
        }
      }

      return result;
    },
    [context]
  );

  return resolveMany(tokenNames);
}
