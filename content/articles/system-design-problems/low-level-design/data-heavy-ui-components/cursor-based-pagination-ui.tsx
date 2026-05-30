"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
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
  tags: ["lld", "cursor-pagination", "infinite-scroll", "real-time", "react"],
  relatedTopics: [
    "infinite-scroll-virtualized-list",
    "data-table",
    "real-time-data-dashboard",
  ],
};

export default function CursorBasedPaginationUIArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Cursor-based Pagination UI</h1><h2>Definition &amp; Context</h2><p>Design a Cursor-based Pagination UI is an implementation-heavy low-level design problem covering cursor ledger, forward and backward navigation, request generations, caching, URL restoration, prefetch budgeting, and expired-cursor recovery. A principal-level answer must define state ownership, consistency, lifecycle cleanup, scale limits, rollback, privacy, cost, and observability.</p><p>Treat cursors as opaque traversal tokens. Keep the visible page, cursor ledger, URL state, cache entries, and active request generation separate. The core structures are current page snapshot, cursor ledger, cache map, request generation, abort controller, URL projection, prefetch budget, total estimate, and recovery boundary.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/cursor-based-pagination-ui-runtime.svg" alt="Design a Cursor-based Pagination UI runtime" caption="Topic-specific data flow from input or payload through guarded projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific implementation mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a cursor-based pagination UI — the front-end of a
          backend that serves data paginated by opaque cursors rather than
          offsets. Cursor pagination scales to massive datasets (millions of
          rows) where offset pagination breaks down (the database has to skip
          past millions of rows to find your page). It handles real-time
          insertion gracefully (offsets shift when new rows arrive; cursors
          point to specific records that don&rsquo;t shift). It&rsquo;s the
          right pattern for feeds, search results, audit logs, and any large
          dataset where users browse by reading forward.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: navigation that feels natural (Next, Prev, Load
          More) on top of opaque tokens; deep linking when cursors are opaque (a
          shared URL with a specific cursor must work); gap handling when items
          are inserted between fetches; integration with infinite scroll vs
          explicit Next/Prev UIs; forward/back symmetry when the API supports
          both directions; and clearing edge cases when cursor invalidation
          occurs (the cursor a user shared yesterday may be stale today if the
          underlying data has been deleted).
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users see Load More buttons or scroll through infinite feeds; they
          don&rsquo;t see cursors directly. Internal users (engineers) care
          about the API: take a fetch function that accepts cursors and returns
          items, and the system handles the rest. Product managers care that
          pagination doesn&rsquo;t leak technical concepts to users (no
          &ldquo;Page 173 of ?&rdquo; nonsense).
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend returns
          <code>{` { items, nextCursor, prevCursor? } `}</code> per fetch.
          Cursors are opaque strings (the server&rsquo;s implementation detail).
          Items are stable (have ids). Datasets are typically chronological
          (feeds, logs) but the pattern works for any total ordering. Modern
          browsers; we use the URL for deep linking and IntersectionObserver for
          triggers.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement offset-based pagination (different problem;
          appropriate for small datasets). We do not implement the backend
          cursor mechanism. We do not implement full-screen pagination UIs (Next
          1 2 3 4 5 Last) — those work for offset, not cursor.
        </HighlightBlock>
      </section>

      <section>
        <h3>Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Forward navigation via Next or Load More button. Backward navigation
          via Prev (when supported by the API). Infinite scroll mode: trigger
          fetch on scroll near end. Deep-link via URL parameter encoding the
          current cursor. Items concatenate forward, replace if Prev navigates
          back. Empty state when no items. End-of-data state when cursor returns
          null. Loading and error states inline with retry.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Real-time insertion of new items at the top (subscribe to backend
          updates). &ldquo;X new items since you last looked&rdquo; banner.
          Cursor invalidation handling: shared link to a stale cursor refreshes
          with explanation. Page size configuration. Skeleton items during
          fetch.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Backend cursor implementation, virtualization (separate subsystem),
          table-style features (sort, filter UIs).
        </HighlightBlock>
      </section>

      <section>
        <h3>Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Fetch triggers complete before users see blank space. Page transitions
          feel instant in infinite mode (skeleton appears before fetch
          resolves). Memory bounded for long sessions via LRU eviction.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Concurrent fetches race-protected via tokens. Cursor invalidation
          handled gracefully. Real- time inserts merge without disrupting the
          user&rsquo;s scroll.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Cursors are opaque server tokens; we don&rsquo;t inspect or modify
          them. Deep-link cursors carry no PII (server implementation
          responsibility, but we document the assumption).
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Load More buttons are keyboard-accessible. Infinite scroll integrates
          with the accessibility patterns from the Infinite Scroll Virtualized
          List subsystem. State changes announce.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          The pagination engine is generic over item type. The fetch contract is
          small. Plugins (real-time, deep-link, gap-handling) compose.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="important">
          The system has four parts: a <strong>cursor-aware fetcher</strong>, an{" "}
          <strong>ordered item cache</strong> (deduped by id), a{" "}
          <strong>navigation controller</strong> (Next, Prev, Load More modes),
          and a <strong>URL/deep-link integration</strong>.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>fetcher</strong> takes a cursor (or null for the first
          page) and returns items plus nextCursor and (optionally) prevCursor.
          Each fetch carries a token for race protection; stale responses are
          discarded. The fetcher is consumer-supplied; the rest of the system is
          generic.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>item cache</strong> is an ordered list (chronological or
          whatever the API&rsquo;s ordering is) with a Set of seen ids for
          deduplication. Forward fetches append; Prev fetches prepend (in a
          paginated UI) or replace the current view (in a Next/Prev UI). Real-
          time inserts go to the appropriate end of the cache (typically the top
          for chronological feeds). The cache supports LRU eviction to bound
          memory in long sessions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The <strong>navigation controller</strong> tracks the current cursor
          position and the next/prev cursors available. In Load More mode, the
          controller appends each fetched page; the UI is a single growing list.
          In Next/Prev mode, the controller replaces the current view per
          navigation; we keep a small ring of recent pages cached so
          back-navigation is instant. In infinite-scroll mode, the controller
          triggers fetches on scroll via the standard IntersectionObserver
          pattern.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Deep linking</strong>: the current cursor is encoded in the
          URL as a query parameter (e.g.
          <code> ?after=eyJpZCI6...</code>). On mount, the system parses the URL
          and starts at that cursor. Sharing the URL takes a recipient to the
          same view. If the cursor is stale (the server returns an error or
          empty), we fall back to the first page with a banner explaining the
          redirect.
        </HighlightBlock>
        <p>
          <strong>Real-time inserts</strong>: a WebSocket connection delivers
          new items as they arrive. New items merge into the cache at the top
          (chronological feeds). The UI surfaces a banner (&ldquo;5 new
          items&rdquo;) for users who are deep-scrolled rather than
          auto-scrolling and interrupting their reading. Clicking the banner
          smoothly scrolls to the new items.
        </p>
        <p>
          <strong>Gap handling</strong>: if a user navigates back-and-forth
          across pages and we notice a gap (the server reports more items than
          we&rsquo;ve seen between two known cursors), we surface &ldquo;Load N
          items in between&rdquo; rather than silently merging, which would feel
          unpredictable. This is most common with real-time feeds.
        </p>
        <p>
          On <strong>cursor invalidation</strong> (the server returns 410 Gone
          or similar for a stale cursor), the system clears the current view and
          refetches from the start, with a banner explaining that the link is no
          longer valid. Users should see what data is available, not a confusing
          error screen.
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial">
          <strong>PaginationProvider</strong> instantiates the fetcher, cache,
          and controller.
          <strong> Fetcher</strong> is consumer-supplied.
          <strong> ItemCache</strong> is the ordered, deduped store.{" "}
          <strong>NavigationController</strong> orchestrates Next/Prev/Load
          More.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">
            <strong> URLBridge</strong>
          </Highlight>{" "}
          reads/writes the cursor from/to the URL.
          <strong> RealtimeBridge</strong> handles WebSocket inserts (optional
          plugin).
          <strong> ItemRenderer</strong> is consumer- supplied per item.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="crucial">
          The cache and current-cursor state live in an external store. The URL
          is the primary observable
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          for cursor position; the engine reconciles to the URL on mount and
          updates the URL on
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          navigation. Real-time state (incoming buffer awaiting user acceptance)
          is a separate slice.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="crucial">
          The fetch contract accepts a cursor token and returns a page of items
          plus paging cursors (next, and optionally previous). Each item has a
          stable ID used for deduplication and caching.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">
            The UI mode selects Next/Prev controls, Load More, or Infinite
            Scroll. A common URL contract uses a query parameter like{" "}
          </Highlight>
          <code>?cursor=...</code> to make pagination linkable and back-button
          friendly.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Rendering &amp; Performance</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">
            The cache is the single source of truth for rendered items; fetches
            append or prepend atomically. Subscribers re-render when their slice
            changes.
          </Highlight>
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          For infinite-scroll mode, virtualization is applied via the underlying
          virtualized list subsystem. Skeleton items during fetch maintain
          layout. The fetch token prevents stale results from rendering.
        </HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">
          Load More feels explicit and works for users who prefer paging through
          results. Next/Prev feels like classic pagination but without page
          numbers (because cursors don&rsquo;t map to page numbers cleanly).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">
            Infinite scroll feels like a feed. Each mode has its own interaction
            style; we don&rsquo;t mix. Loading states are skeletons, not
            spinners, to preserve layout. Error states show inline with Retry;
            loaded items remain.
          </Highlight>
        </HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Load More is a real button reachable by Tab. Next/Prev are buttons
          with accessible labels (&ldquo;Next page of results&rdquo;).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">
            Infinite scroll integrates with the patterns from the Infinite
            Scroll subsystem. Real-time banner is announced via polite live
            region. End-of-data state announces.
          </Highlight>
        </HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="crucial">
          Cursors are opaque server-issued tokens; we don&rsquo;t inspect or
          modify them. The server enforces authorization on every request; the
          client trusts the server&rsquo;s decisions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">
            Cursor invalidation is handled gracefully (no information leakage
            about why a cursor is invalid).
          </Highlight>
        </HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">
          Unit tests for the cache (append, prepend, dedup, LRU eviction), the
          navigation controller (forward/back transitions), and fetch token
          races.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">
            Integration tests with mock fetchers, exercising deep-link
            restoration, real-time inserts, gap surfacing, cursor invalidation.
            End-to-end tests in real browsers for URL behavior.
          </Highlight>
        </HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">
          Gap detected between known cursors: surface the gap rather than
          silently merging. User shares a
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          deep-link to a cursor that&rsquo;s since been invalidated: refetch
          from start with banner. Empty
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          result on first page: empty state. Empty result on Next: end-of- data
          state, leaving prior items intact.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="crucial">
          The pagination primitive is generic over item type, fetch strategy,
          and caching layer: it should not assume REST vs GraphQL or specific
          response shapes.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The three modes (Load More, Next/Prev, Infinite Scroll) cover most UX
          patterns; keep them as configuration, not separate implementations.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Real-time inserts and deep-linking are opt-in plugins: the core stays
          small, while higher-level behaviors compose.
        </HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="crucial">
          Button labels, banners, and state messages come from i18n; pagination
          UI must be fully locale-driven (including pluralization).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          RTL impacts affordances (chevrons, alignment, scroll direction); use
          CSS logical properties and avoid hard-coded left/right assumptions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Item content i18n remains the consumer&rsquo;s concern, but the
          paginator should expose stable semantics (loading, end-of-list, error)
          so translations are consistent.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Cursor vs offset pagination</h3>
        <HighlightBlock as="p" tier="crucial">
          Offset is simple and gives Page N affordances but breaks at large
          offsets (database scans past skipped rows) and shifts under real-time
          inserts. Cursor is opaque and scales to any dataset size, handles
          real-time gracefully, but loses the &ldquo;jump to page N&rdquo; UX.
          We use cursor for large/real-time datasets and offset for small/static
          ones.
        </HighlightBlock>

        <h3>Load More vs infinite scroll</h3>
        <HighlightBlock as="p" tier="important">
          Load More gives explicit user control and works well for
          browse-and-evaluate flows. Infinite scroll feels effortless for feeds.
          Choose per use case; we support both via mode prop.
        </HighlightBlock>

        <h3>URL deep-link vs in-memory cursor</h3>
        <HighlightBlock as="p" tier="important">
          URL deep-link is shareable, refresh-safe, and back-button-safe at the
          cost of URL parsing. In-memory is simpler but breaks all of those. We
          default to URL deep-link.
        </HighlightBlock>

        <h3>Auto-scroll on real-time vs banner</h3>
        <HighlightBlock as="p" tier="important">
          Auto-scroll interrupts users; banner respects intent. We use banner
          unless the user is at the relevant edge (top of feed) where
          they&rsquo;d want auto-scroll anyway.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="crucial">
          Predictive prefetch based on scroll velocity. Service-worker offline
          cache so users see cached items when offline.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">
            Cross-session cursor restoration (come back tomorrow, continue where
            you left off). Smarter gap handling with diff visualization.
          </Highlight>
        </HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate canonical data, user intent, transient projection, remote effects, and bounded telemetry. Every cursor, subscription, cache entry, request, timer, observer, and worker requires an explicit owner and cleanup path. Stable ids are mandatory because indexes and DOM nodes are disposable views.</p><p>Treat cursors as opaque traversal tokens. Keep the visible page, cursor ledger, URL state, cache entries, and active request generation separate. Commit durable changes only after applying the current policy and preserve enough evidence to reconcile failure.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/data-heavy-ui-components/cursor-based-pagination-ui-recovery.svg" alt="Design a Cursor-based Pagination UI recovery" caption="Recovery flow: validate versions, contain scale pressure, preserve stable truth, and explain the result." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Offset pagination supports direct jumps; cursor pagination is justified for changing high-volume datasets where stable traversal matters more than arbitrary page numbers.</p><p>The server cursor defines traversal continuity for a snapshot boundary. Cached pages are advisory; refresh explicitly starts a new traversal when cursors expire. Scale pressure comes from rapid navigation, unknown totals, cursor expiry, new inserts, browser back-forward, duplicate responses, and prefetch amplification. Bound work, reject stale effects, cap memory, and degrade predictably.</p><p>Use optimistic projection only where rollback is deterministic and visible. Keep authorization and conflict-sensitive truth server-side.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, typed events, explicit versions, cursor validation, generation guards, bounded caches, semantic HTML, and idempotent cleanup. Test keyboard use, accessibility output, stale responses, reconnects, retries, scroll restoration, and large datasets.</p><p>Measure interaction latency, render cost, cache pressure, stale drops, conflicts, retries, and accessibility regressions. Avoid sensitive telemetry.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include confusing visible data with complete data, trusting arrival order, leaking subscriptions, accepting stale completion, using indexes as identity, and hiding rollback.</p><p>For this topic, abort superseded fetches, discard stale responses, cap prefetch, retain the previous page while loading, recover expired cursors with a refresh boundary, and validate URL state. Validate untrusted inputs, authorize durable actions server-side, and minimize sensitive retention.</p></section>
<section><h2>Real-world use cases</h2><p>This runtime applies to operational interfaces where users manipulate large, changing datasets under partial failure. Reuse the controller shape while injecting query, authorization, persistence, and fallback policy explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Treat cursors as opaque traversal tokens. Keep the visible page, cursor ledger, URL state, cache entries, and active request generation separate.</p><h3>What breaks at scale?</h3><p>rapid navigation, unknown totals, cursor expiry, new inserts, browser back-forward, duplicate responses, and prefetch amplification. I would bound expensive work and reject obsolete effects.</p><h3>What consistency model applies?</h3><p>The server cursor defines traversal continuity for a snapshot boundary. Cached pages are advisory; refresh explicitly starts a new traversal when cursors expire.</p><h3>How do you recover?</h3><p>I would abort superseded fetches, discard stale responses, cap prefetch, retain the previous page while loading, recover expired cursors with a refresh boundary, and validate URL state.</p><h3>Why this architecture?</h3><p>Offset pagination supports direct jumps; cursor pagination is justified for changing high-volume datasets where stable traversal matters more than arbitrary page numbers.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA Authoring Practices Guide</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" target="_blank" rel="noreferrer">MDN ResizeObserver</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}
