"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-retry-pattern-extensive",
  title: "Retry Pattern",
  description:
    "Recover from transient failures with controlled retries, without turning failure into a traffic amplifier or a correctness bug.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "retry-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "resilience", "reliability"],
  relatedTopics: [
    "timeout-pattern",
    "circuit-breaker-pattern",
    "throttling-pattern",
    "bulkhead-pattern",
    "service-mesh-pattern",
  ],
};

export default function RetryPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What the Retry Pattern Is (and Why It&apos;s Dangerous)</h2>
        <p>
          The <strong>Retry pattern</strong> re-attempts an operation when it fails, based on the assumption that the
          failure is transient (temporary network loss, brief overload, short-lived dependency restart). Used well,
          retries reduce error rates and improve perceived reliability. Used poorly, retries amplify load and can turn a
          small incident into a system-wide outage.
        </p>
        <p>
          Retries are a trade: you spend more work and time to increase the probability of success. The two key questions
          are: <strong>what is safe to retry</strong>, and <strong>how much retry budget can the system afford</strong>
          before it destabilizes.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/retry-pattern-diagram-1.svg"
          alt="Retry pattern around a dependency call with backoff and jitter, bounded by a deadline"
          caption="Retries increase success probability but must be bounded by time budgets and capacity constraints."
        />
      </section>

      <section>
        <h2>Retryability Is About Semantics, Not Errors</h2>
        <p>
          Not all failures should be retried. Some failures are permanent (invalid input, permission denied). Some are
          ambiguous (timeout after the dependency might have processed the request). Before you talk about backoff
          strategies, you need a policy grounded in semantics and correctness.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">A Practical Retry Classification</h3>
          <ul className="space-y-2">
            <li>
              <strong>Safe and likely transient:</strong> connection failures, DNS hiccups, temporary unavailability, and
              some overload responses.
            </li>
            <li>
              <strong>Likely permanent:</strong> validation errors, authorization failures, and &quot;not found&quot; in
              workflows where absence is a stable fact.
            </li>
            <li>
              <strong>Ambiguous outcomes:</strong> timeouts or disconnects after the request may have been processed.
              Retrying can cause duplicates unless you have idempotency and reconciliation.
            </li>
          </ul>
        </div>
        <p>
          The retry policy should be aligned with the operation type. Read operations are often safe to retry. Write
          operations require stronger controls: idempotency keys, version checks, or a state machine that can handle duplicates.
        </p>
      </section>

      <section>
        <h2>How Retries Should Be Shaped</h2>
        <p>
          The purpose of backoff is to reduce synchronized pressure on a struggling dependency. The purpose of jitter is
          to prevent many clients from retrying at the same intervals (which creates retry waves). The purpose of a
          global deadline is to avoid retrying beyond what the user experience can tolerate.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/retry-pattern-diagram-2.svg"
          alt="Decision map for retries: backoff, jitter, max attempts, deadlines, and retry budgets across services"
          caption="Good retry design is a system policy: how attempts, delays, and deadlines interact across a multi-hop request path."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>Bounded attempts:</strong> cap the number of retries and the total time spent retrying.
          </li>
          <li>
            <strong>Exponential backoff:</strong> increase delay between attempts to give the dependency room to recover.
          </li>
          <li>
            <strong>Jitter:</strong> randomize delay so retries are de-correlated across callers.
          </li>
          <li>
            <strong>Retry budget:</strong> limit retries as a fraction of normal traffic so the system cannot create an unbounded amplifier.
          </li>
          <li>
            <strong>Respect deadlines:</strong> do not retry when there is no meaningful time left to succeed.
          </li>
        </ul>
        <p className="mt-4">
          Retries must be considered end-to-end. If every hop retries independently, the total number of attempts can
          explode. The most stable systems define retry ownership: either a single layer retries, or retries are coordinated
          by a shared policy (client libraries, service mesh, or gateway configuration).
        </p>
      </section>

      <section>
        <h2>Interaction With Timeouts, Breakers, and Throttling</h2>
        <p>
          Retry logic is inseparable from the rest of your resilience controls:
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Timeouts:</strong> without timeouts, retries can hang and accumulate. With overly long timeouts, retries
            become slow amplifiers. Timeouts must be shorter than the overall request deadline.
          </li>
          <li>
            <strong>Circuit breakers:</strong> retries should stop when a breaker opens. Retrying into an open breaker is wasted work.
          </li>
          <li>
            <strong>Throttling and bulkheads:</strong> when the system is saturated, retries should be reduced to preserve capacity for first attempts and critical traffic.
          </li>
        </ul>
        <p className="mt-4">
          A robust policy treats retries as a <em>last-mile recovery</em> technique, not as the default response to every error.
        </p>
      </section>

      <section>
        <h2>Failure Modes You Need to Expect</h2>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/design-patterns-architectures/retry-pattern-diagram-3.svg"
          alt="Retry failure modes: retry storms, duplicate writes, correlated waves, and amplified queueing"
          caption="Retry failures are often systemic: they show up as load spikes, duplicate effects, and tail-latency collapse during incidents."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Retry storms</h3>
            <p className="mt-2 text-sm text-muted">
              During partial outages, many callers retry at once and overwhelm the dependency and the network.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> jitter, retry budgets, and immediate stop when breakers open.
              </li>
              <li>
                <strong>Signal:</strong> outbound request rate spikes while success rate drops and latency climbs.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Duplicate effects</h3>
            <p className="mt-2 text-sm text-muted">
              Write operations are retried after timeouts and execute twice, creating duplicate charges, double reservations, or inconsistent state.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> idempotency keys, version checks, and reconciliation for ambiguous outcomes.
              </li>
              <li>
                <strong>Signal:</strong> spike in compensations, reversals, or mismatch reports.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Correlated retry waves</h3>
            <p className="mt-2 text-sm text-muted">
              Fixed backoff intervals cause synchronized retries across many clients, producing periodic load spikes.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> full jitter strategies and randomized initial delays under overload.
              </li>
              <li>
                <strong>Signal:</strong> periodic spikes in dependency QPS at consistent intervals.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Hidden latency inflation</h3>
            <p className="mt-2 text-sm text-muted">
              Retries improve success rate but silently degrade user experience because requests spend too long retrying.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> per-attempt time budgets and an overall deadline enforced close to the client.
              </li>
              <li>
                <strong>Signal:</strong> higher p95/p99 even when error rate drops, with increased time spent in retries.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: Inventory Checks Under Intermittent Network Loss</h2>
        <p>
          A checkout service calls an inventory service. Under normal operation, calls succeed quickly. During a network
          incident, a subset of calls fail transiently. Retries can meaningfully improve success rate, but only if the
          system does not overwhelm inventory with repeated attempts.
        </p>
        <p>
          A stable design would apply short per-attempt timeouts, a small retry count with jitter, and a strict overall
          deadline tied to the user interaction. It would also treat inventory writes differently than reads, using
          idempotency or state checks to avoid duplicate reservations when outcomes are ambiguous.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Measure retry rate:</strong> track retries as a percentage of total calls and alert when it exceeds a safe budget.
          </li>
          <li>
            <strong>Break down by cause:</strong> distinguish timeouts, connection errors, and dependency 5xx so you are not retrying permanent failures.
          </li>
          <li>
            <strong>Protect downstream capacity:</strong> coordinate retries with breakers and throttling so retries cannot saturate the system.
          </li>
          <li>
            <strong>Watch tail latency:</strong> retries can reduce errors while worsening p99; treat that as a product and reliability regression.
          </li>
          <li>
            <strong>Test ambiguous outcomes:</strong> ensure the system behaves correctly when an operation might have succeeded despite a timeout.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Is the operation safe to retry, or do you need idempotency and reconciliation?
          </li>
          <li>
            Are retries bounded by a strict deadline and a limited number of attempts?
          </li>
          <li>
            Is jitter used to prevent correlated retry waves?
          </li>
          <li>
            Do circuit breakers and throttling prevent retries from becoming an amplifier during outages?
          </li>
          <li>
            Are retry rates and time spent retrying visible in metrics and traces?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why do retries cause outages?</p>
            <p className="mt-2 text-sm">
              Because they multiply traffic exactly when dependencies are weakest. If many services retry concurrently,
              the system becomes a load amplifier and collapses.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do you decide what to retry?</p>
            <p className="mt-2 text-sm">
              Start from semantics: retry transient transport failures, avoid retrying permanent errors, and treat timeouts as ambiguous outcomes that require idempotency controls.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What is a retry budget?</p>
            <p className="mt-2 text-sm">
              A limit on retry traffic relative to normal traffic so retries cannot exceed a safe fraction of system capacity during incidents.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
