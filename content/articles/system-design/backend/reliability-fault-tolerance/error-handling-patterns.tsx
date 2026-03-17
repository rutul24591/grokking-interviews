"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-error-handling-patterns-extensive",
  title: "Error Handling Patterns",
  description: "Strategies for managing failures, retries, and fallbacks in production systems.",
  category: "backend",
  subcategory: "reliability-fault-tolerance",
  slug: "error-handling-patterns",
  wordCount: 679,
  readingTime: 6,
  lastUpdated: "2026-03-13",
  tags: ['backend', 'reliability', 'patterns'],
  relatedTopics: ['idempotency', 'dead-letter-queues', 'at-most-once-vs-at-least-once-vs-exactly-once'],
};

export default function ErrorHandlingPatternsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Scope</h2>
        <p>Error handling patterns define how systems respond to failures in order to preserve correctness and user experience. They encompass retries, fallbacks, circuit breakers, and escalation paths.</p>
        <p>The goal is not to hide errors but to handle them in a way that prevents cascading failures and maintains predictable behavior.</p>
      </section>

      <section>
        <h2>Core Patterns</h2>
        <p>Retries with exponential backoff handle transient errors but must be bounded to avoid overload. Circuit breakers stop repeated failures from overwhelming dependencies. Bulkheads isolate failures so one dependency cannot take down the entire system.</p>
        <p>Fallbacks can return cached data, partial results, or degrade features. They should be explicit and consistent so users understand what changed.</p>
        <ArticleImage src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/error-handling-patterns-diagram-1.svg" alt="Error Handling Patterns diagram 1" caption="Error Handling Patterns overview diagram 1." />
      </section>

      <section>
        <h2>Designing for Correctness</h2>
        <p>Patterns should be selected based on error type. Retrying a validation error is pointless; retrying a network timeout might be appropriate. Idempotency is essential when retries are possible.</p>
        <p>In workflows with external side effects, use compensating actions rather than blind retries. For example, if a payment gateway times out, verify status before reissuing the charge.</p>
      </section>

      <section>
        <h2>Failure Modes</h2>
        <p>Over-retrying is a common failure. It amplifies load and can transform a small incident into a full outage. Retry storms are especially dangerous when multiple tiers retry at once.</p>
        <p>Silent fallbacks can also be harmful. If fallback hides errors, teams may not detect system degradation and users may see stale or inconsistent data.</p>
        <ArticleImage src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/error-handling-patterns-diagram-2.svg" alt="Error Handling Patterns diagram 2" caption="Error Handling Patterns overview diagram 2." />
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <p>Define retry budgets, implement circuit breakers, and instrument fallback usage. During incidents, reduce retry rates and increase caching to protect dependencies.</p>
        <p>Document error taxonomies and ensure services agree on which errors are retryable. Consistency across services reduces complex failure behavior.</p>
      </section>

      <section>
        <h2>Trade-offs</h2>
        <p>Retries improve availability but can harm latency and cost. Circuit breakers protect dependencies but can cause abrupt feature loss. Fallbacks improve resilience but risk serving stale data.</p>
        <p>The trade-off is between consistency and availability. Clear staleness policies help teams make explicit choices.</p>
        <ArticleImage src="/diagrams/system-design-concepts/backend/reliability-fault-tolerance/error-handling-patterns-diagram-3.svg" alt="Error Handling Patterns diagram 3" caption="Error Handling Patterns overview diagram 3." />
      </section>

      <section>
        <h2>Testing and Validation</h2>
        <p>Test error handling in staging by inducing failures in dependencies and verifying retries, circuit breakers, and fallbacks behave as expected.</p>
        <p>Chaos testing and fault injection help ensure your error handling doesn’t create feedback loops.</p>
      </section>

      <section>
        <h2>Scenario: Downstream API Degradation</h2>
        <p>A downstream API starts returning 500s. With naive retries, the load spikes and the API collapses. With circuit breakers, the system stops retrying and serves cached data for critical reads while returning partial responses for optional features.</p>
        <p>This scenario shows how error handling patterns prevent cascading failures.</p>
      </section>

      <section>
        <h2>Error Taxonomy</h2>
        <p>A shared error taxonomy is essential for distributed systems. If each service classifies errors differently, retries and circuit breakers will behave unpredictably across layers.</p>
        <p>Define a standard set: transient, persistent, validation, authorization, and capacity errors. Align retry and fallback policies with these classes.</p>
      </section>

      <section>
        <h2>Budgeting Retries</h2>
        <p>Retry budgets should be a first-class capacity concept. Instead of allowing every client to retry indefinitely, allocate a global retry budget based on service capacity and error budget.</p>
        <p>This turns retries from a best-effort feature into a controlled resilience mechanism.</p>
      </section>

      <section>
        <h2>Composing Patterns</h2>
        <p>Patterns interact in surprising ways. Retries plus timeouts plus circuit breakers can form feedback loops if not coordinated. Establish a consistent order: timeouts, then retries, then circuit breakers, with bulkheads as isolation.</p>
        <p>Coordination across services prevents a small failure from cascading into a multi-tier incident.</p>
      </section>

      <section>
        <h2>Timeout Strategy and Deadline Propagation</h2>
        <p>
          Timeouts are the foundation of predictable behavior under partial failure. A dependency that is slow is often
          worse than a dependency that is down, because slow calls consume threads, sockets, and queue capacity and then
          trigger retries. The practical goal is to bound the maximum work you are willing to spend on a request and to
          fail fast with a safe fallback when the budget is exceeded.
        </p>
        <p>
          In multi-hop systems, the timeout should usually <strong>decrease</strong> as the request travels downstream.
          If an edge gateway has a 2s timeout, the application service might use 1.5s, and each database or API call
          might use 200–500ms per attempt. This prevents a single dependency from consuming the entire end-to-end
          budget and leaves room for retries, fallbacks, and error handling.
        </p>
        <ul className="space-y-2">
          <li><strong>Prefer total deadlines:</strong> cap total request time, not only per-call time.</li>
          <li><strong>Use per-try timeouts:</strong> short attempts + backoff beat one long wait.</li>
          <li><strong>Avoid aligned timeouts:</strong> synchronized timeouts across tiers trigger retry spikes.</li>
          <li><strong>Propagate context:</strong> forward a request deadline so downstreams can stop work early.</li>
        </ul>
      </section>

      <section>
        <h2>Idempotency, Deduplication, and Side Effects</h2>
        <p>
          Retries are only safe if the operation is safe to repeat. For read paths, the risk is usually wasted work.
          For write paths, the risk is duplicate side effects: double charges, duplicate emails, repeated inventory
          reservations, or duplicate events.
        </p>
        <p>
          Common mitigations include <strong>idempotency keys</strong> for create operations and <strong>deduplication</strong>
          at boundaries where “at-least-once” delivery is expected (queues, webhooks, client retries). The server should
          persist the outcome keyed by the idempotency token and return the same result for repeats. To avoid abuse and
          confusion, define a retention window, and treat the key as bound to a specific request shape.
        </p>
      </section>

      <section>
        <h2>Observability and Alerting</h2>
        <p>
          Error handling patterns should be observable, or they will fail silently. Teams should be able to answer:
          “Are we succeeding because the system is healthy, or because we are falling back?” If you cannot distinguish
          those states, you will miss degradations until customers report them.
        </p>
        <ul className="space-y-2">
          <li><strong>Retries:</strong> retry rate by dependency, attempts per request, and retry budget burn.</li>
          <li><strong>Circuit breakers:</strong> open/half-open rates, trip reasons, and recovery time.</li>
          <li><strong>Fallbacks:</strong> fallback usage by endpoint, staleness age, and “partial response” rate.</li>
          <li><strong>Timeouts:</strong> timeout rate and time spent waiting vs computing.</li>
        </ul>
        <p className="mt-4">
          Alerts should focus on user impact (latency and error rates) and on early warning indicators (breaker open
          spikes, sudden retry amplification, rising timeout ratios).
        </p>
      </section>

      <section>
        <h2>Runbook: When a Dependency Is Flaky</h2>
        <ol className="space-y-2">
          <li>Confirm blast radius: which endpoints, tenants, or regions are impacted.</li>
          <li>Reduce amplification: lower retry counts, increase backoff, and enforce retry budgets.</li>
          <li>Open containment: trip circuit breakers aggressively for the failing dependency.</li>
          <li>Shift load: serve cached or partial responses for non-critical paths.</li>
          <li>Validate recovery: watch error and timeout rates fall before restoring normal behavior.</li>
          <li>Follow up: document what broke (timeouts, retries, contracts) and add guardrails.</li>
        </ol>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Classify errors, set retry budgets, implement circuit breakers, and monitor fallback usage.</p>
        <p>Align error handling policies across services to prevent inconsistent behavior.</p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When are retries harmful?</p>
            <p className="mt-2 text-sm text-muted">
              A: When they amplify load on a saturated dependency, when they retry non-idempotent operations, or when
              multiple tiers retry simultaneously. Retries should be bounded by time budgets and error budgets.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do circuit breakers differ from timeouts?</p>
            <p className="mt-2 text-sm text-muted">
              A: Timeouts bound how long a call is allowed to run; circuit breakers bound how often you attempt calls
              to a failing dependency. Timeouts protect a single request; breakers protect the system.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a retry budget and why does it matter?</p>
            <p className="mt-2 text-sm text-muted">
              A: It is a limit on total retry traffic relative to baseline capacity. It prevents retry storms from
              turning small degradations into outages by keeping amplification bounded.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle errors in workflows with side effects?</p>
            <p className="mt-2 text-sm text-muted">
              A: Use idempotency keys, verify external state before reissuing actions, and prefer compensating actions
              over blind retries when the side effect cannot be repeated safely.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
