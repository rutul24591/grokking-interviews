"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-ai-feedback-loop",
  title: "AI Feedback Loop UI",
  description:
    "Collecting user feedback on AI outputs for continuous model improvement, RLHF labeling, and quality monitoring.",
  category: "low-level-design",
  subcategory: "ai-modern-systems",
  slug: "ai-feedback-loop-ui",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "ai", "feedback", "rlhf", "quality", "improvement"],
  relatedTopics: ["streaming-chat-ui", "ai-assisted-search-qa-ui"],
};

export default function AIFeedbackLoopArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          A deployed AI assistant generates thousands of responses per day. Some are excellent; some are wrong, unhelpful, or inappropriate. Without a feedback mechanism, the product team has no systematic way to identify which responses were bad, what categories of failures are occurring, or whether the model's quality is improving or degrading across deployments. The engineering team is flying blind.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          User feedback is the highest-signal data source available for AI quality assessment. Unlike automated metrics (BLEU score, perplexity), user feedback directly measures whether the AI helped the user accomplish their goal. But feedback collection is inherently in tension with user experience: every modal, every required rating, every feedback form adds friction that reduces engagement. The challenge is designing a feedback system that maximizes signal quality and volume while minimizing disruption to the primary task.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The feedback data serves multiple downstream uses. For immediate quality monitoring, dashboards track feedback rates by query category and response characteristics, alerting the team to regressions. For RLHF (Reinforcement Learning from Human Feedback), curated preference pairs (human judges comparing two responses and selecting the better one) provide training signal for reward models. For RAG systems, low-rated responses with citations indicate retrieval failures. For prompt engineering, negative feedback clusters around specific query patterns that the current prompt handles poorly.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Explicit assumptions:</strong> Users are willing to provide lightweight feedback (a single click) and occasionally more detailed feedback for strong reactions (very good or very bad). Feedback is attributed to specific responses (not just general ratings). The feedback pipeline handles both synchronous (blocking on submission) and asynchronous (fire-and-forget) paths without degrading the user experience. Privacy controls allow users to opt out.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Micro-feedback:</strong> Thumbs up/down (or a single star/flag) available on every response. Submits with one click. No confirmation dialog.
          </li>
          <li>
            <strong>Structured feedback:</strong> After a negative rating, offer a categorized reason selection (Inaccurate, Incomplete, Off-topic, Harmful, Other) with optional free-text explanation.
          </li>
          <li>
            <strong>Correction submission:</strong> User can provide a better version of the response, which becomes a high-quality training example.
          </li>
          <li>
            <strong>Preference comparison:</strong> For A/B experiments, show two responses side-by-side and ask "which was more helpful?" This is the primary RLHF preference pair collection mechanism.
          </li>
          <li>
            <strong>Feedback revision:</strong> User can change a submitted rating within a short window (e.g., 5 minutes) before it becomes immutable.
          </li>
          <li>
            <strong>Aggregation dashboard:</strong> Internal analytics showing feedback rates, category distribution, quality trends over time, and response-level feedback browsing.
          </li>
          <li>
            <strong>Feedback acknowledgment:</strong> Periodically show users that their feedback has influenced improvements ("Your feedback helped us improve accuracy for this type of question").
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Friction minimization:</strong> The primary feedback action (thumbs up/down) must complete with one click and no page navigation. The submission must feel instantaneous to the user (optimistic UI update with fire-and-forget network request).
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Scale:</strong> Handle 10 million feedback submissions per day without degrading response latency. Feedback submission is an async write path, entirely decoupled from the AI inference path.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Privacy:</strong> No PII in feedback records unless the user explicitly provides it in the correction text. Anonymize userId to a hashed identifier in the feedback store. Provide opt-out that stops all feedback collection, not just explicit submissions.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Reliability:</strong> Feedback submissions must not be lost due to network errors. Use a write-ahead local queue (IndexedDB) with retry so that feedback submitted in offline or poor-network conditions is delivered when connectivity returns.
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">Feedback submitted on a streaming-in-progress response — must be attributed to the partial response and flagged as "early" feedback, not confused with feedback on the completed response.</HighlightBlock>
          <li>Spam feedback (same user thumbs-downing every response, or bot-generated feedback) — detect and filter anomalous feedback patterns before including in training data.</li>
          <li>Correction that is itself incorrect (user provides wrong information as a "better answer") — corrections go through a human review queue before being used as training examples, not ingested automatically.</li>
          <li>Contradictory feedback signals (thumbs up but says "inaccurate" in structured feedback) — store both signals faithfully; surface the contradiction in the review UI for human adjudication.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">The feedback UI lives as a small control cluster on each assistant response: thumbs up (👍), thumbs down (👎), and a copy button. Clicking thumbs down expands an inline form with category chips (single-tap reason selection) and an optional text area for a correction.</HighlightBlock>
