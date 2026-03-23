"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-request-animation-frame-extensive",
  title: "requestAnimationFrame",
  description:
    "Staff-level deep dive into requestAnimationFrame covering the browser rendering loop, frame timing, animation scheduling, throttling patterns, and building performant custom animation loops.",
  category: "frontend",
  subcategory: "animation-transitions",
  slug: "request-animation-frame",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-24",
  tags: [
    "frontend",
    "requestAnimationFrame",
    "animation loop",
    "browser rendering",
    "frame timing",
    "vsync",
    "performance",
  ],
  relatedTopics: [
    "performance-considerations-60fps",
    "css-transitions-and-animations",
    "web-animations-api",
  ],
};

export default function RequestAnimationFrameArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>requestAnimationFrame</strong> (rAF) is a browser API that
          schedules a callback to execute just before the browser performs its
          next paint. It is the fundamental timing primitive for all imperative
          JavaScript animations, visual updates, and any operation that needs
          to synchronize with the display refresh rate. When you call{" "}
          <code>requestAnimationFrame(callback)</code>, the browser queues your
          function to run at the optimal time in the rendering pipeline — after
          input processing and before layout, paint, and composite — ensuring
          your visual updates are captured in the next frame.
        </p>
        <p>
          Before rAF, developers used <code>setTimeout</code> or{" "}
          <code>setInterval</code> with a 16ms delay to approximate 60 fps.
          This approach was fundamentally flawed for three reasons. First,
          timer-based callbacks are not synchronized with the display&apos;s
          vertical sync (vsync) signal, so updates might arrive mid-frame or
          just after a frame deadline, causing missed frames and visible
          tearing. Second, timers continue firing when the browser tab is in
          the background, wasting CPU and battery. Third, timer accuracy is
          subject to event loop congestion — a busy main thread delays the
          callback, causing inconsistent frame timing. rAF solves all three:
          it fires at vsync boundaries, pauses when the tab is hidden, and
          the browser can batch and prioritize rAF callbacks for optimal
          rendering throughput.
        </p>
        <p>
          At the staff-engineer level, understanding rAF is essential because
          it underpins every animation library (GSAP, Framer Motion, Three.js),
          every game loop, every canvas-based visualization, and many
          non-animation use cases like debouncing scroll handlers, batching DOM
          reads, and implementing smooth scrubbing for media players. When you
          debug a janky animation, the root cause is almost always something
          happening inside or around the rAF callback: too much computation,
          layout thrashing, or not yielding to the browser between frames.
          Understanding where rAF sits in the browser&apos;s task scheduling
          model — and how it interacts with microtasks, macrotasks, and the
          rendering pipeline — is what separates competent frontend engineers
          from expert ones.
        </p>
        <p>
          Modern alternatives have emerged but none replace rAF. The Web
          Animations API (WAAPI) and CSS animations run on the compositor
          thread, bypassing JavaScript entirely — they are preferred when
          possible. But for dynamic animations where values depend on runtime
          state (game physics, data-driven visualizations, gesture tracking),
          rAF remains the only option. The{" "}
          <code>requestIdleCallback</code> API handles low-priority work during
          idle periods but is not suitable for animation because it does not
          guarantee execution before the next paint.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Frame Budget:</strong> At 60 fps, each frame has 16.67ms
            (1000ms ÷ 60) for all work: JavaScript execution, style
            recalculation, layout, paint, and composite. At 120 fps (iPad Pro,
            newer phones), the budget shrinks to 8.33ms. Your rAF callback
            must complete well within this budget — ideally under 10ms at
            60 fps — to leave room for the browser&apos;s rendering work.
          </li>
          <li>
            <strong>High-Resolution Timestamp:</strong> The rAF callback
            receives a <code>DOMHighResTimeStamp</code> parameter representing
            the time at which the frame began, measured from{" "}
            <code>performance.timeOrigin</code>. This timestamp is consistent
            across all rAF callbacks in the same frame and should be used for
            computing animation progress. Never use <code>Date.now()</code> in
            animation loops — it has millisecond precision and is susceptible to
            system clock adjustments.
          </li>
          <li>
            <strong>Delta Time:</strong> The difference between the current
            frame&apos;s timestamp and the previous frame&apos;s timestamp.
            Animation progress should be computed as a function of delta time,
            not frame count, to ensure consistent speed regardless of frame
            rate. An animation that moves 100px over 1 second should advance
            100 × (deltaTime / 1000) pixels per frame, whether running at
            30 fps or 120 fps.
          </li>
          <li>
            <strong>Background Tab Throttling:</strong> Browsers throttle rAF
            to at most 1 fps (or pause entirely) when the tab is not visible.
            This conserves CPU and battery. Animations resume from where they
            left off when the tab regains focus, which can cause a large delta
            time spike. Guard against this by capping delta time to a maximum
            (e.g., 100ms) to prevent animations from jumping forward.
          </li>
          <li>
            <strong>cancelAnimationFrame:</strong> Returns an integer ID that
            can be passed to <code>cancelAnimationFrame()</code> to cancel a
            pending callback. Essential for cleanup when a component unmounts
            or an animation is interrupted. Failing to cancel creates memory
            leaks — the callback retains references to the component&apos;s
            scope even after unmount.
          </li>
          <li>
            <strong>Microtask Flushing:</strong> Microtasks (Promises,
            MutationObserver callbacks) are flushed between each macrotask,
            including between rAF callbacks and the rendering pipeline. A
            resolved Promise chain inside a rAF callback executes synchronously
            before the browser paints, which can unexpectedly extend frame
            time. Be aware that awaited Promises inside rAF do not pause the
            frame — the callback returns and the rest runs as a microtask.
          </li>
          <li>
            <strong>rAF Batching:</strong> Multiple rAF calls in the same frame
            are batched — all callbacks execute in the same frame in the order
            they were registered. Libraries use this to batch animation updates:
            GSAP registers a single rAF callback and processes all active
            tweens within it, rather than registering a separate rAF per tween.
          </li>
          <li>
            <strong>Double-rAF Pattern:</strong> Calling{" "}
            <code>requestAnimationFrame(() =&gt; requestAnimationFrame(fn))</code>{" "}
            defers execution to the frame after the next paint. This is useful
            when you need to ensure the browser has processed a DOM change
            before measuring layout — the first rAF triggers after style/layout,
            and the second ensures a full render cycle has completed.
          </li>
          <li>
            <strong>Frame Dropping:</strong> If a rAF callback takes longer
            than the frame budget, the browser skips that frame entirely — no
            paint occurs, and the next rAF fires at the next vsync boundary.
            This is visible as &quot;jank&quot; or &quot;stutter.&quot; Chrome
            DevTools&apos; Performance panel highlights long frames in red.
          </li>
          <li>
            <strong>Offscreen Canvas:</strong> For heavy canvas rendering, an{" "}
            <code>OffscreenCanvas</code> can be transferred to a Web Worker,
            which runs its own rAF loop independently of the main thread. This
            allows complex 2D or WebGL rendering to run at full frame rate even
            while the main thread handles user input and DOM updates.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/request-animation-frame-diagram-1.svg"
          alt="Browser frame lifecycle showing the ordering of input, rAF, style, layout, paint, and composite phases"
          caption="Figure 1: Browser frame lifecycle — rAF callback executes after input processing but before style/layout/paint"
        />
        <p>
          Each browser frame follows a deterministic sequence. First, the
          browser processes pending input events (click, scroll, keydown).
          Then it fires all registered rAF callbacks in registration order.
          Then it runs style recalculation (matching CSS selectors, computing
          values), layout (calculating geometry), paint (rasterizing pixels),
          and composite (combining layers for display). Your rAF callback runs
          at the ideal position: after input is known but before rendering, so
          your DOM mutations are captured in the current frame&apos;s paint.
          If your callback takes too long and pushes past the vsync deadline,
          the entire frame is dropped.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/request-animation-frame-diagram-2.svg"
          alt="Animation loop architecture showing delta time computation, state update, render, and frame scheduling"
          caption="Figure 2: Custom animation loop pattern with delta time normalization and frame budget monitoring"
        />
        <p>
          A well-structured animation loop separates concerns into three
          phases: compute, apply, and schedule. The compute phase uses the
          delta time to calculate new animation values (positions, opacities,
          rotations) without touching the DOM. The apply phase writes all
          computed values to the DOM in a single batch, avoiding interleaved
          reads and writes that cause layout thrashing. The schedule phase
          calls <code>requestAnimationFrame</code> to queue the next iteration.
          Storing the rAF ID allows cancellation from outside the loop. Adding
          a <code>performance.now()</code> check at the end of the compute
          phase helps detect when the callback exceeds its frame budget,
          enabling adaptive quality reduction (fewer particles, simpler
          physics) before jank becomes visible.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/request-animation-frame-diagram-3.svg"
          alt="Comparison of setTimeout vs requestAnimationFrame timing relative to vsync boundaries"
          caption="Figure 3: setTimeout vs rAF timing — rAF aligns with vsync while setTimeout drifts and misses frames"
        />
        <p>
          The timing diagram illustrates why rAF is fundamentally superior to
          setTimeout for animation. The display refreshes at vsync boundaries
          (every 16.67ms at 60 Hz). rAF callbacks fire just before each
          boundary, ensuring updates are captured in the next paint.
          setTimeout(fn, 16) fires approximately 16ms after the previous
          execution, but timer resolution, event loop congestion, and
          accumulated drift cause the callback to sometimes land just after a
          vsync boundary, missing the frame entirely. Over time, setTimeout
          drift causes periodic double-frame pauses — visible as stuttering
          even when each individual callback completes quickly. rAF eliminates
          this class of bug entirely by letting the browser control the timing.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparisons */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-theme p-2 bg-panel text-left">
                Aspect
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                requestAnimationFrame
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                CSS Animations / WAAPI
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                setTimeout / setInterval
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Thread
              </td>
              <td className="border border-theme p-2">
                Main thread — competes with JS execution
              </td>
              <td className="border border-theme p-2">
                Compositor thread — runs independently of main thread
              </td>
              <td className="border border-theme p-2">
                Main thread — same event loop as all other tasks
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Vsync Sync
              </td>
              <td className="border border-theme p-2">
                Yes — fires at optimal time before each paint
              </td>
              <td className="border border-theme p-2">
                Yes — browser handles timing natively
              </td>
              <td className="border border-theme p-2">
                No — timer-based, drifts from vsync boundaries
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Background Behavior
              </td>
              <td className="border border-theme p-2">
                Throttled to ~1 fps or paused when tab hidden
              </td>
              <td className="border border-theme p-2">
                Continues but no visual updates until visible
              </td>
              <td className="border border-theme p-2">
                Throttled to 1 fps minimum but still fires
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Dynamic Values
              </td>
              <td className="border border-theme p-2">
                Full runtime computation — physics, state, input
              </td>
              <td className="border border-theme p-2">
                Fixed keyframes — no runtime value computation
              </td>
              <td className="border border-theme p-2">
                Full runtime computation but with timing issues
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Best For
              </td>
              <td className="border border-theme p-2">
                Game loops, physics, canvas, dynamic data viz
              </td>
              <td className="border border-theme p-2">
                UI transitions, hover effects, loading animations
              </td>
              <td className="border border-theme p-2">
                Non-visual polling, not suitable for animation
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
            <strong>Always use delta time for animation progress:</strong>{" "}
            Compute animation advancement as a function of elapsed time, not
            frame count. This ensures consistent animation speed across 60 Hz,
            120 Hz, and variable refresh rate displays. A frame-count-based
            animation runs twice as fast on a 120 Hz display.
          </li>
          <li>
            <strong>Cap delta time to prevent time jumps:</strong> When a tab
            returns from background, the first delta time can be seconds long.
            Clamp it to a maximum (e.g., 100ms) to prevent physics simulations
            from exploding or animations from teleporting to their end state.
          </li>
          <li>
            <strong>Store and cancel the rAF ID on cleanup:</strong> Every
            component that starts a rAF loop must cancel it on unmount.
            Store the ID returned by <code>requestAnimationFrame</code> and
            call <code>cancelAnimationFrame(id)</code> in the cleanup
            function of <code>useEffect</code>.
          </li>
          <li>
            <strong>Batch DOM reads before DOM writes:</strong> Inside a rAF
            callback, first read all necessary layout values (offsetWidth,
            getBoundingClientRect), then write all mutations (style changes,
            class toggles). Interleaving reads and writes triggers synchronous
            layout recalculation between each read, a pattern called layout
            thrashing that devastates frame performance.
          </li>
          <li>
            <strong>
              Use rAF to throttle scroll and resize handlers:
            </strong>{" "}
            Instead of running expensive computation on every scroll event,
            set a flag and process the update in the next rAF callback.
            This naturally limits processing to once per frame and aligns
            updates with the rendering pipeline.
          </li>
          <li>
            <strong>Prefer CSS/WAAPI for simple animations:</strong> If an
            animation has fixed start and end values with no runtime
            computation, CSS transitions or the Web Animations API run on the
            compositor thread without JavaScript involvement. Reserve rAF for
            animations that require dynamic value computation — physics
            simulations, gesture tracking, data-driven updates.
          </li>
          <li>
            <strong>Monitor frame budget in development:</strong> Add a simple
            FPS counter during development that measures the time between rAF
            callbacks. Flag any frame that exceeds the budget. Chrome
            DevTools&apos; Performance panel provides detailed frame-by-frame
            analysis, but a runtime counter catches regressions during regular
            development.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Layout thrashing inside rAF:</strong> Reading{" "}
            <code>element.offsetHeight</code> after setting{" "}
            <code>element.style.height</code> forces the browser to perform a
            synchronous layout. In an animation loop that does this for
            multiple elements, each read-after-write triggers a full layout
            pass, potentially causing dozens of layout recalculations per frame.
            Batch all reads first, then all writes.
          </li>
          <li>
            <strong>Not cancelling rAF on component unmount:</strong> The rAF
            callback closures retain references to the component scope. If the
            loop continues after unmount, it accesses stale state or
            null refs, causing errors and memory leaks. Always store the ID
            and cancel on cleanup.
          </li>
          <li>
            <strong>Using frame count instead of time for animation:</strong>{" "}
            Counting frames and advancing by a fixed amount per frame produces
            animations that run at different speeds on different refresh rate
            displays. A 120 Hz display would play the animation in half the
            time. Always compute progress from the high-resolution timestamp.
          </li>
          <li>
            <strong>Excessive computation in the callback:</strong> A rAF
            callback that runs physics simulation, collision detection, AI
            pathfinding, and rendering in a single pass may exceed the 16ms
            frame budget. Split work across frames, use adaptive quality, or
            move heavy computation to a Web Worker.
          </li>
          <li>
            <strong>Registering multiple rAF callbacks per animation:</strong>{" "}
            Each rAF call adds a callback to the queue. If an animation loop
            accidentally calls rAF twice per frame (e.g., both at the start
            and end of the callback), it doubles the work. Ensure each loop
            iteration schedules exactly one rAF callback.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Three.js / WebGL Rendering:</strong> Every Three.js
            application&apos;s render loop is built on rAF. The loop updates
            object positions, camera transforms, and shader uniforms each
            frame, then calls <code>renderer.render(scene, camera)</code>.
            Complex scenes with physics (Cannon.js, Rapier) run the physics
            step inside the same rAF callback, using fixed-timestep
            sub-stepping to ensure deterministic simulation regardless of
            frame rate.
          </li>
          <li>
            <strong>D3.js Data Visualizations:</strong> D3&apos;s force-directed
            graph layout runs a physics simulation via rAF, computing node
            positions each frame based on link forces, charge repulsion, and
            centering gravity. The simulation uses delta time for consistent
            behavior and automatically cools (reduces alpha) to settle into a
            stable layout.
          </li>
          <li>
            <strong>GSAP Core:</strong> GSAP uses a single global rAF callback
            (the &quot;ticker&quot;) that processes all active tweens in each
            frame. This batched approach avoids the overhead of multiple rAF
            registrations and ensures all animation updates are applied in the
            same paint frame, preventing visual tearing between coordinated
            elements.
          </li>
          <li>
            <strong>Figma Canvas:</strong> Figma&apos;s WebGL-based canvas
            editor uses rAF for its rendering loop, processing user input
            (panning, zooming, dragging), updating the scene graph, and
            re-rendering only the dirty regions of the canvas. Heavy operations
            like vector rasterization are offloaded to Web Workers, keeping
            the rAF callback lean enough to maintain 60 fps.
          </li>
        </ul>
      </section>

      {/* Section 8: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              Why is requestAnimationFrame better than setTimeout for
              animations?
            </p>
            <p className="mt-2">
              Three fundamental reasons. First, rAF is synchronized with the
              display&apos;s vsync signal — it fires at exactly the right time
              before each paint, ensuring updates are captured in the next
              frame. setTimeout fires approximately after the specified delay
              but drifts relative to vsync, causing periodic missed frames and
              visible stutter. Second, rAF is automatically paused when the
              browser tab is hidden, saving CPU and battery. setTimeout continues
              firing in background tabs (throttled to 1 fps). Third, the browser
              can optimize rAF callbacks — batching them, prioritizing them, and
              skipping them when the page is not visible — because it
              understands their intent is visual rendering.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              How do you handle the background tab resume problem with rAF?
            </p>
            <p className="mt-2">
              When a tab returns from background, the first rAF callback
              receives a timestamp that may be seconds or minutes after the
              last frame. The delta time is enormous, causing animations to
              teleport forward and physics simulations to explode. The fix is
              to clamp delta time to a maximum value (typically 50-100ms). If{" "}
              <code>currentTime - lastTime &gt; MAX_DELTA</code>, use{" "}
              <code>MAX_DELTA</code> instead. For physics simulations, use a
              fixed-timestep accumulator: accumulate the clamped delta, then
              step the physics in fixed increments (e.g., 16ms), processing
              multiple steps if needed but never exceeding the clamp.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              What is layout thrashing and how does it relate to rAF callbacks?
            </p>
            <p className="mt-2">
              Layout thrashing occurs when JavaScript reads a layout property
              (offsetHeight, getBoundingClientRect), then writes a style, then
              reads again, forcing the browser to recalculate layout
              synchronously between each read-write pair. In a rAF callback
              that animates multiple elements, this pattern can trigger dozens
              of layout recalculations per frame. The solution is the
              read-then-write pattern: first read all required values into
              variables, then apply all style mutations. This allows the browser
              to batch all mutations into a single layout pass. Libraries like
              FastDOM formalize this by queueing reads and writes into separate
              phases.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              Explain the double-rAF pattern and when you would use it.
            </p>
            <p className="mt-2">
              The double-rAF pattern calls{" "}
              <code>
                requestAnimationFrame(() =&gt; requestAnimationFrame(fn))
              </code>
              , deferring execution by two frames. The first rAF fires after the
              current frame&apos;s style and layout processing. The nested rAF
              fires after the browser has painted and composed the first
              frame&apos;s changes. Use this when you need to ensure a DOM change
              has been rendered before measuring or applying a subsequent
              change. Common use case: adding an element to the DOM, waiting for
              it to render at its initial position, then triggering a transition
              to its final position. Without the double-rAF, the browser may
              batch the initial render and the transition into the same frame,
              skipping the animation entirely.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              How would you implement a scroll handler that only updates once
              per frame using rAF?
            </p>
            <p className="mt-2">
              Use a flag pattern: declare a boolean{" "}
              <code>isScheduled</code>. In the scroll event handler, check the
              flag — if already true, return immediately (a frame update is
              already queued). If false, set it to true and call
              requestAnimationFrame with a callback that performs the actual
              computation, applies DOM updates, and resets the flag to false.
              This ensures scroll events (which can fire hundreds of times per
              second during fast scrolling) only trigger one computation per
              frame, naturally limiting work to 60 operations per second at
              60 fps. This pattern is also called rAF throttling and is
              superior to debouncing or fixed-interval throttling because it
              aligns processing with the actual rendering cadence.
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
              href="https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — requestAnimationFrame
            </a>{" "}
            — Official API documentation with examples
          </li>
          <li>
            <a
              href="https://web.dev/rendering-performance/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Rendering Performance
            </a>{" "}
            — Google&apos;s guide to the browser rendering pipeline
          </li>
          <li>
            <a
              href="https://gafferongames.com/post/fix_your_timestep/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fix Your Timestep — Glenn Fiedler
            </a>{" "}
            — Classic article on fixed-timestep game loops
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/devtools/performance/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome DevTools — Performance Panel
            </a>{" "}
            — Frame-by-frame analysis of rendering performance
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#dom-animationframeprovider-requestanimationframe"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HTML Spec — requestAnimationFrame
            </a>{" "}
            — WHATWG specification for animation frame scheduling
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
