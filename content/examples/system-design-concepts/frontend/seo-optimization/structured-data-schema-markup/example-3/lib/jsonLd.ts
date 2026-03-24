export function jsonLdScriptContent(value: unknown): string {
  // JSON stringify is the key safety property here: we never interpret user HTML.
  return JSON.stringify(value);
}

export function dedupeSchemas(arr: Array<Record<string, unknown>>) {
  const seen = new Set<string>();
  const out: Array<Record<string, unknown>> = [];
  for (const s of arr) {
    const key = `${s["@type"] ?? "unknown"}:${s["url"] ?? s["name"] ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

