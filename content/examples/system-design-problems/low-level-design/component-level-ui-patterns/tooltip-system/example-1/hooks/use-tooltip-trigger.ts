// useTooltipTrigger Hook — Mouse, focus, touch event handlers with delay management

import { useRef, useCallback, useEffect } from "react";
import { useTooltipStore } from "../lib/tooltip-store";
import { getDelayManager } from "../lib/tooltip-store";
import type { TooltipConfig, TooltipContentData } from "../lib/tooltip-types";
import { DEFAULT_TOOLTIP_CONFIG } from "../lib/tooltip-types";

interface UseTooltipTriggerOptions {
  id: string;
  content: TooltipContentData;
  config?: Partial<TooltipConfig>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TOUCH_LONG_PRESS_DURATION = 500;

export function useTooltipTrigger({
  id,
  content,
  config = {},
  open,
  onOpenChange,
}: UseTooltipTriggerOptions) {
  const store = useTooltipStore();
  const delayManager = getDelayManager();
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const mergedConfig = { ...DEFAULT_TOOLTIP_CONFIG, ...config };
  const isControlled = open !== undefined && onOpenChange !== undefined;

  const handleShow = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      store.showTooltip(id, content, config, triggerRef.current);
    }
  }, [isControlled, onOpenChange, store, id, content, config]);

  const handleHide = useCallback(() => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      store.hideTooltip();
    }
  }, [isControlled, onOpenChange, store]);

  const handleMouseEnter = useCallback(() => {
    // Cancel any pending hide for this trigger
    delayManager.clearHide(id);
    handleShow();
  }, [delayManager, id, handleShow]);

  const handleMouseLeave = useCallback(() => {
    // Cancel any pending show for this trigger
    delayManager.clearShow(id);
    handleHide();
  }, [delayManager, id, handleHide]);

  const handleFocus = useCallback(() => {
    handleShow();
  }, [handleShow]);

  const handleBlur = useCallback(() => {
    delayManager.clearShow(id);
    handleHide();
  }, [delayManager, id, handleHide]);

  const handleTouchStart = useCallback(() => {
    touchTimerRef.current = setTimeout(() => {
      handleShow();
    }, TOUCH_LONG_PRESS_DURATION);
  }, [handleShow]);

  const handleTouchEnd = useCallback(() => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    // Hide after a short delay to allow the user to see the tooltip
    setTimeout(() => {
      handleHide();
    }, 1500);
  }, [handleHide]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      delayManager.clearAll(id);
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
    };
  }, [delayManager, id]);

  return {
    triggerRef,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
    isControlled,
  };
}
