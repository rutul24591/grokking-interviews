"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-user-profile-follower-system",
  title: "Design a User Profile & Follower System",
  description:
    "Architecture for a user profile and follower system: profile page rendering strategy (SSR with edge caching), follow/unfollow with optimistic UI and fan-out, follower/following paginated lists, mutual follow detection, profile stats caching (follower count, post count), private account follow request flow, block and mute relationship management, suggested users based on graph proximity, and follower count consistency under high-concurrency celebrity accounts.",
  category: "high-level-design",
  subcategory: "social-engagement",
  slug: "user-profile-follower-system",
  wordCount: 5000,
  readingTime: 31,
  lastUpdated: "2026-05-11",
  tags: ["hld", "social", "profile", "follow", "graph", "fan-out", "optimistic-ui", "celebrity"],
  relatedTopics: ["instagram-twitter-frontend", "infinite-scrolling-feed"],
};

export default function UserProfileFollowerSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A user profile and follower system is the social graph layer of a social platform. Every user has a profile (avatar, bio, post grid) and a set of directed relationships: User A follows User B (B does not necessarily follow A back). The profile page is one of the most visited pages on a social platform — celebrity profiles receive millions of page views per day. Unlike the feed (which is personalized per viewer), the profile page contains mostly public, non-personalized content (the user's posts, their bio, their follower count) and can be aggressively cached. The one exception: the viewer's own relationship state with the profile owner (Do I follow them? Have I sent a follow request? Did they follow me back?) must be fetched per-viewer and cannot be cached globally.</p>
        <p>The follow action creates a cascade of work: it must update the social graph (A follows B), notify B that A followed them, update A's following count, update B's follower count, and potentially update A's feed to include B's posts. This fan-out is manageable for most users (B has 500 followers, so 500 feed caches need updating) but catastrophic for celebrity accounts (B has 10 million followers — updating 10 million feed caches on every new follow is impractical). The system must use different fan-out strategies for celebrity versus normal accounts.</p>
        <p><strong>Explicit scope:</strong> Profile page rendering, follow/unfollow flow, follower count consistency, private account follow request flow, and suggested users. Not in scope: feed fan-out from follows (covered in feed design), or direct messaging.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Profile page:</strong> Avatar, display name, username, bio, post count, follower count, following count, post grid (thumbnail view). For the viewer: follow/unfollow button showing current relationship state. For private accounts: follow request button if not yet following.</li>
          <li><strong>Follow/Unfollow:</strong> One-tap follow. Optimistic UI: button state changes immediately. For public accounts: follow is immediate. For private accounts: follow creates a pending request; the button shows "Requested" until approved.</li>
          <li><strong>Followers/Following lists:</strong> Paginated list of followers and following, each showing avatar, username, and a follow button for the viewer. Mutual follow indicator ("Follows you"). Sorted by recency.</li>
          <li><strong>Mutual follows:</strong> When viewing another user's followers list, indicate which followers also follow the viewer ("You both follow X"). Suggested mutual connections surfaced on profile page.</li>
          <li><strong>Block and mute:</strong> Block prevents the blocked user from viewing the blocker's profile or content. Mute hides the muted user's content from the muter's feed without the muted user knowing. Both are soft-deletable relationship records.</li>
          <li><strong>Suggested users:</strong> "People you may know" module on profile page and dedicated discovery page. Based on second-degree follow graph (followers of people you follow).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Profile page load:</strong> Celebrity profile (10M+ followers) loads within 1 second. Follower count displayed even if precise count is slightly stale (eventual consistency acceptable for counts).</li>
          <li><strong>Follow latency:</strong> Follow button state change visible within 200ms (optimistic). Server confirmation within 2 seconds.</li>
          <li><strong>Count accuracy:</strong> Follower/following counts may be eventually consistent (lag by up to 60 seconds during high-concurrency bursts) but must not show negative counts or counts that diverge by more than 1% over time.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The Profile Service serves the profile page via SSR at the edge (profile data is public, can be edge-cached with a short TTL). The viewer's relationship state is fetched client-side after hydration (cannot be cached globally). The Follow Service handles follow/unfollow operations and writes to the social graph database (a dedicated graph store or a PostgreSQL table with (follower_id, followee_id, status, created_at)). Follower/following counts are maintained in Redis counters (INCR/DECR on follow/unfollow events) with periodic reconciliation against the database. The Fan-out Service reads follow events from Kafka and updates affected users' feed caches; celebrity accounts use a pull-based feed model (fan-out on read) rather than fan-out on write.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/social-engagement/user-profile-follower-system.svg"
          alt="User profile and follower system architecture showing profile page rendering (SSR edge cache: GET /profile/{username} → Profile Service → Redis profile:{userId} TTL 5min; public data: avatar bio postCount followerCount followingCount; edge cache s-maxage=300; viewer relationship: GET /api/me/relationship/{userId} client-side after hydration → not cached), follow action flow (tap Follow → optimistic UI button=Following; POST /api/follow {targetUserId}; Follow Service: INSERT social_graph (followerId targetId status=ACTIVE); INCR followers:{targetId}; INCR following:{followerId}; if target.isPrivate: status=PENDING button=Requested; Kafka follow.created event), fan-out strategy (regular user &lt;10K followers: push fan-out → update feed cache for each follower; celebrity &gt;10K followers: pull fan-out → no feed cache update; at feed load time: merge followed celebrity posts from latest posts cache; hybrid: pre-compute for active followers of celebrity), follower count caching (Redis INCR followers:{userId} on follow; DECR on unfollow; counter:{userId} reconciliation job hourly; displays rounded for celebrities: 10.2M; eventual consistency OK lag &lt;60s), private account flow (status=PENDING; notification to target: 'X wants to follow you'; target: PATCH /api/follow-request/{id} accept/reject; accept: status=ACTIVE fan-out; reject: DELETE record; requester: button stays Requested until decision), social graph queries (followers list: SELECT follower_id WHERE followee_id=X ORDER BY created_at DESC LIMIT 20; mutual follow: EXISTS WHERE follower_id=viewer AND followee_id=follower; suggested users: 2nd-degree graph: followers of people viewer follows; exclude already-followed; rank by mutual count), block/mute (block: INSERT blocks (blockerId targetId); affects: profile visibility feed content search; mute: INSERT mutes (muterId targetId); affects: feed only; target unaware; both soft-deletable)."
          caption="Profile SSR edge-cached (public data TTL=5min, viewer relationship client-side), follow optimistic UI → social_graph INSERT → Redis INCR counters → Kafka fan-out, celebrity pull-based feed (no write fan-out for &gt;10K followers), private account pending-request flow, mutual follow detection, and block/mute relationship records"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Profile Page Rendering and Cache Strategy</h3>
        <p>The profile page (/{"{username}"}) is SSR-rendered at the edge with a 5-minute CDN cache for public data. The rendered HTML includes the user&apos;s avatar, bio, post count, follower count (from Redis counter), and the post grid thumbnails. The CDN cache is keyed by username with Cache-Control: s-maxage=300, stale-while-revalidate=60, content is fresh for 5 minutes and served stale during revalidation for up to another minute. This means the profile page of a celebrity with 50K requests per second is served entirely from CDN with near-zero origin load. The one viewer-specific piece, the follow button state, is excluded from the SSR output. Instead, the follow button renders as &quot;Follow&quot; (the default state) in the SSR shell, and on hydration a GET /api/me/relationship/{"{targetUserId}"} call fetches the viewer&apos;s actual relationship status: NONE, FOLLOWING, PENDING (follow request sent), BLOCKED. The button state updates after this call resolves (&lt;100ms from cache in Redis relationships:{"{viewerId}"}:{"{targetId}"}).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follow Action with Optimistic UI</h3>
        <p>The follow button is the most frequently interacted UI element on a profile page. Its state must be instantly responsive. Optimistic UI: when the user taps "Follow," the button immediately transitions to "Following" state (filled, darker color) without waiting for the server. The POST /api/follow request runs in the background. If the server confirms success, the optimistic state is validated — no change needed. If the server returns an error (e.g., the user was already blocked by the target), the button reverts to "Follow" and a toast message explains why. The optimistic state also immediately updates the viewer's following count in the local store (+1), since this change is certain to be correct if the server confirms.</p>
        <p>Server-side follow processing: the Follow Service receives the POST, writes to the social_graph table, increments the Redis counters (INCR followers:{"{targetId}"}, INCR following:{"{followerId}"}), and publishes a follow.created event to Kafka. The Kafka event triggers: a notification to the followed user (system: &quot;A followed you&quot;), and feed cache warming if the followee is not a celebrity (fan-out on write). For celebrity accounts (defined as follower count &gt; 10,000, configurable threshold), no fan-out is performed on write. Instead, the follower&apos;s feed is assembled at read time by merging the celebrity&apos;s most recent posts from a separate celebrity_recent_posts:{"{userId}"} cache.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Follower Count Consistency</h3>
        <p>Follower counts are maintained as Redis counters rather than COUNT(*) SQL queries, which would be prohibitively slow for accounts with millions of followers. INCR and DECR operations on followers:{"{userId}"} are atomic and return the new count in O(1). The displayed count is read directly from Redis on each profile page SSR. However, Redis counters can drift from the true database count due to: process crashes between the DB write and the Redis increment (the follow is in the DB but the counter wasn&apos;t incremented), or Redis eviction. A reconciliation job runs hourly: SELECT COUNT(*) FROM social_graph WHERE followee_id=userId AND status=ACTIVE for a sample of accounts and sets the Redis counter to the correct value. For celebrity accounts, the count display uses floor rounding to the nearest 100K to mask the delta between exact count and cached count (&quot;10.2M followers&quot; rather than &quot;10,247,832 followers&quot;). This is standard practice on all major social platforms and removes pressure to keep counts to-the-second accurate.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Private Account Follow Request Flow</h3>
        <p>For private accounts, the follow action creates a pending follow request rather than an immediate follow. The social_graph row is inserted with status=PENDING. The follow button shows &quot;Requested&quot; until the account owner makes a decision. A notification is sent to the account owner: &quot;X wants to follow you&quot; with Accept and Decline actions. If the owner accepts (PATCH /api/follow-requests/{"{id}"}/accept), the status is updated to ACTIVE, the counters are incremented, and the fan-out proceeds as normal. If the owner declines (PATCH /api/follow-requests/{"{id}"}/decline), the record is deleted and the requester&apos;s button reverts to &quot;Follow&quot; (the requester is not notified of the decline, preserving privacy). Pending follow requests are listed in a dedicated &quot;Follow Requests&quot; inbox in the account settings, showing avatar, username, and mutual follows for each requester. The requester can also cancel their pending request by tapping &quot;Requested&quot; again (which fires DELETE /api/follow-requests/{"{id}"}).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Suggested Users (Second-Degree Graph)</h3>
        <p>The &quot;Suggested Users&quot; module shows users the viewer might want to follow, ranked by mutual connection count. The query: find all users followed by any of the viewer&apos;s followees (second-degree follows), exclude users already followed by the viewer, and rank by the count of shared followees. This is a graph traversal query: SELECT followee_id, COUNT(*) as mutual_count FROM social_graph WHERE follower_id IN (SELECT followee_id FROM social_graph WHERE follower_id = viewerId) AND followee_id NOT IN (SELECT followee_id FROM social_graph WHERE follower_id = viewerId) GROUP BY followee_id ORDER BY mutual_count DESC LIMIT 10. This query is expensive for users with large follow graphs and is never run in real-time on the profile page load. Instead, it is precomputed by a batch job (runs every 4 hours per user) and cached in Redis suggested_users:{"{userId}"} with a 4-hour TTL. The profile page reads from this cache. On follow and unfollow, the cache is invalidated for both the follower and the followed (their suggestion lists may change).</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Fan-out on write versus fan-out on read for celebrity accounts: fan-out on write (updating all followers' feed caches when a celebrity posts) requires updating 10 million cache entries per post — at 1ms per update, that's 10,000 seconds of sequential work. Fan-out on write is only feasible for regular accounts with manageable follower counts. Fan-out on read (each follower's feed query merges the celebrity's recent posts at read time) adds a small overhead to every feed query but avoids the write amplification. The hybrid approach (fan-out on write for regular accounts, fan-out on read for celebrities) is used by Twitter's architecture (documented in their engineering blog) and is the standard approach for social platforms at scale.</p>
        <p>Soft delete versus hard delete for block/mute: hard-deleting block/mute records means a user who unblocks someone has to start fresh — there's no history of the block. Soft delete (status=ACTIVE/DELETED, deleted_at timestamp) allows auditing of block/mute history for trust-and-safety purposes. If a user reports harassment, knowing that the harasser was previously blocked provides context. The storage overhead of soft-deleted records is minimal (block/mute volumes are low relative to follow volumes).</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A user profile and follower system balances public CDN-cached profile rendering with per-viewer relationship state fetched client-side. Profile SSR is edge-cached (s-maxage=300) for public content; the follow button hydrates from a dedicated relationship API call. Follow actions use optimistic UI (instant button state) with server-side fan-out via Kafka — push fan-out for regular accounts (&lt;10K followers), pull fan-out (feed merges at read time) for celebrities to avoid write amplification at 10M+ follower scale. Follower counts are Redis INCR/DECR counters with hourly reconciliation jobs; celebrity counts display with floor rounding to mask minor drift. Private account follow requests use a PENDING → ACTIVE workflow with owner-approval inbox. Suggested users are precomputed every 4 hours (second-degree graph query) and cached in Redis. Block/mute records are soft-deleted for trust-and-safety auditability. The key design insight: the social graph at celebrity scale requires fundamentally different data flow patterns than at regular-user scale — the celebrity/regular threshold determines fan-out strategy, counter display precision, and CDN cache TTL for public profile content.</p>
      </section>
    </ArticleLayout>
  );
}
