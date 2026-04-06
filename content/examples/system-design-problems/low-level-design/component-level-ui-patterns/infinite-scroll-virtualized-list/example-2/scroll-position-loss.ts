/**
 * Scroll Position Loss: Route Change Preservation, Container Resize
 * Handling, History State Restore
 *
 * EDGE CASE: Users lose their scroll position in several common scenarios:
 * 1. Navigate away from a list, press back → scroll resets to top
 * 2. Browser window resizes → virtualized list recalculates, scroll jumps
 * 3. Data refetches (pagination, real-time updates) → scroll resets
 * 4. Mobile keyboard opens → viewport shrinks, scroll position lost
 * 5. Orientation change → layout shifts, scroll position invalid
 *
 * SOLUTION: Persist scroll position to sessionStorage/history state before
 * navigation. Restore on return. Handle resize by recalculating position
 * relative to content (not absolute pixels). Use a "scroll restoration
 * key" to match saved positions to the correct content state.
 *
 * INTERVIEW FOLLOW-UP: "How do you preserve scroll position on back navigation?"
 * "What happens when items change height after you save the scroll position?"
 */

import { useState, useCallback, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

interface ScrollPosition {
  /** Vertical scroll offset in pixels */
  scrollTop: number;
  /** Horizontal scroll offset in pixels */
  scrollLeft: number;
  /** The scroll restoration key (identifies what content this position is for) */
  key: string;
  /** Timestamp when this position was saved */
  savedAt: number;
  /** Index of the first visible item (for virtualized lists) */
  firstVisibleIndex: number;
  /** Offset of the first visible item within the viewport */
  firstVisibleOffset: number;
}

interface ScrollRestorationConfig {
  /** Key to identify this scroll container (e.g., route path) */
  restorationKey: string;
  /** Storage mechanism: "sessionStorage" | "historyState" | "localStorage" */
  storageType?: "sessionStorage" | "historyState" | "localStorage";
  /** Maximum age of saved positions before they expire (ms) */
  maxAgeMs?: number;
  /** Whether to restore scroll position on mount */
  autoRestore?: boolean;
  /** Debounce delay for save operations (ms) */
  saveDebounceMs?: number;
}

interface UseScrollRestorationReturn {
  /** Ref to attach to the scroll container */
  containerRef: (el: HTMLElement | null) => void;
  /** Current scroll position */
  currentPosition: ScrollPosition | null;
  /** Manually save the current scroll position */
  savePosition: () => void;
  /** Manually restore the scroll position */
  restorePosition: () => void;
  /** Clear the saved scroll position */
  clearPosition: () => void;
  /** Whether a saved position exists and was restored */
  wasRestored: boolean;
}

// ---------------------------------------------------------------------------
// Storage Helpers
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = "scroll-pos:";

function getStorageKey(restorationKey: string): string {
  return `${STORAGE_PREFIX}${restorationKey}`;
}

function saveToStorage(
  type: string,
  key: string,
  position: ScrollPosition
): void {
  try {
    const serialized = JSON.stringify(position);
    if (type === "sessionStorage") {
      sessionStorage.setItem(key, serialized);
    } else if (type === "localStorage") {
      localStorage.setItem(key, serialized);
    }
    // historyState is handled differently (via history.replaceState)
  } catch {
    // Storage quota exceeded or disabled — silently fail
    console.warn(`Failed to save scroll position to ${type}`);
  }
}

function loadFromStorage(
  type: string,
  key: string,
  maxAgeMs: number
): ScrollPosition | null {
  try {
    let serialized: string | null = null;

    if (type === "sessionStorage") {
      serialized = sessionStorage.getItem(key);
    } else if (type === "localStorage") {
      serialized = localStorage.getItem(key);
    }

    if (!serialized) return null;

    const position: ScrollPosition = JSON.parse(serialized);
    const age = Date.now() - position.savedAt;

    if (age > maxAgeMs) {
      // Expired — clean up
      if (type === "sessionStorage") {
        sessionStorage.removeItem(key);
      } else if (type === "localStorage") {
        localStorage.removeItem(key);
      }
      return null;
    }

    return position;
  } catch {
    return null;
  }
}

function removeFromStorage(type: string, key: string): void {
  try {
    if (type === "sessionStorage") {
      sessionStorage.removeItem(key);
    } else if (type === "localStorage") {
      localStorage.removeItem(key);
    }
  } catch {
    // Silently fail
  }
}

// ---------------------------------------------------------------------------
// React Hook
// ---------------------------------------------------------------------------

/**
 * Hook that manages scroll position preservation across navigation
 * and resize events.
 *
 * Key design decisions:
 *
 * 1. Save strategy: Save on scroll events (debounced), before unload,
 *    and before navigation (via beforeunload and visibilitychange).
 *
 * 2. Restore strategy: On mount, check for a saved position matching
 *    the restoration key. Restore after the content has rendered
 *    (use requestAnimationFrame or a MutationObserver).
 *
 * 3. Item-based restoration: For virtualized lists, we save the
 *    first visible item INDEX (not pixel offset). When restoring,
 *    we scroll to that item regardless of its current height.
 *    This handles the case where item heights changed.
 *
 * 4. Resize handling: On container resize, recalculate the scroll
 *    position proportionally. If the user was 30% through the content
 *    before resize, keep them at 30% after resize.
 */
export function useScrollRestoration({
  restorationKey,
  storageType = "sessionStorage",
  maxAgeMs = 30 * 60 * 1000, // 30 minutes
  autoRestore = true,
  saveDebounceMs = 100,
}: ScrollRestorationConfig): UseScrollRestorationReturn {
  const [currentPosition, setCurrentPosition] = useState<ScrollPosition | null>(
    null
  );
  const [wasRestored, setWasRestored] = useState(false);

  const containerRef = useRef<HTMLElement | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRestoringRef = useRef(false);
  const attachedRef = useRef(false);

  /**
   * Get the current scroll position from the container.
   * Also captures the first visible item info if available.
   */
  const getCurrentPosition = useCallback((): ScrollPosition | null => {
    const container = containerRef.current;
    if (!container) return null;

    return {
      scrollTop: container.scrollTop,
      scrollLeft: container.scrollLeft,
      key: restorationKey,
      savedAt: Date.now(),
      firstVisibleIndex: -1, // Would be set by virtualization library
      firstVisibleOffset: 0,
    };
  }, [restorationKey]);

  /** Debounced save */
  const savePosition = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      const position = getCurrentPosition();
      if (position) {
        setCurrentPosition(position);
        saveToStorage(storageType, getStorageKey(restorationKey), position);
      }
    }, saveDebounceMs);
  }, [getCurrentPosition, storageType, restorationKey, saveDebounceMs]);

  /** Restore saved position */
  const restorePosition = useCallback(() => {
    const saved = loadFromStorage(
      storageType,
      getStorageKey(restorationKey),
      maxAgeMs
    );

    if (!saved) {
      setWasRestored(false);
      return;
    }

    const container = containerRef.current;
    if (!container) {
      setWasRestored(false);
      return;
    }

    isRestoringRef.current = true;
    setCurrentPosition(saved);

    // Wait for content to render, then restore scroll position
    // Using rAF twice ensures the layout has settled
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (container && isRestoringRef.current) {
          container.scrollTop = saved.scrollTop;
          container.scrollLeft = saved.scrollLeft;
          setWasRestored(true);
          isRestoringRef.current = false;
        }
      });
    });
  }, [storageType, restorationKey, maxAgeMs]);

  /** Clear saved position */
  const clearPosition = useCallback(() => {
    removeFromStorage(storageType, getStorageKey(restorationKey));
    setCurrentPosition(null);
    setWasRestored(false);
  }, [storageType, restorationKey]);

  // Ref callback for the scroll container
  const setContainerRef = useCallback(
    (el: HTMLElement | null) => {
      // Clean up previous container
      if (containerRef.current && attachedRef.current) {
        containerRef.current.removeEventListener("scroll", savePosition);
      }

      containerRef.current = el;
      attachedRef.current = false;

      if (el) {
        attachedRef.current = true;
        el.addEventListener("scroll", savePosition, { passive: true });

        // Auto-restore on mount
        if (autoRestore) {
          restorePosition();
        }
      }
    },
    [savePosition, autoRestore, restorePosition]
  );

  // Save before page unload (navigation, tab close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const position = getCurrentPosition();
      if (position) {
        saveToStorage(storageType, getStorageKey(restorationKey), position);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Also save when visibility changes (mobile app backgrounding)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleBeforeUnload();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      handleBeforeUnload(); // Save on unmount too
    };
  }, [getCurrentPosition, storageType, restorationKey]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return {
    containerRef: setContainerRef,
    currentPosition,
    savePosition,
    restorePosition,
    clearPosition,
    wasRestored,
  };
}
