function parseSegments(path) {
  const parts = path.split("/").filter(Boolean);
  return {
    resource: parts[0],
    slug: parts[1],
    nestedResource: parts[2] ?? null,
    nestedSlug: parts[3] ?? null
  };
}

console.log(parseSegments("/collections/frontend-routing/articles/client-side-routing"));
