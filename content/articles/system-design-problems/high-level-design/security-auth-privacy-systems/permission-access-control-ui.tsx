"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-permission-access-control-ui",
  title: "Design a Permission & Access Control System UI",
  description:
    "Architecture for a permission and access control system UI: role-based access control (RBAC) with role inheritance, resource-level permission matrix, UI-level permission enforcement (hide vs. disable), permission evaluation at the edge using JWT claims, real-time permission propagation when roles change, attribute-based access control (ABAC) for context-aware permissions, team and workspace membership management, and audit log for permission changes.",
  category: "high-level-design",
  subcategory: "security-auth-privacy-systems",
  slug: "permission-access-control-ui",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "rbac", "abac", "permissions", "access-control", "roles", "jwt-claims", "ui-authorization", "audit-log"],
  relatedTopics: ["authentication-system", "secure-token-session-handling"],
};

export default function PermissionAccessControlUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A permission and access control system governs what actions each user can perform in a multi-tenant or multi-role application. GitHub's organization permissions, Linear's workspace roles, and Notion's page sharing all implement variations of this pattern. The frontend has two distinct responsibilities: enforcing permissions in the UI (hide/disable features the user cannot access) and providing an admin interface for managing roles and permissions. Both require a clear mental model of the permission data structure and a consistent enforcement mechanism.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The critical insight for frontend permission enforcement: UI enforcement is cosmetic, not security. Hiding a button does not prevent an API call — a user can always call the API directly. All permission enforcement must happen server-side. The UI hides or disables features for UX reasons (reducing confusion), not for security. The server must check permissions on every request regardless of whether the UI hides the triggering button. The frontend permission system answers: "Should I show this button?" The server permission system answers: "Should I execute this action?"</HighlightBlock>
        <p><strong>Explicit scope:</strong> RBAC role model, UI permission enforcement patterns (hide vs. disable), JWT claim-based permission evaluation, permission propagation on role change, and the permissions management UI. Not in scope: ABAC policy engine implementation, OAuth scopes, or database row-level security.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>RBAC with inheritance:</strong> Roles are hierarchical: Admin &gt; Manager &gt; Member &gt; Viewer. Each role inherits all permissions of lower roles. A custom role can extend any built-in role and add or remove specific permissions. Permission is modeled as a tuple: (action, resource, scope) — e.g., (update, project, own) means "can update projects they own." Roles have a set of allowed permissions; custom roles can explicitly deny inherited permissions.</li>
          <li><strong>UI permission enforcement:</strong> The frontend receives the user's permission set as JWT claims (permissions: ["project:create", "project:update:own", "user:invite"]) after authentication. A usePermission(permission: string) React hook evaluates whether the current user has a specific permission by checking the JWT claims in the auth context. Components use this hook to conditionally render: &#123;canCreate &amp;&amp; &lt;CreateButton /&gt;&#125; (hide) or &lt;Button disabled=&#123;!canEdit&#125; /&gt; (disable). The convention: hide for features the user role never has access to; disable (with a tooltip explaining why) for features the user could access with a higher role or different context.</li>
          <HighlightBlock as="li" tier="important"><strong>Permissions management UI:</strong> The admin panel shows a matrix of (roles × permissions) with checkboxes. Admins can create custom roles, assign them to users, and configure which permissions each role has. Changes take effect immediately for new sessions; existing sessions pick up permission changes on their next token refresh (within 15 minutes). Critical permission revocations (removing admin access) are propagated immediately via WebSocket to all active sessions for the affected user.</HighlightBlock>
          <li><strong>Resource-level permissions:</strong> Some permissions are resource-scoped: a user may be able to edit specific projects but not others (project collaborator vs. project admin). Resource-level permissions are not stored in the JWT (too many potential resources — would make the token enormous). Instead, the frontend shows a generic "Edit" button (based on the user's role permission for "edit project"), and the server validates the specific resource permission on the API call. For resource-level permission errors (403 for a specific project), the UI shows "You don't have permission to edit this project" inline.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Permission evaluation performance:</strong> Permission checks in the UI must be synchronous and under 1ms (no async, no server round trips). The permission set is loaded once from the JWT claims on authentication and cached in the auth context (React context or Zustand). The usePermission hook is a simple Set.has() lookup — O(1).</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Permission propagation:</strong> When an admin changes a user's role, the affected user's permissions must update within 15 minutes (next token refresh) for non-critical changes, or immediately (WebSocket push) for critical changes (role downgrade, access revocation). The WebSocket PERMISSION_UPDATED event contains the new permission set, which the client stores in the auth context, triggering re-renders of permission-guarded components.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Audit logging:</strong> Every permission change (role assignment, custom permission override) is logged with: actorId, targetUserId, action, oldValue, newValue, timestamp, ipAddress. The audit log is shown in the admin panel as an append-only list, filterable by actor, target, and date range. Permission audit logs are immutable — they cannot be deleted or edited (enforced server-side).</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The permission system has three layers. The Data Layer: the permission set is embedded in the JWT as claims (for role-level permissions) and fetched from the API on demand (for resource-level permissions). The Evaluation Layer: the usePermission hook and a PermissionGate component evaluate permissions synchronously from the in-memory permission set. The Management Layer: the admin permissions UI reads from and writes to the permissions API, which immediately updates the database and queues a permission propagation event for affected users' active sessions. React context provides the current user's permission set to all components, with a stable reference (Zustand with shallow equality) to prevent unnecessary re-renders when unrelated state changes.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/security-auth-privacy-systems/permission-access-control-ui.svg"
          alt="Permission and access control system UI: RBAC model (Admin &gt; Manager &gt; Member &gt; Viewer hierarchy; role inherits lower perms; custom role: extend + add/deny; permission tuple: action+resource+scope e.g. project:update:own), JWT claims (permissions:['project:create','user:invite'] in access token; loaded to AuthContext on login; usePermission('project:create') → Set.has() O(1); PermissionGate component wraps UI), UI enforcement (hide: canCreate &amp;&amp; &lt;CreateButton/&gt;; disable: &lt;Button disabled={!canEdit} title='Requires editor role'/&gt;; hide=user role never has access; disable=context-specific or upgradeable), permission propagation (admin changes role → DB update → WS PERMISSION_UPDATED to affected user's sessions; client: update AuthContext permissions → re-render guarded components; non-critical: next token refresh 15min; critical downgrade: immediate WS push), resource-level 403 (user has project:update in JWT → UI shows Edit button; API returns 403 for specific resource → inline error 'No permission to edit this project'; server is authoritative), admin matrix UI (roles × permissions checkboxes; custom role builder: extend base + toggle permissions; assign role to users; audit log: immutable append-only actorId+targetId+change+timestamp)."
          caption="RBAC hierarchy (Admin&gt;Manager&gt;Member&gt;Viewer, permission tuple action+resource+scope), JWT claims permission Set (O(1) usePermission hook, loaded to AuthContext), UI enforcement (hide never-accessible, disable with tooltip for upgradeable), WS PERMISSION_UPDATED for immediate propagation on critical downgrade, resource-level 403 inline error, admin matrix UI with immutable audit log"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Permission Data Model and JWT Claims</h3>
        <HighlightBlock as="p" tier="important">The permission set in the JWT is a flat array of permission strings using the format action:resource:scope. Examples: "project:create" (create any project), "project:update:own" (update only own projects), "user:invite:team" (invite users to own team), "billing:manage" (manage billing — no scope modifier means global). The JWT is kept small by using abbreviated permission strings and only including non-default permissions (the base Viewer permissions are implicit and not listed). A typical user JWT contains 5–15 permission strings, keeping the token under 1KB.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The PermissionGate component wraps the usePermission hook: &lt;PermissionGate permission="project:create"&gt;&lt;CreateProjectButton /&gt;&lt;/PermissionGate&gt; renders its children only if the user has the permission. For the disable pattern: &lt;Button disabled=&#123;!usePermission("project:update:own")&#125; title=&#123;!canEdit ? "You need Editor access to edit projects" : undefined&#125;&gt;. The tooltip on the disabled state explains what access level is required, giving the user a path to request access rather than simply experiencing a dead button.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Permission Matrix Admin UI</h3>
        <HighlightBlock as="p" tier="important">The permissions matrix renders a two-dimensional grid: roles on columns (Admin, Manager, Member, Viewer, custom roles) and permission categories on rows (Project, User Management, Billing, API Access). Each cell shows a checkbox. Inherited permissions from lower roles are shown as checked but read-only (with a visual indicator — a lock icon or different background color). Custom role permissions can be checked or unchecked for individual cells. The matrix is rendered with React's useMemo to avoid recalculating inherited permissions on every render — the effective permission set per role (including inherited) is computed once from the role hierarchy and memoized.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Saving changes: the matrix edit is batched — the user can change multiple permissions and roles, and a single "Save changes" button submits a diff of the changes (only the delta, not the full matrix). The diff is computed by comparing the current state to the initial state (shallow object comparison). The save request: PATCH /api/roles/&#123;roleId&#125;/permissions &#123;add: ["billing:manage"], remove: ["project:delete"]&#125;. On save, the server: updates the role's permission set, identifies all users with that role, queues PERMISSION_UPDATED events for each affected user's active sessions.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Real-Time Permission Propagation</h3>
        <HighlightBlock as="p" tier="crucial">Permission propagation via WebSocket: when the server processes a role permission change, it publishes events to all active sessions of affected users. The client-side auth middleware subscribes to PERMISSION_UPDATED WebSocket events. On receiving a PERMISSION_UPDATED event: (1) validate the event's signature (it includes a server-signed token to prevent permission injection attacks — a malicious WebSocket message cannot grant elevated permissions); (2) update the auth context's permissions Set with the new permission array; (3) React re-renders all components using usePermission or PermissionGate that depend on the changed permissions. Components that previously showed a "Create" button will hide it; components that previously disabled "Delete" will enable it — all without page reload.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The signed permission event: the server signs the PERMISSION_UPDATED event with a short-lived HMAC key. The client verifies the signature before applying the new permissions. This prevents an attacker who injects WebSocket frames (e.g., through XSS) from granting themselves elevated permissions via a fake PERMISSION_UPDATED event.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Handling 403 for Resource-Level Permissions</h3>
        <HighlightBlock as="p" tier="important">Role-level permissions (in the JWT) are coarse-grained. Resource-level permissions (is this user a collaborator on project X?) are checked server-side on every API call. The UI cannot know resource-level permissions in advance without querying for each resource — too expensive at scale. Instead, the UI makes an optimistic render (shows Edit button based on role permission) and handles 403 responses gracefully: the API interceptor catches 403 responses and dispatches a PERMISSION_DENIED action to the UI state. The affected component renders an inline error message: "You don't have permission to perform this action. Contact your workspace admin to request access." For common 403 patterns (a user consistently gets 403 on all projects), the UI may proactively fetch the user's resource-level permissions for the current view (GET /api/projects/&#123;id&#125;/permissions) and hide/disable actions accordingly.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Hide vs. disable for unauthorized UI elements: hiding unauthorized UI prevents users from knowing features exist (which can be confusing if they previously had access or see them documented). Disabling with a tooltip showing why (and how to gain access) is more transparent and provides a path to resolution. The choice depends on the feature and user type: for features that no user of the current role tier will ever have (a Viewer seeing "Manage Billing"), hiding is appropriate. For features the user could unlock by requesting a role change or upgrading their plan, disabling with a clear explanation is better UX.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Permissions in JWT vs. permissions API: embedding permissions in the JWT makes them available immediately without an API call (fast, stateless). But JWT permissions can be stale — if an admin revokes access, the user's JWT still contains the old permissions until the next refresh (up to 15 minutes). The WebSocket propagation addresses this for active sessions. An alternative is to not include permissions in the JWT and instead check permissions via an API call on each page load (always current, but slower). For most applications, the 15-minute JWT staleness window (with immediate WS propagation for critical changes) is the right balance between performance and freshness.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A permission and access control system UI is built on: (1) RBAC model (hierarchical roles, permission tuples action:resource:scope, JWT claims as flat array, Set.has() O(1) evaluation); (2) UI enforcement (PermissionGate hides never-accessible features, disabled+tooltip for upgradeable features, usePermission hook from AuthContext); (3) admin matrix UI (roles × permissions grid, inherited perms locked, delta-save PATCH, custom role builder); (4) real-time propagation (HMAC-signed PERMISSION_UPDATED WS event → update AuthContext Set → React re-render of guarded components, immediate for critical downgrades); (5) resource-level 403 handling (optimistic UI show then handle 403 with inline error message); and (6) immutable audit log (actorId + targetId + old/new value + timestamp, append-only). The core principle: UI permission enforcement is for UX, not security — every permission decision must be validated server-side on every API call regardless of what the UI shows.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
