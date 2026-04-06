'use client';

import React, { useCallback } from 'react';
import { useTreeStore } from '../lib/tree-store';
import type { ContextMenuAction } from '../lib/tree-types';

interface ContextMenuItemProps {
  action: ContextMenuAction;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  onClick: (action: ContextMenuAction) => void;
}

function ContextMenuItem({ action, label, shortcut, disabled, onClick }: ContextMenuItemProps) {
  return (
    <button
      className={`flex w-full items-center justify-between rounded px-3 py-1.5 text-sm transition-colors ${
        disabled
          ? 'cursor-not-allowed text-muted-foreground opacity-50'
          : 'hover:bg-panel-hover'
      }`}
      onClick={() => !disabled && onClick(action)}
      disabled={disabled}
    >
      <span>{label}</span>
      {shortcut && <span className="text-xs text-muted-foreground">{shortcut}</span>}
    </button>
  );
}

/**
 * Right-click context menu with rename, delete, move, copy, new folder/file.
 * Renders at the cursor position stored in the store.
 */
export function TreeContextMenu() {
  const contextMenu = useTreeStore((state) => state.contextMenu);
  const selectedCount = useTreeStore((state) => state.selectedIds.size);
  const hasClipboard = useTreeStore((state) => state.clipboard !== null);
  const setContextMenu = useTreeStore((state) => state.setContextMenu);

  const handleAction = useCallback(
    (action: ContextMenuAction) => {
      const nodeId = contextMenu.nodeId;
      if (!nodeId) return;

      switch (action) {
        case 'rename':
          // Set node into rename mode — handled by TreeNode
          break;
        case 'delete':
          if (selectedCount > 1) {
            // Bulk delete
            for (const id of useTreeStore.getState().selectedIds) {
              useTreeStore.getState().deleteNode(id);
            }
          } else {
            useTreeStore.getState().deleteNode(nodeId);
          }
          break;
        case 'copy':
          if (selectedCount > 1) {
            useTreeStore
              .getState()
              .setClipboard(Array.from(useTreeStore.getState().selectedIds), 'copy');
          } else {
            useTreeStore.getState().setClipboard([nodeId], 'copy');
          }
          break;
        case 'move':
          if (selectedCount > 1) {
            useTreeStore
              .getState()
              .setClipboard(Array.from(useTreeStore.getState().selectedIds), 'cut');
          } else {
            useTreeStore.getState().setClipboard([nodeId], 'cut');
          }
          break;
        case 'paste':
          // Paste into the context-menu node (must be a folder)
          useTreeStore.getState().pasteClipboard(nodeId);
          break;
        case 'newFolder':
          // Create a new folder as a child of the context-menu node
          break;
        case 'newFile':
          // Create a new file as a child of the context-menu node
          break;
      }

      setContextMenu({ visible: false });
    },
    [contextMenu.nodeId, selectedCount, setContextMenu]
  );

  if (!contextMenu.visible || !contextMenu.nodeId) return null;

  const node = useTreeStore.getState().nodes.get(contextMenu.nodeId);
  const isFolder = node?.type === 'folder';

  return (
    <div
      className="fixed z-50 min-w-[180px] rounded-lg border border-theme bg-panel p-1 shadow-lg"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      role="menu"
      onClick={(e) => e.stopPropagation()}
    >
      <ContextMenuItem action="rename" label="Rename" shortcut="F2" onClick={handleAction} />
      <ContextMenuItem action="copy" label={selectedCount > 1 ? `Copy (${selectedCount})` : 'Copy'} shortcut="Ctrl+C" onClick={handleAction} />
      <ContextMenuItem action="move" label={selectedCount > 1 ? `Cut (${selectedCount})` : 'Cut'} shortcut="Ctrl+X" onClick={handleAction} />
      {isFolder && (
        <ContextMenuItem
          action="paste"
          label="Paste"
          shortcut="Ctrl+V"
          disabled={!hasClipboard}
          onClick={handleAction}
        />
      )}
      <div className="my-1 h-px bg-border" />
      <ContextMenuItem
        action="delete"
        label={selectedCount > 1 ? `Delete (${selectedCount})` : 'Delete'}
        shortcut="Del"
        onClick={handleAction}
      />
      {isFolder && (
        <>
          <div className="my-1 h-px bg-border" />
          <ContextMenuItem action="newFolder" label="New Folder" onClick={handleAction} />
          <ContextMenuItem action="newFile" label="New File" onClick={handleAction} />
        </>
      )}
    </div>
  );
}
