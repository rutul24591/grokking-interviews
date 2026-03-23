"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/oauth-flow.svg"
          alt="Oauth Flow"
          caption="OAuth Flow — showing authorization code flow with PKCE"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/oauth-providers.svg"
          alt="Oauth Providers"
          caption="OAuth Providers — comparing Google, GitHub, Microsoft, and other providers"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/oauth-security.svg"
          alt="Oauth Security"
          caption="OAuth Security — showing state parameter, PKCE, scope validation, and token handling"
        />
      
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
        <h2>OAuth Implementation Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Exchange Pattern</h3>
        <p>
          Exchange OAuth tokens for internal session tokens. Validate provider tokens first. Issue internal JWT or session. Map provider claims to internal user model. Handle token refresh transparently. Implement token revocation on logout.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Account Linking Pattern</h3>
        <p>
          Link multiple OAuth providers to single account. Verify email ownership before linking. Prevent account takeover. Handle conflicting profile data. Provide unlink functionality. Audit all link/unlink events.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Provider Abstraction Pattern</h3>
        <p>
          Abstract provider differences behind common interface. Normalize user profile data. Handle provider-specific quirks. Support dynamic provider configuration. Enable provider failover. Monitor provider health.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO Pattern</h3>
        <p>
          Support SAML 2.0 and OIDC for enterprise. Configure SP metadata. Handle attribute mapping. Support Just-In-Time provisioning. Handle group/role mapping. Support multiple IdPs per tenant.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Graceful Degradation</h3>
        <p>
          Handle OAuth provider failures gracefully. Fail-safe defaults (allow email/password). Queue OAuth requests for retry. Implement circuit breaker pattern. Provide manual OAuth fallback. Monitor provider health continuously.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST SP 800-63B - Digital Identity Guidelines
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Authentication Cheat Sheet
            </a>
          </li>
        </ul>
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

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Use PKCE for all OAuth flows (even server-side)</li>
          <li>Validate state parameter to prevent CSRF</li>
          <li>Store tokens securely (encrypted at rest)</li>
          <li>Verify token signatures and claims</li>
          <li>Implement token refresh logic</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Provide clear provider selection UI</li>
          <li>Show provider logos and names</li>
          <li>Handle popup vs redirect flows gracefully</li>
          <li>Provide fallback to email/password</li>
          <li>Handle account linking smoothly</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>Track OAuth success/failure rates by provider</li>
          <li>Monitor token refresh rates</li>
          <li>Alert on unusual OAuth patterns</li>
          <li>Track account linking rates</li>
          <li>Monitor provider API latency</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compliance</h3>
        <ul className="space-y-2">
          <li>Meet OAuth 2.0 security best practices</li>
          <li>Document provider integrations</li>
          <li>Audit OAuth events</li>
          <li>Support compliance reporting</li>
          <li>Regular security reviews</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No PKCE:</strong> Authorization code interception attacks.
            <br /><strong>Fix:</strong> Always use PKCE, even for server-side flows.
          </li>
          <li>
            <strong>Missing state validation:</strong> CSRF attacks possible.
            <br /><strong>Fix:</strong> Generate random state, validate on callback.
          </li>
          <li>
            <strong>Insecure token storage:</strong> Tokens exposed if DB compromised.
            <br /><strong>Fix:</strong> Encrypt tokens at rest, use secure storage.
          </li>
          <li>
            <strong>No token verification:</strong> Accepting invalid tokens.
            <br /><strong>Fix:</strong> Verify signatures, expiry, issuer, audience.
          </li>
          <li>
            <strong>No account linking:</strong> Users can't merge accounts.
            <br /><strong>Fix:</strong> Implement secure account linking flow.
          </li>
          <li>
            <strong>Hardcoded scopes:</strong> Requesting unnecessary permissions.
            <br /><strong>Fix:</strong> Request minimum required scopes, make configurable.
          </li>
          <li>
            <strong>No error handling:</strong> Poor UX on OAuth failures.
            <br /><strong>Fix:</strong> Handle all error cases, provide clear messages.
          </li>
          <li>
            <strong>Ignoring provider changes:</strong> Breaking when provider updates API.
            <br /><strong>Fix:</strong> Monitor provider changelogs, version integrations.
          </li>
          <li>
            <strong>No rate limiting:</strong> API rate limits exceeded.
            <br /><strong>Fix:</strong> Implement rate limiting, cache provider responses.
          </li>
          <li>
            <strong>Poor mobile support:</strong> OAuth flows don't work on mobile.
            <br /><strong>Fix:</strong> Use app-claimed URLs, universal links, app links.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Exchange</h3>
        <p>
          Exchange OAuth tokens for internal session tokens. Validate provider tokens first. Issue internal JWT or session. Map provider claims to internal user model. Handle token refresh transparently. Implement token revocation on logout.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Account Linking</h3>
        <p>
          Link multiple OAuth providers to single account. Verify email ownership before linking. Prevent account takeover. Handle conflicting profile data. Provide unlink functionality. Audit all link/unlink events.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Provider Abstraction</h3>
        <p>
          Abstract provider differences behind common interface. Normalize user profile data. Handle provider-specific quirks. Support dynamic provider configuration. Enable provider failover. Monitor provider health.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO</h3>
        <p>
          Support SAML 2.0 and OIDC for enterprise. Configure SP metadata. Handle attribute mapping. Support Just-In-Time provisioning. Handle group/role mapping. Support multiple IdPs per tenant.
        </p>
      </section>

      <section>
        <h2>Security Checklist</h2>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Pre-Launch Checklist</h3>
          <ul className="space-y-2">
            <li>☐ PKCE implemented for all flows</li>
            <li>☐ State parameter validation</li>
            <li>☐ Token encryption at rest</li>
            <li>☐ Token verification implemented</li>
            <li>☐ Account linking flow tested</li>
            <li>☐ Minimum scopes configured</li>
            <li>☐ Error handling for all cases</li>
            <li>☐ Provider monitoring configured</li>
            <li>☐ Audit logging for OAuth events</li>
            <li>☐ Penetration testing completed</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>Test OAuth state generation</li>
          <li>Test token verification</li>
          <li>Test PKCE flow</li>
          <li>Test account linking logic</li>
          <li>Test error handling</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>Test OAuth flow end-to-end</li>
          <li>Test token refresh flow</li>
          <li>Test account linking flow</li>
          <li>Test provider failover</li>
          <li>Test error scenarios</li>
          <li>Test mobile OAuth flows</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Tests</h3>
        <ul className="space-y-2">
          <li>Test CSRF prevention</li>
          <li>Test token interception prevention</li>
          <li>Test account takeover prevention</li>
          <li>Test token verification</li>
          <li>Test scope validation</li>
          <li>Penetration testing for OAuth</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Performance Tests</h3>
        <ul className="space-y-2">
          <li>Test OAuth latency under load</li>
          <li>Test token verification throughput</li>
          <li>Test provider API rate limits</li>
          <li>Test concurrent OAuth flows</li>
          <li>Test token refresh performance</li>
        </ul>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Access Control Cheat Sheet</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/OAuth" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - OAuth Security</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication</a></li>
          <li><a href="https://docs.openfga.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OpenFGA - Fine-Grained Authorization</a></li>
          <li><a href="https://www.cerbos.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Cerbos - Policy as Code</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authorization Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer App Social Login</h3>
        <p>
          Social media platform driving 60% signup conversion via OAuth providers.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Low email signup conversion (25%). Users abandon signup due to password creation friction. Need to support multiple providers.</li>
          <li><strong>Solution:</strong> Prominent social login buttons (Google, Apple, Facebook). OAuth 2.0 with PKCE. Account linking for existing users. Fallback to email signup.</li>
          <li><strong>Result:</strong> 60% of signups via social login. Overall conversion increased to 45%. Support tickets for password reset reduced by 50%.</li>
          <li><strong>Security:</strong> PKCE for all flows, token validation, account linking verification.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO Integration</h3>
        <p>
          B2B SaaS with 5,000 enterprise customers requiring SAML/OIDC SSO.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Each enterprise has different IdP (Okta, Azure AD, OneLogin). Custom attribute mapping. JIT provisioning for automatic user creation.</li>
          <li><strong>Solution:</strong> Abstract IdP integration behind common interface. Support SAML 2.0 + OIDC. Configurable attribute mapping. SCIM for user provisioning.</li>
          <li><strong>Result:</strong> Onboarded 500 enterprise customers in 6 months. 99.9% SSO success rate. Reduced support tickets by 70%.</li>
          <li><strong>Security:</strong> IdP-initiated logout, session sync, audit logging for compliance.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Mobile App OAuth</h3>
        <p>
          Mobile-first platform with iOS and Android apps, 10M mobile users.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> iOS requires Sign in with Apple if offering other social logins. Deep linking for OAuth callback. App-claimed URLs for secure redirect.</li>
          <li><strong>Solution:</strong> Implement Sign in with Apple (mandatory). Universal links (iOS) + App Links (Android). PKCE for public clients. Secure token storage in Keychain/Keystore.</li>
          <li><strong>Result:</strong> App Store compliance maintained. 70% mobile signups via social. Zero OAuth callback hijacking incidents.</li>
          <li><strong>Security:</strong> PKCE, secure token storage, app-claimed URLs, certificate pinning.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform OAuth</h3>
        <p>
          Online gaming platform with Steam, PlayStation, Xbox integrations.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Multiple gaming platform OAuth integrations. Each has unique OAuth flow. Account linking across platforms. Cross-platform play requires unified identity.</li>
          <li><strong>Solution:</strong> Platform-specific OAuth adapters. Unified internal identity system. Account linking flow with verification. Cross-platform session management.</li>
          <li><strong>Result:</strong> 80% users linked multiple platforms. Cross-platform play seamless. Account takeover reduced by 90%.</li>
          <li><strong>Security:</strong> Platform verification, account linking confirmation, cross-platform session binding.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">International OAuth Providers</h3>
        <p>
          Global platform supporting regional providers (WeChat, LINE, KakaoTalk).
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Different providers by region (Google/Facebook in West, WeChat in China, LINE in Japan, Kakao in Korea). Each has unique OAuth requirements.</li>
          <li><strong>Solution:</strong> Region-aware provider selection. Localized OAuth flows. Compliance with local regulations (China data residency, Japan APPI). Fallback to email signup.</li>
          <li><strong>Result:</strong> 85% social login adoption globally. Regional compliance maintained. User experience optimized per market.</li>
          <li><strong>Security:</strong> Regional compliance, provider-specific validation, unified token handling.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
