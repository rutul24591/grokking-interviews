"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-feature-rollout-system",
  title: "Design a Feature Rollout System (Gradual Rollout + Targeting + Kill Switch)",
  description:
    "Production-grade feature rollout with staged percentage deployment, automatic rollback triggers, user targeting, and emergency kill switches.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "feature-rollout-system",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-06",
  tags: ["lld", "feature-rollout", "gradual-deployment", "kill-switch", "monitoring"],
  relatedTopics: ["feature-flag-system"],
};

export default function FeatureRolloutSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">A feature rollout system manages the controlled introduction of new features into production, turning what was previously a binary "deploy to all users at once" event into a staged, observable, and reversible process. The distinction from feature flags (which this system builds upon) is the rollout lifecycle management: flags are the mechanism; rollouts are the process—with automated stage progression, monitoring integration, and automatic rollback triggers when anomalies are detected.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The stakes are high: a feature with a subtle bug that crashes the application for 1% of users is bad; the same bug affecting 100% of users is a service outage. Gradual rollout gives the engineering team the ability to detect the problem at 1% exposure and roll back before the impact reaches 100%. But manual monitoring and manual rollback decisions require engineers to be actively watching during every rollout—impractical for a team shipping dozens of features per week. The rollout system must automate the monitoring and rollback decisions where possible.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial"><strong>Explicit assumptions:</strong> The rollout system is built on top of the feature flag infrastructure (feature-flag-system article). Percentage allocation uses consistent hashing (same user always gets the same variant at the same percentage). Monitoring is integrated with an error rate metric (number of JavaScript errors per session or per page load). Automatic rollback triggers fire when the monitored metric exceeds a configured threshold relative to the control group. The rollout can be paused, resumed, accelerated, or rolled back manually at any time.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Staged rollout:</strong> Progress through predefined stages (0% → 1% → 5% → 25% → 50% → 100%) with configurable dwell time at each stage.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Automatic stage advancement:</strong> After the configured dwell time at a stage, advance to the next stage if monitored metrics are within acceptable thresholds.</HighlightBlock>
          <li><strong>Automatic rollback:</strong> If monitored metrics exceed rollback thresholds (e.g., error rate 2× the baseline), immediately roll back to 0% and alert the on-call team.</li>
          <li><strong>Manual controls:</strong> Engineers can manually pause, resume, advance, roll back, or skip to any stage at any time.</li>
          <li><strong>Targeting:</strong> Before percentage rollout, optionally enable the feature only for specific user cohorts (internal users, beta testers, specific organizations).</li>
          <HighlightBlock as="li" tier="important"><strong>Kill switch:</strong> An emergency disable that sets the feature to 0% and applies immediately, bypassing the normal rollback flow. Separate from rollback—this is for when immediate action is required before metrics even confirm a problem.</HighlightBlock>
          <li><strong>Rollout history:</strong> A log of all stage transitions, metric readings at each stage, automatic rollback events, and manual interventions.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Rollback speed:</strong> Automatic rollback (kill switch) propagates to all SDK instances within 5 seconds of the trigger.</li>
          <HighlightBlock as="li" tier="crucial"><strong>Metric evaluation frequency:</strong> Metrics are evaluated every 60 seconds during active rollout stages. Evaluation must complete before the next evaluation cycle starts.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Consistency:</strong> Users in the rollout group must consistently see the feature enabled across sessions and page loads (consistent hashing, not random assignment).</HighlightBlock>
          <li><strong>Audit:</strong> Every rollout state change (manual or automatic) is logged with the actor, timestamp, reason, and metric values at the time of change.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">A feature rollout is a state machine layered on top of the feature flag system. The rollout has stages (each with a target percentage and a dwell time), a current stage, and a monitoring configuration (which metric to watch, what threshold triggers automatic rollback).</HighlightBlock>
