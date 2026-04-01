"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-frontend-moderation-queue-ui",
  title: "Moderation Queue UI",
  description:
    "Comprehensive guide to implementing moderation queue interfaces covering content review workflows, priority queue management, moderation actions (approve, remove, escalate), moderator assignment, quality assurance, and audit trails for content moderation teams.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "moderation-queue-ui",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "admin",
    "moderation",
    "queue",
    "frontend",
    "content-safety",
    "admin-tools",
  ],
  relatedTopics: ["admin-dashboard", "user-management-ui", "content-moderation-service", "abuse-detection"],
};

export default function ModerationQueueUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Moderation queue UI enables moderators to review flagged content efficiently, with tools for quick decisions, queue management, and quality assurance. The interface is the primary tool for content moderation teams to enforce community guidelines, review user reports, and maintain platform safety. For staff and principal engineers, moderation queue UI involves complex workflows (priority-based queue, auto-assignment), quality assurance (accuracy tracking, calibration), and integration with backend services (content service, user service, ML moderation service).
        </p>
        <p>
          The complexity of moderation queue UI extends beyond simple content review. Queue management must handle high volume (thousands of items per day), prioritize effectively (high-risk content first), and distribute work evenly (auto-assignment, load balancing). Moderation actions require accuracy (false positives harm users, false negatives harm community), consistency (similar content treated similarly), and speed (backlog management). Quality assurance tracks moderator accuracy, provides calibration sessions, and identifies training needs. The UI must prevent errors (confirmation dialogs, context display) while enabling efficient operations (keyboard shortcuts, batch actions).
        </p>
        <p>
          For staff and principal engineers, moderation queue UI architecture involves queue management (priority queues, auto-assignment), quality tracking (accuracy metrics, review workflows), and operational excellence (backlog management, SLA tracking). The system must support multiple content types (text, images, videos, live streams), multiple violation types (spam, hate speech, harassment, nudity), and multiple workflows (single review, escalation, appeal). Integration with ML moderation (auto-classify content, prioritize high-confidence violations) improves efficiency. Audit logging tracks all moderation actions for compliance and quality assurance.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Queue Management</h3>
        <p>
          Priority queue orders content by risk and urgency. Risk scoring (ML-based risk assessment, user report count, content type). Urgency (live stream takes priority, viral content priority). SLA tracking (time in queue, approaching SLA breach). Queue views (all items, my items, escalated, appeals).
        </p>
        <p>
          Auto-assignment distributes work among moderators. Round-robin assignment (even distribution). Skill-based assignment (assign based on moderator expertise). Load balancing (consider current workload). Specialization (some moderators handle specific violation types).
        </p>
        <p>
          Queue filtering enables focused review. Filter by type (spam, hate speech, harassment). Filter by content type (text, image, video). Filter by priority (high, medium, low). Filter by status (pending, in review, escalated). Saved filters (save frequent filter combinations).
        </p>

        <h3 className="mt-6">Content Review Interface</h3>
        <p>
          Content display shows full context. Content preview (full text, image, video player). User context (user profile, violation history, account age). Reporting context (who reported, why, report count). Related content (related posts, conversation thread).
        </p>
        <p>
          Moderation actions enable quick decisions. Approve (content is fine, remove from queue). Remove (violates guidelines, remove content). Escalate (needs senior review, escalate). Skip (can&apos;t decide, skip to next). Batch actions (approve multiple, remove multiple).
        </p>
        <p>
          Decision rationale documents moderation decisions. Violation type (select from predefined list). Severity (low, medium, high). Notes (optional, add context). Precedent (link to similar cases).
        </p>

        <h3 className="mt-6">Quality Assurance</h3>
        <p>
          Accuracy tracking measures moderator performance. Accuracy rate (correct decisions / total decisions). False positive rate (approved content that should be removed). False negative rate (removed content that should be approved). Quality score (composite metric).
        </p>
        <p>
          Calibration sessions ensure consistent moderation. Review sessions (review past decisions as team). Calibration cases (standardized test cases). Disagreement resolution (discuss disagreements, align standards). Training (new moderator training, ongoing training).
        </p>
        <p>
          Review workflows ensure quality. Peer review (random sample reviewed by peer). Senior review (escalated cases reviewed by senior). Appeal process (users can appeal decisions). Quality audits (regular audits of moderation quality).
        </p>

        <h3 className="mt-6">Moderator Assignment and Workload</h3>
        <p>
          Auto-assignment distributes queue items. Round-robin (even distribution). Skill-based (assign based on expertise). Load-based (consider current workload). Priority-based (high-priority to experienced moderators).
        </p>
        <p>
          Workload tracking monitors moderator capacity. Items in queue (pending review). Items reviewed today. Average review time. Current status (online, offline, break).
        </p>
        <p>
          Shift management handles moderator schedules. Shift schedules (define working hours). Break management (track breaks, auto-pause assignment). Handoff (transfer queue items between shifts).
        </p>

        <h3 className="mt-6">Escalation Workflows</h3>
        <p>
          Escalation types route complex cases. Senior moderator (complex cases). Legal review (legal implications). Policy team (policy questions). Safety team (safety concerns).
        </p>
        <p>
          Escalation tracking tracks escalated cases. Escalation reason (why escalated). Assigned to (who is reviewing). Status (pending, in review, decided). Resolution (decision, rationale).
        </p>
        <p>
          Appeal process allows users to contest decisions. Appeal submission (user submits appeal). Review (moderator reviews appeal). Decision (uphold, overturn). Notification (notify user of decision).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Moderation queue UI architecture spans queue management, content review, quality assurance, and escalation workflows. Queue management organizes and distributes work (priority queue, auto-assignment). Content review enables moderator decisions (content display, actions, rationale). Quality assurance tracks and improves quality (accuracy tracking, calibration). Escalation workflows handle complex cases (escalation, appeal).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/moderation-queue-ui/moderation-queue-architecture.svg"
          alt="Moderation Queue UI Architecture"
          caption="Figure 1: Moderation Queue UI Architecture — Queue management, content review, QA, and escalation"
          width={1000}
          height={500}
        />

        <h3>Queue Management Interface</h3>
        <p>
          Queue dashboard shows queue status. Queue stats (total items, by priority, by type). SLA tracking (items approaching SLA breach). Moderator stats (items reviewed, avg time, accuracy). Real-time updates (WebSocket for new items).
        </p>
        <p>
          Queue list displays items for review. Item card (content preview, risk score, reporter info). Priority indicators (color-coded priority). Assignment status (unassigned, assigned to me, assigned to other). Quick actions (review, skip, escalate).
        </p>
        <p>
          Queue filters enable focused work. Type filters (spam, hate speech, harassment). Content filters (text, image, video). Priority filters (high, medium, low). Status filters (pending, in review, escalated).
        </p>

        <h3 className="mt-6">Content Review Interface</h3>
        <p>
          Content display shows full context. Content area (text, image viewer, video player). User panel (user info, violation history, account details). Report panel (reports, reporters, report reasons). Related content (thread, conversation, related posts).
        </p>
        <p>
          Action panel enables quick decisions. Action buttons (approve, remove, escalate, skip). Keyboard shortcuts (A=approve, R=remove, E=escalate, S=skip). Confirmation dialogs (confirm remove, confirm escalate). Rationale input (violation type, severity, notes).
        </p>
        <p>
          Review workflow guides moderators. Step 1: Review content (read/watch content). Step 2: Check context (user history, reports). Step 3: Make decision (approve/remove/escalate). Step 4: Document rationale (violation type, notes). Step 5: Submit decision (execute action).
        </p>

        <h3 className="mt-6">Quality Assurance Dashboard</h3>
        <p>
          Quality metrics track moderator performance. Accuracy rate (correct / total). False positive rate. False negative rate. Review speed (avg time per review). Quality trend (accuracy over time).
        </p>
        <p>
          Calibration tracking tracks calibration progress. Calibration cases completed. Calibration accuracy. Disagreements (cases with disagreement). Training needs (identified from calibration).
        </p>
        <p>
          Review assignment assigns cases for QA review. Random sampling (random sample of decisions). Targeted review (low-accuracy moderators). Escalated cases (all escalated cases). Appeal cases (all appealed decisions).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/moderation-queue-ui/content-review-interface.svg"
          alt="Content Review Interface"
          caption="Figure 2: Content Review Interface — Content display, user context, reports, and actions"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Escalation Workflows</h3>
        <p>
          Escalation routing routes complex cases. Escalation type (senior, legal, policy, safety). Auto-routing (based on escalation type). Assignment (assign to specific person/team). Tracking (track escalation status).
        </p>
        <p>
          Appeal workflow handles user appeals. Appeal submission (user submits appeal form). Queue assignment (assign to reviewer). Review process (reviewer reviews case). Decision (uphold, overturn, modify). Notification (notify user of outcome).
        </p>
        <p>
          Escalation tracking tracks all escalations. Escalation queue (pending escalations). Escalation stats (volume, resolution time). Escalation reasons (common reasons). Resolution tracking (how resolved).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/moderation-queue-ui/escalation-workflow.svg"
          alt="Escalation Workflow"
          caption="Figure 3: Escalation Workflow — Escalation, review, decision, and notification"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Moderation queue UI design involves trade-offs between efficiency and accuracy, automation and human judgment, and specialization and flexibility. Understanding these trade-offs enables informed decisions aligned with moderation goals and resource constraints.
        </p>

        <h3>Queue Assignment: Auto vs. Manual</h3>
        <p>
          Auto-assignment (system assigns items). Pros: Efficient (no manual assignment), even distribution, fast. Cons: Less control (can&apos;t prioritize specific moderators), may not match expertise. Best for: High-volume queues, standard moderation.
        </p>
        <p>
          Manual assignment (moderators pick items). Pros: Control (pick based on expertise), flexibility (handle complex cases). Cons: Slower (manual selection), uneven distribution (some moderators idle). Best for: Low-volume queues, specialized moderation.
        </p>
        <p>
          Hybrid: auto-assign standard, manual for complex. Pros: Best of both (efficient for standard, flexible for complex). Cons: Complexity (two assignment modes). Best for: Most production systems—balance efficiency with flexibility.
        </p>

        <h3>Review Workflow: Single vs. Dual Review</h3>
        <p>
          Single review (one moderator decides). Pros: Efficient (one decision), fast. Cons: Error-prone (single point of failure), inconsistent. Best for: High-volume, clear-cut cases.
        </p>
        <p>
          Dual review (two moderators decide). Pros: Accurate (two opinions), consistent. Cons: Slower (two decisions), expensive (2x cost). Best for: High-stakes decisions (bans, legal issues).
        </p>
        <p>
          Hybrid: single for standard, dual for high-stakes. Pros: Best of both (efficient for standard, accurate for high-stakes). Cons: Complexity (two workflows). Best for: Most production systems—balance efficiency with accuracy.
        </p>

        <h3>ML Assistance: Full Auto vs. Human-in-Loop</h3>
        <p>
          Full auto (ML decides, no human review). Pros: Fast (no human cost), scalable. Cons: Error-prone (ML mistakes), no appeal. Best for: Clear-cut spam, low-stakes decisions.
        </p>
        <p>
          Human-in-loop (ML suggests, human decides). Pros: Accurate (human judgment), appealable. Cons: Slower (human review), expensive. Best for: Most content moderation—balance automation with judgment.
        </p>
        <p>
          Hybrid: auto for high-confidence, human for low-confidence. Pros: Best of both (fast for clear, accurate for unclear). Cons: Complexity (confidence thresholds). Best for: Most production systems—ML efficiency with human oversight.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/moderation-queue-ui/queue-management-comparison.svg"
          alt="Queue Management Comparison"
          caption="Figure 4: Queue Management Comparison — Auto vs. manual assignment, single vs. dual review"
          width={1000}
          height={450}
        />

        <h3>Specialization: Generalist vs. Specialist Moderators</h3>
        <p>
          Generalist moderators (handle all types). Pros: Flexible (handle any content), simpler scheduling. Cons: Less expertise (may miss nuances), inconsistent. Best for: Small teams, general platforms.
        </p>
        <p>
          Specialist moderators (handle specific types). Pros: Expert (deep knowledge), consistent. Cons: Less flexible (can&apos;t handle other types), complex scheduling. Best for: Large teams, specialized content (legal, medical, safety).
        </p>
        <p>
          Hybrid: generalist for standard, specialist for complex. Pros: Best of both (flexible for standard, expert for complex). Cons: Complexity (two moderator types). Best for: Most production systems—balance flexibility with expertise.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement priority queue:</strong> Order by risk score, urgency, SLA. High-risk first. SLA tracking (alert on breach). Real-time updates.
          </li>
          <li>
            <strong>Enable auto-assignment:</strong> Round-robin or skill-based. Load balancing. Priority-based assignment. Manual override for complex cases.
          </li>
          <li>
            <strong>Design comprehensive review interface:</strong> Full content display. User context (history, reports). Quick actions (approve, remove, escalate). Keyboard shortcuts.
          </li>
          <li>
            <strong>Track quality metrics:</strong> Accuracy rate, false positive/negative rates. Quality trends. Calibration tracking. Identify training needs.
          </li>
          <li>
            <strong>Implement calibration sessions:</strong> Regular calibration (review past decisions). Standardized test cases. Disagreement resolution. Ongoing training.
          </li>
          <li>
            <strong>Enable escalation workflows:</strong> Escalation types (senior, legal, policy). Auto-routing. Tracking and resolution. Appeal process.
          </li>
          <li>
            <strong>Provide keyboard shortcuts:</strong> Shortcuts for common actions. Customizable shortcuts. Accessibility support.
          </li>
          <li>
            <strong>Implement audit logging:</strong> Log all moderation actions. Immutable audit log. Search and export. Compliance reporting.
          </li>
          <li>
            <strong>Enable ML assistance:</strong> Auto-classify content. Prioritize high-confidence. Human-in-loop for low-confidence. Continuous ML improvement.
          </li>
          <li>
            <strong>Support batch actions:</strong> Batch approve, batch remove. Confirmation dialogs. Progress tracking. Audit logging.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No priority queue:</strong> High-risk content delayed. Solution: Priority queue, risk scoring, SLA tracking.
          </li>
          <li>
            <strong>Manual assignment only:</strong> Inefficient, uneven distribution. Solution: Auto-assignment with manual override.
          </li>
          <li>
            <strong>Poor review interface:</strong> Missing context, slow decisions. Solution: Full context display, quick actions, keyboard shortcuts.
          </li>
          <li>
            <strong>No quality tracking:</strong> Can&apos;t measure moderator accuracy. Solution: Accuracy metrics, false positive/negative rates, quality trends.
          </li>
          <li>
            <strong>No calibration:</strong> Inconsistent moderation. Solution: Regular calibration sessions, standardized test cases.
          </li>
          <li>
            <strong>No escalation workflows:</strong> Complex cases stuck. Solution: Escalation types, auto-routing, tracking.
          </li>
          <li>
            <strong>No audit logging:</strong> Can&apos;t track decisions. Solution: Log all actions, immutable audit log.
          </li>
          <li>
            <strong>No ML assistance:</strong> Manual review of everything. Solution: ML classification, prioritize high-confidence.
          </li>
          <li>
            <strong>No batch actions:</strong> Slow for high-volume. Solution: Batch approve/remove, confirmation dialogs.
          </li>
          <li>
            <strong>Poor workload tracking:</strong> Uneven distribution, burnout. Solution: Workload tracking, load balancing, break management.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Facebook Content Moderation</h3>
        <p>
          Facebook moderation queue for trust and safety. Priority queue (risk-scored content). Auto-assignment (skill-based, load-balanced). Review interface (full content, user context, reports). Actions (approve, remove, escalate). Quality tracking (accuracy, calibration). Escalation (legal, policy, safety). Audit logging (all actions logged).
        </p>

        <h3 className="mt-6">YouTube Content Review</h3>
        <p>
          YouTube content review for policy violations. Queue management (priority by risk, views). Review interface (video player, context, reports). Actions (approve, remove, age-restrict, escalate). ML assistance (auto-classify, prioritize). Quality assurance (accuracy tracking, calibration). Escalation (legal, policy). Audit logging.
        </p>

        <h3 className="mt-6">Twitter Trust and Safety</h3>
        <p>
          Twitter moderation queue for abuse reports. Queue prioritization (report count, user risk). Review interface (tweet context, user history, reports). Actions (approve, remove, suspend, escalate). Quality tracking (accuracy metrics). Calibration (regular calibration sessions). Escalation (legal, safety). Audit logging.
        </p>

        <h3 className="mt-6">Airbnb Trust and Safety</h3>
        <p>
          Airbnb moderation for listings and reviews. Queue management (priority by risk, booking impact). Review interface (listing/review, user context, reports). Actions (approve, remove, escalate). Quality assurance (accuracy tracking). Escalation (legal, safety). Audit logging (all moderation actions).
        </p>

        <h3 className="mt-6">TikTok Content Moderation</h3>
        <p>
          TikTok video moderation queue. Queue prioritization (viral potential, reports). Review interface (video player, context, reports). Actions (approve, remove, age-gate, escalate). ML assistance (auto-classify videos). Quality tracking (accuracy, calibration). Escalation (legal, policy). Audit logging.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prioritize moderation queue when dealing with high volumes (100K+ items/day)?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement multi-factor risk scoring combining ML-based risk assessment (hate speech, nudity, violence detection), user report count (more reports = higher priority), content type (live streams, viral content get priority), and user history (repeat offenders prioritized). Track SLA with time-in-queue metrics and alert on approaching breaches. The key trade-off is between risk-based prioritization and fairness—don&apos;t let low-risk content starve indefinitely. Implement auto-assignment with skill-based routing (complex content to experienced moderators) and load balancing to prevent moderator burnout. At scale, consider tiered queues with different SLAs per risk level.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure moderator quality and consistency, especially across global teams?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement comprehensive quality program. Track accuracy metrics (correct decisions / total) with false positive and false negative rates—both matter for different reasons (false positives frustrate users, false negatives allow harmful content). Conduct regular calibration sessions where moderators review the same content and discuss discrepancies—this is critical for global teams across time zones. Implement peer review with random sampling of decisions. Provide ongoing training with updated guidelines as policies evolve. The challenge is maintaining consistency while respecting cultural differences in content interpretation—document edge cases and build a searchable decision database.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design escalation workflows that balance speed with appropriate review level?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Define clear escalation types with routing rules: senior moderator for complex policy questions, legal for potential legal issues, policy team for guideline ambiguities, safety team for severe threats. Implement auto-routing based on escalation type and content flags. Track escalation status with SLA monitoring—escalations shouldn&apos;t sit indefinitely. For user appeals, implement separate workflow with fresh reviewer (not original decision maker). The key consideration is escalation fatigue—if too many items escalate, either guidelines are unclear or moderators need more training. Track escalation rates by moderator and content type to identify training needs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement auto-assignment that balances workload while considering moderator expertise and well-being?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement hybrid assignment strategy. Round-robin for even distribution of standard content. Skill-based routing for specialized content (legal, medical, financial content to trained moderators). Load-based assignment considering current queue size and review speed—don&apos;t overload struggling moderators. Priority-based routing sends high-risk content to experienced moderators. Implement manual override for edge cases. Critical for well-being: track moderator exposure to disturbing content and implement rotation/limits. The trade-off is between efficiency (specialization) and resilience (cross-training)—too much specialization creates bottlenecks when specific moderators are unavailable.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you integrate ML moderation effectively, and what are the common pitfalls?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement human-in-the-loop architecture. Use ML for auto-classification (spam, hate speech, nudity, violence) with confidence scores. Auto-action high-confidence detections (both approve and remove) to reduce moderator load. Send low-confidence and edge cases to human review. Implement continuous improvement with feedback loop—moderator decisions train the ML model. Common pitfalls: over-reliance on ML (models make mistakes, especially with context), model drift (content patterns change over time), and bias (models may perform worse on certain demographics). Always maintain human oversight and regularly audit ML accuracy across different content types and user demographics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure and improve moderation quality over time?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement multi-dimensional quality tracking. Accuracy rate (correct / total decisions) is the baseline but insufficient alone. Track false positive rate (approved content that should be removed—user safety risk) and false negative rate (removed content that should be approved—user frustration). Create composite quality score weighting different error types by severity. Track quality trends over time to identify degradation. Implement calibration tracking to measure consistency across moderators. The key is using quality data for improvement, not punishment—identify training needs, update guidelines for ambiguous cases, and provide coaching. Regular quality reviews should be constructive, focusing on edge cases and policy clarifications rather than individual blame.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.safetyatmeta.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meta — Safety and Enforcement
            </a>
          </li>
          <li>
            <a
              href="https://support.google.com/youtube/answer/2802032"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube — Community Guidelines Enforcement
            </a>
          </li>
          <li>
            <a
              href="https://help.twitter.com/en/rules-and-policies/enforcement"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter — Enforcement Approach
            </a>
          </li>
          <li>
            <a
              href="https://www.partnershiponai.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Partnership on AI — Content Moderation
            </a>
          </li>
          <li>
            <a
              href="https://www.santaclara.edu/ethics-resources/ethical-tech-initiative/content-moderation/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Santa Clara University — Content Moderation Ethics
            </a>
          </li>
          <li>
            <a
              href="https://www.eff.org/issues/content-moderation"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              EFF — Content Moderation Resources
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
