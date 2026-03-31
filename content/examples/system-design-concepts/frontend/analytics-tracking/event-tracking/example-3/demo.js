function dedupe(events, windowMs) {
  const fingerprints = new Map();
  return events.filter((event) => {
    const key = `${event.type}:${event.articleId}:${event.value}`;
    const previous = fingerprints.get(key);
    fingerprints.set(key, event.timestamp);
    return previous === undefined || event.timestamp - previous > windowMs;
  });
}

console.log(dedupe([
  { type: "share_click", articleId: "a1", value: 1, timestamp: 1000 },
  { type: "share_click", articleId: "a1", value: 1, timestamp: 1200 },
  { type: "share_click", articleId: "a1", value: 1, timestamp: 2600 }
], 1000));
