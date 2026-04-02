const state = {
  palette: "compact" as "compact" | "full",
  reactions: [
    { id: "re-1", emoji: "👍", count: 21, selected: false },
    { id: "re-2", emoji: "🔥", count: 13, selected: true },
    { id: "re-3", emoji: "🤯", count: 7, selected: false },
    { id: "re-4", emoji: "👏", count: 4, selected: false }
  ],
  lastMessage: "Reaction pickers should preserve the user’s current selection while still showing aggregate reaction distribution."
};

export function snapshot() { return structuredClone(state); }

export function mutate(type: "switch-palette" | "select-reaction", value?: string) {
  if (type === "switch-palette") {
    state.palette = state.palette === "compact" ? "full" : "compact";
    state.lastMessage = `Switched reaction palette to ${state.palette}.`;
    return snapshot();
  }
  if (type === "select-reaction" && value) {
    state.reactions = state.reactions.map((reaction) => {
      if (reaction.id === value) {
        return { ...reaction, selected: true, count: reaction.selected ? reaction.count : reaction.count + 1 };
      }
      return reaction.selected ? { ...reaction, selected: false, count: Math.max(reaction.count - 1, 0) } : reaction;
    });
    state.lastMessage = `Selected reaction ${value}.`;
  }
  return snapshot();
}
