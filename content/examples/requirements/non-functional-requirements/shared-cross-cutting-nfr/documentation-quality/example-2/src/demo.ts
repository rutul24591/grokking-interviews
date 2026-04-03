type DocFile = { file: string; hasOverview: boolean; hasRunbook: boolean; hasOwner: boolean };

function lintDoc(file: DocFile) {
  const missing = [!file.hasOverview && 'overview', !file.hasRunbook && 'runbook', !file.hasOwner && 'owner'].filter(Boolean);
  return {
    file: file.file,
    pass: missing.length === 0,
    missing,
  };
}

const results = [
  { file: 'payments.md', hasOverview: true, hasRunbook: true, hasOwner: true },
  { file: 'search.md', hasOverview: true, hasRunbook: false, hasOwner: false },
].map(lintDoc);

console.table(results);
if (results[1].pass) throw new Error('Missing runbook and owner should fail doc quality check');
