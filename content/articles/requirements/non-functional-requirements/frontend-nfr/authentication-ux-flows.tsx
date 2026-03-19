"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-authentication-ux-flows",
  title: "Authentication UX Flows",
  description:
    "Comprehensive guide to authentication UX: login patterns, session management, token refresh, MFA UX, passwordless auth, and secure authentication flows.",
  category: "frontend",
  subcategory: "nfr",
  slug: "authentication-ux-flows",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-15",
  tags: [
    "frontend",
    "nfr",
    "authentication",
    "security",
    "session",
    "mfa",
    "ux",
  ],
  relatedTopics: [
    "secure-client-storage",
    "error-ux-recovery",
    "xss-injection-protection",
  ],
};

export default function AuthenticationUXFlowsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Authentication UX</strong> encompasses how users prove their
          identity and access protected resources. This includes login flows,
          session management, token handling, MFA, password reset, and account
          recovery. Good auth UX balances security with convenience — too much
          friction causes abandonment, too little compromises security.
        </p>
        <p>
          For staff engineers, authentication is both a security and UX
          challenge. Security requires strong passwords, MFA, and session
          limits. UX demands frictionless login, minimal steps, and remembered
          sessions. The right balance depends on risk tolerance and user
          expectations.
        </p>
        <p>
          <strong>Authentication considerations:</strong>
        </p>
        <ul>
          <li>
            <strong>Security:</strong> Token storage, session expiry, MFA,
            brute-force protection
          </li>
          <li>
            <strong>UX:</strong> Login friction, password recovery, session
            persistence, SSO
          </li>
          <li>
            <strong>Compliance:</strong> GDPR, SOC2, HIPAA may dictate auth
            requirements
          </li>
          <li>
            <strong>Accessibility:</strong> Keyboard navigation, screen reader
            support, error messages
          </li>
        </ul>
      </section>

      <section>
        <h2>Login Flow Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Standard Login</h3>
        <p>Email/username and password form.</p>
        <ul className="space-y-2">
          <li>
            <strong>Best practices:</strong> Show/hide password toggle, remember
            me option, clear error messages
          </li>
          <li>
            <strong>Security:</strong> Rate limiting, account lockout, captcha
            after failures
          </li>
          <li>
            <strong>UX:</strong> Auto-focus, enter to submit, social login
            alternatives
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Passwordless Login</h3>
        <p>Magic links or OTP codes instead of passwords.</p>
        <ul className="space-y-2">
          <li>
            <strong>Magic link:</strong> Email with one-time login link
          </li>
          <li>
            <strong>OTP:</strong> SMS or email with verification code
          </li>
          <li>
            <strong>WebAuthn:</strong> Biometric or hardware key authentication
          </li>
          <li>
            <strong>Pros:</strong> No passwords to remember, phishing-resistant
            (WebAuthn)
          </li>
          <li>
            <strong>Cons:</strong> Email/SMS dependency, slower than password
            for returning users
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Social Login (OAuth)
        </h3>
        <p>Login with Google, GitHub, Microsoft, etc.</p>
        <ul className="space-y-2">
          <li>
            <strong>Pros:</strong> No new password, faster signup, verified
            email
          </li>
          <li>
            <strong>Cons:</strong> Dependency on provider, privacy concerns,
            account linkage complexity
          </li>
          <li>
            <strong>Best practice:</strong> Offer as alternative, not
            replacement for email/password
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Multi-Factor Authentication (MFA)
        </h3>
        <p>Additional verification beyond password.</p>
        <ul className="space-y-2">
          <li>
            <strong>SMS codes:</strong> Common but vulnerable to SIM swapping
          </li>
          <li>
            <strong>Authenticator apps:</strong> TOTP codes (Google
            Authenticator, Authy) — more secure
          </li>
          <li>
            <strong>Hardware keys:</strong> YubiKey, Touch ID — most secure
          </li>
          <li>
            <strong>Backup codes:</strong> One-time use codes for account
            recovery
          </li>
          <li>
            <strong>UX:</strong> Make MFA setup easy, provide backup options,
            remember trusted devices
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/auth-flow-patterns.svg"
          alt="Authentication Flow Patterns"
          caption="Authentication flow patterns — standard login, passwordless, social login, and MFA flows"
        />
      </section>

      <section>
        <h2>Session Management</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Token-Based Authentication
        </h3>
        <p>JWT or opaque tokens issued on login, sent with each request.</p>
        <ul className="space-y-2">
          <li>
            <strong>Access tokens:</strong> Short-lived (15-60 minutes), used
            for API calls
          </li>
          <li>
            <strong>Refresh tokens:</strong> Long-lived, used to obtain new
            access tokens
          </li>
          <li>
            <strong>Storage:</strong> Access token in memory, refresh token in
            HttpOnly cookie
          </li>
          <li>
            <strong>Rotation:</strong> Issue new refresh token on each use
            (detect reuse attacks)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Expiry</h3>
        <ul className="space-y-2">
          <li>
            <strong>Absolute expiry:</strong> Session ends after fixed time (24
            hours, 7 days)
          </li>
          <li>
            <strong>Idle expiry:</strong> Session ends after inactivity (15
            minutes, 1 hour)
          </li>
          <li>
            <strong>Sliding expiry:</strong> Session extends with activity, up
            to maximum
          </li>
          <li>
            <strong>UX:</strong> Warn before expiry, offer &quot;stay logged
            in&quot;, auto-save work
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Token Refresh Patterns
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Silent refresh:</strong> Refresh before expiry without user
            action
          </li>
          <li>
            <strong>Refresh on 401:</strong> Catch expired token, refresh, retry
            original request
          </li>
          <li>
            <strong>Refresh queue:</strong> Queue requests during refresh,
            process after
          </li>
          <li>
            <strong>Concurrent request handling:</strong> Single refresh for
            multiple simultaneous 401s
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Logout</h3>
        <ul className="space-y-2">
          <li>Invalidate tokens server-side (add to blocklist)</li>
          <li>Clear client storage (cookies, localStorage)</li>
          <li>Clear application state (Redux, Zustand)</li>
          <li>Redirect to login or home page</li>
          <li>Consider &quot;logout everywhere&quot; for sensitive apps</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/token-refresh-flow.svg"
          alt="Token Refresh Flow"
          caption="Token refresh patterns — silent refresh, refresh on 401, and concurrent request handling"
        />
      </section>

      <section>
        <h2>Authentication UX Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Login Form UX</h3>
        <ul className="space-y-2">
          <li>Auto-focus first field (email/username)</li>
          <li>Allow enter key to submit</li>
          <li>Show/hide password toggle</li>
          <li>
            Clear, specific error messages (&quot;Invalid email&quot; not
            &quot;Login failed&quot;)
          </li>
          <li>
            Don&apos;t reveal if email exists (use generic &quot;Invalid
            credentials&quot;)
          </li>
          <li>Provide &quot;Forgot password?&quot; link</li>
          <li>Show social login alternatives</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Password Requirements
        </h3>
        <ul className="space-y-2">
          <li>Show requirements before user types (not after failure)</li>
          <li>Real-time validation with clear indicators</li>
          <li>
            Use NIST guidelines: 8+ characters, no arbitrary complexity rules
          </li>
          <li>Check against breached passwords (Have I Been Pwned API)</li>
          <li>Allow paste (password managers need this)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Password Recovery</h3>
        <ul className="space-y-2">
          <li>Simple, accessible flow from login page</li>
          <li>Email with reset link (not password reset on page)</li>
          <li>Time-limited links (1 hour expiry)</li>
          <li>Single-use links (invalidate after use)</li>
          <li>Confirmation after successful reset</li>
          <li>
            Security email notification (&quot;Your password was changed&quot;)
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Remember Me / Stay Logged In
        </h3>
        <ul className="space-y-2">
          <li>
            Clear checkbox label (&quot;Keep me logged in for 30 days&quot;)
          </li>
          <li>Longer session with refresh tokens</li>
          <li>Still require MFA for sensitive actions</li>
          <li>Allow users to see/revoke active sessions</li>
          <li>Consider device fingerprinting for security</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Account Lockout</h3>
        <ul className="space-y-2">
          <li>Lock after N failed attempts (5-10)</li>
          <li>Progressive delays (1 min, 5 min, 15 min)</li>
          <li>Captcha before lockout (distinguish humans from bots)</li>
          <li>Email notification of lockout</li>
          <li>Clear unlock instructions (wait time or password reset)</li>
        </ul>
      </section>

      <section>
        <h2>Protected Routes</h2>
        <p>Handling authentication state for protected pages.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Auth Guard Pattern</h3>
        <ul className="space-y-2">
          <li>Check auth state before rendering protected route</li>
          <li>Redirect to login if unauthenticated</li>
          <li>Preserve intended destination for post-login redirect</li>
          <li>Show loading state during auth check</li>
          <li>Handle race conditions (auth check vs route change)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Role-Based Access</h3>
        <ul className="space-y-2">
          <li>Check user role/permissions for route access</li>
          <li>Show &quot;Access Denied&quot; for insufficient permissions</li>
          <li>Hide navigation items user can&apos;t access</li>
          <li>Server-side validation (client checks are UX only)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Auth State Management
        </h3>
        <ul className="space-y-2">
          <li>Store user info in global state (Context, Zustand)</li>
          <li>Track loading, authenticated, unauthenticated states</li>
          <li>Handle token refresh transparently</li>
          <li>Sync logout across tabs (storage events)</li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/auth-guard-flow.svg"
          alt="Auth Guard Flow"
          caption="Protected route handling — auth check, redirect logic, and post-login destination preservation"
        />
      </section>

      <section>
        <h2>Security Considerations</h2>
        <ul className="space-y-3">
          <li>
            <strong>HTTPS everywhere:</strong> Never transmit credentials over
            HTTP
          </li>
          <li>
            <strong>HttpOnly cookies:</strong> Store tokens in HttpOnly cookies,
            not localStorage
          </li>
          <li>
            <strong>CSRF protection:</strong> CSRF tokens for state-changing
            operations
          </li>
          <li>
            <strong>Rate limiting:</strong> Prevent brute-force attacks on login
            endpoint
          </li>
          <li>
            <strong>Secure password reset:</strong> Time-limited, single-use
            tokens
          </li>
          <li>
            <strong>Session enumeration:</strong> Don&apos;t reveal if email
            exists
          </li>
          <li>
            <strong>XSS prevention:</strong> CSP, input sanitization to protect
            tokens
          </li>
          <li>
            <strong>Logout propagation:</strong> Clear all tabs when user logs
            out
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Key Insight for Interviews</h3>
          <p>
            In staff engineer interviews, the correct answer for token storage
            is HttpOnly cookies (not localStorage). Explain the XSS risk with
            localStorage. For session management, discuss token rotation,
            refresh patterns, and handling concurrent requests. Demonstrate
            understanding of the security vs UX trade-off in MFA, session
            expiry, and password requirements.
          </p>
        </div>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle token refresh in a React app?
            </p>
            <p className="mt-2 text-sm">
              A: Store access token in memory, refresh token in HttpOnly cookie.
              Intercept 401 responses, call refresh endpoint, retry original
              request with new token. Handle concurrent requests — queue them
              during refresh, process all after. Use React Query or custom axios
              interceptor for automatic handling.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the difference between MFA and 2FA?
            </p>
            <p className="mt-2 text-sm">
              A: 2FA is two factors (password + code). MFA is multiple factors
              (could be 2 or more). Factors are: something you know (password),
              something you have (phone, hardware key), something you are
              (biometric). SMS codes are 2FA but vulnerable. Authenticator apps
              or hardware keys are more secure MFA.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you protect against brute-force attacks?
            </p>
            <p className="mt-2 text-sm">
              A: Rate limiting on login endpoint (N attempts per minute per
              IP/email). Account lockout after N failures. Captcha after
              suspicious activity. Progressive delays between attempts. Monitor
              for distributed attacks (same password across accounts). Alert
              users of suspicious login attempts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle &quot;remember me&quot; securely?
            </p>
            <p className="mt-2 text-sm">
              A: Issue long-lived refresh token (30 days) stored in HttpOnly
              cookie. Access token still short-lived (1 hour). Allow users to
              see/revoke active sessions. Require MFA for sensitive actions even
              with remember me. Consider device fingerprinting. Clear tokens on
              password change.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s your password reset flow?
            </p>
            <p className="mt-2 text-sm">
              A: User enters email on reset page. Send email with time-limited
              (1 hour), single-use reset link. Link opens reset form with token
              validated server-side. User enters new password. Invalidate all
              existing sessions (security measure). Send confirmation email
              (&quot;Your password was changed&quot;). Log the password change
              event.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — Session Management Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://webauthn.guide/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WebAuthn.guide — Passwordless Authentication
            </a>
          </li>
          <li>
            <a
              href="https://www.nist.gov/itl/applied-cybersecurity/tig/passwords"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIST — Password Guidelines
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
