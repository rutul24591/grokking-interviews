"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-account-verification",
  title: "Account Verification",
  description:
    "Comprehensive guide to implementing account verification covering email verification, phone verification, document verification, manual review, verification workflows, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "account-verification",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "verification",
    "account",
    "backend",
    "security",
  ],
  relatedTopics: ["email-verification", "phone-verification", "user-registration-service"],
};

export default function AccountVerificationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Account Verification</strong> is the process of confirming user identity through
          email, phone, document upload, or manual review. It prevents fake accounts, enables
          account recovery, ensures reliable communication channels, and meets compliance
          requirements (KYC, AML). Verification is critical for platforms handling sensitive data,
          financial transactions, or regulated content.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-verification-flow.svg"
          alt="Account Verification Flow"
          caption="Account Verification Flow — showing verification methods, token generation, validation, and approval workflow"
        />

        <p>
          For staff and principal engineers, implementing account verification requires deep
          understanding of verification methods (email, phone, document, manual), token generation
          and validation, verification workflows (automatic vs manual review), security patterns
          (fraud detection, document validation), and compliance requirements (KYC for financial
          services, age verification for restricted content). The implementation must balance
          security (thorough verification) with user experience (minimize friction).
        </p>
        <p>
          Modern account verification has evolved from simple email confirmation to multi-factor
          verification (email + phone + document), automated document verification (OCR, facial
          recognition), and risk-based verification (low-risk users get streamlined flow, high-risk
          users get enhanced verification). Organizations like Stripe, PayPal, and Coinbase
          implement layered verification — start with email/phone, escalate to document verification
          for higher limits or suspicious activity.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Account verification is built on fundamental concepts that determine how users prove
          identity and gain verified status. Understanding these concepts is essential for
          designing effective verification systems.
        </p>
        <p>
          <strong>Verification Methods:</strong> Email verification (send code/link to email, user
          confirms ownership), Phone verification (SMS OTP or voice call to phone number), Document
          verification (upload government ID, passport, driver's license — automated OCR + manual
          review), Manual review (support team verifies identity via video call, support ticket).
          Each method has different security levels and friction — email/phone are low-friction but
          lower security, document verification is high-security but high-friction.
        </p>
        <p>
          <strong>Verification Token:</strong> Cryptographically random token (256-bit) generated
          for each verification attempt. Store hash in database (not plaintext). Set expiry (24
          hours for email, 10 minutes for SMS). Single use — invalidate after successful
          verification. Include metadata (verification type, user_id, created_at, IP address) for
          audit and fraud detection.
        </p>
        <p>
          <strong>Verification Status:</strong> Unverified (new account, limited access), Pending
          (verification in progress, some restrictions), Verified (fully verified, full access),
          Rejected (verification failed, appeal process). Track verification status per method
          (email_verified, phone_verified, identity_verified) — users can be partially verified.
        </p>
        <p>
          <strong>Verification Workflow:</strong> Automatic (email/phone — instant verification on
          code submission), Semi-automatic (document — OCR validates, manual review for edge
          cases), Manual (support ticket — human review, 24-72 hour turnaround). Risk-based routing
          — low-risk users get automatic verification, high-risk users get manual review.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Account verification architecture separates verification methods from core authentication,
          enabling flexible verification flows with centralized status management. This architecture
          is critical for supporting diverse verification requirements while maintaining security.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/verification-token-flow.svg"
          alt="Verification Token Flow"
          caption="Verification Token Flow — showing token generation, delivery, validation, expiry, and single-use invalidation"
        />

        <p>
          Verification flow: User requests verification (email, phone, document). Backend generates
          token (crypto.randomBytes(32)), stores hash with expiry, sends verification (email/SMS
          with code, document upload instructions). User completes verification (enters code,
          uploads document). Backend validates token (constant-time comparison), checks expiry,
          marks account as verified, invalidates token, grants appropriate access level. For
          document verification: OCR extracts data, validates against provided info, queues for
          manual review if needed.
        </p>
        <p>
          Security architecture includes: rate limiting (prevent abuse — 3 verification
          requests/hour), fraud detection (detect suspicious patterns, block known fraud IPs),
          document validation (OCR + manual review for high-value accounts), audit logging (track
          all verification attempts), notification system (alert user of verification status
          changes). This architecture enables legitimate verification while preventing fraud —
          attacks are detected and blocked.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-verification-security.svg"
          alt="Account Verification Security"
          caption="Account Verification Security — showing fraud detection, document validation, manual review workflow, and audit trails"
        />

        <p>
          UX optimization is critical — verification friction leads to abandoned signups.
          Optimization strategies include: clear instructions (step-by-step guide with examples),
          progress indicator (show where user is in flow), multiple verification options (email +
          phone + document), clear error messages (actionable, not technical), support contact (for
          users who can't verify). Organizations like Stripe report 85%+ verification completion
          rate with optimized flows.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing account verification involves trade-offs between security, user experience, and
          operational complexity. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Email vs Phone vs Document Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Email:</strong> Low friction, universal, free. Limitation: lower security
              (email can be compromised), not suitable for high-value accounts.
            </li>
            <li>
              <strong>Phone:</strong> Low friction, works on all phones, SMS costs. Limitation:
              SIM swapping risk, not available in all countries.
            </li>
            <li>
              <strong>Document:</strong> Highest security, compliance (KYC/AML). Limitation: high
              friction, operational cost (manual review), privacy concerns.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Automatic vs Manual Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Automatic:</strong> Instant verification, scalable, low cost. Limitation:
              can't handle edge cases, vulnerable to sophisticated fraud.
            </li>
            <li>
              <strong>Manual:</strong> Human judgment, handles edge cases, deters fraud.
              Limitation: slow (24-72 hours), high cost, not scalable.
            </li>
            <li>
              <strong>Recommendation:</strong> Hybrid — automatic for low-risk (email/phone),
              manual for high-risk (document verification, suspicious activity). Use risk scoring
              to route users.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Verification Timing: Upfront vs Progressive</h3>
          <ul className="space-y-3">
            <li>
              <strong>Upfront:</strong> Verify before any access. Maximum security. Limitation:
              high friction, abandoned signups.
            </li>
            <li>
              <strong>Progressive:</strong> Verify as needed (before sensitive actions). Better
              UX. Limitation: unverified users have some access.
            </li>
            <li>
              <strong>Recommendation:</strong> Progressive for consumer apps (verify email at
              signup, phone for 2FA, document for high-value transactions). Upfront for regulated
              industries (banking, healthcare).
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing account verification requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Generate cryptographically secure tokens (256-bit) — crypto.randomBytes(32), not
          Math.random(). Store token hashes, not plaintext — bcrypt hash, prevents exposure in
          database breach. Set appropriate token expiry (24 hours for email, 10 minutes for SMS).
          Rate limit verification requests — 3/hour per user, prevent abuse. Log all verification
          attempts — detect fraud patterns.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Provide clear instructions — step-by-step guide with examples (show sample verification
          email). Show progress indicator — user knows where they are in flow. Offer multiple
          verification options — email, phone, document. Clear error messages — actionable, not
          technical ("Code expired, request new code"). Provide support contact — for users who
          can't verify.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Document Verification</h3>
        <p>
          Use OCR for automated extraction — reduce manual review workload. Validate document
          authenticity — check security features, detect tampering. Manual review for edge cases —
          low OCR confidence, suspicious documents. Store documents securely — encrypted at rest,
          access controls, automatic deletion after retention period. Comply with data privacy
          regulations (GDPR, CCPA).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Fraud Prevention</h3>
        <p>
          Detect suspicious patterns — multiple verification attempts, unusual IP locations. Block
          known fraud IPs — threat intelligence feeds. Require additional verification for
          high-risk accounts — document verification for large transactions. Monitor verification
          metrics — detect anomalies (spike in failed verifications). Implement waiting periods —
          24-72 hours for high-risk verification.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing account verification to ensure secure,
          usable, and maintainable verification systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No token expiry:</strong> Tokens valid forever, security risk.{" "}
            <strong>Fix:</strong> Set appropriate expiry (24 hours for email, 10 minutes for SMS).
          </li>
          <li>
            <strong>Storing plaintext tokens:</strong> Database breach exposes all tokens.{" "}
            <strong>Fix:</strong> Store bcrypt hash of token, not plaintext.
          </li>
          <li>
            <strong>No rate limiting:</strong> Allows brute force attacks on verification.{" "}
            <strong>Fix:</strong> Rate limit verification requests (3/hour per user).
          </li>
          <li>
            <strong>Not invalidating tokens:</strong> Tokens can be reused.{" "}
            <strong>Fix:</strong> Invalidate token after successful verification.
          </li>
          <li>
            <strong>Poor error messages:</strong> Users don't know why verification failed.{" "}
            <strong>Fix:</strong> Clear, actionable error messages ("Code expired, request new
            code").
          </li>
          <li>
            <strong>No document security:</strong> Uploaded documents stored insecurely.{" "}
            <strong>Fix:</strong> Encrypt documents at rest, access controls, automatic deletion.
          </li>
          <li>
            <strong>No manual review option:</strong> Users with edge cases permanently stuck.{" "}
            <strong>Fix:</strong> Provide support ticket option for manual review.
          </li>
          <li>
            <strong>Upfront verification for all:</strong> High friction, abandoned signups.{" "}
            <strong>Fix:</strong> Progressive verification — verify as needed based on risk.
          </li>
          <li>
            <strong>No fraud detection:</strong> Vulnerable to verification fraud.{" "}
            <strong>Fix:</strong> Implement fraud detection (pattern analysis, IP blocking).
          </li>
          <li>
            <strong>No audit logging:</strong> Can't detect abuse patterns, no compliance trail.{" "}
            <strong>Fix:</strong> Log all verification attempts for security monitoring.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Account verification is critical for security and compliance. Here are real-world
          implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Payment Platform (Stripe)</h3>
        <p>
          <strong>Challenge:</strong> KYC/AML compliance for payment processors. Need to verify
          business identity, beneficial owners. High-value transactions require enhanced
          verification.
        </p>
        <p>
          <strong>Solution:</strong> Progressive verification — email/phone at signup, document
          verification for higher limits. Automated document verification (OCR), manual review for
          edge cases. Risk-based verification — higher transaction limits require more
          verification.
        </p>
        <p>
          <strong>Result:</strong> Compliant with KYC/AML regulations. 85% verification completion
          rate. Fraud reduced 90%.
        </p>
        <p>
          <strong>Security:</strong> Document encryption, manual review, audit trails, risk-based
          verification.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Cryptocurrency Exchange (Coinbase)</h3>
        <p>
          <strong>Challenge:</strong> Strict KYC/AML requirements. Identity verification required
          for all users. Document verification for trading limits.
        </p>
        <p>
          <strong>Solution:</strong> Mandatory identity verification (government ID + selfie).
          Automated verification (OCR + facial recognition), manual review for rejections. Phone
          verification for 2FA. Address verification for higher limits.
        </p>
        <p>
          <strong>Result:</strong> Compliant with financial regulations. 80% automated verification
          rate. Manual review for 20% of users.
        </p>
        <p>
          <strong>Security:</strong> Identity verification, document validation, facial
          recognition, audit trails.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Rideshare Platform (Uber)</h3>
        <p>
          <strong>Challenge:</strong> Driver verification required (background check, license
          verification). Rider verification optional but encouraged.
        </p>
        <p>
          <strong>Solution:</strong> Driver verification: document upload (license, insurance),
          background check, manual review. Rider verification: phone verification (SMS), optional
          ID verification for trust. Progressive verification — more verification = more trust
          badges.
        </p>
        <p>
          <strong>Result:</strong> Driver verification completed in 3-5 days. Rider phone
          verification 90%+ completion. Trust and safety improved.
        </p>
        <p>
          <strong>Security:</strong> Document verification, background checks, phone verification.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Platform (Teladoc)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA compliance requires patient identity verification.
          Provider verification (medical license, credentials). Prescription verification.
        </p>
        <p>
          <strong>Solution:</strong> Patient verification: email + phone + insurance card upload.
          Provider verification: medical license, DEA certificate, manual credentialing.
          Prescription verification: two-factor verification for controlled substances.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Provider verification completed in 5-7
          days. Patient verification 95% completion rate.
        </p>
        <p>
          <strong>Security:</strong> Identity verification, credential verification, audit trails,
          HIPAA compliance.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> Age verification for restricted content. Parental consent for
          minor accounts. High-value transaction verification.
        </p>
        <p>
          <strong>Solution:</strong> Age verification: date of birth + parental email for minors.
          Parental consent: parent verifies identity (credit card or ID). Transaction verification:
          phone verification for high-value purchases.
        </p>
        <p>
          <strong>Result:</strong> COPPA compliance maintained. Parental consent rate 85%.
          Transaction fraud reduced 80%.
        </p>
        <p>
          <strong>Security:</strong> Age verification, parental consent, transaction verification.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of account verification design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What verification methods do you support and why?</p>
            <p className="mt-2 text-sm">
              A: Support multiple methods for different security levels: (1) Email verification —
              low friction, universal, for basic account activation. (2) Phone verification —
              medium security, for 2FA and account recovery. (3) Document verification — highest
              security, for KYC/AML compliance and high-value accounts. (4) Manual review — for
              edge cases and appeals. Progressive verification — start with email, escalate based
              on risk.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate and store verification tokens?</p>
            <p className="mt-2 text-sm">
              A: Generate 256-bit cryptographically secure random token using
              crypto.randomBytes(32). Store bcrypt hash of token (not plaintext) — protects against
              database breach. Set appropriate expiry (24 hours for email, 10 minutes for SMS).
              Single use — invalidate after successful verification. Include metadata (verification
              type, user_id, IP) for audit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle document verification?</p>
            <p className="mt-2 text-sm">
              A: Multi-step process: (1) User uploads document (government ID, passport). (2) OCR
              extracts data (name, DOB, document number). (3) Automated validation (check security
              features, detect tampering). (4) Manual review for edge cases (low OCR confidence,
              suspicious documents). (5) Store securely (encrypted, access controls, automatic
              deletion after retention period).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent verification fraud?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer defense: (1) Rate limiting (3 verification requests/hour). (2) Fraud
              detection (detect suspicious patterns, block known fraud IPs). (3) Document
              validation (OCR + manual review for authenticity). (4) Waiting periods (24-72 hours
              for high-risk verification). (5) Audit logging (track all verification attempts). (6)
              Manual review for high-risk accounts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle verification for users without email/phone?</p>
            <p className="mt-2 text-sm">
              A: Alternative verification methods: (1) Document verification — upload government ID.
              (2) Manual review — support ticket with identity verification. (3) Trusted contacts —
              designated contacts can vouch (Facebook model). (4) In-person verification — for
              high-security accounts (bank branch, notary). Encourage users to add email/phone
              during onboarding to avoid this scenario.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement progressive verification?</p>
            <p className="mt-2 text-sm">
              A: Verify as needed based on risk: (1) Email at signup — basic account activation.
              (2) Phone for 2FA — enhanced security. (3) Document for high-value transactions —
              KYC/AML compliance. (4) Manual review for suspicious activity. Track verification
              status per method (email_verified, phone_verified, identity_verified). Grant
              increasing access levels as users complete more verification.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for account verification?</p>
            <p className="mt-2 text-sm">
              A: Verification completion rate (% who complete verification), verification method
              distribution (email vs phone vs document), time-to-verify, verification failure rate,
              manual review rate, fraud detection rate. Monitor for anomalies — spike in failures
              (UX problem), low completion rate (friction issue). Track by user segment (new vs
              existing, geographic).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle verification expiry and renewal?</p>
            <p className="mt-2 text-sm">
              A: Some verifications expire (document verification for KYC — annual renewal). Send
              renewal reminders before expiry (30 days, 7 days). Allow re-verification flow (same
              as initial verification). Grace period after expiry (limited access for 7 days).
              Suspend account if not renewed after grace period. Track verification expiry dates in
              database.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle verification for enterprise/B2B accounts?</p>
            <p className="mt-2 text-sm">
              A: Enterprise verification differs from consumer: (1) Business verification — EIN,
              business license, articles of incorporation. (2) Beneficial owner verification —
              identity verification for owners with &gt;25% stake. (3) Manual review standard —
              support team verifies documents. (4) Longer turnaround (5-10 business days). (5)
              Dedicated support for enterprise onboarding.
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
              OWASP Multifactor Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://www.fatf-gafi.org/publications/fatfrecommendations/documents/fatf-guidance-digital-identification.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FATF Guidance on Digital Identity
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
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Authentication Security
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Security Questions
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
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
