function detectFraudDetectionEdgeCases(cases) {
  const falsePositives = cases.filter((entry) => entry.verifiedCustomer && entry.score > entry.maxTrustedScore).map((entry) => entry.id);
  const delayedSignals = cases.filter((entry) => entry.signalLatencyMs > entry.maxSignalLatencyMs).map((entry) => entry.id);
  return {
    falsePositives,
    delayedSignals,
    requireManualOverride: falsePositives.length > 0,
    pauseRealtimeDecisioning: delayedSignals.length > 0
  };
}

console.log(detectFraudDetectionEdgeCases([
  { id: "fraud-1", verifiedCustomer: true, score: 88, maxTrustedScore: 60, signalLatencyMs: 120, maxSignalLatencyMs: 80 },
  { id: "fraud-2", verifiedCustomer: false, score: 45, maxTrustedScore: 60, signalLatencyMs: 30, maxSignalLatencyMs: 80 }
]));
