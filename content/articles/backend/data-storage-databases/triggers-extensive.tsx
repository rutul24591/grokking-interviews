"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-triggers-extensive",
  title: "Triggers",
  description:
    "Deep guide to database triggers, execution order, use cases, and operational trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "triggers",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "triggers"],
  relatedTopics: [
    "stored-procedures-functions",
    "transaction-isolation-levels",
    "concurrency-control",
  ],
};

export default function TriggersExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Database triggers</strong> are automatic procedures executed
          in response to data modification events. They run inside the database
          engine and can validate data, maintain derived tables, or log changes
          without requiring application code changes.
        </p>
        <p>
          Triggers exist to enforce invariants at the data layer. This is useful
          when multiple applications or services write to the same tables, or
          when correctness must be guaranteed regardless of application bugs.
        </p>
        <p>
          The downside is opacity: trigger logic is not visible in application
          code paths and can surprise developers. Careful design and clear
          documentation are essential.
        </p>
      </section>

      <section>
        <h2>Trigger Types and Timing</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/trigger-timing.svg"
          alt="Trigger timing"
          caption="BEFORE and AFTER triggers run at different points in the write flow"
        />
        <p>
          Triggers can run <strong>BEFORE</strong> or <strong>AFTER</strong> a
          row is written:
        </p>
        <ul className="space-y-2">
          <li><strong>BEFORE:</strong> Validate or modify incoming data.</li>
          <li><strong>AFTER:</strong> React to changes, update derived data or logs.</li>
        </ul>
        <p className="mt-4">
          Triggers can also be <strong>ROW-level</strong> (run once per row) or
          <strong>STATEMENT-level</strong> (run once per statement). Row-level
          triggers are more precise but more expensive on bulk operations.
        </p>
      </section>

      <section>
        <h2>Common Use Cases</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/trigger-use-cases.svg"
          alt="Trigger use cases"
          caption="Triggers are best for integrity and audit trails"
        />
        <ul className="space-y-2">
          <li><strong>Audit logging:</strong> Track changes for compliance.</li>
          <li><strong>Derived aggregates:</strong> Maintain counters or rollups.</li>
          <li><strong>Soft deletes:</strong> Convert deletes into status updates.</li>
          <li><strong>Data validation:</strong> Enforce invariants beyond constraints.</li>
        </ul>
        <p className="mt-4">
          If triggers are used, keep them deterministic and lightweight. Avoid
          network calls or long-running operations that block writes.
        </p>
      </section>

      <section>
        <h2>Execution Order and Cascades</h2>
        <p>
          Trigger execution order can be subtle. Multiple triggers on the same
          table may run in a defined order (database-specific). Cascading
          triggers can occur if a trigger writes to another table that also has
          triggers.
        </p>
        <p>
          This can create unexpected chains of execution. Guard against this by
          keeping triggers simple and avoiding trigger-to-trigger dependencies.
        </p>
      </section>

      <section>
        <h2>Example: Audit Log Trigger</h2>
        <p>
          This example records updates to an audit table when a user row changes.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`CREATE TABLE user_audit (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT now(),
  old_email TEXT,
  new_email TEXT
);

CREATE OR REPLACE FUNCTION audit_user_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_audit (user_id, old_email, new_email)
  VALUES (OLD.id, OLD.email, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_audit
AFTER UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION audit_user_changes();`}</code>
        </pre>
      </section>

      <section>
        <h2>Performance Considerations</h2>
        <p>
          Triggers execute on the write path, so they add latency and reduce
          throughput. This impact is amplified for bulk updates and high write
          workloads.
        </p>
        <p>
          Techniques to limit overhead:
        </p>
        <ul className="space-y-2">
          <li>Prefer statement-level triggers for bulk operations.</li>
          <li>Keep trigger logic minimal and set-based.</li>
          <li>Avoid complex queries inside triggers.</li>
        </ul>
      </section>

      <section>
        <h2>Alternatives to Triggers</h2>
        <p>
          Alternatives include application-level logic, background jobs, or
          event-driven pipelines (CDC, queues). These approaches are more
          visible and easier to debug but can be less consistent if multiple
          writers exist.
        </p>
        <p>
          Use triggers when correctness must be enforced at the database layer.
          Use application logic when portability and transparency matter more.
        </p>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Document triggers clearly and keep them small.</li>
          <li>Avoid side effects outside the database.</li>
          <li>Test trigger behavior with bulk updates.</li>
          <li>Monitor write latency and trigger error rates.</li>
          <li>Review triggers during schema migrations.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
