"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-traffic-management-load-shedding",
  title: "Traffic Management & Load Shedding",
  description: "Comprehensive guide to traffic management and load shedding — circuit breakers, bulkheads, priority queuing, graceful degradation, overload protection, and load shedding testing for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "traffic-management-load-shedding",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "traffic-management", "load-shedding", "circuit-breaker", "bulkhead", "graceful-degradation"],
  relatedTopics: ["backpressure-handling", "rate-limiting-abuse-protection", "fault-tolerance", "high-availability"],
};

export default function TrafficManagementLoadSheddingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Traffic management</strong> is the practice of controlling the flow of requests
          through a system to prevent overload — it includes rate limiting (limiting requests per
          client), load shedding (dropping requests when the system is overloaded), circuit breakers
          (stopping requests to failing services), and bulkheads (isolating resources to prevent
          cascading failures). <strong>Load shedding</strong> is the practice of dropping requests
          when the system cannot handle the load — it is better to reject some requests (return 503
          Service Unavailable) than to accept all requests and fail catastrophically (all requests
          timeout or error).
        </p>
        <p>
          Load shedding is a last-resort protection mechanism — when the system is overloaded
          (CPU at 100%, queue depth growing, latency increasing), load shedding drops requests
          to prevent total system failure. Load shedding should be graceful — it should drop
          low-priority requests first (analytics, reporting) while preserving high-priority
          requests (user-facing operations, payments). The goal is to maintain partial functionality
          rather than complete failure.
        </p>
        <p>
          For staff and principal engineer candidates, traffic management and load shedding
          architecture demonstrates understanding of system overload scenarios, the ability to
          design overload protection mechanisms that prevent cascading failures, and the maturity
          to balance availability with graceful degradation. Interviewers expect you to design
          load shedding strategies that prioritize critical requests, implement circuit breakers
          that stop requests to failing services, use bulkheads to isolate resources, and test
          load shedding through failure injection.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Load Shedding vs Rate Limiting</h3>
          <p>
            <strong>Rate limiting</strong> prevents overload by limiting requests per client — it is proactive (prevents overload before it occurs). <strong>Load shedding</strong> responds to overload by dropping requests — it is reactive (responds to overload that has already occurred).
          </p>
          <p className="mt-3">
            Rate limiting and load shedding work together — rate limiting prevents individual clients from overwhelming the system, while load shedding protects the system when the total load exceeds capacity despite rate limiting. Rate limiting is client-focused, load shedding is system-focused.
          </p>
        </div>

        <p>
          A mature traffic management and load shedding architecture includes: circuit breakers
          that stop requests to failing services, bulkheads that isolate resources to prevent
          cascading failures, priority queuing that processes critical requests first, graceful
          degradation that maintains partial functionality during overload, and load shedding
          that drops requests when the system cannot handle the load.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding traffic management and load shedding requires grasping several foundational
          concepts about circuit breakers, bulkheads, priority queuing, and graceful degradation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Circuit Breakers</h3>
        <p>
          Circuit breakers stop requests to failing services — when a service&apos;s error rate
          exceeds a threshold, the circuit breaker &quot;opens&quot; and rejects requests immediately
          (without calling the failing service). After a cooldown period, the circuit breaker
          &quot;half-opens&quot; — it allows a few requests through to test if the service has
          recovered. If the test requests succeed, the circuit breaker &quot;closes&quot; (resumes
          normal operation). If the test requests fail, the circuit breaker re-opens. Circuit
          breakers prevent cascading failures — if service A depends on service B and B fails,
          the circuit breaker stops A from calling B, preventing A from failing due to B&apos;s
          failure.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Bulkheads</h3>
        <p>
          Bulkheads isolate resources to prevent cascading failures — like a ship with watertight
          compartments, if one compartment floods, the other compartments remain dry. In software,
          bulkheads isolate resources (thread pools, connection pools, memory) per service or per
          client — if one service consumes all its allocated resources, other services are not
          affected. Bulkheads prevent a single service from consuming all resources and causing
          system-wide failure.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Priority Queuing and Graceful Degradation</h3>
        <p>
          Priority queuing ensures that critical requests are processed first when the system is
          overloaded — user-facing requests (login, checkout) have higher priority than background
          requests (analytics, reporting). When the system is overloaded, low-priority requests
          are dropped first (load shedding), preserving capacity for high-priority requests.
          Graceful degradation maintains partial functionality during overload — the system drops
          non-critical features (recommendations, analytics) while preserving critical features
          (user authentication, payment processing).
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Traffic management and load shedding architecture spans circuit breakers, bulkheads,
          priority queuing, graceful degradation, and load shedding enforcement.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/traffic-management-load-shedding.svg"
          alt="Traffic Management & Load Shedding Architecture"
          caption="Traffic Management — showing circuit breakers, bulkheads, priority queuing, and load shedding"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Circuit Breaker Flow</h3>
        <p>
          The circuit breaker monitors the error rate of the downstream service — if the error
          rate exceeds the threshold (e.g., 50% of requests fail), the circuit breaker opens and
          rejects requests immediately (returning 503 Service Unavailable). After the cooldown
          period (e.g., 30 seconds), the circuit breaker half-opens and allows a few requests
          through. If the test requests succeed, the circuit breaker closes (resumes normal
          operation). If the test requests fail, the circuit breaker re-opens and the cooldown
          period restarts.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Load Shedding Flow</h3>
        <p>
          When the system is overloaded (CPU &gt; 90%, queue depth growing, latency &gt; 2× normal),
          the load shedder drops requests based on priority — low-priority requests (analytics,
          reporting) are dropped first, medium-priority requests (non-critical features) are
          dropped next, and high-priority requests (user-facing operations, payments) are
          preserved. Dropped requests return 503 Service Unavailable with a Retry-After header
          indicating when the client should retry.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/traffic-management-deep-dive.svg"
          alt="Traffic Management Deep Dive"
          caption="Traffic Deep Dive — showing circuit breaker states, bulkhead isolation, and priority queuing"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/load-shedding-priority-queue.svg"
          alt="Load Shedding Priority Queue"
          caption="Load Shedding — showing priority queuing, request dropping, and graceful degradation"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Mechanism</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Circuit Breaker</strong></td>
              <td className="p-3">
                Prevents cascading failures. Fast failure (rejects immediately). Automatic recovery.
              </td>
              <td className="p-3">
                May reject requests during transient failures. Requires tuning thresholds. Complex state management.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Bulkhead</strong></td>
              <td className="p-3">
                Isolates failures. Prevents resource exhaustion. Protects other services.
              </td>
              <td className="p-3">
                Resource underutilization (isolated resources may be idle). Complex configuration. Overhead.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Priority Queuing</strong></td>
              <td className="p-3">
                Critical requests processed first. Graceful degradation. Maintains partial functionality.
              </td>
              <td className="p-3">
                Complex priority classification. Low-priority requests may starve. Requires request prioritization.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Load Shedding</strong></td>
              <td className="p-3">
                Prevents total failure. Protects critical features. Simple to implement.
              </td>
              <td className="p-3">
                Requests are dropped (503). User experience degraded. Requires careful threshold tuning.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use Circuit Breakers for All External Dependencies</h3>
        <p>
          Every external dependency (downstream service, database, external API) should have a
          circuit breaker — if the dependency fails, the circuit breaker stops requests immediately,
          preventing cascading failures. Configure circuit breaker thresholds based on the
          dependency&apos;s normal error rate — if the dependency normally has 1% error rate, set
          the threshold at 10% (10× normal). Set the cooldown period based on the dependency&apos;s
          recovery time — if the dependency typically recovers in 30 seconds, set the cooldown
          to 30 seconds.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implement Bulkheads for Resource Isolation</h3>
        <p>
          Bulkheads isolate resources (thread pools, connection pools, memory) per service or per
          client — if one service consumes all its allocated resources, other services are not
          affected. Use bulkheads for critical services — allocate dedicated thread pools and
          connection pools for critical services (user authentication, payment processing) so
          that they are not affected by non-critical service failures (analytics, reporting).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Shed Load Gracefully</h3>
        <p>
          When the system is overloaded, shed load gracefully — drop low-priority requests first
          (analytics, reporting), then medium-priority requests (non-critical features), and
          preserve high-priority requests (user-facing operations, payments). Return 503 Service
          Unavailable with a Retry-After header indicating when the client should retry. Graceful
          load shedding maintains partial functionality during overload — the system is degraded
          but not failed.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Test Traffic Management Regularly</h3>
        <p>
          Traffic management mechanisms that have never been tested will fail when needed — circuit
          breakers may have incorrect thresholds, bulkheads may have misconfigured resource limits,
          and load shedding may drop the wrong requests. Test traffic management regularly through
          failure injection — simulate downstream service failures, resource exhaustion, and
          traffic spikes, and verify that circuit breakers, bulkheads, and load shedding work
          correctly.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Circuit Breaker Threshold Too Low</h3>
        <p>
          If the circuit breaker threshold is too low (e.g., 10% error rate when the normal error
          rate is 5%), the circuit breaker will open during normal traffic spikes, rejecting
          legitimate requests. Set the circuit breaker threshold based on the dependency&apos;s
          normal error rate — 5-10× the normal error rate is a good starting point. Monitor
          circuit breaker state changes and adjust thresholds based on actual behavior.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Bulkhead Resource Limits Too Strict</h3>
        <p>
          If bulkhead resource limits are too strict (e.g., 10 threads for a service that needs
          50 threads under normal load), the service will be resource-starved even during normal
          operation, causing degraded performance. Set bulkhead resource limits based on the
          service&apos;s normal resource usage — 2× the normal usage is a good starting point,
          providing headroom for traffic spikes while isolating the service from other services.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Load Shedding Without Priority</h3>
        <p>
          Load shedding that drops requests randomly (without priority) may drop critical requests
          (user authentication, payment processing) while preserving non-critical requests
          (analytics, reporting). Implement priority-based load shedding — classify requests by
          priority (high, medium, low) and drop low-priority requests first. This ensures that
          critical features remain available during overload.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Not Testing Failure Scenarios</h3>
        <p>
          Traffic management mechanisms are only useful if they work correctly during failures —
          if circuit breakers, bulkheads, and load shedding have not been tested, they may fail
          when needed. Test failure scenarios regularly through chaos engineering — simulate
          downstream service failures, resource exhaustion, and traffic spikes, and verify that
          traffic management mechanisms work correctly.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Netflix — Hystrix Circuit Breakers</h3>
        <p>
          Netflix open-sourced Hystrix, the pioneering circuit breaker library — Hystrix wraps
          calls to external dependencies with circuit breakers that open when the error rate
          exceeds a threshold. Netflix uses Hystrix for all external dependencies, preventing
          cascading failures when downstream services fail. Netflix&apos;s Hystrix implementation
          includes fallback mechanisms — when the circuit breaker opens, a fallback response is
          returned (cached data, default value, or error message), maintaining partial functionality.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Amazon — Load Shedding for Prime Day</h3>
        <p>
          Amazon uses load shedding during Prime Day (10× normal traffic) to prevent system
          overload — non-critical features (recommendations, reviews) are disabled, preserving
          capacity for critical features (user authentication, payment processing, order placement).
          Amazon&apos;s load shedding is priority-based — low-priority requests are dropped first,
          and critical requests are preserved. Amazon&apos;s load shedding ensures that the system
          remains functional during peak traffic, even if some features are degraded.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Uber — Bulkheads for Service Isolation</h3>
        <p>
          Uber uses bulkheads to isolate resources per service — each service has dedicated thread
          pools and connection pools, so if one service fails, it does not consume resources from
          other services. Uber&apos;s bulkhead isolation prevents cascading failures — if the
          recommendation service fails, it does not affect the ride matching service, which has
          its own dedicated resources.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Twitter — Graceful Degradation During Overload</h3>
        <p>
          Twitter implements graceful degradation during overload — when the system is overloaded,
          non-critical features (analytics, trending topics, recommendations) are disabled,
          preserving capacity for critical features (tweet posting, timeline viewing). Twitter&apos;s
          graceful degradation maintains partial functionality during overload — users can still
          post tweets and view timelines, even if some features are degraded.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Traffic management involves security risks — circuit breakers and load shedding may be exploited for denial-of-service, and bulkheads may create new attack surfaces.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Traffic Management Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>Circuit Breaker Exploitation:</strong> An attacker may intentionally trigger circuit breakers by sending requests that cause errors, causing the circuit breaker to open and reject legitimate requests. Mitigation: use per-client circuit breakers (not global), rate limit error-causing requests, monitor circuit breaker state changes for anomalies.
            </li>
            <li>
              <strong>Load Shedding DoS:</strong> An attacker may flood the system with requests, causing load shedding to drop legitimate requests. Mitigation: use rate limiting to prevent individual clients from flooding, prioritize requests based on authentication status (authenticated requests have higher priority), monitor load shedding rate for anomalies.
            </li>
            <li>
              <strong>Bulkhead Resource Exhaustion:</strong> An attacker may consume all bulkhead resources for a service, causing the service to be resource-starved. Mitigation: use per-client bulkheads (not per-service), rate limit requests per client, monitor bulkhead resource usage for anomalies.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Traffic management must be validated through systematic testing — circuit breaker behavior, bulkhead isolation, priority queuing, and load shedding must all be tested through failure injection.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Traffic Management Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Circuit Breaker Test:</strong> Simulate a downstream service failure (return errors) and verify that the circuit breaker opens after the error rate threshold is exceeded. Verify that requests are rejected immediately (fast failure) and that the circuit breaker half-opens after the cooldown period.
            </li>
            <li>
              <strong>Bulkhead Test:</strong> Simulate a service consuming all its allocated resources and verify that other services are not affected (they have their own dedicated resources). Verify that the resource-starved service degrades gracefully (returns errors) without affecting other services.
            </li>
            <li>
              <strong>Load Shedding Test:</strong> Simulate system overload (high CPU, growing queue depth) and verify that low-priority requests are dropped first, medium-priority requests are dropped next, and high-priority requests are preserved. Verify that dropped requests return 503 with Retry-After header.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Traffic Management Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Circuit breakers configured for all external dependencies</li>
            <li>✓ Circuit breaker thresholds based on normal error rates (5-10× normal)</li>
            <li>✓ Bulkheads configured for critical services (dedicated thread pools, connection pools)</li>
            <li>✓ Bulkhead resource limits based on normal usage (2× normal)</li>
            <li>✓ Priority queuing implemented (high, medium, low priority)</li>
            <li>✓ Load shedding configured with priority-based request dropping</li>
            <li>✓ Dropped requests return 503 with Retry-After header</li>
            <li>✓ Graceful degradation implemented (non-critical features disabled during overload)</li>
            <li>✓ Traffic management testing conducted quarterly through failure injection</li>
            <li>✓ Circuit breaker, bulkhead, and load shedding metrics monitored with alerts</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://github.com/Netflix/Hystrix" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netflix Hystrix — Circuit Breaker Library
            </a>
          </li>
          <li>
            <a href="https://martinfowler.com/bliki/CircuitBreaker.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Martin Fowler — Circuit Breaker Pattern
            </a>
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_mitigation-interaction-failure.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS Well-Architected — Load Shedding and Graceful Degradation
            </a>
          </li>
          <li>
            <a href="https://netflixtechblog.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Netflix Tech Blog — Traffic Management and Chaos Engineering
            </a>
          </li>
          <li>
            <a href="https://engineering.twitter.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Twitter Engineering — Graceful Degradation at Scale
            </a>
          </li>
          <li>
            <a href="https://www.usenix.org/system/files/login-logout_1305_bettis.pdf" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              USENIX — Traffic Management Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
