type SchemaChange = { name: string; removedFields: string[]; incompatibleTypeChanges: string[]; defaultedFields: string[] };

function assessRelease(change: SchemaChange) {
  const breaking = change.removedFields.length > 0 || change.incompatibleTypeChanges.length > 0;
  return {
    release: change.name,
    breaking,
    action: breaking ? 'block-and-require-version-bump' : 'allow-additive-rollout',
    notes: [...change.removedFields, ...change.incompatibleTypeChanges, ...change.defaultedFields].join(', ') || 'none',
  };
}

const releases = [
  { name: 'v12-add-loyalty-tier', removedFields: [], incompatibleTypeChanges: [], defaultedFields: ['loyaltyTier'] },
  { name: 'v13-remove-discount-code', removedFields: ['discountCode'], incompatibleTypeChanges: [], defaultedFields: [] },
  { name: 'v14-string-to-int-status', removedFields: [], incompatibleTypeChanges: ['status:string->int'], defaultedFields: [] },
].map(assessRelease);

console.table(releases);
if (releases.filter((release) => release.breaking).length !== 2) {
  throw new Error('Expected two releases to be blocked as breaking changes');
}
