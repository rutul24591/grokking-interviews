function pickStorageClass({ monthlyReads, retentionDays, restoreNeed }) {
  if (monthlyReads > 50 || restoreNeed === "instant") return { storageClass: "standard", restoreEta: "instant" };
  if (retentionDays < 90) return { storageClass: "infrequent", restoreEta: "minutes" };
  return { storageClass: "archive", restoreEta: "hours" };
}

console.log(pickStorageClass({ monthlyReads: 3, retentionDays: 180, restoreNeed: "hours" }));
