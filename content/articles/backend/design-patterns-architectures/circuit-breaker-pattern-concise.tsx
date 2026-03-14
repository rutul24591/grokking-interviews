"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-circuit-breaker-pattern-extensive",
  title: "Circuit Breaker Pattern",
  description:
    "Stop spending capacity on a dependency that is failing: fail fast, recover safely, and prevent cascading outages.",
  category: "backend",
  subcategory: "design-patterns-architectures",
  slug: "circuit-breaker-pattern",
  wordCount: 0,
  readingTime: 0,
  lastUpdated: "2026-03-14",
  tags: ["backend", "architecture", "resilience", "reliability"],
  relatedTopics: [
    "timeout-pattern",
    "retry-pattern",
    "bulkhead-pattern",
    "throttling-pattern",
    "service-mesh-pattern",
  ],
};

export default function CircuitBreakerPatternArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What a Circuit Breaker Does</h2>
        <p>
          A <strong>circuit breaker</strong> is a guard placed around a dependency call (database, external API, internal
          service). It monitors failures and latency, and if the dependency appears unhealthy it <strong>opens</strong>{" "}
          the circuit: calls fail immediately (or return a degraded response) instead of waiting for slow timeouts. After
          a cool-down period, it probes recovery in a controlled way.
        </p>
        <p>
          The core motivation is not &quot;handle failures&quot; in the abstract. It is to protect your system&apos;s
          limited resources. Slow dependencies can consume threads, connections, and queues until healthy requests also
          fail. Circuit breakers prevent that kind of cascading failure by making dependency health an explicit decision
          point.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/circuit-breaker-pattern-diagram-1.svg"
          alt="Circuit breaker around a dependency call with states: closed, open, and half-open"
          caption="Circuit breakers turn slow failure into fast failure and give the system space to recover."
        />
      </section>

      <section>
        <h2>The Behavior Model: Closed, Open, Half-Open</h2>
        <p>
          Circuit breakers usually implement three states. You do not need the exact terminology, but you do need the
          behavior: normal operation, fail-fast operation, and controlled recovery.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Typical State Semantics</h3>
          <ul className="space-y-2">
            <li>
              <strong>Closed:</strong> calls flow normally while the breaker records outcomes (success, failure, timeout).
            </li>
            <li>
              <strong>Open:</strong> calls are rejected immediately (or served via fallback) for a cool-down period.
            </li>
            <li>
              <strong>Half-open:</strong> a small number of probe calls are allowed; success closes the breaker, failures
              re-open it.
            </li>
          </ul>
        </div>
        <p>
          Half-open behavior is where many systems get into trouble. If probes are too aggressive, recovery probes can
          overload the dependency. If probes are too conservative, you remain in degraded mode longer than necessary.
          The correct answer depends on dependency capacity and the importance of the feature.
        </p>
      </section>

      <section>
        <h2>Configuration That Matters (and Why)</h2>
        <p>
          Circuit breaker configuration is not primarily a number-picking exercise. It is a <strong>policy</strong> about
          how quickly you stop calling a dependency, and under what evidence you declare it unhealthy. The wrong policy
          can either hide real outages (too tolerant) or create self-inflicted outages (too sensitive).
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/circuit-breaker-pattern-diagram-2.svg"
          alt="Decision map for circuit breaker configuration: failure threshold, latency threshold, windows, and fallbacks"
          caption="Good breakers are policy-driven: thresholds align with downstream capacity, time budgets, and user experience."
        />
        <ul className="mt-6 space-y-2">
          <li>
            <strong>What counts as failure:</strong> timeouts, connection errors, and certain 5xx. Treating all 5xx as
            equal is often wrong; some indicate caller bugs or invalid inputs.
          </li>
          <li>
            <strong>Time window:</strong> rolling windows smooth noise; short windows react faster but can flap.
          </li>
          <li>
            <strong>Volume sensitivity:</strong> require a minimum number of samples before tripping to avoid false
            positives on low traffic.
          </li>
          <li>
            <strong>Latency awareness:</strong> a dependency that returns &quot;success&quot; in 10 seconds may still be
            effectively down for your product. Include slow responses in the health signal.
          </li>
          <li>
            <strong>Scope:</strong> per-host breakers can avoid taking down all traffic due to one bad instance; per-endpoint
            breakers avoid one slow API poisoning everything.
          </li>
        </ul>
        <p className="mt-4">
          The most common operational mistake is combining aggressive retries with long timeouts and no breaker. The
          system keeps trying harder as the dependency fails, and the result is a traffic amplifier.
        </p>
      </section>

      <section>
        <h2>Fallbacks: Degrade With Intent</h2>
        <p>
          A circuit breaker without a fallback is still valuable because it protects resources via fast failure. But
          well-designed systems pair breakers with <strong>degraded behavior</strong>. Fallbacks should be intentional:
          return cached data, show a simpler response, queue work for later, or disable non-critical features.
        </p>
        <p>
          Fallbacks can create their own failures. For example, serving cached data may increase cache pressure and create
          a new bottleneck. Queueing for later can explode backlog. Degradation paths need the same level of design as the
          happy path.
        </p>
      </section>

      <section>
        <h2>Failure Modes to Watch For</h2>
        <p>
          Circuit breakers reduce cascading failures, but they also introduce new system behaviors. These behaviors are
          manageable when they are visible and testable.
        </p>
        <ArticleImage
          src="/diagrams/backend/design-patterns-architectures/circuit-breaker-pattern-diagram-3.svg"
          alt="Circuit breaker failure modes: flapping, sticky open, probe overload, and fallback overload"
          caption="Breakers can fail through misconfiguration: too sensitive flaps, too tolerant collapses, and fallbacks can overload other systems."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Flapping</h3>
            <p className="mt-2 text-sm text-muted">
              The breaker rapidly opens and closes due to noisy signals, causing unstable client behavior.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> longer rolling windows, minimum sample counts, and a half-open probe limit.
              </li>
              <li>
                <strong>Signal:</strong> breaker state transitions spike; success rates oscillate.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Sticky open</h3>
            <p className="mt-2 text-sm text-muted">
              The breaker remains open after recovery due to conservative probes or persistent false negatives.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> controlled probes, dependency health checks, and manual override procedures.
              </li>
              <li>
                <strong>Signal:</strong> downstream health looks normal but traffic remains in degraded mode.
              </li>
            </ul>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Probe overload</h3>
            <p className="mt-2 text-sm text-muted">
              Recovery probes arrive as a mini-stampede and immediately push the dependency back into failure.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> cap probe concurrency, stagger probes, and route probes to dedicated canary capacity.
              </li>
              <li>
                <strong>Signal:</strong> dependency recovers briefly, then fails again as traffic returns.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Fallback amplification</h3>
            <p className="mt-2 text-sm text-muted">
              The fallback path overloads a different system (cache, queue, database) while the breaker is open.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> bulkhead fallbacks and define load-shedding rules even for degraded paths.
              </li>
              <li>
                <strong>Signal:</strong> incidents shift to the fallback dependency during outages.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: A Payment Provider Starts Timing Out</h2>
        <p>
          In a checkout flow, the payment provider becomes slow. Without a breaker, checkout requests wait for timeouts,
          and retries may multiply traffic. Thread pools saturate, and even unrelated endpoints begin failing because the
          process is out of capacity.
        </p>
        <p>
          With a breaker, once the failure rate and latency cross a threshold, the system stops attempting payment calls
          for a short period and returns a fast, user-friendly degraded response. While in degraded mode, the system can
          protect core functionality (cart, inventory checks) and avoid turning an external outage into an internal outage.
        </p>
      </section>

      <section>
        <h2>Operational Playbook</h2>
        <ul className="space-y-2">
          <li>
            <strong>Track breaker state:</strong> expose open/close transitions and open duration as first-class metrics.
          </li>
          <li>
            <strong>Correlate with dependency health:</strong> overlay dependency latency and error rate with breaker behavior.
          </li>
          <li>
            <strong>Document fallback behavior:</strong> ensure on-call can explain what users see when the breaker opens.
          </li>
          <li>
            <strong>Make policy changes safe:</strong> roll out threshold changes gradually and alert on flapping.
          </li>
          <li>
            <strong>Test the degraded path:</strong> practice failures in staging and confirm the fallback does not overload another dependency.
          </li>
        </ul>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Are timeouts and retry budgets configured before the breaker, so the breaker sees meaningful failures?
          </li>
          <li>
            Is the breaker scoped appropriately (per endpoint or per host) so one bad path does not poison others?
          </li>
          <li>
            Is the half-open probe policy safe for the dependency&apos;s recovery capacity?
          </li>
          <li>
            Do you have a degraded response that is predictable and does not cause new overload?
          </li>
          <li>
            Are breaker state changes visible and alerting, not hidden inside logs?
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Why isn&apos;t a timeout enough?</p>
            <p className="mt-2 text-sm">
              Timeouts limit how long a single call waits, but they still allow the system to spend capacity on work that
              is likely to fail. A breaker changes behavior at the system level by failing fast and reducing load on the dependency.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">How do you avoid false positives?</p>
            <p className="mt-2 text-sm">
              Use rolling windows, minimum sample counts, and error classification so rare client-side errors or low-volume
              noise does not trip the breaker.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">What makes circuit breakers hard operationally?</p>
            <p className="mt-2 text-sm">
              Getting probes and fallbacks right. Recovery behavior and degraded paths are where many systems accidentally
              create new failure modes.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
