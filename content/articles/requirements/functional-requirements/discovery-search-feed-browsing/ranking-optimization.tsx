"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-ranking-optimization",
  title: "Ranking Optimization",
  description:
    "Comprehensive guide to ranking optimization covering feature engineering, model training, A/B testing, online learning, and continuous improvement for search and recommendation systems.",
  category: "functional-requirements",
  subcategory: "discovery-search-feed-browsing",
  slug: "ranking-optimization",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "ranking",
    "optimization",
    "ml",
    "backend",
    "ab-testing",
  ],
  relatedTopics: ["search-ranking", "recommendation-algorithms", "ab-testing", "ml-ranking"],
};

export default function RankingOptimizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Ranking Optimization</strong> is the continuous process of improving
          search and recommendation result ordering through experimentation, feature
          engineering, model refinement, and user feedback analysis. It is never "done"—
          user behavior changes, content evolves, and business goals shift. Ranking
          optimization balances multiple objectives: relevance, engagement, diversity,
          freshness, and business metrics (revenue, retention).
        </p>
        <p>
          Modern ranking systems use machine learning models trained on historical user
          interactions (clicks, dwell time, conversions). The optimization loop involves:
          feature engineering (creating predictive signals), model training (learning
          feature weights), A/B testing (validating improvements), and deployment
          (rolling out to production). This cycle runs continuously—Netflix retrain
          models daily, Google updates ranking algorithms thousands of times per year.
        </p>
        <p>
          For staff-level engineers, ranking optimization requires expertise in ML
          (feature engineering, model selection, training pipelines), experimentation
          (A/B testing, statistical significance, guardrail metrics), and systems design
          (low-latency inference, model serving, monitoring). Understanding trade-offs
          between offline metrics (NDCG, precision) and online metrics (CTR, retention)
          is critical.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Feature Engineering</h3>
        <p>
          Features are signals used by the ranking model to predict relevance:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Content Features:</strong> Describe the item being ranked. Text
            length, image count, video duration, quality score, freshness, author
            reputation, category, tags. Static features computed at indexing time.
          </li>
          <li>
            <strong>User Features:</strong> Describe the user. Demographics (age,
            location, language), preferences (followed topics, past purchases),
            engagement history (clicks, watch time), user type (new vs returning).
          </li>
          <li>
            <strong>Context Features:</strong> Describe the query/session context.
            Time of day, day of week, device (mobile vs desktop), location, referral
            source, session length, query type (navigational vs exploratory).
          </li>
          <li>
            <strong>Interaction Features:</strong> Describe user-item interactions.
            Historical CTR, conversion rate, dwell time, bounce rate, recency of
            last interaction. Computed from aggregated logs.
          </li>
          <li>
            <strong>Cross Features:</strong> Combine multiple features. User_age ×
            Item_category, User_location × Item_availability. Capture interactions
            between features. Expensive to compute but highly predictive.
          </li>
        </ul>

        <h3 className="mt-6">Model Training</h3>
        <p>
          Training ranking models from historical data:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Training Data:</strong> Historical impressions (what was shown)
            and labels (what user did). Positive labels: clicks, purchases, long
            dwell time. Negative labels: skips, quick bounces, explicit dislikes.
          </li>
          <li>
            <strong>Label Types:</strong> Binary (click/no-click), ordinal (1-5 star
            rating), continuous (dwell time, watch percentage). Choice affects loss
            function and model architecture.
          </li>
          <li>
            <strong>Train/Validation Split:</strong> Time-based split (train on past,
            validate on recent). Prevents data leakage. Typical split: 80% train,
            20% validation.
          </li>
          <li>
            <strong>Loss Functions:</strong> Pointwise (MSE for regression, cross-entropy
            for classification), pairwise (RankNet, hinge loss), listwise (LambdaLoss,
            ListNet). Listwise best for ranking but computationally expensive.
          </li>
          <li>
            <strong>Online Learning:</strong> Update model incrementally with new data.
            Adapts to changing user behavior. Risk: instability, catastrophic forgetting.
          </li>
        </ul>

        <h3 className="mt-6">A/B Testing</h3>
        <p>
          Validating ranking changes with controlled experiments:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Randomization:</strong> Assign users to control (current ranking)
            or treatment (new ranking) groups. Use consistent hashing on user_id for
            stable assignment.
          </li>
          <li>
            <strong>Primary Metrics:</strong> What you optimize for. CTR@10, conversion
            rate, watch time, revenue per search. Choose 1-2 primary metrics.
          </li>
          <li>
            <strong>Guardrail Metrics:</strong> What you protect. Latency (p50, p99),
            error rate, diversity score, user complaints. Ensure changes don't break
            things.
          </li>
          <li>
            <strong>Statistical Significance:</strong> Run test until results are
            statistically significant (p-value &lt; 0.05). Use power analysis to
            determine sample size. Typical duration: 1-2 weeks.
          </li>
          <li>
            <strong>Interleaving:</strong> Mix control and treatment results, measure
            which results users click. Faster than traditional A/B tests (days vs
            weeks) but less statistical power.
          </li>
        </ul>

        <h3 className="mt-6">Continuous Improvement Loop</h3>
        <p>
          Ranking optimization is a continuous cycle:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Analyze:</strong> Review metrics, identify weaknesses. Low CTR
            for certain queries? Poor retention for new users? Use dashboards,
            query logs, user feedback.
          </li>
          <li>
            <strong>Hypothesize:</strong> Formulate improvement hypothesis. "Adding
            freshness feature will improve CTR for news queries." "Personalization
            will improve retention for returning users."
          </li>
          <li>
            <strong>Implement:</strong> Engineer new features, train model, set up
            A/B test. Ensure proper instrumentation for metrics collection.
          </li>
          <li>
            <strong>Test:</strong> Run A/B test, monitor primary and guardrail
            metrics. Check for statistical significance. Analyze segment-level
            effects (mobile vs desktop, new vs returning).
          </li>
          <li>
            <strong>Deploy:</strong> If test wins, roll out to 100% of users.
            Monitor post-deployment metrics. If test loses, analyze why, iterate.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production ranking optimization involves multiple components working together
          for continuous improvement.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/ranking-optimization/ranking-optimization-loop.svg"
          alt="Ranking Optimization Loop"
          caption="Figure 1: Ranking Optimization Loop — Analyze → Hypothesize → Implement → Test → Deploy continuous improvement cycle"
          width={1000}
          height={500}
        />

        <h3>Feature Pipeline</h3>
        <ul className="space-y-3">
          <li>
            <strong>Feature Store:</strong> Centralized repository for features.
            Stores feature definitions, computed values, metadata. Enables feature
            reuse across models.
          </li>
          <li>
            <strong>Batch Features:</strong> Pre-computed periodically (hourly,
            daily). User aggregates (30-day click count), item statistics (average
            rating). Stored in feature store.
          </li>
          <li>
            <strong>Real-time Features:</strong> Computed at query time. Session
            context, current location, time-based features. Low latency requirement
            (&lt;10ms).
          </li>
          <li>
            <strong>Feature Validation:</strong> Check feature distributions, detect
            drift. Alert on anomalies (sudden change in feature values indicates
            pipeline issues).
          </li>
        </ul>

        <h3 className="mt-6">Model Training Pipeline</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Data Collection:</strong> Aggregate impressions, clicks,
            conversions from logs. Join with user, item, context features.
          </li>
          <li>
            <strong>Data Preprocessing:</strong> Handle missing values, normalize
            numeric features, encode categorical features. Split into train/validation/test.
          </li>
          <li>
            <strong>Model Training:</strong> Train ranking model (XGBoost, LambdaMART,
            neural network). Optimize loss function (pairwise or listwise).
          </li>
          <li>
            <strong>Model Validation:</strong> Evaluate on validation set. Compute
            offline metrics (NDCG@10, MRR). Check for overfitting.
          </li>
          <li>
            <strong>Model Export:</strong> Export trained model to model registry.
            Version model, store metadata (features, hyperparameters, metrics).
          </li>
          <li>
            <strong>Model Deployment:</strong> Deploy to staging, run A/B test.
            Monitor online metrics. Roll out to production if test wins.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/ranking-optimization/feature-engineering-pipeline.svg"
          alt="Feature Engineering Pipeline"
          caption="Figure 2: Feature Engineering Pipeline — Batch and real-time features combined for ranking model inference"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">A/B Testing Infrastructure</h3>
        <p>
          Infrastructure for running ranking experiments:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Component</th>
                <th className="text-left p-2 font-semibold">Purpose</th>
                <th className="text-left p-2 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Experiment Service</td>
                <td className="p-2">Assign users to variants</td>
                <td className="p-2">Consistent hashing on user_id</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Metrics Collection</td>
                <td className="p-2">Track impressions, clicks, conversions</td>
                <td className="p-2">Kafka streams, real-time aggregation</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Statistical Engine</td>
                <td className="p-2">Compute significance, confidence intervals</td>
                <td className="p-2">T-test, bootstrap, Bayesian methods</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Dashboard</td>
                <td className="p-2">Visualize experiment results</td>
                <td className="p-2">Primary/guardrail metrics over time</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Monitoring and Alerting</h3>
        <ul className="space-y-3">
          <li>
            <strong>Model Performance:</strong> Track online metrics (CTR, conversion)
            post-deployment. Alert on degradation (&gt;5% drop in primary metric).
          </li>
          <li>
            <strong>Feature Drift:</strong> Monitor feature distributions. Alert on
            significant shifts (KS test p-value &lt; 0.01).
          </li>
          <li>
            <strong>Prediction Latency:</strong> Track p50, p95, p99 inference
            latency. Alert on SLO violations (p99 &gt; 100ms).
          </li>
          <li>
            <strong>Data Quality:</strong> Check for missing features, null rates,
            out-of-range values. Alert on anomalies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Ranking optimization involves balancing competing objectives and choosing
          appropriate techniques.
        </p>

        <h3>Model Complexity Trade-offs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Model Type</th>
                <th className="text-left p-2 font-semibold">Accuracy</th>
                <th className="text-left p-2 font-semibold">Latency</th>
                <th className="text-left p-2 font-semibold">Training Cost</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Linear (Logistic Regression)</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Very Low (&lt;1ms)</td>
                <td className="p-2">Low</td>
                <td className="p-2">Baseline, interpretable</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Tree-based (XGBoost)</td>
                <td className="p-2">High</td>
                <td className="p-2">Low (5-20ms)</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Production standard</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Neural (Deep Learning)</td>
                <td className="p-2">Very High</td>
                <td className="p-2">Medium (20-100ms)</td>
                <td className="p-2">High</td>
                <td className="p-2">Large datasets, complex patterns</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Listwise (LambdaMART)</td>
                <td className="p-2">Highest</td>
                <td className="p-2">Medium (10-50ms)</td>
                <td className="p-2">High</td>
                <td className="p-2">Final ranking stage</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/ranking-optimization/ab-testing-framework.svg"
          alt="A/B Testing Framework"
          caption="Figure 3: A/B Testing Framework — User assignment, metrics collection, statistical analysis, and deployment decision"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Offline vs Online Metrics</h3>
        <p>
          <strong>Offline Metrics:</strong> Computed on held-out test set. NDCG@10,
          MRR, precision@K. Fast to compute, good for iteration. Limitation: May not
          correlate with user satisfaction.
        </p>
        <p>
          <strong>Online Metrics:</strong> Computed from live user interactions. CTR,
          conversion rate, watch time, retention. Ground truth for user satisfaction.
          Limitation: Slow to collect, requires A/B testing.
        </p>
        <p>
          <strong>Best Practice:</strong> Optimize offline metrics during development,
          validate with online metrics via A/B testing. Ensure offline metrics
          correlate with online metrics (validate correlation periodically).
        </p>

        <h3 className="mt-6">Exploration vs Exploitation</h3>
        <p>
          <strong>Exploitation:</strong> Rank by predicted relevance. Maximizes
          short-term engagement. Risk: Filter bubbles, new content never surfaces.
        </p>
        <p>
          <strong>Exploration:</strong> Occasionally rank uncertain items higher.
          Gathers data on new items, prevents filter bubbles. Risk: Short-term
          engagement drop.
        </p>
        <p>
          <strong>Production Approach:</strong> Multi-armed bandit (Thompson Sampling,
          UCB). Allocate 5-10% of impressions to exploration. Balance long-term
          learning with short-term performance.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Start Simple:</strong> Begin with logistic regression baseline.
            Add complexity only if it improves metrics. Simple models are easier to
            debug and maintain.
          </li>
          <li>
            <strong>Feature Validation:</strong> Check feature distributions before
            and after deployment. Alert on drift. Features that change distribution
            indicate pipeline issues.
          </li>
          <li>
            <strong>A/B Test Everything:</strong> Never deploy ranking changes without
            A/B testing. Even "obvious" improvements can have unintended consequences.
          </li>
          <li>
            <strong>Monitor Guardrail Metrics:</strong> Track latency, error rate,
            diversity alongside primary metrics. Ensure changes don't break things.
          </li>
          <li>
            <strong>Segment Analysis:</strong> Analyze A/B test results by segment
            (mobile vs desktop, new vs returning). Changes may help one segment but
            hurt another.
          </li>
          <li>
            <strong>Retrain Regularly:</strong> User behavior changes over time.
            Retrain models weekly or daily. Use recent data with higher weight.
          </li>
          <li>
            <strong>Handle Cold Start:</strong> New items/users have no history.
            Use content-based features, popularity priors, exploration bandits.
          </li>
          <li>
            <strong>Document Experiments:</strong> Keep experiment log with
            hypothesis, results, learnings. Prevents repeating failed experiments.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Data Leakage:</strong> Using future data in training. Solution:
            Time-based train/validation split, careful feature engineering.
          </li>
          <li>
            <strong>Overfitting:</strong> Model performs well offline but poorly
            online. Solution: Regularization, cross-validation, simpler models.
          </li>
          <li>
            <strong>Ignoring Guardrail Metrics:</strong> Primary metric improves but
            latency explodes. Solution: Always track guardrail metrics, set SLOs.
          </li>
          <li>
            <strong>Short Test Duration:</strong> Stopping test before significance.
            Solution: Use power analysis, run for full week (capture weekly patterns).
          </li>
          <li>
            <strong>Feature Explosion:</strong> Too many features causes overfitting
            and latency. Solution: Feature selection, regularization, monitor feature
            importance.
          </li>
          <li>
            <strong>Ignoring Position Bias:</strong> Top results get more clicks
            regardless of quality. Solution: De-bias training data, use position
            as feature, inverse propensity weighting.
          </li>
          <li>
            <strong>No Rollback Plan:</strong> Bad deployment breaks ranking.
            Solution: Canary deployments, automatic rollback on metric degradation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Netflix Ranking Optimization</h3>
        <p>
          Netflix optimizes video ranking for watch time. Features: viewing history,
            time of day, device, content metadata. A/B tests run for 1-2 weeks with
          millions of users. Primary metric: watch time, guardrail: diversity.
        </p>
        <p>
          <strong>Key Innovation:</strong> Personalized artwork ranking—different
          thumbnails for same title based on predicted appeal. Increased CTR by 5-10%.
        </p>

        <h3 className="mt-6">Amazon Product Ranking</h3>
        <p>
          Amazon optimizes product ranking for conversion rate. Features: product
          quality, price competitiveness, seller rating, user preferences. Uses
          two-stage ranking (retrieval + re-ranking).
        </p>
        <p>
          <strong>Key Innovation:</strong> Real-time feature updates—price changes,
          inventory updates reflected in ranking within minutes.
        </p>

        <h3 className="mt-6">LinkedIn Feed Ranking</h3>
        <p>
          LinkedIn optimizes feed ranking for engagement (likes, comments, shares).
          Features: connection degree, content type, past engagement, time decay.
          Uses XGBoost with pairwise loss.
        </p>
        <p>
          <strong>Key Innovation:</strong> Viral prediction—identifies content likely
          to go viral, boosts early to accelerate network effects.
        </p>

        <h3 className="mt-6">Google Search Ranking</h3>
        <p>
          Google runs thousands of ranking experiments yearly. Uses interleaving for
          fast feedback, traditional A/B tests for major changes. Features: 10000+
          including PageRank, content quality, user signals.
        </p>
        <p>
          <strong>Key Innovation:</strong> BERT integration for query understanding—
          improved ranking for conversational queries by 10%.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you A/B test ranking changes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Randomize users to control (current ranking) and
              treatment (new ranking) using consistent hashing on user_id. Define
              primary metric (CTR@10, conversion) and guardrail metrics (latency,
              diversity). Run test for 1-2 weeks until statistical significance
              (p-value &lt; 0.05). Use power analysis to determine sample size.
              Analyze segment-level effects. If test wins, roll out gradually
              (10% → 50% → 100%).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle feature importance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use permutation importance (shuffle feature, measure
              metric drop), SHAP values (game theory-based attribution), or ablation
              studies (remove feature, retrain). Monitor feature importance over
              time—drift indicates changing user behavior. Remove low-importance
              features to reduce latency and overfitting.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you deal with position bias?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Position bias: top results get more clicks regardless
              of quality. Solutions: (1) Include position as feature in model, (2) Use
              inverse propensity weighting (down-weight clicks on top positions), (3)
              De-bias training data using click models (DBN, SDBN), (4) Run interleaving
              experiments to measure true relevance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize for multiple objectives?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use multi-objective optimization: (1) Weighted sum
              (0.7 × CTR + 0.3 × diversity), (2) Constrained optimization (maximize
              CTR subject to diversity &gt; threshold), (3) Pareto optimization (find
              non-dominated solutions). Choose weights based on business priorities.
              Monitor all objectives as guardrail metrics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cold start in ranking?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> New items have no interaction history. Solutions:
              (1) Use content-based features (quality, category, author reputation),
              (2) Apply popularity prior (boost new items temporarily), (3) Show to
              exploration bandit users, (4) Use similar item embeddings (if similar
              items performed well, boost new item). Track "time to first engagement"
              metric.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you monitor ranking model health?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track online metrics (CTR, conversion) post-deployment.
              Alert on degradation (&gt;5% drop). Monitor feature distributions (KS
              test for drift). Track prediction latency (p50, p99). Check data quality
              (null rates, out-of-range values). Use dashboards for real-time visibility.
              Set up on-call rotation for alerts.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://netflixtechblog.com/netflix-recommendations-beyond-the-5-star-part-2-b8e6e1d0a0b9"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog — Ranking Optimization
            </a>
          </li>
          <li>
            <a
              href="https://www.microsoft.com/en-us/research/publication/learning-to-rank-for-information-retrieval/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Research — Learning to Rank for Information Retrieval
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/machine-learning/guides/text-classification/step-by-step/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Developers — Machine Learning Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://exp-platform.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft ExP Platform — A/B Testing Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/blogs/machine-learning/operationalizing-machine-learning-models/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS Blog — Operationalizing ML Models
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
