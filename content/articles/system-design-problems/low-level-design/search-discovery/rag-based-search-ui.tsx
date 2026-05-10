"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-rag-based-search-ui",
  title: "Design a RAG-based Search UI",
  description:
    "LLD for a RAG search UI: streaming LLM-generated answers with inline citations to retrieved sources, source panels, follow-up queries, and accessibility.",
  category: "low-level-design",
  subcategory: "search-discovery",
  slug: "rag-based-search-ui",
  wordCount: 6500,
  readingTime: 34,
  lastUpdated: "2026-04-30",
  tags: ["lld", "rag", "ai-search", "citations", "streaming", "react"],
  relatedTopics: [
    "search-autocomplete",
    "full-text-search-ui",
    "streaming-markdown-renderer",
    "ai-assisted-form-fill",
  ],
};

export default function RAGBasedSearchUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>🎯 Problem Context &amp; Scope Definition</h2>

        <h3>Problem Statement</h3>
        <p>
          We are designing a RAG-based search UI —
          retrieval-augmented generation, where a user&rsquo;s
          natural-language query is answered by an LLM
          synthesizing information from retrieved
          documents, with inline citations linking to
          source passages. Think Perplexity, You.com, or
          ChatGPT&rsquo;s search-grounded responses. The
          UI streams the answer as it&rsquo;s generated,
          attaches citation markers to claims, surfaces
          retrieved sources in a panel, and supports
          follow-up queries that build on prior context.
        </p>
        <p>
          The hard problems are: streaming the LLM
          response with embedded citation markers that
          link to source documents; rendering markdown
          progressively (delegating to the streaming
          markdown renderer); surfacing the retrieval
          step (showing which sources informed the
          answer); supporting follow-ups with conversation
          context; handling errors gracefully (retrieval
          failed, LLM failed, partial response); and
          honesty about hallucination risks (citations
          should ground claims, but the LLM may not
          always cite correctly).
        </p>

        <h3>User Context</h3>
        <p>
          End users ask questions and expect synthesized
          answers grounded in retrieved sources. They
          want speed (streaming feels fast), accuracy
          (citations link to sources for verification),
          and the ability to drill into sources.
          Internal users (engineers) provide the RAG
          backend (retrieval + generation pipeline);
          we render its output.
        </p>

        <h3>Assumptions</h3>
        <p>
          Backend exposes a streaming endpoint that
          returns: (1) retrieved sources first, (2) then
          a streaming LLM answer with citation markers
          (e.g.{" "}
          <code>{`[citation:doc_42]`}</code>) interspersed.
          Sources have id, title, URL, snippet. Modern
          browsers; we use ReadableStream for response
          streaming.
        </p>

        <h3>Non-Goals</h3>
        <p>
          We do not implement the RAG backend
          (retrieval, embedding, generation). We do
          not implement the autocomplete or full-text
          search alongside (related but separate). We
          do not implement custom-tuned LLMs (consumer
          choice).
        </p>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <p>
          Query input. Streaming answer rendered as
          markdown. Inline citation markers in the
          answer that, when clicked, scroll to or
          highlight the corresponding source. Sources
          panel listing retrieved documents with
          title, snippet, link. Loading state during
          retrieval (before generation starts).
          Error state for retrieval or generation
          failure. Follow-up queries that include
          prior context. Stop generation button.
          Response history (the conversation log).
        </p>

        <h3>Secondary (Nice-to-have)</h3>
        <p>
          Confidence indicators per claim. Source
          relevance scores. Multi-language support.
          Voice input for queries. Citations export
          (copy-as-text with markdown links). Save
          conversations. Compare with non-RAG search
          results. Suggested follow-ups. Verify mode
          (check whether each cited source actually
          supports the claim).
        </p>

        <h3>Out of Scope</h3>
        <p>
          The RAG pipeline itself, fine-tuning,
          analytics on which sources get clicked,
          conversation persistence to backend
          (could integrate, not implementing).
        </p>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <p>
          Retrieval results visible within 500 ms of
          query. First answer token within 1 second.
          Streaming at 60 fps. Sources panel renders
          quickly even with many sources (typically
          5–20).
        </p>

        <h3>Reliability</h3>
        <p>
          Stream interruptions (network) gracefully
          surface partial answer + retry. Citation
          markers in malformed positions don&rsquo;t
          break rendering. Empty retrieval gracefully
          handles (&ldquo;No relevant sources
          found&rdquo;).
        </p>

        <h3>Security</h3>
        <p>
          Sources sanitized (titles, snippets render
          as text; URLs validated). LLM output
          sanitized (it might inject HTML attempts;
          we never trust it). Cross-user privacy
          enforced server-side.
        </p>

        <h3>Accessibility</h3>
        <p>
          Streaming answer announces via polite live
          region (chunked, not per-token). Citation
          links keyboard-accessible. Sources panel
          accessible. Stop button accessible.
        </p>

        <h3>Maintainability</h3>
        <p>
          The runtime composes the Streaming Markdown
          Renderer (existing subsystem) for the
          answer body, with citation extension. The
          RAG adapter abstracts the backend protocol.
        </p>
      </section>

      <section>
        <h2>🧠 Solution Approach</h2>
        <p>
          The system has four parts: <strong>RAG
          adapter</strong> (consumes the backend&rsquo;s
          streaming protocol — sources first, then
          tokens), <strong>citation parser</strong>{" "}
          (extracts citation markers from streaming
          tokens and replaces them with link
          components), <strong>answer renderer</strong>{" "}
          (Streaming Markdown Renderer with citation
          extension), and <strong>sources panel</strong>{" "}
          (renders retrieved documents alongside).
        </p>
        <p>
          The <strong>RAG adapter</strong> reads the
          streaming response. The protocol is
          typically: a JSON-lines stream where the
          first line(s) carry source metadata (an
          array of source objects), then subsequent
          lines carry token chunks. We parse each
          line; sources go to the SourcesStore;
          tokens go to the answer renderer. The
          adapter handles connection lifecycle,
          aborts on user stop, and surfaces
          completion.
        </p>
        <p>
          The <strong>citation parser</strong> watches
          the streaming token text for citation
          markers (configurable pattern, e.g.
          <code> [citation:doc_42]</code> or
          <code> [^42]</code>). When detected, the
          parser replaces the marker with a citation
          component during rendering. The marker may
          stream in across multiple chunks (e.g.
          &ldquo;[citation:&rdquo; arrives in one
          chunk, &ldquo;doc_42]&rdquo; in the next);
          we buffer until a complete marker is
          seen to avoid partial-marker rendering
          glitches.
        </p>
        <p>
          The <strong>answer renderer</strong> is the
          Streaming Markdown Renderer with the
          citation extension plugged in. As tokens
          stream and complete markers form, citation
          components render inline as superscript
          links (e.g.{" "}
          <code>&sup1;</code>). Each citation links
          (via id) to a source in the sources panel.
          Clicking the citation scrolls/highlights
          the matching source; clicking the source
          opens the original document.
        </p>
        <p>
          The <strong>sources panel</strong> renders
          alongside (sidebar) or below the answer,
          listing each retrieved source with title,
          snippet, link. Sources are numbered to
          match citation markers. Selecting a source
          (via keyboard or click) highlights its
          citations in the answer (and vice versa)
          for cross-reference.
        </p>
        <p>
          <strong>Follow-up queries</strong>: the input
          stays available after the answer. A new
          query is sent with the prior conversation
          context (or a summary of it) so the
          backend can ground in conversation
          history. The UI renders a thread of
          query/answer pairs, each with its own
          sources.
        </p>
        <p>
          <strong>Stop generation</strong>: a Stop
          button cancels the in-flight request via
          AbortController. The partial answer is
          retained; the user can re-ask or
          follow-up.
        </p>
        <p>
          <strong>Error handling</strong>: retrieval
          failure surfaces &ldquo;Couldn&rsquo;t
          find relevant sources&rdquo;; LLM
          failure mid-stream surfaces a partial
          answer with an error indicator and retry.
          Network failure offers retry from the
          last successful state.
        </p>
        <p>
          <strong>Honesty about hallucinations</strong>:
          we always render the sources panel so
          users can verify. We don&rsquo;t hide
          uncited claims — if the LLM produces
          text without citations, it shows as-is
          (no false citations injected). Some
          products add a &ldquo;verify mode&rdquo;
          that re-checks citations against sources;
          we expose hooks for this.
        </p>
      </section>

      <section>
        <h2>🧱 Component Architecture</h2>
        <p>
          <strong>RAGSearchProvider</strong>{" "}
          instantiates the adapter and stores.
          <strong> QueryInput</strong> for entering
          questions. <strong>AnswerRenderer</strong>{" "}
          (uses Streaming Markdown Renderer + citation
          extension). <strong>CitationLink</strong>{" "}
          renders an inline citation.
          <strong> SourcesPanel</strong> renders the
          retrieved sources.
          <strong> ConversationThread</strong> renders
          query/answer pairs.
          <strong> StopButton</strong> aborts
          generation. <strong>RAGAdapter</strong>{" "}
          consumes the streaming backend.
        </p>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <p>
          Conversation history (queries + answers +
          sources) lives in an external store.
          Streaming buffer lives in the adapter.
          Active query state (loading, streaming,
          complete, error) drives UI states.
          Sources highlighting state (which is
          focused) is component-local.
        </p>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <p>
          Streaming protocol:{" "}
          <code>{` { type: "sources", sources: [...] } `}</code>{" "}
          followed by{" "}
          <code>{` { type: "token", text: "..." } `}</code>{" "}
          chunks, then
          <code>{` { type: "done" } `}</code>. Source
          shape:{" "}
          <code>{` { id, title, url, snippet, score? } `}</code>.
          Citation marker pattern is configurable.
        </p>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <p>
          Streaming Markdown Renderer&rsquo;s
          RAF-aligned commits keep UI smooth.
          Citation parsing buffers across chunks
          to avoid re-rendering partial markers.
          Source panel renders once per query (not
          per token). AbortController on stop
          immediately cancels.
        </p>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <p>
          Two-pane layout: answer (left/main) and
          sources (right/sidebar). On mobile, sources
          stack below or are accessible via a tab.
          Citations appear as superscript links
          inline. Hovering a citation previews the
          source snippet. Clicking scrolls to the
          source in the panel and highlights both.
          Streaming pulse on the last token.
          Stop button visible during streaming.
          Follow-up input below the answer.
          Conversation history scrolls with new
          queries appended.
        </p>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <p>
          Streaming answer in
          <code> aria-live=&quot;polite&quot;</code>{" "}
          with chunked announcements. Citation
          links are real
          <code> &lt;a&gt;</code> elements.
          Sources panel accessible. Stop button
          and follow-up input keyboard-accessible.
          Conversation thread navigable by
          keyboard.
        </p>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <p>
          Sources rendered as text. URLs validated.
          LLM output sanitized — never rendered as
          HTML. Citation markers are data, not
          code. Cross-user privacy enforced
          server-side.
        </p>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <p>
          Unit tests for citation parser (markers
          across chunk boundaries, malformed
          markers). Integration tests with a mock
          stream: sources arrive, tokens stream,
          citations render, click cross-highlights.
          Stop mid-stream test. Error scenario
          tests.
        </p>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <p>
          Citation marker references a source not in
          the sources list (LLM hallucinated): render
          as plain text or with an error indicator
          (&ldquo;[citation: unknown]&rdquo;).
          Marker arrives split across chunks: buffer
          until complete. LLM produces text with no
          citations (uncited claim): render as-is;
          we don&rsquo;t inject false citations.
          Stream truncates: partial answer remains;
          surface error with retry. Empty retrieval:
          show no-sources state; LLM may still try
          to answer (configurable: with or without
          retrieval, falling back to its training
          knowledge with explicit caveat).
          Follow-up with conversation history that
          exceeds context window: backend handles
          (we just send what we have).
        </p>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <p>
          The citation extension to the Streaming
          Markdown Renderer is reusable for any
          markdown-with-citations content. The RAG
          adapter pattern works across different
          backend protocols.
        </p>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <p>
          UI strings via i18n. Answer and source
          content in the LLM&rsquo;s output language.
          RTL layout via CSS logical properties.
        </p>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Inline citations vs separate references list</h3>
        <p>
          Inline citations (numbered links in
          context) feel more native and grounded.
          Separate list (footnotes) is cleaner but
          less integrated. We do inline; footnote-
          style is opt-in.
        </p>

        <h3>Show retrieval before or with answer</h3>
        <p>
          Showing retrieval first sets expectation
          (you&rsquo;ll see what the LLM is reading)
          and gives users early context. Showing
          alongside the answer is less staged. We
          prefer retrieval-first for transparency.
        </p>

        <h3>Verify-mode default</h3>
        <p>
          On by default would slow responses (extra
          processing); off by default is faster but
          more lenient. We default off with a
          toggle for power users.
        </p>

        <h3>Streaming markdown vs plain text</h3>
        <p>
          Markdown gives structure (headings, lists,
          code blocks) that LLMs use. Plain text
          loses structure. We always render
          markdown.
        </p>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <p>
          Verify mode where each cited claim is
          re-checked against sources. Visual answer
          (charts, images embedded). Voice
          interaction. Multi-modal queries (images,
          video, code). Personalization based on
          user&rsquo;s document history. Real-time
          updates if sources change mid-conversation.
        </p>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <p>
          <strong>1. How are sources and answer
          coordinated?</strong> Backend streams
          sources first, then tokens. UI renders
          sources panel immediately; tokens stream
          into the answer with citation markers
          linking back to sources by id.
        </p>

        <p>
          <strong>2. How are citation markers
          parsed?</strong> The citation parser
          watches the streaming token text for
          configurable patterns. It buffers across
          chunks (a marker may span multiple
          chunks) and replaces complete markers
          with citation components on render.
        </p>

        <p>
          <strong>3. Why stream the answer?</strong>{" "}
          Perceived latency. Users see the answer
          forming rather than waiting for the
          complete response. RAG responses can
          take 5–30 seconds; streaming makes that
          feel acceptable.
        </p>

        <p>
          <strong>4. How do follow-ups work?</strong>{" "}
          The new query is sent with prior
          conversation context. Backend grounds in
          history. UI renders a thread of
          query/answer pairs, each with its own
          sources.
        </p>

        <p>
          <strong>5. How does this differ from
          full-text search?</strong> Full-text
          returns ranked documents; users read them
          themselves. RAG synthesizes an answer
          from documents, with citations for
          verification. RAG is faster for direct
          questions; full-text is better for
          exploration.
        </p>

        <p>
          <strong>6. How do you handle
          hallucinations?</strong> Render sources
          alongside; user can verify each citation.
          Don&rsquo;t inject false citations.
          Optional verify mode re-checks claims
          against sources. Clear UI distinction
          between cited and uncited text.
        </p>

        <p>
          <strong>7. How is stop generation
          implemented?</strong> AbortController on
          the streaming fetch. Stop button calls
          abort; partial answer retained; user can
          re-ask or follow up.
        </p>

        <p>
          <strong>8. What&rsquo;s the
          accessibility story?</strong> Streaming
          answer in polite live region with
          chunked announcements. Citation links
          are real anchors. Sources panel
          accessible. Stop and follow-up keyboard-
          reachable.
        </p>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <p>
          A RAG search UI is{" "}
          <strong>RAG adapter + citation parser +
          Streaming Markdown Renderer + sources
          panel</strong>. Sources arrive first;
          tokens stream into the answer with
          citation markers linking back to
          sources. Follow-ups extend the
          conversation. Honesty about retrieval
          (always show sources, don&rsquo;t inject
          false citations) builds user trust.
          The result is search that synthesizes
          answers while keeping users grounded
          in verifiable evidence.
        </p>
      </section>
    </ArticleLayout>
  );
}
