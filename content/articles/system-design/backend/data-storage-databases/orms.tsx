"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-orms-complete",
  title: "ORMs (Object-Relational Mapping)",
  description:
    "Comprehensive guide to ORMs: Active Record vs Data Mapper patterns, N+1 query problem, eager vs lazy loading, performance optimization, and when to use ORM vs raw SQL.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "orms",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "orm", "database", "development"],
  relatedTopics: [
    "stored-procedures-and-functions",
    "sql-queries-optimization",
    "query-optimization-techniques",
    "database-constraints",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>ORMs (Object-Relational Mapping)</h1>
        <p className="lead">
          ORMs (Object-Relational Mapping) are libraries that translate between object-oriented
          code and relational databases. Instead of writing SQL, you work with objects:
          <code className="inline-code">User.find(1)</code> instead of
          <code className="inline-code">SELECT * FROM users WHERE id = 1</code>. ORMs
          automatically generate SQL, manage relationships (1:1, 1:M, M:M), track changes,
          and handle database connections. Popular ORMs include: ActiveRecord (Ruby on Rails),
          Hibernate (Java), SQLAlchemy (Python), Entity Framework (.NET), Sequelize (Node.js).
          ORMs improve developer productivity (less boilerplate, faster development) but can
          introduce performance issues (N+1 queries, inefficient SQL) if not used carefully.
        </p>

        <p>
          Consider a blog application. Without ORM: write SQL for every operation
          (<code className="inline-code">SELECT * FROM posts WHERE user_id = ?</code>,
          <code className="inline-code">INSERT INTO comments ...</code>). With ORM: work with
          objects (<code className="inline-code">user.posts</code>,
          <code className="inline-code">post.comments.create(...)</code>). Benefits: less
          boilerplate, database abstraction (easier to switch databases), consistent patterns.
          Trade-offs: performance overhead (ORM-generated SQL may not be optimal), hidden
          complexity (N+1 queries, lazy loading surprises).
        </p>

        <p>
          ORMs are ideal for: <strong>Rapid development</strong> (CRUD applications,
          prototypes), <strong>Team productivity</strong> (consistent patterns, less SQL
          knowledge needed), <strong>Database abstraction</strong> (support multiple
          databases). ORMs should be avoided for: <strong>Complex queries</strong>
          (analytics, reporting), <strong>High-performance needs</strong> (real-time
          systems), <strong>Batch operations</strong> (bulk inserts/updates).
        </p>

        <p>
          This article provides a comprehensive examination of ORMs: ORM patterns (Active
          Record, Data Mapper, Repository), common performance issues (N+1 queries, lazy
          loading), optimization techniques (eager loading, select columns, pagination),
          and trade-offs (productivity vs performance). We'll explore when ORMs excel
          (rapid development, CRUD apps) and when they introduce complexity (complex
          queries, performance-critical systems). We'll also cover best practices (eager
          loading, monitoring queries) and common pitfalls (N+1, SELECT *, no pagination).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/orm-architecture.svg`}
          caption="Figure 1: ORM Architecture and Patterns showing ORM Layer (Object-Relational Mapping): Application Objects (User, Order, Product - classes) → ORM Mapper → Database Tables (users, orders, products). ORM translates: Objects ↔ Tables, Properties ↔ Columns. Common ORM Patterns: Active Record (Object + DB logic - Rails, Laravel), Data Mapper (Separate mapper - Hibernate, SQLAlchemy), Repository Pattern (Abstraction layer - DDD), Unit of Work (Track changes, commit transaction). Common ORM Operations: Find/Get (SELECT by ID), Create/Save (INSERT new record), Update (UPDATE existing), Delete (DELETE record). Key characteristics: Object-table mapping, automatic SQL generation, relationship management (1:1, 1:M, M:M), lazy/eager loading, change tracking."
          alt="ORM architecture and patterns"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: ORM Patterns &amp; Loading Strategies</h2>

        <h3>ORM Patterns: Active Record vs Data Mapper</h3>
        <p>
          <strong>Active Record</strong> pattern: Objects contain both data and database
          logic. <code className="inline-code">class User &#123; save() &#123; ... &#125; delete() &#123; ... &#125;
          &#125;</code>. Each object knows how to persist itself. Used by: Ruby on Rails
          (ActiveRecord), Laravel (Eloquent), Django ORM. Benefits: simple, intuitive,
          less code. Trade-offs: tight coupling (hard to test without database), objects
          do too much (violates single responsibility).
        </p>

        <p>
          <strong>Data Mapper</strong> pattern: Separate mapper handles persistence.
          <code className="inline-code">class User &#123; /* just data */ &#125;</code>,
          <code className="inline-code">class UserMapper &#123; save(user) &#123; ... &#125; &#125;</code>.
          Objects are plain (POCO/POJO), mapper handles database. Used by: Hibernate
          (Java), SQLAlchemy (Python), Entity Framework (.NET). Benefits: separation of
          concerns (easy to test), objects focus on business logic. Trade-offs: more
          code (mapper classes), more complex.
        </p>

        <p>
          <strong>Repository Pattern</strong>: Abstraction layer between domain objects
          and database. <code className="inline-code">interface UserRepository &#123;
          findById(id): User; save(user): void; &#125;</code>. Domain objects don't know about
          database. Used in: Domain-Driven Design (DDD). Benefits: testable (mock
          repository), database abstraction (swap implementation). Trade-offs: more
          abstraction layers, more code.
        </p>

        <p>
          <strong>Unit of Work</strong>: Tracks changes to objects, commits all at once
          (transaction). <code className="inline-code">unitOfWork.registerDirty(user);
          unitOfWork.commit()</code>. Ensures atomicity (all changes succeed or fail
          together). Used by: most ORMs internally. Benefits: transactional consistency,
          efficient batching. Trade-offs: complexity (track state), memory usage (track
          all changes).
        </p>

        <h3>Loading Strategies: Lazy vs Eager</h3>
        <p>
          <strong>Lazy loading</strong>: Related objects loaded on-demand (when accessed).
          <code className="inline-code">user = User.find(1); orders = user.orders /*
          triggers SELECT */</code>. Benefits: only load what you need (efficient for
          single access). Trade-offs: N+1 queries (load in loop = many queries), hidden
          queries (hard to see when query fires).
        </p>

        <p>
          <strong>Eager loading</strong>: Related objects loaded upfront (with main query).
          <code className="inline-code">user = User.includes(:orders).find(1) /* JOIN
          orders */</code>. Benefits: no N+1 (all data in one query), predictable
          performance. Trade-offs: may load unused data (waste), larger initial query.
        </p>

        <p>
          <strong>Explicit loading</strong>: Manually load related objects when needed.
          <code className="inline-code">user = User.find(1); unitOfWork.load(user,
          'orders')</code>. Benefits: control when loading happens, avoid surprises.
          Trade-offs: more code (explicit loads), easy to forget.
        </p>

        <h3>Relationship Mapping</h3>
        <p>
          ORMs map database relationships to object relationships: <strong>One-to-One</strong>
          (<code className="inline-code">User has_one Profile</code>,
          <code className="inline-code">Profile belongs_to User</code>),
          <strong>One-to-Many</strong> (<code className="inline-code">User has_many
          Posts</code>, <code className="inline-code">Post belongs_to User</code>),
          <strong>Many-to-Many</strong> (<code className="inline-code">Post has_and_belongs
         _to_many Tags</code>, junction table automatically managed).
        </p>

        <p>
          ORM handles: <strong>Foreign keys</strong> (automatically added/maintained),
          <strong>Junction tables</strong> (for M:M relationships), <strong>Cascading
          operations</strong> (delete user → delete posts), <strong>Validation</strong>
          (foreign key exists before save).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/orm-performance.svg`}
          caption="Figure 2: ORM Performance Issues and Solutions showing N+1 Query Problem: 1 Query (Get all users - users = User.all()) → N Queries (Get orders for each - user.orders per user). 100 users = 101 queries (very slow!). Eager Loading Solution: 1 Query with JOIN (User.includes(:orders).all - SELECT * FROM users LEFT JOIN orders) → 1 Query Total (100x faster!). Other Performance Issues and Solutions: Lazy Loading → Use eager loading, SELECT * → Select columns, No Pagination → Use limit/offset, Missing Indexes → Add indexes. Key takeaway: N+1 is the most common ORM performance issue. Use eager loading (includes/join) to fix. Monitor query count, use pagination, select only needed columns."
          alt="ORM performance issues and solutions"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: N+1 &amp; Optimization</h2>

        <h3>N+1 Query Problem</h3>
        <p>
          <strong>N+1</strong> is the most common ORM performance issue. Fetch N parent
          records (1 query), then fetch children for each parent (N queries). Example:
          <code className="inline-code">users = User.all() /* 1 query */; users.each &#123; |u|
          u.orders /* N queries */ &#125;</code>. Total: 1 + N queries (100 users = 101 queries).
          Performance: 10-100x slower than necessary.
        </p>

        <p>
          <strong>Solution: Eager loading</strong>.
          <code className="inline-code">users = User.includes(:orders).all() /* 1 query
          with JOIN */; users.each &#123; |u| u.orders /* no query, already loaded */ &#125;</code>.
          Total: 1 query (100x faster for 100 users). ORMs provide:
          <code className="inline-code">includes</code> (Rails),
          <code className="inline-code">select_related</code> (Django),
          <code className="inline-code">JOIN</code> (Hibernate).
        </p>

        <p>
          <strong>Detecting N+1</strong>: Monitor query count (alert on high count), use
          query logging (see queries in development), profiling tools (bullet gem for
          Rails, django-debug-toolbar). Fix: add eager loading (<code className="inline-code">
          includes</code>), review loops (check for lazy loading inside loops).
        </p>

        <h3>Query Optimization</h3>
        <p>
          ORMs can generate inefficient SQL. Optimize: <strong>Select columns</strong>
          (not SELECT *): <code className="inline-code">User.select(:id, :name)</code>
          instead of <code className="inline-code">User.all()</code>. Benefits: less data
          transferred, faster queries. <strong>Use pagination</strong>:
          <code className="inline-code">User.limit(20).offset(0)</code>. Benefits: bounded
          result size, faster queries. <strong>Add indexes</strong>: ORM can't fix missing
          indexes. Add database indexes on frequently queried columns (foreign keys,
          WHERE columns).
        </p>

        <p>
          <strong>Batch operations</strong>: ORM row-by-row is slow. Use batch:
          <code className="inline-code">User.update_all(active: true) /* single UPDATE */</code>
          instead of <code className="inline-code">users.each &#123; |u| u.update(active: true)
          /* N UPDATEs */ &#125;</code>. Benefits: 1 query vs N queries, much faster.
        </p>

        <h3>When to Use Raw SQL</h3>
        <p>
          ORMs aren't always the best tool. Use raw SQL for: <strong>Complex queries</strong>
          (multiple JOINs, subqueries, window functions), <strong>Analytics/Reporting</strong>
          (aggregations, GROUP BY), <strong>Batch operations</strong> (bulk updates,
          inserts), <strong>Performance-critical</strong> (optimize every query),
          <strong>Database-specific features</strong> (CTEs, JSON operations, full-text
          search).
        </p>

        <p>
          ORMs provide escape hatches: <code className="inline-code">User.find_by_sql("...")</code>
          (Rails), <code className="inline-code">Model.objects.raw("...")</code> (Django),
          <code className="inline-code">session.execute("...")</code> (SQLAlchemy). Use
          raw SQL when ORM can't express query efficiently.
        </p>

        <ArticleImage
          src={`${BASE_PATH}/orm-use-cases.svg`}
          caption="Figure 3: ORM Use Cases and Best Practices. Primary Use Cases: Rapid Development (less boilerplate code, auto-generated SQL, focus on business logic, faster prototyping, CRUD operations simplified), Team Productivity (consistent patterns, less SQL knowledge needed, easier onboarding, code review simplified, database abstraction), When NOT to Use (complex queries, high-performance needs, batch operations, data warehouses - use raw SQL instead). ORM Best Practices: Use Eager Loading (prevent N+1), Select Columns (not SELECT *), Add Pagination (limit results), Monitor Queries (log slow queries). Anti-patterns: N+1 queries (lazy loading in loops), SELECT * (fetching all columns), no pagination (loading all rows), ignoring query logs (not monitoring), complex queries in ORM (use raw SQL instead)."
          alt="ORM use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: ORM vs Raw SQL</h2>

        <p>
          The fundamental question: should you use ORM or raw SQL? Understanding the
          trade-offs helps you make the right choice.
        </p>

        <h3>ORM Strengths</h3>
        <p>
          <strong>Developer productivity</strong> is the primary advantage. Less boilerplate
          (no SQL strings), auto-generated SQL (CRUD is trivial), consistent patterns (all
          developers use same approach). Benefits: faster development, easier onboarding,
          less code to maintain.
        </p>

        <p>
          <strong>Database abstraction</strong>: ORM hides database-specific SQL. Switch
          databases (PostgreSQL → MySQL) with minimal code changes. Benefits: flexibility
          (support multiple databases), easier testing (use SQLite in tests).
        </p>

        <p>
          <strong>Relationship management</strong>: ORM handles foreign keys, junction
          tables, cascading operations automatically. Benefits: less code (no manual JOINs),
          consistent behavior (cascading works same everywhere).
        </p>

        <p>
          <strong>Change tracking</strong>: ORM tracks object changes, generates efficient
          UPDATEs (only changed columns). Benefits: less code (no manual dirty checking),
          efficient updates (only changed data).
        </p>

        <h3>ORM Limitations</h3>
        <p>
          <strong>Performance overhead</strong>: ORM-generated SQL may not be optimal.
          N+1 queries (lazy loading), SELECT * (fetch all columns), inefficient JOINs
          (ORM doesn't always choose best plan). Benefits: productivity. Trade-offs:
          10-50% slower than optimized raw SQL.
        </p>

        <p>
          <strong>Complex queries</strong>: ORMs struggle with complex queries (multiple
          JOINs, subqueries, window functions, CTEs). Workarounds: raw SQL (defeats ORM
          purpose), complex ORM syntax (hard to read/maintain).
        </p>

        <p>
          <strong>Hidden complexity</strong>: ORM hides what SQL is running. Lazy loading
          fires queries unexpectedly. Hard to debug (what query caused this?). Hard to
          optimize (don't know what SQL is generated).
        </p>

        <p>
          <strong>Learning curve</strong>: ORM has its own API/syntax (different from SQL).
          Developers must learn ORM quirks (N+1, lazy loading, caching). Benefits: once
          learned, productive. Trade-offs: initial learning time.
        </p>

        <h3>Raw SQL Strengths</h3>
        <p>
          <strong>Performance</strong>: Hand-written SQL can be optimized (indexes, query
          plan, efficient JOINs). No ORM overhead (direct database calls). Benefits:
          fastest possible queries, full control over execution.
        </p>

        <p>
          <strong>Complex queries</strong>: SQL expresses complex queries naturally
          (JOINs, subqueries, window functions, CTEs). No ORM limitations. Benefits:
          can express any query, optimal execution.
        </p>

        <p>
          <strong>Transparency</strong>: You see exactly what SQL runs. No hidden queries
          (lazy loading surprises). Easy to debug (see query), easy to optimize (tune
          query directly).
        </p>

        <h3>Raw SQL Limitations</h3>
        <p>
          <strong>More code</strong>: Write SQL for every operation (CRUD boilerplate).
          More code to maintain, test, review. Benefits: explicit (see what runs).
          Trade-offs: slower development.
        </p>

        <p>
          <strong>Database coupling</strong>: SQL is database-specific (PostgreSQL syntax
          ≠ MySQL syntax). Harder to switch databases. Benefits: use database features.
          Trade-offs: vendor lock-in.
        </p>

        <p>
          <strong>Inconsistent patterns</strong>: Different developers write SQL differently.
          Harder to review, maintain. Benefits: flexibility. Trade-offs: inconsistency.
        </p>

        <h3>Hybrid Approach</h3>
        <p>
          Use <strong>both</strong> strategically:
        </p>

        <p>
          <strong>ORM for</strong>: CRUD operations (create, read, update, delete), simple
          queries (find by ID, filter by column), rapid development (prototypes, MVPs),
          team productivity (consistent patterns).
        </p>

        <p>
          <strong>Raw SQL for</strong>: Complex queries (analytics, reporting), performance-
          critical code (hot paths), batch operations (bulk updates), database-specific
          features (JSON, full-text search, CTEs).
        </p>

        <p>
          Example: E-commerce application. ORM: CRUD for products, users, orders (simple
          operations, rapid development). Raw SQL: sales reports (complex aggregations),
          inventory batch updates (bulk operations), search (full-text search).
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for ORMs</h2>

        <p>
          <strong>Use eager loading.</strong> Prevent N+1 queries:
          <code className="inline-code">User.includes(:orders).find(1)</code> instead of
          <code className="inline-code">user.orders</code> in loop. Benefits: 1 query vs
          N queries, predictable performance.
        </p>

        <p>
          <strong>Select only needed columns.</strong>
          <code className="inline-code">User.select(:id, :name)</code> instead of
          <code className="inline-code">User.all()</code> (SELECT *). Benefits: less data
          transferred, faster queries, less memory.
        </p>

        <p>
          <strong>Use pagination.</strong>
          <code className="inline-code">User.limit(20).offset(0)</code>. Never load all
          rows (<code className="inline-code">User.all()</code> on large table). Benefits:
          bounded result size, faster queries, prevents memory issues.
        </p>

        <p>
          <strong>Monitor queries.</strong> Enable query logging (development), log slow
          queries (production), alert on high query count. Tools: bullet gem (Rails),
          django-debug-toolbar (Django), query profiler. Benefits: catch N+1 early,
          identify slow queries.
        </p>

        <p>
          <strong>Add database indexes.</strong> ORM can't fix missing indexes. Add indexes
          on: foreign keys (for JOINs), WHERE columns (for filtering), ORDER BY columns
          (for sorting). Benefits: faster queries, ORM benefits from indexes.
        </p>

        <p>
          <strong>Use batch operations.</strong>
          <code className="inline-code">User.update_all(active: true)</code> instead of
          row-by-row updates. Benefits: 1 query vs N queries, much faster for bulk
          operations.
        </p>

        <p>
          <strong>Understand lazy loading.</strong> Know when lazy loading fires queries
          (accessing relationship). Use eager loading when accessing in loops. Benefits:
          avoid surprises, predictable performance.
        </p>

        <p>
          <strong>Know when to use raw SQL.</strong> ORM isn't always best. Use raw SQL
          for: complex queries, analytics, batch operations, performance-critical code.
          Benefits: optimal performance, full control.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>N+1 queries.</strong> Most common ORM issue. Lazy loading in loops
          (100 users → 100 queries for orders). Solution: use eager loading
          (<code className="inline-code">includes</code>, <code className="inline-code">
          select_related</code>), monitor query count (alert on high count).
        </p>

        <p>
          <strong>SELECT * (fetching all columns).</strong> ORM loads all columns
          (<code className="inline-code">User.all()</code>). Wastes bandwidth, memory.
          Solution: select only needed columns (<code className="inline-code">
          User.select(:id, :name)</code>).
        </p>

        <p>
          <strong>No pagination.</strong> Loading all rows (<code className="inline-code">
          User.all()</code> on large table). Memory issues, slow queries. Solution: always
          paginate (<code className="inline-code">limit/offset</code>), use cursor-based
          pagination for large datasets.
        </p>

        <p>
          <strong>Ignoring query logs.</strong> Not monitoring what SQL ORM generates.
          N+1 goes unnoticed. Solution: enable query logging (development), log slow
          queries (production), use profiling tools (bullet, django-debug-toolbar).
        </p>

        <p>
          <strong>Complex queries in ORM.</strong> Trying to express complex queries
          (multiple JOINs, subqueries) in ORM syntax. Hard to read, inefficient. Solution:
          use raw SQL for complex queries (ORM provides escape hatches).
        </p>

        <p>
          <strong>Missing indexes.</strong> Expecting ORM to fix performance without
          indexes. ORM can't add indexes. Solution: add database indexes (foreign keys,
          WHERE columns, ORDER BY columns), use EXPLAIN to verify index usage.
        </p>

        <p>
          <strong>Over-reliance on ORM.</strong> Using ORM for everything (even when raw
          SQL is better). Solution: know ORM limitations, use raw SQL when appropriate
          (complex queries, batch operations, performance-critical).
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Rapid Development: Startup MVP</h3>
        <p>
          Startup building MVP uses ORM (Rails ActiveRecord):
          <code className="inline-code">class User &lt; ApplicationRecord; has_many :posts;
          end</code>. CRUD operations are trivial (<code className="inline-code">
          User.create(...)</code>, <code className="inline-code">user.posts</code>).
          Benefits: fast development (focus on features, not SQL), consistent patterns
          (all developers use same approach), easy to iterate (change schema, ORM adapts).
        </p>

        <h3>Enterprise Application: Team Productivity</h3>
        <p>
          Enterprise uses ORM (Hibernate, Entity Framework): consistent patterns across
          teams, easier onboarding (learn ORM once, use everywhere), database abstraction
          (support multiple databases). Benefits: team productivity (less time on SQL,
          more on business logic), maintainability (consistent patterns), flexibility
          (switch databases if needed).
        </p>

        <h3>Analytics: Raw SQL for Complex Queries</h3>
        <p>
          Analytics team uses raw SQL for reports:
          <code className="inline-code">SELECT DATE(created_at), COUNT(*), SUM(total)
          FROM orders GROUP BY DATE(created_at) WITH ROLLUP</code>. ORM can't express
          this efficiently. Benefits: optimal query (hand-tuned), full control (window
          functions, CTEs), best performance (no ORM overhead).
        </p>

        <h3>Hybrid: E-Commerce Platform</h3>
        <p>
          E-commerce uses hybrid approach: ORM for CRUD (products, users, orders - rapid
          development), raw SQL for reports (sales analytics - complex aggregations),
          raw SQL for batch operations (inventory updates - bulk operations). Benefits:
          best of both (ORM productivity, raw SQL performance), appropriate tool for
          each task.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What is the N+1 query problem? How do you detect and fix it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> N+1: Fetch N parent records (1 query), then fetch
              children for each parent (N queries). Example:
              <code className="inline-code">users = User.all() /* 1 query */; users.each
              &#123; |u| u.orders /* N queries */ &#125;</code>. 100 users = 101 queries (very
              slow). Detect: monitor query count (alert on high count), query logging
              (see queries in development), profiling tools (bullet gem, django-debug-
              toolbar). Fix: eager loading
              (<code className="inline-code">User.includes(:orders).all() /* 1 query
              with JOIN */</code>), review loops (check for lazy loading inside loops).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How much slower is N+1? Answer: 10-100x slower
              depending on N. 100 users: 101 queries vs 1 query (100x more queries).
              Network latency compounds (each query has round-trip overhead).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What's the difference between Active Record and Data Mapper patterns?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Active Record: objects contain data + database
              logic (<code className="inline-code">class User &#123; save() &#123; ... &#125; &#125;</code>).
              Each object knows how to persist itself. Used by: Rails (ActiveRecord),
              Laravel (Eloquent). Benefits: simple, intuitive, less code. Trade-offs:
              tight coupling (hard to test), objects do too much. Data Mapper: separate
              mapper handles persistence (<code className="inline-code">class User
              &#123;/* just data */&#125;</code>, <code className="inline-code">class UserMapper
              &#123; save(user) &#123; ... &#125; &#125;</code>). Used by: Hibernate, SQLAlchemy. Benefits:
              separation of concerns (easy to test), objects focus on business logic.
              Trade-offs: more code (mapper classes), more complex.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Which pattern is better? Answer: Depends.
              Active Record for: rapid development, simple apps, small teams. Data
              Mapper for: complex apps, large teams, testability needs. Many projects
              use hybrid (ORM for CRUD, Data Mapper for complex logic).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: When would you use raw SQL instead of ORM?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Use raw SQL for: (1) Complex queries (multiple
              JOINs, subqueries, window functions, CTEs - ORM can't express efficiently),
              (2) Analytics/Reporting (aggregations, GROUP BY, complex calculations),
              (3) Batch operations (bulk updates/inserts - ORM row-by-row is slow),
              (4) Performance-critical code (hot paths - optimize every query),
              (5) Database-specific features (JSON operations, full-text search,
              custom types). Use ORM for: CRUD operations, simple queries, rapid
              development, team productivity.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you use raw SQL with ORM? Answer: ORMs
              provide escape hatches: <code className="inline-code">User.find_by_sql("...")</code>
              (Rails), <code className="inline-code">Model.objects.raw("...")</code>
              (Django), <code className="inline-code">session.execute("...")</code>
              (SQLAlchemy). Use raw SQL when ORM can't express query efficiently.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: What is lazy loading? What are the pros and cons?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Lazy loading: related objects loaded on-demand
              (when accessed). <code className="inline-code">user = User.find(1);
              orders = user.orders /* triggers SELECT */</code>. Pros: only load what
              you need (efficient for single access), don't waste memory on unused data.
              Cons: N+1 queries (load in loop = many queries), hidden queries (hard to
              see when query fires), unpredictable performance (query fires on access).
              Solution: use eager loading for known access patterns
              (<code className="inline-code">User.includes(:orders).find(1)</code>).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What is eager loading? Answer: Related objects
              loaded upfront (with main query).
              <code className="inline-code">User.includes(:orders).find(1) /* JOIN
              orders */</code>. Pros: no N+1 (all data in one query), predictable
              performance. Cons: may load unused data (waste), larger initial query.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: How do you optimize ORM performance?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Optimize: (1) Use eager loading (prevent N+1 -
              <code className="inline-code">includes</code>,
              <code className="inline-code">select_related</code>), (2) Select only
              needed columns (<code className="inline-code">User.select(:id, :name)</code>
              not SELECT *), (3) Use pagination (<code className="inline-code">
              limit/offset</code> - never load all rows), (4) Add database indexes
              (foreign keys, WHERE columns - ORM can't fix missing indexes), (5) Use
              batch operations (<code className="inline-code">update_all</code> not
              row-by-row), (6) Monitor queries (log slow queries, alert on high count),
              (7) Use raw SQL when appropriate (complex queries, batch operations).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the most important optimization?
              Answer: Fixing N+1 queries (biggest impact - 10-100x improvement). Use
              eager loading, monitor query count, review loops for lazy loading.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your ORM query is slow. How do you diagnose and fix it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check query count (N+1? - should
              be 1-5 queries, not 100+), (2) Check query plan (EXPLAIN ANALYZE - missing
              indexes?), (3) Check columns fetched (SELECT *? - fetching unnecessary
              data?), (4) Check result size (no pagination? - loading all rows?). Fix:
              (1) Add eager loading (fix N+1), (2) Add indexes (speed up queries),
              (3) Select columns (not SELECT *), (4) Add pagination (limit/offset),
              (5) Use raw SQL (if ORM generates inefficient SQL), (6) Use batch
              operations (for bulk updates).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you see what SQL ORM generates?
              Answer: Enable query logging (development): Rails
              (<code className="inline-code">config.active_record.logger =
              Logger.new(STDOUT)</code>), Django
              (<code className="inline-code">LOGGING</code> config), SQLAlchemy
              (<code className="inline-code">echo=True</code>). Production: log slow
              queries, use profiling tools.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            Martin Fowler, <em>Patterns of Enterprise Application Architecture</em>,
            Addison-Wesley, 2002. Chapters: Active Record, Data Mapper, Unit of Work.
          </li>
          <li>
            <a
              href="https://guides.rubyonrails.org/active_record.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ruby on Rails Documentation — Active Record
            </a>
          </li>
          <li>
            <a
              href="https://docs.djangoproject.com/en/stable/topics/db/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Django Documentation — Models and Queries
            </a>
          </li>
          <li>
            <a
              href="https://docs.sqlalchemy.org/en/orm/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SQLAlchemy Documentation — ORM Tutorial
            </a>
          </li>
          <li>
            <a
              href="https://hibernate.org/orm/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hibernate Documentation — Getting Started
            </a>
          </li>
          <li>
            <a
              href="https://docs.microsoft.com/en-us/ef/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Entity Framework Documentation — Getting Started
            </a>
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            <a
              href="https://use-the-index-luke.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Use The Index, Luke — ORM and SQL
            </a>
          </li>
          <li>
            <a
              href="https://stackoverflow.com/questions/tagged/n+1"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stack Overflow — N+1 Query Problem
            </a>
          </li>
          <li>
            <a
              href="https://github.com/flyerhzm/bullet"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bullet Gem — Rails N+1 Query Detector
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
