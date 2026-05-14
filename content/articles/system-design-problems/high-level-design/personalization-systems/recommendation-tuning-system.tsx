"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-recommendation-tuning-system",
  title: "Design a Recommendation Tuning System",
  description:
    "Architecture for a recommendation tuning system: online/offline model evaluation pipelines, multi-armed bandit exploration strategies, A/B and interleaved testing frameworks, feature importance dashboards, operator-facing tuning controls (business rules, boost/bury, diversity knobs), model versioning with shadow deployment, feedback loop closure, and guardrails against runaway optimization.",
  category: "high-level-design",
  subcategory: "personalization-systems",
  slug: "recommendation-tuning-system",
  wordCount: 5200,
  readingTime: 32,
  lastUpdated: "2026-05-11",
  tags: [
    "hld",
    "recommendation",
    "a-b-testing",
    "multi-armed-bandit",
    "model-versioning",
    "ranking",
    "personalization",
  ],
  relatedTopics: [
    "user-personalization-engine-ui",
    "user-preference-learning-system",
  ],
};

export default function RecommendationTuningSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          A recommendation tuning system is the control plane that sits above
          the recommendation engine. While the engine (ranking model, feature
          store, retrieval index) produces recommendations, the tuning system
          provides the tools to evaluate whether those recommendations are good,
          experiment with changes, and apply operator-defined adjustments
          without retraining the model. It addresses a fundamental asymmetry in
          recommendation systems: the model optimizes for one objective
          (typically short-term CTR), but the business has multiple objectives
          (revenue, diversity, content freshness, creator fairness, regulatory
          compliance) that are often in tension. The tuning system is where
          those trade-offs are made explicit and manageable.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The problem space has three distinct actors. Data scientists need to
          run controlled experiments (A/B tests, interleaved tests) and analyze
          results, retrain and compare model variants, understand which features
          are driving recommendations, and detect model drift. Operators
          (product managers, trust &amp; safety, content policy) need to apply
          business rules without touching model code—boosting newly launched
          content, burying low-quality sources, enforcing category diversity
          quotas, applying regulatory content restrictions. Engineers need to
          deploy model updates safely (canary deploys, shadow scoring, rollback
          capability) and monitor real-time recommendation quality metrics.
          Conflating these three actors into one interface leads to dangerous
          tooling: a PM accidentally modifying a training parameter, or a data
          scientist's experiment inadvertently triggering a business rule
          exclusion.
        </HighlightBlock>
        <p>
          <strong>Explicit scope:</strong> This article covers the tuning and
          evaluation layer. The underlying recommendation engine (feature store,
          ranking model inference) is treated as a black box with defined APIs:
          GET /rank?userId=&amp;candidates=[] returns scored items; the tuning
          system wraps this API with pre-rank filters and post-rank adjustments.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Functional Requirements
        </h3>
        <ul className="space-y-2">
          <li>
            <strong>Experiment framework:</strong> Support A/B tests (split
            traffic by userId bucket), interleaved tests (compare two rankers on
            the same request), and holdout groups (users isolated from all
            experiments as a baseline). Experiments must be mutually exclusive
            within a layer and can be orthogonal across layers (e.g., a UI
            experiment and a ranking experiment can run simultaneously on the
            same user).
          </li>
          <li>
            <strong>Business rules engine:</strong> Operators can define
            boost/bury rules (e.g., "boost items published in the last 24 hours
            by a score multiplier of 1.5"), inclusion rules ("always include at
            least one item from category X in positions 1–3"), and exclusion
            rules ("suppress items flagged for policy review"). Rules are
            applied as post-processing adjustments after model scoring.
          </li>
          <li>
            <strong>Model comparison:</strong> Shadow scoring—new model
            candidates score all requests alongside the production model without
            affecting the served results. Shadow scores and production scores
            are logged and compared offline to validate model improvements
            before any traffic exposure.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Feature importance dashboard:</strong> For any model
            variant, visualize the top contributing features by SHAP value,
            per-user segment feature contributions, and feature drift over time
            (distribution of feature values today vs. 7 days ago).
          </HighlightBlock>
          <li>
            <strong>Multi-armed bandit:</strong> For certain surfaces (e.g.,
            email subject line recommendations, push notification content),
            support contextual bandit exploration policies (Thompson Sampling,
            UCB) as an alternative to fixed A/B splits. The bandit adaptively
            shifts traffic toward better-performing arms as evidence
            accumulates.
          </li>
          <li>
            <strong>Rollback:</strong> Any model deployment or business rule
            activation can be rolled back to the previous state within 60
            seconds. Rule changes take effect within 5 seconds of activation (no
            cache TTL longer than 5s for rules).
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Non-Functional Requirements
        </h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Latency overhead:</strong> The tuning layer (experiment
            assignment + business rule application) must add less than 5ms to
            the ranking pipeline (which targets P99 &lt; 50ms total).
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Experiment integrity:</strong> Users must receive consistent
            treatment throughout an experiment (same bucket for the experiment's
            duration). Partial exposure (user seeing treatment on one session
            and control on another) invalidates measurements and must not
            happen.
          </HighlightBlock>
          <li>
            <strong>Audit log:</strong> Every business rule change, experiment
            activation, and model deployment is logged with actor identity,
            timestamp, and diff. Audit log is immutable and retained for 90
            days.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">
          The tuning system wraps the recommendation engine at the request path
          and sits as a sidecar to the serving infrastructure. The critical
          insight is that the tuning layer must be on the critical path (to
          apply post-rank adjustments and experiment routing) but must be fast
          and stateless (all configuration loaded into memory, no synchronous DB
          reads at request time).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The request flow: (1) An incoming recommendation request (userId,
          surface, candidates) hits the Recommendation Gateway. (2) The
          Experiment Assignment Service reads the user's bucket assignments from
          an in-memory hash (precomputed from consistent hash, updated lazily
          when experiment config changes) and tags the request with experiment
          IDs. (3) The request is routed to the appropriate model variant
          (control or treatment) based on the bucket assignment. (4) Model
          scoring returns ranked candidates with scores. (5) The Business Rules
          Engine applies post-rank adjustments: boost multipliers, bury
          penalties, inclusion/exclusion filters. (6) The Diversity Re-ranker
          enforces slot-level diversity constraints. (7) The tuned ranked list
          is returned to the caller. (8) In parallel (non-blocking), the Shadow
          Scoring Service sends the same request to all candidate models and
          logs shadow scores alongside the production scores for offline
          comparison.
        </HighlightBlock>
        <p>
          The configuration plane runs asynchronously: the Config Store (backed
          by a distributed KV store like etcd or Consul) holds experiment
          configs, business rules, and model routing tables. All serving nodes
          poll the Config Store every 2 seconds and load the latest config into
          memory. This means rule changes propagate within 2–5 seconds without
          requiring a process restart or a synchronous DB call on the hot path.
        </p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/personalization-systems/recommendation-tuning-system.svg"
          alt="Recommendation tuning system architecture showing request path (rec request → experiment assignment Hash userId+layer mod 1000 → model router control/treatment/shadow → ranking model A prod + model B shadow → business rules engine boost/bury/include/exclude → diversity re-ranker cap same-src 10% explore → ranked result top K), configuration plane async 2s poll (config store etcd/Consul experiment configs rules routing → experiment manager A/B interleaved holdout mSPRT sequential testing → rule editor predicate builder 4-eyes approval >10% traffic → model registry shadow canary prod promote/rollback → audit log immutable 90d → metrics dashboard CTR dwell guardrails), experiment bucketing layered isolation (Layer A ranking model control 50% treatment 50% bucket Hash userId+layerA+salt mod 1000 5% holdout; Layer B UI surface ctrl 90% treatment 10% orthogonal to Layer A user can be in both; interleaved test single request scored by A+B round-robin interleave clicks attributed per model 10-20x less traffic for significance; multi-armed bandit Thompson Sampling Beta(α,β) updated on click/no-click sample route to highest arm adaptive shifts to winner), model lifecycle shadow 72h min → canary 1% auto-rollback if CTR drops 5% or P99 exceeds SLA → ramp 1%→5%→25%→100% 4h hold per step operator approval at 25% → production 100% weights warm in memory config-only rollback <5s; rollback path config update only propagates in <5s; feature importance SHAP global mean |SHAP| segment breakdown feature drift KL-div + PSI >0.2 alert protected attr suppression; metrics engagement CTR dwell scroll return rate guardrails hard complaint rate churn policy violations auto-pause business creator view distribution category diversity discovery rate stat sig mSPRT α=0.05 min 1% relative CTR lift."
          caption="Request path (experiment assignment → model routing → business rules → diversity re-rank), configuration plane (Config Store, Experiment Manager, Rule Editor, Model Registry), layered A/B bucketing with interleaved tests and MAB, model lifecycle (shadow → canary → ramp → production with config-only rollback), and three-tier metrics with guardrails"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Experiment Assignment and Bucketing
        </h3>
        <p>
          Experiment assignment uses a two-level bucketing scheme. At the top
          level, experiments are organized into layers. Each layer owns a
          disjoint set of traffic (e.g., Layer A handles ranking model
          experiments, Layer B handles UI experiments). Within a layer, a user
          can only be in one experiment at a time, preventing interaction
          effects between simultaneous ranking changes. Across layers, a user
          can be in experiments from different layers simultaneously, enabling
          orthogonal testing.
        </p>
        <p>
          Bucket assignment within a layer: bucket = Hash(userId + layerId +
          salt) mod 1000. This gives 1000 buckets per layer. An experiment is
          allocated a contiguous range of buckets (e.g., experiment E1 gets
          buckets 0–499 for control, 500–999 for treatment—a 50/50 split;
          experiment E2 could instead use buckets 0–99 for treatment and 100–999
          for control—a 10/90 split). The salt is refreshed between experiment
          runs to avoid a user being in the same bucket for every experiment
          (which would create a "forever treatment" user who always sees the
          same variant regardless of what is being tested). Consistent hashing
          on userId + layerId + salt ensures deterministic assignment: the same
          user always gets the same bucket for a given experiment run,
          guaranteeing sticky assignment across sessions.
        </p>
        <p>
          Holdout groups: 5% of users (buckets 0–49 in a reserved holdout layer)
          are excluded from all experiments and always receive the production
          ranking. This gives a clean counterfactual baseline for long-term
          metric analysis. Without a holdout, it is impossible to know whether
          long-term metrics are improving because the experiments are working,
          or because of external factors (seasonal traffic, content quality
          improvements).
        </p>
        <HighlightBlock as="p" tier="important">
          Interleaved testing: a faster alternative to A/B tests for comparing
          two ranking models. In an interleaved test, a single request is scored
          by both models. The results are interleaved in a round-robin fashion
          (first item from model A, first item from model B, second item from
          model A, etc.) into a single result list. User behavior (clicks) on
          the interleaved list is attributed back to the model that placed each
          clicked item. The model whose items receive more clicks wins.
          Interleaved tests require far less traffic to reach statistical
          significance than A/B tests (typically 10–20× fewer users), enabling
          faster iteration. The downside is that interleaved tests can only
          measure click-based metrics (they cannot measure dwell time,
          conversions, or longer-term engagement effects, which require true A/B
          isolation).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Business Rules Engine
        </h3>
        <p>
          The Business Rules Engine (BRE) is a post-processing step that applies
          operator-defined adjustments to the model-ranked list. Rules are
          expressed in a declarative DSL (domain-specific language) stored in
          the Config Store and compiled to in-memory rule objects at load time.
          Rule types:
        </p>
        <p>
          <strong>Boost rules:</strong> multiply the score of items matching a
          predicate by a factor. Example:{" "}
          {
            "{ predicate: { ageHours: { lt: 24 } }, multiplier: 1.5, surface: 'homepage', expiry: '2026-06-01' }"
          }
          . This boosts items published in the last 24 hours by 50% on the
          homepage feed. The expiry field ensures temporary promotional boosts
          automatically deactivate without manual intervention. Score
          multiplication is applied before the final re-ranking pass, so boosted
          items compete in the ranking on adjusted scores rather than being
          force-inserted at a fixed position (which would break the diversity
          re-ranker).
        </p>
        <p>
          <strong>Bury rules:</strong> multiply the score of items matching a
          predicate by a factor less than 1 (e.g., 0.1). Used to suppress
          low-quality sources, clickbait, or content under policy review. Bury
          rules are reversible: removing the rule restores the item's original
          model score. This is preferable to hard deletion from the candidate
          pool, which would be invisible and hard to audit.
        </p>
        <p>
          <strong>Inclusion rules:</strong> guarantee at least N items from a
          specified category in the top K positions. Example: "At least 1 item
          from category=sponsored in positions 1–5." Inclusion rules are applied
          as a constraint to the re-ranker: if the top 5 items after boost/bury
          scoring do not include a sponsored item, the highest-scoring sponsored
          item from the full ranked list is inserted at position 5 (displacing
          the lowest-scoring non-inclusion item). Inclusion rules have the
          highest potential to harm recommendation quality and should be used
          sparingly.
        </p>
        <p>
          <strong>Exclusion rules:</strong> remove items matching a predicate
          from the ranked list entirely. Example: "Exclude all items with
          contentPolicy=flagged." Exclusion rules are applied before scoring
          (items are removed from the candidate list, saving computation) or
          after scoring (for dynamically flagged content). Exclusions are
          critical for trust &amp; safety use cases where a flagged item must
          never appear regardless of its model score.
        </p>
        <HighlightBlock as="p" tier="important">
          Rule evaluation order: exclusions first (reduces the candidate pool),
          then boost/bury (adjusts scores), then re-ranking (produces the final
          ordered list), then inclusion (injects guaranteed slots). This order
          ensures that exclusions take precedence over boosts (a flagged item
          cannot be boosted back into the list).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Multi-Armed Bandit Exploration
        </h3>
        <p>
          A/B tests require fixing the traffic split for the experiment duration
          (typically 1–2 weeks) even if early results strongly favor one
          variant. Multi-armed bandits adaptively shift traffic toward the
          better-performing variant, reducing the cost of testing (fewer users
          exposed to the inferior variant) at the cost of some statistical
          rigor. The tuning system supports contextual bandits for surfaces
          where the "arm" choice is context-dependent.
        </p>
        <HighlightBlock as="p" tier="important">
          Thompson Sampling implementation: each arm (model variant) has a Beta
          distribution over its click-through rate. Initially: Beta(1, 1)
          (uniform prior). On each impression: if the user clicks, update the
          arm's Beta distribution with a success (+1 alpha). If the user does
          not click, update with a failure (+1 beta). At request time, sample a
          probability value from each arm's Beta distribution. Route the request
          to the arm that produced the highest sampled value. Over time, arms
          with more clicks accumulate higher alpha values and produce higher
          samples more consistently, naturally directing more traffic to
          better-performing arms. Thompson Sampling is preferred over Upper
          Confidence Bound (UCB) for recommendation because it naturally handles
          non-stationary environments (model quality can change over time as the
          underlying content catalog changes), whereas UCB's confidence
          intervals are calibrated assuming a stationary reward distribution.
        </HighlightBlock>
        <p>
          Contextual bandits extend this to the per-user level: instead of a
          global CTR estimate per arm, the bandit estimates the probability of
          click for this specific user-context (using a linear model or a small
          neural network trained on user features). This allows the bandit to
          learn that arm A is better for new users while arm B is better for
          power users, and route each user accordingly. Contextual bandits are
          more complex to implement and require more data to converge; they are
          appropriate for high-traffic surfaces (homepage feed) but overkill for
          low-traffic surfaces (email recommendations).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Model Versioning and Shadow Deployment
        </h3>
        <p>
          Model lifecycle: Develop → Shadow → Canary → Production → Deprecated.
          Each stage gates traffic exposure and requires passing quality checks
          before promotion.
        </p>
        <HighlightBlock as="p" tier="important">
          Shadow deployment: a new model candidate scores all production
          requests in parallel (asynchronously, non-blocking on the critical
          path). Shadow scores are logged to a dedicated shadow_scores table
          alongside the production scores. Shadow comparison reports run
          nightly: for each item scored, compare shadow score vs. production
          score. Metrics: rank correlation (Spearman's rho between shadow and
          production rankings), KL-divergence between shadow and production
          score distributions, and lift in offline holdout metrics (precision@K,
          NDCG). A model must meet minimum shadow quality thresholds (e.g., rank
          correlation &gt; 0.85, offline NDCG improvement &gt; 1%) before being
          promoted to canary. Shadow deployment runs for at least 72 hours to
          capture weekend traffic patterns, which differ significantly from
          weekday patterns.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Canary deployment: the new model receives 1% of traffic. Online
          metrics (CTR, dwell time) are monitored in real time. Automated
          guardrails trigger rollback if: CTR drops more than 5% relative to the
          control in a 1-hour window, error rate exceeds 0.1%, or P99 latency
          exceeds the SLA. If no guardrail fires after 24 hours, traffic ramps:
          1% → 5% → 10% → 25% → 50% → 100%, each step held for 4+ hours. The
          ramping is automated but requires explicit operator approval at the
          25% step, ensuring a human reviews early results before majority
          traffic exposure.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Rollback: each model deployment stores its predecessor model
          reference. A rollback command atomically updates the model routing
          table in the Config Store to point back to the previous model. Serving
          nodes pick up the change within 5 seconds (Config Store poll
          interval). Rollback does not require a code deploy or process
          restart—it is a config change only. The previous model's weights
          remain loaded in memory on all serving nodes until the rollback is
          confirmed complete, eliminating the cold start latency of re-loading
          weights during a live incident.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Feature Importance Dashboard
        </h3>
        <HighlightBlock as="p" tier="important">
          The feature importance dashboard gives data scientists visibility into
          what the ranking model is actually doing. It has three views.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Global feature importance: aggregate SHAP values across all scored
          requests in the past 24 hours. Displays a ranked bar chart of features
          by mean absolute SHAP value. This answers "what features matter most
          to the model?" A typical output might show: user_category_affinity
          (contribution 0.32), item_age_hours (0.18), user_session_recency
          (0.15), item_global_ctr (0.12), user_device_type (0.08). Feature
          importance that dramatically changes between training days is an early
          signal of data pipeline drift.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Segment-level importance: filter global importance by user segment
          (new users, power users, mobile users, specific geo). This reveals
          whether the model is using different feature combinations for
          different user types—useful for detecting unfair treatment of
          demographic groups (e.g., if device_type has unexpectedly high
          importance for a specific geo segment, it may indicate a proxy for a
          protected attribute).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Feature drift monitor: for each feature, compare the distribution of
          values seen in scoring requests today vs. 7 days ago using
          KL-divergence and population stability index (PSI). A PSI &gt; 0.2 for
          a high-importance feature triggers an alert. Feature drift is the most
          common cause of recommendation quality degradation that is not
          immediately visible in CTR metrics (a drifted feature may produce
          worse recommendations subtly, with CTR declining slowly over weeks).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">
          Metrics and Guardrails
        </h3>
        <HighlightBlock as="p" tier="important">
          The recommendation tuning system monitors three tiers of metrics.
          Engagement metrics (measured online, per-experiment): CTR (primary),
          dwell time per item (indicates read completion vs. bounce), scroll
          depth (indicates feed quality at lower positions), return rate (did
          the user come back within 7 days). These metrics are collected via the
          signal pipeline and attributed to experiment buckets. Guardrail
          metrics (must not regress): user complaint rate (explicit "not
          interested" feedback rate), unsubscribe/churn rate (30-day rolling),
          content policy violation rate (items served that were subsequently
          flagged). Guardrail metrics have hard thresholds; violating them
          auto-pauses the experiment regardless of engagement metric
          improvements. Business metrics (measured offline, per-cohort): creator
          content views (distribution across creators—a recommendation model can
          inadvertently concentrate views on a small set of popular creators,
          harming creator ecosystem health), category diversity index (entropy
          of category distribution in served results), and discovery rate
          (fraction of items shown that the user had never previously seen).
        </HighlightBlock>
        <p>
          Statistical significance: the tuning system uses a sequential testing
          framework (always-valid p-values) rather than fixed-horizon A/B
          testing. This allows experiments to be stopped early when results are
          conclusive without inflating the false positive rate (which happens
          with naive early stopping of fixed-horizon tests). The framework uses
          the mSPRT (mixed Sequential Probability Ratio Test) with a target α =
          0.05 and minimum detectable effect of 1% relative CTR lift.
          Experiments that reach significance before their scheduled end date
          are automatically flagged for review; they are not automatically
          concluded, to avoid stopping experiments that have significant
          short-term effects but unknown long-term consequences.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Operator UI</h3>
        <HighlightBlock as="p" tier="crucial">
          The operator-facing tuning dashboard has four panels. Experiment
          Manager: list of active experiments with current traffic allocation,
          live metric deltas (treatment vs. control CTR), statistical
          significance progress, and start/stop controls. Rule Editor: a
          form-based rule creator with predicate builder (category, age, source,
          score threshold), action type (boost/bury/include/exclude), multiplier
          or absolute score override, surface scope, and expiry. Rule changes
          show a diff preview before activation and require a second approver
          for rules affecting more than 10% of traffic (four-eyes approval).
          Model Registry: list of all model versions with their current stage
          (shadow/canary/production/deprecated), shadow comparison metrics,
          canary traffic percentage, and promote/rollback buttons. Metrics
          Dashboard: real-time and 7-day trend charts for the three metric
          tiers, segmented by experiment, surface, and user cohort. Anomaly
          annotations (rule activations, model promotions, traffic spikes) are
          overlaid on time series charts so operators can correlate metric
          changes with tuning actions.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">
          Experiment velocity versus statistical rigor: the pressure to ship
          fast (and show improvement metrics) creates an incentive to run short
          experiments, stop them early when results look positive, and run many
          simultaneous experiments. Each of these practices inflates the false
          positive rate (concluding an improvement exists when it does not). The
          sequential testing framework and minimum experiment duration
          requirements are guardrails against this, but they slow down
          iteration. The tension is real: a team running 5 rigorous 2-week
          experiments per month has a fundamentally different pace than one
          running 30 short experiments. The right balance depends on how much
          your product can tolerate false positive deployments vs. missed
          improvements. For recommendation systems serving millions of users, a
          1% CTR regression deployed to 100% of traffic is a costly false
          positive worth slowing down for.
        </HighlightBlock>
        <p>
          Business rules versus model training: every business rule applied
          post-model-scoring creates a discrepancy between what the model was
          trained to predict and what the system actually serves. If business
          rules are systematically boosting a specific category, the training
          data will eventually reflect higher CTR for that category (users see
          it more, so there are more chances to click it). The model learns to
          rank it higher on its own, making the rule redundant. Ideally,
          business objectives (freshness, diversity, creator fairness) should be
          incorporated as multi-objective training signals or constraints during
          model training, not as post-hoc adjustments. Business rules should be
          reserved for short-term or dynamic needs (launching a new content
          category, emergency content policy response) that cannot wait for a
          model retrain cycle.
        </p>
        <HighlightBlock as="p" tier="important">
          Shadow deployment completeness: shadow scoring only validates offline
          quality signals (rank correlation, NDCG). It cannot capture online
          effects—how users behave when the new model is actually served to them
          (the very act of showing a different item changes what the user can
          interact with, creating a feedback loop that offline scoring cannot
          simulate). Shadow testing reduces the risk of deploying a clearly
          worse model but cannot eliminate the risk entirely. The canary ramp
          with real traffic is the true validation step; shadow is a pre-screen
          to avoid wasting canary budget on clearly inferior models.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">
          A recommendation tuning system is the control plane above the
          recommendation engine. It has three planes: the serving plane
          (experiment assignment via consistent hash bucketing, business rules
          engine for post-rank boost/bury/include/exclude adjustments, diversity
          re-ranker), the evaluation plane (A/B tests with sequential testing
          for statistical validity, interleaved tests for fast model comparison,
          multi-armed bandits for adaptive traffic allocation, shadow scoring
          for pre-canary model validation), and the observability plane (feature
          importance via SHAP values, feature drift monitoring via PSI,
          three-tier metrics with engagement, guardrail, and business
          objectives). Model deployment follows a gated lifecycle: shadow (72h
          minimum) → canary (1% → 100% over 24h+) → production, with automated
          guardrail rollback within 5 seconds. The operator UI separates
          concerns: data scientists manage experiments and model registry;
          operators manage business rules with four-eyes approval for
          high-impact changes; engineers monitor the metrics dashboard. The
          fundamental design tension: every post-rank business rule creates
          training data bias, and every accelerated experiment introduces false
          positives—the system must be explicitly designed to slow down in both
          dimensions to maintain long-term recommendation quality.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
