"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-shopping-cart-system",
  title: "Design a Shopping Cart System",
  description:
    "Production-grade shopping cart with real-time updates, persistence, cart abandonment tracking, and synchronization across devices.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "shopping-cart-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "shopping-cart", "ecommerce", "persistence", "synchronization"],
  relatedTopics: ["checkout-flow", "offline-first-architecture", "optimistic-ui-system"],
};

export default function ShoppingCartSystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">E-commerce platforms need reliable shopping carts: users add items, adjust quantities, and apply discounts across potentially multiple sessions and devices. The surface-level problem—store a list of items—hides substantial complexity. Stock levels change while users browse (an item popular enough to sell out between "add to cart" and "checkout"). Users abandon carts and return days later expecting their items. Users shop on a phone and complete checkout on a desktop. Two browser tabs open simultaneously produce conflicting cart state. A coupon applied yesterday may have expired today.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The naive implementation—a simple array in component state—fails immediately on refresh. Local storage helps but cannot share state across devices. A server-only cart adds latency to every interaction. The production pattern is a hybrid: instant optimistic updates against local state, asynchronous server sync, and server-authoritative validation at checkout.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> Users may be anonymous (guest cart) or authenticated (server-synced cart). Stock is managed by an inventory service that is the authoritative source. Price snapshots are taken at add-to-cart time but re-validated at checkout. Coupons are server-validated, not trusted from client. Cart persistence is required across sessions (30-day default expiry for idle carts). Concurrent modifications from multiple devices should merge, not silently overwrite.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Add/Remove/Update Items:</strong> Add an item with a specific quantity, update quantity (increment, decrement, direct input), remove item when quantity reaches zero.</HighlightBlock>
          <li><strong>Price Calculation:</strong> Compute subtotal, apply line-item and cart-level discounts, show estimated tax, show estimated shipping based on address.</li>
          <li><strong>Coupon Management:</strong> Apply coupon codes with server validation, display discount, re-validate at checkout.</li>
          <li><strong>Cart Persistence:</strong> Survive session termination; restore on return visit. Guest cart preserved even without login.</li>
          <HighlightBlock as="li" tier="important"><strong>Cross-Device Sync:</strong> Cart items added on mobile appear on desktop on next load for authenticated users.</HighlightBlock>
          <li><strong>Stock Awareness:</strong> Warn if items in cart go out of stock or drop below requested quantity. Prevent checkout with unavailable items.</li>
          <li><strong>Cart Abandonment:</strong> Track abandonment events; enable recovery email campaigns with persistent cart link.</li>
          <HighlightBlock as="li" tier="important"><strong>Guest-to-User Migration:</strong> When a guest logs in, merge guest cart with any existing server cart.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="crucial"><strong>Latency:</strong> Add-to-cart must feel instant—under 100ms UI response. Server sync can happen asynchronously in the background.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Consistency:</strong> Cart must never oversell. Server is the authoritative source for stock and price at checkout time.</HighlightBlock>
          <li><strong>Offline Support:</strong> Basic cart operations (add, remove, view) must work without network; sync when reconnected.</li>
          <li><strong>Conflict Safety:</strong> Concurrent modifications from multiple devices should not silently lose data.</li>
          <li><strong>Scalability:</strong> Cart totals must recompute correctly with 100+ line items without blocking the UI.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">The cart architecture has three layers: an in-memory reactive store (Zustand or Redux) for immediate UI response, a local persistence layer (localStorage or IndexedDB) for session survival and offline support, and a server-side cart store (database-backed API) for cross-device sync and authoritative checkout validation.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Every cart mutation follows an optimistic pattern: update the local store immediately (so the user sees instant feedback), persist locally, then fire an async request to sync with the server. If the server rejects the mutation (item out of stock, price changed), the local store is reverted with an appropriate error message. This gives users the perceived performance of a local app with the consistency guarantees of a server-backed system.</HighlightBlock>
        <HighlightBlock as="p" tier="important">For authenticated users, a WebSocket subscription pushes server-side cart changes (stock updates, price changes, modifications from other devices) to the active session. Guest carts are entirely client-side until login, at which point a merge algorithm combines the guest cart with any existing server cart for that account.</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/shopping-cart-system.svg"
          alt="Shopping cart system showing cart state machine, local-to-server sync flow, multi-device synchronization, conflict resolution, and stock validation"
          caption="Shopping cart system showing cart state machine, local-to-server sync flow, multi-device synchronization, conflict resolution, and stock validation"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design a Shopping Cart System</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Look for the &ldquo;control points&rdquo; where correctness is enforced: idempotency keys, monotonic request/version tokens, single-flight coordination, and durable persistence boundaries.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          In interviews, call out observability and operability: what you log/measure (p95 latency, error rates, retries/queue depth) and how you keep degraded modes user-safe (read-only, queued, or cached fallbacks).
        </HighlightBlock>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cart Data Model</h3>
        <p>The cart is modeled as a document-style object. The top-level cart has a unique cartId (UUID), userId (null for guests), a version counter, createdAt and updatedAt timestamps, and a status (active, checked-out, abandoned, expired). The items array contains line items, each with a productId, variantId (for size/color), quantity, unitPrice (snapshot at add-time), displayName, thumbnailUrl, and a lineItemId (UUID) for stable identity across quantity changes.</p>
        <p>The version counter is critical for conflict detection. Every server-side mutation increments the version. When a client sends an update, it includes the version it last saw. If the server's current version differs, there's a conflict that must be resolved before accepting the client's changes. This optimistic concurrency control (OCC) approach is cheaper than pessimistic locking and scales better for read-heavy cart operations.</p>
        <p>Price snapshots are taken at add-to-cart time and stored on the line item. This means the user sees the price they added at, even if the product price changes while they browse. At checkout, prices are re-fetched from the product catalog and compared against the snapshot. If any price changed, the user is shown a diff and must confirm before proceeding. This is the standard Amazon-style behavior: "Price of X changed from $Y to $Z. Proceed?"</p>
        <p>Applied coupons are stored separately from line items, as a list of objects with couponCode, discountType (percentage, flat, free-shipping), discountValue, applicableProductIds (null for cart-wide), and validatedAt timestamp. Coupons are re-validated on the server at checkout and never trusted solely from client storage.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Optimistic Update Flow</h3>
        <p>When a user clicks "Add to Cart," the system: (1) immediately updates the in-memory store (the cart badge count increments, the item appears in the cart drawer), (2) serializes the updated cart to localStorage for persistence, (3) fires an async POST to the cart API with the mutation and the current cart version. If the API call succeeds, the server returns the authoritative cart state (with any server-side adjustments), which is merged back into the local store. If the API call fails, the local store is reverted to the pre-mutation state and an error toast is shown.</p>
        <HighlightBlock as="p" tier="crucial">The key invariant is that the local store is never considered final until the server acknowledges the mutation. For quantity updates specifically, rapid tapping (increment, increment, increment quickly) is handled by debouncing the server call: collect all quantity mutations within a 300ms window and send a single "set quantity to N" request instead of three "increment by 1" requests. The UI reflects the final desired value immediately, while the network call is coalesced to avoid race conditions from overlapping requests.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Error states require careful handling. A 409 Conflict from the server (version mismatch) triggers a cart refetch, not a simple retry. The system fetches the current server cart, merges it with the pending local changes (using a per-item merge strategy: take the higher quantity, keep items that exist on either side), and re-presents the merged state to the user with a notification. A 422 Unprocessable Entity (item out of stock) reverts only the specific line item, not the entire cart, and shows a targeted message. Network errors (timeout, 503) queue the mutation for retry with exponential backoff.</HighlightBlock>

	        <h3 className="mt-6 mb-3 text-lg font-semibuild">Persistence Architecture</h3>
	        <p>localStorage provides synchronous persistence for carts under approximately 50 items. The cart is serialized as JSON and stored under a deterministic key that includes either the authenticated user identifier or an anonymous device identifier. On app initialization, the store is hydrated from localStorage before the first render, so the user never sees a flash of empty cart.</p>
        <HighlightBlock as="p" tier="important">For larger carts or richer metadata, IndexedDB provides a higher storage quota (hundreds of MB versus localStorage's ~5-10 MB) and async access that doesn't block the main thread. The trade-off is a more complex API. A lightweight wrapper library (idb, idb-keyval) reduces IndexedDB ceremony. For most e-commerce carts (typical cart size is 5-20 items), localStorage is sufficient and simpler to debug.</HighlightBlock>
        <p>Cart expiry is handled client-side by storing a lastModified timestamp alongside the cart. On hydration, if lastModified is older than the configured TTL (30 days), the cart is cleared and the user starts fresh. This prevents old carts from accumulating. The server also enforces expiry—any cart not modified for 30 days is archived and excluded from sync—but the client-side check provides immediate cleanup without a server round-trip.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cross-Device Synchronization</h3>
        <p>For authenticated users, cross-device sync uses the server cart as the source of truth. On every app load, the client fetches the server cart and compares its version to the locally stored cart. If the server version is newer (another device modified the cart), the server state is used. If the local version is newer (the user made changes offline), the local changes are sent to the server. If both are newer than each other's last known version (genuine concurrent modification), the merge algorithm runs.</p>
        <HighlightBlock as="p" tier="important">The merge algorithm operates per-item: for each productId+variantId pair, take the maximum quantity (union behavior—if one device added 2 and another added 3, keep 3). Items that exist on only one side are always kept. This is a "union and max" strategy, which is optimistic but appropriate for shopping carts (it's better to have too many items than to silently lose selections). After merge, the resolved state is sent to the server and confirmed as the new authoritative version.</HighlightBlock>
        <p>Real-time sync for active sessions (the user has two browser tabs open simultaneously) uses a SharedWorker or BroadcastChannel to propagate cart changes between tabs on the same origin without a server round-trip. When Tab A adds an item, it dispatches a broadcast message; Tab B's cart store listener applies the same mutation to its local state. This prevents the confusing experience where two tabs of the same app show different cart states.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Stock Validation and Real-Time Awareness</h3>
        <p>The cart must surface stock issues before the user reaches checkout. There are two layers: add-time validation (a stock check before optimistically adding the item, blocking the add if out of stock) and background monitoring (a periodic or event-driven check that scans cart items for stock changes and surfaces warnings in the cart UI).</p>
        <p>Background stock monitoring works by subscribing to a WebSocket channel on the product catalog. When the inventory system publishes a stock-changed event for a productId that's in the user's cart, the client updates the line item's available stock display and shows a warning badge on the cart icon. No polling is needed if WebSocket is available. If WebSocket is unavailable, a polling interval of every 2 minutes is a reasonable fallback—frequent enough to catch most stock changes before checkout, infrequent enough not to hammer the API.</p>
        <p>At checkout entry, a mandatory stock re-validation step hits the server for each line item. Items that are now out of stock or have fewer units available than requested are flagged. The user must resolve (remove item, reduce quantity, or proceed without flagged items) before payment. This server-side validation is non-negotiable—client-side stock checks are a UX improvement, not a security control, and any production system that relies solely on client-side stock checks will occasionally sell products it doesn't have.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Guest Cart and Login Migration</h3>
        <p>Guest carts are scoped to a deviceId stored in localStorage. The deviceId is generated on first visit and persists across sessions. The guest cart is entirely client-side—no server record—which means it's tied to a specific browser and cannot be accessed from other devices.</p>
        <p>When a guest logs in, the migration flow runs: fetch the authenticated user's server cart (which may be empty or may have items from previous sessions), then run the merge algorithm on the guest cart and the server cart. The merged result becomes the new server cart. The guest cart in localStorage is cleared. The user is shown a notification: "Your cart has been updated" with a summary of any items that were merged in, so they know what happened and can review before proceeding.</p>
        <HighlightBlock as="p" tier="important">Edge case: the user logs out. The current pattern is to either clear the cart (secure but destructive) or demote the server cart to a guest cart keyed by the new anonymous deviceId (preserves items but couples the anonymous session to the last authenticated session). The Amazon-style approach is to keep the cart for the session and prompt the user to sign in to save it permanently. Discarding on logout is the safest choice for shared devices; preserving is better for single-user devices. The right choice depends on the application's user model.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Cart Abandonment Tracking</h3>
        <p>Cart abandonment is defined as a user session that added at least one item but did not initiate checkout within a configured window (commonly 1-2 hours after the last cart modification). Tracking happens server-side via a scheduled job that scans active carts, identifies those past the abandonment threshold, marks them as abandoned, and enqueues recovery email jobs.</p>
        <p>The recovery email contains a cart token—a time-limited signed URL that, when clicked, restores the cart state on the server and initiates an authenticated or semi-authenticated session. The cart token is not the cartId directly; it's an encrypted, expiry-stamped token to prevent guessing or enumeration. When the user clicks the link, the cart is restored, they're taken to the cart page with their items ready, and the abandonment event is marked resolved.</p>
        <p>Client-side contribution to abandonment tracking is limited to firing an analytics event on page unload (beforeunload event) if the cart is non-empty and the user hasn't started checkout. This event is unreliable (beforeunload can be suppressed) but provides signal for dashboards. The authoritative abandonment data lives in the server's cart status field and the scheduled job, not in client-fired events.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Price Calculation and Coupon Handling</h3>
        <p>Price calculation runs as a pure function over the cart state: sum (unitPrice × quantity) for each line item, apply line-item discounts (items on sale), apply coupon discount (percentage or flat), add estimated tax (based on shipping address or user's stored address), add shipping cost (based on total weight and destination). This calculation is performed client-side for display purposes and server-side for authoritative values.</p>
        <p>Coupon application requires server validation because the server holds the rules: which products the coupon applies to, whether it's single-use, whether it has been exhausted (limited supply coupons like "first 1000 customers"), and whether the cart meets minimum spend requirements. The client sends a PATCH request to apply the coupon; the server responds with the discount amount and any restrictions. Only then does the client display the discount in the cart summary.</p>
        <p>Stacking coupons—whether multiple coupons can be applied simultaneously—is a business rule encoded on the server. The client should not attempt to enforce stacking rules locally, as they change over time and vary by promotion. If the server rejects a second coupon because only one can be active, the client shows the server's rejection message verbatim.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="crucial">Optimistic UI versus pessimistic UI: optimistic gives instant perceived performance but requires careful error reversal and can show users items they cannot actually purchase (between optimistic add and server confirmation). Pessimistic UI (wait for server confirmation before showing the item) avoids inconsistency but feels sluggish, especially on mobile networks. Most production carts use optimistic UI because add-to-cart failures are rare relative to the volume of successful adds. The key is graceful reversal—the user should understand why an item disappeared, not just see it vanish.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Version-based conflict detection versus timestamp-based: version counters are more reliable because they are monotonically increasing integers that cannot be affected by clock skew between client and server. Timestamps fail when the client's clock is wrong (common on mobile devices) or when two mutations happen within the same millisecond. Version counters should always be preferred for OCC in distributed systems.</HighlightBlock>
        <HighlightBlock as="p" tier="important">localStorage versus IndexedDB for persistence: localStorage is synchronous, which means a 50-item cart serialized to JSON (perhaps 10-20 KB) blocks the main thread briefly on every write. For typical cart sizes this is imperceptible, but it matters at scale. IndexedDB is async and non-blocking but significantly more complex. The correct choice: use localStorage for the cart (typical use case is well within its limits) and document the threshold at which a migration to IndexedDB would be warranted (large wishlists, complex cart metadata).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Client-side price calculation versus server-only: displaying calculated totals client-side requires the client to have correct discount rules, tax calculation logic, and shipping logic—all of which are business-sensitive and change frequently. A cleaner architecture fetches the authoritative total from the server after significant state changes (coupon application, address entry) and displays a "calculating..." state in between. Client-side estimation (for instant feedback) should be clearly marked as an estimate. The checkout page must always show server-authoritative totals.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Stock validation at two points (add time and checkout entry) prevents overselling without degrading the browse experience.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">Guest-to-user cart migration preserves items through the login flow. Cart abandonment tracking drives recovery campaigns server-side using reliable status transitions rather than brittle client events. The recurring theme: client-side is for UX; server-side is for truth.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
