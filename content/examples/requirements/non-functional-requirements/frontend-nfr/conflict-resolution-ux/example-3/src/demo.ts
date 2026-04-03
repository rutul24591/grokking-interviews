type MergeCase = { localEdits: number; remoteEdits: number; sameFieldConflict: boolean };

function chooseConflictUx(input: MergeCase) {
  return {
    ...input,
    strategy: input.sameFieldConflict ? 'show-side-by-side-merge' : input.remoteEdits > 0 ? 'auto-merge-and-highlight' : 'save-directly',
  };
}

const results = [
  { localEdits: 2, remoteEdits: 0, sameFieldConflict: false },
  { localEdits: 3, remoteEdits: 4, sameFieldConflict: true },
].map(chooseConflictUx);

console.table(results);
if (results[1].strategy !== 'show-side-by-side-merge') throw new Error('Field conflict should show merge UI');

console.log(JSON.stringify({ ok: true }, null, 2));
