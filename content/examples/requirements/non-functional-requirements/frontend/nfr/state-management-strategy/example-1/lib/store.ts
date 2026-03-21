"use client";

import { useSyncExternalStore } from "react";

type State = {
  compact: boolean; // persisted preference
  sidebarOpen: boolean; // persisted preference
};

const KEY = "state.pref.v1";

function load(): State {
  if (typeof window === "undefined") return { compact: false, sidebarOpen: true };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { compact: false, sidebarOpen: true };
    const v = JSON.parse(raw) as Partial<State>;
    return { compact: !!v.compact, sidebarOpen: v.sidebarOpen !== false };
  } catch {
    return { compact: false, sidebarOpen: true };
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist(next: State) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  persist(state);
  emit();
}

export function usePref<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => selector(state),
    () => selector({ compact: false, sidebarOpen: true }),
  );
}

