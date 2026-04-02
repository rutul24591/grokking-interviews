function mergeAggregates(events) {
  return events.reduce((acc, event) => {
    acc[event.entityId] ??= { likes: 0, comments: 0, shares: 0, delayed: 0 };
    if (event.delayed) {
      acc[event.entityId].delayed += 1;
    }
    acc[event.entityId][event.type] += 1;
    return acc;
  }, {});
}

console.log(mergeAggregates([
  { entityId: "post-1", type: "likes", delayed: false },
  { entityId: "post-1", type: "comments", delayed: true },
  { entityId: "post-2", type: "shares", delayed: false },
  { entityId: "post-1", type: "likes", delayed: true }
]));
