"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-triggers-concise",
  title: "Triggers",
  description:
    "Concise guide to database triggers, when to use them, and common trade-offs for interviews.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "triggers",
  version: "concise",
  wordCount: 1850,
  readingTime: 9,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "triggers"],
  relatedTopics: [
    "stored-procedures-functions",
    "transaction-isolation-levels",
    "concurrency-control",
  ],
};

export default function TriggersConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Triggers</strong> are database hooks that run automatically
          in response to table events such as INSERT, UPDATE, or DELETE. They
          can enforce invariants, maintain derived data, and log changes without
          requiring application code changes.
        </p>
        <p>
          Triggers are powerful but can hide logic, add latency, and complicate
          debugging. Use them for data integrity and cross-cutting concerns,
          not for complex business workflows.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li><strong>BEFORE vs AFTER:</strong> Run before validation or after write.</li>
          <li><strong>Row vs Statement:</strong> Run per-row or per-statement.</li>
          <li><strong>Event types:</strong> INSERT, UPDATE, DELETE, TRUNCATE.</li>
          <li><strong>Derived data:</strong> Maintain counters, summaries, audit logs.</li>
          <li><strong>Idempotency:</strong> Triggers should be safe on retries.</li>
          <li><strong>Side effects:</strong> Keep external calls out of triggers.</li>
        </ul>
        <p className="mt-4">
          Good triggers are small, deterministic, and focused on data integrity.
          If logic depends on external services, move it to the application.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`-- Postgres: update updated_at automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();`}</code>
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
                ✓ Enforce invariants at the DB level<br />
                ✓ Reduce duplicated app logic<br />
                ✓ Automatic auditing and derived updates<br />
                ✓ Consistent behavior across apps
              </td>
              <td className="p-3">
                ✗ Hidden logic is harder to debug<br />
                ✗ Adds latency to writes<br />
                ✗ Can create unexpected side effects<br />
                ✗ Harder to test and version
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use triggers when:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• You need guaranteed integrity across multiple apps</li>
          <li>• You want audit logging or change history</li>
          <li>• You need to keep derived counters consistent</li>
        </ul>
        <p><strong>Be cautious when:</strong></p>
        <ul className="space-y-1">
          <li>• Logic is complex or depends on external services</li>
          <li>• You need high write throughput with low latency</li>
          <li>• Team lacks DB-specific expertise</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>Explain BEFORE vs AFTER and row vs statement triggers.</li>
          <li>Emphasize triggers for integrity and auditing, not business logic.</li>
          <li>Mention testing challenges and hidden side effects.</li>
          <li>Point out alternatives like application logic or event pipelines.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you avoid triggers?</p>
            <p className="mt-2 text-sm">
              A: When logic is complex, relies on external services, or when
              high write throughput makes trigger overhead too costly.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between BEFORE and AFTER triggers?</p>
            <p className="mt-2 text-sm">
              A: BEFORE triggers can modify the row before it is written; AFTER
              triggers run after the write succeeds.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do triggers affect performance?</p>
            <p className="mt-2 text-sm">
              A: They add work to write operations, which can increase latency
              and reduce throughput, especially on large updates.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are safer alternatives?</p>
            <p className="mt-2 text-sm">
              A: Application-level logic, background jobs, or event-driven
              processing depending on the use case.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
