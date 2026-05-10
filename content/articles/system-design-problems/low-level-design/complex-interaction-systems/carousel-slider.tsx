"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

export default function CarouselSliderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
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
        </p>
        <p>
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
        </p>

        <h3>User Context</h3>
        <p>
          End users browse content via swipe
          or click. Engineering teams plug in
          slides; runtime handles UX.
        </p>

        <h3>Assumptions</h3>
        <p>
          Modern browsers; we use Pointer Events
          for unified touch/mouse, scroll-snap
          where supported, IntersectionObserver
          for lazy-load.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement image gallery
          (separate). We do not implement
          infinite scroll (separate). We do
          not implement video carousels with
          autoplay video.
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
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
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Multiple visible slides at once
          (e.g. show 3 in viewport). Variable
          slide widths. Vertical orientation.
          Pinch-zoom on individual slides
          (delegate to Image Gallery).
          Slide-specific actions (CTAs).
          Auto-height adjustment to current
          slide.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Video autoplay, full-screen modal,
          ecommerce-specific features.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Swipe at 60 fps. Lazy-load reduces
          initial cost. Autoplay doesn&rsquo;t
          consume CPU when paused.
        </p>

        <h3>Reliability</h3>
        <p>
          Autoplay respects interaction. Loop
          mode handles boundary correctly. No
          layout shift on slide load.
        </p>

        <h3>Security</h3>
        <p>
          Slide content sanitized at render.
          External images CSP-compatible.
        </p>

        <h3>Accessibility</h3>
        <p>
          Slides as a list; current slide
          announced. Pause control accessible.
          Indicators are real buttons. Tab
          order through slides logical.
          Respect <code>prefers-reduced-motion</code>{" "}
          for autoplay and transitions.
        </p>

        <h3>Maintainability</h3>
        <p>
          Slides as children with stable
          keys. Configurable timing,
          orientation, loop.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/carousel-slider-architecture.svg"
        alt="Carousel / Slider Architecture"
        caption="Slides container with scroll-snap → IntersectionObserver lazy-load + Pointer Events for swipe + Autoplay timer (pauses on hover/focus). Indicators (dots) and prev/next buttons drive scroll position. Keyboard arrows navigate."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
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
        </p>
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
        <p>
          On <strong>autoplay</strong>: a timer
          fires every N seconds calling next.
          On hover, focus, or manual
          interaction (click button or swipe),
          pause. Configurable: pause on hover,
          stop on manual (don&rsquo;t resume
          autoplay after manual interaction —
          users have indicated control).
        </p>
        <p>
          On <strong>lazy-load</strong>: each
          slide observes its own visibility
          via IntersectionObserver. When a
          slide approaches the viewport
          (within ~1.5x viewport width), load
          its content. Off-screen slides
          render placeholders.
        </p>
        <p>
          <strong>Indicators</strong>: pagination
          dots show current and total slide
          count. Each dot is a button that
          scrolls to that slide. Active dot
          updates from scroll position
          (IntersectionObserver detects which
          slide is most visible).
        </p>
        <p>
          <strong>Keyboard navigation</strong>:
          arrow keys move slides when the
          carousel has focus. Tab moves
          between interactive slide content
          (CTA buttons within slides).
        </p>
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
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>Carousel</strong> is the
          container. <strong>SlidesTrack</strong>{" "}
          renders the scrollable slides.
          <strong> Slide</strong> renders one
          slide. <strong>NavButtons</strong>{" "}
          (prev/next).
          <strong> Indicators</strong>{" "}
          (dots). <strong>AutoplayController</strong>{" "}
          handles the timer.
          <strong> LazyLoadObserver</strong>{" "}
          handles intersection-based loading.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Active slide index derived from
          scroll position. Autoplay state
          (running/paused) component-local.
          Lazy-load status per slide.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>slides</code> (array of
          renderables or React children),
          <code> autoplay</code>,
          <code> interval</code>,
          <code> loop</code>,
          <code> visibleSlides</code>,
          <code> orientation</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Native scroll handles momentum.
          Lazy-load defers off-screen content.
          IntersectionObserver runs off-main.
          Scroll-snap is GPU-accelerated.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Smooth swipe. Subtle prev/next
          buttons. Dots for navigation.
          Autoplay considerate (pauses on
          hover, stops on manual). Lazy-load
          placeholder matches slide layout
          (no layout shift on load).
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Use
          <code> role=&quot;region&quot;</code> with
          <code> aria-roledescription=&quot;carousel&quot;</code>.
          Slides as list with current
          announced. Pause/play button. Dots
          as labeled buttons. Respect{" "}
          <code>prefers-reduced-motion</code>.
          Keyboard navigation works.
          Screen-reader users can disable
          autoplay.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Slide content sanitized.
          External resources via CSP.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Swipe and click tests. Autoplay
          pause behavior. Loop mode boundary
          tests. Lazy-load tests.
          Accessibility tests.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Single slide: hide navigation;
          treat as static. Loop with all
          slides identical: still functions.
          Network slow on lazy-load: show
          placeholder until ready. Browser
          without scroll-snap: fall back to
          JS-driven smooth scroll. User has
          reduced-motion: autoplay off,
          transitions instant. Carousel in
          viewport multiple times (rare but
          possible): each instance independent.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic over slide content.
          Configurable per use case.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Button labels via i18n. Indicator
          aria-labels (&ldquo;Slide 3 of
          7&rdquo;) localized via Intl. RTL
          flips slide direction.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Native scroll vs JS-driven</h3>
        <p>
          Native scroll-snap is simpler,
          smoother on touch, GPU-accelerated.
          JS-driven gives more control but
          rebuilds momentum and snap from
          scratch. Native is the right
          default.
        </p>

        <h3>Loop via clones vs JS-jump</h3>
        <p>
          Clones are simpler with native
          scroll-snap. JS-jump requires
          intercepting scroll. Clones win
          for the native approach.
        </p>

        <h3>Autoplay default on vs off</h3>
        <p>
          Default off respects user attention.
          Configurable per consumer. Some
          marketing pages need autoplay; many
          others don&rsquo;t.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          3D effects, parallax, video slides,
          AR slides, smart adaptive sizing.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why use native
          scroll-snap?</strong> Browser-optimized,
          GPU-accelerated, smooth on touch
          out of the box. JS-driven would
          rebuild this from scratch.
        </p>

        <p>
          <strong>2. How does loop work?</strong>{" "}
          Clone first slide after last and
          vice versa. When user scrolls to a
          clone, jump (without animation) to
          the real corresponding slide.
        </p>

        <p>
          <strong>3. How does autoplay respect
          users?</strong> Pause on hover/focus.
          Stop after manual interaction.
          Disabled by default under
          prefers-reduced-motion.
        </p>

        <p>
          <strong>4. How is lazy-load
          implemented?</strong>{" "}
          IntersectionObserver per slide;
          content loads when slide is
          near-viewport.
        </p>

        <p>
          <strong>5. How is the active slide
          tracked?</strong> Derived from scroll
          position via IntersectionObserver
          detecting the most-visible slide.
        </p>

        <p>
          <strong>6. How is accessibility
          handled?</strong> Region role with
          carousel description. Slides as
          list with current announced.
          Pause/play and indicators
          accessible. Reduced motion
          respected.
        </p>

        <p>
          <strong>7. How does keyboard
          navigation work?</strong> Arrow
          keys when carousel has focus. Tab
          for interactive content within
          slides.
        </p>

        <p>
          <strong>8. How does this differ from
          an image gallery?</strong> Carousel
          is a content rotator; image
          gallery is a viewer with zoom and
          drill-in. Both can compose if
          needed.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A carousel is{" "}
          <strong>scroll-snap container +
          prev/next + indicators + autoplay
          (respectful) + lazy-load</strong>.
          Native scroll handles the heavy
          lifting; we add coordination and
          accessibility on top. The result
          is fluid swipe, considerate
          autoplay, and proper a11y.
        </p>
      </section>
    </ArticleLayout>
  );
}
