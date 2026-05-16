"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-chat-messaging-ui",
  title: "Design a Chat / Messaging UI",
  description:
    "Chat UI with message virtualization, scroll anchor preservation, optimistic sending, typing indicators, read receipts, media previews, and accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "chat-messaging-ui",
  wordCount: 5300,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  tags: ["lld", "chat", "messaging", "WebSocket", "scroll-anchor", "optimistic-UI", "virtualization"],
  relatedTopics: ["kanban-board", "notification-center-inbox", "rich-text-editor"],
};

export default function ChatMessagingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Chat interfaces are a canonical "tricky" LLD problem because the requirements
        actively conflict with standard web patterns. Lists normally scroll downward
        from top to bottom; chat lists scroll upward to load history. Infinite scroll
        typically prepends items at the top, but this shifts the viewport and appears
        to "jump" — the scroll anchor must be preserved. New messages appear at the
        bottom, requiring automatic scroll-to-bottom only when the user is already
        near the bottom (not when they are reading history). These competing requirements
        demand a careful state and scroll management architecture. Add real-time
        delivery, optimistic message sending, typing indicators, and read receipts,
        and the complexity becomes significant.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/chat-messaging-ui-architecture.svg"
        alt="Chat messaging UI architecture diagram"
        caption="Chat UI architecture: message store, scroll anchor, real-time delivery, typing indicators and read receipts"
      />

      <h2>Clarifying the Requirements</h2>
      <p>
        The scope of a chat UI ranges from a simple comments section to a full Slack
        equivalent. Key questions:
      </p>
      <p>
        <strong>How long is the message history?</strong> A support chat with 50 messages
        can render all of them. A Slack channel with 10 years of history needs
        virtualization — only a window of ~50 messages around the user's scroll position
        should be in the DOM.
      </p>
      <p>
        <strong>What media types are supported?</strong> Text-only is straightforward.
        Adding image previews, video thumbnails, file attachments, link unfurl cards,
        and emoji reactions each adds a layer of rendering complexity. Image messages
        with unknown dimensions before load create CLS (Cumulative Layout Shift) that
        disrupts the scroll position.
      </p>
      <p>
        <strong>Threading?</strong> Flat message list (all messages in one scroll region)
        versus threaded messages (replies are nested within a thread, opened in a side
        panel like Slack's thread view). Threading changes the data model from a flat
        array to a tree.
      </p>
      <p>
        <strong>Real-time delivery mechanism?</strong> WebSocket (full-duplex), SSE
        (server push only), or polling. WebSocket is the standard for production chat.
      </p>

      <h2>The Message Store</h2>
      <p>
        Messages are stored as a sorted list (by timestamp) in a normalized structure.
        The primary data structure is a Map keyed by message ID (for O(1) lookup and
        update) plus a sorted array of IDs (for ordered rendering). This dual structure
        supports both: "find message by ID" (for read receipt updates, reactions) and
        "render messages in order" (for the message list).
      </p>
      <p>
        Message status is part of the message object: sending (optimistically displayed,
        not yet confirmed by server), sent (server confirmed), delivered (received by
        the recipient's device), and read (recipient has seen it). These states drive
        the read receipt indicator displayed next to each message.
      </p>
      <p>
        The message list has a cursor for bidirectional pagination: an oldest-message
        cursor (for loading older history when scrolling up) and a newest-message cursor
        (for loading newer history when jumping to an older position and then wanting to
        scroll to the present). Messages are fetched in pages of 50. On initial load,
        fetch the most recent 50 messages. When the user scrolls near the top, fetch
        the next older 50.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The message store must never have gaps. If the user was viewing message 500
        and a new message 700 arrives via WebSocket while messages 501–699 are not
        loaded, the store has a discontinuity. The solution: track the "live edge"
        (the most recent message received in real-time) and the "viewed cursor" (the
        oldest message loaded). If a gap exists between them (the user scrolled up past
        the loaded region), show a "jump to latest" button rather than inserting the
        new message into the list. When the user clicks it, fetch messages from the
        viewed cursor to the live edge to fill the gap.
      </HighlightBlock>

      <h2>Scroll Anchor Preservation</h2>
      <p>
        The hardest technical problem in chat UI is preventing viewport jumps when new
        content is prepended (loading older messages). When 50 messages are prepended
        to the top of the list, the DOM's content height increases, and the scroll
        position (measured from the top) increases by the height of the added content,
        causing the viewport to appear to jump upward to the same pixel position in the
        now-taller document.
      </p>
      <p>
        The CSS scroll-anchor property was designed exactly for this: it designates an
        element as the scroll anchor. When content is inserted above the anchor, the
        browser adjusts the scroll position to keep the anchor element at the same
        viewport position. Set overflow-anchor: auto (the default) on the scroll
        container to enable it, and add overflow-anchor: none on elements that should
        not be anchored (the "Load more" spinner at the top). Modern Chrome, Firefox,
        and Safari all support scroll anchoring.
      </p>
      <p>
        For browsers without scroll anchoring support (or scenarios where it does not
        work reliably — for example, when the list is virtualized), implement manually:
        before the DOM mutation, record the anchor element's position using
        element.getBoundingClientRect(). After the mutation (and layout), compute the
        anchor's new position, and adjust scrollTop by the delta. This is the
        "scroll position preservation" pattern used by Discord's message list.
      </p>

      <h2>Automatic Scroll-to-Bottom</h2>
      <p>
        When a new message arrives, the chat should auto-scroll to show it — but only
        if the user is already near the bottom (reading the latest messages). If the
        user has scrolled up to read history, auto-scrolling would disrupt their
        reading position.
      </p>
      <p>
        The "near bottom" threshold is typically the last 200–300 pixels of the scroll
        container. Compute it as: scrollTop + clientHeight is greater than scrollHeight
        minus 200 (the scroll container is near its bottom). Track this with a boolean
        ref updated on every scroll event (use passive scroll listeners for performance).
        When a new message arrives, check the ref; if true, scroll to bottom after
        the message renders.
      </p>
      <p>
        The scroll-to-bottom operation: use scrollTo with behavior: 'smooth' for a
        gentle scroll that feels natural. For the initial load (the user first opens
        the chat), use behavior: 'instant' to jump directly to the bottom without
        animation. After a message is sent by the current user, always scroll to bottom
        regardless of the user's current scroll position — the user expects to see
        their sent message.
      </p>

      <h2>Message Virtualization</h2>
      <p>
        For channels with long history, rendering all messages in the DOM is
        prohibitively slow. Virtual scrolling renders only the messages in the viewport
        plus an overscan buffer above and below (typically 10–15 messages each direction).
      </p>
      <p>
        The challenge for chat virtualization: message heights are variable and unknown
        before rendering (a message with a link unfurl card or an image is taller than
        a short text message). Two approaches: measure each message's height after first
        render and cache it (using ResizeObserver on each message element), or use a
        fixed estimated height for initial positioning and adjust the scroll position
        after measurement.
      </p>
      <p>
        Libraries like react-virtual and virtua handle variable-height virtual lists.
        They maintain an item size cache, use the cached values for positioning, and
        update positions as items are measured. The complexity of integrating virtual
        scrolling with scroll anchor preservation (when prepending messages) and
        auto-scroll-to-bottom (when appending messages) makes this one of the harder
        frontend engineering problems. Libraries like Virtuoso are specifically designed
        for chat-like lists and handle these edge cases.
      </p>

      <h2>Optimistic Message Sending</h2>
      <p>
        When the user sends a message, show it immediately in the UI without waiting
        for server confirmation. This optimistic update reduces perceived latency from
        the round-trip time (typically 50–200ms) to near zero.
      </p>
      <p>
        The optimistic message has a temporary ID (e.g., a UUID generated on the client)
        and a status of "sending." When the server confirms the message, it returns
        the server-assigned ID and a server timestamp. Replace the temporary ID with
        the server ID and update the status to "sent."
      </p>
      <p>
        Failed sends: if the WebSocket send fails or the server returns an error,
        update the message status to "failed" and show a "retry" option. On retry,
        re-send the same message with the same temporary ID and reset to "sending"
        status.
      </p>
      <p>
        Message ordering: the optimistic message uses a client-generated timestamp.
        When the server returns the message with its server timestamp, the timestamp
        may differ (clock skew). If other messages arrived between the send and the
        confirm, the confirmed message's position in the sorted list may shift. Handle
        this gracefully: update the message's timestamp and re-sort the list. A visible
        jump in position is acceptable — it is a rare edge case, and the list sorts
        by server timestamps for consistency.
      </p>

      <h2>Typing Indicators</h2>
      <p>
        The typing indicator ("Alice is typing...") shows when another user is composing
        a message. The indicator disappears after the user stops typing or sends the
        message.
      </p>
      <p>
        Protocol: when the local user starts typing (first keystroke after an idle
        period), send a typing_start event via WebSocket. Send a typing_stop event
        when the user stops typing (detected by a debounce timer — if 3 seconds elapse
        without a keystroke, the user is considered stopped) or when the message is sent.
        Do not send a typing_start on every keystroke — only on the transition from
        idle to typing.
      </p>
      <p>
        The server broadcasts typing events to all other clients in the channel.
        The recipient's UI shows the typing indicator as long as the typing_start is
        active. Implement a timeout on the recipient's side: if no typing_stop event
        arrives within 5 seconds after a typing_start, automatically hide the indicator
        (in case the sender's connection dropped without sending a stop event).
      </p>
      <HighlightBlock as="p" tier="important">
        The typing indicator is rendered below the message list, not inside it. If it
        were inside the list, appearing and disappearing would shift the content and
        disrupt scroll position. Position it absolutely at the bottom of the chat
        container, overlapping the message list's last few pixels. The indicator's
        appearance and disappearance should not cause layout shifts in the message list.
      </HighlightBlock>

      <h2>Read Receipts</h2>
      <p>
        Read receipts show when a message has been seen by the recipient. In a two-person
        chat, this is a simple boolean — the message is "read" when the recipient has
        viewed it. In a group chat, it is a count of readers or a list of reader avatars
        (Slack-style seen indicators).
      </p>
      <p>
        The "viewed" event is triggered when a message scrolls into the viewport. Use
        an IntersectionObserver on each unread message element. When it becomes visible,
        send a message_seen event to the server with the message IDs that entered the
        viewport. Batch these: accumulate message IDs over 200ms, then send a single
        batch event rather than one event per message. The server updates the read
        receipt status and broadcasts updates to the sender.
      </p>
      <p>
        Display: the sender sees a small avatar or checkmark icon on their message
        when it is read. In a virtualized list, read receipt badges are managed per
        message item and updated when the real-time update arrives.
      </p>

      <h2>Message Grouping</h2>
      <p>
        Messages from the same sender sent within 2–5 minutes of each other are
        visually grouped (only the first shows the sender's avatar and name; subsequent
        messages in the group show no avatar, creating a compact visual block). This
        is a derived computation on the message list.
      </p>
      <p>
        For each message, compute whether it is the first in its group: it is the first
        if the previous message is from a different sender, or if the time gap between
        this message and the previous message exceeds the grouping threshold (5 minutes).
        This is O(n) over the message list and runs whenever the list changes. The
        result is a isGroupStart flag per message that drives conditional rendering
        of the avatar and sender name.
      </p>

      <h2>Accessibility</h2>
      <p>
        The message list should have role="log" with aria-live="polite" and
        aria-label="Message history." The aria-live region announces new incoming
        messages to screen reader users without requiring them to navigate to the
        message list.
      </p>
      <p>
        Each message item has an accessible structure: the sender's name and timestamp
        are visible text (not just visual design), and the message content is readable
        by screen readers. Emoji-only messages (which screen readers cannot meaningfully
        verbalize as pictograms) should have an aria-label on the message element with
        a descriptive name: aria-label="Alice reacted with thumbs up."
      </p>
      <p>
        The compose box should announce its placeholder text and character count (for
        messages with limits) via aria-label and aria-description. Typing indicator
        changes should be announced via a separate aria-live="polite" element so
        screen reader users know when someone is typing.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How do you handle the race between initial fetch and real-time events?</h3>
      <p>
        Same pattern as the notification center: buffer real-time events that arrive
        during the initial fetch. Connect to the WebSocket before the fetch starts
        (to avoid missing events during the fetch window), but hold incoming messages
        in a buffer until the fetch completes. After the fetch populates the store,
        replay the buffered messages and deduplicate by ID. This ensures no messages
        are missed during the load window. The alternative — connecting to WebSocket
        after the fetch — risks missing messages sent during the fetch round-trip time.
      </p>

      <h3>Q: How does the scroll anchor approach work with a virtualized list?</h3>
      <p>
        CSS scroll anchoring operates on the DOM, but virtualized lists remove elements
        from the DOM when they scroll out of view. This means the anchor element may
        not exist when new content is prepended. The manual approach is required for
        virtualized lists: before prepending new messages, record the top item's offset
        (virtualList.scrollToIndex with alignment 'start' gives the item's current
        viewport position). After prepending, the virtual list's internal offset
        accounting should adjust automatically if the library supports prepend-aware
        mode (Virtuso's firstItemIndex prop or react-virtual's initialScrollIndex).
        Without explicit library support, store the visible item index, measure its
        new rendered offset after prepend, and call scrollToOffset with the delta.
      </p>

      <h3>Q: How do you implement jump-to-message (clicking a reply preview to jump to the original message)?</h3>
      <p>
        The reply preview shows the original message's text. Clicking it should
        navigate to the original message, which may be far up in the history (not
        in the current DOM or even in the current loaded window). The flow: fetch
        the target message by ID from the API. If the message's timestamp is within
        the currently loaded range, scroll to it (using the virtual list's scrollToIndex
        if virtualized). If it is outside the loaded range, fetch messages around the
        target timestamp (a page centered on the target's timestamp), replace the
        current message list window with this fetched page, and scroll to the target
        message. Highlight the target message temporarily (pulsing animation) to orient
        the user. The "jump to latest" button becomes available so the user can return
        to the live edge.
      </p>

      <h3>Q: How do you handle image messages where the image dimensions are unknown until load?</h3>
      <p>
        Unknown image dimensions cause CLS: the list height changes when the image
        loads, shifting the scroll position. Two solutions: reserve space before load
        using a placeholder div sized to the expected image dimensions (sent in the
        message metadata — the server knows the image dimensions from upload), or use
        the CSS aspect-ratio property with a known aspect ratio to create a stable
        placeholder. When the image loads, it fills the placeholder without changing
        the layout. If the server does not provide dimensions (for third-party images
        in link unfurls), use a fixed-height placeholder (e.g., 200px) and accept the
        small layout shift when the image loads — or disable link unfurls for links
        without known dimensions.
      </p>

      <h3>Q: How do you design the message input for a Slack-like rich text experience?</h3>
      <p>
        A rich message input (bold, italic, code, mentions, emoji) requires a rich text
        editor rather than a plain textarea. Use a lightweight editor like Tiptap or
        Plate.js, configured with only the relevant extensions. The document model
        should be a small subset of the full editor schema: paragraphs, inline marks
        (bold, italic, code, link), mention nodes, and emoji nodes. Mentions are
        inserted by typing "@" and selecting from an autocomplete dropdown (fetched from
        the members API, filtered by the typed query). Emoji are inserted by typing ":"
        and selecting from a picker. On submit, serialize the editor content to the
        server's message format — either a custom JSON schema or Markdown. The server
        stores the structured format; the chat UI re-renders it using the same schema
        to display formatted messages.
      </p>
    </ArticleLayout>
  );
}
