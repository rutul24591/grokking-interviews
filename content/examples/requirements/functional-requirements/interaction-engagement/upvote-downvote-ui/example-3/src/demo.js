function detectVoteEdgeCases(states) {
  const drifted = states.filter((state) => state.inlineScore !== state.detailScore || state.inlineSelection !== state.detailSelection).map((state) => state.entityId);
  const crossVoteConflicts = states.filter((state) => state.pendingSelection && state.serverSelection && state.pendingSelection !== state.serverSelection).map((state) => state.entityId);
  return {
    drifted,
    crossVoteConflicts,
    refetch: drifted.length > 0,
    lockControlUntilAck: crossVoteConflicts.length > 0
  };
}

console.log(detectVoteEdgeCases([
  { entityId: "post-1", inlineScore: 11, detailScore: 10, inlineSelection: "upvote", detailSelection: "upvote", pendingSelection: "downvote", serverSelection: "upvote" },
  { entityId: "post-2", inlineScore: 3, detailScore: 3, inlineSelection: "none", detailSelection: "none", pendingSelection: null, serverSelection: null }
]));
