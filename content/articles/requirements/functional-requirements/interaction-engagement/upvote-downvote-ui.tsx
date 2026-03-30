"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-int-frontend-upvote-downvote",
  title: "Upvote/Downvote UI",
  description:
    "Comprehensive guide to implementing upvote/downvote systems covering vote toggling, score display, sorting algorithms like Reddit hot and Wilson score, vote manipulation prevention, and community-driven content quality assessment.",
  category: "functional-requirements",
  subcategory: "interaction-engagement",
  slug: "upvote-downvote-ui",
  version: "extensive",
  wordCount: 6300,
  readingTime: 25,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "interaction",
    "voting",
    "engagement",
    "frontend",
    "ranking",
    "community-moderation",
  ],
  relatedTopics: ["ranking", "content-quality", "community-moderation", "sorting-algorithms"],
};

export default function UpvoteDownvoteUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Upvote/downvote UI enables community-driven content quality assessment by allowing users to express approval or disapproval of content and comments. Unlike simple like buttons that only capture positive sentiment, upvote/downvote systems provide nuanced feedback that surfaces valuable content while demoting low-quality or irrelevant contributions. Platforms like Reddit, Stack Overflow, and Hacker News rely on voting to maintain content quality at scale without requiring proportional moderation resources.
        </p>
        <p>
          The voting UI directly shapes community behavior and content quality. Prominent downvote buttons encourage critical evaluation but may discourage participation from users who fear negative feedback. Upvote-only systems like Facebook likes encourage positive engagement but provide less signal for content ranking. The design choice reflects community values—Reddit prioritizes content quality through critical voting, while Instagram prioritizes positive reinforcement through likes only.
        </p>
        <p>
          For staff and principal engineers, upvote/downvote implementation involves navigating technical and social challenges. The system must handle vote state management for three states (upvoted, downvoted, none) with clean transitions. Score calculation must account for vote changes and display net scores accurately. Sorting algorithms like Reddit's hot algorithm or Wilson score confidence intervals determine content visibility and significantly impact user experience. Vote manipulation prevention through rate limiting, account age requirements, and pattern detection protects system integrity. The architecture must scale to handle millions of votes on viral content while maintaining real-time score updates.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Vote States and Transitions</h3>
        <p>
          Vote state management handles three possible states for each user-content pair: no vote (default), upvoted, and downvoted. The UI displays the current state through visual indicators—filled arrows for active votes, outlined arrows for inactive states. Color coding reinforces state: orange or red for upvotes, blue or purple for downvotes, gray for inactive.
        </p>
        <p>
          State transitions must handle all possible user actions smoothly. Clicking upvote when in no-vote state adds an upvote and increments score by one. Clicking upvote when already upvoted removes the vote (toggle off) and decrements score by one. Clicking upvote when downvoted switches the vote—removing the downvote and adding an upvote—incrementing score by two. The same logic applies symmetrically for downvote actions.
        </p>
        <p>
          Optimistic updates provide instant visual feedback by updating the UI before server confirmation. When a user votes, the arrow fills immediately and the score adjusts. The API request fires in the background. If the API fails, the UI reverts to the previous state with an error notification. This approach maintains the perception of instant response while handling failures gracefully.
        </p>

        <h3 className="mt-6">Score Display Strategies</h3>
        <p>
          Net score display shows upvotes minus downvotes as a single number. This simple approach, used by Reddit and Hacker News, provides clear content quality signal without revealing the exact vote breakdown. Positive scores indicate net approval, negative scores indicate net disapproval, and zero indicates balanced or no votes.
        </p>
        <p>
          Separate count display shows upvotes and downvotes individually. YouTube previously used this approach before hiding dislike counts. Separate counts provide transparency about content controversy—a post with 100 upvotes and 90 downvotes is more divisive than one with 100 upvotes and 0 downvotes, even though both have similar net scores. However, displaying downvotes can encourage downvote brigading where users coordinate to inflate downvote counts.
        </p>
        <p>
          Abbreviated display reduces visual clutter for large scores. Scores above 1,000 display as 1.2K, above 1,000,000 as 1.5M. This approach maintains informational value while reducing cognitive load. The exact count can be revealed on hover or tap for users who want precision. Some platforms hide scores entirely for new content during a grace period to prevent bandwagon voting where early votes disproportionately influence later voters.
        </p>

        <h3 className="mt-6">Sorting Algorithms</h3>
        <p>
          Top sorting ranks content by net score (upvotes minus downvotes). This surfaces the most approved content but favors older posts that have had more time to accumulate votes. A post from yesterday with 100 votes ranks above a post from an hour ago with 50 votes, even though the newer post has higher vote velocity.
        </p>
        <p>
          Hot sorting incorporates time decay to surface trending content. Reddit's hot algorithm uses logarithmic scoring with time-based gravity. The formula balances vote count against post age, allowing new posts with strong early engagement to rank above older posts. The gravity parameter controls how quickly posts fall off the hot list—higher gravity means posts need more continuous engagement to stay ranked high.
        </p>
        <p>
          Wilson score sorting uses statistical confidence intervals to rank content by quality rather than raw vote count. This addresses the problem where a post with 1 upvote out of 1 total (100% positive) would rank above a post with 99 upvotes out of 100 total (99% positive). Wilson score accounts for sample size uncertainty, ranking the 99/100 post higher because we have more confidence in its quality. Stack Overflow and Reddit comments use Wilson score for sorting.
        </p>

        <h3 className="mt-6">Vote Manipulation Prevention</h3>
        <p>
          Account age requirements prevent throwaway accounts from manipulating votes. New accounts may have voting disabled for 24 hours or require minimum karma before voting in specific communities. This raises the cost of creating manipulation accounts and reduces spam vote impact.
        </p>
        <p>
          Rate limiting restricts votes per time period—typically 100-200 votes per hour per user. This prevents bot accounts from mass-voting on content. Rate limits are enforced at the API layer with clear error messages when exceeded. Graduated limits allow established accounts higher thresholds than new accounts.
        </p>
        <p>
          Vote fuzzing slightly alters displayed vote counts to prevent exact tracking. Reddit adds small random numbers to vote counts, making it difficult for manipulation services to verify that purchased votes were delivered. The fuzzing is small enough that users don't notice but large enough to frustrate vote tracking. Actual vote counts remain accurate in the database for sorting and analytics.
        </p>
        <p>
          IP and device tracking detects vote rings where multiple accounts from the same IP or device vote on the same content. Detected vote rings are flagged for review, and votes from suspected manipulation accounts may be excluded from score calculation. This requires balancing privacy concerns with system integrity.
        </p>

        <h3 className="mt-6">Vote Weighting</h3>
        <p>
          Equal weighting treats all votes identically regardless of user characteristics. This democratic approach is simple and fair but vulnerable to manipulation through mass account creation. Most platforms use equal weighting for standard content.
        </p>
        <p>
          Reputation weighting gives more weight to votes from high-reputation users. Stack Overflow requires 125 reputation to downvote, ensuring that downvotes come from experienced users who understand community standards. This reduces noise from new users who may downvote for reasons unrelated to content quality.
        </p>
        <p>
          Expertise weighting increases vote weight for users with demonstrated expertise in the content's topic. Some Q&amp;A platforms implement this by tracking user badges or topic-specific reputation. A user with gold badges in Python has more weight on Python questions than on unrelated topics. This approach improves sorting quality but adds significant complexity.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Vote UI architecture spans client state management, API design, database schema, and score caching. The client component manages vote state, optimistic updates, and score display. The API layer validates votes, enforces rate limits, and persists vote records. The database stores votes with efficient indexes for score calculation. Caching layers handle read-heavy score display workloads.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/upvote-downvote-ui/vote-architecture.svg"
          alt="Vote Architecture"
          caption="Figure 1: Vote Architecture — Client vote management, API validation, database storage, and score caching"
          width={1000}
          height={500}
        />

        <h3>Client Component Architecture</h3>
        <p>
          The vote component maintains local state for the user's vote (none, up, down), pending action state during API calls, and the current score. On user interaction, it updates the vote state optimistically, adjusts the displayed score based on the transition (plus or minus 1 or 2), and fires the API request. If the API succeeds, the pending state clears. If the API fails, the component reverts to the previous state and displays an error notification.
        </p>
        <p>
          Vote buttons must be accessible with keyboard support. Tab navigates to the vote buttons, Enter or Space activates the focused button. ARIA labels indicate the current state and action ("Upvote this post, currently not voted" or "Remove upvote, currently upvoted"). Focus indicators must be clearly visible for keyboard users. Touch targets should meet the 44x44 pixel minimum for mobile accessibility.
        </p>
        <p>
          Score animation provides satisfying visual feedback when votes change. Count-up animations for score increases and count-down for decreases make the vote impact visible. Animation duration should be brief (100-200ms) to avoid delaying subsequent interactions. Respect prefers-reduced-motion for users who prefer minimal animation.
        </p>

        <h3 className="mt-6">API Design</h3>
        <p>
          Vote APIs typically use RESTful endpoints like POST /content/:id/vote with vote_type parameter (up or down), or separate endpoints POST /content/:id/upvote and POST /content/:id/downvote. A single endpoint with vote_type is more flexible and easier to extend for additional reaction types. DELETE /content/:id/vote removes the user's vote entirely.
        </p>
        <p>
          Idempotency is critical for vote operations. Sending the same vote request twice should not create duplicate votes or double-increment the score. Include idempotency keys generated client-side or use upsert operations that update existing votes rather than inserting new records. Unique database constraints on (user_id, content_id) pairs prevent duplicate votes at the schema level.
        </p>
        <p>
          Rate limiting enforcement happens at the API layer. Check the user's vote count in the current time window before processing. Return 429 Too Many Requests with Retry-After header when limits are exceeded. Include rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining) in responses so clients can self-regulate.
        </p>

        <h3 className="mt-6">Database Schema</h3>
        <p>
          Votes table stores user_id, content_id, vote_type (+1 or -1), and created_at timestamp. A composite unique constraint on (user_id, content_id) prevents duplicate votes. Indexes on content_id enable efficient score calculation for content queries. Indexes on user_id enable user vote history queries.
        </p>
        <p>
          Content table includes denormalized score and vote_count columns for efficient display. Triggers or application logic update these columns when votes change. Denormalization trades write complexity for read performance—score reads are far more frequent than vote writes. Periodic reconciliation jobs ensure denormalized scores match actual vote totals.
        </p>
        <p>
          Partitioning votes table by date or content_id enables efficient data lifecycle management. Old votes can be archived or moved to cold storage while keeping recent votes in hot storage for fast access. Partitioning also improves query performance by reducing the data scanned for recent content.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/upvote-downvote-ui/vote-state-transitions.svg"
          alt="Vote State Transitions"
          caption="Figure 2: Vote State Transitions — No vote, upvoted, downvoted states with score change calculations"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Score Caching</h3>
        <p>
          Redis caches store vote counts with atomic INCRBY operations that handle positive and negative increments. Cache keys follow pattern content:ID:score for net score and content:ID:upvotes, content:ID:downvotes for individual counts. Redis's single-threaded operation ensures atomic updates without race conditions.
        </p>
        <p>
          Sharded counters handle viral content receiving millions of votes. Split votes across multiple Redis keys (content:ID:score:shard0 through shard9) and sum shards when reading total score. This distributes write load across multiple Redis instances. The trade-off is read complexity—fetching score requires multiple Redis calls and summation.
        </p>
        <p>
          Cache invalidation ensures score accuracy. When votes change, update Redis immediately and asynchronously persist to database. Periodic reconciliation compares Redis scores against database totals and corrects any drift. Accept eventual consistency for score display—slight delays (seconds) are acceptable for engagement metrics.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Vote UI design involves numerous trade-offs affecting community behavior, content quality, and system complexity. Understanding these trade-offs enables informed decisions aligned with community goals.
        </p>

        <h3>Upvote/Downvote vs Like-Only</h3>
        <p>
          Upvote/downvote systems provide nuanced feedback that distinguishes high-quality content from controversial or low-quality content. The ability to downvote enables community moderation where users collectively demote spam, misinformation, and low-effort posts. However, downvotes can discourage participation, especially from new users who may be sensitive to negative feedback. Research shows that receiving downvotes reduces subsequent contribution frequency.
        </p>
        <p>
          Like-only systems encourage positive engagement without the psychological cost of negative feedback. Instagram, Facebook, and TikTok use like-only models that maximize participation. However, like-only provides less signal for content ranking—everything with likes is "good" with no differentiation for quality levels. Like-only also removes community moderation capability, requiring more centralized moderation resources.
        </p>
        <p>
          Hybrid approaches offer both options. YouTube shows likes publicly but hides dislikes from viewers (creators still see dislikes). This provides creators with feedback while reducing dislike brigading impact. Some platforms show downvotes only to content authors, providing feedback without public shaming.
        </p>

        <h3>Score Visibility Trade-offs</h3>
        <p>
          Visible scores provide social proof that influences user behavior. High-score content receives more engagement through rich-get-richer dynamics. This helps surface quality content but can create bandwagon effects where early votes disproportionately influence later voters. Users may upvote content because it already has many upvotes rather than evaluating content quality independently.
        </p>
        <p>
          Hidden scores during a grace period (first hour or until N votes) prevent bandwagon voting and give all content a fair chance. Reddit experiments with hidden scores in some subreddits. The trade-off is reduced social proof—users can't quickly identify popular content. After the grace period, scores become visible with accumulated votes.
        </p>
        <p>
          Vote fuzzing slightly alters displayed scores to prevent exact tracking while maintaining approximate accuracy. This prevents manipulation services from verifying delivered votes and reduces obsession with exact score numbers. The fuzzing should be small (±1-5% of score) to avoid user confusion.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/interaction-engagement/upvote-downvote-ui/sorting-algorithm-comparison.svg"
          alt="Sorting Algorithm Comparison"
          caption="Figure 3: Sorting Algorithm Comparison — Top, hot, new, controversial, and Wilson score sorting characteristics"
          width={1000}
          height={450}
        />

        <h3>Sorting Algorithm Selection</h3>
        <p>
          Top sorting is simplest to implement and understand but favors established content. New content struggles to gain visibility regardless of quality. Top sorting works well for evergreen content where recency matters less than accumulated quality signals.
        </p>
        <p>
          Hot sorting balances quality and recency, surfacing trending content. This keeps feeds fresh and gives new content a chance. However, hot sorting can surface low-quality content that happens to receive early engagement. The gravity parameter requires tuning for each community—high-engagement communities need higher gravity to prevent any single post from dominating.
        </p>
        <p>
          Wilson score provides statistically sound quality ranking but is computationally more expensive. The algorithm requires calculating confidence intervals for each piece of content. Wilson score works best for Q&amp;A platforms and comment sorting where quality differentiation is critical. The computational cost is acceptable for these use cases given the quality improvement.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement optimistic updates:</strong> Update vote state and score immediately on user interaction, then sync to server. Revert on failure with clear error messaging. Users expect instant feedback for vote actions.
          </li>
          <li>
            <strong>Use clear visual indicators:</strong> Filled arrows for active votes, outlined for inactive. Distinct colors for upvote (orange/red) vs downvote (blue/purple). Show score changes with subtle animation.
          </li>
          <li>
            <strong>Handle vote toggling correctly:</strong> Clicking the same vote twice removes the vote. Clicking the opposite vote switches with score change of 2. Test all transition paths thoroughly.
          </li>
          <li>
            <strong>Abbreviate large scores:</strong> Display 1.2K instead of 1,234 for scores above 1,000. Show exact score on hover for users who want precision. Reduces visual clutter.
          </li>
          <li>
            <strong>Implement rate limiting:</strong> Limit votes per hour (100-200 for normal users). Stricter limits for new accounts. Clear error messages when limits exceeded.
          </li>
          <li>
            <strong>Use Wilson score for quality sorting:</strong> For comments and Q&amp;A content, use Wilson score confidence intervals rather than raw score. This surfaces reliably good content over lucky one-vote wonders.
          </li>
          <li>
            <strong>Prevent vote manipulation:</strong> Require account age and minimum activity before voting. Detect and exclude vote rings. Use vote fuzzing for displayed counts.
          </li>
          <li>
            <strong>Support accessibility:</strong> Keyboard navigation with Enter/Space to vote. ARIA labels for vote state. Visible focus indicators. 44px minimum touch targets.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Incorrect score transitions:</strong> Failing to handle vote switching correctly results in score drift. Switching from downvote to upvote should change score by +2, not +1. Test all six transition paths (none→up, none→down, up→none, down→none, up→down, down→up).
          </li>
          <li>
            <strong>No optimistic updates:</strong> Waiting for server confirmation before updating UI makes voting feel slow. Users expect instant feedback. Always use optimistic updates with rollback on failure.
          </li>
          <li>
            <strong>Score cache drift:</strong> Redis scores diverging from database totals over time. Implement periodic reconciliation that compares and corrects cache against database.
          </li>
          <li>
            <strong>Bandwagon voting:</strong> Early votes disproportionately influencing later voters. Consider hiding scores during grace period or using vote fuzzing to reduce exact score visibility.
          </li>
          <li>
            <strong>No rate limiting:</strong> Allowing unlimited votes enables manipulation through mass voting. Implement rate limits at API layer with clear user messaging.
          </li>
          <li>
            <strong>Poor mobile experience:</strong> Vote buttons too small or too close together causing mis-taps. Ensure 44px minimum touch targets with adequate spacing between upvote and downvote buttons.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Reddit Voting System</h3>
        <p>
          Reddit pioneered modern upvote/downvote for content ranking. Votes determine post visibility through hot algorithm combining score and time decay. Reddit implements vote fuzzing to prevent exact score tracking. Karma thresholds restrict voting in new subreddits to prevent brigading. The platform handles billions of votes monthly with sharded Redis counters and async database persistence.
        </p>

        <h3 className="mt-6">Stack Overflow Reputation</h3>
        <p>
          Stack Overflow uses upvote/downvote with reputation weighting. Upvotes on answers give +10 reputation, downvotes cost -2 reputation to the answerer. Downvoting costs the voter -1 reputation to discourage casual downvoting. Minimum 125 reputation required to downvote, ensuring voters understand community standards. Wilson score sorts answers by quality confidence.
        </p>

        <h3 className="mt-6">Hacker News Minimalism</h3>
        <p>
          Hacker News uses upvote-only (no downvote) with simple ranking algorithm. Score divided by (time + 2) raised to gravity power (1.8) determines ranking. This allows new content to surface with fewer votes while established content needs continuous engagement. The platform implements strict rate limiting and karma thresholds to reduce manipulation.
        </p>

        <h3 className="mt-6">YouTube Like/Dislike Evolution</h3>
        <p>
          YouTube previously showed public like and dislike counts, then hid dislike counts in 2021 to reduce dislike brigading while keeping them visible to creators. This balances creator feedback with reduced harassment. The platform uses like/dislike ratio as one signal among many for video ranking, not the primary factor.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate hot ranking?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Hot ranking combines vote score with time decay. Reddit's algorithm uses: score = log10(upvotes - downvotes) + (seconds_since_epoch - post_timestamp) / 45000. The logarithmic scale means the difference between 10 and 100 votes matters more than 1010 and 1100 votes. The time term (divided by gravity constant 45000) allows newer posts to rank higher with fewer votes. Adjust gravity based on community engagement patterns—higher gravity for fast-moving communities.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent vote manipulation?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Implement multiple defense layers. Account age requirement (24 hours minimum) prevents throwaway manipulation. Karma thresholds require users to earn voting privileges. Rate limiting (100-200 votes/hour) prevents mass voting. IP and device fingerprinting detects vote rings. Machine learning models identify suspicious voting patterns like coordinated timing or unusual vote sequences. Exclude suspected manipulation votes from score calculation while preserving them for investigation.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle vote state management?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track vote state per content item as enum (none, up, down). On vote action, calculate score delta: none→up = +1, up→none = -1, down→up = +2, etc. Update UI optimistically with delta applied. Send API request with idempotency key. On success, clear pending state. On failure, revert UI to previous state and show error with retry option. Queue rapid successive clicks and process sequentially after API completes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement Wilson score?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Wilson score confidence interval formula: (p̂ + z²/2n - z√(p̂(1-p̂)/n + z²/4n²)) / (1 + z²/n) where p̂ = upvotes/total_votes, n = total_votes, z = 1.96 for 95% confidence. Sort by the lower bound of the confidence interval. This accounts for uncertainty with small sample sizes—a post with 1 upvote out of 1 ranks below 99 upvotes out of 100 because we have less confidence in the 1/1 post's true quality. Cache Wilson scores and recalculate on vote changes.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you scale vote counting?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use Redis for real-time vote counting with atomic INCRBY operations. Shard counters by content_id hash for viral content—split across 10-100 Redis keys and sum for total. Async flush to database every few minutes for durability. Accept eventual consistency for vote counts—slight delays are acceptable. For extreme scale, use HyperLogLog for approximate unique voter counts with 99% accuracy at 10x scale improvement.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle controversial content?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Controversial sorting ranks by upvotes × downvotes / total_votes. This surfaces content with high engagement on both sides—content people strongly agree AND disagree with. Show controversial tab separately from top/hot to let users choose whether to see divisive content. Consider adding content warnings for highly controversial posts. Track controversy ratio (downvotes/upvotes) to identify content that may need moderation review.
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
              Reddit Blog — Ranking Algorithm Articles
            </a>
          </li>
          <li>
            <a
              href="https://stackoverflow.blog/2010/09/15/the-science-behind-voting-systems/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stack Overflow Blog — Science Behind Voting Systems
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C ARIA — Accessible UI Patterns
            </a>
          </li>
          <li>
            <a
              href="https://www.evanmiller.org/how-not-to-sort-by-average-rating.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Evan Miller — How Not to Sort by Average Rating (Wilson Score)
            </a>
          </li>
          <li>
            <a
              href="https://github.com/HackerNews/API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hacker News API — Ranking Documentation
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
