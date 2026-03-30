function simulateDirectUpdates() {
  let count = 0;
  const captured = count;
  count = captured + 1;
  count = captured + 1;
  count = captured + 1;
  return count;
}

function simulateFunctionalUpdates() {
  let count = 0;
  const queue = [(value) => value + 1, (value) => value + 1, (value) => value + 1];
  for (const update of queue) count = update(count);
  return count;
}

console.log({ directResult: simulateDirectUpdates(), functionalResult: simulateFunctionalUpdates() });
