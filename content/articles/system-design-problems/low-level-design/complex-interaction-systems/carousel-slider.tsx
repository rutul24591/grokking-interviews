"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-carousel-slider",
  title: "Design a Carousel / Slider",
  description:
    "LLD for a carousel: touch swipe, autoplay, lazy-loaded slides, keyboard navigation, indicators, accessibility.",
  category: "low-level-design",
  subcategory: "complex-interaction-systems",
  slug: "carousel-slider",
  wordCount: 5500,
  readingTime: 29,
  lastUpdated: "2026-05-04",
  tags: ["lld", "carousel", "slider", "touch", "react", "accessibility"],
  relatedTopics: [
    "image-gallery-lightbox",
    "drag-drop-list",
    "infinite-scroll-virtualized-list",
  ],
};

export default function CarouselSliderArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Carousel Slider</h1><h2>Definition &amp; Context</h2><p>Design a Carousel Slider is an implementation-heavy interaction design covering pointer capture, velocity sampling, snap selection, autoplay, pause rules, virtualization, accessibility, and responsive item counts. A principal-level answer must explain state ownership, geometry, browser events, cancellation, accessibility, persistence, scale, and observability.</p><p>Keep committed index separate from transient offset. Autoplay pauses for focus, interaction, hidden tabs, and reduced motion. Core structures: slide registry, committed index, drag offset, velocity samples, autoplay deadline, observer state, virtualization window, and focus index.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/carousel-slider-runtime.svg" alt="Design a Carousel Slider runtime" caption="Interaction flow from input through projection, policy, commit, and render." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a carousel — the
          horizontal slider that cycles through
          slides (images, cards, ads, hero
          banners). Users swipe on touch or
          click prev/next on desktop. Optionally
          autoplays. The component is
          ubiquitous on marketing sites and
          mobile apps. Done well it feels native;
          done poorly it&rsquo;s a layout-shifting
          accessibility nightmare.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: smooth swipe with
          momentum and snap; lazy-loading slides
          (don&rsquo;t load all images up front);
          autoplay that respects user
          interaction (pause on hover/focus,
          stop after manual interaction);
          keyboard navigation; accessibility
          (carousels are notoriously bad for
          screen readers); indicators (dots /
          pagination); responsive behavior.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users browse content via swipe
          or click. Engineering teams plug in
          slides; runtime handles UX.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Modern browsers; we use Pointer Events
          for unified touch/mouse, scroll-snap
          where supported, IntersectionObserver
          for lazy-load.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement image gallery
          (separate). We do not implement
          infinite scroll (separate). We do
          not implement video carousels with
          autoplay video.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Horizontal slider with N slides.
          Swipe on touch (pointer drag with
          momentum). Prev/next buttons. Pagination
          dots. Keyboard navigation (arrows
          when focused). Lazy-load slides
          (off-screen don&rsquo;t fetch). Autoplay
          (configurable interval) with pause on
          hover/focus and stop on manual
          interaction. Loop or non-loop modes.
          Empty state.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Multiple visible slides at once
          (e.g. show 3 in viewport). Variable
          slide widths. Vertical orientation.
          Pinch-zoom on individual slides
          (delegate to Image Gallery).
          Slide-specific actions (CTAs).
          Auto-height adjustment to current
          slide.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Video autoplay, full-screen modal,
          ecommerce-specific features.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Swipe at 60 fps. Lazy-load reduces
          initial cost. Autoplay doesn&rsquo;t
          consume CPU when paused.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Autoplay respects interaction. Loop
          mode handles boundary correctly. No
          layout shift on slide load.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Slide content sanitized at render.
          External images CSP-compatible.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Slides as a list; current slide
          announced. Pause control accessible.
          Indicators are real buttons. Tab
          order through slides logical.
          Respect <code>prefers-reduced-motion</code>{" "}
          for autoplay and transitions.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Slides as children with stable
          keys. Configurable timing,
          orientation, loop.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The carousel is a horizontally-
          scrollable container with{" "}
          <code>scroll-snap-type</code> set to
          align children. Native browser
          scrolling handles the bulk;
          we add prev/next, autoplay,
          indicators, and lazy-load on top.
          This is dramatically simpler than
          fully-custom drag-and-snap and works
          smoothly on touch and desktop.
        </HighlightBlock>
        <p>
          On <strong>swipe</strong>: native
          horizontal scroll handles it.
          <code> scroll-snap</code> snaps to
          slide boundaries on release. Native
          momentum on touch.
        </p>
        <p>
          On <strong>prev/next</strong>: scroll
          the container to the previous or
          next slide via{" "}
          <code>scrollBy</code> with smooth
          behavior. <code>prefers-reduced-
          motion</code> switches to instant
          scroll.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>autoplay</strong>: a timer
          fires every N seconds calling next.
          On hover, focus, or manual
          interaction (click button or swipe),
          pause. Configurable: pause on hover,
          stop on manual (don&rsquo;t resume
          autoplay after manual interaction —
          users have indicated control).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          On <strong>lazy-load</strong>: each
          slide observes its own visibility
          via IntersectionObserver. When a
          slide approaches the viewport
          (within ~1.5x viewport width), load
          its content. Off-screen slides
          render placeholders.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Indicators</strong>: pagination
          dots show current and total slide
          count. Each dot is a button that
          scrolls to that slide. Active dot
          updates from scroll position
          (IntersectionObserver detects which
          slide is most visible).
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Keyboard navigation</strong>:
          arrow keys move slides when the
          carousel has focus. Tab moves
          between interactive slide content
          (CTA buttons within slides).
        </HighlightBlock>
        <p>
          <strong>Loop mode</strong>: clone the
          first slide after the last and
          vice versa. When the user scrolls
          to a clone, we
          jump (without animation) to the
          real corresponding slide. This is
          the standard infinite-loop trick.
        </p>
        <p>
          <strong>Reduced motion</strong>:
          autoplay disabled by default;
          transitions instant. Respects user
          preference globally.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong>Carousel</strong> is the
          container. <strong>SlidesTrack</strong>{" "}
          renders the scrollable</HighlightBlock>
