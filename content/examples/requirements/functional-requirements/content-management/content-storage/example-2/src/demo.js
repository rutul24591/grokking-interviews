function chooseStoragePolicy(entry) {
  const tier = entry.accessPattern === "frequent" ? "hot" : entry.accessPattern === "occasional" ? "warm" : "cold";
  const retentionDays = entry.complianceClass === "regulated" ? Math.max(entry.retentionDays, 365) : entry.retentionDays;
  const encryption = entry.complianceClass === "regulated" ? "customer-key" : "managed";
  return { tier, retentionDays, encryption };
}

console.log(chooseStoragePolicy({ accessPattern: "occasional", retentionDays: 90, complianceClass: "regulated" }));
