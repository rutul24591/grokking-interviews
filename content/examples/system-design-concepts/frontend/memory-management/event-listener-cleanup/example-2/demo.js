function listenerBalance(events) {
  const active = new Map();
  for (const event of events) {
    if (event.type === "attach") active.set(event.key, (active.get(event.key) ?? 0) + 1);
    if (event.type === "detach") active.set(event.key, Math.max(0, (active.get(event.key) ?? 0) - 1));
  }
  const leaked = [...active.entries()].filter(([, count]) => count > 0);
  return { balanced: leaked.length === 0, leaked };
}

console.log(listenerBalance([
  { type: "attach", key: "analytics:visibilitychange" },
  { type: "attach", key: "analytics:pagehide" },
  { type: "detach", key: "analytics:pagehide" }
]));
