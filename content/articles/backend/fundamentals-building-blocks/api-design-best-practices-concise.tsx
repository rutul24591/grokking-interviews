"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-api-design-best-practices-concise",
  title: "API Design Best Practices",
  description:
    "Quick checklist of API design best practices for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "api-design-best-practices",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "api", "design", "best-practices"],
  relatedTopics: [
    "rest-api-design",
    "http-https-protocol",
    "request-response-lifecycle",
  ],
};

export default function ApiDesignBestPracticesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          API design best practices focus on consistency, predictability, and
          safety. Great APIs are easy to adopt, hard to misuse, and resilient to
          change.
        </p>
        <p>
          The most common practices involve resource naming, pagination,
          filtering, error handling, and versioning. These choices reduce client
          complexity and keep systems stable at scale.
        </p>
        <p>
          Think of an API as a long-lived contract. Once clients integrate, even
          small breaking changes cause outages. Best practices reduce those risks
          and make your API safer to evolve.
        </p>
      </section>

      <section>
        <h2>Key Practices</h2>
        <ul className="space-y-2">
          <li>
            <strong>Consistent Naming:</strong> Use plural nouns and stable URL
            structures.
          </li>
          <li>
            <strong>Pagination:</strong> Always bound collection responses.
          </li>
          <li>
            <strong>Filtering and Sorting:</strong> Query parameters should be
            predictable and documented.
          </li>
          <li>
            <strong>Idempotency Keys:</strong> Make POST retries safe for payments
            and order creation.
          </li>
          <li>
            <strong>Errors:</strong> Return clear error codes and consistent
            payloads.
          </li>
          <li>
            <strong>Versioning:</strong> Use backward compatible changes and plan
            deprecations.
          </li>
          <li>
            <strong>Rate Limiting:</strong> Protect services and enforce fair use.
          </li>
          <li>
            <strong>Request IDs:</strong> Correlate logs and traces across services.
          </li>
          <li>
            <strong>Contracts:</strong> Use OpenAPI/Swagger to document and test.
          </li>
        </ul>
        <p className="mt-4">
          The theme is predictability. When every endpoint behaves the same way,
          client teams can integrate once and reuse patterns everywhere.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Standardized error + request id
HTTP/1.1 429 Too Many Requests
X-Request-Id: 9c2a
Retry-After: 30

{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests",
    "requestId": "9c2a"
  }
}`}</code>
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
                ✓ Easier client adoption<br />
                ✓ Fewer production incidents<br />
                ✓ Stronger backward compatibility<br />
                ✓ Better long-term maintainability
              </td>
              <td className="p-3">
                ✗ Requires upfront design effort<br />
                ✗ Some constraints reduce flexibility
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            Emphasize predictable pagination and consistent errors.
          </li>
          <li>
            Explain backward compatible changes and versioning strategy.
          </li>
          <li>
            Mention observability and request id headers for debugging.
          </li>
          <li>
            Call out rate limit headers (429 + Retry-After).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is pagination required for collection endpoints?</p>
            <p className="mt-2 text-sm">
              A: It prevents large payloads, reduces latency, and protects the
              server from heavy queries.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design error responses?</p>
            <p className="mt-2 text-sm">
              A: Use consistent shapes with machine-readable codes and human
              messages so clients can handle failures reliably.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a safe API versioning strategy?</p>
            <p className="mt-2 text-sm">
              A: Prefer backward compatible changes, use versioned URLs or
              headers, and deprecate old versions gradually.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent over-fetching?</p>
            <p className="mt-2 text-sm">
              A: Use field selection, tailored endpoints, or pagination with
              filtering. Avoid returning large embedded objects by default.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What’s a safe retry pattern for POST?</p>
            <p className="mt-2 text-sm">
              A: Use idempotency keys so the server can dedupe duplicate requests.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
