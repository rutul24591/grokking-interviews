/**
 * Deep Nesting Collapse — Enforces max nesting depth with "show more replies" pattern.
 *
 * Interview edge case: Comment threads can go arbitrarily deep (reply to reply to reply).
 * Rendering deeply nested comments causes horizontal overflow and poor UX.
 * Solution: collapse threads beyond max depth into "Show X more replies" expandable sections.
 */

export interface CommentNode {
  id: string;
  content: string;
  replies: CommentNode[];
  depth: number;
}

/**
 * Transforms a comment tree, collapsing nodes beyond maxDepth into expandable summaries.
 */
export function collapseDeepComments(
  root: CommentNode,
  maxDepth: number,
): CommentNode | CollapsedSummary {
  if (root.depth > maxDepth) {
    // Count total descendants
    const count = countDescendants(root);
    return { type: 'collapsed', count, root };
  }

  return {
    ...root,
    replies: root.replies.map((reply) => collapseDeepComments(reply, maxDepth)),
  };
}

export interface CollapsedSummary {
  type: 'collapsed';
  count: number;
  root: CommentNode;
}

/**
 * Counts all descendants of a comment node (including the node itself).
 */
function countDescendants(node: CommentNode): number {
  let count = 1;
  for (const reply of node.replies) {
    count += countDescendants(reply);
  }
  return count;
}

/**
 * Flattens a collapsed tree back into a full tree for rendering when user expands.
 */
export function expandCollapsed(root: CommentNode | CollapsedSummary): CommentNode {
  if (root.type === 'collapsed') {
    return root.root;
  }
  return {
    ...root,
    replies: root.replies.map((reply) => expandCollapsed(reply as CommentNode | CollapsedSummary)),
  };
}
