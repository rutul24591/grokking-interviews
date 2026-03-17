"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-session-management",
  title: "Session Management",
  description: "Comprehensive guide to implementing session management covering session storage, lifecycle, timeout strategies, distributed sessions, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "session-management",
  version: "extensive",
  wordCount: 7500,
  readingTime: 30,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "session", "backend", "security", "redis"],
  relatedTopics: ["token-generation", "authentication-service", "device-session-tracking", "session-revocation"],
};

export default function SessionManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Session Management</strong> is the backend system responsible for creating, 
          storing, validating, and terminating user sessions. It tracks authenticated users 
          across requests, enforces session policies, and provides the foundation for 
          authorization decisions.
        </p>
        <p>
          For staff and principal engineers, implementing session management requires 
          understanding storage options (Redis, database), timeout strategies (sliding vs 
          absolute), distributed session handling, security considerations (session fixation, 
          hijacking), and scaling patterns. The implementation must provide sub-5ms session 
          lookup while maintaining security and consistency.
        </p>
      </section>

      <section>
        <h2>Session Storage</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Redis (Recommended)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Performance:</strong> Sub-1ms latency, in-memory storage. Ideal for 
              high-frequency session lookups.
            </li>
            <li>
              <strong>TTL:</strong> Native TTL support for automatic session expiry. 
              No cleanup job needed.
            </li>
            <li>
              <strong>Structure:</strong> Hash per session (session_id → user data with
              device, ip, created_at, last_activity).
            </li>
            <li>
              <strong>Clustering:</strong> Redis Cluster for horizontal scaling. Shard 
              by session_id.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Database</h3>
          <ul className="space-y-3">
            <li>
              <strong>Performance:</strong> 5-50ms latency. Requires connection pooling.
            </li>
            <li>
              <strong>Durability:</strong> Persistent storage, survives restarts.
            </li>
            <li>
              <strong>Queries:</strong> Complex queries (user's sessions, device filtering).
            </li>
            <li>
              <strong>Cleanup:</strong> Periodic job to delete expired sessions.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Hybrid Approach</h3>
          <ul className="space-y-3">
            <li>
              <strong>Hot Sessions:</strong> Active sessions in Redis (fast lookup).
            </li>
            <li>
              <strong>Cold Sessions:</strong> All sessions in database (durability, 
              queries).
            </li>
            <li>
              <strong>Sync:</strong> Async write to database, cache-aside for reads.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Session Lifecycle</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Creation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Trigger:</strong> Successful authentication.
            </li>
            <li>
              <strong>ID Generation:</strong> Cryptographically random session ID 
              (256-bit).
            </li>
            <li>
              <strong>Metadata:</strong> Store user_id, device_info, ip_address, 
              user_agent, created_at, last_activity.
            </li>
            <li>
              <strong>Expiry:</strong> Set TTL based on timeout policy.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Validation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Lookup:</strong> Fetch session by ID from Redis.
            </li>
            <li>
              <strong>Expiry Check:</strong> Verify not expired (TTL handles this).
            </li>
            <li>
              <strong>Update Activity:</strong> Update last_activity timestamp 
              (sliding timeout).
            </li>
            <li>
              <strong>Return User:</strong> Return user_id for authorization.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Termination</h3>
          <ul className="space-y-3">
            <li>
              <strong>Logout:</strong> Delete session from store.
            </li>
            <li>
              <strong>Expiry:</strong> Automatic via TTL.
            </li>
            <li>
              <strong>Revocation:</strong> Admin/user-initiated invalidation.
            </li>
            <li>
              <strong>Password Change:</strong> Invalidate all sessions.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Timeout Strategies</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Sliding Timeout</h3>
          <ul className="space-y-3">
            <li>
              <strong>Behavior:</strong> Session extends with each activity.
            </li>
            <li>
              <strong>Use Case:</strong> Active users, good UX.
            </li>
            <li>
              <strong>Risk:</strong> Session can live indefinitely with continuous 
              activity.
            </li>
            <li>
              <strong>Implementation:</strong> Update TTL on each request.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Absolute Timeout</h3>
          <ul className="space-y-3">
            <li>
              <strong>Behavior:</strong> Session expires at fixed time regardless 
              of activity.
            </li>
            <li>
              <strong>Use Case:</strong> High-security apps, compliance requirements.
            </li>
            <li>
              <strong>Risk:</strong> User logged out mid-activity.
            </li>
            <li>
              <strong>Implementation:</strong> Store created_at + max_duration, 
              check on each request.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Hybrid Timeout</h3>
          <ul className="space-y-3">
            <li>
              <strong>Behavior:</strong> Sliding timeout up to absolute maximum.
            </li>
            <li>
              <strong>Use Case:</strong> Balance security and UX. Most common 
              approach.
            </li>
            <li>
              <strong>Implementation:</strong> Sliding TTL with created_at + 
              max_duration check.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Distributed Sessions</h2>
        <ul className="space-y-3">
          <li>
            <strong>Shared Store:</strong> All services access same Redis cluster. 
            Stateless application servers.
          </li>
          <li>
            <strong>Session Replication:</strong> Replicate sessions across regions 
            for HA.
          </li>
          <li>
            <strong>Sticky Sessions:</strong> Route user to same server (not 
            recommended, reduces flexibility).
          </li>
          <li>
            <strong>Cache Invalidation:</strong> Invalidate session across all 
            nodes on logout.
          </li>
        </ul>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <ul className="space-y-3">
          <li>
            <strong>Session Fixation:</strong> Regenerate session ID after 
            authentication.
          </li>
          <li>
            <strong>Hijacking Prevention:</strong> Bind session to device fingerprint, 
            IP range.
          </li>
          <li>
            <strong>Secure Transmission:</strong> Session ID only over HTTPS. 
            Secure cookie flag.
          </li>
          <li>
            <strong>Concurrent Session Limit:</strong> Max sessions per user 
            (e.g., 10).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Redis vs database for session storage?</p>
            <p className="mt-2 text-sm">
              A: Redis for performance (sub-1ms), native TTL, high throughput. 
              Database for durability, complex queries. Hybrid: Redis for active 
              sessions, database for audit/queries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session replication across regions?</p>
            <p className="mt-2 text-sm">
              A: Redis Cluster with cross-region replication, eventual consistency 
              acceptable for sessions. Or region-local sessions with global 
              invalidation. Trade-off: latency vs consistency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal session timeout?</p>
            <p className="mt-2 text-sm">
              A: Depends on security requirements. Consumer apps: 30-day sliding 
              (remember me). Financial: 15-minute absolute. Hybrid: 8-hour sliding, 
              30-day absolute maximum.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you invalidate all user sessions?</p>
            <p className="mt-2 text-sm">
              A: Store session IDs by user_id (Redis Set). Iterate and delete all. 
              Or use session version (increment on password change, include in 
              session, invalidate if version mismatch).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent session fixation?</p>
            <p className="mt-2 text-sm">
              A: Regenerate session ID after authentication. Delete old session, 
              create new one. Never trust session ID from unauthenticated request.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session cleanup at scale?</p>
            <p className="mt-2 text-sm">
              A: Redis TTL handles automatic expiry. For database: periodic cleanup 
              job (delete where expires_at {'<'} now()). Batch deletes, off-peak 
              execution, index on expires_at.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
