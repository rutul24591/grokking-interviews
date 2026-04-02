function detectCommentEdgeCases(comments) {
  const collapsed = comments.filter((comment) => comment.depth > 4).map((comment) => comment.id);
  const fanoutHotspots = comments.filter((comment) => comment.replyBurst > 20).map((comment) => comment.id);
  return {
    collapsed,
    fanoutHotspots,
    throttleReplies: fanoutHotspots.length > 0,
    freezeThread: comments.some((comment) => comment.moderationHold)
  };
}

console.log(detectCommentEdgeCases([
  { id: "cm-9", depth: 5, replyBurst: 2, moderationHold: false },
  { id: "cm-10", depth: 2, replyBurst: 24, moderationHold: false },
  { id: "cm-11", depth: 1, replyBurst: 6, moderationHold: true }
]));
