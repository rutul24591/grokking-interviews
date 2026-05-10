"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-permission-editor-ui",
  title: "Permission Editor UI System",
  description:
    "Designing interfaces for granting and managing fine-grained permissions to users and roles with safety guarantees and audit trails.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "permission-editor-ui",
  wordCount: 6600,
  readingTime: 40,
  lastUpdated: "2026-05-06",
  tags: ["lld", "permissions", "rbac", "access-control", "admin", "ui-design"],
  relatedTopics: [
    "role-based-access-control",
    "admin-impersonation-ui",
    "route-component-access-guard",
  ],
};

export default function PermissionEditorUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          An admin must grant a new employee permission to view documents, but
          not delete them. Another admin needs to bulk-grant a team of 20
          contractors temporary access to a project. A senior engineer discovers
          that a junior engineer has admin permissions (over-privileged).
          Managing fine-grained permissions at scale is error-prone and
          dangerous without proper UI.
        </p>
        <p>
          The challenge is multi-faceted. First, complexity of representation: a
          modern app might have 100+ granular permissions (documents.read,
          documents.edit, documents.comment, documents.delete, documents.share,
          users.read, users.edit, users.deactivate, teams.create, teams.delete,
          etc.). Presenting 100 checkboxes is unusable—users click random boxes
          and miss critical settings. Second, hierarchy and inheritance:
          granting "documents.edit" should imply "documents.read" (can't edit
          without reading). If a permission tree is deep, displaying all levels
          becomes unwieldy.
        </p>
        <p>
          Third, error prevention: accidentally granting excessive permissions
          is a security incident. An admin intends to grant "documents.read" but
          clicks "documents.delete" by mistake. Without confirmation or visual
          indicators, the mistake silently succeeds. Fourth, scale: bulk-editing
          permissions for 50 users individually is tedious. A bulk edit feature
          ("grant team.read to all contractors") is necessary but risky (must
          show preview of changes before committing).
        </p>
        <p>
          Fifth, auditability: if permissions are granted incorrectly, admins
          need to trace what happened, who did it, and when. An audit log
          showing "Admin Alice revoked user.deactivate from User Bob at
          2026-05-05 14:23 UTC" is essential for security and compliance.
        </p>
        <p>
          Naive UIs fail at multiple points. A flat list of checkboxes is
          overwhelming. Nested checkboxes without inheritance logic confuse
          admins (granting parent doesn't grant child). No bulk edit means hours
          of clicking for large changes. No confirmation on dangerous operations
          (delete permissions) leads to mistakes. No audit trail means no
          accountability.
        </p>
        <p>
          <strong>Explicit assumptions:</strong> Permission hierarchy is
          well-defined (parent/child relationships known). Permissions are
          immutable strings managed server-side. Bulk operations affect all
          selected users identically. Admins have sufficient permissions to
          grant others (can't grant permissions you don't have). Audit trail is
          append-only and tamper-proof. Frontend UI is trust-advisory; backend
          enforces all changes.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Functional Requirements
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Display Grantable Permissions:</strong> Show all permissions
            that the current admin can grant (subset of all permissions if admin
            has limited authority). Include permission name, description, and
            category for clarity.
          </li>
          <li>
            <strong>Grant and Revoke:</strong> Toggle individual permissions
            on/off with immediate visual feedback. Show three states: granted
            (✓), revoked (×), inherited (◑). Clicking a granted permission
            revokes it; clicking a revoked permission grants it.
          </li>
          <li>
            <strong>Hierarchical Organization:</strong> Group permissions by
            category (Documents, Users, Settings, Teams) to reduce cognitive
            load. Optionally use collapsible trees to show parent-child
            relationships (documents.* parent of documents.read, documents.edit,
            etc.).
          </li>
          <li>
            <strong>Role Presets:</strong> Provide one-click role assignment
            (Viewer, Editor, Owner, Admin). Clicking "Viewer" instantly grants
            all viewer permissions and revokes others. Presets must show their
            permission content before applying (transparency).
          </li>
          <li>
            <strong>Permission Inheritance:</strong> Granting "documents.*"
            (parent) automatically grants "documents.read", "documents.edit",
            etc. Revoking parent revokes children. Show inherited permissions
            distinctly (lighter color, italicized) so admin knows they didn't
            grant them explicitly.
          </li>
          <li>
            <strong>Bulk Edit for Multiple Users:</strong> Select multiple users
            and apply role/permissions in one operation. Show a preview of what
            will change across all selected users before confirming.
          </li>
          <li>
            <strong>Validation and Warnings:</strong> Warn if admin attempts to
            grant permissions they don't have ("You can't grant admin access
            unless you're an admin"). Prevent revoking own admin permission if
            you're the only admin (anti-lockout). Confirm dangerous operations
            (revoking all permissions, granting admin).
          </li>
          <li>
            <strong>Audit Trail:</strong> Log every permission change: who
            changed it, when, what changed (before/after), and optional reason.
            Provide audit history view per user showing all permission
            modifications.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Non-Functional Requirements
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Usability:</strong> Non-technical admins should understand
            the interface without help. Avoid jargon. Use clear visual hierarchy
            and grouping. Load times under 2 seconds even with large permission
            sets (100+).
          </li>
          <li>
            <strong>Performance:</strong> Toggling a permission should reflect
            instantly in UI. Saving changes should complete within 3 seconds
            (include API call). Bulk operations on 100+ users should still feel
            responsive (show progress).
          </li>
          <li>
            <strong>Safety:</strong> Prevent accidental permission changes.
            Require confirmation on dangerous operations. Show clear
            before/after state. Provide undo for recent changes (revert
            permission state to 1 hour ago if needed).
          </li>
          <li>
            <strong>Scalability:</strong> Support apps with up to 500 grantable
            permissions. Scale to millions of users (bulk edit with pagination
            if needed). Audit trail should not impact API performance.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          A permission editor UI has three components: permission selection,
          role presets, and confirmation/audit. Users start by selecting target
          (a specific user, or multiple users for bulk edit). The UI then
          displays available permissions grouped by category. Admins toggle
          permissions on/off, or select a preset role. Changes are reflected
          immediately (toggle instant, but marked as "unsaved"). Before saving,
          show a summary: what permissions will be granted/revoked and any
          warnings (dangerous operations, self-lock risks). On confirm, send to
          backend, which validates, logs the change, and updates the user's
          permissions.
        </p>
        <p>
          Key principles: (1) Show permissions hierarchically to reduce
          overwhelming users with 100+ items. (2) Provide quick role presets for
          common patterns (most admins don't need granular control; they pick
          "Viewer" or "Editor"). (3) Mark inherited permissions distinctly so
          admins understand what they're not explicitly granting. (4) Confirm
          dangerous operations before executing. (5) Log all changes for audit
          and reversal. (6) Always fail-safe: if an operation is risky, require
          explicit confirmation; don't proceed silently.
        </p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/auth-user-systems/permission-editor-ui.svg"
          alt="Permission editor UI with toggle controls, data model with role inheritance, bulk operations, and audit trail requirements"
          caption="Permission editor UI with toggle controls, data model with role inheritance, bulk operations, and audit trail requirements"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Permission Model and Representation
        </h3>
        <p>
          Each permission is represented by a unique string identifier (e.g.,
          "documents.read", "users.delete"). The identifier uses dot notation to
          indicate hierarchy: "documents" is a category, "documents.*" is a
          wildcard matching all document permissions. A permission object
          includes: ID (unique string), display name (human-readable like "View
          documents"), description (longer explanation), category (Documents,
          Users, Teams), parent (optional parent permission for inheritance),
          and dangerous flag (true for operations like "delete", "deactivate").
        </p>
        <p>
          Permission hierarchy is explicit and server-defined. If "documents.*"
          is a parent permission, the server declares this relationship in the
          permission manifest. The UI uses this manifest to render hierarchies
          and compute inherited permissions. All permission definitions are
          immutable server-side; the frontend doesn't invent permissions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          UI Organization: Hierarchy and Presentation
        </h3>
        <p>
          Permissions are displayed organized by category to prevent
          overwhelming users. A "Documents" section shows documents.read,
          documents.edit, documents.delete. A "Users" section shows user.read,
          users.edit, users.deactivate. This grouping immediately makes the UI
          more scannable.
        </p>
        <p>
          Within each category, optionally use a tree structure to show
          parent-child relationships. Parent permissions (documents.*) can be
          expanded to show children (documents.read, documents.edit, etc.).
          Clicking the parent checkbox grants/revokes all children. This is more
          compact than showing all permissions flat and allows admins to grant
          broad access quickly (grant "documents.*" instead of clicking each
          child individually).
        </p>
        <p>
          Alternative presentation is grouped checkboxes without tree expansion:
          show all permissions in their category flat, but visually group
          children under parent (indented, slightly lighter). This is simpler to
          implement and understand but less compact with deep trees.
        </p>
        <p>
          Include a search box to filter permissions by keyword. Admins can
          search "delete" to see all deletion permissions, or "documents" to see
          all document-related permissions. This is essential for large
          permission sets (100+).
        </p>
        <p>
          <strong>Responsive Design and Mobile-Friendly Organization:</strong>{" "}
          Permission editors are often accessed from admin dashboards on
          desktop, but mobile admins might need access too. On mobile, a tree
          structure with expansion is ideal (reduces scroll height, shows only
          expanded categories). On desktop, show full tree or flat grouped list.
          Additionally, use sticky headers for categories so admin knows which
          category they're scrolling through in a long list. For search results
          spanning multiple categories, show the category name next to each
          permission (e.g., "Documents &gt; Delete [permissions.delete]") to
          clarify context.
        </p>
        <p>
          <strong>Accessibility and Keyboard Navigation:</strong> Permissions UI
          should be fully keyboard navigable. Use arrow keys to expand/collapse
          trees, Space/Enter to toggle checkboxes. Implement ARIA roles (tree,
          treeitem) for assistive tech. For admins using screen readers, ensure
          each permission has a clear label and description. A permission row
          should announce: "documents.edit, Edit documents, currently granted,
          dangerous permission". Tab order should follow visual hierarchy (move
          through categories, then permissions within category).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Three-State Checkboxes: Granted, Revoked, Inherited
        </h3>
        <p>
          A permission can be in one of three states: (1) Granted: admin
          explicitly granted this permission to the user. (2) Revoked: admin
          explicitly revoked, or never granted. (3) Inherited: admin granted
          parent permission, so this child is implicitly granted. The UI shows
          these states distinctly. Granted is a filled checkbox (✓). Revoked is
          an empty checkbox (☐). Inherited is a partially filled checkbox (◐)
          with lighter color or italic text. This clarity prevents confusion:
          admin sees that "documents.read" is inherited from "documents.*" and
          didn't need to grant it explicitly.
        </p>
        <p>
          Clicking a granted checkbox revokes it. Clicking a revoked checkbox
          grants it. Clicking an inherited checkbox is tricky: revoke the
          parent, or grant it explicitly (overriding inheritance to grant just
          this one)? Most systems prevent clicking inherited checkboxes
          directly; instead, revoking the parent handles it. This simplifies
          logic: inherited permissions are read-only until you change the
          parent.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Role Presets and Templates
        </h3>
        <p>
          Most admins don't need granular permission control. They want to
          assign a user a role: "Viewer", "Editor", "Owner", "Admin". Role
          presets are predefined permission sets. "Viewer" grants
          [documents.read, documents.comment, teams.read]. "Editor" grants
          [documents.read, documents.edit, documents.comment, teams.read].
          Clicking a preset applies all associated permissions in one action.
        </p>
        <p>
          Before applying a preset, show a preview: "Viewer role will grant
          these permissions: ..." and "... revoke these permissions: ...". This
          prevents accidental downgrades. Allow admin to customize the preset
          before applying (toggle individual permissions within the preset).
        </p>
        <p>
          Optional: support custom presets. Admin creates their own permission
          set (documents.edit, users.read, no delete), saves it as
          "DataAnalyst", and can reuse it for multiple users. Custom presets
          must be saved to the backend for durability across sessions.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Handling Permission Inheritance and Effective Permissions
        </h3>
        <p>
          Computing effective permissions (the actual permissions a user has
          after inheritance) is server-side logic. The backend recursively
          expands all parent permissions and returns the union. The frontend
          receives and displays this effective set. When admin grants
          "documents.*", the backend computes that this includes
          "documents.read", "documents.edit", etc., and the UI displays all as
          granted.
        </p>
        <p>
          The UI must not compute inheritance on the frontend; this is
          error-prone and violates single source of truth. If permission
          hierarchy changes server-side, frontend logic will be stale. Always
          ask the backend: "if I apply these permission changes, what will the
          effective permissions be?" and display the response.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Safety Features and Confirmation Dialogs
        </h3>
        <p>
          Dangerous permissions (marked dangerous: true on the server) require
          explicit confirmation before granting. If admin clicks the
          "users.deactivate" checkbox, a modal appears: "Are you sure you want
          to grant 'Deactivate users' permission? This is a powerful action.
          Confirm?" Only after confirmation is the change committed.
        </p>
        <p>
          Prevent self-lock: if the current admin is the only admin (only user
          with "admin" permission), and they attempt to revoke "admin" from
          themselves, block it. Show message: "You are the only admin. Revoking
          admin permission would lock you out. Assign admin to another user
          first." This prevents accidental lockouts.
        </p>
        <p>
          Warn on insufficient permissions: if admin lacks "documents.edit" but
          is trying to grant it to others, show warning: "You don't have this
          permission yourself. This change will proceed but may not work as
          intended." (Actually, the backend should reject this, but frontend can
          warn upfront.)
        </p>
        <p>
          Show before/after state: when admin saves permission changes, display
          a summary: "Changes to User Bob: Grant [documents.edit,
          documents.share], Revoke [documents.delete]". This gives admin a
          chance to review before confirming.
        </p>
        <p>
          <strong>Confirmation Dialog UX and Irreversible Operations:</strong>{" "}
          Use different confirmation styles based on operation risk. Low-risk
          toggles (documents.read) proceed without dialog. Medium-risk
          (documents.delete) show a confirmation with red "Confirm" button.
          High-risk (revoke all permissions, grant admin to unvetted user)
          require a typed confirmation: "type 'confirm' to proceed". This
          prevents accidental clicks. For bulk operations, show a count: "Grant
          admin to 50 users? This is irreversible without manual undo."
          Additionally, provide copy/paste text for admins to paste into audit
          notes (e.g., "Granted documents.delete to User XYZ due to new project
          requirements").
        </p>
        <p>
          <strong>Change History and Rollback Safety Windows:</strong> Implement
          a rolling change history: keep the last 100 permission changes in
          memory. If admin hits "Undo" within 5 minutes, immediately revert to
          previous state. After 5 minutes, undo is unavailable (prevents chaos).
          On undo, log: "Admin Alice undid permission change from 2026-05-05
          14:30. Change history ID: 5891." This ties undo to the original change
          for auditability. For bulk undos (revert a bulk grant that affected 50
          users), ask: "Undo affects 50 users. Revert all? This will create 50
          audit entries." Only proceed if admin confirms.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Bulk Edit Operations
        </h3>
        <p>
          Admins often need to grant the same permissions to multiple users (new
          department onboarding, contractor team). Bulk edit enables
          multi-select: select 20 contractors from the user list, then assign
          them all "DocumentViewer" role in one operation. The UI shows a bulk
          edit form with the same permission selector, but applies to all
          selected users.
        </p>
        <p>
          Critical: preview the changes before confirming. Show "If you apply
          these changes to 20 selected users: users with existing permissions
          will be updated, new permissions will be granted, conflicting
          permissions will be revoked." Some users might already have more
          permissions than the preset; clarify what will change for each.
        </p>
        <p>
          Confirm bulk operations explicitly. "Apply 'DocumentViewer' role to 20
          users? This change is not reversible without manual undo." Only after
          confirmation proceed.
        </p>
        <p>
          <strong>
            Differential Permission Application and Conflict Handling:
          </strong>{" "}
          When applying permissions to multiple users with different current
          states, be transparent about conflicts. Example: 20 contractors
          selected. 10 have zero permissions, 5 already have documents.read, 5
          already have admin. Applying "DocumentViewer" role means: (1) 10 users
          gain documents.read, documents.comment. (2) 5 users keep
          documents.read, gain documents.comment (net: +documents.comment). (3)
          5 users lose admin, gain documents.read, documents.comment (potential
          downgrade). Show this breakdown before confirming: "Breakdown: 10
          users will be updated (net gain), 5 users upgraded (same + new), 5
          users downgraded (admin revoked). Proceed?" Allow admin to filter out
          the 5 downgrades if desired.
        </p>
        <p>
          <strong>Bulk Operation Progress and Partial Failure Handling:</strong>{" "}
          When applying changes to 1000+ users, show progress: "Applying
          permissions to 1000 users... 250 complete (25%)". If some users fail
          (due to validation error, permission conflict), continue with others,
          then show summary: "1000 users processed. 950 succeeded. 50 failed:
          [reasons]". Provide option to download failure report. Additionally,
          implement rollback-on-batch-failure: if more than 5% fail, ask: "Apply
          to remaining 950?" or "Rollback all changes to all 1000?"
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Audit Logging and History
        </h3>
        <p>
          Every permission change is logged. A log entry includes: timestamp,
          admin who made the change, target user, permission changed, before
          state, after state, optional reason/notes. Log entries are immutable
          and tamper-proof (append-only).
        </p>
        <p>
          The UI provides an audit trail view per user. Click "User Bob" and see
          history: "Admin Alice granted documents.edit on 2026-05-05 14:30.
          Admin Charlie revoked users.delete on 2026-05-05 15:45". This enables
          debugging ("who granted this user admin access?") and compliance
          ("show all permission changes for this user over the past quarter").
        </p>
        <p>
          Optional undo: if a change was made recently (within 1 hour), offer
          "Undo" button next to the log entry. Clicking undo reverts the user's
          permissions to the state before that change. Undo itself is logged:
          "Admin Dave undid permission change at 2026-05-05 16:00".
        </p>
        <p>
          <strong>Audit Trail Filtering and Compliance Reporting:</strong>{" "}
          Implement powerful audit trail filtering: filter by date range,
          changed permissions, admin who made change, type of change (grant vs
          revoke). Example query: "Show all admin permission grants in the past
          month" reveals privilege escalations. Export audit logs in standard
          formats (CSV, JSON) for compliance audits. Log retention should match
          compliance requirements (SOC2 typically requires 1 year).
          Additionally, implement audit alerting: if a user gains admin
          permission or loses critical permissions, send email to organization
          admins: "Alert: User XYZ granted admin permission by Admin ABC at
          [time]". This provides real-time visibility for security monitoring.
        </p>
        <p>
          <strong>Audit Trail Verification and Immutability:</strong> Audit logs
          are security-critical. Implement write-once semantics: once a log
          entry is written, it cannot be modified (database constraints).
          Additionally, implement cryptographic signatures: each log entry
          includes a hash of the previous entry, forming a chain. This makes
          tampering detectable (a future auditor can verify the chain is
          unbroken). Store audit logs in a separate append-only database or
          table, with restricted access (only read, no update/delete).
          Additionally, back up audit logs to external storage (cloud storage,
          audit service) to protect against local tampering.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Performance Optimization
        </h3>
        <p>
          With 500+ permissions, loading and rendering is slow. Paginate or
          virtualize: load the first 50 permissions, and load more as admin
          scrolls. Search filters reduce the set immediately (search for
          "delete" to show only deletion permissions). Debounce search input
          (wait 200ms before filtering to avoid lag).
        </p>
        <p>
          Cache permission manifests (list of all grantable permissions with
          hierarchy). This rarely changes and can be cached aggressively (1 day
          TTL). Avoid refetching it on every page load.
        </p>
        <p>
          For bulk operations on 1000+ users, show progress. "Granting
          permissions to 1000 users... 250 complete (25%)" instead of hanging
          with no feedback.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>
          <strong>Granular vs Role-Based:</strong> Granular permissions (100+
          individual checkboxes) provide ultimate flexibility but overwhelming
          UX. Role-based permissions (Viewer, Editor, Owner presets) are simple
          but inflexible (can't grant "edit but not delete"). Best approach:
          presets as primary interface, advanced granular control as secondary.
          Non-admin users pick a preset; advanced admins toggle individual
          permissions.
        </p>
        <p>
          <strong>Real-Time Inheritance Computation vs Pre-Computed:</strong>{" "}
          Computing effective permissions (with inheritance) on every render is
          expensive. Pre-computing server-side and caching client-side is faster
          but requires syncing when permissions change. Real approach:
          pre-compute server-side, cache in frontend state, invalidate on
          permission change.
        </p>
        <p>
          <strong>Confirmation Dialogs vs No Friction:</strong> Confirmation on
          every change (confirmation hell) is annoying. No confirmation (easy
          mistakes) is dangerous. Balance: confirm only on dangerous operations
          (delete, admin grant) and bulk operations (50+ users). Single
          permission toggles proceed without dialog.
        </p>
        <p>
          <strong>Flat List vs Tree View:</strong> Flat list is simple and
          fast-loading. Tree view with expansion is more organized and compact.
          For 500+ permissions, tree view is better; for 20 permissions, flat
          list is simpler. Hybrid: default to grouped flat, offer tree expansion
          for large permission sets.
        </p>
        <p>
          <strong>Bulk Edit Risk:</strong> Bulk operations (apply role to 100
          users) are efficient but risky (one mistake affects many). Mitigate by
          always showing a preview of changes before confirming. Some systems
          require an additional confirmation step for bulk operations (click
          "Apply", then confirm "Apply to 100 users?").
        </p>
        <p>
          <strong>Audit Trail Storage:</strong> Logging every permission change
          creates large audit tables. Large-scale apps might keep only recent
          audit history (1 year) and archive older entries. Compliance
          requirements might mandate indefinite retention.
        </p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Pattern 1: Role-Based Presets with Granular Override
        </h3>
        <p>
          Display role buttons (Viewer, Editor, Owner) prominently. Clicking a
          role applies all associated permissions instantly. Below presets, show
          a collapsible "Advanced: Customize permissions" section with granular
          checkboxes. Most users pick a preset; power users customize.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Pattern 2: Hierarchical Tree with Three-State Checkboxes
        </h3>
        <p>
          Permissions displayed as an expandable tree. Parent permissions have
          expand arrows. Granting parent auto-enables children (not shown as
          separate checkboxes, but implicitly granted). Inherited permissions
          shown with light color. Admin can revoke child without affecting
          parent (remove child from inherited set).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Pattern 3: Diff-Based Bulk Edit
        </h3>
        <p>
          Select multiple users, then modify permissions. UI computes and
          displays the diff: "Current state vs Proposed state". Shows which
          users will gain permissions, lose permissions, and remain unchanged.
          Only on explicit confirmation does the change apply to all.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Pattern 4: Audit Trail with Reversible Undo
        </h3>
        <p>
          Every permission change is logged with before/after state. Audit trail
          view shows history. Recent changes (within 1 hour) show "Undo" button.
          Clicking undo reverts that single change, logged as a new entry.
          Provides safety net while preventing "undo everything" chaos.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Permission editor UIs manage fine-grained access control at scale
          while preventing dangerous mistakes. Essential patterns include
          hierarchical organization (group by category, optionally use trees),
          role-based presets (Viewer, Editor, Owner) for common cases, granular
          checkboxes for advanced control, three-state checkboxes (granted,
          revoked, inherited) for clarity, permission inheritance (parent
          implies child), bulk edit with preview and confirmation, and
          comprehensive audit logging with optional undo. Trade-offs include
          preset simplicity vs granular flexibility (hybrid approach wins), flat
          list simplicity vs tree organization (use trees for 100+ permissions),
          and confirmation friction (confirm on dangerous + bulk, not on every
          toggle). Real-world systems (GitHub, Datadog, Slack) use role presets
          as primary interface with advanced granular control, visual
          inheritance indicators (lighter color for inherited), and mandatory
          confirmation on dangerous operations (revoke all, grant admin). For
          best results, lead with presets, provide search for large permission
          sets, always show before/after diff, require explicit confirmation on
          dangerous and bulk operations, prevent self-lock (don't let only admin
          revoke their own admin), provide audit trail, and fail-secure (when in
          doubt, require confirmation). Permission editors are critical UX—small
          improvements prevent security incidents and user frustration.
        </p>
      </section>
    </ArticleLayout>
  );
}
