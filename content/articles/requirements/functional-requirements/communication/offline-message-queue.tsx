"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-backend-offline-message-queue",
  title: "Offline Message Queue",
  description:
    "Comprehensive guide to implementing offline message queues covering storage strategies, sync mechanisms, conflict resolution, push notification wake-up, and delivery optimization for disconnected users.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "offline-message-queue",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "offline",
    "queue",
    "backend",
    "sync",
    "mobile",
  ],
  relatedTopics: ["messaging-service", "push-notification-service", "conflict-resolution", "mobile-optimization"],
};

export default function OfflineMessageQueueArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Offline message queue stores messages for offline users and delivers them when the user reconnects, ensuring no messages are lost during disconnection. Mobile users frequently go offline—entering tunnels, switching to airplane mode, or simply closing the app. The offline queue guarantees message durability across these disconnections, providing a reliable messaging experience even with intermittent connectivity.
        </p>
        <p>
          The challenge of offline messaging is balancing durability, latency, and resource efficiency. Messages must persist reliably (durability) without slowing down the sender (latency) while not consuming excessive storage for users offline long-term (efficiency). The queue must handle edge cases: users offline for days, messages expiring, storage limits, and reconnection after app reinstall. Push notifications can wake devices for urgent messages, but rely on platform-specific infrastructure (APNs, FCM) with their own constraints.
        </p>
        <p>
          For staff and principal engineers, offline queue implementation involves distributed systems challenges. Queue storage must scale to billions of pending messages. Sync on reconnect must handle large backlogs without overwhelming the client. Conflict resolution handles messages sent from multiple devices while offline. TTL-based expiration cleans up stale messages. Monitoring tracks queue depth, delivery latency, and failed deliveries. The architecture must handle reconnect storms when many users reconnect simultaneously after a widespread outage.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Queue Storage Strategies</h3>
        <p>
          Database queue stores messages in a dedicated table with recipient_id, message_id, content, timestamp, delivery_status, ttl. Indexes on recipient_id (fetch pending messages) and timestamp (order by arrival, expire old messages). Pros: Durable, queryable, transactional. Cons: Database load for high-volume queues. Best for: Most production systems, reliable delivery.
        </p>
        <p>
          Message queue (Kafka, RabbitMQ) buffers messages for offline users. Consumer delivers when user reconnects. Pros: High throughput, built-in persistence, replay capability. Cons: More complex, messages may expire based on retention policy. Best for: High-volume systems, async processing.
        </p>
        <p>
          Cache-based queue (Redis) stores pending messages with TTL. Fast access, automatic expiration. Pros: Low latency, automatic cleanup. Cons: Volatile (memory-based), cost for large queues. Best for: Short-term offline (minutes to hours), combined with database for durability.
        </p>

        <h3 className="mt-6">Sync on Reconnect</h3>
        <p>
          Client sends last received message ID or timestamp on reconnect. Server returns all messages since that point. Implementation: query queue where recipient_id = user AND timestamp &gt; last_received. Order by timestamp ascending. Mark delivered after successful send.
        </p>
        <p>
          Pagination for large backlogs prevents overwhelming client. Return messages in batches (50-100 per page). Client requests next page after processing current batch. Continue until all pending messages delivered. Progress indicator shows "Loading X more messages".
        </p>
        <p>
          Priority sync delivers important messages first. Direct messages before group messages. Mentions before regular messages. Recent messages before old messages. Ensures user sees important content quickly even with large backlog.
        </p>

        <h3 className="mt-6">Push Notification Wake-up</h3>
        <p>
          Push notification sent when user offline to wake device for message delivery. Payload includes message preview (unless hidden for privacy), sender info, deep link to conversation. User taps notification, app opens, syncs pending messages.
        </p>
        <p>
          Silent push wakes app without alerting user. App syncs messages in background. User sees messages when they open app. Silent push has rate limits (APNs: ~2-3 per hour per device). Use sparingly for important messages.
        </p>
        <p>
          Push throttling prevents notification spam for users offline long-term. First message triggers push. Subsequent messages batched into digest notification ("You have 15 new messages"). Digest sent periodically (every 1-4 hours) rather than per message.
        </p>

        <h3 className="mt-6">TTL and Expiration</h3>
        <p>
          Time-to-live (TTL) defines how long messages persist for offline users. Typical TTL: 30-90 days. Messages expire after TTL, removed from queue. Expired messages not delivered even if user reconnects. TTL balances storage cost with delivery guarantee.
        </p>
        <p>
          Expiration job runs periodically (hourly/daily) to clean expired messages. Query queue where timestamp &lt; (now - TTL), delete matching records. Log expiration for analytics (how many messages expired, by user segment). Optionally notify sender that message expired undelivered.
        </p>
        <p>
          Per-message TTL allows senders to set expiration. Disappearing messages have short TTL (hours to days). Important messages (passwords, 2FA codes) may have longer TTL. Default TTL applies if not specified.
        </p>

        <h3 className="mt-6">Conflict Resolution</h3>
        <p>
          Multi-device conflict: user sends messages from phone while tablet offline, then tablet reconnects. Both devices have different message histories. Resolution: server is source of truth, sync both devices to server state. Device messages merged by server timestamp.
        </p>
        <p>
          Edit/delete while offline: user edits message on phone, deletes on tablet. Both actions queued, sent to server. Server processes in receive order, last action wins. Audit trail tracks all actions for debugging.
        </p>
        <p>
          Read receipt conflict: user reads message on phone, tablet offline. Tablet reconnects, marks message unread locally. Sync corrects tablet—read receipt from phone takes precedence. Read state synced across devices.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Offline message queue architecture spans queue storage, push integration, sync service, and expiration management. Messages for offline users route to queue storage. Push service sends wake-up notification. On reconnect, sync service delivers queued messages. Expiration job cleans up old messages. Monitoring tracks queue health and delivery success.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/offline-message-queue/offline-queue-architecture.svg"
          alt="Offline Queue Architecture"
          caption="Figure 1: Offline Queue Architecture — Queue storage, push service, sync on reconnect, and expiration"
          width={1000}
          height={500}
        />

        <h3>Queue Storage Layer</h3>
        <p>
          Queue table schema: id (UUID), recipient_id, sender_id, conversation_id, content (encrypted), timestamp, delivery_status (pending/delivered/failed/expired), ttl, created_at. Indexes: (recipient_id, timestamp) for fetch pending, (timestamp) for expiration.
        </p>
        <p>
          Write path: message arrives for offline user, insert into queue table, trigger push notification, return success to sender. Write is async—sender doesn't wait for recipient to receive. Queue write is durable before ack to sender.
        </p>
        <p>
          Read path: user reconnects, query pending messages ordered by timestamp, return in paginated batches, mark delivered after successful send to client. Read is idempotent—safe to retry if connection drops mid-sync.
        </p>

        <h3 className="mt-6">Push Notification Integration</h3>
        <p>
          Push trigger on queue insert for offline recipient. Lookup recipient's push tokens (may have multiple devices). Send push to all tokens. Push payload: title (sender name), body (message preview or "New message"), data (conversation_id, deep_link).
        </p>
        <p>
          Push delivery tracking logs delivery status per token. APNs/FCM return delivery status. Failed pushes (invalid token, device unregistered) remove token from user's token list. Successful pushes increment push count for throttling.
        </p>
        <p>
          Push throttling tracks pushes per user per hour. First message: full push. Messages 2-5: silent push. Messages 6+: batch into digest, send every 1-4 hours. Throttling prevents notification fatigue, respects platform rate limits.
        </p>

        <h3 className="mt-6">Sync Service</h3>
        <p>
          Sync endpoint accepts user_id, last_message_id (or timestamp), batch_size. Query pending messages where recipient_id = user_id AND id &gt; last_message_id, order by id, limit batch_size. Return messages with pagination cursor (last message id).
        </p>
        <p>
          Sync response includes messages array, has_more (boolean), next_cursor (last message id), unread_count (total pending). Client iterates: request batch, process messages, request next batch with cursor until has_more is false.
        </p>
        <p>
          Delivery confirmation: client acks each batch after processing. Server marks messages delivered. If client disconnects mid-sync, unacked messages remain pending, redelivered on next reconnect. Idempotent delivery—client deduplicates by message id.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/offline-message-queue/sync-on-reconnect.svg"
          alt="Sync on Reconnect"
          caption="Figure 2: Sync on Reconnect — Client requests pending messages, server delivers in batches, marks delivered"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Expiration Management</h3>
        <p>
          Expiration job runs hourly. Query queue where created_at &lt; (now - TTL). Batch delete in chunks (1000 records per transaction) to avoid lock contention. Log expired count per run for monitoring.
        </p>
        <p>
          Per-user TTL adjustment: premium users may have longer TTL (1 year vs 30 days). Enterprise users may have infinite TTL (messages never expire). Query respects per-user TTL settings.
        </p>
        <p>
          Expired message notification (optional): notify sender that message expired undelivered. "Your message to X expired without being delivered". Sender can choose to resend or let expire. Notification rate-limited to prevent spam.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/offline-message-queue/push-throttling.svg"
          alt="Push Throttling"
          caption="Figure 3: Push Throttling — First message full push, subsequent batched into digest notifications"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Offline queue design involves trade-offs between delivery guarantee, storage cost, notification frequency, and sync latency. Understanding these trade-offs enables informed decisions aligned with reliability requirements and operational constraints.
        </p>

        <h3>Storage: Database vs Queue vs Cache</h3>
        <p>
          Database storage (MySQL, PostgreSQL, Cassandra). Pros: Durable, queryable, transactional, no message loss. Cons: Database load scales with queue depth, expensive for billions of messages. Best for: Production messaging, reliable delivery required.
        </p>
        <p>
          Message queue (Kafka, RabbitMQ). Pros: High throughput, built-in retention, replay capability. Cons: Messages expire based on retention (7-30 days typical), more complex ops. Best for: High-volume systems, can tolerate retention-based expiration.
        </p>
        <p>
          Cache (Redis). Pros: Fast access, automatic TTL expiration, simple. Cons: Volatile (memory), expensive for large queues, potential data loss on restart. Best for: Short-term offline (minutes to hours), combined with database for durability.
        </p>

        <h3>Push Strategy: Every Message vs Throttled</h3>
        <p>
          Push every message. Pros: Instant wake-up, user notified immediately. Cons: Notification fatigue, platform rate limits, battery drain. Best for: Small volume, urgent messages (direct messages, mentions).
        </p>
        <p>
          Throttled push (first message only, then digest). Pros: Reduced fatigue, respects rate limits, better battery. Cons: Delayed delivery for non-urgent messages. Best for: Most production systems, group messages, high-volume users.
        </p>
        <p>
          Smart push (ML-based importance). Pros: Balances immediacy with fatigue, pushes important messages. Cons: ML complexity, false negatives frustrate users. Best for: Large platforms with sufficient training data.
        </p>

        <h3>Sync Strategy: Full vs Incremental</h3>
        <p>
          Full sync sends all pending messages every reconnect. Pros: Simple, no state tracking. Cons: Inefficient for frequent reconnects, redundant data transfer. Best for: Infrequent reconnects, small backlogs.
        </p>
        <p>
          Incremental sync sends only messages since last_message_id. Pros: Efficient, minimal data transfer. Cons: Requires state tracking, complex conflict resolution. Best for: Frequent reconnects, large backlogs.
        </p>
        <p>
          Hybrid: full sync for first reconnect after long offline (days), incremental for short offline (minutes/hours). Pros: Balances efficiency with simplicity. Cons: More complex logic. Best for: Most production systems.
        </p>

        <h3>TTL: Short vs Long vs Infinite</h3>
        <p>
          Short TTL (7-30 days). Pros: Low storage cost, automatic cleanup. Cons: Messages lost for users offline long-term (vacation, hospital). Best for: Consumer messaging, casual communication.
        </p>
        <p>
          Long TTL (90 days - 1 year). Pros: Messages survive long absences. Cons: Higher storage cost, more data to sync on reconnect. Best for: Professional messaging, important communications.
        </p>
        <p>
          Infinite TTL (never expire). Pros: Guaranteed delivery regardless of absence. Cons: Unbounded storage growth, massive sync on reconnect. Best for: Enterprise, compliance-required, combined with archive/purge policies.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/offline-message-queue/storage-comparison.svg"
          alt="Storage Comparison"
          caption="Figure 4: Storage Comparison — Database, message queue, and cache trade-offs for offline queue"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use database for durable queue storage:</strong> Store pending messages in database with TTL. Combine with Redis cache for fast access. Ensure durability before ack to sender.
          </li>
          <li>
            <strong>Implement incremental sync:</strong> Client sends last_message_id, server returns messages since then. Paginate large backlogs. Mark delivered after client ack.
          </li>
          <li>
            <strong>Throttle push notifications:</strong> First message full push, subsequent batched into digest. Respect platform rate limits (APNs, FCM). Track push count per user per hour.
          </li>
          <li>
            <strong>Set appropriate TTL:</strong> Default 30-90 days for consumer messaging. Longer for enterprise. Per-message TTL for disappearing messages. Expiration job cleans up expired.
          </li>
          <li>
            <strong>Handle multi-device sync:</strong> Server is source of truth. Merge messages from all devices by server timestamp. Sync read state across devices.
          </li>
          <li>
            <strong>Implement idempotent delivery:</strong> Client deduplicates by message_id. Safe to redeliver if connection drops mid-sync. Server tracks delivered status.
          </li>
          <li>
            <strong>Monitor queue health:</strong> Track queue depth, average delivery latency, expiration rate, push delivery rate. Alert on backlog growth, high expiration, push failures.
          </li>
          <li>
            <strong>Handle reconnect storms:</strong> Rate limit sync requests. Queue sync requests, process at sustainable rate. Gradual reconnection after outage.
          </li>
          <li>
            <strong>Encrypt queued messages:</strong> Messages at rest encrypted (E2EE or server-side). Protects privacy if queue compromised. Decrypt on delivery to client.
          </li>
          <li>
            <strong>Support priority sync:</strong> Direct messages before group. Mentions before regular. Recent before old. Ensures important content delivered first.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No TTL/expiry:</strong> Queue grows unbounded for users who never reconnect. Solution: Set TTL (30-90 days), run expiration job, monitor queue depth.
          </li>
          <li>
            <strong>Full sync every reconnect:</strong> Inefficient, redundant data transfer. Solution: Incremental sync with last_message_id, paginate large backlogs.
          </li>
          <li>
            <strong>Push spam:</strong> Sending push for every message annoys users. Solution: Throttle pushes, batch into digest, respect rate limits.
          </li>
          <li>
            <strong>No delivery confirmation:</strong> Messages marked delivered but client never received. Solution: Client ack after processing, redeliver unacked messages.
          </li>
          <li>
            <strong>Multi-device conflicts:</strong> Different message history on different devices. Solution: Server is source of truth, merge by server timestamp.
          </li>
          <li>
            <strong>Reconnect storm overload:</strong> Many users reconnect simultaneously after outage, overwhelm servers. Solution: Rate limit sync, queue requests, gradual reconnection.
          </li>
          <li>
            <strong>No encryption at rest:</strong> Queued messages exposed if storage compromised. Solution: Encrypt messages in queue, decrypt on delivery.
          </li>
          <li>
            <strong>Ignoring push failures:</strong> Sending to invalid tokens wastes quota. Solution: Track push delivery, remove invalid tokens, retry transient failures.
          </li>
          <li>
            <strong>No monitoring:</strong> Queue issues undetected until users complain. Solution: Monitor queue depth, delivery latency, expiration rate, push success rate.
          </li>
          <li>
            <strong>Sending stale messages:</strong> Delivering messages days/weeks old clutters conversation. Solution: Option to skip very old messages, show summary instead ("You have 500 messages from the past week").
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>WhatsApp Offline Delivery</h3>
        <p>
          WhatsApp stores undelivered messages on server for 30 days. Push notification sent for new messages. On reconnect, messages sync in order. End-to-end encrypted messages stored encrypted on server. Expired messages deleted without delivery.
        </p>

        <h3 className="mt-6">Telegram Cloud Storage</h3>
        <p>
          Telegram stores all messages in cloud indefinitely (infinite TTL for most users). Messages accessible from any device, even years later. Sync on reconnect delivers full history. Premium users get faster sync, larger file retention.
        </p>

        <h3 className="mt-6">Slack Message History</h3>
        <p>
          Slack stores messages based on workspace plan. Free workspaces: 10,000 messages visible, older archived. Paid workspaces: unlimited history. Offline users sync on reconnect, with pagination for large history. Push notifications for mentions and DMs.
        </p>

        <h3 className="mt-6">iMessage Delivery</h3>
        <p>
          Apple's iMessage stores undelivered messages for 30 days. Push notification via APNs wakes device. Messages sync across Apple devices (iPhone, iPad, Mac) with read state synchronized. End-to-end encrypted, keys stored in iCloud.
        </p>

        <h3 className="mt-6">Facebook Messenger</h3>
        <p>
          Messenger stores messages indefinitely in cloud. Offline messages delivered on reconnect with pagination. Push notifications for messages, with throttling for high-volume conversations. Messages encrypted in transit, server-side encryption at rest.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you store offline messages?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Database table with recipient_id, message_id, content (encrypted), timestamp, delivery_status, ttl. Indexes on (recipient_id, timestamp) for fetch, (timestamp) for expiration. Write is async—sender doesn't wait for recipient. Combine with Redis cache for fast access, but database is source of truth for durability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you sync messages on reconnect?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Client sends last_message_id or timestamp. Server queries pending messages where recipient_id = user AND id &gt; last_message_id, ordered by id. Return in paginated batches (50-100 per batch). Client acks each batch after processing. Server marks delivered. Idempotent—safe to redeliver if connection drops.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle push notifications for offline users?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> On queue insert, lookup recipient's push tokens. Send push via APNs/FCM. Track delivery status—remove invalid tokens. Throttle: first message full push, messages 2-5 silent push, 6+ batch into digest every 1-4 hours. Respect platform rate limits to avoid throttling.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle message expiration?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Set TTL on queue insert (30-90 days typical). Expiration job runs hourly, queries where created_at &lt; (now - TTL), batch deletes in chunks (1000 per transaction). Log expired count for monitoring. Optionally notify sender that message expired. Per-user TTL for premium/enterprise users.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle multi-device conflicts?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Server is source of truth. Each device syncs to server state. Messages merged by server timestamp (not client timestamp). Read state synced across devices—read on one device marks read on all. Edit/delete actions queued, processed in server receive order, last action wins.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent reconnect storms?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Rate limit sync requests per second. Queue sync requests, process at sustainable rate. Implement backoff on client side (exponential backoff with jitter). After outage, gradual reconnection—reconnect subset of users per second. Pre-warm cache for expected high-traffic periods.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.whatsapp.com/security/WhatsApp-Security-Whitepaper.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp — Security Whitepaper (Offline Message Storage)
            </a>
          </li>
          <li>
            <a
              href="https://telegram.org/faq"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram FAQ — Cloud Storage and Sync
            </a>
          </li>
          <li>
            <a
              href="https://developer.apple.com/documentation/usernotifications"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple Developer — User Notifications (APNs)
            </a>
          </li>
          <li>
            <a
              href="https://firebase.google.com/docs/cloud-messaging"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firebase — Cloud Messaging Documentation
            </a>
          </li>
          <li>
            <a
              href="https://slack.engineering/tagged/messaging"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Engineering — Message Storage and Delivery
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/blogs/mobile/building-offline-first-mobile-apps/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — Building Offline-First Mobile Apps
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
