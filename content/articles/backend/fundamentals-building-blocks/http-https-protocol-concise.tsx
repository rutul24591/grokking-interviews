"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-http-https-concise",
  title: "HTTP/HTTPS Protocol",
  description:
    "Quick overview of HTTP and HTTPS fundamentals for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "http-https-protocol",
  version: "concise",
  wordCount: 1700,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "http", "https", "protocols"],
  relatedTopics: [
    "client-server-architecture",
    "request-response-lifecycle",
    "tcp-vs-udp",
    "api-design-best-practices",
  ],
};

export default function HttpHttpsProtocolConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>HTTP</strong> is the foundational request-response protocol of
          the web. Clients send requests (method, path, headers, body) and
          servers respond (status code, headers, body). <strong>HTTPS</strong>
          is HTTP over TLS, which encrypts traffic and verifies server identity.
        </p>
        <p>
          HTTP is stateless, text-based, and extensible. HTTPS adds security
          guarantees needed for authentication, payments, and any private data.
          Modern web systems treat HTTPS as the default.
        </p>
        <p>
          In practice, HTTP is not just for browsers. It powers mobile apps,
          microservices, webhooks, and third-party integrations. Understanding
          how requests are structured, how caches behave, and how TLS protects
          data is critical for building reliable backend services.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Methods:</strong> GET, POST, PUT, PATCH, DELETE define intent.
            Methods encode semantics, not just endpoints.
          </li>
          <li>
            <strong>Safety & Idempotency:</strong> GET is safe; PUT/DELETE are idempotent;
            POST usually is not.
          </li>
          <li>
            <strong>Status Codes:</strong> 2xx success, 3xx redirect, 4xx client
            error, 5xx server error.
          </li>
          <li>
            <strong>Headers:</strong> Metadata for content type, caching, auth,
            and compression.
          </li>
          <li>
            <strong>Caching:</strong> Cache-Control, ETag, If-None-Match, and 304 responses.
          </li>
          <li>
            <strong>Stateless:</strong> Each request must contain required context.
          </li>
          <li>
            <strong>HTTPS/TLS:</strong> Encrypts data in transit and authenticates
            the server via certificates.
          </li>
          <li>
            <strong>Cookies vs Tokens:</strong> Cookies often for browser sessions;
            Authorization headers for APIs.
          </li>
          <li>
            <strong>HTTP Versions:</strong> HTTP/1.1 uses persistent connections,
            HTTP/2 multiplexes streams, HTTP/3 runs over QUIC.
          </li>
        </ul>
        <p className="mt-4">
          The key idea: HTTP is a contract. Clients should rely on status codes,
          headers, and method semantics rather than hidden behavior. When APIs
          break these conventions, clients become brittle and retries become unsafe.
        </p>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Express: HTTPS-aware API response
app.get('/api/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'not_found' });
  res.set('Cache-Control', 'private, max-age=60');
  return res.json(user);
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
                ✓ Simple and widely supported<br />
                ✓ Stateless and scalable<br />
                ✓ Extensible via headers<br />
                ✓ Works across any language
              </td>
              <td className="p-3">
                ✗ Text-based overhead in HTTP/1.1<br />
                ✗ Latency if not optimized<br />
                ✗ Requires TLS setup for security
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Use HTTP/HTTPS for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Public web APIs and browser clients</li>
          <li>• Mobile app backends</li>
          <li>• B2B integrations and webhooks</li>
        </ul>

        <p><strong>Consider alternatives for:</strong></p>
        <ul className="space-y-1">
          <li>• Low latency internal calls (gRPC)</li>
          <li>• Real-time streaming (WebSockets, SSE)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            <strong>Know methods:</strong> Explain idempotency for GET, PUT,
            DELETE and why POST is not idempotent.
          </li>
          <li>
            <strong>Explain TLS:</strong> Mention handshake, certificates, and
            why HTTPS is required for auth and privacy.
          </li>
          <li>
            <strong>Talk about versions:</strong> HTTP/2 multiplexing and header
            compression reduce latency; HTTP/3 reduces handshake cost.
          </li>
          <li>
            <strong>Cache semantics:</strong> Use ETag/If-None-Match and 304 to
            avoid re-downloading payloads.
          </li>
          <li>
            <strong>Headers matter:</strong> Explain Content-Type, Authorization,
            and Vary headers as part of the API contract.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes HTTP stateless and why does it matter?</p>
            <p className="mt-2 text-sm">
              A: Each request is independent and contains all needed context.
              This simplifies scaling and load balancing, but requires explicit
              session management.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the difference between HTTP and HTTPS?</p>
            <p className="mt-2 text-sm">
              A: HTTPS is HTTP over TLS. It encrypts traffic, protects against
              eavesdropping, and authenticates the server with certificates.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What makes a request idempotent?</p>
            <p className="mt-2 text-sm">
              A: Repeating it produces the same server state. GET/PUT/DELETE are
              designed to be idempotent.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why are status codes important?</p>
            <p className="mt-2 text-sm">
              A: They provide standardized semantics so clients can handle
              success, redirects, and errors correctly without parsing payloads.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does HTTP/2 improve performance?</p>
            <p className="mt-2 text-sm">
              A: It multiplexes multiple requests over one connection and
              compresses headers, reducing latency and connection overhead.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What does an ETag enable?</p>
            <p className="mt-2 text-sm">
              A: Conditional requests; the server can return 304 Not Modified
              if the resource hasn’t changed.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
