"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-threaded-conversation-system",
  title: "Design a Threaded Conversation System",
  description:
    "LLD for threaded conversations: nested replies, lazy-load, optimistic post, collapsing depth, and accessibility for tree-structured discussions.",
  category: "low-level-design",
  subcategory: "communication-collaboration",
  slug: "threaded-conversation-system",
  wordCount: 6000,
  readingTime: 32,
  lastUpdated: "2026-04-30",
  tags: ["lld", "threaded-conversation", "comments", "tree", "react"],
  relatedTopics: [
    "chat-messaging-ui",
    "tree-view-folder-explorer",
    "infinite-scroll-virtualized-list",
  ],
};

export default function ThreadedConversationSystemArticle(){return <ArticleLayout metadata={metadata}>
<section><h1>Design a Threaded Conversation System</h1><h2>Definition &amp; Context</h2><p>Design a Threaded Conversation System is an implementation-heavy low-level design problem covering normalized comments, lazy replies, cursors, optimistic posting, edits, moderation, reactions, and collapse state. A principal-level answer must define ordering, ephemeral versus durable state, reconnect behavior, rollback, abuse controls, privacy, cost, and observability.</p><p>Store comments by id with parent references and ordered child lists. Optimistic drafts remain separate from committed comments. The core structures are comment map, root cursor, child cursors, parent-child index, optimistic ids, edit version, moderation state, reaction counts, and collapsed set.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/threaded-conversation-system-runtime.svg" alt="Design a Threaded Conversation System runtime" caption="Real-time flow from input through merge policy and UI projection." /></section>
<section><h2>Core Concepts</h2><p>The retained deep dive below captures the topic-specific mechanics.</p><section>
        <h3>🎯 Problem Context &amp; Scope Definition</h3>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a threaded conversation
          system — the comments-with-replies UI seen
          on Reddit, Hacker News, blog comments,
          GitHub issue threads, and Slack thread
          panels. Users post messages; others
          reply; replies have replies. The hierarchy
          can be deep, with hundreds of comments
          per post and dozens of replies per
          comment. The component must handle
          deeply nested structures, lazy-load
          collapsed branches, optimistic post,
          collapsing depth at some maximum, and
          remain accessible.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are: rendering deeply
          nested trees efficiently; depth caps
          (after some level, replies render as
          flat continuation rather than infinitely
          indented); collapsing/expanding branches;
          lazy-loading replies (a comment with
          1000 replies shouldn&rsquo;t fetch them
          all up front); optimistic post with
          rollback; navigation between comments
          (jump to parent, jump to next unread);
          accessibility for tree-structured
          conversation.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users read and reply to threaded
          discussions. They expect Reddit-class
          fluency: collapse a branch, expand
          another, post a reply, see optimistic
          state, navigate. Engineering teams plug
          in: provide a comment source; the
          runtime handles UI.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend supports tree fetch (with depth
          and pagination per branch) and post.
          Real-time updates for new comments via
          WebSocket. Modern browsers.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement chat (separate). We
          do not implement comment moderation
          tooling (separate). We do not implement
          rich text in comments (use Rich Text
          Editor for that part).
        </HighlightBlock>
      </section>

      <section>
        <h3>⚙️ Functional Requirements</h3>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Render the comment tree with indentation
          for depth. Cap depth after a threshold
          (e.g. 6 levels) and render deeper as
          flat continuation. Collapse and expand
          branches. Lazy-load replies on expand
          when a branch is large. Reply to any
          comment via inline composer. Post
          optimistically with status; rollback on
          failure. Show new comments arriving in
          real time. Sort options (newest, top,
          oldest). Permalink to a specific
          comment. Empty state.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Vote / upvote per comment. Highlight
          unread or new-since-last-visit
          comments. Search within thread. Mention
          notifications. Edit and delete with
          history. Mark thread as resolved
          (issue trackers). Threading depth
          configuration per product. Inline
          quoting.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Moderation tooling, voting algorithms,
          spam detection.
        </HighlightBlock>
      </section>

      <section>
        <h3>📊 Non-Functional Requirements</h3>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Initial render of the visible tree under
          200 ms. Smooth scroll. Expanding a
          branch lazy-fetches its replies without
          blocking. Real-time additions don&rsquo;t
          flood re-renders.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Optimistic posts roll back on failure.
          Lazy-load failures show retry. Real-time
          events deduped by id.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Comment content sanitized. Server
          enforces post permissions. Rate-limit
          posts.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Tree structure announced. Each comment
          is a focusable region. Reply composer
          accessible. Collapse/expand keyboard-
          accessible.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          Comment source adapter. Renderers per
          comment type. Plugins for voting, edit
          history.
        </HighlightBlock>
      </section>

      

      <section>
        <h3>🧠 Solution Approach</h3>
        <HighlightBlock as="p" tier="crucial">
          The system has four parts: <strong>tree
          source</strong> (fetch with depth and
          per-branch pagination), <strong>tree
          flattener</strong> (compute the visible
          flat list from the expanded tree),
          <strong> virtualized renderer</strong>{" "}
          (render only visible comments),
          <strong> post pipeline</strong>{" "}
          (optimistic + retry).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>tree source</strong> exposes
          <code> getRoot(sort, page)</code> for
          top-level comments and
          <code> getReplies(commentId, cursor)</code>{" "}
          for branches. Server may pre-load some
          replies (typically the first few) and
          page the rest. The client maintains a
          tree structure with per-node
          load-more state.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>tree flattener</strong>{" "}
          walks the tree depth-first, including
          each expanded comment&rsquo;s loaded
          children. Collapsed comments don&rsquo;t
          contribute their subtree. Depth cap
          applied: after the threshold, deeper
          replies render flat (with a
          &ldquo;Continue this thread &rarr;&rdquo;
          link to view in a focused thread view).
          The flattened list drives the
          virtualizer.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>virtualized renderer</strong>{" "}
          uses 1D virtualization on the
          flattened list. Indentation is CSS
          padding-left proportional to depth.
          Visual guides (vertical lines from
          parent to child) help users follow
          the structure.
        </HighlightBlock>
        <p>
          On <strong>expand</strong>, the comment&rsquo;s
          children mount. If not yet loaded, the
          source fetches them; a placeholder
          shows during loading. On response,
          children render.
        </p>
        <p>
          On <strong>collapse</strong>, children
          are hidden but kept in the cache so
          re-expand is instant.
        </p>
        <HighlightBlock as="p" tier="important">
          On <strong>reply</strong>, an inline
          composer opens beneath the target
          comment. Typing produces a draft;
          submitting fires an optimistic post:
          a placeholder comment appears
          immediately under the parent with
          status &ldquo;posting&rdquo;. Server
          response confirms; on failure, retry
          surfaces.
        </HighlightBlock>
        <p>
          On <strong>real-time addition</strong>:
          WebSocket delivers new comments. They
          insert into the tree at the appropriate
          parent. If the user is mid-scroll, we
          surface a banner (&ldquo;X new
          comments&rdquo;) rather than
          auto-jumping. Inserted comments
          highlight briefly.
        </p>
        <p>
          <strong>Depth cap</strong>: after a
          configured depth (e.g. 6), deeper
          replies render flat (no further
          indentation). A &ldquo;Continue this
          thread&rdquo; link opens a focused view
          showing only that subtree, where
          indentation resets. This balances
          readability with hierarchy fidelity.
        </p>
        <p>
          <strong>Permalink</strong>: each comment
          has a URL fragment (e.g.
          <code> #comment-42</code>). Pasting the
          URL opens the thread, expands ancestors
          of that comment, scrolls to it, and
          highlights it.
        </p>
        <p>
          <strong>Sort</strong>: top-level (newest,
          top, oldest). Tree restructures on
          sort change. Branch-internal sorting
          can be different (often newest within
          a branch even when top-level is
          sorted by votes).
        </p>
      </section>

      <section>
        <h3>🧱 Component Architecture</h3>
        <HighlightBlock as="p" tier="crucial"><strong>ReplyComposer</strong>{" "}
          inline composer.
          <strong> CollapseToggle</strong> on
          parent comments.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important"><strong> SortControl</strong></Highlight> for
          top-level sort.
          <strong> RealtimeBanner</strong>{" "}
          surfaces new comments.</HighlightBlock>
      </section>

      <section>
        <h3>🔄 State Management</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Tree structure with expand state and
          loaded-children cache in <Highlight tier="important">external
          store. Real-time additions go into</Highlight>
          the same tree. Optimistic posts
          tracked separately until confirmed.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Data Flow &amp; Contracts</h3>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="crucial">Comment shape:</Highlight>{" "}
          <Highlight tier="important">
            <code>{` { id, parentId, authorId, body, createdAt, status?, replyCount? } `}</code>
          </Highlight>
          . Source contract:{" "}
          <code>{` { getRoot, getReplies, post, edit, delete } `}</code>.
        </HighlightBlock>
      </section>

      <section>
        <h3>⚡ Performance</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Virtualization on the flattened tree.
          Lazy-load replies <Highlight tier="important">on expand. Memoized
          comments (re-render only</Highlight> on relevant
          property change). Real-time inserts
          batched.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🎨 UX</h3>
        <HighlightBlock as="p" tier="crucial">Indentation makes hierarchy visible.
          Visual guides aid following deep
          threads. Collapse toggles unobtrusive.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Reply composer inline near the target.
          Optimistic posts feel instant.
          Real-time additions banner-surface
          rather than auto-scroll.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>♿ Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">Tree structure with proper ARIA
          (<code>role=&quot;tree&quot;</code>,
          <code> role=&quot;treeitem&quot;</code>,
          <code> aria-level</code>,</HighlightBlock>
<HighlightBlock as="p" tier="important"><code> aria-expanded</code>) where
          appropriate, or a flat list with
          accessible parent indication
          (&ldquo;Reply to Alice: ...&rdquo;).</HighlightBlock>
<HighlightBlock as="p" tier="important">Each comment is focusable. Reply
          composer accessible. Real-time
          additions announce in chunks.</HighlightBlock>
      </section>

      <section>
        <h3>🔐 Security</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Comment content sanitized. Server
          enforces post permissions. Rate-limit.
          <Highlight tier="important">Markdown opt-in via sanitizer. URLs in</Highlight>
          comments validated and rendered with
          safe rel attributes.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🧪 Testing</h3>
        <HighlightBlock as="p" tier="crucial">Unit tests for tree flattening with
          depth cap. Integration tests: expand</HighlightBlock>
<HighlightBlock as="p" tier="important">loads replies; reply optimistic posts;
          real-time additions insert</HighlightBlock>
<HighlightBlock as="p" tier="important">correctly.
          Permalink resolution tests.
          Accessibility tests for tree role.</HighlightBlock>
      </section>

      <section>
        <h3>🚨 Edge Cases</h3>
        <HighlightBlock as="p" tier="crucial">Permalink to a
          deleted comment: surface
          &ldquo;Comment unavailable&rdquo;.
          Real-time additions in a branch the
          user has collapsed: don&rsquo;t expand;</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">show count badge on the parent.
          Server returns deleted comment
          mid-tree: render as &ldquo;deleted&rdquo;
          placeholder so children remain
          contextual.</Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🔁 Reusability</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over comment <Highlight tier="important">shape. Pattern
          reuses for blog comments,</Highlight> issue
          threads, discussion forums.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>🌍 Internationalization</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings via i18n. <Highlight tier="important">Timestamps via
          Intl.RelativeTimeFormat. RTL flips
          indentation</Highlight> direction via CSS
          logical properties.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h3>⚖️ Trade-offs</h3>

        <h3>Indented vs flat threading</h3>
        <HighlightBlock as="p" tier="important">
          Indented preserves hierarchy. Flat
          (Slack-style) is simpler to read but
          loses structure. Indented with depth
          cap balances both.
        </HighlightBlock>

        <h3>Lazy vs eager replies</h3>
        <HighlightBlock as="p" tier="important">
          Lazy scales to large threads. Eager
          is simpler for small threads. Most
          products need lazy.
        </HighlightBlock>

        <h3>Auto-scroll on real-time vs banner</h3>
        <HighlightBlock as="p" tier="important">
          Banner respects user reading;
          auto-scroll interrupts. Banner is
          right.
        </HighlightBlock>

        <h3>Virtualize the flattened tree vs the
        hierarchy</h3>
        <HighlightBlock as="p" tier="crucial">
          Flattened-list virtualization is
          straightforward 1D. Tree
          virtualization is more complex
          without benefit. Always flatten.
        </HighlightBlock>
      </section>

      <section>
        <h3>🔮 Future Improvements</h3>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Threaded read state per user. AI-
          <Highlight tier="important">summarized branches. Sentiment
          highlighting. Cross-thread linking.</Highlight>
          Real-time presence in threads (who&rsquo;s
          reading).
        </Highlight></HighlightBlock>
      </section></section>
<section><h2>Architecture &amp; Flow</h2><p>Separate durable records, optimistic intent, transport events, ephemeral awareness, rendered projection, and telemetry. Every connection, timer, cursor, replay buffer, subscription, and retry queue needs an explicit owner and cleanup path.</p><p>Store comments by id with parent references and ordered child lists. Optimistic drafts remain separate from committed comments.</p><ArticleImage src="/diagrams/system-design-problems/low-level-design/communication-collaboration/threaded-conversation-system-recovery.svg" alt="Design a Threaded Conversation System recovery" caption="Recovery flow: classify gaps, retain stable truth, replay safely, and emit evidence." /></section>
<section><h2>Trade offs &amp; Comparison</h2><p>Flat timelines are simpler; normalized threads are justified for reply context, lazy loading, and moderation.</p><p>Server versions are authoritative for edits and moderation. Creation is provisional and reactions may merge eventually. Scale pressure comes from deep threads, hot roots, deleted parents, concurrent edits, pagination, moderation, and duplicate retries. Bound queues, dedupe events, expire ephemeral state, and degrade predictably.</p></section>
<section><h2>Best practices</h2><p>Use stable ids, event sequences, idempotency keys, monotonic watermarks, TTLs, replay cursors, bounded buffers, authorization checks, and cleanup. Test reconnect gaps, duplicates, stale events, offline recovery, privacy settings, and accessibility announcements.</p><p>Measure latency, backlog, reconnect rate, gap recovery, retries, stale drops, TTL expiry, and accessibility regressions without logging sensitive content.</p><h3>Operational implementation: normalized thread graph and moderation tombstones</h3><p>Store comments by id and child lists by parent. Create optimistically with idempotency keys, retain tombstones for deleted parents, page replies lazily, condition edits on version, and keep moderation state authoritative.</p><p>Define explicit metrics for accepted events, duplicate drops, stale drops, replay gap size, reconnect duration, queue depth, TTL expiry, degraded-mode entry, authorization denial, and rollback outcome. Redact user content and sensitive identifiers from telemetry. Test duplicate delivery, out-of-order events, disconnect during mutation, hidden tabs, unmount cleanup, multiple tabs, permission removal, burst traffic, and a rollback to the previous policy version.</p></section>
<section><h2>Common Pitfalls</h2><p>Common failures include treating ephemeral state as durable, trusting arrival order, leaking timers or sockets, missing dedupe, unbounded replay, and hiding degraded connectivity.</p><p>For this topic, dedupe retries, retain tombstones, rollback rejected edits, page children lazily, and preserve navigation context.</p></section>
<section><h2>Real-world use cases</h2><p>This design applies to collaborative products where transport, persistence, and UI projection fail independently. Inject product policy for authorization, retention, fallback, and observability explicitly.</p></section>
<section><h2>Common interview question with detailed answer</h2><h3>How do you model state?</h3><p>Store comments by id with parent references and ordered child lists. Optimistic drafts remain separate from committed comments.</p><h3>What breaks at scale?</h3><p>deep threads, hot roots, deleted parents, concurrent edits, pagination, moderation, and duplicate retries.</p><h3>What consistency applies?</h3><p>Server versions are authoritative for edits and moderation. Creation is provisional and reactions may merge eventually.</p><h3>How do you recover?</h3><p>dedupe retries, retain tombstones, rollback rejected edits, page children lazily, and preserve navigation context.</p><h3>Why this architecture?</h3><p>Flat timelines are simpler; normalized threads are justified for reply context, lazy loading, and moderation.</p></section>
<section><h2>References</h2><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">MDN WebSocket</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController" target="_blank" rel="noreferrer">MDN AbortController</a></li><li><a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noreferrer">WAI-ARIA APG</a></li><li><a href="https://react.dev/learn/sharing-state-between-components" target="_blank" rel="noreferrer">React state ownership</a></li></ul></section>
</ArticleLayout>}