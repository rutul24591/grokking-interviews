"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-perceived-performance",
  title: "Perceived Performance",
  description: "Comprehensive guide to perceived performance optimization, covering psychological principles, UX patterns, and techniques to make applications feel faster.",
  category: "frontend",
  subcategory: "nfr",
  slug: "perceived-performance",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "performance", "ux", "perceived-performance", "skeleton-screens"],
  relatedTopics: ["page-load-performance", "loading-states", "optimistic-updates"],
};

export default function PerceivedPerformanceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Perceived Performance</strong> refers to how fast users <em>feel</em> an application is, which
          often differs significantly from actual measured performance. While objective metrics like Load Time,
          Time to Interactive (TTI), and First Contentful Paint (FCP) measure real performance, perceived
          performance is subjective and influenced by psychological factors, visual feedback, and user expectations.
        </p>
        <p>
          Research in human-computer interaction has consistently shown that users&apos; perception of speed can be
          manipulated through careful design. A classic study by Google found that adding a 400ms delay to search
          results caused users to search 20% less, even though the actual search quality was unchanged. Conversely,
          LinkedIn discovered that by optimizing perceived performance (not actual load time), they increased user
          engagement by 15%.
        </p>
        <p>
          The importance of perceived performance stems from how human cognition works. Users form impressions
          within milliseconds, and their patience is limited. The famous &quot;2-second rule&quot; suggests that
          users expect a response within 2 seconds, but this threshold can be extended through effective perceived
          performance techniques.
        </p>
        <p>
          For staff and principal engineers, understanding perceived performance is crucial because it bridges the
          gap between technical optimization and user experience. Sometimes, making an application <em>feel</em>
          faster is more impactful (and achievable) than making it actually faster.
        </p>
      </section>

      <section>
        <h2>The Psychology of Waiting</h2>
        <p>
          Understanding why users perceive wait times differently is key to optimizing perceived performance.
          Several psychological principles influence how users experience waiting:
        </p>
        <ul>
          <li>
            <strong>Occupied Time Feels Shorter:</strong> Users perceive time as passing more quickly when they&apos;re
            engaged. This is why loading spinners that animate or progress bars that move feel faster than static
            indicators.
          </li>
          <li>
            <strong>Uncertain Waits Feel Longer:</strong> Indeterminate waits (not knowing how long something will take)
            feel longer than determinate waits. Progress bars reduce anxiety by showing users how much remains.
          </li>
          <li>
            <strong>Unexplained Waits Feel Longer:</strong> Users tolerate delays better when they understand <em>why</em>
            something is taking time. Explaining what&apos;s happening (&quot;Processing your payment...&quot;) reduces
            frustration.
          </li>
          <li>
            <strong>Unfair Waits Feel Longer:</strong> Users get frustrated when they perceive a wait as unnecessary or
            unfair. For example, making users wait for validation that could happen in the background feels unfair.
          </li>
          <li>
            <strong>The Peak-End Rule:</strong> Users remember experiences based on their peak (most intense moment) and
            end, not the average. A smooth, fast completion can make a slow process feel acceptable.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/perceived-performance-psychology.svg"
          alt="Psychology of Waiting Diagram"
          caption="Psychological factors affecting perceived wait time — occupied vs unoccupied time, explained vs unexplained waits, and the peak-end rule"
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight for Interviews</h3>
          <p>
            In system design interviews, demonstrating awareness of perceived performance shows you think beyond
            raw metrics. When discussing performance optimization, mention both objective improvements (reducing
            bundle size, optimizing queries) <em>and</em> subjective improvements (skeleton screens, optimistic
            updates, progressive loading).
          </p>
        </div>
      </section>

      <section>
        <h2>Core Techniques for Improving Perceived Performance</h2>
        <p>
          The following techniques are proven to improve how fast users perceive your application to be, even
          when actual load times remain unchanged.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Skeleton Screens</h3>
        <p>
          Skeleton screens are placeholder layouts that mimic the structure of the content that will appear.
          Unlike loading spinners, they show users <em>what</em> is loading, reducing uncertainty and making
          waits feel shorter.
        </p>
        <p>
          <strong>Why they work:</strong> Skeleton screens create the illusion that content is loading progressively,
          even if the actual data fetch takes the same amount of time. They also prevent layout shift (CLS) by
          reserving space for content.
        </p>
        <p>
          <strong>Best practices:</strong>
        </p>
        <ul>
          <li>Match the skeleton structure to the actual content layout</li>
          <li>Use subtle animations (shimmer effect) to indicate loading</li>
          <li>Keep skeletons simple — avoid excessive detail</li>
          <li>Consider progressive skeletons that reveal sections as they load</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Optimistic UI Updates</h3>
        <p>
          Optimistic UI means updating the interface immediately in response to user actions, before receiving
          confirmation from the server. If the action fails, roll back the change and show an error.
        </p>
        <p>
          <strong>Why it works:</strong> Users perceive the application as instant because they see immediate
          feedback. The round-trip to the server happens in the background.
        </p>
        <p>
          <strong>When to use:</strong>
        </p>
        <ul>
          <li>Actions with high success rates (liking posts, adding to cart)</li>
          <li>Non-critical actions where rollback is acceptable</li>
          <li>Actions where the user expects immediate feedback</li>
        </ul>
        <p>
          <strong>When NOT to use:</strong>
        </p>
        <ul>
          <li>Critical actions (payments, deletions) without confirmation</li>
          <li>Actions with complex validation that might fail</li>
          <li>Actions where server-side business logic must run first</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Progressive Loading</h3>
        <p>
          Load and display content in stages, prioritizing what users need first. This creates the perception
          of faster loading even if total load time is unchanged.
        </p>
        <p>
          <strong>Techniques:</strong>
        </p>
        <ul>
          <li>
            <strong>Above-the-fold first:</strong> Load visible content before below-the-fold content
          </li>
          <li>
            <strong>Text before images:</strong> Display text content immediately, lazy-load images
          </li>
          <li>
            <strong>Progressive images:</strong> Show low-quality image placeholders that sharpen as they load
          </li>
          <li>
            <strong>Chunked loading:</strong> Load content in chunks (e.g., 20 items at a time) rather than all at once
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">4. Smart Loading Indicators</h3>
        <p>
          The type and behavior of loading indicators significantly affect perceived wait time.
        </p>
        <p>
          <strong>Spinner vs Progress Bar:</strong>
        </p>
        <ul>
          <li>
            <strong>Spinners:</strong> Best for indeterminate waits (unknown duration). Use animated spinners
            rather than static icons.
          </li>
          <li>
            <strong>Progress bars:</strong> Best for determinate waits (known duration or progress). Even fake
            progress bars that move smoothly feel faster than spinners.
          </li>
        </ul>
        <p>
          <strong>Progress bar techniques:</strong>
        </p>
        <ul>
          <li>Start fast, slow down near completion (matches user expectations)</li>
          <li>Never show 100% until actually complete</li>
          <li>Use smooth animations, not jerky jumps</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">5. Content Prioritization</h3>
        <p>
          Load the most important content first, deferring less critical elements.
        </p>
        <p>
          <strong>Priority hints:</strong>
        </p>
        <ul>
          <li>Use <code>fetchpriority=&quot;high&quot;</code> for critical resources</li>
          <li>Preload hero images and critical CSS</li>
          <li>Defer analytics, ads, and third-party scripts</li>
          <li>Lazy-load below-the-fold images and components</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/perceived-performance-techniques.svg"
          alt="Perceived Performance Techniques Comparison"
          caption="Comparison of perceived performance techniques — skeleton screens, optimistic UI, progressive loading, and smart indicators with their impact on user perception"
        />
      </section>

      <section>
        <h2>Advanced Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Instant Navigation with Prefetching</h3>
        <p>
          Prefetch likely navigation targets in the background so pages load instantly when users click.
        </p>
        <p>
          <strong>Implementation strategies:</strong>
        </p>
        <ul>
          <li>
            <strong>Hover prefetch:</strong> Prefetch when user hovers over a link (100-300ms before click)
          </li>
          <li>
            <strong>Viewport prefetch:</strong> Prefetch links visible in the viewport
          </li>
          <li>
            <strong>Predictive prefetch:</strong> Use ML to predict which links users will click
          </li>
          <li>
            <strong>Idle prefetch:</strong> Prefetch during idle time using <code>requestIdleCallback</code>
          </li>
        </ul>
        <p>
          <strong>Trade-offs:</strong> Prefetching uses bandwidth and may fetch pages users never visit.
          Implement conservative strategies (e.g., only prefetch on WiFi, limit concurrent prefetches).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Perceived Performance for Forms</h3>
        <p>
          Forms are critical conversion points where perceived performance matters immensely.
        </p>
        <p>
          <strong>Techniques:</strong>
        </p>
        <ul>
          <li>
            <strong>Inline validation:</strong> Validate fields as users type, not on submit
          </li>
          <li>
            <strong>Auto-advance:</strong> Move focus to next field automatically
          </li>
          <li>
            <strong>Smart defaults:</strong> Pre-fill fields when possible
          </li>
          <li>
            <strong>Progressive disclosure:</strong> Show only relevant fields, hide optional ones
          </li>
          <li>
            <strong>Background submission:</strong> Allow users to continue browsing while form submits
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Perceived Performance for Lists</h3>
        <p>
          Long lists and feeds require special handling to feel responsive.
        </p>
        <p>
          <strong>Techniques:</strong>
        </p>
        <ul>
          <li>
            <strong>Virtual scrolling:</strong> Render only visible items, recycle DOM nodes
          </li>
          <li>
            <strong>Infinite scroll with skeleton:</strong> Show skeletons while loading next page
          </li>
          <li>
            <strong>Optimistic additions:</strong> Show new items immediately at the top
          </li>
          <li>
            <strong>Sticky headers:</strong> Keep context visible while scrolling
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Handling Slow Operations</h3>
        <p>
          Some operations are inherently slow (file uploads, video processing). Make them feel faster.
        </p>
        <p>
          <strong>Techniques:</strong>
        </p>
        <ul>
          <li>
            <strong>Background processing:</strong> Let users continue working while operation completes
          </li>
          <li>
            <strong>Progressive feedback:</strong> Show detailed progress (&quot;Uploading: 45/100 files&quot;)
          </li>
          <li>
            <strong>Notifications:</strong> Notify when complete, don&apos;t block the UI
          </li>
          <li>
            <strong>Estimated time:</strong> Show realistic time remaining (better than nothing)
          </li>
        </ul>
      </section>

      <section>
        <h2>Measuring Perceived Performance</h2>
        <p>
          Unlike objective performance, perceived performance requires different measurement approaches.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Quantitative Metrics</h3>
        <ul className="space-y-2">
          <li>
            <strong>Time to First Paint (TTFP):</strong> When users first see <em>something</em> on screen
          </li>
          <li>
            <strong>Time to First Meaningful Paint (TFMP):</strong> When primary content appears
          </li>
          <li>
            <strong>Speed Index:</strong> How quickly content is visually populated (lower is better)
          </li>
          <li>
            <strong>Interaction to Next Paint (INP):</strong> How quickly UI responds to interactions
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Qualitative Methods</h3>
        <ul className="space-y-2">
          <li>
            <strong>User testing:</strong> Observe users and ask about their perception of speed
          </li>
          <li>
            <strong>Surveys:</strong> Ask users to rate perceived speed (1-5 scale)
          </li>
          <li>
            <strong>A/B testing:</strong> Test different loading patterns and measure engagement
          </li>
          <li>
            <strong>Session recordings:</strong> Watch how users interact with loading states
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/perceived-performance-metrics.svg"
          alt="Perceived Performance Metrics"
          caption="Key metrics for measuring perceived performance — Speed Index, Time to First Meaningful Paint, and user satisfaction correlation"
        />

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Perceived Performance Checklist</h3>
          <ul className="space-y-2 text-sm">
            <li>☐ Skeleton screens for all loading states</li>
            <li>☐ Optimistic UI for high-confidence actions</li>
            <li>☐ Progressive loading (above-fold first)</li>
            <li>☐ Smart loading indicators (progress bars for determinate waits)</li>
            <li>☐ Prefetching for likely navigation targets</li>
            <li>☐ Inline validation for forms</li>
            <li>☐ Background processing for slow operations</li>
            <li>☐ Clear feedback for all user actions</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Considerations</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Technique</th>
              <th className="p-3 text-left">Benefits</th>
              <th className="p-3 text-left">Trade-offs</th>
              <th className="p-3 text-left">When to Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Skeleton Screens</strong></td>
              <td className="p-3">Reduces perceived wait time, prevents layout shift</td>
              <td className="p-3">Requires extra markup, may not match all layouts</td>
              <td className="p-3">All content loading scenarios</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Optimistic UI</strong></td>
              <td className="p-3">Feels instant, improves engagement</td>
              <td className="p-3">Requires rollback logic, may confuse on failure</td>
              <td className="p-3">High-success actions (likes, adds, follows)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Prefetching</strong></td>
              <td className="p-3">Instant navigation, feels magical</td>
              <td className="p-3">Wastes bandwidth on unused pages</td>
              <td className="p-3">High-confidence navigation (next page, detail views)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Progressive Loading</strong></td>
              <td className="p-3">Content appears faster, better perceived speed</td>
              <td className="p-3">More complex loading logic</td>
              <td className="p-3">Content-heavy pages, feeds, dashboards</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Background Processing</strong></td>
              <td className="p-3">Users aren&apos;t blocked, can continue working</td>
              <td className="p-3">Requires notification system, state management</td>
              <td className="p-3">Long operations (uploads, exports, processing)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Real-World Case Studies</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <h3 className="mb-3 font-semibold">Facebook: Skeleton Screens</h3>
            <p>
              <strong>Challenge:</strong> Users perceived the app as slow during content loading, even though
              actual load times were competitive.
            </p>
            <p className="mt-2">
              <strong>Solution:</strong> Facebook replaced loading spinners with skeleton screens that matched
              the layout of posts, comments, and feed items. They added a subtle shimmer animation to indicate
              loading.
            </p>
            <p className="mt-2">
              <strong>Result:</strong> Users reported the app felt 20% faster, even though actual load times
              were unchanged. Engagement increased by 8%.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <h3 className="mb-3 font-semibold">Twitter: Optimistic UI for Tweets</h3>
            <p>
              <strong>Challenge:</strong> Posting a tweet felt slow because users had to wait for server
              confirmation before seeing their tweet appear.
            </p>
            <p className="mt-2">
              <strong>Solution:</strong> Twitter implemented optimistic UI — tweets appear instantly in the
              timeline with a &quot;sending&quot; indicator. If the post fails, the tweet shows a retry option.
            </p>
            <p className="mt-2">
              <strong>Result:</strong> Users perceived tweeting as instant. Tweet volume increased by 12%,
              and user satisfaction scores improved significantly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <h3 className="mb-3 font-semibold">Slack: Progressive Loading</h3>
            <p>
              <strong>Challenge:</strong> Large channels with thousands of messages took too long to load,
              causing user frustration.
            </p>
            <p className="mt-2">
              <strong>Solution:</strong> Slack implemented progressive loading — show recent messages first,
              lazy-load older messages as users scroll. They also added skeleton screens for message placeholders.
            </p>
            <p className="mt-2">
              <strong>Result:</strong> Time to first message dropped from 3s to 400ms. Users perceived the
              app as &quot;instant&quot; even though total load time for all messages was unchanged.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <h3 className="mb-3 font-semibold">Airbnb: Instant Search with Debouncing</h3>
            <p>
              <strong>Challenge:</strong> Search felt sluggish because every keystroke triggered an API call,
              causing lag and flickering results.
            </p>
            <p className="mt-2">
              <strong>Solution:</strong> Airbnb implemented debounced search (wait 300ms after typing stops)
              with optimistic UI — show previous results while loading new ones.
            </p>
            <p className="mt-2">
              <strong>Result:</strong> Search felt 3x faster. API calls reduced by 70%, improving server
              performance. Booking conversions increased by 6%.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between actual and perceived performance?</p>
            <p className="mt-2 text-sm">
              A: Actual performance is measured objectively (load time, TTI, FCP). Perceived performance is
              how fast users <em>feel</em> the application is. They often differ — you can make an app feel
              faster without making it actually faster through techniques like skeleton screens, optimistic UI,
              and progressive loading.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use optimistic UI vs waiting for server confirmation?</p>
            <p className="mt-2 text-sm">
              A: Use optimistic UI for high-success, low-risk actions (liking posts, adding to cart, following
              users). Wait for server confirmation for critical actions (payments, deletions, sensitive data
              changes). The key is: can you safely roll back if the server rejects the action?
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do skeleton screens improve perceived performance?</p>
            <p className="mt-2 text-sm">
              A: Skeleton screens show the structure of loading content, reducing uncertainty. They create the
              illusion of progressive loading and prevent layout shift. Studies show they reduce perceived wait
              time by 20-30% compared to spinners, even when actual load time is identical.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What techniques would you use to make a slow file upload feel faster?</p>
            <p className="mt-2 text-sm">
              A: Show a progress bar (not spinner) with percentage and time remaining. Let users continue
              browsing while upload happens in background. Send a notification when complete. For multiple files,
              show individual progress for each. Consider chunking large files and uploading in parallel.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you optimize the perceived performance of a search feature?</p>
            <p className="mt-2 text-sm">
              A: Debounce input (wait 300ms after typing stops). Show previous results while loading new ones.
              Use skeleton screens for result placeholders. Prefetch likely searches. Highlight search terms in
              results. For typeahead, show results inline without page navigation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics would you track for perceived performance?</p>
            <p className="mt-2 text-sm">
              A: Speed Index (how quickly content is visually populated), Time to First Meaningful Paint, and
              Interaction to Next Paint. Also track user-centric metrics: bounce rate on slow pages, engagement
              with loading states, and user satisfaction scores. A/B test different loading patterns to measure
              impact on conversion.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.nngroup.com/articles/response-times-3-important-limits/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Nielsen Norman Group — Response Times: The 3 Important Limits
            </a>
          </li>
          <li>
            <a href="https://web.dev/performance-user-experience/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Performance and User Experience
            </a>
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2015/06/designing-for-perceived-performance/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine — Designing for Perceived Performance
            </a>
          </li>
          <li>
            <a href="https://medium.com/@rmurpake/perceived-performance-101-1b4e1c0a8e0f" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Perceived Performance 101 — Rebecca Murphey
            </a>
          </li>
          <li>
            <a href="https://calendar.perfplanet.com/2018/optimizing-perceived-performance/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Performance Calendar — Optimizing Perceived Performance
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
