"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-email-verification",
  title: "Email Verification",
  description: "Comprehensive guide to implementing email verification covering token generation, verification flows, resend mechanisms, security patterns, and UX best practices for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "email-verification",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "email-verification", "account-security", "frontend"],
  relatedTopics: ["signup-interface", "phone-verification", "password-reset", "authentication-service"],
};

export default function EmailVerificationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Email Verification</strong> is the process of confirming that a user owns
          and has access to the email address they provided during signup. It is a critical
          security measure that prevents fake accounts, enables password recovery, and ensures
          a reliable communication channel.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/email-verification-flow.svg"
          alt="Email Verification Flow"
          caption="Email Verification Flow — showing token generation, email delivery, verification, and account activation"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/email-verification-security.svg"
          alt="Email Verification Security"
          caption="Email Verification Security — showing token hashing, rate limiting, email bombing prevention, and enumeration protection"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/email-verification-ux.svg"
          alt="Email Verification Ux"
          caption="Email Verification UX — showing resend flow, expired token handling, and user-friendly error states"
        />
      
        <p>
          For staff and principal engineers, implementing email verification requires
          understanding token generation, secure delivery, verification flows, handling
          unverified accounts, and balancing security with user experience. The implementation
          must handle edge cases (typos, disposable emails, delayed delivery) while preventing
          abuse (email bombing, account enumeration).
        </p>

        

        

        

        

        
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready email verification flow must handle token generation, delivery, and verification securely.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Token Generation</h3>
          <ul className="space-y-3">
            <li>
              <strong>Token Format:</strong> Cryptographically random token (256-bit). Store
              hash in database. Associate with user_id.
            </li>
            <li>
              <strong>Expiry:</strong> Long expiry (24-72 hours) to accommodate delayed email
              delivery. Allow regeneration.
            </li>
            <li>
              <strong>Single Use:</strong> Token invalidates after verification. Delete or
              mark used.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Email Delivery</h3>
          <ul className="space-y-3">
            <li>
              <strong>Verification Link:</strong> HTTPS URL with token. Clear call-to-action
              button. Include fallback (copy-paste code).
            </li>
            <li>
              <strong>Email Template:</strong> Branded template. Clear subject line. Explain
              why verification is needed. Expiry time.
            </li>
            <li>
              <strong>Rate Limiting:</strong> Limit verification emails (3/hour) to prevent
              abuse. Track per user and IP.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Verification Flow</h3>
          <ul className="space-y-3">
            <li>
              <strong>Click Link:</strong> User clicks verification link. Token validated
              server-side.
            </li>
            <li>
              <strong>Mark Verified:</strong> Set email_verified flag. Record verification
              timestamp.
            </li>
            <li>
              <strong>Invalidate Token:</strong> Delete or mark token as used. Prevent reuse.
            </li>
            <li>
              <strong>Redirect:</strong> Redirect to login or dashboard. Show success message.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Handling Unverified Accounts</h3>
          <ul className="space-y-3">
            <li>
              <strong>Limited Access:</strong> Allow browsing but restrict actions (no posts,
              no purchases).
            </li>
            <li>
              <strong>Reminder Banners:</strong> Show verification reminder banner. Allow
              resend from banner.
            </li>
            <li>
              <strong>Auto-Logout:</strong> Optionally logout unverified accounts after
              grace period (7 days).
            </li>
            <li>
              <strong>Cleanup:</strong> Delete unverified accounts after extended period
              (30 days).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Use cryptographically secure tokens (256-bit)</li>
          <li>Store token hashes, not plaintext</li>
          <li>Set appropriate token expiry (24-72 hours)</li>
          <li>Rate limit verification emails</li>
          <li>Invalidate tokens after use</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Send verification email immediately after signup</li>
          <li>Clear email template with branded design</li>
          <li>Provide resend option with rate limiting</li>
          <li>Show verification status in account settings</li>
          <li>Allow email change before verification</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Delivery</h3>
        <ul className="space-y-2">
          <li>Use reputable email provider (SendGrid, SES)</li>
          <li>Configure SPF, DKIM, DMARC for deliverability</li>
          <li>Monitor bounce rates and spam complaints</li>
          <li>Handle bounces gracefully (allow email change)</li>
          <li>Provide plain text fallback</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Handling</h3>
        <ul className="space-y-2">
          <li>Clear error messages for invalid/expired tokens</li>
          <li>Allow token regeneration if expired</li>
          <li>Handle email bounces (allow email change)</li>
          <li>Log verification attempts for security</li>
          <li>Don't reveal if email is registered</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Short token expiry:</strong> Tokens expire before user clicks link.
            <br /><strong>Fix:</strong> Set 24-72 hour expiry. Allow regeneration.
          </li>
          <li>
            <strong>Storing plaintext tokens:</strong> Database breach exposes all tokens.
            <br /><strong>Fix:</strong> Store bcrypt hash of token, not plaintext.
          </li>
          <li>
            <strong>No rate limiting:</strong> Email bombing attacks possible.
            <br /><strong>Fix:</strong> Rate limit verification emails (3/hour per user/IP).
          </li>
          <li>
            <strong>Not invalidating tokens:</strong> Tokens can be reused.
            <br /><strong>Fix:</strong> Invalidate token after successful verification.
          </li>
          <li>
            <strong>Poor error messages:</strong> Users don't know why verification failed.
            <br /><strong>Fix:</strong> Clear messages (expired, invalid, already verified).
          </li>
          <li>
            <strong>No resend option:</strong> Users can't request new verification email.
            <br /><strong>Fix:</strong> Provide resend button with rate limiting.
          </li>
          <li>
            <strong>Blocking all access:</strong> Unverified users can't do anything.
            <br /><strong>Fix:</strong> Allow browsing, restrict sensitive actions.
          </li>
          <li>
            <strong>No email change before verification:</strong> Typos lock users out.
            <br /><strong>Fix:</strong> Allow email change before verification. Send new token.
          </li>
          <li>
            <strong>Not handling bounces:</strong> Invalid emails never detected.
            <br /><strong>Fix:</strong> Monitor bounces, allow email change on bounce.
          </li>
          <li>
            <strong>No cleanup:</strong> Unverified accounts accumulate forever.
            <br /><strong>Fix:</strong> Delete unverified accounts after 30 days.
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

        <h3 className="mt-8 mb-4 text-xl font-semibold">Email Deliverability</h3>
        <p>
          Ensure verification emails reach users' inboxes.
        </p>
        <ul className="space-y-2">
          <li><strong>Authentication:</strong> Configure SPF, DKIM, DMARC for domain.</li>
          <li><strong>Reputation:</strong> Use dedicated IP for transactional emails.</li>
          <li><strong>Content:</strong> Avoid spam trigger words. Include plain text version.</li>
          <li><strong>Monitoring:</strong> Track bounce rates, spam complaints, open rates.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Disposable Email Detection</h3>
        <p>
          Prevent signups with temporary email addresses.
        </p>
        <ul className="space-y-2">
          <li><strong>Blocklist:</strong> Maintain list of known disposable email domains.</li>
          <li><strong>API Services:</strong> Use services like Kickbox, ZeroBounce for validation.</li>
          <li><strong>MX Records:</strong> Check if domain has valid MX records.</li>
          <li><strong>Allowlist:</strong> For enterprise, allow only corporate domains.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Progressive Verification</h3>
        <p>
          Require verification only for sensitive actions.
        </p>
        <ul className="space-y-2">
          <li><strong>Browsing:</strong> Allow without verification.</li>
          <li><strong>Basic Actions:</strong> Allow with pending verification.</li>
          <li><strong>Sensitive Actions:</strong> Require verified email (purchases, posts).</li>
          <li><strong>Reminders:</strong> Show banner prompting verification.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate and store verification tokens?</p>
            <p className="mt-2 text-sm">
              A: Generate 256-bit cryptographically secure random token (crypto.randomBytes(32)). Store bcrypt hash of token in database (not plaintext). Associate with user_id and email. Set expiry (24-72 hours). Invalidate after use.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal token expiry time?</p>
            <p className="mt-2 text-sm">
              A: 24-72 hours balances security and usability. Short enough to limit attack window, long enough for users who don't check email immediately. Allow token regeneration if expired. Send new token on regeneration request.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email verification for typoed emails?</p>
            <p className="mt-2 text-sm">
              A: Allow email change before verification. User can request new verification email with corrected email. Invalidate old token. Send new token to corrected email. Track email change attempts for abuse detection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent email bombing attacks?</p>
            <p className="mt-2 text-sm">
              A: Rate limit verification emails: (1) Per user (3/hour), (2) Per IP (10/hour), (3) Per email address (3/day). Use exponential backoff for repeat offenders. Log all requests for monitoring.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle unverified accounts?</p>
            <p className="mt-2 text-sm">
              A: Progressive access: (1) Allow browsing without verification. (2) Allow basic actions with pending verification. (3) Require verification for sensitive actions (purchases, posts). Show reminder banner. Auto-logout after grace period (7 days). Delete after 30 days.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure email deliverability?</p>
            <p className="mt-2 text-sm">
              A: Configure email authentication (SPF, DKIM, DMARC). Use reputable email provider (SendGrid, SES). Monitor bounce rates and spam complaints. Use dedicated IP for transactional emails. Include plain text fallback. Avoid spam trigger words.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email bounces?</p>
            <p className="mt-2 text-sm">
              A: Monitor bounce notifications from email provider. Mark email as bounced in database. Allow user to change email address. Send verification to new email. Track bounce count. Block after multiple bounces (potential abuse).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for email verification?</p>
            <p className="mt-2 text-sm">
              A: Verification rate (% who verify), time-to-verify, bounce rate, resend rate, expiry rate (tokens that expire unused), verification source (email client, device). Track by user segment. Monitor for anomalies (spike in bounces).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle disposable email addresses?</p>
            <p className="mt-2 text-sm">
              A: Detect and block disposable emails: (1) Maintain blocklist of known disposable domains. (2) Use validation APIs (Kickbox, ZeroBounce). (3) Check MX records. (4) Allow enterprise allowlist. Warn users during signup if domain looks suspicious.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References and Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Registration_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Registration Cheat Sheet</a></li>
          <li><a href="https://sendgrid.com/docs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">SendGrid Documentation</a></li>
          <li><a href="https://docs.aws.amazon.com/ses/latest/DeveloperGuide/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">AWS SES Documentation</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Access Control Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Email Verification</h3>
        <p>
          Large e-commerce platform with 50M users, order confirmation and marketing emails.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Fake emails for discount abuse. Order confirmation delivery. Marketing compliance (GDPR/CAN-SPAM).</li>
          <li><strong>Solution:</strong> Email verification before first order. Order confirmation emails with tracking. Double opt-in for marketing. Bounce handling with retry.</li>
          <li><strong>Result:</strong> Discount fraud reduced 90%. Order email delivery 99%. Marketing compliance maintained.</li>
          <li><strong>Security:</strong> Email verification, bounce handling, compliance enforcement.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Email Verification</h3>
        <p>
          Online banking with FFIEC compliance, transaction alerts and statements via email.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> FFIEC requires verified contact. Transaction alerts critical. E-statements delivery. Phishing protection.</li>
          <li><strong>Solution:</strong> Email verification with MFA. Encrypted transaction alerts. Secure e-statement portal. Phishing warnings in emails.</li>
          <li><strong>Result:</strong> Passed FFIEC audits. Alert delivery 99.9%. Phishing incidents reduced 80%.</li>
          <li><strong>Security:</strong> MFA verification, encryption, phishing warnings.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Email Verification (HIPAA)</h3>
        <p>
          Telemedicine platform with HIPAA compliance, appointment reminders and test results.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> HIPAA requires verified contact. No PHI in emails. Appointment reminders critical. Patient portal access.</li>
          <li><strong>Solution:</strong> Email verification during signup. Generic reminders (no PHI). Secure portal links for results. Opt-out option for reminders.</li>
          <li><strong>Result:</strong> Passed HIPAA audits. No-show rate reduced 40%. Patient satisfaction improved.</li>
          <li><strong>Security:</strong> Email verification, PHI protection, secure links.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Email Verification</h3>
        <p>
          Online gaming platform with 100M users, account recovery and parental consent.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Account recovery requires verified email. COPPA parental consent. Young users with fake emails. Account theft prevention.</li>
          <li><strong>Solution:</strong> Email verification before trading. Parental email verification for minors. Account recovery via verified email. Breach notification to verified email.</li>
          <li><strong>Result:</strong> Account recovery success 90%. COPPA compliance maintained. Account theft reduced 85%.</li>
          <li><strong>Security:</strong> Email verification, parental consent, breach notification.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS Email Verification</h3>
        <p>
          B2B SaaS with 10,000 enterprise customers, domain verification and team invites.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Enterprise domain verification. Team member invites. Admin approval workflow. SSO user email verification.</li>
          <li><strong>Solution:</strong> Domain verification via DNS record. Team invite email verification. Admin approval for domain join. SSO email passthrough verification.</li>
          <li><strong>Result:</strong> Domain verification 99%. Team onboarding automated. Zero unauthorized domain joins.</li>
          <li><strong>Security:</strong> Domain verification, invite verification, admin approval.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
