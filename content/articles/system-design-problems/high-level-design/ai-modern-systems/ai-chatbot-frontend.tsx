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

      <h2>Definition &amp; Context</h2>
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

      <h2>Core Concepts</h2>
      <p>The core concepts are streaming token delivery, durable conversation state, provider abstraction, abort handling, tool-call rendering, context-window management, safety boundaries, and accessibility during incremental output. These concepts define the production contract for AI chatbot frontend: what the UI can promise, what the backend must enforce, and what operators need to observe when the feature behaves unexpectedly.</p>
      <p>For principal-level interviews, frame this as a product system rather than a model demo. The answer should cover ownership, permissions, safety, rollback, quality measurement, degraded behavior, and cost control in addition to the visible interaction.</p>

      <h2>Architecture &amp; Flow</h2>
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

      <h3 className="mt-6 mb-3 text-lg font-semibold">Token Streaming Pipeline</h3>
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

      <ArticleImage
        src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/ai-chatbot-frontend-streaming-flow.svg"
        alt="Streaming flow from user submission through backend proxy, provider stream normalization, token buffer, animation-frame rendering, abort handling, and durable conversation storage"
        caption="Streaming flow: normalize provider events, batch tokens before React rendering, preserve abort semantics, and persist partial responses"
      />

      <h3 className="mt-6 mb-3 text-lg font-semibold">Stop Generation and AbortController</h3>
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

      <h3 className="mt-6 mb-3 text-lg font-semibold">Optimistic UI and Message Ordering</h3>
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

      <h3 className="mt-6 mb-3 text-lg font-semibold">Conversation History and Context Window Management</h3>
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

      <h3 className="mt-6 mb-3 text-lg font-semibold">Multimodal Input Handling</h3>
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

      <h3 className="mt-6 mb-3 text-lg font-semibold">Tool Call Visualization</h3>
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

      <h3 className="mt-6 mb-3 text-lg font-semibold">Markdown Rendering During Streaming</h3>
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

      <h3 className="mt-6 mb-3 text-lg font-semibold">Error Taxonomy and Recovery</h3>
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

      <h3 className="mt-6 mb-3 text-lg font-semibold">Backend Proxy Design</h3>
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
      <ArticleImage
        src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/ai-chatbot-frontend-provider-routing.svg"
        alt="Provider routing diagram showing model gateway policy, primary and fallback model providers, circuit breakers, quota enforcement, region-aware routing, and normalized event output back to the browser"
        caption="Provider routing: keep the browser insulated from provider-specific formats, rate limits, outages, and model fallback policy"
      />

      <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-Level Operating Model</h3>
      <p>
        A principal-ready chatbot design needs an operating model, not just a component
        diagram. The owner must define service-level objectives around time to first
        token, stream completion rate, cancellation rate, provider error rate, tool
        failure rate, and answer quality. TTFT should be tracked separately from total
        generation time because users perceive the first visible token as responsiveness,
        while total generation time mostly affects patience once the conversation is
        already moving. Track TTFT by model, provider, region, prompt length bucket,
        attachment type, and whether retrieval or tools were invoked.
      </p>
      <p>
        Cost is an architecture constraint. Every turn has input tokens, output tokens,
        retrieval cost, tool execution cost, and storage cost. A high-traffic chatbot
        should enforce per-user and per-tenant budgets before the request reaches the
        provider. The budget service should estimate cost from selected model, context
        size, expected output cap, and enabled tools, then either allow the request,
        downgrade to a cheaper model, trim context through summarization, or ask the
        user to confirm a high-cost operation. Without this guardrail, an accidentally
        large context window or a runaway agent loop can create a production incident
        that looks like normal traffic until the invoice arrives.
      </p>
      <HighlightBlock as="p" tier="crucial">
        Provider fallback must be product-aware. Blindly failing over from one model to
        another can change output quality, safety behavior, citation style, tool-call
        schema, latency, and cost. The model gateway should make fallback decisions from
        policy: which use cases allow degraded models, which require exact tool schemas,
        which require data residency, and which should fail closed rather than return a
        lower-confidence answer. The UI should surface degraded mode when the fallback
        materially affects user expectations.
      </HighlightBlock>

      <h3 className="mt-6 mb-3 text-lg font-semibold">Safety, Privacy, and Abuse Controls</h3>
      <p>
        Chatbot frontends are a boundary where untrusted user input, model output, files,
        tool calls, and rendered HTML-like markdown meet. Treat every model response as
        untrusted content. Markdown rendering must sanitize HTML, block script execution,
        validate links, and isolate rich previews. Tool-call output must be rendered as
        data, not trusted markup. If the assistant can return tables, code snippets,
        citations, or file previews, each renderer needs its own escaping and content
        security posture.
      </p>
      <p>
        Prompt injection is a cross-layer problem. The frontend should not promise that
        client-side filtering alone can stop it, but it can reduce impact by making tool
        permissions explicit, showing which external documents were used, requiring user
        confirmation before destructive tools, and making cited sources inspectable.
        The backend should classify tools by risk, enforce least privilege per tool,
        redact secrets before tool output reaches the model, and log tool invocations
        with request IDs so suspicious behavior can be audited after the fact.
      </p>
      <p>
        Multimodal attachments expand the privacy surface. Images may contain faces,
        documents may contain customer data, and audio may contain sensitive speech.
        The upload pipeline should show retention policy before upload, attach tenant
        and purpose metadata to every object, avoid placing raw files in analytics logs,
        and delete temporary uploads after the conversation retention window expires.
        Enterprise deployments need controls for disabling provider-side training,
        regional storage, audit exports, and legal hold.
      </p>

      <h3 className="mt-6 mb-3 text-lg font-semibold">Capacity Planning, Rollout, and Migration</h3>
      <p>
        Capacity planning for a chatbot frontend starts with concurrency, not page views.
        A user can hold a stream open for 30 seconds, and each stream consumes browser
        memory, an HTTP connection, backend worker time, provider-side generation
        capacity, and token budget. A product with 100,000 daily active users can still
        overwhelm the model gateway if a launch event causes 5,000 simultaneous long
        generations. The capacity model should estimate active streams, average stream
        duration, P95 output tokens, attachments per request, and tool invocations per
        turn. The bottleneck is often not the React UI; it is the provider quota, gateway
        connection pool, retrieval dependency, or tool execution queue.
      </p>
      <p>
        The gateway should expose backpressure to the UI explicitly. If the request is
        queued because provider concurrency is exhausted, the assistant placeholder
        should show a queued state rather than pretending the model is thinking. If the
        queue exceeds a product-defined threshold, the gateway can offer a cheaper model,
        shorter answer mode, or delayed notification. Principal-level design includes
        the user promise: users should know whether they are waiting for computation,
        retrieval, queue capacity, a tool, or a degraded fallback. Ambiguous loading
        states turn operational incidents into user mistrust.
      </p>
      <p>
        Rollout should be staged by capability, tenant, model, and traffic percentage.
        Start with text-only chat and no tools, then enable file upload, then retrieval,
        then low-risk tools, then high-risk tools requiring confirmation. Each capability
        adds new failure modes and observability dimensions. For example, enabling file
        upload adds parsing failures, virus scanning latency, storage retention policy,
        and context explosion. Enabling tools adds permission checks, tool timeout
        handling, replay protection, and audit logs. A feature flag matrix should allow
        the team to disable only the failing capability without taking down the entire
        chatbot.
      </p>
      <p>
        Migration between model providers or API versions must be treated as a behavior
        migration, not just an SDK upgrade. Run shadow traffic for representative prompts,
        compare tool-call schemas, citation density, refusal behavior, latency, output
        length, and user feedback rates. Store the provider, model, prompt template
        version, retrieval version, and tool schema version on every assistant message.
        Without that metadata, debugging a bad answer becomes guesswork: the team cannot
        tell whether the regression came from a model change, prompt change, retrieval
        change, or frontend renderer bug.
      </p>
      <p>
        Release gates should combine automated checks with human review for high-risk
        surfaces. Automated gates can compare TTFT, stream completion rate, context
        overflow rate, tool timeout rate, citation coverage, and safety intervention
        rate against the previous model or prompt version. Human review is still needed
        for qualitative changes: tone, helpfulness, refusal clarity, and whether tool
        output is explained in a way users can trust. For enterprise chatbots, run
        tenant-specific canaries because one tenant may rely heavily on PDFs, another on
        code snippets, and another on retrieval from regulated documents. A global
        average can hide a severe regression in one important tenant segment.
        Rollback must restore the model, prompt template, tool schema, and renderer
        behavior together; rolling back only the provider can leave stored conversations
        in a state the older renderer or parser no longer understands.
        Treat these version links as part of the incident response surface, not as
        optional analytics metadata during urgent production debugging.
      </p>
      <HighlightBlock as="p" tier="important">
        A mature chatbot design has kill switches for model provider, retrieval, file
        upload, multimodal input, tool execution, memory injection, and markdown-rich
        rendering. These switches should degrade independently. If the markdown renderer
        has a sanitization issue, the system should fall back to plain text. If retrieval
        is down, the UI should show an ungrounded-answer warning or block grounded-only
        workflows. If a tool begins timing out, tool cards should fail visibly while
        pure chat continues. Independent degradation is the difference between a contained
        incident and a full product outage.
      </HighlightBlock>
      <p>
        Multi-region and provider failover should be designed around conversation
        continuity, not only request retry. If a provider or region fails mid-stream,
        blindly retrying against another provider can duplicate tool calls, change model
        tone, or produce a second answer that conflicts with the partial answer already
        shown. A safer design records a stream checkpoint, marks the partial assistant
        message as interrupted, and lets the user explicitly resume or regenerate with
        a visible provider change. For enterprise tenants, failover policy may be tenant
        specific: one tenant may allow cross-region failover for availability, while
        another requires in-region processing and should fail closed with a clear message.
      </p>
      <p>
        Provider portability requires a normalized internal contract. Streaming deltas,
        tool calls, safety refusals, citations, usage metrics, and finish reasons should
        be converted into product-owned event types before they reach the React state
        layer. That contract prevents every UI component from learning provider-specific
        quirks and makes incident rollback possible. When a provider changes its tool
        schema or finish reason semantics, the gateway adapter absorbs the change and
        the UI continues rendering the same internal stream events.
      </p>

      <h3 className="mt-6 mb-3 text-lg font-semibold">Conversation Branch Exploration</h3>
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

      <h3 className="mt-6 mb-3 text-lg font-semibold">Memory and Long-Term Context</h3>
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
      <ArticleImage
        src="/diagrams/system-design-problems/high-level-design/ai-modern-systems/ai-chatbot-frontend-memory-safety.svg"
        alt="Memory and safety diagram showing conversation events, memory extraction, user-visible memory controls, retrieval into future prompts, deletion path, audit logs, and policy enforcement"
        caption="Long-term memory safety: extract only durable facts, keep user controls visible, and make deletion and audit paths first-class"
      />

      <h2>Trade offs &amp; Comparison</h2>
      <p>The core trade-off is capability versus control. Rich AI experiences improve user productivity, but they add uncertainty, cost, latency, data-access risk, and operational complexity. A principal-ready design explains which paths are authoritative, which paths are best-effort, and how the system degrades when retrieval, model execution, policy checks, or tool calls fail.</p>
      <p>The design should also compare build-versus-buy boundaries. Provider APIs, vector stores, evaluation tools, moderation classifiers, and orchestration frameworks can accelerate delivery, but the product still owns permission enforcement, user trust, auditability, rollback, and quality measurement.</p>

      <h2>Best practices</h2>
      <p>Use explicit contracts between UI, orchestration, model, retrieval, policy, and tool layers. Persist durable state, keep correlation IDs across model and tool calls, separate user-visible confidence from internal scores, and make failed or degraded states visible. Treat prompts, policies, retrieval settings, and model versions as production configuration with owners and rollback.</p>
      <p>Measure quality continuously with offline evaluation sets, production feedback, latency and cost telemetry, safety outcomes, and incident reviews. Principal-level systems do not rely on subjective demos to decide whether an AI feature is working.</p>

      <h2>Common Pitfalls</h2>
      <p>Common pitfalls include letting the model decide authorization, hiding uncertainty, storing sensitive context unnecessarily, treating provider streaming formats as frontend contracts, and shipping without replayable traces. Another frequent issue is optimizing for impressive answers while neglecting source evidence, policy enforcement, and operator visibility.</p>
      <p>Teams also underestimate lifecycle problems: model behavior changes, documents are deleted, prompts drift, evaluation sets go stale, and users discover adversarial inputs. The architecture needs ongoing governance, not only launch-time safeguards.</p>

      <h2>Real-world use cases</h2>
      <p>These patterns apply to enterprise copilots, knowledge assistants, developer tools, moderation systems, model-evaluation platforms, support automation, document Q&A, search products, and workflow automation. In each case, the AI surface becomes a governance and reliability surface as soon as users depend on it for real decisions.</p>
      <p>For staff and principal interviews, connect the design to rollout safety, tenant isolation, incident response, data access, cost controls, and measurable quality improvement. That is what separates a feature explanation from a system design answer.</p>

      <h2>Common interview question with detailed answer</h2>

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

      <h2>References</h2>
      <ul>
        <li>
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream">
            MDN: ReadableStream
          </a>{" "}
          — browser stream primitives used for token consumption and cancellation.
        </li>
        <li>
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController">
            MDN: AbortController
          </a>{" "}
          — cancellation semantics for stopping in-flight streaming requests.
        </li>
        <li>
          <a href="https://html.spec.whatwg.org/multipage/server-sent-events.html">
            WHATWG HTML: Server-sent events
          </a>{" "}
          — event stream framing behavior relevant to provider stream parsing.
        </li>
        <li>
          <a href="https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html">
            OWASP HTML5 Security Cheat Sheet
          </a>{" "}
          — browser-side storage, messaging, and rendering security considerations.
        </li>
        <li>
          <a href="https://owasp.org/www-project-top-10-for-large-language-model-applications/">
            OWASP Top 10 for LLM Applications
          </a>{" "}
          — prompt injection, insecure output handling, sensitive information disclosure,
          and excessive agency risks for LLM-backed products.
        </li>
      </ul>
    </ArticleLayout>
  );
}