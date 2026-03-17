// Simulates a deadlock and resolves it.

const lockManager = require("./lock-manager");

function transactionA() {
  lockManager.acquire("T1", "row-1");
  const ok = lockManager.acquire("T1", "row-2");
  return ok;
}

function transactionB() {
  lockManager.acquire("T2", "row-2");
  const ok = lockManager.acquire("T2", "row-1");
  return ok;
}

transactionA();
transactionB();

const deadlock = lockManager.detectDeadlock();
console.log("Deadlock detected", deadlock);
if (deadlock) {
  console.log("Abort", deadlock[0]);
  lockManager.release(deadlock[0], "row-1");
  lockManager.release(deadlock[0], "row-2");
}
