"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-streaming-markdown-renderer",
  title: "Design a Streaming Markdown Renderer",
  description:
    "LLD for incrementally rendering markdown as tokens stream in (LLM responses): tokenizer reuse, partial parse, incremental DOM, code block flushing, and accessibility.",
  category: "low-level-design",
  subcategory: "file-media-content-systems",
  slug: "streaming-markdown-renderer",
  wordCount: 6500,
  readingTime: 34,
  lastUpdated: "2026-04-29",
  tags: ["lld", "markdown", "streaming", "llm", "react"],
  relatedTopics: [
    "ai-assisted-form-fill",
    "rich-text-editor",
    "real-time-data-dashboard",
  ],
};

export default function StreamingMarkdownRendererArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a streaming markdown renderer
          — the component that displays markdown content
          progressively as it streams in token-by-token
          from an LLM response or any chunked text
          source. Users see the response as it&rsquo;s
          generated rather than waiting for the full
          response. The renderer handles partial markdown
          (incomplete code blocks, half-typed lists,
          unclosed bold) gracefully, applying syntax
          highlighting to code blocks once they close,
          and remaining performant under high token
          rates.
        </p>
        <p>
          The hard problems are: parsing markdown
          incrementally without re-parsing the full
          document on every token; handling partial
          structures (a code fence that hasn&rsquo;t
          closed yet — render as code block, but it
          might not be); incremental DOM updates that
          don&rsquo;t flicker as text appends; lazy
          syntax highlighting (don&rsquo;t highlight
          a code block on every token; wait until
          it closes); accessibility for screen
          readers consuming the streaming output;
          and security (sanitize HTML embedded in
          markdown).
        </p>

        <h3>User Context</h3>
        <p>
          End users see LLM responses, AI-generated
          documentation, real-time text feeds, or any
          content that arrives progressively. They
          expect smooth incremental rendering — text
          appears character by character (or
          chunk-by-chunk) without reflow on every
          token. Engineering teams provide the streaming
          source and the renderer handles markdown
          interpretation.
        </p>

        <h3>Assumptions</h3>
        <p>
          Source delivers text incrementally (typically
          chunks of 1–10 tokens via SSE or fetch
          streaming). Markdown is the content format
          (CommonMark spec plus extensions like tables,
          task lists, footnotes). Modern browsers; we
          use ReadableStream for parsing input,
          requestAnimationFrame for batched DOM
          updates, and Web Workers for syntax
          highlighting.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement editing markdown — that&rsquo;s
          the Rich Text Editor. We do not implement the
          LLM or text source. We do not implement
          arbitrary HTML sanitization beyond what&rsquo;s
          needed for safe markdown rendering.
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Render markdown progressively as tokens
          stream. Support standard CommonMark:
          headings, paragraphs, bold, italic, links,
          lists, code (inline and block), blockquotes,
          horizontal rules, tables, task lists.
          Handle partial markdown gracefully (open
          structures rendered with the best
          interpretation as of current state). Lazy
          syntax highlighting on closed code blocks.
          Auto-scroll behavior: stick to bottom while
          near bottom, allow scroll-up to break-stick.
          Math rendering (LaTeX via KaTeX) for
          AI-generated math content. Mermaid diagram
          rendering. Sanitize embedded HTML.
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Footnotes. Definition lists. Custom
          extensions (callouts, alerts). Copy-button
          on code blocks. Code-block language
          detection when language fence is missing.
          Image lazy-load. Inline citations linking
          to sources. Progress indicator while
          streaming.
        </p>

        <h3>Out of Scope</h3>
        <p>
          Markdown editing, server-side markdown
          generation, full HTML rendering beyond a
          safe subset.
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Rendering keeps up with token rates of
          50+ tokens/sec without flicker. DOM updates
          batched via RAF. Syntax highlighting off-
          main. Memory bounded for very long
          responses (markdown content stays in
          memory; we don&rsquo;t leak DOM nodes).
        </p>

        <h3>Reliability</h3>
        <p>
          Partial markdown renders sensibly without
          breaking layout. Stream ending mid-structure
          (incomplete code block, unclosed bold)
          renders as best interpretation. Errors
          during streaming surface gracefully.
        </p>

        <h3>Security</h3>
        <p>
          Embedded HTML sanitized via DOMPurify.
          Links use safe rel attributes
          (<code> noopener noreferrer</code>) and
          target=&quot;_blank&quot; for external.
          Image URLs validated (no
          <code> javascript:</code>).
        </p>

        <h3>Accessibility</h3>
        <p>
          Streaming content announced via polite
          live region (or chunked announcements to
          avoid overwhelming screen readers). Code
          blocks identified with language. Tables
          rendered as proper tables.
        </p>

        <h3>Maintainability</h3>
        <p>
          Tokenizer/parser as a vendored library
          (e.g. micromark, marked) with a clean
          wrapper. Extensions plug in modularly.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The renderer has three core components: an
          <strong> incremental parser</strong> that
          consumes tokens as they arrive, a
          <strong> render coordinator</strong> that
          translates parser output into React tree
          updates, and an <strong>RAF-aligned commit</strong>{" "}
          mechanism that batches token-driven updates
          for smooth rendering.
        </p>
        <p>
          The <strong>incremental parser</strong>
          receives text chunks and maintains a
          rolling parse state. On each chunk, we
          append to a buffer and re-parse the
          tail (or, for parsers that support it,
          incrementally extend the parse). The
          output is a list of block-level tokens
          (paragraph, heading, code block, etc.)
          plus inline tokens within them. Most
          markdown parsers (marked, micromark) are
          fast enough to re-parse the full content
          on each chunk for typical streaming rates;
          for very long content, we use techniques
          like checkpointing — parse from the last
          stable block forward, not from scratch.
        </p>
        <p>
          <strong>Partial structures</strong> are the
          subtlety. When the stream is mid-code-
          block, the parser shows an open fence but
          no close. We render it as a code block
          anyway, with a visual indicator that
          it&rsquo;s still streaming. When the close
          arrives, we apply syntax highlighting and
          remove the streaming indicator. Similarly
          for half-typed lists, unclosed bold, etc.
          The interpretation may shift slightly as
          more tokens arrive — that&rsquo;s fine
          because users perceive the rendering as
          part of the streaming, not as separate
          re-renders.
        </p>
        <p>
          The <strong>render coordinator</strong> takes
          parsed tokens and produces React elements.
          Block tokens become block components;
          inline tokens become inline elements.
          Memoization is key: blocks that haven&rsquo;t
          changed don&rsquo;t re-render. We assign
          stable keys based on block position so
          React reconciliation is efficient. Only
          the last block (still streaming) re-renders
          on each token.
        </p>
        <p>
          <strong>RAF-aligned commits</strong>: instead
          of re-rendering on every token, we buffer
          incoming tokens and flush on
          <code> requestAnimationFrame</code>. This
          keeps render at frame-rate (60 fps) even
          if tokens arrive faster. Without this,
          fast streams can overwhelm React with
          updates.
        </p>
        <p>
          <strong>Syntax highlighting</strong> for
          code blocks runs lazily — only after the
          block closes (the closing fence has
          arrived). We use Shiki or Prism in a Web
          Worker. While streaming, the code block
          renders as plain monospace text with a
          pulse indicator; on close, the worker
          highlights and the result replaces the
          plain text. Workers prevent highlighting
          from blocking the main thread on long
          code blocks.
        </p>
        <p>
          <strong>Auto-scroll</strong>: while the user
          is at or near the bottom (within ~50 px),
          we auto-scroll to keep new content
          visible. If the user scrolls up,
          auto-scroll pauses; we surface a
          &ldquo;Jump to bottom&rdquo; indicator.
          When they scroll back to bottom or click
          the indicator, auto-scroll resumes. This
          balances seeing new content with not
          fighting the user&rsquo;s scroll.
        </p>
        <p>
          <strong>HTML sanitization</strong>: when
          the markdown contains embedded HTML (a
          common LLM behavior), we sanitize via
          DOMPurify with a strict allowlist before
          rendering. Allowed: basic structural tags
          (div, span, p, ul, ol, li). Disallowed:
          script, iframe, on*-handlers,
          javascript: URLs, etc. The sanitizer
          runs on each render.
        </p>
        <p>
          <strong>Math (LaTeX)</strong> blocks render
          via KaTeX, which is fast (synchronous,
          no worker needed). We detect
          <code> $$...$$</code> and <code>$...$</code>{" "}
          delimiters in the markdown extension; on
          close (for $$), invoke KaTeX to render.
          Inline math renders as soon as the
          closing
          <code> $</code> arrives.
        </p>
        <p>
          <strong>Mermaid diagrams</strong> render via
          the Mermaid library on closed
          <code> ```mermaid</code> code blocks. We
          lazy-load Mermaid on first encounter
          (it&rsquo;s a large library). Rendering
          happens on close, similar to syntax
          highlighting.
        </p>
        <p>
          <strong>Stream end</strong>: when the
          stream signals completion, we remove
          streaming indicators (pulse, &ldquo;still
          generating&rdquo; markers). Open
          structures (e.g. an unclosed code block)
          render as best interpretation. Final
          syntax highlighting and math/Mermaid
          rendering complete.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>StreamingRenderer</strong> is the
          top component. <strong>Tokenizer</strong>{" "}
          (vendored: marked, micromark) parses
          markdown. <strong>RenderCoordinator</strong>{" "}
          maps tokens to React elements with
          memoization. <strong>BlockRenderers</strong>{" "}
          (per block type: paragraph, heading,
          code, list, table) handle individual
          blocks. <strong>InlineRenderers</strong>{" "}
          (bold, italic, link, code, math) handle
          inline tokens. <strong>HighlightWorker</strong>{" "}
          handles syntax highlighting off-main.
          <strong> ScrollController</strong> manages
          auto-scroll behavior.
          <strong> Sanitizer</strong> handles HTML
          safety.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          The text buffer (full content so far) and
          parsed tokens live in component state.
          Memoization on block tokens prevents
          unnecessary re-renders. Highlighting state
          per code block (pending, complete) lives
          in a small map. Scroll state (sticky to
          bottom or not) lives in scroll
          controller.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Inputs:{" "}
          <code>stream</code> (a ReadableStream of
          text chunks),{" "}
          <code>extensions</code> (math, mermaid,
          custom blocks),{" "}
          <code>sanitizer</code> (custom config or
          default DOMPurify). Output: rendered
          markdown that updates as the stream
          progresses.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          RAF-aligned token commits prevent render
          flooding. Block-level memoization scopes
          re-renders. Syntax highlighting in a
          worker. Lazy-loaded extensions (KaTeX,
          Mermaid). Stable keys for reconciliation.
          Memory bounded by the markdown text plus
          rendered DOM; for extremely long streams,
          we could virtualize but typical responses
          fit in memory.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Streaming text appears character-by-character
          (or chunk-by-chunk depending on token
          rate). A subtle pulse on the last
          incomplete block signals
          &ldquo;still generating&rdquo;. Code
          blocks show plain monospace until closed,
          then highlight. Auto-scroll keeps new
          content visible; user scroll-up pauses
          auto-scroll with a Jump-to-bottom
          indicator. Stream-end removes streaming
          indicators.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          The streaming region uses
          <code> aria-live=&quot;polite&quot;</code>{" "}
          for screen reader announcements. We
          throttle announcements to avoid
          overwhelming users — announce in chunks
          (e.g. on paragraph completion) rather
          than per token. Code blocks have a
          language label. Tables render as proper
          tables. Math blocks have alt text where
          available.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Embedded HTML sanitized via DOMPurify
          with strict allowlist. Links open in
          new tab with safe rel. Image URLs
          validated. Code-block content rendered as
          text only (never executed). Math rendered
          via KaTeX (sandboxed by KaTeX itself
          against arbitrary LaTeX execution).
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for the parser against
          representative markdown samples. Streaming
          tests with chunked input simulating LLM
          output. Partial-structure tests (open
          code block, unclosed bold). Performance
          tests at 100 tokens/sec.
          Accessibility tests for live region
          behavior and code-block labeling.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Stream ends mid-code-block: render as
          incomplete; user can copy as-is. Stream
          ends mid-bold: render as bold (best
          interpretation). Mermaid diagram with
          syntax error: surface error inline rather
          than crashing. Math with invalid LaTeX:
          KaTeX renders an error indicator.
          Embedded HTML with disallowed tags:
          stripped silently. Very long single
          paragraph (no breaks): renders, may need
          word-wrap. Network interruption mid-
          stream: surface error, retain partial
          content. Token rate exceeds RAF rate
          (very fast generation): RAF commits
          batch correctly; perceived as smooth
          streaming.
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          Generic over markdown source — works for
          LLM streams, file streams, any chunked
          text. Extensions modular. Sanitizer
          config customizable.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          Markdown content is the source language.
          UI strings (auto-scroll banner, error
          messages) via i18n. RTL via direction
          attribute on the rendering container.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Re-parse vs incremental parse</h3>
        <p>
          Re-parse the full buffer on each chunk is
          simpler and works for most response
          lengths. Truly incremental parsing is
          complex but scales to very long responses.
          We default to re-parse with a checkpoint
          optimization for very long streams.
        </p>

        <h3>RAF batching vs immediate updates</h3>
        <p>
          Immediate updates flicker at high token
          rates. RAF batching keeps render at frame
          rate. RAF batching is essential.
        </p>

        <h3>Syntax highlighting on every chunk vs on close</h3>
        <p>
          On close is much cheaper (highlight
          once per code block, not once per
          token). On-every-chunk would freeze for
          long code blocks. We always wait for
          close.
        </p>

        <h3>Worker-based highlighting vs main thread</h3>
        <p>
          Worker-based prevents main-thread blocking
          on long code blocks. Main-thread is
          simpler but jankier. We use worker.
        </p>

        <h3>Auto-scroll vs user-controlled</h3>
        <p>
          Auto-scroll while at bottom matches user
          intent (they want to see new content).
          User-controlled is too passive for
          streaming contexts. Hybrid (auto when
          near bottom, pause when scrolled up) is
          the right balance.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Real incremental parsing for very long
          responses. Streaming Mermaid (render
          partial diagrams). Source highlighting
          (linking sentences to their citations
          for grounded LLM output). Smooth
          character-level animation. Voice
          synthesis of the stream. Smart
          summarization of very long completed
          responses.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How does parsing work
          incrementally?</strong> Re-parse the full
          text buffer on each chunk (most parsers
          are fast enough). For very long streams,
          checkpoint at stable block boundaries
          and re-parse only from the last
          checkpoint.
        </p>

        <p>
          <strong>2. How are partial structures
          handled?</strong> Render the best
          interpretation given current state.
          An open code fence renders as a code
          block (might close later). Unclosed
          bold renders as bold. Interpretation
          may shift slightly as more tokens
          arrive.
        </p>

        <p>
          <strong>3. Why RAF-align renders?</strong>{" "}
          High token rates (50+/sec) would cause
          flicker without batching. RAF aligns
          updates with the browser&rsquo;s render
          cycle for smooth streaming.
        </p>

        <p>
          <strong>4. When is syntax highlighting
          run?</strong> Only after a code block
          closes. Before that, plain monospace.
          Highlighting runs in a Web Worker so
          long blocks don&rsquo;t block the main
          thread.
        </p>

        <p>
          <strong>5. How does auto-scroll work?</strong>{" "}
          While near bottom, auto-scroll on each
          render. When user scrolls up, pause and
          show a Jump-to-bottom indicator. On
          click or scroll-back-to-bottom, resume.
        </p>

        <p>
          <strong>6. How is HTML sanitized?</strong>{" "}
          DOMPurify with strict allowlist. Allowed:
          structural tags (p, ul, ol, etc.).
          Disallowed: script, iframe, on*-handlers,
          javascript: URLs.
        </p>

        <p>
          <strong>7. How is accessibility
          handled?</strong> Polite live region with
          throttled announcements (chunked, not
          per-token). Code blocks labeled with
          language. Tables render as proper tables.
          Math blocks have alt text.
        </p>

        <p>
          <strong>8. How does this differ from
          static markdown rendering?</strong>{" "}
          Static is one-shot: parse and render.
          Streaming handles partial input,
          incrementally updates, lazy-applies
          expensive operations (highlighting,
          math), and manages auto-scroll.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A streaming markdown renderer is{" "}
          <strong>incremental parser + RAF-aligned
          render coordinator + lazy expensive
          operations</strong>. Parse on each chunk;
          render the best interpretation
          including partial structures; batch
          render commits via RAF; defer syntax
          highlighting and math/Mermaid until
          structures close. The result is LLM
          responses that feel alive, render
          smoothly, and remain accessible and
          secure.
        </p>
      </section>
    </ArticleLayout>
  );
}
