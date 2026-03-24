"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-web-animations-api-extensive",
  title: "Web Animations API",
  description:
    "Staff-level deep dive into the Web Animations API covering native browser animation control, keyframe construction, timeline management, composite modes, and replacing JavaScript animation libraries with native capabilities.",
  category: "frontend",
  subcategory: "animation-transitions",
  slug: "web-animations-api",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-24",
  tags: [
    "frontend",
    "Web Animations API",
    "WAAPI",
    "Element.animate",
    "keyframes",
    "animation timeline",
    "native animations",
  ],
  relatedTopics: [
    "css-transitions-and-animations",
    "requestAnimationFrame",
    "performance-considerations-60fps",
  ],
};

export default function WebAnimationsApiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Web Animations API</strong> (WAAPI) is a native browser
          API that provides JavaScript control over the same animation engine
          that powers CSS transitions and keyframe animations. Calling{" "}
          <code>element.animate(keyframes, options)</code> creates an{" "}
          <code>Animation</code> object that runs on the compositor thread —
          the same thread that handles CSS animations — while exposing an
          imperative JavaScript interface for playback control, scrubbing,
          reversing, and dynamic timing adjustments. This is the best of both
          worlds: compositor-thread performance with JavaScript-level control.
        </p>
        <p>
          Before WAAPI, developers faced a binary choice. CSS animations were
          performant (compositor-thread) but static — you could not pause them
          at arbitrary points, scrub them to a specific progress, or
          dynamically construct keyframes based on runtime data. JavaScript
          animation libraries (GSAP, Velocity.js) provided full control but
          ran on the main thread via <code>requestAnimationFrame</code>,
          meaning a blocked main thread would stall the animation. WAAPI
          eliminates this trade-off by giving JavaScript the ability to create,
          control, and compose animations that execute natively in the
          browser&apos;s animation engine.
        </p>
        <p>
          At the staff-engineer level, WAAPI is significant for two reasons.
          First, it dramatically reduces the need for animation libraries in
          many scenarios — <code>Element.animate()</code> handles simple
          transitions, multi-step keyframes, and even scroll-driven animations
          without any library overhead. Motion One, one of the lightest
          animation libraries at under 5 KB, is essentially a thin wrapper
          around WAAPI. Second, WAAPI provides the foundation for the newer
          scroll-driven animation specification, where{" "}
          <code>ScrollTimeline</code> and <code>ViewTimeline</code> objects
          replace wall-clock time with scroll progress, enabling performant
          scroll-linked animations without JavaScript scroll event listeners.
        </p>
        <p>
          Browser support for WAAPI core is universal across modern browsers.
          Chrome, Firefox, Safari, and Edge all support{" "}
          <code>Element.animate()</code>, <code>Animation</code> playback
          control, and the <code>finished</code> promise. More advanced
          features like <code>composite</code> modes,{" "}
          <code>commitStyles()</code>, and <code>ScrollTimeline</code> have
          varying support levels but are progressing rapidly through the
          standards process.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Element.animate():</strong> The primary entry point. Accepts
            an array of keyframe objects and an options object specifying
            duration, easing, iterations, direction, fill, and delay. Returns
            an <code>Animation</code> object with full playback control. The
            keyframes array uses the same property names as CSS (camelCase for
            JavaScript) and the browser interpolates between them on the
            compositor thread.
          </li>
          <li>
            <strong>Animation Object:</strong> The return value of{" "}
            <code>animate()</code>. Provides <code>play()</code>,{" "}
            <code>pause()</code>, <code>reverse()</code>,{" "}
            <code>cancel()</code>, and <code>finish()</code> methods.{" "}
            <code>currentTime</code> can be read or written to scrub the
            animation to any point. <code>playbackRate</code> controls speed
            (2 for double speed, 0.5 for half, -1 for reverse). The{" "}
            <code>finished</code> property is a Promise that resolves when the
            animation completes.
          </li>
          <li>
            <strong>Keyframe Formats:</strong> WAAPI accepts two keyframe
            formats. The array format uses an array of objects, each
            representing a waypoint:{" "}
            <code>[{`{ opacity: 0 }`}, {`{ opacity: 1 }`}]</code>. The
            object format uses property names as keys with arrays of values:{" "}
            <code>{`{ opacity: [0, 1], transform: ["scale(0.5)", "scale(1)"] }`}</code>
            . The array format is more readable for complex multi-property
            animations; the object format is concise for simple cases.
          </li>
          <li>
            <strong>KeyframeEffect:</strong> The underlying effect object that
            separates the animation definition from its playback. A{" "}
            <code>KeyframeEffect</code> can be created independently and passed
            to the <code>Animation</code> constructor, enabling reuse of the
            same effect across multiple elements or timelines. It also allows
            retargeting — changing the element or keyframes of an existing
            effect.
          </li>
          <li>
            <strong>Composite Modes:</strong> The <code>composite</code>{" "}
            property determines how animated values combine with the
            element&apos;s underlying style. <code>replace</code> (default)
            overwrites the underlying value. <code>add</code> adds the animated
            value to the underlying value — a translateX(100px) animation on an
            element already translated 50px would move it to 150px.{" "}
            <code>accumulate</code> is similar to add but handles value types
            differently (relevant for transforms and filters). Composite modes
            enable layered animations where multiple effects combine
            independently.
          </li>
          <li>
            <strong>commitStyles():</strong> When a WAAPI animation completes,
            the animated properties revert to their underlying CSS values
            unless <code>fill: &quot;forwards&quot;</code> is set. But
            fill-forwards keeps the animation object alive, preventing garbage
            collection. <code>commitStyles()</code> writes the animation&apos;s
            current values to the element&apos;s inline style and allows the
            animation to be cleaned up, combining the persistence of
            fill-forwards with proper memory management.
          </li>
          <li>
            <strong>ScrollTimeline:</strong> A timeline object that maps scroll
            position to animation progress instead of wall-clock time. Created
            with <code>new ScrollTimeline({`{ source: scrollContainer }`})</code>{" "}
            and passed as the <code>timeline</code> option to{" "}
            <code>animate()</code>. The animation progresses from 0% to 100%
            as the container scrolls from start to end, entirely on the
            compositor thread without JavaScript scroll event handling.
          </li>
          <li>
            <strong>ViewTimeline:</strong> A specialized scroll timeline that
            tracks an element&apos;s intersection with its scroll container.
            The animation progresses as the element enters, crosses, and exits
            the viewport. This replaces Intersection Observer for
            scroll-linked entrance animations with significantly better
            performance since it runs on the compositor thread.
          </li>
          <li>
            <strong>getAnimations():</strong> Returns an array of all active{" "}
            <code>Animation</code> objects on an element (or the entire
            document). This is invaluable for debugging — you can inspect every
            running animation, its current time, playback rate, and effect. It
            also enables cancelling all existing animations before starting a
            new one, preventing animation conflicts.
          </li>
          <li>
            <strong>Animation Events:</strong> WAAPI animations dispatch{" "}
            <code>finish</code>, <code>cancel</code>, and{" "}
            <code>remove</code> events, and provide the{" "}
            <code>finished</code> and <code>ready</code> Promises. The{" "}
            <code>ready</code> promise resolves when the animation has been
            committed to the compositor and is ready to begin — useful for
            synchronizing multiple animations to start at exactly the same
            time.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/web-animations-api-diagram-1.svg"
          alt="WAAPI architecture showing the relationship between Element.animate, KeyframeEffect, Animation, and Timeline"
          caption="Figure 1: WAAPI object model — KeyframeEffect defines the what, Timeline defines the when, Animation orchestrates both"
        />
        <p>
          The WAAPI object model separates three concerns. The{" "}
          <code>KeyframeEffect</code> describes what happens — which element,
          which properties, which keyframes. The <code>AnimationTimeline</code>{" "}
          (document timeline, scroll timeline, or view timeline) describes the
          time source — wall-clock milliseconds or scroll percentage. The{" "}
          <code>Animation</code> object connects an effect to a timeline and
          provides playback control. This separation enables powerful patterns:
          the same KeyframeEffect can be driven by a document timeline during
          initial load and switched to a scroll timeline for scroll-linked
          behavior, without recreating the keyframes.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/web-animations-api-diagram-2.svg"
          alt="Compositor thread execution showing how WAAPI animations run independently of the main thread"
          caption="Figure 2: Thread architecture — WAAPI animations execute on the compositor thread, immune to main thread blocking"
        />
        <p>
          When <code>Element.animate()</code> is called, the browser creates the
          Animation object on the main thread but immediately transfers the
          interpolation work to the compositor thread. From that point, the
          compositor computes intermediate values and applies them each frame
          without involving the main thread. If JavaScript is blocked —
          parsing a large JSON response, running a React re-render, executing a
          heavy computation — the WAAPI animation continues rendering smoothly
          at 60 fps. This is identical to how CSS animations work and is the
          key performance advantage over <code>requestAnimationFrame</code>-based
          libraries. The only caveat is that animated properties must be
          compositor-compatible (transform, opacity, filter); animating layout
          properties still requires main-thread involvement.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/web-animations-api-diagram-3.svg"
          alt="ScrollTimeline integration showing scroll position mapped to animation progress"
          caption="Figure 3: ScrollTimeline — scroll position drives animation progress on the compositor thread"
        />
        <p>
          Scroll-driven animations via WAAPI represent a paradigm shift from
          the traditional scroll-event-driven approach. Previously, creating
          a scroll-linked animation required: (1) a scroll event listener, (2)
          throttling via rAF to limit processing to once per frame, (3)
          computing the scroll percentage, (4) applying styles via JavaScript.
          This entire pipeline ran on the main thread, meaning any JavaScript
          work could block the scroll animation. With{" "}
          <code>ScrollTimeline</code>, the browser maps scroll position to
          animation progress directly on the compositor thread. The result is
          jank-free scroll animations that maintain 60 fps even during heavy
          JavaScript execution. The developer defines the keyframes and
          associates them with a scroll timeline — the browser handles
          everything else.
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
                Web Animations API
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                CSS Animations
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                JS Libraries (GSAP)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-theme p-2 font-medium">Thread</td>
              <td className="border border-theme p-2">
                Compositor thread — same as CSS, immune to main thread blocking
              </td>
              <td className="border border-theme p-2">
                Compositor thread — native browser performance
              </td>
              <td className="border border-theme p-2">
                Main thread via rAF — blocked by JS execution
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Dynamic Control
              </td>
              <td className="border border-theme p-2">
                Full — play, pause, reverse, scrub, change rate at runtime
              </td>
              <td className="border border-theme p-2">
                Limited — play-state toggle, no scrubbing or rate control
              </td>
              <td className="border border-theme p-2">
                Full — complete imperative control with timeline labels
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Dynamic Keyframes
              </td>
              <td className="border border-theme p-2">
                Yes — construct keyframes at runtime from any data source
              </td>
              <td className="border border-theme p-2">
                No — @keyframes must be defined in CSS at parse time
              </td>
              <td className="border border-theme p-2">
                Yes — full runtime computation of values
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Bundle Cost
              </td>
              <td className="border border-theme p-2">
                Zero — native browser API, no library needed
              </td>
              <td className="border border-theme p-2">
                Zero — native browser capability
              </td>
              <td className="border border-theme p-2">
                25-60 KB gzipped depending on plugins
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Spring Physics
              </td>
              <td className="border border-theme p-2">
                Not native — requires custom easing via linear() or polyfill
              </td>
              <td className="border border-theme p-2">
                Not native — cubic-bezier approximations only
              </td>
              <td className="border border-theme p-2">
                Library-dependent — Framer Motion has first-class springs
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Best For
              </td>
              <td className="border border-theme p-2">
                Dynamic transitions, scroll animations, replacing simple
                library use
              </td>
              <td className="border border-theme p-2">
                Static animations — spinners, shimmer, hover effects
              </td>
              <td className="border border-theme p-2">
                Complex timelines, cinematic sequences, framework integration
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
            <strong>Use commitStyles() instead of fill-forwards:</strong>{" "}
            Setting <code>fill: &quot;forwards&quot;</code> keeps the Animation
            object alive indefinitely, preventing garbage collection. Instead,
            listen for the <code>finished</code> promise, call{" "}
            <code>animation.commitStyles()</code> to persist the final values
            as inline styles, then call <code>animation.cancel()</code> to
            release the animation resources.
          </li>
          <li>
            <strong>Cancel existing animations before starting new ones:</strong>{" "}
            Call <code>element.getAnimations()</code> and cancel conflicting
            animations before creating new ones. Multiple animations on the
            same property fight each other, producing unpredictable results.
            Cancelling first ensures clean state.
          </li>
          <li>
            <strong>Use the ready promise for synchronized starts:</strong>{" "}
            When multiple elements need to animate in perfect sync, create all
            animations paused, await all their <code>ready</code> promises,
            then play them simultaneously. This ensures the compositor has
            committed all animations before any begin.
          </li>
          <li>
            <strong>Prefer ScrollTimeline over scroll event handlers:</strong>{" "}
            For scroll-linked animations, ScrollTimeline runs on the compositor
            thread, maintaining 60 fps regardless of main-thread load.
            JavaScript scroll handlers are main-thread-bound and will jank
            during heavy processing.
          </li>
          <li>
            <strong>Only animate compositor-friendly properties:</strong> The
            same rule as CSS animations applies — transform, opacity, filter,
            and backdrop-filter run on the compositor thread. Animating layout
            properties (width, height, margin) falls back to main-thread
            processing, negating WAAPI&apos;s performance advantage.
          </li>
          <li>
            <strong>Use composite modes for layered effects:</strong> When
            multiple animations need to affect the same property
            independently (a hover effect and a scroll-linked parallax both
            applying transforms), use <code>composite: &quot;add&quot;</code>{" "}
            so they combine rather than conflict.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Memory leaks from fill-forwards animations:</strong> Each
            animation with <code>fill: &quot;forwards&quot;</code> is retained
            by the browser and continues to influence rendering. Creating
            hundreds of fill-forwards animations (e.g., entrance animations
            on a long list) leaks memory and slows style recalculation. Always
            commit styles and cancel when possible.
          </li>
          <li>
            <strong>Animation stacking without cancellation:</strong> Rapidly
            triggering <code>element.animate()</code> (e.g., on every mousemove)
            creates a new animation each time without cancelling the previous
            one. Dozens of overlapping animations accumulate, fighting for
            control of the same properties and consuming resources. Always
            store the animation reference and cancel before creating a new one.
          </li>
          <li>
            <strong>Expecting spring physics from WAAPI:</strong> WAAPI
            interpolates between keyframes using standard easing functions
            (linear, ease, cubic-bezier). It does not natively support spring
            dynamics where the animation duration is emergent from physical
            properties. Approximating springs requires many keyframe waypoints
            generated by a spring solver, or using the newer{" "}
            <code>linear()</code> easing function with computed stops.
          </li>
          <li>
            <strong>Ignoring the animation&apos;s finished promise:</strong>{" "}
            The <code>finished</code> promise rejects if the animation is
            cancelled. Unhandled rejections pollute the console and can trigger
            error monitoring. Always attach a catch handler or handle
            cancellation in your animation cleanup logic.
          </li>
          <li>
            <strong>Assuming universal ScrollTimeline support:</strong>{" "}
            ScrollTimeline is a newer specification with varying browser
            support. Always check feature availability and provide a
            JavaScript fallback (Intersection Observer + rAF) for browsers that
            do not support it. Progressive enhancement ensures the core
            experience works everywhere.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Motion One Library:</strong> Built entirely on WAAPI,
            Motion One provides a tiny (~4 KB) animation library that delegates
            all interpolation to the native browser engine. It adds spring
            physics, stagger utilities, and a cleaner API on top of{" "}
            <code>Element.animate()</code> without reimplementing the animation
            engine in JavaScript. This demonstrates that WAAPI is mature enough
            to serve as a library foundation.
          </li>
          <li>
            <strong>Chrome DevTools Animations Panel:</strong> Chrome&apos;s
            built-in animation inspector visualizes all active WAAPI and CSS
            animations, showing their timelines, keyframes, and playback state.
            Teams use this to debug timing issues, identify orphaned animations,
            and verify that animations run on the compositor thread rather than
            the main thread.
          </li>
          <li>
            <strong>Google Search Scroll Effects:</strong> Google&apos;s search
            results page uses ScrollTimeline-based WAAPI animations for the
            sticky header behavior — the search bar shrinks and repositions as
            the user scrolls, driven entirely by scroll progress on the
            compositor thread. This ensures the scroll experience remains smooth
            even while search results are being dynamically loaded.
          </li>
          <li>
            <strong>GitHub File Browser:</strong> GitHub uses WAAPI for file
            tree expansion animations, collapsing and expanding directory nodes
            with smooth height transitions. By computing the target height in
            JavaScript and passing it as a keyframe to{" "}
            <code>element.animate()</code>, they achieve dynamic height
            animations that CSS alone cannot handle, while still benefiting
            from compositor-thread execution for the transform-based portions.
          </li>
        </ul>
      </section>

      {/* Section 8: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              What advantage does the Web Animations API have over
              requestAnimationFrame-based animation libraries?
            </p>
            <p className="mt-2">
              WAAPI animations run on the compositor thread, the same thread
              that handles CSS animations. This means they continue rendering
              smoothly at 60 fps even when the main thread is blocked by
              JavaScript execution — long-running computations, React
              re-renders, or garbage collection pauses. rAF-based libraries
              (GSAP, older React Spring) compute animation values and apply
              styles on the main thread. If a rAF callback cannot complete
              within the 16.67ms frame budget, the animation frame is dropped.
              WAAPI eliminates this class of jank for compositor-compatible
              properties (transform, opacity, filter).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              How does ScrollTimeline improve scroll-driven animations compared
              to traditional scroll event approaches?
            </p>
            <p className="mt-2">
              Traditional scroll-driven animations use a scroll event listener
              that fires on the main thread, computes the scroll percentage,
              and applies styles via JavaScript. This has three problems: scroll
              events fire asynchronously and can be delayed by main-thread
              work, the computation and style application happen on the main
              thread (competing with other JavaScript), and passive event
              listeners cannot call preventDefault which limits interaction
              patterns. ScrollTimeline maps scroll position directly to
              animation progress on the compositor thread. No JavaScript runs
              during scroll — the browser&apos;s native scroll processing
              drives the animation automatically, guaranteeing smooth 60 fps
              even during heavy JavaScript execution.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              What is commitStyles() and why is it important?
            </p>
            <p className="mt-2">
              When a WAAPI animation completes, the element reverts to its
              pre-animation CSS values unless <code>fill: forwards</code> is
              set. But fill-forwards keeps the Animation object alive in memory
              indefinitely — it continues to participate in style resolution
              every frame. For pages with many animations (entrance effects on
              a long list), this causes memory leaks and cumulative style
              recalculation overhead. <code>commitStyles()</code> solves this by
              writing the animation&apos;s current computed values directly to
              the element&apos;s inline style attribute. After committing, you
              can cancel the animation, releasing its memory while preserving
              the visual result. The pattern is:{" "}
              <code>await animation.finished → animation.commitStyles() →
              animation.cancel()</code>.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              How do composite modes work in WAAPI and when would you use them?
            </p>
            <p className="mt-2">
              Composite modes determine how an animation&apos;s values combine
              with the element&apos;s existing styles and other active
              animations. <code>replace</code> (default) overwrites the
              underlying value completely. <code>add</code> combines the
              animated value with the underlying value — if an element has{" "}
              <code>transform: translateX(50px)</code> in CSS and a WAAPI
              animation with <code>translateX(100px)</code> and{" "}
              <code>composite: add</code>, the result is translateX(150px).
              Use composite modes when you need layered, independent animations
              on the same property — for example, a permanent CSS hover
              transform combined with a WAAPI scroll-linked parallax transform.
              Without composite add, the WAAPI animation would override the
              hover transform.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              When would you still choose a JavaScript animation library over
              the Web Animations API?
            </p>
            <p className="mt-2">
              Five scenarios: (1) Spring-based physics animations where the
              duration is emergent — WAAPI requires fixed durations, while
              libraries like Framer Motion compute spring dynamics natively.
              (2) Complex multi-element timeline orchestration with labels,
              scrubbing, and nested sequences — GSAP&apos;s timeline model is
              far more powerful than manually coordinating WAAPI animations.
              (3) React component lifecycle integration — AnimatePresence for
              exit animations, layout animations for FLIP — where framework
              integration provides significant developer experience advantages.
              (4) SVG morphing and path animation, which GSAP&apos;s
              MorphSVGPlugin handles natively. (5) When you need consistent
              behavior across older browsers that lack full WAAPI support.
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
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Web Animations API
            </a>{" "}
            — Complete API reference with examples and browser support
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/css-ui/scroll-driven-animations"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome Developers — Scroll-Driven Animations
            </a>{" "}
            — Guide to ScrollTimeline and ViewTimeline
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/web-animations-1/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — Web Animations Level 1 Specification
            </a>{" "}
            — Official W3C specification for the Web Animations model
          </li>
          <li>
            <a
              href="https://motion.dev/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Motion One
            </a>{" "}
            — Lightweight library built on WAAPI demonstrating native-first
            approach
          </li>
          <li>
            <a
              href="https://web.dev/animations-overview/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev — Animations Overview
            </a>{" "}
            — Comparing CSS, WAAPI, and JavaScript animation approaches
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
