"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
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
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>User Context</h3>
        <HighlightBlock as="p" tier="important">
          End users ask questions and expect synthesized
          answers grounded in retrieved sources. They
          want speed (streaming feels fast), accuracy
          (citations link to sources for verification),
          and the ability to drill into sources.
          Internal users (engineers) provide the RAG
          backend (retrieval + generation pipeline);
          we render its output.
        </HighlightBlock>

        <h3>Assumptions</h3>
        <HighlightBlock as="p" tier="important">
          Backend exposes a streaming endpoint that
          returns: (1) retrieved sources first, (2) then
          a streaming LLM answer with citation markers
          (e.g.{" "}
          <code>{`[citation:doc_42]`}</code>) interspersed.
          Sources have id, title, URL, snippet. Modern
          browsers; we use ReadableStream for response
          streaming.
        </HighlightBlock>

        <h3>Non-Goals</h3>
        <HighlightBlock as="p" tier="important">
          We do not implement the RAG backend
          (retrieval, embedding, generation). We do
          not implement the autocomplete or full-text
          search alongside (related but separate). We
          do not implement custom-tuned LLMs (consumer
          choice).
        </HighlightBlock>
      </section>

      <section>
        <h2>Functional Requirements</h2>

        <h3>Core (Must-have)</h3>
        <HighlightBlock as="p" tier="crucial">
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
        </HighlightBlock>

        <h3>Secondary (Nice-to-have)</h3>
        <HighlightBlock as="p" tier="important">
          Confidence indicators per claim. Source
          relevance scores. Multi-language support.
          Voice input for queries. Citations export
          (copy-as-text with markdown links). Save
          conversations. Compare with non-RAG search
          results. Suggested follow-ups. Verify mode
          (check whether each cited source actually
          supports the claim).
        </HighlightBlock>

        <h3>Out of Scope</h3>
        <HighlightBlock as="p" tier="important">
          The RAG pipeline itself, fine-tuning,
          analytics on which sources get clicked,
          conversation persistence to backend
          (could integrate, not implementing).
        </HighlightBlock>
      </section>

      <section>
        <h2>Non-Functional Requirements</h2>

        <h3>Performance</h3>
        <HighlightBlock as="p" tier="important">
          Retrieval results visible within 500 ms of
          query. First answer token within 1 second.
          Streaming at 60 fps. Sources panel renders
          quickly even with many sources (typically
          5–20).
        </HighlightBlock>

        <h3>Reliability</h3>
        <HighlightBlock as="p" tier="important">
          Stream interruptions (network) gracefully
          surface partial answer + retry. Citation
          markers in malformed positions don&rsquo;t
          break rendering. Empty retrieval gracefully
          handles (&ldquo;No relevant sources
          found&rdquo;).
        </HighlightBlock>

        <h3>Security</h3>
        <HighlightBlock as="p" tier="important">
          Sources sanitized (titles, snippets render
          as text; URLs validated). LLM output
          sanitized (it might inject HTML attempts;
          we never trust it). Cross-user privacy
          enforced server-side.
        </HighlightBlock>

        <h3>Accessibility</h3>
        <HighlightBlock as="p" tier="crucial">
          Streaming answer announces via polite live
          region (chunked, not per-token). Citation
          links keyboard-accessible. Sources panel
          accessible. Stop button accessible.
        </HighlightBlock>

        <h3>Maintainability</h3>
        <HighlightBlock as="p" tier="important">
          The runtime composes the Streaming Markdown
          Renderer (existing subsystem) for the
          answer body, with citation extension. The
          RAG adapter abstracts the backend protocol.
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
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
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The <strong>sources panel</strong> renders
          alongside (sidebar) or below the answer,
          listing each retrieved source with title,
          snippet, link. Sources are numbered to
          match citation markers. Selecting a source
          (via keyboard or click) highlights its
          citations in the answer (and vice versa)
          for cross-reference.
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="crucial">
          <strong>Error handling</strong>: retrieval
          failure surfaces &ldquo;Couldn&rsquo;t
          find relevant sources&rdquo;; LLM
          failure mid-stream surfaces a partial
          answer with an error indicator and retry.
          Network failure offers retry from the
          last successful state.
        </HighlightBlock>
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
        <HighlightBlock as="p" tier="crucial"><strong> SourcesPanel</strong> renders the
          retrieved sources.
          <strong> ConversationThread</strong> renders
          query/answer</HighlightBlock>
