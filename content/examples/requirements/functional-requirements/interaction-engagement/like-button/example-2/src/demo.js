function chooseLikeWriteBehavior(requests) {
  return requests.map((request) => ({
    id: request.id,
    optimistic: request.networkHealthy,
    debounceUndo: request.surface === "feed",
    queueForRetry: !request.networkHealthy || request.rateLimited
  }));
}

console.log(chooseLikeWriteBehavior([
  { id: "lk-1", networkHealthy: true, surface: "feed", rateLimited: false },
  { id: "lk-2", networkHealthy: false, surface: "detail", rateLimited: true }
]));
