function scheduleJobs(jobs) {
  const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
  const maxDeadline = Math.max(...sorted.map((j) => j.deadline), 0);
  const slots = new Array(maxDeadline).fill(null);

  for (const job of sorted) {
    for (let t = Math.min(job.deadline, maxDeadline) - 1; t >= 0; t -= 1) {
      if (!slots[t]) {
        slots[t] = job;
        break;
      }
    }
  }

  return slots.filter(Boolean);
}

module.exports = { scheduleJobs };
