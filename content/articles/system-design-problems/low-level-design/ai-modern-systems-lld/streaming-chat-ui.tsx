"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-streaming-chat-ui",
  title: "Streaming Chat UI System",
  description:
    "Building chat interfaces that display streaming token responses from LLMs in real-time with incremental rendering and user interaction.",
  category: "low-level-design",
  subcategory: "ai-modern-systems",
  slug: "streaming-chat-ui",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "ai", "streaming", "chat-ui", "real-time", "llm"],
  relatedTopics: ["token-streaming-buffer", "ai-feedback-loop-ui"],
};

export default function StreamingChatUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>
          Large language models generate responses token-by-token (a token is roughly a word fragment — 3–4 characters on average). At a typical generation speed of 20–60 tokens per second and a response length of 300–500 tokens, a user would wait 5–25 seconds to see anything if the system waited for a complete response before rendering. That latency is unacceptable and feels broken compared to human typing speed.
        </p>
        <p>
          Streaming chat UIs solve this by rendering tokens as they arrive. The user sees the first word within 200–500ms of submitting a message (the time to first token, TTFT), then watches the response appear incrementally — a reading experience that naturally paces with the generation speed. The perceived responsiveness improvement is dramatic even though the total generation time is identical.
        </p>
        <p>
          The engineering challenges are non-trivial. Token arrival is bursty (network batches), not a smooth per-token stream. React's rendering must be batched to avoid 60 DOM updates per second. Markdown formatting is incomplete mid-stream (an unclosed code fence ``` renders as a literal backtick until the closing fence arrives). Large responses (10,000+ tokens) can exhaust memory if accumulated without virtualization. Users want to cancel mid-response. Multiple concurrent messages need independent stream management. Errors mid-stream need graceful degradation (show partial response, allow retry).
        </p>
        <p>
          <strong>Explicit assumptions:</strong> The backend supports streaming via Server-Sent Events (SSE) or chunked transfer encoding. The browser's Fetch API with ReadableStream is available. Tokens in the stream are newline-delimited JSON objects with a delta text field (compatible with OpenAI and Anthropic streaming formats). The LLM may produce structured content (markdown, code blocks, tables) within the stream.
        </p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Stream Parsing:</strong> Parse the token stream from SSE or chunked fetch response, extracting text deltas from each event.
          </li>
          <li>
            <strong>Incremental Rendering:</strong> Update the displayed message text as tokens arrive, providing visible typing-animation-like feedback.
          </li>
          <li>
            <strong>Cancellation:</strong> User can stop an in-progress response. The partial response is preserved and marked "stopped."
          </li>
          <li>
            <strong>Markdown Rendering:</strong> Render markdown incrementally, handling incomplete syntax (code fences, headers) gracefully mid-stream.
          </li>
          <li>
            <strong>Message Threading:</strong> Support multi-turn conversation with alternating user/assistant message bubbles. Send the full conversation context with each request.
          </li>
          <li>
            <strong>Regeneration:</strong> Allow re-submitting the last user message to get a different response, replacing the previous assistant message.
          </li>
          <li>
            <strong>Error States:</strong> Display appropriate error UX for stream interruption, API errors, and rate limit responses.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Time to First Token (TTFT):</strong> First visible character within 500ms of message submission (network-dependent, UI must not add latency).
          </li>
          <li>
            <strong>Rendering throughput:</strong> Handle 100+ tokens/second without janking the UI. This requires batched rendering — not per-token DOM updates.
          </li>
          <li>
            <strong>UI responsiveness:</strong> Streaming must not block user interactions — the input field, copy buttons, and feedback controls remain responsive during streaming.
          </li>
          <li>
            <strong>Memory:</strong> A 10,000-token response must not cause memory exhaustion or visible slowdown. Virtual scrolling handles long conversation histories.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <li>Stream drops mid-response (network interruption) — show partial response, offer retry button.</li>
          <li>Rate limit error (429) mid-stream — show rate limit message with retry-after countdown.</li>
          <li>User submits a new message before the current response finishes — cancel current stream, start new one.</li>
          <li>Code block spanning many tokens before closing fence — render as indeterminate code block until fence arrives.</li>
          <li>Response contains harmful content that triggers a mid-stream safety filter — stream stops abruptly, show safe messaging.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>
          The request flow: user submits message → add optimistic user message to conversation → create placeholder assistant message in "streaming" state → initiate fetch with AbortController signal → read response.body ReadableStream in a loop → decode each chunk, parse delta tokens → append deltas to the assistant message's text in state → on stream end, transition assistant message to "complete" state. If AbortController.abort() is called, the fetch rejects and the assistant message transitions to "stopped" state.
        </p>
        <p>
          Batching: a time-based batch accumulator collects incoming token deltas and flushes them to React state every 50ms via a requestAnimationFrame callback. This ensures React gets at most one state update per animation frame regardless of token arrival rate, preventing layout thrashing while maintaining sub-100ms visual latency.
        </p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/ai-modern-systems/streaming-chat-ui.svg"
          alt="Streaming chat UI showing message states from loading to streaming to complete, token stream pipeline with SSE, render optimization, error handling, and message persistence"
          caption="Streaming chat UI showing message states from loading to streaming to complete, token stream pipeline with SSE, render optimization, error handling, and message persistence"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Stream Transport: SSE vs Chunked Fetch</h3>
        <p>
          Server-Sent Events (SSE) uses the text/event-stream MIME type. The browser's EventSource API handles reconnection, event parsing, and event ID tracking automatically. Each event is a data: line followed by a newline. SSE is ideal for simple one-way push but EventSource does not support POST requests or custom headers — a limitation that prevents sending the conversation context in the request body.
        </p>
        <p>
          The preferred modern approach is chunked fetch: send a POST request that asks the server to stream events, then read the response body as a stream. This supports POST, custom headers (including authorization), and gives fine-grained control over stream reading and cancellation. In practice, you repeatedly read chunks from the response stream, decode bytes to text, split on newline boundaries, and parse each event line as it arrives.
        </p>
        <p>
          Many hosted LLM streaming APIs use event lines that carry JSON payloads and a terminal marker that signals the end of the stream. The payload typically includes a delta field that contains incremental text (or incremental structured content). The client parses each event payload, appends the delta text to the in-progress assistant message, and, when the terminal marker arrives, finalizes the message and transitions the UI to a completed state.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Message State Machine</h3>
        <p>
          Each message in the conversation has a status discriminated union: idle (sent, waiting for response), streaming (receiving tokens), complete (finished), stopped (user cancelled), error (stream failed). The UI renders different visual states for each: idle shows a loading skeleton, streaming shows a blinking cursor after the partial text, complete shows the final text, stopped shows the partial text with a "(response stopped)" indicator, error shows an error banner with retry.
        </p>
        <p>
          The state machine transition is driven by stream events. On stream open: idle → streaming. On delta received: update text, remain streaming. On [DONE]: streaming → complete. On AbortError: streaming → stopped. On non-abort error: streaming → error. State transitions must be serialized — concurrent transitions (e.g., abort arriving simultaneously with [DONE]) are resolved by whichever transition fires first, with subsequent transitions ignored.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Batching for Render Performance</h3>
        <p>
          Token deltas arrive at 20–60 tokens/second over the network, but network batching often delivers them in larger bursts (10–20 tokens per network event). Calling React's setState on every delta triggers a reconciliation cycle per delta. At 100 tokens/second, this means 100 React reconciliations per second — each one checking if the assistant message component's text changed, triggering a DOM text node update. This causes measurable jank.
        </p>
        <p>
          The batching strategy: maintain a mutable ref (tokenBuffer) outside React state. Each stream delta appends to tokenBuffer. A useEffect sets up a requestAnimationFrame loop that reads tokenBuffer, flushes it to React state if non-empty, and schedules the next frame. This ensures at most one React setState per 16ms (60fps), regardless of token arrival rate. The visual latency from delta to display is at most 16ms + React's render time, which is imperceptible.
        </p>
        <p>
          For very fast streams (&gt;500 tokens/second, such as batch processing scenarios), even rAF-based flushing may accumulate large chunks. In these cases, count-based flushing (flush every 50 tokens) provides a cap on the amount of text that accumulates before rendering.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incremental Markdown Rendering</h3>
        <p>
          Markdown contains structures that are only recognizable once complete: code fences (```javascript opens a code block, the next ``` closes it), bold markers (**text**), and table rows. Mid-stream, an opening code fence without its closing fence renders as literal backticks. This creates a jarring experience as the formatting "snaps in" when the closing fence arrives.
        </p>
        <p>
          Strategies for incremental markdown: use a streaming-aware markdown parser (remark with custom plugins can parse partial trees); buffer complete logical units (detect code fences and buffer until closed, then render the complete block while rendering other non-code text incrementally); or use a simple approach of re-parsing the full accumulated text on each batch flush and diffing the rendered HTML (expensive for long responses but produces correct output at every render).
        </p>
        <p>
          For production systems, the "buffer code blocks, stream prose" strategy works well: maintain a code block state machine alongside token accumulation. When inside a code block, buffer silently (show a placeholder "Loading code..." block). When the closing fence arrives, render the complete block. Prose text renders immediately as it arrives.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">AbortController and Cancellation</h3>
        <p>
          Each streaming request is paired with an AbortController. The controller's signal is passed to the fetch call. The controller reference is stored in a ref so the "Stop" button can access it. Clicking Stop calls controller.abort(), which throws an AbortError from reader.read(), exiting the stream reading loop. The cleanup sets message status to stopped.
        </p>
        <p>
          When the user submits a new message before the current response finishes, the current stream must be cancelled first. The sendMessage function checks if a stream is in progress (isStreaming state or a ref), calls controller.abort() to cancel it, waits for the stream loop to clean up (via an async semaphore or state transition), then starts the new request. This prevents concurrent streams to the same conversation context.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Auto-Scroll Behavior</h3>
        <p>
          During streaming, the chat should auto-scroll to keep the latest content visible. But if the user manually scrolled up to read earlier messages, auto-scroll should pause — it's disruptive to jump the scroll position while the user is reading. Detect user scroll intent: if the scroll position is within 100px of the bottom, continue auto-scrolling on each token batch. If the user scrolls up more than 100px, pause auto-scroll and show a "new tokens arriving" indicator. Resume auto-scroll when the user scrolls back to the bottom.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Message Persistence and History</h3>
        <p>
          Completed messages (both user and assistant) are persisted to localStorage for in-session continuity and optionally to a backend for cross-device access. The persistence layer only activates for complete and stopped messages — streaming messages are transient. On page reload, the conversation history is restored from persistence, including any stopped partial messages, which are displayed with their stopped indicator.
        </p>
        <p>
          Conversation context management: LLMs require the full conversation history in each request (they are stateless). Sending a growing history increases input token costs and latency. Implement context windowing: keep the last N message pairs in the request context. For very long conversations, summarize older messages into a compressed context prepended to the window. Expose the context window usage to the user ("Using 3,200 of 4,096 context tokens").
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Copy, Feedback, and Action Buttons</h3>
        <p>
          Each completed assistant message should have a copy button, thumbs up/down feedback, and regenerate button. These appear on hover for desktop (space efficiency) and are always visible on mobile. The copy button copies the raw markdown text (not the rendered HTML). Thumbs up/down send feedback events to the AI feedback pipeline. Regenerate cancels any current stream, removes the last assistant message, and re-sends the last user message to get a new response.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring and Observability</h3>
        <p>
          Key metrics: TTFT (time from request send to first token rendered) as P50/P90/P99; streaming throughput (tokens per second, by model and context length); cancellation rate (% of streams cancelled by user before completion, indicating overly long or irrelevant responses); error rate by error type (network, API, rate limit, safety filter); and context token usage distribution (are users hitting context limits?). TTFT regressions correlate directly with user satisfaction scores and are the primary health signal for a chat UI.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incremental Rendering vs Formatting Quality</h3>
        <p>
          Rendering every token immediately maximizes perceived responsiveness but produces visually unstable output — formatting markers appearing and disappearing as structures complete. Buffering until complete blocks are parsed produces stable output but adds latency (a large code block doesn't appear until its closing fence arrives). Most production systems choose a middle path: stream prose immediately, buffer formatting-sensitive blocks. This requires a streaming-aware parser but produces the best user experience.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">SSE vs WebSocket</h3>
        <p>
          SSE (via chunked fetch) is unidirectional (server → client) and maps naturally to the request-response-with-streaming pattern of LLM APIs. WebSocket is bidirectional and adds unnecessary complexity for single-stream chat. Use SSE/chunked fetch for LLM streaming. WebSocket is appropriate when the conversation requires server-initiated pushes without a client request (e.g., server sending unsolicited notifications while a conversation is open), but this is not the primary chat pattern.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Context Window Economics</h3>
        <p>
          Sending the full conversation history with each message means input token costs scale O(n²) with conversation length (each message sends all previous messages). At 10-message conversations this is negligible. At 100-message conversations with long responses, input token costs can exceed the cost of the actual generation. Context summarization reduces costs but degrades quality (the model loses access to early conversation details). Track context token usage per conversation and prompt users to start new conversations rather than silently degrading.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          Streaming chat UIs are the defining UX pattern for LLM-based applications. The design centers on chunked fetch with ReadableStream for transport, a message state machine (idle→streaming→complete/stopped/error), requestAnimationFrame-batched token rendering (at most one React update per frame), AbortController-based cancellation, and streaming-aware markdown rendering with code block buffering. Context window management prevents O(n²) token cost growth for long conversations. For staff-level engineers, the critical insights are: TTFT is the primary user satisfaction metric — optimize the server response path before optimizing client rendering; rAF batching is essential at any token throughput above 20/second; handle the code block buffering problem explicitly or accept formatting instability mid-stream; and treat context window management as a first-class product feature rather than an afterthought, as users in long conversations will hit limits in ways that appear as mysterious quality degradations.
        </p>
      </section>
    </ArticleLayout>
  );
}
