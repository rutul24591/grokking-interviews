function rejectReplay(previousAssertions, assertionId) {
  return previousAssertions.includes(assertionId);
}

console.log(rejectReplay(["assertion-001", "assertion-002"], "assertion-003"));
console.log(rejectReplay(["assertion-001", "assertion-002"], "assertion-002"));
