// Runs optimistic and pessimistic updates.

const { updateOptimistic } = require("./optimistic");
const { updatePessimistic } = require("./pessimistic");

console.log("Optimistic", updateOptimistic(10));
try {
  // Simulate conflict by reusing old version.
  updateOptimistic(5);
} catch (error) {
  console.log("Optimistic conflict", error.message);
}

console.log("Pessimistic", updatePessimistic(-20));
