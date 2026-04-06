import { create } from 'zustand';
import type { ErrorEntry } from './avatar-types';
import { MAX_RETRIES } from './avatar-types';

interface AvatarState {
  errors: Map<string, ErrorEntry>;
  markError: (src: string) => void;
  markLoaded: (src: string) => void;
  requestRetry: (src: string) => boolean;
  getEntry: (src: string) => ErrorEntry | undefined;
  clearCache: () => void;
}

function createEntry(): ErrorEntry {
  return {
    errorCount: 0,
    lastErrorAt: 0,
    cacheStatus: 'pending',
  };
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  errors: new Map(),

  markError: (src) => {
    set((state) => {
      const errors = new Map(state.errors);
      const entry = errors.get(src) || createEntry();
      entry.errorCount += 1;
      entry.lastErrorAt = Date.now();
      entry.cacheStatus = 'error';
      errors.set(src, entry);
      return { errors };
    });
  },

  markLoaded: (src) => {
    set((state) => {
      const errors = new Map(state.errors);
      const entry = errors.get(src) || createEntry();
      entry.cacheStatus = 'loaded';
      errors.set(src, entry);
      return { errors };
    });
  },

  requestRetry: (src) => {
    const entry = get().errors.get(src);

    // If no entry exists or error count is below max, allow retry
    if (!entry || entry.errorCount < MAX_RETRIES) {
      set((state) => {
        const errors = new Map(state.errors);
        const current = errors.get(src) || createEntry();
        current.cacheStatus = 'retrying';
        errors.set(src, current);
        return { errors };
      });
      return true;
    }

    // Max retries reached — block further attempts
    return false;
  },

  getEntry: (src) => {
    return get().errors.get(src);
  },

  clearCache: () => {
    set({ errors: new Map() });
  },
}));
