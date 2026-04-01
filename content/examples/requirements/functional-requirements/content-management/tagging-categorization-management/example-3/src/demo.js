function taxonomyConflict(category, tag) {
  const invalidPairs = new Set(["identity-access:cdn", "content-management:oauth"]);
  const key = `${category}:${tag}`;
  return {
    valid: !invalidPairs.has(key),
    reason: invalidPairs.has(key) ? "invalid-category-tag-pair" : "valid"
  };
}

console.log(taxonomyConflict("identity-access", "cdn"));
