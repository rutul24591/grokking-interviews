const taggingState = {
  category: "content-management",
  tags: ["storage", "retention"],
  suggestions: ["compliance", "publishing"],
  lastMessage: "Taxonomy management should normalize tags and preserve category ownership instead of allowing uncontrolled drift."
};

export function snapshot() {
  return structuredClone(taggingState);
}

export function mutate(type: "add-tag" | "switch-category") {
  if (type === "add-tag" && taggingState.suggestions.length > 0) {
    const suggestion = taggingState.suggestions.shift();
    if (suggestion) taggingState.tags.push(suggestion);
    taggingState.lastMessage = "Applied one suggested tag and updated editorial taxonomy coverage.";
  }

  if (type === "switch-category") {
    taggingState.category = taggingState.category === "content-management" ? "discovery-search-feed-browsing" : "content-management";
    taggingState.lastMessage = `Switched category to ${taggingState.category} to reflect new ownership.`;
  }

  return snapshot();
}
