const state = {
  average: 4.6,
  draftRating: 4,
  reviews: [
    { id: "rr-1", author: "Priya", rating: 5, status: "published" as const },
    { id: "rr-2", author: "Rahul", rating: 4, status: "pending" as const }
  ],
  lastMessage: "Rating UIs should show draft and published review state separately so users understand moderation and average-score lag."
};

export function snapshot() {
  return structuredClone(state);
}

export function mutate(type: "submit-review" | "change-rating") {
  if (type === "change-rating") {
    state.draftRating = state.draftRating === 5 ? 3 : state.draftRating + 1;
    state.lastMessage = `Updated draft rating to ${state.draftRating}.`;
    return snapshot();
  }
  state.reviews.unshift({ id: `rr-${state.reviews.length + 1}`, author: "You", rating: state.draftRating, status: "pending" as const });
  state.lastMessage = "Submitted review for moderation.";
  return snapshot();
}
