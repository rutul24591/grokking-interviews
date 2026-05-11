"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-rich-text-editor",
  title: "Design a Rich Text Editor",
  description:
    "LLD for a rich text editor: document model, selection, commands, undo/redo, mentions, image upload, collaborative hooks, and accessibility.",
  category: "low-level-design",
  subcategory: "file-media-content-systems",
  slug: "rich-text-editor",
  wordCount: 7100,
  readingTime: 38,
  lastUpdated: "2026-04-29",
  tags: ["lld", "rich-text", "editor", "prosemirror", "lexical", "react"],
  relatedTopics: [
    "wysiwyg-email-builder",
    "code-editor-component",
    "spreadsheet-like-grid",
  ],
};

export default function RichTextEditorArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <HighlightBlock as="p" tier="important">
          We are designing a rich text editor — the
          component that lets users write formatted
          content with bold, italic, links, lists,
          headings, blockquotes, code blocks, embedded
          images, mentions of other users or entities,
          and structured attachments. The editor sits
          at the heart of any product where users
          create content: comments, posts, documents,
          messages, knowledge bases. Done well it feels
          like Google Docs or Notion; done poorly it&rsquo;s
          a contenteditable mess of inconsistent
          behavior and lost data.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The hard problems are foundational:
          contenteditable&rsquo;s default behavior is
          inconsistent across browsers and produces
          unstructured HTML; selection and cursor
          management is non-trivial across nested
          inline and block formats; undo/redo requires a
          structured document model with history;
          mentions and other inline embeds need their
          own selection and editing semantics; image
          upload integrates with the file upload system;
          paste from external sources (Word, Google
          Docs) needs sanitization; and collaborative
          editing requires CRDTs or operational
          transformation. Building this from scratch is
          a multi-year project; in practice we use
          ProseMirror or Lexical as the foundation.
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users write content. Internal users
          (engineers integrating the editor) provide
          configuration: which features are enabled,
          mention sources, image upload endpoint,
          paste behavior. Power users have deep
          expectations from Google Docs (keyboard
          shortcuts, paste-and-format, structural
          editing).
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          ProseMirror or Lexical is the underlying
          editor framework — they handle the document
          model, selection, undo/redo, and rendering.
          Our layer provides product-specific features
          (mentions, image upload integration,
          collaborative hooks) and a React-friendly
          API. Modern browsers; we use
          contenteditable under the hood (the framework
          manages it carefully).
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement a from-scratch document
          model — we use a battle-tested framework. We
          do not implement WYSIWYG email composition
          (separate Email Builder). We do not implement
          code editing (Code Editor Component).
          Real-time collaboration is hooks-only — the
          backend handles conflict resolution.
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
          Inline formats: bold, italic, underline,
          strikethrough, code, link. Block formats:
          paragraph, headings (H1–H4), bulleted list,
          numbered list, blockquote, code block,
          horizontal rule. Mentions: triggered by
          &ldquo;@&rdquo;, dropdown with search,
          insert as inline embed. Image upload: drag-
          drop into the editor or paste from clipboard,
          uploads via the file upload system, embeds
          inline. Undo/redo across all edit types.
          Keyboard shortcuts (Cmd-B, Cmd-I, Cmd-K,
          etc.). Paste from Word/Google Docs sanitized
          to allowed formats. Markdown shortcuts
          (typing
          <code> # </code> at start of line creates a
          heading). Toolbar with format buttons.
          Floating menu near the cursor for inline
          format. Slash command for inserting blocks
          (Notion-style). Placeholder text. Read-only
          mode.
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Tables, columns, callouts. Embedded code
          blocks with syntax highlighting. Real-time
          collaboration with cursors and presence.
          Comments anchored to ranges. Suggestion
          mode (track changes). Versioning. AI
          assistance (autocomplete, rephrase). Rich
          embeds (YouTube, Tweet, Loom). Custom
          extensions via a plugin API.
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          Server-side conflict resolution, server
          storage, full WYSIWYG email rendering,
          monospace code editing.
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Typing has zero perceptible lag on documents
          up to 100k characters. Mention dropdown
          opens within 50 ms of trigger. Image upload
          progress visible while inserted as a
          placeholder.
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Undo/redo never produces inconsistent state.
          Paste from external sources never corrupts
          the document. Image upload failures revert
          gracefully.
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          All paste content sanitized via DOMPurify
          before insertion. Mentions resolve only to
          authorized targets. Image URLs are CSP-
          compatible.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          The editor is announced as a
          <code> role=&quot;textbox&quot;</code>.
          Format toolbar buttons are accessible.
          Mention dropdown is a real combobox.
          Keyboard shortcuts have accessible
          equivalents in menus.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          ProseMirror/Lexical as a vendored dependency
          with a stable wrapper. Extensions for
          mentions, images, etc. are independent
          modules. Schema is explicit and versioned.
        </HighlightBlock>
      </section>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/rich-text-editor-architecture.svg"
        alt="Rich Text Editor Architecture"
        caption="Document model (ProseMirror/Lexical) ← Schema (allowed nodes/marks) + Plugins (mentions, images, paste sanitizer, history, keymap) → Toolbar + Floating menu + Mention dropdown. Selection & cursor managed by the framework; React renders nodes via node views."
      />

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The editor is built on ProseMirror or Lexical
          (we&rsquo;ll describe the architecture
          generically). The framework provides a
          structured document model, a transaction
          system for atomic updates, plugins for
          extensions, and rendering via node views. Our
          layer wraps it with a React-friendly API and
          adds product-specific extensions.
        </p>
        <p>
          The <strong>document model</strong> is a tree
          of nodes (paragraphs, headings, lists, etc.)
          with marks (bold, italic, link). The schema
          declares what nodes and marks are allowed
          and where they can appear (e.g. images can
          be at the document level but not inside a
          link). The schema is the single source of
          truth for what the editor accepts.
        </p>
        <HighlightBlock as="p" tier="crucial">
          <strong>Editor state</strong> includes the
          document, the selection (cursor position or
          range), and the history (for undo/redo).
          Updates happen via transactions: a transaction
          describes a change (e.g. &ldquo;insert text
          at position X&rdquo;), the framework applies
          it atomically, and history records the
          inverse for undo. Transactions are atomic;
          partial updates aren&rsquo;t observable.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Plugins</strong> extend the editor.
          Built-in plugins: history (undo/redo),
          keymap (keyboard shortcuts), input rules
          (markdown shortcuts), placeholder. Custom
          plugins: mentions, image upload,
          collaborative cursors, comments. Plugins
          subscribe to transactions and can modify
          them or trigger side effects.
        </HighlightBlock>
        <p>
          On <strong>typing</strong>, the framework
          captures the input event, generates a
          transaction, applies it to the document,
          and re-renders affected nodes. The renderer
          is incremental — only changed nodes
          re-render. We use ProseMirror&rsquo;s native
          rendering or React node views (where each
          node maps to a React component).
        </p>
        <HighlightBlock as="p" tier="important">
          <strong>Mentions</strong>: a plugin watches
          for the trigger character (&ldquo;@&rdquo;).
          When detected, it opens a dropdown anchored
          to the cursor. The user types to filter;
          the dropdown queries a mention source
          (typically a server endpoint with search).
          On selection, a mention node is inserted
          inline; the dropdown closes. Mention nodes
          are atomic — clicking selects the whole
          mention; backspace deletes it as a unit.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Image upload</strong>: drag or paste
          an image. The plugin inserts a placeholder
          image node with a temporary upload state.
          The file ships through the file upload
          system; on success, the placeholder node is
          replaced with the final image node carrying
          the server URL. On failure, the placeholder
          shows an error with retry. The user can
          continue typing while upload happens.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Paste sanitization</strong>: when
          the user pastes, we read both
          <code> text/html</code> and
          <code> text/plain</code>. We sanitize the
          HTML via DOMPurify with a strict allowlist
          (only tags and attributes our schema
          accepts). We then convert the sanitized
          HTML to our document model. For complex
          paste sources (Google Docs HTML), we run a
          conversion that maps their structure to
          ours. If sanitization removes everything,
          fall back to plain text.
        </HighlightBlock>
        <p>
          <strong>Markdown shortcuts</strong>: input
          rules detect patterns like
          <code> # </code> at line start, convert to
          a heading; <code>* </code> creates a
          bullet list; <code>**bold**</code> applies
          bold inline. These are configured per
          editor and can be disabled.
        </p>
        <p>
          <strong>Slash commands</strong>: typing
          <code> / </code> opens a command palette
          for inserting blocks (heading, list,
          image, etc.). It&rsquo;s structured like
          mentions: a plugin watches for the
          trigger, opens a filtered list, inserts
          the chosen block on selection.
        </p>
        <p>
          <strong>Toolbar</strong> renders format
          buttons and tracks the current selection&rsquo;s
          formats (so the Bold button appears
          pressed when the cursor is in bold text).
          Selecting a button toggles the format on
          the current selection or cursor.
        </p>
        <p>
          <strong>Collaborative editing hooks</strong>:
          for products that support real-time
          collaboration, plugins integrate with a
          backend CRDT or OT engine. The plugin
          intercepts local transactions and ships
          them to the server; remote transactions
          arrive and apply to the local document.
          Cursor positions of other users render as
          colored carets. We don&rsquo;t implement
          the conflict resolution — that&rsquo;s
          the engine&rsquo;s job.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Plugins</strong> (history, keymap, mentions, images, paste,
          markdown rules) extend behavior.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important"><strong>NodeViews</strong></Highlight>{" "}
          render specific node types (image, mention, embedded video) with custom
          React components.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="crucial">Mention dropdown,
          slash menu state lives in plugin state.
          Image upload status</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">lives in plugin
          state, joined with the file upload
          system&rsquo;s progress.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Inputs:{" "}
          <code>initialDoc</code>, </Highlight><code>schema</code>,
          <code> plugins</code>,
          <code> mentionSource</code>,
          <code> uploadHandler</code>,
          <code> onChange</code>. Output:{" "}
          <code>onChange(doc)</code> on <Highlight tier="important">every
          change; the doc is a</Highlight> serialized JSON
          shape consumers can save.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="crucial">Image upload is async; the
          placeholder doesn&rsquo;t block typing.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Long documents stay fast because the
          framework&rsquo;s rendering is optimized.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial">Paste from{" "}
          <Highlight tier="important">external sources</Highlight>
          preserves intended formatting where
          possible.</HighlightBlock>
