// Simple wide-row model for column-family storage.

const store = new Map();

function write(partitionKey, clusteringKey, value) {
  if (!store.has(partitionKey)) {
    store.set(partitionKey, new Map());
  }
  store.get(partitionKey).set(clusteringKey, value);
}

function readRange(partitionKey, from, to) {
  const partition = store.get(partitionKey);
  if (!partition) return [];
  return Array.from(partition.entries())
    .filter(([key]) => key >= from && key <= to)
    .sort((a, b) => a[0] - b[0])
    .map(([key, value]) => ({ key, value }));
}

module.exports = { write, readRange };
