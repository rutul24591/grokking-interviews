"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-content-moderation-reporting-ui",
  title: "Design a Content Moderation & Reporting UI",
  description:
    "Architecture for a content moderation and reporting UI: user-facing report flow (multi-step reason selection, context capture), moderator review queue with priority scoring, appeal flow for removed content, automated pre-moderation pipeline with confidence thresholds, shadow-ban and soft-delete patterns, content strike system with escalation, moderator dashboard with batch operations, real-time queue depth monitoring, and audit trail for all moderation decisions.",
  category: "high-level-design",
  subcategory: "social-engagement",
  slug: "content-moderation-reporting-ui",
  wordCount: 5100,
  readingTime: 31,
  lastUpdated: "2026-05-11",
  tags: ["hld", "moderation", "reporting", "trust-safety", "review-queue", "shadow-ban", "appeals", "audit"],
  relatedTopics: ["user-profile-follower-system", "viral-sharing-engagement"],
};

export default function ContentModerationReportingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Content moderation is the trust-and-safety layer that protects a platform's users from harmful content (harassment, hate speech, CSAM, spam) and protects the platform from legal liability. It involves two actors: users who report content they find violating, and moderators (human or automated) who review reports and make enforcement decisions. The UI design challenge is different for each actor. For the reporting user, the flow must be low-friction enough that legitimate reporters complete the report, but structured enough to capture the violation category and context needed for efficient review. For the moderator, the interface must support high-throughput review (a moderator might review 200–500 items per shift) with enough context to make accurate, consistent decisions quickly.</p>
        <p>Automated pre-moderation (ML models that scan content at upload time) adds a third layer: content that exceeds a confidence threshold for severe violations (CSAM, graphic violence) is automatically removed or quarantined before the moderator queue, while content in the "gray zone" (lower confidence, more nuanced violations) is sent to the human review queue with the model's prediction as a signal. The UI must expose these automated decisions through the appeal flow: a user whose post was auto-removed must have a path to challenge the decision and have a human review it.</p>
        <p><strong>Explicit scope:</strong> User report flow, moderator review queue, automated pre-moderation pipeline, appeal flow, and shadow-ban pattern. Not in scope: ML model training, legal hold procedures, or advertiser safety tools.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>User report flow:</strong> Three-tap report flow: (1) select violation category (spam, harassment, hate speech, misinformation, nudity, violence, other), (2) select specific sub-category, (3) optionally add context (screenshot, description). Report submitted without disrupting the user's current activity (sheet modal, not full-page navigation). Confirmation that report was received.</li>
          <li><strong>Moderator review queue:</strong> Prioritized list of reported items. Each item shows: content (text/image/video), reporter's stated reason, ML model prediction and confidence score, reporter's history (serial reporter vs. first-time), reportee's account history (new account, prior violations, verified status). Moderator actions: approve (no action), remove (soft-delete), escalate, shadow-ban user, issue content strike.</li>
          <li><strong>Automated pre-moderation:</strong> Content scanned on upload. High-confidence violations (&gt;0.95 confidence) auto-removed. Medium-confidence (0.5–0.95) queued for human review with priority boost. Low-confidence (&lt;0.5) published normally but flagged for periodic review.</li>
          <li><strong>Appeals:</strong> User whose content was removed sees a "This content was removed" notice on the post. "Appeal this decision" button opens a structured form. Submitted appeal enters a separate, expedited review queue. Moderator reviews the appeal with the original context + the user's appeal statement. Three outcomes: overturn (content restored), uphold (removal stands), escalate to senior moderator.</li>
          <li><strong>Audit trail:</strong> Every moderation action (report received, item reviewed, decision made, appeal submitted, appeal resolved) is logged with timestamp, moderator ID, and decision rationale. Audit log is immutable and queryable for compliance purposes.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Report flow completion rate:</strong> &gt;80% of started reports are submitted (not abandoned mid-flow). Three steps maximum for common violation categories.</li>
          <li><strong>Moderator throughput:</strong> UI must support 300 reviews per hour per moderator without performance degradation. Pre-loads next item while current decision is being submitted.</li>
          <li><strong>Auto-moderation latency:</strong> High-confidence violations removed within 30 seconds of upload, before the content is indexed or discoverable.</li>
          <li><strong>Appeal SLA:</strong> Appeal reviewed and resolved within 48 hours. Queue depth dashboard shows SLA breach risk in real time.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The system has three layers. The User-Facing Layer provides the report sheet modal (triggered from the post overflow menu) and the appeal form (triggered from the removed-content notice). Both submit to the Reports API, which writes to the reports database and publishes events to Kafka. The Triage Layer has two components: an ML classifier that scores all incoming content on upload (publishing ModerationSignal events to Kafka) and a Priority Scorer that combines report signals, ML signals, account signals, and content age to assign a priority score to each queue item. The Moderator Layer is a SPA dashboard that presents the prioritized queue, provides review context and action controls, and writes decisions to the decisions database with full audit logging.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/social-engagement/content-moderation-reporting-ui.svg"
          alt="Content moderation and reporting system architecture showing user report flow (3-step sheet modal: category → sub-category → context; POST /api/reports {contentId type subType description}; confirmation toast; does not navigate away), automated pre-moderation pipeline (content upload → ML classifier: confidence score; &gt;0.95 auto-remove + shadow soft-delete; 0.5-0.95 → moderation queue with URGENT priority + model prediction badge; &lt;0.5 publish normal; latency: &lt;30s from upload), priority scoring queue (queue item score = ml_confidence*0.4 + reporter_history*0.2 + account_risk*0.2 + content_reach*0.2; sorted set Redis queue:moderation by score; moderator dashboard: GET /api/mod/queue?limit=1 O(1) from sorted set), moderator review UI (item: content render + metadata + reporter context + ML score badge + prior violations badge; actions: approve remove shadow-ban escalate strike; keyboard shortcuts: A/R/S/E; next item pre-fetched while submitting decision; batch select for obvious spam), decision recording (POST /api/mod/decisions {itemId action rationale moderatorId}; write decisions table; if remove: soft-delete content visibility=HIDDEN; PUBLISH content.removed Kafka; user notified; strike count incremented), shadow-ban pattern (SET shadow:{userId}=true TTL 30d; content visible to owner but excluded from: public feed search discovery followers; gradual enforcement detects evasion; logged in moderation_actions), appeals flow (removed content: show notice + Appeal button; POST /api/appeals {contentId reason statement}; URGENT queue separate from main; GET /api/mod/appeals?limit=1; overturn → visibility=PUBLIC + notify; uphold → notify; escalate → senior queue; 48h SLA), audit log (append-only moderation_log table: id timestamp action moderatorId contentId userId reason; read via compliance API never deleted; indexed on contentId userId timestamp)."
          caption="User report 3-step sheet modal, ML pre-moderation (&gt;0.95 auto-remove, &lt;30s), Redis sorted-set priority queue (combined ml+reporter+account score), moderator review UI (keyboard shortcuts, next-item prefetch, batch ops), shadow-ban (SET shadow:{userId} TTL), appeals expedited queue (48h SLA), and immutable audit log"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">User Report Flow Design</h3>
        <p>The report flow is triggered from the "..." (overflow) menu on any post or comment. It opens as a bottom sheet modal on mobile (not a full-page navigation) so the user doesn't lose their place in the feed. Step 1: select violation category. The categories are presented as a large-touch-target list with icons: Spam, Harassment or bullying, Hate speech, False information, Nudity or sexual content, Violence or dangerous content, Intellectual property, Something else. Step 2: select sub-category (e.g., for "Harassment or bullying": bullying, threats, unwanted contact, impersonation). Sub-categories are specific enough to route reports to the correct moderation team. Step 3 (optional): free-text context and ability to attach a screenshot. A "Submit Report" button completes the flow. On submission, the sheet closes and a toast confirmation appears: "Your report has been submitted. We'll review it shortly." The user is never told the outcome of specific reports (to prevent retaliation and tactical gaming of the system).</p>
        <p>The three-step structure is carefully designed to maximize completion rates. Showing all options at once overwhelms users. Requiring too many steps increases abandonment. Testing across platforms consistently shows that three steps with progressive disclosure achieves the highest completion rate. The optional context step at the end filters out low-effort reporter spam (users unwilling to add context for frivolous reports) while not blocking legitimate reporters who have urgent information to add.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Priority Scoring and Queue Management</h3>
        <p>The moderation queue is not first-in-first-out. Items are prioritized by a composite score: priority = (ml_confidence × 0.4) + (reporter_credibility × 0.2) + (account_risk_score × 0.2) + (content_reach × 0.2). ml_confidence is the ML classifier&apos;s confidence that the content violates policy (0–1). reporter_credibility is the historical accuracy rate of the reporter&apos;s past reports (first-time reporters get 0.5 as a neutral starting point). account_risk_score is the flagged account&apos;s risk tier (new accounts, accounts with prior violations, or accounts without phone verification get higher risk scores). content_reach is a normalized measure of how many users have seen the content (viral content that&apos;s actively spreading is prioritized over low-reach content). The priority score is computed when the report arrives and stored as the score in a Redis sorted set (ZADD queue:moderation {"{score}"} {"{itemId}"}). Moderators pull the next item with ZPOPMAX queue:moderation, always getting the highest-priority item in O(log N).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Moderator Review Dashboard</h3>
        <p>The moderator dashboard is a SPA that presents one item at a time (single-item focus improves decision accuracy versus displaying a list). The item view shows: the reported content (rendered in a sandboxed iframe for HTML content, or as an image/video for media), the violation category and sub-category reported, the ML model's prediction and confidence score (e.g., "Hate speech: 0.82 confidence"), the reporter's history (accuracy rate, total reports submitted), the reportee's account metadata (account age, verification status, prior violations count), and related reports (other reports of the same content or same user). Actions are accessible via large buttons and keyboard shortcuts (A = approve/no action, R = remove, S = shadow-ban, E = escalate, T = content strike). After the moderator submits a decision, the current item transitions out and the next item (pre-fetched while the previous decision was being submitted) transitions in immediately, keeping the review loop tight.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Shadow-Ban Implementation</h3>
        <p>A shadow-ban (also called &quot;stealth ban&quot; or &quot;ghost ban&quot;) makes a user&apos;s content invisible to others without informing the user they are banned. The user continues to post normally but their content is excluded from: the public feed, search results, discovery surfaces, and their followers&apos; feeds. This prevents the user from creating new accounts to evade the ban (they don&apos;t know they&apos;re banned). The implementation: SET shadow:{"{userId}"} 1 EX {"{TTL_seconds}"} in Redis. Every content delivery path checks this key: feed assembly (exclude posts from shadow-banned users), search indexing (skip indexing new content from shadow-banned users), and profile page (profile is private-like for non-followers, posts grid shows &quot;No posts&quot; to non-followers). The shadow-banned user sees their own content normally (their own requests bypass the shadow-ban check). Shadow bans are logged in the moderation_actions table for audit purposes and typically have a 30-day TTL, after which they are reviewed for lifting or converting to a full ban.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Appeals Flow and SLA Management</h3>
        <p>Users whose content is removed see a "This content was removed because it violated our Community Guidelines" notice in place of their content. The notice includes: the violation category that was identified, a "Learn more" link to the relevant policy, and an "Appeal this decision" button (shown only if the user has not exhausted their appeal allowance — typically 3 appeals per 30 days). The appeal form captures: "Why do you believe this content was removed in error?" (free text, 500 character max) and an optional upload of additional context (e.g., a source link proving information is accurate). Submitted appeals enter a separate queue (queue:appeals) with a 48-hour SLA. The appeals queue shows SLA breach risk: items approaching 48 hours are highlighted in orange (&gt;36 hours) or red (&gt;44 hours), and alerts fire to the moderation team lead when the queue is at risk of missing SLA. The appeals dashboard has a real-time counter showing: total pending, count &gt;24h, count &gt;36h, count &gt;44h. This operational visibility is essential for staffing decisions.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Automated removal versus human-first review: auto-removing content above a confidence threshold reduces the time-to-removal for clearly violating content (CSAM, graphic violence) from hours (human review queue depth) to seconds. The risk is false positives: content incorrectly auto-removed damages user trust, especially for marginalized communities whose speech is statistically more likely to be incorrectly flagged by ML models. A conservative threshold (0.95+) limits false positives at the cost of missing violations in the 0.7–0.95 range, which go to the human queue. For the most severe violation categories (CSAM), the threshold is set low (0.7+) because the cost of a false negative is catastrophically higher than the cost of a false positive. Per-category threshold configuration allows tuning this trade-off independently for each violation type.</p>
        <p>Single-item focus versus list-view for moderator queue: single-item focus reduces decision fatigue and cognitive load (the moderator is not anchoring to adjacent items) and produces more consistent decisions. List view enables higher throughput for obvious-spam cases (batch select and remove 20 spam accounts simultaneously). A hybrid approach — single-item view by default with a "batch mode" toggle for spam queues — serves both use cases without forcing moderators into a suboptimal workflow for either.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A content moderation and reporting UI serves three distinct user types with different UX requirements. For reporters: a 3-step bottom-sheet modal (category → sub-category → optional context) that achieves &gt;80% completion without full-page navigation. For moderators: a single-item focus dashboard with keyboard shortcuts, next-item prefetch (keeps review loop under 12 seconds per item), and ML signal badges. For users whose content is actioned: a clear removal notice with an appeals path (48h SLA, separate expedited queue). The automated pipeline removes high-confidence violations (&gt;0.95) in under 30 seconds via ML classifier before content is indexed; medium-confidence items enter the queue with priority boost. Shadow-ban (Redis SET TTL) enforces invisibility to others without notifying the user. The moderation queue uses a composite priority score (Redis ZADD/ZPOPMAX sorted set) weighted by ml_confidence, reporter credibility, account risk, and content reach. All decisions write to an append-only audit log for compliance. The key design challenge: moderation decisions are high-stakes and irreversible — the UI must surface enough context for accurate decisions while sustaining high throughput, which requires aggressive pre-fetching, keyboard shortcuts, and clear information hierarchy.</p>
      </section>
    </ArticleLayout>
  );
}
