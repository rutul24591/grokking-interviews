"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-refund-request-ui",
  title: "Refund Request UI",
  description:
    "Comprehensive guide to implementing refund request interfaces covering refund eligibility, return reasons, refund methods, return shipping labels, refund status tracking, and customer communication for e-commerce returns.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "refund-request-ui",
  version: "extensive",
  wordCount: 5600,
  readingTime: 22,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "refund",
    "returns",
    "frontend",
    "customer-service",
    "e-commerce",
  ],
  relatedTopics: ["order-tracking-ui", "payment-processing", "customer-support", "order-management-service"],
};

export default function RefundRequestUIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Refund request UI enables customers to self-serve returns and refunds: request refund, select items, choose reason, select refund method (original payment, store credit, exchange), print return label, and track refund status. A well-designed refund UI reduces support tickets (customers help themselves), improves customer satisfaction (easy returns), and provides valuable data (why customers return). For staff and principal engineers, refund UI involves eligibility rules (return window, item condition), refund calculation (proration, restocking fees), return logistics (shipping labels, drop-off locations), and fraud prevention (return abuse detection).
        </p>
        <p>
          The complexity of refund UI extends beyond simple form submission. Eligibility varies by item (some non-returnable), purchase date (return window), condition (used vs. new), and reason (defective vs. changed mind). Refund calculation includes original price, shipping cost (refundable?), restocking fees (electronics), return shipping cost (free for defective, customer-paid for changed mind). Return logistics: print label (PDF), QR code (drop-off without printing), pickup scheduling (carrier pickup). The UI must handle edge cases (partial returns, gift returns, international returns) gracefully with clear communication.
        </p>
        <p>
          For staff and principal engineers, refund UI architecture involves backend integration (order API, refund API, shipping API), state management (refund request status, return tracking), and customer communication (email notifications, status updates). Analytics track return rate (returns / purchases), return reasons (defective, wrong size, changed mind), refund method preference (original payment, store credit), and return abuse (frequent returners). The system must support multiple return policies (30-day, 90-day, lifetime), multiple refund methods (original payment, store credit, exchange), and multiple return shipping options (drop-off, pickup, mail).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Refund Eligibility</h3>
        <p>
          Return window defines when returns are accepted. Standard: 30 days from delivery (most e-commerce). Extended: 60-90 days (holiday season, premium customers). Lifetime: defective items only (warranty). Display: &quot;Return by Dec 30&quot; (specific date), &quot;30 days from delivery&quot; (relative). Expired: &quot;Return window closed&quot; (no refund, may offer store credit as exception).
        </p>
        <p>
          Item eligibility varies by product type. Returnable: most items (clothing, electronics, home goods). Non-returnable: personalized items (custom engraving), perishables (food, flowers), intimate items (underwear, earrings), digital goods (software, ebooks), gift cards. Condition requirements: new with tags (clothing), original packaging (electronics), unused (all items). Display: &quot;Eligible for return&quot; (green checkmark), &quot;Non-returnable&quot; (gray, tooltip why).
        </p>
        <p>
          Refund amount calculation includes price, shipping, fees. Original price: full refund (defective, wrong item), partial refund (used, damaged by customer). Shipping cost: refundable (defective, wrong item), non-refundable (changed mind). Restocking fee: electronics (15%), opened software (25%), special order items (50%). Return shipping: free (defective, wrong item), customer-paid (changed mind). Display: &quot;Refund: $99.00 (item) + $9.99 (shipping) - $14.85 (restocking) = $94.14&quot;.
        </p>

        <h3 className="mt-6">Return Reasons</h3>
        <p>
          Return reasons capture why customer is returning. Categories: product issue (defective, damaged, not as described), fit issue (too small, too large, doesn&apos;t fit), preference (changed mind, don&apos;t like color, found better price), other (gift duplicate, ordered by mistake). Follow-up: dynamic based on category (&quot;What&apos;s defective?&quot; for product issue, &quot;What size did you order?&quot; for fit). Open text: &quot;Anything else?&quot; (optional, product feedback).
        </p>
        <p>
          Reason analytics inform business decisions. Product issues: quality problems (improve manufacturing), description accuracy (update product photos, descriptions). Fit issues: sizing chart accuracy (update measurements, add fit reviews), size recommendation algorithm. Preference: pricing competitiveness (adjust prices), product variety (add more colors, styles). Analytics: track by category (electronics vs. clothing), by product (high return items), by customer (frequent returners).
        </p>
        <p>
          Reason-based routing directs returns appropriately. Defective: quality team review, replacement offered, return shipping free. Wrong item: fulfillment review, replacement sent, return shipping free. Changed mind: standard return, customer pays shipping. Fraud detection: frequent returns (same customer, same reason), high-value returns (manager approval), suspicious patterns (buy multiple, return most).
        </p>

        <h3 className="mt-6">Refund Methods</h3>
        <p>
          Original payment refund returns money to original payment method. Credit/debit card: refund to card (3-10 business days to appear). PayPal: refund to PayPal account (instant). Store credit: refund to store account (instant, use for future purchases). Pros: customer preference (money back), standard expectation. Cons: processing time (card refunds slow), fees (merchant pays processing fees).
        </p>
        <p>
          Store credit refund provides credit for future purchases. Amount: full refund amount, sometimes bonus (+10% for store credit vs. original payment). Expiry: none (never expires), 1 year (use within year). Usage: automatic at checkout (apply store credit), manual (select store credit as payment). Pros: instant (available immediately), retains customer (must shop here), no processing fees. Cons: customer may prefer money, limited to this store.
        </p>
        <p>
          Exchange refund replaces item with different item. Same item: different size/color (free exchange). Different item: price difference (pay more or receive credit). Process: return original, ship replacement (simultaneous or sequential). Pros: customer gets what they want, retains sale. Cons: complexity (two shipments), cost (double shipping). Display: &quot;Exchange for different size&quot; (free), &quot;Exchange for different item&quot; (price difference applies).
        </p>

        <h3 className="mt-6">Return Shipping</h3>
        <p>
          Return label generation provides shipping label for return. Print label: PDF download (print at home, attach to package). QR code: show at drop-off (no printing needed, carrier prints). Pickup: schedule carrier pickup (from home/office, fee may apply). Label content: return address, barcode, tracking number, weight limit. Display: &quot;Print label&quot; (PDF button), &quot;QR code&quot; (mobile-friendly), &quot;Schedule pickup&quot; (calendar picker).
        </p>
        <p>
          Drop-off locations provide convenient return drop-off. Carrier locations: UPS Store, FedEx Office, USPS Post Office. Retail partners: Whole Foods (Amazon returns), CVS/Walgreens (photo center returns). Locker locations: Amazon Locker, UPS Locker (24/7 access). Display: map view (nearest locations), list view (address, hours), directions (Google Maps link). Hours: &quot;Open until 8 PM&quot;, &quot;24/7&quot; (locker).
        </p>
        <p>
          Return tracking monitors return package status. States: label created (ready to ship), in transit (on way to warehouse), received (at warehouse), processing (inspection), refund issued (refund processed). Notification: email/SMS at each state. Display: timeline (like order tracking), estimated refund date (&quot;Refund in 3-5 days after received&quot;). Exception: package lost (contact carrier), damaged in transit (insurance claim).
        </p>

        <h3 className="mt-6">Refund Processing</h3>
        <p>
          Refund inspection verifies item condition on receipt. Pass: item as expected (new, tags attached, original packaging) → refund issued. Fail: item used/damaged (wear marks, missing tags, opened packaging) → partial refund or return to customer. Display: &quot;Refund issued&quot; (pass), &quot;Partial refund: $50 (used condition)&quot; (fail), &quot;Item returned to you&quot; (unacceptable condition). Notification: email with inspection result, refund amount, photos if damaged.
        </p>
        <p>
          Refund issuance processes refund payment. Timing: immediate (store credit), 3-5 business days (original payment after inspection), 7-10 business days (card processing). Amount: full (pass inspection), partial (fail inspection, restocking fee). Method: original payment (card, PayPal), store credit (account credit), exchange (ship replacement). Notification: email (&quot;Refund issued&quot;), SMS (opt-in), app notification.
        </p>
        <p>
          Refund status tracking shows refund progress. States: return shipped (customer shipped), return received (warehouse received), inspection (quality check), refund issued (refund processed), refund completed (money in account). Display: timeline (like order tracking), estimated completion date (&quot;Refund complete by Dec 20&quot;). Notification: email at each state, especially &quot;Refund issued&quot; (customer wants to know).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Refund request UI architecture spans eligibility check, return form, label generation, and status tracking. Eligibility check validates return window, item eligibility, condition. Return form captures items, reason, refund method. Label generation creates shipping label (PDF, QR code). Status tracking shows return and refund progress.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/refund-request-ui/refund-request-architecture.svg"
          alt="Refund Request Architecture"
          caption="Figure 1: Refund Request Architecture — Eligibility check, return form, label generation, and status tracking"
          width={1000}
          height={500}
        />

        <h3>Eligibility Check Component</h3>
        <p>
          Order selection shows eligible orders. Filter: date range (last 30 days, last 90 days, custom), status (delivered, partially delivered). Display: order number, delivery date, items, &quot;Return by&quot; date. Expired: grayed out (&quot;Return window closed&quot;), may offer store credit exception. Multiple orders: select items from different orders (consolidated return).
        </p>
        <p>
          Item eligibility shows which items can be returned. Eligible: green checkmark, &quot;Eligible until Dec 30&quot;. Non-returnable: gray, tooltip (&quot;Personalized items cannot be returned&quot;). Already returned: gray, &quot;Returned on Nov 15&quot;. Partial returns: &quot;2 of 3 items remaining&quot; (some already returned). Display: checkbox (select items to return), quantity (if multiple of same item).
        </p>
        <p>
          Refund estimate shows expected refund amount. Breakdown: item price ($99.00), shipping ($9.99), restocking fee (-$14.85), return shipping (-$9.99), total ($84.15). Refund method: original payment (3-10 days), store credit (instant, +$8.42 bonus). Display: &quot;You&apos;ll receive $84.15&quot;, &quot;Refund method: Original payment&quot;, &quot;Estimated: Dec 20-27&quot;.
        </p>

        <h3 className="mt-6">Return Form</h3>
        <p>
          Reason selection captures return reason. Categories: product issue, fit issue, preference, other. Sub-options: dynamic based on category (defective, damaged for product issue; too small, too large for fit). Follow-up: &quot;What&apos;s defective?&quot; (text), &quot;What size did you order?&quot; (dropdown). Open text: &quot;Anything else?&quot; (optional). Display: radio buttons (categories), dropdown (sub-options), text area (follow-up).
        </p>
        <p>
          Refund method selection chooses refund type. Options: original payment (&quot;Refund to Visa •••• 1234&quot;), store credit (&quot;Instant store credit + 10% bonus&quot;), exchange (&quot;Exchange for different size/color&quot;). Display: radio buttons, description (processing time, bonus), recommendation (&quot;Fastest: Store credit&quot;). Default: original payment (standard), store credit (if offered bonus).
        </p>
        <p>
          Return shipping selection chooses return method. Options: print label (PDF download), QR code (mobile, no printing), pickup (schedule carrier pickup). Drop-off locations: map view (nearest), list view (address, hours). Display: radio buttons (shipping method), map (drop-off locations), calendar (pickup scheduling). Cost: free (defective), customer-paid (changed mind, deducted from refund).
        </p>

        <h3 className="mt-6">Label Generation</h3>
        <p>
          PDF label generation creates printable return label. Content: return address, barcode, tracking number, weight limit, instructions (&quot;Pack securely&quot;). Format: letter size (8.5x11), fits in standard envelope. Download: PDF button, email label (send to email). Display: &quot;Print label&quot; button, &quot;Email label&quot; link, instructions (&quot;Attach to package, drop off at UPS&quot;).
        </p>
        <p>
          QR code generation creates scannable return code. Content: encoded return ID, tracking number. Usage: show at drop-off (carrier scans, prints label). Display: QR code (mobile-friendly), instructions (&quot;Show at UPS Store, no printing needed&quot;). Benefits: no printer needed, eco-friendly (no paper), convenient (mobile-only). Expiry: 30 days (use within return window).
        </p>
        <p>
          Pickup scheduling schedules carrier pickup. Calendar: select date (available dates), time window (morning, afternoon, evening). Location: pickup address (default shipping address, edit option). Instructions: &quot;Leave at front door&quot;, &quot;Ring doorbell&quot;. Cost: free (defective), fee for changed mind ($5-10). Confirmation: email/SMS confirmation, reminder day before.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/refund-request-ui/refund-flow.svg"
          alt="Refund Request Flow"
          caption="Figure 2: Refund Request Flow — Eligibility, reason, refund method, label, and tracking"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Status Tracking</h3>
        <p>
          Return tracking shows return package status. States: label created (ready to ship), in transit (on way), received (at warehouse), inspection (quality check), refund issued (refund processed). Display: timeline (like order tracking), timestamps (when each state), estimated next state (&quot;Refund issued by Dec 20&quot;). Notification: email/SMS at each state, especially &quot;Received&quot; and &quot;Refund issued&quot;.
        </p>
        <p>
          Refund tracking shows refund payment status. States: refund issued (merchant processed), refund pending (bank processing), refund completed (money in account). Display: timeline, estimated completion (&quot;Refund complete by Dec 27&quot;), refund amount ($84.15). Method: original payment (card last 4 digits), store credit (account balance). Notification: &quot;Refund issued&quot; email, &quot;Refund completed&quot; email.
        </p>
        <p>
          Exception handling manages return issues. Package lost: contact carrier (tracking shows no movement), resend label, refund without return. Damaged in transit: insurance claim, refund customer (merchant claims insurance). Inspection fail: partial refund offer (customer accepts or item returned), photos of damage. Display: &quot;Issue detected&quot;, explanation, options (accept partial, return item), support contact.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/refund-request-ui/refund-status.svg"
          alt="Refund Status Tracking"
          caption="Figure 3: Refund Status Tracking — Return tracking, refund tracking, and exception handling"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Refund UI design involves trade-offs between customer convenience, fraud prevention, operational cost, and customer experience. Understanding these trade-offs enables informed decisions aligned with business model and customer expectations.
        </p>

        <h3>Return Window: Short vs. Long</h3>
        <p>
          Short return window (14-30 days). Pros: Lower return rate (customers must decide quickly), faster inventory turnover (returned items resold quickly), lower fraud (less time for return abuse). Cons: Customer pressure (must decide fast), competitive disadvantage (competitors offer longer), lower satisfaction (may miss window). Best for: Fast fashion (trend-driven), electronics (rapid depreciation), perishables.
        </p>
        <p>
          Long return window (60-90 days, holiday extended). Pros: Customer-friendly (plenty of time), competitive advantage (better than competitors), higher satisfaction (no pressure). Cons: Higher return rate (customers buy multiple, return later), slower inventory turnover, higher fraud (more time for abuse). Best for: Clothing (try at home), high-value items (considered purchase), holiday season (gifts).
        </p>
        <p>
          Tiered return window (standard vs. premium customers). Pros: Rewards loyalty (premium gets longer), balances cost (standard = short, premium = long). Cons: Complexity (two policies), customer confusion (why different?). Best for: Most production systems—standard 30 days, premium (VIP, credit card) 60-90 days.
        </p>

        <h3>Return Shipping: Free vs. Customer-Paid</h3>
        <p>
          Free return shipping. Pros: Customer-friendly (no cost), higher conversion (less risk), competitive advantage (Amazon standard). Cons: Higher cost (merchant pays), higher return rate (easier to return), return abuse (buy multiple, return most). Best for: Large merchants (absorb cost), competitive markets (customer expectation), defective/wrong items (merchant fault).
        </p>
        <p>
          Customer-paid return shipping. Pros: Lower cost (customer pays), lower return rate (friction), less abuse (cost deterrent). Cons: Lower conversion (higher risk), customer frustration (unexpected cost), competitive disadvantage. Best for: Small merchants (can&apos;t absorb cost), low-margin items, changed mind returns (customer fault).
        </p>
        <p>
          Hybrid: free for defective/wrong, customer-paid for changed mind. Pros: Fair (merchant pays for their mistakes), balances cost with experience. Cons: Complexity (two policies), inspection required (determine reason). Best for: Most production systems—free for merchant fault, customer-paid for customer preference.
        </p>

        <h3>Refund Method: Original Payment vs. Store Credit</h3>
        <p>
          Original payment refund (money back). Pros: Customer preference (money back), standard expectation, builds trust. Cons: Processing fees (merchant pays), slow (3-10 days), customer may not return. Best for: Most returns (customer expectation), defective/wrong items (merchant fault).
        </p>
        <p>
          Store credit refund (account credit). Pros: Instant (available immediately), retains customer (must shop here), no processing fees, bonus incentive (+10%). Cons: Customer may prefer money, limited to this store, liability (unused credit on books). Best for: Changed mind returns (offer bonus), frequent shoppers (will use credit), small merchants (retain cash).
        </p>
        <p>
          Choice: customer selects refund method. Pros: Customer control (choose what works), satisfaction (their choice). Cons: Complexity (two flows), store credit cost (bonus). Best for: Most production systems—default original payment, offer store credit with bonus.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/refund-request-ui/refund-methods.svg"
          alt="Refund Methods Comparison"
          caption="Figure 4: Refund Methods Comparison — Original payment, store credit, and exchange options"
          width={1000}
          height={450}
        />

        <h3>Inspection: Automatic vs. Manual</h3>
        <p>
          Automatic refund (no inspection). Pros: Fast (refund immediately), low operational cost (no inspection), customer satisfaction (instant). Cons: Fraud risk (empty box, bricks), condition unknown (may be used), inventory uncertainty (resell risk). Best for: Low-value items (not worth inspection), trusted customers (VIP, low return history), digital goods (no physical return).
        </p>
        <p>
          Manual inspection (verify condition). Pros: Fraud prevention (verify item), condition verified (resell confidence), accurate refund (partial if used). Cons: Slow (3-5 days inspection), operational cost (labor), customer wait (refund delayed). Best for: High-value items (electronics, jewelry), frequent returners (fraud risk), defective claims (verify defect).
        </p>
        <p>
          Hybrid: automatic for trusted, manual for risk. Pros: Balances speed with security, good customers fast, risk customers verified. Cons: Complexity (two flows), customer segmentation (who is trusted?). Best for: Most production systems—automatic for VIP/low-risk, manual for new/high-risk.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Make eligibility clear:</strong> Show &quot;Return by&quot; date, eligible items (green checkmark), non-returnable (gray, tooltip). Expired: clear message, may offer store credit exception.
          </li>
          <li>
            <strong>Simplify reason selection:</strong> Categories (product, fit, preference), sub-options (dynamic), follow-up (text/dropdown). Analytics: track reasons (improve product, sizing).
          </li>
          <li>
            <strong>Offer refund method choice:</strong> Original payment (standard), store credit (instant, bonus), exchange (different size/item). Display processing time, bonus amount.
          </li>
          <li>
            <strong>Provide multiple return shipping options:</strong> Print label (PDF), QR code (mobile), pickup (schedule). Drop-off locations: map view, hours, directions.
          </li>
          <li>
            <strong>Show refund estimate upfront:</strong> Item price, shipping, fees, net refund. Refund method impact (store credit +10%). Estimated timeline (when refund complete).
          </li>
          <li>
            <strong>Track return and refund status:</strong> Timeline (like order tracking), timestamps, estimated next state. Notification: email/SMS at each state.
          </li>
          <li>
            <strong>Handle exceptions gracefully:</strong> Package lost (resend label, refund), damaged in transit (insurance, refund), inspection fail (partial refund offer).
          </li>
          <li>
            <strong>Prevent fraud:</strong> Return limits (per customer, per period), high-value approval (manager), pattern detection (frequent returns, same reason).
          </li>
          <li>
            <strong>Optimize for mobile:</strong> QR code (no printing), mobile-friendly form, SMS notifications, app integration (scan QR, track status).
          </li>
          <li>
            <strong>Communicate clearly:</strong> Confirmation email (return details, label, instructions), status updates (received, inspection, refund), completion email (refund issued).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Unclear eligibility:</strong> Customer doesn&apos;t know if eligible. Solution: Show &quot;Return by&quot; date, eligible items, non-returnable tooltip.
          </li>
          <li>
            <strong>Hidden fees:</strong> Customer surprised by restocking, return shipping. Solution: Show refund estimate upfront (all fees itemized).
          </li>
          <li>
            <strong>Limited refund methods:</strong> Only original payment (slow). Solution: Offer store credit (instant, bonus), exchange (different size/item).
          </li>
          <li>
            <strong>No tracking:</strong> Customer doesn&apos;t know return status. Solution: Return tracking (like order tracking), notifications at each state.
          </li>
          <li>
            <strong>Slow refunds:</strong> Weeks for refund. Solution: Automatic for low-risk, instant store credit, clear timeline (3-10 days for card).
          </li>
          <li>
            <strong>Complex return form:</strong> Too many fields, confusing. Solution: Simple form (items, reason, method), progressive disclosure (follow-up based on reason).
          </li>
          <li>
            <strong>No mobile support:</strong> Must print label. Solution: QR code (mobile, no printing), SMS notifications, app integration.
          </li>
          <li>
            <strong>Poor exception handling:</strong> Lost package, no recourse. Solution: Resend label, refund without return, insurance claim.
          </li>
          <li>
            <strong>No fraud prevention:</strong> Return abuse unchecked. Solution: Return limits, high-value approval, pattern detection.
          </li>
          <li>
            <strong>Poor communication:</strong> Customer doesn&apos;t know what&apos;s happening. Solution: Confirmation email, status updates, completion email.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Amazon Returns</h3>
        <p>
          Amazon returns: self-service portal. Features: select order, items, reason, refund method (original, Amazon credit). Return shipping: QR code (Whole Foods, UPS), print label, pickup. Instant refund: for trusted customers (refund before return received). Drop-off: Amazon Locker, Whole Foods, UPS Store. Tracking: return and refund status in order history.
        </p>

        <h3 className="mt-6">Zara Returns</h3>
        <p>
          Zara returns: in-store or mail. Features: select order, items, reason. Refund method: original payment, store credit. Return shipping: free (mail or in-store). In-store: instant refund (card or store credit). Mail: print label, drop-off at post office. Tracking: email notifications (received, refund issued). Timeline: 30 days from purchase.
        </p>

        <h3 className="mt-6">Best Buy Returns</h3>
        <p>
          Best Buy returns: in-store or mail. Features: select order, items, reason. Refund method: original payment, store credit. Return shipping: free (mail or in-store). In-store: instant refund. Mail: print label, drop-off at UPS. Restocking fee: electronics (15%), opened software (25%). Timeline: 15-60 days (My Best Buy members get extended).
        </p>

        <h3 className="mt-6">Nordstrom Returns</h3>
        <p>
          Nordstrom returns: legendary return policy. Features: select order, items, reason. Refund method: original payment, store credit, exchange. Return shipping: free (mail or in-store). No restocking fees. No strict timeline (case-by-case). In-store: instant refund. Mail: print label, drop-off at UPS. Tracking: email notifications.
        </p>

        <h3 className="mt-6">Apple Returns</h3>
        <p>
          Apple returns: in-store or mail. Features: select order, items, reason. Refund method: original payment, store credit. Return shipping: free (mail or in-store). In-store: instant refund. Mail: print label, drop-off at UPS. Restocking: none (Apple policy). Timeline: 14 days from delivery. Tracking: email notifications, order status page.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you determine refund eligibility?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Check return window (delivery date + policy days), item eligibility (non-returnable items), condition (new, used, damaged), previous returns (already returned). Display: &quot;Eligible until Dec 30&quot; (green), &quot;Non-returnable&quot; (gray, tooltip), &quot;Return window closed&quot; (expired, may offer store credit).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate refund amount?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Original price (full for defective, partial for used), shipping cost (refundable for merchant fault, non-refundable for customer), restocking fee (electronics 15%, opened software 25%), return shipping (free for defective, customer-paid for changed mind). Display: itemized breakdown (&quot;$99 + $9.99 - $14.85 = $94.14&quot;).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle return shipping?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Multiple options: print label (PDF download), QR code (mobile, no printing), pickup (schedule carrier). Drop-off locations: map view (nearest), list view (address, hours). Cost: free (defective, wrong item), customer-paid (changed mind, deducted from refund). Tracking: return package tracking (like order tracking).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you prevent return fraud?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Return limits (per customer, per period), high-value approval (manager review), pattern detection (frequent returns, same reason, buy multiple return most), inspection (verify item condition), account flags (frequent returner, require approval). Balance: fraud prevention vs. customer experience (don&apos;t punish good customers).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle inspection failures?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Inspection fail (used, damaged, missing tags): partial refund offer (customer accepts or item returned), photos of damage (evidence), explanation (&quot;Item shows wear, refund reduced 50%&quot;). Options: accept partial refund, return item to customer (no refund), escalate (customer service review). Notification: email with photos, options, deadline to respond.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize refund UI for mobile?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> QR code (no printing needed), mobile-friendly form (large inputs, dropdowns), SMS notifications (opt-in), app integration (scan QR, track status), camera upload (photos of defect), map view (drop-off locations), one-tap actions (schedule pickup, print label). Performance: fast load (&lt;3 seconds), offline support (save draft).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.amazon.com/gp/help/customer/display.html?nodeId=15464781"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon — Returns &amp; Refunds Policy
            </a>
          </li>
          <li>
            <a
              href="https://www.zara.com/us/en/help/returns-and-refunds-l1066.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zara — Returns &amp; Refunds
            </a>
          </li>
          <li>
            <a
              href="https://www.bestbuy.com/site/help-topics/return-exchange-policy/pcmcat260800050012.c"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Best Buy — Return &amp; Exchange Policy
            </a>
          </li>
          <li>
            <a
              href="https://www.nordstrom.com/browse/customer-service/returns-exchanges"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nordstrom — Returns &amp; Exchanges
            </a>
          </li>
          <li>
            <a
              href="https://www.apple.com/shop/help/returns_refund"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple — Returns &amp; Refunds
            </a>
          </li>
          <li>
            <a
              href="https://www.naruc.org/consumer-resources/return-and-refund-policies/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              NARUC — Return and Refund Policies Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
