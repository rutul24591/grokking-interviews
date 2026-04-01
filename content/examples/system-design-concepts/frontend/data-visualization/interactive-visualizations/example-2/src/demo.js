function interactionReducer(state, event) {
  if (event.type === "hover") return { ...state, hoveredId: event.id, lastAction: "hover" };
  if (event.type === "select") return { ...state, selectedId: event.id, lastAction: "select", detailsOpen: true };
  if (event.type === "brush") return { ...state, brushRange: event.range, lastAction: "brush" };
  if (event.type === "clear") {
    return { ...state, hoveredId: null, selectedId: null, detailsOpen: false, lastAction: "clear" };
  }
  return state;
}

console.log(
  interactionReducer(
    { hoveredId: "seg-1", selectedId: null, detailsOpen: false, brushRange: "last-7-days" },
    { type: "select", id: "seg-2" }
  )
);
