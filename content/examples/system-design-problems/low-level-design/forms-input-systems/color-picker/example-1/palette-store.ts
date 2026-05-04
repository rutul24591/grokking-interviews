import { createStore } from "zustand/vanilla";
import type { RGBA } from "./color-math";

export type PaletteState = {
  saved: RGBA[];
  recent: RGBA[];
};

export type PaletteActions = {
  save: (c: RGBA) => void;
  addRecent: (c: RGBA) => void;
};

export function createPaletteStore() {
  return createStore<PaletteState & PaletteActions>((set, get) => ({
    saved: [],
    recent: [],
    save(c) {
      set((s) => ({ saved: [c, ...s.saved].slice(0, 24) }));
    },
    addRecent(c) {
      const key = JSON.stringify(c);
      const next = [c, ...get().recent.filter((x) => JSON.stringify(x) !== key)].slice(0, 12);
      set({ recent: next });
    },
  }));
}

