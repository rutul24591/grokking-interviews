function resolve(slugs, requested, requestedTab) {
  const safeSlug = slugs.includes(requested) ? requested : "caching-patterns";
  const safeTab = ["overview", "architecture", "tradeoffs", "pitfalls"].includes(requestedTab) ? requestedTab : "overview";
  return { slug: safeSlug, tab: safeTab, redirected: safeSlug !== requested || safeTab !== requestedTab };
}

console.log(resolve(["caching-patterns", "route-guards"], "deleted-article", "pitfalls"));
console.log(resolve(["caching-patterns", "route-guards"], "route-guards", "unknown"));
