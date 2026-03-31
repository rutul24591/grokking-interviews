"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-presence-indicators",
  title: "Presence Indicators",
  description:
    "Comprehensive guide to implementing presence indicators covering online/offline status, typing indicators, last seen timestamps, real-time synchronization, privacy controls, and scaling strategies for high-volume presence systems.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "presence-indicators",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "presence",
    "real-time",
    "frontend",
    "websocket",
    "status",
  ],
  relatedTopics: ["websocket-server", "chat-interface", "real-time-systems", "privacy-controls"],
};

export default function PresenceIndicatorsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Presence indicators show user availability and activity status, enabling real-time awareness in communication features. Online/offline status tells users if someone is available for conversation. Typing indicators show when someone is composing a message. Last seen timestamps indicate when a user was last active. These indicators reduce communication friction—users know when to expect immediate responses versus delayed replies.
        </p>
        <p>
          The technical complexity of presence systems is often underestimated. Presence must update in real-time across all connected clients. Status must accurately reflect user activity—online when active, offline after timeout. Privacy controls allow users to hide their presence while still seeing others (with reciprocal restrictions). The system must scale to millions of users with frequent status changes while maintaining low latency. Network issues, app backgrounding, and device sleep complicate accurate presence detection.
        </p>
        <p>
          For staff and principal engineers, presence indicator implementation involves distributed systems challenges. WebSocket connections track connected users, but connections can drop without proper disconnect events. Heartbeat mechanisms detect stale connections. Presence state must sync across a user's multiple devices (phone, tablet, desktop). Privacy evaluation happens on every presence query. The architecture must handle presence storms—thousands of users coming online simultaneously after an outage.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Presence States</h3>
        <p>
          Online state indicates user is actively using the app. Determined by: active WebSocket connection, recent heartbeat (within 30 seconds), app in foreground. Display: green dot, "Online" label. Some apps show "Active now" for very recent activity (within 1 minute).
        </p>
        <p>
          Away state indicates user is connected but not actively engaged. Determined by: connection active but no interaction for 2-5 minutes, app in background. Display: yellow/orange dot, "Away" label. Some apps skip away state, go directly from online to offline.
        </p>
        <p>
          Offline state indicates user is not available. Determined by: no active connection, heartbeat timeout (30-60 seconds), app closed. Display: gray dot, "Offline" or "Last seen X time ago". Last seen timestamp calculated from last heartbeat time.
        </p>
        <p>
          Custom states allow users to set availability manually. "Do Not Disturb" suppresses notifications but shows online. "Busy" indicates limited availability. "Invisible" shows offline while actually online (privacy feature). Custom states override automatic detection.
        </p>

        <h3 className="mt-6">Typing Indicators</h3>
        <p>
          Typing detection triggers on text input. Mobile: text field focus + keystrokes. Desktop: input field focus + keydown events. Debounce to avoid flickering—show typing after 500ms of typing, hide after 2 seconds of inactivity.
        </p>
        <p>
          Typing event transmission via WebSocket. Send typing_start on first keystroke, typing_stop on send or timeout. Include conversation_id for group chats. Rate limit typing events—max 1 per 2 seconds to prevent flooding.
        </p>
        <p>
          Typing display shows "User is typing..." or animated dots (three bouncing dots). Group chats show "User1 and User2 are typing..." or "3 people are typing...". Hide typing indicator when recipient scrolls away from input (not viewing conversation).
        </p>

        <h3 className="mt-6">Last Seen Timestamps</h3>
        <p>
          Last seen calculation uses last heartbeat timestamp. When user goes offline, store last_active timestamp. Display relative time: "Last seen 5m ago", "Last seen 2h ago", "Last seen yesterday". Absolute time for older: "Last seen Mar 25 at 2:30 PM".
        </p>
        <p>
          Privacy controls for last seen. Options: Everyone (default), Contacts only, Nobody. Reciprocal privacy—if you hide last seen, you can't see others'. Last seen updates on disconnect, not continuously (privacy and performance).
        </p>
        <p>
          Accuracy considerations: last seen reflects last server contact, not necessarily last user activity. User may have app open but not actively using. Some apps show "Active 5m ago" instead of "Last seen" for softer language.
        </p>

        <h3 className="mt-6">Real-time Synchronization</h3>
        <p>
          WebSocket subscriptions for presence updates. Client subscribes to presence channel for contacts. Server publishes presence events (user_online, user_offline, user_typing). Clients update UI on event receipt. Latency should be &lt;1 second for seamless experience.
        </p>
        <p>
          Presence batching for efficiency. Instead of individual events for each contact, send batch: (online: [user1, user2], offline: [user3]). Reduces message overhead for users with many contacts. Batch interval: 100-500ms.
        </p>
        <p>
          Reconnection handling. On reconnect, client requests current presence for all contacts. Server returns current state. Client updates UI. Prevents stale presence after network blip. Presence state is eventually consistent—brief periods of incorrect status acceptable.
        </p>

        <h3 className="mt-6">Privacy Controls</h3>
        <p>
          Presence visibility settings. Options: Everyone (anyone can see), Contacts only (mutual contacts), Nobody (hidden). Stored in user preferences. Evaluated on every presence query. Reciprocal—if you hide from everyone, you see no one's presence.
        </p>
        <p>
          Per-contact exceptions. Allow specific contacts to see presence even when hidden from others. Block specific contacts from seeing presence. Exception list stored separately, evaluated after general setting.
        </p>
        <p>
          Invisible mode. User appears offline but can see others' presence. Useful for browsing without interruption. Server tracks actual status separately from displayed status. Invisible users don't trigger online notifications.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Presence indicator architecture spans client detection, WebSocket synchronization, presence service, and privacy evaluation. Client detects user activity (foreground/background, keystrokes). WebSocket maintains connection, sends heartbeat. Presence service tracks connected users, broadcasts status changes. Privacy service evaluates visibility on each query.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/presence-indicators/presence-architecture.svg"
          alt="Presence Architecture"
          caption="Figure 1: Presence Architecture — Client detection, WebSocket sync, presence service, and privacy evaluation"
          width={1000}
          height={500}
        />

        <h3>Client Detection</h3>
        <p>
          Activity detection tracks user engagement. Foreground/background: use visibility API (web), lifecycle callbacks (mobile). Keystroke detection: keydown events in input fields. Mouse/touch activity: track last interaction time. Screen lock: detect device sleep (mobile).
        </p>
        <p>
          Heartbeat mechanism proves connection is alive. Client sends ping every 15-30 seconds. Server updates last_heartbeat timestamp. If no heartbeat for 60 seconds, mark user offline. Heartbeat also keeps connection alive through NAT firewalls.
        </p>
        <p>
          Connection state management. On app open: establish WebSocket, send presence_online event. On app background: send presence_away (optional). On app close: send presence_offline. Handle unexpected disconnects via heartbeat timeout.
        </p>

        <h3 className="mt-6">Presence Service</h3>
        <p>
          Presence storage tracks current state. Redis for fast access: user_id to (status, last_seen, device_info). Status: online, away, offline. Last_seen: timestamp of last activity. Device_info: which device is active (phone, desktop).
        </p>
        <p>
          Presence broadcast on status change. User comes online: publish user_online to subscribers (contacts). User goes offline: publish user_offline. Typing events: publish user_typing to conversation participants. Subscribers receive updates in real-time.
        </p>
        <p>
          Multi-device presence. User may have multiple active devices. Show "Online from phone" or "Online from desktop". Priority: mobile over desktop for "active" status. If all devices offline, mark user offline. Aggregate last_seen from most recent device.
        </p>

        <h3 className="mt-6">Typing Service</h3>
        <p>
          Typing event flow. User types: client detects keystroke, debounces 500ms, sends typing_start via WebSocket. Server validates (user in conversation, not rate limited), broadcasts to conversation participants. User stops typing: after 2 seconds, auto-send typing_stop or send on message send.
        </p>
        <p>
          Typing state management. Server tracks typing state per conversation: conversation_id → [typing_users]. Add user on typing_start, remove on typing_stop or timeout (10 seconds). Broadcast state to all conversation participants.
        </p>
        <p>
          Typing privacy. Respect typing indicator preferences. Some users disable typing indicators. If user A has typing disabled, don't send typing_start events, don't show typing indicators for user A. Reciprocal—if you disable typing, you don't see others' typing.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/presence-indicators/typing-indicator-flow.svg"
          alt="Typing Indicator Flow"
          caption="Figure 2: Typing Indicator Flow — Keystroke detection, debouncing, WebSocket broadcast, and display"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Privacy Evaluation</h3>
        <p>
          Privacy check on presence query. Query: "Can user A see user B's presence?" Evaluation: check user B's privacy setting (everyone/contacts/nobody), check if user A is in user B's contacts, check exceptions list. Return true/false.
        </p>
        <p>
          Cached privacy evaluation. Privacy settings change infrequently. Cache result: (viewer_id, target_id) → can_see. Invalidate cache on privacy setting change. Cache TTL: 5 minutes for safety.
        </p>
        <p>
          Reciprocal privacy enforcement. If user hides presence from everyone, they can't see anyone's presence. Server enforces: when querying presence, check if viewer is also visible. If viewer is invisible, return offline for all targets.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/presence-indicators/privacy-evaluation.svg"
          alt="Privacy Evaluation"
          caption="Figure 3: Privacy Evaluation — Visibility settings, contact checking, and reciprocal enforcement"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Presence indicator design involves trade-offs between accuracy, privacy, performance, and user experience. Understanding these trade-offs enables informed decisions aligned with product goals and user expectations.
        </p>

        <h3>Accuracy vs Battery/Performance</h3>
        <p>
          High accuracy: frequent heartbeats (every 10 seconds), immediate status updates. Pros: Accurate presence, minimal delay. Cons: Battery drain, network usage, server load. Best for: Desktop apps, plugged-in devices.
        </p>
        <p>
          Battery optimized: infrequent heartbeats (every 60 seconds), batched updates. Pros: Better battery life, reduced network. Cons: Delayed status updates (up to 60 seconds). Best for: Mobile apps, battery-conscious users.
        </p>
        <p>
          Adaptive approach: frequent heartbeats when app in foreground, infrequent when background. Pros: Balances accuracy with battery. Cons: More complex logic. Best for: Most production apps.
        </p>

        <h3>Real-time vs Polling</h3>
        <p>
          Real-time (WebSocket): server pushes presence changes. Pros: Instant updates, efficient for many contacts. Cons: Persistent connection overhead, complex reconnection. Best for: Chat apps, real-time collaboration.
        </p>
        <p>
          Polling: client queries presence periodically. Pros: Simple, no persistent connection. Cons: Delayed updates, inefficient (many empty polls). Best for: Simple apps, low-frequency presence needs.
        </p>
        <p>
          Hybrid: WebSocket for active session, polling for background. Pros: Best of both worlds. Cons: More complex. Best for: Most production apps.
        </p>

        <h3>Typing Indicator Granularity</h3>
        <p>
          Per-message typing: show typing for each message. Pros: Accurate, shows when composing reply. Cons: Frequent toggling, can be distracting. Best for: 1:1 chats, small groups.
        </p>
        <p>
          Per-conversation typing: show typing once for conversation. Pros: Less distracting, simpler. Cons: Less granular. Best for: Large group chats.
        </p>
        <p>
          No typing indicators: disable entirely. Pros: No distraction, privacy. Cons: Less conversational awareness. Best for: Professional contexts, privacy-focused apps.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/presence-indicators/scaling-strategies.svg"
          alt="Scaling Strategies"
          caption="Figure 4: Scaling Strategies — Sharding, caching, and presence aggregation for high volume"
          width={1000}
          height={450}
        />

        <h3>Privacy Defaults</h3>
        <p>
          Opt-in privacy: presence visible by default, user must hide. Pros: Social by default, easier to connect. Cons: Privacy concerns, users may not know how to hide. Best for: Social apps, networking apps.
        </p>
        <p>
          Opt-out privacy: presence hidden by default, user must show. Pros: Privacy-first, user control. Cons: Less social discovery, may reduce engagement. Best for: Privacy-focused apps, enterprise.
        </p>
        <p>
          Contextual privacy: visible to contacts by default, hidden from strangers. Pros: Balanced approach. Cons: Requires contact management. Best for: Most production apps.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use heartbeat for liveness:</strong> Send ping every 15-30 seconds. Timeout after 60 seconds without heartbeat. Update last_seen on heartbeat. Handle unexpected disconnects gracefully.
          </li>
          <li>
            <strong>Debounce typing indicators:</strong> Show typing after 500ms of typing. Hide after 2 seconds of inactivity. Prevents flickering from brief pauses. Rate limit typing events (max 1 per 2 seconds).
          </li>
          <li>
            <strong>Implement privacy controls:</strong> Everyone/Contacts/Nobody settings. Reciprocal privacy enforcement. Per-contact exceptions. Cache privacy evaluation for performance.
          </li>
          <li>
            <strong>Handle multi-device:</strong> Track presence per device. Aggregate for user-level status. Show active device ("Online from phone"). Most recent device determines last_seen.
          </li>
          <li>
            <strong>Optimize for battery:</strong> Reduce heartbeat frequency when app backgrounded. Batch presence updates. Use push for critical presence changes only.
          </li>
          <li>
            <strong>Provide reconnection sync:</strong> On reconnect, fetch current presence for all contacts. Update UI with current state. Prevents stale presence after network issues.
          </li>
          <li>
            <strong>Use relative timestamps:</strong> "Last seen 5m ago" for recent, "Last seen Mar 25 at 2:30 PM" for older. Update relative timestamps dynamically.
          </li>
          <li>
            <strong>Respect user preferences:</strong> Some users disable typing indicators. Honor preference, don't send/receive typing events. Reciprocal—if you disable, you don't see others'.
          </li>
          <li>
            <strong>Monitor presence accuracy:</strong> Track false positives (showing online when offline), false negatives. Alert on high error rates. Tune heartbeat timeout based on data.
          </li>
          <li>
            <strong>Handle presence storms:</strong> After outage, thousands come online simultaneously. Batch presence broadcasts. Rate limit presence events. Queue and drain gradually.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No heartbeat timeout:</strong> Connection drops, user stays "online" forever. Solution: Heartbeat with timeout, mark offline after 60 seconds without heartbeat.
          </li>
          <li>
            <strong>Typing indicator spam:</strong> Sending typing event on every keystroke. Solution: Debounce, rate limit, send once per typing session.
          </li>
          <li>
            <strong>Ignoring privacy:</strong> Showing presence to everyone regardless of settings. Solution: Evaluate privacy on every query, cache results, enforce reciprocal privacy.
          </li>
          <li>
            <strong>Multi-device conflicts:</strong> Different status on different devices. Solution: Aggregate presence, most recent device determines status.
          </li>
          <li>
            <strong>No reconnection sync:</strong> Stale presence after network blip. Solution: Fetch current presence on reconnect, update UI.
          </li>
          <li>
            <strong>Battery drain:</strong> Frequent heartbeats kill battery. Solution: Adaptive heartbeat frequency, reduce when backgrounded.
          </li>
          <li>
            <strong>Typing without context:</strong> Showing typing when user isn't viewing conversation. Solution: Hide typing when recipient scrolls away.
          </li>
          <li>
            <strong>No presence storm handling:</strong> Outage recovery overwhelms servers. Solution: Batch broadcasts, rate limit, queue and drain.
          </li>
          <li>
            <strong>Inaccurate last seen:</strong> Last seen from wrong device or stale. Solution: Update last_seen on every heartbeat, use most recent device.
          </li>
          <li>
            <strong>Ignoring invisible mode:</strong> Invisible users still trigger notifications. Solution: Track actual vs displayed status separately, suppress notifications for invisible users.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>WhatsApp Presence</h3>
        <p>
          WhatsApp shows "Online" when app is open and connected. "Last seen" timestamp when offline. Privacy settings: Everyone, My Contacts, Nobody. Typing indicators for 1:1 and group chats. No "away" state—directly online to offline.
        </p>

        <h3 className="mt-6">Slack Presence</h3>
        <p>
          Slack shows green dot for active (within 10 minutes), yellow for away (10+ minutes), gray for offline. Auto-away after 10 minutes of inactivity. Custom status ("In a meeting", "Out sick"). Per-workspace presence (can be online in one workspace, offline in another).
        </p>

        <h3 className="mt-6">Discord Presence</h3>
        <p>
          Discord shows online (green), idle (yellow, auto after 5 minutes), Do Not Disturb (red, suppresses notifications), invisible (gray, appears offline). Rich presence shows current game/activity. Per-server nickname doesn't affect presence.
        </p>

        <h3 className="mt-6">LinkedIn Presence</h3>
        <p>
          LinkedIn shows "Online now" for active users. Typing indicators in messaging. Privacy controls for who can see when you're online. Professional context—presence indicates availability for business communication.
        </p>

        <h3 className="mt-6">iMessage Presence</h3>
        <p>
          iMessage shows "Delivered" when message reaches device. "Read" with timestamp when user opens message (if read receipts enabled). Typing indicators with animated dots. Presence tied to Apple ID across all devices (iPhone, iPad, Mac).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect if a user is online?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> WebSocket connection + heartbeat. When user opens app, establish WebSocket connection, send presence_online event. Client sends heartbeat every 15-30 seconds. Server updates last_heartbeat timestamp. If no heartbeat for 60 seconds, mark user offline. Also track app foreground/background state for more accurate detection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement typing indicators?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Detect keystrokes in input field. Debounce 500ms before sending typing_start (prevents flickering). Send via WebSocket to server. Server validates (user in conversation, not rate limited), broadcasts to conversation participants. Auto-send typing_stop after 2 seconds of inactivity or on message send. Display "User is typing..." or animated dots.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle presence privacy?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store privacy setting (everyone/contacts/nobody) in user preferences. On presence query, evaluate: check target's privacy setting, check if viewer is in target's contacts, check exceptions list. Cache result for performance. Enforce reciprocal privacy—if user hides from everyone, they can't see anyone's presence.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync presence across devices?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track presence per device (phone, tablet, desktop). Each device sends independent heartbeats. Aggregate for user-level status: if any device online, user is online. Show active device ("Online from phone"). Last_seen is max of all devices' last_heartbeat. On query, return aggregated status.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle presence storms after outage?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Batch presence broadcasts—don't send individual events for each user coming online. Queue presence events, drain gradually (e.g., 1000 users per second). Rate limit presence updates per viewer. Use eventual consistency—brief periods of incorrect status acceptable during recovery. Notify clients to refresh presence after reconnection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize presence for battery?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Adaptive heartbeat frequency—frequent (15s) when app in foreground, infrequent (60s) when backgrounded. Batch presence updates—send multiple status changes in single message. Use push for critical presence changes only. Reduce typing indicator frequency. Allow users to disable presence for battery savings.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Visibility_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Visibility API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://xmpp.org/extensions/xep-0012.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              XMPP — Last Activity Protocol (XEP-0012)
            </a>
          </li>
          <li>
            <a
              href="https://developer.apple.com/documentation/foundation/nsurlsession/1411595-allowscellularaccess"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple Developer — Background App Refresh
            </a>
          </li>
          <li>
            <a
              href="https://slack.engineering/tagged/presence"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Engineering — Presence Systems
            </a>
          </li>
          <li>
            <a
              href="https://discord.com/blog/how-discord-handles-millions-of-concurrent-users"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord Engineering — Scaling Presence
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/activity-feeds/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Activity Feeds and Presence
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
