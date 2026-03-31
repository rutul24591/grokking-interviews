"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-order-management",
  title: "Order Management Service",
  description:
    "Comprehensive guide to implementing order management services covering order lifecycle, state machine integration, inventory coordination, fulfillment workflows, multi-warehouse support, and distributed order orchestration at scale.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "order-management-service",
  version: "extensive",
  wordCount: 6500,
  readingTime: 26,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "orders",
    "management",
    "backend",
    "fulfillment",
    "inventory",
    "state-machine",
  ],
  relatedTopics: ["state-machine-implementation", "inventory-management", "checkout-flow", "fulfillment-service"],
};

export default function OrderManagementServiceArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Order Management Service (OMS) orchestrates the complete order lifecycle from creation through fulfillment, managing state transitions and integrating with inventory, payment, shipping, and customer notification systems. The OMS is the central hub of e-commerce operations—receiving orders from multiple channels (web, mobile, marketplace, in-store), coordinating fulfillment across warehouses and stores, and providing visibility to customers and support teams. For staff and principal engineers, OMS architecture involves distributed systems challenges (consistency across services, eventual consistency, failure handling) and business complexity (multi-warehouse fulfillment, split shipments, returns, exchanges).
        </p>
        <p>
          The complexity of order management extends beyond simple CRUD operations. Orders have complex state machines (pending → confirmed → processing → shipped → delivered) with guards (payment authorized, inventory available) and side effects (send email, update inventory, notify warehouse). Orders may split across warehouses (items from different locations), ship in multiple packages (partial fulfillment), or merge (multiple orders to same address). Returns and exchanges create reverse logistics flows (delivered → return_requested → return_received → refunded). The OMS must handle high volume (Black Friday spikes), provide real-time visibility (order tracking), and maintain data integrity (no lost orders, no duplicate shipments).
        </p>
        <p>
          For staff and principal engineers, OMS architecture involves integration patterns. Event-driven architecture enables loose coupling—order created event triggers inventory reservation, payment authorization, and warehouse notification. Saga pattern coordinates distributed transactions (reserve inventory, authorize payment, create shipment) with compensating transactions on failure (release inventory, void payment). CQRS separates write model (order state machine) from read model (order history, customer timeline). The system must support multi-tenant scenarios (marketplace sellers, B2B customers with custom workflows) and international requirements (cross-border shipping, customs, duties, taxes).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Order Lifecycle States</h3>
        <p>
          Order states represent distinct phases in order lifecycle. Pending: order created, awaiting payment authorization. Inventory may be reserved (soft hold) or not, depending on business model. Confirmed: payment authorized, order ready for fulfillment. Inventory committed (hard allocation). Processing: order being prepared for shipment (picking, packing, labeling). Shipped: package handed to carrier, tracking number available. Delivered: package confirmed delivered (carrier confirmation or customer confirmation). Terminal states: Cancelled (user or system cancelled before shipment), Returned (customer returned, refund processed).
        </p>
        <p>
          State transitions are guarded. Pending → Confirmed requires payment authorization success. Confirmed → Processing requires inventory availability (all items in stock). Processing → Shipped requires carrier scan confirmation. Shipped → Delivered requires carrier delivery confirmation or timeout (7 days after shipped). Guards prevent invalid transitions (can&apos;t ship cancelled order, can&apos;t cancel shipped order). Failed guards return specific errors (payment_declined, inventory_unavailable) for user feedback.
        </p>
        <p>
          State metadata enriches order information. State entered timestamp (for SLA monitoring—orders must ship within 24 hours). State entered by (user, system, webhook). Exit reason (user_cancelled, payment_failed, inventory_unavailable, timeout). Metadata enables analytics (average time per state, cancellation reasons, fulfillment SLA compliance) and debugging (trace order history, identify bottlenecks).
        </p>

        <h3 className="mt-6">Order Structure</h3>
        <p>
          Order header contains order-level information. Order ID (UUID or sequential with check digit). Customer ID (or guest email). Shipping address (normalized, validated). Billing address (may differ from shipping). Payment method (tokenized, last 4 digits). Order totals (subtotal, shipping, tax, discounts, grand total). Currency (for international orders). Channel (web, mobile, marketplace, in-store). Created timestamp, updated timestamp.
        </p>
        <p>
          Order line items represent individual products. Line item ID, product ID, variant ID (size, color, etc.). Quantity ordered. Unit price (at time of order—price may change later). Line total (quantity × unit price). Discounts applied (promo code, automatic discount). Fulfillment status (unfulfilled, partially_fulfilled, fulfilled). Warehouse assignment (which warehouse will fulfill). Tracking numbers (may be multiple for split shipments).
        </p>
        <p>
          Order adjustments modify order totals. Shipping adjustments (free shipping promo, shipping discount). Tax adjustments (tax exemption, tax recalculation). Discount adjustments (promo codes, automatic discounts, loyalty points). Refund adjustments (partial refund, return processing). Each adjustment has type, amount, reason, timestamp. Adjustments are immutable—new adjustment reverses previous (don&apos;t modify existing adjustment).
        </p>

        <h3 className="mt-6">Fulfillment Coordination</h3>
        <p>
          Warehouse assignment determines which warehouse fulfills each line item. Single warehouse fulfillment: all items from one warehouse (simpler, lower shipping cost). Multi-warehouse fulfillment: items from multiple warehouses (faster delivery, higher shipping cost). Assignment algorithm considers: inventory availability (which warehouses have items), shipping cost (distance to customer, carrier rates), delivery speed (which warehouse can deliver fastest), warehouse capacity (load balancing across warehouses).
        </p>
        <p>
          Shipment creation groups line items for shipping. Single shipment: all items in one box (lower shipping cost). Multiple shipments: items ship separately (different warehouses, different availability dates). Shipment contains: line items, packaging (box size, weight), shipping method (ground, 2-day, overnight), tracking number, carrier, estimated delivery date. Shipment status: created, picked, packed, shipped, in_transit, delivered.
        </p>
        <p>
          Carrier integration automates shipping workflow. Rate shopping: query multiple carriers (UPS, FedEx, USPS) for rates, select best (cheapest, fastest, customer preference). Label generation: create shipping label with barcode, customs forms (international). Tracking sync: poll carrier API for tracking updates, update order status. Exception handling: delivery failed, address correction, package damaged—notify customer, create replacement.
        </p>

        <h3 className="mt-6">Returns and Exchanges</h3>
        <p>
          Return initiation starts return workflow. Customer requests return (online self-service, customer support). Return reason (defective, wrong item, doesn&apos;t fit, changed mind). Return items (which line items, quantity). Return method (mail return, in-store return, pickup). Return authorization (RMA) number generated. Return label emailed (prepaid for defective/wrong item, customer-paid for changed mind).
        </p>
        <p>
          Return processing handles received returns. Warehouse receives return, inspects condition. Condition codes: like_new (resellable), damaged (liquidate), defective (return to vendor). Refund triggered based on condition (full refund for like_new, partial for damaged). Inventory updated (resellable items returned to stock, damaged items written off). Notification sent to customer (refund processed, timeline for funds to appear).
        </p>
        <p>
          Exchange workflow replaces returned items. Exchange for same item (different size/color): create replacement order, ship immediately (before return received—trust model). Exchange for different item: price difference handled (charge additional or refund difference). Exchange inventory reserved (prevent selling item being exchanged). Exchange shipping free (customer shouldn&apos;t pay twice).
        </p>

        <h3 className="mt-6">Order Visibility and Notifications</h3>
        <p>
          Order status page provides customer visibility. Order summary (items, quantities, prices). Fulfillment status (per line item or shipment). Tracking information (carrier, tracking number, delivery estimate). Return/exchange options (if eligible). Support contact (chat, phone, email). Status page accessible via account (logged-in) or guest lookup (order number + email).
        </p>
        <p>
          Notification triggers keep customer informed. Order confirmation (immediately after order). Payment confirmation (after successful authorization). Shipment notification (when shipped, includes tracking). Delivery notification (when delivered). Delay notification (if shipment delayed, new ETA). Return confirmation (return received, refund processed). Notification channels: email (primary), SMS (opt-in, for time-sensitive), push (mobile app users).
        </p>
        <p>
          Support tools enable customer service. Order search (by order ID, customer, email, phone). Order timeline (all state changes, notes). Manual actions (cancel order, issue refund, create replacement). Notes and tags (customer preferences, issues, VIP status). Integration with CRM (customer history, preferences, past issues). Audit trail (who did what, when—for compliance and debugging).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Order management architecture spans order ingestion, state machine orchestration, fulfillment coordination, and external integrations. Order ingestion receives orders from multiple channels (web, mobile, marketplace, in-store). State machine manages order lifecycle (state transitions, guards, actions). Fulfillment coordination assigns warehouses, creates shipments, integrates with carriers. External integrations handle payment, inventory, shipping, and notifications.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/order-management/order-management-architecture.svg"
          alt="Order Management Architecture"
          caption="Figure 1: Order Management Architecture — Order ingestion, state machine, fulfillment coordination, and external integrations"
          width={1000}
          height={500}
        />

        <h3>Order Ingestion</h3>
        <p>
          Multi-channel order ingestion receives orders from various sources. Web orders (checkout flow) submit order via API. Mobile orders (iOS/Android app) submit via mobile API. Marketplace orders (Amazon, eBay) sync via marketplace API (webhook or polling). In-store orders (POS system) sync via store API. Each channel has different data format—normalization layer converts to canonical order format.
        </p>
        <p>
          Order validation ensures order integrity before acceptance. Required fields (customer info, shipping address, line items). Address validation (Loqate, SmartyStreets)—correct typos, ensure deliverable. Inventory check (items available, prevent overselling). Price validation (prices match current prices, promo codes valid). Fraud check (risk score, velocity checks, address mismatch). Invalid orders rejected with specific errors (invalid_address, item_unavailable, payment_declined).
        </p>
        <p>
          Order deduplication prevents duplicate orders. Idempotency key (generated client-side) ensures same order not created twice. Duplicate detection (same customer, same items, same address, within 5 minutes)—flag for review. Cart-to-order conversion (cart ID → order ID) prevents double-submission. Payment idempotency (same payment not charged twice) handled by payment service.
        </p>

        <h3 className="mt-6">State Machine Orchestration</h3>
        <p>
          Order state machine manages lifecycle transitions. States: pending, confirmed, processing, shipped, delivered, cancelled, returned. Transitions triggered by events (payment_authorized, inventory_reserved, shipment_created, delivery_confirmed). Guards validate preconditions (payment authorized before confirm, inventory available before process). Actions execute side effects (send email, update inventory, notify warehouse).
        </p>
        <p>
          State persistence stores order state and history. Current state table: order_id, state, version, updated_at. Optimistic locking (version column) prevents concurrent modifications. History table: order_id, from_state, to_state, event, user, timestamp, metadata. Event store (event sourcing): order events appended (OrderCreated, PaymentAuthorized, OrderShipped). Projection rebuilds current state from events.
        </p>
        <p>
          State machine integration coordinates with external services. Payment service: authorize on pending → confirmed transition. Inventory service: reserve on pending, commit on confirmed, release on cancelled. Fulfillment service: notify on confirmed → processing transition. Notification service: send email on each state change. Integration is event-driven—state change publishes event, subscribers react.
        </p>

        <h3 className="mt-6">Fulfillment Coordination</h3>
        <p>
          Warehouse assignment allocates line items to warehouses. Algorithm considers: inventory availability (which warehouses have items), shipping cost (distance, carrier rates), delivery speed (which warehouse fastest), warehouse capacity (load balance). Single warehouse assignment (all items from one warehouse) preferred for cost. Multi-warehouse assignment (split shipment) when items unavailable at single warehouse.
        </p>
        <p>
          Shipment creation groups assigned items for shipping. Pick list generated (items to pick from warehouse shelves). Pack station assigns box size (based on item dimensions). Shipping label generated (carrier API, rate shopping). Tracking number captured, order updated. Shipment notification sent to customer (tracking number, delivery estimate).
        </p>
        <p>
          Carrier integration automates shipping workflow. Rate shopping API queries carriers (UPS, FedEx, USPS) for rates. Label generation API creates shipping labels, customs forms. Tracking API polls for updates (in_transit, out_for_delivery, delivered). Exception API handles issues (delivery failed, address correction, package damaged). Webhooks receive real-time updates (push vs. poll).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/order-management/order-lifecycle.svg"
          alt="Order Lifecycle"
          caption="Figure 2: Order Lifecycle — States, transitions, guards, and actions from creation to delivery"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Integration Patterns</h3>
        <p>
          Event-driven integration decouples services. Order service publishes events (OrderCreated, OrderShipped, OrderDelivered). Inventory service subscribes (reserve inventory, commit inventory). Payment service subscribes (authorize payment, capture payment). Notification service subscribes (send confirmation, send tracking). Event schema versioning enables evolution (v1 vs. v2 events).
        </p>
        <p>
          Saga pattern coordinates distributed transactions. Order creation saga: reserve inventory → authorize payment → create order. If payment fails: release inventory (compensating transaction). If inventory unavailable: reject order (no payment attempted). Shipment saga: create shipment → generate label → notify carrier. If label generation fails: cancel shipment, retry or alert.
        </p>
        <p>
          API composition aggregates data from multiple services. Order detail page needs: order data (order service), customer data (customer service), product data (product service), tracking data (shipping service). API gateway composes responses (parallel calls, aggregate results). CQRS read model pre-aggregates data (order history view) for fast queries.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/order-management/fulfillment-workflow.svg"
          alt="Fulfillment Workflow"
          caption="Figure 3: Fulfillment Workflow — Warehouse assignment, shipment creation, and carrier integration"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Order management design involves trade-offs between consistency, availability, complexity, and cost. Understanding these trade-offs enables informed decisions aligned with business requirements and operational capabilities.
        </p>

        <h3>Inventory Reservation: Early vs. Late</h3>
        <p>
          Early reservation (on cart add or checkout start). Pros: Guaranteed availability (no disappointment at payment). Cons: Inventory locked up (abandoned carts block sales), requires cleanup (release after timeout). Best for: High-demand items (limited stock, flash sales), long checkout flows (multi-step, account creation).
        </p>
        <p>
          Late reservation (on payment authorization). Pros: Inventory available longer (higher conversion), no cleanup needed. Cons: Risk of selling out during checkout (customer disappointment), payment may succeed but order can&apos;t fulfill. Best for: High-volume retailers (low stockout risk), short checkout flows (one-click, saved payment).
        </p>
        <p>
          Hybrid: soft hold on checkout start, hard hold on payment. Soft hold: visible as &quot;low stock&quot; to other customers, released on timeout. Hard hold: committed inventory, released on payment failure. Best for: Most e-commerce retailers—balance availability with commitment.
        </p>

        <h3>Fulfillment: Single vs. Multi-Warehouse</h3>
        <p>
          Single warehouse fulfillment (all items from one warehouse). Pros: Lower shipping cost (one box), simpler operations (one shipment to track). Cons: May be slower (warehouse far from customer), may be unavailable (items not in stock at single warehouse). Best for: Small retailers (single warehouse), cost-sensitive customers.
        </p>
        <p>
          Multi-warehouse fulfillment (items from multiple warehouses). Pros: Faster delivery (warehouse near customer), higher availability (items sourced from multiple locations). Cons: Higher shipping cost (multiple boxes), complex tracking (multiple shipments). Best for: Large retailers (multiple warehouses), speed-sensitive customers.
        </p>
        <p>
          Smart assignment (algorithm selects optimal). Pros: Balances cost and speed, maximizes availability. Cons: Algorithm complexity, customer confusion (why multiple boxes?). Best for: Most production systems—show customer option (ship together vs. ship as available).
        </p>

        <h3>State Persistence: Current State vs. Event Sourcing</h3>
        <p>
          Current state persistence (store only current state). Pros: Simple, minimal storage, fast queries. Cons: No history (can&apos;t debug), can&apos;t replay (can&apos;t rebuild projections). Best for: Simple order flows, no compliance requirements.
        </p>
        <p>
          Event sourcing (store all state changes as events). Pros: Full audit trail, replay capability, multiple projections (order state, customer timeline, analytics). Cons: Complex implementation, storage growth, query complexity. Best for: Compliance-required (financial, healthcare), complex workflows, debugging needs.
        </p>
        <p>
          Hybrid (current state + event log). Pros: Fast current state queries, audit trail available. Cons: Duplication (state stored twice), consistency between state and events. Best for: Most production systems—fast queries with audit capability.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/order-management/integration-patterns.svg"
          alt="Integration Patterns"
          caption="Figure 4: Integration Patterns — Event-driven, saga, and API composition for distributed order management"
          width={1000}
          height={450}
        />

        <h3>Return Processing: Automated vs. Manual</h3>
        <p>
          Automated returns (self-service, instant approval). Pros: Better customer experience (instant, no waiting), lower support cost (no manual review). Cons: Higher abuse risk (return empty box, used items), higher refund cost (refunds before inspection). Best for: Trusted customers (VIP, long history), low-risk items (non-electronics).
        </p>
        <p>
          Manual returns (support review, approval required). Pros: Lower abuse (inspect before refund), policy enforcement (check return window, item condition). Cons: Slower (customer waits), higher support cost (manual review). Best for: High-risk items (electronics, luxury), new customers, high return rate customers.
        </p>
        <p>
          Hybrid (automated for eligible, manual for exceptions). Pros: Balances experience with risk. Cons: Complexity (eligibility rules), customer confusion (why some approved instantly, some not). Best for: Most retailers—automate low-risk, manual review high-risk.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Design idempotent order creation:</strong> Idempotency key prevents duplicate orders. Same key returns same order (not new order). Key persists across retries. Client generates UUID, includes in header.
          </li>
          <li>
            <strong>Implement state machine with guards:</strong> Explicit states and transitions. Guards validate preconditions (payment before confirm). Actions execute side effects (email, inventory). Log all transitions for audit.
          </li>
          <li>
            <strong>Use event-driven integration:</strong> Publish order events (created, shipped, delivered). Subscribers react (inventory, payment, notification). Loose coupling—services independent. Event schema versioning for evolution.
          </li>
          <li>
            <strong>Implement saga for distributed transactions:</strong> Coordinate inventory, payment, fulfillment. Compensating transactions on failure (release inventory, void payment). Timeout handling (abandon if payment timeout).
          </li>
          <li>
            <strong>Support multi-warehouse fulfillment:</strong> Smart warehouse assignment (availability, cost, speed). Split shipments when needed. Show customer options (ship together vs. as available). Track per-shipment.
          </li>
          <li>
            <strong>Automate carrier integration:</strong> Rate shopping (best carrier, best price). Label generation (automated, no manual). Tracking sync (real-time updates). Exception handling (delivery issues, address corrections).
          </li>
          <li>
            <strong>Provide order visibility:</strong> Customer-facing status page (items, tracking, ETA). Proactive notifications (shipped, delivered, delayed). Support tools (search, timeline, manual actions). Audit trail (who did what, when).
          </li>
          <li>
            <strong>Handle returns gracefully:</strong> Self-service return initiation. Automated approval for low-risk. Clear return instructions (label, drop-off). Fast refund processing (on receipt or ship).
          </li>
          <li>
            <strong>Monitor order metrics:</strong> Order volume (per channel, per state). Fulfillment SLA (time to ship, time to deliver). Cancellation rate (reasons, trends). Return rate (items, reasons, abuse detection).
          </li>
          <li>
            <strong>Plan for scale:</strong> Black Friday preparation (load testing, capacity planning). Queue orders for async processing. Database sharding (by customer or date). Caching for order lookup.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No idempotency:</strong> Network retries create duplicate orders. Solution: Idempotency keys, duplicate detection, same key returns same order.
          </li>
          <li>
            <strong>Weak state machine:</strong> Invalid transitions allowed (ship cancelled order). Solution: Explicit states and transitions, guards validate preconditions.
          </li>
          <li>
            <strong>Tight coupling:</strong> Order service calls inventory, payment, fulfillment synchronously. Solution: Event-driven integration, async processing, saga for coordination.
          </li>
          <li>
            <strong>No inventory coordination:</strong> Overselling (sell items not in stock). Solution: Reserve inventory on order, commit on payment, release on cancel.
          </li>
          <li>
            <strong>Manual carrier integration:</strong> Manual label generation, tracking updates. Solution: Automated carrier API integration, rate shopping, tracking sync.
          </li>
          <li>
            <strong>Poor return experience:</strong> Manual return process, slow refunds. Solution: Self-service returns, automated approval, fast refund processing.
          </li>
          <li>
            <strong>No order visibility:</strong> Customer doesn&apos;t know order status. Solution: Status page, proactive notifications, support tools.
          </li>
          <li>
            <strong>Single warehouse dependency:</strong> One warehouse fails, all orders stop. Solution: Multi-warehouse, failover, load balancing.
          </li>
          <li>
            <strong>No monitoring:</strong> Order issues undetected. Solution: Monitor order volume, state distribution, SLA compliance. Alert on anomalies.
          </li>
          <li>
            <strong>No scale planning:</strong> Black Friday crashes system. Solution: Load testing, capacity planning, async processing, database sharding.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Amazon Order Management</h3>
        <p>
          Amazon OMS handles millions of orders daily. Multi-warehouse fulfillment (items from nearest warehouse). Prime eligibility (2-day, 1-day, same-day). Split shipments (items from multiple warehouses). Real-time tracking (carrier integration). Automated returns (self-service, instant approval for eligible). Event sourcing for audit trail.
        </p>

        <h3 className="mt-6">Shopify Order Management</h3>
        <p>
          Shopify OMS serves millions of merchants. Multi-channel orders (web, mobile, marketplace, POS). Inventory sync across channels. Fulfillment network (Shopify Fulfillment Network). Carrier integration (rate shopping, labels, tracking). Return management (self-service, rules-based). App ecosystem (third-party fulfillment, returns).
        </p>

        <h3 className="mt-6">Walmart Omnichannel Orders</h3>
        <p>
          Walmart OMS unifies online and in-store. Buy online, pick up in-store (BOPIS). Ship from store (store as fulfillment center). Inventory visibility (real-time stock levels). Order routing (nearest store with inventory). Return to store (online orders returned in-store). Unified customer view (online + in-store history).
        </p>

        <h3 className="mt-6">Zara Fast Fashion Fulfillment</h3>
        <p>
          Zara OMS supports fast fashion model. Rapid inventory turnover (new items weekly). Store replenishment (automated based on sales). Online-to-store integration (check store stock, reserve). Express fulfillment (48-hour delivery in markets). Reverse logistics (unsold items returned to distribution).
        </p>

        <h3 className="mt-6">eBay Marketplace Orders</h3>
        <p>
          eBay OMS handles marketplace model. Multiple sellers (each with own fulfillment). Seller-shipped (seller handles fulfillment). eBay fulfillment (eBay handles for seller). Buyer protection (escrow payment until delivery). Dispute resolution (item not received, not as described). Cross-border (international shipping, customs).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent overselling in order management?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Inventory reservation on order creation (soft hold). Hard commit on payment authorization. Release on payment failure or timeout. Distributed locking prevents concurrent oversell (Redis SETNX). Optimistic locking on inventory update (version check). Backorder handling (allow oversell with customer notification, estimated restock date).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle split shipments?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Line item-level fulfillment status (unfulfilled, fulfilled). Shipment entity groups line items (one shipment per warehouse). Tracking per shipment (not per order). Customer notification per shipment (tracking number, ETA). Order status page shows all shipments. Invoice per shipment (or consolidated). Shipping cost calculation (sum of shipment costs).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you coordinate order state across distributed services?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Event-driven architecture. Order service publishes state change events (OrderConfirmed, OrderShipped). Inventory service subscribes (commit inventory). Payment service subscribes (capture payment). Notification service subscribes (send email). Saga pattern for distributed transactions (compensating transactions on failure). Eventual consistency—services may have temporary state divergence.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle order modifications after placement?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Modification window (before shipment only). Add items: create new order or modify existing (if not shipped). Remove items: refund line item, adjust inventory. Change address: validate new address, update shipment. Change payment: void original, authorize new. After shipment: can&apos;t modify, must return and reorder. All modifications logged (audit trail).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize warehouse assignment?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Algorithm considers: inventory availability (which warehouses have items), shipping cost (distance, carrier rates), delivery speed (which warehouse fastest), warehouse capacity (load balance). Single warehouse preferred (lower cost). Multi-warehouse when necessary (items unavailable at single warehouse). Customer option: ship together (wait for all items) vs. ship as available (multiple shipments).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle returns at scale?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Self-service return portal (customer initiates, prints label). Automated approval (rules-based: return window, item eligibility, customer history). RMA number generation (track return). Return label (prepaid for defective, customer-paid for changed mind). Warehouse processing (receive, inspect, condition code). Refund automation (full for like_new, partial for damaged). Inventory update (resellable → stock, damaged → write-off).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.shopify.com/enterprise/order-management"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shopify — Order Management Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://docs.aws.amazon.com/solutions/latest/order-management-workshop/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — Order Management Workshop
            </a>
          </li>
          <li>
            <a
              href="https://microservices.io/patterns/data/saga.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microservices.io — Saga Pattern
            </a>
          </li>
          <li>
            <a
              href="https://martinfowler.com/articles/event-sourcing.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Fowler — Event Sourcing
            </a>
          </li>
          <li>
            <a
              href="https://www.shipstation.com/order-management-system/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ShipStation — Order Management Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.gartner.com/en/supply-chain/insights/order-management"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gartner — Order Management Insights
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
