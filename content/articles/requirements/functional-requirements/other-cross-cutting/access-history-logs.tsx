"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-functional-access-history-logs",
  title: "Access History Logs",
  description:
    "Comprehensive guide to implementing access history logs covering login history, device history, third-party access logs, access notifications, and security monitoring for user account transparency and security.",
  category: "functional-requirements",
  subcategory: "other-cross-cutting-functional-requirements",
  slug: "access-history-logs",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "cross-cutting",
    "access-history",
    "security-logs",
    "login-history",
    "audit",
  ],
  relatedTopics: ["privacy-settings", "profile-visibility", "permission-management", "consent-management"],
};

export default function AccessHistoryLogsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Access History Logs enable users to view who and what has accessed their account and data. Users can see login history (when, where, what device), device history (what devices are logged in), third-party access (what apps have access), and activity logs (what actions were taken). Access history is fundamental to account security (users can detect unauthorized access), transparency (users know who accessed their data), and compliance (GDPR, CCPA require access transparency). For platforms with user accounts, effective access history is essential for security, trust, and regulatory compliance.
        </p>
        <p>
          For staff and principal engineers, access history architecture involves logging infrastructure (capture all access events), log storage (store logs securely, retain appropriately), log presentation (display logs to users in understandable format), access notifications (notify users of significant access), and security monitoring (detect suspicious access patterns). The implementation must balance transparency (users see all access) with privacy (logs don&apos;t expose others&apos; privacy) and security (logs don&apos;t enable attacks). Poor access history leads to undetected breaches, user distrust, and compliance violations.
        </p>
        <p>
          The complexity of access history extends beyond simple logging. Log completeness (capture all access, not just some). Log accuracy (accurate timestamps, locations, devices). Log retention (how long to keep logs). Log privacy (logs may contain others&apos; data). Real-time notifications (notify of suspicious access immediately). Historical analysis (users can review past access). For staff engineers, access history is a security and transparency infrastructure decision affecting user trust, security, and compliance.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Login History</h3>
        <p>
          Login history tracks all account access. Timestamp (when login occurred). Location (where login occurred - IP geolocation). Device (what device was used). Browser/app (what browser or app). Success/failure (whether login succeeded). Login history enables users to detect unauthorized access (logins they don&apos;t recognize). Benefits include security (detect breaches), transparency (users see all access). Drawbacks include privacy (location data is sensitive), complexity (accurate geolocation).
        </p>
        <p>
          Failed login tracking records failed login attempts. Timestamp (when attempt occurred). Location (where attempt originated). Device (what device attempted). Reason (why failed - wrong password, 2FA failure). Failed login tracking enables detection of brute force attacks (many failed attempts). Benefits include security (detect attacks), account protection (lock after too many failures). Drawbacks includes false positives (legitimate users locked out).
        </p>
        <p>
          Session management tracks active login sessions. Session list (all active sessions). Session details (device, location, login time). Session termination (logout from specific sessions). Session management enables users to control active access (logout from old devices). Benefits include security (terminate suspicious sessions), control (manage active access). Drawbacks includes complexity (manage multiple sessions).
        </p>

        <h3 className="mt-6">Device History</h3>
        <p>
          Device tracking identifies devices that access account. Device fingerprint (unique device identifier). Device details (device type, OS, browser). First seen (when device first accessed). Last seen (when device last accessed). Device tracking enables users to recognize their devices and spot unknown devices. Benefits include security (detect unauthorized devices), convenience (remember trusted devices). Drawbacks includes privacy (device fingerprinting is sensitive).
        </p>
        <p>
          Trusted device management enables marking devices as trusted. Trust marking (user marks device as trusted). Trusted benefits (skip 2FA on trusted devices). Trust revocation (untrust devices). Trusted device management balances security (2FA on untrusted) with convenience (skip 2FA on trusted). Benefits include user experience (less friction on trusted devices). Drawbacks includes security risk (if trusted device is compromised).
        </p>
        <p>
          Device notifications alert users of new device access. New device alert (notify when new device accesses). Device details (what device, where, when). Confirmation option (confirm or deny access). Device notifications enable users to detect unauthorized device access. Benefits include security (immediate detection). Drawbacks includes notification fatigue (too many alerts).
        </p>

        <h3 className="mt-6">Third-Party Access Logs</h3>
        <p>
          Third-party access tracking logs third-party app access. App identity (what app accessed). Access time (when accessed). Data accessed (what data was accessed). Access purpose (why accessed). Third-party access tracking enables users to see what apps access their data. Benefits include transparency (users know what apps access), security (detect unauthorized apps). Drawbacks includes complexity (track all third-party access).
        </p>
        <p>
          OAuth access logs track OAuth-authorized access. Authorization time (when user authorized). Scope (what access was granted). Token usage (when token was used). Revocation (when access was revoked). OAuth logs enable users to see OAuth app activity. Benefits include transparency (see OAuth usage), control (revoke access). Drawbacks includes complexity (track all OAuth apps).
        </p>
        <p>
          API access logs track API access to user data. API endpoint (what endpoint accessed). Access time (when accessed). Accessor (who accessed - user, app, service). Data returned (what data was returned). API logs enable comprehensive access tracking. Benefits include complete audit trail, security monitoring. Drawbacks includes storage (logs consume storage), complexity (manage API logs).
        </p>

        <h3 className="mt-6">Access Notifications</h3>
        <p>
          Real-time notifications alert users of access events immediately. New login notification (notify when new login occurs). New device notification (notify when new device accesses). Suspicious access notification (notify of suspicious patterns). Real-time notifications enable immediate response to unauthorized access. Benefits include security (immediate detection), user control (quick response). Drawbacks includes notification fatigue (too many alerts).
        </p>
        <p>
          Digest notifications summarize access periodically. Daily digest (summary of day&apos;s access). Weekly digest (summary of week&apos;s access). Digest details (logins, devices, third-party access). Digest notifications reduce notification fatigue while maintaining awareness. Benefits include less fatigue (one summary vs. many alerts), still informed. Drawbacks includes delayed detection (not real-time).
        </p>
        <p>
          Notification preferences enable users to control access notifications. Notification types (choose which events notify). Notification channels (email, push, SMS). Notification frequency (real-time, digest). Notification preferences balance awareness with fatigue. Benefits include user control (users choose what alerts). Drawbacks includes complexity (many options).
        </p>

        <h3 className="mt-6">Security Monitoring</h3>
        <p>
          Anomaly detection identifies suspicious access patterns. Unusual location (login from new country). Unusual time (login at unusual hour). Unusual device (login from unknown device). Unusual pattern (many failed attempts). Anomaly detection enables proactive security (detect before damage). Benefits include early detection (catch attacks early), automated response. Drawbacks includes false positives (legitimate access flagged).
        </p>
        <p>
          Risk scoring assesses access risk level. Risk factors (location, device, time, pattern). Risk score (numeric risk assessment). Risk response (action based on risk - allow, challenge, block). Risk scoring enables nuanced security response. Benefits include appropriate response (high risk = more scrutiny). Drawbacks includes complexity (calculate risk accurately).
        </p>
        <p>
          Automated response takes action on suspicious access. Challenge (require additional verification). Block (block suspicious access). Notify (alert user of suspicious access). Lock (lock account if severe). Automated response enables immediate security action. Benefits include rapid response (no delay for manual review). Drawbacks includes false positive impact (legitimate users affected).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Access history architecture spans logging infrastructure, log storage, presentation layer, and security monitoring. Logging infrastructure captures all access events. Log storage stores logs securely with appropriate retention. Presentation layer displays logs to users. Security monitoring analyzes logs for suspicious activity. Each layer has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/access-history-logs/history-architecture.svg"
          alt="Access History Architecture"
          caption="Figure 1: Access History Architecture — Logging, storage, presentation, and security monitoring"
          width={1000}
          height={500}
        />

        <h3>Logging Infrastructure</h3>
        <p>
          Logging infrastructure captures all access events. Event capture (capture login, device, API, third-party events). Event enrichment (add location, device details). Event validation (ensure log integrity). Event transmission (send to log storage). Logging infrastructure is the foundation of access history - must capture all events reliably.
        </p>
        <p>
          Log integrity ensures logs are tamper-proof. Cryptographic signing (sign logs to detect tampering). Append-only storage (logs can&apos;t be modified). Audit trail (track who accessed logs). Log integrity is critical for security (logs must be trustworthy) and compliance (logs as evidence).
        </p>

        <h3 className="mt-6">Log Storage</h3>
        <p>
          Log storage persists access logs securely. Secure storage (encrypt logs at rest). Retention policy (how long to keep logs). Log rotation (manage log size). Access control (who can access logs). Log storage must balance retention (keep long enough for users) with cost (storage costs money) and privacy (don&apos;t keep forever).
        </p>
        <p>
          Log indexing enables efficient log queries. Time index (query by time range). User index (query by user). Event type index (query by event type). Location index (query by location). Log indexing enables fast log presentation (users don&apos;t wait for queries).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/access-history-logs/login-history.svg"
          alt="Login History Flow"
          caption="Figure 2: Login History Flow — Login event, logging, and user presentation"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Presentation Layer</h3>
        <p>
          Presentation layer displays access logs to users. Log list (chronological list of access events). Log details (expand for full details). Filtering (filter by type, time, device). Search (search logs). Presentation must be understandable (users can make sense of logs) and actionable (users can respond to suspicious access).
        </p>
        <p>
          Visualization helps users understand access patterns. Timeline view (visual timeline of access). Map view (map of login locations). Device view (list of devices). Visualization makes logs more accessible (visual vs. text). Benefits include user understanding (easier to spot patterns). Drawbacks includes complexity (build visualizations).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/access-history-logs/security-monitoring.svg"
          alt="Security Monitoring"
          caption="Figure 3: Security Monitoring — Anomaly detection, risk scoring, and automated response"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Access history design involves trade-offs between completeness and privacy, retention and cost, and real-time and digest notifications. Understanding these trade-offs enables informed decisions aligned with security requirements and user needs.
        </p>

        <h3>Logging: Complete vs. Selective</h3>
        <p>
          Complete logging (log all access). Pros: Maximum transparency (users see everything), security (detect all unauthorized access), compliance (meet logging requirements). Cons: Privacy concern (logs contain sensitive data), storage cost (more logs = more storage), complexity (manage all logs). Best for: Security-focused platforms, regulated industries.
        </p>
        <p>
          Selective logging (log only significant access). Pros: Reduced privacy impact (less sensitive data logged), lower storage cost (fewer logs), simpler management. Cons: May miss important access (not everything logged), reduced security (may not detect all unauthorized), compliance risk (may not meet requirements). Best for: Privacy-focused platforms, low-risk access.
        </p>
        <p>
          Hybrid: risk-based logging. Pros: Best of both (log high-risk completely, low-risk selectively). Cons: Complexity (determine risk levels), may still miss some access. Best for: Most platforms—complete logging for sensitive access, selective for routine.
        </p>

        <h3>Retention: Long vs. Short</h3>
        <p>
          Long retention (keep logs for months/years). Pros: Historical analysis (users can review old access), compliance (meet retention requirements), forensic value (logs available for investigation). Cons: Storage cost (logs accumulate), privacy risk (old logs contain sensitive data), management overhead (manage large log volume). Best for: Regulated industries, security-focused platforms.
        </p>
        <p>
          Short retention (keep logs for days/weeks). Pros: Lower storage cost (logs deleted quickly), reduced privacy risk (old logs don&apos;t accumulate), simpler management. Cons: Limited historical analysis (can&apos;t review old access), compliance risk (may not meet requirements), reduced forensic value. Best for: Privacy-focused platforms, low-risk access.
        </p>
        <p>
          Hybrid: tiered retention. Pros: Best of both (recent logs detailed, old logs summarized). Cons: Complexity (manage tiers), may not satisfy all requirements. Best for: Most platforms—recent logs complete, older logs summarized or deleted.
        </p>

        <h3>Notifications: Real-time vs. Digest</h3>
        <p>
          Real-time notifications (notify immediately). Pros: Immediate awareness (users know right away), rapid response (users can respond quickly), security (detect breaches immediately). Cons: Notification fatigue (many alerts), user annoyance (too many notifications), may be ignored (users tune out). Best for: High-security platforms, suspicious access detection.
        </p>
        <p>
          Digest notifications (notify periodically). Pros: Reduced fatigue (one summary vs. many alerts), less annoying (one notification), more likely to read (consolidated). Cons: Delayed awareness (don&apos;t know until digest), slower response (breach may go unnoticed), less secure. Best for: Routine access, low-risk platforms.
        </p>
        <p>
          Hybrid: risk-based notifications. Pros: Best of both (real-time for suspicious, digest for routine). Cons: Complexity (determine risk), may still cause some fatigue. Best for: Most platforms—real-time for high-risk, digest for routine.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/access-history-logs/history-comparison.svg"
          alt="Access History Approaches Comparison"
          caption="Figure 4: Access History Approaches Comparison — Logging, retention, and notification trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Log all access events:</strong> Logins, devices, API access, third-party access. Complete audit trail. Tamper-proof logs.
          </li>
          <li>
            <strong>Provide clear log presentation:</strong> Chronological list. Expandable details. Filtering and search. Visual timeline.
          </li>
          <li>
            <strong>Enable session management:</strong> Show active sessions. Allow session termination. Logout from all devices.
          </li>
          <li>
            <strong>Implement access notifications:</strong> New login notifications. New device notifications. Suspicious access alerts. User-controlled preferences.
          </li>
          <li>
            <strong>Monitor for anomalies:</strong> Unusual location detection. Unusual time detection. Unusual device detection. Pattern analysis.
          </li>
          <li>
            <strong>Implement risk scoring:</strong> Assess access risk. Appropriate response based on risk. Challenge high-risk access.
          </li>
          <li>
            <strong>Set appropriate retention:</strong> Keep logs long enough for users. Meet compliance requirements. Balance with storage cost.
          </li>
          <li>
            <strong>Protect log integrity:</strong> Cryptographic signing. Append-only storage. Access control on logs.
          </li>
          <li>
            <strong>Provide actionable logs:</strong> Users can respond to suspicious access. Terminate sessions. Change password. Enable 2FA.
          </li>
          <li>
            <strong>Respect privacy in logs:</strong> Don&apos;t log sensitive data unnecessarily. Anonymize where possible. Limit log access.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Incomplete logging:</strong> Not all access logged. <strong>Solution:</strong> Log all access events - logins, devices, API, third-party.
          </li>
          <li>
            <strong>Poor log presentation:</strong> Users can&apos;t understand logs. <strong>Solution:</strong> Clear format, visual timeline, filtering, search.
          </li>
          <li>
            <strong>No session management:</strong> Can&apos;t terminate suspicious sessions. <strong>Solution:</strong> Enable session termination, logout from all.
          </li>
          <li>
            <strong>No notifications:</strong> Users don&apos;t know of suspicious access. <strong>Solution:</strong> Real-time notifications for suspicious access.
          </li>
          <li>
            <strong>Excessive retention:</strong> Logs kept forever. <strong>Solution:</strong> Appropriate retention period, delete old logs.
          </li>
          <li>
            <strong>Log tampering risk:</strong> Logs can be modified. <strong>Solution:</strong> Cryptographic signing, append-only storage.
          </li>
          <li>
            <strong>Notification fatigue:</strong> Too many alerts. <strong>Solution:</strong> Risk-based notifications, user preferences.
          </li>
          <li>
            <strong>No anomaly detection:</strong> Suspicious access not flagged. <strong>Solution:</strong> Implement anomaly detection, risk scoring.
          </li>
          <li>
            <strong>Logs expose sensitive data:</strong> Logs contain too much sensitive info. <strong>Solution:</strong> Minimize sensitive data in logs, protect log access.
          </li>
          <li>
            <strong>No actionable response:</strong> Users see suspicious access but can&apos;t respond. <strong>Solution:</strong> Enable session termination, password change, 2FA enable.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Gmail Account Activity</h3>
        <p>
          Gmail provides detailed access history. Last account activity (recent access with IP, location, time). Device information (what device accessed). Access type (browser, mobile, POP/IMAP). Security alerts (suspicious access notified). Session management (sign out all other sessions). Users can detect unauthorized access and secure account.
        </p>

        <h3 className="mt-6">Facebook Security Settings</h3>
        <p>
          Facebook provides comprehensive access history. Where you&apos;re logged in (list of devices/locations). Login alerts (notify of unrecognized logins). Two-factor authentication logs. Third-party app access (what apps have access). Users can review and terminate suspicious sessions.
        </p>

        <h3 className="mt-6">Google Account Activity</h3>
        <p>
          Google Account provides detailed activity logs. Device activity (what devices accessed). Security events (password changes, 2FA changes). Third-party access (what apps have access). Ad personalization (what data used for ads). Users can review all activity and control access.
        </p>

        <h3 className="mt-6">Banking App Access Logs</h3>
        <p>
          Banking apps provide security-focused access logs. Login history (all logins with location). Device recognition (trusted devices). Suspicious activity alerts (immediate notification). Session timeout (automatic logout). Users can monitor account access for fraud detection.
        </p>

        <h3 className="mt-6">Enterprise SSO Access Logs</h3>
        <p>
          Enterprise SSO provides compliance-focused access logs. All SSO logins (who, when, what app). Failed login attempts (detect brute force). Geographic anomalies (login from unusual location). Compliance reports (audit trail for compliance). Security teams can monitor for threats and meet compliance requirements.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design access history that balances transparency with privacy?</p>
            <p className="mt-2 text-sm">
              Implement privacy-aware logging that captures essential security information without exposing sensitive details. Log access events (who accessed, when, what resource, outcome) but minimize sensitive data—store approximate location (city-level) instead of full GPS coordinates, truncate IP addresses to /24 subnet, hash device fingerprints. Users should only access their own logs, never others&apos;. Implement log retention limits (90 days detailed, 1 year aggregated) to comply with data minimization principles. Use anonymization for analytics—aggregate login patterns without storing individual identifiers. The key insight: users deserve transparency about their account access, but logs shouldn&apos;t become privacy violations themselves or create honeypots for attackers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect suspicious access patterns?</p>
            <p className="mt-2 text-sm">
              Build an anomaly detection system that establishes per-user baselines and flags deviations. Track normal behavior patterns: typical login times (9 AM-6 PM for working professionals), usual locations (home city, office city), common devices (personal laptop, mobile phone). Detect deviations: login from new country, access at 3 AM local time, unknown device fingerprint, impossible travel (login from NY then London 1 hour later). Implement risk scoring that combines multiple factors—single anomaly might be low risk, but multiple anomalies compound risk. Automated responses should be graduated: low risk (log only), medium risk (challenge with 2FA), high risk (block and alert). The key insight: suspicious access is relative—what&apos;s normal for a traveling consultant differs from a desk worker. Baseline per user, detect deviations, and continuously tune thresholds based on false positive rates.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure log integrity?</p>
            <p className="mt-2 text-sm">
              Implement tamper-proof logging with multiple layers of protection. Use cryptographic signing—each log entry gets an HMAC signature using a server-side key, making modifications detectable. Store logs in append-only storage (WORM—Write Once Read Many) where entries can&apos;t be modified or deleted. Separate log storage from application servers—send logs to dedicated log infrastructure (ELK stack, Splunk, CloudWatch) so compromised app servers can&apos;t tamper with logs. Implement strict access control—only security team can access raw logs, and even their access is logged. Audit log access itself—track who viewed logs, when, and what they queried. Consider blockchain-style hash chaining where each entry includes hash of previous entry, creating immutable chain. The key insight: logs are only useful if trustworthy—implement defense-in-depth against tampering because attackers who compromise your system will try to cover their tracks by modifying logs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle notification fatigue?</p>
            <p className="mt-2 text-sm">
              Implement risk-based notification tiers that reserve real-time alerts for genuinely important events. High-risk events (suspicious access from new country, password change, new device addition) trigger immediate push/SMS notifications. Medium-risk events (login from known device in new location) go into daily digest. Low-risk events (routine login from home) are logged but not notified. Let users configure preferences—some want all alerts, others want only critical. Implement smart grouping—instead of 10 notifications for 10 logins from same device, send one summary: &quot;10 logins from Chrome on Mac in past week.&quot; Use rate limiting—don&apos;t send more than 3 notifications per hour unless critical. The key insight: too many notifications and users ignore them all or disable them entirely. Reserve real-time alerts for truly important events, batch routine activity, and give users control over their notification experience.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you determine appropriate log retention?</p>
            <p className="mt-2 text-sm">
              Balance multiple competing factors when setting retention policy. User needs: users need recent history (30-90 days) to review account activity and spot unauthorized access. Compliance requirements: GDPR doesn&apos;t specify minimum but requires data minimization; PCI-DSS requires 1 year for security logs; SOC 2 typically expects 90 days minimum; industry regulations may specify longer. Security value: older logs become less valuable for threat detection—attacks are detected within days/weeks, not years. Storage cost: detailed logs cost money—consider tiered storage (hot storage for 30 days, cold storage for 1 year, then delete). Privacy obligations: don&apos;t keep personal data longer than necessary. Typical enterprise retention: 90 days detailed logs in searchable storage, 1 year aggregated/summarized logs in cold storage, then permanent deletion. The key insight: keep logs long enough to be useful for security and compliance, not so long they become privacy liability or cost burden.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you enable users to respond to suspicious access?</p>
            <p className="mt-2 text-sm">
              Provide clear, actionable security controls that users can execute immediately. Session termination: show list of active sessions with device info, location, last active time; allow users to revoke any session with one click. Password change: if suspicious access detected, prompt password reset with secure flow (require current password or 2FA, check new password strength, invalidate all sessions after change). 2FA enable: after suspicious access, strongly encourage (or require) 2FA enrollment with multiple options (TOTP app, SMS, hardware key). Account lock: for severe compromises, temporarily lock account and require identity verification to unlock. Recovery process: help legitimate users regain access through backup codes, recovery email, phone verification, or account recovery questions. The key insight: detecting suspicious access is useless if users can&apos;t respond—provide clear, immediate action options with step-by-step guidance, and ensure recovery processes are secure but accessible to legitimate users who&apos;ve been locked out.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://support.google.com/accounts/answer/32331"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Account — Check Account Activity
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/settings?tab=security"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Security Settings — Where You&apos;re Logged In
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/en-us/account-billing/view-your-account-activity-in-microsoft-cloud-71f81e80-d14c-6626-c8e7-183499a2aaf2"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Account — View Account Activity
            </a>
          </li>
          <li>
            <a
              href="https://www.eff.org/issues/security"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              EFF — Account Security Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.ncsc.gov.uk/guidance/logging-monitoring-and-detection"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NCSC — Logging, Monitoring and Detection
            </a>
          </li>
          <li>
            <a
              href="https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/08-Testing_for_Error_Handling/01-Testing_For_Error_Code"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP — Security Logging Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
