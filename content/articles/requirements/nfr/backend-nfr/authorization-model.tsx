"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-authorization-model-extensive",
  title: "Authorization Model",
  description: "Comprehensive guide to authorization models, covering RBAC, ABAC, ACL, policy-based authorization, and production patterns for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "authorization-model",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-16",
  tags: ["backend", "nfr", "authorization", "rbac", "abac", "acl", "security", "access-control"],
  relatedTopics: ["authentication-infrastructure", "secrets-management", "compliance-auditing", "api-versioning"],
};

export default function AuthorizationModelArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Authorization</strong> determines what an authenticated user is allowed to do.
          The <strong>Authorization Model</strong> is the systematic approach to defining and enforcing
          access control policies across your system.
        </p>
        <p>
          Authorization happens after authentication. Once you know who the user is (authentication),
          you determine what they can access (authorization).
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight: Authorization is Policy Enforcement</h3>
          <p>
            Authorization is not just checking roles. It&apos;s enforcing business policies about who can
            do what, when, and under what conditions. A good authorization model is expressive enough to
            capture complex policies while remaining maintainable.
          </p>
        </div>
      </section>

      <section>
        <h2>Authorization Models</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/authorization-model.svg"
          alt="Authorization Models Comparison"
          caption="Authorization Models — showing RBAC (User→Role→Permission), ABAC (Subject+Resource+Action+Environment→Policy), and ACL (Resource→Access List) with selection guide"
        />
        <p>
          Several models exist for implementing authorization:
        </p>
      </section>

      <section>
        <h2>Authorization Models Deep Dive</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/authorization-deep-dive.svg"
          alt="Authorization Deep Dive"
          caption="Authorization Deep Dive — showing RBAC role hierarchy, ABAC policy evaluation, authorization implementation patterns"
        />
        <p>
          Advanced authorization concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RBAC (Role-Based Access Control)</h3>
        <p>
          <strong>RBAC</strong> assigns permissions to roles, and users are assigned to roles.
        </p>
        <p>
          <strong>Structure:</strong>
        </p>
        <ul>
          <li>Users → Roles (user is assigned to role)</li>
          <li>Roles → Permissions (role has permissions)</li>
          <li>Permissions → Resources (permission grants access to resource)</li>
        </ul>
        <p>
          <strong>Example:</strong>
        </p>
        <ul>
          <li>Role: &quot;Admin&quot; → Permissions: read, write, delete on all resources</li>
          <li>Role: &quot;Editor&quot; → Permissions: read, write on own content</li>
          <li>Role: &quot;Viewer&quot; → Permissions: read on public content</li>
        </ul>
        <p>
          <strong>Pros:</strong>
        </p>
        <ul>
          <li>✓ Simple to understand and implement.</li>
          <li>✓ Easy to audit (who has what role).</li>
          <li>✓ Scales well for organizational structures.</li>
        </ul>
        <p>
          <strong>Cons:</strong>
        </p>
        <ul>
          <li>✗ Role explosion (many roles for fine-grained access).</li>
          <li>✗ Doesn&apos;t handle context (time, location, resource attributes).</li>
          <li>✗ Hard to express &quot;except&quot; conditions.</li>
        </ul>
        <p>
          <strong>Use when:</strong> Organizational roles map cleanly to access patterns.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ABAC (Attribute-Based Access Control)</h3>
        <p>
          <strong>ABAC</strong> makes access decisions based on attributes of the user, resource, action,
          and environment.
        </p>
        <p>
          <strong>Policy example:</strong> Allow access if user's department matches resource's department,
          user's clearance level meets minimum requirement, and request is during business hours.
        </p>
        <p>
          <strong>Attributes categories:</strong>
        </p>
        <ul>
          <li>
            <strong>Subject attributes:</strong> User role, department, clearance level.
          </li>
          <li>
            <strong>Resource attributes:</strong> Owner, sensitivity, classification.
          </li>
          <li>
            <strong>Action attributes:</strong> Read, write, delete, share.
          </li>
          <li>
            <strong>Environment attributes:</strong> Time, location, device, IP.
          </li>
        </ul>
        <p>
          <strong>Pros:</strong>
        </p>
        <ul>
          <li>✓ Highly expressive and flexible.</li>
          <li>✓ Context-aware decisions.</li>
          <li>✓ No role explosion.</li>
        </ul>
        <p>
          <strong>Cons:</strong>
        </p>
        <ul>
          <li>✗ Complex to implement and debug.</li>
          <li>✗ Policy management overhead.</li>
          <li>✗ Performance (attribute evaluation per request).</li>
        </ul>
        <p>
          <strong>Use when:</strong> Complex, context-dependent access policies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ACL (Access Control List)</h3>
        <p>
          <strong>ACL</strong> attaches a list of permissions directly to each resource.
        </p>
        <p>
          <strong>Example:</strong> A document might have ACL entries like: user:alice can read/write,
          user:bob can read, role:finance can read, and default is deny.
        </p>
        <p>
          <strong>Pros:</strong>
        </p>
        <ul>
          <li>✓ Fine-grained per-resource control.</li>
          <li>✓ Intuitive for resource owners.</li>
          <li>✓ Easy to see who has access to a resource.</li>
        </ul>
        <p>
          <strong>Cons:</strong>
        </p>
        <ul>
          <li>✗ Hard to see what a user can access (reverse lookup).</li>
          <li>✗ ACL management overhead.</li>
          <li>✗ Performance (check ACL on every access).</li>
        </ul>
        <p>
          <strong>Use when:</strong> Per-resource access control (file systems, document sharing).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Policy-Based Authorization</h3>
        <p>
          <strong>Policy-based</strong> uses a centralized policy engine to evaluate access requests.
        </p>
        <p>
          <strong>Architecture:</strong>
        </p>
        <ul>
          <li>
            <strong>PEP (Policy Enforcement Point):</strong> Intercepts requests, enforces decisions.
          </li>
          <li>
            <strong>PDP (Policy Decision Point):</strong> Evaluates policies, makes decisions.
          </li>
          <li>
            <strong>PAP (Policy Administration Point):</strong> Manages policy definitions.
          </li>
          <li>
            <strong>PIP (Policy Information Point):</strong> Provides attribute data.
          </li>
        </ul>
        <p>
          <strong>Tools:</strong> Open Policy Agent (OPA), AWS Cedar, Google Zanzibar.
        </p>
      </section>

      <section>
        <h2>Authorization Models Deep Dive</h2>
        <ArticleImage
          src="/diagrams/backend-nfr/authorization-patterns-deep-dive.svg"
          alt="Authorization Patterns Deep Dive"
          caption="Authorization Deep Dive — showing RBAC role hierarchy, ABAC policy evaluation, authorization implementation patterns"
        />
        <p>
          Advanced authorization concepts:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RBAC Role Hierarchy Deep Dive</h3>
        <p>
          Understanding role hierarchies and inheritance:
        </p>
        <ul>
          <li>
            <strong>Role Hierarchy:</strong> Roles inherit permissions from parent roles.
            Super Admin → Admin → Manager → User. Each level inherits all permissions from levels below.
          </li>
          <li>
            <strong>Permission Assignment:</strong> Assign permissions to roles, not users.
            Users assigned to roles automatically get role permissions.
          </li>
          <li>
            <strong>Role Explosion Problem:</strong> At scale, need many specialized roles
            (Admin-US, Admin-EU, Manager-US-East, etc.). Becomes unmanageable.
          </li>
          <li>
            <strong>Solution:</strong> Combine RBAC with attributes for fine-grained control.
            Role determines base permissions, attributes determine scope.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ABAC Policy Evaluation Deep Dive</h3>
        <p>
          How ABAC policies are evaluated:
        </p>
        <ul>
          <li>
            <strong>Subject Attributes:</strong> User characteristics (role, department, clearance level,
            employment status). Retrieved from identity provider or user directory.
          </li>
          <li>
            <strong>Resource Attributes:</strong> Resource characteristics (owner, sensitivity level,
            classification, department). Stored with resource metadata.
          </li>
          <li>
            <strong>Action Attributes:</strong> Operation being performed (read, write, delete, share).
            Determines what access control rules apply.
          </li>
          <li>
            <strong>Environment Attributes:</strong> Contextual factors (time of day, location, IP address,
            device type, network security level). Enable dynamic access control.
          </li>
          <li>
            <strong>Policy Engine:</strong> Evaluates all attributes against policy rules.
            Returns Allow or Deny decision. Can be centralized (OPA, AWS Cedar) or embedded.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Authorization Implementation Patterns</h3>
        <p>
          Different patterns for implementing authorization:
        </p>
        <ul>
          <li>
            <strong>Resource Ownership:</strong> Simplest pattern. If user owns resource, grant access.
            Check: <code>if (resource.owner_id == user.id)</code>. Common for user-generated content.
          </li>
          <li>
            <strong>ACL-Based:</strong> Access Control List stored with resource.
            List of (user_id, permissions) pairs. Check if user in ACL with required permission.
            Flexible but doesn't scale for many users per resource.
          </li>
          <li>
            <strong>Policy-Based (OPA):</strong> Centralized policy engine (Open Policy Agent).
            Policies defined in declarative language (Rego). Application queries OPA for access decision.
            Decouples authorization logic from application code.
          </li>
          <li>
            <strong>Attribute-Based:</strong> Evaluate attributes dynamically at access time.
            More flexible than ACL, more scalable than ownership. Requires attribute infrastructure.
          </li>
        </ul>
      </section>

      <section>
        <h2>Authorization Patterns</h2>
        <p>
          Common patterns for implementing authorization:
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Resource Ownership</h3>
        <p>
          Users can always access resources they own:
        </p>
        <ul>
          <li>Check if resource.ownerId matches user.id</li>
          <li>If owner, grant access immediately</li>
          <li>Otherwise, check other permission mechanisms</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hierarchical Permissions</h3>
        <p>
          Permissions inherit through organizational hierarchy:
        </p>
        <ul>
          <li>Managers can access subordinate&apos;s resources.</li>
          <li>Department heads can access all department resources.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Time-Based Access</h3>
        <p>
          Access restricted to specific time windows:
        </p>
        <ul>
          <li>Business hours only.</li>
          <li>Temporary access (contractors, interns).</li>
          <li>Scheduled access (maintenance windows).</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              1. Design an authorization system for a multi-tenant SaaS platform. What model do you choose?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Model:</strong> RBAC for simplicity + tenant isolation. Roles: admin, editor, viewer per tenant.</li>
                <li><strong>Tenant isolation:</strong> Include tenant_id in all permission checks. Users only have permissions within their tenant.</li>
                <li><strong>Storage:</strong> roles table, permissions table, role_permissions junction, user_roles junction, all with tenant_id.</li>
                <li><strong>Cache:</strong> Cache user permissions in Redis (tenant:&#123;id&#125;:user:&#123;id&#125;:permissions) with TTL.</li>
                <li><strong>Check:</strong> Middleware checks permissions before each request. Return 403 Forbidden if denied.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              2. Compare RBAC and ABAC. When would you choose each?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>RBAC:</strong> Permissions assigned to roles, users assigned to roles. ✓ Simple, easy to audit. ✗ Role explosion at scale.</li>
                <li><strong>ABAC:</strong> Policies based on attributes (user, resource, environment). ✓ Fine-grained, dynamic. ✗ Complex policies, harder to debug.</li>
                <li><strong>Choose RBAC when:</strong> Clear role hierarchy, stable permissions (enterprise apps).</li>
                <li><strong>Choose ABAC when:</strong> Dynamic policies needed (location-based, time-based, clearance-level access).</li>
                <li><strong>Hybrid:</strong> RBAC for base permissions + ABAC for exceptional cases.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              3. How do you implement &quot;manager can access team&apos;s resources&quot; in your authorization model?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Hierarchical RBAC:</strong> Manager role inherits all team member permissions automatically.</li>
                <li><strong>Relationship-based:</strong> Store manager_id in user table. Check if requesting user is manager of resource owner.</li>
                <li><strong>Query:</strong> SELECT * FROM resources WHERE owner_id = :user_id OR manager_id = (SELECT manager_id FROM users WHERE id = :user_id).</li>
                <li><strong>Cache:</strong> Cache team hierarchy in Redis. Invalidate on org structure changes.</li>
                <li><strong>Best practice:</strong> Combine RBAC (base permissions) + relationship checks (manager access).</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              4. Design a permission system for a document collaboration tool with owners, editors, and viewers.
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>Model:</strong> ReBAC (Relationship-Based Access Control). Permissions based on user-document relationship.</li>
                <li><strong>Roles per document:</strong> owner (full access), editor (read/write), viewer (read-only).</li>
                <li><strong>Storage:</strong> document_permissions table (document_id, user_id, role).</li>
                <li><strong>Inheritance:</strong> Folder permissions cascade to documents unless explicitly overridden.</li>
                <li><strong>Sharing:</strong> Owner can grant/revoke access. Generate shareable links with specific permissions.</li>
                <li><strong>Audit:</strong> Log all permission changes and document access.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              5. How do you handle authorization caching? What are the consistency implications?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>What to cache:</strong> User permissions, role memberships, resource ACLs.</li>
                <li><strong>Cache invalidation:</strong> Invalidate on permission change, role assignment, user deletion.</li>
                <li><strong>TTL strategy:</strong> Short TTL (5 min) for frequently changing permissions. Longer TTL (1 hour) for stable roles.</li>
                <li><strong>Consistency implications:</strong> Stale cache = delayed permission revocation (security risk).</li>
                <li><strong>Mitigation:</strong> Version permissions, include version in cache key. Check version on critical operations.</li>
                <li><strong>Best practice:</strong> Cache read permissions, always check write/delete permissions against database.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-6">
            <p className="font-semibold">
              6. Explain how Open Policy Agent (OPA) works. What are the benefits of externalizing authorization?
            </p>
            <div className="mt-4 p-4 bg-panel rounded-lg">
              <p className="font-semibold text-accent">Answer:</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li><strong>OPA:</strong> General-purpose policy engine. Policies written in Rego (declarative language).</li>
                <li><strong>How it works:</strong> Application sends query (user, resource, action) to OPA. OPA evaluates against policies. Returns allow/deny decision.</li>
                <li><strong>Benefits:</strong> (1) Centralized policies (consistent across services). (2) Separation of concerns (authz logic separate from business logic). (3) Easy auditing (all policies in one place). (4) Dynamic updates (change policies without redeploying).</li>
                <li><strong>Trade-offs:</strong> Network latency, single point of failure (mitigate with local OPA sidecar).</li>
                <li><strong>Use cases:</strong> Microservices authorization, Kubernetes admission control, API gateway policies.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Authorization Checklist</h2>
        <ul className="space-y-2">
          <li>✓ Selected appropriate model (RBAC, ABAC, ACL, or hybrid)</li>
          <li>✓ Principle of least privilege enforced</li>
          <li>✓ Authorization checks at API boundaries</li>
          <li>✓ Resource-level authorization implemented</li>
          <li>✓ Audit logging for access decisions</li>
          <li>✓ Regular permission reviews</li>
          <li>✓ Emergency access procedures documented</li>
          <li>✓ Authorization caching with invalidation</li>
          <li>✓ Default deny policy</li>
          <li>✓ Separation of duties enforced</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
