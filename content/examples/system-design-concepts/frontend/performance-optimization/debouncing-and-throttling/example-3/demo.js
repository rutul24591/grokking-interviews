const workloads = [
  {
    interaction: "autocomplete query",
    strategy: "debounce",
    eventsAtMs: [0, 60, 120, 210, 620],
  },
  {
    interaction: "reading progress bar",
    strategy: "time-based throttle",
    eventsAtMs: [0, 16, 32, 48, 64, 80, 96],
  },
  {
    interaction: "drag preview",
    strategy: "requestAnimationFrame throttle",
    eventsAtMs: [0, 7, 12, 19, 25, 31, 38],
  },
];

function estimateExecutions(workload) {
  if (workload.strategy === "debounce") {
    let count = 0;
    for (let index = 0; index < workload.eventsAtMs.length; index += 1) {
      const current = workload.eventsAtMs[index];
      const next = workload.eventsAtMs[index + 1];
      if (!next || next - current >= 300) count += 1;
    }
    return count;
  }

  if (workload.strategy === "time-based throttle") {
    let lastExecution = -Infinity;
    let count = 0;
    for (const eventAtMs of workload.eventsAtMs) {
      if (eventAtMs - lastExecution >= 50) {
        lastExecution = eventAtMs;
        count += 1;
      }
    }
    return count;
  }

  return new Set(workload.eventsAtMs.map((value) => Math.floor(value / 16))).size;
}

for (const workload of workloads) {
  console.log(
    `${workload.interaction} -> ${workload.strategy} -> ${estimateExecutions(workload)} handler executions`,
  );
}
