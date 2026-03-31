function collision(entries) {
  const seen = new Map();
  return entries.filter((entry) => {
    const existing = seen.get(entry.slug);
    if (existing && existing !== entry.type) return true;
    seen.set(entry.slug, entry.type);
    return false;
  });
}

console.log(collision([{ type: "article", slug: "routing" }, { type: "author", slug: "routing" }]));