<HighlightBlock as="p" tier="important">pairs.
          <Highlight tier="important"><strong> StopButton</strong></Highlight> aborts
          generation. <strong>RAGAdapter</strong>{" "}
          consumes the streaming backend.</HighlightBlock>
      </section>

      <section>
        <h2>🔄 State Management</h2>
        <HighlightBlock as="p" tier="crucial"><Highlight tier="important">Active query state (loading, streaming,
          complete, error) drives UI states.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">Sources highlighting state (which is
          focused) is component-local.</HighlightBlock>
      </section>

      <section>
        <h2>🔁 Data Flow &amp; Contracts</h2>
        <HighlightBlock as="p" tier="crucial">Streaming protocol:{" "}
          <code>{` { type: "sources", sources: [...] } `}</code>{" "}
          followed by{" "}
          <code>{` { type: "token", text: "..." } `}</code>{" "}
          chunks, then
          <code>{` { type: "done" } `}</code>.</HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <Highlight tier="important">Source shape:</Highlight>{" "}
          <code>{` { id, title, url, snippet, score? } `}</code>. Citation marker
          pattern is configurable.
        </HighlightBlock>
      </section>

      <section>
        <h2>⚡ Performance</h2>
        <HighlightBlock as="p" tier="crucial">Streaming Markdown Renderer&rsquo;s
          RAF-aligned commits keep UI smooth.</HighlightBlock>
<HighlightBlock as="p" tier="important">Citation parsing buffers across chunks
          to avoid re-rendering partial markers.</HighlightBlock>
<HighlightBlock as="p" tier="important">Source panel renders once per query (not
          per token). AbortController on stop
          immediately cancels.</HighlightBlock>
      </section>

      <section>
        <h2>🎨 UX</h2>
        <HighlightBlock as="p" tier="crucial">Clicking scrolls to the
          source in the panel and highlights both.
          Streaming pulse on the last token.
          Stop button</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">visible during streaming.
          Follow-up input below the answer.
          Conversation history scrolls with new
          queries appended.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>♿ Accessibility</h2>
        <HighlightBlock as="p" tier="crucial">Streaming answer in
          <code> aria-live=&quot;polite&quot;</code>{" "}
          with chunked announcements. Citation
          links are real
          <code> &lt;a&gt;</code> elements.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">Sources panel accessible. Stop button
          and follow-up input keyboard-accessible.
          Conversation thread navigable by
          keyboard.</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔐 Security</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          Sources rendered as text. URLs validated.
          LLM output sanitized <Highlight tier="important">— never rendered as
          HTML. Citation</Highlight> markers are data, not
          code. Cross-user privacy enforced
          server-side.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🧪 Testing</h2>
        <HighlightBlock as="p" tier="crucial"><Highlight tier="important">Integration tests with a mock
          stream: sources arrive, tokens stream,
          citations</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">render, click cross-highlights.
          Stop mid-stream test. Error scenario
          tests.</HighlightBlock>
      </section>

      <section>
        <h2>🚨 Edge Cases</h2>
        <HighlightBlock as="p" tier="crucial">Stream truncates: partial answer remains;
          surface error with retry. Empty retrieval:
          show no-sources state; LLM may still try
          to answer (configurable: with or without
          retrieval,</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">falling back to its training
          knowledge with explicit caveat).
          Follow-up with conversation history that
          exceeds context window: backend handles
          (we just send what we have).</Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🔁 Reusability</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          The citation extension to the Streaming
          Markdown Renderer <Highlight tier="important">is reusable for any
          markdown-with-citations content.</Highlight> The RAG
          adapter pattern works across different
          backend protocols.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>🌍 Internationalization</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">
          UI strings via i18n. Answer and <Highlight tier="important">source
          content in the LLM&rsquo;s output</Highlight> language.
          RTL layout via CSS logical properties.
        </Highlight></HighlightBlock>
      </section>

      <section>
        <h2>⚖️ Trade-offs</h2>

        <h3>Inline citations vs separate references list</h3>
        <HighlightBlock as="p" tier="important">
          Inline citations (numbered links in
          context) feel more native and grounded.
          Separate list (footnotes) is cleaner but
          less integrated. We do inline; footnote-
          style is opt-in.
        </HighlightBlock>

        <h3>Show retrieval before or with answer</h3>
        <HighlightBlock as="p" tier="important">
          Showing retrieval first sets expectation
          (you&rsquo;ll see what the LLM is reading)
          and gives users early context. Showing
          alongside the answer is less staged. We
          prefer retrieval-first for transparency.
        </HighlightBlock>

        <h3>Verify-mode default</h3>
        <HighlightBlock as="p" tier="crucial">
          On by default would slow responses (extra
          processing); off by default is faster but
          more lenient. We default off with a
          toggle for power users.
        </HighlightBlock>

        <h3>Streaming markdown vs plain text</h3>
        <HighlightBlock as="p" tier="important">
          Markdown gives structure (headings, lists,
          code blocks) that LLMs use. Plain text
          loses structure. We always render
          markdown.
        </HighlightBlock>
      </section>

      <section>
        <h2>🔮 Future Improvements</h2>
        <HighlightBlock as="p" tier="crucial"><Highlight tier="important">Multi-modal</Highlight>{" "}
          queries (images,
          video, code). Personalization based on</HighlightBlock>
