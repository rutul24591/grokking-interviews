function detectFraudEdgeCases(cases) {
  const risky = cases.filter((entry) => entry.sharedIp && entry.verifiedUsers > 0).map((entry) => entry.id);
  const falsePositiveRisk = cases.filter((entry) => entry.campusNetwork || entry.familyDevice).map((entry) => entry.id);
  return {
    risky,
    falsePositiveRisk,
    requireManualExemption: risky.length > 0 && falsePositiveRisk.length > 0,
    holdScoreDecay: cases.some((entry) => entry.accountAgeDays > 365 && entry.sharedIp)
  };
}

console.log(detectFraudEdgeCases([
  { id: "fd-1", sharedIp: true, verifiedUsers: 2, campusNetwork: true, familyDevice: false, accountAgeDays: 620 },
  { id: "fd-2", sharedIp: false, verifiedUsers: 0, campusNetwork: false, familyDevice: false, accountAgeDays: 12 }
]));
