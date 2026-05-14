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
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "personalization", "recommendation", "ranking", "cold-start", "ML", "feed"],
  relatedTopics: ["frontend-for-a-social-media-news-feed", "activity-feed-system"],
};

export default function PersonalizedHomepageFeedSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A personalized homepage feed is the primary value delivery mechanism of discovery-oriented products: Netflix's home screen, YouTube's homepage, Amazon's product recommendations, LinkedIn's main feed. The system must select, from a corpus of millions of items, the small set (20–50) that a specific user is most likely to engage with right now, based on their historical behavior, current context (time of day, device, session intent), and the collective behavior of similar users. This is a machine learning problem wrapped in an engineering problem: the ML model may be excellent, but if the serving infrastructure cannot deliver personalized results within 200ms, the user experience fails.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The complexity compounds at scale. Netflix serves 250 million subscribers; computing a full ranking of 100,000 items for each subscriber on every homepage load is computationally impossible. The solution is a funnel: candidate generation narrows the corpus from millions to thousands, a fast pre-ranking narrows to hundreds, and a heavyweight ranking model selects the final 20–50. Each stage trades recall (showing everything relevant) against computational cost (showing only what can be ranked within the latency budget).</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> Item corpus: 500,000 items (articles, videos, products). User base: 50 million active users. Target P99 homepage load latency: 500ms end-to-end. The recommendation model is a two-tower neural network trained offline, with a feature store providing real-time features for online inference. Cold start for new users (fewer than 10 interactions) uses popularity-based and context-based recommendations, transitioning to personalized recommendations as interaction data accumulates.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Personalized feed generation:</strong> Return a ranked list of 20–50 items for each user's homepage, ordered by predicted engagement probability. Results differ per user based on their interaction history and preferences.</li>
          <li><strong>Real-time signals:</strong> Recently viewed items, items added to cart/watchlist, in-session behavior (what the user viewed in the last 5 minutes) influence feed ranking in real-time.</li>
          <li><strong>Diversity constraints:</strong> The feed must not be overly repetitive. Maximum 3 items from the same creator, maximum 5 from the same category. Diversity is enforced post-ranking (during final selection).</li>
          <li><strong>Cold start:</strong> New users with no history see a feed based on: (a) trending content for their geographic region, (b) content popular among users who registered recently with similar demographic signals, (c) content the user explicitly indicated interest in during onboarding.</li>
          <li><strong>Freshness:</strong> Trending and recently published content is boosted relative to popular-but-old content. A decay function reduces the score of older items over time.</li>
          <li><strong>Feedback loop:</strong> User interactions (clicks, views, likes, saves, skips) are recorded and fed back into the model training pipeline, improving future recommendations.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Latency:</strong> P99 feed generation under 200ms (not including network latency or client-side rendering).</li>
          <li><strong>Throughput:</strong> Handle 100,000 homepage requests per second at peak.</li>
          <li><strong>Consistency:</strong> A user refreshing the homepage within 5 minutes should see mostly the same results (with possibly a few new items at the top). Excessive re-ranking on every refresh creates a disorienting "Netflix shuffle" experience.</li>
          <li><strong>Explainability:</strong> For certain content types (news, financial recommendations), the UI must show a reason for the recommendation: "Because you read about X" or "Trending in your region."</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The recommendation pipeline is a three-stage funnel. Stage 1 (Candidate Generation): retrieve candidates from multiple sources—user-based collaborative filtering (items liked by similar users), item-based collaborative filtering (items similar to items the user liked), trending items (top N by engagement in the past 24 hours by region), new releases, and items from followed creators. This stage produces a candidate set of 2,000–5,000 items. Stage 2 (Pre-ranking): a lightweight model (logistic regression or a small neural network, running on CPU) scores each candidate quickly (under 1ms per item), narrowing the set to 200–500 items. Stage 3 (Ranking): a heavyweight model (a two-tower neural network or gradient-boosted trees, possibly GPU-accelerated) scores the top candidates with full features, producing the final ranked list. Diversity constraints and business rules are applied in a post-ranking filtering pass.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/personalized-homepage-feed-system-architecture.svg"
          alt="Personalized feed architecture showing three-stage ranking funnel: candidate generation (collaborative filtering + trending + new releases + followed creators → 2000-5000 candidates), pre-ranking (lightweight model → 200-500), full ranking (two-tower NN with real-time feature store → top 50), diversity enforcement, and post-ranking business rules. Feature store feeding real-time user features, offline model training pipeline, and A/B experiment layer."
          caption="Personalized feed: three-stage ranking funnel, real-time feature store, offline model training, A/B experimentation, and diversity enforcement"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Candidate Generation</h3>
        <p>Candidate generation retrieves a diverse set of potentially relevant items quickly. The primary sources are: (1) ANN (Approximate Nearest Neighbor) lookup for user-item collaborative filtering—the user's embedding vector is looked up in the user embedding store, and items with the nearest embedding vectors in the item embedding space are returned (using Faiss or similar ANN index, returning 500–1000 items in under 20ms); (2) item-to-item similarity—the user's recently interacted items are used as seed items, and similar items (from a pre-computed item similarity graph) are fetched; (3) trending items—a Redis sorted set of items ranked by engagement in the past 24 hours (updated every 5 minutes), returning the top 200 by region; (4) new releases—items published in the past 48 hours from the user's followed creators; (5) campaign items—items the business wants to promote (new releases, sponsored content), subject to separate budget and pacing constraints.</p>
        <HighlightBlock as="p" tier="important">The candidate sets from all sources are merged and deduplicated by itemId. Items the user has already seen and interacted with (viewed in the past 30 days, explicitly dismissed) are filtered out. The result is the full candidate set (2,000–5,000 items) passed to the pre-ranking stage. This entire candidate generation step must complete in under 50ms to stay within the overall latency budget, requiring all source lookups to run in parallel (not sequentially).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Feature Store and Real-Time Features</h3>
        <HighlightBlock as="p" tier="important">The ranking model uses features from three domains. User features: the user's historical engagement rates by category, creator, time-of-day pattern, session length, and device. These are pre-computed daily and stored in a feature store (Redis for online serving, S3 for offline training). Item features: the item's historical engagement rates, age, quality signals (edit count for articles, production quality score for videos), creator follower count, and category. These are pre-computed and updated hourly. Context features: current time of day, day of week, device type, geographic region, and in-session features (items viewed in the current session). In-session features are not pre-computed—they are derived from the current request's session data (passed by the client) and represent the most valuable real-time signal.</HighlightBlock>
        <HighlightBlock as="p" tier="important">In-session features are the key to real-time personalization. If a user has viewed 5 articles about climate change in the current session, the next recommendation should reflect this current interest, even if their long-term history shows broad interests. The client passes the current session's interaction list (last 10 itemIds viewed) as part of the feed request. The ranking service looks up the categories and tags of these items, computes session-level interest vectors, and passes them to the model as real-time features. This session context lookup must complete in under 10ms; it queries a local cache (warmed by the item metadata service) rather than a database.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Two-Tower Model Architecture</h3>
        <HighlightBlock as="p" tier="important">The two-tower architecture is the standard approach for large-scale recommendation ranking. Two separate neural networks (towers) encode the user (left tower) and item (right tower) into a shared embedding space. The predicted engagement probability is the dot product (or cosine similarity) of the user and item embeddings. The key advantage: item embeddings can be pre-computed offline and stored in the item embedding store; at serving time, only the user embedding must be computed (a fast forward pass through the user tower with the user's current features). Item embedding computation is not on the critical path.</HighlightBlock>
        <p>The model is trained on implicit feedback (clicks, views, time spent) rather than explicit ratings (stars, thumbs). Implicit feedback is higher volume (every page view generates feedback) but noisier (a click is not always a positive signal—the user may have clicked and immediately bounced). Negative sampling (randomly sampled items that were shown to the user but not clicked) is used to train the "negative" examples. The training pipeline runs daily (or continuously via online learning for high-traffic platforms), using the previous day's interaction logs. Model performance is evaluated offline (AUC, NDCG) and online (A/B test comparing click-through rate and session engagement between the current model and the new model).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cold Start Handling</h3>
        <HighlightBlock as="p" tier="important">New users have no interaction history, so the collaborative filtering and user embedding approaches produce no signal. The cold start strategy uses four sources ordered by richness: (1) onboarding signals—topics and creators the user selected during onboarding; (2) demographic signals—location (inferred from IP), device type, and registration time of day can predict broad content preferences; (3) regional trending—items trending in the user's region in the past 24 hours are universally relevant regardless of individual preference; (4) "explore" diversity—deliberately diversify the feed for new users across categories, exposing them to the product's breadth. The cold start feed is computed by the popularity-based candidate generator (not the ANN index, which has no user embedding to query), served from a regional cache (the trending feed is the same for all cold-start users in a region, so it is pre-computed and cached).</HighlightBlock>
        <p>The transition from cold start to personalized recommendations is gradual. After 5 interactions, the system begins mixing personalized candidates (from item-to-item similarity using the 5 seed items) with trending candidates. After 20 interactions, the full personalized pipeline activates. The transition threshold and mixing ratio are configurable (via feature flags) and A/B testable—the optimal transition point varies by product type and is typically determined empirically.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pre-Computed Feed Caching</h3>
        <HighlightBlock as="p" tier="important">Computing a fresh personalized feed for every homepage request at 100,000 requests per second is computationally impractical (even if each individual computation is fast, the aggregate GPU load would be enormous). The solution: pre-compute the top-50 feed for every active user once every 5–30 minutes and cache the result. When the user requests the homepage, the cached feed is served immediately. This reduces latency to a single Redis lookup (&lt;5ms) and eliminates per-request model inference entirely for the common case.</HighlightBlock>
        <p>Pre-computation is triggered by: a scheduled job (every 30 minutes, re-rank the feed for all users active in the past 7 days), an event-driven trigger (when the user makes a significant interaction—adds an item to favorites, follows a new creator—their feed is re-ranked immediately to reflect the new signal), and a TTL expiry (if the pre-computed feed is more than 30 minutes old when the user requests it, a real-time computation is triggered and the result is cached before returning). The pre-computation job is a batch process running in parallel for all active users; it distributes work across a cluster of inference servers and writes results to Redis with a 30-minute TTL.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Diversity Enforcement and Business Rules</h3>
        <p>Raw ranking output often lacks diversity: the model correctly identifies that a user loves a specific creator and ranks all that creator's content at the top, but seeing 20 items from one creator is a poor feed experience. Diversity is enforced via a post-ranking filter using a Maximum Marginal Relevance (MMR) algorithm: items are selected one by one from the ranked list, penalizing items that are too similar to already-selected items. The similarity penalty is computed based on category (same category items are penalized), creator (same creator items are penalized), and content type (same format penalized). The penalty weight is tunable; a user who has shown very narrow interests may receive less diversity penalty than a user with broad interests.</p>
        <HighlightBlock as="p" tier="important">Business rules are applied as hard constraints after diversity enforcement: sponsored items are inserted at specific positions (position 3, position 7, position 14) with frequency capping (a user never sees the same sponsored item twice in 24 hours); new releases from the user's followed creators are boosted to the top regardless of model score (to ensure creator content reaches followers); items flagged as "editorial picks" are inserted at position 1; and items from content types the user has explicitly muted are filtered out. These business rules are configured in a rules engine rather than hardcoded, allowing the product team to adjust positioning and insertion rules without engineering changes.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/personalized-homepage-feed-system-experiments.svg"
          alt="Personalized feed A/B experimentation showing traffic splitting by user cohort, metric collection (CTR, engagement rate, session length, return visits), experiment configuration via feature flags, holdout groups for long-term retention measurement, and model training → evaluation → production promotion pipeline"
          caption="Feed experimentation: cohort-based A/B splitting, engagement metric collection, holdout groups for retention measurement, and model evaluation pipeline"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Engagement optimization versus user wellbeing: maximizing click-through rate (CTR) and session duration can create filter bubbles (the model learns to show only what the user already likes, narrowing their exposure) and addictive patterns (sensationalist content gets high engagement but leaves users feeling worse after consumption). Netflix, Spotify, and YouTube have all faced criticism for engagement-optimized feeds at the expense of content diversity and user wellbeing. The engineering response: diversity enforcement (described above), "explore" content that deliberately shows users items outside their apparent interests, and long-term satisfaction metrics (return visit rate, subscription retention) weighted alongside short-term engagement in the model's objective function. The objective function is a business decision, not a purely technical one.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Real-time versus batch model training: batch training (once daily) produces a model that may be 24 hours stale with respect to trending topics and rapidly changing user interests. Real-time training (continuously training on the latest interactions) keeps the model current but requires streaming training infrastructure (Flink, Kafka Streams) and makes model validation harder (harder to detect training instability in a continuously changing model). The pragmatic approach for most products: batch training for the primary model (stable, well-validated) with real-time feature updates (the feature store updates in near-real-time, so even an older model benefits from fresh features) and a fast-path for trending content that bypasses the model entirely (trending items are surfaced via the Redis sorted set regardless of the model's predictions).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Pre-computed cache versus on-demand ranking: pre-computing feeds eliminates per-request model latency (the dominant cost for complex ranking models) but means the feed is always slightly stale. An event-driven re-ranking trigger (re-rank immediately on significant user interaction) partially addresses staleness for the most important signals, but in-session real-time behavior cannot be reflected in a pre-computed feed. The hybrid approach (pre-computed base feed + real-time in-session boost applied at serve time) combines the efficiency of pre-computation with the responsiveness of real-time features: the pre-computed feed's order is modified at serve time based on the current session's signals, without a full re-ranking.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A personalized homepage feed system is a three-stage ranking funnel: candidate generation (ANN lookup, item similarity, trending, new releases → 2,000–5,000 candidates), pre-ranking (lightweight model → 200–500 candidates), and full ranking (two-tower neural network with real-time features → top 50). The feature store provides pre-computed user and item features; in-session features (last 10 viewed items) provide real-time personalization signal without a database query. Feeds are pre-computed every 30 minutes and cached in Redis; event-driven triggers re-rank immediately on significant user actions. Cold start uses onboarding signals, regional trending, and demographic inference, transitioning to personalized recommendations after 20 interactions. Diversity enforcement via MMR selects a diverse subset of the ranked list, with business rules inserting sponsored, editorial, and creator content at configured positions. A/B experimentation evaluates model and UX changes via CTR, session engagement, and long-term return visit rate. The defining architectural challenge is achieving sub-200ms latency for a computationally expensive personalization pipeline at 100,000 requests per second—pre-computation and multi-stage candidate filtering are the two techniques that make this feasible.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
