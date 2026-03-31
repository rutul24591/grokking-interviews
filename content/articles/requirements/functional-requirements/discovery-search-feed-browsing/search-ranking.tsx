"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-search-ranking",
  title: "Search Ranking",
  description:
    "Comprehensive guide to search ranking systems covering relevance scoring, learning-to-rank models, two-stage ranking architecture, and optimization strategies for production search.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "search-ranking",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "search",
    "ranking",
    "backend",
    "ml-ranking",
  ],
  relatedTopics: ["query-processing", "recommendation-algorithms", "search-indexing", "ml-ranking"],
};

export default function SearchRankingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Search Ranking</strong> is the process of ordering search results by
          their estimated relevance to a user's query. It is the core intelligence layer
          of any search system, determining which results users see first and directly
          impacting user satisfaction, engagement, and trust in the platform.
        </p>
        <p>
          Modern search ranking has evolved far beyond simple keyword matching. Production
          systems at Google, Amazon, Netflix, and LinkedIn combine hundreds of signals
          through sophisticated ML models: text relevance (BM25, TF-IDF), content quality
          scores, user personalization, freshness, popularity, and business rules. The
          ranking system must balance accuracy with latency—users expect sub-100ms search
          response times even when running complex neural ranking models.
        </p>
        <p>
          For staff-level engineers, understanding ranking architecture is critical. You'll
          design two-stage ranking pipelines (fast retrieval + expensive re-ranking),
          implement learning-to-rank models, handle cold start for new content, prevent
          ranking manipulation, and optimize for business metrics while maintaining result
          diversity and fairness.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Text Relevance Algorithms</h3>
        <p>
          Text matching remains the foundation of search ranking. Understanding these
          algorithms is essential:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>TF-IDF (Term Frequency-Inverse Document Frequency):</strong> Scores
            terms based on frequency in document vs frequency across corpus. Common terms
            (&quot;the&quot;, &quot;is&quot;) get lower weights. Simple but effective for
            many use cases. Limitation: doesn't capture semantic meaning.
          </li>
          <li>
            <strong>BM25 (Best Matching 25):</strong> Improvement over TF-IDF with term
            frequency saturation and document length normalization. Industry standard for
            full-text search. Elasticsearch and Solr use BM25 by default. Parameters k1
            (term frequency saturation) and b (length normalization) can be tuned.
          </li>
          <li>
            <strong>Vector Space Model:</strong> Represents documents and queries as vectors
            in high-dimensional space. Relevance = cosine similarity between query and
            document vectors. Enables semantic search when combined with embeddings.
          </li>
        </ul>

        <h3 className="mt-6">Learning-to-Rank Approaches</h3>
        <p>
          ML-based ranking learns from historical user behavior to predict relevance:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Pointwise:</strong> Treats ranking as regression/classification. Predict
            relevance score for each (query, document) pair independently. Simple but
            ignores relative ordering.
          </li>
          <li>
            <strong>Pairwise:</strong> Learns to compare document pairs. Given documents A
            and B for same query, predict which is more relevant. Captures relative
            preference. Algorithms: RankNet, LambdaRank.
          </li>
          <li>
            <strong>Listwise:</strong> Optimizes entire result list quality. Directly
            optimizes ranking metrics like NDCG. Most accurate but computationally
            expensive. Algorithms: LambdaMART, ListNet.
          </li>
        </ul>

        <h3 className="mt-6">Two-Stage Ranking Architecture</h3>
        <p>
          Production search uses a two-stage approach to balance accuracy and latency:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Stage 1 - Retrieval (Candidate Generation):</strong> Fast, cheap
            algorithms retrieve ~1000 candidates from millions of documents. Uses inverted
            index, BM25, approximate nearest neighbors (ANN). Latency budget: 10-50ms.
          </li>
          <li>
            <strong>Stage 2 - Re-ranking:</strong> Expensive ML model scores and re-ranks
            top candidates. Incorporates personalization, quality signals, business rules.
            Returns final 10-50 results. Latency budget: 50-100ms.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production search ranking system consists of multiple components working
          together to deliver relevant results at scale.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/search-ranking/ranking-architecture.svg"
          alt="Two-Stage Search Ranking Architecture"
          caption="Figure 1: Two-Stage Ranking Architecture — Fast retrieval narrows millions to thousands, expensive re-ranking produces final results"
          width={1000}
          height={500}
        />

        <h3>Component Breakdown</h3>
        <ul className="space-y-3">
          <li>
            <strong>Query Processor:</strong> Parses user query, applies tokenization,
            stemming, spelling correction, query expansion. Extracts intent signals
            (navigational, informational, transactional).
          </li>
          <li>
            <strong>Retrieval Engine:</strong> Executes search against inverted index.
            Implements BM25 scoring, field boosting (title &gt; body), phrase matching.
            Returns candidate set with base relevance scores.
          </li>
          <li>
            <strong>Feature Store:</strong> Serves ranking features in real-time: document
            quality scores, author reputation, historical CTR, user affinity features,
            freshness. Pre-computed features cached in Redis.
          </li>
          <li>
            <strong>Ranking Model:</strong> ML model (XGBoost, LambdaMART, neural network)
            that takes feature vector and outputs relevance score. Deployed as microservice
            with model versioning and A/B testing support.
          </li>
          <li>
            <strong>Re-ranking Module:</strong> Applies business rules, diversity
            constraints, freshness guarantees. Ensures no more than N results from same
            domain/author. Injects promoted content if applicable.
          </li>
          <li>
            <strong>Result Formatter:</strong> Formats final results with snippets,
            highlighting, metadata. Applies result grouping if needed (threaded comments,
            product variants).
          </li>
        </ul>

        <h3 className="mt-6">Ranking Signal Categories</h3>
        <p>Production ranking systems use 100-500+ features across categories:</p>
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
                <td className="p-2 font-semibold">Text Relevance</td>
                <td className="p-2">BM25 score, query term match count, field match weights</td>
                <td className="p-2">Real-time (per query)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Document Quality</td>
                <td className="p-2">Word count, image count, readability score, spam score</td>
                <td className="p-2">Pre-computed (batch)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Popularity</td>
                <td className="p-2">Views, clicks, shares, conversion rate, engagement velocity</td>
                <td className="p-2">Near-real-time (streaming)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Personalization</td>
                <td className="p-2">User affinity, past clicks, location, device, session context</td>
                <td className="p-2">Real-time (per user)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Freshness</td>
                <td className="p-2">Document age, update recency, trending velocity</td>
                <td className="p-2">Pre-computed (hourly)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Authority</td>
                <td className="p-2">Author reputation, domain authority, citation count</td>
                <td className="p-2">Pre-computed (daily)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/search-ranking/ranking-signal-flow.svg"
          alt="Ranking Signal Flow Diagram"
          caption="Figure 2: Ranking Signal Flow — Query and candidate features combined, scored by ML model, re-ranked with business rules"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Feature Engineering Pipeline</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Feature Identification:</strong> Analyze search logs to identify signals
            correlated with user satisfaction (clicks, dwell time, conversion).
          </li>
          <li>
            <strong>Feature Computation:</strong> Implement feature computation logic.
            Batch features computed daily/hourly (document quality, authority). Real-time
            features computed per-query (text relevance, personalization).
          </li>
          <li>
            <strong>Feature Storage:</strong> Store batch features in feature store
            (Redis, Cassandra). Serve via low-latency API (&lt;10ms p99).
          </li>
          <li>
            <strong>Feature Normalization:</strong> Normalize features to comparable scales
            (min-max scaling, z-score). Handle missing values (default, interpolation).
          </li>
          <li>
            <strong>Feature Monitoring:</strong> Track feature distributions, detect drift.
            Alert on anomalies (sudden change in feature values indicates pipeline issues).
          </li>
        </ol>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Search ranking requires balancing competing concerns. Understanding these
          trade-offs is critical for system design decisions.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/search-ranking/ab-testing-architecture.svg"
          alt="A/B Testing Architecture for Ranking"
          caption="Figure 3: A/B Testing Architecture — Traffic splitter routes users to control/treatment, metrics collection, statistical analysis, and rollout decision timeline"
          width={1000}
          height={500}
        />

        <h3>Ranking Model Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Approach</th>
                <th className="text-left p-2 font-semibold">Accuracy</th>
                <th className="text-left p-2 font-semibold">Latency</th>
                <th className="text-left p-2 font-semibold">Training Data</th>
                <th className="text-left p-2 font-semibold">Complexity</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">BM25 / TF-IDF</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Very Low (&lt;10ms)</td>
                <td className="p-2">None</td>
                <td className="p-2">Low</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Linear Combination</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Low (&lt;20ms)</td>
                <td className="p-2">Some (for weights)</td>
                <td className="p-2">Low-Medium</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">XGBoost / LambdaMART</td>
                <td className="p-2">High</td>
                <td className="p-2">Medium (20-50ms)</td>
                <td className="p-2">Significant</td>
                <td className="p-2">Medium-High</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Neural (BERT)</td>
                <td className="p-2">Very High</td>
                <td className="p-2">High (100-500ms)</td>
                <td className="p-2">Extensive</td>
                <td className="p-2">Very High</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Retrieval Strategy Trade-offs</h3>
        <p>
          <strong>Dense Retrieval (Vector Search):</strong> Uses neural embeddings (BERT,
          Sentence Transformers) to capture semantic meaning. Finds relevant documents
          even without keyword overlap. Excellent for conceptual queries. Limitations:
          expensive embedding computation, requires approximate nearest neighbors (FAISS,
          Annoy) for scale, may miss exact keyword matches.
        </p>
        <p>
          <strong>Sparse Retrieval (BM25):</strong> Traditional keyword-based search. Fast,
          interpretable, excellent for exact match queries. Limitations: vocabulary mismatch
          problem (synonyms not matched), no semantic understanding.
        </p>
        <p>
          <strong>Hybrid Retrieval:</strong> Combines both approaches. Retrieve candidates
          from both dense and sparse indices, merge results with score normalization.
          Best of both worlds but adds complexity. Production standard for high-quality
          search.
        </p>

        <h3 className="mt-6">Personalization vs. Relevance</h3>
        <p>
          <strong>Personalized Ranking:</strong> Boosts results based on user history,
          preferences, location. Increases engagement for known users. Risks: filter
          bubbles, cold start for new users, privacy concerns.
        </p>
        <p>
          <strong>Non-Personalized Ranking:</strong> Same results for all users querying
          the same terms. Transparent, fair, no cold start. Risks: lower engagement,
          misses user intent signals.
        </p>
        <p>
          <strong>Hybrid Approach:</strong> Blend personalized and non-personalized scores.
          Weight personalization higher for engaged users, lower for new users. Allow users
          to toggle personalization. Production best practice.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement Two-Stage Ranking:</strong> Always use retrieval + re-ranking
            architecture. Retrieval should be sub-50ms with BM25/ANN. Re-ranking can be
            more expensive (ML model) since it operates on smaller candidate set.
          </li>
          <li>
            <strong>Cache Top Queries:</strong> Cache results for popular queries with TTL.
            Use query normalization (lowercase, remove stop words) for cache key. Invalidate
            cache on significant content updates.
          </li>
          <li>
            <strong>Use Learning-to-Rank:</strong> Train LambdaMART or XGBoost model on
            historical click data. Use pairwise loss functions. Retrain weekly with fresh
            data. Monitor feature importance to identify signal degradation.
          </li>
          <li>
            <strong>Implement Diversity Constraints:</strong> Limit results from same
            domain/author (max 2-3 per page). Ensure category diversity for broad queries.
            Use maximal marginal relevance (MMR) for re-ranking.
          </li>
          <li>
            <strong>Handle Query Intent:</strong> Classify queries as navigational
            (looking for specific page), informational (seeking knowledge), or
            transactional (wanting to buy/do). Adjust ranking weights per intent type.
          </li>
          <li>
            <strong>Monitor Ranking Quality:</strong> Track NDCG@10, MRR, click-through
            rate, zero-result rate. Set up alerts for metric degradation. Conduct regular
            human evaluation (side-by-side comparison of ranking variants).
          </li>
          <li>
            <strong>A/B Test Ranking Changes:</strong> Never deploy ranking changes without
            A/B testing. Run tests for 1-2 weeks minimum. Measure primary metrics (CTR,
            conversion) and guardrail metrics (latency, diversity).
          </li>
          <li>
            <strong>Implement Position Bias Correction:</strong> Users click top results
            more often regardless of quality. Use click models (DBN, SDBN) to estimate
            true relevance from biased click data.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Overfitting to Historical Data:</strong> Model learns past patterns but
            fails on new content or queries. Solution: Regularization, cross-validation,
            online learning to adapt to recent trends.
          </li>
          <li>
            <strong>Ignoring Cold Start:</strong> New content never ranked highly without
            engagement history. Solution: Boost new content temporarily, use content-based
            features (quality, author reputation) until engagement data available.
          </li>
          <li>
            <strong>Feedback Loops:</strong> Highly-ranked content gets more clicks,
            reinforcing its position regardless of quality. Solution: Inject exploration
            (multi-armed bandit), demote previously shown content, use counterfactual
            evaluation.
          </li>
          <li>
            <strong>Feature Leakage:</strong> Using features in training that won't be
            available at inference time. Solution: Careful feature audit, time-based
            train/test splits to catch leakage.
          </li>
          <li>
            <strong>Latency Budget Violations:</strong> Complex ranking models cause
            timeouts. Solution: Two-stage ranking, model distillation (train smaller model
            to mimic large model), feature caching, async feature computation.
          </li>
          <li>
            <strong>Ranking Manipulation:</strong> Bad actors game ranking signals (click
            farms, fake engagement). Solution: Detect abnormal patterns, weight engagement
            by user trust score, implement rate limiting.
          </li>
          <li>
            <strong>Ignoring Query Context:</strong> Same ranking for all queries ignores
            intent differences. Solution: Intent classification, query-specific ranking
            models or weight adjustments.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Google Search</h3>
        <p>
          Google uses a multi-stage ranking pipeline with hundreds of signals. BERT
          integration (2019) enables neural understanding of query context and document
          semantics. E-A-T signals (Expertise, Authoritativeness, Trustworthiness) weight
          content quality. PageRank remains a foundational signal. Real-time updates
          incorporate freshness for breaking news.
        </p>
        <p>
          <strong>Key Innovation:</strong> Google's &quot;Helpful Content Update&quot; uses
          neural classifiers to identify content created for search engines vs humans,
          demoting SEO-optimized low-quality content.
        </p>

        <h3 className="mt-6">Amazon Product Search</h3>
        <p>
          Amazon ranking heavily weights conversion probability. Features include: text
          relevance, product popularity, price competitiveness, seller rating, Prime
          eligibility, inventory status. Personalization based on browsing/purchase
          history. A9 algorithm continuously optimizes for revenue per search.
        </p>
        <p>
          <strong>Key Innovation:</strong> Amazon uses &quot;query rewriting&quot; to
          handle typos, synonyms, and product attribute extraction (&quot;red dress size
          M&quot; → structured filters).
        </p>

        <h3 className="mt-6">Netflix Search</h3>
        <p>
          Netflix search balances title matching with personalization. Features: title
          match, cast/crew match, viewing history similarity, artwork personalization,
          content freshness. Handles ambiguous queries (&quot;action&quot; → personalized
          action movies).
        </p>
        <p>
          <strong>Key Innovation:</strong> Netflix uses &quot;search taste profiles&quot; —
          clusters users by search behavior and tailors results per cluster.
        </p>

        <h3 className="mt-6">LinkedIn Search</h3>
        <p>
          LinkedIn search handles multiple entity types: people, jobs, companies, content.
          Uses entity-specific ranking models. People search weights: connection degree,
          profile completeness, industry relevance, past interactions. Job search weights:
          skills match, experience level, location, company affinity.
        </p>
        <p>
          <strong>Key Innovation:</strong> LinkedIn's &quot;People You May Know&quot;
          integration into people search surfaces relevant 2nd-degree connections.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize ranking at scale?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement two-stage ranking architecture. Stage 1
              (retrieval): Use BM25 with inverted index to fetch 1000 candidates in
              &lt;50ms. Apply field boosting (title 2x, body 1x). Stage 2 (re-ranking):
              Use XGBoost/LambdaMART model with 50-100 features to score and re-rank
              top candidates. Cache top 1000 queries with TTL. Use approximate nearest
              neighbors (FAISS) for vector search. Deploy ranking model as microservice
              with auto-scaling. Monitor p99 latency and set SLOs (&lt;100ms).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle ranking for new content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement exploration-exploitation strategy. New content
              gets temporary boost (exploration period: 24-72 hours). Use content-based
              features (quality score, author reputation, topic relevance) since engagement
              data unavailable. Show to subset of users (5-10%) to gather initial engagement
              signals. If engagement exceeds threshold, gradually increase visibility. If
              underperforms, reduce boost. Track &quot;time to first engagement&quot; metric
              to optimize exploration period.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you A/B test ranking changes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Randomize users to control (current ranking) and treatment
              (new ranking) groups. Use consistent hashing on user_id for stable assignment.
              Run test for 1-2 weeks to capture weekly patterns. Measure primary metrics:
              CTR@10, conversion rate, dwell time. Guardrail metrics: search latency,
              diversity score (results per domain), zero-result rate. Use statistical
              significance testing (t-test, bootstrap). For faster results, use interleaving
              (mix control and treatment results, measure which results users click).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent ranking manipulation?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Multi-layered approach: (1) Detect abnormal engagement
              patterns — sudden spikes from new accounts, coordinated timing, geographic
              anomalies. (2) Weight engagement by user trust score — established users
              count more than new accounts. (3) Implement rate limiting on engagement
              actions per user/IP. (4) Use click fraud detection models. (5) Human review
              for suspicious ranking changes. (6) Demote content with detected manipulation,
              penalize associated accounts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle personalization in ranking?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Compute user-specific features: affinity scores for
              authors/topics based on past interactions, location-based boosting, device
              context (mobile vs desktop preferences). Blend personalized score with
              global relevance score: final_score = α × global_relevance + (1-α) ×
              personalization, where α varies by user engagement level (lower α for
              engaged users, higher for new users). Allow users to reset personalization.
              Implement &quot;why this result&quot; explanations for transparency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure ranking quality?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use combination of offline and online metrics. Offline:
              NDCG@10 (Normalized Discounted Cumulative Gain), MRR (Mean Reciprocal Rank),
              precision@K. Compute on held-out test set with human-labeled relevance.
              Online: CTR@10, click position distribution, dwell time, conversion rate,
              search success rate (no quick reformulation). Track zero-result rate and
              query abandonment. Conduct regular human evaluation (side-by-side comparison
              of ranking variants with raters).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.manning.com/books/relevant-search"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Turnbull, Doug & Berryman, John — Relevant Search
            </a>
          </li>
          <li>
            <a
              href="https://ai.googleblog.com"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google AI Blog — BERT for Search Ranking
            </a>
          </li>
          <li>
            <a
              href="https://www.amazon.science"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon Science — A9 Product Search Ranking
            </a>
          </li>
          <li>
            <a
              href="https://www.elastic.co/guide"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Elasticsearch Documentation — Function Score Query
            </a>
          </li>
          <li>
            <a
              href="https://www.microsoft.com/en-us/research/publication/learning-to-rank-for-information-retrieval/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Liu, Tie-Yan — Learning to Rank for Information Retrieval
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
