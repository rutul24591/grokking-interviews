const order = ["landing", "article", "signup", "pricing", "checkout"];

function normalize(events) {
  const seen = new Set();
  return events
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)
    .filter((event) => {
      if (seen.has(event.stage)) return false;
      const previous = order[order.indexOf(event.stage) - 1];
      if (previous && !seen.has(previous)) return false;
      seen.add(event.stage);
      return true;
    });
}

console.log(normalize([
  { stage: "landing", timestamp: 1 },
  { stage: "signup", timestamp: 2 },
  { stage: "article", timestamp: 3 },
  { stage: "pricing", timestamp: 4 }
]));
