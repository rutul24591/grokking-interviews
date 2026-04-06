'use client';

import React from 'react';
import { useTreeStore } from '../lib/tree-store';
import { TreeNode } from './tree-node';

interface TreeNodeListProps {
  nodeIds: string[];
  depth: number;
  visibleIds: string[];
  fetchChildren: (id: string) => Promise<import('../lib/tree-types').TreeNode[]>;
  multiSelect: boolean;
  enableDragDrop: boolean;
}

/**
 * Renders a list of nodes at a given depth level.
 * For expanded folders, recursively renders their children.
 */
export function TreeNodeList({
  nodeIds,
  depth,
  visibleIds,
  fetchChildren,
  multiSelect,
  enableDragDrop,
}: TreeNodeListProps) {
  const nodes = useTreeStore((state) => state.nodes);
  const expandedIds = useTreeStore((state) => state.expandedIds);
  const searchQuery = useTreeStore((state) => state.searchQuery);

  return (
    <div role="group">
      {nodeIds.map((nodeId) => {
        const node = nodes.get(nodeId);
        if (!node) return null;

        // If search is active, check if this node should be visible
        if (searchQuery && !visibleIds.includes(nodeId)) {
          return null;
        }

        const isExpanded = expandedIds.has(nodeId);

        return (
          <div key={nodeId}>
            <TreeNode
              nodeId={nodeId}
              depth={depth}
              multiSelect={multiSelect}
              enableDragDrop={enableDragDrop}
              searchQuery={searchQuery}
            />
            {/* Render children if folder is expanded */}
            {node.type === 'folder' && isExpanded && node.children.length > 0 && (
              <TreeNodeList
                nodeIds={node.children}
                depth={depth + 1}
                visibleIds={visibleIds}
                fetchChildren={fetchChildren}
                multiSelect={multiSelect}
                enableDragDrop={enableDragDrop}
              />
            )}
            {/* Loading indicator for lazy load */}
            {node.type === 'folder' && isExpanded && !node.isLoaded && (
              <div
                className="py-1 text-xs text-muted-foreground"
                style={{ paddingLeft: `${(depth + 1) * 24 + 8}px` }}
              >
                Loading...
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
