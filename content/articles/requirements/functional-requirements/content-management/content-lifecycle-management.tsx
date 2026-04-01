"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cm-content-lifecycle-management",
  title: "Content Lifecycle Management",
  description:
    "Comprehensive guide to implementing content lifecycle management covering creation, review, publication, maintenance, archival, and deletion stages with automation, retention policies, and compliance patterns for staff/principal engineer interviews.",
  category: "functional-requirements",
  subcategory: "content-management",
  slug: "content-lifecycle-management",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "content",
    "lifecycle",
    "backend",
    "retention",
    "compliance",
  ],
  relatedTopics: ["publishing-workflow", "soft-delete", "content-moderation", "data-retention"],
};

export default function ContentLifecycleManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Content Lifecycle Management governs content from initial creation through eventual archival or deletion, ensuring proper handling, compliance, and cost management at each stage. Every piece of content has a lifecycle—blog posts are drafted, reviewed, published, updated, and eventually archived or deleted. User-generated content is created, moderated, published, and may be removed for policy violations. Product listings are created, published, updated with inventory changes, and discontinued. For platforms managing large content volumes, lifecycle management is essential for compliance (legal retention requirements), cost control (storage costs for archived content), and content quality (keeping content fresh and relevant).
        </p>
        <p>
          For staff and principal engineers, content lifecycle architecture involves lifecycle stages (creation, review, publication, maintenance, archival, deletion), automation (workflow triggers, scheduled actions), retention policies (legal requirements, business rules), archival strategies (cold storage, reduced availability), deletion patterns (soft delete, hard delete, data erasure), and compliance (GDPR right to erasure, industry regulations). The implementation must balance competing priorities: user access to historical content versus storage costs, legal retention requirements versus privacy rights, automation efficiency versus human oversight. Poor lifecycle management leads to compliance violations, excessive storage costs, stale content degrading user experience, and inability to meet legal discovery requirements.
        </p>
        <p>
          The complexity of content lifecycle extends beyond simple state transitions. Retention policies vary by content type (financial records: 7 years, user posts: indefinite until deleted, temporary content: 30 days). Archival strategies balance accessibility with cost (hot storage for recent content, cold storage for archived). Deletion must handle dependencies (content with comments, shares, backlinks). Compliance requirements vary by jurisdiction (GDPR right to erasure, HIPAA retention for medical content, SEC requirements for financial content). For staff engineers, lifecycle management is a content governance decision affecting compliance, costs, and long-term platform sustainability.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Lifecycle Stages and Transitions</h3>
        <p>
          Creation stage encompasses content authoring and initial state. Draft state for work-in-progress content (not visible to public). Version control tracks changes during creation (version 1, 2, 3). Collaboration features enable multiple authors (comments, suggestions, co-authoring). Auto-save prevents data loss (save every 30 seconds). Metadata captured at creation (author, created date, content type, initial tags). Creation stage focuses on enabling efficient content authoring with appropriate safeguards (auto-save, versioning).
        </p>
        <p>
          Review stage ensures content quality before publication. Moderation queue holds content awaiting review (user-generated content). Approval workflow routes content to appropriate reviewers (editor, legal, compliance). Edit requests enable reviewers to request changes (comment on specific sections). Rejection with reason provides feedback to authors (why content was rejected). Review stage balances quality assurance with throughput (don&apos;t bottleneck content publication).
        </p>
        <p>
          Publication stage makes content visible to users. Live state (content visible to public). Indexed for search (added to search index). Distributed via CDN (cached at edge locations). Notified to subscribers (email, push notifications for new content). Publication triggers downstream actions (search indexing, CDN distribution, notifications). Publication is the transition from private to public content.
        </p>
        <p>
          Maintenance stage manages published content over time. Updates and edits (fix typos, update information). Version history (track changes over time). Content freshness monitoring (identify stale content). Performance monitoring (track views, engagement). Maintenance ensures content remains accurate, relevant, and performant throughout its active life.
        </p>
        <p>
          Archival stage moves content to reduced availability. Archived state (content not visible in normal browsing, accessible via direct link or search). Cold storage (moved to cheaper storage tier). Reduced indexing (removed from main search index, accessible via archive search). Retention period (archived content kept for X years). Archival balances preservation with cost—content is kept but doesn&apos;t consume expensive active storage.
        </p>
        <p>
          Deletion stage removes content permanently. Soft delete (marked as deleted, recoverable for X days). Hard delete (permanently removed from database). Data erasure (secure deletion, overwriting storage). Dependency handling (what happens to comments, shares, backlinks). Deletion must comply with retention policies (can&apos;t delete content under legal hold) and privacy rights (GDPR right to erasure).
        </p>

        <h3 className="mt-6">Retention Policies</h3>
        <p>
          Legal retention requirements mandate minimum retention periods. Financial records (7 years for tax purposes). Medical records (HIPAA requires 6 years minimum). Employment records (3-7 years depending on jurisdiction). Legal hold (preserve content relevant to litigation). Legal requirements take precedence over business preferences—content must be retained regardless of business desire to delete.
        </p>
        <p>
          Business retention rules define how long content is valuable. User-generated content (indefinite until user deletes or policy violation). Blog posts (indefinite, but may be archived after 2 years). Product listings (until product discontinued, then archived). Temporary content (30-90 days, then auto-delete). Business rules balance content value with storage costs.
        </p>
        <p>
          User-controlled retention enables users to manage their content. User deletion (user can delete their own content). Account deletion (all user content deleted on account closure). Data export (user can download their content before deletion). Retention preferences (user can set content to auto-delete after X time). User-controlled retention is increasingly required by regulations (GDPR, CCPA) and expected by users.
        </p>
        <p>
          Retention enforcement automates policy application. Scheduled jobs identify content past retention date. Automated archival (move to cold storage). Automated deletion (delete content past retention). Exception handling (legal hold overrides automatic deletion). Enforcement ensures policies are consistently applied without manual intervention.
        </p>

        <h3 className="mt-6">Archival Strategies</h3>
        <p>
          Storage tiering moves content to appropriate storage based on access patterns. Hot storage (SSD, frequently accessed content, expensive). Warm storage (HDD, occasionally accessed, moderate cost). Cold storage (tape or object archive, rarely accessed, cheap). Tiering reduces costs by moving infrequently accessed content to cheaper storage. Access patterns determine tier (content not accessed in 90 days → warm, 1 year → cold).
        </p>
        <p>
          Archival formats preserve content for long-term storage. Standard formats (PDF/A for documents, JPEG for images, MP4 for video). Format migration (convert obsolete formats to current standards). Metadata preservation (retain author, date, context with archived content). Integrity verification (checksums to detect corruption). Archival formats ensure content remains accessible decades later.
        </p>
        <p>
          Archive accessibility balances cost with retrieval needs. On-demand retrieval (archived content retrieved when requested, takes minutes to hours). Pre-fetch (predict what will be needed, retrieve in advance). Access tiers (some archives more accessible than others). Retrieval costs (charged for accessing archived content). Accessibility decisions affect user experience (how quickly can archived content be retrieved) and costs (retrieval fees).
        </p>

        <h3 className="mt-6">Deletion Patterns</h3>
        <p>
          Soft delete marks content as deleted without removing data. Deleted flag (is_deleted = true). Hidden from users (not shown in queries). Recoverable (undelete within retention window). Audit trail (who deleted, when, why). Soft delete provides safety net against accidental deletion, enables recovery, and maintains audit trail.
        </p>
        <p>
          Hard delete permanently removes content from database. Data deletion (rows removed from database). Index removal (removed from search index). Cache invalidation (removed from cache). Backup handling (deleted from future backups, may exist in old backups). Hard delete is necessary for compliance (GDPR right to erasure) and cost control (actually free storage).
        </p>
        <p>
          Secure deletion ensures data cannot be recovered. Overwriting (write random data to storage location). Crypto-shredding (delete encryption key, rendering data unreadable). Physical destruction (for sensitive data on physical media). Verification (confirm deletion was successful). Secure deletion is required for sensitive data (PII, financial, medical) and compliance (some regulations specify secure deletion methods).
        </p>
        <p>
          Dependency handling manages content relationships on deletion. Cascading delete (delete comments when post deleted). Orphan prevention (prevent deletion if content has dependencies). Reassignment (reassign comments to different content). Notification (notify users of dependent content deletion). Dependency handling prevents broken references and maintains data integrity.
        </p>

        <h3 className="mt-6">Automation and Workflows</h3>
        <p>
          Workflow automation triggers actions based on events and schedules. Event triggers (content published → index, notify). Scheduled jobs (nightly archival, weekly deletion). Conditional logic (if content type = temporary, delete after 30 days). Escalation (if content in review &gt; 7 days, escalate to manager). Automation reduces manual work and ensures consistent lifecycle management.
        </p>
        <p>
          State machine manages lifecycle transitions. Defined states (draft, review, published, archived, deleted). Valid transitions (draft → review → published, published → archived → deleted). Transition guards (can&apos;t delete content under legal hold). State persistence (track current state, transition history). State machine ensures content follows valid lifecycle paths.
        </p>
        <p>
          Notification system alerts stakeholders of lifecycle events. Author notifications (content approved, rejected, scheduled for archival). Reviewer notifications (content awaiting review). Admin notifications (retention policy violations, legal holds). User notifications (your content will be archived/deleted). Notifications keep stakeholders informed and enable timely action.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Content lifecycle architecture spans lifecycle service, retention policy engine, archival system, and deletion service. Lifecycle service manages state transitions and workflows. Retention policy engine evaluates and enforces retention rules. Archival system handles storage tiering and archive management. Deletion service manages soft delete, hard delete, and secure deletion. Each component has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/lifecycle-stages.svg"
          alt="Lifecycle Stages"
          caption="Figure 1: Lifecycle Stages — Creation, review, publication, maintenance, archival, and deletion flow"
          width={1000}
          height={500}
        />

        <h3>Lifecycle Service</h3>
        <p>
          Lifecycle service orchestrates content through lifecycle stages. State management tracks current state for each content item. Transition validation ensures only valid transitions occur (can&apos;t go from deleted to published). Workflow execution triggers appropriate actions at each transition (publish → index, notify). Event publishing notifies other systems of lifecycle changes (content published event, content archived event). Lifecycle service is the central coordinator for content lifecycle.
        </p>
        <p>
          Lifecycle API provides programmatic access to lifecycle operations. State transitions (transition content from draft to review). Bulk operations (archive multiple content items). Status queries (get current state, transition history). Webhook subscriptions (notify external systems of lifecycle events). API enables integration with external systems and automation.
        </p>

        <h3 className="mt-6">Retention Policy Engine</h3>
        <p>
          Retention policy engine evaluates and enforces retention rules. Policy storage persists retention rules (by content type, jurisdiction, business unit). Rule evaluation determines applicable retention period (financial content in EU = 7 years). Legal hold management (preserve content under legal hold, override automatic deletion). Compliance reporting (report on retention compliance, upcoming deletions). Policy engine ensures content is retained appropriately for legal and business requirements.
        </p>
        <p>
          Retention scheduling automates retention enforcement. Scheduled evaluation (nightly job evaluates content against retention policies). Action queuing (queue archival/deletion actions). Exception handling (skip content under legal hold). Audit logging (log retention actions for compliance). Scheduling ensures retention policies are consistently enforced without manual intervention.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/lifecycle-workflow.svg"
          alt="Lifecycle Workflow"
          caption="Figure 2: Lifecycle Workflow — Automated transitions, retention evaluation, and archival/deletion"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Archival System</h3>
        <p>
          Archival system manages storage tiering and archive operations. Tier management moves content between storage tiers (hot → warm → cold). Archive packaging prepares content for long-term storage (format conversion, metadata preservation). Retrieval handling manages archived content access requests. Cost tracking monitors archival costs (storage, retrieval fees). Archival system balances preservation with cost efficiency.
        </p>
        <p>
          Archive metadata preserves context for archived content. Original metadata (author, date, content type). Lifecycle history (when published, archived, why). Access history (who accessed, when). Retention info (when eligible for deletion). Metadata ensures archived content remains understandable and manageable over time.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/retention-deletion.svg"
          alt="Retention and Deletion Flow"
          caption="Figure 3: Retention and Deletion Flow — Policy evaluation, legal hold check, and secure deletion"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Content lifecycle design involves trade-offs between retention and cost, accessibility and archival savings, and automation and human oversight. Understanding these trade-offs enables informed decisions aligned with compliance requirements and business priorities.
        </p>

        <h3>Retention: Long vs. Short</h3>
        <p>
          Long retention (keep content indefinitely or for many years). Pros: Historical record preserved (content available for reference), legal compliance (meet retention requirements), user expectation (content they created still available). Cons: High storage costs (accumulating content over years), compliance risk (may retain content that should be deleted), discovery burden (more content to search through). Best for: Legal requirements, historical archives, user-generated content platforms.
        </p>
        <p>
          Short retention (delete content after brief period). Pros: Low storage costs (content doesn&apos;t accumulate), reduced compliance risk (less data to protect), focused content (only current/relevant content). Cons: Historical loss (content unavailable for reference), user frustration (content disappears), potential legal issues (may delete content that should be retained). Best for: Temporary content, ephemeral platforms, cost-sensitive deployments.
        </p>
        <p>
          Hybrid: tiered retention based on content type and age. Pros: Best of both (important content retained, unimportant deleted). Cons: Complexity (multiple retention rules), requires content classification. Best for: Most platforms—retain important content, delete temporary content.
        </p>

        <h3>Archival: Accessible vs. Cost-Effective</h3>
        <p>
          Highly accessible archive (fast retrieval, online access). Pros: Good user experience (archived content quickly available), operational flexibility (can access archives easily). Cons: High cost (online storage expensive), less cost savings (archive doesn&apos;t reduce costs much). Best for: Frequently accessed archives, compliance requiring quick retrieval.
        </p>
        <p>
          Cost-effective archive (slow retrieval, offline storage). Pros: Low cost (cold storage cheap), significant savings (archive reduces costs). Cons: Poor user experience (retrieval takes hours/days), operational burden (retrieval process). Best for: Rarely accessed archives, long-term preservation, cost-sensitive deployments.
        </p>
        <p>
          Hybrid: tiered archive with varying accessibility. Pros: Best of both (recent archives accessible, old archives cheap). Cons: Complexity (multiple archive tiers), requires access pattern analysis. Best for: Most platforms—recent archives accessible, older archives in cold storage.
        </p>

        <h3>Deletion: Automated vs. Manual</h3>
        <p>
          Automated deletion (system deletes based on policies). Pros: Consistent enforcement (policies applied uniformly), low operational overhead (no manual work), cost control (content actually deleted). Cons: Risk of errors (wrong content deleted), user frustration (content disappears unexpectedly), compliance risk (may delete content under legal hold). Best for: Clear retention policies, temporary content, high-volume platforms.
        </p>
        <p>
          Manual deletion (humans review before deletion). Pros: Human judgment (catch edge cases), user control (users decide when to delete), reduced errors (humans verify before deletion). Cons: Operational overhead (requires staff), inconsistent enforcement (different humans decide differently), cost (content accumulates waiting for review). Best for: Sensitive content, legal requirements for human review.
        </p>
        <p>
          Hybrid: automated with manual override and notification. Pros: Best of both (automation with human safety net). Cons: Complexity (both systems), requires notification infrastructure. Best for: Most platforms—automate routine deletions, notify users, allow override.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/content-management/lifecycle-comparison.svg"
          alt="Lifecycle Approaches Comparison"
          caption="Figure 4: Lifecycle Approaches Comparison — Retention, archival, and deletion trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Define clear lifecycle stages:</strong> Document each stage (draft, review, published, archived, deleted). Define valid transitions. Implement state machine for enforcement.
          </li>
          <li>
            <strong>Implement retention policies:</strong> Legal requirements (7 years for financial). Business rules (indefinite for user content). User preferences (auto-delete after X time).
          </li>
          <li>
            <strong>Automate lifecycle transitions:</strong> Event triggers (publish → index). Scheduled jobs (nightly archival). Conditional logic (if temporary, delete after 30 days).
          </li>
          <li>
            <strong>Use soft delete before hard delete:</strong> Soft delete with recovery window (30 days). Then hard delete. Audit trail of all deletions.
          </li>
          <li>
            <strong>Handle dependencies on deletion:</strong> Cascading delete (comments with post). Or prevent deletion if dependencies exist. Reassign dependencies to different content.
          </li>
          <li>
            <strong>Implement storage tiering:</strong> Hot storage for active content. Warm for occasional access. Cold for archives. Move based on access patterns.
          </li>
          <li>
            <strong>Preserve archive metadata:</strong> Original metadata (author, date). Lifecycle history. Access history. Retention info.
          </li>
          <li>
            <strong>Handle legal holds:</strong> Legal hold overrides automatic deletion. Flag content under legal hold. Notify when legal hold applied.
          </li>
          <li>
            <strong>Notify stakeholders:</strong> Authors (content archived/deleted). Users (your content will be deleted). Admins (retention violations).
          </li>
          <li>
            <strong>Audit lifecycle actions:</strong> Log all transitions. Who, what, when, why. Compliance reporting. Audit trail for legal discovery.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No retention policies:</strong> Content retained indefinitely, compliance violations. <strong>Solution:</strong> Define retention by content type, automate enforcement.
          </li>
          <li>
            <strong>Hard delete without soft delete:</strong> Accidental deletions unrecoverable. <strong>Solution:</strong> Always soft delete first, recovery window, then hard delete.
          </li>
          <li>
            <strong>No dependency handling:</strong> Deleted content leaves orphaned references. <strong>Solution:</strong> Cascade delete, prevent deletion, or reassign dependencies.
          </li>
          <li>
            <strong>Archive without metadata:</strong> Archived content incomprehensible later. <strong>Solution:</strong> Preserve metadata, lifecycle history, context with archives.
          </li>
          <li>
            <strong>No legal hold handling:</strong> Delete content under litigation. <strong>Solution:</strong> Legal hold system, override automatic deletion, flag content.
          </li>
          <li>
            <strong>Manual lifecycle management:</strong> Doesn&apos;t scale, inconsistent enforcement. <strong>Solution:</strong> Automate transitions, scheduled jobs, event triggers.
          </li>
          <li>
            <strong>No storage tiering:</strong> All content on expensive storage. <strong>Solution:</strong> Tier by access patterns, move old content to cold storage.
          </li>
          <li>
            <strong>No stakeholder notifications:</strong> Users surprised when content deleted. <strong>Solution:</strong> Notify before archival/deletion, provide override option.
          </li>
          <li>
            <strong>No audit trail:</strong> Can&apos;t prove compliance, track changes. <strong>Solution:</strong> Log all lifecycle actions, who/what/when/why.
          </li>
          <li>
            <strong>One-size-fits-all retention:</strong> Same retention for all content types. <strong>Solution:</strong> Different retention by content type, jurisdiction, business requirements.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Enterprise Document Management</h3>
        <p>
          Enterprise manages documents through lifecycle. Draft (authors collaborate, version control). Review (legal, compliance approval). Published (live in document repository, searchable). Maintenance (periodic review, updates). Archival (after 2 years inactive, moved to cold storage). Deletion (after 7 years, unless under legal hold). Legal hold preserves documents relevant to litigation. Automated workflows route documents through stages. Compliance reporting tracks document lifecycle for audits.
        </p>

        <h3 className="mt-6">Social Media Platform</h3>
        <p>
          Social platform manages user-generated content lifecycle. Creation (user posts content). Moderation (automated + human review). Published (visible to followers/public). Maintenance (user can edit/delete). Archival (inactive accounts after 5 years). Deletion (user deletes, account closure, policy violations). GDPR right to erasure (user can request deletion). Soft delete (30-day recovery window). Automated deletion for policy violations. Legal hold for content under investigation.
        </p>

        <h3 className="mt-6">E-commerce Product Listings</h3>
        <p>
          E-commerce manages product listing lifecycle. Draft (merchant creates listing). Review (quality check, policy compliance). Published (live on site, indexed). Maintenance (inventory updates, price changes). Discontinued (product no longer available, archived). Deletion (after 2 years discontinued, removed). Archived listings accessible via direct link (customer order history). Search index removes discontinued products. Inventory triggers lifecycle transitions (out of stock → discontinued).
        </p>

        <h3 className="mt-6">News Website Articles</h3>
        <p>
          News site manages article lifecycle. Draft (journalist writes). Review (editor review, fact-check). Published (live on site, indexed, notified). Maintenance (corrections, updates). Archival (after 1 year, moved to archive section). Deletion (rare, only for legal reasons). Articles permanently accessible via URL (news archive). Search includes archived articles. Legal hold for articles under dispute. Corrections tracked in version history.
        </p>

        <h3 className="mt-6">Healthcare Records Management</h3>
        <p>
          Healthcare manages patient records lifecycle. Creation (provider creates record). Review (provider signs off). Published (active in patient record). Maintenance (updates, additions). Archival (after 7 years inactive, moved to cold storage). Deletion (per HIPAA, 6 years minimum, then per policy). Legal hold for records under litigation. Patient access requests (GDPR/HIPAA). Secure deletion (HIPAA requires secure destruction). Audit trail for all access and changes.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design retention policies that balance legal requirements with user privacy?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement tiered retention based on content type and jurisdiction. Legal minimums (financial: 7 years, medical: 6 years) take precedence. User content (indefinite until user deletes, respecting GDPR right to erasure). Temporary content (30-90 days auto-delete). Legal hold overrides all automatic deletion. The key insight: legal requirements are mandatory, user privacy is a right—design policies that satisfy both with clear exceptions for legal holds and user deletion requests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle content deletion with dependencies (comments, shares, backlinks)?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement dependency management strategies. Cascading delete (delete comments with post—simple but may delete more than intended). Orphan prevention (block deletion if dependencies exist—safe but frustrating). Reassignment (reassign comments to different content—complex but preserves dependencies). Tombstone (mark content deleted but keep placeholder for dependencies—balances deletion with integrity). The operational insight: choose strategy based on content type—cascading for user content, tombstone for important content with many dependencies.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement storage tiering for cost-effective archival?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement access-pattern-based tiering. Hot storage (SSD, content accessed in last 30 days). Warm storage (HDD, content accessed 30-365 days ago). Cold storage (object archive, content not accessed in 1 year). Automated tiering (nightly job moves content based on last access). Retrieval handling (cold content retrieved on-demand, takes minutes to hours). The cost insight: tiering can reduce storage costs 80-90%—hot storage is expensive, cold storage is cheap, most content is rarely accessed after initial period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle legal holds that override automatic deletion?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement legal hold system integrated with lifecycle. Legal hold flag on content (prevents automatic deletion). Hold management (apply/release holds, track reason). Notification (notify lifecycle system of holds). Exception handling (scheduled deletion skips held content). Audit trail (log when hold applied, by whom, why). The compliance insight: legal holds are mandatory—failure to preserve content under litigation can result in legal sanctions. Design hold system first, then build lifecycle around it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance automation with human oversight in lifecycle management?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement hybrid approach with automation and human override. Automate routine transitions (draft → review on submit, published → archived after inactivity). Human review for sensitive actions (deletion of important content, legal hold decisions). Notifications before automated actions (your content will be archived in 7 days, click to override). Audit trail for all actions (automated and manual). The operational insight: automate the 95% of routine cases, provide human oversight for the 5% of edge cases that matter.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure GDPR compliance (right to erasure) in lifecycle management?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement user-controlled deletion with compliance safeguards. User deletion request (user can request their content deleted). Verification (verify request is from user). Dependency handling (what happens to comments on others&apos; content). Legal exceptions (retain content under legal hold despite request). Secure deletion (actually delete, not just hide). Audit trail (log deletion for compliance proof). The compliance insight: GDPR right to erasure is a user right, not absolute—legal holds, legitimate business interests may override, but must be documented and justified.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nara.gov/records-management/records-management-faqs/records-scheduling"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NARA — Records Scheduling and Retention
            </a>
          </li>
          <li>
            <a
              href="https://www.gdpr.eu/right-to-be-forgotten/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GDPR.eu — Right to Erasure (Right to be Forgotten)
            </a>
          </li>
          <li>
            <a
              href="https://www.hhs.gov/hipaa/for-professionals/privacy/index.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HHS — HIPAA Privacy Rule
            </a>
          </li>
          <li>
            <a
              href="https://www.archives.gov/records-mgmt"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              National Archives — Records Management
            </a>
          </li>
          <li>
            <a
              href="https://www.aiim.org/standards-and-publications/standards/information-management"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AIIM — Information Management Standards
            </a>
          </li>
          <li>
            <a
              href="https://www.iso.org/standard/50598.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ISO 15489 — Records Management Standard
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
