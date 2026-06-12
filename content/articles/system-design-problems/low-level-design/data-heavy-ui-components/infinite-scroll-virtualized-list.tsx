"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-infinite-scroll-virtualized-list",
  title: "Design an Infinite Scroll / Virtualized List",
  description:
    "LLD for an infinite-scrolling, virtualized list: fixed and dynamic row heights, IntersectionObserver triggers, accessibility, scroll restoration, and the trade-offs vs pagination in React/Next.js.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "infinite-scroll-virtualized-list",
  wordCount: 7100,
  readingTime: 38,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "infinite-scroll",
    "virtualization",
    "intersection-observer",
    "react",
    "scroll-restoration",
  ],
  relatedTopics: [
    "data-table",
    "virtualized-grid-2d",
    "cursor-based-pagination-ui",
    "real-time-data-dashboard",
  ],
};

export default function InfiniteScrollVirtualizedListArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design an Infinite-scroll Virtualized List</h1><h2>Definition &amp; Context</h2><p>Design an Infinite-scroll Virtualized List is an implementation-heavy low-level design problem covering cursor pagination, intersection triggering, viewport windowing, variable-size measurement, overscan, scroll anchoring, cache eviction, and restoration. A principal-level answer must define state ownership, consistency, lifecycle cleanup, scale limits, rollback, privacy, cost, and observability.</p><p>Keep the loaded page ledger separate from the rendered DOM window. Stable item ids and measured sizes preserve scroll position while pages enter or leave memory. The core structures are cursor ledger, item map, ordered ids, request generation, sentinel state, viewport range, overscan policy, size cache, anchor record, and eviction budget.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/infinite-scroll-virtualized-list-runtime.svg" alt="Design an Infinite-scroll Virtualized List runtime" caption="Topic-specific data flow from input or payload through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing an infinite-scrolling, virtualized
          list — the kind that powers feeds (social, news,
          activity), search results, message threads,
          notification inboxes, and any UI where the user
          browses a long sequence of items without an
          explicit pagination step. The list virtualizes its
          DOM (mounts only the items in the viewport plus a
          small buffer) and fetches more data as the user
          approaches the end (and, for chat-style flows, the
          beginning). Done well, this is the most important
          performance pattern in any consumer-facing
          information-dense product; done poorly, it&rsquo;s a
          jank machine that drops frames, loses scroll
          position on navigation, and breaks accessibility
          for keyboard and screen-reader users.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are deeply interrelated. Variable
          row heights make scroll math non-trivial because
          row offsets aren&rsquo;t derivable from index alone.
          Detecting &ldquo;near the end&rdquo; requires
          careful trigger placement so we fetch early enough
          to avoid blank space without fetching wastefully.
          Scroll restoration after navigation away and back
          must restore not only scroll position but also the
          loaded data window. Two-way infinite scroll (older
          messages on top, newer on bottom in a chat) needs to
          maintain perceived position when content prepends.
          Real-time updates (new items arriving via
          WebSocket) need smooth animation without disrupting
          the user&rsquo;s scroll. Accessibility — making an
          infinite list navigable by keyboard and announceable
          by screen readers — is genuinely hard because the
          ARIA patterns assume bounded content.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users browse feeds, results, and threads on
          mobile and desktop. They expect butter-smooth scroll
          (60 fps minimum, ideally 120 fps on capable
          devices), instant loading of new items as they
          approach the end, and perfectly preserved context
          when they navigate away and back. Internal teams
          consume the list through a hook-based API:
          declare a data source (with cursor-based pagination
          most often) and a row renderer; the list runtime
          handles virtualization, fetching, and scroll
          mechanics. Power users (in apps like Twitter or a
          customer support inbox) keep the list open for
          hours; performance debt accumulates fast on
          long-running scroll sessions.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Data sources are typically cursor-paginated:
          <code> fetchPage(cursor)</code> returns
          <code> { `{ items, nextCursor }` }</code>. Item
          counts can be effectively unbounded (millions in a
          feed, tens of thousands in an inbox). Row heights
          are typically variable (cards with different
          content lengths, messages with different attachment
          types). Modern browsers; we use
          <code> IntersectionObserver</code> for triggers,
          <code> ResizeObserver</code> for height
          measurement, and <code>requestAnimationFrame</code>
          for scroll-driven updates. The host has a router
          that supports back/forward navigation; we integrate
          with its scroll restoration model.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement traditional pagination (Next /
          Previous buttons) — that&rsquo;s the Cursor-based
          Pagination UI subsystem. We do not implement table
          semantics (headers, columns, sortable structure) —
          that&rsquo;s the Data Table. We do not implement
          2D virtualization (grids with viewport-bounded
          rows and columns) — that&rsquo;s the Virtualized
          Grid. We do not implement search-result-specific
          features (highlight, snippet ranking) — those layer
          on top via custom row renderers.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Virtualize rows so DOM size stays O(visible) even
          for million-item lists. Support fixed-height and
          variable-height items via different
          virtualization strategies. Trigger the next page
          fetch when the user approaches the end of loaded
          data, with a configurable threshold. Render
          loading state for the next page (skeleton items,
          spinner, or text indicator depending on context).
          Render an end-of-list state when the cursor returns
          null. Restore scroll position on navigation back.
          Support keyboard navigation (Page Up/Down, Home/End,
          arrow keys for grid-like lists). Announce state
          changes (new items loaded, end reached) via polite
          live region. Two-way infinite scroll (prepend on top,
          append on bottom) for chat-style flows.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Real-time updates via WebSocket: new items appear
          smoothly without disrupting scroll. Pinned items at
          top or bottom (sticky banners, system messages).
          Item-level lazy-loading of expensive content
          (images, embedded media). Pull-to-refresh on mobile.
          Skeleton items that match the layout of real items
          for cumulative-layout-shift-free loading.
          Configurable overscan for tuning perceived
          smoothness vs memory usage. Item-level
          prefetching of expensive resources just before
          they enter the viewport.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Filter/sort UIs, table-like column structure,
          drag-to-reorder, and bulk selection don&rsquo;t fit
          the infinite-scroll mental model and live
          elsewhere. Custom transitions for item enter/exit
          animations are an opt-in plugin, not core.
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Scroll at 60 fps on mid-tier devices, no dropped
          frames. Initial render of the visible viewport
          under 100 ms. Page-fetch triggers complete in time
          to avoid the user seeing blank space — concretely,
          the fetch should start when the user is ~500 px
          from the end on desktop, ~200 px on mobile (room
          for one more screen of content). Memory usage
          stays bounded even after hours of scrolling: we
          unload deeply off-screen items, with an LRU eviction
          policy that holds enough recent windows for fast
          backtrack but releases far-away pages.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Race-protect concurrent page fetches with tokens;
          the latest token wins. Survive network failures
          gracefully — surface an inline retry, never lose
          the loaded items. Scroll restoration accuracy
          across navigation: the user lands within a few
          pixels of where they left off, even if items have
          changed (we restore by item id, not by raw scroll
          offset).
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Item rendering is text by default; HTML opt-in via
          a sanitizer per item type. Real-time updates are
          authenticated; we don&rsquo;t inject server-pushed
          items into a stranger&rsquo;s list.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          The list uses <code>role=&quot;feed&quot;</code> for
          chronological feeds (twitter-style), or
          <code> role=&quot;list&quot;</code> for unordered
          collections. Each item is a focusable region with
          its own accessible name. Loading and end-of-list
          states announce via polite live region. Keyboard
          navigation (Page Up/Down) works without trapping;
          arrow keys move between items when configured.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          The runtime is a small core (virtualizer + fetch
          orchestrator + scroll restoration) with hooks for
          consumers to plug their data source and row
          renderer. Adding new behaviors (real-time, pinned,
          pull-to-refresh) is a one-file plugin per
          behavior.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The list is built around four cooperating
          mechanisms: a <strong>data source with cursor
          pagination</strong> behind an item cache, a
          <strong> virtualizer</strong> that maps scroll
          position to visible window, an
          <strong> IntersectionObserver-driven trigger</strong>{" "}
          that initiates page fetches, and an
          <strong> item-id-anchored scroll restoration</strong>{" "}
          system. Each is well-understood individually; their
          interaction is what makes the list feel solid
          rather than haphazard.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The <strong>data source</strong> exposes
          <code> fetchPage(cursor)</code> →{" "}
          <code>{` { items, nextCursor } `}</code>. The item
          cache stores fetched items by id and maintains an
          ordered list of (cursor → item id range) mappings.
          When the virtualizer asks for items in a window,
          the cache returns whatever it has and signals
          gaps. When the trigger detects a near-end-of-data
          situation, it issues a fetch with the latest
          cursor; on response, the cache appends new items
          and notifies subscribers. The cache supports LRU
          eviction for very long scroll sessions: pages that
          are far above the current viewport (e.g. more
          than 50 viewports up) get evicted, keeping memory
          bounded. Eviction is conservative because we want
          fast backtracking; aggressive eviction would
          cause re-fetches on minor scroll-up.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>virtualizer</strong> handles the
          translation from scroll position to visible window.
          For fixed-height items, the math is trivial:
          visible start = floor(scrollTop / itemHeight);
          visible count = ceil(viewportHeight / itemHeight);
          end = start + count + overscan. For variable-height
          items, we maintain a measured-height cache keyed
          by item id, an estimated default height for
          unmeasured items, and a cumulative-height index
          that lets us binary-search for the item at a given
          scroll offset. The cumulative index is updated
          whenever a measured height changes; we use
          <code> ResizeObserver</code> on each mounted item
          to keep measurements current as content reflows
          (images load, accordion expands, etc.). The
          overscan (typically 5–10 items above and below the
          viewport) prevents blank flashes during fast
          scrolling.
        </HighlightBlock>
        <p>
          The <strong>trigger</strong> uses an
          IntersectionObserver on a sentinel element placed
          near the end of the loaded data (typically 5
          items before the actual end, or as a marker
          rendered just below the last item with a top
          margin equal to the trigger threshold). When the
          sentinel intersects the viewport, the observer
          fires, and the trigger requests the next page from
          the data source. We use IntersectionObserver
          rather than scroll-position math because it&rsquo;s
          off the main thread, doesn&rsquo;t fire excessively
          during fast scrolling, and respects the browser&rsquo;s
          rendering pipeline. Triggers are debounced to
          prevent multiple parallel fetches if the user
          scrolls past the threshold quickly.
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Scroll restoration</strong> is the trickiest
          piece because raw scroll offsets are unreliable —
          items may have changed since the user navigated
          away (especially with real-time updates), and
          measured heights may be different. We anchor
          restoration to an item id: when the user navigates
          away, we record the id of the topmost visible
          item plus its offset within the viewport. When
          they navigate back, we restore by scrolling to
          that item id; if the item is still in the cache,
          this is instant; if it has been evicted, we
          re-fetch the page containing it before scrolling.
          For items that no longer exist (e.g. deleted), we
          fall back to the next-newest item we recorded.
          This robustness against item changes is what makes
          scroll restoration feel reliable rather than
          flaky.
        </HighlightBlock>
        <p>
          On <strong>mount</strong>, the runtime checks for a
          stored scroll state from the host&rsquo;s
          router-provided state. If present, it kicks off a
          fetch sequence to populate the cache up to the
          stored item id (or returns to a known prior cache
          if still valid), then scrolls to the anchor. On
          first-time mount, it fetches the first page and
          scrolls to the top.
        </p>
        <p>
          On <strong>scroll</strong>, the virtualizer recalculates
          the visible window in
          <code> requestAnimationFrame</code>. The render
          tree mounts items in the visible window plus
          overscan; items outside that range unmount. The
          IntersectionObserver fires when the trigger
          sentinel intersects, and the data source is asked
          for the next page. For two-way infinite (chat-
          style), a second sentinel near the top fires for
          older-messages fetch.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>page response</strong>, the new items are
          appended (or prepended for two-way) to the cache.
          Subscribers are notified; the virtualizer
          recalculates if needed. For prepended items in a
          chat-style list, we adjust scroll position to
          maintain perceived stability — without this
          adjustment, prepending items would push the user&rsquo;s
          current view down and break their reading flow.
          The adjustment is a single
          <code> scrollTop = scrollTop + prependedHeight</code>{" "}
          inside the same frame as the DOM mutation, so
          users see no jump.
        </HighlightBlock>
        <p>
          On <strong>real-time update</strong>, new items
          arriving via WebSocket are added to the cache
          (typically prepended for chronological feeds).
          The UI surfaces a banner &ldquo;5 new items&rdquo;
          rather than auto-scrolling, because auto-scrolling
          interrupts the user. Clicking the banner scrolls
          smoothly to the new items. For chat-style flows
          where the user is at the bottom (most recent), we
          can auto-scroll because that matches user
          expectation; if they&rsquo;ve scrolled up, we
          surface the banner instead.
        </p>
        <p>
          On <strong>navigation away</strong>, the runtime
          stores the topmost visible item id and its
          viewport offset to the router&rsquo;s state. On
          return, it restores via the anchor mechanism
          described above. This integration with the router
          is what makes scroll restoration feel reliable
          across the full app navigation graph.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="important">
          <strong>ListProvider</strong> instantiates the
          virtualizer, the data source orchestrator, the
          item cache, and the trigger observer. It exposes
          them through stable refs in a React Context.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Virtualizer</strong> handles the
          scroll-to-window translation. It supports both
          fixed-height and variable-height modes; consumers
          declare which via a prop. For variable-height, it
          uses <code>ResizeObserver</code> on each mounted
          item and maintains the cumulative-height index.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>ItemCache</strong> stores items by id with
          ordered cursor mappings. Supports append, prepend,
          and LRU eviction. Subscribers receive notifications
          on cache changes via a small event interface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>FetchOrchestrator</strong> manages
          concurrent fetch tokens, debounces triggers, and
          handles retry-on-error. It exposes status
          (<code>idle</code>, <code>loading</code>,
          <code> error</code>, <code>endReached</code>) to
          the UI.
        </HighlightBlock>
        <p>
          <strong>TriggerSentinel</strong> is a small DOM
          element observed by IntersectionObserver to detect
          near-end-of-data conditions. We render two
          sentinels for two-way scroll, one at each end.
        </p>
        <p>
          <strong>ScrollRestorer</strong> reads/writes scroll
          anchor state to the host router&rsquo;s state. On
          mount, it restores; on unmount, it persists.
        </p>
        <p>
          <strong>ItemRenderer</strong> is consumer-supplied;
          the runtime calls it with each visible item. The
          ItemRenderer is wrapped in
          <code> React.memo</code> so unchanged items
          don&rsquo;t re-render when sibling items update.
        </p>
        <p>
          <strong>StatusBanner</strong> renders end-of-list,
          error, and new-items-arrived states in a small
          banner above or below the list. It&rsquo;s
          consumer-skinnable.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The architectural patterns are
          <strong> virtualization</strong> (DOM scoped to
          viewport), <strong>cursor-paginated cache</strong>{" "}
          (ordered, LRU-evictable), <strong>observer-driven
          triggers</strong> (off-main near-end detection),
          and <strong>id-anchored restoration</strong>{" "}
          (robust to data changes).
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management Strategy</h3>
        <HighlightBlock as="p" tier="crucial">
          Three planes. <strong>Cache state</strong> (item
          cache, cursors, fetch status) lives in an external
          store created per list. <strong>Render state</strong>{" "}
          (visible window indices, measured heights) lives
          in the virtualizer&rsquo;s own ref-based state and
          isn&rsquo;t exposed to React unless the consumer
          asks. <strong>Scroll anchor</strong> lives in the
          host router&rsquo;s state across navigation.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">The cache store and the visible-window state are
          deliberately separate because they update at very
          different cadences. Cache updates are infrequent
          (once per page fetch); window updates are every
          scroll frame.</HighlightBlock>
