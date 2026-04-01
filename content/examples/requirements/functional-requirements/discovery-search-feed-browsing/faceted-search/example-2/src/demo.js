function facetCounts(items, field) {
  return items.reduce((acc, item) => {
    acc[item[field]] = (acc[item[field]] ?? 0) + 1;
    return acc;
  }, {});
}

console.log(facetCounts([{ level: "beginner" }, { level: "advanced" }, { level: "advanced" }], "level"));
