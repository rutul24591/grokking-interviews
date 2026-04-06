"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-tooltip-system",
  title: "Design a Tooltip System",
  description:
    "Complete LLD solution for a production-grade tooltip system with 12-position placement, auto-flip boundary collision, delay management, portal rendering, rich content, and full accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "tooltip-system",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "tooltip",
    "positioning",
    "accessibility",
    "portal",
    "delay-management",
    "state-management",
  ],
  relatedTopics: [
    "context-menu",
    "modal-component",
    "popover-component",
    "dropdown-menu",
  ],
};

export default function TooltipSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable tooltip system for a large-scale React
          application. The system must display small contextual information bubbles
          when users interact with trigger elements via hover, focus, or touch. Tooltips
          must position themselves intelligently around the trigger element — supporting
          12 placement options (top, bottom, left, right each with start, center, and end
          variants) — and automatically flip to an alternative position when the preferred
          placement would extend beyond the viewport boundary. The system must support
          configurable show and hide delays to prevent flicker during quick mouse passes,
          render via React Portal to escape overflow constraints of parent elements, and
          announce content to screen readers for full accessibility compliance. Only one
          tooltip may be visible globally at any time.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features.
          </li>
          <li>
            Tooltips are triggered by hover (mouse enter/leave), focus (focusin/focusout),
            and touch (long-press on mobile devices).
          </li>
          <li>
            Default show delay is 300ms, hide delay is 100ms — both configurable per tooltip.
          </li>
          <li>
            Only one tooltip can be open at a time globally. Opening a new tooltip immediately
            closes any existing one.
          </li>
          <li>
            Tooltip content supports plain text, formatted text with rich markup, small images,
            and keyboard shortcut hints.
          </li>
          <li>
            Each tooltip has a triangular arrow pointing toward the trigger element.
          </li>
          <li>
            The system supports both controlled mode (external show/hide state) and uncontrolled
            mode (internal hover/focus management).
          </li>
          <li>
            The application runs in both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Trigger Events:</strong> Tooltips activate on mouse enter (show) and
            mouse leave (hide), focusin (show) and focusout (hide), and long-press touch
            events on mobile (approximately 500ms press).
          </li>
          <li>
            <strong>12-Position Placement:</strong> Each tooltip supports top, bottom,
            left, and right placements, each with start, center, and end variants
            (e.g., top-start, top-center, top-end).
          </li>
          <li>
            <strong>Auto-Flip on Boundary Collision:</strong> If the preferred placement
            would overflow the viewport, the system automatically flips to the opposite
            side (top becomes bottom, left becomes right) and recalculates position.
          </li>
          <li>
            <strong>Show/Hide Delay:</strong> A 300ms show delay prevents tooltips from
            appearing during brief cursor passes. A 100ms hide delay prevents flicker when
            the cursor briefly leaves and re-enters the trigger area.
          </li>
          <li>
            <strong>Portal Rendering:</strong> Tooltip content renders through a React
            Portal attached to document.body, escaping any overflow:hidden or z-index
            constraints of ancestor elements.
          </li>
          <li>
            <strong>Rich Content:</strong> Tooltips support plain text, formatted text with
            inline styling, small thumbnail images, and keyboard shortcut badges.
          </li>
          <li>
            <strong>Arrow Indicator:</strong> A triangular arrow on the tooltip bubble points
            toward the trigger element, positioned to align with the trigger center.
          </li>
          <li>
            <strong>Controlled vs Uncontrolled:</strong> Consumers can pass an external
            <code>open</code> prop for full control, or omit it to let the system manage
            show/hide state internally based on user interactions.
          </li>
          <li>
            <strong>Global Singleton:</strong> Only one tooltip is visible at any time.
            Triggering a new tooltip immediately dismisses the currently open one.
          </li>
          <li>
            <strong>Animation:</strong> Tooltips fade in with a subtle scale-up (from 0.96
            to 1.0) and fade out with scale-down. Animation duration is approximately 150ms.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Position calculations must complete within a single
            animation frame (under 16ms). Layout reads (getBoundingClientRect) should be
            batched to avoid forced synchronous reflow.
          </li>
          <li>
            <strong>Scalability:</strong> The system should handle 200+ tooltip triggers on
            a single page without attaching expensive event listeners to each one. Event
            delegation is preferred.
          </li>
          <li>
            <strong>Accessibility:</strong> Tooltips must be announced to screen readers via
            <code>aria-describedby</code> linking the trigger to the tooltip content.
            Keyboard users must see tooltips on focus-visible. Touch users must see tooltips
            on long-press.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for placement types,
            configuration options, and content types.
          </li>
          <li>
            <strong>SSR Safety:</strong> Portal rendering and position calculations must
            only execute on the client. During SSR, tooltips produce no DOM output.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Trigger element is near the viewport edge — tooltip must flip and reposition
            without overflowing.
          </li>
          <li>
            User rapidly moves mouse across multiple tooltip triggers — only the final
            hovered trigger should show a tooltip after the show delay.
          </li>
          <li>
            Trigger element is removed from the DOM while its tooltip is visible — tooltip
            must dismiss cleanly without errors.
          </li>
          <li>
            Touch device: user long-presses to show tooltip, then taps elsewhere — tooltip
            must dismiss.
          </li>
          <li>
            Scroll events while tooltip is visible — tooltip must either reposition on scroll
            or dismiss (configurable behavior).
          </li>
          <li>
            Window resize while tooltip is open — tooltip must recalculate position or
            dismiss if the trigger is no longer in viewport.
          </li>
          <li>
            Trigger element is inside a scrollable container with overflow:hidden — the
            portal must escape this constraint.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate <strong>tooltip state management</strong> from
          <strong>tooltip positioning</strong> and <strong>tooltip rendering</strong> using
          a global Zustand store, a dedicated position engine, and a portal-based rendering
          strategy. The store manages which tooltip is currently active (only one at a time),
          handles show/hide delay queues, and exposes actions for showing and hiding tooltips.
          The position engine computes the optimal placement given the trigger element&apos;s
          bounding rectangle, the preferred placement, and the viewport dimensions. The
          rendering layer subscribes to the store, renders the active tooltip through a
          portal, and applies entrance/exit animations.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Context API + useReducer:</strong> Viable for a single-provider tooltip
            system but introduces coupling to the component tree. Every tooltip trigger would
            need to be a descendant of the provider. Zustand provides the same functionality
            with less boilerplate and allows imperative show/hide calls from anywhere in the
            application.
          </li>
          <li>
            <strong>CSS-only tooltips (title attribute):</strong> Native browser tooltips are
            inaccessible to screen readers, cannot be styled, do not support rich content,
            and offer no positioning control. Not suitable for production applications.
          </li>
          <li>
            <strong>Floating UI (formerly Popper.js) as a dependency:</strong> A mature
            library that handles positioning, auto-flip, and arrow placement. Using it reduces
            implementation effort significantly. However, in an LLD interview, candidates are
            expected to understand and implement the underlying positioning logic themselves
            to demonstrate depth of knowledge.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + Portal + Custom Position Engine is optimal:</strong> Zustand
          provides a lightweight global store with selector-based subscriptions. The portal
          ensures tooltips render outside the application&apos;s DOM subtree, avoiding
          overflow and z-index issues. A custom position engine demonstrates understanding of
          bounding-box geometry, viewport collision detection, and flip logic — all common
          interview discussion points.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of seven modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Tooltip Types (<code>tooltip-types.ts</code>)</h4>
          <p>
            Defines the <code>TooltipPlacement</code> union type with 12 values:
            <code>top-start</code>, <code>top-center</code>, <code>top-end</code>,
            <code>bottom-start</code>, <code>bottom-center</code>, <code>bottom-end</code>,
            <code>left-start</code>, <code>left-center</code>, <code>left-end</code>,
            <code>right-start</code>, <code>right-center</code>, <code>right-end</code>.
            The <code>TooltipConfig</code> interface includes showDelay (default 300ms),
            hideDelay (default 100ms), placement, disabled flag, and content type. The
            <code>TooltipState</code> interface tracks the active tooltip ID, trigger
            element reference, computed placement, and visibility state.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Tooltip Store (<code>tooltip-store.ts</code>)</h4>
          <p>
            Manages the global tooltip state using Zustand. Enforces the singleton constraint
            — only one tooltip can be active at any time. Exposes actions for showing a tooltip
            (with delay queueing), hiding a tooltip (with delay), and force-dismissing. The
            store integrates with the delay manager to schedule show and hide operations.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>activeTooltip: TooltipState | null</code> — currently active tooltip
            </li>
            <li>
              <code>isVisible: boolean</code> — whether the tooltip is currently rendered
            </li>
            <li>
              <code>pendingShow: string | null</code> — ID of a tooltip waiting for show delay
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Position Engine (<code>tooltip-position-engine.ts</code>)</h4>
          <p>
            Pure functions that compute tooltip position given the trigger bounding rectangle,
            the preferred placement, the tooltip dimensions, and the viewport dimensions.
            Returns the top/left coordinates for the tooltip, the computed placement (after
            auto-flip), and the arrow position. Handles all 12 placement variants and
            boundary collision detection with flip logic.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Delay Manager (<code>tooltip-delay-manager.ts</code>)</h4>
          <p>
            Manages show and hide delays using <code>setTimeout</code>. The show delay
            (300ms default) prevents tooltips from appearing during brief cursor passes. The
            hide delay (100ms default) prevents flicker when the cursor briefly leaves the
            trigger. The delay manager tracks pending timers, supports cancellation, and
            ensures that rapid hover changes do not cause multiple overlapping timers.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Trigger Hook (<code>use-tooltip-trigger.ts</code>)</h4>
          <p>
            Custom React hook that attaches mouse enter/leave, focus/blur, and touch event
            handlers to a trigger element. Integrates with the delay manager to schedule
            show/hide operations. Handles the controlled vs uncontrolled distinction — in
            controlled mode, events call the external <code>onOpenChange</code> callback;
            in uncontrolled mode, they dispatch directly to the store.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Visibility Hook (<code>use-tooltip-visibility.ts</code>)</h4>
          <p>
            Determines whether the tooltip should be rendered based on the store state and
            the trigger element&apos;s current presence in the DOM. Uses an IntersectionObserver
            to detect when the trigger scrolls out of view and automatically dismisses the
            tooltip.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">7. Portal Hook (<code>use-tooltip-portal.ts</code>)</h4>
          <p>
            Renders tooltip content via React Portal to <code>document.body</code>. Handles
            SSR safety by checking <code>typeof window</code> before creating the portal.
            Returns a container ref that the position engine uses to measure tooltip
            dimensions before positioning.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Positioning Algorithm</h3>
        <p>
          The position engine computes coordinates in three steps. First, it reads the
          trigger element&apos;s bounding rectangle via <code>getBoundingClientRect()</code>.
          Second, it calculates the tooltip&apos;s position based on the preferred placement
          — for example, <code>top-center</code> positions the tooltip above the trigger,
          horizontally centered. Third, it checks for viewport boundary collision: if the
          tooltip would overflow the viewport, it flips to the opposite placement (top becomes
          bottom) and recalculates. The arrow position is then computed to point at the
          trigger&apos;s center along the appropriate edge.
        </p>
        <p>
          For the 12 placement variants: the primary axis (top/bottom/left/right) determines
          which edge of the trigger the tooltip appears on. The secondary axis (start/center/end)
          determines alignment along that edge. For <code>top-start</code>, the tooltip aligns
          its left edge with the trigger&apos;s left edge. For <code>top-end</code>, the
          tooltip aligns its right edge with the trigger&apos;s right edge. For
          <code>top-center</code>, the tooltip centers horizontally on the trigger.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/tooltip-system-architecture.svg"
          alt="Tooltip system architecture showing position engine, delay management, and portal rendering"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            User hovers over a trigger element wrapped in <code>TooltipTrigger</code>.
          </li>
          <li>
            The <code>useTooltipTrigger</code> hook fires onMouseEnter, which calls the delay
            manager to schedule a show operation after 300ms.
          </li>
          <li>
            If the user leaves before 300ms, the timer is cancelled and no tooltip appears.
          </li>
          <li>
            After 300ms, the delay manager calls <code>tooltipStore.showTooltip()</code>.
          </li>
          <li>
            The store sets the active tooltip state with the trigger reference and preferred
            placement.
          </li>
          <li>
            The <code>TooltipContent</code> component subscribes to the store, renders via
            portal, and calls the position engine to compute coordinates.
          </li>
          <li>
            The tooltip renders with a fade-in + scale-up animation (150ms).
          </li>
          <li>
            User moves cursor away: onMouseLeave schedules a hide operation after 100ms.
          </li>
          <li>
            After 100ms, the store clears the active tooltip state, and TooltipContent
            renders a fade-out animation before unmounting.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional pattern. All state mutations flow
          through the Zustand store, and all rendering flows from store subscriptions.
          The delay manager acts as an intermediary between user events and store mutations,
          ensuring that rapid interactions are debounced correctly.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Rapid hover across multiple triggers:</strong> Each mouseEnter schedules
            a show timer. Each mouseLeave cancels the pending show timer for that trigger.
            Only the last-hovered trigger&apos;s timer completes, ensuring only one tooltip
            appears.
          </li>
          <li>
            <strong>Viewport boundary collision:</strong> The position engine checks if the
            computed tooltip rectangle exceeds viewport bounds. If it does, the primary
            placement flips (top to bottom, left to right). The secondary alignment (start,
            center, end) is preserved. If the flipped placement also collides, the tooltip
            falls back to the placement with the most available space.
          </li>
          <li>
            <strong>Trigger removal during tooltip visibility:</strong> The visibility hook
            uses a MutationObserver on the trigger element. If the element is removed from
            the DOM, the observer fires and the store force-dismisses the tooltip.
          </li>
          <li>
            <strong>SSR safety:</strong> The TooltipProvider uses a useEffect to confirm
            client-side mounting before registering any event listeners or creating portals.
            During SSR, the provider renders a null placeholder.
          </li>
          <li>
            <strong>Scroll handling:</strong> An IntersectionObserver on the trigger element
            detects when the trigger scrolls out of view. When the intersection ratio drops
            below a threshold (0.1), the tooltip dismisses. On scroll back into view, the
            user must re-trigger the tooltip — it does not auto-reappear.
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
            interfaces, Zustand store with singleton enforcement, position engine with 12
            placement calculations and auto-flip, delay manager with cancellable timers,
            three custom hooks (trigger, visibility, portal), three components (trigger
            wrapper, content bubble, app-level provider), and a full EXPLANATION.md
            walkthrough. Click the <strong>Example</strong> toggle at the top of the article
            to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Type Definitions (tooltip-types.ts)</h3>
        <p>
          Defines the <code>TooltipPlacement</code> union with 12 literal values covering
          all combinations of primary axis (top, bottom, left, right) and secondary alignment
          (start, center, end). The <code>TooltipConfig</code> interface specifies
          showDelay, hideDelay, placement, arrow visibility, and rich content type. The
          <code>TooltipState</code> interface tracks the active tooltip&apos;s trigger
          reference, content, computed placement, and arrow position. The
          <code>TooltipContentData</code> type supports plain string, ReactNode, or a
          structured object with title, description, image, and keyboard shortcut fields.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (tooltip-store.ts)</h3>
        <p>
          The store enforces the singleton constraint — setting a new active tooltip
          immediately clears any previously active one. It integrates with the delay manager
          for scheduled show/hide operations. The <code>showTooltip</code> action accepts
          a trigger ID, content, and config, computes the initial placement, and updates
          state. The <code>hideTooltip</code> action clears the active state. The store
          also exposes a <code>forceHide</code> action for external controlled usage.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Position Engine (tooltip-position-engine.ts)</h3>
        <p>
          The core positioning logic is a pure function: given a trigger DOMRect, preferred
          placement, tooltip dimensions, viewport dimensions, and arrow size, it returns
          the tooltip top/left coordinates, the resolved placement (after flip), and the
          arrow position. The function handles all 12 placements using a switch statement.
          Boundary collision detection checks each edge of the computed tooltip rectangle
          against the viewport. On collision, the primary axis flips and position is
          recalculated. Arrow positioning computes the offset along the tooltip edge that
          aligns with the trigger center.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Delay Manager (tooltip-delay-manager.ts)</h3>
        <p>
          Manages two independent timers per tooltip trigger: one for show delay and one
          for hide delay. The show timer (300ms default) is cancelled if the user leaves
          the trigger before it fires. The hide timer (100ms default) is cancelled if the
          user re-enters before it fires. The delay manager tracks pending timer IDs in a
          Map, provides clear methods for cleanup, and ensures that no two timers for the
          same trigger overlap.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Trigger Hook (use-tooltip-trigger.ts)</h3>
        <p>
          Custom hook that returns event handlers for onMouseEnter, onMouseLeave, onFocus,
          onBlur, onTouchStart, and onTouchEnd. Each handler integrates with the delay
          manager to schedule show/hide operations. In controlled mode, handlers call the
          external <code>onOpenChange</code> callback instead of dispatching to the store.
          The hook uses a ref to track the current trigger element and cleans up pending
          timers on unmount.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Visibility Hook (use-tooltip-visibility.ts)</h3>
        <p>
          Subscribes to the Zustand store to determine if the tooltip for a given trigger
          ref should be visible. Sets up an IntersectionObserver on the trigger element
          with a threshold of 0.1. When the trigger scrolls out of view (intersection
          ratio below threshold), the hook calls the store to dismiss the tooltip. Returns
          a boolean visibility flag and the computed placement for the consuming component.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Portal Hook (use-tooltip-portal.ts)</h3>
        <p>
          Creates a DOM container element for the tooltip on mount, appends it to
          <code>document.body</code>, and returns it for portal rendering. Checks
          <code>typeof window !== &quot;undefined&quot;</code> before creating the container
          to ensure SSR safety. Cleans up the container on unmount. The container receives
          inline styles for z-index (9999) and pointer-events (none, so the tooltip does
          not block underlying interactions).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: TooltipTrigger Component</h3>
        <p>
          Wrapper component that clones its child element and attaches the event handlers
          returned by <code>useTooltipTrigger</code>. Also attaches <code>aria-describedby</code>
          linking to the tooltip&apos;s generated ID for screen reader accessibility. Supports
          both controlled (<code>open</code>, <code>onOpenChange</code>) and uncontrolled
          usage. Renders the child as-is, adding only the necessary ARIA attributes and
          event handlers.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: TooltipContent Component</h3>
        <p>
          The tooltip bubble itself. Renders via portal, computes position via the position
          engine, and applies fade-in/scale-up or fade-out/scale-down CSS transitions.
          Includes a triangular SVG arrow positioned to point at the trigger element.
          Supports rich content rendering: plain text, formatted content with inline markup,
          thumbnail images, and keyboard shortcut badges. The component uses
          <code>useLayoutEffect</code> to measure tooltip dimensions after render and
          reposition if necessary (to account for dynamic content sizing).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: TooltipProvider Component</h3>
        <p>
          App-level provider that wraps the entire application. Ensures a single instance
          of the tooltip system is available globally. On mount, it registers global event
          listeners for Escape key (dismisses any open tooltip) and outside click (dismisses
          tooltip if click target is not a trigger element). Handles SSR safety by deferring
          all DOM-dependent setup to useEffect.
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
                <td className="p-2">Position calculation</td>
                <td className="p-2">O(1) — fixed math</td>
                <td className="p-2">O(1) — returns coordinates</td>
              </tr>
              <tr>
                <td className="p-2">Boundary collision check</td>
                <td className="p-2">O(1) — 4 edge comparisons</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">showTooltip / hideTooltip</td>
                <td className="p-2">O(1) — store update</td>
                <td className="p-2">O(1) — single active tooltip</td>
              </tr>
              <tr>
                <td className="p-2">Delay timer operations</td>
                <td className="p-2">O(1) — Map lookup</td>
                <td className="p-2">O(n) — n pending timers</td>
              </tr>
              <tr>
                <td className="p-2">IntersectionObserver</td>
                <td className="p-2">O(1) — native browser API</td>
                <td className="p-2">O(1) — one observer per trigger</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          All operations are O(1) because only one tooltip is active at any time. The
          position engine performs a fixed number of arithmetic operations regardless of
          page complexity. For pages with 200+ tooltip triggers, the only per-trigger
          overhead is the event handler attachment (handled efficiently by React&apos;s
          synthetic event delegation).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>getBoundingClientRect calls:</strong> Reading layout properties forces
            the browser to flush pending style and layout calculations, which can be
            expensive if done frequently. Mitigation: batch all reads together, cache
            results, and avoid interleaving reads with writes. The position engine performs
            all reads upfront before any DOM writes.
          </li>
          <li>
            <strong>Scroll repositioning:</strong> Repositioning the tooltip on every scroll
            event is a performance anti-pattern. Mitigation: use IntersectionObserver instead
            of scroll event listeners. The observer fires only when the trigger&apos;s
            visibility changes, not on every scroll tick.
          </li>
          <li>
            <strong>Portal re-creation:</strong> Creating and destroying the portal container
            on every tooltip show/hide adds DOM manipulation overhead. Mitigation: maintain
            a single persistent portal container that is reused across tooltip show/hide
            cycles. Only the content inside changes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>ResizeObserver for tooltip dimensions:</strong> Instead of measuring
            tooltip size via getBoundingClientRect after render (which may trigger reflow),
            use a ResizeObserver on the tooltip content element. This fires asynchronously
            and does not block layout.
          </li>
          <li>
            <strong>CSS containment:</strong> Apply <code>contain: layout style paint</code>
            to the tooltip container to tell the browser that the tooltip&apos;s layout is
            independent of the rest of the page. This reduces the scope of layout
            recalculations.
          </li>
          <li>
            <strong>Animation via CSS transitions:</strong> Use CSS transitions on transform
            and opacity (GPU-composited properties) rather than JavaScript-driven animations.
            This keeps animation work on the compositor thread, independent of the main
            thread&apos;s JavaScript execution.
          </li>
          <li>
            <strong>Event delegation for triggers:</strong> Instead of attaching individual
            event listeners to each trigger element, attach a single listener at the provider
            level and use event.target matching. This reduces memory usage on pages with
            hundreds of triggers.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Tooltip content may originate from server responses or user input (e.g.,
          descriptions, help text). If rendered as HTML via <code>dangerouslySetInnerHTML</code>
          or custom React nodes, tooltips become XSS vectors. Always sanitize HTML content
          before rendering. Prefer rendering strings as plain text content, which React
          escapes by default. Only allow rich React nodes from trusted internal sources.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The trigger element receives <code>aria-describedby</code> pointing to the
              tooltip content element&apos;s ID. This creates an implicit association so
              screen readers announce the tooltip content when the trigger receives focus.
            </li>
            <li>
              The tooltip content element has <code>role=&quot;tooltip&quot;</code> and a
              unique <code>id</code> attribute that matches the trigger&apos;s
              <code>aria-describedby</code> value.
            </li>
            <li>
              For keyboard users, the tooltip appears on <code>focus-visible</code> (not
              just focus), ensuring that mouse users navigating via tab do not see
              unexpected tooltips.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Tooltips are not interactive elements — they are informational. Therefore,
              the tooltip content itself should not be focusable (<code>tabindex=&quot;-1&quot;</code>).
            </li>
            <li>
              Pressing <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Escape</kbd>
              dismisses any open tooltip (handled by the TooltipProvider).
            </li>
            <li>
              The trigger element must be keyboard-focusable. If the trigger is a
              non-interactive element (e.g., a span), it should receive
              <code>tabindex=&quot;0&quot;</code>.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Touch Accessibility</h4>
          <p>
            On touch devices, tooltips appear after a long-press (approximately 500ms).
            Tapping elsewhere dismisses the tooltip. The tooltip must not block the
            underlying element&apos;s tap action — it should appear on long-press but the
            user should still be able to activate the trigger with a normal tap. Tooltips
            on touch should include a longer show delay (500ms) to distinguish between
            a tap and a long-press.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rate limiting:</strong> Cap tooltip show calls at 20 per second per
            trigger to prevent abuse from buggy event loops or malicious scripts.
          </li>
          <li>
            <strong>Content sanitization:</strong> Strip script tags, event handler
            attributes (onclick, onerror), and javascript: URLs from tooltip content
            before rendering.
          </li>
          <li>
            <strong>Z-index containment:</strong> The tooltip portal renders at a fixed
            z-index (9999). Ensure this does not override higher-priority UI elements
            like modals or dialogs (which typically render at z-index 10000+).
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Position engine:</strong> Test all 12 placements with a fixed trigger
            rectangle and viewport. Verify computed coordinates match expected values. Test
            auto-flip: place trigger at top edge with preferred placement &quot;top-center&quot;,
            verify the engine returns &quot;bottom-center&quot;. Test arrow positioning for
            each placement variant.
          </li>
          <li>
            <strong>Delay manager:</strong> Test that show timer fires after 300ms, that
            clearing before 300ms prevents the callback, and that rapid show/hide cycles
            result in only the final timer completing. Test hide delay similarly.
          </li>
          <li>
            <strong>Store actions:</strong> Test that showTooltip sets active state, that
            calling showTooltip again replaces the previous active tooltip (singleton
            enforcement), and that hideTooltip clears state.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Full tooltip lifecycle:</strong> Render TooltipProvider + TooltipTrigger
            + TooltipContent. Fire mouseEnter on trigger, advance timers by 300ms, assert
            tooltip is rendered in the portal container. Fire mouseLeave, advance timers by
            100ms, assert tooltip is removed.
          </li>
          <li>
            <strong>Positioning in DOM:</strong> Render a trigger near the top edge of the
            viewport with preferred placement &quot;top-center&quot;. Fire mouseEnter,
            advance timers, assert the tooltip renders below the trigger (auto-flipped to
            bottom-center) by checking its computed style.
          </li>
          <li>
            <strong>Accessibility:</strong> Verify the trigger has aria-describedby pointing
            to the tooltip ID. Verify the tooltip has role=&quot;tooltip&quot; and matching
            ID. Test keyboard focus triggers tooltip visibility. Test Escape key dismisses it.
          </li>
          <li>
            <strong>Portal rendering:</strong> Assert the tooltip renders as a direct child
            of document.body, not nested inside the trigger&apos;s component tree.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Rapid hover across 10 triggers in 500ms: verify only the last trigger&apos;s
            tooltip appears.
          </li>
          <li>
            Trigger element removed from DOM while tooltip is visible: verify tooltip
            dismisses without throwing.
          </li>
          <li>
            Window resize while tooltip is open: verify tooltip repositions or dismisses.
          </li>
          <li>
            SSR rendering: verify TooltipProvider returns null placeholder during SSR and
            mounts correctly on hydration.
          </li>
          <li>
            Accessibility: run axe-core automated checks on rendered tooltips, verify
            aria-describedby linkage, role attributes, and keyboard dismiss.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Not using a portal:</strong> Candidates often render tooltips inline
            within the trigger component. This breaks when the trigger is inside an
            overflow:hidden container (common in modals, sidebars, tables). Interviewers
            expect candidates to identify the portal pattern as essential.
          </li>
          <li>
            <strong>Skipping delay management:</strong> Without show/hide delays, tooltips
            flicker on every cursor movement. Candidates who mention delay (even if they
            do not implement it) demonstrate awareness of UX considerations.
          </li>
          <li>
            <strong>Hardcoding position instead of computing:</strong> Some candidates place
            tooltips at a fixed offset from the trigger without considering viewport
            boundaries. Interviewers look for candidates who discuss boundary detection
            and auto-flip logic.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> Tooltips that are invisible to screen
            readers fail WCAG requirements. Candidates must mention aria-describedby linkage
            and keyboard accessibility.
          </li>
          <li>
            <strong>Allowing multiple simultaneous tooltips:</strong> Without a singleton
            constraint, multiple tooltips can overlap and create a confusing experience.
            Interviewers expect candidates to discuss global state management for tooltips.
          </li>
          <li>
            <strong>Animating layout properties:</strong> Animating top or left instead of
            transform triggers expensive layout recalculations. Candidates should know to
            animate only transform and opacity.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Custom Position Engine vs Floating UI (Popper.js)</h4>
          <p>
            Building a custom position engine demonstrates deep understanding of bounding-box
            geometry, viewport collision detection, and flip logic. However, Floating UI
            (the successor to Popper.js) is a battle-tested library that handles edge cases
            (virtual elements, middleware pipelines, GPU-accelerated transforms) far better
            than a custom implementation. In production, use Floating UI. In an interview,
            implement the core logic yourself to show you understand it, then mention that
            you would use Floating UI in a real application.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Singleton vs Multiple Simultaneous Tooltips</h4>
          <p>
            The singleton approach (one tooltip at a time) is the standard UX pattern — it
            matches user expectations and prevents visual clutter. Multiple simultaneous
            tooltips could be justified in specific scenarios (e.g., comparing two elements
            side by side), but this adds significant complexity in positioning, z-index
            management, and interaction conflict resolution. For 99 percent of applications,
            singleton is the right choice.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Event Delegation vs Per-Trigger Listeners</h4>
          <p>
            Attaching event listeners to each trigger element is simple but does not scale
            well to hundreds of triggers (memory overhead, attachment cost). Event delegation
            at the provider level is more efficient but requires careful target matching and
            does not work well with React&apos;s synthetic event system (which already uses
            delegation internally). For React applications, per-trigger listeners via the
            hook are acceptable because React&apos;s synthetic event system shares a single
            native listener per event type at the root.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">IntersectionObserver vs Scroll Event Listener</h4>
          <p>
            Listening to scroll events and repositioning the tooltip on every scroll tick
            is a performance anti-pattern — scroll events fire at 60+ Hz and each
            repositioning call triggers layout reads. IntersectionObserver fires only when
            the trigger&apos;s visibility crosses a threshold, reducing the number of
            repositioning calls by orders of magnitude. The trade-off is that
            IntersectionObserver does not tell you the exact scroll offset — only whether
            the element is in view. For tooltips, this is sufficient: dismiss when out of
            view, do not attempt to follow the element during scroll.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle tooltips for dynamically rendered elements (e.g.,
              virtualized lists)?
            </p>
            <p className="mt-2 text-sm">
              A: In virtualized lists, elements are mounted and unmounted as the user scrolls.
              The tooltip trigger wrapper should use a stable key (not the array index) so
              that React preserves the trigger component across re-renders. The IntersectionObserver
              should be recreated when the trigger element changes. Additionally, the position
              engine should use the scroll container&apos;s bounding box instead of the
              viewport for collision detection, since the trigger may be inside a scrollable
              container.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement tooltip animations without CSS transitions?
            </p>
            <p className="mt-2 text-sm">
              A: Use Framer Motion&apos;s <code>AnimatePresence</code> and <code>motion.div</code>
              with initial/animate/exit variants. The initial state sets opacity to 0 and
              scale to 0.96. The animate state sets opacity to 1 and scale to 1.0. The exit
              state reverses. Framer Motion handles the transition lifecycle, including
              waiting for the exit animation to complete before unmounting. The trade-off is
              bundle size — Framer Motion adds approximately 30 KB, whereas CSS transitions
              are free.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you support tooltips that follow the cursor (e.g., color pickers)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>followCursor</code> flag to the TooltipConfig. When enabled,
              attach a mousemove listener to the trigger element that continuously updates
              the tooltip position to the cursor coordinates plus a fixed offset. Use
              requestAnimationFrame to throttle position updates to 60fps. The tooltip
              placement property is ignored in this mode — the tooltip always appears at
              the cursor position with a slight offset to avoid occlusion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add tooltip groups (e.g., a cluster of related icons that
              share one tooltip)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a <code>group</code> field to the TooltipConfig. When any element in
              the group is hovered, the tooltip shows content for the entire group,
              highlighting the currently hovered element. The tooltip position is computed
              relative to the group&apos;s bounding box, not the individual element. This
              is useful for toolbars where a group of icons shares a contextual tooltip
              with navigation (left/right arrows to cycle through group members).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test tooltip positioning in CI?
            </p>
            <p className="mt-2 text-sm">
              A: Use Playwright with a fixed viewport size (e.g., 1280x720). Render triggers
              at known positions (top-left, center, bottom-right) and assert the tooltip
              renders at the expected coordinates via getBoundingClientRect on the tooltip
              element. For auto-flip testing, place a trigger near the viewport edge and
              assert the tooltip appears on the opposite side. For visual regression, use
              Percy or Chromatic to capture screenshots and compare against baselines.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle the tooltip when the page zooms (browser zoom
              at 150 percent)?
            </p>
            <p className="mt-2 text-sm">
              A: Browser zoom changes the CSS pixel ratio, which affects getBoundingClientRect
              values. The position engine works in CSS pixels, so it naturally handles zoom
              — the bounding rect values are already in zoom-adjusted coordinates. The
              tooltip renders in the same coordinate space. The only consideration is that
              at high zoom levels, the tooltip may not fit in the viewport even with
              auto-flip. In this case, the tooltip should clamp its maximum width and enable
              internal scrolling for overflowing content.
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
              href="https://floating-ui.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Floating UI — Positioning Engine (Successor to Popper.js)
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Tooltip Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://zustand.docs.pmnd.rs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zustand — State Management Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Intersection Observer API
            </a>
          </li>
          <li>
            <a
              href="https://react.dev/reference/react-dom/createPortal"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Documentation — createPortal
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WCAG 2.1 — Content on Hover or Focus (1.4.13)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
