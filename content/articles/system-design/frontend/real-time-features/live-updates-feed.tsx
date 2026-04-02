"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "live-updates-feed",
  title: "Live Updates/Feed",
  description:
    "Comprehensive guide to live feed systems — covering real-time content injection, optimistic updates, feed reconciliation, pagination with live data, stale-while-revalidate patterns, and frontend rendering strategies for high-throughput live feeds.",
  category: "frontend",
  subcategory: "real-time-features",
  slug: "live-updates-feed",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-01",
  tags: [
    "live-feed",
    "real-time-updates",
    "optimistic-ui",
    "feed-reconciliation",
    "streaming",
    "pagination",
  ],
  relatedTopics: [
    "server-sent-events",
    "websockets",
    "real-time-notifications",
  ],
};

export default function LiveUpdatesFeedArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p className="mb-4">
          <strong>Live updates and feeds</strong> refer to UI patterns where
          content dynamically appears, updates, or reorders in response to
          real-time events without requiring the user to refresh the page or
          perform any action. The canonical examples are social media timelines
          that show new posts as they are created, dashboards that update
          metrics in real-time, sports scoreboards that reflect live game
          events, stock tickers that stream price changes, and collaborative
          document lists that show edits from other users. These live feeds
          transform static content pages into dynamic, event-driven experiences
          that keep users engaged and informed.
        </p>
        <p className="mb-4">
          The core engineering challenge of live feeds is reconciling two
          conflicting requirements: real-time freshness (showing new content
          immediately) and reading stability (not disrupting the user&apos;s
          current scroll position and reading flow). A naive implementation
          that prepends new items to the top of a feed while the user is
          reading mid-page causes jarring content shifts — the article they
          were reading suddenly jumps down. Production live feed systems solve
          this through buffered updates (accumulating new items behind a
          &quot;N new items&quot; banner that the user clicks to reveal),
          positional anchoring (maintaining the user&apos;s viewport position
          even as items are inserted above), and intelligent update strategies
          (different behavior when the user is at the top of the feed versus
          scrolled deep into older content).
        </p>
        <p className="mb-4">
          Live feeds also introduce complex state management challenges on the
          frontend. The feed must handle items arriving from multiple sources:
          the initial page load (server-rendered or API-fetched), real-time
          push events (via WebSocket or SSE), optimistic inserts from the
          user&apos;s own actions (a new post they just created), and
          pagination loads (older items loaded as the user scrolls down). These
          sources can conflict: a real-time event might deliver an item that
          the optimistic insert already added, creating duplicates. A
          pagination response might include items that real-time events already
          delivered. The feed reconciliation layer must merge these sources
          using item IDs as the deduplication key, maintaining correct sort
          order and preventing visual duplicates.
        </p>
        <p>
          For staff and principal engineers, designing a live feed system
          requires thinking about both the real-time data pipeline (how events
          flow from creation to client delivery) and the frontend rendering
          strategy (how the UI efficiently processes potentially hundreds of
          updates per second without degrading scroll performance or consuming
          excessive memory). The intersection of these concerns — real-time
          data at UI scale — is one of the most demanding frontend engineering
          problems, and the solutions reveal deep understanding of both
          distributed systems and browser rendering performance.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-concepts/frontend/real-time-features/live-updates-feed-diagram-1.svg"
        alt="Live feed update strategies showing immediate insert, buffered banner, and scroll-position-aware update approaches"
        caption="Figure 1: Live feed update strategies based on user scroll position"
      />

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Update Injection Strategies
        </h3>
        <p className="mb-4">
          Three primary strategies govern how new content enters a live feed.{" "}
          <strong>Immediate insertion</strong> adds items to the feed as soon
          as they arrive, which provides maximum freshness but disrupts the
          reading experience with content shifts.{" "}
          <strong>Buffered insertion</strong> accumulates new items and shows
          a banner (&quot;5 new posts — click to show&quot;) that the user
          activates when ready, preserving reading stability at the cost of
          freshness. <strong>Scroll-position-aware insertion</strong> adapts
          behavior based on the user&apos;s viewport: if the user is at or
          near the top of the feed, new items are immediately prepended with
          a smooth animation; if the user has scrolled down, items are
          buffered behind a banner. This adaptive approach is the standard in
          production social feeds (Twitter/X, LinkedIn, Facebook) because it
          provides real-time freshness when the user is &quot;waiting for
          updates&quot; at the top, without disrupting their reading experience
          when they are engaged with older content.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Optimistic Updates and Reconciliation
        </h3>
        <p className="mb-4">
          When a user creates a new post, the UI should show it immediately
          in the feed rather than waiting for the server round-trip. This{" "}
          <strong>optimistic update</strong> uses client-generated temporary
          data that is displayed with a pending indicator. When the server
          confirms the post (returning the canonical version with a permanent
          ID), the client replaces the optimistic entry with the server
          version. If the server rejects the post (validation failure, rate
          limit), the optimistic entry is removed and the user sees an error.
          The tricky part is <strong>reconciliation</strong>: the real-time
          push channel may also deliver the new post (the server broadcasts
          it to the user&apos;s own feed), creating a potential duplicate. The
          reconciliation layer matches optimistic entries to incoming real-time
          events using a correlation ID (a client-generated ID sent with the
          creation request and included in the real-time event) and merges them
          seamlessly.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Feed Pagination with Live Data
        </h3>
        <p className="mb-4">
          Combining pagination with live updates creates a unique challenge:
          the dataset is constantly changing while the user pages through it.
          Cursor-based pagination (using the ID or timestamp of the last
          loaded item) is essential — offset-based pagination breaks when
          items are inserted or deleted between page loads. The cursor
          anchors the pagination position regardless of what changes above it.
          However, real-time inserts above the cursor create a gap between
          the latest real-time item and the oldest paginated item. When the
          user scrolls up past the real-time items, they may encounter this
          gap. Production systems handle this by either pre-filling the gap
          (loading items between the real-time buffer and the paginated window)
          or by refreshing the feed when the gap becomes too large.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Virtualized Rendering for Long Feeds
        </h3>
        <p className="mb-4">
          A live feed that accumulates hundreds of items over a session must
          not keep all of them in the DOM. <strong>Virtualized
          rendering</strong> (using libraries like <code>react-window</code>,{" "}
          <code>react-virtuoso</code>, or the newer <code>TanStack
          Virtual</code>) renders only the items currently visible in the
          viewport plus a small overscan buffer. As the user scrolls, items
          enter and exit the DOM dynamically. For live feeds, virtualization
          introduces additional complexity: items added at the top of the
          list must update the virtual list&apos;s item count and offset
          calculations without causing the visible items to jump. The virtual
          list must also handle variable-height items (posts with images are
          taller than text-only posts), which requires either measured heights
          (rendering items briefly to measure them) or estimated heights with
          correction.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Stale-While-Revalidate for Feed Data
        </h3>
        <p className="mb-4">
          The stale-while-revalidate pattern complements live updates for feed
          systems. When the user returns to a feed (navigating back or
          reopening the app), the client immediately displays the cached feed
          state (stale) while simultaneously requesting fresh data from the
          server (revalidate). As fresh items arrive, they are merged with
          the cached state — new items are prepended, updated items are
          replaced, and deleted items are removed. This pattern provides
          instant perceived load time (the feed is visible immediately) while
          ensuring data freshness within seconds. Combined with real-time push
          updates, the feed stays current through a combination of push (for
          events while the user is active) and pull (for catching up after
          periods of inactivity).
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>
        <p className="mb-4">
          A production live feed architecture combines traditional API-driven
          feed loading with real-time event streaming, managing the two data
          sources through a client-side reconciliation layer that ensures
          consistency, deduplication, and correct ordering.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/live-updates-feed-diagram-2.svg"
          alt="Live feed architecture showing API feed loading, WebSocket event stream, client-side reconciliation, and virtualized rendering pipeline"
          caption="Figure 2: Live feed client architecture with dual data sources and reconciliation"
        />

        <p className="mb-4">
          The architecture has two data inflow paths: the <strong>pull
          path</strong> (initial feed load and pagination via REST API) and the{" "}
          <strong>push path</strong> (real-time events via WebSocket or SSE).
          Both paths feed into a client-side feed store that maintains the
          canonical list of feed items. The reconciliation layer in the store
          deduplicates items by ID, resolves version conflicts (a real-time
          update for an item already in the feed), and maintains sort order.
          The rendering layer reads from the store and applies the update
          strategy (immediate insert, buffered banner, or positional anchoring)
          based on the user&apos;s current scroll position. Virtualized
          rendering ensures that only visible items are in the DOM regardless
          of how many items the store holds. Memory management periodically
          trims the oldest items from the store when it exceeds a threshold
          (e.g., keeping only the latest 500 items in memory), relying on
          pagination to reload them if the user scrolls back.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparisons
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>
        <p className="mb-4">
          Different live feed approaches balance freshness, stability, and
          implementation complexity. The following comparison evaluates the
          primary strategies.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-theme text-sm">
            <thead>
              <tr className="bg-panel">
                <th className="border border-theme px-4 py-2 text-left">
                  Strategy
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  Freshness
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  UX Stability
                </th>
                <th className="border border-theme px-4 py-2 text-left">
                  Complexity
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Poll and refresh
                </td>
                <td className="border border-theme px-4 py-2">
                  Low (polling interval lag)
                </td>
                <td className="border border-theme px-4 py-2">
                  Good (full page refresh is predictable)
                </td>
                <td className="border border-theme px-4 py-2">
                  Low
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Immediate real-time insert
                </td>
                <td className="border border-theme px-4 py-2">
                  Maximum (sub-second)
                </td>
                <td className="border border-theme px-4 py-2">
                  Poor (content shifts while reading)
                </td>
                <td className="border border-theme px-4 py-2">
                  Medium
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Buffered banner
                </td>
                <td className="border border-theme px-4 py-2">
                  Good (user-controlled reveal)
                </td>
                <td className="border border-theme px-4 py-2">
                  Excellent (no automatic shifts)
                </td>
                <td className="border border-theme px-4 py-2">
                  Medium
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Scroll-position-aware
                </td>
                <td className="border border-theme px-4 py-2">
                  Maximum when at top, buffered when scrolled
                </td>
                <td className="border border-theme px-4 py-2">
                  Excellent (adapts to context)
                </td>
                <td className="border border-theme px-4 py-2">
                  High
                </td>
              </tr>
              <tr>
                <td className="border border-theme px-4 py-2 font-medium">
                  Background sync + toast
                </td>
                <td className="border border-theme px-4 py-2">
                  Good (toast alerts, pull to reveal)
                </td>
                <td className="border border-theme px-4 py-2">
                  Excellent (feed only updates on user action)
                </td>
                <td className="border border-theme px-4 py-2">
                  Medium
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Use scroll-position-aware update strategy as the default: auto-insert
            new items when the user is within 100px of the feed top, buffer
            behind a banner when scrolled deeper. This provides the best
            balance of freshness and stability
          </li>
          <li>
            Implement cursor-based pagination exclusively — never use
            offset-based pagination for live feeds. The cursor (item ID or
            timestamp) anchors the pagination position regardless of
            insertions above
          </li>
          <li>
            Deduplicate using item IDs at the store level — every item
            entering the feed (from API, real-time push, or optimistic insert)
            is checked against existing IDs before insertion. This prevents
            visual duplicates from any source
          </li>
          <li>
            Use virtualized rendering for feeds that accumulate more than
            50-100 items in a session. Without virtualization, DOM node
            accumulation degrades scroll performance and increases memory usage
          </li>
          <li>
            Implement memory management with a rolling window: keep only the
            latest N items (e.g., 500) in the client store. When the user
            scrolls past the boundary, use pagination to load evicted items.
            This prevents unbounded memory growth in long sessions
          </li>
          <li>
            Add a &quot;jump to present&quot; button when the user has scrolled
            far from the top and new items are available. This provides a fast
            way to return to the latest content without slow scrolling through
            accumulated items
          </li>
          <li>
            Implement optimistic updates with correlation IDs: generate a
            client-side ID for new posts, include it in the API request, and
            match it against the real-time event to prevent duplicate insertion
          </li>
          <li>
            Batch DOM updates when processing bursts of real-time events — if
            10 items arrive in 200ms, insert them in a single batch rather than
            10 individual updates. Use <code>requestAnimationFrame</code> or
            microtask batching to coalesce renders
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Content layout shift (CLS) from live inserts</strong> —
            prepending items to a feed while the user is scrolled down
            pushes all content downward, creating a jarring jump. This is
            the most common UX complaint in live feeds and directly impacts
            Core Web Vitals
          </li>
          <li>
            <strong>Unbounded memory growth</strong> — accumulating all
            real-time items in the client store without eviction leads to
            increasing memory consumption and degrading performance over
            long sessions
          </li>
          <li>
            <strong>Duplicate items from multiple sources</strong> — the
            same item appearing twice because it arrived from both the
            initial API response and the real-time push channel. Always
            deduplicate by item ID at the store level
          </li>
          <li>
            <strong>Pagination gap</strong> — a gap between the latest
            real-time items (at the top) and the oldest paginated items
            (loaded on scroll). When the user scrolls through this gap, they
            see a sudden jump in content age. Detect and fill the gap
            proactively
          </li>
          <li>
            <strong>Rendering every update individually</strong> —
            processing each real-time event as a separate React state update
            during high-throughput scenarios causes excessive re-renders.
            Batch events and update the store once per animation frame
          </li>
          <li>
            <strong>Ignoring sort stability</strong> — real-time items may
            arrive out of order (due to network timing or server processing
            delays). Always sort by the canonical timestamp/sequence from
            the server, not by arrival order
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Twitter/X: The Canonical Live Feed
        </h3>
        <p className="mb-4">
          Twitter&apos;s timeline is the archetypal live feed implementation.
          Their scroll-position-aware strategy shows a &quot;N new posts&quot;
          pill at the top of the timeline when the user is scrolled down,
          which loads the new items when tapped. When the user is at the top,
          new items animate in smoothly. Twitter&apos;s architecture uses a
          fan-out-on-write model for the home timeline: when a user tweets,
          the tweet ID is written to the timelines of all their followers in
          a Redis-based timeline cache. The client loads from this
          precomputed cache and subscribes to a real-time stream for
          updates. For users who follow high-volume accounts (celebrities,
          news outlets), Twitter uses a fan-out-on-read hybrid that defers
          timeline computation to reduce write amplification. The client-side
          reconciliation is particularly sophisticated, handling tweet
          edits, deletions, and retweet/unretweet events that modify or
          remove existing feed items.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Bloomberg Terminal: High-Frequency Financial Feeds
        </h3>
        <p className="mb-4">
          Bloomberg Terminal&apos;s web interface handles some of the most
          demanding live feed requirements: streaming thousands of price
          updates per second across multiple instruments simultaneously. Their
          architecture uses binary WebSocket messages (not JSON) for bandwidth
          efficiency, with client-side delta decoding that applies incremental
          updates to a local price state rather than replacing full records.
          The rendering layer uses a combination of virtualization and
          throttled updates — prices visually update at most once per frame
          (60Hz), with the latest value always displayed even if multiple
          updates arrived within a single frame interval. Cell-level rendering
          optimization ensures that a price change in one instrument does not
          re-render the entire table. This fine-grained update strategy is
          essential when displaying hundreds of streaming values simultaneously.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Datadog: Real-Time Metrics Dashboard
        </h3>
        <p className="mb-4">
          Datadog&apos;s dashboards display live metrics from infrastructure
          monitoring, streaming data points at configurable intervals (1
          second to 5 minutes). Their frontend architecture uses a
          time-series-aware feed model where data points are appended to the
          right edge of charts rather than prepended to a list. The rendering
          challenge is different from social feeds: charts must efficiently
          update as new points arrive, shifting the time window while
          maintaining smooth animation. Datadog uses canvas-based rendering
          (not DOM) for charts, with WebGL acceleration for high-density
          visualizations. Their data layer manages multiple independent
          streams per dashboard widget, with client-side aggregation
          (downsampling high-resolution data for overview charts) and
          WebSocket-based streaming for real-time updates.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/real-time-features/live-updates-feed-diagram-3.svg"
          alt="Feed reconciliation flow showing deduplication of items from API, real-time push, and optimistic inserts using item IDs"
          caption="Figure 3: Client-side feed reconciliation from multiple data sources"
        />
      </section>

      {/* ============================================================
          SECTION 8: Common Interview Questions
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prevent content layout shift when injecting new
              items into a live feed?
            </p>
            <p className="mt-2 text-sm">
              Use scroll-position-aware insertion: detect whether the user is
              at the top of the feed (within a threshold like 100px from top).
              If at top, prepend items with smooth animation. If scrolled down,
              buffer items behind a &quot;N new items&quot; banner and maintain
              scroll position using <code>scrollTop</code> adjustment or the
              browser&apos;s built-in{" "}
              <code>overflow-anchor: auto</code> CSS property. Additionally,
              reserve layout space for incoming items using estimated heights
              to prevent shifts during the insert animation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle optimistic updates in a live feed where
              real-time events may also deliver the same item?
            </p>
            <p className="mt-2 text-sm">
              Generate a client-side correlation ID (UUID) when creating a new
              item. Include it in the API request and store the optimistic entry
              with this ID. When the server broadcasts the created item via
              real-time push, include the correlation ID. The client&apos;s
              reconciliation layer matches the real-time event to the optimistic
              entry and replaces it seamlessly (updating with the server-assigned
              permanent ID and any server-computed fields). If no correlation
              ID match exists, it is a new item from another user and is
              inserted normally.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prevent memory leaks in a long-running live feed
              session?
            </p>
            <p className="mt-2 text-sm">
              Implement a rolling window with a maximum item count (e.g., 500
              items). When new items push the count above the threshold, evict
              the oldest items from the store. Use virtualized rendering so
              evicted items do not leave orphaned DOM nodes. Track whether the
              user has scrolled near the eviction boundary and load evicted items
              on demand via pagination if they scroll back. Monitor total memory
              with <code>performance.memory</code> (Chrome) and trigger
              aggressive cleanup if thresholds are exceeded.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What pagination strategy works best for a real-time feed?
            </p>
            <p className="mt-2 text-sm">
              Cursor-based pagination using the item ID or timestamp of the
              last loaded item. Unlike offset-based pagination, cursors are
              stable when items are inserted or deleted above the current
              position. The cursor request asks for &quot;N items after cursor
              X,&quot; which returns the same items regardless of what happened
              at the top of the feed. For reverse pagination (loading newer
              items when scrolling up), use a &quot;before cursor&quot; query.
              Handle the gap between real-time items and paginated items by
              detecting when the newest paginated item is not adjacent to the
              oldest real-time item and filling the gap.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle a burst of real-time events without
              degrading rendering performance?
            </p>
            <p className="mt-2 text-sm">
              Batch events using a microtask or{" "}
              <code>requestAnimationFrame</code> coalescing strategy: collect
              all events that arrive within a single frame (16ms) and apply
              them as a single store update. This produces one re-render per
              frame regardless of event volume. For extremely high throughput
              (thousands of events per second), implement further throttling:
              only process the most recent event per item (for updates to the
              same entity) and drop intermediate states. Use{" "}
              <code>React.memo</code> or equivalent to prevent unchanged items
              from re-rendering when the list updates.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References & Further Reading
          ============================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          References &amp; Further Reading
        </h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://blog.twitter.com/engineering/en_us/a/2017/building-timeline-at-twitter"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Building Timeline at Twitter&quot; — Twitter Engineering
              Blog (fan-out-on-write architecture)
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/engineering/articles/news-feed-architecture-at-facebook/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;News Feed Architecture at Facebook&quot; — Facebook
              Engineering Blog
            </a>
          </li>
          <li>
            <a
              href="https://tanstack.com/virtual"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TanStack Virtual documentation — high-performance virtualized list
              rendering
            </a>
          </li>
          <li>
            <a
              href="https://react-virtuoso.now.sh/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              react-virtuoso documentation — virtualized list with real-time
              prepend support
            </a>
          </li>
          <li>
            <a
              href="https://www.apollographql.com/docs/react/data/optimistic-ui/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Optimistic UI Patterns&quot; — Apollo GraphQL documentation
            </a>
          </li>
          <li>
            <a
              href="https://swr.vercel.app/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SWR and TanStack Query documentation — stale-while-revalidate
              patterns for feed data
            </a>
          </li>
          <li>
            <a
              href="https://dataintensive.net/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Designing Data-Intensive Applications&quot; by Martin
              Kleppmann — Chapter on event streaming and derived data
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
