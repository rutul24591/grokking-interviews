function storageComplianceGate(entries) {
  const violations = entries
    .filter((entry) => entry.encryption === "managed" && entry.complianceClass === "regulated")
    .map((entry) => entry.contentType);
  return {
    blocked: violations.length > 0,
    violations
  };
}

console.log(
  storageComplianceGate([
    { contentType: "article-body", encryption: "managed", complianceClass: "standard" },
    { contentType: "deleted-media", encryption: "managed", complianceClass: "regulated" }
  ])
);
