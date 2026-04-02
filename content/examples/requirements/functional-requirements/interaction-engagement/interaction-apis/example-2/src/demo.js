function chooseInteractionWritePlan(actions) {
  return actions.map((action) => ({
    id: action.id,
    route: action.requiresAuth ? "authenticated-write" : "anonymous-limited-write",
    idempotencyKey: `${action.userId}:${action.kind}:${action.entityId}`,
    queueFallback: action.status === 503 || action.rateLimited
  }));
}

console.log(chooseInteractionWritePlan([
  { id: "ia-1", requiresAuth: true, userId: "u1", kind: "like", entityId: "post-1", status: 200, rateLimited: false },
  { id: "ia-2", requiresAuth: false, userId: "anon-2", kind: "share", entityId: "post-9", status: 503, rateLimited: true }
]));
