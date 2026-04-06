"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-rating-stars-component",
  title: "Design a Rating / Stars Component with Keyboard Interaction and ARIA",
  description:
    "Complete LLD solution for a production-grade Rating/Stars component with half-star support, keyboard navigation, ARIA slider role, hover preview, fractional rendering, and full accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "rating-stars-component",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "rating",
    "stars",
    "accessibility",
    "aria",
    "keyboard-navigation",
    "svg",
    "interaction-design",
  ],
  relatedTopics: [
    "modal-component",
    "form-builder",
    "rich-text-editor",
    "theme-theming-system",
  ],
};

export default function RatingStarsComponentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable Rating/Stars component for a large-scale React
          application. The component must display and capture user ratings as a sequence
          of star icons that can be filled, half-filled, or empty. Users should be able
          to interact with the component via mouse click, hover preview, and keyboard
          navigation. The component must support both interactive mode (user can set a
          rating) and read-only mode (displays a fractional rating such as 3.7 out of
          5). It must be fully accessible: screen readers must announce the current
          rating, keyboard users must be able to adjust it with arrow keys, and the
          component must expose proper ARIA attributes including role, value range, and
          human-readable value text.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with TypeScript strict mode enabled.
          </li>
          <li>
            The default maximum rating is 5 stars, but the component should support
            configurable max values (e.g., 10 stars).
          </li>
          <li>
            Ratings support half-star increments (0.5 steps). Values like 3.5 are valid;
            values like 3.3 round to the nearest 0.5.
          </li>
          <li>
            The component supports three size variants: small (16px), medium (24px), and
            large (32px) star icons.
          </li>
          <li>
            Colors for filled, empty, and hover states are customizable via props.
          </li>
          <li>
            The application may run in both light and dark mode.
          </li>
          <li>
            The component must work without JavaScript for read-only display (static SVG
            rendering), but interactive features require client-side hydration.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Star Rendering:</strong> Render N star icons (default 5) where each
            star can be in one of three states: filled, half-filled, or empty.
          </li>
          <li>
            <strong>Half-Star Support:</strong> Detect mouse position within a star
            element to determine whether the user intends a full (1.0) or half (0.5)
            rating for that star.
          </li>
          <li>
            <strong>Read-Only vs Interactive Mode:</strong> In read-only mode, stars
            display the rating without interaction handlers. In interactive mode, stars
            respond to click, hover, and keyboard events.
          </li>
          <li>
            <strong>Hover Preview:</strong> When the user hovers over stars, they light
            up to show what the rating would be if clicked. On mouse leave, stars revert
            to the currently selected value.
          </li>
          <li>
            <strong>Fractional Display:</strong> A rating of 3.7 renders as 3 full stars,
            1 partially filled star (at 70% fill via clip-path), and 1 empty star.
          </li>
          <li>
            <strong>Keyboard Interaction:</strong> ArrowRight/ArrowUp increases rating by
            0.5, ArrowLeft/ArrowDown decreases by 0.5, Home sets rating to 0, End sets
            rating to max.
          </li>
          <li>
            <strong>ARIA Support:</strong> The component uses role="slider" with
            aria-valuenow, aria-valuemin, aria-valuemax, and aria-valuetext (e.g., "3.5
            out of 5 stars").
          </li>
          <li>
            <strong>Size Variants:</strong> Support sm (16px), md (24px), lg (32px) via
            a size prop that scales the SVG icons.
          </li>
          <li>
            <strong>Color Customization:</strong> Allow custom colors for filled stars,
            empty stars, and hover state.
          </li>
          <li>
            <strong>Optional Label:</strong> Display a text label such as "3.5 out of 5
            stars" below the stars.
          </li>
          <li>
            <strong>Animation:</strong> Smooth fill animation on selection via CSS
            transitions. Hover transitions for star color changes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Hover and keyboard interactions must not cause
            visible jank. Use CSS transitions on color and clip-path for GPU-accelerated
            rendering.
          </li>
          <li>
            <strong>Accessibility:</strong> The component must pass WCAG 2.1 AA
            requirements for keyboard navigation, screen reader support, and focus
            visibility.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for rating values, size
            variants, color configuration, and event callbacks.
          </li>
          <li>
            <strong>Reusability:</strong> The component should be usable across the
            application with zero configuration (sensible defaults) while supporting
            extensive customization via props.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Rating value of 0: all stars empty, aria-valuetext reads "0 out of 5 stars".
          </li>
          <li>
            Fractional values that do not align to 0.5 (e.g., 3.7) must round to nearest
            0.5 for interactive mode, but display accurately in read-only mode.
          </li>
          <li>
            Mouse hover at the exact boundary of a star (50% position) — must consistently
            resolve to half-fill.
          </li>
          <li>
            Rapid keyboard input: holding ArrowRight should not cause the rating to exceed
            max; boundary enforcement is required.
          </li>
          <li>
            Component used inside a form with controlled value — external value changes
            must reflect immediately in star display.
          </li>
          <li>
            Touch devices: hover preview is not possible; tap should directly set the
            rating.
          </li>
          <li>
            Server-side rendering: read-only mode renders correctly during SSR;
            interactive features activate only after hydration.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>rating state management</strong> from
          the <strong>star rendering</strong>. The rating value and hover preview state
          are managed by a Zustand store, which exposes the current value, hover value,
          and actions (setValue, setHover, clearHover). Individual star icons are rendered
          by a dedicated component that receives its fill state (filled, half, empty) as
          props and renders the appropriate SVG. Interaction logic (mouse position
          detection, keyboard handling, ARIA generation) is encapsulated in custom hooks.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Local useState in component:</strong> Viable for simple use cases but
            becomes unwieldy when hover preview, keyboard handling, and ARIA generation
            all manage separate pieces of state. Extracting to hooks and a store keeps
            the component focused on rendering.
          </li>
          <li>
            <strong>Context API:</strong> Would work for sharing rating state across
            sub-components (StarIcon, RatingLabel, RatingDisplay) but introduces provider
            coupling. Since the Rating component is self-contained (no need to share
            state outside its tree), Zustand provides a cleaner API without provider
            wrapping.
          </li>
          <li>
            <strong>Radio group pattern:</strong> Using hidden radio inputs with visible
            star labels is a classic accessible pattern. However, it does not naturally
            support half-star values or fractional display. The ARIA slider role is a
            better fit for this component&apos;s requirements.
          </li>
        </ul>
        <p>
          <strong>Why Zustand + hooks + SVG clip-path is optimal:</strong> Zustand
          provides reactive state for the rating value and hover preview without provider
          overhead. Custom hooks encapsulate interaction logic (keyboard, mouse, ARIA)
          making them testable in isolation. SVG clip-path enables precise fractional
          fill rendering (e.g., 70% of a star filled) without needing multiple SVG
          assets or complex path math. This pattern is used by production rating
          components and provides the best balance of accessibility, performance, and
          visual fidelity.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Rating Types (<code>rating-types.ts</code>)</h4>
          <p>
            Defines the <code>RatingValue</code> type (number between 0 and max), the
            <code>RatingSize</code> union (<code>sm | md | lg</code>), and the
            <code>RatingConfig</code> interface containing max rating, size, colors,
            readOnly flag, and optional label. The <code>StarFillState</code> union
            represents the three visual states: <code>filled | half | empty</code>. See
            the Example tab for the complete type definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Rating Store (<code>rating-store.ts</code>)</h4>
          <p>
            Manages the rating value, hover preview value, and configuration using
            Zustand. Exposes actions for setting the rating, setting hover preview,
            clearing hover, and updating config. The store is parameterized — each
            RatingStars instance creates its own scoped store to support multiple rating
            components on the same page.
          </p>
          <p className="mt-3">
            <strong>State shape:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>value: number</code> — current rating value
            </li>
            <li>
              <code>hoverValue: number | null</code> — preview value during hover
            </li>
            <li>
              <code>config: RatingConfig</code> — max, size, colors, readOnly
            </li>
          </ul>
          <p className="mt-3">
            <strong>Actions:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-sm font-mono">
            <li>
              <code>setValue(value: number)</code> — sets rating, clamped to range
            </li>
            <li>
              <code>setHover(value: number | null)</code> — sets/clears hover preview
            </li>
            <li>
              <code>setConfig(config: Partial&lt;RatingConfig&gt;)</code> — updates config
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Star Path Data (<code>star-path-data.ts</code>)</h4>
          <p>
            Contains the SVG path data for filled and empty star shapes. The filled star
            is a standard 5-pointed star polygon. The empty star is the same path rendered
            as an outline (stroke only, no fill). Half-fill is achieved by rendering the
            filled star with a <code>clip-path</code> that clips at 50% width. Fractional
            fills (e.g., 70%) use dynamic clip-path rectangles computed at render time.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Hover Position Detection (<code>hover-position.ts</code>)</h4>
          <p>
            Pure function that takes a MouseEvent and the star element&apos;s bounding
            client rect, computes the horizontal position as a percentage of the element
            width, and returns 1.0 if the position is in the right half or 0.5 if in the
            left half. This enables half-star detection on mouse hover and click.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. Interaction Hook (<code>use-rating-interactions.ts</code>)</h4>
          <p>
            Custom React hook that wires up mouse move, mouse leave, click, and keyboard
            handlers. Manages local hover state, computes the effective display value
            (hover value if hovering, otherwise selected value), and dispatches updates
            to the Zustand store. Encapsulates all interaction logic so the rendering
            component stays clean.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. ARIA Hook (<code>use-rating-aria.ts</code>)</h4>
          <p>
            Custom hook that generates the complete set of ARIA attributes for the rating
            container: <code>role="slider"</code>, <code>aria-valuenow</code>,
            <code>aria-valuemin</code>, <code>aria-valuemax</code>, and
            <code>aria-valuetext</code> (human-readable string like "3.5 out of 5 stars").
            Also generates <code>aria-label</code> from an optional prop and
            <code>tabIndex</code> for keyboard focusability.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Component mounts with initial value (default 0) and config (max=5, size=md).
          </li>
          <li>
            Renders N StarIcon components. Each receives its index and the effective
            display value to compute its fill state.
          </li>
          <li>
            User hovers over star 3: hover position detection computes 0.5 or 1.0 based
            on mouse X position within the star element.
          </li>
          <li>
            Interaction hook sets hover value to 2.5 or 3.0 in the store.
          </li>
          <li>
            Store notifies subscribers. All StarIcon components re-render with updated
            fill states (stars 1-2 filled, star 3 half or full, stars 4-5 empty).
          </li>
          <li>
            User clicks star 3: interaction hook calls setValue(hoverValue).
          </li>
          <li>
            User moves mouse away: interaction hook clears hover value. Stars revert to
            showing the selected value.
          </li>
          <li>
            Keyboard user focuses the container and presses ArrowRight: value increments
            by 0.5, clamped to max.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional data flow pattern. User interactions
          (mouse, keyboard, touch) flow through custom hooks, which update the Zustand
          store. The store notifies subscribed components, which re-render with the new
          effective display value. StarIcon components are pure rendering functions — they
          receive fill state as props and render the appropriate SVG.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Star Fill State Computation</h3>
        <p>
          For each star at index <code>i</code> (0-based) and effective display value
          <code>v</code>:
        </p>
        <ul className="space-y-2">
          <li>
            If <code>i + 1 &lt;= v</code>: the star is fully filled (fill state =
            <code>filled</code>).
          </li>
          <li>
            If <code>i &lt; v &lt; i + 1</code>: the star is partially filled. The
            fractional amount is <code>v - i</code>. For interactive mode, this is always
            0.5 (half-fill). For read-only mode, this can be any value from 0 to 1
            (e.g., 0.7 for a 3.7 rating).
          </li>
          <li>
            If <code>v &lt;= i</code>: the star is empty (fill state =
            <code>empty</code>).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Rapid keyboard input:</strong> Each keypress increments/decrements by
            0.5. The store clamps the value to the range [0, max]. Holding a key triggers
            the browser&apos;s key repeat behavior, which naturally throttles updates to
            the OS-level repeat rate.
          </li>
          <li>
            <strong>Touch devices:</strong> The click handler uses the touch event&apos;s
            first touch point to compute position. Since there is no hover on touch, the
            tap directly sets the value without a preview phase.
          </li>
          <li>
            <strong>SSR safety:</strong> The RatingStars component renders read-only stars
            during SSR (no event handlers). Interactive features activate after hydration
            via a useEffect that sets a mounted flag.
          </li>
          <li>
            <strong>Multiple rating components:</strong> Each RatingStars instance uses
            its own Zustand store instance (created via a factory function) to avoid state
            collision when multiple rating components exist on the same page.
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
            interfaces, Zustand store, SVG star path data, hover position detection, two
            custom hooks (interactions and ARIA), four React components (main rating,
            star icon, label, display), and a full EXPLANATION.md walkthrough. Click the
            <strong> Example</strong> toggle at the top of the article to view all source
            files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Rating Types (rating-types.ts)</h3>
        <p>
          Defines <code>RatingSize</code> as a union type mapping to pixel dimensions
          (sm = 16px, md = 24px, lg = 32px). The <code>RatingColors</code> interface
          allows customization of filled, empty, and hover colors. The
          <code>RatingConfig</code> interface bundles max rating, size, colors, readOnly
          flag, and label text. The <code>StarFillState</code> union represents the three
          visual states of a star icon.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Zustand Store (rating-store.ts)</h3>
        <p>
          The store manages the rating value, hover preview, and configuration. Key design
          decisions include: using a factory function to create scoped store instances
          (supporting multiple rating components on one page), clamping values to the
          valid range [0, max] on every update, and clearing hover state on value change
          to prevent stale preview values persisting after selection.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Star Path Data (star-path-data.ts)</h3>
        <p>
          Exports the SVG path string for a standard 5-pointed star. The path is designed
          within a 24x24 viewBox and scales proportionally to any size. The filled version
          uses a solid fill color; the empty version uses the same path with stroke only.
          Half-fill uses a clip-path rectangle at 50% width. Fractional fills compute the
          clip rectangle width dynamically.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Hover Position (hover-position.ts)</h3>
        <p>
          A pure function that computes the fill value (0.5 or 1.0) from a mouse event.
          It reads the event&apos;s clientX, subtracts the element&apos;s left boundary,
          divides by the element width, and returns 1.0 if the ratio exceeds 0.5,
          otherwise 0.5. This simple geometric approach avoids complex hit-testing and
          works reliably across browsers.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: Interaction Hook (use-rating-interactions.ts)</h3>
        <p>
          Encapsulates all user interaction logic. Returns handlers for onMouseMove
          (computes hover value per star, updates store), onMouseLeave (clears hover),
          onClick (commits hover value to selected value), and onKeyDown (handles
          ArrowLeft/Right, Home, End). Also computes the effective display value — the
          hover value if actively hovering, otherwise the selected value.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: ARIA Hook (use-rating-aria.ts)</h3>
        <p>
          Generates ARIA attributes from the current value and config. Constructs
          <code>aria-valuetext</code> as a human-readable string (e.g., "3.5 out of 5
          stars"). Returns the complete attribute set: role, aria-valuenow, aria-valuemin,
          aria-valuemax, aria-valuetext, aria-label, tabIndex, and aria-disabled (for
          read-only mode).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Star Icon (star-icon.tsx)</h3>
        <p>
          Renders a single star SVG. Accepts fill state (filled, half, empty), size,
          colors, and event handlers. For half-fill, renders two overlapping stars: the
          bottom one in the empty color, the top one in the filled color with a clip-path
          at 50% width. For fractional fills (read-only mode), the clip-path width is
          computed dynamically. CSS transitions on the fill color provide smooth hover
          effects.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Rating Stars (rating-stars.tsx)</h3>
        <p>
          The main component. Initializes the Zustand store with config, renders N
          StarIcon components in a horizontal flex row, and wires up interaction handlers
          from the hook. Supports controlled mode (value prop + onChange callback) and
          uncontrolled mode (internal state). The container element receives ARIA
          attributes from the ARIA hook.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Rating Label (rating-label.tsx)</h3>
        <p>
          Optional text label component. Displays the human-readable rating (e.g., "3.5
          out of 5 stars") below the stars. Supports custom label text via prop. Uses
          screen-reader-only text variant for accessibility when the visual label is
          hidden.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 10: Rating Display (rating-display.tsx)</h3>
        <p>
          Read-only variant of the rating component. Renders stars without interaction
          handlers, supporting fractional fill values (e.g., 3.7). Used for displaying
          average ratings from server data. Simpler than the interactive version — no
          hover, keyboard, or ARIA slider role needed. Uses aria-label for screen reader
          announcement.
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
                <td className="p-2">setValue</td>
                <td className="p-2">O(1) — number assignment</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">setHover</td>
                <td className="p-2">O(1) — number assignment</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">hoverPosition</td>
                <td className="p-2">O(1) — arithmetic</td>
                <td className="p-2">O(1)</td>
              </tr>
              <tr>
                <td className="p-2">Star fill computation</td>
                <td className="p-2">O(n) — one per star</td>
                <td className="p-2">O(n) — n star elements</td>
              </tr>
              <tr>
                <td className="p-2">SVG clip-path render</td>
                <td className="p-2">O(1) — GPU composited</td>
                <td className="p-2">O(1) — single rect element</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the number of stars (typically 5). All operations are
          constant time or linear in the number of stars, which is bounded and small.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Re-render on every mouse move:</strong> The onMouseMove handler fires
            frequently as the cursor moves across stars. If every move triggers a store
            update and full re-render, it could cause jank. Mitigation: only update the
            store when the hover value actually changes (e.g., crossing the 50% boundary
            of a star), not on every pixel move.
          </li>
          <li>
            <strong>SVG clip-path on every star:</strong> Creating a new clip-path element
            for each fractional star triggers DOM mutations. Mitigation: define clip-paths
            in a shared SVG defs block and reference them by ID. For half-fill, a single
            predefined clip-path suffices.
          </li>
          <li>
            <strong>Zustand subscription overhead:</strong> If all StarIcon components
            subscribe to the entire store state, every value change re-renders all stars.
            Mitigation: use Zustand selectors to subscribe only to the effective display
            value, and memoize StarIcon with React.memo to skip re-renders when fill state
            is unchanged.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Throttled hover updates:</strong> Only dispatch setHover when the
            computed fill value (0.5 or 1.0 per star) actually changes, not on every
            mousemove event. This reduces store updates from potentially dozens per second
            to at most one per star boundary crossing.
          </li>
          <li>
            <strong>React.memo on StarIcon:</strong> Wrap StarIcon in React.memo with a
            custom equality check on fill state, color, and size props. This prevents
            unnecessary re-renders when the display value changes but a particular star&apos;s
            fill state is unchanged.
          </li>
          <li>
            <strong>CSS transitions over JS animation:</strong> Star color changes on
            hover use CSS <code>transition: fill 150ms ease</code>, which runs on the
            compositor thread. No requestAnimationFrame or JS animation loop needed.
          </li>
          <li>
            <strong>Shared SVG defs:</strong> Define clip-path rectangles once in a
            top-level SVG defs element and reference via <code>url(#clip-half)</code>.
            This avoids creating duplicate clip-path elements per star.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          The rating value is a number, so there is no XSS risk from the value itself.
          However, the optional label text is a string that may come from user input (e.g.,
          a custom rating category name). Always render label text as text content (React&apos;s
          default escaping) and never use dangerouslySetInnerHTML for label content.
          Color values should be validated against a whitelist of valid CSS color formats
          (hex, rgb, named colors) to prevent injection of malicious CSS expressions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              The rating container has <code>tabIndex={0}</code> and <code>role="slider"</code>,
              making it focusable and announcing its purpose to screen readers.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowRight</kbd> /
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowUp</kbd>{" "}
              increases the rating by 0.5.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowLeft</kbd> /
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">ArrowDown</kbd>{" "}
              decreases the rating by 0.5.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Home</kbd> sets
              rating to 0.
            </li>
            <li>
              <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">End</kbd> sets
              rating to max.
            </li>
            <li>
              A visible focus ring (2px outline with offset) indicates keyboard focus,
              styled via <code>:focus-visible</code> pseudo-class.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              <code>role="slider"</code> communicates that the component is an interactive
              range control.
            </li>
            <li>
              <code>aria-valuenow</code> provides the current numeric value.
            </li>
            <li>
              <code>aria-valuemin</code> and <code>aria-valuemax</code> define the valid
              range.
            </li>
            <li>
              <code>aria-valuetext</code> provides a human-readable announcement (e.g.,
              "3.5 out of 5 stars") that screen readers announce instead of the raw number.
            </li>
            <li>
              <code>aria-label</code> provides context (e.g., "Product rating") announced
              before the value.
            </li>
            <li>
              In read-only mode, <code>aria-disabled="true"</code> prevents screen readers
              from announcing the component as interactive.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Focus Management</h4>
          <p>
            The rating container uses <code>:focus-visible</code> to show a focus ring
            only for keyboard navigation (not mouse clicks). The focus ring uses a
            high-contrast color (e.g., blue outline on light background, yellow outline
            on dark background) to meet WCAG 2.1 AA contrast requirements. The ring is
            rendered as a 2px outline with 2px offset, ensuring it does not overlap the
            star icons.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Abuse Prevention</h3>
        <ul className="space-y-2">
          <li>
            <strong>Value clamping:</strong> The store clamps all rating values to the
            range [0, max]. This prevents out-of-range values from causing rendering bugs
            or ARIA inconsistencies.
          </li>
          <li>
            <strong>Rounding:</strong> Interactive mode rounds all values to the nearest
            0.5. This prevents fractional values like 3.333 from creating inconsistent
            visual states.
          </li>
        </ul>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Store actions:</strong> Test setValue clamps to range [0, max],
            setHover updates hoverValue, clearHover sets it to null. Verify that setValue
            clears hoverValue.
          </li>
          <li>
            <strong>Hover position:</strong> Test hoverPosition with mouse at 25% of star
            width (returns 0.5), at 75% (returns 1.0), and at exactly 50% (returns 0.5).
            Test edge cases: mouse at 0px and at full width.
          </li>
          <li>
            <strong>ARIA generation:</strong> Test useRatingAria with value=3.5, max=5
            returns correct aria-valuenow, aria-valuetext. Test with value=0, value=max.
          </li>
          <li>
            <strong>Star fill computation:</strong> Test that star at index 0 with value
            3.5 computes as filled, star at index 3 computes as half, star at index 4
            computes as empty.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Mouse interaction:</strong> Render RatingStars, fire mouseMove on star
            3 at 60% width, assert hover preview shows 3 full stars. Fire mouseLeave,
            assert stars revert to selected value. Fire click, assert value updates.
          </li>
          <li>
            <strong>Keyboard interaction:</strong> Focus container, fire keyDown with
            ArrowRight, assert value increases by 0.5. Fire Home, assert value is 0.
            Fire End, assert value is max.
          </li>
          <li>
            <strong>Half-star detection:</strong> Click star 2 at 30% width (left half),
            assert value is 1.5. Click at 70% width (right half), assert value is 2.0.
          </li>
          <li>
            <strong>Read-only mode:</strong> Render with readOnly=true, verify no click
            or hover handlers are attached, stars render correct fractional fill for value
            3.7.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            SSR rendering: verify read-only stars render correctly during SSR, interactive
            features activate after hydration.
          </li>
          <li>
            Value of 0: all stars empty, aria-valuetext reads "0 out of 5 stars".
          </li>
          <li>
            Value of max: all stars filled, aria-valuetext reads "5 out of 5 stars".
          </li>
          <li>
            Accessibility: run axe-core automated checks, verify role="slider",
            aria-*attributes, keyboard focus ring visibility, screen reader announcements.
          </li>
          <li>
            Touch device simulation: verify tap sets rating directly without hover preview.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Using radio buttons for half-star support:</strong> The classic
            accessible rating pattern uses hidden radio inputs with visible labels styled
            as stars. This works for integer ratings but breaks for half-stars because
            each half-star would need its own radio, doubling the inputs and complicating
            the tab order. Interviewers expect candidates to recognize this limitation and
            propose the ARIA slider pattern instead.
          </li>
          <li>
            <strong>Not handling hover preview state:</strong> Candidates often implement
            click-to-set but forget the hover preview phase, where stars light up as the
            cursor moves before the user clicks. This is a critical UX feature that
            distinguishes production-quality implementations.
          </li>
          <li>
            <strong>Incorrect half-star detection:</strong> Using the star index alone
            (e.g., "star 3 clicked means rating 3") instead of computing the mouse
            position within the star element. This misses the half-star capability
            entirely.
          </li>
          <li>
            <strong>Missing ARIA attributes:</strong> Rendering stars without role,
            aria-valuenow, or aria-valuetext means screen reader users cannot determine
            the current rating or interact with the component. This is a critical
            accessibility failure.
          </li>
          <li>
            <strong>Animating with JavaScript:</strong> Using requestAnimationFrame or
            state-based animation for star fill transitions causes jank. Interviewers
            look for candidates who know to use CSS transitions on color and clip-path
            for GPU-composited rendering.
          </li>
          <li>
            <strong>Not supporting fractional read-only display:</strong> The component
            must display average ratings like 3.7 accurately. Candidates who only support
            0.5 increments in both modes fail to address the read-only fractional rendering
            requirement.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">ARIA Slider vs Radio Group</h4>
          <p>
            The radio group pattern (hidden radios + visible star labels) is the most
            accessible pattern for integer ratings because it provides individual focusable
            elements per star and works without JavaScript. However, it does not support
            half-stars natively (you would need 10 radios for a 5-star half-step system)
            and the tab order becomes unwieldy. The ARIA slider role treats the entire
            rating as a single focusable control with keyboard-adjustable value, which
            naturally supports half-steps and fractional values. The trade-off is that the
            slider pattern requires JavaScript for interaction, while radio groups work
            with pure HTML. For a React SPA, the slider pattern is the better choice.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">SVG Clip-Path vs Multiple Path Assets</h4>
          <p>
            Half-star rendering can be achieved by either (a) using a clip-path rectangle
            at 50% width over a filled star, or (b) defining a separate SVG path for the
            left half of a star. The clip-path approach is simpler — one path, one clip
            rectangle — and scales to any fractional amount (not just 50%). The separate
            path approach requires precise path math to split the star shape and produces
            visual artifacts at the clip boundary if the paths do not align perfectly.
            Clip-path is the recommended approach for production systems.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Zustand Store vs Local State</h4>
          <p>
            For a single rating component, useState is perfectly adequate. However, when
            multiple rating components exist on the same page (e.g., a product review list
            where each review has its own rating), a shared store pattern provides
            consistent state management and makes it easier to add cross-cutting features
            (e.g., "rate all items" bulk action). Zustand&apos;s factory pattern for
            creating scoped store instances supports this without state collision. The
            trade-off is added complexity — for simple use cases, useState + hooks is
            simpler and has fewer dependencies.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add a "clear rating" feature (set back to 0)?
            </p>
            <p className="mt-2 text-sm">
              A: Add a clickable area to the left of the stars (an X icon or "Clear" text
              button). On click, call setValue(0). For keyboard users, add a separate
              focusable button before the rating container with aria-label="Clear rating".
              Alternatively, allow clicking the currently selected star again to deselect
              (toggle between current value and 0), but this changes the interaction model
              and may be surprising to users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle a rating system with 10 stars instead of 5?
            </p>
            <p className="mt-2 text-sm">
              A: The max value is configurable in RatingConfig. The store clamps to [0, max],
              the ARIA hook generates aria-valuemax from config, and the rendering loop
              creates max star elements. The interaction logic is unchanged — half-star
              detection, keyboard stepping by 0.5, and hover preview all work identically.
              The only consideration is visual density: 10 stars at lg size (32px) would
              be 320px wide, which may not fit on mobile screens. Consider responsive size
              scaling (sm on mobile, lg on desktop).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you display an average rating from thousands of user ratings?
            </p>
            <p className="mt-2 text-sm">
              A: Use the RatingDisplay component in read-only mode with the average value
              (e.g., 4.3). The component supports fractional fills via dynamic clip-path
              width, so 4.3 renders as 4 full stars and 1 star at 30% fill. Show the
              total count next to the stars (e.g., "4.3 (2,847 ratings)"). The average
              should be computed server-side and passed as a prop — the component does
              not compute aggregates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you prevent rating manipulation (e.g., bots submitting ratings)?
            </p>
            <p className="mt-2 text-sm">
              A: This is a backend concern, not a frontend one. The frontend component
              should enforce: (1) one rating per user per item, (2) rate limiting on the
              API call, (3) authentication requirement before rating. On the backend, use
              CAPTCHA, rate limiting, anomaly detection (e.g., flag accounts rating 100
              items in a minute), and require verified purchases for e-commerce contexts.
              The frontend component&apos;s role is to collect and transmit the rating
              value; abuse prevention happens at the API layer.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add emoji reactions alongside star ratings?
            </p>
            <p className="mt-2 text-sm">
              A: Add an optional <code>reactions</code> prop that renders emoji buttons
              below the stars (e.g., thumbs up, heart, fire). Each reaction is a separate
              interactive element with its own counter. Store reaction counts in a
              separate Zustand slice or a different store entirely. The rating value and
              reactions are conceptually separate — the rating is a scalar value, reactions
              are categorical counts. Visually, render them in a row below the stars with
              spacing. Accessibility: each reaction button has aria-label and aria-pressed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you animate the star fill on selection?
            </p>
            <p className="mt-2 text-sm">
              A: Use CSS transitions on the <code>fill</code> property with a duration of
              150-200ms and an ease-out timing function. For a more polished effect, add a
              scale bounce on the clicked star using CSS <code>transform: scale(1.2)</code>
              at 50% animation progress, settling back to scale(1). This can be achieved
              with a CSS @keyframes animation triggered by adding a class on click, removed
              after animation completes. Avoid JS-driven animations for this — CSS
              transitions are GPU-accelerated and simpler to maintain.
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
              href="https://www.w3.org/WAI/ARIA/apg/patterns/slider/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Slider Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — ARIA Slider Role Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/SVG2/masking.html#ClipPathProperty"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SVG 2 — Clip Path Specification
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
              href="https://web.dev/articles/accessible-multi-selectable"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Accessible Interactive Components
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/06/star-rating-accessibility/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Star Rating Component Accessibility
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
