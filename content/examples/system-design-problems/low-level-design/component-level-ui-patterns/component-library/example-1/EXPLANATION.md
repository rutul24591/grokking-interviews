# Component Library — Implementation Walkthrough

This document explains the full implementation of a production-grade component library with design tokens, multi-platform token distribution, theming, accessibility compliance, and developer tooling.

## Architecture Overview

The library is organized into three layers:

1. **Token Layer** (`lib/design-tokens.ts`) — The single source of truth for all visual decisions. Tokens are defined as typed JavaScript objects with name, value, category, description, and optional alias references.

2. **Theme Layer** (`lib/theme-builder.ts`, `lib/token-exporter.ts`, `components/token-provider.tsx`) — Transforms tokens into theme objects, validates accessibility constraints, exports to multiple platforms, and injects CSS variables at runtime.

3. **Component Layer** — React components that consume tokens via CSS variable references (e.g., `var(--color-primary)`) and expose consistent APIs (variant, size, as, className).

## File-by-File Breakdown

### `lib/library-types.ts`

Core TypeScript interfaces used across the entire library:

- **`DesignToken`** — Represents a single design token with name, value, category, description, and optional alias (for token references). Includes deprecation tracking fields.
- **`TokenCategory`** — Union type enumerating all token types: color, typography, spacing, shadow, radius, zIndex.
- **`ThemeDefinition`** — A complete theme mapping every token name to its resolved value, with an array of warnings (e.g., contrast failures).
- **`ThemeOverride`** — A partial map allowing consumers to customize any subset of tokens without specifying the full theme.
- **`ComponentMeta`** — Tracks component name, version, accessibility status, deprecation info, and associated tokens.
- **`A11yViolation`** — Structured report from axe-core with rule ID, impact, selector, description, and remediation.
- **`ComponentPropsWithAs`** — Utility type for polymorphic `as` prop support, preserving element-specific prop types.
- **`PlaygroundControl`** — Defines a prop control in the interactive playground (select, text, number, boolean, color).

### `lib/design-tokens.ts`

Authoritative token definitions organized into named groups:

- **`colorTokens`** — Base palette with neutral (50–900), primary, danger, success, and warning scales. Semantic aliases (e.g., `color-primary` → `color-primary-500`) provide developer-friendly names.
- **`typographyTokens`** — Font families (sans, mono), size scale (xs to 4xl), line heights (tight, normal, relaxed), and weights (normal to bold).
- **`spacingTokens`** — Unit scale from 0 to 64px following a consistent progression.
- **`shadowTokens`** — Elevation levels (sm, md, lg, xl) with multi-layer box-shadow definitions.
- **`radiusTokens`** — Border radius scale from none to full (pill shape).
- **`zIndexTokens`** — Layering stack (dropdown → sticky → overlay → modal → toast → tooltip).

All tokens are combined into `allTokens[]` and a `tokenMap` for O(1) lookup.

### `lib/token-exporter.ts`

Multi-platform token exporter with three output formats:

- **`exportCSS()`** — Generates a `:root` selector with all tokens as CSS custom properties. Supports custom selectors for scoped themes.
- **`exportJS()`** — Produces a plain JavaScript object keyed by token name for programmatic access in React components.
- **`exportJSON()`** — Conforms to the W3C Design Tokens Community Group format for cross-platform consumption (Style Dictionary, iOS, Android).

**Alias Resolution**: All exporters run `resolveAliases()` which follows token references with circular dependency detection using a visited-set traversal. If a cycle is detected, the build fails with a descriptive error identifying the circular chain.

### `lib/theme-builder.ts`

Constructs theme objects from base tokens with override support:

- **`buildTheme()`** — Merges base tokens with consumer overrides, validates override types, and runs WCAG contrast checks on foreground/background color pairs.
- **`contrastRatio()`** — Calculates the relative luminance-based contrast ratio per WCAG 2.1.
- **`passesWCAGAA()`** — Checks if a color pair meets the 4.5:1 minimum (3:1 for large text).
- **Pre-built themes** — `lightTheme` and `darkTheme` are exported as ready-to-use themes. The dark theme overrides background, text, and border tokens.

Warnings are collected during the build and included in the `ThemeDefinition.warnings` array, enabling development-mode console warnings and CI pipeline validation.

### `lib/component-registry.ts`

Central registry for all library components:

