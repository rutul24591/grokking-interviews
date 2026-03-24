"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-backend-soft-delete",
  title: "Soft Delete",
  description:
    "Comprehensive guide to implementing soft delete covering deletion patterns (deleted_at column, is_deleted flag), recovery workflows, data retention policies, hard delete for GDPR compliance, cascade delete handling, audit trails, and storage optimization for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "soft-delete",
  version: "extensive",
  wordCount: 9500,
  readingTime: 38,
  lastUpdated: "2026-03-23",
  tags: [
    "requirements",
    "functional",
    "content",
    "soft-delete",
    "backend",
    "retention",
    "gdpr",
  ],
  relatedTopics: ["content-lifecycle", "data-retention", "audit-logging"],
};

export default function SoftDeleteArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Soft Delete</strong> marks content as deleted without removing it from the
          database enabling recovery, maintaining referential integrity, and supporting audit
          requirements. Unlike hard delete which permanently removes data, soft delete retains
          deleted records with a deletion marker (deleted_at timestamp or is_deleted flag) enabling
          recovery from accidental deletion, maintaining foreign key relationships, and providing
          audit trail of deletions. Soft delete is critical for production systems where data loss
          is unacceptable and compliance requires deletion audit trails.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/soft-delete-flow.svg"
          alt="Soft Delete Flow"
          caption="Soft Delete Flow — showing soft delete with deleted_at timestamp, recovery window, hard delete after retention period, and audit trail"
        />

        <p>
          For staff and principal engineers, implementing soft delete requires deep understanding of
          deletion patterns including deleted_at column approach (timestamp when deleted, NULL for
          active records, NOT NULL for deleted records), is_deleted flag approach (boolean flag
          simpler but less information), and tombstone approach (separate deleted records table).
          Recovery workflows enable restoring deleted content through undelete operations within
          retention period. Data retention policies define how long soft-deleted records are retained
          before permanent deletion balancing recovery capability with storage costs. Hard delete for
          GDPR compliance permanently removes personal data when required by right to erasure
          requests. Cascade delete handling manages related records through cascade soft delete
          (mark all related as deleted), orphan approach (leave related records active), or block
          approach (prevent delete if has children). Audit trails track all deletions with who when
          and why for compliance. Storage optimization through partitioning deleted records and
          archiving old deleted data reduces storage costs. The implementation must balance recovery
          capability with storage costs and compliance requirements.
        </p>

        <p>
          Modern soft delete implementations have evolved from simple boolean flags to sophisticated
          retention management with automated cleanup and compliance handling. Platforms like
          Salesforce use soft delete with recycle bin enabling recovery within 30 days, GitHub uses
          soft delete for repositories with recovery window, and enterprise systems use soft delete
          with audit trails for compliance. GDPR compliance has driven hybrid approaches with soft
          delete for operational recovery and hard delete for GDPR right to erasure requests.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Soft delete is built on fundamental concepts that determine how deletion is tracked,
          recovered, and managed. Understanding these concepts is essential for designing effective
          deletion systems.
        </p>

        <p>
          <strong>Deletion Patterns:</strong> Deleted_at column approach uses TIMESTAMP WITH
          TIMEZONE column where NULL indicates active record and NOT NULL indicates deleted record
          with timestamp of deletion. This approach provides deletion timestamp for audit and
          retention calculations. Is_deleted flag approach uses BOOLEAN column where false indicates
          active and true indicates deleted. This approach is simpler but lacks deletion timestamp.
          Tombstone approach uses separate deleted records table moving deleted records to separate
          table enabling efficient active queries while retaining deleted records for recovery and
          audit.
        </p>

        <p>
          <strong>Recovery Workflows:</strong> Undelete operation restores soft-deleted records by
          setting deleted_at to NULL or is_deleted to false within retention period. Recovery
          interface enables users to view and restore their deleted content through trash or recycle
          bin interface. Admin recovery enables administrators to restore any deleted content
          through admin interface with audit logging. Cascade recovery restores related records
          when restoring parent record maintaining referential integrity.
        </p>

        <p>
          <strong>Data Retention:</strong> Retention period defines how long soft-deleted records
          are retained before permanent deletion typically 30-90 days for user content enabling
          recovery from accidental deletion. Compliance retention retains records longer for
          regulatory requirements (7 years for financial, 6 years for healthcare). Storage
          optimization through partitioning deleted records into separate partitions and archiving
          old deleted data to cheaper storage reduces storage costs while retaining recovery
          capability.
        </p>

        <p>
          <strong>GDPR Compliance:</strong> Hard delete permanently removes personal data when
          required by GDPR right to erasure requests overriding soft delete retention. Selective
          hard delete removes personal data while retaining anonymized data for analytics. Audit
          logging tracks GDPR deletion requests with who when and why for compliance demonstration.
          Retention policies must balance GDPR requirements with operational needs through
          configurable retention periods.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Soft delete architecture separates deletion logic, recovery workflows, retention
          management, and compliance handling enabling modular implementation with clear boundaries.
          This architecture is critical for data integrity, recovery capability, and compliance.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/soft-delete-flow.svg"
          alt="Soft Delete Flow"
          caption="Soft Delete Flow — showing soft delete with deleted_at timestamp, recovery window, hard delete after retention period, and audit trail"
        />

        <p>
          Soft delete flow begins with user or system initiating delete operation. Application
          validates delete permission ensuring user has right to delete content. Instead of DELETE
          SQL statement, application executes UPDATE setting deleted_at to current timestamp or
          is_deleted to true. Cascade delete handles related records through cascade soft delete
          (update all related records), orphan approach (leave related records active), or block
          approach (prevent delete if has children). Delete operation is logged to audit trail with
          user identity, timestamp, and reason. Deleted content becomes invisible to normal queries
          through default scope filtering WHERE deleted_at IS NULL. Deleted content remains
          recoverable through recovery interface within retention period. After retention period
          expires, cleanup job permanently deletes records through hard delete.
        </p>

        <p>
          Recovery workflow architecture includes recovery interface (trash or recycle bin) showing
          user's deleted content with restore and permanent delete options. Undelete operation
          validates retention period ensuring content is within recovery window then sets deleted_at
          to NULL restoring content. Cascade recovery restores related records maintaining
          referential integrity. Recovery is logged to audit trail for compliance.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/delete-retention.svg"
          alt="Data Retention Policies"
          caption="Data Retention — showing retention periods by content type, automated cleanup, and GDPR hard delete"
        />

        <p>
          Retention management architecture includes retention policies defining retention period
          per content type (30 days for user content, 7 years for financial records, 6 years for
          healthcare). Cleanup job runs periodically (daily or weekly) identifying soft-deleted
          records beyond retention period through WHERE deleted_at &lt; NOW() - INTERVAL '30 days'.
          Hard delete permanently removes identified records through DELETE SQL statement. GDPR
          handler processes right to erasure requests through immediate hard delete overriding
          retention period. All deletions logged to audit trail for compliance.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Designing soft delete involves trade-offs between recovery capability, storage costs,
          query complexity, and compliance. Understanding these trade-offs is essential for making
          informed architecture decisions.
        </p>

        <p>
          Soft delete versus hard delete presents recovery versus storage trade-offs. Soft delete
          retains deleted records enabling recovery from accidental deletion, maintaining
          referential integrity, and providing audit trail but consumes storage for deleted records
          requiring cleanup jobs and complicates queries through scope filtering. Hard delete
          permanently removes records freeing storage immediately, simplifies queries with no
          filtering, and meets GDPR right to erasure but prevents recovery from mistakes, breaks
          referential integrity with orphaned related records, and loses audit trail. The
          recommendation is soft delete for operational data requiring recovery capability, hard
          delete for temporary or regenerated data, and hybrid approach with soft delete for
          recovery window followed by hard delete after retention period.
        </p>

        <p>
          Deleted_at column versus is_deleted flag presents information versus simplicity trade-offs.
          Deleted_at column provides deletion timestamp enabling retention calculations and audit
          trail with exact deletion time but uses more storage (8 bytes for timestamp) and requires
          timezone handling. Is_deleted flag is simpler using less storage (1 byte for boolean)
          with no timezone concerns but lacks deletion timestamp requiring separate audit log for
          deletion time. The recommendation is deleted_at column for production systems requiring
          retention management and audit, is_deleted flag for simple use cases where deletion time
          is not critical.
        </p>

        <p>
          Cascade soft delete versus orphan approach presents consistency versus flexibility
          trade-offs. Cascade soft delete marks all related records as deleted maintaining
          referential integrity and consistent state but deletes more data than intended potentially
          removing records user didn't intend to delete. Orphan approach leaves related records
          active preserving data but creates orphaned records with broken foreign key relationships
          and inconsistent state. The recommendation is cascade soft delete for parent-child
          relationships where children have no meaning without parent (blog post → comments),
          orphan approach for relationships where related records have independent meaning (user →
          orders where orders must be retained for compliance).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implementing soft delete requires following established best practices to ensure data
          integrity, recovery capability, compliance, and storage efficiency.
        </p>

        <p>
          Deletion pattern uses deleted_at column (TIMESTAMP WITH TIMEZONE) for production systems
          requiring retention management. Implement default scope filtering WHERE deleted_at IS NULL
          for all queries preventing accidental access to deleted records. Provide scope overrides
          (withDeleted, onlyDeleted) for admin and recovery interfaces. Index deleted_at column for
          efficient scope filtering and cleanup queries.
        </p>

        <p>
          Recovery workflow provides trash or recycle bin interface showing user's deleted content
          with restore and permanent delete options. Validate retention period before restore
          ensuring content is within recovery window. Implement cascade recovery restoring related
          records maintaining referential integrity. Log all recovery operations to audit trail.
        </p>

        <p>
          Retention management configures retention period per content type (30-90 days for user
          content, 7 years for financial, 6 years for healthcare). Implement cleanup job running
          periodically (daily or weekly) identifying and hard deleting records beyond retention
          period. Partition deleted records into separate partitions for efficient cleanup. Archive
          old deleted data to cheaper storage reducing costs while retaining recovery capability.
        </p>

        <p>
          GDPR compliance implements hard delete handler processing right to erasure requests
          through immediate permanent deletion overriding retention period. Log all GDPR deletions
          to audit trail with request details for compliance demonstration. Implement selective hard
          delete removing personal data while retaining anonymized data for analytics where
          permitted.
        </p>

        <p>
          Cascade delete handling configures cascade rules per relationship type. Use cascade soft
          delete for parent-child relationships where children have no meaning without parent. Use
          orphan approach for relationships where related records have independent meaning and must
          be retained. Use block approach preventing delete if has children for critical
          relationships. Document cascade rules for each relationship.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing soft delete to ensure data integrity,
          recovery capability, compliance, and storage efficiency.
        </p>

        <p>
          No default scope allows queries to return deleted records causing data inconsistency. Fix
          by implementing default scope filtering WHERE deleted_at IS NULL for all models. Use ORM
          scopes or database views enforcing filtering. Provide explicit scope overrides for admin
          and recovery interfaces.
        </p>

        <p>
          No retention policy causes storage to grow indefinitely with deleted records. Fix by
          configuring retention period per content type. Implement cleanup job identifying and hard
          deleting records beyond retention period. Monitor deleted record count and storage usage.
        </p>

        <p>
          No cascade handling leaves orphaned related records causing data inconsistency. Fix by
          configuring cascade rules per relationship. Use cascade soft delete for parent-child
          relationships. Use orphan approach for independent relationships. Document cascade rules.
        </p>

        <p>
          No recovery interface prevents users from recovering accidentally deleted content. Fix by
          providing trash or recycle bin interface showing user's deleted content. Enable restore
          and permanent delete options. Validate retention period before restore.
        </p>

        <p>
          No GDPR compliance prevents honoring right to erasure requests. Fix by implementing hard
          delete handler for GDPR requests overriding retention period. Log all GDPR deletions for
          compliance. Implement selective hard delete removing personal data while retaining
          anonymized data.
        </p>

        <p>
          No audit trail prevents tracking deletions for compliance. Fix by logging all delete and
          recovery operations with user identity, timestamp, and reason. Retain audit logs for
          compliance period (7 years for regulated industries). Provide audit report generation.
        </p>

        <p>
          No indexing on deleted_at causes slow queries. Fix by indexing deleted_at column for
          efficient scope filtering. Include deleted_at in composite indexes for common query
          patterns. Monitor query performance optimizing indexes.
        </p>

        <p>
          No storage optimization causes high storage costs for deleted records. Fix by partitioning
          deleted records into separate partitions. Archive old deleted data to cheaper storage.
          Monitor storage usage optimizing retention periods.
        </p>

        <p>
          No unique constraint handling causes unique constraint violations on soft-deleted records.
          Fix by including deleted_at in unique constraints (UNIQUE (email, deleted_at)) enabling
          reuse of values after deletion. Or use partial unique indexes (UNIQUE (email) WHERE
          deleted_at IS NULL).
        </p>

        <p>
          No cascade recovery breaks referential integrity when restoring records. Fix by
          implementing cascade recovery restoring related records when restoring parent. Validate
          related records exist before restore. Log cascade recovery to audit trail.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          Soft delete is critical for data integrity across different domains. Here are real-world
          implementations from production systems demonstrating different approaches to deletion
          challenges.
        </p>

        <p>
          Salesforce deletion addresses CRM data recovery with recycle bin. The solution uses
          soft delete with deleted_at timestamp, recycle bin interface showing deleted records for
          30 days, restore and permanent delete options, cascade soft delete for related records,
          and hard delete after 30 days. The result is data recovery capability preventing
          accidental data loss with compliance through audit trail.
        </p>

        <p>
          GitHub repository deletion addresses repository recovery with soft delete. The solution
          uses soft delete with deleted_at timestamp, recovery window of 90 days for organization
          repositories, admin recovery interface, cascade soft delete for related issues and pull
          requests, and hard delete after recovery window. The result is repository recovery
          capability preventing accidental repository loss.
        </p>

        <p>
          Enterprise deletion (SAP) addresses compliance requirements with audit trails. The
          solution uses soft delete with deleted_at timestamp, retention period based on content
          type (7 years for financial, 6 years for HR), audit trail logging all deletions with who
          when and why, GDPR hard delete handler for right to erasure requests, and automated
          cleanup after retention period. The result is compliance with regulatory requirements
          while enabling operational recovery.
        </p>

        <p>
          E-commerce deletion (Shopify) addresses order retention for compliance. The solution uses
          soft delete for products and collections with 30-day recovery window, hard delete for
          customer data on GDPR request, retention of orders for 7 years for financial compliance,
          and cascade soft delete for product variants. The result is compliance with financial
          regulations while enabling product recovery.
        </p>

        <p>
          Healthcare deletion (Epic) addresses HIPAA compliance with retention. The solution uses
          soft delete with deleted_at timestamp, 6-year retention for patient records per HIPAA
          requirements, audit trail for all deletions, GDPR hard delete for patient right to
          erasure where permitted, and archive old deleted data to cheaper storage. The result is
          HIPAA compliance with operational recovery capability.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>
          These questions test understanding of soft delete design, implementation, and compliance
          concerns for staff and principal engineer interviews.
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement soft delete?</p>
            <p className="mt-2 text-sm">
              A: Add deleted_at column (TIMESTAMP WITH TIMEZONE) to table. Implement default scope
              filtering WHERE deleted_at IS NULL for all queries. Provide scope overrides
              (withDeleted, onlyDeleted) for admin interfaces. Index deleted_at for efficient
              filtering. Update delete operation to UPDATE setting deleted_at instead of DELETE.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement recovery?</p>
            <p className="mt-2 text-sm">
              A: Provide trash or recycle bin interface showing user's deleted content. Validate
              retention period before restore ensuring content is within recovery window. Execute
              undelete operation setting deleted_at to NULL. Implement cascade recovery restoring
              related records. Log recovery to audit trail.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle retention?</p>
            <p className="mt-2 text-sm">
              A: Configure retention period per content type (30-90 days for user content, 7 years
              for financial). Implement cleanup job running periodically identifying records beyond
              retention period (WHERE deleted_at &lt; NOW() - INTERVAL '30 days'). Hard delete
              identified records. Monitor deleted record count and storage usage.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle GDPR compliance?</p>
            <p className="mt-2 text-sm">
              A: Implement hard delete handler processing right to erasure requests through
              immediate permanent deletion overriding retention period. Log all GDPR deletions to
              audit trail with request details. Implement selective hard delete removing personal
              data while retaining anonymized data where permitted.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cascade delete?</p>
            <p className="mt-2 text-sm">
              A: Configure cascade rules per relationship type. Use cascade soft delete for
              parent-child relationships where children have no meaning without parent (post →
              comments). Use orphan approach for independent relationships (user → orders). Use
              block approach preventing delete if has children for critical relationships. Document
              cascade rules.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle unique constraints?</p>
            <p className="mt-2 text-sm">
              A: Include deleted_at in unique constraints (UNIQUE (email, deleted_at)) enabling
              reuse of values after deletion. Or use partial unique indexes (UNIQUE (email) WHERE
              deleted_at IS NULL). This allows deleted records to have same values as new records.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize storage?</p>
            <p className="mt-2 text-sm">
              A: Partition deleted records into separate partitions for efficient cleanup. Archive
              old deleted data to cheaper storage reducing costs. Monitor storage usage optimizing
              retention periods. Use compression for archived deleted data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement audit trail?</p>
            <p className="mt-2 text-sm">
              A: Log all delete and recovery operations with user identity, timestamp, and reason.
              Store audit logs in separate table for compliance. Retain logs for compliance period
              (7 years for regulated industries). Provide audit report generation for compliance
              audits.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle soft delete in queries?</p>
            <p className="mt-2 text-sm">
              A: Implement default scope filtering WHERE deleted_at IS NULL for all queries through
              ORM scopes or database views. Provide explicit scope overrides (withDeleted,
              onlyDeleted) for admin and recovery interfaces. Index deleted_at for efficient
              filtering. Include deleted_at in composite indexes for common query patterns.
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
              href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OWASP Logging Cheat Sheet
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
              href="https://en.wikipedia.org/wiki/Soft_delete"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Soft Delete (Wikipedia)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