<HighlightBlock as="p" tier="important">All feedback is submitted asynchronously via a fire-and-forget API call. The UI updates optimistically on click (button changes to filled/selected state) without waiting for the server.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          On the backend, the feedback write path is a separate lightweight service from the inference path. Feedback records flow through a Kafka/SQS queue into a data warehouse (BigQuery, Redshift) for analytics, into a human review queue for high-priority items (corrections, harmful content flags), and into the RLHF pipeline on a weekly/monthly batch cycle.
        </HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/ai-modern-systems/ai-feedback-loop-ui.svg"
          alt="AI feedback loop showing collection UI with thumbs up/down and correction form, 8-step feedback to training pipeline, feedback schema, analytics dashboard, and implicit vs explicit signals"
          caption="AI feedback loop showing collection UI with thumbs up/down and correction form, 8-step feedback to training pipeline, feedback schema, analytics dashboard, and implicit vs explicit signals"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Feedback Record Schema</h3>
        <HighlightBlock as="p" tier="important">
          Each feedback record captures: feedbackId (UUID), sessionId (anonymized, not userId), conversationId, messageId (the specific assistant message being rated), rating ('thumbsUp' | 'thumbsDown' | null for implicit-only feedback), categories (array of category strings from the reason selection: ['Inaccurate', 'Incomplete']), correction (optional string — the user's provided better answer), model (which model version generated the response), promptVersion (which system prompt was active), createdAt (timestamp), and context (the user's original question, stripped of PII, for debugging).
        </HighlightBlock>
        <p>
          Storing the promptVersion and model alongside feedback is critical for analytics. Without this attribution, you cannot answer "did feedback quality improve after deploying prompt v4?" or "is GPT-4 getting better ratings than the previous model?" Version attribution transforms feedback from a raw signal into an experiment result.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic UI and Fire-and-Forget Submission</h3>
        <p>
          The feedback UI updates immediately on click (optimistic state update) and submits the feedback record asynchronously. The fetch call to the feedback endpoint is not awaited — it runs in the background. If the network request fails (transient error, user went offline), the feedback is written to an IndexedDB queue. A service worker or next-page-load handler retries the queue. This pattern ensures near-zero loss rate for feedback submissions even on unreliable connections.
        </p>
        <p>
          The optimistic update is persisted to a feedback store (React state or Zustand) keyed by messageId, so the selected state (filled thumbs icon) persists if the user scrolls away and returns. If the revision window is still open, the controls allow changing the rating; after the revision window closes, the rating is locked (controls become disabled with a tooltip explaining they're finalized).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Progressive Feedback UI Design</h3>
        <p>
          The feedback UX follows a progressive disclosure pattern. Level 1 (always visible): small thumbs icons that appear on hover (desktop) or are always visible (mobile). Level 2 (on thumbs down): inline expansion of a category chip grid — single-tap chips like "Not accurate," "Too long," "Offensive." Submitting any chip completes the detailed feedback without requiring a text entry. Level 3 (optional, on "Other" or explicit "Provide correction"): a text area for free-form explanation and/or a better answer. Level 3 is optional, clearly labeled as such, and has a character limit to prevent abuse.
        </p>
        <p>
          This progressive structure is critical for feedback volume. Data shows that 5–15% of users will provide a thumbs rating on responses they feel strongly about. Of those, 30–50% will select a category chip when prompted immediately after the rating. Only 5–10% will write free text. Designing the form to require free text before submitting destroys volume. The category chips balance specificity (structured, analyzable data) with low friction (single tap).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Implicit Feedback Signals</h3>
        <p>
          Explicit feedback (thumbs up/down) has high signal quality but low volume. Most users never rate responses, even helpful ones. Implicit feedback signals augment explicit ratings by inferring quality from behavioral data: Did the user copy the response text? (Strong positive signal — they found it useful enough to use directly.) Did they immediately rephrase their question? (Negative signal — the response missed the mark.) Did they ask a follow-up that indicates the answer was incomplete? Did they abandon the conversation after receiving the response?
        </p>
        <p>
          Implicit signals are logged as structured events: copy_event (with character count), rephrase_event (within N seconds of receiving response), followup_question_event (semantic similarity to original question), session_abandonment_event. These events are attributed to the preceding response and aggregated with explicit feedback to produce a composite quality score. Implicit signals enable quality measurement even for the 85–95% of users who never click thumbs.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">RLHF Preference Data Collection</h3>
        <p>
          RLHF requires preference pairs: (prompt, responseA, responseB, preferred). These pairs train a reward model that scores response quality, which in turn provides a training signal for the policy model (the LLM) via reinforcement learning. The preference pairs are the highest-value training data but the hardest to collect at scale.
        </p>
        <p>
          Two collection strategies: A/B comparison UI (show both responses, ask which is better — requires deliberately generating two responses, doubling inference cost, but produces clean preference labels); and inferred comparison from ratings (when response A gets thumbs up and response B to a similar prompt gets thumbs down, infer A &gt; B — lower quality signal but zero incremental collection cost). Production systems use both: explicit comparison collection for high-priority query categories, inferred comparison for broad coverage.
        </p>
        <p>
          Corrections (where users provide a better response) are the most valuable RLHF data: they provide not just "this response was bad" but "here is what good looks like." However, corrections require human review before ingestion — users can provide incorrect corrections, corrections written in poor quality (typos, incomplete sentences), or corrections that address a different aspect of the question than the original response. A human review queue with labelers confirms whether each correction is actually better before it enters training data.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Analytics Dashboard</h3>
        <HighlightBlock as="p" tier="important">
          The feedback analytics dashboard serves multiple roles: quality monitoring (is the AI getting better or worse?), failure pattern identification (which query categories are getting the most thumbs down?), and experiment evaluation (did prompt v5 improve feedback rates?).
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Key metrics displayed: overall thumbs-up rate over time (primary quality signal), thumbs-up rate segmented by query category/intent, category distribution of negative feedback (which reason categories are most common?), correction submission rate (how often users want to provide a better answer — indicates systematic failure patterns), model comparison metrics (new model vs previous model feedback rates), and feedback volume (absolute number of ratings per day — confirms the feedback collection UI is surfacing to enough users).
        </HighlightBlock>
        <p>
          Anomaly detection on feedback rates: a significant drop in thumbs-up rate following a deployment is a strong signal of a regression. Automated alerting (Slack/email) when the rolling 24h thumbs-up rate drops more than 5 percentage points provides a safety net that catches regressions before they affect a large user population.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Feedback to Training Pipeline</h3>
        <p>
          The path from user feedback to model improvement has multiple stages: (1) Feedback collection (real-time, via the API). (2) Anonymization and PII scrubbing (strip any user identifiers and PII from correction text before storage). (3) Aggregation into analytics warehouse (daily batches for dashboards). (4) Human review queue routing (corrections above a quality threshold, flagged harmful content). (5) Curated dataset assembly (selecting high-quality preference pairs from labeled reviews). (6) Reward model training or fine-tuning (weekly/monthly cycle depending on data volume). (7) Evaluation against held-out test set. (8) A/B deployment with feedback monitoring to confirm improvement.
        </p>
        <p>
          The cycle time from user feedback to model improvement is typically weeks to months. Communicating this to users ("Your feedback makes our AI better — it takes a few weeks to show up") manages expectations and maintains user trust in the feedback mechanism.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Spam and Abuse Prevention</h3>
        <HighlightBlock as="p" tier="important">
          Feedback is a valuable signal that can be poisoned by spam or adversarial manipulation. A user who systematically down-rates all responses could artificially depress quality metrics. A coordinated group who up-rates a specific response to influence its promotion to training data could inject bad examples.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Defenses: rate limiting (max N ratings per user per hour); behavioral anomaly detection (users who rate 100% of responses are statistical outliers — flag their feedback for weight reduction); inter-rater agreement validation (if 80% of users rate a response positively but one user rates it negatively, the positive consensus is more reliable); and holding labeled data from untrusted raters outside the training corpus until a human reviewer validates.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Volume vs Signal Quality</h3>
        <HighlightBlock as="p" tier="crucial">
          High-friction feedback forms (multi-question surveys after every response) produce high-quality, detailed feedback but almost no one completes them. One-click thumbs produce massive volume but limited specificity. The category chips pattern is the effective middle ground: 3x the specificity of pure thumbs with only a modest friction increase. Optimize for this middle tier — it's where the best signal-to-friction ratio lies.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Explicit vs Implicit Feedback</h3>
        <HighlightBlock as="p" tier="important">
          Explicit feedback is the gold standard but has selection bias: users with strong reactions (very positive or very negative) are over-represented relative to average interactions. Implicit feedback (copy rate, rephrase rate) covers the silent majority but has lower signal quality and higher noise. Production feedback systems should use both, weighting explicit feedback more heavily in training data selection while using implicit signals for aggregate quality monitoring.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy vs Improvement</h3>
        <HighlightBlock as="p" tier="important">
          Every piece of feedback stored about a user's AI interactions is a privacy exposure. Storing the user's original question, the AI's response, the rating, and a correction creates a detailed profile of the user's knowledge gaps and thought patterns. Minimize retention to what's actually needed for improvement: for training data, the (question, response, rating) tuple is necessary; the userId is not. Anonymize aggressively and provide genuine opt-out (not just opt-out from explicit feedback, but opt-out from implicit signal collection too) with no service degradation.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Spam detection prevents feedback poisoning. For staff-level engineers, the critical insights are: design feedback collection primarily around the category chips tier (the best</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">signal/friction tradeoff); build the training pipeline with human review as a mandatory gate on corrections (automated ingestion of corrections is dangerous); implement per-model-version and per-prompt-version attribution from day one (unattributed feedback is nearly useless for systematic improvement); and respect user privacy by storing the minimum necessary data with genuine opt-out.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
