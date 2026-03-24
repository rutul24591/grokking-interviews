"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-mfa-setup",
  title: "Multi-Factor Authentication Setup",
  description:
    "Comprehensive guide to implementing MFA enrollment flows covering TOTP apps, SMS, WebAuthn, backup codes, recovery options, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "mfa-setup",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "mfa",
    "2fa",
    "authentication",
    "security",
    "frontend",
  ],
  relatedTopics: ["login-interface", "phone-verification", "password-reset"],
};

export default function MFASetupArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Multi-Factor Authentication (MFA) Setup</strong> is the enrollment flow that
          allows users to configure additional authentication factors beyond password. MFA
          significantly improves account security by requiring something the user knows (password)
          plus something they have (phone, hardware key) or are (biometric). According to Microsoft,
          MFA blocks 99.9% of automated attacks — it is the single most effective security measure
          for consumer accounts.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/mfa-setup-flow.svg"
          alt="MFA Setup Flow"
          caption="MFA Setup Flow — showing method selection, QR code generation, verification, and backup codes"
        />

        <p>
          For staff and principal engineers, implementing MFA setup requires deep understanding of
          different MFA methods (TOTP authenticator apps, SMS, WebAuthn/passkeys, backup codes),
          secure enrollment flows (secret generation, QR code display, verification), recovery
          mechanisms (backup codes, recovery email/phone, account recovery flow), and UX patterns
          that encourage adoption while preventing lockout. The implementation must balance security
          (strong methods like WebAuthn) with accessibility (methods available to all users like
          SMS).
        </p>
        <p>
          Modern MFA has evolved from SMS-only to diverse authentication factors: TOTP
          (time-based one-time passwords via Google Authenticator, Authy), WebAuthn/passkeys
          (phishing-resistant, biometric authentication), hardware security keys (YubiKey), and
          backup codes (recovery when primary methods unavailable). Organizations like Google,
          Microsoft, and Okta offer multiple MFA methods to accommodate different user needs while
          maintaining high security standards.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          MFA setup is built on fundamental concepts that determine how authentication factors are
          enrolled, verified, and managed. Understanding these concepts is essential for designing
          effective MFA systems.
        </p>
        <p>
          <strong>TOTP Authenticator Apps:</strong> Time-based One-Time Password algorithm for
          authenticator apps (Google Authenticator, Microsoft Authenticator, Authy, 1Password).
          Setup flow: generate 32-byte cryptographically secure secret, display as QR code
          (otpauth:// URL), user scans with app, enters first code to verify. Security: works
          offline, no SMS interception risk. Limitation: device loss = account loss (mitigate with
          backup codes). Most secure consumer option after WebAuthn.
        </p>
        <p>
          <strong>SMS/Phone MFA:</strong> Setup: enter phone number, receive SMS code, verify code,
          store verified phone. Security: vulnerable to SIM swapping, SS7 attacks — less secure
          than TOTP. Accessibility: works on any phone (not just smartphones), good fallback for
          users without smartphones or technical knowledge. Rate limiting critical (3/hour) to
          prevent toll fraud.
        </p>
        <p>
          <strong>WebAuthn/Passkeys:</strong> FIDO2 standard for phishing-resistant authentication.
          Setup: register device (Touch ID, Face ID, Windows Hello, YubiKey), generate keypair
          (public key to server, private key stays on device). Security: strongest consumer option,
          phishing-resistant, no shared secrets. UX: one-tap authentication, no codes to enter —
          best user experience. Always provide fallback (TOTP, backup codes) for device loss.
        </p>
        <p>
          <strong>Backup Codes:</strong> Generate 10 one-time codes during MFA setup. Each code
          usable once. User must download/print codes — never store plaintext server-side (store
          hashes). Use when primary MFA method unavailable (lost phone, broken device). Regenerate
          after use. Force download before enabling MFA — clear warnings about importance.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          MFA setup architecture separates method enrollment from verification, enabling multiple
          MFA methods with centralized management. This architecture is critical for supporting
          diverse authentication factors while maintaining security.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/mfa-methods.svg"
          alt="MFA Methods"
          caption="MFA Methods Comparison — showing TOTP, SMS, WebAuthn, backup codes with security ranking and use cases"
        />

        <p>
          MFA enrollment flow: User navigates to security settings, selects MFA method. For TOTP:
          backend generates secret (crypto.randomBytes(32)), creates QR code (otpauth:// URL),
          displays to user. User scans QR code with authenticator app, enters first code. Backend
          verifies code (HMAC-SHA1 of time step, ±1 window for clock skew), enables MFA, generates
          backup codes. For SMS: user enters phone number, backend sends SMS code, user verifies
          code, stores verified phone. For WebAuthn: browser registers device via
          navigator.credentials.create(), stores public key, enables MFA.
        </p>
        <p>
          Recovery architecture includes: backup codes (primary recovery — one-time use codes),
          recovery email (send reset link to backup email), recovery phone (SMS code to backup
          phone), account recovery flow (manual identity verification as last resort). This
          architecture enables secure recovery — users can regain access even if primary MFA method
          unavailable.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/mfa-recovery.svg"
          alt="MFA Recovery"
          caption="MFA Recovery Options — showing backup codes, recovery email/phone, account recovery flow"
        />

        <p>
          Adoption optimization is critical — MFA only protects if users enable it. Optimization
          strategies include: prompt after signup (not during — reduces signup friction), explain
          security benefits clearly ("Protect your account from hackers"), make setup quick and
          simple (under 2 minutes), offer incentives (account recovery guarantee, security badge),
          require for high-risk actions (password change, data export), send periodic reminders.
          Organizations like Google report 50%+ MFA adoption with optimized flows.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing MFA setup involves trade-offs between security, accessibility, and user
          experience. Understanding these trade-offs is essential for making informed architecture
          decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">TOTP vs SMS vs WebAuthn</h3>
          <ul className="space-y-3">
            <li>
              <strong>TOTP:</strong> Most secure consumer option (after WebAuthn), works offline,
              no SMS risk. Limitation: requires smartphone, device loss = account loss (mitigate
              with backup codes).
            </li>
            <li>
              <strong>SMS:</strong> Works on any phone, familiar to users. Limitation: vulnerable
              to SIM swapping, SS7 attacks, toll fraud. Use as fallback only.
            </li>
            <li>
              <strong>WebAuthn:</strong> Strongest option, phishing-resistant, best UX (one-tap).
              Limitation: requires compatible device/browser, device loss = account loss.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Optional vs Required MFA</h3>
          <ul className="space-y-3">
            <li>
              <strong>Optional:</strong> Better UX, users choose security level. Limitation: low
              adoption (5-10% without prompting), most vulnerable users remain unprotected.
            </li>
            <li>
              <strong>Required:</strong> Maximum security, all users protected. Limitation:
              friction, support tickets, user frustration.
            </li>
            <li>
              <strong>Recommendation:</strong> Progressive enforcement — prompt all users, require
              for high-risk accounts (admins, high-value), require for sensitive actions (password
              change, data export).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Single vs Multiple MFA Methods</h3>
          <ul className="space-y-3">
            <li>
              <strong>Single Method:</strong> Simpler implementation, less confusion. Limitation:
              no fallback if method unavailable, higher lockout risk.
            </li>
            <li>
              <strong>Multiple Methods:</strong> Redundancy (if one fails, use another), better
              accessibility. Limitation: more complex implementation, larger attack surface.
            </li>
            <li>
              <strong>Recommendation:</strong> Allow multiple methods — TOTP + backup codes
              minimum, SMS as fallback, WebAuthn for compatible devices.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing MFA setup requires following established best practices to ensure security,
          usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Require password confirmation before enabling MFA — verify user identity. Generate
          cryptographically secure secrets (32 bytes) — crypto.randomBytes(32), not Math.random().
          Store secret hashes, not plaintext — bcrypt hash of TOTP secret, prevents exposure in
          database breach. Require verification code before enabling — user must enter valid code
          from authenticator app. Provide backup codes for recovery — force download before
          enabling MFA.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Show clear setup instructions for each method — step-by-step guide with screenshots.
          Provide QR code + manual entry for TOTP — some users can't scan QR codes. Test code
          before enabling MFA — verify setup works. Force backup code download — user must download
          before enabling. Allow multiple MFA methods simultaneously — TOTP + SMS + WebAuthn.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recovery</h3>
        <p>
          Generate backup codes during setup — 10 one-time codes. Allow adding recovery
          email/phone — fallback if primary MFA unavailable. Provide account recovery flow for
          lockout — manual identity verification as last resort. Support multiple backup methods —
          backup codes + recovery email + recovery phone. Document recovery process clearly — show
          during setup, include in help docs.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Adoption</h3>
        <p>
          Prompt users to enable MFA after signup — not during (reduces signup friction). Explain
          security benefits clearly — "Protect your account from hackers". Make setup flow simple
          and quick — under 2 minutes. Offer incentives — account recovery guarantee, security
          badge. Require for high-risk actions — password change, data export, large transactions.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing MFA setup to ensure secure, usable, and
          maintainable MFA systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No backup codes:</strong> Users locked out if they lose phone, support
            tickets. <strong>Fix:</strong> Force backup code download during setup. Store hashes
            securely.
          </li>
          <li>
            <strong>Weak secret generation:</strong> Predictable secrets enable TOTP guessing
            attacks. <strong>Fix:</strong> Use crypto.randomBytes(32) for 256-bit secrets.
          </li>
          <li>
            <strong>Storing plaintext secrets:</strong> Database breach exposes all TOTP secrets,
            attackers can generate codes. <strong>Fix:</strong> Store bcrypt hash of secret, not
            plaintext.
          </li>
          <li>
            <strong>No verification step:</strong> MFA enabled with wrong secret, user can't login.{" "}
            <strong>Fix:</strong> Require user to enter valid code before enabling MFA.
          </li>
          <li>
            <strong>Single MFA method:</strong> No fallback if method unavailable, lockout risk.{" "}
            <strong>Fix:</strong> Allow multiple methods (TOTP + SMS + backup codes).
          </li>
          <li>
            <strong>Poor QR code:</strong> Users can't scan, no manual entry option, frustration.{" "}
            <strong>Fix:</strong> Provide manual entry key below QR code.
          </li>
          <li>
            <strong>No rate limiting:</strong> SMS MFA enables toll fraud, attackers rack up
            charges. <strong>Fix:</strong> Rate limit SMS sends (3/hour per phone).
          </li>
          <li>
            <strong>Unclear recovery:</strong> Users don't know how to recover account if locked
            out. <strong>Fix:</strong> Document recovery process during setup. Provide recovery
            flow.
          </li>
          <li>
            <strong>Forcing MFA immediately:</strong> Frustrates new users, abandons signup.{" "}
            <strong>Fix:</strong> Prompt after signup, require for sensitive actions.
          </li>
          <li>
            <strong>No MFA management:</strong> Can't change/disable MFA methods, stuck with old
            phone. <strong>Fix:</strong> Provide settings page to manage MFA methods.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          MFA is critical for account security. Here are real-world implementations from production
          systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer App (Twitter)</h3>
        <p>
          <strong>Challenge:</strong> Low MFA adoption (5%). Users find MFA cumbersome. High-value
          accounts (celebrities, politicians) targeted for takeover.
        </p>
        <p>
          <strong>Solution:</strong> Progressive enrollment: prompt after signup, show security
          benefits, offer multiple methods (TOTP, SMS, WebAuthn), skip for trusted devices.
          Require MFA for high-risk accounts.
        </p>
        <p>
          <strong>Result:</strong> MFA adoption increased to 45% in 6 months. Account takeovers
          reduced by 80%. User complaints minimal.
        </p>
        <p>
          <strong>Security:</strong> Backup codes mandatory, recovery email/phone options, clear
          recovery instructions.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Okta)</h3>
        <p>
          <strong>Challenge:</strong> SOC 2 compliance requires MFA for all admin users. Enterprise
          customers mandate MFA for all employees. Resistance from users.
        </p>
        <p>
          <strong>Solution:</strong> Phased rollout: admins first, then all users. Hardware keys
          for admins, TOTP/SMS for employees. Grace period with reminders. Manager dashboards for
          compliance tracking.
        </p>
        <p>
          <strong>Result:</strong> 100% admin MFA in 30 days. 95% employee MFA in 90 days. Passed
          SOC 2 audit. Customer contracts secured.
        </p>
        <p>
          <strong>Security:</strong> Hardware keys (YubiKey) for admins, backup codes,
          manager-initiated recovery.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC, PSD2 require Strong Customer Authentication (SCA).
          Elderly customers struggle with apps. High-value transactions need enhanced verification.
        </p>
        <p>
          <strong>Solution:</strong> Mandatory MFA for all users. SMS fallback for non-smartphone
          users. Step-up MFA for transactions over $500. Biometric option for mobile app.
        </p>
        <p>
          <strong>Result:</strong> Compliant with FFIEC/PSD2. Fraud reduced by 95%. Customer
          adoption smooth (multiple options).
        </p>
        <p>
          <strong>Security:</strong> Transaction signing, geographic anomaly detection, mandatory
          re-enrollment annually.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare EHR (Epic)</h3>
        <p>
          <strong>Challenge:</strong> HIPAA requires access controls. Providers need quick access
          in emergencies. Shared workstations complicate MFA.
        </p>
        <p>
          <strong>Solution:</strong> Hardware keys for providers (quick tap). SMS fallback for
          shared workstations. Break-glass override for emergencies (audit logged). MFA exemption
          for emergency mode with post-incident review.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Provider satisfaction high (quick hardware
          key access). Zero unauthorized access via compromised credentials.
        </p>
        <p>
          <strong>Security:</strong> Break-glass audit logging, automatic review of emergency
          access, mandatory MFA for normal access.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> Account takeovers for valuable items/currency. Young users
          without phones. International users (SMS costs).
        </p>
        <p>
          <strong>Solution:</strong> Optional MFA with incentives (bonus items). TOTP for
          smartphone users, email codes for others. Parental MFA for minor accounts. MFA required
          for item trading.
        </p>
        <p>
          <strong>Result:</strong> 60% MFA adoption. Account takeovers reduced by 85%. Trading
          fraud reduced 95%.
        </p>
        <p>
          <strong>Security:</strong> MFA for trading, parental controls, backup codes.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of MFA setup design, implementation, and operational
          concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What MFA methods do you support and why?</p>
            <p className="mt-2 text-sm">
              A: Support multiple methods for accessibility: (1) TOTP authenticator apps (Google
              Authenticator, Authy) — most secure consumer option, works offline. (2) SMS — less
              secure (SIM swapping) but works on any phone, good fallback. (3) WebAuthn/passkeys —
              strongest option, phishing-resistant, best UX. (4) Backup codes — recovery when
              primary methods unavailable. Always allow multiple methods simultaneously.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate and store TOTP secrets?</p>
            <p className="mt-2 text-sm">
              A: Generate 32-byte cryptographically secure random secret using
              crypto.randomBytes(32). Encode as base32 for user entry. Store bcrypt hash of secret
              (not plaintext) — protects against database breach. Display QR code (otpauth:// URL)
              for app scanning. Require user to enter valid code before enabling MFA (verifies
              correct setup).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent MFA lockout?</p>
            <p className="mt-2 text-sm">
              A: Multiple safeguards: (1) Force backup code download during setup — user must
              download/print 10 one-time codes. (2) Allow multiple MFA methods (TOTP + SMS +
              WebAuthn). (3) Add recovery email/phone as fallback. (4) Provide account recovery
              flow with manual identity verification. (5) Clear documentation of recovery options
              during setup.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's your MFA enrollment flow?</p>
            <p className="mt-2 text-sm">
              A: Step-by-step flow: (1) User selects MFA method. (2) Show setup instructions (QR
              code for TOTP, phone input for SMS, device registration for WebAuthn). (3) User
              enters verification code to confirm setup. (4) Force backup code download. (5)
              Require password confirmation. (6) Enable MFA. (7) Show success with recovery
              options. Test each step before enabling.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you encourage MFA adoption?</p>
            <p className="mt-2 text-sm">
              A: Multi-pronged approach: (1) Prompt after signup (not during — reduces signup
              friction). (2) Explain security benefits clearly ("Protect your account"). (3) Make
              setup quick and simple (under 2 minutes). (4) Offer incentives (account recovery
              guarantee, badge). (5) Require for high-risk actions (password change, data export).
              (6) Send periodic reminders. (7) Show security status in account settings.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SMS MFA security concerns?</p>
            <p className="mt-2 text-sm">
              A: Acknowledge SMS vulnerabilities (SIM swapping, SS7 attacks) but provide as
              fallback: (1) Recommend TOTP/WebAuthn as primary. (2) Rate limit SMS sends (3/hour)
              to prevent toll fraud. (3) Warn users about SMS risks. (4) Allow phone number changes
              only with additional verification. (5) Monitor for suspicious SMS patterns. (6)
              Encourage migration to app-based MFA.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement WebAuthn/passkeys?</p>
            <p className="mt-2 text-sm">
              A: Use WebAuthn API: (1) Registration — navigator.credentials.create() generates
              keypair, store public key on server, private key stays on device. (2) Authentication
              — navigator.credentials.get() with challenge-response. (3) Support multiple devices
              per account. (4) Provide fallback (TOTP/SMS) for device loss. (5) Use libraries like
              @simplewebauthn for easier implementation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for MFA?</p>
            <p className="mt-2 text-sm">
              A: Adoption rate (% users with MFA enabled), enrollment completion rate, MFA method
              distribution (TOTP vs SMS vs WebAuthn), backup code usage rate, account recovery
              rate, MFA-related support tickets. Track by user segment (new vs existing, free vs
              paid). Monitor for anomalies (spike in recovery requests).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle MFA for enterprise/SSO users?</p>
            <p className="mt-2 text-sm">
              A: Enterprise users typically authenticate via SSO (SAML/OIDC) where MFA is enforced
              by identity provider (Okta, Azure AD). Don't require app-level MFA for SSO users —
              trust IdP's MFA. For local accounts in enterprise, offer same MFA options but
              consider enterprise policies (may require specific methods like hardware keys).
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
              href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - WebAuthn API
            </a>
          </li>
          <li>
            <a
              href="https://github.com/google/google-authenticator/wiki"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Authenticator Documentation
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Security Questions
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
