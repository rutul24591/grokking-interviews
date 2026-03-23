"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-javascript-animation-libraries-extensive",
  title: "JavaScript Animation Libraries",
  description:
    "Staff-level deep dive into JavaScript animation libraries covering GSAP, Framer Motion, Spring physics, orchestration patterns, and selecting the right animation tool for production applications.",
  category: "frontend",
  subcategory: "animation-transitions",
  slug: "javascript-animation-libraries",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-24",
  tags: [
    "frontend",
    "animation libraries",
    "GSAP",
    "Framer Motion",
    "spring physics",
    "animation orchestration",
    "React animation",
  ],
  relatedTopics: [
    "css-transitions-and-animations",
    "requestAnimationFrame",
    "web-animations-api",
  ],
};

export default function JavaScriptAnimationLibrariesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>JavaScript animation libraries</strong> provide imperative or
          declarative APIs for orchestrating complex motion sequences that
          exceed the capabilities of CSS transitions and keyframe animations.
          While CSS handles simple property interpolations beautifully, it falls
          short when animations require dynamic values computed at runtime,
          physics-based motion (springs, inertia), complex timelines with
          sequential and parallel tracks, or integration with React component
          lifecycle and state. Libraries bridge this gap by scheduling frame
          updates through <code>requestAnimationFrame</code>, computing
          interpolated values, and applying them to DOM elements or React state.
        </p>
        <p>
          The JavaScript animation ecosystem has consolidated around a handful
          of dominant libraries, each occupying a distinct niche. GSAP
          (GreenSock Animation Platform) is the gold standard for imperative
          timeline-based animation — it powers the motion on sites like Apple,
          Nike, and Airbnb, offering frame-perfect control, scroll-triggered
          sequences, and a plugin architecture that handles SVG morphing, text
          splitting, and 3D transforms. Framer Motion dominates the React
          ecosystem with its declarative, component-first API that ties
          animations to component mount, unmount, and state changes. React
          Spring (and its successor, the Spring module in Framer Motion)
          introduced physics-based interpolation where animations are governed
          by spring dynamics (mass, tension, friction) rather than fixed
          durations, producing motion that feels natural and interruptible.
        </p>
        <p>
          At the staff-engineer level, choosing an animation library is an
          architectural decision with long-term consequences. GSAP adds roughly
          25 KB gzipped to the bundle (core only) and uses imperative refs that
          sit outside React&apos;s rendering model, requiring careful cleanup.
          Framer Motion adds roughly 35 KB and hooks deeply into React&apos;s
          lifecycle, making it seamless for component-level animation but
          harder to use outside React. Lightweight alternatives like Motion One
          (under 5 KB) use the Web Animations API under the hood, offering
          near-native performance with a tiny footprint. The decision depends
          on the project&apos;s motion complexity, framework, bundle budget,
          and the team&apos;s animation expertise.
        </p>
        <p>
          The most important architectural concern is animation
          interruptibility. Fixed-duration CSS animations play to completion —
          if the user clicks away mid-animation, the element snaps or reverses
          abruptly. Spring-based animations are inherently interruptible: a new
          target value redirects the spring from its current velocity, producing
          smooth re-targeting without jarring cuts. This distinction matters
          enormously for gesture-driven interfaces (drag, swipe, pinch) where
          user intent changes continuously and the animation must follow in
          real time.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Imperative vs Declarative Animation:</strong> Imperative
            libraries (GSAP) give you a timeline object where you explicitly
            sequence tweens, set durations, and add callbacks. Declarative
            libraries (Framer Motion) let you describe the desired end state
            and the library handles the interpolation. Imperative offers more
            control for complex sequences; declarative integrates better with
            component-based architectures.
          </li>
          <li>
            <strong>Spring Physics:</strong> Instead of specifying a duration
            and easing curve, spring-based animations define physical
            properties: stiffness (how taut the spring is), damping (how
            quickly oscillation decays), and mass (inertia of the animated
            value). The animation runs until the spring settles, producing
            organic motion that automatically adjusts duration based on the
            distance to the target. Springs are inherently interruptible —
            changing the target mid-animation redirects the spring from its
            current position and velocity.
          </li>
          <li>
            <strong>Timeline Orchestration:</strong> Complex animations involve
            multiple elements animating in coordinated sequences —
            simultaneously, staggered, or chained. GSAP&apos;s Timeline object
            and Framer Motion&apos;s <code>staggerChildren</code> and{" "}
            <code>delayChildren</code> variants provide orchestration
            primitives. A well-designed timeline keeps animation logic
            centralized rather than scattered across individual components.
          </li>
          <li>
            <strong>Layout Animation:</strong> When DOM elements change position
            due to layout shifts (reordering a list, toggling visibility of
            siblings), Framer Motion&apos;s <code>layout</code> prop
            automatically applies FLIP animations. The library measures the
            element before and after the layout change and animates the
            transform to bridge the gap, converting layout-triggering changes
            into compositor-only animations.
          </li>
          <li>
            <strong>Exit Animations (AnimatePresence):</strong> CSS cannot
            animate an element&apos;s removal from the DOM because the element
            is gone before the animation can play. Framer Motion&apos;s{" "}
            <code>AnimatePresence</code> component delays DOM removal until the
            exit animation completes, enabling fade-outs, slide-outs, and
            collapse animations on unmounting components.
          </li>
          <li>
            <strong>Gesture Integration:</strong> Libraries like Framer Motion
            provide built-in gesture handlers (<code>whileHover</code>,{" "}
            <code>whileTap</code>, <code>whileDrag</code>) that connect user
            input directly to animation values. Drag animations use
            spring-based momentum to continue moving after the user releases,
            then settle at a snap point. This creates fluid, native-feeling
            interactions.
          </li>
          <li>
            <strong>Scroll-Triggered Animation:</strong> GSAP&apos;s
            ScrollTrigger plugin connects timeline progress to scroll position,
            enabling parallax effects, section reveals, and progress-linked
            animations. Framer Motion provides{" "}
            <code>useScroll</code> and <code>useTransform</code> hooks for
            similar scroll-linked effects within the React paradigm.
          </li>
          <li>
            <strong>Bundle Size and Tree-Shaking:</strong> Animation libraries
            can significantly impact bundle size. GSAP core is ~25 KB gzipped;
            with plugins (ScrollTrigger, Draggable, MorphSVG) it can exceed
            60 KB. Framer Motion is ~35 KB with tree-shaking. Motion One
            (Animate) is under 5 KB by delegating to the Web Animations API.
            For performance-critical applications, bundle cost is often the
            decisive factor.
          </li>
          <li>
            <strong>Server-Side Rendering Compatibility:</strong> Animation
            libraries must handle SSR gracefully — elements should render in
            their final state on the server and animate on the client after
            hydration. Libraries that set initial opacity to 0 for entrance
            animations cause a flash of invisible content if the animation
            script loads late. Framer Motion handles this by setting initial
            styles inline during SSR.
          </li>
          <li>
            <strong>Reduced Motion Respect:</strong> All major libraries
            provide mechanisms to detect <code>prefers-reduced-motion</code>.
            Framer Motion offers <code>useReducedMotion()</code> hook and
            automatically respects the preference in layout animations. GSAP
            provides <code>gsap.matchMedia()</code> for media query-based
            animation branches. Libraries that lack built-in support require
            manual wiring.
          </li>
        </ul>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/javascript-animation-libraries-diagram-1.svg"
          alt="Comparison of animation library architectures showing GSAP timeline, Framer Motion declarative, and Web Animations API approaches"
          caption="Figure 1: Animation library architecture comparison — imperative timelines vs declarative components vs native API"
        />
        <p>
          The three dominant animation paradigms differ fundamentally in how
          they interface with the browser. GSAP operates outside the rendering
          framework: it directly manipulates element styles via{" "}
          <code>requestAnimationFrame</code>, computing interpolated values in
          JavaScript and setting them as inline styles each frame. This gives
          it framework independence but requires manual ref management and
          cleanup in React. Framer Motion integrates into React&apos;s render
          cycle: animation values flow through React&apos;s state model, and
          the library batches style updates to minimize re-renders. Motion One
          delegates to the browser&apos;s native Web Animations API, which runs
          animations on the compositor thread with minimal JavaScript overhead
          — conceptually similar to CSS animations but with a JavaScript
          control surface.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/javascript-animation-libraries-diagram-2.svg"
          alt="Spring physics animation model showing mass, stiffness, damping parameters and interruptibility"
          caption="Figure 2: Spring physics model — animation driven by physical properties with natural interruptibility"
        />
        <p>
          Spring physics fundamentally changes the animation mental model. In
          a duration-based animation, you specify how long the animation should
          take and the easing curve that controls acceleration. In a
          spring-based animation, you specify the physical characteristics of
          the spring and the animation runs until it settles — the duration is
          emergent. A stiff spring (high tension) settles quickly; a loose
          spring (low tension) oscillates longer. High damping produces a
          smooth settle; low damping produces a bouncy overshoot. The critical
          advantage is interruptibility: if the target changes mid-animation,
          the spring redirects from its current position and velocity without
          any discontinuity. This makes springs ideal for gesture-driven
          interfaces where the user&apos;s intent changes continuously.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/animation-transitions/javascript-animation-libraries-diagram-3.svg"
          alt="AnimatePresence lifecycle showing mount, animate, and exit phases with DOM retention"
          caption="Figure 3: Exit animation lifecycle — AnimatePresence delays DOM removal until exit animation completes"
        />
        <p>
          Exit animations represent a unique challenge in component-based
          frameworks. When a component unmounts, React removes it from the DOM
          immediately — there is no built-in mechanism to &quot;wait for the
          animation to finish.&quot; Framer Motion&apos;s{" "}
          <code>AnimatePresence</code> solves this by intercepting the unmount
          lifecycle. When a child component is removed from the children array,
          AnimatePresence keeps it in the DOM, triggers the exit variant, and
          only removes the DOM node when the exit animation completes. This
          enables fade-outs, slide-outs, and collapse animations that would
          otherwise be impossible in React. The key architectural consideration
          is that every animating child must have a unique <code>key</code>{" "}
          prop so AnimatePresence can track which children are entering,
          present, or exiting.
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
                GSAP
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                Framer Motion
              </th>
              <th className="border border-theme p-2 bg-panel text-left">
                Motion One
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-theme p-2 font-medium">API Style</td>
              <td className="border border-theme p-2">
                Imperative timeline — chain tweens, add labels, scrub
              </td>
              <td className="border border-theme p-2">
                Declarative props on components — initial, animate, exit
              </td>
              <td className="border border-theme p-2">
                Imperative function calls — animate(el, keyframes, options)
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Bundle Size
              </td>
              <td className="border border-theme p-2">
                ~25 KB core, 40-60 KB with common plugins
              </td>
              <td className="border border-theme p-2">
                ~35 KB tree-shaken, grows with features used
              </td>
              <td className="border border-theme p-2">
                ~4 KB — delegates to native Web Animations API
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Framework Coupling
              </td>
              <td className="border border-theme p-2">
                Framework-agnostic — works with React, Vue, vanilla JS
              </td>
              <td className="border border-theme p-2">
                React-only — deeply integrated with React lifecycle
              </td>
              <td className="border border-theme p-2">
                Framework-agnostic — works with any DOM environment
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Spring Physics
              </td>
              <td className="border border-theme p-2">
                Limited — CustomEase plugin, no native spring model
              </td>
              <td className="border border-theme p-2">
                First-class — spring, inertia, and keyframe support
              </td>
              <td className="border border-theme p-2">
                Via spring() generator function
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Exit Animation
              </td>
              <td className="border border-theme p-2">
                Manual — must delay DOM removal yourself
              </td>
              <td className="border border-theme p-2">
                Built-in — AnimatePresence handles unmount delay
              </td>
              <td className="border border-theme p-2">
                Manual — returned promise resolves when done
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2 font-medium">
                Best For
              </td>
              <td className="border border-theme p-2">
                Marketing sites, complex timelines, scroll sequences
              </td>
              <td className="border border-theme p-2">
                React apps, component transitions, gesture UIs
              </td>
              <td className="border border-theme p-2">
                Lightweight sites, performance-critical, simple animations
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
            <strong>Match the library to the project&apos;s needs:</strong> For
            React applications with component-level animations, Framer Motion
            provides the best developer experience. For marketing pages with
            complex scroll-driven timelines, GSAP with ScrollTrigger is
            unmatched. For simple animations where bundle size matters most,
            Motion One or raw Web Animations API keeps the footprint minimal.
          </li>
          <li>
            <strong>Use springs for interactive animations:</strong> Any
            animation that responds to user input (drag, hover, scroll) should
            use spring-based interpolation. Springs are interruptible by nature
            — changing the target mid-animation produces a smooth redirect,
            while duration-based animations snap or stutter when interrupted.
          </li>
          <li>
            <strong>Clean up imperative animations on unmount:</strong> GSAP
            tweens and timelines continue running after a component unmounts,
            causing memory leaks and errors when they try to update removed DOM
            nodes. Always store references and call{" "}
            <code>tween.kill()</code> or <code>timeline.kill()</code> in a
            useEffect cleanup function.
          </li>
          <li>
            <strong>Centralize animation definitions in variants:</strong>{" "}
            Framer Motion&apos;s variant system lets you define named animation
            states (hidden, visible, exit) in a single object and reference them
            across components. This keeps animation logic co-located and makes
            orchestration (staggerChildren, delayChildren) straightforward.
          </li>
          <li>
            <strong>Measure before animating layout changes:</strong> Use the
            FLIP technique or Framer Motion&apos;s <code>layout</code> prop to
            convert layout-triggering changes into transform-only animations.
            Never animate CSS <code>width</code>, <code>height</code>, or
            positional properties directly — always express layout changes as
            transforms.
          </li>
          <li>
            <strong>Lazy-load heavy animation libraries:</strong> If GSAP with
            plugins is only needed on specific pages (a landing page with
            scroll animations), dynamically import it rather than including it
            in the main bundle. This keeps the critical path lean for pages
            that only need simple CSS transitions.
          </li>
        </ol>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Memory leaks from un-killed timelines:</strong> GSAP
            timelines run independently of React&apos;s lifecycle. If a
            component unmounts while a timeline is playing, the timeline
            continues executing and attempts to update removed DOM nodes,
            causing errors and leaking memory. Always call{" "}
            <code>timeline.kill()</code> in a cleanup function.
          </li>
          <li>
            <strong>Overusing AnimatePresence:</strong> Wrapping every component
            in AnimatePresence adds overhead. The library must track children by
            key, maintain a map of exiting elements, and delay DOM cleanup. Use
            it only where exit animations are visually necessary — page
            transitions, modal closes, list item removals.
          </li>
          <li>
            <strong>Fighting the framework with imperative code:</strong> Using
            GSAP inside React without understanding React&apos;s rendering model
            leads to animations that break on re-render, flash stale states,
            or double-fire. Prefer Framer Motion in React projects; if GSAP is
            necessary, use <code>useGSAP()</code> from the{" "}
            <code>@gsap/react</code> package which handles cleanup
            automatically.
          </li>
          <li>
            <strong>Animating too many elements simultaneously:</strong>{" "}
            Staggering 100 list items with GSAP creates 100 active tweens.
            Each tween computes values and sets styles every frame. At scale,
            this overwhelms the main thread. Use CSS transitions with
            staggered delays for large lists, or virtualize the list so only
            visible items animate.
          </li>
          <li>
            <strong>Ignoring SSR initial state:</strong> Framer Motion
            components with <code>initial={`{{ opacity: 0 }}`}</code> render
            invisibly on the server. If JavaScript loads slowly, users see
            blank space. Use <code>initial={`{false}`}</code> on the root to
            skip initial animation on mount, or ensure server-rendered content
            is visible by default.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Airbnb:</strong> Uses Framer Motion throughout their React
            application for listing card hover effects, photo gallery
            transitions, search results reordering, and the booking flow. Their
            layout animations use the <code>layout</code> prop to smoothly
            rearrange search results when filters change, avoiding the jarring
            snap that CSS alone would produce.
          </li>
          <li>
            <strong>Apple Product Pages:</strong> Uses GSAP with ScrollTrigger
            to create their signature scroll-driven product reveal animations.
            The iPhone, MacBook, and Vision Pro pages feature pin-scrub
            timelines where scrolling controls the progress of complex
            multi-element sequences — device rotation, text fade-in, background
            color shifts — all synchronized to the scroll position.
          </li>
          <li>
            <strong>Linear:</strong> Uses Framer Motion for their project
            management interface animations — issue card drag-and-drop, board
            column transitions, and modal entrance/exit. Spring-based
            animations ensure that drag interactions feel responsive and
            natural, with momentum and snap-point settling.
          </li>
          <li>
            <strong>Stripe Documentation:</strong> Uses Motion One (the
            lightweight Web Animations API wrapper) for subtle code example
            animations, tab transitions, and scroll-linked reveals. The small
            bundle size keeps documentation pages fast-loading while still
            providing polished motion design.
          </li>
        </ul>
      </section>

      {/* Section 8: Common Interview Questions */}
      <section>
        <h2>Common Interview Questions</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              When would you choose GSAP over Framer Motion in a React project?
            </p>
            <p className="mt-2">
              Choose GSAP when the project requires complex timeline
              orchestration — sequential animations with labels, scrubbing
              timelines to specific points, scroll-driven sequences with
              pinning, or SVG morphing. GSAP&apos;s timeline model is
              unmatched for cinematic, multi-element sequences where precise
              timing control is essential. Also choose GSAP when the animation
              logic must be shared across React and non-React parts of the
              application (a marketing site with some React widgets). Choose
              Framer Motion when animations are primarily component-level — mount
              and unmount transitions, hover and tap feedback, layout
              rearrangement, and drag gestures — where tight integration with
              React&apos;s lifecycle provides a better developer experience.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              How do spring-based animations differ from duration-based
              animations? Why does it matter?
            </p>
            <p className="mt-2">
              Duration-based animations specify exactly how long the motion
              takes and what easing curve shapes the acceleration. This works
              well for non-interactive animations where you know the start and
              end states in advance. Spring-based animations specify physical
              properties (stiffness, damping, mass) and the animation runs
              until the spring settles — the duration is emergent. The critical
              difference is interruptibility. If a user drags an element halfway
              and releases, a spring animation naturally decelerates from the
              current velocity. If the user re-grabs mid-settle, the spring
              responds to the new input seamlessly. A duration-based animation
              would need to be cancelled and restarted, creating a visual
              discontinuity. Springs are essential for any animation driven by
              continuous user input.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              How do you handle exit animations in React when a component
              unmounts?
            </p>
            <p className="mt-2">
              React removes DOM nodes immediately on unmount, so exit
              animations require delaying the removal. Framer Motion&apos;s{" "}
              <code>AnimatePresence</code> component wraps children and detects
              when a child&apos;s key is removed from the children array. It
              keeps the element in the DOM, triggers the <code>exit</code>{" "}
              variant animation, and removes the DOM node only when the
              animation completes. Without a library, you can implement this
              manually: maintain a state flag that triggers the exit animation
              class, listen for <code>transitionend</code>, and only then call
              the state update that unmounts the component. This is fragile and
              error-prone at scale, which is why libraries are preferred.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              What are the bundle size implications of adding an animation
              library? How do you mitigate them?
            </p>
            <p className="mt-2">
              GSAP core is ~25 KB gzipped; with ScrollTrigger, Draggable, and
              other plugins it can reach 60+ KB. Framer Motion is ~35 KB
              tree-shaken. Motion One is ~4 KB. Mitigation strategies: (1)
              Dynamic import the library only on pages that need it — a landing
              page with scroll animations loads GSAP, while the dashboard uses
              CSS transitions only. (2) Use the lightweight Motion One for
              simple animations and reserve GSAP for complex timelines. (3)
              With Framer Motion, import only the components you use — the
              library tree-shakes well. (4) For React apps, consider using CSS
              transitions for simple hover/focus effects and reserving the
              library for layout animations and exit transitions where it
              provides unique value.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-medium">
              How do you prevent animation memory leaks in a React single-page
              application?
            </p>
            <p className="mt-2">
              Three patterns: (1) For GSAP, use the{" "}
              <code>@gsap/react</code> package&apos;s{" "}
              <code>useGSAP()</code> hook, which automatically kills all
              tweens and timelines created in its scope when the component
              unmounts. Without it, manually store timeline refs and call{" "}
              <code>tl.kill()</code> in useEffect cleanup. (2) For Framer
              Motion, the library handles cleanup automatically for declarative
              animations, but imperative <code>animate()</code> calls return a
              stop function that should be called on unmount. (3) For all
              libraries, be wary of scroll event listeners and resize observers
              that drive animations — these must be explicitly disconnected on
              unmount. Use <code>ScrollTrigger.kill()</code> for GSAP scroll
              triggers and return cleanup functions from custom hooks.
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
              href="https://gsap.com/docs/v3/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GSAP Documentation
            </a>{" "}
            — Official GreenSock Animation Platform documentation
          </li>
          <li>
            <a
              href="https://www.framer.com/motion/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Framer Motion
            </a>{" "}
            — Production-ready motion library for React
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
            — Lightweight animation library built on the Web Animations API
          </li>
          <li>
            <a
              href="https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Josh Comeau — Spring Physics Introduction
            </a>{" "}
            — Visual explanation of spring-based animation physics
          </li>
          <li>
            <a
              href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/"
              className="text-accent underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GSAP ScrollTrigger
            </a>{" "}
            — Scroll-driven animation plugin documentation
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
