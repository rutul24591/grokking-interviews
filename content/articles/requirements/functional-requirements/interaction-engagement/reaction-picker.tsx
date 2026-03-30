"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-reaction-picker",
  title: "Reaction Picker",
  description:
    "Comprehensive guide to implementing reaction pickers covering emoji reactions, picker UX patterns, long-press vs hover triggers, animation strategies, real-time synchronization, and scaling for high-volume engagement systems.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "reaction-picker",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "interaction",
    "reactions",
    "emoji",
    "frontend",
    "engagement",
    "real-time",
  ],
  relatedTopics: ["like-button", "engagement-tracking", "emoji-systems", "real-time-updates"],
};

export default function ReactionPickerArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Reaction picker extends binary like buttons into a spectrum of emotional responses, enabling users to express nuanced sentiment through emoji reactions. Facebook pioneered mainstream reaction pickers in 2016 with six reactions (Like, Love, Care, Haha, Wow, Sad, Angry), transforming how users engage with content. The reaction picker appears on long-press (mobile) or hover (desktop) over the like button, with the default tap action remaining a simple like for speed.
        </p>
        <p>
          Reactions serve multiple purposes beyond simple engagement. They provide richer sentiment data for ranking algorithms—angry reactions may indicate controversial content that drives engagement but requires moderation attention. Care reactions on memorial posts signal respectful acknowledgment. Different reaction types carry different weight in feed ranking—Love and Care typically indicate stronger positive sentiment than simple Like. For users, reactions enable emotional expression without composing comments, lowering the barrier for engagement.
        </p>
        <p>
          For staff and principal engineers, reaction picker implementation involves technical challenges beyond simple emoji display. The picker must appear instantly on trigger without jank, requiring careful animation optimization. Reactions must sync in real-time across viewers—when someone reacts, others should see the count update immediately. The backend must store reaction types efficiently, support reaction changes (users can change their reaction), and aggregate reaction counts for display. The system must handle reaction spam prevention, rate limiting, and integration with notification systems to alert content creators.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Reaction Types and Taxonomy</h3>
        <p>
          Reaction sets vary by platform but typically include 5-8 emotions covering positive, neutral, and negative sentiment. Facebook uses six reactions plus Like: Love (heart), Care (hugging heart), Haha (laughing face), Wow (surprised face), Sad (crying face), Angry (red angry face). LinkedIn uses Celebrate (party), Support (heart), Love (heart), Insightful (lightbulb), Funny (laugh), Interesting (eyes). Slack provides extensive emoji reactions with thousands of options organized by category.
        </p>
        <p>
          Reaction selection reflects platform culture and use cases. Professional networks like LinkedIn emphasize positive, work-appropriate reactions (Celebrate, Insightful) while avoiding negative reactions—there's no Angry or Sad option. Social platforms include full emotional range including negative reactions for controversial content. Some platforms allow custom emoji reactions (Slack, Discord) while others restrict to curated sets for consistency.
        </p>
        <p>
          Reaction ordering matters for engagement. Most-used reactions appear first (typically Love, Haha). Positive reactions usually precede negative reactions. Some platforms reorder reactions based on content type—Care reaction appears earlier for memorial or illness-related content detected through ML classification. The default Like action remains fastest to access—single tap—while reactions require long-press or hover plus selection.
        </p>

        <h3 className="mt-6">Picker Trigger Patterns</h3>
        <p>
          Long-press trigger on mobile requires holding the like button for 200-500ms before the picker appears. This prevents accidental activation while browsing—users can tap to like without triggering the picker. Haptic feedback on picker appearance provides tactile confirmation. The picker typically appears above the button, anchored to prevent obscuring the content. Dismissal occurs on finger release outside the picker area or swipe away.
        </p>
        <p>
          Hover trigger on desktop displays the picker when cursor hovers over the like button for 100-300ms. This provides quick access without requiring click. The picker appears above or beside the button depending on screen space. Clicking outside the picker dismisses it. Keyboard users can Tab to the like button, Enter to open picker, arrow keys to select reaction, Enter to confirm.
        </p>
        <p>
          Hybrid approaches combine both patterns—long-press on mobile, hover on desktop detected via pointer events. Feature detection checks for touch capability and adjusts trigger behavior accordingly. Some platforms use click-and-hold for both mobile and desktop for consistency, though this adds friction for desktop users accustomed to hover interactions.
        </p>

        <h3 className="mt-6">Reaction State Management</h3>
        <p>
          Reaction state tracks which reaction a user has selected for each piece of content. Users can have one active reaction per content—selecting a new reaction replaces the previous one. Removing a reaction returns to unreacted state. State management requires tracking reaction type, timestamp, and pending state during API sync.
        </p>
        <p>
          Optimistic updates provide instant feedback—when a user selects a reaction, the UI updates immediately while the API request completes in background. On success, the pending state clears. On failure, the UI reverts to previous state with error notification offering retry. This pattern maintains the perception of instant response essential for engagement features.
        </p>
        <p>
          Reaction changes require special handling. When a user changes from Love to Haha, the system must decrement the Love count, increment the Haha count, and update the user's reaction record. This requires atomic operations to prevent race conditions if the user changes reactions rapidly. The UI should animate the transition smoothly rather than jumping between states.
        </p>

        <h3 className="mt-6">Reaction Display and Aggregation</h3>
        <p>
          Reaction counts display as aggregated totals with breakdown on interaction. A post might show "1.2K" total reactions, with a tooltip or modal revealing the breakdown: "500 Love, 400 Haha, 200 Wow, 100 Sad". The breakdown helps users understand sentiment distribution—a post with mostly Haha reactions signals different content than one with mostly Love reactions.
        </p>
        <p>
          Reaction summary uses social proof language: "John Smith and 49 others loved this" or "Jane Doe, Bob Johnson, and 12 others reacted with Haha". Showing specific names personalizes the engagement and leverages social connections. Privacy settings control whether individual reactions are visible—some users prefer anonymous reactions.
        </p>
        <p>
          Reaction sorting for display typically orders by count (most reactions first) with user's reaction highlighted. Some platforms order by reaction type priority (positive before negative) regardless of count. The display must handle cases where the user has reacted—showing their reaction type distinctly and enabling easy change or removal.
        </p>

        <h3 className="mt-6">Animation and Feedback</h3>
        <p>
          Reaction selection animation provides satisfying feedback. Common patterns include scale animation (emoji grows then shrinks), bounce animation (emoji bounces into place), and particle effects (confetti or sparkles for positive reactions). Animation duration should be brief (150-300ms) to avoid delaying subsequent interactions. Respect prefers-reduced-motion for users who prefer minimal animation.
        </p>
        <p>
          Picker appearance animation typically uses scale-up from the like button, creating visual connection between the button and picker. Stagger animation for individual emoji—each emoji appears slightly after the previous—creates polished, professional feel. Animation timing should feel snappy, not sluggish—total picker appearance under 200ms.
        </p>
        <p>
          Haptic feedback on mobile enhances the tactile experience. Light tap haptic on reaction selection confirms the action. Different haptic patterns can distinguish reaction types—stronger haptic for Angry reaction, lighter for Love. Haptics should be subtle and optional—users can disable haptic feedback in device settings.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Reaction picker architecture spans client interaction, animation system, API design, real-time synchronization, and reaction storage. The client component manages picker visibility, reaction selection, and optimistic updates. The API layer validates reactions, enforces rate limits, and persists reaction records. Real-time infrastructure delivers reaction updates to connected viewers. Storage efficiently handles reaction types and counts.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/reaction-picker/reaction-picker-architecture.svg"
          alt="Reaction Picker Architecture"
          caption="Figure 1: Reaction Picker Architecture — Client picker, API validation, real-time sync, and reaction storage"
          width={1000}
          height={500}
        />

        <h3>Client Component Architecture</h3>
        <p>
          Picker component manages visibility state, trigger detection, and reaction selection. For long-press trigger, the component uses touch events with timer—touchstart starts timer, touchend before timer completes triggers normal like, touchend after timer shows picker. Timer duration typically 300ms, adjustable based on user testing. For hover trigger, mouseenter shows picker after short delay (100ms), mouseleave hides picker.
        </p>
        <p>
          Animation system handles picker appearance, emoji transitions, and selection feedback. CSS animations work for simple cases but may jank on low-end devices. JavaScript animation libraries (Framer Motion, GSAP) provide smoother animation with GPU acceleration. Key considerations: animate transform and opacity only (avoid animating layout properties), use will-change CSS property sparingly, and clean up animation frames on unmount.
        </p>
        <p>
          Reaction state management tracks user's reaction per content, pending state during API sync, and error state. State updates trigger UI changes—filling the selected emoji, updating counts, showing/hiding pending indicators. State must sync with real-time updates from other users—when someone else reacts, the counts update without affecting the user's own reaction state.
        </p>

        <h3 className="mt-6">API Design</h3>
        <p>
          Reaction APIs use RESTful endpoints: PUT /content/:id/reaction with reaction_type parameter for setting/changing reactions, DELETE /content/:id/reaction for removing reactions. A single endpoint handles all operations—setting reaction_type creates or updates, null reaction_type removes. GraphQL provides alternative with reaction mutation accepting content_id and reaction_type.
        </p>
        <p>
          Idempotency prevents duplicate reactions from network retries. Include idempotency key or use upsert operations that update existing reaction rather than inserting duplicate. Unique database constraint on (user_id, content_id) prevents multiple reactions from same user. The API returns the updated reaction record with counts for client synchronization.
        </p>
        <p>
          Rate limiting prevents reaction spam—typically 50-100 reactions per minute per user, stricter for new accounts. Rate limits enforced at API layer with 429 Too Many Requests response including Retry-After header. Clients should implement exponential backoff on receiving rate limit response.
        </p>

        <h3 className="mt-6">Real-time Synchronization</h3>
        <p>
          WebSocket connections push reaction updates to connected clients viewing the content. When a user reacts, the API publishes event to message queue. WebSocket service consumes events and pushes to clients subscribed to that content. Clients update counts and reaction summary without requiring refresh.
        </p>
        <p>
          Presence tracking knows which users are actively viewing content. This enables features like "John is reacting..." typing indicators and optimizes real-time delivery—reactions only push to clients actively viewing the content, reducing unnecessary traffic. Presence data expires after timeout (30-60 seconds) to handle disconnected clients.
        </p>
        <p>
          Reconnection handling addresses WebSocket disconnections. Clients maintain last-received reaction ID or timestamp. On reconnection, the client requests reactions created during disconnection period, filling any gaps. This ensures no reactions are missed during temporary connectivity loss. For brief disconnections (under 30 seconds), clients can poll for missed reactions rather than maintaining full WebSocket reconnection.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/reaction-picker/reaction-state-transitions.svg"
          alt="Reaction State Transitions"
          caption="Figure 2: Reaction State Transitions — Unreacted, reacted, changing reaction, and removal states"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Reaction Storage</h3>
        <p>
          Reactions table stores user_id, content_id, reaction_type (enum or string), created_at, updated_at. Reaction types stored as integers (1=Like, 2=Love, etc.) for storage efficiency or strings ('like', 'love') for readability. Unique constraint on (user_id, content_id) prevents multiple reactions. Index on content_id enables efficient count queries.
        </p>
        <p>
          Reaction counts cached in Redis with atomic INCR/DECR operations. Separate counters per reaction type (content:ID:reactions:love, content:ID:reactions:haha) enable efficient breakdown display. Total count sums all reaction types. For viral content receiving millions of reactions, shard counters across multiple Redis keys.
        </p>
        <p>
          Reaction history optionally tracks reaction changes for analytics. Each change creates a new record with timestamp, enabling analysis of how sentiment evolves. This data informs content strategy—a post that starts with Angry reactions but accumulates Love reactions indicates controversial but ultimately well-received content. History table grows quickly, requiring partitioning and archival strategy.
        </p>

        <h3 className="mt-6">Notification Integration</h3>
        <p>
          Reactions trigger notifications for content creators. When a user reacts, the system creates a notification record and pushes to the creator's notification feed. Notifications batch multiple reactions—"John Smith and 9 others reacted with Love"—to reduce notification spam. Batching window typically 1-5 minutes.
        </p>
        <p>
          Notification preferences allow users to control reaction notifications. Options include: all reactions, reactions from friends only, no reaction notifications. Users can also disable push notifications while keeping in-app notifications. Respecting notification preferences is critical for user retention—excessive notifications drive app uninstalls.
        </p>
        <p>
          Real-time notification delivery uses push notification services (FCM for Android, APNs for iOS) for mobile apps, web push for browsers. Notification payload includes reaction type, reactor name/profile picture, and content reference. Tapping notification navigates to the content with reaction picker highlighted.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/reaction-picker/reaction-display-aggregation.svg"
          alt="Reaction Display Aggregation"
          caption="Figure 3: Reaction Display Aggregation — Count breakdown, social proof display, and reaction summary"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Reaction picker design involves numerous trade-offs affecting user experience, engagement rates, system complexity, and content moderation. Understanding these trade-offs enables informed decisions aligned with platform goals and community values.
        </p>

        <h3>Curated vs Custom Reactions</h3>
        <p>
          Curated reactions (Facebook, LinkedIn, Instagram) limit users to 5-8 predefined emoji. This ensures consistent sentiment capture, simplifies analytics, and prevents inappropriate reactions. Curated sets can be tuned for platform culture—professional networks exclude negative reactions. However, curated sets limit expression—users may want reactions not included.
        </p>
        <p>
          Custom reactions (Slack, Discord) allow any emoji from extensive library. This maximizes expression and aligns with community culture—communities create inside-joke emoji. However, custom reactions complicate analytics—thousands of reaction types are difficult to aggregate. Moderation becomes challenging—communities may create offensive emoji. Storage and display complexity increases significantly.
        </p>
        <p>
          Hybrid approaches offer curated primary reactions with custom emoji available through expanded picker. Facebook allows curated reactions on posts but custom emoji in comments. This balances consistency with expression, though adds UI complexity in communicating the two tiers.
        </p>

        <h3>Visible vs Anonymous Reactions</h3>
        <p>
          Visible reactions show who reacted, enabling social proof and connection. Users see friends' reactions, creating conversation starters. Content creators know who engaged. However, visible reactions create social pressure—users may react to please others or avoid offending. Visible negative reactions (Angry, Sad) may discourage creators.
        </p>
        <p>
          Anonymous reactions hide individual reactors, showing only counts. This reduces social pressure and enables honest sentiment expression. Users can react with Angry or Sad without fear of confrontation. However, anonymous reactions reduce social proof value and make it harder for creators to understand their audience.
        </p>
        <p>
          User-controlled visibility allows reactors to choose per-reaction privacy. This maximizes user autonomy but complicates display—some reactions show names, others don't. Implementation requires per-reaction privacy flags and careful aggregation to prevent inferring anonymous reactors through elimination.
        </p>

        <h3>Real-time vs Batched Updates</h3>
        <p>
          Real-time reaction updates push every reaction immediately to connected viewers. This creates live engagement feel, appropriate for active discussions, live streams, and breaking news. Users see reactions appear as others submit them, encouraging participation. However, real-time infrastructure adds significant complexity and cost—WebSocket connections require dedicated infrastructure.
        </p>
        <p>
          Batched updates aggregate reactions over time window (30-60 seconds) before pushing to viewers. This reduces infrastructure cost while providing near-real-time experience. For content with long-tail reactions where reactions arrive minutes apart, batching provides minimal user experience degradation. Most platforms use hybrid—real-time for active content (being viewed by 100+ users), batched for long-tail content.
        </p>
        <p>
          Polling fallback for clients without WebSocket support polls every 30-60 seconds for new reactions. This simplifies client implementation at cost of immediacy and increased server load from polling requests. Polling interval should adapt to content activity—frequent polling for active content, infrequent for dormant content.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/reaction-picker/reaction-moderation-flow.svg"
          alt="Reaction Moderation Flow"
          caption="Figure 4: Reaction Moderation Flow — Automated filtering, abuse detection, and enforcement"
          width={1000}
          height={450}
        />

        <h3>Reaction Removal and Editing</h3>
        <p>
          Easy removal allows users to remove reactions with single tap/click on their active reaction. This provides user control and encourages reaction experimentation—users know they can change their mind. However, easy removal may encourage impulsive reactions followed by regret. Some platforms add confirmation dialog for removal to reduce impulsivity.
        </p>
        <p>
          Reaction editing allows users to change reaction type. Implementation can be seamless—selecting new reaction automatically replaces old—or explicit—user must remove old reaction before adding new. Seamless editing provides better UX but may obscure sentiment changes in analytics. Explicit editing makes changes deliberate but adds friction.
        </p>
        <p>
          Time-limited editing allows reaction changes within window (5-15 minutes) after which reactions become permanent. This balances flexibility with commitment—users can correct mistakes but can't continuously change reactions. Implementation requires tracking reaction timestamp and enforcing time limits at API layer.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use long-press for mobile, hover for desktop:</strong> Detect input type and use appropriate trigger. Long-press prevents accidental activation while browsing. Hover provides quick desktop access. Hybrid approach delivers best experience for each platform.
          </li>
          <li>
            <strong>Animate picker appearance under 200ms:</strong> Fast, snappy animation feels responsive. Use GPU-accelerated animations (transform, opacity). Stagger emoji appearance for polished feel. Respect prefers-reduced-motion.
          </li>
          <li>
            <strong>Provide haptic feedback on mobile:</strong> Light tap haptic on reaction selection confirms action. Make haptics subtle and optional. Users can disable in device settings.
          </li>
          <li>
            <strong>Use optimistic updates:</strong> Update reaction state immediately on selection, then sync to server. Revert on failure with clear error messaging. Users expect instant feedback for reactions.
          </li>
          <li>
            <strong>Support reaction changes:</strong> Allow users to change or remove reactions. Implement seamless replacement—new reaction automatically replaces old. Track changes for analytics.
          </li>
          <li>
            <strong>Display reaction breakdown:</strong> Show total count with breakdown on interaction (tap/hover). Use social proof language: "John and 49 others loved this". Highlight user's own reaction.
          </li>
          <li>
            <strong>Implement rate limiting:</strong> Limit reactions per minute (50-100 typical) to prevent spam. Stricter limits for new accounts. Clear error messages when limits exceeded.
          </li>
          <li>
            <strong>Integrate with notifications:</strong> Notify content creators of reactions. Batch multiple reactions to reduce notification spam. Respect notification preferences.
          </li>
          <li>
            <strong>Cache reaction counts in Redis:</strong> Use atomic INCR/DECR for count updates. Async flush to database for durability. Shard counters for viral content.
          </li>
          <li>
            <strong>Support accessibility:</strong> Keyboard navigation for picker (Tab to like, Enter to open, arrows to select, Enter to confirm). Screen reader announcements for reaction selection. Visible focus indicators.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Accidental picker activation:</strong> Picker appears when user intended to like. Solution: Use long-press (300ms) for mobile, hover delay (100ms) for desktop. Test extensively with users.
          </li>
          <li>
            <strong>Janky animation:</strong> Picker animation stutters or lags. Solution: Use GPU-accelerated animations, avoid animating layout properties, test on low-end devices.
          </li>
          <li>
            <strong>No optimistic updates:</strong> Waiting for server confirmation before updating UI makes reactions feel slow. Solution: Always use optimistic updates with rollback on failure.
          </li>
          <li>
            <strong>Count drift:</strong> Redis counts diverge from database totals over time. Solution: Implement periodic reconciliation that compares and corrects cache against database.
          </li>
          <li>
            <strong>Missing real-time sync:</strong> Users don't see reactions from others in real-time. Solution: Implement WebSocket-based real-time updates for active content.
          </li>
          <li>
            <strong>Poor mobile experience:</strong> Picker appears off-screen, emoji too small to tap, no haptic feedback. Solution: Design mobile-first with proper anchoring, 44px minimum touch targets, haptic feedback.
          </li>
          <li>
            <strong>No accessibility:</strong> Keyboard users can't access picker, screen readers don't announce reactions. Solution: Implement full keyboard navigation, ARIA labels, screen reader announcements.
          </li>
          <li>
            <strong>Ignoring notification fatigue:</strong> Sending notification for every reaction annoys users. Solution: Batch notifications, respect preferences, implement frequency capping.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Facebook Reactions</h3>
        <p>
          Facebook launched reactions in 2016 with six emoji (Love, Haha, Wow, Sad, Angry) plus Like. Long-press on mobile, hover on desktop triggers picker. Reactions weighted differently in News Feed algorithm—comments and shares carry more weight than reactions, but Love indicates stronger positive sentiment than Like. Facebook uses real-time sync for active posts, batched updates for older content. Notification batching groups reactions: "John Smith and 49 others reacted with Love".
        </p>

        <h3 className="mt-6">LinkedIn Reactions</h3>
        <p>
          LinkedIn uses five positive reactions (Celebrate, Support, Love, Insightful, Funny) appropriate for professional context. No negative reactions available. Reactions appear on click rather than long-press, simpler interaction model. LinkedIn emphasizes professional encouragement—Celebrate is most-used reaction for job announcements and work achievements. Reaction analytics inform content creators about professional resonance.
        </p>

        <h3 className="mt-6">Slack Emoji Reactions</h3>
        <p>
          Slack provides extensive custom emoji reactions with thousands of options. Reactions display inline beneath messages, encouraging quick acknowledgment without interrupting conversation flow. Custom emoji upload enables team inside jokes and culture building. Reaction picker organized by category (people, nature, food, activities, places, objects, symbols, flags) with search and frequently used section. Slack uses optimistic updates with real-time sync across channel viewers.
        </p>

        <h3 className="mt-6">Instagram Reactions</h3>
        <p>
          Instagram allows reactions on Stories (not feed posts) with emoji slider. Users react by selecting emoji and sliding to indicate intensity. This provides nuanced feedback beyond binary like. Story creators see reaction breakdown with individual reactors. Instagram also allows custom emoji reactions in direct messages, syncing with device keyboard emoji.
        </p>

        <h3 className="mt-6">Discord Reactions</h3>
        <p>
          Discord combines curated reactions with custom server emoji. Reactions display as emoji with count beneath messages. Clicking reaction adds your reaction or removes if already reacted. Discord supports reaction-based roles—reacting to specific message grants role access. Server administrators can limit which emoji are available for reactions. Discord uses real-time sync with presence indicators showing who is viewing the channel.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle reaction changes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> When a user changes reaction, the client sends PUT request with new reaction_type. The API performs atomic update: decrement old reaction count, increment new reaction count, update user's reaction record. Use database transaction to ensure all three operations succeed or fail together. Client uses optimistic update—immediately shows new reaction, reverts on API failure. For rapid changes (user changes reaction multiple times quickly), queue changes and process sequentially to prevent race conditions.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you store reactions efficiently?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store reactions in junction table (user_id, content_id, reaction_type, created_at, updated_at) with unique constraint on (user_id, content_id). Reaction types as small integers (1-8) for storage efficiency. Cache reaction counts in Redis with separate keys per reaction type (content:ID:reactions:love). Use atomic INCR/DECR for updates. For viral content with millions of reactions, shard counters across multiple Redis keys. Async flush counts to database every 1-5 minutes for durability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement real-time reaction updates?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use WebSocket connections for active viewers. When user reacts, API publishes event to message queue. WebSocket service consumes events and pushes to clients subscribed to that content. Clients update counts and reaction summary without refresh. Implement presence tracking to know which users are viewing—only push to active viewers. For clients without WebSocket, poll every 30-60 seconds. Handle reconnection by fetching missed reactions since last received timestamp.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent reaction spam?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement rate limiting at API layer—50-100 reactions per minute per user, stricter for new accounts. Return 429 Too Many Requests with Retry-After header. Track reaction velocity—sudden spike in reactions from single account flags for review. Detect automation patterns—reactions at regular intervals, reactions without content view time. Exclude suspected spam reactions from public counts. Suspend accounts engaged in reaction manipulation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design reaction picker animation?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use GPU-accelerated animations—animate transform and opacity only, avoid layout properties. Picker scales up from like button (scale: 0.8 to 1.0, opacity: 0 to 1) over 150-200ms. Stagger emoji appearance—each emoji appears 30ms after previous for polished feel. Add subtle bounce on selection (scale: 1.0 to 1.2 to 1.0). Respect prefers-reduced-motion media query—provide instant appearance without animation for users who prefer it. Test on low-end devices for jank.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle reaction privacy?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store privacy preference per reaction (public, friends-only, anonymous). When displaying reactions, filter based on viewer's relationship to reactor. Public reactions visible to all, friends-only visible to connected users, anonymous reactions show in count but not individual display. Prevent inference attacks—if only one anonymous reaction, don't show breakdown that would reveal identity. Allow users to change reaction privacy after posting. Respect platform-wide privacy settings.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://about.fb.com/news/2016/02/reactions-now-available-globally/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Newsroom — Reactions Now Available Globally
            </a>
          </li>
          <li>
            <a
              href="https://engineering.linkedin.com/blog/2016/11/linkedin-reactions--a-new-way-to-engage-with-your-feed"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Engineering — LinkedIn Reactions
            </a>
          </li>
          <li>
            <a
              href="https://slack.com/intl/en-in/blog/features/new-ways-to-engage-with-messages-in-slack"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Blog — Emoji Reactions in Slack
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/emoji-usability/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Emoji Usability in User Interfaces
            </a>
          </li>
          <li>
            <a
              href="https://unicode.org/emoji/charts/full-emoji-list.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unicode Consortium — Emoji Charts and Standards
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/web/updates/2016/01/leveraging-the-emoji-input-experience"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Developers — Emoji Input Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
