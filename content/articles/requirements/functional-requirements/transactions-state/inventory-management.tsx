"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-inventory-management",
  title: "Inventory Management",
  description:
    "Comprehensive guide to implementing inventory management covering stock tracking, reservation strategies, oversell prevention, multi-warehouse coordination, real-time inventory sync, and handling high-concurrency flash sale scenarios.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "inventory-management",
  version: "extensive",
  wordCount: 6300,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "inventory",
    "backend",
    "ecommerce",
    "warehouse",
    "fulfillment",
  ],
  relatedTopics: ["order-management-service", "warehouse-management", "fulfillment-service", "flash-sales"],
};

export default function InventoryManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Inventory management tracks product availability across warehouses and stores, reserves stock for pending orders, and prevents overselling while optimizing stock levels. The inventory system is critical for e-commerce operations—customers expect accurate stock information, fast fulfillment, and no cancellations due to stockouts. For staff and principal engineers, inventory management involves distributed systems challenges (consistency across warehouses, real-time sync, high-concurrency updates) and business complexity (multi-location fulfillment, safety stock, reorder points, demand forecasting).
        </p>
        <p>
          The complexity of inventory management extends beyond simple quantity tracking. Stock levels have multiple states: available (can sell), reserved (held for pending orders), committed (allocated to confirmed orders), in-transit (moving between warehouses), on-order (ordered from supplier, not yet received). Each state transition must be atomic—overselling occurs when concurrent orders both see available stock and both reserve. The system must handle high-concurrency scenarios (flash sales, Black Friday) where thousands of orders compete for limited stock in seconds.
        </p>
        <p>
          For staff and principal engineers, inventory architecture involves trade-offs between consistency and availability. Strong consistency (distributed locking, pessimistic updates) prevents overselling but reduces throughput. Eventual consistency (optimistic updates, async reconciliation) improves throughput but risks temporary overselling. The system must support multi-warehouse coordination (which warehouse fulfills which order), real-time inventory sync (online stock reflects warehouse reality), and integration with warehouse management systems (WMS), enterprise resource planning (ERP), and point-of-sale (POS) systems.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Inventory States and Quantities</h3>
        <p>
          Inventory quantities have multiple states representing different availability levels. On-hand quantity: physical stock in warehouse (counted, verified). Available quantity: on-hand minus reserved (can sell to customers). Reserved quantity: stock held for pending orders (soft allocation, released on timeout or cancellation). Committed quantity: stock allocated to confirmed orders (hard allocation, will ship). In-transit quantity: stock moving between warehouses (not available, will be available on arrival). On-order quantity: stock ordered from supplier (not yet received, expected delivery date).
        </p>
        <p>
          State transitions manage inventory flow. On order → in transit: supplier ships, tracking available. In transit → on hand: warehouse receives, quality check. On hand → reserved: order created, soft hold. Reserved → committed: payment authorized, hard allocation. Committed → shipped: package handed to carrier, inventory deducted. Shipped → (return received): customer returns, inspected, restocked (or written off if damaged).
        </p>
        <p>
          Safety stock prevents stockouts. Buffer quantity above expected demand (reorder point = lead time demand + safety stock). Reorder point triggers purchase order (when available + on-order &lt; reorder point). Economic order quantity (EOQ) balances ordering cost vs. holding cost. Demand forecasting predicts future demand (seasonal trends, promotions, historical patterns).
        </p>

        <h3 className="mt-6">Reservation Strategies</h3>
        <p>
          Early reservation (on cart add or checkout start) guarantees availability. Customer adds to cart, inventory reserved for 15-30 minutes. Pros: No disappointment at checkout (stock guaranteed). Cons: Inventory locked up (abandoned carts block sales), requires cleanup (release on timeout). Best for: High-demand items (limited stock, flash sales), long checkout flows (multi-step, account creation).
        </p>
        <p>
          Late reservation (on payment authorization) maximizes availability. Inventory reserved only when payment succeeds. Pros: Inventory available longer (higher conversion), no cleanup needed. Cons: Risk of selling out during checkout (customer disappointment), payment may succeed but order can&apos;t fulfill. Best for: High-volume retailers (low stockout risk), short checkout flows (one-click, saved payment).
        </p>
        <p>
          Hybrid reservation balances availability with commitment. Soft hold on checkout start (visible as &quot;low stock&quot; to other customers, released on timeout). Hard hold on payment authorization (committed, released only on cancellation). Pros: Balance availability with commitment, customer sees stock status. Cons: Complexity (two reservation states), timeout management. Best for: Most e-commerce retailers.
        </p>

        <h3 className="mt-6">Oversell Prevention</h3>
        <p>
          Distributed locking prevents concurrent overselling. Redis SETNX (set if not exists) acquires lock per SKU. Lock held during reservation, released on commit or timeout. Pros: Strong consistency (no oversell). Cons: Reduced throughput (serialization), lock contention under load, lock timeout management. Best for: High-value items, limited stock, flash sales.
        </p>
        <p>
          Optimistic locking detects concurrent modifications. Version number increments on each update. Update: SET quantity = quantity - 1, version = version + 1 WHERE sku = ? AND version = ?. If affected rows = 0, concurrent modification detected. Retry with latest state. Pros: Higher throughput (no lock wait). Cons: Retry on conflict (wasted work), conflict rate increases with concurrency. Best for: Moderate concurrency, low conflict scenarios.
        </p>
        <p>
          Oversell buffer allows controlled overselling. Available = on-hand - reserved + buffer (e.g., buffer = 5). Sell up to buffer, then stop. Pros: Higher throughput (no locking), absorbs minor oversells. Cons: Risk of actual oversell (buffer exceeded), requires reconciliation (backorder, cancel, substitute). Best for: High-volume retailers with reliable suppliers (can backorder quickly).
        </p>

        <h3 className="mt-6">Multi-Warehouse Coordination</h3>
        <p>
          Centralized inventory tracks all warehouses in single system. Single source of truth (global stock view). Allocation algorithm assigns orders to warehouses (nearest, cheapest, fastest). Pros: Global visibility, optimal allocation, no sync needed. Cons: Single point of failure, latency for global queries, complex allocation logic. Best for: Most e-commerce retailers with multiple warehouses.
        </p>
        <p>
          Distributed inventory tracks per-warehouse independently. Each warehouse has local inventory system. Sync via events (stock change → publish event → other warehouses update). Pros: Warehouse autonomy, local optimization, fault isolation. Cons: Eventual consistency (temporary sync delays), complex reconciliation, allocation requires cross-warehouse queries. Best for: Franchise models, independent warehouses, geographic separation.
        </p>
        <p>
          Virtual pooling aggregates warehouse stock for display. &quot;In stock&quot; = sum of all warehouse available quantities. Fulfillment from nearest warehouse with stock. Pros: Maximizes perceived availability, optimal fulfillment. Cons: Complex allocation, split shipments (items from multiple warehouses), higher shipping cost. Best for: Customer experience focus (show &quot;in stock&quot; even if split across warehouses).
        </p>

        <h3 className="mt-6">Real-time Inventory Sync</h3>
        <p>
          Event-driven sync publishes inventory changes. Stock change → publish InventoryUpdated event → subscribers update (online store, marketplace, POS). Pros: Loose coupling, near real-time, scalable. Cons: Eventual consistency (temporary sync delays), event ordering (ensure correct sequence), event loss (need retry, reconciliation). Best for: Multi-channel retail (online, marketplace, in-store).
        </p>
        <p>
          Polling sync queries for changes periodically. Online store polls warehouse API every N seconds for stock changes. Pros: Simple implementation, no event infrastructure. Cons: Latency (up to poll interval), inefficient (poll even if no changes), load on warehouse system. Best for: Small retailers, low-frequency changes.
        </p>
        <p>
          Batch sync aggregates changes for bulk update. End-of-day batch: all stock changes → batch file → upload to channels. Pros: Efficient (bulk transfer), reduces load. Cons: High latency (up to 24 hours), not suitable for real-time. Best for: Wholesale, B2B, low-frequency updates.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Inventory management architecture spans inventory tracking, reservation service, warehouse coordination, and external integrations. Inventory tracking maintains stock levels per SKU per warehouse. Reservation service handles soft and hard reservations. Warehouse coordination allocates orders to warehouses. External integrations sync with WMS, ERP, POS, and marketplaces.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/inventory-management/inventory-architecture.svg"
          alt="Inventory Management Architecture"
          caption="Figure 1: Inventory Management Architecture — Inventory tracking, reservation service, warehouse coordination, and external integrations"
          width={1000}
          height={500}
        />

        <h3>Inventory Tracking Service</h3>
        <p>
          Inventory data model stores stock per SKU per warehouse. Table: sku_id, warehouse_id, on_hand, reserved, committed, in_transit, on_order, version. Index on sku_id (global stock query) and warehouse_id (per-warehouse query). Optimistic locking with version column prevents concurrent oversell.
        </p>
        <p>
          Stock adjustment handles non-order changes. Receiving: on_order → in_transit → on_hand (supplier shipment). Cycle count: adjust on_hand to match physical count (shrinkage, damage, theft). Transfer: on_hand at source → in_transit → on_hand at destination. Write-off: on_hand → 0 (damaged, expired, lost). Each adjustment logged (who, what, when, why) for audit.
        </p>
        <p>
          Inventory aggregation provides global stock view. Query: SUM(available) across all warehouses for SKU. Cache aggregation result (Redis) for fast product page queries. Invalidate cache on stock change. Virtual pooling: show &quot;in stock&quot; if any warehouse has stock, even if individual warehouse out of stock.
        </p>

        <h3 className="mt-6">Reservation Service</h3>
        <p>
          Reservation flow handles stock holds. Checkout start: reserve (soft hold, TTL 15-30 minutes). Payment success: commit (hard allocation, no TTL). Payment failure/timeout: release (return to available). Cancellation: release (return to available). Reservation ID tracks each hold (for release on timeout).
        </p>
        <p>
          Reservation storage tracks active reservations. Table: reservation_id, sku_id, warehouse_id, quantity, type (soft/hard), expires_at, order_id. Index on expires_at (timeout cleanup job). Index on order_id (release on cancel). Soft reservations have expires_at, hard reservations have order_id.
        </p>
        <p>
          Timeout cleanup releases expired reservations. Cron job runs every minute: SELECT * FROM reservations WHERE expires_at &lt; NOW(). For each: release stock, delete reservation. Idempotent (safe to run multiple times). Monitoring: track reservation timeout rate (high rate = checkout abandonment issue).
        </p>

        <h3 className="mt-6">Warehouse Allocation</h3>
        <p>
          Allocation algorithm assigns orders to warehouses. Input: order line items, ship-to address. Constraints: inventory availability, warehouse capacity, carrier coverage. Objectives: minimize shipping cost, minimize delivery time, balance warehouse load. Algorithm: filter warehouses with all items → rank by cost/time → select best → reserve stock.
        </p>
        <p>
          Split shipment handling when items unavailable at single warehouse. Option 1: wait for all items at single warehouse (delay fulfillment). Option 2: ship from multiple warehouses (higher cost, faster). Option 3: partial ship (ship available now, rest when available). Customer preference captured at checkout (ship together vs. as available).
        </p>
        <p>
          Warehouse failover handles warehouse outages. Primary warehouse unavailable → allocate to secondary. Secondary may have higher shipping cost, longer delivery time. Notify customer of delay. Backorder if no warehouse has stock (expected restock date, option to cancel).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/inventory-management/reservation-flow.svg"
          alt="Inventory Reservation Flow"
          caption="Figure 2: Inventory Reservation Flow — Soft hold, hard commit, release on timeout or failure"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">External Integrations</h3>
        <p>
          WMS integration syncs physical warehouse operations. WMS manages picking, packing, shipping. Inventory system sends allocation → WMS confirms pick → inventory commits. WMS sends stock adjustments (damage, shrinkage) → inventory updates. Real-time sync (webhooks) or batch (end-of-day).
        </p>
        <p>
          ERP integration syncs financial and supply chain. ERP manages purchasing, demand forecasting, financial reporting. Inventory sends stock levels → ERP updates financials. ERP sends purchase orders → inventory tracks on-order. Batch sync (daily) for financial reconciliation.
        </p>
        <p>
          Marketplace sync (Amazon, eBay) publishes stock levels. Inventory → marketplace API (stock update). Marketplace order → inventory (reserve stock). Rate limits (marketplace API limits), sync frequency (real-time vs. hourly). Oversell risk (marketplace order while sync in progress).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/inventory-management/multi-warehouse.svg"
          alt="Multi-Warehouse Coordination"
          caption="Figure 3: Multi-Warehouse Coordination — Centralized tracking, allocation algorithm, and split shipment handling"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Inventory management design involves trade-offs between consistency, availability, complexity, and cost. Understanding these trade-offs enables informed decisions aligned with business requirements and operational capabilities.
        </p>

        <h3>Consistency: Strong vs. Eventual</h3>
        <p>
          Strong consistency (distributed locking, pessimistic updates). Pros: No oversell, accurate stock always. Cons: Reduced throughput (serialization), lock contention under load, single point of failure (lock service). Best for: High-value items, limited stock, flash sales.
        </p>
        <p>
          Eventual consistency (optimistic updates, async reconciliation). Pros: Higher throughput (no lock wait), better availability (no lock service dependency). Cons: Temporary oversell risk, reconciliation complexity (backorder, cancel, notify customer). Best for: High-volume retailers with reliable suppliers (can backorder quickly).
        </p>
        <p>
          Hybrid: strong consistency for reservation, eventual for sync. Reserve with locking (prevent oversell), sync to channels asynchronously (temporary inconsistency acceptable). Best for: Most production systems—prevent oversell at source, tolerate sync delays to channels.
        </p>

        <h3>Reservation: Early vs. Late</h3>
        <p>
          Early reservation (on cart add). Pros: Guaranteed availability (no checkout disappointment). Cons: Inventory locked up (abandoned carts block sales), cleanup required (timeout job). Best for: High-demand items, long checkout flows.
        </p>
        <p>
          Late reservation (on payment). Pros: Inventory available longer (higher conversion), no cleanup. Cons: Risk of selling out during checkout. Best for: High-volume retailers, short checkout flows.
        </p>
        <p>
          Hybrid: soft hold on checkout, hard hold on payment. Pros: Balance availability with commitment. Cons: Complexity (two states, timeout management). Best for: Most e-commerce retailers.
        </p>

        <h3>Warehouse: Centralized vs. Distributed</h3>
        <p>
          Centralized inventory (single system). Pros: Global visibility, optimal allocation, no sync needed. Cons: Single point of failure, latency for global queries. Best for: Most e-commerce retailers with multiple warehouses.
        </p>
        <p>
          Distributed inventory (per-warehouse systems). Pros: Warehouse autonomy, fault isolation, local optimization. Cons: Eventual consistency, complex reconciliation, sync overhead. Best for: Franchise models, independent warehouses.
        </p>
        <p>
          Hybrid: centralized tracking, distributed execution. Central system tracks global stock, warehouses execute locally. Best for: Most production systems—global visibility with local autonomy.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/inventory-management/consistency-comparison.svg"
          alt="Consistency Comparison"
          caption="Figure 4: Consistency Comparison — Strong vs. eventual consistency trade-offs for inventory management"
          width={1000}
          height={450}
        />

        <h3>Stock Display: Accurate vs. Optimistic</h3>
        <p>
          Accurate display (real-time available quantity). Pros: No disappointment (customer sees actual stock). Cons: May show &quot;out of stock&quot; when other warehouses have stock, lost sales. Best for: Single warehouse, limited stock items.
        </p>
        <p>
          Optimistic display (virtual pooling, show &quot;in stock&quot; if any warehouse has). Pros: Maximizes perceived availability, captures more sales. Cons: Split shipments (higher cost), complex fulfillment. Best for: Multi-warehouse retailers, customer experience focus.
        </p>
        <p>
          Hybrid: show &quot;in stock&quot; with delivery estimate (varies by warehouse). Pros: Transparent (customer knows delivery varies), balances availability with expectations. Cons: Complexity (per-warehouse ETA calculation). Best for: Most production systems.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement reservation with TTL:</strong> Soft hold on checkout, hard commit on payment. TTL for soft holds (15-30 minutes). Cleanup job releases expired reservations. Monitor timeout rate (abandonment indicator).
          </li>
          <li>
            <strong>Use optimistic locking:</strong> Version column for concurrency control. Update with version check. Retry on conflict with exponential backoff. Monitor conflict rate (high = oversell risk).
          </li>
          <li>
            <strong>Maintain safety stock:</strong> Buffer above expected demand. Reorder point = lead time demand + safety stock. Auto-generate purchase orders when below reorder point. Adjust safety stock based on demand variability.
          </li>
          <li>
            <strong>Implement multi-warehouse allocation:</strong> Algorithm considers availability, cost, speed. Single warehouse preferred (lower cost). Split shipment when necessary. Show customer options (ship together vs. as available).
          </li>
          <li>
            <strong>Sync inventory across channels:</strong> Event-driven sync (stock change → publish event → update channels). Rate limit marketplace API calls. Reconciliation job (periodic full sync to catch missed events).
          </li>
          <li>
            <strong>Handle flash sales:</strong> Pre-allocate inventory (reserve for sale). Queue orders (process sequentially). Rate limit per customer. Show &quot;selling fast&quot; indicators.
          </li>
          <li>
            <strong>Monitor inventory metrics:</strong> Stockout rate (lost sales). Turnover rate (how fast stock sells). Shrinkage rate (damage, theft). Reservation timeout rate (abandonment).
          </li>
          <li>
            <strong>Implement cycle counting:</strong> Regular physical counts (not just annual). Count high-value items frequently. Adjust system to match physical count. Investigate discrepancies (theft, damage, data entry errors).
          </li>
          <li>
            <strong>Plan for peak:</strong> Black Friday preparation (load testing, capacity planning). Pre-stock warehouses (before peak season). Temporary oversell buffer (absorb spikes). Customer communication (delays expected).
          </li>
          <li>
            <strong>Automate replenishment:</strong> Demand forecasting (seasonal, trends, promotions). Auto-generate purchase orders. Supplier integration (EDI, API). Track supplier performance (on-time delivery, quality).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No reservation timeout:</strong> Abandoned carts lock inventory forever. Solution: TTL on soft reservations, cleanup job, monitor timeout rate.
          </li>
          <li>
            <strong>No concurrency control:</strong> Concurrent orders oversell same stock. Solution: Optimistic locking (version check), distributed locking for high-demand items.
          </li>
          <li>
            <strong>No safety stock:</strong> Stockouts from demand variability. Solution: Safety stock based on demand variability, auto-replenishment.
          </li>
          <li>
            <strong>Poor multi-warehouse sync:</strong> Different stock levels across channels. Solution: Event-driven sync, reconciliation job, single source of truth.
          </li>
          <li>
            <strong>No flash sale preparation:</strong> Site crashes, massive oversell. Solution: Pre-allocate inventory, queue orders, rate limit, load testing.
          </li>
          <li>
            <strong>No cycle counting:</strong> System stock doesn&apos;t match physical. Solution: Regular cycle counts, adjust system, investigate discrepancies.
          </li>
          <li>
            <strong>No monitoring:</strong> Stockouts, oversells undetected. Solution: Monitor stockout rate, oversell rate, turnover rate. Alert on anomalies.
          </li>
          <li>
            <strong>Manual replenishment:</strong> Stockouts from forgotten orders. Solution: Auto-generate purchase orders, demand forecasting, supplier integration.
          </li>
          <li>
            <strong>No peak planning:</strong> Black Friday crashes system. Solution: Load testing, capacity planning, pre-stocking, temporary oversell buffer.
          </li>
          <li>
            <strong>No return processing:</strong> Returns not restocked, inventory inaccurate. Solution: Automated return workflow, inspection, restock (or write-off).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Amazon Inventory Management</h3>
        <p>
          Amazon inventory spans fulfillment centers worldwide. Real-time stock tracking per SKU per warehouse. Virtual pooling (show &quot;in stock&quot; if any warehouse has). Multi-warehouse allocation (nearest, fastest). Prime eligibility based on warehouse stock. FBA (Fulfillment by Amazon) for third-party sellers.
        </p>

        <h3 className="mt-6">Zara Fast Fashion Inventory</h3>
        <p>
          Zara inventory turns over weekly (new items constantly). Store-level inventory tracking (RFID per item). Automated replenishment (sales trigger restock). Transfer between stores (balance stock). Limited safety stock (fast fashion model). End-of-season clearance (make room for new).
        </p>

        <h3 className="mt-6">Walmart Omnichannel Inventory</h3>
        <p>
          Walmart inventory syncs online and in-store. Real-time store stock visibility (check nearby stores). BOPIS (buy online, pick up in-store). Ship from store (store as fulfillment center). Inventory pooling (online + store stock). Returns to store (online purchases).
        </p>

        <h3 className="mt-6">Shopify Multi-Location Inventory</h3>
        <p>
          Shopify inventory for merchants with multiple locations. Per-location stock tracking. Allocation rules (fulfill from nearest, or specific location). Transfer between locations. Low stock alerts. Integration with fulfillment services (3PL, Amazon FBA).
        </p>

        <h3 className="mt-6">Nike Flash Sale Inventory</h3>
        <p>
          Nike SNKRS app handles high-demand sneaker releases. Pre-allocate inventory (reserve for release). Queue system (random selection, not first-come). Rate limit per customer (one pair per release). Inventory deduction on payment (not reservation). Sell-out in seconds, no oversell.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent overselling during flash sales?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Pre-allocate inventory (reserve for sale, separate from regular stock). Queue orders (process sequentially, not first-come). Rate limit per customer (prevent bots). Distributed locking (Redis SETNX) for stock deduction. Optimistic locking with retry (version check). Oversell buffer (small buffer, backorder if exceeded). Show &quot;selling fast&quot; to manage expectations.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle inventory sync across multiple channels?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Event-driven architecture (stock change → publish event → update all channels). Rate limit marketplace API calls (Amazon, eBay limits). Reconciliation job (periodic full sync to catch missed events). Single source of truth (central inventory system). Handle conflicts (marketplace order while sync in progress → oversell, backorder).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you allocate orders to multiple warehouses?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Algorithm considers: inventory availability (which warehouses have items), shipping cost (distance, carrier rates), delivery speed (which warehouse fastest), warehouse capacity (load balance). Single warehouse preferred (lower cost). Split shipment when necessary (items unavailable at single warehouse). Customer option: ship together (wait) vs. ship as available (multiple shipments).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle inventory returns?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Return initiation (customer requests, RMA generated). Receive at warehouse (scan, inspect). Condition code (like_new, damaged, defective). Restock like_new items (available → sell). Write-off damaged/defective (available → 0, loss recorded). Refund triggered based on condition. Inventory updated immediately on receive (not on refund).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement safety stock and reorder points?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Safety stock = buffer above expected demand (based on demand variability, lead time variability). Reorder point = lead time demand + safety stock. When available + on-order &lt; reorder point → auto-generate purchase order. EOQ (economic order quantity) balances ordering cost vs. holding cost. Adjust safety stock based on season, promotions, supplier reliability.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent inventory updates?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Optimistic locking (version column, update with version check). If affected rows = 0, concurrent modification detected → retry with latest state. For high-demand items, distributed locking (Redis SETNX) prevents concurrent updates. Queue orders for sequential processing. Monitor conflict rate (high = oversell risk, need stronger locking).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.shopify.com/enterprise/inventory-management"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shopify — Inventory Management Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.investopedia.com/terms/s/safetystock.asp"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Investopedia — Safety Stock Definition
            </a>
          </li>
          <li>
            <a
              href="https://www.netstock.com/blog/inventory-management-best-practices/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netstock — Inventory Management Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://aws.amazon.com/solutions/implementations/inventory-management/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — Inventory Management Solution
            </a>
          </li>
          <li>
            <a
              href="https://www.gartner.com/en/supply-chain/insights/inventory-management"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gartner — Inventory Management Insights
            </a>
          </li>
          <li>
            <a
              href="https://www.fishbowlinventory.com/blog/inventory-management-101"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fishbowl — Inventory Management 101
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
