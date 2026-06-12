"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-social-media-news-feed",
  title: "Design the Frontend for a Social Media News Feed",
  description:
    "End-to-end frontend architecture for a high-scale news feed: ranking, pagination, real-time updates, optimistic interactions, and performance at billions of impressions.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "frontend-for-a-social-media-news-feed",
  wordCount: 6200,
  readingTime: 37,
  lastUpdated: "2026-05-20",
  tags: ["hld", "news-feed", "social-media", "pagination", "real-time", "performance"],
  relatedTopics: ["personalized-homepage-feed-system", "activity-feed-system"],
};

export default function SocialMediaNewsFeedArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design the Frontend for a Social Media News Feed around product-critical path, data ownership, user trust, latency SLOs, and safe degradation. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          A social media news feed is a high-scale personalized product surface where ranking, pagination, realtime
          events, media loading, optimistic interactions, ads, analytics, accessibility, and scroll performance all meet.
          The visible UI is a list of posts, but the frontend is not a passive renderer. It owns the user's reading
          context, maintains a coherent local cache, protects scroll position, batches telemetry, and decides when
          realtime updates should be shown without disrupting the current session.
        </HighlightBlock>
        <p>
          The design target is a Facebook, Instagram, LinkedIn, or X-style feed with hundreds of millions of daily
          users. The server computes a personalized ranked order and returns cursor-based pages of posts. The client
          renders text, images, videos, links, polls, ads, social proof, and interaction controls. New posts and
          interaction updates can arrive through a realtime channel. The frontend must feel immediate on a median
          mobile device over 4G, continue to show already-loaded content when the network drops, and avoid jarring
          layout shifts as images, embeds, and videos load.
        </p>
        <p>
          A strong interview answer should clarify that the frontend must preserve feed session consistency even when
          the underlying ranking model changes. Pagination cannot be a naive offset because new posts, deleted posts,
          ad insertions, and model updates can reorder the feed between requests. The cursor is an opaque server token
          that represents ranking state and position. The client still deduplicates by post ID and handles stale or
          invalid cursors, but it should not try to reconstruct ranking locally.
        </p>
        <p>
          The primary non-functional goals are time to first post under roughly 1.5 seconds on common devices, smooth
          scroll near 60 fps, low memory use during long sessions, accurate impression measurement, and graceful
          degradation when realtime, media, analytics, or ranking services fail. At staff and principal level, the
          discussion should include not only rendering performance but also product correctness: users should not lose
          likes, see duplicate posts, be billed for invalid ad impressions, or have their scroll position hijacked by
          incoming content.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the user must see a consistent product state even when derived artifacts, personalization, search, upload, or collaboration subsystems lag behind.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design the Frontend for a Social Media News Feed, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Feed Session State</h3>
        <p>
          The feed should be modeled as a session, not just an array. A feed session contains the ordered list of post
          IDs, a normalized post entity store, cursor metadata, page fetch status, stale state, unseen realtime count,
          pending interaction mutations, impression timers, media playback state, and analytics sequence numbers. This
          separation allows a WebSocket event to update one post without moving the list and allows pagination to add
          new IDs without duplicating post bodies already present in cache.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Cursor Pagination and Ranking Snapshots</h3>
        <p>
          Feed pagination should use opaque cursors rather than offsets. A cursor may encode ranking snapshot, user
          segment, ad budget placement, experiment assignment, freshness window, and the server's next position. The
          client treats it as an unreadable token. If the server returns duplicate posts because ranking changed across
          pages, the client deduplicates. If the cursor expires, the client should show a refresh affordance rather
          than attempting to continue an inconsistent session.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Virtualization With Dynamic Heights</h3>
        <p>
          Feed items have variable heights because posts can include text, images, link previews, videos, ads, and
          expanded comments. A virtualized list must estimate heights before render, measure actual heights after
          render, cache measurements by post ID and layout variant, and keep the viewport anchored when height
          corrections happen above the visible region. Without anchoring, users experience scroll jumps that feel like
          the feed is fighting them.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Speculative Versus Confirmed State</h3>
        <p>
          Likes, saves, follows, hides, and comments should update immediately. The cache must distinguish confirmed
          server state from speculative local mutations. A post can have a canonical like count plus pending local
          deltas. This prevents double-tap races, out-of-order mutation responses, and server pushes from overwriting
          user intent while a mutation is still in flight.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: API shape, read/write model, async workflow, permission boundary, cache policy, realtime update strategy, and rollback behavior.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/frontend-for-a-social-media-news-feed-architecture.svg"
          alt="News feed frontend architecture showing normalized cache, virtual list, cursor pagination, realtime event router, optimistic interactions, CDN media, and analytics batching"
          caption="Architecture: feed session state combines normalized cache, cursor pagination, realtime reconciliation, virtualized rendering, media loading, and analytics."
        />
        <p>
          The first page should be loaded through the fastest available path. On web, that often means server-rendering
          or streaming the initial feed shell and first page so the first post appears quickly. Below-the-fold media,
          secondary reaction details, comments, hover cards, and heavy video players should be lazy-loaded. The client
          hydrates the feed session with server-provided page data, stores posts by ID, stores ordering separately, and
          keeps the next cursor for infinite scroll.
        </p>
        <p>
          The data layer can use React Query, Apollo, Relay, or a custom store, but the important property is
          normalization. The feed order is not the post data. A post entity can be updated by pagination, realtime
          events, optimistic mutations, detail views, or moderation actions. Components subscribe narrowly to the
          entity data they render so a viral post's like count update does not force the entire feed to re-render.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/frontend-for-a-social-media-news-feed-workflow.svg"
          alt="News feed workflow showing initial load, cursor pagination, realtime new-post banner, optimistic like path, failure rollback, and impression analytics batching"
          caption="Workflow: initial load, pagination, realtime banner, optimistic mutation, rollback, and impression analytics are separate but coordinated paths."
        />
        <p>
          Infinite scroll is triggered before the user reaches the end, often when the sentinel is one or two viewport
          heights away. The request uses the current cursor and a page size such as 20 posts. The client should prevent
          duplicate fetches, cancel or ignore obsolete requests after refresh, and deduplicate post IDs before appending
          to the order. Pagination failures should not collapse the already-loaded feed; they should show a retry row
          or silently retry with backoff.
        </p>
        <p>
          Realtime updates should respect reading context. New posts should usually increment a "new posts" banner
          instead of being auto-inserted above the user. Interaction count updates for visible posts can update in
          place, but they must reconcile with pending local mutations. Deletions, moderation removals, and blocked-user
          changes should remove or tombstone affected posts without shifting the viewport unexpectedly. If the event
          stream disconnects, the client should reconnect with backoff and fetch a catch-up delta or mark the feed as
          stale.
        </p>
        <p>
          Media delivery is mostly CDN-backed, but the frontend still controls user experience. Image aspect ratios
          should be known before load so placeholders reserve space. Responsive image variants should match viewport
          and device pixel ratio. Video should load metadata before full content, autoplay only when policy and user
          preference allow it, pause when off-screen, and ensure that only one inline video plays at a time. Embedded
          third-party content should be isolated because it can damage scroll performance and privacy.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/frontend-for-a-social-media-news-feed-scaling.svg"
          alt="News feed scaling trade-off showing personalized ordering endpoint, cacheable post entity endpoint, CDN media, client normalized cache, and analytics batching"
          caption="Scaling trade-off: personalized ordering is hard to cache, but post entities, media, and telemetry transport can be optimized separately."
        />
        <p>
          Chronological feeds are simpler, predictable, and easier to paginate. Algorithmic feeds improve engagement
          and relevance but require opaque cursors, ranking snapshots, experiment-aware rendering, and more complex
          stale-session behavior. A principal answer should not assume one is universally better. Chronological feeds
          may be right for messaging, incident timelines, or audit streams. Algorithmic feeds dominate consumer social
          discovery surfaces because engagement and retention are primary business goals.
        </p>
        <p>
          Virtualization improves memory and scroll performance, but it constrains component design. Feed item state
          such as video playback position, expanded comments, translated text, poll selection, and inline composer
          drafts should not live only inside a component that may unmount when scrolled away. That state belongs in the
          feed session store or entity cache. The team must also handle accessibility because virtualized content can
          confuse screen readers if focus, item counts, and keyboard navigation are not carefully implemented.
        </p>
        <p>
          WebSockets provide low-latency updates but consume connection infrastructure and battery. Server-Sent Events
          can be enough for one-way feed invalidations. Polling is simple and robust but less fresh. A practical design
          may use WebSockets for active sessions, push notifications for background mobile updates, and stale banners
          or periodic refresh for low-activity web sessions. Correctness should come from pull-based reconciliation,
          not from assuming every realtime event arrives.
        </p>
        <p>
          Optimistic updates are essential for perceived performance, but they complicate reconciliation. The client
          needs mutation IDs, idempotent server APIs, rollback rules, and conflict handling for rapid interactions. A
          failed like can be reverted with a toast. A failed comment needs stronger handling because user-generated
          text should not vanish. It may remain as a failed local draft with retry. The right UX depends on the action's
          user effort and business importance.
        </p>
        <p>
          Separating feed ordering from post entity fetching can reduce repeated transfer of viral post bodies and
          allow CDN or edge caching for public post data. The trade-off is more round trips and more complicated cache
          invalidation. Many products return enough post data in the first page for fast rendering, then use entity
          endpoints, edge caches, or background revalidation for updates and detail expansions.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          A principal-level design should define separate correctness guarantees for organic content, ads, and safety
          removals. Organic ranking can tolerate eventual consistency and refresh banners. Ad impressions and billing
          need stricter visibility measurement, deduplication, and auditability. Safety removals, blocked-user updates,
          and deleted posts need fast invalidation because showing forbidden content is a trust failure. Treating all
          feed updates as the same consistency class either overbuilds the normal path or underprotects the critical
          path.
        </p>
        <p>
          The cost model should also be explicit. Personalized ordering is expensive and hard to cache, while post
          entities, media, reactions, and creator metadata are more cacheable. A scalable design keeps ranking snapshots
          small, aggressively caches immutable media and public post fields, and uses event-driven invalidation for
          volatile counters or moderation changes. This is the difference between a feed that works in a demo and one
          that survives celebrity traffic, breaking news, or coordinated abuse.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: activation, completion rate, p95 interaction latency, stale-state duration, conversion lag, error rate, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Maintain stable item identity. Every rendered row should have a durable key based on post ID or a stable ad
          slot ID, not array index. Duplicate posts should be removed before they enter the order list. Ads should be
          represented as feed items with their own IDs and impression requirements, not as decorations inserted by the
          renderer, because analytics and pagination need to understand their position.
        </p>
        <p>
          Reserve layout space before media loads. The backend should provide image dimensions, video aspect ratio,
          link-preview dimensions, and content warnings. The frontend should use aspect-ratio boxes and predictable
          skeletons. This reduces cumulative layout shift and protects scroll anchors during media hydration.
        </p>
        <p>
          Use narrow subscriptions and memoized item boundaries. A feed-level state update should not re-render 100
          rows. Each item should subscribe to its own entity, pending mutations, visibility state, and media state.
          Heavy components such as video players, embeds, comment previews, and reaction pickers should load only when
          near interaction or viewport.
        </p>
        <p>
          Treat analytics as a first-class pipeline. Impression events should follow business rules such as 50 percent
          visible for one continuous second for ads. Organic views may use a different threshold. Events should be
          deduplicated by session and item, batched, retried where appropriate, and flushed with `sendBeacon` on page
          hide. Invalid impressions can directly affect ad billing and ranking training data.
        </p>
        <p>
          Design stale and recovery states clearly. If realtime disconnects, show nothing unless freshness matters, but
          mark the session stale internally and reconcile on foreground or reconnect. If pagination fails, keep loaded
          posts and provide retry. If ranking returns an invalid cursor, show a refresh banner. If a post is deleted,
          remove it or show a lightweight tombstone depending on whether the user is interacting with it.
        </p>
        <p>
          Build feed observability around user-visible stability. Track scroll-jump rate, duplicate item rate,
          impression invalidation, optimistic mutation rollback, media autoplay failures, ad viewability disputes, and
          moderation removal latency. Principal-level feed systems fail as much through subtle UX and analytics
          corruption as through obvious API errors.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: partial data, stale projections, duplicate writes, permission drift, missing audit trail, and UI states that hide backend uncertainty.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          A common pitfall is auto-inserting new posts at the top while the user is reading. This shifts content and
          breaks orientation. A banner preserves user control and lets the user decide when to refresh. The same rule
          applies to moderation removals and ad refreshes: protect the viewport anchor before changing content above
          the visible area.
        </p>
        <p>
          Another pitfall is using array indexes as keys in a virtualized feed. When posts are inserted, removed, or
          deduplicated, index keys cause React to reuse the wrong component instances. That can display the wrong media
          playback state, wrong pending interaction, or wrong impression timer. Stable IDs are not optional in feeds.
        </p>
        <p>
          Teams often under-handle variable heights. If the estimated height is far from actual height, scrollbars jump
          and pagination sentinels fire too early or too late. Store measured heights by item type and post ID, update
          estimates as the session learns, and use scroll anchoring to keep visible content stable when measurements
          above the viewport change.
        </p>
        <p>
          A deeper pitfall is mixing ranking, rendering, and analytics ownership. If the renderer inserts ads, removes
          blocked posts, or deduplicates items without preserving ranking metadata, the backend cannot learn from
          impressions correctly. The order list, rendered list, and analytics stream should share stable item and slot
          identifiers.
        </p>
        <p>
          Realtime count deltas can corrupt optimistic state if applied blindly. If the user likes a post locally and a
          server event reports a new aggregate count based on an older snapshot, the local UI may flicker backward.
          Reconciliation should account for pending local mutation IDs and server sequence numbers.
        </p>
        <p>
          Finally, impression tracking is easy to get wrong. Counting on render over-bills ads and pollutes ranking
          models. Counting on any intersection over-counts fast scrolls. The frontend should start a timer only when
          visibility crosses the required threshold, cancel it when the item drops below the threshold, and deduplicate
          successful impressions for the same item within the session.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Consumer social apps use algorithmic feeds to balance freshness, relevance, creator diversity, ads, and
          safety. The frontend must support rapid experiments because ranking, ad placement, and interaction designs
          change frequently. A well-structured feed session lets experiments alter ranking metadata or item rendering
          without destabilizing scroll and cache behavior.
        </p>
        <p>
          Professional networks and marketplaces use feed-like surfaces for job posts, creator updates, product
          listings, recommendations, and sponsored content. These feeds may need stronger explainability, hide controls,
          and "why am I seeing this?" metadata. The same architecture applies, but item types and compliance
          requirements differ.
        </p>
        <p>
          Internal enterprise products use activity feeds for audit timelines, incident updates, deployment events, and
          collaboration streams. These are often chronological rather than algorithmic, but they still benefit from
          normalized caches, virtualization, realtime reconciliation, and visibility-based analytics.
        </p>
        <p>
          Media and short-video products extend the feed model with aggressive prefetching and playback management.
          The feed has to decide how much to buffer ahead without wasting bandwidth, when to pause background players,
          how to handle network downgrade, and how to preserve engagement analytics accurately across swipes and
          autoplay sessions.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you model feed state on the client?
        </h3>
        <p>
          I would separate feed order from post entities. The feed session stores ordered post IDs, cursor metadata,
          fetch status, unseen realtime count, stale state, and impression bookkeeping. The entity store keeps post
          bodies, counters, media metadata, and pending mutations by post ID. This allows pagination to append order,
          realtime events to update entities, optimistic mutations to overlay local state, and virtualization to render
          only visible rows without losing data.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Why use cursor pagination instead of offset pagination?
        </h3>
        <p>
          Offset pagination assumes a stable sorted list. A ranked social feed is not stable because new posts, deleted
          posts, ranking experiments, ad insertion, and freshness adjustments can change order between requests. An
          opaque cursor lets the server preserve ranking snapshot and next position. The client treats the cursor as a
          token, deduplicates post IDs defensively, and refreshes when the cursor expires or becomes invalid.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you preserve smooth scrolling with variable-height posts?
        </h3>
        <p>
          I would use virtualization with estimated heights, then measure actual item heights after render and cache
          them by post ID and layout variant. Media placeholders reserve aspect-ratio space before load. When measured
          heights change above the viewport, the list keeps the top visible item anchored so content does not jump.
          Heavy components such as videos and embeds are loaded only near the viewport and unmounted or paused when far
          away.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you handle realtime new posts?
        </h3>
        <p>
          I would not auto-insert new posts above the user's current position. The realtime event increments a "new
          posts" banner and optionally stores a lightweight pending summary. When the user taps the banner, the client
          refreshes from the top using a new feed request. For interaction updates on visible posts, I would update the
          normalized entity cache, but reconcile with local pending mutation IDs and server sequence numbers to avoid
          flicker or count corruption.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How should optimistic likes and comments work?
        </h3>
        <p>
          Likes can update instantly with a pending mutation ID, local delta, and rollback on failure. The server API
          should be idempotent so retries do not double-count. Comments require more care because the user typed
          content; a failed comment should remain visible as a failed local draft with retry rather than disappearing.
          Server pushes must be merged with pending local state, not blindly overwrite it.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you measure impressions accurately?
        </h3>
        <p>
          I would use IntersectionObserver with business-specific thresholds. For ads, a common rule is at least 50
          percent visible for one continuous second. The client starts a timer when the threshold is crossed, cancels
          it when visibility drops, deduplicates per session and item, batches events, and flushes on page hide with
          `sendBeacon`. Accurate impression logic matters because it affects ad billing, ranking feedback, and creator
          analytics.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/articles/virtualize-long-lists-react-window" target="_blank" rel="noreferrer">
              web.dev: Virtualize large lists with react-window
            </a>
            , list windowing and rendering performance.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" target="_blank" rel="noreferrer">
              MDN: Intersection Observer API
            </a>
            , visibility tracking for lazy loading and impressions.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon" target="_blank" rel="noreferrer">
              MDN: Navigator.sendBeacon
            </a>
            , reliable analytics flushing on page lifecycle changes.
          </li>
          <li>
            <a href="https://web.dev/articles/cls" target="_blank" rel="noreferrer">
              web.dev: Cumulative Layout Shift
            </a>
            , layout stability guidance for media-heavy feeds.
          </li>
          <li>
            <a href="https://relay.dev/docs/guided-tour/list-data/rendering-connections/" target="_blank" rel="noreferrer">
              Relay documentation: Rendering connections
            </a>
            , cursor-style list data patterns.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
