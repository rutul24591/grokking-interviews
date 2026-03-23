"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-mfa-setup",
  title: "Multi-Factor Authentication Setup",
  description: "Comprehensive guide to implementing MFA enrollment flows covering TOTP apps, SMS, WebAuthn, backup codes, recovery options, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "mfa-setup",
  version: "extensive",
  wordCount: 8000,
  readingTime: 32,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "mfa", "2fa", "authentication", "security", "frontend"],
  relatedTopics: ["login-interface", "phone-verification", "security-settings", "authentication-service"],
};

export default function MFASetupArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Multi-Factor Authentication (MFA) Setup</strong> is the enrollment flow
          that allows users to configure additional authentication factors beyond password.
          MFA significantly improves account security by requiring something the user knows
          (password) plus something they have (phone, hardware key) or are (biometric).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/mfa-setup-flow.svg"
          alt="Mfa Setup Flow"
          caption="MFA Setup Flow — showing method selection, QR code generation, verification, and backup codes"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/mfa-methods.svg"
          alt="Mfa Methods"
          caption="MFA Methods — comparing knowledge, possession, inherence factors with security ranking"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/mfa-recovery.svg"
          alt="Mfa Recovery"
          caption="MFA Recovery — showing recovery options, backup codes, and best practices"
        />
      
        <p>
          For staff and principal engineers, implementing MFA setup requires understanding
          different MFA methods (TOTP, SMS, WebAuthn, backup codes), secure enrollment
          flows, recovery mechanisms, and UX patterns that encourage adoption while
          preventing lockout. The implementation must balance security (strong methods)
          with accessibility (methods available to all users).
        </p>

        

        

        
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready MFA setup flow must support multiple methods with secure enrollment and recovery.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">TOTP Authenticator Apps</h3>
          <ul className="space-y-3">
            <li>
              <strong>Apps:</strong> Google Authenticator, Microsoft Authenticator, Authy,
              1Password. Most secure consumer option.
            </li>
            <li>
              <strong>Setup Flow:</strong> Generate secret, display QR code, user scans,
              enter first code to verify.
            </li>
            <li>
              <strong>Security:</strong> Works offline, no SMS interception risk. Device
              loss = account loss (mitigate with backup codes).
            </li>
            <li>
              <strong>UX:</strong> Manual entry fallback for QR code failures. Test code
              before enabling.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">SMS/Phone MFA</h3>
          <ul className="space-y-3">
            <li>
              <strong>Setup:</strong> Enter phone number, receive SMS code, verify code.
              Store verified phone.
            </li>
            <li>
              <strong>Security:</strong> Vulnerable to SIM swapping, SS7 attacks. Less
              secure than TOTP.
            </li>
            <li>
              <strong>Accessibility:</strong> Works on any phone. Good fallback for users
              without smartphones.
            </li>
            <li>
              <strong>Rate Limiting:</strong> Limit SMS sends (3/hour) to prevent toll
              fraud.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">WebAuthn/Passkeys</h3>
          <ul className="space-y-3">
            <li>
              <strong>Setup:</strong> Register device (Touch ID, Face ID, Windows Hello,
              YubiKey). Phishing-resistant.
            </li>
            <li>
              <strong>Security:</strong> Strongest consumer option. Public key crypto.
              No shared secrets.
            </li>
            <li>
              <strong>UX:</strong> One-tap authentication. No codes to enter. Best user
              experience.
            </li>
            <li>
              <strong>Fallback:</strong> Always provide alternative (TOTP, SMS) for
              device loss.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Backup Codes</h3>
          <ul className="space-y-3">
            <li>
              <strong>Generation:</strong> Generate 10 one-time codes during MFA setup.
              Each code usable once.
            </li>
            <li>
              <strong>Storage:</strong> User must download/print. Never store plaintext
              server-side (store hashes).
            </li>
            <li>
              <strong>Recovery:</strong> Use when primary MFA method unavailable. Regenerate
              after use.
            </li>
            <li>
              <strong>UX:</strong> Force download before enabling MFA. Clear warnings about
              importance.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Require password confirmation before enabling MFA</li>
          <li>Generate cryptographically secure secrets (32 bytes)</li>
          <li>Store secret hashes, not plaintext</li>
          <li>Require verification code before enabling</li>
          <li>Provide backup codes for recovery</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Show clear setup instructions for each method</li>
          <li>Provide QR code + manual entry for TOTP</li>
          <li>Test code before enabling MFA</li>
          <li>Force backup code download</li>
          <li>Allow multiple MFA methods simultaneously</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recovery</h3>
        <ul className="space-y-2">
          <li>Generate backup codes during setup</li>
          <li>Allow adding recovery phone/email</li>
          <li>Provide account recovery flow for lockout</li>
          <li>Support multiple backup methods</li>
          <li>Document recovery process clearly</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Adoption</h3>
        <ul className="space-y-2">
          <li>Prompt users to enable MFA after signup</li>
          <li>Explain security benefits clearly</li>
          <li>Make setup flow simple and quick</li>
          <li>Offer incentives (account recovery guarantee)</li>
          <li>Require for high-risk actions (optional)</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No backup codes:</strong> Users locked out if they lose phone.
            <br /><strong>Fix:</strong> Force backup code download during setup. Store securely.
          </li>
          <li>
            <strong>Weak secret generation:</strong> Predictable secrets enable attacks.
            <br /><strong>Fix:</strong> Use crypto.randomBytes(32) for 256-bit secrets.
          </li>
          <li>
            <strong>Storing plaintext secrets:</strong> Database breach exposes all secrets.
            <br /><strong>Fix:</strong> Store bcrypt hash of secret, not plaintext.
          </li>
          <li>
            <strong>No verification step:</strong> MFA enabled with wrong secret.
            <br /><strong>Fix:</strong> Require user to enter valid code before enabling.
          </li>
          <li>
            <strong>Single MFA method:</strong> No fallback if method unavailable.
            <br /><strong>Fix:</strong> Allow multiple methods (TOTP + SMS + backup codes).
          </li>
          <li>
            <strong>Poor QR code:</strong> Users can't scan, no manual entry option.
            <br /><strong>Fix:</strong> Provide manual entry key below QR code.
          </li>
          <li>
            <strong>No rate limiting:</strong> SMS MFA enables toll fraud.
            <br /><strong>Fix:</strong> Rate limit SMS sends (3/hour per phone).
          </li>
          <li>
            <strong>Unclear recovery:</strong> Users don't know how to recover account.
            <br /><strong>Fix:</strong> Document recovery process during setup. Provide recovery flow.
          </li>
          <li>
            <strong>Forcing MFA immediately:</strong> Frustrates new users.
            <br /><strong>Fix:</strong> Prompt after signup, require for sensitive actions.
          </li>
          <li>
            <strong>No MFA management:</strong> Can't change/disable MFA methods.
            <br /><strong>Fix:</strong> Provide settings page to manage MFA methods.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TOTP Implementation</h3>
        <p>
          Time-based One-Time Password algorithm for authenticator apps.
        </p>
        <ul className="space-y-2">
          <li><strong>Algorithm:</strong> HMAC-SHA1 of current time step (30 seconds). Truncate to 6 digits.</li>
          <li><strong>Secret:</strong> 32-byte base32-encoded secret. Share via QR code or manual entry.</li>
          <li><strong>Verification:</strong> Accept codes from ±1 time step (90 second window) for clock skew.</li>
          <li><strong>Libraries:</strong> speakeasy (Node), pyotp (Python), go-otp (Go).</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">WebAuthn/Passkeys</h3>
        <p>
          FIDO2 standard for phishing-resistant authentication.
        </p>
        <ul className="space-y-2">
          <li><strong>Registration:</strong> Generate keypair, store public key on server, private key on device.</li>
          <li><strong>Authentication:</strong> Challenge-response with biometric/pin verification.</li>
          <li><strong>Benefits:</strong> Phishing-resistant, no shared secrets, best UX.</li>
          <li><strong>Platforms:</strong> Touch ID, Face ID, Windows Hello, Android biometrics, YubiKey.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MFA Enforcement Policies</h3>
        <p>
          When to require MFA for users.
        </p>
        <ul className="space-y-2">
          <li><strong>Role-based:</strong> Require for admin/privileged accounts.</li>
          <li><strong>Risk-based:</strong> Require for logins from new devices/locations.</li>
          <li><strong>Action-based:</strong> Require for sensitive actions (password change, data export).</li>
          <li><strong>Gradual rollout:</strong> Prompt all users, require for high-risk accounts first.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Account Recovery</h3>
        <p>
          Recovery options when MFA methods unavailable.
        </p>
        <ul className="space-y-2">
          <li><strong>Backup Codes:</strong> Primary recovery method. One-time use codes.</li>
          <li><strong>Recovery Email:</strong> Send reset link to backup email.</li>
          <li><strong>Recovery Phone:</strong> SMS code to backup phone.</li>
          <li><strong>Support Ticket:</strong> Manual identity verification as last resort.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What MFA methods do you support and why?</p>
            <p className="mt-2 text-sm">
              A: Support multiple methods for accessibility: (1) TOTP authenticator apps (Google Authenticator, Authy) - most secure consumer option, works offline. (2) SMS - less secure (SIM swapping) but works on any phone, good fallback. (3) WebAuthn/passkeys - strongest option, phishing-resistant, best UX. (4) Backup codes - recovery when primary methods unavailable. Always allow multiple methods simultaneously.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate and store TOTP secrets?</p>
            <p className="mt-2 text-sm">
              A: Generate 32-byte cryptographically secure random secret (crypto.randomBytes(32)). Encode as base32 for user entry. Store bcrypt hash of secret (not plaintext) - protects against database breach. Display QR code (otpauth:// URL) for app scanning. Require user to enter valid code before enabling MFA (verifies correct setup).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent MFA lockout?</p>
            <p className="mt-2 text-sm">
              A: Multiple safeguards: (1) Force backup code download during setup - user must download/print 10 one-time codes. (2) Allow multiple MFA methods (TOTP + SMS + WebAuthn). (3) Add recovery email/phone as fallback. (4) Provide account recovery flow with manual identity verification. (5) Clear documentation of recovery options during setup.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's your MFA enrollment flow?</p>
            <p className="mt-2 text-sm">
              A: Step-by-step flow: (1) User selects MFA method. (2) Show setup instructions (QR code for TOTP, phone input for SMS, device registration for WebAuthn). (3) User enters verification code to confirm setup. (4) Force backup code download. (5) Require password confirmation. (6) Enable MFA. (7) Show success with recovery options. Test each step before enabling.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you encourage MFA adoption?</p>
            <p className="mt-2 text-sm">
              A: Multi-pronged approach: (1) Prompt after signup (not during - reduces signup friction). (2) Explain security benefits clearly ("Protect your account"). (3) Make setup quick and simple (under 2 minutes). (4) Offer incentives (account recovery guarantee, badge). (5) Require for high-risk actions (password change, data export). (6) Send periodic reminders. (7) Show security status in account settings.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle SMS MFA security concerns?</p>
            <p className="mt-2 text-sm">
              A: Acknowledge SMS vulnerabilities (SIM swapping, SS7 attacks) but provide as fallback: (1) Recommend TOTP/WebAuthn as primary. (2) Rate limit SMS sends (3/hour) to prevent toll fraud. (3) Warn users about SMS risks. (4) Allow phone number changes only with additional verification. (5) Monitor for suspicious SMS patterns. (6) Encourage migration to app-based MFA.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement WebAuthn/passkeys?</p>
            <p className="mt-2 text-sm">
              A: Use WebAuthn API: (1) Registration - navigator.credentials.create() generates keypair, store public key on server, private key stays on device. (2) Authentication - navigator.credentials.get() with challenge-response. (3) Support multiple devices per account. (4) Provide fallback (TOTP/SMS) for device loss. (5) Use libraries like @simplewebauthn for easier implementation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for MFA?</p>
            <p className="mt-2 text-sm">
              A: Adoption rate (% users with MFA enabled), enrollment completion rate, MFA method distribution (TOTP vs SMS vs WebAuthn), backup code usage rate, account recovery rate, MFA-related support tickets. Track by user segment (new vs existing, free vs paid). Monitor for anomalies (spike in recovery requests).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle MFA for enterprise/SSO users?</p>
            <p className="mt-2 text-sm">
              A: Enterprise users typically authenticate via SSO (SAML/OIDC) where MFA is enforced by identity provider (Okta, Azure AD). Don't require app-level MFA for SSO users - trust IdP's MFA. For local accounts in enterprise, offer same MFA options but consider enterprise policies (may require specific methods like hardware keys).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://www.fidoalliance.org/fido2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FIDO2/WebAuthn Specification</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - WebAuthn API</a></li>
          <li><a href="https://github.com/google/google-authenticator/wiki" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Google Authenticator Documentation</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Credential Stuffing Prevention</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer App MFA Enrollment</h3>
        <p>
          Social media platform with 500M users, driving MFA adoption for account security.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Low MFA adoption (5%). Users find MFA cumbersome. Need to balance security with UX.</li>
          <li><strong>Solution:</strong> Progressive enrollment: prompt after signup, show security benefits, offer multiple methods (TOTP, SMS, WebAuthn), skip for trusted devices.</li>
          <li><strong>Result:</strong> MFA adoption increased to 45% in 6 months. Account takeovers reduced by 80%. User complaints minimal.</li>
          <li><strong>Security:</strong> Backup codes mandatory, recovery email/phone options, clear recovery instructions.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise MFA Rollout</h3>
        <p>
          Enterprise SaaS with 10,000 corporate customers requiring MFA for compliance.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> SOC 2 compliance requires MFA for all admin users. Enterprise customers mandate MFA for all employees. Resistance from users.</li>
          <li><strong>Solution:</strong> Phased rollout: admins first, then all users. Hardware keys for admins, TOTP/SMS for employees. Grace period with reminders. Manager dashboards for compliance tracking.</li>
          <li><strong>Result:</strong> 100% admin MFA in 30 days. 95% employee MFA in 90 days. Passed SOC 2 audit. Customer contracts secured.</li>
          <li><strong>Security:</strong> Hardware keys (YubiKey) for admins, backup codes, manager-initiated recovery.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking MFA Implementation</h3>
        <p>
          Online banking platform with regulatory MFA requirements (FFIEC, PSD2).
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> PSD2 requires Strong Customer Authentication (SCA). Elderly customers struggle with apps. High-value transactions need enhanced verification.</li>
          <li><strong>Solution:</strong> Mandatory MFA for all users. SMS fallback for non-smartphone users. Step-up MFA for transactions over €500. Biometric option for mobile.</li>
          <li><strong>Result:</strong> Compliant with PSD2/SCA. Fraud reduced by 95%. Customer adoption smooth (multiple options).</li>
          <li><strong>Security:</strong> Transaction signing, geographic anomaly detection, mandatory re-enrollment annually.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare Provider MFA</h3>
        <p>
          HIPAA-compliant EHR system with 50,000 healthcare providers.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> HIPAA requires access controls. Providers need quick access in emergencies. Shared workstations complicate MFA.</li>
          <li><strong>Solution:</strong> Hardware keys for providers (quick tap). SMS fallback for shared workstations. Break-glass override for emergencies (audit logged). MFA exemption for emergency mode.</li>
          <li><strong>Result:</strong> Passed HIPAA audits. Provider satisfaction high (quick hardware key access). Zero unauthorized access via compromised credentials.</li>
          <li><strong>Security:</strong> Break-glass audit logging, automatic review of emergency access, mandatory MFA for normal access.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform MFA</h3>
        <p>
          Online gaming platform with high-value accounts (virtual items, currency).
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Account takeovers for valuable items. Young users without phones. International users (SMS costs).</li>
          <li><strong>Solution:</strong> Optional MFA with incentives (bonus items). TOTP for smartphone users, email codes for others. Parental MFA for minor accounts. MFA required for item trading.</li>
          <li><strong>Result:</strong> 60% MFA adoption. Account takeovers reduced by 85%. Trading fraud reduced by 90%.</li>
          <li><strong>Security:</strong> MFA for high-value actions (trading, currency transfer), backup codes, parental controls.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
