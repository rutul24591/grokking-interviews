"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-functional-user-blocking",
  title: "User Blocking",
  description:
    "Comprehensive guide to implementing user blocking systems covering block/unblock workflows, block list management, blocked user experience, block evasion prevention, and integration with moderation systems for user safety and harassment prevention.",
  category: "functional-requirements",
  subcategory: "other-cross-cutting-functional-requirements",
  slug: "user-blocking",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "cross-cutting",
    "user-blocking",
    "user-safety",
    "harassment-prevention",
    "trust-safety",
  ],
  relatedTopics: ["user-muting", "abuse-reporting", "privacy-controls-ui", "content-moderation-service"],
};

export default function UserBlockingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          User blocking enables users to prevent unwanted interactions from other users by blocking specific accounts. The blocking system is a critical user safety mechanism that empowers users to control their experience, prevent harassment, and protect their mental health. For staff and principal engineers, user blocking implementation involves block/unblock workflows (easy blocking, reversible unblocking), block list management (view, edit, export blocked users), blocked user experience (what blocked users see, notification policies), block evasion prevention (detecting blocked users creating new accounts), and integration with moderation systems (blocks inform abuse patterns, escalate repeat blockers).
        </p>
        <p>
          The complexity of user blocking extends beyond simple &quot;block user&quot; buttons. Block enforcement must be comprehensive across all interaction types (messages, comments, mentions, follows, tags, reactions). Blocked user experience must balance transparency (blocked users should know they&apos;re blocked to prevent continued harassment attempts) with reporter safety (not revealing who blocked them in sensitive situations). Block evasion prevention must detect when blocked users create new accounts to continue harassment (device fingerprinting, behavior patterns, network analysis). The system must handle edge cases (mutual connections, group conversations, public replies) while maintaining block effectiveness.
        </p>
        <p>
          For staff and principal engineers, user blocking architecture involves user-facing components (block dialogs, block list management), backend enforcement (block checking at all interaction points), notification systems (block/unblock events, blocked user notifications), and safety integration (block patterns inform abuse detection, escalate repeat offenders). The system must handle high scale (popular platforms have billions of block relationships), provide instant enforcement (blocks must work immediately), and maintain user trust (blocks must be reliable, comprehensive, and respected across the platform). Privacy is critical—block lists are sensitive data requiring protection.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Block/Unblock Workflows</h3>
        <p>
          Block entry points provide multiple ways to block users. Profile blocking (block from user profile page). Content blocking (block user from their post/comment). Message blocking (block user from conversation). Search blocking (block user from search results). Each entry point should be accessible (1-2 clicks maximum), clear (confirm block action), and reversible (easy to unblock if mistake). Block confirmation dialogs prevent accidental blocks while not creating too much friction.
        </p>
        <p>
          Block confirmation ensures users understand consequences. Confirmation dialogs explain what blocking does (user can&apos;t contact you, see your content, follow you) and doesn&apos;t do (doesn&apos;t delete past conversations, doesn&apos;t notify blocked user immediately). Reversible option (unblock within 24 hours without confirmation) for accidental blocks. Permanent block option (requires confirmation to unblock) for intentional harassment cases.
        </p>
        <p>
          Unblock workflows enable reversing blocks. Unblock from block list (view all blocked users, unblock individually). Confirm unblock (ensure user wants to unblock, explain consequences). Cool-down periods (wait 24 hours before re-blocking same user to prevent block/unblock harassment). Unblock history (track when users were blocked/unblocked for abuse pattern detection).
        </p>

        <h3 className="mt-6">Block List Management</h3>
        <p>
          Block list viewing enables users to see who they&apos;ve blocked. Complete block list (all blocked users with block date). Search within block list (find specific blocked user). Sort options (by block date, alphabetically, by interaction frequency). Block count display (total number of blocked users). Block list should be easily accessible from privacy/safety settings.
        </p>
        <p>
          Block list editing enables managing blocked users. Bulk unblock (unblock multiple users at once). Import/export block lists (backup blocks, transfer between accounts). Block notes (add private notes about why user was blocked). Block categories (organize blocks by reason: harassment, spam, ex-partner, etc.). Block list management should be intuitive with clear confirmation for destructive actions.
        </p>
        <p>
          Block list synchronization ensures blocks work across platforms. Cross-platform blocking (block on web applies to mobile, API, all surfaces). Cross-product blocking (block on main platform applies to related products). Sync latency (blocks should propagate within seconds). Conflict resolution (what happens if block list conflicts across devices). Synchronization is critical for block effectiveness—blocked users shouldn&apos;t be able to interact via different platform.
        </p>

        <h3 className="mt-6">Blocked User Experience</h3>
        <p>
          Blocked user visibility determines what blocked users see. Content invisibility (blocked users can&apos;t see blocker&apos;s posts, profile, activity). Message blocking (blocked users can&apos;t send messages, messages silently dropped). Mention blocking (blocked users can&apos;t mention or tag blocker). Follow blocking (blocked users can&apos;t follow blocker, automatically unfollowed). Comprehensive blocking prevents all interaction vectors.
        </p>
        <p>
          Block notification policies balance transparency with safety. Silent blocking (blocked user not notified, interactions just fail). Soft notification (blocked user sees generic &quot;this content is unavailable&quot;). Hard notification (blocked user told they&apos;re blocked). Safety-based blocking (domestic violence situations require silent blocking to prevent escalation). Notification policy should be configurable based on safety needs.
        </p>
        <p>
          Edge case handling addresses complex scenarios. Mutual connections (what happens in group chats, mutual friend posts). Past content (what happens to existing conversations, comments on each other&apos;s content). Public replies (can blocked user reply to blocker&apos;s public posts). Shared spaces (what happens in shared groups, events, communities). Edge cases require careful design to maintain block effectiveness while not breaking platform functionality.
        </p>

        <h3 className="mt-6">Block Evasion Prevention</h3>
        <p>
          Evasion detection identifies when blocked users create new accounts. Device fingerprinting (detect same device creating new account). Behavior pattern analysis (new account exhibits same harassment patterns). Network analysis (new account connected to blocked user&apos;s network). IP address correlation (same IP creating multiple accounts). Evasion detection enables proactive response to block circumvention.
        </p>
        <p>
          Evasion prevention stops blocked users from circumventing blocks. Automatic blocking of evasion accounts (new accounts from same device automatically blocked). Account verification requirements (phone verification for accounts that appear to be evasion). Rate limiting (limit actions from suspected evasion accounts). Escalation to safety team (severe evasion cases reviewed by specialists). Prevention protects users from persistent harassers.
        </p>
        <p>
          Evasion response handles detected evasion attempts. Warning notifications (inform user that evasion detected). Account restrictions (limit functionality of evasion accounts). Account suspension (suspend accounts created to evade blocks). Legal action (severe cases may warrant legal consequences). Response should be proportional to evasion severity while protecting users from continued harassment.
        </p>

        <h3 className="mt-6">Integration with Moderation Systems</h3>
        <p>
          Block data informs abuse detection. Block patterns (users who are blocked by many people may be abusers). Block clustering (coordinated blocking indicates organized harassment). Block escalation (users who continue harassing after being blocked). Block data feeds into trust/safety scoring for users. Block patterns help identify bad actors before they violate policies.
        </p>
        <p>
          Moderation integration connects blocking with enforcement. Automatic reporting (blocks from multiple users trigger review). Escalation paths (users who evade blocks escalated to safety team). Policy enforcement (block evasion may violate terms of service). Evidence preservation (block history preserved for harassment investigations). Integration ensures blocking is part of comprehensive safety strategy.
        </p>
        <p>
          Safety team tools enable specialist intervention. Block history review (safety team can see block patterns). Evasion investigation (tools to investigate block evasion networks). Protective measures (enhanced protection for users experiencing severe harassment). Cross-platform coordination (coordinate blocks across related platforms). Safety team integration ensures severe cases receive appropriate attention.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          User blocking architecture spans block management, block enforcement, evasion prevention, and moderation integration. Block management provides user-facing interfaces for blocking. Block enforcement ensures blocks are respected across all interaction points. Evasion prevention detects and prevents block circumvention. Moderation integration connects blocking with broader safety systems.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/user-blocking/user-blocking-architecture.svg"
          alt="User Blocking Architecture"
          caption="Figure 1: User Blocking Architecture — Block management, enforcement, evasion prevention, and moderation integration"
          width={1000}
          height={500}
        />

        <h3>Block Management Layer</h3>
        <p>
          Block management layer provides user-facing interfaces. Block dialogs embedded in profiles, content, conversations. Block list management UI for viewing and editing blocked users. Block settings for configuring block behavior (notification preferences, edge case handling). Block import/export for backup and transfer. Management layer should be intuitive, accessible, and provide clear feedback about block status.
        </p>
        <p>
          Block storage persists block relationships. Block database stores blocker ID, blocked user ID, block date, block reason, block category. Index optimization for fast block lookups (critical for enforcement). Privacy protection (block lists encrypted, limited access). Retention policies (how long blocks persist, block expiration options). Storage must be reliable—lost blocks mean failed user protection.
        </p>
        <p>
          Block synchronization ensures consistency across platforms. Sync service propagates blocks to all surfaces (web, mobile, API, third-party clients). Conflict resolution handles simultaneous block/unblock from different devices. Sync latency monitoring ensures blocks propagate quickly. Sync verification confirms blocks applied correctly across all surfaces. Synchronization is critical for block effectiveness.
        </p>

        <h3 className="mt-6">Block Enforcement Layer</h3>
        <p>
          Block enforcement checks blocks at all interaction points. Message blocking (prevent messages from blocked users). Comment blocking (hide comments from blocked users). Mention blocking (prevent mentions from blocked users). Follow blocking (prevent follows from blocked users). Enforcement happens at API layer for comprehensive coverage. All interaction points must check blocks before allowing action.
        </p>
        <p>
          Real-time enforcement ensures blocks work immediately. Block cache for fast lookups (avoid database query on every interaction). Cache invalidation when blocks change (unblock must take effect immediately). Fallback handling when cache unavailable (query database directly). Performance monitoring to ensure enforcement doesn&apos;t slow down platform. Real-time enforcement is critical for user safety.
        </p>
        <p>
          Edge case handling addresses complex scenarios. Group conversation handling (what happens when blocked users in same group). Mutual connection handling (shared friends, followers). Public content handling (replies to public posts). Historical content handling (existing conversations, comments). Edge cases require careful design to maintain block effectiveness without breaking platform functionality.
        </p>

        <h3 className="mt-6">Evasion Prevention Layer</h3>
        <p>
          Evasion detection identifies block circumvention attempts. Device fingerprinting service (detect same device creating new accounts). Behavior analysis (identify harassment patterns from new accounts). Network analysis (detect connections to blocked users). IP correlation (identify multiple accounts from same IP). Detection happens during account creation and ongoing activity monitoring.
        </p>
        <p>
          Evasion prevention stops detected evasion attempts. Automatic blocking (new accounts from blocked devices automatically blocked). Verification requirements (phone verification for suspected evasion accounts). Rate limiting (limit actions from suspected evasion accounts). Feature restrictions (limit functionality of evasion accounts). Prevention protects users from persistent harassers who try to circumvent blocks.
        </p>
        <p>
          Evasion response handles severe evasion cases. Warning system (notify users that evasion detected). Account suspension (suspend accounts created to evade blocks). Safety team escalation (severe cases reviewed by specialists). Legal action (extreme cases may warrant legal consequences). Response should be proportional while protecting users from continued harassment.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/user-blocking/block-enforcement-flow.svg"
          alt="Block Enforcement Flow"
          caption="Figure 2: Block Enforcement Flow — Block check at all interaction points"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Moderation Integration Layer</h3>
        <p>
          Block data integration feeds safety systems. Block pattern analysis (users blocked by many people flagged for review). Block clustering detection (coordinated blocking indicates organized harassment). Block escalation tracking (users who continue after being blocked). Block data feeds trust/safety scoring. Integration enables proactive safety measures before policy violations.
        </p>
        <p>
          Safety team tools enable specialist intervention. Block history review (safety team sees block patterns for investigations). Evasion investigation tools (tools to investigate block evasion networks). Protective measures (enhanced protection for users experiencing severe harassment). Cross-platform coordination (coordinate blocks across related platforms). Safety team integration ensures severe cases receive appropriate attention.
        </p>
        <p>
          Automated moderation integration connects blocks with enforcement. Automatic reporting (blocks from multiple users trigger review). Policy enforcement (block evasion may violate terms of service). Evidence preservation (block history preserved for investigations). Escalation workflows (severe cases escalated automatically). Integration ensures blocking is part of comprehensive safety strategy.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/user-blocking/evasion-prevention.svg"
          alt="Block Evasion Prevention"
          caption="Figure 3: Block Evasion Prevention — Detection, prevention, and response"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          User blocking design involves trade-offs between comprehensiveness and usability, transparency and safety, and strictness and flexibility. Understanding these trade-offs enables informed decisions aligned with platform values and safety requirements.
        </p>

        <h3>Block Notification: Silent vs. Explicit</h3>
        <p>
          Silent blocking (blocked user not notified). Pros: Protects blocker safety (no escalation risk), prevents harassment continuation, essential for domestic violence situations. Cons: Blocked user doesn&apos;t know why interactions failing, may continue attempts, can&apos;t adjust behavior. Best for: Safety-critical situations, harassment cases, platforms prioritizing blocker safety.
        </p>
        <p>
          Explicit notification (blocked user told they&apos;re blocked). Pros: Clear communication (blocked user knows status), prevents continued attempts, enables behavior adjustment. Cons: Safety risk (may escalate harassment), reveals blocker identity, may enable retaliation. Best for: Low-risk situations, professional networks, platforms prioritizing transparency.
        </p>
        <p>
          Hybrid: configurable notification based on situation. Pros: Best of both (safety for high-risk, transparency for low-risk). Cons: Complexity (two notification paths), requires risk assessment. Best for: Most platforms—default to silent for safety, allow explicit for low-risk situations.
        </p>

        <h3>Block Scope: Comprehensive vs. Limited</h3>
        <p>
          Comprehensive blocking (blocks all interaction types). Pros: Complete protection (no interaction vectors missed), simple mental model (blocked = no contact), effective against harassment. Cons: May break platform functionality (group chats, shared spaces), may be too restrictive for some use cases. Best for: Safety-focused platforms, harassment prevention.
        </p>
        <p>
          Limited blocking (blocks specific interaction types). Pros: Flexible (users choose what to block), preserves platform functionality, less disruptive. Cons: Complex mental model (what&apos;s blocked?), may miss interaction vectors, less effective against determined harassers. Best for: Professional networks, platforms prioritizing connectivity.
        </p>
        <p>
          Hybrid: comprehensive default with granular controls. Pros: Best of both (complete protection by default, flexibility for specific needs). Cons: Complexity (two control layers), may confuse users. Best for: Most platforms—comprehensive by default, granular for power users.
        </p>

        <h3>Evasion Prevention: Aggressive vs. Conservative</h3>
        <p>
          Aggressive prevention (block any suspected evasion). Pros: Strong protection (hard to evade blocks), sends clear message (evasion not tolerated), protects users effectively. Cons: False positives (legitimate users blocked), privacy concerns (extensive tracking), may discourage platform use. Best for: High-harassment platforms, safety-critical situations.
        </p>
        <p>
          Conservative prevention (only block confirmed evasion). Pros: Low false positives (legitimate users not affected), privacy-respecting (minimal tracking), user-friendly. Cons: Easier to evade (determined harassers find ways), less protection for users, may enable continued harassment. Best for: Low-harassment platforms, privacy-focused platforms.
        </p>
        <p>
          Hybrid: tiered response based on confidence. Pros: Best of both (strong protection for high-confidence, minimal impact for low-confidence). Cons: Complexity (multiple tiers), requires confidence scoring. Best for: Most platforms—aggressive for high-confidence evasion, conservative for low-confidence.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/user-blocking/blocking-approaches.svg"
          alt="Blocking Approaches Comparison"
          caption="Figure 4: Blocking Approaches Comparison — Notification, scope, and evasion prevention"
          width={1000}
          height={450}
        />

        <h3>Block Duration: Permanent vs. Temporary</h3>
        <p>
          Permanent blocking (blocks last until manually undone). Pros: Clear commitment (block is serious action), protects long-term, simple mental model. Cons: No cooling off (can&apos;t temporarily block), may be too harsh for minor issues, blocks accumulate over time. Best for: Harassment prevention, safety-focused platforms.
        </p>
        <p>
          Temporary blocking (blocks expire after set time). Pros: Cooling off period (temporary conflicts resolve), blocks don&apos;t accumulate indefinitely, less commitment required. Cons: Harassers can wait out block, less protection for users, requires renewal for ongoing issues. Best for: Minor conflicts, community-focused platforms.
        </p>
        <p>
          Hybrid: permanent default with temporary option. Pros: Best of both (permanent for serious cases, temporary for minor). Cons: Complexity (two block types), may confuse users about which to use. Best for: Most platforms—permanent by default, temporary option for minor conflicts.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Make blocking easy and accessible:</strong> Block buttons on profiles, content, conversations. 1-2 clicks maximum. Clear confirmation without excessive friction. Accessible from all surfaces.
          </li>
          <li>
            <strong>Enforce blocks comprehensively:</strong> Block all interaction types (messages, comments, mentions, follows). Check blocks at API layer for complete coverage. Real-time enforcement with fast lookups.
          </li>
          <li>
            <strong>Provide clear block list management:</strong> View all blocked users. Search and sort block list. Bulk unblock capability. Import/export for backup. Easy access from settings.
          </li>
          <li>
            <strong>Handle edge cases carefully:</strong> Group conversations, mutual connections, public replies. Design for complex scenarios without breaking block effectiveness. Document edge case behavior clearly.
          </li>
          <li>
            <strong>Implement evasion prevention:</strong> Device fingerprinting, behavior analysis, network detection. Automatic blocking of evasion accounts. Verification requirements for suspected evasion.
          </li>
          <li>
            <strong>Support safety-critical blocking:</strong> Silent blocking option for domestic violence. Enhanced protection for severe harassment. Safety team escalation for extreme cases.
          </li>
          <li>
            <strong>Sync blocks across platforms:</strong> Blocks apply to web, mobile, API, all surfaces. Fast propagation (seconds, not minutes). Verify sync completion.
          </li>
          <li>
            <strong>Integrate with moderation systems:</strong> Block patterns inform abuse detection. Automatic reporting for multiple blocks. Safety team tools for severe cases.
          </li>
          <li>
            <strong>Protect block list privacy:</strong> Encrypt block lists. Limit access to block data. Don&apos;t reveal who blocked whom unnecessarily. Privacy-preserving block synchronization.
          </li>
          <li>
            <strong>Provide unblock options:</strong> Easy unblock from block list. Confirm unblock to prevent mistakes. Cool-down periods to prevent block/unblock harassment.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Incomplete block enforcement:</strong> Blocks work for messages but not comments. Solution: Audit all interaction points, enforce at API layer, comprehensive testing.
          </li>
          <li>
            <strong>Slow block propagation:</strong> Blocks take minutes to apply across platforms. Solution: Optimize sync latency, cache blocks for fast lookups, monitor sync health.
          </li>
          <li>
            <strong>No evasion prevention:</strong> Blocked users create new accounts to continue harassment. Solution: Device fingerprinting, behavior analysis, automatic blocking of evasion accounts.
          </li>
          <li>
            <strong>Poor edge case handling:</strong> Blocks break group chats, shared spaces. Solution: Design edge cases carefully, maintain block effectiveness while preserving functionality.
          </li>
          <li>
            <strong>No block list management:</strong> Users can&apos;t see or manage blocked users. Solution: Provide block list view, search, bulk unblock, import/export.
          </li>
          <li>
            <strong>Unsafe notification policies:</strong> Always notifying blocked users creates safety risks. Solution: Silent blocking option, configurable notifications based on safety needs.
          </li>
          <li>
            <strong>No moderation integration:</strong> Blocks siloed from safety systems. Solution: Feed block data to abuse detection, automatic reporting, safety team tools.
          </li>
          <li>
            <strong>Poor block list privacy:</strong> Block lists exposed or accessible. Solution: Encrypt block lists, limit access, privacy-preserving synchronization.
          </li>
          <li>
            <strong>No unblock options:</strong> Can&apos;t unblock or unblocking is difficult. Solution: Easy unblock from block list, confirm to prevent mistakes, cool-down periods.
          </li>
          <li>
            <strong>No safety team escalation:</strong> Severe harassment cases not escalated. Solution: Safety team tools, escalation workflows, enhanced protection for severe cases.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Twitter User Blocking</h3>
        <p>
          Twitter blocking for harassment prevention. Block from profile, tweet, conversation. Comprehensive blocking (can&apos;t follow, mention, message, see tweets). Silent blocking option (blocked user not notified). Block list management from privacy settings. Block evasion detection (new accounts from same device). Integration with abuse reporting (blocked users who evade reported).
        </p>

        <h3 className="mt-6">Facebook User Blocking</h3>
        <p>
          Facebook blocking for comprehensive safety. Block users, pages, apps. Blocking prevents all interaction (messages, tags, invites, game requests). Block list management with categories. Messenger blocking separate from main blocking. Block evasion prevention. Integration with harassment reporting. Enhanced protection for domestic violence situations.
        </p>

        <h3 className="mt-6">Instagram User Blocking</h3>
        <p>
          Instagram blocking for creator safety. Block from profile, comments, DMs. Blocked users can&apos;t see posts, stories, reels. Block list management. Restrict option (limited blocking for subtle protection). Block evasion detection. Integration with comment filtering. Enhanced tools for high-profile accounts.
        </p>

        <h3 className="mt-6">Discord User Blocking</h3>
        <p>
          Discord blocking for community safety. Block users from sending DMs. Blocked users can&apos;t see online status. Server-specific blocking options. Block list management. Integration with server moderation. Block evasion through alt account detection. Safety team escalation for severe harassment.
        </p>

        <h3 className="mt-6">LinkedIn User Blocking</h3>
        <p>
          LinkedIn blocking for professional safety. Block from messaging, profile viewing, connection requests. Blocked users can&apos;t see profile updates. Block list management. Professional context (blocking may affect professional relationships). Quiet blocking (minimal notification). Integration with harassment reporting.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure blocks are enforced comprehensively across all interaction points?</p>
            <p className="mt-2 text-sm">
              Implement block enforcement at API layer, not just UI, because UI enforcement can be bypassed but API enforcement catches all access patterns. Every interaction endpoint must check block status before allowing action—messages endpoint checks &quot;is sender blocked by recipient?&quot;, comments endpoint checks &quot;is commenter blocked by content owner?&quot;, mentions endpoint checks &quot;is mentioning user blocked by mentioned user?&quot;, follows endpoint checks &quot;is follower blocked by followee?&quot;. Build block cache for fast lookups—avoid database query on every interaction by caching user&apos;s block list with TTL (5-15 minutes), check cache first before database. Implement cache invalidation when blocks change—when user blocks or unblocks someone, invalidate cache immediately so changes take effect within seconds, not minutes. Conduct comprehensive audit of all interaction points—map every API endpoint that enables user-to-user interaction, ensure each has block check, test each endpoint with blocked users to verify enforcement. The key insight: blocks must be enforced at the lowest common layer—if you enforce only in UI, API calls bypass blocks; if you enforce only in some API endpoints, others bypass blocks. Defense in depth ensures blocks work regardless of how interaction is attempted.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle block evasion when blocked users create new accounts?</p>
            <p className="mt-2 text-sm">
              Implement multi-layer evasion detection because determined harassers will create new accounts to continue harassment, and single-layer detection is easily bypassed. Device fingerprinting: collect device signals (device type, OS version, browser fingerprint, IP address patterns, timezone) to detect when same device creates new account—flag for review when blocked user&apos;s device creates new account. Behavior pattern analysis: new accounts that exhibit same harassment patterns as blocked user (same targets, same language, same timing) are likely evasion—use ML to detect pattern similarity. Network analysis: new accounts connected to blocked user&apos;s network (same phone number, same recovery email, same payment method, follows same users immediately) are likely evasion. IP correlation: multiple accounts from same IP address in short timeframe, especially if previous account was blocked for harassment. Automatic blocking: when evasion detected with high confidence, automatically apply same blocks to new account—user doesn&apos;t need to re-block. Verification requirements: require phone verification, email verification, or CAPTCHA for suspected evasion accounts—raises cost of creating evasion accounts. The operational challenge: balancing evasion prevention with false positive risk—legitimate users sharing device (family computer, internet cafe) shouldn&apos;t be blocked for evasion they didn&apos;t commit. Use confidence thresholds, allow appeals, and continuously tune detection based on false positive rate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you balance block transparency with blocker safety?</p>
            <p className="mt-2 text-sm">
              Implement configurable notification policies that prioritize blocker safety while providing appropriate transparency. Silent blocking (blocked user not notified they&apos;re blocked): default for safety-critical situations like domestic violence, stalking, severe harassment—blocked user sees messages not delivered (not &quot;you&apos;re blocked&quot;), can&apos;t tell if they&apos;re blocked or user is inactive. This prevents escalation—abusers who discover they&apos;re blocked may escalate harassment through other channels. Explicit notification (blocked user told they&apos;re blocked): for low-risk situations like spam, casual disagreements, professional boundaries—blocked user sees &quot;You&apos;re blocked by this user&quot; when trying to interact. Allow users to choose: provide option during block flow (&quot;Notify this user they&apos;re blocked? Yes/No&quot;) with clear explanation of implications. Default to silent for safety—better for blocked user to be confused than for blocker to face escalation. Provide safety resources: for users blocking for safety reasons, provide links to safety planning, domestic violence resources, law enforcement guidance. Enhanced protection: for users in high-risk situations, offer additional protections (account lockdown, enhanced monitoring, dedicated safety team contact). The critical insight: safety must come first—transparency is secondary. Design notification policies around blocker safety, not blocked user curiosity. Provide options for low-risk situations, but default to protective silence for high-risk scenarios.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle edge cases like group conversations and mutual connections?</p>
            <p className="mt-2 text-sm">
              Design edge cases to maintain block effectiveness while preserving platform functionality, because poorly designed edge cases can completely undermine blocking. Group conversations: blocked users can&apos;t message each other even in groups—when blocked user joins group, either blocker is automatically removed from group, or blocked user is prevented from seeing blocker&apos;s messages (messages hidden for blocked user). Alternative: prevent blocked users from joining same groups without explicit consent from both. Mutual connections: blocked users can&apos;t see each other&apos;s comments on mutual friend posts—when blocked user views mutual friend&apos;s post, filter out blocker&apos;s comments (and vice versa). This prevents indirect harassment through mutual connections. Public replies: blocked users can&apos;t reply to blocker&apos;s public posts—reply button disabled or returns error. Blocked user can see public post but can&apos;t interact with it. Shared workspaces: for productivity platforms, blocked users can&apos;t collaborate on same documents—either automatic reassignment or access restrictions. Event invitations: blocked users can&apos;t invite blocker to events, can&apos;t see blocker&apos;s events. The key principle: block effectiveness comes first—if edge case breaks block (e.g., blocked users can harass each other in group chat), redesign edge case. Document edge case behavior clearly so users understand what blocking does and doesn&apos;t cover—&quot;Blocking prevents direct messages, but you may still see each other&apos;s comments in public groups.&quot;
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you integrate blocking with broader moderation and safety systems?</p>
            <p className="mt-2 text-sm">
              Feed block data into safety systems for proactive protection because blocking is a strong signal of harmful behavior that should inform broader safety efforts. Block pattern analysis: track users who are blocked by many people—user blocked by 50+ people in a month is likely engaging in widespread harassment, flag for review, consider suspension. Block clustering detection: detect when multiple users block same person in coordinated manner—indicates organized harassment campaign, trigger investigation. Automatic reporting: when user is blocked by multiple people (e.g., 10+ blocks in a week), automatically create safety ticket for review—don&apos;t wait for explicit reports. Safety team tools: provide safety team with block history (who blocked this user, when, any accompanying reports), evasion investigation tools (detect new accounts created after blocking), pattern analysis (is this user part of harassment network). Policy enforcement: block evasion may violate terms of service—when blocked user creates new account to continue harassment, that&apos;s policy violation warranting suspension. Cross-platform intelligence: for platforms with multiple products, share block data—user blocked on main app should be blocked on beta app, web, mobile. The operational insight: blocking isn&apos;t isolated safety feature—it&apos;s part of comprehensive safety strategy. Block data informs abuse detection algorithms, enables proactive intervention before severe harm, protects users at scale by identifying repeat offenders, and provides evidence for enforcement actions. Integrate blocking data with reporting data, content moderation data, and account integrity data for holistic safety picture.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure block synchronization works reliably across all platforms?</p>
            <p className="mt-2 text-sm">
              Implement robust synchronization architecture because blocks must work everywhere immediately—a block that only works on web but not mobile is a failed block that puts users at risk. Central block store: maintain single source of truth for all blocks in centralized database—web, mobile apps, API, third-party integrations all query same block store. No local-only blocks that don&apos;t sync. Sync service: implement event-driven sync that propagates blocks to all surfaces within seconds—when user blocks someone, publish &quot;block_created&quot; event, all surfaces subscribe and update local caches. Fast propagation: target &lt;5 seconds for block to apply across all platforms—use push notifications to mobile apps for immediate cache invalidation, WebSocket for web clients. Sync verification: confirm blocks applied correctly—after sync, query each surface to verify block is active, alert if any surface missed sync. Fallback handling: if sync fails or local cache is stale, query central block store as fallback—slower but ensures correctness. Monitoring: track sync latency (time from block creation to applied on all surfaces), detect sync failures (surfaces that haven&apos;t received sync in &gt;1 minute), alert on anomalies. The critical requirement: blocks must work everywhere, immediately—users trust that blocking protects them, and broken sync betrays that trust. Test sync thoroughly (all platform combinations), monitor continuously, and fix sync issues as highest priority because user safety depends on it.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://help.twitter.com/en/safety-and-security/how-to-block-and-unblock-accounts"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter Safety — Blocking and Unblocking
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/help/169666696436038"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook Help — Blocking People
            </a>
          </li>
          <li>
            <a
              href="https://help.instagram.com/137371516345379"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram Help — Blocking Users
            </a>
          </li>
          <li>
            <a
              href="https://www.womenslaw.org/about-abuse/safety-planning/online-safety-planning"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WomensLaw.org — Online Safety Planning
            </a>
          </li>
          <li>
            <a
              href="https://www.cybercivilrights.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cyber Civil Rights Initiative — Online Harassment Resources
            </a>
          </li>
          <li>
            <a
              href="https://www.adl.org/resources/tools-and-resources/online-harassment-and-abuse"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ADL — Online Harassment and Abuse Resources
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
