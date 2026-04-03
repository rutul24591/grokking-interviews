"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-search-engines-complete",
  title: "Search Engines",
  description:
    "Comprehensive guide to search engines: inverted indexes, tokenization, TF-IDF/BM25 ranking, Elasticsearch/Solr, and when to use search engines vs database LIKE queries.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "search-engines",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "search", "elasticsearch", "full-text-search"],
  relatedTopics: [
    "database-indexes",
    "query-optimization-techniques",
    "sql-queries-optimization",
    "data-modeling-in-nosql",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Search Engines</h1>
        <p className="lead">
          Search engines are specialized systems for full-text search and information retrieval.
          Unlike databases (optimized for structured queries), search engines excel at
          unstructured text search. Core component: <strong>inverted index</strong> (term →
          document IDs), enabling sub-second search across millions of documents. Search engines
          tokenize text (split into words), analyze (normalize, stem, remove stop words), and
          rank results by relevance (TF-IDF, BM25). Popular search engines: Elasticsearch
          (distributed, REST API), Solr (Apache, mature), PostgreSQL full-text search (built-in,
          simpler). Search engines are essential for: e-commerce product search, content search
          (articles, blogs), log analytics (ELK stack), autocomplete, and fuzzy matching.
        </p>

        <p>
          Consider an e-commerce site with 100,000 products. Database query:
          <code className="inline-code">SELECT * FROM products WHERE name LIKE '%running
          shoes%'</code>. Performance: full table scan (5-10 seconds), no relevance ranking
          (all matches equal), no fuzzy matching (typo = no results). Search engine: index
          products, query <code className="inline-code">running shoes</code>. Performance:
          inverted index lookup (50ms), relevance ranking (best matches first), fuzzy matching
          (runing shoes → running shoes).
        </p>

        <p>
          Search engines provide: <strong>Full-text search</strong> (search within text content),
          <strong>Relevance ranking</strong> (best matches first, not just any match),
          <strong>Fuzzy matching</strong> (typos, variations), <strong>Faceted search</strong>
          (filter by category, price, etc.), <strong>Autocomplete</strong> (suggest as you
          type), <strong>Synonyms</strong> (sneakers = shoes). Databases provide:
          <strong>Structured queries</strong> (exact matches, ranges), <strong>Transactions</strong>
          (ACID guarantees), <strong>Joins</strong> (relational data). Use both: database for
          structured data, search engine for text search.
        </p>

        <p>
          This article provides a comprehensive examination of search engines: architecture
          (inverted index, tokenization, analysis), ranking algorithms (TF-IDF, BM25), popular
          engines (Elasticsearch, Solr, PostgreSQL FTS), and use cases (e-commerce, content
          search, log analytics). We'll explore when search engines excel (full-text search,
          relevance ranking, fuzzy matching) and when databases are sufficient (simple LIKE
          queries, structured data). We'll also cover best practices (custom analyzers,
          synonyms, monitoring) and common pitfalls (LIKE '%term%', no text analysis, database
          for full-text search).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/search-engines-architecture.svg`}
          caption="Figure 1: Search Engine Architecture showing Indexing Pipeline: Documents (Text Data) → Tokenizer → Analyzer → Inverted Index (Term → Document IDs with positions). Search Query Flow: User Query → Same Analysis (tokenize, normalize) → Lookup in Index + Rank Results. Key Components: Inverted Index (Term → Docs), Tokenizer (Split text), Scorer (Rank results), Analyzer (Normalize). Key characteristics: Inverted index (term → documents), tokenization (split text), analysis (normalize), scoring/ranking (relevance)."
          alt="Search engine architecture"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Inverted Index &amp; Ranking</h2>

        <h3>Inverted Index</h3>
        <p>
          <strong>Inverted index</strong> is the core data structure of search engines. Maps
          terms (words) to documents containing them. Example: Documents: Doc 1 = "the cat
          sat", Doc 2 = "the dog ran". Inverted index: <code className="inline-code">"cat"
          → [Doc 1]</code>, <code className="inline-code">"dog" → [Doc 2]</code>,
          <code className="inline-code">"the" → [Doc 1, Doc 2]</code>. Search "cat": lookup
          "cat" in index, return [Doc 1]. Performance: O(1) lookup (hash table) or O(log n)
          (tree), sub-second even for millions of documents.
        </p>

        <p>
          Inverted index stores: <strong>Term</strong> (the word), <strong>Document IDs</strong>
          (which docs contain term), <strong>Positions</strong> (where in document - for phrase
          search), <strong>Frequency</strong> (how often in document - for ranking). Benefits:
          fast lookup (O(1) or O(log n)), supports complex queries (AND, OR, phrase), enables
          ranking (term frequency, positions).
        </p>

        <h3>Tokenization &amp; Analysis</h3>
        <p>
          <strong>Tokenization</strong> splits text into terms (tokens). "The quick brown fox"
          → ["the", "quick", "brown", "fox"]. Simple split on whitespace/punctuation.
          <strong>Analysis</strong> normalizes tokens: <strong>Lowercasing</strong> ("The" →
          "the"), <strong>Stemming</strong> ("running", "runs", "ran" → "run"),
          <strong>Stop word removal</strong> (remove "the", "a", "is" - common words),
          <strong>Synonym expansion</strong> ("sneakers" → "sneakers, shoes").
        </p>

        <p>
          Analysis improves matching: "Running shoes" query matches "run shoe" document
          (stemming + lowercasing). Without analysis: no match (different words). Custom
          analyzers per domain: e-commerce (brand names, product codes), legal (Latin terms),
          medical (drug names, abbreviations).
        </p>

        <h3>Ranking: TF-IDF &amp; BM25</h3>
        <p>
          <strong>TF-IDF</strong> (Term Frequency - Inverse Document Frequency) ranks documents
          by relevance. <strong>TF</strong>: how often term appears in document (more = more
          relevant). <strong>IDF</strong>: how rare term is across all documents (rare = more
          relevant). Example: "the" appears in all docs (low IDF, not relevant). "Elasticsearch"
          appears in few docs (high IDF, very relevant). Score = TF × IDF. Higher score =
          more relevant.
        </p>

        <p>
          <strong>BM25</strong> is improved TF-IDF (modern standard). Accounts for: document
          length (long docs have higher TF naturally), term saturation (10 occurrences not 10x
          more relevant than 1). Used by: Elasticsearch, Solr, PostgreSQL FTS. Benefits: better
          ranking than TF-IDF, handles edge cases (very long/short docs).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/search-engines-indexing.svg`}
          caption="Figure 2: Search Engines Indexing and Ranking showing Inverted Index Example: Documents (Doc 1: 'the cat sat', Doc 2: 'the dog ran') → Inverted Index ('cat' → [Doc 1], 'dog' → [Doc 2]). Ranking Factors (TF-IDF, BM25): Term Frequency/TF (how often term appears in doc), Inverse Doc Frequency/IDF (how rare term is across docs), BM25 (improved TF-IDF - modern standard). Text Analysis Pipeline: Tokenization (split into words), Lowercasing (normalize case), Stemming (run/running/runs → run), Stop Words (remove 'the', 'a'). Key takeaway: Inverted index enables fast term lookup. TF-IDF/BM25 rank by relevance. Text analysis (tokenize, stem, normalize) improves matching."
          alt="Search engines indexing and ranking"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Elasticsearch &amp; Alternatives</h2>

        <h3>Elasticsearch</h3>
        <p>
          <strong>Elasticsearch</strong> is the most popular search engine (distributed, REST
          API, real-time). Architecture: <strong>Indices</strong> (like databases - collection
          of documents), <strong>Documents</strong> (JSON records - like rows),
          <strong>Shards</strong> (distributed across nodes - horizontal scaling),
          <strong>Replicas</strong> (copies for availability).
        </p>

        <p>
          Indexing: <code className="inline-code">POST /products/_doc/1 {"{"} "name":
          "Running Shoes", "price": 100 {"}"}</code>. Search:
          <code className="inline-code">GET /products/_search {"{"} "query": {"{"} "match":
          {"{"} "name": "running shoes" {"}"} {"}"} {"}"}</code>. Returns: ranked results
          (BM25), highlighting (matched terms), facets (counts by category).
        </p>

        <p>
          Benefits: <strong>Distributed</strong> (scale horizontally), <strong>Real-time</strong>
          (search immediately after index), <strong>Flexible</strong> (schemaless JSON),
          <strong>Rich queries</strong> (fuzzy, phrase, range, faceted). Trade-offs:
          <strong>Complexity</strong> (distributed system to manage), <strong>Memory</strong>
          (in-memory indices), <strong>Not ACID</strong> (eventual consistency).
        </p>

        <h3>Solr</h3>
        <p>
          <strong>Solr</strong> (Apache) is mature search engine (similar to Elasticsearch,
          both use Lucene). Architecture: <strong>Collections</strong> (like indices),
          <strong>Documents</strong> (XML/JSON), <strong>Shards/Replicas</strong> (distributed).
          Benefits: <strong>Mature</strong> (15+ years), <strong>Stable</strong> (proven in
          production), <strong>Rich features</strong> (facets, highlighting, spellcheck).
          Trade-offs: <strong>Complex config</strong> (XML configuration), <strong>Less
          active</strong> (development slower than Elasticsearch).
        </p>

        <h3>PostgreSQL Full-Text Search</h3>
        <p>
          <strong>PostgreSQL FTS</strong> is built-in full-text search.
          <code className="inline-code">SELECT * FROM products WHERE
          to_tsvector(name) @@ to_tsquery('running &amp; shoes')</code>. Uses inverted index
          (GIN index on tsvector). Benefits: <strong>Built-in</strong> (no separate system),
          <strong>ACID</strong> (transactional), <strong>Simple</strong> (SQL syntax).
          Trade-offs: <strong>Limited scale</strong> (single node), <strong>Fewer features</strong>
          (no distributed search, limited analyzers). Use for: simple full-text search, small
          datasets, when you already use PostgreSQL.
        </p>

        <h3>When to Use Search Engine vs Database</h3>
        <p>
          Use <strong>search engine</strong> for: full-text search (search within text content),
          relevance ranking (best matches first), fuzzy matching (typos, variations), faceted
          search (filter by multiple criteria), autocomplete (suggest as you type), synonyms
          (sneakers = shoes), large text datasets (millions of documents).
        </p>

        <p>
          Use <strong>database</strong> for: structured queries (exact matches, ranges),
          transactions (ACID guarantees), joins (relational data), simple LIKE queries
          (<code className="inline-code">LIKE 'term%'</code> - prefix match), small datasets
          (&lt;100K rows), when you already have database (no need for separate system).
        </p>

        <p>
          <strong>Hybrid approach</strong>: Database for structured data (product details,
          inventory, orders), search engine for text search (product search, content search).
          Sync: database is source of truth, search engine indexes from database (CDC,
          periodic sync). Example: e-commerce - database (products, inventory, orders),
          Elasticsearch (product search, autocomplete, recommendations).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/search-engines-use-cases.svg`}
          caption="Figure 3: Search Engines Use Cases and Best Practices. Primary Use Cases: E-Commerce Search (product search, faceted filtering, autocomplete, 'Did you mean?', relevance ranking), Content Search (article/blog search, full-text search, highlighting, fuzzy matching, synonym handling), Log Analytics (log aggregation, error search, pattern detection, time-based filtering, real-time dashboards). Search Best Practices: Use Dedicated Engine (Elasticsearch, Solr), Custom Analyzers (domain-specific), Synonyms (improve recall), Monitor (query logs). Anti-patterns: LIKE '%term%' (full table scan, slow), no text analysis (poor matching), database for full-text search (not scalable), ignoring relevance tuning (poor UX), no autocomplete (frustrating UX)."
          alt="Search engines use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Search Engines vs Database LIKE</h2>

        <p>
          Understanding the trade-offs between search engines and database LIKE queries helps
          you choose the right tool.
        </p>

        <h3>Search Engine Strengths</h3>
        <p>
          <strong>Performance</strong> is the primary advantage. Inverted index lookup
          (O(1) or O(log n)) vs full table scan (O(n)). 100-1000x faster for large datasets.
          Example: 1M documents, search "running shoes": Elasticsearch (50ms),
          <code className="inline-code">LIKE '%running shoes%'</code> (5-10 seconds).
        </p>

        <p>
          <strong>Relevance ranking</strong>: Search engines rank by relevance (BM25). Best
          matches first. Database LIKE returns all matches (no ranking - arbitrary order).
          E-commerce: users see best products first (higher conversion).
        </p>

        <p>
          <strong>Fuzzy matching</strong>: Search engines handle typos ("runing shoes" →
          "running shoes"). Database LIKE: exact match only (typo = no results). Benefits:
          better UX (users find what they want despite typos).
        </p>

        <p>
          <strong>Text analysis</strong>: Search engines tokenize, stem, normalize ("running
          shoes" matches "run shoe"). Database LIKE: no analysis (exact string match).
          Benefits: better recall (find more relevant results).
        </p>

        <h3>Search Engine Limitations</h3>
        <p>
          <strong>Complexity</strong>: Separate system to manage (cluster, shards, replicas).
          Database: already running, no extra system. Benefits: simpler ops. Trade-offs:
          limited search capabilities.
        </p>

        <p>
          <strong>Eventual consistency</strong>: Search engines are eventually consistent
          (index lag - document searchable after delay). Database: ACID (immediately
          consistent). Trade-off: search freshness vs performance.
        </p>

        <p>
          <strong>Memory usage</strong>: Search engines keep indices in memory (fast lookup).
          Large indices = lots of RAM. Database: disk-based (less memory). Trade-off:
          performance vs cost.
        </p>

        <h3>Database LIKE Strengths</h3>
        <p>
          <strong>Simplicity</strong>: No extra system (use existing database).
          <code className="inline-code">SELECT * FROM table WHERE column LIKE '%term%'</code>.
          Benefits: simple to implement, no ops overhead.
        </p>

        <p>
          <strong>ACID</strong>: Database transactions (immediate consistency). Search
          engines: eventual consistency (index lag). Benefits: data integrity, immediate
          searchability.
        </p>

        <h3>Database LIKE Limitations</h3>
        <p>
          <strong>Performance</strong>: <code className="inline-code">LIKE '%term%'</code>
          requires full table scan (can't use index - wildcard at start). O(n) complexity.
          Very slow for large tables (1M+ rows).
        </p>

        <p>
          <strong>No ranking</strong>: All matches equal (no relevance). Users see arbitrary
          order (may miss best matches).
        </p>

        <p>
          <strong>No fuzzy matching</strong>: Exact match only. Typo = no results. Poor UX.
        </p>

        <p>
          <strong>No text analysis</strong>: No stemming, normalization. "Running" doesn't
          match "run". Poor recall.
        </p>

        <h3>When to Use Each</h3>
        <p>
          Use <strong>search engine</strong> when: full-text search needed, relevance ranking
          important, fuzzy matching needed (typos), large text datasets (100K+ documents),
          faceted search needed, autocomplete needed.
        </p>

        <p>
          Use <strong>database LIKE</strong> when: simple prefix match
          (<code className="inline-code">LIKE 'term%'</code> - can use index), small datasets
          (&lt;100K rows), no relevance ranking needed, exact match sufficient, no ops
          overhead (don't want separate system).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Search Engines</h2>

        <p>
          <strong>Use dedicated search engine.</strong> For serious full-text search, use
          Elasticsearch or Solr. PostgreSQL FTS for simple cases. Avoid
          <code className="inline-code">LIKE '%term%'</code> for large datasets.
        </p>

        <p>
          <strong>Custom analyzers.</strong> Define analyzers per domain. E-commerce: handle
          brand names, product codes, synonyms (TV = television). Legal: Latin terms,
          abbreviations. Medical: drug names, abbreviations. Benefits: better matching
          (domain-specific normalization).
        </p>

        <p>
          <strong>Configure synonyms.</strong> Define synonym lists: "sneakers, trainers,
          running shoes". Query "sneakers" matches "running shoes" documents. Benefits:
          improved recall (users find what they want despite terminology differences).
        </p>

        <p>
          <strong>Tune relevance.</strong> Adjust BM25 parameters (k1, b), boost important
          fields (title &gt; description), use function scores (boost recent products,
          popular products). Benefits: better ranking (users see best results first).
        </p>

        <p>
          <strong>Monitor query logs.</strong> Track: popular queries (optimize for common
          searches), failed queries (no results - add synonyms), slow queries (optimize
          index). Benefits: continuous improvement (better search over time).
        </p>

        <p>
          <strong>Implement autocomplete.</strong> Use edge n-grams (index prefixes: "running"
          → "r", "ru", "run", ...). Query: prefix match. Benefits: better UX (users find
          faster, discover products).
        </p>

        <p>
          <strong>Handle typos.</strong> Enable fuzzy search (Levenshtein distance):
          "runing" → "running" (1 edit distance). Benefits: better UX (users find despite
          typos).
        </p>

        <p>
          <strong>Sync strategy.</strong> Database is source of truth, search engine indexes
          from database. Sync: CDC (real-time), periodic (every minute), manual (after bulk
          updates). Benefits: data consistency (search reflects database).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>LIKE '%term%' for full-text search.</strong> Full table scan (slow for
          large tables). Solution: use search engine (Elasticsearch, Solr) or PostgreSQL
          FTS. Benefits: 100-1000x faster, relevance ranking.
        </p>

        <p>
          <strong>No text analysis.</strong> Default analyzer may not fit domain. "Running"
          doesn't match "run". Solution: custom analyzers (stemming, synonyms, domain-specific
          normalization). Benefits: better matching (improved recall).
        </p>

        <p>
          <strong>Database for full-text search.</strong> Database isn't optimized for text
          search (slow, no ranking). Solution: use dedicated search engine for serious
          full-text search. Benefits: performance, relevance ranking, fuzzy matching.
        </p>

        <p>
          <strong>Ignoring relevance tuning.</strong> Default ranking may not fit use case.
          Solution: tune BM25 parameters, boost important fields, use function scores.
          Benefits: better UX (users find best results first).
        </p>

        <p>
          <strong>No autocomplete.</strong> Users must type full query (slow, frustrating).
          Solution: implement autocomplete (edge n-grams, prefix search). Benefits: better
          UX (faster search, discovery).
        </p>

        <p>
          <strong>No synonym handling.</strong> "Sneakers" doesn't match "shoes". Solution:
          define synonym lists, use synonym filter. Benefits: improved recall (users find
          despite terminology differences).
        </p>

        <p>
          <strong>Not monitoring search.</strong> Don't know what users search for, what
          fails. Solution: log queries, track popular/failed queries, analyze regularly.
          Benefits: continuous improvement (better search over time).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Product Search</h3>
        <p>
          E-commerce uses Elasticsearch for product search: inverted index (fast lookup),
          BM25 ranking (best products first), faceted search (filter by category, price,
          brand), autocomplete (suggest as you type), "did you mean?" (typo correction),
          synonyms (TV = television). Benefits: fast search (50ms), relevant results
          (higher conversion), better UX (autocomplete, fuzzy matching).
        </p>

        <h3>Content/Blog Search</h3>
        <p>
          Content site uses search engine for article search: full-text search (search
          within article content), highlighting (show matched terms in context), fuzzy
          matching (handle typos), relevance ranking (best articles first). Benefits:
          users find content fast, relevant results (engage longer), better UX
          (highlighting, fuzzy matching).
        </p>

        <h3>Log Analytics (ELK Stack)</h3>
        <p>
          ELK stack (Elasticsearch, Logstash, Kibana) for log analytics: ingest logs
          (Logstash), index in Elasticsearch (fast search), visualize (Kibana dashboards).
          Search: error messages, patterns, time-based filtering. Benefits: fast log
          search (millions of logs in seconds), pattern detection (anomalies), real-time
          dashboards (monitoring).
        </p>

        <h3>Enterprise Search</h3>
        <p>
          Enterprise search across documents, emails, wikis: unified search (one search
          bar for all content), access control (only show results user can access),
          relevance tuning (boost recent documents, important sources). Benefits:
          productivity (find information fast), knowledge sharing (discover relevant
          content), compliance (access control enforced).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What is an inverted index? How does it enable fast search?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Inverted index maps terms to documents containing
              them. Example: "cat" → [Doc 1, Doc 5], "dog" → [Doc 2, Doc 3]. Search "cat":
              lookup "cat" in index (O(1) hash table or O(log n) tree), return [Doc 1,
              Doc 5]. Performance: sub-second even for millions of documents. Contrast:
              database LIKE '%cat%' scans all documents (O(n), very slow for large
              datasets). Inverted index also stores: positions (for phrase search),
              frequency (for ranking).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How is inverted index built? Answer: Indexing
              pipeline: documents → tokenizer (split into words) → analyzer (normalize,
              stem) → inverted index (term → doc IDs). Done once (index time), search
              is fast (query time).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What is TF-IDF? How does BM25 improve it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> TF-IDF (Term Frequency - Inverse Document Frequency)
              ranks documents by relevance. TF: how often term appears in document (more =
              more relevant). IDF: how rare term is across all documents (rare = more
              relevant). Score = TF × IDF. BM25 improves TF-IDF: accounts for document
              length (long docs have higher TF naturally - BM25 normalizes), term
              saturation (10 occurrences not 10x more relevant than 1 - BM25 saturates).
              BM25 is modern standard (used by Elasticsearch, Solr, PostgreSQL FTS).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What are BM25 parameters? Answer: k1 (term
              saturation - higher = more weight on frequency), b (length normalization -
              higher = more penalty for long docs). Default: k1=1.2, b=0.75. Tune per
              use case.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: When would you use a search engine vs database LIKE query?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use search engine for: full-text search (search
              within text content), relevance ranking (best matches first), fuzzy matching
              (typos, variations), large datasets (100K+ documents), faceted search
              (filter by multiple criteria), autocomplete (suggest as you type). Use
              database LIKE for: simple prefix match (<code className="inline-code">LIKE
              'term%'</code> - can use index), small datasets (&lt;100K rows), exact match
              sufficient, no ops overhead (don't want separate system). Performance:
              search engine (50ms for 1M docs), LIKE '%term%' (5-10 seconds for 1M rows).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What about PostgreSQL full-text search? Answer:
              Middle ground: built-in (no separate system), uses inverted index (fast),
              ACID (transactional). Use for: simple full-text search, small-medium
              datasets, when you already use PostgreSQL. Not for: large-scale distributed
              search, advanced features (facets, autocomplete).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: How do you handle typos in search?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Fuzzy matching (Levenshtein distance): "runing" →
              "running" (1 edit distance = 1 character change). Elasticsearch:
              <code className="inline-code">"fuzziness": "AUTO"</code> (auto-adjusts
              based on term length). Benefits: users find despite typos. Trade-offs:
              may return irrelevant results (too fuzzy). Tune: max edit distance (1-2),
              minimum match threshold. Also: "did you mean?" (suggest correction),
              autocomplete (prevent typos).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is Levenshtein distance? Answer: Number
              of single-character edits (insert, delete, substitute) to change one word
              to another. "cat" → "bat" (1 - substitute), "cat" → "cats" (1 - insert),
              "cat" → "car" (1 - substitute).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: How do you implement autocomplete/search-as-you-type?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Edge n-grams: index prefixes of terms. "running" →
              "r", "ru", "run", "runn", "runni", "runnin", "running". Query: prefix match
              ("ru" matches "running"). Elasticsearch: edge_ngram tokenizer, search_as_you_type
              field type. Benefits: instant suggestions (as user types), discoverability
              (users find products they didn't know about). Trade-offs: larger index
              (store multiple prefixes), query complexity (prefix matching).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you rank autocomplete suggestions?
              Answer: By: popularity (most searched first), relevance (BM25 score),
              recency (recent products boosted), custom (business rules - boost
              high-margin products).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your search is slow. How do you diagnose and fix it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check query complexity (too many
              clauses? - simplify), (2) Check index size (too large? - shard/replicate),
              (3) Check query logs (slow queries - optimize), (4) Check cluster health
              (nodes down? - fix), (5) Check cache (not using cache? - enable). Fix:
              (1) Optimize queries (use filters not queries where possible), (2) Add
              shards (distribute load), (3) Add replicas (read scaling), (4) Enable
              query cache (cache frequent queries), (5) Tune analyzers (simpler =
              faster), (6) Use completion suggester for autocomplete (specialized,
              faster).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the difference between filter and
              query? Answer: Query: calculates relevance score (slower). Filter:
              yes/no match (no score - faster, cacheable). Use filter for: exact
              matches, ranges, facets. Use query for: full-text search (need ranking).
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
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elasticsearch Documentation — Getting Started
            </a>
          </li>
          <li>
            <a
              href="https://solr.apache.org/guide/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Solr Documentation — Quick Start
            </a>
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/current/textsearch.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — Full Text Search
            </a>
          </li>
          <li>
            <a
              href="https://lucene.apache.org/core/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lucene Documentation — Search Basics
            </a>
          </li>
          <li>
            Manning, <em>Elasticsearch in Action</em>, 3rd Edition, 2021.
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/guide/current/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              O&apos;Reilly — Elasticsearch: The Definitive Guide
            </a>
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Search_engine_indexing"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia — Inverted Index
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia — TF-IDF
            </a>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Okapi_BM25"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia — Okapi BM25
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
