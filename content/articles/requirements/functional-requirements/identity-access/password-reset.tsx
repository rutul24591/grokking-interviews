"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-password-reset",
  title: "Password Reset",
  description: "Comprehensive guide to implementing password reset flows covering token generation, email delivery, security patterns, account recovery, and UX best practices for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "password-reset",
  version: "extensive",
  wordCount: 7000,
  readingTime: 28,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "password-reset", "account-recovery", "security", "frontend"],
  relatedTopics: ["login-interface", "account-recovery", "email-verification", "authentication-service"],
};

export default function PasswordResetArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Password Reset</strong> (also called Forgot Password) is the self-service
          flow that allows users to regain account access when they've forgotten their
          password. It is one of the most critical security flows, as it can be exploited
          for account takeover if implemented incorrectly.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/password-reset-flow.svg"
          alt="Password Reset Flow"
          caption="Password Reset Flow — showing token generation, email delivery, and password update"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/password-reset-security.svg"
          alt="Password Reset Security"
          caption="Password Reset Security — showing token hashing, rate limiting, and session invalidation"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/password-reset-ux.svg"
          alt="Password Reset Ux"
          caption="Password Reset UX — showing user-friendly flows, error states, and confirmation"
        />
      
        <p>
          For staff and principal engineers, designing a password reset flow requires
          balancing security (preventing unauthorized resets) with accessibility (legitimate
          users can recover accounts). The flow must prevent common attacks: email enumeration,
          token guessing, token leakage, and timing attacks. It also requires careful
          consideration of token generation, delivery mechanisms, expiry, and post-reset
          session handling.
        </p>

        

        

        
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A secure password reset flow consists of multiple steps with security checks at each stage.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Request Reset</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email Input:</strong> User enters email address. Single field, clear
              label ("Enter your email address").
            </li>
            <li>
              <strong>Generic Response:</strong> Always show "If this email exists, we'll
              send a reset link". Never reveal if email is registered (prevents enumeration).
            </li>
            <li>
              <strong>Rate Limiting:</strong> Limit requests per email (3/hour), per IP
              (10/hour). Prevent abuse and email bombing.
            </li>
            <li>
              <strong>Logging:</strong> Log request with email, IP, timestamp. Flag suspicious
              patterns (many emails from same IP).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Token Generation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Cryptographic Token:</strong> Generate random token (256-bit / 32 bytes).
              Use crypto.randomBytes() or equivalent. Store hash (not plaintext) in database.
            </li>
            <li>
              <strong>Expiry:</strong> Set short expiry (1 hour standard, 15 min for high-security).
              Store expires_at timestamp.
            </li>
            <li>
              <strong>Single Use:</strong> Token invalidates after use. Track used flag or
              delete on use.
            </li>
            <li>
              <strong>Association:</strong> Link token to user_id, not email (email can change).
              Store request metadata (IP, user agent).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Email Delivery</h3>
          <ul className="space-y-3">
            <li>
              <strong>Secure Link:</strong> HTTPS only. Include token in URL path (not query
              param to avoid logging). Example: /reset-password/TOKEN.
            </li>
            <li>
              <strong>Email Content:</strong> Clear subject ("Reset your password"). Include
              expiry time. Warn about unsolicited requests. Provide support contact.
            </li>
            <li>
              <strong>Notification:</strong> Send "password changed" confirmation email after
              successful reset. Include timestamp, IP, device info.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Password Update</h3>
          <ul className="space-y-3">
            <li>
              <strong>Token Validation:</strong> Check token exists, not expired, not used.
              Compare hashes (constant-time comparison).
            </li>
            <li>
              <strong>Password Requirements:</strong> Enforce same rules as signup (NIST
              guidelines). Show strength meter.
            </li>
            <li>
              <strong>Session Handling:</strong> Invalidate all existing sessions after
              reset. Optionally auto-login user after reset.
            </li>
            <li>
              <strong>Token Cleanup:</strong> Delete or mark token as used. Invalidate all
              other pending reset tokens for user.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Use cryptographically secure random tokens (256-bit)</li>
          <li>Store token hashes, not plaintext</li>
          <li>Set short token expiry (1 hour standard)</li>
          <li>Rate limit reset requests</li>
          <li>Use generic response messages (no enumeration)</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Clear, simple flow (request → email → reset)</li>
          <li>Show expected delivery time for email</li>
          <li>Provide resend option with rate limiting</li>
          <li>Auto-focus input fields</li>
          <li>Show password requirements upfront</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Delivery</h3>
        <ul className="space-y-2">
          <li>Use HTTPS for reset links</li>
          <li>Include token in URL path (not query params)</li>
          <li>Clear email subject and content</li>
          <li>Include expiry time in email</li>
          <li>Send confirmation after successful reset</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Management</h3>
        <ul className="space-y-2">
          <li>Invalidate all sessions after reset</li>
          <li>Optionally auto-login after reset</li>
          <li>Send notification of password change</li>
          <li>Log all reset attempts for audit</li>
          <li>Clean up used/expired tokens</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Email enumeration:</strong> "Email not found" reveals registered emails.
            <br /><strong>Fix:</strong> Use generic message "If email exists, we'll send reset link".
          </li>
          <li>
            <strong>Long token expiry:</strong> Tokens valid for days enables account takeover.
            <br /><strong>Fix:</strong> Set short expiry (1 hour standard, 15 min for high-security).
          </li>
          <li>
            <strong>Storing plaintext tokens:</strong> Database breach exposes all tokens.
            <br /><strong>Fix:</strong> Store token hashes (bcrypt/sha256), not plaintext.
          </li>
          <li>
            <strong>Token in query params:</strong> Logged in server logs, referrer headers.
            <br /><strong>Fix:</strong> Put token in URL path (/reset-password/TOKEN).
          </li>
          <li>
            <strong>No rate limiting:</strong> Allows email bombing, brute force.
            <br /><strong>Fix:</strong> Rate limit per email (3/hour), per IP (10/hour).
          </li>
          <li>
            <strong>Not invalidating sessions:</strong> Old sessions remain active after reset.
            <br /><strong>Fix:</strong> Invalidate all sessions on password reset.
          </li>
          <li>
            <strong>Multiple active tokens:</strong> Old tokens still valid.
            <br /><strong>Fix:</strong> Invalidate all pending tokens when new one generated.
          </li>
          <li>
            <strong>No confirmation email:</strong> Users unaware if password was changed.
            <br /><strong>Fix:</strong> Send "password changed" notification email.
          </li>
          <li>
            <strong>Weak token generation:</strong> Predictable tokens enable guessing.
            <br /><strong>Fix:</strong> Use crypto.randomBytes(32) for 256-bit tokens.
          </li>
          <li>
            <strong>No HTTPS requirement:</strong> Tokens transmitted insecurely.
            <br /><strong>Fix:</strong> Enforce HTTPS for all reset flow pages.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Security</h3>
        <p>
          Cryptographic token generation and storage is critical for security.
        </p>
        <ul className="space-y-2">
          <li><strong>Generation:</strong> Use crypto.randomBytes(32) for 256-bit tokens. 2^256 possible values makes guessing infeasible.</li>
          <li><strong>Storage:</strong> Store bcrypt hash of token (like passwords). Prevents token exposure in database breach.</li>
          <li><strong>Comparison:</strong> Use constant-time comparison to prevent timing attacks.</li>
          <li><strong>Metadata:</strong> Store request IP, user agent, timestamp for fraud detection.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rate Limiting Strategies</h3>
        <p>
          Prevent abuse while allowing legitimate users to reset passwords.
        </p>
        <ul className="space-y-2">
          <li><strong>Per Email:</strong> 3 requests per hour. Prevents targeting specific accounts.</li>
          <li><strong>Per IP:</strong> 10 requests per hour. Prevents email bombing attacks.</li>
          <li><strong>Progressive Delays:</strong> Increase delay after each request (1s, 2s, 4s, 8s).</li>
          <li><strong>CAPTCHA:</strong> Trigger after 3 failed attempts. Invisible reCAPTCHA v3 preferred.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Account Recovery Alternatives</h3>
        <p>
          Provide alternative recovery methods for users without email access.
        </p>
        <ul className="space-y-2">
          <li><strong>Phone Recovery:</strong> Send SMS code to verified phone number.</li>
          <li><strong>Security Questions:</strong> Last resort only (easily researched). Use custom questions.</li>
          <li><strong>Backup Email:</strong> Allow users to set secondary recovery email.</li>
          <li><strong>Support Ticket:</strong> Manual identity verification for edge cases.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Passwordless Reset</h3>
        <p>
          Magic link flow eliminates password entirely.
        </p>
        <ul className="space-y-2">
          <li><strong>Magic Link:</strong> Send one-time login link. Short expiry (15 min). Single use only.</li>
          <li><strong>Benefits:</strong> No password to forget, phishing-resistant (if implemented correctly).</li>
          <li><strong>Implementation:</strong> Same token generation as reset, but link logs user in directly.</li>
          <li><strong>Security:</strong> Track click location/device. Invalidate after use.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent email enumeration in password reset?</p>
            <p className="mt-2 text-sm">
              A: Always show generic message "If this email exists, we'll send a reset link". Never reveal if email is registered. Use same response time for all cases (prevent timing attacks). Log all requests internally for monitoring, but don't reveal existence to user.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal token expiry time?</p>
            <p className="mt-2 text-sm">
              A: Depends on security level: (1) Standard: 1 hour - balances security and usability. (2) High-security (financial, admin): 15 minutes. (3) Low-security: 24 hours max. Shorter is always more secure. Send expiry time in email so users know deadline.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you store reset tokens in plaintext?</p>
            <p className="mt-2 text-sm">
              A: Never store plaintext tokens. Store bcrypt hash of token (like passwords). If database is breached, attackers can't use stolen tokens. Use constant-time comparison when validating tokens. This adds defense in depth.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session management after password reset?</p>
            <p className="mt-2 text-sm">
              A: Invalidate ALL existing sessions immediately. This prevents attackers from maintaining access. Optionally auto-login user after reset (convenient but consider security trade-off). Send "password changed" notification email with timestamp, IP, device info.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What rate limiting do you implement for password reset?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer rate limiting: (1) Per email: 3 requests/hour - prevents targeting specific accounts. (2) Per IP: 10 requests/hour - prevents email bombing. (3) Progressive delays: 1s, 2s, 4s, 8s after each request. (4) CAPTCHA after 3 failed attempts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Where do you put the reset token in the URL?</p>
            <p className="mt-2 text-sm">
              A: Put token in URL path (/reset-password/TOKEN), NOT query params (/reset-password?token=XXX). Query params are logged in server logs, browser history, referrer headers. Path is safer. Still use HTTPS regardless.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle users who no longer have email access?</p>
            <p className="mt-2 text-sm">
              A: Provide alternative recovery methods: (1) Phone recovery (SMS code to verified phone), (2) Backup email (user set secondary email), (3) Security questions (last resort, use custom questions), (4) Support ticket with manual identity verification. Let users configure recovery options in account settings.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for password reset?</p>
            <p className="mt-2 text-sm">
              A: Reset request rate, email delivery rate, reset completion rate, time-to-complete, abuse rate (rate limit hits), support tickets for reset issues. Monitor for anomalies (spike in requests from single IP). Track by user segment (new vs existing users).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement passwordless login?</p>
            <p className="mt-2 text-sm">
              A: Magic link flow: (1) User enters email, (2) Generate one-time token (256-bit, 15 min expiry), (3) Send link via email, (4) Link logs user in directly (no password), (5) Invalidate token after use, (6) Track click location/device for security. Same security as password reset but better UX.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Forgot Password Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Credential Stuffing Prevention</a></li>
          <li><a href="https://www.ncsc.gov.uk/guidance/password-handling-and-storage" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NCSC - Password Handling and Storage</a></li>
          <li><a href="https://haveibeenpwned.com/API/v3" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Have I Been Pwned API</a></li>
          <li><a href="https://www.fidoalliance.org/fido2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FIDO2/WebAuthn Specification</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - HTTP Cookies Guide</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Password Reset</h3>
        <p>
          Large e-commerce platform with 50M users handling 100K password reset requests/month.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> High volume of password resets during holiday sales. Account takeover attempts via password reset abuse.</li>
          <li><strong>Solution:</strong> Rate limiting (3 requests/hour), generic response messages, token expiry (1 hour), session invalidation on reset.</li>
          <li><strong>Result:</strong> Account takeovers reduced by 85%. Customer support tickets down 40%. No impact on legitimate users.</li>
          <li><strong>Security:</strong> Email enumeration prevention, token hashing, audit logging for all reset attempts.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Password Reset</h3>
        <p>
          Online banking platform with strict security and regulatory requirements.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> FFIEC guidelines require strong authentication for password reset. Elderly customers need simple flow. Account takeover risk is high.</li>
          <li><strong>Solution:</strong> Multi-step verification (email + SMS + security questions). Call center fallback for customers without phone access. 24-hour cooling period for high-value accounts.</li>
          <li><strong>Result:</strong> Zero account takeovers via password reset. Passed all regulatory audits. Customer satisfaction maintained (multiple recovery options).</li>
          <li><strong>Security:</strong> MFA for reset, manual review for high-risk accounts, notification emails for all resets.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS Password Reset</h3>
        <p>
          B2B SaaS platform with 10,000 enterprise customers, SSO integration.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Enterprise users authenticate via SSO (IdP manages passwords). Local accounts need reset flow. Admin needs to reset user passwords.</li>
          <li><strong>Solution:</strong> Dual flow: self-service for local accounts, IdP redirect for SSO users. Admin-initiated reset with audit logging. Forced password change on next login.</li>
          <li><strong>Result:</strong> 99% successful reset rate. Admin efficiency improved (self-service reset). Reduced support tickets by 70%.</li>
          <li><strong>Security:</strong> Admin action logging, forced MFA re-enrollment after admin reset, notification to user.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Portal Password Reset</h3>
        <p>
          HIPAA-compliant patient portal with 5M patients accessing medical records.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> HIPAA requires verification before password reset. Elderly patients struggle with complex flows. Provider accounts need enhanced security.</li>
          <li><strong>Solution:</strong> Patients: email + SMS verification. Providers: email + phone + security questions. Support team can reset after identity verification (recorded calls).</li>
          <li><strong>Result:</strong> Passed HIPAA audits. Patient reset completion rate 90%. Zero provider account takeovers.</li>
          <li><strong>Security:</strong> Enhanced verification for providers, audit logging, automatic logout of all sessions after reset.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Password Reset</h3>
        <p>
          Online gaming platform with 100M users, high account value (virtual items, currency).
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> High-value accounts targeted for takeover. Account recovery fraud (claiming hacked accounts). Young users forget passwords frequently.</li>
          <li><strong>Solution:</strong> Risk-based reset flow: low-risk (email only), high-value accounts (email + purchase history verification + waiting period). Parental controls for minor accounts.</li>
          <li><strong>Result:</strong> Account takeovers reduced by 90%. Fraud claims reduced by 75%. Parent satisfaction improved (control over minor accounts).</li>
          <li><strong>Security:</strong> Purchase history verification, waiting period for high-value accounts, parental approval for minors.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
