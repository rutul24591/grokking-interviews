"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-full-text-search-ui",
  title: "Design a Full-text Search UI",
  description:
    "LLD for a full-text search UI: query parsing, snippet rendering with highlights, faceted filters, sorting, pagination, accessibility.",
  category: "low-level-design",
  subcategory: "search-discovery",
  slug: "full-text-search-ui",
  wordCount: 6500,
  readingTime: 34,
  lastUpdated: "2026-04-30",
  tags: ["lld", "full-text-search", "snippets", "facets", "react"],
  relatedTopics: [
    "search-autocomplete",
    "rag-based-search-ui",
    "search-page-filters-facets-url-sync",
  ],
};

export default function FullTextSearchUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a full-text search UI — the
          interface where users enter a query and see
          ranked results from a search backend
          (Elasticsearch, Algolia, Typesense, OpenSearch,
          or a custom Lucene-style index). Each result
          shows a title, a snippet with highlighted
          query terms, metadata (date, author, type),
          and a link or action. The UI handles query
          syntax (boolean operators, phrase quotes,
          field-specific search), facets (filter
          by category, date range, etc.), sort
          (relevance, date, popularity), and
          pagination.
        </p>
        <p>
          The hard problems are: parsing user query
          syntax leniently (users mistype operators,
          forget close-quotes); rendering snippets with
          highlighted terms even when the snippet was
          server-generated with embedded markers;
          composing facets and sort with the query in
          a URL-shareable state; pagination over
          potentially millions of results; and
          accessibility for the dynamic results view.
        </p>

        <h3>User Context</h3>
        <p>
          End users search for content — articles,
          documentation, help center, products, internal
          knowledge. They expect Google-like fluency:
          relevant results fast, snippets that show why
          a result matched, filters to narrow down. Power
          users use query syntax (quotes for phrases,
          boolean operators).
        </p>

        <h3>Assumptions</h3>
        <p>
          Backend exposes a search API returning ranked
          results with snippet text containing
          server-generated highlight markers (typically
          <code> &lt;em&gt;</code> tags around matched
          terms). Facets returned with their counts.
          Pagination is offset-based or cursor-based.
          Modern browsers; URL fragments or query
          parameters for state sync.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the search backend. We
          do not implement RAG / semantic search
          (separate). We do not implement the
          autocomplete (separate; can compose).
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Query input that submits on Enter or via a
          Search button. Results list with title,
          snippet (highlighted matches), metadata,
          and link. Pagination (Next/Prev or Load
          More). Facets sidebar with filters per
          available facet (category, date, author,
          type) including counts. Sort options
          (relevance, date asc/desc, popularity).
          URL sync of query, facets, sort, and page
          for shareability and refresh-safety.
          Empty state, loading state, error state.
          Result count display
          (&ldquo;1,234 results&rdquo;). Did-you-mean
          / spell correction suggestion.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Query syntax help (a tooltip or modal
          explaining quotes, AND, OR, etc.). Saved
          searches. Search history. Click-tracking
          for relevance tuning. Export results.
          Faceted drill-down (click a facet, narrow).
          Typo tolerance with feedback (&ldquo;showing
          results for X. Search instead for [original
          query]&rdquo;). Per-field weighting controls
          for power users. Real-time results
          (results update as you type, beyond
          autocomplete).
        </p>

        <h3>Out of Scope</h3>
        <p>
          Backend ranking algorithms, the search
          autocomplete, click-tracking analytics
          backend.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Search submission to results under 500 ms
          for typical queries. Facet expand/collapse
          instant. Pagination under 300 ms.
        </p>

        <h3>Reliability</h3>
        <p>
          Stale responses don&rsquo;t render; token
          races. Network failures show inline error
          with retry. URL state always reflects
          current query.
        </p>

        <h3>Security</h3>
        <p>
          Snippet HTML sanitized (server-supplied
          highlight markers preserved, anything else
          stripped). Server-enforced authorization
          (results filtered by user permissions).
        </p>

        <h3>Accessibility</h3>
        <p>
          Result list as a proper list. Each result
          is a focusable region. Pagination buttons
          have labels. Facet checkboxes accessible.
          Live region announces result count and
          pagination changes.
        </p>

        <h3>Maintainability</h3>
        <p>
          Backend adapter pattern (Elasticsearch,
          Algolia, custom). Renderers consumer-
          supplied for results and facets. URL sync
          via a small reusable hook.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The UI has four parts: <strong>query
          parser</strong>, <strong>backend adapter</strong>,
          <strong> URL state sync</strong>, and
          <strong> results + facets renderer</strong>.
          Each is independent; together they form the
          search experience.
        </p>
        <p>
          The <strong>query parser</strong> is intentionally
          forgiving — most users don&rsquo;t use
          formal syntax. We treat the whole query
          string as a phrase by default, with
          recognition of double-quotes for explicit
          phrases, common operators (AND, OR, NOT)
          when typed in caps, and field syntax
          (<code>title:react</code>) when the field
          is recognized. The parser produces a
          structured query object the backend
          adapter understands.
        </p>
        <p>
          The <strong>backend adapter</strong> takes
          the structured query, facet selections,
          sort, and page; calls the backend; returns
          results plus facet counts plus total count.
          Different backends (Elasticsearch, Algolia,
          Typesense) have different query DSLs; the
          adapter abstracts.
        </p>
        <p>
          <strong>URL sync</strong> writes query,
          facets, sort, and page to URL parameters
          (e.g.{" "}
          <code>?q=react+hooks&amp;type=article&amp;sort=relevance&amp;page=2</code>).
          On mount, parse the URL and seed state.
          On state change, push or replace URL via
          the router. This makes searches shareable
          and refresh-safe.
        </p>
        <p>
          <strong>Results rendering</strong>: each
          result has title (rendered as a link),
          snippet (with highlighted matches),
          metadata (date, author). Snippets come
          from the backend with highlight markers
          (typically <code>&lt;em&gt;</code> wrapping
          matched terms). We sanitize via DOMPurify
          allowing only the highlight tag, then
          render as HTML. Click-tracking sends an
          analytics event before navigating.
        </p>
        <p>
          <strong>Facets sidebar</strong>: each facet
          shows its values with counts. Users
          select values via checkboxes; selections
          go into the URL state and trigger a
          new search. Facets re-render with new
          counts on response. Multi-value selection
          within a facet is OR; cross-facet is AND
          (typical search faceting semantics).
          Showing &ldquo;more&rdquo; when a facet
          has many values, with a search-within-
          facet input.
        </p>
        <p>
          <strong>Pagination</strong>: integrates with
          the Cursor-based Pagination UI subsystem
          for cursor-based backends or implements a
          simple offset-based UI for offset
          backends. Page changes update URL and
          fire a new search.
        </p>
        <p>
          <strong>Sort</strong>: a dropdown with
          options (Relevance, Newest, Oldest,
          Popularity). Selecting updates URL and
          triggers a new search.
        </p>
        <p>
          <strong>Did-you-mean</strong>: backend
          returns a corrected query suggestion when
          confidence is high. We surface it as
          &ldquo;Did you mean: [suggested]?&rdquo;
          (clickable to apply) plus, when typo
          tolerance kicks in, &ldquo;Showing results
          for X. Search instead for [original]&rdquo;.
        </p>
        <p>
          <strong>State machine</strong>: the search
          UI has states {`{ idle, loading, success,
          error, empty }`} plus the per-page state
          for pagination. Transitions are
          deterministic: query change → loading;
          response → success or empty or error.
          Loading states show skeletons matching
          the result layout for cumulative-layout-
          shift-free experience.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>SearchProvider</strong> instantiates
          parser, backend adapter, URL sync.
          <strong> SearchInput</strong> is the query
          input (optionally with autocomplete).
          <strong> ResultsList</strong> renders
          results. <strong>ResultCard</strong>{" "}
          renders one result.
          <strong> FacetsSidebar</strong> renders
          facets. <strong>SortControl</strong> renders
          sort dropdown. <strong>Paginator</strong>{" "}
          renders pagination.
          <strong> SnippetRenderer</strong> handles
          highlighted snippet rendering with
          sanitization.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Query, facet selections, sort, page,
          loading state, results, facet counts,
          error — all in URL-synced state.
          External store mirrors URL; URL is the
          source of truth.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Query API: input string + facets + sort +
          page → results, facet counts, total count,
          did-you-mean. Result shape:
          <code>{` { id, title, url, snippet, metadata } `}</code>.
          Facet shape:{" "}
          <code>{` { name, label, values: [{ value, count }] } `}</code>.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Token-based race protection on searches.
          Skeleton loading. Cache recent searches
          for instant back-navigation.
          ResultsList items memoized. Facet expand
          state is local (no re-search needed).
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Search input prominent at top. Results
          below or in main column with facets
          sidebar. Result count and active filters
          visible. Skeleton loading. Empty state
          with helpful suggestions. Sort and
          pagination at the top and bottom of
          results for power users.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Result list with proper roles. Each
          result&rsquo;s title is a real link.
          Facet checkboxes accessible. Live region
          announces result count and pagination.
          Keyboard navigation through results
          (Tab works naturally with the link
          structure). Skip to results from the
          search input via a skip link.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Snippet HTML sanitized via DOMPurify
          allowing only highlight markers. Server-
          enforced authorization on results.
          User-entered queries treated as input,
          not interpolated into server queries
          unsafely.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the query parser
          (representative inputs including malformed).
          Integration tests with mock backend:
          search, facet selection, pagination, sort.
          URL sync correctness. Accessibility
          tests for result list and facets.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Empty query: don&rsquo;t search; show
          empty state. Query with malformed quotes:
          parser falls back to phrase search.
          Facet selection that returns zero
          results: surface the empty state with
          helpful filter-clear actions. Pagination
          past total: clamp. Backend timeout:
          surface error with retry. Backend returns
          stale facet counts: usually self-correcting
          on next search. Server-side authorization
          changes mid-session: a result the user
          can no longer access shows access-denied
          on click; we update on next search.
          Very long query: truncate or limit
          input length.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Adapter for any search backend. Result
          and facet renderers per product. The same
          UI handles documentation search, help
          center, product search, knowledge base.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          UI strings via i18n. Locale-aware sort.
          Backend handles language-specific
          analyzers (stemming, etc.). Query
          highlighting works on Unicode.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Lenient vs strict query parser</h3>
        <p>
          Lenient (treat as phrase by default) is
          right for casual users. Strict (formal
          syntax required) is right for power tools.
          We default to lenient with optional
          syntax recognition.
        </p>

        <h3>Server-side vs client-side highlighting</h3>
        <p>
          Server-side knows the analyzer (stemming,
          synonyms) and produces accurate
          highlights. Client-side substring matching
          misses stemming. We use server-side
          highlights with client-side sanitization.
        </p>

        <h3>URL state vs in-memory only</h3>
        <p>
          URL state makes searches shareable and
          refresh-safe. In-memory is simpler but
          loses these features. URL is the right
          default.
        </p>

        <h3>Facets always visible vs collapsible</h3>
        <p>
          Always visible aids discovery; collapsible
          saves space on mobile. Hybrid: visible on
          desktop, collapsed-by-default on mobile.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Semantic / RAG-augmented search merging
          full-text and embedding-based results.
          Personalized ranking. Query suggestions
          based on usage. Visual search (image
          query). Saved searches with email alerts.
          A/B testing of ranking experiments.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why URL-sync search state?</strong>{" "}
          Shareability, refresh safety, browser
          back/forward. Users expect search URLs to
          work like Google&rsquo;s.
        </p>

        <p>
          <strong>2. How do snippets get
          highlighted?</strong> Backend returns
          snippets with highlight markers
          (e.g.
          <code> &lt;em&gt;</code>). We sanitize
          allowing only those markers, then render
          as HTML. Server-side highlighting is
          accurate (knows the analyzer).
        </p>

        <p>
          <strong>3. How does facet selection
          work?</strong> Multi-value within a facet
          is OR; cross-facet is AND. Selections
          encode in URL; trigger new search; new
          counts come back with results.
        </p>

        <p>
          <strong>4. How is the query parsed?</strong>{" "}
          Lenient by default — treat as phrase.
          Recognize quotes, operators (AND, OR,
          NOT) when explicit, field syntax for
          known fields. Produce structured query
          for the backend adapter.
        </p>

        <p>
          <strong>5. How do you handle pagination at
          high offsets?</strong> Cursor-based
          backends (preferred for large result
          sets); offset-based for small. The
          adapter abstracts; the UI works with
          either.
        </p>

        <p>
          <strong>6. How does did-you-mean work?</strong>{" "}
          Backend returns a corrected suggestion
          when confidence is high. UI surfaces it
          as clickable. Typo tolerance shows
          &ldquo;Showing results for X. Search
          instead for [original]&rdquo;.
        </p>

        <p>
          <strong>7. How do you prevent stale
          results?</strong> Token-based race
          protection on every search request. Stale
          tokens discard.
        </p>

        <p>
          <strong>8. How is the UI accessible?</strong>{" "}
          Result list with proper roles. Real links
          for navigation. Facet checkboxes labeled.
          Live region announces counts and
          changes. Skip-to-results link.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A full-text search UI is{" "}
          <strong>query parser + backend adapter +
          URL state + results/facets renderer</strong>.
          Server-side highlighting drives accurate
          snippets. URL state makes searches
          shareable. Facets compose with query and
          sort cleanly. Did-you-mean surfaces
          backend corrections. The adapter pattern
          works across Elasticsearch, Algolia,
          Typesense, and custom backends.
        </p>
      </section>
    </ArticleLayout>
  );
}
