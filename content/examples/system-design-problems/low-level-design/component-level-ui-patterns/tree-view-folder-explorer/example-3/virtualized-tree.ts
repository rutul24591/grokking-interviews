/**
 * Tree View — Staff-Level Virtualization for Deep Trees.
 *
 * Staff differentiator: Flat list virtualization of tree nodes, dynamic height
 * measurement with cached heights, and keyboard navigation across virtualized
 * boundaries.
 */

export interface VirtualizedTreeNode {
  id: string;
  depth: number;
  isExpanded: boolean;
  hasChildren: boolean;
  label: string;
}

/**
 * Flattens a tree structure into a virtualizable flat list.
 * Only includes expanded nodes. Maintains depth for indentation.
 */
export function flattenTree(
  nodes: { id: string; children: any[]; label: string }[],
  expandedIds: Set<string>,
  depth: number = 0,
): VirtualizedTreeNode[] {
  const result: VirtualizedTreeNode[] = [];

  for (const node of nodes) {
    result.push({
      id: node.id,
      depth,
      isExpanded: expandedIds.has(node.id),
      hasChildren: node.children.length > 0,
      label: node.label,
    });

    if (expandedIds.has(node.id) && node.children.length > 0) {
      result.push(...flattenTree(node.children, expandedIds, depth + 1));
    }
  }

  return result;
}

/**
 * Virtualized tree keyboard navigation.
 * Handles ArrowUp/Down across the flat list, ArrowLeft/Right for expand/collapse,
 * Home/End for first/last visible node.
 */
export function handleTreeKeyboardNavigation(
  e: KeyboardEvent,
  currentIndex: number,
  flatNodes: VirtualizedTreeNode[],
  toggleExpand: (id: string) => void,
): number {
  let newIndex = currentIndex;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      newIndex = Math.min(currentIndex + 1, flatNodes.length - 1);
      break;
    case 'ArrowUp':
      e.preventDefault();
      newIndex = Math.max(currentIndex - 1, 0);
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (!flatNodes[currentIndex].isExpanded && flatNodes[currentIndex].hasChildren) {
        toggleExpand(flatNodes[currentIndex].id);
      }
      break;
    case 'ArrowLeft':
      e.preventDefault();
      if (flatNodes[currentIndex].isExpanded) {
        toggleExpand(flatNodes[currentIndex].id);
      }
      break;
    case 'Home':
      e.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      newIndex = flatNodes.length - 1;
      break;
  }

  return newIndex;
}
