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
        <p>
          For staff and principal engineers, implementing MFA setup requires understanding 
          different MFA methods (TOTP, SMS, WebAuthn, backup codes), secure enrollment 
          flows, recovery mechanisms, and UX patterns that encourage adoption while 
          preventing lockout. The implementation must balance security (strong methods) 
          with accessibility (methods available to all users).
        </p>
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
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Which MFA method do you recommend?</p>
            <p className="mt-2 text-sm">
              A: WebAuthn/passkeys for best security + UX (phishing-resistant, one-tap). 
              TOTP apps as second choice (secure, works offline). SMS as last resort 
              (vulnerable to SIM swapping). Offer all three, recommend in that order.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent MFA lockout?</p>
            <p className="mt-2 text-sm">
              A: Require backup codes during setup, allow multiple MFA methods, trusted 
              devices option, account recovery flow (identity verification + waiting 
              period). Test MFA before enforcing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle TOTP clock skew?</p>
            <p className="mt-2 text-sm">
              A: Accept codes from previous/current/next time window (±1 period = ±30 
              seconds). Don't adjust server clock, accept wider range. If consistent 
              skew, suggest user sync authenticator app.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should MFA be mandatory?</p>
            <p className="mt-2 text-sm">
              A: Depends on risk. For financial/healthcare: yes, mandatory. For consumer 
              apps: strongly encourage but optional. For admin accounts: mandatory. Use 
              risk-based: require MFA for sensitive actions even if not enabled for login.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement trusted devices?</p>
            <p className="mt-2 text-sm">
              A: Set long-lived cookie (30 days) on successful MFA. Skip MFA if cookie 
              present and valid. Allow user to revoke trusted devices. Clear on password 
              change. Store device fingerprint for additional security.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle MFA for users without smartphones?</p>
            <p className="mt-2 text-sm">
              A: Offer SMS fallback, hardware keys (YubiKey), backup codes as primary. 
              Voice call OTP. Don't exclude users without smartphones—provide accessible 
              alternatives.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