<HighlightBlock as="p" tier="important">A background service (rollout manager) runs on the server and is responsible for: advancing stages when dwell time expires and metrics are healthy, triggering automatic rollback when metrics are unhealthy, and publishing state changes to the flag delivery system (so SDK instances receive the updated percentage in real-time).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The frontend SDK is unaware that it is participating in a rollout—it sees only the feature flag with a given percentage and evaluates it the same way as any other flag. The rollout system is entirely a server-side orchestration concern. The frontend's contribution is emitting the telemetry (error rates, latency metrics) that the rollout manager uses for its metric evaluations.</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/feature-rollout-system.svg"
          alt="Feature rollout system showing staged progression from 0% to 100%, consistent hashing bucket assignment, automatic rollback triggered by error rate threshold exceeding 2x baseline, manual override controls, and metric evaluation cycle"
          caption="Feature rollout system showing staged progression from 0% to 100%, consistent hashing bucket assignment, automatic rollback triggered by error rate threshold exceeding 2x baseline, manual override controls, and metric evaluation cycle"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design a Feature Rollout System (Gradual Rollout + Targeting + Kill Switch)</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

	        <h3 className="mt-6 mb-3 text-lg font-semibuild">Rollout Stage Configuration</h3>
	        <p>A rollout is configured with a stage schedule: an ordered list of target percentages and dwell times. For example, a rollout might spend 30 minutes at a very small exposure, then increase to a low single-digit exposure for an hour, then step through mid-range stages, and finally reach full exposure when confidence is high. The rollout begins at the first stage and advances automatically when the dwell time completes and metrics remain healthy.</p>
	        <p>The rollout record on the server stores the rollout identifier, the feature flag key it controls, the current stage index, the full stage schedule, the rollout status, the monitoring configuration (which metric to evaluate and what threshold triggers rollback), stage timestamps, and an append-only history of every transition with associated metadata. The rollout manager reads this record and drives state transitions.</p>
        <p>Before beginning percentage rollout, the rollout optionally passes through a "targeting" phase: enable the feature for a specific cohort (internal employees, defined by email domain; beta users, defined by a beta flag; a specific customer organization). This provides controlled testing with known, engaged users who can provide feedback before the feature reaches random users. The targeting phase is manual—it advances to percentage rollout only when the team explicitly opts in.</p>

	        <h3 className="mt-6 mb-3 text-lg font-semibuild">Consistent Hashing and Monotonic Expansion</h3>
	        <HighlightBlock as="p" tier="important">The percentage allocation uses the same consistent hashing as the feature flag system. Each user is deterministically assigned to a bucket in a fixed range, derived from a stable hash of the flag key and the user identifier. A user stays in the same bucket across sessions, and the rollout includes users whose bucket value falls within the current target percentage. As the rollout increases, the included bucket range expands, which means users do not “fall out” of the rollout during normal progression. This monotonic expansion property is critical for a consistent user experience: once a user sees the feature at a low stage, they continue to see it at higher stages until a rollback disables the flag.</HighlightBlock>
	        <HighlightBlock as="p" tier="important">Monotonic expansion must not be broken by stage rollback. If the rollout rolls back from 25% to 0%, the feature is disabled for all users including those who were in the 1% and 5% stages. On re-enabling, those users re-enter the rollout from the beginning—they are not given special treatment. This inconsistency (the user saw the feature, it disappeared, it reappeared) is a known limitation of rollback scenarios. For features with significant UX impact, the rollout plan should include communication to affected users when a rollback occurs.</HighlightBlock>

		        <h3 className="mt-6 mb-3 text-lg font-semibuild">Metric Evaluation and Automatic Rollback</h3>
		        <HighlightBlock as="p" tier="crucial">The rollout manager evaluates metrics every 60 seconds during active rollout stages. The evaluation queries the observability system for the feature-specific error rate by comparing two cohorts: users who are currently exposed to the feature at this rollout stage, and users who are not exposed (the control cohort). This A/B comparison isolates the feature's impact from external factors. For example, an infrastructure incident that affects all users equally should move both cohorts in the same direction and therefore should not trigger a feature rollback.</HighlightBlock>
        <p>The rollback threshold is expressed as a multiplier of the baseline: rollbackThreshold: 2.0 means "roll back if the feature group's error rate is more than 2× the control group's error rate." Absolute thresholds (roll back if error rate exceeds 5%) are less robust because they trigger during already-bad days (when baseline error rates are elevated). The relative threshold is more meaningful: it detects when the feature is making things worse, not just when things are already bad.</p>
        <HighlightBlock as="p" tier="important">Statistical significance is important for small rollout percentages: at 1% rollout, the feature group has very few users, and the error count may be 0 or 1—making rate comparisons noisy. The rollout manager should require a minimum sample size (e.g., at least 100 sessions in the feature group) before evaluating rollback thresholds. At very small percentages or very low traffic, the automatic rollback system is suppressed and human judgment is required. The rollout dashboard shows the current sample size alongside the metric comparison to help engineers make informed manual decisions.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Kill Switch and Emergency Rollback</h3>
        <p>The kill switch is a one-click emergency action that sets the feature flag's enabled: false and rolloutPercentage: 0 immediately, bypassing the normal rollout state machine. It does not require the rollout manager's evaluation cycle—it's a direct update to the flag configuration that propagates via the SSE delivery channel to all SDK instances within seconds. The kill switch is the action for "we see a problem right now, we need it off immediately, we'll investigate later."</p>
        <p>Automatic rollback (triggered by metrics) is a softer action: it sets the rollout's currentStageIndex to -1 (which maps to 0% in the stage schedule), pauses the rollout, and alerts the on-call team. The feature flag's percentage is updated to 0%, but the rollout record is preserved with status = rolled_back so the team can investigate, fix, and restart the rollout. The distinction: kill switch is immediate and manual; automatic rollback is metric-triggered and leaves the door open for restarting after investigation.</p>
        <p>The kill switch is always available to engineers regardless of the rollout's current status or the metric evaluation results. Even during a 100% rollout stage, the kill switch can set the feature to 0%. This is the "break glass" control for incident response. The kill switch action is logged (who triggered it, when, and the current metric values at the time) for post-incident review.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Rollout Dashboard UI</h3>
        <p>The rollout dashboard provides the interface for engineers to manage active rollouts. Key UI elements: a timeline visualization showing stages with their target percentages, current stage indicator, and dwell time progress; a real-time metric chart comparing the feature group and control group error rates (updating every 60 seconds with the evaluation cycle); action buttons (Advance, Pause, Roll Back, Kill Switch); and the rollout history log.</p>
        <p>The advance button accelerates the rollout by skipping the remaining dwell time and immediately advancing to the next stage (if metrics pass). This is used when a rollout is performing well and the team wants to move faster than the configured schedule. Pause stops automatic advancement but does not change the current percentage; users currently in the rollout remain in it. Resume restarts the dwell timer for the current stage.</p>
        <HighlightBlock as="p" tier="important">The rollout history log is an immutable append-only record of all state changes: each entry has a timestamp, the action (stage_advanced, stage_rolled_back, kill_switch_triggered, manually_paused), the actor (engineer username or "automatic"), the metric values at the time of the action, and an optional comment. This history is the post-incident data source: when investigating "why did the rollout roll back at 25%?", the log shows the exact metric values that triggered the rollback and who (or what) made the decision.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Automatic rollback versus requiring human decision: automatic rollback (metric-triggered) is faster (seconds vs the time it takes an on-call engineer to notice and act) but can produce false positives (rolling back a healthy feature because of a temporary metric spike from an unrelated cause). Human decision (alerts but requires manual rollback) prevents false positives but adds response time. The solution is a graduated response: automatic rollback at a 3× threshold (likely a real problem), alert without rollback at a 2× threshold (human evaluates). This reduces false positives while still providing automation for severe cases.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Rollout speed: aggressive stage schedules (1% for 5 minutes, then 100%) move fast but leave little time to detect slow-developing issues (memory leaks that manifest after 30 minutes of use, rate-limiting errors that only appear at moderate usage levels). Conservative schedules (1 week at each stage) are safe but slow product iteration significantly. The right schedule depends on the feature's risk profile: high-risk features (payment flows, authentication changes) warrant slower schedules; low-risk features (UI tweaks, new optional features) can move faster.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Metric selection for rollback: error rate is the most common rollback metric because it's universal and easy to measure. Latency metrics (API response time for the feature group), conversion metrics (checkout completion rate), and user engagement metrics (feature usage rate) provide richer signals but require more sophisticated analysis (controlling for confounders, statistical significance testing). Most rollout systems start with error rate and add additional metrics as the monitoring infrastructure matures.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">The kill switch provides immediate emergency disable that propagates to all SDK instances in seconds via SSE. The rollout dashboard provides stage controls (advance, pause, roll back)</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">and an immutable history log. Targeting phases (enable for internal/beta users first) precede percentage rollout. The defining operational principle: every stage transition (manual or automatic) is logged with actor, timestamp, and metric values—providing the audit trail needed for post-incident analysis and building the team's confidence in the rollout system over time.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
