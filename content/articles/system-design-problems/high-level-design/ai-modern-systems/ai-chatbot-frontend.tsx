"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-ai-chatbot-frontend",
  title: "Design a Frontend for an AI Chatbot (Streaming, History, Multimodal)",
  description:
    "Architecture for an AI chatbot UI: token streaming with ReadableStream, optimistic rendering, conversation history, context window management, multimodal input, and tool call visualization.",
  category: "high-level-design",
  subcategory: "ai-modern-systems",
  slug: "ai-chatbot-frontend",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-11",
  tags: ["hld", "ai", "chatbot", "streaming", "llm", "multimodal", "sse"],
  relatedTopics: ["rag-based-ui-system", "copilot-style-ai-assistant"],
};

export default function AiChatbotFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">An AI chatbot frontend must solve problems that traditional CRUD UIs never face: the response to a user message is not a single JSON payload returned in 200ms—it is a stream of text tokens arriving over 5–30 seconds, often with tool calls interspersed (the model requests a web search, waits for results, then continues writing). The UI must render tokens as they arrive (streaming), remain responsive during generation (non-blocking), allow the user to stop generation mid-stream, and handle the model's tool call events with progress indicators. All of this must work correctly while also managing conversation history that can span hundreds of turns and approach the model's context window limit.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Multimodal input adds further complexity: users can paste images, attach files, or speak. Each input type requires preprocessing (images to base64 or presigned URLs, files to extracted text, speech to transcript) before being included in the message payload. The UI must accept and preview these inputs inline in the message composer, handle upload failures gracefully, and correctly size image inputs for the model's vision capability limits.</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> The chatbot uses a streaming LLM API (Anthropic Claude or OpenAI GPT). The backend is a Next.js API route (or a Node.js edge function) that proxies the LLM stream to the browser via Server-Sent Events or a streaming fetch response. Conversation history is stored in the browser (IndexedDB) for persistence across page reloads. The context window is 200K tokens. Tool calls (web search, code execution) are executed on the backend and results are injected back into the model's context. The UI supports text, image, file, and voice input.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Streaming response:</strong> Tokens appear in the chat UI as they are generated, with no perceptible lag between the model emitting a token and the user seeing it.</li>
          <li><strong>Optimistic user message:</strong> The user's message appears in the chat immediately on send (before the server acknowledges), eliminating perceived send latency.</li>
          <li><strong>Stop generation:</strong> A "stop" button cancels the in-progress stream. The partial response is preserved in the chat (not discarded).</li>
          <li><strong>Conversation history:</strong> All previous turns in the conversation are sent as context with each new message. The UI displays the full history as a scrollable list.</li>
          <li><strong>Multimodal input:</strong> Users can attach images (paste or file picker), attach documents (PDF, text), and use voice input (Web Speech API). Each input type is previewed before sending.</li>
          <li><strong>Tool call visualization:</strong> When the model invokes a tool (web search, code execution), the UI shows a progress card ("Searching the web for…") and displays the tool result inline before the model's continuation.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Time to first token (TTFT):</strong> The first token must appear in the UI within 800ms of sending the message.</li>
          <li><strong>Render throughput:</strong> The streaming renderer must handle 80 tokens/second without frame drops or input blocking.</li>
          <li><strong>History load:</strong> A conversation with 500 messages loads within 500ms using virtualized rendering.</li>
          <li><strong>Context window awareness:</strong> The UI warns when the conversation approaches the model's context limit and offers to summarize or start a new thread.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The chatbot frontend has three layers: the UI layer (message list renderer, input composer, streaming indicator, tool call cards), the state layer (conversation store managing message history, streaming state, and context window usage), and the transport layer (the streaming fetch connection and its token buffering pipeline). The backend is a thin proxy: an API route that receives the user's message and conversation history, constructs the prompt, calls the LLM's streaming API, and relays the response stream back to the browser. The browser never calls the LLM API directly (to keep API keys server-side and to allow server-side prompt augmentation).</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/ai-chatbot-frontend-architecture.svg"
          alt="AI chatbot frontend architecture showing UI layer (message input, streaming renderer, markdown parser, multimodal input, history manager, abort controller), client state and transport layer (conversation store, SSE/fetch stream, token buffer with rAF flush, context window tracker, tool call renderer, error/retry state), and backend API layer (chat API route, prompt builder, LLM provider, tool execution). Key metrics: TTFT under 800ms, 30-80 tokens/sec, 200K context window, rAF 16ms flush."
          caption="Chatbot architecture: three-layer design (UI / state+transport / backend), rAF token buffering, AbortController stop, and multimodal input pipeline"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Token Streaming Pipeline</h3>
        <HighlightBlock as="p" tier="important">The browser initiates a streaming POST request using the Fetch API with no Content-Length on the response. The response body is a ReadableStream; the client reads it using a TextDecoder and processes each chunk as it arrives. The stream delivers data in Server-Sent Events format: each chunk is a line starting with "data:" followed by a JSON object containing the token text (or a special event type for tool calls, finish signals, or errors). The client parses each SSE line and dispatches the appropriate action.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Raw streaming into React state on every token would cause 80 React re-renders per second at maximum throughput, which is visually indistinguishable from batching but measurably more CPU-expensive. The solution is a token buffer: incoming tokens are appended to a plain JavaScript string (not React state). A requestAnimationFrame loop (running at the screen's refresh rate, typically 60Hz = 16ms) checks if the buffer has new content and, if so, flushes the accumulated tokens to React state in a single setState call. This batches up to 1–2 tokens per frame at 60fps/80 tok/s, reducing React renders from 80/s to 60/s while keeping the UI update latency under 16ms.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The streaming state machine: the conversation store tracks each assistant message's status through states: idle → sending → streaming → complete (or error, or aborted). The streaming state renders a blinking cursor after the last token. The complete state removes the cursor and enables the copy/regenerate buttons. The aborted state shows a "Generation stopped" indicator with the partial text preserved.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic UI and Error Recovery</h3>
        <HighlightBlock as="p" tier="important">When the user submits a message, the UI immediately appends the user's message bubble to the conversation (optimistic update) and shows a "thinking" indicator (three-dot animation) where the assistant's response will appear. This eliminates the latency between hitting send and seeing a response to the user's action—from the user's perspective, the message was sent instantly. The optimistic message has a clientMessageId (UUID) that is matched against the server's response to confirm delivery.</HighlightBlock>
        <p>Error recovery: if the stream fails (network error, server 5xx, timeout), the UI transitions the assistant message to an error state showing "Something went wrong" with a "Try again" button. The retry re-sends the same user message (the conversation history is preserved). Exponential backoff is applied for transient errors: the first retry is immediate (within 1 second), subsequent retries at 2s, 4s, and 8s. After 3 retries, the UI shows a permanent error state with a "Start a new conversation" option. Partial responses (where the stream delivered some tokens before failing) are preserved and shown in the error state so the user does not lose context.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Conversation History and Context Window Management</h3>
        <HighlightBlock as="p" tier="important">Conversation history is stored in IndexedDB (using a library like Dexie.js for a clean API). Each conversation has a conversationId, a list of messages (role: user/assistant/tool, content, timestamp, tokenCount), and metadata (title, model, created/updated timestamps). On page load, the active conversation is loaded from IndexedDB into memory. New messages are appended to IndexedDB synchronously with each turn (before the response is complete, to survive page reloads during generation).</HighlightBlock>
        <HighlightBlock as="p" tier="important">The virtual message list: conversations with 500+ messages cannot efficiently render all message components simultaneously. A virtualized list (using react-virtual or a custom implementation) renders only the messages within or near the viewport (typically 10–20 messages). As the user scrolls up (to read history), older messages are rendered on demand. The virtualized list maintains scroll position correctly during streaming (new tokens appended to the last message do not cause scroll jitter because the last message is always at the bottom of the viewport).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Context window management: the backend tracks the token count of the conversation history being sent to the model. As the conversation grows, older messages are summarized or dropped from the context (the oldest messages are pruned first, preserving the most recent context). The UI shows a context usage bar (e.g., "Used 45K / 200K tokens"). When the context reaches 80% capacity, the UI shows a warning: "This conversation is getting long. Consider starting a new thread or summarizing." The user can trigger a "summarize conversation" action that sends the current history to the model with a summarization prompt and replaces the history with the summary.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Multimodal Input Handling</h3>
        <HighlightBlock as="p" tier="important">The message composer handles three non-text input types. Image input: the user pastes an image (paste event) or selects via file picker. The UI shows an inline thumbnail preview in the composer. Images are resized client-side (using a Canvas element) to the model's maximum image dimension (typically 1568px on the longest side for Claude's vision capability) and encoded as base64. For large images (&gt; 5MB), the client uploads to a presigned S3 URL and includes the URL in the message payload instead of base64 (to avoid sending a large base64 string in the JSON body). The backend fetches the image from S3 before forwarding to the model.</HighlightBlock>
        <p>File input: when the user attaches a PDF or text file, the client reads the file using the FileReader API and extracts text (for PDFs, this requires a client-side PDF parser like pdf.js). The extracted text is included in the message as a content block labeled with the filename. For large files exceeding the context window budget, the client warns the user and offers to truncate or split the document. Voice input: the Web Speech API (SpeechRecognition) provides real-time speech-to-text in supported browsers (Chrome, Safari). The transcript appears in the composer input field as the user speaks; the user can edit the transcript before sending. For browsers without Web Speech API support, the user records audio via MediaRecorder, uploads to a transcription endpoint (Whisper API), and the transcript is returned to the composer.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Tool Call Visualization</h3>
        <p>When the model requests a tool call (web search, code execution, database query), the stream delivers a tool_use event before the model continues writing. The UI renders a tool call card inline in the assistant's message area: a progress card showing the tool name and input parameters while the tool executes ("Searching the web for: quantum computing applications"), then a result card showing the tool output once execution completes. The model's continuation text appears below the result card.</p>
        <p>Tool call cards are collapsible: by default, they show a one-line summary; the user can expand to see the full tool input and output. This keeps the conversation readable without hiding the model's reasoning process. For code execution tool calls, the result card shows the code (syntax-highlighted) and the output (stdout/stderr), with a copy button for each. For web search, the result card shows the top 3 cited URLs with titles, rendered as clickable links.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/ai-chatbot-frontend-streaming-flow.svg"
          alt="Token streaming sequence showing user send → chat store (optimistic bubble) → POST /chat → LLM Provider stream → first token (TTFT 300-800ms) → SSE relay → append to buffer → rAF flush to React state → repeat for every chunk at 30-80 tok/s → stream done → persist IndexedDB. State machine: idle → sending → streaming → complete / aborted / error. Stop button fires AbortController.abort() saving partial response."
          caption="Streaming sequence: optimistic send → TTFT → SSE relay → rAF batch flush → state machine (idle/sending/streaming/complete/aborted/error)"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">SSE versus WebSocket for streaming: both can deliver the token stream. SSE is unidirectional (server to client) which is sufficient—the user message is sent as the initial POST body, and all subsequent communication is the model's response stream. SSE is simpler (standard HTTP, works through HTTP/2 multiplexing, automatic browser reconnection), while WebSocket requires a connection upgrade and custom reconnection logic. The one SSE limitation is the 6-connection limit per domain in HTTP/1.1 (resolved by HTTP/2 which allows unlimited concurrent SSE streams over a single TCP connection). For chatbot use cases, SSE is the correct choice.</HighlightBlock>
        <p>Markdown rendering performance: streaming markdown rendering is harder than rendering complete markdown. A partial markdown string (half-written code block, unclosed bold) is not valid markdown and a standard parser will produce incorrect output. The solution is incremental parsing: the markdown renderer parses the accumulated string on every rAF flush and renders the parse tree. For text, partial strings are handled gracefully (a partial word renders as a partial word). For code blocks, the renderer detects the opening backtick fence and shows a "loading" indicator until the closing fence arrives. Libraries like marked.js handle incremental streaming better than remark (which requires a complete AST).</p>
        <HighlightBlock as="p" tier="important">Conversation storage and privacy: storing conversation history in IndexedDB means the conversation exists only on the user's device (for browser-based storage). This is a privacy-preserving choice (the platform does not retain conversation content on its servers) but prevents cross-device access ("I was chatting on my phone, now I want to continue on my laptop"). The trade-off: if cross-device history is required, conversations must be persisted server-side (in a database, encrypted at rest, accessible only to the authenticated user). The product decision (local-only versus server-synced history) should be made based on the privacy requirements and the user's expectations, not the implementation convenience.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">An AI chatbot frontend is built around a streaming pipeline: the browser opens a streaming POST to an API route that proxies the LLM's SSE stream; tokens are accumulated in a JavaScript buffer and flushed to React state at 60Hz via requestAnimationFrame (batching renders to 60/s instead of 80/s). Optimistic user messages appear immediately on send; assistant messages render incrementally with a blinking cursor during generation. An AbortController stop button cancels the stream and preserves the partial response. Conversation history persists to IndexedDB; a virtualized list renders only visible messages for 500-turn conversations. Context window usage is tracked and warned at 80% capacity with a summarization option. Multimodal input (images: client-side resize + base64/S3; files: client-side text extraction; voice: Web Speech API or Whisper) is previewed in the composer before sending. Tool call events render as collapsible inline cards with progress and result. The defining performance constraint is TTFT under 800ms (requiring edge-deployed API routes near users) and 60fps rendering at 80 tok/s (requiring rAF batch flushing rather than direct setState per token).</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
