"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-performance-considerations-60fps-extensive",
  title: "Performance Considerations (60fps)",
  description:
    "Staff-level deep dive into achieving 60fps animation performance covering the rendering pipeline, compositor layers, jank diagnosis, paint profiling, and performance budgeting for smooth motion.",
  category: "frontend",
  subcategory: "animation-transitions",
  slug: "performance-considerations-60fps",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-24",
  tags: [
    "frontend",
    "60fps",
    "animation performance",
    "rendering pipeline",
    "compositor",
    "jank",
    "frame budget",
    "layout thrashing",
  ],
  relatedTopics: [
    "requestAnimationFrame",
    "css-transitions-and-animations",
    "web-animations-api",
  ],
};

export default function PerformanceConsiderations60fpsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>60 frames per second</strong> is the performance target for
          smooth animation on the web. At 60 fps, each frame has a budget of
          16.67 milliseconds to complete all work — JavaScript execution, style
          recalculation, layout, paint, and compositing. When any frame exceeds
          this budget, the browser drops it, producing visible stutter known as{" "}
          <strong>jank</strong>. The human visual system detects frame drops as
          low as a single missed frame in fast-moving content, and sustained
          drops below 30 fps feel distinctly choppy. Modern high-refresh-rate
          displays (120 Hz on iPad Pro, ProMotion iPhones, and gaming monitors)
          shrink the budget to 8.33ms, raising the performance bar even further.
        </p>
        <p>
          Animation performance is fundamentally a rendering pipeline problem.
          The browser processes visual changes through five sequential stages:
          Style (matching CSS selectors and computing values), Layout
          (calculating geometry and position), Paint (rasterizing pixels into
          bitmaps), Composite (combining layers and sending to the GPU), and
          Display (presenting the final frame at the vsync boundary). Different
          CSS property changes trigger different stages — a color change skips
          Layout but triggers Paint and Composite, while a transform change
          skips both Layout and Paint, hitting only Composite. The fewer
          pipeline stages a change triggers, the cheaper it is per frame, and
          the more likely it is to meet the 16.67ms budget.
        </p>
        <p>
          At the staff-engineer level, achieving 60 fps is a systems
          optimization problem that spans CSS architecture, JavaScript
          scheduling, DOM structure, image handling, and device targeting. A
          single layout-triggering animation can cascade into thousands of
          element recalculations on a complex page. A seemingly innocent
          scroll handler that reads <code>offsetHeight</code> forces
          synchronous layout and stalls every frame. A background image resize
          that invalidates a large paint region consumes the entire frame
          budget. Understanding the rendering pipeline at a mechanical level —
          what triggers layout, what triggers paint, what runs on the
          compositor thread — is the prerequisite for diagnosing and preventing
          animation performance issues.
        </p>
        <p>
          The good news is that modern browsers are extraordinarily optimized.
          If you follow the compositor-only property rule (animate only
          transform and opacity), the browser can delegate animation entirely
          to the GPU compositor thread, which runs independently of the main
          thread. This means even a heavily loaded main thread — running React
          re-renders, fetching data, parsing JSON — will not cause animation
          jank. The performance problem only arises when developers inadvertently
          trigger the expensive pipeline stages during animation.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Rendering Pipeline Stages:</strong> Style → Layout → Paint
            → Composite → Display. Each property change triggers a specific
            subset of these stages. <code>transform</code> and{" "}
            <code>opacity</code> trigger only Composite (cheapest).{" "}
            <code>color</code> and <code>background</code> trigger Paint +
            Composite. <code>width</code>, <code>height</code>,{" "}
            <code>margin</code>, <code>padding</code>, <code>top</code>,{" "}
            <code>left</code> trigger Layout + Paint + Composite (most
            expensive). Understanding which properties trigger which stages is
            the foundation of animation performance.
          </li>
          <li>
            <strong>Compositor Thread:</strong> A dedicated browser thread that
            handles the final compositing step — positioning, scaling, and
            blending GPU texture layers into the final frame. Animations on{" "}
            <code>transform</code> and <code>opacity</code> run entirely on
            this thread, independent of the main thread. This is why
            compositor-only animations maintain 60 fps even during heavy
            JavaScript execution.
          </li>
          <li>
            <strong>GPU Compositing Layers:</strong> Elements promoted to their
            own compositing layer are rasterized into GPU textures that can be
            independently transformed, faded, and positioned. Promotion happens
            via <code>will-change</code>, <code>transform</code>,{" "}
            <code>opacity</code>, <code>position: fixed</code>, or explicit
            3D transforms. Each layer consumes GPU memory (width × height × 4
            bytes × devicePixelRatio²), so over-promotion wastes memory.
          </li>
          <li>
            <strong>Layout Thrashing:</strong> The pattern of interleaving DOM
            reads (offsetHeight, getBoundingClientRect) and writes (style
            changes) forces the browser to perform synchronous layout
            recalculation between each read. In an animation loop, this can
            trigger dozens of layout passes per frame, easily exceeding the
            16.67ms budget. The fix is to batch all reads first, then all
            writes.
          </li>
          <li>
            <strong>Paint Complexity:</strong> Some CSS properties are more
            expensive to paint than others. <code>box-shadow</code>,{" "}
            <code>border-radius</code> on large elements,{" "}
            <code>backdrop-filter</code>, and complex gradients require more
            GPU shader time. Animating the spread or blur radius of a box-shadow
            is significantly more expensive than animating opacity.
          </li>
          <li>
            <strong>Forced Synchronous Layout:</strong> Reading a layout
            property after invalidating layout (by writing a style) forces
            the browser to immediately recalculate layout to return an accurate
            value. This is called a forced synchronous layout and is the
            single most common cause of animation jank. It appears in Chrome
            DevTools as a purple &quot;Layout&quot; block with a warning
            triangle.
          </li>
          <li>
            <strong>Frame Budget Allocation:</strong> The 16.67ms budget must
            be shared between your JavaScript code and the browser&apos;s
            rendering work. Aim for your rAF callback to complete in under
            10ms, leaving 6-7ms for style, layout, paint, and composite. On
            120 Hz displays, your callback budget shrinks to under 5ms.
          </li>
          <li>
            <strong>Long Tasks:</strong> Any JavaScript execution that blocks
            the main thread for over 50ms is classified as a Long Task by the
            Performance Observer API. Long tasks during animation cause
            multiple consecutive frame drops, producing visible stutter.
            Breaking long tasks into smaller chunks using{" "}
            <code>scheduler.yield()</code> or <code>setTimeout(fn, 0)</code>{" "}
            allows the browser to interleave rendering frames.
          </li>
          <li>
            <strong>Jank Metrics:</strong> Frame timing can be measured with{" "}
            <code>PerformanceObserver</code> observing{" "}
            <code>long-animation-frame</code> entries, or via Chrome
            DevTools&apos; Performance panel which shows frame-by-frame timing
            with color-coded bars (green for on-budget, yellow for warning,
            red for over-budget). Cumulative Layout Shift (CLS) measures
            unexpected layout shifts that contribute to perceived jank.
          </li>
          <li>
            <strong>Adaptive Quality:</strong> When an animation detects
            that frame timing is approaching the budget limit, it can reduce
            quality to maintain frame rate — fewer particles in a particle
            system, lower resolution canvas rendering, simplified physics.
            This approach, common in game engines, prioritizes consistent
            frame rate over visual fidelity, which users perceive as smoother
            than intermittent high-quality frames with jank.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/performance-considerations-60fps-diagram-1.svg"
          alt="Rendering pipeline showing which CSS properties trigger which stages and their cost hierarchy"
          caption="Figure 1: CSS property cost hierarchy — different properties trigger different pipeline stages with varying performance impact"
        />
        <p>
          The rendering pipeline cost hierarchy is the single most important
          mental model for animation performance. At the cheapest level,{" "}
          <code>transform</code> and <code>opacity</code> changes skip Layout
          and Paint entirely, going straight to the Composite stage on the
          compositor thread. Mid-cost properties like <code>color</code>,{" "}
          <code>background-color</code>, and <code>visibility</code> skip
          Layout but trigger Paint. The most expensive properties —{" "}
          <code>width</code>, <code>height</code>, <code>padding</code>,{" "}
          <code>margin</code>, <code>font-size</code>, and positional
          properties — trigger the full Layout → Paint → Composite pipeline on
          the main thread. When multiple elements are affected by a layout
          change (e.g., resizing a flex container), the cost multiplies by the
          number of affected elements.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/performance-considerations-60fps-diagram-2.svg"
          alt="Frame timeline showing 16.67ms budget allocation between JavaScript, style, layout, paint, and composite"
          caption="Figure 2: Frame budget allocation — 16.67ms must accommodate JS execution, style recalc, layout, paint, and composite"
        />
        <p>
          A single frame at 60 fps has exactly 16.67ms to complete all work.
          The browser allocates this time across the rendering pipeline stages.
          Your JavaScript (rAF callbacks, event handlers) runs first, typically
          consuming 3-8ms for moderate workloads. Style recalculation runs
          next — matching CSS selectors to DOM elements can take 1-4ms on
          complex pages with thousands of elements. Layout follows at 1-5ms
          for incremental changes, or 10ms+ for full-page reflows. Paint
          rasterizes affected regions at 1-3ms for small areas, or 5-10ms for
          large or complex regions. Composite typically takes under 1ms. If
          the total exceeds 16.67ms, the frame is dropped. This is why
          compositor-only animations work so well — they eliminate the most
          expensive stages from the pipeline.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/performance-considerations-60fps-diagram-3.svg"
          alt="Layout thrashing example showing interleaved reads and writes versus batched approach"
          caption="Figure 3: Layout thrashing vs batched DOM access — interleaving reads/writes forces multiple synchronous layouts per frame"
        />
        <p>
          Layout thrashing is best illustrated with a concrete example. Imagine
          an animation loop that positions five elements based on each
          other&apos;s height. The naive approach reads element A&apos;s height,
          sets element B&apos;s top, reads element B&apos;s height, sets
          element C&apos;s top, and so on. Each read-after-write pair forces a
          synchronous layout pass because the browser must recalculate
          positions to return an accurate value. Five elements produce five
          layout passes per frame. The batched approach reads all five heights
          into variables first, then sets all five tops. One layout pass covers
          all reads, and one covers all writes — two passes instead of five.
          For lists with hundreds of items, the difference between thrashing
          and batching can be two orders of magnitude in layout time.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-theme p-2 bg-panel text-left">
                Optimization Strategy
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                Benefit
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                Cost / Risk
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                When to Use
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Compositor-only properties
              </td>
              <td className="border border-theme p-2">
                Skips layout and paint entirely, runs on GPU
              </td>
              <td className="border border-theme p-2">
                Limited to transform, opacity, filter — design constraint
              </td>
              <td className="border border-theme p-2">
                Always — this is the default animation strategy
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Layer promotion (will-change)
              </td>
              <td className="border border-theme p-2">
                Eliminates first-frame layer creation jank
              </td>
              <td className="border border-theme p-2">
                GPU memory per layer; excess promotion degrades performance
              </td>
              <td className="border border-theme p-2">
                On elements about to animate, removed after animation
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                FLIP technique
              </td>
              <td className="border border-theme p-2">
                Converts layout changes to compositor-only transforms
              </td>
              <td className="border border-theme p-2">
                Implementation complexity; requires getBoundingClientRect reads
              </td>
              <td className="border border-theme p-2">
                List reordering, grid changes, shared-element transitions
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Web Worker offloading
              </td>
              <td className="border border-theme p-2">
                Heavy computation off main thread, freeing frame budget
              </td>
              <td className="border border-theme p-2">
                Serialization overhead; no DOM access from worker
              </td>
              <td className="border border-theme p-2">
                Physics simulation, particle systems, data processing
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                OffscreenCanvas
              </td>
              <td className="border border-theme p-2">
                Canvas rendering on worker thread at full frame rate
              </td>
              <td className="border border-theme p-2">
                Browser support; limited API surface compared to main canvas
              </td>
              <td className="border border-theme p-2">
                WebGL scenes, data visualizations, game rendering
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Content-visibility: auto
              </td>
              <td className="border border-theme p-2">
                Skips layout and paint for off-screen content
              </td>
              <td className="border border-theme p-2">
                Scrollbar accuracy affected; CLS risk if heights not specified
              </td>
              <td className="border border-theme p-2">
                Long pages with many sections below the fold
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Audit all animated properties with CSS Triggers:</strong>{" "}
            Before animating any property, check whether it triggers layout,
            paint, or composite only. Replace layout-triggering animations
            with transform equivalents: <code>transform: scale()</code>{" "}
            instead of width/height, <code>transform: translate()</code>{" "}
            instead of top/left/margin.
          </li>
          <li>
            <strong>Profile with Chrome DevTools Performance panel:</strong>{" "}
            Record a performance trace during the animation. Look for long
            frames (red bars), forced synchronous layout (purple blocks with
            warning triangles), excessive paint regions (enable Paint Flashing),
            and unnecessary layer promotions (Layers panel). Diagnose before
            optimizing — guessing at performance problems is unreliable.
          </li>
          <li>
            <strong>Batch DOM reads and writes with the read-write pattern:</strong>{" "}
            In any rAF callback or event handler that touches multiple elements,
            read all layout values first, compute all new values, then write
            all changes. Never interleave reads and writes within the same
            synchronous execution context.
          </li>
          <li>
            <strong>Use passive event listeners for scroll and touch:</strong>{" "}
            Marking scroll and touch handlers as <code>passive: true</code>{" "}
            tells the browser the handler will not call{" "}
            <code>preventDefault()</code>, allowing it to start scrolling
            immediately without waiting for the handler to complete. This
            eliminates scroll delay and improves animation smoothness during
            scroll-linked effects.
          </li>
          <li>
            <strong>Test on representative low-end devices:</strong> An
            animation that runs smoothly on a developer&apos;s MacBook Pro may
            drop frames on a budget Android phone with 2 GB RAM and a
            mid-range GPU. Use Chrome DevTools CPU throttling (4x, 6x) during
            development and test on real devices periodically.
          </li>
          <li>
            <strong>Minimize paint area and complexity:</strong> Avoid animating
            large box-shadows, complex gradients, or backdrop-filter on
            large elements. If a decorative shadow must animate, consider
            using a pseudo-element with a pre-rendered shadow image and
            animate its opacity instead of recomputing the shadow each frame.
          </li>
          <li>
            <strong>Use content-visibility for off-screen content:</strong>{" "}
            Apply <code>content-visibility: auto</code> to sections far below
            the viewport. The browser skips layout and paint for these
            sections entirely, reducing the total work per frame and freeing
            budget for visible animations.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Animating left/top instead of transform:</strong> The most
            common animation performance mistake. Moving an absolutely
            positioned element with <code>left</code> triggers layout
            recalculation every frame. Using{" "}
            <code>transform: translateX()</code> is orders of magnitude cheaper
            because it only triggers compositing.
          </li>
          <li>
            <strong>Over-promoting with will-change:</strong> Applying{" "}
            <code>will-change: transform</code> to hundreds of elements
            creates hundreds of GPU layers, each consuming significant memory.
            On mobile devices with limited GPU memory, this causes the browser
            to fall back to software rendering, which is slower than no
            promotion at all.
          </li>
          <li>
            <strong>Layout thrashing in animation loops:</strong> Reading{" "}
            <code>element.offsetHeight</code> between style writes inside a
            rAF callback forces synchronous layout. For n elements, this
            produces n layout passes per frame instead of one.
          </li>
          <li>
            <strong>Ignoring paint complexity:</strong> Animating{" "}
            <code>box-shadow</code> spread, <code>border-radius</code> on
            large elements, or <code>backdrop-filter</code> blur radius is
            expensive paint work that can exceed the frame budget even without
            layout involvement.
          </li>
          <li>
            <strong>Not yielding during long JavaScript tasks:</strong> A
            1-second JavaScript computation blocks the main thread for 60+
            frames. Break long computations using{" "}
            <code>scheduler.yield()</code>, <code>scheduler.postTask()</code>,
            or chunked processing with <code>setTimeout</code> to allow the
            browser to render frames between computation chunks.
          </li>
          <li>
            <strong>Large images during scroll animations:</strong> Decoding
            and rasterizing large images (hero images, background photos) can
            consume significant paint time. Pre-decode images with{" "}
            <code>img.decode()</code> before they enter the viewport, and use
            appropriately sized images via <code>srcset</code> to minimize
            rasterization cost.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Google Maps:</strong> Achieves 60 fps pan and zoom on a
            complex WebGL canvas by offloading tile rendering to Web Workers,
            using OffscreenCanvas for tile rasterization, and limiting
            main-thread work to input handling and UI overlay updates. The map
            canvas runs on a separate rendering pipeline from the DOM UI.
          </li>
          <li>
            <strong>Twitter/X Timeline:</strong> Maintains smooth scrolling
            through a virtualized list of tweets by rendering only the visible
            portion of the timeline. Scroll-linked animations (sticky headers,
            new tweet indicators) use transform-only properties to avoid
            triggering layout during scroll. Passive scroll listeners ensure
            the browser&apos;s scroll thread is not blocked.
          </li>
          <li>
            <strong>Figma:</strong> Runs an entire vector editing canvas at
            60 fps via WebGL, using a custom rendering engine that batches draw
            calls, caches rasterized vector paths, and performs hit-testing
            with spatial indices. Heavy operations like boolean operations and
            export are offloaded to Web Workers using WebAssembly for
            near-native performance.
          </li>
          <li>
            <strong>Notion:</strong> Optimizes block-level animation in their
            editor by using Framer Motion&apos;s layout animations for block
            reordering. Each block is promoted to its own compositing layer
            only during drag operations, then de-promoted after the animation
            settles to conserve GPU memory during normal editing.
          </li>
        </ul>
      </section>

      {/* Section 8: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              Why do animations on transform and opacity perform better than
              animations on width, height, or top?
            </p>
            <p className="mt-2">
              Transform and opacity changes are handled entirely by the
              compositor thread and the GPU. The browser already has the
              element rasterized as a GPU texture layer — animating transform
              simply repositions, scales, or rotates that texture, and
              animating opacity adjusts its alpha blending. No pixel data
              needs to be recalculated. Width, height, and positional property
              changes trigger the Layout stage, which recalculates the geometry
              of the element and potentially all surrounding elements, followed
              by Paint which re-rasterizes the affected area, followed by
              Composite. This full pipeline runs on the main thread within
              the 16.67ms frame budget, competing with JavaScript execution.
              A complex page with deep nesting can easily spend 10-15ms on
              layout alone, leaving no budget for anything else.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              What is layout thrashing and how do you fix it?
            </p>
            <p className="mt-2">
              Layout thrashing occurs when code alternates between reading
              layout properties and writing styles in the same synchronous
              execution. Each read after a write forces the browser to
              immediately recalculate layout to return a current value. For
              example, in a loop that reads each element&apos;s height then
              sets the next element&apos;s top position, each iteration triggers
              a full layout pass. The fix is the read-write batch pattern: read
              all values into variables first, then write all style changes
              afterward. This allows the browser to process one read layout,
              then one write layout — two passes instead of n passes.
              Libraries like FastDOM formalize this by queueing reads and writes
              into separate microtask phases.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              How do you diagnose a janky animation using Chrome DevTools?
            </p>
            <p className="mt-2">
              Open the Performance panel and record while the animation runs.
              Look for: (1) Long frames shown as tall bars exceeding the
              16.67ms line — these are dropped frames. (2) Yellow blocks
              labeled &quot;Scripting&quot; that exceed 10ms, indicating
              JavaScript is consuming too much of the frame budget. (3)
              Purple blocks labeled &quot;Layout&quot; with warning triangles,
              indicating forced synchronous layout. (4) Green blocks labeled
              &quot;Paint&quot; covering large areas, indicating expensive
              repaint regions. (5) In the Layers panel, check for excessive
              compositing layers consuming GPU memory. The Rendering tab offers
              Paint Flashing (highlights repainted areas in green) and Layout
              Shift Regions for quick visual diagnosis without recording a
              trace.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              How would you optimize a scroll-driven parallax effect that is
              janking?
            </p>
            <p className="mt-2">
              First, identify the bottleneck. If the scroll handler does
              computation on every scroll event, switch to rAF throttling (set
              a flag, process once per frame). If the handler reads layout
              properties, cache them outside the scroll handler and only
              re-read on resize. If the parallax applies translate via
              JavaScript, verify it is setting <code>transform</code>, not{" "}
              <code>top</code>/<code>margin-top</code>. If all of the above
              are correct and it still janks, migrate to CSS{" "}
              <code>animation-timeline: scroll()</code> or WAAPI{" "}
              <code>ScrollTimeline</code>, which run entirely on the compositor
              thread without any JavaScript in the scroll path. Finally, ensure
              the scroll handler uses a passive event listener so the browser
              does not wait for JavaScript before starting the scroll.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              What strategies help maintain 60fps on low-end mobile devices?
            </p>
            <p className="mt-2">
              Five strategies: (1) Strict compositor-only animation — no
              layout-triggering properties under any circumstance. (2) Minimize
              layer count — only promote elements that are actively animating,
              de-promote after animation ends to conserve the limited GPU
              memory on mobile. (3) Reduce paint complexity — avoid animating
              box-shadow, backdrop-filter, and complex gradients on
              resource-constrained devices. (4) Use{" "}
              <code>content-visibility: auto</code> aggressively on off-screen
              content to skip layout and paint for invisible sections. (5)
              Implement adaptive quality — detect frame drops via Performance
              Observer and reduce animation complexity (fewer particles, simpler
              easing, skip decorative animations) to maintain frame rate. The
              goal is consistent 60 fps, even if visual richness is reduced.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References & Further Reading */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/rendering-performance/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Rendering Performance
            </a>{" "}
            — Google&apos;s definitive guide to the browser rendering pipeline
          </li>
          <li>
            <a
              href="https://csstriggers.com/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CSS Triggers
            </a>{" "}
            — Reference of which CSS properties trigger layout, paint, or
            composite
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/devtools/performance/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome DevTools — Performance Analysis
            </a>{" "}
            — Guide to frame-by-frame rendering performance diagnosis
          </li>
          <li>
            <a
              href="https://web.dev/optimize-long-tasks/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Optimize Long Tasks
            </a>{" "}
            — Strategies for breaking up long JavaScript tasks
          </li>
          <li>
            <a
              href="https://developer.chrome.com/blog/inside-browser-part3/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Inside Look at Modern Web Browser (Part 3)
            </a>{" "}
            — Chrome&apos;s compositing and rendering architecture explained
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
