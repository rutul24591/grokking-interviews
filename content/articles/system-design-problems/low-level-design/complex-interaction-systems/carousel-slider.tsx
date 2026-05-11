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

export default function CarouselSliderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

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
        <h2>Functional Requirements</h2>

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
        <h2>Non-Functional Requirements</h2>

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

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/complex-interaction-systems/carousel-slider-architecture.svg"
        alt="Carousel / Slider Architecture"
        caption="Slides container with scroll-snap → IntersectionObserver lazy-load + Pointer Events for swipe + Autoplay timer (pauses on hover/focus). Indicators (dots) and prev/next buttons drive scroll position. Keyboard arrows navigate."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
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
        <h2>🧱 Component Architecture</h2>
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
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Active slide index derived <Highlight tier="important">from
          scroll position. Autoplay state
          (running/paused)</Highlight> component-local.
          Lazy-load status per slide.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
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
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Native scroll handles momentum.
          <Highlight tier="important">Lazy-load defers off-screen content.
          IntersectionObserver runs</Highlight> off-main.
          Scroll-snap is GPU-accelerated.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
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
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Dots
          as labeled buttons. Respect{" "}
          <Highlight tier="important"><code>prefers-reduced-motion</code></Highlight>.</HighlightBlock>
<HighlightBlock as="p" tier="important">Keyboard navigation works.
          Screen-reader users can disable
          autoplay.</HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Slide content sanitized.
          External resources via <Highlight tier="important">CSP</Highlight>.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Swipe and click tests. <Highlight tier="important">Autoplay
          pause behavior. Loop mode boundary</Highlight>
          tests. Lazy-load tests.
          Accessibility tests.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Browser
          without scroll-snap: fall back to
          JS-driven smooth scroll. User has
          reduced-motion: autoplay off,</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">transitions instant. Carousel in
          viewport multiple times (rare but
          possible): each instance independent.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over slide content.
          <Highlight tier="important">Configurable</Highlight> per use case.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Button labels via i18n. Indicator
          <Highlight tier="important">aria-labels (&ldquo;Slide 3 of
          7&rdquo;) localized</Highlight> via Intl. RTL
          flips slide direction.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

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
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          3D effects, <Highlight tier="important">parallax, video slides,
          AR slides, smart</Highlight> adaptive sizing.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. Why use native
          scroll-snap?</strong> Browser-optimized,
          GPU-accelerated, smooth on touch
          out of the box. JS-driven would
          rebuild this from scratch.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How does loop work?</strong>{" "}
          Clone first slide after last and
          vice versa. When user scrolls to a
          clone, jump (without animation) to
          the real corresponding slide.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>3. How does autoplay respect
          users?</strong> Pause on hover/focus.
          Stop after manual interaction.
          Disabled by default under
          prefers-reduced-motion.
        </HighlightBlock>

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

        <HighlightBlock as="p" tier="important">
          <strong>6. How is accessibility
          handled?</strong> Region role with
          carousel description. Slides as
          list with current announced.
          Pause/play and indicators
          accessible. Reduced motion
          respected.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>7. How does keyboard
          navigation work?</strong> Arrow
          keys when carousel has focus. Tab
          for interactive content within
          slides.
        </HighlightBlock>

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
        <HighlightBlock as="p" tier="crucial">Native scroll handles the heavy
          lifting; we add coordination and
          accessibility</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">on top. The result
          is fluid swipe, considerate
          autoplay, and proper a11y.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
