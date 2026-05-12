"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-inventory-aware-ui",
  title: "Design an Inventory-Aware UI (Real-Time Stock Updates)",
  description:
    "Architecture for an inventory-aware UI: real-time stock level push via SSE/WebSocket, product listing stock badge updates, variant-level stock (size/color availability), out-of-stock handling (disable add-to-cart, back-in-stock notifications), pre-order UI for coming-soon products, warehouse-level availability for multi-warehouse fulfillment, and stock reservation during checkout with TTL.",
  category: "high-level-design",
  subcategory: "ecommerce-marketplace",
  slug: "inventory-aware-ui",
  wordCount: 4800,
  readingTime: 29,
  lastUpdated: "2026-05-11",
  tags: ["hld", "ecommerce", "inventory", "real-time", "sse", "stock", "warehouse", "back-in-stock"],
  relatedTopics: ["cart-checkout-concurrency", "dynamic-pricing-ui"],
};

export default function InventoryAwareUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>An inventory-aware UI presents real-time stock information to users in a way that drives purchasing behavior (urgency when stock is low) without misleading them (showing "Only 2 left" when there are actually 200, or showing "In Stock" when inventory just hit zero). The core challenge is the granularity and freshness of stock information: product listings show approximate stock levels ("In Stock", "Low Stock: 3 left"), product detail pages show variant-level availability (Size M in Blue: In Stock; Size L in Blue: Out of Stock), and the checkout prevents purchase of items that just sold out while the user was on the page.</p>
        <p>The inventory system must handle two very different traffic patterns. Normal operations: stock levels change as items are purchased or restocked, at a rate of hundreds to thousands of updates per minute across a large catalog. Flash events (popular item restocks, product launches): a single inventory event (e.g., 500 units of a high-demand item released) generates 500K+ concurrent page loads within seconds, all competing for a limited stock update stream. The UI infrastructure must absorb this spike without losing update fidelity for users who have the product page open.</p>
        <p><strong>Explicit scope:</strong> Stock badge display, variant-level availability, out-of-stock handling, back-in-stock notifications, and stock reservation during checkout. Not in scope: warehouse management, replenishment, or supplier ordering.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Stock badges:</strong> Product cards on listing pages show "In Stock", "Only N left" (for N &lt; 10), or "Out of Stock" badges. Badges update within 60 seconds of a stock change without page reload.</li>
          <li><strong>Variant availability:</strong> On the product detail page, variant selectors (size, color) visually indicate availability: in-stock variants are selectable; out-of-stock variants are greyed with strikethrough and show "Out of Stock" on hover. Selecting an in-stock variant highlights the "Add to Cart" button; selecting an out-of-stock variant shows "Notify me when available".</li>
          <li><strong>Add-to-cart guard:</strong> The add-to-cart action re-validates stock before adding. If the item went out of stock between page load and add-to-cart click, the user sees an error and the variant selector updates to show the item as out of stock.</li>
          <li><strong>Back-in-stock notifications:</strong> Users can subscribe to alerts for out-of-stock items. When the item is restocked, an email or push notification is sent within 5 minutes. The subscription is associated with the specific variant (size M, blue).</li>
          <li><strong>Pre-order:</strong> Products not yet available show a "Pre-order" CTA with an expected availability date. Pre-orders are collected without inventory reservation (fulfilled when stock arrives).</li>
          <li><strong>Multi-warehouse availability:</strong> For items available in some warehouses but not others, show "Available for delivery to [your location]" based on the user's shipping address or geo-IP.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Stock badge freshness:</strong> Listing page badges reflect inventory within 60 seconds. PDP variant availability within 30 seconds.</li>
          <li><strong>Availability on product spike:</strong> During a product launch, the inventory system must handle 100K+ simultaneous page loads without showing stale "In Stock" badges to users for items already sold out.</li>
          <li><strong>Back-in-stock notification latency:</strong> Notifications delivered within 5 minutes of restock event.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>Stock updates flow from the Inventory Service to the UI through two paths depending on the user's context. Listing pages use a polling architecture (lighter weight, slightly higher latency): the page polls a GET /api/stock?skuIds=[...] endpoint every 60 seconds for the batch of visible products. PDPs use SSE (Server-Sent Events) for lower latency: when a user opens a PDP, the browser establishes a persistent SSE connection to the stock update stream for that specific product. The Inventory Service publishes stock change events to Redis Pub/Sub; the SSE server subscribes to the relevant channels and streams updates to connected clients. This two-tier approach (polling for listings, SSE for PDPs) balances cost (SSE connections are more expensive than polling for high-cardinality product grids) against freshness (PDPs need faster updates because users are closer to a purchase decision).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/inventory-aware-ui.svg"
          alt="Inventory-aware UI architecture showing two-tier stock update delivery (listing pages: 60s polling GET /api/stock skuIds[] batch → Redis stock:{skuId} O(1) lookup; PDPs: SSE connection per product → Inventory Service publishes stock changed → Redis Pub/Sub stock:{skuId} → SSE server fan-out within 30s), stock data model (inventory table: skuId warehouseId quantity reserved available=quantity-reserved updated_at; available stock = quantity - reserved; reserved includes active checkout sessions TTL 15min; low stock threshold configurable per category default 10), variant availability matrix (product_id × variant_id × warehouse_id → {available: bool quantity: int}; fetched on PDP load for all variants; cached Redis with 30s TTL; variant selector UI: available=selectable; 0=greyed strikethrough notify-me; mixed warehouse: show if any warehouse has stock; delivery estimate based on nearest warehouse), add-to-cart stock guard (optimistic UI: increment cart immediately; background POST /api/cart/add {skuId quantity}; server calls Inventory Service checkAvailable; if unavailable: toast error + mark variant out-of-stock in local state; atomic: WATCH quantity MULTI EXEC DECRBY reserved EXEC; race: last unit sold during UX flow → graceful error never oversell), back-in-stock notification (user clicks notify-me → POST /api/notifications/subscribe {skuId userId variant}; stored notifications_subscriptions table; Inventory Service publish StockRestored event → notification worker query subscribers → batch email/push within 5min; dedup: user sees notify-me as subscribed state; unsubscribe on notification sent or explicit cancel), multi-warehouse availability (geo-IP or saved address → nearest warehouse region; GET /api/stock/{skuId}?region=us-east returns warehouse-local availability; expected delivery = warehouse_distance_days + handling_time; some warehouses only: show available + delivery estimate vs not available in your region), pre-order UI (quantity=0 availability_date set → show pre-order CTA expected date; no inventory reservation; order fulfilled when stock arrives; pre-order limit per user configurable)."
          caption="Two-tier stock updates (60s polling for listings, SSE for PDPs), variant availability matrix (per-variant per-warehouse), add-to-cart stock guard (atomic DECRBY, graceful error on race), back-in-stock notification pipeline (StockRestored event → subscriber batch notify within 5min), multi-warehouse region-based availability, and pre-order handling"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Stock Data Model and Available Quantity</h3>
        <p>The inventory table has three key quantity fields: quantity (physical units in warehouse), reserved (units currently in active checkout sessions with TTL), and available = quantity − reserved (what can be sold right now). The "Only N left" badge shows available, not quantity — a product with quantity=5 and reserved=3 shows "Only 2 left" because the other 3 are being held for users in the checkout flow. Reserved quantities have TTLs (15 minutes per checkout session). A Reaper process monitors expired checkout sessions and decrements reserved, increasing available. Low-stock thresholds are configurable per product category (electronics: show "Only N left" for N &lt; 5; apparel: N &lt; 10; groceries: N &lt; 20) to match category-specific buying behavior.</p>
        <p>Multi-warehouse model: each SKU has availability per warehouse (inventory table: skuId, warehouseId, quantity, reserved). Available for a given user = sum(available) across warehouses that can fulfill to the user's delivery region within the specified delivery window. The Inventory Service aggregates across applicable warehouses to determine if the item can be delivered. The UI shows the user a delivery estimate based on the nearest warehouse with available stock, not just a binary in/out-of-stock indicator.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">SSE Connection Management for PDPs</h3>
        <p>Each PDP establishes a single SSE connection to GET /api/stock/stream?skuId={"{sku}"}. The SSE server subscribes to the Redis Pub/Sub channel for that SKU and streams updates. Connection lifecycle management: when the user navigates away from the PDP (React router unmount or page unload), the EventSource is closed. The SSE server detects the client disconnect (write error on the HTTP stream) and unsubscribes from the Redis channel. This prevents orphaned subscriptions from accumulating. For product launches where 100K users open the same PDP simultaneously, the SSE server cluster may have 100K connections all subscribed to the same Redis channel (price:{"{hotSkuId}"}). Redis Pub/Sub can handle this at high fan-out, the message is published once and delivered to all subscribed SSE server instances, each of which fans out to its local connections. If the SSE server cluster is horizontally scaled to 50 servers with 2K connections each, each server receives one Redis message and delivers it to 2K local streams, O(1) per server, O(N) total delivery.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Variant Selector and Availability Matrix</h3>
        <p>On a product with 3 colors × 4 sizes = 12 variants, the PDP fetches the availability matrix on load: POST /api/stock/variants {"{ productId, variantIds: [v1..v12] }"}. The response is a map {"{ variantId → { available: bool, quantity: int, warehouseAvailability: {region → bool} } }"}. The variant selector renders each option (color swatch, size button) with visual availability encoding: available variants have full opacity and are clickable; out-of-stock variants have reduced opacity, a strikethrough, and a &quot;Notify me&quot; tooltip on hover. When the SSE connection receives a stock update for the product, the variant availability matrix is patched in the component state: only the changed variant&apos;s state updates, not the entire matrix. This granular update prevents unnecessary re-renders of the 11 unchanged variants.</p>
        <p>Cross-variant availability cues: when the user selects an out-of-stock combination (e.g., Size L Blue), the UI also shows which available combinations are closest: "Size L available in Red (+$0) and Green (+$2)". This cross-variant suggestion reduces abandonment for out-of-stock selections by surfacing the nearest available alternative without requiring the user to manually explore the matrix.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Back-in-Stock Notification Pipeline</h3>
        <p>Back-in-stock subscriptions are stored with full variant specificity: user_id, product_id, variant_id (for specific size/color), created_at, notification_sent_at. When the Inventory Service processes a restock event (incoming shipment or return), it publishes a StockRestored event to Kafka with skuId, variantId, quantityAdded, newAvailableQuantity. A notification worker consumes StockRestored events and queries the subscriptions table for all users subscribed to the restocked variant. For variants with many subscribers (popular items), the notification is batched: up to 1000 notifications per email/push batch, sent in parallel. Each notification contains a direct link to the PDP with the specific variant pre-selected and a "View item" CTA. The notification includes the restocked quantity to set urgency expectations ("25 units now available"). After sending, the subscription record is marked notification_sent_at = now(). If stock sells out again before the user acts on the notification, the add-to-cart guard handles it gracefully.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Listing Page Stock Badge Polling</h3>
        <p>Listing pages (search results, category pages) show stock badges for up to 60 products in a grid. Polling all 60 simultaneously every 60 seconds generates significant backend load when multiplied across millions of users. The polling strategy uses batching and smart scheduling. Batching: a single GET /api/stock?skuIds=sku1,sku2,...sku60 request fetches all 60 stock levels in one round-trip. The backend resolves this against Redis (MGET stock:{"{skuId}"} for all skuIds) in a single Redis pipeline call. Smart scheduling: polling frequency adapts to the user&apos;s activity. If the user has been idle on the page for more than 5 minutes (detected via Page Visibility API and mousemove or scroll absence), the polling interval extends to 5 minutes. When the user becomes active again (focus event, scroll), the interval reverts to 60 seconds and an immediate poll fires to catch any changes during the idle period. This adaptive polling reduces backend load during periods when users are not actively browsing while maintaining freshness for active users.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>SSE versus WebSocket for stock updates: SSE is strictly server-to-client (the server pushes, the client cannot send messages over the same connection). This is fine for stock updates (the client has no messages to send — it subscribes via the URL query parameter). SSE also has superior HTTP/2 support (each SSE connection is one HTTP/2 stream, sharing a single TCP connection with other requests to the same domain) and automatic reconnection built into the browser's EventSource API. WebSocket would add bidirectional capability that stock updates do not need. SSE is the right choice here; WebSocket is better suited for scenarios needing client-to-server messages (live chat, collaborative editing).</p>
        <p>Available quantity display: showing exact quantities ("Only 7 left") creates urgency and transparency but also reveals inventory levels to competitors who can scrape product pages. Some retailers intentionally bucket quantities ("&lt;10 left", "&lt;5 left") rather than showing exact numbers to prevent inventory intelligence gathering. The design supports both modes via a configurable display_mode per product category: exact (shows N), bucketed (shows threshold label), or binary (In Stock / Out of Stock). High-competition categories (electronics, sneakers) often use bucketed to prevent scraping; fashion and grocery use exact to create purchasing urgency.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>An inventory-aware UI uses a two-tier delivery architecture: 60-second batch polling for listing page stock badges (MGET Redis pipeline for all visible SKUs in one request) and SSE for PDP variant availability (&lt;30-second updates, Redis Pub/Sub fan-out). The stock data model tracks quantity, reserved (checkout TTLs), and available = quantity − reserved. The add-to-cart guard atomically validates stock (WATCH/MULTI/EXEC) before reserving, preventing oversell race conditions. Variant selectors render an availability matrix (per-variant per-warehouse) with cross-variant alternatives suggested for out-of-stock selections. Back-in-stock notifications are driven by StockRestored Kafka events → subscriber query → batched email/push within 5 minutes. Listing page polling uses adaptive intervals (60s active, 5min idle via Page Visibility API) to reduce load while maintaining freshness for active users. The core design insight: available = quantity − reserved is the safety-critical quantity that must be atomic — never read-check-decrement, always atomic compare-and-swap (Lua script or WATCH/MULTI/EXEC) to prevent overselling the last unit.</p>
      </section>
    </ArticleLayout>
  );
}
