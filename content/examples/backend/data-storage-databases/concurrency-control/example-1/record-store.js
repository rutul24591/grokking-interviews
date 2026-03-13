// In-memory record store with versioning and locks.

const record = { id: 1, value: 100, version: 1 };
let locked = false;

function read() {
  return { ...record };
}

function write(newValue, expectedVersion) {
  if (expectedVersion && record.version !== expectedVersion) {
    throw new Error("version-mismatch");
  }
  record.value = newValue;
  record.version += 1;
  return { ...record };
}

function lock() {
  if (locked) return false;
  locked = true;
  return true;
}

function unlock() {
  locked = false;
}

module.exports = { read, write, lock, unlock };
