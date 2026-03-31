"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-related-content",
  title: "Related Content",
  description:
    "Comprehensive guide to related content recommendations covering similarity algorithms, co-engagement, placement strategies, pre-computation, and real-time updates for increasing engagement.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "related-content",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "related",
    "recommendations",
    "frontend",
    "similarity",
  ],
  relatedTopics: ["recommendation-carousel", "discovery", "engagement", "collaborative-filtering"],
};

export default function RelatedContentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Related Content</strong> (also called "related articles", "you may also like",
          or "similar content") displays content similar to what the user is currently viewing.
          It is one of the highest-ROI features for increasing engagement and session duration—
          users who click related content have 40% longer sessions and 2x return rate. Related
          content appears on content pages (article end, video watch page, product detail) and
          drives 20-30% of total pageviews on content platforms.
        </p>
        <p>
          Related content differs from general recommendations: it is context-aware (based on
          current content), immediate (user is engaged now), and specific (similar to current
          item). YouTube's "Up Next" sidebar drives billions of views, Amazon's "Related
          Products" drives 15% of revenue, and news sites see 25% of clicks from related
          articles.
        </p>
        <p>
          For staff-level engineers, related content involves similarity computation (content-based,
          collaborative filtering, hybrid), pre-computation strategies (offline batch jobs),
          real-time updates (when content changes), placement optimization (sidebar vs below
          content), and performance (sub-100ms latency for related content API).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Similarity Signals</h3>
        <p>
          How to determine content is "related":
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Tags/Categories:</strong> Same tags, categories, topics. Simple but
            effective. "Machine Learning" article related to other "Machine Learning" tagged
            articles. Weight by tag specificity (rare tags more predictive).
          </li>
          <li>
            <strong>Author/Creator:</strong> Same author, channel, or creator. Users who like
            one video from a creator often watch more. Strong signal for serialized content
            (tutorial series, podcast episodes).
          </li>
          <li>
            <strong>Co-engagement:</strong> Users who viewed X also viewed Y. Collaborative
            filtering signal. Computed from session logs (users who watched both within same
            session). Strongest signal for relevance.
          </li>
          <li>
            <strong>Content Similarity:</strong> Text similarity (TF-IDF cosine similarity),
            embedding distance (BERT embeddings, sentence transformers), visual similarity
            (for images/videos). Captures semantic similarity beyond tags.
          </li>
          <li>
            <strong>Temporal:</strong> Published around same time, same event/season. Good
            for news (related articles about same event), sports (same game/match).
          </li>
          <li>
            <strong>Metadata:</strong> Same product category, price range, brand (e-commerce).
            Same video length, format, language (video platforms).
          </li>
        </ul>

        <h3 className="mt-6">Similarity Computation Approaches</h3>
        <p>
          Different approaches for computing related content:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Content-based:</strong> Compare item features (tags, embeddings, metadata).
            Pros: Works for new items (no engagement needed), interpretable. Cons: Limited to
            explicit features, may miss latent relationships.
          </li>
          <li>
            <strong>Collaborative Filtering:</strong> Co-engagement patterns (users who liked
            X also liked Y). Pros: Captures latent relationships, high precision. Cons: Cold
            start for new items, requires engagement data.
          </li>
          <li>
            <strong>Hybrid:</strong> Combine content-based and collaborative filtering. Weight
            by confidence (use collaborative if enough data, fallback to content-based).
            Production standard for related content.
          </li>
        </ul>

        <h3 className="mt-6">Pre-computation vs Real-time</h3>
        <p>
          When to compute related content:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Pre-computed (Offline):</strong> Compute related content for all items
            in batch job (daily/hourly). Store in cache/database. Pros: Fast retrieval
            (&lt;10ms), consistent, can use expensive algorithms. Cons: Stale (changes
            reflected in hours), storage cost (N × related_count entries).
          </li>
          <li>
            <strong>Real-time:</strong> Compute on-demand when user views content. Pros:
            Fresh (reflects latest engagement), no storage cost. Cons: Latency (100-500ms),
            limited algorithm complexity.
          </li>
          <li>
            <strong>Hybrid:</strong> Pre-compute base related content, update incrementally
            for high-engagement items. Best of both worlds. Production standard.
          </li>
        </ul>

        <h3 className="mt-6">Placement Strategies</h3>
        <p>
          Where to show related content:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Sidebar (Desktop):</strong> Right sidebar, always visible while reading.
            High visibility, doesn't interrupt reading. Best for: News sites, blogs,
            documentation.
          </li>
          <li>
            <strong>Below Content:</strong> After article/video ends. User finished consuming,
            looking for next item. Best for: Video platforms (YouTube), long-form articles.
          </li>
          <li>
            <strong>In-feed:</strong> Interspersed in feed every N items. Proactive discovery.
            Best for: Social platforms, content discovery.
          </li>
          <li>
            <strong>End of Session:</strong> When user about to leave (exit intent). Last
            chance to retain. Best for: E-commerce, subscription sites.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production related content system involves multiple components for similarity
          computation, storage, and retrieval.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/related-content/related-content-architecture.svg"
          alt="Related Content Architecture"
          caption="Figure 1: Related Content Architecture — Offline pre-computation, cache layer, and real-time API for related content retrieval"
          width={1000}
          height={500}
        />

        <h3>Similarity Computation Pipeline</h3>
        <ul className="space-y-3">
          <li>
            <strong>Feature Extraction:</strong> Extract features from all items (tags,
            embeddings, metadata, author). Store in feature store.
          </li>
          <li>
            <strong>Similarity Matrix:</strong> Compute pairwise similarity for all item
            pairs. Use efficient algorithms (approximate nearest neighbors for embeddings).
            Result: N × N similarity matrix (sparse).
          </li>
          <li>
            <strong>Top-K Selection:</strong> For each item, select top-K most similar
            (K = 20-50). Store in related content cache.
          </li>
          <li>
            <strong>Blending:</strong> Combine multiple signals (content similarity,
            co-engagement, author). Weight by signal strength, diversity.
          </li>
          <li>
            <strong>Filtering:</strong> Remove already viewed, low quality, inappropriate
            content. Apply business rules.
          </li>
        </ul>

        <h3 className="mt-6">Co-engagement Computation</h3>
        <p>
          Computing "users who viewed X also viewed Y":
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Step</th>
                <th className="text-left p-2 font-semibold">Description</th>
                <th className="text-left p-2 font-semibold">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Session Logs</td>
                <td className="p-2">Aggregate user sessions</td>
                <td className="p-2">User viewed [A, B, C] in session</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Pair Counting</td>
                <td className="p-2">Count co-occurrences</td>
                <td className="p-2">A-B: 1000, A-C: 500, B-C: 300</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Normalization</td>
                <td className="p-2">Normalize by item popularity</td>
                <td className="p-2">Jaccard similarity, PMI</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Top-K Selection</td>
                <td className="p-2">Select top related for each item</td>
                <td className="p-2">For A: [B, C, D]</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/related-content/similarity-computation.svg"
          alt="Similarity Computation"
          caption="Figure 2: Similarity Computation — Content-based, collaborative filtering, and hybrid approaches combined for related content"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Cache Strategy</h3>
        <ul className="space-y-3">
          <li>
            <strong>Related Content Cache:</strong> Store top-K related items for each
            content ID. Key: content_id, Value: [related_1, related_2, ...]. TTL: 1 hour
            (balance freshness vs cache hit rate).
          </li>
          <li>
            <strong>Invalidation:</strong> Invalidate cache when content updated, new high-
            engagement content published. Use event-driven invalidation (Kafka events).
          </li>
          <li>
            <strong>Multi-level Caching:</strong> L1: In-memory cache (hot items, &lt;1ms),
            L2: Redis cluster (all items, &lt;10ms), L3: Database (fallback, &lt;100ms).
          </li>
          <li>
            <strong>Personalization Cache:</strong> Optionally cache personalized related
            content (based on user segment). Key: content_id + segment_id.
          </li>
        </ul>

        <h3 className="mt-6">Real-time Updates</h3>
        <p>
          Keeping related content fresh:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Incremental Updates:</strong> When new content published, compute
            related content for it immediately (don't wait for batch). Add to cache.
          </li>
          <li>
            <strong>Trending Boost:</strong> Boost trending/viral content in related
            lists. Update scores hourly based on engagement velocity.
          </li>
          <li>
            <strong>Decay:</strong> Decay old content scores over time. Fresh content
            gets visibility boost.
          </li>
          <li>
            <strong>Feedback Loop:</strong> Track clicks on related content. Use to
            re-rank (items with high CTR move up).
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Related content design involves balancing relevance, freshness, diversity, and
          performance.
        </p>

        <h3>Similarity Signal Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Signal</th>
                <th className="text-left p-2 font-semibold">Precision</th>
                <th className="text-left p-2 font-semibold">Coverage</th>
                <th className="text-left p-2 font-semibold">Cold Start</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Tags/Categories</td>
                <td className="p-2">Medium</td>
                <td className="p-2">High (100%)</td>
                <td className="p-2">Excellent</td>
                <td className="p-2">All content types</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Co-engagement</td>
                <td className="p-2">High</td>
                <td className="p-2">Medium (needs data)</td>
                <td className="p-2">Poor</td>
                <td className="p-2">Popular content</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Embeddings</td>
                <td className="p-2">High</td>
                <td className="p-2">High</td>
                <td className="p-2">Good</td>
                <td className="p-2">Text/video content</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Author</td>
                <td className="p-2">Medium-High</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Excellent</td>
                <td className="p-2">Serialized content</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/related-content/placement-strategies.svg"
          alt="Placement Strategies"
          caption="Figure 3: Placement Strategies — Sidebar, below content, in-feed, and end-of-session placement with engagement comparison"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Pre-computation vs Real-time</h3>
        <p>
          <strong>Pre-computed:</strong> Batch compute all related content offline. Store
          in cache. Pros: Fast retrieval, can use complex algorithms. Cons: Stale (hours
          delay), storage cost. Best for: Large catalogs, stable content.
        </p>
        <p>
          <strong>Real-time:</strong> Compute on-demand. Pros: Fresh, no storage. Cons:
          Latency, limited algorithm complexity. Best for: Breaking news, trending content.
        </p>
        <p>
          <strong>Hybrid (Recommended):</strong> Pre-compute base, update incrementally
          for high-engagement items. 90% cache hit rate, &lt;1 hour freshness for popular
          content.
        </p>

        <h3 className="mt-6">Number of Related Items</h3>
        <p>
          <strong>Few (3-5):</strong> Curated, high-confidence recommendations. Low
          cognitive load. Risk: Not enough options, user leaves.
        </p>
        <p>
          <strong>Medium (6-10):</strong> Balanced choice. Most production systems use
          this. Good engagement without overwhelm.
        </p>
        <p>
          <strong>Many (15-20):</strong> Maximum choice. Risk: Analysis paralysis, lower
          CTR. Only for specific use cases (e-commerce product comparison).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Hybrid Approach:</strong> Combine content-based and collaborative
            filtering. Weight by confidence (collaborative if &gt;100 engagements, else
            content-based).
          </li>
          <li>
            <strong>Pre-compute for Performance:</strong> Batch compute related content
            hourly/daily. Cache results. Target &lt;50ms API latency.
          </li>
          <li>
            <strong>Diversity in Results:</strong> Don't show all from same author/topic.
            Limit 30% from single source. Improves discovery.
          </li>
          <li>
            <strong>Freshness Boost:</strong> Boost recent content (published &lt;7 days).
            Users prefer fresh related content.
          </li>
          <li>
            <strong>Track Clicks:</strong> Log which related items clicked. Use to re-rank
            (high CTR moves up). A/B test ranking algorithms.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Horizontal scroll for mobile, larger
            thumbnails. 70%+ traffic is mobile.
          </li>
          <li>
            <strong>Lazy Load:</strong> Load related content after main content. Don't
            block primary content render.
          </li>
          <li>
            <strong>Handle Edge Cases:</strong> New content (no related yet): show trending.
            Niche content: show broader category matches.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Stale Related Content:</strong> Related content not updated for months.
            Solution: Incremental updates, freshness boost, decay old content.
          </li>
          <li>
            <strong>No Diversity:</strong> All related from same author. Solution: Enforce
            diversity constraints (max 30% from one source).
          </li>
          <li>
            <strong>Cold Start Ignored:</strong> New content has no related items. Solution:
            Fallback to content-based similarity, show trending as fallback.
          </li>
          <li>
            <strong>Slow API:</strong> Related content API takes &gt;500ms. Solution:
            Pre-compute, cache aggressively, use CDN.
          </li>
          <li>
            <strong>Wrong Placement:</strong> Related content interrupts reading. Solution:
            Sidebar for desktop, below content for mobile, never mid-content.
          </li>
          <li>
            <strong>Ignoring Quality:</strong> Low-quality content in related. Solution:
            Filter by quality score, engagement threshold.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>YouTube Up Next</h3>
        <p>
          YouTube's sidebar shows related videos. Uses hybrid approach: co-watch patterns
          (users who watched X also watched Y), video embeddings, channel affinity. Updates
          in real-time based on trending. Drives 70% of watch time.
        </p>
        <p>
          <strong>Key Innovation:</strong> Session-based ranking—orders by likelihood to
          continue session, not just relevance.
        </p>

        <h3 className="mt-6">Amazon Related Products</h3>
        <p>
          Amazon shows "Related to items you viewed", "Frequently bought together". Uses
          co-purchase data, product similarity, price range. Drives 15% of revenue.
        </p>
        <p>
          <strong>Key Innovation:</strong> Real-time updates—related products update as
          you browse, based on current session.
        </p>

        <h3 className="mt-6">Netflix "Because You Watched"</h3>
        <p>
          Netflix shows related titles based on viewing history. Uses collaborative
          filtering, genre similarity, actor/director matching. Personalized per user.
        </p>
        <p>
          <strong>Key Innovation:</strong> Artwork personalization—different thumbnails
          for same title based on predicted appeal.
        </p>

        <h3 className="mt-6">Medium Related Stories</h3>
        <p>
          Medium shows related stories at article end. Uses text similarity (embeddings),
          author matching, tag overlap. Updates as new stories published.
        </p>
        <p>
          <strong>Key Innovation:</strong> Reading time match—suggests articles with
          similar reading time (respects user's time commitment).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you compute related content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Hybrid approach: (1) Content-based similarity using tags,
              embeddings, metadata. (2) Collaborative filtering from co-engagement logs
              (users who viewed X also viewed Y). (3) Combine with weighted average.
              Pre-compute offline in batch jobs (hourly/daily). Cache results in Redis.
              Update incrementally for high-engagement content. Target &lt;50ms API latency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How many related items to show?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> 6-10 items is optimal for most use cases. Enough for
              choice without overwhelming. Test different counts via A/B testing. Mobile:
              Show 5-6 (horizontal scroll). Desktop: Show 8-10 (sidebar or grid). E-commerce
              may show more (15-20) for product comparison.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cold start for new content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> New content has no engagement data. Fallback to content-based
              similarity: tags, embeddings, author, category. Show trending content as
              secondary fallback. Boost new content in related lists of similar items to
              gather initial engagement. Track "time to first engagement" metric.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure diversity in related content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Enforce diversity constraints in re-ranking: (1) Limit
              consecutive items from same author/source (max 2). (2) Topic diversity—no
              more than 40% from one category. (3) MMR (Maximal Marginal Relevance)—balance
              relevance with diversity. (4) Exploration—include 1-2 items outside typical
              interests.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure related content success?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Primary metrics: CTR on related items, session duration
              (users who click related stay longer), pages per session. Secondary: Return
              rate, engagement rate (likes, comments). Guardrail: Bounce rate (shouldn't
              increase). A/B test ranking algorithms with these metrics.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you update related content in real-time?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Hybrid approach: Pre-compute base related content hourly.
              For real-time updates: (1) Track engagement events (views, clicks) in Kafka.
              (2) Stream processing updates co-engagement counts. (3) Incrementally update
              related lists for high-engagement items. (4) Invalidate cache, recompute.
              Target &lt;15 minute freshness for trending content.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.researchgate.net/publication/261169345_Efficient_evaluation_of_large-scale_recommender_systems"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Research: Large-scale Recommender Systems Evaluation
            </a>
          </li>
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
              href="https://www.amazon.science/recommendations"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon Science — Recommendations Research
            </a>
          </li>
          <li>
            <a
              href="https://medium.engineering/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Medium Engineering — Related Content Articles
            </a>
          </li>
          <li>
            <a
              href="https://youtube-engineering.googleblog.com/search/label/recommendations"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube Engineering — Recommendations Articles
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
