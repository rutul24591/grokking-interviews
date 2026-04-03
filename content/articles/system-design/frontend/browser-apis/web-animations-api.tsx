"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-web-animations-api",
  title: "Web Animations API",
  description:
    "Comprehensive guide to the Web Animations API covering keyframe-based animation creation, timeline control, performance optimization through compositor-only properties, animation sequencing, and production-scale implementation patterns for interactive web experiences.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "web-animations-api",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-03",
  tags: [
    "frontend",
    "browser API",
    "web animations",
    "keyframe animations",
    "animation performance",
    "compositor thread",
    "interactive animations",
  ],
  relatedTopics: ["animation-transitions"],
};

export default function WebAnimationsAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Web Animations API</strong> is a W3C standard that provides a programmatic JavaScript interface for creating, controlling, and inspecting animations in the browser. Unlike CSS animations, which are defined declaratively in stylesheets and have limited runtime control, the Web Animations API enables dynamic animation creation with full runtime control over playback state, timing, speed, direction, and sequencing. Animations created through the Web Animations API run on the browser&apos;s compositor thread — the same optimized rendering path used by CSS animations — providing GPU-accelerated performance that is significantly smoother than JavaScript-driven animations that manipulate DOM properties on the main thread.
        </p>
        <p>
          The Web Animations API was designed to unify the animation capabilities of the web platform. Before its introduction, developers faced a choice between CSS animations, which are performant but inflexible, and JavaScript animations, which are flexible but potentially slow. CSS animations excel at simple, predefined transitions such as hover effects, loading spinners, and page transitions, but struggle with interactive animations that respond to user input, animations that depend on runtime data, and complex animation sequences that require precise timing coordination. JavaScript animation libraries like GSAP and Anime.js filled this gap by providing programmatic animation control, but they operate on the main thread and can cause jank when competing with other JavaScript execution for CPU time.
        </p>
        <p>
          The Web Animations API bridges this gap by providing JavaScript-based animation control that runs on the compositor thread. The API exposes the same animation model that underlies CSS animations — keyframes, timing functions, iteration counts, and fill modes — but makes it accessible and controllable from JavaScript. This means that animations created through the API benefit from the same hardware acceleration and optimization as CSS animations while gaining the flexibility of programmatic control. The API provides methods for playing, pausing, reversing, seeking, and canceling animations, as well as properties for inspecting animation state, current time, playback rate, and finished status.
        </p>
        <p>
          For staff and principal engineers, the Web Animations API represents a tool for building rich, interactive user experiences that respond to user input, data changes, and application state transitions. The API is particularly valuable for data visualization animations, interactive UI animations such as drag-and-drop feedback and gesture-based interactions, and complex animation sequences that require precise timing coordination. The decision to use the Web Animations API versus CSS animations or third-party libraries depends on the animation&apos;s complexity, interactivity requirements, and performance constraints.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The <strong>keyframe model</strong> is the foundation of the Web Animations API. A keyframe is an object that specifies the CSS property values at a particular point in the animation timeline. Keyframes are defined as an array of objects, where each object contains CSS property-value pairs and an optional offset property — a number between 0 and 1 indicating the position in the animation timeline. When offsets are not specified, keyframes are distributed evenly across the timeline. A fade-in animation can be defined as an array with two objects, the first setting opacity to 0 and the second setting opacity to 1. More complex animations can include multiple keyframes with explicit offsets for precise control over the animation&apos;s progression through different visual states.
        </p>
        <p>
          The <strong>timing model</strong> controls how the animation progresses through its keyframes over time. Timing options are specified as an object passed to the animate method and include duration in milliseconds, delay before the animation starts, end delay after the animation ends, iteration count for repetition, direction for forward or reverse playback, easing function for acceleration curves, and fill mode for controlling whether the animation&apos;s keyframe values persist before or after the active animation period. The easing function is particularly important for creating natural-feeling animations — linear easing produces mechanical motion, while ease-in-out or custom cubic-bezier curves produce more organic, physically plausible motion.
        </p>
        <p>
          The <strong>Animation object</strong> is returned by the element animate method and provides full runtime control over the animation. The play method starts or resumes the animation. The pause method pauses the animation at its current position. The reverse method plays the animation backward from its current position. The finish method jumps to the end. The cancel method stops the animation and removes its effects. The currentTime property gets or sets the animation&apos;s current position in milliseconds, enabling seeking to any point. The playbackRate property controls the animation speed — a rate of 2 plays at double speed, 0.5 plays at half speed, and negative values play in reverse. The finished property returns a Promise that resolves when the animation completes, enabling async/await patterns for animation sequencing.
        </p>
        <p>
          The <strong>compositor thread execution model</strong> is what makes the Web Animations API performant. When an animation is created, the browser analyzes the animated properties and determines whether they can be handled by the compositor thread. Properties that only affect compositing — transform and opacity — are handled entirely on the compositor thread, which runs independently of the main thread and is typically GPU-accelerated. This means that animations of transform and opacity continue to run smoothly even when the main thread is busy with JavaScript execution, layout calculation, or event handling. Properties that affect layout (width, height, top, left) or paint (color, background, box-shadow) require main thread involvement and can cause jank if the main thread is busy.
        </p>
        <p>
          The <strong>fill mode</strong> determines what happens to the animated element&apos;s styles before the animation starts and after it ends. The default fill mode (&quot;none&quot;) means the element returns to its pre-animation styles when the animation is not actively running. The &quot;forwards&quot; fill mode keeps the element at the final keyframe&apos;s styles after the animation ends. The &quot;backwards&quot; fill mode applies the first keyframe&apos;s styles during the delay period before the animation starts. The &quot;both&quot; fill mode combines forwards and backwards, applying the first keyframe&apos;s styles during the delay and keeping the last keyframe&apos;s styles after the animation ends. Understanding fill modes is essential for creating animations that leave the element in the desired state after completion.
        </p>
        <p>
          The <strong>animation event model</strong> provides hooks for responding to animation lifecycle events. The onfinish event fires when the animation completes naturally (reaches the end of its iterations). The oncancel event fires when the animation is canceled. The onremove event fires when the animation is removed from the element&apos;s animations list. These events enable animation sequencing — triggering the next animation when the current one finishes — and cleanup — removing animation effects or updating application state when an animation completes. The finished Promise provides an alternative to event handlers for async animation sequencing.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/web-animations-api-flow.svg"
          alt="Web Animations API Flow diagram showing keyframe definition, timing configuration, animation creation, and playback control methods"
          caption="Web Animations API flow — define keyframes with property values and offsets, configure timing options (duration, easing, iterations, fill), create animation on element, control playback with play, pause, reverse, seek, and finish methods"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production Web Animations API implementation requires an architecture that manages animation creation, performance optimization, sequencing coordination, and cleanup. The architecture must ensure that animations run smoothly without causing jank, that they respond appropriately to user interactions and application state changes, and that they are properly cleaned up when no longer needed to prevent memory leaks.
        </p>
        <p>
          The <strong>animation creation layer</strong> is responsible for defining keyframes and timing options for each animation. In a well-architected system, animation definitions are centralized in a configuration module or design token system, rather than scattered throughout component code. This enables consistent animation behavior across the application, easy adjustment of animation timing and easing curves, and A/B testing of different animation parameters. Each animation definition includes the keyframe array, timing options, and metadata such as the animation&apos;s purpose (entrance, exit, emphasis, transition) and its performance characteristics (compositor-only or main-thread-involved).
        </p>
        <p>
          The <strong>performance optimization layer</strong> ensures that animations run smoothly by restricting animated properties to compositor-only properties (transform and opacity) and using the will-change CSS property to hint the browser about upcoming animations. The will-change property tells the browser to promote the element to its own compositor layer before the animation starts, avoiding the layer promotion cost during the animation. However, will-change should be used sparingly — promoting too many elements to compositor layers consumes GPU memory and can degrade overall performance. The optimization layer should also implement animation throttling — reducing animation complexity or disabling animations entirely when the device is under heavy load or when the user has enabled reduced motion preferences.
        </p>
        <p>
          The <strong>animation sequencing layer</strong> coordinates multiple animations to create complex, choreographed effects. Sequencing can be achieved through several patterns. The Promise-based pattern uses the finished Promise to trigger the next animation: <code>animation1.finished.then(() =&gt; animation2.play())</code>. The event-based pattern uses the onfinish event handler to trigger subsequent animations. The timeline-based pattern uses the AnimationTimeline interface to synchronize multiple animations to a shared timeline, enabling them to start, progress, and end in coordination. The staggered pattern creates multiple animations with incremental delays, producing a cascading effect where elements animate one after another with a small offset.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/animation-compositor-model.svg"
          alt="Animation Compositor Model diagram showing the difference between compositor-only animations (transform, opacity) that run on GPU and main-thread animations (layout, paint properties) that compete with JavaScript"
          caption="Animation compositor model — compositor-only properties (transform, opacity) run on the GPU-accelerated compositor thread independent of main thread activity, while layout and paint properties require main thread involvement and can cause jank when the main thread is busy"
          width={900}
          height={500}
        />

        <p>
          The <strong>animation cleanup layer</strong> prevents memory leaks by removing animations when they are no longer needed. Animations created through the Web Animations API persist in the element&apos;s animations list even after they finish, consuming memory. The cancel method removes the animation and its effects immediately. The finish method completes the animation but leaves it in the animations list. For animations that should be removed after completion, call cancel after the finished Promise resolves, or use the onfinish event handler to call cancel. For infinite animations (iterations: Infinity), call cancel when the animation is no longer needed — for example, when the component is unmounted or the user navigates away from the page.
        </p>
        <p>
          The <strong>reduced motion handling layer</strong> respects user preferences for reduced animation. Many users enable reduced motion preferences in their operating system or browser to minimize vestibular triggers (motion-induced nausea and dizziness). The application should detect the <code>prefers-reduced-motion</code> media query and adapt its animations accordingly. For users who prefer reduced motion, replace complex animations with simple opacity transitions or disable animations entirely. This is not just an accessibility best practice — it is a requirement for WCAG compliance and provides a better experience for users with motion sensitivity.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/animation-sequencing-patterns.svg"
          alt="Animation Sequencing Patterns diagram showing Promise-based chaining, event-based triggering, timeline synchronization, and staggered cascading animations"
          caption="Animation sequencing patterns — Promise-based chaining uses finished Promise for sequential animations, event-based uses onfinish handlers, timeline synchronization shares a timeline across multiple animations, and staggered patterns create cascading effects with incremental delays"
          width={900}
          height={550}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          The Web Animations API involves trade-offs between control and complexity, between performance and flexibility, and between native capabilities and library convenience. Understanding these trade-offs is essential for choosing the right animation approach for each use case.
        </p>
        <p>
          The most significant trade-off is <strong>control versus implementation complexity</strong>. The Web Animations API provides granular control over every aspect of animation — keyframes, timing, playback state, sequencing — but this control comes with implementation complexity. Creating complex animations requires defining keyframe arrays, configuring timing options, managing animation objects, handling events, and implementing cleanup logic. CSS animations, by contrast, are defined declaratively in stylesheets with minimal JavaScript — typically just adding or removing a class. For simple animations (hover effects, loading spinners, page transitions), CSS animations are simpler and more maintainable. For complex, interactive animations (drag-and-drop feedback, scroll-driven animations, data visualization transitions), the Web Animations API&apos;s control justifies its complexity.
        </p>
        <p>
          The <strong>performance versus property flexibility</strong> trade-off affects which properties can be animated smoothly. The Web Animations API runs on the compositor thread only for transform and opacity properties. Animating other properties — width, height, top, left, color, background — requires main thread involvement and can cause jank. Third-party animation libraries like GSAP can animate any CSS property, but they do so on the main thread, accepting the performance trade-off for greater flexibility. The solution is to restrict Web Animations API usage to transform and opacity properties and use CSS transitions or third-party libraries for properties that require main thread animation, accepting the performance cost where necessary.
        </p>
        <p>
          The <strong>native API versus library convenience</strong> trade-off affects development velocity and feature richness. The Web Animations API is a native browser API with no dependencies, small bundle size (zero — it is built into the browser), and optimal performance. However, it lacks many features that animation libraries provide out of the box: spring physics, morphing between shapes, path-based animation, stagger utilities, timeline scrubbing, and a rich ecosystem of plugins and presets. Libraries like GSAP provide these features with polished APIs and extensive documentation. The trade-off is bundle size (GSAP is approximately 20KB minified + gzip) and dependency management. For applications with simple animation needs, the native API is sufficient. For applications requiring advanced animation features, a library may be more productive.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/animation-tradeoffs.svg"
          alt="Web Animations API Trade-offs comparison matrix showing control, performance, complexity, and feature richness across Web Animations API, CSS animations, and JavaScript animation libraries"
          caption="Animation approach trade-offs — Web Animations API provides programmatic control with compositor performance but requires more code, CSS animations are simple and performant but inflexible, JavaScript libraries offer rich features but run on the main thread with bundle size cost"
          width={900}
          height={500}
        />

        <h3>Animation Approach Comparison</h3>
        <p>
          <strong>CSS animations and transitions</strong> are defined declaratively in stylesheets and triggered by class toggling. They run on the compositor thread, providing optimal performance. They are ideal for simple, predefined animations that do not require runtime control. Limitations include limited JavaScript integration (no seeking, no dynamic keyframe generation, no playback rate control) and verbose syntax for complex animations.
        </p>
        <p>
          <strong>Web Animations API</strong> provides programmatic animation creation with compositor thread execution. It offers full runtime control (play, pause, reverse, seek, speed) and integrates naturally with JavaScript application logic. It is ideal for interactive animations, dynamic keyframe generation, and animation sequencing. Limitations include more verbose syntax than CSS animations and limited feature set compared to animation libraries.
        </p>
        <p>
          <strong>JavaScript animation libraries (GSAP, Anime.js, Framer Motion)</strong> provide rich animation features including spring physics, morphing, path-based animation, stagger utilities, and timeline scrubbing. They offer polished APIs and extensive documentation. Limitations include bundle size cost, main thread execution (potential jank), and dependency management. They are ideal for complex, feature-rich animations where development velocity is prioritized over minimal bundle size.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <p>
          The most critical best practice is <strong>animating only compositor properties</strong> — transform and opacity. These properties are handled entirely by the compositor thread, which runs independently of the main thread and is typically GPU-accelerated. Animating transform (translate, scale, rotate, skew) and opacity produces smooth, jank-free animations even when the main thread is busy. Avoid animating layout properties (width, height, top, left, margin, padding) and paint properties (color, background, border, box-shadow), as these require main thread involvement and can cause jank. If you need to animate a layout property, consider whether it can be replaced with a transform — for example, animating transform: translateX instead of left, or transform: scaleY instead of height.
        </p>
        <p>
          <strong>Using will-change strategically</strong> improves animation performance by hinting the browser to promote elements to compositor layers before animations start. Apply will-change to elements that will be animated: <code>will-change: transform, opacity</code>. This causes the browser to create a compositor layer for the element during the next style recalculation, avoiding the layer promotion cost during the animation. However, use will-change sparingly — each compositor layer consumes GPU memory, and promoting too many elements can degrade overall performance. Apply will-change only to elements that are about to be animated, and remove it after the animation completes by setting <code>will-change: auto</code>.
        </p>
        <p>
          <strong>Respecting reduced motion preferences</strong> is essential for accessibility. Detect the <code>prefers-reduced-motion</code> media query using <code>window.matchMedia(&apos;(prefers-reduced-motion: reduce)&apos;)</code> and adapt animations accordingly. For users who prefer reduced motion, replace complex animations with simple opacity transitions or disable animations entirely. This is not optional — it is a WCAG requirement and provides a better experience for users with vestibular disorders. Design your animations so that they enhance the experience but are not required for understanding the content.
        </p>
        <p>
          <strong>Centralizing animation definitions</strong> improves maintainability and consistency. Define animation configurations (keyframes, timing options, easing curves) in a centralized module or design token system rather than scattering them throughout component code. This enables consistent animation behavior across the application, easy adjustment of animation parameters, and A/B testing of different animation configurations. Use named animation presets (e.g., &quot;fadeIn&quot;, &quot;slideUp&quot;, &quot;scaleIn&quot;) that components reference by name, ensuring that the same animation looks the same everywhere it is used.
        </p>
        <p>
          <strong>Implementing proper animation cleanup</strong> prevents memory leaks. Animations created through the Web Animations API persist in the element&apos;s animations list even after they finish. Call the cancel method to remove animations when they are no longer needed — when the component is unmounted, when the user navigates away, or when the animation is replaced by a new one. For infinite animations, implement a cleanup mechanism that cancels the animation when the component is destroyed. In React components, this is typically done in the useEffect cleanup function.
        </p>
        <p>
          <strong>Using the finished Promise for sequencing</strong> provides clean, async/await-compatible animation sequencing. Instead of nesting callbacks in onfinish event handlers, use the finished Promise: <code>await animation1.finished; animation2.play()</code>. This enables linear, readable sequencing code and integrates naturally with async application logic. For parallel animations, use Promise.all: <code>await Promise.all([animation1.finished, animation2.finished])</code>. For staggered animations, create animations with incremental delays and await the last one to finish.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most common pitfall is <strong>animating layout and paint properties</strong>, which causes jank by forcing main thread involvement. Animating properties like width, height, top, left, margin, padding triggers layout recalculation on every animation frame, which is expensive and competes with other main thread work. Animating properties like color, background, border triggers paint on every frame, which is also expensive. The solution is to restrict animations to transform and opacity properties. If you need the visual effect of animating a layout property, achieve it through transform instead — use translateX instead of left, scaleY instead of height, and scale instead of width/height changes.
        </p>
        <p>
          <strong>Not cleaning up animations</strong> leads to memory leaks. Each animation created through the Web Animations API is stored in the element&apos;s animations list. If animations are not canceled or removed, they accumulate in memory, particularly in long-running applications or single-page applications where components are mounted and unmounted frequently. The solution is to always cancel animations when they are no longer needed. In component frameworks, implement cleanup in the unmount lifecycle hook. For infinite animations, ensure they are canceled when the component is destroyed.
        </p>
        <p>
          <strong>Ignoring reduced motion preferences</strong> creates accessibility barriers. Users with vestibular disorders experience nausea, dizziness, and headaches when exposed to motion-heavy animations. If the application does not respect the <code>prefers-reduced-motion</code> preference, these users may be unable to use the application comfortably. The solution is to detect the preference and adapt animations — replace motion-based animations with opacity transitions, reduce animation duration, or disable animations entirely for users who prefer reduced motion.
        </p>
        <p>
          <strong>Overusing will-change</strong> degrades performance instead of improving it. The will-change property tells the browser to promote an element to its own compositor layer, which consumes GPU memory. If many elements have will-change set, the GPU memory consumption can become significant, particularly on mobile devices with limited GPU memory. This can cause the browser to evict layers, resulting in worse performance than if will-change had not been used. The solution is to apply will-change only to elements that are about to be animated and remove it after the animation completes.
        </p>
        <p>
          <strong>Not handling animation cancellation</strong> leads to inconsistent UI state. When an animation is canceled (either explicitly by calling cancel or implicitly by creating a new animation on the same element), the element&apos;s styles revert to their pre-animation state (unless the fill mode is set to forwards). If the application logic assumes the animation completed and the element is in the final state, the UI may be inconsistent. The solution is to handle the oncancel event or check the animation&apos;s playState before assuming the element is in the expected state.
        </p>
        <p>
          <strong>Assuming universal browser support</strong> without feature detection leads to errors. The Web Animations API is supported in Chrome, Edge, Firefox, and Safari, but older browsers (Internet Explorer) do not support it. Additionally, some specific features (such as AnimationTimeline) have more limited support. The solution is to check for API support before using it: <code>if (element.animate)</code>. When the API is unsupported, fall back to CSS animations or a JavaScript animation library. A polyfill is available but adds bundle size and may not support all features.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Data Visualization Transitions</h3>
        <p>
          Data visualization libraries and custom chart implementations use the Web Animations API to animate transitions between data states. When a chart&apos;s data updates, the bars, lines, or points animate from their old positions to their new positions, providing visual continuity that helps users understand how the data has changed. The animation is created dynamically based on the old and new data values, with keyframes computed at runtime — something that is difficult to achieve with CSS animations but straightforward with the Web Animations API. The animations use transform for position changes (translateX, translateY, scale) and opacity for entrance and exit effects, ensuring smooth, jank-free transitions even for charts with hundreds of data points.
        </p>

        <h3>Interactive Drag-and-Drop Interfaces</h3>
        <p>
          Drag-and-drop interfaces use the Web Animations API to provide visual feedback during drag operations. When an item is picked up, it animates with a scale-up transform and shadow effect to indicate it is being dragged. As the item is moved, other items in the drop target area animate out of the way with slide transforms, creating space for the dragged item. When the item is dropped, it animates into its final position with a spring-like easing effect. If the drop is invalid, the item animates back to its original position with a bounce effect. All of these animations are created dynamically based on the drag position, drop target, and surrounding elements — requiring the programmatic control that the Web Animations API provides.
        </p>

        <h3>Scroll-Driven Animations</h3>
        <p>
          Scroll-driven animations tie animation progress to the scroll position, creating effects like parallax backgrounds, elements that fade in as they enter the viewport, and progress indicators that fill as the user scrolls through content. The Web Animations API is ideal for scroll-driven animations because the animation&apos;s currentTime can be set directly based on the scroll position: as the user scrolls, the animation seeks to the corresponding position. This provides smooth, scroll-synchronized animation without the complexity of calculating CSS keyframes for every scroll position. The animation runs on the compositor thread, ensuring smooth performance even during heavy scroll events.
        </p>

        <h3>Page Transitions and Route Changes</h3>
        <p>
          Single-page applications use the Web Animations API for page transition animations. When the user navigates to a new route, the current page animates out (fade out, slide out, or scale down) while the new page animates in (fade in, slide in, or scale up). The animations are coordinated using the finished Promise — the outgoing page&apos;s animation finishes, then the incoming page&apos;s animation starts. The animation direction and type can vary based on the navigation context — forward navigation might slide the current page left and the new page in from the right, while backward navigation reverses the direction. This creates a spatial mental model that helps users understand the navigation hierarchy.
        </p>

        <h3>Micro-Interactions and Feedback</h3>
        <p>
          Micro-interactions — small, purposeful animations that provide feedback for user actions — are a natural fit for the Web Animations API. Button press animations (scale down on press, scale up on release), like button animations (heart icon scales up and bursts with particles), loading animations (spinner with easing), and success/error animations (checkmark draw, shake effect) all benefit from the Web Animations API&apos;s programmatic control. The animations can be triggered by user interactions, respond to application state changes, and be canceled if the user performs another action before the animation completes. The compositor-only property restriction ensures that these micro-interactions run smoothly without affecting the performance of the rest of the application.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does the Web Animations API differ from CSS animations, and when would you choose each?
            </p>
            <p className="mt-2 text-sm">
              A: CSS animations are defined declaratively in stylesheets using @keyframes rules and applied to elements through the animation property. They are triggered by adding or removing CSS classes, and their control from JavaScript is limited to starting, stopping, and inspecting the animation state through the getAnimations method. CSS animations run on the compositor thread, providing optimal performance, and are ideal for simple, predefined animations that do not require runtime control.
            </p>
            <p className="mt-2 text-sm">
              The Web Animations API provides programmatic animation creation through the element.animate method, returning an Animation object with full runtime control — play, pause, reverse, seek, speed adjustment, and cancellation. Animations also run on the compositor thread for transform and opacity properties. The API is ideal for interactive animations that respond to user input, dynamic animations with runtime-computed keyframes, and complex animation sequences that require precise timing coordination.
            </p>
            <p className="mt-2 text-sm">
              Choose CSS animations for simple, static animations (hover effects, loading spinners, page load transitions) where the animation parameters are known at build time. Choose the Web Animations API for dynamic, interactive animations (drag-and-drop feedback, scroll-driven animations, data visualization transitions) where the animation parameters depend on runtime data or user input.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize animations for performance using the Web Animations API?
            </p>
            <p className="mt-2 text-sm">
              A: Performance optimization for Web Animations API centers on three principles. First, animate only compositor properties — transform and opacity. These properties are handled by the compositor thread, which runs independently of the main thread and is GPU-accelerated. Avoid animating layout properties (width, height, top, left) and paint properties (color, background), which require main thread involvement and can cause jank.
            </p>
            <p className="mt-2 text-sm">
              Second, use will-change strategically to hint the browser about upcoming animations. Apply will-change: transform, opacity to elements before animating them, and remove it after the animation completes. This promotes the element to a compositor layer before the animation starts, avoiding the layer promotion cost during the animation. Do not overuse will-change — each compositor layer consumes GPU memory.
            </p>
            <p className="mt-2 text-sm">
              Third, respect the prefers-reduced-motion media query and adapt animations for users who prefer reduced motion. Replace complex animations with simple opacity transitions or disable them entirely. This is both an accessibility requirement and a performance optimization, as reduced animations consume fewer resources.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you sequence multiple animations using the Web Animations API?
            </p>
            <p className="mt-2 text-sm">
              A: Animation sequencing can be achieved through several patterns. The Promise-based pattern uses the finished Promise: create the first animation, await its finished Promise, then create and play the second animation. This provides clean, async/await-compatible code: <code>const anim1 = el.animate(keyframes1, timing1); await anim1.finished; const anim2 = el.animate(keyframes2, timing2);</code>
            </p>
            <p className="mt-2 text-sm">
              For parallel animations, create multiple animations and await Promise.all of their finished Promises. For staggered animations, create multiple animations with incremental delays: the first animation has delay 0, the second has delay 100ms, the third has delay 200ms, and so on. All animations start at the same time, but the delays create a cascading effect.
            </p>
            <p className="mt-2 text-sm">
              For complex sequences with branching logic, use the onfinish event handler to trigger the next animation based on the result of the current one. This enables conditional sequencing — for example, if an animation is canceled, trigger a different follow-up animation than if it completed normally.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle animation cleanup to prevent memory leaks?
            </p>
            <p className="mt-2 text-sm">
              A: Animations created through the Web Animations API persist in the element&apos;s animations list even after they finish. Each animation object consumes memory for its keyframe data, timing options, and state. In long-running applications or single-page applications where components are mounted and unmounted frequently, uncanceled animations accumulate and cause memory leaks.
            </p>
            <p className="mt-2 text-sm">
              The solution is to cancel animations when they are no longer needed. For finite animations, cancel them in the component&apos;s unmount lifecycle hook. For infinite animations (iterations: Infinity), cancel them when the component is destroyed or when the animation is no longer relevant. In React, this is done in the useEffect cleanup function: return a function that calls animation.cancel().
            </p>
            <p className="mt-2 text-sm">
              Additionally, be aware that creating a new animation on an element that already has an animation will automatically cancel the existing animation. This is useful for replacing animations but can cause unexpected behavior if you intended the animations to run concurrently. Use element.getAnimations() to inspect existing animations before creating new ones.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you create scroll-driven animations with the Web Animations API?
            </p>
            <p className="mt-2 text-sm">
              A: Scroll-driven animations link the animation&apos;s progress to the scroll position. Create an animation on the element with the desired keyframes and timing options. Then, in the scroll event handler, calculate the scroll progress as a value between 0 and 1 based on the scroll position relative to the total scrollable range. Set the animation&apos;s currentTime to the progress multiplied by the animation&apos;s duration: <code>animation.currentTime = progress * animation.effect.getTiming().duration</code>.
            </p>
            <p className="mt-2 text-sm">
              For better performance, use requestAnimationFrame to update the animation during the browser&apos;s rendering cycle rather than directly in the scroll event handler. The scroll event fires at a high frequency, and updating the animation on every scroll event can cause performance issues. Instead, set a flag in the scroll event handler and update the animation in the next requestAnimationFrame callback.
            </p>
            <p className="mt-2 text-sm">
              The Scroll-driven Animations specification (a newer addition to the web platform) provides native scroll-timeline support that eliminates the need for JavaScript scroll handlers. However, browser support for scroll-timeline is still limited, so the JavaScript-based approach described above is the production-ready solution for now.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.w3.org/TR/web-animations-1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C Web Animations Level 1 Specification
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN Web Docs — Web Animations API Complete Reference
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/animations/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Animation Performance Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Performance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — CSS Animation Performance and Compositor Properties
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/web-animation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Can I Use — Web Animations API Browser Compatibility
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
