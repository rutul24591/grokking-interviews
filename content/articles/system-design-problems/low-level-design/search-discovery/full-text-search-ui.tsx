"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
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
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: parsing user query
          syntax leniently (users mistype operators,
          forget close-quotes); rendering snippets with
          highlighted terms even when the snippet was
          server-generated with embedded markers;
          composing facets and sort with the query in
          a URL-shareable state; pagination over
          potentially millions of results; and
          accessibility for the dynamic results view.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users search for content — articles,
          documentation, help center, products, internal
          knowledge. They expect Google-like fluency:
          relevant results fast, snippets that show why
          a result matched, filters to narrow down. Power
          users use query syntax (quotes for phrases,
          boolean operators).
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend exposes a search API returning ranked
          results with snippet text containing
          server-generated highlight markers (typically
          <code> &lt;em&gt;</code> tags around matched
          terms). Facets returned with their counts.
          Pagination is offset-based or cursor-based.
          Modern browsers; URL fragments or query
          parameters for state sync.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the search backend. We
          do not implement RAG / semantic search
          (separate). We do not implement the
          autocomplete (separate; can compose).
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Backend ranking algorithms, the search
          autocomplete, click-tracking analytics
          backend.
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Search submission to results under 500 ms
          for typical queries. Facet expand/collapse
          instant. Pagination under 300 ms.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Stale responses don&rsquo;t render; token
          races. Network failures show inline error
          with retry. URL state always reflects
          current query.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Snippet HTML sanitized (server-supplied
          highlight markers preserved, anything else
          stripped). Server-enforced authorization
          (results filtered by user permissions).
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Result list as a proper list. Each result
          is a focusable region. Pagination buttons
          have labels. Facet checkboxes accessible.
          Live region announces result count and
          pagination changes.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Backend adapter pattern (Elasticsearch,
          Algolia, custom). Renderers consumer-
          supplied for results and facets. URL sync
          via a small reusable hook.
        </HighlightBlock>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/search-discovery/full-text-search-ui-architecture.svg"
          alt="Full-text search UI architecture showing search state model, query builder, input debounce, fetch with AbortController, result card with highlights, facet filter panel, highlight XSS-safe rendering, and pagination with cursor support"
          caption="Architecture Overview"
        />
        <p>
          The UI has four parts: <strong>query
          parser</strong>, <strong>backend adapter</strong>,
          <strong> URL state sync</strong>, and
          <strong> results + facets renderer</strong>.
          Each is independent; together they form the
          search experience.
        </p>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Pagination</strong>: integrates with
          the Cursor-based Pagination UI subsystem
          for cursor-based backends or implements a
          simple offset-based UI for offset
          backends. Page changes update URL and
          fire a new search.
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="crucial">
          <strong>State machine</strong>: the search
          UI has states {`{ idle, loading, success,
          error, empty }`} plus the per-page state
          for pagination. Transitions are
          deterministic: query change → loading;
          response → success or empty or error.
          Loading states show skeletons matching
          the result layout for cumulative-layout-
          shift-free experience.
        </HighlightBlock>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> FacetsSidebar</strong></Highlight> renders
          facets. <strong>SortControl</strong> renders
          sort dropdown. <strong>Paginator</strong>{" "}</HighlightBlock>
<HighlightBlock as="p" tier="crucial">renders pagination.
          <strong> SnippetRenderer</strong> handles
          highlighted snippet rendering with
          sanitization.</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Query, facet selections, sort, page,
          loading state, results, facet counts,
          <Highlight tier="important">error — all in URL-synced state.</Highlight>
          External store mirrors URL; URL is the
          source of truth.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="crucial">Query API: input string + facets + sort +
          page → results, facet counts, total count,</HighlightBlock>
<HighlightBlock as="p" tier="important">did-you-mean. Result shape:
          <code>{` { id, title, url, snippet, metadata } `}</code>.</HighlightBlock>
<HighlightBlock as="p" tier="important">Facet shape:{" "}
          <code>{` { name, label, values: [{ value, count }] } `}</code>.</HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Token-based race protection on searches.
          Skeleton loading. Cache recent <Highlight tier="important">searches
          for instant back-navigation.
          ResultsList items</Highlight> memoized. Facet expand
          state is local (no re-search needed).
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="important">Skeleton loading. Empty state
          with helpful suggestions. Sort and</HighlightBlock>
