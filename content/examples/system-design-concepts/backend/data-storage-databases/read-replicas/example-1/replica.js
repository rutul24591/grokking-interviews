// Simulated primary and replica with lag.

const primary = new Map();
const replica = new Map();

function write(key, value) {
  primary.set(key, value);
  setTimeout(() => {
    replica.set(key, value);
  }, 200);
}

function readFromPrimary(key) {
  return primary.get(key);
}

function readFromReplica(key) {
  return replica.get(key);
}

module.exports = { write, readFromPrimary, readFromReplica };
