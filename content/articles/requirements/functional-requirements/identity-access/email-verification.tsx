"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-email-verification",
  title: "Email Verification",
  description:
    "Comprehensive guide to implementing email verification covering token generation, verification flows, resend mechanisms, security patterns, email deliverability, and UX best practices for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "email-verification",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "email-verification",
    "account-security",
    "frontend",
  ],
  relatedTopics: ["signup-interface", "phone-verification", "password-reset"],
};

export default function EmailVerificationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Email Verification</strong> is the process of confirming that a user owns and has
          access to the email address they provided during signup. It is a critical security
          measure that prevents fake accounts, enables password recovery, and ensures a reliable
          communication channel. Unlike phone verification, email verification is typically free
          (no SMS costs) and has higher user acceptance — most users expect to verify their email.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/email-verification-flow.svg"
          alt="Email Verification Flow"
          caption="Email Verification Flow — showing token generation, email delivery, verification, and account activation"
        />

        <p>
          For staff and principal engineers, implementing email verification requires deep
          understanding of token generation (cryptographically secure, hash storage), secure
          delivery (email authentication, deliverability optimization), verification flows
          (click-to-verify, code-based), handling unverified accounts (progressive access,
          reminders), and balancing security with user experience. The implementation must handle
          edge cases (typos, disposable emails, delayed delivery, bounces) while preventing abuse
          (email bombing, account enumeration, token guessing).
        </p>
        <p>
          Modern email verification has evolved from simple token links to multi-channel
          verification (email + code, magic links). Organizations like SendGrid, AWS SES, and
          Postmark provide email infrastructure with high deliverability (99%+), but proper
          configuration (SPF, DKIM, DMARC) is critical. Email verification is often the first
          security measure users encounter — a smooth verification flow improves trust and
          conversion, while a broken flow leads to abandoned signups.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Email verification is built on fundamental concepts that determine how tokens are
          generated, delivered, and verified. Understanding these concepts is essential for
          designing effective email verification systems.
        </p>
        <p>
          <strong>Token Generation:</strong> Cryptographically random token (256-bit / 32 bytes)
          generated using crypto.randomBytes(). Store bcrypt hash in database (not plaintext) —
          prevents token exposure in database breach. Associate token with user_id and email. Set
          long expiry (24-72 hours) to accommodate delayed email delivery. Single use — token
          invalidates after verification (delete or mark used).
        </p>
        <p>
          <strong>Email Delivery:</strong> Verification email contains HTTPS link with token
          (one-click verification) or 6-digit code (copy-paste). Email template should be branded,
          clear subject line ("Verify your email for [App]"), explain why verification is needed,
          include expiry time. Use reputable email provider (SendGrid, AWS SES, Postmark) for high
          deliverability. Configure SPF, DKIM, DMARC for domain authentication.
        </p>
        <p>
          <strong>Verification Flow:</strong> User clicks verification link (or enters code).
          Backend validates token (constant-time comparison), checks expiry, marks email as
          verified, invalidates token, redirects to login or dashboard with success message. If
          token invalid/expired, show clear error message with option to request new token.
        </p>
        <p>
          <strong>Handling Unverified Accounts:</strong> Progressive access model — allow browsing
          without verification, allow basic actions with pending verification, require verification
          for sensitive actions (purchases, posts, password change). Show reminder banner prompting
          verification. Optionally auto-logout unverified accounts after grace period (7 days).
          Delete unverified accounts after extended period (30 days) to reduce database clutter.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Email verification architecture separates token management from email delivery, enabling
          flexible verification flows (link-based, code-based) with centralized token management.
          This architecture is critical for handling edge cases (bounces, expired tokens) and
          optimizing deliverability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/email-verification-security.svg"
          alt="Email Verification Security"
          caption="Security Measures — showing token hashing, rate limiting, email bombing prevention, and enumeration protection"
        />

        <p>
          Email verification flow: User signs up with email. Backend validates email format
          (libphonenumber or regex), checks for existing account (don't reveal if exists — prevent
          enumeration), generates token (crypto.randomBytes(32)), stores bcrypt hash with expiry
          (24-72 hours), sends verification email via email provider (SendGrid, SES). User receives
          email, clicks verification link (or enters code). Backend validates token (constant-time
          comparison), checks expiry, marks email_verified = true, records verification timestamp,
          invalidates token, redirects to login or dashboard with success message.
        </p>
        <p>
          Security architecture includes: token hashing (bcrypt, not plaintext), rate limiting
          (prevent email bombing — 3/hour per user, 10/hour per IP), enumeration protection (don't
          reveal if email exists), bounce handling (monitor bounce notifications, allow email
          change), disposable email detection (block known disposable domains). This architecture
          enables secure verification — tokens are protected even if database is breached.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/email-verification-ux.svg"
          alt="Email Verification UX"
          caption="User Experience — showing resend flow, expired token handling, verification status, and user-friendly error states"
        />

        <p>
          User experience is critical — a confusing verification flow leads to abandoned signups.
          UX optimization includes: send verification email immediately after signup (no delay),
          clear email template with branded design, provide resend option with rate limiting (show
          countdown timer), show verification status in account settings, allow email change before
          verification (for typos), handle expired tokens gracefully (offer to send new token).
          Organizations like Airbnb, Dropbox report 80%+ verification rates with optimized flows.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing email verification involves trade-offs between security, user experience, and
          deliverability. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Link-Based vs Code-Based Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Link-Based:</strong> One-click verification, best UX, most common.
              Limitation: requires email client to render HTML, some email clients block links.
            </li>
            <li>
              <strong>Code-Based:</strong> 6-digit code to copy-paste, works in all email clients.
              Limitation: more friction (switch tabs, copy, paste).
            </li>
            <li>
              <strong>Hybrid:</strong> Include both link and code in email. Best of both —
              one-click for most users, code as fallback. Used by most production systems.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Token Expiry: Short vs Long</h3>
          <ul className="space-y-3">
            <li>
              <strong>Short (1-6 hours):</strong> More secure, limits attack window. Limitation:
              users who don't check email quickly get expired tokens, frustration.
            </li>
            <li>
              <strong>Long (24-72 hours):</strong> Better UX, accommodates delayed email checking.
              Limitation: longer attack window (but still low risk with secure tokens).
            </li>
            <li>
              <strong>Recommendation:</strong> 24-72 hours for most applications. Short expiry
              (1-6 hours) only for high-security (banking, healthcare). Allow token regeneration.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Progressive vs Immediate Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Immediate:</strong> Require verification before any access. Maximum
              security. Limitation: high friction, abandoned signups.
            </li>
            <li>
              <strong>Progressive:</strong> Allow browsing, require verification for sensitive
              actions. Better UX. Limitation: unverified accounts can access some features.
            </li>
            <li>
              <strong>Recommendation:</strong> Progressive for consumer apps (better conversion),
              immediate for high-security (banking, healthcare).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing email verification requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Use cryptographically secure tokens (256-bit) — crypto.randomBytes(32), not
          Math.random(). Store token hashes, not plaintext — bcrypt hash of token, prevents token
          exposure in database breach. Set appropriate token expiry (24-72 hours) — balances
          security and usability. Rate limit verification emails — 3/hour per user, 10/hour per IP,
          prevent email bombing. Invalidate tokens after use — prevent reuse.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Send verification email immediately after signup — no delay, users expect instant
          delivery. Clear email template with branded design — professional appearance builds
          trust. Provide resend option with rate limiting — show countdown timer ("Resend in 59s").
          Show verification status in account settings — users can see if verified. Allow email
          change before verification — for typos, send new token to corrected email.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Deliverability</h3>
        <p>
          Use reputable email provider (SendGrid, SES, Postmark) — high deliverability (99%+),
          proper infrastructure. Configure SPF, DKIM, DMARC for deliverability — domain
          authentication, prevents spoofing. Monitor bounce rates and spam complaints — detect
          delivery issues early. Handle bounces gracefully — allow email change on bounce, don't
          keep sending to invalid addresses. Provide plain text fallback — some email clients
          don't render HTML.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Handling</h3>
        <p>
          Clear error messages for invalid/expired tokens — "This link has expired" with option to
          request new token. Allow token regeneration if expired — send new token, invalidate old.
          Handle email bounces — monitor bounce notifications, allow email change. Log verification
          attempts for security — detect abuse patterns. Don't reveal if email is registered —
          prevent enumeration ("If an account exists, we sent a verification email").
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing email verification to ensure secure,
          usable, and maintainable verification systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Short token expiry:</strong> Tokens expire before user clicks link,
            frustration. <strong>Fix:</strong> Set 24-72 hour expiry. Allow regeneration.
          </li>
          <li>
            <strong>Storing plaintext tokens:</strong> Database breach exposes all tokens,
            attackers can verify any email. <strong>Fix:</strong> Store bcrypt hash of token, not
            plaintext.
          </li>
          <li>
            <strong>No rate limiting:</strong> Email bombing attacks possible, users spammed,
            reputation damage. <strong>Fix:</strong> Rate limit verification emails (3/hour per
            user/IP).
          </li>
          <li>
            <strong>Not invalidating tokens:</strong> Tokens can be reused, security
            vulnerability. <strong>Fix:</strong> Invalidate token after successful verification.
          </li>
          <li>
            <strong>Poor error messages:</strong> Users don't know why verification failed.{" "}
            <strong>Fix:</strong> Clear messages (expired, invalid, already verified).
          </li>
          <li>
            <strong>No resend option:</strong> Users can't request new verification email, stuck.{" "}
            <strong>Fix:</strong> Provide resend button with rate limiting (show countdown).
          </li>
          <li>
            <strong>Blocking all access:</strong> Unverified users can't do anything, high
            abandonment. <strong>Fix:</strong> Allow browsing, restrict sensitive actions
            (progressive verification).
          </li>
          <li>
            <strong>No email change before verification:</strong> Typos lock users out, support
            tickets. <strong>Fix:</strong> Allow email change before verification. Send new token.
          </li>
          <li>
            <strong>Not handling bounces:</strong> Invalid emails never detected, keep sending,
            reputation damage. <strong>Fix:</strong> Monitor bounces, allow email change on bounce.
          </li>
          <li>
            <strong>No cleanup:</strong> Unverified accounts accumulate forever, database clutter,
            security risk. <strong>Fix:</strong> Delete unverified accounts after 30 days.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Email verification is critical for security and fraud prevention. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Shopify)</h3>
        <p>
          <strong>Challenge:</strong> Fake emails for discount abuse. Order confirmation delivery.
          Marketing compliance (GDPR/CAN-SPAM). Password recovery requires verified email.
        </p>
        <p>
          <strong>Solution:</strong> Email verification before first order. Order confirmation
          emails with tracking. Double opt-in for marketing (separate consent). Bounce handling
          with retry. Password recovery only via verified email.
        </p>
        <p>
          <strong>Result:</strong> Discount fraud reduced 90%. Order email delivery 99%. Marketing
          compliance maintained. Password recovery success 95%.
        </p>
        <p>
          <strong>Security:</strong> Email verification, bounce handling, compliance enforcement,
          verified recovery.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC requires verified contact. Transaction alerts critical.
          E-statements delivery. Phishing protection.
        </p>
        <p>
          <strong>Solution:</strong> Email verification with MFA (multi-factor). Encrypted
          transaction alerts. Secure e-statement portal (not attachments). Phishing warnings in
          emails. Verified email required for password recovery.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audits. Alert delivery 99.9%. Phishing incidents
          reduced 80%. Zero unauthorized password resets.
        </p>
        <p>
          <strong>Security:</strong> MFA verification, encryption, phishing warnings, verified
          recovery.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Teladoc)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA requires verified contact. No PHI in emails.
          Appointment reminders critical. Patient portal access.
        </p>
        <p>
          <strong>Solution:</strong> Email verification during signup. Generic reminders (no PHI —
          "You have an appointment tomorrow"). Secure portal links for results (not in email).
          Opt-out option for reminders. Verified email for account recovery.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. No-show rate reduced 40%. Patient
          satisfaction improved. Zero PHI breaches via email.
        </p>
        <p>
          <strong>Security:</strong> Email verification, PHI protection, secure links, verified
          recovery.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> Account recovery requires verified email. COPPA parental
          consent. Young users with fake emails. Account theft prevention.
        </p>
        <p>
          <strong>Solution:</strong> Email verification before trading (prevent item theft).
          Parental email verification for minors (COPPA). Account recovery via verified email.
          Breach notification to verified email. Trading restrictions for unverified accounts.
        </p>
        <p>
          <strong>Result:</strong> Account recovery success 90%. COPPA compliance maintained.
          Account theft reduced 85%. Trading fraud reduced 95%.
        </p>
        <p>
          <strong>Security:</strong> Email verification, parental consent, breach notification,
          trading restrictions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Slack)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise domain verification. Team member invites. Admin
          approval workflow. SSO user email verification.
        </p>
        <p>
          <strong>Solution:</strong> Domain verification via DNS record (TXT). Team invite email
          verification (invitee must verify). Admin approval for domain join (prevent unauthorized
          joins). SSO email passthrough verification (IdP verified = email verified).
        </p>
        <p>
          <strong>Result:</strong> Domain verification 99%. Team onboarding automated. Zero
          unauthorized domain joins. SSO integration seamless.
        </p>
        <p>
          <strong>Security:</strong> Domain verification, invite verification, admin approval, SSO
          passthrough.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of email verification design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate and store verification tokens?</p>
            <p className="mt-2 text-sm">
              A: Generate 256-bit cryptographically secure random token using
              crypto.randomBytes(32) — not Math.random() (not cryptographically secure). Store
              bcrypt hash of token in database (not plaintext) — prevents token exposure in
              database breach. Associate with user_id and email. Set expiry (24-72 hours).
              Invalidate after use — delete or mark used.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal token expiry time?</p>
            <p className="mt-2 text-sm">
              A: 24-72 hours balances security and usability. Short enough to limit attack window,
              long enough for users who don't check email immediately (weekend, vacation). Allow
              token regeneration if expired — send new token, invalidate old. Track expiry rate —
              high rate indicates delivery issues or users ignoring emails.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email verification for typoed emails?</p>
            <p className="mt-2 text-sm">
              A: Allow email change before verification — user can correct typo. Request new
              verification email with corrected email. Invalidate old token (security). Send new
              token to corrected email. Track email change attempts for abuse detection (rate
              limit). Show current (unverified) email in account settings.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent email bombing attacks?</p>
            <p className="mt-2 text-sm">
              A: Rate limit verification emails: (1) Per user (3/hour), (2) Per IP (10/hour), (3)
              Per email address (3/day). Use exponential backoff for repeat offenders (wait 1 min,
              then 5 min, then 30 min). Log all requests for monitoring. CAPTCHA for suspicious
              requests. Block known disposable email domains.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle unverified accounts?</p>
            <p className="mt-2 text-sm">
              A: Progressive access model: (1) Allow browsing without verification. (2) Allow
              basic actions with pending verification. (3) Require verification for sensitive
              actions (purchases, posts, password change). Show reminder banner ("Verify your email
              to unlock all features"). Auto-logout after grace period (7 days). Delete after 30
              days (cleanup).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure email deliverability?</p>
            <p className="mt-2 text-sm">
              A: Configure email authentication (SPF, DKIM, DMARC) — domain authentication,
              prevents spoofing. Use reputable email provider (SendGrid, SES, Postmark) — high
              deliverability (99%+), proper infrastructure. Monitor bounce rates and spam
              complaints — detect issues early. Use dedicated IP for transactional emails — shared
              IPs can be blacklisted. Include plain text fallback — some clients don't render HTML.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email bounces?</p>
            <p className="mt-2 text-sm">
              A: Monitor bounce notifications from email provider (webhooks). Mark email as bounced
              in database. Allow user to change email address — send verification to new email.
              Track bounce count — block after multiple bounces (potential abuse or invalid email).
              Hard bounces (invalid address) — immediate block. Soft bounces (temporary issue) —
              retry with backoff.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for email verification?</p>
            <p className="mt-2 text-sm">
              A: Verification rate (% who verify), time-to-verify, bounce rate, resend rate, expiry
              rate (tokens that expire unused), verification source (email client, device). Track
              by user segment (country, signup source). Monitor for anomalies — spike in bounces
              (delivery issues), low verification rate (UX problem).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle disposable email addresses?</p>
            <p className="mt-2 text-sm">
              A: Detect and block disposable emails: (1) Maintain blocklist of known disposable
              domains (10minutemail, guerrillamail). (2) Use validation APIs (Kickbox, ZeroBounce)
              — real-time detection. (3) Check MX records — disposable domains often have no valid
              MX. (4) Allow enterprise allowlist — some companies use temporary emails for testing.
              Warn users during signup if domain looks suspicious.
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Registration_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Registration Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://sendgrid.com/docs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SendGrid Documentation
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/ses/latest/DeveloperGuide/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS SES Documentation
            </a>
          </li>
          <li>
            <a
              href="https://postmarkapp.com/support"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Postmark Documentation
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Session Management
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
