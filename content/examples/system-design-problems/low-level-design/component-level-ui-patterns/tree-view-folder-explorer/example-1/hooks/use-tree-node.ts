import { useCallback, useState } from 'react';
import { useTreeStore } from '../lib/tree-store';
import type { ContextMenuAction } from '../lib/tree-types';

/**
 * Per-node hook that manages expand/collapse, selection,
 * context menu triggering, and drag source setup.
 */
export function useTreeNode(id: string) {
  const node = useTreeStore((state) => state.nodes.get(id));
  const isExpanded = useTreeStore((state) => state.expandedIds.has(id));
  const isLoading = useTreeStore((state) => state.loadingIds.has(id));
  const isSelected = useTreeStore((state) => state.selectedIds.has(id));
  const searchQuery = useTreeStore((state) => state.searchQuery);

  const expandNode = useTreeStore((state) => state.expandNode);
  const collapseNode = useTreeStore((state) => state.collapseNode);
  const selectNode = useTreeStore((state) => state.selectNode);
  const setContextMenu = useTreeStore((state) => state.setContextMenu);

  const [isRenaming, setIsRenaming] = useState(false);

  const handleToggle = useCallback(() => {
    if (node?.type === 'folder') {
      if (isExpanded) {
        collapseNode(id);
      } else {
        // Pass a fetch function — in production this would be an API call
        expandNode(id, async (parentId) => {
          const response = await fetch(`/api/tree/${parentId}/children`);
          if (!response.ok) throw new Error('Failed to fetch children');
          const data = await response.json();
          return data;
        });
      }
    }
  }, [node?.type, isExpanded, id, expandNode, collapseNode]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const multi = e.ctrlKey || e.metaKey;
      const range = e.shiftKey;
      selectNode(id, multi, range, []); // visibleIds would be passed from the tree view
    },
    [id, selectNode]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        nodeId: id,
      });
    },
    [id, setContextMenu]
  );

  const handleAction = useCallback(
    (action: ContextMenuAction) => {
      switch (action) {
        case 'rename':
          setIsRenaming(true);
          break;
        case 'delete':
          useTreeStore.getState().deleteNode(id);
          break;
        case 'copy':
          useTreeStore.getState().setClipboard([id], 'copy');
          break;
        case 'move':
          useTreeStore.getState().setClipboard([id], 'cut');
          break;
        case 'newFolder':
        case 'newFile':
        case 'paste':
          // Handled at the tree view level
          break;
      }
    },
    [id]
  );

  return {
    node,
    isExpanded,
    isLoading,
    isSelected,
    searchQuery,
    isRenaming,
    setIsRenaming,
    handleToggle,
    handleClick,
    handleContextMenu,
    handleAction,
  };
}
