"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-personalized-homepage-feed",
  title: "Design a Personalized Homepage/Feed System",
  description:
    "Architecture for a personalized homepage feed: candidate generation, multi-stage ranking, real-time feature serving, cold start, experimentation, and feedback loops.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "personalized-homepage-feed-system",
  wordCount: 6400,
  readingTime: 39,
  lastUpdated: "2026-05-20",
  tags: ["hld", "personalization", "recommendation", "ranking", "cold-start", "ML", "feed"],
  relatedTopics: ["frontend-for-a-social-media-news-feed", "activity-feed-system"],
};

export default function PersonalizedHomepageFeedSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          A personalized homepage feed selects a small, ordered set of items for a specific user at a specific moment.
          It powers products such as video homepages, commerce recommendations, news feeds, professional content feeds,
          learning platforms, and creator marketplaces. The system is not just a ranking model; it is a latency-bound
          serving architecture that joins user history, real-time session signals, item metadata, freshness, diversity,
          policy constraints, and experimentation into one stable feed response.
        </HighlightBlock>
        <p>
          For interview scope, assume 50 million active users, 500 thousand to several million feedable items, peak
          traffic of 100 thousand homepage requests per second, and a P99 server-side feed budget around 200
          milliseconds. A request returns 20 to 50 items plus tracking metadata, explanation strings where needed, and
          pagination or refresh tokens. The system must support new users, returning users, logged-out users, stale
          caches, rapidly trending content, sponsored content, and safety or policy filtering.
        </p>
        <p>
          Principal-level discussion should separate the product goal from the model goal. Maximizing immediate clicks
          can create repetitive feeds, low-quality engagement, filter bubbles, or long-term retention loss. The better
          design optimizes a portfolio of metrics: click-through rate, dwell time, saves, purchases, hides, session
          satisfaction, return visits, content diversity, creator fairness, latency, and infrastructure cost.
        </p>
        <p>
          A strong design also includes safety and governance. The feed must enforce policy filters, blocked creators,
          age or region restrictions, inventory or availability constraints, ad load limits, and legal removals before
          ranking output reaches the user. Ranking should not be allowed to resurrect unsafe or unavailable content
          simply because the model predicts engagement.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Multi-stage Ranking Funnel</h3>
        <p>
          Ranking every item for every request is infeasible. The feed is a funnel: candidate generation retrieves a few
          thousand plausible items, pre-ranking narrows them to a few hundred with cheap features, final ranking scores
          the short list with richer features, and post-ranking applies diversity, policy, pacing, and business rules.
          Each stage trades recall against latency and compute.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Candidate Sources</h3>
        <p>
          Candidate generation should be multi-source. Common sources include approximate nearest-neighbor retrieval
          from user and item embeddings, item-to-item similarity from recent interactions, followed creators, regional
          trending items, new releases, editorial content, sponsored campaigns, and fallback popular items. Multi-source
          retrieval prevents a single model failure from emptying or narrowing the feed.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Feature Store and Fresh Signals</h3>
        <p>
          Offline features capture stable history: category affinities, creator affinity, item quality, historical
          engagement, age, price, inventory, and safety attributes. Online features capture the current moment:
          recently viewed items, dwell time in this session, search terms, device, region, time, and network context.
          Training-serving skew is a major risk, so online feature definitions should match training definitions as
          closely as possible.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Feed Stability</h3>
        <p>
          A feed that fully re-ranks on every refresh can feel random and can break analytics. Stable ordering is
          usually achieved with feed caches, request seeds, seen-item suppression, cursor tokens, and refresh windows.
          Stability does not mean staleness: significant actions can trigger partial re-ranking, while minor refreshes
          preserve most of the previous order.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/personalized-homepage-feed-system-architecture.svg"
          alt="Personalized homepage feed architecture showing candidate generation, pre-ranking, final ranking, feature store, model training, feed cache, diversity rules, and experimentation"
          caption="Architecture: a multi-stage ranking funnel combines retrieval, online features, final ranking, post-ranking constraints, feed caching, and experimentation."
        />
        <p>
          A typical request enters the edge or API gateway with user identity, device context, locale, session
          interaction summary, and experiment assignments. The feed service first checks whether a valid precomputed
          feed exists. If the cache is fresh and the request does not require a major personalization update, the
          service can serve the cached base feed with light post-processing for seen-item suppression and session-based
          boosting.
        </p>
        <p>
          On a cache miss or re-rank trigger, candidate generation fans out in parallel. ANN retrieval finds items close
          to the user embedding, item-to-item retrieval expands from recent interactions, trending retrieval pulls
          regional momentum, followed-creator retrieval adds subscribed content, and sponsored retrieval returns
          eligible campaigns. The merged set is deduplicated, safety-filtered, entitlement-filtered, and stripped of
          recently dismissed or exhausted items before pre-ranking.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/personalized-homepage-feed-system-workflow.svg"
          alt="Personalized homepage feed workflow showing request context, cache lookup, parallel candidate retrieval, pre-ranking, final ranking, diversity pass, response, impression logging, and feedback loop"
          caption="Serving flow: cache when possible, fan out retrieval on miss, rank in stages, apply constraints, log impressions, and feed the training loop."
        />
        <p>
          Pre-ranking uses cheaper features and a fast model to reduce candidate volume. Final ranking scores a smaller
          set with richer features, including real-time session signals. The post-ranking layer then applies maximum
          items per creator, category balance, freshness boosts, policy blocks, sponsored pacing, editorial rules, and
          exploration slots. The response includes item identifiers, ranking metadata, request identifiers, experiment
          identifiers, and impression tokens needed to attribute later clicks or skips correctly.
        </p>
        <p>
          Feedback flows are as important as serving flows. Impressions, clicks, dwell time, hides, saves, purchases,
          follows, and skips are logged with request and ranking context. Streaming jobs update counters and online
          features within minutes. Batch pipelines generate training examples, compute offline metrics, train candidate
          and ranker models, validate model quality, and gradually promote models through shadow, A/B, and production
          stages.
        </p>
        <p>
          The serving path needs a reliability fallback. If the online feature store is slow, the feed can use cached
          features. If candidate retrieval fails, it can blend followed content, regional trending, and editorial
          content. If the final ranker times out, pre-rank scores and post-ranking rules can produce a degraded but
          safe feed. The response should mark degraded serving for analytics so model teams do not train on unexplained
          fallback behavior as if it were normal ranking.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/personalized-homepage-feed-system-experiments.svg"
          alt="Personalized feed experimentation showing traffic split, feature flags, model candidates, metrics, holdout groups, guardrails, and promotion"
          caption="Experimentation: recommendation systems require online A/B tests with guardrails, holdouts, segment analysis, and rollback paths."
        />
        <p>
          Precomputed feeds are fast and cheap at request time, but they can be stale. On-demand ranking is fresh and
          responsive, but it is expensive and can miss latency targets during traffic spikes. A practical design uses a
          precomputed base feed plus lightweight online reordering for session intent, with event-driven regeneration
          after important actions such as follow, purchase, save, or repeated hides.
        </p>
        <p>
          Embedding retrieval has high recall for personalized candidates but can overfit to historical interests.
          Trending and editorial candidates improve freshness and breadth but may reduce individual relevance. Sponsored
          candidates create revenue opportunities but must respect pacing, labeling, frequency caps, and quality
          guardrails. The feed should maintain source attribution so post-ranking can balance these candidate families.
        </p>
        <p>
          More complex ranking models can improve relevance, but they increase inference cost, feature dependency
          complexity, observability burden, and rollback risk. A principal-level answer should mention model tiers:
          cheap retrieval models, CPU-friendly pre-rankers, expensive final rankers, shadow evaluation, model fallback,
          and graceful degradation when a model or feature store is unhealthy.
        </p>
        <p>
          Short-term engagement metrics are easy to optimize but can harm long-term trust. Long-term satisfaction,
          retention, diversity, content quality, and negative feedback should be guardrail or objective metrics. Holdout
          groups are useful because feed changes can have delayed effects that a short A/B test misses.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The most important decision is how to balance relevance, freshness, safety, diversity, monetization, and
          system cost. A pure engagement ranker can maximize short-term clicks while concentrating exposure, amplifying
          low-quality content, or starving new creators. A principal answer should describe objective functions and
          guardrails separately: relevance can be optimized, but policy, diversity, ad load, creator concentration, and
          user wellbeing may need hard constraints.
        </p>
        <p>
          Reliability also belongs in the trade-off discussion. Candidate generation should be multi-source because any
          single source can fail or narrow the experience. Ranking models need fallback versions, feature-store missing
          defaults, and safe caches. During a model outage, the homepage should degrade to followed content, regional
          trending, editorial picks, and the last known good feed rather than returning an empty page or unsafe content.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Design the feed as a deterministic pipeline for a given request context, seed, model version, and rule
          version. Determinism makes debugging possible when a user reports a bad recommendation or when an experiment
          regresses a segment. Store request identifiers, candidate sources, model scores, rule decisions, and final
          positions in observability logs with sampling controls.
        </p>
        <p>
          Treat candidate generation as a reliability problem. Run candidate sources in parallel with per-source
          timeouts and partial-failure handling. If ANN retrieval times out, the feed should degrade to item similarity,
          followed content, and trending rather than fail the homepage. If the policy service is unavailable, prefer a
          conservative safe fallback over serving unfiltered content.
        </p>
        <p>
          Keep feature definitions versioned and monitor training-serving skew. Online features should have freshness
          timestamps, default values, missingness indicators, and ownership. Missing features should degrade model
          quality gracefully rather than causing request failure.
        </p>
        <p>
          Build feed stability deliberately. Use cursor tokens for pagination, impression history to suppress already
          seen items, refresh windows to avoid unnecessary reshuffles, and explicit reasons when the UI needs
          explainability. For ads and sponsored placements, separate organic rank from insertion policy so relevance and
          monetization can be tuned independently.
        </p>
        <p>
          Make experimentation first-class. Every model, feature, rule, and UI presentation change should be assignable
          through a consistent experiment framework with guardrail metrics, segment analysis, automatic rollback
          thresholds, and long-term holdouts.
        </p>
        <p>
          Create a feed debug console for internal users. It should show candidate sources, removed candidates, model
          version, feature freshness, policy decisions, ad insertion decisions, diversity penalties, and final position.
          This is essential for executive escalations, creator complaints, safety reviews, and experiment regressions
          because "the model picked it" is not an acceptable principal-level explanation.
        </p>
        <p>
          Feed personalization needs governance around objective functions. Optimizing only click-through can increase low-quality engagement, reduce diversity, amplify stale content, or hurt long-term retention. A principal-level design should include ranking guardrails such as freshness, creator diversity, safety eligibility, exploration budget, user controls, and negative feedback loops. The architecture should make it possible to audit why a module or item appeared.
        </p>
        <p>
          The system should separate candidate generation, eligibility filtering, ranking, and presentation assembly. Candidate services may return trending, social, paid, editorial, or personalized items, but a central policy layer should enforce blocked creators, age restrictions, paid disclosure, inventory constraints, and regional rules before ranking output reaches the client. This keeps personalization flexible without letting every candidate source reimplement safety and compliance.
        </p>
        <p>
          Feed serving should include operational fallbacks. If the ranking service is unavailable, the homepage can fall back to cached personalized modules, regional trending content, editorial defaults, or recently viewed items depending on freshness and safety rules. The fallback should be visible in telemetry and bounded by policy so an outage does not silently serve stale, unsafe, or overly repetitive content for hours.
        </p>
        <p>
          Privacy controls should feed directly into ranking eligibility. A user who disables personalization, hides a topic, blocks a creator, or changes location permissions should see the effect quickly. Caches, precomputed candidates, and edge responses need invalidation or late filtering so privacy preferences are not treated as advisory hints.
        </p>
        <p>
          Feed metrics should be segmented by surface and cohort. A homepage module, notification-driven return, and search-entry feed can all have different intent. Aggregating them hides regressions and makes ranking experiments look better than they are for specific user journeys.
        </p>
        <p>
          Editorial and emergency controls should coexist with ranking. Product teams may need to pin safety messages, suppress harmful trends, or promote compliance notices without redeploying the ranking stack.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          A frequent pitfall is describing only the ML model. Interviewers expect the serving architecture: fan-out
          retrieval, feature freshness, cache strategy, latency budgets, fallback behavior, impression logging,
          experimentation, and operational metrics.
        </p>
        <p>
          Another pitfall is using a single candidate source. A pure collaborative-filtering feed can fail for new
          users, new items, underrepresented creators, or rapidly changing trends. Candidate diversity is an
          availability and quality mechanism, not merely a product preference.
        </p>
        <p>
          Ignoring seen-item and cursor semantics leads to duplicate recommendations across refreshes and pages. A
          principal-level design should explain how impression history, pagination tokens, feed snapshots, and TTLs
          interact.
        </p>
        <p>
          Missing negative feedback is also dangerous. Hides, skips, quick bounces, mutes, reports, and "not interested"
          actions should influence ranking quickly. Positive-only feedback loops create repetitive and sometimes unsafe
          feeds.
        </p>
        <p>
          Finally, ranking without guardrails can produce business or policy incidents. Sponsored content needs
          frequency caps and labeling, regulated categories need explainability and compliance review, and safety
          filters must run before content reaches the client.
        </p>
        <p>
          A deeper pitfall is training on biased or corrupted feedback. Bot traffic, accidental clicks, rage clicks,
          autoplay impressions, and badly measured dwell time can teach the ranker the wrong lesson. Ranking systems
          need event-quality checks, fraud filtering, position-bias handling, and holdouts so the model does not simply
          amplify measurement bugs.
        </p>
        <p>
          Teams often forget cold-start and recovery behavior. New users, returning users after months away, privacy-limited users, and users who reset preferences need different fallback strategies. The feed should degrade to explicit preferences, location or language, editorial defaults, or popularity signals while quickly learning from safe interactions.
        </p>
        <p>
          Another pitfall is making ranking changes impossible to debug. Support, trust and safety, and product teams need trace ids, feature snapshots, experiment assignment, candidate source, policy decisions, and ranking explanations. Without this evidence, every feed complaint becomes subjective and every model rollout becomes risky.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Streaming media homepages use feed ranking to balance resume-watching, new releases, related content,
          regional trends, household profiles, and editorial rows. Latency and stability matter because the homepage is
          often the product's main entry point.
        </p>
        <p>
          Commerce homepages personalize product recommendations using purchase history, browsing history, inventory,
          margin, price sensitivity, shipping constraints, and sponsored placements. The design must avoid recommending
          unavailable or already purchased items unless replenishment is likely.
        </p>
        <p>
          News and professional feeds need freshness, source diversity, explainability, and policy controls. They also
          need protections against filter bubbles and repetitive exposure to the same topic or publisher.
        </p>
        <p>
          Learning platforms and career platforms rank courses, jobs, mentors, or content based on long-term user goals.
          Their objective functions should weight completion, application, and user success rather than immediate
          clicks alone.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you meet a 200 millisecond P99 feed latency target?
        </h3>
        <p>
          I would avoid full ranking on every request. The common path serves a precomputed feed from a low-latency
          cache and applies lightweight session-based adjustments. On cache miss, candidate sources run in parallel
          with tight timeouts, pre-ranking reduces the set quickly, final ranking scores only the short list, and
          post-ranking is bounded by simple constraints. I would also define fallbacks for feature store, model, and
          retrieval failures.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you handle cold start for a new user?
        </h3>
        <p>
          Start with onboarding interests, regional trending, editorial picks, and diverse exploration. As the user
          interacts, blend item-to-item recommendations from the first few seed interactions. After enough signals,
          gradually activate personalized retrieval and ranking. The transition threshold should be experiment-driven,
          and the UI should avoid over-personalizing from one accidental click.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you prevent a repetitive or narrow feed?
        </h3>
        <p>
          Use diversity constraints in post-ranking: maximum items per creator, category balance, content-type
          distribution, and exploration slots. Ranking objectives should include long-term satisfaction and negative
          feedback, not only clicks. Source attribution helps balance embedding, trending, followed, editorial, and
          sponsored candidates.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you make the feed debuggable?
        </h3>
        <p>
          Log request context, experiment assignment, candidate source, model version, feature version, raw score,
          post-ranking rule decisions, final position, and impression token. The logs should let an engineer reconstruct
          why an item appeared and why higher-scoring items were removed or moved.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What happens if the ranking model or feature store is unavailable?
        </h3>
        <p>
          The system should degrade rather than fail the homepage. It can serve the last known feed snapshot, followed
          content, regional trending, and editorial fallbacks. Feature missingness should have safe defaults and be
          visible in metrics. Unsafe or unfiltered content should not be served just because a dependency failed.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Which metrics would you use to evaluate a feed change?
        </h3>
        <p>
          Use engagement metrics such as clicks, dwell, saves, purchases, and session depth, but pair them with
          guardrails: hides, reports, latency, diversity, creator concentration, return visits, retention, revenue
          quality, and user satisfaction. For major ranking changes, use long-term holdouts because some regressions
          appear days or weeks later.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://netflixtechblog.com/recommending-for-the-world-8da8cbcf051b" target="_blank" rel="noreferrer">
              Netflix Technology Blog: Recommending for the World
            </a>
            , large-scale recommendation and personalization discussion.
          </li>
          <li>
            <a href="https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/" target="_blank" rel="noreferrer">
              Google Research: Deep Neural Networks for YouTube Recommendations
            </a>
            , candidate generation and ranking architecture.
          </li>
          <li>
            <a href="https://engineering.linkedin.com/blog/2020/understanding-feed-dwell-time" target="_blank" rel="noreferrer">
              LinkedIn Engineering: Understanding Feed Dwell Time
            </a>
            , feed quality signals beyond clicks.
          </li>
          <li>
            <a href="https://martinfowler.com/articles/feature-toggles.html" target="_blank" rel="noreferrer">
              Martin Fowler: Feature Toggles
            </a>
            , experimentation and rollout control patterns.
          </li>
          <li>
            <a href="https://research.facebook.com/publications/dlrm-an-advanced-open-source-deep-learning-recommendation-model/" target="_blank" rel="noreferrer">
              Meta Research: DLRM Recommendation Model
            </a>
            , large-scale recommendation model concepts.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
