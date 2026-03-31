function normalize(url) {
  const [path, query = ""] = url.split("?");
  const params = new URLSearchParams(query);
  if (!params.has("tab")) params.set("tab", "overview");
  if (!params.has("section")) params.set("section", "definition-context");
  return {
    canonical: `${path}?${params.toString()}`,
    shareKey: `${path}:${params.get("tab")}:${params.get("section")}`
  };
}

console.log(normalize("/articles/streaming-ssr"));
