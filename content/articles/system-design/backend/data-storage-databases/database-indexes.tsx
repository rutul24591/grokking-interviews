"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-indexing-complete",
  title: "Database Indexing",
  description:
    "Comprehensive guide to database indexing: B-Tree, Hash, Bitmap, and GiST/GIN index types, index performance, trade-offs, and when to create indexes for query optimization.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "database-indexes",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "indexing", "query-optimization", "database"],
  relatedTopics: [
    "query-optimization-techniques",
    "index-types",
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
        <h1>Database Indexing</h1>
        <p className="lead">
          Database indexes are data structures that speed up data retrieval at the cost of slower
          writes and additional storage. Like a book index lets you find pages without reading
          every page, database indexes let queries find rows without scanning every row. Without
          indexes, queries perform full table scans (O(n) complexity—1M rows = 1M comparisons).
          With B-Tree indexes, queries use tree traversal (O(log n)—1M rows = ~20 comparisons).
          With Hash indexes, queries use hash lookup (O(1)—1M rows = 1 comparison). This 100-1000x
          improvement is essential for database performance.
        </p>

        <p>
          Consider a users table with 10 million rows. Query:
          <code className="inline-code">SELECT * FROM users WHERE email = 'alice@example.com'</code>.
          Without index: database scans all 10M rows (5-10 seconds). With index: database traverses
          B-Tree (20 comparisons) or hash lookup (1 comparison) (1-10 milliseconds). The index
          transforms an unacceptable query into an instant one.
        </p>

        <p>
          Indexes are fundamental to database performance. Every primary key has an automatic
          unique index. Foreign keys benefit from indexes (faster joins). WHERE clauses, ORDER BY,
          and JOIN operations all benefit from appropriate indexes. But indexes aren't free: each
          index adds storage overhead (10-30% of table size), slows writes (INSERT/UPDATE/DELETE
          must update indexes), and requires maintenance (rebuilding, statistics updates).
        </p>

        <p>
          This article provides a comprehensive examination of database indexing: index types
          (B-Tree, Hash, Bitmap, GiST/GIN), index performance characteristics, trade-offs
          (read speed vs write overhead), index selection strategies (which columns to index),
          and real-world use cases. We'll explore when indexes excel (query optimization,
          constraint enforcement, covering indexes) and when they introduce complexity
          (over-indexing, maintenance overhead). We'll also cover implementation patterns
          (composite indexes, partial indexes, covering indexes) and common pitfalls
          (over-indexing, indexing low-cardinality columns, not monitoring usage).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/database-index-types.svg`}
          caption="Figure 1: Database Index Types and Structures showing B-Tree Index (balanced tree structure with Root, Internal nodes, Leaf nodes - O(log n) search, insert, delete, supports range + equality queries) vs Hash Index (hash function h(key) → bucket, O(1) equality lookups, no range queries, hash collisions possible). Index type comparison: B-Tree (Range + Equality), Hash (Equality only), Bitmap (Low cardinality), GiST/GIN (Specialized data). Key characteristics: B-Tree (balanced, range queries), Hash (O(1) equality), Bitmap (low cardinality), GiST/GIN (specialized data)."
          alt="Database index types and structures"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Index Types &amp; Structures</h2>

        <h3>B-Tree Indexes (Default)</h3>
        <p>
          <strong>B-Tree</strong> (Balanced Tree) is the default index type in most databases
          (PostgreSQL, MySQL, Oracle). B-Tree maintains a balanced tree structure: root node,
          internal nodes, leaf nodes. All leaf nodes are at same depth (balanced), ensuring
          O(log n) complexity for search, insert, delete.
        </p>

        <p>
          B-Tree structure: <strong>Root node</strong> (top of tree, single node),
          <strong>Internal nodes</strong> (intermediate levels, contain keys and pointers),
          <strong>Leaf nodes</strong> (bottom level, contain keys and row pointers/actual data).
          Leaf nodes are linked (doubly-linked list) for efficient range scans.
        </p>

        <p>
          B-Tree supports: <strong>Equality queries</strong>
          (<code className="inline-code">WHERE id = 5</code>), <strong>Range queries</strong>
          (<code className="inline-code">WHERE id BETWEEN 1 AND 100</code>),
          <strong>Sorting</strong> (<code className="inline-code">ORDER BY id</code>—index
          already sorted), <strong>Prefix matching</strong>
          (<code className="inline-code">WHERE name LIKE 'A%'</code>).
        </p>

        <h3>Hash Indexes</h3>
        <p>
          <strong>Hash indexes</strong> use hash function to map keys to buckets.
          <code className="inline-code">h(key) → bucket number</code>. Lookup is O(1)
          (constant time)—compute hash, go to bucket, find row. Much faster than B-Tree for
          equality queries.
        </p>

        <p>
          Hash indexes support: <strong>Equality queries only</strong>
          (<code className="inline-code">WHERE id = 5</code>). Don't support:
          <strong>Range queries</strong> (hash destroys ordering), <strong>Sorting</strong>
          (hash not ordered), <strong>Prefix matching</strong> (hash of prefix ≠ prefix of hash).
        </p>

        <p>
          Trade-offs: <strong>Faster equality</strong> (O(1) vs O(log n)), <strong>No range
          support</strong> (hash destroys ordering), <strong>Hash collisions</strong> (different
          keys map to same bucket—handled via chaining or open addressing),
          <strong>Memory-resident</strong> (often in-memory, limited by RAM).
        </p>

        <h3>Bitmap Indexes</h3>
        <p>
          <strong>Bitmap indexes</strong> use bitmaps (bit arrays) for each distinct value.
          Example: gender column (M, F, NULL). Three bitmaps: M = 10010001..., F = 01100010...,
          NULL = 00001100... (1 = row has value, 0 = doesn't).
        </p>

        <p>
          Bitmap indexes excel for <strong>low-cardinality columns</strong> (few distinct
          values: gender, status, boolean). Efficient for <strong>complex predicates</strong>
          (<code className="inline-code">WHERE gender = 'M' AND status = 'active'</code>—
          bitwise AND of bitmaps).
        </p>

        <p>
          Trade-offs: <strong>Efficient for low cardinality</strong> (few distinct values),
          <strong>Inefficient for high cardinality</strong> (many distinct values = many
          bitmaps), <strong>Fast complex predicates</strong> (bitwise operations),
          <strong>Slow writes</strong> (updating bitmaps is expensive).
        </p>

        <h3>GiST and GIN Indexes</h3>
        <p>
          <strong>GiST</strong> (Generalized Search Tree) and <strong>GIN</strong>
          (Generalized Inverted Index) are specialized indexes for complex data types.
        </p>

        <p>
          <strong>GiST</strong>: Balanced tree structure (like B-Tree), supports custom
          predicates. Used for: <strong>Geometric data</strong> (points, polygons—
          <code className="inline-code">WHERE point &lt;@ polygon</code>),
          <strong>Full-text search</strong> (tsvector—<code className="inline-code">WHERE
          text @@ query</code>), <strong>Custom data types</strong> (user-defined predicates).
        </p>

        <p>
          <strong>GIN</strong>: Inverted index (maps values to rows). Used for:
          <strong>Arrays</strong> (<code className="inline-code">WHERE tags overlaps {'{'}postgres, sql{'}'}</code>), <strong>JSON/JSONB</strong>
          (<code className="inline-code">WHERE data contains {'{'}"key": "value"{'}'}</code>),
          <strong>Full-text search</strong> (faster than GiST for text search).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/database-index-performance.svg`}
          caption="Figure 2: Index Performance and Trade-offs showing index lookup performance comparison (Full Table Scan: O(n) - 1M rows = 1M comparisons, B-Tree Index: O(log n) - 1M rows = ~20 comparisons, Hash Index: O(1) - 1M rows = 1 comparison). Index trade-offs: Benefits (faster queries, sorted output) vs Costs (storage overhead 10-30% of table size per index, write slowdown - each index adds overhead to INSERT/UPDATE/DELETE). When to create indexes: WHERE Clauses (frequently filtered columns), JOIN Keys (foreign keys, join columns), ORDER BY (sorted output columns), Unique (enforce uniqueness). Key takeaway: indexes speed up reads but slow down writes. Index selectively: WHERE, JOIN, ORDER BY columns. Monitor index usage, remove unused indexes."
          alt="Index performance and trade-offs"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Index Selection &amp; Maintenance</h2>

        <h3>Index Selection Strategies</h3>
        <p>
          Choosing which columns to index is critical. Too few indexes = slow queries. Too
          many indexes = slow writes, storage waste. Guidelines:
        </p>

        <p>
          <strong>Index WHERE clause columns</strong>: Columns used in filters benefit most
          from indexes. Example: <code className="inline-code">WHERE email = ?</code> → index
          on email. <strong>Index JOIN keys</strong>: Foreign keys and join columns benefit
          from indexes. Example: <code className="inline-code">JOIN orders ON users.id =
          orders.user_id</code> → index on orders.user_id. <strong>Index ORDER BY
          columns</strong>: Sorting uses index order (no sort needed). Example:
          <code className="inline-code">ORDER BY created_at DESC</code> → index on
          created_at.
        </p>

        <p>
          <strong>Composite indexes</strong> (multiple columns): Index
          <code className="inline-code">(last_name, first_name)</code> supports queries on
          <code className="inline-code">(last_name)</code> and
          <code className="inline-code">(last_name, first_name)</code>, but NOT
          <code className="inline-code">(first_name)</code> alone (leftmost prefix rule).
          Order matters: put most selective columns first.
        </p>

        <p>
          <strong>Covering indexes</strong>: Index includes all columns needed by query.
          Example: <code className="inline-code">SELECT id, email FROM users WHERE
          status = 'active'</code> → covering index on <code className="inline-code">(status,
          id, email)</code>. Query satisfied entirely from index (no table lookup)—fastest
          possible query.
        </p>

        <h3>Index Maintenance</h3>
        <p>
          Indexes require maintenance to stay efficient: <strong>Fragmentation</strong>
          (inserts/deletes cause page splits, fragmentation), <strong>Statistics</strong>
          (database needs accurate statistics for query planner), <strong>Bloat</strong>
          (dead tuples in index—PostgreSQL VACUUM cleans).
        </p>

        <p>
          Maintenance operations: <strong>REINDEX</strong> (rebuild index from scratch—fixes
          fragmentation), <strong>ANALYZE</strong> (update statistics—query planner needs
          accurate stats), <strong>VACUUM</strong> (PostgreSQL—reclaim dead space),
          <strong>OPTIMIZE TABLE</strong> (MySQL—defragment table and indexes).
        </p>

        <p>
          Maintenance frequency: <strong>High-write tables</strong> (daily/weekly REINDEX,
          frequent ANALYZE), <strong>Low-write tables</strong> (monthly REINDEX, weekly
          ANALYZE), <strong>Monitor fragmentation</strong> (rebuild when fragmentation &gt;
          30%).
        </p>

        <h3>Monitoring Index Usage</h3>
        <p>
          Unused indexes waste storage and slow writes. Monitor: <strong>Index scan
          count</strong> (how often index used), <strong>Index size</strong> (storage
          overhead), <strong>Write overhead</strong> (impact on INSERT/UPDATE/DELETE).
        </p>

        <p>
          PostgreSQL: <code className="inline-code">pg_stat_user_indexes</code> (scan count,
          size), <code className="inline-code">pg_stat_all_tables</code> (table stats).
          MySQL: <code className="inline-code">performance_schema.table_io_waits_summary_by_index_usage</code>
          (usage stats).
        </p>

        <p>
          Remove unused indexes: <strong>Zero scans</strong> (index never used—drop
          immediately), <strong>Low scans</strong> (index rarely used—consider dropping),
          <strong>Duplicate indexes</strong> (same columns, different order—keep most useful).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/database-indexing-use-cases.svg`}
          caption="Figure 3: Database Indexing Use Cases and Best Practices. Primary use cases: Query Optimization (WHERE clause filtering, JOIN operations, ORDER BY sorting, GROUP BY aggregation, 100-1000x faster queries), Constraint Enforcement (PRIMARY KEY unique + not null, UNIQUE constraints, FOREIGN KEY join optimization, data integrity, automatic index creation), Covering Indexes (index includes all query columns, no table lookup needed, index-only scans, maximum performance, larger index size). Index Maintenance: REINDEX (rebuild indexes), ANALYZE (update statistics), Monitor Usage (remove unused), VACUUM (reclaim space). Anti-patterns: over-indexing (slows writes, storage waste), under-indexing (slow queries), indexing low-cardinality columns (gender, boolean), not monitoring index usage (unused indexes)."
          alt="Database indexing use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Index Benefits vs Costs</h2>

        <p>
          Indexes involve fundamental trade-offs: faster reads vs slower writes, storage
          overhead vs query performance. Understanding these trade-offs helps you index
          selectively and effectively.
        </p>

        <h3>Index Benefits</h3>
        <p>
          <strong>Query performance</strong> is the primary benefit. Indexes transform O(n)
          full table scans into O(log n) tree traversals or O(1) hash lookups. For large
          tables (1M+ rows), this is 100-1000x improvement. Queries that took seconds now
          take milliseconds.
        </p>

        <p>
          <strong>Sorted output</strong>—B-Tree indexes maintain order.
          <code className="inline-code">ORDER BY indexed_column</code> uses index order
          (no sort operation). <code className="inline-code">GROUP BY indexed_column</code>
          uses index order (no sort). This eliminates expensive sort operations.
        </p>

        <p>
          <strong>Constraint enforcement</strong>—unique indexes enforce uniqueness
          (PRIMARY KEY, UNIQUE constraints). Foreign key indexes speed up join checks
          (referential integrity checks). Indexes are essential for data integrity.
        </p>

        <p>
          <strong>Covering indexes</strong>—when index includes all query columns, query
          is satisfied entirely from index (no table lookup). This is the fastest possible
          query execution (index-only scan).
        </p>

        <h3>Index Costs</h3>
        <p>
          <strong>Storage overhead</strong>—each index consumes 10-30% of table size.
          Large tables (100GB) with many indexes (10) can double storage requirements
          (100GB table + 100GB indexes = 200GB total).
        </p>

        <p>
          <strong>Write overhead</strong>—every INSERT, UPDATE, DELETE must update all
          indexes on affected columns. Table with 10 indexes: each INSERT becomes 11
          operations (1 table + 10 indexes). Write-heavy tables should have minimal
          indexes.
        </p>

        <p>
          <strong>Maintenance overhead</strong>—indexes fragment over time (page splits
          from inserts/deletes). Fragmented indexes are slower, require REINDEX
          (downtime or performance impact). Statistics require ANALYZE (CPU cost).
        </p>

        <p>
          <strong>Query planner complexity</strong>—too many indexes confuse query planner
          (wrong index choice). Planner may choose suboptimal index (slower query). Fewer,
          well-chosen indexes are better than many indexes.
        </p>

        <h3>When to Create Indexes</h3>
        <p>
          Create indexes for: <strong>WHERE clauses</strong> (frequently filtered columns),
          <strong>JOIN keys</strong> (foreign keys, join columns), <strong>ORDER BY</strong>
          (sorted output columns), <strong>Unique constraints</strong> (PRIMARY KEY, UNIQUE),
          <strong>Composite queries</strong> (multiple columns in WHERE/ORDER BY).
        </p>

        <p>
          Avoid indexes for: <strong>Low-cardinality columns</strong> (gender, boolean—few
          distinct values, index not selective), <strong>Small tables</strong> (&lt;1000
          rows—full scan faster than index lookup), <strong>Write-heavy tables</strong>
          (index overhead exceeds query benefit), <strong>Unused columns</strong> (columns
          never in WHERE/JOIN/ORDER BY).
        </p>

        <h3>Index Types Comparison</h3>
        <p>
          <strong>B-Tree</strong>: Default, balanced tree. Best for: most workloads, range
          queries, sorting. Supports: equality, range, sorting, prefix matching.
        </p>

        <p>
          <strong>Hash</strong>: Hash table. Best for: equality-only lookups, in-memory
          indexes. Supports: equality only. Don't use for: range queries, sorting.
        </p>

        <p>
          <strong>Bitmap</strong>: Bit arrays per value. Best for: low-cardinality columns
          (gender, status), data warehouses (read-heavy). Supports: complex predicates
          (bitwise operations). Don't use for: high-cardinality columns, write-heavy
          workloads.
        </p>

        <p>
          <strong>GiST/GIN</strong>: Specialized indexes. Best for: geometric data,
          full-text search, arrays, JSON. Supports: custom predicates, containment
          operators. Don't use for: simple equality/range (use B-Tree instead).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Database Indexing</h2>

        <p>
          <strong>Index selectively.</strong> Don't index every column. Index columns used
          in WHERE, JOIN, ORDER BY. Monitor index usage, remove unused indexes. Fewer,
          well-chosen indexes are better than many indexes.
        </p>

        <p>
          <strong>Use composite indexes wisely.</strong> Order matters: put most selective
          columns first. Follow leftmost prefix rule: index
          <code className="inline-code">(a, b, c)</code> supports queries on
          <code className="inline-code">(a)</code>, <code className="inline-code">(a,
          b)</code>, <code className="inline-code">(a, b, c)</code>, but NOT
          <code className="inline-code">(b)</code> or <code className="inline-code">(c)</code>
          alone.
        </p>

        <p>
          <strong>Create covering indexes for critical queries.</strong> For high-traffic
          queries, create covering index (includes all query columns). Query satisfied
          entirely from index (no table lookup)—fastest possible. Trade-off: larger index
          size.
        </p>

        <p>
          <strong>Monitor index usage.</strong> Track index scan count, index size, write
          overhead. Remove indexes with zero scans (never used). Consolidate duplicate
          indexes (same columns, different order).
        </p>

        <p>
          <strong>Maintain indexes regularly.</strong> REINDEX when fragmentation &gt; 30%.
          ANALYZE after bulk operations (load data, mass updates). VACUUM (PostgreSQL) to
          reclaim dead space. Schedule maintenance during low-traffic periods.
        </p>

        <p>
          <strong>Consider partial indexes.</strong> Index subset of rows:
          <code className="inline-code">CREATE INDEX ON users (email) WHERE active =
          true</code>. Smaller index (only active users), faster queries (smaller index),
          less storage. Use for: frequently filtered subsets.
        </p>

        <p>
          <strong>Test index impact.</strong> Before creating index: measure query time,
          write time, storage. After creating index: measure again. Verify benefit exceeds
          cost. Use EXPLAIN ANALYZE to see query plan.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Over-indexing.</strong> Creating too many indexes slows writes, wastes
          storage. Solution: Index selectively (WHERE, JOIN, ORDER BY columns), monitor
          usage, remove unused indexes. Rule of thumb: 3-5 indexes per table typical,
          &gt;10 indexes = review needed.
        </p>

        <p>
          <strong>Under-indexing.</strong> Too few indexes causes slow queries (full table
          scans). Solution: Analyze slow queries (EXPLAIN ANALYZE), identify missing indexes
          (WHERE, JOIN, ORDER BY columns), create indexes selectively.
        </p>

        <p>
          <strong>Indexing low-cardinality columns.</strong> Columns with few distinct
          values (gender, boolean, status) don't benefit from B-Tree indexes. Solution:
          Use bitmap indexes (for low cardinality), or don't index (full scan may be
          faster).
        </p>

        <p>
          <strong>Wrong composite index order.</strong> Index
          <code className="inline-code">(last_name, first_name)</code> doesn't help queries
          on <code className="inline-code">(first_name)</code> alone. Solution: Put most
          selective columns first, follow leftmost prefix rule, create separate indexes if
          needed.
        </p>

        <p>
          <strong>Not monitoring index usage.</strong> Unused indexes waste storage, slow
          writes. Solution: Monitor index scan count (pg_stat_user_indexes, performance_schema),
          remove indexes with zero scans, consolidate duplicate indexes.
        </p>

        <p>
          <strong>Ignoring maintenance.</strong> Fragmented indexes are slower. Outdated
          statistics cause wrong query plans. Solution: Schedule REINDEX (fragmentation &gt;
          30%), ANALYZE (after bulk operations), VACUUM (PostgreSQL—regularly).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Product Search</h3>
        <p>
          E-commerce sites use indexes for product search. Products table:
          <code className="inline-code">CREATE INDEX ON products (category_id, price,
          rating)</code>. Query: <code className="inline-code">SELECT * FROM products WHERE
          category_id = ? AND price BETWEEN ? AND ? ORDER BY rating DESC</code>. Composite
          index supports filter + sort (single index scan). Benefits: fast product search
          (100ms vs 5 seconds), supports filtering + sorting efficiently.
        </p>

        <p>
          This pattern works because e-commerce queries filter by category, price range,
          sort by rating. Composite index matches query pattern exactly.
        </p>

        <h3>User Authentication</h3>
        <p>
          Authentication queries use unique indexes. Users table:
          <code className="inline-code">CREATE UNIQUE INDEX ON users (email)</code>. Query:
          <code className="inline-code">SELECT * FROM users WHERE email = ?</code>. Unique
          index ensures fast lookup (O(log n)) and enforces uniqueness. Benefits: instant
          authentication (1ms vs 500ms), prevents duplicate emails.
        </p>

        <p>
          This pattern works because authentication is high-frequency (every login), requires
          exact match (email), and uniqueness is critical (no duplicate accounts).
        </p>

        <h3>Analytics Dashboard</h3>
        <p>
          Analytics dashboards use covering indexes. Orders table:
          <code className="inline-code">CREATE INDEX ON orders (created_at, status,
          total_amount)</code>. Query: <code className="inline-code">SELECT status,
          SUM(total_amount) FROM orders WHERE created_at BETWEEN ? AND ? GROUP BY
          status</code>. Covering index satisfies query entirely from index (no table
          lookup). Benefits: fast aggregation (100ms vs 10 seconds), no table I/O.
        </p>

        <p>
          This pattern works because analytics queries aggregate over time ranges, grouping
          by status. Covering index includes all needed columns.
        </p>

        <h3>Full-Text Search</h3>
        <p>
          Full-text search uses GIN/GiST indexes. Articles table:
          <code className="inline-code">CREATE INDEX ON articles USING GIN
          (to_tsvector('english', content))</code>. Query:
          <code className="inline-code">SELECT * FROM articles WHERE to_tsvector('english',
          content) @@ to_tsquery('database &amp; indexing')</code>. GIN index supports
          text search efficiently. Benefits: fast text search (100ms vs 30 seconds),
          supports complex queries (AND, OR, proximity).
        </p>

        <p>
          This pattern works because text search requires specialized indexing (inverted
          index), GIN/GiST are designed for text search.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: When would you create an index? What are the signs that an index is needed?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Create indexes for query optimization. Signs an index
              is needed: (1) Slow queries (EXPLAIN ANALYZE shows full table scan), (2)
              Frequent WHERE clauses on same columns, (3) JOIN operations on same columns,
              (4) ORDER BY on same columns, (5) High-traffic queries (optimize common
              queries). Don't create indexes for: small tables (&lt;1000 rows), low-cardinality
              columns (gender, boolean), write-heavy tables (index overhead exceeds benefit),
              columns never in WHERE/JOIN/ORDER BY.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you verify an index helps? Answer: Use
              EXPLAIN ANALYZE before and after creating index. Compare: execution time
              (should decrease), query plan (should show index scan vs sequential scan),
              rows examined (should decrease).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: Compare B-Tree, Hash, and Bitmap indexes. When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> B-Tree: balanced tree, O(log n) lookup. Best for:
              most workloads, range queries, sorting. Supports: equality, range, sorting,
              prefix matching. Use for: default index type, general-purpose. Hash: hash
              table, O(1) lookup. Best for: equality-only lookups, in-memory indexes.
              Supports: equality only. Use for: exact match queries (primary key lookups).
              Bitmap: bit arrays per value. Best for: low-cardinality columns (gender,
              status), data warehouses (read-heavy). Supports: complex predicates (bitwise
              operations). Use for: data warehousing, low-cardinality columns.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Why not use Hash for everything? Answer: Hash
              doesn't support range queries (hash destroys ordering), sorting (hash not
              ordered), prefix matching. B-Tree is more versatile (supports equality +
              range + sorting).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What is a composite index? How does column order affect query performance?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Composite index spans multiple columns:
              <code className="inline-code">CREATE INDEX ON users (last_name,
              first_name)</code>. Column order matters due to leftmost prefix rule: index
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
              Q4: What is a covering index? When would you use one?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Covering index includes all columns needed by query.
              Example: query <code className="inline-code">SELECT id, email FROM users WHERE
              status = 'active'</code>, covering index <code className="inline-code">(status,
              id, email)</code>. Query satisfied entirely from index (no table lookup)—fastest
              possible (index-only scan). Use for: high-traffic queries (optimize common
              queries), queries with expensive table lookups (large rows, many columns),
              queries where index is much smaller than table (storage efficient). Trade-off:
              larger index size (more columns = bigger index).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you know if a query uses covering index?
              Answer: EXPLAIN ANALYZE shows "Index Only Scan" (PostgreSQL) or "Using index"
              (MySQL). No "Heap Fetch" or "Table lookup" = covering index used.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: How do indexes affect write performance? How do you balance read vs write
              performance?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Indexes slow writes: every INSERT, UPDATE, DELETE
              must update all indexes on affected columns. Table with 10 indexes: each
              INSERT becomes 11 operations (1 table + 10 indexes). Write overhead: 10-30%
              per index (depends on index type, size). Balance: (1) Index selectively
              (only columns used in WHERE/JOIN/ORDER BY), (2) Monitor write performance
              (if writes slow, review indexes), (3) Consider partial indexes (index subset
              of rows), (4) For write-heavy tables, minimize indexes (prioritize write
              performance).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if you need both fast reads and fast writes?
              Answer: Can't have both perfectly. Compromise: index only critical columns
              (WHERE, JOIN), use covering indexes for critical queries (reduces need for
              multiple indexes), consider read replicas (offload reads to replicas, primary
              handles writes).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your queries are slow. How do you diagnose and fix indexing issues?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) EXPLAIN ANALYZE slow queries (shows
              query plan, execution time), (2) Check for sequential scans (full table
              scans—missing index), (3) Check index usage (pg_stat_user_indexes—zero
              scans = unused index), (4) Check index fragmentation (fragmented indexes
              are slower). Fix: (1) Create missing indexes (WHERE, JOIN, ORDER BY columns),
              (2) Remove unused indexes (zero scans—waste storage, slow writes), (3)
              REINDEX fragmented indexes (rebuild), (4) ANALYZE tables (update statistics—
              query planner needs accurate stats), (5) Consider covering indexes (for
              high-traffic queries).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you prevent indexing issues in future?
              Answer: Monitor index usage (alert on unused indexes), review query plans
              regularly (EXPLAIN ANALYZE for new queries), index selectively (don't over-index),
              schedule maintenance (REINDEX, ANALYZE).
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
              href="https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MySQL Documentation — Optimization and Indexes
            </a>
          </li>
          <li>
            <a
              href="https://docs.oracle.com/en/database/oracle/oracle-database/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Oracle Documentation — Database Indexing Guide
            </a>
          </li>
          <li>
            <a
              href="https://docs.microsoft.com/en-us/sql/relational-databases/indexes/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SQL Server Documentation — Indexes
            </a>
          </li>
          <li>
            <a
              href="https://use-the-index-luke.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Use The Index, Luke — Database Indexing Best Practices
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
              CMU Database Group — Database Indexing (YouTube lectures)
            </a>
          </li>
          <li>
            <a
              href="https://www.brentozar.com/archive/sql-server-indexing/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brent Ozar — SQL Server Indexing
            </a>
          </li>
          <li>
            <a
              href="https://www.percona.com/blog/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Percona Blog — MySQL Indexing Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
