"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-token-refresh-system",
  title: "Design a Token Refresh System",
  description:
    "Production-grade authentication token refresh with expiration handling, race condition prevention, and seamless token rotation without user re-login.",
  category: "low-level-design",
  subcategory: "networking-data-systems",
  slug: "token-refresh-system",
  wordCount: 6800,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "authentication",
    "token-refresh",
    "jwt",
    "session-management",
    "security",
  ],
  relatedTopics: [
    "data-fetching-hook",
    "global-api-error-handling",
    "race-condition-handling-system",
  ],
};

export default function TokenRefreshSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Access token issued with 15-minute expiry for security (if stolen, useful only 15 min). User makes API request with access token. Token expired. Server returns 401. Naive: app shows error, user manual re-login. Bad UX. Better: app detects 401, silently refreshes token using refresh token (longer-lived, stored securely), retries request. User perceives zero interruption.
        </p>
        <p>
          Challenge: concurrent requests. User makes 3 API calls simultaneously. All in-flight when access token expires. All receive 401. Naive: all 3 refresh independently (race condition: multiple refresh attempts, conflicting token updates, memory leak). Better: first request triggers refresh, other 2 wait for result, all retry with new token. Requires coordination—queue of waiting requests.
        </p>
        <p>
          Implementation: maintain "refresh in progress" flag. When 401 detected and flag false, set true, start refresh. When 401 detected and flag true, queue request, wait for refresh to complete, retry. Once refresh done, notify all queued requests, retry. If refresh fails, abort queued requests, redirect to login.
        </p>
        <p>
          <strong>Explicit assumptions:</strong> Access tokens short-lived (15-60 min). Refresh tokens longer-lived (days/weeks). Multiple requests possible when token expires. Server returns 401 on expiration. Refresh endpoint requires refresh token. Atomic refresh required (no race conditions).
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Token Expiration Detection:</strong> Detect expired token on API
            response (401).
          </li>
          <li>
            <strong>Automatic Refresh:</strong> Refresh token automatically without
            user action.
          </li>
          <li>
            <strong>Request Retry:</strong> After refresh, retry original failed
            request.
          </li>
          <li>
            <strong>Race Condition Prevention:</strong> Multiple concurrent requests
            don't trigger multiple refreshes.
          </li>
          <li>
            <strong>Atomic Refresh:</strong> All concurrent requests wait for refresh
            to complete.
          </li>
          <li>
            <strong>Refresh Failure Handling:</strong> If refresh fails, redirect to
            login.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Transparency:</strong> Token refresh invisible to user. No
            re-login required.
          </li>
          <li>
            <strong>Latency:</strong> Refresh adds ~500ms latency. Accept as
            trade-off for security.
          </li>
          <li>
            <strong>Atomicity:</strong> All requests see consistent token state.
          </li>
          <li>
            <strong>Security:</strong> Refresh token stored securely (httpOnly cookie
            preferred).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Refresh token also expired → redirect to login, clear auth state.</li>
          <li>
            Network error during refresh → retry refresh with backoff, eventually
            fail.
          </li>
          <li>
            Multiple requests receive 401 simultaneously → coalesce refresh, all wait
            for result.
          </li>
          <li>
            User logs out during refresh → abort refresh, clear tokens, redirect to
            login.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          Store access and refresh tokens in state. On API response 401, detect
          expired token. Check if refresh already in progress. If yes, wait for its
          completion. If no, initiate refresh. During refresh, queue all concurrent
          requests. Once refresh completes, update token and retry queued requests. If
          refresh fails, redirect to login.
        </p>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Storage</h3>
        <p>
          Store tokens securely and retrieve for requests.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Access Token:</strong> Short-lived (15-60 min). Stored in memory
            or localStorage.
          </li>
          <li>
            <strong>Refresh Token:</strong> Long-lived (days/weeks). Stored in
            httpOnly cookie for security.
          </li>
          <li>
            <strong>Token Expiry:</strong> Decode JWT to extract expiry time. Or
            server provides expiry in response.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Expiration Detection</h3>
        <p>
          Detect when token has expired.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Response Status:</strong> API returns 401 Unauthorized on expired
            token.
          </li>
          <li>
            <strong>Proactive Check:</strong> Before API call, check if token expired.
            Refresh if needed.
          </li>
          <li>
            <strong>Error Code:</strong> Server may return specific error code
            (e.g., &quot;TOKEN_EXPIRED&quot;).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Refresh In Progress Tracking</h3>
        <p>
          Track if refresh is already in flight to prevent race conditions.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Refresh Promise:</strong> Store Promise for in-flight refresh.
          </li>
          <li>
            <strong>Check Before Refresh:</strong> Before initiating refresh, check
            if already in progress.
          </li>
          <li>
            <strong>Waiting Requests:</strong> Queue requests that arrive during
            refresh.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Request Queuing</h3>
        <p>
          Queue requests that arrive while refresh in progress.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Queue:</strong> Array of pending requests and their callbacks.
          </li>
          <li>
            <strong>Add to Queue:</strong> When 401 received and refresh in progress,
            add request to queue.
          </li>
          <li>
            <strong>Flush Queue:</strong> Once refresh completes, retry all queued
            requests.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Refresh Endpoint Call</h3>
        <p>
          Exchange refresh token for new access token.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Endpoint:</strong> POST /auth/refresh with refresh token.
          </li>
          <li>
            <strong>Response:</strong> Server returns new access token (and
            optionally new refresh token).
          </li>
          <li>
            <strong>Storage:</strong> Update tokens in state/storage.
          </li>
          <li>
            <strong>Retry:</strong> Retry original failed request with new token.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Refresh Failure Handling</h3>
        <p>
          Handle refresh failures gracefully.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Refresh Token Expired:</strong> Refresh endpoint returns 401.
            User is fully logged out.
          </li>
          <li>
            <strong>Network Error:</strong> Retry refresh with backoff. Eventually
            fail if persistent.
          </li>
          <li>
            <strong>Logout:</strong> Clear tokens, clear auth state, redirect to
            login.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Interceptor Implementation</h3>
        <p>
          Implement refresh logic in HTTP interceptor so it applies to all requests
          automatically.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Response Interceptor:</strong> Catch 401 responses, trigger
            refresh.
          </li>
          <li>
            <strong>Request Interceptor:</strong> Attach access token to requests.
          </li>
          <li>
            <strong>Retry Logic:</strong> After refresh, retry original request.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Logout During Refresh</h3>
        <p>
          Handle user logout while refresh in progress.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Logout Signal:</strong> User initiates logout (clicks logout
            button).
          </li>
          <li>
            <strong>Abort Refresh:</strong> Cancel in-flight refresh.
          </li>
          <li>
            <strong>Clear State:</strong> Clear tokens and auth state.
          </li>
          <li>
            <strong>Redirect:</strong> Redirect to login page.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Refresh Leeway</h3>
        <p>
          Refresh token proactively before expiration to avoid race conditions.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Leeway:</strong> Refresh token when it has N minutes remaining
            (e.g., 5 min).
          </li>
          <li>
            <strong>Benefit:</strong> Reduces chance of expired token on request.
          </li>
          <li>
            <strong>Implementation:</strong> Background timer that refreshes
            periodically.
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">HTTP Client Integration</h3>
        <p>
          Token refresh must integrate tightly with HTTP client (Axios, Fetch).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">State Management</h3>
        <p>
          Zustand, Redux, or Context for token storage and refresh state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Security</h3>
        <p>
          Store refresh token in httpOnly cookie to prevent XSS. Access token in
          memory is acceptable if refresh on-demand.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">CSRF Protection</h3>
        <p>
          Refresh endpoint may be POST. Protect via CSRF tokens or SameSite cookies.
        </p>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Distributed Token Validation</h3>
        <p>
          In distributed systems, every server validates tokens independently. But
          revoked token takes time to propagate. Solutions: token blacklist (redis),
          short TTL (revocation takes N minutes max), or centralized auth service.
          Trade latency for freshness.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Revocation Strategy</h3>
        <p>
          User logs out, token invalidated. But cached token still valid if short
          TTL. Option: immediately revoke (add to blacklist). Risk: blacklist
          lookups on every request adds latency. Most systems accept grace period
          (5-30 min) for convenience.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Refresh Token Security</h3>
        <p>
          Refresh token longer-lived → bigger attack surface if compromised. Store
          in httpOnly cookie (prevents XSS theft). Implement rotation: each refresh
          returns new refresh token. Old one invalidated. Limits attacker window.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cross-Origin Refresh Requests</h3>
        <p>
          If refresh endpoint on different origin, CORS applies. Credentials must
          be sent (httpOnly cookies sent automatically if credentials: 'include').
          CSRF token may be required. Secure properly.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Refresh Scenarios</h3>
        <p>
          Test: token expiration mid-request, refresh success, refresh failure,
          concurrent refresh, logout during refresh. Use fake timers for token TTL.
          Test race: A and B both get 401 simultaneously. Verify single refresh, not two.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Observability & Incident Response</h3>
        <p>
          Monitor: refresh success rate, refresh failure reasons (token expired,
          network error), avg refresh latency. Alert on high failure rate (indicates
          auth issues). Log all refresh attempts for audit.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <p>
          Common: refresh token also expired, user logged out, no graceful error.
          Another: refresh succeeds on server but response lost (network error).
          Client thinks refresh failed, tries again. Another: refresh endpoint slow,
          requests timeout waiting for it.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Refresh Performance</h3>
        <p>
          Refresh adds ~500ms latency per failed request. At 1M users, refresh load
          significant. Optimize: refresh in background (before expiration), avoid
          thundering herd on refresh endpoint. Use read replicas for token validation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sliding Window Alternative</h3>
        <p>
          Instead of refresh tokens, extend access token TTL on each request
          (sliding window). Simpler but weaker security (compromise window longer).
          Trade: simplicity vs security.
        </p>
      </section>

      <section>
        <h2>Token Refresh Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/networking-data-systems/token-refresh-flow.svg"
          alt="Token refresh flow: silent refresh strategy and error scenarios diagram"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Latency vs Security</h3>
        <p>
          Short token TTL increases security but forces frequent refreshes (adds
          latency).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Complexity</h3>
        <p>
          Automatic token refresh adds complexity. Simpler to just re-login on
          expiration, but worse UX.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sliding Window</h3>
        <p>
          Alternative: extend token lifetime on each request (sliding window).
          Simpler but weaker security.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          A token refresh system is foundational to secure, user-friendly
          authentication. For staff/principal engineers, critical aspects include
          distributed token validation strategies, token revocation with blacklists
          or propagation delays, secure refresh token storage (httpOnly cookies),
          and refresh token rotation to limit attacker window. Cross-origin refresh
          requests require careful CORS and CSRF handling. At 1M users, refresh
          endpoint becomes bottleneck—optimize via caching, read replicas, and
          background refresh (before expiration) to avoid thundering herd. Real-world
          systems must handle edge cases: concurrent refresh, refresh during logout,
          refresh token expiration. Sliding window alternative trades simplicity for
          security. Testing must cover all scenarios including race conditions.
          Observability on refresh success rate and latency essential for detecting
          auth issues early. Understanding interaction with error handling, retry
          logic, and request deduplication is important.
        </p>
      </section>
    </ArticleLayout>
  );
}
