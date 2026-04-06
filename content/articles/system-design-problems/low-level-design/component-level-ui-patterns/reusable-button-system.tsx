"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-reusable-button-system",
  title: "Design a Reusable Button System",
  description:
    "Complete LLD solution for a production-grade reusable button system with variants, sizes, loading states, icon support, polymorphic as prop, compound ButtonGroup, ripple animation, and full accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "reusable-button-system",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "button",
    "component-design",
    "accessibility",
    "polymorphic",
    "compound-components",
    "state-management",
    "design-system",
  ],
  relatedTopics: [
    "form-builder",
    "modal-component",
    "toast-notification-system",
    "component-libraries-and-design-systems",
  ],
};

export default function ReusableButtonSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a production-grade, reusable Button component system for a
          large-scale React application. The button system must serve as the foundational
          interactive element across the entire application — forms, modals, navigation
          bars, data tables, and action panels all rely on it. The component must support
          multiple visual variants (primary, secondary, tertiary/ghost, danger, link), a
          range of sizes (xs through xl), several interaction states (default, hover,
          active, focus, disabled, loading), icon placement (leading, trailing, icon-only),
          full-width and auto-width layouts, and compound grouping for button bars. It must
          also support polymorphic rendering via the <code>as</code> prop, allowing the
          same component to render as a native <code>&lt;button&gt;</code>, an
          <code>&lt;a&gt;</code> tag, or a framework-specific router link (e.g.,
          Next.js <code>Link</code>). Accessibility is non-negotiable: focus rings must be
          visible, loading states must announce to screen readers via <code>aria-busy</code>,
          disabled states must use <code>aria-disabled</code>, and non-button elements
          acting as buttons must carry <code>role=&quot;button&quot;</code>. An optional,
          configurable ripple animation on click provides tactile visual feedback. The
          system must be fully type-safe with TypeScript, exposing interfaces for
          <code>ButtonVariant</code>, <code>ButtonSize</code>, <code>ButtonState</code>,
          and <code>ButtonProps</code>.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA using TailwindCSS 4 for styling.
          </li>
          <li>
            The button system will be used across hundreds of components, so API stability
            and backward compatibility are critical.
          </li>
          <li>
            Loading states may involve async operations (form submissions, API calls) that
            take anywhere from 200ms to several seconds.
          </li>
          <li>
            The application supports both light and dark mode.
          </li>
          <li>
            Icon-only buttons (e.g., toolbar actions) must remain accessible via
            <code>aria-label</code>.
          </li>
          <li>
            Button groups may share borders (adjacent buttons in a horizontal bar) and
            need coordinated styling to avoid double-width borders.
          </li>
          <li>
            Ripple animation is optional and should be toggled via a prop or global config,
            not forced on all buttons.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Variants:</strong> Support five visual variants — primary (solid
            filled, high emphasis), secondary (outlined, medium emphasis),
            tertiary/ghost (transparent background, low emphasis), danger (red-toned for
            destructive actions), and link (underlined text, minimal visual weight).
          </li>
          <li>
            <strong>Sizes:</strong> Support five sizes — xs (extra small, for dense
            interfaces), sm (small), md (medium, default), lg (large), and xl (extra
            large, for hero CTAs).
          </li>
          <li>
            <strong>States:</strong> Render correctly in default, hover, active (pressed),
            focus (keyboard navigation), disabled (non-interactive), and loading (spinner
            + disabled interaction) states.
          </li>
          <li>
            <strong>Loading state:</strong> When <code>loading</code> prop is true,
            display an animated spinner, disable user interaction, and optionally show
            &quot;Loading...&quot; or a custom loading text.
          </li>
          <li>
            <strong>Icon support:</strong> Accept leading icon (before text), trailing icon
            (after text), and icon-only mode (no text, requires <code>aria-label</code>).
          </li>
          <li>
            <strong>Full-width vs auto-width:</strong> Support <code>fullWidth</code> prop
            to make the button stretch to container width. Default is auto-width (shrink
            to content).
          </li>
          <li>
            <strong>Compound ButtonGroup:</strong> Provide a <code>ButtonGroup</code>
            compound component that renders grouped buttons with shared borders, rounded
            corners only on outer edges, and horizontal/vertical orientation.
          </li>
          <li>
            <strong>Polymorphic as prop:</strong> Support the <code>as</code> prop to
            render the button as any valid HTML element or React component (e.g.,
            <code>&lt;a&gt;</code>, Next.js <code>Link</code>, <code>&lt;div&gt;</code>).
            Ref forwarding must work correctly for the rendered element.
          </li>
          <li>
            <strong>Ripple animation:</strong> Optional click ripple effect, configurable
            via <code>ripple</code> prop. Uses CSS custom properties for positioning and
            cleans up DOM nodes on unmount.
          </li>
          <li>
            <strong>Accessibility:</strong> Visible focus ring for keyboard users,
            <code>aria-busy=&quot;true&quot;</code> during loading,
            <code>aria-disabled=&quot;true&quot;</code> for disabled state,
            <code>role=&quot;button&quot;</code> for non-button elements, and
            <code>aria-label</code> for icon-only buttons.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Ripple animation must not cause layout thrashing.
            Use <code>transform</code> and <code>opacity</code> for GPU-composited
            animations. Loading spinner must animate at 60fps.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support. Props must adapt based
            on the <code>as</code> prop — if <code>as=&quot;a&quot;</code>, anchor-specific
            props (e.g., <code>href</code>, <code>target</code>) must be available.
          </li>
          <li>
            <strong>Bundle Size:</strong> The button component should be tree-shakeable.
            Unused variants and utilities should not bloat the bundle.
          </li>
          <li>
            <strong>Theming:</strong> Support light/dark mode via Tailwind&apos;s
            <code>dark:</code> variant. Colors must meet WCAG AA contrast ratios.
          </li>
          <li>
            <strong>Composability:</strong> Individual modules (styles, types, hooks,
            ripple) should be independently importable for consumers who need partial
            functionality.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Button with both <code>disabled</code> and <code>loading</code> props — which
            takes precedence? (Answer: disabled takes precedence; loading spinner is not
            shown.)
          </li>
          <li>
            Icon-only button without <code>aria-label</code> — should warn in development
            mode via console warning.
          </li>
          <li>
            Polymorphic button rendered as <code>&lt;a&gt;</code> without
            <code>href</code> — should warn, as this creates an inaccessible link.
          </li>
          <li>
            Ripple animation triggered while button is unmounting — must not attempt to
            write to unmounted DOM node.
          </li>
          <li>
            Button inside a scrollable container with <code>overflow: hidden</code> —
            ripple may be clipped. Must work correctly within clipping parents.
          </li>
          <li>
            Rapid clicking during loading state — must not fire <code>onClick</code>
            multiple times even if the loading prop is delayed.
          </li>
          <li>
            ButtonGroup with mixed variants — adjacent buttons may have different visual
            styles. Shared border styling must not produce visual artifacts.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to build a <strong>polymorphic, variant-driven Button
          component</strong> that delegates styling to a style map (Tailwind class
          compositions keyed by variant and size), uses custom hooks for interaction
          handling (debounce, keyboard events, ripple trigger) and ARIA attribute
          computation, and supports compound components via React&apos;s context API for
          the ButtonGroup. The component is not stateful in the traditional sense — it
          is a presentational component that receives props and delegates behavior to
          hooks. This keeps the component thin and testable.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>CSS-in-JS (styled-components, Emotion):</strong> Provides dynamic
            theming and runtime style computation. However, it adds a runtime dependency,
            increases bundle size, and introduces style recalculation on every render.
            For a button component with a finite set of variants, static Tailwind class
            maps are more performant and tree-shakeable.
          </li>
          <li>
            <strong>Component variants via class variance authority (CVA):</strong> CVA is
            an excellent library for variant management. For this implementation, we use
            a plain TypeScript style map to avoid an external dependency, but the structure
            is intentionally designed to be CVA-compatible if the team adopts it later.
          </li>
          <li>
            <strong>Separate components per variant (PrimaryButton, SecondaryButton, etc.):</strong>
            Simpler API per variant but leads to code duplication, inconsistent APIs, and
            harder maintenance. A single polymorphic component with a <code>variant</code>
            prop is the cleanest approach for a design system.
          </li>
        </ul>
        <p>
          <strong>Why polymorphic + style map + hooks is optimal:</strong> The polymorphic
          <code>as</code> prop (following the pattern popularized by Radix UI and
          styled-components) allows a single component to serve as button, link, or any
          element. The style map centralizes all Tailwind class compositions in one file,
          making it easy to audit contrast ratios and update design tokens. Custom hooks
          encapsulate interaction logic (debounce, ARIA, ripple) so the component remains
          a pure render function. This separation of concerns makes the system testable,
          composable, and maintainable at scale.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Type Definitions (<code>button-types.ts</code>)</h4>
          <p>
            Defines the core type system: <code>ButtonVariant</code> union
            (<code>primary | secondary | tertiary | danger | link</code>),
            <code>ButtonSize</code> union (<code>xs | sm | md | lg | xl</code>),
            <code>ButtonState</code> union (<code>default | hover | active | focus | disabled | loading</code>),
            and the polymorphic <code>ButtonProps</code> interface using component props
            inference. Also exports <code>PolymorphicRef</code> for correct ref typing
            with the <code>as</code> prop. See the Example tab for the complete type
            definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Style Maps (<code>button-styles.ts</code>)</h4>
          <p>
            Contains the variant-to-Tailwind-class mappings. Each variant has classes for
            base styling, hover state, active state, focus ring, disabled state, and
            loading state. Size maps control padding, font size, min-height, and icon
            dimensions. The structure is <code>{`{ variant: { base, hover, active, focus, disabled, loading } }`}</code>.
            Size maps follow <code>{`{ size: { padding, fontSize, minHeight, iconSize } }`}</code>.
            This is the single source of truth for visual appearance. See the
            Example tab for the complete style maps.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Ripple Effect (<code>ripple-effect.ts</code>)</h4>
          <p>
            Pure utility function that creates a ripple DOM node at the click position,
            sets CSS custom properties (<code>--ripple-x</code>, <code>--ripple-y</code>)
            for positioning, and returns a cleanup function. The ripple element uses CSS
            animations (scale + opacity fade) and auto-removes from the DOM after the
            animation completes. No React state is involved — this is a DOM-level
            operation for performance.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Interaction Hook (<code>use-button-interactions.ts</code>)</h4>
          <p>
            Custom hook that wraps the <code>onClick</code> handler with loading-state
            guarding (prevents clicks during loading), optional debounce, keyboard event
            handling (Enter and Space activation for non-button elements), and ripple
            trigger integration. Returns a merged handler object with
            <code>onClick</code>, <code>onMouseDown</code>, <code>onKeyDown</code>, and
            a <code>ref</code> callback for ripple container access.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. ARIA Hook (<code>use-button-aria.ts</code>)</h4>
          <p>
            Custom hook that computes ARIA attributes based on button state. Returns
            <code>aria-busy</code> (true when loading), <code>aria-disabled</code> (true
            when disabled or loading), <code>role</code> (only if rendered element is not
            a native button), and <code>aria-label</code> validation for icon-only mode.
            See the Example tab for the implementation.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Button Component (<code>button.tsx</code>)</h4>
          <p>
            The main polymorphic component. Uses <code>React.forwardRef</code> with
            generic typing for the <code>as</code> prop. Resolves variant and size to
            Tailwind classes via the style map. Renders leading icon, trailing icon,
            spinner (when loading), children text, and ripple container. Delegates
            interaction handling to <code>useButtonInteractions</code> and ARIA computation
            to <code>useButtonAria</code>. See the Example tab for the complete component.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Supporting Components</h4>
          <p>
            <strong>ButtonIcon (<code>button-icon.tsx</code>):</strong> Renders the icon
            slot. When loading, swaps the icon for a spinner with a smooth crossfade.
          </p>
          <p className="mt-3">
            <strong>ButtonSpinner (<code>button-spinner.tsx</code>):</strong> Animated
            SVG spinner with configurable size and color. Uses CSS animation for the
            spinning arc, with a determinate/indeterminate mode.
          </p>
          <p className="mt-3">
            <strong>ButtonGroup (<code>button-group.tsx</code>):</strong> Compound
            component that renders a flex container with Button context. Child buttons
            receive context-aware classes for shared borders (removing outer border-radius
            on inner buttons, adding border between adjacent buttons). Supports horizontal
            and vertical orientation.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The Button component is primarily presentational — it receives props and renders.
          State is minimal and localized: the ripple effect manages its own DOM nodes, the
          loading state is controlled externally (parent sets <code>loading</code> prop),
          and the ButtonGroup uses React context to distribute positional information
          (first, last, middle, only) to child buttons for border styling. This keeps the
          component pure and predictable.
        </p>
        <p>
          The interaction hook manages a debounce timer internally (via
          <code>useRef</code>), but this is an implementation detail — the component does
          not expose debounce state. The ARIA hook is purely computational with no state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Parent renders <code>{`<Button variant="primary" loading={isSubmitting}>Save</Button>`}</code>.
          </li>
          <li>
            Button resolves variant to Tailwind classes from the style map.
          </li>
          <li>
            <code>useButtonAria</code> computes <code>aria-busy=&quot;true&quot;</code>
            and <code>aria-disabled=&quot;true&quot;</code> since loading is true.
          </li>
          <li>
            <code>useButtonInteractions</code> wraps <code>onClick</code> — if loading or
            disabled, the handler returns early without invoking the original callback.
          </li>
          <li>
            Button renders: leading icon (if any), spinner (since loading=true), text
            content (or loading text), trailing icon (if any).
          </li>
          <li>
            User clicks — handler returns early due to loading guard. No action fires.
          </li>
          <li>
            Parent sets <code>loading={false}</code> after async operation completes.
          </li>
          <li>
            Button re-renders without spinner, with normal text. Click handler is now
            active. User clicks, ripple animation triggers at click coordinates,
            <code>onClick</code> fires.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional pattern: props flow into the
          Button component, hooks compute derived values (ARIA attributes, merged
          event handlers), and the rendered output is a pure function of props and
          derived state. No internal state mutations trigger re-renders except for
          ripple DOM manipulation (which is outside React&apos;s render cycle).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Disabled + loading:</strong> The component checks
            <code>disabled</code> first. If true, <code>loading</code> is ignored — no
            spinner renders, <code>aria-busy</code> is not set. This prevents conflicting
            ARIA states.
          </li>
          <li>
            <strong>Icon-only without aria-label:</strong> In development mode
            (<code>process.env.NODE_ENV !== &apos;production&apos;</code>), a console
            warning fires if <code>children</code> is absent and <code>aria-label</code>
            is not provided. This catches accessibility regressions early.
          </li>
          <li>
            <strong>Polymorphic as=&quot;a&quot; without href:</strong> Development warning
            fires. The rendered element is an anchor without an href, which browsers treat
            as a placeholder link. Screen readers announce it as &quot;clickable&quot; but
            with no destination — confusing for users.
          </li>
          <li>
            <strong>Ripple during unmount:</strong> The ripple utility&apos;s cleanup
            function is called in a <code>useEffect</code> cleanup. If the button unmounts
            mid-animation, the ripple DOM node is removed as part of the parent&apos;s
            unmount, preventing orphaned elements.
          </li>
          <li>
            <strong>ButtonGroup border sharing:</strong> The ButtonGroup context assigns
            each child a position (<code>first | middle | last | only</code>). CSS classes
            remove <code>border-radius</code> on inner buttons and add a shared border
            between adjacent buttons. The last button gets right rounded corners, the first
            gets left rounded corners.
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
            The complete, production-ready implementation consists of 10 files:
            TypeScript interfaces and polymorphic ref types, variant-based Tailwind style
            maps, ripple animation utility, interaction hook with debounce and keyboard
            handling, ARIA computation hook, polymorphic Button component, ButtonIcon
            with spinner swap, ButtonSpinner with SVG animation, ButtonGroup compound
            component, and a full EXPLANATION.md walkthrough. Click the{" "}
            <strong>Example</strong> toggle at the top of the article to view all source
            files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Type Definitions (button-types.ts)</h3>
        <p>
          Defines <code>ButtonVariant</code> as a union of five string literals,
          <code>ButtonSize</code> as five size levels, and <code>ButtonProps</code> as a
          polymorphic interface using <code>React.ComponentPropsWithoutRef</code> and
          <code>React.ComponentPropsWithRef</code> conditional on the <code>as</code>
          prop. The <code>PolymorphicRef</code> type ensures refs are correctly typed
          for the rendered element. Constants for default values (default variant is
          &quot;primary&quot;, default size is &quot;md&quot;) are exported for consumers
          who need them.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Style Maps (button-styles.ts)</h3>
        <p>
          A nested object maps each variant to its Tailwind class strings. The structure
          is <code>{`{ variant: { base, hover, active, focus, disabled, loading } }`}</code>.
          Size maps follow <code>{`{ size: { padding, fontSize, minHeight, iconSize } }`}</code>.
          This centralized approach means design token updates (e.g., changing the primary
          color) happen in one file. All classes use Tailwind&apos;s dark mode variants
          (e.g., <code>dark:bg-blue-700</code>) for theme support.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Ripple Effect (ripple-effect.ts)</h3>
        <p>
          A pure function that accepts a container element and a MouseEvent, creates a
          <code>&lt;span&gt;</code> element positioned at the click coordinates via CSS
          custom properties (<code>--ripple-x</code>, <code>--ripple-y</code>), appends
          it to the container, and returns a cleanup function. The ripple uses CSS
          <code>@keyframes</code> for a scale(0) to scale(4) expansion with opacity
          fade from 0.35 to 0. The element self-removes after the animation completes
          (600ms), providing a safety net if the cleanup function is not called.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Interaction Hook (use-button-interactions.ts)</h3>
        <p>
          Accepts <code>onClick</code>, <code>loading</code>, <code>disabled</code>,
          <code>ripple</code>, and <code>debounceMs</code> props. Returns merged event
          handlers. The <code>onClick</code> wrapper checks loading/disabled guards first,
          triggers ripple if enabled, and applies debounce via <code>setTimeout</code>
          with cleanup. The <code>onKeyDown</code> handler activates the button on Enter
          and Space for non-button elements (preventing default Space scroll behavior).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: ARIA Hook (use-button-aria.ts)</h3>
        <p>
          Computes <code>aria-busy</code> (true when loading and not disabled),
          <code>aria-disabled</code> (true when disabled or loading), <code>role</code>
          (only set to &quot;button&quot; if the rendered element is not a native
          <code>&lt;button&gt;</code>), and validates <code>aria-label</code> for
          icon-only mode. Returns an object suitable for spreading onto the rendered
          element.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Button Component (button.tsx)</h3>
        <p>
          Uses <code>React.forwardRef</code> with a generic <code>as</code> prop typed
          via <code>React.ElementType</code>. Resolves the component via
          <code>as || &apos;button&apos;</code>. Computes the Tailwind class string by
          merging base variant classes, size classes, <code>fullWidth</code> classes,
          and any user-provided <code>className</code>. Renders children wrapped in a
          flex container with icons and spinner. The ripple container is an absolutely
          positioned <code>&lt;span&gt;</code> with <code>pointer-events: none</code>
          and <code>overflow: hidden</code>.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: ButtonIcon (button-icon.tsx)</h3>
        <p>
          Renders the icon in a flex-shrink-none slot. When the parent button is loading,
          it crossfades the icon to a <code>ButtonSpinner</code> component. The transition
          uses CSS opacity for a smooth swap without layout shift.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: ButtonSpinner (button-spinner.tsx)</h3>
        <p>
          An inline SVG spinner using a circular arc (<code>stroke-dasharray</code>) with
          CSS <code>animation: spin</code> for rotation. Accepts <code>size</code> and
          <code>color</code> props to match the button&apos;s size variant and current
          theme color. The spinner is aria-hidden since the button&apos;s
          <code>aria-busy</code> already communicates the loading state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: ButtonGroup (button-group.tsx)</h3>
        <p>
          A compound component using React context. Renders a flex container with
          <code>orientation</code> (horizontal or vertical). Clones each child button
          via <code>React.Children.map</code> and <code>React.cloneElement</code>,
          injecting a <code>position</code> prop (<code>first | middle | last | only</code>)
          used for border-radius and shared border styling. The context also propagates
          the parent&apos;s <code>variant</code> and <code>size</code> as defaults for
          children that don&apos;t specify their own.
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
                <td className="p-2">Variant class resolution</td>
                <td className="p-2">O(1) — object lookup</td>
                <td className="p-2">O(1) — constant class string</td>
              </tr>
              <tr>
                <td className="p-2">Ripple creation</td>
                <td className="p-2">O(1) — single DOM node</td>
                <td className="p-2">O(1) — auto-cleans after 600ms</td>
              </tr>
              <tr>
                <td className="p-2">ARIA computation</td>
                <td className="p-2">O(1) — boolean checks</td>
                <td className="p-2">O(1) — small object</td>
              </tr>
              <tr>
                <td className="p-2">ButtonGroup child cloning</td>
                <td className="p-2">O(n) — n children</td>
                <td className="p-2">O(n) — cloned elements</td>
              </tr>
              <tr>
                <td className="p-2">Debounce timer</td>
                <td className="p-2">O(1) — single setTimeout</td>
                <td className="p-2">O(1) — ref-stored ID</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          All operations are constant time except ButtonGroup cloning, which scales
          linearly with the number of child buttons. In practice, button groups rarely
          exceed 5-7 items, so this is not a bottleneck.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Ripple DOM accumulation:</strong> If rapid clicks occur faster than
            the 600ms animation duration, ripple elements accumulate. Mitigation: the
            ripple utility caps concurrent ripples per button at 5. Older ripples are
            forcibly removed when the cap is reached.
          </li>
          <li>
            <strong>ButtonGroup cloneElement:</strong> <code>React.cloneElement</code>
            creates a new React element on every render. For large groups, this causes
            unnecessary allocations. Mitigation: use <code>React.memo</code> on the
            ButtonGroup wrapper and ensure child buttons are memoized.
          </li>
          <li>
            <strong>Tailwind class string concatenation:</strong> Merging multiple class
            strings (variant + size + fullWidth + custom className) on every render is
            a micro-optimization target. Mitigation: use <code>useMemo</code> to memoize
            the computed class string, recalculating only when variant, size, or fullWidth
            changes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>useMemo for class computation:</strong> Wrap the Tailwind class string
            computation in <code>useMemo</code> with dependencies on
            <code>[variant, size, fullWidth, className]</code>. This prevents redundant
            string concatenation on parent re-renders.
          </li>
          <li>
            <strong>React.memo on Button:</strong> Wrap the Button export in
            <code>React.memo</code> with a custom comparator that shallow-compares props.
            This prevents re-renders when parent re-renders but button props are unchanged.
          </li>
          <li>
            <strong>CSS animation for ripple and spinner:</strong> Both use
            <code>transform</code> and <code>opacity</code> — GPU-composited properties
            that run on the compositor thread. No JavaScript animation frames are consumed.
          </li>
          <li>
            <strong>Tree-shaking:</strong> All modules use named exports. Unused variants
            and hooks are eliminated by bundlers during tree-shaking. The style map can
            be further optimized by using dynamic imports if bundle size is critical.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Button children can be arbitrary React nodes, including user-generated content.
          If children contain unsanitized HTML (e.g., via <code>dangerouslySetInnerHTML</code>
          in a parent component), they become XSS vectors. The Button component itself
          does not render raw HTML — it renders children as React nodes, which React
          automatically escapes. However, if the <code>as</code> prop renders an anchor
          with a user-controlled <code>href</code>, it must be validated to prevent
          <code>javascript:</code> URI schemes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Native <code>&lt;button&gt;</code> elements are automatically focusable
              and activatable via Enter and Space. No additional work is needed.
            </li>
            <li>
              When rendered as a non-button element (e.g., <code>as=&quot;div&quot;</code>),
              the component adds <code>tabIndex={0}</code> and handles Enter/Space via
              the <code>onKeyDown</code> handler, preventing default Space scroll behavior.
            </li>
            <li>
              The focus ring uses <code>focus-visible</code> (not <code>focus</code>) to
              show the ring only for keyboard navigation, hiding it for mouse clicks.
              This follows the CSS <code>:focus-visible</code> pseudo-class behavior.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              Loading buttons set <code>aria-busy=&quot;true&quot;</code> to signal that
              an operation is in progress. Screen readers announce this as &quot;busy&quot;
              or &quot;loading&quot;.
            </li>
            <li>
              Disabled buttons set <code>aria-disabled=&quot;true&quot;</code>. Note that
              the native <code>disabled</code> attribute removes the element from the tab
              order entirely. Using <code>aria-disabled</code> keeps it focusable while
              indicating non-interactivity — the component uses the native
              <code>disabled</code> attribute for true disabled state.
            </li>
            <li>
              Icon-only buttons require <code>aria-label</code>. Without it, screen readers
              announce nothing (or the SVG markup). The development warning catches this
              at build time.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <p>
            Native <code>&lt;button&gt;</code> elements have implicit
            <code>role=&quot;button&quot;</code>. When the component renders as a
            non-button element (e.g., <code>as=&quot;div&quot;</code> or
            <code>as=&quot;a&quot;</code>), the <code>useButtonAria</code> hook adds
            <code>role=&quot;button&quot;</code> explicitly. The
            <code>aria-busy</code> and <code>aria-disabled</code> attributes are
            computed dynamically based on the loading and disabled props. See the
            Example tab for the exact attribute computation.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Href Validation for Anchor Buttons</h3>
        <ul className="space-y-2">
          <li>
            When <code>as=&quot;a&quot;</code>, the component validates that
            <code>href</code> is provided. If not, a development warning fires.
          </li>
          <li>
            User-controlled <code>href</code> values are checked against a allowlist of
            protocols (<code>http:</code>, <code>https:</code>, <code>mailto:</code>,
            <code>tel:</code>, relative paths). <code>javascript:</code> URIs are blocked
            with a warning.
          </li>
          <li>
            External links (different origin) automatically get
            <code>rel=&quot;noopener noreferrer&quot;</code> to prevent reverse tabnabbing.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Variant rendering:</strong> For each variant (primary, secondary,
            tertiary, danger, link), render the Button and assert the correct Tailwind
            class string is present in the className.
          </li>
          <li>
            <strong>Size rendering:</strong> For each size (xs, sm, md, lg, xl), assert
            the correct padding, font-size, and min-height classes are applied.
          </li>
          <li>
            <strong>Loading state:</strong> Render with <code>loading={true}</code>,
            assert spinner is present, assert <code>aria-busy=&quot;true&quot;</code>,
            assert click handler is NOT called on click.
          </li>
          <li>
            <strong>Disabled state:</strong> Render with <code>disabled={true}</code>,
            assert <code>aria-disabled=&quot;true&quot;</code>, assert click handler is
            NOT called, assert button has native <code>disabled</code> attribute.
          </li>
          <li>
            <strong>Polymorphic rendering:</strong> Render with <code>as=&quot;a&quot;</code>
            and <code>href</code>, assert the rendered element is an anchor. Render with
            <code>{`as={Link}`}</code> (Next.js), assert it renders the Link component.
          </li>
          <li>
            <strong>Icon rendering:</strong> Render with leadingIcon, trailingIcon, and
            icon-only mode. Assert icons are present in the correct slots.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Click flow with loading:</strong> Click button, assert onClick fires,
            parent sets <code>loading={true}</code>, assert spinner appears, click again
            during loading, assert onClick does NOT fire, parent sets
            <code>loading={false}</code>, assert spinner disappears, click again, assert
            onClick fires.
          </li>
          <li>
            <strong>Ripple animation:</strong> Click button with <code>ripple={true}</code>,
            assert ripple element is created in the DOM, wait 600ms, assert ripple element
            is removed.
          </li>
          <li>
            <strong>ButtonGroup rendering:</strong> Render a ButtonGroup with 3 children,
            assert first child has left rounded corners, middle child has no rounded
            corners, last child has right rounded corners, assert shared borders between
            adjacent buttons.
          </li>
          <li>
            <strong>Keyboard activation:</strong> Focus a non-button element
            (<code>as=&quot;div&quot;</code>), press Enter, assert onClick fires. Press
            Space, assert onClick fires and page does NOT scroll.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Icon-only button without <code>aria-label</code>: verify console warning
            fires in development mode.
          </li>
          <li>
            Anchor button without <code>href</code>: verify console warning fires.
          </li>
          <li>
            Rapid-fire 20 clicks: verify onClick fires only once (or once per debounce
            interval), ripple cap prevents more than 5 concurrent ripples.
          </li>
          <li>
            Accessibility: run axe-core automated checks, verify focus ring visibility,
            aria-busy during loading, aria-disabled for disabled state, and screen reader
            announcement of icon-only buttons with aria-label.
          </li>
          <li>
            SSR rendering: verify Button renders correctly during SSR (no window/document
            access in render path). Ripple creation must be guarded by
            <code>typeof window !== &apos;undefined&apos;</code>.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Not handling loading + click guarding:</strong> Candidates often render
            a spinner during loading but forget to prevent the <code>onClick</code> handler
            from firing. This leads to duplicate form submissions. The loading state must
            act as a guard on the click handler, not just a visual indicator.
          </li>
          <li>
            <strong>Using focus instead of focus-visible:</strong> A visible focus ring on
            every click (mouse users) is a poor UX pattern. Interviewers look for
            candidates who know the difference between <code>:focus</code> and
            <code>:focus-visible</code> and apply the ring only for keyboard navigation.
          </li>
          <li>
            <strong>Forgetting icon-only accessibility:</strong> A button with only an
            icon and no <code>aria-label</code> is invisible to screen readers. This is
            one of the most common accessibility bugs in production. Candidates should
            proactively mention the <code>aria-label</code> requirement.
          </li>
          <li>
            <strong>Animating ripple with top/left instead of transform:</strong>
            Positioning the ripple via <code>top</code> and <code>left</code> during
            animation triggers layout recalculations. The correct approach uses CSS custom
            properties for initial position and <code>transform: scale()</code> for the
            expansion animation.
          </li>
          <li>
            <strong>Not supporting polymorphic rendering:</strong> A button component that
            only renders <code>&lt;button&gt;</code> forces consumers to create separate
            link-styled-as-button components. The <code>as</code> prop pattern is the
            industry standard for design system buttons.
          </li>
          <li>
            <strong>ButtonGroup with independent buttons:</strong> Rendering grouped
            buttons without coordinated border styling produces double-width borders and
            inconsistent rounded corners. The compound component pattern with context is
            the correct solution.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Style Map vs CSS-in-JS vs CVA</h4>
          <p>
            A plain TypeScript style map (our approach) has zero runtime cost, is
            tree-shakeable, and works seamlessly with Tailwind&aposs compile-time class
            detection. CSS-in-JS (styled-components, Emotion) provides dynamic theming but
            adds runtime overhead and bundle size. CVA (class-variance-authority) is a
            purpose-built library for variant management with excellent TypeScript support
            but introduces a dependency. For a button with a fixed set of variants, a
            style map is the simplest correct answer. CVA is the answer if the team already
            uses it. CSS-in-JS is overkill for this use case.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Native disabled vs aria-disabled</h4>
          <p>
            The native <code>disabled</code> attribute removes the element from the tab
            order and prevents all interaction. <code>aria-disabled</code> keeps the element
            focusable but signals non-interactivity to assistive technology. For form
            submission buttons, native <code>disabled</code> is correct — you don&apos;t
            want users focusing a disabled submit button. For action buttons where the user
            needs to understand why the button is inactive (e.g., form validation errors),
            <code>aria-disabled</code> with a tooltip explaining the reason is better UX.
            Our component uses native <code>disabled</code> for the disabled prop and adds
            <code>aria-disabled</code> for the loading state.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Ripple: CSS animation vs JavaScript animation</h4>
          <p>
            CSS animations (<code>{"@keyframes"}</code>) run on the compositor thread,
            independent of JavaScript. This means the main thread is free to handle other
            work (event handling, state updates). JavaScript animation libraries
            (GSAP, Framer Motion) offer more control (easing curves, spring physics) but
            consume main thread time. For a simple scale + opacity ripple, CSS animations
            are the right choice — they&aposre lighter, require no library dependency, and
            provide smooth 60fps animations.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">cloneElement vs Render Props for ButtonGroup</h4>
          <p>
            <code>React.cloneElement</code> allows ButtonGroup to inject props (position,
            shared variant) into children transparently. The alternative is a render prop
            pattern where children receive context via a function. cloneElement provides a
            cleaner JSX API (<code>&lt;ButtonGroup&gt;&lt;Button /&gt;&lt;/ButtonGroup&gt;</code>)
            but couples ButtonGroup to its children&aposs implementation. Render props are
            more flexible but more verbose. For a button group where children are always
            Button components, cloneElement is the pragmatic choice. React 19&apos;s
            context API improvements may shift this trade-off in the future.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add a confirmation dialog to a destructive (danger) button?
            </p>
            <p className="mt-2 text-sm">
              A: Wrap the danger button in a <code>ConfirmButton</code> higher-order
              component or compose it with a modal. On click, intercept the
              <code>onClick</code> handler, show a confirmation modal with the action
              description, and only invoke the original <code>onClick</code> if the user
              confirms. The modal should have its own focus trap and Escape-to-dismiss
              behavior. For a lighter-weight approach, use a popover tooltip with
              &quot;Confirm&quot; and &quot;Cancel&quot; actions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support custom theme colors without modifying the style map?
            </p>
            <p className="mt-2 text-sm">
              A: Accept a <code>color</code> prop that overrides the variant&apos;s default
              color. The style map would include a <code>custom</code> variant that uses
              CSS custom properties (<code>--btn-bg</code>, <code>--btn-hover-bg</code>,
              etc.) set via inline styles. This allows runtime theming without recompiling
              Tailwind classes. Alternatively, use Tailwind&aposs CSS variable support
              (e.g., <code>bg-[var(--btn-bg)]</code>) and define variables in a theme
              provider.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle internationalization (i18n) for loading text?
            </p>
            <p className="mt-2 text-sm">
              A: Accept a <code>loadingText</code> prop that defaults to &quot;Loading...&quot;.
              The consumer provides the translated string via their i18n library
              (e.g., <code>loadingText={`{t('button.loading')}`}</code>). For a design
              system used across multiple apps, the default should be empty (show only
              the spinner), letting consumers decide whether to show text. This avoids
              baking a specific language into the component.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add keyboard shortcuts (e.g., Ctrl+S triggers a save button)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>shortcut</code> prop accepting a key combination string
              (e.g., <code>&quot;ctrl+s&quot;</code>). Use a global keyboard event listener
              (via a custom hook like <code>useKeyboardShortcut</code>) that matches the
              pressed keys against the shortcut string. When matched, programmatically
              trigger the button&apos;s <code>click()</code> method via ref. Display the
              shortcut as a hint in the button UI (e.g., <code>Save Ctrl+S</code>).
              Ensure the shortcut only fires when the button is visible and not disabled.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test the ripple animation in automated tests?
            </p>
            <p className="mt-2 text-sm">
              A: In unit tests, mock <code>document.createElement</code> and assert that
              a span with the ripple class is created with the correct CSS custom properties.
              In integration tests (Playwright), fire a click event, assert the ripple
              element exists in the DOM with an active CSS animation, advance time by
              600ms, assert the element is removed. For visual regression, use screenshot
              comparison at 100ms intervals during the animation to verify the ripple
              expands correctly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What if the button needs to show progress percentage (e.g., file upload)?
            </p>
            <p className="mt-2 text-sm">
              A: Extend the loading state to support a <code>progress</code> prop
              (0-100). Replace the indeterminate spinner with a determinate progress bar
              (a filled div with width = progress%). The button text shows
              something like &quot;Uploading 45%&quot;. Set <code>aria-busy=&quot;true&quot;</code>
              and add <code>aria-valuenow</code>, <code>aria-valuemin=&quot;0&quot;</code>,
              <code>aria-valuemax=&quot;100&quot;</code> for screen reader progress
              announcements. The role becomes <code>progressbar</code> during loading.
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
              href="https://www.radix-ui.com/themes/docs/components/button"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Radix UI — Polymorphic Component Pattern
            </a>
          </li>
          <li>
            <a
              href="https://tailwindcss.com/docs"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TailwindCSS — Utility-First CSS Framework Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/button/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Button Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://css-tricks.com/ripple-click-buttons/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CSS-Tricks — Material Design Ripple Effect with CSS
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WCAG 2.1 — Contrast Ratio Requirements (AA/AAA)
            </a>
          </li>
          <li>
            <a
              href="https://cva.style/docs"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Class Variance Authority (CVA) — Type-Safe Component Variants
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
