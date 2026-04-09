'use client';
import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
}

interface ThemeActions {
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Split Context into read and write to prevent unnecessary re-renders
const ThemeReadContext = createContext<ThemeState | null>(null);
const ThemeWriteContext = createContext<ThemeActions | null>(null);

/**
 * ThemeProvider wraps the application and provides theme state.
 * Uses split read/write contexts so components that only read
 * the theme don't re-render when the theme changes through actions.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  // Memoize context values to prevent unnecessary re-renders
  const readValue = useMemo(() => ({ theme }), [theme]);
  const writeValue = useMemo(() => ({ toggleTheme, setTheme }), [toggleTheme, setTheme]);

  return (
    <ThemeReadContext.Provider value={readValue}>
      <ThemeWriteContext.Provider value={writeValue}>
        <div className={theme === 'dark' ? 'dark' : ''}>
          {children}
        </div>
      </ThemeWriteContext.Provider>
    </ThemeReadContext.Provider>
  );
}

/**
 * Hook to read the current theme.
 * Components using this hook will only re-render when the theme value changes.
 */
export function useTheme(): ThemeState {
  const context = useContext(ThemeReadContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to access theme actions.
 * Components using this hook will not re-render when theme value changes,
 * only when the action functions change (which they never do due to useCallback).
 */
export function useThemeActions(): ThemeActions {
  const context = useContext(ThemeWriteContext);
  if (!context) {
    throw new Error('useThemeActions must be used within a ThemeProvider');
  }
  return context;
}
