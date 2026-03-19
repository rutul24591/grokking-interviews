"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
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
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent credential stuffing attacks?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer defense: (1) Rate limiting per IP and account, (2) CAPTCHA after 
              failed attempts, (3) Check passwords against breach databases, (4) Device 
              fingerprinting, (5) Monitor for unusual patterns (many emails from same IP), 
              (6) Require MFA for suspicious logins.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you use email or username for login?</p>
            <p className="mt-2 text-sm">
              A: Email is preferred: unique by nature, users don't forget it, required for 
              communication anyway, enables password reset. Usernames can be forgotten and 
              aren't unique across platforms. Support email aliases (+ addressing) for 
              flexibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement "remember me" securely?</p>
            <p className="mt-2 text-sm">
              A: Store long-lived refresh token (30 days) in HttpOnly, Secure, SameSite cookie. 
              Access token short-lived (15 min). Rotate refresh tokens on use. Allow users to 
              see and revoke active sessions. Invalidate all tokens on password change.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you require MFA during login?</p>
            <p className="mt-2 text-sm">
              A: Always for high-risk actions (password change, payment). For regular login: 
              (1) New device/browser, (2) Unusual location, (3) After password reset, (4) 
              Admin accounts, (5) User-configured (always on). Use risk-based authentication 
              to balance security and UX.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle login for users with multiple accounts?</p>
            <p className="mt-2 text-sm">
              A: Show account selector after email entry if email has multiple accounts. 
              Display account identifiers (name, last 4 of phone). Let user choose which 
              account to access. Consider account linking for better UX.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's your strategy for passwordless authentication?</p>
            <p className="mt-2 text-sm">
              A: Offer magic link (email/SMS) as primary, WebAuthn for biometric. Magic link: 
              one-time token, short expiry (15 min), single use. WebAuthn: register device, 
              challenge-response authentication. Keep password as fallback during transition 
              period.
            </p>
          </div>
        </div>
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
    </ArticleLayout>
  );
}
