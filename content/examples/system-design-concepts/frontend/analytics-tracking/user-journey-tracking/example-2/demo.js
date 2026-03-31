function stitch(events) {
  return events
    .slice()
    .sort((a, b) => a.sequence - b.sequence || a.timestamp - b.timestamp)
    .map((event) => event.step);
}

console.log(stitch([
  { step: "toggle-examples", sequence: 4, timestamp: 40 },
  { step: "read-article", sequence: 3, timestamp: 30 },
  { step: "open-subcategory", sequence: 1, timestamp: 10 },
  { step: "open-article-card", sequence: 2, timestamp: 20 }
]));
