"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-network-status-detection",
  title: "Design Network Status Detection & Handling",
  description:
    "Production-grade network connectivity detection with accurate online/offline status, network type awareness, latency estimation, and UI state management.",
  category: "low-level-design",
  subcategory: "offline-advanced-ux",
  slug: "network-status-detection",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "network-detection",
    "connectivity",
    "offline-first",
    "performance",
    "resilience",
  ],
  relatedTopics: [
    "offline-first-architecture",
    "optimistic-ui-updates",
    "service-workers-pwa",
  ],
};

export default function NetworkStatusDetectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Apps need to know online/offline status to adjust behavior. Key
          challenges: navigator.onLine unreliable (reports offline when still
          connected), network types vary (Wi-Fi, 4G, 2G), slow networks feel
          offline (high latency), and UI must reflect accurate status (don't
          show "offline" when actually online). Naive apps trust navigator.onLine
          and get caught off-guard by slow networks.
        </HighlightBlock>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">Need to detect true offline (no network) vs slow (latency).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Different UX for offline vs slow (queue vs retry).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Network type determines sync strategy (Wi-Fi aggressive, 4G gentle).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Latency &gt;1s signals network issue (show UI indicator).</HighlightBlock>
          <li>User expectation: app always responsive (queue if offline).</li>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Online/Offline Detection:</strong> Accurate status (not
            navigator.onLine alone).
          </li>
          <li>
            <strong>Network Type:</strong> Detect Wi-Fi vs 4G vs 2G (via Network
            Information API).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Latency Estimation:</strong> Measure RTT (round-trip time)
            to detect slow network.
          </HighlightBlock>
          <li>
            <strong>Status Changes:</strong> Notify app when online/offline
            transitions.
          </li>
          <li>
            <strong>UI Indicators:</strong> Show connection status to user
            (banner, icon).
          </li>
          <li>
            <strong>Adaptive Sync:</strong> Sync strategy based on network type.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Retry Logic:</strong> Automatic retry with backoff on
            failure.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Accuracy:</strong> Detect offline within 1s (not 10s).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Overhead:</strong> Status checks &lt;100ms (don't block app).
          </HighlightBlock>
          <li>
            <strong>Battery:</strong> Network checks shouldn't drain battery
            (batch, throttle).
          </li>
          <li>
            <strong>Reliability:</strong> False positives rare (show "offline"
            when actually online).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Navigator.onLine says offline, but request succeeds—re-check.</li>
          <HighlightBlock as="li" tier="crucial">Network extremely slow (10s latency) but technically online—treat as offline?</HighlightBlock>
          <li>Network type changes (Wi-Fi→4G mid-sync)—adjust strategy?</li>
          <li>
            User on mobile hotspot with metered data—aggressive sync bad.
          </li>
          <li>Corporate proxy intercepts requests—heartbeat fails but online.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Don't trust navigator.onLine alone. Implement heartbeat: periodically
          ping server (lightweight request). If succeeds, online; if fails,
          offline. Check every 5-10s (not too frequent to save battery). Use
          Network Information API to detect network type (4G vs Wi-Fi) and
          adjust sync aggressiveness.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Measure latency (RTT): if &gt;2s,
          treat as slow (queue, don't fail). Broadcast status changes to app
          (Redux action, event, callback). Show UI indicator (banner:
          "offline", "slow connection", "online").</Highlight></HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/network-status-detection.svg"
          alt="Network status detection methods including navigator.onLine, heartbeat polling, fetch interception, and network quality API, with state machine and UX patterns"
          caption="Network status detection methods including navigator.onLine, heartbeat polling, fetch interception, and network quality API, with state machine and UX patterns"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Status Detection Methods</h3>
        <p>Determine connectivity reliably.</p>
        <ul className="space-y-2">
          <li>
            <strong>navigator.onLine:</strong> Browser API, unreliable (may
            report offline on network switch).
          </li>
          <li>
            <strong>Heartbeat Ping:</strong> Send lightweight request (HEAD
            /ping) every 5-10s. Success = online.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Fetch Timeout:</strong> If heartbeat times out (&gt;5s), treat
            offline.
          </HighlightBlock>
          <li>
            <strong>Window Events:</strong> Listen to online/offline events
            (supplement navigator.onLine).
          </li>
          <li>
            <strong>Hybrid:</strong> Use navigator.onLine as hint, confirm with
            heartbeat.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Network Type Detection</h3>
        <p>Identify connection type for adaptive sync.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>Network Information API:</strong> navigator.connection
            returns type (wifi, 4g, 3g, 2g, slow-2g).
          </HighlightBlock>
          <li>
            <strong>Effective Type:</strong> Estimated effective connection
            based on RTT + bandwidth.
          </li>
          <li>
            <strong>Bandwidth:</strong> Rough estimate (downlink Mbps).
          </li>
          <li>
            <strong>Save Data:</strong> navigator.connection.saveData = user
            enabled data saver mode.
          </li>
          <li>
            <strong>Fallback:</strong> If API unavailable, assume 4G (safe
            default).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Latency Estimation</h3>
        <p>Measure network delay.</p>
        <ul className="space-y-2">
          <li>
            <strong>Heartbeat Measurement:</strong> Measure time (request send to
            response).
          </li>
          <li>
            <strong>RTT (Round-Trip Time):</strong> Divide by 2 for one-way
            latency.
          </li>
          <li>
            <strong>Moving Average:</strong> Track last 10 measurements, average
            (smooth spikes).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Thresholds:</strong> &lt;100ms good, 100-1000ms acceptable,
            &gt;1000ms slow.
          </HighlightBlock>
          <li>
            <strong>API:</strong> navigator.connection.rtt available on some
            browsers.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Status State Management</h3>
        <p>Track and broadcast status.</p>
        <ul className="space-y-2">
          <li>
            <strong>Status Enum:</strong> {'{'}online, offline, slow, unknown{'}'}.
          </li>
          <li>
            <strong>Store:</strong> Zustand or Redux store with status state.
          </li>
          <li>
            <strong>Updates:</strong> Emit status change events to subscribers.
          </li>
          <li>
            <strong>Metadata:</strong> {'{'}status, type, latency, last_checked{'}'}.
          </li>
          <li>
            <strong>History:</strong> Log status changes (for debugging).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Sync Strategy</h3>
        <p>Adjust behavior based on network.</p>
        <ul className="space-y-2">
          <li>
            <strong>Wi-Fi:</strong> Sync aggressively (large payloads, frequent).
          </li>
          <li>
            <strong>4G:</strong> Sync moderately (batch, compress).
          </li>
          <li>
            <strong>2G/Slow:</strong> Sync minimally (small payloads, rare,
            delta only).
          </li>
          <li>
            <strong>Offline:</strong> Queue locally, sync when online.
          </li>
          <li>
            <strong>Save Data Mode:</strong> Reduce all data usage (compress,
            delay).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Heartbeat Implementation</h3>
        <p>Ping server periodically.</p>
        <ul className="space-y-2">
          <li>
            <strong>Endpoint:</strong> Lightweight endpoint (HEAD /health or GET
            /ping).
          </li>
          <li>
            <strong>Frequency:</strong> Every 5-10s (balance: accuracy vs
            overhead).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Timeout:</strong> 5s (if no response, assume offline).
          </HighlightBlock>
          <li>
            <strong>Adaptive Frequency:</strong> If offline, backoff (check
            every 30s). If online, every 10s.
          </li>
          <li>
            <strong>Battery Optimization:</strong> Pause checks if screen off
            (mobile).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">UI Indicators & Banners</h3>
        <p>Communicate status to user.</p>
        <ul className="space-y-2">
          <li>
            <strong>Banner:</strong> Show "offline" or "slow connection" banner
            (top).
          </li>
          <li>
            <strong>Icon:</strong> Status icon (Wi-Fi, X, warning triangle).
          </li>
          <li>
            <strong>Tooltip:</strong> "Offline - changes will sync when online".
          </li>
          <li>
            <strong>Color Coding:</strong> Green (online), orange (slow), red
            (offline).
          </li>
          <li>
            <strong>Auto-Hide:</strong> Hide banner after 5s if OK (reduce UI
            noise).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Retry Logic & Backoff</h3>
        <p>Handle transient failures.</p>
        <ul className="space-y-2">
          <li>
            <strong>Retry on Timeout:</strong> If request fails, retry with
            backoff.
          </li>
          <li>
            <strong>Exponential Backoff:</strong> 1s, 2s, 4s, 8s (don't hammer
            server).
          </li>
          <li>
            <strong>Jitter:</strong> Add randomness (±10%) to prevent
            thundering herd.
          </li>
          <li>
            <strong>Max Retries:</strong> 5 retries (then give up, mark
            offline).
          </li>
          <li>
            <strong>Abort Retry:</strong> If navigator.onLine says offline,
            skip retries.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track network health.</p>
        <ul className="space-y-2">
          <li>
            <strong>Status Distribution:</strong> % sessions online vs offline
            vs slow.
          </li>
          <li>
            <strong>Offline Duration:</strong> How long users offline
            (distribution).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Latency Metrics:</strong> P50, P95, P99 latency
            (geographic variation).
          </HighlightBlock>
          <li>
            <strong>Heartbeat Success Rate:</strong> % pings successful (low =
            network issue).
          </li>
          <li>
            <strong>Network Type Distribution:</strong> % Wi-Fi vs 4G vs
            mobile.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Heartbeat Endpoint</h3>
        <HighlightBlock as="p" tier="important">
          Keep endpoint lightweight (return {'{'}ok: true{'}'} in &lt;10ms).
          Avoid redirects (add latency). Use CDN for low-latency response.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">CORS & Credentials</h3>
        <HighlightBlock as="p" tier="important">
          Heartbeat may be cross-origin. Use no-cors mode (headers visible
          but body hidden). Or use same-origin endpoint (no CORS issue).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Network Detection</h3>
        <HighlightBlock as="p" tier="crucial">
          Test: offline (DevTools), verify app detects within 1s. Test:
          heartbeat fails, verify status → offline. Test: latency spike,
          verify slow status. Test: network type changes, verify strategy
          adapts.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Geo-Aware Latency</h3>
        <HighlightBlock as="p" tier="important">
          Users in different regions have different typical latencies. Set
          thresholds based on geo (India 200ms normal, US 50ms). Use CDN edge
          server latency.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Bandwidth Estimation</h3>
        <HighlightBlock as="p" tier="important">
          Measure actual download speed (download test image, measure time).
          Adapt payload size: slow bandwidth = compress more. Expensive but
          accurate.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Connection Pooling & Reuse</h3>
        <HighlightBlock as="p" tier="important">
          HTTP/2 multiplexing: single connection, multiple requests. Reduces
          latency overhead (avoid connection setup costs).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Device Sensors</h3>
        <p>
          Mobile devices: check battery level. Low battery = minimize network
          (save power). Check airplane mode (API unavailable on some).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing at Scale</h3>
        <HighlightBlock as="p" tier="crucial">
          Load test: 100k users with varying network conditions. Verify
          heartbeat service handles load. Chaos: simulate latency (slow
          network), verify adaptive sync works. Verify accuracy: offline
          detection latency distribution.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <p>
          Common: navigator.onLine wrong, app shows "offline" when online.
          Solution: always verify with heartbeat. Another: heartbeat endpoint
          down, users blocked. Solution: heartbeat fail ≠ network fail
          (distinguish).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response</h3>
        <HighlightBlock as="p" tier="important">
          Network detection broken: check heartbeat endpoint. Slow detection:
          reduce heartbeat interval temporarily. False positives: check
          heartbeat response times (may be CDN or server issue).
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Accuracy vs Overhead</h3>
        <HighlightBlock as="p" tier="crucial">
          Frequent heartbeats (every 1s) more accurate but drain battery.
          Infrequent (every 30s) save battery but delayed detection. 5-10s is
          balanced.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic vs Conservative</h3>
        <HighlightBlock as="p" tier="important">
          Assume online (optimistic): faster response but fail if network down.
          Assume offline (conservative): reliable but laggy UX. Hybrid
          (optimistic + heartbeat verification) best.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Data Usage vs Accuracy</h3>
        <HighlightBlock as="p" tier="important">
          Heartbeat adds data usage (1KB × 6/min = ~360KB/hour). Users on
          metered plan may care. Adaptive: skip checks if data saver mode
          enabled.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">At scale, heartbeat service must handle millions of pings/sec (use load balancing). Testing must cover offline scenarios, latency variations, and network type</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">changes. Monitoring status distribution and heartbeat success rate detects issues. Real-world systems use navigator.connection API for type/RTT, custom heartbeat for accuracy, and adaptive strategies for different networks. Integration with offline-first architecture, optimistic updates, and UI state management essential.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
