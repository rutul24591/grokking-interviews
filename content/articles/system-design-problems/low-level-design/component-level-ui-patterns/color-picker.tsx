"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-color-picker",
  title: "Design a Color Picker Component",
  description:
    "Color picker with color space conversions, WCAG contrast engine, alpha support, saved palettes, Eyedropper API, and keyboard navigation.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "color-picker",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "color-picker", "alpha", "palettes", "contrast", "oklch", "eyedropper", "WCAG"],
  relatedTopics: ["theme-theming-system", "avatar-component", "rating-stars-component"],
};

export default function ColorPickerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h1>Design a Color Picker</h1>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Color Picker Component around semantic DOM, accessibility, controlled state, focus ownership, lifecycle cleanup, and reusable API governance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <p>Design a Color Picker is a low-level design problem about implementing pointer sampling, color-space conversion, channel editing, palette persistence, contrast evaluation, eyedropper permission, and keyboard adjustment. A principal-level interview answer must define ownership boundaries, browser and accessibility semantics, local data structures, lifecycle cleanup, server reconciliation, and explicit degraded behavior.</p>
        <p>Use one canonical color representation internally and derive HSV, HSL, RGB, hex, alpha, and contrast projections to prevent rounding drift across editors. The central structures are canonical RGBA value, hue position, saturation-value plane, alpha channel, parsed input draft, palette history, contrast target, and eyedropper capability. The implementation is not complete until cancellation, stale work, SSR behavior, privacy, metrics, and rollback are deliberate rather than incidental.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/color-picker-runtime.svg" alt="Design a Color Picker runtime flow" caption="Runtime flow: input becomes a guarded state transition, a semantic projection, and a recoverable outcome." />
      </section>
      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: one committed semantic state must drive ARIA attributes, keyboard behavior, callbacks, visual state, and cleanup effects.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Color Picker Component, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>The following deep dive preserves the component-specific mechanics and browser constraints that determine the implementation.</p>
        <p>
        A color picker is one of the most technically demanding UI components in a design
        system. It requires a working understanding of color spaces, gamut mapping,
        floating-point precision, WCAG contrast algorithms, pointer capture APIs, and
        canvas rendering — all wrapped in an accessible keyboard-navigable interface.
        Most developers have used a color picker but have never built one from scratch.
        A strong interview answer demonstrates depth in color theory, not just UI
        mechanics.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/color-picker-architecture.svg"
        alt="Color picker component architecture diagram"
        caption="Color picker architecture: color state, space conversions, contrast engine, accessibility and palette"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        The design space for a color picker spans from a simple hex input field to a
        full design tool panel with multiple color space modes, opacity control, and
        a color history. Establish scope with clarifying questions before diving into
        architecture.
      </p>
      <p>
        Does the picker need to support alpha (opacity)? Alpha is common in graphics
        tools but less common in design token editors where colors are always fully
        opaque. Alpha adds a fourth channel to all color representations and requires
        a separate alpha slider and a checkerboard background canvas to show transparency.
      </p>
      <p>
        Which color spaces must be supported? Most pickers offer at least hex/RGB and
        HSL. Modern design tools (Figma, Adobe) are adding oklch — the perceptually
        uniform color space in CSS Color Level 4 — because it produces more visually
        predictable gradient steps and gamut mappings than HSL. Supporting multiple
        spaces requires bidirectional conversion between all of them.
      </p>
      <p>
        Does the picker need to validate WCAG contrast? A design system color picker
        that also shows the contrast ratio of the selected color against a white or
        black background is significantly more useful for designers building accessible
        UIs. This requires implementing the WCAG contrast algorithm.
      </p>
      <p>
        Does it need the Eyedropper API? Chrome 95+ supports the native EyeDropper
        API, which allows the user to sample any pixel on screen. This is a
        progressive enhancement — offer it when available, fall back gracefully.
      </p>

      <h3>The Internal Color Representation</h3>
      <p>
        The most important architectural decision is what format to use for the internal
        (canonical) color representation. The wrong choice — using the display format
        (e.g., the HSL string the user sees) as the internal state — leads to precision
        loss and conversion artifacts when the user switches between color space views.
      </p>
      <p>
        The correct approach: use a high-precision internal representation. The two
        best options are normalized RGBA (four floats in [0.0, 1.0]) and a Color object
        using the CSS Typed OM or a custom class. Normalized RGBA is simpler to implement;
        a Color class is more extensible to multiple color spaces.
      </p>
      <p>
        With normalized RGBA as the internal state: RGB values are floats 0–1 (not
        integers 0–255). Converting to the display format (hex, HSL, oklch) is done
        on read. Editing in a display format converts back to the internal RGBA on
        commit. This round-trip fidelity means that editing the red channel in RGB
        view does not affect the blue/green channels due to floating-point rounding,
        as would happen if the internal state were stored as HSL and converted to RGB
        on every edit.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The hue channel in HSL and oklch has a pathological edge case: when saturation
        (HSL) or chroma (oklch) is zero, the hue is mathematically undefined. A gray
        color (R=G=B) has no meaningful hue. If the user drags saturation to zero and
        then increases it again, the hue should be restored to its pre-zero value, not
        reset to 0. Implement this by caching the last non-undefined hue separately and
        using it when saturation or chroma returns to a non-zero value.
      </HighlightBlock>

      <h3>Color Space Conversions</h3>
      <p>
        A production color picker needs accurate, well-tested conversion functions
        between all supported color spaces. The conversion chain for most spaces is:
        rgb → linear-rgb → XYZ D65 → target space. This is because many perceptually
        uniform color spaces (oklch, OKLab) are defined in terms of linear RGB or XYZ
        values, not gamma-corrected sRGB.
      </p>
      <p>
        Converting from sRGB (the standard screen color space, gamma-corrected) to
        linear RGB requires applying the inverse sRGB gamma function: for each channel
        c, if c is less than 0.04045, divide by 12.92; otherwise compute
        ((c + 0.055) / 1.055) raised to the power 2.4. This is the standard IEC 61966-2-1
        transfer function. The inverse (linear to sRGB) applies the forward gamma.
      </p>
      <p>
        Converting linear RGB to XYZ D65 uses a 3×3 matrix defined in the CSS Color 4
        specification. Converting XYZ to OKLab uses an intermediate cone space
        transformation (the Oklab paper defines the matrices). Oklch is OKLab in polar
        coordinates: L is the same, C (chroma) is the magnitude of (a, b), and h (hue)
        is the angle atan2(b, a) in degrees.
      </p>
      <p>
        HSL conversion from RGB is more direct but produces non-linear perceptual
        spacing (two colors that differ by the same HSL delta look very different
        depending on their lightness and hue). This is why professional design tools
        are moving toward oklch: equal steps in oklch produce perceptually equal
        steps in color, making it easier to reason about color scales and accessible
        contrast.
      </p>

      <h3>The Saturation/Brightness Canvas</h3>
      <p>
        The two-dimensional gradient picker (the large square where the user picks
        saturation and brightness by clicking or dragging) is typically rendered on a
        canvas element. A simple CSS gradient background could substitute, but canvas
        gives pixel-level control and is needed anyway for the Eyedropper fallback.
      </p>
      <p>
        The canvas render logic for an HSB (hue, saturation, brightness) picker:
        draw a horizontal gradient from white (at left edge) to the current hue's
        fully saturated color (at right edge). Draw a second vertical gradient from
        transparent (at top) to black (at bottom), composited over the first gradient
        using "multiply" or "source-over" blending. The result is the standard HSB
        picker square.
      </p>
      <p>
        Redraw the canvas whenever the hue changes (which changes the color at the
        right edge). Use requestAnimationFrame to batch redraws and avoid redundant
        paints. The canvas is a fixed size (e.g., 256×256 logical pixels, 512×512
        with devicePixelRatio scaling for sharp display on retina screens). Reading
        a pixel value from the canvas on click gives the saturation and brightness
        at that position without needing to reverse-engineer the gradient formula.
      </p>
      <p>
        The cursor (the draggable handle on the canvas) is an absolutely positioned
        div inside a container that matches the canvas dimensions. Its position
        corresponds to the current saturation (x-axis) and brightness (y-axis) values.
        Dragging the cursor updates the state; conversely, updating the state from hex
        input moves the cursor.
      </p>

      <h3>Hue and Alpha Sliders</h3>
      <p>
        The hue slider is a horizontal or vertical range input styled with a
        CSS gradient background cycling through the full hue spectrum. The range
        input's value maps to hue degrees 0–360. Styling range inputs consistently
        across browsers requires vendor-specific pseudo-elements (::-webkit-slider-thumb,
        ::-moz-range-thumb) and careful CSS resets.
      </p>
      <p>
        Alternatively, the hue slider can be a canvas element with a gradient and a
        pointer event handler. Canvas gives more styling control at the cost of
        re-implementing the range input's accessibility semantics (role="slider",
        aria-valuemin, aria-valuemax, aria-valuenow, aria-orientation, keyboard step
        handling for arrow keys).
      </p>
      <p>
        The alpha slider, when present, displays a checkerboard background (rendered
        on a canvas or as a CSS background pattern) overlaid with a gradient from
        transparent to the current fully-opaque color. This gives the user a visual
        preview of how the color will appear at different opacity levels against a
        white/checkered background.
      </p>

      <h3>Hex and Channel Inputs</h3>
      <p>
        The hex input is a text field that accepts a 3 or 6 digit hex string (with or
        without the leading hash). The tricky part: the input must allow intermediate
        invalid states during typing. If the user types "ff" and the picker immediately
        tries to parse it as a color, the parse fails and the field resets — preventing
        the user from completing "ff0000". The solution is to maintain a separate
        "draft" string in the input field state, validate only on blur or when the
        string is a valid complete hex color (3 or 6 valid hex digits), and never
        clobber the draft string from outside while the user is focused in the input.
      </p>
      <p>
        Individual channel inputs (R, G, B or H, S, L) follow the same pattern. Each
        input maintains its own draft string. On blur, commit the value (clamped to
        the valid range) to the picker's internal state. On external state change
        (e.g., the user clicked a new position on the canvas), update the input only
        if the input is not currently focused — a focused input belongs to the user.
      </p>
      <HighlightBlock as="p" tier="important">
        Never update a focused input's value from external state. The pattern: use
        an onFocus/onBlur pair to track whether the input is "owned" by the user.
        While the user owns the input, changes to the picker's internal color state
        (from canvas clicks, slider drags, palette selection) do not push new values
        into the focused input. When the user blurs, commit the draft to state and
        release ownership. This prevents the cursor position from jumping while the
        user is in the middle of typing.
      </HighlightBlock>

      <h3>WCAG Contrast Computation</h3>
      <p>
        Showing the contrast ratio of the selected color against a reference (typically
        white and black) is a high-value feature for design system pickers. The
        computation uses the WCAG 2.1 relative luminance algorithm.
      </p>
      <p>
        Relative luminance L: convert the color to linear RGB (sRGB gamma removed),
        then compute L = 0.2126 * R_linear + 0.7152 * G_linear + 0.0722 * B_linear.
        The contrast ratio between two colors with luminances L1 (lighter) and L2
        (darker) is (L1 + 0.05) / (L2 + 0.05).
      </p>
      <p>
        WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1
        for large text. WCAG AAA requires 7:1 and 4.5:1 respectively. Display these
        thresholds next to the computed contrast ratio with pass/fail indicators. Also
        show which of white or black provides better contrast — this guides designers
        choosing text-on-background pairings.
      </p>
      <p>
        Note that WCAG 3.0 (in draft) replaces the relative luminance formula with
        APCA (Advanced Perceptual Contrast Algorithm), which is more perceptually
        accurate for small text and non-white backgrounds. Consider exposing both
        algorithms behind a toggle for forward compatibility.
      </p>

      <h3>Saved Palettes</h3>
      <p>
        A saved palette allows users to store frequently used colors and recall them
        quickly. The palette is an array of color values persisted to localStorage.
        The implementation needs to handle palette CRUD operations: add the current
        color, remove a saved color, reorder via drag and drop, and set a maximum
        size (typically 8–16 swatches).
      </p>
      <p>
        Palette swatches are button elements with aria-label="Select color: #ff6b35"
        (or the color's readable name if available). A context menu or long-press
        on a swatch reveals a "Remove" option. Keyboard-navigable swatches use arrow
        keys within the palette grid (roving tabindex), allowing users to explore and
        select saved colors without reaching for the mouse.
      </p>

      <h3>Eyedropper API Integration</h3>
      <p>
        The EyeDropper API (window.EyeDropper) allows sampling any pixel on screen,
        including outside the browser window. The API is supported in Chrome 95+ and
        Edge 95+; Firefox and Safari do not yet support it (as of 2026). Feature-detect
        before offering the button: show the eyedropper icon only if 'EyeDropper' in
        window.
      </p>
      <p>
        The API is straightforward: instantiate an EyeDropper, call its open() method
        (which returns a Promise), and await the result. The result is an object with
        a sRGBHex property containing the sampled color as a 6-digit hex string. Parse
        this hex into the internal color representation and update state. Handle the
        AbortError that is thrown if the user cancels the eyedropper without selecting
        a color (by pressing Escape).
      </p>

      <h3>Accessibility Model</h3>
      <p>
        A color picker is notoriously difficult to make accessible because the primary
        interaction — clicking a point on a gradient canvas — is purely visual. The
        accessible alternative is the text inputs: users who cannot use the visual
        canvas can type values directly into the hex or channel inputs. Ensure these
        inputs have descriptive labels and error messages for invalid values.
      </p>
      <p>
        The saturation/brightness canvas can be made keyboard-accessible by implementing
        it as a role="slider" widget (actually a 2D slider, which ARIA does not have a
        specific role for — role="slider" with aria-orientation="horizontal" covers
        one axis; a second element with aria-orientation="vertical" covers the other).
        Arrow keys move the selected point by a fixed step; Shift+arrow moves by a
        larger step; Home/End jump to the extremes. This provides a functional
        keyboard interface for the canvas.
      </p>
      <p>
        The entire picker panel should have an accessible name (via aria-labelledby or
        aria-label) describing its purpose. Focus management: when the picker panel
        opens (e.g., triggered by clicking a color swatch), move focus to the first
        interactive element inside the panel (typically the hex input). When the panel
        closes, return focus to the triggering element.
      </p>
      </section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: controlled/uncontrolled ownership, keyboard model, focus return, timers, portals, layout measurement, and escape hatches.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>Implement the component as a small runtime with five boundaries. The input adapter normalizes keyboard, pointer, touch, browser, and async events. The state controller applies guards and separates preview state from committed state. The projection layer derives semantic DOM and ARIA relationships. The integration adapter owns server requests, URL synchronization, or browser APIs. The observability adapter emits bounded evidence for failures and slow paths.</p>
        <p>For this topic, the critical state rule is: Use one canonical color representation internally and derive HSV, HSL, RGB, hex, alpha, and contrast projections to prevent rounding drift across editors. During interaction, record enough context to cancel safely. On commit, validate the latest intent, update the durable projection, and release temporary listeners, timers, observers, pointer capture, and abort controllers. On unmount, cleanup must be idempotent.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/color-picker-edge-cases.svg" alt="Design a Color Picker edge-case defense map" caption="Edge-case map: validate intent, contain scale pressure, recover from failure, reconcile committed state, and emit evidence." />
      </section>
      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>native color input is compact and robust; a custom picker is justified for alpha, palettes, design tokens, contrast guidance, and consistent cross-browser behavior. The custom design should still lean on native semantics and browser primitives where they remain correct. Replacing them creates testing obligations for keyboard behavior, focus ownership, reduced motion, touch interaction, zoom, SSR hydration, and assistive technology.</p>
        <p>Transient preview is local and high frequency; committed color changes are versioned application updates so undo history records meaningful selections rather than every pointer sample. At scale, the failure pressure is high-frequency pointer updates, repeated color conversions, wide-gamut inputs, invalid pasted values, and palette synchronization across documents. Defend the latency budget by batching measurement, aborting stale async work, bounding caches and prefetch, and emitting analytics only for committed outcomes.</p>
        <p>A principal answer should distinguish local responsiveness from durable correctness. Optimistic UI is appropriate when the rollback is deterministic and visible. It is inappropriate when the client cannot validate authorization, inventory, resource conflicts, or destructive side effects.</p>
      </section>
      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: interaction latency, focus failures, accessibility violations, render cost, cleanup count, and blocked transition count.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>Use explicit state unions, typed events, idempotent cleanup, stable ids, native semantics, SSR-safe feature detection, abortable requests, and deterministic tests. Exercise keyboard-only use, touch cancellation, screen-reader output, high zoom, reduced motion, slow network, stale responses, unmount during work, and browser back-forward behavior where relevant.</p>
        <p>Observe blocked transitions, rollback frequency, stale-response drops, slow interaction latency, cache pressure, retry count, and accessibility regression results. Keep telemetry small and avoid sensitive payloads. Publish the public behavior contract before changing shared component semantics.</p>
      </section>
      <h3>Principal defense: consistency, abuse, and lifecycle rollback</h3><p>For a reusable component, consistency means one committed semantic snapshot drives DOM attributes, focus behavior, and callbacks. Pointer movement, hover previews, timers, measurements, and async settlements are transient projections. Guard every delayed effect with ownership identity so stale work cannot reopen, overwrite, or announce a component after blur, disposal, navigation, or replacement. Rollback restores the last committed semantic state and performs idempotent cleanup.</p><p>Bound work even for small widgets: cap queued notices, cached failures, measured items, portal layers, suggestion rows, and animation updates. Validate externally supplied labels, URLs, markup, dimensions, and item ids before rendering or measuring. Avoid leaking private labels or raw payloads through telemetry. Track rejected transitions, timer drift, focus-return failures, layout shifts, cleanup counts, and degraded fallbacks.</p><h3>Trade-off and privacy boundary</h3><p>The component trade-off is richer behavior versus lifecycle complexity. Add measurement, portals, caching, animation, or background work only when the interaction benefit exceeds cleanup and stale-result risk. Privacy controls matter even for small widgets: do not expose private labels, URLs, document fragments, or user activity through analytics, announcements, cached previews, or cross-scope reuse.</p><section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: inaccessible clickable divs, stale callbacks, leaked timers, layout shifts, focus traps, and prop APIs that cannot evolve.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>Common failures include mixing draft and committed state, treating rendering state as the source of truth for browser-owned behavior, leaving listeners or timers active after unmount, accepting stale async completion, trusting client-side authorization, and producing inaccessible custom controls.</p>
        <p>For this component specifically, the failure policy is to retain the last valid color while showing invalid text input, feature-detect EyeDropper, clamp channels, and announce contrast failures without blocking inspection. Security and privacy require the implementation to validate pasted values, bound palette storage, request eyedropper only from a user gesture, and never treat color metadata as trusted HTML or CSS.</p>
      </section>
      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>Representative deployments include a design-system token editor, a document annotation tool, and an accessibility-aware theme builder. In each case, the same component shell may be reused, but the policy layer changes: latency budget, permissions, persistence, fallback, and telemetry should be injected explicitly instead of hidden in presentation code.</p>
      </section>
      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3>How would you model component state?</h3><p>I would separate committed state, transient interaction state, derived presentation, and async request generations. For this component, Use one canonical color representation internally and derive HSV, HSL, RGB, hex, alpha, and contrast projections to prevent rounding drift across editors. That model makes cancellation and rollback explicit.</p>
        <h3>What breaks at scale?</h3><p>The dominant pressures are high-frequency pointer updates, repeated color conversions, wide-gamut inputs, invalid pasted values, and palette synchronization across documents. I would bound work per interaction, virtualize or cache only where measured, and cancel work that is no longer relevant.</p>
        <h3>What consistency model applies?</h3><p>Transient preview is local and high frequency; committed color changes are versioned application updates so undo history records meaningful selections rather than every pointer sample. The interview answer must state which layer is authoritative and how stale completion is rejected.</p>
        <h3>How do you handle failure and rollback?</h3><p>I would retain the last valid color while showing invalid text input, feature-detect EyeDropper, clamp channels, and announce contrast failures without blocking inspection. I would also emit a reason code so product metrics distinguish expected cancellation from defects and provider failures.</p>
        <h3>How do you defend the architecture over alternatives?</h3><p>native color input is compact and robust; a custom picker is justified for alpha, palettes, design tokens, contrast guidance, and consistent cross-browser behavior. I would choose the smallest design that satisfies the required behavior and explicitly accept the testing and operability cost of custom interaction.</p>
      </section>
      <section>
        <h2>References</h2>
        <ul>
          <li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer events</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li>
          <li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React: Sharing State Between Components</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
