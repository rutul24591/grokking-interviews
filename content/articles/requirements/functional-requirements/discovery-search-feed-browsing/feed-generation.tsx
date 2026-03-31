"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-backend-feed-generation",
  title: "Feed Generation",
  description:
    "Comprehensive guide to feed generation systems covering fan-out patterns, ranking pipelines, real-time updates, and scaling strategies for personalized content streams.",
  category: "functional-requirements",
  subcategory: "discovery",
  slug: "feed-generation",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "feed",
    "generation",
    "backend",
    "scalability",
  ],
  relatedTopics: ["feed-display", "ranking", "real-time-systems", "fan-out-patterns"],
};

export default function FeedGenerationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Feed Generation</strong> is the backend system responsible for creating
          personalized content streams for users on social platforms, news aggregators, and
          content discovery applications. It is one of the most complex and critical systems
          at scale, requiring careful trade-offs between freshness, relevance, latency, and
          computational cost.
        </p>
        <p>
          The feed generation problem becomes exponentially challenging as platforms grow:
          Twitter serves feeds to over 400 million monthly active users, each potentially
          following hundreds of accounts. Facebook's News Feed must rank thousands of
          candidate stories per user per session. The system must handle celebrity accounts
          with over 100 million followers while maintaining sub-200ms feed load times.
        </p>
        <p>
          At its core, feed generation answers: <em>"Given everything that happened since
          the user last checked, what should they see now, in what order?"</em> This requires
          solving candidate generation (what content exists), scoring (how relevant is each
          piece), and ranking (what order maximizes user satisfaction).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Feed Types</h3>
        <p>
          Understanding feed types is fundamental to designing the generation system:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Chronological Feed:</strong> Simplest approach—query content from followed
            accounts, order by <code className="text-sm bg-muted px-1.5 py-0.5 rounded">created_at</code> descending.
            Provides predictable, transparent behavior but surfaces low-quality content alongside
            high-quality. Works well for platforms where recency is paramount (Twitter, messaging).
          </li>
          <li>
            <strong>Ranked Feed:</strong> Score each candidate piece using ML models incorporating
            engagement signals, content quality, author affinity, and user preferences. Maximizes
            engagement but introduces complexity and potential filter bubbles. Used by Facebook,
            Instagram, LinkedIn, TikTok.
          </li>
          <li>
            <strong>Hybrid Feed:</strong> Combines both approaches—recent content from close
            connections (family, best friends) shown chronologically, everything else ranked.
            Balances FOMO (fear of missing out) with relevance. Twitter's "Latest" vs "For You"
            tabs exemplify this.
          </li>
        </ul>

        <h3 className="mt-6">The Celebrity Problem</h3>
        <p>
          A fundamental challenge in feed generation is handling users with massive follower
          counts. When Justin Bieber (110M+ Twitter followers) posts, fan-out-on-write would
          require pushing to 110M feed caches—computationally infeasible. This asymmetry
          (most users have &lt;500 followers, celebrities have millions) necessitates hybrid
          approaches that treat high-follower-count accounts differently.
        </p>

        <h3 className="mt-6">Feed Freshness vs. Relevance Trade-off</h3>
        <p>
          Fresh feeds show breaking news and real-time updates but may surface unverified or
          low-quality content. Relevant feeds maximize engagement but can feel stale and create
          filter bubbles. Production systems typically use a multi-armed bandit approach,
          dynamically balancing freshness and relevance based on user behavior and content type.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          A production feed generation system consists of multiple interconnected components
          working together to deliver personalized content at scale.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/feed-generation/fanout-architecture.svg"
          alt="Fan-out Architecture Comparison"
          caption="Figure 1: Fan-out Architecture Comparison — Write-time push (top) vs Load-time pull (bottom) vs Hybrid approach (right)"
          width={1000}
          height={600}
        />

        <h3>Component Breakdown</h3>
        <ul className="space-y-3">
          <li>
            <strong>Feed Service:</strong> Orchestrates feed generation, handles API requests,
            manages caching layers. Implements the fan-out strategy and coordinates with ranking.
          </li>
          <li>
            <strong>User Graph Service:</strong> Maintains follow relationships, provides
            efficient lookup of followers/following. Typically backed by graph database or
            specialized service (FlockDB at Twitter, TAO at Facebook).
          </li>
          <li>
            <strong>Ranking Service:</strong> Scores candidate feed items using ML models.
            Receives candidate set, computes features, returns sorted results with scores.
          </li>
          <li>
            <strong>Cache Layer:</strong> Redis or Memcached cluster storing pre-computed feeds.
            Uses consistent hashing for shard assignment, implements TTL and eviction policies.
          </li>
          <li>
            <strong>Event Pipeline:</strong> Kafka or Pub/Sub infrastructure for real-time
            event propagation. Handles post creation, engagement events, follow/unfollow actions.
          </li>
          <li>
            <strong>Storage Layer:</strong> Primary database (often sharded MySQL or Cassandra)
            for post data, engagement counts, user metadata. Read replicas for query scaling.
          </li>
        </ul>

        <h3 className="mt-6">Data Flow: Post Creation to Feed Delivery</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>User creates post → API Gateway → Post Service</li>
          <li>Post Service writes to database, publishes "PostCreated" event to Kafka</li>
          <li>Feed Service consumes event, determines fan-out strategy based on author</li>
          <li>
            For normal users: Fan-out service fetches followers, pushes post ID to each
            follower's feed cache (Redis sorted set with timestamp as score)
          </li>
          <li>
            For celebrities: Post stored in "celebrity posts" cache, not pushed to followers
          </li>
          <li>
            When user requests feed: Check cache hit → Return cached feed with pagination
          </li>
          <li>
            Cache miss: Fetch following list, pull recent posts, rank, cache result, return
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/feed-generation/ranking-pipeline.svg"
          alt="Multi-Stage Ranking Pipeline"
          caption="Figure 2: Multi-Stage Ranking Pipeline — Candidate generation retrieves thousands of posts, scoring narrows to hundreds, re-ranking applies diversity and business rules for final feed"
          width={1000}
          height={400}
        />

        <h3 className="mt-6">Database Schema Considerations</h3>
        <p>Key tables for feed generation:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Table</th>
                <th className="text-left p-2 font-semibold">Purpose</th>
                <th className="text-left p-2 font-semibold">Scale</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono text-xs">posts</td>
                <td className="p-2">Post content, metadata, author</td>
                <td className="p-2">Billions of rows</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-xs">user_follows</td>
                <td className="p-2">Following relationships (user_id, following_id)</td>
                <td className="p-2">Hundreds of billions</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-xs">feed_cache</td>
                <td className="p-2">Pre-computed feed (user_id, post_ids[], last_updated)</td>
                <td className="p-2">Millions of active users</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono text-xs">engagement_counts</td>
                <td className="p-2">Aggregated likes, comments, shares per post</td>
                <td className="p-2">Billions of rows</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Feed generation requires constant balancing of competing concerns. Understanding
          these trade-offs is critical for system design interviews and production decisions.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery/feed-generation/caching-scaling-strategy.svg"
          alt="Feed Caching and Scaling Strategy"
          caption="Figure 3: Feed Caching &amp; Scaling Strategy — Redis cluster with consistent hashing, failover mechanism, and geo-distributed caches for low-latency feed delivery"
          width={1000}
          height={500}
        />

        <h3>Fan-out Strategy Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Approach</th>
                <th className="text-left p-2 font-semibold">Write Latency</th>
                <th className="text-left p-2 font-semibold">Read Latency</th>
                <th className="text-left p-2 font-semibold">Storage</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Fan-out on Write</td>
                <td className="p-2">O(followers) — Slow for celebrities</td>
                <td className="p-2">O(1) — Cache lookup</td>
                <td className="p-2">High (data duplication)</td>
                <td className="p-2">Normal users (&lt;10K followers)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Fan-out on Load</td>
                <td className="p-2">O(1) — Just write post</td>
                <td className="p-2">O(following) — Aggregate per read</td>
                <td className="p-2">Low (no duplication)</td>
                <td className="p-2">Celebrity users (&gt;100K followers)</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Hybrid</td>
                <td className="p-2">Variable</td>
                <td className="p-2">Variable</td>
                <td className="p-2">Medium</td>
                <td className="p-2">Production platforms</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Chronological vs Ranked Feeds</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Criterion</th>
                <th className="text-left p-2 font-semibold">Chronological</th>
                <th className="text-left p-2 font-semibold">Ranked</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Implementation Complexity</td>
                <td className="p-2">Low — Simple query</td>
                <td className="p-2">High — ML infrastructure required</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">User Control</td>
                <td className="p-2">High — Transparent ordering</td>
                <td className="p-2">Low — Opaque algorithm</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Engagement</td>
                <td className="p-2">Lower — Misses relevant old content</td>
                <td className="p-2">Higher — Surfaces best content</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Content Quality</td>
                <td className="p-2">Variable — Time-based only</td>
                <td className="p-2">Higher — Quality signals incorporated</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Filter Bubble Risk</td>
                <td className="p-2">Low — See all followed content</td>
                <td className="p-2">High — Algorithm narrows exposure</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-6">Real-time vs Batch Feed Updates</h3>
        <p>
          <strong>Real-time (Stream Processing):</strong> Every post triggers immediate feed
          updates for followers. Provides sub-second freshness but creates write amplification
          for popular users. Best for: Twitter, breaking news, live events.
        </p>
        <p>
          <strong>Batch (Periodic Computation):</strong> Feeds recomputed every N minutes
          using scheduled jobs. Reduces write load but introduces staleness. Best for:
          LinkedIn (professional content less time-sensitive), email digests.
        </p>
        <p>
          <strong>Hybrid Approach:</strong> Real-time for high-priority connections (close
          friends, family), batch for everyone else. Balances freshness with computational
          cost. Used by Facebook for "Close Friends" list.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Cursor-based Pagination:</strong> Never use offset-based pagination
            for feeds. Cursors (post IDs) prevent duplicates and maintain consistency as new
            content arrives. Example: <code className="text-sm bg-muted px-1.5 py-0.5 rounded">?cursor=abc123&amp;limit=20</code>
          </li>
          <li>
            <strong>Implement Feed Coalescing:</strong> For users following 1000+ accounts,
            aggregate multiple posts from same author in single feed slot ("John posted 5
            photos"). Reduces feed fragmentation and improves UX.
          </li>
          <li>
            <strong>Pre-compute Feeds for Inactive Users:</strong> Users who check app
            infrequently can have feeds pre-computed during low-traffic periods. Reduces
            cache miss penalty and improves perceived performance.
          </li>
          <li>
            <strong>Use Consistent Hashing for Shard Assignment:</strong> Distribute feed
            caches across Redis shards using consistent hashing. Minimizes cache redistribution
            when nodes are added/removed.
          </li>
          <li>
            <strong>Implement Graceful Degradation:</strong> During cache failures or ranking
            service outages, fall back to chronological feed from database. Better to show
            slightly stale content than error pages.
          </li>
          <li>
            <strong>Cache Warming for Power Users:</strong> Proactively refresh feeds for
            highly active users before their cache expires. Predict based on usage patterns
            (user checks app every morning at 8 AM).
          </li>
          <li>
            <strong>Handle Unfollow/Mute Promptly:</strong> Implement cache invalidation for
            unfollow actions. User should not see content from unfollowed accounts after
            unfollowing. Use write-through cache with immediate invalidation.
          </li>
          <li>
            <strong>Monitor Feed Latency Percentiles:</strong> Track p50, p95, p99 latencies.
            p99 matters most—slow feeds cause user abandonment. Set SLOs (e.g., p95 &lt; 200ms)
            and alert on violations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Celebrity Problem Ignored:</strong> Attempting fan-out-on-write for users
            with millions of followers causes system overload. Solution: Hybrid approach with
            follower threshold (e.g., &gt;50K followers → fan-out-on-load).
          </li>
          <li>
            <strong>Feed Stampede:</strong> Cache expiry causing thundering herd on database.
            If 100K users' feeds expire simultaneously, database overwhelmed. Solution:
            Staggered TTL with jitter, stale-while-revalidate caching.
          </li>
          <li>
            <strong>Duplicate Items Across Pages:</strong> Poor cursor implementation causes
            same posts appearing on multiple pages. Solution: Use monotonically increasing
            cursor (snowflake IDs), ensure proper boundary handling.
          </li>
          <li>
            <strong>Feed Inconsistency During Failover:</strong> Redis failover causing feed
            to show different content than before. Solution: Redis Cluster with proper
            replication, accept brief inconsistency during failover.
          </li>
          <li>
            <strong>Not Handling Unfollow/Mute:</strong> Feed cache not invalidated on
            unfollow, showing stale content. Solution: Immediate cache invalidation on
            unfollow/mute actions, rebuild feed on next request.
          </li>
          <li>
            <strong>Over-ranking:</strong> Showing same high-scoring content repeatedly,
            creating monotonous feed. Solution: Implement diversity constraints, decay
            scores for previously shown content, inject serendipitous items.
          </li>
          <li>
            <strong>Ignoring Cold Start:</strong> New users with empty following lists see
            empty feeds. Solution: Onboarding flow to follow recommended accounts, show
            trending/popular content as fallback.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Twitter Timeline</h3>
        <p>
          Twitter uses a hybrid fan-out approach. For normal users (&lt;10K followers), posts
          are pushed to follower timelines via fan-out-on-write. For celebrities (&gt;100K
          followers), posts are pulled on read. The timeline service maintains Redis caches
          with 200 post IDs per user, sorted by timestamp. Ranking was introduced in 2016,
          showing "best tweets first" by default with "latest tweets" as an option.
        </p>
        <p>
          <strong>Key Innovation:</strong> Twitter's "Home Mixer" uses a multi-stage ranking
          pipeline: candidate retrieval (3000 tweets) → scoring (ML model) → re-ranking
          (diversity, author balancing) → final timeline (150 tweets).
        </p>

        <h3 className="mt-6">Facebook News Feed</h3>
        <p>
          Facebook's News Feed ranks thousands of candidate stories per user per session.
          Uses "fan-out on write" for most content, but implements "Close Friends" and
          "Acquaintances" lists for prioritized delivery. The ranking model incorporates
          thousands of features including: who posted, content type, past engagement with
          author, post engagement velocity, predicted actions (like, comment, share).
        </p>
        <p>
          <strong>Key Innovation:</strong> Facebook's "Meaningful Social Interactions" update
          prioritized content that sparks conversations, demoting passive consumption content.
          This required retraining ranking models to weight comments and shares higher than
          likes.
        </p>

        <h3 className="mt-6">LinkedIn Feed</h3>
        <p>
          LinkedIn's feed balances professional content (job posts, industry news) with
          social updates (connections' promotions, work anniversaries). Uses a two-tower
          neural network: one tower for user features, one for content features, combined
          for scoring. Implements "follow relevance" scoring—connections in same industry
          weighted higher.
        </p>
        <p>
          <strong>Key Innovation:</strong> LinkedIn's "People You May Know" integration into
          feed shows content from 2nd-degree connections you might want to follow, driving
          network growth alongside engagement.
        </p>

        <h3 className="mt-6">Instagram Feed</h3>
        <p>
          Instagram transitioned from chronological to algorithmic feed in 2016. Uses
          computer vision to understand image content, combines with engagement signals.
          Stories appear separately from feed posts, with their own ranking system.
          Implements "suggested posts" after user catches up on followed accounts.
        </p>
        <p>
          <strong>Key Innovation:</strong> Instagram's "interest graph" maps users to content
          categories (fitness, food, travel) independent of who they follow, enabling
          discovery beyond the social graph.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle feed for users with millions of followers?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use a hybrid approach with fan-out-on-load for celebrities.
              Set a follower threshold (e.g., 50K-100K followers) above which posts are not
              pushed to follower caches. Instead, when a user requests their feed, fetch
              recent posts from celebrity accounts they follow on-demand and merge with
              pre-computed feed cache. This prevents write amplification while maintaining
              acceptable read latency. Twitter uses this approach—celebrity posts are stored
              in a separate cache and pulled during feed assembly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you rank feed content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement a multi-stage ranking pipeline. First, candidate
              generation retrieves ~1000 recent posts from followed accounts. Second, a
              scoring model (logistic regression, XGBoost, or neural network) predicts
              engagement probability for each candidate using features like: recency
              (exponential decay), author affinity (past interactions), content quality
              (engagement rate, completion rate), user preferences (content type affinity).
              Third, re-ranking applies diversity constraints (no more than 3 consecutive
              posts from same author), business rules (promote certain content types), and
              freshness guarantees. Finally, return top 20-50 posts to user.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure feed freshness?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use a combination of push and pull mechanisms. For real-time
              freshness, implement a Kafka-based event pipeline: when a followed account
              posts, push the post ID to active users' feed caches immediately. For less
              time-sensitive updates, use periodic cache refresh (every 5-15 minutes).
              Implement a "X new posts" banner that appears when user pulls to refresh,
              allowing them to control when to load new content. Use stale-while-revalidate
              caching—return cached feed immediately, asynchronously refresh in background.
              For highly active users, implement predictive cache warming based on usage
              patterns (refresh before their typical app-open time).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle feed at global scale?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement geo-distributed architecture with several key
              strategies: (1) Use consistent hashing to distribute feed caches across Redis
              clusters in multiple regions. (2) Deploy read replicas in each geographic region
              to reduce latency. (3) Use edge caching (CDN) for static content and popular
              feeds. (4) Implement async cross-region replication with conflict resolution
              (last-write-wins for feed updates). (5) Route users to nearest region using
              DNS-based geo-routing. (6) Accept eventual consistency for feed updates across
              regions—a user switching from US to EU may see slightly stale feed briefly.
              (7) Implement circuit breakers to gracefully degrade during regional outages.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure feed quality?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use a combination of engagement, retention, and satisfaction
              metrics. Engagement metrics: CTR on feed items, time spent per session, likes/comments/shares
              per feed load, scroll depth (how far user scrolls). Retention metrics: DAU/MAU
              ratio, Day-1/Day-7/Day-30 retention, return rate. Negative signals: hides,
              mutes, unfollows, reports per feed impression. Session metrics: session length,
              sessions per day, time-to-first-engagement. Conduct A/B tests on ranking changes
              with guardrail metrics (latency, error rate, diversity score). Use cohort
              analysis to understand long-term impact on user retention. Implement
              "satisfaction surveys" (e.g., "Why are you seeing this post?") for qualitative
              feedback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle the cold start problem for new users?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement a multi-pronged approach: (1) Onboarding flow
              requiring users to follow 5-10 recommended accounts before seeing feed. Use
              interest-based recommendations during signup. (2) Show trending/popular content
              as fallback for empty feed sections. (3) Use demographic-based recommendations
              (users in same location, age group). (4) Implement "content exploration" —
              boost diverse content types to learn user preferences quickly. (5) Show
              educational content about platform features. (6) Use session-based
              recommendations — if user engages with fitness content, immediately boost
              similar content. (7) Implement "people you may know" to grow their network
              rapidly. Track time-to-first-follow and time-to-first-engagement as key
              onboarding metrics.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://blog.twitter.com/engineering"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Engineering — Timeline Architecture at Scale
            </a>
          </li>
          <li>
            <a
              href="https://engineering.fb.com"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Engineering — News Feed Ranking System
            </a>
          </li>
          <li>
            <a
              href="https://www.manning.com/books/designing-data-intensive-applications"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kleppmann, Martin — Designing Data-Intensive Applications (Chapter 11)
            </a>
          </li>
          <li>
            <a
              href="https://engineering.linkedin.com"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Engineering — Feed Relevance Ranking
            </a>
          </li>
          <li>
            <a
              href="https://instagram-engineering.com"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram Engineering — How Instagram Feed Works
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
