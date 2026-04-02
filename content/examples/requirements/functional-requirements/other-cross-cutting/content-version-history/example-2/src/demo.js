function evaluateVersionHistory(revisions) {
  return revisions.map((entry) => ({
    revisionId: entry.revisionId,
    allowDiffView: entry.revisionExists && !entry.binaryOnlyChange,
    recommendRollback: entry.regressionConfirmed && !entry.newerApprovedVersion,
    branchReviewRequired: entry.parallelEditors || entry.metadataBodyConflict
  }));
}

console.log(JSON.stringify(evaluateVersionHistory([
  {
    "revisionId": "v-1",
    "revisionExists": true,
    "binaryOnlyChange": false,
    "regressionConfirmed": false,
    "newerApprovedVersion": false,
    "parallelEditors": false,
    "metadataBodyConflict": false
  },
  {
    "revisionId": "v-2",
    "revisionExists": true,
    "binaryOnlyChange": false,
    "regressionConfirmed": true,
    "newerApprovedVersion": false,
    "parallelEditors": true,
    "metadataBodyConflict": true
  },
  {
    "revisionId": "v-3",
    "revisionExists": false,
    "binaryOnlyChange": true,
    "regressionConfirmed": true,
    "newerApprovedVersion": true,
    "parallelEditors": false,
    "metadataBodyConflict": false
  }
]), null, 2));
