"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-rbac-dashboard",
  title: "Design a Multi-Role RBAC Dashboard System",
  description:
    "Architecture for a multi-role RBAC (Role-Based Access Control) dashboard: role and permission management UI, hierarchical role inheritance, resource-level permission grants, UI rendering conditioned on permissions (route guards, component-level visibility), permission evaluation at the API gateway, just-in-time permission checking, permission change propagation to connected sessions, audit log of permission changes, and organization-level permission overrides for enterprise tenants.",
  category: "high-level-design",
  subcategory: "enterprise-saas-systems",
  slug: "rbac-dashboard",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "rbac", "permissions", "authorization", "multi-tenant", "enterprise", "route-guards"],
  relatedTopics: ["crm-dashboard", "admin-audit-logs"],
};

export default function RBACDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">Role-Based Access Control (RBAC) is the authorization model used by virtually all enterprise SaaS products. Users are assigned roles (Admin, Manager, Contributor, Viewer), and roles are granted permissions (create:deal, read:report, delete:user). The dashboard challenge is twofold: the admin UI for managing roles and permissions (who can assign what permissions, how permission changes propagate to active sessions), and the end-user UI that adapts to the current user's permissions (hiding buttons they cannot use, blocking routes they cannot access, omitting fields they cannot see).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The complexity grows significantly in multi-tenant SaaS: each organization has its own permission configuration that overrides the platform defaults. Org A may allow all Managers to delete records; Org B may restrict deletion to Admins only. Furthermore, some products offer resource-level permissions: a user can be a Manager of Project A and a Viewer of Project B simultaneously. This creates a permission evaluation challenge that is more complex than a simple role lookup — the system must evaluate the intersection of role permissions, resource-specific grants, and org-level overrides for each authorization check.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Role management UI, permission assignment, UI permission enforcement (route guards, component visibility), permission propagation to active sessions, and resource-level grants. Not in scope: OAuth flows, SSO integration, or attribute-based access control (ABAC).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Role management:</strong> Admin UI to create custom roles, assign permissions to roles, and assign roles to users. Platform provides base roles (Admin, Manager, Contributor, Viewer) with sensible defaults. Admins can create custom roles inheriting from base roles. Permission matrix view: rows = permission actions, columns = roles, checkboxes indicate grants.</li>
          <li><strong>UI permission enforcement:</strong> Routes inaccessible to the current user redirect to a 403 page. UI components (buttons, menu items, form fields) are hidden or disabled based on the current user's permissions. Field-level visibility: certain fields in record pages are hidden for roles without read permission on that field.</li>
          <li><strong>Resource-level grants:</strong> A user can be assigned a specific role on a specific resource (e.g., "Manager of Project Alpha" without being a Manager globally). Resource-level grants override the user's global role for that resource.</li>
          <li><strong>Permission propagation:</strong> When an admin changes a user's role or permissions, all active sessions for that user must reflect the new permissions within 30 seconds without requiring a logout/login cycle.</li>
          <li><strong>Audit log:</strong> Every permission change (role assigned, role revoked, custom permission added) is logged with: who made the change, what was changed, when, and what the previous value was.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Permission check latency:</strong> API gateway authorization check adds &lt;5ms to request latency (permissions cached in Redis, not computed from DB on every request).</li>
          <li><strong>UI permission rendering:</strong> Permission-conditioned UI elements render in the same pass as the rest of the page — no loading state for permission checks that adds visual jank.</li>
          <li><strong>Propagation SLA:</strong> Permission changes reflected in all active sessions within 30 seconds of the admin action.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The permission system has two layers. The Permission Store is the source of truth: a PostgreSQL table (user_roles: userId, roleId, resourceType, resourceId, grantedBy, grantedAt) and a computed effective permissions cache in Redis (perms:{"{userId}"} → JSON set of {"{action:resource}"} pairs, TTL 5 minutes). The Authorization Service evaluates permissions for each API request: it reads from the Redis cache (fast path) or computes from PostgreSQL (cache miss). The Frontend Layer receives the current user&apos;s permission set as part of the session token (permissions embedded in JWT claims for common permissions) and uses a usePermission(action, resource) React hook to gate UI components. For permission changes, the admin action invalidates the Redis cache and publishes a PermissionChanged event to a Redis Pub/Sub channel; all SSE connections for the affected user receive the new permission set within seconds.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/enterprise-saas-systems/rbac-dashboard.svg"
          alt="RBAC dashboard architecture showing permission data model (roles table: id name org_id parent_role_id; role_permissions: role_id action resource_type; user_roles: user_id role_id resource_type resource_id; effective perms: union of role perms + resource grants; Redis cache perms:{userId} TTL 5min), permission evaluation (API gateway: extract JWT; check perms:{userId} cache; cache hit: O(1) check action in set &lt;5ms; cache miss: compute from DB: join user_roles + role_permissions + resource_grants; SET perms:{userId} TTL 5min; role hierarchy: child role inherits parent perms), admin permission management UI (permission matrix: rows=actions columns=roles; checkbox toggle → PATCH /api/roles/{id}/permissions; role assignment: user row + role dropdown → POST /api/user-roles; resource grant: grant user Manager on Project Alpha → INSERT user_roles resourceType=project resourceId=alpha; custom roles: CREATE with parent_role_id for inheritance), UI permission enforcement (usePermission hook: reads perms from Zustand store; route guard: PermissionGuard component wraps route; if !hasPermission redirect /403; component visibility: {hasPermission(edit:deal) and &lt;EditButton/&gt;}; field visibility: filter fields by required_permission; same render pass — no async permission check), permission propagation (admin changes role → PATCH /api/roles/{id} → DB write + PUBLISH perm-changed:{userId} → SSE /api/permissions/stream → browser: refresh perms store → Zustand update → UI re-renders; &lt;30s propagation; force re-auth for critical permission revocations), permission inheritance (role tree: Admin > Manager > Contributor > Viewer; child inherits all parent perms; admin can restrict: exclude specific actions from child; custom role: {name:SalesRep parent:Contributor extra_perms:[create:deal export:contacts]}), audit log (append-only permission_audit table: id ts actor_id action target_user_id role_id prev_value new_value; read-only compliance view; exportable CSV; immutable)."
          caption="Permission data model (user_roles + role_permissions + resource grants), Redis cache perms:{userId} TTL=5min for &lt;5ms API checks, admin matrix UI (checkbox toggle → PATCH), usePermission hook (same-pass UI gating, no async jank), permission propagation via Redis Pub/Sub → SSE → Zustand refresh (&lt;30s), role inheritance tree (child inherits parent, overridable), and append-only audit log"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Permission Data Model and Effective Permissions</h3>
        <HighlightBlock as="p" tier="important">The permission system uses three tables. roles (id, name, orgId, parentRoleId) defines available roles including their inheritance hierarchy. role_permissions (roleId, action, resourceType) maps each role to its allowed actions. user_roles (userId, roleId, resourceType, resourceId) assigns roles to users, optionally scoped to a specific resource. To compute a user&apos;s effective permissions: (1) fetch all user_roles for the user, (2) for each role, recursively include permissions from parent roles up the hierarchy, (3) add resource-specific grants (where resourceId is not null), (4) deduplicate. The result is a flat set of {"{action:resourceType}"} strings, e.g., {"{\"create:deal\", \"read:deal\", \"read:report\", \"update:deal\"}"}. This set is stored in Redis as a JSON array with a 5-minute TTL. When the user&apos;s permission set changes, the Redis key is deleted (invalidated), and the next API request triggers a recomputation from PostgreSQL.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Frontend Permission Enforcement</h3>
        <HighlightBlock as="p" tier="important">The current user's permissions are embedded in the JWT access token (for the most common permission actions: read:deal, create:deal, etc.) and also available via GET /api/me/permissions (the full set, in case the JWT claims are too large). On login, the permissions are loaded into the Zustand permissionsStore. The usePermission hook reads from this store: const canEdit = usePermission('update', 'deal'). Route guards are implemented as a PermissionGuard component that wraps protected routes: if the user lacks the required permission, they are redirected to /403 immediately (no async fetch needed — the permission is already in the Zustand store). Field-level visibility: each field definition includes a required_permission field. The record form filters out fields where the user lacks the required permission, before rendering — no hidden-but-present fields that could be extracted from the DOM.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The critical design requirement is that permission checks happen in the same render pass as the rest of the UI — no loading spinner for "checking permissions." This is achieved by loading permissions into Zustand synchronously on login (before rendering any protected routes) and ensuring the Zustand store is initialized before the router attempts to render any protected page. React Router's route change is deferred until the permissions store is populated, which takes &lt;100ms from the API response on login.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Permission Propagation to Active Sessions</h3>
        <HighlightBlock as="p" tier="important">When an admin revokes a user&apos;s access (e.g., terminating an employee&apos;s account), the change must take effect immediately across all active browser sessions, the user should not remain active in other tabs after being deprovisioned. The propagation chain: (1) Admin fires PATCH /api/users/{"{id}"}/roles {"{ revoke: [\"manager\"] }"}. (2) The Permission Service updates the DB, deletes the Redis cache key perms:{"{userId}"}, and publishes a PermissionChanged event to Redis Pub/Sub channel perm-changed:{"{userId}"}. (3) All SSE connections for the affected user (one per open browser tab) receive the event within seconds. (4) The browser receives the SSE event and fires GET /api/me/permissions to refresh the permission set. (5) Zustand&apos;s permissionsStore is updated. (6) PermissionGuard components re-evaluate, routes the user no longer has access to redirect to /403, and UI elements that required the revoked permission are hidden. For critical security revocations (account suspension, org-level deprovisioning), a force-logout event is sent instead: the SSE event contains {"{ forceLogout: true }"}, which triggers clearing localStorage, invalidating the access token, and redirecting to the login page.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Admin Permission Matrix UI</h3>
        <HighlightBlock as="p" tier="important">The permission matrix is a grid where rows are permission actions (create:deal, read:deal, update:deal, delete:deal, create:report, …) and columns are roles (Admin, Manager, Contributor, Viewer, custom roles). Each cell is a checkbox indicating whether the role has that permission. Checking a box fires PATCH /api/roles/&#123;roleId&#125;/permissions &#123; add: ["action:resourceType"] &#125;; unchecking fires PATCH /api/roles/&#123;roleId&#125;/permissions &#123; remove: ["action:resourceType"] &#125;. Changes are saved immediately (not batched) with optimistic UI. The matrix also shows inherited permissions: permissions inherited from a parent role are shown with a filled-but-locked checkbox (cannot be unchecked without modifying the parent role). The inheritance indicator shows "from Manager role" on hover. Permission changes cascade to all users with that role: the Role Service re-computes effective permissions for all affected users and invalidates their Redis cache entries in batch (SCAN for keys matching perms:* of users with the affected role, then DEL in pipeline).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Resource-Level Grants</h3>
        <HighlightBlock as="p" tier="important">Resource-level grants allow scoping permissions to a specific resource instance: "User A is Manager of Project Alpha, but Viewer everywhere else." The user_roles table supports this via the resourceType and resourceId columns (nullable — null means the role applies globally). When evaluating permissions for a request on a specific resource, the Authorization Service: (1) loads the user's global permissions, (2) checks for any user_roles entries with resourceType=project and resourceId=alpha, (3) if found, uses the resource-specific role's permissions in addition to (not instead of) global permissions. The "in addition to" behavior means resource grants can only grant more permissions, not revoke globally-granted permissions (for revocation, the global role must be restricted). The frontend reflects resource grants in the record page header: a "Your access: Manager (Project-specific)" badge shows the user their effective role for the current resource context.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">JWT-embedded permissions versus API-fetched permissions: embedding permissions in the JWT (signed, included in every request) eliminates the Redis lookup on every API call — the gateway decodes the JWT and reads the permission claims directly. However, JWT claims are immutable until the token is refreshed (typically 15-minute access tokens). If a user's role is revoked, they retain access for up to 15 minutes — unacceptable for security-critical deprovisions. The hybrid approach: embed common read permissions in JWT (low security risk), but check critical write/delete permissions against the Redis cache on each request. This gives &lt;5ms latency for common reads and up-to-date enforcement for sensitive writes.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Fine-grained versus coarse-grained permissions: fine-grained permissions (separate read:deal:amount versus read:deal:contact versus read:deal:stage) provide precise control but create a combinatorial explosion in the permission matrix (100+ actions × 10 roles = 1000 checkboxes). Coarse-grained permissions (read:deal covers all deal fields) are simpler to manage but cannot handle field-level visibility requirements (e.g., hide deal amount from SDRs). Most enterprise CRMs use a two-level model: coarse-grained role permissions for action-level access, with field-level visibility configured separately as field metadata (field.visibleToRoles = ["admin", "manager"]) rather than as permission rows in the matrix.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A multi-role RBAC dashboard system requires two separately designed layers. The data layer: roles + role_permissions + user_roles tables with resource-scoping support; effective permissions computed as the union of role perms + resource grants + parent role inheritance, cached in Redis (perms:{"{userId}"} TTL=5min) for &lt;5ms API checks; invalidated on role change with batch DEL. The UI layer: permissions loaded into Zustand on login (synchronous before routing); usePermission(action, resource) hook gates components in the same render pass (no async jank); PermissionGuard wraps routes for instant redirect on unauthorized access. Permission propagation uses Redis Pub/Sub → SSE → Zustand refresh (&lt;30s), with force-logout events for critical revocations. The admin matrix UI shows inheritance clearly (locked inherited checkboxes) and saves immediately per-toggle. The key design decision: embed low-risk permissions in JWT for latency, enforce high-risk permissions against Redis cache for freshness, this combination achieves both &lt;5ms authorization latency and &lt;30s revocation propagation.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
