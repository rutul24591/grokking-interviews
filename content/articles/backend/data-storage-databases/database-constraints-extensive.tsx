"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-constraints-extensive",
  title: "Database Constraints",
  description:
    "Deep guide to database constraints, integrity guarantees, and schema-level validation.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "database-constraints",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "constraints"],
  relatedTopics: [
    "relational-database-design",
    "transaction-isolation-levels",
    "concurrency-control",
  ],
};

export default function DatabaseConstraintsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Database constraints</strong> are rules enforced by the
          database engine to guarantee data integrity. They prevent invalid
          states regardless of application behavior, making them critical in
          multi-service environments where different clients may write data.
        </p>
        <p>
          Constraints are part of the schema and are checked during writes.
          They can eliminate entire classes of bugs by ensuring invalid data
          never lands in storage.
        </p>
        <p>
          The trade-off is performance and flexibility. Constraints add work
          to writes and sometimes complicate migrations.
        </p>
      </section>

      <section>
        <h2>Constraint Types</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/constraints-overview.svg"
          alt="Constraint types"
          caption="Primary, foreign, unique, not null, and check constraints"
        />
        <ul className="space-y-2">
          <li><strong>PRIMARY KEY:</strong> Uniqueness plus indexing.</li>
          <li><strong>FOREIGN KEY:</strong> Enforces relationships across tables.</li>
          <li><strong>UNIQUE:</strong> Prevents duplicate values.</li>
          <li><strong>NOT NULL:</strong> Requires values for critical fields.</li>
          <li><strong>CHECK:</strong> Validates custom expressions.</li>
        </ul>
        <p className="mt-4">
          Constraint choice should reflect domain rules: foreign keys encode
          relationships, while check constraints encode domain limits.
        </p>
      </section>

      <section>
        <h2>Foreign Keys in Practice</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/foreign-key-integrity.svg"
          alt="Foreign key integrity"
          caption="Foreign keys prevent orphaned rows"
        />
        <p>
          Foreign keys ensure referential integrity. If an order references a
          user, the user must exist. This prevents orphaned rows and inconsistent
          joins.
        </p>
        <p>
          On deletes, you can define actions: <strong>CASCADE</strong> to delete
          dependent rows, <strong>RESTRICT</strong> to block, or
          <strong>SET NULL</strong> to preserve the row but break the relation.
        </p>
        <p>
          FK checks require indexes on both sides. Without proper indexing, FK
          validation can be slow and lock-prone.
        </p>
      </section>

      <section>
        <h2>Check Constraints and Domain Rules</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/check-constraints.svg"
          alt="Check constraints"
          caption="Check constraints enforce valid ranges and enums"
        />
        <p>
          Check constraints validate business rules such as positive balances,
          allowed status values, or date ranges. They are lightweight and
          expressive when the rule can be expressed in SQL.
        </p>
        <p>
          For example, you can prevent invalid states like negative inventory
          or invalid enum transitions. If rules get too complex, move them to
          application logic or triggers.
        </p>
      </section>

      <section>
        <h2>Deferrable Constraints</h2>
        <p>
          Deferrable constraints are checked at transaction commit instead of
          after each statement. This enables multi-step operations that are
          temporarily inconsistent.
        </p>
        <p>
          This is useful for bulk updates or cross-table migrations where the
          intermediate state would otherwise violate constraints.
        </p>
      </section>

      <section>
        <h2>Example: Constraints in Schema</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  amount_cents INT NOT NULL CHECK (amount_cents > 0),
  status TEXT NOT NULL CHECK (status IN ('pending','captured','failed'))
);`}</code>
        </pre>
        <p>
          This schema enforces valid status values, positive amounts, and
          existence of users.
        </p>
      </section>

      <section>
        <h2>Performance and Operational Trade-offs</h2>
        <p>
          Constraints run on every write, so they add latency. This is usually
          acceptable for correctness-critical systems but can be a bottleneck
          in high-throughput ingestion pipelines.
        </p>
        <p>
          In some systems, constraints are selectively disabled during bulk
          loads and re-enabled after validation. This should be done carefully
          to avoid corrupt data.
        </p>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Use constraints to enforce invariants shared across services.</li>
          <li>Index foreign key columns to avoid validation bottlenecks.</li>
          <li>Keep check constraints simple and deterministic.</li>
          <li>Use deferrable constraints for complex migrations.</li>
          <li>Monitor write latency and adjust constraints if needed.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
