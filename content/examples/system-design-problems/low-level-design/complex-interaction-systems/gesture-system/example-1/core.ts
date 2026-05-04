export type GestureState =
  | { kind: "idle" }
  | { kind: "pointerDown"; x: number; y: number; at: number }
  | { kind: "dragging"; startX: number; startY: number; x: number; y: number };

export function onDown(x: number, y: number): GestureState {
  return { kind: "pointerDown", x, y, at: Date.now() };
}

export function onMove(state: GestureState, x: number, y: number, thresholdPx = 3): GestureState {
  if (state.kind === "pointerDown") {
    const dx = x - state.x;
    const dy = y - state.y;
    if (Math.hypot(dx, dy) >= thresholdPx) {
      return { kind: "dragging", startX: state.x, startY: state.y, x, y };
    }
  }
  if (state.kind === "dragging") return { ...state, x, y };
  return state;
}

export function onUp(): GestureState {
  return { kind: "idle" };
}
