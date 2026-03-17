// Pessimistic update using a lock.

const store = require("./record-store");

function updatePessimistic(delta) {
  if (!store.lock()) {
    throw new Error("lock-timeout");
  }
  try {
    const snapshot = store.read();
    const updated = snapshot.value + delta;
    return store.write(updated);
  } finally {
    store.unlock();
  }
}

module.exports = { updatePessimistic };
