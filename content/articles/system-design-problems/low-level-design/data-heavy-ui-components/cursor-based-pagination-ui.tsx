"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-cursor-based-pagination-ui",
  title: "Design a Cursor-based Pagination UI",
  description:
    "LLD for cursor-based pagination: forward/back navigation, deep-link safety, real-time inserts, gap handling, and integration with virtualized lists.",
  category: "low-level-design",
  subcategory: "data-heavy-ui-components",
  slug: "cursor-based-pagination-ui",
  wordCount: 6500,
  readingTime: 35,
  lastUpdated: "2026-04-29",
  tags: [
    "lld",
    "cursor-pagination",
    "infinite-scroll",
    "real-time",
    "react",
  ],
  relatedTopics: [
    "infinite-scroll-virtualized-list",
    "data-table",
    "real-time-data-dashboard",
  ],
};

export default function CursorBasedPaginationUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a cursor-based pagination UI —
          the front-end of a backend that serves data
          paginated by opaque cursors rather than offsets.
          Cursor pagination scales to massive datasets
          (millions of rows) where offset pagination
          breaks down (the database has to skip past
          millions of rows to find your page). It handles
          real-time insertion gracefully (offsets shift
          when new rows arrive; cursors point to specific
          records that don&rsquo;t shift). It&rsquo;s the
          right pattern for feeds, search results, audit
          logs, and any large dataset where users browse
          by reading forward.
        </p>
        <p>
          The hard problems are: navigation that feels
          natural (Next, Prev, Load More) on top of
          opaque tokens; deep linking when cursors are
          opaque (a shared URL with a specific cursor
          must work); gap handling when items are
          inserted between fetches; integration with
          infinite scroll vs explicit Next/Prev UIs;
          forward/back symmetry when the API supports
          both directions; and clearing edge cases when
          cursor invalidation occurs (the cursor a user
          shared yesterday may be stale today if the
          underlying data has been deleted).
        </p>

        <h3>User Context</h3>
        <p>
          End users see Load More buttons or scroll
          through infinite feeds; they don&rsquo;t see
          cursors directly. Internal users (engineers)
          care about the API: take a fetch function that
          accepts cursors and returns items, and the
          system handles the rest. Product managers care
          that pagination doesn&rsquo;t leak technical
          concepts to users (no &ldquo;Page 173 of
          ?&rdquo; nonsense).
        </p>

        <h3>Assumptions</h3>
        <p>
          Backend returns
          <code>{` { items, nextCursor, prevCursor? } `}</code>{" "}
          per fetch. Cursors are opaque strings (the
          server&rsquo;s implementation detail). Items are
          stable (have ids). Datasets are typically
          chronological (feeds, logs) but the pattern
          works for any total ordering. Modern browsers;
          we use the URL for deep linking and
          IntersectionObserver for triggers.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement offset-based pagination
          (different problem; appropriate for small
          datasets). We do not implement the backend
          cursor mechanism. We do not implement
          full-screen pagination UIs (Next 1 2 3 4 5
          Last) — those work for offset, not cursor.
        </p>
      </section>

      <section>
        <h2>⚙️ Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Forward navigation via Next or Load More button.
          Backward navigation via Prev (when supported by
          the API). Infinite scroll mode: trigger fetch
          on scroll near end. Deep-link via URL parameter
          encoding the current cursor. Items concatenate
          forward, replace if Prev navigates back. Empty
          state when no items. End-of-data state when
          cursor returns null. Loading and error states
          inline with retry.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Real-time insertion of new items at the top
          (subscribe to backend updates). &ldquo;X new
          items since you last looked&rdquo; banner.
          Cursor invalidation handling: shared link to a
          stale cursor refreshes with explanation. Page
          size configuration. Skeleton items during fetch.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Backend cursor implementation, virtualization
          (separate subsystem), table-style features
          (sort, filter UIs).
        </p>
      </section>

      <section>
        <h2>📊 Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Fetch triggers complete before users see blank
          space. Page transitions feel instant in infinite
          mode (skeleton appears before fetch resolves).
          Memory bounded for long sessions via LRU
          eviction.
        </p>

        <h3>Reliability</h3>
        <p>
          Concurrent fetches race-protected via tokens.
          Cursor invalidation handled gracefully. Real-
          time inserts merge without disrupting the
          user&rsquo;s scroll.
        </p>

        <h3>Security</h3>
        <p>
          Cursors are opaque server tokens; we don&rsquo;t
          inspect or modify them. Deep-link cursors carry
          no PII (server implementation responsibility,
          but we document the assumption).
        </p>

        <h3>Accessibility</h3>
        <p>
          Load More buttons are keyboard-accessible.
          Infinite scroll integrates with the
          accessibility patterns from the Infinite Scroll
          Virtualized List subsystem. State changes
          announce.
        </p>

        <h3>Maintainability</h3>
        <p>
          The pagination engine is generic over item
          type. The fetch contract is small. Plugins
          (real-time, deep-link, gap-handling) compose.
        </p>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/pagination-cursors-state-merging-architecture.svg"
        alt="Cursor-based Pagination Architecture"
        caption="Fetch (with cursor) → Items + Next/Prev cursors → Item Cache (ordered, deduped by id) → UI (Load More / Infinite Scroll). Real-time inserts merge at the top with a 'new items' banner. Deep-link cursors restored from URL on mount."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system has four parts: a <strong>cursor-aware
          fetcher</strong>, an <strong>ordered item cache</strong>{" "}
          (deduped by id), a <strong>navigation
          controller</strong> (Next, Prev, Load More
          modes), and a <strong>URL/deep-link
          integration</strong>.
        </p>
        <p>
          The <strong>fetcher</strong> takes a cursor (or
          null for the first page) and returns items
          plus nextCursor and (optionally) prevCursor.
          Each fetch carries a token for race protection;
          stale responses are discarded. The fetcher is
          consumer-supplied; the rest of the system is
          generic.
        </p>
        <p>
          The <strong>item cache</strong> is an ordered list
          (chronological or whatever the API&rsquo;s
          ordering is) with a Set of seen ids for
          deduplication. Forward fetches append; Prev
          fetches prepend (in a paginated UI) or replace
          the current view (in a Next/Prev UI). Real-
          time inserts go to the appropriate end of the
          cache (typically the top for chronological
          feeds). The cache supports LRU eviction to
          bound memory in long sessions.
        </p>
        <p>
          The <strong>navigation controller</strong> tracks
          the current cursor position and the next/prev
          cursors available. In Load More mode, the
          controller appends each fetched page; the UI is
          a single growing list. In Next/Prev mode, the
          controller replaces the current view per
          navigation; we keep a small ring of recent
          pages cached so back-navigation is instant. In
          infinite-scroll mode, the controller triggers
          fetches on scroll via the standard
          IntersectionObserver pattern.
        </p>
        <p>
          <strong>Deep linking</strong>: the current cursor
          is encoded in the URL as a query parameter (e.g.
          <code> ?after=eyJpZCI6...</code>). On mount, the
          system parses the URL and starts at that
          cursor. Sharing the URL takes a recipient to
          the same view. If the cursor is stale (the
          server returns an error or empty), we fall back
          to the first page with a banner explaining
          the redirect.
        </p>
        <p>
          <strong>Real-time inserts</strong>: a WebSocket
          connection delivers new items as they arrive.
          New items merge into the cache at the top
          (chronological feeds). The UI surfaces a banner
          (&ldquo;5 new items&rdquo;) for users who are
          deep-scrolled rather than auto-scrolling and
          interrupting their reading. Clicking the banner
          smoothly scrolls to the new items.
        </p>
        <p>
          <strong>Gap handling</strong>: if a user
          navigates back-and-forth across pages and we
          notice a gap (the server reports more items
          than we&rsquo;ve seen between two known
          cursors), we surface &ldquo;Load N items in
          between&rdquo; rather than silently merging,
          which would feel unpredictable. This is most
          common with real-time feeds.
        </p>
        <p>
          On <strong>cursor invalidation</strong> (the
          server returns 410 Gone or similar for a stale
          cursor), the system clears the current view
          and refetches from the start, with a banner
          explaining that the link is no longer valid.
          Users should see what data is available, not a
          confusing error screen.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>PaginationProvider</strong> instantiates
          the fetcher, cache, and controller.
          <strong> Fetcher</strong> is consumer-supplied.
          <strong> ItemCache</strong> is the ordered,
          deduped store. <strong>NavigationController</strong>{" "}
          orchestrates Next/Prev/Load More.
          <strong> URLBridge</strong> reads/writes the
          cursor from/to the URL.
          <strong> RealtimeBridge</strong> handles
          WebSocket inserts (optional plugin).
          <strong> ItemRenderer</strong> is consumer-
          supplied per item.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          The cache and current-cursor state live in an
          external store. The URL is the primary
          observable for cursor position; the engine
          reconciles to the URL on mount and updates the
          URL on navigation. Real-time state (incoming
          buffer awaiting user acceptance) is a separate
          slice.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Fetch contract:{" "}
          <code>{` (cursor) => Promise<{ items, nextCursor, prevCursor? }> `}</code>.
          Item contract:{" "}
          <code>{` { id, ...content } `}</code> with stable id.
          Mode prop selects Next/Prev, Load More, or
          Infinite Scroll. URL contract: query parameter
          <code> ?cursor=...</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Rendering &amp; Performance</h2>
        <p>
          The cache is the single source of truth for
          rendered items; fetches append or prepend
          atomically. Subscribers re-render when their
          slice changes. For infinite-scroll mode,
          virtualization is applied via the underlying
          virtualized list subsystem. Skeleton items
          during fetch maintain layout. The fetch token
          prevents stale results from rendering.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Load More feels explicit and works for users
          who prefer paging through results. Next/Prev
          feels like classic pagination but without page
          numbers (because cursors don&rsquo;t map to
          page numbers cleanly). Infinite scroll feels
          like a feed. Each mode has its own
          interaction style; we don&rsquo;t mix.
          Loading states are skeletons, not spinners,
          to preserve layout. Error states show inline
          with Retry; loaded items remain.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Load More is a real button reachable by Tab.
          Next/Prev are buttons with accessible labels
          (&ldquo;Next page of results&rdquo;). Infinite
          scroll integrates with the patterns from the
          Infinite Scroll subsystem. Real-time banner is
          announced via polite live region. End-of-data
          state announces.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Cursors are opaque server-issued tokens; we
          don&rsquo;t inspect or modify them. The server
          enforces authorization on every request; the
          client trusts the server&rsquo;s decisions.
          Cursor invalidation is handled gracefully
          (no information leakage about why a cursor is
          invalid).
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the cache (append, prepend,
          dedup, LRU eviction), the navigation
          controller (forward/back transitions), and
          fetch token races. Integration tests with
          mock fetchers, exercising deep-link
          restoration, real-time inserts, gap
          surfacing, cursor invalidation. End-to-end
          tests in real browsers for URL behavior.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          User clicks Load More twice rapidly: fetch
          tokens prevent duplicate appends. User
          navigates Next then Back: cached pages serve
          the back-navigation instantly. Cursor
          invalidation mid-session: clear and refetch
          with banner. Real-time inserts arrive while
          user is reading: banner, no auto-scroll.
          Gap detected between known cursors: surface
          the gap rather than silently merging. User
          shares a deep-link to a cursor that&rsquo;s
          since been invalidated: refetch from start
          with banner. Empty result on first page:
          empty state. Empty result on Next: end-of-
          data state, leaving prior items intact.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic over item type and fetch logic. The
          three modes (Load More, Next/Prev, Infinite
          Scroll) cover the common patterns. Plugins
          for real-time and deep-link integrate
          declaratively.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Button labels, banner text, and state
          messages via i18n. Item content i18n is the
          consumer&rsquo;s concern.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Cursor vs offset pagination</h3>
        <p>
          Offset is simple and gives Page N affordances
          but breaks at large offsets (database scans
          past skipped rows) and shifts under real-time
          inserts. Cursor is opaque and scales to any
          dataset size, handles real-time gracefully,
          but loses the &ldquo;jump to page N&rdquo;
          UX. We use cursor for large/real-time
          datasets and offset for small/static ones.
        </p>

        <h3>Load More vs infinite scroll</h3>
        <p>
          Load More gives explicit user control and
          works well for browse-and-evaluate flows.
          Infinite scroll feels effortless for feeds.
          Choose per use case; we support both via
          mode prop.
        </p>

        <h3>URL deep-link vs in-memory cursor</h3>
        <p>
          URL deep-link is shareable, refresh-safe, and
          back-button-safe at the cost of URL parsing.
          In-memory is simpler but breaks all of those.
          We default to URL deep-link.
        </p>

        <h3>Auto-scroll on real-time vs banner</h3>
        <p>
          Auto-scroll interrupts users; banner respects
          intent. We use banner unless the user is at
          the relevant edge (top of feed) where they&rsquo;d
          want auto-scroll anyway.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Predictive prefetch based on scroll velocity.
          Service-worker offline cache so users see
          cached items when offline. Cross-session
          cursor restoration (come back tomorrow,
          continue where you left off). Smarter gap
          handling with diff visualization.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why cursor over offset
          pagination?</strong> Cursor scales to massive
          datasets without database scan cost. It&rsquo;s
          stable under real-time insertion (cursors
          point to records, not positions). Offset
          breaks at high page numbers and shifts under
          inserts.
        </p>

        <p>
          <strong>2. How do deep links work with opaque
          cursors?</strong> The current cursor is encoded
          in a URL query parameter. On mount, the
          system parses the URL and starts at that
          cursor. Sharing the URL takes recipients to
          the same view. Stale cursors fall back to
          the first page with a banner.
        </p>

        <p>
          <strong>3. How do you handle real-time
          inserts?</strong> A WebSocket delivers new
          items; they merge into the cache at the top.
          The UI surfaces a banner rather than auto-
          scrolling, unless the user is at the top
          where they want the new items immediately.
        </p>

        <p>
          <strong>4. How do you race-protect concurrent
          fetches?</strong> Each fetch carries a
          monotonic token. Only the latest token&rsquo;s
          response renders; earlier responses are
          discarded.
        </p>

        <p>
          <strong>5. How do gaps in cursor sequences get
          handled?</strong> When the server reports more
          items between two known cursors than we&rsquo;ve
          seen, we surface a &ldquo;Load N items&rdquo;
          affordance rather than silently merging.
        </p>

        <p>
          <strong>6. What happens when a cursor is
          invalidated?</strong> The server returns an
          error (e.g. 410 Gone). The system clears the
          current view, refetches from the start, and
          shows a banner explaining the redirect.
        </p>

        <p>
          <strong>7. How is this different from infinite
          scroll?</strong> Infinite scroll is one mode of
          this system. The other modes — Load More,
          Next/Prev — share the same cursor mechanics
          but present them differently. Infinite scroll
          uses the Virtualized List subsystem
          underneath.
        </p>

        <p>
          <strong>8. How do you scale to millions of
          rows?</strong> Cursor pagination is the answer.
          The client never holds millions; it holds the
          pages it has fetched. LRU eviction bounds
          memory.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          Cursor-based pagination UI is{" "}
          <strong>fetcher + cache + navigation
          controller + URL bridge</strong>. It supports
          three modes (Load More, Next/Prev, Infinite
          Scroll) over the same cursor mechanics. Real-
          time inserts surface as banners; deep links
          encode the cursor; cursor invalidation falls
          back gracefully. The pattern scales to massive
          datasets where offset breaks down, and it&rsquo;s
          the right choice for feeds, search results,
          and audit logs at any non-trivial scale.
        </p>
      </section>
    </ArticleLayout>
  );
}
