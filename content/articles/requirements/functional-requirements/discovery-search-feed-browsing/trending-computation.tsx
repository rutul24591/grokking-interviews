"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-trending-computation",
  title: "Trending Computation",
  description:
    "Comprehensive guide to trending computation covering velocity calculation, time windows, stream processing, geographic trends, and manipulation prevention for real-time discovery.",
  category: "functional-requirements",
  subcategory: "discovery-search-feed-browsing",
  slug: "trending-computation",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "trending",
    "real-time",
    "backend",
    "stream-processing",
  ],
  relatedTopics: ["feed-generation", "stream-processing", "analytics", "real-time-systems"],
};

export default function TrendingComputationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Trending Computation</strong> identifies content gaining rapid engagement
          right now, enabling real-time discovery of what's popular. Unlike "popular"
          (all-time most engaged), trending captures momentum—content that is suddenly
          resonating with users. Twitter Trends, Reddit Rising, YouTube Trending, and
          TikTok For You all rely on trending computation to surface breaking news, viral
          content, and emerging topics.
        </p>
        <p>
          Trending is fundamentally about velocity, not just volume. A post with 1000
          engagements in 1 hour is more "trending" than a post with 10000 engagements
          over 1 month. The challenge is computing velocity in real-time across millions
          of content items, with proper time decay (old trends fade), geographic
          segmentation (trends vary by location), and manipulation prevention (bot
          detection, anti-gaming).
        </p>
        <p>
          For staff-level engineers, trending computation involves stream processing
          (Flink, Spark Streaming, Kafka Streams), sliding window aggregations,
          time-decay scoring algorithms, distributed computing for scale, and real-time
          cache updates. Understanding trade-offs between freshness (update frequency)
          and stability (avoiding volatile trends) is critical.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Trending Score Formula</h3>
        <p>
          The core of trending computation is the scoring formula. Common approaches:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Reddit Hot Formula:</strong> (log₁₀ volume) + (time_since_epoch /
            decay_factor). Combines engagement magnitude with recency. Higher log base
            prevents runaway trends.
          </li>
          <li>
            <strong>Velocity-based:</strong> engagements_per_hour × log(total_volume) /
            (time_decay + 1). Captures acceleration, not just absolute numbers.
          </li>
          <li>
            <strong>Twitter Approach:</strong> Velocity × novelty × diversity. Boosts
            sudden spikes, penalizes expected trends, ensures topic diversity.
          </li>
          <li>
            <strong>Hacker News:</strong> (points - 1) / (time + 2)^gravity. Gravity
            parameter controls decay rate (default 1.8). Higher gravity = faster decay.
          </li>
        </ul>

        <h3 className="mt-6">Time Windows</h3>
        <p>
          Trending is computed over specific time windows:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Short Window (1-6 hours):</strong> Captures breaking news, viral
            moments. High volatility, very fresh. Used for "Rising" or "Breaking" sections.
          </li>
          <li>
            <strong>Medium Window (6-24 hours):</strong> Balanced freshness and stability.
            Most common for "Trending" sections. Captures daily trends.
          </li>
          <li>
            <strong>Long Window (1-7 days):</strong> More stable, less volatile. Used for
            "This Week" trending. Captures sustained interest, not just spikes.
          </li>
          <li>
            <strong>Multiple Windows:</strong> Production systems compute trending for
            multiple windows simultaneously. Show different tabs: "Now", "Today", "This
            Week".
          </li>
        </ul>

        <h3 className="mt-6">Time Decay</h3>
        <p>
          Older content should have lower trending scores. Decay functions:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Linear Decay:</strong> score = base_score × (1 - age/half_life).
            Simple but harsh cutoff at half_life.
          </li>
          <li>
            <strong>Exponential Decay:</strong> score = base_score × e^(-λ×age). Smooth
            decay, never reaches zero. λ controls decay rate.
          </li>
          <li>
            <strong>Step Decay:</strong> Different decay rates for different age ranges.
            Fast decay for first hour, slower after. Matches user attention patterns.
          </li>
          <li>
            <strong>Half-life:</strong> Time for score to halve. Twitter: ~30 minutes
            for tweets. Reddit: ~6 hours for posts. YouTube: ~24 hours for videos.
          </li>
        </ul>

        <h3 className="mt-6">Geographic Segmentation</h3>
        <p>
          Trends vary by location. Implementation approaches:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Country-level:</strong> Compute separate trends per country. Most
            common (Twitter Trends by country).
          </li>
          <li>
            <strong>Region/State-level:</strong> More granular. Used for local news,
            events.
          </li>
          <li>
            <strong>City-level:</strong> Very granular. Used for hyperlocal content,
            events, weather.
          </li>
          <li>
            <strong>Global:</strong> Aggregate across all locations. Used for worldwide
            trends, viral content.
          </li>
          <li>
            <strong>User Preference:</strong> Let users choose location (home, current,
            custom). Default to user's detected location.
          </li>
        </ul>

        <h3 className="mt-6">Manipulation Prevention</h3>
        <p>
          Prevent bot farms and coordinated manipulation:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>User Quality Weighting:</strong> Weight engagements by user quality
            score (account age, verification, past behavior). Bot engagements worth less.
          </li>
          <li>
            <strong>Velocity Anomaly Detection:</strong> Detect unnatural spikes (1000
            engagements in 1 minute from new accounts). Flag for review.
          </li>
          <li>
            <strong>Coordination Detection:</strong> Detect accounts acting in unison
            (same IP, same timing, same content). Downweight coordinated engagements.
          </li>
          <li>
            <strong>Human Review:</strong> For high-visibility trends (top 10), require
            human approval. Prevent harmful misinformation from trending.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production trending computation involves stream processing for real-time
          velocity calculation.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/trending-computation/trending-architecture.svg"
          alt="Trending Computation Architecture"
          caption="Figure 1: Trending Architecture — Stream processing pipeline with sliding windows, score computation, and cache updates"
          width={1000}
          height={500}
        />

        <h3>Stream Processing Pipeline</h3>
        <ul className="space-y-3">
          <li>
            <strong>Ingestion:</strong> Kafka topic for engagement events (likes, shares,
            comments, views). Millions of events per second.
          </li>
          <li>
            <strong>Windowing:</strong> Sliding window aggregation (1h, 6h, 24h windows).
            Compute engagement counts per window per content item.
          </li>
          <li>
            <strong>Velocity Calculation:</strong> Compute engagements per hour from
            window counts. Compare current window to previous windows for acceleration.
          </li>
          <li>
            <strong>Score Computation:</strong> Apply trending formula (velocity ×
            log(volume) / time_decay). Compute per geographic segment.
          </li>
          <li>
            <strong>Top-K Selection:</strong> Select top 50-100 trending per category/
            location. Store in Redis sorted sets.
          </li>
          <li>
            <strong>Cache Update:</strong> Update trending cache every 5-15 minutes.
            Invalidate on significant score changes.
          </li>
        </ul>

        <h3 className="mt-6">Sliding Window Implementation</h3>
        <p>
          Efficient sliding window computation:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Approach</th>
                <th className="text-left p-2 font-semibold">Description</th>
                <th className="text-left p-2 font-semibold">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Fixed Windows</td>
                <td className="p-2">Tumbling windows (1h, 2h, 3h)</td>
                <td className="p-2">Simple, but discontinuous at boundaries</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Sliding Windows</td>
                <td className="p-2">Overlap windows (every 5 min)</td>
                <td className="p-2">Smoother trends, more compute</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Session Windows</td>
                <td className="p-2">Gap-based windows</td>
                <td className="p-2">User session analysis</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Count Windows</td>
                <td className="p-2">Window by event count</td>
                <td className="p-2">Fixed sample size analysis</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/trending-computation/trending-score-formula.svg"
          alt="Trending Score Formula"
          caption="Figure 2: Trending Score Formula — Velocity, volume, and time decay components with geographic segmentation"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Storage Strategy</h3>
        <ul className="space-y-3">
          <li>
            <strong>Redis Sorted Sets:</strong> Store trending scores as sorted sets.
            Key: trend:country:category, Member: content_id, Score: trending_score.
            O(log N) insert, O(1) top-K retrieval.
          </li>
          <li>
            <strong>Time-series Database:</strong> InfluxDB, TimescaleDB for historical
            trend data. Store score over time for trend analysis, graphs.
          </li>
          <li>
            <strong>Cache Layers:</strong> L1: In-memory (hot trends, &lt;1ms), L2: Redis
            (all trends, &lt;10ms), L3: Database (historical, &lt;100ms).
          </li>
          <li>
            <strong>CDN Edge:</strong> Cache trending lists at CDN edge for global
            distribution. TTL: 5 minutes for balance of freshness and cache hit rate.
          </li>
        </ul>

        <h3 className="mt-6">Real-time Updates</h3>
        <p>
          Keeping trending fresh:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Update Frequency:</strong> Recompute every 5-15 minutes. More frequent
            = fresher but more compute. Twitter: every 5 minutes. Reddit: every 10 minutes.
          </li>
          <li>
            <strong>Incremental Updates:</strong> Don't recompute all trends. Only update
            items with significant engagement changes.
          </li>
          <li>
            <strong>Breaking Boost:</strong> Detect sudden spikes (10x normal velocity),
            boost immediately. Don't wait for next update cycle.
          </li>
          <li>
            <strong>Decay Between Updates:</strong> Apply time decay continuously, not
            just at update time. Prevents stale trends from persisting.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Trending computation involves balancing freshness, stability, and manipulation
          resistance.
        </p>

        <h3>Trending Formula Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Formula</th>
                <th className="text-left p-2 font-semibold">Freshness</th>
                <th className="text-left p-2 font-semibold">Stability</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Reddit Hot</td>
                <td className="p-2">Medium</td>
                <td className="p-2">High</td>
                <td className="p-2">Discussion forums</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Velocity-based</td>
                <td className="p-2">High</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Breaking news</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Hacker News</td>
                <td className="p-2">Medium</td>
                <td className="p-2">High</td>
                <td className="p-2">Tech content</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Twitter (proprietary)</td>
                <td className="p-2">Very High</td>
                <td className="p-2">Low</td>
                <td className="p-2">Real-time events</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/trending-computation/manipulation-prevention.svg"
          alt="Manipulation Prevention"
          caption="Figure 3: Manipulation Prevention — Bot detection, user quality weighting, and coordination detection"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Update Frequency Trade-offs</h3>
        <p>
          <strong>High Frequency (1-5 min):</strong> Very fresh trends, captures breaking
          news. High compute cost, volatile trends (items jump in/out rapidly). Best for:
          Twitter, breaking news.
        </p>
        <p>
          <strong>Medium Frequency (10-15 min):</strong> Balanced freshness and stability.
          Reasonable compute cost. Most production systems use this. Best for: Reddit,
          YouTube.
        </p>
        <p>
          <strong>Low Frequency (30-60 min):</strong> Stable trends, low compute. Trends
          may be stale. Best for: Weekly roundups, evergreen content.
        </p>

        <h3 className="mt-6">Geographic Granularity</h3>
        <p>
          <strong>Global Only:</strong> Simplest, single computation. Misses local trends.
          Best for: Viral content, worldwide events.
        </p>
        <p>
          <strong>Country-level:</strong> Good balance. Captures national trends,
          manageable compute (100-200 countries). Most common approach.
        </p>
        <p>
          <strong>City-level:</strong> Most granular, captures hyperlocal trends. High
          compute (10000+ cities), sparse data for small cities. Best for: Local news,
          events apps.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Log Scale for Volume:</strong> Prevents runaway trends (1000 vs
            10000 engagements should not be 10x difference). Log₁₀ or log₂ both work.
          </li>
          <li>
            <strong>Tune Decay for Content Type:</strong> News: fast decay (30 min
            half-life). Videos: medium decay (6 hours). Articles: slow decay (24 hours).
          </li>
          <li>
            <strong>Weight by User Quality:</strong> Verified users, old accounts, high
            engagement users count more. Prevents bot manipulation.
          </li>
          <li>
            <strong>Multiple Time Windows:</strong> Compute 1h, 6h, 24h windows. Show
            different tabs ("Now", "Today", "This Week").
          </li>
          <li>
            <strong>Diversity Constraints:</strong> Ensure trending has topic diversity.
            Not all top 10 from same category.
          </li>
          <li>
            <strong>Human Review for Top Trends:</strong> Top 10 trends should have human
            oversight. Prevent harmful content from trending.
          </li>
          <li>
            <strong>Monitor for Manipulation:</strong> Alert on unusual patterns (sudden
            spikes from new accounts, coordinated timing).
          </li>
          <li>
            <strong>A/B Test Formulas:</strong> Different formulas for different content
            types. Test engagement impact of trending algorithm changes.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Time Decay:</strong> Old content stays trending forever. Solution:
            Apply exponential or step decay based on content type.
          </li>
          <li>
            <strong>Volume-only Ranking:</strong> Most engaged ever, not trending now.
            Solution: Use velocity, not just volume.
          </li>
          <li>
            <strong>Ignoring Manipulation:</strong> Bot farms game trending. Solution:
            User quality weighting, anomaly detection, human review.
          </li>
          <li>
            <strong>Too Frequent Updates:</strong> Trends jump around wildly. Solution:
            Use 10-15 min update frequency, smooth scores.
          </li>
          <li>
            <strong>No Geographic Segmentation:</strong> US trends shown globally.
            Solution: Compute per country/region, let users choose location.
          </li>
          <li>
            <strong>Single Time Window:</strong> Only showing hourly or daily trends.
            Solution: Multiple windows (1h, 6h, 24h) for different trend types.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Twitter Trends</h3>
        <p>
          Twitter Trends shows topics gaining rapid engagement. Updates every 5 minutes,
          segmented by country and metro area. Uses velocity-based scoring with novelty
          boost (new topics prioritized). Human review for top trends.
        </p>
        <p>
          <strong>Key Innovation:</strong> Real-time spike detection—trends appear within
          minutes of breaking news.
        </p>

        <h3 className="mt-6">Reddit Hot/Rising</h3>
        <p>
          Reddit Hot uses log₁₀(volume) + time_decay formula. Rising shows high-velocity
          posts with fewer total votes. Separate trending per subreddit. 6-hour half-life
          for posts.
        </p>
        <p>
          <strong>Key Innovation:</strong> Community-specific trending—each subreddit
          has its own hot/rising.
        </p>

        <h3 className="mt-6">YouTube Trending</h3>
        <p>
          YouTube Trending shows videos gaining views rapidly. Combines view velocity,
          engagement rate (likes/comments per view), and recency. Human curation for
          top trending. Geographic segmentation by country.
        </p>
        <p>
          <strong>Key Innovation:</strong> View velocity weighted by engagement quality—
          watch time matters more than clicks.
        </p>

        <h3 className="mt-6">TikTok For You</h3>
        <p>
          TikTok's trending computation powers For You feed. Uses completion rate,
          re-watches, shares as engagement signals. Very fast decay (videos trend for
          24-48 hours then fade). Geographic and interest-based segmentation.
        </p>
        <p>
          <strong>Key Innovation:</strong> Completion-weighted engagement—videos watched
          fully count more than skipped videos.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you compute trends in real-time?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use stream processing (Flink, Spark Streaming, Kafka
              Streams). Ingest engagement events into Kafka. Use sliding window
              aggregations (1h, 6h, 24h windows). Compute velocity (engagements/hour)
              and trending score every 5-15 minutes. Store top-K per category/location
              in Redis sorted sets. Update cache, serve from cache for low latency.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent trend manipulation?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Multiple strategies: (1) Weight engagements by user
              quality (verified, account age, past behavior). (2) Detect velocity
              anomalies (1000 engagements in 1 minute from new accounts). (3) Detect
              coordination (same IP, timing, content). (4) Human review for top 10
              trends. (5) Downweight suspicious patterns automatically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle geographic trends?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Compute separate trending scores per geographic segment
              (country, region, city). Tag engagement events with user location. Aggregate
              per segment. Store in separate Redis keys (trend:US, trend:UK, etc.). Let
              users choose location (home, current, custom). Default to detected location.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you choose time decay parameters?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Depends on content type and platform. News: fast decay
              (30 min half-life). Videos: medium (6 hours). Articles: slow (24 hours).
              Tune based on engagement data—plot engagement over time, fit decay curve.
              A/B test different decay rates, measure impact on trending quality.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle cold start for new content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> New content has no engagement history. Use velocity
              (engagements per hour since publish), not absolute count. Boost new content
              temporarily (first 1-6 hours). Show to subset of users for initial
              engagement. If engagement rate exceeds threshold, include in trending.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure trending quality?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track: CTR on trending items, engagement rate (do users
              engage with trending content?), retention (do users who click trending
              return?), diversity (topic entropy in top 10). Human evaluation: sample
              trending lists, rate relevance. A/B test formula changes with these metrics.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://redditblog.com/tagged/ranking"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reddit Blog — Ranking and Trending Articles
            </a>
          </li>
          <li>
            <a
              href="https://blog.twitter.com/engineering/en_us/topics/insights/2019/designing-a-new-explore"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Engineering — Trends and Discovery
            </a>
          </li>
          <li>
            <a
              href="https://flink.apache.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apache Flink — Stream Processing for Real-time Analytics
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/creators/algorithm-trending/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube Creators — How Trending Works
            </a>
          </li>
          <li>
            <a
              href="https://news.ycombinator.com/item?id=15604166"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hacker News — How Ranking Works (pg's explanation)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
