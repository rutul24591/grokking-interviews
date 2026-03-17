// Optimistic update using version checks.

const store = require("./record-store");

function updateOptimistic(delta) {
  const snapshot = store.read();
  const updated = snapshot.value + delta;
  return store.write(updated, snapshot.version);
}

module.exports = { updateOptimistic };
