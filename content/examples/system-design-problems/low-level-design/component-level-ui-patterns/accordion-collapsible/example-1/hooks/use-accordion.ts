'use client';
import { useState, useCallback, useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { AccordionMode } from '../lib/accordion-types';

interface UseAccordionOptions {
  mode: AccordionMode;
  defaultOpen?: string | string[];
  totalItems: number;
  onToggle?: (id: string | null, openIds: Set<string>) => void;
}

interface UseAccordionReturn {
  openId: string | null;
  openIds: Set<string>;
  focusedIndex: number;
  toggle: (id: string) => void;
  open: (id: string) => void;
  close: (id: string) => void;
  setFocusedIndex: (index: number) => void;
  handleKeyDown: (e: ReactKeyboardEvent) => void;
  itemIds: string[];
}

export function useAccordion({ mode, defaultOpen, totalItems, onToggle }: UseAccordionOptions): UseAccordionReturn {
  const [openId, setOpenId] = useState<string | null>(
    mode === 'exclusive' ? (typeof defaultOpen === 'string' ? defaultOpen : null) : null
  );
  const [openIds, setOpenIds] = useState<Set<string>>(
    mode === 'independent'
      ? new Set(Array.isArray(defaultOpen) ? defaultOpen : defaultOpen ? [defaultOpen] : [])
      : new Set()
  );
  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemIdsRef = useRef<string[]>([]);

  const toggle = useCallback(
    (id: string) => {
      if (mode === 'exclusive') {
        setOpenId((prev) => {
          const next = prev === id ? null : id;
          onToggle?.(next, new Set());
          return next;
        });
      } else {
        setOpenIds((prev) => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          onToggle?.(null, next);
          return next;
        });
      }
    },
    [mode, onToggle]
  );

  const open = useCallback(
    (id: string) => {
      if (mode === 'exclusive') {
        setOpenId(id);
        onToggle?.(id, new Set());
      } else {
        setOpenIds((prev) => {
          const next = new Set(prev).add(id);
          onToggle?.(null, next);
          return next;
        });
      }
    },
    [mode, onToggle]
  );

  const close = useCallback(
    (id: string) => {
      if (mode === 'exclusive') {
        setOpenId(null);
        onToggle?.(null, new Set());
      } else {
        setOpenIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          onToggle?.(null, next);
          return next;
        });
      }
    },
    [mode, onToggle]
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      const currentIndex = focusedIndex;
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % totalItems;
          setFocusedIndex(nextIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (currentIndex - 1 + totalItems) % totalItems;
          setFocusedIndex(nextIndex);
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(totalItems - 1);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (itemIdsRef.current[currentIndex]) {
            toggle(itemIdsRef.current[currentIndex]);
          }
          break;
      }
    },
    [focusedIndex, totalItems, toggle]
  );

  // Expose item IDs for keyboard navigation
  const registerItemId = useCallback((index: number, id: string) => {
    itemIdsRef.current[index] = id;
  }, []);

  useEffect(() => {
    return () => {
      itemIdsRef.current = [];
    };
  }, []);

  return {
    openId,
    openIds,
    focusedIndex,
    toggle,
    open,
    close,
    setFocusedIndex,
    handleKeyDown,
    itemIds: itemIdsRef.current,
  };
}

export function useAccordionItem(
  id: string,
  index: number,
  registerId: (index: number, id: string) => void
) {
  useEffect(() => {
    registerId(index, id);
    return () => {
      registerId(index, '');
    };
  }, [id, index, registerId]);
}
