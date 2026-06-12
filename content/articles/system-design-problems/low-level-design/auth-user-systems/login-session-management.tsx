"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-login-session-management",
  title: "Login / Auth Flow and Session Management System",
  description:
    "Production-grade authentication with credential verification, session creation, multi-device management, anomaly detection, and secure session lifecycle.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "login-session-management",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "authentication",
    "session-management",
    "login",
    "multi-device",
    "security",
    "credential-verification",
  ],
  relatedTopics: [
    "password-reset-system",
    "session-timeout-auto-logout",
    "device-session-management-ui",
    "secure-token-storage-ux",
  ],
};

export default function LoginSessionManagementArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design Login and Session Management</h1><h2>Definition &amp; Context</h2><p>Design Login and Session Management is a security-sensitive low-level design problem covering credential submission, CSRF protection, session cookie issuance, refresh rotation, step-up policy, logout, and multi-tab sync. A principal-level answer must state the authoritative server boundary, threat model, lifecycle, abuse controls, rollback, privacy, observability, and user-safe degraded behavior.</p><p>Treat server-issued session state as authoritative. Browser UI stores only safe session projection and never raw long-lived secrets. Core structures: login attempt, CSRF token, session projection, cookie policy, refresh family, expiry, step-up state, tab channel, and logout reason.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/auth-user-systems/login-session-management-runtime.svg" alt="Design Login and Session Management runtime" caption="Security flow from user intent through authoritative validation and audit." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>Problem Clarification</h3>
        <HighlightBlock as="p" tier="important">
          Login authenticates users by verifying credentials, then creates a persistent session enabling API requests without re-entering password. Consider a real scenario: user logs into Gmail on their laptop. Gmail generates a session token and stores it in a cookie. Every subsequent request (fetch emails, send) includes this token. Gmail backend validates the token and processes the request as that user. If the token is stolen (XSS attack, network eavesdropping), attacker impersonates the user.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Key challenges: (1) Multi-device support (user logs in on phone, laptop, tablet—all simultaneously active). Each device needs its own session token. (2) Session timeout (sessions can't be infinite; idle sessions must expire after 30 days, absolute expiry after 90 days). (3) Logout synchronization (user logs out on laptop; phone session must also logout—cross-device broadcast). (4) Race conditions (user rapidly logs in and out; must serialize to prevent stale state). (5) Session security (token theft via XSS/MITM must be mitigated). (6) Anomaly detection (login from 3 countries in 1 hour is impossible—block and alert).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The naive approach—store session in in-memory app server, no timeout—leads to memory leaks and scalability issues. At 1 million concurrent users, a single server can't track all sessions. Better approach: use distributed session store (Redis) with TTL, validate on every request, track metadata (device, IP, location), detect anomalies, support multi-device, and enforce global session limits.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Users have unique email and password (identity). Multiple concurrent sessions per user are allowed. Sessions expire (inactivity TTL + absolute timeout). Simultaneous logins from different devices succeed (normal for modern apps). Distributed session store (Redis or equivalent) available. Device identification possible (user-agent, IP). Audit logging available for forensics.
        </HighlightBlock>
      </section>

      <section>
        <h3>Requirements</h3>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Credential Verification:</strong> User submits email/password. System verifies password against stored bcrypt hash. Use constant-time comparison (prevent timing attacks). Return generic error on mismatch ("Invalid email or password"—don't reveal which is wrong). Enforce rate limiting on failed attempts (max 5 failed logins per email per hour) to prevent brute-force.</li>
          <li><strong>Session Creation:</strong> On successful login, generate cryptographically random 32-byte session token. Create session record with metadata: device type (web/iOS/Android), device name (Chrome 120 on MacBook Pro), IP address, geolocation (city/country from IP database), user-agent string, timestamps (created_at, last_activity). Store in Redis for fast lookup.</li>
          <HighlightBlock as="li" tier="important"><strong>Token Generation and Delivery:</strong> Generate random token, hash before storage. Return token to client in httpOnly cookie (automatic with requests) and response body (for API clients). Include session_id and user_id in token (JWT-based). Set cookie flags: Secure (HTTPS only), SameSite=Strict (CSRF protection), httpOnly (XSS protection).</HighlightBlock>
          <li><strong>Multi-Device Session Support:</strong> Allow user to be logged in on phone, laptop, tablet simultaneously. Each device gets independent session token. Provide session list UI: "Chrome on MacBook (active now)", "Safari on iPhone (active 2 hours ago)". User can logout from any device remotely (without touching it).</li>
          <li><strong>Session Timeout and Expiry:</strong> Implement two timeout types: (1) Inactivity timeout—session expires if unused for 30 days. (2) Absolute timeout—session expires 90 days after creation regardless of activity. Sliding window: each activity extends inactivity timer to 30 days from now. Background job deletes expired sessions hourly.</li>
          <li><strong>Logout and Revocation:</strong> User clicks logout. System revokes session: delete from Redis cache, add to blacklist (short TTL, 1 hour), mark in database as revoked (revoked_at=now). Return immediate logout confirmation. Next request with revoked token returns 401 Unauthorized.</li>
          <HighlightBlock as="li" tier="important"><strong>Session Validation on Every Request:</strong> Middleware checks for token (cookie or Authorization header). Query Redis for session details. Verify not expired, not revoked, matches user_id. Attach user context to request. If invalid/expired, return 401, redirect to login. Cache sessions in Redis (fast path) and fallback to database.</HighlightBlock>
          <li><strong>Cross-Tab Logout Broadcasting:</strong> When user logs out in one tab, broadcast logout event to other tabs on same device via BroadcastChannel API. Tabs detect logout event, clear auth state, redirect to login immediately (prevents stale authenticated state).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial"><strong>Security:</strong> Sessions resistant to CSRF (SameSite cookie flag), XSS (httpOnly cookie), token theft (HTTPS only, short TTL), and hijacking (device fingerprinting). No plaintext password storage. Audit all session lifecycle events.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Performance:</strong> Login request &lt; 500ms (credential verification + session creation). Session validation &lt; 10ms (Redis lookup, p99 &lt; 50ms). Session validation is on critical path; must not block API responses.</HighlightBlock>
          <li><strong>Scalability:</strong> Support 1 million concurrent sessions. Handle 100K logins/sec at peak (e.g., morning rush). Distributed session store must handle load without throttling or timeouts.</li>
          <HighlightBlock as="li" tier="important"><strong>Availability:</strong> Session service 99.99% uptime. Redis cluster with multi-region replication. Failover to replica &lt; 1 second. No single point of failure. Session lookups must gracefully degrade (cache layer, database fallback).</HighlightBlock>
          <li><strong>Compliance:</strong> Audit log all logins (success/failure, IP, timestamp, device). Retention per regulatory requirements. GDPR: delete sessions on user account deletion within 30 days.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>User logs in from new device—old device sessions remain valid.</li>
          <li>User logout from one device—only that session invalidated, others remain active.</li>
          <li>Session expires mid-request—return 401, prompt re-login.</li>
          <li>Concurrent login attempts from same user—both succeed (valid for faster networks).</li>
          <li>Session token stolen—attacker can impersonate user until expiration.</li>
          <li>User's password changes while logged in—session doesn't auto-logout (design choice).</li>
          <li>Rapid logout-login cycle—brief race condition (&lt;100ms) possible before revocation propagates.</li>
        </ul>
      </section>

      <section>
        <h3>High-Level Approach</h3>
        <HighlightBlock as="p" tier="important">
          The login and session management flow has three phases: authentication, session creation, and validation.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Phase 1 (Authentication): User submits login form with email and password. System looks up user by email in database. If user not found, return generic error "Invalid email or password" (privacy—don't reveal account doesn't exist). If found, compare provided password against stored bcrypt hash using constant-time comparison. If mismatch, increment failed_login_count, check against rate limit (5 failed per hour), return error. If match, proceed to session creation.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Phase 2 (Session Creation): Generate 32-byte cryptographically random token. Hash token with bcrypt before storage. Create session record in database: (session id, user id, token hash, device type, device name, IP address, location, user agent, created at, last activity, expires at). Store in Redis with an absolute TTL such as 90 days using a predictable key scheme like session plus the session id, mapping to minimal session metadata. Return token to client via an httpOnly cookie for browsers or an explicit token field for API clients.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Phase 3 (Validation): On every API request, extract token from cookie or Authorization header. Hash provided token, query Redis for session_id. If cache hit, return session metadata (fast path ~1ms). If cache miss, query database, update Redis cache (slow path ~50ms). Verify session not expired (expires_at &gt; now) and not revoked (revoked_at is NULL). Attach user_id to request context. Proceed to handler. If token invalid/expired/revoked, return 401 Unauthorized.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Activity Tracking: On each request, update last_activity timestamp (asynchronously, don't block request). Batch updates in background to avoid per-request database writes (would be 1M writes/sec at scale). Update Redis cache as well (extending inactivity timeout).
        </HighlightBlock>
        <p>
          Logout: User clicks logout. Delete session from Redis (immediate revocation), add token to blacklist (short TTL), mark session as revoked in database. Return 200 OK. Next request with old token returns 401 (token in blacklist).
        </p>
      </section>

      <section>
        

        <h3>Detailed Design</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Credential Verification and Rate Limiting</h3>
        <HighlightBlock as="p" tier="important">
          Authentication begins by querying the database for a user by email. If email not found, the system must not reveal this (privacy—prevent user enumeration). Instead, return the same error as if email was found but password wrong: "Invalid email or password". To prevent timing attacks revealing whether email exists, add random delay (100-500ms) when email not found. This makes the response time consistent regardless of found/not-found, preventing attackers from probing which emails are registered.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          If user is found, compare provided password against stored password_hash using bcrypt.compare() (constant-time comparison). Bcrypt is deliberately slow (tunable rounds, default 12) to make brute-force expensive. On mismatch, increment failed_login_count in database, check against rate limit (max 5 failures per email per hour). After limit exceeded, lock account temporarily or require CAPTCHA on next attempt. Log failed attempt (timestamp, IP, user_id) for audit.
        </HighlightBlock>
        <p>
          On successful password match, clear failed_login_count and proceed to session creation. Optionally log successful login for audit trail.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Creation and Token Generation</h3>
        <p>
          After credential verification succeeds, create a new session record. Generate 32-byte cryptographically random token using crypto.randomBytes(32) (Node.js). Encode as base64url for URL safety. Never store plaintext token in database—hash it first with bcrypt (like passwords). Hash prevents database breaches from exposing valid session tokens.
        </p>
        <p>
          Session record includes: (1) user_id (foreign key). (2) token_hash (bcrypt hash of token, indexed for fast lookup). (3) device metadata: device_type (web/iOS/Android), device_name (parsed from user-agent: "Chrome 120 on MacBook Pro"), ip_address, geolocation (city/country from IP database), user_agent string. (4) timestamps: created_at (session inception), last_activity (last API request), expires_at (absolute expiry, created_at + 90 days). (5) revoked_at (NULL until logged out).
        </p>
        <HighlightBlock as="p" tier="important">
          Store sessions in the database for persistence and audit. Additionally, cache a minimal session view in Redis for fast lookups. Use a predictable key scheme such as session plus the session identifier, and store only the fields needed for request validation such as user id, expiry time, device label, and revoked state. Set Redis TTL to the absolute expiry window. This dual storage keeps audit history durable while keeping the request path fast.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Delivery and Storage</h3>
        <p>
          Return session token to the client via either an httpOnly cookie or an explicit token field in the API response for non-browser clients. For cookies, set a session cookie with Secure, SameSite, and httpOnly attributes so the browser automatically includes it on subsequent requests, while JavaScript cannot directly read it.
        </p>
        <p>
          Client storage depends on platform. Browsers store the cookie automatically. Mobile apps store the token in OS-provided secure storage (Keychain on iOS, Keystore on Android). Subsequent API requests include the cookie automatically, or include a Bearer token in the Authorization header for API clients.
        </p>
        <p>
          Server-side token lookup: middleware extracts the token from the cookie or the Authorization header. Hash the provided token, then query Redis for session metadata on the fast path. Use a predictable key scheme such as session plus the token hash, and store minimal metadata such as session id, user id, expiry, device label, and revoked state. If Redis misses, fall back to a database query and repopulate Redis.
        </p>
        <p>
          Distributed cache: at scale (1M concurrent sessions), single Redis node is bottleneck. Use Redis Cluster with multi-region replication. Token lookup can hit any replica. Logout (revocation) must propagate immediately across regions (use event-driven approach: logout event published to all regions, subscribers invalidate local cache).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Validation</h3>
        <p>Verify session on each request.</p>
        <ul className="space-y-2">
          <li>
            <strong>Token Lookup:</strong> Query Redis for session_id by token.
          </li>
          <li>
            <strong>Cache Hit:</strong> Fast path—return cached metadata.
          </li>
          <li>
            <strong>Cache Miss:</strong> Query database, update cache (TTL reset).
          </li>
          <li>
            <strong>Expiration Check:</strong> Verify session not expired. Return 401 if
            expired.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Activity Tracking</h3>
        <p>Update session last_activity on each request.</p>
        <ul className="space-y-2">
          <li>
            <strong>Async Update:</strong> Update last_activity in background (don't block
            request).
          </li>
          <li>
            <strong>Batch Updates:</strong> Defer updates, write in batches to reduce DB
            writes.
          </li>
          <li>
            <strong>Sampling:</strong> Only update every 5min (not on every request) to
            reduce overhead.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multi-Device Session Management</h3>
        <p>Track multiple concurrent sessions per user.</p>
        <ul className="space-y-2">
          <li>
            <strong>Session List:</strong> Query all sessions for user_id from database.
          </li>
          <li>
            <strong>Device Display:</strong> UI shows "Chrome on MacBook", "Safari on
            iPhone".
          </li>
          <li>
            <strong>Remote Logout:</strong> User can logout from any device without
            touching it.
          </li>
          <li>
            <strong>Suspicious Activity:</strong> If new device detected from different
            country, prompt MFA.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Logout & Invalidation</h3>
        <p>Immediately revoke session on logout.</p>
        <ul className="space-y-2">
          <li>
            <strong>Token Revocation:</strong> Delete token from Redis, add to blacklist
            (short TTL).
          </li>
          <li>
            <strong>Session Deletion:</strong> Delete session record from database.
          </li>
          <li>
            <strong>Instant Effect:</strong> Logout immediate—next request with token fails
            401.
          </li>
          <li>
            <strong>Cross-Tab Logout:</strong> Use BroadcastChannel API to logout all tabs
            on same device.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Timeout</h3>
        <p>Expire idle sessions.</p>
        <ul className="space-y-2">
          <li>
            <strong>Inactivity Timeout:</strong> Session expires 30 days after last
            activity.
          </li>
          <li>
            <strong>Absolute Timeout:</strong> Session expires 90 days after creation
            regardless of activity.
          </li>
          <li>
            <strong>Renewal:</strong> On activity, reset inactivity timer (sliding window).
          </li>
          <li>
            <strong>Background Cleanup:</strong> Job runs hourly to delete expired sessions.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Security Considerations</h3>
        <p>Secure session management.</p>
        <ul className="space-y-2">
          <li>
            <strong>httpOnly Cookie:</strong> Token in httpOnly cookie prevents JavaScript
            XSS theft.
          </li>
          <li>
            <strong>Secure Flag:</strong> Cookie only sent over HTTPS.
          </li>
          <li>
            <strong>SameSite:</strong> Cookie not sent in cross-site requests (CSRF
            protection).
          </li>
          <li>
            <strong>CSRF Token:</strong> Additional CSRF token in request body for POST
            requests.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track session system health.</p>
        <ul className="space-y-2">
          <li>
            <strong>Active Sessions:</strong> Total concurrent sessions, sessions per user
            (distribution).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Validation Latency:</strong> Session lookup time (p50, p95, p99).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Alerts:</strong> Alert if session lookup &gt; 100ms (cache issue).
          </HighlightBlock>
          <li>
            <strong>Timeout Rate:</strong> % of requests with expired sessions.
          </li>
        </ul>
      </section>

      <section>
        <h3>Implementation Considerations</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">JWT vs Session Tokens</h3>
        <HighlightBlock as="p" tier="important">
          JWT is stateless (no server-side session), but token revocation requires
          blacklist. Session tokens are stateful but revocation is instant.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cookie vs Header Storage</h3>
        <HighlightBlock as="p" tier="crucial">
          httpOnly cookie is more secure (no XSS theft) but requires CSRF protection.
          Authorization header avoids CSRF but vulnerable to XSS. Use both.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Redis Cluster for Session State</h3>
        <HighlightBlock as="p" tier="important">
          Single Redis node is bottleneck. Use Redis Cluster with replication for
          multi-region, failover resilience.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Sessions</h3>
        <HighlightBlock as="p" tier="important">
          Test: valid login, invalid credentials, expired session, concurrent logins,
          logout, cross-device sessions.
        </HighlightBlock>
      </section>

      <section>
        <h3>Advanced Production Patterns</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Distributed Session Synchronization</h3>
        <HighlightBlock as="p" tier="important">
          In multi-region deployments, session created in region A must be readable in
          region B (user traveling). Use: Redis replication, session store in central
          database, or eventual consistency with sync protocol. Trade latency for
          consistency.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Anomaly Detection</h3>
        <p>
          Monitor suspicious patterns: login from 3 countries in 1 hour (impossible travel),
          10 new devices in one day, 100 failed logins. Trigger MFA, account lockout, or
          email alerts. Use anomaly scoring (Bayesian) for probabilistic detection.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Token Rotation</h3>
        <p>
          Issue new token on each request (or per-interval) to limit exposure window of
          compromised token. Trade: increased database load + complexity vs improved
          security. At 1M users, rotating tokens per-request is expensive (1M writes/sec).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Device Fingerprinting</h3>
        <p>
          Hash device characteristics (user-agent, IP, canvas fingerprint) to detect
          session token reuse on different device (stolen token). If fingerprint
          mismatch, require MFA. Not foolproof (fingerprints spoof) but adds friction
          to attackers.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Compliance & Audit Logging</h3>
        <HighlightBlock as="p" tier="important">
          Log all session lifecycle events: login (success/failure), logout, timeout, IP
          change. Required for compliance (PCI-DSS, SOC 2). Store in audit log (immutable).
          Query by user for forensics.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">High-Availability Session Store</h3>
        <p>
          Session store is critical path. Single point of failure fails entire app. Use:
          Redis Cluster with multi-region replication, failover to replica in &lt;1s.
          Monitor replication lag—if &gt;100ms, alert. Consider backup session store
          (database).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Session Behavior at Scale</h3>
        <HighlightBlock as="p" tier="crucial">
          Load test: 100K concurrent sessions, 10K logins/sec. Measure cache hit rate,
          lookup latency, session store throughput. Chaos test: Redis down, database
          slow, network partition. Verify graceful degradation, no data loss.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="important">
          Common: session token never invalidated after logout (token reuse). Solution:
          always check Redis for revocation. Another: session sharing across users
          (user A token accepted for user B) due to token hash collision or bypass logic.
          Solution: strict token validation. Another: distributed session reads hit
          stale replica (session logged out in region A but cache in region B hasn't
          synced). Solution: sync token revocation immediately or use strong consistency.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Debugging Session Issues</h3>
        <HighlightBlock as="p" tier="important">
          If users mysteriously logged out, check: session timeout configuration, Redis
          memory limit (sessions evicted), replication lag (multi-region sync delay),
          application bugs (invalidating wrong session). Implement detailed logging: every
          session operation (create, validate, expire) with timestamp, user_id, outcome.
          Correlate with user reports for root cause.
        </HighlightBlock>
      </section>

      <section>
        <h3>Trade-offs and Considerations</h3>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Stateful vs Stateless Sessions</h3>
        <HighlightBlock as="p" tier="important">
          Stateful sessions (server maintains session state): Pros—instant revocation (logout immediately invalidates), no token encoding complexity, flexible permissions (can change mid-session). Cons—requires session store (Redis/DB), scales through sharding/replication. Stateless sessions (JWT, signed token, no server state): Pros—scales horizontally (no server state needed, any server validates signature), ideal for microservices. Cons—revocation is hard (token valid until expiry even after logout), requires blacklist for revocation (defeats stateless benefit). Hybrid: stateful for web (instant revocation), stateless for APIs (scale).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Timeout Tuning</h3>
        <HighlightBlock as="p" tier="crucial">
          Inactivity timeout (30 days): extends with activity (UX-friendly, users don't get logged out while active). Absolute timeout (90 days): hard limit regardless of activity (security—eventually forces re-auth). Too short (7 days): users annoyed, re-login frequently, support burden. Too long (180 days): stolen token valid for months, security risk. 30-day inactivity + 90-day absolute is practical for most apps. Adjust based on security posture: banking (7-day absolute), social media (60-day inactivity).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multi-Device vs Single-Device Sessions</h3>
        <HighlightBlock as="p" tier="important">
          Multi-device (allow simultaneous logins): matches modern user behavior (user on phone + laptop). Cons—complexity (track per-device sessions, logout one device, sync across devices). Single-device (one session per user—login device B logs out device A): simpler, but frustrating (user can't be on multiple devices). Real-world: multi-device is expected, worth the complexity.
        </HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate user intent, browser-safe projection, server validation, durable security record, audit evidence, and cleanup. Frontend state improves UX but never replaces server enforcement. Tokens, challenges, sessions, and privileged grants need explicit expiry and revocation.</p><p>Treat server-issued session state as authoritative. Browser UI stores only safe session projection and never raw long-lived secrets.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/auth-user-systems/login-session-management-recovery.svg" alt="Design Login and Session Management threat recovery" caption="Threat recovery: validate, deny safely, preserve authoritative truth, audit, and recover." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Server session and rotated refresh family are authoritative. Client projection is eventually refreshed and cleared on invalidation. Scale and threat pressure comes from credential stuffing, replay, refresh reuse, concurrent tabs, expiry, network retries, and account lockout. Fail closed for privilege while keeping error UX actionable.</p></section>
<section><h2>Best practices</h2><p>Use short-lived scoped grants, secure cookies, CSRF defenses, replay prevention, rotation, versioned writes, server-side authorization, rate limits, redacted logs, and explicit audit events. Test expiry, replay, revocation, retries, multiple tabs, and permission drift.</p></section>
<h3>Principal defense: authority, consistency, and abuse cost</h3><p>Use server-authoritative consistency for security decisions. Browser state is a revocable projection that can improve responsiveness but cannot grant access, extend expiry, or confirm a privileged transition. Every mutation carries a version, expiry, nonce, or idempotency key as appropriate; stale projections refresh or fail closed. Rollback means revoking the grant, session family, policy version, or pending intent while retaining an audit trail.</p><p>Model abuse and cost together. Rate-limit sensitive attempts by account, device, network, and risk cohort without turning the UI into an enumeration oracle. Bound session inventory, audit retention, challenge issuance, cross-tab broadcasts, and refresh retries. Emit denial reason classes, revocation lag, suspicious reuse, policy version, and correlation ids while avoiding sensitive payloads in telemetry.</p><section><h2>Common Pitfalls</h2><p>Common failures include trusting frontend guards, storing bearer tokens in localStorage, leaking account existence, missing idempotency, weak redirect validation, and incomplete audit evidence.</p><p>For this topic, rate-limit login, rotate refresh tokens, detect reuse, clear tabs on logout, preserve redirect safely, and show actionable errors.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to user identity and access workflows where convenience must not weaken authoritative server enforcement or incident evidence.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>What is authoritative?</h3><p>Server session and rotated refresh family are authoritative. Client projection is eventually refreshed and cleared on invalidation.</p><h3>What breaks under abuse?</h3><p>credential stuffing, replay, refresh reuse, concurrent tabs, expiry, network retries, and account lockout.</p><h3>How do you recover?</h3><p>rate-limit login, rotate refresh tokens, detect reuse, clear tabs on logout, preserve redirect safely, and show actionable errors.</p><h3>What does the client enforce?</h3><p>The client improves usability and fails closed for privileged views; the server enforces every protected read and mutation.</p><h3>How do you observe incidents?</h3><p>Emit redacted audit records with subject, actor, policy version, reason, outcome, and correlation id.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.rfc-editor.org/rfc/rfc7636" target="_blank" rel="noreferrer">RFC 7636 PKCE</a></li><li><a href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="noreferrer">WebAuthn Level 3</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noreferrer">MDN Cookies</a></li><li><a href="https://owasp.org/www-project-cheat-sheets/" target="_blank" rel="noreferrer">OWASP Cheat Sheets</a></li></ul></section>
</ArticleLayout>}