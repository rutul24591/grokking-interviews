function guardValidationResponse({ requestId, latestRequestId, status }) {
  if (requestId < latestRequestId) {
    return { apply: false, reason: "stale-response", preserveStatus: true };
  }
  return { apply: true, reason: status === "429" ? "service-throttled" : "latest-response", preserveStatus: status === "429" };
}

console.log([
  { requestId: 5, latestRequestId: 7, status: "200" },
  { requestId: 8, latestRequestId: 8, status: "429" },
  { requestId: 9, latestRequestId: 9, status: "200" }
].map(guardValidationResponse));
