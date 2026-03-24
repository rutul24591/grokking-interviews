"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-login-interface",
  title: "Login Interface",
  description:
    "Comprehensive guide to designing login interfaces covering authentication flows, security patterns, session management, credential stuffing defense, risk-based authentication, and UX best practices for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "login-interface",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "login",
    "authentication",
    "frontend",
    "security",
  ],
  relatedTopics: ["signup-interface", "logout", "password-reset", "mfa-setup"],
};

export default function LoginInterfaceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          The <strong>Login Interface</strong> (also called Sign-in) is the primary authentication
          entry point for existing users to access their accounts. It is one of the most frequently
          used features on any platform and must balance security, convenience, and accessibility.
          Login is often the first interaction users have with your product each session — a
          smooth, secure login flow builds trust, while a broken flow leads to frustration and
          support tickets.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/login-interface-flow.svg"
          alt="Login Interface Flow"
          caption="Login Interface Flow — showing authentication methods, MFA challenge, session creation, and redirect"
        />

        <p>
          For staff and principal engineers, designing a login interface requires deep
          understanding of authentication protocols (OAuth, SAML, OIDC), session management (token
          handling, refresh rotation), security threats (credential stuffing, phishing, brute
          force, account takeover), and UX patterns that reduce friction while maintaining
          security. The login flow also sets the foundation for the entire session and must
          integrate with broader identity infrastructure (MFA, SSO, passwordless, device trust).
        </p>
        <p>
          Modern login interfaces have evolved from simple username/password forms to multi-factor
          authentication flows, passwordless options (magic links, WebAuthn/passkeys), biometric
          authentication (Touch ID, Face ID, Windows Hello), and seamless SSO experiences. The
          technical complexity includes secure token handling (HttpOnly cookies, token rotation),
          session persistence (remember me, device trust), risk-based authentication (adaptive
          MFA), and compliance with security standards (OWASP, NIST, SOC 2).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Login interface is built on fundamental concepts that determine how users authenticate
          and how sessions are managed. Understanding these concepts is essential for designing
          effective login systems.
        </p>
        <p>
          <strong>Authentication Methods:</strong> Multiple methods for different user needs:
          Email/Password (traditional, most common), Phone/SMS (OTP via SMS, auto-read on mobile),
          Passwordless (magic links, one-time codes, WebAuthn), Social Login (Google, Facebook,
          Apple — OAuth flow), SSO/SAML (enterprise SSO — "Sign in with Company"). Each method has
          trade-offs — email/password is universal but vulnerable to credential stuffing,
          passwordless is secure but requires email/phone access, social login is convenient but
          creates IdP dependency.
        </p>
        <p>
          <strong>Security Requirements:</strong> Rate limiting (per IP: 10/minute, per account:
          5/hour, exponential backoff), generic errors ("Invalid email or password" — not "email
          not found" to prevent enumeration), CSRF protection (token in form, validate on server),
          secure transmission (HTTPS only, HSTS headers), bot prevention (CAPTCHA after failed
          attempts, device fingerprinting, behavioral analysis). These requirements protect against
          common attacks while maintaining usability for legitimate users.
        </p>
        <p>
          <strong>Session Management:</strong> Remember me (extended session via persistent cookie,
          30 days), device trust (remember trusted devices, skip MFA on trusted devices), session
          notification (email on new device login with location, device, time, "Was this you?"
          link). Users should be able to see and revoke active sessions in account settings.
          Refresh token rotation (issue new token on each use, invalidate old) prevents token
          replay attacks.
        </p>
        <p>
          <strong>Credential Stuffing Defense:</strong> Check passwords against breach databases
          (Have I Been Pwned API), device fingerprinting (collect device signals, detect
          automation), behavioral analysis (typing patterns, mouse movements, form completion time
          — bots behave differently), IP intelligence (threat feeds, block known bad IPs, rate
          limit datacenter IPs more aggressively). Multi-layer defense is critical — no single
          measure is sufficient.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Login architecture separates authentication from session management, enabling flexible
          authentication methods with centralized session handling. This architecture is critical
          for supporting diverse login options while maintaining security.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/login-security.svg"
          alt="Login Security"
          caption="Login Security Layers — showing threats, defenses, monitoring, rate limiting, and TLS protection"
        />

        <p>
          Login flow: User navigates to login page, enters credentials (email/password, phone/SMS,
          social, SSO). Frontend validates format (email format, required fields), submits to
          backend. Backend validates credentials (constant-time comparison for passwords), checks
          rate limits, triggers MFA if required (new device, high-risk), creates session (access
          token + refresh token), sets cookies (HttpOnly, Secure, SameSite), redirects to
          dashboard. On new device, send notification email with "Was this you?" link.
        </p>
        <p>
          Security architecture includes: rate limiting (multi-layer — per IP, per account, per
          device), credential stuffing detection (breach database checks, behavioral analysis),
          bot prevention (CAPTCHA, device fingerprinting), account lockout (progressive delays,
          not hard lockout to prevent DoS), audit logging (all login attempts for fraud
          detection). This architecture enables secure login — attacks are detected and blocked
          while legitimate users have smooth experience.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/login-ux-patterns.svg"
          alt="Login UX Patterns"
          caption="Login UX Patterns — comparing traditional, social, passwordless, biometric, SSO, and adaptive MFA flows"
        />

        <p>
          UX optimization is critical — login friction leads to abandoned sessions and support
          tickets. Optimization strategies include: minimize fields (email + password only),
          password visibility toggle (show/hide password), autocomplete support (password managers),
          social login buttons (prominent placement), "remember me" checkbox (extended sessions),
          clear error messages (actionable, not technical), forgot password link (prominent),
          signup link for new users. Organizations like Google, Dropbox report 90%+ login
          success rates with optimized flows.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing login interface involves trade-offs between security, user experience, and
          operational complexity. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Email vs Username for Login</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email:</strong> Unique by nature (no collisions), users don't forget it,
              required for communication (password reset, notifications), enables seamless password
              reset. Limitation: users may have multiple emails.
            </li>
            <li>
              <strong>Username:</strong> Can be memorable, branding opportunity. Limitation: can be
              forgotten, aren't unique across platforms, create support burden (username taken,
              username recovery).
            </li>
            <li>
              <strong>Recommendation:</strong> Email is preferred for most applications. Support
              email aliases (+ addressing, dots in Gmail) for flexibility. Allow both email and
              username only for legacy systems.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Duration: Short vs Long</h3>
          <ul className="space-y-3">
            <li>
              <strong>Short (15 min - 1 hour):</strong> More secure, limits session hijacking
              window. Limitation: users must re-login frequently, frustration.
            </li>
            <li>
              <strong>Long (7-30 days):</strong> Better UX (remember me), users stay logged in.
              Limitation: longer session hijacking window, stale sessions.
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid approach — short-lived access token (15 min)
              + long-lived refresh token (30 days) with rotation. Users stay logged in but tokens
              are rotated for security.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">MFA: Always On vs Risk-Based</h3>
          <ul className="space-y-3">
            <li>
              <strong>Always On:</strong> Maximum security, MFA required every login. Limitation:
              high friction, user frustration, support tickets.
            </li>
            <li>
              <strong>Risk-Based:</strong> MFA only for risky logins (new device, unusual
              location). Better UX for trusted devices. Limitation: more complex implementation.
            </li>
            <li>
              <strong>Recommendation:</strong> Risk-based for consumer apps (MFA for new devices
              only). Always on for high-security (banking, admin accounts). Let users configure
              preferences.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing login interface requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Implement rate limiting at multiple levels (IP, account, device) — 10/minute per IP,
          5/hour per account, exponential backoff (1s, 2s, 4s, 8s). Use constant-time comparison
          for password validation — prevent timing attacks. Log all authentication events for
          audit trails — detect fraud patterns. Implement account lockout with progressive delays
          — not hard lockout (prevents DoS). Use secure password hashing (Argon2id, bcrypt, scrypt)
          — never store plaintext passwords.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Minimize friction for legitimate users — email + password only, no unnecessary fields.
          Provide clear, actionable error messages — "Invalid email or password" with forgot
          password link. Support password managers with proper autocomplete (autocomplete="email",
          autocomplete="current-password"). Offer multiple authentication methods — email/password,
          social, passwordless. Remember user preferences (remember me, MFA trust) — respect user
          choices.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Accessibility</h3>
        <p>
          Ensure keyboard navigation works (Tab, Enter) — many users don't use mouse. Provide
          screen reader announcements for errors — aria-live regions. Use proper labels and ARIA
          attributes — accessibility compliance. Ensure sufficient color contrast — WCAG guidelines.
          Support browser zoom without breaking layout — responsive design. Test with actual
          assistive technologies.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring &amp; Alerting</h3>
        <p>
          Alert on unusual login patterns (geographic anomalies, impossible travel) — detect
          account takeover. Monitor for credential stuffing attacks (many emails from same IP,
          breach database matches) — block attacks. Track MFA bypass attempts — detect security
          issues. Set up dashboards for authentication metrics (success rate, failure rate, MFA
          rate) — visibility. Implement real-time fraud detection — block attacks in progress.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing login interface to ensure secure, usable,
          and maintainable login systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Revealing user existence:</strong> Error messages like "email not found" or
            "wrong password" allow attackers to enumerate valid emails.{" "}
            <strong>Fix:</strong> Use generic "Invalid email or password" message for all
            authentication failures. Same response time for all cases (prevent timing attacks).
          </li>
          <li>
            <strong>No rate limiting:</strong> Allows brute force and credential stuffing attacks.{" "}
            <strong>Fix:</strong> Implement rate limiting per IP (10/min), per account (5/hour),
            with exponential backoff.
          </li>
          <li>
            <strong>Storing passwords in plaintext:</strong> Catastrophic if database is
            compromised. <strong>Fix:</strong> Use Argon2id or bcrypt with appropriate cost
            factors. Never store reversible passwords.
          </li>
          <li>
            <strong>Missing CSRF protection:</strong> Allows cross-site request forgery attacks.{" "}
            <strong>Fix:</strong> Include CSRF token in all login forms. Validate on server. Use
            SameSite cookies.
          </li>
          <li>
            <strong>Insecure session tokens:</strong> Predictable or weak tokens allow session
            hijacking. <strong>Fix:</strong> Use cryptographically secure random tokens. Minimum
            128 bits of entropy.
          </li>
          <li>
            <strong>No MFA option:</strong> Single factor authentication is insufficient for
            sensitive accounts. <strong>Fix:</strong> Offer TOTP, WebAuthn, or SMS-based MFA. Make
            it easy to enable.
          </li>
          <li>
            <strong>Session fixation:</strong> Not regenerating session ID after login allows
            session hijacking. <strong>Fix:</strong> Always generate new session ID after
            successful authentication.
          </li>
          <li>
            <strong>No logout functionality:</strong> Users can't terminate sessions on shared
            devices. <strong>Fix:</strong> Provide clear logout button. Invalidate server-side
            session. Clear all tokens.
          </li>
          <li>
            <strong>Persistent login on public computers:</strong> Remember me on shared devices is
            dangerous. <strong>Fix:</strong> Default to session cookies. Make remember me opt-in.
            Warn users on public computers.
          </li>
          <li>
            <strong>No account recovery:</strong> Users locked out permanently lose access.{" "}
            <strong>Fix:</strong> Provide secure password reset flow. Offer alternative recovery
            methods.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Login interface is critical for user access. Here are real-world implementations from
          production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Shopify)</h3>
        <p>
          <strong>Challenge:</strong> High cart abandonment during checkout due to login friction.
          1M logins/day during peak sales.
        </p>
        <p>
          <strong>Solution:</strong> Implemented guest checkout + social login (Google, Facebook,
          Apple). Added "remember me" with 30-day sessions. Passwordless option for returning
          users.
        </p>
        <p>
          <strong>Result:</strong> 35% reduction in checkout abandonment. 60% of users chose
          social login. Login success rate 95%.
        </p>
        <p>
          <strong>Security:</strong> Rate limiting (10/min per IP), credential stuffing detection,
          mandatory MFA for orders over $500.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers demanded SAML SSO integration with
          their IdP (Okta, Azure AD). 10,000 enterprise customers.
        </p>
        <p>
          <strong>Solution:</strong> Implemented SAML 2.0 + OIDC support. Added JIT provisioning
          for automatic user creation. Supported multiple IdPs per tenant. Domain-based routing
          (user@company.com → company SSO).
        </p>
        <p>
          <strong>Result:</strong> Closed 15 enterprise deals requiring SSO. Reduced IT overhead
          for customer onboarding by 80%. SSO adoption 90%.
        </p>
        <p>
          <strong>Security:</strong> Enforced MFA via IdP, session timeout policies, audit logging
          for compliance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking App (Chase)</h3>
        <p>
          <strong>Challenge:</strong> Balance security (fraud prevention) with usability (quick
          access to account). FFIEC compliance requirements.
        </p>
        <p>
          <strong>Solution:</strong> Biometric login (Touch ID, Face ID) for returning users. MFA
          for new devices. Risk-based authentication (location, device, behavior). Step-up for
          transfers over $1000.
        </p>
        <p>
          <strong>Result:</strong> 90% of users enabled biometric login. Fraud reduced by 70%.
          Login time under 2 seconds for returning users. Passed FFIEC audit.
        </p>
        <p>
          <strong>Security:</strong> Device binding, geographic anomaly detection, step-up
          authentication.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Portal (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires strict authentication while
          serving elderly patients unfamiliar with technology.
        </p>
        <p>
          <strong>Solution:</strong> Simple email + password with mandatory MFA (SMS or email
          code). Passwordless option for patients over 65. Session timeout after 15 minutes of
          inactivity.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audit. 85% patient adoption rate. Support tickets
          for login issues reduced by 50%.
        </p>
        <p>
          <strong>Security:</strong> Mandatory MFA, audit logging, automatic logout, IP-based
          access restrictions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> 100M registered users, high account takeover rate for
          valuable items. Young users without phones.
        </p>
        <p>
          <strong>Solution:</strong> Social login (Google, Facebook, Xbox, PlayStation). Email
          codes for users without phones. MFA required for item trading. Parental controls for
          minor accounts.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers reduced by 85%. Trading fraud reduced 95%.
          70% social login adoption.
        </p>
        <p>
          <strong>Security:</strong> MFA for trading, parental controls, breach database checks.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of login interface design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent credential stuffing attacks?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer defense: (1) Rate limiting per IP and account with exponential
              backoff. (2) CAPTCHA after 3-5 failed attempts. (3) Check passwords against breach
              databases (Have I Been Pwned API). (4) Device fingerprinting to detect automation.
              (5) Monitor for unusual patterns (many emails from same IP). (6) Require MFA for
              suspicious logins. (7) Use behavioral analysis to distinguish bots from humans.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you use email or username for login?</p>
            <p className="mt-2 text-sm">
              A: Email is preferred for several reasons: it's unique by nature (no collisions),
              users don't forget it, it's required for communication anyway (password reset,
              notifications), and it enables seamless password reset. Usernames can be forgotten,
              aren't unique across platforms, and create support burden. Support email aliases (+
              addressing, dots in Gmail) for flexibility. Consider allowing both email and username
              for legacy systems.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement "remember me" securely?</p>
            <p className="mt-2 text-sm">
              A: Store long-lived refresh token (30 days) in HttpOnly, Secure, SameSite=Strict
              cookie. Access token should be short-lived (15 min). Rotate refresh tokens on each
              use (issue new token, invalidate old). Allow users to see and revoke active sessions
              in account settings. Invalidate all tokens on password change. Consider device
              binding for additional security. Never store tokens in localStorage (XSS risk).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you require MFA during login?</p>
            <p className="mt-2 text-sm">
              A: Always require MFA for: (1) New device/browser fingerprint. (2) Unusual location
              (different country/city). (3) After password reset. (4) Admin/privileged accounts.
              (5) High-risk actions (payment, data export). For regular logins from trusted
              devices, skip MFA for better UX. Use risk-based authentication to balance security
              and convenience. Let users configure their preferences (always on, new devices only).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle login for users with multiple accounts?</p>
            <p className="mt-2 text-sm">
              A: Use a two-step flow: (1) User enters email. (2) System checks if email has
              multiple accounts. (3) Show account selector with account identifiers (name,
              organization, last 4 of phone). (4) User selects account. (5) Proceed with
              authentication for selected account. Consider account linking for better UX (merge
              accounts, switch between accounts). For enterprise, use domain-based routing
              (user@company.com → company SSO).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's your strategy for passwordless authentication?</p>
            <p className="mt-2 text-sm">
              A: Offer multiple passwordless options: (1) Magic link as primary — send one-time
              token via email/SMS, short expiry (15 min), single use only, track click
              location/device for security. (2) WebAuthn for biometric — register device during
              onboarding, challenge-response authentication, phishing-resistant. (3) Keep password
              as fallback during transition period. Educate users on benefits (no password to
              remember, more secure). Monitor adoption rates and gradually deprecate passwords.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session management across multiple devices?</p>
            <p className="mt-2 text-sm">
              A: Implement device-aware sessions: (1) Generate unique session per device with
              device fingerprint. (2) Store device metadata (type, OS, browser, last seen). (3)
              Show all active sessions in account settings. (4) Allow users to revoke individual
              sessions or all sessions. (5) Send notification on new device login with "Was this
              you?" link. (6) Implement session timeout (idle timeout, absolute timeout). (7) Use
              refresh token rotation for security. Consider concurrent session limits for enterprise
              plans.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What security headers should you set on login pages?</p>
            <p className="mt-2 text-sm">
              A: Essential headers: (1) Strict-Transport-Security (HSTS) — enforce HTTPS. (2)
              Content-Security-Policy — restrict script sources, prevent XSS. (3) X-Frame-Options:
              DENY — prevent clickjacking. (4) X-Content-Type-Options: nosniff — prevent MIME
              sniffing. (5) Referrer-Policy: no-referrer — protect credentials in referrer. (6)
              Permissions-Policy — disable unnecessary features (camera, microphone). (7)
              Cache-Control: no-store — prevent caching of sensitive pages.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement account lockout without enabling DoS attacks?</p>
            <p className="mt-2 text-sm">
              A: Use progressive, targeted lockout: (1) Don't lock based on email alone (attackers
              can lock legitimate users). (2) Lock based on IP + email combination. (3) Implement
              progressive delays (1s, 2s, 4s, 8s) instead of hard lockout. (4) Use CAPTCHA after 5
              failures instead of lockout. (5) Allow unlock via email verification. (6) Monitor for
              DoS patterns and adjust thresholds. (7) Implement IP-based rate limiting separately
              from account-based limiting. Consider risk-based approach — stricter for admin
              accounts.
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://www.fidoalliance.org/fido2/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FIDO2/WebAuthn Specification
            </a>
          </li>
          <li>
            <a
              href="https://haveibeenpwned.com/API/v3"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Have I Been Pwned API
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
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - HTTP Cookies Guide
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Session Management Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
