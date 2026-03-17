"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
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
        <p>
          For staff and principal engineers, implementing email verification requires 
          understanding token generation, secure delivery, verification flows, handling 
          unverified accounts, and balancing security with user experience. The implementation 
          must handle edge cases (typos, disposable emails, delayed delivery) while preventing 
          abuse (email bombing, account enumeration).
        </p>
      </section>

      <section>
        <h2>Verification Flow</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 1: Generate Verification Token</h3>
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
          <h3 className="mb-4 text-lg font-semibold">Step 2: Send Verification Email</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email Content:</strong> Clear subject ("Verify your email"), verification 
              link, manual code option, expiry time, security notice.
            </li>
            <li>
              <strong>Verification Link:</strong> HTTPS URL with token. Example: 
              /verify-email?token=xxx. Auto-verify on click.
            </li>
            <li>
              <strong>Manual Code:</strong> 6-digit code as fallback. User enters in app. 
              Auto-submit on complete.
            </li>
            <li>
              <strong>Delivery Tracking:</strong> Track sent timestamp, delivery status, 
              bounce handling. Retry failed deliveries.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 3: Handle Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Token Validation:</strong> Verify token exists, not expired, not used. 
              Constant-time comparison.
            </li>
            <li>
              <strong>Mark Verified:</strong> Set email_verified = true, verified_at timestamp. 
              Clear verification token.
            </li>
            <li>
              <strong>Auto-Login:</strong> If verifying during signup flow, auto-login and 
              redirect to onboarding.
            </li>
            <li>
              <strong>Confirmation:</strong> Show success message. Redirect to app or login.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 4: Handle Unverified Accounts</h3>
          <ul className="space-y-3">
            <li>
              <strong>Limited Access:</strong> Allow limited app access with unverified email. 
              Restrict sensitive actions (payments, data export).
            </li>
            <li>
              <strong>Persistent Reminders:</strong> Show banner prompting verification. 
              Dismissible but reappears.
            </li>
            <li>
              <strong>Resend Option:</strong> Allow resending verification email. Rate limit 
              (3 requests/hour).
            </li>
            <li>
              <strong>Cleanup:</strong> Delete unverified accounts after 7 days. Free up 
              email addresses.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <ul className="space-y-3">
          <li>
            <strong>Token Security:</strong> Store hash, not plaintext. Use secure random 
            generation.
          </li>
          <li>
            <strong>Rate Limiting:</strong> Limit verification requests per email/IP. Prevent 
            email bombing.
          </li>
          <li>
            <strong>Email Enumeration:</strong> Don't reveal if email is registered during 
            verification flow.
          </li>
          <li>
            <strong>HTTPS Only:</strong> Verification links must be HTTPS. Prevent token 
            interception.
          </li>
        </ul>
      </section>

      <section>
        <h2>UX Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Clear Instructions:</strong> Explain why verification is needed. Show 
            what to expect.
          </li>
          <li>
            <strong>Resend Countdown:</strong> Show time until resend available. Prevent 
            frustration.
          </li>
          <li>
            <strong>Check Spam Folder:</strong> Remind users to check spam/promotions folders.
          </li>
          <li>
            <strong>Alternative Email:</strong> Allow changing email if typo. Re-verify new 
            email.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Deep link from email to app. Universal 
            links/iOS, App Links/Android.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How long should email verification tokens be valid?</p>
            <p className="mt-2 text-sm">
              A: 24-72 hours balances user convenience (time to find email) with security 
              (attack window). Allow regeneration if expired. Delete unverified accounts 
              after 7 days.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you allow login with unverified email?</p>
            <p className="mt-2 text-sm">
              A: Depends on risk tolerance. Allow with restrictions (no payments, limited 
              features). Show persistent verification reminder. For high-security apps, 
              require verification before any access.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email typos during signup?</p>
            <p className="mt-2 text-sm">
              A: Allow changing email before verification. Re-send verification to new email. 
              Invalidate old token. For typos discovered later, require current email access 
              or account recovery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent email bombing via verification?</p>
            <p className="mt-2 text-sm">
              A: Rate limit: 3 verification emails/hour per email/IP. CAPTCHA after suspicious 
              activity. Monitor for patterns (many emails to same domain). Use email validation 
              before sending.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should you use link or code for verification?</p>
            <p className="mt-2 text-sm">
              A: Both. Link is primary (one-click, best UX). Code is fallback (email client 
              blocks links, mobile app deep linking issues). Support both for maximum 
              conversion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle email verification for existing users changing email?</p>
            <p className="mt-2 text-sm">
              A: Verify new email before switching. Send confirmation to old email (security 
              notice). Keep old email active until new is verified. Require password/PIN for 
              email change.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
