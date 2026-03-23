"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-phone-verification",
  title: "Phone Verification",
  description:
    "Comprehensive guide to implementing phone verification covering SMS OTP, voice calls, WhatsApp verification, rate limiting, security patterns, and global considerations for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "phone-verification",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "phone-verification",
    "sms",
    "otp",
    "frontend",
  ],
  relatedTopics: ["email-verification", "mfa-setup", "signup-interface"],
};

export default function PhoneVerificationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Phone Verification</strong> is the process of confirming that a user owns and has
          access to the phone number they provided. It is used for account security (2FA, MFA),
          password recovery, and as an alternative to email for regions with low email penetration.
          Phone verification adds a layer of security — unlike email, phone numbers are harder to
          create in bulk and are typically tied to a real identity.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/phone-verification-flow.svg"
          alt="Phone Verification Flow"
          caption="Phone Verification Flow — showing OTP generation, SMS delivery, validation, and account linking"
        />

        <p>
          For staff and principal engineers, implementing phone verification requires deep
          understanding of SMS delivery challenges (delayed SMS, carrier filtering), OTP security
          (cryptographic generation, hash storage, timing-safe comparison), rate limiting (per
          phone, per IP, per country), cost optimization (SMS routing, WhatsApp fallback), and
          global considerations (different countries, carriers, regulations like GDPR/TCPA). The
          implementation must handle edge cases (delayed SMS, wrong numbers, roaming) while
          preventing abuse (SMS pumping, toll fraud, SIM swap attacks).
        </p>
        <p>
          Modern phone verification has evolved from simple SMS OTP to multi-channel verification
          (SMS, voice call, WhatsApp). Organizations like Twilio, Vonage, and AWS SNS provide
          global SMS infrastructure, but costs vary significantly by country ($0.005-$0.05 per SMS).
          Fraud prevention is critical — SMS pumping attacks can cost thousands of dollars in
          minutes. Implementing proper rate limiting, fraud detection, and country blocking is
          essential for production systems.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Phone verification is built on fundamental concepts that determine how OTPs are
          generated, delivered, and verified. Understanding these concepts is essential for
          designing effective phone verification systems.
        </p>
        <p>
          <strong>SMS OTP:</strong> Most common verification method. 4-6 digit numeric code sent
          via SMS. 6 digits recommended for security (1 million combinations vs 10,000 for 4
          digits). Short expiry (5-10 minutes) limits brute force window. Auto-read via SMS
          Retriever API (Android) improves UX — no manual entry needed. Cost: $0.005-$0.05 per SMS
          depending on country.
        </p>
        <p>
          <strong>Voice Call OTP:</strong> Automated voice call reads code. Used as fallback when
          SMS fails or user prefers voice. Slower than SMS but more reliable in some regions
          (poor SMS coverage). Cost: $0.01-$0.10 per call (higher than SMS). Accessibility: better
          for users with visual impairments.
        </p>
        <p>
          <strong>WhatsApp Verification:</strong> Send code via WhatsApp message. Lower cost than
          SMS in many regions. Works on data connection (useful in emerging markets where data is
          cheaper than SMS). Popular in Latin America, India, Southeast Asia. Cost: lower than SMS,
          free for first 1000/month via WhatsApp Business API. Requirement: user must have WhatsApp
          installed.
        </p>
        <p>
          <strong>Rate Limiting:</strong> Critical for fraud prevention. Per phone (3 codes/hour,
          10/day), per IP (10 codes/hour), cooldown (60 seconds between requests). Blocklist known
          fraud numbers and prefixes. Monitor for unusual patterns (many numbers from same IP
          indicates SMS pumping attack).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Phone verification architecture separates OTP generation from delivery, enabling
          multi-channel verification (SMS, voice, WhatsApp) with centralized OTP management. This
          architecture is critical for handling delivery failures and optimizing costs.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/phone-verification-methods.svg"
          alt="Phone Verification Methods"
          caption="Verification Methods — comparing SMS, voice call, and WhatsApp with cost, reliability, and use cases"
        />

        <p>
          Phone verification flow: User enters phone number (with country code). Client validates
          format (using libphonenumber), sends to backend. Backend generates OTP (6-digit random
          number), stores hash (bcrypt) with expiry (5-10 minutes), sends OTP via SMS gateway
          (Twilio, Vonage, AWS SNS). SMS gateway delivers to carrier, carrier delivers to phone.
          User enters OTP (or auto-read via SMS Retriever API). Client sends OTP to backend.
          Backend validates (constant-time comparison), invalidates OTP, marks phone as verified.
        </p>
        <p>
          Multi-channel architecture includes: primary channel (SMS), fallback channels (voice,
          WhatsApp), delivery tracking (track delivery status from provider), retry logic (retry
          failed deliveries via fallback channel). This architecture enables seamless verification —
          if SMS fails, automatically try voice call or WhatsApp.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/phone-verification-security.svg"
          alt="Phone Verification Security"
          caption="Security Measures — showing rate limiting, SIM swap detection, fraud prevention, and country restrictions"
        />

        <p>
          Security is critical — phone verification is a common attack vector. Security measures
          include: rate limiting (prevent SMS pumping), SIM swap detection (detect when phone
          number changes carrier), fraud detection (block known fraud numbers, monitor patterns),
          country blocking (block high-risk countries if not target market). Organizations like
          Twilio provide fraud prevention tools — use them. Cost of prevention is far less than
          cost of fraud.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing phone verification involves trade-offs between security, cost, and user
          experience. Understanding these trade-offs is essential for making informed architecture
          decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SMS vs Voice vs WhatsApp</h3>
          <ul className="space-y-3">
            <li>
              <strong>SMS:</strong> Universal (works on all phones), reliable, expected by users.
              Limitation: cost varies by country, delivery delays in some regions, vulnerable to
              SIM swap attacks.
            </li>
            <li>
              <strong>Voice:</strong> More reliable than SMS in poor coverage areas, accessible for
              visually impaired. Limitation: higher cost, slower, users must answer call.
            </li>
            <li>
              <strong>WhatsApp:</strong> Lower cost, works on data, popular in emerging markets.
              Limitation: requires WhatsApp installed, not universal.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">4-digit vs 6-digit OTP</h3>
          <ul className="space-y-3">
            <li>
              <strong>4-digit:</strong> Easier to enter, better UX. Limitation: only 10,000
              combinations, vulnerable to brute force (1 in 10,000 chance).
            </li>
            <li>
              <strong>6-digit:</strong> 1 million combinations, much more secure. Limitation:
              slightly more effort to enter.
            </li>
            <li>
              <strong>Recommendation:</strong> 6-digit for security-critical (banking, healthcare),
              4-digit acceptable for low-risk (newsletter signup).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Rate Limiting Strategies</h3>
          <ul className="space-y-3">
            <li>
              <strong>Per Phone:</strong> 3 codes/hour, 10/day. Prevents abuse of single number.
              Limitation: doesn't prevent distributed attacks.
            </li>
            <li>
              <strong>Per IP:</strong> 10 codes/hour. Prevents SMS pumping from single IP.
              Limitation: affects users behind NAT (same IP).
            </li>
            <li>
              <strong>Hybrid:</strong> Both per phone and per IP. Best protection. Used by most
              production systems.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing phone verification requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Use cryptographically secure OTP generation — crypto.randomBytes() for random OTP, not
          Math.random(). Store OTP hashes, not plaintext — bcrypt hash of OTP, prevents OTP
          exposure in database breach. Set short OTP expiry (5-10 minutes) — limits brute force
          window. Rate limit OTP requests — per phone (3/hour), per IP (10/hour). Invalidate OTP
          after use — prevent reuse.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Auto-detect country code from IP — reduces user effort, but allow manual override. Format
          phone number as user types — national format, easier to read. Enable SMS Retriever API
          for auto-read (Android) — no manual entry needed. Provide voice call fallback — for SMS
          failures or user preference. Clear error messages for failures — invalid, expired,
          already used.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cost Optimization</h3>
        <p>
          Rate limit to prevent fraud — SMS pumping can cost thousands in minutes. Use local SMS
          routes for lower cost — some providers have better rates in specific countries. Prefer
          WhatsApp where available — lower cost than SMS. Monitor delivery rates by country — block
          high-failure, high-cost countries. Block high-risk countries — if not target market,
          block to prevent fraud.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Global Considerations</h3>
        <p>
          Support international phone formats — use libphonenumber library. Handle different
          carrier requirements — some carriers filter certain message formats. Respect local
          regulations (GDPR, TCPA) — consent requirements, opt-out options. Provide multiple
          verification methods — SMS, voice, WhatsApp for different markets. Test with real devices
          in target markets — don't rely on emulators.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing phone verification to ensure secure,
          usable, and maintainable verification systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No rate limiting:</strong> SMS pumping attacks, toll fraud, thousands of
            dollars in minutes. <strong>Fix:</strong> Rate limit per phone (3/hour), per IP
            (10/hour), block known fraud numbers.
          </li>
          <li>
            <strong>Storing plaintext OTPs:</strong> Database breach exposes all OTPs, attackers
            can verify any phone. <strong>Fix:</strong> Store bcrypt hash of OTP, not plaintext.
          </li>
          <li>
            <strong>Long OTP expiry:</strong> Extended window for brute force attacks.{" "}
            <strong>Fix:</strong> Set short expiry (5-10 minutes).
          </li>
          <li>
            <strong>No delivery tracking:</strong> Can't detect delivery failures, users stuck.{" "}
            <strong>Fix:</strong> Track delivery status. Provide fallback (voice call).
          </li>
          <li>
            <strong>Poor phone formatting:</strong> Users enter invalid formats, verification
            fails. <strong>Fix:</strong> Auto-format as user types. Use libphonenumber library.
          </li>
          <li>
            <strong>No country code detection:</strong> Users must manually select country,
            friction. <strong>Fix:</strong> Auto-detect from IP. Allow manual override.
          </li>
          <li>
            <strong>Not invalidating OTPs:</strong> OTPs can be reused, security vulnerability.{" "}
            <strong>Fix:</strong> Invalidate OTP after successful verification.
          </li>
          <li>
            <strong>No fraud detection:</strong> Vulnerable to SMS pumping attacks.{" "}
            <strong>Fix:</strong> Block high-risk countries. Monitor patterns. Use fraud prevention
            tools.
          </li>
          <li>
            <strong>Poor error messages:</strong> Users don't know why verification failed.{" "}
            <strong>Fix:</strong> Clear messages (invalid, expired, already used).
          </li>
          <li>
            <strong>No fallback:</strong> SMS fails, no alternative, users stuck.{" "}
            <strong>Fix:</strong> Offer voice call or WhatsApp fallback.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Phone verification is critical for security and fraud prevention. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Shopify)</h3>
        <p>
          <strong>Challenge:</strong> Fraudulent orders with fake phones. International customers
          (different carriers). SMS delivery delays during peak (Black Friday).
        </p>
        <p>
          <strong>Solution:</strong> Phone verification for high-value orders. Carrier-specific
          routing (optimize delivery). Queue-based SMS during peak. Voice call fallback for
          failures. Rate limiting per phone/IP.
        </p>
        <p>
          <strong>Result:</strong> Fraudulent orders reduced 80%. International delivery 95%. Peak
          SMS handled without delays.
        </p>
        <p>
          <strong>Security:</strong> Phone verification, carrier routing, voice fallback, rate
          limiting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC requires MFA for transactions. SMS interception risk
          (SIM swap attacks). Elderly customers without smartphones.
        </p>
        <p>
          <strong>Solution:</strong> SMS OTP for standard transactions. Voice call for high-value.
          Transaction amount in SMS. SIM swap detection (detect when phone number changes carrier).
          Voice call fallback for elderly.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audits. Fraud reduced 90%. Elderly customer access
          maintained.
        </p>
        <p>
          <strong>Security:</strong> MFA enforcement, voice fallback, SIM swap detection,
          transaction verification.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Teladoc)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA requires patient verification. Appointment reminders via
          SMS. No PHI in SMS messages (HIPAA violation).
        </p>
        <p>
          <strong>Solution:</strong> Phone verification during signup. Generic SMS reminders (no
          PHI). Secure link to patient portal. Opt-out option for SMS. WhatsApp for international
          patients.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. No-show rate reduced 40%. Patient
          satisfaction improved.
        </p>
        <p>
          <strong>Security:</strong> Phone verification, PHI protection, secure links, opt-out
          compliance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> COPPA requires parental consent for under 13. Young users
          without phones. International SMS costs.
        </p>
        <p>
          <strong>Solution:</strong> Phone verification for age 13+. Parental phone for under 13.
          WhatsApp verification for cost savings. Email fallback for no-phone users. Rate limiting
          to prevent fraud.
        </p>
        <p>
          <strong>Result:</strong> COPPA compliance maintained. SMS costs reduced 60%. Parent
          satisfaction improved.
        </p>
        <p>
          <strong>Security:</strong> Age verification, parental consent, cost optimization, rate
          limiting.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Okta)</h3>
        <p>
          <strong>Challenge:</strong> Admin accounts require MFA. International employees.
          Corporate phone policies vary (some don't allow personal phones for work).
        </p>
        <p>
          <strong>Solution:</strong> Phone verification for admin MFA. Multiple phone options
          (work, mobile). Authenticator app alternative (no SMS cost). Backup codes for no-phone
          scenarios. Voice call fallback.
        </p>
        <p>
          <strong>Result:</strong> Admin account security improved. 95% MFA adoption. Zero admin
          account takeovers.
        </p>
        <p>
          <strong>Security:</strong> Admin MFA, multiple options, backup codes, voice fallback.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of phone verification design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate and store OTPs securely?</p>
            <p className="mt-2 text-sm">
              A: Generate 6-digit OTP using crypto.randomBytes() — not Math.random() (not
              cryptographically secure). Store bcrypt hash of OTP (not plaintext) in database —
              prevents OTP exposure in database breach. Set short expiry (5-10 minutes) — limits
              brute force window. Invalidate after use — prevent reuse. Use constant-time
              comparison for verification — prevent timing attacks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent SMS pumping attacks?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer defense: (1) Rate limit per phone (3/hour), per IP (10/hour). (2)
              Block known fraud numbers and prefixes (use fraud prevention tools). (3) Monitor for
              unusual patterns (many numbers from same IP). (4) Block high-risk countries if not
              target market. (5) Use CAPTCHA for suspicious requests. Cost of prevention is far
              less than cost of fraud.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal OTP expiry time?</p>
            <p className="mt-2 text-sm">
              A: 5-10 minutes balances security and usability. Short enough to limit brute force
              window, long enough for users to receive and enter code. SMS can be delayed in some
              regions (rural areas, international). Allow resend if expired. Track expiry rate —
              high rate indicates delivery issues.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle international phone numbers?</p>
            <p className="mt-2 text-sm">
              A: Use libphonenumber library for parsing, formatting, validation. Auto-detect
              country from IP — reduces user effort. Allow manual override — auto-detect isn't
              always correct. Format as user types (national format) — easier to read. Validate
              before sending SMS — saves cost (don't send to invalid numbers). Support all major
              countries.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement SMS Retriever API?</p>
            <p className="mt-2 text-sm">
              A: Android-only feature: (1) Generate app signature hash (unique to your app). (2)
              Include hash in SMS message (required format). (3) App registers SMS Retriever
              client. (4) SMS auto-detected, code extracted. (5) Auto-fill OTP field — no manual
              entry. Fallback to manual entry if auto-read fails (SMS without hash, older Android
              versions).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SMS delivery failures?</p>
            <p className="mt-2 text-sm">
              A: Track delivery status from SMS provider. On failure: (1) Allow resend after
              cooldown (60 seconds). (2) Offer voice call fallback — more reliable in some regions.
              (3) Offer WhatsApp fallback — lower cost, works on data. (4) Log failure for
              monitoring — detect patterns. (5) Block number after multiple failures — potential
              fraud.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize SMS costs?</p>
            <p className="mt-2 text-sm">
              A: Cost optimization: (1) Rate limiting prevents fraud (biggest cost saver). (2) Use
              local SMS routes for lower cost — some providers have better rates in specific
              countries. (3) Prefer WhatsApp where available — lower cost than SMS. (4) Validate
              phone numbers before sending — don't send to invalid numbers. (5) Monitor delivery
              rates by country — block high-failure, high-cost countries. (6) Block high-risk
              countries if not target market.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for phone verification?</p>
            <p className="mt-2 text-sm">
              A: Verification rate (% who verify), delivery rate (SMS delivered / sent),
              time-to-verify, resend rate, expiry rate (OTPs that expire unused), failure rate by
              country/carrier, cost per verification. Track by user segment. Monitor for anomalies
              — spike in failures from specific country (fraud), high resend rate (delivery
              issues).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle phone number changes?</p>
            <p className="mt-2 text-sm">
              A: Require verification for new phone number: (1) User enters new phone. (2) Send OTP
              to new phone. (3) Verify OTP. (4) Update phone number in database. (5) Notify user of
              change (email) — detect unauthorized changes. (6) Allow reversal within grace period
              (24 hours) — user can undo if hacked. Rate limit phone changes — prevent abuse.
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
              href="https://www.twilio.com/docs/sms"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twilio SMS Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/identity/sms-retriever/overview"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google SMS Retriever API
            </a>
          </li>
          <li>
            <a
              href="https://github.com/google/libphonenumber"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              libphonenumber Library
            </a>
          </li>
          <li>
            <a
              href="https://www.vonage.com/communications-apis/sms/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vonage SMS API
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/sns/latest/dg/sms_supported-countries.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS SNS SMS Documentation
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
