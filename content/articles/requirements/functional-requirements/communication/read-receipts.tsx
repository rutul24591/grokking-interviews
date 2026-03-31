"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-comm-frontend-read-receipts",
  title: "Read Receipts",
  description:
    "Comprehensive guide to implementing read receipts covering delivery status, read status, privacy controls, real-time synchronization, and the social dynamics of message status indicators.",
  category: "functional-requirements",
  subcategory: "communication",
  slug: "read-receipts",
  version: "extensive",
  wordCount: 6100,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "requirements",
    "functional",
    "communication",
    "read-receipts",
    "messaging",
    "frontend",
    "privacy",
    "message-status",
  ],
  relatedTopics: [
    "chat-interface",
    "presence-indicators",
    "privacy-controls",
    "messaging-service",
  ],
};

export default function ReadReceiptsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Read receipts show message delivery and read status, providing senders
          visibility into message consumption while respecting recipient privacy
          preferences. The system typically shows multiple states: sent (message
          reached server), delivered (message reached recipient's device), and
          read (recipient opened the message). These status indicators reduce
          communication uncertainty—senders know if their message was received
          and seen, enabling follow-up decisions.
        </p>
        <p>
          The social dynamics of read receipts are complex. Senders value the
          certainty of knowing messages were seen. Recipients may feel pressure
          to respond immediately upon being marked as "read". Some users disable
          read receipts to maintain response flexibility. The feature creates
          asymmetric information—senders know when recipients read, but
          recipients may not want this visibility. This tension between
          transparency and privacy requires careful design with user controls.
        </p>
        <p>
          For staff and principal engineers, read receipt implementation
          involves technical and social challenges. The system must track
          message state across devices, handle offline scenarios, and respect
          privacy settings. Real-time synchronization ensures status updates
          appear instantly. Group conversations multiply complexity—who read,
          who hasn't, when did they read. The architecture must handle
          high-volume status updates without overwhelming the system. Privacy
          controls must be granular yet understandable.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Message Status States</h3>
        <p>
          Sent status indicates message reached the server. Client receives
          acknowledgment from server after successful upload. Displayed as
          single checkmark or "Sent" label. Does not guarantee delivery to
          recipient—server may have message but recipient's device is offline.
          Timestamp reflects server receive time.
        </p>
        <p>
          Delivered status indicates message reached recipient's device. Server
          receives acknowledgment from recipient's client. Displayed as double
          checkmark (gray) or "Delivered" label. Recipient may not have seen the
          message yet—notification may be unread, app may not be open. Timestamp
          reflects device receive time.
        </p>
        <p>
          Read status indicates recipient opened the conversation and message
          was visible. Triggered when conversation view scrolls message into
          view or after dwell time threshold. Displayed as double checkmark
          (blue/green) or "Read" with timestamp. Some apps show exact read time
          ("Read 2:30 PM"). Most definitive status—confirms message was seen.
        </p>
        <p>
          Additional states: Failed (red exclamation, retry option), Pending
          (clock icon, still sending), Skipped (read receipts disabled by
          recipient). Each state provides sender appropriate feedback for next
          action.
        </p>

        <h3 className="mt-6">Read Detection Triggers</h3>
        <p>
          Conversation open trigger marks all messages as read when conversation
          view opens. Simple but imprecise—messages marked read even if user
          didn't scroll to see them. Used by early messaging apps. Still common
          for 1:1 chats where precision less critical.
        </p>
        <p>
          Scroll-into-view trigger marks message read when it scrolls into
          visible viewport. More accurate—confirms message was actually visible.
          Uses Intersection Observer API (web) or equivalent (mobile).
          Per-message read receipts possible. Used by modern apps for precision.
        </p>
        <p>
          Dwell time trigger marks message read after visible for threshold time
          (2-5 seconds). Accounts for user reading speed. Prevents accidental
          reads from quick scroll. Combines with scroll-into-view for accuracy.
          Threshold tunable based on message length.
        </p>
        <p>
          Foreground app trigger marks messages read only when app in
          foreground. Background app doesn't trigger reads even if notification
          preview shown. Prevents accidental reads from lock screen
          notifications. Respects user intent—app open means ready to engage.
        </p>

        <h3 className="mt-6">Privacy Controls</h3>
        <p>
          Global toggle enables/disables read receipts for all conversations.
          Default varies by app—WhatsApp defaults on, Signal defaults on,
          Telegram defaults off. Reciprocal privacy—if you disable read
          receipts, you can't see others'. Stored in user preferences, synced
          across devices.
        </p>
        <p>
          Per-conversation override allows enabling/disabling for specific
          contacts. Useful for close contacts (want receipts) vs professional
          contacts (prefer privacy). Overrides global setting. Stored as
          exception list. Granular control improves user satisfaction.
        </p>
        <p>
          Read receipt hiding shows delivered but not read to specific contacts.
          "Soft disable"—sender sees delivered, not read timestamp. Less
          confrontational than full disable. Used for managing expectations with
          demanding contacts. Not commonly advertised feature.
        </p>
        <p>
          Incognito read allows reading messages without triggering read
          receipt. Special mode user enables temporarily. Messages marked read
          locally, not synced to sender. Useful for catching up without
          commitment to respond. May be premium feature in some apps.
        </p>

        <h3 className="mt-6">Group Read Receipts</h3>
        <p>
          Group read status shows who has read each message. Expandable list per
          message: "Read by John (2:30), Sarah (2:32)". Non-readers shown
          separately: "Delivered to Mike". Complexity scales with group
          size—large groups need aggregation ("Read by 5 people").
        </p>
        <p>
          Read aggregation for large groups shows counts instead of names. "Read
          by 12 people" with tap to expand. Reduces visual clutter. Tap expands
          to show individual readers with timestamps. Balances information with
          readability.
        </p>
        <p>
          Group read notifications notify sender when specific people read.
          Configurable—notify when all read, when specific people read, or
          never. Prevents notification spam for large groups. User configures
          based on group importance.
        </p>
        <p>
          Group read receipt privacy respects individual settings. If member
          disables read receipts, shown as "delivered" not "read" to group.
          Per-member privacy within group context. Complex to implement but
          respects user preferences.
        </p>

        <h3 className="mt-6">Real-time Synchronization</h3>
        <p>
          WebSocket updates push read status in real-time. Sender sees status
          change instantly when recipient reads. Low latency (&lt;1 second)
          creates seamless experience. Fallback to polling if WebSocket
          unavailable. Status changes animate for visibility.
        </p>
        <p>
          Batched read updates combine multiple message reads into single
          update. Reduces network overhead for long conversations. "Messages
          1-50 read" instead of 50 individual updates. Batch threshold
          configurable (10-100 messages). Balances precision with efficiency.
        </p>
        <p>
          Offline read queuing queues read events when recipient offline. Sends
          batch when connectivity resumes. Sender sees delayed status update.
          Timestamp reflects actual read time, not send time. Prevents data loss
          during network issues.
        </p>
        <p>
          Multi-device sync ensures consistent read status across sender's
          devices. Read on phone marks read on tablet and desktop. Sync via
          server—read event uploaded, downloaded by other devices. Prevents
          confusion from inconsistent status.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Read receipt architecture spans client detection, status tracking,
          real-time sync, and privacy evaluation. Client detects when messages
          are read based on triggers. Status service tracks per-message state.
          WebSocket broadcasts status changes. Privacy service evaluates
          visibility per recipient.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/read-receipts/read-receipts-architecture.svg"
          alt="Read Receipts Architecture"
          caption="Figure 1: Read Receipts Architecture — Client detection, status tracking, real-time sync, and privacy evaluation"
          width={1000}
          height={500}
        />

        <h3>Client Detection</h3>
        <p>
          Read detection uses viewport observation. Intersection Observer API
          tracks when message element enters viewport. Threshold set to 50%
          visibility—message half-visible counts as read. Debounce prevents
          rapid state changes during scroll. Read event fires once per message.
        </p>
        <p>
          Dwell time tracking measures how long message visible. Timer starts
          when message enters viewport. If visible for 2+ seconds, mark read.
          Timer resets if message scrolls out before threshold. Prevents
          accidental reads from fast scroll.
        </p>
        <p>
          App state tracking monitors foreground/background state. Reads only
          trigger when app in foreground. Background app (notification preview)
          doesn't trigger reads. Prevents accidental reads from lock screen.
          Uses visibility API (web) or lifecycle callbacks (mobile).
        </p>
        <p>
          Privacy check before sending read event. Check user's read receipt
          setting. Check recipient's privacy preferences. If either disabled,
          don't send read event. Message stays at "delivered" status. Local UI
          may show read for user's reference.
        </p>

        <h3 className="mt-6">Status Tracking Service</h3>
        <p>
          Message status stored per message. Fields: message_id, status
          (sent/delivered/read), sent_at, delivered_at, read_at. Indexed by
          conversation_id for conversation view. Read_at stores timestamp for
          "Read 2:30 PM" display.
        </p>
        <p>
          Status updates are idempotent. Multiple read events for same message
          handled gracefully. First read event sets read_at, subsequent events
          ignored. Prevents timestamp drift from duplicate events. Important for
          unreliable networks with event retries.
        </p>
        <p>
          Status aggregation for conversations. Query: get status for all
          messages in conversation. Compute summary: "5 unread, 20 read". Badge
          count based on unread count. Status computed client-side for
          responsiveness, synced with server.
        </p>
        <p>
          Group status tracking per member per message. Fields: message_id,
          member_id, status, read_at. Query: who read this message? Display:
          expandable list per message. Complexity: N members × M messages status
          entries.
        </p>

        <h3 className="mt-6">Real-time Sync</h3>
        <p>
          WebSocket broadcast on read event. Recipient reads message → client
          sends read_event → server broadcasts to sender. Sender's client
          receives event, updates UI. Latency target: &lt;1 second for seamless
          experience. Animation draws attention to status change.
        </p>
        <p>
          Batch sync for catch-up. On conversation open, fetch read status for
          all messages. Single request returns status array. More efficient than
          individual status requests. Batch size: all messages in view + buffer
          (50-100 messages).
        </p>
        <p>
          Offline handling queues read events. Read events stored locally when
          offline. Sent when connectivity resumes. Server processes queued
          events, updates status. Sender sees delayed status update with
          original read timestamp.
        </p>
        <p>
          Multi-device sync via server. Device A marks message read → upload
          read_event → server stores → Device B downloads read_event → marks
          read locally. All devices converge to same state. Conflict resolution:
          earliest read_at wins.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/read-receipts/status-flow.svg"
          alt="Message Status Flow"
          caption="Figure 2: Message Status Flow — Sent → Delivered → Read state transitions with triggers"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Privacy Evaluation</h3>
        <p>
          Privacy check on read event send. Before sending read_event to server,
          evaluate: sender's preference (wants receipts?), recipient's
          preference (allows receipts?), conversation override (enabled for this
          chat?). If any false, don't send read_event.
        </p>
        <p>
          Privacy check on status display. Before showing "Read" to sender,
          evaluate: did recipient allow receipts? If no, show "Delivered" even
          if actually read. Recipient's privacy preference controls sender's
          visibility.
        </p>
        <p>
          Cached privacy evaluation. Privacy settings change infrequently. Cache
          (user_id, target_id) → can_see_read_status. Invalidate on preference
          change. Cache TTL: 5 minutes for safety. Reduces database queries per
          message.
        </p>
        <p>
          Reciprocal enforcement. If user disables read receipts globally, they
          can't see others' read status. Server enforces: when querying status
          for user with receipts disabled, return "delivered" for all.
          Fairness—can't have it both ways.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/read-receipts/privacy-controls.svg"
          alt="Privacy Controls"
          caption="Figure 3: Privacy Controls — Global toggle, per-conversation override, and reciprocal enforcement"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Read receipt design involves trade-offs between transparency, privacy,
          social pressure, and user control. Understanding these trade-offs
          enables informed decisions aligned with product values and user
          expectations.
        </p>

        <h3>Default On vs Default Off</h3>
        <p>
          Default on: read receipts enabled by default. Pros: Maximum
          transparency, senders informed, social norm. Cons: Privacy concerns,
          response pressure, users must opt-out. Best for: Social apps,
          close-communication focus (WhatsApp, iMessage).
        </p>
        <p>
          Default off: read receipts disabled by default. Pros: Privacy-first,
          no pressure, users opt-in. Cons: Senders uninformed, may seem
          antisocial. Best for: Professional apps, privacy-focused apps (Signal
          optional, Telegram default off).
        </p>
        <p>
          Contextual default: on for close contacts, off for others. Pros:
          Balanced approach. Cons: Requires contact classification, complex.
          Best for: Apps with existing social graph (Facebook Messenger).
        </p>

        <h3>Precision vs Performance</h3>
        <p>
          Per-message precision: track read status for each message. Pros:
          Accurate, shows exactly which messages seen. Cons: High storage (N
          status entries per conversation), high network (N events). Best for:
          1:1 chats, small groups.
        </p>
        <p>
          Conversation-level precision: mark all read when conversation opened.
          Pros: Simple, low storage (1 status per conversation), low network.
          Cons: Imprecise, doesn't show which messages seen. Best for: Large
          groups, high-volume chats.
        </p>
        <p>
          Hybrid: per-message for recent, conversation-level for old. Pros:
          Balances precision with performance. Cons: More complex logic. Best
          for: Most production apps.
        </p>

        <h3>Real-time vs Batched Updates</h3>
        <p>
          Real-time updates: send read event immediately. Pros: Instant
          feedback, seamless experience. Cons: High network usage (one event per
          message), battery drain. Best for: WiFi connections, plugged-in
          devices.
        </p>
        <p>
          Batched updates: queue read events, send periodically. Pros: Reduced
          network (one event for many messages), better battery. Cons: Delayed
          sender feedback (up to batch interval). Best for: Mobile,
          battery-conscious users.
        </p>
        <p>
          Adaptive: real-time on WiFi, batched on cellular. Pros: Best of both
          worlds. Cons: More complex logic. Best for: Most production apps.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/communication/read-receipts/group-read-receipts.svg"
          alt="Group Read Receipts"
          caption="Figure 4: Group Read Receipts — Per-member tracking, aggregation, and privacy handling"
          width={1000}
          height={450}
        />

        <h3>Group Read Receipt Complexity</h3>
        <p>
          Full detail: show every member's read status with timestamp. Pros:
          Maximum information. Cons: Visual clutter for large groups, privacy
          concerns. Best for: Small groups (&lt;10 members).
        </p>
        <p>
          Aggregated: show counts ("Read by 5 people"), expand for details.
          Pros: Clean display, scalable. Cons: Extra tap for details. Best for:
          Medium groups (10-50 members).
        </p>
        <p>
          Minimal: show only unread count. Pros: Minimal clutter,
          privacy-preserving. Cons: Senders don't know who read. Best for: Large
          groups (50+ members), announcement channels.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use scroll-into-view detection:</strong> Intersection
            Observer API for accurate read detection. 50% visibility threshold.
            More accurate than conversation-open trigger. Prevents false reads.
          </li>
          <li>
            <strong>Implement dwell time:</strong> 2-5 second threshold before
            marking read. Prevents accidental reads from quick scroll. Combines
            with scroll-into-view for accuracy. Tunable per message length.
          </li>
          <li>
            <strong>Respect privacy settings:</strong> Check both sender and
            recipient preferences. Don't send read event if either disabled.
            Show "delivered" when receipts disabled. Reciprocal
            enforcement—can't see others' if you hide yours.
          </li>
          <li>
            <strong>Provide granular controls:</strong> Global toggle +
            per-conversation override. Users want control over different
            contexts. Store exceptions separately. Sync preferences across
            devices.
          </li>
          <li>
            <strong>Batch read updates:</strong> Combine multiple reads into
            single update. Reduces network overhead. Batch threshold: 10-100
            messages. Balance precision with efficiency.
          </li>
          <li>
            <strong>Handle offline gracefully:</strong> Queue read events when
            offline. Send on reconnect with original timestamps. Sender sees
            delayed update with accurate read time.
          </li>
          <li>
            <strong>Sync across devices:</strong> Read on one device marks read
            on all. Upload read event, download to other devices. Prevents
            inconsistent status. Conflict resolution: earliest read_at wins.
          </li>
          <li>
            <strong>Animate status changes:</strong> Smooth animation when
            status updates. Draws attention to change. Provides visual feedback.
            Subtle animation (color change, checkmark fill).
          </li>
          <li>
            <strong>Show timestamps:</strong> "Read 2:30 PM" more informative
            than just "Read". Helps senders understand response timing. Format
            relative for recent ("Read 5m ago"), absolute for older.
          </li>
          <li>
            <strong>Aggregate for large groups:</strong> Show counts ("Read by
            12 people") not names. Expand on tap for details. Reduces visual
            clutter. Scales to large groups.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Conversation-open trigger:</strong> Marks all read when
            conversation opens, even unseen messages. Solution: Use
            scroll-into-view + dwell time for accuracy.
          </li>
          <li>
            <strong>No privacy controls:</strong> Forced read receipts frustrate
            users. Solution: Global toggle + per-conversation override.
            Reciprocal enforcement.
          </li>
          <li>
            <strong>No offline handling:</strong> Read events lost when offline.
            Solution: Queue events locally, send on reconnect with original
            timestamps.
          </li>
          <li>
            <strong>Multi-device inconsistency:</strong> Read on phone, still
            unread on tablet. Solution: Sync via server, all devices converge to
            same state.
          </li>
          <li>
            <strong>Network spam:</strong> One event per message overwhelms
            network. Solution: Batch read updates, adaptive (real-time on WiFi,
            batched on cellular).
          </li>
          <li>
            <strong>No dwell time:</strong> Quick scroll triggers accidental
            reads. Solution: 2-5 second threshold before marking read.
          </li>
          <li>
            <strong>Background reads:</strong> Notification preview triggers
            read. Solution: Only trigger reads when app in foreground.
          </li>
          <li>
            <strong>Group complexity ignored:</strong> Showing all names for
            100-member group. Solution: Aggregate for large groups, expand on
            demand.
          </li>
          <li>
            <strong>No animation:</strong> Status changes invisible, users miss
            update. Solution: Subtle animation on status change.
          </li>
          <li>
            <strong>Timestamp confusion:</strong> Showing send time instead of
            read time. Solution: Store and display read_at timestamp separately.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>WhatsApp Read Receipts</h3>
        <p>
          WhatsApp shows single gray check (sent), double gray checks
          (delivered), double blue checks (read). Default on, can disable in
          settings. Reciprocal—if you disable, you can't see others'. Group
          chats show read status per member with tap to expand.
        </p>

        <h3 className="mt-6">iMessage Read Receipts</h3>
        <p>
          iMessage shows "Delivered" under message, then "Read" with timestamp.
          Default on per Apple ID. Can disable per conversation or globally.
          Reciprocal enforcement. Multi-device sync across iPhone, iPad, Mac.
        </p>

        <h3 className="mt-6">Telegram Read Receipts</h3>
        <p>
          Telegram shows single check (sent), double check (delivered/read—no
          distinction). Default off for privacy. Can enable for specific
          contacts. Secret chats have read receipts, regular chats don't by
          default. Group chats show read count with tap for details.
        </p>

        <h3 className="mt-6">Slack Message Read Status</h3>
        <p>
          Slack shows "Seen by" with avatars of people who read. Hover for full
          list with timestamps. Default on for all workspace members. No disable
          option (professional context). Thread messages show read count. Large
          channels aggregate ("Seen by 25 people").
        </p>

        <h3 className="mt-6">LinkedIn Messaging Read Receipts</h3>
        <p>
          LinkedIn shows "Seen" with timestamp. Default on for all connections.
          Premium users can see who viewed their profile (related feature).
          Professional context—read receipts expected. No disable option for
          messaging.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you detect when a message is read?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use Intersection Observer API to track when
              message element enters viewport with 50% visibility threshold.
              Combine with dwell time—message must be visible for 2-5 seconds
              before marking read. Only trigger when app in foreground (not
              background notification preview). Check privacy settings before
              sending read event—if user or recipient disabled receipts, don't
              send.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle read receipts for group chats?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track per-member per-message status:
              (message_id, member_id, status, read_at). Query: who read this
              message? Display aggregated for large groups ("Read by 12 people")
              with expand for details. Respect individual privacy—if member
              disabled receipts, show as "delivered" not "read". Notify sender
              based on configuration (when all read, when specific people read,
              or never).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement privacy controls for read receipts?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Store user preference (enabled/disabled) in
              settings. Check before sending read event—if disabled, don't send.
              Check before displaying read status—if recipient disabled, show
              "delivered" not "read". Implement reciprocal enforcement—if user
              disables receipts, they can't see others'. Support
              per-conversation override stored as exception list.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you sync read status across devices?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Device A marks message read → upload
              read_event (message_id, read_at) to server → server stores →
              Device B downloads read_event via WebSocket or poll → marks
              message read locally. All devices converge to same state. Conflict
              resolution: if multiple devices report different read_at, use
              earliest timestamp.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle read receipts when offline?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Queue read events locally when offline. Store
              message_id and actual read_at timestamp. When connectivity
              resumes, send queued events to server. Server processes events,
              updates status. Sender sees delayed status update but with
              accurate read timestamp (not send time). Prevents data loss during
              network issues.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize read receipt network usage?
            </p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Batch multiple read events into single update.
              Instead of 50 events for 50 messages, send one: (message_ids:
              [1,2,3...50], read_at). Adaptive batching—real-time on WiFi,
              batched on cellular. Batch threshold: 10-100 messages. Reduces
              network overhead while maintaining acceptable latency.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Intersection Observer API
            </a>
          </li>
          <li>
            <a
              href="https://www.whatsapp.com/security/WhatsApp-Security-Whitepaper.pdf"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp — Security Whitepaper (includes delivery receipts)
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/en-us/HT202619"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple Support — iMessage Read Receipts
            </a>
          </li>
          <li>
            <a
              href="https://telegram.org/faq"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram FAQ — Privacy and Read Receipts
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/messaging-usability/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Messaging Usability
            </a>
          </li>
          <li>
            <a
              href="https://slack.com/help/articles/201913926-Read-receipts-in-Slack"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack Help — Read Receipts in Slack
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
