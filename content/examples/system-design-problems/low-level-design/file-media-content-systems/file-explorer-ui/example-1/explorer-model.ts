export type NodeId = string;
export type NodeType = "folder" | "file";

export type Node = {
  id: NodeId;
  type: NodeType;
  name: string;
  parentId: NodeId | null;
};

export type ExplorerState = {
  nodes: Record<NodeId, Node>;
  currentFolderId: NodeId | null;
  selected: Set<NodeId>;
  query: string;
};

export function listChildren(state: ExplorerState, folderId: NodeId | null) {
  const q = state.query.trim().toLowerCase();
  return Object.values(state.nodes)
    .filter((n) => n.parentId === folderId)
    .filter((n) => (q ? n.name.toLowerCase().includes(q) : true))
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1));
}

export function toggleSelect(state: ExplorerState, id: NodeId) {
  const next = new Set(state.selected);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return { ...state, selected: next };
}

export function canMove(nodes: Record<NodeId, Node>, nodeId: NodeId, newParentId: NodeId | null) {
  if (newParentId === nodeId) return { ok: false, reason: "self" as const };
  let curr = newParentId;
  while (curr) {
    if (curr === nodeId) return { ok: false, reason: "cycle" as const };
    curr = nodes[curr]?.parentId ?? null;
  }
  return { ok: true as const };
}

