function evaluateDeadlineRisk(requests) {
  const risky = requests.map((request) => ({
    id: request.id,
    missed: request.hoursRemaining < 24 && !request.ownerAssigned,
    escalate: request.hoursRemaining < 24 || request.jurisdiction === "DE" || request.parallelRequests > 1,
    freezeDeletion: request.evidenceAttached === false
  }));
  return {
    risky,
    pageCounsel: risky.some((entry) => entry.escalate)
  };
}

console.log(
  evaluateDeadlineRisk([
    { id: "lr-1", hoursRemaining: 8, ownerAssigned: false, jurisdiction: "DE", parallelRequests: 2, evidenceAttached: false },
    { id: "lr-2", hoursRemaining: 42, ownerAssigned: true, jurisdiction: "US", parallelRequests: 0, evidenceAttached: true }
  ])
);
