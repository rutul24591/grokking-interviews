"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-ai-chatbot-frontend",
  title: "Design a Frontend for an AI Chatbot (Streaming, History, Multimodal)",
  description:
    "Architecture for an AI chatbot UI: token streaming with ReadableStream, optimistic rendering, conversation history, context window management, multimodal input, tool call visualization, and error recovery.",
  category: "high-level-design",
  subcategory: "ai-modern-systems",
  slug: "ai-chatbot-frontend",
  wordCount: 5200,
  readingTime: 31,
  lastUpdated: "2026-05-16",
  tags: ["hld", "ai", "chatbot", "streaming", "llm", "multimodal", "sse", "context-window"],
  relatedTopics: ["rag-based-ui-system", "copilot-style-ai-assistant"],
};

export default function AiChatbotFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        An AI chatbot frontend is unlike any other web UI pattern. The response to a user
        message is not a JSON payload returned in 200ms — it is a stream of text tokens
        arriving over 3–30 seconds, frequently interrupted by tool call events (the model
        pauses generation to request a web search or code execution, then resumes). The
        message history isn't a paginated list — it's a growing context window with a hard
        token limit that, when exceeded, changes model behavior silently. Multimodal input
        (images, files, voice) requires client-side preprocessing pipelines that must
        complete before the message is sent. Every design decision from scroll management
        to error recovery has a chatbot-specific dimension not present in traditional UIs.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/ai-chatbot-frontend-architecture.svg"
        alt="AI chatbot frontend architecture showing UI layer (message input, streaming renderer, markdown parser, multimodal input, history manager, abort controller), client state and transport layer (conversation store, SSE/fetch stream, token buffer with rAF flush, context window tracker, tool call renderer, error/retry state), and backend API layer (chat API route, prompt builder, LLM provider, tool execution)"
        caption="Chatbot architecture: three-layer design (UI / state+transport / backend), rAF token buffering, AbortController stop, and multimodal input pipeline"
      />

      <h2>Clarifying the Requirements</h2>
      <p>
        The architecture varies significantly based on scope questions:
      </p>
      <p>
        <strong>Single model or model-agnostic?</strong> A single-model chatbot (Claude-only,
        GPT-4-only) can hardcode the streaming format and tool call schema. A model-agnostic
        system needs an adapter layer that normalizes different providers' streaming event
        formats to a common internal representation.
      </p>
      <p>
        <strong>Tool use?</strong> Tool-using models interleave generation with tool calls.
        The UI must handle the tool call event mid-stream: pause content rendering, show
        the tool in progress, receive results, then resume content. This is architecturally
        different from a pure text generation UI.
      </p>
      <p>
        <strong>Conversation persistence?</strong> Session-scoped conversations (lost on
        page reload) are simpler. Cross-session persistence (conversations saved and
        accessible from any device) requires server-side storage. The choice affects the
        entire data layer.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Context window management is the feature most frequently omitted and most
        consequential to omit. Every LLM has a context limit (8K–200K tokens). When
        the conversation exceeds it, the API returns an error, the model silently drops
        oldest messages (depending on provider behavior), or the request is truncated.
        None of these produce a good user experience. The frontend must track context
        usage in real time, warn the user before the limit is hit, and offer a path
        forward (summarize conversation, start new thread, or prune old messages).
      </HighlightBlock>

      <h2>High-Level Architecture</h2>
      <p>
        The chatbot frontend has three layers: the UI layer (message list renderer, input
        composer, streaming indicator, tool call cards), the state and transport layer
        (conversation store, streaming connection management, token buffering pipeline,
        context window tracker), and the backend API layer (a thin proxy that constructs
        the LLM prompt from the conversation history, calls the LLM's streaming API, and
        relays the response stream to the browser).
      </p>
      <p>
        The browser never calls the LLM API directly. The API route sits between browser
        and LLM for two reasons: API keys stay server-side (not exposed in client bundles),
        and the server can augment the prompt (inject system instructions, user context,
        retrieved documents) before forwarding to the LLM. The API route uses edge
        deployment (Vercel Edge Functions, Cloudflare Workers) to minimize the geographic
        latency between server and LLM provider, which directly reduces time to first token.
      </p>

      <h2>Token Streaming Pipeline</h2>
      <p>
        The browser initiates a streaming POST via fetch with no Content-Length on the
        response. The response body is a ReadableStream. The client reads it in a loop
        using getReader(), decoding each chunk with a TextDecoder instance in streaming
        mode (which handles multi-byte UTF-8 characters split across chunk boundaries).
      </p>
      <p>
        LLM providers deliver the stream in Server-Sent Events format. Each SSE line
        follows the pattern "data: " followed by a JSON payload or the special sentinel
        "[DONE]" marking end of stream. The JSON payload for each token event contains
        the delta content — new text to append to the current message — and optionally
        a finish_reason when the generation ends. The client must parse each SSE line
        correctly, accumulating partial lines across chunk boundaries (a single chunk
        may contain multiple SSE events or end mid-event).
      </p>
      <HighlightBlock as="p" tier="important">
        Token batching via requestAnimationFrame: updating React state on every token
        at 80 tokens/second produces 80 re-renders per second. Each render diffs and
        commits the virtual DOM — expensive for a long message list. The solution:
        accumulate tokens in a plain JavaScript variable (not React state), and flush
        to state once per animation frame using requestAnimationFrame. At 60Hz, this
        batches 1–2 tokens per frame at typical generation speeds, reducing React renders
        from 80/s to 60/s while maintaining visual smoothness below the 16ms per-frame
        budget. The accumulator is a mutable ref (useRef) so it doesn't trigger renders
        when written to.
      </HighlightBlock>
      <p>
        The streaming state machine: each assistant message has a status field that drives
        the UI. idle → sending (user submitted, waiting for first token) → streaming
        (tokens arriving, blinking cursor visible) → complete (generation ended normally)
        or aborted (user stopped, partial text preserved) or error (stream failed,
        retry available). Each state transition corresponds to a specific stream event:
        sending transitions to streaming on the first token, streaming transitions to
        complete on the "[DONE]" sentinel or the finish_reason event.
      </p>

      <h2>Stop Generation and AbortController</h2>
      <p>
        A stop button is essential for chatbots — long generations are common, and users
        frequently want to stop a response that has clearly gone off-track without waiting
        for it to complete. The stop action must cancel the network request and preserve
        the partial response (not discard it).
      </p>
      <p>
        Implementation: create an AbortController when the streaming request is initiated.
        Pass its signal to the fetch call. When the user clicks stop, call
        controller.abort(). The fetch throws an AbortError, which the error handler catches
        and treats as an intentional cancellation (not an error). The conversation store
        updates the message status to "aborted" and keeps the accumulated partial text.
        A subtle edge case: if the user sends a new message while a generation is still
        streaming, the old stream must be aborted before starting the new request. Without
        this, two concurrent streams write to two different messages simultaneously but
        share the rAF loop, causing token interleaving.
      </p>

      <h2>Optimistic UI and Message Ordering</h2>
      <p>
        When the user submits a message, the UI immediately appends the user's message
        bubble to the conversation without waiting for server confirmation. This optimistic
        update eliminates the perceived gap between pressing send and seeing a response
        to the action. The optimistic message is assigned a client-generated UUID as its
        temporary ID.
      </p>
      <p>
        Simultaneously, a placeholder assistant message with status "sending" is added
        below the user's message. The placeholder shows a typing indicator (three animated
        dots). When the first token arrives, the placeholder transitions to "streaming"
        status and the typing indicator is replaced by the token text. This pattern keeps
        the conversation thread visually continuous: user message appears, typing indicator
        appears below it, then transitions smoothly to streaming text.
      </p>

      <h2>Conversation History and Context Window Management</h2>
      <p>
        Conversation history is stored in IndexedDB for persistence across page reloads
        without requiring server-side storage. Each conversation is a record containing
        a conversationId, a title (auto-generated from the first user message), the model
        name, creation and update timestamps, and an ordered array of message records.
        Each message record contains its role (user, assistant, or tool), content (text
        or structured multimodal content), status, and tokenCount estimate.
      </p>
      <HighlightBlock as="p" tier="important">
        Token counting: the frontend estimates token counts for each message using a
        tokenizer library (tiktoken for OpenAI models, or a simple character-count
        approximation: characters divided by 4 is a reasonable proxy). The conversation
        store maintains a running total. When the total approaches the model's context
        limit (at 80% capacity), the UI shows a context usage warning: "This conversation
        is getting long. Consider starting a new thread or summarizing." At 95%, a
        hard warning blocks sending until the user takes action (summarize or new thread).
        Tracking context usage requires knowing not just the message token counts but
        also the system prompt tokens — these are consumed from the context window even
        though they're invisible to users.
      </HighlightBlock>
      <p>
        Context pruning strategy: when the user requests summarization, the system sends
        the full conversation history to the LLM with a summarization instruction, then
        replaces the history with a single "system" message containing the summary. New
        messages are then added after this summary. The conversation is marked as
        "summarized" with a visual indicator ("Older messages were summarized") at the
        point of truncation. This preserves the thread without losing context abruptly.
      </p>
      <p>
        Virtualized message list: conversations with 500+ messages cannot render all
        message DOM nodes simultaneously. A virtualized list renders only messages in
        or near the viewport (typically 20 messages). As the user scrolls up, older
        messages are rendered on demand. The scroll position must be preserved when
        new messages are appended (scroll anchor) — only auto-scroll to the bottom when
        the user was already at the bottom before the new content appeared.
      </p>

      <h2>Multimodal Input Handling</h2>
      <p>
        Multimodal input requires preprocessing pipelines that run before the message
        is sent.
      </p>
      <p>
        <strong>Image input.</strong> The user pastes an image (paste event with
        clipboardData.items) or selects via file picker. The UI shows an inline thumbnail
        preview in the composer. Before sending, images are resized client-side using
        a Canvas element to the model's maximum dimension (typically 1568px on the
        longest side for vision-capable models) and encoded as base64. For images larger
        than 5MB, the client uploads to a presigned S3 URL and includes the URL in the
        message payload; the backend fetches the image from S3 before forwarding to the
        LLM, avoiding large base64 strings in the request body.
      </p>
      <p>
        <strong>File input.</strong> PDF and text file attachments are read client-side
        using FileReader. PDFs require a client-side parser (pdf.js) to extract text
        before sending. The extracted text is included as a content block labeled with
        the filename. For files that exceed the remaining context window budget, the UI
        warns the user and offers truncation or splitting.
      </p>
      <p>
        <strong>Voice input.</strong> The Web Speech API (SpeechRecognition) provides
        real-time speech-to-text in Chrome and Safari. The transcript appears in the
        composer field as the user speaks, editable before sending. For browsers without
        SpeechRecognition support, the user records audio via MediaRecorder, uploads the
        blob to a transcription endpoint (Whisper API), and the returned transcript
        populates the composer.
      </p>

      <h2>Tool Call Visualization</h2>
      <p>
        Tool-using models interleave generation with structured tool call events. When
        the model requests a tool, the stream delivers a tool_use event containing the
        tool name and input parameters before any content continues. The UI must handle
        this event mid-stream: pause text rendering, show the tool in progress, wait
        for the tool result, then resume the assistant's content.
      </p>
      <p>
        Tool call cards appear inline in the assistant message thread, between the text
        before and after the tool call. During execution, the card shows a loading state:
        "Searching the web for: quantum computing applications..." with a spinner. When
        results return, the card transitions to a completed state showing the tool name,
        input, and a summary of the result. The assistant's continuation text appears
        below the result card.
      </p>
      <HighlightBlock as="p" tier="important">
        Tool call cards are collapsible by default: one-line summary visible, expand to
        see full input and output. This keeps the conversation readable without hiding
        the model's reasoning process. For code execution tool calls, the result card
        shows syntax-highlighted code and stdout/stderr with a copy button. For web search,
        the result shows the top cited URLs as clickable links. The collapsible design
        is important for conversations with many tool calls — a web research task might
        invoke 10+ searches, and rendering all of them expanded would overwhelm the
        conversation view.
      </HighlightBlock>

      <h2>Markdown Rendering During Streaming</h2>
      <p>
        Streaming markdown rendering is harder than rendering complete markdown because
        the partial string may be syntactically incomplete. An unclosed code fence
        (three backticks without the closing three) parses as a code block that consumes
        all following text. An incomplete bold marker (one asterisk without the closing
        one) may create incorrect formatting. Naive streaming rendering will produce
        visually jarring artifacts as tokens arrive.
      </p>
      <p>
        The hybrid approach: prose content (paragraphs, headers, lists, inline marks)
        renders incrementally as tokens arrive — partial text renders correctly as text
        even when marks are incomplete. Code blocks are detected by the opening fence
        but deferred: when a triple backtick is detected, a "code block loading" placeholder
        appears. When the closing fence arrives, the complete code block is rendered with
        syntax highlighting. This prevents the most visually disruptive artifacts (incomplete
        code blocks consuming all subsequent text) while allowing prose to stream naturally.
      </p>

      <h2>Error Taxonomy and Recovery</h2>
      <p>
        The LLM error space is different from typical API errors and requires error-specific
        UX treatment:
      </p>
      <p>
        <strong>TTFT timeout.</strong> No tokens arrive within 10 seconds of sending.
        Usually indicates server overload or a network issue between the backend and LLM
        provider. Show "The response is taking longer than usual..." with an option to
        cancel and retry. Auto-retry after 15 seconds if the user hasn't manually cancelled.
      </p>
      <p>
        <strong>Mid-stream network error.</strong> Tokens were arriving but the connection
        dropped before completion. The partial response is preserved. Show "Connection
        lost" with a "Continue" button — the retry sends a special continuation request
        that includes the partial response and asks the model to continue from where it
        left off (this works reasonably well in practice but is not guaranteed to produce
        a seamless continuation).
      </p>
      <p>
        <strong>Rate limit (429).</strong> Show "Too many requests — please wait a moment"
        with the retry-after time from the response headers. Exponential backoff: first
        retry at the time specified by retry-after, subsequent retries doubling the wait.
      </p>
      <HighlightBlock as="p" tier="important">
        Context overflow error: the conversation has exceeded the model's context limit
        despite the client-side warning. This shouldn't happen if the frontend tracks
        tokens correctly, but can occur due to tokenizer approximation errors or system
        prompt growth. Detect this from the error code (context_length_exceeded in OpenAI,
        max_tokens in Anthropic error types). The UI should offer automatic context pruning:
        "Your conversation is too long. Would you like me to summarize and continue?" —
        not require the user to manually identify and delete old messages.
      </HighlightBlock>

      <h2>Backend Proxy Design</h2>
      <p>
        The backend API route is a thin proxy with three responsibilities: prompt
        construction, stream relay, and tool execution. Prompt construction assembles
        the messages array from the conversation history, applies the system prompt,
        and handles multimodal content blocks. Stream relay reads the LLM provider's
        SSE stream and forwards it to the browser, optionally transforming the format
        to a normalized schema if the system supports multiple providers. Tool execution
        runs tool calls in a sandboxed environment (web search via an API, code execution
        in a container) and injects results back into the conversation before continuing
        the generation.
      </p>
      <p>
        Edge deployment is critical for TTFT. An API route deployed in a single region
        (say, us-east-1) adds up to 200ms round-trip for users in Asia or Europe before
        the LLM even sees the request. Deploying to 20 edge locations globally reduces
        the server-to-LLM hop but introduces a new problem: the LLM API call must be
        routed from the edge location to the LLM provider's data center, which may
        add latency depending on provider location. Measure TTFT by region and deploy
        the proxy to the regions where users are, co-located with the LLM provider's
        endpoint where possible.
      </p>

      <h2>Interview Q&A</h2>

      <h3>Q: How do you handle the race condition where the user sends a new message while the previous response is still streaming?</h3>
      <p>
        The correct behavior: abort the current stream before initiating the new one.
        The conversation store has a single "activeStream" reference (the AbortController
        for the current streaming request). When a new message is submitted, the store
        checks whether an active stream exists and, if so, calls abort() on it. The
        aborted message is marked with status "aborted" (partial text preserved). Then
        a new stream is started for the new message. The key invariant: only one active
        stream at a time, with the rAF loop flushing tokens to the most recently active
        message. Without this, a slow network could result in tokens from the old response
        appearing in the new message's content.
      </p>

      <h3>Q: How would you design the streaming architecture to support multiple LLM providers (OpenAI, Anthropic, Gemini)?</h3>
      <p>
        The backend proxy implements a provider adapter pattern. Each provider has an
        adapter that implements a common interface: streamResponse(messages, options) returns
        an async generator that yields normalized events. Each event is one of: token
        (delta content), toolCallStart (tool name + input), toolCallResult (tool output),
        streamEnd (finish reason), or streamError (error type + message). The frontend
        consumes this normalized event stream regardless of the underlying provider's
        wire format. Provider adapters handle the format differences: OpenAI uses
        "choices[0].delta.content" for tokens; Anthropic uses "content_block_delta"
        with type routing; Gemini uses "candidates[0].content.parts". Swapping providers
        requires only changing the adapter, not the frontend or the normalized event
        processing logic.
      </p>

      <h3>Q: How would you implement conversation search (finding messages across all conversations)?</h3>
      <p>
        For local-only storage (IndexedDB), full-text search requires a client-side
        index. The Web Workers API can run a search index (like FlexSearch or MiniSearch)
        in a background thread to avoid blocking the main thread. The search index is
        built on application startup from all conversation data in IndexedDB and updated
        incrementally as new messages are added. For server-synced storage, the search
        runs on the server — a standard full-text search over the conversation database
        (PostgreSQL tsvector, Elasticsearch, or a dedicated search service). The result
        is a list of message IDs with highlighted snippets; the UI deep-links to the
        specific conversation and scrolls to the matched message.
      </p>

      <h3>Q: How do you ensure the chat UI remains accessible during streaming?</h3>
      <p>
        The message list has role="log" and aria-live="polite". The polite setting announces
        new content to screen readers without interrupting the current reading — the screen
        reader queues the new content and announces it when the user is idle. For streaming
        responses, announcing every token would be overwhelming. The accessibility layer
        should debounce announcements: accumulate streaming tokens for 500ms, then announce
        the accumulated chunk as a single update. The blinking streaming cursor must have
        aria-hidden="true" (it provides no information to screen reader users and the animation
        would be announced repeatedly). The stop generation button must have a clear accessible
        label: aria-label="Stop generating response" rather than just an icon.
      </p>

      <h2>Conversation Branch Exploration</h2>
      <p>
        A linear conversation thread is the simplest mental model, but it is a poor fit
        for exploratory use cases — research, brainstorming, drafting — where the user
        wants to try multiple directions from a common starting point. Branch exploration
        allows the user to fork the conversation at any message and pursue an alternative
        direction without losing their current thread. The result is a conversation tree
        rather than a linear history.
      </p>
      <p>
        Branch creation: the user right-clicks (or long-presses) any message in the
        conversation and selects "Explore alternate direction." This creates a new branch
        rooted at the parent of the selected message — a sibling conversation starting
        from the same context state. The branch appears as a new tab in the conversation
        view, labeled with the first few words of the user's next message in that branch.
        The parent conversation (the trunk) and all branches remain accessible as tabs.
        The branch is not a full copy of the conversation — it shares the message history
        up to the fork point by reference, so it doesn't double the storage. Only the
        branch-specific messages are stored uniquely.
      </p>
      <HighlightBlock as="p" tier="important">
        Branch comparison is the feature that makes conversation branching genuinely useful
        rather than just a navigation curiosity. After exploring two branches from the
        same fork point, the user should be able to view the two branches side by side
        — the same question asked with two different phrasings, the same topic explored
        with two different scopes. The branch comparison view shows the shared context
        above a horizontal split, with each branch below its respective column. Users
        can copy the best elements from each branch into a final "synthesis" conversation
        that becomes the canonical thread for further exploration.
      </HighlightBlock>
      <p>
        Persistence for branches: each branch is stored as a child conversation record
        with a parentConversationId and a forkMessageId (the message where the branch
        diverged). The conversation index (the sidebar list of conversations) groups
        branches under their parent, collapsible by default. A branch that the user
        abandons (never revisited after the initial exploration) can be pruned after 30
        days. A branch that the user explicitly keeps or exports is retained indefinitely.
      </p>

      <h2>Memory and Long-Term Context</h2>
      <p>
        Standard chatbot conversations are amnesiac — each new conversation starts with
        no knowledge of prior interactions. Users who use a chatbot regularly to assist
        with ongoing work must re-explain their context in every session: their role,
        their preferences, the project they're working on. Long-term memory addresses
        this by persisting relevant facts, preferences, and project context across sessions,
        injecting them into new conversations as compressed context.
      </p>
      <p>
        Memory extraction: at the end of each session, or asynchronously after the
        conversation reaches a certain length, a lightweight LLM call processes the
        conversation and extracts memory-worthy facts: user preferences ("the user
        prefers concise responses and bullet point format"), ongoing projects ("the user
        is building a React-based dashboard for inventory management"), and explicit
        corrections ("the user noted they use pnpm, not npm"). These extracted facts
        are stored as structured memory records with a timestamp and a source conversation
        ID.
      </p>
      <p>
        Memory injection at session start: when a new conversation begins, retrieve
        the user's most relevant memory records (most recent and highest relevance to
        the session's initial query) and inject them into the system prompt as a compact
        "User context" section. The memory section is labeled clearly so the user knows
        the assistant is using prior context. A memory management UI allows users to
        view, edit, and delete specific memory records — essential for privacy and
        accuracy. Users must be able to correct a wrong memory ("I no longer use React,
        I switched to SolidJS") without the wrong preference persisting indefinitely.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Long-term memory creates a significant privacy obligation. Stored memories are
        a persistent profile of the user's work habits, preferences, knowledge gaps,
        and ongoing projects. Users must have complete visibility and control: a memory
        panel showing all stored facts with delete capability, a clear disclosure
        that memory is being collected at the first session and in the settings, and
        a "delete all memories" action that permanently removes all records. Memory
        records should never include the raw conversation text — only extracted facts
        — to minimize the PII surface area. Do not build long-term memory without explicit
        user opt-in; users who do not opt in should receive the standard amnesiac behavior.
      </HighlightBlock>

      <h3>Q: How do you implement autosave and crash recovery for a streaming response that was interrupted mid-generation?</h3>
      <p>
        The conversation store in IndexedDB is the primary durability mechanism. Every
        token appended to the streaming message is written to the IndexedDB record for
        that message within 500ms (the rAF flush interval). If the browser crashes or
        the tab is closed during streaming, the message record in IndexedDB contains
        the last-flushed partial text with status "streaming" (not "complete"). On next
        open, the store detects "streaming" messages and marks them as "interrupted" —
        displaying a visible indicator: "Response was interrupted. [Regenerate] [Keep partial
        response]." Regenerate resends the conversation up to and including the user's
        message, starting a new generation. Keep partial response marks the message
        complete with the partial text — useful when the important content was in the
        first part of the response before the interruption.
      </p>

      <h3>Q: How do you handle conversations that span very long time periods (weeks or months)?</h3>
      <p>
        Very long conversations face two compounding problems: context window exhaustion
        (the full history doesn't fit in the LLM's context) and UI performance degradation
        (thousands of message DOM nodes are expensive). The context strategy is hierarchical
        compression: older segments of the conversation are summarized into compressed
        "chapter" nodes, with only the most recent uncompressed messages appended as
        raw history. Summaries capture the key decisions, facts established, and directions
        agreed upon in each chapter. On long re-opens, the LLM sees the compressed
        summaries plus the recent raw messages — an approximation of the full history
        that fits within the context window. The chapter summary approach is superior
        to sliding window truncation (which drops old messages completely) because it
        preserves the accumulated context even if it loses granularity. Mark chapter
        boundaries visually in the conversation view with a "Chapter N — summary" divider
        that the user can expand to read the compressed summary.
      </p>
    </ArticleLayout>
  );
}
