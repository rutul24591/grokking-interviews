"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-recommendation-algorithms",
  title: "Recommendation Algorithms",
  description:
    "Comprehensive guide to recommendation algorithms covering collaborative filtering, content-based filtering, hybrid approaches, cold start solutions, and evaluation metrics.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "recommendation-algorithms",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "recommendations",
    "ml",
    "backend",
    "collaborative-filtering",
  ],
  relatedTopics: ["ml-ranking", "collaborative-filtering", "personalization", "feed-generation"],
};

export default function RecommendationAlgorithmsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Recommendation Algorithms</strong> are ML systems that predict which items
          (content, products, connections) a user will find relevant. They are the core
          discovery engine for modern platforms—Netflix attributes 80% of watched content to
          recommendations, Amazon reports 35% of revenue from product recommendations, and
          YouTube's recommendation system drives 70% of watch time.
        </p>
        <p>
          The recommendation problem is fundamentally about information filtering: given
          millions of items and thousands of users, efficiently surface the handful of items
          each user will engage with. This requires solving multiple challenges: sparse
          interaction data (most users interact with &lt;0.01% of items), cold start (new
          users/items with no history), scalability (millions of users × millions of items),
          and diversity (avoiding filter bubbles while maintaining relevance).
        </p>
        <p>
          For staff-level engineers, recommendation systems represent a complex distributed
          systems challenge combining ML infrastructure, real-time feature computation,
          approximate nearest neighbor search, and A/B testing at scale.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Collaborative Filtering</h3>
        <p>
          Collaborative filtering (CF) recommends items based on user-item interaction patterns,
          without requiring item content analysis. The core insight: users who agreed in the
          past will agree in the future.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>User-Based CF:</strong> Find similar users, recommend what they liked.
            Similarity via cosine similarity, Pearson correlation. Scalability issues:
            O(n²) user comparisons.
          </li>
          <li>
            <strong>Item-Based CF:</strong> Find items similar to what user liked. Amazon's
            &quot;customers who bought this also bought&quot;. More stable than user-based
            (item relationships change slower than user preferences).
          </li>
          <li>
            <strong>Matrix Factorization:</strong> Decompose user-item interaction matrix
            into latent factor matrices. SVD (Singular Value Decomposition), ALS
            (Alternating Least Squares). Captures latent preferences (e.g., &quot;likes
            sci-fi with strong female leads&quot; without explicit tagging).
          </li>
        </ul>

        <h3 className="mt-6">Content-Based Filtering</h3>
        <p>
          Content-based filtering recommends items similar to what the user liked before,
          based on item features.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Feature Extraction:</strong> TF-IDF for text, CNN embeddings for images,
            audio features for music, metadata (genre, director, author).
          </li>
          <li>
            <strong>Similarity Computation:</strong> Cosine similarity between item feature
            vectors. User profile = weighted average of liked item features.
          </li>
          <li>
            <strong>Advantages:</strong> No cold start for new items (content available
            immediately), transparent recommendations (&quot;because you liked X&quot;),
            no filter bubble from popular items.
          </li>
          <li>
            <strong>Limitations:</strong> Requires rich content features, can't capture
            nuanced preferences (&quot;I like comedies but not slapstick&quot;), overspecialization.
          </li>
        </ul>

        <h3 className="mt-6">Hybrid Approaches</h3>
        <p>
          Hybrid recommenders combine collaborative and content-based signals for better
          accuracy and robustness.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Weighted Hybrid:</strong> Score = α × CF_score + (1-α) × Content_score.
            Simple but effective.
          </li>
          <li>
            <strong>Feature Combination:</strong> Use CF latent factors + content features
            as input to single model.
          </li>
          <li>
            <strong>Wide &amp; Deep (Google):</strong> Wide path memorizes feature
            interactions, deep path generalizes to similar items. Production standard for
            large-scale recommendations.
          </li>
          <li>
            <strong>DeepFM:</strong> Factorization machine + deep neural network. Captures
            both low-order and high-order feature interactions.
          </li>
        </ul>

        <h3 className="mt-6">Session-Based Recommendations</h3>
        <p>
          Session-based recommenders predict next action within a session, crucial for
          anonymous users or short-term intent.
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Markov Chains:</strong> Model transition probabilities between items.
            Simple but limited context window.
          </li>
          <li>
            <strong>RNN/GRU:</strong> Recurrent networks capture sequential patterns.
            &quot;Users who watched A then B often watch C&quot;.
          </li>
          <li>
            <strong>Transformers:</strong> Self-attention captures long-range dependencies.
            BERT4Rec uses bidirectional attention for next-item prediction.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production recommendation systems use a multi-stage pipeline to efficiently
          narrow millions of candidates to a personalized shortlist.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/recommendation-algorithms/collaborative-filtering-architecture.svg"
          alt="Collaborative Filtering Architecture"
          caption="Figure 1: Collaborative Filtering — User-item interaction matrix factorized into latent factors for preference prediction"
          width={1000}
          height={500}
        />

        <h3>Multi-Stage Recommendation Pipeline</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Candidate Generation (Retrieval):</strong> Fast algorithms retrieve
            ~1000 candidates from millions. Collaborative filtering (ALS, item-item),
            content-based retrieval (ANN on embeddings), trending/popular fallback.
            Latency budget: 10-50ms.
          </li>
          <li>
            <strong>Scoring/Ranking:</strong> ML model scores each candidate. Features:
            user preferences, item quality, context (time, device), cross features.
            Model: XGBoost, Wide&amp;Deep, DeepFM. Latency budget: 50-100ms.
          </li>
          <li>
            <strong>Re-Ranking:</strong> Apply business rules, diversity constraints,
            freshness guarantees. Remove duplicates, filter inappropriate content, boost
            new creators. Latency budget: 10-20ms.
          </li>
          <li>
            <strong>Delivery:</strong> Return top N (20-100) recommendations. Cache for
            returning users, track impressions for feedback loop.
          </li>
        </ol>

        <h3 className="mt-6">Matrix Factorization Deep Dive</h3>
        <p>
          Matrix factorization is the workhorse of collaborative filtering. Given a sparse
          user-item interaction matrix R (m users × n items), factorize into:
        </p>
        <p className="my-4 font-mono text-sm">
          R ≈ U × V^T
        </p>
        <p>
          Where U is m × k (user latent factors), V is n × k (item latent factors), and k
          is the latent dimension (typically 50-200).
        </p>
        <p>
          <strong>Training:</strong> Minimize reconstruction error with regularization:
        </p>
        <p className="my-4 font-mono text-sm">
          Loss = Σ(r_ui - u_u · v_i)² + λ(||U||² + ||V||²)
        </p>
        <p>
          <strong>ALS (Alternating Least Squares):</strong> Fix U, solve for V. Fix V,
          solve for U. Iterate until convergence. Parallelizable, handles implicit feedback
          (views, clicks) well.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/recommendation-algorithms/hybrid-recommendation-pipeline.svg"
          alt="Hybrid Recommendation Pipeline"
          caption="Figure 2: Hybrid Recommendation Pipeline — Multiple candidate sources merged, scored by ML model, re-ranked with diversity constraints"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Feature Engineering for Recommendations</h3>
        <p>Feature categories for ranking model:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Category</th>
                <th className="text-left p-2 font-semibold">Example Features</th>
                <th className="text-left p-2 font-semibold">Computation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">User Features</td>
                <td className="p-2">Age, location, language, tenure, preferences</td>
                <td className="p-2">Pre-computed (daily)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Item Features</td>
                <td className="p-2">Category, quality score, engagement rate, freshness</td>
                <td className="p-2">Pre-computed (hourly)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Interaction Features</td>
                <td className="p-2">Past clicks, watch time, likes, shares</td>
                <td className="p-2">Real-time + pre-computed</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Context Features</td>
                <td className="p-2">Time of day, device, location, session length</td>
                <td className="p-2">Real-time</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Cross Features</td>
                <td className="p-2">User_age × Item_category, User_location × Item_language</td>
                <td className="p-2">Computed at inference</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Recommendation algorithm selection involves balancing accuracy, scalability,
          interpretability, and cold start handling.
        </p>

        <h3>Algorithm Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Algorithm</th>
                <th className="text-left p-2 font-semibold">Accuracy</th>
                <th className="text-left p-2 font-semibold">Scalability</th>
                <th className="text-left p-2 font-semibold">Cold Start</th>
                <th className="text-left p-2 font-semibold">Interpretability</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">User-Based CF</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Poor O(n²)</td>
                <td className="p-2">Poor</td>
                <td className="p-2">Good</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Item-Based CF</td>
                <td className="p-2">Medium-High</td>
                <td className="p-2">Good</td>
                <td className="p-2">Poor (new items)</td>
                <td className="p-2">Excellent</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Matrix Factorization</td>
                <td className="p-2">High</td>
                <td className="p-2">Good (after training)</td>
                <td className="p-2">Poor</td>
                <td className="p-2">Poor</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Content-Based</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Excellent</td>
                <td className="p-2">Good (new items)</td>
                <td className="p-2">Excellent</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Wide &amp; Deep</td>
                <td className="p-2">Very High</td>
                <td className="p-2">Good</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Medium</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">DeepFM</td>
                <td className="p-2">Very High</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Poor</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/recommendation-algorithms/cold-start-solutions.svg"
          alt="Cold Start Solutions Diagram"
          caption="Figure 3: Cold Start Solutions — Strategies for new users (onboarding, popularity, demographics) and new items (content-based, boost, exploration)"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Exploration vs Exploitation</h3>
        <p>
          <strong>Exploitation:</strong> Recommend what you know the user will like.
          Maximizes short-term engagement but creates filter bubbles and prevents new
          item discovery.
        </p>
        <p>
          <strong>Exploration:</strong> Recommend uncertain items to learn preferences.
          Reduces short-term engagement but improves long-term accuracy and diversity.
        </p>
        <p>
          <strong>Multi-Armed Bandit:</strong> Mathematically optimal exploration-exploitation
          balance. Thompson Sampling, Upper Confidence Bound (UCB), epsilon-greedy.
          Production systems allocate 5-10% of impressions to exploration.
        </p>

        <h3 className="mt-6">Accuracy vs Diversity</h3>
        <p>
          <strong>High Accuracy, Low Diversity:</strong> Recommend only top predicted
          items. Users see highly relevant content but from narrow range of sources/topics.
          Risk: filter bubbles, user boredom.
        </p>
        <p>
          <strong>High Diversity, Lower Accuracy:</strong> Inject diverse content across
          categories, sources, viewpoints. Users see broader content but some irrelevant.
          Risk: lower engagement, user confusion.
        </p>
        <p>
          <strong>Production Approach:</strong> Maximal Marginal Relevance (MMR). Select
          items that are both relevant AND dissimilar to already-selected items. Parameter
          λ controls accuracy-diversity trade-off.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Multi-Stage Pipeline:</strong> Never rank all items directly.
            Candidate generation (fast, high recall) → scoring (accurate, lower recall) →
            re-ranking (business rules). Each stage narrows by 10-100x.
          </li>
          <li>
            <strong>Handle Cold Start Explicitly:</strong> New users: onboarding flow,
            popularity-based, demographic-based. New items: content-based scoring,
            temporary boost, show to engaged users first.
          </li>
          <li>
            <strong>Implement Negative Feedback:</strong> Track not just clicks but
            skips, hides, reports. Use implicit negative signals (short dwell time =
            dislike). Incorporate into model training.
          </li>
          <li>
            <strong>Use Approximate Nearest Neighbors:</strong> For candidate generation,
            use FAISS, Annoy, or HNSW for sub-linear similarity search. Critical for
            scaling to millions of items.
          </li>
          <li>
            <strong>Refresh Recommendations Regularly:</strong> User preferences drift
            over time. Retrain models weekly, incorporate recent interactions with higher
            weight. Implement &quot;because you recently watched X&quot; logic.
          </li>
          <li>
            <strong>Monitor Diversity Metrics:</strong> Track intra-list diversity
            (categories per page), coverage (% of items ever recommended), serendipity
            (unexpected but relevant). Set minimum diversity thresholds.
          </li>
          <li>
            <strong>A/B Test Everything:</strong> Test algorithm changes with interleaving
            (fast, less power) or traditional A/B tests (slow, more power). Measure
            long-term retention, not just immediate CTR.
          </li>
          <li>
            <strong>Implement Fallback Strategies:</strong> When ML model fails or user
            has no history, show: trending content, popular in category, new releases,
            curated collections. Never show empty recommendations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Ignoring Cold Start:</strong> New users see irrelevant recommendations,
            new items never get exposure. Solution: Explicit cold start strategies,
            content-based fallback, exploration bandits.
          </li>
          <li>
            <strong>Feedback Loops:</strong> Recommended items get more clicks, reinforcing
            their position regardless of quality. Solution: De-bias training data, use
            inverse propensity scoring, inject exploration.
          </li>
          <li>
            <strong>Popularity Bias:</strong> Model recommends only popular items, creating
            rich-get-richer effect. Solution: Down-weight popularity in training, ensure
            long-tail items get exposure, use category-normalized popularity.
          </li>
          <li>
            <strong>Overfitting to Historical Data:</strong> Model learns past patterns
            but fails on new content or changing preferences. Solution: Regularization,
            online learning, decay older interactions.
          </li>
          <li>
            <strong>Filter Bubbles:</strong> Users only see content similar to past
            interactions, narrowing worldview. Solution: Diversity constraints, serendipitous
            recommendations, &quot;expand your interests&quot; features.
          </li>
          <li>
            <strong>Ignoring Context:</strong> Same recommendations regardless of time,
            device, location. Solution: Context-aware features, time-decay functions,
            session-based modeling.
          </li>
          <li>
            <strong>Latency Issues:</strong> Complex models cause timeouts. Solution:
            Two-stage ranking, model distillation (train small model to mimic large),
            feature caching, async pre-computation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Netflix Recommendations</h3>
        <p>
          Netflix uses ensemble of 100+ models for different surfaces (homepage,
          &quot;because you watched&quot;, email). Key innovations: artwork personalization
          (different thumbnails for same title based on predicted appeal), taste profiles
          (cluster users by preference patterns), session-based &quot;continue watching&quot;
          prioritization.
        </p>
        <p>
          <strong>Key Innovation:</strong> Netflix Prize (2006-2009) offered $1M for 10%
          improvement in rating prediction. Winner: BellKor's Pragmatic Chaos used ensemble
          of 107 models. Modern Netflix system uses deep learning with attention mechanisms.
        </p>

        <h3 className="mt-6">YouTube Recommendations</h3>
        <p>
          YouTube's two-tower neural network: user tower (watch history, search history,
          demographics) and video tower (video embeddings, upload age, category). Candidate
          generation retrieves ~500 videos, ranking scores with watch time prediction.
        </p>
        <p>
          <strong>Key Innovation:</strong> Watch time (not clicks) as optimization target.
          Prevents clickbait, rewards engaging content. Negative signals (dismissals,
          &quot;not interested&quot;) incorporated into training.
        </p>

        <h3 className="mt-6">Amazon Product Recommendations</h3>
        <p>
          Amazon pioneered item-to-item collaborative filtering (&quot;customers who bought
          this also bought&quot;). Scales to hundreds of millions of items using offline
          similarity computation. Real-time personalization based on session behavior.
        </p>
        <p>
          <strong>Key Innovation:</strong> Purchase-based (not click-based) collaborative
          filtering. Higher signal-to-noise ratio (purchases indicate strong preference).
          Cross-selling recommendations drive 35% of Amazon revenue.
        </p>

        <h3 className="mt-6">Spotify Music Recommendations</h3>
        <p>
          Spotify combines collaborative filtering (user listening patterns), content-based
          (audio features: tempo, energy, danceability), and NLP (playlist descriptions,
          blog mentions). Discover Weekly uses collaborative filtering with weekly refresh.
        </p>
        <p>
          <strong>Key Innovation:</strong> &quot;Taste profiles&quot; map users to 100+
          musical dimensions (not genres). Enables nuanced recommendations (&quot;you like
          upbeat indie folk from 2010s&quot;).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale collaborative filtering?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use distributed matrix factorization (Spark ALS) for
              training. For inference, pre-compute item-item similarity offline, store in
              key-value store. Use approximate nearest neighbors (FAISS, Annoy) for
              candidate generation. Implement two-stage pipeline: retrieve 1000 candidates
              with CF, score with ML model, return top 100. Cache recommendations for
              returning users with TTL.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you evaluate recommendation quality?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Offline metrics: precision@K (fraction of recommended
              items clicked), recall@K (fraction of clicked items recommended), NDCG
              (position-aware ranking quality), coverage (% of items ever recommended).
              Online metrics: CTR, watch time/conversion rate, session length, return rate.
              Diversity metrics: intra-list distance, category entropy. Serendipity:
              recommended but unexpected items that user liked. Always A/B test with
              long-term retention as primary metric.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cold start for new users?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Multi-pronged approach: (1) Onboarding flow—ask for
              interests, follow topics, rate items. (2) Popularity-based—show trending
              content in broad categories. (3) Demographic-based—use age, location,
              language for initial recommendations. (4) Content exploration—show diverse
              content to quickly learn preferences. (5) Session-based—use early session
              behavior to refine. Track time-to-first-click and time-to-first-follow as
              onboarding success metrics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent filter bubbles?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement diversity constraints: maximal marginal
              relevance (MMR) for re-ranking, ensure X% of recommendations from outside
              user's typical categories. Inject serendipity: multi-armed bandit for
              exploration (5-10% of impressions), show &quot;because you might be
              interested&quot; for adjacent categories. User controls: &quot;see less
              like this&quot;, topic following/unfollowing, &quot;expand my interests&quot;
              feature. Monitor diversity metrics and set minimum thresholds.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle new items with no engagement?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Content-based scoring until engagement data available.
              Temporary boost for new items (exploration period: 24-72 hours). Show to
              subset of users who engage with new content (early adopters). Use creator
              reputation as proxy (established creators' new items get initial boost).
              Track &quot;time to first engagement&quot; and adjust boost parameters
              accordingly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you incorporate negative feedback?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Explicit negatives: track hides, dismissals, &quot;not
              interested&quot; clicks. Use as negative labels in training. Implicit
              negatives: short dwell time (&lt;10 seconds), skip after preview, scroll
              past without click. Weight negatives appropriately (hide &gt; skip &gt;
              short dwell). Implement negative decay—old negatives matter less than
              recent. Use for both training (negative samples) and filtering (don't
              recommend hidden items).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://netflixtechblog.com/netflix-recommendations-beyond-the-5-star-part-1-b8e6e1d0a0b9"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix Tech Blog — Recommendations Beyond the 5-Star
            </a>
          </li>
          <li>
            <a
              href="https://research.google/pubs/pub45530/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Research — Wide &amp; Deep Learning for Recommender Systems
            </a>
          </li>
          <li>
            <a
              href="https://www.amazon.science/publications/item-to-item-collaborative-filtering"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon Science — Item-to-Item Collaborative Filtering
            </a>
          </li>
          <li>
            <a
              href="https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46144.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Research — Deep Neural Networks for YouTube Recommendations
            </a>
          </li>
          <li>
            <a
              href="https://dl.acm.org/doi/10.1145/3109859.3109889"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ACM — DeepFM: A Factorization-Machine based Neural Network for CTR Prediction
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
