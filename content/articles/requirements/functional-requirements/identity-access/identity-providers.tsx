"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-other-identity-providers",
  title: "Identity Providers",
  description:
    "Comprehensive guide to integrating with identity providers covering Okta, Azure AD, OneLogin, Ping Identity, multi-IdP support, and enterprise SSO patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "identity-providers",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "idp",
    "enterprise",
    "sso",
    "integration",
  ],
  relatedTopics: ["sso-integrations", "oauth-providers", "access-control-policies"],
};

export default function IdentityProvidersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Identity Providers (IdP)</strong> are third-party services that manage user
          identities and authentication for organizations. Instead of maintaining separate
          credentials for each application, users authenticate once with their IdP and access
          multiple applications via Single Sign-On (SSO). For enterprise customers, IdP integration
          is often a mandatory requirement — it enables centralized identity management, improves
          security (centralized MFA enforcement, immediate access revocation on termination), and
          reduces IT overhead (no password resets for your application).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/identity-providers.svg"
          alt="Identity Providers"
          caption="Identity Provider Landscape — comparing enterprise, social, and government identity providers"
        />

        <p>
          For staff and principal engineers, integrating with identity providers requires deep
          understanding of SAML 2.0 (XML-based assertions, enterprise standard), OpenID Connect
          (OIDC — JSON-based, modern standard), directory sync (SCIM protocol for automated user
          provisioning), Just-In-Time (JIT) provisioning (auto-create users on first SSO login),
          group-to-role mapping (IdP groups → local roles), and deployment patterns (multi-IdP
          support, domain-based routing). The implementation must support multiple IdPs while
          maintaining security and providing seamless user experience.
        </p>
        <p>
          Major IdPs include Okta (market leader, 17,000+ customers), Azure AD (Microsoft
          ecosystem, Office 365 integration), OneLogin (SMB focused), Ping Identity (enterprise
          SSO and federation), and Auth0 (developer-focused, now part of Okta). Each IdP has
          unique capabilities — Okta excels in enterprise features, Azure AD dominates Microsoft
          shops, Auth0 leads in developer experience. Supporting multiple IdPs is critical for
          enterprise sales — customers will require their specific IdP.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          IdP integration is built on fundamental concepts that determine how identity is federated
          between systems. Understanding these concepts is essential for designing effective IdP
          integrations.
        </p>
        <p>
          <strong>Enterprise IdPs:</strong> Okta, Azure AD, OneLogin, Ping Identity serve
          enterprise customers. Support SAML + OIDC. Features: centralized user management, MFA
          enforcement, automated provisioning (SCIM), group-to-role mapping, audit logging.
          Enterprise IdPs integrate with HR systems (Workday, SAP SuccessFactors) for automated
          user lifecycle management. Pricing: per-user per-month ($2-8/user/month).
        </p>
        <p>
          <strong>Social IdPs:</strong> Google, Facebook, Apple, GitHub serve consumer applications.
          Support OIDC (some support SAML). Features: social login, simplified onboarding, reduced
          password fatigue. Social IdPs are free for basic integration, premium features available
          (Google Workspace, GitHub Enterprise). Consumer applications often support both enterprise
          and social IdPs.
        </p>
        <p>
          <strong>Protocol Support:</strong> SAML 2.0 (XML-based, enterprise standard, complex),
          OIDC (JSON-based, modern standard, simpler), WS-Federation (legacy Microsoft protocol,
          deprecated). Recommendation: support SAML + OIDC. OIDC for new integrations (simpler),
          SAML for enterprise customers (required). WS-Federation only for legacy customers.
        </p>
        <p>
          <strong>Integration Patterns:</strong> Enterprise SSO (SAML/OIDC for employee
          authentication), Directory Sync (SCIM for automated user provisioning), Just-In-Time
          Provisioning (create users on first SSO login), Group Mapping (IdP groups → local roles).
          Each pattern serves different needs — SSO for authentication, SCIM for lifecycle
          management, JIT for simplified onboarding, Group Mapping for automatic role assignment.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          IdP integration architecture separates identity management (IdP) from application access
          (SP), enabling centralized authentication with distributed application access. This
          architecture is critical for enterprise deployments where users access multiple
          applications.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/idp-integration.svg"
          alt="IdP Integration"
          caption="IdP Integration Architecture — showing protocol integration, attribute mapping, and trust configuration"
        />

        <p>
          IdP integration flow: User accesses application (SP). SP checks for existing session — if
          none, redirects to IdP (based on email domain or manual selection). User authenticates at
          IdP (if not already authenticated). IdP generates assertion/token (SAML assertion or OIDC
          ID token) containing user attributes (email, name, groups), signs with IdP private key,
          returns to SP. SP validates signature (using IdP public key), checks conditions (expiry,
          audience), extracts user attributes, creates local session, grants access.
        </p>
        <p>
          Enterprise integration architecture includes: JIT provisioning (auto-create users on
          first login), SCIM integration (automated user provisioning), group-to-role mapping (IdP
          groups → local roles), domain verification (verify company owns domain before enabling
          SSO), and multi-IdP support (different customers use different IdPs). This architecture
          enables seamless enterprise onboarding — customer configures SSO in their IdP, verifies
          domain, enables for users, all users can login via SSO immediately.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/idp-enterprise.svg"
          alt="Enterprise IdP"
          caption="Enterprise IdP Deployment — comparing on-premises, cloud, and hybrid IdP deployments"
        />

        <p>
          Performance optimization is critical — IdP authentication adds latency to login flow.
          Optimization strategies include: caching IdP metadata (certificates, endpoints),
          connection pooling (reuse IdP connections), async token validation (don't block on
          validation), and session persistence (remember user's IdP for subsequent logins).
          Organizations like Okta achieve sub-second authentication latency by optimizing these
          areas.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing IdP integrations involves trade-offs between protocol complexity, enterprise
          requirements, and implementation effort. Understanding these trade-offs is essential for
          making informed architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Okta vs Azure AD vs OneLogin</h3>
          <ul className="space-y-3">
            <li>
              <strong>Okta:</strong> Market leader (17,000+ customers), best enterprise features,
              extensive app integrations (7,000+), strong API. Limitation: premium pricing
              ($4-8/user/month).
            </li>
            <li>
              <strong>Azure AD:</strong> Microsoft ecosystem, Office 365 integration, included with
              Microsoft 365 subscriptions. Limitation: complex for non-Microsoft shops, Azure
              dependency.
            </li>
            <li>
              <strong>OneLogin:</strong> SMB focused, simpler setup, competitive pricing
              ($2-4/user/month). Limitation: fewer enterprise features, smaller ecosystem.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Cloud vs On-Premises vs Hybrid IdP</h3>
          <ul className="space-y-3">
            <li>
              <strong>Cloud IdP:</strong> Managed service (Okta, Azure AD), no infrastructure,
              always updated, scalable. Limitation: internet dependency, data residency concerns.
            </li>
            <li>
              <strong>On-Premises:</strong> Full control, data residency, no internet dependency.
              Limitation: infrastructure cost, maintenance burden, scaling challenges.
            </li>
            <li>
              <strong>Hybrid:</strong> Cloud IdP with on-premises agent (Okta AD Agent, Azure AD
              Connect). Best of both — cloud management with on-premises integration. Used by most
              enterprises.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SAML vs OIDC for IdP Integration</h3>
          <ul className="space-y-3">
            <li>
              <strong>SAML:</strong> Enterprise standard, widely deployed, supports complex
              attribute mapping. Limitation: high complexity (XML parsing), larger payloads, older
              technology.
            </li>
            <li>
              <strong>OIDC:</strong> Modern standard, JSON-based (JWT), simpler implementation,
              preferred for new integrations. Limitation: less mature than SAML, some legacy IdPs
              don't support.
            </li>
            <li>
              <strong>Recommendation:</strong> Support both. OIDC for new integrations (simpler),
              SAML for enterprise customers (required). Many IdPs support both.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing IdP integration requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Validate all IdP signatures and tokens — never accept unsigned assertions/tokens.
          Implement proper certificate rotation — support multiple certificates during overlap
          period, monitor expiry, alert before expiry. Use secure assertion consumer endpoints —
          HTTPS only, validate audience condition. Implement replay attack prevention — track used
          assertion IDs, implement time windows. Enforce HTTPS for all IdP endpoints — no HTTP
          allowed.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Provide clear IdP login options — "Login with Company SSO" button, domain-based routing.
          Handle IdP discovery based on email domain — user enters email, route to correct IdP.
          Show clear error messages for IdP failures — "IdP returned error" vs "configuration
          error". Provide fallback authentication options — password login for non-SSO users,
          emergency access. Support remember me functionality — persistent sessions for trusted
          devices.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise Support</h3>
        <p>
          Support multiple IdPs per tenant — different customers use different IdPs. Implement JIT
          provisioning — auto-create users on first SSO login. Support SCIM for user provisioning —
          automated create/update/delete. Provide group/role mapping — IdP groups → local roles.
          Support custom IdP attributes — customer-specific attribute mapping.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring &amp; Alerting</h3>
        <p>
          Track IdP success/failure rates — baseline normal, alert on anomalies. Monitor token
          validation errors — signature failures, expiry errors. Alert on unusual IdP patterns —
          many failures from same IP, unusual login times. Track JIT provisioning events — user
          creation rate, attribute mapping. Monitor certificate expiry — alert 30 days before
          expiry.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing IdP integration to ensure secure, usable,
          and maintainable integrations.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No signature validation:</strong> Accepting unsigned assertions/tokens,
            security vulnerability. <strong>Fix:</strong> Always validate IdP signatures and
            tokens. Reject unsigned assertions.
          </li>
          <li>
            <strong>Certificate mismanagement:</strong> Expired certificates cause outages, no
            rotation process. <strong>Fix:</strong> Implement certificate rotation, support
            multiple certificates during overlap, monitor expiry, alert 30 days before.
          </li>
          <li>
            <strong>No replay prevention:</strong> Same assertion can be reused, replay attacks.{" "}
            <strong>Fix:</strong> Track used assertion IDs (store in cache with TTL), implement
            time windows (reject assertions older than 5 minutes).
          </li>
          <li>
            <strong>Poor error handling:</strong> Users stuck on IdP failures, no support path.{" "}
            <strong>Fix:</strong> Clear error messages (IdP error vs config error), fallback to
            password (if enabled), support contact, log failures for debugging.
          </li>
          <li>
            <strong>No JIT provisioning:</strong> Manual user creation required, slow onboarding.{" "}
            <strong>Fix:</strong> Auto-create users on first SSO login, map IdP attributes to local
            fields, assign roles based on groups.
          </li>
          <li>
            <strong>Hardcoded IdP config:</strong> Can't support multiple customers, one config for
            all. <strong>Fix:</strong> Configuration per tenant/domain, store IdP config in
            database, support dynamic IdP discovery.
          </li>
          <li>
            <strong>No group mapping:</strong> Manual role assignment for each user, administrative
            burden. <strong>Fix:</strong> Map IdP groups to local roles automatically, support
            multiple group-to-role mappings, handle group changes on each login.
          </li>
          <li>
            <strong>Ignoring clock skew:</strong> Valid assertions rejected due to time
            differences. <strong>Fix:</strong> Allow clock skew tolerance (±5 minutes), sync
            servers with NTP.
          </li>
          <li>
            <strong>No logout handling:</strong> Users remain logged in at IdP after local logout,
            security risk. <strong>Fix:</strong> Implement Single Logout (SLO) or clear local
            logout, document behavior for customers.
          </li>
          <li>
            <strong>Poor domain verification:</strong> Anyone can claim domain, account takeover.{" "}
            <strong>Fix:</strong> DNS verification (add TXT record), email verification (send to
            admin@domain), verify company owns domain before enabling SSO.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          IdP integration is critical for enterprise deployments. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Slack)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require SSO with their IdP. Multiple IdPs
          (Okta, Azure AD, OneLogin). JIT provisioning for user onboarding. Group-to-role mapping
          for automatic role assignment (admin, owner, member).
        </p>
        <p>
          <strong>Solution:</strong> Support SAML + OIDC. Domain-based IdP routing. JIT
          provisioning with attribute mapping. Group-to-role mapping (IdP groups → Slack roles).
          SCIM for automated provisioning. Multi-IdP support per workspace.
        </p>
        <p>
          <strong>Result:</strong> Enterprise onboarding in hours (not days). Automated user
          provisioning. Role assignment automated. Passed SOC 2 audit.
        </p>
        <p>
          <strong>Security:</strong> Signature validation, certificate rotation, replay prevention,
          JIT audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare EHR (Cerner)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires centralized access control.
          Healthcare providers access EHR from hospital IdP. Immediate access revocation on
          termination. Audit all access.
        </p>
        <p>
          <strong>Solution:</strong> SAML SSO with hospital IdPs. JIT provisioning for new
          providers. SCIM for automated deprovisioning (HR termination → access revoked). All
          access logged for HIPAA compliance. Break-glass for emergencies.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Immediate access revocation on
          termination. Zero unauthorized access detected. Emergency access available with audit.
        </p>
        <p>
          <strong>Security:</strong> SAML validation, SCIM deprovisioning, HIPAA audit trails,
          break-glass procedure.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Financial Services (Bloomberg Terminal)</h3>
        <p>
          <strong>Challenge:</strong> Financial regulations require strong authentication. Multiple
          trading applications. Centralized MFA enforcement. Immediate access revocation for
          compliance.
        </p>
        <p>
          <strong>Solution:</strong> OIDC SSO with MFA enforcement at IdP. Centralized access
          control. Automated deprovisioning via SCIM. All access logged for regulatory reporting.
          Multi-app SSO (login once, access all trading apps).
        </p>
        <p>
          <strong>Result:</strong> Passed regulatory audits (SEC, FINRA). Centralized MFA
          enforcement. Immediate access revocation. Reduced password fatigue (SSO across apps).
        </p>
        <p>
          <strong>Security:</strong> OIDC validation, MFA enforcement, SCIM deprovisioning,
          regulatory audit trails.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Education Platform (Blackboard)</h3>
        <p>
          <strong>Challenge:</strong> Universities have existing IdPs. Students/faculty need SSO
          access. Different IdPs per university. JIT provisioning for new students each semester.
        </p>
        <p>
          <strong>Solution:</strong> SAML SSO with university IdPs. Domain-based routing (student
          enters university email → route to correct IdP). JIT provisioning for new students.
          Group mapping (faculty vs student roles). Multi-IdP support.
        </p>
        <p>
          <strong>Result:</strong> University onboarding simplified. Students access via existing
          credentials. Automated role assignment (faculty vs student). Reduced support tickets.
        </p>
        <p>
          <strong>Security:</strong> SAML validation, domain verification, JIT provisioning, role
          mapping.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cloud Platform (Atlassian Cloud)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers manage Atlassian access via their IdP.
          Need to federate IdP identities to Atlassian cloud. Role-based access to Jira, Confluence.
          Centralized access control.
        </p>
        <p>
          <strong>Solution:</strong> SAML federation with customer IdPs. IdP sends SAML assertion
          with user attributes. Atlassian validates assertion, creates/grants access. Group-based
          access to products. Centralized access control via IdP.
        </p>
        <p>
          <strong>Result:</strong> Enterprise customers manage Atlassian access via existing IdP.
          No separate Atlassian credentials. Centralized access control. Immediate access revocation
          on termination.
        </p>
        <p>
          <strong>Security:</strong> SAML validation, group-based access, centralized control,
          immediate revocation.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of IdP integration design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you support multiple IdPs?</p>
            <p className="mt-2 text-sm">
              A: Configuration per tenant/domain — store IdP config (metadata URL, entity ID,
              certificates) in database. Route to correct IdP based on email domain — user enters
              email, lookup domain config, redirect to correct IdP. Support SAML + OIDC
              simultaneously — protocol detection based on config. Abstract IdP differences behind
              common interface — internal user object, protocol-specific adapters.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle IdP outages?</p>
            <p className="mt-2 text-sm">
              A: Graceful degradation — hide IdP button if down (health check), fallback to
              password login (if enabled), circuit breaker pattern. Never block all auth due to one
              IdP outage. Monitor IdP health continuously — alert on failures. Customer
              communication — notify of IdP issues, provide workaround.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is SCIM?</p>
            <p className="mt-2 text-sm">
              A: System for Cross-domain Identity Management (RFC 7643). Automates user
              provisioning/deprovisioning from IdP to applications. IdP pushes user create/update/delete
              events via SCIM API. Application creates/updates/deletes users automatically. Reduces
              manual IT overhead. Support SCIM 2.0 for modern IdPs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle group mapping?</p>
            <p className="mt-2 text-sm">
              A: Map IdP groups to local roles — "Admins" group → admin role, "Users" group → user
              role. Support multiple group-to-role mappings — user can have multiple roles. Handle
              group changes on each login — sync groups on every SSO login. Audit role changes —
              log group-to-role mapping changes. Support nested groups — resolve group hierarchy.
              Handle missing group mappings — default role for unmapped groups.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is JIT provisioning?</p>
            <p className="mt-2 text-sm">
              A: Just-In-Time user creation on first SSO login. No pre-provisioning needed. IdP
              sends user attributes (email, name, groups) in assertion/token. Application creates
              user account if doesn't exist, maps attributes to local fields, assigns roles based
              on groups. Audit JIT events — log user creation. Handle provisioning failures
              gracefully — clear error messages, support contact.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle certificate rotation?</p>
            <p className="mt-2 text-sm">
              A: Support multiple certificates — old + new during overlap period. Overlap period:
              7-30 days (both certificates valid). Monitor certificate expiry — alert 30 days
              before. Auto-fetch IdP signing keys (JWKS endpoint for OIDC). Test rotation
              procedures — simulate rotation in sandbox. Customer communication — notify before
              rotation, provide rollback procedure.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for IdP?</p>
            <p className="mt-2 text-sm">
              A: IdP success/failure rate — baseline normal, alert on anomalies. JIT provisioning
              rate — user creation rate. SLO success rate — if implemented. Token validation errors
              — signature failures, expiry errors. Certificate expiry — days until expiry. IdP
              latency — time to authenticate. Set up alerts for anomalies — spike in failures (IdP
              outage), high latency (performance issues).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle IdP for contractors/external users?</p>
            <p className="mt-2 text-sm">
              A: Support guest users in IdP — many IdPs support B2B scenarios (Azure AD B2B, Okta
              Universal Directory). Alternative: password login for external users (non-SSO). Some
              IdPs support external IdP federation (contractor's IdP → customer IdP → your app).
              Consider OIDC social login as fallback (Google, Microsoft accounts). Document options
              for customers — provide guidance on best approach for their use case.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you test IdP integrations?</p>
            <p className="mt-2 text-sm">
              A: Test with each major IdP (Okta, Azure AD, OneLogin, Ping). Use test IdP instances
              — sandbox environments. Test SSO flow, JIT provisioning, group mapping, SLO,
              certificate rotation. Automate IdP compatibility tests — run on every deployment. Test
              failure scenarios — IdP outage, invalid assertions, expired certificates. Load test —
              simulate high-volume SSO logins.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://pages.nist.gov/800-63-3/sp800-63b.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIST SP 800-63B - Digital Identity Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://www.oasis-open.org/committees/security/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OASIS SAML Specifications
            </a>
          </li>
          <li>
            <a
              href="https://openid.net/connect/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenID Connect
            </a>
          </li>
          <li>
            <a
              href="https://tools.ietf.org/html/rfc7643"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SCIM 2.0 Specification (RFC 7643)
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
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Authentication Security
            </a>
          </li>
          <li>
            <a
              href="https://docs.okta.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Okta Documentation
            </a>
          </li>
          <li>
            <a
              href="https://learn.microsoft.com/en-us/azure/active-directory/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Azure AD Documentation
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
