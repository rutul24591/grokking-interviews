"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-query-patterns-complete",
  title: "Query Patterns",
  description:
    "Comprehensive guide to database query patterns: master-detail, hierarchical, many-to-many, polymorphic associations, and avoiding anti-patterns like EAV and N+1 queries.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "query-patterns",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "query-patterns", "database", "schema-design"],
  relatedTopics: [
    "database-indexes",
    "sql-queries-optimization",
    "query-optimization-techniques",
    "data-modeling-in-nosql",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Query Patterns</h1>
        <p className="lead">
          Database query patterns are recurring structures for modeling and querying data.
          Common patterns include: <strong>master-detail</strong> (order → order items),
          <strong>hierarchical</strong> (categories → subcategories), <strong>many-to-many</strong>
          (users ↔ roles via junction table), and <strong>polymorphic associations</strong>
          (comments → post/user/video). Anti-patterns like <strong>EAV</strong> (entity-attribute-value),
          <strong>N+1 queries</strong>, and <strong>unlimited recursion</strong> cause performance
          and maintenance issues. Understanding these patterns helps you design efficient schemas,
          write optimized queries, and avoid common pitfalls.
        </p>

        <p>
          Consider an e-commerce order: one order (master) has many order items (detail).
          Query pattern: <code className="inline-code">SELECT * FROM orders WHERE id = ?</code>
          (master), then <code className="inline-code">SELECT * FROM order_items WHERE order_id
          = ?</code> (detail). This is the master-detail pattern—fundamental to e-commerce,
          invoicing, and any system with header-line structures.
        </p>

        <p>
          Hierarchical data (categories, org charts, bill of materials) requires recursive
          queries. Adjacency list (parent_id column) is simplest. Path enumeration
          ('1/5/23/') is fastest for reads. Closure table (separate ancestor-descendant
          table) is most flexible. Recursive CTEs enable tree traversal in SQL.
        </p>

        <p>
          This article provides a comprehensive examination of query patterns: master-detail
          (header-line), hierarchical (tree structures), many-to-many (junction tables),
          polymorphic associations (comments on multiple types), and anti-patterns (EAV,
          N+1, unlimited recursion). We'll explore when each pattern excels (common use
          cases, efficient queries) and when they introduce complexity (EAV flexibility
          vs query complexity). We'll also cover solutions (JOINs for N+1, JSON columns
          for EAV, CTEs for hierarchical) and real-world use cases (e-commerce, social
          media, enterprise applications).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/query-patterns.svg`}
          caption="Figure 1: Database Query Patterns showing Common Query Patterns: Master-Detail/Header-Line (Order → Order Items), Hierarchical/Tree (Category → Subcategories), Many-to-Many (Users ↔ Roles via junction table), Polymorphic Associations (Comments → Post/User/Video). Query Anti-Patterns: Entity-Attribute-Value/EAV (flexible but complex queries), Recursive Query Without Limit (infinite loop risk), N+1 Query Pattern (1 query + N queries - slow), Implicit Columns (SELECT * without alias). Query Pattern Solutions: CTEs (complex queries), Window Functions (ranking, analytics), JSON Columns (replace EAV), Eager Loading (fix N+1)."
          alt="Database query patterns"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Common Patterns &amp; Anti-Patterns</h2>

        <h3>Master-Detail (Header-Line) Pattern</h3>
        <p>
          <strong>Master-detail</strong> is the most common pattern: one master record
          (order, invoice, shipment) has many detail records (order items, invoice lines,
          shipment items). Schema: <code className="inline-code">orders(id, customer_id,
          order_date)</code>, <code className="inline-code">order_items(id, order_id,
          product_id, quantity, price)</code>. Query: fetch master
          (<code className="inline-code">SELECT * FROM orders WHERE id = ?</code>), then
          details (<code className="inline-code">SELECT * FROM order_items WHERE order_id
          = ?</code>). Or use JOIN: <code className="inline-code">SELECT o.*, oi.* FROM
          orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.id = ?</code>.
        </p>

        <p>
          Use cases: e-commerce (orders), accounting (invoices), logistics (shipments),
          any header-line structure. Benefits: normalized (no data duplication), efficient
          (index on order_id), clear semantics (foreign key relationship).
        </p>

        <h3>Hierarchical (Tree) Pattern</h3>
        <p>
          <strong>Hierarchical data</strong> has parent-child relationships: categories
          (electronics → phones → smartphones), org charts (CEO → VP → manager), bill of
          materials (product → subassembly → part). Four common models:
        </p>

        <p>
          <strong>Adjacency list</strong>: <code className="inline-code">categories(id,
          name, parent_id)</code>. Simple, intuitive. Trade-offs: recursive queries for
          tree traversal (slow for deep trees). <strong>Path enumeration</strong>:
          <code className="inline-code">categories(id, name, path)</code> where path =
          '1/5/23/'. Fast reads (LIKE '1/5/%'), no recursion. Trade-offs: path updates
          on restructuring. <strong>Nested sets</strong>:
          <code className="inline-code">categories(id, name, lft, rgt)</code>. Fast
          subtree queries. Trade-offs: complex writes (rebalancing on insert/delete).
          <strong>Closure table</strong>: Separate
          <code className="inline-code">category_paths(ancestor_id, descendant_id,
          depth)</code>. Most flexible (supports graphs, not just trees). Trade-offs:
          extra table, maintenance overhead.
        </p>

        <h3>Many-to-Many Pattern</h3>
        <p>
          <strong>Many-to-many</strong> requires junction table:
          <code className="inline-code">users(id, name)</code>,
          <code className="inline-code">roles(id, name)</code>,
          <code className="inline-code">user_roles(user_id, role_id)</code>. Query:
          <code className="inline-code">SELECT r.* FROM roles r JOIN user_roles ur ON
          r.id = ur.role_id WHERE ur.user_id = ?</code>. Junction table can have
          additional columns (granted_at, granted_by).
        </p>

        <p>
          Use cases: users ↔ roles (RBAC), products ↔ categories, students ↔ courses,
          tags ↔ posts. Benefits: normalized, flexible (add/remove relationships),
          supports additional attributes on relationship.
        </p>

        <h3>Polymorphic Associations</h3>
        <p>
          <strong>Polymorphic associations</strong> allow one table to reference multiple
          tables: <code className="inline-code">comments(id, body, commentable_type,
          commentable_id)</code>. commentable_type = 'Post'/'User'/'Video',
          commentable_id = referenced record's ID. Query:
          <code className="inline-code">SELECT * FROM comments WHERE commentable_type
          = 'Post' AND commentable_id = ?</code>.
        </p>

        <p>
          Use cases: comments (on posts, users, videos), attachments (on invoices, orders,
          users), audit logs (changes to any table). Benefits: single table for all
          associations, flexible (add new types without schema changes). Trade-offs: no
          foreign key constraints (referential integrity in application), complex queries
          (JOINs require conditional logic).
        </p>

        <h3>Entity-Attribute-Value (EAV) Anti-Pattern</h3>
        <p>
          <strong>EAV</strong> stores attributes as rows:
          <code className="inline-code">products(id, name)</code>,
          <code className="inline-code">product_attributes(product_id, attribute_name,
          attribute_value)</code>. Example: product 1 has attributes (color, 'red'),
          (size, 'XL'), (material, 'cotton'). Query:
          <code className="inline-code">SELECT product_id FROM product_attributes WHERE
          (attribute_name = 'color' AND attribute_value = 'red') AND (attribute_name =
          'size' AND attribute_value = 'XL')</code>.
        </p>

        <p>
          EAV is an anti-pattern because: <strong>Complex queries</strong> (self-joins
          for each attribute), <strong>No type safety</strong> (all values are strings),
          <strong>No foreign keys</strong> (can't enforce valid attribute names),
          <strong>Poor performance</strong> (many self-joins, can't use indexes
          effectively). Solution: use JSON columns
          (<code className="inline-code">products(id, name, attributes JSONB)</code>)
          or fixed columns for known attributes.
        </p>

        <h3>N+1 Query Anti-Pattern</h3>
        <p>
          <strong>N+1</strong>: Fetch N parent records (1 query), then fetch children for
          each parent (N queries). Example: fetch 100 users (1 query), then fetch orders
          for each user (100 queries) = 101 queries total. Solution: eager loading
          <code className="inline-code">SELECT u.*, o.* FROM users u LEFT JOIN orders
          o ON u.id = o.user_id</code> (1 query). ORMs often cause N+1 (lazy loading).
          Fix: use eager loading (Rails: includes, Django: select_related/prefetch_related,
          Hibernate: JOIN FETCH).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/query-patterns-hierarchical.svg`}
          caption="Figure 2: Hierarchical and Recursive Query Patterns showing Hierarchical Data Models: Adjacency List (parent_id column - simple), Path Enumeration (path = '1/5/23/' - fast reads), Nested Sets (left/right values - complex writes), Closure Table (separate ancestor-descendant table - most flexible). Recursive CTE Example: WITH RECURSIVE tree AS (SELECT id, parent_id, 0 as depth FROM categories WHERE id = 1 UNION ALL SELECT c.id, c.parent_id, t.depth+1 FROM categories c JOIN tree t ON c.parent_id = t.id). Fetches entire tree from root (id=1). Always include LIMIT to prevent infinite loops. Hierarchical Query Best Practices: Use LIMIT (prevent infinite loops), Index parent_id (faster tree traversal), Cache Trees (materialized paths), Detect Cycles (prevent infinite recursion). Key takeaway: Adjacency list is simplest. Path enumeration is fastest for reads. Closure table is most flexible. Always use LIMIT in recursive queries."
          alt="Hierarchical and recursive query patterns"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: Hierarchical Queries &amp; Solutions</h2>

        <h3>Recursive CTEs for Hierarchical Data</h3>
        <p>
          <strong>Recursive CTEs</strong> enable tree traversal in SQL:
        </p>

        <pre className="bg-code text-code p-4 rounded-lg overflow-x-auto text-sm">
{`WITH RECURSIVE tree AS (
  -- Base case: start from root
  SELECT id, parent_id, name, 0 as depth
  FROM categories
  WHERE id = 1

  UNION ALL

  -- Recursive case: join children
  SELECT c.id, c.parent_id, c.name, t.depth + 1
  FROM categories c
  JOIN tree t ON c.parent_id = t.id
  WHERE t.depth &lt; 10  -- Prevent infinite loops
)
SELECT * FROM tree ORDER BY depth, name;`}
        </pre>

        <p>
          This fetches entire subtree from root (id=1). Base case: select root node.
          Recursive case: join children of current nodes. UNION ALL combines base and
          recursive results. WHERE t.depth &lt; 10 prevents infinite loops (always use
          LIMIT or depth check).
        </p>

        <p>
          Use cases: category trees, org charts, bill of materials, comment threads
          (nested replies). Benefits: single query for entire tree, flexible (filter
          by depth, prune branches). Trade-offs: recursive queries can be slow for
          very deep trees, requires database support (PostgreSQL, SQL Server, Oracle—
          MySQL 8.0+).
        </p>

        <h3>Solving N+1 with Eager Loading</h3>
        <p>
          <strong>N+1 problem</strong>: <code className="inline-code">users =
          User.all()</code> (1 query), then <code className="inline-code">user.orders
          for user in users</code> (N queries). Solution: eager loading:
        </p>

        <p>
          <strong>JOIN loading</strong>: <code className="inline-code">users =
          User.includes(:orders).all()</code> (Rails),
          <code className="inline-code">users = User.objects.select_related().all()</code>
          (Django). Generates: <code className="inline-code">SELECT u.*, o.* FROM users
          u LEFT JOIN orders o ON u.id = o.user_id</code>. Single query, all data loaded.
        </p>

        <p>
          <strong>Separate query loading</strong>:
          <code className="inline-code">users = User.includes(:orders).all()</code>
          generates 2 queries: <code className="inline-code">SELECT * FROM users</code>,
          then <code className="inline-code">SELECT * FROM orders WHERE user_id IN
          (1,2,3,...)</code>. More efficient than N+1 (2 queries vs N+1), especially
          for large N.
        </p>

        <h3>Replacing EAV with JSON Columns</h3>
        <p>
          <strong>EAV anti-pattern</strong> solved by JSON columns:
          <code className="inline-code">products(id, name, attributes JSONB)</code>
          instead of <code className="inline-code">product_attributes(product_id,
          attribute_name, attribute_value)</code>. Query:
          <code className="inline-code">SELECT * FROM products WHERE attributes extract 'color'
          = 'red' AND attributes extract 'size' = 'XL'</code>.
        </p>

        <p>
          Benefits: <strong>Flexible schema</strong> (add attributes without migration),
          <strong>Single row per product</strong> (no self-joins), <strong>Index support</strong>
          (GIN index on JSONB), <strong>Type safety</strong> (JSON validates structure).
          Trade-offs: <strong>Limited querying</strong> (can't index individual attributes
          as efficiently as columns), <strong>No foreign keys</strong> (can't enforce
          references within JSON).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/query-patterns-use-cases.svg`}
          caption="Figure 3: Query Patterns Use Cases and Solutions. Primary Use Cases: E-Commerce (Order → Order Items master-detail, Product → Categories hierarchical, Products ↔ Tags many-to-many, Reviews polymorphic, Inventory tracking), Social Media (User → Posts master-detail, Comments polymorphic, Users ↔ Users follows many-to-many, Posts ↔ Tags many-to-many, Feed generation complex joins), Enterprise (Org chart hierarchical, Users ↔ Roles many-to-many, Approval workflows, Audit logging polymorphic, Reporting aggregations). N+1 Query Pattern Solution: Problem (N+1) - 1 query + N queries = slow → Fix → Solution (Eager) - 1 query with JOIN = fast. Key takeaway: Understand common patterns (master-detail, hierarchical, many-to-many, polymorphic). Avoid anti-patterns (EAV, N+1, unlimited recursion). Use appropriate solutions (JOINs, CTEs, JSON columns)."
          alt="Query patterns use cases and solutions"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Pattern Selection</h2>

        <p>
          Different patterns have trade-offs. Understanding them helps you choose the
          right pattern for each use case.
        </p>

        <h3>Hierarchical Models Comparison</h3>
        <p>
          <strong>Adjacency list</strong>: Simplest (parent_id column), intuitive, easy
          to maintain. Trade-offs: recursive queries for tree traversal (slow for deep
          trees). Best for: shallow trees (2-3 levels), simple applications, frequent
          restructuring.
        </p>

        <p>
          <strong>Path enumeration</strong>: Fast reads (LIKE '1/5/%'), no recursion
          needed, easy subtree queries. Trade-offs: path updates on restructuring
          (change parent = update path for all descendants), path length limited by
          column size. Best for: read-heavy trees, deep trees, infrequent restructuring.
        </p>

        <p>
          <strong>Nested sets</strong>: Fast subtree queries (WHERE lft BETWEEN X AND
          Y), no recursion. Trade-offs: complex writes (insert/delete requires
          rebalancing—updating lft/rgt for many nodes), concurrent write issues
          (locking). Best for: read-only or read-heavy trees, rare restructuring.
        </p>

        <p>
          <strong>Closure table</strong>: Most flexible (supports graphs, not just
          trees), efficient queries (JOIN on closure table), easy to query ancestors
          and descendants. Trade-offs: extra table (storage overhead), maintenance
          overhead (update closure table on insert/delete). Best for: complex
          hierarchies (multiple parents), frequent queries on ancestors/descendants.
        </p>

        <h3>EAV vs JSON Columns</h3>
        <p>
          <strong>EAV</strong>: Maximum flexibility (add attributes without schema
          changes). Trade-offs: complex queries (self-joins), no type safety, poor
          performance. Avoid unless: you need to query individual attributes
          efficiently AND attributes are highly dynamic AND JSON columns aren't
          available.
        </p>

        <p>
          <strong>JSON columns</strong>: Flexible schema (add attributes without
          migration), single row per entity, index support (GIN). Trade-offs: limited
          querying (can't index individual attributes as efficiently), no foreign keys
          within JSON. Use for: dynamic attributes, semi-structured data, when you
          don't need to query individual attributes frequently.
        </p>

        <p>
          <strong>Fixed columns</strong>: Best performance (direct column access),
          type safety, foreign keys. Trade-offs: schema changes required for new
          attributes. Use for: known, stable attributes, performance-critical queries.
        </p>

        <h3>Polymorphic vs Separate Tables</h3>
        <p>
          <strong>Polymorphic associations</strong>: Single table for all associations,
          flexible (add new types without schema changes). Trade-offs: no foreign key
          constraints (referential integrity in application), complex queries (JOINs
          require conditional logic), can't use database-level cascades.
        </p>

        <p>
          <strong>Separate tables</strong>: Foreign key constraints (referential
          integrity), simple queries (direct JOINs), database-level cascades.
          Trade-offs: schema changes for new types (new table per type), more tables
          to manage. Use for: critical referential integrity, simple queries, known
          types.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Query Patterns</h2>

        <p>
          <strong>Use master-detail for header-line structures.</strong> Orders, invoices,
          shipments all follow this pattern. Normalize (separate tables), index foreign
          keys (order_id), use transactions (insert master + details atomically).
        </p>

        <p>
          <strong>Choose hierarchical model based on access patterns.</strong> Read-heavy
          → path enumeration or nested sets. Write-heavy → adjacency list. Complex
          queries → closure table. Always use LIMIT in recursive queries (prevent
          infinite loops).
        </p>

        <p>
          <strong>Index junction tables on both foreign keys.</strong>
          <code className="inline-code">CREATE INDEX ON user_roles(user_id)</code>,
          <code className="inline-code">CREATE INDEX ON user_roles(role_id)</code>.
          Enables efficient queries in both directions (users → roles, roles → users).
        </p>

        <p>
          <strong>Use JSON columns instead of EAV.</strong> Modern databases (PostgreSQL,
          MySQL, SQL Server) support JSON with indexing. More efficient than EAV,
          flexible schema, single row per entity.
        </p>

        <p>
          <strong>Prevent N+1 with eager loading.</strong> Configure ORM defaults
          (Rails: config.active_record.query_log_tags_enabled), use includes/select_related
          explicitly, monitor query count (alert on N+1 patterns).
        </p>

        <p>
          <strong>Enforce referential integrity where possible.</strong> Foreign keys
          prevent orphaned records, enable cascades (delete parent → delete children),
          document relationships. For polymorphic associations, enforce in application
          (validate commentable_type exists).
        </p>

        <p>
          <strong>Test query patterns with realistic data.</strong> Small datasets hide
          performance issues. Test with production-like volumes (100K+ rows), measure
          query times, verify indexes are used (EXPLAIN ANALYZE).
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>Using EAV for known attributes.</strong> EAV is tempting for flexibility,
          but query complexity and performance issues aren't worth it. Solution: use
          fixed columns for known attributes, JSON columns for dynamic attributes.
        </p>

        <p>
          <strong>N+1 queries in ORMs.</strong> ORMs make N+1 easy (lazy loading).
          Solution: enable query logging (see N+1 patterns), use eager loading
          (includes, select_related), add tests that assert query count.
        </p>

        <p>
          <strong>Unlimited recursive queries.</strong> Recursive CTEs without LIMIT
          can infinite loop (cycles in data). Solution: always use LIMIT or depth
          check (<code className="inline-code">WHERE depth less than 10</code>), detect cycles
          (track visited nodes).
        </p>

        <p>
          <strong>Missing indexes on foreign keys.</strong> JOINs on unindexed foreign
          keys are slow (full table scans). Solution: index all foreign keys
          (<code className="inline-code">CREATE INDEX ON order_items(order_id)</code>),
          index junction tables on both keys.
        </p>

        <p>
          <strong>Polymorphic associations without validation.</strong> No foreign key
          constraints means orphaned records possible. Solution: validate in application
          (commentable_type must be valid model), add database triggers for critical
          integrity.
        </p>

        <p>
          <strong>Choosing wrong hierarchical model.</strong> Adjacency list for deep
          read-heavy trees (slow queries), nested sets for write-heavy trees (rebalancing
          overhead). Solution: analyze access patterns (read vs write ratio, tree depth),
          choose model accordingly.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Platform</h3>
        <p>
          E-commerce uses all patterns: <strong>Master-detail</strong> (orders → order
          items), <strong>Hierarchical</strong> (categories → subcategories—path
          enumeration for fast filtering), <strong>Many-to-many</strong> (products ↔
          tags via product_tags), <strong>Polymorphic</strong> (reviews on products,
          sellers, categories). Benefits: normalized schema, efficient queries, flexible
          for new features.
        </p>

        <h3>Social Media Platform</h3>
        <p>
          Social media uses: <strong>Master-detail</strong> (users → posts),
          <strong>Polymorphic</strong> (comments on posts, comments, users),
          <strong>Many-to-many</strong> (users ↔ users for follows—self-referencing
          junction table), <strong>Hierarchical</strong> (nested comments—adjacency
          list with recursive CTE). Benefits: flexible content model, efficient feed
          generation, supports nested discussions.
        </p>

        <h3>Enterprise RBAC System</h3>
        <p>
          Enterprise access control uses: <strong>Many-to-many</strong> (users ↔ roles
          via user_roles, roles ↔ permissions via role_permissions),
          <strong>Hierarchical</strong> (org chart—closure table for efficient ancestor
          queries), <strong>Polymorphic</strong> (audit logs on any entity). Benefits:
          flexible access control, efficient permission checks, comprehensive audit trail.
        </p>

        <h3>Content Management System</h3>
        <p>
          CMS uses: <strong>Hierarchical</strong> (pages → subpages—path enumeration
          for URL generation), <strong>Many-to-many</strong> (pages ↔ tags, pages ↔
          categories), <strong>Polymorphic</strong> (attachments on pages, posts,
          users), <strong>JSON columns</strong> (page metadata—dynamic fields per
          template). Benefits: flexible content model, efficient URL routing, supports
          custom fields.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What is the N+1 query problem? How do you identify and fix it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> N+1 pattern: fetch N parent records (1 query),
              then fetch children for each parent (N queries). Example: fetch 100
              users (1 query), then fetch orders for each user (100 queries) = 101
              queries total. Identify: (1) Query logs show many similar queries, (2)
              ORM debug mode shows N+1 pattern, (3) Monitoring shows high query count
              per request. Fix: (1) Eager loading (JOIN:
              <code className="inline-code">SELECT users.*, orders.* FROM users LEFT
              JOIN orders ON users.id = orders.user_id</code>), (2) IN clause
              (<code className="inline-code">SELECT * FROM orders WHERE user_id IN
              (1,2,3,...)</code>), (3) ORM-specific (Rails: includes, Django:
              select_related/prefetch_related). Benefit: 1-2 queries instead of N+1.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When would you NOT fix N+1? Answer: When N
              is small (1-10), overhead of eager loading may exceed N+1 cost. Or when
              you only need children for subset of parents (lazy loading is better).
              Profile before optimizing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What is EAV? Why is it an anti-pattern and what are the alternatives?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> EAV (Entity-Attribute-Value):
              <code className="inline-code">products(id, name)</code>,
              <code className="inline-code">product_attributes(product_id, attribute_name,
              attribute_value)</code>. Stores attributes as rows instead of columns.
              Anti-pattern because: (1) Complex queries (self-joins for each attribute),
              (2) No type safety (all values are strings), (3) No foreign keys (can't
              enforce valid attribute names), (4) Poor performance (many self-joins,
              can't use indexes effectively). Alternatives: (1) Fixed columns (for
              known attributes—best performance), (2) JSON columns (for dynamic
              attributes—flexible, indexed), (3) Hybrid (fixed columns for common
              attributes, JSON for rare).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When is EAV acceptable? Answer: Rarely.
              Maybe when: attributes are highly dynamic (hundreds, changing frequently),
              you need to query individual attributes efficiently, JSON columns aren't
              available (old database). Even then, consider JSON columns or separate
              tables per category.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: Compare hierarchical data models. When would you use each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Adjacency list (parent_id column): simplest,
              intuitive, easy to maintain. Use for: shallow trees (2-3 levels),
              frequent restructuring. Path enumeration (path = '1/5/23/'): fast
              reads (LIKE '1/5/%'), no recursion. Use for: read-heavy trees, deep
              trees, infrequent restructuring. Nested sets (lft/rgt values): fast
              subtree queries. Use for: read-only trees, rare restructuring. Closure
              table (separate ancestor-descendant table): most flexible (supports
              graphs), efficient queries. Use for: complex hierarchies (multiple
              parents), frequent ancestor/descendant queries.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you query a tree with adjacency list?
              Answer: Recursive CTE:
              <code className="inline-code">WITH RECURSIVE tree AS (SELECT id,
              parent_id FROM categories WHERE id = 1 UNION ALL SELECT c.id,
              c.parent_id FROM categories c JOIN tree t ON c.parent_id = t.id)
              SELECT * FROM tree</code>. Always use LIMIT to prevent infinite loops.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: What are polymorphic associations? What are the trade-offs?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Polymorphic associations: one table references
              multiple tables. <code className="inline-code">comments(id, body,
              commentable_type, commentable_id)</code>. commentable_type =
              'Post'/'User'/'Video', commentable_id = referenced record's ID.
              Benefits: single table for all associations, flexible (add new types
              without schema changes). Trade-offs: (1) No foreign key constraints
              (referential integrity in application), (2) Complex queries (JOINs
              require conditional logic), (3) Can't use database-level cascades,
              (4) Harder to enforce data integrity. Use for: comments, attachments,
              audit logs (when you need single table for all types).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you enforce referential integrity
              for polymorphic associations? Answer: Can't use foreign keys. Enforce
              in application (validate commentable_type exists before insert), add
              database triggers (check referenced record exists), or use separate
              tables per type (comments_on_posts, comments_on_users—more tables,
              but foreign keys work).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: How do you design a many-to-many relationship? What indexes do you
              need?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Many-to-many requires junction table:
              <code className="inline-code">users(id, name)</code>,
              <code className="inline-code">roles(id, name)</code>,
              <code className="inline-code">user_roles(user_id, role_id)</code>.
              Junction table has: (1) Foreign keys to both tables (user_id → users.id,
              role_id → roles.id), (2) Composite primary key (user_id, role_id) or
              separate ID, (3) Optional additional columns (granted_at, granted_by).
              Indexes: (1) Index on user_id (query roles for user), (2) Index on
              role_id (query users for role), (3) Unique constraint on (user_id,
              role_id) prevent duplicates. Query:
              <code className="inline-code">SELECT r.* FROM roles r JOIN user_roles
              ur ON r.id = ur.role_id WHERE ur.user_id = ?</code>.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if you need to query in both directions
              frequently? Answer: Index both foreign keys (user_id and role_id).
              Database can use either index depending on query direction. For very
              large junction tables, consider partitioning or denormalization.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your recursive query is running forever. How do you diagnose and
              fix this?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Diagnose: (1) Check for cycles in data
              (A is parent of B, B is parent of A—creates infinite loop), (2) Check
              if recursive CTE has LIMIT or depth check, (3) Check termination
              condition (is it ever false?). Fix: (1) Add LIMIT
              (<code className="inline-code">LIMIT 1000</code>), (2) Add depth check
              (<code className="inline-code">WHERE depth less than 10</code>), (3) Detect
              cycles (track visited nodes:
              <code className="inline-code">WHERE id != ALL(visited_ids)</code>),
              (4) Fix data (remove cycles—A can't be parent of B if B is ancestor
              of A). Prevention: add database constraint (prevent cycles on
              insert/update), validate in application before saving.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> How do you detect cycles in existing data?
              Answer: Run recursive query with cycle detection:
              <code className="inline-code">WITH RECURSIVE tree AS (SELECT id,
              parent_id, ARRAY[id] as path, false as cycle FROM categories WHERE
              parent_id IS NULL UNION ALL SELECT c.id, c.parent_id, t.path || c.id,
              c.id = ANY(t.path) FROM categories c JOIN tree t ON c.parent_id =
              t.id WHERE NOT t.cycle) SELECT * FROM tree WHERE cycle</code>. Returns
              rows with cycles.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O'Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O'Reilly, 2019. Chapter 5.
          </li>
          <li>
            PostgreSQL Documentation, "Recursive Queries,"
            https://www.postgresql.org/docs/current/queries-with.html
          </li>
          <li>
            MySQL Documentation, "WITH Syntax,"
            https://dev.mysql.com/doc/refman/8.0/en/with.html
          </li>
          <li>
            SQL Server Documentation, "Recursive Queries Using CTEs,"
            https://docs.microsoft.com/en-us/sql/relational-databases/queries/recursive-queries-using-common-table-expressions
          </li>
          <li>
            Joe Celko, "Trees and Hierarchies in SQL for Smarties," Morgan Kaufmann, 2012.
          </li>
          <li>
            Use The Index, Luke, "JOIN Operations,"
            https://use-the-index-luke.com/sql/join
          </li>
          <li>
            Rails Guides, "Active Record Query Interface,"
            https://guides.rubyonrails.org/active_record_querying.html
          </li>
          <li>
            Django Documentation, "Database Optimization,"
            https://docs.djangoproject.com/en/stable/topics/db/optimization/
          </li>
          <li>
            Hibernate Documentation, "Fetching Strategies,"
            https://docs.jboss.org/hibernate/orm/
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
