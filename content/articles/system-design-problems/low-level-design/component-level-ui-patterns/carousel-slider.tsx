"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-carousel-slider",
  title: "Design a Carousel / Slider",
  description:
    "Carousel with touch support, velocity-based swiping, FLIP animation, autoplay, accessibility, lazy-loaded slides, and infinite loop.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "carousel-slider",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["lld", "carousel", "slider", "touch", "autoplay", "accessibility", "lazy-loading", "FLIP"],
  relatedTopics: ["image-gallery-lightbox", "drag-drop-list", "infinite-scroll-virtualized-list"],
};

export default function CarouselSliderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h1>Design a Carousel Slider</h1>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Carousel / Slider around semantic DOM, accessibility, controlled state, focus ownership, lifecycle cleanup, and reusable API governance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <p>Design a Carousel Slider is a low-level design problem about implementing pointer capture, drag velocity, snap selection, autoplay timers, reduced-motion policy, virtualized slides, and focus-safe announcements. A principal-level interview answer must define ownership boundaries, browser and accessibility semantics, local data structures, lifecycle cleanup, server reconciliation, and explicit degraded behavior.</p>
        <p>Keep the committed slide index separate from the transient drag offset so an interrupted gesture can snap back without corrupting navigation state. The central structures are slide registry, committed index, drag session, velocity samples, snap points, autoplay deadline, visibility observer, roving focus index, and virtualization window. The implementation is not complete until cancellation, stale work, SSR behavior, privacy, metrics, and rollback are deliberate rather than incidental.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/carousel-slider-runtime.svg" alt="Design a Carousel Slider runtime flow" caption="Runtime flow: input becomes a guarded state transition, a semantic projection, and a recoverable outcome." />
      </section>
      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: one committed semantic state must drive ARIA attributes, keyboard behavior, callbacks, visual state, and cleanup effects.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Carousel / Slider, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>The following deep dive preserves the component-specific mechanics and browser constraints that determine the implementation.</p>
        <p>
        A carousel sits at the intersection of animation engineering, touch event handling,
        accessibility, and performance optimization. The surface area is deceptively large:
        a product carousel on an e-commerce homepage needs to handle touch swipes with
        velocity-based momentum, keyboard navigation for screen reader users, autoplay that
        pauses when the user interacts, lazy loading of off-screen images for LCP
        improvement, and infinite loop behavior that wraps slides without cloning DOM nodes.
        Each of these requirements has hidden depth that separates a production-grade
        implementation from a tutorial demo.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/carousel-slider-architecture.svg"
        alt="Carousel component architecture diagram"
        caption="Carousel architecture: slide state, touch/velocity engine, FLIP animation, autoplay and accessibility"
      />

      <h3>Clarifying the Requirements</h3>
      <p>
        Before designing, establish the scope with the interviewer. The answers determine
        which architectural decisions matter most.
      </p>
      <p>
        <strong>How many slides?</strong> A marketing carousel with 5 hero images is
        architecturally different from a product shelf with 200 items. Small carousels
        can render all slides in the DOM simultaneously. Large carousels need virtualization:
        only 3–5 slides around the current index are mounted; the rest are placeholders.
      </p>
      <p>
        <strong>Infinite loop or finite?</strong> An infinite carousel that wraps from
        the last slide to the first creates the illusion of an endless loop. Naively
        this is implemented by cloning the first and last slides to create "buffer"
        nodes, then silently jumping to the real nodes after the transition. A cleaner
        approach uses modular arithmetic to calculate the visible slide index without
        cloning.
      </p>
      <p>
        <strong>Touch and mouse drag support?</strong> Touch support requires careful
        pointer event handling. Mobile browsers impose a ~300ms delay if the touch
        handler does not call preventDefault() fast enough. Passive event listeners
        (added via addEventListener with passive: true) cannot call preventDefault(),
        creating a tension between scroll performance and drag prevention. The solution
        is to listen passively on touchstart to determine intent, then add a non-passive
        touchmove listener only when a horizontal drag is detected.
      </p>
      <p>
        <strong>Autoplay?</strong> Autoplay carousels are accessibility liabilities.
        WCAG 2.1 Success Criterion 2.2.2 (Pause, Stop, Hide) requires that any
        auto-advancing content can be paused. Autoplay must stop when the user interacts
        with the carousel (hover, focus, drag, or keyboard press) and should never
        resume automatically after interaction.
      </p>

      <h3>The Slide State Model</h3>
      <p>
        The carousel's core state is a current index (integer) and a direction
        (forward or backward) for animation purposes. In a finite carousel, the index
        is clamped to [0, slideCount - 1]. In an infinite carousel, the index is kept
        as an unbounded integer and the slide index is computed as index mod slideCount
        (using a proper modulo that handles negative values: ((index % n) + n) % n).
      </p>
      <p>
        The unbounded index approach for infinite carousels is elegant: going backward
        from slide 0 produces index -1, which mod 3 resolves to slide 2 (the last slide).
        This avoids the complexity of DOM cloning and the visual artifact of a silent
        jump-reset. The rendered slides are the three slides at positions
        [currentIndex - 1, currentIndex, currentIndex + 1] (previous, current, next),
        mapped to their corresponding data via modular arithmetic.
      </p>
      <p>
        During a transition, the carousel needs to know both the source and target slide
        to animate between them. The state model therefore includes a transitioning flag
        and a pending index. When the transition completes, the current index is updated
        to the pending index and the transitioning flag is cleared. During transition,
        user-initiated navigation is either queued (added to a pending actions queue)
        or debounced (ignored until the current transition finishes). Queueing is
        preferable for keyboard and button navigation; debouncing is preferable for
        touch swipes where the user's intent changes rapidly.
      </p>

      <h3>Touch and Pointer Event Handling</h3>
      <p>
        Robust touch handling is the most mechanically complex part of a carousel. The
        implementation must distinguish horizontal swipes (carousel navigation) from
        vertical swipes (page scroll) without requiring the user to commit to a direction
        before the browser has determined intent.
      </p>
      <p>
        The event lifecycle: touchstart records the initial touch position and timestamp.
        touchmove computes the delta from the initial position. If the horizontal delta
        exceeds the vertical delta in magnitude, the touch is interpreted as a carousel
        swipe — call preventDefault() to suppress scrolling and begin live dragging of
        the slide track. If the vertical delta is greater, do not call preventDefault()
        and let the browser scroll normally (this touch interaction belongs to the page,
        not the carousel).
      </p>
      <p>
        Live dragging translates the slide track by the horizontal delta using a CSS
        transform: translateX() applied directly to the DOM (bypassing React state for
        performance — state updates through React are batched and may lag a fast touch
        sequence). The transform is applied via a ref to the track element.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Velocity-based swipe detection determines whether to commit to a slide change
        or snap back. On touchend, compute the velocity as delta pixels divided by
        elapsed milliseconds. If velocity exceeds a threshold (typically 0.3–0.5 px/ms)
        in either direction, commit to a slide change in that direction regardless of
        how far the user dragged. If velocity is below the threshold, use the drag
        distance to decide: commit if the user dragged more than 30–40% of the slide
        width, snap back otherwise. This produces natural swipe behavior where a quick
        flick navigates even if the user did not drag far.
      </HighlightBlock>
      <p>
        Mouse drag support follows the same pattern using mousedown, mousemove, and
        mouseup events. A complication: if the user drags and the mouse leaves the
        carousel, the mouseup event fires on the document, not on the carousel. Handle
        this by attaching the mousemove and mouseup listeners to the document on
        mousedown and removing them on mouseup or mouseleave.
      </p>
      <p>
        The Pointer Events API (pointerdown, pointermove, pointerup) unifies touch and
        mouse into a single event stream, which simplifies the implementation. Use
        setPointerCapture(event.pointerId) on pointerdown to ensure pointerup always
        fires on the element even if the pointer leaves. This eliminates the document-level
        listener workaround needed for mouse events.
      </p>

      <h3>FLIP Animation for Slide Transitions</h3>
      <p>
        The naive animation approach — CSS transition on the translateX of a slide track —
        works for simple carousels but has limitations. If the track contains many slides,
        sliding the entire track is inefficient. If slides have different widths (responsive
        layouts), calculating the correct translateX requires reading DOM measurements. And
        if the transition is interrupted (the user swipes while a transition is in progress),
        reversing a track-based animation is complex.
      </p>
      <p>
        FLIP (First, Last, Invert, Play) is a more robust alternative. The technique:
        (F) Record the current position of the exiting slide. (L) Update state to the new
        slide and let React render. (I) Compute the delta between where the new slide is
        now (its "last" position) and where it should start (its "first" position, off-screen
        to the left or right). Apply the inverse transform to start it off-screen. (P) Remove
        the inverse transform with a CSS transition, playing the animation forward.
      </p>
      <p>
        FLIP animation has several advantages: it works with any slide size (the
        measurement is done after layout), it composites efficiently (transform animations
        run on the compositor thread), and interrupted transitions can be handled by reading
        the current animated transform and using it as the new "first" position.
      </p>
      <p>
        For the entering and exiting slides: the exiting slide plays a complementary
        FLIP animation in the opposite direction. Both animations run simultaneously,
        giving the appearance of a single track sliding left or right. The Web Animations
        API handles both animations, allowing them to be cancelled and reversed
        mid-animation when the user swipes before the transition completes.
      </p>

      <h3>Virtualization for Large Slide Sets</h3>
      <p>
        For carousels with many slides (product shelves, image galleries), rendering
        all slides in the DOM is wasteful. A virtualized carousel renders only a
        window of slides around the current index — typically the previous, current,
        and next slide (a window of 3), with optional preloading of the slides 2 positions
        away (a window of 5 for faster perceived navigation).
      </p>
      <p>
        The virtualization window is a computed property of the current index. As the
        index changes, slides enter and leave the window. Slides leaving the window are
        unmounted; slides entering are mounted. For image slides, unmounting and
        remounting causes re-fetching unless the images are cached by the browser —
        which they will be if the original fetch included appropriate Cache-Control
        headers. To avoid any fetch on remount, keep rendered but off-screen slides in
        the DOM but set them to visibility: hidden and pointer-events: none. This
        keeps the browser's image cache warm at the cost of some extra DOM nodes.
      </p>
      <p>
        Lazy loading image slides: the slides at currentIndex - 1 and currentIndex + 1
        should begin loading their images as soon as they enter the window. The current
        slide's image should have fetchpriority="high". Slides outside the window should
        not load at all. This is implemented using the loading="lazy" attribute on img
        elements, but native lazy loading triggers based on scroll position, not slide
        visibility — a custom IntersectionObserver or explicit src management is more
        reliable for a horizontally-scrolling carousel viewport.
      </p>

      <h3>Autoplay and Pause Logic</h3>
      <p>
        Autoplay advances to the next slide on a timer. The interval (typically 3–5
        seconds) should be configurable. The implementation uses setInterval, but there
        is an important subtlety: if the tab is hidden (document.visibilityState is
        'hidden'), the interval fires but the animation is suppressed by the browser,
        causing the slide state to advance without any visual transition. The user
        returns to the tab to find the carousel has jumped several slides. Fix: pause
        the interval when the Page Visibility API reports the tab as hidden, and resume
        when it becomes visible again.
      </p>
      <HighlightBlock as="p" tier="important">
        Autoplay must pause on all of: mouseenter (hover), focus within (any element
        inside the carousel receives focus), touchstart (user begins interacting on
        mobile), and keyboard interaction. The carousel should not automatically resume
        after any of these events — resuming autoplay while the user is actively engaged
        is disorienting. The only time autoplay should resume is on mouseleave when no
        element inside the carousel has focus.
      </HighlightBlock>
      <p>
        The preferred implementation uses a useAutoplay hook that manages the interval
        and exposes pause() and resume() methods. The carousel component calls pause()
        in its event handlers (mouseenter, focus, keydown) and resume() in the inverse
        handlers (mouseleave, when no child has focus). Focus tracking requires
        maintaining a counter of focused elements inside the carousel rather than a
        boolean — a user might tab from one dot indicator to another, causing a blur
        event before the focus event, and a boolean would incorrectly resume autoplay
        during this transition.
      </p>

      <h3>Accessibility: ARIA and Keyboard Model</h3>
      <p>
        The carousel widget should implement the ARIA carousel pattern. The outer
        container has role="region" with an aria-label (e.g., "Featured products carousel"
        or a descriptive aria-labelledby). This creates a landmark that screen reader
        users can navigate to directly.
      </p>
      <p>
        Inside the region, the slide container has aria-live="polite" — screen readers
        announce when the displayed slide changes. However, aria-live on the entire
        carousel would announce every change including autoplay advances, which is
        extremely noisy. A better pattern: a visually hidden status element with
        aria-live="polite" and aria-atomic="true" announces only the current slide
        position ("Slide 2 of 5"). The slide container itself does not have aria-live.
        When the slide changes, update the status element text.
      </p>
      <p>
        Navigation buttons (previous/next) are plain button elements with descriptive
        aria-label ("Next slide", "Previous slide"). They should have aria-disabled
        (not the disabled attribute) on the boundary slides of a finite carousel,
        so screen readers announce them as disabled but they remain focusable.
      </p>
      <p>
        Dot indicators (the position indicators below the carousel) can be implemented
        as a group of radio buttons (with role="radiogroup" on the container and
        role="radio" on each dot) or as a tablist. Radio group semantics fit better:
        only one dot is "selected" at a time, matching the radio button metaphor. Each
        dot has aria-label="Go to slide N" and aria-checked="true" when it represents
        the current slide.
      </p>

      <h3>Keyboard Navigation Within the Carousel</h3>
      <p>
        Inside the carousel, the keyboard model depends on whether slides contain
        interactive content (links, buttons) or are purely visual (images). For
        purely visual carousels, the keyboard model is: Tab enters the carousel at
        the previous button, Tab again moves to the next button, Tab again exits to
        the dot indicators or to the next element after the carousel.
      </p>
      <p>
        For content carousels (slides contain links or buttons), keyboard users need
        to be able to tab into each slide's content. This means slides within the
        visible window are in the tab order, but off-screen slides (not currently visible)
        must not be tabbable. Set tabindex="-1" on all interactive elements in off-screen
        slides, and ensure their visibility is hidden so screen readers do not announce
        their content before or after the visible slide.
      </p>
      <p>
        Arrow keys (Left/Right) should navigate between slides when focus is within
        the carousel's navigation controls (previous/next buttons and dot indicators).
        Inside slide content, arrow keys follow their natural behavior (scrolling text,
        navigating within nested widgets). This distinction prevents arrow key
        navigation from conflicting with content interaction.
      </p>

      <h3>Responsive Design and Slide Counts</h3>
      <p>
        Many carousels show multiple slides simultaneously — three product cards on
        desktop, two on tablet, one on mobile. This "slides per view" configuration
        requires the animation calculation to account for partial slide widths. The
        track offset is not a single slide width but currentIndex times the slide
        width divided by slidesPerView.
      </p>
      <p>
        Responsive slidesPerView requires listening to ResizeObserver on the carousel
        container and recalculating the configuration when the container width changes.
        The breakpoints should be in container widths (not viewport widths) to support
        carousels embedded in various layout contexts. This is a container query use
        case — the configuration responds to the carousel's own width, not the viewport.
      </p>
      <p>
        When slidesPerView changes (e.g., on rotation from portrait to landscape),
        the current index must be adjusted if it would now show slides beyond the end
        of the list. Clamp the index to the maximum valid position for the new
        slidesPerView value and snap to that position without animation.
      </p>
      </section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: controlled/uncontrolled ownership, keyboard model, focus return, timers, portals, layout measurement, and escape hatches.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>Implement the component as a small runtime with five boundaries. The input adapter normalizes keyboard, pointer, touch, browser, and async events. The state controller applies guards and separates preview state from committed state. The projection layer derives semantic DOM and ARIA relationships. The integration adapter owns server requests, URL synchronization, or browser APIs. The observability adapter emits bounded evidence for failures and slow paths.</p>
        <p>For this topic, the critical state rule is: Keep the committed slide index separate from the transient drag offset so an interrupted gesture can snap back without corrupting navigation state. During interaction, record enough context to cancel safely. On commit, validate the latest intent, update the durable projection, and release temporary listeners, timers, observers, pointer capture, and abort controllers. On unmount, cleanup must be idempotent.</p>
        <ArticleImage src="/diagrams/system-design-problems/low-level-design/component-level-ui-patterns/carousel-slider-edge-cases.svg" alt="Design a Carousel Slider edge-case defense map" caption="Edge-case map: validate intent, contain scale pressure, recover from failure, reconcile committed state, and emit evidence." />
      </section>
      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>CSS scroll snapping offers simpler native behavior; a transform-driven controller is justified when velocity-aware snapping, looping, or virtualization policy must be explicit. The custom design should still lean on native semantics and browser primitives where they remain correct. Replacing them creates testing obligations for keyboard behavior, focus ownership, reduced motion, touch interaction, zoom, SSR hydration, and assistive technology.</p>
        <p>Slide selection is local state. URL or analytics synchronization is asynchronous and deduplicated by committed index rather than pointer-move events. At scale, the failure pressure is hundreds of media-heavy slides, nested scrolling, rapid swipes, hidden tabs, responsive item counts, and screen-reader announcement noise. Defend the latency budget by batching measurement, aborting stale async work, bounding caches and prefetch, and emitting analytics only for committed outcomes.</p>
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
        <p>For this component specifically, the failure policy is to release pointer capture on cancel, pause timers while hidden or focused, restore the last committed index after a failed lazy load, and render a stable media fallback. Security and privacy require the implementation to sanitize slide content, constrain remote image sources, limit autoplay, respect reduced motion, and avoid analytics emission for every drag frame.</p>
      </section>
      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>Representative deployments include a product gallery, a story viewer with timed progression, and a media catalog carousel that virtualizes expensive slides. In each case, the same component shell may be reused, but the policy layer changes: latency budget, permissions, persistence, fallback, and telemetry should be injected explicitly instead of hidden in presentation code.</p>
      </section>
      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3>How would you model component state?</h3><p>I would separate committed state, transient interaction state, derived presentation, and async request generations. For this component, Keep the committed slide index separate from the transient drag offset so an interrupted gesture can snap back without corrupting navigation state. That model makes cancellation and rollback explicit.</p>
        <h3>What breaks at scale?</h3><p>The dominant pressures are hundreds of media-heavy slides, nested scrolling, rapid swipes, hidden tabs, responsive item counts, and screen-reader announcement noise. I would bound work per interaction, virtualize or cache only where measured, and cancel work that is no longer relevant.</p>
        <h3>What consistency model applies?</h3><p>Slide selection is local state. URL or analytics synchronization is asynchronous and deduplicated by committed index rather than pointer-move events. The interview answer must state which layer is authoritative and how stale completion is rejected.</p>
        <h3>How do you handle failure and rollback?</h3><p>I would release pointer capture on cancel, pause timers while hidden or focused, restore the last committed index after a failed lazy load, and render a stable media fallback. I would also emit a reason code so product metrics distinguish expected cancellation from defects and provider failures.</p>
        <h3>How do you defend the architecture over alternatives?</h3><p>CSS scroll snapping offers simpler native behavior; a transform-driven controller is justified when velocity-aware snapping, looping, or virtualization policy must be explicit. I would choose the smallest design that satisfies the required behavior and explicitly accept the testing and operability cost of custom interaction.</p>
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
