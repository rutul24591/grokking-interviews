function moderationFallback(entry) {
  if (entry.evidenceMissing) {
    return { action: "hold-decision", reason: "need-more-context", autoPublishBlocked: true };
  }
  if (entry.repeatOffender && entry.accountHistoryScore > 80) {
    return { action: "escalate-account-review", reason: "pattern-detected", autoPublishBlocked: true };
  }
  return { action: "apply-content-decision", reason: "sufficient-evidence", autoPublishBlocked: false };
}

console.log(moderationFallback({ evidenceMissing: false, repeatOffender: true, accountHistoryScore: 92 }));
