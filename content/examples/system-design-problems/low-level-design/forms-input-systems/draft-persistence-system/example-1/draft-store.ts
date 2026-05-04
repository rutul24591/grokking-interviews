import { createStore } from "zustand/vanilla";
import type { DraftEnvelope } from "./storage-adapter";
import { loadDraft, saveDraft } from "./storage-adapter";

export type DraftState<TValues> = {
  values: TValues;
  dirty: Set<string>;
  version: number;
  revision: number;
  lastSavedAt: number | null;
};

export type DraftActions<TValues> = {
  setValue: (field: keyof TValues & string, value: unknown) => void;
  markClean: () => void;
  hydrate: () => void;
  persist: (ttlMs: number) => void;
};

export function createDraftStore<TValues extends Record<string, unknown>>(args: {
  key: string;
  version: number;
  initialValues: TValues;
}) {
  const { key, version, initialValues } = args;

  return createStore<DraftState<TValues> & DraftActions<TValues>>((set, get) => ({
    values: initialValues,
    dirty: new Set(),
    version,
    revision: 0,
    lastSavedAt: null,

    setValue(field, value) {
      set((s) => {
        const dirty = new Set(s.dirty);
        dirty.add(field);
        return { values: { ...s.values, [field]: value } as TValues, dirty };
      });
    },

    markClean() {
      set({ dirty: new Set() });
    },

    hydrate() {
      const loaded = loadDraft<TValues>(key, version);
      if (!loaded) return;
      set({
        values: loaded.value,
        revision: loaded.revision,
        lastSavedAt: loaded.updatedAt,
      });
    },

    persist(ttlMs) {
      const now = Date.now();
      const env: DraftEnvelope<TValues> = {
        version,
        revision: get().revision + 1,
        updatedAt: now,
        expiresAt: now + ttlMs,
        value: get().values,
      };
      saveDraft(key, env);
      set({ revision: env.revision, lastSavedAt: now });
    },
  }));
}

