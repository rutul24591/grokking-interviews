"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-device-session-management-ui",
  title: "Device / Session Management UI System",
  description: "Designing user-facing interfaces for viewing active sessions, detecting suspicious activity, and managing device access with privacy and security.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "device-session-management-ui",
  wordCount: 5700,
  readingTime: 34,
  lastUpdated: "2026-05-05",
  tags: ["lld", "sessions", "devices", "security", "ux", "auth"],
  relatedTopics: ["session-timeout-auto-logout", "login-session-management", "route-component-access-guard"],
};

export default function DeviceSessionManagementUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A user logs in from their iPhone at 9 AM, then opens the app on their Mac at 10 AM. Both devices maintain active sessions (tokens, persistent logins). Unbeknownst to the user, a hacker has compromised their password and is also logged in from an IP in Russia. The user has no visibility: are there other active sessions? Who else has access? If a breach is suspected, can they log out everywhere at once?</p>
        <p>Device and session management is critical for security and user peace of mind. A session is a persistent login token (JWT, session cookie) granted when a user logs in. A device is the physical computer/phone that holds a session. A user may have multiple sessions across multiple devices. Without a management UI, users are blind to account access. With it, users can respond to suspicious activity (logout all sessions, change password).</p>
        <p>The challenge has several dimensions. First, device identification: how does the backend know which session corresponds to iPhone vs Mac? User agents help (parsing "Mozilla/5.0 (iPhone OS 15...)" tells us iOS), but this is fallible. Better: combine user agent with device fingerprinting (screen size, timezone, browser language) for consistency. Still imperfect: iPhone and iPad have similar user agents. Second, displaying sessions: what information is relevant? Device name, browser, OS, location (inferred from IP), last activity time. Too much is overwhelming; too little is useless.</p>
        <p>Third, suspicious activity detection: how do we identify compromised accounts? A hacker might log in from an unexpected location (user in New York, attacker in Russia). A password breach might generate rapid logins from multiple countries. The UI must alert users while minimizing false positives (traveling user legitimately logging in from another country shouldn't trigger alarm).</p>
        <p>Fourth, security of the management UI itself: logout actions must be secure. If user clicks "logout on iPhone", the backend must verify the request is authentic (signed with current session token) before revoking the iPhone session. A CSRF attack could trick the user into logging out legitimate sessions.</p>
        <p>Fifth, privacy: showing exact IP addresses and locations violates privacy. Masking "192.168.1.1" but showing "New York, USA" gives sufficient context without exposing full IP.</p>
        <p><strong>Explicit assumptions:</strong> Unique session tokens are issued per login. Sessions have metadata (device, IP, user agent, timestamp). Device fingerprinting is available (no 100% reliable, but good enough). Backend maintains authoritative list of active sessions. Suspicious activity detection rules are configurable. Real-time updates available (WebSocket or polling). Logout operations are idempotent (logging out twice is safe).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Display All Active Sessions:</strong> Fetch and display all sessions for the current user. Include session ID, device name/type, OS, browser, approximate location, IP (masked), creation timestamp, and last activity timestamp. Group by recency (active now, today, this week, older).</li>
          <li><strong>Device Details and Identification:</strong> Clearly identify each device. Parse user agent to determine OS (iOS, Android, Windows, macOS) and browser (Chrome, Safari, Firefox, Edge). Show device name (user can customize, e.g., "My Work Laptop"). If device name is unset, show "Chrome on Windows" or "Safari on iPhone".</li>
          <li><strong>Selective Logout:</strong> Allow user to logout a specific device. Clicking "Logout" on a session revokes that session token. The device is immediately disconnected and must re-login. Show confirmation dialog before logout (prevent accidents).</li>
          <li><strong>Logout All Other Sessions:</strong> Single-click button to end all sessions except the current one. Useful when user suspects breach: logout everywhere except this device. Confirm before executing.</li>
          <li><strong>Current Session Indication:</strong> Clearly highlight the current session ("This device"). User cannot logout their own session (grayed out button, tooltip "You are using this session"). Prevents accidental self-logout.</li>
          <li><strong>Suspicious Activity Alerts:</strong> Detect and alert on unusual login patterns. Alerts include: new device login (user logged in from previously unseen device), unusual location (login from different country than usual), rapid logins (multiple logins from different locations within minutes). Alert via banner, email, or push notification.</li>
          <li><strong>Location Display:</strong> Show approximate location based on IP geolocation. Display city and country (sufficient context, preserves privacy). Do not show exact coordinates or full street address. Format: "New York, United States" or "London, United Kingdom".</li>
          <li><strong>Unrecognized Device Challenge:</strong> When a new device logs in, prompt user: "Unknown device logged in from New York. Is this you?" Allow user to verify (approve) or revoke immediately (prevent unauthorized access).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Privacy and Security:</strong> Do not expose full IP addresses (show masked: 192.168.x.x or omit entirely, show only location). Do not expose exact hardware identifiers or serial numbers. Transmit all session data over HTTPS. Logout actions require authentication (CSRF-safe: include user's current session token or CSRF token).</li>
          <li><strong>Real-Time Updates:</strong> Session list updates immediately after logout action. If user logs out device A from device B, device A should detect logout within 1-2 seconds and redirect to login. Use WebSocket for real-time sync or polling (every 30 seconds) for simplicity.</li>
          <li><strong>Performance:</strong> Load session list within 1 second, even with 50+ sessions. Cache session data client-side to avoid re-fetching on each visit (cache TTL: 30 seconds). Logout operations complete within 2 seconds (backend revocation + client update).</li>
          <li><strong>Scalability:</strong> Support users with hundreds of sessions (e.g., IoT devices, automated integrations). Use pagination or lazy-load if session list exceeds 100 items. Session data storage must scale to billions of sessions (archived sessions are purged after 90 days).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The session management system has three components: session tracking, suspicious activity detection, and user interface.</p>
        <p>Session tracking runs on the backend. When a user logs in, create a session record: store session token, user agent, IP address, timestamp, device fingerprint. Periodically update last_activity timestamp on each API call (or use lazy update: update only if last update was more than 5 minutes ago, to reduce database writes). On logout (user-initiated or token expiry), mark session as inactive or delete it. Retain inactive sessions for audit purposes (90 days), then delete.</p>
        <p>Suspicious activity detection runs server-side or client-side. Server-side is safer (attacker can't disable it). Rules include: (1) new device login (device fingerprint unseen before), (2) unusual location (IP country differs from user's typical countries), (3) rapid multi-location logins (user logged in from US at 10:00, then Russia at 10:02—physically impossible). On detection, either alert the user (send email, push notification) or require user confirmation (send challenge email: "Unusual login detected. Is this you? [Yes] [No]"). If user clicks "No", revoke that session immediately.</p>
        <p>The UI fetches the session list and displays it with privacy: show device name, OS, browser, location (city/country), last activity time. Highlight the current session. Show logout button per session (grayed out for current session). Show logout-all button. On logout, send POST /sessions/{"{id}"}/logout with CSRF token, backend revokes the session token, frontend removes the session from the list. For logout-all, send POST /sessions/logout-all-others, backend revokes all sessions except current, frontend refreshes the list.</p>
        <p>Real-time updates: if user logs out device A while viewing on device B, device B should see the change immediately (WebSocket notification) or detect it on next poll (30 seconds). Device A should detect its logout within 1-2 seconds (token no longer valid on next API call, redirect to login).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/auth-user-systems/device-session-management-ui.svg"
          alt="Device session management UI showing active sessions list, session data model, revocation mechanisms, and anomaly detection"
          caption="Device session management UI showing active sessions list, session data model, revocation mechanisms, and anomaly detection"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Data Model</h3>
        <p>A session record contains: session_id (unique token or UUID), user_id, user_agent (full string, e.g., "Mozilla/5.0 (iPhone OS 15_0)..."), ip_address, device_fingerprint (hash of screen size, timezone, language, etc.), device_name (custom name if user set it), created_at (timestamp), last_activity_at (updated on each API call), is_current (boolean indicating if this is the requesting session), location (city, country inferred from IP).</p>
        <p>Session tokens are short-lived (e.g., 1 hour) and refreshed via refresh tokens. The session record persists until logout or expiry (kept for 90 days then archived). On each API call, the backend updates last_activity_at (lazily: only update if more than 5 minutes have passed, to reduce database writes).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Device Identification and Fingerprinting</h3>
        <p>Identifying the same device across logins is important: user logs out on iPhone, then logs in on the same iPhone later—we want to recognize it's the same device. User agent parsing extracts OS and browser, but is fallible (iPhone and iPad have similar user agents). Device fingerprinting improves accuracy.</p>
        <p>A device fingerprint combines multiple signals: user agent, screen size, timezone, language, and optional hardware identifiers (device UUID on iOS/Android). Hash these together to create a fingerprint. Store the fingerprint with each session. On new login, compute the fingerprint and check if it matches any previous fingerprints for the user. If match, it's a known device; if no match, it's a new device (trigger suspicious activity alert).</p>
        <p>Fingerprinting is imperfect: users with identical devices (same iPhone model, same timezone, same language) may have colliding fingerprints. Mitigate by combining with IP address checks: same device usually logs in from similar locations. If fingerprint matches but IP is drastically different (user usually in New York, now in Russia), it's suspicious.</p>
        <p>Allow users to customize device names. After login on new device, prompt "Name this device?" User enters "My Work Laptop" or "iPhone". Store as device_name. On session list, show custom name if available, otherwise show parsed device type ("iPhone", "Chrome on Windows").</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">UI Layout and Presentation</h3>
        <p>Session list is organized by recency: "Active now" (last activity in last 5 minutes), "Today", "This week", "Older". Each session shows: device name, OS/browser (e.g., "Safari on iOS 15"), location ("New York, USA"), last activity time ("2 hours ago"), and logout button. Current session is highlighted differently (darker background or badge "This device") with logout button grayed out.</p>
        <p>For each session, show a card or row with icon (device type), device name, browser/OS, location, last activity, and logout button. On hover, show additional details (IP masked, session creation time). Include a "Logout all other sessions" button at the top for emergency scenarios.</p>
        <p>Empty state: if only current session, show "Only this device is logged in. Your account is secure." Encourage user to set strong password if concerned about unauthorized access.</p>
        <p>Show last activity time using relative format ("Active now", "2 hours ago", "3 days ago") for clarity. Stale sessions (no activity in 30 days) can be marked as inactive or removed from list (but retained in backend).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Suspicious Activity Detection and Alerts</h3>
        <p>The backend maintains a rule engine for suspicious activity. Rules include:</p>
        <p>1. New device detection: fingerprint unseen before, alert user with email. Optionally, require confirmation email: "Is this you?" (anti-account-takeover).</p>
        <p>2. Unusual location: IP country differs from user's typical countries. If user typically logs in from USA and Canada, a login from Russia is suspicious. Alert but allow (user might be traveling). If multiple countries in rapid succession (US at 10:00, Russia at 10:02), it's likely account compromise—consider auto-logout.</p>
        <p>3. Unusual time: login at 3 AM when user typically logs in at 9 AM. Less reliable than location, but useful signal.</p>
        <p>4. Rapid logins: 10 logins in 30 seconds from different devices. Likely automated attack. Auto-logout suspicious sessions and notify user.</p>
        <p>Rules are configurable per app. Conservative apps (banking) have stricter rules (new device = require confirmation). Permissive apps (social media) have looser rules (new location = just alert).</p>
        <p>On alert, user receives email with session details ("Unusual login from Chrome on Windows in Moscow at 3:45 UTC") and action buttons: "It's me" (approve) or "Revoke this session" (logout). If user doesn't respond within 24 hours, consider revoking the session automatically.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Logout Mechanism and Token Revocation</h3>
        <p>Logout revokes a session token immediately. The token is added to a blacklist (Redis, in-memory cache) and checked on next API call. Alternatively, use JWT with short expiry (1 hour) and rely on expiry rather than blacklist. Short-lived JWTs are simpler but require users to refresh more frequently.</p>
        <p>Logout-single: POST /sessions/{"{id}"}/logout with authentication (include current session token or CSRF token to prove the request is from user, not attacker). Backend verifies authentication, marks target session as revoked, responds with success. Client removes the session from the UI.</p>
        <p>Logout-all: POST /sessions/logout-all-except-current revokes all sessions except current. Backend marks all non-current sessions as revoked. Used in emergency: user suspects breach, wants to secure account, logs out everywhere except current device.</p>
        <p>On the targeted device (the one being logged out), the next API call includes the revoked token. Backend checks token validity, sees it's revoked, returns 401 Unauthorized. Client catches 401, clears local auth state, redirects to login. Logout propagates within seconds (next API call).</p>
        <p>Confirmation dialog: before logout, show "Are you sure you want to logout this device? You'll need to log back in." Prevents accidental logouts (user meant to logout device B but clicked device A).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-Time Updates and Synchronization</h3>
        <p>When user logs out device A while viewing session list on device B, device B should reflect the change immediately. Two approaches: WebSocket (real-time) or polling (eventual consistency).</p>
        <p>WebSocket: client subscribes to session changes. Backend broadcasts logout events to all connected sessions. Low latency (100-200ms), but requires persistent connection and server infrastructure (redis pub-sub).</p>
        <p>Polling: client fetches session list every 30 seconds. On logout, next poll shows updated list. Higher latency (up to 30 seconds), but simpler (no WebSocket, just GET endpoint). Hybrid: poll every 30 seconds, but also trigger manual refresh after logout action.</p>
        <p>For the device being logged out (device A), detection is automatic: next API call includes revoked token, returns 401, redirect to login. No polling needed on device A; it logs out immediately on first API request.</p>
        <p>Show toast notification on logout: "Device logged out" or "Device revoked by you". If logout triggered from another device, show: "Device revoked from another location".</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy and Security Considerations</h3>
        <p>Never display full IP addresses (192.168.1.100) to user; it's not actionable and violates privacy. Instead, show location inferred from IP: "New York, USA". If exact city is sensitive (small towns), show country only: "United States".</p>
        <p>Don't expose hardware identifiers (serial numbers, IMEI). Device name is user-friendly ("My iPhone") but not hardware details.</p>
        <p>All session management endpoints require authentication. User can only view/manage their own sessions. A CSRF token or nonce is required to prevent cross-site logout attacks (attacker tricks user into visiting attacker.com, which submits logout request). Include X-CSRF-Token header or use SameSite=Strict cookie policy to prevent CSRF.</p>
        <p>Log all logout actions in an audit trail: who (user), when (timestamp), which session (device name, location), and source (user-initiated vs auto-revoked vs challenge response). Audit trail is immutable and tamper-proof.</p>
        <p>Transmit session data over HTTPS only. Don't expose session IDs or tokens in URLs (only in headers or secure cookies). Use Secure cookie flag (only sent over HTTPS) and HttpOnly flag (inaccessible to JavaScript, preventing XSS theft).</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p><strong>Accuracy vs Privacy in Location Detection:</strong> Exact location (GPS, house-level precision) violates privacy. City/country is more private but less actionable (user might reasonably travel within country). Balance: show city/country to user, use exact IP internally for anomaly detection rules. This gives user useful context while protecting privacy.</p>
        <p><strong>Strict Suspicious Activity Rules vs User Friction:</strong> Strict rules (new device requires confirmation email, unusual location auto-logouts) prevent breaches but frustrate travelers and international teams. Permissive rules (only alert, don't auto-logout) reduce friction but miss some account takeovers. Better: configurable rules per app, with defaults matching risk tolerance (banking: strict, social media: permissive).</p>
        <p><strong>Device Fingerprinting Reliability:</strong> Fingerprinting (screen size, timezone, language) is imperfect but useful. Better: combine with persistent device ID (iOS/Android can expose device UUID). This is more reliable but less available on web. Hybrid: use fingerprint on web, device UUID on mobile.</p>
        <p><strong>Real-Time Updates Complexity:</strong> WebSocket provides real-time updates (logout reflects instantly on all devices) but requires persistent connections and server infrastructure. Polling is simpler but has latency (up to 30 seconds before device B sees device A logout). Most apps use polling with optional WebSocket for real-time (hybrid approach).</p>
        <p><strong>Session Storage and Cost:</strong> Storing session records for all logins in all users forever is expensive. Mitigate with session archival: keep active/recent sessions (30 days) in fast storage, archive older sessions to cold storage (audit-only). Purge after 1 year. This reduces cost while maintaining audit trail.</p>
        <p><strong>Device Name Confusion:</strong> Users might name devices non-descriptively ("Device", "iPhone"). Supplement with auto-generated names ("iPhone 12 from New York") for clarity. Show both auto-name and custom name if available.</p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Session List with Real-Time Sync via Polling</h3>
        <p>Fetch session list on page load. Poll every 30 seconds in background. On logout action, immediately remove the session from UI and trigger manual poll for freshness. This is simple and works well for most apps.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Suspicious Activity Detection with Email Confirmation</h3>
        <p>Detect new device or unusual location, send confirmation email: "Unusual login detected. Is this you?" [Approve] [Revoke]. If approve, whitelist device for future. If revoke, logout the session. If no response in 24 hours, auto-logout.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Device Fingerprinting with Persistent UUID</h3>
        <p>On first login, generate device fingerprint (screen size, timezone, language) and optional device UUID (from platform). Store fingerprint with session. On subsequent logins, compare fingerprints. If match, recognize device. If no match, it's new—trigger alert.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 4: Logout with Confirmation and Delayed Revocation</h3>
        <p>Show confirmation dialog: "Logout this device?" On confirm, send logout request. Backend marks session as revoked and broadcasts logout event. Client removes from list immediately (optimistic update). Device being logged out detects 401 on next API call and redirects to login.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Device and session management UIs provide users visibility and control over account security. Essential patterns include listing all active sessions with device identification (browser, OS, location), selective logout, highlighted current session (can't logout self), suspicious activity detection (new device, unusual location, rapid logins), alerts and confirmation (email, SMS, or in-app challenge), real-time updates (polling or WebSocket), and privacy-respecting information display (city/country instead of IP, no hardware serial numbers). Trade-offs include strict rules (security) vs user friction (false alarms), real-time WebSocket (complexity) vs polling (simplicity), and device fingerprinting accuracy vs privacy. Real-world systems (Google, Microsoft, Apple) implement aggressive suspicious activity detection with email confirmation, per-device naming, and one-click logout-all. For best results, use device fingerprinting + IP checks for new device detection, send email confirmation for suspicious logins (user approval is best UX), show city/country location (privacy-preserving), implement logout with user confirmation (prevent accidents), use polling with manual refresh for simplicity, log all logout actions for audit, and provide users with clear security recommendations. Session management is critical for account security and user peace of mind.</p>
      </section>
    </ArticleLayout>
  );
}
