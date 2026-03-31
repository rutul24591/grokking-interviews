"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-search-indexing",
  title: "Search Indexing",
  description:
    "Comprehensive guide to search indexing covering inverted indexes, analyzers, tokenization, incremental updates, and reindexing strategies for production search systems.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "search-indexing",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "search",
    "indexing",
    "backend",
    "elasticsearch",
  ],
  relatedTopics: [
    "query-processing",
    "elasticsearch",
    "search-ranking",
    "analyzers",
  ],
};

export default function SearchIndexingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Indexing</strong> is the process of transforming raw
          content into optimized data structures that enable fast, relevant
          search results. It is the foundation of any search system—without
          proper indexing, even the most sophisticated ranking algorithms cannot
          retrieve relevant documents efficiently.
        </p>
        <p>
          Search indexing solves the fundamental information retrieval problem:
          given millions or billions of documents, find the handful relevant to
          a user's query in milliseconds. The inverted index—mapping terms to
          documents rather than documents to terms—enables this sub-linear
          search performance. Modern search engines like Elasticsearch, Solr,
          and Lucene build on this foundation with additional optimizations:
          field-level indexes, document vectors, term frequencies, and position
          information.
        </p>
        <p>
          For staff-level engineers, understanding indexing architecture is
          critical. You'll design indexing pipelines that handle millions of
          documents per day, implement zero-downtime reindexing strategies,
          optimize analyzer chains for domain-specific language, and balance
          index freshness with system throughput.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Inverted Index</h3>
        <p>
          The inverted index is the core data structure of full-text search.
          Instead of storing documents and their contents (forward index), it
          stores terms and which documents contain them.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Term Dictionary:</strong> Sorted list of all unique terms in
            the corpus. Stored as a finite state transducer (FST) for compact
            storage and fast lookup.
          </li>
          <li>
            <strong>Posting List:</strong> For each term, list of documents
            containing it. Stored as compressed document IDs (delta encoding)
            for space efficiency.
          </li>
          <li>
            <strong>Term Frequencies:</strong> How often each term appears in
            each document. Used for TF-IDF and BM25 scoring.
          </li>
          <li>
            <strong>Positions:</strong> Where in the document each term appears.
            Enables phrase queries ("machine learning" as adjacent terms).
          </li>
        </ul>

        <h3 className="mt-6">Analyzers</h3>
        <p>Analyzers transform raw text into indexed terms. They consist of:</p>
        <ul className="space-y-3">
          <li>
            <strong>Character Filters:</strong> Pre-process text (strip HTML,
            normalize quotes, handle contractions). Applied before tokenization.
          </li>
          <li>
            <strong>Tokenizers:</strong> Split text into terms. Options:
            whitespace, standard (punctuation-aware), n-gram, edge-ngram, regex,
            language-specific.
          </li>
          <li>
            <strong>Token Filters:</strong> Post-process tokens. Common filters:
            lowercase, stop words, stemming (Porter, Snowball), synonym
            expansion, ASCII folding.
          </li>
        </ul>

        <h3 className="mt-6">Index Segments</h3>
        <p>
          Search indexes are divided into segments—immutable sub-indexes that
          enable efficient updates and merging.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Segment Creation:</strong> New documents written to new
            segments. Segments are immutable once created.
          </li>
          <li>
            <strong>Segment Merging:</strong> Background process combines small
            segments into larger ones. Removes deleted documents, optimizes
            storage.
          </li>
          <li>
            <strong>Search Across Segments:</strong> Query executes against all
            segments, results merged. More segments = slower search.
          </li>
          <li>
            <strong>Refresh Interval:</strong> How often new segments become
            searchable. Default: 1 second (near-real-time search).
          </li>
        </ul>

        <h3 className="mt-6">Field Types and Mappings</h3>
        <p>Different field types require different indexing strategies:</p>
        <ul className="space-y-3">
          <li>
            <strong>Text Fields:</strong> Analyzed, full-text search. Use for
            content, descriptions, comments.
          </li>
          <li>
            <strong>Keyword Fields:</strong> Not analyzed, exact match. Use for
            IDs, categories, tags, sorting/aggregations.
          </li>
          <li>
            <strong>Numeric Fields:</strong> Optimized for range queries,
            aggregations. Stored as trie structure (BKD tree).
          </li>
          <li>
            <strong>Date Fields:</strong> Stored as milliseconds since epoch,
            formatted for display. Support date math queries.
          </li>
          <li>
            <strong>Geo Fields:</strong> Geopoint (lat/lon) or geoshape. Enable
            location-based search, distance calculations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production search indexing requires a robust pipeline that handles
          high-volume document ingestion while maintaining search availability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/search-indexing/inverted-index-structure.svg"
          alt="Inverted Index Structure"
          caption="Figure 1: Inverted Index — Term dictionary maps terms to posting lists containing document IDs, frequencies, and positions"
          width={1000}
          height={500}
        />

        <h3>Indexing Pipeline Components</h3>
        <ul className="space-y-3">
          <li>
            <strong>Document Ingestion:</strong> API endpoint or message queue
            consumer (Kafka, Kinesis). Handles bulk indexing and real-time
            updates.
          </li>
          <li>
            <strong>Document Parser:</strong> Extract text from various formats
            (HTML, PDF, Word, plain text). Handle encoding, extract metadata.
          </li>
          <li>
            <strong>Analyzer Chain:</strong> Apply character filters,
            tokenizers, token filters per field type. Different analyzers for
            title vs body vs tags.
          </li>
          <li>
            <strong>Index Writer:</strong> Write analyzed terms to index
            segments. Manage segment creation, merging, refresh.
          </li>
          <li>
            <strong>Commit Manager:</strong> Periodically commit changes to
            durable storage. Handle transaction logs for recovery.
          </li>
        </ul>

        <h3 className="mt-6">Indexing Flow</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Document Received:</strong> Via API or message queue.
            Validate schema, extract ID.
          </li>
          <li>
            <strong>Field Analysis:</strong> For each field, apply configured
            analyzer. Text fields → tokenized, stemmed, lowercased. Keyword
            fields → stored as-is.
          </li>
          <li>
            <strong>Term Dictionary Lookup:</strong> For each term, check if
            exists in dictionary. If new, add to dictionary.
          </li>
          <li>
            <strong>Posting List Update:</strong> Add document ID to posting
            list for each term. Update term frequency, positions.
          </li>
          <li>
            <strong>Stored Fields:</strong> Store original field values for
            retrieval (unless doc_values only for aggregations).
          </li>
          <li>
            <strong>Segment Flush:</strong> When memory buffer full, flush to
            new segment on disk.
          </li>
          <li>
            <strong>Refresh:</strong> Make new segment searchable (default:
            every 1 second).
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/search-indexing/indexing-pipeline.svg"
          alt="Search Indexing Pipeline"
          caption="Figure 2: Indexing Pipeline — Document ingestion → parsing → analysis → index writing → segment management → search availability"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Sharding and Replication</h3>
        <p>
          For large-scale search, indexes are distributed across multiple nodes:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Concept</th>
                <th className="text-left p-2 font-semibold">Purpose</th>
                <th className="text-left p-2 font-semibold">Configuration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Primary Shard</td>
                <td className="p-2">Stores subset of documents</td>
                <td className="p-2">Fixed at index creation (cannot change)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Replica Shard</td>
                <td className="p-2">Copy of primary for HA and read scale</td>
                <td className="p-2">Can change dynamically</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Shard Routing</td>
                <td className="p-2">Doc ID → shard mapping</td>
                <td className="p-2">hash(doc_id) % num_primary_shards</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Recommended Size</td>
                <td className="p-2">Optimal shard size</td>
                <td className="p-2">10-50 GB per shard</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Document Lifecycle</h3>
        <p>Documents go through multiple states in the index:</p>
        <ul className="space-y-3">
          <li>
            <strong>Active:</strong> Document is searchable. Appears in query
            results.
          </li>
          <li>
            <strong>Updated:</strong> New version replaces old. Old version
            marked deleted (not immediately removed).
          </li>
          <li>
            <strong>Deleted:</strong> Document marked for removal. Still
            occupies space until segment merge.
          </li>
          <li>
            <strong>Purged:</strong> Document physically removed during segment
            merge. Space reclaimed.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Indexing strategy involves balancing search performance, index
          freshness, storage efficiency, and indexing throughput.
        </p>

        <h3>Analyzer Complexity vs Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Analyzer Type</th>
                <th className="text-left p-2 font-semibold">Complexity</th>
                <th className="text-left p-2 font-semibold">Search Quality</th>
                <th className="text-left p-2 font-semibold">Indexing Speed</th>
                <th className="text-left p-2 font-semibold">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Simple (lowercase only)</td>
                <td className="p-2">Low</td>
                <td className="p-2">Basic</td>
                <td className="p-2">Very Fast</td>
                <td className="p-2">Logs, codes, IDs</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Standard</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Good</td>
                <td className="p-2">Fast</td>
                <td className="p-2">General text</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Language-specific</td>
                <td className="p-2">Medium-High</td>
                <td className="p-2">Better</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Content in specific language</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">
                  Custom (synonyms, n-grams)
                </td>
                <td className="p-2">High</td>
                <td className="p-2">Best</td>
                <td className="p-2">Slow</td>
                <td className="p-2">Domain-specific search</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/search-indexing/reindexing-strategies.svg"
          alt="Reindexing Strategies"
          caption="Figure 3: Reindexing Strategies — Blue-green indexing with alias switch enables zero-downtime index updates"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Index Freshness vs Throughput</h3>
        <p>
          <strong>Near-Real-Time (NRT):</strong> Refresh interval 1-5 seconds.
          Users see changes quickly. Higher indexing overhead (frequent segment
          creation). Best for: chat, comments, real-time dashboards.
        </p>
        <p>
          <strong>Batch Indexing:</strong> Refresh interval minutes to hours.
          Bulk index large batches. Lower overhead, better throughput. Best for:
          product catalogs, article publishing, daily data updates.
        </p>
        <p>
          <strong>Hybrid:</strong> NRT for high-priority updates (user-generated
          content), batch for bulk updates (product imports). Use separate
          indexes or routing rules.
        </p>

        <h3 className="mt-6">Storage Optimization Trade-offs</h3>
        <p>
          <strong>doc_values (columnar storage):</strong> Enabled by default for
          keyword, numeric, date fields. Optimized for sorting and aggregations.
          Increases index size by ~10-20%. Disable if not needed (saves space,
          faster indexing).
        </p>
        <p>
          <strong>_source field:</strong> Stores original JSON document. Enables
          document retrieval, reindexing, updates. Can be large (50%+ of index
          size). Disable if only need search (not retrieval) or store original
          elsewhere.
        </p>
        <p>
          <strong>Stored Fields:</strong> Individual fields stored for
          retrieval. Faster than extracting from _source. Increases index size.
          Use selectively for frequently accessed fields.
        </p>
        <p>
          <strong>Compression:</strong> LZ4 (fast) or ZSTD (better compression).
          Reduces storage by 30-50%. Adds CPU overhead for
          compression/decompression.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Design Mappings Upfront:</strong> Define field types,
            analyzers, and mappings before indexing. Changing mappings often
            requires reindexing.
          </li>
          <li>
            <strong>Choose Shard Count Carefully:</strong> Too few shards limits
            scaling. Too many shards causes overhead. Target 10-50GB per shard.
            Estimate growth and set primary shards accordingly.
          </li>
          <li>
            <strong>Use Index Templates:</strong> Define templates for
            consistent mappings, settings, and aliases across indexes. Essential
            for time-series data (logs, metrics).
          </li>
          <li>
            <strong>Implement Index Lifecycle Management (ILM):</strong>{" "}
            Automate index rollover, shrink, and deletion. Move old indices to
            cold storage. Prevent unbounded growth.
          </li>
          <li>
            <strong>Monitor Segment Count:</strong> Too many segments degrades
            search performance. Tune merge policy (merge threshold, max segments
            per tier). Force merge read-only indices.
          </li>
          <li>
            <strong>Use Bulk API for Indexing:</strong> Batch documents (5-15MB
            per bulk request). Reduces network overhead, improves throughput.
          </li>
          <li>
            <strong>Implement Backpressure:</strong> Rate limit indexing when
            cluster is under pressure. Use bulk rejection handling with
            exponential backoff.
          </li>
          <li>
            <strong>Test Analyzer Chains:</strong> Use analyze API to test
            tokenization. Verify stemming, synonyms, filters work as expected
            before production use.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Too Many Shards:</strong> Each shard consumes memory and
            file handles. 1000+ shards causes cluster instability. Solution:
            Plan shard count based on data volume, use index templates with
            appropriate settings.
          </li>
          <li>
            <strong>Unbounded Index Growth:</strong> No ILM policy, indices grow
            forever. Solution: Implement ILM with rollover, shrink, and delete
            phases. Archive old data to cold storage.
          </li>
          <li>
            <strong>Inefficient Analyzers:</strong> Over-complex analyzer chains
            slow indexing. Solution: Profile analyzer performance, use simpler
            analyzers where possible, cache analyzer results.
          </li>
          <li>
            <strong>Mapping Explosion:</strong> Too many unique fields (dynamic
            mapping creates field per unique key). Solution: Disable dynamic
            mapping, define explicit mappings, use object arrays instead of
            dynamic keys.
          </li>
          <li>
            <strong>Not Handling Reindexing:</strong> Schema changes require
            reindexing but no strategy exists. Solution: Always use aliases,
            implement blue-green reindexing, test reindex process regularly.
          </li>
          <li>
            <strong>Ignoring Refresh Interval:</strong> Default 1s refresh
            causes overhead for bulk indexing. Solution: Increase refresh
            interval during bulk indexing, reset afterward.
          </li>
          <li>
            <strong>Poor Document Design:</strong> Large documents (&gt;100KB)
            cause memory pressure. Solution: Split large documents, store large
            fields separately, use _source filtering.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>GitHub Code Search</h3>
        <p>
          GitHub indexes billions of lines of code across millions of
          repositories. Uses custom analyzers for code tokenization (split
          camelCase, snake_case). Indexes symbols, function names, and comments
          separately. Implements sharding by repository ID.
        </p>
        <p>
          <strong>Key Innovation:</strong> Custom tokenizer handles programming
          language syntax. Indexes code structure (AST) for semantic search, not
          just text match.
        </p>

        <h3 className="mt-6">Slack Message Search</h3>
        <p>
          Slack indexes messages, files, and conversations across organizations.
          Uses per-workspace indexes for data isolation. Implements real-time
          indexing for new messages (sub-second search availability). Handles
          emoji, mentions, and thread replies.
        </p>
        <p>
          <strong>Key Innovation:</strong> Channel-based routing enables
          efficient permissions filtering. Search respects channel access
          controls.
        </p>

        <h3 className="mt-6">E-commerce Product Search</h3>
        <p>
          E-commerce platforms index millions of products with complex
          attributes (price, category, brand, specifications, reviews). Uses
          multi-field indexing (analyzed for search, keyword for filtering).
          Implements synonym expansion for product categories.
        </p>
        <p>
          <strong>Key Innovation:</strong> Faceted search requires indexing both
          for full-text search and aggregations. Uses doc_values for fast
          filtering and faceting.
        </p>

        <h3 className="mt-6">Log Analytics (ELK Stack)</h3>
        <p>
          Log aggregation systems index billions of log entries daily. Uses
          time-series indices (one per day/week). Implements ILM for automatic
          rollover and deletion. Uses minimal analyzers for fast indexing.
        </p>
        <p>
          <strong>Key Innovation:</strong> Index lifecycle management automates
          retention. Hot-warm-cold architecture moves old logs to cheaper
          storage.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle incremental indexing?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Event-driven architecture with message queue
              (Kafka, Kinesis). Content change → event → indexing service →
              update index. Batch small updates every few seconds for
              efficiency. Use optimistic concurrency control (version numbers)
              to handle conflicts. For high-volume updates, implement
              micro-batching (accumulate events, bulk index every N seconds).
              Monitor indexing lag (time from content change to search
              availability).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle reindexing?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Blue-green indexing strategy. Create new index
              with updated mapping/settings alongside old index. Reindex
              documents from old to new index using scroll API (batch
              processing). Monitor reindex progress, handle errors. When
              complete, switch alias atomically to point to new index. Keep old
              index for rollback. Delete old index after validation period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you design analyzers for domain-specific search?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Start with standard analyzer, analyze query
              logs for domain-specific patterns. Add custom token filters:
              synonym expansion for domain terminology, stemmers for domain
              language, ASCII folding for internationalization. Test with
              analyze API. For code search, use custom tokenizer (split
              camelCase, snake_case). For e-commerce, add edge-ngrams for
              autocomplete, synonym filters for product categories.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle index growth?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement Index Lifecycle Management (ILM).
              Define phases: hot (active indexing/search), warm (read-only,
              shrink shards), cold (archived, minimal resources), delete (remove
              after retention period). Use rollover API to create new index when
              size/time threshold reached. Archive old indices to cheaper
              storage (S3, cold nodes). Monitor index size growth rate, plan
              capacity accordingly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize index performance?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Proper shard sizing (10-50GB per shard). Force
              merge read-only indices to single segment. Use filters instead of
              queries where possible (filters are cached). Limit returned fields
              with _source filtering. Use doc_values for sorting/aggregations.
              Disable _source if not needed. Tune refresh interval based on use
              case. Monitor segment count and merge performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you ensure zero-downtime during index updates?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Always use aliases, never index names
              directly. For mapping changes: create new index with updated
              mapping, reindex data, switch alias atomically. For settings
              changes: some can be updated dynamically (replicas,
              refresh_interval), others require reindex. Implement rollback
              procedure—keep old index until new index validated. Test reindex
              process regularly in staging.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://lucene.apache.org/core/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Lucene — Core Search Library Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elasticsearch — The Definitive Guide
            </a>
          </li>
          <li>
            <a
              href="https://lucenenet.apache.org/docs/4.8.0/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lucene.NET — Inverted Index Architecture
            </a>
          </li>
          <li>
            <a
              href="https://engineeringblog.yelp.com/2017/06/announcing-elastalert.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Yelp Engineering — Elasticsearch Index Management at Scale
            </a>
          </li>
          <li>
            <a
              href="https://github.blog/2013-02-06-how-we-built-github-search/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Blog — How We Built GitHub Search
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
