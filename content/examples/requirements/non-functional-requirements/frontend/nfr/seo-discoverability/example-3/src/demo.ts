function canonical(path: string, params: Record<string, string>) {
  // Example: avoid indexing internal tracking params.
  const drop = new Set(["utm_source", "utm_medium", "utm_campaign", "gclid"]);
  const kept = Object.entries(params).filter(([k]) => !drop.has(k));
  const qs = kept.length ? "?" + new URLSearchParams(kept).toString() : "";
  return `https://example.com${path}${qs}`;
}

const url = canonical("/articles/design-cache-keys", {
  utm_source: "twitter",
  utm_campaign: "launch",
  page: "2"
});

console.log(
  JSON.stringify(
    {
      canonical: url,
      note: [
        "Canonicalization prevents duplicate content (tracking params, sort variants, pagination).",
        "Pagination typically needs rel=prev/next and consistent canonical rules."
      ]
    },
    null,
    2,
  ),
);

