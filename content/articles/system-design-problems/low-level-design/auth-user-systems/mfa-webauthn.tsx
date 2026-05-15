"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-mfa-webauthn",
  title: "Multi-Factor Authentication — TOTP, WebAuthn & Passkeys",
  description:
    "Production-grade MFA implementation covering TOTP setup and verification, WebAuthn registration and authentication, passkeys, push-based MFA, fallback chains, device trust, and account recovery.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "mfa-webauthn",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-16",
  tags: ["mfa", "totp", "webauthn", "passkeys", "2fa", "authentication", "lld"],
};

export default function MfaWebauthnArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Multi-factor authentication (MFA) reduces account takeover risk by requiring a second proof of identity
        beyond a password. At FAANG scale, MFA systems handle billions of authentications, support multiple
        factor types (TOTP, WebAuthn, SMS, push), and must balance security with usability. Implementing MFA
        correctly involves deep knowledge of cryptographic protocols, UX state machines, and graceful degradation
        when factors are unavailable.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/auth-user-systems/mfa-webauthn.svg"
        alt="MFA WebAuthn Passkeys architecture diagram"
        caption="TOTP setup and verification, WebAuthn registration and authentication, MFA state machine, and fallback chains"
      />

      <h2>TOTP — Time-Based One-Time Passwords</h2>
      <p>
        TOTP (RFC 6238) generates 6-digit codes using a shared secret and the current time. It is the most
        widely deployed MFA factor because it works offline and requires only an authenticator app (Google
        Authenticator, Authy, 1Password).
      </p>
      <p>
        <strong>Secret generation.</strong> Generate a cryptographically random 160-bit (20-byte) secret
        using a CSPRNG. Base32-encode it to produce the human-readable secret that is encoded into the QR code.
        Never use the same secret twice. Store the secret server-side encrypted at rest (AES-256) before MFA
        is confirmed active — discard it if the user abandons setup.
      </p>
      <p>
        <strong>QR code format.</strong> Encode the secret as an <code>otpauth://</code> URI:
        <code>otpauth://totp/IssuerName:user@example.com?secret=BASE32SECRET&amp;issuer=IssuerName&amp;algorithm=SHA1&amp;digits=6&amp;period=30</code>.
        Render this as a QR code using a library like <code>qrcode</code>. Also display the raw secret for
        users who cannot scan QR codes.
      </p>
      <p>
        <strong>TOTP algorithm.</strong> The code = HOTP(secret, T) where T = floor(unix_timestamp / 30).
        HOTP is HMAC-SHA1(secret, T) truncated to 6 digits. The 30-second window means codes change every
        30 seconds. Authenticator apps show a countdown ring to help users submit before expiry.
      </p>
      <p>
        <strong>Setup verification.</strong> Before marking MFA as active, require the user to enter a valid
        code from their authenticator app. This confirms they saved the secret correctly. Only activate MFA
        after successful verification — otherwise users get locked out immediately.
      </p>
      <p>
        <strong>Clock skew tolerance.</strong> Accept codes for T-1, T, and T+1 (one window before and after
        current time). This provides ±30 seconds of tolerance for devices with slightly drifted clocks.
        Track the last accepted T value server-side to prevent replay attacks within the same window.
      </p>

      <HighlightBlock as="p" tier="crucial">
        Store TOTP secrets encrypted (AES-256 with a per-tenant key), never as plaintext. Hash recovery
        codes with bcrypt (cost factor 12) — they are long-lived credentials. Rate-limit TOTP verification
        to 5 attempts per 10 minutes to prevent brute-force of the 10^6 code space.
      </HighlightBlock>

      <h2>Recovery Codes</h2>
      <p>
        Recovery codes are one-time-use codes that allow account access if the primary MFA factor is lost.
        Generate 10 codes, each 16 characters from a URL-safe alphabet (base32 or alphanumeric). Display
        them once immediately after MFA setup, in a downloadable text file and optionally printable format.
      </p>
      <p>
        Store recovery codes bcrypt-hashed (never plaintext). On verification, iterate the stored hashes
        and compare using a constant-time comparison — bcrypt.compare() is inherently constant-time in its
        hash comparison but the iteration itself should short-circuit on first match. Mark each code as
        used (soft delete with timestamp) rather than deleting, for audit trail purposes.
      </p>
      <p>
        Alert the user via email when a recovery code is used — this may indicate account compromise.
        Prompt the user to regenerate recovery codes and reconfigure MFA after recovery code use.
      </p>

      <h2>WebAuthn — Hardware Keys and Device Authenticators</h2>
      <p>
        WebAuthn (Web Authentication API, W3C standard) enables phishing-proof authentication using
        public-key cryptography. The private key never leaves the authenticator device, and credentials
        are scoped to the origin — a fake phishing site cannot collect valid WebAuthn credentials.
      </p>
      <p>
        <strong>Registration flow.</strong> The server generates a registration challenge and sends
        PublicKeyCredentialCreationOptions containing: the challenge (random bytes), relying party info
        (id = your domain, name = "Your App"), user info (id, name, displayName), and supported algorithms
        (ES256 = -7, RS256 = -257).
      </p>
      <p>
        The browser calls <code>navigator.credentials.create(&#123;publicKey: options&#125;)</code>. The
        authenticator (Touch ID, Face ID, YubiKey, Windows Hello) generates a key pair and signs the
        challenge. The browser returns a PublicKeyCredential containing: credential id, attestation object
        (proving authenticator type), and clientDataJSON (containing the challenge and origin).
      </p>
      <p>
        The server verifies: (1) clientDataJSON.challenge matches the sent challenge, (2) clientDataJSON.origin
        matches your domain, (3) rpIdHash in authenticatorData matches SHA256 of your domain, (4) the
        attestation signature is valid. Store the credential id and public key (COSE-encoded) per user.
        Also store the initial signCount — used to detect cloned authenticators later.
      </p>
      <p>
        <strong>Authentication flow.</strong> Server sends a challenge and the user's registered credential
        IDs (so the browser knows which credentials are valid). Browser calls
        <code>navigator.credentials.get(&#123;publicKey: options&#125;)</code>. The authenticator signs the
        challenge with the private key. The server verifies the signature using the stored public key, verifies
        the challenge, and checks that the new signCount is greater than the stored count (a lower count
        indicates a cloned authenticator).
      </p>

      <HighlightBlock as="p" tier="important">
        WebAuthn credentials are origin-scoped — a credential registered at app.example.com cannot be used
        at phishing-example.com. This makes WebAuthn phishing-proof in a way that TOTP and SMS are not.
        A phishing site that collects a TOTP code can use it within 30 seconds; WebAuthn codes are
        cryptographically bound to the legitimate origin.
      </HighlightBlock>

      <h2>Passkeys — Synced WebAuthn Credentials</h2>
      <p>
        Passkeys are WebAuthn credentials synchronized across devices via cloud storage (iCloud Keychain
        for Apple, Google Password Manager for Android/Chrome). Unlike hardware keys that are device-bound,
        passkeys are available on all signed-in devices — combining WebAuthn security with the convenience
        of traditional passwords.
      </p>
      <p>
        <strong>Conditional UI (autofill).</strong> Use <code>navigator.credentials.get()</code> with
        <code>mediation: "conditional"</code> and <code>autocomplete="username webauthn"</code> on the
        username input. The browser shows available passkeys in the autofill dropdown — the user taps their
        passkey without explicitly clicking a "Sign in with passkey" button. This creates a native login
        experience.
      </p>
      <p>
        <strong>Passkey discovery.</strong> Before initiating passkey authentication, check browser support:
        <code>PublicKeyCredential.isConditionalMediationAvailable()</code>. Show a "Sign in with a passkey"
        button only when supported. Fall back to password + TOTP on unsupported browsers.
      </p>
      <p>
        <strong>Cross-device authentication.</strong> WebAuthn supports a hybrid transport where a desktop
        browser can authenticate using a passkey stored on a mobile phone — via a QR code and BLE proximity
        check. The browser shows a QR code; the phone scans it and performs the biometric check; the desktop
        session is authenticated. No app installation required.
      </p>

      <h2>MFA State Machine and UX Flows</h2>
      <p>
        MFA involves multiple states that must be managed carefully to avoid security gaps or poor UX.
      </p>
      <p>
        <strong>Authentication states:</strong> unauthenticated → password_verified → mfa_challenge →
        authenticated. Store the intermediate <code>password_verified</code> state server-side as a
        partial session (short TTL, 5 minutes). The partial session token is sent to the client to maintain
        state during the MFA challenge step. On MFA success, upgrade to a full session.
      </p>
      <p>
        <strong>Step-up authentication.</strong> Some actions (changing email, viewing sensitive data,
        approving large transactions) require re-authentication mid-session. Issue a step-up challenge
        without invalidating the current session — just require TOTP or WebAuthn confirmation for the
        specific action. Mark the session with a <code>step_up_at</code> timestamp; require re-challenge
        if more than 15 minutes have passed.
      </p>
      <p>
        <strong>Remember device.</strong> After successful MFA, offer "Don't ask again on this device for
        30 days." Issue a device trust token: a random 256-bit value stored in an httpOnly cookie with a
        30-day TTL. Server-side, store the hash of this token per user with device metadata (user-agent,
        IP subnet). On subsequent logins, if the device token is valid, skip MFA. Invalidate device tokens
        on password change or explicit "sign out all devices."
      </p>
      <p>
        <strong>MFA factor fallback chain.</strong> Users may not have their primary factor available.
        Implement a fallback chain: WebAuthn → TOTP → SMS OTP → Recovery code. Each step down is less
        secure — log which factor was used and flag unusual patterns (user always uses recovery codes,
        suggesting their TOTP device is lost).
      </p>
      <p>
        <strong>Brute-force protection.</strong> Rate limit MFA attempts: 5 attempts per 10 minutes per
        user per factor. After 10 total failures, temporarily lock the account and send an alert email.
        Distinguish between attempts from recognized devices (lower risk) and new devices (higher risk).
      </p>

      <h2>SMS OTP and Push-Based MFA</h2>
      <p>
        <strong>SMS OTP.</strong> Generate a 6-digit code, store a bcrypt hash server-side with a 10-minute
        TTL. Send via SMS gateway (Twilio, AWS SNS). SMS is the weakest MFA factor — vulnerable to SIM swap
        attacks where an attacker convinces the carrier to transfer the phone number. Recommend TOTP or
        WebAuthn for all users; offer SMS as a fallback with clear risk disclosure.
      </p>
      <p>
        <strong>Push notification MFA.</strong> Send a push notification to the user's registered mobile
        app. Display the authentication context: requesting location, device, time, and the action being
        authorized. The user taps Approve or Deny. On Deny, alert the user that someone attempted to
        sign in. This is used by Duo Security, Okta Verify, and Microsoft Authenticator. Implement a
        polling or WebSocket mechanism on the web client to detect approval without requiring a page refresh.
      </p>

      <h2>MFA Enrollment and Management UI</h2>
      <p>
        The MFA management page allows users to add, remove, and view their registered factors. Key design
        decisions:
      </p>
      <p>
        <strong>Factor list.</strong> Show each registered factor with: type icon, name (user-provided for
        WebAuthn keys like "My MacBook Touch ID"), registration date, last used date, and a remove button.
        Always show the fallback options (recovery codes) prominently.
      </p>
      <p>
        <strong>Require verification before disabling.</strong> Never allow disabling MFA without entering
        a valid factor first. Show a confirmation dialog that explains the security implications. Send an
        email notification when MFA is disabled.
      </p>
      <p>
        <strong>Recovery code management.</strong> Show the count of remaining recovery codes (not the codes
        themselves after initial display). Provide a "Regenerate" button that invalidates all existing codes
        and generates new ones — require TOTP confirmation before regenerating.
      </p>
      <p>
        <strong>Admin override.</strong> Allow admins to reset a user's MFA if they are locked out.
        Require admin MFA verification plus a supervisor approval workflow for sensitive accounts. Log all
        admin MFA resets with reason codes. Send the affected user an email notification.
      </p>

      <h2>Interview Questions</h2>

      <h3>Q1: How does TOTP work cryptographically, and why is clock skew tolerance needed?</h3>
      <p>
        TOTP = HOTP(secret, T) where T = floor(unix_timestamp / 30). HOTP uses HMAC-SHA1(secret, T as
        8-byte big-endian integer). The result is 20 bytes; truncate by taking 4 bytes at an offset
        determined by the last nibble of the HMAC, then take that 32-bit value mod 10^6 for 6 digits.
        The shared secret is established during setup via QR code.
      </p>
      <p>
        Clock skew: user devices and servers may have clocks offset by up to 30–60 seconds. If the server
        uses T=current and the user's device clock is 35 seconds behind, the user's app shows the previous
        window's code. Accepting T-1 through T+1 tolerates ±30 seconds of drift. Track the last validated
        T per user to prevent replay of the same code within its valid window.
      </p>

      <h3>Q2: Why is WebAuthn phishing-proof when TOTP is not?</h3>
      <p>
        WebAuthn credentials are cryptographically bound to the relying party ID (your domain). When the
        browser calls credentials.get(), it includes the current origin in clientDataJSON and asks the
        authenticator to sign it. The server verifies the origin in the signed clientDataJSON matches the
        expected domain. A phishing site at evil.com cannot produce a valid signature for app.example.com
        — the signed origin would be evil.com, which the server rejects.
      </p>
      <p>
        TOTP codes are reusable secrets independent of origin. A phishing site can collect a valid TOTP code
        and replay it at the real site within the 30-second window. Real-time phishing (the attacker proxies
        the login in real-time) defeats TOTP completely. WebAuthn defeats real-time phishing because the
        authenticator verifies the origin before signing.
      </p>

      <h3>Q3: How would you implement a "remember this device" feature securely?</h3>
      <p>
        On successful MFA: generate a cryptographically random 256-bit device token. Store it in an httpOnly,
        Secure, SameSite=Strict cookie with a 30-day Max-Age. Server-side, store SHA256(token) in a
        device_tokens table with: user_id, token_hash, user_agent, ip_subnet (/24), device_name,
        created_at, last_used_at, expires_at.
      </p>
      <p>
        On subsequent login: after password verification, check if a device token cookie exists. Look up
        the token_hash. Verify user_id matches the authenticating user, not expired, and IP subnet is within
        the same /24 as registration (acceptable drift). If valid, skip MFA and update last_used_at.
        Invalidate all device tokens on password change, explicit "sign out everywhere," or suspicious
        activity detection. Show the user a list of trusted devices in their security settings with the
        ability to revoke individual ones.
      </p>

      <h3>Q4: What happens when a user loses both their TOTP device and recovery codes?</h3>
      <p>
        This is an account recovery scenario requiring identity verification without any registered factors.
        The recovery process should be deliberately slow and high-friction to prevent social engineering:
      </p>
      <p>
        (1) User initiates account recovery — enter email address. (2) Server sends a recovery link to the
        registered email (proves email access). (3) User clicks link — taken to identity verification step.
        (4) Depending on account sensitivity: low-risk accounts → answer security questions or verify
        recent activity (last purchase, last login city). High-risk accounts → require government ID
        verification (manual review or third-party ID verification service like Persona or Jumio).
        (5) After identity verification, disable all existing MFA factors and notify user via all registered
        channels. (6) Force MFA re-enrollment on next login. Log the recovery event with all verification
        details for audit purposes. Never allow phone-based recovery (SIM swap risk).
      </p>

      <h3>Q5: Design the MFA system for a banking app with step-up auth for large transactions.</h3>
      <p>
        Base authentication: username + password → TOTP or WebAuthn → session established (assurance level 2).
        For transactions under $500: session assurance level 2 sufficient. For transactions $500–$5000:
        step-up required if last full authentication was &gt;15 minutes ago — challenge TOTP or WebAuthn.
        Issue a step-up token (short TTL JWT) signed server-side, attached to the transaction request.
        For transactions &gt;$5000: always require step-up regardless of recency, plus a confirmation push
        notification to the mobile app showing full transaction details.
      </p>
      <p>
        Implement as middleware: transaction handler checks session amr (Authentication Methods References)
        claim and auth_time. If assurance level insufficient, return HTTP 403 with a
        <code>WWW-Authenticate: StepUp scope="transaction-auth"</code> header. The client interprets this
        and initiates a step-up challenge. After step-up completion, the server issues a short-lived
        transaction-scoped token attached to the pending transaction ID. The transaction handler accepts
        only this token for the specific transaction. Token is single-use — replaying it fails.
      </p>

      <h3>Q6: How would you detect and respond to a compromised MFA factor?</h3>
      <p>
        Detection signals: (1) signCount mismatch in WebAuthn — indicates a cloned authenticator. (2) TOTP
        codes used from multiple geographic locations within an impossible travel window. (3) Multiple failed
        MFA attempts followed by successful use of a different factor. (4) Recovery code used when primary
        factor was recently active. (5) User reports their phone stolen.
      </p>
      <p>
        Response: immediately invalidate all active sessions for the user. Revoke the compromised factor
        (WebAuthn credential or TOTP secret). Send security alert email with login history and a link to
        review recent account activity. Force full re-authentication including MFA re-enrollment. For
        high-value accounts, trigger a manual review queue. For WebAuthn compromise, invalidate all
        credentials (not just the cloned one) since the compromise may be broader. Issue a new recovery
        code set. Log the entire incident with timing, IPs, and methods for security audit.
      </p>
    </ArticleLayout>
  );
}
