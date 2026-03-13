// In-memory ledger with consistency checks.

const accounts = new Map([
  ["alice", 500],
  ["bob", 300],
]);

function getBalance(id) {
  return accounts.get(id) ?? 0;
}

function applyTransfer(from, to, amount) {
  const fromBalance = getBalance(from);
  if (fromBalance < amount) {
    throw new Error("insufficient-funds");
  }
  accounts.set(from, fromBalance - amount);
  accounts.set(to, getBalance(to) + amount);
}

function snapshot() {
  return Array.from(accounts.entries()).reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});
}

module.exports = { getBalance, applyTransfer, snapshot };
