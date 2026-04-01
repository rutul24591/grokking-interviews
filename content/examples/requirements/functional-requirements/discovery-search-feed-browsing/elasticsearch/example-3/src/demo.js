function searchFallback({ indexFields, requestedFields, hitCount }) {
  if (hitCount > 0) return { action: "use-hits", missingFields: [] };
  return {
    action: "warn-and-relax",
    missingFields: requestedFields.filter((field) => !indexFields.includes(field))
  };
}

console.log(searchFallback({ indexFields: ["title", "summary"], requestedFields: ["title", "body"], hitCount: 0 }));
