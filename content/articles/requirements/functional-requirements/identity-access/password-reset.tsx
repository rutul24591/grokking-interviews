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
        <p>
          For staff and principal engineers, designing a password reset flow requires 
          balancing security (preventing unauthorized resets) with accessibility (legitimate 
          users can recover accounts). The flow must prevent common attacks: email enumeration, 
          token guessing, token leakage, and timing attacks. It also requires careful 
          consideration of token generation, delivery mechanisms, expiry, and post-reset
          session handling.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/password-reset-flow.svg"
          alt="Password Reset Flow"
          caption="Password Reset — showing request, token delivery, verification, and password update"
        />
      </section>

      <section>
        <h2>Password Reset Flow</h2>
        <p>
          A secure password reset flow consists of multiple steps with security checks at each stage.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 1: Request Reset</h3>
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
          <h3 className="mb-4 text-lg font-semibold">Step 2: Token Generation</h3>
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
          <h3 className="mb-4 text-lg font-semibold">Step 3: Email Delivery</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email Template:</strong> Clear subject ("Reset your password"), sender 
              name (company name), reset link with token, expiry time, security notice.
            </li>
            <li>
              <strong>Reset Link:</strong> HTTPS URL with token parameter. Include email for 
              convenience (not security). Example: /reset-password?token=xxx&amp;email=user@example.com
            </li>
            <li>
              <strong>Security Warnings:</strong> "If you didn't request this, ignore this 
              email", "This link expires in 1 hour", "Never share this link".
            </li>
            <li>
              <strong>Delivery Tracking:</strong> Track sent timestamp, delivery status, open 
              rate. Retry failed deliveries.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 4: Reset Form</h3>
          <ul className="space-y-3">
            <li>
              <strong>Token Validation:</strong> Verify token exists, not expired, not used. 
              Use constant-time comparison.
            </li>
            <li>
              <strong>New Password:</strong> Password field with strength requirements. Confirm 
              password field. Show requirements clearly.
            </li>
            <li>
              <strong>Submit:</strong> On success, invalidate all sessions (force re-login). 
              Show confirmation message.
            </li>
            <li>
              <strong>Error Handling:</strong> "Invalid or expired link" for bad tokens. 
              Provide option to request new link.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 5: Post-Reset</h3>
          <ul className="space-y-3">
            <li>
              <strong>Invalidate Sessions:</strong> Revoke all refresh tokens, delete all 
              sessions. Force re-login on all devices.
            </li>
            <li>
              <strong>Confirmation Email:</strong> Send "Password changed successfully" email. 
              Include "Contact support if this wasn't you" warning.
            </li>
            <li>
              <strong>Security Notification:</strong> Alert user of password change via 
              secondary channel (if configured).
            </li>
            <li>
              <strong>Auto-Login:</strong> Optional: auto-login after reset (convenient but 
              reduces security if email compromised).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Security Considerations</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/password-reset-security.svg"
          alt="Password Reset Security"
          caption="Security — showing token generation, email enumeration prevention, and timing attacks"
        />

        <p>
          Password reset is a high-value attack vector. Security must be built in at every step.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Preventing Attacks</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email Enumeration:</strong> Same response for registered/unregistered 
              emails. Same response time (prevent timing attacks).
            </li>
            <li>
              <strong>Token Guessing:</strong> Use cryptographically random tokens (256-bit). 
              Rate limit token validation attempts.
            </li>
            <li>
              <strong>Token Leakage:</strong> HTTPS only. No token in Referer header (use 
              POST or meta tag). Don't log tokens.
            </li>
            <li>
              <strong>Email Account Takeover:</strong> If user's email is compromised, attacker 
              can reset password. Mitigate with MFA for password reset.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Token Security</h3>
          <ul className="space-y-3">
            <li>
              <strong>Storage:</strong> Store token hash (not plaintext). If database 
              compromised, tokens can't be used.
            </li>
            <li>
              <strong>Expiry:</strong> Short expiry (1 hour). Delete expired tokens 
              periodically.
            </li>
            <li>
              <strong>Single Use:</strong> Invalidate immediately after use. Detect reuse 
              attacks (if used token submitted, alert user).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>UX Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Clear Instructions:</strong> Explain each step. Show what to expect 
            ("Check your inbox for a reset link").
          </li>
          <li>
            <strong>Resend Option:</strong> Allow resending reset email (rate limited). 
            Show countdown ("Resend in 2:30").
          </li>
          <li>
            <strong>Link Expiry Warning:</strong> Show expiry time prominently. Offer to 
            send new link if expired.
          </li>
          <li>
            <strong>Password Requirements:</strong> Show requirements before user submits. 
            Real-time validation.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Large touch targets, mobile keyboard 
            optimization, responsive design.
          </li>
        </ul>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Forgot Password Cheat Sheet
            </a>
          </li>
          <li>
            <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST SP 800-63B - Digital Identity Guidelines
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Use cryptographically secure random tokens (256-bit minimum)</li>
          <li>Store token hashes, not plaintext tokens</li>
          <li>Implement rate limiting at multiple levels (email, IP, device)</li>
          <li>Use constant-time comparison for token validation</li>
          <li>Invalidate all sessions after password reset</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Provide clear, step-by-step instructions</li>
          <li>Show token expiry prominently in emails</li>
          <li>Offer resend option with rate limiting</li>
          <li>Provide alternative recovery methods</li>
          <li>Send confirmation email after successful reset</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Delivery</h3>
        <ul className="space-y-2">
          <li>Use reputable email service providers (SendGrid, SES)</li>
          <li>Implement email authentication (SPF, DKIM, DMARC)</li>
          <li>Monitor delivery rates and bounce handling</li>
          <li>Provide plain text alternative for accessibility</li>
          <li>Test email templates across email clients</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>Track password reset request rates</li>
          <li>Monitor token validation failures</li>
          <li>Alert on unusual patterns (many requests from same IP)</li>
          <li>Track time-to-reset metrics</li>
          <li>Monitor email delivery success rates</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Email enumeration:</strong> Different responses for registered vs unregistered emails.
            <br /><strong>Fix:</strong> Use generic response ("If this email exists, we'll send a link") for all cases.
          </li>
          <li>
            <strong>Timing attacks:</strong> Faster response for unregistered emails.
            <br /><strong>Fix:</strong> Add artificial delay to make response times consistent.
          </li>
          <li>
            <strong>Long token expiry:</strong> Tokens valid for days or weeks.
            <br /><strong>Fix:</strong> Use short expiry (1 hour standard, 15 min for high-security).
          </li>
          <li>
            <strong>Storing plaintext tokens:</strong> Tokens stored as-is in database.
            <br /><strong>Fix:</strong> Store token hash (SHA256), not plaintext.
          </li>
          <li>
            <strong>No rate limiting:</strong> Unlimited reset requests allowed.
            <br /><strong>Fix:</strong> Implement rate limiting (3/hour per email, 10/hour per IP).
          </li>
          <li>
            <strong>Not invalidating sessions:</strong> Old sessions remain valid after password change.
            <br /><strong>Fix:</strong> Invalidate all sessions and refresh tokens on password reset.
          </li>
          <li>
            <strong>Token in Referer header:</strong> Token leaked to third-party sites via links.
            <br /><strong>Fix:</strong> Use POST for reset form, add rel="noopener noreferrer" to links.
          </li>
          <li>
            <strong>Weak token generation:</strong> Using predictable or weak random tokens.
            <br /><strong>Fix:</strong> Use crypto.randomBytes() or equivalent (256-bit minimum).
          </li>
          <li>
            <strong>No token reuse detection:</strong> Used tokens can be submitted multiple times.
            <br /><strong>Fix:</strong> Invalidate token immediately after use. Detect and alert on reuse attempts.
          </li>
          <li>
            <strong>Poor email deliverability:</strong> Reset emails going to spam.
            <br /><strong>Fix:</strong> Use reputable ESP, implement SPF/DKIM/DMARC, monitor sender reputation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multi-Factor Password Reset</h3>
        <p>
          Add additional verification steps for high-security accounts.
        </p>
        <ul className="space-y-2">
          <li><strong>SMS Verification:</strong> Send code to registered phone number. Require both email and SMS.</li>
          <li><strong>Security Questions:</strong> Ask pre-configured questions. Last resort (easily researched).</li>
          <li><strong>Backup Email:</strong> Send code to secondary email address. Configured during account setup.</li>
          <li><strong>Identity Verification:</strong> Manual review for high-value accounts. Government ID, selfie verification.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Account Recovery Without Email</h3>
        <p>
          Alternative recovery methods for users who've lost email access.
        </p>
        <ul className="space-y-2">
          <li><strong>Recovery Codes:</strong> Pre-generated codes provided during account setup. Store securely offline.</li>
          <li><strong>Trusted Contacts:</strong> Designate contacts who can vouch for identity. Social recovery pattern.</li>
          <li><strong>Hardware Keys:</strong> Use FIDO2 security key for recovery. Most secure option.</li>
          <li><strong>Account Recovery Form:</strong> Manual review process. Provide account details, answer questions. Slow but effective.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Binding</h3>
        <p>
          Bind reset tokens to specific devices or contexts for additional security.
        </p>
        <ul className="space-y-2">
          <li><strong>Device Binding:</strong> Token only valid from requesting device/IP. Detect token sharing.</li>
          <li><strong>Context Binding:</strong> Include user agent, IP in token validation. Detect anomalous usage.</li>
          <li><strong>One-Time Use:</strong> Token invalidates immediately after first use attempt (success or failure).</li>
          <li><strong>Short-Lived Tokens:</strong> 15-minute expiry for high-security accounts.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Passwordless Reset</h3>
        <p>
          Modern approaches that eliminate password reset entirely.
        </p>
        <ul className="space-y-2">
          <li><strong>Magic Link Login:</strong> Send login link instead of reset link. No password needed.</li>
          <li><strong>WebAuthn Recovery:</strong> Use biometric or hardware key for account recovery.</li>
          <li><strong>OTP Login:</strong> Send one-time code for login. Code expires after single use.</li>
          <li><strong>Implementation:</strong> Gradual migration from password-based to passwordless. Keep traditional reset as fallback.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/password-reset-ux.svg"
          alt="Password Reset UX Best Practices"
          caption="UX Best Practices — showing error handling, success confirmation, and auto-login"
        />

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent email enumeration in password reset?</p>
            <p className="mt-2 text-sm">
              A: Same response message for all emails ("If this email exists, we'll send a link"). Same response time (add artificial delay for registered emails if needed). Don't reveal existence via error messages or timing. Log all requests for security monitoring but don't expose registration status to user.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal password reset token expiry?</p>
            <p className="mt-2 text-sm">
              A: 1 hour for standard apps, 15 minutes for high-security (banking, healthcare). Balance: long enough for user to find email and complete reset, short enough to limit attack window. Show expiry prominently in email. Consider user timezone when displaying expiry time.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you invalidate all sessions after password reset?</p>
            <p className="mt-2 text-sm">
              A: Yes, for security. If attacker triggered reset or compromised email, they shouldn't maintain access via existing sessions. Force re-login with new password on all devices. Exception: enterprise SSO where session is managed by IdP, not application.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle password reset for users without email access?</p>
            <p className="mt-2 text-sm">
              A: Alternative recovery methods: (1) SMS code to registered phone, (2) Backup email address, (3) Recovery codes (pre-generated, stored offline), (4) Security questions (last resort, easily researched), (5) Manual account recovery form with identity verification. Require identity verification before allowing reset method change.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you store password reset tokens?</p>
            <p className="mt-2 text-sm">
              A: Store hash (SHA256) of token, not plaintext. Like passwords. If database compromised, tokens can't be used. Database schema: user_id, token_hash (indexed), expires_at (indexed), used_at, request_ip, user_agent. Delete or mark used after successful reset.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle password reset abuse (bombing)?</p>
            <p className="mt-2 text-sm">
              A: Rate limit: 3 requests/hour per email, 10/hour per IP. Cooldown period between requests ("Resend in 5:00"). CAPTCHA after suspicious activity. Monitor for patterns (many emails to same domain, rapid requests from same IP). Block abusive IPs temporarily.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent token leakage via Referer header?</p>
            <p className="mt-2 text-sm">
              A: Use POST for reset form submission (token in body, not URL). Add rel="noopener noreferrer" to any external links on reset page. Set Referrer-Policy: no-referrer header. Don't include token in email links if possible (use one-time code instead). If token must be in URL, ensure HTTPS and short expiry.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you monitor for password reset?</p>
            <p className="mt-2 text-sm">
              A: Primary: Reset request rate, token validation success/failure rate, time-to-reset (request to completion), email delivery rate. Security: Failed validation attempts per IP, token reuse attempts, unusual patterns (many requests from same IP). UX: Drop-off rate at each step, resend rate. Set up alerts for anomalies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle password reset for enterprise/SSO accounts?</p>
            <p className="mt-2 text-sm">
              A: Enterprise accounts managed by IdP (Okta, Azure AD). Redirect to IdP for password reset. Don't allow local password reset for SSO accounts. Detect SSO accounts by email domain or user flag. Provide clear messaging ("Contact your IT administrator" or "Reset via company portal").
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Security Checklist</h2>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Pre-Launch Checklist</h3>
          <ul className="space-y-2">
            <li>☐ Cryptographically secure token generation (256-bit)</li>
            <li>☐ Token hash storage (not plaintext)</li>
            <li>☐ Rate limiting implemented (email, IP, device)</li>
            <li>☐ Generic response messages (no enumeration)</li>
            <li>☐ Constant-time token comparison</li>
            <li>☐ Short token expiry (1 hour standard)</li>
            <li>☐ Single-use token enforcement</li>
            <li>☐ Session invalidation on password reset</li>
            <li>☐ HTTPS enforced for all reset URLs</li>
            <li>☐ Email authentication configured (SPF, DKIM, DMARC)</li>
            <li>☐ Confirmation email sent after reset</li>
            <li>☐ Audit logging for all reset events</li>
            <li>☐ Alternative recovery methods available</li>
            <li>☐ Penetration testing completed</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>Test token generation (randomness, length)</li>
          <li>Test token validation (valid, expired, used)</li>
          <li>Test rate limiting logic</li>
          <li>Test email enumeration prevention</li>
          <li>Test session invalidation</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>Test complete reset flow end-to-end</li>
          <li>Test email delivery and rendering</li>
          <li>Test token expiry enforcement</li>
          <li>Test resend functionality</li>
          <li>Test alternative recovery methods</li>
          <li>Test SSO account handling</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Tests</h3>
        <ul className="space-y-2">
          <li>Test email enumeration (timing, responses)</li>
          <li>Test token guessing resistance</li>
          <li>Test rate limiting effectiveness</li>
          <li>Test token reuse detection</li>
          <li>Test Referer header leakage</li>
          <li>Penetration testing for reset bypass</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">UX Tests</h3>
        <ul className="space-y-2">
          <li>Test email clarity and readability</li>
          <li>Test form validation messages</li>
          <li>Test mobile responsiveness</li>
          <li>Test accessibility (screen readers, keyboard)</li>
          <li>User testing for flow comprehension</li>
        </ul>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Forgot Password Cheat Sheet</a></li>
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Credential Stuffing Prevention</a></li>
          <li><a href="https://sendgrid.com/blog/email-authentication-spf-dkim-dmarc/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">SendGrid - Email Authentication Guide</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://www.fidoalliance.org/fido2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FIDO2/WebAuthn Specification</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Password_security" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - Password Security</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management</a></li>
        </ul>
      </section>

      <section>
        <h2>Implementation Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Token Generation</h3>
        <p>
          Generate cryptographically secure tokens using platform-specific APIs. Node.js: crypto.randomBytes(32). Python: secrets.token_hex(32). Go: crypto/rand.Read(). Store token hash (SHA256) in database, not plaintext. Include metadata: user_id, expires_at, used_at, request_ip, user_agent for forensic analysis.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Template</h3>
        <p>
          Clear subject line ("Reset your password for [App Name]"). Sender name should be company name (not noreply). Include reset button with clear call-to-action. Show expiry time prominently. Add security notice ("If you didn't request this, ignore this email"). Include plain text alternative for accessibility. Test across email clients (Gmail, Outlook, Apple Mail).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rate Limiting</h3>
        <p>
          Implement at multiple levels: per email (3/hour), per IP (10/hour), per device (5/hour). Use sliding window or token bucket algorithm. Return 429 Too Many Requests with Retry-After header. Log rate limit hits for security monitoring. Exempt enterprise/admin accounts with approval workflow.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Management</h3>
        <p>
          On password reset success: invalidate all refresh tokens, delete all sessions, increment session version (for bulk invalidation), send session revoked event to message queue. Force re-authentication on all devices. Exception: current device can remain logged in (user just proved identity).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Handling</h3>
        <p>
          Use generic error messages for security (no enumeration). Return structured errors with error codes for client handling. Log detailed errors internally for debugging. Implement retry logic with exponential backoff for transient failures (email delivery). Provide clear user-facing messages with next steps.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Audit Logging</h3>
        <p>
          Log all password reset events: request_initiated, email_sent, link_clicked, password_changed, sessions_invalidated. Include: timestamp, user_id, IP address, user agent, device fingerprint. Use immutable storage for compliance. Retain logs per policy (90 days hot, 7 years cold). Set up alerts for suspicious patterns (many requests from same IP, unusual timing).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Graceful Degradation</h3>
        <p>
          Handle email service failures gracefully. Queue emails for retry with exponential backoff. Provide alternative delivery methods (SMS code) as fallback. Show user-friendly messages when delays occur. Monitor email delivery rates and alert on degradation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Performance Optimization</h3>
        <p>
          Cache token validation results (negative cache for invalid tokens). Use database indexes on token_hash and expires_at. Batch session invalidation for users with many sessions. Async email sending via message queue. Pre-compute email templates with variable substitution.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compliance Considerations</h3>
        <p>
          GDPR: Allow users to request data deletion including reset history. SOC2: Maintain audit trails for all reset events. HIPAA: Additional verification for healthcare accounts. PCI-DSS: Extra controls for payment-related accounts. Implement data retention policies per regulatory requirements.
        </p>
      </section>
    </ArticleLayout>
  );
}
