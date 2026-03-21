"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-login-interface",
  title: "Login Interface",
  description: "Comprehensive guide to designing login interfaces covering authentication flows, security patterns, session management, and UX best practices for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "login-interface",
  version: "extensive",
  wordCount: 8000,
  readingTime: 32,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "login", "authentication", "frontend", "security"],
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
        </p>
        <p>
          For staff and principal engineers, designing a login interface requires deep understanding 
          of authentication protocols, session management, security threats (credential stuffing, 
          phishing, brute force), and UX patterns that reduce friction while maintaining security. 
          The login flow also sets the foundation for the entire session and must integrate with 
          broader identity infrastructure (MFA, SSO, passwordless).
        </p>
        <p>
          Modern login interfaces have evolved from simple username/password forms to multi-factor 
          authentication flows, passwordless options (magic links, WebAuthn), biometric 
          authentication (Touch ID, Face ID), and seamless SSO experiences. The technical complexity 
          includes secure token handling, session persistence, device trust, and compliance with 
          security standards (OWASP, NIST).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/login-interface-flow.svg"
          alt="Login Interface Flow"
          caption="Login Flow — showing authentication methods, MFA challenge, session creation, and redirect"
        />
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready login interface must satisfy security, UX, and accessibility requirements.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Authentication Methods</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email/Password:</strong> Traditional method with email and password fields. 
              Support "remember me" checkbox for extended sessions. Show password visibility 
              toggle. Enable autocomplete for password managers.
            </li>
            <li>
              <strong>Phone/SMS:</strong> Phone number input with country code selector. Send 
              OTP via SMS. Support auto-read on mobile (SMS Retriever API). Rate limit OTP 
              requests.
            </li>
            <li>
              <strong>Passwordless:</strong> Magic link sent to email/phone. One-time codes. 
              WebAuthn/FIDO2 for biometric authentication. No password to remember or steal.
            </li>
            <li>
              <strong>Social Login:</strong> Continue with Google, Facebook, Apple, etc. OAuth 
              flow with proper scope requests. Handle account linking for existing users.
            </li>
            <li>
              <strong>SSO/SAML:</strong> Enterprise SSO integration. "Sign in with Company" 
              option. Redirect to identity provider. Handle SAML assertion response.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Requirements</h3>
          <ul className="space-y-3">
            <li>
              <strong>Rate Limiting:</strong> Limit login attempts per IP (10/minute), per 
              account (5/hour). Implement exponential backoff (1s, 2s, 4s, 8s). Account 
              lockout after 10 failed attempts.
            </li>
            <li>
              <strong>Generic Errors:</strong> Use "Invalid email or password" (not "email 
              not found" or "wrong password"). Prevents user enumeration attacks.
            </li>
            <li>
              <strong>CSRF Protection:</strong> Include CSRF token in login form. Validate 
              on server. Prevent cross-site request forgery.
            </li>
            <li>
              <strong>Secure Transmission:</strong> HTTPS only. HSTS headers. Never transmit 
              credentials over HTTP. Consider certificate pinning for mobile apps.
            </li>
            <li>
              <strong>Bot Prevention:</strong> CAPTCHA after failed attempts. Device 
              fingerprinting. Behavioral analysis (typing patterns, mouse movements).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Management</h3>
          <ul className="space-y-3">
            <li>
              <strong>Remember Me:</strong> Extended session (30 days) via persistent cookie. 
              Store refresh token securely. Allow users to see and revoke active sessions.
            </li>
            <li>
              <strong>Device Trust:</strong> Remember trusted devices. Skip MFA on trusted 
              devices. Show device in session management. Allow revocation.
            </li>
            <li>
              <strong>Session Notification:</strong> Email on new device login. Show location, 
              device, time. Provide "Was this you?" link for quick password reset if compromised.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>UX Best Practices</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/login-ux-patterns.svg"
          alt="Login UX Best Practices"
          caption="UX Patterns — showing error handling, password visibility, remember me, and social login"
        />

        <p>
          Login should be frictionless for legitimate users while maintaining security against
          attackers.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Form Design</h3>
          <ul className="space-y-3">
            <li>
              <strong>Auto-focus:</strong> Focus email field on page load. Enable Enter key 
              to submit. Preserve email on error (clear password only).
            </li>
            <li>
              <strong>Password Visibility:</strong> Toggle button to show/hide password. 
              Reduces typos and frustration. Default to hidden for security.
            </li>
            <li>
              <strong>Autocomplete:</strong> autocomplete="username" and autocomplete="current-password" 
              for password manager integration. Supports biometric authentication on 
              supported devices.
            </li>
            <li>
              <strong>Clear Errors:</strong> Inline validation for format errors. Generic 
              message for auth failures. Link to password reset after 2-3 failures.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Recovery Options</h3>
          <ul className="space-y-3">
            <li>
              <strong>Forgot Password:</strong> Prominent link near login button. Clear flow 
              with email input, verification, reset form. Invalidate sessions on password 
              change.
            </li>
            <li>
              <strong>Account Recovery:</strong> Alternative recovery methods (phone, backup 
              email, security questions as last resort). Identity verification process.
            </li>
            <li>
              <strong>Support Link:</strong> "Can't access your account?" link to help center 
              or support contact. Provide self-service options first.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Mobile Considerations</h3>
          <ul className="space-y-3">
            <li>
              <strong>Biometric Auth:</strong> Support Touch ID, Face ID, fingerprint. Use 
              WebAuthn API. Fallback to password/biometric option.
            </li>
            <li>
              <strong>Mobile Keyboard:</strong> type="email" for email field (shows @ key). 
              type="tel" for phone. Autocorrect off for passwords.
            </li>
            <li>
              <strong>Responsive Design:</strong> Full-width form on mobile. Large touch 
              targets (44px minimum). Avoid zoom on focus (viewport settings).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Implementation Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Login Form with Error Handling</h3>
        <p>
          A production-ready login form handles loading states, error messages, and MFA redirects gracefully. Key considerations include: preserving the email on error (clear password only), showing inline validation for format errors, using generic messages for authentication failures, providing a link to password reset after 2-3 failures, and implementing proper loading states to prevent double-submission.
        </p>
        <p>
          For state management, use local component state for credentials and errors. Store access tokens in memory (not localStorage) for security. Handle MFA redirects by navigating to MFA verification page with session ID. Implement retry logic with exponential backoff for transient failures.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Storage Strategy</h3>
        <p>
          Store access tokens in memory (JavaScript variables) for maximum security. Use HttpOnly, Secure, SameSite cookies for refresh tokens. Never store tokens in localStorage (XSS vulnerability). For "remember me" functionality, use persistent refresh tokens with rotation. Implement token refresh before expiry to maintain seamless sessions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MFA Integration</h3>
        <p>
          Check for MFA requirement after initial authentication. If MFA is required, return session ID and redirect to MFA verification page. Support multiple MFA methods (TOTP, SMS, email, WebAuthn). Allow users to remember trusted devices for 30 days. Provide backup codes for account recovery.
        </p>
      </section>

      <section>
        <h2>Metrics &amp; Monitoring</h2>
        <ul className="space-y-2">
          <li><strong>Login Success Rate:</strong> Successful logins / Total login attempts</li>
          <li><strong>Failed Login Rate:</strong> Failed attempts / Total attempts (monitor for attacks)</li>
          <li><strong>Time to Login:</strong> Average time from page load to successful auth</li>
          <li><strong>MFA Completion Rate:</strong> Users who complete MFA / Users prompted for MFA</li>
          <li><strong>Password Reset Rate:</strong> Password reset requests / Total logins</li>
          <li><strong>Social Login %:</strong> Logins via social / Total logins</li>
          <li><strong>Account Lockout Rate:</strong> Accounts locked / Total login attempts</li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Implement rate limiting at multiple levels (IP, account, device)</li>
          <li>Use constant-time comparison for password validation</li>
          <li>Log all authentication events for audit trails</li>
          <li>Implement account lockout with progressive delays</li>
          <li>Use secure password hashing (Argon2, bcrypt, scrypt)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Minimize friction for legitimate users</li>
          <li>Provide clear, actionable error messages</li>
          <li>Support password managers with proper autocomplete</li>
          <li>Offer multiple authentication methods</li>
          <li>Remember user preferences (remember me, MFA trust)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Accessibility</h3>
        <ul className="space-y-2">
          <li>Ensure keyboard navigation works (Tab, Enter)</li>
          <li>Provide screen reader announcements for errors</li>
          <li>Use proper labels and ARIA attributes</li>
          <li>Ensure sufficient color contrast</li>
          <li>Support browser zoom without breaking layout</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring &amp; Alerting</h3>
        <ul className="space-y-2">
          <li>Alert on unusual login patterns (geographic anomalies)</li>
          <li>Monitor for credential stuffing attacks</li>
          <li>Track MFA bypass attempts</li>
          <li>Set up dashboards for authentication metrics</li>
          <li>Implement real-time fraud detection</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Revealing user existence:</strong> Error messages like "email not found" or "wrong password" allow attackers to enumerate valid emails.
            <br /><strong>Fix:</strong> Use generic "Invalid email or password" message for all authentication failures.
          </li>
          <li>
            <strong>No rate limiting:</strong> Allows brute force and credential stuffing attacks.
            <br /><strong>Fix:</strong> Implement rate limiting per IP (10/min), per account (5/hour), with exponential backoff.
          </li>
          <li>
            <strong>Storing passwords in plain text:</strong> Catastrophic if database is compromised.
            <br /><strong>Fix:</strong> Use Argon2id or bcrypt with appropriate cost factors. Never store reversible passwords.
          </li>
          <li>
            <strong>Missing CSRF protection:</strong> Allows cross-site request forgery attacks.
            <br /><strong>Fix:</strong> Include CSRF token in all login forms. Validate on server. Use SameSite cookies.
          </li>
          <li>
            <strong>Insecure session tokens:</strong> Predictable or weak tokens allow session hijacking.
            <br /><strong>Fix:</strong> Use cryptographically secure random tokens. Minimum 128 bits of entropy.
          </li>
          <li>
            <strong>No MFA option:</strong> Single factor authentication is insufficient for sensitive accounts.
            <br /><strong>Fix:</strong> Offer TOTP, WebAuthn, or SMS-based MFA. Make it easy to enable.
          </li>
          <li>
            <strong>Session fixation:</strong> Not regenerating session ID after login allows session hijacking.
            <br /><strong>Fix:</strong> Always generate new session ID after successful authentication.
          </li>
          <li>
            <strong>No logout functionality:</strong> Users can't terminate sessions on shared devices.
            <br /><strong>Fix:</strong> Provide clear logout button. Invalidate server-side session. Clear all tokens.
          </li>
          <li>
            <strong>Persistent login on public computers:</strong> Remember me on shared devices is dangerous.
            <br /><strong>Fix:</strong> Default to session cookies. Make remember me opt-in. Warn users on public computers.
          </li>
          <li>
            <strong>No account recovery:</strong> Users locked out permanently lose access.
            <br /><strong>Fix:</strong> Provide secure password reset flow. Offer alternative recovery methods.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Passwordless Authentication</h3>
        <p>
          Passwordless authentication eliminates passwords entirely, using magic links, one-time codes, or WebAuthn for authentication.
        </p>
        <ul className="space-y-2">
          <li><strong>Magic Links:</strong> Send one-time link to email/phone. Short expiry (15 min). Single use only. Track click location/device.</li>
          <li><strong>WebAuthn/FIDO2:</strong> Platform authenticators (Touch ID, Face ID, Windows Hello). Roaming authenticators (YubiKey). Phishing-resistant.</li>
          <li><strong>One-Time Codes:</strong> TOTP apps (Authenticator, Duo). SMS codes (less secure). Email codes. Rate limit code generation.</li>
          <li><strong>Implementation:</strong> Keep password as fallback during transition. Educate users on benefits. Monitor adoption rates.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Risk-Based Authentication</h3>
        <p>
          Adaptive authentication that adjusts security requirements based on risk signals.
        </p>
        <ul className="space-y-2">
          <li><strong>Risk Signals:</strong> Device fingerprint, location, IP reputation, time of day, behavior patterns, network type.</li>
          <li><strong>Risk Scoring:</strong> Calculate risk score (0-100) from signals. Low risk: skip MFA. Medium risk: require MFA. High risk: block and alert.</li>
          <li><strong>Step-Up Authentication:</strong> Require additional verification for sensitive actions (password change, payment, data export).</li>
          <li><strong>Machine Learning:</strong> Train models on historical login data. Detect anomalies. Reduce false positives over time.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO Integration</h3>
        <p>
          Support enterprise customers with SAML 2.0, OIDC, and SCIM integration.
        </p>
        <ul className="space-y-2">
          <li><strong>SAML 2.0:</strong> XML-based protocol. IdP-initiated or SP-initiated flows. Handle assertions, signatures, encryption.</li>
          <li><strong>OIDC:</strong> OAuth 2.0 based. ID tokens with user claims. Simpler than SAML. Growing adoption.</li>
          <li><strong>SCIM:</strong> Automated user provisioning. Create/update/deactivate users based on IdP changes.</li>
          <li><strong>Just-In-Time Provisioning:</strong> Create user account on first SSO login. Map IdP attributes to local schema.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Credential Stuffing Defense</h3>
        <p>
          Protect against automated attacks using breached credential databases.
        </p>
        <ul className="space-y-2">
          <li><strong>Breach Detection:</strong> Check passwords against Have I Been Pwned API. Warn users if password is compromised.</li>
          <li><strong>Device Fingerprinting:</strong> Collect device signals (user agent, screen resolution, fonts, timezone). Detect automation tools.</li>
          <li><strong>Behavioral Analysis:</strong> Monitor typing patterns, mouse movements, form completion time. Bots behave differently than humans.</li>
          <li><strong>IP Intelligence:</strong> Use threat intelligence feeds. Block known bad IPs. Rate limit datacenter IPs more aggressively.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/login-security.svg"
          alt="Login Security Threats and Defenses"
          caption="Login Security — showing credential stuffing, phishing, brute force, and defense mechanisms"
        />

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent credential stuffing attacks?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer defense: (1) Rate limiting per IP and account with exponential backoff, (2) CAPTCHA after 3-5 failed attempts, (3) Check passwords against breach databases (Have I Been Pwned), (4) Device fingerprinting to detect automation, (5) Monitor for unusual patterns (many emails from same IP), (6) Require MFA for suspicious logins, (7) Use behavioral analysis to distinguish bots from humans.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you use email or username for login?</p>
            <p className="mt-2 text-sm">
              A: Email is preferred for several reasons: it's unique by nature (no collisions), users don't forget it, it's required for communication anyway (password reset, notifications), and it enables seamless password reset. Usernames can be forgotten, aren't unique across platforms, and create support burden. Support email aliases (+ addressing, dots in Gmail) for flexibility. Consider allowing both email and username for legacy systems.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement "remember me" securely?</p>
            <p className="mt-2 text-sm">
              A: Store long-lived refresh token (30 days) in HttpOnly, Secure, SameSite=Strict cookie. Access token should be short-lived (15 min). Rotate refresh tokens on each use (issue new token, invalidate old). Allow users to see and revoke active sessions in account settings. Invalidate all tokens on password change. Consider device binding for additional security. Never store tokens in localStorage (XSS risk).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you require MFA during login?</p>
            <p className="mt-2 text-sm">
              A: Always require MFA for: (1) New device/browser fingerprint, (2) Unusual location (different country/city), (3) After password reset, (4) Admin/privileged accounts, (5) High-risk actions (payment, data export). For regular logins from trusted devices, skip MFA for better UX. Use risk-based authentication to balance security and convenience. Let users configure their preferences (always on, new devices only).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle login for users with multiple accounts?</p>
            <p className="mt-2 text-sm">
              A: Use a two-step flow: (1) User enters email, (2) System checks if email has multiple accounts, (3) Show account selector with account identifiers (name, organization, last 4 of phone), (4) User selects account, (5) Proceed with authentication for selected account. Consider account linking for better UX (merge accounts, switch between accounts). For enterprise, use domain-based routing (user@company.com → company SSO).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's your strategy for passwordless authentication?</p>
            <p className="mt-2 text-sm">
              A: Offer multiple passwordless options: (1) Magic link as primary - send one-time token via email/SMS, short expiry (15 min), single use only, track click location/device for security. (2) WebAuthn for biometric - register device during onboarding, challenge-response authentication, phishing-resistant. (3) Keep password as fallback during transition period. Educate users on benefits (no password to remember, more secure). Monitor adoption rates and gradually deprecate passwords.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session management across multiple devices?</p>
            <p className="mt-2 text-sm">
              A: Implement device-aware sessions: (1) Generate unique session per device with device fingerprint, (2) Store device metadata (type, OS, browser, last seen), (3) Show all active sessions in account settings, (4) Allow users to revoke individual sessions or all sessions, (5) Send notification on new device login with "Was this you?" link, (6) Implement session timeout (idle timeout, absolute timeout), (7) Use refresh token rotation for security. Consider concurrent session limits for enterprise plans.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What security headers should you set on login pages?</p>
            <p className="mt-2 text-sm">
              A: Essential headers: (1) Strict-Transport-Security (HSTS) - enforce HTTPS, (2) Content-Security-Policy - restrict script sources, prevent XSS, (3) X-Frame-Options: DENY - prevent clickjacking, (4) X-Content-Type-Options: nosniff - prevent MIME sniffing, (5) Referrer-Policy: no-referrer - protect credentials in referrer, (6) Permissions-Policy - disable unnecessary features (camera, microphone), (7) Cache-Control: no-store - prevent caching of sensitive pages.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement account lockout without enabling DoS attacks?</p>
            <p className="mt-2 text-sm">
              A: Use progressive, targeted lockout: (1) Don't lock based on email alone (attackers can lock legitimate users), (2) Lock based on IP + email combination, (3) Implement progressive delays (1s, 2s, 4s, 8s) instead of hard lockout, (4) Use CAPTCHA after 5 failures instead of lockout, (5) Allow unlock via email verification, (6) Monitor for DoS patterns and adjust thresholds, (7) Implement IP-based rate limiting separately from account-based limiting. Consider risk-based approach - stricter for admin accounts.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Credential Stuffing Prevention</a></li>
          <li><a href="https://www.fidoalliance.org/fido2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FIDO2/WebAuthn Specification</a></li>
          <li><a href="https://haveibeenpwned.com/API/v3" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Have I Been Pwned API</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - HTTP Cookies Guide</a></li>
          <li><a href="https://portswigger.net/web-security/authentication" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">PortSwigger - Authentication Vulnerabilities</a></li>
          <li><a href="https://www.yubico.com/resources/white-papers/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Yubico - Passwordless White Papers</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Security Checklist</h2>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Pre-Launch Checklist</h3>
          <ul className="space-y-2">
            <li>☐ HTTPS enforced with HSTS headers</li>
            <li>☐ Rate limiting implemented (IP and account level)</li>
            <li>☐ Generic error messages (no user enumeration)</li>
            <li>☐ CSRF token validation on login form</li>
            <li>☐ Password hashing with Argon2id or bcrypt</li>
            <li>☐ Session ID regeneration after login</li>
            <li>☐ Secure cookie flags (HttpOnly, Secure, SameSite)</li>
            <li>☐ MFA option available and easy to enable</li>
            <li>☐ Account lockout with progressive delays</li>
            <li>☐ Audit logging for all authentication events</li>
            <li>☐ Password breach detection (Have I Been Pwned)</li>
            <li>☐ Security headers configured (CSP, X-Frame-Options, etc.)</li>
            <li>☐ Session timeout configured (idle and absolute)</li>
            <li>☐ Logout invalidates server-side session</li>
            <li>☐ Password reset flow secure and tested</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>Test form validation (email format, required fields)</li>
          <li>Test error message display for various failure scenarios</li>
          <li>Test loading state during authentication</li>
          <li>Test MFA redirect logic</li>
          <li>Test "remember me" checkbox behavior</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>Test complete login flow with valid credentials</li>
          <li>Test login failure with invalid credentials</li>
          <li>Test rate limiting (multiple failed attempts)</li>
          <li>Test MFA flow end-to-end</li>
          <li>Test password reset flow</li>
          <li>Test session persistence across page refresh</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Tests</h3>
        <ul className="space-y-2">
          <li>Test for user enumeration (same error for all failures)</li>
          <li>Test CSRF token validation</li>
          <li>Test session fixation (new session ID after login)</li>
          <li>Test brute force protection (account lockout)</li>
          <li>Test credential stuffing detection</li>
          <li>Penetration testing for authentication bypass</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Accessibility Tests</h3>
        <ul className="space-y-2">
          <li>Test keyboard navigation (Tab, Enter)</li>
          <li>Test screen reader announcements</li>
          <li>Test color contrast for error messages</li>
          <li>Test form labels and ARIA attributes</li>
          <li>Test browser zoom (200%, 300%)</li>
        </ul>
      </section>

      <section>
        <h2>Monitoring &amp; Alerting</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Key Metrics</h3>
        <ul className="space-y-2">
          <li>Login success/failure rate by method (password, social, MFA)</li>
          <li>Authentication latency (p50, p95, p99)</li>
          <li>Failed login attempts per IP/account (detect attacks)</li>
          <li>MFA completion rate and drop-off points</li>
          <li>Account lockout rate and reasons</li>
          <li>Password reset rate (indicates UX issues)</li>
          <li>Social login adoption by provider</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Alerts</h3>
        <ul className="space-y-2">
          <li>Spike in failed login attempts (credential stuffing)</li>
          <li>Geographic anomalies (login from unusual location)</li>
          <li>Multiple accounts from same IP (bot detection)</li>
          <li>MFA bypass attempts</li>
          <li>Account lockout threshold reached</li>
          <li>Unusual login patterns (time, frequency, device)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Dashboards</h3>
        <ul className="space-y-2">
          <li>Real-time authentication metrics</li>
          <li>Security incident dashboard</li>
          <li>User login patterns and trends</li>
          <li>Method adoption (password vs passwordless vs social)</li>
          <li>Geographic distribution of logins</li>
        </ul>
      </section>

      <section>
        <h2>Operational Excellence</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Incident Response</h3>
        <ul className="space-y-2">
          <li>Document authentication incident procedures</li>
          <li>Define escalation paths for security incidents</li>
          <li>Practice credential stuffing response drills</li>
          <li>Maintain communication templates for user notifications</li>
          <li>Post-incident reviews and learnings</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Continuous Improvement</h3>
        <ul className="space-y-2">
          <li>Regular security audits and penetration testing</li>
          <li>A/B test login flow improvements</li>
          <li>User research on authentication friction points</li>
          <li>Stay current with authentication standards (FIDO, OAuth)</li>
          <li>Monitor industry trends (passwordless, passkeys)</li>
        </ul>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Credential Stuffing Prevention</a></li>
          <li><a href="https://www.fidoalliance.org/fido2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FIDO2/WebAuthn Specification</a></li>
          <li><a href="https://haveibeenpwned.com/API/v3" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Have I Been Pwned API</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - HTTP Cookies Guide</a></li>
          <li><a href="https://portswigger.net/web-security/authentication" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">PortSwigger - Authentication Vulnerabilities</a></li>
          <li><a href="https://www.yubico.com/resources/white-papers/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Yubico - Passwordless White Papers</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management Cheat Sheet</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
