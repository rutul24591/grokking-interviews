// Tooltip Zustand Store — Singleton enforcement, show/hide with delay queue

import { create } from "zustand";
import type {
  TooltipStoreState,
  TooltipState,
  TooltipConfig,
  TooltipContentData,
  TooltipPlacement,
} from "./tooltip-types";
import { DEFAULT_TOOLTIP_CONFIG } from "./tooltip-types";
import { DelayManager } from "./tooltip-delay-manager";

const delayManager = new DelayManager();

interface TooltipStoreActions {
  showTooltip: (
    id: string,
    content: TooltipContentData,
    config?: Partial<TooltipConfig>,
    triggerElement?: HTMLElement | null
  ) => void;
  hideTooltip: () => void;
  forceHide: () => void;
  updatePosition: (position: TooltipState["computedPosition"]) => void;
  setTriggerRect: (rect: DOMRect) => void;
  clearPending: () => void;
  _scheduleShow: (
    id: string,
    content: TooltipContentData,
    config: TooltipConfig,
    triggerElement?: HTMLElement | null
  ) => void;
  _scheduleHide: () => void;
}

export const useTooltipStore = create<TooltipStoreState & TooltipStoreActions>(
  (set, get) => ({
    activeTooltip: null,
    isVisible: false,
    pendingShow: null,

    showTooltip: (id, content, config = {}, triggerElement) => {
      const mergedConfig = { ...DEFAULT_TOOLTIP_CONFIG, ...config };
      if (mergedConfig.disabled) return;

      // Cancel any pending show for a different tooltip (singleton)
      const current = get().activeTooltip;
      if (current && current.id !== id) {
        delayManager.clearAll(id);
      }

      set({ pendingShow: id });
      delayManager.scheduleShow(
        id,
        mergedConfig.showDelay,
        () => {
          const triggerRect = triggerElement
            ? triggerElement.getBoundingClientRect()
            : null;

          set({
            activeTooltip: {
              id,
              triggerRect,
              content,
              config: mergedConfig,
              computedPosition: null,
            },
            isVisible: false,
            pendingShow: null,
          });
        },
        () => {
          // onCancel — clear pending state
          set({ pendingShow: null });
        }
      );
    },

    hideTooltip: () => {
      const active = get().activeTooltip;
      if (!active) return;

      delayManager.clearHide(active.id);
      delayManager.scheduleHide(
        active.id,
        active.config.hideDelay,
        () => {
          set({
            activeTooltip: null,
            isVisible: false,
            pendingShow: null,
          });
        }
      );
    },

    forceHide: () => {
      delayManager.clearAll();
      set({
        activeTooltip: null,
        isVisible: false,
        pendingShow: null,
      });
    },

    updatePosition: (position) => {
      set((state) => ({
        activeTooltip: state.activeTooltip
          ? { ...state.activeTooltip, computedPosition: position }
          : null,
        isVisible: true,
      }));
    },

    setTriggerRect: (rect) => {
      set((state) => ({
        activeTooltip: state.activeTooltip
          ? { ...state.activeTooltip, triggerRect: rect }
          : null,
      }));
    },

    clearPending: () => {
      delayManager.clearAll();
      set({ pendingShow: null });
    },

    _scheduleShow: (id, content, config, triggerElement) => {
      get().showTooltip(id, content, config, triggerElement);
    },

    _scheduleHide: () => {
      get().hideTooltip();
    },
  })
);

export function getDelayManager() {
  return delayManager;
}
