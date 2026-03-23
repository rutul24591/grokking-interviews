"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-backend-account-lockout",
  title: "Account Lockout",
  description:
    "Comprehensive guide to implementing account lockout covering threshold configuration, lockout duration, unlock mechanisms, DoS prevention, and security patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "account-lockout",
  version: "extensive",
  wordCount: 9000,
  readingTime: 36,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "account-lockout",
    "security",
    "backend",
    "brute-force",
  ],
  relatedTopics: ["login-attempt-tracking", "authentication-service", "account-recovery"],
};

export default function AccountLockoutArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Account Lockout</strong> is a security mechanism that temporarily or permanently
          locks an account after repeated failed authentication attempts. It is a critical defense
          against brute force attacks (trying many passwords against one account) and credential
          stuffing attacks (trying one password against many accounts). By limiting the number of
          password guesses, lockout makes these attacks computationally infeasible.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-lockout-flow.svg"
          alt="Account Lockout Flow"
          caption="Account Lockout Flow — showing failed attempts, lockout trigger, and unlock process"
        />

        <p>
          For staff and principal engineers, implementing account lockout requires deep
          understanding of threshold configuration (5-10 attempts), lockout duration (15 min - 24
          hours), unlock mechanisms (automatic, email, admin), and security patterns (DoS
          prevention, progressive delays, CAPTCHA integration). The implementation must balance
          security (preventing attacks) with usability (not locking out legitimate users) while
          preventing the lockout mechanism itself from being weaponized for denial-of-service.
        </p>
        <p>
          Modern account lockout has evolved from simple counter-based locking to adaptive,
          risk-based systems. Organizations like Google, Microsoft, and Okta use machine learning
          to adjust lockout thresholds based on risk signals (IP reputation, device fingerprint,
          location, time of day). Progressive delays (1s, 2s, 4s, 8s) are often preferred over hard
          lockout for consumer applications, as they slow attacks without frustrating legitimate
          users who mistype passwords.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Account lockout is built on fundamental concepts that determine how lockouts are
          triggered, enforced, and resolved. Understanding these concepts is essential for
          designing effective lockout systems.
        </p>
        <p>
          <strong>Lockout Threshold:</strong> The number of failed attempts before lockout triggers.
          NIST recommends 5-10 attempts — too low causes user frustration, too high enables
          attacks. Consider progressive approach: CAPTCHA at 3 failures (blocks bots, allows
          humans), soft lockout at 5 (require additional verification), hard lockout at 10
          (complete block). Threshold may vary by risk profile — lower for admin accounts, higher
          for consumer accounts.
        </p>
        <p>
          <strong>Lockout Duration:</strong> How long the account remains locked. Options include:
          temporary (15 minutes to 24 hours), permanent until admin reset, or progressive (15 min
          → 1 hour → 24 hours → manual reset). Temporary lockout is preferred for most cases —
          provides security while allowing self-service recovery. Progressive duration deters
          persistent attackers who face increasingly long lockouts.
        </p>
        <p>
          <strong>Lockout Scope:</strong> What gets locked — per account (all access blocked), per
          IP (only that IP blocked), or per device (only that device blocked). Per-account lockout
          is most secure but enables DoS attacks. Per-IP lockout prevents DoS but attackers can
          rotate IPs. Hybrid approach: per-account lockout with per-IP rate limiting separately.
        </p>
        <p>
          <strong>Unlock Mechanisms:</strong> How locked accounts are recovered. Options include:
          automatic (unlock after duration expires), email unlock (send unlock link to verified
          email), MFA override (unlock with verified MFA), or admin reset (support team manually
          unlocks). Self-service options (email, MFA) reduce support burden. Admin reset for
          edge cases where self-service unavailable.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Account lockout architecture separates lockout logic from authentication, enabling
          centralized lockout management with distributed enforcement. This architecture is critical
          for scaling lockout across distributed systems.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-lockout-unlock.svg"
          alt="Account Lockout Unlock"
          caption="Account Unlock Mechanisms — showing automatic expiry, email unlock, MFA override, and admin reset workflows"
        />

        <p>
          The lockout flow starts when a login attempt fails. The authentication service increments
          the failed attempt counter (stored in Redis with TTL), checks if threshold exceeded,
          triggers lockout if threshold exceeded (set locked_until timestamp, send notification
          email), returns appropriate error message (generic — don't reveal lockout status to
          prevent enumeration), and logs the event for security monitoring. On successful login,
          the counter is reset to zero. This flow must complete quickly to avoid impacting login
          latency.
        </p>
        <p>
          Unlock architecture provides multiple recovery paths. Automatic unlock — locked_until
          timestamp expires, account automatically unlocked, counter reset. Email unlock — user
          requests unlock, system sends time-limited unlock link to verified email, user clicks
          link, account unlocked. MFA override — user verifies identity with MFA, account unlocked.
          Admin reset — support team manually unlocks after verifying identity. Multiple options
          ensure users can recover while maintaining security.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-lockout-security.svg"
          alt="Account Lockout Security"
          caption="Account Lockout Security — showing DoS prevention, progressive delays, CAPTCHA integration, and IP rate limiting"
        />

        <p>
          DoS prevention is critical — attackers can weaponize lockout to deny service to
          legitimate users. Mitigation strategies include: IP-based rate limiting (separate from
          account lockout), CAPTCHA before full lockout (blocks bots, allows humans), progressive
          delays (slow down without blocking), and email unlock (legitimate users can recover).
          Monitor for lockout abuse patterns — many lockouts from same IP indicates attack.
          Organizations like Cloudflare use these techniques to protect against lockout-based DoS.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing account lockout systems involves trade-offs between security, usability, and
          operational complexity. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Hard vs Soft Lockout</h3>
          <ul className="space-y-3">
            <li>
              <strong>Hard Lockout:</strong> Completely block authentication until unlock. Maximum
              security, clear boundary. Limitation: user frustration, support burden, enables DoS.
            </li>
            <li>
              <strong>Soft Lockout:</strong> Require additional verification (CAPTCHA, MFA, email
              code). Blocks automated attacks, allows legitimate users. Limitation: more complex
              implementation, slightly weaker security.
            </li>
            <li>
              <strong>Hybrid:</strong> Soft lockout for consumer accounts, hard lockout for
              admin/high-risk accounts. Best balance — security where it matters, usability for
              standard users. Used by Google, Microsoft.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Counter-Based vs Time-Window Lockout</h3>
          <ul className="space-y-3">
            <li>
              <strong>Counter-Based:</strong> Lock after N total failures. Simple, easy to
              implement. Limitation: slow attacks (1 attempt per hour) eventually succeed.
            </li>
            <li>
              <strong>Time-Window:</strong> Lock after N failures within time window (e.g., 10
              failures in 15 minutes). Prevents slow attacks, more forgiving. Limitation: more
              complex implementation (sliding window or time buckets).
            </li>
            <li>
              <strong>Hybrid:</strong> Counter-based with time decay (failures expire after 24
              hours). Best of both — simple implementation, prevents slow attacks. Used by most
              production systems.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Progressive Delays vs Lockout</h3>
          <ul className="space-y-3">
            <li>
              <strong>Progressive Delays:</strong> Don't lock, just add delay (1s, 2s, 4s, 8s). No
              user frustration, blocks automated attacks. Limitation: patient attackers eventually
              succeed, delays impact legitimate users.
            </li>
            <li>
              <strong>Lockout:</strong> Block after threshold. Clear security boundary, stops
              attacks. Limitation: user frustration, support burden, DoS risk.
            </li>
            <li>
              <strong>Hybrid:</strong> Progressive delays first (up to 5 failures), then lockout.
              Best balance — slow attacks without frustrating users, hard stop for persistent
              attackers. Used by Okta, Auth0.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing account lockout requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Use progressive lockout for repeat offenders — 15 min → 1 hour → 24 hours → manual reset.
          Implement CAPTCHA before full lockout — after 3 failures, require CAPTCHA before
          continuing. Separate IP rate limiting from account lockout — IP limiting prevents DoS,
          account lockout prevents brute force. Log all lockout events for security monitoring —
          include account, IP, timestamp, failure count. Notify users of lockout via email —
          include unlock instructions, timestamp, IP (for detecting unauthorized lockouts).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Provide clear lockout messages — "Account temporarily locked. Unlock link sent to your
          email" — but don't reveal if account exists (prevent enumeration). Show remaining lockout
          time — "Account unlocks in 14 minutes" — reduces support tickets. Offer self-service
          unlock options — email unlock, MFA override — reduces support burden. Provide support
          contact for locked accounts — for edge cases where self-service unavailable. Don't reveal
          lockout status in error messages — same error for all failures.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring &amp; Alerting</h3>
        <p>
          Track lockout rates by account and IP — baseline normal rate, alert on anomalies. Alert
          on unusual lockout patterns — many lockouts from same IP (attack), many lockouts for
          same account (targeted attack). Monitor unlock success rates — low success rate indicates
          UX issues. Track time-to-unlock metrics — long times indicate process issues. Analyze
          lockout reasons for optimization — CAPTCHA effectiveness, threshold tuning.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Compliance</h3>
        <p>
          Meet regulatory lockout requirements — NIST (5-10 attempts), PCI-DSS (6 attempts
          maximum), SOC 2 (audit trails). Document lockout policies — threshold, duration, unlock
          procedures. Audit lockout and unlock events — who, what, when, why. Support compliance
          reporting — pre-built reports for auditors. Regular policy reviews — adjust based on
          attack patterns, user feedback.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing account lockout to ensure secure, usable,
          and maintainable lockout systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Lockout DoS:</strong> Attackers lock out legitimate users by triggering
            lockout. <strong>Fix:</strong> IP-based rate limiting separately from account lockout,
            CAPTCHA before full lockout, email unlock for legitimate users, monitor for lockout
            abuse patterns.
          </li>
          <li>
            <strong>Account enumeration:</strong> Different errors for locked accounts vs invalid
            credentials reveals which accounts exist. <strong>Fix:</strong> Same error message for
            all failures ("Invalid credentials"), don't reveal lockout status in error messages.
          </li>
          <li>
            <strong>No unlock mechanism:</strong> Users permanently locked out, support overwhelmed.{" "}
            <strong>Fix:</strong> Automatic expiry (15 min - 24 hours), email unlock (self-service),
            support reset (for edge cases), MFA override (for high-security accounts).
          </li>
          <li>
            <strong>Too aggressive lockout:</strong> Low threshold (3 attempts) causes user
            frustration. <strong>Fix:</strong> 5-10 attempts threshold, progressive delays before
            lockout, CAPTCHA first (blocks bots, allows humans).
          </li>
          <li>
            <strong>No monitoring:</strong> Can't detect attack patterns, optimize thresholds.{" "}
            <strong>Fix:</strong> Log all lockouts, alert on patterns (many from same IP), analyze
            trends for threshold tuning.
          </li>
          <li>
            <strong>Shared account lockout:</strong> One user locks out everyone using shared
            account. <strong>Fix:</strong> Per-IP rate limiting for shared accounts, avoid account
            lockout for shared accounts, implement user-specific credentials within shared account.
          </li>
          <li>
            <strong>No escalation:</strong> Same lockout for repeat attackers, no deterrence.{" "}
            <strong>Fix:</strong> Progressive lockout duration (15 min → 1 hour → 24 hours), manual
            reset for repeat offenders, log escalation events.
          </li>
          <li>
            <strong>Poor UX messages:</strong> Users don't understand why locked, how to unlock.{" "}
            <strong>Fix:</strong> Clear messages ("Account locked for security"), show remaining
            time, provide unlock options (email link, support contact).
          </li>
          <li>
            <strong>No audit trail:</strong> Can't investigate security incidents, compliance
            violations. <strong>Fix:</strong> Log all lockout/unlock events with actor, timestamp,
            reason, store in immutable audit log.
          </li>
          <li>
            <strong>Ignoring mobile users:</strong> Mobile IPs change frequently (cell towers),
            IP-based lockout locks out legitimate users. <strong>Fix:</strong> Account-based
            lockout (not IP-based) for mobile, device fingerprint for mobile users, higher
            threshold for mobile.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Account lockout is critical for organizations with security and compliance requirements.
          Here are real-world implementations from production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer Email (Gmail)</h3>
        <p>
          <strong>Challenge:</strong> Billions of users, constant brute force attacks. Need to
          block attacks without locking out legitimate users who mistype passwords. Mobile users
          with changing IPs.
        </p>
        <p>
          <strong>Solution:</strong> Progressive delays (1s, 2s, 4s, 8s) instead of hard lockout.
          CAPTCHA after 5 failures. Account-based lockout (not IP-based). Email notification on
          suspicious activity. Risk-based thresholds (lower for suspicious IPs, higher for trusted
          devices).
        </p>
        <p>
          <strong>Result:</strong> Brute force attacks blocked 99.9%. User frustration minimal.
          Mobile users not affected by IP changes.
        </p>
        <p>
          <strong>Security:</strong> Progressive delays, CAPTCHA, risk-based thresholds, email
          notifications.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SSO (Okta)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers with compliance requirements (NIST,
          SOC 2). Admin accounts need stronger protection. Shared accounts for service accounts.
        </p>
        <p>
          <strong>Solution:</strong> Hard lockout after 5 failures for admin accounts. Soft
          lockout (MFA required) for standard users. Per-IP rate limiting for shared accounts.
          Email notification on lockout. Self-service unlock via email or MFA. Admin reset for edge
          cases.
        </p>
        <p>
          <strong>Result:</strong> Passed NIST and SOC 2 audits. Admin accounts protected. Shared
          accounts not locked out by single user.
        </p>
        <p>
          <strong>Security:</strong> Hard lockout for admins, soft lockout for users, per-IP
          limiting, audit trails.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Application (Chase)</h3>
        <p>
          <strong>Challenge:</strong> Financial application with strict security requirements. FFIEC
          compliance requires lockout. High-value accounts need maximum protection.
        </p>
        <p>
          <strong>Solution:</strong> Hard lockout after 5 failures. Email notification immediately
          on lockout. Phone verification for unlock (call verified phone number). Admin reset
          available at branch. Progressive lockout for repeat offenders (15 min → 24 hours →
          branch visit).
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audit. Zero account takeovers via brute force.
          Customer trust maintained.
        </p>
        <p>
          <strong>Security:</strong> Hard lockout, phone verification, progressive duration, branch
          reset for high-security.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Platform (Amazon)</h3>
        <p>
          <strong>Challenge:</strong> Millions of users, credential stuffing attacks. Need to block
          attacks without impacting shopping experience. High cart abandonment if users locked out.
        </p>
        <p>
          <strong>Solution:</strong> Soft lockout (CAPTCHA + email verification) instead of hard
          lockout. Risk-based thresholds (lower for new accounts, higher for established). Email
          notification on lockout. One-click unlock via email link. Monitor for credential stuffing
          patterns.
        </p>
        <p>
          <strong>Result:</strong> Credential stuffing blocked 95%. Cart abandonment not impacted.
          User frustration minimal.
        </p>
        <p>
          <strong>Security:</strong> Soft lockout, risk-based thresholds, email unlock, pattern
          detection.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Healthcare EHR (Epic)</h3>
        <p>
          <strong>Challenge:</strong> Electronic Health Records with HIPAA compliance. Provider
          accounts access patient data. Need to balance security with emergency access.
        </p>
        <p>
          <strong>Solution:</strong> Hard lockout after 5 failures. Immediate notification to
          security team. Admin unlock only (no self-service for compliance). Break-glass procedure
          for emergency access (full audit, post-incident review). HIPAA audit trails for all
          lockouts.
        </p>
        <p>
          <strong>Result:</strong> Passed HIPAA audits. Zero unauthorized access via brute force.
          Emergency access available with audit.
        </p>
        <p>
          <strong>Security:</strong> Hard lockout, admin unlock, break-glass procedure, HIPAA audit
          trails.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of account lockout design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the ideal lockout threshold?</p>
            <p className="mt-2 text-sm">
              A: 5-10 attempts balances security vs usability per NIST guidelines. Too low (3
              attempts) causes user frustration and support burden. Too high (20+ attempts) enables
              brute force attacks. Consider progressive approach: CAPTCHA at 3 failures (blocks
              bots, allows humans), soft lockout at 5 (require additional verification), hard
              lockout at 10 (complete block). Adjust based on risk profile — lower for admin
              accounts, higher for consumer accounts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent DoS via lockout?</p>
            <p className="mt-2 text-sm">
              A: Multiple strategies: (1) IP-based rate limiting separately from account lockout —
              attacker can't lock out all users from one IP. (2) CAPTCHA before full lockout —
              blocks automated attacks, allows humans. (3) Progressive delays — slow down without
              blocking. (4) Email unlock — legitimate users can recover. (5) Monitor for lockout
              abuse patterns — many lockouts from same IP indicates attack.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's the difference between soft and hard lockout?</p>
            <p className="mt-2 text-sm">
              A: Soft lockout requires additional verification (CAPTCHA, MFA, email code) but
              doesn't completely block authentication. Hard lockout completely blocks
              authentication until admin reset or time expiry. Use soft for consumer apps (better
              UX, still blocks automated attacks), hard for high-security accounts (admin,
              financial, healthcare). Hybrid approach: soft for standard users, hard for admins.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle lockout for shared accounts?</p>
            <p className="mt-2 text-sm">
              A: Avoid account lockout for shared accounts — one user can lock out everyone. Use
              per-IP rate limiting instead — each IP has separate limit. Or implement user-specific
              credentials within shared account — each user has own login. Consider MFA for
              additional security. Monitor shared account access patterns for anomalies. Document
              shared account procedures for support team.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement progressive lockout?</p>
            <p className="mt-2 text-sm">
              A: Increase lockout duration with each lockout event. Track lockout count per account
              (separate from failed attempt counter). First lockout: 15 minutes. Second: 1 hour.
              Third: 24 hours. Fourth+: manual reset required. Reset count after successful login
              or time period (e.g., 30 days without lockout). Log escalation events for security
              monitoring. Alert on accounts reaching manual reset threshold.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle lockout in distributed systems?</p>
            <p className="mt-2 text-sm">
              A: Use shared cache (Redis Cluster) for lockout state — all services check same
              counter. Publish lockout events to message bus (Kafka) — all services update local
              cache. Handle propagation delays gracefully — accept brief inconsistency. Design for
              eventual consistency — lockout propagates within seconds. Monitor lockout
              synchronization health across services. Use atomic operations for counter increment.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for account lockout?</p>
            <p className="mt-2 text-sm">
              A: Lockout rate (lockouts per hour, baseline normal), unlock success rate (percentage
              of users who successfully unlock), time-to-unlock (average time from lockout to
              unlock), lockout reasons distribution (CAPTCHA, threshold, admin), IP-based lockout
              patterns (detect attacks), false positive rate (legitimate users locked out), user
              complaints. Set up alerts for anomalies — spike in lockouts, unusual patterns, high
              false positive rate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance security and UX for lockout?</p>
            <p className="mt-2 text-sm">
              A: Progressive approach: CAPTCHA at 3 failures (blocks bots, allows humans), soft
              lockout at 5 (require email verification), hard lockout at 10 (complete block).
              Provide self-service unlock options (email link, MFA override). Clear communication
              about lockout ("Account locked for security, unlock link sent to email"). Consider
              risk-based thresholds (lower for suspicious IPs, higher for trusted devices). Monitor
              and adjust based on attack patterns and user feedback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle mobile users with changing IPs?</p>
            <p className="mt-2 text-sm">
              A: Account-based lockout (not IP-based) for mobile users — IP changes don't trigger
              lockout. Device fingerprint for mobile users — recognize device even if IP changes.
              Higher threshold for mobile — acknowledge higher false positive rate. Use device
              trust — trusted devices have higher threshold. Monitor mobile-specific patterns —
              different attack patterns than desktop.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://pages.nist.gov/800-63-3/sp800-63b.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIST SP 800-63B - Digital Identity Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Brute_Force_Attack_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Brute Force Prevention
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Credential Stuffing Prevention
            </a>
          </li>
          <li>
            <a
              href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OAuth 2.1 Security Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Authentication Security
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Access Control Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://docs.openfga.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenFGA - Fine-Grained Authorization
            </a>
          </li>
          <li>
            <a
              href="https://www.cerbos.dev/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cerbos - Policy as Code
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
