import { create } from 'zustand';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
}

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ja';

export interface FeatureFlags {
  [key: string]: boolean;
}

interface CoreState {
  user: AuthUser | null;
  locale: Locale;
  featureFlags: FeatureFlags;
  appVersion: string;
  isInitialized: boolean;
}

interface CoreActions {
  setUser: (user: AuthUser) => void;
  logout: () => void;
  setLocale: (locale: Locale) => void;
  setFeatureFlag: (key: string, value: boolean) => void;
  initialize: () => Promise<void>;
}

/**
 * CoreStore holds shared kernel state that all domain stores can read.
 * This is the ONLY store that other stores are allowed to import directly.
 * Domain stores use selectors to read from CoreStore but cannot mutate it.
 */
export const useCoreStore = create<CoreState & CoreActions>((set) => ({
  // Initial state
  user: null,
  locale: 'en',
  featureFlags: {},
  appVersion: '1.0.0',
  isInitialized: false,

  // Actions
  setUser: (user) => set({ user }),

  logout: () => set({ user: null }),

  setLocale: (locale) => set({ locale }),

  setFeatureFlag: (key, value) =>
    set((state) => ({
      featureFlags: { ...state.featureFlags, [key]: value },
    })),

  initialize: async () => {
    // Simulate fetching auth state, locale, and feature flags from server
    try {
      const [userResponse, flagsResponse] = await Promise.all([
        fetch('/api/auth/me').then((res) => res.json()),
        fetch('/api/flags').then((res) => res.json()),
      ]);

      set({
        user: userResponse.user,
        locale: userResponse.locale || 'en',
        featureFlags: flagsResponse.flags,
        isInitialized: true,
      });
    } catch {
      // On failure, keep defaults and retry on next mount
      set({ isInitialized: false });
    }
  },
}));

// Selector hooks for common core state slices
export const useAuthUser = () => useCoreStore((state) => state.user);
export const useUserId = () => useCoreStore((state) => state.user?.id ?? null);
export const useUserRole = () => useCoreStore((state) => state.user?.role ?? 'viewer');
export const useLocale = () => useCoreStore((state) => state.locale);
export const useFeatureFlag = (key: string) =>
  useCoreStore((state) => state.featureFlags[key] ?? false);
export const useIsInitialized = () => useCoreStore((state) => state.isInitialized);
