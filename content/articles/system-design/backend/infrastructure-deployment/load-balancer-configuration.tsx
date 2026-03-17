"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-load-balancer-configuration-extensive",
  title: "Load Balancer Configuration",
  description:
    "Configure load balancers to distribute traffic safely: health checks, timeouts, TLS, retries, and draining determine availability under real-world failure.",
  category: "backend",
  subcategory: "infrastructure-deployment",
  slug: "load-balancer-configuration",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "infra", "load-balancer"],
  relatedTopics: ["auto-scaling", "service-discovery", "networking"],
};

export default function LoadBalancerConfigurationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Why Load Balancers Deserve Design Attention</h2>
        <p>
          A <strong>load balancer</strong> is not just a traffic fan-out device. It is a policy engine that decides who
          receives traffic, when to stop sending traffic, and how clients experience failures. Load balancer settings
          shape tail latency, error modes, and the blast radius of backend incidents.
        </p>
        <p>
          Many production outages involve a load balancer indirectly: health checks that eject healthy instances,
          timeouts that cut off legitimate requests, or retry behavior that amplifies downstream overload. A good
          configuration makes failure predictable and easier to diagnose.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/load-balancer-configuration-diagram-1.svg"
          alt="Load balancer between clients and backends integrating with autoscaling and service discovery"
          caption="Load balancers are where traffic meets policy: health, timeouts, and routing rules define real availability."
        />
      </section>

      <section>
        <h2>L4 vs L7: Different Tools, Different Failure Surfaces</h2>
        <p>
          Layer 4 load balancing operates on TCP or UDP connections. Layer 7 load balancing understands application
          protocols such as HTTP and can route based on paths, headers, or hostnames. L7 load balancers can also enforce
          request limits, perform authentication hooks, and terminate TLS.
        </p>
        <p>
          L7 gives more control but also creates more knobs. More knobs can improve safety when tuned well, or create
          fragile systems when configured inconsistently. A good rule is to keep L7 logic as simple as possible at the edge
          and avoid turning the load balancer into the place where product behavior is implemented.
        </p>
      </section>

      <section>
        <h2>Health Checks: The Most Dangerous Feature When Misused</h2>
        <p>
          Health checks determine which backends receive traffic. The hardest part is designing health checks that
          reflect the ability to serve <em>real</em> requests. A check that is too shallow will route traffic to broken
          instances. A check that is too deep can eject healthy instances during transient dependency slowdowns.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/load-balancer-configuration-diagram-2.svg"
          alt="Load balancer control points: health checks, timeouts, retry behavior, draining, and TLS termination"
          caption="Health checks, timeouts, and draining interact. Tuning must reflect real latency distributions and rollout behavior."
        />
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Practical Health Check Guidance</h3>
          <ul className="space-y-2">
            <li>
              <strong>Separate readiness from liveness:</strong> readiness answers &quot;can I serve traffic now&quot;; liveness answers &quot;should this instance be restarted&quot;.
            </li>
            <li>
              <strong>Detect dependency outages intentionally:</strong> if you want to shed traffic when a dependency is down, make that choice explicit and coordinate with fallbacks.
            </li>
            <li>
              <strong>Prevent flapping:</strong> use thresholds and intervals that tolerate short blips, or you will oscillate between in and out of rotation.
            </li>
            <li>
              <strong>Validate at steady state:</strong> measure health behavior under load; checks that work in low traffic can fail at peak.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Timeouts, Retries, and Draining: Where Cascades Are Born</h2>
        <p>
          Load balancer timeouts define how long clients can wait and how long the balancer will keep backend connections
          alive. Retry behavior defines whether the load balancer will re-attempt requests when a backend fails. Draining
          defines how traffic leaves an instance during scale-down or rollouts.
        </p>
        <p>
          These settings interact. A load balancer that retries aggressively can amplify a backend incident. A load
          balancer that drains too slowly can stall rollouts. A timeout that is shorter than backend processing time can
          cut off legitimate requests and create retries and duplicate work.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Align timeouts with latency distributions:</strong> set based on p95 and p99, not on average.
          </li>
          <li>
            <strong>Be careful with retries on non-idempotent operations:</strong> a retry can create duplicates unless the system is designed for it.
          </li>
          <li>
            <strong>Drain with a budget:</strong> allow in-flight requests to finish, but do not hold onto unhealthy capacity indefinitely.
          </li>
        </ul>
      </section>

      <section>
        <h2>TLS Termination and Identity Context</h2>
        <p>
          Load balancers often terminate TLS, which simplifies backend services and centralizes certificate management.
          But termination also means the load balancer becomes part of your security boundary. You need to ensure identity
          context is forwarded safely, that downstream services trust only validated headers, and that certificate
          rotation is operationally reliable.
        </p>
        <p>
          In high-security environments, you may combine edge termination with mTLS internally. The key is consistency:
          the more varied the path (some services terminated, some passthrough), the harder it is to reason about trust
          and debugging.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Load balancer failures often present as widespread 5xx errors or timeouts. But the root cause is frequently a
          configuration mismatch between load balancer assumptions and backend reality.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/infrastructure-deployment/load-balancer-configuration-diagram-3.svg"
          alt="Load balancer failure modes: health check ejection, timeout mismatch, retry amplification, and uneven distribution"
          caption="Load balancer misconfiguration can amplify incidents. Treat LB settings as production code: review, test, and monitor."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Ejecting healthy capacity</h3>
            <p className="mt-2 text-sm text-muted">
              Health checks are too strict and mark healthy instances as unhealthy during transient slowdowns.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> tune thresholds and distinguish readiness conditions from deeper dependency checks.
              </li>
              <li>
                <strong>Signal:</strong> the LB removes many instances simultaneously and error rates spike even though instances are mostly fine.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Timeout mismatch</h3>
            <p className="mt-2 text-sm text-muted">
              The LB times out before the backend completes legitimate work, causing client retries and duplicate load.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> align LB timeouts with backend behavior and enforce consistent per-endpoint budgets.
              </li>
              <li>
                <strong>Signal:</strong> client timeouts increase while backend logs show successful completion after the client has given up.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Retry amplification</h3>
            <p className="mt-2 text-sm text-muted">
              The LB retries on failures and turns a partial backend incident into a full overload incident.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> restrict retries, respect idempotency, and coordinate with circuit breakers and rate limits.
              </li>
              <li>
                <strong>Signal:</strong> request volume climbs during backend errors even when user traffic is stable.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Uneven distribution</h3>
            <p className="mt-2 text-sm text-muted">
              Traffic concentrates on a subset of backends due to stickiness, hashing, or mis-detected health, causing localized hotspots.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> choose algorithms intentionally and monitor per-backend load distribution.
              </li>
              <li>
                <strong>Signal:</strong> a small number of instances show high CPU and high p99 while others are underutilized.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Safe Scale-Down During Peak Traffic</h2>
        <p>
          An autoscaler wants to scale down after a short traffic dip. If the load balancer drains too slowly or health
          checks are brittle, scaling can cause a spike in retries and errors. The safe approach coordinates scale-down
          with draining budgets, ensures new and old instances remain healthy during transition, and keeps timeouts and
          retries tuned so transient disruptions do not multiply load.
        </p>
        <p>
          The lesson is that load balancing is part of system stability. Scaling, rollouts, and dependency behavior all
          pass through the load balancer, so its configuration must match your operational goals.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Test health checks:</strong> validate health behavior under load and during dependency degradation.
          </li>
          <li>
            <strong>Tune timeouts deliberately:</strong> align to latency distributions and ensure budgets are consistent end-to-end.
          </li>
          <li>
            <strong>Control retries:</strong> avoid LB-level retries that amplify failures, especially for non-idempotent operations.
          </li>
          <li>
            <strong>Monitor distribution:</strong> track per-backend load, health flaps, and draining times.
          </li>
          <li>
            <strong>Version changes:</strong> treat LB config like production code with review, staged rollout, and rollback.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Do health checks reflect real ability to serve traffic without being overly strict?
          </li>
          <li>
            Are timeouts aligned with backend behavior and end-to-end budgets?
          </li>
          <li>
            Are retries controlled so they do not amplify downstream incidents?
          </li>
          <li>
            Is draining configured so scale-down and rollouts do not drop in-flight work unexpectedly?
          </li>
          <li>
            Do dashboards show per-backend health and load distribution to catch hotspots early?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What makes health checks tricky?</p>
            <p className="mt-2 text-sm">
              If they are too shallow they miss failures; if they are too strict they eject healthy capacity during transient slowdowns and can cause outages.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do load balancer retries cause incidents?</p>
            <p className="mt-2 text-sm">
              Retries multiply traffic during failures. If the backend is already struggling, retries turn a partial failure into a load amplifier.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">When do you want sticky sessions?</p>
            <p className="mt-2 text-sm">
              When session state or cache locality requires it, but it should be used intentionally because it can create uneven load and complicate failover.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

