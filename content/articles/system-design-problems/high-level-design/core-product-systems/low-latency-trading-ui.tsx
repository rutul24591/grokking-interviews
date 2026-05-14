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
  wordCount: 5600,
  readingTime: 34,
  lastUpdated: "2026-05-10",
  tags: ["hld", "trading", "low-latency", "websocket", "order-book", "web-worker"],
  relatedTopics: ["real-time-dashboard-frontend", "race-condition-handling"],
};

export default function LowLatencyTradingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A trading UI is a real-time system where latency is measured in milliseconds and errors have direct financial consequences. A trader executing an order at the wrong price because the UI displayed stale data, or a system that accepted a duplicate order because the submit button was not correctly disabled, represents both financial loss and regulatory exposure. The design must simultaneously optimize for the absolute minimum display latency (price updates must be visible on screen within 100ms of the market event), absolute correctness of order execution (no duplicates, no execution at stale prices), and resilience under extreme conditions (market volatility spikes create order-of-magnitude increases in message frequency that must not degrade the UI).</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The distinction from a general real-time dashboard is the interaction path: in a dashboard, the user observes data passively. In a trading UI, the user makes decisions based on the data and executes transactions. The latency of the decision loop (market event → display → user decision → order submission → execution confirmation) must be minimized, and every element of the UI that could introduce incorrect decisions (stale prices, incorrect quantities, missing risk warnings) is a critical defect.</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> The trading platform handles equities and derivatives. Market data arrives at 10–1000 updates per second per instrument during normal conditions, potentially higher during volatility events. Orders are submitted to an exchange via a backend order management system (OMS). The UI is a browser-based application (WebSockets for market data, HTTP for order submission). Regulatory requirements mandate that all orders display the current bid/ask price at the time of submission and that the user confirms if the market has moved since the price was displayed.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Order book display:</strong> Real-time bid/ask ladder showing the top 10–20 price levels with quantity at each level, updating at full market frequency.</li>
          <li><strong>Price ticker:</strong> Last trade price with directional arrow (up/down from previous trade). Color flash on price change (green for uptick, red for downtick).</li>
          <li><strong>Order entry form:</strong> Instrument selection, quantity, order type (market, limit, stop), limit price input. One-click order submission with confirmation.</li>
          <li><strong>Price staleness detection:</strong> If the displayed price is more than 2 seconds old, show a staleness indicator and disable order submission.</li>
          <li><strong>Order status tracking:</strong> Real-time updates on submitted orders: pending → partially filled → filled → rejected. Positions panel updating as fills are received.</li>
          <li><strong>Risk controls:</strong> Pre-trade risk check before order submission: quantity limits, position limits, price deviation from current market (reject if limit price deviates more than 5% from current bid/ask).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Display latency:</strong> Market data received by the browser must be visible on screen within 100ms. End-to-end from exchange event to screen update target is under 200ms.</li>
          <li><strong>Throughput under volatility:</strong> The UI must remain responsive at 1000 order book updates per second without dropping frames or introducing input latency.</li>
          <li><strong>Order submission reliability:</strong> Zero duplicate orders. Order submission must be idempotent with server-side deduplication.</li>
          <li><strong>Correctness:</strong> Displayed prices must reflect the most recent received market data. Stale or out-of-order data must not be displayed as current.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The trading UI architecture separates the market data processing path from the UI rendering path. Market data arrives at high frequency via WebSocket and is processed off the main thread in a Web Worker. The Web Worker maintains the current order book state and produces rendered snapshots for the UI at the display rate (targeting 60fps or a configurable update rate). The main thread consumes these snapshots and updates the DOM, never doing expensive computation. The order entry path is entirely separate from the market data path: order submission goes directly to the OMS via a dedicated HTTP endpoint (not through the market data WebSocket).</HighlightBlock>
        <HighlightBlock as="p" tier="important">This architecture ensures that a burst of 1000 order book updates per second cannot cause input latency on the order entry form, because the heavy processing (order book state management, snapshot generation) runs in the Web Worker, and the main thread only receives pre-computed render payloads. The main thread's work is bounded to DOM updates, which is fast and deterministic.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/low-latency-trading-ui-architecture.svg"
          alt="Low-latency trading UI architecture showing WebSocket market data stream → Web Worker order book state manager → SharedArrayBuffer render snapshot → main thread DOM renderer. Separate order submission path to OMS via HTTP. Price staleness detector, pre-trade risk check, order deduplication, and fill update pipeline shown."
          caption="Trading UI architecture: Web Worker handles high-frequency market data, main thread handles rendering and input, order submission via dedicated HTTP path"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Binary WebSocket Protocol</h3>
        <HighlightBlock as="p" tier="important">JSON is convenient but expensive for high-frequency market data. Parsing a JSON object for every order book update at 1000Hz introduces measurable CPU cost on the receiving end. Binary WebSocket messages (ArrayBuffer payloads) eliminate the string parsing cost: a 64-byte binary message encoding 8 price levels can be decoded in a single DataView pass with essentially zero garbage collection overhead. The protocol is defined by a fixed schema: message type (1 byte), instrument ID (4 bytes), sequence number (8 bytes), update type (full snapshot vs incremental), and then N price-level entries, each being price (8 bytes float64) and quantity (8 bytes float64).</HighlightBlock>
        <HighlightBlock as="p" tier="important">The sequence number is critical for correctness. Order book updates must be applied in sequence; an out-of-order update (sequence number gap) indicates a missed message. The Web Worker tracks the expected sequence number per instrument; if a gap is detected, it sends a snapshot request back to the server (via the same WebSocket, or a separate HTTP endpoint), receiving a full order book snapshot that resets the state to a known-good baseline. Without sequence tracking, missed messages would result in an incorrect order book that could cause trades at wrong prices.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Web Worker Order Book State Management</h3>
        <p>The Web Worker maintains the order book as two sorted structures: the bid side (sorted descending by price) and the ask side (sorted ascending by price). Incremental updates modify specific price levels: an insert or update for a price level that has new quantity, or a delete for a price level that has been exhausted. These operations are O(log N) in a sorted array or balanced BST representation. At 1000 updates per second and N=20 displayed levels, the Web Worker spends approximately 0.1ms per update in order book maintenance, well within the budget.</p>
        <HighlightBlock as="p" tier="important">Every 16ms (aligned to the display refresh rate via a message from the main thread, or via the Worker's own setInterval), the Web Worker produces a render snapshot: a simple JavaScript object containing the current top-N bid and ask levels. This snapshot is posted to the main thread via postMessage. The main thread receives the snapshot and updates the DOM. The key efficiency is that the main thread never processes the raw 1000Hz message stream; it only sees pre-computed 60Hz snapshots. During periods of high volatility (1000Hz updates), the Worker processes all updates but the main thread still only renders 60 times per second, throwing away intermediate states that are overwritten before the next render.</HighlightBlock>
        <HighlightBlock as="p" tier="important">For the absolute minimum latency path (used by institutional traders who need every microsecond), SharedArrayBuffer can replace postMessage for snapshot delivery. The Worker writes the current snapshot directly into a shared memory buffer; the main thread reads from the same buffer on each animation frame without the serialization and deserialization overhead of postMessage. SharedArrayBuffer requires Cross-Origin Isolation headers (COOP + COEP) but eliminates the postMessage copy cost, reducing per-frame overhead by approximately 0.1–0.5ms.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Order Book Rendering</h3>
        <p>The order book DOM update strategy is critical for performance. Naively, each 60fps render update reconciles the entire bid/ask ladder DOM—destructive and expensive. The optimized approach maintains a reference to the DOM cells for each displayed price level and updates only the changed cells in-place. At each render, the Worker snapshot is compared to the previous snapshot: unchanged levels skip DOM updates. Only levels where price or quantity changed receive innerHTML updates (or text content updates, which are cheaper than innerHTML for simple numeric values).</p>
        <p>For the price change flash effect (green flash on uptick, red flash on downtick), a CSS class is added (price-up or price-down) and removed after the animation duration via a setTimeout. To avoid style recalculation cost, CSS animations are used rather than JavaScript-driven style changes. The animation is defined entirely in CSS (a keyframe that starts with the flash color and transitions to the base color over 300ms); adding the class triggers the animation without any JavaScript style access during the animation frame.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Price Staleness Detection</h3>
        <HighlightBlock as="p" tier="important">A key correctness requirement: if the WebSocket connection drops or market data stops flowing, the trader must not see stale prices displayed as current and submit orders against them. The UI maintains a "last update" timestamp per instrument, updated every time a market data message is received. A staleness checker runs every 100ms (a setInterval on the main thread): if now - lastUpdateTimestamp &gt; 2000ms for the currently displayed instrument, the price display is overlaid with a "PRICE STALE – DATA DELAYED" warning and the order submit button is disabled. When market data resumes (a new message is received), the stale indicator is cleared immediately and the submit button is re-enabled.</HighlightBlock>
        <HighlightBlock as="p" tier="important">WebSocket disconnection is detected via the WebSocket onclose and onerror events, triggering immediate reconnection attempts and an immediate stale indicator display (rather than waiting for the 2-second staleness timeout). The reconnection uses exponential backoff (100ms, 200ms, 400ms, max 2000ms) with a maximum of 10 attempts before showing a "Connection failed – please refresh" error. During the reconnection window, the stale indicator is shown and order submission is disabled, protecting the trader from acting on prices that may be seconds or minutes old.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Order Submission and Deduplication</h3>
        <p>Order submission captures the current best bid or ask price at the exact moment the user clicks "Submit." This price is included in the order request payload and on the server. If the current market price at order receipt deviates from the submitted price by more than the configured slippage tolerance (e.g., 0.1% for equities), the OMS rejects the order with a price deviation error, and the UI shows an error like "Market moved. Order rejected. Current price updated in the ticket." The user can resubmit with the current price. This protection prevents traders from accidentally executing at significantly different prices than they intended when the market moves rapidly between clicking Submit and the OMS receiving the order.</p>
        <p>Idempotency against duplicate orders uses a client-generated order nonce: a UUID generated on the first submit click, stored in the order request. The submit button is disabled immediately on click. If the submission fails with a network error (timeout, 503), the retry uses the same nonce. The OMS deduplicates by (traderId, nonce) pairs: if the nonce has been seen before (the first submission succeeded but the response was lost), the OMS returns the existing order rather than creating a new one. This is the critical safeguard against the "double-click" or "retry after network error" scenarios that result in duplicate orders in naive implementations.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pre-Trade Risk Controls</h3>
        <p>Client-side pre-trade risk checks catch obvious errors before the order reaches the OMS, reducing latency for valid orders and protecting traders from fat-finger errors. The client validates: quantity is within configured limits (e.g., max 100,000 shares per order); limit price (for limit orders) does not deviate more than 5% from the current mid-price; the order does not increase the position beyond the configured position limit; and the order value does not exceed the configured notional limit. These validations run synchronously on submit click and show inline error messages if any check fails, without a network round trip.</p>
        <p>Client-side risk checks are a first line of defense, not a security control—they can be bypassed by a compromised browser or a malicious client. The OMS performs server-side risk checks (position limits, notional limits, regulatory limits) as the authoritative gate. Client-side checks exist purely to reduce round trips for common error cases and to give the trader instant feedback on obviously invalid orders.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/low-latency-trading-ui-workflow.svg"
          alt="Trading UI workflow showing market data path (exchange event → WebSocket → Web Worker sequence check → order book update → 60fps snapshot → DOM render) and order execution path (submit click → capture current price → pre-trade risk check → OMS HTTP request with nonce → execution confirmation → position update). Price staleness detection and reconnection flow shown."
          caption="Trading UI data flows: high-frequency market data through Web Worker to 60fps DOM rendering, and order execution with price capture, risk checks, and idempotent submission"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Web Workers versus main thread processing: Web Workers add architectural complexity (message passing, no direct DOM access), but the performance isolation they provide is essential for high-frequency market data processing. Without a Web Worker, a burst of 1000 messages per second would occupy the main thread with JSON parsing and order book state management, causing visible input lag on the order entry form—exactly the condition where a trader is most likely to be actively interacting (high volatility periods produce both high message frequency and high trader activity simultaneously). The complexity is justified.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Browser-based versus native application: professional trading desks typically use native desktop applications (Bloomberg Terminal, proprietary OMS GUIs) rather than browser-based UIs for their lowest-latency paths. Browser-based trading UIs have inherent latency floors from the JavaScript runtime, the browser's rendering pipeline, and the operating system's network stack that native applications avoid. For retail trading platforms and non-latency-critical institutional workflows, the browser is adequate. For high-frequency trading where microseconds matter, native applications are required and the browser UI serves as a monitoring and reporting interface, not the execution path.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Optimistic order status versus confirmed status: some trading UIs show an "order submitted" confirmation immediately on click, before the OMS has processed the order. This feels responsive but is potentially misleading—the order may be rejected by the OMS's risk checks. The more correct approach is to show "submitting..." immediately on click, then show the confirmed status (accepted/rejected) when the OMS responds. The OMS response time should be under 100ms for a well-architected system. Showing a false "accepted" state for orders that will be rejected by the OMS creates confusion and potential trading errors.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A low-latency trading UI achieves sub-100ms display latency through three architectural decisions: binary WebSocket messages (eliminating JSON parse cost), Web Worker order book state management (protecting the main thread from high-frequency processing), and requestAnimationFrame-based rendering (producing 60fps DOM updates regardless of message frequency). Price staleness detection (2-second threshold + WebSocket disconnect detection) prevents trading against stale data. Order submission is idempotent via client-generated nonces and OMS deduplication, preventing duplicate orders on network retry. Pre-trade risk checks run client-side for immediate feedback and server-side for authoritative enforcement. The Web Worker's SharedArrayBuffer path (with COOP/COEP isolation) provides the minimum-latency variant for institutional use cases. The defining constraint of the system is that correctness always takes priority over performance: a slightly slower system that prevents double-orders and stale-price executions is always preferable to a faster system that occasionally executes incorrectly.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
