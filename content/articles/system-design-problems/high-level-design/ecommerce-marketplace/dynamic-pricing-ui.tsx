"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-dynamic-pricing-ui",
  title: "Design a Dynamic Pricing System UI",
  description:
    "Architecture for a dynamic pricing system UI: real-time price feeds via WebSocket, price history sparklines, urgency signals (demand indicators, limited stock), flash sale countdown timers, personalized price display, A/B price experiment tracking, price staleness detection, competitor price comparison widgets, and client-side price update diffing to minimize re-renders.",
  category: "high-level-design",
  subcategory: "ecommerce-marketplace",
  slug: "dynamic-pricing-ui",
  wordCount: 4800,
  readingTime: 29,
  lastUpdated: "2026-05-11",
  tags: ["hld", "ecommerce", "dynamic-pricing", "websocket", "real-time", "flash-sale", "price-history"],
  relatedTopics: ["inventory-aware-ui", "cart-checkout-concurrency"],
};

export default function DynamicPricingUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">Dynamic pricing — adjusting prices in real time based on demand, inventory, competitor prices, time of day, and user segment — is standard in airlines, hotels, ride-sharing, and increasingly in e-commerce. The frontend challenge is twofold. First, delivering price updates to users already on the page without a full reload: a user browsing a product for 5 minutes should see the current price, not the price at page load time (which may have changed). Second, presenting dynamic pricing without creating a feeling of manipulation: a price that visibly ticks up while the user is watching ("hurry up and buy!") is legally problematic in some jurisdictions and damages trust in others. The UI must present relevant pricing signals (history, demand context, time-limited offers) transparently and accurately.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The technical challenge is fan-out at scale. During a flash sale, a price drop for a popular product may need to be pushed to 500K+ users who currently have the product page or listing page open. Pushing 500K WebSocket messages simultaneously is a significant infrastructure challenge. The solution is a publish-subscribe architecture where the price update is published once and a fan-out layer (Redis Pub/Sub, Kafka) distributes it to all subscribed WebSocket connections.</HighlightBlock>
        <p><strong>Explicit scope:</strong> Price display components, real-time price update delivery, price history, flash sale countdowns, and personalized price display. Not in scope: the pricing engine itself (algorithms, competitor scraping), or A/B testing infrastructure (addressed at the component level only).</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Real-time price updates:</strong> When a product's price changes while a user is on the page, the displayed price updates within 5 seconds without a page reload. The transition is animated (old price fades out, new price fades in) to draw attention without being jarring.</li>
          <li><strong>Price history:</strong> A sparkline showing the product's price over the past 30 days, with the current price highlighted. Users can see if today's price is historically low or high.</li>
          <li><strong>Flash sale countdown:</strong> When a product is in a flash sale, a countdown timer shows time remaining for the discounted price. At expiry, the timer disappears and the price reverts to the standard price (animated transition).</li>
          <li><strong>Demand signals:</strong> "X people are viewing this right now" and "Bought Y times in the last hour" badges that update periodically. These are approximate (for performance) and decay gracefully when the data is stale.</li>
          <li><strong>Personalized pricing:</strong> Logged-in users may see different prices based on their loyalty tier, coupon codes, or negotiated rates. The personalized price is fetched client-side after page load (not in the ISR shell) to prevent it from being cached and shown to the wrong user.</li>
          <li><strong>Price staleness guard:</strong> If the displayed price is more than 10 minutes old (e.g., the user has been on the page a long time), show a "Prices may have changed" notice and re-fetch the current price before allowing add-to-cart.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Fan-out scale:</strong> A single price change event must reach 500K+ connected WebSocket clients within 5 seconds.</li>
          <li><strong>Price accuracy at add-to-cart:</strong> The price shown in the cart and at checkout must match the price the user saw within a 5-minute window. Cart load re-validates the price.</li>
          <li><strong>Countdown timer accuracy:</strong> Flash sale countdown timers must be synchronized to the server's clock (not the client's) to prevent users from exploiting client-side clock manipulation. Server-sent countdown target timestamps; client computes time remaining locally.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="important">The pricing system has three layers. The Pricing Engine (not in scope) computes prices and publishes PriceChanged events to Kafka. The Delivery Layer consumes PriceChanged events and fans them out to subscribed WebSocket connections via a Redis Pub/Sub intermediary. The Display Layer in the browser subscribes to price updates for the products currently visible on screen and updates the React component state, triggering animated re-renders only for changed prices. The architecture is designed so the Pricing Engine is decoupled from the delivery infrastructure — it publishes events without knowing how many clients are subscribed or how the updates are delivered.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/dynamic-pricing-ui.svg"
          alt="Dynamic pricing UI architecture showing price update fan-out pipeline (pricing engine publishes PriceChanged event Kafka; price-update consumer → Redis Pub/Sub channel price:{skuId}; WebSocket server subscribes per-product channels fan-out to all subscribed clients; 500K+ clients updated within 5s), client WebSocket subscription manager (on product visible IntersectionObserver → subscribe price:{skuId} via WebSocket; on product scroll out → unsubscribe; subscribe only visible products limits server load; reconnect with exponential backoff on disconnect), price display component (animated transition: old price fade-out 300ms new price fade-in 300ms; green flash for price drop red flash for price increase; staleness timer: if lastUpdated > 10min show 'prices may have changed' + re-fetch before add-to-cart; personalized price: fetch POST /api/prices userIds=[skuId] after mount not in ISR shell), flash sale countdown (server sends sale_end_timestamp UTC; client calculates remaining = sale_end_timestamp - Date.now() every second; expires → timer disappears price reverts animated; server-authoritative timestamp prevents client clock manipulation), price history sparkline (30-day hourly OHLC from price_history table ClickHouse; SVG sparkline inline in page; current price highlighted; tooltip on hover shows date and price; low/high markers; lazy-loaded below fold), demand signals (viewing_count from Redis PFADD hyperloglog approximate; sold_last_hour from ClickHouse count with 1h TTL cache; displayed with intentional rounding: 47 → shown as '40+ people viewing'; update interval 30s polling not WebSocket; degrade gracefully on stale: hide if data > 5min old), personalized pricing (logged-in user POST /api/prices/personalized skuIds[] returns segment-specific price; coupon code applied inline; loyalty tier discount; result stored in Zustand not URL to prevent cross-user cache poisoning)."
          caption="Price change fan-out (Kafka → Redis Pub/Sub → WebSocket to 500K+ clients within 5s), client-side subscription manager (subscribe only visible products via IntersectionObserver), animated price transitions, server-authoritative flash sale countdown, price history sparkline (ClickHouse), demand signals (HyperLogLog approximate), and personalized price fetched client-side post-mount"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">WebSocket Fan-out Architecture</h3>
        <HighlightBlock as="p" tier="important">The price update delivery system uses a Redis Pub/Sub intermediary between Kafka consumers and WebSocket servers. Each product has a Redis channel: price:{"{skuId}"}. When a PriceChanged event arrives in Kafka, a consumer publishes the new price to the corresponding Redis channel: PUBLISH price:{"{skuId}"} {"{ newPrice: 49.99, effectiveAt: 1715000000 }"}. Every WebSocket server subscribes to the channels corresponding to the products any of its connected clients are watching. When a WebSocket server receives a message from Redis, it fans it out to all its clients that are subscribed to that channel. This architecture scales horizontally: adding more WebSocket servers increases the total number of connected clients without requiring any change to the Pricing Engine or Kafka consumer.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Client-side subscription management: the browser subscribes only to prices for products currently visible in the viewport (tracked by IntersectionObserver). When a product card scrolls out of view, the subscription is removed. This prevents a user with 200 products loaded via infinite scroll from holding 200 active subscriptions — only the 10–15 products visible at any time are subscribed. On WebSocket reconnect (after a disconnect), the client re-subscribes and fetches the latest prices for all currently-visible products (the reconnection may have missed price changes during the disconnect window).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Price History Sparkline</h3>
        <HighlightBlock as="p" tier="important">The 30-day price history is stored in ClickHouse (price_history table: sku_id, timestamp, price, event_type). The sparkline is generated from hourly OHLC (open/high/low/close) aggregations: SELECT toStartOfHour(timestamp) AS hour, min(price), max(price), argMin(price, timestamp), argMax(price, timestamp) FROM price_history WHERE sku_id = X AND timestamp &gt; now() - INTERVAL 30 DAY GROUP BY hour ORDER BY hour. This query runs in under 50ms for most products (ClickHouse&apos;s columnar storage makes this scan fast). The sparkline data (720 hourly data points) is included in the product page&apos;s ISR response (not lazily loaded) for above-the-fold products, since it is static for the ISR period. The SVG sparkline is a simple polyline SVG element rendered inline, no canvas, no JavaScript charting library, reducing JavaScript bundle size. Interactive tooltips (price on hover) are progressively enhanced with a small JavaScript event listener added at hydration time.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Flash Sale Countdown Timer</h3>
        <HighlightBlock as="p" tier="important">Flash sale countdowns use server-authoritative timestamps to prevent manipulation. The sale configuration (sale_end_timestamp, discounted_price, original_price, eligible_skus) is stored in Redis with a TTL matching the sale duration. When a product is in a flash sale, the product API response includes {"{ saleEndTimestamp: \"2026-05-11T15:00:00Z\", discountedPrice: 29.99, originalPrice: 59.99 }"}. The client renders a countdown component that computes remaining = new Date(saleEndTimestamp) - new Date() and decrements by 1 second via setInterval. When remaining reaches zero: the countdown component unmounts, the displayed price transitions from the discounted price back to the original price (animated), and a re-fetch of the product price is triggered to confirm the server-side price change. Using the server-sent timestamp (not a client-computed countdown duration) means that if two users load the page at different times, they both count down to the same absolute moment, the sale ends correctly for both rather than ending 30 seconds later for the user who loaded the page 30 seconds after the other.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Price Staleness Detection</h3>
        <HighlightBlock as="p" tier="important">Each price display carries a lastFetchedAt timestamp (set when the price was last received from the server, either via ISR, CSR hydration, or WebSocket push). A useEffect hook checks every 60 seconds whether any visible product&apos;s lastFetchedAt is older than 10 minutes. If so, a &quot;Prices may have changed, refresh&quot; notice is shown. Additionally, the add-to-cart handler includes a stale price guard: if the current displayed price&apos;s lastFetchedAt is older than 5 minutes, add-to-cart first triggers a GET /api/prices/{"{skuId}"} call, compares the returned price to the displayed price, and if different, shows a price-changed dialog (&quot;The price has changed from $49 to $55. Do you still want to add to cart?&quot;) before proceeding. This prevents the user from adding to cart at a price that no longer reflects the current price, which would cause a price mismatch when the cart re-validates at checkout.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Personalized Price Rendering</h3>
        <HighlightBlock as="p" tier="important">Personalized prices (loyalty tier discounts, negotiated B2B rates, coupon codes) must not be cached in the ISR shell or CDN, if a cached page shows a discounted price to an unauthenticated user, the discount is applied to anyone who loads that URL. The pattern: the ISR shell shows the base (non-personalized) price as a placeholder. On hydration, a useEffect fetches the personalized price: POST /api/prices/personalized {"{ skuIds: [visible_skus], userId }"}. If the personalized price differs from the base price, the component re-renders with the personalized price (a strike-through of the base price and the discounted price highlighted). The personalized price is stored in the Zustand client store (not in the URL or localStorage) so it is not shared across browser tabs or persisted across sessions, preventing cross-user cache poisoning.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">WebSocket versus polling for price updates: WebSocket delivers price changes within seconds and uses a persistent connection (low latency). SSE (Server-Sent Events) is a simpler alternative (HTTP-based, auto-reconnect, works through HTTP/2 multiplexing without requiring WebSocket upgrade). For price updates where the communication is always server-to-client (no client messages needed), SSE is architecturally simpler and handles HTTP/2 multiplexing better. WebSocket is more appropriate when bidirectional communication is needed (e.g., the client needs to send explicit subscription/unsubscription messages). For a high-scale price update system with millions of concurrent connections, SSE's per-connection overhead (one HTTP/2 stream rather than a WebSocket connection) may be lower. The design above uses WebSocket for flexibility; SSE is a viable alternative if the subscription protocol is moved server-side (subscribe all products matching the user's current view server-side, based on browsing context).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Approximate versus exact demand signals: exact "X people viewing this" counts would require a central counter updated on every page view, with fan-out to all viewers — extremely expensive at scale. HyperLogLog approximate counting (Redis PFADD/PFCOUNT) provides accurate estimates within 0.81% error using only 12KB of memory per counter, regardless of cardinality. The 0.81% error is imperceptible to users ("47 people viewing" vs "47.4 people viewing"). The intentional rounding in the display ("40+ people") further masks the approximation, making the approximation approach both efficient and UX-appropriate.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A dynamic pricing UI requires three technical capabilities: real-time price push (Kafka → Redis Pub/Sub → WebSocket, 500K+ clients within 5s), transparent price presentation (history sparkline from ClickHouse OHLC data, server-authoritative countdown timestamps, demand signals from HyperLogLog), and correctness guards (add-to-cart staleness check re-fetches if price &gt;5 min old, personalized prices fetched client-side post-mount to prevent CDN cache leakage). The client-side subscription manager (IntersectionObserver-driven, subscribe/unsubscribe as products enter/leave viewport) bounds server load — each user holds ~10-15 active price subscriptions at any time regardless of scroll depth. Flash sale countdowns use server-sent absolute timestamps, not client-computed durations, ensuring all viewers count down to the same moment. The key design tension: dynamic pricing infrastructure is expensive (fan-out infrastructure, WebSocket connections, ClickHouse queries) — scope its use to products and pages where real-time pricing meaningfully affects purchasing behavior, not to every product in the catalog.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
