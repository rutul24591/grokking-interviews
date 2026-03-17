"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-traffic-management-load-shedding-extensive",
  title: "Traffic Management / Load Shedding",
  description: "Comprehensive guide to traffic management and load shedding, covering overload protection, request prioritization, rate limiting, and graceful degradation for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "traffic-management-load-shedding",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "traffic-management", "load-shedding", "overload", "rate-limiting", "resilience"],
  relatedTopics: ["rate-limiting-abuse-protection", "backpressure-handling", "fault-tolerance-resilience", "capacity-planning"],
};

export default function TrafficManagementLoadSheddingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Traffic Management</strong> controls how requests flow through a system.
          <strong>Load Shedding</strong> is the practice of rejecting requests when the system
          is overloaded to prevent collapse.
        </p>
        <p>
          Without load shedding:
        </p>
        <ul>
          <li>Queues grow unbounded.</li>
          <li>Memory exhausts.</li>
          <li>Latency spikes (fail slow).</li>
          <li>System becomes unresponsive.</li>
          <li>Cascading failures to dependencies.</li>
        </ul>
        <p>
          With load shedding:
        </p>
        <ul>
          <li>Excess requests rejected immediately.</li>
          <li>System stays responsive for accepted requests.</li>
          <li>Fast failure (503) instead of timeout.</li>
          <li>Graceful degradation.</li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Reject to Protect</h3>
          <p>
            It&apos;s better to reject some requests than to fail all requests. Load shedding is
            triage for your system — sacrifice the less critical to save the more critical.
          </p>
        </div>
      </section>

      <section>
        <h2>Load Shedding Patterns</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/traffic-management-load-shedding.svg"
          alt="Traffic Management and Load Shedding"
          caption="Traffic Management — showing load shedding pattern, priority levels, and overload protection strategies"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Request Prioritization</h3>
        <p>
          Classify requests by importance:
        </p>
        <ul>
          <li>
            <strong>Critical:</strong> Never shed (payments, authentication).
          </li>
          <li>
            <strong>High:</strong> Shed at 95% capacity.
          </li>
          <li>
            <strong>Medium:</strong> Shed at 85% capacity.
          </li>
          <li>
            <strong>Low:</strong> Shed at 75% capacity (analytics, logging).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Queue Limits</h3>
        <p>
          Bound queue sizes to prevent memory exhaustion:
        </p>
        <ul>
          <li>Set maximum queue depth.</li>
          <li>Reject when queue is full.</li>
          <li>Return 503 Service Unavailable.</li>
          <li>Include Retry-After header.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Admission Control</h3>
        <p>
          Limit concurrent requests:
        </p>
        <ul>
          <li>Set maximum concurrent requests.</li>
          <li>Reject requests above limit.</li>
          <li>Prevents resource exhaustion.</li>
          <li>Ensures accepted requests get resources.</li>
        </ul>
      </section>

      <section>
        <h2>Overload Protection Strategies</h2>
        <p>
          Multiple layers of protection:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rate Limiting</h3>
        <p>
          Prevent abuse and ensure fair allocation:
        </p>
        <ul>
          <li>Per-client limits.</li>
          <li>Always enforced (not just during overload).</li>
          <li>Prevents single client from overwhelming system.</li>
          <li>Return 429 Too Many Requests.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Circuit Breaker</h3>
        <p>
          Stop sending requests to failing services:
        </p>
        <ul>
          <li>Open circuit on high error rate.</li>
          <li>Fail fast instead of waiting for timeout.</li>
          <li>Prevents cascading failures.</li>
          <li>Auto-recovery after cooldown.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Timeouts</h3>
        <p>
          Fail fast on slow responses:
        </p>
        <ul>
          <li>Set aggressive timeouts.</li>
          <li>Better to fail fast than wait forever.</li>
          <li>Timeout should be based on SLA.</li>
          <li>Include retry budget.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backpressure</h3>
        <p>
          Signal upstream to slow down:
        </p>
        <ul>
          <li>Propagate congestion signal.</li>
          <li>Upstream reduces send rate.</li>
          <li>Prevents overwhelming downstream.</li>
          <li>Reactive Streams, HTTP/2 flow control.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Graceful Degradation</h3>
        <p>
          Disable non-critical features:
        </p>
        <ul>
          <li>Turn off recommendations, analytics.</li>
          <li>Focus on core functionality.</li>
          <li>Return cached/stale data.</li>
          <li>Read-only mode if writes overloaded.</li>
        </ul>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <p>
          Practical load shedding implementations:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Bucket with Priority</h3>
        <p>
          Combine rate limiting with prioritization:
        </p>
        <ul>
          <li>Maintain token bucket with capacity limit</li>
          <li>Critical requests always allowed (bypass bucket)</li>
          <li>Other requests consume tokens based on priority cost</li>
          <li>Low priority requests shed first when tokens exhausted</li>
          <li>Tokens refill at configured rate</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Queue-Based Shedding</h3>
        <p>
          Monitor queue depth, shed when full:
        </p>
        <ul>
          <li>Track queue depth continuously.</li>
          <li>Set thresholds (warning at 70%, shed at 90%).</li>
          <li>Shed lowest priority first.</li>
          <li>Alert when shedding begins.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Latency-Based Shedding</h3>
        <p>
          Shed when latency exceeds threshold:
        </p>
        <ul>
          <li>Monitor P99 latency.</li>
          <li>When P99 {'>'} threshold, start shedding.</li>
          <li>High latency indicates overload.</li>
          <li>Shedding reduces load, latency recovers.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Your service is receiving 10× normal traffic. How do you implement load shedding?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Immediate:</strong> Enable rate limiting at API gateway. Return 429 for excess requests.</li>
                <li><strong>Priority shedding:</strong> Drop low-priority requests first (analytics, recommendations). Protect critical paths (login, checkout).</li>
                <li><strong>Queue limits:</strong> Enforce queue bounds. Reject when queue full instead of queuing indefinitely.</li>
                <li><strong>Timeouts:</strong> Reduce timeouts to fail fast. Free up threads faster.</li>
                <li><strong>Circuit breakers:</strong> Open circuits for non-critical dependencies. Reduce load on self.</li>
                <li><strong>Auto-scaling:</strong> Trigger if not at max. But scaling takes minutes, shedding is immediate.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare rate limiting vs load shedding. When do you use each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Rate limiting:</strong> Preventive. Limit incoming traffic before overload. ✓ Predictable, fair. ✗ May limit legitimate traffic.</li>
                <li><strong>Load shedding:</strong> Reactive. Drop traffic when overloaded. ✓ Protects system, adaptive. ✗ Some requests fail.</li>
                <li><strong>Use rate limiting when:</strong> Prevent abuse, enforce quotas, predictable traffic management.</li>
                <li><strong>Use load shedding when:</strong> Unexpected traffic spikes, system already overloaded, need immediate protection.</li>
                <li><strong>Best practice:</strong> Both. Rate limiting at edge, load shedding at service level. Defense in depth.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. How do you prioritize requests for load shedding?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Critical (never shed):</strong> Authentication, payment processing, emergency operations.</li>
                <li><strong>High (shed at 90% capacity):</strong> Core business logic (checkout, order creation).</li>
                <li><strong>Medium (shed at 80% capacity):</strong> Non-critical features (recommendations, search).</li>
                <li><strong>Low (shed at 70% capacity):</strong> Analytics, logging, background tasks.</li>
                <li><strong>Implementation:</strong> Request headers indicate priority. Queue separately per priority. Shed low priority first.</li>
                <li><strong>Example:</strong> E-commerce during Black Friday. Checkout works, recommendations disabled.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Design overload protection for a payment processing system.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Rate limiting:</strong> Per-merchant limits. Prevent single merchant from overwhelming system.</li>
                <li><strong>Priority:</strong> Payment processing = highest priority. Never shed. Analytics = low priority, shed first.</li>
                <li><strong>Queues:</strong> Bounded queues for each priority. Separate queues for different payment methods.</li>
                <li><strong>Circuit breakers:</strong> For payment gateways. Open if gateway failing. Fail fast, retry later.</li>
                <li><strong>Graceful degradation:</strong> Queue payments for later processing if gateway overloaded. Return "processing" status.</li>
                <li><strong>Monitoring:</strong> Alert on queue depth, processing latency. Auto-shed when thresholds exceeded.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. How do you detect that your system is overloaded?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Queue depth:</strong> Growing queues = can&apos;t keep up. Alert when queue &gt; threshold.</li>
                <li><strong>Latency:</strong> P99 latency spike = overload. Alert when P99 &gt; 2× normal.</li>
                <li><strong>Error rate:</strong> Increased 5xx errors = overload. Alert when error rate &gt; 1%.</li>
                <li><strong>Resource utilization:</strong> CPU &gt; 80%, memory &gt; 90%, connection pool &gt; 90%.</li>
                <li><strong>Thread pool saturation:</strong> All threads busy, requests queuing. Alert when pool &gt; 90%.</li>
                <li><strong>Composite metrics:</strong> Combine multiple signals. Single metric can have false positives.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. What metrics do you monitor for traffic management?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Traffic:</strong> RPS, concurrent connections, request size.</li>
                <li><strong>Latency:</strong> P50, P95, P99 latency. Latency distribution over time.</li>
                <li><strong>Errors:</strong> Error rate, error types (4xx vs 5xx), error trends.</li>
                <li><strong>Queues:</strong> Queue depth, queue time, queue saturation.</li>
                <li><strong>Resources:</strong> CPU, memory, disk I/O, network I/O, connection pool usage.</li>
                <li><strong>Dependencies:</strong> Downstream latency, error rate, circuit breaker state.</li>
                <li><strong>Business:</strong> Conversion rate, checkout success rate (for e-commerce).</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Traffic Management Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Request prioritization defined</li>
          <li>✓ Rate limiting at API boundaries</li>
          <li>✓ Queue limits configured</li>
          <li>✓ Circuit breakers for dependencies</li>
          <li>✓ Timeouts configured for all calls</li>
          <li>✓ Backpressure propagation implemented</li>
          <li>✓ Graceful degradation modes defined</li>
          <li>✓ Load shedding thresholds documented</li>
          <li>✓ Monitoring for overload conditions</li>
          <li>✓ Alerting when shedding begins</li>
          <li>✓ Runbook for overload scenarios</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
