function chooseCommentWritePath(comments) {
  return comments.map((comment) => ({
    id: comment.id,
    path: comment.offline ? "local-draft-queue" : comment.containsMention ? "fanout-write" : "single-write",
    premoderate: comment.containsLink || comment.authorTrustScore < 40,
    collapsePreview: comment.depth > 3
  }));
}

console.log(chooseCommentWritePath([
  { id: "cm-1", offline: false, containsMention: true, containsLink: false, authorTrustScore: 63, depth: 2 },
  { id: "cm-2", offline: true, containsMention: false, containsLink: true, authorTrustScore: 24, depth: 5 }
]));
