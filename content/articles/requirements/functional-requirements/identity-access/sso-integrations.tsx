"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-other-sso-integrations",
  title: "SSO Integrations",
  description:
    "Comprehensive guide to implementing Single Sign-On covering SAML, OIDC, enterprise integration, identity providers, JIT provisioning, and deployment patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "sso-integrations",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "sso",
    "saml",
    "oidc",
    "enterprise",
    "integration",
  ],
  relatedTopics: ["oauth-providers", "identity-providers", "authentication-service"],
};

export default function SSOIntegrationsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Single Sign-On (SSO) Integrations</strong> enable users to authenticate once with
          an Identity Provider (IdP) and access multiple applications without re-authenticating. For
          enterprise customers, SSO is often a mandatory requirement — it enables centralized
          identity management, improves security (centralized MFA enforcement), and reduces IT
          overhead (no password resets for your application).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/sso-flow.svg"
          alt="SSO Flow"
          caption="SSO Flow — showing SAML and OIDC flows with IdP integration"
        />

        <p>
          For staff and principal engineers, implementing SSO requires deep understanding of SAML
          2.0 (XML-based assertions, enterprise standard), OpenID Connect (OIDC — JSON-based,
          modern standard), identity provider integration (Okta, Azure AD, OneLogin, Ping
          Identity), Just-In-Time (JIT) provisioning (auto-create users on first SSO login),
          directory synchronization (SCIM protocol for automated user provisioning), and deployment
          patterns (multi-IdP support, domain-based routing). The implementation must support
          multiple IdPs while maintaining security and providing seamless user experience.
        </p>
        <p>
          Modern SSO has evolved from simple SAML integrations to sophisticated multi-protocol
          systems supporting SAML, OIDC, and social login simultaneously. Organizations like Okta,
          Auth0, and Microsoft operate SSO infrastructure at massive scale, handling billions of
          authentications daily while maintaining sub-second latency and 99.99% availability.
          Enterprise SSO is critical for compliance (SOC 2, HIPAA require centralized access
          control) and security (centralized MFA, immediate access revocation on termination).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          SSO is built on fundamental concepts that determine how authentication flows work and how
          identity is federated between systems. Understanding these concepts is essential for
          designing effective SSO integrations.
        </p>
        <p>
          <strong>SAML 2.0:</strong> Security Assertion Markup Language is an XML-based standard
          for exchanging authentication and authorization data between IdP and Service Provider
          (SP). SAML uses XML assertions containing user attributes (email, name, groups). Flow:
          user accesses SP, SP redirects to IdP, user authenticates at IdP, IdP returns signed SAML
          assertion, SP validates signature and creates session. SAML is enterprise standard,
          supported by all major IdPs (Okta, Azure AD, OneLogin). Complexity: high (XML parsing,
          complex configuration).
        </p>
        <p>
          <strong>OpenID Connect (OIDC):</strong> Modern identity layer on top of OAuth 2.0. Uses
          JSON Web Tokens (JWT) instead of XML. Simpler than SAML, preferred for new
          integrations. Flow: user accesses SP, SP redirects to IdP, user authenticates, IdP
          returns ID token (JWT) + access token, SP validates token and creates session. OIDC is
          supported by all modern IdPs and is simpler to implement than SAML.
        </p>
        <p>
          <strong>Just-In-Time (JIT) Provisioning:</strong> Auto-create user accounts on first SSO
          login. IdP sends user attributes (email, name, groups) in assertion/token. SP creates
          user account if doesn't exist, maps attributes to local fields, assigns roles based on
          groups. Eliminates manual user creation — users can self-serve via SSO. Audit JIT
          provisioning events for compliance.
        </p>
        <p>
          <strong>SCIM (System for Cross-domain Identity Management):</strong> Protocol for
          automated user provisioning. IdP pushes user create/update/delete events to SP via SCIM
          API. SP creates/updates/deletes users automatically. Supports group membership sync.
          Eliminates manual user management — HR terminates employee in IdP, access revoked
          automatically in all connected apps. SCIM 2.0 is current standard.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          SSO architecture separates identity management (IdP) from application access (SP),
          enabling centralized authentication with distributed application access. This architecture
          is critical for enterprise deployments where users access multiple applications.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/saml-flow.svg"
          alt="SAML Flow"
          caption="SAML 2.0 Flow — showing SP-initiated SSO with SAML assertion exchange between IdP and SP"
        />

        <p>
          SAML flow (SP-initiated): User navigates to application (SP). SP checks for existing
          session — if none, generates SAML AuthnRequest, redirects user to IdP SSO URL. User
          authenticates at IdP (if not already authenticated). IdP generates SAML assertion
          (XML document containing user attributes, signed with IdP private key), posts assertion
          to SP Assertion Consumer Service (ACS) URL. SP validates assertion signature (using IdP
          public key), checks assertion conditions (expiry, audience), extracts user attributes,
          creates local session, redirects user to original destination.
        </p>
        <p>
          OIDC flow: Similar to SAML but uses JSON instead of XML. SP redirects to IdP
          authorization endpoint. User authenticates at IdP. IdP returns authorization code. SP
          exchanges code for ID token (JWT containing user claims) and access token. SP validates
          ID token signature (using IdP JWKS), extracts claims, creates session. OIDC is simpler
          than SAML — JWT validation is straightforward, no XML parsing.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/sso-enterprise.svg"
          alt="SSO Enterprise"
          caption="Enterprise SSO — showing SCIM provisioning, JIT provisioning, and group-to-role mapping"
        />

        <p>
          Enterprise integration architecture includes: JIT provisioning (auto-create users on
          first login), SCIM integration (automated user provisioning), group-to-role mapping (IdP
          groups → local roles), domain verification (verify company owns domain before enabling
          SSO), and multi-IdP support (different customers use different IdPs). This architecture
          enables seamless enterprise onboarding — customer configures SSO in their IdP, verifies
          domain, enables for users, all users can login via SSO immediately.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing SSO integrations involves trade-offs between protocol complexity, enterprise
          requirements, and implementation effort. Understanding these trade-offs is essential for
          making informed architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SAML vs OIDC</h3>
          <ul className="space-y-3">
            <li>
              <strong>SAML:</strong> Enterprise standard, widely deployed, XML-based assertions,
              supports complex attribute mapping. Limitation: high complexity (XML parsing, complex
              configuration), larger payloads, older technology.
            </li>
            <li>
              <strong>OIDC:</strong> Modern standard, JSON-based (JWT), simpler implementation,
              preferred for new integrations. Limitation: less mature than SAML, some legacy IdPs
              don't support.
            </li>
            <li>
              <strong>Recommendation:</strong> Support both. OIDC for new integrations (simpler),
              SAML for enterprise customers (required). Many IdPs support both. Start with OIDC,
              add SAML for enterprise requirements.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SP-Initiated vs IdP-Initiated SSO</h3>
          <ul className="space-y-3">
            <li>
              <strong>SP-Initiated:</strong> User starts at application, redirects to IdP. Better
              UX (user knows where they're going), easier to implement. Limitation: requires SP to
              know IdP URL.
            </li>
            <li>
              <strong>IdP-Initiated:</strong> User starts at IdP portal, clicks app icon, posts
              assertion to SP. Good for IdP portal deployments. Limitation: harder to implement
              securely (no request to match against), less common.
            </li>
            <li>
              <strong>Recommendation:</strong> SP-initiated for most cases. IdP-initiated only if
              customer requires (legacy deployments).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">JIT vs SCIM Provisioning</h3>
          <ul className="space-y-3">
            <li>
              <strong>JIT:</strong> Create user on first SSO login. Simple, no additional
              integration. Limitation: user must login first to be created, no automated
              deprovisioning.
            </li>
            <li>
              <strong>SCIM:</strong> Automated provisioning from IdP. User created before first
              login, automated deprovisioning on termination. Limitation: requires SCIM endpoint
              implementation, more complex.
            </li>
            <li>
              <strong>Recommendation:</strong> JIT for small/medium customers. SCIM for enterprise
              customers (automated deprovisioning critical for security). Support both.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing SSO requires following established best practices to ensure security,
          usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Validate all SAML signatures and OIDC tokens — never accept unsigned assertions/tokens.
          Implement proper certificate rotation — support multiple certificates during overlap
          period, monitor expiry, alert before expiry. Use secure assertion consumer endpoints —
          HTTPS only, validate audience condition. Implement replay attack prevention — track used
          assertion IDs, implement time windows. Enforce HTTPS for all SSO endpoints — no HTTP
          allowed.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Provide clear SSO login options — "Login with Company SSO" button, domain-based routing.
          Handle IdP discovery based on email domain — user enters email, route to correct IdP.
          Show clear error messages for SSO failures — "IdP returned error" vs "configuration
          error". Provide fallback authentication options — password login for non-SSO users,
          emergency access. Support remember me functionality — persistent sessions for trusted
          devices.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise Support</h3>
        <p>
          Support multiple IdPs per tenant — different customers use different IdPs. Implement JIT
          provisioning — auto-create users on first SSO login. Support SCIM for user provisioning —
          automated create/update/delete. Provide group/role mapping — IdP groups → local roles.
          Support custom SAML attributes — customer-specific attribute mapping.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring &amp; Alerting</h3>
        <p>
          Track SSO success/failure rates by IdP — baseline normal, alert on anomalies. Monitor
          token validation errors — signature failures, expiry errors. Alert on unusual SSO
          patterns — many failures from same IP, unusual login times. Track JIT provisioning events
          — user creation rate, attribute mapping. Monitor certificate expiry — alert 30 days
          before expiry.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing SSO to ensure secure, usable, and
          maintainable integrations.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No signature validation:</strong> Accepting unsigned assertions/tokens,
            security vulnerability. <strong>Fix:</strong> Always validate SAML signatures and OIDC
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
            <strong>Poor error handling:</strong> Users stuck on SSO failures, no support path.{" "}
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
          SSO is critical for enterprise deployments. Here are real-world implementations from
          production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require SSO for compliance. Multiple IdPs
          (Okta, Azure AD, OneLogin). JIT provisioning for user onboarding. Group-to-role mapping
          for automatic role assignment.
        </p>
        <p>
          <strong>Solution:</strong> Support SAML + OIDC. Domain-based IdP routing. JIT
          provisioning with attribute mapping. Group-to-role mapping (IdP groups → Salesforce
          roles). SCIM for automated provisioning. Multi-IdP support per org.
        </p>
        <p>
          <strong>Result:</strong> Enterprise onboarding in hours (not days). Automated user
          provisioning. Role assignment automated. Passed SOC 2 audit.
        </p>
        <p>
          <strong>Security:</strong> Signature validation, certificate rotation, replay prevention,
          JIT audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare EHR (Epic)</h3>
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

        <h3 className="mt-8 mb-4 text-xl font-semibold">Financial Services (Bloomberg)</h3>
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

        <h3 className="mt-8 mb-4 text-xl font-semibold">Education Platform (Canvas LMS)</h3>
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

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cloud Platform (AWS SSO)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers manage AWS access via their IdP. Need to
          federate IdP identities to AWS accounts. Role-based access to AWS resources. Centralized
          access control.
        </p>
        <p>
          <strong>Solution:</strong> SAML federation with customer IdPs. IdP sends SAML assertion
          with AWS role. AWS validates assertion, grants temporary credentials (STS). Role-based
          access to AWS resources. Centralized access control via IdP.
        </p>
        <p>
          <strong>Result:</strong> Enterprise customers manage AWS access via existing IdP. No
          separate AWS credentials. Centralized access control. Immediate access revocation on
          termination.
        </p>
        <p>
          <strong>Security:</strong> SAML validation, temporary credentials, role-based access,
          centralized control.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of SSO design, implementation, and operational
          concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: SAML vs OIDC — which to support?</p>
            <p className="mt-2 text-sm">
              A: Support both. SAML for legacy enterprise customers (still widely deployed,
              required by many enterprises), OIDC for modern deployments (simpler, preferred for
              new integrations). OIDC is JSON-based (JWT), simpler to implement than SAML (XML).
              Many IdPs support both. Start with OIDC for new integrations, add SAML for enterprise
              requirements. Implementation: OIDC first (1-2 weeks), SAML second (2-4 weeks due to
              XML complexity).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSO onboarding?</p>
            <p className="mt-2 text-sm">
              A: Domain verification (DNS TXT record or email to admin@domain), metadata exchange
              (XML for SAML, configuration for OIDC), test connection in sandbox environment,
              enable for domain, provide documentation, support during rollout. Offer self-service
              setup for smaller customers (wizard-based configuration). Enterprise customers:
              dedicated support, custom configuration, testing assistance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle users with both SSO and password login?</p>
            <p className="mt-2 text-sm">
              A: Enforce SSO for verified domains — user enters email, if domain verified, redirect
              to IdP. Allow password login for non-SSO users (non-verified domains). Migration
              period: allow both, then enforce SSO after rollout complete. Provide admin controls
              for enforcement policy (enforce SSO, allow both, password only).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSO logout?</p>
            <p className="mt-2 text-sm">
              A: Single Logout (SLO): notify IdP of logout, IdP broadcasts logout to all SPs
              (SAML SLO). Complex, not always supported by IdPs. Alternative: local logout only —
              user logged out of your app, but not IdP (user must logout separately from IdP).
              Document behavior clearly for customers. Recommendation: local logout for simplicity,
              SLO only if customer requires.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSO failures?</p>
            <p className="mt-2 text-sm">
              A: Clear error messages — distinguish IdP error (user authentication failed) vs
              config error (invalid assertion). Fallback to password (if enabled for domain).
              Support contact for assistance. Log failures for debugging (assertion XML, error
              message). IdP health monitoring — alert on high failure rates. Dashboard for SSO
              metrics (success rate by IdP).
            </p>
          </div>

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
            <p className="font-semibold">Q: What metrics do you track for SSO?</p>
            <p className="mt-2 text-sm">
              A: SSO success/failure rate by IdP — baseline normal, alert on anomalies. JIT
              provisioning rate — user creation rate. SLO success rate — if implemented. Token
              validation errors — signature failures, expiry errors. Certificate expiry — days
              until expiry. IdP latency — time to authenticate. Set up alerts for anomalies —
              spike in failures (IdP outage), high latency (performance issues).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSO for contractors/external users?</p>
            <p className="mt-2 text-sm">
              A: Support guest users in IdP — many IdPs support B2B scenarios (Azure AD B2B, Okta
              Universal Directory). Alternative: password login for external users (non-SSO). Some
              IdPs support external IdP federation (contractor's IdP → customer IdP → your app).
              Consider OIDC social login as fallback (Google, Microsoft accounts). Document options
              for customers — provide guidance on best approach for their use case.
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
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
        </ul>
      </section>
    </ArticleLayout>
  );
}
