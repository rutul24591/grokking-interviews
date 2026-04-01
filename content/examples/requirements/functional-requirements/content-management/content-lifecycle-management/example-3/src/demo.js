function archiveDecision(entry) {
  return {
    archive: !entry.hasActiveReferences && !entry.legalHold,
    reason: entry.legalHold ? "legal-hold" : entry.hasActiveReferences ? "linked-from-live-pages" : "safe-to-retire",
    purgeAllowed: !entry.hasActiveReferences && !entry.legalHold && entry.daysArchived > 30
  };
}

console.log(archiveDecision({ hasActiveReferences: false, legalHold: true, daysArchived: 45 }));
