"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-rbac",
  title: "Role-Based Access Control (RBAC)",
  description: "Comprehensive guide to implementing RBAC covering role hierarchies, permission models, assignment patterns, and scaling for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "rbac",
  version: "extensive",
  wordCount: 7500,
  readingTime: 30,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "rbac", "authorization", "backend", "security"],
  relatedTopics: ["permission-validation", "access-control-policies", "authentication-service", "admin-moderation"],
};

export default function RBACArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Role-Based Access Control (RBAC)</strong> is an authorization model where 
          permissions are assigned to roles, and users are assigned to roles. This abstraction 
          simplifies permission management, enables hierarchical access control, and provides 
          clear audit trails for compliance.
        </p>
        <p>
          For staff and principal engineers, implementing RBAC requires understanding role 
          hierarchies, permission granularity, many-to-many relationships, caching strategies, 
          and the trade-offs between RBAC and ABAC (Attribute-Based Access Control). The 
          implementation must support fine-grained permissions while maintaining sub-millisecond 
          authorization checks.
        </p>
      </section>

      <section>
        <h2>RBAC Model</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Core Components</h3>
          <ul className="space-y-3">
            <li>
              <strong>Users:</strong> Individual accounts in the system.
            </li>
            <li>
              <strong>Roles:</strong> Named collections of permissions (admin, moderator, user).
            </li>
            <li>
              <strong>Permissions:</strong> Atomic access rights (create:post, delete:user).
            </li>
            <li>
              <strong>Role-Permission Assignment:</strong> Many-to-many relationship.
            </li>
            <li>
              <strong>User-Role Assignment:</strong> Many-to-many relationship.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Role Hierarchy</h3>
          <ul className="space-y-3">
            <li>
              <strong>Inheritance:</strong> Child roles inherit parent permissions.
            </li>
            <li>
              <strong>Example:</strong> admin → moderator → user. Admin has all moderator 
              + user permissions.
            </li>
            <li>
              <strong>Implementation:</strong> Store parent_role_id, traverse hierarchy 
              for permission check.
            </li>
            <li>
              <strong>DAG Structure:</strong> Roles can have multiple parents (directed 
              acyclic graph).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Database Schema</h2>
        <ul className="space-y-3">
          <li>
            <strong>roles:</strong> id, name, description, parent_role_id (nullable).
          </li>
          <li>
            <strong>permissions:</strong> id, name, resource, action (create:post).
          </li>
          <li>
            <strong>role_permissions:</strong> role_id, permission_id (junction table).
          </li>
          <li>
            <strong>user_roles:</strong> user_id, role_id, assigned_at, assigned_by 
            (junction table).
          </li>
          <li>
            <strong>Indexes:</strong> All foreign keys, unique (name) on roles and 
            permissions.
          </li>
        </ul>
      </section>

      <section>
        <h2>Permission Check Patterns</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Middleware/Interceptor</h3>
          <ul className="space-y-3">
            <li>
              <strong>Pattern:</strong> Check permission before handler execution.
            </li>
            <li>
              <strong>Example:</strong> @RequirePermission('delete:post').
            </li>
            <li>
              <strong>Response:</strong> 403 Forbidden if not authorized.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Code-Level Check</h3>
          <ul className="space-y-3">
            <li>
              <strong>Pattern:</strong> if (!user.can('delete:post')) throw 403.
            </li>
            <li>
              <strong>Use Case:</strong> Conditional logic within handlers.
            </li>
            <li>
              <strong>Helper:</strong> user.can() method on user object.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Cached Permissions</h3>
          <ul className="space-y-3">
            <li>
              <strong>Pattern:</strong> Cache user's permissions in JWT or Redis.
            </li>
            <li>
              <strong>Invalidation:</strong> On role change, invalidate cache.
            </li>
            <li>
              <strong>Trade-off:</strong> Fast checks vs stale permissions.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: RBAC vs ABAC - which to choose?</p>
            <p className="mt-2 text-sm">
              A: RBAC for simple, role-based access (admin, user). ABAC for 
              fine-grained, context-aware access (user.department = 
              resource.department). Hybrid: RBAC for coarse, ABAC for 
              resource-level checks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle role changes?</p>
            <p className="mt-2 text-sm">
              A: Update user_roles table, invalidate permission cache, force 
              token refresh. Audit log the change. Notify user if appropriate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement resource-level permissions?</p>
            <p className="mt-2 text-sm">
              A: RBAC + ownership check. User can delete posts IF (has 
              delete:post permission OR is post owner). Combine role 
              permissions with resource ownership.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you cache permissions efficiently?</p>
            <p className="mt-2 text-sm">
              A: Cache in JWT claims (sub-1ms access) or Redis (user_id → 
              permissions Set). Invalidate on role change. TTL-based expiry 
              for eventual consistency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle permission versioning?</p>
            <p className="mt-2 text-sm">
              A: Include permission_version in token. Increment on permission 
              changes. Validate version matches current. Force refresh if 
              mismatch.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you audit RBAC changes?</p>
            <p className="mt-2 text-sm">
              A: Log all role assignments, permission changes, role creation. 
              Include who, what, when, why. Immutable audit log for compliance.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