<HighlightBlock as="p" tier="important">Conflating them would either cause
          unnecessary cache subscriber re-renders during
          scroll, or add scroll-frame state to the cache
          store, both of which are wrong.</HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">Inputs:{" "}
          <code>dataSource</code> (with
          <code> fetchPage(cursor)</code>),
          <code> renderItem(item)</code>,
          <code> estimatedItemHeight</code> (for
          variable-height mode),
          <code> overscan</code>,
          <code> threshold</code> (px from end to trigger
          fetch), <code>twoWay</code> (boolean for
          chat-style), and event handlers
          (<code> onEndReached</code>,
          <code> onItemView</code>).</HighlightBlock>
<HighlightBlock as="p" tier="important">Outputs are
          subscription events for telemetry plus an
          imperative API on the list ref
          (<code> scrollToItem</code>,
          <code> scrollToTop</code>, <code>refetch</code>).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Item contract: each item must have a stable
          <code> id</code> field. Without stable ids,
          reconciliation, scroll restoration, and React
          keys all break. Consumers using objects without
          natural ids must synthesize them deterministically
          (a hash of content, never an array index).
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance Strategy</h3>
        <HighlightBlock as="p" tier="crucial">
          Virtualization scopes mounted DOM to ~30 items
          regardless of total count. Item components are
          memoized so unchanged items don&rsquo;t re-render
          on cache updates. The visible-window calculation
          runs in
          <code> requestAnimationFrame</code> so it aligns
          with the browser&rsquo;s rendering pipeline rather
          than fighting it.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          For variable-height items, the cumulative-height
          index is updated incrementally — only the items
          whose measured heights changed contribute to the
          index update. Binary search over the index gives
          O(log N) lookup for the item at a scroll offset.
          Without the index, we&rsquo;d need O(N) to find
          the right item, which doesn&rsquo;t scale.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          IntersectionObserver fires off-main, so trigger
          detection doesn&rsquo;t add to the scroll
          critical path. The fetch happens after the trigger
          fires; the user typically doesn&rsquo;t see the
          fetch latency because the threshold is set far
          enough from the end that the page arrives before
          they reach it.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Item-level lazy-loading of images and media uses
          <code> loading=&quot;lazy&quot;</code> for native
          lazy-load, plus a hook for non-image expensive
          content (an inline chart, an embedded video) that
          delays mount until the item is in the viewport.
          This keeps initial item mount cheap even for
          rich content.
        </HighlightBlock>
      </section>

      <section>
        <h3>🎨 UI/UX Considerations</h3>
        <HighlightBlock as="p" tier="important">Skeleton items during loading match the layout of
          real items (same height, same column structure)
          to avoid cumulative layout shift. End-of-list
          states are explicit text rather than just an
          absence of more loading; users should never wonder
          if more is coming.</HighlightBlock>
