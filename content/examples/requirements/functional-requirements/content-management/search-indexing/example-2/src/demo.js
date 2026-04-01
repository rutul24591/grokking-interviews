function reindexDecision(changedFields) {
  const indexedFields = ["title", "summary", "tags", "body"];
  const matchedFields = changedFields.filter((field) => indexedFields.includes(field));
  return {
    enqueue: matchedFields.length > 0,
    matchedFields
  };
}

console.log(reindexDecision(["title", "updatedAt", "body"]));
