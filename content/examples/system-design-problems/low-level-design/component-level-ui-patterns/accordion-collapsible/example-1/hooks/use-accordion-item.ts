'use client';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

interface UseAccordionItemOptions {
  id: string;
  index: number;
  registerId: (index: number, id: string) => void;
  isOpen: boolean;
  disabled?: boolean;
  animated?: boolean;
  onToggle?: (id: string) => void;
}

interface UseAccordionItemReturn {
  isOpen: boolean;
  isDisabled: boolean;
  isAnimating: boolean;
  headerId: string;
  panelId: string;
  handleToggle: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  gridRowClass: string;
}

export function useAccordionItem({
  id,
  index,
  registerId,
  isOpen,
  disabled = false,
  animated = true,
  onToggle,
}: UseAccordionItemOptions): UseAccordionItemReturn {
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Register this item's ID with the parent hook for keyboard navigation
  useEffect(() => {
    registerId(index, id);
    return () => {
      registerId(index, '');
    };
  }, [id, index, registerId]);

  const handleToggle = useCallback(() => {
    if (disabled) return;

    if (animated) {
      setIsAnimating(true);
      // Clear animation flag after CSS transition completes (200ms matches our CSS duration)
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setTimeout(() => setIsAnimating(false), 200);
      });
    }

    onToggle?.(id);
  }, [disabled, animated, onToggle, id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle]
  );

  // Compute grid-row class for CSS grid-template-rows animation
  const gridRowClass = useMemo(() => {
    if (!animated) return isOpen ? '' : 'hidden';
    return isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0';
  }, [isOpen, animated]);

  const headerId = `header-${id}`;
  const panelId = `panel-${id}`;

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    isOpen,
    isDisabled: disabled,
    isAnimating,
    headerId,
    panelId,
    handleToggle,
    handleKeyDown,
    gridRowClass,
  };
}
