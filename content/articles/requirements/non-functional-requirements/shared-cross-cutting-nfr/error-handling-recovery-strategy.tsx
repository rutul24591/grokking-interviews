"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-shared-nfr-error-handling-recovery-extensive",
  title: "Error Handling & Recovery Strategy",
  description: "Comprehensive guide to error handling and recovery strategies, covering error classification, retry patterns, circuit breakers, graceful degradation, and incident recovery for staff/principal engineer interviews.",
  category: "shared-cross-cutting-nfr",
  subcategory: "nfr",
  slug: "error-handling-recovery-strategy",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-19",
  tags: ["advanced", "nfr", "error-handling", "recovery", "resilience", "circuit-breaker", "retry"],
  relatedTopics: ["fault-tolerance-resilience", "high-availability", "incident-response"],
};

export default function ErrorHandlingRecoveryStrategyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Error Handling & Recovery Strategy</strong> encompasses the systematic approach to
          detecting, classifying, responding to, and recovering from failures across a distributed system.
          It&apos;s not just about catching exceptions — it&apos;s about designing systems that fail
          gracefully, recover automatically when possible, and provide clear paths for manual intervention
          when needed.
        </p>
        <p>
          In distributed systems, failures are inevitable. Networks partition, databases become unavailable,
          third-party APIs return errors, and hardware fails. A robust error handling strategy ensures
          these failures don&apos;t cascade into system-wide outages and that recovery is predictable and
          measurable.
        </p>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li>
            <strong>Fail Fast:</strong> Detect and report errors early rather than propagating corrupted state.
          </li>
          <li>
            <strong>Fail Gracefully:</strong> Degrade functionality rather than crashing completely.
          </li>
          <li>
            <strong>Retry Intelligently:</strong> Not all errors are retryable; use exponential backoff.
          </li>
          <li>
            <strong>Circuit Break:</strong> Stop sending requests to failing services to prevent cascade.
          </li>
          <li>
            <strong>Recover Automatically:</strong> Self-healing where possible, with human escalation.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Errors Are Expected, Not Exceptional</h3>
          <p>
            In distributed systems, errors are normal operating conditions, not exceptional cases. Design
            your error handling for the common case, not the happy path. Every external call should assume
            failure is possible and plan accordingly.
          </p>
        </div>
      </section>

      <section>
        <h2>Error Classification</h2>
        <p>
          Proper error classification determines the appropriate response.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">By Recoverability</h3>
        <ul>
          <li>
            <strong>Transient Errors:</strong> Temporary failures that may succeed on retry (network timeouts,
            rate limits, database deadlocks).
          </li>
          <li>
            <strong>Permanent Errors:</strong> Will not succeed on retry (invalid input, authentication
            failure, resource not found).
          </li>
          <li>
            <strong>Unknown Errors:</strong> Unclassified — treat as transient initially, escalate if persistent.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">By Scope</h3>
        <ul>
          <li>
            <strong>Request-Level:</strong> Affects single request (validation error, timeout).
          </li>
          <li>
            <strong>Session-Level:</strong> Affects user session (authentication expired, cart corrupted).
          </li>
          <li>
            <strong>Service-Level:</strong> Affects entire service (database down, dependency failure).
          </li>
          <li>
            <strong>System-Level:</strong> Affects multiple services (network partition, datacenter outage).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP Error Categories</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Retry?</th>
                <th className="p-2 text-left">Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">4xx Client Errors</td>
                <td className="p-2">No (except 429)</td>
                <td className="p-2">Fix request, user action</td>
              </tr>
              <tr>
                <td className="p-2">429 Rate Limited</td>
                <td className="p-2">Yes (with backoff)</td>
                <td className="p-2">Wait, retry after Retry-After</td>
              </tr>
              <tr>
                <td className="p-2">5xx Server Errors</td>
                <td className="p-2">Yes (limited retries)</td>
                <td className="p-2">Retry with backoff, circuit break</td>
              </tr>
              <tr>
                <td className="p-2">503 Unavailable</td>
                <td className="p-2">Yes (with backoff)</td>
                <td className="p-2">Retry, failover if available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Retry Patterns</h2>
        <p>
          Intelligent retry strategies prevent overwhelming failing services.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Exponential Backoff</h3>
        <p>
          Increase delay between retries exponentially:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`Retry delays: 1s, 2s, 4s, 8s, 16s, 32s
Formula: delay = base_delay × 2^attempt`}
        </pre>
        <p>
          <strong>Add jitter:</strong> Randomize delays to prevent thundering herd:
        </p>
        <pre className="my-4 rounded-lg bg-panel-soft p-4 text-sm overflow-x-auto">
{`delay = base_delay × 2^attempt × random(0.5, 1.5)`}
        </pre>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Retry Budget</h3>
        <p>
          Limit total retry attempts to prevent cascade:
        </p>
        <ul>
          <li>Maximum retries per request (e.g., 3 attempts).</li>
          <li>Maximum retry budget per service (e.g., 20% of traffic can be retries).</li>
          <li>Global retry budget to prevent system-wide retry storms.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotency</h3>
        <p>
          Ensure retries don&apos;t cause duplicate side effects:
        </p>
        <ul>
          <li>Use idempotency keys for write operations.</li>
          <li>Design APIs to be idempotent (PUT vs POST).</li>
          <li>Track processed request IDs to detect duplicates.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/retry-patterns.svg"
          alt="Retry Patterns"
          caption="Retry Patterns — showing exponential backoff with jitter, retry budget, and idempotency handling"
        />
      </section>

      <section>
        <h2>Circuit Breaker Pattern</h2>
        <p>
          Prevent cascading failures by stopping requests to failing services.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Circuit States</h3>
        <ul>
          <li>
            <strong>Closed:</strong> Normal operation. Requests flow through. Monitor failures.
          </li>
          <li>
            <strong>Open:</strong> Circuit tripped. Requests fail immediately without calling service.
          </li>
          <li>
            <strong>Half-Open:</strong> Testing recovery. Allow limited requests to probe service health.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Configuration</h3>
        <ul>
          <li><strong>Failure Threshold:</strong> Number of failures before opening (e.g., 5 failures).</li>
          <li><strong>Success Threshold:</strong> Successes in half-open before closing (e.g., 3 successes).</li>
          <li><strong>Timeout:</strong> Time in open state before half-open (e.g., 30 seconds).</li>
          <li><strong>Failure Window:</strong> Time window for counting failures (e.g., 60 seconds).</li>
        </ul>
      </section>

      <section>
        <h2>Graceful Degradation</h2>
        <p>
          Maintain partial functionality when dependencies fail.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Degradation Strategies</h3>
        <ul>
          <li>
            <strong>Cache Fallback:</strong> Serve stale cached data when service unavailable.
          </li>
          <li>
            <strong>Default Values:</strong> Return sensible defaults (empty list, zero balance).
          </li>
          <li>
            <strong>Reduced Functionality:</strong> Disable non-critical features (recommendations, analytics).
          </li>
          <li>
            <strong>Queue for Later:</strong> Accept requests, process when service recovers.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Bulkhead Pattern</h3>
        <p>
          Isolate failures to prevent cascade:
        </p>
        <ul>
          <li>Separate thread pools for different services.</li>
          <li>Rate limit per dependency.</li>
          <li>Fail one feature, not entire page.</li>
        </ul>
      </section>

      <section>
        <h2>Recovery Strategies</h2>
        <p>
          Automated and manual recovery processes.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Automated Recovery</h3>
        <ul>
          <li><strong>Health Checks:</strong> Detect recovery, close circuit breakers.</li>
          <li><strong>Auto-Scaling:</strong> Replace failed instances.</li>
          <li><strong>Failover:</strong> Switch to healthy replicas/regions.</li>
          <li><strong>Rollback:</strong> Automatic rollback on deployment failures.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Manual Recovery</h3>
        <ul>
          <li><strong>Runbooks:</strong> Documented recovery procedures.</li>
          <li><strong>Feature Flags:</strong> Disable problematic features.</li>
          <li><strong>Traffic Shifting:</strong> Route traffic away from affected services.</li>
          <li><strong>Data Recovery:</strong> Restore from backups if needed.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you retry a failed request?</p>
            <p className="mt-2 text-sm">
              A: Retry transient errors (timeouts, 503, 429 with Retry-After). Don&apos;t retry permanent
              errors (400, 401, 404). Use exponential backoff with jitter. Limit retry attempts (3-5 max).
              Ensure idempotency for write operations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does a circuit breaker work?</p>
            <p className="mt-2 text-sm">
              A: Three states: Closed (normal), Open (failing fast), Half-Open (testing recovery). Track
              failures in a window. Open circuit when threshold exceeded. After timeout, go half-open and
              allow limited requests. Close on success, open on failure.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is graceful degradation?</p>
            <p className="mt-2 text-sm">
              A: Maintaining partial functionality when dependencies fail. Examples: serve cached data,
              return defaults, disable non-critical features, queue requests for later. Better to degrade
              than fail completely.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent retry storms?</p>
            <p className="mt-2 text-sm">
              A: Exponential backoff with jitter (randomize delays), retry budgets (limit % of traffic that
              can be retries), circuit breakers (stop retrying failing services), and idempotency (prevent
              duplicate side effects).
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
