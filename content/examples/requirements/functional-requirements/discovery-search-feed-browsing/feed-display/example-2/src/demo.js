function groupByType(items) {
  return items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});
}

console.log(groupByType([{ type: "article" }, { type: "collection" }, { type: "article" }]));
