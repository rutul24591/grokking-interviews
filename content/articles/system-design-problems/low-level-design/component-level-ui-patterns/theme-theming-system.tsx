"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-theme-theming-system",
  title: "Design a Theme / Theming System",
  description:
    "Complete LLD solution for a production-grade theming system with light/dark mode, custom palettes, CSS custom properties, SSR-safe injection, nested theme scoping, and WCAG accessibility compliance.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "theme-theming-system",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "theming",
    "dark-mode",
    "css-variables",
    "design-tokens",
    "ssr",
    "accessibility",
    "zustand",
  ],
  relatedTopics: [
    "component-libraries-and-design-systems",
    "design-token-architecture",
    "client-side-rendering",
    "server-side-rendering",
  ],
};

export default function ThemeThemingSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable theme/theming system for a large-scale React
          application. The system must support multiple visual themes (light mode,
          dark mode, custom brand palettes), apply them consistently across every
          component in the application, and switch between themes without a flash of
          unstyled or incorrectly-themed content (FOUC). The system must persist the
          user&apos;s theme preference across sessions, respect the operating system&apos;s
          color scheme preference when no manual selection exists, and support nested
          or scoped themes where a subsection of a page renders with a different theme
          than the rest of the document.
        </p>
        <p>
          The system should be built on CSS custom properties (CSS variables) for
          runtime theming, integrated with the Tailwind CSS utility framework so that
          utility classes resolve to theme-aware values, and enforce accessibility
          constraints such as minimum contrast ratios (WCAG AA/AAA). Every design
          decision — color palette, typography scale, spacing units, shadow tokens,
          border radii — must be expressed as a design token that can be swapped
          atomically when the theme changes.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a Next.js 16 website using React 19+, Tailwind CSS 4,
            and Zustand 5+ for state management.
          </li>
          <li>
            Users can select light mode, dark mode, or defer to their system preference
            (<code>prefers-color-scheme</code>).
          </li>
          <li>
            Organizations may define custom brand themes that override the default
            light/dark palettes with specific colors, fonts, and token values.
          </li>
          <li>
            The application server-renders pages (SSR/SSG), so theme application must
            happen before the first paint to avoid FOUC.
          </li>
          <li>
            Theme switching should feel instant — either an immediate CSS variable swap
            or a short CSS transition on color/background properties.
          </li>
          <li>
            Nested themes are supported: a dark-themed code preview embedded within a
            light-themed article page, for example.
          </li>
          <li>
            The system must pass WCAG 2.1 AA contrast requirements (4.5:1 for normal
            text, 3:1 for large text) for all theme-token color combinations.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Design Tokens:</strong> The system defines a comprehensive set of
            design tokens — color palette, typography scale, spacing units, shadows,
            and border radii — organized by semantic role (e.g., <code>--color-primary</code>,
            <code>--bg-surface</code>, <code>--text-muted</code>).
          </li>
          <li>
            <strong>Light/Dark Mode:</strong> Two built-in themes (light and dark) with
            complete token definitions for each.
          </li>
          <li>
            <strong>System Preference Detection:</strong> On first visit (no stored
            preference), the system reads <code>window.matchMedia(&quot;(prefers-color-scheme: dark)&quot;)</code>
            and applies the matching theme. A listener updates the theme in real time
            if the OS preference changes.
          </li>
          <li>
            <strong>Manual Toggle:</strong> Users can explicitly select light, dark, or
            system mode via a toggle component. The selection persists in
            <code>localStorage</code>.
          </li>
          <li>
            <strong>Custom Themes:</strong> Organizations can register additional themes
            with their own token overrides (brand colors, custom fonts, adjusted spacing).
          </li>
          <li>
            <strong>SSR Theming:</strong> An inline <code>&lt;script&gt;</code> injected
            into <code>&lt;head&gt;</code> reads the stored theme and sets
            <code>data-theme</code> on <code>&lt;html&gt;</code> before the first paint,
            preventing FOUC.
          </li>
          <li>
            <strong>Theme Scoping:</strong> A scoped theme component wraps a subtree
            and applies a different theme locally via a nested <code>data-theme</code>
            attribute and CSS variable re-definition.
          </li>
          <li>
            <strong>Contrast Checking:</strong> A utility validates that any foreground/
            background token pair meets WCAG AA or AAA contrast ratios.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for theme configuration
            shapes (<code>ThemeConfig</code>, <code>ColorPalette</code>,
            <code>TypographyScale</code>, <code>ThemeToken</code>).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Theme switching must not cause layout thrashing
            or visible jank. CSS variable updates are batched by the browser and trigger
            only repaint (not reflow) when color/background properties change.
          </li>
          <li>
            <strong>Scalability:</strong> The token system should support 100+ tokens
            without impacting render performance. CSS variable lookups are O(1) at
            runtime.
          </li>
          <li>
            <strong>Reliability:</strong> The theme persists across sessions and route
            navigations. If <code>localStorage</code> is unavailable (private browsing),
            the system gracefully falls back to system preference detection on each load.
          </li>
          <li>
            <strong>Accessibility:</strong> All token color combinations must meet
            WCAG 2.1 AA minimum contrast. A high-contrast mode variant is available
            for users who require it.
          </li>
          <li>
            <strong>Maintainability:</strong> Adding a new theme or modifying an existing
            one requires changing only token definitions — no component-level code
            changes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            FOUC (flash of unstyled content): the browser paints before the theme script
            runs, showing the wrong theme for a fraction of a second.
          </li>
          <li>
            System preference changes while the page is open — should the application
            auto-switch or respect the user&apos;s manual override?
          </li>
          <li>
            Nested themes: a dark-themed component inside a light page must not leak
            CSS variables into sibling components.
          </li>
          <li>
            Custom brand themes that only override a subset of tokens — the system must
            fall back to default theme values for undefined tokens.
          </li>
          <li>
            SSR: the server does not know the user&apos;s theme preference (no
            <code>localStorage</code> on server). The server must render a neutral
            or default theme, and the client script corrects it before paint.
          </li>
          <li>
            Private/incognito browsing where <code>localStorage</code> may throw on
            access. The system must handle this gracefully.
          </li>
          <li>
            Animated theme transitions: CSS transitions on all color properties can
            cause a brief flicker during initial load. Transitions should be disabled
            on first paint and enabled only after the theme is applied.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate <strong>theme definition</strong> (design tokens
          expressed as CSS custom properties), <strong>theme state management</strong>
          (which theme is active, persisted in localStorage, synchronized with system
          preference), and <strong>theme application</strong> (injecting CSS variables
          onto the <code>&lt;html&gt;</code> element so that all components inherit
          them). CSS custom properties are the ideal mechanism because they cascade,
          can be redefined at any scope (enabling nested themes), and update at runtime
          without re-rendering React components.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>CSS-in-JS runtime injection (styled-components, Emotion):</strong>
            Generates CSS at runtime via JavaScript. Flexible but adds a runtime bundle
            (~10-15 KB gzipped), requires hydration matching, and can cause a flash if
            the style tag injects after first paint. CSS variables have zero runtime
            cost and are natively supported in all modern browsers.
          </li>
          <li>
            <strong>Static CSS class swapping (e.g., <code>.light</code> / <code>.dark</code>
            classes on body):</strong> Simple but requires defining every token value
            under each class selector. Does not support runtime customization or nested
            themes without complex selector specificity management. CSS variables on
            <code>data-theme</code> attribute selectors are cleaner and more composable.
          </li>
          <li>
            <strong>Tailwind dark mode with <code>class</code> strategy:</strong>
            Tailwind&apos;s built-in dark mode toggles a class on the root element and
            uses <code>dark:</code> prefix variants. This works for light/dark but does
            not support custom multi-theme palettes or nested themes out of the box.
            Our approach maps Tailwind utilities to CSS variables, giving us the best
            of both worlds.
          </li>
        </ul>
        <p>
          <strong>Why CSS Variables + Zustand + inline script is optimal:</strong>
          CSS variables provide the runtime theming layer with native browser support
          and zero JavaScript cost. Zustand manages the theme selection state,
          persistence, and system preference listener with minimal boilerplate. An
          inline <code>&lt;script&gt;</code> in <code>&lt;head&gt;</code> applies the
          theme before the browser paints, eliminating FOUC entirely. This pattern is
          used by production systems like Next.js docs, Vercel dashboard, and Linear.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Theme Types &amp; Interfaces (<code>theme-types.ts</code>)</h4>
          <p>
            Defines the core TypeScript interfaces: <code>ThemeId</code> (union of
            &quot;light&quot; | &quot;dark&quot; | string), <code>ColorToken</code>
            (hex or CSS variable reference), <code>ColorPalette</code> (map of semantic
            color roles to <code>ColorToken</code> values), <code>TypographyScale</code>
            (font family, size, line height, weight definitions), <code>ThemeToken</code>
            (generic token with name, value, and category), and <code>ThemeConfig</code>
            (complete theme definition combining palette, typography, spacing, shadows,
            and border radii). See the Example tab for the complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Design Tokens (<code>design-tokens.ts</code>)</h4>
          <p>
            Exports the concrete token definitions for the light and dark themes. Each
            theme is a <code>ThemeConfig</code> object with semantic color roles
            (<code>bg-primary</code>, <code>bg-surface</code>, <code>text-primary</code>,
            <code>text-muted</code>, <code>border-default</code>, <code>color-primary</code>,
            etc.), typography scale (font families for body, heading, and mono), spacing
            scale (4px base unit), shadow definitions, and border radii. Tokens are
            structured so that any new theme can extend or override a subset of values.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. CSS Variable Manager (<code>css-variable-manager.ts</code>)</h4>
          <p>
            Handles dynamic CSS variable injection onto the <code>&lt;html&gt;</code>
            element (or any scoped element). Converts a <code>ThemeConfig</code> into
            a flat map of CSS custom property assignments (e.g.,
            <code>--color-primary: #3b82f6</code>), applies them via
            <code>element.style.setProperty()</code>, and supports contrast checking
            for any foreground/background token pair. Exposes a utility to get the
            computed value of any CSS variable for debugging or runtime validation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Contrast Checker (<code>contrast-checker.ts</code>)</h4>
          <p>
            Implements WCAG 2.1 contrast ratio calculation. Converts hex colors to
            relative luminance using the sRGB-to-linear formula, computes the contrast
            ratio as <code>(L1 + 0.05) / (L2 + 0.05)</code>, and checks against
            AA (4.5:1 for normal text, 3:1 for large text) and AAA (7:1 for normal
            text, 4.5:1 for large text) thresholds. Used during development to validate
            theme token combinations and can be called at runtime to warn about invalid
            custom theme configurations.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Theme Store (<code>theme-store.ts</code>)</h4>
          <p>
            Zustand store that holds the current active theme ID, the user&apos;s
            selection mode (&quot;light&quot; | &quot;dark&quot; | &quot;system&quot;),
            and a registry of available custom themes. Handles persistence to
            <code>localStorage</code> with a try/catch wrapper for private browsing.
            Listens to system preference changes via
            <code>window.matchMedia</code> and updates the resolved theme when the OS
            preference changes (only if the user&apos;s mode is &quot;system&quot;).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Theme Hook (<code>use-theme.ts</code>)</h4>
          <p>
            React hook that consumes the Zustand store and exposes a convenient API:
            <code>theme</code> (resolved theme config object), <code>themeId</code>
            (current theme ID string), <code>mode</code> (light/dark/system),
            <code>setTheme(id)</code> (switch to a specific theme), <code>setMode(mode)</code>
            (change the selection mode), <code>toggle()</code> (cycle between light
            and dark), and <code>isDark</code> (boolean convenience property).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. React Components</h4>
          <p>
            <strong>ThemeProvider</strong> wraps the application tree, subscribes to
            the theme store, and calls the CSS variable manager whenever the theme
            changes. <strong>ThemeToggle</strong> renders a switch control with
            sun/moon icons and a three-state cycle (light, dark, system).
            <strong>ThemeScriptInjector</strong> renders an inline <code>&lt;script&gt;</code>
            into <code>&lt;head&gt;</code> via Next.js <code>&lt;Script&gt;</code> with
            <code>strategy=&quot;beforeInteractive&quot;</code>, which reads
            <code>localStorage</code> and sets <code>data-theme</code> on
            <code>&lt;html&gt;</code> before paint. <strong>ThemeScoped</strong> is a
            wrapper component that applies a local theme to its children by setting
            <code>data-theme</code> and injecting CSS variables on the wrapper element.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Zustand store holds three pieces of state: <code>mode</code> (&quot;light&quot;
          | &quot;dark&quot; | &quot;system&quot;), <code>customThemes</code> (map of
          registered custom theme configs), and <code>resolvedThemeId</code> (the
          currently active theme ID after resolving &quot;system&quot; to either
          &quot;light&quot; or &quot;dark&quot;). On initialization, the store reads
          <code>localStorage</code> for a saved mode. If none exists, it defaults to
          &quot;system&quot;. The resolved theme is computed by checking the mode: if
          &quot;system&quot;, query <code>matchMedia</code>; otherwise, use the mode
          directly. A <code>MediaQueryList</code> listener is attached to auto-update
          when the OS preference changes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            App loads. <code>ThemeScriptInjector</code> runs inline script in
            <code>&lt;head&gt;</code>, reads <code>localStorage</code>, sets
            <code>data-theme</code> on <code>&lt;html&gt;</code> before paint.
          </li>
          <li>
            React hydrates. <code>ThemeProvider</code> mounts, initializes Zustand
            store, applies CSS variables to <code>&lt;html&gt;</code>.
          </li>
          <li>
            User clicks theme toggle. <code>setMode(&quot;dark&quot;)</code> called.
          </li>
          <li>
            Store updates mode, persists to <code>localStorage</code>, computes
            resolved theme.
          </li>
          <li>
            Zustand notifies subscribers. <code>ThemeProvider</code> calls CSS variable
            manager to update <code>&lt;html&gt;</code> styles.
          </li>
          <li>
            Browser repaints with new CSS variable values. Components using
            <code>var(--bg-surface)</code>, <code>var(--text-primary)</code>, etc.
            update automatically without React re-render.
          </li>
          <li>
            If mode is &quot;system&quot; and OS preference changes, the
            <code>matchMedia</code> listener fires, store updates resolved theme,
            CSS variables update.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a clear separation between server-side rendering,
          pre-paint client script, and post-hydration React lifecycle. Each phase has
          specific responsibilities to ensure a seamless theme experience.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Phase 1: Server-Side Render</h3>
        <p>
          The server renders the HTML without knowledge of the user&apos;s theme
          preference (no <code>localStorage</code> or <code>matchMedia</code> on the
          server). The <code>&lt;html&gt;</code> element has no <code>data-theme</code>
          attribute. CSS variables are defined with fallback values in the global
          stylesheet. The <code>ThemeScriptInjector</code> renders an inline
          <code>&lt;script&gt;</code> tag into <code>&lt;head&gt;</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Phase 2: Pre-Paint Script Execution</h3>
        <p>
          Before the browser paints, the inline script executes synchronously. It reads
          <code>localStorage.getItem(&quot;theme-mode&quot;)</code>. If a value exists,
          it resolves &quot;system&quot; via <code>matchMedia</code> and sets
          <code>document.documentElement.setAttribute(&quot;data-theme&quot;, resolvedTheme)</code>.
          If no stored value exists, it detects the system preference and sets the
          attribute. This entire operation takes less than 1ms and guarantees no FOUC.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Phase 3: React Hydration</h3>
        <p>
          React hydrates the application. The <code>ThemeProvider</code> initializes
          the Zustand store, which re-reads <code>localStorage</code> (confirming the
          pre-paint script&aposs work) and applies CSS variables via the CSS variable
          manager. The <code>matchMedia</code> listener is registered for future system
          preference changes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>FOUC prevention:</strong> The inline script runs before paint
            because it is placed in <code>&lt;head&gt;</code> with no <code>defer</code>
            or <code>async</code> attribute. Next.js <code>&lt;Script strategy=&quot;beforeInteractive&quot;</code>
            ensures this. The script is minimal (~15 lines) and executes in under 1ms.
          </li>
          <li>
            <strong>Private browsing:</strong> The <code>localStorage</code> read/write
            is wrapped in a try/catch. If it throws, the system falls back to
            <code>matchMedia</code> detection on every load. The theme still works; it
            simply does not persist.
          </li>
          <li>
            <strong>Animated transitions:</strong> CSS transitions on color properties
            are disabled on the initial paint via a <code>.no-transitions</code> class
            on <code>&lt;html&gt;</code>. After the theme is applied and hydration
            completes, a <code>requestAnimationFrame</code> removes this class, enabling
            transitions for subsequent theme switches. This prevents the flash of
            animated color changes on initial load.
          </li>
          <li>
            <strong>Nested theme scoping:</strong> The <code>ThemeScoped</code> component
            sets <code>data-theme</code> on its own wrapper element (not
            <code>&lt;html&gt;</code>). CSS variables defined within that scope override
            the global ones for all descendant components, while siblings remain
            unaffected. This works because CSS variables cascade down the DOM tree.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 11 files: TypeScript
            interfaces, design token definitions, Zustand store with persistence and
            system preference detection, CSS variable manager with contrast checking,
            WCAG contrast checker utility, React hook, provider component, toggle switch
            with sun/moon icons, FOUC-prevention script injector, scoped theme wrapper,
            and a full EXPLANATION.md walkthrough. Click the <strong>Example</strong>
            toggle at the top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Theme Types (theme-types.ts)</h3>
        <p>
          Defines <code>ThemeId</code> as a union type of built-in theme strings plus
          extensible custom IDs. <code>ColorPalette</code> maps semantic roles
          (&quot;background-primary&quot;, &quot;text-muted&quot;, &quot;border-default&quot;,
          &quot;color-primary&quot;, etc.) to hex color strings. <code>ThemeConfig</code>
          combines the color palette with typography, spacing, shadow, and radius tokens.
          All interfaces are fully generic-friendly for consumers who want to extend the
          token system.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Design Tokens (design-tokens.ts)</h3>
        <p>
          Exports <code>lightTheme</code> and <code>darkTheme</code> as concrete
          <code>ThemeConfig</code> objects. Light theme uses white/off-white backgrounds,
          dark text, blue primary color. Dark theme uses near-black backgrounds, light
          text, adjusted primary color for contrast on dark backgrounds. Both themes
          share the same typography and spacing scales. Tokens are organized as flat
          key-value maps for easy CSS variable conversion.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: CSS Variable Manager (css-variable-manager.ts)</h3>
        <p>
          The <code>applyThemeVariables()</code> function takes a target element and a
          <code>ThemeConfig</code>, iterates over all token categories, and calls
          <code>element.style.setProperty()</code> for each token (e.g.,
          <code>--bg-primary</code>, <code>--text-primary</code>). The
          <code>getComputedTokenValue()</code> utility reads the resolved value from the
          browser for debugging. The <code>checkContrast()</code> function validates any
          two color tokens against a specified WCAG level.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Contrast Checker (contrast-checker.ts)</h3>
        <p>
          Implements the WCAG 2.1 algorithm: parse hex to RGB, apply the sRGB-to-linear
          conversion per channel (<code>C &lt;= 0.03928 ? C / 12.92 : ((C + 0.055) / 1.055) ^ 2.4</code>),
          compute relative luminance (<code>0.2126 * R + 0.7152 * G + 0.0722 * B</code>),
          then calculate contrast ratio. The <code>isAACompliant()</code> and
          <code>isAAACompliant()</code> functions check foreground/background pairs against
          the thresholds for normal and large text.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Theme Store (theme-store.ts)</h3>
        <p>
          Zustand store with <code>mode</code>, <code>resolvedThemeId</code>, and
          <code>customThemes</code> state. On creation, reads from <code>localStorage</code>
          (with try/catch). If mode is &quot;system&quot;, resolves via
          <code>matchMedia</code>. Registers a <code>change</code> listener on the
          <code>MediaQueryList</code> to auto-update. Exposes <code>setMode()</code>,
          <code>setTheme()</code>, <code>registerCustomTheme()</code>, and
          <code>toggle()</code> actions. Persists mode to <code>localStorage</code> on
          every change.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Theme Hook (use-theme.ts)</h3>
        <p>
          Consumes the Zustand store via selectors (preventing unnecessary re-renders).
          Returns <code>theme</code> (the resolved <code>ThemeConfig</code> object),
          <code>themeId</code>, <code>mode</code>, <code>setTheme</code>,
          <code>setMode</code>, <code>toggle</code>, and <code>isDark</code>. The hook
          memoizes the resolved theme config lookup from the token registry so that
          components get the full config object reactively.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Theme Provider (theme-provider.tsx)</h3>
        <p>
          Wraps the application tree. Subscribes to the theme store, calls
          <code>applyThemeVariables()</code> on <code>document.documentElement</code>
          whenever the resolved theme changes. Handles the transition-enabling
          <code>requestAnimationFrame</code> on mount. Accepts an optional
          <code>customThemes</code> prop to register organization-specific themes at
          the app root.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Theme Toggle (theme-toggle.tsx)</h3>
        <p>
          Renders a segmented control or switch with three states: light (sun icon),
          dark (moon icon), and system (monitor icon). Uses inline SVG icons to avoid
          external dependencies. On click, cycles through the three modes. Displays a
          tooltip or label for the current mode. Styled with Tailwind utility classes
          that reference CSS variables for theme-aware colors.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Theme Script Injector (theme-script-injector.tsx)</h3>
        <p>
          Uses Next.js <code>&lt;Script&gt;</code> component with
          <code>strategy=&quot;beforeInteractive&quot;</code> to inject a minified inline
          script into <code>&lt;head&gt;</code>. The script reads
          <code>localStorage.getItem(&quot;theme-mode&quot;)</code>, resolves the theme
          (checking <code>matchMedia</code> for &quot;system&quot;), and sets
          <code>data-theme</code> on <code>&lt;html&gt;</code>. The script is provided
          as a template literal string, not as an external file, to avoid an extra
          network request.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: Theme Scoped (theme-scoped.tsx)</h3>
        <p>
          Accepts a <code>themeId</code> prop and applies that theme locally to its
          children. Creates a wrapper <code>&lt;div&gt;</code> with
          <code>data-theme</code> attribute, injects CSS variables via
          <code>useRef</code> and <code>useEffect</code> (scoped to the wrapper element,
          not <code>&lt;html&gt;</code>). Supports nested scoped themes — each level
          overrides the one above it through CSS variable cascading.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">applyThemeVariables</td>
                <td className="p-2">O(t) — iterate t tokens</td>
                <td className="p-2">O(1) — mutates element styles</td>
              </tr>
              <tr>
                <td className="p-2">Theme switch</td>
                <td className="p-2">O(t) — variable reassignment</td>
                <td className="p-2">O(1) — no new allocations</td>
              </tr>
              <tr>
                <td className="p-2">Contrast check</td>
                <td className="p-2">O(1) — fixed math ops</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">localStorage read/write</td>
                <td className="p-2">O(1) — single key lookup</td>
                <td className="p-2">O(s) — serialized theme string</td>
              </tr>
              <tr>
                <td className="p-2">System preference listener</td>
                <td className="p-2">O(1) — event callback</td>
                <td className="p-2">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>t</code> is the number of design tokens (typically 30-60 for a
          complete theme). CSS variable assignment is a native browser operation and is
          highly optimized. For 50 tokens, <code>applyThemeVariables</code> completes
          in under 2ms.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Large token sets:</strong> If a theme defines 200+ tokens (granular
            color scales, extensive typography), applying all variables on every switch
            adds up. Mitigation: batch variable assignments in a single
            <code>requestAnimationFrame</code> callback to ensure the browser processes
            them in one style recalculation.
          </li>
          <li>
            <strong>CSS transitions on theme switch:</strong> If <code>transition</code>
            is set on <code>*</code> or <code>body</code>, the browser will animate
            every color change, causing a 200-300ms repaint storm. Mitigation: only
            apply transitions to specific elements that should animate (e.g., background
            surfaces), not to text colors or borders.
          </li>
          <li>
            <strong>Zustand re-render cascades:</strong> If the theme provider selects
            the entire store state, every store update re-renders the provider and all
            its children. Mitigation: use Zustand selectors to subscribe only to
            <code>resolvedThemeId</code>, and memoize the theme config lookup.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Pre-paint script:</strong> The inline FOUC-prevention script is ~15
            lines of vanilla JS, executes in under 1ms, and requires no framework
            overhead. This is the single most important optimization for perceived
            performance.
          </li>
          <li>
            <strong>CSS variable cascading:</strong> By defining variables on
            <code>&lt;html&gt;</code>, all components inherit them automatically. No
            component needs to re-apply styles or re-render on theme change. The browser
            handles the repaint natively.
          </li>
          <li>
            <strong>Selector-based Zustand subscriptions:</strong> Components that need
            the theme ID subscribe only to <code>resolvedThemeId</code>. Components that
            only need <code>isDark</code> subscribe to a derived boolean selector. This
            prevents unnecessary re-renders when unrelated store fields change.
          </li>
          <li>
            <strong>Lazy contrast checking:</strong> The contrast checker runs during
            development/build time to validate themes. At runtime, it is only called
            when a custom theme is registered, not on every render. Failed checks produce
            a console warning but do not block rendering.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Inline Script Security</h3>
        <p>
          The FOUC-prevention inline script is a static string injected via Next.js
          <code>&lt;Script&gt;</code> component. It contains no user-generated content
          and does not read from the URL, so it is not an XSS vector. However, if your
          Content Security Policy (CSP) disallows inline scripts (a common hardening
          measure), you must add a nonce or hash to the CSP <code>script-src</code>
          directive for this specific script. Next.js supports CSP nonces via the
          <code>nonce</code> prop on <code>&lt;Script&gt;</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">localStorage Safety</h3>
        <p>
          The theme mode stored in <code>localStorage</code> is a simple string
          (&quot;light&quot;, &quot;dark&quot;, or &quot;system&quot;). It is never
          evaluated as code or inserted into the DOM as HTML, so there is no injection
          risk. The try/catch wrapper handles cases where <code>localStorage</code> is
          blocked by browser settings or unavailable in server-side contexts. Custom
          theme configurations (if persisted) should be validated against the
          <code>ThemeConfig</code> interface before application to prevent malformed
          data from corrupting the theme.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Contrast Compliance</h4>
          <ul className="space-y-2">
            <li>
              All foreground/background token pairs must meet WCAG 2.1 AA minimum
              contrast: 4.5:1 for normal text (below 18pt or 14pt bold), 3:1 for large
              text.
            </li>
            <li>
              AAA compliance (7:1 for normal text, 4.5:1 for large text) is recommended
              for content-heavy applications (documentation sites, reading apps).
            </li>
            <li>
              The contrast checker utility should be run as part of the CI pipeline to
              validate any new theme or token modification before deployment.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">High-Contrast Mode</h4>
          <ul className="space-y-2">
            <li>
              Respect <code>prefers-contrast: more</code> media query by offering a
              high-contrast theme variant that increases token contrast ratios beyond
              AA minimums.
            </li>
            <li>
              The theme toggle should be keyboard accessible and announce its current
              state via <code>aria-pressed</code> or <code>aria-checked</code>.
            </li>
            <li>
              Icon-only toggles must have <code>aria-label</code> attributes describing
              their function (e.g., &quot;Switch to dark mode&quot;).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Reduced Motion</h4>
          <p>
            If CSS transitions are used for theme switching, respect
            <code>prefers-reduced-motion: reduce</code> by disabling transitions for
            users who prefer reduced motion. This can be done via a CSS media query
            override or by checking the media query in JavaScript and skipping the
            transition-enabling <code>requestAnimationFrame</code>.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Custom Theme Validation</h3>
        <ul className="space-y-2">
          <li>
            When registering custom themes from external sources (e.g., user-generated
            brand themes), validate all color values are valid hex codes or CSS color
            functions before applying them.
          </li>
          <li>
            Run the contrast checker on every foreground/background pair in the custom
            theme. Reject or warn about configurations that fail AA compliance.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Contrast checker:</strong> Test known color pairs (white on black =
            21:1, black on white = 21:1, light gray on white = fails AA). Verify AA and
            AAA thresholds for normal and large text.
          </li>
          <li>
            <strong>CSS variable manager:</strong> Test that <code>applyThemeVariables</code>
            sets the correct CSS custom properties on a mock element. Verify that
            <code>getComputedTokenValue</code> returns the expected value.
          </li>
          <li>
            <strong>Theme store:</strong> Test initialization with no stored preference
            (defaults to &quot;system&quot;), with stored &quot;light&quot;/&quot;dark&quot;,
            and with stored &quot;system&quot; (resolves via mocked <code>matchMedia</code>).
            Test <code>setMode</code> persists correctly, test <code>toggle</code> cycles
            between light and dark, test <code>registerCustomTheme</code> adds to registry.
          </li>
          <li>
            <strong>localStorage safety:</strong> Mock <code>localStorage.setItem</code>
            to throw and verify the store handles the error gracefully without crashing.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Theme provider lifecycle:</strong> Render ThemeProvider in a test
            harness, assert that CSS variables are applied to <code>document.documentElement</code>.
            Trigger a mode change, assert variables update.
          </li>
          <li>
            <strong>System preference listener:</strong> Mock <code>matchMedia</code>,
            set mode to &quot;system&quot;, fire the <code>change</code> event on the
            MediaQueryList, assert the resolved theme updates.
          </li>
          <li>
            <strong>Theme toggle:</strong> Render the toggle component, click through
            all three states, assert the displayed icon/label matches the current mode.
            Verify <code>aria-pressed</code> updates.
          </li>
          <li>
            <strong>Scoped themes:</strong> Render a ThemeScoped component inside a
            light-themed parent, assert that the scoped element has its own
            <code>data-theme</code> attribute and CSS variables defined on its inline
            style, not leaking to the parent.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">End-to-End Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>FOUC prevention:</strong> Use Playwright to intercept the page load,
            assert that <code>&lt;html&gt;</code> has the correct <code>data-theme</code>
            attribute before the first paint (using <code>page.evaluate</code> in a
            <code>beforePaint</code> hook).
          </li>
          <li>
            <strong>Theme persistence:</strong> Set theme to dark via the toggle,
            navigate to a different route, reload the page, assert the theme remains dark.
          </li>
          <li>
            <strong>Contrast validation in CI:</strong> Run the contrast checker as a
            Node.js script in the CI pipeline. Fail the build if any built-in theme
            token pair fails AA compliance.
          </li>
          <li>
            <strong>Accessibility audit:</strong> Run axe-core on pages with both light
            and dark themes applied, verify no contrast violations are reported.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Using React state for theme instead of CSS variables:</strong>
            Candidates often store theme colors in React state and pass them via context
            to every component. This causes a full app re-render on every theme switch
            and requires every component to consume the theme context. Interviewers
            expect candidates to recognize CSS variables as the correct runtime theming
            mechanism.
          </li>
          <li>
            <strong>Ignoring FOUC:</strong> Applying the theme in a <code>useEffect</code>
            means the browser paints with the wrong theme first, then corrects it after
            hydration. This is a visible flash that degrades user experience.
            Interviewers look for candidates who know the inline-script-in-head pattern.
          </li>
          <li>
            <strong>Hardcoding color values in components:</strong> Writing
            <code>bg-white dark:bg-gray-900</code> in every component instead of using
            semantic tokens like <code>bg-[var(--bg-surface)]</code>. This makes adding
            a third theme (e.g., a brand theme) require changes to every component.
          </li>
          <li>
            <strong>Not handling system preference changes:</strong> Only checking
            <code>matchMedia</code> on initial load means the app does not respond if
            the user changes their OS theme while the app is open. Interviewers expect
            a <code>MediaQueryList</code> listener.
          </li>
          <li>
            <strong>Forgetting accessibility:</strong> Choosing theme colors that look
            good but fail WCAG contrast checks. This is a critical oversight for
            production systems and a common interview discussion point.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">CSS Variables vs CSS-in-JS</h4>
          <p>
            CSS-in-JS libraries (styled-components, Emotion) generate styles at runtime
            and offer powerful features like dynamic theming via props, automatic vendor
            prefixing, and component-scoped styles. However, they add a runtime bundle
            (~10-15 KB gzipped), require careful hydration matching in SSR, and can
            cause a flash if style injection lags behind paint. CSS variables are native,
            have zero JavaScript cost, cascade naturally (enabling nested themes), and
            update without React re-renders. The trade-off is that CSS variables do not
            support dynamic computation (e.g., &quot;primary color + 10% lighter&quot;)
            without JavaScript helpers. For a theming system, CSS variables are the
            correct default; CSS-in-JS is overkill unless you need runtime style
            computation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Immediate Swap vs Animated Transition</h4>
          <p>
            When the user switches themes, you can either swap CSS variables instantly
            (instant but jarring) or add CSS transitions on color/background properties
            (smooth but risks a flash on initial load if transitions are active before
            the theme is applied). The best approach is to disable transitions on initial
            paint (via a <code>.no-transitions</code> class on <code>&lt;html&gt;</code>),
            apply the theme, then enable transitions after hydration via
            <code>requestAnimationFrame</code>. This gives instant theme application on
            load and smooth transitions on subsequent user-initiated switches.
            Interviewers appreciate candidates who discuss this nuance.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">System Preference Auto vs Manual Override</h4>
          <p>
            Defaulting to the OS preference (<code>prefers-color-scheme</code>) provides
            a good out-of-the-box experience. But once the user manually selects a theme,
            the system should respect that choice even if the OS preference changes. This
            requires distinguishing between the selection mode (&quot;system&quot;) and
            the resolved theme (&quot;light&quot; or &quot;dark&quot;). The mode is what
            the user chose; the resolved theme is what is currently applied. This
            distinction is subtle but important and is a common interview discussion
            point.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support per-page themes (e.g., a marketing page with a
              custom brand theme, while the rest of the app uses the default)?
            </p>
            <p className="mt-2 text-sm">
              A: Use the <code>ThemeScoped</code> component at the page layout level.
              The scoped component sets <code>data-theme</code> and injects CSS variables
              on its wrapper element, overriding the global theme for all descendants.
              The page-level layout wraps its children in <code>&lt;ThemeScoped themeId=&quot;brand-marketing&quot;&gt;</code>.
              Because CSS variables cascade, the custom theme applies only within that
              subtree. The Zustand store remains unchanged — the global theme is still
              active for other pages.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you integrate this with Tailwind CSS 4?
            </p>
            <p className="mt-2 text-sm">
              A: In Tailwind CSS 4, you define CSS variables in your global stylesheet
              and reference them in utility classes using the <code>theme()</code>
              function or by mapping Tailwind&apos;s default keys to your CSS variable
              names. For example, define <code>--color-primary: #3b82f6</code> and
              configure Tailwind to resolve <code>bg-primary</code> to
              <code>var(--color-primary)</code>. This way, <code>className=&quot;bg-primary text-on-primary&quot;</code>
              automatically uses theme-aware colors. Tailwind 4&apos;s CSS-first
              configuration makes this even cleaner — you can define your theme directly
              in CSS without a JavaScript config file.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle a theme with 200+ tokens without performance issues?
            </p>
            <p className="mt-2 text-sm">
              A: Group tokens into categories (colors, typography, spacing, shadows) and
              only apply the category that changed on a theme switch. If switching from
              light to dark, only color tokens change — typography and spacing remain
              the same. The <code>applyThemeVariables</code> function can accept a
              category filter. Additionally, use <code>requestAnimationFrame</code> to
              batch all style mutations into a single browser style recalculation. For
              extremely large token sets, consider a virtualized token registry where
              tokens are loaded on demand rather than applied globally.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test that the FOUC prevention script works correctly?
            </p>
            <p className="mt-2 text-sm">
              A: Use Playwright&apos;s <code>page.addInitScript()</code> to inject a
              mutation observer on <code>&lt;html&gt;</code> that records when
              <code>data-theme</code> is set. Then navigate to the page and assert that
              the attribute was set before the first <code>load</code> event fired.
              Alternatively, take a screenshot at the earliest possible moment and
              visually verify the correct theme colors are present. You can also use
              Chrome DevTools Protocol (CDP) to capture the &quot;first paint&quot;
              timing and compare it against the script execution timing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support user-generated custom themes (e.g., users pick
              their own primary/accent colors)?
            </p>
            <p className="mt-2 text-sm">
              A: Provide a color picker UI that lets users select a primary color.
              Generate a full palette from that color using color math (adjusting
              lightness/darkness for hover, active, and disabled states). Validate the
              generated palette against WCAG contrast ratios for text use cases. Store
              the user&apos;s custom palette in <code>localStorage</code> (or their
              account profile for cross-device sync). Register the custom palette as a
              new theme in the Zustand store&apos;s <code>customThemes</code> map and
              activate it. If contrast fails, fall back to a safer variant of the color
              (e.g., darken the primary for use on light backgrounds).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle concurrent React (React 18+)?
            </p>
            <p className="mt-2 text-sm">
              A: The theme system is largely external to React&apos;s rendering cycle.
              CSS variable updates happen on the DOM element directly, bypassing React
              entirely. The Zustand store uses <code>useSyncExternalStore</code> for
              subscription synchronization, which is designed for concurrent React. The
              ThemeProvider&apos;s effect that applies CSS variables is wrapped in
              <code>useLayoutEffect</code> to ensure variables are set before the browser
              paints. Theme switching is a synchronous DOM operation and does not
              interact with React&apos;s scheduler, so it works correctly with concurrent
              features.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://design-system.service.gov.uk/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GOV.UK Design System — Design Token Architecture Reference
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/WCAG21/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WCAG 2.1 — Web Content Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://css-tricks.com/a-complete-guide-to-custom-properties/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CSS-Tricks — Complete Guide to CSS Custom Properties
            </a>
          </li>
          <li>
            <a
              href="https://nextjs.org/docs/app/api-reference/components/script"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js — Script Component Documentation
            </a>
          </li>
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2022/04/design-tokens-everything-you-need-to-know/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Design Tokens: Everything You Need to Know
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
