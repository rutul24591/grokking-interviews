"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-full-text-search",
  title: "Full-Text Search Libraries",
  description:
    "Deep dive into Full-Text Search Libraries covering Lunr.js, Fuse.js, FlexSearch comparison, indexing strategies, and production implementation patterns.",
  category: "frontend",
  subcategory: "search-filtering",
  slug: "full-text-search-libraries",
  wordCount: 5400,
  readingTime: 21,
  lastUpdated: "2026-04-01",
  tags: [
    "frontend",
    "full-text search",
    "lunr.js",
    "fuse.js",
    "flexsearch",
    "search libraries",
  ],
  relatedTopics: [
    "client-side-search-implementation",
    "search-debouncing",
    "search-suggestions",
  ],
};

export default function FullTextSearchLibrariesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Full-text search libraries</strong> provide client-side search
          capabilities with indexing, tokenization, stemming, and relevance
          scoring. Unlike simple string matching (array.filter), these libraries
          build inverted indexes that enable fast lookups across large datasets.
          They handle natural language search — understanding that &quot;running&quot;
          matches &quot;run&quot;, &quot;React hooks&quot; matches documents
          containing both terms, and &quot;cafe&quot; should match &quot;caf&eacute;&quot;.
        </p>
        <p>
          Three popular libraries dominate client-side full-text search:{" "}
          <strong>Lunr.js</strong> provides classic full-text search with
          stemming and field boosting. <strong>Fuse.js</strong> specializes in
          fuzzy matching for typo-tolerant search. <strong>FlexSearch</strong>{" "}
          claims 100× faster performance with configurable indexing strategies.
          Each serves different use cases — Lunr for documentation search, Fuse
          for contact lists with fuzzy matching, FlexSearch for large datasets
          requiring speed.
        </p>
        <p>
          These libraries solve fundamental search challenges: tokenization
          (splitting text into searchable terms), normalization (lowercasing,
          removing accents), stemming (reducing words to root form), stopword
          removal (ignoring common words like &quot;the&quot;, &quot;and&quot;),
          and relevance scoring (ranking results by match quality). Implementing
          these from scratch requires significant expertise in information
          retrieval — libraries provide battle-tested implementations.
        </p>
        <p>
          For staff-level engineers, library selection involves trade-offs:
          bundle size (15-25KB minified), indexing speed (important for large
          datasets), search features (fuzzy matching, field boosting, phrase
          search), and memory usage. The right choice depends on dataset size,
          search requirements, and performance constraints.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Inverted Index:</strong> The core data structure — maps
            terms to documents containing them. Instead of storing documents
            with their words, stores words with lists of document IDs. Enables
            O(1) or O(log n) lookups instead of O(n) linear scanning. All three
            libraries build inverted indexes during indexing phase.
          </li>
          <li>
            <strong>Tokenization:</strong> Splitting text into searchable terms.
            Handles punctuation, whitespace, and special characters. Lunr uses
            whitespace + punctuation splitting. Fuse allows custom tokenizers.
            FlexSearch supports multiple tokenization strategies including
            n-grams for partial matching.
          </li>
          <li>
            <strong>Stemming:</strong> Reducing words to root form —
            &quot;running&quot;, &quot;runs&quot;, &quot;ran&quot; all become
            &quot;run&quot;. Improves recall (finds more relevant results) but
            can reduce precision. Lunr includes English stemmer by default. Fuse
            and FlexSearch don&apos;t stem by default but support it via
            plugins.
          </li>
          <li>
            <strong>Fuzzy Matching:</strong> Finding results even with typos or
            variations. Uses edit distance (Levenshtein distance) to measure
            similarity. Fuse.js specializes in this — configurable fuzziness
            from 0 (exact) to 1 (very fuzzy). Lunr supports basic fuzzy matching.
            FlexSearch offers partial matching via n-grams.
          </li>
          <li>
            <strong>Field Boosting:</strong> Weighting matches in different
            fields differently. A title match should rank higher than a body
            match. All libraries support field boosting — assign weights like
            title: 3, tags: 2, body: 1. Results are scored by summing weighted
            matches.
          </li>
          <li>
            <strong>Relevance Scoring:</strong> Ranking results by match quality.
            Simple: count matching terms. Advanced: TF-IDF (term frequency ×
            inverse document frequency) weights terms by distinctiveness. BM25
            is more sophisticated. Lunr uses TF-IDF variant. Fuse uses custom
            scoring. FlexSearch uses configurable scoring.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/full-text-search/search-library-comparison.svg"
          alt="Search Library Comparison showing Lunr.js, Fuse.js, and FlexSearch feature matrix"
          caption="Library comparison — Lunr.js (classic full-text with stemming), Fuse.js (fuzzy matching specialist), FlexSearch (performance-focused with configurable indexing)"
          width={900}
          height={500}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Full-text search library architecture consists of an indexing phase
          that processes documents and builds the inverted index, and a search
          phase that queries the index and returns ranked results. The indexing
          phase is O(n) but runs once; search phase is O(1) or O(log n) per
          query.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/full-text-search/indexing-flow.svg"
          alt="Indexing Flow showing document processing through tokenization, normalization, and index building"
          caption="Indexing flow — documents are tokenized, normalized, stemmed, then added to inverted index mapping terms to document IDs with field information"
          width={900}
          height={550}
        />

        <h3>Library Architecture Comparison</h3>
        <p>
          <strong>Lunr.js</strong> follows classic search engine architecture —
          build index once, search many times. Index is serialized and can be
          saved/loaded. Supports field boosting, stemming, stopword removal.
          Index size scales with document count and vocabulary size.
        </p>
        <p>
          <strong>Fuse.js</strong> uses a simpler architecture — stores
          normalized records with searchable keys. Doesn&apos;t build a true
          inverted index, instead uses bitwise operations for fast matching.
          Excels at fuzzy matching but less efficient for large datasets.
        </p>
        <p>
          <strong>FlexSearch</strong> uses a novel context-based index — splits
          text into contexts (words, partials) and uses multiple indexes for
          different match types. Claims 100× faster than Lunr through aggressive
          optimization and parallel processing.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Library selection involves trade-offs across multiple dimensions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/search-filtering/full-text-search/library-architecture-comparison.svg"
          alt="Library Architecture Comparison showing different indexing strategies"
          caption="Architecture comparison — Lunr (inverted index, serialized), Fuse (normalized records, bitwise matching), FlexSearch (context-based, multiple indexes)"
          width={900}
          height={500}
        />

        <p className="mt-4">
          The architecture comparison diagram shows how each library approaches
          indexing differently. Lunr&apos;s inverted index is most flexible but
          largest. Fuse&apos;s bitwise matching is simplest but doesn&apos;t
          scale. FlexSearch&apos;s context-based approach offers the best
          performance but is most complex. Choose based on your dataset size
          and performance requirements.
        </p>

        <h3>Bundle Size</h3>
        <p>
          <strong>Fuse.js:</strong> ~15KB minified, ~5KB gzipped. Smallest
          footprint. Good for bundle-conscious applications.
        </p>
        <p>
          <strong>Lunr.js:</strong> ~20KB minified, ~7KB gzipped. Moderate size.
          Includes stemming and stopword lists.
        </p>
        <p>
          <strong>FlexSearch:</strong> ~25KB minified, ~8KB gzipped. Largest but
          offers most features. Can be tree-shaken for smaller bundles.
        </p>

        <h3>Performance</h3>
        <p>
          <strong>Indexing speed:</strong> FlexSearch is fastest (parallel
          processing), Lunr is moderate, Fuse is slowest for large datasets
          (no true index).
        </p>
        <p>
          <strong>Search speed:</strong> FlexSearch claims 100× faster than
          Lunr for large datasets. Fuse is fast for small datasets (&lt;10,000
          items) but degrades for larger sets.
        </p>
        <p>
          <strong>Memory usage:</strong> Lunr has highest memory usage (full
          inverted index). FlexSearch is moderate. Fuse is lowest (no index).
        </p>

        <h3>Feature Comparison</h3>
        <ul className="space-y-2">
          <li>
            <strong>Lunr.js:</strong> Full-text search, stemming, field boosting,
            phrase search, boolean operators. Best for documentation search.
          </li>
          <li>
            <strong>Fuse.js:</strong> Fuzzy matching, weighted fields, custom
            tokenizers, multi-property search. Best for typo-tolerant search.
          </li>
          <li>
            <strong>FlexSearch:</strong> Multiple index types, partial matching,
            tagging, fast updates. Best for large datasets requiring speed.
          </li>
        </ul>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Index at Build Time:</strong> For static content
            (documentation, blogs), build the index at build time and ship it
            pre-built. This eliminates indexing delay on page load. Lunr
            supports serializing indexes for this purpose.
          </li>
          <li>
            <strong>Lazy Load Search:</strong> Don&apos;t load search library
            until user interacts with search input. Code-split the library to
            reduce initial bundle size. Show a loading state while library loads.
          </li>
          <li>
            <strong>Limit Indexed Fields:</strong> Only index searchable fields.
            Don&apos;t index IDs, timestamps, or other non-searchable data.
            This reduces index size and improves search speed.
          </li>
          <li>
            <strong>Configure Fuzziness Appropriately:</strong> For Fuse.js,
            use threshold 0.3-0.4 for typo tolerance without too many false
            positives. Lower threshold (0.1-0.2) for exact matching with minor
            variations.
          </li>
          <li>
            <strong>Use Field Boosting:</strong> Boost important fields (title,
            tags) over less important ones (body, description). Typical weights:
            title 3-5×, tags 2×, body 1×.
          </li>
          <li>
            <strong>Pre-filter Large Datasets:</strong> For datasets &gt;50,000
            items, pre-filter by category or type before full-text search. This
            reduces the search space and improves performance.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Indexing on Every Render:</strong> Rebuilding the index on
            every component render is extremely slow. Build index once (in
            useEffect or useMemo) and reuse. Only rebuild when data changes.
          </li>
          <li>
            <strong>Too Much Fuzziness:</strong> High fuzziness (threshold
            &gt;0.5) returns many irrelevant results. Users searching for
            &quot;react&quot; don&apos;t want results for &quot;ract&quot; or
            &quot;reactor&quot;. Use moderate fuzziness (0.3-0.4).
          </li>
          <li>
            <strong>Ignoring Stemming:</strong> Without stemming,
            &quot;running&quot; won&apos;t match &quot;run&quot;. Enable
            stemming for better recall. Lunr includes it by default; Fuse and
            FlexSearch need configuration.
          </li>
          <li>
            <strong>Not Handling Special Characters:</strong> Searches for
            &quot;C++&quot; or &quot;.NET&quot; fail if special characters
            aren&apos;t handled. Configure tokenizer to preserve or normalize
            special characters based on your content.
          </li>
          <li>
            <strong>Searching Too Soon:</strong> Searching before index is
            fully built returns no results. Show loading state during indexing.
            For large datasets, consider progressive indexing (index in chunks).
          </li>
          <li>
            <strong>No Minimum Query Length:</strong> Single character searches
            return too many results. Enforce minimum 2-3 characters before
            searching.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Documentation Site (Lunr.js)</h3>
        <p>
          Documentation sites use Lunr.js for full-text search across hundreds
          of pages. Index is built at build time (Gatsby, Next.js), serialized,
          and loaded on page load. Provides instant search with stemming and
          field boosting (title matches rank higher).
        </p>

        <h3>Contact List (Fuse.js)</h3>
        <p>
          Contact lists benefit from Fuse.js&apos;s fuzzy matching. Users
          searching for &quot;Jhon&quot; find &quot;John&quot;, searching for
          &quot;Smth&quot; finds &quot;Smith&quot;. Multi-property search across
          name, email, and phone. Threshold 0.3-0.4 provides good typo tolerance.
        </p>

        <h3>E-Commerce Product Search (FlexSearch)</h3>
        <p>
          Large product catalogs (50,000+ items) use FlexSearch for speed.
          Partial matching enables &quot;iph&quot; to match &quot;iPhone&quot;.
          Tag-based filtering combined with text search. Fast updates when
          products are added/removed.
        </p>

        <h3>Code Search (Lunr.js)</h3>
        <p>
          Code search requires special handling — preserve case sensitivity for
          variable names, handle special characters in code. Lunr with custom
          tokenizer works well. Field boosting for filenames over content.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you choose between Lunr.js, Fuse.js, and FlexSearch?
            </p>
            <p className="mt-2 text-sm">
              A: The choice depends on requirements. Lunr.js is best for
              classic full-text search with stemming — ideal for documentation
              sites. Fuse.js excels at fuzzy matching for typo-tolerant search
              — ideal for contact lists, product search where typos are common.
              FlexSearch is best for large datasets requiring speed — claims
              100× faster than Lunr. Consider bundle size (Fuse smallest,
              FlexSearch largest), features needed (stemming, fuzzy, partial
              matching), and dataset size.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does an inverted index work and why is it faster than
              linear search?
            </p>
            <p className="mt-2 text-sm">
              A: An inverted index maps terms to document IDs instead of
              documents to terms. For example: &quot;react&quot; → [doc1, doc5,
              doc12]. This enables O(1) lookup — given a term, immediately get
              all matching documents. Linear search is O(n) — must check every
              document for the term. For 10,000 documents, inverted index is
              potentially 10,000× faster for single-term queries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle indexing large datasets without blocking the
              UI?
            </p>
            <p className="mt-2 text-sm">
              A: Several strategies: (1) Use Web Workers to run indexing in a
              background thread, keeping the main thread responsive. (2)
              Progressive indexing — index in chunks with setTimeout between
              chunks, allowing UI updates between chunks. (3) Pre-build index at
              build time for static content. (4) Server-side indexing — build
              index on server, send pre-built index to client. For datasets
              &gt;50,000 items, Web Workers or pre-building are essential.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement field boosting in full-text search?
            </p>
            <p className="mt-2 text-sm">
              A: Field boosting weights matches in different fields differently.
              In Lunr: define fields with boost values in index configuration
              (title: {'{'} boost: 3 {'}'}, body: {'{'} boost: 1 {'}'}). In Fuse: use keys
              array with weights (name: 0.7, email: 0.3). In FlexSearch: use
              document options with field weights. When scoring results, multiply
              match score by field weight — title matches contribute 3× more to
              total score than body matches.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle stemming and what are the trade-offs?
            </p>
            <p className="mt-2 text-sm">
              A: Stemming reduces words to root form — &quot;running&quot;,
              &quot;runs&quot;, &quot;ran&quot; → &quot;run&quot;. Lunr includes
              Porter stemmer by default. Fuse and FlexSearch need plugins or
              custom tokenizers. Trade-off: stemming improves recall (finds more
              relevant results) but can reduce precision (&quot;universe&quot;
              and &quot;university&quot; both stem to &quot;univers&quot;). For
              technical documentation, consider disabling stemming to avoid
              false matches.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement search result highlighting?
            </p>
            <p className="mt-2 text-sm">
              A: Most libraries return match positions or matched terms. For
              Fuse.js, use includeMatches option to get match positions. For
              Lunr, use lunr.Pipeline to track terms. Implementation: (1) Get
              matched terms/positions from search result. (2) For each result,
              find occurrences in displayed text. (3) Wrap matches in
              &lt;mark&gt; or &lt;span className=&quot;highlight&quot;&gt;. (4)
              Escape HTML to prevent XSS. Handle case-insensitive matching by
              using regex with case-insensitive flag.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://lunrjs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Lunr.js - Full-text Search for the Browser
            </a>
          </li>
          <li>
            <a
              href="https://fusejs.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Fuse.js - Lightweight Fuzzy Search Library
            </a>
          </li>
          <li>
            <a
              href="https://github.com/nextapps-de/flexsearch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              FlexSearch - Next Generation Full-text Search Library
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Search_engine_indexing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Wikipedia - Search Engine Indexing
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/TF%E2%80%93IDF"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Wikipedia - TF-IDF Scoring
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Stemming"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Wikipedia - Stemming
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
