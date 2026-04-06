import { useCallback, useRef, useState } from 'react';
import { useTreeStore } from '../lib/tree-store';
import { detectCircularRef } from '../lib/tree-utils';

interface DragState {
  draggedNodeId: string | null;
  dropTargetId: string | null;
  isDropValid: boolean;
}

/**
 * Hook for drag-to-move nodes between parents.
 * Handles drag source setup, drop target validation, and cycle detection.
 */
export function useTreeDrag() {
  const nodes = useTreeStore((state) => state.nodes);
  const moveNode = useTreeStore((state) => state.moveNode);
  const [dragState, setDragState] = useState<DragState>({
    draggedNodeId: null,
    dropTargetId: null,
    isDropValid: false,
  });

  const dragImageRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, nodeId: string) => {
      e.dataTransfer.setData('application/x-tree-node-id', nodeId);
      e.dataTransfer.effectAllowed = 'move';
      setDragState({
        draggedNodeId: nodeId,
        dropTargetId: null,
        isDropValid: false,
      });
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetNodeId: string) => {
      e.preventDefault();
      const { draggedNodeId } = dragState;
      if (!draggedNodeId) return;

      const targetNode = nodes.get(targetNodeId);
      const draggedNode = nodes.get(draggedNodeId);

      if (!targetNode || !draggedNode) {
        setDragState((prev) => ({ ...prev, isDropValid: false }));
        return;
      }

      // Target must be a folder
      if (targetNode.type !== 'folder') {
        setDragState((prev) => ({ ...prev, isDropValid: false, dropTargetId: null }));
        return;
      }

      // Cannot drop on self
      if (targetNodeId === draggedNodeId) {
        setDragState((prev) => ({ ...prev, isDropValid: false, dropTargetId: null }));
        return;
      }

      // Cycle detection
      if (
        draggedNode.type === 'folder' &&
        detectCircularRef(draggedNodeId, targetNodeId, nodes)
      ) {
        setDragState((prev) => ({ ...prev, isDropValid: false, dropTargetId: null }));
        return;
      }

      setDragState({
        draggedNodeId,
        dropTargetId: targetNodeId,
        isDropValid: true,
      });
    },
    [dragState, nodes]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetNodeId: string) => {
      e.preventDefault();
      const { draggedNodeId, isDropValid } = dragState;

      if (!draggedNodeId || !isDropValid) {
        setDragState({
          draggedNodeId: null,
          dropTargetId: null,
          isDropValid: false,
        });
        return;
      }

      const success = moveNode(draggedNodeId, targetNodeId);
      if (!success) {
        // Move was rejected (e.g., cycle detected at store level)
        console.warn('Move operation was rejected');
      }

      setDragState({
        draggedNodeId: null,
        dropTargetId: null,
        isDropValid: false,
      });
    },
    [dragState, moveNode]
  );

  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedNodeId: null,
      dropTargetId: null,
      isDropValid: false,
    });
  }, []);

  return {
    draggedNodeId: dragState.draggedNodeId,
    dropTargetId: dragState.dropTargetId,
    isDropValid: dragState.isDropValid,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
