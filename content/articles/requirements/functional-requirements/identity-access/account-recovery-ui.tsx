"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-account-recovery",
  title: "Account Recovery UI",
  description:
    "Comprehensive guide to implementing account recovery interfaces covering recovery options, identity verification, multi-step flows, security patterns, backup codes, and UX considerations for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "account-recovery-ui",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "identity",
    "account-recovery",
    "security",
    "verification",
    "frontend",
  ],
  relatedTopics: ["password-reset", "phone-verification", "mfa-setup"],
};

export default function AccountRecoveryUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Account Recovery UI</strong> provides a pathway for users to regain access to
          their account when standard authentication methods fail (forgotten password, lost MFA
          device, compromised email). It is a critical security feature that must balance
          accessibility (legitimate users recover accounts) with security (prevent account
          takeover). Account recovery is often the most stressful user experience — users are
          locked out, frustrated, and vulnerable to phishing attacks.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-recovery-flow.svg"
          alt="Account Recovery Flow"
          caption="Account Recovery Flow — showing identity verification, recovery options, waiting period, and account restoration"
        />

        <p>
          For staff and principal engineers, implementing account recovery requires deep
          understanding of identity verification (multi-factor proof of ownership), recovery
          methods (backup codes, recovery email/phone, security questions), manual review processes
          (support ticket with identity verification), security trade-offs (ease of recovery vs
          takeover prevention), and abuse prevention (rate limiting, waiting periods, audit
          logging). The implementation must provide clear guidance while preventing social
          engineering attacks and unauthorized access.
        </p>
        <p>
          Modern account recovery has evolved from simple security questions to multi-factor
          recovery (backup codes + recovery email + phone), trusted contacts (Facebook model), and
          manual review with identity verification (government ID, payment history). Organizations
          like Google, Microsoft, and Apple implement layered recovery — start with self-service
          (backup codes), escalate to manual review if needed, with waiting periods for security.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Account recovery is built on fundamental concepts that determine how users prove identity
          and regain access. Understanding these concepts is essential for designing effective
          recovery systems.
        </p>
        <p>
          <strong>Self-Service Recovery:</strong> Backup Email (send recovery code to secondary
          email configured during signup), Backup Phone (SMS code to registered phone number),
          Backup Codes (one-time codes generated during MFA setup — store securely offline),
          Trusted Contacts (designated contacts can vouch for identity — Facebook model). These
          methods allow users to recover without support intervention.
        </p>
        <p>
          <strong>Manual Recovery:</strong> Support ticket with identity verification (government
          ID, payment history, account details), phone verification (call support, answer security
          questions), video verification (video call with support agent). These methods are for
          users who exhausted self-service options. Slower but necessary for edge cases.
        </p>
        <p>
          <strong>Identity Verification:</strong> Multi-factor proof of ownership — something user
          knows (password, security questions), something user has (phone, backup codes), something
          user is (biometric, voice verification). Combine multiple factors for high-confidence
          verification. Waiting periods (24-72 hours) for additional security — gives legitimate
          user time to detect and cancel unauthorized recovery.
        </p>
        <p>
          <strong>Security Questions:</strong> Legacy method, not recommended (easily researched,
          static answers). Use only as last resort. If used: custom questions (user-defined),
          case-insensitive answers, allow partial matches, combine with other factors. Better
          alternatives: backup codes, recovery email/phone.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Account recovery architecture separates self-service recovery from manual review,
          enabling scalable recovery with security oversight. This architecture is critical for
          handling diverse recovery scenarios while preventing abuse.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-recovery-options.svg"
          alt="Account Recovery Options"
          caption="Account Recovery Options — comparing backup codes, recovery email, recovery phone, trusted contacts, and manual review"
        />

        <p>
          Recovery flow: User navigates to account recovery page, enters email/username. Backend
          checks if account exists (don't reveal if doesn't exist — prevent enumeration). Show
          available recovery options (backup email, phone, backup codes). User selects method,
          completes verification (enter code from email/SMS/backup codes). If successful: allow
          password reset, notify user of recovery, invalidate old sessions. If failed: offer
          alternative methods, escalate to manual review.
        </p>
        <p>
          Security architecture includes: rate limiting (prevent brute force — 3 attempts/hour),
          waiting periods (24-72 hours for high-security accounts), notification emails (alert user
          of recovery attempt), audit logging (track all recovery attempts), manual review
          (support ticket with identity verification). This architecture enables legitimate recovery
          while preventing account takeover — attacks are detected and blocked.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-recovery-security.svg"
          alt="Account Recovery Security"
          caption="Account Recovery Security — showing waiting periods, notification emails, audit trails, rate limiting, and manual review"
        />

        <p>
          UX optimization is critical — recovery is stressful for users. Optimization strategies
          include: clear instructions (step-by-step guide), progress indicator (show where user is
          in flow), multiple recovery options (don't rely on single method), clear error messages
          (actionable, not technical), support contact (for users who can't recover). Organizations
          like Google report 80%+ recovery success rate with optimized flows.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing account recovery involves trade-offs between security, accessibility, and
          operational complexity. Understanding these trade-offs is essential for making informed
          architecture decisions.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Self-Service vs Manual Recovery</h3>
          <ul className="space-y-3">
            <li>
              <strong>Self-Service:</strong> Instant recovery, no support cost, scalable.
              Limitation: requires user to set up recovery options proactively.
            </li>
            <li>
              <strong>Manual:</strong> Works for all users (even without recovery options).
              Limitation: slow (24-72 hours), high support cost, not scalable.
            </li>
            <li>
              <strong>Recommendation:</strong> Self-service as primary (backup codes, recovery
              email/phone). Manual as fallback (for users without recovery options). Encourage
              users to set up recovery options during onboarding.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Waiting Period: None vs Short vs Long</h3>
          <ul className="space-y-3">
            <li>
              <strong>None:</strong> Instant recovery, best UX. Limitation: no time to detect
              unauthorized recovery.
            </li>
            <li>
              <strong>Short (24 hours):</strong> Time to detect unauthorized recovery, reasonable
              UX. Limitation: user must wait.
            </li>
            <li>
              <strong>Long (72+ hours):</strong> Maximum security, time for investigation.
              Limitation: frustrated users, support tickets.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Security Questions: Legacy vs Modern</h3>
          <ul className="space-y-3">
            <li>
              <strong>Legacy (Pre-defined):</strong> "What's your mother's maiden name?" Easy to
              implement. Limitation: easily researched, static answers.
            </li>
            <li>
              <strong>Modern (Custom):</strong> User-defined questions, case-insensitive answers.
              Better security. Limitation: users forget answers.
            </li>
            <li>
              <strong>Recommendation:</strong> Don't use security questions as primary recovery.
              Use backup codes, recovery email/phone. If used: combine with other factors, allow
              partial matches.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing account recovery requires following established best practices to ensure
          security, usability, and operational effectiveness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <p>
          Require multi-factor proof of ownership — combine backup codes + recovery email + phone.
          Implement waiting periods (24-72 hours) for high-security accounts — time to detect
          unauthorized recovery. Send notification emails — alert user of recovery attempt, provide
          cancel link. Rate limit recovery attempts — 3/hour, prevent brute force. Log all recovery
          attempts — detect abuse patterns.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <p>
          Provide clear instructions — step-by-step guide, screenshots. Show progress indicator —
          user knows where they are in flow. Offer multiple recovery options — don't rely on single
          method. Clear error messages — actionable, not technical ("Code expired, request new
          code"). Provide support contact — for users who can't recover.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recovery Options</h3>
        <p>
          Backup codes (generate during MFA setup, force download, store hashes), recovery email
          (secondary email configured during signup), recovery phone (SMS code to registered
          phone), trusted contacts (designated contacts can vouch — Facebook model). Encourage
          users to set up multiple options during onboarding.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Audit &amp; Monitoring</h3>
        <p>
          Log all recovery attempts — user, method, timestamp, IP, outcome. Track recovery success
          rate — detect issues (low rate indicates UX problem). Alert on unusual patterns — many
          recovery attempts for same account, recovery from unusual location. Monitor manual review
          queue — backlog indicates recovery flow issues.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing account recovery to ensure secure, usable,
          and maintainable recovery systems.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>No backup codes:</strong> Users locked out if they lose MFA device.{" "}
            <strong>Fix:</strong> Force backup code download during MFA setup. Store hashes
            securely.
          </li>
          <li>
            <strong>Single recovery method:</strong> No fallback if method unavailable.{" "}
            <strong>Fix:</strong> Offer multiple recovery options (backup codes + email + phone).
          </li>
          <li>
            <strong>No waiting period:</strong> Immediate recovery enables account takeover.{" "}
            <strong>Fix:</strong> Implement 24-72 hour waiting period for high-security accounts.
          </li>
          <li>
            <strong>No notification email:</strong> User unaware of unauthorized recovery.{" "}
            <strong>Fix:</strong> Send notification email with cancel link.
          </li>
          <li>
            <strong>Security questions as primary:</strong> Easily researched, static answers.{" "}
            <strong>Fix:</strong> Use backup codes, recovery email/phone. Security questions only
            as last resort.
          </li>
          <li>
            <strong>No rate limiting:</strong> Allows brute force attacks on recovery.{" "}
            <strong>Fix:</strong> Rate limit recovery attempts (3/hour).
          </li>
          <li>
            <strong>Revealing account existence:</strong> "Account not found" enables enumeration.{" "}
            <strong>Fix:</strong> Use generic message "If account exists, we'll send recovery
            instructions".
          </li>
          <li>
            <strong>No manual review option:</strong> Users without recovery options permanently
            locked out. <strong>Fix:</strong> Provide support ticket option with identity
            verification.
          </li>
          <li>
            <strong>Poor error messages:</strong> Users don't know why recovery failed.{" "}
            <strong>Fix:</strong> Clear, actionable error messages ("Code expired, request new
            code").
          </li>
          <li>
            <strong>No audit logging:</strong> Can't detect abuse patterns, no compliance trail.{" "}
            <strong>Fix:</strong> Log all recovery attempts for security monitoring.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Account recovery is critical for user retention. Here are real-world implementations from
          production systems.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Consumer App (Google)</h3>
        <p>
          <strong>Challenge:</strong> Billions of users, diverse recovery scenarios. Need to
          balance security (prevent takeover) with accessibility (legitimate users recover).
        </p>
        <p>
          <strong>Solution:</strong> Multi-factor recovery (backup codes, recovery email, recovery
          phone). Trusted contacts (designated contacts can vouch). Waiting period for suspicious
          recovery. Manual review for edge cases.
        </p>
        <p>
          <strong>Result:</strong> 80%+ recovery success rate. Account takeovers detected and
          prevented. User trust maintained.
        </p>
        <p>
          <strong>Security:</strong> Multi-factor verification, waiting periods, notification
          emails, audit logging.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS (Okta)</h3>
        <p>
          <strong>Challenge:</strong> Enterprise customers require admin-initiated recovery.
          Compliance requires audit trails. High-security accounts need enhanced verification.
        </p>
        <p>
          <strong>Solution:</strong> Admin-initiated recovery (admin can reset user MFA). Backup
          codes for all users. Recovery email/phone. Manual review with identity verification.
          Audit logging for compliance.
        </p>
        <p>
          <strong>Result:</strong> Passed SOC 2 audit. Admin can recover user accounts. Compliance
          requirements met.
        </p>
        <p>
          <strong>Security:</strong> Admin controls, backup codes, audit trails, identity
          verification.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking App (Chase)</h3>
        <p>
          <strong>Challenge:</strong> FFIEC requires strong identity verification. High-value
          accounts need enhanced recovery. Elderly customers need simple flow.
        </p>
        <p>
          <strong>Solution:</strong> Phone verification (call support, answer questions). Backup
          codes for MFA users. In-branch recovery (show ID at branch). Waiting period for
          high-value accounts.
        </p>
        <p>
          <strong>Result:</strong> Passed FFIEC audit. Account takeovers prevented. Customer
          satisfaction maintained.
        </p>
        <p>
          <strong>Security:</strong> Phone verification, in-person verification, waiting periods.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Media (Facebook)</h3>
        <p>
          <strong>Challenge:</strong> Billions of users, many without recovery options. Trusted
          contacts model for social recovery.
        </p>
        <p>
          <strong>Solution:</strong> Trusted contacts (3-5 friends can vouch for identity).
          Recovery email/phone. Photo identification (upload government ID). Manual review for edge
          cases.
        </p>
        <p>
          <strong>Result:</strong> 70%+ recovery success rate. Social recovery effective for users
          without recovery options.
        </p>
        <p>
          <strong>Security:</strong> Trusted contacts, photo ID, manual review.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform (Epic Games)</h3>
        <p>
          <strong>Challenge:</strong> High-value accounts (virtual items). Young users without
          recovery options. Parental recovery for minor accounts.
        </p>
        <p>
          <strong>Solution:</strong> Backup codes for MFA users. Parental recovery (parents can
          recover minor accounts). Purchase history verification (prove account ownership). Manual
          review with identity verification.
        </p>
        <p>
          <strong>Result:</strong> Account takeovers reduced 80%. Parental control effective.
          Recovery success rate 75%.
        </p>
        <p>
          <strong>Security:</strong> Backup codes, parental recovery, purchase history
          verification.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of account recovery design, implementation, and
          operational concerns.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What recovery methods do you support and why?</p>
            <p className="mt-2 text-sm">
              A: Support multiple methods for accessibility: (1) Backup codes — most secure, works
              offline, generated during MFA setup. (2) Recovery email — secondary email configured
              during signup. (3) Recovery phone — SMS code to registered phone. (4) Trusted
              contacts — designated contacts can vouch (Facebook model). (5) Manual review —
              support ticket with identity verification as last resort. Always allow multiple
              recovery options.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you generate and store backup codes?</p>
            <p className="mt-2 text-sm">
              A: Generate 10 one-time codes during MFA setup. Each code is cryptographically random
              (8-10 characters). Store bcrypt hash of codes (not plaintext) — protects against
              database breach. Force user to download/print codes before enabling MFA. Each code
              usable once — invalidate after use. Allow regeneration (invalidates old codes).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent account takeover via recovery?</p>
            <p className="mt-2 text-sm">
              A: Multi-layer defense: (1) Require multi-factor proof of ownership (backup codes +
              recovery email). (2) Implement waiting period (24-72 hours) — time to detect
              unauthorized recovery. (3) Send notification email — alert user with cancel link. (4)
              Rate limit recovery attempts (3/hour). (5) Log all recovery attempts — detect abuse
              patterns. (6) Manual review for suspicious recovery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What's your account recovery flow?</p>
            <p className="mt-2 text-sm">
              A: Step-by-step flow: (1) User enters email/username. (2) Show available recovery
              options (backup codes, recovery email, phone). (3) User selects method, completes
              verification. (4) If successful: allow password reset, notify user, invalidate old
              sessions. (5) If failed: offer alternative methods, escalate to manual review. (6)
              Send confirmation email after successful recovery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle users without recovery options?</p>
            <p className="mt-2 text-sm">
              A: Manual review process: (1) Support ticket with account details (email, username,
              creation date). (2) Identity verification (government ID, payment history, account
              activity). (3) Phone verification (call support, answer questions). (4) Waiting
              period (72 hours) for additional security. (5) Manual approval by support agent.
              Encourage users to set up recovery options during onboarding to avoid this scenario.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement waiting periods for recovery?</p>
            <p className="mt-2 text-sm">
              A: When recovery initiated: set recovery_pending flag with expiry timestamp (24-72
              hours). Send notification email with cancel link ("Click here to cancel recovery").
              Allow user to cancel recovery within waiting period. After waiting period expires:
              allow password reset, notify user, invalidate old sessions. Log waiting period events
              for audit.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle security questions?</p>
            <p className="mt-2 text-sm">
              A: Don't use as primary recovery (easily researched, static answers). If used: custom
              questions (user-defined, not pre-defined), case-insensitive answers, allow partial
              matches, combine with other factors (not standalone). Better alternatives: backup
              codes, recovery email/phone. During onboarding, encourage users to set up backup
              codes instead of security questions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for account recovery?</p>
            <p className="mt-2 text-sm">
              A: Recovery success rate (% who complete recovery), recovery method distribution
              (backup codes vs email vs phone), time-to-recovery, manual review rate, recovery
              abandonment rate, support tickets for recovery. Monitor for anomalies — spike in
              recovery attempts (attack), low success rate (UX problem). Track by user segment (new
              vs existing).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you encourage users to set up recovery options?</p>
            <p className="mt-2 text-sm">
              A: During onboarding: force backup code download during MFA setup. Prompt for
              recovery email/phone after signup. Show recovery status in account settings ("Add
              recovery email"). Send periodic reminders ("Add backup recovery options"). Offer
              incentives (account recovery guarantee). Make setup quick and simple (under 2
              minutes).
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Multifactor Authentication Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Forgot Password Cheat Sheet
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Security Questions
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Session Management Cheat Sheet
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Authorization Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
