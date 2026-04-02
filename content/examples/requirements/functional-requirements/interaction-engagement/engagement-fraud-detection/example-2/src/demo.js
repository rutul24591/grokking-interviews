function scoreFraudSignals(signals) {
  return signals.map((signal) => {
    const score = signal.velocityWeight + signal.graphWeight + signal.deviceWeight + signal.repeatAccountWeight;
    return {
      id: signal.id,
      score,
      route: score >= 90 ? "block" : score > 75 ? "review" : "monitor",
      suppressCounterImpact: score >= 75
    };
  });
}

console.log(scoreFraudSignals([
  { id: "fd-1", velocityWeight: 32, graphWeight: 28, deviceWeight: 21, repeatAccountWeight: 14 },
  { id: "fd-2", velocityWeight: 10, graphWeight: 16, deviceWeight: 11, repeatAccountWeight: 8 }
]));
