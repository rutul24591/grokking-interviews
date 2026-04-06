'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useTreeStore } from '../lib/tree-store';
import { TreeNodeList } from './tree-node-list';
import { TreeSearchBar } from './tree-search-bar';
import { TreeBreadcrumb } from './tree-breadcrumb';
import { TreeContextMenu } from './tree-context-menu';

interface TreeViewProps {
  /** Function to fetch children for a given node ID */
  fetchChildren: (id: string) => Promise<import('../lib/tree-types').TreeNode[]>;
  /** Root node IDs */
  rootIds: string[];
  /** Enable multi-select mode */
  multiSelect?: boolean;
  /** Enable drag and drop */
  enableDragDrop?: boolean;
}

/**
 * Root tree container with keyboard navigation.
 * Renders the search bar, breadcrumb, and the tree node list.
 */
export function TreeView({
  fetchChildren,
  rootIds,
  multiSelect = false,
  enableDragDrop = true,
}: TreeViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useTreeStore((state) => state.nodes);
  const expandedIds = useTreeStore((state) => state.expandedIds);
  const selectedIds = useTreeStore((state) => state.selectedIds);

  // Compute visible node IDs via BFS
  const getVisibleNodeIds = useCallback((): string[] => {
    const visible: string[] = [];
    const queue = [...rootIds];
    while (queue.length > 0) {
      const id = queue.shift()!;
      const node = nodes.get(id);
      if (!node) continue;
      visible.push(id);
      if (node.type === 'folder' && expandedIds.has(id)) {
        queue.push(...node.children);
      }
    }
    return visible;
  }, [rootIds, nodes, expandedIds]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const visibleIds = getVisibleNodeIds();
      if (visibleIds.length === 0) return;

      // Find currently focused node
      const focusedElement = document.activeElement?.closest('[data-tree-node-id]');
      const focusedId = focusedElement?.getAttribute('data-tree-node-id') || null;
      const focusedIdx = focusedId ? visibleIds.indexOf(focusedId) : -1;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIdx = focusedIdx < visibleIds.length - 1 ? focusedIdx + 1 : 0;
          const nextEl = containerRef.current?.querySelector(
            `[data-tree-node-id="${visibleIds[nextIdx]}"]`
          ) as HTMLElement;
          nextEl?.focus();
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIdx = focusedIdx > 0 ? focusedIdx - 1 : visibleIds.length - 1;
          const prevEl = containerRef.current?.querySelector(
            `[data-tree-node-id="${visibleIds[prevIdx]}"]`
          ) as HTMLElement;
          prevEl?.focus();
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          if (focusedId) {
            const node = nodes.get(focusedId);
            if (node?.type === 'folder' && !expandedIds.has(focusedId)) {
              useTreeStore.getState().expandNode(focusedId, fetchChildren);
            }
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          if (focusedId) {
            const node = nodes.get(focusedId);
            if (node?.type === 'folder' && expandedIds.has(focusedId)) {
              useTreeStore.getState().collapseNode(focusedId);
            } else if (node?.parentId) {
              // Move focus to parent
              const parentEl = containerRef.current?.querySelector(
                `[data-tree-node-id="${node.parentId}"]`
              ) as HTMLElement;
              parentEl?.focus();
            }
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (focusedId) {
            useTreeStore.getState().selectNode(focusedId, false, false, visibleIds);
          }
          break;
        }
        case ' ': {
          e.preventDefault();
          if (focusedId && multiSelect) {
            useTreeStore.getState().selectNode(focusedId, true, false, visibleIds);
          }
          break;
        }
        case 'a': {
          if ((e.ctrlKey || e.metaKey) && multiSelect) {
            e.preventDefault();
            useTreeStore.getState().selectAll(visibleIds);
          }
          break;
        }
      }
    },
    [getVisibleNodeIds, nodes, expandedIds, fetchChildren, multiSelect]
  );

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = () => {
      const ctx = useTreeStore.getState().contextMenu;
      if (ctx.visible) {
        useTreeStore.getState().setContextMenu({ visible: false });
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <TreeSearchBar />

      <div className="flex-1 overflow-auto" ref={containerRef} onKeyDown={handleKeyDown} tabIndex={0} role="tree" aria-multiselectable={multiSelect}>
        <TreeNodeList
          nodeIds={rootIds}
          depth={0}
          visibleIds={getVisibleNodeIds()}
          fetchChildren={fetchChildren}
          multiSelect={multiSelect}
          enableDragDrop={enableDragDrop}
        />
      </div>

      <TreeBreadcrumb />
      <TreeContextMenu />
    </div>
  );
}
