function chooseReviewPath(requests) {
  return requests.map((request) => ({
    id: request.id,
    route: request.region === "EU" || request.type === "data-access" || request.priority === "urgent" ? "counsel-review" : "standard-ops",
    preserveEvidence: request.type === "copyright" || request.priority === "urgent",
    notifyPolicy: request.parallelOrders > 1
  }));
}

console.log(
  chooseReviewPath([
    { id: "lr-1", region: "EU", type: "data-access", priority: "urgent", parallelOrders: 2 },
    { id: "lr-2", region: "US", type: "copyright", priority: "standard", parallelOrders: 0 }
  ])
);
