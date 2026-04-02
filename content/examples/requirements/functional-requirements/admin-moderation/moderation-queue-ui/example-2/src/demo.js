function chooseQueue(items) {
  return items.map((item) => ({
    id: item.id,
    queue: item.policy === "self-harm" || item.severity >= 90 ? "safety" : item.appeal ? "appeals" : "spam",
    expedite: item.waitMinutes > item.slaMinutes
  }));
}

console.log(
  chooseQueue([
    { id: "case-1", policy: "self-harm", severity: 96, appeal: false, waitMinutes: 14, slaMinutes: 10 },
    { id: "case-2", policy: "spam", severity: 44, appeal: true, waitMinutes: 6, slaMinutes: 20 }
  ])
);
