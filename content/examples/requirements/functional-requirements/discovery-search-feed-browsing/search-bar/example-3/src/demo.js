function queryDecision(query, maxLength) {
  const trimmed = query.trim();
  if (!trimmed) return { action: "recent-searches-fallback", reason: "empty-input" };
  if (trimmed.length > maxLength) return { action: "reject", reason: "too-long" };
  if (/[:]{2,}/.test(trimmed)) return { action: "reject", reason: "malformed-filter-syntax" };
  return { action: "submit", reason: "valid" };
}

console.log(queryDecision("   ", 60));
console.log(queryDecision("topic::search", 60));
console.log(queryDecision("search ranking", 60));
