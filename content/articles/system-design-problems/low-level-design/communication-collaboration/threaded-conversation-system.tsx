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

export default function ThreadedConversationSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

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
        <h2>⚙️ Functional Requirements</h2>

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
        <h2>📊 Non-Functional Requirements</h2>

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

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/comment-thread-architecture.svg"
        alt="Threaded Conversation Architecture"
        caption="Comment tree source → flatten visible tree (depth-capped) → virtualized renderer → per-comment with reply composer + collapse + lazy-load. Optimistic post; real-time additions via WebSocket; permalinks via URL fragment."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
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
        <h2>🧱 Component Architecture</h2>
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
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Tree structure with expand state and
          loaded-children cache in <Highlight tier="important">external
          store. Real-time additions go into</Highlight>
          the same tree. Optimistic posts
          tracked separately until confirmed.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
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
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Virtualization on the flattened tree.
          Lazy-load replies <Highlight tier="important">on expand. Memoized
          comments (re-render only</Highlight> on relevant
          property change). Real-time inserts
          batched.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial">Indentation makes hierarchy visible.
          Visual guides aid following deep
          threads. Collapse toggles unobtrusive.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Reply composer inline near the target.
          Optimistic posts feel instant.
          Real-time additions banner-surface
          rather than auto-scroll.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
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
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Comment content sanitized. Server
          enforces post permissions. Rate-limit.
          <Highlight tier="important">Markdown opt-in via sanitizer. URLs in</Highlight>
          comments validated and rendered with
          safe rel attributes.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="crucial">Unit tests for tree flattening with
          depth cap. Integration tests: expand</HighlightBlock>
<HighlightBlock as="p" tier="important">loads replies; reply optimistic posts;
          real-time additions insert</HighlightBlock>
<HighlightBlock as="p" tier="important">correctly.
          Permalink resolution tests.
          Accessibility tests for tree role.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
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
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Generic over comment <Highlight tier="important">shape. Pattern
          reuses for blog comments,</Highlight> issue
          threads, discussion forums.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings via i18n. <Highlight tier="important">Timestamps via
          Intl.RelativeTimeFormat. RTL flips
          indentation</Highlight> direction via CSS
          logical properties.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

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
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Threaded read state per user. AI-
          <Highlight tier="important">summarized branches. Sentiment
          highlighting. Cross-thread linking.</Highlight>
          Real-time presence in threads (who&rsquo;s
          reading).
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How do you render deeply
          nested threads?</strong> Flatten the
          visible tree to a 1D list with
          per-comment depth metadata; render
          via 1D virtualization. Cap depth at
          a threshold; deeper renders flat
          with a &ldquo;Continue thread&rdquo;
          link.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How does lazy-load of
          replies work?</strong> Server pre-loads
          some replies; rest fetched on
          expand. The tree node has a
          &ldquo;Load more&rdquo; affordance
          when there are unloaded children.
        </HighlightBlock>

        <p>
          <strong>3. How are real-time additions
          handled?</strong> WebSocket inserts
          new comments into the tree at the
          appropriate parent. If the parent is
          collapsed, show a count badge but
          don&rsquo;t expand. If user is
          mid-scroll, surface a banner rather
          than auto-jumping.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>4. How are optimistic posts
          handled?</strong> Insert with
          temporary id and posting status.
          Server confirms; map to real id;
          status changes to confirmed. Failure
          rolls back with retry.
        </HighlightBlock>

        <p>
          <strong>5. How does permalink
          work?</strong> URL fragment encodes
          the comment id. On mount, expand
          ancestors of that comment, scroll to
          it, highlight.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>6. What happens on depth
          cap?</strong> Deeper replies render
          flat with a &ldquo;Continue this
          thread&rdquo; link to a focused view
          where indentation resets at depth 0.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>7. How is this
          accessible?</strong> Tree role with
          proper ARIA (or accessible flat
          list with parent context). Each
          comment focusable. Reply composer
          accessible. Real-time additions
          announce in chunks.
        </HighlightBlock>

        <p>
          <strong>8. How does this differ from
          chat?</strong> Chat is linear (newest
          at bottom); thread is hierarchical
          (replies under parents). Chat has
          presence and typing; thread has
          collapse/expand and lazy-load.
          Different mental models for
          different products.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">Indentation preserves
          hierarchy; depth cap preserves
          readability; lazy-load scales to
          large threads. Permalinks</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">make
          conversations linkable. The result is
          discussions that can grow large
          without becoming unusable.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
