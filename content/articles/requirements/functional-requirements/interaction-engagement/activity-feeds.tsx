"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-backend-activity-feeds",
  title: "Activity Feeds",
  description:
    "Comprehensive guide to implementing activity feeds covering event generation, feed ranking algorithms, fan-out strategies, real-time delivery, storage architectures, and scaling for high-volume social notification systems.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "activity-feeds",
  version: "extensive",
  wordCount: 6300,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "interaction",
    "activity-feed",
    "notifications",
    "backend",
    "real-time",
    "feed-ranking",
  ],
  relatedTopics: [
    "notifications",
    "feed-generation",
    "real-time-systems",
    "event-processing",
  ],
};

export default function ActivityFeedsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Activity feeds track and display user actions and interactions,
          enabling social awareness and engagement notifications. When a user's
          friend likes a post, follows an account, comments on content, or
          achieves a milestone, the activity feed surfaces these events to drive
          re-engagement and social connection. Activity feeds power "What's New"
          pages, notification centers, and email digests that bring users back
          to the platform.
        </p>
        <p>
          The business impact of activity feeds is substantial. Facebook's News
          Feed—arguably the most influential activity feed ever built—drives
          billions of daily engagements and serves as the primary surface for
          content consumption. LinkedIn's activity feed generates millions of
          return visits through notifications about profile views, connection
          updates, and job changes. Well-designed activity feeds increase user
          retention by 20-40% through social proof and fear of missing out
          (FOMO).
        </p>
        <p>
          For staff and principal engineers, activity feed implementation
          involves distributed systems challenges at scale. The system must
          capture millions of events per minute, rank them by relevance for each
          user, and deliver them in real-time. Storage must handle billions of
          activity records with efficient querying. The architecture must
          support multiple feed types (notifications, activity feed, email
          digests) from the same event stream. Fan-out strategies determine
          whether activities push to followers' feeds on creation
          (fan-out-on-write) or pull on read (fan-out-on-read). Ranking
          algorithms balance recency, affinity, and importance to surface the
          most engaging activities.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Activity Event Types</h3>
        <p>
          Activity events fall into categories based on action type and social
          signal strength. High-engagement events include comments, mentions,
          and direct messages—these signal active conversation and drive
          immediate response. Medium-engagement events include likes, reactions,
          and follows—these indicate interest but don't require response.
          Low-engagement events include profile views, content views, and
          passive consumption—these provide awareness without demanding action.
        </p>
        <p>
          Event schema captures actor (who performed action), verb (what
          action), object (what was acted upon), and target (optional
          recipient). Example: "John (actor) commented on (verb) your post
          (object)" or "Sarah (actor) mentioned (verb) you (target) in a comment
          (object)". This Activity Streams 2.0 model enables flexible activity
          representation across diverse actions.
        </p>
        <p>
          Event metadata includes timestamp, actor profile snapshot (name,
          profile picture at time of action), object preview (content snippet,
          thumbnail), and action context (device, location if relevant). Storing
          actor snapshot prevents broken activities when users delete accounts
          or change profiles— the activity shows who performed the action even
          if the user is no longer available.
        </p>

        <h3 className="mt-6">Feed Ranking Signals</h3>
        <p>
          Affinity measures relationship strength between viewer and actor.
          Close connections—frequent interactors, mutual followers, real-world
          connections—receive higher affinity scores. Affinity computed from
          interaction frequency, recency of interaction, relationship type
          (friend vs follower), and bidirectional connection. High-affinity
          activities appear higher in feed.
        </p>
        <p>
          Recency applies time decay to activities. Fresh activities rank higher
          than stale ones. Time decay function varies by platform—exponential
          decay (half-life of 1-6 hours) for fast-moving feeds like Twitter,
          slower decay (half-life of 1-3 days) for feeds like LinkedIn where
          content has longer lifespan. Formula: recency_score = 1 /
          (time_since_post + 1)^gravity, where gravity controls decay rate.
        </p>
        <p>
          Importance weights activity types by engagement value. Comments rank
          higher than likes because they indicate deeper engagement. Mentions
          rank highest because they directly involve the viewer. Shares indicate
          content worth amplifying. Importance weights tuned through A/B
          testing—measure which activities drive most return visits and
          engagement.
        </p>

        <h3 className="mt-6">Fan-out Strategies</h3>
        <p>
          Fan-out-on-write (push model) creates activity records for all
          followers when user performs action. When celebrity posts, system
          immediately creates activity records for all millions of followers.
          Read becomes trivial—fetch user's precomputed feed. Write becomes
          expensive—posting requires millions of inserts. This model suits
          read-heavy workloads where activities read far more than written.
        </p>
        <p>
          Fan-out-on-read (pull model) stores activity globally, followers fetch
          on demand. When user views feed, system queries activities from all
          followed users, merges, sorts, and returns. Write becomes
          trivial—single insert. Read becomes expensive—fetching and merging
          activities from thousands of followed users. This model suits
          write-heavy workloads or users with many followees.
        </p>
        <p>
          Hybrid approach combines both based on user type. Regular users use
          fan-out-on-write—activities push to followers' feeds. Celebrity users
          (millions of followers) use fan-out-on-read—activities stored
          globally, fetched on read. This balances write and read costs.
          Implementation requires detecting celebrity users (follower threshold,
          typically 10K-100K) and routing activities appropriately.
        </p>

        <h3 className="mt-6">Activity Aggregation</h3>
        <p>
          Activity aggregation groups similar activities to reduce noise.
          Instead of showing "John liked your post", "Sarah liked your post",
          "Bob liked your post" as three separate activities, aggregate into
          "John, Sarah, and Bob liked your post". Aggregation reduces feed
          clutter and improves readability. Aggregation window typically 5-30
          minutes—activities within window group together.
        </p>
        <p>
          Aggregation by type groups same activity type on same object. "5
          people liked your post", "3 people commented on your post".
          Aggregation by actor groups multiple activities from same user. "John
          liked your post and commented on your photo". Aggregation by object
          groups activities on same content. "12 people engaged with your post"
          with breakdown by type.
        </p>
        <p>
          Digest aggregation groups activities over longer periods (hourly,
          daily) for email or push notification digests. "You have 15 new
          notifications" with summary by type. Digests reduce notification
          fatigue while keeping users informed. Users can configure digest
          frequency—immediate, hourly, daily, weekly—based on preference.
        </p>

        <h3 className="mt-6">Real-time Delivery</h3>
        <p>
          Real-time activity delivery uses WebSocket connections to push new
          activities to connected clients. When activity generated, it pushes to
          viewers immediately without requiring refresh. This creates live feed
          experience essential for active conversations and breaking news.
          WebSocket connections maintained by dedicated service scaling to
          millions of concurrent connections.
        </p>
        <p>
          Presence tracking knows which users are actively viewing their feed.
          This enables features like "X people are viewing this" and optimizes
          real-time delivery—activities only push to clients actively viewing,
          reducing unnecessary traffic. Presence data expires after timeout
          (30-60 seconds) to handle disconnected clients gracefully.
        </p>
        <p>
          Fallback for clients without WebSocket support uses long-polling or
          periodic polling. Long-polling holds request open until new activity
          available, then immediately reconnects. Periodic polling checks every
          30-60 seconds for new activities. Both approaches increase server load
          compared to WebSocket but provide real-time experience without
          WebSocket infrastructure.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Activity feed architecture spans event generation, storage, ranking,
          and delivery. Events generate from user actions through API layer.
          Event processing pipeline handles fan-out, aggregation, and ranking.
          Storage layer persists activities for retrieval. Delivery layer pushes
          activities to clients in real-time or serves on feed load.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/activity-feeds/activity-feed-architecture.svg"
          alt="Activity Feed Architecture"
          caption="Figure 1: Activity Feed Architecture — Event generation, fan-out processing, storage, ranking, and real-time delivery"
          width={1000}
          height={500}
        />

        <h3>Event Generation Pipeline</h3>
        <p>
          Event generation starts with user action—like, comment, follow, share.
          API validates action, persists to database, then publishes event to
          message queue. Event payload includes actor ID, verb, object ID,
          target ID (if applicable), timestamp, and context metadata. Message
          queue (Kafka, Kinesis, Pub/Sub) buffers events for async processing,
          smoothing traffic spikes.
        </p>
        <p>
          Event enrichment adds actor profile data (name, profile picture URL),
          object preview (content snippet, thumbnail URL), and computed metadata
          (affinity scores for potential viewers). Enrichment happens in stream
          processor consuming from message queue. Enriched events route to
          appropriate downstream systems—activity feed storage, notification
          service, analytics pipeline.
        </p>
        <p>
          Event filtering removes low-value activities. Not every action
          generates feed activity—users shouldn't see "John viewed his own post"
          or "Sarah liked her own comment". Filter rules configured per activity
          type. Some platforms allow users to configure what activities generate
          notifications—granular control reduces notification fatigue.
        </p>

        <h3 className="mt-6">Fan-out Processing</h3>
        <p>
          Fan-out service consumes enriched events from message queue. For each
          event, it determines audience—followers, friends, or specific users
          (mentions). For regular users (under follower threshold), fan-out
          creates activity records in each follower's feed. For celebrity users
          (over threshold), activity stored globally, fetched on read.
        </p>
        <p>
          Feed storage uses Redis sorted sets for fast retrieval. Each user has
          feed key (user:ID:feed) with activity IDs as members and ranking score
          as sort order. Ranking score combines recency, affinity, and
          importance. Redis sorted sets enable efficient pagination—fetch top N
          activities by score, use last score as cursor for next page.
        </p>
        <p>
          Fan-out batching groups multiple activities before writing. Instead of
          writing each activity individually, batch 10-100 activities, write in
          single Redis pipeline operation. This reduces Redis round trips and
          improves throughput. Batching window typically 1-5 seconds—balance
          between latency and throughput.
        </p>

        <h3 className="mt-6">Feed Ranking</h3>
        <p>
          Ranking algorithm computes score for each activity. Score =
          recency_weight × recency_score + affinity_weight × affinity_score +
          importance_weight × importance_score. Weights tuned through A/B
          testing—measure which weight combination drives most engagement.
          Typical weights: recency 0.4, affinity 0.4, importance 0.2.
        </p>
        <p>
          Machine learning ranking replaces hand-tuned weights with learned
          model. Features include recency, affinity, activity type, actor
          popularity, object type, historical engagement rate. Model trained on
          engagement data—what activities do users click, like, comment on? ML
          ranking personalizes feed per user, surfacing activities each user is
          most likely to engage with.
        </p>
        <p>
          Diversity injection prevents feed monotony. Without diversity, feeds
          show only highest-scoring activities, which may all be same type (all
          likes, all from same user). Diversity rules ensure mix of activity
          types, actors, and content. Example: "Show at most 3 activities from
          same user in top 20", "Include at least 5 different activity types in
          top 50".
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/activity-feeds/fanout-strategies.svg"
          alt="Fan-out Strategies"
          caption="Figure 2: Fan-out Strategies — Push model, pull model, and hybrid approach comparison"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Storage Architecture</h3>
        <p>
          Activity storage uses multi-tier approach. Hot storage (Redis) holds
          recent activities (7-30 days) for fast retrieval. Warm storage
          (Cassandra, DynamoDB) holds historical activities (30 days - 1 year)
          for pagination and search. Cold storage (S3, BigQuery) archives old
          activities (1+ years) for compliance and analytics.
        </p>
        <p>
          Activity schema stores activity ID, actor ID, actor snapshot (name,
          profile picture), verb, object ID, object snapshot, target ID,
          timestamp, ranking score, and metadata. Actor and object snapshots
          preserve activity display even if users delete accounts or content.
          This denormalization increases storage but ensures feed integrity.
        </p>
        <p>
          Indexing enables efficient queries. Primary index on user ID and
          timestamp enables user feed retrieval. Secondary index on object ID
          enables "show all activities on this post". Tertiary index on activity
          type enables filtering by type. Indexes stored in Redis for hot data,
          database indexes for warm/cold data.
        </p>

        <h3 className="mt-6">Real-time Delivery</h3>
        <p>
          WebSocket service maintains persistent connections with active
          clients. When new activity generated for user, service pushes to
          connected client. Client receives activity, prepends to feed with
          animation. For high-volume users (celebrities, breaking news),
          activities may batch—"15 new activities" rather than 15 individual
          pushes.
        </p>
        <p>
          Notification service handles push notifications for mobile apps. When
          high-importance activity generated (mention, direct message), service
          sends push notification via FCM (Android) or APNs (iOS). Push payload
          includes activity type, actor name, preview text, and deep link to
          activity. Users configure push preferences per activity type.
        </p>
        <p>
          Email digest service batches activities over time window (hourly,
          daily) and sends summary email. Digest includes top activities by
          engagement, summary counts ("12 people liked your posts"), and
          call-to-action links. Email design optimized for scanability—clear
          headings, activity previews, one-click unsubscribe.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/activity-feeds/activity-ranking-algorithm.svg"
          alt="Activity Ranking Algorithm"
          caption="Figure 3: Activity Ranking Algorithm — Recency, affinity, importance scoring with diversity injection"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Activity feed design involves fundamental trade-offs between write
          cost, read cost, freshness, and complexity. Understanding these
          trade-offs enables informed decisions aligned with platform scale and
          user expectations.
        </p>

        <h3>Push vs Pull Fan-out</h3>
        <p>
          Push fan-out (fan-out-on-write) creates activities for all followers
          on action. Write cost: O(followers). Read cost: O(1)—fetch precomputed
          feed. Best for: Read-heavy workloads, users with moderate follower
          counts (under 10K). Used by: Twitter (for regular users), Instagram,
          Facebook.
        </p>
        <p>
          Pull fan-out (fan-out-on-read) stores activity globally, fetches on
          read. Write cost: O(1)—single insert. Read cost: O(following)—fetch
          and merge activities from all followed users. Best for: Write-heavy
          workloads, users following many accounts. Used by: Twitter (for
          celebrities), some email systems.
        </p>
        <p>
          Hybrid fan-out uses push for regular users, pull for celebrities.
          Write cost: O(followers) for regular users, O(1) for celebrities. Read
          cost: O(1) for regular user feeds, O(celebrity_following) for feeds
          with celebrity content. Best for: Platforms with mixed user types.
          Complexity: Highest—requires routing logic, dual storage systems.
        </p>

        <h3>Real-time vs Batched Delivery</h3>
        <p>
          Real-time delivery pushes activities immediately via WebSocket.
          Freshness: Sub-second. Infrastructure cost: High—WebSocket servers,
          connection management. User experience: Best—live feed feel. Best for:
          Active conversations, breaking news, chat-adjacent features.
        </p>
        <p>
          Batched delivery aggregates activities over time window (30 seconds -
          5 minutes). Freshness: Delayed by batch window. Infrastructure cost:
          Lower—fewer pushes, better batching. User experience: Good—reduces
          notification fatigue. Best for: Most social platforms, notification
          digests.
        </p>
        <p>
          Polling delivery has clients check for new activities periodically.
          Freshness: Delayed by poll interval (30-60 seconds typical).
          Infrastructure cost: Lowest—no persistent connections. User
          experience: Acceptable—slight delay but reliable. Best for: Clients
          without WebSocket support, low-priority feeds.
        </p>

        <h3>Aggregation Granularity</h3>
        <p>
          No aggregation shows every activity individually. Pros: Maximum
          detail, no information loss. Cons: Feed clutter, notification fatigue,
          overwhelming for high-engagement content. Best for: Low-volume feeds,
          professional contexts where each activity matters.
        </p>
        <p>
          Fine aggregation groups activities within short window (5-15 minutes).
          "John and 4 others liked your post". Pros: Reduces clutter while
          preserving detail. Cons: Slight delay for aggregation window. Best
          for: Most social platforms, notification centers.
        </p>
        <p>
          Coarse aggregation groups activities over longer window (hourly,
          daily). "You have 50 new notifications". Pros: Maximum noise
          reduction, digest-friendly. Cons: Loses immediacy, detail requires
          drill-down. Best for: Email digests, weekly summaries, re-engagement
          campaigns.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/activity-feeds/storage-tier-architecture.svg"
          alt="Storage Tier Architecture"
          caption="Figure 4: Storage Tier Architecture — Hot (Redis), warm (Cassandra), and cold (S3) storage tiers"
          width={1000}
          height={450}
        />

        <h3>Storage Denormalization</h3>
        <p>
          Normalized storage references actor and object by ID only. Pros:
          Minimal storage, automatic updates when profiles change. Cons: Broken
          activities when users delete accounts, expensive joins for display.
          Best for: Internal systems, low-scale platforms.
        </p>
        <p>
          Denormalized storage includes actor and object snapshots. Pros:
          Activities display correctly even if users delete accounts, fast
          display without joins. Cons: Higher storage (2-5x), stale snapshots if
          profiles change. Best for: Production social platforms, audit trails.
        </p>
        <p>
          Hybrid storage stores references with periodic snapshot refresh.
          Actor/object stored by ID, snapshots refreshed daily or on display.
          Pros: Balances storage and integrity. Cons: Complexity in refresh
          logic, temporary staleness. Best for: Storage-constrained
          environments, platforms with frequent profile updates.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use hybrid fan-out:</strong> Push for regular users (under
            10K followers), pull for celebrities. This balances write and read
            costs at scale. Implement routing logic based on follower threshold.
          </li>
          <li>
            <strong>Store actor snapshots:</strong> Include name, profile
            picture in activity record. Prevents broken activities when users
            delete accounts. Refresh snapshots periodically for active users.
          </li>
          <li>
            <strong>Aggregate activities:</strong> Group similar activities
            within 5-15 minute window. "John and 4 others liked your post"
            instead of 5 separate notifications. Reduces feed clutter
            significantly.
          </li>
          <li>
            <strong>Rank by multiple signals:</strong> Combine recency,
            affinity, and importance. Tune weights through A/B testing. Consider
            ML ranking for personalization at scale.
          </li>
          <li>
            <strong>Inject diversity:</strong> Limit activities from same user,
            ensure mix of activity types. Prevents feed monotony. Example: "Max
            3 activities from same user in top 20".
          </li>
          <li>
            <strong>Use multi-tier storage:</strong> Redis for hot feed (7-30
            days), Cassandra for warm storage (30 days - 1 year), S3 for cold
            archive (1+ years). Optimize cost and performance.
          </li>
          <li>
            <strong>Implement real-time delivery:</strong> WebSocket for active
            clients, polling fallback. Push high-importance activities
            immediately, batch low-importance. Respect user notification
            preferences.
          </li>
          <li>
            <strong>Filter low-value activities:</strong> Don't show "user liked
            own post" or self-actions. Allow user configuration of notification
            preferences. Reduce noise to improve signal.
          </li>
          <li>
            <strong>Monitor feed health:</strong> Track feed load latency,
            real-time delivery success, aggregation effectiveness. Alert on
            anomalies. Dashboard for feed performance visibility.
          </li>
          <li>
            <strong>Support pagination:</strong> Cursor-based pagination using
            ranking score. Avoid offset pagination—slow for deep pagination.
            Provide "load more" and infinite scroll options.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Pure push fan-out at scale:</strong> Pushing to millions of
            followers for celebrity posts causes write amplification. Solution:
            Hybrid fan-out—pull for celebrities over follower threshold.
          </li>
          <li>
            <strong>No activity aggregation:</strong> Showing every activity
            individually overwhelms users. Solution: Aggregate similar
            activities within time window. "X people liked your post" instead of
            X notifications.
          </li>
          <li>
            <strong>Broken activities from deleted accounts:</strong> Activities
            show "Unknown user" when users delete accounts. Solution: Store
            actor snapshots in activity records.
          </li>
          <li>
            <strong>Feed monotony:</strong> Feed shows only one activity type or
            from one user. Solution: Inject diversity rules—limit activities per
            user, ensure activity type mix.
          </li>
          <li>
            <strong>No real-time delivery:</strong> Users must refresh to see
            new activities. Solution: Implement WebSocket-based real-time
            delivery for active clients.
          </li>
          <li>
            <strong>Ignoring notification fatigue:</strong> Sending notification
            for every activity drives app uninstalls. Solution: Aggregate
            notifications, respect preferences, implement frequency capping.
          </li>
          <li>
            <strong>Poor pagination performance:</strong> Offset pagination
            becomes slow for deep pagination. Solution: Cursor-based pagination
            using ranking score.
          </li>
          <li>
            <strong>No monitoring:</strong> Feed issues undetected until users
            complain. Solution: Monitor feed load latency, delivery success,
            aggregation rates. Alert on anomalies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Facebook News Feed</h3>
        <p>
          Facebook's News Feed is the most influential activity feed, serving
          billions of users. Uses hybrid fan-out—push for regular users, pull
          for celebrities. Ranking algorithm (EdgeRank originally, now ML-based)
          combines affinity, recency, and importance. Activities aggregate—"John
          and 49 others liked your post". Real-time delivery via WebSocket for
          active users. Storage uses multi-tier approach with TAo (Facebook's
          graph store) for hot data.
        </p>

        <h3 className="mt-6">Twitter Activity Tab</h3>
        <p>
          Twitter's activity tab shows likes, retweets, follows, and mentions
          related to user's tweets. Uses pull fan-out for celebrities (millions
          of followers), push for regular users. Aggregation groups similar
          activities. Real-time delivery for mentions and retweets during active
          conversations. Storage optimized for high-velocity tweet activity with
          billions of events daily.
        </p>

        <h3 className="mt-6">LinkedIn Notifications</h3>
        <p>
          LinkedIn's notification feed surfaces profile views, connection
          requests, job changes, and content engagement. Ranking emphasizes
          professional relevance—connections' activities rank higher.
          Aggregation reduces noise—"5 people viewed your profile". Email
          digests daily/weekly for re-engagement. Storage uses a combination of
          Kafka for event streaming and Voldemort for distributed key-value
          storage.
        </p>

        <h3 className="mt-6">Instagram Activity Feed</h3>
        <p>
          Instagram's activity feed shows likes, comments, follows, and
          mentions. Heavy aggregation—"John and 234 others liked your photo".
          Real-time delivery for mentions and comments during active
          conversations. Uses hybrid fan-out with celebrity detection. Storage
          leverages Cassandra for high-write throughput with billions of
          activities stored.
        </p>

        <h3 className="mt-6">GitHub Activity Feed</h3>
        <p>
          GitHub's feed shows repository activity—commits, pull requests,
          issues, stars. Following-based model—see activity from followed users
          and starred repositories. Aggregation groups related activity—"User
          made 5 commits". No real-time delivery—feed updates on refresh.
          Storage uses MySQL with sharding for activity records.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you generate activity feeds?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Event-driven architecture: user action
              triggers API, API publishes event to Kafka. Stream processor
              consumes events, enriches with actor/object data, routes to
              fan-out service. Fan-out creates activity records in followers'
              feeds (push for regular users, pull for celebrities). Activities
              stored in Redis sorted sets with ranking score. Real-time delivery
              via WebSocket to active clients. Fallback to polling for
              unsupported clients.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle digest notifications?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Batch activities over time window (hourly,
              daily). Aggregate by type and object. Compute summary statistics
              ("15 likes, 5 comments"). Generate email/push with top activities
              by engagement. Include call-to-action links. Respect user digest
              frequency preferences. Track digest open rates and engagement to
              optimize timing and content. Use template system for consistent
              formatting across digest types.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you rank activities?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Score = recency_weight × recency_score +
              affinity_weight × affinity_score + importance_weight ×
              importance_score. Recency uses time decay (exponential with
              half-life 1-6 hours). Affinity from interaction frequency,
              recency, relationship type. Importance from activity type weights
              (mentions &gt; comments &gt; likes). Tune weights through A/B
              testing. For personalization, use ML model trained on engagement
              data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale activity feeds?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Hybrid fan-out—push for regular users, pull
              for celebrities. Multi-tier storage—Redis for hot feed, Cassandra
              for warm, S3 for cold. Sharding by user ID for horizontal scale.
              Caching feed pages at CDN edge. Async processing through Kafka for
              event buffering. Batch fan-out writes to reduce Redis round trips.
              Monitor and auto-scale based on load.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle activity deletion?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Soft delete—mark activity as deleted, filter
              from feed views. Async job removes from Redis feeds. For actor
              deletion (user deletes account), batch job removes all activities
              by that user. For object deletion (post deleted), cascade delete
              removes related activities. Tombstone records prevent re-creation
              during sync. Audit trail preserves deletion metadata for
              compliance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement real-time feed updates?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> WebSocket service maintains persistent
              connections. When activity generated, publish to Redis Pub/Sub.
              WebSocket service subscribes, pushes to connected clients for that
              user. Client prepends activity to feed with animation. Handle
              reconnection—client requests missed activities since last received
              ID. Fallback to long-polling for clients without WebSocket
              support.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://engineering.fb.com/2015/07/29/core-data/tao-the-power-of-the-graph/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Engineering — TAO: The Power of the Graph
            </a>
          </li>
          <li>
            <a
              href="https://blog.twitter.com/engineering/en_us/a/2013/new-tweets-per-second-record-and-how"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Engineering — New Tweets Per Second Record
            </a>
          </li>
          <li>
            <a
              href="https://engineering.linkedin.com/blog/2016/03/distributed_data_where_to_use_what_and_when"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Engineering — Distributed Data Storage
            </a>
          </li>
          <li>
            <a
              href="https://activitystrea.ms/specs/json/1.0/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Activity Streams 2.0 Specification
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/blogs/database/design-patterns-for-developing-a-feed-using-amazon-dynamodb/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — Design Patterns for Feed Development with DynamoDB
            </a>
          </li>
          <li>
            <a
              href="https://redis.io/docs/data-types/sorted-sets/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Redis — Sorted Sets for Feed Ranking
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
