function dedupeAcrossModules(modules) {
  const seen = new Set();
  return modules.map((module) => ({
    id: module.id,
    itemIds: module.itemIds.filter((itemId) => {
      if (seen.has(itemId)) return false;
      seen.add(itemId);
      return true;
    })
  }));
}
console.log(dedupeAcrossModules([
  { id: 'hero', itemIds: ['a', 'b', 'c'] },
  { id: 'sidebar', itemIds: ['b', 'd'] }
]));
