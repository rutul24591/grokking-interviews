"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-transaction-history-ui",
  title: "Transaction History UI",
  description:
    "Comprehensive guide to implementing transaction history interfaces covering transaction list display, filtering and search, export functionality, receipt management, dispute handling, and financial reporting for customer self-service.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "transaction-history-ui",
  version: "extensive",
  wordCount: 5800,
  readingTime: 23,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "history",
    "frontend",
    "reporting",
    "accounting",
    "financial-records",
  ],
  relatedTopics: ["payment-processing", "refund-request-ui", "order-tracking-ui", "billing-platforms"],
};

export default function TransactionHistoryUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Transaction history UI provides users visibility into their financial transactions, enabling tracking, reconciliation, and record-keeping. Customers need to see: what they paid, when, for what, and current status (completed, pending, refunded). A well-designed transaction history reduces support tickets (customers find answers themselves), enables expense tracking (business customers), and builds trust (transparent financial records). For staff and principal engineers, transaction history involves data aggregation (multiple payment methods, orders, subscriptions), performance optimization (large datasets, fast search), and compliance (data retention, export for accounting).
        </p>
        <p>
          The complexity of transaction history extends beyond simple list display. Transactions come from multiple sources (orders, subscriptions, refunds, credits), each with different data structures. Filtering must handle date ranges (custom, presets), transaction types (purchase, refund, credit), status (completed, pending, failed), and amounts (min/max). Search must be fast (indexed, cached) and flexible (description, amount, order number). Export must support multiple formats (CSV for accounting, PDF for records), date ranges, and filters. The UI must handle edge cases (very old transactions, deleted orders, chargebacks) gracefully with clear messaging.
        </p>
        <p>
          For staff and principal engineers, transaction history architecture involves backend integration (payment API, order API, subscription API), data aggregation (unify multiple sources), and performance optimization (pagination, lazy loading, search indexes). Analytics track usage (search terms, filter usage, export frequency), performance (query time, page load), and errors (failed searches, export failures). The system must support multiple user types (individual consumers, business customers with multiple users, accountants with read-only access), multiple date ranges (last 30 days, custom, all-time), and multiple export formats (CSV, PDF, QBO for QuickBooks).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Transaction List Display</h3>
        <p>
          Transaction table shows financial transactions. Columns: date (transaction date), description (what was purchased), amount (charged/refunded), status (completed, pending, failed, refunded), payment method (Visa •••• 1234, PayPal), receipt (download link). Sorting: by date (newest first default), amount (highest first), description (alphabetical). Grouping: by month (Dec 2024, Nov 2024), by type (purchases, refunds, credits). Display: table (desktop), cards (mobile), infinite scroll (load more) or pagination (page 1 of 10).
        </p>
        <p>
          Transaction details expand on click/tap. Details: order number, items purchased, billing address, shipping address, payment method, transaction ID, receipt link, refund link (if eligible). Actions: download receipt, request refund (if eligible), dispute transaction (if issue), report issue (contact support). Display: modal (desktop), new page (mobile), accordion expand (inline details).
        </p>
        <p>
          Status indicators show transaction state. Completed: green checkmark, &quot;Completed&quot; (funds transferred). Pending: yellow spinner, &quot;Processing&quot; (funds authorized, not captured). Failed: red X, &quot;Failed&quot; (payment declined, insufficient funds). Refunded: blue arrow, &quot;Refunded&quot; (funds returned). Display: color-coded badges, tooltip on hover (explain status), clickable (filter by status).
        </p>

        <h3 className="mt-6">Filtering and Search</h3>
        <p>
          Date range filters transactions by date. Presets: last 30 days, last 90 days, last year, year-to-date. Custom: date picker (from date, to date), quick select (this month, last month, Q1 2024). Display: dropdown (presets), calendar picker (custom), applied filters bar (show active filters, clear all). Performance: indexed by date (fast range queries), cached results (repeat queries).
        </p>
        <p>
          Type filters filter by transaction type. Types: purchases (orders, subscriptions), refunds (returned items, cancelled subscriptions), credits (store credit, promotional credit), disputes (chargebacks, disputes). Display: checkboxes (multiple selection), dropdown (single selection), pills (selected filters). Combination: date + type (purchases in last 30 days), type + status (refunds completed).
        </p>
        <p>
          Search finds transactions by text. Fields: description (product name, order number), amount ($99.00, 99), payment method (Visa, PayPal), status (completed, pending). Search type: full-text (matches any field), exact (order number, transaction ID). Display: search bar (top of list), results count (&quot;15 results&quot;), highlight matches (bold matching text). Performance: search index (Elasticsearch, Algolia), debounced input (wait 300ms after typing).
        </p>

        <h3 className="mt-6">Export Functionality</h3>
        <p>
          CSV export for accounting software. Content: date, description, amount, status, payment method, order number, transaction ID, category (optional). Format: comma-separated, UTF-8 encoding, header row (column names). Use cases: import to QuickBooks, Excel analysis, expense tracking. Display: &quot;Export CSV&quot; button, date range selector (export last 30 days, custom), filter application (export filtered results).
        </p>
        <p>
          PDF export for records and receipts. Content: transaction list (summary), individual receipts (detailed), cover page (date range, total). Format: PDF, printable, professional layout (company logo, contact info). Use cases: tax records, expense reports, reimbursement. Display: &quot;Export PDF&quot; button, options (summary vs. detailed, include receipts), email PDF (send to accountant).
        </p>
        <p>
          QBO export for QuickBooks Desktop. Content: transactions formatted for QuickBooks (account mapping, class tracking). Format: QBO (Web Connect), IIF (older versions). Use cases: import to QuickBooks Desktop, accountant reconciliation. Display: &quot;Export for QuickBooks&quot; button, account mapping (select QuickBooks accounts), download QBO file.
        </p>

        <h3 className="mt-6">Receipt Management</h3>
        <p>
          Individual receipt download provides proof of purchase. Content: company info, order number, date, items (name, quantity, price), subtotal, tax, shipping, total, payment method, billing address, shipping address. Format: PDF (printable), email (HTML), image (PNG for mobile). Display: download button (per transaction), email receipt (send to email), print (browser print).
        </p>
        <p>
          Bulk receipt download provides multiple receipts at once. Selection: select transactions (checkboxes), select all (current page, all results). Format: ZIP file (multiple PDFs), single PDF (all receipts combined). Use cases: expense reports (multiple purchases), tax records (year-end receipts), reimbursement (business trips). Display: &quot;Download Selected&quot; button, &quot;Download All&quot; button (current filters), progress indicator (generating ZIP).
        </p>
        <p>
          Receipt customization adds business-specific info. Content: company logo, tax ID, purchase order number, cost center, project code, notes. Use cases: business expenses (cost center tracking), client billing (project codes), internal approval (notes). Display: &quot;Customize Receipt&quot; link, form fields (PO number, cost center), save preferences (apply to future receipts).
        </p>

        <h3 className="mt-6">Dispute and Issue Handling</h3>
        <p>
          Dispute initiation starts chargeback process. Entry points: transaction details (&quot;Dispute Transaction&quot;), customer support (&quot;Report Issue&quot;), email/phone (contact support). Reasons: unauthorized (fraud, didn&apos;t authorize), not received (ordered but not delivered), defective (received but broken/wrong), duplicate (charged twice), other (open text). Display: form (reason, description, upload evidence), confirmation (&quot;Dispute submitted&quot;), case number (track dispute).
        </p>
        <p>
          Dispute tracking shows dispute status. States: submitted (dispute filed), under review (merchant reviewing), provisional credit (temporary credit issued), resolved (dispute decided), closed (case closed). Display: timeline (like order tracking), status updates (email/SMS), estimated resolution (&quot;Resolved by Dec 30&quot;). Actions: upload additional evidence, respond to merchant, escalate (if unsatisfied).
        </p>
        <p>
          Issue reporting handles non-dispute issues. Types: wrong amount (charged incorrectly), duplicate charge (charged twice), refund not received (refund promised but not received), other (open text). Resolution: automatic (refund processed, credit issued), manual (support review, contact customer). Display: &quot;Report Issue&quot; button, form (issue type, description), confirmation (&quot;We&apos;ll review and respond in 24-48 hours&quot;).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Transaction history UI architecture spans data aggregation, list display, filtering/search, and export. Data aggregation fetches transactions from multiple sources (orders, subscriptions, refunds). List display shows transactions (table, cards, pagination). Filtering/search filters and finds transactions. Export generates downloadable files (CSV, PDF, QBO).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/transaction-history-ui/transaction-history-architecture.svg"
          alt="Transaction History Architecture"
          caption="Figure 1: Transaction History Architecture — Data aggregation, list display, filtering/search, and export"
          width={1000}
          height={500}
        />

        <h3>Data Aggregation</h3>
        <p>
          Transaction sources aggregate multiple data sources. Orders: e-commerce purchases (physical goods, digital goods). Subscriptions: recurring charges (SaaS, memberships). Refunds: returned items, cancelled subscriptions. Credits: store credit, promotional credit, loyalty points. Display: unified list (all sources), source indicator (order icon, subscription icon).
        </p>
        <p>
          Data normalization unifies different data structures. Order format: order number, items, total, date. Subscription format: subscription ID, plan, amount, billing date. Refund format: refund ID, original order, amount, date. Normalized format: transaction ID, description, amount, date, type, status, source. Benefits: single query (unified list), consistent filtering (all sources), simplified frontend (one data structure).
        </p>
        <p>
          Performance optimization handles large datasets. Pagination: page 1 of 10 (20-50 per page), load more (infinite scroll). Lazy loading: load visible transactions, load more on scroll. Caching: cache results (repeat queries), cache counts (total transactions). Indexing: index by date (range queries), amount (min/max), description (search). Display: loading skeleton (while loading), &quot;Load More&quot; button (pagination), scroll indicator (infinite scroll).
        </p>

        <h3 className="mt-6">List Display</h3>
        <p>
          Table view shows transactions in tabular format. Columns: date, description, amount, status, payment method, actions (receipt, refund). Features: sortable columns (click header), resizable columns (drag border), sticky header (scroll content), row hover (highlight row). Display: desktop (full table), tablet (scrollable), mobile (hide columns, show key info).
        </p>
        <p>
          Card view shows transactions as cards (mobile-friendly). Content: date, description, amount (prominent), status (badge), payment method (icon). Actions: tap card (expand details), swipe (quick actions: receipt, refund). Display: mobile (cards), desktop (optional, some prefer cards), responsive (cards below breakpoint).
        </p>
        <p>
          Grouped view groups transactions by period. Groups: by month (Dec 2024, Nov 2024), by quarter (Q4 2024, Q3 2024), by year (2024, 2023). Display: collapsible groups (expand/collapse month), group totals (Dec 2024: $1,234.56), group count (15 transactions). Benefits: easier scanning (grouped by period), totals per period (monthly spending).
        </p>

        <h3 className="mt-6">Filtering and Search</h3>
        <p>
          Filter panel provides filtering controls. Filters: date range (presets, custom), type (purchases, refunds, credits), status (completed, pending, failed), amount (min/max), payment method (Visa, PayPal). Display: sidebar (desktop), modal (mobile), collapsible (show/hide filters). Applied filters: show active filters (pills), clear all (one click), clear individual (X on pill).
        </p>
        <p>
          Search bar provides text search. Input: search box (top of list), advanced search (modal, more options). Results: show count (&quot;15 results&quot;), highlight matches (bold text), no results (&quot;No transactions match&apos;&apos;, clear filters). Performance: debounced input (wait 300ms), search index (fast lookup), cached results (repeat searches).
        </p>
        <p>
          Filter state management persists filter state. URL params: filters in URL (shareable, bookmarkable). Local storage: save filters (restore on return). User preferences: default filters (always show last 30 days). Display: &quot;Save Filters&quot; button, &quot;Load Saved Filters&quot; dropdown, &quot;Reset to Default&quot; button.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/transaction-history-ui/export-functionality.svg"
          alt="Export Functionality"
          caption="Figure 2: Export Functionality — CSV, PDF, and QBO export options and formats"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Export Generation</h3>
        <p>
          CSV generation creates comma-separated file. Process: fetch filtered transactions, format as CSV (escape commas, quotes), generate blob, trigger download. Content: header row (column names), data rows (transactions), totals row (optional). Performance: stream large exports (don&apos;t load all in memory), background generation (notify when ready), email large exports (don&apos;t wait for download).
        </p>
        <p>
          PDF generation creates printable document. Process: fetch filtered transactions, render HTML (styled for print), convert to PDF (server-side or client-side), trigger download. Content: cover page (date range, total), transaction list (summary), receipts (detailed, optional). Performance: server-side generation (handle large exports), queue long exports (email when ready), progress indicator (generating PDF).
        </p>
        <p>
          QBO generation creates QuickBooks format. Process: fetch filtered transactions, map to QuickBooks accounts (user mapping), format as QBO (Web Connect spec), trigger download. Content: transactions (date, payee, amount, account), account mapping (income, expense, asset). Performance: same as CSV (stream, background, email).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/transaction-history-ui/dispute-flow.svg"
          alt="Dispute and Issue Handling"
          caption="Figure 3: Dispute and Issue Handling — Dispute initiation, tracking, and resolution"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Transaction history design involves trade-offs between performance, functionality, complexity, and user experience. Understanding these trade-offs enables informed decisions aligned with business requirements and customer expectations.
        </p>

        <h3>Pagination: Page-Based vs. Infinite Scroll</h3>
        <p>
          Page-based pagination (page 1 of 10). Pros: Clear progress (know how many pages), jump to page (go to page 5), bookmarkable (page 3 URL). Cons: Discontinuous scroll (click to load more), page reload (unless AJAX), arbitrary page size (20 vs. 50). Best for: Desktop (mouse navigation), known dataset size (know total), export (export page X).
        </p>
        <p>
          Infinite scroll (load more on scroll). Pros: Continuous scroll (seamless), no page selection (just scroll), mobile-friendly (thumb scroll). Cons: No progress (don&apos;t know how many), can&apos;t jump (must scroll), footer issues (infinite content). Best for: Mobile (touch navigation), unknown dataset size (don&apos;t know total), browsing (not searching).
        </p>
        <p>
          Hybrid: &quot;Load More&quot; button (manual infinite scroll). Pros: User control (click to load), progress visible (loaded X of Y), footer works (finite content). Cons: Extra click (vs. auto-scroll), still discontinuous. Best for: Most production systems—balance control with convenience.
        </p>

        <h3>Search: Client-Side vs. Server-Side</h3>
        <p>
          Client-side search (search in browser). Pros: Instant (no network), works offline (cached data), simple (no backend). Cons: Limited data (must load all first), slow for large datasets (browser search), memory intensive (all data in memory). Best for: Small datasets (&lt;1000 transactions), offline apps (cached data), simple search (single field).
        </p>
        <p>
          Server-side search (search on backend). Pros: Fast for large datasets (indexed search), full dataset (not just loaded), advanced search (multiple fields, fuzzy). Cons: Network latency (round trip), requires backend (search API), cost (search infrastructure). Best for: Large datasets (&gt;1000 transactions), advanced search (multiple fields), production systems.
        </p>
        <p>
          Hybrid: client-side for loaded, server-side for all. Pros: Instant for loaded (client), full dataset (server), best of both. Cons: Complexity (two search paths), sync issues (client vs. server results). Best for: Most production systems—client for quick search, server for advanced.
        </p>

        <h3>Export: Client-Side vs. Server-Side</h3>
        <p>
          Client-side export (generate in browser). Pros: No server load (client generates), instant (no queue), privacy (data doesn&apos;t leave browser). Cons: Limited by browser (memory, performance), slow for large exports (browser JS), inconsistent (browser differences). Best for: Small exports (&lt;1000 rows), privacy-focused (don&apos;t send data), simple exports (CSV only).
        </p>
        <p>
          Server-side export (generate on backend). Pros: Handle large exports (server resources), consistent (same output), multiple formats (CSV, PDF, QBO). Cons: Server load (generate exports), queue for large (wait time), privacy (data processed on server). Best for: Large exports (&gt;1000 rows), multiple formats, production systems.
        </p>
        <p>
          Hybrid: client for small, server for large. Pros: Instant for small (client), handle large (server), balance load. Cons: Complexity (two paths), threshold decision (when to switch). Best for: Most production systems—client for &lt;1000 rows, server for &gt;1000.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/transaction-history-ui/display-options.svg"
          alt="Display Options Comparison"
          caption="Figure 4: Display Options Comparison — Table, card, and grouped view options"
          width={1000}
          height={450}
        />

        <h3>Grouping: By Period vs. Flat List</h3>
        <p>
          Grouped by period (month, quarter, year). Pros: Easier scanning (grouped), totals per period (monthly spending), natural organization (time-based). Cons: Extra clicks (expand groups), hidden data (collapsed groups), complex implementation (grouping logic). Best for: Long histories (&gt;3 months), expense tracking (monthly totals), most production systems.
        </p>
        <p>
          Flat list (all transactions in order). Pros: Simple (no grouping), all visible (no expansion), fast (no grouping logic). Cons: Hard to scan (no organization), no totals (must calculate), overwhelming (long lists). Best for: Short histories (&lt;3 months), simple use cases, performance-critical (no grouping overhead).
        </p>
        <p>
          User choice (toggle grouping). Pros: User preference (choose view), flexibility (grouped or flat). Cons: Complexity (two views), toggle UI (extra control). Best for: Most production systems—default grouped, option for flat.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Provide multiple views:</strong> Table (desktop), cards (mobile), grouped (by month). Let users choose (view toggle). Default: table (desktop), cards (mobile), grouped (by month).
          </li>
          <li>
            <strong>Implement fast search:</strong> Server-side search (indexed), debounced input (300ms), highlight matches (bold text). Advanced search: multiple fields, date range, amount range.
          </li>
          <li>
            <strong>Support multiple exports:</strong> CSV (accounting), PDF (records), QBO (QuickBooks). Date range (last 30 days, custom). Filter application (export filtered results). Email large exports (don&apos;t wait).
          </li>
          <li>
            <strong>Provide receipt access:</strong> Individual receipt (per transaction), bulk download (selected, all). Customize receipt (PO number, cost center). Email receipt (send to accountant).
          </li>
          <li>
            <strong>Handle disputes gracefully:</strong> Easy dispute initiation (per transaction), status tracking (timeline, updates), evidence upload (photos, documents), resolution communication (email, in-app).
          </li>
          <li>
            <strong>Optimize for performance:</strong> Pagination (20-50 per page), lazy loading (load on scroll), caching (repeat queries), indexing (date, amount, description).
          </li>
          <li>
            <strong>Persist filter state:</strong> URL params (shareable, bookmarkable), local storage (restore on return), user preferences (default filters).
          </li>
          <li>
            <strong>Support accessibility:</strong> Keyboard navigation (tab through transactions), screen reader (announce transaction details), high contrast (status badges), large touch targets (mobile).
          </li>
          <li>
            <strong>Provide context:</strong> Transaction details (expand for more), related transactions (same order, subscription), running balance (if applicable).
          </li>
          <li>
            <strong>Enable sharing:</strong> Share transaction (email, link), share filters (URL params), share export (email to accountant).
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
            <strong>No export:</strong> Can&apos;t export for accounting. Solution: CSV export (accounting), PDF export (records), QBO export (QuickBooks).
          </li>
          <li>
            <strong>Poor mobile support:</strong> Table doesn&apos;t fit mobile. Solution: Card view (mobile), horizontal scroll (table), hide columns (show key info).
          </li>
          <li>
            <strong>No grouping:</strong> Flat list hard to scan. Solution: Group by month/quarter, collapsible groups, group totals.
          </li>
          <li>
            <strong>No receipt access:</strong> Can&apos;t download receipts. Solution: Individual receipt (per transaction), bulk download (selected, all), email receipt.
          </li>
          <li>
            <strong>Hard to dispute:</strong> No dispute flow. Solution: Per-transaction dispute, status tracking, evidence upload, resolution communication.
          </li>
          <li>
            <strong>Performance issues:</strong> Slow for large histories. Solution: Pagination, lazy loading, caching, indexing.
          </li>
          <li>
            <strong>Filters not persistent:</strong> Lose filters on navigation. Solution: URL params, local storage, user preferences.
          </li>
          <li>
            <strong>No accessibility:</strong> Keyboard-only users can&apos;t navigate. Solution: Keyboard navigation, screen reader support, high contrast, large touch targets.
          </li>
          <li>
            <strong>Poor error handling:</strong> Export fails, no feedback. Solution: Error messages, retry option, email when ready (large exports).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>PayPal Transaction History</h3>
        <p>
          PayPal transaction history: comprehensive financial records. Features: table view (all transactions), filters (date, type, status), search (by name, email, transaction ID). Export: CSV (accounting), PDF (records), custom date range. Receipts: individual download, bulk download. Disputes: per-transaction dispute, status tracking, evidence upload.
        </p>

        <h3 className="mt-6">Stripe Dashboard Transaction History</h3>
        <p>
          Stripe dashboard: payment transaction history. Features: table view (payments, refunds, disputes), filters (date, status, payment method), search (customer, charge ID). Export: CSV (accounting), custom date range, filtered export. Receipts: payment receipt (email, download), invoice (PDF). Disputes: dispute management, evidence upload, status tracking.
        </p>

        <h3 className="mt-6">Amazon Order History</h3>
        <p>
          Amazon order history: purchase transaction history. Features: grouped by year (2024, 2023), filters (date, status), search (product, order number). Export: order history report (CSV, custom date range). Receipts: invoice (PDF, per order), bulk invoice (selected orders). Returns: per-order return, return tracking, refund status.
        </p>

        <h3 className="mt-6">Chase Bank Transaction History</h3>
        <p>
          Chase bank: banking transaction history. Features: table view (deposits, withdrawals, transfers), filters (date, type, amount), search (description, amount). Export: CSV, QBO (QuickBooks), custom date range. Receipts: check images (deposited checks), statements (PDF, monthly). Disputes: dispute transaction, fraud report, provisional credit.
        </p>

        <h3 className="mt-6">Netflix Billing History</h3>
        <p>
          Netflix billing history: subscription transaction history. Features: list view (monthly charges), filters (date, status), search (none, simple history). Export: billing history (PDF, email), custom date range. Receipts: invoice (email, per billing), download invoice (PDF). Issues: payment issue (update payment method), billing question (contact support).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle large transaction histories?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Pagination (20-50 per page), lazy loading (load on scroll), server-side search (indexed), caching (repeat queries), archiving (old transactions to cold storage). Export: stream large exports (don&apos;t load all in memory), background generation (notify when ready), email large exports (don&apos;t wait for download).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement fast search?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Server-side search (Elasticsearch, Algolia), search index (description, amount, date, order number), debounced input (wait 300ms after typing), cached results (repeat searches), highlight matches (bold matching text). Advanced: fuzzy search (typo tolerance), synonym search (refund = credit), field-specific search (order_number:12345).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle disputed transactions?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Dispute flow: per-transaction dispute button, reason selection (unauthorized, not received, defective), evidence upload (photos, documents), submission confirmation (case number). Tracking: timeline (submitted, under review, resolved), status updates (email/SMS), estimated resolution. Resolution: provisional credit (during review), final decision (customer/merchant wins), appeal option (if unsatisfied).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you support multiple export formats?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> CSV: comma-separated, UTF-8, header row (for accounting). PDF: styled document, printable, professional layout (for records). QBO: QuickBooks format, account mapping (for QuickBooks Desktop). Implementation: server-side generation (handle large exports), queue long exports (email when ready), progress indicator (generating export).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize transaction history for mobile?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Card view (not table), large touch targets (44x44px), swipe actions (receipt, dispute), simplified filters (modal, not sidebar), lazy loading (load on scroll), offline support (cache recent transactions). Performance: fast load (&lt;3 seconds), minimal data transfer (only needed fields), image optimization (receipt thumbnails).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you aggregate transactions from multiple sources?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Data sources: orders (e-commerce), subscriptions (recurring), refunds (returns), credits (store credit). Normalization: unified format (transaction ID, description, amount, date, type, status, source). API: aggregation endpoint (fetch from all sources), cache results (repeat queries), incremental updates (new transactions since last fetch).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.paypal.com/us/smarthelp/article/what-is-the-transaction-history-in-my-paypal-account-faq393"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PayPal — Transaction History Guide
            </a>
          </li>
          <li>
            <a
              href="https://stripe.com/docs/dashboard/reports"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe — Reports &amp; Export
            </a>
          </li>
          <li>
            <a
              href="https://www.amazon.com/gp/help/customer/display.html?nodeId=201911160"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon — Order History &amp; Reports
            </a>
          </li>
          <li>
            <a
              href="https://www.chase.com/personal/checking/online-banking-features/transaction-history"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chase — Transaction History Features
            </a>
          </li>
          <li>
            <a
              href="https://help.netflix.com/en/node/410"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix — Billing History &amp; Invoices
            </a>
          </li>
          <li>
            <a
              href="https://quickbooks.intuit.com/learn-support/en-us/reports-and-accounting/export-transactions-to-excel/00/238863"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              QuickBooks — Export Transactions Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
