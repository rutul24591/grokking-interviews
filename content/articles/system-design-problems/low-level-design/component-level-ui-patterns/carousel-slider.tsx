"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-carousel-slider",
  title: "Design a Carousel / Slider",
  description:
    "Carousel with touch support, autoplay, accessibility, lazy-loaded slides, and infinite loop.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "carousel-slider",
  wordCount: 3200,
  readingTime: 17,
  lastUpdated: "2026-04-03",
  tags: ["lld", "carousel", "slider", "touch", "autoplay", "accessibility", "lazy-loading"],
  relatedTopics: ["image-gallery-lightbox", "drag-drop-list", "infinite-scroll-virtualized-list"],
};

export default function CarouselSliderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a carousel / slider — a UI component that displays a
          sequence of slides, one (or more) visible at a time, with navigation controls
          (arrows, dots), autoplay with pause on hover, touch swipe support for mobile,
          lazy loading of off-screen slides, and full keyboard accessibility.
        </p>
        <p>
          <strong>Assumptions:</strong> Slides contain images, text, and CTAs. The
          carousel loops infinitely. Autoplay interval is configurable (default 5s).
          Touch swipe threshold is 50px. The component is used in a React 19+ SPA.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Slide Navigation:</strong> Previous/Next buttons, dot indicators, keyboard arrows.</li>
          <li><strong>Autoplay:</strong> Auto-advances at configurable interval. Pauses on hover/focus. Resumes on mouse leave.</li>
          <li><strong>Touch Swipe:</strong> Swipe left/right on mobile to navigate. Momentum-based scroll.</li>
          <li><strong>Infinite Loop:</strong> Last slide → Next goes to first. First slide → Previous goes to last.</li>
          <li><strong>Lazy Loading:</strong> Off-screen slides load images only when adjacent to visible slide.</li>
          <li><strong>Multiple Visible Slides:</strong> Configurable slides-per-view (1 for hero, 3 for product cards).</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Slide transitions at 60fps using CSS transforms. No layout thrashing.</li>
          <li><strong>Accessibility:</strong> aria-roledescription=&quot;carousel&quot;, aria-live for slide changes, keyboard navigation.</li>
          <li><strong>Reduced Motion:</strong> Respects prefers-reduced-motion — disables autoplay and transitions.</li>
        </ul>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>User swipes during autoplay — autoplay timer resets.</li>
          <li>Tab hidden — pause autoplay when page is not visible (Page Visibility API).</li>
          <li>Very wide carousel on mobile — must collapse to single slide with swipe.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is a <strong>slide track</strong> — a flex container with all
          slides, translated via <code>transform: translateX()</code> based on the
          current slide index. A <strong>Zustand store</strong> manages the current
          index, autoplay state, and touch position. Touch events are handled by a
          <strong>swipe detector</strong> that computes delta and triggers slide changes
          when the threshold is crossed. Autoplay uses <code>setInterval</code> with
          pause/resume on hover/focus.
        </p>
      </section>

      <section>
        <h2>System Design</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Types &amp; Store</h4>
          <p><code>CarouselState</code> (currentIndex, isPlaying, touchStart, touchDelta). Store with goTo, next, prev, play, pause actions.</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Swipe Detector</h4>
          <p>Pointer events: pointerdown records startX, pointermove computes delta, pointerup triggers slide change if delta exceeds threshold (50px).</p>
        </div>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Autoplay Manager</h4>
          <p>setInterval with pause on mouseenter/focusin, resume on mouseleave/focusout. Resets interval on manual navigation. Pauses when document is hidden.</p>
        </div>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/carousel-slider-architecture.svg"
          alt="Carousel slider architecture showing slide track, touch handling, and autoplay management"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Carousel mounts with autoplay enabled. Interval starts.</li>
          <li>Slide track translates to current index × slide width.</li>
          <li>User swipes: pointermove updates delta, pointerup triggers next/prev if threshold crossed.</li>
          <li>Autoplay fires: next() called, interval resets.</li>
          <li>Lazy loader: adjacent slides&apos; images load via IntersectionObserver.</li>
        </ol>
      </section>

      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          Autoplay interval → next() → index update → transform translateX → slide transition.
          Swipe → delta computation → threshold check → next/prev → same flow.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling</h3>
        <ul className="space-y-3">
          <li><strong>Page visibility:</strong> document.visibilitychange event pauses autoplay when tab is hidden, resumes when visible.</li>
          <li><strong>Reduced motion:</strong> window.matchMedia(&apos;prefers-reduced-motion: reduce&apos;) disables autoplay and CSS transitions.</li>
          <li><strong>Infinite loop:</strong> Clone first and last slides. When the cloned last slide is visible, instantly jump to the real first slide (no animation).</li>
        </ul>
      </section>

      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Key approach: CSS transform translateX for slide transitions, Pointer Events for
          swipe detection, setInterval with visibility-aware autoplay, IntersectionObserver
          for lazy loading, and full ARIA carousel pattern compliance.
        </p>
      </section>

      <section>
        <h2>Performance &amp; Scalability</h2>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-theme"><th className="p-2 text-left">Operation</th><th className="p-2 text-left">Time</th><th className="p-2 text-left">Space</th></tr></thead>
            <tbody className="divide-y divide-theme">
              <tr><td className="p-2">Slide transition</td><td className="p-2">O(1) — CSS transform</td><td className="p-2">O(1)</td></tr>
              <tr><td className="p-2">Swipe detection</td><td className="p-2">O(1) — delta computation</td><td className="p-2">O(1)</td></tr>
              <tr><td className="p-2">Lazy load check</td><td className="p-2">O(1) — IntersectionObserver callback</td><td className="p-2">O(1) per slide</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Security Considerations &amp; Accessibility</h2>
        <p>
          Carousel has <code>role=&quot;region&quot;</code> with
          <code>aria-roledescription=&quot;carousel&quot;</code> and
          <code>aria-label</code>. Each slide has <code>role=&quot;group&quot;</code>
          with <code>aria-roledescription=&quot;slide&quot;</code> and
          <code>aria-label=&quot;slide X of Y&quot;</code>. Navigation buttons have
          descriptive labels. Keyboard: ArrowLeft/Right navigates, Tab focuses controls.
          Autoplay pauses on focus for accessibility.
        </p>
      </section>

      <section>
        <h2>Testing Strategy</h2>
        <ul className="space-y-2">
          <li><strong>Unit:</strong> Swipe detector — test threshold crossing, delta computation. Autoplay — test pause/resume, visibility API.</li>
          <li><strong>Integration:</strong> Simulate swipe, verify slide changes, verify transition completes. Test autoplay interval.</li>
          <li><strong>Accessibility:</strong> axe-core on carousel, keyboard navigation, screen reader slide announcements, reduced motion preference.</li>
        </ul>
      </section>

      <section>
        <h2>Interview-Focused Insights</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes</h3>
        <ul className="space-y-3">
          <li><strong>Animating left/margin instead of transform:</strong> Animating layout properties causes expensive reflows. transform: translateX() is GPU-composited.</li>
          <li><strong>No autoplay pause on hover/focus:</strong> Autoplay continuing while the user is trying to read a slide is frustrating. Pause on hover/focus is mandatory.</li>
          <li><strong>No reduced motion support:</strong> Users with vestibular disorders need motion disabled. prefers-reduced-motion media query must be respected.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement a parallax effect within carousel slides?</p>
            <p className="mt-2 text-sm">
              A: Use scroll-linked animations or touch delta to offset background images
              at a different rate than foreground content. During swipe, compute the
              swipe delta and apply a scaled transform to the background layer
              (e.g., 0.5x the swipe distance for parallax).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you handle variable-width slides?</p>
            <p className="mt-2 text-sm">
              A: Instead of translateX(index × slideWidth), compute cumulative offsets
              by summing each slide&apos;s offsetWidth. The track translates to the
              cumulative offset of the current slide. This requires measuring each
              slide&apos;s width on mount and on resize.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you add snap scrolling (CSS scroll-snap)?</p>
            <p className="mt-2 text-sm">
              A: Set <code>scroll-snap-type: x mandatory</code> on the track and
              <code>scroll-snap-align: start</code> on each slide. Navigation buttons
              use <code>{`scrollTo({ left: offset, behavior: 'smooth' })`}</code>.
              Touch swipe works natively with scroll-snap. No JS animation needed.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you track carousel engagement metrics?</p>
            <p className="mt-2 text-sm">
              A: Track: (1) slides viewed per session, (2) CTA clicks per slide,
              (3) average time spent per slide, (4) swipe vs button usage ratio,
              (5) drop-off point (which slide users stop interacting). Use this data
              to optimize slide content and autoplay interval.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — CSS Scroll Snap
            </a>
          </li>
          <li>
            <a href="https://www.w3.org/WAI/tutorials/carousels/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WAI — Accessible Carousel Design Pattern
            </a>
          </li>
          <li>
            <a href="https://css-tricks.com/intro-css-scroll-snap/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              CSS-Tricks — Introduction to CSS Scroll Snap
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