<HighlightBlock as="p" tier="important">slides.
          <strong> Slide</strong> renders one
          slide. <strong>NavButtons</strong>{" "}
          (prev/next).</HighlightBlock>
<HighlightBlock as="p" tier="important"><strong> Indicators</strong>{" "}
          (dots). <strong>AutoplayController</strong>{" "}
          handles the timer.
          <strong> LazyLoadObserver</strong>{" "}
          handles intersection-based loading.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Active slide index derived <Highlight tier="important">from
          scroll position. Autoplay state
          (running/paused)</Highlight> component-local.
          Lazy-load status per slide.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Inputs:{" "}
          <code>slides</code> (array of
          renderables <Highlight tier="important">or React children),
          </Highlight><code> autoplay</code>,
          <code> interval</code>,
          <code> loop</code>,</Highlight>
          <code> visibleSlides</code>,
          <code> orientation</code>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Native scroll handles momentum.
          <Highlight tier="important">Lazy-load defers off-screen content.
          IntersectionObserver runs</Highlight> off-main.
          Scroll-snap is GPU-accelerated.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Smooth swipe. Subtle prev/next
          buttons. Dots for navigation.
          Autoplay considerate <Highlight tier="important">(pauses on
          hover, stops on manual).</Highlight> Lazy-load
          placeholder matches slide layout
          (no layout shift on load).
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Dots
          as labeled buttons. Respect{" "}
          <Highlight tier="important"><code>prefers-reduced-motion</code></Highlight>.</HighlightBlock>
