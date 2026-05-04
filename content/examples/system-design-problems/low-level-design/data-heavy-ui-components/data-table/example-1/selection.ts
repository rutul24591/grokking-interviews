import type { RowId } from "./table-model";

export type SelectionState = {
  selected: Set<RowId>;
  anchor: RowId | null; // for shift-range selection
};

export function toggle(state: SelectionState, id: RowId) {
  const next = new Set(state.selected);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return { selected: next, anchor: id };
}

export function selectRange(args: { orderedIds: RowId[]; state: SelectionState; to: RowId }) {
  const { orderedIds, state, to } = args;
  const anchor = state.anchor ?? to;
  const a = orderedIds.indexOf(anchor);
  const b = orderedIds.indexOf(to);
  if (a === -1 || b === -1) return state;
  const [start, end] = a < b ? [a, b] : [b, a];
  const next = new Set(state.selected);
  for (let i = start; i <= end; i += 1) next.add(orderedIds[i]);
  return { selected: next, anchor };
}

