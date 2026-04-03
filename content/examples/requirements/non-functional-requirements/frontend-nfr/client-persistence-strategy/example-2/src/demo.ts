type StoredDraft = { version: number; hasRequiredFields: boolean; schemaMigrated: boolean; source: 'localStorage' | 'indexeddb' };

function validateDraft(draft: StoredDraft) {
  return {
    source: draft.source,
    usable: draft.hasRequiredFields && draft.schemaMigrated,
    action: draft.hasRequiredFields && draft.schemaMigrated ? 'hydrate-editor' : draft.source === 'localStorage' ? 'discard-and-start-fresh' : 'migrate-before-hydrate',
  };
}

const results = [
  { version: 1, hasRequiredFields: false, schemaMigrated: false, source: 'localStorage' },
  { version: 2, hasRequiredFields: true, schemaMigrated: true, source: 'indexeddb' },
].map(validateDraft);

console.table(results);
if (results[0].action !== 'discard-and-start-fresh') throw new Error('Broken local draft should be discarded');
