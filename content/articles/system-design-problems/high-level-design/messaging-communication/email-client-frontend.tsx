"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-email-client-frontend",
  title: "Design Email Client (Gmail-like)",
  description:
    "Architecture for a Gmail-like email client frontend: IMAP/JMAP synchronization with delta sync, virtual scroll for inbox with thousands of messages, rich text compose with autosave drafts to IndexedDB, thread grouping and label management, full-text search with Elasticsearch query syntax, attachment upload with resumable multipart, undo-send with 5-second cancel window, spam filtering feedback loop, keyboard shortcut system, and offline inbox access via service worker.",
  category: "high-level-design",
  subcategory: "messaging-communication",
  slug: "email-client-frontend",
  wordCount: 5000,
  readingTime: 30,
  lastUpdated: "2026-05-12",
  tags: ["hld", "email", "gmail", "jmap", "virtual-scroll", "drafts", "full-text-search", "thread-view", "undo-send"],
  relatedTopics: ["whatsapp-slack-frontend", "threaded-messaging-system"],
};

export default function EmailClientFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">An email client frontend like Gmail manages a fundamentally different data model from a chat application: messages are grouped into threads, each thread has labels (not channels), the inbox can contain hundreds of thousands of messages, and message bodies can be complex HTML with embedded images and attachments. Gmail serves 1.8 billion users with inboxes ranging from empty to 15GB of archived messages. The UI must provide instant search across all historical email, smooth scrolling through thousands of inbox rows, and a rich compose experience — all while maintaining offline access and syncing efficiently when connectivity is restored.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The key challenges are different from chat: email is pull-based (the client polls or streams deltas from the server, not a persistent connection per message), bodies are large and expensive to fetch for every scroll (inbox shows only headers), and compose is a long-form interaction that must survive browser crashes (drafts autosaved every 10 seconds). The undo-send window (Gmail's "Undo" button that appears for 5 seconds after sending) requires delaying actual SMTP delivery — the message is queued server-side for 5 seconds before being sent.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Inbox synchronization, thread view, compose with autosave drafts, full-text search, attachment handling, and undo-send. Not in scope: SMTP/IMAP server implementation, spam filtering algorithms, or native mobile email client design.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Inbox synchronization:</strong> The inbox reflects the server state within 30 seconds without user action. New emails arrive via server-sent events (SSE) or WebSocket push notifications with email metadata (subject, sender, snippet, timestamp, unread flag). Full message bodies are fetched on-demand when the user opens a thread. The JMAP protocol provides delta sync — the client sends its current state token and receives only changes since the last sync, not the full inbox.</HighlightBlock>
          <li><strong>Thread view:</strong> Emails in the same conversation (matching Message-ID / In-Reply-To headers) are grouped into a thread. The thread view shows collapsed summaries of read messages and the expanded latest message. Clicking a collapsed summary expands it. Thread grouping is computed on the server and cached; the client renders the pre-grouped thread structure.</li>
          <li><strong>Compose and drafts:</strong> The compose window is a rich text editor (Tiptap or Quill) that autosaves to IndexedDB every 10 seconds and on every close/navigate. Drafts are synced to the server every 30 seconds (not on every keystroke — too expensive). If the browser crashes, the draft is recovered from IndexedDB on next open. Attachments are uploaded immediately on selection (parallel multipart upload) and referenced by a server-assigned attachment ID in the draft.</li>
          <HighlightBlock as="li" tier="important"><strong>Full-text search:</strong> Search queries the backend (Elasticsearch) and returns matching threads with highlighted snippets. Search results appear within 500ms of the query. As-you-type suggestion (subject/sender autocomplete) uses a separate lightweight endpoint with a 300ms debounce. Advanced search syntax (from:, to:, subject:, after:, before:, has:attachment) is parsed client-side and translated to Elasticsearch DSL.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Performance:</strong> Inbox list renders at 60fps with virtual scrolling (TanStack Virtual). Initial inbox load (first 50 thread headers) completes in under 1 second. Opening a thread fetches the full body in under 500ms (body is typically 10–100KB). Compose opens instantly (no network request required to start composing).</li>
          <HighlightBlock as="li" tier="important"><strong>Offline access:</strong> The last 100 thread headers and the 10 most recently opened full thread bodies are cached in IndexedDB via the service worker. While offline, the user can read cached threads and compose new emails (queued in IndexedDB, sent on reconnection). Search is unavailable offline (displayed as "Search requires an internet connection").</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Undo send:</strong> After clicking Send, a toast notification with "Undo" appears for 5 seconds. Clicking Undo cancels the send. The message is held in a server-side queue (status: pending) for 5 seconds before SMTP delivery. If the client cancels within 5 seconds (DELETE /api/outbox/&#123;messageId&#125;), the message is discarded. After 5 seconds, the message transitions to status: delivered.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The architecture separates inbox metadata from message bodies. The Inbox Layer (thread list, unread counts, labels) is synchronized via JMAP delta sync — lightweight state tokens, small payloads, fast updates. The Body Layer (full message HTML, attachments) is fetched on-demand per thread open — lazy loading prevents downloading 1.8GB of email on login. The Compose Layer is entirely local until sent — the rich text editor writes to IndexedDB, syncs to server in background, and the attachment uploader runs independently. The Search Layer is a stateless query against the backend search cluster — search results are not cached locally (stale search results are misleading). The Sync Engine coordinates these layers: it listens to SSE push events for new email notifications, manages the JMAP state token, and handles reconnection gap-fill.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/messaging-communication/email-client-frontend.svg"
          alt="Gmail-like email client frontend: inbox sync (SSE push: new email metadata; JMAP delta: GET /jmap?sinceState=tok123 → only changes; state token updated; thread headers in IndexedDB; 50 headers/page virtual scroll; body fetch on-demand: GET /messages/{id}/body lazy), thread view (thread grouping by Message-ID/In-Reply-To pre-computed server-side; render collapsed read messages + expanded latest; click to expand; inline image: Content-ID replaced with data URL; quote collapsing: long quoted text → Show more), compose + drafts (Tiptap rich text editor; autosave IndexedDB every 10s; server sync every 30s; crash recovery from IDB on reopen; attachment: upload multipart immediately → server returns attachmentId; reference by ID in draft body), undo send (Send clicked → POST /api/outbox status=pending; 5s countdown toast 'Undo'; Undo → DELETE /api/outbox/{id} → discarded; no Undo → SMTP delivery after 5s; server-side delay queue), full-text search (Elasticsearch DSL; 300ms debounce as-you-type; client-side parse: from: to: subject: after: → query DSL; highlight snippets in results; search unavailable offline → graceful message)."
          caption="JMAP delta sync (state token, only changed threads), SSE push for new email metadata, virtual scroll inbox, on-demand body fetch, Tiptap autosave to IndexedDB (10s local, 30s server), attachment pre-upload with ID reference, undo-send 5s server queue, Elasticsearch full-text search with client-side query DSL parse"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">JMAP Delta Synchronization</h3>
        <HighlightBlock as="p" tier="important">JMAP (JSON Meta Application Protocol, RFC 8620) is an email protocol designed for efficient client-server sync. Unlike IMAP (which requires the client to poll for every change and download full message metadata), JMAP provides a state token per mailbox. The client sends its current state token with each sync request: POST /api/jmap with body &#123;"using": ["urn:ietf:params:jmap:mail"], "methodCalls": [["Email/changes", &#123;"sinceState": "current_token"&#125;, "0"]]&#125;. The server returns only the IDs of emails that have been created, updated, or destroyed since that state token, plus a new state token. The client fetches the full metadata for changed emails in a follow-up call. This means a sync round trip typically transfers a few hundred bytes (a list of changed IDs) rather than the full inbox.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The state token is stored in IndexedDB alongside the thread headers. On page load, the client reads the cached state token, performs a delta sync to catch up from the last session, and then establishes an SSE connection for real-time push notifications of new emails. New email notifications via SSE contain only the thread ID — the client fetches the thread header via JMAP in a background call and inserts it into the inbox list.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Virtual Scroll Inbox</h3>
        <HighlightBlock as="p" tier="important">The inbox thread list uses TanStack Virtual with a fixed row height (72px per thread row). For an inbox with 50,000 threads, only ~15 rows are in the DOM at any time. The virtualizer maintains a top spacer div (height = rowHeight × firstRenderedIndex) and a bottom spacer div (height = rowHeight × (totalCount - lastRenderedIndex)) to maintain the correct scroll container height. Thread rows show: sender avatar (first letter, cached as canvas-drawn data URL), sender name, subject, snippet (first 100 characters of body), timestamp, and unread/label badges.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Infinite scroll: when the user scrolls within 200px of the bottom of the loaded thread list, a fetch is triggered for the next 50 threads (GET /api/threads?offset=50&amp;limit=50). The new threads are appended to the Zustand thread list and the virtualizer re-renders. The total count (for the spacer calculation) is returned with the first page response and does not change during the session unless emails are deleted or labels change.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Rich Text Compose and Autosave</h3>
        <HighlightBlock as="p" tier="important">The compose window uses Tiptap (ProseMirror-based) with extensions for bold, italic, link, inline image, and mention. The editor's content is serialized as HTML (for email compatibility) and stored in IndexedDB every 10 seconds via a setInterval. The draft record in IndexedDB has the structure: &#123;id, to, cc, subject, htmlBody, attachmentIds, updatedAt&#125;. On every compose close or page navigate, a final save is triggered synchronously before the component unmounts (using the beforeunload event and a synchronous IndexedDB write via idb-keyval). When the compose window reopens, the draft is restored from IndexedDB instantly without a network request.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Attachments are uploaded immediately when the user selects files (not waiting for Send). The upload uses the multipart/form-data endpoint (POST /api/attachments) with a progress indicator. Large attachments (&gt;10MB) use resumable upload: the server assigns an upload URL and the client sends 1MB chunks, reporting progress per chunk. If the upload is interrupted, it resumes from the last acknowledged chunk. The server returns an attachmentId that is embedded in the draft's HTML body as a data attribute — on Send, the server resolves these IDs into email attachment parts.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Keyboard Shortcut System</h3>
        <HighlightBlock as="p" tier="important">Gmail's keyboard shortcuts (e: archive, r: reply, f: forward, j/k: navigate, #: delete) are a defining power-user feature. The shortcut system is a global event listener (document.addEventListener("keydown")) that: (1) checks if the user is in a text input or compose window — if so, shortcuts are disabled (to avoid archiving an email when the user types "e" in the search box); (2) matches the key to a shortcut registry (a Map of key → action); (3) dispatches the action to the appropriate store method. Shortcuts are configurable per user (stored in user preferences). A shortcut help overlay (? key) shows the full shortcut list with the same sheet animation as Gmail's keyboard shortcut help modal.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Thread view grouping on client vs. server: grouping emails into threads by Message-ID / In-Reply-To can be done client-side (after fetching all message headers) or server-side (the server returns pre-grouped threads). Client-side grouping requires downloading all message headers before the inbox is interactive — for 50,000 emails, this is impractical. Server-side grouping is the correct approach: the server maintains thread state, and the client receives pre-grouped thread objects. The trade-off: the server must maintain a thread index and update it as new messages arrive, which is additional server complexity. Gmail's server-side threading has been refined over 20 years and handles edge cases (re-threading when a reply arrives late, de-threading when the subject line changes significantly).</HighlightBlock>
        <HighlightBlock as="p" tier="important">HTML email rendering security: email HTML is untrusted user content — rendering it naively in an iframe allows phishing (display a fake login form), tracking (1x1 pixel images that report open events), and CSS injection (the email's styles leak into the parent page). Gmail renders email bodies in a sandboxed iframe with: sandbox="allow-same-origin" to prevent script execution; a CSS sanitizer that strips external style sheet links; image blocking by default (user must click "Display images" to load external images); and a Content Security Policy that prevents form submissions to external URLs. These protections are non-negotiable for an email client.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A Gmail-like email client is built on four systems: (1) JMAP delta sync (state token → only changed IDs returned per sync, SSE push for real-time new email notification, thread headers in IndexedDB, body fetched on-demand); (2) virtual scroll inbox (TanStack Virtual fixed 72px rows, ~15 DOM nodes, infinite scroll at 200px-from-bottom, total count spacer); (3) compose with autosave (Tiptap ProseMirror, 10s IndexedDB autosave, 30s server sync, beforeunload final save, resumable multipart attachment upload with progress, attachmentId reference in draft HTML); and (4) undo send (Send → server status=pending → 5s client toast → DELETE to cancel → SMTP delivery after timeout). Email HTML is rendered in a sandboxed iframe with image blocking and CSS sanitization. Search queries Elasticsearch with client-side DSL parse for advanced operators. The core constraint: email bodies are too large and numerous to prefetch — every architectural decision must be evaluated against the cost of fetching on-demand vs. the benefit of instant access.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
