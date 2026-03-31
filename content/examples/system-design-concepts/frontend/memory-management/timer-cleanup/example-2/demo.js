function timerBalance(events) {
  let intervals = 0;
  let timeouts = 0;
  for (const event of events) {
    if (event === "mount") {
      intervals += 1;
      timeouts += 1;
    }
    if (event === "timeout-fired") timeouts = Math.max(0, timeouts - 1);
    if (event === "cleanup") {
      intervals = Math.max(0, intervals - 1);
      timeouts = Math.max(0, timeouts - 1);
    }
  }
  return { intervals, timeouts, balanced: intervals === 0 && timeouts === 0 };
}

console.log(timerBalance(["mount", "timeout-fired", "cleanup"]));
console.log(timerBalance(["mount", "mount", "cleanup"]));
