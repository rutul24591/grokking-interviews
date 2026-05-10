"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-secure-token-storage-ux",
  title: "Secure Token Storage UX System",
  description: "Designing secure storage and management of authentication tokens with protection against XSS and CSRF while maintaining seamless user experience.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "secure-token-storage-ux",
  wordCount: 5400,
  readingTime: 32,
  lastUpdated: "2026-05-05",
  tags: ["lld", "security", "tokens", "storage", "ux", "auth", "xss", "csrf"],
  relatedTopics: ["login-session-management", "password-reset-system", "route-component-access-guard"],
};

export default function SecureTokenStorageUXArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>After login, a web app receives an authentication token (JWT, session token). This token is required for all subsequent API requests to identify the user. But where should the token be stored? The naive choice—localStorage—works until an attacker injects malicious JavaScript via XSS. The injected script reads localStorage, steals the token, and makes API requests as the user. The attacker silently drains the user's bank account or deletes critical data.</p>
        <p>The challenge is balancing security and UX. Maximum security would store tokens only in server memory (no client-side storage), but this requires fetching the token from server on every page reload, adding latency. Typical web apps must persist tokens across page reloads (users close tabs, refresh pages, and expect to stay logged in). But persistence on the client opens attack vectors: XSS (JavaScript steals token from storage), CSRF (attacker tricks user into making requests from another site), or cookie theft (attacker intercepts HTTP traffic).</p>
        <p>Multiple storage mechanisms exist, each with trade-offs. localStorage: accessible to JavaScript, persists across tab close, but vulnerable to XSS. sessionStorage: same as localStorage but cleared when tab closes. HttpOnly cookies: inaccessible to JavaScript (safe from XSS), sent automatically with requests (convenient), but vulnerable to CSRF. Memory-only: safest (XSS can't steal what's not stored), but lost on refresh (poor UX).</p>
        <p>Real-world solution: HttpOnly cookies for storage (XSS-safe, automatic), combined with CSRF tokens (separate, non-HttpOnly token that must be included in request body/header). Silent refresh (automatically refresh token before expiry) keeps users logged in without forcing re-login. Error handling gracefully degrades to re-login if token is lost.</p>
        <p><strong>Explicit assumptions:</strong> Server issues unique tokens on login. Tokens can be revoked (blacklist or expiry). App makes authenticated API requests (includes token). Attackers may inject JavaScript (XSS) or trick browsers into cross-site requests (CSRF). Users expect to stay logged in across reloads. HTTPS is available (secure transmission).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Secure Token Storage:</strong> Store authentication token (JWT or session token) safely after login, protected from XSS and CSS attacks. Token must be persistent (survive page reloads) and automatically included in subsequent API requests.</li>
          <li><strong>Token Retrieval:</strong> Token is automatically sent with API requests (via HTTP headers or cookies). No manual JavaScript access needed (reduces XSS surface). Token is accessible to network layer (fetch, axios) but not to JavaScript directly.</li>
          <li><strong>Token Cleanup on Logout:</strong> On user logout, immediately clear the token (remove cookie, blacklist JWT, or delete from storage). Ensure no residual auth state remains. Follow-up request should return 401 Unauthorized.</li>
          <li><strong>Silent Token Refresh:</strong> Before token expires, automatically refresh (obtain new token from server) without user action. If access token expires in 15 minutes, refresh at 14-minute mark to avoid interruption. User should never see "session expired" messages during normal usage.</li>
          <li><strong>Token Expiry Handling:</strong> If access token expires (backend returns 401), automatically attempt refresh. If refresh succeeds, retry the original request. If refresh fails (refresh token also expired), redirect to login. User sees seamless experience (not even aware of token expiry).</li>
          <li><strong>Multi-Token Support:</strong> App may need multiple tokens (access token for main API, API key for third-party service, OAuth token for social login). Each token is stored securely and refreshed independently. Provide separate storage/retrieval for each.</li>
          <li><strong>CSRF Protection:</strong> Include CSRF token in request headers or body to prevent cross-site request forgery. CSRF token is separate from auth token and sent with sensitive requests (POST, PUT, DELETE).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Security Against XSS:</strong> Token must be inaccessible to injected JavaScript code (XSS). HttpOnly cookies cannot be read by JavaScript, making them safe. localStorage is vulnerable (XSS can read it). Never store sensitive tokens in localStorage.</li>
          <li><strong>Security Against CSRF:</strong> Prevent attackers from tricking users into making unauthorized requests from other sites. HttpOnly cookies are sent automatically, making them vulnerable to CSRF. Mitigate with CSRF tokens (separate, must be explicitly included in request body/header).</li>
          <li><strong>Privacy and Secrecy:</strong> Token values should never be logged, printed, or exposed in developer tools (at least not in a readable way). Avoid logging "Authorization: Bearer [token]" in console. Mask tokens in logs or use non-HttpOnly cookies for CSRF tokens (they're expected to be visible).</li>
          <li><strong>Availability and Persistence:</strong> Token persists across page reloads, browser tabs, and reasonable time periods (hours/days depending on token type). User should not need to re-login frequently. Silent refresh keeps sessions alive transparently.</li>
          <li><strong>Transparency and Trust:</strong> Users should understand token expiry behavior. Show loading states during silent refresh (optional, but improves UX). If forced re-login required, show clear message: "Your session expired. Please log in again."</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The recommended architecture uses three components: HttpOnly cookies for auth tokens, separate CSRF protection, and automatic token refresh.</p>
        <p>Layer 1 (Storage): On login, server sends a Set-Cookie header with the auth token (HttpOnly, Secure, SameSite attributes). The browser stores this cookie in its cookie jar (not accessible to JavaScript). On subsequent requests, the browser automatically includes this cookie in the Authorization header or as a Cookie header. The token is never exposed to JavaScript, preventing XSS theft.</p>
        <p>Layer 2 (CSRF Protection): HttpOnly cookies are sent automatically by the browser, making them vulnerable to CSRF attacks (attacker website tricks browser into sending request). Mitigate by requiring a CSRF token (stored in non-HttpOnly cookie or localStorage). For sensitive operations (POST, PUT, DELETE), the CSRF token must be explicitly included in request header (X-CSRF-Token) or body. Attacker's cross-site request can't include the CSRF token (browser blocks access), so the attack fails.</p>
        <p>Layer 3 (Refresh): Access tokens are short-lived (15-30 minutes). Before expiry, automatically refresh (client periodically polls token/refresh endpoint or server pushes expiry notification). On refresh, server issues new access token. User never experiences interrupted session due to token expiry. If tokens do expire (unlikely with proper refresh), automatically redirect to login with clear message.</p>
        <p>Error handling: if API returns 401 (unauthorized), attempt refresh. If refresh succeeds, retry the original request. If refresh fails, logout user (token is truly invalid). If network error during refresh, retry with exponential backoff or queue request for later.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/auth-user-systems/secure-token-storage-ux.svg"
          alt="Token storage comparison, recommended two-token pattern with memory and httpOnly cookie, XSS and CSRF mitigations, and token rotation"
          caption="Token storage comparison, recommended two-token pattern with memory and httpOnly cookie, XSS and CSRF mitigations, and token rotation"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Storage Mechanism Comparison</h3>
        <p>Multiple storage mechanisms are available, each with trade-offs. HttpOnly cookies: securely stored by browser, cannot be read by JavaScript (XSS-safe), sent automatically with requests (convenient), but vulnerable to CSRF (browser sends them automatically). localStorage: accessible to JavaScript (XSS-vulnerable), not sent automatically (must manually include in request header), persists indefinitely, cross-domain accessible. sessionStorage: similar to localStorage but cleared when tab closes, still XSS-vulnerable. Memory-only: safest against XSS (attacker can't steal from memory... but can still make requests using the token), but lost on page reload (inconvenient UX, users expect to stay logged in).</p>
        <p>Recommended: HttpOnly cookies for authentication tokens. This is the industry standard (Google, Microsoft, AWS use it). XSS cannot steal the token. CSRF is addressed separately with CSRF tokens. Token is sent automatically with requests, requiring no JavaScript code. User stays logged in across reloads naturally.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">HttpOnly Cookie Configuration</h3>
        <p>Setting a cookie securely requires specific attributes. Set-Cookie header sent by server includes: Name=Value; HttpOnly; Secure; SameSite=Strict; Domain=example.com; Path=/; Max-Age=900.</p>
        <p>HttpOnly flag: prevents JavaScript from accessing the cookie (document.cookie returns nothing for this cookie). This is the critical flag that prevents XSS theft. Without it, a single line of injected JavaScript (document.cookie) steals all non-HttpOnly tokens.</p>
        <p>Secure flag: cookie sent only over HTTPS, not HTTP. Prevents network eavesdropping (attacker on public WiFi can't intercept the cookie). Always use for authentication tokens.</p>
        <p>SameSite flag: restricts when cookie is sent in cross-site requests. SameSite=Strict: cookie sent only in same-site requests (not in cross-site navigations). SameSite=Lax: cookie sent in top-level cross-site navigations (user clicks link to example.com) but not in cross-site form submissions (attacker's hidden form). SameSite=None: cookie sent in all requests (least secure, only use if needed for cross-site). SameSite=Strict is optimal for CSRF protection.</p>
        <p>Domain: cookie sent to this domain and subdomains. Set to "example.com" (sent to example.com and *.example.com) or "api.example.com" (sent only to api.example.com). Prevents cookie leakage to unrelated subdomains.</p>
        <p>Path: cookie sent to paths under this prefix. Set to "/" (app-wide) or "/api" (only API requests). Usually "/" for auth tokens.</p>
        <p>Max-Age or Expires: cookie lifetime. Access tokens typically 15-30 minutes (short-lived, limits exposure if stolen). Refresh tokens typically 7 days (longer-lived, allows user to stay logged in). After Max-Age seconds, browser deletes the cookie automatically. Server can also delete by setting Max-Age=0.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">CSRF Token and Double-Submit Pattern</h3>
        <p>HttpOnly cookies are sent automatically by the browser, making them vulnerable to CSRF. Attacker.com renders an invisible form that POSTs to bank.example.com/transfer?amount=1000. Because the user is logged in (cookie is set), the browser sends the auth cookie, and the request succeeds (attacker's form was accepted as if the user submitted it).</p>
        <p>Mitigate with CSRF tokens (also called synchronizer tokens). The server generates a unique token, includes it in an HTML form. When user submits the form, the token is sent in the request body (or header). The server verifies: does the token in the request match the token in the session? Attacker's cross-site form can't include the token (browser blocks cross-site access to tokens), so the request fails.</p>
        <p>CSRF token storage: store in a non-HttpOnly cookie (accessible to JavaScript, needed for form submission). On page load, fetch CSRF token (either from a separate endpoint or embedded in HTML). When making a POST request, include CSRF token in header (X-CSRF-Token) or form body. Server verifies token matches the session.</p>
        <p>Alternatively, use SameSite=Strict cookies (which prevent CSRF mostly) and combine with additional checks (Origin header validation, double-submit cookies). Modern browsers support SameSite, but older browsers don't, so explicit CSRF tokens are more reliable.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Refresh and Silent Refresh Strategy</h3>
        <p>Access tokens are short-lived (15-30 minutes) to limit damage if stolen. But users shouldn't be forced to re-login when the token expires. Solution: refresh tokens and silent refresh.</p>
        <p>A refresh token is a longer-lived token (7 days, 30 days) used only to obtain new access tokens. On login, server returns both access token and refresh token. Access token goes in HttpOnly cookie (short-lived). Refresh token goes in a separate HttpOnly cookie or secure storage (longer-lived).</p>
        <p>Before access token expires (or when API returns 401), call refresh endpoint: POST /auth/refresh (include refresh token). Server verifies refresh token is valid, issues new access token, returns it. Client updates the access token cookie. On success, retry the original request with the new access token.</p>
        <p>Silent refresh runs proactively: when app loads, check if access token expires soon (within 1 minute). If yes, refresh now. This is "silent" because user doesn't know it happened. Alternatively, reactive refresh: on 401 response, refresh immediately.</p>
        <p>Refresh token rotation (optional): each refresh returns a new refresh token. Old refresh token is invalidated. This limits the window if a refresh token is stolen (attacker can only refresh once before the token is invalidated). Slightly more complex but better security.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Logout and Token Cleanup</h3>
        <p>On logout, immediately invalidate all tokens. Clear the auth cookie: set Set-Cookie with Max-Age=0 or Expires in the past. Browser deletes the cookie. Subsequent requests don't include the cookie, so authentication fails.</p>
        <p>Backend also invalidates the token: add JWT to blacklist (fast lookup: Redis), or for session tokens, delete the session record from database. This prevents attackers from using stolen tokens (if token was somehow leaked). Even if a session cookie is stolen, calling /auth/logout invalidates it.</p>
        <p>Clear refresh tokens too: set refresh token cookie Max-Age=0. Delete refresh token from backend storage (if tokens are stored server-side).</p>
        <p>Clear client-side state: remove cached user data, tokens from memory. Some frameworks cache auth state in global store; flush it on logout.</p>
        <p>Redirect to login page after logout, with message: "You have been logged out."</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multi-Token and Multi-API Support</h3>
        <p>Apps may need multiple tokens: access token for main API, OAuth token for Google/GitHub login, API keys for third-party services. Store each separately with appropriate security.</p>
        <p>Main access token: HttpOnly cookie (most secure). OAuth tokens from providers: may need to store server-side (app acts as OAuth client, exchanges authorization code for token, stores server-side, never exposes to client). Third-party API keys: usually stored server-side or in backend config (not in frontend).</p>
        <p>If frontend needs a third-party token (rare), treat it like a CSRF token: store in non-HttpOnly cookie or memory, include in requests. Accept the XSS risk if it's a read-only token without sensitive operations.</p>
        <p>Refresh multiple tokens: each token may have different expiry. Proactively refresh based on earliest expiry. On 401, determine which token expired, refresh it, retry. Complex but ensures seamless experience.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Comprehensive Error Handling</h3>
        <p>Token expired (API returns 401): attempt refresh. POST /auth/refresh with refresh token. If refresh succeeds (status 200), update access token cookie, retry original request. If refresh fails (401 or 403), refresh token is also invalid (both tokens expired). Force logout: redirect to login with message "Session expired. Please log in again."</p>
        <p>Network error during refresh: exponential backoff (retry after 1s, 2s, 4s). After max retries (5-10), redirect to login. Don't hang the user indefinitely.</p>
        <p>Invalid token (server rejects even after refresh): clear tokens, redirect to login. This suggests logout was called or tokens were revoked server-side.</p>
        <p>Cookies disabled: rare, but if cookies don't work, fall back to Authorization header (requires manual token management, less secure but functional). Detect this on first login, warn user: "Cookies are disabled. Some features may not work."</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Developer Tools and Debugging Security</h3>
        <p>HttpOnly cookies are hidden from JavaScript and browser developer tools. In the Network tab, you can see the Set-Cookie header in the response, but you can't read the cookie value from the Console (document.cookie doesn't show it). This is intentional: protects tokens from accidental leakage in screenshots, shared devtools, or user confusion.</p>
        <p>For debugging, log that a request was made and was authenticated (without logging the token itself). Example: "API request to GET /user (authenticated)" is safe to log. "Authorization: Bearer [super-secret-token-value]" is dangerous (if logs are shared or accidentally exposed, attackers have the token).</p>
        <p>CSRF token is non-HttpOnly, so it's visible in devtools. This is safe: CSRF tokens are designed to be visible and specific to each session (attacker can't forge them without accessing the page). Don't treat CSRF tokens with the same secrecy as auth tokens.</p>
        <p>Content Security Policy (CSP) headers prevent inline scripts, mitigating many XSS attacks. Combine with HttpOnly cookies for defense in depth: even if XSS manages to execute, it can't read the tokens.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p><strong>Security vs Simplicity:</strong> HttpOnly cookies are more secure (XSS-safe) but require CSRF protection and refresh token logic (more backend complexity). localStorage is simpler (no CSRF needed, auto-included in fetch requests) but XSS-vulnerable. The extra complexity of HttpOnly cookies is worth the security gain (XSS is common, CSRF is manageable).</p>
        <p><strong>UX vs Security Friction:</strong> Silent refresh (proactive, automatic) provides seamless experience but uses extra bandwidth (refresh calls even if user doesn't make requests). Manual "session expired, please re-login" is simpler (no refresh calls) but poor UX. Silent refresh wins for modern apps where user retention matters.</p>
        <p><strong>Token Lifetime vs Risk:</strong> Shorter-lived tokens (5 minutes) reduce window if stolen but require more refresh calls. Longer-lived tokens (1 hour) reduce overhead but increase exposure. Standard is 15-30 minutes for access tokens, 7 days for refresh tokens. Adjust based on risk tolerance (security-critical apps: shorter; convenience-focused: longer).</p>
        <p><strong>Refresh Token Storage:</strong> Where to store refresh tokens? HttpOnly cookie (most secure) but persistent across domains (risk). Separate HttpOnly cookie with different domain/path (better isolation) or server-side session storage (no client-side token at all, backend manages it). Each approach trades security, complexity, and portability.</p>
        <p><strong>Performance Overhead:</strong> Every request includes the auth cookie (minimal overhead). Refresh calls add periodic requests (silent refresh every 5 minutes = 288 requests/day per user). Acceptable but noticeable. Optimize: refresh only if token will expire soon (proactive), not every request.</p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: HttpOnly Cookies with CSRF Tokens</h3>
        <p>Backend sets auth token as HttpOnly cookie on login. Also generates CSRF token in non-HttpOnly cookie or returned in response. Frontend includes CSRF token in request header (X-CSRF-Token) for sensitive operations. Simple, secure, and widely used.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Access Token + Refresh Token with Silent Refresh</h3>
        <p>Access token in HttpOnly cookie (short-lived, 15 min). Refresh token in separate HttpOnly cookie (longer-lived, 7 days). On app load, check if access token expires soon. If yes, refresh (POST /auth/refresh). On 401, also refresh. This ensures seamless experience without constant re-login.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Secure Axios/Fetch Interceptor</h3>
        <p>Create HTTP interceptor that automatically handles token refresh. On 401 response, intercept, call refresh, retry request with new token. Transparent to components—they don't know about token expiry. Simplifies application code.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 4: Multi-Tab Logout Synchronization</h3>
        <p>When user logs out in one tab, other tabs should also logout. Use storage event listener: when tab A clears localStorage, tab B detects event and clears its auth state. Or use shared worker to broadcast logout event to all tabs.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Secure token storage is critical for app security. The recommended architecture uses HttpOnly, Secure, SameSite cookies for auth tokens (XSS-safe, automatic transmission), separate CSRF tokens (non-HttpOnly, included in request headers), and silent refresh (proactive token refresh before expiry). Access tokens are short-lived (15-30 minutes), refresh tokens longer-lived (7 days), enabling seamless user experience without forcing re-login. Multiple storage mechanisms exist (HttpOnly cookies, localStorage, sessionStorage, memory), but HttpOnly cookies are the industry standard for sensitive tokens. Essential patterns include: proper cookie configuration (HttpOnly, Secure, SameSite=Strict), CSRF token validation on sensitive requests, automatic refresh on 401 or before expiry, and comprehensive error handling (refresh failure → logout). Security principles: never store sensitive tokens in localStorage, never log token values, always transmit over HTTPS, clear cookies on logout (set Max-Age=0), implement Content Security Policy to mitigate XSS, and always verify tokens server-side (never trust client-side token state). Real-world systems (Google, GitHub, AWS) use HttpOnly cookies with CSRF tokens and proactive refresh. For best results, implement silent refresh (user unaware of token expiry), handle network errors gracefully (exponential backoff), support multi-tab logout (broadcast logout event), and provide clear error messages (session expired, require re-login). Token storage is a critical security layer—implementation errors expose all user accounts to compromise.</p>
      </section>
    </ArticleLayout>
  );
}
