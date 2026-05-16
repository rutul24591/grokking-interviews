"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-ai-generated-content-moderation-ui",
  title: "Design an AI-Generated Content Moderation UI",
  description:
    "Architecture for a content moderation system: fast classifier plus LLM scorer pipeline, policy-based routing, human review queue with SLA, appeal system, feedback-driven classifier retraining, and drift detection.",
  category: "high-level-design",
  subcategory: "ai-modern-systems",
  slug: "ai-generated-content-moderation-ui",
  wordCount: 5100,
  readingTime: 30,
  lastUpdated: "2026-05-16",
  tags: ["hld", "content-moderation", "llm", "classifier", "trust-safety", "review-queue", "appeals"],
  relatedTopics: ["ai-model-comparison-testing-interface", "ai-prompt-management-ui"],
};

export default function AiGeneratedContentModerationUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Content moderation is a high-stakes, high-throughput problem. A large social
        platform publishes millions of pieces of content per day, each of which could
        contain harmful material. No human team can review this volume at interactive
        speed — AI classifiers handle the throughput. But classifiers are imperfect:
        false positives (flagging benign content) harm users and create a hostile
        experience; false negatives (missing violations) allow harmful content to remain
        visible. The moderation UI is the operational interface between the AI system and
        human moderators: it presents AI decisions for human review, captures corrections
        that improve the model, gives policy operators controls to adjust thresholds without
        code changes, and tracks SLA compliance across the review queue.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/ai-generated-content-moderation-ui-architecture.svg"
        alt="Content moderation architecture showing detection pipeline (fast binary classifier, LLM scorer for borderline cases, policy-based routing), human review queue UI with SLA tracking, reviewer dashboard with AI score context, appeal system, and feedback-to-training loop"
        caption="Moderation architecture: two-stage detection (fast classifier + LLM scorer), policy routing, human review queue, appeal system, and classifier retraining feedback loop"
      />

      <h2>Clarifying the Requirements</h2>
      <p>
        Content moderation requirements vary significantly by platform type and content type:
      </p>
      <p>
        <strong>Synchronous or asynchronous?</strong> Synchronous moderation (block content
        before it's published) prevents harm but adds latency to every publish action.
        Asynchronous moderation (publish immediately, review and remove if violating)
        accepts that some violating content is briefly visible. The choice depends on
        the harm level: child safety content demands synchronous blocking; spam and low-level
        policy violations can be handled asynchronously.
      </p>
      <p>
        <strong>What content modalities?</strong> Text-only moderation is the baseline.
        Image and video moderation require different models (computer vision classifiers)
        and have different latency characteristics (video transcription adds 10–30 seconds).
        Multimodal content (text + image, where context is needed across modalities to
        detect harm) is the hardest to classify accurately.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Define the precision/recall policy upfront. Higher recall (catch more violations)
        means more false positives (more benign content removed or queued for review).
        Higher precision (fewer false positives) means more false negatives (more violating
        content slips through). This policy is a product and legal decision, not a
        technical one — the technical system should implement whatever threshold the
        policy specifies, with UI controls that allow policy operators to adjust thresholds
        without engineering changes.
      </HighlightBlock>

      <h2>Two-Stage Detection Pipeline</h2>
      <p>
        Content moderation at scale requires a two-stage pipeline that balances speed
        and accuracy. Running an LLM scorer on every submission is too slow and expensive
        (200–500ms per item at LLM latency, $0.01–0.10 per item at LLM pricing). Running
        only a fast binary classifier misses subtle violations that require contextual
        understanding.
      </p>
      <p>
        <strong>Stage 1: Fast binary classifier.</strong> A fine-tuned small model
        (BERT-base or DistilBERT) or a traditional ML classifier (gradient boosting on
        TF-IDF features) classifies each submission as clearly safe, clearly violating,
        or borderline within 20–50ms. Clearly safe content is auto-passed. Clearly
        violating content is auto-blocked (for synchronous moderation) or flagged and
        hidden pending review (for asynchronous). Borderline content (within a configurable
        confidence band around the decision boundary) proceeds to Stage 2.
      </p>
      <HighlightBlock as="p" tier="important">
        The borderline band is the key tuning parameter. A narrow band (only very-close-to-boundary
        items go to Stage 2) means Stage 2 processes fewer items but many borderline cases
        are decided by the less accurate Stage 1 classifier. A wide band means Stage 2
        processes more items with higher accuracy but at higher cost and latency. For most
        platforms, routing 10–20% of submissions to Stage 2 (those with classifier confidence
        between 0.3 and 0.7) is a practical balance. Tune the band based on observed
        disagreement rates between Stage 1 decisions and human reviewer decisions.
      </HighlightBlock>
      <p>
        <strong>Stage 2: LLM scorer.</strong> An LLM prompt presents the content with
        a detailed policy description and asks the LLM to: (1) classify the content
        by violation category (hate speech, harassment, spam, misinformation, CSAM),
        (2) assign a confidence score per category, and (3) provide a one-sentence
        justification that the human reviewer sees in the review UI. The LLM scorer
        runs only for borderline items, keeping the cost and latency impact bounded.
        The output routes: high confidence violation → human review queue (with AI score
        and justification context); high confidence safe → auto-pass; still uncertain
        → human review queue (with uncertainty flag).
      </p>

      <h2>Policy-Based Routing</h2>
      <p>
        Routing decisions should be driven by configurable policy rules, not hardcoded
        thresholds. The policy engine takes the classifier output (category, confidence)
        and applies a rule table: given category X at confidence above threshold Y,
        take action Z. Actions: auto-block (synchronous, before publish), shadow-block
        (hide content without notifying user — used for spam where hiding engagement
        reduces spammer incentives), queue-for-review (human review within SLA), auto-pass.
      </p>
      <p>
        The policy table is editable by trust and safety operators through a web interface —
        no code deployment required. Changes take effect immediately (the policy engine
        loads the table at request time, or on a short TTL cache). Operators can adjust
        thresholds, add new categories, or override routing for specific content types
        (e.g., "apply stricter thresholds on content from new accounts under 7 days old").
      </p>
      <p>
        Velocity signals augment classifier confidence: a user who has posted 50 pieces
        of content in the last hour (an unusual rate) has each piece routed to the review
        queue regardless of classifier confidence. A user with a history of appeals that
        were sustained in their favor has their borderline content auto-passed. These
        signals are part of the routing policy, not the classifier — they're account-level
        context that the per-item classifier cannot see.
      </p>

      <h2>Human Review Queue</h2>
      <p>
        The review queue is the operational dashboard for trust and safety teams. Each
        item in the queue shows: the content (with context — the thread it appears in,
        the user's posting history), the AI score (category, confidence, LLM justification),
        the queue age (time since submission), and action buttons (remove, approve, escalate,
        add to training set).
      </p>
      <p>
        Queue prioritization: not all items in the queue have equal urgency. Items with
        high classifier confidence for severe categories (CSAM, credible threats of violence)
        are shown first regardless of queue age. Items approaching their SLA deadline
        are surfaced prominently. A reviewer's current capacity (how many items they've
        reviewed in the last hour) affects how many items they're shown simultaneously,
        preventing reviewer fatigue from degrading decision quality.
      </p>
      <HighlightBlock as="p" tier="important">
        SLA tracking: each item has a target review time (the SLA). As items age past
        their SLA, they turn amber then red in the queue UI. A real-time dashboard shows
        the current queue length, the percentage within SLA, the average review time,
        and reviewer capacity utilization. When the queue is at risk of SLA breach (queue
        length is growing faster than it's being processed), an alert fires to the trust
        and safety operations lead, who can call in additional reviewers or temporarily
        lower auto-pass thresholds to reduce queue inflow.
      </HighlightBlock>
      <p>
        Reviewer quality tracking: inter-rater agreement (when two reviewers see the same
        item, do they agree?) is a quality signal for reviewer calibration. Items are
        occasionally shown to two reviewers for calibration purposes — without the
        reviewers knowing it's a calibration item. Disagreements are surfaced in team
        calibration sessions and used to clarify ambiguous policy edge cases. Individual
        reviewer accuracy is tracked against a gold set (items with known correct decisions)
        to identify reviewers who may need retraining.
      </p>

      <h2>Appeal System</h2>
      <p>
        Users whose content is removed (or accounts actioned) must have a path to contest
        the decision. The appeal system receives the user's appeal, routes it to a human
        reviewer (not the same reviewer who made the original decision), and communicates
        the outcome.
      </p>
      <p>
        The appeal review UI shows: the original content, the original reviewer's decision
        and note, the user's appeal statement, and the AI score context. The reviewer
        can sustain the original decision (violation stands), overturn it (content is
        restored), or escalate to a policy expert for ambiguous edge cases.
      </p>
      <p>
        Appeals routing is separate from the regular moderation queue — appeals have
        different SLAs (typically 72 hours for users vs 10 minutes for new content),
        different reviewer assignments (senior reviewers handle appeals), and different
        feedback signals (sustained appeals indicate correct decisions; overturned appeals
        are false positives that should inform classifier retraining).
      </p>

      <h2>Feedback Loop and Classifier Retraining</h2>
      <p>
        Human reviewer decisions are the primary training signal for improving the classifier.
        Each review action — remove (violation confirmed), approve (false positive) —
        creates a labeled example: (content, label). The feedback pipeline aggregates
        these labels, applies quality filters (exclude labels from reviewers with below-average
        calibration accuracy), and batches them for classifier retraining.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The retraining pipeline must handle class imbalance carefully. Violating content
        represents a small fraction of all content, and reviewer-labeled examples skew
        toward borderline items (which are the ones that reach the queue). A classifier
        trained only on these examples will overfit to borderline cases and perform poorly
        on clearly-violating content it was never trained on. Maintain a training dataset
        that includes: confirmed violations from the review queue, auto-passed content
        (negative examples, sampled periodically to prevent class drift), historical
        training data, and synthetic examples for rare violation categories. Rebalance
        the dataset before each training run.
      </HighlightBlock>
      <p>
        Shadow deployment for new classifiers: before deploying a new classifier version
        to production, run it in shadow mode — all content passes through both the current
        and new classifiers, but only the current classifier's decision is used for routing.
        Compare the two classifiers' outputs across the live traffic distribution. If
        the new classifier increases false positives by more than a configurable threshold
        (or decreases recall on confirmed violations), it doesn't promote to production.
        This validation catches regressions before they affect users.
      </p>

      <h2>Drift Detection and Monitoring</h2>
      <p>
        Content distribution shifts over time as bad actors adapt their tactics. A classifier
        trained on last year's spam patterns may miss this year's spam (which has evolved
        to evade detection). Drift detection monitors for this.
      </p>
      <p>
        Statistical drift: track the distribution of classifier confidence scores over
        time. A shift in the distribution (more items clustered near the decision boundary)
        indicates the classifier is becoming less certain — a sign of content distribution
        drift. Alert when the rolling 7-day confidence distribution diverges significantly
        from the baseline.
      </p>
      <p>
        Human review rate: if the human review queue is growing despite no change in
        platform traffic, the classifier is routing more items to human review — either
        because content distribution has shifted or because the classifier's performance
        has degraded. Track the human review rate as a primary operational metric.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How do you handle content moderation in a language the classifier wasn't trained on?</h3>
      <p>
        Two approaches: (1) Machine translation followed by classification — translate
        the content to English (or whatever language the classifier is trained on) before
        classification. This works for most languages but degrades for low-resource
        languages where translation quality is poor. (2) Multilingual classifier — a
        model like mBERT or XLM-R trained on 100+ languages directly without translation.
        Multilingual models have slightly lower accuracy per language than monolingual
        models but eliminate the translation quality dependency. For content in languages
        with high harm risk, route all borderline content to human reviewers who speak
        the language rather than relying on the classifier alone.
      </p>

      <h3>Q: How do you prevent reviewer bias from accumulating in the training data?</h3>
      <p>
        Reviewer decisions that are used as training labels have selection bias: they
        come from the subset of items that reached the review queue, not the full content
        distribution. They also carry individual reviewer biases (reviewer A may be stricter
        about certain violation types than reviewer B). Mitigate this with: inter-rater
        agreement sampling (items reviewed by multiple reviewers; only labels with consensus
        are used for training), calibration reviews (gold set items with known correct
        labels, used to weight each reviewer's labels by their accuracy), and periodic
        sampling of auto-passed content for manual review (to provide negative examples
        from the full distribution, not just the borderline subset). Track per-reviewer
        false positive and false negative rates and down-weight labels from low-accuracy
        reviewers in the training data.
      </p>

      <h3>Q: How do you handle real-time content that requires cross-post context (coordinated inauthentic behavior)?</h3>
      <p>
        Individual posts may be policy-compliant but collectively represent coordinated
        inauthentic behavior (a network of accounts amplifying specific content). Per-post
        classification cannot detect this. Graph-level analysis at a slightly longer
        time horizon (minutes) identifies coordination signals: unusual amplification
        patterns, accounts posting identical content, synchronized account creation
        followed by coordinated activity. These graph signals are computed by a separate
        anomaly detection system that flags groups of accounts or posts for human review
        without per-post classification. The moderation UI includes a "coordinated behavior"
        review mode that shows the suspected network's posts together, making the pattern
        visible to reviewers who can then take group action (remove all posts, suspend all
        accounts in the network) rather than reviewing each post individually.
      </p>

      <h2>Trauma-Informed Reviewer UX</h2>
      <p>
        Human content moderators review disturbing material daily — graphic violence,
        sexual abuse imagery, self-harm content. Clinical research on content moderation
        teams documents elevated rates of PTSD, anxiety, and vicarious traumatization.
        The reviewer UX has a direct impact on these outcomes and therefore on team
        health, accuracy, and retention. A trauma-informed design approach applies
        specific UI interventions that reduce unnecessary exposure without compromising
        review accuracy.
      </p>
      <p>
        Graduated exposure controls: for graphic image and video content, the reviewer
        UI should not display the content at full resolution and full brightness immediately.
        The default is a low-saturation, blurred thumbnail. The reviewer decides whether
        to view at full quality for judgment. For audio content (audio posts with hate
        speech or harassment), text transcription is shown by default; the audio is
        playable but not auto-playing. For video, text-based frame annotations or the
        LLM score justification may allow the reviewer to make a determination without
        watching the full video. Always-visible exposure is appropriate for mild categories
        (spam, misinformation) but not for CSAM, graphic violence, or self-harm content.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Mandatory session limits and psychological safety features are not optional amenities.
        Reviewers who process disturbing content without enforced breaks suffer accelerating
        desensitization, which both harms the reviewer and degrades their decision accuracy
        over longer sessions. Implement hard session limits: after 90 minutes of active
        review, the queue interface is replaced with a mandatory break screen. After a
        configurable number of CSAM review sessions per week, block further assignments
        and route to the reviewer's wellness manager. Psychological first aid resources
        (access to confidential counseling, peer support contacts) should be accessible
        from within the review interface with one click, not buried in HR documentation.
      </HighlightBlock>
      <p>
        Review category specialization reduces unnecessary trauma exposure. Not every
        reviewer needs to see every content category. A reviewer who specializes in
        spam and misinformation should not be assigned CSAM or graphic violence reviews.
        Category specialization also improves accuracy — reviewers develop expertise
        in their assigned categories and make more consistent decisions than generalists
        who rarely encounter a given category. Maintain separate specialist queues with
        dedicated routing and track per-category reviewer accuracy separately.
      </p>

      <h2>Policy Transparency and User Communication</h2>
      <p>
        Users whose content is removed or accounts actioned frequently don't understand
        why. A removal notice that says "Your post was removed for violating our Community
        Guidelines" without specifying which guideline or what about the content violated
        it leaves the user unable to avoid the same issue in the future — and frustrated
        enough to appeal even when the removal was correct. Well-designed user communication
        reduces appeal volume and improves user understanding of platform policies.
      </p>
      <p>
        The reviewer interface for removal decisions requires selecting: the specific policy
        category (hate speech, harassment, spam, misinformation), the sub-category (targeted
        harassment vs coordinated harassment; medical misinformation vs election misinformation),
        and optionally a short excerpted reason (quoting the specific phrase that triggered
        the violation, with care not to re-display graphic content back to the user in
        the removal notice). These selections are passed to a templated notification
        generator that produces a user-facing removal notice using the platform's policy
        language rather than internal enforcement terminology.
      </p>
      <p>
        Recidivism tracking: the reviewer's decision dashboard shows whether the content
        creator has prior violations, how many, and of what category. Repeat violations
        in the same category suggest the user doesn't understand the policy, the policy
        is ambiguous, or the user is deliberately violating it. Reviewers can annotate
        a removal as "first offense" (treat as educational, send detailed policy explanation),
        "repeat offense" (escalate enforcement from content removal to account action),
        or "escalation needed" (pattern suggests adversarial or coordinated behavior,
        route to trust and safety leadership).
      </p>

      <h2>Cross-Language Moderation Challenges</h2>
      <p>
        Content moderation at global scale requires enforcing the same policy across
        dozens of languages, dialects, and cultural contexts. A phrase that is neutral
        in one language may be a slur in another dialect of the same language. Dog
        whistles (coded language that signals meaning to an in-group while appearing
        innocuous to classifiers trained on standard text) evolve quickly and require
        native speaker expertise to detect. No classifier trained on mainstream text
        corpora captures dog whistles reliably.
      </p>
      <p>
        Language-specific policy interpretation: the platform's content policy must be
        interpreted in the cultural context of each language community. A ban on "derogatory
        terms for ethnic groups" requires knowing which terms are derogatory in each
        language — a list maintained by native-speaker policy reviewers, not derived
        from translation. The policy team for each major language market defines a
        lexicon of high-risk terms, slurs, and known dog whistles that are added to
        the classifier's feature set and to the keyword blocklist reviewed synchronously.
      </p>
      <HighlightBlock as="p" tier="important">
        Human review queues should be routed by language to native-speaker reviewers.
        Machine translation before review introduces two failure modes: translation errors
        that change the meaning of borderline content (causing incorrect allow or block
        decisions), and loss of prosody, register, and cultural context that is essential
        for judging harassment severity. For languages with insufficient reviewer capacity,
        partner with specialist trust and safety contractors who have native-speaker
        expertise in those languages rather than relying on translation. Track per-language
        review accuracy and SLA separately — low-resource language queues frequently have
        longer review times and lower accuracy that are masked by aggregate metrics.
      </HighlightBlock>

      <h3>Q: How do you handle moderation of audio and video content at scale without watching every video?</h3>
      <p>
        Audio and video moderation relies on preprocessing pipelines that extract multiple
        signals without requiring a human to watch the full content. For audio: speech-to-text
        transcription (Whisper or provider APIs) runs asynchronously on upload, producing
        a text transcript that can be classified by the text moderation pipeline. For video:
        frame extraction (sampling 1 frame per second for a 30-second video produces 30
        frames) runs each frame through a fast image classifier. Audio track transcription
        runs in parallel. The classification pipeline scores based on transcript, frame-level
        signals, and metadata (video title, description, tags). Human reviewers see the
        transcript, flagged frames (not the full video), and audio playback controls rather
        than a required full-video watch. Only when the transcript or frame flags are
        insufficient for a decision does the reviewer watch the full video segment.
      </p>

      <h3>Q: How do you set precision and recall thresholds for different violation categories?</h3>
      <p>
        Precision and recall trade-offs are fundamentally different for different violation
        categories based on the relative harms. CSAM requires maximum recall (near-zero
        false negatives acceptable even at the cost of many false positives requiring
        human review) — missing a single instance is an unacceptable harm. Spam requires
        high precision (false positives degrade the user experience for legitimate posters
        and erode trust in the moderation system) because the harm from missed spam is
        low. Hate speech operates in between: high recall for targeted slurs and threats,
        moderate precision for ambiguous content requiring cultural context. These thresholds
        are set by trust and safety policy leadership in collaboration with legal and
        establish the acceptable false-positive rate per category that the moderation
        team's review capacity must be able to handle. The technical system implements
        whatever threshold policy specifies; the UI exposes threshold controls to policy
        operators so they can adjust without engineering changes when regulatory requirements
        or platform standards change.
      </p>
    </ArticleLayout>
  );
}
