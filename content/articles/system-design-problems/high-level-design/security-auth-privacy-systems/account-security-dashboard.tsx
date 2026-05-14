"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-account-security-dashboard",
  title: "Design an Account Security Dashboard (Sessions, Devices)",
  description:
    "Architecture for an account security dashboard: active session listing with device fingerprint, IP geolocation, and last-active timestamp; session revocation with real-time WebSocket push to invalidate the revoked session; device trust management with remembered and untrusted device lists; login history with anomaly highlighting (new location, unusual time); two-factor authentication enrollment and backup codes; password change with breach check via HaveIBeenPwned k-anonymity API; security event timeline; and account recovery options management.",
  category: "high-level-design",
  subcategory: "security-auth-privacy-systems",
  slug: "account-security-dashboard",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "security-dashboard", "session-management", "device-trust", "login-history", "mfa-enrollment", "breach-check", "revocation"],
  relatedTopics: ["authentication-system", "secure-token-session-handling"],
};

export default function AccountSecurityDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">An account security dashboard gives users visibility into and control over their account's security posture. GitHub's security settings, Google's Security Checkup, and Apple ID's device management are canonical examples. The dashboard shows active sessions (what devices and browsers are currently logged in), recent login history (with anomaly detection for suspicious logins), enrolled MFA methods, and account recovery options. The primary user intent is detection and response: "Is there a session I don't recognize? Revoke it. Was there a login from an unusual location? Investigate."</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The critical security action — session revocation — must be immediate and reliable. If a user sees a compromised session and clicks "Sign out all other devices," every other session must be invalidated within seconds. This requires the session invalidation to propagate to the active sessions via real-time push (WebSocket or SSE), not just a database flag that is checked on the next request. A session that is not invalidated until the next API call could remain active for 15 minutes (the access token TTL) after revocation.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Session listing and revocation, device trust management, login history with anomaly flags, MFA enrollment UI, and password breach check. Not in scope: backend anomaly detection algorithms, push notification infrastructure, or identity verification for account recovery.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Active session listing:</strong> Each active session is shown with: device type (desktop/mobile, inferred from user-agent), browser name and version, IP address with geolocation (city, country, flag emoji), last active timestamp (relative: "2 hours ago"), and a "This device" badge on the current session. Sessions are sorted by last-active descending. The current session cannot be revoked from this panel (to prevent accidental self-lockout); it shows a "Sign out" button that performs a normal logout.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Session revocation:</strong> Clicking "Revoke" on a session sends DELETE /api/sessions/&#123;sessionId&#125; to the backend. The backend: (1) marks the session as revoked in the session store (Redis: SET session:&#123;id&#125;:revoked 1 EX 86400); (2) publishes a REVOKE event to the session's WebSocket channel. The revoked client's WebSocket receives the REVOKE event, clears the in-memory access token, deletes the session cookie (client-side document.cookie manipulation, or a redirect to /auth/logout that clears the HttpOnly cookie), and redirects to the login page with a "Your session has been signed out" message.</HighlightBlock>
          <li><strong>Login history:</strong> The last 90 days of login events are shown in a timeline: timestamp, IP, location, device, and success/failure status. Suspicious logins are flagged with an amber warning icon: new country (first login from this country), unusual time (3am local time), failed attempt followed by success (credential stuffing), or multiple failed attempts. Each suspicious event has a "This was me" / "This wasn't me" action — "This wasn't me" triggers an account lockdown flow (immediate session revocation + password reset email).</li>
          <HighlightBlock as="li" tier="important"><strong>MFA enrollment:</strong> The MFA section shows enrolled methods (Authenticator app, security key, SMS backup). Adding a new TOTP authenticator: (1) server generates a TOTP secret and QR code URL; (2) UI renders the QR code via a canvas element (using qrcode.js); (3) user scans with their authenticator app; (4) user enters the 6-digit code to verify enrollment; (5) backup codes are generated and shown once (user must save them). The backup codes are shown in a modal with a "Copy all" button and a "Download as .txt" link.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Real-time revocation propagation:</strong> Session revocation must reach the active session within 3 seconds. This requires the revoked session's WebSocket connection to be maintained (so the REVOKE event can be delivered). If the WebSocket is disconnected at the time of revocation, the revoked session's next API request returns a 401 (the backend checks the revoked flag on every request) and the session is invalidated server-side within the access token TTL (15 minutes maximum).</HighlightBlock>
          <li><strong>Password breach check:</strong> When the user changes their password, the new password is checked against the HaveIBeenPwned (HIBP) k-anonymity API before submission. The client computes SHA-1 hash of the password, sends the first 5 characters of the hash to the HIBP API (GET https://api.pwnedpasswords.com/range/&#123;5chars&#125;), and checks if the full hash appears in the response. This k-anonymity model ensures the full password hash is never sent to the external API. If found in the breach database, a warning is shown: "This password has appeared in a data breach. Choose a different one." The form is not submitted until the user chooses a non-breached password.</li>
          <HighlightBlock as="li" tier="important"><strong>Confirmation for destructive actions:</strong> "Revoke all sessions," "Remove MFA method," and "Delete account" require a re-authentication step (enter current password or complete MFA) before proceeding. This prevents an attacker with temporary access to an unlocked computer from locking out the legitimate user.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The security dashboard is a read-heavy interface (mostly displaying state) with a few high-stakes write operations (revocation, MFA enrollment). The dashboard loads session data on mount (GET /api/sessions, GET /api/login-history, GET /api/security-settings — batched via BFF), renders the state, and subscribes to a WebSocket channel for real-time security events (new login, session revoked). Destructive operations follow a confirm-then-execute pattern with re-authentication gates. The current session's WebSocket connection listens for its own revocation event (in case it is revoked by another session) — on receiving REVOKE for its own sessionId, it executes logout immediately.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/security-auth-privacy-systems/account-security-dashboard.svg"
          alt="Account security dashboard: session listing (GET /api/sessions → device type, browser, IP+geolocation, lastActive; sorted by lastActive DESC; current session badge; revoke button for others), session revocation (DELETE /api/sessions/{id}; backend: Redis SET revoked 1 EX 86400; WS REVOKE event to target session; target: clear token + delete cookie + redirect login 'Your session was signed out'), login history (90 days timeline; anomaly flags: new country, unusual time 3am, fail→success pattern; 'Wasn't me' → lockdown: revoke all + password reset email), MFA enrollment (TOTP: server generates secret+QR; canvas QR code; user scans; verify 6-digit; backup codes shown once + copy/download; WebAuthn: navigator.credentials.create → attestation → server stores pubkey), password breach check (new password → SHA-1 → first 5 chars → HIBP range API GET; check full hash in response; found → warning 'appeared in breach'; not found → allow submit; k-anonymity: full hash never sent), re-auth gate (revoke all + remove MFA + delete account → confirm dialog + enter password or MFA challenge before proceeding)."
          caption="Session listing (device/browser/IP geolocation, lastActive sort), real-time revocation (DELETE → Redis revoked flag → WS REVOKE event → target clears cookie + redirects), login history anomaly flags (new country/unusual time/fail→success), TOTP enrollment QR canvas + backup codes, HIBP k-anonymity breach check (SHA-1 first 5 chars, full hash never leaves browser), re-auth gate for destructive actions"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Session Data Model and Fingerprinting</h3>
        <HighlightBlock as="p" tier="important">Each session record (in Redis or a sessions table) stores: sessionId, userId, createdAt, lastActiveAt, ipAddress, userAgent, deviceFingerprint (a hash of: OS, browser, screen resolution, timezone, language — stable identifiers that distinguish devices), geoLocation &#123;city, country, countryCode&#125; (derived server-side from IP on session creation using MaxMind GeoLite2), isTrusted (boolean — set when user clicks "Trust this device"), and revokedAt (null if active). The frontend renders device type by parsing the user-agent string client-side using ua-parser-js — showing a laptop icon for desktop, phone icon for mobile, tablet icon for tablets.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The "This device" identification: the current session's ID is included in the auth context (returned as part of the /auth/me response). The session list compares each session's ID to the current session ID and adds the "This device" badge. The current session's "Revoke" button is replaced with "Sign out" (which performs a normal logout of the current session, not an admin revocation).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Login History Anomaly Detection UI</h3>
        <HighlightBlock as="p" tier="important">Anomaly detection is performed server-side and stored with each login event — the frontend does not run anomaly logic, it renders server-generated anomaly flags. Each login event has an anomalyFlags array: ["NEW_COUNTRY", "UNUSUAL_HOUR", "CREDENTIAL_STUFFING_PATTERN"]. The UI renders these as colored badges: amber for individual anomalies, red for "CREDENTIAL_STUFFING_PATTERN" (high severity). The anomaly flag definitions: NEW_COUNTRY — first login from this country in the user's history; UNUSUAL_HOUR — login between midnight and 5am in the user's timezone; CREDENTIAL_STUFFING_PATTERN — 5+ failed attempts from different IPs followed by a successful login within 30 minutes.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The "Wasn't me" action flow: the user clicks "Wasn't me" on a suspicious login event. A modal confirms: "We'll sign out all other sessions and send you a password reset email. Continue?" On confirm: (1) POST /api/security/account-lockdown — revokes all sessions except the current one, invalidates all active MFA challenges, and sends a password reset email; (2) the modal closes, a success toast shows "All other sessions have been signed out. Check your email to reset your password."</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">TOTP Enrollment Flow</h3>
        <HighlightBlock as="p" tier="important">The TOTP enrollment flow requires care to avoid showing the TOTP secret in an unsafe context. Flow: (1) User clicks "Add authenticator app"; (2) POST /api/mfa/totp/enroll — the server generates a random 20-byte TOTP secret (base32-encoded), stores it temporarily (not committed to the user's account yet — only committed after verification), and returns the QR code URL (otpauth://totp/AppName:user@email?secret=BASE32SECRET&issuer=AppName); (3) The client renders the QR code using qrcode.js on a canvas element — the secret is in the QR code URL displayed in the client but never stored anywhere beyond the temporary server record; (4) User scans with authenticator app; (5) User enters the current 6-digit TOTP code to verify; (6) POST /api/mfa/totp/verify &#123;code&#125; — server verifies and commits the TOTP secret to the user's MFA record; (7) Server generates 10 backup codes (8-character alphanumeric), stores hashed versions, returns plaintext versions once; (8) UI shows backup codes in a modal with "Copy all" (uses navigator.clipboard.writeText) and "Download as .txt" (creates a Blob and a temporary &lt;a&gt; download link).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Device Trust and Remembered Devices</h3>
        <HighlightBlock as="p" tier="important">The "Trust this device for 30 days" option during MFA: when checked, the server sets a long-lived, device-specific cookie (trust-token) in addition to the session cookie. The trust token is a signed JWT containing: userId, deviceFingerprint, trustedUntil. On future logins from the same device (same fingerprint), the server checks the trust token — if valid and not expired, MFA is skipped. The trust token is stored as a separate HttpOnly cookie so it survives session logout (the session cookie is cleared on logout, but the trust token persists until its expiry). The security dashboard shows trusted devices and allows revoking trust tokens individually (DELETE /api/trusted-devices/&#123;tokenId&#125; — invalides the token without affecting the session).</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Real-time revocation vs. polling: the WebSocket approach for revocation propagation adds complexity (maintaining WebSocket connections for every active session). An alternative: check the revoked flag in Redis on every API request (token introspection). This trades real-time propagation for simplicity — a revoked session may make up to one more API request before being blocked. For most use cases (the user saw a suspicious session and revoked it), the one-request delay is acceptable. For high-security scenarios (suspected account compromise), real-time WebSocket revocation is justified.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Backup code UX tradeoffs: showing backup codes only once (at enrollment time) is the standard pattern — it forces the user to save them immediately. However, many users lose their backup codes. Alternatives: allow re-generating backup codes (which invalidates the old ones); provide an account recovery email (the user receives a recovery link to their verified email if they lose all MFA methods); or allow "recovery via trusted contact" (another user vouches for identity — complex but zero-server-knowledge). The "show once" policy with a forced confirmation ("I have saved these codes") before closing is the right balance for most applications.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">An account security dashboard covers: (1) session listing (device type from UA parser, IP geolocation, lastActive, current session badge, revoke others); (2) real-time revocation (DELETE → Redis revoked flag → WS REVOKE event → target clears cookie + redirects login); (3) login history with server-side anomaly flags (NEW_COUNTRY, UNUSUAL_HOUR, CREDENTIAL_STUFFING — rendered as colored badges, "Wasn't me" triggers account lockdown + password reset email); (4) TOTP enrollment (server temp secret → QR code URL → canvas render → verify 6-digit → commit + generate backup codes shown once, copy/download); (5) HIBP k-anonymity breach check (SHA-1 first 5 chars to range API, full hash check client-side, full hash never sent externally); and (6) re-auth gate for destructive actions (confirm + password/MFA challenge before revoke-all or delete). The core security principle: every destructive action on the security dashboard requires fresh authentication — temporary access to a logged-in browser should not allow an attacker to lock out the legitimate user.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
