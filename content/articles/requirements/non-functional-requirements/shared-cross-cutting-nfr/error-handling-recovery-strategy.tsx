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
  wordCount: 10000,
  readingTime: 40,
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
          It&apos;s not just about catching exceptions—it&apos;s about designing systems that fail
          gracefully, recover automatically when possible, and provide clear paths for manual intervention
          when needed.
        </p>
        <p>
          In distributed systems, failures are inevitable. Networks partition, databases become unavailable,
          third-party APIs return errors, and hardware fails. A robust error handling strategy ensures
          these failures don&apos;t cascade into system-wide outages and that recovery is predictable and
          measurable. For staff and principal engineers, error handling is a critical architectural
          concern—the patterns you establish determine system resilience and operational burden.
        </p>
        <p>
          <strong>Key principles:</strong>
        </p>
        <ul>
          <li><strong>Fail Fast:</strong> Detect and report errors early rather than propagating corrupted state.</li>
          <li><strong>Fail Gracefully:</strong> Degrade functionality rather than crashing completely.</li>
          <li><strong>Retry Intelligently:</strong> Not all errors are retryable; use exponential backoff.</li>
          <li><strong>Circuit Break:</strong> Stop sending requests to failing services to prevent cascade.</li>
          <li><strong>Recover Automatically:</strong> Self-healing where possible, with human escalation.</li>
          <li><strong>Observe Everything:</strong> Log errors with context for debugging and alerting.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/error-handling-patterns.svg"
          alt="Error Handling Patterns showing different strategies"
          caption="Error Handling Patterns: From simple retry through circuit breaker, bulkhead isolation, to graceful degradation—layered defense against failures."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Errors Are Expected, Not Exceptional</h3>
          <p>
            In distributed systems, errors are normal operating conditions, not exceptional cases. Design
            your error handling for the common case, not the happy path. Every external call should assume
            failure is possible and plan accordingly. The question isn&apos;t &quot;if&quot; but &quot;when&quot;
            and &quot;how gracefully&quot;.
          </p>
        </div>
      </section>

      <section>
        <h2>Error Classification</h2>
        <p>
          Proper error classification determines the appropriate response. Treating all errors the same
          leads to either excessive retries (wasting resources) or missed recovery opportunities.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">By Recoverability</h3>
        <h4 className="mt-4 mb-2 font-semibold">Transient Errors</h4>
        <p>
          Temporary failures that may succeed on retry:
        </p>
        <ul>
          <li>Network timeouts</li>
          <li>Rate limiting (429 Too Many Requests)</li>
          <li>Database deadlocks</li>
          <li>Service temporarily unavailable (503)</li>
          <li>Connection refused (service restarting)</li>
        </ul>
        <p><strong>Response:</strong> Retry with exponential backoff.</p>

        <h4 className="mt-4 mb-2 font-semibold">Permanent Errors</h4>
        <p>
          Will not succeed on retry—require different action:
        </p>
        <ul>
          <li>Invalid input (400 Bad Request)</li>
          <li>Authentication failure (401 Unauthorized)</li>
          <li>Authorization failure (403 Forbidden)</li>
          <li>Resource not found (404 Not Found)</li>
          <li>Validation errors</li>
        </ul>
        <p><strong>Response:</strong> Don&apos;t retry. Fix the request or notify user.</p>

        <h4 className="mt-4 mb-2 font-semibold">Unknown Errors</h4>
        <p>
          Unclassified errors—treat cautiously:
        </p>
        <ul>
          <li>Unexpected exceptions</li>
          <li>Malformed responses</li>
          <li>Protocol violations</li>
        </ul>
        <p><strong>Response:</strong> Treat as transient initially, but escalate if persistent. Log extensively for investigation.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">By Scope</h3>
        <h4 className="mt-4 mb-2 font-semibold">Request-Level Errors</h4>
        <p>
          Affects single request:
        </p>
        <ul>
          <li>Validation errors</li>
          <li>Request timeouts</li>
          <li>Rate limiting for specific user</li>
        </ul>
        <p><strong>Response:</strong> Handle at request level, retry if appropriate.</p>

        <h4 className="mt-4 mb-2 font-semibold">Session-Level Errors</h4>
        <p>
          Affects user session:
        </p>
        <ul>
          <li>Authentication expired</li>
          <li>Session corrupted</li>
          <li>Cart/checkout issues</li>
        </ul>
        <p><strong>Response:</strong> May require user re-authentication or session reset.</p>

        <h4 className="mt-4 mb-2 font-semibold">Service-Level Errors</h4>
        <p>
          Affects entire service:
        </p>
        <ul>
          <li>Database down</li>
          <li>Dependency failure</li>
          <li>Service crash</li>
        </ul>
        <p><strong>Response:</strong> Circuit breaker, failover, graceful degradation.</p>

        <h4 className="mt-4 mb-2 font-semibold">System-Level Errors</h4>
        <p>
          Affects multiple services:
        </p>
        <ul>
          <li>Network partition</li>
          <li>Datacenter outage</li>
          <li>Cloud provider region failure</li>
        </ul>
        <p><strong>Response:</strong> Disaster recovery, region failover.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">HTTP Error Categories</h3>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Error</th>
                <th className="p-3 text-left">Retry?</th>
                <th className="p-3 text-left">Response</th>
                <th className="p-3 text-left">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3">400 Bad Request</td>
                <td className="p-3">No</td>
                <td className="p-3">Fix request</td>
                <td className="p-3">Invalid JSON</td>
              </tr>
              <tr>
                <td className="p-3">401 Unauthorized</td>
                <td className="p-3">No</td>
                <td className="p-3">Re-authenticate</td>
                <td className="p-3">Expired token</td>
              </tr>
              <tr>
                <td className="p-3">403 Forbidden</td>
                <td className="p-3">No</td>
                <td className="p-3">Check permissions</td>
                <td className="p-3">Insufficient access</td>
              </tr>
              <tr>
                <td className="p-3">404 Not Found</td>
                <td className="p-3">No</td>
                <td className="p-3">Resource doesn&apos;t exist</td>
                <td className="p-3">Missing record</td>
              </tr>
              <tr>
                <td className="p-3">409 Conflict</td>
                <td className="p-3">Maybe</td>
                <td className="p-3">Resolve conflict</td>
                <td className="p-3">Version mismatch</td>
              </tr>
              <tr>
                <td className="p-3">429 Too Many Requests</td>
                <td className="p-3">Yes (with backoff)</td>
                <td className="p-3">Wait for Retry-After</td>
                <td className="p-3">Rate limited</td>
              </tr>
              <tr>
                <td className="p-3">500 Internal Server Error</td>
                <td className="p-3">Yes (limited)</td>
                <td className="p-3">Retry with backoff</td>
                <td className="p-3">Server exception</td>
              </tr>
              <tr>
                <td className="p-3">502 Bad Gateway</td>
                <td className="p-3">Yes (limited)</td>
                <td className="p-3">Retry, may be transient</td>
                <td className="p-3">Upstream failure</td>
              </tr>
              <tr>
                <td className="p-3">503 Service Unavailable</td>
                <td className="p-3">Yes (with backoff)</td>
                <td className="p-3">Retry, failover if available</td>
                <td className="p-3">Service overloaded</td>
              </tr>
              <tr>
                <td className="p-3">504 Gateway Timeout</td>
                <td className="p-3">Yes (limited)</td>
                <td className="p-3">Retry with backoff</td>
                <td className="p-3">Upstream timeout</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Classify at the Boundary</h3>
          <p>
            Classify errors as close to the source as possible. The service returning the error knows
            best whether it&apos;s retryable. Don&apos;t let error classification leak across service
            boundaries—wrap external errors in your own error types.
          </p>
        </div>
      </section>

      <section>
        <h2>Retry Patterns</h2>
        <p>
          Intelligent retry strategies can recover from transient failures without overwhelming failing
          services. Poor retry strategies make failures worse.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Exponential Backoff</h3>
        <p>
          Increase delay between retries exponentially to give failing services time to recover:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Basic Formula</h4>
        <p>
          Retry delays: 1s, 2s, 4s, 8s, 16s. Formula: delay = base_delay × 2^attempt. Example:
          Attempt 1 fails, wait 1s; Attempt 2 fails, wait 2s; Attempt 3 fails, wait 4s; Attempt 4 fails,
          wait 8s; Attempt 5 fails, give up.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">With Jitter</h4>
        <p>
          Add randomness to prevent thundering herd (all clients retrying simultaneously):
          delay = base_delay × 2^attempt × random(0.5, 1.5). Example with jitter: Attempt 1 fails,
          wait 0.8s; Attempt 2 fails, wait 2.3s; Attempt 3 fails, wait 3.5s; Attempt 4 fails, wait 9.1s;
          Attempt 5 fails, give up.
        </p>

        <h4 className="mt-4 mb-2 font-semibold">Maximum Delay Cap</h4>
        <p>
          Cap the maximum delay to prevent excessive wait times:
          delay = min(base_delay × 2^attempt × jitter, max_delay). Example with max_delay = 30s:
          Attempts 1-5 follow exponential pattern (1s, 2s, 4s, 8s, 16s), then Attempts 6+ are capped at 30s.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Retry Budget</h3>
        <p>
          Limit total retry attempts to prevent cascade:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Per-Request Budget</h4>
        <ul>
          <li>Maximum 3-5 retry attempts per request</li>
          <li>After budget exhausted, fail fast</li>
          <li>Prevents individual requests from consuming excessive resources</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Per-Service Budget</h4>
        <ul>
          <li>Maximum 20% of traffic can be retries</li>
          <li>Track retry rate, reject new retries when budget exhausted</li>
          <li>Prevents retry storm from overwhelming service</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Global Budget</h4>
        <ul>
          <li>System-wide retry limit</li>
          <li>Protects entire system from cascade</li>
          <li>Useful in microservices architectures</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Idempotency</h3>
        <p>
          Ensure retries don&apos;t cause duplicate side effects:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Idempotency Keys</h4>
        <ul>
          <li>Client generates unique key per operation</li>
          <li>Server tracks processed keys</li>
          <li>Duplicate key returns original response</li>
          <li>Key expires after TTL (e.g., 24 hours)</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">HTTP Method Idempotency</h4>
        <ul>
          <li><strong>GET:</strong> Always idempotent (read-only)</li>
          <li><strong>PUT:</strong> Idempotent (replacing resource)</li>
          <li><strong>DELETE:</strong> Idempotent (resource already deleted)</li>
          <li><strong>PATCH:</strong> May not be idempotent (depends on operation)</li>
          <li><strong>POST:</strong> Not idempotent (creating new resource)</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Making POST Idempotent</h4>
        <ul>
          <li>Include idempotency key in header</li>
          <li>Server checks key before processing</li>
          <li>Return cached response for duplicate key</li>
          <li>Example: Payment APIs (Stripe, PayPal)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Retry Best Practices</h3>
        <ul>
          <li><strong>Only retry transient errors:</strong> Don&apos;t retry 4xx errors (except 429).</li>
          <li><strong>Use exponential backoff with jitter:</strong> Prevents thundering herd.</li>
          <li><strong>Set maximum retries:</strong> 3-5 attempts typically sufficient.</li>
          <li><strong>Cap maximum delay:</strong> Prevent excessive wait times.</li>
          <li><strong>Ensure idempotency:</strong> For write operations.</li>
          <li><strong>Log retries:</strong> For debugging and monitoring.</li>
          <li><strong>Monitor retry rates:</strong> High retry rate indicates underlying issues.</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/retry-circuit-breaker.svg"
          alt="Retry and Circuit Breaker Pattern"
          caption="Retry with Exponential Backoff and Circuit Breaker: Requests retry with increasing delays until circuit opens, then fail fast until service recovers."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Retries Can Make Things Worse</h3>
          <p>
            Uncontrolled retries can turn a minor blip into a major outage. If every client retries failed
            requests 5 times, you&apos;ve just 5x&apos;d the load on a struggling service. Always use
            backoff with jitter, set retry budgets, and respect rate limits.
          </p>
        </div>
      </section>

      <section>
        <h2>Circuit Breaker Pattern</h2>
        <p>
          Circuit breakers prevent cascading failures by stopping requests to failing services. Named
          after electrical circuit breakers that trip to prevent damage.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Circuit States</h3>
        <h4 className="mt-4 mb-2 font-semibold">Closed (Normal Operation)</h4>
        <p>
          Circuit is closed, requests flow through normally:
        </p>
        <ul>
          <li>All requests go to the service</li>
          <li>Failures are tracked</li>
          <li>When failure threshold exceeded, circuit opens</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Open (Failing Fast)</h4>
        <p>
          Circuit has tripped, requests fail immediately:
        </p>
        <ul>
          <li>All requests fail immediately without calling service</li>
          <li>Service gets time to recover</li>
          <li>After timeout period, circuit goes half-open</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Half-Open (Testing Recovery)</h4>
        <p>
          Testing if service has recovered:
        </p>
        <ul>
          <li>Limited requests allowed through</li>
          <li>If successful, circuit closes</li>
          <li>If failed, circuit opens again</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Configuration Parameters</h3>
        <h4 className="mt-4 mb-2 font-semibold">Failure Threshold</h4>
        <p>
          Number of failures before opening circuit:
        </p>
        <ul>
          <li>Typical: 5 failures</li>
          <li>Or failure rate (e.g., 50% of requests)</li>
          <li>Lower = more sensitive, higher = more tolerant</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Success Threshold</h4>
        <p>
          Successes needed in half-open before closing:
        </p>
        <ul>
          <li>Typical: 3 successes</li>
          <li>Ensures service is truly recovered</li>
          <li>Higher = more confidence, slower recovery</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Timeout (Open Duration)</h4>
        <p>
          Time in open state before going half-open:
        </p>
        <ul>
          <li>Typical: 30 seconds</li>
          <li>Shorter = faster recovery, risk of premature retry</li>
          <li>Longer = more recovery time, longer outage</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Failure Window</h4>
        <p>
          Time window for counting failures:
        </p>
        <ul>
          <li>Typical: 60 seconds</li>
          <li>Failures outside window don&apos;t count</li>
          <li>Prevents old failures from triggering circuit</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implementation Considerations</h3>
        <h4 className="mt-4 mb-2 font-semibold">Per-Service Circuit Breakers</h4>
        <ul>
          <li>Separate circuit breaker for each dependency</li>
          <li>One service failing doesn&apos;t affect others</li>
          <li>Granular control over each dependency</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Fallback on Open Circuit</h4>
        <ul>
          <li>Return cached data</li>
          <li>Return default values</li>
          <li>Return error immediately (fail fast)</li>
          <li>Queue request for later processing</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Monitoring Circuit Breakers</h4>
        <ul>
          <li>Track state changes (closed → open → half-open → closed)</li>
          <li>Alert on circuit open (indicates service issues)</li>
          <li>Track rejection rate (requests failed by circuit)</li>
          <li>Monitor recovery time</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Circuit Breaker Libraries</h3>
        <ul>
          <li><strong>Hystrix (Netflix):</strong> Original circuit breaker library (now in maintenance)</li>
          <li><strong>Resilience4j:</strong> Modern Java circuit breaker</li>
          <li><strong>Polly:</strong> .NET resilience library</li>
          <li><strong>pybreaker:</strong> Python circuit breaker</li>
          <li><strong>Opossum:</strong> Node.js circuit breaker</li>
          <li><strong>Envoy Proxy:</strong> Circuit breaking at proxy level</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Circuit Breakers Protect Both Sides</h3>
          <p>
            Circuit breakers protect the failing service (by reducing load) and the calling service (by
            failing fast instead of timing out). They&apos;re essential for preventing cascade failures
            in microservices architectures.
          </p>
        </div>
      </section>

      <section>
        <h2>Graceful Degradation</h2>
        <p>
          When dependencies fail, maintain partial functionality rather than failing completely. This
          improves user experience and reduces blast radius of failures.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Degradation Strategies</h3>
        <h4 className="mt-4 mb-2 font-semibold">Cache Fallback</h4>
        <p>
          Serve stale cached data when service unavailable:
        </p>
        <ul>
          <li>Product recommendations from cache</li>
          <li>User profile from local cache</li>
          <li>Search results from recent cache</li>
        </ul>
        <p><strong>Consideration:</strong> Clearly indicate data may be stale.</p>

        <h4 className="mt-4 mb-2 font-semibold">Default Values</h4>
        <p>
          Return sensible defaults when service fails:
        </p>
        <ul>
          <li>Empty list instead of recommendations</li>
          <li>Zero balance (with disclaimer)</li>
          <li>Generic content instead of personalized</li>
        </ul>
        <p><strong>Consideration:</strong> Defaults should be safe and non-misleading.</p>

        <h4 className="mt-4 mb-2 font-semibold">Reduced Functionality</h4>
        <p>
          Disable non-critical features:
        </p>
        <ul>
          <li>E-commerce: Disable recommendations, keep checkout</li>
          <li>Social: Disable likes/comments, keep feed</li>
          <li>Analytics: Disable real-time, keep historical</li>
        </ul>
        <p><strong>Consideration:</strong> Prioritize core functionality.</p>

        <h4 className="mt-4 mb-2 font-semibold">Queue for Later</h4>
        <p>
          Accept requests, process when service recovers:
        </p>
        <ul>
          <li>Email notifications queued</li>
          <li>Analytics events buffered</li>
          <li>Non-critical writes deferred</li>
        </ul>
        <p><strong>Consideration:</strong> User should understand delay.</p>

        <h4 className="mt-4 mb-2 font-semibold">Read-Only Mode</h4>
        <p>
          Allow reads, disable writes:
        </p>
        <ul>
          <li>Browse products, can&apos;t checkout</li>
          <li>View documents, can&apos;t edit</li>
          <li>Read feed, can&apos;t post</li>
        </ul>
        <p><strong>Consideration:</strong> Clear communication to users.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Bulkhead Pattern</h3>
        <p>
          Isolate failures to prevent cascade—named after ship bulkheads that contain flooding:
        </p>
        <h4 className="mt-4 mb-2 font-semibold">Thread Pool Isolation</h4>
        <ul>
          <li>Separate thread pool for each dependency</li>
          <li>One dependency failing doesn&apos;t exhaust all threads</li>
          <li>Other dependencies continue working</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Rate Limiting per Dependency</h4>
        <ul>
          <li>Limit requests to each dependency</li>
          <li>Prevents one dependency from consuming all resources</li>
          <li>Protects against dependency overload</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Feature Isolation</h4>
        <ul>
          <li>Fail one feature, not entire page</li>
          <li>Recommendations fail, product page still works</li>
          <li>Comments fail, article still readable</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/shared-cross-cutting-nfr/graceful-degradation.svg"
          alt="Graceful Degradation showing feature isolation"
          caption="Graceful Degradation: When recommendations service fails, product page still works with cached recommendations or empty section—core functionality preserved."
        />

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Design for Degradation Upfront</h3>
          <p>
            Graceful degradation isn&apos;t something you add later—it must be designed into the system.
            Identify critical vs non-critical features, define fallback behavior for each dependency, and
            test degradation scenarios regularly.
          </p>
        </div>
      </section>

      <section>
        <h2>Recovery Strategies</h2>
        <p>
          Recovery is the process of returning to normal operation after a failure. Good recovery is
          fast, predictable, and minimizes data loss.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Automated Recovery</h3>
        <h4 className="mt-4 mb-2 font-semibold">Health Checks</h4>
        <ul>
          <li>Continuous health monitoring</li>
          <li>Detect when service recovers</li>
          <li>Automatically close circuit breakers</li>
          <li>Resume normal traffic flow</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Auto-Scaling</h4>
        <ul>
          <li>Detect failed instances</li>
          <li>Automatically replace failed instances</li>
          <li>Scale up to handle increased load</li>
          <li>Scale down when load decreases</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Failover</h4>
        <ul>
          <li>Automatic switch to healthy replicas</li>
          <li>Cross-zone or cross-region failover</li>
          <li>DNS or load balancer based</li>
          <li>Test failover regularly</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Automatic Rollback</h4>
        <ul>
          <li>Detect deployment failures</li>
          <li>Automatically rollback to previous version</li>
          <li>Based on error rate, latency, or health checks</li>
          <li>Notify team of rollback</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Manual Recovery</h3>
        <h4 className="mt-4 mb-2 font-semibold">Runbooks</h4>
        <ul>
          <li>Documented recovery procedures</li>
          <li>Step-by-step instructions</li>
          <li>Escalation paths</li>
          <li>Test runbooks regularly</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Feature Flags</h4>
        <ul>
          <li>Disable problematic features</li>
          <li>Gradual re-enablement after fix</li>
          <li>Targeted disable (per user, region)</li>
          <li>Quick response without deployment</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Traffic Shifting</h4>
        <ul>
          <li>Route traffic away from affected services</li>
          <li>Shift to healthy regions</li>
          <li>Reduce load on struggling services</li>
          <li>Canary re-enablement</li>
        </ul>

        <h4 className="mt-4 mb-2 font-semibold">Data Recovery</h4>
        <ul>
          <li>Restore from backups</li>
          <li>Point-in-time recovery</li>
          <li>Repair corrupted data</li>
          <li>Verify data integrity</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recovery Verification</h3>
        <p>
          Ensure recovery was successful:
        </p>
        <ul>
          <li>Monitor key metrics post-recovery</li>
          <li>Verify error rates return to normal</li>
          <li>Check data consistency</li>
          <li>Confirm user experience restored</li>
          <li>Document recovery time and effectiveness</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Test Recovery Procedures</h3>
          <p>
            Recovery procedures that haven&apos;t been tested will fail when you need them. Run regular
            disaster recovery tests. Practice failover. Verify backups can be restored. Chaos engineering
            can help validate recovery under realistic conditions.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Handling</h3>
        <ul>
          <li>Classify errors at the boundary</li>
          <li>Use structured error types</li>
          <li>Include context in error messages</li>
          <li>Log errors with full stack traces</li>
          <li>Don&apos;t swallow errors silently</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Retry Configuration</h3>
        <ul>
          <li>Use exponential backoff with jitter</li>
          <li>Set maximum retry attempts (3-5)</li>
          <li>Cap maximum delay (30-60s)</li>
          <li>Only retry transient errors</li>
          <li>Ensure idempotency for writes</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Circuit Breaker Setup</h3>
        <ul>
          <li>One circuit breaker per dependency</li>
          <li>Configure appropriate thresholds</li>
          <li>Define fallback behavior</li>
          <li>Monitor circuit state changes</li>
          <li>Alert on circuit open</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Graceful Degradation</h3>
        <ul>
          <li>Identify critical vs non-critical features</li>
          <li>Define fallback for each dependency</li>
          <li>Test degradation scenarios</li>
          <li>Communicate degraded state to users</li>
          <li>Automate recovery when possible</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring & Alerting</h3>
        <ul>
          <li>Track error rates by type</li>
          <li>Monitor retry rates</li>
          <li>Alert on circuit breaker trips</li>
          <li>Track recovery time</li>
          <li>Dashboard for error visibility</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul>
          <li>
            <strong>Retrying everything:</strong> Retrying permanent errors wastes resources. Fix: Classify
            errors, only retry transient.
          </li>
          <li>
            <strong>No backoff:</strong> Immediate retries overwhelm services. Fix: Exponential backoff
            with jitter.
          </li>
          <li>
            <strong>Unlimited retries:</strong> Infinite retry loops. Fix: Set maximum retry attempts.
          </li>
          <li>
            <strong>No idempotency:</strong> Duplicate charges, double bookings. Fix: Idempotency keys
            for writes.
          </li>
          <li>
            <strong>Circuit breaker too sensitive:</strong> Trips on normal errors. Fix: Tune thresholds,
            use failure rate not count.
          </li>
          <li>
            <strong>No fallback:</strong> Circuit open, requests just fail. Fix: Define fallback behavior.
          </li>
          <li>
            <strong>Cascade failures:</strong> One service takes down all. Fix: Bulkhead isolation.
          </li>
          <li>
            <strong>No monitoring:</strong> Don&apos;t know when circuits trip. Fix: Monitor and alert.
          </li>
          <li>
            <strong>Testing only happy path:</strong> Error handling untested. Fix: Chaos engineering,
            failure injection testing.
          </li>
          <li>
            <strong>Silent failures:</strong> Errors logged but not acted on. Fix: Alert on error rates,
            SLO burn rate.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you retry a failed request?</p>
            <p className="mt-2 text-sm">
              A: Retry transient errors (timeouts, 503, 429 with Retry-After). Don&apos;t retry permanent
              errors (400, 401, 404). Use exponential backoff with jitter to prevent thundering herd.
              Limit retry attempts (3-5 max). Ensure idempotency for write operations. Monitor retry rates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does a circuit breaker work?</p>
            <p className="mt-2 text-sm">
              A: Three states: Closed (normal, requests flow), Open (tripped, requests fail fast),
              Half-Open (testing, limited requests). Track failures in a window. Open circuit when
              threshold exceeded. After timeout, go half-open. Close on success, open on failure.
              Protects both failing service and caller.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is graceful degradation?</p>
            <p className="mt-2 text-sm">
              A: Maintaining partial functionality when dependencies fail. Examples: serve cached/stale
              data, return sensible defaults, disable non-critical features, queue requests for later
              processing, read-only mode. Better to degrade gracefully than fail completely. Design
              degradation upfront, not as afterthought.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent retry storms?</p>
            <p className="mt-2 text-sm">
              A: Exponential backoff with jitter (randomize delays to spread retries), retry budgets
              (limit % of traffic that can be retries), circuit breakers (stop retrying failing services),
              idempotency (prevent duplicate side effects), and rate limiting. Monitor retry rates and
              alert when high.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is the bulkhead pattern?</p>
            <p className="mt-2 text-sm">
              A: Isolate resources to prevent cascade failures. Named after ship bulkheads that contain
              flooding. Examples: separate thread pools per dependency, rate limit each dependency
              independently, fail one feature not entire page. One dependency failing doesn&apos;t
              exhaust all resources.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make POST requests idempotent?</p>
            <p className="mt-2 text-sm">
              A: Include idempotency key in header (client-generated UUID). Server tracks processed keys.
              Duplicate key returns cached original response instead of re-processing. Key expires after
              TTL (e.g., 24 hours). Common in payment APIs (Stripe, PayPal) to prevent duplicate charges.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>&quot;Release It!&quot; by Michael Nygard - Circuit breakers, bulkheads</li>
          <li>Google SRE Book: Handling Failures</li>
          <li>Resilience4j Documentation</li>
          <li>Netflix Hystrix Wiki (archived but still relevant)</li>
          <li>Martin Fowler: CircuitBreaker</li>
          <li>AWS Well-Architected: Reliability Pillar</li>
          <li>&quot;Designing Data-Intensive Applications&quot; by Martin Kleppmann</li>
          <li>Polly .NET Resilience Library</li>
          <li>Chaos Engineering: Principles and Practices</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}