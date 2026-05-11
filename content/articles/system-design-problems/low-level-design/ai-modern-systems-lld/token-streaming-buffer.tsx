"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-token-streaming-buffer",
  title: "Token Streaming Buffer System",
  description:
    "Managing token streaming from LLMs with buffering, batching, backpressure, and efficient rendering of streaming responses.",
  category: "low-level-design",
  subcategory: "ai-modern-systems",
  slug: "token-streaming-buffer",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "ai", "streaming", "buffering", "llm", "performance"],
  relatedTopics: ["streaming-chat-ui", "token-management-cost-optimization"],
};

export default function TokenStreamingBufferArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">
          LLMs generate responses token-by-token. Each token is a word fragment (3–4 characters on average). Modern LLMs stream at 20–80 tokens per second, delivering each token as a discrete event via Server-Sent Events or chunked HTTP. The UI receives a stream of potentially 500+ individual token events for a single response. If each event triggers a React setState and DOM update, the browser is performing 500+ reconciliation cycles per response — a significant performance problem that manifests as visible jank and missed animation frames.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The token streaming buffer system sits between the raw network stream and the React render layer. Its job is to absorb token events, accumulate them in a buffer, and flush the buffer to the render layer at a controlled rate — maximizing rendering efficiency while keeping perceived latency low. The challenge is that "optimal" differs by context: a short factual answer benefits from aggressive flushing (show each word immediately), while a long code generation benefits from larger batches (reduce render overhead, maintain smooth scrolling).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The problem extends beyond basic batching. Network delivery is bursty — even if the LLM generates at 50 tokens/second, the network may deliver them in bursts of 20 tokens every 400ms rather than one token every 20ms. The buffer must smooth these bursts. When the render layer is temporarily slow (heavy JavaScript execution, garbage collection pause), the buffer must absorb incoming tokens rather than dropping them. And when the response contains structured content (JSON being generated incrementally, markdown code blocks), the buffer must understand structural boundaries to avoid rendering syntactically invalid partial content.
        </HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          <strong>Explicit assumptions:</strong> LLM tokens arrive at 10–100 tokens/second with significant burst variability. UI rendering budget is 16ms per frame (60fps target). Responses can be 10–10,000+ tokens. The buffer operates entirely on the client side (no server-side buffering required for the client-side rendering optimization).
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>Token Batching:</strong> Buffer tokens, flush in batches.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Efficient Rendering:</strong> Batch updates (single re-render per batch).
          </HighlightBlock>
          <HighlightBlock as="li" tier="crucial">
            <strong>Backpressure Handling:</strong> If render slow, pause token intake.
          </HighlightBlock>
          <li>
            <strong>Sentence Detection:</strong> Identify sentence boundaries (. ! ?).
          </li>
          <li>
            <strong>Cancellation:</strong> User can stop stream mid-response.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Memory Efficiency:</strong> Don't buffer entire response (stream to storage if needed).
          </HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Latency:</strong> First token appears within 100ms.
          </li>
          <li>
            <strong>Throughput:</strong> Render 100K token response without jank.
          </li>
          <li>
            <strong>Memory:</strong> Buffer &lt;1MB (not entire response).
          </li>
          <li>
            <strong>Smoothness:</strong> No UI frame drops during streaming.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Edge Cases</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">Tokens arrive faster than can render (backpressure).</HighlightBlock>
          <li>Network jitter (tokens arrive in bursts).</li>
          <li>User cancels mid-stream (abort gracefully).</li>
          <li>Buffer fills up (memory pressure).</li>
          <li>Markdown in response (buffering affects formatting).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">Implement ring buffer (circular queue) for tokens. On each token arrival, append to buffer. Every 50-100ms (or N tokens), flush buffer: render buffered tokens as batch.</HighlightBlock>
