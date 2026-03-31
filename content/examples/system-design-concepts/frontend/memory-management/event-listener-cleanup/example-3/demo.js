function analyzeHandlers(events) {
  const active = new Set();
  return events.map((event) => {
    if (event.type === "attach") {
      const duplicate = active.has(event.key);
      active.add(event.key);
      return { event, duplicate, staleClosure: Boolean(event.staleClosure) };
    }
    active.delete(event.key);
    return { event, duplicate: false, staleClosure: false };
  });
}

console.log(analyzeHandlers([
  { type: "attach", key: "shortcuts:keydown", staleClosure: true },
  { type: "attach", key: "shortcuts:keydown", staleClosure: true },
  { type: "detach", key: "shortcuts:keydown" }
]));
