"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-presence-system",
  title: "Design a Presence System (Online/Offline, Typing Indicators)",
  description:
    "Architecture for a real-time presence system: heartbeat-based online/offline detection, typing indicators, last-seen timestamps, privacy controls, and scalability to millions of users.",
  category: "high-level-design",
  subcategory: "realtime-collaboration-systems",
  slug: "presence-system",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-10",
  tags: ["hld", "presence", "online-status", "typing-indicators", "heartbeat", "pub-sub"],
  relatedTopics: ["embedded-chat-system", "cursor-sharing-system"],
};

export default function PresenceSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A presence system answers the question "is this user available right now?" The answer informs dozens of downstream features: whether to show a typing indicator, whether a push notification is necessary (the user is active in the app), whether to show a "last seen" timestamp, whether to route a customer support request to an available agent. The deceptively simple online/offline binary state hides significant engineering complexity: determining when a user has transitioned from online to offline requires detecting the absence of activity (you cannot receive an "I have gone offline" event from a user who lost network connectivity).</p>
        <p>Presence systems are among the highest-fan-out problems in real-time systems. When a user with 1,000 followers comes online, 1,000 WebSocket connections must receive the update. At 100,000 daily active users each with an average of 200 followers, a presence change wave can generate 20,000,000 fan-out events per second during peak activity (morning login surge). The delivery mechanism must handle this fan-out without becoming a bottleneck.</p>
        <p><strong>Explicit assumptions:</strong> The system serves a social platform (users follow each other). Presence is published to all followers of a user, not to all users globally. Presence states: online (active in the app within the last 5 minutes), idle (app open but no interaction in 5–20 minutes), offline (app closed or no heartbeat for 20+ minutes). Typing indicators are a sub-feature of presence, scoped to specific conversation contexts. Privacy controls allow users to hide their online status from all or specific users.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Online/offline status:</strong> Accurate per-user presence state (online, idle, offline). Status visible to followers within 5 seconds of a state change.</li>
          <li><strong>Last seen:</strong> For offline users, show the timestamp of their last activity ("last seen 2 hours ago"). Last-seen precision: minute-level for recent (within 24 hours), hour-level for older.</li>
          <li><strong>Typing indicators:</strong> In direct messages and group chats, show "User is typing..." within 200ms of the user starting to type. Remove indicator within 3 seconds of the user stopping.</li>
          <li><strong>Activity-based idle detection:</strong> Transition from online to idle after 5 minutes of no interaction (keyboard, mouse, touch). Transition from idle to online on next interaction.</li>
          <li><strong>Privacy controls:</strong> Users can set visibility to "Everyone," "Contacts only," or "Nobody." Users who set "Nobody" always appear offline to others (including in typing indicators). Users can hide status from specific people.</li>
          <li><strong>Multi-device presence:</strong> A user is online if any of their devices is active. Going offline requires all devices to be inactive.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Propagation latency:</strong> Presence state change visible to followers within 5 seconds of the originating event.</li>
          <li><strong>Detection latency:</strong> Transition from online to offline detected within 30 seconds of the user closing the app (the heartbeat interval).</li>
          <li><strong>Scale:</strong> 10 million concurrent online users. Average 200 followers per user. Peak fan-out: 2 billion presence updates per hour during morning login surge.</li>
          <li><strong>Eventual consistency:</strong> Presence data is inherently approximate (there is always a detection lag between the user going offline and the system detecting it). This is acceptable; presence is best-effort, not transactionally precise.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The presence system has two primary data paths. The heartbeat path: each connected client sends a heartbeat (a lightweight WebSocket ping or HTTP request) every 15–30 seconds. The Presence Service receives heartbeats, updates a Redis key per user (last_heartbeat_{userId} with a 60-second TTL), and evaluates state transitions (online → idle based on interaction data, idle → offline based on TTL expiry). The fan-out path: when a user's presence state changes, the Presence Service fans out the update to all the user's followers who are currently online, via Redis pub/sub channels or a Kafka topic per user shard.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/presence-system-architecture.svg"
          alt="Presence system architecture showing client heartbeat (30s interval) → Presence Service → Redis key with 60s TTL (per device, per user), state machine (online/idle/offline transitions), fan-out to followers (Redis pub/sub or Kafka) → WebSocket Gateway delivery. Multi-device aggregation (user is online if any device is online). Privacy filter before fan-out. Last-seen timestamp persistence."
          caption="Presence architecture: heartbeat → Redis TTL → state machine → privacy-filtered fan-out → WebSocket delivery, with multi-device aggregation"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Heartbeat Design and Offline Detection</h3>
        <p>The client sends a heartbeat every 30 seconds while the app is in the foreground. The heartbeat includes: userId, deviceId, and an activityTimestamp (the time of the user's most recent interaction—keypress, scroll, touch). On mobile, the heartbeat uses a background task (iOS BGAppRefreshTask, Android WorkManager) to send a heartbeat even when the app is in the background for up to 30 minutes (to keep the presence active for users who switched apps but did not explicitly close).</p>
        <p>The Presence Service stores two Redis keys per device: presence:{userId}:{deviceId} (value: {state, lastActivityMs}, TTL: 60 seconds) and lastSeen:{userId} (value: timestamp, no TTL—persistent). The 60-second TTL means that if no heartbeat is received for 60 seconds (two missed 30-second heartbeats), the Redis key expires. A keyspace notification (Redis can emit pub/sub events when keys expire) fires the expired event to the Presence Service, which triggers the offline state transition for that device. If this was the user's only active device, the user transitions to offline; the lastSeen:{userId} key is updated to the current timestamp.</p>
        <p>Detection latency: the gap between the user closing the app and the system detecting the offline transition is at most the heartbeat interval (30 seconds) plus the TTL buffer (60 seconds) = 90 seconds worst case. The average detection latency is approximately 45–75 seconds. For presence systems where faster detection is required (customer support agent availability), heartbeat intervals can be reduced (15 seconds) at the cost of higher server load (3.3× more heartbeat requests per user).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multi-Device Presence Aggregation</h3>
        <p>A user with multiple active devices (phone and laptop both open) is online as long as any device has an active heartbeat. The per-device TTL keys handle this naturally: the user's aggregate presence state is ONLINE if any presence:{userId}:{deviceId} key exists in Redis, IDLE if all existing keys have idleMs &gt; 5 minutes, and OFFLINE if no key exists. The aggregate state is computed by the Presence Service on each heartbeat receipt and on each key expiry event.</p>
        <p>The aggregation query (scan all presence:{userId}:* keys) is potentially expensive for users with many devices. The optimization: a separate Redis set active_devices:{userId} contains the deviceIds of all currently active devices (added on heartbeat, removed on expiry). The set count tells the service how many active devices exist without scanning all key patterns. When a heartbeat expires (device goes offline), the service removes the deviceId from the set, checks if the set is now empty (all devices offline), and if so, triggers the offline fan-out.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Fan-Out Architecture</h3>
        <p>When a user's presence state changes (online → idle, idle → offline, offline → online), the Presence Service must notify all followers of that user who are currently online. The fan-out is performed in two stages. Stage 1 (follower lookup): the Presence Service fetches the user's follower list from the social graph service (or its own cache). For users with large follower counts (10,000+ followers), this lookup must be paginated and processed in batches. Stage 2 (delivery): for each follower who is currently online, the update is delivered via the WebSocket Gateway (either directly if the Presence Service knows which Gateway server the follower is connected to, or via Redis pub/sub with the Gateway subscribed to the follower's updates).</p>
        <p>Fan-out for high-follower-count users (influencers with millions of followers) is a special case. Delivering a single user's presence change to 1 million followers would generate 1 million WebSocket events. The mitigation: for high-follower-count users, presence updates are not pushed to all followers—instead, followers pull the presence state when they open the conversation or view the profile. The threshold for push versus pull is configurable (e.g., push for users with under 5,000 followers, pull for higher). This is the "fan-out on write" versus "fan-out on read" trade-off, applied selectively based on follower count.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Idle Detection and Activity Tracking</h3>
        <p>The transition from online to idle (5 minutes of no interaction) is tracked client-side. The client monitors user interaction events (mousemove, keydown, touchstart, scroll). When an interaction occurs, the client records the interaction timestamp. The heartbeat includes the lastInteractionMs (milliseconds since epoch of the last interaction). The Presence Service evaluates: if now - lastInteractionMs &gt; 5 * 60 * 1000 (5 minutes), the device state is IDLE; otherwise ONLINE.</p>
        <p>The idle state is important for presence display (idle users may show a yellow dot rather than green) and for notification routing (an idle user might receive a push notification rather than relying on in-app delivery, since they are not actively watching the screen). The idle threshold (5 minutes) and the offline threshold (20 minutes of no heartbeat) create a three-state presence model: ONLINE (active, in-app), IDLE (app open, not interacting), OFFLINE (app closed or device inactive).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Typing Indicators</h3>
        <p>Typing indicators are scoped to a specific conversation context (directMessageId or channelId), unlike general presence (which is global per user). The client sends a typing_start event when the user begins typing in a conversation input field and a typing_stop event when they stop typing (or after 3 seconds of no keystroke). The Presence Service broadcasts typing events to all online participants in the conversation via Redis pub/sub on the conversation's channel.</p>
        <p>Typing events do not touch the database; they are purely in-memory. The Redis pub/sub delivery path is lower-latency than a database-backed path: typing_start is received by the sending client, published to Redis, received by all Gateway servers subscribed to this conversation's channel, and delivered to online participants—total latency under 100ms. The client-side display: on receiving typing_start, display "Alice is typing..." for up to 3 seconds. On receiving typing_stop, or after 3 seconds without a new typing_start, remove the indicator. This 3-second expiry provides resilience against lost typing_stop events (which can happen on abrupt disconnection).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Privacy Controls</h3>
        <p>Privacy controls are enforced at the fan-out stage: before delivering a presence update to a follower, the Presence Service checks the user's visibility settings. For a user with visibility set to "Nobody," no fan-out occurs—the Presence Service simply does not publish the update. For "Contacts only," the service fetches the user's contact list and delivers only to followers who are also contacts. For specific "hide from" users, those users are excluded from the fan-out.</p>
        <p>For pull-based presence (high-follower-count users), privacy controls are enforced at query time: when a follower queries a user's presence, the Presence Service checks if the querying user is allowed to see the presence state. If not (privacy setting says "hide from this user"), the service returns an "offline" presence state regardless of the actual state. The user being queried is never notified that someone attempted to see their presence—the query is silently redirected to return offline.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/realtime-collaboration-systems/presence-system-semantics.svg"
          alt="Presence state machine showing transitions: offline → online (heartbeat received, TTL key created), online → idle (lastInteractionMs > 5 minutes), idle → online (new interaction received), idle/online → offline (TTL key expired, all devices inactive). Privacy enforcement at fan-out: visibility check before delivering to each follower. Multi-device aggregation: active_devices set, online if any device active."
          caption="Presence state machine: online/idle/offline transitions, multi-device aggregation via Redis set, and privacy-filtered fan-out"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Push-based versus pull-based presence: push-based (server notifies followers when presence changes) provides real-time updates but requires high fan-out infrastructure. Pull-based (clients query presence when they need it, e.g., when opening a conversation) is lower infrastructure cost but introduces latency (the client may display stale presence until it queries again). Most systems use a hybrid: push for active conversations (where the user is watching for presence changes) and pull for passive views (a contact list shows presence when opened, but does not subscribe to real-time updates for all contacts). This hybrid approach is what WhatsApp and Telegram use.</p>
        <p>Heartbeat interval trade-offs: a 15-second heartbeat provides 15–45 second detection latency (fast enough to feel responsive) but generates 4× more server load than a 60-second heartbeat. A 60-second heartbeat generates lower server load but 60–120 second detection latency (feels sluggish for a user who "just left"). The 30-second interval (30–90 second detection) is a common production compromise. For mobile devices where battery consumption is a concern, heartbeats can be coalesced with other periodic API calls (fetching new messages, syncing notifications) rather than being standalone requests.</p>
        <p>Accuracy versus privacy: the more accurate the presence system, the more it reveals about user behavior (exactly when they are active, whether they read a message immediately). Many users find this intrusive. WhatsApp's "last seen" feature was controversial precisely because it revealed too much information. The privacy controls described above allow users to opt out, but the system design should default to the minimum necessary precision: showing "active today" rather than "active 3 minutes ago" respects user privacy while still providing useful presence information. The precision level should be a product decision, not a technical default.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A presence system detects and distributes user online/offline state using heartbeat-based TTL keys in Redis (30-second heartbeat interval, 60-second TTL per device). The three-state model (online/idle/offline) is driven by client-reported interaction timestamps. Multi-device aggregation uses a per-user Redis set of active deviceIds; the user is online if the set is non-empty. State change fan-out uses Redis pub/sub to the user's follower set (filtered by privacy settings and follower count—push for under 5,000 followers, pull for higher). Typing indicators use the same pub/sub infrastructure scoped to specific conversation channels, with 3-second client-side TTL for resilience against dropped stop events. Privacy controls are enforced at the fan-out stage (before delivering to each follower) and at the query stage (for pull-based presence). The fundamental engineering challenge is the fan-out scale: a morning login surge from 10 million users with 200 followers each requires 2 billion fan-out events per hour, handled by sharded Kafka topics and parallel fan-out workers rather than a single Redis pub/sub channel.</p>
      </section>
    </ArticleLayout>
  );
}
