function detectAuditTamperRisk(sequenceNumbers, hashes) {
  const expected = Array.from({ length: sequenceNumbers.length }, (_, index) => sequenceNumbers[0] + index);
  const missing = expected.filter((value) => !sequenceNumbers.includes(value));
  const hashMismatch = hashes.filter((entry) => entry.expected !== entry.actual).map((entry) => entry.id);
  return {
    risky: missing.length > 0 || hashMismatch.length > 0,
    missing,
    hashMismatch
  };
}

console.log(
  detectAuditTamperRisk(
    [101, 102, 104],
    [
      { id: "a-101", expected: "h1", actual: "h1" },
      { id: "a-104", expected: "h4", actual: "broken" }
    ]
  )
);
