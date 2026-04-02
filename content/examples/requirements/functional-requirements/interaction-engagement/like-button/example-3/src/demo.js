function detectLikeCountDrift(states) {
  const drifted = states.filter((state) => state.inlineCount !== state.detailCount).map((state) => state.entityId);
  const optimisticTimeouts = states.filter((state) => state.pendingSeconds > state.maxPendingSeconds).map((state) => state.entityId);
  return {
    drifted,
    optimisticTimeouts,
    refetch: drifted.length > 0,
    revertOptimisticUpdate: optimisticTimeouts.length > 0
  };
}

console.log(detectLikeCountDrift([
  { entityId: "post-1", inlineCount: 33, detailCount: 34, pendingSeconds: 3, maxPendingSeconds: 5 },
  { entityId: "post-2", inlineCount: 21, detailCount: 21, pendingSeconds: 9, maxPendingSeconds: 4 }
]));
