const state = {
  sort: "top" as "top" | "new",
  draft: "Question about read replicas",
  comments: [
    { id: "cm-1", author: "Anika", body: "The cache invalidation section is strong.", status: "visible" as const, score: 9, createdAt: 4 },
    { id: "cm-2", author: "Dev", body: "Can you add more on failover?", status: "pending" as const, score: 2, createdAt: 1 }
  ],
  lastMessage: "Comment UIs should let users engage quickly without hiding moderation state or pending review outcomes."
};

export function snapshot() {
  const comments = [...state.comments].sort((left, right) => state.sort === "top" ? right.score - left.score : left.createdAt - right.createdAt);
  return structuredClone({ sort: state.sort, comments, draft: state.draft, lastMessage: state.lastMessage });
}

export function mutate(type: "switch-sort" | "submit-draft" | "flag-comment", value?: string) {
  if (type === "switch-sort" && value) {
    state.sort = value as "top" | "new";
    state.lastMessage = `Sorted comments by ${state.sort}.`;
    return snapshot();
  }
  if (type === "submit-draft") {
    state.comments.unshift({ id: `cm-${state.comments.length + 1}`, author: "You", body: state.draft, status: "pending" as const, score: 0, createdAt: 0 });
    state.lastMessage = "Submitted comment draft into moderation review.";
    return snapshot();
  }
  if (type === "flag-comment" && value) {
    state.comments = state.comments.map((comment) => comment.id === value ? { ...comment, status: "flagged" as const } : comment);
    state.lastMessage = `Flagged ${value} for moderation review.`;
  }
  return snapshot();
}
