"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-constraints-complete",
  title: "Database Constraints",
  description:
    "Comprehensive guide to database constraints: PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL constraints, referential integrity, and foreign key actions (CASCADE, SET NULL, RESTRICT).",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "database-constraints",
  wordCount: 5500,
  readingTime: 25,
  lastUpdated: "2026-04-01",
  tags: ["backend", "data-storage", "constraints", "data-integrity", "database"],
  relatedTopics: [
    "database-indexes",
    "relational-database-design",
    "data-modeling-in-nosql",
    "sql-queries-optimization",
  ],
};

const BASE_PATH = "/diagrams/system-design-concepts/backend/data-storage-databases";

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h1>Database Constraints</h1>
        <p className="lead">
          Database constraints are rules enforced at the database level to ensure data integrity,
          prevent invalid data, and maintain relationships between tables. Common constraints
          include: <strong>PRIMARY KEY</strong> (unique identifier, NOT NULL),
          <strong>FOREIGN KEY</strong> (references another table, referential integrity),
          <strong>UNIQUE</strong> (no duplicate values), <strong>CHECK</strong> (custom
          conditions like age greater than 0), and <strong>NOT NULL</strong> (required fields). Constraints
          are enforced automatically on INSERT/UPDATE/DELETE, preventing invalid data at the
          source. Foreign keys also define actions (CASCADE, SET NULL, RESTRICT) for handling
          parent record deletion.
        </p>

        <p>
          Consider an e-commerce orders table. Without constraints: orders could reference
          non-existent users (orphaned records), duplicate order IDs could exist, orders could
          have negative totals. With constraints:
          <code className="inline-code">PRIMARY KEY</code> ensures unique order IDs,
          <code className="inline-code">FOREIGN KEY</code> ensures user_id references existing
          users, <code className="inline-code">CHECK</code> ensures total ≥ 0. Invalid data is
          rejected at insert time, not discovered later in reports.
        </p>

        <p>
          Constraints involve trade-offs: <strong>Data integrity</strong> (prevents invalid data)
          vs <strong>Flexibility</strong> (schema changes require constraint updates),
          <strong>Safety</strong> (database enforces rules) vs <strong>Performance</strong>
          (small overhead on writes). Best practice: use constraints for critical rules
          (uniqueness, referential integrity), validate business logic in application
          (complex rules, cross-table validation).
        </p>

        <p>
          This article provides a comprehensive examination of database constraints: constraint
          types (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL), foreign key actions
          (CASCADE, SET NULL, RESTRICT, SET DEFAULT), constraint enforcement (immediate vs
          deferred), and real-world use cases. We'll explore when constraints excel (data
          integrity, referential integrity, uniqueness) and when they introduce complexity
          (circular dependencies, performance overhead). We'll also cover best practices
          (indexing FK columns, choosing appropriate actions) and common pitfalls (no
          constraints, CASCADE everywhere, missing FK indexes).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/database-constraints-types.svg`}
          caption="Figure 1: Database Constraints Types showing Constraint Types: PRIMARY KEY (Unique + NOT NULL, one per table), FOREIGN KEY (references another table), UNIQUE (no duplicate values, allows NULL), CHECK (custom condition like age greater than 0). Foreign Key Actions: CASCADE (Delete parent → delete children), SET NULL (Delete parent → FK = NULL), RESTRICT/NO ACTION (Prevent delete if children exist), SET DEFAULT (Delete parent → FK = default). Constraint Enforcement: Immediate (check each statement), Deferred (check at commit), Indexes (auto-created for PK/UK), Performance (small overhead). Key characteristics: PK (unique+not null), FK (referential integrity), UNIQUE (no duplicates), CHECK (custom conditions), CASCADE/SET NULL/RESTRICT actions."
          alt="Database constraints types"
        />
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts: Constraint Types</h2>

        <h3>PRIMARY KEY Constraint</h3>
        <p>
          <strong>PRIMARY KEY</strong> uniquely identifies each row in a table. Combines
          <code className="inline-code">UNIQUE</code> (no duplicates) and
          <code className="inline-code">NOT NULL</code> (required). Each table can have only
          one PRIMARY KEY. Example: <code className="inline-code">CREATE TABLE users (id
          SERIAL PRIMARY KEY, email TEXT)</code>. PRIMARY KEY is automatically indexed
          (fast lookups).
        </p>

        <p>
          <strong>Composite PRIMARY KEY</strong>: Multiple columns form the key.
          <code className="inline-code">CREATE TABLE order_items (order_id INTEGER,
          product_id INTEGER, PRIMARY KEY (order_id, product_id))</code>. Used for junction
          tables (many-to-many relationships). Trade-off: more complex queries, but enforces
          uniqueness across columns.
        </p>

        <p>
          <strong>Surrogate vs Natural keys</strong>: Surrogate (synthetic ID, e.g.,
          <code className="inline-code">SERIAL</code>, <code className="inline-code">UUID</code>)
          is database-generated, stable, simple. Natural (business meaning, e.g., email, SSN)
          has business significance, but may change (email changes), can be complex (composite).
          Best practice: use surrogate keys for PRIMARY KEY, natural keys with
          <code className="inline-code">UNIQUE</code> constraint.
        </p>

        <h3>FOREIGN KEY Constraint</h3>
        <p>
          <strong>FOREIGN KEY</strong> enforces referential integrity: child table references
          parent table. <code className="inline-code">CREATE TABLE orders (id SERIAL
          PRIMARY KEY, user_id INTEGER REFERENCES users(id))</code>. Ensures
          <code className="inline-code">user_id</code> always references existing
          <code className="inline-code">users.id</code>. Prevents orphaned records
          (orders without users).
        </p>

        <p>
          <strong>Referential actions</strong> define what happens when parent is deleted/updated:
          <code className="inline-code">ON DELETE CASCADE</code> (delete children),
          <code className="inline-code">ON DELETE SET NULL</code> (set FK to NULL),
          <code className="inline-code">ON DELETE RESTRICT</code> (prevent delete if children
          exist), <code className="inline-code">ON DELETE SET DEFAULT</code> (set FK to
          default value). Default is <code className="inline-code">NO ACTION</code> (similar
          to RESTRICT).
        </p>

        <p>
          <strong>Self-referencing FK</strong>: Table references itself.
          <code className="inline-code">CREATE TABLE employees (id SERIAL PRIMARY KEY,
          manager_id INTEGER REFERENCES employees(id))</code>. Used for hierarchical data
          (org charts, category trees). Trade-off: enables recursion, but requires careful
          handling (prevent cycles).
        </p>

        <h3>UNIQUE Constraint</h3>
        <p>
          <strong>UNIQUE</strong> ensures no duplicate values in a column (or column set).
          <code className="inline-code">CREATE TABLE users (id SERIAL PRIMARY KEY, email
          TEXT UNIQUE)</code>. Unlike PRIMARY KEY, allows NULL (multiple NULLs allowed).
          Table can have multiple UNIQUE constraints. UNIQUE is automatically indexed
          (fast lookups, prevents duplicates efficiently).
        </p>

        <p>
          <strong>Composite UNIQUE</strong>: Multiple columns must be unique together.
          <code className="inline-code">CREATE TABLE user_roles (user_id INTEGER, role_id
          INTEGER, UNIQUE (user_id, role_id))</code>. Prevents duplicate assignments (same
          user can't have same role twice), but allows different combinations.
        </p>

        <p>
          Use cases: <strong>Email/username</strong> (unique per user),
          <strong>SKU/product code</strong> (unique per product), <strong>ISBN</strong>
          (unique per book), <strong>Composite unique</strong> (user+role, order+product).
        </p>

        <h3>CHECK Constraint</h3>
        <p>
          <strong>CHECK</strong> enforces custom conditions.
          <code className="inline-code">CREATE TABLE products (id SERIAL PRIMARY KEY,
          price NUMERIC CHECK (price &gt;= 0), stock INTEGER CHECK (stock &gt;= 0))</code>.
          Prevents negative prices, negative stock. CHECK is evaluated on INSERT/UPDATE,
          rejects invalid data.
        </p>

        <p>
          Use cases: <strong>Range checks</strong> (age BETWEEN 0 AND 150),
          <strong>Format checks</strong> (email LIKE '%@%'), <strong>Status validation</strong>
          (status IN ('pending', 'approved', 'rejected')), <strong>Cross-column checks</strong>
          (end_date &gt; start_date). Trade-off: prevents invalid data, but complex checks
          may be better in application (more flexible, easier to test).
        </p>

        <h3>NOT NULL Constraint</h3>
        <p>
          <strong>NOT NULL</strong> ensures column can't be NULL.
          <code className="inline-code">CREATE TABLE users (id SERIAL PRIMARY KEY, email
          TEXT NOT NULL, created_at TIMESTAMP NOT NULL)</code>. Required fields must have
          values. NULL means "unknown" or "not applicable"—NOT NULL ensures data is always
          present.
        </p>

        <p>
          Use cases: <strong>Required fields</strong> (email, username),
          <strong>Timestamps</strong> (created_at, updated_at), <strong>Foreign keys</strong>
          (when relationship is mandatory). Trade-off: ensures data completeness, but reduces
          flexibility (can't represent "unknown").
        </p>

        <ArticleImage
          src={`${BASE_PATH}/database-constraints-foreign-key.svg`}
          caption="Figure 2: Foreign Key Constraints and Actions showing Foreign Key Example (users table with id PK, orders table with user_id → users.id FK). CASCADE Delete Example: Before Delete (User 1 + 3 orders), DELETE FROM users WHERE id = 1, After Delete (User + orders gone). Use for: Child records have no meaning without parent. Foreign Key Best Practices: Index FK Columns (faster JOINs), Choose Action (CASCADE/SET NULL/RESTRICT), Avoid Cycles (circular FKs), Document (relationships). Key takeaway: FKs enforce referential integrity. CASCADE for dependent children, SET NULL for optional relationships, RESTRICT for critical data. Always index FK columns."
          alt="Foreign key constraints and actions"
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Implementation: FK Actions &amp; Enforcement</h2>

        <h3>Foreign Key Actions</h3>
        <p>
          <strong>CASCADE</strong>: Delete/update parent → automatically delete/update children.
          <code className="inline-code">ON DELETE CASCADE</code>. Use for: child records have
          no meaning without parent (order_items without orders, comments without posts).
          Trade-off: convenient, but accidental mass deletes possible (delete user → delete
          all orders).
        </p>

        <p>
          <strong>SET NULL</strong>: Delete parent → set FK to NULL.
          <code className="inline-code">ON DELETE SET NULL</code>. Use for: optional
          relationships (posts can exist without author if author deleted). Requires FK
          column to allow NULL. Trade-off: preserves child records, but loses relationship
          information.
        </p>

        <p>
          <strong>RESTRICT / NO ACTION</strong>: Prevent delete/update if children exist.
          <code className="inline-code">ON DELETE RESTRICT</code>. Use for: critical data
          (can't delete user with orders). Forces application to handle children first
          (archive orders, then delete user). Trade-off: safest, but requires application
          logic to handle.
        </p>

        <p>
          <strong>SET DEFAULT</strong>: Delete parent → set FK to default value.
          <code className="inline-code">ON DELETE SET DEFAULT</code>. Use for: fallback
          relationships (assign orders to "deleted user" account). Requires default value.
          Trade-off: preserves relationship structure, but default may not be meaningful.
        </p>

        <h3>Constraint Enforcement</h3>
        <p>
          <strong>Immediate enforcement</strong> (default): Check constraint on each statement.
          <code className="inline-code">INSERT INTO orders (user_id) VALUES (999)</code>
          fails immediately if user 999 doesn't exist. Most databases use immediate
          enforcement.
        </p>

        <p>
          <strong>Deferred enforcement</strong>: Check constraint at transaction commit.
          <code className="inline-code">SET CONSTRAINTS ALL DEFERRED</code>. Use for:
          circular dependencies (A references B, B references A). Insert A (FK to B),
          insert B (FK to A), commit (both checks pass). Trade-off: enables complex
          operations, but errors occur at commit (not at insert).
        </p>

        <h3>Constraint Indexes</h3>
        <p>
          <strong>PRIMARY KEY</strong> and <strong>UNIQUE</strong> constraints automatically
          create indexes. Index enforces uniqueness efficiently (O(log n) lookup vs O(n)
          scan). <strong>FOREIGN KEY</strong> does NOT automatically create index—must
          create manually: <code className="inline-code">CREATE INDEX ON orders(user_id)</code>.
          Without index: JOINs are slow (full table scan), CASCADE/SET NULL operations
          are slow (can't find children efficiently).
        </p>

        <p>
          <strong>Performance overhead</strong>: Constraints add small overhead on writes
          (check constraint, update index). Typical: 1-5% slower INSERT/UPDATE. Trade-off:
          worth it for data integrity (prevents invalid data, enables optimizer).
        </p>

        <ArticleImage
          src={`${BASE_PATH}/database-constraints-use-cases.svg`}
          caption="Figure 3: Database Constraints Use Cases and Best Practices. Primary Use Cases: Data Integrity (prevent invalid data, enforce business rules, PRIMARY KEY unique ID, CHECK like age greater than 0 or price ≥ 0, NOT NULL required fields), Referential Integrity (FOREIGN KEY constraints, prevent orphaned records, CASCADE delete/update, maintain relationships, orders.user_id → users.id), Uniqueness (UNIQUE constraints, email/username unique, prevent duplicates, auto-indexed for fast lookup, multiple UNIQUE per table). Constraint Trade-offs: Benefits (data integrity, safety), Overhead (small write penalty), Flexibility (less flexible, more safe), Application (DB vs app validation). Anti-patterns: no constraints (invalid data possible), CASCADE everywhere (accidental mass deletes), circular FKs (deadlocks), missing FK indexes (slow JOINs), CHECK in app only (inconsistent data)."
          alt="Database constraints use cases and best practices"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison: Constraints vs Application Validation</h2>

        <p>
          Constraints can be enforced at database level or application level. Understanding
          the trade-offs helps you choose the right approach.
        </p>

        <h3>Database Constraints Strengths</h3>
        <p>
          <strong>Data integrity</strong> is the primary advantage. Constraints are enforced
          regardless of application (multiple apps, direct SQL access, bugs). Invalid data
          is rejected at source, not discovered later.
        </p>

        <p>
          <strong>Centralized rules</strong>: One place to define rules (database schema),
          not scattered across applications. Easier to maintain, document, audit.
        </p>

        <p>
          <strong>Optimizer benefits</strong>: Database uses constraints for query optimization.
          Knowing FK relationships enables better JOIN strategies, eliminates unnecessary
          checks.
        </p>

        <h3>Database Constraints Limitations</h3>
        <p>
          <strong>Schema changes</strong>: Adding/changing constraints requires migration
          (downtime for large tables). Less flexible than application validation.
        </p>

        <p>
          <strong>Complex logic</strong>: CHECK constraints are limited (can't reference
          other tables, can't call external services). Complex business logic belongs in
          application.
        </p>

        <p>
          <strong>Performance overhead</strong>: Small but measurable (1-5% slower writes).
          For extremely high-write workloads, may consider relaxing some constraints.
        </p>

        <h3>Application Validation Strengths</h3>
        <p>
          <strong>Flexibility</strong>: Easy to change validation logic (deploy code vs
          database migration). Complex rules (cross-table, external API calls) are easier
          in application.
        </p>

        <p>
          <strong>User feedback</strong>: Application can provide detailed error messages
          ("email already taken, try another"), while database errors are generic
          ("violates UNIQUE constraint").
        </p>

        <h3>Application Validation Limitations</h3>
        <p>
          <strong>Not enforced</strong>: Bugs, direct SQL access, or multiple apps can
          bypass validation. Invalid data can slip through.
        </p>

        <p>
          <strong>Duplicated logic</strong>: Same validation in multiple places (frontend,
          backend, batch jobs). Harder to maintain, inconsistencies possible.
        </p>

        <h3>Best Practice: Defense in Depth</h3>
        <p>
          Use <strong>both</strong> database and application validation:
        </p>

        <p>
          <strong>Database constraints</strong> for: Critical rules (uniqueness, referential
          integrity, NOT NULL), simple checks (price ≥ 0, age &gt; 0), rules that must
          always be enforced.
        </p>

        <p>
          <strong>Application validation</strong> for: Complex business logic (cross-table
          checks, external API calls), user feedback (detailed error messages), flexible
          rules (change frequently).
        </p>

        <p>
          Example: User registration. Database:
          <code className="inline-code">UNIQUE (email)</code>,
          <code className="inline-code">NOT NULL (email, password_hash)</code>. Application:
          Check password strength, verify email format, check against blocklist, send
          confirmation email. Both layers ensure data integrity.
        </p>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices for Database Constraints</h2>

        <p>
          <strong>Always use PRIMARY KEY.</strong> Every table needs a unique identifier.
          Use surrogate keys (SERIAL, UUID) for simplicity, natural keys only if stable
          (never change).
        </p>

        <p>
          <strong>Use FOREIGN KEY for relationships.</strong> Enforce referential integrity.
          Choose appropriate action (CASCADE for dependent children, SET NULL for optional,
          RESTRICT for critical). Always index FK columns.
        </p>

        <p>
          <strong>Index foreign key columns.</strong> Database doesn't auto-index FKs.
          <code className="inline-code">CREATE INDEX ON orders(user_id)</code>. Benefits:
          faster JOINs, faster CASCADE/SET NULL operations, faster FK constraint checks.
        </p>

        <p>
          <strong>Use UNIQUE for business keys.</strong> Email, username, SKU should have
          UNIQUE constraints. Prevents duplicates, enables fast lookups (auto-indexed).
        </p>

        <p>
          <strong>Use CHECK for simple validations.</strong> Price ≥ 0, age &gt; 0, status
          IN (...). Prevents obviously invalid data. Keep CHECK conditions simple (complex
          logic in application).
        </p>

        <p>
          <strong>Avoid circular foreign keys.</strong> A → B → A creates circular dependency.
          Can cause deadlocks, requires deferred constraints. Redesign schema if possible
          (remove one FK, use application logic).
        </p>

        <p>
          <strong>Document constraints.</strong> Schema documentation should list all
          constraints, explain purpose (why CASCADE vs RESTRICT), note any deferred
          constraints. Helps developers understand data model.
        </p>

        <p>
          <strong>Test constraint violations.</strong> Write tests that attempt to violate
          constraints (insert duplicate, delete parent, insert invalid value). Verify
          constraints are enforced, error messages are clear.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls and How to Avoid Them</h2>

        <p>
          <strong>No constraints.</strong> Relying only on application validation. Invalid
          data can slip through (bugs, direct SQL, multiple apps). Solution: Add database
          constraints for critical rules (PK, FK, UNIQUE, CHECK).
        </p>

        <p>
          <strong>CASCADE everywhere.</strong> Using CASCADE for all FKs. Accidental mass
          deletes possible (delete user → delete all orders, order_items, reviews). Solution:
          Use RESTRICT for critical data (orders), CASCADE only for dependent children
          (order_items).
        </p>

        <p>
          <strong>Missing FK indexes.</strong> Not indexing foreign key columns. JOINs are
          slow (full table scan), CASCADE operations are slow. Solution:
          <code className="inline-code">CREATE INDEX ON orders(user_id)</code> for all FK
          columns.
        </p>

        <p>
          <strong>Circular foreign keys.</strong> A → B → A creates circular dependency.
          Can cause deadlocks, requires deferred constraints. Solution: Redesign schema
          (remove one FK, use application logic), or use deferred constraints carefully.
        </p>

        <p>
          <strong>CHECK in application only.</strong> Validating price ≥ 0 only in application.
          Direct SQL or bugs can insert negative prices. Solution: Add CHECK constraint
          <code className="inline-code">CHECK (price &gt;= 0)</code>.
        </p>

        <p>
          <strong>NULL in foreign keys.</strong> FK allows NULL by default. Orphaned records
          possible (order with NULL user_id). Solution: Add NOT NULL if relationship is
          mandatory <code className="inline-code">user_id INTEGER NOT NULL REFERENCES
          users(id)</code>.
        </p>

        <p>
          <strong>Changing PRIMARY KEY type.</strong> Changing from SERIAL to UUID (or vice
          versa) requires updating all FK references. Solution: Choose PK type carefully
          upfront, or use surrogate ID that never changes.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Orders</h3>
        <p>
          E-commerce uses all constraint types: <strong>PRIMARY KEY</strong> (unique order
          ID), <strong>FOREIGN KEY</strong> (user_id → users.id, CASCADE delete),
          <strong>CHECK</strong> (total ≥ 0, quantity &gt; 0), <strong>NOT NULL</strong>
          (user_id, total, created_at). Benefits: prevents orphaned orders, invalid totals,
          missing required fields.
        </p>

        <h3>User Management (RBAC)</h3>
        <p>
          Role-based access control: <strong>PRIMARY KEY</strong> (unique user/role IDs),
          <strong>FOREIGN KEY</strong> (user_roles.user_id → users.id, ON DELETE CASCADE),
          <strong>UNIQUE</strong> (email, username), <strong>CHECK</strong> (status IN
          ('active', 'inactive', 'suspended')). Benefits: prevents orphaned role assignments,
          duplicate emails, invalid statuses.
        </p>

        <h3>Content Management (Blog)</h3>
        <p>
          Blog platform: <strong>PRIMARY KEY</strong> (unique post/comment IDs),
          <strong>FOREIGN KEY</strong> (comments.post_id → posts.id, ON DELETE CASCADE),
          <strong>FOREIGN KEY</strong> (posts.user_id → users.id, ON DELETE SET NULL),
          <strong>CHECK</strong> (published_at &gt;= created_at). Benefits: comments deleted
          with posts, posts preserved when author deleted (SET NULL), valid publish dates.
        </p>

        <h3>Inventory Management</h3>
        <p>
          Inventory system: <strong>PRIMARY KEY</strong> (unique product/SKU IDs),
          <strong>UNIQUE</strong> (SKU), <strong>CHECK</strong> (stock ≥ 0, price ≥ 0,
          reorder_point ≥ 0), <strong>NOT NULL</strong> (SKU, name, price). Benefits:
          prevents overselling (stock ≥ 0), invalid prices, duplicate SKUs.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q1: What are database constraints? Why are they important?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Constraints are rules enforced at database level to
              ensure data integrity, prevent invalid data, maintain relationships. Types:
              PRIMARY KEY (unique identifier), FOREIGN KEY (referential integrity), UNIQUE
              (no duplicates), CHECK (custom conditions), NOT NULL (required fields).
              Important because: (1) Prevents invalid data (rejected at insert, not discovered
              later), (2) Enforces business rules (centralized, consistent), (3) Enables
              query optimization (database knows relationships), (4) Documents data model
              (constraints show intended structure). Trade-off: small write overhead (1-5%),
              but worth it for data integrity.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Should you validate in database or application?
              Answer: Both (defense in depth). Database for critical rules (uniqueness,
              referential integrity, simple checks). Application for complex logic (cross-table,
              external APIs), user feedback (detailed errors).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q2: What happens when you delete a parent record with foreign key constraints?
              Explain CASCADE, SET NULL, RESTRICT.
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Depends on FK action. CASCADE: delete parent →
              automatically delete children. Use for: child has no meaning without parent
              (order_items without orders). SET NULL: delete parent → set FK to NULL. Use
              for: optional relationships (posts can exist without author). Requires FK to
              allow NULL. RESTRICT/NO ACTION: prevent delete if children exist. Use for:
              critical data (can't delete user with orders). Forces application to handle
              children first. Default is NO ACTION (similar to RESTRICT).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What's the difference between RESTRICT and NO
              ACTION? Answer: Subtle. RESTRICT checks immediately (can't delete parent
              even in same transaction). NO ACTION checks at end of statement (can delete
              parent if children are deleted/updated in same transaction). Most databases
              treat them similarly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q3: Why should you index foreign key columns?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Database doesn't auto-index FKs (unlike PK/UNIQUE).
              Without index: (1) JOINs are slow (full table scan to find matching rows),
              (2) CASCADE/SET NULL operations are slow (can't find children efficiently),
              (3) FK constraint checks are slow (must scan table to verify parent exists).
              With index: <code className="inline-code">CREATE INDEX ON orders(user_id)</code>.
              JOINs use index (O(log n) vs O(n)), CASCADE/SET NULL find children quickly,
              FK checks are fast. Trade-off: small storage overhead, slower writes (update
              index), but worth it for read performance and FK operations.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> When would you NOT index a FK? Answer: Very small
              tables (full scan is fast), write-heavy tables with rare reads/JOINs, FK
              column has very low cardinality (few distinct values—index not selective).
              But these are rare—generally index all FKs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q4: What is a circular foreign key? How do you handle it?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Circular FK: A → B → A (A references B, B references
              A). Example: users (manager_id → users.id) and managers (user_id → users.id).
              Problems: (1) Can't insert (A needs B, B needs A), (2) Can cause deadlocks
              (transaction 1 locks A, transaction 2 locks B), (3) Complex to delete.
              Solutions: (1) Redesign schema (remove one FK, use application logic), (2) Use
              deferred constraints (<code className="inline-code">SET CONSTRAINTS ALL
              DEFERRED</code>—check at commit, not insert), (3) Insert with NULL FK, update
              after (insert A with NULL manager_id, insert B, update A.manager_id). Best:
              avoid circular FKs if possible.
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What are deferred constraints? Answer: Constraints
              checked at transaction commit, not each statement.
              <code className="inline-code">SET CONSTRAINTS ALL DEFERRED</code>. Enables
              circular inserts (A needs B, B needs A—both inserted, checked at commit).
              Trade-off: errors occur at commit (not insert), harder to debug.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q5: What's the difference between PRIMARY KEY and UNIQUE? When would you use
              each?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> PRIMARY KEY: unique + NOT NULL, one per table,
              automatically indexed, used as row identifier. UNIQUE: unique (allows NULL),
              multiple per table, automatically indexed, used for business keys. Use PRIMARY
              KEY for: surrogate ID (SERIAL, UUID), table's main identifier. Use UNIQUE for:
              natural keys (email, username, SKU), alternate identifiers, composite uniqueness
              (user_id + role_id). Example:
              <code className="inline-code">users(id SERIAL PRIMARY KEY, email TEXT UNIQUE,
              username TEXT UNIQUE)</code>. ID is PK (surrogate), email/username are UNIQUE
              (natural keys).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> Can PRIMARY KEY be NULL? Answer: No. PRIMARY KEY
              implies NOT NULL. UNIQUE allows NULL (multiple NULLs allowed—NULL ≠ NULL).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <p className="font-semibold text-lg">
              Q6: Your application has duplicate emails in the users table. How do you
              prevent this going forward?
            </p>
            <p className="mt-3 text-sm">
              <strong>Answer:</strong> Add UNIQUE constraint on email column:
              <code className="inline-code">ALTER TABLE users ADD CONSTRAINT users_email_unique
              UNIQUE (email)</code>. This prevents future duplicates (insert/update rejected
              if email exists). For existing duplicates: (1) Find duplicates
              (<code className="inline-code">SELECT email, COUNT(*) FROM users GROUP BY
              email HAVING COUNT(*) &gt; 1</code>), (2) Fix or delete duplicates (merge
              accounts, append number to email), (3) Then add constraint. Also add application
              validation (check email exists before insert), but database constraint is
              essential (prevents duplicates from bugs, direct SQL, multiple apps).
            </p>
            <p className="mt-2 text-sm text-muted">
              <strong>Follow-up:</strong> What if adding constraint fails due to existing
              duplicates? Answer: Must fix duplicates first. Options: (1) Merge duplicate
              accounts (combine data, delete duplicates), (2) Append number to duplicate
              emails (user@example.com → user_2@example.com), (3) Soft delete duplicates
              (mark as inactive, add UNIQUE partial index for active users only).
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
              href="https://www.postgresql.org/docs/current/ddl-constraints.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostgreSQL Documentation — Constraints
            </a>
          </li>
          <li>
            <a
              href="https://dev.mysql.com/doc/refman/8.0/en/create-table.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MySQL Documentation — Constraints
            </a>
          </li>
          <li>
            <a
              href="https://docs.microsoft.com/en-us/sql/relational-databases/tables/about-constraints"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SQL Server Documentation — Constraints
            </a>
          </li>
          <li>
            <a
              href="https://docs.oracle.com/en/database/oracle/oracle-database/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Oracle Documentation — Constraints
            </a>
          </li>
          <li>
            Martin Kleppmann, <em>Designing Data-Intensive Applications</em>, O&apos;Reilly, 2017.
            Chapter 3.
          </li>
          <li>
            Alex Petrov, <em>Database Internals</em>, O&apos;Reilly, 2019. Chapter 3.
          </li>
          <li>
            <a
              href="https://use-the-index-luke.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Use The Index, Luke — Constraints and Indexes
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/c/CMUDatabaseGroup"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CMU Database Group — Constraints and Triggers (YouTube lectures)
            </a>
          </li>
          <li>
            <a
              href="https://www.brentozar.com/archive/sql-server-foreign-keys/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brent Ozar — SQL Server Foreign Keys
            </a>
          </li>
          <li>
            <a
              href="https://www.percona.com/blog/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Percona Blog — Foreign Key Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
