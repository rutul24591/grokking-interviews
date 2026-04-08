/**
 * Avatar — Edge Case: Overlapping Avatar Stack with +N More.
 *
 * When displaying many avatars, overlap them visually. If more than max visible,
 * show a "+N" badge. Handle keyboard navigation through the stack.
 */

import { useState, useCallback } from 'react';

interface AvatarStackItem {
  id: string;
  src: string;
  alt: string;
}

export function useAvatarStack(avatars: AvatarStackItem[], maxVisible: number = 5) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);

  const visibleAvatars = avatars.slice(0, maxVisible);
  const overflowCount = avatars.length - maxVisible;

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (index < visibleAvatars.length - 1) {
        setHoveredIndex(index + 1);
      } else if (overflowCount > 0) {
        setShowOverflowMenu(true);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (index > 0) {
        setHoveredIndex(index - 1);
      }
    } else if (e.key === 'Escape') {
      setShowOverflowMenu(false);
      setHoveredIndex(null);
    }
  }, [visibleAvatars.length, overflowCount]);

  return {
    visibleAvatars,
    overflowCount,
    hoveredIndex,
    showOverflowMenu,
    setShowOverflowMenu,
    handleKeyDown,
    setHoveredIndex,
  };
}
