import type { CommentNode } from './comment-types';
import { MAX_DEPTH } from './comment-types';

/**
 * Converts a flat list of comments (with parentId refs) into a nested
 * tree structure. Enforces MAX_DEPTH — nodes beyond the limit are
 * flattened and attached to their grandparent with a `_flattened` flag.
 */
export function buildTree(
  comments: Record<string, CommentNode>,
  rootIds: string[]
): CommentNode[] {
  const result: CommentNode[] = [];

  for (const rootId of rootIds) {
    const root = comments[rootId];
    if (!root || root.isDeleted) continue;
    result.push(buildSubtree(comments, root, 0));
  }

  return result;
}

function buildSubtree(
  comments: Record<string, CommentNode>,
  node: CommentNode,
  currentDepth: number
): CommentNode {
  const children: CommentNode[] = [];
  const flattenedChildren: CommentNode[] = [];

  for (const childId of node.childrenIds) {
    const child = comments[childId];
    if (!child || child.isDeleted) continue;

    if (currentDepth + 1 >= MAX_DEPTH) {
      // Beyond max depth — flatten
      flattenedChildren.push(child);
    } else {
      children.push(buildSubtree(comments, child, currentDepth + 1));
    }
  }

  return {
    ...node,
    depth: currentDepth,
    childrenIds: children.map((c) => c.id),
    // Store flattened children as a hidden field for "see more" rendering
    ...(flattenedChildren.length > 0
      ? { _flattenedChildren: flattenedChildren }
      : {}),
  } as CommentNode & { _flattenedChildren?: CommentNode[] };
}

/**
 * Calculates the depth of each comment node from its root.
 * Returns a map of commentId -> depth.
 */
export function calculateDepths(
  comments: Record<string, CommentNode>
): Record<string, number> {
  const depths: Record<string, number> = {};

  for (const [id, comment] of Object.entries(comments)) {
    if (comment.parentId === null) {
      depths[id] = 0;
    } else {
      depths[id] = computeDepth(comments, id, new Set<string>());
    }
  }

  return depths;
}

function computeDepth(
  comments: Record<string, CommentNode>,
  id: string,
  visited: Set<string>
): number {
  if (visited.has(id)) return 0; // cycle detection
  visited.add(id);

  const comment = comments[id];
  if (!comment || comment.parentId === null) return 0;

  return 1 + computeDepth(comments, comment.parentId, visited);
}

/**
 * Returns the ordered list of comment IDs that should be rendered,
 * respecting collapsed states and depth limits.
 */
export function getVisibleNodeIds(
  comments: Record<string, CommentNode>,
  rootIds: string[],
  collapsedThreads: Set<string>
): string[] {
  const visible: string[] = [];

  for (const rootId of rootIds) {
    collectVisible(comments, rootId, collapsedThreads, visible, 0);
  }

  return visible;
}

function collectVisible(
  comments: Record<string, CommentNode>,
  nodeId: string,
  collapsed: Set<string>,
  result: string[],
  depth: number
): void {
  const node = comments[nodeId];
  if (!node || node.isDeleted) return;

  result.push(nodeId);

  // If this thread is collapsed, don't recurse into children
  if (collapsed.has(nodeId)) return;

  // If at max depth, don't recurse
  if (depth >= MAX_DEPTH - 1) return;

  for (const childId of node.childrenIds) {
    collectVisible(comments, childId, collapsed, result, depth + 1);
  }
}

/**
 * Flattens a subtree into a flat list of comments (for "see more replies").
 */
export function flattenSubtree(
  comments: Record<string, CommentNode>,
  rootId: string
): CommentNode[] {
  const result: CommentNode[] = [];
  const queue = [rootId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const node = comments[current];
    if (!node || node.isDeleted) continue;

    result.push(node);
    queue.push(...node.childrenIds);
  }

  return result;
}
