// Lock manager with deadlock detection.

const locks = new Map();
const waitsFor = new Map();

function acquire(tx, resource) {
  const owner = locks.get(resource);
  if (!owner) {
    locks.set(resource, tx);
    return true;
  }
  if (owner === tx) return true;

  waitsFor.set(tx, owner);
  return false;
}

function release(tx, resource) {
  if (locks.get(resource) === tx) {
    locks.delete(resource);
  }
  waitsFor.delete(tx);
}

function detectDeadlock() {
  for (const [tx, waitingOn] of waitsFor.entries()) {
    const next = waitsFor.get(waitingOn);
    if (next === tx) return [tx, waitingOn];
  }
  return null;
}

module.exports = { acquire, release, detectDeadlock };
