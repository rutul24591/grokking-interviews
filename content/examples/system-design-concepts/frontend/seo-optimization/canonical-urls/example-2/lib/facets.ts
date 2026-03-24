export type Facets = { color?: string; size?: string; sort?: string };

export function canonicalForFacets(f: Facets) {
  // Indexable: category pages by color; non-indexable: size permutations, arbitrary sorts.
  if (f.color && !f.size && (!f.sort || f.sort === "relevance")) {
    return `/shop/${encodeURIComponent(f.color)}`;
  }
  return "/shop";
}

export function robotsForFacets(f: Facets) {
  const canonical = canonicalForFacets(f);
  const index = canonical !== "/shop" && canonical !== "/shop";
  // If this is not the canonical/indexable variant, noindex but follow links.
  return index ? "index,follow" : "noindex,follow";
}

