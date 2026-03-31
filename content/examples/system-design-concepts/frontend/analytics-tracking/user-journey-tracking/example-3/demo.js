function partition(events, idleMs) {
  const sessions = [[]];
  for (const event of events) {
    const current = sessions[sessions.length - 1];
    const previous = current[current.length - 1];
    if (previous && event.timestamp - previous.timestamp > idleMs) sessions.push([event]);
    else current.push(event);
  }
  return sessions;
}

console.log(partition([
  { step: "open-subcategory", timestamp: 0 },
  { step: "open-article-card", timestamp: 1000 },
  { step: "toggle-examples", timestamp: 30000 }
], 5000));
