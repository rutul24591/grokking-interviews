"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-oauth-oidc-sso",
  title: "OAuth 2.0 / OIDC / SSO — Authentication Architecture",
  description:
    "Production-grade OAuth 2.0 Authorization Code + PKCE flow, OpenID Connect token validation, silent refresh, enterprise SSO with SAML/OIDC federation, and cross-tab session synchronization.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "oauth-oidc-sso",
  wordCount: 5600,
  readingTime: 34,
  lastUpdated: "2026-05-16",
  tags: ["oauth", "oidc", "sso", "pkce", "jwt", "saml", "authentication", "lld"],
};

export default function OAuthOidcSsoArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design OAuth OIDC and SSO</h1><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame OAuth 2.0 / OIDC / SSO — Authentication Architecture around identity UX, token/session safety, recovery flows, permission modeling, and abuse resistance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><p>Design OAuth OIDC and SSO is a security-sensitive low-level design problem covering authorization redirect, PKCE, state and nonce, callback validation, token exchange, OIDC claims, refresh coordination, and logout. A principal-level answer must state the authoritative server boundary, threat model, lifecycle, abuse controls, rollback, privacy, observability, and user-safe degraded behavior.</p><p>Keep authorization transaction state, PKCE verifier, nonce, callback result, and server session separate. Tokens should remain server-side where a BFF is available. Core structures: state, nonce, PKCE verifier, redirect target, authorization code, callback status, server session, refresh lock, provider metadata, and logout state.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/auth-user-systems/oauth-oidc-sso-runtime.svg" alt="Design OAuth OIDC and SSO runtime" caption="Security flow from user intent through authoritative validation and audit." /></section>
<section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: client UI can guide auth flows but server-side policy remains the authority for identity, session, and permission decisions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For OAuth 2.0 / OIDC / SSO — Authentication Architecture, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock><p>The retained deep dive below captures the topic-specific mechanics.</p><p>
        OAuth 2.0 and OpenID Connect (OIDC) are the industry standard protocols for delegated authorization and
        federated authentication. Nearly every FAANG-scale product uses them — for social login, enterprise SSO,
        service-to-service auth, and mobile app authentication. Understanding the exact flow, token lifecycle,
        security pitfalls, and frontend implementation details is essential for staff-level engineering interviews.
      </p>

      

      <h3>Why OAuth 2.0 + PKCE for SPAs</h3>
      <p>
        The original OAuth 2.0 Implicit Flow was designed for browser-based applications but has been deprecated.
        It returned access tokens directly in the URL fragment — visible in browser history, referrer headers,
        and server logs. The Authorization Code Flow with PKCE (Proof Key for Code Exchange) replaces it for
        all public clients (SPAs, mobile apps) that cannot securely store a client secret.
      </p>
      <p>
        PKCE adds a cryptographic challenge to the authorization code exchange. The client generates a random
        <strong>code_verifier</strong> (43–128 characters, cryptographically random), computes
        <strong>code_challenge = BASE64URL(SHA256(code_verifier))</strong>, and sends the challenge in the
        authorization request. When exchanging the code for tokens, the client sends the original verifier —
        the authorization server verifies the hash matches. An attacker who intercepts the authorization code
        cannot exchange it without knowing the verifier.
      </p>

      <HighlightBlock as="p" tier="crucial">
        Never use the Implicit Flow. Always use Authorization Code + PKCE for SPAs. Never store tokens in
        localStorage — access tokens belong in memory (React state/Zustand), refresh tokens belong in
        httpOnly Secure SameSite=Strict cookies managed by a BFF or server-side endpoint.
      </HighlightBlock>

      <h3>Authorization Code + PKCE — Step-by-Step Implementation</h3>
      <p>
        The complete flow involves eight steps that the frontend must implement correctly. A single mistake —
        such as skipping state validation or storing tokens insecurely — creates critical vulnerabilities.
      </p>
      <p>
        <strong>Step 1 — Generate PKCE material.</strong> On login button click, generate 32 cryptographically
        random bytes using <code>crypto.getRandomValues()</code>. Base64URL-encode them to form the
        code_verifier. Compute code_challenge = BASE64URL(SHA256(code_verifier)). Generate a separate random
        state nonce for CSRF protection.
      </p>
      <p>
        <strong>Step 2 — Store verifier and state.</strong> Write both to <code>sessionStorage</code> (not
        localStorage — sessionStorage is tab-scoped and cleared on tab close). The state nonce prevents
        CSRF attacks against the OAuth callback endpoint.
      </p>
      <p>
        <strong>Step 3 — Redirect to authorization endpoint.</strong> Build the URL:
        <code>/authorize?response_type=code&amp;client_id=APP_ID&amp;redirect_uri=https://app/callback&amp;scope=openid+profile+email&amp;state=NONCE&amp;code_challenge=CHALLENGE&amp;code_challenge_method=S256</code>.
        Use <code>window.location.assign()</code> (full page redirect), not a fetch request.
      </p>
      <p>
        <strong>Step 4 — Handle the callback.</strong> The IdP redirects back to your redirect_uri with
        <code>?code=AUTH_CODE&amp;state=NONCE</code>. Extract both parameters from the URL.
      </p>
      <p>
        <strong>Step 5 — Validate state.</strong> Compare the returned state against the value stored in
        sessionStorage. If they differ, abort — this is a CSRF or replay attack. Clear the stored state.
      </p>
      <p>
        <strong>Step 6 — Exchange code for tokens.</strong> POST to the token endpoint:
        <code>&#123;grant_type: "authorization_code", code, redirect_uri, client_id, code_verifier&#125;</code>.
        This should be done via your BFF (server-side) so the response containing the refresh_token can be
        written directly into an httpOnly cookie. The access_token is returned to the client in the response body.
      </p>
      <p>
        <strong>Step 7 — Validate the id_token.</strong> Parse the JWT (three base64url-encoded sections).
        Verify the signature using the IdP's public keys from <code>/.well-known/jwks.json</code>. Validate:
        <code>iss</code> matches the IdP, <code>aud</code> matches your client_id, <code>exp</code> is in the
        future, <code>nonce</code> matches what you sent. Extract user claims (<code>sub</code>, <code>email</code>,
        <code>name</code>, <code>picture</code>).
      </p>
      <p>
        <strong>Step 8 — Store access token in memory.</strong> Place the access_token in React context or
        Zustand store — never in localStorage or sessionStorage. Set a timer to refresh 60 seconds before
        expiry using the <code>exp</code> claim.
      </p>

      <h3>Token Lifecycle and Silent Refresh</h3>
      <p>
        Access tokens are intentionally short-lived (15–60 minutes) to limit the impact of theft. Refresh
        tokens are long-lived (days to weeks) and must be stored securely. The challenge: keeping the user
        logged in without requiring repeated logins while maintaining security.
      </p>
      <p>
        <strong>Proactive refresh.</strong> Parse the <code>exp</code> claim from the JWT payload (no library
        needed — just base64url-decode the second segment). Schedule a refresh 60 seconds before expiry using
        <code>setTimeout</code>. This avoids 401 errors on API calls. Clear the timer on logout.
      </p>
      <p>
        <strong>Reactive refresh (interceptor approach).</strong> Wrap your HTTP client with an interceptor
        that catches 401 responses, calls the refresh endpoint, updates the in-memory token, then retries
        the original request. Critical implementation detail: while a refresh is in-flight, queue all
        concurrent requests and flush the queue when the new token arrives. Without this, multiple simultaneous
        401s cause multiple concurrent refresh calls, potentially invalidating each other.
      </p>
      <p>
        <strong>Refresh token rotation.</strong> Modern IdPs (Auth0, Okta, AWS Cognito) issue a new refresh
        token on every use and invalidate the old one. If an attacker steals a refresh token and uses it
        after you do, the IdP detects the rotation collision and revokes the entire family — logging out all
        devices. The client must store only the most recently issued refresh token.
      </p>
      <p>
        <strong>Cross-tab synchronization.</strong> When a user has multiple tabs open, one tab refreshing
        the token should propagate to all others. Use the <code>BroadcastChannel API</code> to broadcast
        the new access token. Similarly, broadcast logout events so all tabs redirect to the login page
        simultaneously. This prevents stale token reads from other tabs.
      </p>

      <HighlightBlock as="p" tier="important">
        The refresh endpoint must be called server-side (via BFF) so the response can set an httpOnly cookie
        containing the new refresh token. If the client JS calls the token endpoint directly, the refresh
        token will be visible in the response body and must be stored insecurely in JS-accessible storage.
      </HighlightBlock>

      <h3>OIDC — OpenID Connect Layer</h3>
      <p>
        OpenID Connect is an identity layer built on top of OAuth 2.0. It adds the <strong>id_token</strong>
        (a signed JWT containing user identity claims) and standardizes the discovery document
        (<code>/.well-known/openid-configuration</code>) that describes all endpoints and supported algorithms.
      </p>
      <p>
        <strong>Scopes and claims.</strong> Request <code>openid</code> (required for OIDC), <code>profile</code>
        (name, picture, locale), <code>email</code>, and custom scopes for app-specific claims. Avoid requesting
        scopes you don't need — the user sees these on the consent screen. Use incremental authorization:
        request additional scopes only when the user accesses a feature that needs them.
      </p>
      <p>
        <strong>UserInfo endpoint.</strong> The id_token contains basic claims; additional claims are available
        via GET /userinfo with the access_token. Avoid calling UserInfo on every request — cache user data in
        your session store and refresh only on token renewal.
      </p>
      <p>
        <strong>Nonce for replay prevention.</strong> Include a <code>nonce</code> parameter in the authorization
        request (same as the state, but included inside the id_token). When validating the id_token, verify
        the nonce matches what you sent. This prevents an attacker from reusing a captured id_token in a
        different browser session.
      </p>

      <h3>Enterprise SSO — SAML and OIDC Federation</h3>
      <p>
        Enterprise customers expect to authenticate with their corporate identity provider (Okta, Azure AD,
        Ping Identity, Google Workspace). Supporting this requires understanding both SAML 2.0 and OIDC
        federation patterns.
      </p>
      <p>
        <strong>Email-based IdP routing.</strong> When a user enters their email on the login page, extract
        the domain and look up the tenant's configured IdP. Redirect to the appropriate SAML assertion consumer
        service or OIDC authorization endpoint. This is the basis of "Sign in with SSO" flows.
      </p>
      <p>
        <strong>SAML 2.0 SP-initiated flow.</strong> Your app (Service Provider) generates a SAMLRequest,
        encodes it as base64, and redirects to the IdP's SSO URL. The IdP authenticates the user and sends
        a SAMLResponse (signed XML) via HTTP POST to your Assertion Consumer Service (ACS) URL. Your server
        validates the signature, extracts attributes (email, name, groups), and establishes a session.
      </p>
      <p>
        <strong>OIDC federation.</strong> Simpler than SAML — the customer's IdP acts as an upstream OIDC
        provider. Your system is the OIDC client. Discovery via <code>/.well-known/openid-configuration</code>
        makes setup declarative. OIDC federation is preferred when the customer IdP supports it.
      </p>
      <p>
        <strong>Just-In-Time (JIT) provisioning.</strong> On first SSO login, create the user account
        automatically from SAML attributes or OIDC claims. Map <code>email</code> to username,
        <code>groups</code> to roles, <code>department</code> to organizational unit. JIT reduces admin
        overhead but requires careful handling of attribute updates on subsequent logins (sync vs. overwrite).
      </p>
      <p>
        <strong>Single Logout (SLO).</strong> When the user logs out of the IdP (or another app), the IdP
        sends a logout request to all registered service providers. Your app must receive this, invalidate
        the local session, and redirect the user to the login page. SLO is often unreliable in practice —
        implement local session timeouts as a fallback.
      </p>

      <h3>Security Hardening</h3>
      <p>
        <strong>Redirect URI validation.</strong> Register exact redirect URIs with the IdP — no wildcards.
        The IdP rejects authorization requests with unregistered redirect URIs, preventing open redirect attacks.
        Validate the redirect_uri on your side as well before initiating the flow.
      </p>
      <p>
        <strong>Token binding (advanced).</strong> For high-security applications, bind access tokens to the
        client's TLS certificate (mTLS — RFC 8705). The server rejects tokens presented from a different
        client cert. Implemented at the BFF layer — the browser doesn't manage certs directly.
      </p>
      <p>
        <strong>Popup vs redirect trade-off.</strong> Popup-based OAuth avoids full-page navigation (better UX
        for mid-session auth) but is blocked by mobile browsers and popup blockers. Redirect-based OAuth works
        universally. Preserve app state by encoding a <code>returnUrl</code> in the state parameter before
        redirecting, then restore after callback.
      </p>
      <p>
        <strong>Clock skew tolerance.</strong> JWT <code>exp</code> and <code>iat</code> claims are Unix timestamps.
        Client clocks drift. Accept ±60 seconds of leeway when validating exp. More than 60s suggests a
        misconfigured system clock or a very old token.
      </p>
      <p>
        <strong>Scope minimization.</strong> Never request <code>offline_access</code> (refresh token) in
        consumer apps unless necessary — users see this on the consent screen and it creates long-lived
        credentials. Request it only for apps that need background sync.
      </p>

      <h3>Implementation Architecture</h3>
      <p>
        A production OAuth implementation involves three layers: the React UI layer handles the auth flow
        initiation and callback, an auth context/store manages token state and provides hooks to components,
        and an HTTP client wrapper handles token injection and refresh.
      </p>
      <p>
        <strong>AuthProvider pattern.</strong> Wrap your app in an AuthProvider component that initializes
        the auth state by checking for an existing session (call your BFF's /auth/me endpoint). Expose
        <code>user</code>, <code>isAuthenticated</code>, <code>login()</code>, <code>logout()</code>, and
        <code>getAccessToken()</code> via context. Components consume this via <code>useAuth()</code> hook.
      </p>
      <p>
        <strong>Route protection.</strong> Use a <code>RequireAuth</code> wrapper component that reads from
        AuthContext — if not authenticated, redirects to login preserving the current URL in state. For
        server-rendered pages, check the session cookie in middleware before rendering.
      </p>
      <p>
        <strong>Handling the callback page.</strong> The OAuth callback route (<code>/auth/callback</code>)
        should be a minimal page that extracts code and state from the URL, calls the token exchange endpoint,
        then redirects to the original destination. Show a loading spinner during this — the user should not
        see a flash of the callback URL.
      </p>

      <h3>Testing OAuth Flows</h3>
      <p>
        OAuth flows are notoriously difficult to test because they involve external redirects. Effective
        testing strategies:
      </p>
      <p>
        <strong>Unit test token validation.</strong> Test JWT parsing, exp validation, nonce checking, and
        clock skew handling independently with fixture tokens.
      </p>
      <p>
        <strong>Integration test the callback handler.</strong> Mock the token endpoint and verify that
        your callback correctly validates state, calls the exchange, and stores the token.
      </p>
      <p>
        <strong>E2E test with test IdP.</strong> Use Keycloak or Auth0's test tenant with a pre-configured
        test user. Playwright can handle the OAuth redirect flow end-to-end, verifying that login sets
        the correct auth state and protected pages are accessible.
      </p>
      <p>
        <strong>Mock auth in unit/component tests.</strong> Provide a mock AuthContext with preset user and
        tokens — never hit the real IdP in unit tests. This keeps tests fast and deterministic.
      </p></section>
<section><h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: token storage, MFA challenge state, redirect handling, session timeout, impersonation audit, and permission-cache invalidation.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock><p>Separate user intent, browser-safe projection, server validation, durable security record, audit evidence, and cleanup. Frontend state improves UX but never replaces server enforcement. Tokens, challenges, sessions, and privileged grants need explicit expiry and revocation.</p><p>Keep authorization transaction state, PKCE verifier, nonce, callback result, and server session separate. Tokens should remain server-side where a BFF is available.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/auth-user-systems/oauth-oidc-sso-recovery.svg" alt="Design OAuth OIDC and SSO threat recovery" caption="Threat recovery: validate, deny safely, preserve authoritative truth, audit, and recover." /></section>
<section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock><p>Provider tokens and server session are authoritative. Callback state and nonce are one-time correlation proofs, not user identity by themselves. Scale and threat pressure comes from CSRF, code interception, nonce replay, open redirects, multi-tab callbacks, refresh storms, provider outage, and claim drift. Fail closed for privilege while keeping error UX actionable.</p></section>
<section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: login completion, MFA failure, revocation latency, session timeout accuracy, and permission denial rate.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock><p>Use short-lived scoped grants, secure cookies, CSRF defenses, replay prevention, rotation, versioned writes, server-side authorization, rate limits, redacted logs, and explicit audit events. Test expiry, replay, revocation, retries, multiple tabs, and permission drift.</p></section>
<h3>Principal defense: authority, consistency, and abuse cost</h3><p>Use server-authoritative consistency for security decisions. Browser state is a revocable projection that can improve responsiveness but cannot grant access, extend expiry, or confirm a privileged transition. Every mutation carries a version, expiry, nonce, or idempotency key as appropriate; stale projections refresh or fail closed. Rollback means revoking the grant, session family, policy version, or pending intent while retaining an audit trail.</p><p>Model abuse and cost together. Rate-limit sensitive attempts by account, device, network, and risk cohort without turning the UI into an enumeration oracle. Bound session inventory, audit retention, challenge issuance, cross-tab broadcasts, and refresh retries. Emit denial reason classes, revocation lag, suspicious reuse, policy version, and correlation ids while avoiding sensitive payloads in telemetry.</p><section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: token leakage, stale auth state, broken recovery, confused deputy access, and invisible session revocation.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock><p>Common failures include trusting frontend guards, storing bearer tokens in localStorage, leaking account existence, missing idempotency, weak redirect validation, and incomplete audit evidence.</p><p>For this topic, generate strong state and verifier, validate redirect allowlist, exchange codes once, coordinate refresh, handle provider failure, and clear sessions on logout.</p></section>
<section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock><p>This design applies to user identity and access workflows where convenience must not weaken authoritative server enforcement or incident evidence.</p></section>
<section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock><h3>What is authoritative?</h3><p>Provider tokens and server session are authoritative. Callback state and nonce are one-time correlation proofs, not user identity by themselves.</p><h3>What breaks under abuse?</h3><p>CSRF, code interception, nonce replay, open redirects, multi-tab callbacks, refresh storms, provider outage, and claim drift.</p><h3>How do you recover?</h3><p>generate strong state and verifier, validate redirect allowlist, exchange codes once, coordinate refresh, handle provider failure, and clear sessions on logout.</p><h3>What does the client enforce?</h3><p>The client improves usability and fails closed for privileged views; the server enforces every protected read and mutation.</p><h3>How do you observe incidents?</h3><p>Emit redacted audit records with subject, actor, policy version, reason, outcome, and correlation id.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.rfc-editor.org/rfc/rfc7636" target="_blank" rel="noreferrer">RFC 7636 PKCE</a></li><li><a href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="noreferrer">WebAuthn Level 3</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noreferrer">MDN Cookies</a></li><li><a href="https://owasp.org/www-project-cheat-sheets/" target="_blank" rel="noreferrer">OWASP Cheat Sheets</a></li></ul></section>
</ArticleLayout>}