<HighlightBlock as="p" tier="important">Keyboard navigation works.
          Screen-reader users can disable
          autoplay.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Slide content sanitized.
          External resources via <Highlight tier="important">CSP</Highlight>.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Swipe and click tests. <Highlight tier="important">Autoplay
          pause behavior. Loop mode boundary</Highlight>
          tests. Lazy-load tests.
          Accessibility tests.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Browser
          without scroll-snap: fall back to
          JS-driven smooth scroll. User has
          reduced-motion: autoplay off,</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">transitions instant. Carousel in
          viewport multiple times (rare but
          possible): each instance independent.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over slide content.
          <Highlight tier="important">Configurable</Highlight> per use case.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Button labels via i18n. Indicator
          <Highlight tier="important">aria-labels (&ldquo;Slide 3 of
          7&rdquo;) localized</Highlight> via Intl. RTL
          flips slide direction.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Native scroll vs JS-driven</h3>
        <HighlightBlock as="p" tier="crucial">
          Native scroll-snap is simpler,
          smoother on touch, GPU-accelerated.
          JS-driven gives more control but
          rebuilds momentum and snap from
          scratch. Native is the right
          default.
        </HighlightBlock>

        <h3>Loop via clones vs JS-jump</h3>
        <HighlightBlock as="p" tier="important">
          Clones are simpler with native
          scroll-snap. JS-jump requires
          intercepting scroll. Clones win
          for the native approach.
        </HighlightBlock>

        <h3>Autoplay default on vs off</h3>
        <HighlightBlock as="p" tier="important">
          Default off respects user attention.
          Configurable per consumer. Some
          marketing pages need autoplay; many
          others don&rsquo;t.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          3D effects, <Highlight tier="important">parallax, video slides,
          AR slides, smart</Highlight> adaptive sizing.
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Normalize pointer, touch, keyboard, resize, and async events before applying transitions. Separate raw intent, transient projection, committed state, derived geometry, and telemetry. Release pointer capture, listeners, observers, timers, and animation handles idempotently.</p><p>Keep committed index separate from transient offset. Autoplay pauses for focus, interaction, hidden tabs, and reduced motion.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/carousel-slider-recovery.svg" alt="Design a Carousel Slider recovery" caption="Recovery flow: cancel safely, retain committed truth, recalculate projection, and restore UI." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Selection is local truth. URL and analytics synchronization is asynchronous and deduped by committed index. Scale pressure comes from large media sets, rapid swipes, hidden tabs, responsive counts, lazy failures, and announcement noise. Bound measurement, batch rendering, and degrade predictably.</p><p>Prefer native semantics where they meet requirements. Custom interaction earns its cost only when product behavior needs explicit gesture, geometry, or workflow policy.</p></section>
<section><h2>Best practices</h2><p>Use typed sessions, stable ids, pointer capture, keyboard alternatives, reduced-motion policy, clamped geometry, idempotent cleanup, and deterministic tests. Measure latency, dropped frames, cancellation, rollback, and accessibility regressions.</p><h3>Operational implementation: frame-budgeted slide projection</h3><p>Keep the committed slide separate from drag offset and velocity samples. Pause autoplay for focus, pointer interaction, hidden tabs, and reduced motion. Virtualize large media collections, reserve dimensions to prevent layout shift, and emit analytics only after a committed slide changes.</p><p>Define a typed interaction session with owner, generation, start geometry, latest projection, committed snapshot, cancellation reason, and cleanup handles. Instrument pointer-to-paint latency, dropped frames, measurement cost, projection count, cancellation, rollback, constraint violations, and accessibility fallback usage. Test pointer loss, resize during interaction, keyboard-only flow, reduced motion, hidden tabs, unmount cleanup, stale persistence response, and extreme geometry.</p></section>
<h3>Principal defense: scale, privacy, and rollback</h3><p>Keep committed domain state separate from transient geometry, pointer samples, animations, and derived guides. Under large collections, index only visible or nearby geometry, batch pointer updates to animation frames, cancel stale measurements, and degrade visual fidelity before interaction correctness. Persistence uses stable ids and versions; a rejected write restores the last committed snapshot and preserves an actionable retry state.</p><p>Even local interactions need abuse and privacy boundaries when they persist or collaborate. Validate dimensions, coordinates, payload sizes, and mutation frequency before accepting expensive work. Do not leak hidden objects, restricted calendar details, or cross-tenant geometry through previews, presence, or telemetry. Observe cancellation reason, long tasks, frame drops, rejected transitions, rollback outcome, and cleanup leaks.</p><section><h2>Common Pitfalls</h2><p>Common failures include mixing raw and committed state, leaking listeners, failing to handle pointer cancellation, ignoring keyboard users, and persisting invalid geometry.</p><p>For this topic, cancel pointer sessions, pause timers, restore committed slide, render stable fallbacks, and avoid per-frame analytics.</p><h3>Native scroll versus controlled projection</h3><p>Prefer scroll snapping for simple carousels because browser scrolling, touch physics, and accessibility remain native. Add a controlled pointer controller only when the product needs custom velocity rules, looping, or cross-slide effects. With looped presentation, keep a logical slide id distinct from cloned render positions so announcements, analytics, and focus never report clone indexes.</p><p>Virtualization needs a stable window around the active item and reserved media dimensions. Preload only the next likely slide, recover image failures with a fixed-size fallback, and pause work when IntersectionObserver or Page Visibility reports the carousel is offscreen. Buttons need accessible names, focus order must remain predictable, and autoplay should default off when it risks distracting users.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to repeated direct-manipulation workflows where responsive projection and safe cancellation matter as much as durable persistence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep committed index separate from transient offset. Autoplay pauses for focus, interaction, hidden tabs, and reduced motion.</p><h3>What breaks at scale?</h3><p>large media sets, rapid swipes, hidden tabs, responsive counts, lazy failures, and announcement noise.</p><h3>What consistency applies?</h3><p>Selection is local truth. URL and analytics synchronization is asynchronous and deduped by committed index.</p><h3>How do you recover?</h3><p>cancel pointer sessions, pause timers, restore committed slide, render stable fallbacks, and avoid per-frame analytics.</p><h3>How do you defend the architecture?</h3><p>I would prefer native behavior until the required geometry, gesture, or workflow policy justifies a custom controller.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events" target="_blank" rel="noreferrer">MDN Pointer Events</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li></ul></section>
</ArticleLayout>}