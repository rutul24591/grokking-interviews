const allowed = new Set(["event", "plan", "device", "article", "cohort"]);

function findUnknownKeys(payload) {
  return Object.keys(payload).filter((key) => !allowed.has(key));
}

console.log(findUnknownKeys({ event: "view", plan: "staff-plus", cohort: "spring-2026" }));
console.log(findUnknownKeys({ event: "view", plan: "staff-plus", campaignId: "abc123" }));
