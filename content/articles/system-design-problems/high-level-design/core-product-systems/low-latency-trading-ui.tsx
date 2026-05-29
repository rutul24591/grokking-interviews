"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-low-latency-trading-ui",
  title: "Design a Low-Latency Trading UI",
  description:
    "Architecture for a sub-100ms trading interface: binary WebSocket protocols, off-main-thread price processing, order book rendering, risk controls, and resilience under market volatility.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "low-latency-trading-ui",
  wordCount: 6200,
  readingTime: 37,
  lastUpdated: "2026-05-20",
  tags: ["hld", "trading", "low-latency", "websocket", "order-book", "web-worker"],
  relatedTopics: ["real-time-dashboard-frontend", "race-condition-handling"],
};

export default function LowLatencyTradingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          A low-latency trading UI is a real-time decision surface where stale data, duplicate submission, out-of-order
          market events, or delayed risk feedback can directly create financial loss and regulatory exposure. Unlike a
          passive dashboard, the interface is part of the execution loop: market data appears, the trader decides, the
          UI captures intent, risk checks run, an order is submitted, and fills update positions. Performance matters,
          but correctness and explicit degraded states matter more.
        </HighlightBlock>
        <p>
          The target browser UI is suitable for retail trading, internal trading operations, and non-microsecond
          institutional workflows. It is not the right execution path for high-frequency trading, where native
          colocated systems and specialized networks dominate. A strong design should be honest about that boundary.
          The browser can still deliver sub-100ms display updates for active instruments, but it must isolate market
          data processing from user input, guard against stale prices, and avoid making the trader believe an order was
          accepted before the order management system confirms it.
        </p>
        <p>
          Assume equities and derivatives, with WebSocket market data, a backend order management system, top-of-book
          and depth-of-book displays, order entry, fills, positions, and client-side pre-trade validation. Normal
          market data may be 10 to 1000 updates per second per active instrument, with higher bursts during volatility.
          The UI target is market data visible within roughly 100ms of browser receipt and end-to-end exchange event
          to screen under roughly 200ms where infrastructure permits.
        </p>
        <p>
          In interviews, define the user safety contract early. The UI should disable order submission when market
          data is stale, show clear connection quality, capture the displayed price or quote sequence used for an
          order, deduplicate retries with a client-generated nonce, and reconcile order status from authoritative OMS
          events. The system is successful when traders can act quickly while seeing exactly when the platform has
          degraded.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Separate Data Plane, Render Plane, and Execution Plane</h3>
        <p>
          Market data is the high-frequency data plane. Rendering is the frame-budgeted visual plane. Order submission
          is the transactional execution plane. These should not share one overloaded path. A burst in market data
          processing must not block typing in the order ticket. A slow order submission must not pause market data
          updates. A render throttling decision must not drop sequence information needed to detect an invalid order
          book.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Sequence Numbers and Snapshot Recovery</h3>
        <p>
          Every market data stream should carry monotonically increasing sequence numbers per instrument or channel.
          The client must detect gaps, duplicates, and out-of-order events. A gap means the local book can no longer be
          trusted; the worker should request a fresh snapshot and replay buffered deltas after the snapshot if the
          protocol supports it. Without sequence tracking, the UI can show a plausible but wrong book, which is worse
          than showing an obvious disconnected state.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Frame-Rate Rendering Versus Message-Rate Processing</h3>
        <p>
          A browser cannot usefully render 1000 book updates per second because the display refreshes at 60Hz or
          120Hz. The system should process every market event needed for correctness, but render snapshots at the
          display cadence. Intermediate states can be coalesced for the visual layer while still updating the internal
          order book state and sequence counters. This is the central performance principle for a trading UI.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Order Intent Must Be Idempotent and Auditable</h3>
        <p>
          A trader click should produce one order intent with a stable client nonce, captured instrument, side,
          quantity, order type, displayed bid/ask or quote sequence, timestamp, and risk-check result. Network retries
          should reuse the same nonce. The OMS should deduplicate by trader and nonce, returning the existing order if
          the first response was lost. This protects against double-clicks and retry-after-timeout duplicate orders.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/low-latency-trading-ui-architecture.svg"
          alt="Low-latency trading UI architecture with WebSocket market data, Web Worker book processor, main-thread renderer, staleness detector, risk checks, OMS order submission, and fills"
          caption="Architecture: market data processing runs off the main thread, rendering consumes frame-rate snapshots, and order execution uses a separate idempotent path."
        />
        <p>
          The browser opens a market data connection for active instruments and sends raw messages to a Web Worker.
          The worker decodes binary payloads, verifies sequence numbers, applies full snapshots or incremental deltas,
          maintains bid and ask structures, and emits render snapshots at a bounded cadence. The main thread renders
          only the latest snapshot, keeping DOM work predictable and preserving input responsiveness for the order
          ticket.
        </p>
        <p>
          Binary messages reduce parse overhead and allocation pressure compared with JSON. A fixed schema can include
          message type, instrument ID, sequence number, timestamp, update type, and price-level updates. The worker
          decodes using ArrayBuffer and DataView-like APIs, avoiding thousands of short-lived objects during volatility
          bursts. JSON may be acceptable for low-frequency retail instruments, but the design should name where JSON
          parsing becomes a bottleneck.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/low-latency-trading-ui-workflow.svg"
          alt="Trading UI workflow showing market data decode, sequence check, order book update, render snapshot, order click, risk check, idempotent OMS submission, and fill update"
          caption="Workflow: market data and order submission are coordinated by quote sequence, staleness state, risk checks, and idempotency keys."
        />
        <p>
          The order book state should be optimized for the displayed depth and update pattern. For top 10 to 20 levels,
          sorted arrays with targeted updates are often simpler and fast enough. For deeper ladders or high churn,
          balanced structures or price-indexed maps can reduce update cost. The worker emits compact render payloads:
          top bid/ask levels, last trade, spread, market status, staleness state, and the latest quote sequence.
        </p>
        <p>
          The order path captures the current displayed market context at submit time. The client runs immediate
          validations for quantity, notional value, price bounds, position limit hints, and stale-data state. It then
          sends a request to the OMS with a client nonce and captured quote context. The OMS remains authoritative for
          risk checks and market validation. If market price moved beyond tolerance or the quote sequence is too old,
          the order is rejected or requires explicit reconfirmation.
        </p>
        <p>
          Fills and order state updates should come from an authoritative order event stream, not from optimistic UI
          assumptions. The UI can show "submitting" immediately, but it should not show "accepted" until the OMS
          confirms. Order state transitions such as pending, accepted, partially filled, filled, canceled, and rejected
          should be monotonic and deduplicated by order ID plus event sequence.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/low-latency-trading-ui-degraded.svg"
          alt="Trading UI degraded modes showing stale market data, sequence gap recovery, websocket disconnect, read-only mode, and order submission disabled"
          caption="Degraded modes: the UI should make stale data, sequence gaps, disconnects, and read-only operation explicit instead of silently pretending all prices are current."
        />
        <p>
          Web Workers add message-passing complexity and cannot access the DOM directly, but they isolate high-frequency
          market data work from input and rendering. That isolation is most valuable during volatility, when update
          rates and trader activity both increase. Main-thread processing may pass in demos but fails exactly when the
          product is most needed. For a trading UI, the extra architecture is justified.
        </p>
        <p>
          SharedArrayBuffer can reduce snapshot handoff overhead, but it requires cross-origin isolation headers and
          careful synchronization. The engineering cost may not be worth it for retail products where network and OMS
          latency dominate. It becomes more attractive for dense institutional screens with many instruments and high
          update rates. The pragmatic path is postMessage snapshots first, then measure whether shared memory is needed.
        </p>
        <p>
          Rendering every event gives the illusion of maximum freshness but wastes work and can increase input latency.
          Coalescing visual updates to animation frames preserves the latest visible state while keeping the main
          thread within frame budget. The worker still processes every event for correctness. This distinction lets the
          system drop visual intermediates without dropping market-data semantics.
        </p>
        <p>
          Browser-based trading offers reach, easier deployment, and lower installation burden. Native trading apps can
          achieve lower latency, tighter OS integration, and richer multi-monitor workflows. For high-frequency trading,
          a browser is not an execution platform. For retail, operations, monitoring, and many institutional workflows,
          a browser can be acceptable if it explicitly handles stale data, idempotent orders, and degraded modes.
        </p>
        <p>
          Client-side risk checks improve feedback latency but are not security controls. They reduce avoidable server
          round trips and catch fat-finger input early, but compromised clients can bypass them. The OMS must repeat
          all authoritative checks. The UI should frame client checks as user assistance and server checks as final
          enforcement.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The key decision is which latency budget the browser is responsible for. The UI can optimize event decoding,
          render scheduling, stale-state detection, and click-to-request time, but it cannot make exchange matching or
          OMS risk checks faster. A principal answer should allocate latency budgets across exchange gateway, market
          data fanout, browser processing, order submission, OMS acknowledgement, and UI reconciliation. Without this
          boundary, teams often over-optimize paint time while ignoring larger server-side delays.
        </p>
        <p>
          Reliability policy must be more conservative than normal realtime dashboards. If market data is stale,
          sequence recovery is in progress, or the OMS is unreachable, the UI should explicitly disable or gate order
          entry rather than letting traders act on untrusted context. This is a business risk decision, not just a UI
          state. The article now frames degraded modes as part of the trading contract: observe, submit, cancel, or
          read-only should be separate states with separate operator alerts.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Keep all market data streams sequence-aware. Track expected sequence per instrument, detect gaps, request
          snapshots, and mark the book unavailable or degraded while recovering. Show stale or recovering state in the
          UI and disable order submission when the current quote context cannot be trusted.
        </p>
        <p>
          Design the order ticket as a transactional component. Disable repeated submission for the same intent,
          generate the nonce before the first network request, reuse it across retries, and keep the captured quote
          context visible in the order review. If a retry returns an existing order, the UI should reconcile to that
          order rather than creating a second local row.
        </p>
        <p>
          Measure latency at multiple boundaries. Track exchange-to-gateway, gateway-to-browser, browser-receive to
          worker-decode, worker-decode to snapshot, snapshot-to-paint, click-to-request, request-to-OMS-ack, and
          OMS-ack-to-UI. A single "latency" metric hides whether problems come from network, parsing, rendering,
          garbage collection, risk checks, or the OMS.
        </p>
        <p>
          Keep visual updates cheap. Use textContent for simple numeric cells, avoid layout reads in hot paths, reuse
          row elements where possible, batch DOM updates into requestAnimationFrame, and use CSS animations for flashes
          instead of JavaScript-driven style loops. Heavy charts should be canvas or WebGL-backed when DOM updates
          become expensive.
        </p>
        <p>
          Build explicit degraded modes. Read-only mode, stale-prices mode, sequence-recovery mode, market-closed
          mode, OMS-unavailable mode, and risk-service-unavailable mode should have different UI states. A trader
          should understand whether they can observe, submit, cancel, or only wait.
        </p>
        <p>
          Add release safety for market-data and order-ticket changes. New parsers, schema changes, pricing displays,
          and risk warnings should run in shadow or read-only mode before enabling order submission. Trading UIs need
          kill switches for instruments, markets, order types, and whole workflows because a bad client release can
          create financial and regulatory exposure quickly.
        </p>
        <p>
          Low-latency trading UIs need a strict distinction between market data, order intent, order acknowledgement, and execution reports. A quote update can be faster than order state, and an optimistic button state must not imply that an order reached the venue. Principal-level designs should show authoritative order status from the trading backend and preserve sequence numbers so users can reason about stale or out-of-order events.
        </p>
        <p>
          Risk controls belong in the interaction path. Fat-finger checks, buying-power validation, price collars, market-hour rules, throttles, and kill switches may reject an order even when the UI is fast. The frontend should make these rules visible enough to prevent confusion while never trusting client-side validation as the final risk boundary.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most serious pitfall is displaying stale prices as normal. A quiet WebSocket can look stable while data
          is actually frozen. The UI must track last market update time and connection health, then disable order
          submission or require reconfirmation when data is stale.
        </p>
        <p>
          Another pitfall is treating WebSocket delivery as perfectly ordered and reliable. Network retries, server
          failover, and reconnects can produce gaps or duplicates. Without sequence checks and snapshot recovery, the
          local book can drift from the real market while still looking plausible.
        </p>
        <p>
          Teams sometimes optimistically mark orders as accepted before the OMS responds. That creates dangerous
          mismatches when risk rejects the order, the market moved, or the OMS is unavailable. Use "submitting" or
          "pending acknowledgement" until the authoritative system confirms.
        </p>
        <p>
          JSON-based prototypes can hide future CPU and garbage-collection costs. A few instruments in development may
          work well, but a volatile open with many subscriptions can create allocation spikes and main-thread pauses.
          Protocol and parsing choices should be based on measured worst-case update rates, not happy-path demos.
        </p>
        <p>
          Finally, risk controls can be accidentally split across inconsistent client and server rules. If the UI says
          an order is valid but the OMS rejects it for a rule the UI never showed, traders lose trust. The client can
          be advisory, but its rules, labels, and limits should be generated from the same policy source where possible.
        </p>
        <p>
          Teams often optimize render latency while ignoring correctness under burst load. Market open, news events, and volatility spikes produce message bursts, partial fills, venue rejects, and rapidly changing order books. The UI should coalesce visual updates where safe, preserve critical order events exactly, and expose feed lag so traders do not act on stale market data.
        </p>
        <p>
          Another pitfall is mixing simulated and live behavior. Paper trading, delayed quotes, sandbox accounts, and real-money trading need unmistakable environment boundaries. A principal-ready design prevents accidental live orders and records audit evidence for user actions, confirmations, and backend decisions.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Retail brokerages use browser and mobile trading UIs for quotes, watchlists, charts, order tickets, fills,
          and portfolio state. They prioritize clear degraded states, regulatory disclosures, idempotent order
          submission, and correctness over microsecond latency.
        </p>
        <p>
          Institutional operations teams use web trading dashboards for monitoring orders, positions, exceptions, and
          risk. These users may not need the lowest execution latency, but they need accurate status streams, strong
          filtering, audit trails, and reliable cancellation or amend workflows.
        </p>
        <p>
          Crypto exchanges use similar patterns for order books, tickers, trades, and order entry. Market volatility
          and retail traffic spikes make worker-based processing, sequence recovery, and rate-limited order submission
          especially relevant.
        </p>
        <p>
          Internal market-data tools use low-latency UI techniques for pricing, risk, and alerting dashboards. Even
          when users are not submitting orders, sequence-aware streams and degraded modes prevent analysts from making
          decisions on silently stale data.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you keep the UI responsive during market volatility?
        </h3>
        <p>
          I would process market data off the main thread in a Web Worker. The worker decodes messages, validates
          sequence numbers, updates the book, and emits compact render snapshots at the display cadence. The main
          thread renders only the latest snapshot and remains available for order entry. This allows the system to
          process every event needed for correctness while coalescing visual updates to 60Hz or 120Hz.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you detect and recover from missed market data messages?
        </h3>
        <p>
          Each instrument stream should carry sequence numbers. The worker tracks the expected next sequence. On a
          duplicate it ignores the event. On a gap it marks the book invalid, asks the server for a fresh snapshot, and
          either replays buffered deltas after that snapshot or resumes from the snapshot sequence. The UI should show
          a recovering or stale state and disable order submission until the quote context is trustworthy again.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you prevent duplicate orders?
        </h3>
        <p>
          Generate a client order nonce for the user's first submit intent, disable duplicate clicks for that intent,
          and send the nonce with the order request. If the request times out, retry with the same nonce. The OMS
          deduplicates by trader and nonce and returns the existing order if it already processed the request. The UI
          reconciles to the authoritative order ID and status stream.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          When should the UI disable order submission?
        </h3>
        <p>
          It should disable or require reconfirmation when market data is stale, sequence recovery is in progress, the
          market is closed, the instrument is halted, OMS connectivity is unavailable, risk checks cannot run, or the
          order ticket is internally invalid. The key is to distinguish these states so the trader knows whether the
          issue is data freshness, execution availability, or input validation.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Why not render every market data update immediately?
        </h3>
        <p>
          The display cannot show 1000 distinct frames per second, and trying to render every event would consume the
          main thread and increase input latency. The worker should process every update for correctness, but the
          renderer should publish the latest coalesced snapshot on animation frames. This preserves visible freshness
          while keeping the UI responsive.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How would you measure whether the UI meets the latency target?
        </h3>
        <p>
          I would timestamp at receive, worker decode, book apply, snapshot emit, main-thread receive, render commit,
          and paint where browser APIs allow. For orders, I would track click-to-request, request-to-OMS-ack, and
          OMS-ack-to-render. I would look at p95 and p99 during volatile market replay, not just averages in quiet
          markets, because latency spikes during volatility are the real risk.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API" target="_blank" rel="noreferrer">
              MDN: Web Workers API
            </a>
            , off-main-thread processing for browser applications.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank" rel="noreferrer">
              MDN: WebSocket API
            </a>
            , browser realtime transport basics.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer" target="_blank" rel="noreferrer">
              MDN: SharedArrayBuffer
            </a>
            , shared memory requirements and browser isolation constraints.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Performance_API" target="_blank" rel="noreferrer">
              MDN: Performance API
            </a>
            , browser latency measurement primitives.
          </li>
          <li>
            <a href="https://www.fixtrading.org/standards/" target="_blank" rel="noreferrer">
              FIX Trading Community standards
            </a>
            , trading protocol context for order and market data systems.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
