export type Cursor = string | null;

export type CursorPagingState = {
  // stack of cursors representing previous pages
  backStack: Cursor[];
  currentAfter: Cursor;
  nextCursor: Cursor;
  snapshotId?: string;
  queryKey: string;
};

export function initCursorPaging(queryKey: string): CursorPagingState {
  return { backStack: [], currentAfter: null, nextCursor: null, queryKey };
}

export function onNewPage(args: {
  state: CursorPagingState;
  usedAfter: Cursor;
  nextCursor: Cursor;
  snapshotId?: string;
}) {
  const backStack = [...args.state.backStack, args.usedAfter];
  return {
    ...args.state,
    backStack,
    currentAfter: args.usedAfter,
    nextCursor: args.nextCursor,
    snapshotId: args.snapshotId ?? args.state.snapshotId,
  };
}

export function goBack(state: CursorPagingState) {
  if (!state.backStack.length) return state;
  const backStack = state.backStack.slice(0, -1);
  const usedAfter = backStack[backStack.length - 1] ?? null;
  return { ...state, backStack, currentAfter: usedAfter };
}

export function resetOnQueryChange(state: CursorPagingState, nextQueryKey: string) {
  if (state.queryKey === nextQueryKey) return state;
  return initCursorPaging(nextQueryKey);
}