<HighlightBlock as="p" tier="crucial"><Highlight tier="important">pagination at the top and bottom of
          results for power users.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Keyboard navigation through results
          (Tab works naturally with the link</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">structure). Skip to results from the
          search input via a skip link.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="crucial">Snippet HTML sanitized via DOMPurify
          allowing only highlight markers.</HighlightBlock>
<HighlightBlock as="p" tier="important">Server-
          enforced authorization on results.
          User-entered queries</HighlightBlock>
<HighlightBlock as="p" tier="important">treated as input,
          not interpolated into server queries
          unsafely.</HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="crucial">Unit tests for the query parser
          (representative inputs including malformed).</HighlightBlock>
<HighlightBlock as="p" tier="important">Integration tests with mock backend:
          search, facet selection, pagination, sort.</HighlightBlock>
<HighlightBlock as="p" tier="important">URL sync correctness. Accessibility
          tests for result list and facets.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Backend returns
          stale facet counts: usually self-correcting
          on next search. Server-side authorization
          changes mid-session: a result the</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">user
          can no longer access shows access-denied
          on click; we update on next search.
          Very long query: truncate or limit
          input length.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Adapter for any search backend. Result
          and facet <Highlight tier="important">renderers per product. The same
          UI</Highlight> handles documentation search, help
          center, product search, knowledge base.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings via i18n. Locale-aware <Highlight tier="important">sort.
          Backend handles language-specific
          analyzers (stemming,</Highlight> etc.). Query
          highlighting works on Unicode.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Lenient vs strict query parser</h3>
        <HighlightBlock as="p" tier="important">
          Lenient (treat as phrase by default) is
          right for casual users. Strict (formal
          syntax required) is right for power tools.
          We default to lenient with optional
          syntax recognition.
        </HighlightBlock>

        <h3>Server-side vs client-side highlighting</h3>
        <HighlightBlock as="p" tier="important">
          Server-side knows the analyzer (stemming,
          synonyms) and produces accurate
          highlights. Client-side substring matching
          misses stemming. We use server-side
          highlights with client-side sanitization.
        </HighlightBlock>

        <h3>URL state vs in-memory only</h3>
        <HighlightBlock as="p" tier="crucial">
          URL state makes searches shareable and
          refresh-safe. In-memory is simpler but
          loses these features. URL is the right
          default.
        </HighlightBlock>

        <h3>Facets always visible vs collapsible</h3>
        <HighlightBlock as="p" tier="important">
          Always visible aids discovery; collapsible
          saves space on mobile. Hybrid: visible on
          desktop, collapsed-by-default on mobile.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="crucial">Query suggestions
          based on usage. Visual search (image
          query).</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Saved searches with email alerts.
          A/B testing of ranking experiments.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. Why URL-sync search state?</strong>{" "}
          Shareability, refresh safety, browser
          back/forward. Users expect search URLs to
          work like Google&rsquo;s.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>2. How do snippets get
          highlighted?</strong> Backend returns
          snippets with highlight markers
          (e.g.
          <code> &lt;em&gt;</code>). We sanitize
          allowing only those markers, then render
          as HTML. Server-side highlighting is
          accurate (knows the analyzer).
        </HighlightBlock>

        <p>
          <strong>3. How does facet selection
          work?</strong> Multi-value within a facet
          is OR; cross-facet is AND. Selections
          encode in URL; trigger new search; new
          counts come back with results.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>4. How is the query parsed?</strong>{" "}
          Lenient by default — treat as phrase.
          Recognize quotes, operators (AND, OR,
          NOT) when explicit, field syntax for
          known fields. Produce structured query
          for the backend adapter.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>5. How do you handle pagination at
          high offsets?</strong> Cursor-based
          backends (preferred for large result
          sets); offset-based for small. The
          adapter abstracts; the UI works with
          either.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>6. How does did-you-mean work?</strong>{" "}
          Backend returns a corrected suggestion
          when confidence is high. UI surfaces it
          as clickable. Typo tolerance shows
          &ldquo;Showing results for X. Search
          instead for [original]&rdquo;.
        </HighlightBlock>

        <p>
          <strong>7. How do you prevent stale
          results?</strong> Token-based race
          protection on every search request. Stale
          tokens discard.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>8. How is the UI accessible?</strong>{" "}
          Result list with proper roles. Real links
          for navigation. Facet checkboxes labeled.
          Live region announces counts and
          changes. Skip-to-results link.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">Facets compose with query and
          sort cleanly. Did-you-mean surfaces
          backend corrections.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">The adapter pattern
          works across Elasticsearch, Algolia,
          Typesense, and custom backends.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
