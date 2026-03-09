"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-client-server-concise",
  title: "Client-Server Architecture",
  description:
    "Quick overview of client-server architecture for backend interviews and rapid learning.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "client-server-architecture",
  version: "concise",
  wordCount: 1750,
  readingTime: 8,
  lastUpdated: "2026-03-09",
  tags: ["backend", "architecture", "client-server", "fundamentals"],
  relatedTopics: [
    "http-https-protocol",
    "request-response-lifecycle",
    "stateless-vs-stateful-services",
    "api-design-best-practices",
  ],
};

export default function ClientServerArchitectureConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Client-Server Architecture</strong> is a distributed model where a
          client requests a service and a server fulfills it. The client focuses on
          user interaction and presentation, while the server owns business logic,
          data access, and system coordination. Communication happens over a
          network using a request-response protocol such as HTTP.
        </p>
        <p>
          This separation enables independent evolution of UI and backend systems,
          allows many clients to share the same service, and supports scaling
          servers without changing the client. It is the dominant foundation for
          web applications, mobile apps, and internal enterprise systems.
        </p>
        <p>
          In modern systems, the “server” is rarely a single machine. It is often
          a fleet of services behind load balancers, with caches, queues, and
          databases layered behind them. Understanding where the boundary sits
          helps you reason about latency, failure handling, and scalability.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Client:</strong> The consumer of a service. Examples include web
            browsers, mobile apps, CLI tools, or other servers.
          </li>
          <li>
            <strong>Server:</strong> The provider of a service. It handles requests,
            runs business logic, and reads or writes data stores.
          </li>
          <li>
            <strong>Tiers:</strong> 2-tier (client + server) vs 3-tier (client + API + data).
          </li>
          <li>
            <strong>Request-Response:</strong> Clients send requests; servers process
            and return responses. Requests include method, path, headers, and
            payload; responses include status codes, headers, and data.
          </li>
          <li>
            <strong>Load Balancer / API Gateway:</strong> Distributes traffic, handles
            routing, auth, and rate limits.
          </li>
          <li>
            <strong>Stateless vs Stateful:</strong> Stateless servers do not store
            session state between requests, enabling easy scaling. Stateful servers
            keep session data in memory, which can improve performance but makes
            scaling harder.
          </li>
          <li>
            <strong>Sessions:</strong> Cookies or tokens; session stores (e.g. Redis)
            decouple state from app servers.
          </li>
          <li>
            <strong>Protocols:</strong> HTTP and HTTPS dominate for web APIs. Other
            protocols include gRPC, WebSockets, and custom TCP protocols.
          </li>
          <li>
            <strong>Edge Caching:</strong> CDNs cache static and even API responses
            to reduce latency.
          </li>
          <li>
            <strong>Latency & Throughput:</strong> Latency is response time per
            request; throughput is requests per second. Client-server design must
            optimize both.
          </li>
        </ul>
        <p className="mt-4">
          The key idea is a clear contract between client and server. When the
          contract is predictable and stable, clients can evolve independently
          while servers scale without breaking behavior.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <ol className="space-y-2">
          <li>Client resolves DNS and opens a TCP connection (TLS for HTTPS).</li>
          <li>Client sends an HTTP request to the server endpoint.</li>
          <li>Server authenticates and validates the request.</li>
          <li>Server executes business logic and accesses databases or caches.</li>
          <li>Server returns a response with status code and payload.</li>
          <li>Client renders results or triggers next actions.</li>
        </ol>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Client -> Server request
GET /api/orders?limit=20 HTTP/1.1
Host: api.example.com
Authorization: Bearer <token>

// Server -> Client response
HTTP/1.1 200 OK
Content-Type: application/json

{ "items": [ ... ], "nextCursor": "abc123" }`}</code>
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
                ✓ Clear separation of concerns<br />
                ✓ Many clients can reuse the same server<br />
                ✓ Centralized security and data governance<br />
                ✓ Easier backend scaling than monolithic desktop apps<br />
                ✓ Independent deployment of client and server
              </td>
              <td className="p-3">
                ✗ Network latency affects every request<br />
                ✗ Requires careful API versioning<br />
                ✗ Server outages impact all clients<br />
                ✗ State management can be complex<br />
                ✗ Debugging is harder across network boundaries
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Perfect for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Web and mobile applications with shared backend data</li>
          <li>• SaaS platforms with many client types</li>
          <li>• Systems that need centralized security and governance</li>
          <li>• Services that must scale independently from UI</li>
        </ul>

        <p><strong>Avoid or rethink when:</strong></p>
        <ul className="space-y-1">
          <li>• Ultra low-latency embedded systems with no network</li>
          <li>• Offline-first apps with minimal server dependency</li>
          <li>• Single-user desktop tools with no shared data</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            <strong>Focus on statelessness:</strong> Highlight why stateless servers
            scale horizontally and simplify load balancing.
          </li>
          <li>
            <strong>Define boundaries:</strong> Explain which responsibilities belong
            on the client (presentation, input) versus the server (business logic,
            persistence, security enforcement).
          </li>
          <li>
            <strong>Call out tiers:</strong> Describe 3-tier apps and where the
            database sits.
          </li>
          <li>
            <strong>Discuss trade-offs:</strong> Mention latency, failure modes, and
            API evolution challenges.
          </li>
          <li>
            <strong>Edge & gateways:</strong> Mention load balancers, API gateways,
            and CDNs in production systems.
          </li>
          <li>
            <strong>Show protocol awareness:</strong> Compare HTTP, gRPC, and
            WebSockets and when each fits.
          </li>
          <li>
            <strong>Use a real system:</strong> Example: a mobile app (client) calling
            a REST API (server) backed by a database and cache.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is statelessness valuable in client-server systems?</p>
            <p className="mt-2 text-sm">
              A: Stateless servers can serve any request without relying on
              in-memory session state. That makes horizontal scaling and load
              balancing easy, improves resilience, and simplifies recovery after
              failures.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle client-server version mismatches?</p>
            <p className="mt-2 text-sm">
              A: Use API versioning, backward compatible changes, and feature
              flags. Avoid breaking response shapes and deprecate endpoints
              gradually.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are common bottlenecks in client-server architecture?</p>
            <p className="mt-2 text-sm">
              A: Network latency, database contention, synchronous dependencies,
              and large payloads. Mitigations include caching, pagination, async
              processing, and load balancing.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why use a load balancer or API gateway?</p>
            <p className="mt-2 text-sm">
              A: It spreads traffic across instances, centralizes auth and rate
              limits, and improves resilience during failures.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
