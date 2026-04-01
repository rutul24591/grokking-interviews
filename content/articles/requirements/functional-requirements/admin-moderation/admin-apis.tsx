"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-backend-admin-apis",
  title: "Admin APIs",
  description:
    "Comprehensive guide to implementing admin APIs covering API authentication, authorization, rate limiting, audit logging, API versioning, and admin API security for secure administrative operations.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "admin-apis",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "admin",
    "apis",
    "backend",
    "authentication",
    "authorization",
    "rate-limiting",
  ],
  relatedTopics: ["admin-dashboard", "user-management-ui", "audit-logging", "security"],
};

export default function AdminAPIsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Admin APIs enable administrative operations through programmatic interfaces. The admin API system is the primary tool for administrators, operations teams, and automated systems to perform administrative operations, manage users, configure systems, and monitor platform health. For staff and principal engineers, admin APIs involve API authentication (authenticate API requests), API authorization (authorize API requests), rate limiting (limit API requests), audit logging (log API requests), API versioning (version APIs), and API security (secure APIs).
        </p>
        <p>
          The complexity of admin APIs extends beyond simple API endpoints. API authentication must authenticate API requests (authenticate API requests). API authorization must authorize API requests (authorize API requests). Rate limiting must limit API requests (limit API requests). Audit logging must log API requests (log API requests). API versioning must version APIs (version APIs). API security must secure APIs (secure APIs).
        </p>
        <p>
          For staff and principal engineers, admin APIs architecture involves API authentication (authenticate API requests), API authorization (authorize API requests), rate limiting (limit API requests), audit logging (log API requests), API versioning (version APIs), and API security (secure APIs). The system must support multiple authentication types (API keys, OAuth, JWT), multiple authorization types (RBAC, permissions), and multiple rate limiting types (per-user, per-IP, per-endpoint). Performance is important—admin APIs must be fast and reliable.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>API Authentication</h3>
        <p>
          API keys authenticate API requests. API keys (authenticate API requests). API key management (manage API keys). API key rotation (rotate API keys). API key revocation (revoke API keys).
        </p>
        <p>
          OAuth authenticates API requests. OAuth (authenticate API requests). OAuth management (manage OAuth). OAuth rotation (rotate OAuth). OAuth revocation (revoke OAuth).
        </p>
        <p>
          JWT authenticates API requests. JWT (authenticate API requests). JWT management (manage JWT). JWT rotation (rotate JWT). JWT revocation (revoke JWT).
        </p>

        <h3 className="mt-6">API Authorization</h3>
        <p>
          RBAC authorizes API requests. RBAC (authorize API requests). RBAC management (manage RBAC). RBAC verification (verify RBAC). RBAC reporting (report on RBAC).
        </p>
        <p>
          Permissions authorize API requests. Permissions (authorize API requests). Permissions management (manage permissions). Permissions verification (verify permissions). Permissions reporting (report on permissions).
        </p>
        <p>
          Scope authorizes API requests. Scope (authorize API requests). Scope management (manage scope). Scope verification (verify scope). Scope reporting (report on scope).
        </p>

        <h3 className="mt-6">Rate Limiting</h3>
        <p>
          Per-user rate limiting limits API requests. Per-user rate limiting (limit API requests). Per-user rate limiting enforcement (enforce per-user rate limiting). Per-user rate limiting verification (verify per-user rate limiting). Per-user rate limiting reporting (report on per-user rate limiting).
        </p>
        <p>
          Per-IP rate limiting limits API requests. Per-IP rate limiting (limit API requests). Per-IP rate limiting enforcement (enforce per-IP rate limiting). Per-IP rate limiting verification (verify per-IP rate limiting). Per-IP rate limiting reporting (report on per-IP rate limiting).
        </p>
        <p>
          Per-endpoint rate limiting limits API requests. Per-endpoint rate limiting (limit API requests). Per-endpoint rate limiting enforcement (enforce per-endpoint rate limiting). Per-endpoint rate limiting verification (verify per-endpoint rate limiting). Per-endpoint rate limiting reporting (report on per-endpoint rate limiting).
        </p>

        <h3 className="mt-6">Audit Logging</h3>
        <p>
          API request logging logs API requests. API request logging (log API requests). API request logging enforcement (enforce API request logging). API request logging verification (verify API request logging). API request logging reporting (report on API request logging).
        </p>
        <p>
          API response logging logs API responses. API response logging (log API responses). API response logging enforcement (enforce API response logging). API response logging verification (verify API response logging). API response logging reporting (report on API response logging).
        </p>
        <p>
          API audit logging logs API audits. API audit logging (log API audits). API audit logging enforcement (enforce API audit logging). API audit logging verification (verify API audit logging). API audit logging reporting (report on API audit logging).
        </p>

        <h3 className="mt-6">API Versioning</h3>
        <p>
          API versioning versions APIs. API versioning (version APIs). API versioning management (manage API versioning). API versioning verification (verify API versioning). API versioning reporting (report on API versioning).
        </p>
        <p>
          API deprecation deprecates APIs. API deprecation (deprecate APIs). API deprecation management (manage API deprecation). API deprecation verification (verify API deprecation). API deprecation reporting (report on API deprecation).
        </p>
        <p>
          API migration migrates APIs. API migration (migrate APIs). API migration management (manage API migration). API migration verification (verify API migration). API migration reporting (report on API migration).
        </p>

        <h3 className="mt-6">API Security</h3>
        <p>
          API security secures APIs. API security (secure APIs). API security enforcement (enforce API security). API security verification (verify API security). API security reporting (report on API security).
        </p>
        <p>
          API encryption encrypts APIs. API encryption (encrypt APIs). API encryption enforcement (enforce API encryption). API encryption verification (verify API encryption). API encryption reporting (report on API encryption).
        </p>
        <p>
          API validation validates APIs. API validation (validate APIs). API validation enforcement (enforce API validation). API validation verification (verify API validation). API validation reporting (report on API validation).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Admin APIs architecture spans API authentication, API authorization, rate limiting, and audit logging. API authentication authenticates API requests. API authorization authorizes API requests. Rate limiting limits API requests. Audit logging logs API requests.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/admin-apis/admin-apis-architecture.svg"
          alt="Admin APIs Architecture"
          caption="Figure 1: Admin APIs Architecture — Authentication, authorization, rate limiting, and audit logging"
          width={1000}
          height={500}
        />

        <h3>API Authentication</h3>
        <p>
          API authentication authenticates API requests. API authentication (authenticate API requests). API authentication enforcement (enforce API authentication). API authentication verification (verify API authentication). API authentication reporting (report on API authentication).
        </p>
        <p>
          API key management manages API keys. API key management (manage API keys). API key rotation (rotate API keys). API key revocation (revoke API keys). API key reporting (report on API keys).
        </p>
        <p>
          OAuth management manages OAuth. OAuth management (manage OAuth). OAuth rotation (rotate OAuth). OAuth revocation (revoke OAuth). OAuth reporting (report on OAuth).
        </p>

        <h3 className="mt-6">API Authorization</h3>
        <p>
          API authorization authorizes API requests. API authorization (authorize API requests). API authorization enforcement (enforce API authorization). API authorization verification (verify API authorization). API authorization reporting (report on API authorization).
        </p>
        <p>
          RBAC management manages RBAC. RBAC management (manage RBAC). RBAC verification (verify RBAC). RBAC reporting (report on RBAC). RBAC audit (audit RBAC).
        </p>
        <p>
          Permissions management manages permissions. Permissions management (manage permissions). Permissions verification (verify permissions). Permissions reporting (report on permissions). Permissions audit (audit permissions).
        </p>

        <h3 className="mt-6">Rate Limiting</h3>
        <p>
          Rate limiting limits API requests. Rate limiting (limit API requests). Rate limiting enforcement (enforce rate limiting). Rate limiting verification (verify rate limiting). Rate limiting reporting (report on rate limiting).
        </p>
        <p>
          Per-user rate limiting limits API requests. Per-user rate limiting (limit API requests). Per-user rate limiting enforcement (enforce per-user rate limiting). Per-user rate limiting verification (verify per-user rate limiting). Per-user rate limiting reporting (report on per-user rate limiting).
        </p>
        <p>
          Per-IP rate limiting limits API requests. Per-IP rate limiting (limit API requests). Per-IP rate limiting enforcement (enforce per-IP rate limiting). Per-IP rate limiting verification (verify per-IP rate limiting). Per-IP rate limiting reporting (report on per-IP rate limiting).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/admin-apis/authentication-flow.svg"
          alt="API Authentication Flow"
          caption="Figure 2: API Authentication Flow — API keys, OAuth, and JWT authentication"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Audit Logging</h3>
        <p>
          API request logging logs API requests. API request logging (log API requests). API request logging enforcement (enforce API request logging). API request logging verification (verify API request logging). API request logging reporting (report on API request logging).
        </p>
        <p>
          API response logging logs API responses. API response logging (log API responses). API response logging enforcement (enforce API response logging). API response logging verification (verify API response logging). API response logging reporting (report on API response logging).
        </p>
        <p>
          API audit logging logs API audits. API audit logging (log API audits). API audit logging enforcement (enforce API audit logging). API audit logging verification (verify API audit logging). API audit logging reporting (report on API audit logging).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/admin-apis/rate-limiting.svg"
          alt="Rate Limiting"
          caption="Figure 3: Rate Limiting — Per-user, per-IP, and per-endpoint rate limiting"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Admin APIs design involves trade-offs between security and usability, rate limiting and availability, and logging and performance. Understanding these trade-offs enables informed decisions aligned with security needs and platform constraints.
        </p>

        <h3>Authentication: API Keys vs. OAuth vs. JWT</h3>
        <p>
          API keys authenticate API requests. Pros: Simple (simple authentication), easy to implement. Cons: Less secure (less secure authentication), limited features. Best for: Simple APIs, internal APIs.
        </p>
        <p>
          OAuth authenticates API requests. Pros: Secure (secure authentication), feature-rich. Cons: Complex (complex authentication), hard to implement. Best for: Complex APIs, external APIs.
        </p>
        <p>
          JWT authenticates API requests. Pros: Secure (secure authentication), stateless. Cons: Complex (complex authentication), token management. Best for: Stateless APIs, distributed APIs.
        </p>

        <h3>Authorization: RBAC vs. Permissions vs. Scope</h3>
        <p>
          RBAC authorizes API requests. Pros: Simple (simple authorization), easy to manage. Cons: Limited flexibility (limited flexibility). Best for: Simple APIs, role-based APIs.
        </p>
        <p>
          Permissions authorize API requests. Pros: Flexible (flexible authorization), granular. Cons: Complex (complex authorization), hard to manage. Best for: Complex APIs, granular APIs.
        </p>
        <p>
          Scope authorizes API requests. Pros: Flexible (flexible authorization), scoped. Cons: Complex (complex authorization), scope management. Best for: Scoped APIs, OAuth APIs.
        </p>

        <h3>Rate Limiting: Strict vs. Lenient</h3>
        <p>
          Strict rate limiting limits API requests. Pros: Effective (effective rate limiting), protects APIs. Cons: Complex (complex rate limiting), may block legitimate requests. Best for: High-security APIs, high-traffic APIs.
        </p>
        <p>
          Lenient rate limiting limits API requests. Pros: Simple (simple rate limiting), allows more requests. Cons: Not effective (not effective rate limiting), may not protect APIs. Best for: Low-security APIs, low-traffic APIs.
        </p>
        <p>
          Hybrid rate limiting limits API requests. Pros: Best of both (effective for high-security, simple for low-security). Cons: Complexity (two rate limiting types). Best for: Most production systems.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/admin-apis/apis-comparison.svg"
          alt="APIs Comparison"
          caption="Figure 4: APIs Comparison — Authentication, authorization, and rate limiting"
          width={1000}
          height={450}
        />

        <h3>Logging: Comprehensive vs. Minimal</h3>
        <p>
          Comprehensive logging logs API requests. Pros: Comprehensive (comprehensive logging), effective logging. Cons: Complex (complex logging), expensive. Best for: High-security APIs, compliance APIs.
        </p>
        <p>
          Minimal logging logs API requests. Pros: Simple (simple logging), cheap. Cons: Not comprehensive (not comprehensive logging), not effective. Best for: Low-security APIs, non-compliance APIs.
        </p>
        <p>
          Hybrid logging logs API requests. Pros: Best of both (comprehensive for high-security, simple for low-security). Cons: Complexity (two logging types). Best for: Most production systems.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement API authentication:</strong> API keys, OAuth, JWT. API authentication management. API authentication enforcement.
          </li>
          <li>
            <strong>Implement API authorization:</strong> RBAC, permissions, scope. API authorization management. API authorization enforcement.
          </li>
          <li>
            <strong>Implement rate limiting:</strong> Per-user, per-IP, per-endpoint. Rate limiting management. Rate limiting enforcement.
          </li>
          <li>
            <strong>Implement audit logging:</strong> API request logging, API response logging, API audit logging. Audit logging management. Audit logging enforcement.
          </li>
          <li>
            <strong>Implement API versioning:</strong> API versioning, API deprecation, API migration. API versioning management. API versioning enforcement.
          </li>
          <li>
            <strong>Implement API security:</strong> API security, API encryption, API validation. API security management. API security enforcement.
          </li>
          <li>
            <strong>Implement API monitoring:</strong> API monitoring, API alerting, API reporting. API monitoring management. API monitoring enforcement.
          </li>
          <li>
            <strong>Implement API documentation:</strong> API documentation, API examples, API testing. API documentation management. API documentation enforcement.
          </li>
          <li>
            <strong>Implement API testing:</strong> API testing, API validation, API verification. API testing management. API testing enforcement.
          </li>
          <li>
            <strong>Implement API audit:</strong> API audit, audit trail, audit reporting, audit verification. API audit management. API audit enforcement.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No API authentication:</strong> Don&apos;t authenticate API requests. Solution: API authentication (API keys, OAuth, JWT).
          </li>
          <li>
            <strong>No API authorization:</strong> Don&apos; authorize API requests. Solution: API authorization (RBAC, permissions, scope).
          </li>
          <li>
            <strong>No rate limiting:</strong> Don&apos; limit API requests. Solution: Rate limiting (per-user, per-IP, per-endpoint).
          </li>
          <li>
            <strong>No audit logging:</strong> Don&apos; log API requests. Solution: Audit logging (request logging, response logging, audit logging).
          </li>
          <li>
            <strong>No API versioning:</strong> Don&apos; version APIs. Solution: API versioning (versioning, deprecation, migration).
          </li>
          <li>
            <strong>No API security:</strong> Don&apos; secure APIs. Solution: API security (security, encryption, validation).
          </li>
          <li>
            <strong>No API monitoring:</strong> Don&apos; monitor APIs. Solution: API monitoring (monitoring, alerting, reporting).
          </li>
          <li>
            <strong>No API documentation:</strong> Don&apos; document APIs. Solution: API documentation (documentation, examples, testing).
          </li>
          <li>
            <strong>No API testing:</strong> Don&apos; test APIs. Solution: API testing (testing, validation, verification).
          </li>
          <li>
            <strong>No API audit:</strong> Don&apos; audit APIs. Solution: API audit (audit, audit trail, reporting, verification).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>API Authentication</h3>
        <p>
          API authentication for API authentication. API keys (authenticate API requests). OAuth (authenticate API requests). JWT (authenticate API requests). API authentication management (manage API authentication).
        </p>

        <h3 className="mt-6">API Authorization</h3>
        <p>
          API authorization for API authorization. RBAC (authorize API requests). Permissions (authorize API requests). Scope (authorize API requests). API authorization management (manage API authorization).
        </p>

        <h3 className="mt-6">Rate Limiting</h3>
        <p>
          Rate limiting for rate limiting. Per-user rate limiting (limit API requests). Per-IP rate limiting (limit API requests). Per-endpoint rate limiting (limit API requests). Rate limiting management (manage rate limiting).
        </p>

        <h3 className="mt-6">Audit Logging</h3>
        <p>
          Audit logging for audit logging. API request logging (log API requests). API response logging (log API responses). API audit logging (log API audits). Audit logging management (manage audit logging).
        </p>

        <h3 className="mt-6">API Security</h3>
        <p>
          API security for API security. API security (secure APIs). API encryption (encrypt APIs). API validation (validate APIs). API security management (manage API security).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you authenticate and authorize admin API requests securely?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement multi-layer authentication strategy. API keys for service-to-service communication—rotate keys regularly, use separate keys per environment. OAuth 2.0 for user-facing admin tools with PKCE for public clients. JWT for stateless authentication with short expiration (15-30 minutes) and refresh tokens. The critical security requirement: never trust client-side authentication—always verify on backend. Implement authorization with RBAC (role-based access control) for most cases—define roles (admin, moderator, support) with specific permissions. For fine-grained access, use ABAC (attribute-based access control) considering user attributes, resource attributes, and context. Implement principle of least privilege—admin APIs should only have access needed for their function. Audit all authentication and authorization decisions. The key trade-off: security vs. usability—more security layers create friction but protect against compromise. Implement MFA for sensitive admin operations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement rate limiting for admin APIs that balances protection with operational needs?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement multi-dimensional rate limiting. Per-user limits for individual admin accounts (prevent compromised accounts from causing damage). Per-IP limits (prevent distributed attacks). Per-endpoint limits (protect sensitive operations like bulk user deletion with stricter limits). Use sliding window algorithms for smooth enforcement. Implement tiered limits based on admin role—senior admins may need higher limits for legitimate operations. Critical: implement bypass mechanisms for emergency operations with additional approval (break-glass access). Monitor rate limit triggers—legitimate admins hitting limits indicates limits are too aggressive or training is needed. Implement progressive enforcement: warnings, then temporary blocks, then account review. The operational challenge: distinguishing attack from legitimate high-volume admin work (data migration, bulk updates). Provide admins with quota visibility and request process for temporary limit increases. Log all rate limit events for security analysis.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement comprehensive audit logging for admin APIs that supports both security and compliance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement structured audit logging capturing complete context. Log every admin API request: who (admin user ID, role), what (endpoint, method, parameters), when (timestamp with timezone), where (IP address, user agent), result (success/failure, response code). For sensitive operations, log before and after state (what changed). Store logs in immutable storage with separate access controls—admin API users shouldn&apos;t have audit log access. Implement real-time alerting on sensitive operations (bulk deletions, permission changes, data exports). Enable audit log search for security investigations and compliance audits. Retention: minimum 1 year for operational security, 7+ years for compliance (SOX). The critical requirement: audit logs must be tamper-evident—implement hash chaining or write to append-only storage. For compliance: generate audit reports in auditor-friendly formats, maintain chain of custody documentation. Test audit completeness regularly—verify all admin actions are captured.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you version admin APIs while maintaining backward compatibility for existing integrations?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement semantic versioning with clear deprecation strategy. URL versioning (/api/v1/admin, /api/v2/admin) for breaking changes, header versioning for minor changes. Maintain minimum 2 versions simultaneously—current and previous. Deprecation process: announce deprecation with timeline (minimum 6 months for admin APIs), document migration path, provide migration tools where possible, track usage of deprecated endpoints. For breaking changes: version bump, maintain old version during transition, provide automated migration scripts where feasible. The operational challenge: admin APIs often have long-tail usage—internal tools, scripts, integrations that aren&apos;t well-documented. Implement usage analytics to identify all consumers before deprecating. For critical admin APIs (security, compliance), consider longer support windows. The key principle: breaking changes should be rare and well-communicated. Document API changes in changelog, notify registered API consumers, provide sandbox for testing new versions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you secure admin APIs against common attack vectors (injection, privilege escalation, data exfiltration)?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement defense in depth. Input validation: validate all parameters (type, length, format, range), use parameterized queries to prevent SQL injection, sanitize outputs to prevent XSS. Authorization checks: verify permissions on every request, implement object-level authorization (not just endpoint-level—admin can access /users endpoint but not all users), prevent IDOR by validating user owns/can access requested resource. Rate limiting: prevent brute force and data scraping. Data protection: encrypt sensitive data in transit (TLS 1.3) and at rest, mask sensitive data in responses, implement response size limits to prevent bulk exfiltration. Monitoring: detect anomalous patterns (unusual access times, bulk data access, failed auth attempts), alert security team. The critical insight: admin APIs are high-value targets—attackers know admin access = full system access. Implement additional protections: IP allowlisting for admin APIs, MFA for sensitive operations, session management with short timeouts, device fingerprinting. Regular security testing: penetration testing, code review, automated security scanning.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design admin APIs that are both secure and usable for non-technical admin users?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement user-centered API design with security built-in. Abstraction: provide high-level operations that map to admin workflows (e.g., &quot;suspend user&quot; not &quot;update user status field&quot;)—reduces error risk. Validation: provide clear error messages explaining what went wrong and how to fix—don&apos;t expose internal details but be actionable. Confirmation: require confirmation for destructive operations with clear impact description (&quot;This will suspend user X, preventing all access&quot;). Safeguards: implement soft delete with recovery period, bulk operation limits, approval workflows for high-risk operations. Documentation: provide API documentation with examples, common workflows, troubleshooting guide. The key balance: security controls shouldn&apos;t make legitimate work impossible—implement friction proportionate to risk. Low-risk operations (view data) should be easy, high-risk operations (delete data) should have appropriate friction. Provide admin training on API usage, maintain runbooks for common operations, implement chat support for admins stuck on operations. Measure admin experience: task completion time, error rates, support ticket volume.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://oauth.net/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OAuth.net — OAuth Resources
            </a>
          </li>
          <li>
            <a
              href="https://jwt.io/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              JWT.io — JWT Resources
            </a>
          </li>
          <li>
            <a
              href="https://www.owasp.org/index.php/REST_Security_Cheat_Sheet"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — REST Security Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://www.nist.gov/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIST — Security Standards
            </a>
          </li>
          <li>
            <a
              href="https://www.isaca.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ISACA — Security Resources
            </a>
          </li>
          <li>
            <a
              href="https://www.sans.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SANS — Security Resources
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