<HighlightBlock as="p" tier="important">Error states surface inline
          with a Retry button; the retry preserves the
          loaded items above so the user&rsquo;s scroll
          context is preserved. Empty states (zero items
          total) explain why and offer remediation
          (clear filter, change query).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          For real-time updates, the &ldquo;new items
          arrived&rdquo; banner respects the user&rsquo;s
          intent. If they&rsquo;re scrolled to the top
          (chronological feed) and new items arrive, we
          can auto-scroll because that&rsquo;s where the
          user wants to be. If they&rsquo;ve scrolled
          down, we surface the banner instead — interrupting
          a deep-scroll session with auto-scroll is
          obnoxious. The banner is accessible (announced
          via live region) and dismissible.
        </HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="important">Chronological feeds use
          <code> role=&quot;feed&quot;</code> with
          <code> aria-busy</code> while loading.
          Non-chronological lists use
          <code> role=&quot;list&quot;</code>. Each item is
          a focusable region (focusable via Tab) with its
          own accessible name (constructed from item
          content).</HighlightBlock>
<HighlightBlock as="p" tier="important">Keyboard navigation: Page Up/Down moves
          by viewport; Home/End move to start/end (where
          End may trigger a fetch if not yet at the
          server-side end). Loading state announces via
          polite live region — &ldquo;Loading more
          items&rdquo;, &ldquo;5 new items&rdquo;, &ldquo;End
          of list&rdquo; — without spamming the
          accessibility tree on every scroll frame.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The trickiest accessibility concern is that
          virtualization may unmount items the user has
          interacted with. We mitigate by ensuring focused
          items don&rsquo;t unmount until focus moves
          elsewhere. If the user uses arrow keys to navigate
          deep into the list, focus tracks correctly across
          the unmount/mount boundary because the virtualizer
          checks for the focused item when computing the
          visible window.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security Considerations</h3>
        <HighlightBlock as="p" tier="crucial">Cursor tokens are opaque server-issued strings; we don&rsquo;t inspect or modify them. The</HighlightBlock>
