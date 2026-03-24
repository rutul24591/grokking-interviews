export type CacheKeyInput = {
  url: string;
  headers: Record<string, string | undefined>;
  ignoreQueryPrefixes?: string[];
  varyHeaders?: string[];
};

function normalizeQuery(url: URL, ignorePrefixes: string[]) {
  const kept = [];
  for (const [k, v] of url.searchParams.entries()) {
    if (ignorePrefixes.some((p) => k.toLowerCase().startsWith(p))) continue;
    kept.push([k, v]);
  }
  kept.sort((a, b) => (a[0] + "=" + a[1]).localeCompare(b[0] + "=" + b[1]));
  url.search = "";
  for (const [k, v] of kept) url.searchParams.append(k, v);
}

export function computeCacheKey(input: CacheKeyInput): string {
  const ignore = input.ignoreQueryPrefixes ?? ["utm_", "fbclid", "gclid"];
  const vary = (input.varyHeaders ?? ["accept", "accept-encoding"]).map((h) => h.toLowerCase());

  const u = new URL(input.url, "https://example.invalid");
  normalizeQuery(u, ignore);

  const headerParts = vary
    .map((h) => `${h}:${(input.headers[h] ?? input.headers[h.toLowerCase()] ?? "").toString().trim()}`)
    .join("|");

  return `${u.pathname}${u.search}#${headerParts}`;
}

