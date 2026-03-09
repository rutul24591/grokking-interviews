"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-database-constraints-concise",
  title: "Database Constraints",
  description:
    "Concise guide to database constraints, integrity guarantees, and trade-offs for interviews.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "database-constraints",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "constraints"],
  relatedTopics: [
    "relational-database-design",
    "transaction-isolation-levels",
    "concurrency-control",
  ],
};

export default function DatabaseConstraintsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Database constraints</strong> are rules enforced by the
          database to ensure data integrity. They prevent invalid states,
          guarantee relationships, and encode business rules directly in the
          schema so all applications follow the same rules.
        </p>
        <p>
          Constraints are most valuable when multiple services or clients write
          to the same tables. They provide safety even if application logic is
          buggy or inconsistent.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>PRIMARY KEY:</strong> Uniquely identifies each row.</li>
          <li><strong>FOREIGN KEY:</strong> Enforces relationships between tables.</li>
          <li><strong>UNIQUE:</strong> Prevents duplicate values in a column.</li>
          <li><strong>NOT NULL:</strong> Requires a value to be present.</li>
          <li><strong>CHECK:</strong> Validates data ranges or patterns.</li>
          <li><strong>DEFERRABLE:</strong> Check at transaction end, not per statement.</li>
        </ul>
        <p className="mt-4">
          Constraints are a guardrail. They prevent bad writes but can add
          overhead, especially on high-throughput systems.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  total_cents INT NOT NULL CHECK (total_cents >= 0),
  status TEXT NOT NULL CHECK (status IN ('pending','paid','shipped'))
);`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Strong data integrity guarantees<br />
                ✓ Consistent rules across services<br />
                ✓ Prevents orphaned data<br />
                ✓ Catches bugs early
              </td>
              <td className="p-3">
                ✗ Write overhead for constraint checks<br />
                ✗ Harder migrations when constraints change<br />
                ✗ Overly strict rules can block valid cases<br />
                ✗ Some constraints can hurt bulk load speed
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use constraints when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Data correctness is critical (finance, inventory)</li>
          <li>• Multiple services share a database</li>
          <li>• You want to enforce invariants at the schema level</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• Ingest pipelines need extremely high throughput</li>
          <li>• You need temporary relaxation during migrations</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain how foreign keys prevent orphan records.</li>
          <li>Discuss CHECK constraints for domain validation.</li>
          <li>Highlight deferrable constraints for multi-step transactions.</li>
          <li>Note performance trade-offs in high write systems.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use constraints instead of app validation?</p>
            <p className="mt-2 text-sm">
              A: Constraints enforce integrity for all writers, even if an
              application has bugs or bypasses validation.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a deferrable foreign key?</p>
            <p className="mt-2 text-sm">
              A: A constraint checked at transaction commit, allowing temporary
              inconsistencies during multi-step updates.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When might you avoid foreign keys?</p>
            <p className="mt-2 text-sm">
              A: In extremely high write systems where FK checks hurt latency,
              or when data is sharded across databases.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do constraints affect performance?</p>
            <p className="mt-2 text-sm">
              A: They add validation work on writes, which can reduce throughput
              but improve correctness.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
