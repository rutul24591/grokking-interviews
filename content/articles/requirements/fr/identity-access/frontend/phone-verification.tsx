"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-phone-verification",
  title: "Phone Verification",
  description: "Comprehensive guide to implementing phone verification covering SMS OTP, voice calls, WhatsApp verification, rate limiting, security patterns, and global considerations for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "phone-verification",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "phone-verification", "sms", "otp", "frontend"],
  relatedTopics: ["email-verification", "mfa-setup", "signup-interface", "authentication-service"],
};

export default function PhoneVerificationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Phone Verification</strong> is the process of confirming that a user owns 
          and has access to the phone number they provided. It is used for account security, 
          two-factor authentication, password recovery, and as an alternative to email for 
          regions with low email penetration.
        </p>
        <p>
          For staff and principal engineers, implementing phone verification requires 
          understanding SMS delivery challenges, OTP security, rate limiting, cost 
          optimization, and global considerations (different countries, carriers, regulations). 
          The implementation must handle edge cases (delayed SMS, wrong numbers, roaming) 
          while preventing abuse (SMS pumping, toll fraud).
        </p>
      </section>

      <section>
        <h2>Verification Methods</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SMS OTP</h3>
          <ul className="space-y-3">
            <li>
              <strong>Code Format:</strong> 4-6 digit numeric code. 6 digits recommended for 
              security. Short expiry (5-10 minutes).
            </li>
            <li>
              <strong>Delivery:</strong> Use SMS gateway (Twilio, Vonage, AWS SNS). Track 
              delivery status. Handle failures with retry.
            </li>
            <li>
              <strong>Auto-Read:</strong> SMS Retriever API (Android) for automatic code 
              extraction. No manual entry needed.
            </li>
            <li>
              <strong>Cost:</strong> $0.005-$0.05 per SMS depending on country. Optimize 
              with rate limiting and fraud detection.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Voice Call OTP</h3>
          <ul className="space-y-3">
            <li>
              <strong>Use Case:</strong> Fallback when SMS fails, accessibility for visually 
              impaired, regions with poor SMS delivery.
            </li>
            <li>
              <strong>Implementation:</strong> Automated voice call reads code. Same code 
              format as SMS.
            </li>
            <li>
              <strong>Cost:</strong> Higher than SMS ($0.01-$0.10 per call). Use as fallback 
              only.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">WhatsApp Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Use Case:</strong> Popular in emerging markets (India, Latin America, 
              Europe). Lower cost than SMS.
            </li>
            <li>
              <strong>Implementation:</strong> WhatsApp Business API. Send code via 
              WhatsApp message.
            </li>
            <li>
              <strong>Requirements:</strong> User must have WhatsApp installed and registered 
              with phone number.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Implementation Flow</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 1: Phone Number Input</h3>
          <ul className="space-y-3">
            <li>
              <strong>Country Selector:</strong> Dropdown with flags, country codes. 
              Auto-detect from IP (with override).
            </li>
            <li>
              <strong>Format Validation:</strong> Use libphonenumber for validation. Show 
              format hint (e.g., "### ### ####").
            </li>
            <li>
              <strong>Type:</strong> type="tel" for mobile keyboard optimization.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 2: Send OTP</h3>
          <ul className="space-y-3">
            <li>
              <strong>Generate Code:</strong> Cryptographically random 6-digit code. Store 
              hash with phone number and expiry.
            </li>
            <li>
              <strong>Rate Limiting:</strong> 3 codes/hour per phone, 10/hour per IP. 
              Cooldown between sends (60 seconds).
            </li>
            <li>
              <strong>Delivery:</strong> Send via SMS gateway. Track delivery status. 
              Fallback to voice if SMS fails.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 3: Code Entry</h3>
          <ul className="space-y-3">
            <li>
              <strong>Input UI:</strong> 6 separate boxes or single field. Auto-focus next 
              box on input.
            </li>
            <li>
              <strong>Auto-Submit:</strong> Submit automatically when all digits entered.
            </li>
            <li>
              <strong>Resend:</strong> Show countdown timer. Enable resend after cooldown.
            </li>
            <li>
              <strong>Wrong Number:</strong> Allow changing number. Invalidate old code.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 4: Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Validate Code:</strong> Constant-time comparison. Check expiry. Mark 
              phone as verified.
            </li>
            <li>
              <strong>Rate Limit Attempts:</strong> 5 attempts per code. Invalidate after 
              max attempts.
            </li>
            <li>
              <strong>Confirmation:</strong> Show success message. Continue flow.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Security Considerations</h2>
        <ul className="space-y-3">
          <li>
            <strong>SMS Pumping Fraud:</strong> Detect unusual patterns (many codes to same 
            prefix, high-value countries). Block suspicious IPs.
          </li>
          <li>
            <strong>Code Guessing:</strong> 6 digits = 1M combinations. Rate limit attempts 
            (5 max). Invalidate after failures.
          </li>
          <li>
            <strong>SIM Swapping:</strong> Phone verification vulnerable to SIM swap attacks. 
            Use as second factor, not primary auth for high-security.
          </li>
          <li>
            <strong>Interception:</strong> SMS can be intercepted. Use for verification, not 
            sensitive authentication.
          </li>
        </ul>
      </section>

      <section>
        <h2>Global Considerations</h2>
        <ul className="space-y-3">
          <li>
            <strong>Country Support:</strong> Not all countries support SMS delivery. 
            Maintain allowlist/blocklist.
          </li>
          <li>
            <strong>Carrier Issues:</strong> Some carriers block short codes. Use long codes 
            or voice fallback.
          </li>
          <li>
            <strong>Regulations:</strong> GDPR, TCPA, local telecom regulations. Get consent 
            for SMS.
          </li>
          <li>
            <strong>Cost Optimization:</strong> Route through cheapest gateway per country. 
            Use WhatsApp where popular.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent SMS pumping fraud?</p>
            <p className="mt-2 text-sm">
              A: Detect patterns: many codes to same prefix, high-value countries, rapid 
              requests. Block suspicious IPs, require CAPTCHA, use phone number reputation 
              services, set daily spend limits with SMS provider.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal OTP code length and expiry?</p>
            <p className="mt-2 text-sm">
              A: 6 digits (1M combinations) with 5-10 minute expiry. Balance: long enough 
              for user to enter, short enough to limit attack window. 4 digits for low-security 
              use cases.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SMS delivery failures?</p>
            <p className="mt-2 text-sm">
              A: Track delivery status via webhook. Retry once after 30 seconds. Fallback 
              to voice call. Allow manual resend. Show clear error message with alternative 
              options.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should phone verification replace email verification?</p>
            <p className="mt-2 text-sm">
              A: No, use as complement. Email better for recovery (long-term access), phone 
              better for 2FA (immediate access). Some users change phones, lose SIMs. Offer 
              both for maximum flexibility.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize SMS costs at scale?</p>
            <p className="mt-2 text-sm">
              A: Use multiple SMS providers, route per country based on cost, implement 
              strict rate limiting, use WhatsApp where popular (cheaper), batch non-urgent 
              messages, negotiate volume discounts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle international phone numbers?</p>
            <p className="mt-2 text-sm">
              A: Use libphonenumber for parsing/validation. Store in E.164 format (+1234567890). 
              Country selector with auto-detect. Handle extensions, local formats. Validate 
              carrier/line type (mobile vs landline).
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
