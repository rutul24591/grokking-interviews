import type { TreeNode } from './tree-types';

/**
 * Build a nested tree structure from a flat node map and root IDs.
 * Returns an array of root nodes with their children recursively populated.
 */
export function buildTree(
  rootIds: string[],
  nodes: Map<string, TreeNode>
): TreeNode[] {
  return rootIds
    .map((id) => nodes.get(id))
    .filter((node): node is TreeNode => node !== undefined)
    .map((node) => ({
      ...node,
      children: node.children
        .map((childId) => nodes.get(childId))
        .filter((child): child is TreeNode => child !== undefined),
    }));
}

/**
 * Find a node by ID in the flat map. O(1) lookup.
 */
export function findNode(
  nodes: Map<string, TreeNode>,
  id: string
): TreeNode | undefined {
  return nodes.get(id);
}

/**
 * Get the path from root to a given node (ancestor chain).
 * Returns an array of nodes from root to the target node.
 * O(d) where d is the depth of the tree.
 */
export function getPath(
  nodes: Map<string, TreeNode>,
  nodeId: string
): TreeNode[] {
  const path: TreeNode[] = [];
  let currentId: string | null = nodeId;

  while (currentId !== null) {
    const node = nodes.get(currentId);
    if (!node) break;
    path.unshift(node);
    currentId = node.parentId;
  }

  return path;
}

/**
 * Detect if moving sourceNode into targetFolder would create a circular reference.
 * Walks up from targetFolder following parentId pointers.
 * Returns true if sourceId is found in the ancestor chain.
 * O(d) where d is the depth of targetFolder.
 */
export function detectCircularRef(
  sourceId: string,
  targetFolderId: string,
  nodes: Map<string, TreeNode>
): boolean {
  let currentId: string | null = targetFolderId;

  while (currentId !== null) {
    if (currentId === sourceId) {
      return true; // Cycle detected
    }
    const node = nodes.get(currentId);
    if (!node) break;
    currentId = node.parentId;
  }

  return false;
}

/**
 * Filter tree nodes by search query.
 * Returns a Set of node IDs that should be visible.
 * A node is visible if:
 * 1. Its name matches the query (case-insensitive substring), OR
 * 2. It is an ancestor of a matching node (to show the path to matches)
 *
 * O(n) where n is the total number of loaded nodes.
 */
export function filterTree(
  nodes: Map<string, TreeNode>,
  rootIds: string[],
  query: string
): Set<string> {
  if (!query.trim()) {
    // No query: all root nodes are visible (their visibility depends on expanded state)
    return new Set(rootIds);
  }

  const visibleIds = new Set<string>();
  const lowerQuery = query.toLowerCase();

  // First pass: find all matching nodes
  const matchingIds = new Set<string>();
  for (const [id, node] of nodes) {
    if (node.name.toLowerCase().includes(lowerQuery)) {
      matchingIds.add(id);
    }
  }

  // Second pass: for each match, add all ancestors to visible set
  for (const matchId of matchingIds) {
    visibleIds.add(matchId);
    let currentId: string | null = nodes.get(matchId)?.parentId ?? null;
    while (currentId !== null) {
      visibleIds.add(currentId);
      const node = nodes.get(currentId);
      if (!node) break;
      currentId = node.parentId;
    }
  }

  return visibleIds;
}

/**
 * Extract highlighted segments from a name given a search query.
 * Returns an array of { text, isMatch } segments.
 */
export function getHighlightSegments(
  name: string,
  query: string
): { text: string; isMatch: boolean }[] {
  if (!query.trim()) {
    return [{ text: name, isMatch: false }];
  }

  const lowerName = name.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const segments: { text: string; isMatch: boolean }[] = [];
  let lastIndex = 0;

  while (true) {
    const idx = lowerName.indexOf(lowerQuery, lastIndex);
    if (idx === -1) {
      if (lastIndex < name.length) {
        segments.push({ text: name.slice(lastIndex), isMatch: false });
      }
      break;
    }

    if (idx > lastIndex) {
      segments.push({ text: name.slice(lastIndex, idx), isMatch: false });
    }
    segments.push({ text: name.slice(idx, idx + query.length), isMatch: true });
    lastIndex = idx + query.length;
  }

  return segments;
}

/**
 * Get all visible node IDs via BFS from roots through expanded nodes.
 * This produces a flat array suitable for virtualization.
 */
export function getVisibleNodeIds(
  rootIds: string[],
  nodes: Map<string, TreeNode>,
  expandedIds: Set<string>,
  searchResults: Set<string> | null
): string[] {
  const visible: string[] = [];
  const queue = [...rootIds];

  while (queue.length > 0) {
    const id = queue.shift()!;
    const node = nodes.get(id);
    if (!node) continue;

    // If search is active, only include nodes in searchResults
    if (searchResults && searchResults.size > 0 && !searchResults.has(id)) {
      // Still need to traverse children if this node is an ancestor of a match
      // This is handled by the filterTree function including ancestors
      continue;
    }

    visible.push(id);

    // If folder is expanded, add children to queue
    if (node.type === 'folder' && expandedIds.has(id)) {
      queue.push(...node.children);
    }
  }

  return visible;
}
