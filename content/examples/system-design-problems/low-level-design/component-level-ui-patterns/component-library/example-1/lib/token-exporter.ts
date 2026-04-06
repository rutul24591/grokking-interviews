// ============================================================
// lib/token-exporter.ts
// Multi-platform token exporter: CSS, JS, JSON
// ============================================================

import type { DesignToken } from "./library-types";
import { allTokens, tokenMap } from "./design-tokens";

// ── Alias Resolution ────────────────────────────────────────

/**
 * Resolve all token aliases, returning a fully dereferenced map.
 * Detects circular references using a visited-set traversal.
 */
function resolveAliases(
  tokens: DesignToken[]
): Map<string, string> {
  const resolved = new Map<string, string>();
  const resolving = new Set<string>(); // cycle detection

  function resolve(token: DesignToken): string {
    if (resolved.has(token.name)) {
      return resolved.get(token.name)!;
    }

    if (resolving.has(token.name)) {
      throw new Error(
        `Circular token reference detected: ${token.name} ` +
        `is part of a cycle. Chain: ${[...resolving].join(" -> ")} -> ${token.name}`
      );
    }

    resolving.add(token.name);

    const value = token.alias
      ? resolve(tokenMap.get(token.alias)!)
      : token.value;

    resolving.delete(token.name);
    resolved.set(token.name, value);
    return value;
  }

  for (const token of tokens) {
    resolve(token);
  }

  return resolved;
}

// ── CSS Custom Properties Export ────────────────────────────

/**
 * Generate a CSS string with all tokens as CSS custom properties
 * inside a :root selector.
 */
export function exportCSS(
  tokens: DesignToken[] = allTokens,
  selector: string = ":root"
): string {
  const resolved = resolveAliases(tokens);
  const declarations = [...resolved.entries()]
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n");

  return `${selector} {\n${declarations}\n}`;
}

/**
 * Generate CSS custom properties for a scoped theme.
 * Only includes the tokens provided (delta injection).
 */
export function exportCSSTheme(
  themeTokens: Record<string, string>,
  selector: string = "[data-theme]"
): string {
  const declarations = Object.entries(themeTokens)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n");

  return `${selector} {\n${declarations}\n}`;
}

// ── JavaScript Object Export ────────────────────────────────

/**
 * Export tokens as a plain JavaScript object keyed by token name.
 * Used for programmatic access in React components.
 */
export function exportJS(
  tokens: DesignToken[] = allTokens
): Record<string, string> {
  return Object.fromEntries(resolveAliases(tokens));
}

// ── W3C Design Tokens JSON Export ───────────────────────────

/**
 * Export tokens in the W3C Design Tokens Community Group format.
 * Consumed by Style Dictionary, iOS, Android tooling.
 */
export interface W3CTokenGroup {
  $type?: string;
  $value?: string;
  $description?: string;
  [key: string]: string | undefined;
}

export interface W3CTokenFile {
  $schema: string;
  [group: string]: Record<string, W3CTokenGroup> | string;
}

export function exportJSON(
  tokens: DesignToken[] = allTokens
): W3CTokenFile {
  const resolved = resolveAliases(tokens);
  const output: W3CTokenFile = {
    $schema: "https://design-tokens.github.io/community-group/format/",
  };

  // Group tokens by category
  for (const token of tokens) {
    const groupName = token.category;
    if (!output[groupName]) {
      output[groupName] = {};
    }

    const group = output[groupName] as Record<string, W3CTokenGroup>;
    group[token.name] = {
      $value: resolved.get(token.name)!,
      $description: token.description,
    };

    if (token.deprecated) {
      group[token.name].$extensions = JSON.stringify({
        deprecated: true,
        replacement: token.replacement,
      });
    }
  }

  return output;
}

// ── CLI Entrypoint ──────────────────────────────────────────

/**
 * Run all exports and return them as a map of format → output.
 * In production, this writes files to disk.
 */
export function runAllExports(): Record<string, string> {
  return {
    "tokens.css": exportCSS(),
    "tokens.js": `export default ${JSON.stringify(exportJS(), null, 2)};`,
    "tokens.json": JSON.stringify(exportJSON(), null, 2),
  };
}
