"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-chunked-transfer-encoding",
  title: "Chunked Transfer Encoding",
  description:
    "Deep dive into chunked transfer encoding covering HTTP streaming, progressive response handling, server-sent events foundation, and building frontend applications that process streaming data.",
  category: "frontend",
  subcategory: "networking-api-communication",
  slug: "chunked-transfer-encoding",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: [
    "frontend",
    "chunked",
    "streaming",
    "http",
    "transfer-encoding",
    "progressive",
  ],
  relatedTopics: [
    "multipart-upload",
    "server-sent-events",
    "http2-and-http3",
    "websockets",
  ],
};

export default function ChunkedTransferEncodingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Chunked Transfer Encoding</strong> is an HTTP mechanism that
          allows a server to send a response in multiple parts (chunks) without
          specifying the total content length upfront. Introduced in HTTP/1.1
          (RFC 2068, 1997), chunked encoding enables streaming responses where
          data is sent progressively as it becomes available, rather than
          buffering the entire response server-side before sending. For frontend
          applications, this means the ability to start processing and rendering
          data before the complete response arrives -- critical for large
          payloads, real-time data, and long-running operations.
        </p>
        <p>
          In chunked transfer encoding, the server sends data as a series of
          chunks, each preceded by its size in hexadecimal. The format is:
          chunk-size (hex), CRLF, chunk-data, CRLF. This repeats for each chunk.
          The stream terminates with a zero-length chunk (0 followed by CRLF),
          optionally followed by trailer headers (metadata computed after the
          body, such as a checksum). The client reads chunks sequentially,
          processing each as it arrives. This is fundamentally different from
          Content-Length-based responses where the client must wait for the
          entire body before processing.
        </p>
        <p>
          At a staff or principal engineer level, understanding chunked transfer
          encoding requires distinguishing between the HTTP-level mechanism
          (Transfer-Encoding: chunked) and the application-level streaming
          patterns built on top of it. While modern HTTP/2 and HTTP/3 handle
          streaming differently (multiplexed streams without explicit chunked
          encoding), the conceptual model remains: responses can be streamed
          progressively, and frontends should process data incrementally rather
          than waiting for completion. This is the foundation for Server-Sent
          Events, streaming GraphQL responses, LLM token streaming, and
          progressive JSON parsing.
        </p>
        <p>
          The frontend impact of chunked responses is significant. Without
          chunked support, a 1GB API response requires buffering the entire
          gigabyte before JavaScript can access any data -- this causes memory
          pressure, long time-to-first-byte, and poor user experience. With
          chunked support, the frontend can process data incrementally: render
          the first page of results while the rest streams, update a progress
          bar based on bytes received, or pipe the response directly to a file
          download without intermediate buffering. For real-time applications,
          chunked encoding is the transport layer that enables server push
          semantics over HTTP.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Chunked transfer encoding is built on six foundational concepts that
          govern how streaming responses are sent and consumed:
        </p>
        <ul>
          <li>
            <strong>Transfer-Encoding Header:</strong> When a server sends
            <code>Transfer-Encoding: chunked</code>, it signals that the
            response body is chunked rather than having a fixed Content-Length.
            This is used when the server cannot know the total response size
            upfront (dynamically generated content, streaming from a database,
            real-time data feeds). The client must read chunks sequentially
            until the terminating zero-length chunk. Note that HTTP/2 and HTTP/3
            do not use chunked encoding explicitly -- they have native streaming
            via frames, but the conceptual model (progressive response) is the
            same.
          </li>
          <li>
            <strong>Chunk Format:</strong> Each chunk consists of: chunk-size
            (hexadecimal number indicating data length, excluding the CRLF),
            CRLF, chunk-data (the actual bytes), CRLF. For example: "1a\r\n"
            (26 bytes in hex) followed by 26 bytes of data, followed by "\r\n".
            The client parses the size, reads exactly that many bytes, skips
            the trailing CRLF, and repeats. This self-delimiting format allows
            the client to know exactly where each chunk ends without relying on
            connection close.
          </li>
          <li>
            <strong>Trailer Headers:</strong> After the final zero-length chunk,
            the server may send trailer headers -- metadata that could not be
            known before the body was generated (e.g., a checksum computed over
            the entire body, or final status information). Trailer headers are
            rare in practice but useful for integrity verification. The client
            accesses trailers after the response body completes. In fetch API,
            trailers are available via response.trailers (though browser support
            is limited).
          </li>
          <li>
            <strong>Progressive Response Processing:</strong> Instead of waiting
            for response.then(res =&gt; res.json()) to complete (which buffers
            the entire body), the frontend can access the ReadableStream via
            response.body and process chunks incrementally. This enables:
            progressive rendering (show first results immediately), memory
            efficiency (do not buffer entire response), and real-time updates
            (process server-sent events as they arrive). The pattern is:
            fetch(url).then(res =&gt; processStream(res.body.getReader())).
          </li>
          <li>
            <strong>Backpressure Handling:</strong> When processing streaming
            responses, the client must handle backpressure -- the situation where
            the server sends data faster than the client can process it. The
            ReadableStream API provides built-in backpressure: reader.read()
            returns a Promise that resolves when data is available, and the
            server's TCP stack naturally throttles if the client's receive
            buffer fills. For application-level backpressure (e.g., processing
            JSON objects one at a time), use async iteration with await to
            ensure each chunk is processed before reading the next.
          </li>
          <li>
            <strong>Connection Management:</strong> Chunked responses keep the
            HTTP connection open until the terminating chunk is received. This
            has implications: the browser's connection pool may be blocked
            (HTTP/1.1 limits 6 connections per origin), so long-running streams
            can starve other requests. HTTP/2 multiplexing mitigates this by
            allowing multiple streams on one connection. Additionally, chunked
            responses cannot be cached by CDNs (since the total size is unknown
            upfront), so they are typically marked with Cache-Control: no-store.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
      <p>
          The chunked transfer encoding flow involves the server sending data
          progressively and the client processing chunks as they arrive.
          Understanding this flow is essential for debugging streaming issues
          and building responsive applications.
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Chunked Response Flow
          </h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Client Request:</strong> Browser sends HTTP GET request
              with Accept header indicating streaming support
            </li>
            <li>
              <strong>2. Server Response Headers:</strong> Server responds with
              HTTP 200, Transfer-Encoding: chunked, Content-Type: application/json
              (or text/event-stream for SSE)
            </li>
            <li>
              <strong>3. Chunk Transmission:</strong> Server sends chunk-size
              (hex), CRLF, chunk-data, CRLF repeatedly as data becomes available
            </li>
            <li>
              <strong>4. Client Processing:</strong> Browser's networking layer
              parses chunks, makes data available via ReadableStream
            </li>
            <li>
              <strong>5. Progressive Parsing:</strong> Application reads chunks
              via reader.read(), parses incrementally, updates UI
            </li>
            <li>
              <strong>6. Stream Completion:</strong> Server sends 0-length
              chunk, optionally with trailer headers, connection closes or
              reuses for next request
            </li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/chunked-transfer-flow.svg"
          alt="Chunked Transfer Encoding Flow Diagram"
          caption="Chunked Transfer Flow: Server sends chunks progressively, client processes each chunk as it arrives without waiting for complete response"
        />

        <p>
          The fetch API provides native support for reading chunked responses
          via the ReadableStream interface. The pattern is: fetch the resource,
          access response.body (a ReadableStream), get a reader via
          body.getReader(), and read chunks in a loop. Each read() call returns
          a Promise that resolves with an object containing value as a Uint8Array
          and done as a boolean. When done is true, the stream is complete. The
          application can decode each chunk from Uint8Array to string, parse
          incrementally (for example, newline-delimited JSON), and update the UI
          progressively.
        </p>

        <p>
          For JSON streaming, a common pattern is newline-delimited JSON
          (NDJSON), where each line is a complete JSON object. The server sends
          each JSON object on a separate line, for example an object with id and
          data fields on one line, followed by another object on the next line.
          The client accumulates chunks into a buffer, splits by newline, and
          parses each complete line. This allows processing thousands of records
          without buffering the entire array in memory. Libraries like
          json-streaming-parser automate this, but the core logic is
          straightforward: buffer chunks, split by delimiter, parse complete
          objects.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/streaming-json-parse.svg"
          alt="Streaming JSON Parse Diagram"
          caption="Streaming JSON Parse: Chunks are accumulated, split by newline delimiter, and each complete JSON object is parsed and processed incrementally"
        />

        <p>
          For Server-Sent Events (SSE), chunked encoding is the transport
          mechanism. The server sends text/event-stream content with chunks
          formatted as SSE events with data fields followed by newlines. The
          browser EventSource API automatically parses chunks and dispatches
          message events. Under the hood, EventSource uses chunked transfer
          encoding to receive progressive updates. This is why SSE requires
          HTTP/1.1 plus (which supports chunked encoding) and cannot work with
          HTTP/1.0.
        </p>

        <p>
          A critical architectural consideration is connection management. On
          HTTP/1.1, each chunked response consumes one of the browser's 6
          connections per origin. A long-running stream (e.g., real-time
          notifications held open for minutes) can block other requests.
          Solutions include: using a separate subdomain for streams
          (notifications.example.com vs api.example.com) to get a separate
          connection pool, using HTTP/2 which multiplexes streams on one
          connection, or using Server-Sent Events with Connection: keep-alive
          which is optimized for long-lived streams.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/networking-api-communication/http-streaming-architecture.svg"
          alt="HTTP Streaming Architecture Diagram"
          caption="HTTP Streaming Architecture: Client maintains persistent connection, server pushes chunks progressively, client processes incrementally with backpressure handling"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>Latency</strong>
              </td>
              <td className="p-3">
                • Time-to-first-byte is minimized (send data as available)
                <br />
                • Client can start processing immediately
                <br />• No server-side buffering delay
              </td>
              <td className="p-3">
                • Connection held open longer (may increase latency for other requests on HTTP/1.1)
                <br />
                • First chunk may be small (overhead per chunk)
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Memory</strong>
              </td>
              <td className="p-3">
                • Client does not buffer entire response
                <br />
                • Server does not buffer entire response
                <br />• Constant memory regardless of response size
              </td>
              <td className="p-3">
                • Client must manage chunk buffer for parsing
                <br />
                • Incomplete chunks require buffering until complete
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Caching</strong>
              </td>
              <td className="p-3">
                • Suitable for dynamic, real-time data
                <br />
                • No stale data issues (always fresh)
                <br />• Works with CDN streaming (some support)
              </td>
              <td className="p-3">
                • Cannot be cached by most CDNs (unknown size)
                <br />
                • Must use Cache-Control: no-store
                <br />• No browser cache benefit
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Complexity</strong>
              </td>
              <td className="p-3">
                • Standard HTTP mechanism (universal support)
                <br />
                • Native browser support via ReadableStream
                <br />• Foundation for SSE, streaming GraphQL
              </td>
              <td className="p-3">
                • Application-level parsing is complex (incremental JSON, XML)
                <br />
                • Must handle partial data, reconnection, errors
                <br />• Debugging is harder (streaming vs complete)
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            Chunked Encoding in HTTP/2 and HTTP/3
          </h3>
          <p>
            HTTP/2 and HTTP/3 do not use explicit chunked transfer encoding.
            Instead, they have native streaming via frames (HTTP/2) or streams
            (HTTP/3). The conceptual model is the same -- responses can be sent
            progressively -- but the wire format differs. In HTTP/2, a response
            is split into HEADERS frame followed by multiple DATA frames, each
            carrying a portion of the body. The END_STREAM flag indicates the
            final frame. From the application perspective, the API is identical:
            response.body is a ReadableStream regardless of HTTP version. The
            browser's networking layer abstracts away the protocol differences.
          </p>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          These practices represent hard-won lessons from operating streaming
          frontend applications at scale:
        </p>
        <ol className="space-y-3">
          <li>
            <strong>Use ReadableStream for Large Responses:</strong> For
            responses over 1MB, use response.body.getReader() to process
            incrementally rather than response.json() which buffers entirely.
            The pattern is to get a reader from the response body, read chunks
            in a loop, check if done is true to break, and process each chunk
            value. This reduces memory pressure and enables progressive
            rendering.
          </li>
          <li>
            <strong>Implement Incremental JSON Parsing:</strong> For streaming
            JSON, use newline-delimited JSON (NDJSON) where each line is a
            complete object. Accumulate chunks into a buffer, split by newline,
            parse complete lines, and keep incomplete data in the buffer for the
            next chunk. This allows processing gigabytes of JSON with constant
            memory.
          </li>
          <li>
            <strong>Handle Backpressure Explicitly:</strong> When processing
            chunks, await each read() before processing to apply backpressure.
            Do not read all chunks into an array before processing since this
            defeats the purpose of streaming. The pattern is to read each chunk
            in a loop, await the read, then await the process function before
            reading the next chunk. This ensures the server throttles if the
            client is slow.
          </li>
          <li>
            <strong>Implement Reconnection Logic:</strong> For long-running
            streams, handle connection drops gracefully. Track the last
            processed item (via ID or timestamp), and on reconnection, request
            items since the last processed point. This is the pattern used by
            Server-Sent Events with Last-Event-ID header.
          </li>
          <li>
            <strong>Set Appropriate Timeouts:</strong> Streaming responses can
            hang indefinitely if the server crashes or the network fails.
            Implement client-side timeouts: use AbortSignal.timeout to abort the
            request if no data arrives within the timeout. The pattern is to
            pass an AbortSignal with a timeout to the fetch options. This
            prevents streams from hanging forever.
          </li>
          <li>
            <strong>Use HTTP/2 for Multiple Streams:</strong> If your
            application maintains multiple concurrent streams (e.g., separate
            streams for notifications, live data, and chat), use HTTP/2 to
            multiplex streams on one connection. HTTP/1.1's 6-connection limit
            will cause contention. Verify HTTP/2 is enabled via browser DevTools
            Network panel (look for "h2" in the Protocol column).
          </li>
          <li>
            <strong>Monitor Stream Health:</strong> Track metrics for streaming
            endpoints: time-to-first-chunk, chunks per second, total stream
            duration, reconnection rate, and error rate. Alert on anomalies:
            sudden increase in reconnections suggests server instability, long
            gaps between chunks suggest server-side buffering issues.
          </li>
          <li>
            <strong>Handle Partial Data Gracefully:</strong> When a stream
            disconnects mid-response, the client has partial data. Decide on a
            strategy: discard partial data (if atomicity is required), keep
            partial data and resume later (if resumable), or mark partial data
            as incomplete in the UI. Document the behavior for users.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          These mistakes appear frequently even in production applications at
          well-funded companies:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Buffering Entire Response:</strong> Using response.json() or
            response.text() on streaming endpoints, which buffers the entire
            response before resolving. This defeats the purpose of chunked
            encoding. Always use response.body.getReader() for streaming
            endpoints.
          </li>
          <li>
            <strong>Not Handling Incomplete Chunks:</strong> Assuming each
            read() returns a complete JSON object or SSE event. In reality,
            chunk boundaries are arbitrary -- a 10KB JSON object may span three
            4KB chunks. Always accumulate chunks into a buffer and parse
            complete messages only.
          </li>
          <li>
            <strong>Ignoring Backpressure:</strong> Reading all chunks into an
            array before processing buffers the entire response in memory,
            defeating streaming benefits. Process each chunk before reading the
            next.
          </li>
          <li>
            <strong>No Reconnection Logic:</strong> Assuming streams never fail.
            Network interruptions, server restarts, and load balancer timeouts
            all cause disconnections. Implement reconnection with exponential
            backoff and resume from the last processed point.
          </li>
          <li>
            <strong>Blocking Other Requests:</strong> On HTTP/1.1, maintaining
            multiple long-running streams that consume all 6 connections per
            origin. This blocks regular API calls and asset loading. Use HTTP/2
            or separate subdomains for streams.
          </li>
          <li>
            <strong>Not Setting Timeouts:</strong> Allowing streams to hang
            indefinitely. If the server crashes mid-stream, the client waits
            forever. Use AbortSignal.timeout() to enforce a maximum stream
            duration.
          </li>
          <li>
            <strong>Parsing JSON Incorrectly:</strong> Assuming streaming JSON
            is valid JSON at each step. Streaming JSON is typically NDJSON
            (newline-delimited), not a valid JSON array. Do not call JSON.parse()
            on the accumulated buffer -- parse each line individually.
          </li>
          <li>
            <strong>Not Handling Trailer Headers:</strong> For responses with
            integrity checks (checksums in trailer headers), accessing trailers
            before the stream completes. Trailers are only available after the
            stream is done. Pattern: await reader.read() until done, then access
            response.trailers.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Chunked transfer encoding is essential in these production scenarios:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>LLM Token Streaming (ChatGPT, Claude):</strong> AI
            assistants stream generated tokens to the browser in real time. The
            server sends each token (or small batch) as a chunk, and the
            frontend renders tokens progressively, creating the typewriter
            effect. Implementation: server uses chunked encoding with NDJSON
            format, frontend reads chunks via ReadableStream, parses each token,
            and appends to the message display. Without chunked encoding, users
            would wait seconds for the entire response before seeing any output.
          </li>
          <li>
            <strong>Real-Time Dashboards:</strong> Financial trading dashboards,
            monitoring systems, and live scoreboards stream updates via chunked
            HTTP. The server holds the connection open and sends chunks as data
            changes. Implementation: server uses chunked encoding with
            JSON-based event format, frontend processes chunks and updates
            charts/tables incrementally. This is an alternative to WebSockets
            for unidirectional streaming.
          </li>
          <li>
            <strong>Large Dataset Export:</strong> Applications that export
            large datasets (CSV, JSON) use chunked encoding to stream results
            directly to a file download. The server queries the database and
            streams rows as chunks, and the browser downloads progressively
            without buffering. Implementation: server sets Content-Disposition:
            attachment, uses chunked encoding, frontend pipes response.body to a
            WritableStream for file saving.
          </li>
          <li>
            <strong>Video Transcoding Progress:</strong> Video processing
            services stream progress updates during transcoding. The server
            sends periodic progress chunks (e.g., every 5% complete), and the
            frontend updates a progress bar. Implementation: long-running HTTP
            request with chunked encoding, each chunk contains progress
            percentage and ETA, frontend updates UI on each chunk.
          </li>
          <li>
            <strong>GraphQL Subscriptions:</strong> GraphQL subscriptions over
            HTTP use chunked encoding to stream events. The server sends each
            subscription event as a chunk, and the client processes events
            incrementally. Implementation: Apollo Server uses chunked encoding
            for subscriptions, frontend uses Apollo Client which handles
            streaming automatically.
          </li>
          <li>
            <strong>Server-Side Rendering Streaming:</strong> Frameworks like
            Next.js and React 18 support streaming SSR, where the HTML is sent
            in chunks as components render. The server streams the HTML
            progressively, and the browser can start parsing and rendering
            before the entire page is generated. Implementation: React 18's
            renderToPipeableStream() uses chunked encoding, frontend receives
            HTML progressively and hydrates incrementally.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q1: How do you read a chunked HTTP response in JavaScript?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I use the ReadableStream API via
              response.body.getReader(). The pattern is: fetch the resource,
              access response.body, get a reader, and read chunks in a loop.
              Each read() returns a Promise resolving to an object with value as
              a Uint8Array and done as a boolean. I decode each chunk using
              TextDecoder, accumulate into a buffer, and parse complete messages
              (for example, split by newline for NDJSON). I continue reading
              until done is true.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q2: What is the difference between chunked transfer encoding and
              content-length-based responses?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> Content-Length responses specify the
              total body size upfront, and the client reads exactly that many
              bytes. The server must buffer the entire response to know the
              size. Chunked encoding sends data in self-delimiting chunks
              (size + data), allowing the server to stream data progressively
              without knowing the total size. The client processes chunks as
              they arrive rather than waiting for completion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q3: How do you handle streaming JSON parsing?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I use newline-delimited JSON (NDJSON)
              where each line is a complete JSON object. I accumulate chunks
              into a text buffer, split by newline, and parse each complete
              line. Incomplete data (partial line at the end of a chunk) stays
              in the buffer for the next chunk. This allows processing
              gigabytes of JSON with constant memory, as I never buffer the
              entire response.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q4: How do you implement reconnection for streaming endpoints?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I track the last processed item (via ID
              or timestamp). On connection drop, I wait with exponential
              backoff (1s, 2s, 4s), then reconnect with a query parameter
              indicating the last processed point (e.g., ?since=lastEventId).
              The server sends items after that point. This is the pattern used
              by Server-Sent Events with the Last-Event-ID header.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q5: What are the limitations of chunked transfer encoding on
              HTTP/1.1?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> The main limitation is the 6-connection
              per origin limit. A long-running chunked stream consumes one
              connection, potentially blocking other requests. Additionally,
              chunked responses cannot be cached by CDNs (unknown size), so they
              must use Cache-Control: no-store. HTTP/2 mitigates the connection
              limit via multiplexing, but caching limitations remain.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q6: How do you handle backpressure when reading streaming
              responses?</p>
            <p className="mt-2 text-sm">
              <strong>Answer:</strong> I await each read() before processing the
              chunk. This applies backpressure naturally: if processing is slow,
              read() calls are delayed, the TCP receive buffer fills, and the
              server's TCP stack throttles sending. I do not read all chunks
              into an array before processing -- that would buffer the entire
              response and defeat streaming benefits.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            RFC 7230: HTTP/1.1 <a
              href="https://datatracker.ietf.org/doc/html/rfc7230#section-4.1"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chunked Transfer Coding 
            </a>
          </li>
          <li>
            MDN Web Docs: <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ReadableStream 
            </a>
          </li>
          <li>
            Fetch Specification: <a
              href="https://fetch.spec.whatwg.org/#body-interface"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Body Interface 
            </a>
          </li>
          <li>
            HTTP/2 Specification: <a
              href="https://datatracker.ietf.org/doc/html/rfc7540#section-6"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              HTTP Framing 
            </a>
          </li>
          <li>
            <a
              href="http://ndjson.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Newline-Delimited JSON (NDJSON) Specification 
            </a>
          </li>
          <li>
            <a
              href="https://react.dev/reference/react-dom/server/renderToPipeableStream"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              React 18 Streaming SSR Documentation 
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
