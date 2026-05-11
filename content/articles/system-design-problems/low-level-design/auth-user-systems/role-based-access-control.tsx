"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-role-based-access-control",
  title: "Role-Based Access Control (RBAC) UI System",
  description:
    "Production-grade RBAC with granular permissions, role hierarchies, dynamic assignment, permission caching, and privilege escalation prevention.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "role-based-access-control",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "authorization",
    "rbac",
    "permissions",
    "access-control",
    "security",
    "role-hierarchy",
  ],
  relatedTopics: [
    "login-session-management",
    "password-reset-system",
    "permission-editor-ui",
    "route-component-access-guard",
  ],
};

export default function RBACArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          Authentication verifies identity: "who are you?". Authorization determines access rights: "what can you do?". Role-Based Access Control (RBAC) is the standard approach: assign users roles (admin, editor, viewer), define permissions per role (create, read, update, delete), and enforce permissions on every request. Consider a real scenario: a user logs in as "editor". The app checks their role, fetches permissions (can create posts, edit own posts, can't delete posts). When user clicks "delete post", the app checks: user has "delete_post" permission? No—request rejected with 403 Forbidden.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Key challenges: (1) Role hierarchies (admin inherits all editor permissions, editor inherits all viewer permissions). Computing inherited permissions on every request is expensive. (2) Dynamic role assignment (user promoted to admin mid-session). Session must reflect new role within seconds, not hours. (3) Permission caching (with 1M users, fetching permissions from database on every request = 1M database queries/sec, unscalable). Cache permissions in memory/Redis, but cache invalidation is hard. (4) Privilege escalation prevention (user can't grant themselves admin role). Require another admin to assign roles. (5) Multi-role users (user has both "editor" and "support_agent" roles with different permissions—merge them). (6) Fine-grained permissions vs simplicity (RBAC groups permissions into roles, but sometimes need per-resource permissions, e.g., "edit only your own posts"). Simple RBAC doesn't support that.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Naive approach—fetch user roles and permissions from database on every API request—is too slow at scale. Better approach: cache permissions in session (fetched at login), use per-request validation (fast lookup, &lt;1ms), invalidate cache on role change, and implement privilege escalation guards (require approval for sensitive role changes).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Users have one or more roles. Roles have explicit permissions. Role hierarchies exist (admin &gt; editor &gt; viewer). Permission caching acceptable (eventual consistency, &lt; 1 minute lag). Privilege escalation prevented via approval workflow. Audit logging available for role changes.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Role Assignment:</strong> Assign roles to users (one or many).
          </li>
          <li>
            <strong>Permission Checking:</strong> Check if user has permission for action.
          </li>
          <li>
            <strong>Role Hierarchy:</strong> Admin role inherits editor permissions.
          </li>
          <li>
            <strong>Dynamic Roles:</strong> Change user roles, effective immediately or
            within TTL.
          </li>
          <li>
            <strong>Role Groups:</strong> Group users by role for bulk operations.
          </li>
          <li>
            <strong>Audit Trail:</strong> Log all role assignments and permission checks
            (optional, high-volume).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Performance:</strong> Permission check &lt; 1ms (must be cached).
          </HighlightBlock>
          <li>
            <strong>Scalability:</strong> Handle 1M users with varied roles.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Consistency:</strong> Role changes propagate to all servers within TTL.
          </HighlightBlock>
          <li>
            <strong>Security:</strong> No privilege escalation, audit trails.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases and Consistency Considerations</h3>
        <ul className="space-y-2">
          <li>User has multiple roles (editor + support_agent)—merge permissions (union, not intersection). If one role allows and one denies, allow wins (permissive).</li>
          <HighlightBlock as="li" tier="crucial">User's role changes mid-request—session cached old permissions. User makes request with new permission. Session cache TTL expires, next request has new permissions. Brief lag (~1 min) is acceptable for eventual consistency.</HighlightBlock>
          <li>User removes own admin role (attempting privilege escalation)—block immediately with error. Require another admin to remove their admin role (separation of duties).</li>
          <HighlightBlock as="li" tier="important">Permission added to role (e.g., "delete_post" added to editor role)—existing sessions don't have this until cache refresh. New sessions post-role-update have new permission. Acceptable tradeoff (eventual consistency).</HighlightBlock>
          <HighlightBlock as="li" tier="important">Race condition: user gets promoted to admin, makes request before cache invalidates—old cache still has viewer permissions. Request denied. Acceptable (security over liveness).</HighlightBlock>
          <li>User in no roles—denied all permissions. Handled as empty permission set.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">
          RBAC system has two phases: authorization setup (define roles, assign permissions) and enforcement (check permissions at request time).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Phase 1 (Setup): Define roles (admin, editor, viewer) in database. Define permissions (create_post, edit_post, delete_post, etc.) per resource. Define role hierarchy: admin → editor → viewer (each role inherits parent permissions). Link roles to permissions in a role_permissions table. Assign users to roles in user_roles table. On role change (promotion/demotion), update user_roles and broadcast invalidation event.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Phase 2 (Enforcement): On login, fetch user's roles and compute all permissions (including inherited from role hierarchy). Cache in session or Redis with TTL (5-10 minutes). On each API request, middleware checks: "Does user have permission X?" Lookup cached permissions. If permission found, allow. If not found, either deny (safe default) or fetch fresh from database (optional, for long-running requests). Most requests validate cached permissions (fast path, &lt;1ms).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Role change flow: admin changes user's role (promote/demote). System updates user_roles in database, publishes "user_role_changed" event. Subscriber invalidates user's permission cache (Redis key deletion). Next request from that user, cache miss occurs, permissions refetched from database, cache repopulated. User sees new permissions within seconds (brief lag acceptable).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Privilege escalation prevention: Separation of duties—only another admin can change someone's role to admin. User attempting to remove their own admin role blocked immediately with error. All role changes logged and audited.
        </HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/auth-user-systems/role-based-access-control.svg"
          alt="RBAC system with role hierarchy, permission matrix across roles and resources, and UI enforcement patterns including component guards and route protection"
          caption="RBAC system with role hierarchy, permission matrix across roles and resources, and UI enforcement patterns including component guards and route protection"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Data Model and Schema Design</h3>
        <p>
          Core tables: (1) users: id, email, created_at. (2) roles: id, name (admin, editor, viewer), parent_role_id (for hierarchy—admin has parent_role_id=NULL, editor has parent_role_id=admin.id). (3) permissions: id, name (create_post, edit_post, delete_post), resource (post, comment), description. (4) user_roles: user_id, role_id, assigned_at, assigned_by_id (who made the assignment), expires_at (optional, for temporary roles). (5) role_permissions: role_id, permission_id (many-to-many: one role has many permissions).
        </p>
        <p>
          Indexing: Create indexes on (user_id) on user_roles, (role_id) on role_permissions for fast lookups. Index (parent_role_id) on roles for hierarchy traversal. Index (user_id, assigned_at) on user_roles for audit queries.
        </p>
        <HighlightBlock as="p" tier="important">
          Alternative for fine-grained control: Add resource_id column to permissions (permission to edit post_id=123 specifically, not all posts). But this scales poorly (permissions table grows with resources). Better: store as policies (user can edit post if post.author_id == user.id). Hybrid: RBAC for coarse permissions (everyone with editor role can edit), policies for fine-grained (but only your own posts).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Role Hierarchy and Permission Inheritance</h3>
        <p>
          Role hierarchy: admin (top) → editor (middle) → viewer (bottom). Admin inherits all editor permissions + all viewer permissions. When checking if admin has "read_post" permission, system traverses hierarchy: (1) Check admin.role_permissions (direct). (2) Check parent role (editor) permissions recursively. (3) Return union of all inherited permissions.
        </p>
        <HighlightBlock as="p" tier="important">
          Recursive traversal is expensive. Instead, cache computed permissions: when role hierarchy is defined, precompute and cache "admin has permissions: [read, write, delete]". When hierarchy changes (new role added, hierarchy restructured), invalidate computed permission cache. Rebuild and cache. This way, looking up admin's permissions is O(1) lookup, not O(depth) recursion.
        </HighlightBlock>
        <p>
          Cycle prevention: validate on role creation that no cycles exist (admin's parent can't be editor if editor inherits from admin). Enforce at database level (foreign key constraint, cycle detection on insert).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Permission Caching and Invalidation</h3>
        <HighlightBlock as="p" tier="important">
          Cache user permissions at login: fetch the user’s roles, compute inherited permissions, and store the computed set either in the session (JWT payload) or in Redis. Use a predictable key scheme such as user_permissions plus the user identifier. Choose a TTL such as 5 to 10 minutes to balance freshness and cache hits. After the TTL expires, the next permission check refetches and repopulates.
        </HighlightBlock>
        <p>
          Cache invalidation on role change: when an admin changes a user’s role, publish a user_roles_changed event carrying the user identifier. Subscribers delete the cached permission entry for that user. The next request from that user misses cache, refetches permissions from the database, and repopulates. Typical lag is under a second for event propagation, then the next request refreshes cache.
        </p>
        <p>
          Optional: aggressive invalidation (delete cache immediately on role change). Trade: avoids lag, but increases database load if roles change frequently. Safer: time-based expiry (TTL) + event-driven invalidation (instant for urgent changes).
        </p>
        <HighlightBlock as="p" tier="crucial">
          Fallback: if cache miss (Redis down or expired), query database to fetch permissions. Don't deny access just because cache missed—degrade gracefully (slower but correct). Optimize: add second-level cache (local in-memory cache in application, fallback to Redis).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Permission Checking</h3>
        <p>Check if user has permission.</p>
        <ul className="space-y-2">
          <li>
            <strong>Middleware:</strong> Implement permission check middleware. Runs before
            handler.
          </li>
          <li>
            <strong>Decorator:</strong> Use decorators to specify required permissions:
            @RequirePermission('edit_post').
          </li>
          <li>
            <strong>Lookup:</strong> Check cached permissions for required permission.
          </li>
          <li>
            <strong>Deny:</strong> If not found, return 403 Forbidden.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Role Assignment</h3>
        <p>Assign roles to users.</p>
        <ul className="space-y-2">
          <li>
            <strong>Authorization:</strong> Only admins can assign roles (prevent privilege
            escalation).
          </li>
          <li>
            <strong>Audit:</strong> Log role change (who, what, when).
          </li>
          <li>
            <strong>Notification:</strong> Notify user of role change (email).
          </li>
          <li>
            <strong>Propagation:</strong> Role change takes effect immediately (if
            invalidating cache) or within TTL.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privilege Escalation Prevention</h3>
        <p>Prevent users from elevating own permissions.</p>
        <ul className="space-y-2">
          <li>
            <strong>Separation of Duties:</strong> Only admin (different person) can grant
            admin roles.
          </li>
          <li>
            <strong>MFA on Role Change:</strong> Changing own role requires MFA.
          </li>
          <li>
            <strong>Audit Trail:</strong> All role assignments logged and reviewed (log
            analysis).
          </li>
          <li>
            <strong>Alerts:</strong> Alert on suspicious role assignments (new admin from
            unusual IP).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Fine-Grained Permissions (ABAC)</h3>
        <p>Beyond roles: attribute-based access control.</p>
        <ul className="space-y-2">
          <li>
            <strong>Example:</strong> User can edit post if: has 'edit' permission AND
            post.author_id == user_id.
          </li>
          <li>
            <strong>Attributes:</strong> User attributes (role, department), resource
            attributes (owner, created_date), context (time, IP).
          </li>
          <li>
            <strong>Policy Engine:</strong> Evaluate complex policies (Rego, Cedar).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Trade-off:</strong> More expressive but slower to evaluate.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <p>Track RBAC health.</p>
        <ul className="space-y-2">
          <li>
            <strong>Permission Denied Rate:</strong> % of requests denied (403).
          </li>
          <li>
            <strong>Cache Hit Rate:</strong> % of permission checks from cache vs database.
          </li>
          <li>
            <strong>Role Distribution:</strong> How many users per role.
          </li>
          <li>
            <strong>Alerts:</strong> Alert if permission denied rate suddenly spikes
            (indicates misconfiguration or attack).
          </li>
        </ul>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">JWT vs Session-Based Roles</h3>
        <HighlightBlock as="p" tier="crucial">
          JWT: encode roles in token payload. Scales (no server state) but role changes
          delayed until token refresh. Sessions: store roles in Redis. Instant updates but
          requires server state.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Centralized Authorization Service</h3>
        <HighlightBlock as="p" tier="important">
          Large orgs use centralized service (Okta, AWS IAM) for role/permission
          management. Apps query service for permission checks.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing RBAC</h3>
        <HighlightBlock as="p" tier="important">
          Test: user with each role can access allowed resources, denied to others, role
          hierarchy inherited, role change effective, privilege escalation prevented.
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Attribute-Based Access Control (ABAC)</h3>
        <HighlightBlock as="p" tier="important">
          RBAC sufficient for simple apps. Complex apps use ABAC: decisions based on user
          attributes (role, department, clearance), resource attributes (owner, sensitivity),
          context (time, location). Expressive but requires policy engine (Cedar, Rego).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Delegated Permission Granting</h3>
        <HighlightBlock as="p" tier="important">
          User A can grant subset of their permissions to user B (delegation). Limited
          lifetime. Useful for temporary access (contractor, agency). Implement: delegation
          table (grantor, grantee, permissions, expires_at), check delegations in
          permission evaluation.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Time-Based Role Activation</h3>
        <p>
          Role active during certain time window (on-call rotation, shift-based access).
          Implement: role_activations table (role_id, user_id, active_from, active_until).
          Check activation time in permission evaluation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Audit Logging & Compliance</h3>
        <HighlightBlock as="p" tier="important">
          Log all authorization decisions: who attempted what, permission granted/denied,
          timestamp, context. Required for compliance (SOC 2, PCI-DSS). High-volume
          logging—sample if needed.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing RBAC at Scale</h3>
        <HighlightBlock as="p" tier="crucial">
          Load test: 100K permission checks/sec. Verify cache hit rate &gt; 99%, latency
          &lt; 1ms. Chaos test: cache down, database slow. Verify fallback (query database,
          slightly slower but correct).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="important">
          Common: admin role cached in JWT, user loses admin role, JWT still valid until
          expiry. User can perform admin actions. Solution: check revocation list or use
          shorter TTL. Another: permission check cached on client (React), server role
          changed, client still shows old UI. Solution: check permissions server-side on
          every request, don't trust client.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response</h3>
        <p>
          If unauthorized access detected: audit logs reveal what user accessed when.
          Revoke role immediately, force re-auth, investigate root cause. Review all
          actions by user during compromised period.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">RBAC vs ABAC (Attribute-Based Access Control)</h3>
        <HighlightBlock as="p" tier="important">
          RBAC: Simple, coarse-grained (admin, editor, viewer). All admins have same permissions. Scalable (few roles). Con: can't express "edit only your own posts" (requires per-resource logic). ABAC: Fine-grained, policy-driven (user can edit post if user.department == post.department && post.status != "published"). Expressive, flexible. Con: complex (policies hard to reason about), slow evaluation (each request evaluates policies), difficult to test. Most apps: RBAC for baseline, policies for fine-grained. Hybrid: use RBAC for access tiers, ABAC for resource-specific logic.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Instant vs Eventual Consistency</h3>
        <HighlightBlock as="p" tier="crucial">
          Instant consistency: role change immediately visible to user (delete cache, next request refetches). Requires event-driven invalidation (complex, needs event bus). Eventual consistency: role change visible within TTL (~5 min). Simpler (just time-based expiry). Brief lag acceptable for most apps. Trade: consistency for simplicity. High-security apps (banking): instant consistency (complex, but necessary). Most apps: eventual (TTL-based).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Centralized vs Distributed Authorization</h3>
        <HighlightBlock as="p" tier="important">
          Centralized service (Okta, AWS IAM): all apps query central service for permission checks. Simpler operationally (one source of truth), good for multi-app systems. Con: single point of failure (if Okta down, all apps deny access). Distributed: each app manages its own roles/permissions. Resilient (no central dependency), but operationally complex (permissions out of sync). Most apps: distributed (accept operational burden for resilience).
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">
          Role-Based Access Control (RBAC) is fundamental to authorization systems. For staff/principal engineers, critical architectural components: (1) Role hierarchy enabling permission inheritance (admin ⊃ editor ⊃ viewer) with precomputed permission caching to avoid recursive traversal. (2) Permission caching with TTL (5-10 minutes) and event-driven invalidation for eventual consistency. (3) Privilege escalation prevention via separation of duties (only other admins can promote to admin). (4) Multi-role support merging permissions across roles (union, not intersection). (5) Audit logging of all role changes (who, what, when) for compliance and forensics.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          At scale (1M users), permission checks are high-volume—permission lookup must be &lt;1ms (fast path via cache). Cache hits should be &gt;99% (TTL-based, event-driven invalidation). Database queries only on cache misses (graceful degradation). Redis cluster required for distributed caching with multi-region replication for consistency across regions.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          RBAC is simple and scales, but limited expressiveness (can't represent "edit only your own posts"). For fine-grained control, use ABAC (attribute-based) or hybrid (RBAC baseline + policies for specifics). Testing must cover: role hierarchies (all inherited permissions present), cache invalidation (role change visible within TTL), multi-role merging (union of permissions correct), privilege escalation prevention (user can't self-promote), role assignment edge cases (concurrent assignments). Real-world systems often combine RBAC (coarse permissions for access tiers) with attribute policies (fine-grained resource control). Integration with session management (roles in token), authentication (login fetches roles), and audit systems critical.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