<HighlightBlock as="p" tier="important">user&rsquo;s document history. Real-time
          updates if sources change mid-conversation.</HighlightBlock>
      </section>

      <section>
        <h2>🎤 Interview Q&amp;A</h2>

        <HighlightBlock as="p" tier="important">
          <strong>1. How are sources and answer
          coordinated?</strong> Backend streams
          sources first, then tokens. UI renders
          sources panel immediately; tokens stream
          into the answer with citation markers
          linking back to sources by id.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>2. How are citation markers
          parsed?</strong> The citation parser
          watches the streaming token text for
          configurable patterns. It buffers across
          chunks (a marker may span multiple
          chunks) and replaces complete markers
          with citation components on render.
        </HighlightBlock>

        <HighlightBlock as="p" tier="important">
          <strong>3. Why stream the answer?</strong>{" "}
          Perceived latency. Users see the answer
          forming rather than waiting for the
          complete response. RAG responses can
          take 5–30 seconds; streaming makes that
          feel acceptable.
        </HighlightBlock>

        <p>
          <strong>4. How do follow-ups work?</strong>{" "}
          The new query is sent with prior
          conversation context. Backend grounds in
          history. UI renders a thread of
          query/answer pairs, each with its own
          sources.
        </p>

        <HighlightBlock as="p" tier="important">
          <strong>5. How does this differ from
          full-text search?</strong> Full-text
          returns ranked documents; users read them
          themselves. RAG synthesizes an answer
          from documents, with citations for
          verification. RAG is faster for direct
          questions; full-text is better for
          exploration.
        </HighlightBlock>

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

        <HighlightBlock as="p" tier="crucial">
          <strong>8. What&rsquo;s the
          accessibility story?</strong> Streaming
          answer in polite live region with
          chunked announcements. Citation links
          are real anchors. Sources panel
          accessible. Stop and follow-up keyboard-
          reachable.
        </HighlightBlock>
      </section>

      <section>
        <h2>📌 Summary</h2>
        <HighlightBlock as="p" tier="crucial">Follow-ups extend the
          conversation. Honesty about retrieval
          (always show sources, don&rsquo;t inject
          false citations)</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">builds user trust.
          The result is search that synthesizes
          answers while keeping users grounded
          in verifiable evidence.</Highlight></HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
