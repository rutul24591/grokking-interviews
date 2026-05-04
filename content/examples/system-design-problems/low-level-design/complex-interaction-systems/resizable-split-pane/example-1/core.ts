export type SplitState = {
  leftPx: number;
  minLeftPx: number;
  minRightPx: number;
  containerPx: number;
};

export function resize(state: SplitState, deltaPx: number) {
  const maxLeft = state.containerPx - state.minRightPx;
  const leftPx = Math.max(state.minLeftPx, Math.min(maxLeft, state.leftPx + deltaPx));
  return { ...state, leftPx };
}

export function serialize(state: SplitState) {
  return JSON.stringify({ leftPx: state.leftPx });
}
