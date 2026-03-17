// Transaction manager with basic locks and write-ahead log.

const { applyTransfer } = require("./ledger");

const locks = new Set();
const wal = [];

function acquire(id) {
  if (locks.has(id)) return false;
  locks.add(id);
  return true;
}

function release(id) {
  locks.delete(id);
}

function record(entry) {
  wal.push({ ...entry, ts: Date.now() });
}

function transfer(from, to, amount) {
  if (!acquire(from) || !acquire(to)) {
    record({ type: "abort", reason: "lock-conflict", from, to, amount });
    release(from);
    release(to);
    return { ok: false, error: "lock-conflict" };
  }

  record({ type: "begin", from, to, amount });
  try {
    applyTransfer(from, to, amount);
    record({ type: "commit", from, to, amount });
    return { ok: true };
  } catch (error) {
    record({ type: "rollback", reason: error.message, from, to, amount });
    return { ok: false, error: error.message };
  } finally {
    release(from);
    release(to);
  }
}

function log() {
  return wal.slice();
}

module.exports = { transfer, log };
