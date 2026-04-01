function dedupeFeed(ids) {
  return Array.from(new Set(ids));
}

console.log(dedupeFeed(["f1", "f2", "f2", "f3"]));
