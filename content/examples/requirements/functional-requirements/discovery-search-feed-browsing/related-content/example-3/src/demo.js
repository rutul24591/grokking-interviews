function removeSelfAndDuplicates(currentId, ids) {
  const seen = new Set();
  return ids.filter((id) => id !== currentId && !seen.has(id) && seen.add(id));
}
console.log(removeSelfAndDuplicates('current', ['current', 'a', 'b', 'a', 'c']));
