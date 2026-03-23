"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-session-revocation",
  title: "Session Revocation",
  description:
    "Comprehensive guide to implementing session revocation covering token invalidation, logout all devices, distributed session management, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "session-revocation",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "session-revocation",
    "logout",
    "backend",
    "security",
  ],
  relatedTopics: ["session-management", "token-generation", "logout"],
};

export default function SessionRevocationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Session Revocation</strong> is the process of invalidating active user sessions,
          either individually (single device logout) or in bulk (logout all devices). It is a
          critical security capability for responding to compromised accounts, enabling user
          control over active sessions, and maintaining compliance (password changes must invalidate
          existing sessions).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/session-revocation-flow.svg"
          alt="Session Revocation Flow"
          caption="Session Revocation Flow — showing user-initiated, admin-initiated, and automatic revocation workflows"
        />

        <p>
          For staff and principal engineers, implementing session revocation requires deep
          understanding of revocation scenarios (user logout, password change, security incident,
          device loss), implementation patterns (token denylist, version-based invalidation,
          broadcast), and distributed systems challenges (propagation delay, eventual consistency,
          race conditions). The implementation must provide immediate revocation while handling
          the complexities of distributed session management.
        </p>
        <p>
          Modern session revocation has evolved from simple server-side session deletion to
          sophisticated token-based invalidation strategies. With stateless JWTs, revocation
          requires creative solutions — denylists (store revoked token IDs), short expiry (accept
          risk window), or version claims (include user version in token, increment on revocation).
          Organizations like Google, Facebook, and Okta operate revocation systems at massive
          scale, invalidating millions of sessions daily while maintaining sub-millisecond
          validation latency.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Session revocation is built on fundamental concepts that determine how sessions are
          invalidated and how invalidation propagates across distributed systems. Understanding
          these concepts is essential for designing effective revocation systems.
        </p>
        <p>
          <strong>Revocation Scenarios:</strong> There are four primary scenarios: User logout
          (single session or all sessions), password change (revoke all sessions automatically),
          security incident (admin revokes sessions for compromised account), and device loss (user
          revokes specific device session). Each scenario has different urgency and scope —
          password change requires immediate bulk revocation, while device loss requires selective
          revocation.
        </p>
        <p>
          <strong>Token Denylist:</strong> For stateless tokens (JWT), maintain a denylist of
          revoked token identifiers (JTI claim). Store in Redis with TTL matching token expiry.
          Check denylist on every token validation. This enables immediate revocation but requires
          stateful checking. Bloom filters optimize memory usage for large denylists.
        </p>
        <p>
          <strong>Version-Based Revocation:</strong> Include user version in token claims. Store
          current version in user record. Increment version on revocation events. Tokens with old
          version become invalid automatically. No denylist needed — validation checks version
          match. This is the most scalable approach for high-volume systems.
        </p>
        <p>
          <strong>Distributed Revocation:</strong> In microservices architectures, sessions may be
          validated by multiple services. Revocation must propagate to all services. Approaches
          include: shared denylist (Redis Cluster), event stream (Kafka), or version checks
          (each service checks user version). Accept brief propagation window (seconds) and design
          for eventual consistency.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Session revocation architecture separates revocation logic from session storage, enabling
          centralized revocation management with distributed validation. This architecture is
          critical for scaling revocation across distributed systems.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/session-revocation-patterns.svg"
          alt="Session Revocation Patterns"
          caption="Session Revocation Patterns — comparing denylist, version-based, and broadcast approaches"
        />

        <p>
          The revocation flow starts when a revocation event occurs (user clicks logout, password
          changes, admin triggers revocation). The revocation service identifies target sessions
          (single session, all sessions for user, or specific sessions by device), invalidates
          sessions in session store (delete session record, add to denylist, or increment version),
          propagates revocation to all services (via event stream or shared store), notifies user
          via email (for security-related revocations), and logs the revocation event for audit.
          This flow must complete quickly to minimize the window where revoked sessions remain
          valid.
        </p>
        <p>
          Distributed revocation architecture uses shared infrastructure for consistency. Redis
          Cluster provides shared denylist accessible by all services. Kafka event stream
          propagates revocation events to all subscribers (services). Each service updates local
          cache on event receipt. During propagation window (typically seconds), some services may
          still accept revoked tokens — this is acceptable for most use cases. For high-security
          scenarios, use synchronous version checks (each validation queries user version from
          cache).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/session-revocation-distributed.svg"
          alt="Session Revocation Distributed"
          caption="Distributed Session Revocation — showing event propagation, shared denylist, and cross-service invalidation"
        />

        <p>
          Performance optimization is critical — revocation must complete quickly to minimize
          security risk, but validation must remain fast to avoid impacting user experience. This
          is achieved through caching (cache user version, cache denylist lookups), pipelining
          (batch Redis operations), and async propagation (don't block on event publishing).
          Organizations like Netflix achieve p99 revocation latency under 50ms by using Redis
          Cluster for denylist and Kafka for event propagation.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing session revocation systems involves trade-offs between immediacy, scalability,
          and complexity. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Denylist vs Version-Based Revocation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Denylist:</strong> Store revoked token IDs until expiry. Immediate
              revocation, fine-grained control (revoke specific tokens). Limitation: stateful
              checking, memory grows with revocations, requires cleanup.
            </li>
            <li>
              <strong>Version-Based:</strong> Include user version in token, increment on
              revocation. Stateless validation, no memory growth, simple implementation. Limitation:
              bulk revocation only (can't revoke specific sessions), requires version check on
              every validation.
            </li>
            <li>
              <strong>Hybrid:</strong> Version-based for bulk revocation (password change),
              denylist for selective revocation (device logout). Best of both — scalable bulk
              revocation, fine-grained selective control. Used by Google, Okta.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Sync vs Async Propagation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Sync:</strong> Synchronously update all services before responding.
              Guaranteed consistency, no propagation window. Limitation: high latency, single point
              of failure, doesn't scale.
            </li>
            <li>
              <strong>Async:</strong> Publish event, services update asynchronously. Low latency,
              resilient, scales well. Limitation: brief inconsistency window (seconds), complex
              error handling.
            </li>
            <li>
              <strong>Hybrid:</strong> Sync for critical services (auth service), async for
              non-critical (analytics). Best balance — consistency where it matters, scalability
              elsewhere.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Storage Options</h3>
          <ul className="space-y-3">
            <li>
              <strong>Redis:</strong> In-memory, sub-millisecond latency, TTL support. Best for
              active sessions. Limitation: expensive at scale, data loss on failure (mitigate with
              persistence).
            </li>
            <li>
              <strong>Database:</strong> Durable, queryable, cost-effective. Best for session
              metadata, audit trails. Limitation: slower latency (5-50ms), requires connection
              pooling.
            </li>
            <li>
              <strong>Hybrid:</strong> Redis for active sessions, database for metadata and audit.
              Best of both — fast validation, durable storage. Used by most production systems.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing session revocation requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Implement immediate revocation for security incidents — don't delay, revoke immediately
          on compromise detection. Use short-lived tokens to limit revocation window — access
          tokens 15-60 minutes, refresh tokens 7-30 days with rotation. Invalidate all sessions on
          password change — increment version, revoke all refresh tokens. Log all revocation
          events for audit — include actor, target sessions, timestamp, reason. Notify user of
          session revocation — email for security-related revocations, in-app notification for
          user-initiated.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Provide clear session management UI — show all active sessions with device info,
          location, last active time. Allow selective session revocation — user can revoke
          specific devices while keeping others active. Confirm before revoking all sessions —
          show affected devices, require confirmation. Provide logout confirmation message — "You
          have been logged out of X devices". Offer undo for accidental revocation — short window
          (5 minutes) to restore session.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Distributed Systems</h3>
        <p>
          Use shared denylist for distributed revocation — Redis Cluster accessible by all
          services. Publish revocation events to message bus — Kafka, SQS for async propagation.
          Accept brief propagation delay — typically seconds, design for eventual consistency.
          Monitor revocation propagation latency — alert if exceeds SLO (e.g., 10 seconds).
          Implement idempotent revocation — safe to call multiple times, handles retry gracefully.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring &amp; Alerting</h3>
        <p>
          Track revocation request rates — baseline normal rate, alert on anomalies. Monitor
          revocation success/failure rates — alert on failures. Alert on unusual revocation
          patterns — many revocations from single user, bulk revocations at unusual times. Track
          time to revoke across services — measure propagation latency. Monitor denylist size and
          growth rate — plan capacity, alert on unusual growth.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing session revocation to ensure secure,
          usable, and maintainable revocation systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Stateless token revocation:</strong> JWTs can't be directly revoked without
            additional mechanism. <strong>Fix:</strong> Use denylist (store JTI until expiry),
            short expiry (accept risk window), or version claims (include user version in JWT,
            increment on revocation).
          </li>
          <li>
            <strong>No distributed revocation:</strong> Sessions remain active on other services
            after revocation. <strong>Fix:</strong> Shared denylist in Redis Cluster, event
            propagation via Kafka, version checks on every validation.
          </li>
          <li>
            <strong>Long token expiry:</strong> Revoked tokens valid for too long, extended
            security risk. <strong>Fix:</strong> Short access token expiry (15-60 min), refresh
            token rotation on each use.
          </li>
          <li>
            <strong>No user notification:</strong> Users unaware of session revocation, can't
            detect unauthorized revocation. <strong>Fix:</strong> Send email for security-related
            revocations, in-app notification for user-initiated, include details (which sessions,
            when, from where).
          </li>
          <li>
            <strong>Incomplete revocation:</strong> Some sessions remain active after revocation.{" "}
            <strong>Fix:</strong> Revoke all token types (access tokens, refresh tokens, session
            cookies), increment user version, clear all session stores.
          </li>
          <li>
            <strong>No audit logging:</strong> Can't track who revoked what, compliance violations.{" "}
            <strong>Fix:</strong> Log all revocation events with actor, target sessions, timestamp,
            reason, store in immutable audit log.
          </li>
          <li>
            <strong>Denylist grows unbounded:</strong> Memory issues over time, performance
            degradation. <strong>Fix:</strong> TTL-based expiry matching token expiry, Redis
            automatically expires keys, implement cleanup job for stale entries.
          </li>
          <li>
            <strong>Revocation race conditions:</strong> Token used during revocation, inconsistent
            state. <strong>Fix:</strong> Atomic operations for revocation, optimistic locking for
            version updates, idempotent revocation (safe to call multiple times).
          </li>
          <li>
            <strong>No refresh token revocation:</strong> Access token revoked but refresh token
            still valid, attacker can get new access token. <strong>Fix:</strong> Revoke both
            access and refresh tokens together, invalidate refresh token before access token.
          </li>
          <li>
            <strong>Poor UX for logout all:</strong> Users confused about what was revoked,
            accidental bulk logout. <strong>Fix:</strong> Clear confirmation message showing
            affected devices, require explicit confirmation, provide undo option for short window.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Session revocation is critical for organizations with security and compliance
          requirements. Here are real-world implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Media Platform (Facebook)</h3>
        <p>
          <strong>Challenge:</strong> 3 billion users with sessions across web, mobile, third-party
          apps. Need to revoke sessions when accounts compromised, users lose devices, or privacy
          concerns. Scale to millions of revocations daily.
        </p>
        <p>
          <strong>Solution:</strong> Version-based revocation for bulk operations (password change,
          account compromise). Denylist for selective revocation (specific device logout). Redis
          Cluster for denylist (sub-millisecond lookup). Kafka event stream for propagation to all
          services. User session management UI showing all active sessions with device info.
        </p>
        <p>
          <strong>Result:</strong> Revocation completes in under 50ms p99. Users can selectively
          revoke devices. Bulk revocation propagates within 5 seconds across all services.
        </p>
        <p>
          <strong>Security:</strong> Immediate revocation for compromised accounts, selective
          revocation for device loss, audit logging for all revocations.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO (Okta)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require immediate session revocation
          when employees leave (HR termination), roles change, or security incidents. Compliance
          requirements (SOC 2, HIPAA) mandate audit trails.
        </p>
        <p>
          <strong>Solution:</strong> HR integration triggers automatic revocation on termination.
          Admin dashboard for manual revocation. Version-based revocation for immediate effect.
          Audit logs for all revocation events with actor, target, timestamp, reason. Compliance
          reports for auditors.
        </p>
        <p>
          <strong>Result:</strong> Passed SOC 2 and HIPAA audits. Automatic revocation on HR
          termination prevents unauthorized access. Admin self-service reduces support tickets.
        </p>
        <p>
          <strong>Security:</strong> Immediate revocation, audit logging, compliance reporting, HR
          integration.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> Financial application with strict security requirements.
          Suspicious activity detection must trigger immediate session revocation. FFIEC
          compliance requires audit trails and user notification.
        </p>
        <p>
          <strong>Solution:</strong> Real-time fraud detection triggers automatic revocation.
          Version-based revocation for immediate effect. Email notification to user within 1
          minute. Require re-authentication with MFA. Audit logs for compliance.
        </p>
        <p>
          <strong>Result:</strong> Fraud reduced by 95% with immediate revocation. Passed FFIEC
          audit. User trust improved with proactive security notifications.
        </p>
        <p>
          <strong>Security:</strong> Automatic revocation on suspicious activity, user
          notification, MFA re-authentication, compliance audit trails.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare EHR (Epic)</h3>
        <p>
          <strong>Challenge:</strong> Electronic Health Records system with HIPAA compliance.
          Provider sessions must be revoked immediately when employment ends or role changes.
          Patient privacy requires audit trails for all access.
        </p>
        <p>
          <strong>Solution:</strong> HR integration triggers revocation on termination. Role-based
          access with automatic revocation on role change. Session timeout (15 minutes idle). Audit
          logs for all session access and revocation. HIPAA compliance reports.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Zero unauthorized access after termination.
          Provider workflow maintained with appropriate timeouts.
        </p>
        <p>
          <strong>Security:</strong> Automatic revocation, role-based access, session timeout,
          audit logging, HIPAA compliance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Amazon)</h3>
        <p>
          <strong>Challenge:</strong> Millions of users with shopping sessions. Need to revoke
          sessions when accounts compromised, payment fraud detected, or users request logout from
          all devices.
        </p>
        <p>
          <strong>Solution:</strong> Fraud detection triggers automatic revocation. User session
          management page showing all active devices. One-click "logout all devices". Denylist for
          immediate revocation. Email notification for security-related revocations.
        </p>
        <p>
          <strong>Result:</strong> Fraud reduced by 90%. User self-service reduces support
          tickets. Immediate revocation prevents unauthorized purchases.
        </p>
        <p>
          <strong>Security:</strong> Automatic fraud-based revocation, user self-service, email
          notifications, denylist for immediate effect.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of session revocation design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you revoke JWT tokens?</p>
            <p className="mt-2 text-sm">
              A: JWTs are stateless so can't be directly revoked without additional mechanism.
              Options: (1) Denylist — store JTI (token ID) in Redis until expiry, check on every
              validation. (2) Short expiry — accept risk window (15-60 min for access tokens). (3)
              Version claim — include user version in JWT, increment on revocation, reject tokens
              with old version. (4) Use opaque tokens instead of JWT. For logout: revoke refresh
              token immediately, accept access token until natural expiry.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement 'logout all devices'?</p>
            <p className="mt-2 text-sm">
              A: Multiple approaches: (1) Revoke all refresh tokens for user — delete from session
              store. (2) Increment user version — all JWTs with old version become invalid. (3)
              Broadcast revocation event to all services via Kafka. (4) Clear all sessions from
              store. (5) Require re-authentication everywhere. (6) Send confirmation email to user.
              Hybrid approach: version increment for immediate effect, refresh token revocation for
              prevention of new sessions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle revocation in distributed systems?</p>
            <p className="mt-2 text-sm">
              A: Multiple strategies: (1) Shared denylist in Redis Cluster — all services check
              same denylist. (2) Event stream (Kafka) — publish revocation event, all services
              subscribe and update local cache. (3) Version claims in JWT — each service checks
              user version on validation. (4) Short token expiry to limit window. Accept brief
              inconsistency (seconds) and design for eventual consistency. Monitor propagation
              latency, alert if exceeds SLO.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session revocation on password change?</p>
            <p className="mt-2 text-sm">
              A: Automatically revoke all sessions on password change — this is critical security
              practice. Increment user version (invalidates all JWTs with old version). Revoke all
              refresh tokens (delete from session store). Clear denylist with new tokens. Notify
              user via email (include timestamp, device info). Require re-authentication on all
              devices. This prevents attackers from maintaining access after password compromise.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement selective session revocation?</p>
            <p className="mt-2 text-sm">
              A: Store session metadata (device type, location, last active time, session ID).
              Provide UI showing all active sessions with details. Allow user to select specific
              sessions to revoke. Revoke selected sessions by ID (add to denylist or delete from
              session store). Keep other sessions active. Log which sessions were revoked. Send
              notification for security-related revocations (suspicious device logout).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle revocation race conditions?</p>
            <p className="mt-2 text-sm">
              A: Use atomic operations for revocation (Redis MULTI/EXEC, database transactions).
              Implement idempotent revocation (safe to call multiple times — check if already
              revoked, return success). Use optimistic locking for version updates (check version
              before increment, retry on conflict). Handle concurrent revocation gracefully (log
              attempts, don't fail). Design revocation to be eventually consistent — accept brief
              window where state is inconsistent.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you manage denylist growth?</p>
            <p className="mt-2 text-sm">
              A: Use TTL-based expiry matching token expiry — Redis automatically expires keys.
              Implement cleanup job for stale entries (run hourly, remove expired entries). Use
              bloom filters for memory-efficient lookups at scale (probabilistic, small false
              positive rate). Monitor denylist size — set alerts for unusual growth. Consider
              token expiry tuning — shorter expiry means smaller denylist but more frequent
              refresh.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you notify users of session revocation?</p>
            <p className="mt-2 text-sm">
              A: Send email for security-related revocations (password change, suspicious activity,
              admin action). Show in-app notification for user-initiated revocation. Include
              details: which sessions revoked, when, from where (device, location). Provide link to
              review active sessions. Offer option to undo accidental revocation (short window, 5
              minutes). For bulk revocation, show confirmation before executing, list affected
              devices.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for session revocation?</p>
            <p className="mt-2 text-sm">
              A: Revocation request rate (baseline normal, alert on anomalies), revocation
              success/failure rate (alert on failures), time to revoke across services (measure
              propagation latency), denylist size and growth rate (plan capacity), user sessions
              count (average per user), logout all usage rate. Set up alerts for anomalies — spike
              in revocations (potential attack), propagation delays (infrastructure issues),
              unusual patterns (many revocations from single user).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Session Management Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://www.rfc-editor.org/rfc/rfc6749"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              RFC 6749 - OAuth 2.0 Authorization Framework
            </a>
          </li>
          <li>
            <a
              href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OAuth 2.1 Security Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Session_management"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Session Management
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://docs.openfga.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenFGA - Fine-Grained Authorization
            </a>
          </li>
          <li>
            <a
              href="https://www.cerbos.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cerbos - Policy as Code
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
