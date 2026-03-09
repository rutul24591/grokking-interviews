"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-relational-database-design-extensive",
  title: "Relational Database Design",
  description:
    "Comprehensive guide to relational database design, normalization, constraints, and schema trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "relational-database-design",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "design", "modeling"],
  relatedTopics: [
    "acid-properties",
    "database-indexes",
    "transaction-isolation-levels",
  ],
};

export default function RelationalDatabaseDesignExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Relational database design</strong> is the process of modeling
          data in tables with defined relationships, keys, and constraints. The
          goal is correctness first: data integrity, predictable queries, and
          clear semantics that match the business domain.
        </p>
        <p>
          A well‑designed schema makes it easy to enforce rules (e.g., every
          order must belong to a user) and to answer common questions efficiently.
          Bad design leads to duplication, inconsistent data, and queries that
          get slower as the system grows.
        </p>
      </section>

      <section>
        <h2>Core Modeling Concepts</h2>
        <ul className="space-y-2">
          <li><strong>Entities:</strong> Stable business objects (users, orders).</li>
          <li><strong>Relationships:</strong> One‑to‑many, many‑to‑many, one‑to‑one.</li>
          <li><strong>Keys:</strong> Primary keys identify rows; foreign keys link tables.</li>
          <li><strong>Constraints:</strong> NOT NULL, UNIQUE, CHECK, FK enforce rules.</li>
          <li><strong>Normalization:</strong> Reduce redundancy and anomalies.</li>
        </ul>
        <p className="mt-4">
          Design starts by naming entities and relationships, then translating
          them into tables with stable keys. When relationships are clear, the
          schema becomes easier to evolve.
        </p>
      </section>

      <section>
        <h2>Schema Example</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/relational-schema.svg"
          alt="Relational schema example"
          caption="Users, orders, and order_items in a 1:N relationship"
        />
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Users and Orders
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);`}</code>
        </pre>
      </section>

      <section>
        <h2>Normalization Levels</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/normalization-levels.svg"
          alt="Normalization levels"
          caption="1NF → 2NF → 3NF → BCNF progression"
        />
        <p>
          Normalization prevents update, insert, and delete anomalies. The most
          common target is 3NF: attributes depend on the key, the whole key, and
          nothing but the key. BCNF is stricter and can be applied when needed.
        </p>
        <p>
          Over‑normalization can make queries expensive due to joins. The best
          approach is to normalize first for correctness, then denormalize
          selectively based on actual query patterns.
        </p>
      </section>

      <section>
        <h2>Denormalization Trade-offs</h2>
        <p>
          Denormalization duplicates data to speed reads. This is often used in
          reporting tables, search indexes, or read-heavy APIs. The cost is write
          complexity: you must keep duplicated values in sync.
        </p>
        <p>
          A safe approach is to denormalize only when there is a measurable
          performance bottleneck. Use background jobs to update denormalized
          tables and treat them as derived data.
        </p>
      </section>

      <section>
        <h2>Indexing and Query Performance</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/index-btree.svg"
          alt="B-tree index"
          caption="B-tree indexes speed lookups at the cost of write overhead"
        />
        <p>
          Indexes are essential for performance. They speed reads but slow down
          writes and consume storage. Index only what you query by, and always
          verify usage with query plans.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Index on user_id for order lookups
CREATE INDEX idx_orders_user_id ON orders(user_id);`}</code>
        </pre>
      </section>

      <section>
        <h2>Constraints and Data Integrity</h2>
        <p>
          Constraints encode business rules at the database layer, preventing
          invalid states regardless of application bugs. Use NOT NULL for required
          fields, UNIQUE for identifiers, CHECK for valid ranges, and FOREIGN KEY
          to prevent orphan records.
        </p>
        <p>
          Constraints protect data quality but can impact write throughput. The
          trade-off is usually worth it for core transactional systems.
        </p>
      </section>

      <section>
        <h2>Many-to-Many Modeling</h2>
        <p>
          Many-to-many relationships require junction tables. This keeps the
          schema normalized and makes relationships explicit.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`CREATE TABLE user_roles (
  user_id INT REFERENCES users(id),
  role_id INT REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);`}</code>
        </pre>
      </section>

      <section>
        <h2>Surrogate vs Natural Keys</h2>
        <p>
          Surrogate keys (auto-increment IDs, UUIDs) are stable and simple.
          Natural keys (like email) can change and make migrations risky.
          Most systems use surrogate keys for stability.
        </p>
        <p>
          If natural keys are needed for business logic, store them as unique
          attributes rather than primary keys.
        </p>
      </section>

      <section>
        <h2>Schema Evolution and Migrations</h2>
        <p>
          Schemas evolve as products change. Migrations should be backward
          compatible and safe for online systems. Add columns with defaults,
          avoid long-running locks, and backfill data asynchronously.
        </p>
        <p>
          Avoid “big bang” migrations on large tables. Use phased rollouts and
          dual writes when necessary.
        </p>
      </section>

      <section>
        <h2>Transactions and Consistency</h2>
        <p>
          Relational databases provide ACID transactions. This makes them ideal
          for workflows that require correctness, such as payments and inventory.
          Transactions ensure atomic updates across multiple tables.
        </p>
        <p>
          The trade-off is throughput. Long-running transactions increase lock
          contention and reduce concurrency, so keep transactions small and fast.
        </p>
      </section>

      <section>
        <h2>Query Patterns and Access Paths</h2>
        <p>
          Design schemas based on access patterns. If an API frequently needs
          orders by user, ensure a foreign key and index exist. If reporting
          requires aggregation, consider materialized views or summary tables.
        </p>
        <p>
          A schema optimized for one pattern can be disastrous for another.
          Always validate design against real queries.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Normalize first, then denormalize if needed.</li>
          <li>Define stable primary keys and foreign keys.</li>
          <li>Index based on actual query patterns.</li>
          <li>Use constraints to enforce integrity.</li>
          <li>Plan schema migrations for zero downtime.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
