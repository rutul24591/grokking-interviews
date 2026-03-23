"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-rbac",
  title: "Role-Based Access Control (RBAC)",
  description:
    "Comprehensive guide to implementing RBAC covering role hierarchies, permission models, assignment patterns, caching strategies, and scaling for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "rbac",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "rbac",
    "authorization",
    "backend",
    "security",
  ],
  relatedTopics: ["permission-validation", "access-control-policies", "authentication-service"],
};

export default function RBACArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Role-Based Access Control (RBAC)</strong> is an authorization model where
          permissions are assigned to roles, and users are assigned to roles. This abstraction
          simplifies permission management, enables hierarchical access control, and provides clear
          audit trails for compliance. Instead of managing permissions for each user individually
          (which doesn't scale), you manage roles and assign users to appropriate roles.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/rbac-model.svg"
          alt="RBAC Model"
          caption="RBAC Model — showing Users → Roles → Permissions flow with role hierarchy"
        />

        <p>
          For staff and principal engineers, implementing RBAC requires deep understanding of role
          hierarchies (parent-child inheritance), permission granularity (coarse vs fine-grained),
          many-to-many relationships (users ↔ roles ↔ permissions), caching strategies (JWT,
          Redis), and the trade-offs between RBAC and ABAC (Attribute-Based Access Control). The
          implementation must support fine-grained permissions while maintaining sub-millisecond
          authorization checks at scale.
        </p>
        <p>
          Modern RBAC systems have evolved from simple role assignments to sophisticated
          hierarchical models with inheritance, dynamic permissions based on context, and hybrid
          approaches combining RBAC with ABAC. Organizations like Google, Microsoft, and Amazon use
          RBAC as the foundation for their authorization systems, handling millions of permission
          checks per second with sub-millisecond latency.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          RBAC is built on fundamental concepts that determine how roles, permissions, and users
          interact. Understanding these concepts is essential for designing effective authorization
          systems.
        </p>
        <p>
          <strong>Core Components:</strong> RBAC has five core components: Users (individual
          accounts in the system), Roles (named collections of permissions like admin, moderator,
          user), Permissions (atomic access rights like create:post, delete:user), Role-Permission
          Assignment (many-to-many relationship linking roles to permissions), and User-Role
          Assignment (many-to-many relationship linking users to roles). This separation enables
          flexible permission management — change a role's permissions and all users with that role
          inherit the change.
        </p>
        <p>
          <strong>Role Hierarchy:</strong> Roles can inherit permissions from parent roles, creating
          a hierarchy. Child roles inherit all parent permissions. Example: admin → moderator →
          user. Admin has all moderator + user permissions. Implementation: store parent_role_id,
          traverse hierarchy for permission check. DAG (Directed Acyclic Graph) structure allows
          roles to have multiple parents. This simplifies role management — define base
          permissions once, inherit in child roles.
        </p>
        <p>
          <strong>Database Schema:</strong> RBAC requires four core tables: roles (id, name,
          description, parent_role_id), permissions (id, name, resource, action), role_permissions
          (junction table: role_id, permission_id), user_roles (junction table: user_id, role_id,
          assigned_at, assigned_by). Indexes on all foreign keys, unique constraint on role/permission
          names. This schema supports many-to-many relationships and role hierarchy.
        </p>
        <p>
          <strong>Permission Check Patterns:</strong> Three primary patterns for checking
          permissions: Middleware/Interceptor (check permissions before handler execution, return
          403 if denied), Code-Level Check (if (!user.can('delete')) throw 403 for conditional
          logic), Cached Permissions (cache user's permissions in JWT or Redis for sub-millisecond
          checks). Each pattern has trade-offs — middleware provides consistent enforcement,
          code-level provides flexibility, caching provides performance.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          RBAC architecture separates role management from permission enforcement, enabling
          centralized role management with distributed permission checks. This architecture is
          critical for scaling authorization across distributed systems.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/rbac-schema.svg"
          alt="RBAC Schema"
          caption="RBAC Database Schema — showing users, roles, permissions tables with junction tables"
        />

        <p>
          The authorization flow starts when a request arrives. The system extracts user context
          (user_id from JWT/session), loads user's roles from user_roles table, loads permissions
          for all roles from role_permissions table, caches permissions (JWT or Redis), and checks
          if required permission is in user's permission set. If yes, allow access. If no, return
          403 Forbidden. This flow must complete in sub-millisecond latency to avoid impacting user
          experience.
        </p>
        <p>
          Caching is critical for performance. JWT approach: include permissions array in token
          claims during authentication, validate signature on each request, extract permissions
          without database lookup. Redis approach: on first permission check, load permissions from
          database, cache in Redis (user_id → Set of permissions), subsequent checks hit Redis
          (~1ms). Invalidation: on role change, increment permission_version, force token refresh,
          clear Redis cache.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/rbac-vs-abac.svg"
          alt="RBAC vs ABAC"
          caption="RBAC vs ABAC — side-by-side comparison with pros, cons, and example policies"
        />

        <p>
          Performance optimization is critical — permission checks happen on every request.
          Optimization strategies include: caching (JWT for stateless, Redis for detailed),
          pre-computation (pre-compute inherited permissions for hierarchical roles), and
          hierarchical checks (check coarse-grained first, fine-grained only if needed).
          Organizations like Netflix achieve p99 permission check latency under 1ms by caching
          permissions in JWT and using Redis for detailed checks only when needed.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing RBAC systems involves trade-offs between simplicity, flexibility, and
          performance. Understanding these trade-offs is essential for making informed architecture
          decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">RBAC vs ABAC</h3>
          <ul className="space-y-3">
            <li>
              <strong>RBAC:</strong> Simpler to understand and audit, good for organizational
              hierarchies, clear role definitions. Limitation: coarse-grained, can't express
              context-aware rules (access only during business hours).
            </li>
            <li>
              <strong>ABAC:</strong> More flexible, context-aware, fine-grained (user.department ==
              resource.department AND time &gt; 9AM). Limitation: complex to manage, harder to
              audit, performance overhead.
            </li>
            <li>
              <strong>Hybrid:</strong> RBAC for coarse-grained access (admin, user), ABAC for
              resource-level checks (user can edit document if owner OR editor). Best of both
              worlds. Used by Google, Amazon.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Centralized vs Decentralized RBAC</h3>
          <ul className="space-y-3">
            <li>
              <strong>Centralized:</strong> Single source of truth for roles/permissions, easier
              audit, consistent enforcement. Limitation: single point of failure, network latency
              for remote checks.
            </li>
            <li>
              <strong>Decentralized:</strong> Faster checks (local cache), resilient to network
              failures, scales with services. Limitation: harder to audit, consistency challenges,
              policy drift between services.
            </li>
            <li>
              <strong>Hybrid:</strong> Centralized role management, decentralized enforcement with
              caching. Best balance — consistency with performance. Used by most production systems.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Flat vs Hierarchical Roles</h3>
          <ul className="space-y-3">
            <li>
              <strong>Flat:</strong> All roles at same level, no inheritance. Simple, easy to
              understand. Limitation: permission duplication, hard to manage many roles.
            </li>
            <li>
              <strong>Hierarchical:</strong> Parent-child relationships, inheritance. Reduces
              duplication, easier management. Limitation: complex inheritance logic, potential for
              unintended permissions.
            </li>
            <li>
              <strong>Recommendation:</strong> Flat for small systems (&lt;10 roles), hierarchical
              for larger systems. Keep hierarchy shallow (2-3 levels max) to avoid complexity.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing RBAC requires following established best practices to ensure security,
          usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Use principle of least privilege for role assignment — grant minimum permissions
          necessary for the role. Implement permission caching with proper invalidation — JWT for
          common permissions, Redis for detailed, invalidate on role change. Log all authorization
          decisions for audit trails — include user, role, permission, resource, decision. Use
          constant-time comparison for permission checks — prevent timing attacks. Separate role
          management from application logic — centralized role management, distributed enforcement.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Role Design</h3>
        <p>
          Keep role hierarchy flat (2-3 levels maximum) — deep hierarchies are hard to understand
          and audit. Use descriptive role names (content_moderator, not mod_v2) — clear names
          reduce confusion. Document role permissions clearly — maintain role catalog with
          descriptions. Avoid role explosion (too many specialized roles) — use permission groups
          for common patterns. Review roles periodically for relevance — remove unused roles,
          consolidate overlapping roles.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Permission Design</h3>
        <p>
          Use consistent naming convention (action:resource format like blog:post:delete,
          shop:product:delete) — enables programmatic permission checks. Keep permissions atomic
          (single action per permission) — easier to combine and audit. Group related permissions
          logically (permission groups) — simplifies role assignment. Document permission purpose
          and usage — maintain permission catalog. Version permissions for backward compatibility —
          include version in permission ID.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring &amp; Alerting</h3>
        <p>
          Track authorization failure rates — baseline normal, alert on anomalies. Monitor role
          assignment changes — who assigned what role to whom, when. Alert on unusual permission
          patterns — many denials from single user, unusual role assignments. Track permission
          usage for optimization — identify unused permissions, consolidate. Monitor cache hit rates
          for permissions — low hit rate indicates caching issues.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing RBAC to ensure secure, usable, and
          maintainable authorization systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Role explosion:</strong> Too many specialized roles (50+), hard to manage and
            audit. <strong>Fix:</strong> Use permission groups, attribute-based rules for edge
            cases, consolidate overlapping roles.
          </li>
          <li>
            <strong>Hardcoded permissions:</strong> Permissions in code, not database, hard to
            change without deployment. <strong>Fix:</strong> Store permissions in database, load
            dynamically, use policy engine for complex rules.
          </li>
          <li>
            <strong>No permission caching:</strong> Database query on every check, slow performance
            under load. <strong>Fix:</strong> Cache in JWT (for common permissions) or Redis (for
            detailed permissions). Invalidate on role change.
          </li>
          <li>
            <strong>Deep role hierarchies:</strong> 5+ levels of inheritance, hard to understand
            effective permissions. <strong>Fix:</strong> Flatten hierarchy (2-3 levels max), use
            permission groups instead.
          </li>
          <li>
            <strong>No audit logging:</strong> Can't track who changed permissions, compliance
            violations. <strong>Fix:</strong> Log all role/permission changes with actor, subject,
            action, timestamp, reason.
          </li>
          <li>
            <strong>Stale cached permissions:</strong> Role changes don't take effect immediately,
            security gap. <strong>Fix:</strong> Invalidate cache on role change, force token
            refresh, use permission_version for validation.
          </li>
          <li>
            <strong>Overly permissive roles:</strong> Admin has all permissions, violates least
            privilege. <strong>Fix:</strong> Principle of least privilege, separate admin roles
            (super-admin, content-admin, user-admin).
          </li>
          <li>
            <strong>No resource-level checks:</strong> Role allows delete, but not which resources
            — user can delete anything. <strong>Fix:</strong> Combine RBAC with ownership checks —
            user can delete if has permission OR owns resource.
          </li>
          <li>
            <strong>Permission name collisions:</strong> Same name for different permissions
            (blog:delete vs shop:delete), confusion and security issues. <strong>Fix:</strong> Use
            namespaced names (resource:action format like blog:post:delete, shop:product:delete).
          </li>
          <li>
            <strong>No testing:</strong> Authorization logic untested, security vulnerabilities.{" "}
            <strong>Fix:</strong> Unit tests for permission checks, integration tests for flows,
            security tests for privilege escalation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          RBAC is critical for organizations with complex authorization requirements. Here are
          real-world implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> Multi-tenant SaaS with complex role requirements. Each
          tenant needs custom roles (Sales Rep, Sales Manager, Admin). Hierarchical permissions
          (Manager inherits from Rep). Multi-tenant isolation.
        </p>
        <p>
          <strong>Solution:</strong> Tenant-scoped roles (tenant_id in roles table). Role hierarchy
          with inheritance (Manager → Rep). Permission caching per tenant. Custom role builder for
          each tenant. Audit logging for all role changes.
        </p>
        <p>
          <strong>Result:</strong> Passed SOC 2 audit. Tenant isolation maintained. Custom roles
          per tenant. Permission check latency under 1ms p99.
        </p>
        <p>
          <strong>Security:</strong> Tenant isolation, least privilege, audit logging, caching with
          invalidation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Content Management (WordPress)</h3>
        <p>
          <strong>Challenge:</strong> Content management with multiple user roles (admin, editor,
          author, contributor, subscriber). Need hierarchical permissions (editor can edit all
          posts, author can edit own posts). Plugin support for custom roles.
        </p>
        <p>
          <strong>Solution:</strong> Predefined roles with hierarchy (editor inherits author
          permissions). Ownership checks for authors (can edit own posts). Capability-based system
          (edit_posts, delete_posts, publish_posts). Plugin API for custom roles/permissions.
        </p>
        <p>
          <strong>Result:</strong> Flexible permission system. Hierarchical roles work correctly.
          Ownership enforced for authors. Plugin ecosystem for custom permissions.
        </p>
        <p>
          <strong>Security:</strong> Role hierarchy, ownership checks, capability-based system,
          plugin isolation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare EHR (Epic)</h3>
        <p>
          <strong>Challenge:</strong> Electronic Health Records with HIPAA compliance. Different
          roles (doctor, nurse, admin, billing). Need minimum necessary access — doctors can only
          access their patients. Audit all access for compliance.
        </p>
        <p>
          <strong>Solution:</strong> Role-based permissions (doctor, nurse, admin). Resource-level
          checks (doctor can access patient if assigned). Break-glass for emergencies (full audit,
          post-incident review). All access logged for HIPAA compliance.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Minimum necessary access enforced. Zero
          unauthorized access detected. Emergency access available with audit.
        </p>
        <p>
          <strong>Security:</strong> Role-based access, resource-level checks, break-glass
          procedure, HIPAA audit trails.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cloud Infrastructure (AWS IAM)</h3>
        <p>
          <strong>Challenge:</strong> Cloud platform with millions of resources and complex
          permission requirements. Need fine-grained access control (user can access specific S3
          buckets, EC2 instances). Policy-based permissions for flexibility.
        </p>
        <p>
          <strong>Solution:</strong> IAM roles with attached policies. Resource-level permissions
          (ARN-based). Permission caching with TTL. Cross-account role assumption. Audit logging
          via CloudTrail.
        </p>
        <p>
          <strong>Result:</strong> Fine-grained access control at scale. Cross-account access
          supported. All access logged for compliance. Permission check latency under 10ms.
        </p>
        <p>
          <strong>Security:</strong> Resource-level permissions, cross-account isolation, audit
          logging, caching with TTL.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Financial Trading Platform</h3>
        <p>
          <strong>Challenge:</strong> Trading platform with strict compliance requirements.
          Different roles (trader, compliance, admin). Traders can only trade assigned securities.
          Compliance requires Chinese wall between teams.
        </p>
        <p>
          <strong>Solution:</strong> Role-based permissions (trader, compliance, admin).
          Resource-level permissions (trader can trade security if assigned). Team-based isolation
          (Chinese wall — no cross-team access). Pre-trade permission validation. Real-time audit
          logging.
        </p>
        <p>
          <strong>Result:</strong> Passed SEC/FINRA audits. Chinese wall enforced. Zero
          unauthorized trades. Real-time compliance reporting.
        </p>
        <p>
          <strong>Security:</strong> Role-based access, resource-level permissions, team isolation,
          pre-trade validation, real-time audit.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of RBAC design, implementation, and operational
          concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: RBAC vs ABAC — which to choose?</p>
            <p className="mt-2 text-sm">
              A: RBAC for simple, role-based access (admin, moderator, user) — easier to manage,
              clearer audit trail, good for organizational hierarchies. ABAC for fine-grained,
              context-aware access (user.department == resource.department, time-based access).
              Hybrid approach: RBAC for coarse-grained access, ABAC for resource-level checks. Most
              systems start with RBAC, add ABAC for specific requirements. Example: User has
              "editor" role (RBAC), but can only edit documents in their department (ABAC).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle role changes?</p>
            <p className="mt-2 text-sm">
              A: Update user_roles table (add/remove role assignment). Invalidate permission cache —
              clear Redis cache for user, increment permission_version in user record. Force token
              refresh — include permission_version in JWT, validate version matches on each request,
              force refresh if mismatch. Audit log the change — who changed what role for whom,
              when, why. Notify user if appropriate (email for role removal).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement resource-level permissions?</p>
            <p className="mt-2 text-sm">
              A: Combine RBAC with ownership checks. User can delete posts IF (has delete:post
              permission OR is post owner). For team resources: check if user has team:manage
              permission AND is team member. Implementation: middleware checks role permission,
              service layer checks ownership. Cache ownership data for performance. Use policy
              engine for complex rules (OPA, Cedar).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you cache permissions efficiently?</p>
            <p className="mt-2 text-sm">
              A: Two approaches: (1) JWT claims — include permissions array in token during auth,
              validate signature on each request, extract permissions without DB lookup (sub-1ms).
              (2) Redis cache — on first check, load permissions from DB, cache in Redis (user_id →
              Set of permissions), subsequent checks hit Redis (~1ms). Invalidate on role change —
              clear Redis cache, increment permission_version, force token refresh. Hybrid: JWT for
              common permissions, Redis for detailed checks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle permission versioning?</p>
            <p className="mt-2 text-sm">
              A: Include permission_version in JWT token. Store current version in user record. On
              permission change, increment version in user record. On each request, validate token
              version matches current version. Force refresh if mismatch — user must
              re-authenticate to get new permissions. For granular control: track version per
              permission type (read_version, write_version, admin_version). Trade-off: more
              invalidations vs finer control over what triggers refresh.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you audit RBAC changes?</p>
            <p className="mt-2 text-sm">
              A: Log all role assignments, permission changes, role creation/deletion. Include:
              timestamp, actor (who made change), subject (user/role changed), action
              (assigned/removed), reason (ticket/approval). Store in immutable audit log —
              append-only storage (WORM), separate from application databases. Queryable for
              compliance reports — Elasticsearch for full-text search, time-based partitioning.
              Alert on suspicious patterns — mass role changes, self-assignment attempts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent privilege escalation?</p>
            <p className="mt-2 text-sm">
              A: Separate role management from application — only super-admin can assign admin
              roles. Require approval workflow for sensitive role changes — manager approval for
              admin role assignment. Audit all role assignments — who assigned what to whom, when,
              why. Implement four-eyes principle for critical changes — two admins must approve.
              Log and alert on self-assignment attempts — admin trying to give themselves more
              permissions. Use read-only replicas for permission checks — prevent tampering.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle multi-tenant RBAC?</p>
            <p className="mt-2 text-sm">
              A: Scope roles to tenant — include tenant_id in user_roles table. Users can have
              different roles in different tenants — user is admin in Tenant A, viewer in Tenant B.
              Check tenant context on every permission check — extract tenant from request context,
              validate against permission. Cache permissions per tenant — user_id + tenant_id →
              permissions. Include tenant_id in permission key — prevent cross-tenant leakage. Use
              tenant-aware middleware — automatically scope all queries to tenant.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for RBAC?</p>
            <p className="mt-2 text-sm">
              A: Primary: Authorization success/failure rate, permission check latency (p50, p95,
              p99), cache hit rate. Security: Failed authorization attempts per user, privilege
              escalation attempts, unusual role assignments. Operational: Role count, permission
              count, user-role assignments, role change frequency. Set up alerts for anomalies —
              spike in failures, unusual role assignments, cache miss rate above threshold.
              Dashboard for visibility — real-time metrics, trends, comparisons.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://csrc.nist.gov/projects/rbac"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIST RBAC Standard
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
              href="https://www.openpolicyagent.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Policy Agent (OPA)
            </a>
          </li>
          <li>
            <a
              href="https://docs.cedarpolicy.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cedar Policy Language
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
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Access_control"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Access Control
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
