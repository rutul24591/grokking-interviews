"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-order-history-ui",
  title: "Order History UI",
  description:
    "Comprehensive guide to implementing order history interfaces covering order list display, filtering and search, order details view, reorder functionality, return initiation, and account integration for e-commerce customer self-service.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "order-history-ui",
  version: "extensive",
  wordCount: 5800,
  readingTime: 23,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "order-history",
    "ecommerce",
    "frontend",
    "customer-self-service",
    "account",
  ],
  relatedTopics: ["transaction-history-ui", "order-tracking-ui", "refund-request-ui", "confirmation-screens"],
};

export default function OrderHistoryUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Order history UI provides customers visibility into their past orders: what they bought, when, order status, and reorder capability. Unlike transaction history (financial transactions), order history focuses on purchased items, delivery status, and post-purchase actions (reorder, return, review). A well-designed order history reduces support tickets (customers find order info themselves), drives repeat purchases (easy reorder), and builds trust (transparent order tracking). For staff and principal engineers, order history involves data aggregation (orders from multiple channels), performance optimization (large order histories, fast search), and account integration (guest order lookup, order merging).
        </p>
        <p>
          The complexity of order history extends beyond simple list display. Orders come from multiple channels (web, mobile, phone, in-store), each with different data structures. Filtering must handle date ranges (last 30 days, custom), order status (delivered, processing, cancelled), and fulfillment type (shipping, pickup). Search must be fast (indexed, cached) and flexible (order number, product name, SKU). Order details must show items (thumbnails, names, quantities), status (processing, shipped, delivered), and actions (reorder, return, review). The UI must handle edge cases (guest orders, cancelled orders, partially shipped orders) gracefully with clear messaging.
        </p>
        <p>
          For staff and principal engineers, order history architecture involves backend integration (order API, product API, inventory API), data aggregation (unify multiple channels), and performance optimization (pagination, lazy loading, search indexes). Analytics track usage (search terms, filter usage, reorder rate), performance (query time, page load), and errors (failed searches, missing orders). The system must support multiple user types (registered users, guest lookup, business accounts with multiple users), multiple order types (standard, subscription, pre-order), and multiple fulfillment types (shipping, pickup, delivery).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Order List Display</h3>
        <p>
          Order list shows past orders. Display: order number, date, status (delivered, processing, cancelled), total, items (thumbnail, count), actions (view details, reorder, return). Grouping: by month (December 2024, November 2024), by status (processing, delivered, cancelled), by year (2024, 2023). Sorting: by date (newest first default), by total (highest first), by status (processing first). Display: list (order cards), table (order rows), grid (order tiles).
        </p>
        <p>
          Order status indicators show order state. Processing: yellow spinner, &quot;Processing&quot; (order received, preparing). Shipped: blue truck, &quot;Shipped&quot; (on way, tracking available). Delivered: green checkmark, &quot;Delivered&quot; (received, can review/return). Cancelled: red X, &quot;Cancelled&quot; (not fulfilled, refund issued). Display: color-coded badges, tooltip on hover (explain status), clickable (filter by status).
        </p>
        <p>
          Order summary provides quick order info. Content: order number (clickable), date (order date), total (order total), items (thumbnail, count: &quot;3 items&quot;), status (badge). Display: card (order card with summary), row (table row with summary), tile (grid tile with summary). Actions: view details (full order page), reorder (add to cart), return (if eligible).
        </p>

        <h3 className="mt-6">Filtering and Search</h3>
        <p>
          Date range filters orders by date. Presets: last 30 days, last 90 days, last year, year-to-date. Custom: date picker (from date, to date), quick select (this month, last month, Q1 2024). Display: dropdown (presets), calendar picker (custom), applied filters bar (show active filters, clear all). Performance: indexed by date (fast range queries), cached results (repeat queries).
        </p>
        <p>
          Status filters filter by order status. Statuses: processing (not yet shipped), shipped (on way), delivered (received), cancelled (not fulfilled), returned (returned for refund). Display: checkboxes (multiple selection), dropdown (single selection), pills (selected filters). Combination: date + status (delivered in last 30 days), status + fulfillment (pickup orders).
        </p>
        <p>
          Search finds orders by text. Fields: order number (ABC123), product name (Nike shoes), SKU (product code), recipient name (gift orders). Search type: exact (order number), partial (product name), fuzzy (typo tolerance). Display: search bar (top of list), results count (&quot;5 orders&quot;), highlight matches (bold matching text). Performance: search index (Elasticsearch, Algolia), debounced input (wait 300ms after typing).
        </p>

        <h3 className="mt-6">Order Details View</h3>
        <p>
          Order details page shows full order info. Sections: order summary (number, date, status, total), items (thumbnails, names, quantities, prices), shipping (address, method, tracking), payment (method, last 4, amount), timeline (order placed, shipped, delivered). Display: single page (all info), tabs (items, shipping, payment), accordion (expandable sections). Actions: reorder (add to cart), return (if eligible), review (if delivered), invoice (download PDF).
        </p>
        <p>
          Item details show purchased items. Content: thumbnail (product image), name (product name), variant (size, color), quantity (how many), price (unit price, line total), status (delivered, returned, pending). Display: list (item list), grid (item grid), table (item table). Actions: view product (product page), reorder (add to cart), return (if eligible), review (if delivered).
        </p>
        <p>
          Shipping details show delivery info. Content: shipping address (name, address, phone), shipping method (standard, expedited, overnight), tracking number (clickable, track package), delivery date (estimated, actual). Display: map (delivery location), timeline (order journey), tracking link (carrier tracking). Actions: track package (carrier site), modify delivery (if available), contact support (delivery issue).
        </p>

        <h3 className="mt-6">Reorder Functionality</h3>
        <p>
          Reorder adds previous order to cart. Scope: entire order (all items), selected items (choose which), quantity (same or modify). Availability check: in stock (can add), out of stock (notify when available), discontinued (suggest alternatives). Display: &quot;Reorder&quot; button (per order), &quot;Add to Cart&quot; (per item), &quot;Notify Me&quot; (out of stock).
        </p>
        <p>
          Reorder modification allows changes before adding to cart. Quantity: increase/decrease (same product, different quantity). Variants: change size, color (same product, different variant). Remove: remove items (don&apos;t want this time). Display: reorder modal (modify before add), cart preview (see before checkout), suggestions (alternatives for out of stock).
        </p>
        <p>
          Subscription reorder converts one-time to subscription. Offer: &quot;Subscribe &amp; Save 10%&quot; (recurring delivery), frequency (every month, every 3 months), flexibility (skip, cancel anytime). Display: &quot;Subscribe&quot; button (convert to subscription), frequency selector (how often), savings display (how much save). Benefits: never run out (automatic delivery), save money (subscription discount), flexible (skip or cancel).
        </p>

        <h3 className="mt-6">Return and Review</h3>
        <p>
          Return initiation starts return process. Eligibility: within return window (30 days), item condition (unused, tags attached), item type (non-returnable items excluded). Display: &quot;Return&quot; button (if eligible), &quot;Return Window Closed&quot; (if expired), &quot;Non-Returnable&quot; (if excluded). Flow: select items, select reason, select refund method, print label, ship return.
        </p>
        <p>
          Review submission allows product review. Eligibility: delivered orders (received product), within review window (90 days), verified purchase (bought from us). Display: &quot;Write Review&quot; button (if eligible), &quot;Already Reviewed&quot; (if submitted), &quot;Review Window Closed&quot; (if expired). Content: rating (1-5 stars), title, review text, photos (optional), recommend (yes/no).
        </p>
        <p>
          Review management shows submitted reviews. Display: &quot;My Reviews&quot; section (all reviews), review status (published, pending, rejected), edit/delete (modify or remove). Benefits: help other customers (share experience), earn rewards (review points, discounts), track products (reviewed products). Display: review list (all reviews), product page (review on product), profile (reviews on profile).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Order history UI architecture spans data aggregation, list display, filtering/search, and order details. Data aggregation fetches orders from multiple channels (web, mobile, in-store). List display shows orders (cards, table, grid). Filtering/search filters and finds orders. Order details shows full order info (items, shipping, payment).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/order-history-ui/order-history-architecture.svg"
          alt="Order History Architecture"
          caption="Figure 1: Order History Architecture — Data aggregation, list display, filtering/search, and order details"
          width={1000}
          height={500}
        />

        <h3>Data Aggregation</h3>
        <p>
          Order sources aggregate multiple data sources. Web orders: online purchases (website, mobile app). Phone orders: call center orders (phone orders, customer service). In-store orders: POS orders (in-store pickup, in-store purchase). Marketplace orders: third-party sales (Amazon, eBay store). Display: unified list (all orders), channel indicator (web icon, store icon).
        </p>
        <p>
          Data normalization unifies different data structures. Web format: order number, items, total, date. Phone format: order number, CSR ID, total, date. In-store format: receipt number, store ID, total, date. Normalized format: order ID, channel, items, total, date, status. Benefits: single query (unified list), consistent filtering (all orders), simplified frontend (one data structure).
        </p>
        <p>
          Guest order merging links guest orders to account. Scenario: guest checkout (no account), later create account, merge guest orders. Process: identify by email (same email), verify ownership (email confirmation), merge orders (link to account). Display: &quot;Found X guest orders&quot;, &quot;Merge with account?&quot;, &quot;Orders merged&quot;. Benefits: complete order history (all orders), unified tracking (all in one place), loyalty points (points for guest orders).
        </p>

        <h3 className="mt-6">List Display</h3>
        <p>
          Card view shows orders as cards. Content: order number, date, status (badge), total, items (thumbnail, count), actions (view, reorder, return). Display: mobile (cards, swipe actions), desktop (grid, 2-3 columns), responsive (cards below breakpoint). Actions: tap card (view details), swipe (quick actions: reorder, return), long press (more options).
        </p>
        <p>
          Table view shows orders in tabular format. Columns: order number, date, status, total, items, actions. Features: sortable columns (click header), resizable columns (drag border), sticky header (scroll content). Display: desktop (full table), tablet (scrollable), mobile (hide columns, show key info). Actions: click row (view details), row actions (reorder, return icons).
        </p>
        <p>
          Grouped view groups orders by period. Groups: by month (December 2024, November 2024), by quarter (Q4 2024, Q3 2024), by year (2024, 2023). Display: collapsible groups (expand/collapse month), group totals (December 2024: 5 orders, $567), group count (5 orders). Benefits: easier scanning (grouped by period), totals per period (monthly spending).
        </p>

        <h3 className="mt-6">Filtering and Search</h3>
        <p>
          Filter panel provides filtering controls. Filters: date range (presets, custom), status (processing, delivered, cancelled), fulfillment (shipping, pickup, delivery), total (min/max). Display: sidebar (desktop), modal (mobile), collapsible (show/hide filters). Applied filters: show active filters (pills), clear all (one click), clear individual (X on pill).
        </p>
        <p>
          Search bar provides text search. Input: search box (top of list), advanced search (modal, more options). Results: show count (&quot;5 orders&quot;), highlight matches (bold text), no results (&quot;No orders match&quot;, clear filters). Performance: debounced input (wait 300ms), search index (fast lookup), cached results (repeat searches).
        </p>
        <p>
          Filter state management persists filter state. URL params: filters in URL (shareable, bookmarkable). Local storage: save filters (restore on return). User preferences: default filters (always show last 30 days). Display: &quot;Save Filters&quot; button, &quot;Load Saved Filters&quot; dropdown, &quot;Reset to Default&quot; button.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/order-history-ui/order-details-view.svg"
          alt="Order Details View"
          caption="Figure 2: Order Details View — Order summary, items, shipping, payment, and actions"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Order Details</h3>
        <p>
          Order summary section shows order overview. Content: order number (copyable), date (order date), status (badge, timeline), total (order total). Display: header (top of page), card (summary card), sticky (sticky header on scroll). Actions: copy number (clipboard), print order (print page), download invoice (PDF).
        </p>
        <p>
          Items section shows purchased items. Content: items list (thumbnail, name, variant, quantity, price), item status (delivered, returned, pending), item actions (reorder, return, review). Display: list (item list), grid (item grid), table (item table). Actions: view product (product page), reorder (add to cart), return (if eligible), review (if delivered).
        </p>
        <p>
          Shipping and payment sections show delivery and payment info. Shipping: address (name, address, phone), method (standard, expedited), tracking (number, link, status). Payment: method (card, PayPal), last 4 (•••• 1234), amount (charged amount). Display: sections (separate sections), tabs (shipping tab, payment tab), accordion (expandable sections). Actions: track package (carrier site), modify delivery (if available), download receipt (PDF).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/order-history-ui/reorder-flow.svg"
          alt="Reorder Flow"
          caption="Figure 3: Reorder Flow — Select order, modify items, check availability, add to cart"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Order history design involves trade-offs between information density, performance, functionality, and user experience. Understanding these trade-offs enables informed decisions aligned with business requirements and customer expectations.
        </p>

        <h3>Display: Card vs. Table vs. Grouped</h3>
        <p>
          Card view (order cards). Pros: Mobile-friendly (touch-friendly), visual (thumbnails visible), scannable (easy to find order). Cons: Less info per order (need to click for details), more vertical space (scroll more), harder to compare (side-by-side). Best for: Mobile-first (mobile shoppers), visual products (fashion, home), fewer orders (&lt;50 orders).
        </p>
        <p>
          Table view (order rows). Pros: More info (all columns visible), comparable (side-by-side), sortable (click headers). Cons: Not mobile-friendly (horizontal scroll), less visual (small thumbnails), overwhelming (too much info). Best for: Desktop-first (desktop shoppers), B2B (need details), many orders (&gt;50 orders).
        </p>
        <p>
          Grouped view (by period). Pros: Organized (grouped by month), totals per period (monthly spending), collapsible (hide old orders). Cons: Extra clicks (expand groups), hidden data (collapsed groups), complex implementation (grouping logic). Best for: Most production systems—default grouped, option for flat list.
        </p>

        <h3>Search: Client-Side vs. Server-Side</h3>
        <p>
          Client-side search (search in browser). Pros: Instant (no network), works offline (cached data), simple (no backend). Cons: Limited data (must load all first), slow for large datasets (browser search), memory intensive (all data in memory). Best for: Small order histories (&lt;100 orders), offline apps (cached data), simple search (order number only).
        </p>
        <p>
          Server-side search (search on backend). Pros: Fast for large datasets (indexed search), full dataset (not just loaded), advanced search (multiple fields, fuzzy). Cons: Network latency (round trip), requires backend (search API), cost (search infrastructure). Best for: Large order histories (&gt;100 orders), advanced search (product name, SKU), production systems.
        </p>
        <p>
          Hybrid: client-side for loaded, server-side for all. Pros: Instant for loaded (client), full dataset (server), best of both. Cons: Complexity (two search paths), sync issues (client vs. server results). Best for: Most production systems—client for quick search (order number), server for advanced (product name).
        </p>

        <h3>Reorder: One-Click vs. Modified</h3>
        <p>
          One-click reorder (exact same order). Pros: Fastest (one click), simple (no modification), exact repeat (same items, quantities). Cons: Inflexible (can&apos;t modify), out of stock issues (can&apos;t reorder), no upsell (no suggestions). Best for: Consumables (repeat purchases), subscriptions (same every time), B2B (repeat orders).
        </p>
        <p>
          Modified reorder (modify before add). Pros: Flexible (change quantities, variants), handles out of stock (suggest alternatives), upsell opportunity (suggest add-ons). Cons: Slower (modification step), more clicks (modify then add), complex (modification UI). Best for: Most production systems—modify option (not required), one-click for exact repeat.
        </p>
        <p>
          Hybrid: one-click with modification option. Pros: Fast for exact (one-click), flexible for changes (modify option), best of both. Cons: Complexity (two paths), UI decision (which button). Best for: Most production systems—&quot;Reorder All&quot; (one-click), &quot;Select Items&quot; (modify).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/order-history-ui/display-comparison.svg"
          alt="Display Options Comparison"
          caption="Figure 4: Display Options Comparison — Card, table, and grouped view options"
          width={1000}
          height={450}
        />

        <h3>Guest Orders: Merge vs. Separate</h3>
        <p>
          Merge guest orders (link to account). Pros: Complete history (all orders), unified tracking (all in one place), loyalty points (points for guest orders). Cons: Complexity (merge logic), verification required (email confirmation), privacy concerns (link without consent). Best for: Most e-commerce (complete history), loyalty programs (all points), customer service (all orders visible).
        </p>
        <p>
          Separate guest orders (keep separate). Pros: Simple (no merge), privacy (guest stays guest), no verification (no confirmation needed). Cons: Incomplete history (missing guest orders), fragmented tracking (two places), lost loyalty (no points for guest). Best for: Privacy-focused (don&apos;t link without consent), simple implementation (no merge), guest-first (don&apos;t require account).
        </p>
        <p>
          Hybrid: offer merge (opt-in). Pros: Customer choice (merge or not), complete if opted (all orders), privacy-respecting (opt-in). Cons: Complexity (merge logic + opt-in), partial adoption (some merge, some don&apos;t). Best for: Most production systems—offer merge (&quot;Found X guest orders, merge?&quot;), respect decline.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Provide multiple views:</strong> Card (mobile), table (desktop), grouped (by month). Let users choose (view toggle). Default: card (mobile), table (desktop), grouped (by month).
          </li>
          <li>
            <strong>Implement fast search:</strong> Server-side search (indexed), debounced input (300ms), highlight matches (bold text). Advanced search: order number, product name, SKU.
          </li>
          <li>
            <strong>Show clear order status:</strong> Color-coded badges (processing=yellow, delivered=green, cancelled=red), tooltip (explain status), timeline (order journey).
          </li>
          <li>
            <strong>Enable easy reorder:</strong> &quot;Reorder&quot; button (per order), &quot;Add to Cart&quot; (per item), modify option (change quantities, variants). Check availability (in stock, out of stock).
          </li>
          <li>
            <strong>Provide return access:</strong> &quot;Return&quot; button (if eligible), eligibility check (return window, item condition), return flow (select items, reason, refund method).
          </li>
          <li>
            <strong>Enable review submission:</strong> &quot;Write Review&quot; button (if eligible), eligibility check (delivered, within window), review flow (rating, text, photos).
          </li>
          <li>
            <strong>Support guest order lookup:</strong> Order number + email (lookup without account), merge option (&quot;Found guest orders, merge?&quot;), email verification (confirm ownership).
          </li>
          <li>
            <strong>Optimize for performance:</strong> Pagination (20-50 per page), lazy loading (load on scroll), caching (repeat queries), indexing (date, status, order number).
          </li>
          <li>
            <strong>Persist filter state:</strong> URL params (shareable, bookmarkable), local storage (restore on return), user preferences (default filters).
          </li>
          <li>
            <strong>Provide invoice access:</strong> Download invoice (PDF), email invoice (send to email), print invoice (print from browser). B2B: PO number, cost center on invoice.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Slow search:</strong> Client-side search on large dataset. Solution: Server-side search, search index, debounced input.
          </li>
          <li>
            <strong>No reorder:</strong> Can&apos;t easily reorder. Solution: &quot;Reorder&quot; button, check availability, modify option.
          </li>
          <li>
            <strong>No return access:</strong> Can&apos;t initiate return. Solution: &quot;Return&quot; button (if eligible), eligibility check, return flow.
          </li>
          <li>
            <strong>Poor mobile support:</strong> Table doesn&apos;t fit mobile. Solution: Card view (mobile), horizontal scroll (table), hide columns (show key info).
          </li>
          <li>
            <strong>No grouping:</strong> Flat list hard to scan. Solution: Group by month/quarter, collapsible groups, group totals.
          </li>
          <li>
            <strong>No guest lookup:</strong> Guest can&apos;t find orders. Solution: Order number + email lookup, merge option, email verification.
          </li>
          <li>
            <strong>Performance issues:</strong> Slow for large histories. Solution: Pagination, lazy loading, caching, indexing.
          </li>
          <li>
            <strong>Filters not persistent:</strong> Lose filters on navigation. Solution: URL params, local storage, user preferences.
          </li>
          <li>
            <strong>No invoice access:</strong> Can&apos;t download invoice. Solution: Download PDF, email invoice, print option.
          </li>
          <li>
            <strong>No analytics:</strong> Don&apos;t track order history usage. Solution: Track search terms, filter usage, reorder rate, return rate.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Amazon Order History</h3>
        <p>
          Amazon order history: comprehensive order tracking. Features: grouped by year (2024, 2023), filters (date, status), search (product, order number). Display: list view (order cards), order details (items, shipping, payment). Actions: reorder (exact or modify), return (if eligible), review (if delivered), download invoice (PDF). Guest lookup: order number + email.
        </p>

        <h3 className="mt-6">Walmart Order History</h3>
        <p>
          Walmart order history: online and in-store orders. Features: unified list (online + in-store), filters (date, status, fulfillment), search (order number, product). Display: list view (order cards), order details (items, pickup/delivery). Actions: reorder (exact or modify), return (in-store or mail), review (if delivered). Guest lookup: order number + email.
        </p>

        <h3 className="mt-6">Best Buy Order History</h3>
        <p>
          Best Buy order history: electronics orders. Features: grouped by month, filters (date, status), search (order number, product, SKU). Display: list view (order cards), order details (items, shipping/pickup). Actions: reorder (exact or modify), return (in-store or mail), review (if delivered), download invoice (PDF). Guest lookup: order number + email.
        </p>

        <h3 className="mt-6">Zappos Order History</h3>
        <p>
          Zappos order history: footwear and apparel orders. Features: grouped by month, filters (date, status), search (order number, product). Display: list view (order cards with thumbnails), order details (items, sizes, shipping). Actions: reorder (exact or modify size), return (free return shipping), review (if delivered). Guest lookup: order number + email.
        </p>

        <h3 className="mt-6">Costco Order History</h3>
        <p>
          Costco order history: membership-based orders. Features: grouped by year, filters (date, status, fulfillment), search (order number, product). Display: list view (order cards), order details (items, shipping/pickup). Actions: reorder (exact or modify), return (warehouse or mail), review (if delivered). Guest lookup: order number + email + membership verification.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large order histories?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Pagination (20-50 per page), lazy loading (load on scroll), server-side search (indexed), caching (repeat queries), archiving (old orders to cold storage). Display: grouped by year (collapse old years), search-first (search instead of scroll), export (download full history for accounting).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement fast order search?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Server-side search (Elasticsearch, Algolia), search index (order number, product name, SKU, recipient name), debounced input (wait 300ms after typing), cached results (repeat searches), highlight matches (bold matching text). Advanced: fuzzy search (typo tolerance), synonym search (sneakers = shoes), field-specific search (order_number:ABC123).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle guest order lookup?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Lookup form: order number + email (required), order number + phone (alternative). Verification: email confirmation (send verification code), order details match (verify shipping address). Merge option: &quot;Found X guest orders, merge with account?&quot;, opt-in (respect decline), email verification (confirm ownership).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement reorder functionality?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> One-click reorder (exact same order), modified reorder (change quantities, variants), availability check (in stock, out of stock, discontinued). Display: &quot;Reorder All&quot; (one-click), &quot;Select Items&quot; (modify), &quot;Notify Me&quot; (out of stock). Cart: add to cart, review before checkout, suggestions (alternatives for out of stock).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle order status updates?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Real-time updates (WebSocket, push notifications), polling (check every 30 seconds), email/SMS notifications (status change). Display: status badge (color-coded), timeline (order journey), tracking link (carrier tracking). Actions: track package (carrier site), modify delivery (if available), contact support (delivery issue).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize order history for mobile?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Card view (not table), large touch targets (44x44px), swipe actions (reorder, return), simplified filters (modal, not sidebar), lazy loading (load on scroll), offline support (cache recent orders). Performance: fast load (&lt;3 seconds), minimal data transfer (only needed fields), image optimization (order thumbnails).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.amazon.com/gp/css/order-history"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon — Order History
            </a>
          </li>
          <li>
            <a
              href="https://www.walmart.com/account/orderhistory"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Walmart — Order History
            </a>
          </li>
          <li>
            <a
              href="https://www.bestbuy.com/profile/ss/orderlookup"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Best Buy — Order Lookup
            </a>
          </li>
          <li>
            <a
              href="https://www.zappos.com/order/list"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zappos — Order History
            </a>
          </li>
          <li>
            <a
              href="https://www.costco.com/OrderStatusView"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Costco — Order Status
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/order-history-ux/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Order History UX Best Practices
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
