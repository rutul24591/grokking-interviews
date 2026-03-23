"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-ia-frontend-account-recovery",
  title: "Account Recovery UI",
  description: "Comprehensive guide to implementing account recovery interfaces covering recovery options, identity verification, multi-step flows, security patterns, and UX considerations for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "identity-access",
  slug: "account-recovery-ui",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-16",
  tags: ["requirements", "functional", "identity", "account-recovery", "security", "verification", "frontend"],
  relatedTopics: ["password-reset", "phone-verification", "mfa-setup", "security-settings"],
};

export default function AccountRecoveryUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Account Recovery UI</strong> provides a pathway for users to regain
          access to their account when standard authentication methods fail (forgotten
          password, lost MFA device, compromised email). It is a critical security
          feature that must balance accessibility (legitimate users recover accounts)
          with security (prevent account takeover).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-recovery-flow.svg"
          alt="Account Recovery Flow"
          caption="Account Recovery Flow — showing identity verification, reset options, and account restoration"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-recovery-options.svg"
          alt="Account Recovery Options"
          caption="Account Recovery Options — comparing backup codes, recovery email, phone, and support ticket"
        />

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/identity-access/account-recovery-security.svg"
          alt="Account Recovery Security"
          caption="Account Recovery Security — showing waiting periods, notifications, and audit trails"
        />
      
        <p>
          For staff and principal engineers, implementing account recovery requires
          understanding identity verification, multi-factor recovery, manual review
          processes, security trade-offs, and abuse prevention. The implementation
          must provide clear guidance while preventing social engineering attacks
          and unauthorized access.
        </p>

        

        

        
      </section>

      <section>
        <h2>Core Requirements</h2>
        <p>
          A production-ready account recovery flow must handle multiple recovery methods with proper identity verification.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Self-Service Recovery</h3>
          <ul className="space-y-3">
            <li>
              <strong>Backup Email:</strong> Send recovery code to secondary email
              configured during signup.
            </li>
            <li>
              <strong>Backup Phone:</strong> SMS code to registered phone number.
              Alternative if primary unavailable.
            </li>
            <li>
              <strong>Backup Codes:</strong> One-time codes generated during MFA
              setup. Store securely offline.
            </li>
            <li>
              <strong>Trusted Contacts:</strong> Designated contacts can vouch for
              identity (Facebook model).
            </li>
            <li>
              <strong>Security Questions:</strong> Legacy method, not recommended
              (easily researched). Use only as last resort.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Manual Recovery</h3>
          <ul className="space-y-3">
            <li>
              <strong>Support Ticket:</strong> Submit recovery request with identity
              proof.
            </li>
            <li>
              <strong>Identity Verification:</strong> Provide ID, answer account
              questions, prove ownership.
            </li>
            <li>
              <strong>Waiting Period:</strong> 3-7 days for review. Prevents
              impulsive account takeover.
            </li>
            <li>
              <strong>Human Review:</strong> Support team verifies identity before
              restoring access.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Identity Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Multi-Factor:</strong> Require 2+ verification methods for
              high-security accounts.
            </li>
            <li>
              <strong>Knowledge-Based:</strong> Answer account-specific questions
              (recent activity, settings).
            </li>
            <li>
              <strong>Possession-Based:</strong> Prove access to recovery email/phone.
            </li>
            <li>
              <strong>Device-Based:</strong> Recognized device/browser provides
              additional confidence.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Account Restoration</h3>
          <ul className="space-y-3">
            <li>
              <strong>Reset Credentials:</strong> Set new password, configure new
              MFA.
            </li>
            <li>
              <strong>Session Invalidation:</strong> Log out all sessions. Prevent
              attacker access.
            </li>
            <li>
              <strong>Security Notice:</strong> Email confirming recovery. Alert
              if not requested.
            </li>
            <li>
              <strong>Review Activity:</strong> Show recent account activity.
              Report suspicious actions.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Security Implementation</h3>
        <ul className="space-y-2">
          <li>Require multiple verification factors</li>
          <li>Use waiting periods for sensitive accounts</li>
          <li>Notify users of recovery attempts</li>
          <li>Log all recovery attempts for audit</li>
          <li>Invalidate sessions after recovery</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">User Experience</h3>
        <ul className="space-y-2">
          <li>Clear recovery options display</li>
          <li>Step-by-step guidance</li>
          <li>Progress indicators for multi-step flows</li>
          <li>Support access throughout flow</li>
          <li>Clear confirmation on success</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recovery Methods</h3>
        <ul className="space-y-2">
          <li>Offer multiple recovery options</li>
          <li>Encourage backup methods during setup</li>
          <li>Allow recovery method updates</li>
          <li>Provide manual review fallback</li>
          <li>Document recovery process clearly</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Monitoring</h3>
        <ul className="space-y-2">
          <li>Track recovery success rate</li>
          <li>Monitor recovery attempt patterns</li>
          <li>Alert on suspicious recovery attempts</li>
          <li>Track manual review queue</li>
          <li>Monitor recovery method usage</li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Single recovery method:</strong> Users locked out if unavailable.
            <br /><strong>Fix:</strong> Require multiple recovery methods during setup.
          </li>
          <li>
            <strong>Weak verification:</strong> Easy to bypass with social engineering.
            <br /><strong>Fix:</strong> Require multiple verification factors.
          </li>
          <li>
            <strong>No waiting period:</strong> Immediate account takeover possible.
            <br /><strong>Fix:</strong> Implement 3-7 day waiting period for manual review.
          </li>
          <li>
            <strong>No user notification:</strong> Users unaware of recovery attempts.
            <br /><strong>Fix:</strong> Notify on all recovery attempts.
          </li>
          <li>
            <strong>Poor UX:</strong> Users can't complete recovery flow.
            <br /><strong>Fix:</strong> Clear step-by-step guidance. Progress indicators.
          </li>
          <li>
            <strong>No manual review:</strong> No fallback for edge cases.
            <br /><strong>Fix:</strong> Provide support ticket option.
          </li>
          <li>
            <strong>Not invalidating sessions:</strong> Attacker retains access.
            <br /><strong>Fix:</strong> Invalidate all sessions after recovery.
          </li>
          <li>
            <strong>Poor documentation:</strong> Users don't know recovery options.
            <br /><strong>Fix:</strong> Document recovery process clearly during setup.
          </li>
          <li>
            <strong>No recovery method updates:</strong> Can't update outdated methods.
            <br /><strong>Fix:</strong> Allow recovery method updates when authenticated.
          </li>
          <li>
            <strong>No monitoring:</strong> Can't detect abuse patterns.
            <br /><strong>Fix:</strong> Monitor recovery attempts. Alert on anomalies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced Topics</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Multi-Factor Recovery</h3>
        <p>
          Require multiple verification methods for high-security accounts.
        </p>
        <ul className="space-y-2">
          <li><strong>Combination:</strong> Email + phone, or email + security questions.</li>
          <li><strong>Risk-Based:</strong> More factors for higher-risk accounts.</li>
          <li><strong>Progressive:</strong> Start with one factor, add more if needed.</li>
          <li><strong>Enterprise:</strong> Require admin approval for enterprise accounts.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Trusted Contacts</h3>
        <p>
          Allow users to designate contacts who can vouch for identity.
        </p>
        <ul className="space-y-2">
          <li><strong>Setup:</strong> User designates 3-5 trusted contacts during setup.</li>
          <li><strong>Recovery:</strong> Contacts receive recovery codes.</li>
          <li><strong>Threshold:</strong> Require 2-3 contacts to complete recovery.</li>
          <li><strong>Security:</strong> Contacts can't access account, only vouch.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Manual Review Process</h3>
        <p>
          Human review for edge cases and high-risk recoveries.
        </p>
        <ul className="space-y-2">
          <li><strong>Submission:</strong> User submits recovery request with proof.</li>
          <li><strong>Verification:</strong> Support team verifies identity documents.</li>
          <li><strong>Questions:</strong> Ask account-specific questions only owner would know.</li>
          <li><strong>Waiting Period:</strong> 3-7 days prevents impulsive takeover.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Recovery Method Management</h3>
        <p>
          Allow users to manage recovery methods proactively.
        </p>
        <ul className="space-y-2">
          <li><strong>Add Methods:</strong> Add backup email, phone during setup.</li>
          <li><strong>Update Methods:</strong> Update when methods become outdated.</li>
          <li><strong>Remove Methods:</strong> Remove compromised methods.</li>
          <li><strong>Verification:</strong> Verify new methods before activation.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you verify identity for account recovery?</p>
            <p className="mt-2 text-sm">
              A: Multi-factor verification: (1) Something they have (access to recovery email/phone), (2) Something they know (account details, recent activity), (3) Something they are (ID verification for high-value accounts). Require 2+ factors for security.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle recovery when all methods are unavailable?</p>
            <p className="mt-2 text-sm">
              A: Manual review process: support ticket, identity verification (government ID), account questions (creation date, recent purchases, connected services), waiting period (3-7 days), human review before restoration.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should security questions be used for recovery?</p>
            <p className="mt-2 text-sm">
              A: Not recommended as primary method. Answers easily researched (mother's maiden name, pet name). If used: custom questions (not standard), treat as weak factor, require additional verification.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent account takeover via recovery?</p>
            <p className="mt-2 text-sm">
              A: Multiple verification factors, waiting period for sensitive accounts, notify original email/phone of recovery attempt, require re-verification of all recovery methods after successful recovery, audit all recovery attempts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle recovery for business/enterprise accounts?</p>
            <p className="mt-2 text-sm">
              A: Admin recovery (other admins can restore access), account ownership verification (business documents), dedicated support channel, higher security requirements, multi-person approval for recovery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you help users avoid needing recovery?</p>
            <p className="mt-2 text-sm">
              A: Encourage multiple recovery methods during setup, periodic reminders to update recovery info, backup codes with storage guidance, trusted contacts option, password manager recommendations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What metrics do you track for account recovery?</p>
            <p className="mt-2 text-sm">
              A: Recovery success rate, time-to-recovery, method distribution, manual review rate, false positive rate, recovery attempt patterns. Alert on anomalies (spike in recovery attempts).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle trusted contacts for recovery?</p>
            <p className="mt-2 text-sm">
              A: User designates 3-5 contacts during setup. For recovery, contacts receive recovery codes. Require 2-3 contacts to complete recovery. Contacts can't access account, only vouch for identity.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle recovery method updates?</p>
            <p className="mt-2 text-sm">
              A: Require authentication to update recovery methods. Verify new method (send code). Notify user of change. Allow reversal within grace period (24 hours). Rate limit method changes.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li><a href="https://pages.nist.gov/800-63-3/sp800-63b.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">NIST SP 800-63B - Digital Identity Guidelines</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authentication Cheat Sheet</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Choosing_and_Using_Security_Questions_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Security Questions</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Multifactor Authentication</a></li>
          <li><a href="https://auth0.com/blog/a-look-at-the-latest-draft-for-oauth-2-1/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OAuth 2.1 Security Best Practices</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_security_guides/Authentication" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">MDN - Authentication Security</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Session Management</a></li>
          <li><a href="https://docs.openfga.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OpenFGA - Fine-Grained Authorization</a></li>
          <li><a href="https://www.cerbos.dev/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Cerbos - Policy as Code</a></li>
          <li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">OWASP Authorization Cheat Sheet</a></li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">E-commerce Account Recovery</h3>
        <p>
          Large e-commerce platform with 50M users recovering accounts with order history.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Users forget email used for signup. Order history tied to account. Fraudulent recovery attempts for stored payment methods.</li>
          <li><strong>Solution:</strong> Email lookup with order verification (last 4 digits of card). Alternative recovery via phone. Support escalation with ID verification.</li>
          <li><strong>Result:</strong> 85% self-service recovery. Fraud reduced by 90%. Customer satisfaction maintained.</li>
          <li><strong>Security:</strong> Payment verification, identity confirmation, fraud detection.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Banking Account Recovery</h3>
        <p>
          Online banking with high-security recovery for financial accounts.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> FFIEC requires strong identity verification. Account takeover risk is critical. Customers without phone/email access.</li>
          <li><strong>Solution:</strong> Multi-factor recovery (email + SMS + security questions). Branch visit option for no-phone users. Manual review with ID verification. 24-hour cooling period.</li>
          <li><strong>Result:</strong> Zero account takeovers via recovery. Passed regulatory audits. Customer access maintained (branch option).</li>
          <li><strong>Security:</strong> Multi-factor verification, ID validation, cooling period, manual review.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Social Media Account Recovery</h3>
        <p>
          Social platform with 500M users, trusted contacts recovery model.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Users lose phone and email access. High volume of recovery requests. Fake recovery attempts for popular accounts.</li>
          <li><strong>Solution:</strong> Trusted contacts (3-5 friends) vouch for identity. Photo ID upload for verification. AI-assisted identity matching. Recovery code backup option.</li>
          <li><strong>Result:</strong> 70% recovery success rate. Fake recoveries blocked. User trust maintained.</li>
          <li><strong>Security:</strong> Trusted contact verification, ID matching, AI fraud detection.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Enterprise SaaS Account Recovery</h3>
        <p>
          B2B SaaS with 10,000 enterprise customers, admin-managed recovery.
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> Employee locked out. Admin can reset but needs verification. SSO users can't use local recovery. Compliance audit trail.</li>
          <li><strong>Solution:</strong> Admin-initiated recovery with manager approval. SSO redirect to IdP recovery. Audit logging for all recovery actions. Temporary access codes.</li>
          <li><strong>Result:</strong> Employee downtime reduced to hours. Compliance audits passed. Zero unauthorized recoveries.</li>
          <li><strong>Security:</strong> Admin verification, manager approval, audit logging, SSO integration.</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Gaming Platform Account Recovery</h3>
        <p>
          Online gaming platform with high-value accounts (virtual items, currency).
        </p>
        <ul className="space-y-2">
          <li><strong>Challenge:</strong> High-value accounts targeted for theft. Young users without email access. Purchase history as verification.</li>
          <li><strong>Solution:</strong> Purchase verification (receipt lookup). Parental verification for minors. Original signup details quiz. Waiting period for high-value accounts.</li>
          <li><strong>Result:</strong> Account theft reduced by 95%. Parent satisfaction improved. Recovery success 80%.</li>
          <li><strong>Security:</strong> Purchase verification, parental consent, waiting period, quiz validation.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