<HighlightBlock as="p" tier="important"><Highlight tier="important">On backpressure (render queue backed up), pause reading from network stream. Cancel stream: abort fetch, clear buffer, stop rendering. Monitor memory: if buffer grows too large, flush early.</Highlight></HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/ai-modern-systems/token-streaming-buffer.svg"
          alt="Token streaming buffer pipeline from LLM API stream through decode and parse buffers to UI render, with time-based batching, count-based batching, structured output buffering, and memory cleanup"
          caption="Token streaming buffer pipeline from LLM API stream through decode and parse buffers to UI render, with time-based batching, count-based batching, structured output buffering, and memory cleanup"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Buffer Architecture and Data Structures</h3>
        <p>
          The buffer layer has two components: a mutable token accumulator (a simple JavaScript string or array that token deltas are appended to, living outside React state), and a render flush mechanism (the process that moves accumulated tokens from the accumulator into React state on a schedule). The accumulator is not React state — it's a module-level variable or a ref. This is critical: setState calls are expensive; the accumulator must accept tokens without triggering re-renders.
        </p>
        <p>
          A circular queue (ring buffer) is appropriate when individual token objects need independent lifecycle tracking (e.g., for audio synthesis where each token must be processed separately). For text rendering, a simple string accumulator (tokenBuffer += delta) is more efficient — string concatenation is O(n) amortized in V8 and produces exactly the data needed for the render layer (the full current text). The ring buffer adds overhead without benefit for the common text-rendering case.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Batching Strategy: Time-Based vs Count-Based vs rAF-Based</h3>
        <HighlightBlock as="p" tier="important">
          Time-based batching uses a fixed interval timer (setInterval or recursive setTimeout). Every T milliseconds, flush the accumulator to React state if non-empty. T=50ms is a good default — it ensures new text appears at most 50ms after arrival, which is imperceptible to users, while producing at most 20 React updates per second regardless of token arrival rate.
        </HighlightBlock>
        <p>
          Count-based batching flushes every N tokens regardless of time. At 50 tokens/second and N=10, this produces 5 flushes/second — good throughput efficiency. But during slow generation periods (&lt;10 tokens/second), the user waits 1+ seconds between visible updates, breaking the streaming illusion.
        </p>
        <p>
          requestAnimationFrame-based batching aligns flushes with the browser's rendering schedule: once per animation frame (16ms at 60fps). This is the most efficient approach — it guarantees no more than 60 React updates per second regardless of token arrival rate, and it synchronizes state updates with the browser's paint cycle, minimizing layout thrash. Implement: set an rAF loop in a useEffect on mount; each frame checks if the accumulator has new content, flushes to React state if so, then schedules the next frame. This self-scheduling loop runs for the lifetime of the streaming component.
        </p>
        <p>
          Hybrid adaptive batching: start with rAF-based flushing (16ms), but dynamically increase the interval if the render is taking more than 10ms per frame (indicating the UI is under rendering pressure). Reduce the interval if the token arrival rate drops below 5 tokens/second (to maintain the streaming illusion). This adaptive approach provides the best user experience across the full range of generation speeds and device capabilities.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Backpressure Handling</h3>
        <HighlightBlock as="p" tier="important">
          Backpressure occurs when tokens arrive faster than the render layer can process them. Without backpressure control, the accumulator grows without bound. For a 10,000-token response arriving at 100 tokens/second while the render layer processes 50 tokens/second, the accumulator grows to 50,000 tokens — significant memory consumption and a render queue that takes twice as long to drain as the generation took to complete.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Browser-native backpressure via ReadableStream: the stream's reader.read() call controls the pace of consumption. If you stop calling reader.read() (by not entering the next iteration of the read loop), the TCP receive buffer backs up, and the server's send is naturally throttled. This is the simplest form of backpressure — pause the read loop when the accumulator exceeds a threshold, resume when it drains below a lower watermark.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The backpressure threshold should be set based on typical render performance. If each rAF flush can render 500 tokens, and the flush fires at 60fps, the render throughput is 30,000 tokens/second — far exceeding any LLM's generation speed. Backpressure is therefore only needed in pathological cases: very slow devices, heavy concurrent rendering (many other UI updates happening simultaneously), or when the response is being processed for side effects (audio synthesis, database writes) that are slower than the generation rate.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Sentence Detection</h3>
        <p>
          For natural pausing (audio synthesis, multi-modal), detect sentence boundaries. Regex: match . ! ? followed by space. On sentence boundary, emit signal (allow pause point). Not required for text-only but useful for audio streaming.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cancellation & Cleanup</h3>
        <p>
          User clicks "Stop": abort fetch, clear buffer (lose pending tokens), stop render loop. Graceful: finish current batch, then stop. No partial renders. Clear all timers/callbacks.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Memory Management</h3>
        <p>
          Ring buffer bounded (fixed size). If response exceeds buffer, write overflow to IndexedDB (overflow store). On render, read from both buffer + overflow. Benefit: memory-safe for very long responses. Downside: IndexedDB slower (only for rare cases).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Frame Budget & Scheduling</h3>
        <p>
          Render budget: 16ms per frame (60fps). Each batch should render within budget. If batch rendering takes &gt;10ms, defer to next frame. Use requestAnimationFrame for frame-aligned rendering (not arbitrary timers).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Structured Output Buffering: JSON and Markdown</h3>
        <p>
          When the LLM generates structured content (for example JSON, tables, or fenced blocks in Markdown), intermediate partial output is often syntactically incomplete. A JSON viewer will fail if the object is missing closing quotes or braces, and a Markdown renderer may not apply formatting until the structure is closed. If you render partial structures naively, users will see flicker, broken formatting, and noisy parse errors.
        </p>
        <p>
          The structured output buffer layer applies content-aware flushing. A state machine tracks the buffer's current structural context: are we inside a JSON object? Inside a code fence? In a markdown table? Within a structural context, flushing is deferred until the structure closes (closing brace, closing fence, end of table). The plain-text portions flush normally via the standard batching schedule. This produces clean, complete structural units at each render step rather than invalid intermediate states.
        </p>
        <p>
          For JSON streaming (common in function calling and structured output modes), the buffer waits for a complete JSON object before delivering it downstream. This is appropriate for side-effect processing (you need the complete function call arguments to invoke the function) but inappropriate for display (the user should see the JSON being generated character by character). Separate the display buffer (renders immediately with standard batching) from the processing buffer (waits for complete structures) by running them in parallel with different flush policies.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Monitoring & Observability</h3>
        <HighlightBlock as="p" tier="crucial">
          Metrics: batch size (tokens per render), batch latency (time to render), buffer depth (tokens pending), backpressure events (pauses triggered). Track FPS (frame drops indicate jank). Alert if render latency &gt; frame budget.
        </HighlightBlock>
      </section>

      <section>
        <h2>Implementation Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">ReadableStream & Backpressure</h3>
        <HighlightBlock as="p" tier="important">
          Use fetch with Response.body as ReadableStream. Implement reader: while true loop calling await reader.read() to get chunks. On render queue backing up, don't call read() (implicit pause). Resume when queue empty.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">React State Updates</h3>
        <HighlightBlock as="p" tier="important">
          Batching: use setState callback per batch. React automatically batches updates in event handlers, but streaming updates may come from async timers. Use flushSync sparingly (breaks batching) only if necessary for forced render synchronization.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing Token Streaming</h3>
        <HighlightBlock as="p" tier="crucial">
          Mock stream: create function that yields tokens on demand. Test: batch size, latency, cancellation. Load test: simulate 10K tokens streaming rapidly. Memory test: capture memory during long streams.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Browser Compatibility</h3>
        <HighlightBlock as="p" tier="important">
          ReadableStream API widely supported (modern browsers). Fallback: XMLHttpRequest with onprogress for older browsers (less efficient but works).
        </HighlightBlock>
      </section>

      <section>
        <h2>Advanced Production Patterns</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Adaptive Batching</h3>
        <HighlightBlock as="p" tier="important">
          Adjust batch interval based on token arrival rate. Fast arrivals: longer batches (100ms). Slow arrivals: shorter batches (20ms). Avoid perceived latency. Dynamic adjustment based on observed rate.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Priority Rendering</h3>
        <p>
          If multiple streams (multiple chat tabs), prioritize visible tab. Render visible stream aggressively, hidden tabs lazily (only accumulate, don't render frequently).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Compression & Delta Encoding</h3>
        <p>
          For very large responses, compress tokens (gzip). Stream compressed → decompress on client. Saves bandwidth. Only worthwhile if network-constrained.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Stream-to-Audio Pipeline</h3>
        <HighlightBlock as="p" tier="important">
          For audio synthesis: buffer tokens → convert to speech (TTS service) → stream audio. Sentence detection critical (pause between sentences). Requires coordination: text buffering + audio synthesis scheduling.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Testing at Scale</h3>
        <HighlightBlock as="p" tier="crucial">
          Simulate streaming 100K tokens, monitor FPS. Induce backpressure (slow renderer), verify pause/resume. Jank test: measure frame times, verify none &gt; 16ms budget.
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Real-World Pitfalls</h3>
        <HighlightBlock as="p" tier="important">
          Common: rendering every token (jank). Solution: batch aggressively. Another: buffer too large (OOM on long responses). Solution: bounded ring buffer + overflow to storage. Another: batches too small (more re-renders). Solution: time-based batching (at least 50ms).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Incident Response</h3>
        <HighlightBlock as="p" tier="important">
          Jank during streaming: check batch size (too small?). OOM: verify buffer bounded. Latency too high: check backpressure pauses (network slow?). Monitor FPS during incidents.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Latency vs Throughput</h3>
        <HighlightBlock as="p" tier="crucial">
          Small batches: low latency, high render calls. Large batches: high latency, efficient throughput. Balance depends on UX goals. Chat: prioritize latency (&lt;100ms). Long-form content: prioritize throughput (smooth streaming).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Memory vs Responsiveness</h3>
        <HighlightBlock as="p" tier="important">
          Large ring buffer: handles bursts, more efficient. Small buffer: memory-safe, less buffering. Choose based on device (mobile small, desktop large).
        </HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Backpressure vs Complexity</h3>
        <HighlightBlock as="p" tier="important">
          Full backpressure handling complex but necessary for robustness. Simplified version (no pause, just render slower) simpler but risks OOM.
        </HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">At scale, adaptive batching based on token arrival rate, priority rendering for multi-stream scenarios, and overflow to IndexedDB for very</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">large responses. Testing must cover high-throughput scenarios (10K tokens/sec), backpressure conditions, cancellation, and jank measurements. Real-world systems use bounded ring buffers, adaptive batching, and careful frame timing to stream thousands of tokens smoothly without UI jank.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
