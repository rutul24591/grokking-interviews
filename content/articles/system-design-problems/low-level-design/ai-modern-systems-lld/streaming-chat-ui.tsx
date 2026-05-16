"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-streaming-chat-ui",
  title: "Design a Streaming Chat UI",
  description:
    "A staff-level deep dive into building streaming LLM chat interfaces: ReadableStream pipelines, token batching, scroll anchoring, incremental markdown, abort architecture, concurrent stream management, and accessibility.",
  category: "low-level-design",
  subcategory: "ai-modern-systems",
  slug: "streaming-chat-ui",
  wordCount: 4800,
  readingTime: 29,
  lastUpdated: "2026-05-16",
  tags: ["lld", "ai", "streaming", "chat-ui", "real-time", "llm"],
  relatedTopics: ["token-streaming-buffer", "ai-feedback-loop-ui"],
};

export default function StreamingChatUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2>Why Streaming Is Non-Negotiable</h2>
      <p>
        Large language models generate text token-by-token. A typical assistant response of 400 tokens arrives at 40 tokens per second, meaning a user would stare at a blank screen for ten seconds if the system waited for completion before displaying anything. That latency is not just uncomfortable — it fundamentally breaks the conversational mental model. Humans expect near-instant acknowledgment when they communicate. Streaming solves the perceptual problem by rendering the first visible character within 200 to 500 milliseconds of message submission, a figure known as Time to First Token (TTFT). The total generation time is unchanged, but the perceived responsiveness is dramatically improved.
      </p>
      <HighlightBlock as="p" tier="important">
        The engineering challenges behind streaming chat UIs are substantial and often underestimated. Token arrival is bursty — the network delivers tokens in batches, not one at a time. React rendering must be carefully batched to avoid 60-plus DOM mutations per second, which causes measurable layout thrash. Markdown is syntactically incomplete mid-stream: an opening code fence renders as literal backticks until its closing fence arrives. Long responses (10,000 or more tokens) can exhaust memory without virtualization. Users need to cancel mid-response. Multiple conversations may stream concurrently. Mid-stream errors require graceful degradation. Each of these is a distinct engineering problem.
      </HighlightBlock>
      <p>
        This article covers the full implementation surface of a production-grade streaming chat UI: the ReadableStream pipeline for consuming SSE and chunked responses, token batching with requestAnimationFrame, scroll anchor preservation under a growing list, incremental markdown rendering including the incomplete code fence problem, the abort and cancellation architecture, multi-turn conversation state management, the full taxonomy of LLM-specific errors and their UX treatment, concurrent stream management for parallel questions, memory management for long conversations, the regenerate pattern, and accessibility requirements for streaming content.
      </p>

      <ArticleImage
        src="/diagrams/system-design-problems/low-level-design/ai-modern-systems/streaming-chat-ui.svg"
        alt="Streaming chat UI architecture showing the ReadableStream pipeline from SSE through token batching and requestAnimationFrame to React state, with message state machine transitions, scroll anchor logic, and error taxonomy handling"
        caption="Streaming chat UI architecture: ReadableStream pipeline, rAF-gated token batching, message state machine, scroll anchor logic, and error taxonomy"
      />

      <h2>The ReadableStream and TextDecoder Pipeline</h2>
      <p>
        Modern LLM APIs return streaming responses over HTTP using either Server-Sent Events (SSE) with the text/event-stream content type or raw chunked transfer encoding over a standard POST endpoint. The EventSource browser API handles SSE natively but does not support POST requests or custom authorization headers, making it impractical for authenticated LLM APIs that need to send conversation context in the request body. The correct approach is to use the Fetch API and read the response body as a ReadableStream.
      </p>
      <HighlightBlock as="p" tier="important">
        The pipeline begins by calling fetch with an AbortController signal, receiving the response, and then calling response.body.getReader() to obtain a ReadableStreamDefaultReader. The read loop awaits reader.read() on each iteration, which returns an object with a done boolean and a value Uint8Array. When done is true, the stream is exhausted. The Uint8Array chunks from the network layer are arbitrary byte boundaries — a single SSE event may arrive split across two chunks, or one chunk may contain several events. The TextDecoder must be initialized with the stream option set to true so that multi-byte UTF-8 sequences split at chunk boundaries are reconstructed correctly across calls. Without streaming decode mode, a Unicode character whose bytes span two network chunks produces a replacement character rather than the correct codepoint.
      </HighlightBlock>
      <p>
        After decoding each chunk to a UTF-8 string, a line accumulator handles the fact that SSE events are newline-delimited. Maintain a string buffer between chunks. On each new decoded string, append to the buffer and scan for complete lines (terminated by line feed). Complete lines are dispatched to the event parser; the remainder after the last newline stays in the buffer for the next chunk. This boundary handling is critical — omitting it produces silently corrupted event parsing when an SSE data line happens to be split at a chunk boundary.
      </p>
      <p>
        OpenAI and Anthropic use subtly different streaming event formats. The OpenAI format sends lines beginning with "data: " where the payload is a JSON object containing a choices array. Within each choice, the delta field carries an optional content string with the incremental text for that token. A special sentinel event with a data payload of "[DONE]" signals the end of the stream. The finish_reason field in the final non-DONE event indicates why generation stopped: the values "stop" (natural completion), "length" (hit max tokens), "content_filter" (safety system triggered), and "function_call" (the model requested a tool call) each require different UX treatment.
      </p>
      <p>
        The Anthropic format uses an event-type system. The raw SSE events carry both an "event:" field indicating the event type and a "data:" field with a JSON payload. Relevant event types include "content_block_delta" (incremental text, with a delta.text field and an index indicating which content block this belongs to), "message_delta" (carries finish_reason and output token count in the final delta), and "message_stop" (stream termination). The index field in content_block_delta matters for multi-content responses where the model may interleave text and tool use content blocks. A robust parser must track all active content block indices rather than assuming a single sequential text output.
      </p>

      <h2>Token Batching and requestAnimationFrame</h2>
      <p>
        Tokens arrive at 20 to 60 per second on average, but network batching delivers them in bursts. A typical 50ms network event delivers 10 to 20 tokens simultaneously. Naively calling React's setState on every delta triggers a full reconciliation cycle for each — at 100 tokens per second that means 100 React renders per second, each one diffing the message component tree to discover the text node changed. This causes measurable frame drops because React renders are not aligned with the browser's paint schedule.
      </p>
      <HighlightBlock as="p" tier="crucial">
        The correct pattern keeps a mutable string accumulator — stored as a React ref so it survives renders without causing them — outside of React state entirely. Each delta from the stream reading loop appends to this accumulator string. A separate requestAnimationFrame loop, started in a useEffect when a message enters streaming state and cancelled when streaming ends, fires once per animation frame (approximately every 16 milliseconds at 60fps). Each frame, the rAF callback checks whether the accumulator contains text that has not yet been flushed to React state. If it does, it calls setState exactly once with the full accumulated text. If the accumulator is empty, the rAF callback schedules itself for the next frame without calling setState. This guarantees at most one React state update per animation frame regardless of token arrival rate. The visual latency from a token arriving to it appearing on screen is bounded by one frame period plus React's reconciliation time — imperceptible to users while completely eliminating the jank of per-token updates.
      </HighlightBlock>
      <p>
        For extremely fast streams exceeding 500 tokens per second — which can occur during batch processing scenarios or when a server is replaying a cached response — even rAF-aligned flushing accumulates large text chunks between frames. In these cases, add a secondary count-based threshold: if the accumulator exceeds 200 characters since the last flush, trigger an immediate flush outside the rAF cycle. This prevents large visual jumps where hundreds of tokens appear at once after a pause. The combination of rAF timing plus character count threshold provides both smooth rendering at normal speeds and bounded chunk size at extreme speeds.
      </p>
      <p>
        One subtlety: React 18's automatic batching already batches multiple synchronous setState calls within a single event handler or microtask. But the rAF callback is a macrotask and runs outside React's batching context. The single setState call per rAF frame is still correctly batched with any other state updates happening in the same frame. Never use flushSync within the streaming render path — it forces a synchronous render mid-frame, defeating the purpose of rAF alignment.
      </p>

      <h2>Scroll Anchor Preservation During Streaming</h2>
      <p>
        Auto-scrolling a chat list to follow new content is straightforward to implement naively and surprisingly difficult to implement correctly. The naive approach calls scrollIntoView on the last message element after every state update. This works when the user is at the bottom of the conversation, but immediately fails if the user has scrolled up to re-read earlier messages: every new token jerks the scroll position back to the bottom, making it impossible to read history while a response is streaming.
      </p>
      <HighlightBlock as="p" tier="important">
        The correct implementation tracks scroll intent by measuring the distance between the current scroll position and the maximum scroll position. If this distance is below a threshold — typically 80 to 120 pixels, corresponding to less than one row of content — the user is considered "pinned to the bottom" and auto-scroll should continue. If the distance exceeds the threshold, the user has intentionally scrolled up and auto-scroll should pause. This scroll position check is done in a scroll event listener with a debounce of 100 milliseconds to avoid rapid firing. When auto-scroll is paused, display a "Skip to bottom" indicator (a small floating button or animated arrow at the bottom of the chat container) that, when clicked, resumes auto-scroll and animates back to the bottom.
      </HighlightBlock>
      <p>
        The unique challenge in streaming chat is that the container height grows continuously as tokens arrive. A user who was pinned 100 pixels from the bottom one second ago may now be 1,000 pixels from the bottom if 50 lines of text streamed in while they were reading. The intent detection must be sticky: once the user intentionally scrolls up (as opposed to the scroll position changing because new content pushed existing content down), they should remain in "paused" mode until they explicitly scroll back down or click the indicator. Detect intentional scroll up by checking whether the scroll event was triggered by user interaction versus programmatic scroll — this can be done by setting a flag in the rAF flush callback before calling scrollIntoView and clearing it in the next event loop tick.
      </p>
      <p>
        For virtualized lists (necessary for conversations with hundreds of messages), the scroll anchor problem becomes more complex because the container's scrollable height is synthetic. Libraries like react-virtual or TanStack Virtual expose imperative scroll APIs and provide scrollToIndex methods that should be used instead of native scroll manipulation. The pinned-to-bottom detection uses the same principle but measures against the virtual list's reported total height versus scroll offset.
      </p>

      <h2>Incremental Markdown Rendering</h2>
      <p>
        Markdown's power as an LLM output format is also its curse for streaming rendering. Most meaningful markdown structures are only parseable once complete: a code fence starting with three backticks and a language identifier is syntactically incomplete until its closing three-backtick fence arrives, potentially 200 tokens later. During that interval, rendering the partial text produces a confusing jumble of backticks and raw code rather than a highlighted code block. Similarly, bold markers, italic markers, table rows, and block quotes all require their closing syntax before they can be rendered correctly.
      </p>
      <HighlightBlock as="p" tier="important">
        Production streaming chat systems use a hybrid rendering strategy: stream prose text immediately, buffer syntactically-sensitive structures until complete. This requires running a lightweight state machine alongside token accumulation to track the current structural context. The state machine has states for: normal prose, inside a code fence, inside a table, inside a potentially-incomplete inline marker (bold, italic). In prose state, all text flushes immediately through the rAF batch loop. Upon detecting an opening code fence — three consecutive backticks — the state machine transitions to code-fence state and begins buffering. While in code-fence state, the UI shows a placeholder skeleton (a dimmed rectangle the height of a typical code block, perhaps with the language label already displayed) to indicate that code is being generated. When the closing three-backtick fence arrives, the complete code block is released from the buffer and rendered with full syntax highlighting. All prose text that arrived between the opening and closing fences was being buffered, not displayed.
      </HighlightBlock>
      <p>
        Streaming-aware markdown parsers offer an alternative to the manual state machine. The remark ecosystem allows incremental parsing through its AST representation, and custom plugins can expose intermediate trees. The marked library has a streaming mode where you feed it characters one at a time and receive AST nodes as they complete. However, these parsers add significant bundle weight and configuration complexity. For most products, the manual state machine tracking only the most common incomplete structures — code fences and tables — provides 95% of the value at 10% of the complexity.
      </p>
      <p>
        Inline structures (bold, italic, inline code) are harder to buffer correctly because their boundaries are ambiguous mid-stream. A single asterisk might be the opening of bold text or a literal asterisk used as a bullet point. The pragmatic approach is to not buffer inline structures and instead use a "last-resort" re-render: when the stream completes, do a final render pass of the complete accumulated text through the full markdown parser. This produces a brief visual snap (the text re-renders with correct inline formatting applied) at the moment streaming ends, which is generally acceptable because the snap coincides with the natural attention shift from "watching tokens arrive" to "reading the complete response."
      </p>

      <h2>Abort and Cancellation Architecture</h2>
      <p>
        Every streaming request must be paired with an AbortController. The controller's signal is threaded into the fetch call's signal option, and a reference to the controller is stored in a React ref accessible to the component's event handlers. When the user clicks the Stop button, the handler calls controller.abort(). This causes the pending reader.read() promise to reject with an AbortError. The stream reading loop catches this specific error and transitions the message from streaming state to stopped state, preserving whatever partial text has already been accumulated.
      </p>
      <HighlightBlock as="p" tier="important">
        Cancellation needs to handle several concurrent signals cleanly. If the user submits a new message while a response is streaming, the in-progress stream must be aborted before the new request begins — otherwise two streams update the same conversation state simultaneously. The safest pattern is to store the active AbortController in a module-level ref (not component state) so it is accessible from the new-message submission handler without stale closure issues. The submission handler calls currentController.abort(), awaits a microtask to allow the stream loop's cleanup code to run, then initializes a new AbortController for the new request.
      </HighlightBlock>
      <p>
        Partial response preservation is a UX feature that requires deliberate design. When a stream is aborted mid-response, the partial text accumulated so far is retained in the message's content field and the message status transitions to "stopped." A visual indicator — "Response stopped" in muted text below the message — communicates that this is an incomplete response. The partial text is preserved in localStorage or the server conversation store as a stopped message so it survives page refresh. On retry, the user can either regenerate from the same message (starting fresh) or, if the application supports continuation, send a follow-up asking the model to continue from where it left off.
      </p>
      <p>
        True continuation from a stopped response is not directly supported by most LLM APIs — they do not accept a partial assistant message as a conversation context entry. The workaround is to include the partial response in the conversation context as a complete assistant turn and add a synthetic user turn saying "Please continue your response from where you left off." This produces acceptable results for factual content but can cause coherence issues if the model second-guesses its partial response rather than simply continuing it.
      </p>

      <h2>Multi-Turn Conversation State</h2>
      <p>
        The conversation state model is an ordered array of message objects, each containing an id (UUID), role ("user" or "assistant"), content (the message text), status ("idle," "streaming," "complete," "stopped," or "error"), createdAt (timestamp), and metadata (model used, input and output token counts for completed messages, generation time). The role system is fundamental to how LLM APIs accept conversation context: each request sends the full array of previous messages with their roles, allowing the model to reference prior turns.
      </p>
      <HighlightBlock as="p" tier="important">
        Context window management is a first-class product concern rather than an afterthought. Input tokens cost money and time — sending a 200-message conversation history with each request means the input token count grows quadratically with conversation length. At a 128,000-token context window with messages averaging 200 tokens each, the limit is reached around message 600 of a symmetric conversation. The UI must communicate context window consumption to users. A token usage indicator — "Using 12,400 of 128,000 context tokens" displayed in the header or footer — helps users understand when they are approaching limits. When the context window is nearly full, a warning prompt suggests starting a new conversation or summarizing the history.
      </HighlightBlock>
      <p>
        Context windowing strategies for long conversations include hard truncation (drop the oldest messages when the count exceeds a threshold), sliding window (send only the last N message pairs), and summarization (periodically replace the oldest portion of the conversation with a compressed summary prepended as a system message). Hard truncation is simplest and most predictable. Sliding window produces good quality as long as the window covers the relevant context. Summarization preserves more information but requires an additional LLM call and introduces summary quality variability. Most production systems use sliding window for automatic management and expose manual summarization as a user action.
      </p>

      <h2>Error Taxonomy for LLM Streaming</h2>
      <p>
        LLM streaming introduces error modes that have no analogue in standard HTTP APIs. Each requires a distinct UX treatment because the underlying cause and the appropriate user action differ significantly.
      </p>
      <HighlightBlock as="p" tier="crucial">
        TTFT timeout: the request was sent but no first token arrived within a threshold (typically 10 to 15 seconds). This is distinct from a network timeout because the connection is open and the server is processing. It usually indicates backend queue depth (the model server is overloaded) or a very long input context being processed. The UX shows a skeleton placeholder with a patience indicator ("This is taking longer than usual...") rather than an immediate error. After the extended timeout, surface a retry option.
      </HighlightBlock>
      <p>
        Mid-stream network error: the stream drops partway through a response. This is distinguishable from user-initiated abort because it manifests as an unexpected stream termination or a network-level error on reader.read(). The partial response is preserved with a "Response interrupted" indicator and a retry button. Retrying from a mid-stream interruption has the same continuation problem as user-initiated abort.
      </p>
      <p>
        Rate limit (HTTP 429): the API returns a rate limit response before the stream begins. This is detectable at the fetch response status before reading the body. The error response includes a Retry-After header indicating how many seconds to wait. The UX shows a countdown timer ("Rate limit reached. Retrying in 23 seconds.") with the option to cancel the queued retry. Do not automatically retry without user feedback — users may have time-sensitive reasons to want to know immediately rather than wait.
      </p>
      <p>
        Context overflow: the input token count exceeds the model's context window. This returns a specific error code (context_length_exceeded in OpenAI's error taxonomy). The UX must not just say "error" — it must explain that the conversation is too long and offer clear actions: start a new conversation, or summarize the history to free context space.
      </p>
      <p>
        Content policy rejection: the model's safety system declined to generate a response. This may arrive as a pre-generation rejection (HTTP 400 with a safety error code before streaming begins) or as a mid-stream finish_reason of "content_filter" (the safety system intervened after generation began). Pre-generation rejections show a clear "This content was declined" message. Mid-stream safety interventions are more nuanced because the model may have generated partial content before the intervention — the partial content must be evaluated against the application's policy before deciding whether to display it. Conservative applications discard all partial content; others display the partial content with a notice about the safety intervention.
      </p>

      <h2>Concurrent Stream Management</h2>
      <p>
        Advanced chat interfaces allow users to ask parallel questions — opening multiple chat panels or sending several messages before waiting for responses. Each active stream is completely independent and must not share state with other streams. The isolation requirement extends to the AbortController (aborting one stream must not affect others), the token accumulator (each stream has its own mutable ref), and the rAF loop (each streaming message has its own animation frame registration).
      </p>
      <HighlightBlock as="p" tier="important">
        Implementing concurrent stream isolation correctly requires a per-message streaming state pattern rather than a single global streaming state. Each message in the conversation array carries its own streaming lifecycle: its own AbortController reference, its own accumulator, its own rAF registration. A message component subscribes only to the state of its own message object. This is most cleanly implemented with a streaming context per message — a React context scoped to the message component tree that carries the abort function and the streaming status without exposing them to sibling messages.
      </HighlightBlock>
      <p>
        Resource management for concurrent streams is a practical concern. Each active stream holds an open TCP connection (or HTTP/2 stream). Browser connection limits per origin (typically 6 for HTTP/1.1, higher for HTTP/2) apply. For HTTP/2 streaming endpoints, multiple concurrent streams to the same origin share a single connection and are limited by stream multiplexing capacity. If the user has 10 concurrent streams and the connection limit is 6, the last 4 queue behind the first 6. Surface this as a visual "Queued" status on messages waiting for a connection slot rather than silently blocking.
      </p>

      <h2>Memory Management for Long Conversations</h2>
      <p>
        A conversation with 500 messages, each averaging 200 tokens of text at roughly 4 characters per token, accumulates approximately 400KB of text in the message array held in React state. Rendering 500 message components simultaneously — even if most are scrolled out of view — puts significant pressure on the DOM and React's reconciliation work. Virtual scrolling is the standard solution: render only the messages visible in the viewport plus a modest overscan buffer, and reuse DOM nodes as messages scroll in and out of view.
      </p>
      <p>
        React-virtual and TanStack Virtual provide the core virtualization primitives. For chat lists, the additional complexity is that message heights are variable and unknown until the message is rendered (because markdown content expands to different heights depending on its structure). Variable-height virtualization requires measuring each message's height after initial render and caching it. When a streaming message is growing, its height changes on every rAF flush — the virtualization library must be notified of height changes to keep the scroll container sized correctly.
      </p>
      <HighlightBlock as="p" tier="important">
        Message windowing for context purposes is separate from UI virtualization. The API context window limits how many messages are sent with each request. The UI virtualization limits how many message DOM nodes exist simultaneously. Both limits exist for different reasons (cost/quality versus performance) and must be configured independently. A conversation might have 500 messages in the UI (virtualized) but only send the last 20 in each API request (context windowing). These two numbers should not be conflated in the data model.
      </HighlightBlock>

      <h2>The Regenerate Pattern</h2>
      <p>
        The regenerate action — requesting a fresh response to the last user message — is deceptively complex to implement correctly. The user clicks "Regenerate" on the last assistant message. The expected behavior: cancel any in-progress stream (if the previous response is still generating), remove the last assistant message from the conversation display, re-send the last user message to the API, and stream the new response in place of the removed message.
      </p>
      <p>
        The implementation sequence: call abort on the current AbortController if streaming is active, wait for the stream loop cleanup code to complete (this can be awaited via a cleanup promise stored alongside the controller), remove the last message from the conversation array, add a new placeholder assistant message with "idle" status, then initiate the new streaming request targeting the new placeholder message. The optimistic removal of the old message and addition of the placeholder happen synchronously before the new request begins, so the user sees immediate visual feedback (the old message disappears, a loading indicator appears) without waiting for the network round trip.
      </p>
      <HighlightBlock as="p" tier="important">
        The conversation history sent with the regenerate request must not include the old assistant message being replaced. Only the user messages up to and including the last user message are included in the context. If the old assistant message were included, the model would see its previous response and potentially anchor to it rather than generating a genuinely different response. This means the regenerate action must reconstruct the conversation array with the last assistant message removed before building the API request payload.
      </HighlightBlock>

      <h2>Accessibility for Streaming Content</h2>
      <p>
        Streaming content presents unique accessibility challenges. Screen readers process page content when it changes, but a continuously-updating text node that receives new text every 16ms would overwhelm a screen reader with thousands of announcements per second. The correct approach uses aria-live regions with careful politeness settings.
      </p>
      <HighlightBlock as="p" tier="important">
        The streaming message container should carry aria-live="polite" rather than aria-live="assertive." The polite setting allows the screen reader to finish its current announcement before processing new content, which is appropriate for streaming chat where content is informational rather than urgent. The aria-atomic="false" attribute (the default) allows the screen reader to announce incremental changes rather than the full text on every update. In practice, most screen readers with aria-live="polite" and frequent updates will debounce their announcements, reading accumulated content at natural speech pauses rather than announcing each individual character.
      </HighlightBlock>
      <p>
        The pause/resume mechanism for accessibility is important but rarely implemented. A user who relies on a screen reader should be able to pause the streaming announcement to re-read what was already said before the stream continues. Implement a keyboard shortcut — commonly Space or P — that calls AbortController.abort() on the visual stream to pause rendering, accompanied by an aria-live announcement of "Streaming paused. Press Space to resume." Resume restores the rAF flush loop without restarting the network request (the accumulator continues to fill from the ongoing stream even while the rAF loop is paused; resuming allows the accumulated text to flush in batches).
      </p>
      <p>
        The blinking cursor indicator that typically appears at the end of streaming text — a CSS animation on a pseudo-element — should be hidden from screen readers using aria-hidden="true" to avoid being announced as content. The message status transition from streaming to complete should trigger a single focused aria-live announcement: "Response complete." This gives keyboard and screen reader users a clear signal that the response is finished and they can begin interacting with message action buttons.
      </p>

      <h2>Observability and Performance Measurement</h2>
      <p>
        A production streaming chat system requires continuous measurement of several metrics that do not exist in traditional request-response APIs. TTFT (Time to First Token) is measured from the moment the user's message submission event fires to the moment the first rendered character appears in the DOM — not just when the first network chunk arrives, but when it becomes visible. This end-to-end TTFT includes network round trip, server queuing, model processing, and client-side rendering time. Track TTFT as P50, P90, and P99 by model, context length bucket, and geographic region.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Streaming throughput (tokens visible per second from the user's perspective, accounting for the rAF batching delay) should stay above 30 tokens per second on P90 devices to maintain the streaming illusion. Frame rate during streaming — measured by a requestAnimationFrame timestamp delta monitor running in the streaming component — should stay at or above 55fps on P90 devices. Frame rate degradation during streaming indicates the rAF render loop is exceeding the 16ms frame budget, likely due to expensive markdown rendering or large DOM updates. Cancellation rate (percentage of streams aborted by the user before completion) is a product-level signal: rates above 20% suggest the model is generating overly verbose or irrelevant responses, and rates above 40% indicate a severe quality problem.
      </HighlightBlock>

      <h2>Interview Questions and Answers</h2>

      <h3>Q: How would you architect the token batching system to avoid jank without introducing perceptible latency?</h3>
      <HighlightBlock as="p" tier="important">
        Maintain a mutable string accumulator outside React state — a ref, not useState. Every delta from the stream reading loop appends to this accumulator string synchronously. A requestAnimationFrame loop, registered in a useEffect when a message enters streaming state, fires once per 16ms frame. Each frame, the loop checks whether the accumulator has new content since the last flush. If it does, it calls setState exactly once with the full accumulated text. If not, it reschedules itself for the next frame without causing any React work. This caps React reconciliation at 60 times per second regardless of token arrival rate. Add a secondary character count threshold of 200 characters to prevent large visual jumps during extremely fast streams. The visual latency from token arrival to screen is bounded by one frame period — 16ms — plus React's reconciliation time, which is 2 to 5ms for a typical message component. Total visual latency: under 20ms, imperceptible to users.
      </HighlightBlock>

      <h3>Q: Describe the scroll anchor preservation problem in detail and how you solve it.</h3>
      <HighlightBlock as="p" tier="important">
        The problem is that auto-scroll must continue when the user is at the bottom (tracking new content) but must stop when the user intentionally scrolls up (reading history). Naive implementations call scrollIntoView after every render, which disrupts reading. The solution uses intent detection: measure the distance from the current scroll position to the scroll container's maximum scroll position. Below a threshold of about 100 pixels, the user is considered pinned to the bottom. Above the threshold, they have intentionally scrolled up. The key subtlety is distinguishing intentional user scroll from scroll position changes caused by programmatic scroll or by new content pushing existing content down. Set a flag in the rAF flush callback before any programmatic scroll, and clear it in the next event loop tick. If a scroll event fires while the flag is set, it was programmatic and should not change the pinned state. If it fires while the flag is clear, it was user-initiated. When paused, show a floating skip-to-bottom button that resumes pinned state on click.
      </HighlightBlock>

      <h3>Q: How do you handle the incomplete code fence problem in streaming markdown?</h3>
      <HighlightBlock as="p" tier="important">
        Run a lightweight state machine alongside the token accumulator to track structural context. The state machine starts in prose state and transitions to code-fence state upon detecting three consecutive backticks. In prose state, all accumulated text flushes normally through the rAF batch loop. In code-fence state, text is buffered silently — not displayed — and the UI shows a placeholder skeleton indicating code is generating. When the closing three-backtick fence is detected, the complete code block is released from the buffer and rendered with syntax highlighting. Prose text between code blocks flushes normally, so only the code blocks experience buffering delay. For inline formatting markers (bold, italic), accept the formatting-snap tradeoff: stream them as plain text, then do a final re-render pass through the full markdown parser when the stream completes. The snap is a brief visual transition that coincides with the natural attention shift when reading begins.
      </HighlightBlock>

      <h3>Q: Walk through the abort/cancel architecture, including the case where the user submits a new message before the current response finishes.</h3>
      <HighlightBlock as="p" tier="important">
        Each streaming request is paired with an AbortController stored in a module-level ref — not component state, to avoid stale closure issues. The controller's signal is passed to the fetch call. When the user clicks Stop, the handler calls controller.abort(), which causes the pending reader.read() to reject with an AbortError. The stream loop catches AbortError specifically (distinguishing it from other errors), transitions the message to stopped status, and preserves partial text. When the user submits a new message while streaming is active, the submission handler reads the current controller from the module-level ref, calls abort on it, and then initializes a fresh AbortController for the new request. A cleanup promise associated with the previous stream can be awaited to ensure the old stream loop's finally block has completed before the new request begins, preventing race conditions on shared conversation state.
      </HighlightBlock>

      <h3>Q: How do you handle the five distinct LLM error types differently in the UI?</h3>
      <HighlightBlock as="p" tier="important">
        TTFT timeout (no first token in 10 to 15 seconds) shows a patience indicator with "This is taking longer than usual" text; after the extended threshold, surfaces a retry button. Mid-stream network error preserves the partial response with "Response interrupted" and a retry button — no panic, just graceful degradation. Rate limit 429 reads the Retry-After header and shows a countdown timer with cancel option; automatic retry after the countdown, with user agency to cancel. Context overflow explains the specific cause ("Conversation too long for this model") and offers "Start new conversation" and "Summarize history" as actionable options. Content policy rejection distinguishes pre-generation refusals (show a clear "This content was declined" with policy explanation) from mid-stream safety interventions (discard partial content in conservative applications, or show partial with safety notice). The key principle: each error has a distinct cause and a distinct recovery action — generic "An error occurred" messaging fails users by hiding information they need to take the correct next step.
      </HighlightBlock>

      <h3>Q: How do you approach accessibility for continuously-updating streaming text?</h3>
      <HighlightBlock as="p" tier="important">
        Use aria-live="polite" on the streaming message container, not "assertive," so screen reader announcements do not interrupt the user's current interaction. Set aria-atomic="false" to allow incremental announcements rather than re-reading the full text on every update. Screen readers with polite aria-live naturally debounce rapidly-changing content and announce at speech pauses, which maps well to streaming text. Add a keyboard shortcut (commonly Space) that pauses the rAF flush loop without stopping the underlying stream — the accumulator continues filling while the reader processes what has been announced. An aria-live announcement of "Streaming paused" confirms the action. Resuming flushes the accumulated buffer in batches. The blinking cursor element at the end of streaming text must carry aria-hidden="true" to prevent it from being announced. When streaming completes, a single aria-live announcement of "Response complete" signals to screen reader users that action buttons (copy, regenerate, feedback) are now available.
      </HighlightBlock>
    </ArticleLayout>
  );
}
