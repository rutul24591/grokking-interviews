import { useCallback, useState } from "react";

function clampIndex(next: number, len: number) {
  if (next < 0) return len - 1;
  if (next >= len) return 0;
  return next;
}

export function useRovingFocus({
  size,
  getNode,
  onActivate
}: {
  size: number;
  getNode: (index: number) => HTMLElement | null;
  onActivate?: (index: number) => void;
}) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const focus = useCallback(
    (idx: number) => {
      setFocusedIndex(idx);
      getNode(idx)?.focus();
    },
    [getNode]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        focus(clampIndex(focusedIndex + 1, size));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        focus(clampIndex(focusedIndex - 1, size));
      } else if (e.key === "Home") {
        e.preventDefault();
        focus(0);
      } else if (e.key === "End") {
        e.preventDefault();
        focus(size - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        onActivate?.(focusedIndex);
      }
    },
    [focus, focusedIndex, onActivate, size]
  );

  return { focusedIndex, setFocusedIndex, onKeyDown };
}

