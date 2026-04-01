function tagQuality(tags, allowedVocabulary) {
  const normalized = tags.map((tag) => tag.toLowerCase().trim());
  const duplicates = normalized.filter((tag, index) => normalized.indexOf(tag) !== index);
  const unknown = normalized.filter((tag) => !allowedVocabulary.includes(tag));
  return {
    quality: normalized.length >= 3 && duplicates.length === 0 && unknown.length === 0 ? "high" : normalized.length === 0 ? "low" : "medium",
    review: duplicates.length > 0 || unknown.length > 0 || normalized.length < 2,
    duplicates,
    unknown
  };
}

console.log(tagQuality(["Frontend", "frontend", "rendering"], ["frontend", "rendering", "state"]));
