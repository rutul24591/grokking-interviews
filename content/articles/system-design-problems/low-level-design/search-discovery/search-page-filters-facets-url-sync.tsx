"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
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
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users browse-and-narrow: enter a query,
          apply filters, sort, paginate, share the URL
          with colleagues. Power users craft URLs
          directly (e.g. for bookmarks). Engineering
          teams plug in: provide the search backend
          (query + facets), the filter schema, the
          page wires it into a coherent experience.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend supports query + filters + sort +
          pagination + facets in a single request.
          The Full-text Search UI primitives are
          available. Modern browsers; we use the
          History API for URL updates. Routing
          framework (Next.js router) integrates.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the search backend. We
          do not implement individual primitive
          components (autocomplete, paginator) —
          we compose them. We do not implement
          analytics tracking; we expose hooks.
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Saved searches (named presets via the Saved
          Views system). Recent searches. Filter
          autocomplete (search within a multi-select
          facet&rsquo;s values). Active filter chips
          at the top of results. Pinned filters
          (some always visible). Quick-filter buttons
          (one-click common filters). Real-time
          updates (results refresh as backend data
          changes).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          The search backend, individual primitive
          components.
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Filter changes batched: changing 3 filters
          rapidly fires one search, not three.
          Initial render under 200 ms. Search
          response under 500 ms typical.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          URL is the source of truth; internal
          state never diverges. Stale searches don&rsquo;t
          render (token race protection). Browser
          history navigation always reflects URL.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Filter values escape into queries safely
          server-side. Server-enforced authorization.
          User input rate-limited.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Filter controls are real form fields with
          labels. Live region announces result counts
          and pagination changes. Mobile facets
          accessible via a panel. Skip-to-results
          link.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Filter schema declarative. URL serialization
          uses a small library function (not ad-hoc
          per filter). Backend adapter pattern.
        </HighlightBlock>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/search-discovery/search-page-filters-facets-url-sync-architecture.svg"
          alt="Search filters, facets, and URL sync architecture showing filter model, filter types, facet count request, facet accordion UI, URL base64 encoding, parse-on-mount, apply flow with debounce, and reset controls"
          caption="Architecture Overview"
        />
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
          On <strong>pagination</strong>: only page
          changes; everything else preserves. Scroll
          to top of results on page change.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          On <strong>browser back/forward</strong>: URL
          changes; the URL bridge parses new state
          and the coordinator updates. The fetch
          orchestrator fires a new search if needed
          (or, if results are cached, restores from
          cache).
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="crucial"><strong>ActiveFilterChips</strong>{" "}
          renders active filter chips.
          <strong> MobileFiltersPanel</strong> for
          mobile.
          <strong> URLBridge</strong> handles</HighlightBlock>
<HighlightBlock as="p" tier="important">URL
          serialization.
          <Highlight tier="important"><strong> StateCoordinator</strong></Highlight> owns
          state.
          <strong> FetchOrchestrator</strong> handles
          requests with batching and tokens.</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="crucial">URL bridge mirrors
          the store to URL parameters and vice versa.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Fetch orchestrator&rsquo;s state (loading,
          error, results) is its own slice.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Filter schema:</Highlight>{" "}
          <code>{` { name, type, urlKey, options? } `}</code>. Backend contract: takes{" "}
          <Highlight tier="important">
            <code>{` { query, filters, sort, page } `}</code>
          </Highlight>{" "}
          returns <code>{` { results, facets, total } `}</code>. URL serialization
          rules per filter type documented and consistent.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          State change batching prevents fetch
          spam. Token-based race <Highlight tier="important">protection.
          Result preservation during load avoids</Highlight>
          flicker. Memoized result list. Cached
          recent searches for back-navigation.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial">Try removing a
          filter.&rdquo;). Result preservation
          during load. Mobile-first responsive</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">layout. URL is human-readable
          (<code>?type=article&amp;sort=newest</code>,
          not encoded blobs).</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Filter controls are real form fields.
          Result list is a proper list. Result
          count and pagination announce via live
          region.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Mobile filter panel is a modal
          dialog with focus trap. Skip-to-results
          link. Keyboard navigation throughout.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="crucial">Filter values escape into backend queries
          safely (parameterized, not interpolated).</HighlightBlock>
<HighlightBlock as="p" tier="important">Server-enforced authorization filters
          results. URL parameters</HighlightBlock>
