const events = [
  { atMs: 0, value: "r" },
  { atMs: 50, value: "re" },
  { atMs: 120, value: "ren" },
  { atMs: 510, value: "rend" },
];

function collectDebouncedDispatches(inputEvents, delayMs) {
  const dispatches = [];

  for (let index = 0; index < inputEvents.length; index += 1) {
    const current = inputEvents[index];
    const next = inputEvents[index + 1];
    const quietWindow = next ? next.atMs - current.atMs : delayMs;
    if (quietWindow >= delayMs) {
      dispatches.push({ atMs: current.atMs + delayMs, value: current.value });
    }
  }

  return dispatches;
}

console.log("input events", events);
console.log("debounced dispatches", collectDebouncedDispatches(events, 300));
