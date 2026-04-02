type Dataset = { name: string; pii: boolean; retentionDays: number; crossBorder: boolean; lawfulBasis: 'consent' | 'contract' | 'legitimate-interest' | 'none' };

function assessGovernance(dataset: Dataset) {
  const invalid = dataset.pii && dataset.lawfulBasis === 'none';
  const extraControls = dataset.crossBorder || dataset.retentionDays > 365;
  return {
    dataset: dataset.name,
    invalid,
    controls: extraControls ? 'dpa-plus-audit-log' : 'standard-catalog-entry',
    decision: invalid ? 'block-ingest' : 'allow-with-controls',
  };
}

const results = [
  { name: 'support-transcripts', pii: true, retentionDays: 90, crossBorder: false, lawfulBasis: 'contract' },
  { name: 'marketing-export', pii: true, retentionDays: 730, crossBorder: true, lawfulBasis: 'none' },
].map(assessGovernance);

console.table(results);
if (results[1].decision !== 'block-ingest') throw new Error('Marketing export should be blocked without lawful basis');
