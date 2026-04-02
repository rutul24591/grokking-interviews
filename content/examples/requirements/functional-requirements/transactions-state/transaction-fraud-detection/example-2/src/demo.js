function chooseFraudDecision(cases) {
  return cases.map((entry) => ({
    id: entry.id,
    decision: entry.score > 90 ? "block" : entry.score > 70 ? "review" : "allow",
    holdCapture: entry.score > 70,
    notifyRiskTeam: entry.highVelocity || entry.sharedDevice
  }));
}

console.log(chooseFraudDecision([
  { id: "fraud-1", score: 25, highVelocity: false, sharedDevice: false },
  { id: "fraud-2", score: 93, highVelocity: true, sharedDevice: true }
]));
