"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-query-optimization-complete",
  title: "Query Optimization Techniques",
  description:
    "Comprehensive guide to query optimization: EXPLAIN ANALYZE, query execution plans, join algorithms, predicate pushdown, and techniques for diagnosing and fixing slow queries.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "query-optimization-techniques",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "query-optimization", "database", "performance"],
  relatedTopics: [
    "database-indexes",
    "index-types",
    "sql-queries-optimization",
    "query-patterns",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Query Optimization Techniques</h1>
        <p className="lead">
          Query optimization is the process of improving database query performance by analyzing
          query execution plans, identifying bottlenecks, and applying optimization techniques.
          Database query planners automatically choose execution strategies (index scan vs
          sequential scan, join algorithms, sort methods), but they need accurate statistics
          and appropriate indexes to make good choices. Understanding query execution
          (parsing → optimization → execution), reading EXPLAIN output, and applying optimization
          techniques can improve query performance by 10-100x.
        </p>

        <p>
          Consider a slow query: <code className="inline-code">SELECT * FROM orders WHERE
          customer_id = 123 AND status = 'pending' ORDER BY created_at DESC</code>. Without
          optimization: sequential scan (5 seconds). With optimization: add composite index
          <code className="inline-code">(customer_id, status, created_at)</code>, rewrite to
          select specific columns, update statistics. Result: index scan (50ms). 100x improvement
          through systematic optimization.
        </p>

        <p>
          Query optimization involves multiple layers: <strong>Query planning</strong> (database
          chooses execution strategy), <strong>Index optimization</strong> (appropriate indexes
          for query patterns), <strong>Query rewriting</strong> (simplify complex queries,
          eliminate anti-patterns), <strong>Statistics maintenance</strong> (accurate stats for
          good planning). Each layer contributes to overall performance.
        </p>

        <p>
          This article provides a comprehensive examination of query optimization: query execution
          pipeline (parsing, optimization, execution), reading EXPLAIN ANALYZE output (estimated
          vs actual rows, cost, time), join algorithms (nested loop, hash, merge), optimization
          techniques (predicate pushdown, index usage, query rewriting), and real-world use cases.
          We'll explore when optimization excels (slow query diagnosis, performance tuning) and
          when it introduces complexity (over-optimization, premature optimization). We'll also
          cover common pitfalls (SELECT *, correlated subqueries, N+1 queries) and best practices
          for systematic optimization.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/query-optimization-techniques.svg`}
          caption="Figure 1: Query Optimization Techniques showing Query Execution Pipeline: (1) Parsing (syntax check, validate objects), (2) Optimization (generate execution plans, choose best), (3) Execution (execute plan, fetch/return results). Optimization phase is where query speed is determined—query planner uses statistics to choose plan. Optimization Strategies: Index Usage (use indexes for WHERE, JOIN, ORDER BY), Predicate Pushdown (filter early, reduce rows processed), Join Optimization (choose join algorithm: nested loop, hash, merge), Query Rewriting (simplify, eliminate redundant operations). Common Query Optimizations: SELECT * → select specific columns, Correlated Subquery → JOIN or CTE, OR Conditions → UNION or IN clause, N+1 Queries → eager loading."
          alt="Query optimization techniques"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Query Execution &amp; Planning</h2>

        <h3>Query Execution Pipeline</h3>
        <p>
          Database query execution has three phases: <strong>Parsing</strong> (syntax check,
          validate table/column names, check permissions), <strong>Optimization</strong>
          (generate multiple execution plans, estimate costs, choose best plan),
          <strong>Execution</strong> (execute chosen plan, fetch data, return results).
        </p>

        <p>
          The <strong>optimization phase</strong> is where query speed is determined. Query
          planner generates multiple plans: sequential scan vs index scan, nested loop vs
          hash join vs merge join, different join orders. For each plan, planner estimates
          cost (I/O, CPU, memory) based on table statistics. Lowest cost plan is chosen.
        </p>

        <p>
          <strong>Statistics</strong> are critical for good planning: row counts, distinct
          values, null counts, value distributions, correlations. Outdated statistics →
          wrong cost estimates → bad plan choice → slow queries. Run
          <code className="inline-code">ANALYZE</code> regularly to update statistics.
        </p>

        <h3>EXPLAIN and EXPLAIN ANALYZE</h3>
        <p>
          <strong>EXPLAIN</strong> shows query execution plan without executing:
          <code className="inline-code">EXPLAIN SELECT * FROM users WHERE email = ?</code>.
          Output shows: scan type (sequential, index), estimated cost, estimated rows,
          join algorithms, sort methods.
        </p>

        <p>
          <strong>EXPLAIN ANALYZE</strong> executes query and shows actual performance:
          <code className="inline-code">EXPLAIN ANALYZE SELECT * FROM users WHERE email = ?</code>.
          Output shows: estimated vs actual rows, estimated vs actual time (ms), loops
          (how many times operation executed). Compare estimated vs actual to identify
          planning issues.
        </p>

        <p>
          Reading EXPLAIN output: <strong>cost</strong> (startup..total—estimated cost units),
          <strong>rows</strong> (estimated rows returned), <strong>width</strong> (average
          row size in bytes), <strong>actual time</strong> (startup..total in milliseconds),
          <strong>actual rows</strong> (rows actually returned), <strong>loops</strong>
          (times operation executed).
        </p>

        <h3>Join Algorithms</h3>
        <p>
          Database chooses join algorithm based on data size, indexes, and statistics:
        </p>

        <p>
          <strong>Nested Loop Join</strong>: For each row in outer table, scan inner table
          (or use index). Best for: small tables, indexed joins (inner table has index on
          join column). Complexity: O(n×m) without index, O(n log m) with index.
        </p>

        <p>
          <strong>Hash Join</strong>: Build hash table from smaller table, probe with larger
          table. Best for: large tables, unsorted data, equality joins. Complexity: O(n+m).
          Requires memory for hash table (may spill to disk if too large).
        </p>

        <p>
          <strong>Merge Join</strong>: Both inputs sorted on join key, merge in single pass.
          Best for: sorted data (from index or sort), large result sets, range joins.
          Complexity: O(n+m) if already sorted, O(n log n + m log m) if sort needed.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/query-optimization-explain.svg`}
          caption="Figure 2: EXPLAIN ANALYZE and Query Plans showing Reading EXPLAIN Output (Seq Scan on users, cost=0.00..35.50 rows=1000 width=50, Filter: email = ?, Actual time=0.500..15.200 rows=1 loops=1). Cost: estimated cost (startup..total), rows: estimated rows returned, actual: actual time (startup..total) in ms. Join Algorithms: Nested Loop (small tables, indexed joins), Hash Join (large tables, unsorted data), Merge Join (sorted data, large result sets). Common Performance Bottlenecks: Seq Scan Large (missing index), High Actual Rows (bad estimates), Sort Operations (missing index for ORDER BY), Materialize (temp storage). Key takeaway: EXPLAIN ANALYZE shows actual execution. Compare estimated vs actual rows. Look for seq scans, sorts, high row counts."
          alt="EXPLAIN ANALYZE and query plans"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Optimization Techniques</h2>

        <h3>Index Usage Optimization</h3>
        <p>
          Query planner chooses between index scan and sequential scan based on cost estimates.
          Index scan is faster for selective queries (few rows match). Sequential scan is
          faster for non-selective queries (many rows match—overhead of index lookups exceeds
          sequential read benefit).
        </p>

        <p>
          <strong>When indexes are used</strong>: WHERE clause columns (equality, range),
          JOIN keys (foreign keys), ORDER BY columns (index avoids sort), covering indexes
          (index-only scan). <strong>When indexes are NOT used</strong>: functions on
          columns (<code className="inline-code">WHERE LOWER(email) = ?</code>), type
          mismatches (string vs number), OR conditions (may use index merge), low selectivity
          (few distinct values).
        </p>

        <p>
          Optimization: <strong>Create appropriate indexes</strong> (WHERE, JOIN, ORDER BY
          columns), <strong>Avoid functions on indexed columns</strong> (use functional
          indexes if needed), <strong>Ensure type compatibility</strong> (match column
          types), <strong>Use covering indexes</strong> (avoid table lookups).
        </p>

        <h3>Predicate Pushdown</h3>
        <p>
          <strong>Predicate pushdown</strong> moves filters as close to data source as
          possible. Instead of joining tables then filtering, filter each table first,
          then join. Reduces rows processed, improves performance.
        </p>

        <p>
          Example: <code className="inline-code">SELECT * FROM orders JOIN customers ON
          orders.customer_id = customers.id WHERE customers.country = 'US' AND
          orders.total &gt; 100</code>. Optimized: filter customers by country first,
          filter orders by total first, then join. Much fewer rows to join.
        </p>

        <p>
          Query planners automatically push down predicates, but complex queries (subqueries,
          views) may prevent pushdown. Solution: rewrite query (CTEs, derived tables) to
          enable pushdown.
        </p>

        <h3>Query Rewriting</h3>
        <p>
          <strong>Query rewriting</strong> transforms queries into equivalent but more
          efficient forms. Common rewrites:
        </p>

        <p>
          <strong>SELECT * → specific columns</strong>: Fetching unnecessary columns wastes
          I/O, memory, network. Select only needed columns. Benefit: less data transferred,
          enables covering indexes.
        </p>

        <p>
          <strong>Correlated subquery → JOIN</strong>: Correlated subquery executes once
          per outer row (slow). Rewrite as JOIN (executes once). Example:
          <code className="inline-code">SELECT * FROM orders WHERE total &gt; (SELECT AVG(total)
          FROM orders WHERE customer_id = orders.customer_id)</code> → rewrite with JOIN
          or window function.
        </p>

        <p>
          <strong>OR conditions → UNION or IN</strong>:
          <code className="inline-code">WHERE id = 1 OR id = 2 OR id = 3</code> →
          <code className="inline-code">WHERE id IN (1, 2, 3)</code>. IN clause is more
          efficient (single index scan vs multiple).
        </p>

        <p>
          <strong>N+1 queries → eager loading</strong>: N+1 pattern: fetch parent (1 query),
          then fetch children for each parent (N queries). Solution: eager loading
          (single query with JOIN or IN clause).
        </p>

        <h3>Statistics Maintenance</h3>
        <p>
          Query planner needs accurate statistics for good plans. Outdated statistics →
          wrong estimates → bad plans. Symptoms: estimated rows ≠ actual rows (10x
          difference), sequential scan chosen over index scan (or vice versa), wrong join
          algorithm.
        </p>

        <p>
          <strong>ANALYZE</strong> updates statistics: <code className="inline-code">ANALYZE
          users</code> (single table), <code className="inline-code">ANALYZE</code> (all
          tables). Run after: bulk operations (INSERT/UPDATE/DELETE many rows), index
          creation, schema changes. Schedule: daily for high-change tables, weekly for
          moderate, monthly for static.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/query-optimization-use-cases.svg`}
          caption="Figure 3: Query Optimization Use Cases and Best Practices. Primary Use Cases: Slow Query Diagnosis (EXPLAIN ANALYZE slow queries, identify bottlenecks like seq scan/sort, check missing indexes, update statistics with ANALYZE, 10-100x improvement typical), Query Rewriting (replace SELECT * with columns, correlated subquery → JOIN, OR conditions → UNION/IN, N+1 queries → eager loading, simplify complex expressions), Index Optimization (add missing indexes, create covering indexes, remove unused indexes, fix composite index order, consider partial indexes). Query Optimization Checklist: (1) EXPLAIN ANALYZE (understand execution), (2) Check Indexes (WHERE, JOIN, ORDER BY), (3) Update Stats (ANALYZE tables), (4) Rewrite (simplify query). Anti-patterns: SELECT * (fetches unnecessary columns), correlated subqueries (executed per row), N+1 queries (one query per result), missing WHERE clause indexes, outdated statistics (wrong query plans)."
          alt="Query optimization use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Optimization Approaches</h2>

        <p>
          Different optimization approaches have trade-offs. Understanding them helps you
          choose the right technique for each situation.
        </p>

        <h3>Index Scan vs Sequential Scan</h3>
        <p>
          <strong>Index scan</strong>: Use index to find matching rows. Best for: selective
          queries (few rows match, &lt;10% of table), indexed columns. Trade-offs: random
          I/O (slower per row), index lookup overhead.
        </p>

        <p>
          <strong>Sequential scan</strong>: Read entire table. Best for: non-selective
          queries (many rows match, &gt;10% of table), small tables, no appropriate index.
          Trade-offs: sequential I/O (faster per row), reads all rows (wasteful for
          selective queries).
        </p>

        <p>
          Query planner chooses based on selectivity estimates. If estimates are wrong
          (outdated statistics), wrong scan type is chosen. Fix: update statistics
          (ANALYZE).
        </p>

        <h3>Join Algorithm Comparison</h3>
        <p>
          <strong>Nested Loop</strong>: Best for small tables or indexed joins. Fast when
          inner table has index (O(n log m)). Slow for large tables without indexes
          (O(n×m)). Use when: small result set, indexed join column.
        </p>

        <p>
          <strong>Hash Join</strong>: Best for large tables, unsorted data. Fast for
          equality joins (O(n+m)). Requires memory for hash table (may spill to disk).
          Use when: large tables, no indexes, equality join.
        </p>

        <p>
          <strong>Merge Join</strong>: Best for sorted data, large result sets. Fast if
          already sorted (O(n+m)), slower if sort needed (O(n log n + m log m)). Use when:
          data sorted (from index), range joins, large result sets.
        </p>

        <h3>Query Rewriting Trade-offs</h3>
        <p>
          <strong>CTEs vs Subqueries</strong>: CTEs improve readability, can be materialized
          (computed once). But some databases don't push predicates into CTEs (slower).
          Subqueries may be optimized better (predicate pushdown). Use CTEs for readability,
          subqueries for performance (test both).
        </p>

        <p>
          <strong>UNION vs OR</strong>: UNION executes queries separately, combines results.
          OR executes single query with multiple conditions. UNION can use different indexes
          for each part (faster). OR may use index merge (slower). Use UNION for different
          indexes, OR for same index.
        </p>

        <h3>Optimization Effort vs Benefit</h3>
        <p>
          <strong>Quick wins</strong> (high benefit, low effort): Add missing indexes,
          update statistics, fix SELECT *. <strong>Moderate effort</strong>: Rewrite
          correlated subqueries, create covering indexes, fix composite index order.
          <strong>High effort</strong>: Schema changes, partitioning, denormalization.
        </p>

        <p>
          Prioritize: (1) Identify slow queries (query logs, monitoring), (2) Quick wins
          first (indexes, statistics), (3) Moderate effort (query rewriting), (4) High
          effort only if necessary (schema changes).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Query Optimization</h2>

        <p>
          <strong>Start with EXPLAIN ANALYZE.</strong> Never optimize blind. Run EXPLAIN
          ANALYZE on slow queries, understand execution plan, identify bottlenecks (seq
          scans, sorts, high row counts). Compare estimated vs actual rows (large
          difference = statistics issue).
        </p>

        <p>
          <strong>Create appropriate indexes.</strong> Index WHERE, JOIN, ORDER BY columns.
          Use composite indexes for multi-column queries (follow leftmost prefix rule).
          Consider covering indexes for high-traffic queries. Remove unused indexes
          (waste storage, slow writes).
        </p>

        <p>
          <strong>Keep statistics current.</strong> Schedule ANALYZE: daily for high-change
          tables, weekly for moderate, monthly for static. Run ANALYZE after bulk operations.
          Monitor statistics age (some databases show last analyze time).
        </p>

        <p>
          <strong>Rewrite anti-patterns.</strong> Replace SELECT * with specific columns.
          Rewrite correlated subqueries as JOINs. Convert N+1 queries to eager loading.
          Simplify OR conditions (use IN or UNION).
        </p>

        <p>
          <strong>Test optimization impact.</strong> Before: measure query time, explain
          plan. After: measure again. Verify improvement. Use EXPLAIN ANALYZE to confirm
          plan changed (index scan instead of seq scan, hash join instead of nested loop).
        </p>

        <p>
          <strong>Monitor query performance.</strong> Track slow queries (query logs,
          pg_stat_statements, performance_schema). Alert on regression (query time
          increased). Review slow queries regularly (weekly/monthly).
        </p>

        <p>
          <strong>Consider query patterns.</strong> Optimize for common queries, not edge
          cases. If query patterns change, indexes may need updating. Review index usage
          periodically (remove unused, add missing).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>SELECT * anti-pattern.</strong> Fetching all columns wastes I/O, memory,
          network. Solution: Select only needed columns. Benefit: less data transferred,
          enables covering indexes.
        </p>

        <p>
          <strong>Correlated subqueries.</strong> Subquery references outer query, executes
          once per outer row (very slow). Solution: Rewrite as JOIN or use window functions.
          Benefit: executes once, not N times.
        </p>

        <p>
          <strong>N+1 queries.</strong> Fetch parent (1 query), then fetch children for
          each parent (N queries). Common in ORMs. Solution: Eager loading (JOIN or IN
          clause). Benefit: 1-2 queries instead of N+1.
        </p>

        <p>
          <strong>Functions on indexed columns.</strong>
          <code className="inline-code">WHERE LOWER(email) = ?</code> prevents index usage.
          Solution: Use functional index, or store normalized data. Benefit: index can be
          used.
        </p>

        <p>
          <strong>Outdated statistics.</strong> Query planner makes wrong decisions with
          outdated stats. Solution: Schedule ANALYZE regularly, run after bulk operations.
          Benefit: accurate estimates, good query plans.
        </p>

        <p>
          <strong>Over-optimization.</strong> Optimizing queries that run once/month is
          wasted effort. Solution: Focus on high-traffic, slow queries (Pareto principle:
          20% of queries cause 80% of problems). Benefit: effort spent where it matters.
        </p>

        <p>
          <strong>Premature optimization.</strong> Optimizing before measuring is guessing.
          Solution: Measure first (EXPLAIN ANALYZE), identify actual bottlenecks, optimize
          based on data. Benefit: time spent on real problems.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Order Search</h3>
        <p>
          E-commerce order search: <code className="inline-code">SELECT * FROM orders WHERE
          customer_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 20</code>.
          Slow (5 seconds): sequential scan, sort. Optimized: composite index
          <code className="inline-code">(customer_id, status, created_at)</code>, select
          specific columns. Result: index scan, no sort (50ms). 100x improvement.
        </p>

        <p>
          This pattern works because queries filter by customer_id and status, sort by
          created_at. Composite index matches query pattern exactly (filter + sort).
        </p>

        <h3>Analytics Dashboard</h3>
        <p>
          Analytics dashboard aggregates: <code className="inline-code">SELECT DATE(created_at),
          COUNT(*), SUM(total) FROM orders GROUP BY DATE(created_at) ORDER BY 1</code>.
          Slow (10 seconds): full table scan, hash aggregate. Optimized: materialized view
          (pre-computed daily aggregates), refresh hourly. Result: query pre-computed data
          (100ms). 100x improvement.
        </p>

        <p>
          This pattern works because dashboard queries are repetitive (same aggregation),
          data changes infrequently (hourly refresh acceptable), pre-computation is much
          faster than real-time aggregation.
        </p>

        <h3>User Feed Generation</h3>
        <p>
          Social media feed: N+1 query pattern (fetch user's followed users, then fetch
          posts for each). Slow (2 seconds, 50 queries). Optimized: eager loading
          <code className="inline-code">SELECT * FROM posts WHERE user_id IN (SELECT
          followed_id FROM follows WHERE follower_id = ?)</code>. Result: 2 queries
          (100ms). 20x improvement.
        </p>

        <p>
          This pattern works because N+1 is classic anti-pattern (one query per result),
          eager loading fetches all results in single query (IN clause or JOIN).
        </p>

        <h3>Report Generation</h3>
        <p>
          Monthly report: complex query with multiple JOINs, aggregations, filters. Slow
          (30 seconds). Optimized: (1) EXPLAIN ANALYZE identified hash join spilling to
          disk (memory issue), (2) Increased work_mem, (3) Added covering index for
          subquery. Result: hash join in memory, index-only scan (2 seconds). 15x
          improvement.
        </p>

        <p>
          This pattern works because complex queries benefit from multiple optimizations
          (memory tuning, indexes, query rewriting). Systematic approach (EXPLAIN, identify,
          fix) yields compounding improvements.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: How do you diagnose a slow query? What steps do you take?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose slow queries systematically: (1) Identify
              slow query (query logs, monitoring tools like pg_stat_statements), (2) Run
              EXPLAIN ANALYZE (understand execution plan, actual time), (3) Check for
              sequential scans on large tables (missing index), (4) Check estimated vs
              actual rows (large difference = outdated statistics), (5) Check sort
              operations (missing index for ORDER BY), (6) Check join algorithms (wrong
              choice = statistics issue). Fix: (1) Add missing indexes (WHERE, JOIN,
              ORDER BY), (2) Update statistics (ANALYZE), (3) Rewrite query (eliminate
              anti-patterns), (4) Tune configuration (work_mem, effective_cache_size).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if EXPLAIN shows index is used but query
              is still slow? Answer: Index may not be selective enough (too many rows
              match), or query may need covering index (avoid table lookup), or there
              may be lock contention (check pg_locks), or resources may be exhausted
              (check CPU, memory, I/O).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What is the difference between EXPLAIN and EXPLAIN ANALYZE? When would
              you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> EXPLAIN shows query plan without executing: estimated
              cost, rows, scan type, join algorithm. Safe for any query (no side effects).
              Use for: understanding planned execution, checking if index will be used,
              comparing alternative queries. EXPLAIN ANALYZE executes query and shows
              actual performance: actual time (ms), actual rows, loops. Use for: diagnosing
              slow queries, comparing estimated vs actual (identifies statistics issues),
              measuring optimization impact. Caution: EXPLAIN ANALYZE executes query (don't
              use for destructive queries like DELETE without LIMIT).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What does large difference between estimated and
              actual rows indicate? Answer: Outdated statistics. Query planner made wrong
              cost estimates, chose suboptimal plan. Fix: Run ANALYZE to update statistics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: What is a correlated subquery? Why is it slow and how do you fix it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Correlated subquery references outer query, executes
              once per outer row. Example: <code className="inline-code">SELECT * FROM
              orders WHERE total &gt; (SELECT AVG(total) FROM orders WHERE customer_id =
              orders.customer_id)</code>. Subquery executes once per order (very slow for
              large tables). Fix: (1) Rewrite as JOIN (compute AVG once, join), (2) Use
              window function (<code className="inline-code">AVG(total) OVER (PARTITION BY
              customer_id)</code>), (3) Use CTE (compute AVG per customer once, join).
              Benefit: executes once or per-group, not per-row.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Are correlated subqueries always bad? Answer:
              No. For small outer tables (few rows), overhead is negligible. Some databases
              optimize correlated subqueries well (convert to JOIN internally). But as
              rule of thumb, rewrite for large tables.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: What is N+1 query problem? How do you identify and fix it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> N+1 pattern: fetch parent records (1 query), then
              fetch children for each parent (N queries). Example: fetch 100 users (1
              query), then fetch orders for each user (100 queries) = 101 queries total.
              Identify: (1) Query logs show many similar queries, (2) ORM debug mode
              shows N+1 pattern, (3) Monitoring shows high query count per request. Fix:
              (1) Eager loading (JOIN: <code className="inline-code">SELECT users.*,
              orders.* FROM users LEFT JOIN orders ON ...</code>), (2) IN clause
              (<code className="inline-code">SELECT * FROM orders WHERE user_id IN
              (1,2,3,...)</code>), (3) ORM-specific (Rails: includes, Django:
              select_related/prefetch_related). Benefit: 1-2 queries instead of N+1.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When would you NOT fix N+1? Answer: When N is
              small (1-10), overhead of eager loading may exceed N+1 cost. Or when you
              only need children for subset of parents (lazy loading is better). Profile
              before optimizing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: How do you choose between nested loop, hash join, and merge join?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Query planner chooses automatically, but understanding
              helps optimization. Nested loop: best for small tables or indexed joins
              (inner table has index on join column). Fast when outer table is small. Hash
              join: best for large tables, unsorted data, equality joins. Builds hash table
              from smaller table, probes with larger. Merge join: best for sorted data
              (from index or sort), large result sets, range joins. Both inputs sorted on
              join key, merge in single pass. If planner chooses wrong: update statistics
              (ANALYZE), add/remove indexes, use hints (database-specific).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if hash join spills to disk? Answer: Hash
              table doesn't fit in memory (work_mem in PostgreSQL). Fix: increase work_mem
              (if memory available), or optimize query (reduce rows before join), or add
              indexes to enable nested loop.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your query uses an index but is still slow. What could be the issue and
              how do you fix it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Possible issues: (1) Index not selective enough
              (too many rows match—index scan becomes slower than seq scan), (2) Table
              lookup overhead (index scan requires random I/O to fetch rows), (3) Wrong
              index (index exists but doesn't match query pattern), (4) Lock contention
              (waiting for locks), (5) Resource exhaustion (CPU, memory, I/O saturated),
              (6) Outdated statistics (planner chose wrong index). Fix: (1) Create covering
              index (avoid table lookup), (2) Create more selective index, (3) Update
              statistics (ANALYZE), (4) Check locks (pg_locks), (5) Check resources
              (CPU, memory, I/O), (6) Consider query rewriting.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is a covering index? Answer: Index includes
              all columns needed by query. Query satisfied entirely from index (no table
              lookup). Example: query <code className="inline-code">SELECT id, email FROM
              users WHERE status = ?</code>, covering index <code className="inline-code">(status,
              id, email)</code>. Fastest possible (index-only scan).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            PostgreSQL Documentation, "Using EXPLAIN,"
            https://www.postgresql.org/docs/current/using-explain.html
          </li>
          <li>
            MySQL Documentation, "Optimizing Queries with EXPLAIN,"
            https://dev.mysql.com/doc/refman/8.0/en/explain.html
          </li>
          <li>
            SQL Server Documentation, "Query Execution Plans,"
            https://docs.microsoft.com/en-us/sql/relational-databases/query-execution-plan-guide
          </li>
          <li>
            Oracle Documentation, "SQL Tuning,"
            https://docs.oracle.com/en/database/oracle/oracle-database/
          </li>
          <li>
            Use The Index, Luke, "The WHERE Clause,"
            https://use-the-index-luke.com/sql/where-clause
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapter 5.
          </li>
          <li>
            CMU Database Group, "Query Optimization" (YouTube lectures),
            https://www.youtube.com/c/CMUDatabaseGroup
          </li>
          <li>
            Brent Ozar, "SQL Server Query Tuning,"
            https://www.brentozar.com/archive/sql-server-query-tuning/
          </li>
          <li>
            Percona Blog, "Query Optimization Best Practices,"
            https://www.percona.com/blog/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
