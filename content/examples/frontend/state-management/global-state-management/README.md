# Global State Management Examples

## Example 1: Zustand Store

```javascript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        login: async (credentials) => {
          const { user, token } = await api.login(credentials);
          set({ user, token, isAuthenticated: true }, false, 'auth/login');
        },

        logout: () => {
          set({ user: null, token: null, isAuthenticated: false }, false, 'auth/logout');
        },

        updateProfile: (updates) => {
          const user = get().user;
          set({ user: { ...user, ...updates } }, false, 'auth/updateProfile');
        },
      }),
      { name: 'auth-storage' }
    )
  )
);

// Usage with selector (only re-renders when user changes)
function UserMenu() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  return <Menu user={user} onLogout={logout} />;
}
```

## Example 2: Redux Toolkit Slice

```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
  },
});

const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

export const { addItem, removeItem } = cartSlice.actions;
```

## Example 3: Jotai Atoms

```javascript
import { atom, useAtom } from 'jotai';

// Primitive atoms
const darkModeAtom = atom(false);
const fontSizeAtom = atom(16);

// Derived atom
const themeAtom = atom((get) => ({
  isDark: get(darkModeAtom),
  fontSize: get(fontSizeAtom),
  backgroundColor: get(darkModeAtom) ? '#1a1a1a' : '#ffffff',
  textColor: get(darkModeAtom) ? '#ffffff' : '#1a1a1a',
}));

// Async atom
const userAtom = atom(async () => {
  const response = await fetch('/api/user');
  return response.json();
});

function ThemeToggle() {
  const [isDark, setDark] = useAtom(darkModeAtom);
  return <Switch checked={isDark} onChange={setDark} />;
}
```

## Example 4: Context API (and its limitations)

```javascript
import { createContext, useContext, useState, useMemo } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Memoize to prevent unnecessary re-renders
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Problem: ALL consumers re-render when ANY part of context value changes
// Solution: Split contexts or use a proper state management library
```
