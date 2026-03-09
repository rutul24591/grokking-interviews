"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-rest-api-design-concise",
  title: "REST API Design",
  description:
    "Quick overview of REST API design principles for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "rest-api-design",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "rest", "api", "design"],
  relatedTopics: [
    "http-https-protocol",
    "api-design-best-practices",
    "request-response-lifecycle",
  ],
};

export default function RestApiDesignConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>REST</strong> (Representational State Transfer) is an
          architectural style for APIs built around resources, standard HTTP
          methods, and stateless interactions. A REST API models data as
          resources (users, orders, products) and uses HTTP verbs to create,
          read, update, or delete them.
        </p>
        <p>
          Good REST design focuses on clear resource naming, predictable
          semantics, and consistent status codes. It enables simple clients and
          long-term evolution of services.
        </p>
        <p>
          REST is less about strict rules and more about consistency. When
          resource boundaries are clear and method semantics are respected,
          clients can integrate quickly and services can evolve without breaking
          existing consumers.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Resources:</strong> Use nouns and collections, such as
            <span className="ml-1">/users</span> or <span className="ml-1">/orders</span>.
          </li>
          <li>
            <strong>Methods:</strong> GET reads, POST creates, PUT replaces,
            PATCH updates, DELETE removes.
          </li>
          <li>
            <strong>Statelessness:</strong> Each request includes all context.
          </li>
          <li>
            <strong>Representation:</strong> JSON is common; responses represent
            resource state.
          </li>
          <li>
            <strong>Pagination:</strong> Use cursor or offset to bound collections.
          </li>
          <li>
            <strong>Filtering/Sorting:</strong> Query params like <span className="ml-1">?status=paid&amp;sort=-createdAt</span>.
          </li>
          <li>
            <strong>Idempotency:</strong> Use idempotency keys for retry-safe POSTs.
          </li>
          <li>
            <strong>Error Shape:</strong> Consistent error payloads (code, message, details).
          </li>
          <li>
            <strong>Versioning:</strong> Use URL or header versioning when needed.
          </li>
          <li>
            <strong>Content Negotiation:</strong> Use Accept/Content-Type to select formats.
          </li>
        </ul>
        <p className="mt-4">
          A good mental model: resources are nouns, actions are HTTP methods,
          and status codes describe outcomes. The more predictable the contract,
          the easier it is to scale clients and teams independently.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Express: RESTful resource handler
router.post('/orders', async (req, res) => {
  const order = await createOrder(req.body);
  res.status(201)
    .set('Location', '/orders/' + order.id)
    .json(order);
});`}</code>
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
                ✓ Simple and widely understood<br />
                ✓ Works with standard HTTP tooling<br />
                ✓ Cache friendly when designed well<br />
                ✓ Clear separation of client and server
              </td>
              <td className="p-3">
                ✗ Over/under-fetching can happen<br />
                ✗ Strict resource modeling can be limiting<br />
                ✗ Complex transactions require careful design
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use REST for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Public APIs with broad client support</li>
          <li>• CRUD-style services</li>
          <li>• Systems that benefit from HTTP caching</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• Real-time streaming (WebSockets)</li>
          <li>• Complex client queries (GraphQL)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            <strong>Talk in resources:</strong> Explain why URLs are nouns and
            actions are HTTP methods.
          </li>
          <li>
            <strong>Status codes matter:</strong> Use 201 for create, 404 for
            missing resources, 409 for conflicts.
          </li>
          <li>
            <strong>Pagination choices:</strong> Cursor for large datasets;
            offset for simple, small collections.
          </li>
          <li>
            <strong>Versioning strategy:</strong> Mention backward compatibility
            and deprecation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why model APIs around resources?</p>
            <p className="mt-2 text-sm">
              A: Resources map directly to domain entities and make the API
              predictable. Clients can reuse patterns across endpoints.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between PUT and PATCH?</p>
            <p className="mt-2 text-sm">
              A: PUT replaces a resource, PATCH partially updates it. PATCH is
              useful for sparse updates.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle versioning?</p>
            <p className="mt-2 text-sm">
              A: Use URL or header versioning and keep changes backward
              compatible when possible.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are common REST pitfalls?</p>
            <p className="mt-2 text-sm">
              A: Verb-based URLs, inconsistent status codes, and large payloads
              without pagination.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Cursor vs offset pagination?</p>
            <p className="mt-2 text-sm">
              A: Cursor is stable and efficient at scale; offset is simpler but
              can be slow and inconsistent under writes.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use idempotency keys?</p>
            <p className="mt-2 text-sm">
              A: To safely retry POST requests without creating duplicates.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
