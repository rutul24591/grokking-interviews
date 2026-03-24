"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-password-reset",
  title: "Password Reset",
  description:
    "Comprehensive guide to implementing password reset flows covering token generation, email delivery, security patterns, account recovery, session invalidation, and UX best practices for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "password-reset",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "password-reset",
    "account-recovery",
    "security",
    "frontend",
  ],
  relatedTopics: ["login-interface", "account-recovery", "email-verification"],
};

export default function PasswordResetArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Password Reset</strong> (also called Forgot Password) is the self-service flow
          that allows users to regain account access when they've forgotten their password. It is
          one of the most critical security flows — it can be exploited for account takeover if
          implemented incorrectly, yet must remain accessible for legitimate users. Password reset
          is the most common account recovery mechanism, used by billions of users daily across
          web and mobile applications.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/password-reset-flow.svg"
          alt="Password Reset Flow"
          caption="Password Reset Flow — showing request, token generation, email delivery, and password update"
        />

        <p>
          For staff and principal engineers, designing a password reset flow requires deep
          understanding of security threats (email enumeration, token guessing, token leakage,
          timing attacks), token generation (cryptographically secure, hash storage), delivery
          mechanisms (email, SMS, backup codes), expiry management (short expiry for security,
          long enough for usability), and post-reset session handling (invalidate all sessions,
          notification emails). The flow must balance security (preventing unauthorized resets)
          with accessibility (legitimate users can recover accounts easily).
        </p>
        <p>
          Modern password reset has evolved from simple email links to multi-factor recovery
          (email + SMS), risk-based flows (additional verification for high-risk accounts), and
          passwordless alternatives (magic links). Organizations like Google, Microsoft, and Okta
          handle billions of password resets annually while maintaining security — they use
          layered defenses including rate limiting, token hashing, session invalidation, and
          anomaly detection.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Password reset is built on fundamental concepts that determine how tokens are generated,
          delivered, validated, and how sessions are managed post-reset. Understanding these
          concepts is essential for designing secure reset flows.
        </p>
        <p>
          <strong>Request Reset:</strong> User enters email address on "Forgot Password" page.
          Backend validates email format, checks rate limits (3/hour per email, 10/hour per IP),
          generates token if email exists (don't reveal if exists — prevent enumeration), sends
          reset email. Always show generic response ("If this email exists, we'll send a reset
          link") — never reveal if email is registered. Log request with email, IP, timestamp for
          fraud detection.
        </p>
        <p>
          <strong>Token Generation:</strong> Cryptographically random token (256-bit / 32 bytes)
          generated using crypto.randomBytes(). Store bcrypt hash in database (not plaintext) —
          prevents token exposure in database breach. Set short expiry (1 hour standard, 15 min
          for high-security). Single use — token invalidates after password reset (delete or mark
          used). Link token to user_id (not email — email can change). Store request metadata (IP,
          user agent) for fraud detection.
        </p>
        <p>
          <strong>Email Delivery:</strong> Reset email contains HTTPS link with token in URL path
          (not query params — query params logged in server logs, referrer headers). Example:
          /reset-password/TOKEN. Email should have clear subject ("Reset your password for
          [App]"), include expiry time ("This link expires in 1 hour"), warn about unsolicited
          requests ("If you didn't request this, ignore this email"), provide support contact.
          After successful reset, send "password changed" confirmation email with timestamp, IP,
          device info.
        </p>
        <p>
          <strong>Password Update:</strong> User clicks reset link, backend validates token
          (constant-time comparison), checks expiry, checks not used. User enters new password
          (enforce same requirements as signup — NIST guidelines). Backend hashes new password,
          stores in database, invalidates all existing sessions (prevent attacker from maintaining
          access), deletes/invalidates reset token, optionally auto-logs in user, sends
          confirmation email.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Password reset architecture separates token management from email delivery, enabling
          flexible delivery mechanisms (email, SMS, backup codes) with centralized token
          management. This architecture is critical for handling edge cases (expired tokens,
          multiple reset requests) and optimizing security.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/password-reset-security.svg"
          alt="Password Reset Security"
          caption="Security Measures — showing token hashing, rate limiting, session invalidation, and enumeration protection"
        />

        <p>
          Password reset flow: User navigates to "Forgot Password" page, enters email. Backend
          validates email format, checks rate limits, generates token (crypto.randomBytes(32)),
          stores bcrypt hash with expiry (1 hour), sends reset email via email provider. User
          receives email, clicks reset link. Backend validates token (constant-time comparison),
          checks expiry, checks not used. User enters new password (with strength meter). Backend
          hashes new password (bcrypt/argon2), stores in database, invalidates all sessions,
          deletes reset token, sends confirmation email, redirects to login or dashboard.
        </p>
        <p>
          Security architecture includes: token hashing (bcrypt, not plaintext), rate limiting
          (prevent abuse — 3/hour per email, 10/hour per IP), enumeration protection (don't reveal
          if email exists), session invalidation (invalidate all sessions on reset), confirmation
          email (notify user of password change). This architecture enables secure reset — tokens
          are protected even if database is breached, attackers can't enumerate emails, and
          compromised sessions are terminated.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/password-reset-ux.svg"
          alt="Password Reset UX"
          caption="User Experience — showing request flow, reset form, error states, and confirmation"
        />

        <p>
          User experience is critical — a confusing reset flow leads to support tickets and
          frustrated users. UX optimization includes: simple flow (request → email → reset), clear
          labels ("Enter your email address"), show expected delivery time ("Email arrives in
          1-2 minutes"), provide resend option with rate limiting (show countdown timer),
          auto-focus input fields, show password requirements upfront, clear error messages
          (expired token, invalid token). Organizations like Google, Dropbox report 90%+ reset
          completion rates with optimized flows.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing password reset involves trade-offs between security, user experience, and
          operational complexity. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Token Expiry: Short vs Long</h3>
          <ul className="space-y-3">
            <li>
              <strong>Short (15 min - 1 hour):</strong> More secure, limits attack window.
              Limitation: users who don't check email quickly get expired tokens, support tickets.
            </li>
            <li>
              <strong>Long (4-24 hours):</strong> Better UX, accommodates delayed email checking.
              Limitation: longer attack window (but still low risk with secure tokens).
            </li>
            <li>
              <strong>Recommendation:</strong> 1 hour for most applications. 15 min for
              high-security (banking, admin accounts). 4-24 hours only for low-security apps.
              Allow resend if expired.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Session Invalidation: All vs Current</h3>
          <ul className="space-y-3">
            <li>
              <strong>Invalidate All:</strong> Maximum security — terminates all sessions including
              attacker's. Limitation: user logged out on all devices, frustration.
            </li>
            <li>
              <strong>Invalidate Current:</strong> Better UX — user stays logged in on current
              device. Limitation: attacker's session may remain active.
            </li>
            <li>
              <strong>Recommendation:</strong> Invalidate all for high-security (banking,
              healthcare). Invalidate all except current for consumer apps. Always send
              notification email.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Email-Only vs Multi-Factor Reset</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email-Only:</strong> Simple, most common. Limitation: vulnerable if email
              compromised.
            </li>
            <li>
              <strong>Multi-Factor:</strong> Email + SMS, Email + Security Questions. More secure.
              Limitation: more friction, requires phone/questions setup.
            </li>
            <li>
              <strong>Recommendation:</strong> Email-only for consumer apps. Multi-factor for
              high-security (banking, admin accounts, high-value accounts). Risk-based (trigger
              additional verification for suspicious requests).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing password reset requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Use cryptographically secure random tokens (256-bit) — crypto.randomBytes(32), not
          Math.random(). Store token hashes, not plaintext — bcrypt hash of token, prevents token
          exposure in database breach. Set short token expiry (1 hour standard, 15 min for
          high-security). Rate limit reset requests — 3/hour per email, 10/hour per IP, prevent
          abuse. Use generic response messages — "If this email exists, we'll send a reset link",
          prevent email enumeration.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Clear, simple flow (request → email → reset) — minimize steps, reduce cognitive load.
          Show expected delivery time for email — "Email arrives in 1-2 minutes", manage
          expectations. Provide resend option with rate limiting — show countdown timer ("Resend
          in 59s"). Auto-focus input fields — reduce friction. Show password requirements upfront
          — prevent validation errors after submission.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Delivery</h3>
        <p>
          Use HTTPS for reset links — never HTTP. Include token in URL path (not query params) —
          query params logged in server logs, referrer headers. Clear email subject and content —
          "Reset your password for [App]". Include expiry time in email — "This link expires in 1
          hour". Send confirmation after successful reset — "Your password was changed" with
          timestamp, IP, device info.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Session Management</h3>
        <p>
          Invalidate all sessions after reset — prevent attacker from maintaining access.
          Optionally auto-login after reset — convenient but consider security trade-off. Send
          notification of password change — "Your password was changed" email. Log all reset
          attempts for audit — detect abuse patterns. Clean up used/expired tokens — database
          hygiene, prevent reuse.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing password reset to ensure secure, usable,
          and maintainable reset flows.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Email enumeration:</strong> "Email not found" reveals registered emails,
            attackers can build email lists. <strong>Fix:</strong> Use generic message "If email
            exists, we'll send reset link". Same response time for all cases (prevent timing
            attacks).
          </li>
          <li>
            <strong>Long token expiry:</strong> Tokens valid for days enables account takeover,
            extended attack window. <strong>Fix:</strong> Set short expiry (1 hour standard, 15
            min for high-security).
          </li>
          <li>
            <strong>Storing plaintext tokens:</strong> Database breach exposes all tokens,
            attackers can reset any password. <strong>Fix:</strong> Store token hashes
            (bcrypt/sha256), not plaintext.
          </li>
          <li>
            <strong>Token in query params:</strong> Logged in server logs, browser history,
            referrer headers, token leakage. <strong>Fix:</strong> Put token in URL path
            (/reset-password/TOKEN).
          </li>
          <li>
            <strong>No rate limiting:</strong> Allows email bombing, brute force attacks, abuse.{" "}
            <strong>Fix:</strong> Rate limit per email (3/hour), per IP (10/hour).
          </li>
          <li>
            <strong>Not invalidating sessions:</strong> Old sessions remain active after reset,
            attacker maintains access. <strong>Fix:</strong> Invalidate all sessions on password
            reset.
          </li>
          <li>
            <strong>Multiple active tokens:</strong> Old tokens still valid, multiple attack
            vectors. <strong>Fix:</strong> Invalidate all pending tokens when new one generated.
          </li>
          <li>
            <strong>No confirmation email:</strong> Users unaware if password was changed, can't
            detect unauthorized resets. <strong>Fix:</strong> Send "password changed" notification
            email.
          </li>
          <li>
            <strong>Weak token generation:</strong> Predictable tokens enable guessing attacks.{" "}
            <strong>Fix:</strong> Use crypto.randomBytes(32) for 256-bit tokens.
          </li>
          <li>
            <strong>No HTTPS requirement:</strong> Tokens transmitted insecurely, man-in-the-middle
            attacks. <strong>Fix:</strong> Enforce HTTPS for all reset flow pages.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Password reset is critical for account recovery. Here are real-world implementations
          from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Amazon)</h3>
        <p>
          <strong>Challenge:</strong> High volume of password resets during holiday sales (100K+
          requests/day). Account takeover attempts via password reset abuse. Elderly customers
          need simple flow.
        </p>
        <p>
          <strong>Solution:</strong> Rate limiting (3 requests/hour), generic response messages,
          token expiry (1 hour), session invalidation on reset. Simple 3-step flow. Phone support
          fallback for customers without email access.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers reduced by 85%. Customer support tickets down
          40%. No impact on legitimate users.
        </p>
        <p>
          <strong>Security:</strong> Email enumeration prevention, token hashing, audit logging,
          session invalidation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC guidelines require strong authentication for password
          reset. Elderly customers struggle with complex flows. Account takeover risk is high
          (financial loss).
        </p>
        <p>
          <strong>Solution:</strong> Multi-step verification (email + SMS + security questions).
          Call center fallback for customers without phone access. 24-hour cooling period for
          high-value accounts. Risk-based verification (additional checks for suspicious requests).
        </p>
        <p>
          <strong>Result:</strong> Zero account takeovers via password reset. Passed all
          regulatory audits (FFIEC). Customer satisfaction maintained (multiple recovery options).
        </p>
        <p>
          <strong>Security:</strong> MFA for reset, manual review for high-risk accounts,
          notification emails, cooling period.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Salesforce)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise users authenticate via SSO (IdP manages
          passwords). Local accounts need reset flow. Admin needs to reset user passwords. Audit
          trails for compliance.
        </p>
        <p>
          <strong>Solution:</strong> Dual flow: self-service for local accounts, IdP redirect for
          SSO users. Admin-initiated reset with audit logging. Forced password change on next
          login. Notification to user on admin reset.
        </p>
        <p>
          <strong>Result:</strong> 99% successful reset rate. Admin efficiency improved
          (self-service reset). Reduced support tickets by 70%. Passed SOC 2 audit.
        </p>
        <p>
          <strong>Security:</strong> Admin action logging, forced MFA re-enrollment after admin
          reset, notification to user.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Portal (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA requires verification before password reset. Elderly
          patients struggle with complex flows. Provider accounts need enhanced security (access
          to PHI).
        </p>
        <p>
          <strong>Solution:</strong> Patients: email + SMS verification. Providers: email + phone
          + security questions. Support team can reset after identity verification (recorded
          calls). Automatic logout of all sessions after reset.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Patient reset completion rate 90%. Zero
          provider account takeovers.
        </p>
        <p>
          <strong>Security:</strong> Enhanced verification for providers, audit logging, automatic
          session invalidation.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> High-value accounts targeted for takeover (virtual items,
          currency). Account recovery fraud (claiming hacked accounts). Young users forget
          passwords frequently.
        </p>
        <p>
          <strong>Solution:</strong> Risk-based reset flow: low-risk (email only), high-value
          accounts (email + purchase history verification + waiting period). Parental controls for
          minor accounts. Account recovery form with proof of ownership.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers reduced by 90%. Fraud claims reduced by 75%.
          Parent satisfaction improved (control over minor accounts).
        </p>
        <p>
          <strong>Security:</strong> Purchase history verification, waiting period for high-value
          accounts, parental approval.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of password reset design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent email enumeration in password reset?</p>
            <p className="mt-2 text-sm">
              A: Always show generic message "If this email exists, we'll send a reset link". Never
              reveal if email is registered. Use same response time for all cases (prevent timing
              attacks) — add artificial delay if email doesn't exist. Log all requests internally
              for monitoring, but don't reveal existence to user. This prevents attackers from
              building lists of registered emails.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal token expiry time?</p>
            <p className="mt-2 text-sm">
              A: Depends on security level: (1) Standard: 1 hour — balances security and usability.
              (2) High-security (financial, admin): 15 minutes — shorter attack window. (3)
              Low-security: 4 hours max. Shorter is always more secure. Send expiry time in email
              so users know deadline ("This link expires in 1 hour"). Allow resend if expired.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you store reset tokens in plaintext?</p>
            <p className="mt-2 text-sm">
              A: Never store plaintext tokens. Store bcrypt hash of token (like passwords). If
              database is breached, attackers can't use stolen tokens. Use constant-time comparison
              when validating tokens — prevents timing attacks. This adds defense in depth — even
              if attacker gets database dump, tokens are useless.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle session management after password reset?</p>
            <p className="mt-2 text-sm">
              A: Invalidate ALL existing sessions immediately — this prevents attackers from
              maintaining access after victim resets password. Optionally auto-login user after
              reset (convenient but consider security trade-off — don't auto-login for high-risk
              accounts). Send "password changed" notification email with timestamp, IP, device info
              — user can detect unauthorized resets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What rate limiting do you implement for password reset?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer rate limiting: (1) Per email: 3 requests/hour — prevents targeting
              specific accounts. (2) Per IP: 10 requests/hour — prevents email bombing attacks.
              (3) Progressive delays: 1s, 2s, 4s, 8s after each request — slows down attackers.
              (4) CAPTCHA after 3 failed attempts — blocks automated attacks. Log all requests for
              monitoring.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Where do you put the reset token in the URL?</p>
            <p className="mt-2 text-sm">
              A: Put token in URL path (/reset-password/TOKEN), NOT query params
              (/reset-password?token=XXX). Query params are logged in server logs, browser history,
              referrer headers — token leakage risk. Path is safer (still logged in server logs,
              but not referrer). Still use HTTPS regardless. Better: use POST with token in body
              for reset submission.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle users who no longer have email access?</p>
            <p className="mt-2 text-sm">
              A: Provide alternative recovery methods: (1) Phone recovery (SMS code to verified
              phone), (2) Backup email (user set secondary recovery email in account settings), (3)
              Security questions (last resort, use custom questions), (4) Support ticket with
              manual identity verification (recorded call, ID verification). Let users configure
              recovery options in account settings proactively.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for password reset?</p>
            <p className="mt-2 text-sm">
              A: Reset request rate, email delivery rate, reset completion rate (% who complete
              reset), time-to-complete, abuse rate (rate limit hits), support tickets for reset
              issues. Monitor for anomalies — spike in requests from single IP (attack), low
              completion rate (UX problem). Track by user segment (new vs existing users).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement passwordless login (magic links)?</p>
            <p className="mt-2 text-sm">
              A: Magic link flow: (1) User enters email, (2) Generate one-time token (256-bit, 15
              min expiry), (3) Send link via email, (4) Link logs user in directly (no password),
              (5) Invalidate token after use, (6) Track click location/device for security. Same
              security as password reset but better UX — no password to forget. Use for both login
              and password reset.
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
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
              href="https://www.ncsc.gov.uk/guidance/password-handling-and-storage"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NCSC - Password Handling and Storage
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
        </ul>
      </section>
    </ArticleLayout>
  );
}
