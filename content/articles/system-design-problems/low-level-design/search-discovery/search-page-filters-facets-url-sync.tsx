"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-search-page-filters-facets-url-sync",
  title: "Design a Search Page (Filters + Facets + URL Sync)",
  description:
    "LLD for a search page composing query + filters + facets + sort + pagination with URL state, shareable views, and accessible controls.",
  category: "low-level-design",
  subcategory: "search-discovery",
  slug: "search-page-filters-facets-url-sync",
  wordCount: 6500,
  readingTime: 34,
  lastUpdated: "2026-04-30",
  tags: ["lld", "search-page", "filters", "facets", "url-state", "react"],
  relatedTopics: [
    "search-autocomplete",
    "full-text-search-ui",
    "saved-views-filters-system",
    "data-table",
  ],
};

export default function SearchPageFiltersFacetsURLSyncArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a search page that combines
          query, filters, facets, sort, and pagination
          into a coherent, URL-shareable view. The page
          is the canonical pattern for any non-trivial
          search experience: e-commerce product search,
          documentation search, real estate listings,
          job boards, ticket queues. The hard problems
          come from composition: each piece is
          relatively simple, but coordinating them so
          state stays consistent, URLs stay shareable,
          and history navigation works correctly is
          where it gets interesting.
        </p>
        <p>
          The hard problems are: URL state encoding
          that&rsquo;s human-readable and
          back-button-safe; reconciling URL changes
          (browser nav, deep link) with internal state;
          batched fetch on multiple state changes (don&rsquo;t
          fire 5 fetches when the user changes 5
          filters at once); responsive layout (facets
          collapse on mobile); preserving scroll
          position on filter change vs new query;
          accessibility for the dynamic filtered view.
        </p>

        <h3>User Context</h3>
        <p>
          End users browse-and-narrow: enter a query,
          apply filters, sort, paginate, share the URL
          with colleagues. Power users craft URLs
          directly (e.g. for bookmarks). Engineering
          teams plug in: provide the search backend
          (query + facets), the filter schema, the
          page wires it into a coherent experience.
        </p>

        <h3>Assumptions</h3>
        <p>
          Backend supports query + filters + sort +
          pagination + facets in a single request.
          The Full-text Search UI primitives are
          available. Modern browsers; we use the
          History API for URL updates. Routing
          framework (Next.js router) integrates.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the search backend. We
          do not implement individual primitive
          components (autocomplete, paginator) —
          we compose them. We do not implement
          analytics tracking; we expose hooks.
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Query input (with optional autocomplete).
          Filters (typed: text, select, multi-select,
          range, date range). Facets sidebar with
          counts. Sort options. Pagination. URL state
          for everything. Browser back/forward
          navigates state correctly. Deep links work
          from external sources. Loading state during
          fetch. Empty state when no results. Result
          count display. Filter clear (per-filter and
          clear-all). Mobile-responsive layout.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Saved searches (named presets via the Saved
          Views system). Recent searches. Filter
          autocomplete (search within a multi-select
          facet&rsquo;s values). Active filter chips
          at the top of results. Pinned filters
          (some always visible). Quick-filter buttons
          (one-click common filters). Real-time
          updates (results refresh as backend data
          changes).
        </p>

        <h3>Out of Scope</h3>
        <p>
          The search backend, individual primitive
          components.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Filter changes batched: changing 3 filters
          rapidly fires one search, not three.
          Initial render under 200 ms. Search
          response under 500 ms typical.
        </p>

        <h3>Reliability</h3>
        <p>
          URL is the source of truth; internal
          state never diverges. Stale searches don&rsquo;t
          render (token race protection). Browser
          history navigation always reflects URL.
        </p>

        <h3>Security</h3>
        <p>
          Filter values escape into queries safely
          server-side. Server-enforced authorization.
          User input rate-limited.
        </p>

        <h3>Accessibility</h3>
        <p>
          Filter controls are real form fields with
          labels. Live region announces result counts
          and pagination changes. Mobile facets
          accessible via a panel. Skip-to-results
          link.
        </p>

        <h3>Maintainability</h3>
        <p>
          Filter schema declarative. URL serialization
          uses a small library function (not ad-hoc
          per filter). Backend adapter pattern.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The page is structured as a <strong>state
          coordinator</strong> that owns the unified
          search state (query, filters, sort, page),
          a <strong>URL bridge</strong> that
          serializes/deserializes that state to/from
          URL parameters, and a <strong>fetch
          orchestrator</strong> that batches state
          changes into a single search request. The
          UI components (QueryInput, FacetsSidebar,
          SortControl, Paginator, ResultsList) read
          state via selector hooks and dispatch state
          updates.
        </p>
        <p>
          The <strong>state coordinator</strong> holds
          the canonical search state. State updates
          (e.g. user selects a facet value) go through
          a single dispatcher. The dispatcher batches
          rapid updates within a tick (microtask) so
          one state change followed quickly by
          another results in one URL update and one
          fetch. This batching is what prevents the
          &ldquo;5 filters changed = 5 fetches&rdquo;
          bug.
        </p>
        <p>
          The <strong>URL bridge</strong> serializes
          state to URL parameters and parses URL
          parameters into state. Serialization rules:
          query as <code>q=</code>; multi-select facets
          as repeating params (e.g.
          <code> type=article&amp;type=video</code>);
          single-select facets as one param; range
          filters as
          <code> price_min</code>/
          <code> price_max</code>; sort as
          <code> sort=</code>; page as
          <code> page=</code>. Defaults (query empty,
          no filters, default sort, page 1) are
          omitted from URL for cleanliness. On URL
          change (initial load, browser back/forward),
          parse and seed state.
        </p>
        <p>
          The <strong>fetch orchestrator</strong> watches
          state and fires a search request when
          state changes (excluding cosmetic changes
          like UI panel open). Tokens prevent stale
          responses. Skeleton results render during
          loading. On response, update results,
          facet counts, total count.
        </p>
        <p>
          On <strong>query change</strong>: page resets
          to 1 (a new query starts at the top). Sort
          may reset to default (or preserve, depending
          on product). Filters preserve (so users can
          search within the same filter set).
        </p>
        <p>
          On <strong>filter change</strong>: page resets
          to 1; query and sort preserve. Facet counts
          update from the response (showing how many
          results would remain if each value were
          selected).
        </p>
        <p>
          On <strong>sort change</strong>: page may
          preserve or reset to 1 depending on
          product. Filters and query preserve.
        </p>
        <p>
          On <strong>pagination</strong>: only page
          changes; everything else preserves. Scroll
          to top of results on page change.
        </p>
        <p>
          On <strong>browser back/forward</strong>: URL
          changes; the URL bridge parses new state
          and the coordinator updates. The fetch
          orchestrator fires a new search if needed
          (or, if results are cached, restores from
          cache).
        </p>
        <p>
          <strong>Active filter chips</strong>: at the
          top of results, each active filter shows
          as a chip with a clear button. Clicking
          the chip&rsquo;s X removes that filter.
          Clear All clears everything.
        </p>
        <p>
          <strong>Mobile layout</strong>: facets
          collapse into a slide-in panel triggered
          by a Filter button. The button shows the
          active filter count. The panel has Apply
          and Cancel buttons (apply commits all
          changes at once; cancel reverts to the
          state before opening).
        </p>
        <p>
          <strong>Result preservation</strong>: while
          a new search is in flight, the previous
          results stay visible (with a subtle dim
          and skeleton overlay). This preserves
          context — users don&rsquo;t see a flash of
          empty content. On response, results
          update.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>SearchPageProvider</strong>{" "}
          instantiates the coordinator, URL bridge,
          fetch orchestrator.
          <strong> QueryInput</strong> for query
          entry. <strong>FacetsSidebar</strong>{" "}
          renders facets. <strong>SortControl</strong>{" "}
          renders sort. <strong>Paginator</strong>{" "}
          renders pagination.
          <strong> ResultsList</strong> renders
          results. <strong>ActiveFilterChips</strong>{" "}
          renders active filter chips.
          <strong> MobileFiltersPanel</strong> for
          mobile.
          <strong> URLBridge</strong> handles URL
          serialization.
          <strong> StateCoordinator</strong> owns
          state.
          <strong> FetchOrchestrator</strong> handles
          requests with batching and tokens.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          State coordinator holds query, filters,
          sort, page in a single store. UI components
          subscribe via selectors. URL bridge mirrors
          the store to URL parameters and vice versa.
          Fetch orchestrator&rsquo;s state (loading,
          error, results) is its own slice.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Filter schema:{" "}
          <code>{` { name, type, urlKey, options? } `}</code>.
          Backend contract: takes
          <code>{` { query, filters, sort, page } `}</code>{" "}
          returns
          <code>{` { results, facets, total } `}</code>.
          URL serialization rules per filter type
          documented and consistent.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          State change batching prevents fetch
          spam. Token-based race protection.
          Result preservation during load avoids
          flicker. Memoized result list. Cached
          recent searches for back-navigation.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Clear active-filter visibility (chips at
          top, checkboxes in sidebar). Filter clear
          buttons everywhere they make sense.
          Skeleton loading. Empty state with
          remediation suggestions
          (&ldquo;No results. Try removing a
          filter.&rdquo;). Result preservation
          during load. Mobile-first responsive
          layout. URL is human-readable
          (<code>?type=article&amp;sort=newest</code>,
          not encoded blobs).
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Filter controls are real form fields.
          Result list is a proper list. Result
          count and pagination announce via live
          region. Mobile filter panel is a modal
          dialog with focus trap. Skip-to-results
          link. Keyboard navigation throughout.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Filter values escape into backend queries
          safely (parameterized, not interpolated).
          Server-enforced authorization filters
          results. URL parameters validated on
          parse (unknown values dropped, malformed
          ranges clamped).
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for URL serialization round-
          trip. State batching tests. Integration
          tests: change filters, verify single
          fetch; deep link from URL, verify state
          and results. Browser back/forward tests.
          Mobile filter panel tests. Accessibility
          tests for live region and focus
          management.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Deep link with invalid filter values:
          drop unknown values, surface a banner.
          Many filters selected: URL gets long but
          still functional. Mobile user changes
          filters with apply: state updates
          atomically. Browser back from page 5 to
          page 1: state and scroll restore.
          Concurrent filter changes from external
          source (e.g. saved views): handle as
          atomic state replacement. Server returns
          unexpected facet structure: gracefully
          handle (don&rsquo;t crash). User shares
          URL containing personal filters (e.g.
          their saved views): server-side
          authorization handles ownership.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          The coordinator + URL bridge + orchestrator
          pattern works for any search-like page.
          Filter schema is declarative. Backend
          adapter pluggable. The Saved Views system
          composes naturally on top.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Filter labels via i18n. Sort option
          labels via i18n. Result count formatted
          via Intl. RTL via CSS logical
          properties.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>URL state vs in-memory only</h3>
        <p>
          URL state gives shareability, refresh
          safety, browser back/forward. In-memory
          loses all of those. URL is essential
          for any real search page.
        </p>

        <h3>Batched fetch vs immediate per change</h3>
        <p>
          Batching prevents fetch spam when users
          change multiple filters quickly. Immediate
          per-change is simpler but wastes requests.
          We always batch with a microtask.
        </p>

        <h3>Apply button vs auto-apply</h3>
        <p>
          Auto-apply (each filter change immediately
          fires a search) is fast and intuitive on
          desktop. Apply button (changes accumulate,
          fire on Apply) is right for mobile (so
          users don&rsquo;t fire many searches by
          accident in a small viewport). We default
          auto-apply on desktop, apply-button on
          mobile.
        </p>

        <h3>Result preservation during load</h3>
        <p>
          Preserving previous results during load
          maintains context; flashing to empty is
          jarring. We always preserve.
        </p>

        <h3>Human-readable URLs vs encoded</h3>
        <p>
          Human-readable
          (<code>?type=article&amp;sort=newest</code>)
          is better for sharing, debugging, and
          power users. Encoded blobs hide state
          but are less useful. Human-readable wins
          for typical use cases.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          AI-suggested filters based on query.
          Personalized default filters. Saved-
          search alerts (notify when results
          change). Smart facet ranking (most
          useful facets first). Visual filter
          presets (one-click common combinations).
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why URL state?</strong> Shareable
          searches, refresh-safe state, browser
          back/forward navigation. Users expect
          search URLs to behave like Google&rsquo;s.
        </p>

        <p>
          <strong>2. How do you batch state
          changes?</strong> Microtask-batching: state
          updates within a tick coalesce. After
          the tick, the URL updates once and one
          fetch fires.
        </p>

        <p>
          <strong>3. What resets page on filter
          change?</strong> Page resets to 1 (a new
          filter set typically wants the start of
          results). Query and sort preserve unless
          the product specifies otherwise.
        </p>

        <p>
          <strong>4. How does mobile filter UX
          differ?</strong> Facets collapse into a
          slide-in panel with Apply/Cancel buttons.
          State changes accumulate locally; Apply
          commits and fires search. This avoids
          accidental multiple searches in a small
          viewport.
        </p>

        <p>
          <strong>5. How do you avoid flashing empty
          state during load?</strong> Result
          preservation: previous results stay
          visible (dimmed) during load. On response,
          results update. Skeletons overlay rather
          than replace.
        </p>

        <p>
          <strong>6. How is the URL parsed on deep
          link?</strong> The URL bridge reads
          parameters per the filter schema, validates
          values, drops unknowns, seeds the state
          coordinator. The fetch orchestrator then
          fires a search.
        </p>

        <p>
          <strong>7. How do you prevent stale
          responses?</strong> Token-based race
          protection. Each fetch carries a token;
          response only renders if its token is
          current.
        </p>

        <p>
          <strong>8. How do you compose with Saved
          Views?</strong> Saved Views capture the
          current state (query, filters, sort,
          page) into a named preset. Applying a
          view sets the state via the coordinator
          (which updates URL and triggers fetch).
          The state shape is the same; views are a
          thin layer on top.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A search page composes{" "}
          <strong>query + filters + facets + sort +
          pagination</strong> with URL as the source
          of truth. The state coordinator unifies
          state; the URL bridge serializes; the
          fetch orchestrator batches and races
          protect. Result preservation during load
          maintains context. Mobile uses an
          Apply-pattern panel to avoid accidental
          searches. The result is a search
          experience that feels native to the web —
          shareable, refresh-safe, navigable, and
          accessible.
        </p>
      </section>
    </ArticleLayout>
  );
}
