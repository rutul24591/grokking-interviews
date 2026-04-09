import { create } from 'zustand';
import { eventBus } from '../lib/event-bus';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatar: string | null;
  bio: string;
  timezone: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  language: string;
}

interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  clearProfile: () => void;
}

/**
 * UserStore manages user profile and preferences.
 * This store is owned by the User team. Other stores cannot import this directly.
 * Cross-store communication happens through the event bus.
 */
export const useUserStore = create<UserState & UserActions>((set, get) => ({
  // Initial state
  profile: null,
  preferences: {
    theme: 'light',
    emailNotifications: true,
    language: 'en',
  },
  isLoading: false,
  error: null,

  // Actions
  fetchProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      set({ profile: data.profile, preferences: data.preferences, isLoading: false });
      eventBus.emit('user:ready', { userId });
    } catch (err) {
      set({ error: 'Failed to fetch user profile', isLoading: false });
    }
  },

  updateProfile: async (updates) => {
    const currentProfile = get().profile;
    if (!currentProfile) return;

    // Optimistic update
    set({ profile: { ...currentProfile, ...updates } });

    try {
      const response = await fetch(`/api/users/${currentProfile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();

      // Confirm with server data
      set({ profile: data.profile });

      // Notify other stores
      eventBus.emit('user:updated', {
        userId: currentProfile.id,
        displayName: data.profile.displayName,
        avatar: data.profile.avatar,
      });
    } catch {
      // Rollback on failure
      set({ profile: currentProfile });
    }
  },

  updatePreferences: (updates) => {
    set((state) => ({
      preferences: { ...state.preferences, ...updates },
    }));

    eventBus.emit('user:preferencesUpdated', updates);
  },

  clearProfile: () => {
    set({
      profile: null,
      isLoading: false,
      error: null,
    });
  },
}));

// Selector hooks
export const useUserProfile = () => useUserStore((state) => state.profile);
export const useUserDisplayName = () =>
  useUserStore((state) => state.profile?.displayName ?? '');
export const useUserPreferences = () => useUserStore((state) => state.preferences);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
