function normalizeTag(tag) {
  return tag.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");
}

console.log(["Storage", "storage ", "storage!"].map(normalizeTag));
