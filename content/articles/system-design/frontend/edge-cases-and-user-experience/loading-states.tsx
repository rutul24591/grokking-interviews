"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-loading-states-extensive",
  title: "Loading States",
  description:
    "Staff-level deep dive into loading state patterns, perceived performance optimization, progressive content revelation, loading state architecture, and systematic approaches to maintaining user engagement during asynchronous operations.",
  category: "frontend",
  subcategory: "edge-cases-and-user-experience",
  slug: "loading-states",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "loading states",
    "perceived performance",
    "UX patterns",
    "progressive loading",
    "async UI",
  ],
  relatedTopics: [
    "skeleton-screens",
    "optimistic-ui-updates",
    "error-states",
    "empty-states",
  ],
};

export default function LoadingStatesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Loading states</strong> are the visual and interactive
          representations an application displays while asynchronous operations
          are in progress — data fetching from APIs, file uploads, complex
          computations, or server-side processing. They bridge the temporal gap
          between a user&apos;s action and the application&apos;s response,
          communicating that the system is working rather than broken. Well-
          designed loading states reduce perceived wait times, maintain user
          confidence, and prevent error-inducing behaviors like double-clicking
          submit buttons or navigating away during critical operations.
        </p>
        <p>
          The psychology of waiting is central to loading state design. Research
          consistently shows that perceived performance matters more than actual
          performance — a two-second load that shows progressive content feels
          faster than a one-second load preceded by a blank screen. Nielsen&apos;s
          response time thresholds remain foundational: 100 milliseconds feels
          instantaneous (no loading indicator needed), one second maintains flow
          (a subtle indicator suffices), and beyond ten seconds risks user
          abandonment (a detailed progress indicator with an estimated time
          remaining is essential). Between these thresholds, the choice of
          loading pattern dramatically affects user perception.
        </p>
        <p>
          At the staff and principal engineer level, loading states are an
          architectural concern, not merely a UI pattern. The loading state
          strategy must be consistent across the application, integrated with
          the data fetching layer, coordinated with error and empty state
          handling, and tested systematically. A design system should define
          standard loading components (spinners, skeleton screens, progress
          bars, shimmer effects) with clear guidelines for when to use each.
          The data layer should expose loading state information through a
          consistent interface, whether the team uses React Query, SWR, Apollo
          Client, or custom hooks. And the testing strategy must include loading
          state verification — ensuring components display the correct loading
          variant, transition smoothly to loaded content, and handle loading
          failures gracefully.
        </p>
        <p>
          Modern frontend architectures have expanded the loading state
          landscape significantly. Server components stream content
          progressively, Suspense boundaries define loading fallbacks
          declaratively, and concurrent rendering enables prioritized content
          display. These capabilities allow for more sophisticated loading
          experiences — showing above-the-fold content immediately while
          streaming below-the-fold content, displaying interactive navigation
          before data-heavy panels load, and revealing content in a sequence
          that matches the user&apos;s reading pattern. The challenge is
          orchestrating these capabilities into a coherent experience where
          loading transitions feel natural rather than jarring.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Spinner/Indeterminate Indicator:</strong> The simplest
            loading pattern — a rotating icon or animation indicating that
            processing is in progress without specifying progress or duration.
            Spinners are appropriate for short waits (under three seconds) where
            progress cannot be meaningfully measured. They should be sized and
            positioned contextually: inline spinners for button submissions,
            section-level spinners for panel loading, and page-level spinners
            (used sparingly) for full navigation transitions.
          </li>
          <li>
            <strong>Skeleton Screen:</strong> A placeholder UI that mimics the
            shape and layout of the content that will eventually load, typically
            using gray rectangles and circles where text, images, and avatars
            will appear. Skeleton screens reduce perceived load time by
            establishing visual structure before content arrives, priming the
            user&apos;s spatial expectations and eliminating the jarring
            transition from empty to full content. They are most effective for
            content-rich pages with predictable layouts.
          </li>
          <li>
            <strong>Progress Bar/Determinate Indicator:</strong> A visual
            element that communicates specific progress toward completion —
            percentage loaded, files processed, bytes uploaded. Progress bars
            are appropriate for operations with measurable progress: file
            uploads, batch processing, multi-step forms. They set accurate
            expectations about remaining wait time and give users a sense of
            control. Progress bars should never appear to stall — if progress
            measurement is unavailable, use an indeterminate pattern instead.
          </li>
          <li>
            <strong>Progressive Content Revelation:</strong> A loading strategy
            where content appears incrementally as it becomes available rather
            than waiting for all content to load before displaying anything.
            Streaming SSR, React Suspense, and incremental data loading enable
            progressive revelation. The strategy requires careful orchestration
            to avoid layout shifts — content should flow into pre-allocated
            spaces, and the revelation order should follow the user&apos;s
            expected reading or interaction pattern.
          </li>
          <li>
            <strong>Optimistic Loading:</strong> Displaying the expected result
            of an operation immediately, before the server confirms success.
            Optimistic loading eliminates perceived latency for operations with
            high success rates (sending a message, toggling a setting, adding
            to a list). The UI shows the expected state instantly and reverts
            only if the server returns an error. This pattern blurs the line
            between loading states and loaded states, providing the illusion
            of instantaneous response.
          </li>
          <li>
            <strong>Loading State Hierarchy:</strong> The organizational
            pattern where loading indicators are positioned at the appropriate
            level of the component hierarchy — inline for form submissions,
            component-level for individual data sources, section-level for
            major page regions, and page-level for navigation transitions.
            Each level requires different visual treatments. Misaligned
            hierarchy (showing a full-page spinner for a single component&apos;s
            data fetch) creates unnecessarily disruptive loading experiences.
          </li>
          <li>
            <strong>Stale-While-Revalidate:</strong> A caching strategy where
            the application displays cached (potentially stale) content
            immediately while fetching fresh data in the background. When the
            fresh data arrives, the UI updates seamlessly. This pattern
            eliminates loading states for repeat visits and makes the
            application feel instantly responsive. SWR (the library), React
            Query, and service worker caching implement this pattern.
          </li>
          <li>
            <strong>Loading Timeout and Fallback:</strong> A defensive pattern
            where loading states that exceed a defined threshold trigger
            alternative behaviors — showing cached content, displaying a
            simplified version, or presenting an error state with retry
            options. Timeouts prevent indefinite loading spinners that erode
            user trust. The threshold should be calibrated to the operation
            type: API calls might timeout at five seconds, while file uploads
            might allow sixty seconds with progress updates.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Loading state architecture spans data fetching integration, component
          hierarchy design, and transition orchestration. The following diagrams
          illustrate the key patterns.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/loading-states-diagram-1.svg"
          alt="Loading state hierarchy showing page-level, section-level, component-level, and inline loading indicators with their appropriate use cases"
          caption="Figure 1: Loading state hierarchy — how different loading indicator levels align with component scope and user impact."
        />
        <p>
          The loading state hierarchy determines which level of the component
          tree owns the loading indicator for each data dependency. Page-level
          loading indicators (navigation progress bars, full-page overlays) are
          reserved for route transitions where the entire page content changes.
          Section-level indicators (panel skeletons, region spinners) handle
          independent data sources within a page — a dashboard where each widget
          loads independently, for example. Component-level indicators (card
          skeletons, list item shimmer) handle individual content items within
          a section. Inline indicators (button spinners, input validation
          loaders) handle user-initiated actions within a component. The
          hierarchy ensures that loading feedback is proportionate to the scope
          of the operation — a single card reloading should not trigger a
          page-level loading state.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/loading-states-diagram-2.svg"
          alt="Loading state machine showing idle, loading, success, error, and stale states with transitions between them"
          caption="Figure 2: Loading state machine — the complete lifecycle of an asynchronous operation from idle through loading to success, error, or stale states."
        />
        <p>
          The loading state machine models the complete lifecycle of an
          asynchronous operation. The machine begins in the idle state (no
          operation in progress). When an operation is triggered, it transitions
          to the loading state (indicator displayed). From loading, the machine
          transitions to either the success state (content displayed), the error
          state (error message with retry option), or the timeout state (timeout
          message with fallback content). From the success state, a revalidation
          trigger transitions to the stale state (cached content displayed with
          background refresh indicator). Each transition has defined visual
          treatments, and the state machine ensures that all edge cases —
          rapid successive requests, concurrent operations, component unmounting
          during loading — are handled consistently.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/loading-states-diagram-3.svg"
          alt="Progressive content revelation flow showing streaming SSR, Suspense boundaries, and prioritized content loading order"
          caption="Figure 3: Progressive content revelation — how streaming SSR and Suspense boundaries enable prioritized content display."
        />
        <p>
          Progressive content revelation uses React Suspense boundaries to
          define which parts of the page load independently and in what order.
          The page shell (header, navigation, layout structure) renders
          immediately from the server. The primary content area (article text,
          product details, search results) streams next, revealing within
          its Suspense boundary. Secondary content (sidebar recommendations,
          related items, comments) loads subsequently in separate Suspense
          boundaries. Each boundary displays its own fallback (skeleton screen)
          while its content loads, creating a progressive reveal from most
          important to least important content. The orchestration ensures that
          users can begin reading or interacting with primary content while
          secondary content continues to load in the background.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-theme bg-panel p-2 text-left">Pattern</th>
              <th className="border border-theme bg-panel p-2 text-left">Advantages</th>
              <th className="border border-theme bg-panel p-2 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-theme p-2">Spinner</td>
              <td className="border border-theme p-2">
                Simple to implement, universally understood, minimal layout impact, works for any content shape.
              </td>
              <td className="border border-theme p-2">
                Provides no progress information, does not reduce perceived wait time, can feel stale after two to three seconds, draws attention to the wait.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">Skeleton screen</td>
              <td className="border border-theme p-2">
                Reduces perceived load time, establishes layout structure, prevents content shift when data arrives, feels responsive and modern.
              </td>
              <td className="border border-theme p-2">
                Requires per-component skeleton design, must match actual content layout, complex for dynamic content shapes, adds maintenance overhead.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">Progress bar</td>
              <td className="border border-theme p-2">
                Provides accurate progress information, sets expectations for remaining wait, gives users a sense of control.
              </td>
              <td className="border border-theme p-2">
                Requires measurable progress, inaccurate progress feels worse than no progress, stalling progress bars erode trust more than spinners.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">Stale-while-revalidate</td>
              <td className="border border-theme p-2">
                Eliminates loading states for repeat visits, instant perceived response, graceful content refresh in background.
              </td>
              <td className="border border-theme p-2">
                Shows potentially stale data, requires cache management strategy, content shift when fresh data differs from cached data.
              </td>
            </tr>
            <tr>
              <td className="border border-theme p-2">Optimistic updates</td>
              <td className="border border-theme p-2">
                Zero perceived latency for mutations, immediate user feedback, natural and responsive interaction feel.
              </td>
              <td className="border border-theme p-2">
                Must handle rollback on failure, complex state management for concurrent optimistic updates, risky for low-success-rate operations.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Match loading indicator scope to operation scope:</strong>{" "}
            Use the loading state hierarchy to select the appropriate indicator level. A single data source reloading should show a component-level indicator, not a full-page spinner. Navigation between routes should show a page-level progress bar, not a blank screen. Misaligned scope creates unnecessarily disruptive loading experiences.
          </li>
          <li>
            <strong>Use skeleton screens for content-rich, predictable layouts:</strong>{" "}
            Skeleton screens are most effective when the loaded content has a consistent, predictable shape — feeds, card grids, article pages. For content with unpredictable shape or size, a simpler indicator (shimmer bar, inline spinner) may be more appropriate than a skeleton that does not match the eventual content.
          </li>
          <li>
            <strong>Delay loading indicators for fast operations:</strong>{" "}
            Operations that typically complete within 200 to 300 milliseconds should not show a loading indicator at all — the indicator would flash and disappear, creating visual noise. Implement a delay (typically 200 milliseconds) before showing loading indicators, so fast operations complete without any visible loading state.
          </li>
          <li>
            <strong>Prevent layout shifts during loading transitions:</strong>{" "}
            Allocate space for loading content before it arrives. Skeleton screens, fixed-height containers, and CSS aspect-ratio ensure that the page layout remains stable as content loads. Layout shifts during loading (content pushing other content down as it appears) degrade the Cumulative Layout Shift web vital and create a janky user experience.
          </li>
          <li>
            <strong>Implement loading state timeouts with fallback behavior:</strong>{" "}
            Every loading state should have a timeout. When the timeout expires, transition to either an error state with retry options, cached content with a refresh indicator, or a simplified version of the content. Indefinite loading spinners erode user trust and provide no recovery path.
          </li>
          <li>
            <strong>Coordinate multiple loading states to avoid visual chaos:</strong>{" "}
            When multiple components on a page have independent data sources, coordinate their loading behavior. Options include showing a single page-level skeleton until all critical data loads, sequencing the loading reveal to avoid simultaneous visual transitions, or grouping related components under shared Suspense boundaries.
          </li>
          <li>
            <strong>Test loading states explicitly in integration tests:</strong>{" "}
            Use network mocking to simulate slow responses and verify that loading indicators appear at the correct time, persist for the expected duration, and transition cleanly to the loaded state. Also test the timeout and error paths that loading states connect to.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Showing full-page spinners for partial data fetches:</strong>{" "}
            Blocking the entire page with a spinner because one component is loading prevents users from interacting with already-available content. Use component-level loading indicators so the rest of the page remains interactive while individual sections load.
          </li>
          <li>
            <strong>Flash of loading state for fast operations:</strong>{" "}
            Showing and immediately hiding a loading indicator for operations that complete in under 200 milliseconds creates distracting visual flicker. Add a minimum delay before showing indicators and a minimum display duration (at least 300 milliseconds once shown) to prevent the flash.
          </li>
          <li>
            <strong>Skeleton screens that do not match loaded content:</strong>{" "}
            Skeleton shapes that differ significantly from the actual content layout create a confusing transition — the user&apos;s spatial expectations from the skeleton do not match the loaded content. Maintain skeleton components alongside their data-driven counterparts and update skeletons when the content layout changes.
          </li>
          <li>
            <strong>No loading state at all:</strong>{" "}
            Simply rendering nothing while data fetches creates a blank or partially-rendered page that users may interpret as broken. Every asynchronous operation that affects the UI should have an explicit loading state, even if it is just a subtle inline indicator.
          </li>
          <li>
            <strong>Using loading states instead of optimistic updates for high-confidence operations:</strong>{" "}
            Operations with near-100% success rates (toggling a favorite, sending a chat message, updating a setting) should use optimistic updates instead of loading indicators. Showing a spinner for a toggle switch adds unnecessary friction to an operation that almost always succeeds.
          </li>
          <li>
            <strong>Indefinite loading states without timeout or recovery:</strong>{" "}
            A spinner that rotates indefinitely because a request failed silently or hung provides no path to recovery. Always pair loading states with timeout handling, retry mechanisms, and clear error states for when loading ultimately fails.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>Facebook&apos;s skeleton loading approach:</strong> Facebook pioneered the widespread use of skeleton screens in their News Feed. The feed shows gray placeholder blocks that match the shape of posts (header with avatar, text lines, image area) while content loads. This approach reduced perceived load time significantly and has since become an industry standard. Facebook&apos;s implementation coordinates skeleton display with their data preloading strategy — the skeleton appears only for content not already available in the client cache.
        </p>
        <p>
          <strong>YouTube&apos;s progressive content loading:</strong> YouTube loads the video player and metadata first, followed by recommendations, comments, and supplementary content in subsequent render passes. Each section has its own loading state — the video player shows a centered spinner, recommendations show card skeletons, and comments show text line skeletons. This progressive approach ensures users can start watching immediately while the rest of the page populates.
        </p>
        <p>
          <strong>Slack&apos;s message loading strategy:</strong> Slack uses a combination of loading patterns: skeleton screens for channel switching, stale-while-revalidate for returning to previously viewed channels, and optimistic updates for message sending. The typing indicator serves as a pre-loading signal that prepares users for incoming content. This multi-pattern approach ensures that each interaction type receives the most appropriate loading treatment.
        </p>
        <p>
          <strong>Stripe Dashboard&apos;s coordinated loading:</strong> Stripe&apos;s dashboard loads multiple data-intensive widgets (revenue charts, transaction lists, balance summaries) independently, each with its own skeleton loading state. The loading is orchestrated to reveal above-the-fold content first, with below-the-fold widgets loading as the user scrolls. Critical metrics at the top of the dashboard load fastest, creating a sense of progressive discovery.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you use a skeleton screen versus a spinner?</p>
            <p className="mt-2 text-sm">
              A: Use skeleton screens for content-rich areas with predictable layouts — feeds, card grids, profiles, article pages — where the loaded content shape is known in advance. Skeletons reduce perceived load time by establishing layout structure. Use spinners for short operations (under three seconds) where the content shape is unpredictable, for inline actions (button submissions), and for situations where designing a matching skeleton is impractical. A general guideline: if the content takes more than one second to load and has a consistent shape, use a skeleton. If it is under one second or has an unpredictable shape, use a spinner or no indicator at all.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent layout shifts during loading?</p>
            <p className="mt-2 text-sm">
              A: Allocate space for content before it loads using several techniques. For known-dimension content (images, videos), use CSS aspect-ratio or explicit width and height attributes. For text content, use skeleton screens that match the expected content height. For lists, render skeleton items matching the expected count. For dynamic content, use min-height on containers to prevent collapse. Measure CLS in lab and field using Lighthouse and the Web Vitals library, setting a performance budget of 0.1 or lower for CLS. Test loading transitions specifically — many CLS issues only appear during the loading-to-loaded transition.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle multiple independent loading states on a single page?</p>
            <p className="mt-2 text-sm">
              A: Coordinate loading states through a loading orchestration strategy. Option one: group related components under shared Suspense boundaries so they load and reveal together, reducing visual fragmentation. Option two: sequence the reveal — load and reveal the most important content first, then progressively reveal secondary content. Option three: use a waterfall approach where each section begins loading as the previous one completes. The best approach depends on data dependencies and user priorities. Avoid the worst case — multiple spinners animating independently across the page, which creates visual chaos and draws attention to the wait.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does React Suspense change loading state architecture?</p>
            <p className="mt-2 text-sm">
              A: Suspense fundamentally shifts loading state management from imperative to declarative. Instead of checking isLoading flags and conditionally rendering loading indicators, components declare their data dependencies and Suspense boundaries handle the loading fallback automatically. This eliminates manual loading state management, ensures consistent loading behavior, and enables the framework to coordinate loading across the component tree. Suspense boundaries can be nested for granular loading — an outer boundary for the page shell, inner boundaries for independent sections. With streaming SSR, Suspense boundaries also define the streaming granularity — each boundary can send its content to the client as soon as it is ready.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics would you track to evaluate loading state effectiveness?</p>
            <p className="mt-2 text-sm">
              A: Track both technical and user experience metrics. Technical: Time to First Byte (TTFB), First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Cumulative Layout Shift (CLS) — all directly affected by loading state implementation. User experience: perceived performance surveys, time-on-task measurements, abandonment rates during loading, and error recovery rates (how often users successfully retry after loading failures). Also track loading state duration distribution — what percentage of loading states exceed three seconds, ten seconds, or the timeout threshold. This data informs decisions about when to invest in faster backends versus better loading state design.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.nngroup.com/articles/response-times-3-important-limits/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Response Time Limits
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/cls" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              web.dev — Cumulative Layout Shift (CLS)
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/Suspense" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              React — Suspense Component Documentation
            </a>
          </li>
          <li>
            <a href="https://swr.vercel.app/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              SWR — React Hooks for Data Fetching
            </a>
          </li>
          <li>
            <a href="https://www.lukew.com/ff/entry.asp?1797" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              LukeW — Mobile Design Details: Avoid The Spinner
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
