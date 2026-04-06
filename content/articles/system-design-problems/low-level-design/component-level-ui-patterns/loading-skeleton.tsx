"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-loading-skeleton",
  title: "Design a Loading Skeleton Component",
  description:
    "Complete LLD solution for a production-grade loading skeleton component with type-based shapes (text, image, avatar, custom), CSS shimmer animation, responsive widths, composition patterns, SSR-first rendering, accessibility, and CLS prevention.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "loading-skeleton",
  wordCount: 3200,
  readingTime: 20,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "loading-skeleton",
    "shimmer",
    "css-animation",
    "accessibility",
    "cls-prevention",
    "ssr",
  ],
  relatedTopics: [
    "toast-notification-system",
    "data-table",
    "search-autocomplete",
    "optimistic-updates",
  ],
};

export default function LoadingSkeletonArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable loading skeleton component system for a
          large-scale React application. When data is being fetched from an API,
          the application must show a structural placeholder that mirrors the
          dimensions and layout of the eventual content, giving the user an
          immediate visual indication that content is loading. Unlike a spinner
          (which is an indeterminate circular animation), a skeleton is a
          content-shaped placeholder that occupies the same space as the loaded
          content, preventing layout shift and providing a smoother perceived
          loading experience. The skeleton system must support multiple shapes
          (text lines, rectangular images, circular avatars, and custom shapes),
          include an animated shimmer effect, compose cleanly with loading-state
          wrappers, and integrate with data-fetching libraries like React Query
          and SWR. The system must be accessible to screen readers, performant
          with CSS-only animations (no JavaScript animation loops), and SSR-safe
          so skeletons render immediately on the server and are replaced by
          actual content on the client.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application is a React 19+ SPA with support for concurrent features
            and server-side rendering.
          </li>
          <li>
            Skeletons are used across many components (cards, tables, profiles,
            dashboards), so they must be composable and configurable.
          </li>
          <li>
            The shimmer animation must run at 60fps without JavaScript intervention
            (CSS-only keyframes).
          </li>
          <li>
            Skeleton dimensions must closely match the eventual content dimensions
            to prevent cumulative layout shift (CLS).
          </li>
          <li>
            The application may run in both light and dark mode, and skeleton colors
            must adapt accordingly.
          </li>
          <li>
            Screen readers must be informed when a container is in a loading state
            via ARIA attributes.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Skeleton Types:</strong> Support four shape types: text (single
            or multiple lines), rectangle (images, cards, banners), circle (avatars,
            profile photos), and custom (arbitrary border-radius for specialized shapes).
          </li>
          <li>
            <strong>Shimmer Animation:</strong> Each skeleton renders with a CSS-based
            shimmer effect (animated gradient sweep) that loops infinitely while loading.
          </li>
          <li>
            <strong>Responsive Widths:</strong> Skeleton widths can be specified as
            absolute pixel values or percentage-based responsive values (e.g., 60%, 80%)
            to adapt to container width changes.
          </li>
          <li>
            <strong>Composition:</strong> A <code>SkeletonWrapper</code> component
            accepts a <code>loading</code> prop and renders skeleton children when
            loading is true, or actual children when loading is false.
          </li>
          <li>
            <strong>SSR-First Rendering:</strong> Skeletons render immediately during
            SSR, providing content structure on the initial HTML response. They are
            replaced by actual content once client-side data resolves.
          </li>
          <li>
            <strong>Accessibility:</strong> Loading containers include
            <code>aria-busy=&quot;true&quot;</code> and
            <code>aria-label</code> describing what is loading. Screen readers
            announce the loading state appropriately.
          </li>
          <li>
            <strong>Integration:</strong> The skeleton system integrates with React
            Query (<code>isLoading</code>, <code>isFetching</code>) and SWR (
            <code>isLoading</code>, <code>isValidating</code>) loading states.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> The shimmer animation must be GPU-composited
            (animated via <code>background-position</code> on a pseudo-element or
            <code>transform: translateX</code>). No <code>requestAnimationFrame</code>
            loops or JavaScript-driven animation.
          </li>
          <li>
            <strong>CLS Prevention:</strong> Skeleton dimensions must match the final
            content dimensions. Text skeletons use the same line count and approximate
            line height as the rendered text. Image skeletons use the same aspect ratio.
          </li>
          <li>
            <strong>Type Safety:</strong> Full TypeScript support for skeleton types,
            props, and wrapper configuration. The <code>SkeletonType</code> union
            enforces valid shape values at compile time.
          </li>
          <li>
            <strong>Theming:</strong> Skeleton colors adapt to light and dark mode via
            CSS custom properties or Tailwind utility classes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Skeleton shown for an extended period (slow network, large payload) —
            shimmer animation loops indefinitely without performance degradation.
          </li>
          <li>
            Rapid loading state toggles (cached data, stale-while-revalidate) —
            skeleton flashes in and out; must avoid jarring visual transitions.
          </li>
          <li>
            Skeleton for content with dynamic height (e.g., variable-length text) —
            skeleton must estimate height or use min-height to prevent layout shift
            when content exceeds the skeleton.
          </li>
          <li>
            SSR hydration mismatch — if server renders a skeleton but client already
            has cached data, the skeleton should not render at all.
          </li>
          <li>
            Nested skeletons (e.g., a card skeleton containing text and image
            skeletons) — must not cause nested shimmer animations to desynchronize
            visually.
          </li>
          <li>
            Reduced motion preference — users with{" "}
            <code>prefers-reduced-motion: reduce</code> should see a static skeleton
            without the shimmer animation.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to provide a set of composable, type-driven skeleton
          components that mirror the structure of the content they are replacing.
          A root <code>Skeleton</code> component dispatches to type-specific
          sub-components (<code>SkeletonLine</code>, <code>SkeletonRect</code>,
          <code>SkeletonCircle</code>) based on a <code>type</code> prop. Each
          sub-component renders a div with a CSS background that includes the
          shimmer gradient animation. A <code>SkeletonWrapper</code> component
          handles the loading-state switching logic: when <code>loading</code> is
          true, it renders its skeleton children; when false, it renders its
          actual children. This composition pattern avoids conditional rendering
          boilerplate at every call site.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Spinner-only loading:</strong> A simple spinner is easy to
            implement but provides no structural context about what is loading.
            Users perceive spinners as longer waits because they see no progress
            toward the final layout. Skeletons are superior for perceived performance
            because they show the shape of the incoming content.
          </li>
          <li>
            <strong>Static placeholder divs:</strong> Using plain gray divs without
            animation works but feels like a broken UI. The shimmer animation signals
            to the user that the system is actively loading, not that the content is
            missing or broken.
          </li>
          <li>
            <strong>JavaScript-driven animation (requestAnimationFrame):</strong>
            Updating skeleton gradient positions via JS works but consumes the main
            thread, competes with React rendering, and drains battery on mobile
            devices. CSS keyframes run on the compositor thread and are strictly
            preferable.
          </li>
        </ul>
        <p>
          <strong>Why CSS shimmer + type-dispatch + wrapper composition is optimal:</strong>{" "}
          CSS keyframe animations for the shimmer effect run entirely on the GPU
          compositor thread, ensuring 60fps with zero JavaScript overhead. The type
          dispatch pattern keeps the public API simple (consumers pass a{" "}
          <code>type</code> prop) while encapsulating shape-specific logic in
          dedicated components. The wrapper component eliminates the repetitive{" "}
          <code>{"{loading ? <Skeleton /> : <Content />}"}</code> pattern at every
          call site, centralizing loading-state logic in one place.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            1. Skeleton Types &amp; Interfaces (<code>skeleton-types.ts</code>)
          </h4>
          <p>
            Defines the <code>SkeletonType</code> union (
            <code>text | image | avatar | custom</code>), the{" "}
            <code>SkeletonProps</code> interface shared by all skeleton components
            (width, height, count, radius, animated, className, ariaLabel), and
            type-specific prop interfaces for each skeleton variant. The{" "}
            <code>SkeletonWrapperProps</code> interface adds the{" "}
            <code>loading</code> boolean and <code>children</code> for the
            composition wrapper.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            2. Root Skeleton Component (<code>skeleton.tsx</code>)
          </h4>
          <p>
            The entry-point component that accepts a <code>type</code> prop and
            dispatches to the appropriate sub-component. For <code>type=&quot;text&quot;</code>,
            it renders multiple <code>SkeletonLine</code> components. For{" "}
            <code>type=&quot;image&quot;</code>, it renders a{" "}
            <code>SkeletonRect</code>. For <code>type=&quot;avatar&quot;</code>, it
            renders a <code>SkeletonCircle</code>. The custom type renders a div
            with configurable border-radius. This component is the public API that
            most consumers will use directly.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            3. Skeleton Line (<code>skeleton-line.tsx</code>)
          </h4>
          <p>
            Renders one or more horizontal bars representing text lines. Supports a{" "}
            <code>count</code> prop for multi-line text, a <code>widths</code> array
            for varying line widths (e.g., [100%, 85%, 60%] to mimic natural text
            paragraph shapes), and fixed <code>height</code> matching the expected
            line-height of the rendered text. Each line is a div with the shimmer
            background class.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            4. Skeleton Rect (<code>skeleton-rect.tsx</code>)
          </h4>
          <p>
            Renders a rectangular placeholder for images, cards, or banners. Supports
            configurable <code>width</code>, <code>height</code>, and{" "}
            <code>radius</code> (border-radius). The shimmer animation sweeps across
            the rectangle. Aspect-ratio preservation is encouraged via Tailwind&apos;s{" "}
            <code>aspect-ratio</code> utilities or explicit height values.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            5. Skeleton Circle (<code>skeleton-circle.tsx</code>)
          </h4>
          <p>
            Renders a circular placeholder for avatars, profile photos, or circular
            icons. Uses <code>border-radius: 50%</code> and a configurable{" "}
            <code>size</code> prop (defaults to 48px, matching common avatar sizes).
            The shimmer animation radiates from the center outward.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">
            6. Skeleton Wrapper (<code>skeleton-wrapper.tsx</code>)
          </h4>
          <p>
            The composition component that accepts a <code>loading</code> boolean
            and <code>children</code>. When loading is true, it renders the skeleton
            children; when false, it renders the actual content children. Wraps the
            output in a container with <code>aria-busy</code> set appropriately. This
            eliminates conditional rendering boilerplate and centralizes accessibility
            attributes in one place.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Shimmer Animation Strategy</h3>
        <p>
          The shimmer effect is implemented as a CSS keyframe animation that moves a
          linear gradient across the element background. The gradient consists of three
          color stops: a base color (dark gray in light mode, dark gray in dark mode),
          a highlight color (lighter gray), and the base color again. The keyframe
          animates <code>background-position</code> from <code>-200% 0</code> to{" "}
          <code>200% 0</code>, creating a sweeping light band across the skeleton. The
          animation runs infinitely with a linear easing and a duration of
          approximately 1.5 seconds.
        </p>
        <p>
          For users with <code>prefers-reduced-motion: reduce</code>, a media query
          disables the animation entirely, rendering a static gray placeholder. This
          is a legal requirement in many jurisdictions and a best practice for users
          with vestibular disorders.
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/loading-skeleton-architecture.svg"
          alt="Loading Skeleton Architecture"
          caption="Architecture of the loading skeleton system showing type-based dispatch, CSS shimmer animation, and wrapper composition"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Parent component receives <code>loading=true</code> from React Query or
            SWR.
          </li>
          <li>
            Parent renders <code>{"<SkeletonWrapper loading={true}>"}</code> with
            skeleton children inside.
          </li>
          <li>
            <code>SkeletonWrapper</code> renders its children (skeletons) and sets{" "}
            <code>aria-busy=&quot;true&quot;</code> on the container.
          </li>
          <li>
            Each skeleton component renders a div with the shimmer CSS class, sized
            to match the expected content dimensions.
          </li>
          <li>
            Browser applies the CSS keyframe animation on the compositor thread.
            Shimmer sweeps across all skeleton elements.
          </li>
          <li>
            Data resolves, parent re-renders with <code>loading=false</code>.
          </li>
          <li>
            <code>SkeletonWrapper</code> switches to rendering actual content children.
            Skeletons unmount, animations stop.
          </li>
          <li>
            Actual content renders in the same space previously occupied by skeletons.
            Because dimensions match, no layout shift occurs.
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a unidirectional pattern driven by the loading
          state from a data-fetching library. The loading state is the single source
          of truth that determines whether skeletons or content render.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration with React Query</h3>
        <p>
          When using React Query, the <code>useQuery</code> hook returns an{" "}
          <code>isLoading</code> flag that is true only during the initial fetch
          (no cached data exists) and <code>isFetching</code> that is true during
          any background refetch. The skeleton system should use <code>isLoading</code>
          for the initial skeleton render and may optionally show a subtle shimmer
          during <code>isFetching</code> for stale-while-revalidate scenarios. The
          recommended pattern is: show full skeleton during <code>isLoading</code>,
          show no skeleton during <code>isFetching</code> (content remains visible,
          optional opacity transition during refetch).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration with SWR</h3>
        <p>
          SWR provides <code>isLoading</code> (no data yet) and{" "}
          <code>isValidating</code> (currently fetching). The same pattern applies:
          skeleton during <code>isLoading</code>, no skeleton during{" "}
          <code>isValidating</code>. SWR&apos;s <code>fallbackData</code> option can
          be used to provide skeleton-shaped placeholder data during SSR, ensuring
          the server renders the skeleton HTML immediately.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Extended loading (slow network):</strong> The shimmer animation
            loops indefinitely via CSS keyframes. No JavaScript timer or state update
            is required. The browser compositor thread handles the animation with
            negligible CPU usage.
          </li>
          <li>
            <strong>Rapid loading toggles:</strong> If data is cached and loading
            resolves within milliseconds, the skeleton may flash briefly. Mitigation:
            add a <code>delay</code> prop (e.g., 200ms) to the SkeletonWrapper that
            only renders skeletons if loading persists beyond the delay threshold.
          </li>
          <li>
            <strong>SSR hydration mismatch:</strong> If the server renders a skeleton
            but the client has cached data, React will attempt to replace the skeleton
            with content during hydration. To prevent warnings, use a{" "}
            <code>useEffect</code>-based mount check in the SkeletonWrapper: render
            skeleton during SSR, then on client mount, check if data is already
            available and render content instead. This is a controlled hydration
            transition.
          </li>
          <li>
            <strong>Reduced motion:</strong> The CSS <code>@media
            (prefers-reduced-motion: reduce)</code> rule disables the shimmer
            keyframe animation, rendering a static gray placeholder. This is
            handled entirely in CSS with no JavaScript detection required.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the{" "}
          <strong>Example tab</strong>. Below is a high-level overview of each module
          and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Switch to the Example Tab
          </h3>
          <p>
            The complete, production-ready implementation consists of 7 files:
            TypeScript interfaces for all skeleton types, a root Skeleton component
            with type-based dispatch, three shape-specific sub-components (line, rect,
            circle), a SkeletonWrapper for loading-state composition, CSS keyframes
            for the shimmer animation, and a full EXPLANATION.md walkthrough. Click
            the <strong>Example</strong> toggle at the top of the article to view all
            source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Module 1: Skeleton Types (skeleton-types.ts)
        </h3>
        <p>
          Defines the <code>SkeletonType</code> union (
          <code>text | image | avatar | custom</code>), the base{" "}
          <code>SkeletonProps</code> interface with shared fields (width, height,
          animated, className, ariaLabel), and the <code>SkeletonWrapperProps</code>
          interface adding the <code>loading</code> boolean. All interfaces use
          optional fields with sensible defaults to minimize boilerplate at call
          sites.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Module 2: Root Skeleton (skeleton.tsx)
        </h3>
        <p>
          The dispatch component accepts a <code>type</code> prop and renders the
          appropriate sub-component. For text type, it supports a <code>count</code>{" "}
          prop for multiple lines and a <code>widths</code> array for varying line
          widths. For image and avatar types, it delegates to SkeletonRect and
          SkeletonCircle respectively. The custom type renders a div with the shimmer
          class and a configurable border-radius. The component merges className props
          to allow consumer overrides.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Module 3: Skeleton Line (skeleton-line.tsx)
        </h3>
        <p>
          Renders <code>count</code> number of horizontal bars, each with a
          configurable width (from the <code>widths</code> array or a default of
          100%). Each line uses the shimmer CSS class. The height defaults to 16px
          (matching a 1rem line-height with padding). Lines are separated by a
          consistent gap (8px) to match typical text line spacing. The last line
          can be given a shorter width to mimic natural paragraph endings.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Module 4: Skeleton Rect (skeleton-rect.tsx)
        </h3>
        <p>
          A rectangular div with configurable width, height, and border-radius. The
          shimmer class provides the animated gradient background. For image
          placeholders, the rect should match the aspect ratio of the actual image
          (e.g., 16:9 for thumbnails, 1:1 for square images). Tailwind&apos;s{" "}
          <code>w-full</code>, <code>h-48</code>, and <code>rounded-lg</code>{" "}
          utilities are commonly used.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Module 5: Skeleton Circle (skeleton-circle.tsx)
        </h3>
        <p>
          A circular div with <code>border-radius: 50%</code> and a configurable size.
          Defaults to 48px, which matches common avatar sizes in design systems. The
          shimmer class provides the animated gradient. For larger circular placeholders
          (e.g., profile photo previews), the size prop scales accordingly.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Module 6: Skeleton Wrapper (skeleton-wrapper.tsx)
        </h3>
        <p>
          The composition component that accepts <code>loading</code> and{" "}
          <code>children</code>. When loading is true, renders the skeleton children.
          When false, renders the actual content. Wraps output in a container div
          with <code>aria-busy=&quot;true&quot;</code> (when loading) or{" "}
          <code>aria-busy=&quot;false&quot;</code> (when loaded). An optional{" "}
          <code>aria-label</code> describes what is loading (e.g., &quot;Loading
          user profile&quot;). An optional <code>delay</code> prop prevents skeleton
          flashing for fast resolutions by only rendering skeletons if loading persists
          beyond the delay threshold.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Module 7: Shimmer CSS (shimmer-animation.css)
        </h3>
        <p>
          Defines the <code>@keyframes shimmer</code> animation that moves a linear
          gradient from <code>-200% 0</code> to <code>200% 0</code>. The gradient
          uses three stops: base color, highlight, base color. The animation runs
          infinitely over 1.5 seconds with linear easing. A{" "}
          <code>@media (prefers-reduced-motion: reduce)</code> block disables the
          animation by setting <code>animation: none</code> and rendering the base
          color as a static background. The shimmer class is applied to skeleton
          elements via Tailwind&apos;s <code>className</code> prop.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Animation Performance</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Property</th>
                <th className="p-2 text-left">Approach</th>
                <th className="p-2 text-left">Thread</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Shimmer animation</td>
                <td className="p-2">
                  CSS <code>background-position</code>
                </td>
                <td className="p-2">Compositor (GPU)</td>
              </tr>
              <tr>
                <td className="p-2">Layout</td>
                <td className="p-2">Fixed dimensions matching content</td>
                <td className="p-2">No layout recalculation</td>
              </tr>
              <tr>
                <td className="p-2">Paint</td>
                <td className="p-2">
                  <code>will-change: background-position</code> hint
                </td>
                <td className="p-2">Optimized repaint</td>
              </tr>
              <tr>
                <td className="p-2">JS overhead</td>
                <td className="p-2">Zero — no rAF, no state updates</td>
                <td className="p-2">None</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The shimmer animation uses <code>background-position</code> which, while
          not a transform property, is optimized by modern browsers for gradient
          animations because the gradient is pre-composited. For even better
          performance, an alternative approach uses a pseudo-element with{" "}
          <code>transform: translateX</code> (which is strictly GPU-composited),
          but the background-position approach is simpler and performs well for
          typical skeleton counts (under 20 elements on screen).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">CLS Prevention</h3>
        <p>
          Cumulative Layout Shift is the primary performance metric that skeletons
          address. To prevent CLS:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Text skeletons:</strong> Use the same number of lines as the
            expected content. For variable-length text (e.g., article titles), use
            a max line count (e.g., 3 lines) and accept that shorter text will have
            unused skeleton lines that disappear on content render — this is
            acceptable because the container height shrinks, which does not count
            as CLS if it does not push other content.
          </li>
          <li>
            <strong>Image skeletons:</strong> Use the exact aspect ratio of the
            loaded image. If the image is 16:9, the skeleton rect must be 16:9.
            This prevents the image from pushing content below it when it loads.
          </li>
          <li>
            <strong>Avatar skeletons:</strong> Use a fixed size (e.g., 48px) matching
            the actual avatar image size. Circular images are typically a fixed size
            in design systems, so this is straightforward.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Excessive skeleton count:</strong> Rendering 50+ skeleton elements
            on a complex page (e.g., a data table with 20 rows, each with 3 skeleton
            cells) means 60+ simultaneous shimmer animations. While each animation is
            GPU-composited, the browser still needs to manage 60+ compositor layers.
            Mitigation: limit shimmer to the viewport-visible skeletons, use
            intersection observer to defer off-screen skeleton animations.
          </li>
          <li>
            <strong>Large skeleton elements:</strong> A full-page skeleton rect
            (e.g., a hero image placeholder at 1920x600) with a shimmer animation
            creates a large offscreen surface that the browser composites. Mitigation:
            use <code>contain: strict</code> CSS property to limit the compositing
            scope.
          </li>
          <li>
            <strong>Hydration mismatch costs:</strong> If SSR renders skeletons but
            client hydrates with content (due to pre-fetched data), React must
            reconcile the DOM difference. This causes a re-render of the entire
            skeleton subtree. Mitigation: use the mount-check pattern in
            SkeletonWrapper to defer skeleton rendering on the client until the
            first render cycle completes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Delay threshold:</strong> Only show skeletons if loading exceeds
            200-300ms. For fast resolutions (cached data, edge CDN), skip the skeleton
            entirely and render content directly. This eliminates the flash of skeleton
            followed immediately by content.
          </li>
          <li>
            <strong>Batch skeleton rendering:</strong> For data tables or lists,
            render a single skeleton row and repeat it via CSS or a loop, rather than
            rendering unique skeleton components per cell. This reduces React component
            tree size.
          </li>
          <li>
            <strong>will-change hint:</strong> Apply <code>will-change: background-position</code>
            to skeleton elements to promote them to their own compositor layer before
            the animation starts. Remove the hint after animation begins to free
            memory (the browser manages this automatically for CSS animations).
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The loading container (SkeletonWrapper) sets{" "}
              <code>aria-busy=&quot;true&quot;</code> when skeletons are visible.
              Screen readers announce &quot;busy&quot; or &quot;loading&quot; to
              indicate that content is being fetched.
            </li>
            <li>
              An <code>aria-label</code> describes what is loading (e.g., &quot;Loading
              user profile&quot;, &quot;Loading search results&quot;). This provides
              context beyond the generic &quot;busy&quot; announcement.
            </li>
            <li>
              For critical loading states (e.g., payment processing), use{" "}
              <code>role=&quot;status&quot;</code> on the container with a live region
              so screen readers announce when loading completes (&quot;Content loaded&quot;).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Reduced Motion</h4>
          <p>
            The shimmer animation is disabled for users with{" "}
            <code>prefers-reduced-motion: reduce</code> via a CSS media query. The
            skeleton renders as a static gray placeholder. This is not optional — it
            is a WCAG 2.1 requirement and a legal requirement in many jurisdictions.
            Users with vestibular disorders can experience nausea or dizziness from
            continuous motion animations.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Keyboard Navigation</h3>
        <ul className="space-y-2">
          <li>
            Skeletons themselves are not interactive (they are <code>div</code>{" "}
            elements without <code>tabIndex</code>), so they do not enter the tab
            order. This is correct — users should not tab to loading placeholders.
          </li>
          <li>
            The SkeletonWrapper container is also non-interactive. When content
            replaces skeletons, the actual interactive elements (buttons, links,
            inputs) receive their natural tab order.
          </li>
          <li>
            If a loading state includes a cancel/retry button, that button must be
            focusable and operable via keyboard while skeletons are visible.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Validation</h3>
        <p>
          Skeleton components do not accept user input or render untrusted content,
          so XSS is not a direct concern. However, the <code>aria-label</code> prop
          on SkeletonWrapper may contain dynamic strings (e.g., <code>{`"Loading {productName}"`}</code>). Ensure these strings are sanitized if they originate
          from user-generated content or API responses. React&apos;s default text
          rendering escapes HTML, so plain string interpolation is safe.
        </p>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Skeleton type dispatch:</strong> Render <code>{"<Skeleton type=\"text\" />"}</code>,{" "}
            <code>{"<Skeleton type=\"image\" />"}</code>,{" "}
            <code>{"<Skeleton type=\"avatar\" />"}</code>, and assert that the
            correct sub-component renders (SkeletonLine, SkeletonRect, SkeletonCircle).
            Verify DOM structure: text skeletons produce multiple divs, image
            skeletons produce a single rect, avatar skeletons produce a circle.
          </li>
          <li>
            <strong>SkeletonWrapper loading toggle:</strong> Render SkeletonWrapper
            with <code>loading=true</code>, assert skeleton children are in the DOM
            and <code>aria-busy=&quot;true&quot;</code> is set. Re-render with{" "}
            <code>loading=false</code>, assert actual children replace skeletons and{" "}
            <code>aria-busy=&quot;false&quot;</code>.
          </li>
          <li>
            <strong>Delay threshold:</strong> Render SkeletonWrapper with{" "}
            <code>{`delay={200}`}</code> and <code>{`loading={true}`}</code>. Advance timers
            by 100ms, assert skeletons are not yet rendered. Advance to 250ms, assert
            skeletons appear. Set <code>loading=false</code> at 150ms, assert
            skeletons never rendered.
          </li>
          <li>
            <strong>Line widths:</strong> Render SkeletonLine with{" "}
            <code>{"widths={['100%', '80%', '60%']"}</code>,
            assert three lines render with the correct inline styles or Tailwind classes.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>React Query integration:</strong> Mock a useQuery hook with a
            500ms delay. Render a component using SkeletonWrapper with{" "}
            <code>{`loading={isLoading}`}</code>. Assert skeletons render immediately,
            content appears after 500ms, skeletons are removed.
          </li>
          <li>
            <strong>CLS measurement:</strong> Use Playwright&apos;s{" "}
            <code>performance.getEntriesByType(&quot;layout-shift&quot;)</code> to
            measure CLS during the skeleton-to-content transition. Assert CLS is
            below 0.1 (good threshold).
          </li>
          <li>
            <strong>SSR rendering:</strong> Render the component on the server,
            assert skeleton HTML is present in the server-rendered HTML string.
            Hydrate on client with cached data, assert content replaces skeleton
            without hydration warnings.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility Tests</h3>
        <ul className="space-y-2">
          <li>
            Run axe-core automated checks on a page with visible skeletons. Verify
            no violations.
          </li>
          <li>
            Test with a screen reader (NVDA, VoiceOver, or JAWS). Verify that
            <code>aria-busy=&quot;true&quot;</code> causes the screen reader to
            announce &quot;busy&quot; or &quot;loading&quot;.
          </li>
          <li>
            Test with <code>prefers-reduced-motion: reduce</code> enabled in browser
            dev tools. Verify shimmer animation is not playing (static gray placeholder).
          </li>
          <li>
            Verify skeleton elements are not in the tab order (no <code>tabIndex</code>
            on skeleton divs).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Rapid loading toggles (50ms on/off cycles): verify no memory leaks, no
            stale state, skeletons clean up correctly.
          </li>
          <li>
            50+ skeleton elements on screen simultaneously: verify no jank, all
            shimmer animations run at 60fps, memory usage is stable.
          </li>
          <li>
            Skeleton for content with dynamic height: verify container height
            transitions smoothly when content exceeds skeleton height.
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Skeleton vs Spinner Decision Framework</h3>
        <p>
          Interviewers often ask when to use a skeleton versus a spinner. The decision
          framework is:
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Use Skeletons When:</h4>
          <ul className="space-y-2">
            <li>
              The content shape is predictable and known in advance (e.g., card layouts,
              user profiles, data tables).
            </li>
            <li>
              You want to prevent cumulative layout shift (CLS). Skeletons reserve the
              exact space the content will occupy.
            </li>
            <li>
              Perceived performance matters. Skeletons create the illusion of progress
              because the user sees the structure filling in.
            </li>
            <li>
              The loading duration is expected to be moderate (1-5 seconds). Skeletons
              maintain engagement during this window.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Use Spinners When:</h4>
          <ul className="space-y-2">
            <li>
              The content shape is unknown or variable (e.g., search results with
              varying result types, API responses with dynamic schemas).
            </li>
            <li>
              The loading duration is expected to be long (5+ seconds). A spinner
              with a progress indicator is more appropriate than a skeleton that
              loops indefinitely.
            </li>
            <li>
              The action is a brief operation (under 1 second) where rendering a
              skeleton would cause a flash. A subtle spinner is less disruptive.
            </li>
            <li>
              The loading is occurring during a user-initiated action (e.g., form
              submission, file upload) where a spinner on the button itself provides
              direct feedback.
            </li>
          </ul>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Using skeletons with wrong dimensions:</strong> Candidates often
            render skeletons with arbitrary sizes that do not match the eventual content.
            This causes layout shift when content replaces the skeleton, defeating the
            primary purpose of using skeletons over spinners.
          </li>
          <li>
            <strong>JavaScript-driven animations:</strong> Implementing shimmer via{" "}
            <code>requestAnimationFrame</code> or CSS-in-JS animation libraries
            (Framer Motion, React Spring) consumes the main thread and battery.
            Interviewers expect CSS-only keyframe animations for this use case.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> Rendering skeletons without{" "}
            <code>aria-busy</code> or without respecting <code>prefers-reduced-motion</code>{" "}
            means screen reader users get no loading indication and motion-sensitive
            users get an annoying animation. Both are production-blocking issues.
          </li>
          <li>
            <strong>No delay threshold:</strong> Showing skeletons immediately causes
            a flash when data resolves in under 100ms (cached responses, edge CDN).
            Interviewers look for candidates who discuss the delay threshold pattern
            (show skeleton only if loading exceeds 200-300ms).
          </li>
          <li>
            <strong>Over-nesting skeletons:</strong> Wrapping every individual element
            in its own SkeletonWrapper creates deeply nested loading state logic. The
            correct approach is one SkeletonWrapper per logical content block (e.g.,
            one wrapper per card, not one per text line within a card).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">CSS background-position vs transform: translateX</h4>
          <p>
            The shimmer animation can be implemented either by animating{" "}
            <code>background-position</code> on the element itself or by animating{" "}
            <code>transform: translateX</code> on a pseudo-element overlay. The
            background-position approach is simpler (single element, no pseudo-element
            complexity) and performs well for moderate skeleton counts. However,
            <code>background-position</code> triggers paint (not just composite), which
            means the browser repaints the gradient on each frame. The transform approach
            is strictly GPU-composited (no repaint) but requires a pseudo-element or
            additional wrapper div. For most applications, background-position is the
            right trade-off; transform is justified for pages with 50+ skeletons.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">SkeletonWrapper vs Conditional Rendering</h4>
          <p>
            The inline pattern <code>{"{loading ? <Skeleton /> : <Content />}"}</code>{" "}
            is simple and requires no additional components. The SkeletonWrapper pattern
            adds a layer of abstraction but centralizes accessibility attributes, delay
            thresholds, and loading-state logic. For small applications, inline
            conditional rendering is fine. For large codebases with dozens of loading
            states, SkeletonWrapper provides consistency and reduces boilerplate.
            Interviewers expect candidates to articulate this trade-off rather than
            dogmatically preferring one approach.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">SSR Skeletons vs SSR Content</h4>
          <p>
            Rendering skeletons during SSR ensures the initial HTML response has a
            complete page structure, which is good for perceived performance and SEO
            (search engine crawlers see a structured page). However, if the server
            can fetch the data during SSR (e.g., via getServerSideProps in Next.js or
            loaders in Remix), rendering the actual content is preferable to rendering
            a skeleton that will be immediately replaced on hydration. The trade-off:
            skeletons during SSR are simpler (no server-side data fetching) but slower
            (client must fetch after hydration). Server-fetched content during SSR is
            faster but adds server complexity and coupling.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle skeletons for a virtualized list (e.g., 1000
              items with windowing)?
            </p>
            <p className="mt-2 text-sm">
              A: Render skeleton items that match the virtualized item height. The
              virtualizer (react-window, tanstack-virtual) calculates how many items
              are visible and renders that many skeletons. As the user scrolls, new
              skeleton items render for unloaded rows. When data loads for a specific
              range, those skeleton items are replaced with actual content. The key is
              that skeleton items must have the exact same height as content items to
              maintain scroll position accuracy.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you add a progress indicator to a long-loading skeleton?
            </p>
            <p className="mt-2 text-sm">
              A: For operations exceeding 3-5 seconds, add a determinate progress bar
              below the skeleton. The skeleton continues its shimmer animation, and the
              progress bar fills based on known progress (e.g., bytes downloaded, steps
              completed). If progress is unknown (indeterminate), use an indeterminate
              progress bar (animated fill with unknown endpoint). This communicates
              that the system is still working, not stalled.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test CLS caused by skeleton-to-content transitions?
            </p>
            <p className="mt-2 text-sm">
              A: Use Playwright with the{" "}
              <code>PerformanceObserver</code> API to capture{" "}
              <code>layout-shift</code> entries during the transition. Alternatively,
              use Lighthouse CI in your CI/CD pipeline to measure CLS on a production
              build. For unit-level testing, mock <code>ResizeObserver</code> to
              simulate content dimensions differing from skeleton dimensions and assert
              that the container handles the resize gracefully (e.g., via CSS{" "}
              <code>min-height</code> matching skeleton height).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle skeleton theming (light/dark mode)?
            </p>
            <p className="mt-2 text-sm">
              A: Skeleton colors are defined via CSS custom properties (
              <code>--skeleton-base</code>, <code>--skeleton-highlight</code>) that
              change values based on the active theme. In light mode, the base is a
              light gray and the highlight is a near-white. In dark mode, the base is
              a dark gray and the highlight is a mid-gray. Tailwind&apos;s{" "}
              <code>dark:</code> variant utilities handle this at the component level.
              The shimmer gradient references these custom properties, so the animation
              automatically adapts to theme changes without JavaScript intervention.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What if the content fails to load (error state)? Should the skeleton
              remain visible?
            </p>
            <p className="mt-2 text-sm">
              A: No. On error, the skeleton should be replaced with an error state
              component (error message, retry button). The SkeletonWrapper&apos;s{" "}
              <code>loading</code> prop should be derived from the data-fetching
              library&apos;s error state: <code>{"loading = isLoading && !error"}</code>.
              When error is truthy, loading is false, and the error component renders
              in place of both the skeleton and the content. The skeleton should never
              persist in an error state.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement skeleton prefetching (show skeleton before
              the user navigates to a page)?
            </p>
            <p className="mt-2 text-sm">
              A: Prefetching skeletons is not typically useful — skeletons are a
              loading-state UI, not a prefetching target. Instead, prefetch the actual
              data (using React Query&apos;s <code>prefetchQuery</code> or SWR&apos;s{" "}
              <code>preload</code>) so that when the user navigates to the page, the
              data is already cached and the skeleton is skipped entirely. If you must
              show a skeleton during prefetch, render it on hover (e.g., hover a link,
              show a mini skeleton preview). This is an advanced pattern used by
              frameworks like Next.js for route prefetching.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.smashingmagazine.com/2020/04/placeholder-loading-skeletons-css/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Placeholder / Skeleton Loading with CSS
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/cls"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web.dev — Cumulative Layout Shift (CLS)
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WCAG 2.1 — Animation from Interactions (Reduced Motion)
            </a>
          </li>
          <li>
            <a
              href="https://css-tricks.com/building-skeleton-screens-css-custom-properties/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CSS-Tricks — Building Skeleton Screens with CSS Custom Properties
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/progress-indicators/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Progress Indicators Make Waiting Easier
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/prefers-reduced-motion"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — prefers-reduced-motion Media Query
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
