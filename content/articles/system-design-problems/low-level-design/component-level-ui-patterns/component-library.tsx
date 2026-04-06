"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-component-library",
  title: "Design a Component Library",
  description:
    "Complete LLD solution for a production-grade component library with design tokens, token distribution, component API design, theming, accessibility compliance, documentation, versioning, testing, bundle optimization, and contribution workflow.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "component-library",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "component-library",
    "design-tokens",
    "theming",
    "accessibility",
    "documentation",
    "versioning",
    "bundle-optimization",
  ],
  relatedTopics: [
    "theme-theming-system",
    "design-token-architecture",
    "component-libraries-and-design-systems",
    "form-builder",
  ],
};

export default function ComponentLibraryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable component library for a large-scale
          organization that maintains multiple web and mobile applications. The
          library must provide a consistent set of UI components (buttons, inputs,
          modals, tables, etc.) that share a unified visual language, enforce
          accessibility standards, and support theming across brands and products.
          The system must expose design tokens — the atomic visual decisions such as
          colors, typography scales, spacing units, shadow levels, and border radii
          — in a structured format consumable by any platform (web, iOS, Android).
        </p>
        <p>
          The component library serves as the single source of truth for UI
          patterns. Every component must have a well-defined API with consistent prop
          patterns, support compound component composition, and optionally accept
          render props or polymorphic elements for advanced customization. The library
          must ship with comprehensive documentation (interactive playgrounds, usage
          guidelines, do/don't examples), automated accessibility testing, visual
          regression testing, and semantic versioning with migration guides for
          breaking changes.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The library targets React 19+ web applications using TypeScript with
            strict mode enabled.
          </li>
          <li>
            Design tokens must be distributable in multiple formats: CSS custom
            properties, JavaScript/TypeScript exports, and JSON for cross-platform
            consumption (iOS, Android).
          </li>
          <li>
            The library supports light/dark mode and brand-level customization via
            token overrides at runtime.
          </li>
          <li>
            All components must meet WCAG 2.1 AA accessibility standards minimum,
            including keyboard navigation and screen reader compatibility.
          </li>
          <li>
            The library is published as an npm package with semantic versioning,
            tree-shaking support, and peer dependency on React.
          </li>
          <li>
            Multiple teams contribute to the library, requiring a structured
            contribution workflow with automated checks.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Design Token System:</strong> Define and manage design tokens
            for color palettes, typography scales, spacing systems, shadow levels,
            border radii, and z-index layers as structured, versioned data.
          </li>
          <li>
            <strong>Token Distribution:</strong> Export tokens as CSS custom
            properties for runtime theming, JavaScript/TypeScript objects for
            programmatic access, and JSON for cross-platform consumption (iOS
            Style Dictionary, Android XML resources).
          </li>
          <li>
            <strong>Component API Design:</strong> Every component exposes a
            consistent prop pattern (e.g., <code>variant</code>, <code>size</code>,
            <code>disabled</code>, <code>className</code>), supports compound
            component composition, and optionally accepts render props or
            polymorphic <code>as</code> props.
          </li>
          <li>
            <strong>Theming:</strong> Support light/dark mode switching, brand-level
            customization via token overrides, and CSS variable runtime theming
            without re-renders.
          </li>
          <li>
            <strong>Accessibility Compliance:</strong> All components meet WCAG 2.1
            AA minimum, are fully keyboard navigable, and tested with screen readers
            (NVDA, VoiceOver, TalkBack).
          </li>
          <li>
            <strong>Documentation:</strong> Storybook with MDX docs, interactive
            playground with live prop controls, usage guidelines, and do/don't
            examples for every component.
          </li>
          <li>
            <strong>Versioning:</strong> Semantic versioning with breaking change
            policy, automated migration guides, and runtime deprecation warnings
            for deprecated props or components.
          </li>
          <li>
            <strong>Testing:</strong> Unit tests with Jest, visual regression with
            Chromatic, accessibility tests with axe-core, and interaction tests
            with Storybook test runner.
          </li>
          <li>
            <strong>Bundle Optimization:</strong> Tree-shaking support via
            <code>sideEffects: false</code>, peer dependencies on React, and
            barrel exports that do not prevent dead-code elimination.
          </li>
          <li>
            <strong>Contribution Workflow:</strong> PR template, design review,
            code review, and automated checks (lint, test, accessibility, bundle
            size) on every pull request.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> The library must add minimal bundle
            overhead. Individual components should be importable without pulling
            in the entire library. Token resolution at runtime should be O(1) via
            CSS variable inheritance.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support with strict mode.
            All component props, token types, theme overrides, and component metadata
            are strongly typed with no <code>any</code> usage.
          </li>
          <li>
            <strong>Developer Experience:</strong> Components should provide helpful
            runtime warnings in development mode for misconfigurations (e.g., invalid
            prop combinations, missing required context, accessibility violations).
          </li>
          <li>
            <strong>Scalability:</strong> The library must support 100+ components
            across multiple packages (core, data-display, forms, layout, overlay)
            without becoming unmaintainable.
          </li>
          <li>
            <strong>Cross-Platform Consistency:</strong> Design tokens must produce
            visually equivalent results across web (CSS), iOS (Swift), and Android
            (XML) platforms.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Token references that form circular dependencies (e.g., token A
            references token B, which references token A).
          </li>
          <li>
            Theme overrides that produce insufficient contrast ratios (e.g., a
            brand color that fails WCAG AA against the background).
          </li>
          <li>
            Consumers importing from barrel files (e.g., <code>{"import { Button } from '@org/ui'"}</code>)
            which can defeat tree-shaking if the bundler does not support
            module-sideEffects.
          </li>
          <li>
            Multiple versions of the library installed in a monorepo, causing
            duplicate CSS variable definitions or React context mismatches.
          </li>
          <li>
            Server-side rendering: tokens must be injectable during SSR so the
            initial HTML carries correct styles without client-side hydration
            mismatch.
          </li>
          <li>
            Polymorphic components with <code>as</code> prop lose type inference
            for element-specific props (e.g., <code>href</code> on an
            <code>{"<a>"}</code> vs <code>to</code> on a <code>{"<Link>"}</code>).
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core architecture separates the component library into three layers:
          a <strong>token layer</strong> (design tokens as structured data with
          multi-platform exporters), a <strong>theme layer</strong> (token-to-CSS-variable
          mapping with override support and contrast validation), and a
          <strong>component layer</strong> (React components consuming tokens via CSS
          variables and exposing consistent APIs). This separation ensures that visual
          changes are localized to tokens, theme changes are atomic via CSS variable
          swaps, and components remain agnostic to specific visual values.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>CSS-in-JS (styled-components, Emotion):</strong> Provides dynamic
            theming via JavaScript objects and runtime style generation. The trade-off
            is runtime overhead (style recalculation on every render), larger bundle
            size (runtime library), and CSS extraction complexity for SSR. CSS custom
            properties have zero runtime cost and are natively supported by browsers.
          </li>
          <li>
            <strong>Utility-first CSS only (pure Tailwind):</strong> Every component
            is composed of Tailwind utility classes. This works well for single
            applications but fails at the library level — consumers cannot easily
            override the visual language without forking every component. Tokens provide
            a single override point.
          </li>
          <li>
            <strong>Static CSS with preprocessor variables (Sass/Less):</strong>
            Compile-time variables produce static CSS with no runtime theming capability.
            Theme switching requires swapping entire stylesheets. CSS custom properties
            enable atomic, instant theme switches without reloading stylesheets.
          </li>
        </ul>
        <p>
          <strong>Why CSS Custom Properties + Token Layer is optimal:</strong> CSS
          variables provide native runtime theming with zero JavaScript execution cost.
          The token layer ensures tokens are defined once in a structured format and
          exported to all platforms consistently. Components reference CSS variables
          (e.g., <code>var(--color-primary)</code>), so theme swaps happen at the CSS
          level without React re-renders. This pattern is used by production design
          systems like Radix UI, GitHub Primer, and Shopify Polaris.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The library consists of six primary modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Type Definitions (<code>library-types.ts</code>)</h4>
          <p>
            Defines the core TypeScript interfaces used across the library. The
            <code>DesignToken</code> interface represents a single token with a name,
            value, type category, description, and optional alias (reference to another
            token). The <code>TokenCategory</code> union enumerates all token types:
            color, typography, spacing, shadow, radius, and zIndex. The
            <code>ThemeDefinition</code> interface maps token names to their resolved
            values for a specific theme. The <code>ComponentMeta</code> interface tracks
            component name, version, accessibility status, deprecation state, and
            associated tokens.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Design Tokens (<code>design-tokens.ts</code>)</h4>
          <p>
            The single source of truth for all design token values. Organized into
            named groups: <code>colors</code> (base palette, semantic aliases, state
            colors), <code>typography</code> (font families, size scales, line heights,
            font weights), <code>spacing</code> (unit scale from 0 to 64px+),
            <code>shadows</code> (elevation levels), <code>radii</code> (border radius
            scale), and <code>zIndices</code> (layering stack). Each token is a typed
            object with name, value, category, and description. Tokens can reference
            other tokens via the <code>alias</code> field (e.g., a semantic color
            aliasing a base palette color).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Token Exporter (<code>token-exporter.ts</code>)</h4>
          <p>
            Transforms token definitions into platform-specific formats. Exports CSS
            custom properties as a <code>:root</code> selector string for web runtime
            theming. Exports JavaScript objects for programmatic token access in React
            components. Exports JSON conforming to the W3C Design Tokens Community
            Group format for cross-platform consumption. Handles token alias resolution
            so exported values are always fully resolved (no circular references).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Theme Builder (<code>theme-builder.ts</code>)</h4>
          <p>
            Constructs theme objects from base tokens with support for token overrides.
            Validates override values (type checking, range validation for numeric
            values). Runs WCAG contrast checks on color pairs (foreground/background)
            and warns when overrides produce insufficient contrast ratios. Merges
            partial overrides with base theme values so consumers only specify what
            they customize.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Component Registry (<code>component-registry.ts</code>)</h4>
          <p>
            Tracks all registered components with their metadata: name, version,
            accessibility audit status, deprecation state, and associated tokens.
            Provides a lookup API for documentation tooling to enumerate all
            components, filter by category, and retrieve component metadata. Used by
            the documentation site and the development-only ComponentMeta component
            to display component information.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Accessibility Checker (<code>accessibility-checker.ts</code>)</h4>
          <p>
            Automated accessibility validation wrapper around axe-core rules. Runs
            programmatically against rendered components in test environments. Reports
            violations with rule ID, impact level, affected element, and remediation
            guidance. Integrates into the CI pipeline and the development-only
            ComponentMeta component to surface accessibility status.
          </p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/component-library-architecture.svg"
          alt="Component library architecture showing token resolution, theme building, and component composition"
          caption="Token Resolution Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Token Resolution Flow</h3>
        <p>
          Tokens are resolved in a multi-step pipeline. First, token definitions are
          loaded from the source file. Second, aliases are resolved by following
          references (with circular dependency detection). Third, the theme builder
          maps resolved tokens to CSS variable names (e.g., <code>color-primary</code>
          becomes <code>--color-primary</code>). Fourth, CSS variables are injected
          into the DOM via the TokenProvider component, which renders a container
          element with inline <code>style</code> containing all variable definitions.
          Finally, components reference CSS variables in their styles
          (<code>color: var(--color-primary)</code>), and the browser&apos;s CSS engine
          handles inheritance and cascading.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component API Patterns</h3>
        <p>
          Every component in the library follows consistent API patterns. The
          <code>variant</code> prop controls visual style (e.g., <code>primary</code>,
          <code>secondary</code>, <code>ghost</code>). The <code>size</code> prop
          controls dimensions and typography scale (e.g., <code>sm</code>, <code>md</code>,
          <code>lg</code>). The <code>as</code> prop enables polymorphism, allowing
          consumers to change the underlying element while preserving styling. Compound
          components expose sub-components as static properties (e.g.,
          <code>{"<Dialog.Title>"}</code>, <code>{"<Dialog.Body>"}</code>,
          <code>{"<Dialog.Actions>"}</code>) connected via React Context to avoid
          prop drilling.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Theming Architecture</h3>
        <p>
          Themes are constructed by the Theme Builder, which takes a base token set
          and applies consumer-specified overrides. The resulting theme object maps
          every token name to a resolved value. The TokenProvider component receives
          this theme, converts it to a CSS variable map, and injects it as inline
          styles on a container element. Because CSS variables cascade, child elements
          automatically inherit theme values. Switching themes is as simple as
          rendering a different TokenProvider — no component re-renders are needed
          beyond the provider boundary because CSS variable changes are handled
          natively by the browser.
        </p>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional token-to-CSS pipeline. Token
          definitions are the source of truth, the Theme Builder transforms them into
          theme objects, the TokenProvider injects them as CSS variables, and
          components consume them via CSS variable references. This ensures that visual
          changes propagate atomically through the CSS cascade without requiring React
          state updates or component re-renders.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Build-Time Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Token definitions are authored in <code>design-tokens.ts</code> as typed
            JavaScript objects.
          </li>
          <li>
            The Token Exporter runs at build time (or via a CLI script) to generate
            CSS variable files, JavaScript exports, and JSON for cross-platform use.
          </li>
          <li>
            Generated CSS is included in the library&apos;s style output. Generated
            TypeScript types are included in the package&apos;s type declarations.
          </li>
          <li>
            Components are compiled with references to CSS variable names (not raw
            token values), ensuring runtime theme compatibility.
          </li>
          <li>
            The library is bundled with tree-shaking enabled, producing per-component
            ESM output.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Runtime Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Application imports the library&apos;s TokenProvider and wraps the app or
            a subtree.
          </li>
          <li>
            TokenProvider receives a theme object (from Theme Builder or consumer
            override), converts it to a CSS variable map.
          </li>
          <li>
            TokenProvider renders a <code>{"<div>"}</code> with inline
            <code>style</code> containing all CSS variable definitions.
          </li>
          <li>
            Components within the provider tree reference CSS variables in their
            Tailwind or inline styles (e.g., <code>bg-[var(--color-bg-primary)]</code>).
          </li>
          <li>
            When the consumer switches themes, TokenProvider receives a new theme
            prop, updates the inline style CSS variable values, and the browser
            repaints affected elements without React re-rendering components.
          </li>
        </ol>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Circular token references:</strong> The Token Exporter detects
            cycles during alias resolution using a visited-set traversal algorithm.
            When a cycle is detected, the build fails with an error identifying the
            circular chain. This prevents infinite loops at build time rather than
            runtime.
          </li>
          <li>
            <strong>Insufficient contrast after overrides:</strong> The Theme Builder
            runs WCAG contrast checks on every color token pair during theme
            construction. If a contrast ratio falls below 4.5:1 (AA normal text), a
            warning is logged in development and the violation is recorded in the
            theme metadata.
          </li>
          <li>
            <strong>SSR token injection:</strong> During server-side rendering, the
            TokenProvider renders the CSS variable style string inline on the
            container element. The HTML sent to the browser already carries correct
            styles. On hydration, React reattaches to the existing DOM without
            flash or mismatch.
          </li>
          <li>
            <strong>Polymorphic prop typing:</strong> Components using the
            <code>as</code> prop use TypeScript generics with conditional types to
            infer the correct element-specific props. When <code>as="a"</code>, the
            component accepts <code>href</code>; when <code>{"as={Link}"}</code>, it
            accepts <code>to</code>. The implementation uses a distributed conditional
            type mapped over a known element-to-props interface.
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
            The complete, production-ready implementation consists of 12 files:
            TypeScript interfaces for all types, token definitions covering colors,
            typography, spacing, shadows, radii, and z-indices, a multi-platform token
            exporter (CSS, JS, JSON), a theme builder with contrast checking, a
            component registry with version tracking, an accessibility checker wrapper,
            token resolution and theme access hooks, a TokenProvider for CSS variable
            injection, a development-only ComponentMeta display, an interactive
            playground with prop controls, and an MDX-based documentation page. Click
            the <strong>Example</strong> toggle at the top of the article to view all
            source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Type Definitions (library-types.ts)</h3>
        <p>
          Defines the foundational types for the entire library. The
          <code>DesignToken</code> interface carries <code>name</code>, <code>value</code>,
          <code>category</code> (typed union), <code>description</code>, and optional
          <code>alias</code> for token references. The <code>ThemeDefinition</code>
          interface maps token names to resolved string values. The
          <code>ComponentMeta</code> interface tracks component name, version, a11y
          status (pass/fail/pending), deprecation info, and an array of associated
          token names. The <code>ThemeOverride</code> type is a partial map allowing
          consumers to customize any subset of tokens.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Design Tokens (design-tokens.ts)</h3>
        <p>
          The authoritative token definitions organized into named exports:
          <code>colorTokens</code> (base palette with 50-900 scales, semantic aliases
          like <code>primary</code>, <code>danger</code>, <code>surface</code>),
          <code>typographyTokens</code> (font families, size scale from 12px to 48px,
          line heights, weights), <code>spacingTokens</code> (4px to 64px scale),
          <code>shadowTokens</code> (sm, md, lg, xl elevation levels with multiple
          box-shadow layers), <code>radiusTokens</code> (none, sm, md, lg, xl, full),
          and <code>zIndexTokens</code> (dropdown, sticky, modal, toast layering).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Token Exporter (token-exporter.ts)</h3>
        <p>
            Transforms token definitions into three output formats. The CSS exporter
            generates a <code>:root</code> selector with all tokens as CSS custom
            properties (e.g., <code>--color-primary: #3b82f6</code>). The JS exporter
            produces a plain JavaScript object keyed by token name for programmatic
            access. The JSON exporter conforms to the W3C Design Tokens format for
            cross-platform tooling. All exporters resolve aliases so output values
            are fully dereferenced. Circular reference detection uses a visited-set
            traversal.
          </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Theme Builder (theme-builder.ts)</h3>
        <p>
          Accepts a base theme and a partial override object, merges them with the
          override taking precedence, validates override values against expected types,
          and runs WCAG contrast checks on all foreground/background color pairs.
          Returns a complete <code>ThemeDefinition</code> with a <code>warnings</code>
          array documenting any contrast violations. Supports brand-level
          customization where a consumer provides only the tokens they wish to override
          (e.g., a brand primary color) and the builder derives the full theme.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Component Registry (component-registry.ts)</h3>
        <p>
          Maintains a central registry of all library components. Each component
          registers itself with metadata including name, semantic version,
          accessibility audit status, deprecation state, and associated design tokens.
          The registry exposes lookup APIs: <code>getAll()</code>, <code>getByName()</code>,
          <code>getByCategory()</code>, and <code>getDeprecated()</code>. Used by
          documentation tooling to auto-generate component listings and by the
          development-only ComponentMeta component.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Accessibility Checker (accessibility-checker.ts)</h3>
        <p>
          Wraps axe-core&apos;s programmatic API to provide a simplified interface for
          running accessibility audits. The <code>runA11yCheck()</code> function
          accepts a DOM container, runs the full WCAG 2.1 AA rule set, and returns
          structured violation reports with rule ID, impact level (critical, serious,
          moderate, minor), affected element selector, and remediation guidance.
          Integrates into CI pipelines and development-mode component warnings.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Hooks: useTokenResolution and useThemeTokens</h3>
        <p>
          The <code>useTokenResolution</code> hook resolves a token name to its
          current theme value at runtime by looking up the CSS variable value from
          the computed style of the provider container. The <code>useThemeTokens</code>
          hook provides direct access to the current theme object within a component,
          enabling JavaScript-driven style decisions (e.g., canvas rendering, SVG
          generation) that cannot use CSS variables directly.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Components: TokenProvider, ComponentMeta, Playground, Documentation</h3>
        <p>
          The <code>TokenProvider</code> is the root of the theming system — it
          receives a theme, converts it to CSS variable declarations, and injects
          them as inline styles on a container element. The <code>ComponentMeta</code>
          is a development-only component that displays component name, version,
          accessibility status, and associated tokens for debugging. The
          <code>LibraryPlayground</code> provides an interactive component viewer
          with live prop controls, allowing consumers to experiment with component
          variants, sizes, and states. The <code>DocumentationPage</code> renders
          MDX-based documentation with live component examples, usage guidelines,
          and do/don't patterns.
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
                <td className="p-2">Token alias resolution</td>
                <td className="p-2">O(n) — n tokens, single pass with cycle detection</td>
                <td className="p-2">O(n) — resolved token map</td>
              </tr>
              <tr>
                <td className="p-2">Theme build with overrides</td>
                <td className="p-2">O(m) — m override keys merged into base</td>
                <td className="p-2">O(t) — t total tokens in theme</td>
              </tr>
              <tr>
                <td className="p-2">Contrast check</td>
                <td className="p-2">O(1) per color pair — relative luminance math</td>
                <td className="p-2">O(c) — c color pairs checked</td>
              </tr>
              <tr>
                <td className="p-2">CSS variable injection</td>
                <td className="p-2">O(t) — string concatenation of t variables</td>
                <td className="p-2">O(t) — inline style string length</td>
              </tr>
              <tr>
                <td className="p-2">Token lookup by name</td>
                <td className="p-2">O(1) — Map or object key lookup</td>
                <td className="p-2">O(1) — single value</td>
              </tr>
              <tr>
                <td className="p-2">Component registry lookup</td>
                <td className="p-2">O(1) — Map key lookup</td>
                <td className="p-2">O(r) — r registered components</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is total token count (typically 200-500 for a mature
          design system), <code>m</code> is override count (typically 5-20 for a
          brand theme), <code>t</code> is total tokens in a theme, and <code>c</code>
          is the number of foreground/background color pairs checked (typically 20-50).
          All operations are sub-millisecond for realistic token counts.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Barrel export imports defeating tree-shaking:</strong> When a
            consumer imports from a barrel file (e.g., <code>{"import { Button, Modal } from '@org/ui'"}</code>),
            some bundlers include the entire barrel module even if only two components
            are used. Mitigation: publish the library with <code>sideEffects: false</code>
            in package.json and use ESM exports. Encourage deep imports
            (<code>{"import { Button } from '@org/ui/button'"}</code>) for maximum
            tree-shaking safety.
          </li>
          <li>
            <strong>Large CSS variable injection strings:</strong> A mature design
            system may have 500+ CSS variables. Injecting them as inline styles on
            every TokenProvider creates large <code>style</code> attributes.
            Mitigation: inject CSS variables once at the document root via a
            <code>{"<style>"}</code> tag rather than inline styles, and use CSS
            variable inheritance for scoped theme overrides.
          </li>
          <li>
            <strong>Contrast check computation at runtime:</strong> Running WCAG
            contrast checks on every theme switch adds computational overhead.
            Mitigation: run contrast checks at build time during theme construction,
            not at runtime. The runtime TokenProvider only injects pre-validated
            CSS variables.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Per-component ESM exports:</strong> Publish each component as a
            separate ESM entry point. Configure <code>exports</code> field in
            package.json to map subpath imports. This ensures bundlers can
            tree-shake unused components even when consumers use barrel imports.
          </li>
          <li>
            <strong>CSS variable inheritance for scoped themes:</strong> Instead of
            injecting 500 variables at every theme boundary, inject only the delta
            (overridden variables) at the scoped level. CSS inheritance handles the
            rest. This reduces style string size by 90%+ for partial theme overrides.
          </li>
          <li>
            <strong>Build-time token generation:</strong> Generate CSS files, type
            declarations, and JSON at build time rather than runtime. This eliminates
            runtime token processing overhead and ensures consumers receive static,
            optimizable output.
          </li>
          <li>
            <strong>Development-only metadata stripping:</strong> The ComponentMeta
            component and component registry metadata should be excluded from
            production builds via tree-shaking or conditional exports. Use
            <code>process.env.NODE_ENV</code> guards to strip development-only code
            from production bundles.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security &amp; Accessibility Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Sanitization in Component Content</h3>
        <p>
          Components that accept user-generated content (e.g., button labels, input
          values, tooltip text) must sanitize HTML before rendering. React automatically
          escapes string content rendered as JSX children, but components that accept
          HTML strings via <code>dangerouslySetInnerHTML</code> or rich text props
          must run the content through a sanitizer like DOMPurify. Design tokens
          themselves are not user-generated and therefore are not XSS vectors.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility Compliance (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">WCAG 2.1 AA Requirements</h4>
          <ul className="space-y-2">
            <li>
              <strong>Contrast ratios:</strong> All text must meet 4.5:1 minimum
              contrast against its background. Large text (18pt+ or 14pt+ bold)
              requires 3:1. The Theme Builder validates this at build time.
            </li>
            <li>
              <strong>Keyboard navigation:</strong> Every interactive component
              (buttons, links, inputs, selects, menus, dialogs) must be fully
              operable via keyboard alone. Tab order must follow logical reading
              order. Focus must be visible (minimum 3:1 contrast for focus ring
              against adjacent colors).
            </li>
            <li>
              <strong>Screen reader testing:</strong> Components are tested with
              NVDA (Windows + Firefox/Chrome), VoiceOver (macOS + Safari), and
              TalkBack (Android + Chrome). ARIA roles, states, and properties must
              accurately describe component purpose and state.
            </li>
            <li>
              <strong>Focus management:</strong> Modal dialogs trap focus within
              their boundaries and restore focus to the triggering element on close.
              Skip links provide direct navigation to main content.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Automated A11y Testing Pipeline</h4>
          <p>
            Every component story in Storybook is tested with axe-core via the
            Storybook test runner. Violations are categorized by impact level:
            critical (must fix before merge), serious (should fix), moderate, and
            minor. The CI pipeline blocks merges on critical violations. The
            accessibility checker module provides the integration layer between
            axe-core and the test runner, reporting structured violation objects
            with selectors, rule IDs, and remediation steps.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Supply Chain Security</h3>
        <ul className="space-y-2">
          <li>
            <strong>Dependency pinning:</strong> All library dependencies (React,
            axe-core, etc.) are pinned to exact versions in the lockfile. Peer
            dependency ranges are conservative to maximize consumer compatibility.
          </li>
          <li>
            <strong>Bundle integrity:</strong> Published packages include an
            integrity hash (SRI) in the lockfile. Consumers can verify package
            integrity during installation.
          </li>
          <li>
            <strong>No runtime eval:</strong> The library does not use
            <code>eval()</code>, <code>new Function()</code>, or dynamic
            <code>import()</code> for component logic. Token resolution is static
            at build time.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Token definitions:</strong> Verify every token has a non-empty
            name, valid value, correct category, and description. Assert that aliased
            tokens reference valid target tokens that exist in the token map.
          </li>
          <li>
            <strong>Token exporter:</strong> Test CSS output contains correctly
            formatted variable declarations. Test JS output is a plain object with
            all token names as keys. Test JSON output conforms to W3C Design Tokens
            schema. Test circular reference detection throws with a clear error
            message identifying the cycle.
          </li>
          <li>
            <strong>Theme Builder:</strong> Test that overrides correctly merge with
            base theme (override values take precedence, non-overridden values
            preserved). Test contrast check correctly flags insufficient contrast
            pairs (e.g., white text on light gray background). Test that invalid
            override types (e.g., number where string expected) produce validation
            errors.
          </li>
          <li>
            <strong>Component registry:</strong> Test registration adds component
            to the registry with correct metadata. Test lookup APIs return expected
            results. Test duplicate registration is handled (either overwrite or
            throw, depending on design decision).
          </li>
          <li>
            <strong>Accessibility checker:</strong> Test that it correctly identifies
            known violations (e.g., missing alt text, insufficient contrast, missing
            ARIA labels). Test clean components pass with zero violations.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>TokenProvider rendering:</strong> Render TokenProvider with a
            theme, assert the container element has inline styles containing all
            expected CSS variable declarations. Test theme switch updates the style
            attribute. Test scoped theme injection (nested providers).
          </li>
          <li>
            <strong>Component consumption:</strong> Render a component within a
            TokenProvider, assert computed styles resolve to the expected CSS
            variable values. Test that changing the theme updates computed styles
            without re-rendering the component.
          </li>
          <li>
            <strong>Playground interaction:</strong> Render the LibraryPlayground,
            select a component, adjust prop controls via UI, assert the component
            preview updates correctly. Test prop validation warnings display for
            invalid prop combinations.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Visual Regression Testing</h3>
        <ul className="space-y-2">
          <li>
            <strong>Chromatic snapshots:</strong> Every component story captures
            screenshots at multiple viewport sizes (320px, 768px, 1280px, 1920px)
            and in both light and dark themes. Chromatic compares snapshots against
            baselines and flags pixel-level differences.
          </li>
          <li>
            <strong>State coverage:</strong> Snapshots capture every component state:
            default, hover, focus, active, disabled, loading, error, and empty states.
          </li>
          <li>
            <strong>Threshold tuning:</strong> Chromatic thresholds are set to 0.05%
            pixel change tolerance to catch unintended visual regressions while
            ignoring sub-pixel anti-aliasing differences across renderers.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Token with circular alias reference: verify build fails with descriptive
            error identifying the circular chain.
          </li>
          <li>
            Theme override with empty or null values: verify Theme Builder either
            rejects or defaults appropriately.
          </li>
          <li>
            Component rendered without TokenProvider ancestor: verify component
            either provides fallback defaults or throws a descriptive error in
            development mode.
          </li>
          <li>
            Polymorphic component with invalid <code>as</code> value: verify
            TypeScript catches it at compile time and runtime provides a development
            warning.
          </li>
          <li>
            Accessibility audit on a component with dynamic content: verify axe-core
            runs after content stabilizes (e.g., after async data loads and animations
            complete).
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Hardcoding visual values in components:</strong> Candidates often
            write components with hardcoded colors, spacing, and font sizes
            (e.g., <code>color: #3b82f6</code>, <code>padding: 16px</code>).
            Interviewers expect candidates to abstract these into tokens so the visual
            language can change without modifying component code.
          </li>
          <li>
            <strong>Inconsistent component APIs:</strong> Each component uses different
            prop names for the same concept (e.g., one uses <code>variant</code>,
            another uses <code>type</code>, another uses <code>theme</code>). A
            component library must enforce consistent naming conventions across all
            components.
          </li>
          <li>
            <strong>Ignoring tree-shaking:</strong> Publishing components as a single
            bundled file or using CommonJS exports prevents bundlers from eliminating
            unused components. Interviewers look for candidates who understand ESM,
            <code>sideEffects: false</code>, and the <code>exports</code> field in
            package.json.
          </li>
          <li>
            <strong>Skipping accessibility:</strong> Building components without
            keyboard navigation, ARIA attributes, or contrast validation is a
            critical oversight. In production systems, inaccessible components
            exclude users and may violate legal requirements (ADA, EAA).
          </li>
          <li>
            <strong>No versioning strategy:</strong> Making breaking changes without
            semantic version bumps, migration guides, or deprecation periods breaks
            consumer applications. Interviewers expect candidates to discuss
            deprecation timelines, codemods, and communication strategies.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">CSS Custom Properties vs CSS-in-JS</h4>
          <p>
            CSS custom properties have zero runtime overhead, work natively in all
            modern browsers, and enable theme switching without React re-renders. The
            trade-off is that they cannot express dynamic values computed at runtime
            from JavaScript state (e.g., a color interpolated from a slider value).
            CSS-in-JS (styled-components, Emotion) excels at dynamic, state-driven
            styles but introduces a runtime library (~10-15KB gzipped), requires
            style recalculation on every render, and complicates SSR (style
            extraction). For a component library, CSS variables are the right default
            because components should not depend on application state for their visual
            design. CSS-in-JS is appropriate for application-specific, data-driven
            visualizations.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Barrel Exports vs Deep Imports</h4>
          <p>
            Barrel exports (a single <code>index.ts</code> re-exporting all components)
            provide a convenient import surface (<code>{"import { Button } from '@org/ui'"}</code>)
            but can defeat tree-shaking if the bundler does not fully support
            <code>sideEffects: false</code>. Deep imports
            (<code>{"import Button from '@org/ui/button'"}</code>) are
            tree-shaking-safe by construction but are verbose. The best practice is to
            provide both: barrel exports for convenience with proper
            <code>sideEffects: false</code> configuration, and deep imports for
            consumers who need guaranteed minimal bundle size. Modern bundlers
            (Vite, webpack 5+, esbuild) handle barrel exports correctly with
            <code>sideEffects: false</code>.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Strict vs Flexible Component APIs</h4>
          <p>
            A strict API limits props to a predefined set, catching misuse at compile
            time but potentially forcing consumers to fork the component for edge cases.
            A flexible API accepts additional props via spread operators
            (<code>{"{...rest}"}</code>), passing them through to the underlying
            element, which maximizes flexibility but risks undocumented behavior and
            harder type inference. The pragmatic approach is strict typing for
            documented props with <code>{"& React.ComponentPropsWithoutRef<T>"}</code>
            for element-specific passthrough, balancing safety with extensibility.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle a consumer needing a component variant that does
              not exist in the library?
            </p>
            <p className="mt-2 text-sm">
              A: First, evaluate whether the variant is broadly useful. If yes, add it
              to the library with a minor version bump. If no, the consumer should
              compose the existing component with custom styling (CSS overrides, wrapper
              component) rather than forking. The library should provide extension points
              — <code>className</code> props, style overrides via CSS variables, and
              compound component composition — so consumers can build custom variants
              without modifying library source. If the pattern becomes common across
              multiple consumers, promote it to the library.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you migrate a component library from v1 to v2 with breaking
              changes?
            </p>
            <p className="mt-2 text-sm">
              A: Follow a deprecation timeline. In v1.x, add runtime warnings for
              deprecated props/components using <code>console.warn</code> in
              development mode. Publish a codemod (automated code transformation using
              jscodeshift) that updates consumer code to the new API. After one major
              release cycle, publish v2.0.0 removing deprecated APIs. Provide a
              detailed migration guide with before/after examples. For enterprise
              libraries, consider supporting both APIs in v2 with a feature flag for
              a transition period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support multi-brand theming where a single application
              serves multiple organizations with distinct brand identities?
            </p>
            <p className="mt-2 text-sm">
              A: Use scoped TokenProviders. Each organization&apos;s section of the
              application is wrapped in a TokenProvider with that org&apos;s brand theme
              (token overrides). Because CSS variables cascade, only the org-specific
              subtree receives the brand colors. The Theme Builder validates each
              brand theme for contrast compliance at build time. For route-based org
              separation, the TokenProvider wraps the route handler. For mixed-brand
              pages (e.g., a marketplace showing multiple sellers), each seller card
              gets its own scoped provider with delta overrides.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle design token versioning and deprecation?
            </p>
            <p className="mt-2 text-sm">
              A: Tokens are versioned alongside components. Deprecated tokens carry a
              <code>deprecated</code> flag with a <code>replacement</code> field
              pointing to the new token name. The Token Exporter still generates the
              deprecated token (with a CSS comment marking it deprecated) so existing
              styles do not break. The TokenProvider logs a development-mode warning
              when a deprecated token is referenced. After two major versions, the
              deprecated token is removed from the export. The documentation site
              marks deprecated tokens with a visual indicator.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test that the library&apos;s TypeScript types are correct
              without relying solely on the consumer&apos;s compilation?
            </p>
            <p className="mt-2 text-sm">
              A: Use <code>tsd</code> or <code>expect-type</code> in the library&apos;s
              test suite to assert type-level behavior. Write tests that verify
              <code>{"ComponentProps<typeof Button>"}</code> includes expected fields,
              that polymorphic <code>as</code> prop correctly narrows element-specific
              types, and that invalid props produce type errors. Run <code>tsc --noEmit</code>
              against a test fixture that imports the library in various ways (barrel,
              deep, with and without generics). Include these checks in CI so type
              regressions are caught before merge.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is your strategy for handling design tokens across web, iOS, and
              Android platforms?
            </p>
            <p className="mt-2 text-sm">
              A: Define tokens once in a platform-agnostic format (the source-of-truth
              <code>design-tokens.ts</code>). Use a token transformer (e.g., Style
              Dictionary or a custom exporter) to generate platform-specific output:
              CSS custom properties and JS objects for web, Swift <code>enum</code> or
              <code>struct</code> for iOS, and XML resource files for Android. The
              transformer resolves aliases and applies platform-specific value
              transformations (e.g., converting pixel values to <code>dp</code> for
              Android, <code>pt</code> for iOS). Shared tooling ensures that a token
              change propagates consistently to all platforms.
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
              href="https://storybook.js.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Storybook — Component Documentation and Playground
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WCAG 2.1 Quick Reference — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://www.deque.com/axe/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              axe-core — Automated Accessibility Testing Engine
            </a>
          </li>
          <li>
            <a
              href="https://github.com/amzn/style-dictionary"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Style Dictionary — Cross-Platform Token Exporter
            </a>
          </li>
          <li>
            <a
              href="https://www.radix-ui.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Radix UI — Accessible Component Primitives
            </a>
          </li>
          <li>
            <a
              href="https://primer.style/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Primer — Design System and Token Architecture
            </a>
          </li>
          <li>
            <a
              href="https://polaris.shopify.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shopify Polaris — Component Library and Design Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://design-tokens.github.io/community-group/format/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C Design Tokens Format — Cross-Platform Token Specification
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