<HighlightBlock as="p" tier="important">validated on
          parse (unknown values dropped, malformed
          ranges clamped).</HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="crucial">Unit tests for URL serialization round-
          trip. State batching tests. Integration
          tests:</HighlightBlock>
<HighlightBlock as="p" tier="important">change filters, verify single
          fetch; deep link from URL, verify state
          and results.</HighlightBlock>
<HighlightBlock as="p" tier="important">Browser back/forward tests.
          Mobile filter panel tests. Accessibility
          tests for live region and focus
          management.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Concurrent filter changes from external
          source (e.g. saved views): handle as
          atomic state replacement. Server returns
          unexpected facet structure: gracefully</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">handle (don&rsquo;t crash). User shares
          URL containing personal filters (e.g.
          their saved views): server-side
          authorization handles ownership.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          The coordinator + URL bridge + orchestrator
          pattern works for any <Highlight tier="important">search-like page.
          Filter schema is declarative.</Highlight> Backend
          adapter pluggable. The Saved Views system
          composes naturally on top.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Filter labels via i18n. Sort option
          <Highlight tier="important">labels via i18n. Result count formatted</Highlight>
          via Intl. RTL via CSS logical
          properties.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>URL state vs in-memory only</h3>
        <HighlightBlock as="p" tier="crucial">
          URL state gives shareability, refresh
          safety, browser back/forward. In-memory
          loses all of those. URL is essential
          for any real search page.
        </HighlightBlock>

        <h3>Batched fetch vs immediate per change</h3>
        <HighlightBlock as="p" tier="important">
          Batching prevents fetch spam when users
          change multiple filters quickly. Immediate
          per-change is simpler but wastes requests.
          We always batch with a microtask.
        </HighlightBlock>

        <h3>Apply button vs auto-apply</h3>
        <HighlightBlock as="p" tier="important">
          Auto-apply (each filter change immediately
          fires a search) is fast and intuitive on
          desktop. Apply button (changes accumulate,
          fire on Apply) is right for mobile (so
          users don&rsquo;t fire many searches by
          accident in a small viewport). We default
          auto-apply on desktop, apply-button on
          mobile.
        </HighlightBlock>

        <h3>Result preservation during load</h3>
        <HighlightBlock as="p" tier="important">
          Preserving previous results during load
          maintains context; flashing to empty is
          jarring. We always preserve.
        </HighlightBlock>

        <h3>Human-readable URLs vs encoded</h3>
        <HighlightBlock as="p" tier="important">
          Human-readable
          (<code>?type=article&amp;sort=newest</code>)
          is better for sharing, debugging, and
          power users. Encoded blobs hide state
          but are less useful. Human-readable wins
          for typical use cases.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="crucial">AI-suggested filters based on query.
          Personalized default filters. Saved-
          search alerts (notify when results
          change).</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Smart facet ranking (most
          useful facets first). Visual filter
          presets (one-click common combinations).</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. Why URL state?</strong> Shareable
          searches, refresh-safe state, browser
          back/forward navigation. Users expect
          search URLs to behave like Google&rsquo;s.
        </HighlightBlock>

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

        <HighlightBlock as="p" tier="important">
          <strong>4. How does mobile filter UX
          differ?</strong> Facets collapse into a
          slide-in panel with Apply/Cancel buttons.
          State changes accumulate locally; Apply
          commits and fires search. This avoids
          accidental multiple searches in a small
          viewport.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>5. How do you avoid flashing empty
          state during load?</strong> Result
          preservation: previous results stay
          visible (dimmed) during load. On response,
          results update. Skeletons overlay rather
          than replace.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>6. How is the URL parsed on deep
          link?</strong> The URL bridge reads
          parameters per the filter schema, validates
          values, drops unknowns, seeds the state
          coordinator. The fetch orchestrator then
          fires a search.
        </HighlightBlock>

        <p>
          <strong>7. How do you prevent stale
          responses?</strong> Token-based race
          protection. Each fetch carries a token;
          response only renders if its token is
          current.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>8. How do you compose with Saved
          Views?</strong> Saved Views capture the
          current state (query, filters, sort,
          page) into a named preset. Applying a
          view sets the state via the coordinator
          (which updates URL and triggers fetch).
          The state shape is the same; views are a
          thin layer on top.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important">Result preservation during load
          maintains context. Mobile uses an
          Apply-pattern panel to avoid accidental
          searches.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="crucial">The result is a search
          experience that feels native to the web —
          shareable, refresh-safe, navigable, and
          accessible.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
