"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-nfr-authorization-model",
  title: "Authorization Model",
  description: "Comprehensive guide to authorization models — RBAC, ABAC, ReBAC, PBAC, policy engines, permission evaluation, and authorization architecture for staff/principal engineer interviews.",
  category: "backend",
  subcategory: "nfr",
  slug: "authorization-model",
  wordCount: 5800,
  readingTime: 25,
  lastUpdated: "2026-04-11",
  tags: ["backend", "nfr", "authorization", "rbac", "abac", "policy-engine", "permissions"],
  relatedTopics: ["authentication-infrastructure", "api-versioning", "data-migration-strategy", "schema-governance"],
};

export default function AuthorizationModelArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Authorization</strong> determines what an authenticated identity is allowed to do within
          a system. While authentication answers &quot;who are you?&quot;, authorization answers &quot;what
          are you permitted to access or perform?&quot; Authorization is evaluated after authentication
          succeeds — an unauthenticated request is rejected at the authentication layer, while an
          authenticated request without sufficient permissions is denied at the authorization layer.
        </p>
        <p>
          Authorization models range from simple role-based access control (RBAC), where permissions are
          assigned to roles and users are assigned to roles, to attribute-based access control (ABAC),
          where permissions are evaluated based on user attributes, resource attributes, environmental
          conditions, and action context. More sophisticated models include relationship-based access
          control (ReBAC) used by Google Zanzibar and social platforms, and policy-based access control
          (PBAC) that uses declarative policy languages like OPA/Rego.
        </p>
        <p>
          For staff and principal engineer candidates, authorization model design demonstrates understanding
          of security architecture, scalability of permission evaluation, and the ability to balance
          granularity with performance. Interviewers expect you to design authorization systems that handle
          millions of permission checks per second, support complex multi-tenant permission models, and
          evolve gracefully as business requirements change.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Distinction: Authentication vs Authorization</h3>
          <p>
            <strong>Authentication</strong> verifies identity — it confirms that the requester is who they claim to be.
            <strong>Authorization</strong> verifies permissions — it confirms that the authenticated identity has the right to perform the requested action on the requested resource.
          </p>
          <p className="mt-3">
            In interviews, always clarify whether the problem is authentication (verifying identity) or
            authorization (verifying permissions). Many candidates conflate the two. A system can
            authenticate without authorizing (verifying identity but denying access), but cannot authorize
            without authenticating.
          </p>
        </div>

        <p>
          Authorization is the most frequently evaluated security decision in a system — every API request,
          every page load, every data query requires an authorization check. A poorly designed authorization
          system either grants excessive access (security vulnerability) or denies legitimate access
          (operational disruption). The best authorization systems are correct (no false allows or denies),
          performant (sub-millisecond evaluation), and maintainable (easy to update as business requirements
          evolve).
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding authorization models requires grasping several foundational concepts about
          permission representation, policy evaluation, and scalability.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">RBAC — Role-Based Access Control</h3>
        <p>
          RBAC assigns permissions to roles (admin, editor, viewer) and assigns users to roles. When a user
          requests access, the system checks whether any of the user&apos;s roles grant the requested
          permission. RBAC is simple to understand, easy to administer, and scales well for organizations
          with clear role hierarchies. However, RBAC struggles with fine-grained permissions (e.g., &quot;user
          can edit documents they own but not documents owned by others&quot;) — this requires either role
          explosion (creating roles for every permission combination) or supplementary logic outside the
          authorization model.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ABAC — Attribute-Based Access Control</h3>
        <p>
          ABAC evaluates permissions based on attributes of the user (department, clearance level, location),
          the resource (classification, owner, sensitivity), the action (read, write, delete), and the
          environment (time of day, network location, device posture). ABAC provides fine-grained control
          without role explosion — a single policy can express &quot;users in the engineering department can
          read documents classified as internal during business hours from corporate networks.&quot; However,
          ABAC policy evaluation is more complex and slower than RBAC lookups, and policy management requires
          specialized expertise.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">ReBAC — Relationship-Based Access Control</h3>
        <p>
          ReBAC determines permissions based on relationships between users and resources. Google Drive uses
          ReBAC — a user can access a document if they are the owner, have been explicitly shared the
          document, are a member of a group that has been shared the document, or are in the same organization
          as the owner with default sharing enabled. ReBAC naturally models social and collaborative
          permissions but requires a graph database or specialized authorization service (like Google
          Zanzibar) to evaluate permissions efficiently at scale.
        </p>
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Authorization architecture spans policy definition, permission storage, evaluation engines, and
          enforcement points throughout the system.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/authorization-models-comparison.svg"
          alt="Authorization Models Comparison"
          caption="Authorization Models — comparing RBAC, ABAC, ReBAC, and PBAC with their trade-offs and use cases"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Policy Evaluation Architecture</h3>
        <p>
          When a request arrives at an API endpoint, the authorization enforcement point (middleware, API
          gateway, or service-level interceptor) extracts the user&apos;s identity, the requested action,
          and the target resource. It sends this information to the policy evaluation engine, which loads
          applicable policies, evaluates them against the request context, and returns a decision (allow or
          deny) with optional obligations (require MFA, log the access, redact certain fields).
        </p>
        <p>
          For high-throughput systems, the policy evaluation engine is a dedicated service (OPA, Cedar, or
          custom) that caches policies in memory and evaluates them in sub-millisecond time. The enforcement
          point caches recent authorization decisions (with short TTLs, typically 1-5 seconds) to avoid
          repeated policy evaluations for the same user-resource-action combination.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/permission-evaluation-flow.svg"
          alt="Permission Evaluation Flow"
          caption="Permission Evaluation — showing request context, policy loading, evaluation engine, and enforcement"
        />

        <ArticleImage
          src="/diagrams/requirements/nfr/backend-nfr/rbac-abac-hybrid-architecture.svg"
          alt="RBAC/ABAC Hybrid Architecture"
          caption="Hybrid Authorization — combining RBAC for coarse permissions with ABAC for fine-grained conditions"
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-Offs &amp; Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Model</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>RBAC</strong></td>
              <td className="p-3">
                Simple to understand and administer. Fast evaluation (role lookup). Good audit trail.
              </td>
              <td className="p-3">
                Role explosion for fine-grained permissions. Cannot express contextual conditions. Inflexible for dynamic environments.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>ABAC</strong></td>
              <td className="p-3">
                Fine-grained without role explosion. Contextual evaluation. Supports complex business rules.
              </td>
              <td className="p-3">
                Complex policy management. Slower evaluation. Requires attribute infrastructure.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>ReBAC</strong></td>
              <td className="p-3">
                Natural modeling of sharing and collaboration. Scales to billions of relationships.
              </td>
              <td className="p-3">
                Requires graph infrastructure. Complex to reason about. Permission debugging is difficult.
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>PBAC (OPA/Rego)</strong></td>
              <td className="p-3">
                Declarative policies. Version-controlled. Testable. Unified policy across services.
              </td>
              <td className="p-3">
                Learning curve for Rego. Policy distribution complexity. Debugging policy decisions.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Use RBAC as the Foundation, ABAC for Refinement</h3>
        <p>
          The most practical approach for most organizations is a hybrid model: RBAC provides the
          coarse-grained permission structure (roles like admin, editor, viewer), and ABAC adds
          fine-grained conditions on top (editors can only edit documents they own, admins can only access
          resources in their region). This avoids role explosion while maintaining the simplicity of RBAC
          for the majority of permission decisions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Centralize Policy Evaluation</h3>
        <p>
          Authorization logic should not be scattered across services. Use a centralized policy engine
          (OPA, Cedar, or a custom service) that all services query for authorization decisions. This
          ensures consistent policy evaluation across the system, simplifies policy updates (change once,
          propagate everywhere), and provides a single audit log for all authorization decisions. The
          centralized engine should be highly available — if the policy engine is down, all authorization
          checks fail, effectively denying all access.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Implement Deny-by-Default</h3>
        <p>
          The default authorization decision should be deny — if no policy explicitly grants access, the
          request is denied. This is the principle of least privilege in practice. Never implement
          allow-by-default (grant access unless explicitly denied) — it is too easy for a missing policy
          rule to inadvertently grant access. Always log denied requests for security monitoring — a
          pattern of denied requests may indicate a misconfiguration or an active attack.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Version and Test Authorization Policies</h3>
        <p>
          Authorization policies are code — they should be version-controlled, code-reviewed, and tested
          before deployment. Write unit tests for each policy rule: given a specific user, resource, action,
          and context, verify that the policy returns the expected decision. Write integration tests that
          simulate realistic permission scenarios across multiple services. Test policy changes in a staging
          environment before deploying to production — a policy error can grant unauthorized access or deny
          legitimate access to all users.
        </p>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Role Explosion</h3>
        <p>
          The most common RBAC pitfall is creating a separate role for every permission combination —
          &quot;engineering-manager-us-east-docs-editor&quot;, &quot;engineering-manager-us-east-docs-viewer&quot;,
          and so on. Role explosion makes role administration unwieldy, causes role assignment errors, and
          makes it difficult to understand who has what access. When you find yourself creating roles with
          compound names, it is time to introduce ABAC conditions instead.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Authorization at the Wrong Layer</h3>
        <p>
          Performing authorization only at the API gateway is insufficient — direct service-to-service
          calls bypass the gateway and its authorization checks. Authorization must be enforced at every
          layer: the API gateway (coarse-grained: is this user allowed to access this API?), the service
          layer (fine-grained: is this user allowed to perform this action on this specific resource?),
          and the data layer (row-level: is this user allowed to see this specific row?). Defense in depth
          ensures that a misconfiguration at one layer does not grant unauthorized access.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Caching Authorization Decisions Too Long</h3>
        <p>
          Caching authorization decisions improves performance but risks serving stale permissions. If a
          user&apos;s role is changed or a policy is updated, cached decisions may grant access that should
          be denied (or vice versa) until the cache expires. Set cache TTLs based on the risk level —
          high-risk actions (admin access, data export) should not be cached or should have very short
          TTLs (1 second). Low-risk actions (reading public data) can be cached longer (30 seconds to 5
          minutes).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Ignoring Transitive Permissions</h3>
        <p>
          In ReBAC systems, permissions are often transitive — if user A can share a document with group B,
          and user C is a member of group B, then user C can access the document through the transitive
          relationship. Failing to account for transitivity during permission evaluation creates security
          gaps — users may gain access through relationship chains that the policy author did not anticipate.
          Always evaluate the full transitive closure of relationships, not just direct relationships.
        </p>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Google Zanzibar — Global Authorization Service</h3>
        <p>
          Google Zanzibar is a global authorization service that evaluates ReBAC permissions for Google
          Drive, Calendar, Cloud, and Photos. Zanzibar stores relationships as a directed graph (user A
          → owner → document X, group B → viewer → document X, user C → member → group B) and evaluates
          permissions by traversing the graph from the user to the resource. Zanzibar handles millions of
          permission checks per second with sub-10ms latency, using a globally distributed architecture
          with consistent hashing for relationship storage and optimistic concurrency for relationship
          updates.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">AWS IAM — Policy-Based Access Control</h3>
        <p>
          AWS Identity and Access Management (IAM) uses PBAC with JSON policy documents. Each policy
          defines who (principal), can do what (action), on which resources (resource), under what
          conditions (condition). AWS evaluates all applicable policies (identity-based, resource-based,
          permissions boundaries, session policies) and returns an allow only if at least one policy
          allows and no policy denies. This &quot;explicit deny overrides allow&quot; semantics ensures
          that security guardrails cannot be bypassed by overly permissive role policies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">GitHub — Organization-Level RBAC with ABAC Refinement</h3>
        <p>
          GitHub uses RBAC for organization-level permissions (owner, member, outside collaborator) with
          ABAC refinement for repository-level access (read, write, admin, maintain, triage). Repository
          permissions can be further refined with branch protection rules (only certain roles can push to
          main), code owner requirements (specific reviewers must approve changes), and environment
          protection rules (deployments to production require additional approvals). This hybrid model
          allows GitHub to support organizations with thousands of members and complex permission
          requirements while maintaining a manageable role structure.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Salesforce — Multi-Tenant Row-Level Authorization</h3>
        <p>
          Salesforce implements row-level authorization for multi-tenant data isolation. Each data record
          has an organization ID, and every query automatically filters by the authenticated user&apos;s
          organization ID. Beyond organization-level isolation, Salesforce supports role hierarchies
          (managers can see their subordinates&apos; records), sharing rules (cross-organization sharing
          based on criteria), and manual sharing (record owners grant access to specific users). This
          layered authorization model ensures that multi-tenant data isolation is maintained while allowing
          flexible cross-tenant collaboration when explicitly configured.
        </p>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>
        <p>
          Authorization vulnerabilities are among the most common and impactful security issues — they allow authenticated attackers to access data and perform actions beyond their intended permissions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authorization Vulnerabilities</h3>
          <ul className="space-y-2">
            <li>
              <strong>Broken Object Level Authorization (BOLA/IDOR):</strong> Users access resources belonging to other users by manipulating resource IDs (changing /api/documents/123 to /api/documents/124). Mitigation: always verify that the authenticated user has permission to access the specific resource ID, not just the resource type. Implement resource ownership checks at every API endpoint.
            </li>
            <li>
              <strong>Broken Function Level Authorization:</strong> Users access administrative functions by directly calling admin endpoints. Mitigation: enforce role-based checks on every endpoint, not just UI-level visibility. Regularly audit endpoints for missing authorization checks.
            </li>
            <li>
              <strong>Privilege Escalation:</strong> Users gain elevated permissions through policy misconfigurations, transitive relationships, or role assignment errors. Mitigation: implement periodic access reviews, automate detection of excessive permissions, enforce separation of duties for critical roles.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authorization Bypass Techniques</h3>
          <ul className="space-y-2">
            <li>
              <strong>HTTP Method Manipulation:</strong> A user with read access to a resource attempts to modify it by changing GET to PUT/POST/PATCH. Mitigation: enforce authorization checks on all HTTP methods, not just the primary method. Validate that the user has the required permission for the specific method.
            </li>
            <li>
              <strong>Batch Endpoint Exploitation:</strong> Users exploit batch endpoints to access resources they cannot access individually. Mitigation: enforce authorization checks on each item in batch operations, not just on the batch endpoint itself.
            </li>
            <li>
              <strong>Parameter Pollution:</strong> Users manipulate query parameters to bypass authorization (e.g., org_id=own-org&org_id=other-org). Mitigation: validate that all authorization-relevant parameters are consistent and belong to the authenticated user&apos;s scope. Use allowlists for parameter values.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authorization Auditing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Decision Logging:</strong> Log every authorization decision (allow/deny) with the user identity, resource, action, policy evaluated, and timestamp. Use logs for security monitoring, compliance auditing, and debugging authorization issues.
            </li>
            <li>
              <strong>Periodic Access Reviews:</strong> Regularly review user permissions to detect excessive access, dormant accounts with elevated permissions, and role assignment drift. Automate access reviews where possible — flag accounts that have not used their permissions in 90+ days.
            </li>
            <li>
              <strong>Policy Change Auditing:</strong> Track all policy changes with who made the change, what changed, and when. Require approval for policy changes that grant new permissions. Test policy changes in staging before deploying to production.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 9: Testing Strategies */}
      <section>
        <h2>Testing Strategies</h2>
        <p>
          Authorization models must be validated through systematic testing — policy correctness, performance under load, and security against bypass techniques must all be verified.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Policy Correctness Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>Unit Tests for Policies:</strong> Test each policy rule independently — given a specific user, resource, action, and context, verify the expected decision. Test both positive cases (should allow) and negative cases (should deny). Test edge cases (missing attributes, invalid values, expired credentials).
            </li>
            <li>
              <strong>Integration Tests:</strong> Test authorization across the full request path — from API gateway through service layer to data layer. Verify that authorization is enforced at every layer and that bypassing one layer does not grant unauthorized access.
            </li>
            <li>
              <strong>Regression Tests:</strong> When policies change, run the full test suite to verify that existing permissions are not inadvertently changed. Maintain a permission matrix that documents expected permissions for key user-resource-action combinations and verify it after every policy change.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Testing</h3>
          <ul className="space-y-2">
            <li>
              <strong>IDOR Testing:</strong> Test every endpoint that accepts resource IDs — verify that users cannot access resources belonging to other users by manipulating IDs. Use automated tools (Burp Suite, OWASP ZAP) combined with manual testing.
            </li>
            <li>
              <strong>Privilege Escalation Testing:</strong> Attempt to escalate privileges through role manipulation, policy exploitation, transitive relationship abuse, and parameter pollution. Verify that the system correctly denies unauthorized access at every attempt.
            </li>
            <li>
              <strong>Penetration Testing:</strong> Engage professional penetration testers to test authorization controls. Provide them with accounts at different permission levels and ask them to access resources and perform actions beyond their assigned permissions.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authorization Readiness Checklist</h3>
          <ul className="space-y-2">
            <li>✓ Authorization model chosen (RBAC, ABAC, ReBAC, or hybrid) and documented</li>
            <li>✓ Deny-by-default enforced — no access granted without explicit policy</li>
            <li>✓ Authorization enforced at every layer (gateway, service, data)</li>
            <li>✓ Resource ownership checks implemented on all endpoints accepting resource IDs</li>
            <li>✓ Policy engine centralized and highly available (multi-AZ deployment)</li>
            <li>✓ Authorization decisions cached with appropriate TTLs based on risk level</li>
            <li>✓ Policy changes version-controlled, code-reviewed, and tested before deployment</li>
            <li>✓ All authorization decisions logged with user, resource, action, and decision</li>
            <li>✓ Periodic access reviews scheduled (quarterly for standard roles, monthly for admin roles)</li>
            <li>✓ IDOR and privilege escalation testing included in security test suite</li>
          </ul>
        </div>
      </section>

      {/* Section 10: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://research.google/pubs/pub48190/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google — Zanzibar: Google&apos;s Consistent, Global Authorization System
            </a>
          </li>
          <li>
            <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS — IAM Policy and Permissions Overview
            </a>
          </li>
          <li>
            <a href="https://www.openpolicyagent.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Open Policy Agent (OPA) — Policy Engine for Cloud-Native Environments
            </a>
          </li>
          <li>
            <a href="https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP — Authorization Testing Guide
            </a>
          </li>
          <li>
            <a href="https://www.cedarpolicy.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              AWS Cedar — Fine-Grained Permission Language
            </a>
          </li>
          <li>
            <a href="https://www.nist.gov/publications/role-based-access-control-rbac" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST — Role-Based Access Control Standard
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
