"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
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
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent email enumeration in password reset?</p>
            <p className="mt-2 text-sm">
              A: Same response message for all emails ("If this email exists, we'll send 
              a link"). Same response time (add artificial delay for registered emails if 
              needed). Don't reveal existence via error messages or timing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal password reset token expiry?</p>
            <p className="mt-2 text-sm">
              A: 1 hour for standard apps, 15 minutes for high-security (banking, healthcare). 
              Balance: long enough for user to find email, short enough to limit attack 
              window. Show expiry prominently in email.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you invalidate all sessions after password reset?</p>
            <p className="mt-2 text-sm">
              A: Yes, for security. If attacker triggered reset, they shouldn't maintain 
              access. Force re-login with new password. Exception: enterprise SSO where 
              session is managed by IdP.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle password reset for users without email access?</p>
            <p className="mt-2 text-sm">
              A: Alternative recovery: SMS code, security questions (last resort), backup 
              email, account recovery form (manual review). Require identity verification 
              before allowing reset method change.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you store password reset tokens?</p>
            <p className="mt-2 text-sm">
              A: Store hash (SHA256) of token, not plaintext. Like passwords. If DB 
              compromised, tokens can't be used. Include user_id, expires_at, used_at, 
              request_ip. Index on token_hash for fast lookup.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle password reset abuse (bombing)?</p>
            <p className="mt-2 text-sm">
              A: Rate limit: 3 requests/hour per email, 10/hour per IP. Cooldown period 
              between requests. CAPTCHA after suspicious activity. Monitor for patterns 
              (many emails to same domain).
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
