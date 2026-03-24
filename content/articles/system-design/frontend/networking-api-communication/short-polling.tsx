"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-short-polling-concise",
  title: "Short Polling",
  description:
    "Comprehensive guide to short polling covering interval-based HTTP requests, polling optimization, adaptive intervals, and when short polling is the pragmatic choice over WebSockets.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "short-polling",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: ["frontend", "polling", "HTTP", "real-time", "setInterval", "adaptive"],
  relatedTopics: [
    "long-polling",
    "server-sent-events",
    "websockets",
    "request-batching",
  ],
};

export default function ShortPollingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Short Polling</strong> is a client-server communication
          pattern where the client repeatedly sends HTTP requests to the server
          at fixed (or adaptive) intervals, asking "do you have new data?" The
          server responds immediately with either new data or an empty/unchanged
          response, and the connection closes. The client waits for the next
          interval tick, then repeats.
        </p>
        <p>
          Short polling is the oldest and simplest approach to achieving
          near-real-time updates over HTTP. Before WebSockets were standardized
          in 2011 (RFC 6455), and before Server-Sent Events gained browser
          support, short polling was the default technique for any application
          that needed to reflect server-side changes in the browser. Early
          webmail clients, stock tickers, and chat applications all relied on
          it. The XMLHttpRequest object, introduced in Internet Explorer 5
          (1999) and later standardized, made this pattern possible without full
          page reloads.
        </p>
        <p>
          At a staff or principal engineer level, the important question is not
          whether short polling is "good" or "bad" but when it is the correct
          architectural choice. Short polling persists in modern systems for
          compelling reasons. First, it is entirely stateless on the server
          side: each request is independent, meaning any server behind a load
          balancer can handle any poll. There is no connection affinity, no
          sticky session requirement, and no in-memory subscription state.
          Second, it works universally, passing through every proxy, firewall,
          CDN, and corporate network filter without issue because it uses
          standard HTTP request-response semantics. Third, it has predictable
          resource consumption: you can calculate exactly how many requests per
          second N clients will generate with interval I (N/I requests per
          second), making capacity planning straightforward.
        </p>
        <p>
          The hidden cost of short polling is waste. If the data changes once
          per minute but the client polls every 3 seconds, 19 out of 20 requests
          return no new information. Each wasted request consumes server CPU
          (parsing headers, routing, serializing response), network bandwidth
          (TCP handshake, TLS negotiation if not using keep-alive, HTTP
          headers), and client battery life on mobile devices. The art of short
          polling, and what separates a naive implementation from a
          production-grade one, lies in minimizing this waste through adaptive
          intervals, conditional requests, and intelligent backoff strategies.
        </p>
        <p>
          Short polling is the right choice when: the update frequency is
          genuinely low (once every 30 seconds or more), the infrastructure
          cannot support persistent connections (serverless functions with
          execution time limits, legacy proxies), the client base is small
          enough that aggregate request volume is acceptable, or the simplicity
          of implementation outweighs the marginal latency improvement of more
          sophisticated approaches. A dashboard that refreshes sales figures
          every 60 seconds for 50 internal users does not need WebSockets.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Effective short polling implementations rely on several techniques
          that transform a naive setInterval loop into a robust,
          resource-efficient data synchronization mechanism:
        </p>
        <ul>
          <li>
            <strong>Fixed Interval Polling:</strong> The baseline approach where
            the client sends a request every N milliseconds using setInterval or
            setTimeout chains. The key distinction between setInterval and
            recursive setTimeout matters: setInterval fires regardless of
            whether the previous request completed, potentially stacking
            requests during slow network conditions. Recursive setTimeout (where
            you schedule the next poll only after the current response arrives)
            guarantees sequential execution and naturally adapts to network
            latency. Production implementations should always use recursive
            setTimeout. The interval value is a trade-off between freshness and
            load: 1 second gives near-real-time at high cost, 60 seconds is
            gentle but stale.
          </li>
          <li>
            <strong>Adaptive Interval:</strong> Instead of a fixed interval, the
            client dynamically adjusts the polling frequency based on observed
            activity. When the server returns new data, the client shortens the
            interval (e.g., from 10 seconds to 2 seconds) because more changes
            may be coming. When several consecutive polls return no changes, the
            client lengthens the interval (e.g., from 2 seconds back to 10, then
            30, up to a maximum). This is sometimes called "frequency scaling"
            and dramatically reduces waste during idle periods while maintaining
            responsiveness during active periods. The algorithm typically uses a
            multiplier: on empty response, multiply interval by 1.5 (up to max);
            on data, reset to minimum.
          </li>
          <li>
            <strong>Conditional Requests with ETags:</strong> HTTP provides
            built-in mechanisms to avoid transferring unchanged data. The server
            includes an ETag header (a hash or version identifier) in its
            response. On subsequent polls, the client sends this value in an
            If-None-Match header. If the data has not changed, the server
            returns 304 Not Modified with no body, saving bandwidth and
            serialization cost. Similarly, Last-Modified and If-Modified-Since
            headers work for timestamp-based conditional requests. At scale,
            this optimization is significant: a 304 response is typically
            200-300 bytes versus potentially kilobytes of JSON payload.
          </li>
          <li>
            <strong>Visibility-Based Polling:</strong> When a browser tab is not
            visible (the user has switched to another tab or minimized the
            window), there is no reason to continue polling at full frequency.
            The Page Visibility API (document.visibilityState and the
            visibilitychange event) allows the client to pause polling entirely
            or reduce it to a very low frequency when the tab is hidden, then
            resume immediately when the tab becomes visible again. This
            optimization is critical for mobile devices where background tabs
            drain battery, and for reducing aggregate server load when users
            have multiple tabs open.
          </li>
          <li>
            <strong>Exponential Backoff on Error:</strong> When a poll fails
            (network error, server 500, timeout), the client should not
            immediately retry at the normal interval. Instead, it implements
            exponential backoff: wait 1 second, then 2, then 4, then 8, up to a
            maximum (typically 60 seconds), with optional jitter (random
            additional delay). This prevents a thundering herd problem where
            hundreds of clients simultaneously retry against a recovering
            server, potentially causing it to fail again. Jitter is particularly
            important in distributed systems: without it, clients that started
            polling at similar times will synchronize their retries.
          </li>
          <li>
            <strong>Request Deduplication:</strong> In complex applications,
            multiple components may independently want to poll the same
            endpoint. Without coordination, this creates redundant requests. A
            request deduplication layer (often implemented as a singleton
            polling manager or a shared hook with reference counting) ensures
            that only one request is in flight per unique endpoint at any time.
            When multiple consumers subscribe, the manager shares the single
            response with all of them. Libraries like SWR and React Query
            implement this pattern automatically with their polling
            (refetchInterval) features.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          The short polling lifecycle follows a predictable request-response
          cycle. The client initiates a timer, sends an HTTP request when the
          timer fires, processes the response, and schedules the next request.
          The critical architectural consideration is that each request is
          completely independent and stateless, which makes short polling
          inherently compatible with horizontally scaled server architectures.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/short-polling-flow.svg"
          alt="Short Polling Flow Timeline"
          caption="Short polling timeline showing fixed-interval requests. Gray responses indicate no new data (304 Not Modified), while green responses contain updated data. Notice that most requests are wasted during idle periods."
        />

        <p>
          The diagram above illustrates the fundamental inefficiency of naive
          short polling: the client sends requests at a fixed interval
          regardless of whether the server has new data. In this example, only 2
          out of 7 requests return actual data, meaning roughly 70% of requests
          are wasted. This is where adaptive intervals become essential for
          production deployments.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/short-polling-adaptive.svg"
          alt="Adaptive Short Polling Interval Diagram"
          caption="Adaptive interval short polling: the interval increases during idle periods (1s to 2s to 4s to 5s max) and resets to 1s when activity is detected, dramatically reducing wasted requests."
        />

        <p>
          With adaptive intervals, the same scenario results in far fewer wasted
          requests. During idle periods, the interval grows exponentially (or
          linearly, depending on the strategy), and it snaps back to the minimum
          when the server returns new data. The trade-off is slightly higher
          latency during the transition from idle to active: if the interval has
          grown to 5 seconds, the client may miss up to 5 seconds of freshness
          compared to a fixed 1-second interval. In practice, this is acceptable
          for most use cases because human perception of "real-time" is
          forgiving up to about 3-5 seconds for non-interactive data.
        </p>

        <p>
          From the server's perspective, the architecture is remarkably simple.
          Each poll is a standard GET request handled by the existing HTTP
          infrastructure. The server checks for new data (typically by querying
          a database with a "since" timestamp or comparing versions), serializes
          the response, and returns. There is no need for pub/sub
          infrastructure, no WebSocket upgrade handling, no connection state
          management. This simplicity is short polling's greatest architectural
          advantage, and it explains why it remains the default choice in many
          serverless and edge-function deployments where persistent connections
          are either impossible or prohibitively expensive.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <p>
          Understanding where short polling fits among real-time communication
          patterns requires an honest assessment of its strengths and weaknesses
          relative to alternatives:
        </p>
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
                <strong>Latency</strong>
              </td>
              <td className="p-3">
                Predictable maximum latency equal to the polling interval
              </td>
              <td className="p-3">
                Average latency is half the interval; cannot achieve sub-second
                updates without extreme server load
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Server Load</strong>
              </td>
              <td className="p-3">
                Stateless requests, no connection memory; each request is
                independent and can be load-balanced trivially
              </td>
              <td className="p-3">
                High request volume even when no data changes; N clients with
                interval I generate N/I requests/second continuously
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Complexity</strong>
              </td>
              <td className="p-3">
                Simplest implementation of any real-time pattern; uses standard
                HTTP, no special server infrastructure
              </td>
              <td className="p-3">
                Adaptive intervals, backoff, deduplication, and visibility
                handling add significant complexity to do it well
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Scalability</strong>
              </td>
              <td className="p-3">
                Works with any HTTP server, CDN, or edge function; no sticky
                sessions required
              </td>
              <td className="p-3">
                Request volume scales linearly with clients; 100K users polling
                every 5s = 20K requests/second
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Network Efficiency</strong>
              </td>
              <td className="p-3">
                Conditional requests (ETags, 304) reduce payload waste
              </td>
              <td className="p-3">
                HTTP header overhead on every request (~500 bytes minimum); TLS
                handshake cost without keep-alive
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/polling-comparison.svg"
          alt="Polling Pattern Comparison Matrix"
          caption="Comparison of real-time communication patterns across key dimensions: latency, server load, implementation complexity, browser support, and proxy/firewall compatibility."
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Building production-grade short polling requires attention to details
          that are often overlooked in tutorials:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Use Recursive setTimeout, Not setInterval:</strong> Always
            schedule the next poll after the current response completes.
            setInterval can stack requests if a response is slow, creating
            cascading failures. Recursive setTimeout ensures sequential
            execution and naturally incorporates network latency into the
            effective interval.
          </li>
          <li>
            <strong>Implement Conditional Requests:</strong> Always use ETags or
            Last-Modified headers to avoid re-transferring unchanged data. This
            reduces bandwidth by 80-95% in typical scenarios where most polls
            return no changes. The server should return 304 Not Modified with no
            body when data has not changed.
          </li>
          <li>
            <strong>Add Exponential Backoff with Jitter:</strong> On error, do
            not retry at the normal interval. Use exponential backoff (2^attempt
            * base, capped at max) with random jitter (0 to 1 second added).
            Jitter prevents synchronized retries from multiple clients
            overwhelming a recovering server.
          </li>
          <li>
            <strong>Respect Page Visibility:</strong> Stop or dramatically
            reduce polling when the tab is hidden. Resume immediately when
            visibility is restored. This is especially critical for mobile
            browsers where background activity drains battery and may be
            throttled by the OS.
          </li>
          <li>
            <strong>Use Adaptive Intervals:</strong> Start with an aggressive
            interval when the user first loads the page (expecting interaction),
            then gradually increase the interval if no changes are detected.
            Reset to the minimum interval when data changes or the user performs
            an action that might trigger server-side updates.
          </li>
          <li>
            <strong>Deduplicate Requests:</strong> If multiple components need
            the same polled data, centralize the polling in a shared manager,
            hook, or state management layer. Use libraries like React Query or
            SWR that handle deduplication automatically when multiple components
            use the same query key with refetchInterval.
          </li>
          <li>
            <strong>Set Appropriate Timeouts:</strong> Each poll request should
            have a timeout shorter than the polling interval. If the interval is
            5 seconds, set a request timeout of 4 seconds. A hanging request
            should not prevent the next poll from firing. AbortController makes
            this straightforward in modern browsers.
          </li>
          <li>
            <strong>Monitor and Alert on Poll Volume:</strong> Track the
            aggregate request rate from polling endpoints in your server
            metrics. Set alerts for unexpected spikes that could indicate a bug
            (e.g., polling interval accidentally set to 100ms) or a traffic
            surge. Include the polling interval in request headers or query
            parameters so the server can log and analyze polling behavior.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These are the mistakes that most commonly cause short polling
          implementations to degrade performance or reliability:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Polling Without Cleanup:</strong> Forgetting to clear the
            timeout/interval when the component unmounts or the user navigates
            away. This creates "zombie" pollers that continue firing requests in
            the background, wasting resources and potentially causing state
            updates on unmounted components. Always return a cleanup function
            from useEffect.
          </li>
          <li>
            <strong>Fixed Interval Too Aggressive:</strong> Setting a 1-second
            interval "just in case" when the actual data changes once per
            minute. This wastes 59 out of 60 requests. Start with the longest
            acceptable interval and only decrease if freshness requirements
            demand it. Calculate the aggregate load: 10,000 users at 1-second
            intervals means 10,000 requests per second.
          </li>
          <li>
            <strong>No Error Handling or Backoff:</strong> Continuing to poll at
            the normal rate when the server is returning 500 errors. Without
            backoff, a struggling server faces the same request volume from
            polling clients plus the additional load of processing error
            responses, making recovery harder.
          </li>
          <li>
            <strong>Ignoring HTTP Caching:</strong> Not implementing conditional
            requests, meaning every poll transfers the full payload even when
            nothing changed. This wastes bandwidth and server CPU for
            serialization. ETags and 304 responses are trivial to implement and
            provide enormous savings.
          </li>
          <li>
            <strong>Polling in Background Tabs:</strong> Not pausing polling
            when the page is hidden. A user with 10 tabs open, each polling
            every 5 seconds, generates 2 requests per second from tabs they are
            not even looking at. This drains mobile battery and wastes server
            resources.
          </li>
          <li>
            <strong>Race Conditions with Stale Closures:</strong> In React,
            using stale state values inside polling callbacks because the
            closure captured an old render's state. This leads to sending
            outdated parameters in poll requests or overwriting newer data with
            older data. Use refs to hold the latest values or leverage React
            Query's built-in state management.
          </li>
          <li>
            <strong>No Request Cancellation:</strong> Not aborting in-flight
            requests when the component unmounts or when a new poll fires before
            the previous one completes. This can cause responses to arrive out
            of order, applying an older response after a newer one. Use
            AbortController to cancel stale requests.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Short polling remains the pragmatic choice in several well-defined
          scenarios:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Dashboard Metrics and KPIs:</strong> Internal dashboards
            displaying sales figures, system health, or business metrics that
            update every 30-60 seconds. The low update frequency and small user
            base make short polling the simplest correct solution. Examples:
            Grafana dashboard panels, admin sales dashboards.
          </li>
          <li>
            <strong>Serverless and Edge Function Environments:</strong>{" "}
            Platforms like AWS Lambda, Vercel Edge Functions, or Cloudflare
            Workers have execution time limits (typically 10-30 seconds) that
            make persistent connections impossible. Short polling is the only
            viable pattern for near-real-time updates in these environments.
          </li>
          <li>
            <strong>Job Status Checking:</strong> Monitoring the status of a
            long-running background job (file processing, report generation,
            deployment pipeline) where the client polls a status endpoint until
            the job completes. This is inherently low-frequency and
            finite-duration, making short polling ideal.
          </li>
          <li>
            <strong>Third-Party API Integration:</strong> Consuming APIs from
            external services that only offer REST endpoints (no WebSocket or
            webhook support). Many payment processors, shipping APIs, and
            government services require polling to check transaction or
            application status.
          </li>
          <li>
            <strong>Feature Flag and Configuration Updates:</strong> Checking
            for updated feature flags, A/B test configurations, or remote config
            values. Services like LaunchDarkly use a combination of streaming
            and polling (as fallback), with polling intervals of 30 seconds or
            more being sufficient for configuration changes.
          </li>
          <li>
            <strong>Degraded Mode Fallback:</strong> As a fallback when
            WebSocket or SSE connections fail due to proxy issues, corporate
            firewalls, or unstable networks. The client detects the persistent
            connection failure and gracefully degrades to short polling,
            maintaining functionality at the cost of freshness.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use Short Polling</h3>
          <p>Avoid short polling for:</p>
          <ul className="mt-2 space-y-2">
            <li>- Chat applications requiring sub-second message delivery</li>
            <li>
              - Collaborative editing where multiple users see each other's
              changes in real-time
            </li>
            <li>
              - Live sports scores, financial tickers, or gaming where latency
              matters
            </li>
            <li>
              - High-scale consumer applications with millions of concurrent
              users (request volume becomes untenable)
            </li>
            <li>
              - Any scenario where the average data change frequency exceeds 1
              update per 5 seconds per client
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <p>
          Short polling has security considerations around abuse prevention.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Rate Limiting</h3>
          <ul className="space-y-2">
            <li>
              <strong>The Risk:</strong> Polling endpoints are vulnerable to abuse.
            </li>
            <li>
              <strong>Mitigation:</strong> Implement per-user rate limiting based on
              expected polling interval.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authentication</h3>
          <ul className="space-y-2">
            <li>
              <strong>Token-Based Auth:</strong> Authenticate each polling request.
            </li>
            <li>
              <strong>Per-Resource Authorization:</strong> Authorize each poll based
              on user permissions.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Performance Benchmarks</h2>
        <p>
          Understanding short polling performance characteristics.
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
                <td className="p-2">Request Latency</td>
                <td className="p-2">&lt;100ms</td>
                <td className="p-2">50-200ms</td>
              </tr>
              <tr>
                <td className="p-2">304 Response Rate</td>
                <td className="p-2">&gt;90%</td>
                <td className="p-2">80-95%</td>
              </tr>
              <tr>
                <td className="p-2">Data Freshness</td>
                <td className="p-2">≤ polling interval</td>
                <td className="p-2">5-30 seconds</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Real-World Benchmarks</h3>
          <ul className="space-y-2">
            <li>
              <strong>GitHub Status:</strong> 30s polling interval with CDN caching.
            </li>
            <li>
              <strong>Twitter (early):</strong> Used polling before switching to push.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Cost Analysis</h2>
        <p>
          Short polling has predictable costs but can become expensive at scale.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Infrastructure Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Server Resources:</strong> For 100K users at 10s interval:
              600,000 requests/minute.
            </li>
            <li>
              <strong>CDN Costs:</strong> CDN caching reduces origin load.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Development Costs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Initial Implementation:</strong> 1-2 weeks for basic polling.
            </li>
            <li>
              <strong>Ongoing Maintenance:</strong> 5% of engineering time.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">ROI Decision Framework</h3>
          <p>
            Use short polling when: update frequency is low (&lt;1/minute), user count
            is moderate, simplicity is priority. Use SSE when: you need sub-5s latency.
          </p>
        </div>
      </section>

      <section>
        <h2>Decision Framework: When to Use Short Polling</h2>
        <p>
          Use this decision framework to evaluate whether short polling is appropriate.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Decision Tree</h3>
          <ul className="space-y-2">
            <li>
              <strong>Is update frequency &lt;1/minute?</strong>
              <ul>
                <li>Yes → Short polling is efficient</li>
                <li>No → Consider SSE or WebSockets</li>
              </ul>
            </li>
            <li>
              <strong>Is 5-30s latency acceptable?</strong>
              <ul>
                <li>Yes → Short polling works</li>
                <li>No → Need push-based solution</li>
              </ul>
            </li>
            <li>
              <strong>Is simplicity a priority?</strong>
              <ul>
                <li>Yes → Short polling is simplest</li>
                <li>No → SSE/WebSocket complexity may be justified</li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Alternative Comparison</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Approach</th>
                <th className="p-2 text-left">Latency</th>
                <th className="p-2 text-left">Server Load</th>
                <th className="p-2 text-left">Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Short Polling</td>
                <td className="p-2">5-30s</td>
                <td className="p-2">High</td>
                <td className="p-2">Lowest</td>
              </tr>
              <tr>
                <td className="p-2">Long Polling</td>
                <td className="p-2">&lt;5s</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Low</td>
              </tr>
              <tr>
                <td className="p-2">SSE</td>
                <td className="p-2">&lt;1s</td>
                <td className="p-2">Low</td>
                <td className="p-2">Low</td>
              </tr>
              <tr>
                <td className="p-2">WebSocket</td>
                <td className="p-2">&lt;100ms</td>
                <td className="p-2">Low</td>
                <td className="p-2">High</td>
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
              Q: You have 100,000 users on a dashboard that needs updates every
              10 seconds. Why might short polling be problematic, and how would
              you mitigate it?
            </p>
            <p className="mt-2 text-sm">
              A: 100K users polling every 10 seconds generates 10,000 requests
              per second continuously. This is substantial but manageable with
              optimization. First, implement conditional requests (ETags) so 95%
              of responses are 304s with minimal payload. Second, add jitter to
              the interval (each client polls at 10s plus or minus 2s randomly)
              to smooth the request distribution. Third, use adaptive intervals:
              increase to 30s when no changes detected, reset to 10s on change.
              Fourth, leverage CDN edge caching with a 5-second TTL, so the
              origin only serves one request per 5 seconds per edge location.
              For truly high scale, consider Server-Sent Events or WebSockets
              with a pub/sub backend, but the cost is significantly higher
              infrastructure complexity and the loss of stateless simplicity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement graceful degradation from WebSockets to
              short polling?
            </p>
            <p className="mt-2 text-sm">
              A: The transport layer should be abstracted behind a common
              interface that exposes subscribe/unsubscribe and emits data
              events. On initialization, attempt a WebSocket connection with a
              timeout (e.g., 5 seconds). If the connection fails or is blocked
              (common in corporate networks), fall back to long polling. If long
              polling also fails (some proxies buffer responses), fall back to
              short polling. Socket.IO implements exactly this strategy with its
              transport negotiation. The key is that the application code should
              not know or care which transport is active. Store the current
              transport type for observability and surface it in developer tools
              so issues can be diagnosed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between setInterval-based polling and
              recursive setTimeout polling? Why does it matter?
            </p>
            <p className="mt-2 text-sm">
              A: setInterval fires the callback at fixed intervals regardless of
              whether the previous execution completed. If a poll request takes
              3 seconds and the interval is 2 seconds, requests stack up.
              Recursive setTimeout schedules the next poll only after the
              current one completes, guaranteeing sequential execution. This
              matters because stacked requests can overwhelm the server, cause
              out-of-order responses, and consume all available browser
              connections (typically 6 per domain). Recursive setTimeout also
              naturally absorbs network latency: if the interval is 5 seconds
              and the request takes 1 second, the effective period is 6 seconds,
              which is self-regulating under load.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Page Visibility API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - HTTP Conditional Requests (ETags, 304)
            </a>
          </li>
          <li>
            <a
              href="https://swr.vercel.app/docs/revalidation#revalidate-on-interval"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SWR Documentation - Revalidate on Interval (Polling)
            </a>
          </li>
          <li>
            <a
              href="https://tanstack.com/query/latest/docs/framework/react/guides/polling"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              TanStack Query - Polling with refetchInterval
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS Architecture Blog - Exponential Backoff and Jitter
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
