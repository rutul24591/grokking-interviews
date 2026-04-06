/**
 * Circular Reference Detection — Prevents circular parent-child relationships.
 *
 * Interview edge case: User drags folder A into folder B, but folder B is already
 * a descendant of folder A. This creates a circular reference. The system must
 * detect this before allowing the move.
 */

export interface TreeNode {
  id: string;
  parentId: string | null;
  children: string[]; // child IDs
}

/**
 * Builds an adjacency list from a tree for cycle detection.
 */
function buildAdjacencyList(nodes: Map<string, TreeNode>): Map<string, string[]> {
  const adj: Map<string, string[]> = new Map();
  for (const [id, node] of nodes) {
    adj.set(id, node.children);
  }
  return adj;
}

/**
 * Checks if moving nodeId under newParentId would create a cycle.
 * Uses BFS from newParentId to check if nodeId is an ancestor.
 */
export function wouldCreateCycle(
  nodes: Map<string, TreeNode>,
  nodeId: string,
  newParentId: string | null,
): boolean {
  if (!newParentId) return false; // Moving to root — no cycle possible

  // BFS from newParentId to see if nodeId is in its ancestry chain
  const queue: string[] = [newParentId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === nodeId) return true; // Cycle detected
    if (visited.has(current)) continue;
    visited.add(current);

    const node = nodes.get(current);
    if (node && node.parentId) {
      queue.push(node.parentId);
    }
  }

  return false;
}

/**
 * Validates a move operation. Returns error message if invalid, null if valid.
 */
export function validateMove(
  nodes: Map<string, TreeNode>,
  nodeId: string,
  newParentId: string | null,
): string | null {
  if (nodeId === newParentId) return 'Cannot move a node into itself';
  if (wouldCreateCycle(nodes, nodeId, newParentId)) {
    return 'Cannot move a node into its own descendant';
  }
  return null;
}

/**
 * Executes a validated move. Assumes validation has already passed.
 */
export function executeMove(
  nodes: Map<string, TreeNode>,
  nodeId: string,
  newParentId: string | null,
): void {
  const node = nodes.get(nodeId);
  if (!node) return;

  // Remove from old parent
  if (node.parentId) {
    const oldParent = nodes.get(node.parentId);
    if (oldParent) {
      oldParent.children = oldParent.children.filter((id) => id !== nodeId);
    }
  }

  // Add to new parent
  node.parentId = newParentId;
  if (newParentId) {
    const newParent = nodes.get(newParentId);
    if (newParent && !newParent.children.includes(nodeId)) {
      newParent.children.push(nodeId);
    }
  }
}
