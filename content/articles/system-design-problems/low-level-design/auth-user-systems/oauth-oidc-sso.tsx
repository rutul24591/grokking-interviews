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

export default function OAuthOidcSsoArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        OAuth 2.0 and OpenID Connect (OIDC) are the industry standard protocols for delegated authorization and
        federated authentication. Nearly every FAANG-scale product uses them — for social login, enterprise SSO,
        service-to-service auth, and mobile app authentication. Understanding the exact flow, token lifecycle,
        security pitfalls, and frontend implementation details is essential for staff-level engineering interviews.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/auth-user-systems/oauth-oidc-sso.svg"
        alt="OAuth 2.0 / OIDC / SSO architecture diagram"
        caption="OAuth 2.0 Authorization Code + PKCE, token lifecycle, enterprise SSO federation, and security edge cases"
      />

      <h2>Why OAuth 2.0 + PKCE for SPAs</h2>
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

      <h2>Authorization Code + PKCE — Step-by-Step Implementation</h2>
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

      <h2>Token Lifecycle and Silent Refresh</h2>
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

      <h2>OIDC — OpenID Connect Layer</h2>
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

      <h2>Enterprise SSO — SAML and OIDC Federation</h2>
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

      <h2>Security Hardening</h2>
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

      <h2>Implementation Architecture</h2>
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

      <h2>Testing OAuth Flows</h2>
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
      </p>

      <h2>Interview Questions</h2>

      <h3>Q1: Why is the Implicit Flow deprecated and what does PKCE solve?</h3>
      <p>
        The Implicit Flow returned access tokens in the URL fragment, exposing them to browser history,
        referrer headers, and JavaScript running on the page. PKCE eliminates the client_secret requirement
        for public clients by adding a cryptographic challenge. The code_verifier is generated on the client,
        the code_challenge (SHA256 hash) is sent with the authorization request, and the verifier is sent
        during code exchange. An attacker who intercepts the authorization code cannot exchange it without
        the verifier — which was never transmitted over the network and is stored only in sessionStorage.
        PKCE makes the Authorization Code Flow safe for SPAs and mobile apps.
      </p>

      <h3>Q2: Where should access tokens and refresh tokens be stored in a SPA?</h3>
      <p>
        Access tokens: in-memory only (React state, Zustand store, module-level variable). Never in
        localStorage (XSS-accessible) or sessionStorage (also XSS-accessible, though tab-scoped).
        In-memory tokens are lost on page refresh — recover by calling a /auth/me endpoint that reads
        the httpOnly cookie and issues a new access token.
      </p>
      <p>
        Refresh tokens: in an httpOnly, Secure, SameSite=Strict cookie managed by your BFF. JavaScript
        can never read httpOnly cookies. The BFF exposes a /auth/refresh endpoint that reads the cookie,
        calls the IdP token endpoint, issues a new access token in the response body and rotates the
        refresh token cookie.
      </p>

      <h3>Q3: How do you handle token refresh when multiple concurrent API calls encounter a 401?</h3>
      <p>
        Without coordination, each 401 triggers a separate refresh call, potentially invalidating each other
        if refresh token rotation is enabled. The solution: maintain a boolean <code>isRefreshing</code> flag
        and a <code>refreshSubscribers</code> queue. When the first 401 arrives, set isRefreshing = true and
        call the refresh endpoint. Subsequent 401s add their retry callbacks to the queue instead of calling
        refresh again. When the refresh succeeds, flush the queue by calling each callback with the new token.
        If refresh fails, clear the queue with an error and redirect to login.
      </p>

      <h3>Q4: How would you implement enterprise SSO for a multi-tenant SaaS app?</h3>
      <p>
        Store a tenant IdP configuration table: <code>&#123;domain: "acme.com", type: "saml", metadata_url: "...", idp_entity_id: "..."&#125;</code>.
        On login, extract the email domain and look up the tenant config. For SAML: generate a SAMLRequest,
        redirect to the IdP SSO URL. Implement an ACS endpoint that validates the SAMLResponse signature
        using the IdP's certificate, extracts attributes, performs JIT provisioning if new user, and
        establishes a session. For OIDC: use the tenant's client_id and authorization_endpoint from their
        discovery document. Abstract behind an AuthStrategy interface so the login page is IdP-agnostic.
        Map IdP groups to app roles in a configuration layer — do not hardcode.
      </p>

      <h3>Q5: Design the token refresh architecture for a Next.js app with SSR and client components.</h3>
      <p>
        The challenge: server-rendered pages need a valid access token to fetch data, but access tokens
        live in-memory client-side. Solution: store the refresh token in an httpOnly cookie accessible
        server-side. In Next.js middleware (runs on every request), check if the session cookie is present
        and valid. If the access token has expired (check a short-lived session cookie or a signed JWT
        containing the exp), call the token endpoint server-side to get a fresh access token. Attach the
        new access token to the request headers so server components can use it for data fetching. Set
        a new short-lived cookie with the new token's exp. On the client side, use the AuthProvider to
        initialize token state from the /auth/me endpoint on mount. The BFF approach cleanly separates
        concerns: Next.js middleware handles SSR tokens, the client AuthProvider handles SPA token state,
        and both ultimately rely on the same httpOnly refresh token cookie.
      </p>

      <h3>Q6: What are the security implications of using "Sign in with Google" on a website that also has email/password auth?</h3>
      <p>
        Account takeover via email collision: if a user registers with email/password using email A, then
        later signs in with Google using the same email A, and your system links accounts by email, an
        attacker who controls the Google account for email A can take over the password account. Mitigations:
        (1) Treat each auth method as separate identity — link them explicitly with user confirmation.
        (2) On first Google login, if an email-matched account exists, require the user to verify ownership
        via the existing password before linking. (3) Store a flag indicating which auth methods are linked
        per account. Additional: OAuth tokens from Google don't prove email ownership (the user may have
        changed their Google email). Always re-verify email after linking. Use the IdP's <code>sub</code>
        claim (stable user ID) as the primary identifier, not email.
      </p>
    </ArticleLayout>
  );
}
