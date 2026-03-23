"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-skeleton-screens-extensive",
  title: "Skeleton Screens",
  description:
    "Staff-level deep dive into skeleton screen architecture, placeholder design patterns, perceived performance optimization, layout stability strategies, and systematic approaches to content-shape previews during asynchronous loading.",
  category: "frontend",
  subcategory: "edge-cases-and-user-experience",
  slug: "skeleton-screens",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-03-23",
  tags: [
    "frontend",
    "skeleton screens",
    "perceived performance",
    "loading UX",
    "layout stability",
    "CLS",
  ],
  relatedTopics: [
    "loading-states",
    "empty-states",
    "performance-optimization",
    "web-vitals",
  ],
};

export default function SkeletonScreensArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Skeleton screens</strong> are placeholder UI elements that mirror the layout and shape of content before the actual data arrives, creating an impression that the page is loading progressively rather than appearing all at once. Unlike spinners or loading bars that communicate &ldquo;wait, something is happening,&rdquo; skeleton screens communicate &ldquo;content is coming and will look like this&rdquo; — a subtle but powerful difference in user perception. The technique was popularized by Facebook in 2014 and has since become a standard loading pattern adopted by virtually every major consumer application, from LinkedIn and YouTube to Slack and Notion.
        </p>
        <p>
          The psychological foundation of skeleton screens rests on the concept of perceived duration. Research by Viget and Google has demonstrated that users perceive loading times as shorter when they can see the outline of incoming content compared to blank screens or isolated spinners. This works because skeleton screens engage the brain&apos;s pattern completion mechanisms — the visual system starts processing the page layout even before content arrives, reducing the cognitive work needed once real content appears. The effect is most pronounced for familiar interfaces where users can predict what will fill each placeholder, making skeleton screens most effective for applications with consistent, predictable layouts.
        </p>
        <p>
          At the staff and principal engineer level, skeleton screens are a design system concern that intersects performance, accessibility, and architectural boundaries. A skeleton screen strategy must address several cross-cutting questions: which components should have skeletons (not all of them should), how skeletons are generated and maintained in sync with their corresponding loaded components, how skeletons interact with server-side rendering and streaming, how they affect Cumulative Layout Shift metrics, and how they are perceived by assistive technologies. A poorly implemented skeleton screen strategy can actually hurt performance perception if skeletons cause layout shifts when content arrives, if they persist too long for fast connections, or if they flash briefly on cached content loads.
        </p>
        <p>
          Modern frameworks have increasingly formalized skeleton screen integration through Suspense boundaries in React, which allow components to declare their loading fallbacks declaratively. This shifts skeleton screens from an imperative pattern (check if loading, show skeleton) to a declarative one (wrap in Suspense with skeleton fallback), enabling more consistent application of loading states and better composition of nested loading boundaries. Server components with streaming further blur the line between skeleton and content, as individual sections of a page can resolve independently, progressively replacing their skeleton placeholders without client-side state management.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Content Placeholder:</strong> A neutral-colored shape (typically light gray rectangles, circles, or rounded blocks) that approximates the dimensions and position of the actual content it represents. Text placeholders use multiple horizontal bars of varying widths to suggest paragraph structure. Image placeholders use rectangles matching the expected aspect ratio. Avatar placeholders use circles. The shapes must closely match the final content dimensions to avoid layout shift when data arrives.
          </li>
          <li>
            <strong>Shimmer Animation:</strong> A subtle gradient animation that sweeps across skeleton placeholders to indicate loading activity. The shimmer typically moves from left to right using a CSS gradient that transitions from the skeleton base color through a slightly lighter highlight and back. This animation serves the same psychological purpose as a progress bar — it shows that the system is active rather than frozen. The animation should be smooth (60fps), subtle (not distracting), and respect reduced motion preferences via the prefers-reduced-motion media query.
          </li>
          <li>
            <strong>Pulse Animation:</strong> An alternative to shimmer that uses opacity oscillation to create a breathing or pulsing effect on skeleton elements. Pulse animations are simpler to implement than shimmer gradients and can be less distracting in dense interfaces. The choice between shimmer and pulse is often a design system decision — shimmer conveys directional progress while pulse conveys ambient activity.
          </li>
          <li>
            <strong>Layout Stability:</strong> The degree to which the skeleton matches the dimensions of the loaded content, measured by the Cumulative Layout Shift (CLS) metric. A well-designed skeleton has zero or near-zero CLS because the content fills exactly the space the skeleton occupied. Achieving this requires either knowing content dimensions in advance (through aspect ratio metadata for images, line count estimates for text) or using constraints that limit content to fixed dimensions regardless of data.
          </li>
          <li>
            <strong>Content-Aware Skeletons:</strong> Skeleton screens that use metadata or cached data to more accurately preview the expected content shape. Instead of showing generic gray bars, content-aware skeletons might use the previously cached layout structure — knowing that a product card has a title, a price, a two-line description, and a thumbnail image — to render a more accurate placeholder. This approach requires tighter coupling between the skeleton and the component data model but produces a smoother transition.
          </li>
          <li>
            <strong>Skeleton Composition:</strong> The practice of building complex skeleton layouts by composing smaller skeleton primitives (text lines, circles, rectangles) rather than creating monolithic skeleton components for each page. A composable skeleton system provides primitives like SkeletonText, SkeletonAvatar, SkeletonImage, and SkeletonCard that can be assembled to match any component layout, reducing the maintenance burden of keeping skeleton components in sync with their data-loaded counterparts.
          </li>
          <li>
            <strong>Loading Threshold:</strong> A configurable delay (typically 200-500 milliseconds) before showing a skeleton screen. If data arrives within this threshold, the content renders directly without flashing a skeleton, avoiding the jarring effect of a skeleton that appears for only a fraction of a second. This threshold must be tuned per application — too short and fast connections see skeleton flashes, too long and slow connections see blank screens.
          </li>
          <li>
            <strong>Skeleton Scope:</strong> The granularity at which skeleton screens are applied — full-page skeletons that replace the entire viewport, section-level skeletons that replace individual panels or feeds, or component-level skeletons that replace individual cards, list items, or widgets. Finer granularity enables progressive loading where some sections show content while others still show skeletons, but it also increases complexity and the number of skeleton components that must be maintained.
          </li>
          <li>
            <strong>Transition Animation:</strong> The visual effect used when skeleton placeholders are replaced by actual content. Common approaches include a simple opacity crossfade, a reveal animation where content appears to fill the skeleton shape from one direction, or no animation at all (instant replacement). The transition should be fast (150-300ms) to avoid delaying content visibility, and it should not cause layout reflow.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The first diagram illustrates the skeleton screen rendering pipeline and decision flow. When a component mounts and initiates a data fetch, the system checks whether data is available in cache. If cached data exists and is fresh, the component renders immediately with no skeleton. If cached data exists but is stale, the component renders with stale data and shows a subtle refresh indicator while revalidating in the background. If no cache exists, the system starts a loading threshold timer. If data arrives before the threshold (fast network), the component renders directly. If the threshold elapses, the skeleton appears and persists until data arrives, at which point a smooth transition animation replaces the skeleton with content. This multi-path approach ensures that skeletons only appear when they genuinely improve the user experience.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/skeleton-screens-diagram-1.svg"
          alt="Skeleton screen rendering decision flow showing cache check, loading threshold timer, and content transition paths"
          width={900}
          height={500}
        />
        <p>
          The second diagram shows the skeleton component architecture within a design system. At the base layer, atomic skeleton primitives (SkeletonLine, SkeletonCircle, SkeletonRect, SkeletonBlock) provide configurable shapes with width, height, border-radius, and animation type properties. The composition layer combines primitives into commonly used patterns — SkeletonCard (image rect + title line + description lines), SkeletonListItem (avatar circle + two text lines), SkeletonProfile (large circle + name line + bio lines). The page layer assembles compositions to create full page skeletons that match the application&apos;s grid layout. Each layer builds on the one below, enabling consistent skeleton styles while reducing duplication. When a loaded component&apos;s layout changes, only its corresponding skeleton composition needs updating rather than rebuilding the entire page skeleton.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/skeleton-screens-diagram-2.svg"
          alt="Skeleton component architecture showing atomic primitives, composition layer, and page assembly with design system integration"
          width={900}
          height={500}
        />
        <p>
          The third diagram depicts the relationship between skeleton screens and Suspense boundaries in a streaming server rendering architecture. The server begins rendering the page shell (header, navigation, layout grid) and sends it immediately. As each data-dependent section resolves on the server, it replaces its Suspense fallback (skeleton) in the HTML stream. On the client, React hydrates the already-visible content and sets up Suspense boundaries for any sections that require client-side data fetching. This architecture enables nested loading — the page shell appears instantly, followed by above-the-fold content sections replacing their skeletons, followed by below-the-fold content. The skeleton-to-content transitions happen at different times for different sections, creating a natural progressive loading experience that maps to actual data availability rather than artificial delays.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/edge-cases-and-user-experience/skeleton-screens-diagram-3.svg"
          alt="Streaming server rendering with Suspense boundaries showing progressive skeleton-to-content replacement across page sections"
          width={900}
          height={500}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="px-4 py-2 text-left">Aspect</th>
              <th className="px-4 py-2 text-left">Advantages</th>
              <th className="px-4 py-2 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Skeleton Screens</td>
              <td className="px-4 py-2">Reduce perceived loading time, prevent layout shift when well-designed, provide spatial context for incoming content, work well for predictable layouts, feel modern and polished</td>
              <td className="px-4 py-2">Require maintenance to stay in sync with component layouts, can mislead users about content structure if inaccurate, add complexity to the component library, may flash briefly on fast connections without threshold logic</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Spinner / Loading Indicator</td>
              <td className="px-4 py-2">Simple to implement, universally understood, no maintenance burden from layout changes, appropriate for indeterminate loading where content shape is unknown</td>
              <td className="px-4 py-2">Cause layout shift when content appears, provide no spatial context, feel slower than skeleton screens in perception studies, centered spinners create blank space that feels empty</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Progressive Loading</td>
              <td className="px-4 py-2">Shows real content immediately as it becomes available, reduces time to first meaningful content, naturally handles variable loading times per section, no maintenance of placeholder components</td>
              <td className="px-4 py-2">Can cause significant layout shift if content dimensions are unknown, may feel disjointed as sections pop in at different times, requires streaming infrastructure, difficult to coordinate animations</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Blur-Up / Low-Quality Preview</td>
              <td className="px-4 py-2">Shows actual content at low resolution immediately, eliminates layout shift (dimensions known), feels faster because real visual information is present, excellent for image-heavy interfaces</td>
              <td className="px-4 py-2">Only works for visual content like images, requires generating low-resolution previews at build time or upload, adds complexity to the asset pipeline, blur effect can feel unpolished on some content types</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="px-4 py-2 font-medium">Blank Screen / No Loading State</td>
              <td className="px-4 py-2">Zero implementation effort, no maintenance burden, no risk of misleading skeleton shapes, content appears complete when it arrives</td>
              <td className="px-4 py-2">Worst perceived performance of all options, users may think the page is broken, causes maximum layout shift, can trigger premature abandonment, appears unprofessional</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Match skeleton dimensions to loaded content precisely.</strong> Measure actual content dimensions from production data or design specifications and ensure skeleton placeholders use the same width, height, and spacing. Mismatched dimensions cause Cumulative Layout Shift when content replaces skeletons, negating the primary benefit. For dynamic content like text of variable length, use reasonable estimates based on average content dimensions and constrain the loaded content to the same boundaries.
          </li>
          <li>
            <strong>Use a loading threshold to prevent skeleton flashing.</strong> Implement a delay of 200-500 milliseconds before showing skeleton screens. If data arrives within this window, render content directly without the skeleton intermediate state. This prevents the jarring experience of a skeleton appearing for a fraction of a second on fast connections. The threshold can be tuned based on analytics — measure the distribution of load times and set the threshold at the point where most fast loads complete.
          </li>
          <li>
            <strong>Build composable skeleton primitives in the design system.</strong> Instead of creating bespoke skeleton components for every loaded component, provide a small set of configurable primitives (text line, circle, rectangle, block) that can be composed to match any layout. This reduces the skeleton maintenance burden from N components to a handful of primitives and ensures visual consistency across all loading states.
          </li>
          <li>
            <strong>Respect the prefers-reduced-motion media query.</strong> Shimmer and pulse animations can be distracting or disorienting for users with vestibular disorders. When the user has enabled reduced motion, display static skeleton shapes without animation. The loading state is still communicated through the visual difference between skeleton gray and content colors — the motion simply adds a secondary signal that not all users want.
          </li>
          <li>
            <strong>Provide accessible loading announcements alongside skeletons.</strong> Skeleton screens are visual-only — screen reader users cannot perceive the gray shapes. Pair skeleton displays with ARIA live region announcements such as &ldquo;Loading content&rdquo; and &ldquo;Content loaded&rdquo; to provide equivalent loading state information to assistive technology users. Without these announcements, screen readers may read an apparently empty or nonsensical page during loading.
          </li>
          <li>
            <strong>Apply skeletons selectively, not universally.</strong> Not every loading state benefits from a skeleton screen. Skeletons work best for content with predictable, consistent layouts — feeds, cards, profiles, dashboards. For content with highly variable shapes (search results, dynamic forms, user-generated layouts), skeletons may be inaccurate and misleading. For very fast operations (under 200ms), skeletons add unnecessary complexity. Reserve skeletons for the loading states where they genuinely improve perception.
          </li>
          <li>
            <strong>Animate the skeleton-to-content transition smoothly.</strong> When data arrives, use a brief crossfade (150-250ms) to transition from skeleton to content rather than an instant swap. The instant replacement creates a visual pop that draws attention to the loading mechanism. A smooth fade makes the content appear to materialize naturally, further reducing perceived loading time.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Skeleton shapes that do not match loaded content.</strong> The most common skeleton screen failure is a mismatch between placeholder dimensions and actual content dimensions. A skeleton that shows three lines of text replacing with a single line, or a square image placeholder for a landscape image, causes jarring layout shifts that undermine the entire purpose of the skeleton. Regular audits should compare skeleton layouts against production content to catch drift.
          </li>
          <li>
            <strong>Showing skeletons on every load including cache hits.</strong> If data is available in cache or was preloaded, showing a skeleton creates unnecessary loading friction. The skeleton should only appear when there is a genuine wait — cache-first strategies should render cached content immediately and update in the background. Skeleton-on-cache is a common bug that makes cached navigation feel slower than fresh navigation.
          </li>
          <li>
            <strong>Skeleton screens that persist indefinitely on error.</strong> If a data fetch fails, the skeleton must transition to an error state rather than continuing to show loading placeholders forever. A perpetual skeleton gives the false impression that content is still loading when in fact it has failed. Always pair skeleton loading states with timeout logic and error handling that replaces the skeleton with an appropriate error message and recovery action.
          </li>
          <li>
            <strong>Overly detailed skeletons that reveal content structure prematurely.</strong> Skeletons should approximate content shape without being so detailed that they create false expectations about specific content. A skeleton that precisely mimics a product card layout may mislead users about which product is loading. The abstraction level should be enough to prevent layout shift while remaining generic enough to not create content-specific expectations.
          </li>
          <li>
            <strong>Neglecting skeleton performance overhead.</strong> Complex skeleton screens with multiple animated gradients across dozens of elements can themselves cause performance issues, particularly on low-end devices. The rendering cost of skeleton animations should be measured and optimized — using CSS animations instead of JavaScript, limiting the number of simultaneously animated elements, and using will-change or transform properties to promote skeletons to their own compositing layer.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          <strong>LinkedIn</strong> is one of the most recognized implementors of skeleton screens, applying them consistently across the feed, profile pages, messaging, and notifications. Their feed skeleton shows the exact layout of a post — avatar circle, name lines, content area, engagement bar — enabling the brain to start processing the page layout before content arrives. LinkedIn&apos;s skeletons use a subtle shimmer animation that sweeps left to right, and they implement a loading threshold that prevents skeleton flashing on fast connections. The consistency of skeletons across all LinkedIn surfaces creates a predictable loading experience that users learn to expect and process efficiently.
        </p>
        <p>
          <strong>YouTube</strong> uses content-aware skeletons that adapt to the video grid layout. Thumbnail placeholders use the 16:9 aspect ratio that matches actual video thumbnails, preventing layout shift when images load. The skeleton grid respects the responsive column count — showing more skeleton cards on wider screens — so the skeleton-to-content transition preserves the grid structure exactly. YouTube also uses skeleton screens during search, showing placeholder results immediately after the search is submitted to maintain the perception of speed even when search results take a moment to compute.
        </p>
        <p>
          <strong>Slack</strong> applies skeleton screens to message history loading, showing channel-shaped placeholders with message-shaped blocks of varying heights to simulate the natural variation of real messages. When switching channels, Slack checks the message cache first and shows cached messages immediately if available, only falling back to skeletons when cache is empty. This tiered approach means that frequently visited channels feel instant while rarely visited channels show brief skeletons — matching user expectations about loading behavior for familiar versus unfamiliar content.
        </p>
        <p>
          <strong>Airbnb</strong> demonstrates skeleton screens in a search-intensive context where listing cards have a predictable structure (image, title, price, rating, location). Their skeleton cards exactly match the listing card dimensions, and they implement progressive loading where the map view loads independently of the listing grid. As individual listings resolve from the API, they replace their corresponding skeleton cards one by one rather than waiting for all results, creating a satisfying cascade effect. Airbnb also uses blur-up image loading within skeleton cards — the skeleton shape appears first, followed by a blurred thumbnail, followed by the full-resolution image — providing three levels of progressive fidelity.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: When should you use skeleton screens versus spinners or other
            loading indicators?
          </p>
          <p className="mt-2">
            A: Skeleton screens are most effective when the content layout is predictable and consistent — feeds, product listings, profiles, dashboards — because the placeholder shapes accurately preview the incoming content structure. Use spinners when the content shape is unknown or highly variable (search results with mixed content types, dynamic form generation), when loading is expected to be very brief (under 300ms), or when the operation is indeterminate (file processing with unknown completion time). Progress bars are appropriate when you can estimate completion percentage (file uploads, multi-step processes). The key insight is that skeletons optimize perceived performance by giving the brain a head start on layout processing, so they only help when the skeleton accurately represents what will appear. An inaccurate skeleton is worse than a spinner because it creates false expectations that are then violated.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How do you prevent Cumulative Layout Shift when transitioning
            from skeletons to content?
          </p>
          <p className="mt-2">
            A: CLS prevention requires the skeleton to occupy exactly the same space as the loaded content. For images, use aspect-ratio containers or explicitly set width and height attributes that match the expected image dimensions — these can come from metadata stored alongside the image URL. For text, use skeleton lines that match the font size and line height of the loaded text, with container constraints that prevent text from exceeding the skeleton height. For dynamic content with variable dimensions, use min-height or fixed-height containers that accommodate the skeleton and constrain the loaded content to the same bounds. Additionally, ensure that skeleton margins, padding, and gap values exactly match the loaded component&apos;s styles. I recommend maintaining a visual regression test that compares skeleton and loaded states side-by-side to catch dimension drift when component styles change.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How would you implement skeleton screens in a server-rendered
            React application with Suspense?
          </p>
          <p className="mt-2">
            A: In a server-rendered React application with Suspense, skeleton screens become the fallback prop of Suspense boundaries. The server renders the page shell and static content immediately, wrapping data-dependent sections in Suspense boundaries with skeleton fallbacks. As each data fetch resolves on the server, the corresponding Suspense boundary streams its content to the client, replacing the skeleton in the HTML stream. On the client, React hydrates the streamed content and maintains the Suspense boundaries for any subsequent client-side navigation or data refetching. The key architectural decision is Suspense boundary placement — too coarse and the entire page shows one skeleton until all data resolves; too fine and you create dozens of independent loading states that pop in chaotically. I typically align Suspense boundaries with meaningful content sections — the hero area, the main content feed, the sidebar — so each section independently transitions from skeleton to content in a natural top-to-bottom or priority-based order.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4 mb-4">
          <p className="font-medium">
            Q: How do you make skeleton screens accessible to screen reader
            users?
          </p>
          <p className="mt-2">
            A: Skeleton screens are inherently visual, so screen reader users need equivalent loading state information through non-visual channels. First, the skeleton container should have <code>aria-busy=&quot;true&quot;</code> to indicate that its content is loading and may change. Second, use an <code>aria-live=&quot;polite&quot;</code> region to announce &ldquo;Loading content&rdquo; when skeletons appear and &ldquo;Content loaded&rdquo; when real content replaces them. Third, skeleton elements themselves should be hidden from the accessibility tree using <code>aria-hidden=&quot;true&quot;</code> since they carry no semantic meaning — a screen reader announcing &ldquo;gray rectangle, gray line, gray line, gray circle&rdquo; is worse than silence. Fourth, if skeleton animations use CSS that would be announced by some screen readers, ensure the animations do not affect the accessibility tree. Finally, when reduced motion is preferred, disable shimmer and pulse animations to respect user preferences while keeping the static skeleton shapes as visual placeholders.
          </p>
        </div>

        <div className="rounded-lg border border-theme bg-panel-soft p-4">
          <p className="font-medium">
            Q: How would you design a skeleton screen system that stays in sync
            with component changes as the application evolves?
          </p>
          <p className="mt-2">
            A: Keeping skeletons in sync with their loaded counterparts is one of the biggest maintenance challenges. I would address it through several strategies. First, build skeletons from shared primitives in the design system rather than bespoke per-component skeletons — when the design system&apos;s card component changes its padding, the skeleton primitive automatically reflects that change. Second, co-locate skeleton definitions with their loaded component definitions in the same file or directory so changes to one naturally prompt review of the other. Third, implement visual regression tests that compare the skeleton and loaded states of each component, failing when their dimensions diverge beyond a threshold. Fourth, for components with stable layouts, consider generating skeletons automatically from the component&apos;s style definitions — extracting dimensions, border-radius, and spacing to construct placeholder shapes programmatically. This auto-generation approach eliminates manual maintenance entirely for simple components, though complex components with conditional rendering paths may still need hand-crafted skeletons.
          </p>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://uxdesign.cc/what-you-should-know-about-skeleton-screens-a820c45a571a" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              UX Collective — What You Should Know About Skeleton Screens
            </a>
          </li>
          <li>
            <a href="https://web.dev/articles/cls" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              web.dev — Cumulative Layout Shift (CLS)
            </a>
          </li>
          <li>
            <a href="https://www.nngroup.com/articles/progress-indicators/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Progress Indicators Make a Slow System Less Insufferable
            </a>
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2020/04/skeleton-screens-react/" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine — Implementing Skeleton Screens in React
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/Suspense" className="text-accent underline" target="_blank" rel="noopener noreferrer">
              React Documentation — Suspense
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
