export type DrawerState = {
  open: boolean;
  snapPoints: number[]; // 0..1 height fractions
  activeSnap: number; // index
};

export function openAt(state: DrawerState, snapIndex: number) {
  return { ...state, open: true, activeSnap: Math.max(0, Math.min(state.snapPoints.length - 1, snapIndex)) };
}

export function close(state: DrawerState) {
  return { ...state, open: false };
}

export function onDragEnd(state: DrawerState, velocityY: number) {
  // naive policy: fast downward swipe closes
  if (velocityY > 1200) return close(state);
  return state;
}
