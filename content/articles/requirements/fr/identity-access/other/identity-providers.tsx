"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-other-identity-providers",
  title: "Identity Providers",
  description: "Guide to integrating with identity providers covering Okta, Azure AD, OneLogin, configuration, and enterprise SSO patterns.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "identity-providers",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "idp", "enterprise", "sso", "integration"],
  relatedTopics: ["sso-integrations", "oauth-providers", "access-control-policies"],
};

export default function IdentityProvidersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Identity Providers (IdP)</strong> are third-party services that manage user 
          identities and authentication for organizations. Enterprise customers often require 
          integration with their existing IdP for centralized identity management and compliance.
        </p>
      </section>

      <section>
        <h2>Major Identity Providers</h2>
        <ul className="space-y-3">
          <li><strong>Okta:</strong> Leading enterprise IdP, SAML + OIDC support.</li>
          <li><strong>Azure AD:</strong> Microsoft's IdP, Office 365 integration.</li>
          <li><strong>OneLogin:</strong> Cloud-based IdP, SMB focused.</li>
          <li><strong>Ping Identity:</strong> Enterprise SSO and federation.</li>
          <li><strong>Auth0:</strong> Developer-focused, now part of Okta.</li>
        </ul>
      </section>

      <section>
        <h2>Integration Patterns</h2>
        <ul className="space-y-3">
          <li><strong>Enterprise SSO:</strong> SAML/OIDC for employee authentication.</li>
          <li><strong>Directory Sync:</strong> SCIM for user provisioning.</li>
          <li><strong>Just-In-Time:</strong> Create users on first SSO login.</li>
          <li><strong>Group Mapping:</strong> IdP groups to application roles.</li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you support multiple IdPs?</p>
            <p className="mt-2 text-sm">A: Configuration per tenant, route by email domain, abstract protocol differences.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle IdP outages?</p>
            <p className="mt-2 text-sm">A: Fallback to password login, circuit breaker, health monitoring, clear error messages.</p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
