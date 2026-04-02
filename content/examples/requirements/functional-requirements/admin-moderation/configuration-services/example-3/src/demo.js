function detectConfigDrift(entries, approvedWindowOpen) {
  const drifted = entries.filter((entry) => entry.prodValue !== entry.stagingValue).map((entry) => entry.key);
  const blastRadius = entries.filter((entry) => entry.prodValue !== entry.stagingValue && entry.dependentServices > 3).map((entry) => entry.key);
  return {
    drifted,
    blocked: drifted.length > 0 && !approvedWindowOpen,
    blastRadius
  };
}

console.log(
  detectConfigDrift(
    [
      { key: "moderation.threshold", prodValue: "72", stagingValue: "80", dependentServices: 5 },
      { key: "appeal.sla", prodValue: "24h", stagingValue: "24h", dependentServices: 2 }
    ],
    false
  )
);
