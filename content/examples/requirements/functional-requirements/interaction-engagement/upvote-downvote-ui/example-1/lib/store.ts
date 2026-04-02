const state = {
  score: 41,
  selection: "none" as "upvote" | "downvote" | "none",
  mode: "list" as "list" | "detail",
  lastMessage: "Voting UIs should preserve the user’s current vote while keeping aggregate score consistent across list and detail views."
};

export function snapshot() { return structuredClone(state); }

export function mutate(type: "upvote" | "downvote" | "switch-mode") {
  if (type === "switch-mode") {
    state.mode = state.mode === "list" ? "detail" : "list";
    state.lastMessage = `Switched vote UI to ${state.mode} mode.`;
    return snapshot();
  }
  if (type === "upvote") {
    if (state.selection === "upvote") {
      state.selection = "none";
      state.score -= 1;
    } else if (state.selection === "downvote") {
      state.selection = "upvote";
      state.score += 2;
    } else {
      state.selection = "upvote";
      state.score += 1;
    }
    state.lastMessage = "Applied upvote interaction.";
    return snapshot();
  }
  if (state.selection === "downvote") {
    state.selection = "none";
    state.score += 1;
  } else if (state.selection === "upvote") {
    state.selection = "downvote";
    state.score -= 2;
  } else {
    state.selection = "downvote";
    state.score -= 1;
  }
  state.lastMessage = "Applied downvote interaction.";
  return snapshot();
}
