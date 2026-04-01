function editorConflict(localRevision, serverRevision) {
  return {
    conflict: localRevision < serverRevision,
    action: localRevision < serverRevision ? "merge-required" : "save-allowed"
  };
}

console.log(editorConflict(18, 20));
