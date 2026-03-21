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
  const mfaSetupCode = `// TOTP MFA enrollment
class MFAService {
  async enableTOTP(userId: string): Promise<TOTPSetup> {
    const secret = speakeasy.generateSecret({
      name: \`Example (\${userEmail})\`,
      issuer: 'example.com',
      length: 32,
    });

    await this.userRepository.update(userId, {
      totpSecret: secret.base32,
      mfaEnabled: false, // Pending verification
    });

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url!,
      qrCodeDataURL: secret.qr_code_ascii!,
    };
  }

  async verifyTOTP(userId: string, token: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    return speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,
      window: 1,
    });
  }
}`;

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
        <p>
          For staff and principal engineers, implementing MFA setup requires understanding 
          different MFA methods (TOTP, SMS, WebAuthn, backup codes), secure enrollment 
          flows, recovery mechanisms, and UX patterns that encourage adoption while 
          preventing lockout. The implementation must balance security (strong methods)
          with accessibility (methods available to all users).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/mfa-setup-flow.svg"
          alt="MFA Setup Flow"
          caption="MFA Setup — showing enrollment, verification, backup codes, and recovery options"
        />
      </section>

      <section>
        <h2>MFA Methods</h2>

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
          <h3 className="mb-4 text-lg font-semibold">SMS/Phone-Based MFA</h3>
          <ul className="space-y-3">
            <li>
              <strong>Setup Flow:</strong> Enter phone number, receive SMS code, enter to 
              verify.
            </li>
            <li>
              <strong>Security:</strong> Vulnerable to SIM swapping, SMS interception. 
              Better than nothing, not recommended for high-security.
            </li>
            <li>
              <strong>UX:</strong> Familiar to users, no app install needed. Good fallback 
              option.
            </li>
            <li>
              <strong>Cost:</strong> Ongoing SMS costs for each authentication.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">WebAuthn / Passkeys</h3>
          <ul className="space-y-3">
            <li>
              <strong>Methods:</strong> Biometric (Touch ID, Face ID, Windows Hello), 
              hardware keys (YubiKey).
            </li>
            <li>
              <strong>Security:</strong> Phishing-resistant, strongest consumer option. 
              Private key never leaves device.
            </li>
            <li>
              <strong>Setup Flow:</strong> Register device, user authenticates (biometric/
              touch), store credential.
            </li>
            <li>
              <strong>UX:</strong> One-tap authentication after setup. Multiple devices 
              supported.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Backup Codes</h3>
          <ul className="space-y-3">
            <li>
              <strong>Format:</strong> 10 single-use 8-digit codes. Generate during MFA 
              setup.
            </li>
            <li>
              <strong>Security:</strong> Store securely offline. Each code used once. 
              Regenerate invalidates old codes.
            </li>
            <li>
              <strong>UX:</strong> Download/print prompt during setup. Emphasize 
              importance.
            </li>
            <li>
              <strong>Recovery:</strong> Last resort when other methods unavailable.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>MFA Setup Flow</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/mfa-methods.svg"
          alt="MFA Methods Comparison"
          caption="MFA Methods — comparing TOTP, SMS, WebAuthn, and backup codes with security levels"
        />

        <p>
          Guide users through MFA enrollment step by step.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 1: Method Selection</h3>
          <ul className="space-y-3">
            <li>
              <strong>Present Options:</strong> Show all available methods with security 
              indicators. Recommend strongest (WebAuthn, TOTP).
            </li>
            <li>
              <strong>Explain Benefits:</strong> "Protect your account", "Prevent 
              unauthorized access".
            </li>
            <li>
              <strong>Progressive Enrollment:</strong> Start with one method, suggest 
              adding more later.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 2: TOTP Setup (Example)</h3>
          <ul className="space-y-3">
            <li>
              <strong>Generate Secret:</strong> 256-bit random secret. Store encrypted 
              server-side.
            </li>
            <li>
              <strong>Display QR Code:</strong> otpauth:// URI with issuer, account name, 
              secret. Standard format for compatibility.
            </li>
            <li>
              <strong>Manual Entry:</strong> Show secret as base32 string. Provide 
              account name/issuer for manual setup.
            </li>
            <li>
              <strong>Verification:</strong> User enters first TOTP code. Verify against 
              server secret. Clock skew tolerance (±1 period).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 3: Backup Codes</h3>
          <ul className="space-y-3">
            <li>
              <strong>Generate:</strong> 10 random 8-digit codes. Store hashes server-side.
            </li>
            <li>
              <strong>Display:</strong> Show once, encourage download/print. Don't show 
              again.
            </li>
            <li>
              <strong>Confirmation:</strong> Require user to check "I saved these codes" 
              before continuing.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 4: Enable MFA</h3>
          <ul className="space-y-3">
            <li>
              <strong>Activate:</strong> Set mfa_enabled = true. Store enrolled methods.
            </li>
            <li>
              <strong>Test:</strong> Require MFA on next login to confirm setup works.
            </li>
            <li>
              <strong>Confirmation:</strong> Show success message with recovery options.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Recovery &amp; Account Access</h2>
        <ul className="space-y-3">
          <li>
            <strong>Backup Codes:</strong> Primary recovery method. One-time use, 
            regenerate as needed.
          </li>
          <li>
            <strong>Alternative Methods:</strong> Allow multiple MFA methods. If one 
            unavailable, use another.
          </li>
          <li>
            <strong>Account Recovery:</strong> Last resort: identity verification, 
            support ticket, waiting period.
          </li>
          <li>
            <strong>Trusted Devices:</strong> Remember devices for 30 days. Skip MFA 
            on trusted devices.
          </li>
        </ul>
      </section>

      <section>
        <h2>UX Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Encourage Not Force:</strong> Strongly recommend MFA, but don't 
            mandate (except for high-security).
          </li>
          <li>
            <strong>Clear Instructions:</strong> Step-by-step guides for each method. 
            Screenshots, videos.
          </li>
          <li>
            <strong>Test Before Enable:</strong> Verify method works before requiring 
            MFA on login.
          </li>
          <li>
            <strong>Multiple Methods:</strong> Encourage enrolling 2+ methods for 
            redundancy.
          </li>
          <li>
            <strong>Recovery Emphasis:</strong> Stress importance of backup codes. 
            Make download easy.
          </li>
        </ul>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST SP 800-63B - Digital Identity Guidelines
            </a>
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Multifactor Authentication Cheat Sheet
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Use cryptographically secure random secrets (256-bit for TOTP)</li>
          <li>Store TOTP secrets encrypted at rest</li>
          <li>Implement rate limiting for MFA verification attempts</li>
          <li>Use constant-time comparison for code validation</li>
          <li>Require backup codes before enabling MFA</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Provide step-by-step setup guides for each method</li>
          <li>Test MFA method before enforcing</li>
          <li>Allow multiple MFA methods for redundancy</li>
          <li>Offer trusted device option (30-day skip)</li>
          <li>Send confirmation email when MFA enabled/disabled</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recovery Planning</h3>
        <ul className="space-y-2">
          <li>Require backup code download during setup</li>
          <li>Allow enrollment of multiple methods</li>
          <li>Provide clear account recovery process</li>
          <li>Document recovery steps in help center</li>
          <li>Train support team on MFA recovery procedures</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>Track MFA enrollment rate by method</li>
          <li>Monitor MFA verification failures</li>
          <li>Alert on unusual patterns (many failures from same IP)</li>
          <li>Track backup code usage</li>
          <li>Monitor trusted device adoption</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No backup codes:</strong> Users locked out if they lose phone.
            <br /><strong>Fix:</strong> Require backup code download before enabling MFA. Store securely.
          </li>
          <li>
            <strong>Single MFA method:</strong> No fallback if primary unavailable.
            <br /><strong>Fix:</strong> Encourage 2+ methods. Allow SMS fallback for TOTP.
          </li>
          <li>
            <strong>No clock skew tolerance:</strong> Valid codes rejected due to time drift.
            <br /><strong>Fix:</strong> Accept ±1 time window (±30 seconds) for TOTP.
          </li>
          <li>
            <strong>Forcing MFA immediately:</strong> Users frustrated before understanding value.
            <br /><strong>Fix:</strong> Encourage strongly, mandate for high-risk accounts only.
          </li>
          <li>
            <strong>Poor QR code display:</strong> QR code too small or low contrast.
            <br /><strong>Fix:</strong> Large, high-contrast QR code. Provide manual entry fallback.
          </li>
          <li>
            <strong>No MFA testing:</strong> Enable without verifying method works.
            <br /><strong>Fix:</strong> Require successful verification code before enabling.
          </li>
          <li>
            <strong>Storing secrets unencrypted:</strong> TOTP secrets exposed if DB compromised.
            <br /><strong>Fix:</strong> Encrypt secrets at rest using envelope encryption.
          </li>
          <li>
            <strong>No rate limiting:</strong> Brute force attacks on MFA codes.
            <br /><strong>Fix:</strong> Rate limit verification attempts (5/hour per user).
          </li>
          <li>
            <strong>Trusted device on shared computers:</strong> Security risk on public devices.
            <br /><strong>Fix:</strong> Warn users, limit to personal devices, clear on password change.
          </li>
          <li>
            <strong>Poor recovery process:</strong> Users can't recover accounts.
            <br /><strong>Fix:</strong> Clear account recovery flow with identity verification.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Adaptive MFA</h3>
        <p>
          Adjust MFA requirements based on risk signals.
        </p>
        <ul className="space-y-2">
          <li><strong>Risk Signals:</strong> Device trust, location, IP reputation, time of day, behavior patterns.</li>
          <li><strong>Low Risk:</strong> Skip MFA on trusted devices/locations.</li>
          <li><strong>Medium Risk:</strong> Require MFA for login.</li>
          <li><strong>High Risk:</strong> Require MFA + additional verification (SMS + TOTP).</li>
          <li><strong>Implementation:</strong> Risk engine evaluates signals, selects MFA policy dynamically.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Passwordless with WebAuthn</h3>
        <p>
          Eliminate passwords entirely using FIDO2/WebAuthn.
        </p>
        <ul className="space-y-2">
          <li><strong>Platform Authenticators:</strong> Touch ID, Face ID, Windows Hello. Built into devices.</li>
          <li><strong>Roaming Authenticators:</strong> YubiKey, other hardware keys. Portable across devices.</li>
          <li><strong>Setup:</strong> Register credential during onboarding. User authenticates with biometric/touch.</li>
          <li><strong>Login:</strong> One-tap authentication. No password needed. Phishing-resistant.</li>
          <li><strong>Implementation:</strong> Use libraries (simplewebauthn, @github/webauthn-json). Fallback to password during transition.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MFA for Enterprise</h3>
        <p>
          Enterprise-specific MFA requirements and integrations.
        </p>
        <ul className="space-y-2">
          <li><strong>SSO Integration:</strong> MFA handled by IdP (Okta, Azure AD). Don't duplicate.</li>
          <li><strong>Hardware Keys:</strong> Require YubiKey for high-security roles.</li>
          <li><strong>Admin Recovery:</strong> Admin can reset MFA for users (with audit trail).</li>
          <li><strong>Compliance:</strong> Meet regulatory requirements (SOC2, HIPAA, PCI-DSS).</li>
          <li><strong>Reporting:</strong> MFA enrollment reports for auditors.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">MFA Fatigue Prevention</h3>
        <p>
          Prevent MFA bombing attacks (spamming push notifications).
        </p>
        <ul className="space-y-2">
          <li><strong>Rate Limiting:</strong> Limit push notifications (3/hour per user).</li>
          <li><strong>Number Matching:</strong> Show number on login, user enters in app. Prevents mindless approval.</li>
          <li><strong>Location Display:</strong> Show login location in push notification.</li>
          <li><strong>Temporary Lockout:</strong> Lock account after multiple MFA failures.</li>
          <li><strong>User Education:</strong> Teach users to deny unexpected MFA requests.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/mfa-recovery.svg"
          alt="MFA Recovery Options"
          caption="MFA Recovery — showing backup codes, account recovery, and admin reset flows"
        />

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Which MFA method do you recommend?</p>
            <p className="mt-2 text-sm">
              A: WebAuthn/passkeys for best security + UX (phishing-resistant, one-tap). TOTP apps as second choice (secure, works offline, no ongoing cost). SMS as last resort (vulnerable to SIM swapping, but better than nothing). Offer all three, recommend in that order. For enterprise: hardware keys for high-security roles.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent MFA lockout?</p>
            <p className="mt-2 text-sm">
              A: Require backup codes during setup (download before enabling). Allow multiple MFA methods (TOTP + SMS + WebAuthn). Trusted devices option (30-day skip). Account recovery flow with identity verification and waiting period. Test MFA before enforcing. Admin reset capability for enterprise.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle TOTP clock skew?</p>
            <p className="mt-2 text-sm">
              A: Accept codes from previous/current/next time window (±1 period = ±30 seconds). Don't adjust server clock, accept wider range. Most TOTP libraries support this via "window" parameter. If user has consistent skew, suggest they sync authenticator app time. Log skew patterns for monitoring.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should MFA be mandatory?</p>
            <p className="mt-2 text-sm">
              A: Depends on risk profile. For financial/healthcare: yes, mandatory for all users. For consumer apps: strongly encourage but optional (show security benefits). For admin/privileged accounts: always mandatory. Use risk-based: require MFA for sensitive actions (password change, data export) even if not enabled for regular login.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement trusted devices?</p>
            <p className="mt-2 text-sm">
              A: Set long-lived cookie (30 days) on successful MFA login. Skip MFA if cookie present and valid. Allow user to see/revoke trusted devices in security settings. Clear all trusted devices on password change. Store device fingerprint (user agent, IP range) for additional security. Warn users not to trust shared/public computers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle MFA for users without smartphones?</p>
            <p className="mt-2 text-sm">
              A: Offer SMS fallback (voice call option), hardware keys (YubiKey), backup codes as primary method. Don't exclude users without smartphones—provide accessible alternatives. For enterprise: provide hardware keys to employees. For consumer: SMS + backup codes sufficient for most users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent MFA fatigue/bombing attacks?</p>
            <p className="mt-2 text-sm">
              A: Rate limit push notifications (3/hour per user). Implement number matching (show number on login, user enters in app). Display location in push notification. Temporary account lockout after multiple MFA failures. User education: teach users to deny unexpected MFA requests and report them immediately.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle MFA migration (changing devices)?</p>
            <p className="mt-2 text-sm">
              A: Allow multiple TOTP devices during setup (scan QR from multiple phones). Provide backup codes for emergency access. Allow MFA reset via verified email/SMS with waiting period. For enterprise: admin can reset MFA after identity verification. Document migration process clearly in help center.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for MFA?</p>
            <p className="mt-2 text-sm">
              A: Primary: MFA enrollment rate (% of users), enrollment by method (TOTP/SMS/WebAuthn), MFA success/failure rate. Security: MFA bypass attempts, backup code usage, MFA fatigue incidents. UX: Setup completion rate, drop-off at each step, trusted device adoption. Set up alerts for anomalies (spike in failures, low enrollment).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Security Checklist</h2>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Pre-Launch Checklist</h3>
          <ul className="space-y-2">
            <li>☐ Cryptographically secure secret generation (256-bit)</li>
            <li>☐ TOTP secrets encrypted at rest</li>
            <li>☐ Rate limiting for MFA verification (5/hour per user)</li>
            <li>☐ Clock skew tolerance (±1 time window)</li>
            <li>☐ Backup code generation and download</li>
            <li>☐ Multiple MFA methods supported</li>
            <li>☐ Trusted device option implemented</li>
            <li>☐ MFA testing before enforcement</li>
            <li>☐ Account recovery flow documented</li>
            <li>☐ Confirmation emails on MFA changes</li>
            <li>☐ Audit logging for all MFA events</li>
            <li>☐ Admin reset capability (enterprise)</li>
            <li>☐ Penetration testing completed</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>Test TOTP secret generation (randomness, length)</li>
          <li>Test TOTP code validation (valid, expired, invalid)</li>
          <li>Test clock skew tolerance</li>
          <li>Test backup code generation and validation</li>
          <li>Test rate limiting logic</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>Test complete MFA setup flow end-to-end</li>
          <li>Test QR code generation and scanning</li>
          <li>Test SMS delivery and verification</li>
          <li>Test WebAuthn registration and authentication</li>
          <li>Test backup code download and usage</li>
          <li>Test trusted device functionality</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Tests</h3>
        <ul className="space-y-2">
          <li>Test TOTP brute force resistance</li>
          <li>Test rate limiting effectiveness</li>
          <li>Test backup code reuse detection</li>
          <li>Test MFA bypass attempts</li>
          <li>Test trusted device cookie security</li>
          <li>Penetration testing for MFA bypass</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">UX Tests</h3>
        <ul className="space-y-2">
          <li>Test QR code readability (various devices)</li>
          <li>Test manual entry flow</li>
          <li>Test setup instructions clarity</li>
          <li>Test mobile responsiveness</li>
          <li>User testing for setup comprehension</li>
        </ul>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication Cheat Sheet</a></li>
          <li><a href="https://www.fidoalliance.org/fido2/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FIDO2/WebAuthn Specification</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://simplewebauthn.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">SimpleWebAuthn Library</a></li>
          <li><a href="https://github.com/speakeasyjs/speakeasy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Speakeasy TOTP Library</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - WebAuthn API</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management</a></li>
        </ul>
      </section>

      <section>
        <h2>Implementation Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">TOTP Secret Generation</h3>
        <p>
          Generate cryptographically secure random secrets using platform-specific APIs. Node.js: crypto.randomBytes(32). Python: secrets.token_bytes(32). Go: crypto/rand.Read(). Encode as base32 for TOTP compatibility. Store encrypted in database using envelope encryption.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">QR Code Generation</h3>
        <p>
          Generate QR code from otpauth:// URI. Format: otpauth://totp/Issuer:User?secret=SECRET&issuer=Issuer&algorithm=SHA1&digits=6&period=30. Use libraries (qrcode, node-qrcode) to generate PNG/SVG. Display at minimum 200x200px for reliable scanning. Provide manual entry fallback.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Backup Code Generation</h3>
        <p>
          Generate 10 random 8-digit codes. Use cryptographically secure random. Store hashes (not plaintext) in database. Display once during setup with download/print option. Require user confirmation before proceeding. Allow regeneration (invalidates old codes).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">WebAuthn Registration</h3>
        <p>
          Use navigator.credentials.create() for registration. Generate challenge server-side (random 32 bytes). Pass challenge, rp (relying party), user info to browser. User authenticates with biometric/touch. Store credential ID and public key server-side. Associate with user account.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Trusted Device Management</h3>
        <p>
          Set HttpOnly, Secure, SameSite cookie on successful MFA login. Include device fingerprint (user agent hash, IP range). 30-day expiry standard. Provide UI to view/revoke trusted devices. Clear all on password change. Log trusted device creation/revocation for audit.
        </p>
      </section>
    </ArticleLayout>
  );
}
