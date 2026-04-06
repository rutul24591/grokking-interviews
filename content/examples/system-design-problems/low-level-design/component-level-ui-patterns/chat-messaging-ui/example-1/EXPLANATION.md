# Chat / Messaging UI — Implementation Walkthrough

## Architecture

```
┌─────────────────────────────────────┐
│         ChatContainer                │
├─────────────────────────────────────┤
│  MessageList (virtualized)           │
│  ┌─────────────────────────────┐     │
│  │ ○ John: Hey!           2pm │     │
│  │   Hey there!                │     │
│  │ ● You: Hi!            2:01 │     │
│  │   How are you?              │     │
│  │ ○ John is typing...         │     │
│  └─────────────────────────────┤     │
├─────────────────────────────────────┤
│  [Type a message...]      [Send]    │
└─────────────────────────────────────┘
```

## Key Design Decisions

1. **Normalized message store** — Map-based lookup for O(1) message access, ordered array for rendering
2. **Optimistic sends** — Message appears instantly with temp ID, confirmed/rejected by server
3. **Scroll manager** — Tracks "is at bottom" flag, preserves offset on load-more, auto-scrolls only when appropriate
4. **WebSocket with reconnect** — Exponential backoff, message buffering during offline, reconciliation on reconnect
5. **Typing indicator with expiry** — Debounced send, 5-second auto-expiry

## File Structure

- `lib/chat-types.ts` — TypeScript interfaces (Message, ChatState, MessageStatus)
- `lib/message-store.ts` — Zustand store with optimistic sends, read receipts, pagination
- `lib/message-grouper.ts` — Groups consecutive messages by sender within 5-min window
- `lib/scroll-manager.ts` — Tracks isAtBottom, preserves scroll offset on prepend
- `lib/typing-manager.ts` — Debounced typing broadcast with 5s auto-expiry
- `hooks/use-chat.ts` — Main orchestrator hook
- `hooks/use-message-send.ts` — Optimistic send with rollback on failure
- `hooks/use-message-receive.ts` — WebSocket message handler
- `components/chat-container.tsx` — Root chat with message list, input, typing indicator
- `components/message-list.tsx` — Virtualized message renderer with grouping
- `components/message-bubble.tsx` — Individual message with status indicator, timestamp
- `components/message-input.tsx` — Text input with Enter-to-send, typing broadcast
- `components/typing-indicator.tsx` — Animated dots with auto-expiry

## Performance

- Virtualization: only 20-30 messages rendered at a time
- Batched read receipts: one API call per 500ms window
- Message memoization: React.memo with comparator on content/status/reactions

## Testing

- Unit: store (optimistic add/confirm/rollback), grouper, scroll manager
- Integration: send flow, receive flow, typing indicator debounce/expiry
- Accessibility: aria-live for new messages, keyboard navigation, screen reader announcements
