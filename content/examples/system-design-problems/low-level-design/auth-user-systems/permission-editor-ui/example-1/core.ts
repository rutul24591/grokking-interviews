export type Permission = { id: string; label: string; category: string };

export type EditorState = {
  selected: Set<string>;
  dirty: boolean;
};

export function toggle(state: EditorState, id: string) {
  const selected = new Set(state.selected);
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
  return { ...state, selected, dirty: true };
}

export function diff(before: Set<string>, after: Set<string>) {
  const added = [...after].filter((p) => !before.has(p));
  const removed = [...before].filter((p) => !after.has(p));
  return { added, removed };
}

export function groupByCategory(perms: Permission[]) {
  const out: Record<string, Permission[]> = {};
  for (const p of perms) (out[p.category] ??= []).push(p);
  for (const k of Object.keys(out)) out[k].sort((a, b) => a.label.localeCompare(b.label));
  return out;
}