<HighlightBlock as="p" tier="important">Markdown shortcuts feel
          natural. Placeholder text in empty
          editor.</HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Mention
          dropdown is a real combobox with
          <code> aria-activedescendant</code>.
          Block insertions announce. Slash menu
          accessible</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">via keyboard. The frameworks
          (ProseMirror, Lexical) provide solid
          a11y foundations; we ensure our
          extensions don&rsquo;t regress.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="crucial">Custom
          schema marks/nodes go through the same
          security review as any user-content
          rendering.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Output rendering (e.g.
          displaying the saved document) also runs
          through a sanitizer at the read boundary.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="crucial">Unit tests for plugin transactions
          (mention insertion, image placeholder
          replacement).</HighlightBlock>
<HighlightBlock as="p" tier="important">Integration tests for paste
          from various sources (Word, Google Docs,
          plain text).</HighlightBlock>
<HighlightBlock as="p" tier="important">Undo/redo correctness
          tests. Markdown shortcut tests.
          Collaboration tests with two clients.
          Accessibility tests.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Concurrent edits in
          collab mode: CRDT/OT engine handles;
          the user sees the merge. Undo across an
          image upload: the upload continues but</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">the inserted node is removed; on
          completion, the orphan is canceled.
          Selection across nested formats: the
          framework handles boundary cases.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          The wrapper around ProseMirror/Lexical is
          reusable <Highlight tier="important">across products. Extensions
          (mentions, images, embeds)</Highlight> are
          plug-and-play. Schema is per-product.
          Toolbar customizable.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Toolbar labels, placeholder text,
          accessibility announcements via i18n.
          <Highlight tier="important">Document content is the user&rsquo;s
          own</Highlight> language. Right-to-left support via
          the framework&rsquo;s native RTL
          handling.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>ProseMirror vs Lexical vs from-scratch</h3>
        <HighlightBlock as="p" tier="important">
          ProseMirror is mature, schema-driven, and
          extension-rich; Lexical (Meta) is
          newer, React-first, and easier to start.
          From-scratch is a multi-year project
          with high risk. Both ProseMirror and
          Lexical solve the foundational problems
          well; pick based on team familiarity and
          ecosystem fit.
        </HighlightBlock>

        <h3>contenteditable vs custom DOM</h3>
        <HighlightBlock as="p" tier="crucial">
          contenteditable is the only practical
          way to get native text input behavior
          (cursor, IME, accessibility). Custom DOM
          would lose IME support and be a massive
          undertaking. We use contenteditable
          carefully managed by the framework.
        </HighlightBlock>

        <h3>HTML serialization vs custom JSON</h3>
        <HighlightBlock as="p" tier="important">
          Custom JSON (the framework&rsquo;s
          document model serialized) is precise
          and lossless. HTML round-trips lose
          structure. We store JSON server-side and
          render HTML on output.
        </HighlightBlock>

        <h3>Mention dropdown as plugin vs separate</h3>
        <HighlightBlock as="p" tier="important">
          Plugin integration with the framework
          gives proper selection coordination and
          atomic mention nodes. A separate
          dropdown would be harder to coordinate.
          Plugin is the right approach.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="crucial">Real-time collaboration with CRDTs.
          Comments anchored to text ranges with
          threading. Suggestion mode (track
          changes).</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">AI rewrite/summarize/expand.
          Rich embeds (Twitter, YouTube, Loom)
          via oEmbed. Tables with cell selection.
          Custom voice input.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. Why use a framework like
          ProseMirror?</strong> The foundational
          problems (document model, selection,
          undo, schema, rendering) are immensely
          complex. Frameworks have years of work
          poured in. Building from scratch is
          rarely justified.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How does paste sanitization
          work?</strong> Read HTML and plain text
          from clipboard. Run HTML through
          DOMPurify with strict allowlist. Convert
          to document model. If sanitization
          empties content, fall back to plain
          text.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>3. How are mentions
          implemented?</strong> A plugin watches
          for &ldquo;@&rdquo;. Opens a dropdown
          anchored to the cursor. Search query
          fetches candidates. On selection,
          inserts an atomic mention node inline.
        </HighlightBlock>

        <HighlightBlock as="p" tier="crucial">
          <strong>4. How does image upload
          integrate?</strong> Drag/paste inserts
          a placeholder node with upload state.
          File ships through file upload system.
          On success, replace placeholder with
          final node. On failure, show error
          with retry.
        </HighlightBlock>

        <p>
          <strong>5. How does undo/redo work?</strong>{" "}
          The framework&rsquo;s history plugin
          records inverse transactions. Cmd-Z
          applies the inverse. Redo applies the
          original.
        </p>

        <p>
          <strong>6. How are markdown shortcuts
          implemented?</strong> Input rules: pattern
          matchers run on input events; matched
          patterns trigger transactions
          (e.g. &ldquo;# &rdquo; → heading).
        </p>

        <p>
          <strong>7. How do collaborative editing
          hooks work?</strong> A plugin intercepts
          local transactions, ships to server.
          Server-relayed remote transactions apply
          locally. Conflict resolution (CRDT or
          OT) is the engine&rsquo;s job; we
          provide the integration points.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>8. What&rsquo;s the trade-off
          between ProseMirror and Lexical?</strong>{" "}
          ProseMirror is mature with rich
          extensions; Lexical is React-first and
          newer. Both solve foundations well.
          Pick based on ecosystem fit and team
          familiarity.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">The framework
          handles the foundations (document model,
          selection, history, schema); our layer</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">adds the product-specific magic. The
          result is Google-Docs-class editing
          embedded in your product.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
