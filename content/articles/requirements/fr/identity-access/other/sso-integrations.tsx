"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-other-sso-integrations",
  title: "SSO Integrations",
  description: "Comprehensive guide to implementing Single Sign-On covering SAML, OIDC, enterprise integration, identity providers, and deployment patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "sso-integrations",
  version: "extensive",
  wordCount: 7500,
  readingTime: 30,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "sso", "saml", "oidc", "enterprise", "integration"],
  relatedTopics: ["oauth-providers", "identity-providers", "authentication-service", "access-control-policies"],
};

export default function SSOIntegrationsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Single Sign-On (SSO) Integrations</strong> enable users to authenticate 
          once and access multiple applications without re-authenticating. For enterprise 
          customers, SSO is often a mandatory requirement, enabling centralized identity 
          management, improved security, and reduced IT overhead.
        </p>
        <p>
          For staff and principal engineers, implementing SSO requires understanding SAML 
          2.0, OpenID Connect, identity provider integration, Just-In-Time (JIT) 
          provisioning, directory synchronization, and deployment patterns. The 
          implementation must support multiple IdPs while maintaining security and 
          providing seamless user experience.
        </p>
      </section>

      <section>
        <h2>SSO Protocols</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SAML 2.0</h3>
          <ul className="space-y-3">
            <li>
              <strong>Use Case:</strong> Enterprise SSO, B2B integrations.
            </li>
            <li>
              <strong>Format:</strong> XML-based assertions.
            </li>
            <li>
              <strong>Flow:</strong> SP-initiated or IdP-initiated SSO.
            </li>
            <li>
              <strong>Providers:</strong> Okta, Azure AD, OneLogin, Ping Identity.
            </li>
            <li>
              <strong>Complexity:</strong> High (XML parsing, complex configuration).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">OpenID Connect (OIDC)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Use Case:</strong> Modern SSO, consumer and enterprise.
            </li>
            <li>
              <strong>Format:</strong> JSON-based (JWT tokens).
            </li>
            <li>
              <strong>Flow:</strong> OAuth 2.0 + identity layer.
            </li>
            <li>
              <strong>Providers:</strong> All modern IdPs support OIDC.
            </li>
            <li>
              <strong>Complexity:</strong> Lower than SAML.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>SAML Flow</h2>
        <ul className="space-y-3">
          <li>
            <strong>1. User Access:</strong> User navigates to application (Service 
            Provider).
          </li>
          <li>
            <strong>2. Redirect:</strong> SP redirects to IdP with SAML request.
          </li>
          <li>
            <strong>3. Authentication:</strong> User authenticates at IdP (if not 
            already).
          </li>
          <li>
            <strong>4. Assertion:</strong> IdP returns SAML assertion with user 
            attributes.
          </li>
          <li>
            <strong>5. Validation:</strong> SP validates assertion signature.
          </li>
          <li>
            <strong>6. Session:</strong> SP creates session, grants access.
          </li>
        </ul>
      </section>

      <section>
        <h2>Enterprise Integration</h2>
        <ul className="space-y-3">
          <li>
            <strong>Directory Sync:</strong> SCIM protocol for user provisioning. 
            Auto-create/update users from IdP.
          </li>
          <li>
            <strong>JIT Provisioning:</strong> Create user on first SSO login. 
            Map IdP attributes to local fields.
          </li>
          <li>
            <strong>Group Mapping:</strong> Map IdP groups to local roles. 
            Automatic role assignment.
          </li>
          <li>
            <strong>Domain Verification:</strong> Verify company owns domain 
            before enabling SSO.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: SAML vs OIDC - which to support?</p>
            <p className="mt-2 text-sm">
              A: Support both. SAML for legacy enterprise customers, OIDC for 
              modern deployments. OIDC is simpler and preferred for new 
              integrations. Many IdPs support both.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSO onboarding?</p>
            <p className="mt-2 text-sm">
              A: Domain verification, metadata exchange (XML for SAML, 
              configuration for OIDC), test connection, enable for domain, 
              provide documentation, support during rollout.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle users with both SSO and password login?</p>
            <p className="mt-2 text-sm">
              A: Enforce SSO for verified domains (redirect to IdP). Allow 
              password login for non-SSO users. Migration period: allow 
              both, then enforce SSO after rollout.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSO logout?</p>
            <p className="mt-2 text-sm">
              A: Single Logout (SLO): notify IdP, IdP broadcasts to all SPs. 
              Complex, not always supported. Alternative: local logout only 
              (user logged out of your app, but not IdP).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SSO failures?</p>
            <p className="mt-2 text-sm">
              A: Clear error messages, fallback to password (if enabled), 
              support contact, log failures for debugging, IdP health 
              monitoring.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you support multiple IdPs?</p>
            <p className="mt-2 short">
              A: Configuration per tenant/domain, route to correct IdP based 
              on email domain, support SAML + OIDC simultaneously, abstract 
              IdP differences behind common interface.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
