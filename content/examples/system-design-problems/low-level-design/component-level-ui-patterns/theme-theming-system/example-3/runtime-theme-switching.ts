/**
 * Theme System — Staff-Level Multi-Theme Runtime Switching.
 *
 * Staff differentiator: Runtime theme switching without page reload,
 * smooth CSS variable transitions, and theme persistence with per-user
 * preference storage.
 */

/**
 * Manages runtime theme switching with smooth CSS transitions.
 * Applies theme CSS variables to the document root with transition support.
 */
export class RuntimeThemeManager {
  private currentTheme: string = 'light';
  private transitionDuration: string = '200ms';
  private listeners: Set<(theme: string) => void> = new Set();

  /**
   * Switches to a new theme with smooth CSS transitions.
   */
  switchTheme(themeName: string, variables: Record<string, string>): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Add transition class
    root.classList.add('theme-transitioning');

    // Apply new CSS variables
    for (const [name, value] of Object.entries(variables)) {
      root.style.setProperty(name, value);
    }

    // Update data attribute for CSS selectors
    root.setAttribute('data-theme', themeName);
    this.currentTheme = themeName;

    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, parseInt(this.transitionDuration, 10));

    // Persist preference
    try {
      localStorage.setItem('user-theme', themeName);
    } catch {
      // Storage unavailable
    }

    // Notify listeners
    for (const listener of this.listeners) {
      listener(themeName);
    }
  }

  /**
   * Restores the user's saved theme preference.
   */
  restoreSavedTheme(defaultTheme: string = 'light'): string {
    try {
      const saved = localStorage.getItem('user-theme');
      return saved || defaultTheme;
    } catch {
      return defaultTheme;
    }
  }

  /**
   * Subscribes to theme changes.
   */
  onChange(listener: (theme: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }
}
