function chooseLedgerPath(entries) {
  return entries.map((entry) => ({
    id: entry.id,
    writeLedger: entry.kind === "charge" || entry.kind === "refund",
    requireAuditTrail: entry.materialAdjustment || entry.kind === "refund",
    blockMutation: entry.immutableCopyMissing
  }));
}

console.log(chooseLedgerPath([
  { id: "log-1", kind: "charge", materialAdjustment: false, immutableCopyMissing: false },
  { id: "log-2", kind: "adjustment", materialAdjustment: true, immutableCopyMissing: true }
]));
