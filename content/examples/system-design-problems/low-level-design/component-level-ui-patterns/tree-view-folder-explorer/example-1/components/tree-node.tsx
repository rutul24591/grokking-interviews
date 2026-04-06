'use client';

import React, { useCallback, useRef } from 'react';
import { useTreeNode } from '../hooks/use-tree-node';
import { useTreeDrag } from '../hooks/use-tree-drag';
import { useTreeStore } from '../lib/tree-store';
import { FILE_ICONS, FOLDER_OPEN_ICON, FOLDER_CLOSED_ICON } from '../lib/tree-types';
import { getHighlightSegments } from '../lib/tree-utils';

interface TreeNodeProps {
  nodeId: string;
  depth: number;
  multiSelect: boolean;
  enableDragDrop: boolean;
  searchQuery: string;
}

/**
 * Individual tree node with icon, label, checkbox,
 * expand/collapse chevron, context menu, and drag handle.
 */
export function TreeNode({
  nodeId,
  depth,
  multiSelect,
  enableDragDrop,
  searchQuery,
}: TreeNodeProps) {
  const {
    node,
    isExpanded,
    isLoading,
    isSelected,
    isRenaming,
    setIsRenaming,
    handleToggle,
    handleClick,
    handleContextMenu,
    handleAction,
  } = useTreeNode(nodeId);

  const { handleDragStart, handleDragOver, handleDrop, handleDragEnd, isDropValid } =
    useTreeDrag();

  const renameInputRef = useRef<HTMLInputElement>(null);

  const handleRenameSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newName = renameInputRef.current?.value.trim();
      if (newName && newName !== node?.name) {
        const success = useTreeStore.getState().renameNode(nodeId, newName);
        if (!success) {
          // Show error: name already exists
          alert('A file or folder with this name already exists.');
        }
      }
      setIsRenaming(false);
    },
    [nodeId, node?.name, setIsRenaming]
  );

  if (!node) return null;

  // Determine icon
  let icon = FOLDER_CLOSED_ICON;
  if (node.type === 'folder' && isExpanded) {
    icon = FOLDER_OPEN_ICON;
  } else if (node.type === 'file' && node.metadata?.extension) {
    icon = FILE_ICONS[node.metadata.extension] || '📄';
  }

  // Determine if this node is a valid drop target
  const isValidDropTarget = false; // Would be computed from drag state

  // Highlight segments for search
  const segments = searchQuery
    ? getHighlightSegments(node.name, searchQuery)
    : [{ text: node.name, isMatch: false }];

  const indentation = depth * 24;

  return (
    <div
      data-tree-node-id={nodeId}
      tabIndex={0}
      role="treeitem"
      aria-expanded={node.type === 'folder' ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={depth + 1}
      draggable={enableDragDrop}
      onDragStart={(e) => handleDragStart(e, nodeId)}
      onDragOver={(e) => handleDragOver(e, nodeId)}
      onDrop={(e) => handleDrop(e, nodeId)}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className={`flex cursor-pointer items-center rounded px-2 py-1 text-sm transition-colors ${
        isSelected
          ? 'bg-accent/20 text-accent'
          : 'hover:bg-panel-hover'
      } ${isValidDropTarget ? 'ring-2 ring-accent' : ''}`}
      style={{ paddingLeft: `${indentation + 8}px` }}
    >
      {/* Expand/Collapse Chevron */}
      {node.type === 'folder' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          className="mr-1 flex h-4 w-4 items-center justify-center text-xs"
          aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
        >
          {isExpanded ? '▾' : '▸'}
        </button>
      )}
      {node.type === 'file' && <span className="mr-1 w-4" />}

      {/* Loading spinner */}
      {isLoading && <span className="mr-1 text-xs animate-spin">⏳</span>}

      {/* Icon */}
      <span className="mr-1.5 text-base" role="img" aria-label={node.type}>
        {icon}
      </span>

      {/* Checkbox for multi-select */}
      {multiSelect && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="mr-2 h-3.5 w-3.5 rounded"
          aria-label={`Select ${node.name}`}
        />
      )}

      {/* Label */}
      {isRenaming ? (
        <form onSubmit={handleRenameSubmit} className="flex-1">
          <input
            ref={renameInputRef}
            defaultValue={node.name}
            className="w-full rounded border border-theme bg-panel px-1 py-0.5 text-sm"
            autoFocus
            onBlur={handleRenameSubmit}
          />
        </form>
      ) : (
        <span className="flex-1 truncate">
          {segments.map((seg, i) =>
            seg.isMatch ? (
              <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
                {seg.text}
              </mark>
            ) : (
              <span key={i}>{seg.text}</span>
            )
          )}
        </span>
      )}

      {/* File metadata */}
      {node.type === 'file' && node.metadata?.size != null && (
        <span className="ml-4 text-xs text-muted-foreground">
          {formatFileSize(node.metadata.size)}
        </span>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
