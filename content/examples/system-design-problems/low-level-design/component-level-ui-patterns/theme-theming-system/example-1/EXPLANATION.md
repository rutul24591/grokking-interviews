# Theme / Theming System — Implementation Walkthrough

This directory contains a production-ready implementation of a theme/theming system for a React application using CSS custom properties, Zustand, and Tailwind CSS.

## Architecture Overview

The system is built on three pillars:

1. **CSS Custom Properties** — Design tokens (colors, typography, spacing, shadows, radii) are expressed as CSS variables injected onto DOM elements. This enables runtime theme switching without React re-renders.
2. **Zustand Store** — Manages the user's theme selection mode (light/dark/system), resolves system preference via `matchMedia`, persists to `localStorage`, and notifies subscribers on change.
3. **Inline Pre-Paint Script** — A minimal script injected into `<head>` via Next.js `<Script strategy="beforeInteractive">` reads the stored preference and sets `data-theme` on `<html>` before the first paint, eliminating FOUC.

## File Structure

```
lib/
  theme-types.ts          — TypeScript interfaces for ThemeConfig, ColorPalette, etc.
  design-tokens.ts        — Concrete token definitions for light and dark themes
  theme-store.ts          — Zustand store with persistence and system preference listener
  css-variable-manager.ts — Dynamic CSS variable injection on DOM elements
  contrast-checker.ts     — WCAG 2.1 contrast ratio calculation (AA/AAA)
hooks/
  use-theme.ts            — React hook consuming the store (theme, toggle, setMode, isDark)
components/
  theme-provider.tsx      — App-level provider that applies theme on mount and change
  theme-toggle.tsx        — Three-state toggle button (light/dark/system) with SVG icons
  theme-script-injector.tsx — Next.js Script component for FOUC prevention
  theme-scoped.tsx        — Wrapper for nested/local theme scoping within a subtree
```

## Key Design Decisions

### Why CSS Variables?

CSS custom properties cascade naturally, can be redefined at any DOM scope (enabling nested themes), and update at runtime without triggering React re-renders. The browser handles the repaint natively, making theme switches extremely fast (~2ms for 50 tokens).

### FOUC Prevention

The inline script in `theme-script-injector.tsx` runs synchronously before the browser paints. It reads `localStorage`, resolves the theme (checking `matchMedia` for "system"), and sets `data-theme` on `<html>`. This entire operation takes less than 1ms. Without this script, React hydration would apply the theme in a `useEffect`, causing a visible flash of the wrong theme.

### System Preference vs Manual Override

The store distinguishes between `mode` (what the user chose: "light", "dark", or "system") and `resolvedThemeId` (the actual theme applied: "light" or "dark"). When mode is "system", a `MediaQueryList` listener auto-updates `resolvedThemeId` when the OS preference changes. When the user manually selects a theme, the mode changes to "light" or "dark" and the system listener is ignored until the user switches back to "system".

### Nested Theme Scoping

The `ThemeScoped` component injects CSS variables on its own wrapper element rather than `<html>`. Because CSS variables cascade down the DOM tree, all descendant components inherit the scoped values while siblings remain unaffected. This enables patterns like a dark-themed code preview inside a light-themed article.

### Contrast Validation

The `contrast-checker.ts` utility implements the WCAG 2.1 algorithm: parse hex to RGB, apply sRGB-to-linear conversion, compute relative luminance, then calculate the contrast ratio. The `css-variable-manager.ts` runs contrast checks in development mode for critical token pairs (text-on-background) and logs warnings for failures.

### Transition Management

CSS transitions on color properties are disabled on initial paint via a `.no-transitions` class on `<html>`. After the theme is applied and hydration completes, a `requestAnimationFrame` callback removes this class. This gives instant theme application on load and smooth transitions on subsequent user-initiated switches.

## Usage

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from "./components/theme-provider";
import { ThemeScriptInjector } from "./components/theme-script-injector";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="no-transitions">
      <head>
        <ThemeScriptInjector />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Use the toggle anywhere

```tsx
import { ThemeToggle } from "./components/theme-toggle";

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### 3. Apply scoped themes

```tsx
import { ThemeScoped } from "./components/theme-scoped";

function ArticleWithDarkCodeBlock() {
  return (
    <article>
      <h1>Light-themed article content</h1>
      <ThemeScoped themeId="dark">
        <pre>{/* Dark-themed code block */}</pre>
      </ThemeScoped>
    </article>
  );
}
```

### 4. Consume theme state in components

```tsx
import { useTheme } from "./hooks/use-theme";

function ThemedButton() {
  const { themeId, isDark, toggle } = useTheme();

  return (
    <button onClick={toggle}>
      Current theme: {themeId} ({isDark ? "dark" : "light"})
    </button>
  );
}
```

### 5. Register custom themes

```tsx
import { ThemeProvider } from "./components/theme-provider";

const brandTheme = {
  id: "brand-acme",
  name: "Acme Brand",
  palette: {
    "bg-primary": "#fefefe",
    "bg-surface": "#f5f0eb",
    "text-primary": "#1a1a2e",
    // ... all other color roles
  },
  // ... typography, spacing, shadows, radii
};

function App() {
  return (
    <ThemeProvider customThemes={[brandTheme]}>
      {/* ... */}
    </ThemeProvider>
  );
}
```

## Tailwind CSS Integration

In Tailwind CSS 4, map utility classes to your CSS variables in your global stylesheet:

```css
@theme {
  --color-bg-primary: var(--theme-color-bg-primary);
  --color-bg-surface: var(--theme-color-bg-surface);
  --color-text-primary: var(--theme-color-text-primary);
  --color-text-muted: var(--theme-color-text-muted);
  --color-border-default: var(--theme-color-border-default);
  --color-primary: var(--theme-color-color-primary);
}
```

Then use them as regular Tailwind classes:

```tsx
<div className="bg-bg-primary text-text-primary border-border-default">
  Themed content
</div>
```

## Testing

- **Unit tests**: Test contrast checker with known color pairs, test store initialization with various localStorage states, test CSS variable application on mock elements.
- **Integration tests**: Verify ThemeProvider applies variables on mount, test toggle cycles through modes, test scoped themes do not leak to parents.
- **E2E tests**: Use Playwright to assert `data-theme` is set before first paint, verify theme persistence across navigation, run axe-core for contrast compliance.
