"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-geolocation-permissions",
  title: "Design Geolocation & Permissions",
  description:
    "Production-grade geolocation with privacy controls, permissions API, location tracking, accuracy handling, and graceful degradation.",
  category: "low-level-design",
  subcategory: "web-platform-browser-apis",
  slug: "geolocation-permissions",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "geolocation",
    "permissions",
    "privacy",
    "location",
    "security",
  ],
  relatedTopics: [
    "web-security",
    "async-state-handling",
    "error-state-management",
  ],
};

export default function GeolocationPermissionsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          Geolocation useful for location-aware services (maps, ride-sharing,
          local search). Key challenges: user privacy (must ask permission),
          accuracy varies (GPS ±5m, IP ±1km), and graceful degradation (user
          denies). Naive approach: request location without context (users
          suspicious). Better: explain why needed, handle denials, cache
          location (avoid repeated requests), and provide fallback
          (approximate location from IP).
        </HighlightBlock>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            Need user location (accurate for maps, approximate for local
            search).
          </HighlightBlock>
          <li>User may deny permission (respect privacy).</li>
          <HighlightBlock as="li" tier="important">Location may be inaccurate or take time (especially GPS).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Need to request once, cache result (avoid repeated prompts).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Fallback to IP-based location (less accurate but always works).</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Request Permission:</strong> Ask user for location access
            (popup).
          </HighlightBlock>
          <li>
            <strong>Get Location:</strong> Obtain user coordinates (lat, long).
          </li>
          <li>
            <strong>Continuous Tracking:</strong> Monitor location changes (watch).
          </li>
          <li>
            <strong>Accuracy Options:</strong> High accuracy (GPS), low
            (network-based).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Timeout Handling:</strong> Give up if location takes too
            long.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Cache Location:</strong> Store result, avoid repeated
            requests.
          </HighlightBlock>
          <li>
            <strong>Permission Status:</strong> Check if already granted/denied.
          </li>
          <li>
            <strong>Fallback:</strong> IP-based location if denied.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Privacy:</strong> User controls permission (never silent
            access).
          </li>
          <li>
            <strong>Latency:</strong> Get location &lt;10s (timeout).
          </li>
          <li>
            <strong>Accuracy:</strong> ±50m acceptable for most use cases.
          </li>
          <li>
            <strong>Battery:</strong> GPS expensive, disable when not needed.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>User denies permission: gracefully degrade (show message).</li>
          <HighlightBlock as="li" tier="crucial">
            Location takes 30s (GPS slow): timeout and use cached or fallback.
          </HighlightBlock>
          <li>
            User changes mind: revoke permission in settings, app should
            re-request.
          </li>
          <HighlightBlock as="li" tier="important">
            Multiple requests in-flight: cache first, return same promise
            (deduplication).
          </HighlightBlock>
          <li>
            Permission changed: watch for permission change event (re-request
            if needed).
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Request permission via Geolocation API. On grant, get coordinates
          (latitude, longitude, accuracy). Cache result (avoid repeated
          requests, save battery).</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Implement timeout (fail gracefully if slow).
          Monitor permission changes. Handle denial (fallback to IP-based
          location). Watch location for tracking (with careful cleanup to save
          battery).</Highlight></HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/web-platform-browser-apis/geolocation-permissions.svg"
          alt="Geolocation and permissions system showing permission lifecycle, accuracy levels, location tracking, and privacy considerations"
          caption="Geolocation and permissions system showing permission lifecycle, accuracy levels, location tracking, and privacy considerations"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design Geolocation &amp; Permissions</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Geolocation API</h3>
        <p>Browser API for location access.</p>
        <ul className="space-y-2">
          <li>
            <strong>getCurrentPosition:</strong> One-time location request (async).
          </li>
          <li>
            <strong>watchPosition:</strong> Continuous tracking (returns watch
            ID).
          </li>
          <li>
            <strong>clearWatch:</strong> Stop tracking (cleanup, save battery).
          </li>
          <li>
            <strong>Options:</strong> enableHighAccuracy, timeout, maximumAge.
          </li>
          <li>
            <strong>Result:</strong> Coordinates (latitude, longitude, accuracy,
            altitude).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Permission Request</h3>
        <p>User consent flow.</p>
        <ul className="space-y-2">
          <li>
            <strong>First Call:</strong> Browser shows permission prompt
            (Allow/Block).
          </li>
          <li>
            <strong>User Action:</strong> Allow → location access, Block →
            error.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Remember Choice:</strong> Browser caches decision (no
            re-prompt on next call).
          </HighlightBlock>
          <li>
            <strong>Context:</strong> User must trust why location needed
            (explain in UI).
          </li>
          <li>
            <strong>Deny Gracefully:</strong> Show message (why needed?), offer
            fallback.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Accuracy Options</h3>
        <p>Trade-off: accuracy vs battery.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial">
            <strong>High Accuracy (enableHighAccuracy: true):</strong> GPS +
            network (±5m, slow 10-30s, battery drain).
          </HighlightBlock>
          <li>
            <strong>Low Accuracy (false):</strong> Network only (±1km, fast 1s,
            low battery).
          </li>
          <li>
            <strong>Default:</strong> Browser chooses (varies by device).
          </li>
          <li>
            <strong>Use Case:</strong> Maps need high, local search ok with
            low.
          </li>
          <li>
            <strong>Strategy:</strong> Start low, escalate to high if user
            accepts delay.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timeout & Error Handling</h3>
        <p>Graceful failure.</p>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Timeout:</strong> Max wait (e.g., 10s). If no location,
            error.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>GPS Timeout:</strong> GPS slow outdoors, fail faster
            (5-10s) and fallback.
          </HighlightBlock>
          <li>
            <strong>Permission Denied:</strong> User blocked, show message,
            offer instructions.
          </li>
          <li>
            <strong>Unavailable:</strong> Device doesn't support (rare), use
            fallback.
          </li>
          <li>
            <strong>Stale Location:</strong> Cached location beyond TTL
            threshold, re-request fresh.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Caching Strategy</h3>
        <p>Avoid repeated requests.</p>
        <ul className="space-y-2">
          <li>
            <strong>Cache Key:</strong> accuracy + timestamp (different accuracy
            = different cache).
          </li>
          <li>
            <strong>TTL:</strong> Cache 5 minutes (location doesn't change fast).
          </li>
          <li>
            <strong>Invalidate:</strong> On map move → new location (user
            changed position).
          </li>
          <li>
            <strong>Multiple Requests:</strong> Same caller asks twice, return
            cached (deduplication).
          </li>
          <li>
            <strong>Storage:</strong> localStorage (persist across sessions) or
            memory (ephemeral).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Permissions API (Advanced)</h3>
        <p>Check permission status without requesting.</p>
        <ul className="space-y-2">
          <li>
            <strong>Query:</strong> navigator.permissions.query with name
            parameter returns status.
          </li>
          <li>
            <strong>Status:</strong> 'granted', 'denied', 'prompt'.
          </li>
          <li>
            <strong>Use Case:</strong> Check before showing location feature
            (save user taps).
          </li>
          <li>
            <strong>Listen:</strong> permissionstatus.onchange detects changes
            (user revoked in settings).
          </li>
          <li>
            <strong>Browser Support:</strong> Modern browsers (not all).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Location Tracking (watchPosition)</h3>
        <p>Continuous monitoring.</p>
        <ul className="space-y-2">
          <li>
            <strong>Use Case:</strong> Ride-sharing, navigation (real-time
            location).
          </li>
          <li>
            <strong>Callback:</strong> Fires each time location changes
            (frequent).
          </li>
          <li>
            <strong>Battery Impact:</strong> Significant (avoid if not needed).
          </li>
          <li>
            <strong>Cleanup:</strong> MUST call clearWatch() when done
            (navigator.geolocation.clearWatch(watchId)).
          </li>
          <li>
            <strong>Best Practice:</strong> Only watch when screen active
            (pause on background tab).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">IP-Based Fallback</h3>
        <p>Approximate location without permission.</p>
        <ul className="space-y-2">
          <li>
            <strong>Service:</strong> IP geolocation API (MaxMind, IP2Location).
          </li>
          <li>
            <strong>Accuracy:</strong> ±1km (city-level), less private (IP
            tracked).
          </li>
          <li>
            <strong>Advantage:</strong> Works without permission (privacy-respecting
            default).
          </li>
          <li>
            <strong>Use Case:</strong> Default location (local search), upgrade
            to GPS if user allows.
          </li>
          <li>
            <strong>Cost:</strong> API calls may have quota/cost.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy & Security</h3>
        <p>Protect user location data.</p>
        <ul className="space-y-2">
          <li>
            <strong>HTTPS Only:</strong> Geolocation API only works on secure
            context (https://).
          </li>
          <li>
            <strong>User Control:</strong> Can revoke permission anytime
            (settings).
          </li>
          <li>
            <strong>Transparency:</strong> Explain why location needed (in UI).
          </li>
          <li>
            <strong>Data Minimization:</strong> Request only as often as needed
            (cache).
          </li>
          <li>
            <strong>Server Security:</strong> Don't log location carelessly
            (compliance, privacy).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track geolocation usage.</p>
        <ul className="space-y-2">
          <li>
            <strong>Permission Grant Rate:</strong> % of users allowing
            location.
          </li>
          <li>
            <strong>Location Accuracy:</strong> Average accuracy received
            (variance by device).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Request Latency:</strong> How long to get location? (high
            accuracy slower).
          </HighlightBlock>
          <li>
            <strong>Cache Hit Rate:</strong> % requests served from cache (lower
            battery drain).
          </li>
          <li>
            <strong>Fallback Usage:</strong> % of users relying on IP-based
            (location denied).
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Browser Support</h3>
        <HighlightBlock as="p" tier="crucial">
          Geolocation: universal modern browser support. Permissions API: newer
          (check support). Fallback to try/catch.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">HTTPS Requirement</h3>
        <HighlightBlock as="p" tier="important">
          Geolocation only works on https:// (secure context). http:// blocked
          for privacy. Localhost ok for dev.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing</h3>
        <HighlightBlock as="p" tier="important">
          Mock Geolocation API (return fixed coordinates). Test permission
          denied case. Test timeout handling. Real device testing (accuracy
          varies).
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Progressive Enhancement</h3>
        <HighlightBlock as="p" tier="important">
          Feature works without location (fallback). Offer higher accuracy if
          user grants. Graceful degradation (no location = limited features).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Accuracy Escalation</h3>
        <HighlightBlock as="p" tier="important">
          Start low accuracy (fast, battery). If user action implies need (e.g.,
          starts navigation), escalate to high accuracy.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Background Tab Pause</h3>
        <p>
          Page visibility API: pause watchPosition when tab inactive. Resume on
          foreground (saves battery).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing at Scale</h3>
        <HighlightBlock as="p" tier="crucial">
          Simulate permission denial (% of users). Simulate slow location
          (timeout handling). Verify cache efficiency (reduce API calls).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="important">
          Common: forget to clearWatch() → battery drain. Solution: always
          cleanup in page unload. Another: use stale location (cached 1 day).
          Solution: shorter TTL (5-30 min).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response</h3>
        <HighlightBlock as="p" tier="important">
          Low permission grant rate: explain why needed (UI message). Location
          inaccurate: check accuracy option (may need high accuracy mode).
          Watch memory leak: verify clearWatch() called.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Accuracy vs Battery</h3>
        <HighlightBlock as="p" tier="important">
          High accuracy: GPS (±5m) but battery drain. Low: network (±1km) but
          fast. Choose based on use case (maps need high, local search ok with
          low).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Caching vs Freshness</h3>
        <HighlightBlock as="p" tier="crucial">
          Cache location: save battery + requests. But stale data (user moved).
          TTL balances (5 min typical).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy vs Convenience</h3>
        <HighlightBlock as="p" tier="important">
          Ask permission: transparent but friction. IP-based fallback: automatic
          but less accurate. Offer both (user chooses).
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">HTTPS requirement for security. Battery management (stop watching when not needed, pause on background). Privacy best practices (explain why,</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">minimize data sharing). Monitoring permission grant rates, location accuracy, latency, cache hits. Testing with mocked API and real devices. Real-world systems cache locations (5-30 min TTL), offer accuracy escalation (low then high), gracefully degrade on denial (show message, offer IP-based fallback).</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
