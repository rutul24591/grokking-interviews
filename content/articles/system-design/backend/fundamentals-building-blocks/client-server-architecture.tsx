"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-client-server-extensive",
  title: "Client-Server Architecture",
  description:
    "A practical guide to client-server architecture: boundaries, state, scaling, failure modes, and operational trade-offs.",
  category: "backend",
  subcategory: "fundamentals-building-blocks",
  slug: "client-server-architecture",
  wordCount: 2000,
  readingTime: 10,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "client-server", "networking", "scalability"],
  relatedTopics: [
    "http-https-protocol",
    "request-response-lifecycle",
    "stateless-vs-stateful-services",
    "tcp-vs-udp",
  ],
};

export default function ClientServerArchitectureConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Client-server architecture</strong> is a distributed model where a client initiates
          a request and a server provides a response. The client typically owns user interaction and
          presentation, while the server owns business logic, data access, coordination across
          dependencies, and policy enforcement.
        </p>
        <p>
          The client-server split is fundamentally about <strong>boundaries</strong>: what is trusted
          vs untrusted, where state lives, which failures are tolerated, and what contract clients can
          rely on. These choices show up later as scaling decisions, deployment constraints, and
          incident playbooks.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Roles:</strong> clients initiate; servers respond. A component can play both roles
            (an API server is a client to a database).
          </li>
          <li>
            <strong>Contracts:</strong> the API boundary defines request/response shapes, status codes,
            and error semantics.
          </li>
          <li>
            <strong>State placement:</strong> choosing where session and workflow state lives is a
            scaling decision.
          </li>
          <li>
            <strong>Failure domains:</strong> networks fail partially; design assumes timeouts, drops,
            and retries.
          </li>
          <li>
            <strong>Coordination:</strong> servers often orchestrate multiple downstream calls, which
            creates fan-out, tail latency, and partial failure handling.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture Variants</h2>
        <p>
          The basic model expands into tiers as systems grow. The key is not the number of tiers, but
          whether each boundary is explicit and operationally owned.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Two-tier:</strong> a client talks directly to a server that owns logic and data.
          </li>
          <li>
            <strong>Three-tier:</strong> presentation (client), application tier (API), and data tier
            (database).
          </li>
          <li>
            <strong>Gateway + services:</strong> an edge/API gateway applies cross-cutting policies;
            services own domain logic.
          </li>
          <li>
            <strong>BFF (Backend-for-Frontend):</strong> tailored server layer per client type to
            reduce chatty clients and handle aggregation.
          </li>
        </ul>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/three-tier-application.svg"
          alt="Three tier architecture diagram showing presentation, application, and data tiers"
          caption="Three-tier architecture is common: client, API, and data tier."
        />
      </section>

      <section>
        <h2>Request Lifecycle (Where Latency and Failure Hide)</h2>
        <p>
          A “simple” client request is a pipeline with multiple stages. Understanding the pipeline
          helps you debug tail latency and reliability issues.
        </p>
        <ol className="space-y-2">
          <li>Client resolves DNS and opens a connection (TCP/TLS).</li>
          <li>Client sends a request with auth context and headers.</li>
          <li>Server authenticates, authorizes, and validates input.</li>
          <li>Server runs business logic and calls downstream dependencies.</li>
          <li>Server returns a response; client updates UI or triggers the next step.</li>
        </ol>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/ajax-request-response.svg"
          alt="Request response flow between client, server, and database"
          caption="A request path spans client, server, and downstream systems."
        />
        <div className="mt-4 rounded-lg border border-theme bg-panel-soft p-4 text-sm text-muted">
          Example code moved to the Example tab.
        </div>
      </section>

      <section>
        <h2>Stateless vs Stateful Servers</h2>
        <p>
          <strong>Stateless servers</strong> do not keep per-user session state in memory. Each request
          carries the necessary context (tokens, IDs), and durable state is stored in shared systems
          (databases, caches). Statelessness enables horizontal scaling, fast instance replacement,
          and simpler load balancing.
        </p>
        <p>
          <strong>Stateful servers</strong> keep some session or workflow state in memory. This can be
          faster for specific workloads, but it creates operational coupling: sticky sessions, harder
          deployments, and failure recovery that depends on replication or session migration. Stateful
          designs also complicate multi-region routing and autoscaling.
        </p>
      </section>

      <section>
        <h2>Scaling Patterns</h2>
        <p>
          Scaling is not only “add more servers.” It is about protecting downstreams, reducing fan-out
          cost, and keeping p99 latency stable under bursty load.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Load balancing:</strong> distribute traffic across instances; keep health checks and
            timeouts consistent across layers.
          </li>
          <li>
            <strong>Caching:</strong> use client, CDN, and server-side caches to reduce origin load and
            smooth bursts.
          </li>
          <li>
            <strong>Aggregation:</strong> use a gateway or BFF to reduce chatty clients and avoid
            client-side N+1 calls.
          </li>
          <li>
            <strong>Backpressure:</strong> shed non-critical work and cap concurrency to protect the
            database and critical dependencies.
          </li>
        </ul>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/fundamentals-building-blocks/http-pipelining.svg"
          alt="HTTP pipelining diagram showing multiple requests in flight"
          caption="Reducing round trips and fan-out helps tail latency."
        />
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Client-server systems fail partially. The most expensive failures are not crashes; they are
          slowdowns that propagate until the whole system becomes saturated.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Timeout mismatch:</strong> one layer times out earlier, triggering retries and
            amplifying load. Align timeouts and budgets.
          </li>
          <li>
            <strong>Retry storms:</strong> transient issues cause coordinated retries. Use backoff with
            jitter and retry budgets.
          </li>
          <li>
            <strong>Dependency fan-out:</strong> a single request calls many services, multiplying tail
            latency and partial failures. Add aggregation and caching.
          </li>
          <li>
            <strong>Brownouts:</strong> under overload, serve degraded responses or cached data rather
            than failing entirely.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Boundaries</h2>
        <p>
          Client traffic is untrusted by default. Servers must authenticate and authorize every
          request at the boundary. Modern systems increasingly apply zero-trust principles internally
          too: service-to-service calls carry identity and policies are enforced consistently, not
          “because it’s inside the VPC.”
        </p>
        <p>
          Practical controls include strong auth tokens, scoped permissions, rate limits, input
          validation, and audit logs. If an edge layer applies authentication, services should still
          validate trust signals and avoid implicit assumptions about caller identity.
        </p>
      </section>

      <section>
        <h2>Latency Budgeting and Fan-Out</h2>
        <p>
          End-to-end performance is dominated by tail latency. A request that is “usually fast” but
          occasionally slow still feels slow. Budget time across stages (DNS/TLS, server compute,
          downstream calls) and cap worst-case behavior with deadlines and fallbacks.
        </p>
        <p>
          Fan-out is a common cause of p99 regressions. If a request depends on five downstream calls,
          the slowest dependency determines user experience. Techniques like request hedging, bulk
          fetches, and precomputation can reduce fan-out and stabilize latency.
        </p>
      </section>

      <section>
        <h2>Observability and SLOs</h2>
        <p>
          A client-server design is only as good as your ability to debug it. Instrument request IDs
          end-to-end, propagate tracing headers, and segment metrics by endpoint and status code.
          Track client-perceived latency when possible, not only server-side timings.
        </p>
        <p>
          SLOs (for example, p95 latency and error rate) turn architecture into operational reality.
          When you violate an SLO, your response should be clear: reduce load, shed non-critical work,
          protect the data tier, and validate recovery.
        </p>
      </section>

      <section>
        <h2>Deployment and Compatibility</h2>
        <p>
          Client-server boundaries make backward compatibility a continuous requirement. Servers must
          accept requests from older clients and respond with shapes they can parse. Prefer additive
          changes, feature flags, and staged rollouts. For mobile clients, version lag is expected and
          support windows must be longer than for web clients.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>Embedding business logic in the client and duplicating it across platforms.</li>
          <li>Letting APIs drift without a contract, tests, or deprecation policy.</li>
          <li>Building chatty clients that perform many round trips per screen.</li>
          <li>Ignoring tail latency and designing only for average throughput.</li>
          <li>Assuming the internal network is trusted and skipping authorization checks.</li>
        </ul>
      </section>

      <section>
        <h2>Operational Checklist</h2>
        <ul className="space-y-2">
          <li>Define stable API contracts and a deprecation process.</li>
          <li>Align timeouts and retries across client, edge, and services.</li>
          <li>Design for partial failure: fallbacks, caching, and safe degraded modes.</li>
          <li>Instrument request IDs, traces, and SLO dashboards.</li>
          <li>Keep state placement explicit (stateless when possible, shared stores when needed).</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do teams prefer stateless services?</p>
            <p className="mt-2 text-sm">
              A: Stateless services scale and recover more easily. You can add/remove instances freely,
              route traffic without stickiness, and replace failed instances without losing session
              state.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What causes tail latency in client-server systems?</p>
            <p className="mt-2 text-sm">
              A: Fan-out to multiple dependencies, retries, contention in shared systems, and partial
              failures that increase queueing. Budget time across layers and cap worst-case behavior.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent retry storms?</p>
            <p className="mt-2 text-sm">
              A: Backoff with jitter, retry budgets, circuit breakers, and aligning timeouts so one
              layer doesn’t trigger retries while another layer is still working.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Client-server architecture is about explicit boundaries: contracts, state placement, failure
          handling, and operational ownership. Strong designs assume partial failure, protect
          downstream systems, and make scaling and deployment safe through statelessness, observability,
          and compatibility discipline.
        </p>
      </section>
    </ArticleLayout>
  );
}

