"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
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

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/phone-verification-flow.svg"
          alt="Phone Verification Flow"
          caption="Phone Verification Flow — showing SMS code delivery, validation, and account linking"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/phone-verification-methods.svg"
          alt="Phone Verification Methods"
          caption="Phone Verification Methods — comparing SMS, voice call, and WhatsApp"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/phone-verification-security.svg"
          alt="Phone Verification Security"
          caption="Phone Verification Security — showing SIM swap detection, rate limiting, and country restrictions"
        />
      
        <p>
          For staff and principal engineers, implementing phone verification requires
          understanding SMS delivery challenges, OTP security, rate limiting, cost
          optimization, and global considerations (different countries, carriers, regulations).
          The implementation must handle edge cases (delayed SMS, wrong numbers, roaming)
          while preventing abuse (SMS pumping, toll fraud).
        </p>

        

        

        
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready phone verification flow must handle OTP generation, delivery, and verification securely.
        </p>

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
              <strong>Fallback:</strong> Use when SMS fails or user prefers voice call.
            </li>
            <li>
              <strong>Delivery:</strong> Automated voice call reads code. Slower but more
              reliable in some regions.
            </li>
            <li>
              <strong>Cost:</strong> Higher than SMS ($0.01-$0.10 per call). Use as fallback.
            </li>
            <li>
              <strong>Accessibility:</strong> Better for users with visual impairments.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">WhatsApp Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Delivery:</strong> Send code via WhatsApp message. Lower cost than SMS.
            </li>
            <li>
              <strong>Reliability:</strong> Works on data connection. Popular in emerging markets.
            </li>
            <li>
              <strong>Cost:</strong> Lower than SMS in many regions. Free for first 1000/month.
            </li>
            <li>
              <strong>Requirements:</strong> User must have WhatsApp installed.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Rate Limiting</h3>
          <ul className="space-y-3">
            <li>
              <strong>Per Phone:</strong> 3 codes per hour, 10 per day. Prevent abuse.
            </li>
            <li>
              <strong>Per IP:</strong> 10 codes per hour. Prevent SMS pumping attacks.
            </li>
            <li>
              <strong>Cooldown:</strong> 60 seconds between requests. Prevent spam.
            </li>
            <li>
              <strong>Blocklist:</strong> Block known fraud numbers. Track suspicious patterns.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Use cryptographically secure OTP generation</li>
          <li>Store OTP hashes, not plaintext</li>
          <li>Set short OTP expiry (5-10 minutes)</li>
          <li>Rate limit OTP requests</li>
          <li>Invalidate OTP after use</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Auto-detect country code from IP</li>
          <li>Format phone number as user types</li>
          <li>Enable SMS Retriever API for auto-read</li>
          <li>Provide voice call fallback</li>
          <li>Clear error messages for failures</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cost Optimization</h3>
        <ul className="space-y-2">
          <li>Rate limit to prevent fraud</li>
          <li>Use local SMS routes for lower cost</li>
          <li>Prefer WhatsApp where available</li>
          <li>Monitor delivery rates by country</li>
          <li>Block high-risk countries</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Global Considerations</h3>
        <ul className="space-y-2">
          <li>Support international phone formats</li>
          <li>Handle different carrier requirements</li>
          <li>Respect local regulations (GDPR, TCPA)</li>
          <li>Provide multiple verification methods</li>
          <li>Test with real devices in target markets</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No rate limiting:</strong> SMS pumping attacks, toll fraud.
            <br /><strong>Fix:</strong> Rate limit per phone (3/hour), per IP (10/hour).
          </li>
          <li>
            <strong>Storing plaintext OTPs:</strong> Database breach exposes all OTPs.
            <br /><strong>Fix:</strong> Store bcrypt hash of OTP, not plaintext.
          </li>
          <li>
            <strong>Long OTP expiry:</strong> Extended window for brute force attacks.
            <br /><strong>Fix:</strong> Set short expiry (5-10 minutes).
          </li>
          <li>
            <strong>No delivery tracking:</strong> Can't detect delivery failures.
            <br /><strong>Fix:</strong> Track delivery status. Provide fallback (voice call).
          </li>
          <li>
            <strong>Poor phone formatting:</strong> Users enter invalid formats.
            <br /><strong>Fix:</strong> Auto-format as user types. Use libphonenumber library.
          </li>
          <li>
            <strong>No country code detection:</strong> Users must manually select country.
            <br /><strong>Fix:</strong> Auto-detect from IP. Allow manual override.
          </li>
          <li>
            <strong>Not invalidating OTPs:</strong> OTPs can be reused.
            <br /><strong>Fix:</strong> Invalidate OTP after successful verification.
          </li>
          <li>
            <strong>No fraud detection:</strong> Vulnerable to SMS pumping attacks.
            <br /><strong>Fix:</strong> Block high-risk countries. Monitor patterns.
          </li>
          <li>
            <strong>Poor error messages:</strong> Users don't know why verification failed.
            <br /><strong>Fix:</strong> Clear messages (invalid, expired, already used).
          </li>
          <li>
            <strong>No fallback:</strong> SMS fails, no alternative.
            <br /><strong>Fix:</strong> Offer voice call or WhatsApp fallback.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">OTP Security</h3>
        <p>
          Cryptographic OTP generation and storage is critical for security.
        </p>
        <ul className="space-y-2">
          <li><strong>Generation:</strong> Use crypto.randomBytes() for secure random OTP. 6 digits = 1 million combinations.</li>
          <li><strong>Storage:</strong> Store bcrypt hash of OTP (like passwords). Prevents OTP exposure in database breach.</li>
          <li><strong>Comparison:</strong> Use constant-time comparison to prevent timing attacks.</li>
          <li><strong>Metadata:</strong> Store request IP, user agent, timestamp for fraud detection.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SMS Fraud Prevention</h3>
        <p>
          Protect against SMS pumping and toll fraud.
        </p>
        <ul className="space-y-2">
          <li><strong>Blocklist:</strong> Block known fraud numbers and prefixes.</li>
          <li><strong>Rate Limiting:</strong> Strict limits per phone, IP, country.</li>
          <li><strong>Pattern Detection:</strong> Detect unusual patterns (many numbers from same IP).</li>
          <li><strong>Country Blocking:</strong> Block high-risk countries if not target market.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SMS Retriever API</h3>
        <p>
          Android API for automatic SMS code extraction.
        </p>
        <ul className="space-y-2">
          <li><strong>How it Works:</strong> App registers for SMS from specific sender. SMS includes app hash.</li>
          <li><strong>User Experience:</strong> No manual entry. Code auto-filled.</li>
          <li><strong>Requirements:</strong> Android 4.4+. App signature in SMS.</li>
          <li><strong>Fallback:</strong> Manual entry if auto-read fails.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Global Phone Formats</h3>
        <p>
          Handle international phone number formats correctly.
        </p>
        <ul className="space-y-2">
          <li><strong>Library:</strong> Use libphonenumber for parsing, formatting, validation.</li>
          <li><strong>Country Detection:</strong> Auto-detect from IP. Allow manual override.</li>
          <li><strong>Formatting:</strong> Format as user types (national format).</li>
          <li><strong>Validation:</strong> Validate before sending SMS (saves cost).</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate and store OTPs securely?</p>
            <p className="mt-2 text-sm">
              A: Generate 6-digit OTP using crypto.randomBytes(). Store bcrypt hash of OTP (not plaintext) in database. Set short expiry (5-10 minutes). Invalidate after use. Use constant-time comparison for verification.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent SMS pumping attacks?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer defense: (1) Rate limit per phone (3/hour), per IP (10/hour). (2) Block known fraud numbers and prefixes. (3) Monitor for unusual patterns (many numbers from same IP). (4) Block high-risk countries if not target market. (5) Use CAPTCHA for suspicious requests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal OTP expiry time?</p>
            <p className="mt-2 text-sm">
              A: 5-10 minutes balances security and usability. Short enough to limit brute force window, long enough for users to receive and enter code. SMS can be delayed in some regions. Allow resend if expired.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle international phone numbers?</p>
            <p className="mt-2 text-sm">
              A: Use libphonenumber library for parsing, formatting, validation. Auto-detect country from IP. Allow manual override. Format as user types (national format). Validate before sending SMS (saves cost). Support all major countries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement SMS Retriever API?</p>
            <p className="mt-2 text-sm">
              A: Android-only feature: (1) Generate app signature hash. (2) Include hash in SMS message. (3) App registers SMS Retriever client. (4) SMS auto-detected, code extracted. (5) Auto-fill OTP field. Fallback to manual entry if auto-read fails.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SMS delivery failures?</p>
            <p className="mt-2 text-sm">
              A: Track delivery status from SMS provider. On failure: (1) Allow resend after cooldown (60 seconds). (2) Offer voice call fallback. (3) Offer WhatsApp fallback. (4) Log failure for monitoring. (5) Block number after multiple failures (potential fraud).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize SMS costs?</p>
            <p className="mt-2 text-sm">
              A: Cost optimization: (1) Rate limiting prevents fraud. (2) Use local SMS routes for lower cost. (3) Prefer WhatsApp where available (lower cost). (4) Validate phone numbers before sending. (5) Monitor delivery rates by country. (6) Block high-cost, high-fraud countries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for phone verification?</p>
            <p className="mt-2 text-sm">
              A: Verification rate (% who verify), delivery rate, time-to-verify, resend rate, expiry rate, failure rate by country/carrier, cost per verification. Track by user segment. Monitor for anomalies (spike in failures from specific country).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle phone number changes?</p>
            <p className="mt-2 text-sm">
              A: Require verification for new phone number: (1) User enters new phone. (2) Send OTP to new phone. (3) Verify OTP. (4) Update phone number in database. (5) Notify user of change (email). (6) Allow reversal within grace period (24 hours). Rate limit phone changes.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication</a></li>
          <li><a href="https://www.twilio.com/docs/sms" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Twilio SMS Documentation</a></li>
          <li><a href="https://developers.google.com/identity/sms-retriever/overview" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google SMS Retriever API</a></li>
          <li><a href="https://github.com/google/libphonenumber" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">libphonenumber Library</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Access Control Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Phone Verification</h3>
        <p>
          Large e-commerce platform with 50M users, SMS verification for order confirmation.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Fraudulent orders with fake phones. International customers (different carriers). SMS delivery delays during peak.</li>
          <li><strong>Solution:</strong> Phone verification for high-value orders. Carrier-specific routing. Queue-based SMS during peak. Voice call fallback for failures.</li>
          <li><strong>Result:</strong> Fraudulent orders reduced 80%. International delivery 95%. Peak SMS handled without delays.</li>
          <li><strong>Security:</strong> Phone verification, carrier routing, voice fallback.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Phone Verification</h3>
        <p>
          Online banking with FFIEC compliance, MFA via SMS for transactions.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> FFIEC requires MFA for transactions. SMS interception risk. Elderly customers without smartphones.</li>
          <li><strong>Solution:</strong> SMS OTP for standard transactions. Voice call for high-value. Transaction amount in SMS. SIM swap detection.</li>
          <li><strong>Result:</strong> Passed FFIEC audits. Fraud reduced 90%. Elderly customer access maintained.</li>
          <li><strong>Security:</strong> MFA enforcement, voice fallback, SIM swap detection.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Phone Verification</h3>
        <p>
          Telemedicine platform with HIPAA compliance, appointment reminders via SMS.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> HIPAA requires patient verification. Appointment reminders via SMS. No PHI in SMS messages.</li>
          <li><strong>Solution:</strong> Phone verification during signup. Generic SMS reminders (no PHI). Secure link to patient portal. Opt-out option.</li>
          <li><strong>Result:</strong> Passed HIPAA audits. No-show rate reduced 40%. Patient satisfaction improved.</li>
          <li><strong>Security:</strong> Phone verification, PHI protection, secure links.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Phone Verification</h3>
        <p>
          Online gaming platform with 100M users, age verification and parental consent.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> COPPA requires parental consent. Young users without phones. International SMS costs.</li>
          <li><strong>Solution:</strong> Phone verification for age 13+. Parental phone for under 13. WhatsApp verification for cost savings. Email fallback for no-phone users.</li>
          <li><strong>Result:</strong> COPPA compliance maintained. SMS costs reduced 60%. Parent satisfaction improved.</li>
          <li><strong>Security:</strong> Age verification, parental consent, cost optimization.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS Phone Verification</h3>
        <p>
          B2B SaaS with 10,000 enterprise customers, MFA for admin accounts.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Admin accounts require MFA. International employees. Corporate phone policies vary.</li>
          <li><strong>Solution:</strong> Phone verification for admin MFA. Multiple phone options (work, mobile). Authenticator app alternative. Backup codes for no-phone scenarios.</li>
          <li><strong>Result:</strong> Admin account security improved. 95% MFA adoption. Zero admin account takeovers.</li>
          <li><strong>Security:</strong> Admin MFA, multiple options, backup codes.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
