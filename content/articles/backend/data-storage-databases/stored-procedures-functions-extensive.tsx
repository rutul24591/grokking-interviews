"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-stored-procedures-functions-extensive",
  title: "Stored Procedures & Functions",
  description:
    "Deep guide to stored procedures and functions, performance impact, and operational trade-offs.",
  category: "backend",
  subcategory: "data-storage-databases",
  slug: "stored-procedures-functions",
  version: "extensive",
  wordCount: 11000,
  readingTime: 55,
  lastUpdated: "2026-03-09",
  tags: ["backend", "databases", "sql", "stored-procedures"],
  relatedTopics: [
    "sql-queries-optimization",
    "transaction-isolation-levels",
    "concurrency-control",
  ],
};

export default function StoredProceduresFunctionsExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Stored procedures and functions</strong> are programs that run
          inside the database engine. They encapsulate logic close to the data,
          reducing round trips and enabling set-based operations that databases
          execute efficiently.
        </p>
        <p>
          Procedures typically perform side effects (INSERT/UPDATE/DELETE,
          transaction management), while functions return values and can be
          embedded in SQL queries. Both are useful, but they introduce tighter
          coupling between application behavior and database implementation.
        </p>
        <p>
          The core question is: does the performance and data integrity benefit
          outweigh the operational complexity and reduced portability?
        </p>
      </section>

      <section>
        <h2>Where Stored Logic Fits</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/stored-proc-flow.svg"
          alt="Stored procedure execution flow"
          caption="Logic executed inside the database reduces round trips"
        />
        <p>
          Stored logic is most valuable when:
        </p>
        <ul className="space-y-2">
          <li><strong>Data-heavy operations:</strong> large aggregations, batch updates.</li>
          <li><strong>Consistency enforcement:</strong> invariants must always hold.</li>
          <li><strong>Complex writes:</strong> multiple table updates in one atomic step.</li>
        </ul>
        <p className="mt-4">
          If the logic requires external services, complex branching, or frequent
          changes, it is often better to keep it in application code.
        </p>
      </section>

      <section>
        <h2>Procedures vs Functions</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/proc-vs-app-logic.svg"
          alt="Procedure vs application logic"
          caption="Trade-offs between DB-side logic and application logic"
        />
        <p>
          <strong>Procedures</strong> are called explicitly and can manage
          transactions, writes, and control flow. They are great for workflows
          that must be atomic inside the database.
        </p>
        <p>
          <strong>Functions</strong> return values and can be used in SELECT
          statements. They are best for reusable calculations or formatting
          that can be applied across queries.
        </p>
        <p>
          Some databases blur the distinction, but the principle remains: use
          procedures for side effects and functions for composable results.
        </p>
      </section>

      <section>
        <h2>Performance Characteristics</h2>
        <ArticleImage
          src="/diagrams/backend/data-storage-databases/function-usage.svg"
          alt="Function usage in SQL"
          caption="Functions can be composed directly into queries"
        />
        <p>
          Stored logic can improve performance by:
        </p>
        <ul className="space-y-2">
          <li>Reducing network latency from chatty application calls.</li>
          <li>Operating on sets rather than row-by-row loops.</li>
          <li>Allowing the optimizer to plan and cache execution paths.</li>
        </ul>
        <p className="mt-4">
          However, stored procedures can hide expensive queries. Without careful
          instrumentation, teams may not realize a procedure is slow until it
          becomes a bottleneck.
        </p>
      </section>

      <section>
        <h2>Security and Governance</h2>
        <p>
          Stored procedures enable fine-grained access control. You can grant
          EXECUTE privileges without exposing underlying tables, allowing users
          to run safe operations without full data access.
        </p>
        <p>
          This is especially valuable in multi-tenant systems or when exposing
          database operations to analytics users. It centralizes rules in the
          database, reducing the chance of application-side bypasses.
        </p>
      </section>

      <section>
        <h2>Example: Procedure for Atomic Transfer</h2>
        <p>
          This example uses a Postgres procedure to move balance between
          accounts in a single transaction.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`CREATE OR REPLACE PROCEDURE transfer_funds(
  from_id BIGINT,
  to_id BIGINT,
  amount NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE accounts SET balance = balance - amount WHERE id = from_id;
  UPDATE accounts SET balance = balance + amount WHERE id = to_id;
END;
$$;`}</code>
        </pre>
        <p>
          The procedure encapsulates the updates in one place, preventing
          application bugs from skipping one side of the transfer.
        </p>
      </section>

      <section>
        <h2>Example: Function for Read Queries</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`CREATE OR REPLACE FUNCTION lifetime_value(user_id BIGINT)
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(total_cents), 0) / 100.0
  FROM orders
  WHERE orders.user_id = $1;
$$ LANGUAGE SQL;`}</code>
        </pre>
        <p>
          Functions like this can be reused across reporting queries without
          duplicating logic in multiple application endpoints.
        </p>
      </section>

      <section>
        <h2>Operational Trade-offs</h2>
        <p>
          Stored logic adds operational considerations:
        </p>
        <ul className="space-y-2">
          <li><strong>Versioning:</strong> Deployment and rollback can be harder.</li>
          <li><strong>Testing:</strong> Requires database-centric testing frameworks.</li>
          <li><strong>Debugging:</strong> Stack traces and logs are less visible.</li>
          <li><strong>Portability:</strong> Many stored languages are DB-specific.</li>
        </ul>
        <p className="mt-4">
          For teams that iterate quickly, these costs can outweigh the benefits.
          For stable, critical workflows, stored logic can be a major advantage.
        </p>
      </section>

      <section>
        <h2>Design Checklist</h2>
        <ul className="space-y-2">
          <li>Use stored logic for data-heavy, set-based operations.</li>
          <li>Keep procedures small and focused on one responsibility.</li>
          <li>Track performance with query plans and execution metrics.</li>
          <li>Document and version procedures like application code.</li>
          <li>Prefer application logic when portability or fast iteration matters.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
