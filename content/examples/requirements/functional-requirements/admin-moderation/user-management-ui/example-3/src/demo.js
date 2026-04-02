function detectUnsafeSuspension(caseFiles) {
  const blocked = caseFiles
    .filter((caseFile) => caseFile.openAppeal || caseFile.billingHold || caseFile.legalFreeze || caseFile.activeFraudInvestigation)
    .map((caseFile) => caseFile.id);
  return {
    blocked,
    requireOverride: blocked.length > 0
  };
}

console.log(
  detectUnsafeSuspension([
    { id: "u1", openAppeal: true, billingHold: false, legalFreeze: false, activeFraudInvestigation: false },
    { id: "u2", openAppeal: false, billingHold: false, legalFreeze: false, activeFraudInvestigation: false }
  ])
);
