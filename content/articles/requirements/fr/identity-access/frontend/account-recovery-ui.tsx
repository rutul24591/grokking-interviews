"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
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
        <p>
          For staff and principal engineers, implementing account recovery requires 
          understanding identity verification, multi-factor recovery, manual review 
          processes, security trade-offs, and abuse prevention. The implementation 
          must provide clear guidance while preventing social engineering attacks 
          and unauthorized access.
        </p>
      </section>

      <section>
        <h2>Recovery Options</h2>

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
      </section>

      <section>
        <h2>Recovery Flow</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 1: Initiate Recovery</h3>
          <ul className="space-y-3">
            <li>
              <strong>Entry Point:</strong> "Can't access your account?" link on 
              login page.
            </li>
            <li>
              <strong>Account Lookup:</strong> Enter email/username. Find account 
              without confirming existence.
            </li>
            <li>
              <strong>Recovery Options:</strong> Show available methods (masked 
              email, phone).
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 2: Identity Verification</h3>
          <ul className="space-y-3">
            <li>
              <strong>Multiple Factors:</strong> Require 2+ verification methods 
              for high-security accounts.
            </li>
            <li>
              <strong>Knowledge-Based:</strong> Answer account-specific questions 
              (recent activity, settings).
            </li>
            <li>
              <strong>Possession-Based:</strong> Prove access to recovery email/
              phone.
            </li>
            <li>
              <strong>Device-Based:</strong> Recognized device/browser provides 
              additional confidence.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">Step 3: Account Restoration</h3>
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
        <h2>Security Considerations</h2>
        <ul className="space-y-3">
          <li>
            <strong>Rate Limiting:</strong> Limit recovery attempts (3/day per 
            account). Prevent brute force.
          </li>
          <li>
            <strong>Information Leakage:</strong> Don't reveal which recovery 
            options exist. Generic messages.
          </li>
          <li>
            <strong>Social Engineering:</strong> Train support staff. Require 
            multiple verification factors.
          </li>
          <li>
            <strong>Audit Logging:</strong> Log all recovery attempts, successful 
            or not. Include IP, device, method.
          </li>
          <li>
            <strong>Cooldown Period:</strong> After failed recovery, wait 24 hours 
            before retry.
          </li>
        </ul>
      </section>

      <section>
        <h2>UX Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Clear Options:</strong> Show all available recovery methods. 
            Help users choose.
          </li>
          <li>
            <strong>Progress Indicator:</strong> Multi-step flow with clear 
            progress. Estimate time.
          </li>
          <li>
            <strong>Support Access:</strong> Easy path to human support if 
            self-service fails.
          </li>
          <li>
            <strong>Confirmation:</strong> Clear confirmation when recovery 
            succeeds. Next steps.
          </li>
          <li>
            <strong>Prevention Guidance:</strong> After recovery, guide user to 
            set up backup methods.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you verify identity for account recovery?</p>
            <p className="mt-2 text-sm">
              A: Multi-factor: (1) Something they have (access to recovery email/
              phone), (2) Something they know (account details, recent activity), 
              (3) Something they are (ID verification for high-value accounts). 
              Require 2+ factors for security.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle recovery when all methods are unavailable?</p>
            <p className="mt-2 text-sm">
              A: Manual review process: support ticket, identity verification 
              (government ID), account questions (creation date, recent purchases, 
              connected services), waiting period (3-7 days), human review before 
              restoration.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Should security questions be used for recovery?</p>
            <p className="mt-2 text-sm">
              A: Not recommended as primary method. Answers easily researched 
              (mother's maiden name, pet name). If used: custom questions 
              (not standard), treat as weak factor, require additional 
              verification.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent account takeover via recovery?</p>
            <p className="mt-2 text-sm">
              A: Multiple verification factors, waiting period for sensitive 
              accounts, notify original email/phone of recovery attempt, 
              require re-verification of all recovery methods after successful 
              recovery, audit all recovery attempts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle recovery for business/enterprise accounts?</p>
            <p className="mt-2 text-sm">
              A: Admin recovery (other admins can restore access), account 
              ownership verification (business documents), dedicated support 
              channel, higher security requirements, multi-person approval 
              for recovery.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you help users avoid needing recovery?</p>
            <p className="mt-2 text-sm">
              A: Encourage multiple recovery methods during setup, periodic 
              reminders to update recovery info, backup codes with storage 
              guidance, trusted contacts option, password manager 
              recommendations.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
