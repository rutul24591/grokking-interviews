"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sql-queries-optimization-complete",
  title: "SQL Queries and Optimization",
  description:
    "Comprehensive guide to SQL query optimization: efficient query patterns, JOIN optimization, subquery vs JOIN, pagination strategies, and best practices for writing performant SQL.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "sql-queries-optimization",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "sql", "query-optimization", "database"],
  relatedTopics: [
    "database-indexes",
    "query-optimization-techniques",
    "query-patterns",
    "index-types",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>SQL Queries and Optimization</h1>
        <p className="lead">
          SQL query optimization involves writing efficient SQL statements that minimize resource
          usage (I/O, CPU, memory) while maximizing performance. Well-optimized queries use
          appropriate indexes, avoid anti-patterns (SELECT *, correlated subqueries), leverage
          efficient patterns (JOINs over subqueries, keyset pagination), and follow best practices
          (prepared statements, batch operations). Poor SQL can be 100-1000x slower than optimized
          SQL for the same data. Understanding query patterns, JOIN optimization, and common
          pitfalls is essential for database performance.
        </p>

        <p>
          Consider a paginated query: <code className="inline-code">SELECT * FROM orders ORDER BY
          created_at DESC LIMIT 20 OFFSET 10000</code>. This scans and sorts 10,020 rows, returns
          20 (slow for deep pages). Optimized: keyset pagination
          <code className="inline-code">SELECT * FROM orders WHERE created_at &lt; ? ORDER BY
          created_at DESC LIMIT 20</code> with index on <code className="inline-code">created_at</code>.
          This scans only 20 rows (100-1000x faster for deep pages).
        </p>

        <p>
          SQL optimization involves multiple layers: <strong>Query patterns</strong> (efficient
          ways to write queries), <strong>JOIN optimization</strong> (choosing right JOIN type,
          indexing JOIN keys), <strong>Subquery optimization</strong> (rewriting as JOINs, using
          EXISTS), <strong>Pagination strategies</strong> (OFFSET vs keyset), <strong>Bulk
          operations</strong> (batch INSERT/UPDATE). Each layer contributes to overall performance.
        </p>

        <p>
          This article provides a comprehensive examination of SQL query optimization: efficient
          query patterns (LIMIT, EXISTS, UNION ALL), JOIN optimization (types, performance,
          indexing), subquery patterns (correlated vs non-correlated, EXISTS vs IN), pagination
          strategies (OFFSET vs keyset), bulk operations (batch INSERT, COPY), and real-world
          use cases. We'll explore when optimization excels (writing efficient SQL, avoiding
          anti-patterns) and when it introduces complexity (over-optimization, premature
          optimization). We'll also cover common pitfalls (SELECT *, Cartesian products, functions
          on indexed columns) and best practices for systematic optimization.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/sql-queries-optimization.svg`}
          caption="Figure 1: SQL Query Optimization Patterns showing Efficient Query Patterns: Use LIMIT/OFFSET for Pagination (prevent fetching all rows), Use EXISTS instead of IN for Subqueries (EXISTS short-circuits on first match), Use UNION ALL instead of UNION (UNION removes duplicates - slower), Avoid SELECT * (fetch only needed columns). Query Anti-Patterns: Functions on Indexed Columns (WHERE LOWER(email) = ? - no index used), Implicit Type Conversion (WHERE string_column = 123 - no index), Leading Wildcard LIKE (LIKE '%pattern' - no index), Cartesian Products (missing JOIN condition). SQL Optimization Techniques: Use CTEs (improve readability), Window Functions (replace self-joins), Batch Operations (reduce round trips), Prepared Statements (prevent SQL injection)."
          alt="SQL query optimization patterns"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Query Patterns &amp; Anti-Patterns</h2>

        <h3>Efficient Query Patterns</h3>
        <p>
          <strong>Use LIMIT/OFFSET for pagination</strong>: Prevents fetching all rows.
          <code className="inline-code">SELECT * FROM orders ORDER BY created_at DESC LIMIT 20
          OFFSET 40</code> fetches page 3 (20 rows per page). Trade-off: OFFSET becomes slow
          for deep pages (scans all previous rows). Solution: keyset pagination (see below).
        </p>

        <p>
          <strong>Use EXISTS instead of IN for subqueries</strong>: EXISTS short-circuits on
          first match. <code className="inline-code">SELECT * FROM customers WHERE EXISTS
          (SELECT 1 FROM orders WHERE orders.customer_id = customers.id)</code>. IN evaluates
          entire subquery first. EXISTS is faster for large subquery results.
        </p>

        <p>
          <strong>Use UNION ALL instead of UNION</strong>: UNION removes duplicates (requires
          sort, slower). UNION ALL keeps duplicates (no sort, faster). Use UNION only when
          duplicates must be removed. <code className="inline-code">SELECT id FROM table1
          UNION ALL SELECT id FROM table2</code> (faster than UNION).
        </p>

        <p>
          <strong>Select specific columns</strong>: <code className="inline-code">SELECT id,
          email FROM users</code> vs <code className="inline-code">SELECT * FROM users</code>.
          Benefits: less I/O, less network transfer, enables covering indexes, reduces memory
          usage.
        </p>

        <h3>Query Anti-Patterns</h3>
        <p>
          <strong>Functions on indexed columns</strong>:
          <code className="inline-code">WHERE LOWER(email) = ?</code> prevents index usage
          (function must be evaluated for every row). Solution: use functional index
          <code className="inline-code">CREATE INDEX ON users (LOWER(email))</code>, or store
          normalized data.
        </p>

        <p>
          <strong>Implicit type conversion</strong>:
          <code className="inline-code">WHERE string_column = 123</code> (number compared to
          string) forces type conversion, prevents index usage. Solution: match types
          <code className="inline-code">WHERE string_column = '123'</code>.
        </p>

        <p>
          <strong>Leading wildcard LIKE</strong>: <code className="inline-code">WHERE name
          LIKE '%pattern'</code> prevents index usage (can't use index for suffix matching).
          Solution: use full-text search, trailing wildcard only
          <code className="inline-code">LIKE 'pattern%'</code>, or reverse index
          (<code className="inline-code">WHERE REVERSE(name) LIKE 'nrettap%'</code>).
        </p>

        <p>
          <strong>Cartesian products</strong>: Missing JOIN condition creates Cartesian product
          (all rows from table1 × all rows from table2).
          <code className="inline-code">SELECT * FROM table1, table2</code> (no WHERE).
          Solution: always specify JOIN condition, use explicit JOIN syntax
          (<code className="inline-code">INNER JOIN ... ON</code>).
        </p>

        <h3>CTEs and Window Functions</h3>
        <p>
          <strong>CTEs (Common Table Expressions)</strong> improve readability and can optimize
          queries: <code className="inline-code">WITH active_users AS (SELECT * FROM users
          WHERE active = true) SELECT * FROM active_users WHERE ...</code>. CTEs are evaluated
          once, can be referenced multiple times. Some databases materialize CTEs (computed
          once), others inline them (substituted into query).
        </p>

        <p>
          <strong>Window functions</strong> enable complex analytics without self-joins:
          <code className="inline-code">SELECT id, salary, AVG(salary) OVER (PARTITION BY
          department) FROM employees</code>. Benefits: single pass, no self-join, cleaner
          syntax. Common window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, running
          totals, moving averages.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/sql-queries-join.svg`}
          caption="Figure 2: JOIN Optimization and Subquery Patterns showing JOIN Types and Performance: INNER JOIN (Fastest - returns only matching rows), LEFT JOIN (Moderate - returns all left + matching right), CROSS JOIN (Slowest - Cartesian product, avoid!). Subquery vs JOIN: Correlated Subquery (Slow - executes once per outer row) → Rewrite as JOIN (Fast - executes once). JOIN and Subquery Best Practices: Index JOIN Keys (foreign keys), Use EXISTS for Boolean (short-circuits), Avoid SELECT * (select needed columns), Use CTEs (complex queries). Key takeaway: Prefer JOINs over subqueries. Index JOIN keys. Use EXISTS for boolean checks. Avoid CROSS JOINs and correlated subqueries."
          alt="JOIN optimization and subquery patterns"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: JOINs &amp; Pagination</h2>

        <h3>JOIN Optimization</h3>
        <p>
          <strong>JOIN types and performance</strong>: INNER JOIN (fastest—only matching rows),
          LEFT JOIN (moderate—all left rows + matching right), RIGHT JOIN (similar to LEFT),
          FULL OUTER JOIN (slowest—all rows from both), CROSS JOIN (avoid—Cartesian product).
        </p>

        <p>
          <strong>Index JOIN keys</strong>: Foreign keys and JOIN columns should be indexed.
          <code className="inline-code">SELECT * FROM orders JOIN customers ON
          orders.customer_id = customers.id</code>—index on
          <code className="inline-code">orders.customer_id</code> enables efficient lookup.
          Without index: nested loop with full table scan (slow). With index: nested loop with
          index lookup (fast).
        </p>

        <p>
          <strong>Subquery vs JOIN</strong>: Correlated subqueries execute once per outer row
          (slow). Rewrite as JOIN (executes once). Example:
          <code className="inline-code">SELECT * FROM customers WHERE id IN (SELECT customer_id
          FROM orders WHERE total &gt; 100)</code> →
          <code className="inline-code">SELECT DISTINCT customers.* FROM customers JOIN orders
          ON customers.id = orders.customer_id WHERE orders.total &gt; 100</code>.
        </p>

        <p>
          <strong>Use EXISTS for boolean checks</strong>:
          <code className="inline-code">SELECT * FROM customers WHERE EXISTS (SELECT 1 FROM
          orders WHERE orders.customer_id = customers.id)</code>. EXISTS short-circuits on
          first match (fast). IN evaluates entire subquery (slower for large results).
        </p>

        <h3>Pagination Strategies</h3>
        <p>
          <strong>OFFSET pagination</strong>: <code className="inline-code">SELECT * FROM
          orders ORDER BY created_at DESC LIMIT 20 OFFSET 1000</code>. Simple but slow for
          deep pages (scans and sorts 1,020 rows to return 20). Performance degrades linearly
          with OFFSET value.
        </p>

        <p>
          <strong>Keyset pagination</strong>: <code className="inline-code">SELECT * FROM
          orders WHERE created_at &lt; ? ORDER BY created_at DESC LIMIT 20</code>. Uses index
          to seek to position, fetches only 20 rows. Constant performance regardless of page
          depth (100-1000x faster for deep pages). Trade-off: can't jump to arbitrary page
          (only next/previous).
        </p>

        <p>
          <strong>When to use each</strong>: OFFSET for arbitrary page navigation (page 50 of
          100), keyset for infinite scroll/next-previous (Twitter, Facebook feeds). For deep
          OFFSET (&gt;1000), always use keyset.
        </p>

        <h3>Bulk Operations</h3>
        <p>
          <strong>Batch INSERT</strong>: <code className="inline-code">INSERT INTO users
          (email, name) VALUES (?, ?), (?, ?), (?, ?)</code> (multi-row INSERT). 10-100x
          faster than single-row INSERTs (one round trip vs N round trips).
        </p>

        <p>
          <strong>COPY/BULK INSERT</strong>:
          <code className="inline-code">COPY users FROM STDIN CSV</code> (PostgreSQL),
          <code className="inline-code">LOAD DATA INFILE</code> (MySQL). 100-1000x faster
          than INSERT (optimized bulk load). Use for: data migration, ETL, bulk imports.
        </p>

        <p>
          <strong>Batch UPDATE/DELETE</strong>: Use transactions for atomicity
          (<code className="inline-code">BEGIN; UPDATE ...; UPDATE ...; COMMIT</code>).
          Batch by primary key ranges to avoid lock contention.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/sql-queries-use-cases.svg`}
          caption="Figure 3: SQL Queries Use Cases and Best Practices. Primary Use Cases: Pagination (LIMIT/OFFSET simple, keyset pagination faster - WHERE id > last_id LIMIT N, avoid OFFSET for large N, 10-100x faster for deep pages), Aggregation (GROUP BY with indexes, window functions like ROW_NUMBER, materialized views pre-compute, HAVING for filtered groups, optimize large aggregations), Bulk Operations (batch INSERT/UPDATE, multi-row INSERT VALUES, COPY/BULK INSERT fastest, transactions for atomicity, 100-1000x faster than single). SQL Best Practices Checklist: Use Prepared Statements (SQL injection prevention), Use Transactions (atomicity for multi-step), Handle NULLs (COALESCE, IS NULL), Test with EXPLAIN (verify query plans). Anti-patterns: SELECT * (unnecessary I/O), correlated subqueries (N+1 execution), large OFFSET (scans all previous rows), missing JOIN conditions (Cartesian products), functions on indexed columns (prevents index usage)."
          alt="SQL queries use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: SQL Optimization Approaches</h2>

        <p>
          Different SQL optimization approaches have trade-offs. Understanding them helps you
          choose the right technique for each situation.
        </p>

        <h3>OFFSET vs Keyset Pagination</h3>
        <p>
          <strong>OFFSET</strong>: Simple, supports arbitrary page navigation. Trade-offs:
          slow for deep pages (scans all previous rows), performance degrades linearly. Use
          for: admin dashboards, search results (need page numbers).
        </p>

        <p>
          <strong>Keyset</strong>: Fast for all pages (constant time), uses index efficiently.
          Trade-offs: can't jump to arbitrary page (only next/previous), requires unique
          ordering column. Use for: infinite scroll, feeds (Twitter, Facebook), large
          datasets.
        </p>

        <h3>UNION vs UNION ALL</h3>
        <p>
          <strong>UNION</strong>: Removes duplicates (requires sort). Trade-offs: slower
          (sort overhead), but guarantees unique results. Use when: duplicates must be
          removed, combining overlapping datasets.
        </p>

        <p>
          <strong>UNION ALL</strong>: Keeps duplicates (no sort). Trade-offs: faster (no
          sort), but may return duplicates. Use when: datasets don't overlap, duplicates
          acceptable, performance critical.
        </p>

        <h3>EXISTS vs IN</h3>
        <p>
          <strong>EXISTS</strong>: Short-circuits on first match. Trade-offs: faster for
          large subquery results, but can't use subquery columns in outer query. Use for:
          boolean checks (exists/not exists), large subquery results.
        </p>

        <p>
          <strong>IN</strong>: Evaluates entire subquery. Trade-offs: slower for large
          results, but can use subquery columns in outer query. Use for: small subquery
          results, need subquery columns in outer query.
        </p>

        <h3>JOIN vs Subquery</h3>
        <p>
          <strong>JOIN</strong>: Executes once, optimizer can reorder. Trade-offs: may return
          duplicates (use DISTINCT if needed), but generally faster. Use for: most cases
          (default choice), large datasets.
        </p>

        <p>
          <strong>Subquery</strong>: May execute multiple times (correlated). Trade-offs:
          clearer intent for some queries, but slower. Use for: EXISTS checks, small
          subquery results, when JOIN is awkward.
        </p>

        <h3>CTE vs Subquery</h3>
        <p>
          <strong>CTE</strong>: Evaluated once, can be referenced multiple times. Trade-offs:
          may be materialized (uses memory), but improves readability. Use for: complex
          queries, repeated subqueries, recursive queries.
        </p>

        <p>
          <strong>Subquery</strong>: Inlined into query (no materialization). Trade-offs:
          may be evaluated multiple times (correlated), but less memory. Use for: simple
          subqueries, EXISTS checks, when CTE overhead is concern.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for SQL Queries</h2>

        <p>
          <strong>Use prepared statements.</strong> Prevents SQL injection, enables query
          plan caching. <code className="inline-code">SELECT * FROM users WHERE email =
          ?</code> (parameterized). Never concatenate user input into SQL strings.
        </p>

        <p>
          <strong>Select specific columns.</strong> Avoid SELECT * (fetches unnecessary
          columns). Benefits: less I/O, less network transfer, enables covering indexes.
          <code className="inline-code">SELECT id, email FROM users</code>.
        </p>

        <p>
          <strong>Use transactions for multi-step operations.</strong> Ensures atomicity
          (all or nothing). <code className="inline-code">BEGIN; UPDATE ...; INSERT ...;
          COMMIT</code>. Rollback on error (<code className="inline-code">ROLLBACK</code>).
        </p>

        <p>
          <strong>Index JOIN keys and WHERE columns.</strong> Foreign keys, filter columns,
          sort columns. <code className="inline-code">CREATE INDEX ON orders
          (customer_id)</code> for JOINs. <code className="inline-code">CREATE INDEX ON
          orders (status)</code> for WHERE filters.
        </p>

        <p>
          <strong>Use keyset pagination for deep pages.</strong>
          <code className="inline-code">WHERE created_at &lt; ? ORDER BY created_at DESC
          LIMIT 20</code>. 100-1000x faster than OFFSET for deep pages.
        </p>

        <p>
          <strong>Batch operations.</strong> Multi-row INSERT, batch UPDATE/DELETE.
          <code className="inline-code">INSERT INTO users (email) VALUES (?), (?),
          (?)</code>. 10-100x faster than single operations.
        </p>

        <p>
          <strong>Handle NULLs explicitly.</strong> Use COALESCE for defaults
          (<code className="inline-code">COALESCE(column, 'default')</code>), IS NULL for
          checks (<code className="inline-code">WHERE column IS NULL</code>). NULL comparisons
          (<code className="inline-code">= NULL</code>) always return NULL (false).
        </p>

        <p>
          <strong>Test with EXPLAIN ANALYZE.</strong> Verify query plans, check index usage,
          identify bottlenecks. <code className="inline-code">EXPLAIN ANALYZE SELECT
          ...</code>. Compare estimated vs actual rows (large difference = statistics issue).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>SELECT * anti-pattern.</strong> Fetches all columns (unnecessary I/O,
          network, memory). Solution: Select only needed columns. Benefit: less data
          transferred, enables covering indexes.
        </p>

        <p>
          <strong>Correlated subqueries.</strong> Executes once per outer row (very slow).
          Solution: Rewrite as JOIN or use window functions. Benefit: executes once, not N
          times.
        </p>

        <p>
          <strong>Large OFFSET pagination.</strong> Scans all previous rows (slow for deep
          pages). Solution: Use keyset pagination. Benefit: constant time regardless of page
          depth.
        </p>

        <p>
          <strong>Missing JOIN conditions.</strong> Creates Cartesian product (all rows ×
          all rows). Solution: Always specify JOIN condition, use explicit JOIN syntax.
          Benefit: correct results, no performance disaster.
        </p>

        <p>
          <strong>Functions on indexed columns.</strong> Prevents index usage
          (<code className="inline-code">WHERE LOWER(email) = ?</code>). Solution: Use
          functional index, store normalized data. Benefit: index can be used.
        </p>

        <p>
          <strong>Implicit type conversion.</strong> Type mismatch prevents index usage
          (<code className="inline-code">WHERE string_column = 123</code>). Solution: Match
          types (<code className="inline-code">WHERE string_column = '123'</code>). Benefit:
          index can be used.
        </p>

        <p>
          <strong>Leading wildcard LIKE.</strong> <code className="inline-code">LIKE
          '%pattern'</code> prevents index usage. Solution: Use full-text search, trailing
          wildcard only. Benefit: index can be used for prefix matching.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Product Search (Keyset Pagination)</h3>
        <p>
          Product listing with pagination: <code className="inline-code">SELECT id, name,
          price FROM products WHERE category_id = ? ORDER BY created_at DESC LIMIT 20
          OFFSET 1000</code>. Slow for deep pages (5 seconds). Optimized: keyset pagination
          <code className="inline-code">SELECT id, name, price FROM products WHERE category_id
          = ? AND created_at &lt; ? ORDER BY created_at DESC LIMIT 20</code> with index on
          <code className="inline-code">(category_id, created_at)</code>. Result: 50ms
          (100x faster).
        </p>

        <h3>User Dashboard (Aggregation with Window Functions)</h3>
        <p>
          User order summary: <code className="inline-code">SELECT user_id, COUNT(*),
          SUM(total), AVG(total) FROM orders GROUP BY user_id</code>. With ranking:
          <code className="inline-code">SELECT user_id, COUNT(*) as order_count, RANK()
          OVER (ORDER BY COUNT(*) DESC) as rank FROM orders GROUP BY user_id</code>. Window
          function replaces self-join (single pass, cleaner). Result: 200ms vs 2 seconds
          (10x faster).
        </p>

        <h3>Data Migration (Bulk INSERT with COPY)</h3>
        <p>
          Migrate 1 million rows: single INSERT (1 row per query) = 1 million queries
          (5 hours). Multi-row INSERT (1000 rows per query) = 1000 queries (5 minutes).
          COPY command = 1 query (30 seconds). Result: COPY is 600x faster than single
          INSERT, 10x faster than multi-row INSERT.
        </p>

        <h3>Report Generation (CTE for Complex Query)</h3>
        <p>
          Monthly sales report: complex query with multiple subqueries. Rewritten with CTEs:
          <code className="inline-code">WITH monthly_sales AS (...), previous_month AS
          (...), growth AS (...) SELECT * FROM monthly_sales JOIN previous_month ...</code>.
          CTEs improve readability, computed once (not repeated). Result: 500ms vs 3 seconds
          (6x faster), much more maintainable.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What's the difference between OFFSET and keyset pagination? When would you
              use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> OFFSET pagination:
              <code className="inline-code">LIMIT 20 OFFSET 1000</code> (skip 1000 rows,
              return 20). Simple, supports arbitrary page navigation. Trade-offs: slow for
              deep pages (scans all previous rows), performance degrades linearly. Keyset
              pagination: <code className="inline-code">WHERE id &gt; last_id LIMIT 20</code>
              (seek to position, return 20). Fast for all pages (constant time), uses index
              efficiently. Trade-offs: can't jump to arbitrary page (only next/previous),
              requires unique ordering column. Use OFFSET for: admin dashboards, search
              results (need page numbers). Use keyset for: infinite scroll, feeds (Twitter,
              Facebook), large datasets with deep pagination.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How much faster is keyset vs OFFSET? Answer: For
              OFFSET 1000: 10-100x faster. For OFFSET 100000: 100-1000x faster. Keyset is
              constant time (always fetches 20 rows), OFFSET is linear time (fetches OFFSET
              + LIMIT rows).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What is a correlated subquery? Why is it slow and how do you fix it?
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
              Q3: What's the difference between UNION and UNION ALL? When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> UNION: combines results, removes duplicates (requires
              sort). Slower due to sort overhead, but guarantees unique results. UNION ALL:
              combines results, keeps duplicates (no sort). Faster (no sort), but may return
              duplicates. Use UNION when: duplicates must be removed, combining overlapping
              datasets. Use UNION ALL when: datasets don't overlap, duplicates acceptable,
              performance critical. Performance difference: UNION ALL is 2-10x faster
              (no sort overhead).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you know if UNION ALL is safe? Answer: If
              datasets are mutually exclusive (different sources, different conditions),
              UNION ALL is safe. Example: <code className="inline-code">SELECT * FROM
              active_users UNION ALL SELECT * FROM inactive_users</code> (no overlap).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: What's the difference between EXISTS and IN? When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> EXISTS: checks if subquery returns any rows,
              short-circuits on first match.
              <code className="inline-code">SELECT * FROM customers WHERE EXISTS (SELECT 1
              FROM orders WHERE orders.customer_id = customers.id)</code>. IN: checks if
              value is in subquery results, evaluates entire subquery.
              <code className="inline-code">SELECT * FROM customers WHERE id IN (SELECT
              customer_id FROM orders)</code>. Use EXISTS for: boolean checks (exists/not
              exists), large subquery results (short-circuits). Use IN for: small subquery
              results, need subquery columns in outer query. Performance: EXISTS is faster
              for large subquery results (short-circuits), IN is similar for small results.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Can EXISTS return columns from subquery? Answer:
              No. EXISTS only checks existence (boolean). If you need subquery columns,
              use JOIN or IN.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: Why is SELECT * bad? What are the specific problems?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> SELECT * problems: (1) Unnecessary I/O (fetches
              columns you don't need), (2) Network overhead (transfers more data), (3)
              Memory waste (stores unused columns), (4) Prevents covering indexes (index
              doesn't include all columns), (5) Schema changes break code (new columns
              may break application), (6) Harder to understand (unclear which columns
              are needed). Solution: Select specific columns
              <code className="inline-code">SELECT id, email, name FROM users</code>.
              Benefits: less I/O, less network, less memory, enables covering indexes,
              stable API, clearer intent.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When is SELECT * acceptable? Answer: Ad-hoc
              queries (exploring data), small tables (overhead negligible), when you
              truly need all columns (rare). For production code, always select specific
              columns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: What is a Cartesian product? How do you avoid it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Cartesian product: every row from table1 combined
              with every row from table2. <code className="inline-code">SELECT * FROM
              table1, table2</code> (no WHERE/JOIN condition). If table1 has 1000 rows
              and table2 has 1000 rows, result is 1 million rows (1000 × 1000). Causes:
              missing JOIN condition, wrong JOIN condition. Avoid: (1) Always specify
              JOIN condition (<code className="inline-code">WHERE table1.id =
              table2.id</code>), (2) Use explicit JOIN syntax (<code className="inline-code">
              INNER JOIN table2 ON table1.id = table2.id</code>), (3) Test queries with
              LIMIT first (<code className="inline-code">SELECT * FROM table1 JOIN
              table2 ON ... LIMIT 10</code>). Symptoms: unexpectedly large result set,
              very slow query, database running out of memory.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When is Cartesian product intentional? Answer:
              Rarely. One case: generating all combinations (e.g., all sizes × all colors
              for products). But usually it's a bug. Always verify result row count
              matches expectations.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            PostgreSQL Documentation, "SQL Syntax," "Performance Tips,"
            https://www.postgresql.org/docs/current/sql.html
          </li>
          <li>
            MySQL Documentation, "SELECT Syntax," "Optimization,"
            https://dev.mysql.com/doc/refman/8.0/en/select.html
          </li>
          <li>
            SQL Server Documentation, "SELECT (Transact-SQL),"
            https://docs.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql
          </li>
          <li>
            Oracle Documentation, "SQL Language Reference,"
            https://docs.oracle.com/en/database/oracle/oracle-database/
          </li>
          <li>
            Use The Index, Luke, "The WHERE Clause," "JOIN Operations,"
            https://use-the-index-luke.com/
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapter 5.
          </li>
          <li>
            CMU Database Group, "SQL and Relational Algebra" (YouTube lectures),
            https://www.youtube.com/c/CMUDatabaseGroup
          </li>
          <li>
            Brent Ozar, "SQL Server Query Tuning,"
            https://www.brentozar.com/archive/sql-server-query-tuning/
          </li>
          <li>
            Percona Blog, "SQL Optimization Best Practices,"
            https://www.percona.com/blog/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
