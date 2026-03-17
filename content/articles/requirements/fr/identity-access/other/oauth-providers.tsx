"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-other-oauth-providers",
  title: "OAuth Providers",
  description: "Comprehensive guide to integrating OAuth providers covering Google, Facebook, Apple, GitHub, enterprise SSO, token exchange, account linking, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "oauth-providers",
  version: "extensive",
  wordCount: 8500,
  readingTime: 34,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "oauth", "sso", "social-login", "integration"],
  relatedTopics: ["sso-integrations", "identity-providers", "authentication-service", "token-generation"],
};

export default function OAuthProvidersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>OAuth Providers</strong> are third-party identity services that enable users to 
          authenticate using existing accounts (Google, Facebook, Apple, GitHub, Microsoft, etc.). 
          OAuth integration reduces signup friction, improves conversion, and offloads password 
          management to specialized providers.
        </p>
        <p>
          For staff and principal engineers, integrating OAuth providers requires understanding 
          OAuth 2.0 flows, provider-specific quirks, security considerations (token handling, scope 
          validation), account linking strategies, and operational concerns (provider outages, API 
          changes, rate limits). The implementation must provide seamless UX while maintaining 
          security and data privacy.
        </p>
        <p>
          Modern platforms typically support multiple OAuth providers to maximize conversion. Each 
          provider has unique requirements: Apple requires "Sign in with Apple" if you offer other 
          social logins on iOS, Google has strict brand guidelines, Facebook requires app review 
          for certain permissions. The architecture must abstract provider differences behind a 
          common interface.
        </p>
      </section>

      <section>
        <h2>OAuth 2.0 Integration</h2>
        <p>
          Understanding OAuth 2.0 flows is essential for proper provider integration.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authorization Code Flow</h3>
          <ul className="space-y-3">
            <li>
              <strong>Step 1 - Redirect:</strong> Redirect user to provider's authorization 
              endpoint with client_id, redirect_uri, scope, state (CSRF protection), 
              code_challenge (PKCE).
            </li>
            <li>
              <strong>Step 2 - User Authorization:</strong> User logs in to provider (if not 
              already), consents to requested scopes. Provider shows consent screen.
            </li>
            <li>
              <strong>Step 3 - Authorization Code:</strong> Provider redirects back to 
              redirect_uri with authorization code and state. Validate state matches.
            </li>
            <li>
              <strong>Step 4 - Token Exchange:</strong> Server exchanges code for tokens 
              (access_token, refresh_token, id_token) using client_secret. Verify code_challenge.
            </li>
            <li>
              <strong>Step 5 - User Info:</strong> Use access_token to fetch user profile from 
              provider's userinfo endpoint. Create or link local account.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">PKCE (Proof Key for Code Exchange)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Code Verifier:</strong> Client generates random string (43-128 chars). 
              Store temporarily.
            </li>
            <li>
              <strong>Code Challenge:</strong> Create SHA256 hash of verifier, base64url encode. 
              Send with authorization request.
            </li>
            <li>
              <strong>Verification:</strong> Provider hashes stored verifier, compares to 
              challenge. Prevents authorization code interception attacks.
            </li>
            <li>
              <strong>Required For:</strong> All public clients (SPAs, mobile apps). Recommended 
              for all clients (RFC 7636).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">OpenID Connect (OIDC)</h3>
          <ul className="space-y-3">
            <li>
              <strong>id_token:</strong> JWT containing user identity claims (sub, name, email, 
              picture). Signed by provider. Verify signature using provider's JWKS.
            </li>
            <li>
              <strong>Standard Claims:</strong> sub (provider user ID), email, name, picture, 
              locale. Provider-specific claims vary.
            </li>
            <li>
              <strong>UserInfo Endpoint:</strong> OAuth-protected endpoint for additional user 
              data. Requires appropriate scopes.
            </li>
            <li>
              <strong>Discovery:</strong> Well-known endpoint (.well-known/openid-configuration) 
              provides provider configuration (endpoints, supported flows, claims).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Provider Integration</h2>
        <p>
          Each OAuth provider has unique requirements and quirks.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Google OAuth</h3>
          <ul className="space-y-3">
            <li>
              <strong>Setup:</strong> Google Cloud Console, create OAuth credentials, configure 
              consent screen. Verify app for sensitive scopes.
            </li>
            <li>
              <strong>Scopes:</strong> openid, email, profile (basic). Additional scopes require 
              verification.
            </li>
            <li>
              <strong>Brand Guidelines:</strong> Use official "Sign in with Google" button. 
              Specific colors, sizing, placement rules.
            </li>
            <li>
              <strong>Quotas:</strong> Generous limits for basic auth. Higher limits require 
              verification.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Facebook Login</h3>
          <ul className="space-y-3">
            <li>
              <strong>Setup:</strong> Facebook Developer Console, create app, configure OAuth 
              redirect URIs.
            </li>
            <li>
              <strong>App Review:</strong> Required for most permissions beyond public_profile. 
              Submit use case, screencast.
            </li>
            <li>
              <strong>Permissions:</strong> public_profile (default), email, user_friends 
              (requires review).
            </li>
            <li>
              <strong>Data Use:</strong> Strict policies on data usage, retention, sharing. 
              Regular compliance reviews.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Sign in with Apple</h3>
          <ul className="space-y-3">
            <li>
              <strong>Requirement:</strong> Mandatory if you offer other social logins on iOS 
              apps (App Store guideline 4.8).
            </li>
            <li>
              <strong>Privacy:</strong> Users can hide email (Apple generates relay email). 
              Must respect privacy choices.
            </li>
            <li>
              <strong>Setup:</strong> Apple Developer Console, create App ID, configure Sign in 
              with Apple capability, create Service ID.
            </li>
            <li>
              <strong>Token Validation:</strong> Verify identity_token (JWT) signature using 
              Apple's public keys. Validate audience claim.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">GitHub OAuth</h3>
          <ul className="space-y-3">
            <li>
              <strong>Setup:</strong> GitHub Developer Settings, create OAuth App, configure 
              callback URL.
            </li>
            <li>
              <strong>Scopes:</strong> No scope = public info only. user (profile), user:email, 
              repo (for repo access).
            </li>
            <li>
              <strong>Rate Limits:</strong> 5000 requests/hour for authenticated requests. 
              Lower for unauthenticated.
            </li>
            <li>
              <strong>Enterprise:</strong> Support GitHub Enterprise with configurable endpoint 
              URLs.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Account Linking</h2>
        <p>
          Handling users who sign up with multiple methods requires careful design.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Linking Strategies</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email Matching:</strong> If OAuth email matches existing email account, 
              prompt to link ("This email is registered. Link Google account?"). Require password 
              verification first.
            </li>
            <li>
              <strong>Manual Linking:</strong> User adds OAuth provider in account settings. 
              Redirect to provider, consent, link on return. Require authentication before linking.
            </li>
            <li>
              <strong>Account Merging:</strong> User has separate accounts (email + OAuth). 
              Provide merge flow with verification for both. Combine data, keep primary auth 
              method.
            </li>
            <li>
              <strong>Prevent Duplicate:</strong> Check for existing OAuth provider + provider 
              user_id combination. Reject duplicate linking.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Considerations</h3>
          <ul className="space-y-3">
            <li>
              <strong>Verification Required:</strong> Always verify existing account (password, 
              MFA) before linking. Prevents account takeover.
            </li>
            <li>
              <strong>Email Verification:</strong> If OAuth provides verified email, mark as 
              verified. Otherwise, send verification email.
            </li>
            <li>
              <strong>Unlinking:</strong> Require at least one auth method. Prevent unlinking 
              last method. Notify user of unlink.
            </li>
            <li>
              <strong>Audit Trail:</strong> Log all link/unlink events. Include provider, 
              timestamp, IP, device.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle OAuth provider outages?</p>
            <p className="mt-2 text-sm">
              A: Graceful degradation: hide provider button if down (health check), fallback to 
              email/password, queue OAuth logins for retry, circuit breaker pattern. Never block 
              all auth due to one provider.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email privacy from Apple/Google?</p>
            <p className="mt-2 text-sm">
              A: Apple relay emails (@privaterelay.appleid.com) - forward to user's real email, 
              can't contact directly. Google proxy emails - similar. Store as-is, respect user's 
              privacy choice, don't attempt to deanonymize.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you validate OAuth tokens securely?</p>
            <p className="mt-2 text-sm">
              A: Verify JWT signature using provider's JWKS (cache keys), validate iss (issuer), 
              aud (audience - your client_id), exp (not expired), nonce (if used). Use established 
              libraries (passport, next-auth).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle OAuth scope changes?</p>
            <p className="mt-2 text-sm">
              A: Request minimum scopes initially. Request additional scopes when needed (with 
              explanation). Handle scope denial gracefully. Periodically re-validate scopes haven't 
              been revoked.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you store OAuth refresh tokens?</p>
            <p className="mt-2 text-sm">
              A: Yes, if you need ongoing access to provider APIs. Store encrypted, rotate on use, 
              allow revocation. For auth-only, refresh token not needed (use your own refresh 
              token system).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you support enterprise SSO (SAML)?</p>
            <p className="mt-2 text-sm">
              A: SAML flow: SP-initiated SSO, redirect to IdP, user authenticates, IdP returns 
              SAML assertion, validate signature, extract attributes, create session. Support 
              multiple IdPs (Okta, Azure AD, OneLogin). Map SAML attributes to user fields.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Metrics &amp; Monitoring</h2>
        <ul className="space-y-2">
          <li><strong>OAuth Conversion Rate:</strong> Signups via OAuth / Total signups</li>
          <li><strong>Provider Distribution:</strong> % per provider (Google, Facebook, Apple, etc.)</li>
          <li><strong>OAuth Success Rate:</strong> Successful OAuth logins / OAuth attempts</li>
          <li><strong>Account Linking Rate:</strong> Users who link OAuth / Total users</li>
          <li><strong>Provider Error Rate:</strong> Errors per provider (monitor for outages)</li>
          <li><strong>Token Refresh Rate:</strong> Successful token refreshes / Refresh attempts</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
