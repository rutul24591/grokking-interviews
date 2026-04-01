function shouldLog(event, policy) {
  if (event.level === "error") {
    return { accepted: true, reason: "always-log-errors" };
  }

  const categoryRate = policy[event.category] ?? policy.defaultRate;
  return { accepted: event.sample < categoryRate, reason: `category-rate:${categoryRate}` };
}

console.log(
  shouldLog(
    { level: "info", category: "ui", sample: 0.08 },
    { defaultRate: 0.02, ui: 0.1, metrics: 0.01 }
  )
);
