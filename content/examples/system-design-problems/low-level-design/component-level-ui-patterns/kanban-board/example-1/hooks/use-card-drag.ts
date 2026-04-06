'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import type { KanbanColumn } from '../lib/kanban-types';

interface UseCardDragOptions {
  cardId: string;
  sourceColumnId: string;
  columns: KanbanColumn[];
  onDragStart: (cardId: string, sourceColumn: string) => void;
  onDrop: (targetColumn: string, dropIndex?: number) => void;
  onDragEnd: () => void;
}

interface UseCardDragReturn {
  isDragging: boolean;
  pointerX: number;
  pointerY: number;
  activeColumnId: string | null;
  getPointerHandlers: () => Record<string, (e: PointerEvent) => void>;
}

/**
 * Pointer-based drag hook with column drop detection.
 * Uses Pointer Events API for unified mouse + touch support.
 * Attaches listeners at the document level for reliable tracking.
 */
export function useCardDrag({
  cardId,
  sourceColumnId,
  columns,
  onDragStart,
  onDrop,
  onDragEnd,
}: UseCardDragOptions): UseCardDragReturn {
  const [isDragging, setIsDragging] = useState(false);
  const [pointerX, setPointerX] = useState(0);
  const [pointerY, setPointerY] = useState(0);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasStartedRef = useRef(false);

  // Threshold in pixels before a drag is considered "started"
  const DRAG_THRESHOLD = 5;

  // ─── Hit-test: find which column element contains the point ─────────────
  const findColumnAtPoint = useCallback(
    (x: number, y: number): string | null => {
      // Use document.elementFromPoint to find the column under the pointer
      const el = document.elementFromPoint(x, y);
      if (!el) return null;
      const columnEl = el.closest('[data-column-id]') as HTMLElement | null;
      return columnEl?.dataset.columnId ?? null;
    },
    []
  );

  // ─── Pointer down ───────────────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      startPosRef.current = { x: e.clientX, y: e.clientY };
      hasStartedRef.current = false;

      // Capture the pointer so we get move/up events even if cursor leaves element
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    []
  );

  // ─── Pointer move ───────────────────────────────────────────────────────
  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!startPosRef.current) return;

      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      setPointerX(e.clientX);
      setPointerY(e.clientY);

      // Start drag once threshold is crossed
      if (!hasStartedRef.current && distance > DRAG_THRESHOLD) {
        hasStartedRef.current = true;
        setIsDragging(true);
        onDragStart(cardId, sourceColumnId);
      }

      if (hasStartedRef.current) {
        const colId = findColumnAtPoint(e.clientX, e.clientY);
        setActiveColumnId(colId);
      }
    },
    [cardId, sourceColumnId, findColumnAtPoint, onDragStart]
  );

  // ─── Pointer up ─────────────────────────────────────────────────────────
  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      startPosRef.current = null;

      if (hasStartedRef.current) {
        const targetCol = findColumnAtPoint(e.clientX, e.clientY);
        if (targetCol) {
          onDrop(targetCol);
        }
        setIsDragging(false);
        setActiveColumnId(null);
        hasStartedRef.current = false;
      }

      onDragEnd();
    },
    [findColumnAtPoint, onDrop, onDragEnd]
  );

  // ─── Attach document-level listeners when dragging ──────────────────────
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDragging, onPointerMove, onPointerUp]);

  const getPointerHandlers = useCallback(() => ({
    onPointerDown,
  }), [onPointerDown]);

  return {
    isDragging,
    pointerX,
    pointerY,
    activeColumnId,
    getPointerHandlers,
  };
}
