function complianceCoverage(obligations) {
  const uncovered = obligations.filter((entry) => !entry.owner).map((entry) => entry.rule);
  const staleEvidence = obligations.filter((entry) => entry.evidenceDaysOld > entry.maxEvidenceAge).map((entry) => entry.rule);
  return {
    covered: uncovered.length === 0 && staleEvidence.length === 0,
    uncovered,
    staleEvidence
  };
}

console.log(
  complianceCoverage([
    { rule: "Deletion export", owner: "privacy-team", evidenceDaysOld: 2, maxEvidenceAge: 7 },
    { rule: "Youth-safety review", owner: "", evidenceDaysOld: 18, maxEvidenceAge: 10 }
  ])
);
