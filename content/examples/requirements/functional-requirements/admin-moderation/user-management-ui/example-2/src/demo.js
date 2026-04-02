function chooseBulkAction(selection) {
  return {
    action:
      selection.highRiskCount > 0
        ? "require-second-review"
        : selection.count > 50
          ? "batch-export"
          : "inline-update",
    freezeIfMixedJurisdictions: selection.jurisdictionCount > 1
  };
}

console.log(chooseBulkAction({ count: 12, highRiskCount: 2, jurisdictionCount: 2 }));
