function storageCompliance(records) {
  const violations = records.filter((record) => !record.encrypted || record.retentionDays < 30).map((record) => record.key);
  return {
    compliant: violations.length === 0,
    violations
  };
}

console.log(storageCompliance([{ key: "articles/hero.png", encrypted: true, retentionDays: 365 }, { key: "drafts/tmp.zip", encrypted: false, retentionDays: 14 }]));
