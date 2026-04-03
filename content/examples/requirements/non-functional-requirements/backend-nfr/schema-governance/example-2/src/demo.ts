type Change = { field: string; change: 'add_optional' | 'remove' | 'type_change'; required: boolean };

function assessCompatibility(change: Change) {
  const compatible = change.change === 'add_optional';
  return {
    field: change.field,
    compatible,
    action: compatible ? 'allow-new-version' : 'require-new-major-or-migration-plan',
  };
}

const results = [
  { field: 'discountCode', change: 'add_optional', required: false },
  { field: 'status', change: 'type_change', required: true },
].map(assessCompatibility);

console.table(results);
if (results[1].action !== 'require-new-major-or-migration-plan') throw new Error('Type changes must be gated');
