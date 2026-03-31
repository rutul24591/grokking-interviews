"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-data-visualization-real-time-data-updates",
  title: "Real-Time Data Updates",
  description: "Staff-level guide to real-time visualization: streaming data architectures, update patterns, performance optimization, and handling high-frequency data for live dashboards and monitoring.",
  category: "frontend",
  subcategory: "data-visualization",
  slug: "real-time-data-updates",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "data-visualization", "real-time", "streaming", "websockets", "performance", "live-data"],
  relatedTopics: ["large-dataset-rendering", "interactive-visualizations", "dashboard-design", "websockets"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Real-Time Data Updates</strong> enable visualizations to reflect live data changes as they occur. Unlike static visualizations that load data once, real-time visualizations continuously update as new data arrives. Use cases include stock tickers, IoT sensor monitoring, live sports scores, system monitoring dashboards, and collaborative applications.
        </p>
        <p>
          For staff/principal engineers, real-time visualization architecture requires balancing update frequency, rendering performance, and data accuracy. High-frequency updates (100+ per second) require specialized techniques. The architecture must handle data ingestion, processing, and rendering without overwhelming the browser.
        </p>
        <p>
          Real-time visualization challenges include <strong>data volume</strong> (handling continuous data streams), <strong>rendering performance</strong> (updating at 60fps while processing data), <strong>data accuracy</strong> (showing correct data without dropping updates), and <strong>user experience</strong> (avoiding visual chaos from rapid updates).
        </p>
        <p>
          The business impact of effective real-time visualization is significant. Traders make decisions based on live prices. Operators respond to system alerts in real-time. Teams collaborate on live data. Delayed or inaccurate visualizations lead to wrong decisions and missed opportunities.
        </p>
        <p>
          In system design interviews, real-time visualization demonstrates understanding of streaming data, performance optimization, state management, and the trade-offs between accuracy and performance. It shows you can architect systems for continuous operation.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/real-time-architecture.svg"
          alt="Real-time visualization architecture: data source → WebSocket/Server-Sent Events → data buffer → processing → rendering pipeline → display"
          caption="Real-time architecture — data flows from source through buffer, processing, and rendering. Each stage must handle continuous flow without blocking"
        />

        <h3>Data Ingestion Patterns</h3>
        <p>
          <strong>WebSocket</strong> provides bidirectional, low-latency communication. Ideal for high-frequency updates (stock ticks, game state). WebSocket maintains persistent connection, enabling server-push without polling overhead.
        </p>
        <p>
          <strong>Server-Sent Events (SSE)</strong> provides unidirectional server-push over HTTP. Simpler than WebSocket but only server-to-client. Ideal for notifications, live feeds, and dashboards where client doesn't send data.
        </p>
        <p>
          <strong>Polling</strong> periodically requests data from server. Simple but inefficient (overhead of repeated requests, latency between polls). Use only when WebSocket/SSE unavailable. Long-polling reduces overhead by keeping request open.
        </p>
        <p>
          <strong>WebRTC Data Channels</strong> provides peer-to-peer data transfer. Ideal for collaborative applications where clients share data directly. More complex than WebSocket but enables direct client communication.
        </p>

        <h3>Update Patterns</h3>
        <p>
          <strong>Append</strong> adds new data points to existing visualization. Time series typically append (new points added to right). Implementation: maintain rolling window, append new data, remove old data outside window.
        </p>
        <p>
          <strong>Replace</strong> replaces entire dataset with new data. Used when complete state is sent (not deltas). Implementation: replace data array, trigger full re-render. Efficient when data volume is small.
        </p>
        <p>
          <strong>Merge</strong> merges new data with existing data. Used when updates are partial (only changed fields). Implementation: match by ID, merge fields, update visualization. Efficient for sparse updates.
        </p>
        <p>
          <strong>Aggregate</strong> aggregates new data into existing visualization. Used for histograms, heatmaps, and statistical visualizations. Implementation: update bins/aggregates incrementally, re-render affected areas.
        </p>

        <h3>Buffering and Batching</h3>
        <p>
          Buffering collects incoming data before processing. This smooths bursty data, enables batching, and prevents overwhelming the renderer. Buffer size trades latency (larger buffer = more latency) against throughput (larger buffer = more efficient batching).
        </p>
        <p>
          Batching groups multiple updates into single render. Instead of rendering each data point individually, render batch of points. This reduces render overhead. Batch size trades latency against efficiency.
        </p>
        <p>
          Implementation: maintain incoming buffer, process buffer at fixed interval (e.g., 16ms for 60fps), render batch. Use requestAnimationFrame for render timing.
        </p>

        <h3>Throttling and Debouncing</h3>
        <p>
          <strong>Throttling</strong> limits update rate to maximum frequency. If data arrives faster than throttle rate, intermediate updates are skipped. This prevents overwhelming renderer. Throttle rate should match display refresh rate (60fps = 16ms).
        </p>
        <p>
          <strong>Debouncing</strong> delays update until data stops arriving. If new data arrives before debounce delay, timer resets. This is useful for bursty data where final value matters more than intermediate values.
        </p>
        <p>
          <strong>Sampling</strong> selects subset of updates for rendering. If data arrives at 1000Hz but display can only show 60fps, sample 60 points per second. Sampling strategies include latest (show most recent), average (show average of batch), and min/max (show extrema).
        </p>

        <h3>Visual Stability</h3>
        <p>
          Rapid updates can cause visual chaos. Elements flicker, text is unreadable, users can't focus. Visual stability techniques include <strong>smooth transitions</strong> (animate changes rather than instant jumps), <strong>update rate limiting</strong> (limit visual update rate even if data updates faster), and <strong>change highlighting</strong> (highlight what changed rather than re-rendering everything).
        </p>
        <p>
          For numeric displays, use rolling averages or exponential smoothing to reduce jitter. For charts, use transition animations (100-300ms) to smooth changes. For high-frequency data, show aggregated view with drill-down to raw data.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Real-time visualization architecture requires decisions about data flow, state management, and rendering pipelines.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/real-time-architecture.svg"
          alt="Real-time architecture pipeline showing Data Source → Buffer → Processing → Render with update strategies by frequency (Low, Medium, High, Very High)"
          caption="Real-time pipeline — ingest → buffer → process → render. Match update strategy to data frequency for optimal performance"
        />

        <h3>Data Flow Architecture</h3>
        <p>
          Implement a pipeline architecture. <strong>Ingestion</strong> stage receives data from WebSocket/SSE. <strong>Buffer</strong> stage collects incoming data. <strong>Processing</strong> stage transforms and aggregates data. <strong>Rendering</strong> stage updates visualization.
        </p>
        <p>
          Pipeline stages should be decoupled. Ingestion doesn't depend on rendering. Processing doesn't depend on ingestion rate. This enables independent optimization of each stage.
        </p>
        <p>
          Use backpressure to prevent buffer overflow. If rendering can't keep up with ingestion, slow down ingestion or drop data. Implement queue limits and overflow handling.
        </p>

        <h3>State Management</h3>
        <p>
          Real-time state management requires careful design. <strong>Immutable updates</strong> create new state objects rather than mutating. This enables efficient change detection and undo/redo. <strong>Incremental updates</strong> update only changed fields rather than replacing entire state.
        </p>
        <p>
          Separate <strong>data state</strong> (raw incoming data) from <strong>view state</strong> (processed data for rendering). Data state is append-only. View state is derived from data state via processing.
        </p>
        <p>
          Use selectors for derived state. Selectors compute view state from data state. Memoize selectors to avoid recomputing when data hasn't changed.
        </p>

        <h3>Rendering Pipeline</h3>
        <p>
          Real-time rendering pipeline must maintain 60fps. <strong>Dirty tracking</strong> identifies what changed. Only update changed elements. <strong>Layer separation</strong> puts static elements on one layer, dynamic elements on another. Only re-render dynamic layer.
        </p>
        <p>
          For Canvas/WebGL, use <strong>double buffering</strong> (render to offscreen buffer, swap to visible). This prevents tearing. For SVG, use <strong>batched DOM updates</strong> (collect all changes, apply in single batch).
        </p>
        <p>
          Use GPU acceleration for high-frequency updates. WebGL can update thousands of points at 60fps. Canvas is faster than SVG for frequent updates.
        </p>

        <h3>Connection Management</h3>
        <p>
          Real-time connections can fail. Implement <strong>reconnection logic</strong> with exponential backoff. Reconnect immediately, then 1s, 2s, 4s, 8s, up to maximum. This prevents overwhelming server during outages.
        </p>
        <p>
          Implement <strong>heartbeat/ping</strong> to detect stale connections. Send periodic ping, expect pong within timeout. If no pong, reconnect. This detects silent connection failures.
        </p>
        <p>
          Implement <strong>data recovery</strong> for missed data. On reconnect, request missed data (by timestamp or sequence number). Fill gap in visualization. This ensures data continuity.
        </p>

        <h3>Error Handling</h3>
        <p>
          Real-time systems must handle errors gracefully. <strong>Data validation</strong> validates incoming data. Reject malformed data, log errors, continue processing valid data. Don't let bad data crash visualization.
        </p>
        <p>
          <strong>Fallback behavior</strong> when connection fails. Show last known data with "stale" indicator. Offer manual refresh. Don't show blank visualization.
        </p>
        <p>
          <strong>Error visualization</strong> shows data quality issues. Indicate missing data, stale data, and validation errors. Users should understand data reliability.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Real-time visualization involves trade-offs between latency, accuracy, and performance.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Latency</th>
              <th className="p-3 text-left">Accuracy</th>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Direct Update</td>
              <td className="p-3">Lowest (immediate)</td>
              <td className="p-3">Perfect (all data)</td>
              <td className="p-3">Poor (every update renders)</td>
              <td className="p-3">Low frequency (&lt;10Hz)</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Batched Update</td>
              <td className="p-3">Low (batch delay)</td>
              <td className="p-3">Perfect (all data)</td>
              <td className="p-3">Good (batched renders)</td>
              <td className="p-3">Medium frequency (10-100Hz)</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Throttled</td>
              <td className="p-3">Medium (throttle delay)</td>
              <td className="p-3">Good (some dropped)</td>
              <td className="p-3">Excellent (fixed rate)</td>
              <td className="p-3">High frequency (100-1000Hz)</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Sampled</td>
              <td className="p-3">Medium (sample delay)</td>
              <td className="p-3">Approximate (sampled)</td>
              <td className="p-3">Best (fixed samples)</td>
              <td className="p-3">Very high frequency (1000+Hz)</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that update pattern should match data frequency and user needs. Low-frequency data (stock prices at 1Hz) can use direct updates. High-frequency data (sensor data at 1000Hz) requires sampling. Choose pattern based on requirements.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Profile rendering performance. Use browser DevTools to identify bottlenecks. Measure frame rate, memory usage, and update latency. Optimize based on measurements, not intuition.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/update-patterns.svg"
          alt="Update pattern comparison showing Direct Update, Batched Update, Sampled Update, Aggregated Update, and GPU Accelerated with best use cases for each"
          caption="Update patterns — match pattern to data volume: direct (&lt;1K), batched (1-10K), sampled (10-100K), aggregated (100K+), GPU (1M+)"
        />

        <p>
          Use appropriate rendering technology. SVG for low-frequency updates (&lt;10Hz). Canvas for medium-frequency (10-100Hz). WebGL for high-frequency (100+Hz). Match technology to update frequency.
        </p>
        <p>
          Implement data windowing for time series. Maintain rolling window (e.g., last 1000 points). Append new data, remove old data. This bounds memory usage and rendering cost.
        </p>
        <p>
          Provide user controls for update rate. Allow users to pause updates, change update frequency, and switch between raw and aggregated views. Users should control information flow.
        </p>
        <p>
          Indicate data freshness. Show timestamp of last update. Indicate stale data. Users should understand data currency.
        </p>
        <p>
          Handle disconnection gracefully. Show last known data with "disconnected" indicator. Offer reconnection. Don't crash or show blank visualization.
        </p>
        <p>
          Test with realistic data rates. Development data rates are often lower than production. Test with expected maximum data rates. Identify breaking points before production.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Rendering every update causes performance collapse. At 1000Hz, rendering every update is impossible. Use batching, throttling, or sampling to reduce render rate.
        </p>
        <p>
          Not handling backpressure causes memory exhaustion. If ingestion is faster than processing, buffers grow unbounded. Implement queue limits and overflow handling.
        </p>
        <p>
          Not handling disconnection causes confusion. When connection fails, show indicator. Don't leave users wondering if data is stuck or connection is broken.
        </p>
        <p>
          Not validating incoming data causes crashes. Malformed data will arrive. Validate all incoming data. Reject bad data gracefully.
        </p>
        <p>
          Not indicating data freshness misleads users. Users assume data is current. Indicate timestamp and staleness. Show "live" indicator only when truly live.
        </p>
        <p>
          Not testing with production data rates causes production failures. Development data rates are often 10-100x lower than production. Test with realistic rates.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Trading Platform: Stock Ticker</h3>
        <p>
          A trading platform needed to display stock prices updating at 100+ updates per second. Traders needed to see price changes immediately.
        </p>
        <p>
          <strong>Solution:</strong> Used WebSocket for low-latency data. Implemented batching (16ms batches for 60fps). Used Canvas for rendering. Showed aggregated view (OHLC) with drill-down to ticks.
        </p>
        <p>
          <strong>Results:</strong> 60fps rendering with 100+ updates/second. Traders could see price changes in real-time. Memory usage stable at 100MB.
        </p>

        <h3>IoT Platform: Sensor Dashboard</h3>
        <p>
          An IoT platform needed to display sensor data from 1000 devices, each reporting at 10Hz. Operators needed to monitor all sensors simultaneously.
        </p>
        <p>
          <strong>Solution:</strong> Used Server-Sent Events for server-push. Implemented per-sensor throttling (1Hz display rate). Used aggregation (min/max/avg) for overview. Drill-down to raw data on click.
        </p>
        <p>
          <strong>Results:</strong> Dashboard handled 10,000 updates/second. Operators could monitor all sensors. Alert system highlighted anomalies.
        </p>

        <h3>Sports Platform: Live Scoreboard</h3>
        <p>
          A sports platform needed to display live scores and statistics. Updates were bursty (frequent during plays, quiet between plays).
        </p>
        <p>
          <strong>Solution:</strong> Used WebSocket for bidirectional communication. Implemented debouncing for bursty updates. Used smooth transitions for score changes. Showed play-by-play timeline.
        </p>
        <p>
          <strong>Results:</strong> Smooth updates during bursts. Score changes animated smoothly. Users could follow game flow in real-time.
        </p>

        <h3>Collaborative Platform: Live Editing</h3>
        <p>
          A collaborative platform needed to show multiple users editing document simultaneously. Cursors and selections needed to update in real-time.
        </p>
        <p>
          <strong>Solution:</strong> Used WebRTC for peer-to-peer updates. Implemented operational transformation for conflict resolution. Used throttling (100ms) for cursor updates. Showed user presence with avatars.
        </p>
        <p>
          <strong>Results:</strong> Smooth collaborative editing. Cursor updates at 10fps (sufficient for presence). Conflicts resolved automatically.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How do you handle 1000 updates per second in a visualization?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use batching and sampling. Batch incoming data (e.g., 16ms batches for 60fps). Sample within batch if needed (show latest, average, or min/max). Use Canvas or WebGL for rendering (not SVG).
            </p>
            <p>
              Implementation: WebSocket for ingestion. Buffer for collecting data. requestAnimationFrame for render timing. Throttle render rate to 60fps regardless of data rate.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What's the difference between throttling and debouncing?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Throttling limits execution to once per time period. If data arrives faster than throttle rate, intermediate updates are skipped. Debouncing delays execution until data stops arriving. If new data arrives before delay, timer resets.
            </p>
            <p>
              Use throttling for rate limiting (e.g., limit render to 60fps). Use debouncing for bursty data where final value matters (e.g., search input).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you handle WebSocket disconnection?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Implement reconnection with exponential backoff. Reconnect immediately, then 1s, 2s, 4s, up to maximum. Implement heartbeat to detect stale connections. Request missed data on reconnect.
            </p>
            <p>
              UX: Show "disconnected" indicator. Show last known data with timestamp. Offer manual reconnect. Don't show blank visualization.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you maintain visual stability with rapid updates?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use smooth transitions (100-300ms animations) for changes. Use rolling averages or exponential smoothing for numeric values. Limit visual update rate even if data updates faster. Highlight what changed rather than re-rendering everything.
            </p>
            <p>
              Implementation: CSS transitions for simple animations. D3 transitions for complex animations. React Spring for physics-based animations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What rendering technology for real-time visualization?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SVG for low-frequency (&lt;10Hz) with interactivity. Canvas for medium-frequency (10-100Hz) with moderate interactivity. WebGL for high-frequency (100+Hz) with limited interactivity.
            </p>
            <p>
              Decision factors: update frequency, number of elements, interactivity requirements, browser support. Profile with realistic data to validate choice.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you implement data recovery after disconnection?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Track last received timestamp or sequence number. On reconnect, request missed data (from last timestamp to current). Server returns missed data. Client fills gap in visualization.
            </p>
            <p>
              Implementation: Include timestamp/sequence in each message. Store last received on client. Request /missed?from=timestamp on reconnect. Handle gaps gracefully (interpolate or show gap).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: WebSocket
            </a> — WebSocket API documentation.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Server-Sent Events
            </a> — SSE API documentation.
          </li>
          <li>
            <a href="https://observablehq.com/@d3/streaming-data" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Observable: Streaming Data
            </a> — Real-time visualization examples.
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2021/05/real-time-large-dataset-visualization/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine: Real-Time Visualization
            </a> — Real-time visualization techniques.
          </li>
          <li>
            <a href="https://socket.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Socket.IO
            </a> — WebSocket library with fallbacks.
          </li>
          <li>
            <a href="https://github.com/reduxjs/redux-toolkit" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Redux Toolkit
            </a> — State management for real-time data.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
