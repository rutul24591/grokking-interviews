'use client';

import React from 'react';
import { useTreeStore } from '../lib/tree-store';
import { getPath } from '../lib/tree-utils';

/**
 * Path breadcrumb for the currently selected node.
 * Shows the full path from root to the selected node.
 * Each segment is clickable to navigate to that ancestor.
 */
export function TreeBreadcrumb() {
  const nodes = useTreeStore((state) => state.nodes);
  const selectedIds = useTreeStore((state) => state.selectedIds);
  const selectNode = useTreeStore((state) => state.selectNode);

  // Use the first selected node for breadcrumb
  const firstSelectedId = Array.from(selectedIds)[0] || null;
  if (!firstSelectedId) {
    return (
      <div className="flex items-center gap-1 border-t border-theme bg-panel-soft px-3 py-2 text-xs text-muted-foreground">
        No selection
      </div>
    );
  }

  const path = getPath(nodes, firstSelectedId);
  if (path.length === 0) return null;

  return (
    <div className="flex items-center gap-1 border-t border-theme bg-panel-soft px-3 py-2 text-xs overflow-x-auto">
      {path.map((node, idx) => (
        <React.Fragment key={node.id}>
          {idx > 0 && <span className="text-muted-foreground">/</span>}
          <button
            className={`hover:text-accent transition-colors ${
              idx === path.length - 1 ? 'font-semibold text-foreground' : 'text-muted-foreground'
            }`}
            onClick={() => {
              selectNode(node.id, false, false, []);
            }}
            title={node.name}
          >
            {node.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
