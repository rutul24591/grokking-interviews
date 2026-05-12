"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-cart-checkout-concurrency",
  title: "Design Cart + Checkout at Scale with Concurrency",
  description:
    "Architecture for cart and checkout at scale: cart service with optimistic locking for concurrent updates, inventory reservation with Redis atomic operations, price snapshot at checkout, idempotent payment processing, saga pattern for distributed checkout transaction, flash sale concurrency handling, checkout session state machine, and rollback on payment failure.",
  category: "high-level-design",
  subcategory: "ecommerce-marketplace",
  slug: "cart-checkout-concurrency",
  wordCount: 5200,
  readingTime: 32,
  lastUpdated: "2026-05-11",
  tags: ["hld", "ecommerce", "cart", "checkout", "concurrency", "saga", "inventory", "idempotency"],
  relatedTopics: ["amazon-flipkart-frontend", "inventory-aware-ui"],
};

export default function CartCheckoutConcurrencyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Cart and checkout is where the money is — and where the hardest concurrency problems in e-commerce live. Three scenarios create race conditions that naive implementations lose money on. First, inventory overselling: if 3 users simultaneously try to purchase the last unit of a product, all three might read "1 in stock" and proceed to checkout. Without atomic reservation, all three orders complete and the warehouse ships one package while two customers receive cancellation emails. Second, price race conditions: if a flash sale starts and drops a product's price by 50% at the exact moment a user is on the checkout confirmation page, should they get the old price (locked in at cart-add time) or the new price? Most platforms snapshot the price at checkout-initiation time — once the user sees the checkout price, that price is locked for a 15-minute session. Third, concurrent cart updates: if the user opens two browser tabs and adds items in both simultaneously, the cart must serialize the updates correctly without silent data loss.</p>
        <p>The checkout process is also a distributed transaction: it spans cart validation (read inventory), inventory reservation (write inventory), payment processing (external API call), order creation (write orders DB), and inventory deduction (write inventory again). Any step can fail. The system must ensure that a partial completion leaves the customer and the business in a consistent state — paid but no order created is worse than no payment and no order.</p>
        <p><strong>Explicit scope:</strong> Cart service, checkout session, inventory reservation, payment integration with saga pattern. Not in scope: payment gateway implementation, fraud detection, or warehouse management.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Cart:</strong> Add/update/remove items, persist cart across sessions (logged-in user) and devices, merge guest cart with user cart on login, apply coupon codes, show estimated delivery date and total price with tax.</li>
          <li><strong>Checkout initiation:</strong> Validate all items are in stock, snapshot current prices, lock prices for 15 minutes (checkout session), present order summary with final price breakdown, select delivery address and payment method.</li>
          <li><strong>Inventory reservation:</strong> Atomically reserve inventory for items in the checkout session. Reserved inventory is unavailable to other buyers for the 15-minute session duration. If the session expires without payment, reservation is released.</li>
          <li><strong>Payment:</strong> Process payment via external gateway. If payment succeeds, confirm order and deduct inventory. If payment fails, release inventory reservation and return to cart. Idempotent: retrying a failed payment request should not double-charge.</li>
          <li><strong>Flash sale handling:</strong> During flash sales, checkout must handle 50K+ concurrent requests for limited-quantity items. Queue-based throttling must prevent overselling without crashing the service.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Cart update latency:</strong> P99 &lt; 100ms for add-to-cart. Cart reads are served from Redis cache (&lt;10ms).</li>
          <li><strong>Checkout initiation:</strong> P99 &lt; 500ms (includes price snapshot, inventory check, session creation).</li>
          <li><strong>Zero overselling:</strong> Under any concurrency level, inventory must never go below zero. This is a hard correctness requirement — a single oversell event is a business incident.</li>
          <li><strong>Idempotency:</strong> All checkout and payment operations are idempotent. Retrying the same request (network timeout, double submit) must produce exactly one order and one charge.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The system decomposes into three services. The Cart Service manages the user's item selection state (Redis-backed for speed, PostgreSQL-backed for durability). The Checkout Service owns the checkout session lifecycle (price snapshot → inventory reservation → payment → order creation) implemented as a saga with compensating transactions at each step. The Inventory Service manages stock levels using Redis atomic operations (DECRBY) as the hot-path reservation layer, backed by PostgreSQL as the durable inventory ledger. The three services communicate via synchronous REST for user-facing operations (where latency matters) and Kafka events for eventual-consistency operations (order confirmation emails, analytics, warehouse notification).</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/cart-checkout-concurrency.svg"
          alt="Cart and checkout at scale architecture showing cart service (Redis hash per user cart TTL 30d; PostgreSQL durable backup; add-to-cart optimistic locking version field; guest cart UUID cookie merge on login; coupon validation service; P99 <100ms), checkout session state machine (INITIATED price_snapshot created inventory_reserved payment_processing payment_succeeded order_created COMPLETED or FAILED with compensating transactions at each step; session TTL 15min Redis; price locked at INITIATED), inventory reservation (Redis DECRBY atomic no oversell; WATCH/MULTI/EXEC for concurrent reservation; reservation key reserved:{skuId} TTL 15min; on session expiry INCRBY release; PostgreSQL inventory_ledger durable write after payment confirmed), payment saga (idempotency_key = checkoutSessionId+attempt; POST /payment retry safe; payment gateway webhook confirms async; on success → create order → deduct inventory confirmed; on failure → INCRBY release reservation → notify user retry), flash sale concurrency (token bucket rate limiter per SKU; queue-based: checkout requests enter Redis sorted set by timestamp; worker dequeues and processes serially per SKU; user sees position in queue; fair ordering FIFO), cart merge on login (guest cartId → user account cart; UNION strategy: user item quantity takes priority if conflict; implemented as Redis ZUNIONSTORE; atomic swap old guest key → user key), order confirmation saga (Kafka order-created event → warehouse notification → email confirmation → analytics → loyalty points; each consumer idempotent; retry with backoff)."
          caption="Cart (Redis hash + PostgreSQL backup, optimistic locking), checkout session state machine (price snapshot → inventory reservation → payment → order), atomic Redis DECRBY for zero-oversell inventory, payment saga with idempotency key and compensating transactions, flash sale queue-based throttling, and cart merge on login"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Cart Service and Concurrent Updates</h3>
        <p>Each user&apos;s cart is stored as a Redis Hash: HSET cart:{"{userId}"} {"{skuId}"} {"{quantity,addedAt,priceAtAdd}"} with a 30-day TTL. Redis Hash operations are atomic at the key level, so HSET cart:{"{userId}"} sku123 3 (setting quantity to 3) is safe against concurrent updates from multiple devices. However, &quot;add N to existing quantity&quot; (HINCRBY cart:{"{userId}"} sku123 1) is atomic at the operation level, two concurrent HINCRBY calls will correctly add their quantities without racing. The cart is also written to PostgreSQL asynchronously (via a background job that syncs Redis to PostgreSQL every 60 seconds) for durability. If Redis loses the cart (eviction or failure), the PostgreSQL copy is loaded on the next cart read.</p>
        <p>Guest-to-user cart merge: when a guest user adds items to their cart (stored under cart:{"{guestId}"}) and then logs in, the guest cart must be merged with any existing user cart. The merge strategy: for items in both carts, the user&apos;s existing quantity takes priority (the user may have intentionally set a quantity). For items only in the guest cart, they are added to the user cart. The merge is implemented as a Redis Lua script (atomic): SCAN the guest cart, MERGE into user cart with the priority rule, DELETE the guest cart key. Lua scripts in Redis execute atomically (no interleaving with other commands), preventing a race where a concurrent update to the guest cart during the merge is lost.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Checkout Session State Machine</h3>
        <p>The checkout session progresses through states: INITIATED → PRICE_SNAPSHOTTED → INVENTORY_RESERVED → PAYMENT_PROCESSING → PAYMENT_SUCCEEDED → ORDER_CREATED → COMPLETED. Each state transition is a checkpoint written to PostgreSQL. If the process fails at any state, a compensating transaction restores consistency. INITIATED: checkout session created with a UUID, TTL 15 minutes. A background job runs every minute to find sessions with TTL elapsed and runs their compensating transactions (releasing inventory reservations). PRICE_SNAPSHOTTED: the current prices of all items in the session are read from the Product Service and stored in the session record. These prices are immutable for the session lifetime — even if the catalog price changes, the user sees the snapshotted price. INVENTORY_RESERVED: for each item, the Inventory Service atomically decrements the available stock in Redis (DECRBY). If any item's DECRBY would result in a negative value, the entire reservation is aborted (WATCH/MULTI/EXEC or Lua script) and the user is shown an "item is out of stock" error. PAYMENT_PROCESSING: the Payment Service submits the charge to the external gateway with an idempotency key (checkout_session_id + attempt_number). The gateway processes the charge asynchronously; the frontend polls for result or receives a webhook.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Atomic Inventory Reservation</h3>
        <p>The core of zero-oversell is the atomic inventory decrement. The naive approach (read stock → check if sufficient → decrement) has a TOCTOU (time-of-check to time-of-use) race: two concurrent checkouts can both read &quot;1 in stock&quot; and both proceed to decrement, resulting in stock of -1. The correct approach uses a Lua script in Redis that atomically checks and decrements in a single transaction: local stock = redis.call(&apos;GET&apos;, KEYS[1]); if tonumber(stock) &gt;= tonumber(ARGV[1]) then return redis.call(&apos;DECRBY&apos;, KEYS[1], ARGV[1]); else return -1; end. This Lua script executes as a single Redis command (atomic), eliminating the TOCTOU race. If the script returns -1 (insufficient stock), the checkout is rejected immediately.</p>
        <p>Reservation TTL: when inventory is reserved, a separate key reserved:{"{checkoutSessionId}"}:{"{skuId}"} = {"{quantity}"} is created with the same 15-minute TTL as the checkout session. A background Reaper process monitors expired session keys and runs INCRBY to release the reserved quantity back to available stock. The Reaper uses Redis keyspace notifications (CONFIG SET notify-keyspace-events Ex) to be notified when a key expires, triggering the release without polling.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Payment Saga and Idempotency</h3>
        <p>The payment step is the most failure-prone: the external payment gateway call can timeout, return a non-deterministic error, or succeed but fail to deliver the webhook. Idempotency key: every payment API call includes an idempotency key (checkout_session_id + attempt_number). If the same call is retried (network timeout, duplicate submit), the gateway returns the cached result of the first call — the user is not double-charged. The checkout frontend disables the "Place Order" button immediately on click and re-enables it only on confirmed failure, preventing accidental duplicate submissions.</p>
        <p>Saga compensating transactions: if payment fails, the Checkout Service executes the compensating transaction: (1) INCRBY the reserved inventory back to available (release reservation), (2) set the checkout session status to PAYMENT_FAILED, (3) return the cart to its pre-checkout state. If ORDER_CREATED fails after payment succeeds (a rare but possible scenario — database write failure after a successful payment), the Checkout Service publishes an OrderCreationFailed event. A reconciliation job (running every 15 minutes) finds paid sessions with no corresponding order record and creates the order retroactively, then sends the confirmation email with a note ("Your order was slightly delayed in processing — here is your order confirmation"). This dual-write approach (payment then order) prioritizes not losing money over order record consistency.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Flash Sale Concurrency</h3>
        <p>During a flash sale (e.g., 1000 units at 50% off, sale starts at 12:00 PM), the checkout service may receive 50K+ concurrent requests in the first second. The atomic Redis DECRBY handles the oversell prevention, but the checkout service must also not crash under this load. A token bucket rate limiter per SKU allows a maximum of 500 checkout initiations per second per flash-sale item. Requests that exceed the rate limit are queued in a Redis sorted set (ZADD flash_queue:{"{skuId}"} {"{timestamp}"} {"{requestId}"}). A queue processor dequeues requests FIFO (ZPOPMIN) and processes them serially. Users in the queue see a &quot;You&apos;re in position N, estimated wait: X seconds&quot; message via SSE, updating as the queue drains. This provides a fair, first-come-first-served experience rather than random success or failure under load.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Redis versus database for inventory: using Redis as the hot-path inventory store (with PostgreSQL as the durable ledger) means inventory operations are fast (&lt;5ms) and atomic (Lua scripts). The risk is Redis data loss (AOF persistence mitigates this but adds write latency). An alternative is using PostgreSQL SELECT FOR UPDATE to atomically reserve inventory. This eliminates the Redis dependency at the cost of higher latency (PostgreSQL row locks are ~10ms vs. Redis &lt;1ms) and lower throughput (PostgreSQL row lock contention at high concurrency limits throughput to ~5K reservations/second vs. Redis Lua's ~100K/second). For flash sales with 50K+ concurrent reservations, PostgreSQL row locking alone is insufficient. Redis is the right choice for the hot path.</p>
        <p>Price snapshot timing: snapshotting prices at checkout initiation (not at cart-add time) means a user can add a product at $100, leave it in their cart for 2 weeks as the price rises to $150, and proceed to checkout and see $150. This is surprising but legally correct (the cart is not a contract). Some platforms display the price at cart-add time as a "you added this at $100" historical note while showing the current checkout price. A small number of platforms lock prices at cart-add time for a 24-hour window — this requires storing price-at-add in the cart item record and recalculating the checkout price as min(price_at_add, current_price), which adds complexity and can conflict with dynamic pricing logic.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>Cart and checkout at scale requires atomic inventory control and a distributed transaction saga. Cart: Redis Hash per user (HINCRBY atomic for concurrent updates, PostgreSQL backup, Lua-script merge on login). Checkout session state machine: INITIATED → price snapshot (immutable for 15min) → inventory reservation (Lua script DECRBY, no TOCTOU race) → payment (idempotency key prevents double-charge) → order creation (saga with compensating transactions). Zero-oversell: Redis Lua atomic check-and-decrement; reservation TTL + keyspace notification Reaper releases expired reservations. Payment saga: idempotency key (session_id + attempt), compensating transaction on failure (INCRBY release + session PAYMENT_FAILED), reconciliation job for rare post-payment order creation failures. Flash sale: token bucket rate limiter per SKU (500/s) + FIFO Redis sorted set queue with SSE position updates. The defining constraint: inventory reservation must be an atomic operation — any read-check-write pattern has a TOCTOU race that causes overselling at scale.</p>
      </section>
    </ArticleLayout>
  );
}
