"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-admin-backend-content-moderation-service",
  title: "Content Moderation Service",
  description:
    "Comprehensive guide to implementing content moderation services covering automated moderation, human review workflows, policy enforcement, ML-based detection, appeal processes, and content safety for platform safety and compliance.",
  category: "functional-requirements",
  subcategory: "admin-moderation",
  slug: "content-moderation-service",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "admin",
    "moderation",
    "content-safety",
    "backend",
    "ml-moderation",
    "policy-enforcement",
  ],
  relatedTopics: ["abuse-detection", "machine-learning", "policy-enforcement", "trust-safety"],
};

export default function ContentModerationServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Content moderation service enforces content policies through automated detection and human review, protecting users from harmful content. The content moderation system is the primary tool for trust and safety teams, moderators, and operations teams to moderate content, enforce policies, and maintain platform safety. For staff and principal engineers, content moderation involves automated moderation (automate content moderation), human review (enable human review), policy enforcement (enforce content policies), ML-based detection (detect harmful content), appeal processes (enable appeals), and content safety (ensure content safety).
        </p>
        <p>
          The complexity of content moderation extends beyond simple rule-based moderation. Automated moderation must automate moderation (automate content moderation). Human review must enable human review (enable human review). Policy enforcement must enforce policies (enforce content policies). ML-based detection must detect harmful content (detect harmful content). Appeal processes must enable appeals (enable appeals). Content safety must ensure content safety (ensure content safety).
        </p>
        <p>
          For staff and principal engineers, content moderation architecture involves automated moderation (automate content moderation), human review (enable human review), policy enforcement (enforce content policies), ML-based detection (detect harmful content), appeal processes (enable appeals), and content safety (ensure content safety). The system must support multiple moderation types (pre-moderation, post-moderation, reactive), multiple review types (automated, human, hybrid), and multiple enforcement types (approve, reject, escalate). Performance is important—content moderation must not impact platform performance.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Moderation Pipeline</h3>
        <p>
          Pre-moderation reviews content before publishing. Pre-moderation (review before publishing). Pre-moderation enforcement (enforce pre-moderation). Pre-moderation appeals (appeal pre-moderation). Pre-moderation prevention (prevent pre-moderation abuse).
        </p>
        <p>
          Post-moderation reviews content after publishing. Post-moderation (review after publishing). Post-moderation enforcement (enforce post-moderation). Post-moderation appeals (appeal post-moderation). Post-moderation prevention (prevent post-moderation abuse).
        </p>
        <p>
          Reactive moderation reviews content when reported. Reactive moderation (review when reported). Reactive moderation enforcement (enforce reactive moderation). Reactive moderation appeals (appeal reactive moderation). Reactive moderation prevention (prevent reactive moderation abuse).
        </p>

        <h3 className="mt-6">ML-Based Moderation</h3>
        <p>
          ML models detect harmful content. Hate speech detection (detect hate speech). Nudity detection (detect nudity). Violence detection (detect violence). Spam detection (detect spam).
        </p>
        <p>
          ML thresholds auto-action based on confidence. High confidence (auto-action). Medium confidence (human review). Low confidence (approve). ML threshold enforcement (enforce ML thresholds).
        </p>
        <p>
          Human review for edge cases. Edge cases (edge cases). Human review (human review). Human review enforcement (enforce human review). Human review appeals (appeal human review).
        </p>

        <h3 className="mt-6">Policy Enforcement</h3>
        <p>
          Content policies define content policies. Content policies (define content policies). Policy enforcement (enforce content policies). Policy verification (verify policy compliance). Policy reporting (report on policy).
        </p>
        <p>
          Policy enforcement enforces content policies. Policy enforcement (enforce policies). Policy verification (verify policies). Policy reporting (report on policies). Policy audit (audit policies).
        </p>
        <p>
          Policy verification verifies content policies. Policy verification (verify policies). Policy reporting (report on policies). Policy audit (audit policies). Policy improvement (improve policies).
        </p>

        <h3 className="mt-6">Appeal Processes</h3>
        <p>
          Appeal submission enables users to submit appeals. Appeal submission (submit appeal). Appeal processing (process appeal). Appeal decision (decide appeal). Appeal enforcement (enforce appeal decision).
        </p>
        <p>
          Appeal review reviews appeals. Appeal review (review appeal). Appeal investigation (investigate appeal). Appeal decision (decide appeal). Appeal enforcement (enforce appeal decision).
        </p>
        <p>
          Appeal decision decides appeals. Appeal approval (approve appeal). Appeal denial (deny appeal). Appeal enforcement (enforce appeal decision). Appeal tracking (track appeal decisions).
        </p>

        <h3 className="mt-6">Content Safety</h3>
        <p>
          Safety policies define content safety policies. Safety policies (define safety policies). Safety enforcement (enforce safety policies). Safety verification (verify safety compliance). Safety reporting (report on safety).
        </p>
        <p>
          Safety enforcement enforces content safety. Safety enforcement (enforce safety). Safety verification (verify safety). Safety reporting (report on safety). Safety audit (audit safety).
        </p>
        <p>
          Safety verification verifies content safety. Safety verification (verify safety). Safety reporting (report on safety). Safety audit (audit safety). Safety improvement (improve safety).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Content moderation architecture spans automated moderation, human review, policy enforcement, and appeal management. Automated moderation automates content moderation. Human review enables human review. Policy enforcement enforces content policies. Appeal management manages appeals.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/content-moderation-service/moderation-architecture.svg"
          alt="Content Moderation Architecture"
          caption="Figure 1: Content Moderation Architecture — Automated moderation, human review, policy enforcement, and appeals"
          width={1000}
          height={500}
        />

        <h3>Automated Moderation</h3>
        <p>
          Automated moderation automates content moderation. Automated moderation (automate moderation). Automated enforcement (enforce automation). Automated appeals (appeal automation). Automated prevention (prevent automation abuse).
        </p>
        <p>
          ML-based detection detects harmful content. Hate speech detection (detect hate speech). Nudity detection (detect nudity). Violence detection (detect violence). Spam detection (detect spam).
        </p>
        <p>
          Automated enforcement enforces automated moderation. Automated enforcement (enforce automation). Automated verification (verify automation). Automated reporting (report on automation). Automated audit (audit automation).
        </p>

        <h3 className="mt-6">Human Review</h3>
        <p>
          Human review enables human review. Human review (enable human review). Human review enforcement (enforce human review). Human review appeals (appeal human review). Human review prevention (prevent human review abuse).
        </p>
        <p>
          Human review workflow reviews content. Human review workflow (review content). Human review investigation (investigate content). Human review decision (decide content). Human review enforcement (enforce decision).
        </p>
        <p>
          Human review decision decides content. Human review approval (approve content). Human review rejection (reject content). Human review enforcement (enforce decision). Human review tracking (track decisions).
        </p>

        <h3 className="mt-6">Policy Enforcement</h3>
        <p>
          Policy enforcement enforces content policies. Policy enforcement (enforce policies). Policy verification (verify policies). Policy reporting (report on policies). Policy audit (audit policies).
        </p>
        <p>
          Policy verification verifies content policies. Policy verification (verify policies). Policy reporting (report on policies). Policy audit (audit policies). Policy improvement (improve policies).
        </p>
        <p>
          Policy reporting reports on content policies. Policy reporting (report policies). Policy analysis (analyze policies). Policy enforcement (enforce policies). Policy improvement (improve policies).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/content-moderation-service/moderation-pipeline.svg"
          alt="Moderation Pipeline"
          caption="Figure 2: Moderation Pipeline — Pre-moderation, post-moderation, and reactive moderation"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Appeal Management</h3>
        <p>
          Appeal management manages appeals. Appeal submission (submit appeal). Appeal review (review appeal). Appeal decision (decide appeal). Appeal enforcement (enforce appeal decision).
        </p>
        <p>
          Appeal submission enables users to submit appeals. Appeal submission (submit appeal). Appeal processing (process appeal). Appeal decision (decide appeal). Appeal enforcement (enforce appeal decision).
        </p>
        <p>
          Appeal review reviews appeals. Appeal review (review appeal). Appeal investigation (investigate appeal). Appeal decision (decide appeal). Appeal enforcement (enforce appeal decision).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/content-moderation-service/ml-moderation.svg"
          alt="ML-Based Moderation"
          caption="Figure 3: ML-Based Moderation — Models, thresholds, and human review"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Content moderation design involves trade-offs between comprehensiveness and complexity, automation and manual control, and enforcement and prevention. Understanding these trade-offs enables informed decisions aligned with safety needs and platform constraints.
        </p>

        <h3>Moderation: Comprehensive vs. Simple</h3>
        <p>
          Comprehensive moderation (comprehensive moderation). Pros: Comprehensive (comprehensive moderation), effective (effective moderation). Cons: Complex (complex moderation), expensive (expensive to implement). Best for: Safety-intensive (high-risk platforms).
        </p>
        <p>
          Simple moderation (simple moderation). Pros: Simple (simple moderation), cheap (cheap to implement). Cons: Not comprehensive (not comprehensive moderation), ineffective (ineffective moderation). Best for: Non-safety (low-risk platforms).
        </p>
        <p>
          Hybrid: comprehensive for high-risk, simple for low-risk. Pros: Best of both (comprehensive for high-risk, simple for low-risk). Cons: Complexity (two moderation types). Best for: Most production systems.
        </p>

        <h3>Review: Automated vs. Human</h3>
        <p>
          Automated review (automate review). Pros: Efficient (automate review), fast (fast review). Cons: Complex (complex automation), expensive (expensive to implement). Best for: High-volume (high review volume).
        </p>
        <p>
          Human review (manual review). Pros: Simple (simple review), cheap (cheap to implement). Cons: Inefficient (manual review), slow (slow review). Best for: Low-volume (low review volume).
        </p>
        <p>
          Hybrid: automated for high-volume, human for low-volume. Pros: Best of both (efficient for high-volume, simple for low-volume). Cons: Complexity (two review types). Best for: Most production systems.
        </p>

        <h3>Enforcement: Strict vs. Lenient</h3>
        <p>
          Strict enforcement (strict enforcement). Pros: Effective (effective enforcement), safe (safe enforcement). Cons: Complex (complex enforcement), expensive (expensive to implement). Best for: Safety-intensive (high-safety platforms).
        </p>
        <p>
          Lenient enforcement (lenient enforcement). Pros: Simple (simple enforcement), cheap (cheap to implement). Cons: Not effective (not effective enforcement), unsafe (unsafe enforcement). Best for: Non-safety (low-safety platforms).
        </p>
        <p>
          Hybrid: strict for high-risk, lenient for low-risk. Pros: Best of both (strict for high-risk, lenient for low-risk). Cons: Complexity (two enforcement types). Best for: Most production systems.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/admin-moderation/content-moderation-service/moderation-comparison.svg"
          alt="Moderation Comparison"
          caption="Figure 4: Moderation Comparison — Comprehensive vs. simple, automated vs. human"
          width={1000}
          height={450}
        />

        <h3>Prevention: Proactive vs. Reactive</h3>
        <p>
          Proactive prevention (prevent before it happens). Pros: Effective (prevent issues), proactive (proactive prevention). Cons: Complex (complex prevention), expensive (expensive to implement). Best for: Prevention-intensive (high-prevention platforms).
        </p>
        <p>
          Reactive prevention (react to issues). Pros: Simple (simple prevention), cheap (cheap to implement). Cons: Not effective (don&apos;t prevent issues), reactive (reactive prevention). Best for: Non-prevention (low-prevention platforms).
        </p>
        <p>
          Hybrid: proactive for high-risk, reactive for low-risk. Pros: Best of both (proactive for high-risk, reactive for low-risk). Cons: Complexity (two prevention types). Best for: Most production systems.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement comprehensive moderation:</strong> Automated moderation, human review, policy enforcement, ML-based detection. Comprehensive moderation.
          </li>
          <li>
            <strong>Implement human review:</strong> Human review workflow, human review investigation, human review decision, human review enforcement. Human review.
          </li>
          <li>
            <strong>Implement policy enforcement:</strong> Policy enforcement, policy verification, policy reporting, policy audit. Policy enforcement.
          </li>
          <li>
            <strong>Implement ML-based detection:</strong> ML models, ML thresholds, human review, ML enforcement. ML-based detection.
          </li>
          <li>
            <strong>Implement appeal processes:</strong> Appeal submission, appeal review, appeal decision, appeal enforcement. Appeal processes.
          </li>
          <li>
            <strong>Implement content safety:</strong> Safety policies, safety enforcement, safety verification, safety reporting. Content safety.
          </li>
          <li>
            <strong>Implement moderation tracking:</strong> Moderation tracking, moderation reporting, moderation audit, moderation improvement. Moderation tracking.
          </li>
          <li>
            <strong>Implement policy tracking:</strong> Policy tracking, policy reporting, policy audit, policy improvement. Policy tracking.
          </li>
          <li>
            <strong>Monitor moderation:</strong> Monitor moderation, monitor enforcement, monitor appeals, monitor safety. Moderation monitoring.
          </li>
          <li>
            <strong>Implement moderation audit:</strong> Moderation audit, audit trail, audit reporting, audit verification. Moderation audit.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Incomplete moderation:</strong> Don&apos;t moderate all content. Solution: Comprehensive moderation (automated, human, policy, ML).
          </li>
          <li>
            <strong>No human review:</strong> Don&apos;t enable human review. Solution: Human review (workflow, investigation, decision, enforcement).
          </li>
          <li>
            <strong>No policy enforcement:</strong> Don&apos;t enforce policies. Solution: Policy enforcement (enforcement, verification, reporting, audit).
          </li>
          <li>
            <strong>No ML-based detection:</strong> Don&apos;t detect harmful content. Solution: ML-based detection (models, thresholds, review, enforcement).
          </li>
          <li>
            <strong>No appeal processes:</strong> Don&apos;t enable appeals. Solution: Appeal processes (submission, review, decision, enforcement).
          </li>
          <li>
            <strong>No content safety:</strong> Don&apos;t ensure content safety. Solution: Content safety (policies, enforcement, verification, reporting).
          </li>
          <li>
            <strong>No moderation tracking:</strong> Don&apos;t track moderation. Solution: Moderation tracking (tracking, reporting, audit, improvement).
          </li>
          <li>
            <strong>No policy tracking:</strong> Don&apos;t track policies. Solution: Policy tracking (tracking, reporting, audit, improvement).
          </li>
          <li>
            <strong>No moderation monitoring:</strong> Don&apos;t monitor moderation. Solution: Moderation monitoring (moderation, enforcement, appeals, safety).
          </li>
          <li>
            <strong>No moderation audit:</strong> Don&apos;t audit moderation. Solution: Moderation audit (audit, audit trail, reporting, verification).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Automated Moderation</h3>
        <p>
          Automated moderation for content moderation. Automated moderation (automate moderation). Automated enforcement (enforce moderation). Automated appeals (appeal moderation). Automated prevention (prevent moderation abuse).
        </p>

        <h3 className="mt-6">Human Review</h3>
        <p>
          Human review for content review. Human review (review content). Human review enforcement (enforce review). Human review appeals (appeal review). Human review prevention (prevent review abuse).
        </p>

        <h3 className="mt-6">Policy Enforcement</h3>
        <p>
          Policy enforcement for content policies. Policy enforcement (enforce policies). Policy verification (verify policies). Policy reporting (report on policies). Policy audit (audit policies).
        </p>

        <h3 className="mt-6">ML-Based Detection</h3>
        <p>
          ML-based detection for harmful content. ML models (detect harmful content). ML thresholds (auto-action based on confidence). Human review (edge cases to moderators). ML enforcement (enforce ML detection).
        </p>

        <h3 className="mt-6">Content Safety</h3>
        <p>
          Content safety for content safety. Safety policies (define safety policies). Safety enforcement (enforce safety). Safety verification (verify safety). Safety reporting (report on safety).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle content moderation at scale (millions of pieces of content daily) while maintaining quality?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement tiered moderation architecture. Automated moderation handles 90%+ of content using ML models (hate speech, nudity, violence, spam detection) with high-confidence auto-actions. Human moderators review edge cases (low-confidence ML detections, appeals, high-impact content from VIP users). Queue prioritization routes urgent content (live streams, viral content, high report counts) to top of queue. The key insight: don&apos;t treat all content equally—risk-based prioritization ensures limited human moderator time focuses on highest-risk content. Implement moderator tools for efficiency (keyboard shortcuts, bulk actions, decision templates, context panels showing user history). Track moderator throughput (items/hour) but balance against quality metrics (accuracy, consistency). At extreme scale, consider specialized moderator teams (different teams for different content types or regions). Critical: implement moderator wellness programs—reviewing harmful content causes psychological harm, implement rotation, limits on daily exposure, and mental health support.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cross-cultural content moderation for global platforms with diverse community standards?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement region-aware moderation with cultural context. Region-specific policies: what&apos;s acceptable varies by culture (political speech, religious content, nudity standards). Local moderators: hire moderators from each region who understand cultural context and language nuances—outsiders miss context that locals understand immediately. Cultural context training: even with local moderators, provide ongoing training on edge cases and policy interpretations. The critical challenge: balancing universal human rights (no child exploitation, no incitement to violence) with cultural variation (political speech, religious criticism, artistic nudity). Implement appeal process with regional escalation—users should be able to appeal to moderators from their region. Document cultural variations in guidelines so moderators understand why same content might be treated differently in different regions. The key insight: &quot;global&quot; doesn&apos;t mean &quot;one size fits all&quot;—effective moderation respects cultural differences while maintaining core safety standards.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement ML-based moderation that improves over time while avoiding common pitfalls?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement human-in-the-loop ML system. ML models detect harmful content (hate speech, harassment, spam, nudity, violence) with confidence scores. Auto-action high-confidence detections (both approve and remove) to reduce moderator load. Send low-confidence and edge cases to human review—this is critical for model improvement. Implement continuous learning: moderator decisions become training data, retrain models regularly (weekly or monthly) with new labeled data. Common pitfalls to avoid: over-reliance on ML (models make mistakes, especially with sarcasm, context, emerging slang), model drift (content patterns change, models degrade without retraining), bias (models may perform worse on certain demographics, dialects, or content types—audit for disparate impact). Implement model monitoring: track precision/recall by content type, demographic, and time. Maintain human oversight: ML should augment moderators, not replace them. For new abuse patterns, implement rapid model update process—don&apos;t wait for monthly retrain cycle when new harassment technique emerges.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement policy enforcement that is consistent, fair, and adaptable to evolving community standards?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement structured policy enforcement framework. Policy enforcement: clear guidelines defining what content violates policies, with examples for each violation type. Policy verification: quality assurance program where senior moderators review sample of decisions to ensure consistency across moderators. Policy reporting: track enforcement metrics (violations by type, enforcement actions taken, appeal outcomes) to identify policy gaps or inconsistent enforcement. Policy audit: regular policy reviews (quarterly) to ensure policies remain relevant as community and norms evolve. The critical challenge: consistency vs. flexibility—policies must be applied consistently (same violation = same consequence) but allow moderator discretion for edge cases. Document enforcement precedents—when novel situation arises, decision becomes precedent for future similar cases. Implement policy change management: when policies change, communicate clearly to users and moderators, provide training on new policies, consider grace period for new policies. Track policy effectiveness: are violations decreasing after policy changes? Are users reporting better understanding of rules?
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design appeal processes for content moderation decisions that balance user rights with operational efficiency?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement structured appeal workflow with clear stages. Appeal submission: simple form where users explain why they believe decision was wrong, with option to provide additional context or evidence. Require users to specify grounds for appeal (mistaken identity, context missing, policy misunderstanding, new evidence) rather than generic &quot;I disagree.&quot; Appeal review: assign to different moderator than original decision (fresh perspective reduces confirmation bias), provide full context (original content, decision rationale, user history, community guidelines), set SLA based on impact (24 hours for monetization impacts, 72 hours for standard content). Appeal decision: uphold (original decision stands with explanation), overturn (restore content, notify user), or modify (reduce penalty). Critical: track appeal outcomes—high overturn rates for specific moderators or content types indicate training needs or unclear guidelines. The operational challenge: appeals are resource-intensive (require human review) but essential for user trust. Implement appeal triage: frivolous appeals (same issue already appealed, no new evidence) can be fast-rejected, complex appeals get more review time. For high-stakes appeals (channel termination, monetization suspension), consider appeal panel or senior reviewer.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure content safety across diverse content types (text, images, video, live streams) with different risk profiles?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement content-type-specific moderation strategies. Text: ML for hate speech, harassment, threats with keyword filtering as backup. Images: computer vision for nudity, violence, prohibited symbols with human review for edge cases. Video: combination of frame sampling (check key frames), audio transcription (check spoken content), and metadata analysis (title, description, tags). Live streams: highest risk category—implement real-time monitoring with ability to interrupt stream, require trusted status for new streamers, use both automated detection and human moderators watching active streams. The key insight: different content types have different risk profiles and require different approaches. Live video is highest risk (immediate harm potential, large audiences) requiring most resources. User-generated comments on established content are lower risk. Implement risk-based resource allocation: more moderation resources for higher-risk content types. Track safety metrics by content type: violation rates, time-to-detection, time-to-removal. Adjust resource allocation based on metrics—if live stream violations increasing, shift more moderators to live monitoring.
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
              Meta Safety — Safety Resources
            </a>
          </li>
          <li>
            <a
              href="https://support.twitter.com/articles/safety-and-security"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Safety — Safety Resources
            </a>
          </li>
          <li>
            <a
              href="https://support.google.com/youtube/answer/2802032"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube Safety — Safety Resources
            </a>
          </li>
          <li>
            <a
              href="https://www.nist.gov/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NIST — Security Standards
            </a>
          </li>
          <li>
            <a
              href="https://www.isaca.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ISACA — Security Resources
            </a>
          </li>
          <li>
            <a
              href="https://www.sans.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              SANS — Security Resources
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
