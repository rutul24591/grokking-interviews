type CacheKey = { path: string; locale?: string; userSegment?: string };

function key(k: CacheKey) {
  // Demonstration: adding userSegment explodes cache cardinality.
  return `${k.path}|l=${k.locale ?? "en"}|seg=${k.userSegment ?? "public"}`;
}

const keys = [
  key({ path: "/article/123", locale: "en" }),
  key({ path: "/article/123", locale: "fr" }),
  key({ path: "/article/123", locale: "en", userSegment: "paid" }),
  key({ path: "/article/123", locale: "en", userSegment: "free" })
];

console.log(
  JSON.stringify(
    {
      keys,
      note: [
        "Personalization makes CDN caching harder (higher key cardinality).",
        "Consider rendering a shared shell statically and fetching personalized fragments on the client/server.",
        "Always audit cache keys to avoid data leaks across users."
      ]
    },
    null,
    2,
  ),
);