- **`registerComponent()`** — Registers a component with its metadata. Throws on duplicate registration (prevents accidental double-registration).
- **`updateComponentMeta()`** — Updates an existing component's metadata (e.g., after an a11y audit).
- **Lookup APIs** — `getComponent()`, `getAllComponents()`, `getComponentsByCategory()`, `getDeprecatedComponents()`, `getComponentsByA11yStatus()`, `getComponentsUsingToken()`.
- **`createComponentMeta()`** — Higher-order function that registers and returns metadata for use in component definitions.
- **`printRegistrySummary()`** — Development-only console output showing registry statistics.

### `lib/accessibility-checker.ts`

Automated accessibility validation wrapper around axe-core:

- **`runA11yCheck()`** — Runs axe-core against a DOM container and returns a structured `A11yReport` with pass/fail status, violation count, individual violations, and timing.
- **`checkContrast()`** — Standalone contrast check for a single color pair (used by the theme builder).
- **`batchAudit()`** — Runs audits across multiple containers (e.g., all Storybook stories) and returns an aggregated report.

### `hooks/use-token-resolution.ts`

Resolves token names to their current theme values at runtime:

- **`useTokenResolution(tokenName)`** — Returns the resolved value for a single token. Uses the pre-resolved token map (O(1)) with a fallback to computed style lookup.
- **`useTokenResolutionMany(tokenNames)`** — Resolves multiple tokens at once, returning a Map.
- **`TokenContextValue`** — Context interface providing the container ref and resolved token map. Set by `TokenProvider`.

### `hooks/use-theme-tokens.ts`

Provides access to the current theme token object:

- **`useThemeTokens()`** — Returns all token values as a `Record<string, string>`. Used for JavaScript-driven style decisions (canvas, SVG generation).
- **`useThemeTokensByCategory(category)`** — Filters tokens by category prefix (e.g., `color-*`).
- **Convenience hooks** — `useColorTokens()`, `useSpacingTokens()`, `useTypographyTokens()`.

### `components/token-provider.tsx`

The root of the theming system:

- Receives a `ThemeDefinition` and optional `ThemeOverride`.
- Converts all token values to CSS custom property declarations.
- Injects them as a `<style>` tag in `document.head` (default) or as inline styles on the container element.
- Sets the `TokenContextValue` for the resolution hooks.
- Logs theme warnings in development mode.
- The `useThemeSwitcher()` hook provides a `switchTheme()` function that persists the selection to localStorage.

### `components/component-meta.tsx`

Development-only component that displays metadata for a registered component:

- Shows component name, version, accessibility status (with color-coded badge), description, category.
- Optionally shows associated design tokens and deprecation info.
- Renders `null` in production builds (`process.env.NODE_ENV !== "development"` guard).

### `components/library-playground.tsx`

Interactive component viewer with live prop controls:

- Accepts an array of `PlaygroundControl` definitions (select, text, number, boolean, color).
- Renders a controls sidebar and a preview area.
- Generates a code preview showing the current JSX markup with applied props.
- Includes a reset button to restore default prop values.

### `components/documentation-page.tsx`

MDX-style documentation page renderer:

- Renders structured sections (heading + content).
- Displays live component examples.
- Renders a props table with name, type, required, default, and description columns.
- Shows do/don't examples with green/red visual coding.

## Data Flow Summary

```
design-tokens.ts (source of truth)
  │
  ├──► token-exporter.ts ──► CSS, JS, JSON outputs
  │
  ├──► theme-builder.ts ──► ThemeDefinition { tokens, warnings }
  │        │
  │        ▼
  │   token-provider.tsx ──► CSS variable injection into DOM
  │        │
  │        ▼
  │   React components consume via var(--token-name)
  │
  ├──► component-registry.ts ──► Component metadata tracking
  │
  └──► accessibility-checker.ts ──► Automated a11y validation
```

## Key Design Decisions

1. **CSS Custom Properties over CSS-in-JS**: Zero runtime overhead, native browser support, instant theme switches without React re-renders.
2. **Build-time token generation**: Tokens are resolved and exported at build time, not runtime. This eliminates runtime processing overhead.
3. **Delta injection for scoped themes**: Only overridden tokens are injected at theme boundaries, relying on CSS inheritance for the rest.
4. **Development-only metadata**: ComponentMeta, registry diagnostics, and theme warnings are stripped from production builds.
5. **Polymorphic `as` prop with type narrowing**: Uses TypeScript conditional types to infer element-specific props from the `as` value.
