"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-network-status-detection-concise",
  title: "Network Status Detection",
  description:
    "Comprehensive guide to detecting network connectivity in web applications covering the Navigator.onLine API, Network Information API, heartbeat patterns, adaptive loading, and building resilient offline-aware UIs.",
  category: "frontend",
  subcategory: "offline-support",
  slug: "network-status-detection",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-14",
  tags: [
    "frontend",
    "network-status",
    "online-offline",
    "connectivity",
    "adaptive-loading",
    "resilience",
  ],
  relatedTopics: [
    "offline-first-architecture",
    "service-workers",
    "background-sync",
    "progressive-web-apps",
  ],
};

export default function NetworkStatusDetectionConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Network status detection</strong> is the practice of
          determining whether a user&apos;s device has meaningful connectivity
          to the network and, more critically, whether it can reach your
          specific server or API endpoint. This distinction matters: a device
          can be &quot;online&quot; according to its network adapter (WiFi
          associated, Ethernet cable plugged in) while having zero ability to
          reach any server. The web platform has offered{" "}
          <code>navigator.onLine</code> since Internet Explorer 4, but it has
          always been notoriously unreliable because it only checks whether the
          network adapter is enabled, not whether packets can actually reach
          their destination.
        </p>
        <p>
          The modern approach to connectivity detection combines multiple
          signals: the browser&apos;s native online/offline API for instant (but
          shallow) status, the Network Information API for connection quality
          metadata, heartbeat pings to your own server for ground-truth
          reachability, and fetch request monitoring for passive, real-time
          detection. Each layer adds accuracy at the cost of latency or resource
          consumption, and the art of network status detection lies in balancing
          these trade-offs to produce a single, actionable connectivity state
          that the UI can trust.
        </p>
        <p>
          At the staff and principal engineer level, this topic goes well beyond
          checking a boolean. You must reason about the{" "}
          <strong>&quot;lie-fi&quot; problem</strong>: the scenario where a user
          is connected to a WiFi access point that has no upstream internet
          connectivity. This is exceedingly common in airports, hotels,
          conference venues, and public transit. <code>navigator.onLine</code>{" "}
          will report <code>true</code> because the WiFi adapter is associated,
          but every HTTP request will time out or fail. Similarly,{" "}
          <strong>captive portals</strong> (WiFi networks that redirect to a
          login page before granting internet access) present a scenario where
          the device is &quot;online,&quot; DNS resolves, and HTTP requests
          succeed but return the portal&apos;s HTML rather than your API&apos;s
          response.
        </p>
        <p>
          The distinction between &quot;online&quot; (network adapter is up),
          &quot;connected&quot; (can reach the internet), and
          &quot;reachable&quot; (can reach your specific server) forms a
          three-tier model that senior engineers must internalize. A CDN outage
          may mean the internet is reachable but your assets are not. A regional
          DNS failure may mean some users can resolve your domain and others
          cannot. Adaptive strategies that respond to the quality and
          reliability of the connection, not just its binary existence, produce
          dramatically better user experiences than a simple online/offline
          toggle.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Network status detection in web applications relies on six fundamental
          primitives, each providing a different signal with distinct
          reliability and cost characteristics:
        </p>
        <ul>
          <li>
            <strong>Navigator.onLine API:</strong> A synchronous boolean
            property (<code>navigator.onLine</code>) that returns{" "}
            <code>true</code> if the browser believes the device is connected to
            a network, and <code>false</code>
            otherwise. It checks only whether the network adapter (WiFi,
            Ethernet, cellular) is enabled at the OS level. It does not perform
            any HTTP request, DNS resolution, or reachability check. On desktop
            Chrome and Firefox, it returns <code>false</code> only when the user
            explicitly enters &quot;Work Offline&quot; mode or the network
            adapter is disabled. On mobile browsers, it more accurately reflects
            the cellular/WiFi radio state. The API is universally supported
            across all browsers and is instant (no network round-trip), but its
            accuracy is fundamentally limited. It will return <code>true</code>{" "}
            during lie-fi, captive portals, and server-side outages, making it
            insufficient as a sole connectivity indicator.
          </li>
          <li>
            <strong>Online/Offline Events:</strong> The <code>window</code>{" "}
            object fires <code>online</code> and
            <code>offline</code> events when the browser&apos;s online status
            changes. These are transition events that fire at the moment the
            status flips. They use the same underlying detection as{" "}
            <code>navigator.onLine</code>, so they share its limitations.
            However, they are valuable as triggers: when an <code>offline</code>{" "}
            event fires, you know the network adapter has been disconnected, and
            you can immediately switch to offline mode without waiting for a
            heartbeat failure. When an <code>online</code> event fires, you can
            initiate a verification ping to confirm actual connectivity before
            declaring the app online again. These events do not fire for gradual
            degradation (a connection slowing from 4G to 2G) or for lie-fi
            scenarios.
          </li>
          <li>
            <strong>Network Information API:</strong> Exposed via{" "}
            <code>navigator.connection</code> (a
            <code>NetworkInformation</code> object), this API provides detailed
            metadata about the connection:
            <code>effectiveType</code> (one of &quot;slow-2g&quot;,
            &quot;2g&quot;, &quot;3g&quot;, &quot;4g&quot; based on measured
            round-trip time and downlink speed), <code>downlink</code>{" "}
            (estimated bandwidth in Mbps),
            <code>rtt</code> (estimated round-trip time in milliseconds),{" "}
            <code>saveData</code> (boolean indicating the user has enabled a
            &quot;Lite Mode&quot; or data saver in the browser), and{" "}
            <code>type</code> (the underlying connection technology: wifi,
            cellular, bluetooth, ethernet, none). The <code>change</code> event
            fires when any of these values change. This API is available only in
            Chromium-based browsers (Chrome, Edge, Opera, Samsung Internet) and
            is not available in Safari or Firefox, requiring feature detection
            and fallback strategies.
          </li>
          <li>
            <strong>Heartbeat/Ping Pattern:</strong> A periodic HTTP request
            (typically <code>HEAD</code>) sent to your own server at a known
            endpoint (e.g., <code>/api/health</code>) to verify actual
            end-to-end connectivity. The response should be tiny (empty body,
            204 status) to minimize bandwidth. The interval is typically 30
            seconds when the app is active and the status is uncertain, and can
            be reduced to 5-10 seconds during recovery (after detecting an
            offline state) or increased to 60+ seconds when the status is
            confirmed stable. This pattern is the most reliable way to detect
            lie-fi, captive portals, and server-side outages because it verifies
            that your specific server is reachable, not just that the network
            adapter is up. The trade-off is battery consumption, server load,
            and the latency between a connectivity change and its detection (up
            to one heartbeat interval).
          </li>
          <li>
            <strong>Adaptive Loading:</strong> The practice of adjusting content
            quality, asset size, and feature set based on the detected
            connection quality. A user on a 4G connection receives the full
            experience: high- resolution images, prefetched routes, animations,
            and video autoplay. A user on 2G receives a text-first experience:
            compressed thumbnails, no video, no animations, and minimal
            JavaScript. When <code>saveData</code>
            is <code>true</code>, the app respects the user&apos;s explicit
            preference for reduced data usage regardless of connection speed.
            Adaptive loading is not binary offline/online detection but rather a
            spectrum-based approach that delivers the best possible experience
            for the current conditions.
          </li>
          <li>
            <strong>Effective Connection Type:</strong> The{" "}
            <code>effectiveType</code> property from the Network Information API
            classifies the connection into four categories based on measured
            network metrics, not the underlying technology. A WiFi connection in
            a congested coffee shop might report &quot;2g&quot; effective type
            despite being on WiFi, because the measured RTT and throughput match
            2G performance. The categories are: <code>slow-2g</code> (RTT &gt;
            2000ms, downlink &lt; 50 Kbps), <code>2g</code> (RTT ~1400ms,
            downlink ~70 Kbps), <code>3g</code> (RTT ~270ms, downlink ~700
            Kbps), and <code>4g</code> (RTT &lt; 50ms, downlink &gt; 700 Kbps).
            This measured approach is more useful than the raw connection type
            because it reflects actual user experience, not theoretical
            capability.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A production-grade network status detection system combines all five
          detection layers into a unified connectivity state machine. The
          architecture follows a layered approach where faster, less accurate
          signals provide immediate status while slower, more accurate signals
          verify and correct the state over time.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Multi-Signal Detection Pipeline
          </h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Layer 1 - Instant Status (navigator.onLine):</strong>{" "}
              On app initialization, read <code>navigator.onLine</code> for the
              initial state. If <code>false</code>, immediately enter offline
              mode without waiting for any network check. If <code>true</code>,
              tentatively assume online and proceed to verification.
            </li>
            <li>
              <strong>2. Layer 2 - Transition Events:</strong> Register{" "}
              <code>window.addEventListener(&apos;online&apos;)</code> and{" "}
              <code>window.addEventListener(&apos;offline&apos;)</code>. When an{" "}
              <code>offline</code> event fires, immediately transition to
              offline state. When an <code>online</code> event fires, transition
              to a &quot;verifying&quot; state and trigger an immediate
              heartbeat ping rather than trusting the event alone.
            </li>
            <li>
              <strong>3. Layer 3 - Heartbeat Verification:</strong> Send a{" "}
              <code>HEAD</code> request to <code>/api/health</code> every 30
              seconds. On success (any 2xx response within 5 seconds), confirm
              online status. On failure (network error, timeout, or non-2xx
              response), increment a failure counter. After 2 consecutive
              failures, transition to offline state. Use exponential backoff:
              30s normal, 10s after first failure, 5s during recovery after
              regaining connectivity.
            </li>
            <li>
              <strong>4. Layer 4 - Passive Fetch Monitoring:</strong> Wrap all
              application <code>fetch()</code> calls through a centralized API
              client. Track the ratio of failed requests (network errors, not
              HTTP errors) over a sliding window. If more than 50% of the last
              10 requests failed with network errors (not 4xx/5xx), infer
              connectivity loss and trigger a verification heartbeat
              immediately.
            </li>
            <li>
              <strong>5. Layer 5 - Quality Assessment:</strong> When available,
              read <code>navigator.connection.effectiveType</code> and listen
              for <code>change</code> events. Feed the effective type into the
              connectivity state alongside the binary online/offline status.
              This enables the UI to adapt not just to &quot;online&quot; vs
              &quot;offline&quot; but to the quality of the connection.
            </li>
            <li>
              <strong>6. Combined State:</strong> All signals feed into a single
              connectivity state: <code>online</code> (verified via heartbeat),{" "}
              <code>offline</code> (adapter down or heartbeat failed),{" "}
              <code>slow</code> (online but effectiveType is 2g or slow-2g), or{" "}
              <code>uncertain</code> (online event fired but heartbeat not yet
              confirmed). The UI subscribes to this combined state and renders
              accordingly.
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/offline-support/network-detection-layers.svg"
          alt="Network detection layers showing 5 stacked layers from network adapter status (least reliable) to fetch monitoring and heartbeat (most reliable)"
          caption="Network Detection Layers - Reliability increases from bottom (network adapter check) to top (active fetch monitoring), while speed decreases. A robust system combines all layers."
        />

        <p>
          The adaptive loading flow is a separate but complementary decision
          tree that runs whenever the connectivity state or connection quality
          changes. Rather than a binary &quot;show everything&quot; or
          &quot;show nothing,&quot; the system maps each effective connection
          type to a specific experience tier, gracefully degrading the content
          and asset quality to match the user&apos;s actual bandwidth and
          latency conditions.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/offline-support/adaptive-loading-flow.svg"
          alt="Adaptive loading decision tree branching from 4g (full experience) through 3g (standard) to 2g (lite) and slow-2g (minimal)"
          caption="Adaptive Loading Flow - Content quality and asset strategy are adjusted based on the effective connection type, with saveData as an override that always wins."
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <p>
          Each detection method excels in different dimensions. No single
          approach is sufficient for production use; the optimal strategy
          combines multiple methods to cover their respective weaknesses.
          Understanding these trade-offs enables you to choose the right
          combination for your application&apos;s specific requirements around
          accuracy, resource consumption, and browser support.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Accuracy</th>
              <th className="p-3 text-left">Latency</th>
              <th className="p-3 text-left">Battery Cost</th>
              <th className="p-3 text-left">Browser Support</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>navigator.onLine</strong>
              </td>
              <td className="p-3">
                Low. Only checks network adapter state. Returns{" "}
                <code>true</code> during lie-fi, captive portals, and server
                outages. On desktop browsers, rarely returns <code>false</code>{" "}
                unless explicitly set to &quot;Work Offline.&quot;
              </td>
              <td className="p-3">
                Zero latency. Synchronous property read with no network
                round-trip.
              </td>
              <td className="p-3">None. No network request made.</td>
              <td className="p-3">Universal. All browsers since IE 4.</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Online/Offline Events</strong>
              </td>
              <td className="p-3">
                Low. Same underlying detection as navigator.onLine. Useful as a
                trigger but not as a source of truth.
              </td>
              <td className="p-3">
                Instant transition notification. No polling delay.
              </td>
              <td className="p-3">None. Event-driven, no active requests.</td>
              <td className="p-3">Universal. All modern browsers.</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Heartbeat/Ping</strong>
              </td>
              <td className="p-3">
                High. Verifies actual server reachability. Detects lie-fi,
                captive portals, DNS failures, and server outages.
              </td>
              <td className="p-3">
                Up to one heartbeat interval (30s default). Can be reduced
                during uncertain state.
              </td>
              <td className="p-3">
                Medium. Regular network requests consume battery. Mitigate with
                adaptive intervals and Page Visibility API (pause when tab is
                hidden).
              </td>
              <td className="p-3">Universal. Uses standard fetch/XHR.</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Fetch Monitoring</strong>
              </td>
              <td className="p-3">
                High. Piggybacks on real application requests. No false
                positives from artificial pings.
              </td>
              <td className="p-3">
                Reactive. Detects issues only when the app makes requests. No
                detection during idle periods.
              </td>
              <td className="p-3">
                Low. No additional network requests. Only monitors existing
                traffic.
              </td>
              <td className="p-3">Universal. Wraps standard fetch API.</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Network Information API</strong>
              </td>
              <td className="p-3">
                Medium for quality; low for reachability. Measures connection
                performance but cannot detect lie-fi or server outages.
              </td>
              <td className="p-3">Instant. Property reads are synchronous.</td>
              <td className="p-3">None. Browser-provided metadata.</td>
              <td className="p-3">
                Chromium only. Not available in Safari or Firefox. Requires
                feature detection.
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/offline-support/network-detection-comparison.svg"
          alt="Comparison matrix of network detection methods showing accuracy, speed, battery impact, and lie-fi detection capabilities"
          caption="Network Detection Methods Comparison - Color-coded ratings highlight the trade-offs: no single method scores well across all dimensions."
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Building robust network status detection requires disciplined
          engineering practices that account for the inherent unreliability of
          network state:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>1. Never Trust navigator.onLine Alone:</strong> Treat{" "}
            <code>navigator.onLine</code> as a quick negative check (if{" "}
            <code>false</code>, you are definitely offline) but never as a
            positive confirmation. When it reports <code>true</code>, verify
            with a heartbeat ping before enabling online-dependent
            functionality. This is the single most common mistake in
            connectivity detection implementations.
          </li>
          <li>
            <strong>
              2. Implement Exponential Backoff for Heartbeat Pings:
            </strong>{" "}
            Use a 30-second interval when online and stable, reduce to 10
            seconds after the first heartbeat failure, and increase to 5 seconds
            during active recovery attempts. After regaining connectivity,
            gradually extend back to 30 seconds. When the page is not visible
            (detected via the Page Visibility API), reduce or pause heartbeats
            entirely to conserve battery. This adaptive frequency balances
            detection speed against resource consumption.
          </li>
          <li>
            <strong>
              3. Use the Network Information API for Adaptive Content:
            </strong>{" "}
            When available, check
            <code>navigator.connection.saveData</code> before loading heavy
            assets. If <code>saveData</code> is
            <code>true</code>, the user has explicitly opted for reduced data
            usage, and you should respect this regardless of connection speed.
            Similarly, use <code>effectiveType</code> to select image quality
            tiers, decide whether to prefetch content, and control animation
            complexity. Always feature-detect before accessing these properties.
          </li>
          <li>
            <strong>4. Debounce Connectivity Status Changes:</strong> Network
            state can flap rapidly, especially on mobile devices transitioning
            between WiFi and cellular, or in areas with intermittent coverage.
            Apply a debounce of 2-3 seconds before transitioning from online to
            offline (to avoid false offline states from momentary
            disconnections) and require at least one successful heartbeat before
            transitioning from offline to online (to avoid premature online
            states). This prevents UI jitter and avoids triggering unnecessary
            sync operations.
          </li>
          <li>
            <strong>5. Show Non-Intrusive Offline Indicators:</strong> The gold
            standard is Google Docs&apos; approach: a small, dismissible bar at
            the top that says &quot;Trying to connect&quot; without blocking any
            UI interaction. Never show a modal dialog that blocks the entire app
            when connectivity is lost. Users should be able to continue working
            with locally cached data. The indicator should clearly communicate
            whether the app is fully offline, on a degraded connection, or
            reconnecting.
          </li>
          <li>
            <strong>
              6. Queue Operations During Offline Instead of Showing Errors:
            </strong>{" "}
            When a user performs an action (submitting a form, favoriting an
            item, sending a message) while offline, queue the operation locally
            and show optimistic UI feedback (&quot;Message will be sent when you
            reconnect&quot;). Use IndexedDB or localStorage to persist the queue
            across page reloads. When connectivity is restored, replay the queue
            in order with retry logic. This is vastly superior to showing
            &quot;Network error&quot; alerts.
          </li>
          <li>
            <strong>
              7. Use Stale Data with &quot;Last Updated&quot; Indicators:
            </strong>{" "}
            When serving cached data during offline or degraded connectivity,
            display a timestamp or relative time (&quot;Last updated 5 minutes
            ago&quot;) so the user knows they may be looking at stale
            information. This is critical for financial data, dashboards, and
            any application where data freshness affects decision-making. The
            staleness indicator should be subtle but clearly visible.
          </li>
          <li>
            <strong>8. Implement Request-Level Retry with Timeout:</strong>{" "}
            Rather than checking a global online/offline flag before each
            request, make the request and handle failure with a retry strategy:
            retry immediately once, then after 1 second, then after 3 seconds,
            with a total timeout of 10-15 seconds. If all retries fail, then
            report the operation as failed. This approach handles transient
            network issues gracefully without the complexity of maintaining a
            global connectivity state that all code paths must check.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Network status detection is deceptively simple at the API level but
          fraught with edge cases that cause real production issues:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Treating Online/Offline as Binary:</strong> The reality of
            network connectivity is a spectrum, not a switch. Between
            &quot;fully online with 100 Mbps fiber&quot; and &quot;completely
            offline with no network adapter&quot; lies an enormous range of
            degraded states: lie-fi (WiFi connected, no internet), slow
            connections (technically online but every request takes 15 seconds),
            captive portals (HTTP works but returns the wrong content), packet
            loss (some requests succeed, others fail), and DNS failures (cannot
            resolve hostnames but TCP is fine). Treating this as a boolean leads
            to broken UIs that show &quot;online&quot; when nothing works or
            &quot;offline&quot; when slow requests would eventually succeed.
          </li>
          <li>
            <strong>Over-Pinging the Server:</strong> Sending heartbeat requests
            every 2-3 seconds is a common overreaction to the inaccuracy of{" "}
            <code>navigator.onLine</code>. At scale (millions of users), this
            generates enormous load on your health endpoint. On mobile devices,
            frequent network requests prevent the radio from entering
            power-saving idle states, significantly draining battery. Use
            adaptive intervals: 30s when stable, faster only during transition
            periods, and pause entirely when the page is in the background.
          </li>
          <li>
            <strong>Not Debouncing Status Transitions:</strong> Mobile devices
            frequently experience rapid online-offline- online flapping when
            transitioning between WiFi and cellular (the &quot;WiFi
            handoff&quot; problem). Without debouncing, the UI will flicker
            between online and offline states, potentially triggering multiple
            sync operations, showing and hiding offline banners, and confusing
            users. A 2-3 second debounce on the offline transition and a
            heartbeat verification on the online transition eliminates this
            issue.
          </li>
          <li>
            <strong>
              Showing Disruptive &quot;You&apos;re Offline&quot; Modals:
            </strong>{" "}
            A full-screen modal or alert that blocks all interaction when the
            app detects an offline state is the worst possible UX. Users may be
            reading cached content, composing a message they intend to send
            later, or simply browsing previously loaded data. Blocking the UI
            punishes the user for a network condition they cannot control. Use a
            non-blocking banner or status indicator instead, and ensure all
            offline-compatible functionality remains accessible.
          </li>
          <li>
            <strong>Not Handling Captive Portals:</strong> A captive portal is a
            WiFi network that intercepts HTTP requests and redirects them to a
            login page (common in hotels, airports, and coffee shops). In this
            state,
            <code>navigator.onLine</code> is <code>true</code>, HTTP requests
            succeed (returning 200), but the response body is the portal&apos;s
            HTML, not your API&apos;s JSON. Heartbeat pings must validate the
            response content (check for a specific response body or header), not
            just the HTTP status code. A common pattern is to have the health
            endpoint return a known JSON body like{" "}
            <code>{`{"status":"ok"}`}</code> and verify it on the client.
          </li>
          <li>
            <strong>Assuming All Fetch Failures Mean Offline:</strong> A{" "}
            <code>fetch()</code> call can fail for many reasons beyond offline
            status: CORS errors, SSL certificate issues, server 500 errors, DNS
            resolution failures for a specific domain, or the server being down
            while the internet is otherwise fine. If your connectivity detection
            treats all fetch failures as &quot;offline,&quot; you will show
            false offline states during server outages. Distinguish between{" "}
            <code>TypeError</code> (network-level failure, likely offline) and
            HTTP error responses (server is reachable but returned an error).
          </li>
          <li>
            <strong>Not Adapting to Connection Quality:</strong> Loading a 4MB
            hero image and three auto-playing videos on a 2G connection is a
            failure of engineering judgment. Even if the user is technically
            online, a slow connection means those assets will take minutes to
            load, consuming the user&apos;s limited data budget and making the
            page feel broken. Use the Network Information API (where available)
            and observed request performance to adapt content: serve WebP
            thumbnails instead of full-resolution PNGs, defer non-critical
            resources, and offer a &quot;load images&quot; button rather than
            loading them automatically.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          The most effective network status detection implementations come from
          applications that handle connectivity loss as a core feature, not an
          afterthought:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Google Docs:</strong> Displays a subtle, non-intrusive
            banner at the top of the page saying &quot;Trying to
            connect...&quot; when connectivity is lost. The document remains
            fully editable, with changes queued locally in IndexedDB. When
            connectivity is restored, changes are synced automatically using
            Operational Transformation. The status indicator transitions through
            three states: &quot;All changes saved&quot; (online),
            &quot;Saving...&quot; (syncing), and &quot;Offline - changes will be
            saved when you reconnect&quot; (offline). This is the gold standard
            for connectivity UX.
          </li>
          <li>
            <strong>Slack:</strong> Shows a yellow &quot;Connecting...&quot; bar
            at the top of the message list when WebSocket connectivity is lost.
            Messages typed while offline are queued and sent when the connection
            is restored. The app continues to display previously loaded messages
            from its local cache. Slack uses WebSocket health as its primary
            connectivity signal (more reliable than navigator.onLine since it
            tests actual server reachability) and falls back to HTTP polling
            when WebSocket reconnection fails.
          </li>
          <li>
            <strong>Figma:</strong> Shows an &quot;Offline&quot; badge in the
            toolbar when connectivity is lost. Local edits continue to work
            because Figma maintains a local copy of the document state.
            Multiplayer cursors and comments disappear, but single-player
            editing remains functional. When connectivity is restored, Figma
            uses CRDTs (Conflict-free Replicated Data Types) to merge local
            changes with any concurrent remote changes without conflicts.
          </li>
          <li>
            <strong>VS Code Web (vscode.dev):</strong> Displays connection
            status in the status bar at the bottom of the editor. When offline,
            the editor continues to function for files already loaded.
            Extensions that require network access (like GitHub Copilot) show
            degraded state indicators. The file system API allows saving to
            local storage even when the remote backend is unreachable.
          </li>
          <li>
            <strong>Twitter/X:</strong> Implements adaptive image loading based
            on the Network Information API. On fast connections (4G effective
            type), images load at full resolution automatically. On slower
            connections, images load as blurred low-quality placeholders with a
            &quot;tap to load&quot; option. When <code>saveData</code>
            is enabled, images are not loaded at all until explicitly requested.
            This adaptive approach reduces data consumption by up to 70% on slow
            connections.
          </li>
          <li>
            <strong>Netflix:</strong> Uses continuous bandwidth measurement (not
            just the Network Information API) to adapt streaming quality in
            real-time. Their adaptive bitrate streaming (ABR) algorithm adjusts
            video quality every few seconds based on measured throughput, buffer
            level, and predicted future bandwidth. While this is a specialized
            form of network quality detection for video, the principle of
            measuring actual performance rather than relying on browser-reported
            connection type applies to all adaptive loading scenarios.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            When NOT to Over-Invest in Network Detection
          </h3>
          <p>
            Not every application needs a sophisticated multi-layer connectivity
            detection system:
          </p>
          <ul className="mt-2 space-y-2">
            <li>
              &bull; <strong>Fully server-rendered sites:</strong> Traditional
              server-rendered pages (no SPA behavior) naturally show the
              browser&apos;s built-in offline page when connectivity is lost.
              Adding custom detection adds complexity without proportional user
              benefit.
            </li>
            <li>
              &bull; <strong>Internal tools on corporate LANs:</strong>{" "}
              Enterprise applications running on reliable corporate networks
              rarely encounter offline states. Simple error handling on fetch
              failures is sufficient; a full heartbeat system is overkill.
            </li>
            <li>
              &bull; <strong>Real-time streaming applications:</strong> For apps
              like live video or WebRTC calls, the stream itself is the
              connectivity indicator. If the video/audio stream stops, the user
              knows the connection is lost. Additional detection layers add no
              value.
            </li>
            <li>
              &bull; <strong>One-time form submissions:</strong> A simple
              contact form or login page does not need continuous connectivity
              monitoring. Handle the <code>fetch()</code> error when the form is
              submitted and show a retry button.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why is navigator.onLine unreliable and how would you build a
              more accurate connectivity detection system?
            </p>
            <p className="mt-2 text-sm">
              A: <code>navigator.onLine</code> only checks whether the network
              adapter (WiFi, Ethernet, cellular radio) is enabled at the OS
              level. It performs no actual network request, DNS lookup, or
              reachability check. This means it returns <code>true</code> in
              numerous scenarios where no actual connectivity exists: when
              connected to a WiFi access point with no upstream internet
              (&quot;lie-fi&quot;), when behind a captive portal that redirects
              all requests to a login page, when DNS is broken, or when your
              specific server is down even though the internet is working. On
              desktop Chrome, it essentially never returns <code>false</code>
              unless the user explicitly enables &quot;Work Offline&quot; mode.
              To build a reliable system, I would layer multiple signals: use{" "}
              <code>navigator.onLine</code> as a quick negative check (if{" "}
              <code>false</code>, definitely offline), register online/offline
              events as transition triggers, implement a heartbeat that sends a{" "}
              <code>HEAD</code> request to <code>/api/health</code> every 30
              seconds (with exponential backoff and Page Visibility API
              integration to pause when the tab is hidden), monitor application
              fetch failures passively through a centralized API client, and use
              the Network Information API for connection quality when available.
              These signals feed into a state machine with four states: online
              (heartbeat confirmed), offline (adapter down or heartbeat failed),
              slow (online but poor effective type), and uncertain (online event
              fired, awaiting heartbeat confirmation). For captive portal
              detection specifically, the heartbeat endpoint must return a known
              response body that the client validates, not just a 200 status
              code.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you implement adaptive loading based on the
              user&apos;s network conditions?
            </p>
            <p className="mt-2 text-sm">
              A: Adaptive loading adjusts content quality and asset strategy
              based on measured connection performance. I would start by
              checking <code>navigator.connection.saveData</code>. If{" "}
              <code>true</code>, the user has explicitly opted for reduced data
              usage, and this overrides all other considerations: serve minimal
              assets, no auto-playing media, no prefetching. Next, I would read{" "}
              <code>navigator.connection.effectiveType</code>
              and map it to experience tiers: 4g gets the full experience (HD
              images, prefetched routes, animations), 3g gets standard
              (compressed images, lazy loading, reduced animations), 2g gets
              lite (text-first, small thumbnails, no video), and slow-2g gets
              minimal (text only, critical CSS inline, no images). Since the
              Network Information API is Chromium-only, I would also measure
              actual request performance: track the time to first byte and
              download duration of initial resources, and use these measurements
              to classify connection quality on browsers that lack the API. For
              images specifically, I would use responsive images with
              <code>srcset</code> and <code>sizes</code> attributes, and
              dynamically adjust the <code>sizes</code>
              value based on detected connection quality. I would listen to the{" "}
              <code>connection.change</code> event to adapt in real-time if the
              connection quality changes (e.g., user moves from WiFi to
              cellular). The implementation would use a React context provider
              that exposes the current connection tier to all components,
              allowing them to make rendering decisions accordingly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Design the offline indicator UX for a collaborative document
              editor.
            </p>
            <p className="mt-2 text-sm">
              A: The offline indicator for a collaborative editor must
              communicate three distinct states without disrupting the editing
              experience. First, the <strong>online state</strong>: show a
              small, persistent status indicator in the toolbar or status bar
              displaying &quot;All changes saved&quot; with a green checkmark.
              This builds confidence that work is being persisted. Second, the{" "}
              <strong>degraded state</strong>: when connectivity is lost,
              immediately transition the indicator to &quot;Offline - editing
              locally&quot; with an amber icon. The key design decision is that
              the editor must remain fully functional: text editing, formatting,
              inserting images from local storage, and all single-player
              features continue working. Disable or grey out collaborative
              features (real-time cursors, comments, sharing) with tooltips
              explaining they require connectivity. Show a subtle top bar (not a
              modal) saying &quot;You&apos;re offline. Changes will sync when
              you reconnect.&quot; with a dismiss option. Third, the{" "}
              <strong>reconnecting state</strong>: when the online event fires,
              transition to &quot;Reconnecting...&quot; with a spinning
              indicator. Do not declare online until the heartbeat confirms
              server reachability and the sync operation completes. During sync,
              show &quot;Syncing changes...&quot; with a progress indicator if
              possible. If there are merge conflicts (another user edited the
              same section), resolve them automatically using CRDTs or
              Operational Transformation and show a brief notification
              (&quot;Changes merged&quot;). For conflict resolution that
              requires user input, highlight the conflicting regions after sync
              completes. The critical principle is to never interrupt the
              user&apos;s flow: they should be able to keep typing through the
              entire offline-reconnect-sync cycle without any modal, blocking
              dialog, or forced page reload.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs - Navigator.onLine
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN Web Docs - Network Information API
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/articles/adaptive-serving-based-on-network-quality"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev - Adaptive Serving Based on Network Quality
            </a>
          </li>
          <li>
            <a
              href="https://developer.chrome.com/docs/workbox/managing-fallback-responses/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome Developers - Managing Fallback Responses with Workbox
            </a>
          </li>
          <li>
            <a
              href="https://www.patterns.dev/posts/adaptive-loading"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev - Adaptive Loading
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
