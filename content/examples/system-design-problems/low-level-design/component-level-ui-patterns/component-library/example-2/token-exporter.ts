/**
 * Design Token Exporter — Exports tokens in multiple formats for different platforms.
 *
 * Interview edge case: Design tokens need to be consumed by web (CSS variables),
 * iOS (Swift), and Android (XML). The exporter generates platform-specific files
 * from a single token definition source.
 */

export interface DesignToken {
  name: string;
  value: string | number;
  category: 'color' | 'spacing' | 'typography' | 'shadow' | 'radius';
  description?: string;
}

/**
 * Exports tokens as CSS custom properties in a :root block.
 */
export function exportAsCSS(tokens: DesignToken[]): string {
  const lines = [':root {'];
  for (const token of tokens) {
    const cssName = token.name.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --${cssName}: ${token.value};`);
  }
  lines.push('}');
  return lines.join('\n');
}

/**
 * Exports tokens as a TypeScript object for programmatic access.
 */
export function exportAsTypeScript(tokens: DesignToken[]): string {
  const lines = ['export const tokens = {'];
  for (const token of tokens) {
    const value = typeof token.value === 'string' ? `'${token.value}'` : token.value;
    lines.push(`  ${token.name}: ${value},`);
  }
  lines.push('} as const;');
  return lines.join('\n');
}

/**
 * Exports tokens as JSON for build tool consumption.
 */
export function exportAsJSON(tokens: DesignToken[]): string {
  return JSON.stringify(
    tokens.reduce<Record<string, unknown>>((acc, token) => {
      acc[token.name] = { value: token.value, category: token.category, description: token.description };
      return acc;
    }, {}),
    null,
    2,
  );
}
