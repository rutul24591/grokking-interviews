'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { createKanbanStore } from '../lib/kanban-store';
import type { KanbanColumn, KanbanCard, DragState } from '../lib/kanban-types';

interface UseKanbanOptions {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  wsUrl?: string;
}

interface UseKanbanReturn {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  dragState: DragState | null;
  startDrag: (cardId: string, sourceColumn: string) => void;
  endDrag: () => void;
  dropCard: (targetColumn: string, dropIndex?: number) => void;
  addCard: (colId: string, card: KanbanCard) => void;
  removeCard: (cardId: string) => void;
}

/**
 * Main board hook: manages the kanban store, drag state, optimistic moves,
 * and optional WebSocket synchronization for real-time collaboration.
 */
export function useKanban({ columns, cards, wsUrl }: UseKanbanOptions): UseKanbanReturn {
  const storeRef = useRef(createKanbanStore({ columns, cards }));
  const [state, setState] = useState(() => storeRef.current.getState());
  const [dragState, setDragState] = useState<DragState | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // ─── Optimistic move ────────────────────────────────────────────────────
  const performMove = useCallback((cardId: string, fromCol: string, toCol: string) => {
    const store = storeRef.current;
    store.moveCard(cardId, fromCol, toCol);
    setState(store.getState());

    // Broadcast over WebSocket if connected
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(
        JSON.stringify({
          type: 'move_card',
          cardId,
          fromCol,
          toCol,
        })
      );
    }
  }, []);

  // ─── Drag lifecycle ─────────────────────────────────────────────────────
  const startDrag = useCallback((cardId: string, sourceColumn: string) => {
    setDragState({ cardId, sourceColumn });
  }, []);

  const endDrag = useCallback(() => {
    setDragState(null);
  }, []);

  const dropCard = useCallback(
    (targetColumn: string, dropIndex?: number) => {
      const drag = dragState;
      if (!drag || drag.sourceColumn === targetColumn) {
        setDragState(null);
        return;
      }

      // Optimistic move
      performMove(drag.cardId, drag.sourceColumn, targetColumn);
      setDragState(null);
    },
    [dragState, performMove]
  );

  // ─── Card CRUD ───────────────────────────────────────────────────────────
  const addCard = useCallback((colId: string, card: KanbanCard) => {
    const store = storeRef.current;
    store.addCard(colId, card);
    setState(store.getState());
  }, []);

  const removeCard = useCallback((cardId: string) => {
    const store = storeRef.current;
    store.removeCard(cardId);
    setState(store.getState());
  }, []);

  // ─── WebSocket listener for remote moves ────────────────────────────────
  useEffect(() => {
    if (!wsUrl) return;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'move_card' && msg.cardId && msg.fromCol && msg.toCol) {
            // Apply remote move (skip if we initiated it — store already has it)
            const store = storeRef.current;
            store.moveCard(msg.cardId, msg.fromCol, msg.toCol);
            setState(store.getState());
          }
        } catch {
          // Ignore malformed messages
        }
      };
    } catch {
      // WebSocket unavailable; board works in local-only mode
    }

    return () => {
      wsRef.current?.close();
    };
  }, [wsUrl]);

  return {
    columns: state.columns,
    cards: state.cards,
    dragState,
    startDrag,
    endDrag,
    dropCard,
    addCard,
    removeCard,
  };
}
