// Simulated consistency models.

const primary = new Map();
const replica = new Map();

function write(key, value) {
  primary.set(key, value);
  setTimeout(() => replica.set(key, value), 200);
}

function strongRead(key) {
  return primary.get(key);
}

function eventualRead(key) {
  return replica.get(key);
}

module.exports = { write, strongRead, eventualRead };
