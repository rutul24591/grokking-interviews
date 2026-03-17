"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-service-discovery-extensive",
  title: "Service Discovery",
  description:
    "Let services find each other dynamically as instances scale and churn, while keeping lookup fast, fresh, and safe under partial failures.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "service-discovery",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "infra", "discovery"],
  relatedTopics: ["service-registry", "container-orchestration", "load-balancer-configuration"],
};

export default function ServiceDiscoveryArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What Service Discovery Is</h2>
        <p>
          <strong>Service discovery</strong> is how systems locate service instances at runtime without hard-coding
          addresses. In dynamic environments, instances are constantly created, replaced, rescheduled, and scaled. If
          clients require fixed endpoints, every change becomes a deployment coordination problem.
        </p>
        <p>
          Discovery provides a stable name or identity for a service and a mechanism to resolve that identity to a set of
          healthy endpoints. It is foundational in microservice architectures, but it is equally useful within a single
          platform where components scale and move frequently.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/service-discovery-diagram-1.svg"
          alt="Service discovery overview: service identity resolves to healthy instances via DNS or registry"
          caption="Discovery converts churn into a lookup problem: clients ask for a service identity and receive current healthy endpoints."
        />
      </section>

      <section>
        <h2>Two Axes: Client-Side vs Server-Side, DNS vs Registry</h2>
        <p>
          Discovery systems vary along two major axes. First: does the client pick an endpoint (client-side discovery),
          or does an intermediary route for the client (server-side discovery)? Second: is discovery done via DNS (simple,
          widely supported) or via an explicit registry (richer metadata and control)?
        </p>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Client-side discovery</h3>
            <p className="mt-2 text-sm text-muted">
              Clients resolve endpoints and choose where to send requests. This enables sophisticated routing but pushes complexity into clients.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Server-side discovery</h3>
            <p className="mt-2 text-sm text-muted">
              A load balancer, gateway, or mesh sidecar routes to healthy instances. Clients stay simpler but you add an extra hop and dependency.
            </p>
          </div>
        </div>
        <p>
          DNS-based discovery is simple and universally supported, but it is caching-driven and often limited in metadata.
          Registry-based discovery can be more precise and can include health and zone data, but it introduces an explicit
          control-plane dependency that must be highly available.
        </p>
      </section>

      <section>
        <h2>Freshness vs Stability: TTL and Caching Are Not Side Details</h2>
        <p>
          Discovery is a balance between freshness and stability. Freshness means clients stop using dead endpoints
          quickly. Stability means clients do not thrash between endpoints or overwhelm the discovery system with lookups.
          TTL and caching policies are how you control that balance.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/service-discovery-diagram-2.svg"
          alt="Service discovery control points: TTLs, caching, health checks, zone awareness, and fallback behavior"
          caption="Discovery trade-offs center on freshness: how quickly endpoints change and how clients behave when resolution or health signals are stale."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Short TTL:</strong> fresher endpoints, more resolver load, and higher sensitivity to discovery-system outages.
          </li>
          <li>
            <strong>Long TTL:</strong> fewer lookups and more stability, but dead endpoints can persist longer and increase failure rates.
          </li>
          <li>
            <strong>Client caching:</strong> reduces lookup latency but can create stale routing if clients do not refresh appropriately.
          </li>
          <li>
            <strong>Zone awareness:</strong> prefer local zone endpoints to reduce cross-zone latency and avoid concentrating failures.
          </li>
        </ul>
        <p className="mt-4">
          Freshness also depends on health semantics. Is health determined by heartbeats, by active probing, or by error
          rates observed by clients? Different approaches produce different failure behaviors during partial outages.
        </p>
      </section>

      <section>
        <h2>Failure Behavior: What Happens When Discovery Is Wrong</h2>
        <p>
          Discovery is not perfect. Endpoints can be stale, registries can be down, and health signals can be noisy. A
          good system defines the failure behavior explicitly: how long to use cached endpoints, how to retry resolution,
          and how to avoid turning discovery failure into a total outage.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Discovery problems show up as connection errors and timeouts across many services. The challenge is that
          symptoms look like application bugs. Good observability and disciplined TTL policies make diagnosis faster.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/service-discovery-diagram-3.svg"
          alt="Service discovery failure modes: stale endpoints, registry outage, cache staleness, and uneven routing"
          caption="Discovery failures are often staleness failures. Make TTL, caching, and fallback behavior explicit and measurable."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Stale endpoints</h3>
            <p className="mt-2 text-sm text-muted">
              Clients keep calling dead instances due to caching or slow deregistration, causing elevated error rates.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> shorter TTLs where churn is high, faster health expiry, and client-side retry with endpoint rotation.
              </li>
              <li>
                <strong>Signal:</strong> connection failures cluster on specific endpoints that should have been removed.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Discovery control-plane outage</h3>
            <p className="mt-2 text-sm text-muted">
              Resolution fails and new instances cannot be discovered, breaking deploys and causing traffic to concentrate on old endpoints.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> cached fallbacks, highly available registry design, and limiting dependency on per-request lookups.
              </li>
              <li>
                <strong>Signal:</strong> increased resolution latency or errors correlated with discovery requests.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Cache thrash</h3>
            <p className="mt-2 text-sm text-muted">
              Clients refresh too frequently, overloading DNS or registry, and turning lookup systems into bottlenecks.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> reasonable TTLs, client-side caching with jittered refresh, and batching lookups.
              </li>
              <li>
                <strong>Signal:</strong> discovery QPS spikes without corresponding traffic increases.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Uneven routing and hotspots</h3>
            <p className="mt-2 text-sm text-muted">
              A subset of endpoints receives most traffic due to biased selection or stale caches, causing localized overload.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> balanced selection algorithms, zone-aware routing, and per-endpoint load monitoring.
              </li>
              <li>
                <strong>Signal:</strong> a small number of instances show high saturation while others are idle.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Migrating From Static Endpoints to Dynamic Discovery</h2>
        <p>
          A system starts with static endpoints in configuration files. As services scale and instances churn, incidents
          become common because config is always stale. Introducing discovery shifts the model: services register and
          deregister automatically, clients resolve names to current endpoints, and rollouts no longer require manual
          coordination of address lists.
        </p>
        <p>
          The migration succeeds when TTL, caching, and fallback behavior are explicit and observable. Without that,
          discovery becomes a new source of outages rather than a stability improvement.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Choose a discovery model intentionally:</strong> client-side vs server-side and DNS vs registry should match your complexity tolerance and needs.
          </li>
          <li>
            <strong>Make freshness measurable:</strong> track how long dead endpoints remain discoverable and how quickly new endpoints become reachable.
          </li>
          <li>
            <strong>Protect the control plane:</strong> ensure DNS or registry systems are highly available and not overwhelmed by per-request lookups.
          </li>
          <li>
            <strong>Define fallback:</strong> decide what clients do when resolution fails and ensure behavior is safe and bounded.
          </li>
          <li>
            <strong>Monitor distribution:</strong> watch per-endpoint load to detect hotspots caused by selection bias or staleness.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Are TTL and caching values aligned to churn and recovery requirements?
          </li>
          <li>
            Is discovery failure behavior explicit (cached fallback, bounded retries, safe defaults)?
          </li>
          <li>
            Is endpoint health defined and updated quickly enough to prevent stale routing?
          </li>
          <li>
            Are discovery systems themselves monitored and protected from overload?
          </li>
          <li>
            Can you detect and correct uneven routing and hotspots caused by selection or staleness?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Client-side vs server-side discovery: how do you choose?</p>
            <p className="mt-2 text-sm">
              Client-side gives more routing control but increases client complexity. Server-side centralizes routing and can simplify clients, but adds an extra hop and a routing dependency.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why can DNS-based discovery be tricky?</p>
            <p className="mt-2 text-sm">
              DNS is caching-driven, so endpoint lists can be stale. That staleness must be acceptable or mitigated with TTL tuning and client behavior.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What does &quot;freshness&quot; mean for discovery?</p>
            <p className="mt-2 text-sm">
              How quickly new healthy endpoints become discoverable and how quickly dead endpoints stop receiving traffic. It is an operational metric, not just a configuration detail.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