<HighlightBlock as="p" tier="important">list&rsquo;s imperative API ( scrollToItem(id) ) accepts an item id but doesn&rsquo;t fetch</HighlightBlock>
<HighlightBlock as="p" tier="important">arbitrary cross-list items — it only operates within the current list&rsquo;s data source.</HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing Strategy</h3>
        <HighlightBlock as="p" tier="crucial">Integration tests mount realistic lists with mocked data sources and exercise: scroll to trigger fetch, scroll restoration after</HighlightBlock>
<HighlightBlock as="p" tier="important">navigation, real-time updates, two-way scroll. Visual regression tests catch layout shifts. Performance tests assert 60 fps scroll on</HighlightBlock>
<HighlightBlock as="p" tier="important">a 100k-item list. Accessibility tests verify the live region announcements and focus preservation across virtualization boundaries.</HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases &amp; Failure Handling</h3>
        <HighlightBlock as="p" tier="important">User scrolls very fast past the trigger: the
          IntersectionObserver fires only once per
          intersection, so we don&rsquo;t spam the data
          source; debouncing adds belt-and-suspenders
          protection. User loses network mid-scroll: we
          surface an inline retry; the loaded items above
          remain. Item heights change after measurement
          (e.g.</HighlightBlock>
<HighlightBlock as="p" tier="important">an image loads and grows the item): the
          ResizeObserver updates the cache and the
          virtualizer recalculates; we adjust scroll
          position to maintain the user&rsquo;s view if the
          changing item is above the viewport. User
          navigates back to a list whose items have
          changed (real-time deletes): the scroll restorer
          falls back to the nearest available anchor;
          users land near where they were rather than at the
          top.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Cache eviction policy edge case: user scrolls
          deep, eviction kicks in for top pages, then user
          tries to scroll back to the top. The cache notices
          the missing pages, signals gaps, and fetches them
          before scroll completes; we render skeletons in
          the meantime. Two-way scroll race: prepend and
          append fetches happen simultaneously (e.g. user
          scrolls to top while WebSocket delivers new
          items); fetch tokens prevent stale responses
          from corrupting the cache. Cursor returns null
          but the user keeps scrolling: we render
          end-of-list state explicitly. Server returns
          duplicate items (real-time + initial fetch
          overlap): the cache deduplicates by id.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability &amp; Extensibility</h3>
        <HighlightBlock as="p" tier="crucial">The runtime is generic over item type and data
          source. Plugins for real-time updates,
          pull-to-refresh, and pinned items slot in via
          composition.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">The item renderer is fully
          consumer-controlled, so the runtime works for
          feed cards, message bubbles, search results,
          notifications, and anything else with the same
          mental model.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">Status strings (loading, end of list, retry)
          resolve via the host i18n function. Right-to-left
          layouts work via CSS logical properties; the
          virtualizer is direction-agnostic (it operates on
          scroll position, which the browser handles
          correctly across directions).</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">For
          chat-style two-way scroll, RTL flips visual
          orientation but the prepend/append semantics
          remain.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs &amp; Design Decisions</h3>

        <h3>Infinite scroll vs paginated</h3>
        <p>
          Infinite scroll fits browse-and-discover flows
          (feeds, search results, image galleries) where
          users don&rsquo;t need to land on a specific
          page. Paginated fits look-up flows (admin tables,
          archives) where users navigate to specific
          positions. Each works for the right use case; the
          mistake is using one when the other is right.
          For the feed-style use cases this article targets,
          infinite scroll is the right choice; for tabular
          lookups, the Data Table is.
        </p>

        <h3>IntersectionObserver vs scroll-position math</h3>
        <HighlightBlock as="p" tier="important">
          IntersectionObserver runs off-main, doesn&rsquo;t
          fire excessively during fast scrolling, and
          aligns with the browser&rsquo;s render pipeline.
          Scroll-position math (subscribing to
          <code> onScroll</code> and computing) runs on the
          main thread, fires per scroll event, and can
          cause jank if the handler is non-trivial. We use
          IntersectionObserver wherever possible.
        </HighlightBlock>

        <h3>ID-anchored vs offset-anchored scroll restoration</h3>
        <HighlightBlock as="p" tier="important">
          Offset-anchored restoration is simpler but breaks
          when items change between visits. ID-anchored is
          robust to changes (items added, removed, resized)
          and feels reliable. The cost is an extra lookup
          on restore; the gain is a much better UX in the
          presence of any data churn.
        </HighlightBlock>

        <h3>LRU eviction vs holding everything</h3>
        <HighlightBlock as="p" tier="important">
          For very long-lived sessions (a Twitter timeline
          open for hours), holding every loaded item
          consumes unbounded memory. LRU eviction keeps
          memory bounded at the cost of needing to refetch
          on backtrack. We tune the LRU window so that
          common backtrack distances stay in cache while
          long-distance backtracks pay a refetch cost; the
          window is configurable per consumer.
        </HighlightBlock>

        <h3>Real-time auto-scroll vs banner</h3>
        <HighlightBlock as="p" tier="important">
          Auto-scrolling on new items interrupts users who
          are reading. A banner (&ldquo;5 new items&rdquo;)
          is unobtrusive and respects user intent. We
          auto-scroll only when the user is already at the
          relevant end (top of feed); otherwise we banner.
          This rule is opinionated but correct for
          consumer-facing feeds; chat apps can override the
          policy because their semantics are different.
        </HighlightBlock>

        <h3>Variable-height vs forced fixed-height</h3>
        <HighlightBlock as="p" tier="crucial">
          Forced fixed-height is dramatically simpler but
          looks bad for content with intrinsically variable
          length (cards, messages). Variable-height costs
          more (measured-height cache, ResizeObserver,
          cumulative-height index) but produces a UI that
          matches user expectations. For most modern
          products, variable-height is the right default;
          fixed-height is an opt-in for cases that genuinely
          have uniform items (e.g. an inbox of equal-size
          rows).
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">Cross-session scroll restoration: come back tomorrow and land where you were last night.</HighlightBlock>
<HighlightBlock as="p" tier="important">Better integration with the View Transitions API for navigation between list and detail views.</HighlightBlock>
<HighlightBlock as="p" tier="important">Service-worker-driven push updates so new items can arrive even when the tab is backgrounded.</HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate canonical data, user intent, transient projection, remote effects, and bounded telemetry. Every cursor, subscription, cache entry, request, timer, observer, and worker requires an explicit owner and cleanup path. Stable ids are mandatory because indexes and DOM nodes are disposable views.</p><p>Keep the loaded page ledger separate from the rendered DOM window. Stable item ids and measured sizes preserve scroll position while pages enter or leave memory. Commit durable changes only after applying the current policy and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/infinite-scroll-virtualized-list-recovery.svg" alt="Design an Infinite-scroll Virtualized List recovery" caption="Recovery flow: validate versions, contain scale pressure, preserve stable truth, and explain the result." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Explicit pagination is easier to navigate and share; infinite scroll is justified for exploratory feeds where continuity matters more than direct addressing.</p><p>Server cursors define traversal continuity. Client pages are cached snapshots; stale fetches are dropped and duplicates deduped by stable id. Scale pressure comes from millions of items, variable heights, reverse loading, rapid scroll, image shifts, duplicate cursors, memory pressure, and back-forward restoration. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only where rollback is deterministic and visible. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed events, explicit versions, cursor validation, generation guards, bounded caches, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, reconnects, retries, scroll restoration, and large datasets.</p><p>Measure interaction latency, render cost, cache pressure, stale drops, conflicts, retries, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<h3>Principal defense: consistency, abuse, and bounded projection</h3><p>Separate authoritative records from query state, cursors, optimistic journals, viewport windows, and derived aggregates. Within a pagination or edit session, responses settle only when their query key, cursor lineage, tenant scope, and version still match. A rejected optimistic mutation restores the committed record and reapplies only valid local intent. Snapshot consistency is usually sufficient for browsing; conditional writes are required for edits.</p><p>Defend scale by bounding normalized caches, rendered windows, aggregation frequency, export size, and subscription fan-out. Defend abuse by validating filter complexity, column count, sort fan-out, cell payloads, and stream frequency before expensive work begins. Emit query-key attribution, cache hit rate, dropped frames, stale-response rejection, conflict count, rollback result, and memory pressure without logging sensitive row content.</p><section><h2>Common Pitfalls</h2><p>Common failures include confusing visible data with complete data, trusting arrival order, leaking subscriptions, accepting stale completion, using indexes as identity, and hiding rollback.</p><p>For this topic, dedupe cursor requests, abort obsolete loads, retain visible anchor during prepend and eviction, reserve media dimensions, cap memory, and show retry at failed boundaries. Validate untrusted inputs, authorize durable actions server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to operational interfaces where users manipulate large, changing datasets under partial failure. Reuse the controller shape while injecting query, authorization, persistence, and fallback policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Keep the loaded page ledger separate from the rendered DOM window. Stable item ids and measured sizes preserve scroll position while pages enter or leave memory.</p><h3>What breaks at scale?</h3><p>millions of items, variable heights, reverse loading, rapid scroll, image shifts, duplicate cursors, memory pressure, and back-forward restoration. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>Server cursors define traversal continuity. Client pages are cached snapshots; stale fetches are dropped and duplicates deduped by stable id.</p><h3>How do you recover?</h3><p>I would dedupe cursor requests, abort obsolete loads, retain visible anchor during prepend and eviction, reserve media dimensions, cap memory, and show retry at failed boundaries.</p><h3>Why this architecture?</h3><p>Explicit pagination is easier to navigate and share; infinite scroll is justified for exploratory feeds where continuity matters more than direct addressing.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
