function chooseDebouncePlan(session) {
  const actions = [];
  if (session.keystrokeBurst > 7) actions.push("increase-window");
  if (session.cancellationState !== "active") actions.push("enforce-cancellation");
  if (session.requestState !== "healthy") actions.push("keep-pending-visible");
  if (session.lastPaintMs > session.backendBudgetMs) actions.push("slow-path-review");

  return {
    id: session.id,
    increaseWindow: session.keystrokeBurst > 7,
    requireCancellation: session.cancellationState !== "active",
    keepPendingVisible: session.requestState !== "healthy",
    actions
  };
}

const sessions = [
  { id: "steady", keystrokeBurst: 4, cancellationState: "active", requestState: "healthy", lastPaintMs: 72, backendBudgetMs: 160 },
  { id: "burst", keystrokeBurst: 9, cancellationState: "queued", requestState: "lagging", lastPaintMs: 190, backendBudgetMs: 180 },
  { id: "broken", keystrokeBurst: 6, cancellationState: "missing", requestState: "repair", lastPaintMs: 220, backendBudgetMs: 150 }
];

const plans = sessions.map(chooseDebouncePlan);
console.log(plans);
console.log({ pendingRequired: plans.filter((item) => item.keepPendingVisible).length, slowPath: plans.filter((item) => item.actions.includes("slow-path-review")).map((item) => item.id) });
