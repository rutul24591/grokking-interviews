"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-password-reset-system",
  title: "Password Reset / Recovery Flow System",
  description:
    "Production-grade password reset with secure token handling, replay attack prevention, rate limiting, verified identity confirmation, and account takeover detection.",
  category: "low-level-design",
  subcategory: "auth-user-systems",
  slug: "password-reset-system",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: [
    "lld",
    "authentication",
    "password-reset",
    "security",
    "recovery",
    "token-management",
    "email-verification",
  ],
  relatedTopics: [
    "login-session-management",
    "session-timeout-auto-logout",
    "secure-token-storage-ux",
    "device-session-management-ui",
  ],
};

export default function PasswordResetArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Users inevitably forget passwords. The system must securely enable password recovery without compromising account security or exposing identity verification to attackers. Consider a real scenario: a user forgets their password and requests a reset. They receive an email with a link. If anyone with that link can change the password (attacker intercepts email, or user forwards email unsecurely), any account is compromised. If the reset link never expires, an attacker can use it weeks later. If the token is predictable (sequential numbers), attackers brute-force reset links for other users. If the same reset link works multiple times, an attacker keeps resetting passwords.
        </p>
        <p>
          The challenge is balancing security (protect accounts from attackers) with usability (users can recover forgotten passwords quickly). The naive approach—send reset link in plaintext email, make it valid forever, require no confirmation—loses accounts to attackers. Better approach: cryptographically random token (unpredictable), short expiration (15 minutes), single-use (token invalidated after reset), rate limiting (prevent mass password resets), and immutable audit logging (track all resets for forensics).
        </p>
        <p>
          Key challenges: (1) token secrecy (token in email is visible to email providers, forward buttons expose it), (2) token expiration (too short frustrates users, too long increases attack surface), (3) token reuse prevention (same token can't reset twice), (4) multiple simultaneous requests (which reset link is valid?), (5) rate limiting without blocking legitimate users (someone accidentally requests 5 resets), (6) session termination (existing sessions may be from attacker), and (7) account takeover detection (if user receives many unexpected reset emails, account may be targeted).
        </p>
        <p>
          <strong>Explicit assumptions:</strong> User requests reset via email (email as identity proof). System can send emails reliably. Tokens are generated cryptographically. Database supports transactions (atomic password + token updates). Redis/cache available for rate limiting. Email addresses are user identifiers (unique). Only latest reset token valid per user.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Reset Request Initiation:</strong> User provides email, system verifies it exists (silently if not found), generates reset token, sends link via email. Support bulk requests without revealing which emails exist (privacy by default).</li>
          <li><strong>Token Generation and Security:</strong> Generate cryptographically random 32-byte token using crypto.randomBytes() or equivalent. Hash token before storage (irreversible). Prevent token guessing through entropy and hash algorithms.</li>
          <li><strong>Token Validation on Reset:</strong> Verify token format, hash, expiration time (must be &lt; 15 min old), and not already used (single-use only). Return generic error ("Invalid or expired token") without details to prevent enumeration.</li>
          <li><strong>Password Update Atomicity:</strong> Update password hash and mark token used in single database transaction. Prevent partial updates where password changes but token isn't marked used (or vice versa).</li>
          <li><strong>Session Termination on Reset:</strong> Logout all active sessions for user immediately after password change. Send logout signal to all user's devices via push notification or broadcast. Invalidate refresh tokens.</li>
          <li><strong>Confirmation Email and Alerts:</strong> Send confirmation email with IP, location, timestamp. Include link to "If you didn't request this, secure your account." Detect and alert on suspicious patterns (multiple resets in one day).</li>
          <li><strong>Rate Limiting:</strong> Enforce per-email (max 5 resets/hour), per-IP (max 10 resets/hour), and global (max 1000/second) rate limits. After limit exceeded, require CAPTCHA or cooldown period.</li>
          <li><strong>Backwards Invalidation:</strong> When user requests new reset, invalidate all previous reset tokens for that user. Only latest link is valid to prevent token reuse.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Security:</strong> Token cryptographically random (no patterns), stored as hashes (irreversible), single-use, time-limited (15 min). No token leakage in logs, URLs, or error messages.</li>
          <li><strong>Privacy and User Enumeration:</strong> Don't reveal if email exists in system. Return identical success response regardless of whether email found. Timing must be consistent (add random delay if needed) to prevent timing attacks.</li>
          <li><strong>Latency:</strong> Reset request should respond within 2 seconds. Email queuing is asynchronous (don't wait for email delivery). Token validation &lt; 100ms.</li>
          <li><strong>Reliability:</strong> Email delivery must be reliable (retries, fallback providers). If email fails, queue for retry. Alert if reset email delivery rate drops below 99%.</li>
          <li><strong>Compliance:</strong> Audit logs for all password resets (immutable). SOC 2, GDPR-compliant handling of personal data (IP, location). Ability to export audit trail for investigations.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Email not in system → return same success response as if email found (prevent user enumeration attack).</li>
          <li>Reset token expired (user waits &gt; 15 min) → display "Token expired, request new reset".</li>
          <li>Token already used (user clicks link twice) → reject, display "This link has been used already".</li>
          <li>Multiple reset requests from same user → only latest token is valid, previous tokens are invalidated.</li>
          <li>Password reset while user is logged in → reset succeeds, user is logged out, must re-login with new password.</li>
          <li>Concurrent reset + login attempt → race condition: password change must be atomic, session termination must happen before login with old password completes.</li>
          <li>User's account is locked/suspended → don't allow reset, instead display account status message.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The password reset flow has three phases: request, email delivery, and confirmation.
        </p>
        <p>
          Phase 1 (Request): User enters email in forgot-password form. System applies rate limiting checks (per-email, per-IP). If user found in database, generates a 32-byte cryptographically random token and hashes it with bcrypt. Stores mapping: (token_hash, user_id, expires_at equals now plus 15 minutes, used_at equals NULL). Queues email job with a reset link that includes the token and email as query parameters (for example token equals RAW_TOKEN and email equals ENCODED_EMAIL). Returns success to user immediately (regardless of whether email found—privacy protection). Never reveals which emails exist.
        </p>
        <p>
          Phase 2 (Email Delivery): Email service sends reset link to user. If delivery fails, retries up to 3 times over 30 minutes. If all retries fail, alerts ops team. User receives email with reset link + expiration warning ("link valid for 15 minutes") + security notice ("if you didn't request this, ignore").
        </p>
        <p>
          Phase 3 (Confirmation): User clicks reset link, lands on reset form. Provides new password. System: (1) hashes provided token, queries database for matching record; (2) verifies token not expired (expires_at &gt; now) and not used (used_at is NULL); (3) validates new password strength; (4) updates user.password_hash with bcrypt-hashed new password AND marks token.used_at=now in single database transaction (atomicity critical); (5) queries all active sessions for user_id and invalidates them (delete from Redis, mark as revoked); (6) sends confirmation email with timestamp, IP, location; (7) returns success with login redirect. User must re-login with new password.
        </p>
        <p>
          Server-side enforcement: Backend always validates token on every request. Client-side checks (token format validation) provide UX feedback but don't replace server validation.
        </p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/auth-user-systems/password-reset-system.svg"
          alt="Password reset flow with token security, UI states, password strength meter requirements, and post-reset session invalidation"
          caption="Password reset flow with token security, UI states, password strength meter requirements, and post-reset session invalidation"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Reset Request Handling and Rate Limiting</h3>
        <p>
          When user submits forgot-password form with email, the system must accept legitimate requests while blocking attackers. The key challenge is rate limiting without revealing whether an email is registered (email enumeration attack).
        </p>
        <p>
          Implementation: enforce rate limits at multiple layers. First, apply a per-email limiter using a Redis key that incorporates a hashed or normalized email identifier. If more than five requests occur in the last hour, reject with a generic message. Second, apply a per-IP limiter with a separate Redis key; if more than ten requests occur in the last hour, reject. Third, enforce a global limiter using a Redis counter; if the system exceeds a threshold such as one thousand requests per second, return a 429 response. To reduce email enumeration risk, keep response timing consistent and add a small randomized delay for rate-limited requests. Then query the database for the user by email and, if found, proceed to token generation. Regardless of whether the user exists, return a success-style response to the client. Finally, log the request with timestamp and hashed identifiers for audit and forensics.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Generation, Hashing, and Storage</h3>
        <p>
          Token generation must produce values that are cryptographically random (not guessable) and sufficiently long to prevent brute-force attacks. A 32-byte token has 2^256 entropy—astronomical. Generated via crypto.randomBytes(32) (Node.js) or equivalent. Encoded as base64url for transmission in URL: "XmK_vN9pQ2r7LzA1B8cD_e4FgHjK5lM9Np". Token is sent to user in email and returned when user clicks reset link.
        </p>
        <p>
          Never store token in plaintext in database. If database breached, attacker can reset any password. Instead: hash token before storage. Use bcrypt with 10+ rounds (same as password hashing). Store (token_hash, user_id, expires_at=now+900s, used_at=NULL, created_at, updated_at). When user submits token, hash provided token and query database for matching hash. This way, database leak doesn't expose tokens.
        </p>
        <p>
          Schema: password_reset_tokens table with columns: id (primary key), user_id (foreign key), token_hash (indexed, unique-per-user), expires_at (indexed for cleanup), used_at (NULL until used), created_at (for audit). Create unique index on (user_id, expires_at &gt; now) to enforce "only one active token per user". If user requests new reset, insert new row; old row remains but is expired and never matched.
        </p>
        <p>
          TTL: 15 minutes is balanced. Too short (5 min) frustrates users on slow email clients. Too long (1 hour) increases attack window. 15 minutes: user checks email, clicks link, enters password within reasonable time. After 15 minutes, link returns "Token expired, request new reset" forcing new email flow. Background job: hourly cleanup deletes rows where expires_at &lt; now-1day (keep old tokens for audit trail, but eventually clean up).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Email Delivery and Content</h3>
        <p>
          Email delivery carries the reset token to the user. The link must be secure (HTTPS only) and include the token as a query parameter, or the token can be delivered via another out-of-band channel such as SMS or an authenticator app. A typical URL includes a token value and optionally an email identifier for UX prefill, but the server must verify that the token maps to the correct account during submission to prevent token confusion.
        </p>
        <p>
          Email content should be clear and helpful: "Reset your password" (subject). Body includes: (1) "You requested to reset your password. Click the link below to set a new password." (2) Reset link (visually prominent, clickable) (3) "This link expires in 15 minutes." (4) "If you didn't request this, you can safely ignore this email. Your password will not change." (5) Optional: device info "Reset requested from Chrome on Windows 10 at 3:45 PM" helps user detect unauthorized requests. Footer: "If you have trouble, contact support."
        </p>
        <p>
          Delivery: Queue email job asynchronously (don't wait for email service response). Use reliable email provider (SendGrid, AWS SES, Mailgun) with high deliverability. Implement exponential backoff retry: first attempt immediately, then retry at 1min, 5min, 10min if failures. If all retries exhaust, alert ops (email delivery is critical). Track delivery metrics: % of emails delivered, bounced, complained. If delivery rate drops below 99%, page on-call.
        </p>
        <p>
          Edge case: user requests reset 5 times in 10 minutes (fat-fingers the button). User receives 5 emails. Only latest token is valid; previous tokens are expired or invalidated. This is acceptable—user won't be confused, they'll use the latest link. Alternatively, invalidate all older tokens immediately when new reset is requested.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Validation and Single-Use Enforcement</h3>
        <p>
          When user submits reset form with new password and reset token, validation must be strict. Steps: (1) Hash provided token using same bcrypt configuration as storage. (2) Query password_reset_tokens by token_hash. If no match, return "Invalid or expired token" (generic—don't say "invalid hash" or "no record found"). (3) Check expires_at &gt; now (not expired). If expires_at &lt;= now, return "Token expired. Request a new password reset." (4) Check used_at IS NULL (not already used). If used_at is not NULL, return "This link has already been used. For security, request a new password reset." (5) Verify email parameter from URL matches user_id.email (prevent token confusion attacks). (6) Verify user is not locked/suspended. If all checks pass, proceed to password update.
        </p>
        <p>
          Single-use enforcement is critical. If same token resets password twice, the second reset wins (latest password). Attacker with old reset link can keep resetting user's password indefinitely. Prevention: mark token as used (used_at=now) immediately when consumed. Even if database write fails, return error and don't proceed. This is a critical operation—prioritize correctness over speed.
        </p>
        <p>
          Error messages must be generic to prevent enumeration: "Invalid or expired token" covers: (a) token_hash doesn't match, (b) token expired, (c) token already used, (d) email mismatch, (e) user not found. User can't tell which failure occurred. This prevents attackers from probing reset tokens.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Password Update and Transaction Atomicity</h3>
        <p>
          After token validation passes, update the password in the database. The update operation must be atomic: either both password and token status update succeed, or both rollback. If password updates but token isn't marked used, attacker can reuse the same token. If token is marked used but password update fails, user's password doesn't actually change, causing confusion.
        </p>
        <p>
          Implementation: Validate new password strength (minimum 12 characters, mix of upper/lower/digit/special character—adjust based on org security policy). Prevent reusing previous passwords (store last 5 password hashes, check new password doesn't match). Hash new password with bcrypt (12+ rounds)—same as during registration. Begin database transaction: UPDATE users SET password_hash = ?, password_changed_at = now() WHERE user_id = ?. UPDATE password_reset_tokens SET used_at = now() WHERE token_hash = ?. Commit transaction. If any update fails, rollback both. If commit succeeds, user's password is now reset.
        </p>
        <p>
          Never update password without marking token used. Don't allow retries/idempotency that could accidentally reset password twice. This is a write-once operation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Termination and Account Takeover Prevention</h3>
        <p>
          After password successfully resets, all existing sessions for the user must be invalidated immediately. The rationale: if user's password was compromised (due to breach or weak password), existing sessions are likely controlled by the attacker. By terminating all sessions, the attacker is forced to log in again with the new password (which they don't know). This is a critical security boundary.
        </p>
        <p>
          Implementation: Query sessions table for all active sessions where user_id = ? and is_active = true. For each session: (1) Delete from Redis cache (fast-path lookup). (2) Add to revocation blacklist (short TTL, 1 hour) to reject in-flight requests. (3) Mark in database as revoked (revoked_at=now). (4) Send push notification to user's devices: "Your password was changed. You've been logged out of all other devices. If this wasn't you, secure your account immediately." Use Firebase Cloud Messaging or similar for real-time notification.
        </p>
        <p>
          Distributed systems consideration: In multi-region setup, session revocation must be fast and consistent. Use Redis with multi-region replication to propagate logout across regions (&lt;100ms). Don't rely on database-only approach (eventual consistency is too slow; attacker can replay old session token for ~1 second before database catches up).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Confirmation Email and Account Security</h3>
        <p>
          Send confirmation email after password reset completes successfully. Content: "Your password was changed at [timestamp] from [IP address] in [city, country]." Include: (1) Timestamp and location to help user spot unauthorized resets. (2) "Confirm this was you. If not, contact support immediately." with link to account security page. (3) Summary of what just happened: "All your other sessions have been logged out for security."
        </p>
        <p>
          Send immediately after password reset (queue job like reset request email). This email serves multiple purposes: (a) confirms to user that reset succeeded, (b) alerts user to suspicious resets (same account reset 3 times in 1 hour), (c) provides recovery path if account was compromised.
        </p>
        <p>
          Bonus: Log confirmation email delivery. If user reports they didn't receive confirmation (but reset was successful), check logs. This indicates email delivery issue or account compromise where attacker intercepted both reset and confirmation emails.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Abuse Prevention and Account Takeover Detection</h3>
        <p>
          Rate limiting prevents brute-force attacks. Per-email limit (5 resets/hour) catches bulk reset spam. Per-IP limit (10 resets/hour) catches botnets resetting random users. Global limit (1000/second) catches DDoS. After hitting per-email limit, user must wait 1 hour before requesting again. After hitting per-IP limit, that IP is blocked for 1 hour (incentivizes attackers to spread across IPs, costing them resources).
        </p>
        <p>
          CAPTCHA escalation: After 3 failed reset attempts (invalid email, expired token, already-used token), require CAPTCHA on next attempt. This prevents attackers from automatically fuzzing reset tokens. Most humans only fail once (wrong password entry). Three failures is suspicious. Reset CAPTCHA counter after 1 hour of inactivity or on successful reset.
        </p>
        <p>
          Account takeover detection: Monitor for patterns indicating account compromise. (1) User receives 5+ reset emails in 1 day—attacker trying to access account. Alert user: "Unusual account activity detected. Your password was reset multiple times. If this wasn't you, secure your account." (2) Reset followed immediately by email/phone change—attacker locking victim out. (3) Reset from multiple countries in same day—impossible travel. Trigger MFA verification on next login. (4) Reset + failed login attempts (attacker guessing new password)—lock account, require support intervention.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring, Alerting, and Debugging</h3>
        <p>
          Monitor reset request volume and success rate. Metrics: (1) reset_requests/minute (total), (2) successful_resets/minute (tokens used), (3) reset_token_expiration_rate (% of tokens that expire unused), (4) reset_email_delivery_rate (% of emails delivered without bounce), (5) reset_request_latency (p50, p95, p99 milliseconds), (6) rate_limit_blocks/hour (abuse attempts).
        </p>
        <p>
          Alert on anomalies: (1) success rate drops below 70% (indicates email delivery issue or UX problem with reset form). (2) Email delivery rate drops below 99% (email provider issue). (3) Reset request rate suddenly spikes to 10x baseline (possible attack or viral misconfiguration). (4) Average time from reset request to token usage &gt; 15 minutes (users can't find their email or reset link is broken).
        </p>
        <p>
          Debugging: If user reports reset doesn't work, check: (1) rate limiting (user hitting per-email limit). (2) Email delivery logs (email queued, bounced, or flagged as spam). (3) IP geolocation mismatch (email provider rejecting IP as spam). (4) Password strength validation rejecting new password silently. (5) Session invalidation failing (user still logged in with old password). Implement detailed logging at each step: reset request accepted, email queued, email delivered, token validation passed/failed, password updated, sessions terminated.
        </p>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token in URL vs In-App</h3>
        <p>
          Tokens in URL visible in browser history/logs. Alternative: generate short-lived
          code (6 digits) sent via SMS, verified in app. More secure but requires SMS
          provider.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">HTTPS Only</h3>
        <p>
          Reset links must be HTTPS only. If app served over HTTP, token vulnerable to
          MITM.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Expiration Time</h3>
        <p>
          15 minutes is balanced. Too short (5 min) frustrates users. Too long (1 hour)
          increases attack surface.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Password Reset</h3>
        <p>
          Test: valid reset, expired token, token reuse, invalid email, rate limiting,
          session termination, race conditions (reset + login simultaneously).
        </p>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Account Takeover Detection</h3>
        <p>
          Monitor for suspicious reset patterns: 10 reset requests for user in one day,
          reset from new IP different country, reset followed by password change then
          email change. Score anomalies. If suspicious, require MFA to complete reset or
          contact support.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Reset Token Expiration & Cleanup</h3>
        <p>
          Expired tokens accumulate in DB. Implement background job: hourly cleanup of
          tokens older than 15 min. Also cleanup after password change: mark token as
          used (expires_at still future, but used_at set) to reuse for audit trail.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Distributed Reset Token Service</h3>
        <p>
          At scale, reset token storage bottleneck. Use distributed cache (Redis Cluster)
          instead of database. Token validity checked in cache with instant expiration.
          Trade: memory vs latency.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">SMS-Based Reset Alternative</h3>
        <p>
          For high-security apps, skip email reset (emails forwarded, compromised).
          Instead: reset request prompts user to verify via SMS code. SMS delivery more
          reliable, code shorter-lived (5 min). Trade: SMS cost, SMS delivery failures.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Password Reset History & Audit</h3>
        <p>
          Log all password resets: timestamp, user_id, IP, success/failure, reset_token_id.
          Immutable audit log for compliance. Query: "show user all password changes for
          last year". Suspicious reset patterns visible in audit.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Reset at Scale</h3>
        <p>
          Load test: 1000 reset requests/sec. Verify token generation doesn't collide,
          email queue doesn't overflow, database handles load. Chaos test: email service
          down, database slow, Redis down. Verify graceful handling.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <p>
          Common: password reset token never invalidated. Attacker reuses link, keeps
          changing password. Solution: mark token used immediately, single-use only.
          Another: reset request doesn't invalidate old sessions, attacker keeps old
          session active. Solution: terminate ALL sessions on reset. Another: email with
          reset link forwarded to attacker, attacker resets victim's password. Solution:
          require MFA on sensitive accounts for reset.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response & Debugging</h3>
        <p>
          If users report unauthorized password resets, check: reset email logs (who sent
          reset emails?), IP geolocation (resets from suspicious countries?), audit trail
          (when was password changed?). Investigate whether account compromised or reset
          abused. Contact user, reset password again, require MFA re-setup.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Email vs SMS vs MFA-Based Reset</h3>
        <p>
          Email-based reset (current approach) is convenient and widely adopted. Users check email frequently. But email is vulnerable: forwarded unsecurely, intercepted if email account compromised. SMS-based reset (OTP via text message) is more secure: SMS not forwarded, harder to intercept. Trade: SMS requires SMS provider (cost, reliability), users may not have SMS configured. MFA-based reset (authenticator app, security key) is most secure: user proves identity with MFA device. Trade: friction (users without MFA can't reset), higher support burden. Hybrid approach: offer multiple reset methods—email (default), SMS (if configured), MFA (if configured). User chooses. Banks often require MFA for reset of high-value accounts.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Expiration Window</h3>
        <p>
          Shorter expiration (5 minutes) limits attack window: token useful for only 5 minutes, reduces replay risk. But users miss the window (slow email, distracted). They must request new reset (annoying). Longer expiration (1 hour) more forgiving: user has plenty of time. But bigger attack window: token vulnerable for longer. 15 minutes is the practical sweet spot for most apps. Adjust based on user base: mobile-heavy app (users might not check email for hours) could use 30-60 min. High-security apps (banking, enterprise) use 5-15 min.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Session Termination Impact</h3>
        <p>
          Terminating all sessions on password reset is secure (evicts attacker from existing sessions) but surprises users: they're suddenly logged out on their phone while using the web app. Alternative: only terminate suspicious sessions (sessions from unusual IPs, new devices). This preserves UX—trusted devices stay logged in. But gives attacker window if they compromised password from trusted IP. Conservative approach (terminate all) prioritizes security. Progressive approach (terminate suspicious) prioritizes UX. Choose based on security posture: consumer apps often use progressive. Banks always terminate all.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Email Privacy vs User Enumeration</h3>
        <p>
          Silently returning success for non-existent emails (good for security) breaks UX: user submits reset request, doesn't receive email, assumes email is wrong, requests again. Bad experience. Alternative: always send email (even for non-existent addresses, send "this email not registered"). UX benefit: user gets feedback. Security downside: attackers can enumerate which emails exist (reset endpoint reveals user base). Most apps go silent (don't confirm whether email exists) for security. Tradeoff: improve UX with explanatory message "If this email is registered, you'll receive a reset link shortly" (neutral, doesn't reveal).
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Password reset is a critical security feature that balances account protection with user recovery needs. For staff/principal engineers implementing this at scale, key architectural aspects include: (1) Cryptographically random, single-use tokens with short TTL (15 minutes) to prevent replay attacks. (2) Token hashing before storage (prevent database breach from exposing reset tokens). (3) Atomic transaction combining password update and token invalidation—never allow partial updates. (4) Comprehensive session termination across all devices to evict attackers from existing sessions. (5) Rate limiting (per-email, per-IP, global) and CAPTCHA escalation to prevent mass account takeover attacks. (6) Account takeover detection via anomaly scoring (multiple resets, unusual IPs/locations, rapid email changes). (7) Immutable audit logging for compliance and forensics. (8) High-reliability email delivery with retries and alerting.
        </p>
        <p>
          At 1 million users, reset email volume is substantial (peak rates can exceed 1000 requests/second during outages). Implement asynchronous email queueing with backoff retry to avoid overloading email service. Monitor key metrics: reset success rate, email delivery rate, token usage rate (% of tokens used vs expired). Alert on anomalies (success rate &lt; 70%, delivery rate &lt; 99%, spike in reset requests).
        </p>
        <p>
          Real-world implementation patterns: (1) Email-based reset for consumer apps (simple, common). (2) SMS-based reset for high-security apps (more secure, requires SMS provider). (3) MFA-based reset for enterprise (strongest security, highest friction). (4) Hybrid approach: support multiple methods. Testing must cover security edge cases: token reuse (second use fails), expiration boundaries (token valid at T+14:59, invalid at T+15:01), concurrent reset + login race conditions, account lockout during resets, email failures. Integration with related systems critical: session management (terminating all sessions), MFA (using MFA to verify identity for reset), account lockout (after 5 failed resets, lock account), and device fingerprinting (detect stolen tokens used from different device). Balance security (strict controls, short expiration, session termination) vs UX (reliable email, reasonable expiration, minimal friction).
        </p>
      </section>
    </ArticleLayout>
  );
}
