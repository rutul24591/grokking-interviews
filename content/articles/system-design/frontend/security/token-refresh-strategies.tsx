"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-security-token-refresh-extensive",
  title: "Token Refresh Strategies",
  description: "Comprehensive guide to JWT token refresh patterns, rotation strategies, silent refresh, and security best practices for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "security",
  slug: "token-refresh-strategies",
  version: "extensive",
  wordCount: 6800,
  readingTime: 27,
  lastUpdated: "2026-03-19",
  tags: ["security", "tokens", "jwt", "refresh", "authentication", "frontend", "web-security", "sessions"],
  relatedTopics: ["authentication-patterns", "secure-cookie-attributes", "secure-storage-sensitive-data"],
};

export default function TokenRefreshStrategiesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Token refresh strategies</strong> define how applications maintain user authentication
          over time without requiring repeated logins. Since access tokens should be short-lived (minutes
          to hours) for security, refresh mechanisms allow users to obtain new access tokens without
          re-entering credentials.
        </p>
        <p>
          <strong>The fundamental challenge:</strong> Balance security (short-lived tokens limit damage
          if stolen) with user experience (users shouldn&apos;t login every 15 minutes). Token refresh
          strategies solve this by using long-lived refresh tokens to obtain new short-lived access tokens
          silently.
        </p>
        <p>
          <strong>Common token patterns:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Access token:</strong> Short-lived (15-60 minutes), used for API requests
          </li>
          <li>
            <strong>Refresh token:</strong> Long-lived (days to weeks), used only to obtain new access tokens
          </li>
          <li>
            <strong>Token rotation:</strong> Issue new refresh token on each use, invalidate old one
          </li>
          <li>
            <strong>Sliding sessions:</strong> Extend session lifetime on user activity
          </li>
        </ul>
        <p>
          <strong>Why token refresh matters for staff/principal engineers:</strong> As a technical leader,
          you&apos;re responsible for authentication architecture. Poor refresh strategies lead to security
          vulnerabilities (token theft, session fixation), poor UX (frequent logouts), or both. Understanding
          refresh patterns enables you to design secure, user-friendly authentication systems.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Separate Access and Refresh</h3>
          <p>
            Access tokens and refresh tokens serve different purposes and have different security
            requirements. Access tokens should be short-lived and frequently rotated. Refresh tokens
            should be long-lived but carefully protected and rotated on use. Never use the same token
            for both purposes.
          </p>
        </div>
      </section>

      <section>
        <h2>Token Lifecycle</h2>
        <p>
          Understanding the token lifecycle is essential for implementing secure refresh strategies.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/token-lifecycle-flow.svg"
          alt="Token Lifecycle Flow showing access token usage, expiration, refresh token exchange, and new token issuance"
          caption="Token Lifecycle: Access tokens expire quickly, refresh tokens are exchanged for new access tokens, refresh tokens rotate on use."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Typical Token Flow</h3>
        <ol className="space-y-2">
          <li>
            <strong>Initial login:</strong> User authenticates, server issues access token + refresh token
          </li>
          <li>
            <strong>API requests:</strong> Client includes access token in Authorization header
          </li>
          <li>
            <strong>Token expiration:</strong> Access token expires (15-60 min), API returns 401
          </li>
          <li>
            <strong>Refresh request:</strong> Client sends refresh token to refresh endpoint
          </li>
          <li>
            <strong>Token rotation:</strong> Server validates refresh token, issues new access + refresh tokens
          </li>
          <li>
            <strong>Retry request:</strong> Client retries original API request with new access token
          </li>
          <li>
            <strong>Repeat:</strong> Continue until refresh token expires or user logs out
          </li>
        </ol>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Expiration Strategies</h3>
        <p>
          Access tokens are short-lived (15-60 minutes) with claims like sub, type set to "access", exp set to 15 minutes from issuance, and iat. Refresh tokens are long-lived (7-30 days) with type set to "refresh", exp set to 7 days from issuance, iat, and a jti (unique token ID) for rotation tracking. The separation is important: access tokens are used frequently with a short window if compromised (max 15 min damage), while refresh tokens are used rarely (once per session) with a longer lifetime, and compromised refresh tokens are detected on reuse through rotation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Storage for Refresh</h3>
        <p>
          The SECURE approach is to store both tokens in HttpOnly cookies with attributes like <code className="text-sm">HttpOnly</code>, <code className="text-sm">Secure</code>, <code className="text-sm">SameSite=Strict</code>, and appropriate Max-Age values (900 seconds for access token, 604800 seconds for refresh token). JavaScript cannot access these tokens and the browser auto-sends cookies with requests, while the refresh endpoint reads cookies server-side. A LESS SECURE approach is access token in memory and refresh in HttpOnly cookie, but the access token is exposed to XSS if stored in localStorage. The INSECURE approach is storing both tokens in localStorage using <code className="text-sm">setItem()</code>, which leads to instant account takeover via XSS.
        </p>
      </section>

      <section>
        <h2>Refresh Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 1: Silent Refresh (Recommended)</h3>
        <p>
          Automatically refresh tokens before they expire, without user interaction. Implement a TokenManager class with a constructor that initializes refreshTimer and isRefreshing flag, a <code className="text-sm">startSilentRefresh(accessTokenExpiry)</code> method that sets a timer to refresh at 80% of token lifetime, an async <code className="text-sm">refreshToken()</code> method that fetches from /api/refresh with credentials included, handles the response, restarts the timer for the new token, and redirects to login on failure, and a <code className="text-sm">cleanup()</code> method that clears the timer on logout. Usage: create an instance and call <code className="text-sm">startSilentRefresh(900)</code> for 15 minutes.
        </p>
        <p>
          <strong>Pros:</strong> Seamless UX, no interrupted requests, proactive refresh.
        </p>
        <p>
          <strong>Cons:</strong> Background activity even when user is idle, requires careful timer management.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 2: Refresh on 401 (Lazy Refresh)</h3>
        <p>
          Refresh only when an API request fails due to token expiration. Implement an ApiClient class with a constructor initializing isRefreshing and failedRequests array, an async <code className="text-sm">request(url, options)</code> method that checks for 401 status and calls handle401, an async <code className="text-sm">handle401(url, originalOptions)</code> method that queues requests if already refreshing or performs the refresh and retries, a <code className="text-sm">queueRequest()</code> method for queuing, a <code className="text-sm">processQueue()</code> method for processing queued requests after refresh, and an async <code className="text-sm">refreshToken()</code> method that POSTs to /api/refresh.
        </p>
        <p>
          <strong>Pros:</strong> No background activity, refresh only when needed.
        </p>
        <p>
          <strong>Cons:</strong> First request after expiry fails, requires request queuing for concurrent requests.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 3: Refresh Token Rotation</h3>
        <p>
          Issue new refresh token on each use, invalidate old one. Detects token theft. On the server-side refresh endpoint, read the old refresh token from cookies, verify it, check if it was already used (reuse detection), and if reuse is detected invalidate ALL tokens for that user, log the security event, and return an error asking the user to login again. If not reused, generate new access and refresh tokens, mark the old token as used, and set new HttpOnly cookies with appropriate maxAge values.
        </p>
        <p>
          <strong>Pros:</strong> Detects token theft, limits damage from compromised tokens.
        </p>
        <p>
          <strong>Cons:</strong> More complex, requires token tracking, can cause issues with multiple tabs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Pattern 4: Sliding Session Expiration</h3>
        <p>
          Extend session lifetime on user activity. On the server-side, verify the refresh token, check if the session has exceeded an absolute timeout (such as 30 days by comparing session age to maxSessionAge), force re-login if the absolute timeout is exceeded, otherwise generate a new refresh token and set a new cookie with extended expiry using HttpOnly, Secure, and SameSite=strict attributes.
        </p>
        <p>
          On the client-side, refresh on user activity by listening to events like click, keypress, scroll, and mousemove, using debounce with a 1-minute interval, and calling refreshToken() if the token is more than 50% through its lifetime.
        </p>
        <p>
          <strong>Pros:</strong> Active users stay logged in, inactive sessions expire.
        </p>
        <p>
          <strong>Cons:</strong> Requires activity tracking, can keep sessions alive indefinitely.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/security/refresh-patterns-comparison.svg"
          alt="Token Refresh Patterns comparison showing Silent Refresh, Refresh on 401, Token Rotation, and Sliding Session"
          caption="Refresh Patterns: Each has different trade-offs. Silent refresh for best UX, rotation for security, sliding for active sessions."
        />
      </section>

      <section>
        <h2>Multi-Tab Considerations</h2>
        <p>
          Handling token refresh across multiple browser tabs requires coordination to avoid race conditions
          and excessive refresh requests.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Tab Synchronization with BroadcastChannel</h3>
        <p>
          Implement a TokenSync class with a constructor that creates a BroadcastChannel for 'token_refresh', sets isRefreshing to false, and listens for messages to reset isRefreshing when TOKEN_REFRESHED is received. The async <code className="text-sm">refreshToken()</code> method waits if already refreshing, sets isRefreshing to true, performs the refresh, posts a TOKEN_REFRESHED message to notify other tabs, and resets isRefreshing in the finally block. Include a <code className="text-sm">waitForRefresh()</code> helper that polls until isRefreshing is false. Usage: create an instance and call <code className="text-sm">await tokenSync.refreshToken()</code>.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage Event Coordination</h3>
        <p>
          Alternatively, use localStorage events for coordination (even if tokens are in cookies, use localStorage for sync). Implement a TokenCoordinator class with a constructor that adds a storage event listener for the 'token_refresh' key and calls <code className="text-sm">handleExternalRefresh()</code> when triggered. The async <code className="text-sm">refreshToken()</code> method checks if another tab just refreshed by checking the last_token_refresh timestamp in localStorage (within 10 seconds), skips if so, otherwise sets the timestamp, performs the refresh, and clears the marker on failure.
        </p>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Refresh Token Theft Detection</h3>
        <p>
          Token rotation with reuse detection is the primary defense against refresh token theft.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Detection:</strong> If old refresh token is used after rotation, it was stolen
          </li>
          <li>
            <strong>Response:</strong> Invalidate all tokens for the user, force re-authentication
          </li>
          <li>
            <strong>Notification:</strong> Alert user of suspicious activity
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Absolute vs Sliding Expiration</h3>
        <p>
          Absolute expiration ends the session at a fixed time (good for high-security apps and compliance requirements) where the session expires 7 days from issuance no matter what. Sliding expiration extends the session on each activity (good for consumer apps and productivity tools) where the session can continue indefinitely with activity. A hybrid approach combines both: sliding with an absolute maximum (such as 30 days absolute and 7 days sliding) where you force re-login after 30 days but extend by 7 days on activity.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Refresh Token Binding</h3>
        <p>
          Bind refresh tokens to specific devices or contexts to limit damage from theft. Generate a device fingerprint and include it in the refresh token as deviceId. On refresh, verify the device matches by comparing the payload's deviceId with the current fingerprint. If they don't match (token used from different device), invalidate all user tokens and return a device mismatch error.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Lifetime</h3>
        <ul className="space-y-2">
          <li>
            <strong>Access tokens:</strong> 15-60 minutes (shorter for high-security apps)
          </li>
          <li>
            <strong>Refresh tokens:</strong> 7-30 days (balance UX vs security)
          </li>
          <li>
            <strong>Absolute session limit:</strong> 30-90 days maximum (force re-authentication)
          </li>
          <li>
            <strong>Idle timeout:</strong> 24 hours of inactivity (clear inactive sessions)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Storage</h3>
        <ul className="space-y-2">
          <li>
            <strong>Both tokens in HttpOnly cookies:</strong> Most secure option
          </li>
          <li>
            <strong>Secure + SameSite:</strong> Always set these flags
          </li>
          <li>
            <strong>Never localStorage:</strong> Accessible via XSS
          </li>
          <li>
            <strong>Domain scoping:</strong> Restrict cookies to specific subdomain
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rotation</h3>
        <ul className="space-y-2">
          <li>
            <strong>Rotate on every use:</strong> New refresh token each time
          </li>
          <li>
            <strong>Track used tokens:</strong> Detect reuse (theft detection)
          </li>
          <li>
            <strong>Invalidate family:</strong> If reuse detected, invalidate all related tokens
          </li>
          <li>
            <strong>Grace period:</strong> Short overlap window to handle race conditions
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Handling</h3>
        <ul className="space-y-2">
          <li>
            <strong>401 handling:</strong> Always attempt refresh before redirecting to login
          </li>
          <li>
            <strong>Refresh failure:</strong> Clear all tokens, redirect to login
          </li>
          <li>
            <strong>Concurrent requests:</strong> Queue requests during refresh
          </li>
          <li>
            <strong>Network errors:</strong> Retry with exponential backoff
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Plan for Failure</h3>
          <p>
            Refresh will fail—network issues, token expiration, server errors. Design for graceful
            degradation: queue requests during refresh, retry on transient failures, clear state on
            permanent failures, and always provide a path back to login.
          </p>
        </div>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No token rotation:</strong> Static refresh tokens can be used indefinitely if stolen.
          </li>
          <li>
            <strong>Too long access token lifetime:</strong> 24-hour access tokens = 24-hour damage window.
          </li>
          <li>
            <strong>Storing tokens in localStorage:</strong> XSS = instant account takeover.
          </li>
          <li>
            <strong>No multi-tab coordination:</strong> Multiple tabs refresh simultaneously, race conditions.
          </li>
          <li>
            <strong>Not handling refresh failures:</strong> App breaks when refresh fails, no fallback.
          </li>
          <li>
            <strong>Infinite sliding sessions:</strong> Sessions that never expire are security risks.
          </li>
          <li>
            <strong>No absolute timeout:</strong> Even active sessions should eventually require re-authentication.
          </li>
          <li>
            <strong>Ignoring token reuse detection:</strong> Missing opportunity to detect token theft.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://datatracker.ietf.org/doc/html/rfc6749" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 6749: OAuth 2.0 Authorization Framework
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://auth0.com/docs/tokens/refresh-tokens" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Auth0: Refresh Tokens
            </a>
          </li>
          <li>
            <a href="https://tools.ietf.org/html/rfc8693" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 8693: OAuth 2.0 Token Exchange
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Session Management Cheat Sheet
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: Why use separate access and refresh tokens instead of one long-lived token?</p>
            <p className="mt-2 text-sm">
              A: Security through separation of concerns. <strong>Access tokens</strong> are used frequently
              (every API request), so short lifetime (15 min) limits damage if stolen.
              <strong>Refresh tokens</strong> are used rarely (once per session), stored more securely, and
              can be rotated/revoked. If you only have one long-lived token and it&apos;s stolen, attacker
              has access until it expires. With two tokens, stolen access token = max 15 min damage, stolen
              refresh token = detected on reuse (rotation).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What is refresh token rotation and why is it important?</p>
            <p className="mt-2 text-sm">
              A: <strong>Refresh token rotation</strong> means issuing a new refresh token every time the
              refresh endpoint is called, and invalidating the old one. Importance: If an attacker steals
              a refresh token, they can use it once. But when the legitimate user tries to refresh, their
              old token is rejected (already used). This detects token theft! Server can then invalidate
              all tokens for that user, force re-authentication, and alert the user. Without rotation,
              stolen tokens can be used indefinitely.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How do you handle token refresh with multiple browser tabs open?</p>
            <p className="mt-2 text-sm">
              A: Use <strong>BroadcastChannel API</strong> or <strong>localStorage events</strong> for
              cross-tab coordination. When one tab refreshes tokens, it broadcasts to other tabs. Other
              tabs skip their own refresh and use the new tokens. Also implement request queuing: if Tab A
              is refreshing, Tab B waits for Tab A to complete before retrying. This prevents race conditions
              and excessive refresh requests. If using HttpOnly cookies, all tabs automatically get new
              tokens on next request.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: What&apos;s the difference between sliding and absolute session expiration?</p>
            <p className="mt-2 text-sm">
              A: <strong>Sliding expiration:</strong> Session lifetime extends on each refresh. Active users
              stay logged in indefinitely. Good for UX, bad for security (sessions never expire).
              <strong>Absolute expiration:</strong> Session ends at fixed time regardless of activity.
              Forces periodic re-authentication. Good for security, bad for UX. <strong>Hybrid approach:</strong>
              Sliding expiration with absolute maximum (e.g., 7 days sliding, 30 days absolute). Best of
              both worlds—active users stay logged in, but must re-authenticate monthly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: How do you handle the race condition when multiple API requests fire simultaneously after token expiration?</p>
            <p className="mt-2 text-sm">
              A: Implement <strong>request queuing</strong>. When first 401 arrives, start refresh and set
              <code className="text-sm">isRefreshing = true</code>. Subsequent 401s queue their requests
              instead of triggering new refreshes. When refresh completes, process queue with new tokens.
              Key code: check <code className="text-sm">isRefreshing</code> flag, queue requests in array,
              process queue after refresh completes. This ensures only one refresh happens even with 10
              concurrent requests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: Where should refresh tokens be stored and why?</p>
            <p className="mt-2 text-sm">
              A: <strong>HttpOnly cookies</strong> are the most secure option. They&apos;re inaccessible to
              JavaScript (XSS-safe), automatically sent with requests to the refresh endpoint, and can be
              protected with Secure and SameSite flags. Never store refresh tokens in localStorage—they&apos;re
              accessible via XSS and give attackers long-term access. If you must use localStorage (e.g.,
              for mobile apps), encrypt the token and implement strict XSS protections.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
