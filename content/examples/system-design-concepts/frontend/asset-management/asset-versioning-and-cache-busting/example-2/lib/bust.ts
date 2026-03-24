export type Strategy = "query" | "filename";

export function urlWithQuery(path: string, version: string): string {
  const url = new URL(path, "https://example.invalid");
  url.searchParams.set("v", version);
  return url.pathname + url.search;
}

export function urlWithFilenameHash(path: string, hash: string): string {
  const idx = path.lastIndexOf(".");
  if (idx === -1) return `${path}.${hash}`;
  return `${path.slice(0, idx)}.${hash}${path.slice(idx)}`;
}

export function recommendedCacheControl(strategy: Strategy): string {
  if (strategy === "filename") return "public, max-age=31536000, immutable";
  return "public, max-age=300";
}

