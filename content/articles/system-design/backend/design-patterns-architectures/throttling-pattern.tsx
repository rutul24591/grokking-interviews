"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-throttling-pattern-extensive",
  title: "Throttling Pattern",
  description:
    "Control load by limiting rates and concurrency so the system stays stable under spikes, abuse, and downstream slowdowns.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "throttling-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "reliability", "performance"],
  relatedTopics: ["bulkhead-pattern", "retry-pattern", "timeout-pattern", "api-gateway-pattern", "circuit-breaker-pattern"],
};

export default function ThrottlingPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What Throttling Is (and What It Is Not)</h2>
        <p>
          <strong>Throttling</strong> limits how much work the system accepts over time or concurrently. The goal is not
          to maximize throughput, it is to keep the system <strong>stable</strong>: predictable latency, bounded queues,
          and controllable failure modes. When the system is overloaded, throttling forces fast, explicit outcomes rather
          than slow timeouts and cascading collapse.
        </p>
        <p>
          Throttling is different from caching (avoid work) and different from bulkheads (partition work). Throttling is
          about admission control: deciding which work enters the system and at what pace.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/throttling-pattern-diagram-1.svg"
          alt="Throttling at the edge: a limiter controls admission before requests reach core services"
          caption="Throttling is most effective when applied early, before expensive work has begun."
        />
      </section>

      <section>
        <h2>Two Families: Rate Limits and Concurrency Limits</h2>
        <p>
          There are two primary ways to throttle. They address different failure modes and are often used together.
        </p>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Rate limiting</h3>
            <p className="mt-2 text-sm text-muted">
              Limit requests per unit time (for example, per minute). This protects against sustained abuse and smooths
              bursts at a coarse time scale.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Concurrency limiting</h3>
            <p className="mt-2 text-sm text-muted">
              Limit in-flight work (requests, queries, jobs). This directly prevents thread pool and connection pool exhaustion.
            </p>
          </div>
        </div>
        <p>
          Concurrency limits are often the most important for system stability because they cap resource usage directly.
          Rate limits are often the most important for fairness and abuse control because they define per-identity budgets.
        </p>
      </section>

      <section>
        <h2>Design Choices: Who Gets Limited and How</h2>
        <p>
          Throttling is policy. It encodes what your system values under overload: fairness across tenants, protection of
          critical features, and predictable latency for the majority of traffic.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/throttling-pattern-diagram-2.svg"
          alt="Decision map for throttling: keying, fairness, bursts, overload behavior, and placement"
          caption="Throttling decisions define overload behavior: which identities are protected, how bursts are handled, and what clients see."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Keying:</strong> per user, per API key, per IP, per tenant, or per resource. The choice determines fairness and vulnerability to abuse.
          </li>
          <li>
            <strong>Burst allowance:</strong> allow short bursts to reduce perceived latency, but cap sustained usage to protect capacity.
          </li>
          <li>
            <strong>Overload response:</strong> reject quickly, queue briefly, or degrade. Queuing can look &quot;successful&quot; while secretly destroying tail latency.
          </li>
          <li>
            <strong>Priority classes:</strong> reserve budget for critical flows; throttle optional or expensive endpoints earlier.
          </li>
          <li>
            <strong>Placement:</strong> edge throttling prevents work from entering the system; internal throttling protects downstreams from upstream bugs.
          </li>
        </ul>
        <p className="mt-4">
          The best throttling strategies are visible to clients: clear error semantics and predictable behavior. If clients
          cannot distinguish &quot;you are over limit&quot; from &quot;the system is broken&quot;, they will retry and increase load.
        </p>
      </section>

      <section>
        <h2>Failure Modes: How Throttling Can Go Wrong</h2>
        <p>
          Poor throttling can harm reliability more than it helps. Common mistakes include limiting the wrong thing,
          applying limits too late, or returning ambiguous errors that cause retry storms.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/throttling-pattern-diagram-3.svg"
          alt="Throttling failure modes: unfair limits, mis-keying, late enforcement, and retry amplification"
          caption="Throttling failures often surface as unfairness, spiky traffic, and overload that shifts to a different layer."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Unfairness</h3>
            <p className="mt-2 text-sm text-muted">
              A small set of clients consumes most of the budget and everyone else experiences rejections.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> per-tenant budgets, weighted fairness, and priority classes for core flows.
              </li>
              <li>
                <strong>Signal:</strong> limit hits are concentrated among a few identities while global load is high.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Late throttling</h3>
            <p className="mt-2 text-sm text-muted">
              Throttling is applied after expensive work (database queries) has started, so it does not protect capacity.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> enforce at ingress and at key internal chokepoints (per dependency).
              </li>
              <li>
                <strong>Signal:</strong> database saturation rises even though throttle counters show many rejections.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Retry amplification</h3>
            <p className="mt-2 text-sm text-muted">
              Clients interpret throttling as a transient failure and retry aggressively, increasing load.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> clear error semantics, guidance on backoff, and consistent headers or metadata for limits.
              </li>
              <li>
                <strong>Signal:</strong> traffic grows after throttling activates; limit hits correlate with retry rate spikes.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Mis-keying</h3>
            <p className="mt-2 text-sm text-muted">
              Limits are keyed by IP in environments with shared NATs, or keyed by user where attackers can mint identities.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> choose keys that match your threat model and client topology, and layer multiple controls.
              </li>
              <li>
                <strong>Signal:</strong> legitimate traffic is throttled while abusive traffic slips through.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Protecting Search From Expensive Query Bursts</h2>
        <p>
          Search endpoints are often expensive and easy to abuse. A burst of complex queries can saturate CPU and
          downstream data stores, hurting unrelated endpoints. Throttling can enforce per-user and per-tenant budgets,
          cap concurrency, and shed overly expensive requests early.
        </p>
        <p>
          A robust design applies multiple layers: an edge rate limit to stop abuse, an in-service concurrency limit to
          protect CPU and database pools, and a degradation path that returns partial results when the system is under pressure.
          The goal is to preserve system health and a predictable experience for most users.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Observe limit hits:</strong> track throttle events by key (tenant, endpoint, identity) so you can distinguish abuse from organic growth.
          </li>
          <li>
            <strong>Correlate with saturation:</strong> throttling should reduce downstream saturation; if it does not, enforcement is too late or keyed incorrectly.
          </li>
          <li>
            <strong>Make client behavior predictable:</strong> document what clients should do when throttled and ensure errors are unambiguous.
          </li>
          <li>
            <strong>Tune gradually:</strong> changes to limits affect availability directly; roll out slowly and watch success rate and p95/p99.
          </li>
          <li>
            <strong>Plan emergency controls:</strong> have a fast way to tighten limits during incidents while protecting critical traffic.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Is the limit keyed in a way that matches client topology and fairness requirements?
          </li>
          <li>
            Are critical flows protected with reserved capacity or higher budgets?
          </li>
          <li>
            Is throttling applied early enough to protect expensive downstream work?
          </li>
          <li>
            Are errors unambiguous so clients do not retry as if the system is broken?
          </li>
          <li>
            Do dashboards show whether throttling is actually reducing saturation and tail latency?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why do systems throttle instead of just scaling?</p>
            <p className="mt-2 text-sm">
              Scaling takes time and money, and some bottlenecks cannot scale linearly (databases, third-party APIs).
              Throttling ensures stability and fairness under overload.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do you choose between rate limits and concurrency limits?</p>
            <p className="mt-2 text-sm">
              Rate limits control sustained usage and abuse; concurrency limits protect immediate resource saturation.
              Most production systems use both.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What is the biggest operational mistake with throttling?</p>
            <p className="mt-2 text-sm">
              Applying it too late or returning ambiguous errors, which causes retries and shifts overload rather than removing it.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
