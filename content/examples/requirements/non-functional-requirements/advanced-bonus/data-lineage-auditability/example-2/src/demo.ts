type Dataset = { name: string; owner: string | null; upstreams: number; hasPiiTag: boolean; hasRetentionPolicy: boolean };

function checkLineageReadiness(dataset: Dataset) {
  const missing = [!dataset.owner && 'owner', !dataset.hasPiiTag && 'pii-tag', !dataset.hasRetentionPolicy && 'retention-policy'].filter(Boolean);
  return {
    dataset: dataset.name,
    ready: missing.length === 0,
    missing,
    action: missing.length === 0 ? 'allow-publish-to-catalog' : 'block-and-request-metadata',
  };
}

const results = [
  { name: 'orders-fact', owner: 'analytics', upstreams: 3, hasPiiTag: true, hasRetentionPolicy: true },
  { name: 'marketing-export', owner: null, upstreams: 1, hasPiiTag: false, hasRetentionPolicy: true },
].map(checkLineageReadiness);

console.table(results);
if (results[1].action !== 'block-and-request-metadata') throw new Error('Export should be blocked for missing lineage metadata');
