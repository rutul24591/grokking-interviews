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

export default function MfaWebauthnArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design MFA and WebAuthn</h1><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Multi-Factor Authentication — TOTP, WebAuthn &amp; Passkeys around identity UX, token/session safety, recovery flows, permission modeling, and abuse resistance. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><p>Design MFA and WebAuthn is a security-sensitive low-level design problem covering factor enrollment, challenge issuance, authenticator ceremony, TOTP fallback, recovery codes, step-up auth, replay defense, and device management. A principal-level answer must state the authoritative server boundary, threat model, lifecycle, abuse controls, rollback, privacy, observability, and user-safe degraded behavior.</p><p>Keep server-issued challenge, allowed credentials, factor policy, ceremony state, and verified grant separate. Challenges are single-use and short-lived. Core structures: challenge id, challenge bytes, RP id, allowed credential ids, ceremony state, factor registry, recovery-code inventory, step-up grant, and audit event.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/auth-user-systems/mfa-webauthn-runtime.svg" alt="Design MFA and WebAuthn runtime" caption="Security flow from user intent through authoritative validation and audit." /></section>
<section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: client UI can guide auth flows but server-side policy remains the authority for identity, session, and permission decisions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Multi-Factor Authentication — TOTP, WebAuthn &amp; Passkeys, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock><p>The retained deep dive below captures the topic-specific mechanics.</p><p>
        Multi-factor authentication (MFA) reduces account takeover risk by requiring a second proof of identity
        beyond a password. At FAANG scale, MFA systems handle billions of authentications, support multiple
        factor types (TOTP, WebAuthn, SMS, push), and must balance security with usability. Implementing MFA
        correctly involves deep knowledge of cryptographic protocols, UX state machines, and graceful degradation
        when factors are unavailable.
      </p>

      

      <h3>TOTP — Time-Based One-Time Passwords</h3>
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

      <h3>Recovery Codes</h3>
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

      <h3>WebAuthn — Hardware Keys and Device Authenticators</h3>
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

      <h3>Passkeys — Synced WebAuthn Credentials</h3>
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

      <h3>MFA State Machine and UX Flows</h3>
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

      <h3>SMS OTP and Push-Based MFA</h3>
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

      <h3>MFA Enrollment and Management UI</h3>
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
      </p></section>
<section><h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: token storage, MFA challenge state, redirect handling, session timeout, impersonation audit, and permission-cache invalidation.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock><p>Separate user intent, browser-safe projection, server validation, durable security record, audit evidence, and cleanup. Frontend state improves UX but never replaces server enforcement. Tokens, challenges, sessions, and privileged grants need explicit expiry and revocation.</p><p>Keep server-issued challenge, allowed credentials, factor policy, ceremony state, and verified grant separate. Challenges are single-use and short-lived.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/auth-user-systems/mfa-webauthn-recovery.svg" alt="Design MFA and WebAuthn threat recovery" caption="Threat recovery: validate, deny safely, preserve authoritative truth, audit, and recover." /></section>
<section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock><p>The server challenge and verification result are authoritative. Browser ceremony output is untrusted until origin, RP id, challenge, signature, counter policy, and expiry pass. Scale and threat pressure comes from replay, phishing, cloned OTP attempts, lost devices, browser cancellation, clock skew, and recovery abuse. Fail closed for privilege while keeping error UX actionable.</p></section>
<section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: login completion, MFA failure, revocation latency, session timeout accuracy, and permission denial rate.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock><p>Use short-lived scoped grants, secure cookies, CSRF defenses, replay prevention, rotation, versioned writes, server-side authorization, rate limits, redacted logs, and explicit audit events. Test expiry, replay, revocation, retries, multiple tabs, and permission drift.</p></section>
<h3>Principal defense: authority, consistency, and abuse cost</h3><p>Use server-authoritative consistency for security decisions. Browser state is a revocable projection that can improve responsiveness but cannot grant access, extend expiry, or confirm a privileged transition. Every mutation carries a version, expiry, nonce, or idempotency key as appropriate; stale projections refresh or fail closed. Rollback means revoking the grant, session family, policy version, or pending intent while retaining an audit trail.</p><p>Model abuse and cost together. Rate-limit sensitive attempts by account, device, network, and risk cohort without turning the UI into an enumeration oracle. Bound session inventory, audit retention, challenge issuance, cross-tab broadcasts, and refresh retries. Emit denial reason classes, revocation lag, suspicious reuse, policy version, and correlation ids while avoiding sensitive payloads in telemetry.</p><h3>Trade-off under interview pressure</h3><p>The security trade-off is deliberate friction versus attack resistance. Add confirmation, step-up, short expiry, or approval only where risk warrants it, and keep server enforcement authoritative even when the browser projection feels slower. A principal answer explains which UX cost buys which abuse reduction.</p><section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: token leakage, stale auth state, broken recovery, confused deputy access, and invisible session revocation.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock><p>Common failures include trusting frontend guards, storing bearer tokens in localStorage, leaking account existence, missing idempotency, weak redirect validation, and incomplete audit evidence.</p><p>For this topic, expire and consume challenges, enforce origin and RP id, rate-limit fallback, hash recovery codes, preserve cancellation UX, and audit factor changes.</p></section>
<section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock><p>This design applies to user identity and access workflows where convenience must not weaken authoritative server enforcement or incident evidence.</p></section>
<section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock><h3>What is authoritative?</h3><p>The server challenge and verification result are authoritative. Browser ceremony output is untrusted until origin, RP id, challenge, signature, counter policy, and expiry pass.</p><h3>What breaks under abuse?</h3><p>replay, phishing, cloned OTP attempts, lost devices, browser cancellation, clock skew, and recovery abuse.</p><h3>How do you recover?</h3><p>expire and consume challenges, enforce origin and RP id, rate-limit fallback, hash recovery codes, preserve cancellation UX, and audit factor changes.</p><h3>What does the client enforce?</h3><p>The client improves usability and fails closed for privileged views; the server enforces every protected read and mutation.</p><h3>How do you observe incidents?</h3><p>Emit redacted audit records with subject, actor, policy version, reason, outcome, and correlation id.</p></section>
<section><h2>References</h2><ul><li><a href="https://www.rfc-editor.org/rfc/rfc7636" target="_blank" rel="noreferrer">RFC 7636 PKCE</a></li><li><a href="https://www.w3.org/TR/webauthn-3/" target="_blank" rel="noreferrer">WebAuthn Level 3</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noreferrer">MDN Cookies</a></li><li><a href="https://owasp.org/www-project-cheat-sheets/" target="_blank" rel="noreferrer">OWASP Cheat Sheets</a></li></ul></section>
</ArticleLayout>}