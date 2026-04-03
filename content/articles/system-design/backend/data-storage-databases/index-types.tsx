"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-index-types-complete",
  title: "Index Types",
  description:
    "Comprehensive guide to index types: composite, partial, covering, and specialized indexes (GIN, GiST, BRIN, Bitmap), with selection strategies and optimization techniques.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "index-types",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "indexing", "query-optimization", "database"],
  relatedTopics: [
    "database-indexes",
    "query-optimization-techniques",
    "sql-queries-optimization",
    "database-partitioning",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Index Types</h1>
        <p className="lead">
          Beyond basic B-Tree indexes, databases offer advanced index types for specialized use
          cases. <strong>Composite indexes</strong> span multiple columns (optimize multi-column
          queries). <strong>Partial indexes</strong> index only a subset of rows (smaller, faster).
          <strong>Covering indexes</strong> include all query columns (index-only scans).
          Specialized indexes like <strong>GIN</strong> (arrays, JSON, full-text),
          <strong>GiST</strong> (geometric, custom types), <strong>BRIN</strong> (time-series),
          and <strong>Bitmap</strong> (low-cardinality columns) handle specific data types and
          query patterns. Choosing the right index type can improve query performance by 10-100x.
        </p>

        <p>
          Consider an e-commerce products table. Basic index on <code className="inline-code">category_id</code>
          helps filter by category. But queries often filter by
          <code className="inline-code">category_id AND price BETWEEN ? AND ?</code> and sort by
          <code className="inline-code">rating</code>. A composite index on
          <code className="inline-code">(category_id, price, rating)</code> optimizes this exact
          query pattern. For products with tags (array column), a GIN index on
          <code className="inline-code">tags</code> enables fast tag searches. For product
          descriptions, a GIN index with full-text search enables text search.
        </p>

        <p>
          Advanced indexes involve trade-offs: composite indexes are larger than single-column
          indexes, partial indexes only help filtered queries, covering indexes are largest
          (include all columns) but fastest. Specialized indexes (GIN, GiST) have higher write
          overhead but enable queries impossible with B-Tree. Understanding these trade-offs
          helps you choose the right index for each use case.
        </p>

        <p>
          This article provides a comprehensive examination of index types: composite indexes
          (multi-column, leftmost prefix rule), partial indexes (filtered subsets), covering
          indexes (index-only scans), and specialized indexes (GIN, GiST, BRIN, Bitmap). We'll
          explore when each index type excels (composite for multi-column queries, partial for
          filtered subsets, GIN for arrays/JSON, GiST for geometric) and when they introduce
          complexity (storage overhead, write slowdown). We'll also cover index selection
          strategies, optimization techniques, and common pitfalls (over-indexing, wrong column
          order, not monitoring usage).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/index-types-advanced.svg`}
          caption="Figure 1: Advanced Index Types showing Composite (Multi-Column) Index (Index: (last_name, first_name) - sorted by last_name then first_name, supports (last_name) and (last_name, first_name) via leftmost prefix rule, does NOT support (first_name) alone), Partial (Filtered) Index (CREATE INDEX ON users (email) WHERE active = true - index contains ONLY active users, smaller index size, faster queries), and Covering Index (Query: SELECT id, email FROM users WHERE status = ?, Covering Index: (status, id, email) - includes all query columns, result is index-only scan, no table lookup needed = fastest possible query). Key characteristics: Composite (multiple columns, leftmost prefix), Partial (filtered subset), Covering (includes all query columns)."
          alt="Advanced index types"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Composite, Partial, &amp; Covering Indexes</h2>

        <h3>Composite (Multi-Column) Indexes</h3>
        <p>
          <strong>Composite indexes</strong> span multiple columns:
          <code className="inline-code">CREATE INDEX ON users (last_name, first_name)</code>.
          The index is sorted by first column (last_name), then by second column (first_name)
          within each last_name value. This enables efficient queries on both columns together.
        </p>

        <p>
          <strong>Leftmost prefix rule</strong> is critical: composite index
          <code className="inline-code">(a, b, c)</code> supports queries on:
          <code className="inline-code">(a)</code> alone,
          <code className="inline-code">(a, b)</code> together,
          <code className="inline-code">(a, b, c)</code> all three. But NOT
          <code className="inline-code">(b)</code> alone,
          <code className="inline-code">(c)</code> alone, or
          <code className="inline-code">(b, c)</code> together. The index can only be used
          from the leftmost column onwards.
        </p>

        <p>
          <strong>Column order matters</strong>: put most selective columns first (filter out
          most rows), match query patterns (ORDER BY columns last for sorting benefit). Example:
          index <code className="inline-code">(category_id, price, rating)</code> supports
          <code className="inline-code">WHERE category_id = ? AND price BETWEEN ? AND ? ORDER
          BY rating</code> perfectly (filter + range + sort).
        </p>

        <h3>Partial (Filtered) Indexes</h3>
        <p>
          <strong>Partial indexes</strong> index only a subset of rows matching a condition:
          <code className="inline-code">CREATE INDEX ON users (email) WHERE active = true</code>.
          Only active users are indexed (inactive users excluded). Benefits: smaller index size
          (fewer rows), faster queries (smaller index to scan), reduced storage overhead.
        </p>

        <p>
          Use cases: <strong>Active records</strong> (index only active users, products, orders),
          <strong>Recent data</strong> (index only last 90 days), <strong>Specific statuses</strong>
          (index only pending orders, not completed/cancelled). Partial indexes are ideal when
          queries frequently filter on the same condition.
        </p>

        <p>
          Trade-offs: <strong>Smaller index</strong> (only subset of rows), <strong>Faster
          queries</strong> (when condition matches), <strong>Write overhead</strong> (database
          must evaluate condition on INSERT/UPDATE), <strong>Limited applicability</strong>
          (only helps queries matching the filter condition).
        </p>

        <h3>Covering Indexes</h3>
        <p>
          <strong>Covering indexes</strong> include all columns needed by a query. Example:
          query <code className="inline-code">SELECT id, email FROM users WHERE status =
          'active'</code>, covering index <code className="inline-code">(status, id,
          email)</code>. The query is satisfied entirely from the index—no table lookup needed.
          This is called an <strong>index-only scan</strong>, the fastest possible query
          execution.
        </p>

        <p>
          Benefits: <strong>No table I/O</strong> (data from index only), <strong>Faster
          queries</strong> (index is smaller than table), <strong>Reduced lock contention</strong>
          (no table locks needed). Trade-offs: <strong>Larger index size</strong> (more columns
          = bigger index), <strong>More write overhead</strong> (more columns to update).
        </p>

        <p>
          Use for: <strong>High-traffic queries</strong> (optimize common queries),
          <strong>Large tables</strong> (index much smaller than table), <strong>Read-heavy
          workloads</strong> (write overhead acceptable).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/index-types-selection.svg`}
          caption="Figure 2: Index Selection and Optimization showing When to Create Indexes: High Selectivity Columns (many unique values like email, ID - ✓), WHERE Clause Columns (frequently filtered columns - ✓), JOIN Keys (foreign keys, join columns - ⚠), Low Selectivity Columns (few unique values like gender, boolean - ✗). Index Optimization Strategies: (1) Analyze Query Patterns (EXPLAIN ANALYZE slow queries), (2) Remove Unused Indexes (zero scans = drop index), (3) Consolidate Duplicate Indexes (same columns, different order), (4) Use Covering Indexes for Critical Queries, (5) Consider Partial Indexes for Filtered Subsets. Index Monitoring Metrics: Scan Count (how often used), Index Size (storage overhead), Fragmentation (rebuild if &gt;30%), Write Impact (INSERT/UPDATE cost). Key takeaway: Index selectively based on query patterns. Monitor usage, remove unused indexes, optimize for critical queries."
          alt="Index selection and optimization"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Specialized Indexes</h2>

        <h3>GIN Indexes (Generalized Inverted Index)</h3>
        <p>
          <strong>GIN</strong> is an inverted index: maps values to rows (opposite of normal
          index). Used for: <strong>Arrays</strong>
          (<code className="inline-code">WHERE tags overlaps {'{'}postgres, sql{'}'}</code>—overlap
          operator), <strong>JSON/JSONB</strong>
          (<code className="inline-code">WHERE data contains {'{'}"key": "value"{'}'}</code>—contains
          operator), <strong>Full-text search</strong>
          (<code className="inline-code">WHERE text matches query</code>).
        </p>

        <p>
          GIN excels at <strong>containment queries</strong> (does this array contain X?, does
          this JSON contain this key-value?). Trade-offs: <strong>Slower writes</strong>
          (updating inverted index is expensive), <strong>Larger index size</strong> (multiple
          entries per row), <strong>Powerful queries</strong> (enables queries impossible with
          B-Tree).
        </p>

        <h3>GiST Indexes (Generalized Search Tree)</h3>
        <p>
          <strong>GiST</strong> is a balanced tree structure (like B-Tree) supporting custom
          predicates. Used for: <strong>Geometric data</strong>
          (<code className="inline-code">WHERE point &lt;@ polygon</code>—point inside polygon),
          <strong>Full-text search</strong> (alternative to GIN, faster updates but slower
          searches), <strong>Custom data types</strong> (user-defined predicates).
        </p>

        <p>
          GiST is <strong>extensible</strong>: you can define custom operators and indexing
          strategies. Trade-offs: <strong>Flexible</strong> (supports custom types),
          <strong>Moderate performance</strong> (slower than specialized indexes for specific
          types), <strong>Higher write overhead</strong> (tree maintenance).
        </p>

        <h3>BRIN Indexes (Block Range Index)</h3>
        <p>
          <strong>BRIN</strong> is designed for very large tables with naturally sorted data
          (time-series, logs). Instead of indexing every row, BRIN stores summaries for blocks
          of rows (min/max values per block). Example:
          <code className="inline-code">CREATE INDEX ON events USING BRIN (created_at)</code>.
        </p>

        <p>
          BRIN is <strong>tiny</strong> (1-2% of table size vs 10-30% for B-Tree),
          <strong>fast writes</strong> (minimal index maintenance), <strong>efficient for
          range queries</strong> on sorted data. Trade-offs: <strong>Only for sorted data</strong>
          (time-series, logs), <strong>Less selective</strong> (scans more rows than B-Tree),
          <strong>Not for random access</strong> (designed for range scans).
        </p>

        <h3>Bitmap Indexes</h3>
        <p>
          <strong>Bitmap indexes</strong> use bit arrays (bitmaps) for each distinct value.
          Example: gender column (M, F, NULL) has three bitmaps: M = 10010001..., F = 01100010...,
          NULL = 00001100... (1 = row has value, 0 = doesn't).
        </p>

        <p>
          Bitmap indexes excel for <strong>low-cardinality columns</strong> (few distinct
          values: gender, status, boolean). Efficient for <strong>complex predicates</strong>
          (<code className="inline-code">WHERE gender = 'M' AND status = 'active'</code>—
          bitwise AND of bitmaps). Trade-offs: <strong>Efficient for low cardinality</strong>,
          <strong>Inefficient for high cardinality</strong> (many distinct values = many
          bitmaps), <strong>Slow writes</strong> (updating bitmaps is expensive).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/index-types-use-cases.svg`}
          caption="Figure 3: Index Types Use Cases and Best Practices. Primary Use Cases: B-Tree (Default) for primary keys (automatic), foreign keys (join optimization), range queries (BETWEEN, &gt;, &lt;), ORDER BY, GROUP BY - 90% of use cases. Hash Index for exact match lookups, primary key lookups (alternative), in-memory indexes, O(1) lookup performance - no range queries supported. Specialized Indexes: GIN (Arrays, JSON, full-text), GiST (Geometric, custom types), BRIN (Time-series, sorted data), Bitmap (Low cardinality - Data Warehouse). Index Best Practices: Index Selectively (WHERE, JOIN, ORDER BY), Monitor Usage (remove unused indexes), Maintain Regularly (REINDEX, ANALYZE), Test Impact (EXPLAIN ANALYZE). Anti-patterns: over-indexing (slows writes), indexing low-cardinality columns, not monitoring usage, ignoring maintenance (fragmentation, outdated stats)."
          alt="Index types use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Index Type Selection</h2>

        <p>
          Each index type has trade-offs. Understanding them helps you choose the right index
          for each use case.
        </p>

        <h3>B-Tree (Default)</h3>
        <p>
          <strong>Best for</strong>: 90% of use cases, general-purpose indexing.
          <strong>Supports</strong>: equality, range queries, sorting, prefix matching.
          <strong>Write overhead</strong>: moderate. <strong>Index size</strong>: 10-30% of
          table size. <strong>Use when</strong>: unsure which index to use (safe default).
        </p>

        <h3>Hash</h3>
        <p>
          <strong>Best for</strong>: equality-only lookups, in-memory indexes.
          <strong>Supports</strong>: equality only (no range, no sorting).
          <strong>Write overhead</strong>: low. <strong>Index size</strong>: similar to B-Tree.
          <strong>Use when</strong>: exact match queries only (primary key lookups).
        </p>

        <h3>GIN</h3>
        <p>
          <strong>Best for</strong>: arrays, JSON/JSONB, full-text search.
          <strong>Supports</strong>: containment, overlap, full-text search.
          <strong>Write overhead</strong>: high (updating inverted index).
          <strong>Index size</strong>: larger than B-Tree (multiple entries per row).
          <strong>Use when</strong>: querying arrays, JSON, or text search.
        </p>

        <h3>GiST</h3>
        <p>
          <strong>Best for</strong>: geometric data, custom types, full-text search (alternative
          to GIN). <strong>Supports</strong>: custom predicates, geometric operators.
          <strong>Write overhead</strong>: moderate-high. <strong>Index size</strong>: similar
          to B-Tree. <strong>Use when</strong>: geometric queries or custom data types.
        </p>

        <h3>BRIN</h3>
        <p>
          <strong>Best for</strong>: very large tables with naturally sorted data (time-series,
          logs). <strong>Supports</strong>: range queries on sorted columns.
          <strong>Write overhead</strong>: very low. <strong>Index size</strong>: tiny (1-2%
          of table size). <strong>Use when</strong>: time-series data, logs, large tables
          with sorted data.
        </p>

        <h3>Bitmap</h3>
        <p>
          <strong>Best for</strong>: low-cardinality columns (data warehouses).
          <strong>Supports</strong>: complex predicates (bitwise operations).
          <strong>Write overhead</strong>: high. <strong>Index size</strong>: small for low
          cardinality, large for high cardinality. <strong>Use when</strong>: data warehousing,
          low-cardinality columns (gender, status, boolean).
        </p>

        <h3>Composite vs Multiple Single-Column Indexes</h3>
        <p>
          <strong>Composite index</strong> <code className="inline-code">(a, b)</code> is
          different from two single-column indexes <code className="inline-code">(a)</code>
          and <code className="inline-code">(b)</code>. Composite index supports queries on
          <code className="inline-code">(a, b)</code> together efficiently (single index
          scan). Two single-column indexes require index merge (slower) or use only one
          index.
        </p>

        <p>
          Rule: <strong>Create composite index</strong> for queries filtering/sorting on
          multiple columns together. <strong>Create single-column indexes</strong> for
          columns queried independently.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Index Types</h2>

        <p>
          <strong>Use B-Tree by default.</strong> B-Tree handles 90% of use cases. Only use
          specialized indexes (GIN, GiST, BRIN) when you have specific needs (arrays, JSON,
          geometric, time-series).
        </p>

        <p>
          <strong>Order composite index columns wisely.</strong> Put most selective columns
          first (filter out most rows). Match query patterns (ORDER BY columns last for
          sorting benefit). Follow leftmost prefix rule.
        </p>

        <p>
          <strong>Use partial indexes for filtered queries.</strong> If queries frequently
          filter on same condition (active = true), use partial index. Smaller index, faster
          queries.
        </p>

        <p>
          <strong>Create covering indexes for critical queries.</strong> For high-traffic
          queries, create covering index (includes all query columns). Index-only scan is
          fastest possible. Trade-off: larger index size.
        </p>

        <p>
          <strong>Choose specialized indexes based on data type.</strong> Arrays/JSON → GIN.
          Geometric → GiST. Time-series → BRIN. Low-cardinality (DW) → Bitmap. Don't force
          B-Tree for everything.
        </p>

        <p>
          <strong>Monitor index usage.</strong> Track scan count, index size, fragmentation.
          Remove unused indexes (zero scans). Consolidate duplicate indexes. Rebuild
          fragmented indexes (&gt;30% fragmentation).
        </p>

        <p>
          <strong>Test index impact.</strong> Before creating index: measure query time,
          write time, storage. After: measure again. Verify benefit exceeds cost. Use
          EXPLAIN ANALYZE to see query plan.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Wrong composite index column order.</strong> Index
          <code className="inline-code">(last_name, first_name)</code> doesn't help queries
          on <code className="inline-code">(first_name)</code> alone. Solution: Put most
          selective columns first, follow leftmost prefix rule, create separate indexes if
          needed.
        </p>

        <p>
          <strong>Using B-Tree for arrays/JSON.</strong> B-Tree doesn't support containment
          queries on arrays/JSON. Solution: Use GIN index for arrays/JSON
          (<code className="inline-code">USING GIN</code>).
        </p>

        <p>
          <strong>Creating partial index without matching queries.</strong> Partial index
          <code className="inline-code">WHERE active = true</code> only helps queries with
          <code className="inline-code">WHERE active = true</code>. Solution: Ensure queries
          match the filter condition.
        </p>

        <p>
          <strong>Overusing covering indexes.</strong> Covering indexes are largest (include
          all columns). Too many = storage waste, slow writes. Solution: Use covering indexes
          only for critical, high-traffic queries.
        </p>

        <p>
          <strong>Using BRIN for non-sorted data.</strong> BRIN assumes data is naturally
          sorted. For random data, BRIN is ineffective. Solution: Use BRIN only for
          time-series, logs, sorted data.
        </p>

        <p>
          <strong>Not maintaining specialized indexes.</strong> GIN/GiST indexes fragment
          over time. Solution: Schedule REINDEX for specialized indexes, monitor fragmentation.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Product Search (Composite + GIN)</h3>
        <p>
          E-commerce products table: composite index
          <code className="inline-code">(category_id, price, rating)</code> for filtering
          + sorting. GIN index on <code className="inline-code">tags</code> array for tag
          search. Query: <code className="inline-code">SELECT * FROM products WHERE
          category_id = ? AND price BETWEEN ? AND ? AND tags contains {'{'}new{'}'}</code>
          ORDER BY rating DESC. Benefits: fast product search (100ms vs 5 seconds), supports filtering
          + tag search + sorting efficiently.
        </p>

        <h3>Time-Series Events (BRIN)</h3>
        <p>
          Events table (1 billion rows): BRIN index on
          <code className="inline-code">created_at</code>. Query:
          <code className="inline-code">SELECT * FROM events WHERE created_at BETWEEN ? AND
          ?</code>. BRIN index is tiny (1-2GB vs 100GB for B-Tree), fast writes (minimal
          overhead), efficient range scans. Benefits: 50x smaller index, 10x faster writes,
          efficient time-range queries.
        </p>

        <h3>User Preferences (JSONB + GIN)</h3>
        <p>
          Users table with JSONB preferences: GIN index on
          <code className="inline-code">preferences</code>. Query:
          <code className="inline-code">SELECT * FROM users WHERE preferences contains theme=dark</code>.
          GIN index enables fast JSON containment queries. Benefits:
          flexible schema (add preferences without schema changes), fast JSON queries
          (10ms vs 1 second).
        </p>

        <h3>Data Warehouse (Bitmap Indexes)</h3>
        <p>
          Data warehouse fact table: bitmap indexes on low-cardinality columns
          (gender, status, region). Query: <code className="inline-code">SELECT COUNT(*)
          FROM sales WHERE gender = 'M' AND status = 'active' AND region = 'US'</code>.
          Bitmap indexes enable fast bitwise operations. Benefits: fast complex predicates,
          efficient for data warehouse workloads (read-heavy, low-cardinality).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What is a composite index? How does column order affect query performance?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Composite index spans multiple columns:
              <code className="inline-code">CREATE INDEX ON users (last_name, first_name)</code>.
              Column order matters due to leftmost prefix rule: index
              <code className="inline-code">(a, b, c)</code> supports queries on
              <code className="inline-code">(a)</code>, <code className="inline-code">(a,
              b)</code>, <code className="inline-code">(a, b, c)</code>, but NOT
              <code className="inline-code">(b)</code> or <code className="inline-code">(c)</code>
              alone. Order: put most selective columns first (filters out most rows), match
              query pattern (ORDER BY columns last for sorting benefit).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if queries use columns in different orders?
              Answer: Create separate indexes (e.g., <code className="inline-code">(a,
              b)</code> and <code className="inline-code">(b, a)</code>), or use single
              column indexes (less efficient but more flexible).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What is a partial index? When would you use one?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Partial index indexes only a subset of rows:
              <code className="inline-code">CREATE INDEX ON users (email) WHERE active =
              true</code>. Only active users are indexed. Benefits: smaller index size
              (fewer rows), faster queries (smaller index to scan), reduced storage overhead.
              Use for: active records (index only active users/products/orders), recent data
              (index only last 90 days), specific statuses (index only pending orders).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the trade-off? Answer: Partial index only
              helps queries matching the filter condition. If query doesn't have
              <code className="inline-code">WHERE active = true</code>, index isn't used.
              Also, database must evaluate condition on INSERT/UPDATE (write overhead).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What is a covering index? How does it improve performance?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Covering index includes all columns needed by query.
              Example: query <code className="inline-code">SELECT id, email FROM users WHERE
              status = 'active'</code>, covering index <code className="inline-code">(status,
              id, email)</code>. Query satisfied entirely from index (no table lookup)—called
              index-only scan. This is fastest possible query execution. Benefits: no table
              I/O (data from index only), faster queries (index is smaller than table),
              reduced lock contention (no table locks needed). Trade-off: larger index size
              (more columns = bigger index).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you know if a query uses covering index?
              Answer: EXPLAIN ANALYZE shows "Index Only Scan" (PostgreSQL) or "Using index"
              (MySQL). No "Heap Fetch" or "Table lookup" = covering index used.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: Compare GIN and GiST indexes. When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> GIN (Generalized Inverted Index): inverted index
              (maps values to rows). Best for: arrays, JSON/JSONB, full-text search. Supports:
              containment, overlap, full-text search. Write overhead: high (updating inverted
              index). GiST (Generalized Search Tree): balanced tree structure. Best for:
              geometric data, custom types, full-text search (alternative to GIN). Supports:
              custom predicates, geometric operators. Write overhead: moderate. Use GIN for:
              arrays, JSON, text search (faster searches). Use GiST for: geometric queries,
              custom data types, text search (faster updates).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Which is better for full-text search? Answer: GIN
              is faster for searches, GiST is faster for updates. Choose based on workload:
              read-heavy → GIN, write-heavy → GiST.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: What is BRIN? When would you use it over B-Tree?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> BRIN (Block Range Index) stores summaries for blocks
              of rows (min/max values per block) instead of indexing every row. Designed for
              very large tables with naturally sorted data (time-series, logs). Benefits:
              tiny index size (1-2% of table size vs 10-30% for B-Tree), very fast writes
              (minimal index maintenance), efficient for range queries on sorted data. Use
              BRIN over B-Tree for: time-series data, logs, large tables with sorted data.
              Don't use BRIN for: random access, non-sorted data, small tables.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How much smaller is BRIN vs B-Tree? Answer: BRIN
              is typically 1-2% of table size, B-Tree is 10-30%. For 1TB table: BRIN = 10-20GB,
              B-Tree = 100-300GB. 10-30x smaller.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: You have a query that's still slow after adding an index. How do you
              diagnose and fix this?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) EXPLAIN ANALYZE (check if index is
              actually used—may be using sequential scan instead), (2) Check index condition
              (query may not match index—leftmost prefix rule, data type mismatch), (3) Check
              index selectivity (low selectivity = index not helpful), (4) Check statistics
              (outdated stats = wrong query plan), (5) Check index fragmentation (fragmented
              index = slower). Fix: (1) Rewrite query to match index (follow leftmost prefix),
              (2) Update statistics (ANALYZE), (3) REINDEX (rebuild fragmented index),
              (4) Create better index (covering index, different column order), (5) Consider
              specialized index (GIN/GiST for arrays/JSON).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if index is used but still slow? Answer:
              Index may not be selective enough (too many rows match), or query may need
              covering index (avoid table lookup), or query may need optimization (reduce
              rows examined, optimize JOINs).
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
              href="https://www.postgresql.org/docs/current/indexes.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — Indexes
            </a>
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/current/gin.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — GIN Indexes
            </a>
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/current/gist.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — GiST Indexes
            </a>
          </li>
          <li>
            <a
              href="https://www.postgresql.org/docs/current/brin.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — BRIN Indexes
            </a>
          </li>
          <li>
            <a
              href="https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MySQL Documentation — InnoDB Index Types
            </a>
          </li>
          <li>
            <a
              href="https://use-the-index-luke.com/sql/where-clause"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Use The Index, Luke — The WHERE Clause
            </a>
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O&apos;Reilly, 2019. Chapter 5.
          </li>
          <li>
            <a
              href="https://www.youtube.com/c/CMUDatabaseGroup"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CMU Database Group — Advanced Indexing (YouTube lectures)
            </a>
          </li>
          <li>
            <a
              href="https://www.percona.com/blog/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Percona Blog — PostgreSQL Index Types
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
