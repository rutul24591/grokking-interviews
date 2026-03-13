# State Persistence Examples

## Example 1: Zustand Persist Middleware

```javascript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'system',
      fontSize: 16,
      sidebarCollapsed: false,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: 'user-settings',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted, version) => {
        if (version === 0) {
          // v0 → v1: rename darkMode to theme
          persisted.theme = persisted.darkMode ? 'dark' : 'light';
          delete persisted.darkMode;
        }
        if (version < 2) {
          // v1 → v2: add default fontSize
          persisted.fontSize = persisted.fontSize ?? 16;
        }
        return persisted;
      },
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
```

## Example 2: Redux Persist

```javascript
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: ['auth', 'settings'], // Only persist these slices
  blacklist: ['ui'],               // Never persist these
  migrate: createMigrate(migrations, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store);

// In your app
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Splash />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
```

## Example 3: Custom Persistence Hook with Debouncing

```javascript
function usePersistentState(key, defaultValue, options = {}) {
  const { debounceMs = 300, storage = localStorage } = options;

  const [state, setState] = useState(() => {
    try {
      const saved = storage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Debounced persistence
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        storage.setItem(key, JSON.stringify(state));
      } catch (e) {
        if (e.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded');
        }
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [state, key, debounceMs, storage]);

  return [state, setState];
}

// Usage
function DraftEditor() {
  const [draft, setDraft] = usePersistentState('post-draft', '', {
    debounceMs: 1000,
  });

  return <textarea value={draft} onChange={e => setDraft(e.target.value)} />;
}
```

## Example 4: SSR-Safe Persistence

```javascript
import { useEffect, useState } from 'react';

function useHydratedState(key, defaultValue) {
  const [state, setState] = useState(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Only runs on client
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch {}
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [state, hydrated, key]);

  return [state, setState, hydrated];
}
```
