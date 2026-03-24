"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-frontend-delete-content",
  title: "Delete Content UI",
  description:
    "Comprehensive guide to implementing content deletion interfaces covering deletion patterns (soft delete, hard delete, delayed delete), confirmation flows, cascading deletes, recovery mechanisms, GDPR right to erasure, data retention policies, and UX patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "delete-content-ui",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "delete",
    "frontend",
    "soft-delete",
    "gdpr",
  ],
  relatedTopics: ["soft-delete", "content-lifecycle", "data-retention"],
};

export default function DeleteContentUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Delete Content UI</strong> provides users the ability to remove their content
          while preventing accidental deletion and offering recovery options when appropriate. It
          encompasses both soft delete which hides content but retains it for recovery and hard
          delete which permanently removes content. Each pattern serves different use cases and
          compliance requirements. Delete UI is critical for user control and compliance — users
          must be able to delete their content, but accidental deletion must be preventable and
          recoverable.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/delete-content-flow.svg"
          alt="Delete Content Flow"
          caption="Delete Content Flow — showing confirmation dialog, soft delete with recovery window, cascading deletes, and permanent deletion"
        />

        <p>
          For staff and principal engineers, implementing delete UI requires deep understanding of
          deletion patterns including soft delete with deleted_at timestamp and is_deleted flag for
          recoverable deletion, hard delete for permanent removal required by GDPR right to
          erasure, and delayed delete which schedules deletion for future execution. Confirmation
          flows prevent accidental deletion through multi-step confirmation with clear warnings
          about consequences. Cascading deletes handle dependent content by either deleting related
          content, reassigning ownership, or blocking deletion if dependencies exist. Recovery
          mechanisms enable users to restore deleted content from trash or recycle bin within
          retention period. GDPR right to erasure requires honoring deletion requests within 30 days
          with identity verification. Data retention policies define how long deleted content is
          retained before permanent deletion based on compliance requirements. The implementation
          must balance ease of deletion providing user control with protection from accidental loss
          through confirmation friction and recovery options.
        </p>

        <p>
          Modern delete UIs have evolved from simple delete buttons to sophisticated deletion
          workflows with confirmation dialogs, grace periods for recovery, and compliance-aware
          retention policies. Platforms like Google Drive provide trash with 30-day retention,
          GitHub uses soft delete with recovery for repositories, and Apple implements delayed
          deletion with 30-day recovery window for iCloud data. GDPR compliance has driven
          standardized deletion flows with identity verification, deletion confirmation, and
          completion notification.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Content deletion is built on fundamental concepts that determine how content is removed,
          retained, and recovered. Understanding these concepts is essential for designing deletion
          interfaces that balance user control with data protection.
        </p>

        <p>
          <strong>Soft Delete:</strong> Marks content as deleted without removing it from database
          using deleted_at timestamp or is_deleted boolean flag. Content is hidden from normal views
          but retained in database for recovery. Users can restore deleted content within retention
          period typically 30-90 days from trash or recycle bin interface. Soft delete protects
          from accidental deletion, maintains referential integrity by keeping foreign key
          relationships intact, enables recovery from mistakes, and supports audit trails for
          compliance. Considerations include storage costs for retained data, privacy implications
          of retaining personal data, need for cleanup jobs to permanently delete after retention
          period, and potential user confusion about where deleted content goes.
        </p>

        <p>
          <strong>Hard Delete:</strong> Permanently removes content from database with no recovery
          possible. Required for GDPR right to erasure requests where users demand complete data
          removal. Used for sensitive data that must not be retained, user-requested permanent
          deletion, and legal compliance requiring complete data removal. Benefits include complete
          data removal for privacy compliance, reduced storage costs from not retaining deleted
          data, and clear user expectation that deletion is permanent. Considerations include
          maintaining referential integrity by handling orphaned records through cascade delete or
          null assignment, audit trail gaps where deleted content history is lost, irreversible
          nature requiring strong confirmation, and compliance requirements mandating retention of
          certain data types despite deletion requests.
        </p>

        <p>
          <strong>Confirmation Flows:</strong> Multi-step confirmation prevents accidental deletion
          through deliberate user action. Simple confirmation uses dialog with delete button and
          cancel option for low-risk content. Enhanced confirmation requires typing confirmation
          phrase like "DELETE" for high-risk content. Delayed confirmation schedules deletion for
          future date providing grace period for recovery. Confirmation flows must clearly
          communicate consequences including what content will be deleted, whether recovery is
          possible, how long recovery window lasts, and what happens to related content. Effective
          confirmation balances friction preventing accidents with usability not frustrating users.
        </p>

        <p>
          <strong>Recovery Mechanisms:</strong> Enable users to restore deleted content within
          retention period. Trash or recycle bin interface shows deleted content with restore and
          permanent delete options. Recovery window defines how long content remains recoverable
          typically 30 days for consumer services, 90 days for enterprise. Recovery process restores
          content to original location or designated recovery folder with notification to user.
          Recovery metadata tracks who deleted, when deleted, when recovered, and original location
          for audit purposes. Recovery mechanisms provide safety net for accidental deletion while
          maintaining clear path to permanent deletion.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Delete UI architecture separates user interface, confirmation flow, deletion logic, and
          recovery mechanisms enabling modular implementation with clear boundaries. This
          architecture is critical for user experience, data integrity, and compliance.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/delete-content-flow.svg"
          alt="Delete Content Flow"
          caption="Delete Content Flow — showing confirmation dialog, soft delete with recovery window, cascading deletes, and permanent deletion"
        />

        <p>
          Delete flow begins when user clicks delete on content. Frontend shows confirmation dialog
          with clear warning about consequences and recovery options. User confirms deletion
          (possibly with enhanced confirmation like typing "DELETE" for high-risk content).
          Frontend sends delete request to backend with delete type (soft or hard). Backend
          validates user has permission to delete content. Backend checks for dependencies
          (related content, foreign key references). For soft delete, backend sets deleted_at
          timestamp and is_deleted flag, moves content to trash, starts retention period timer. For
          hard delete, backend verifies GDPR compliance requirements, deletes content permanently,
          handles cascading deletes for related content, logs deletion for audit. Backend returns
          success with recovery information if applicable (recovery deadline, trash location).
          Frontend shows success message with recovery options and deadline.
        </p>

        <p>
          Confirmation architecture includes simple confirmation with dialog showing delete button
          and cancel for low-risk content like drafts or personal notes. Enhanced confirmation
          requires typing confirmation phrase matching content title or "DELETE" for high-risk
          content like production data or shared resources. Delayed confirmation schedules deletion
          for future date (7-30 days) sending email confirmation with cancel link enabling recovery
          before execution. Confirmation choice depends on content risk level, user role, and
          organizational policies.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/delete-cascading.svg"
          alt="Cascading Delete Handling"
          caption="Cascading Delete — showing dependency detection, cascade options (delete related, reassign, block), and referential integrity handling"
        />

        <p>
          Cascading delete architecture handles dependencies when deleting content with related
          content. Dependency detection queries database for related content through foreign key
          relationships identifying what will be affected. Cascade options include delete related
          content which deletes all dependent content recursively, reassign ownership which
          transfers dependent content to different owner or default container, or block deletion
          which prevents deletion until dependencies are resolved manually. Referential integrity
          maintains database consistency through ON DELETE CASCADE for automatic cascade delete, ON
          DELETE SET NULL for nullifying foreign keys, or ON DELETE RESTRICT for blocking deletion
          with dependencies. Choice depends on data model, business requirements, and user
          expectations.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing delete UI involves trade-offs between user control, data protection, compliance
          requirements, and storage costs. Understanding these trade-offs is essential for making
          informed architecture decisions.
        </p>

        <p>
          Soft delete versus hard delete presents recovery versus compliance trade-offs. Soft
          delete retains deleted content with deleted_at timestamp enabling recovery within
          retention period, maintains referential integrity by keeping foreign key relationships
          intact, and supports audit trails for compliance but accumulates storage costs for
          retained data, creates privacy implications from retaining personal data, requires cleanup
          jobs for permanent deletion after retention period, and may confuse users about where
          deleted content goes. Hard delete permanently removes content freeing storage immediately
          and providing clear privacy compliance but prevents any recovery from accidents, creates
          audit trail gaps where history is lost, and requires careful handling of referential
          integrity. The recommendation is soft delete for most user content enabling recovery from
          mistakes, hard delete for GDPR right to erasure requests and sensitive data requiring
          complete removal.
        </p>

        <p>
          Simple versus enhanced confirmation presents usability versus protection trade-offs.
          Simple confirmation uses single dialog with delete and cancel buttons enabling quick
          deletion but risks accidental deletion from misclicks. Enhanced confirmation requires
          typing confirmation phrase like content title or "DELETE" providing strong protection
          against accidents but adds friction frustrating users for routine deletions. The
          recommendation is risk-based confirmation with simple confirmation for low-risk content
          like personal drafts, enhanced confirmation for high-risk content like production data or
          shared resources, and delayed confirmation for critical content providing grace period
          with email cancellation.
        </p>

        <p>
          Immediate versus delayed deletion presents immediacy versus safety trade-offs. Immediate
          deletion executes deletion request right away providing user expectation of immediate
          effect but offers no safety net for accidents or changed decisions. Delayed deletion
          schedules deletion for future date typically 7-30 days sending email confirmation with
          cancel link enabling recovery before execution but content remains in limbo state during
          delay period confusing users and delayed storage freeing may not meet user expectations.
          The recommendation is delayed deletion for high-value content like repositories or
          accounts providing safety net, immediate soft delete with trash recovery for standard
          content balancing immediacy with recovery option.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing delete content UI requires following established best practices to ensure
          user control, data protection, compliance, and recoverability.
        </p>

        <p>
          Confirmation flows prevent accidental deletion through deliberate user action. Use simple
          confirmation dialog for low-risk content with clear warning about consequences. Use
          enhanced confirmation requiring typing confirmation phrase for high-risk content. Use
          delayed confirmation with email cancellation for critical content. Always communicate
          consequences clearly including what content will be deleted, whether recovery is possible,
          how long recovery window lasts, and what happens to related content.
        </p>

        <p>
          Soft delete with recovery enables users to recover from accidental deletion. Set
          appropriate retention period (30 days for consumer, 90 days for enterprise). Provide
          trash or recycle bin interface showing deleted content with restore and permanent delete
          options. Send notification when content is moved to trash with recovery deadline.
          Automatically permanently delete after retention period with notification before permanent
          deletion.
        </p>

        <p>
          Cascading deletes handle dependencies maintaining referential integrity. Detect
          dependencies before deletion showing user what related content will be affected. Offer
          cascade options (delete related, reassign ownership, block deletion) letting user choose
          appropriate handling. Use database constraints (ON DELETE CASCADE, ON DELETE SET NULL, ON
          DELETE RESTRICT) enforcing referential integrity at database level. Log cascading deletes
          for audit trail showing what related content was affected.
        </p>

        <p>
          GDPR compliance honors right to erasure requests. Verify user identity before processing
          deletion request preventing unauthorized deletion. Process deletion within 30 days as
          required by GDPR. Delete all personal data including backups and archives unless legal
          retention requirements apply. Provide deletion confirmation notification to user. Maintain
          audit log of deletion request and completion for compliance documentation.
        </p>

        <p>
          Data retention policies define how long deleted content is retained. Set retention period
          based on content type (30 days for user content, 7 years for financial records, 6 years
          for healthcare data). Communicate retention period to users clearly. Automatically
          permanently delete after retention period expires. Provide admin interface for extending
          retention for legal holds or compliance requirements.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing delete content UI to ensure user control,
          data protection, compliance, and recoverability.
        </p>

        <p>
          No confirmation dialog allows accidental deletion from misclicks. Fix by always showing
          confirmation dialog before deletion with clear warning about consequences. Use enhanced
          confirmation for high-risk content requiring typing confirmation phrase.
        </p>

        <p>
          Hard delete by default prevents any recovery from accidents. Fix by using soft delete as
          default for user content with trash recovery. Reserve hard delete for GDPR requests and
          explicit permanent delete actions.
        </p>

        <p>
          No recovery mechanism leaves users unable to restore accidentally deleted content. Fix by
          implementing trash or recycle bin with restore functionality. Set appropriate retention
          period (30-90 days). Notify users of recovery deadline.
        </p>

        <p>
          Ignoring cascading deletes breaks referential integrity leaving orphaned records. Fix by
          detecting dependencies before deletion. Offer cascade options (delete related, reassign,
          block). Use database constraints enforcing referential integrity.
        </p>

        <p>
          No GDPR compliance risks legal penalties. Fix by implementing right to erasure flow with
          identity verification. Process deletion within 30 days. Delete all personal data including
          backups unless legal retention applies. Document deletion for compliance.
        </p>

        <p>
          Unclear retention policy confuses users about when content is permanently deleted. Fix by
          communicating retention period clearly in delete confirmation and trash interface. Send
          notification before permanent deletion.
        </p>

        <p>
          No audit trail prevents compliance verification and debugging. Fix by logging all
          deletion operations with user identity, timestamp, content ID, and deletion type. Maintain
          logs for compliance period.
        </p>

        <p>
          No cleanup jobs cause storage to grow indefinitely from soft-deleted content. Fix by
          implementing scheduled jobs permanently deleting content after retention period. Monitor
          job success and storage growth.
        </p>

        <p>
          Inconsistent delete behavior across content types confuses users. Fix by standardizing
          delete flow across content types with consistent confirmation, recovery options, and
          retention periods. Document any variations clearly.
        </p>

        <p>
          No permission checks allow unauthorized deletion. Fix by verifying user has delete
          permission before showing delete option and before processing delete request. Log
          unauthorized delete attempts for security monitoring.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Delete content UI is critical for user control and compliance. Here are real-world
          implementations from production systems demonstrating different approaches to deletion
          challenges.
        </p>

        <p>
          Google Drive deletion addresses file and folder deletion with trash recovery and sharing
          implications. The solution uses soft delete moving files to trash with 30-day retention,
          shows confirmation dialog warning about shared file implications, provides trash interface
          with restore and permanent delete options, sends email notification before permanent
          deletion, and handles cascading deletes for folders deleting all contained files. The
          result is user-friendly deletion with safety net from accidents, clear communication
          about shared content impact, and compliance with data retention policies.
        </p>

        <p>
          GitHub repository deletion addresses high-risk deletion with enhanced confirmation and
          recovery. The solution requires typing repository name for confirmation preventing
          accidental deletion, uses soft delete with 90-day recovery window for organization repos,
          sends email notification to all collaborators about deletion, provides admin interface
          for recovery during recovery window, and permanently deletes after recovery period
          expires. The result is strong protection against accidental deletion while enabling
          recovery from mistakes within reasonable window.
        </p>

        <p>
          Apple iCloud deletion addresses account and data deletion with GDPR compliance. The
          solution uses delayed deletion scheduling account deletion for 30 days in future, sends
          weekly email reminders with cancellation link during delay period, permanently deletes
          all data including backups after delay period, provides identity verification before
          processing deletion request, and generates compliance documentation for deletion request
          and completion. The result is GDPR-compliant deletion with safety net from accidents
          through delay period and email cancellation.
        </p>

        <p>
          Salesforce record deletion addresses enterprise data with cascading deletes and audit
          trails. The solution detects dependencies before deletion showing related records, offers
          cascade options (delete related, reassign ownership, block), uses soft delete with
          recycle bin for 30 days, maintains comprehensive audit trail of who deleted what when,
          and enforces permission checks at multiple levels. The result is enterprise-grade deletion
          maintaining referential integrity, comprehensive audit trails, and appropriate permission
          enforcement.
        </p>

        <p>
          WordPress post deletion addresses content management with trash recovery. The solution
          moves posts to trash with 30-day retention, shows trash count in admin interface, provides
          bulk delete from trash for permanent deletion, restores posts to original status and
          publication date, and automatically permanently deletes after 30 days. The result is
          simple deletion workflow with recovery option protecting from accidents while maintaining
          clean admin interface.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of delete content UI design, implementation, and
          compliance concerns for staff and principal engineer interviews.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement soft delete?</p>
            <p className="mt-2 text-sm">
              A: Add deleted_at timestamp and is_deleted boolean flag to content table. Update
              delete operation to set deleted_at = NOW() and is_deleted = true instead of removing
              record. Filter queries with WHERE is_deleted = false for normal views. Provide trash
              interface querying WHERE is_deleted = true with restore and permanent delete options.
              Implement cleanup job permanently deleting where deleted_at &lt; NOW() - INTERVAL '30
              days'.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cascading deletes?</p>
            <p className="mt-2 text-sm">
              A: Detect dependencies before deletion by querying related content through foreign key
              relationships. Show user what related content will be affected. Offer cascade options
              (delete related content recursively, reassign ownership to different owner, block
              deletion until dependencies resolved). Use database constraints (ON DELETE CASCADE, ON
              DELETE SET NULL, ON DELETE RESTRICT) enforcing referential integrity. Log cascading
              deletes for audit trail.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement GDPR right to erasure?</p>
            <p className="mt-2 text-sm">
              A: Provide deletion request interface with identity verification (password, 2FA, or
              email confirmation). Process deletion within 30 days as required by GDPR. Delete all
              personal data including backups and archives unless legal retention requirements
              apply. Send deletion confirmation notification to user. Maintain audit log of deletion
              request and completion for compliance documentation. Handle exceptions for data
              required for legal claims or regulatory requirements.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design confirmation flows?</p>
            <p className="mt-2 text-sm">
              A: Use risk-based confirmation with simple dialog for low-risk content (delete and
              cancel buttons), enhanced confirmation requiring typing confirmation phrase for
              high-risk content, and delayed confirmation scheduling deletion for future date with
              email cancellation for critical content. Always communicate consequences clearly
              including what content will be deleted, whether recovery is possible, how long
              recovery window lasts, and what happens to related content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement recovery mechanisms?</p>
            <p className="mt-2 text-sm">
              A: Provide trash or recycle bin interface showing deleted content with restore and
              permanent delete options. Set retention period (30 days for consumer, 90 days for
              enterprise). Store recovery metadata (who deleted, when deleted, original location).
              Send notification when content moved to trash with recovery deadline. Restore content
              to original location or designated recovery folder. Automatically permanently delete
              after retention period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle data retention policies?</p>
            <p className="mt-2 text-sm">
              A: Define retention period per content type (30 days for user content, 7 years for
              financial records, 6 years for healthcare data). Communicate retention period to
              users clearly in delete confirmation and trash interface. Implement scheduled cleanup
              jobs permanently deleting content after retention period expires. Provide admin
              interface for extending retention for legal holds or compliance requirements. Monitor
              job success and storage growth.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent unauthorized deletion?</p>
            <p className="mt-2 text-sm">
              A: Verify user has delete permission before showing delete option in UI. Check
              permission again on backend before processing delete request. Use resource-level
              permissions checking user owns content or has explicit delete permission. Log
              unauthorized delete attempts for security monitoring. Require re-authentication for
              high-risk deletions like account deletion or bulk operations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement delayed deletion?</p>
            <p className="mt-2 text-sm">
              A: Schedule deletion for future date (7-30 days) instead of executing immediately.
              Store scheduled deletion timestamp in database. Send email confirmation with
              cancellation link enabling user to cancel before execution. Run scheduled job
              processing pending deletions where scheduled_at &lt;= NOW(). Send reminder emails
              during delay period. Execute deletion after delay period expires unless cancelled.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you maintain audit trails for deletion?</p>
            <p className="mt-2 text-sm">
              A: Log all deletion operations with user identity, timestamp, content ID, deletion
              type (soft/hard), and reason if provided. Store logs in separate audit table with
              immutable records. Maintain logs for compliance period (7 years for financial, 6
              years for healthcare). Provide admin interface for querying audit logs. Include
              cascading delete information showing what related content was affected.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://gdpr.eu/right-to-be-forgotten/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GDPR Right to Erasure
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Data_Protection_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Data Protection Cheat Sheet
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
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Security"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN - Web Security
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Input Validation Cheat Sheet
            </a>
          </li>
          <li>
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Logging Cheat Sheet
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
