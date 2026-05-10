"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-session-timeout-auto-logout",
  title: "Session Timeout and Auto-Logout System",
  description: "Implementing inactivity-based session expiry with user warnings, session extension, and graceful logout with draft preservation.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "session-timeout-auto-logout",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-05",
  tags: ["lld", "auth", "session", "timeout", "security", "inactivity"],
  relatedTopics: ["login-session-management", "token-refresh-system", "device-session-management-ui"],
};

export default function SessionTimeoutAutoLogoutArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A user logs into a banking app on a public computer, checks their balance, then leaves without logging out. An hour later, another person sits at the computer and can access the user's account (session is still active). This is a security risk. Sessions should expire after inactivity to protect accounts abandoned on shared devices.</p>
        <p>The challenge is balancing security and UX. Hard timeout (logout immediately after 15 minutes of inactivity) is secure but frustrating: user fills out a form for 20 minutes (without clicking), then submits and is logged out—work lost, frustrating. Soft timeout (warn user, ask to extend) is better: user sees "Your session expires in 1 minute" and clicks "Stay logged in", extending the session for another 15 minutes. Work is preserved.</p>
        <p>Additional challenges: detecting inactivity accurately (what counts as activity? page visibility hidden means user likely away, but don't count status bar hover), handling multiple browser tabs (should inactivity in tab A timeout tab B?), draft preservation (auto-save user's work before logout so they don't lose input), and returning to original URL after re-login ("I was editing /posts/123, log me back there after I re-login").</p>
        <p>The naive approach (hard timeout, no warning, no draft save) loses user work and creates support requests. Better approach: track activity, warn before logout, allow extension, save draft, and redirect to original URL after re-login. This preserves UX while maintaining security.</p>
        <p><strong>Explicit assumptions:</strong> Inactivity is defined as no user action for N minutes (clicks, keyboard, scroll). Page visibility API available (tab is hidden/shown). localStorage available for draft storage. Server also expires sessions (don't rely on client alone). User can be notified of imminent logout (modal warning). Work can be auto-saved before logout.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Inactivity-Based Timeout:</strong> Log out automatically after N minutes of user inactivity (default 15 minutes, configurable per app). Inactivity is defined as no user action: clicks, keyboard input, scrolling, or touch. Page visibility (tab minimized) counts as inactivity even if user is away.</li>
          <li><strong>Pre-Logout Warning:</strong> Before timeout, show warning modal (typically 1 minute before logout): "Your session will expire in X minutes due to inactivity. Would you like to stay logged in?" Display countdown timer showing remaining seconds. Block other interactions until user responds.</li>
          <li><strong>Activity Detection and Tracking:</strong> Listen for user actions: mousedown, keydown, touchstart, scroll, etc. Debounce to avoid excessive updates (multiple clicks in 50ms = one activity event). Use Page Visibility API to detect tab visibility (ignore activity when tab hidden—user is away). Reset inactivity timer on each activity.</li>
          <li><strong>Session Extension:</strong> On warning modal, provide "Stay Logged In" button. Clicking extends session (reset inactivity timer, dismiss modal). Call backend to extend session (refresh token, increment session TTL). Support multiple extensions, but hard limit (can't extend beyond max session duration, e.g., 8 hours).</li>
          <li><strong>Auto-Logout Execution:</strong> If user ignores warning (timer expires), logout: clear auth tokens, clear session cookies, optionally save draft of any unsaved work, redirect to login page with message "Your session expired due to inactivity. Please log in again."</li>
          <li><strong>Draft Preservation:</strong> Before logout, auto-save user's work (unsaved form inputs, drafted messages) to localStorage. On re-login, offer to restore: "You have a draft from your previous session. Restore?" If user accepts, populate form with saved data. Drafts expire after 7 days (clean up old drafts).</li>
          <li><strong>Return URL Handling:</strong> Before logout, store the current URL. After re-login, redirect user back to that URL (if safe). Example: user was editing /posts/123, gets logged out due to inactivity, logs back in, and is redirected to /posts/123 (not dashboard). Prevent redirect attacks: only redirect to app URLs, not external sites.</li>
          <li><strong>Multi-Tab Synchronization:</strong> If user logs out in one browser tab, logout all other tabs automatically. Use storage events (localStorage change triggers onStorage listener in other tabs) to broadcast logout. All tabs should detect logout and clear auth state.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Responsiveness:</strong> Activity tracking and timeout logic must not block UI. Use passive event listeners and debouncing to minimize impact. Timeout checks run on background timers, not on render path.</li>
          <li><strong>Battery Efficiency:</strong> On mobile, constant activity tracking can drain battery. Debounce aggressively (100-200ms), avoid high-frequency polling. Use Page Visibility API to pause activity tracking when tab hidden (save battery).</li>
          <li><strong>Privacy:</strong> Don't log sensitive activities. Activity tracking is local (browser-side), not sent to server. Don't expose activity details in logs (e.g., don't log which buttons were clicked if they're sensitive).</li>
          <li><strong>Graceful Degradation:</strong> If storage events fail (cross-origin tabs), fall back to individual tab logout (less seamless but still functional). If draft save fails, warn the user and continue logout anyway, prioritizing security over draft preservation.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The session timeout system has three phases: activity tracking, warning, and logout.</p>
        <p>Phase 1 (Tracking): On app load, initialize inactivity timer (e.g., 15 minutes). Register activity listeners (click, keydown, scroll). On any activity, reset timer. Use Page Visibility API: pause tracking when tab hidden (user away). Run timer on background, fire callback when timeout approaches (e.g., 1 minute remaining).</p>
        <p>Phase 2 (Warning): When timeout approaches, show modal: "Session expiring in 1 minute. Stay logged in?" Display countdown. Buttons: "Stay Logged In" (extend session), "Log Out Now" (logout early). On "Stay Logged In", call backend to extend session, reset timer, dismiss modal. On "Log Out Now", proceed to logout.</p>
        <p>Phase 3 (Logout): If warning timeout expires (user ignores), auto-save draft (store form state to localStorage), clear auth cookies/tokens, clear sensitive cached data, redirect to login with returnUrl param. On re-login, restore saved draft.</p>
        <p>Security enforcement: backend also expires sessions (don't rely on client-side timeout alone). On next API request after timeout, backend returns 401 Unauthorized.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/auth-user-systems/session-timeout-auto-logout.svg"
          alt="Session timeout system with activity detection, cross-tab sync, timeout state machine, and countdown warning dialog"
          caption="Session timeout system with activity detection, cross-tab sync, timeout state machine, and countdown warning dialog"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Activity Tracking and Detection</h3>
        <p>Activity tracking listens for user input events: mousedown, keydown, touchstart, scroll, wheel. Register passive listeners for scroll/wheel (enable scroll optimization). Debounce events to 50-100ms (multiple events in 50ms = single activity). On activity, reset inactivity counter to full duration (15 minutes). Use Page Visibility API: when document.hidden becomes true (tab minimized), pause tracking and timer (user away from app). When tab becomes visible again, resume. Don't count logout actions as activity (user is intentionally exiting).</p>
        <p><strong>Debouncing and Event Filtering:</strong> Without debouncing, rapid typing fires keydown 10+ times/second, creating excessive activity updates and network calls (if server-side tracking). Solution: debounce to 50-100ms. Keep a flag `hasRecentActivity = true`. On activity, set it true. After 100ms without new activity, consider it a debounce cycle complete, then update timer. Also filter noise: don't count modifiers (Shift, Ctrl) alone as activity. Don't count arrow keys if no text input active (scrolling a read-only page might not be "activity"). Customize filters per app. For high-security apps (banking), be strict: only keyboard+mouse count. For general apps, be lenient: scroll alone counts (user is engaged).</p>
        <p><strong>Page Visibility API and Tab Hiding:</strong> When a user minimizes the app tab (switches to another tab), document.hidden becomes true. This is a strong signal the user is away. Pause the inactivity timer: don't count time while tab is hidden. When tab comes back into view (document.hidden = false), resume timer from where it left off. This prevents logout while user is genuinely away but the app is still technically running in the background. Listen for visibility change: `document.addEventListener('visibilitychange', handleVisibilityChange)`. On hidden: save inactivity_start time. On visible: calculate actual elapsed time (only count time while visible), adjust timer.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Timeout Configuration and Timers</h3>
        <p>Inactivity timeout is configurable per app (banking: 5 minutes strict, social media: 30 minutes relaxed). Default 15 minutes. Warning fires 1 minute before timeout. Hard max session duration (e.g., 8 hours) prevents infinite extensions. Implement two timers: inactivity timer (reset on activity) and absolute session timer (fixed duration, not reset by activity). Session extension increments inactivity timer back to full duration but respects hard max.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Warning Modal with Countdown</h3>
        <p>When inactivity timeout approaches, show modal: "Your session will expire in 1 minute due to inactivity. Do you want to stay logged in?" Display live countdown (visual timer ticking down). Modal is non-dismissible (can't click outside to close). Provide two buttons: "Stay Logged In" (clear modal, extend session, reset timer), "Log Out Now" (proceed to logout). Modal should not steal focus from important actions (but if possible, focus it to prevent accidental clicks elsewhere).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Extension and API Integration</h3>
        <p>On "Stay Logged In", call backend: POST /session/extend or equivalent (refresh token endpoint). Backend verifies session is still valid, issues new tokens with extended TTL. Client receives new token, updates stored token, resets inactivity timer. Optional: limit extensions per day (max 5 extensions in 24h) to prevent abuse. Enforce hard maximum: even if user extends many times, can't stay logged in beyond max duration (8 hours).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Auto-Logout and Cleanup Process</h3>
        <p>On logout (auto or manual), execute cleanup: (1) Auto-save draft (serialize form state, store to localStorage with timestamp and expiry). (2) Clear auth tokens (delete HttpOnly cookies via backend set-cookie response, clear memory tokens). (3) Clear sensitive data (cached user profile, preferences, any PII). (4) Redirect to login page with returnUrl and message. Include message: "Your session expired. Please log in to continue." Store returnUrl in sessionStorage (not localStorage, for security) so it's cleared on browser close.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Draft Preservation and Recovery</h3>
        <p>Auto-save form state periodically (every 30 seconds) while user is editing, or on blur event (user leaves input field). Store in localStorage with key like "draft_post_123" (app-specific). Include metadata: timestamp, url, data. On re-login, check localStorage for drafts. If found, offer recovery: "You have a draft from [time]. Restore?" If user accepts, populate form with saved data, enable save. Drafts auto-expire: on app load, remove any drafts older than 7 days. Warn user that draft is stale if older than 24 hours.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Return URL and Post-Login Redirect</h3>
        <p>Before logout, store current URL: sessionStorage.setItem("returnUrl", window.location.href). On login page, get returnUrl from sessionStorage. After successful login, redirect to returnUrl (if it's a valid app URL). Prevent redirect attacks: whitelist safe URLs (origin must match app domain, path must not be /logout or /admin). If returnUrl is unsafe, redirect to dashboard. Use sessionStorage (not localStorage) for returnUrl to limit lifetime (cleared on browser close).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multi-Tab Synchronization</h3>
        <p>When user logs out in tab A, tab B should logout automatically. Use storage event listener: listen for changes to localStorage. When tab A calls logout, it sets a localStorage key like "sessionExpired" with timestamp. Other tabs detect this event and logout. Alternatively, use shared worker (web worker shared across tabs) to broadcast logout event. Complex but robust. Simpler approach: don't sync timers (each tab has independent inactivity timer), just sync logout event (when one tab logs out, broadcast to others).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Security and Server-Side Enforcement</h3>
        <p>Client-side timeout is purely UX. Backend must also enforce expiry: on each API request, verify session token is still valid (not expired, not revoked). If expired, return 401 Unauthorized. Client detects 401 (token invalid), clears auth state, redirects to login. Don't trust client's logout (user could disable JavaScript and stay logged in). Always verify server-side. For sensitive operations (password change, delete account), require re-authentication even within valid session (ask user to type password again). Log all logout events: user-initiated, timeout-based, error-based.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p><strong>Security vs User Friction:</strong> Strict timeout (5 minutes) is secure but forces frequent re-logins (annoying for legitimate users). Relaxed timeout (30 minutes) reduces friction but increases exposure. Compromise: configurable per app, with warning + extension (user controls decision). For banking: short timeout (5-10min). For social media: longer timeout (30min+).</p>
        <p><strong>Client vs Server Enforcement:</strong> Client-side timeout is bypassable (disable JavaScript, keep token). Server-side enforcement is secure but requires every request to be validated (latency). Use both: client timeout for UX, server validation for security. Trust server as source of truth.</p>
        <p><strong>Draft Auto-Save Overhead:</strong> Auto-saving every 30 seconds adds latency and server load. Alternative: manual "Save Draft" button (less UX-friendly). Compromise: auto-save periodically and on form blur (reduce frequency).</p>
        <p><strong>Multi-Tab Complexity:</strong> Syncing inactivity timer across tabs is complex. Alternative: independent timers per tab (simpler, but user might extend tab A and ignore warning in tab B). Practical: sync logout event only, keep timers independent.</p>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Simple Inactivity Timeout with Warning</h3>
        <p>Register activity listeners. Initialize timer on app load. On inactivity, show warning modal (countdown). On "Stay Logged In", extend session. On timer expiry, logout.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Auto-Save and Draft Recovery</h3>
        <p>Auto-save form state to localStorage every 30 seconds. On logout, don't clear drafts. On re-login, check localStorage for drafts, offer recovery. User can restore or discard.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Configurable Timeouts Per App</h3>
        <p>Store timeout config server-side (user.sessionTimeoutMinutes = 15). On login, send to client. Client initializes timer based on config. Allow user to customize in settings (if app supports).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 4: Cross-Tab Logout Broadcast</h3>
        <p>On logout in any tab, write a “logout event” marker to shared browser storage. Other tabs subscribe to the browser storage-change notification and, when they see that marker update, they clear local auth state and redirect to login. This provides near-instant cross-tab consistency without polling.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Session timeout and auto-logout systems protect accounts by automatically logging out inactive users while preserving UX and user work. Essential components include activity tracking (mousedown, keydown, scroll, page visibility), configurable inactivity duration (default 15 minutes), pre-logout warnings with countdown and extension option, auto-save and draft recovery (localStorage), return URL handling (resume after re-login), and multi-tab synchronization (logout broadcasts across tabs). Trade-offs include security vs friction (stricter timeout is more secure but more annoying), client vs server enforcement (client for UX, server for security), and complexity vs functionality (simple timers vs synced timers across tabs). Real-world systems (Google, Microsoft, banking apps) implement all three phases: activity tracking → warning → logout. For best results, make timeouts configurable per app (banking: strict, social: relaxed), provide pre-logout warning with visual countdown, allow session extension, auto-save user work before logout, preserve return URL for seamless re-entry, implement server-side verification (don't trust client), log all logout events for audit, and handle edge cases (multi-tab, offline, network errors). Session timeouts significantly improve security without requiring constant re-login if implemented with user-friendly warnings and extension mechanisms.</p>
      </section>
    </ArticleLayout>
  );
}
