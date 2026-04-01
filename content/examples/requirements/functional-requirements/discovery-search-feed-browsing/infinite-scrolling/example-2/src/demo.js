function appendWindow(existingIds, incomingIds, pageSize) {
  const merged = [...existingIds];
  for (const id of incomingIds) {
    if (!merged.includes(id)) merged.push(id);
    if (merged.length === existingIds.length + pageSize) break;
  }
  return merged;
}

console.log(appendWindow(["card-1", "card-2"], ["card-2", "card-3", "card-4"], 2));
