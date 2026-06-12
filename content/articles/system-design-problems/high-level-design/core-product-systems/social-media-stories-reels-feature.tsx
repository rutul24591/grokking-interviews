"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-social-media-stories-reels",
  title: "Design a Social Media Stories/Reels Feature",
  description:
    "Architecture for stories and short-form video: upload pipeline, CDN delivery, viewer state tracking, pre-fetching, expiration, and engagement analytics.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "social-media-stories-reels-feature",
  wordCount: 6200,
  readingTime: 38,
  lastUpdated: "2026-05-20",
  tags: ["hld", "stories", "reels", "short-video", "CDN", "pre-fetching", "HLS"],
  relatedTopics: ["frontend-for-a-social-media-news-feed", "music-audio-streaming-frontend"],
};

export default function SocialMediaStoriesReelsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a Social Media Stories/Reels Feature around product-critical path, data ownership, user trust, latency SLOs, and safe degradation. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          Stories and reels are full-screen short-media experiences optimized for continuous consumption. Stories are
          usually ephemeral, follower-oriented, and viewer-list aware. Reels are usually persistent, recommendation
          driven, and engagement-ranked. Both require fast upload processing, adaptive media delivery, aggressive
          prefetching, autoplay control, telemetry, moderation, and lifecycle management.
        </HighlightBlock>
        <p>
          Assume short videos up to 60 seconds for stories and 90 seconds for reels, mobile uploads in multiple source
          formats, HLS or DASH outputs at several qualities, CDN delivery, story expiry after 24 hours, and a vertical
          reels feed ranked by watch behavior. The product target is swipe-to-next playback within roughly 200
          milliseconds and first playback within a few hundred milliseconds when the viewer opens.
        </p>
        <p>
          Strong interview answers distinguish the creation path from the consumption path. Creation is an eventually
          consistent media-processing workflow. Consumption is a low-latency playback and prefetch workflow. Engagement
          telemetry feeds ranking, creator analytics, moderation, ads, and notification systems.
        </p>
        <p>
          A principal-level design also includes safety, privacy, and creator trust. Stories have viewer lists, expiry,
          screenshot or share policies, reply controls, blocked-user rules, and region-specific compliance. Reels have
          moderation, copyright, ads, recommendation feedback, and creator analytics. The frontend must reflect these
          policies consistently even when media processing, ranking, or telemetry pipelines are eventually consistent.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the user must see a consistent product state even when derived artifacts, personalization, search, upload, or collaboration subsystems lag behind.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a Social Media Stories/Reels Feature, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Media Processing Pipeline</h3>
        <p>
          Users upload raw media directly to object storage through signed upload URLs. A processing pipeline validates
          the file, extracts metadata, transcodes into streaming renditions, generates thumbnails, runs moderation, and
          publishes a story or reel record when enough outputs are ready. The UI tracks states such as uploading,
          processing, available, failed, removed, and expired.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Prefetch and Playback</h3>
        <p>
          Instant swipe playback is only possible when the next media item has already fetched a manifest and initial
          segments. The client keeps a small prefetch window ahead of the current item, uses lower quality for
          speculative startup bytes, and upgrades quality after playback begins. Data saver, battery, network type, and
          memory pressure should reduce prefetch depth.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Lifecycle and Expiry</h3>
        <p>
          Stories expire from follower-visible surfaces after a fixed duration, while creators may retain archive access
          for a longer period. Expiry should remove stories from feeds quickly without requiring massive synchronous
          CDN invalidation. Segment URLs, feed caches, and viewer data should have TTLs that match lifecycle policy.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Engagement and Ranking</h3>
        <p>
          Reels ranking uses watch-through rate, replays, skips, likes, shares, comments, follows, and negative feedback.
          Story analytics uses impressions, unique viewers, completion, replies, reactions, and exits. Telemetry must be
          deduplicated and attributed to a request or ranking context so downstream models can learn correctly.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: API shape, read/write model, async workflow, permission boundary, cache policy, realtime update strategy, and rollback behavior.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/social-media-stories-reels-feature-architecture.svg"
          alt="Stories and reels architecture showing upload, transcoding, CDN, story feed API, reels ranking API, prefetch, viewer tracking, engagement logging, moderation, and expiration"
          caption="Architecture: upload and transcoding publish playable media, while feed APIs, prefetch, telemetry, moderation, and expiry support consumption at scale."
        />
        <p>
          Creation begins with the client requesting an upload session. The media uploads directly to object storage,
          then a processing job validates duration and codec, creates streaming segments, thumbnails, previews, and
          metadata, and starts moderation. The media record becomes available when minimum playable renditions and
          required safety checks are complete. Failure states must be explicit because upload and transcoding can fail
          after the user leaves the creation screen.
        </p>
        <p>
          Consumption begins with either a story tray API or a reels feed API. The story tray returns followed creators
          with active stories ordered by recency and viewed state. The reels API returns ranked reel pages with media
          URLs, ranking metadata, ads or sponsored placements, and impression tokens. The client opens the current item,
          prefetches the next items, tracks watch progress, and sends engagement events when the user exits or swipes.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/social-media-stories-reels-feature-workflow.svg"
          alt="Stories and reels workflow showing upload, processing, availability, story tray fetch, reel ranking fetch, playback, prefetch, watch telemetry, view deduplication, and expiry"
          caption="Workflow: upload is asynchronous, playback is prefetch-driven, and engagement events drive viewer lists, analytics, and ranking feedback."
        />
        <p>
          Viewer tracking for stories is write-heavy. A unique view should be recorded once per viewer and story, then
          surfaced to the creator in reverse chronological order. The hot path can write to Redis or another
          write-optimized store for immediate viewer lists, while durable storage receives batched events. A viral story
          should not overload the primary relational database with one synchronous write per view.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/social-media-stories-reels-feature-prefetch.svg"
          alt="Stories prefetch diagram showing current item, next items, first segments, quality upgrade, data saver reduction, viewer tracking, and two-phase expiration"
          caption="Prefetch and lifecycle: keep a small forward buffer, reduce speculation on constrained networks, and expire story visibility before deleting archive media."
        />
        <p>
          The client player abstracts native HLS support, JavaScript HLS playback where needed, muted autoplay policy,
          pause-on-background, one-active-video ownership, and viewport-based play/pause. Reels use vertical
          IntersectionObserver-style visibility to decide active playback. Stories use carousel position and timers,
          with tap-to-advance, hold-to-pause, and reply/reaction overlays.
        </p>
        <p>
          Ranking and playback should be loosely coupled. The feed API can return ranked candidates and impression
          tokens, while the player owns buffering, autoplay, prefetch, and QoE reporting. If playback fails because a
          rendition is missing or the CDN is slow, telemetry should flow back to ranking and media processing so the
          system can demote broken items and alert owners.
        </p>
        <p>
          Creator-side consistency matters as much as viewer playback. A creator should be able to see upload status,
          processing progress, moderation state, reach, viewer counts, and monetization eligibility without receiving
          contradictory information from eventually consistent systems. The creator dashboard can use delayed analytics,
          but it should label freshness and distinguish estimated engagement from finalized metrics used for payouts
          or recommendations.
        </p>
        <p>
          Safety actions must propagate quickly through feeds and caches. If a story or reel is removed for policy,
          blocked by a user, age-gated, or copyright-restricted in a region, the serving layer should stop returning it
          even if CDN segments still exist. Feed eligibility should therefore be checked at manifest or feed response
          time, not only when media was originally published.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>
          Shorter media segments reduce startup latency and make prefetch more precise, but they increase request count
          and CDN overhead. Longer segments reduce overhead but make instant playback harder. Short-form video usually
          benefits from two-to-four-second segments and low-quality initial prefetch followed by adaptive upgrade.
        </p>
        <p>
          Aggressive prefetch improves swipe latency but wastes bandwidth when users exit quickly. A production client
          should tune prefetch depth by network quality, data saver, battery, device class, and observed user behavior.
          On metered or constrained networks, loading the next item only may be preferable to prefetching several ahead.
        </p>
        <p>
          Viewer counts and engagement metrics need deduplication and privacy controls. Exact viewer lists are useful
          for stories but can be expensive and sensitive for viral content. Reels analytics can be aggregated more
          heavily. The product should decide where exact per-viewer identity is required and where approximate counters
          are sufficient.
        </p>
        <p>
          Exact expiry at the same second for every follower is expensive because feed caches and CDN caches are
          distributed. Eventual expiry within a small window is usually acceptable for consumer stories. Legal holds,
          reports, and creator archives can require longer retention even after follower-visible expiry.
        </p>
        <p>
          Client-side watch telemetry is easy to lose because users swipe, background, or close the app. Send events at
          meaningful milestones and use reliable exit channels where available, but accept that analytics are eventually
          consistent. Server-side CDN logs can supplement client telemetry but lack full UI context.
        </p>
        <p>
          Reels and stories share media infrastructure, but their serving objectives differ. Stories prioritize social
          graph recency and expiry; reels prioritize personalized discovery, ranking feedback, and repeated engagement.
          Mixing the two into one feed service makes lifecycle and ranking rules harder to reason about.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The key decision is where to draw the boundary between shared media infrastructure and product-specific
          lifecycle logic. Upload, transcoding, CDN, moderation, and playback can be shared. Story expiry, viewer lists,
          privacy controls, and close-friends visibility should remain story-specific. Reels ranking, ad insertion,
          watch-through optimization, and creator distribution should remain reels-specific. This split lets teams
          reuse expensive infrastructure without creating one service that mixes incompatible product semantics.
        </p>
        <p>
          The design should also state the cost policy for prefetch and media processing. Instant playback is valuable,
          but every speculative segment is CDN spend and mobile data. High-resolution transcoding for content with tiny
          expected reach may be wasteful. Mature systems can delay expensive renditions until demand justifies them,
          prefetch conservatively on constrained devices, and expose metrics such as bytes prefetched per completed
          watch, first-frame latency, and CDN cost per thousand plays.
        </p>
        <p>
          Privacy and virality pull in opposite directions. Stories benefit from precise viewer lists and close-friends
          rules, while reels benefit from broad distribution and ranking feedback. Reusing one analytics model for both
          can leak more identity than needed or under-measure public content. Principal designs separate unique viewer
          identity, aggregated watch metrics, creator analytics, and ranking features with different retention and
          access rules.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: activation, completion rate, p95 interaction latency, stale-state duration, conversion lag, error rate, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Model media state explicitly. Uploading, processing, available, blocked, failed, expired, archived, and
          deleted should be distinct states. The frontend can then show accurate progress and recover from partial
          processing failures.
        </p>
        <p>
          Keep the prefetch window small and adaptive. Fetch manifests and first segments for near-future items, not an
          unbounded queue. Cancel prefetches when the user changes direction or exits. Use lower quality for speculative
          startup and upgrade after the item becomes active.
        </p>
        <p>
          Deduplicate views and engagement events. A user replaying the same story should not create unlimited unique
          viewer entries, while repeated reel views may still matter for ranking. Store unique-view semantics separately
          from watch-duration telemetry.
        </p>
        <p>
          Separate safety and availability decisions. Some content can be blocked before publish, some can be published
          while queued for review, and some can be downranked pending confidence. The UI should reflect removed or
          processing states clearly to creators.
        </p>
        <p>
          Instrument playback quality: first frame time, swipe-to-play time, startup failure, rebuffering, prefetch hit
          rate, data saver behavior, watch-through, exits, upload processing latency, moderation latency, and expiry
          cache lag.
        </p>
        <p>
          Roll out media pipeline changes by format and cohort. New transcoders, codecs, segment durations, moderation
          models, and CDN rules should be shadowed or limited before broad rollout because failures are expensive and
          visible. Keep a fallback rendition strategy so older clients and weaker networks can still play content when
          premium renditions fail or are delayed.
        </p>
        <p>
          Keep lifecycle jobs idempotent and observable. Expiry, archive movement, deletion, moderation removal, and
          analytics finalization may run in separate workers. Each should tolerate retries and expose progress so the
          product can answer why a story is still visible, why a reel was removed, or why creator analytics are delayed.
        </p>
        <p>
          Stories and reels require a safety propagation model. A media item can be uploaded, transcoded, ranked, cached, reported, taken down, restored, or region-restricted. Those state changes must propagate to feeds, profile trays, CDN URLs, notification surfaces, and analytics without leaving stale unsafe content visible. Principal-level designs should separate media availability, ranking eligibility, and moderation eligibility rather than treating publish as a single boolean.
        </p>
        <p>
          Creator-side consistency matters as much as viewer-side latency. Creators need to see upload status, processing state, copyright or moderation decisions, reach metrics, and deletion state accurately. If a creator deletes a story, the system may not remove every cached impression instantly, but it should stop new distribution quickly and explain remaining propagation delay through state and audit events.
        </p>
        <p>
          Ranking and distribution should be decoupled from media storage. A transcoded video may exist in storage but still be ineligible for distribution because moderation, copyright, privacy audience, or regional policy has not cleared. Conversely, a takedown should remove ranking eligibility immediately even if CDN cache purge takes time. Modeling these states separately prevents unsafe content from leaking through feed caches.
        </p>
        <p>
          Analytics should separate impressions, qualified views, completions, replays, shares, and exits. Creator-facing metrics, ranking feedback, ads billing, and safety investigations all use these events differently. The client should emit idempotent session events and the backend should reconcile them with media eligibility and delivery state.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: partial data, stale projections, duplicate writes, permission drift, missing audit trail, and UI states that hide backend uncertainty.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          The biggest pitfall is designing only the upload pipeline. The product experience is mostly determined by
          playback readiness, prefetch hit rate, and swipe latency. A beautifully processed video that starts two seconds
          late still fails the feature.
        </p>
        <p>
          Another pitfall is prefetching too aggressively. It can burn mobile data, battery, memory, and CDN budget.
          The prefetch planner must adapt to device and network signals.
        </p>
        <p>
          Viewer tracking can become a database hotspot for viral stories. Unique-view writes need deduplication,
          batching, TTL-aware storage, and read paths optimized for creator-visible viewer lists.
        </p>
        <p>
          Story expiry can be inconsistent if feed caches, CDN TTLs, archive policy, and viewer data TTLs are not
          aligned. The design should state what disappears at 24 hours and what remains for archive, safety, or legal
          purposes.
        </p>
        <p>
          Finally, autoplay assumptions can break across browsers and platforms. Muted autoplay is broadly allowed;
          unmuted autoplay generally requires user interaction. The client should persist user mute preference and
          handle play promise failures.
        </p>
        <p>
          Another pitfall is letting ranking, monetization, and safety share one opaque decision path. Reels may need
          ads and ranking experiments, but safety removals and blocked-user constraints must override engagement goals.
          Stories may need close-friends privacy and expiry guarantees. These constraints should be visible in logs and
          enforcement order, not buried inside an unexplainable feed response.
        </p>
        <p>
          Teams often over-focus on video delivery and under-focus on lifecycle jobs. Expiration, archive, music rights, safety review, metrics aggregation, ranking decay, and cache purge are all background workflows. If they are not observable and idempotent, old stories can reappear, counters can drift, or restricted media can keep circulating.
        </p>
        <p>
          Another pitfall is mixing privacy audiences with ranking caches. Close-friends stories, blocked users, age-gated content, and regional restrictions must be enforced at every distribution layer. Cached trays and precomputed ranking lists need audience-aware keys or late filtering that cannot leak existence through counts or previews.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Social apps use stories for ephemeral follower updates, creator analytics, reactions, and direct replies. The
          system emphasizes recency, privacy controls, and expiry.
        </p>
        <p>
          Short-video products use reels-style feeds for discovery, advertising, creator growth, and recommendation
          loops. Ranking quality and watch telemetry dominate product performance.
        </p>
        <p>
          Commerce and marketplace apps use short videos for product demos, live-shopping clips, creator storefronts,
          and shoppable stories. Availability, product linking, and moderation become additional constraints.
        </p>
        <p>
          Enterprise and education products use short stories for announcements, training clips, and internal updates.
          They often prioritize permissions, auditability, retention, and lower CDN cost over viral ranking.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you make swipe-to-next playback feel instant?
        </h3>
        <p>
          Prefetch the next one or two items before the user swipes. Fetch the manifest and initial low-quality
          segments, then upgrade quality after playback starts. Keep a small adaptive window based on network, data
          saver, battery, and device memory. Track prefetch hit rate and swipe-to-play latency as first-class metrics.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How does the upload pipeline work?
        </h3>
        <p>
          The client uploads directly to object storage using a signed URL. A processing job validates media, transcodes
          streaming renditions, generates thumbnails, runs moderation, and publishes an available media record. The UI
          polls or receives a push event for processing status and handles failed or removed states.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you store story viewer lists at viral scale?
        </h3>
        <p>
          Use a write-optimized hot store with deduplication, such as a sorted set keyed by story identifier with viewer
          and timestamp, then batch to durable storage. Reads for creator viewer lists can page recent viewers from the
          hot store. TTLs should match story visibility and archive policy.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do stories and reels differ architecturally?
        </h3>
        <p>
          They share upload, transcoding, CDN, playback, and telemetry infrastructure. Stories are social-graph,
          recency, viewer-list, and expiry driven. Reels are persistent, recommendation-ranked, watch-through optimized,
          and often monetized with ads. Keeping lifecycle and ranking rules separate avoids coupling conflicts.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you handle story expiration?
        </h3>
        <p>
          At the visibility deadline, remove the story from follower-visible APIs and caches. Keep archive or moderation
          data according to policy, then delete or age out media segments and viewer data later. CDN TTLs and signed
          URLs should limit stale access without requiring massive synchronous invalidation.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What metrics would you monitor?
        </h3>
        <p>
          Monitor upload success, processing latency, moderation latency, first frame time, swipe-to-play latency,
          prefetch hit rate, rebuffering, watch-through, skip rate, view dedupe rate, story expiry lag, CDN error rate,
          and engagement event delivery rate.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.apple.com/streaming/" target="_blank" rel="noreferrer">
              Apple Developer: HTTP Live Streaming
            </a>
            , HLS concepts and delivery.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement" target="_blank" rel="noreferrer">
              MDN: HTMLMediaElement
            </a>
            , browser video playback behavior.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" target="_blank" rel="noreferrer">
              MDN: Intersection Observer API
            </a>
            , viewport-based playback activation.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon" target="_blank" rel="noreferrer">
              MDN: Navigator sendBeacon
            </a>
            , reliable exit-time telemetry.
          </li>
          <li>
            <a href="https://aws.amazon.com/mediaconvert/" target="_blank" rel="noreferrer">
              AWS Elemental MediaConvert
            </a>
            , managed video transcoding pipeline reference.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
