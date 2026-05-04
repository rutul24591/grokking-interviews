export type SearchParams = Record<string, string | string[]>;

export type SearchUiState = {
  q: string;
  filters: Record<string, string[]>; // facetKey -> selected values
  sort: { key: string; dir: "asc" | "desc" } | null;
};

export function encodeState(state: SearchUiState): URLSearchParams {
  const p = new URLSearchParams();
  if (state.q.trim()) p.set("q", state.q.trim());
  if (state.sort) p.set("sort", `${state.sort.key}:${state.sort.dir}`);
  for (const [k, vals] of Object.entries(state.filters)) {
    for (const v of vals) p.append(`f.${k}`, v);
  }
  return p;
}

export function decodeState(params: URLSearchParams): SearchUiState {
  const q = params.get("q") ?? "";
  const sortRaw = params.get("sort");
  const sort = sortRaw
    ? (() => {
        const [key, dir] = sortRaw.split(":");
        return key && (dir === "asc" || dir === "desc") ? { key, dir } : null;
      })()
    : null;

  const filters: Record<string, string[]> = {};
  for (const [k, v] of params.entries()) {
    if (!k.startsWith("f.")) continue;
    const facet = k.slice(2);
    (filters[facet] ??= []).push(v);
  }

  // Deterministic ordering (important for stable URLs and caching)
  for (const k of Object.keys(filters)) filters[k] = [...new Set(filters[k])].sort();

  return { q, filters, sort };
}

export function canonicalize(params: URLSearchParams) {
  const entries = [...params.entries()].sort((a, b) => (a[0] === b[0] ? a[1].localeCompare(b[1]) : a[0].localeCompare(b[0])));
  const out = new URLSearchParams();
  for (const [k, v] of entries) out.append(k, v);
  return out;
}

