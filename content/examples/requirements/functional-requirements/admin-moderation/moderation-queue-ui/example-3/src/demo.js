function detectQueueStarvation(queues) {
  const starving = queues
    .filter((queue) => queue.oldestItemHours > queue.slaHours || (queue.staffed === false && queue.inflowPerHour > queue.outflowPerHour))
    .map((queue) => queue.name);
  return {
    starving,
    rebalance: starving.length > 0,
    freezeLowPriorityIntake: starving.includes("safety")
  };
}

console.log(
  detectQueueStarvation([
    { name: "spam", slaHours: 4, oldestItemHours: 2, staffed: true, inflowPerHour: 12, outflowPerHour: 15 },
    { name: "safety", slaHours: 1, oldestItemHours: 3, staffed: false, inflowPerHour: 8, outflowPerHour: 2 }
  ])
);
