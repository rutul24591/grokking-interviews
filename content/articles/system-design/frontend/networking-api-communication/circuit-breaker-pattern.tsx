"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-circuit-breaker-pattern",
  title: "Circuit Breaker Pattern",
  description:
    "Deep dive into the circuit breaker pattern for frontend applications covering state machine (closed/open/half-open), failure thresholds, fallback strategies, and protecting UX during backend outages.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "circuit-breaker-pattern",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "frontend",
    "circuit-breaker",
    "resilience",
    "fault-tolerance",
    "error-handling",
    "fallback",
  ],
  relatedTopics: [
    "retry-logic-and-exponential-backoff",
    "api-rate-limiting",
    "request-queuing",
    "request-cancellation",
  ],
};

export default function CircuitBreakerPatternConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          The <strong>circuit breaker pattern</strong> is a stability pattern
          that prevents an application from repeatedly attempting operations
          that are likely to fail. Named after the electrical circuit breaker
          that trips to prevent damage from overcurrent, the software circuit
          breaker monitors failures to an external service and, after a
          threshold is exceeded, "opens" the circuit -- immediately failing all
          subsequent requests without actually making the network call. After a
          recovery timeout, it enters a "half-open" state to probe whether the
          service has recovered.
        </p>
        <p>
          Michael Nygard introduced this pattern in his 2007 book "Release It!"
          as one of several stability patterns for production systems. It gained
          widespread adoption when Netflix implemented it in their Hystrix
          library (2012), demonstrating how circuit breakers could prevent
          cascading failures across their microservice architecture. Although
          Hystrix was a server-side Java library, the pattern translates
          directly to frontend applications -- and arguably matters even more on
          the client side, where resources (battery, bandwidth, CPU) are more
          constrained and user experience is the primary concern.
        </p>
        <p>
          At the staff/principal level, the circuit breaker's value lies in its
          role as a <strong>system-level resilience mechanism</strong> that
          complements per-request retry logic. While retries handle transient
          failures (a single dropped connection, a momentary 503), circuit
          breakers handle sustained failures (a service is down for minutes or
          hours). Without circuit breakers, retry logic becomes the problem:
          every request to a down service exhausts its retry budget, consuming
          bandwidth, draining battery on mobile devices, and keeping the UI in a
          perpetual loading state. The circuit breaker short-circuits this by
          recognizing the pattern of failure and failing fast, allowing the
          application to show cached data or degraded UI immediately rather than
          waiting through futile retry cycles.
        </p>
        <p>
          In the frontend context, circuit breakers also enable sophisticated
          fallback strategies. When the recommendations API is down, show
          popular items from cache. When the search service is unavailable, fall
          back to client-side filtering. When the real-time notification service
          fails, switch to polling. These degraded experiences are far better
          than error screens, and circuit breakers provide the state machine
          that determines when to use them.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          The circuit breaker pattern is built on six foundational concepts that
          govern its behavior:
        </p>
        <ul>
          <li>
            <strong>Three States (Closed, Open, Half-Open):</strong> The circuit
            breaker is a finite state machine with three states.{" "}
            <strong>Closed</strong> is the normal operating state where all
            requests pass through to the service; the breaker monitors failures
            but does not intervene.
            <strong>Open</strong> is the tripped state where all requests fail
            immediately without making network calls; the breaker returns a
            fallback response or a predetermined error.{" "}
            <strong>Half-Open</strong>
            is the recovery probe state where a limited number of requests
            (typically one) are allowed through to test if the service has
            recovered. If the probe succeeds, the breaker transitions to Closed;
            if it fails, it returns to Open. The naming convention follows the
            electrical metaphor: a closed circuit allows current (requests) to
            flow, an open circuit blocks it.
          </li>
          <li>
            <strong>Failure Threshold:</strong> The condition that triggers the
            transition from Closed to Open. This is typically expressed as "N
            failures within a time window" -- for example, 5 consecutive
            failures, or a 50% failure rate over the last 30 seconds. The
            threshold must balance sensitivity against false positives: too
            sensitive (2 failures triggers open) and transient glitches
            unnecessarily trip the breaker; too insensitive (50 failures) and
            the application hammers a clearly down service for an extended
            period before protecting itself. The right threshold depends on the
            endpoint's normal error rate, traffic volume, and criticality.
          </li>
          <li>
            <strong>Recovery Timeout:</strong> The duration the circuit remains
            Open before transitioning to Half-Open. This gives the failing
            service time to recover before the breaker probes it again. Typical
            values range from 10 to 60 seconds. Shorter timeouts allow faster
            recovery detection but risk re-tripping immediately if the service
            is still down. Longer timeouts provide more recovery time but delay
            the return to normal operation. Some implementations use adaptive
            timeouts that increase with each consecutive trip (similar to
            exponential backoff), recognizing that a service failing repeatedly
            needs progressively more recovery time.
          </li>
          <li>
            <strong>Fallback Strategy:</strong> The alternative behavior when
            the circuit is Open. This is where the circuit breaker pattern
            becomes a UX pattern, not just a reliability pattern. Common
            fallback strategies include: returning cached data (last successful
            response), showing a degraded UI (static content instead of
            personalized), returning default values (empty recommendation list
            rather than an error), switching to a backup service (secondary API
            or CDN-hosted data), and queuing the operation for later
            (offline-first pattern). The choice of fallback determines whether
            an outage is invisible to users or results in error screens.
          </li>
          <li>
            <strong>Sliding Window (Time-Based vs. Count-Based):</strong> The
            failure tracking mechanism that feeds the threshold decision.{" "}
            <strong>Count-based windows</strong> track the last N requests
            regardless of when they occurred -- simple to implement but can be
            misleading when traffic varies (10 failures out of 10 requests in 1
            second is very different from 10 failures out of 10 requests over 10
            minutes). <strong>Time-based windows</strong> track all requests
            within the last T seconds, providing a more accurate failure rate
            but requiring more memory and computation. The sliding window
            approach (vs. fixed buckets) avoids the boundary problem where
            failures straddling two buckets are never counted together,
            potentially missing a clear degradation signal.
          </li>
          <li>
            <strong>Per-Endpoint Breakers:</strong> A single global circuit
            breaker is almost never correct. If the payment API fails, you
            should not stop calling the user profile API. Each endpoint (or
            logical service group) should have its own circuit breaker with
            thresholds appropriate to its characteristics. A real-time search
            API might tolerate 2 failures before tripping (fast fail, show
            cached results), while a batch sync endpoint might tolerate 10
            failures (background operation, less urgent). The breaker registry
            is typically a map from endpoint key to breaker instance, created
            lazily on first request to each endpoint.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The circuit breaker sits as a proxy layer between the application and
          the network client, wrapping all outbound requests. Its position in
          the request pipeline is critical: it must sit outside the retry layer
          so that retries are also subject to circuit breaker state. If the
          circuit is open, retries should not be attempted at all.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/circuit-breaker-states.svg"
          alt="Circuit Breaker State Machine"
          caption="Circuit breaker state machine showing transitions: Closed (normal) to Open (failures exceed threshold), Open to Half-Open (timeout expires), Half-Open to Closed (probe succeeds) or back to Open (probe fails)"
        />

        <p>
          The state machine transitions are driven by request outcomes. In the
          Closed state, every response is evaluated: successes decrement or
          reset the failure counter, failures increment it. When the failure
          threshold is breached, the breaker transitions to Open, recording the
          timestamp. In the Open state, a timer checks whether the recovery
          timeout has elapsed; if so, it transitions to Half-Open. In Half-Open,
          the outcome of the probe request determines the next state: success
          returns to Closed (resetting all counters), failure returns to Open
          (resetting the recovery timer).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/circuit-breaker-flow.svg"
          alt="Circuit Breaker Request Flow"
          caption="Request flow through a circuit breaker: Closed state forwards requests, Open state returns fallback immediately, Half-Open state sends a single probe to test recovery"
        />

        <p>
          In a frontend architecture, the circuit breaker registry is typically
          a singleton service that manages breaker instances for each endpoint.
          The HTTP client (Axios, fetch wrapper) consults the registry before
          making requests. When integrating with React Query or SWR, the circuit
          breaker wraps the query function itself, meaning the caching layer
          sees circuit breaker fallback responses as successful (cacheable)
          results, allowing cached data to serve while the circuit is open.
        </p>
        <p>
          The integration between circuit breakers and retry logic follows a
          clear hierarchy: the circuit breaker is the outer layer, retry logic
          is the inner layer. A request first checks the circuit state. If
          Closed, it proceeds to the retry-enabled fetch. If the fetch fails and
          retries are exhausted, the failure is reported to the circuit breaker.
          If the circuit trips, subsequent requests bypass the retry layer
          entirely. This layering ensures that retry budgets are not wasted on
          endpoints that are clearly unavailable.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Fail-Fast Behavior</strong>
              </td>
              <td className="p-3">
                {"•"} Eliminates latency from futile requests to down services
                <br />
                {"•"} Preserves bandwidth and battery on mobile
                <br />
                {"•"} Frees up connection pool slots
              </td>
              <td className="p-3">
                {"•"} May reject requests during brief, recoverable glitches
                <br />
                {"•"} Over-aggressive thresholds cause unnecessary fallbacks
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Fallback Quality</strong>
              </td>
              <td className="p-3">
                {"•"} Users see cached/degraded content instead of errors
                <br />
                {"•"} Application remains partially functional during outages
                <br />
                {"•"} Enables graceful degradation patterns
              </td>
              <td className="p-3">
                {"•"} Stale data may mislead users (prices, availability)
                <br />
                {"•"} Complex fallback logic increases codebase complexity
                <br />
                {"•"} Fallbacks must be tested and maintained separately
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Recovery Detection</strong>
              </td>
              <td className="p-3">
                {"•"} Half-open probe automatically detects recovery
                <br />
                {"•"} No manual intervention needed to restore service
                <br />
                {"•"} Adaptive timeouts improve recovery speed
              </td>
              <td className="p-3">
                {"•"} Single probe request may not reflect service health
                <br />
                {"•"} Recovery timeout too long delays return to normal
                <br />
                {"•"} Half-open probe may succeed then service fails again
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Complexity</strong>
              </td>
              <td className="p-3">
                {"•"} Well-defined state machine is easy to reason about
                <br />
                {"•"} Clear separation of failure detection and response
                <br />
                {"•"} Composable with retry logic and request queuing
              </td>
              <td className="p-3">
                {"•"} Per-endpoint configuration requires tuning
                <br />
                {"•"} State synchronization across tabs is non-trivial
                <br />
                {"•"} Testing all state transitions requires careful setup
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/circuit-breaker-timeline.svg"
          alt="Circuit Breaker Behavior Timeline"
          caption="Timeline showing circuit breaker behavior: normal operation, failure accumulation, circuit opens (fail-fast), recovery timeout, half-open probe, and circuit closes"
        />

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            Circuit Breaker vs. Retry Logic
          </h3>
          <p>
            These patterns are complementary, not competing. Retry logic handles{" "}
            <strong>transient failures</strong>
            (a single dropped packet, a momentary 503 during deployment).
            Circuit breakers handle <strong>sustained failures</strong> (a
            service is down for minutes). Without circuit breakers, retry logic
            amplifies problems during outages. Without retry logic, circuit
            breakers trip on single transient errors. The canonical architecture
            layers them: circuit breaker on the outside, retry logic on the
            inside. Retries resolve most issues silently; when retries
            consistently fail, the circuit breaker activates to protect the
            system.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          These practices are essential for production-grade circuit breaker
          implementations:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>
              Use per-endpoint breakers with appropriate thresholds:
            </strong>{" "}
            A single global breaker means one failing endpoint disables all API
            communication. Create separate breaker instances per endpoint or
            service group. Tune thresholds based on each endpoint's normal error
            rate, traffic volume, and criticality. A search endpoint might trip
            after 3 failures (user-facing, latency-sensitive), while a logging
            endpoint might tolerate 20 failures (background, non-critical).
          </li>
          <li>
            <strong>
              Design meaningful fallbacks for every protected endpoint:
            </strong>{" "}
            A circuit breaker that returns a generic error when open provides
            little value. For each endpoint, define what degraded experience
            makes sense: cached data, default values, simplified UI, or an
            honest "temporarily unavailable" message. The fallback is where the
            user experience value of circuit breakers lives.
          </li>
          <li>
            <strong>
              Use time-based sliding windows for failure tracking:
            </strong>{" "}
            Count-based windows (last N requests) are simpler but can be
            misleading when traffic varies. Time-based windows (failures in the
            last 30 seconds) provide a consistent failure rate regardless of
            traffic volume, making thresholds more predictable and portable
            across endpoints with different request rates.
          </li>
          <li>
            <strong>Implement circuit breaker events for observability:</strong>{" "}
            Emit events when the breaker state changes (closed-to-open,
            open-to-half-open, half-open-to-closed). Log these events with
            endpoint, failure count, and timestamp. These events are critical
            for debugging production issues and understanding system behavior
            during incidents.
          </li>
          <li>
            <strong>Consider multi-tab state sharing:</strong> In a browser
            environment, each tab has its own circuit breaker instances. If one
            tab detects a service failure, other tabs continue hammering the
            failing service until they independently trip their own breakers.
            For critical applications, share circuit breaker state across tabs
            via BroadcastChannel API or SharedWorker, allowing one tab's failure
            detection to protect all tabs.
          </li>
          <li>
            <strong>Test the half-open to open transition:</strong> The most
            commonly neglected test case is the scenario where the half-open
            probe succeeds but the next few requests fail. Ensure the breaker
            properly re-trips rather than staying closed and sending traffic to
            a partially recovered service. Some implementations use a "success
            threshold" in half-open state (e.g., 3 consecutive successes before
            fully closing).
          </li>
          <li>
            <strong>Avoid circuit breaker thrashing:</strong> If the failure
            threshold is too low and the recovery timeout too short, the breaker
            will rapidly cycle between states
            (closed-open-half-open-closed-open), providing inconsistent
            behavior. Ensure thresholds and timeouts create stable state
            transitions. Monitor state change frequency and alert if a breaker
            is thrashing.
          </li>
          <li>
            <strong>Layer correctly with retry logic:</strong> The circuit
            breaker must wrap the retry layer, not the other way around. Check
            circuit state first, then retry within a closed circuit. When
            retries are exhausted, report the failure to the breaker. This
            prevents wasting retry budget on endpoints the breaker already knows
            are down.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These mistakes undermine circuit breaker effectiveness or create new
          problems:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Using a single global circuit breaker:</strong> When one
            endpoint fails, all API communication stops. This is like tripping
            the main breaker in your house because one outlet failed. Always use
            per-endpoint or per-service breakers so that a failing
            recommendations API does not prevent loading user profiles.
          </li>
          <li>
            <strong>No fallback strategy (just throwing errors):</strong> An
            open circuit breaker that throws an error is marginally better than
            no breaker at all (it saves network time), but the real value is in
            the fallback. If every open circuit results in an error screen,
            users experience the same disruption regardless of the breaker --
            you have just traded latency for correctness without improving UX.
          </li>
          <li>
            <strong>Setting thresholds without data:</strong> Arbitrary
            thresholds (5 failures, 30-second timeout) may not match actual
            failure patterns. Monitor your endpoints' normal error rates first.
            An endpoint with a 2% baseline error rate should not trip on 5
            errors in a high-traffic period -- that might be normal. Use
            percentile-based thresholds (trip when error rate exceeds 50%)
            rather than absolute counts for high-traffic endpoints.
          </li>
          <li>
            <strong>Not resetting failure counts on success:</strong> In the
            Closed state, successful requests should reset or decrement the
            failure counter. Without this, a slow accumulation of sporadic
            errors over hours can trip the breaker even though the service is
            functioning normally with a low error rate. Use sliding windows to
            naturally expire old failures.
          </li>
          <li>
            <strong>Forgetting to handle the open state in UI:</strong> The
            circuit breaker manages request flow, but the UI components must
            also respond to breaker state. If a component continues showing a
            loading spinner while the circuit is open (and the request
            immediately returned cached data), the UX is broken. Propagate
            breaker state to the UI layer so components can render appropriate
            fallback views.
          </li>
          <li>
            <strong>Testing only the happy path:</strong> Circuit breaker
            testing requires simulating sustained failures, verifying state
            transitions, testing fallback rendering, and confirming recovery
            behavior. Many teams test that the breaker works in isolation but
            never test the full lifecycle in integration: component renders with
            live data, service fails, component seamlessly switches to cached
            data, service recovers, component returns to live data.
          </li>
          <li>
            <strong>
              Ignoring circuit breaker state in server-side rendering:
            </strong>{" "}
            In Next.js or similar frameworks, circuit breaker state is
            per-request on the server and per-session in the browser. A
            server-side circuit breaker that trips will affect all users, not
            just one. Design server-side breakers with higher thresholds and
            ensure they do not block the critical rendering path.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Circuit breakers are deployed extensively in frontend applications at
          scale:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Netflix (Content Recommendations):</strong> When the
            recommendation service is slow or down, the circuit breaker trips
            and the frontend falls back to showing popular titles for the user's
            region, cached during the last successful fetch. Users see a less
            personalized but still functional browse experience. Netflix's
            client-side resilience layer manages dozens of circuit breakers for
            different microservices powering the UI.
          </li>
          <li>
            <strong>Amazon (Product Pages):</strong> Each section of a product
            page (reviews, recommendations, pricing, availability) has
            independent circuit breakers. If the reviews service is down, the
            product page still loads with pricing and description. The reviews
            section shows "Reviews temporarily unavailable" rather than blocking
            the entire page load.
          </li>
          <li>
            <strong>Slack (Real-Time Messaging):</strong> When the WebSocket
            connection fails repeatedly, a circuit breaker prevents reconnection
            storms. The client switches to a polling fallback and displays a
            "Connecting..." banner. Once the breaker enters half-open state and
            a reconnection succeeds, it seamlessly switches back to WebSocket.
          </li>
          <li>
            <strong>Google Maps (Tile Loading):</strong> When the tile server
            for a specific region fails, the circuit breaker for that region
            trips and the client falls back to lower-resolution cached tiles or
            satellite imagery from a different source. Other regions continue
            loading normally because breakers are per-region.
          </li>
          <li>
            <strong>Stripe Dashboard (Payment Analytics):</strong> The analytics
            service might be slow during high-traffic periods. A circuit breaker
            trips when response times consistently exceed thresholds (slow-call
            circuit breaker variant) and the dashboard shows the last cached
            analytics snapshot with a "Data may be delayed" indicator.
          </li>
          <li>
            <strong>E-Commerce Checkout (Payment Gateways):</strong> When the
            primary payment gateway circuit trips, the checkout flow
            automatically routes to a backup gateway. The circuit breaker
            enables transparent gateway failover without user intervention,
            maintaining conversion rates even during partial payment service
            outages.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            When NOT to Use Circuit Breakers
          </h3>
          <p>Circuit breakers add complexity that is not always justified:</p>
          <ul className="mt-2 space-y-2">
            <li>
              {"•"} Low-traffic internal tools -- manual retry is acceptable
            </li>
            <li>
              {"•"} Single-API applications -- if your only API is down, no
              fallback helps
            </li>
            <li>
              {"•"} Fire-and-forget operations (analytics) -- just queue and
              retry later
            </li>
            <li>
              {"•"} Operations where stale data is dangerous (financial
              transactions)
            </li>
            <li>
              {"•"} Prototyping and MVPs -- add resilience patterns when scale
              demands it
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <p>
          Circuit breakers introduce security considerations around fallback validation.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Fallback Security</h3>
          <ul className="space-y-2">
            <li>
              <strong>The Risk:</strong> Fallback data may be stale or incomplete.
            </li>
            <li>
              <strong>Mitigation:</strong> Label fallback data as "cached" or "unavailable".
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">State Management</h3>
          <ul className="space-y-2">
            <li>
              <strong>Circuit State Exposure:</strong> Don't expose detailed circuit state to users.
            </li>
            <li>
              <strong>State Tampering:</strong> Validate state on load if storing in localStorage.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <p>
          Understanding circuit breaker performance characteristics.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Industry Performance Data</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Metric</th>
                <th className="p-2 text-left">Target</th>
                <th className="p-2 text-left">Industry Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Failure Detection Time</td>
                <td className="p-2">&lt;30 seconds</td>
                <td className="p-2">20-60 seconds</td>
              </tr>
              <tr>
                <td className="p-2">Recovery Time</td>
                <td className="p-2">&lt;60 seconds</td>
                <td className="p-2">30-120 seconds</td>
              </tr>
              <tr>
                <td className="p-2">False Positive Rate</td>
                <td className="p-2">&lt;5%</td>
                <td className="p-2">2-10%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Real-World Benchmarks</h3>
          <ul className="space-y-2">
            <li>
              <strong>Netflix Hystrix:</strong> Trip time: 30 seconds. Recovery: 60 seconds.
            </li>
            <li>
              <strong>AWS SDK:</strong> Default: 5 failures in 30 seconds triggers open.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <p>
          Circuit breakers have development and infrastructure costs.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Infrastructure Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Monitoring:</strong> $100-500/month for monitoring at scale.
            </li>
            <li>
              <strong>Fallback Infrastructure:</strong> Cache servers or backup APIs.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Development Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Initial Implementation:</strong> 1-2 weeks for production-ready circuit breaker.
            </li>
            <li>
              <strong>Fallback Development:</strong> 1-2 days per endpoint.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">ROI Decision Framework</h3>
          <p>
            Use circuit breakers when: multiple service dependencies, cascading failures would be
            catastrophic. Use simple retry when: failures are transient, single dependency.
          </p>
        </div>
      </section>

      <section>
        <h2>Decision Framework: When to Use Circuit Breakers</h2>
        <p>
          Use this decision framework to evaluate whether circuit breakers are appropriate.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Decision Tree</h3>
          <ul className="space-y-2">
            <li>
              <strong>Do you have multiple service dependencies?</strong>
              <ul>
                <li>Yes → Circuit breaker is valuable</li>
                <li>No → Consider simple retry</li>
              </ul>
            </li>
            <li>
              <strong>Can you provide meaningful fallbacks?</strong>
              <ul>
                <li>Yes → Circuit breaker with fallback</li>
                <li>No → Circuit breaker with fail-fast</li>
              </ul>
            </li>
            <li>
              <strong>Would cascading failures be catastrophic?</strong>
              <ul>
                <li>Yes → Circuit breaker is critical</li>
                <li>No → Retry may be sufficient</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Resilience Pattern Comparison</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Pattern</th>
                <th className="p-2 text-left">Failure Type</th>
                <th className="p-2 text-left">Protection Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Retry</td>
                <td className="p-2">Transient failures</td>
                <td className="p-2">Individual requests</td>
              </tr>
              <tr>
                <td className="p-2">Circuit Breaker</td>
                <td className="p-2">Sustained failures</td>
                <td className="p-2">System-level</td>
              </tr>
              <tr>
                <td className="p-2">Timeout</td>
                <td className="p-2">Slow responses</td>
                <td className="p-2">Individual requests</td>
              </tr>
              <tr>
                <td className="p-2">Bulkhead</td>
                <td className="p-2">Resource exhaustion</td>
                <td className="p-2">Resource isolation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Explain the three states of a circuit breaker and when
              transitions occur.
            </p>
            <p className="mt-2 text-sm">
              A: <strong>Closed</strong> is the normal state where requests pass
              through. When failures exceed a threshold (e.g., 5 failures in 30
              seconds), the breaker transitions to <strong>Open</strong>, where
              all requests fail immediately without making network calls --
              returning fallback data instead. After a recovery timeout (e.g.,
              30 seconds), it transitions to <strong>Half-Open</strong>,
              allowing a single probe request through. If the probe succeeds,
              the breaker returns to Closed; if it fails, it returns to Open
              with a fresh recovery timeout. The key insight is that the breaker
              provides system-level protection that per-request timeouts cannot.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement a circuit breaker for a frontend
              application with multiple API endpoints?
            </p>
            <p className="mt-2 text-sm">
              A: Create a circuit breaker registry (a Map from endpoint key to
              breaker instance) that manages per-endpoint breakers. Each breaker
              has its own failure threshold, recovery timeout, and fallback
              strategy tuned to the endpoint's characteristics. The HTTP client
              consults the registry before each request. Critical endpoints
              (auth, checkout) get conservative thresholds with high-quality
              fallbacks. Non-critical endpoints (recommendations, analytics) get
              aggressive thresholds that trip quickly. The registry emits
              state-change events for observability, and breaker state can
              optionally be shared across browser tabs via BroadcastChannel.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the relationship between circuit breakers and retry
              logic?
            </p>
            <p className="mt-2 text-sm">
              A: They are complementary patterns that handle different failure
              modes. Retry logic handles transient failures (single timeout,
              brief 503) by re-attempting with exponential backoff. Circuit
              breakers handle sustained failures (service down for minutes) by
              failing fast after detecting a pattern. The correct architecture
              layers the circuit breaker outside the retry layer: check circuit
              state first, then retry within a closed circuit. When all retries
              fail, report to the circuit breaker. When the circuit opens, skip
              retries entirely. This prevents retry amplification during outages
              while still recovering from transient glitches silently.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle circuit breaker state synchronization across
              browser tabs?
            </p>
            <p className="mt-2 text-sm">
              A: Use the BroadcastChannel API to share circuit breaker state
              across tabs. When a breaker trips in one tab, broadcast the state
              change (endpoint, state, timestamp) to all other tabs. Each tab
              updates its local breaker state accordingly. This prevents the
              scenario where Tab A trips the breaker but Tabs B, C, D continue
              hammering the failing endpoint. For persistence across page
              reloads, store breaker state in localStorage with a TTL. The
              BroadcastChannel approach is lightweight and requires no
              server-side changes. For more complex scenarios, use a
              SharedWorker to centralize breaker state management.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What are appropriate fallback strategies for different types of
              endpoints?
            </p>
            <p className="mt-2 text-sm">
              A: Fallback strategies depend on endpoint criticality and data
              characteristics. For read endpoints: return cached data (last
              successful response), return stale data with a freshness warning,
              or return default/empty data (empty recommendation list). For
              write endpoints: queue the operation for later retry, return a
              user-facing message to retry later, or degrade gracefully (save
              locally, sync when available). For auth endpoints: no fallback —
              fail explicitly and redirect to login. For search endpoints:
              return cached results, switch to client-side filtering, or reduce
              result scope. The key is to design fallbacks during development,
              not as an afterthought during incidents.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you prevent circuit breaker thrashing (rapid state
              transitions)?
            </p>
            <p className="mt-2 text-sm">
              A: Thrashing occurs when the failure threshold is too low and the
              recovery timeout is too short, causing rapid Closed→Open→Half-Open→Closed→Open
              cycles. Prevent thrashing by: (1) Using a sliding window for
              failure counting instead of consecutive failures — this smooths
              out brief spikes. (2) Setting a minimum time in each state — e.g.,
              the breaker must stay Closed for at least 60 seconds before
              tripping again. (3) Using adaptive recovery timeouts — increase
              the timeout after each consecutive trip (similar to exponential
              backoff). (4) Requiring multiple successes in Half-Open before
              closing (e.g., 3 consecutive successes). (5) Monitoring state
              change frequency and alerting when it exceeds a threshold. The
              goal is stable state transitions, not oscillation.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://martinfowler.com/bliki/CircuitBreaker.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CircuitBreaker - Martin Fowler
            </a>
          </li>
          <li>
            <a
              href="https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Circuit Breaker Pattern - Microsoft Azure Architecture Patterns
            </a>
          </li>
          <li>
            <a
              href="https://netflixtechblog.com/making-the-netflix-api-more-resilient-a8ec62159c2d"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Making the Netflix API More Resilient - Netflix Tech Blog
            </a>
          </li>
          <li>
            <a
              href="https://pragprog.com/titles/mnee2/release-it-second-edition/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Release It! Second Edition - Michael Nygard (Pragmatic Bookshelf)
            </a>
          </li>
          <li>
            <a
              href="https://resilience4j.readme.io/docs/circuitbreaker"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CircuitBreaker - Resilience4j Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
