import { create } from 'zustand';
import type { SplitPaneState } from './split-pane-types';

type SplitPaneActions = {
  setDividerPosition: (pos: number) => void;
  setIsDragging: (dragging: boolean) => void;
  toggleCollapse: () => void;
  restore: () => void;
  setContainerSize: (size: number) => void;
  reset: () => void;
};

export const createSplitPaneStore = (defaults: { initialPosition: number; containerSize: number }) =>
  create<SplitPaneState & SplitPaneActions>((set) => ({
    dividerPosition: defaults.initialPosition,
    isDragging: false,
    isCollapsed: false,
    previousPosition: defaults.initialPosition,
    containerSize: defaults.containerSize,
    setDividerPosition: (pos) => set({ dividerPosition: pos }),
    setIsDragging: (dragging) => set({ isDragging: dragging }),
    toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed, previousPosition: s.isCollapsed ? s.previousPosition : s.dividerPosition })),
    restore: () => set((s) => ({ dividerPosition: s.previousPosition, isCollapsed: false })),
    setContainerSize: (size) => set({ containerSize: size }),
    reset: () => set({ dividerPosition: defaults.initialPosition, isCollapsed: false, previousPosition: defaults.initialPosition }),
  }));
