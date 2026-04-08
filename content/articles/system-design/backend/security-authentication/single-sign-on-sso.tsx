"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sso-extensive",
  title: "Single Sign-On (SSO)",
  description:
    "Staff-level deep dive into SSO architectures with SAML and OpenID Connect, trust relationships, identity federation, and the operational practice of managing centralized authentication at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "single-sign-on-sso",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "sso", "saml", "oidc", "identity"],
  relatedTopics: ["oauth-2-0", "jwt-json-web-tokens", "multi-factor-authentication", "authentication-vs-authorization"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition and Context
          ============================================================ */}
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Single Sign-On (SSO)</strong> is an authentication scheme that allows a user to authenticate once
          and access multiple applications without re-authenticating. Instead of maintaining separate credentials for
          each application, the user authenticates to a centralized identity provider (IdP), which issues a token or
          assertion that the applications trust. SSO is the foundation of modern enterprise identity management — it
          powers corporate access to SaaS applications (Salesforce, Slack, GitHub), cloud platforms (AWS, GCP, Azure),
          and internal systems.
        </p>
        <p>
          SSO is implemented using two primary protocols: SAML 2.0 (Security Assertion Markup Language) and OpenID
          Connect (OIDC). SAML is an XML-based protocol designed for enterprise SSO — it is older, well-established,
          and widely supported by enterprise applications. OIDC is a JSON/REST-based protocol built on top of OAuth
          2.0 — it is modern, developer-friendly, and preferred for web and mobile applications. Both protocols
          enable the same outcome (authenticate once, access multiple applications), but they differ in implementation
          complexity, token format, and ecosystem support.
        </p>
        <p>
          The evolution of SSO has been driven by the proliferation of SaaS applications — as organizations adopt
          dozens or hundreds of SaaS tools, managing separate credentials for each becomes operationally
          unsustainable. SSO centralizes authentication, reducing the burden on users (one password instead of
          dozens), improving security (MFA enforced at the IdP level, reducing password reuse), and simplifying
          identity lifecycle management (provisioning and deprovisioning through the IdP). However, SSO also
          introduces a single point of failure — if the IdP is compromised or unavailable, all connected
          applications are affected.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">SAML vs OpenID Connect: When to Use Each</h3>
          <p className="text-muted mb-3">
            <strong>SAML 2.0:</strong> XML-based, designed for enterprise SSO. Uses SAML Assertions (signed XML documents) to carry user identity and attributes. Widely supported by enterprise applications (Salesforce, Workday, ServiceNow). Best for enterprise SSO, legacy systems, and government applications.
          </p>
          <p className="mb-3">
            <strong>OpenID Connect (OIDC):</strong> JSON/REST-based, built on OAuth 2.0. Uses ID Tokens (JWTs) to carry user claims. Developer-friendly, supports modern web and mobile applications. Preferred for new applications, APIs, and mobile apps.
          </p>
          <p>
            <strong>Rule of thumb:</strong> Use OIDC for new applications, web/mobile apps, and APIs. Use SAML for legacy enterprise applications that only support SAML. Most modern IdPs (Okta, Azure AD, Google) support both protocols.
          </p>
        </div>
        <p>
          SSO architectures consist of three components: the identity provider (IdP, which authenticates users and
          issues tokens/assertions), the service provider (SP, which relies on the IdP to authenticate users and
          grants access based on the token/assertion), and the user (who authenticates to the IdP and accesses
          applications through SSO). The trust relationship between the IdP and SP is established through metadata
          exchange — the SP trusts the IdP&apos;s signature, and the IdP is configured with the SP&apos;s endpoint URLs.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          The SAML authentication flow begins with the user attempting to access an application (the SP). The SP
          redirects the user to the IdP with a SAML Authentication Request. The IdP authenticates the user (password,
          MFA), generates a SAML Assertion (signed XML containing the user&apos;s identity and attributes), and redirects
          the user back to the SP with the assertion. The SP validates the assertion&apos;s signature, extracts the user&apos;s
          identity, creates a session, and grants access. The flow is initiated by either the SP (SP-initiated SSO,
          where the user accesses the application first) or the IdP (IdP-initiated SSO, where the user starts from
          the IdP&apos;s dashboard).
        </p>
        <p>
          The OIDC authentication flow is similar but uses OAuth 2.0 mechanisms. The client redirects the user to
          the IdP with an authentication request (including scopes like &quot;openid&quot; and &quot;profile&quot;). The IdP authenticates
          the user and redirects back with an authorization code. The client exchanges the code for tokens (ID token,
          access token, refresh token). The ID token is a JWT containing the user&apos;s claims (sub, name, email). The
          client validates the ID token&apos;s signature and extracts the user&apos;s identity. The flow uses PKCE (Proof Key
          for Code Exchange) to prevent authorization code interception attacks.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/single-sign-on-sso-diagram-1.svg"
          alt="SSO architecture showing user authentication through identity provider to access multiple applications"
          caption="SSO architecture: user authenticates once to the identity provider (Okta, Azure AD, Google), which issues tokens/assertions trusted by multiple applications (CRM, email, HR systems)."
        />
        <p>
          Trust relationships are the foundation of SSO — the SP must trust the IdP&apos;s signature, and the IdP must
          be configured with the SP&apos;s endpoint URLs and certificate. Trust is established through metadata exchange —
          the IdP publishes its metadata (signing certificate, endpoints, supported protocols) in an XML document, and
          the SP configures this metadata. The SP also publishes its metadata, which the IdP uses to configure the
          redirect URLs and ACS (Assertion Consumer Service) endpoints. Trust must be verified — the SP must validate
          the IdP&apos;s signature on every assertion, and the IdP must validate the SP&apos;s redirect URL to prevent open
          redirect vulnerabilities.
        </p>
        <p>
          Attribute mapping is the process by which the IdP maps user attributes to the claims/assertion that the SP
          expects. For example, the IdP may store the user&apos;s email as &quot;mail&quot;, but the SP expects it as &quot;email&quot;. The
          IdP maps attributes during assertion/token generation, ensuring the SP receives the expected claims.
          Attribute mapping is configured per application — each SP may expect different claims, and the IdP must be
          configured to provide them.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/single-sign-on-sso-diagram-2.svg"
          alt="SAML authentication flow showing SP-initiated flow with SAML AuthnRequest, user authentication, SAML Assertion generation, and assertion validation"
          caption="SAML SP-initiated flow: user accesses app, SP redirects to IdP with AuthnRequest, user authenticates, IdP generates SAML Assertion, redirects back to SP with assertion, SP validates and creates session."
        />
        <p>
          Just-in-Time (JIT) provisioning is the process of creating user accounts in the SP automatically when the
          user first accesses the application through SSO. The IdP includes user attributes (email, name, roles) in
          the assertion/token, and the SP creates the user account based on these attributes. JIT provisioning
          eliminates the need for manual account creation — users are provisioned automatically on first access.
          However, JIT provisioning must be configured carefully — the SP must map IdP attributes to local user
          fields correctly, and role assignments must be controlled to prevent privilege escalation.
        </p>
        <p>
          SSO federation is the practice of connecting multiple organizations&apos; IdPs to enable cross-organizational
          SSO. For example, a university may federate with a research platform&apos;s IdP, allowing students to access
          the platform using their university credentials. Federation uses standard protocols (SAML, OIDC) and trust
          relationships between IdPs. Federation is common in education (InCommon), government (eGov), and
          healthcare (eHealth) ecosystems.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The SSO architecture consists of the identity provider (IdP), the service providers (SPs, the applications
          the user accesses), and the user. The IdP manages user identities, authenticates users, issues tokens or
          assertions, and handles lifecycle events (password resets, MFA enrollment, account deactivation). The SPs
          trust the IdP&apos;s tokens/assertions and grant access based on the claims contained within them. The user
          authenticates to the IdP once and accesses all connected applications without re-authentication.
        </p>
        <p>
          The authentication flow begins with the user attempting to access an application. If the user is not
          authenticated, the SP redirects the user to the IdP (SP-initiated SSO) or the user starts from the IdP&apos;s
          dashboard (IdP-initiated SSO). The IdP authenticates the user (password, MFA, or existing SSO session),
          generates a token or assertion containing the user&apos;s identity and attributes, and redirects the user back
          to the SP. The SP validates the token/assertion, extracts the user&apos;s identity, creates a session, and
          grants access.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/single-sign-on-sso-diagram-3.svg"
          alt="OIDC authorization code flow and SSO security risks and best practices"
          caption="OIDC flow uses PKCE for security. SSO security risks include IdP compromise, misconfigured trust, and token interception. Best practices include PKCE, signature validation, MFA enforcement, and short-lived tokens."
        />
        <p>
          Token validation is critical for security. For SAML, the SP validates the assertion&apos;s signature (using the
          IdP&apos;s public key), checks the assertion&apos;s expiration, validates the audience (ensuring the assertion was
          intended for this SP), and validates the recipient (ensuring the assertion was sent to the correct ACS
          endpoint). For OIDC, the client validates the ID token&apos;s signature (using the IdP&apos;s public key), checks
          the expiration, validates the issuer, validates the audience (client ID), and validates the nonce (to
          prevent replay attacks).
        </p>
        <p>
          Session management in SSO is centralized — the IdP maintains the user&apos;s SSO session, and the SPs maintain
          local sessions based on the SSO session. When the user&apos;s SSO session expires, the SPs redirect the user
          back to the IdP for re-authentication. When the user logs out, the IdP terminates the SSO session and may
          send logout notifications to the SPs (Single Logout, SLO) to terminate their local sessions. However, SLO
          is not always reliable — some SPs do not support it, and the user may remain logged in to some SPs after
          logging out from the IdP.
        </p>
        <p>
          IdP high availability is essential — if the IdP is unavailable, users cannot authenticate to any connected
          application. The IdP should be deployed in a highly available configuration (active-active or active-passive
          with automatic failover), and the SPs should handle IdP unavailability gracefully (redirecting to a
          fallback authentication method or displaying an error message). For critical applications, a fallback
          authentication method (local credentials, emergency access codes) should be available in case the IdP is
          unavailable.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          SAML versus OIDC is the primary trade-off in SSO protocol selection. SAML is older, well-established, and
          widely supported by enterprise applications. It uses XML-based assertions, which are verbose but carry
          rich attribute data. OIDC is modern, built on OAuth 2.0, and uses JWT-based ID tokens, which are compact
          and developer-friendly. SAML is preferred for enterprise SSO (legacy applications, government systems),
          while OIDC is preferred for new applications, web/mobile apps, and APIs.
        </p>
        <p>
          Centralized versus decentralized identity is a trade-off between control and convenience. Centralized
          identity (all users managed in a single IdP) provides centralized control — provisioning, deprovisioning,
          MFA enforcement, and audit logging are all managed through the IdP. However, it introduces a single point
          of failure — if the IdP is unavailable, all connected applications are affected. Decentralized identity
          (each application manages its own users) eliminates the single point of failure but requires managing
          credentials for each application separately, which is operationally unsustainable for large organizations.
        </p>
        <p>
          SP-initiated versus IdP-initiated SSO is a trade-off between user experience and control. SP-initiated
          SSO (user accesses the application first, then redirected to the IdP) is the most common flow — it is
          natural for users who bookmark applications and access them directly. IdP-initiated SSO (user starts from
          the IdP&apos;s dashboard and clicks on the application) provides a centralized access point — users can see all
          their applications in one place and access them without navigating to each application&apos;s URL. However,
          IdP-initiated SSO requires users to remember the IdP&apos;s dashboard URL, which may be less intuitive than
          bookmarking individual applications.
        </p>
        <p>
          JIT provisioning versus pre-provisioning is a trade-off between convenience and control. JIT provisioning
          creates user accounts automatically on first SSO access — convenient for users, but the SP has less control
          over account creation (roles, permissions, groups must be mapped from IdP attributes). Pre-provisioning
          creates user accounts in advance — the organization has full control over account creation, roles, and
          permissions, but requires manual or automated provisioning (SCIM, API integration) before users can access
          the application.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Enforce MFA at the IdP level for all users. SSO centralizes authentication — if the IdP is compromised,
          all connected applications are affected. MFA at the IdP level adds a second factor of authentication,
          significantly reducing the risk of credential-based attacks. Use TOTP or security keys (WebAuthn) for MFA
          — avoid SMS-based MFA due to SIM swapping vulnerabilities.
        </p>
        <p>
          Use PKCE for all OIDC flows, even confidential clients. PKCE prevents authorization code interception
          attacks and is now the recommended flow for all OAuth 2.0/OIDC implementations. Do not use the Implicit
          flow — it is deprecated and exposes tokens in the URL.
        </p>
        <p>
          Validate IdP signatures on all SAML assertions and OIDC ID tokens. Never trust an unsigned assertion or
          token. Use well-tested libraries (for SAML: OneLogin SAML, Passport-SAML; for OIDC: passport-openidconnect,
          Spring Security OAuth2) that validate signatures automatically. Configure the libraries to reject unsigned
          assertions and to whitelist allowed signing algorithms.
        </p>
        <p>
          Use short-lived tokens with refresh rotation for OIDC. ID tokens should expire in 5-15 minutes, limiting
          the window of opportunity if a token is compromised. Refresh tokens should be rotated on each use — the
          old refresh token is invalidated when a new one is issued, so that if a refresh token is stolen and used,
          the system can detect the reuse and revoke the entire token family.
        </p>
        <p>
          Audit connected applications regularly — review which applications are connected to the IdP, what
          attributes are shared with each application, and what permissions each application has. Revoke access for
          unused or unauthorized applications. Implement conditional access policies — require MFA for access from
          untrusted networks, restrict access based on device posture, and enforce location-based access controls.
        </p>
        <p>
          Plan for IdP failure — deploy the IdP in a highly available configuration, and configure fallback
          authentication methods for critical applications. If the IdP is unavailable, users should be able to
          authenticate using local credentials or emergency access codes. Test IdP failover regularly to ensure
          the fallback mechanism works correctly.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Not validating SAML assertion signatures is a critical vulnerability. Some SP implementations accept
          unsigned SAML assertions by default — if the signature is not validated, an attacker can forge assertions
          and authenticate as any user. The fix is to configure the SP to require signed assertions and to validate
          the signature using the IdP&apos;s public key.
        </p>
        <p>
          Misconfigured redirect URIs in OIDC enable open redirect attacks. If the redirect URI is not validated
          strictly (allowing wildcards or partial matches), an attacker can redirect the authorization code to a
          malicious endpoint and exchange it for tokens. The fix is to configure exact redirect URIs (no wildcards)
          and to validate the redirect URI on every authentication request.
        </p>
        <p>
          Excessive attribute sharing with SPs violates the principle of least privilege. If the IdP shares all user
          attributes with every SP, each SP receives more data than it needs, increasing the risk of data exposure.
          The fix is to configure attribute mapping per application — share only the attributes that each SP needs,
          and avoid sharing sensitive attributes (SSN, date of birth) unless absolutely necessary.
        </p>
        <p>
          Not implementing Single Logout (SLO) leaves users logged in to SPs after logging out from the IdP. SLO
          terminates the user&apos;s sessions at all connected SPs when the user logs out from the IdP. However, SLO is
          not always reliable — some SPs do not support it, and the user may remain logged in to some SPs. The fix
          is to implement SLO where supported, and to use short-lived tokens at the SP level to limit the window
          of opportunity for session hijacking after logout.
        </p>
        <p>
          Not monitoring IdP activity is a common operational pitfall. The IdP is the most critical component in
          the SSO architecture — if it is compromised or unavailable, all connected applications are affected. The
          IdP should be monitored for authentication failures, unusual login patterns, token issuance rates, and
          configuration changes. Alerts should be configured for anomalous activity (multiple failed MFA attempts,
          authentication from unusual locations, bulk token issuance).
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large enterprise uses Okta as its IdP for SSO across 200+ SaaS applications — employees authenticate
          through Okta (using password + MFA) and access all connected applications (Salesforce, Slack, GitHub,
          Workday) without re-authentication. The enterprise uses SAML for legacy applications (Workday, ServiceNow)
          and OIDC for modern applications (Slack, GitHub). Just-in-Time provisioning creates user accounts
          automatically on first access, and attribute mapping ensures each application receives the expected claims.
          The enterprise audits connected applications quarterly and revokes access for unused applications.
        </p>
        <p>
          A university uses SAML federation (InCommon) to enable students to access research platforms using their
          university credentials. Students authenticate through their university&apos;s IdP (Shibboleth), and the research
          platforms trust the university&apos;s SAML assertions. The federation enables cross-organizational SSO — students
          from 500+ universities can access the platform without creating separate accounts. The platform uses JIT
          provisioning to create student accounts automatically, and attribute mapping ensures the platform receives
          the student&apos;s university affiliation and enrollment status.
        </p>
        <p>
          A healthcare organization uses Azure AD as its IdP for SSO across its clinical systems — healthcare
          providers authenticate through Azure AD (using password + MFA via Microsoft Authenticator) and access
          electronic health records (EHR), imaging systems, and lab systems without re-authentication. The
          organization uses conditional access policies — MFA is required for access from outside the hospital
          network, and access is restricted to managed devices. The organization monitors Azure AD activity and
          alerts on anomalous authentication patterns (authentication from unusual locations, multiple failed MFA
          attempts).
        </p>
        <p>
          A SaaS platform uses OIDC for customer SSO — enterprise customers can configure their own IdP (Okta,
          Azure AD, OneLogin) to enable SSO for their employees accessing the SaaS platform. The platform supports
          both SAML and OIDC, and customers choose the protocol based on their IdP&apos;s capabilities. The platform
          validates IdP signatures on every assertion/token, uses JIT provisioning to create user accounts
          automatically, and maps IdP attributes to platform roles (admin, member, viewer). The platform monitors
          SSO activity and alerts on authentication anomalies for each customer tenant.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is the difference between SAML and OIDC, and when would you use each?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SAML 2.0 is an XML-based protocol designed for enterprise SSO. It uses SAML Assertions (signed XML documents) to carry user identity and attributes. SAML is older, well-established, and widely supported by enterprise applications (Salesforce, Workday, ServiceNow). It is preferred for enterprise SSO, legacy systems, and government applications.
            </p>
            <p>
              OIDC is a JSON/REST-based protocol built on OAuth 2.0. It uses ID Tokens (JWTs) to carry user claims. OIDC is modern, developer-friendly, and preferred for web and mobile applications. Use OIDC for new applications, APIs, and mobile apps. Use SAML for legacy enterprise applications that only support SAML.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What are the security risks of SSO, and how do you mitigate them?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The primary risk is IdP compromise — if the IdP is compromised, the attacker can authenticate to all connected applications. Mitigate by enforcing MFA at the IdP level, monitoring IdP activity, and deploying the IdP in a highly available configuration with regular security audits.
            </p>
            <p>
              Other risks include misconfigured trust relationships (validate IdP signatures on every assertion/token), excessive attribute sharing (share only necessary attributes per application), and token interception (use PKCE for OIDC, HTTPS for all SSO flows). Implement conditional access policies (require MFA for untrusted networks, restrict based on device posture) to add additional security layers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How does Just-in-Time provisioning work, and what are its limitations?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              JIT provisioning creates user accounts in the SP automatically when the user first accesses the application through SSO. The IdP includes user attributes (email, name, roles) in the assertion/token, and the SP creates the user account based on these attributes. This eliminates manual account creation — users are provisioned automatically on first access.
            </p>
            <p>
              Limitations include: the SP has less control over account creation (roles, permissions must be mapped from IdP attributes), attribute mapping errors can create incorrect accounts, and JIT provisioning does not support pre-configuration (the account does not exist until the user first accesses the application). For applications that require pre-configuration (e.g., assigning specific roles or permissions before first access), pre-provisioning via SCIM or API integration is preferred.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle SSO for external partners or contractors?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              External partners or contractors can be handled through federation (the partner&apos;s IdP is trusted by your SPs) or through guest accounts (partner users are created in your IdP with limited access). Federation is preferred for long-term partnerships — the partner manages their own users, and your SPs trust the partner&apos;s IdP. Guest accounts are preferred for short-term engagements — partner users are created in your IdP with time-limited access and restricted permissions.
            </p>
            <p>
              In both cases, enforce MFA, restrict access to necessary resources only, and monitor external user activity. Guest accounts should have an expiration date and be reviewed periodically. Federation relationships should be audited regularly, and trust should be revoked when the partnership ends.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What is Single Logout (SLO), and why is it not always reliable?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SLO terminates the user&apos;s sessions at all connected SPs when the user logs out from the IdP. When the user initiates logout, the IdP sends logout requests to all connected SPs, and each SP terminates the user&apos;s local session. SLO is implemented using SAML Single Logout or OIDC session management specifications.
            </p>
            <p>
              SLO is not always reliable because: some SPs do not support SLO, the IdP may not be able to reach all SPs (network failures, SP downtime), and users may have active sessions at SPs that were initiated before SSO (e.g., direct login with local credentials). The fix is to use short-lived tokens at the SP level — even if SLO fails, the SP&apos;s session expires quickly, limiting the window of opportunity for session hijacking.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SAML 2.0 Technical Overview
            </a> — OASIS specification for SAML 2.0.
          </li>
          <li>
            <a href="https://openid.net/connect/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OpenID Connect Core 1.0
            </a> — OIDC specification built on OAuth 2.0.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Authentication Cheat Sheet
            </a> — SSO and authentication best practices.
          </li>
          <li>
            <a href="https://auth0.com/docs/get-started/authentication-and-authorization-flow" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Auth0: Authentication Flows
            </a> — Guide to SAML and OIDC flows.
          </li>
          <li>
            <a href="https://learn.microsoft.com/en-us/entra/identity/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Microsoft Entra ID (Azure AD) Documentation
            </a> — Enterprise SSO with Azure AD.
          </li>
          <li>
            <a href="https://www.incommon.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              InCommon Federation
            </a> — Education and research SSO federation.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}