"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-frontend-confirmation-screens",
  title: "Confirmation Screens",
  description:
    "Comprehensive guide to implementing confirmation screens covering order confirmation, booking confirmation, payment confirmation, next steps communication, receipt delivery, and post-purchase engagement for e-commerce and service businesses.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "confirmation-screens",
  version: "extensive",
  wordCount: 5600,
  readingTime: 22,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "confirmation",
    "checkout",
    "frontend",
    "post-purchase",
    "customer-experience",
  ],
  relatedTopics: ["checkout-flow", "booking-workflows", "order-tracking-ui", "email-delivery-services"],
};

export default function ConfirmationScreensArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Confirmation screens provide post-purchase/post-booking confirmation: order confirmed, booking confirmed, payment successful. This is the final step in the transaction flow and sets the tone for the customer relationship. A well-designed confirmation screen reduces anxiety (confirmation received), sets expectations (what happens next), and drives engagement (what to do next). For staff and principal engineers, confirmation screens involve order/booking data display, next steps communication (shipping, preparation), receipt delivery (email, download), and post-purchase engagement (account creation, related products, referral programs).
        </p>
        <p>
          The complexity of confirmation screens extends beyond simple &quot;Thank You&quot; message. Order details must be accurate (items, quantities, prices, shipping address). Next steps must be clear (when ships, when arrives, how to track). Receipt must be accessible (email, download, print). Post-purchase engagement must be relevant (related products, account creation, referral program) without being pushy. The screen must handle edge cases (payment pending, out of stock items, booking waitlist) gracefully with clear messaging.
        </p>
        <p>
          For staff and principal engineers, confirmation screen architecture involves data aggregation (order/booking details, customer info, payment info), notification triggering (confirmation email, SMS), and analytics tracking (conversion completed, revenue tracked). The system must support multiple confirmation types (order confirmation, booking confirmation, payment confirmation, subscription confirmation), multiple delivery methods (email, SMS, push), and multiple post-purchase actions (track order, modify booking, download receipt, create account).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Confirmation Message</h3>
        <p>
          Confirmation headline confirms transaction success. Message: &quot;Order Confirmed&quot; (e-commerce), &quot;Booking Confirmed&quot; (services), &quot;Payment Successful&quot; (payments). Tone: celebratory (&quot;Thank you!&quot;), reassuring (&quot;You&apos;re all set&quot;), professional (&quot;Confirmation received&quot;). Display: large heading (top of page), checkmark icon (green, success), order/booking number (prominent, copyable).
        </p>
        <p>
          Order/booking summary shows what was purchased/booked. Order: items (thumbnail, name, quantity, price), subtotal, shipping, tax, total. Booking: service (name, description), date/time, location, staff, price, duration. Display: table (order items), list (booking details), collapsible (show/hide details). Actions: view details (expand), print (print receipt), download (PDF receipt).
        </p>
        <p>
          Confirmation number provides reference for support. Format: alphanumeric (ABC123), numeric (123456), with check digit (prevent typos). Display: prominent (top of page), copyable (click to copy), searchable (in order history). Use cases: customer support (&quot;What&apos;s your order number?&quot;), in-store pickup (&quot;Show confirmation number&quot;), returns (&quot;Enter order number&quot;).
        </p>

        <h3 className="mt-6">Next Steps Communication</h3>
        <p>
          Shipping/delivery timeline sets delivery expectations. E-commerce: &quot;Ships by Dec 20&quot; (processing time), &quot;Arrives Dec 22-24&quot; (delivery window), &quot;Track your order&quot; (tracking link). Services: &quot;We&apos;ll confirm 24 hours before&quot; (reminder), &quot;Arrive 10 minutes early&quot; (arrival time), &quot;Bring ID&quot; (requirements). Display: timeline (visual), text (clear dates), calendar invite (add to calendar).
        </p>
        <p>
          Preparation instructions prepare customer for service/delivery. Services: &quot;Fast for 8 hours before&quot; (medical), &quot;Bring insurance card&quot; (documentation), &quot;Wear comfortable clothes&quot; (attire). Delivery: &quot;Someone must be home&quot; (presence), &quot;Leave at door&quot; (instructions), &quot;Gate code: 1234&quot; (access). Display: checklist (what to do), warnings (what not to do), FAQ (common questions).
        </p>
        <p>
          Contact information provides support access. Support channels: email (support@example.com), phone (1-800-123-4567), chat (start chat), help center (FAQ). Hours: &quot;Mon-Fri 9 AM - 6 PM EST&quot;, &quot;24/7 support&quot;. Display: &quot;Need help?&quot; section, contact buttons (email, phone, chat), self-service links (FAQ, track order).
        </p>

        <h3 className="mt-6">Receipt Delivery</h3>
        <p>
          Email receipt delivers receipt to customer email. Content: order/booking details, payment info, shipping address, receipt number, company contact. Format: HTML (styled, branded), plain text (fallback), attachment (PDF receipt). Delivery: immediate (on confirmation), retry on failure (3 attempts), bounce handling (invalid email). Display: &quot;Receipt sent to email@example.com&quot;, &quot;Check spam folder&quot;, &quot;Resend receipt&quot;.
        </p>
        <p>
          Download receipt provides immediate receipt access. Format: PDF (printable, professional), image (PNG, mobile-friendly), HTML (print from browser). Content: order/booking details, payment info, company info, tax ID, terms. Display: &quot;Download Receipt&quot; button, &quot;Print&quot; button, &quot;Email Receipt&quot; link. Storage: cloud storage (access anytime), account order history (re-download).
        </p>
        <p>
          Receipt customization adds business-specific info. Content: company logo, tax ID, business address, payment terms, return policy, warranty info. B2B: purchase order number, cost center, billing contact. Display: &quot;Customize Receipt&quot; link (B2B), &quot;Add PO Number&quot; field, &quot;Save for Next Time&quot; option.
        </p>

        <h3 className="mt-6">Post-Purchase Engagement</h3>
        <p>
          Account creation converts guest to registered user. Benefits: order tracking (view all orders), faster checkout (saved info), exclusive offers (member discounts), easy returns (no receipt needed). Timing: post-purchase (already converted), pre-purchase (during checkout). Incentive: &quot;Create account for 10% off next order&quot;, &quot;Track orders easily&quot;, &quot;Save your info&quot;. Display: &quot;Create Account&quot; button, pre-filled form (from checkout), password setup.
        </p>
        <p>
          Related products drive additional sales. Types: complementary (bought X, need Y), upgrades (premium version), consumables (refills, replacements). Timing: post-purchase (already bought, may need more), pre-shipment (can add to order). Display: &quot;Customers also bought&quot;, &quot;Complete your look&quot;, &quot;Frequently bought together&quot;. Incentive: &quot;Add to order before ships&quot;, &quot;Free shipping if you add $20&quot;.
        </p>
        <p>
          Referral program encourages customer referrals. Offer: &quot;Give $20, Get $20&quot; (both get discount), &quot;Refer 3 friends, get $50&quot; (tiered rewards), &quot;Share link, earn credits&quot; (per referral). Display: &quot;Refer a Friend&quot; section, share link (copy, email, social), referral tracking (how many referred, rewards earned). Terms: minimum purchase (for discount), expiry (use within 30 days), limits (max referrals).
        </p>

        <h3 className="mt-6">Confirmation Variations</h3>
        <p>
          Order confirmation (e-commerce) confirms product purchase. Content: items (thumbnails, names, quantities), prices (unit, total), shipping (address, method, cost), payment (method, last 4 digits), totals (subtotal, shipping, tax, total). Next steps: &quot;Ships by [date]&quot;, &quot;Arrives [date range]&quot;, &quot;Track order&quot; link. Actions: view order, track order, download receipt, contact support.
        </p>
        <p>
          Booking confirmation (services) confirms service appointment. Content: service (name, description), date/time (start, end, timezone), location (address, room, directions), staff (name, photo, specialty), price (service, tax, tip, total). Next steps: &quot;We&apos;ll remind you 24 hours before&quot;, &quot;Arrive 10 minutes early&quot;, &quot;Bring [items]&quot;. Actions: view booking, modify booking, cancel booking, add to calendar.
        </p>
        <p>
          Payment confirmation (payments) confirms payment received. Content: payment amount, payment method (card last 4, PayPal email), transaction ID, date/time, payer/payee info. Next steps: &quot;Receipt sent to email&quot;, &quot;Transaction complete&quot;, &quot;Contact support if issue&quot;. Actions: download receipt, view transaction, dispute payment, contact support.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Confirmation screen architecture spans data display, next steps communication, receipt delivery, and post-purchase engagement. Data display shows order/booking details (items, prices, shipping). Next steps communication sets expectations (shipping timeline, preparation). Receipt delivery provides receipt (email, download). Post-purchase engagement drives engagement (account creation, related products, referrals).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/confirmation-screens/confirmation-architecture.svg"
          alt="Confirmation Screen Architecture"
          caption="Figure 1: Confirmation Screen Architecture — Data display, next steps, receipt delivery, and post-purchase engagement"
          width={1000}
          height={500}
        />

        <h3>Data Display Component</h3>
        <p>
          Order summary displays order details. Data source: order API (fetch order, items, shipping, payment). Display: order number (prominent, copyable), items (thumbnail, name, quantity, price), shipping (address, method, ETA), payment (method, last 4, amount), totals (subtotal, shipping, tax, total). Actions: view details (expand), print (print receipt), download (PDF receipt).
        </p>
        <p>
          Booking summary displays booking details. Data source: booking API (fetch booking, service, staff, location). Display: booking number (prominent, copyable), service (name, description, duration), date/time (start, end, timezone), location (address, room, map link), staff (name, photo, specialty), price (service, tax, tip, total). Actions: view details (expand), add to calendar (calendar invite), modify booking (change date/time).
        </p>
        <p>
          Payment summary displays payment details. Data source: payment API (fetch payment, method, transaction). Display: transaction ID (prominent, copyable), amount (large, prominent), payment method (card type, last 4, PayPal email), date/time (transaction time), payer/payee (names, emails). Actions: download receipt (PDF), view transaction (details), dispute payment (if issue).
        </p>

        <h3 className="mt-6">Next Steps Component</h3>
        <p>
          Timeline display shows delivery/service timeline. Data source: shipping API (fetch ETA, tracking), booking API (fetch reminder schedule). Display: visual timeline (steps, dates), text description (&quot;Ships by Dec 20&quot;), key dates (ship date, delivery date, service date). Actions: track order (tracking link), add to calendar (calendar invite), set reminder (SMS/email reminder).
        </p>
        <p>
          Preparation instructions shows what customer needs to do. Data source: service API (fetch preparation requirements), business rules (policies, requirements). Display: checklist (what to do), warnings (what not to do), FAQ (common questions). Examples: &quot;Fast for 8 hours before&quot; (medical), &quot;Bring insurance card&quot; (documentation), &quot;Wear comfortable clothes&quot; (attire).
        </p>
        <p>
          Contact information displays support access. Data source: business info (support channels, hours), help center (FAQ, articles). Display: support channels (email, phone, chat), hours (&quot;Mon-Fri 9 AM - 6 PM&quot;), self-service (FAQ, track order, modify booking). Actions: start chat (chat widget), call support (tel: link), email support (mailto: link).
        </p>

        <h3 className="mt-6">Receipt Delivery</h3>
        <p>
          Email receipt triggers receipt email. Data source: order/booking API (fetch details), email template (branded, formatted). Process: generate HTML (styled receipt), attach PDF (printable), send email (customer email), track delivery (sent, opened, bounced). Display: &quot;Receipt sent to email@example.com&quot;, &quot;Check spam folder&quot;, &quot;Resend receipt&quot; link.
        </p>
        <p>
          PDF generation creates downloadable receipt. Process: fetch order/booking data, render HTML (receipt template), convert to PDF (server-side or client-side), store (cloud storage), serve (download link). Content: order/booking details, payment info, company info, tax ID, terms. Display: &quot;Download Receipt&quot; button, &quot;Print&quot; button, &quot;Email Receipt&quot; link.
        </p>
        <p>
          Receipt storage enables re-download. Storage: cloud storage (S3, cloud files), database (store PDF binary), order history (link to receipt). Access: account order history (logged-in users), email link (guest users), support (can resend). Retention: indefinite (always available), limited (90 days, 1 year), archive (old receipts archived).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/confirmation-screens/confirmation-flow.svg"
          alt="Confirmation Flow"
          caption="Figure 2: Confirmation Flow — Order/booking confirmation, next steps, receipt, and engagement"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Post-Purchase Engagement</h3>
        <p>
          Account creation prompt converts guest to registered user. Trigger: guest checkout (no account), post-purchase (already converted). Incentive: &quot;Create account for 10% off next order&quot;, &quot;Track orders easily&quot;, &quot;Save your info&quot;. Form: pre-filled (from checkout), password setup (create password), preferences (email preferences, marketing opt-in). Display: modal (overlay), inline (on confirmation page), email (post-purchase email).
        </p>
        <p>
          Related products display drives additional sales. Data source: recommendation engine (collaborative filtering, rule-based), product API (fetch products, prices). Types: complementary (bought X, need Y), upgrades (premium version), consumables (refills, replacements). Display: &quot;Customers also bought&quot; carousel, &quot;Complete your look&quot; grid, &quot;Frequently bought together&quot; bundle. Actions: add to order (if before ships), add to cart (for next order), view product (product page).
        </p>
        <p>
          Referral program display encourages referrals. Data source: referral API (fetch referral program, rewards), customer API (fetch referral history). Display: &quot;Refer a Friend&quot; section, share link (copy, email, social), rewards tracker (how many referred, rewards earned). Incentive: &quot;Give $20, Get $20&quot;, &quot;Refer 3 friends, get $50&quot;, &quot;Earn credits per referral&quot;. Actions: copy link (clipboard), share (email, social), track referrals (referral dashboard).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/confirmation-screens/confirmation-types.svg"
          alt="Confirmation Types"
          caption="Figure 3: Confirmation Types — Order, booking, and payment confirmation variations"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Confirmation screen design involves trade-offs between information density, engagement, simplicity, and conversion. Understanding these trade-offs enables informed decisions aligned with business model and customer expectations.
        </p>

        <h3>Information Density: Detailed vs. Minimal</h3>
        <p>
          Detailed confirmation (all info on page). Pros: Customer has all info (no need to check email), reduces support tickets (answers questions), printable (one-page receipt). Cons: Overwhelming (too much info), long page (scroll to see all), slow load (more data). Best for: High-value orders (customers want details), B2B (need all info), complex orders (multiple items, shipping).
        </p>
        <p>
          Minimal confirmation (key info only). Pros: Clean (easy to scan), fast load (less data), mobile-friendly (short page). Cons: Missing info (check email for details), may increase support tickets (where&apos;s my receipt?), less printable (need email). Best for: Low-value orders (simple purchase), mobile-first (fast load), repeat customers (already know process).
        </p>
        <p>
          Hybrid: key info on page, details in email. Pros: Balance (key info visible, details available), clean page (not overwhelming), email receipt (always accessible). Cons: Two places (page + email), may confuse (where&apos;s full info?). Best for: Most production systems—order number, total, ETA on page; full details in email.
        </p>

        <h3>Engagement: High vs. Low</h3>
        <p>
          High engagement (multiple CTAs, offers). Pros: Drives action (account creation, referrals, related products), increases LTV (repeat purchases, referrals), monetizes confirmation page (ad space, promotions). Cons: Distracting (takes from confirmation), may feel pushy (already bought, now sell more), lower satisfaction (just want receipt). Best for: E-commerce (drive repeat purchases), subscription businesses (referrals, upgrades).
        </p>
        <p>
          Low engagement (minimal CTAs, just confirmation). Pros: Focused (just confirmation), clean (not distracting), higher satisfaction (got what needed). Cons: Missed opportunities (no account creation, no referrals), lower LTV (no repeat purchase drive), confirmation page waste (not monetized). Best for: Service businesses (booking confirmed, done), luxury brands (don&apos;t want to feel salesy).
        </p>
        <p>
          Hybrid: confirmation first, engagement secondary. Pros: Balance (confirmation clear, engagement optional), not pushy (engagement below fold), best of both. Cons: Still some distraction, may not be seen (below fold). Best for: Most production systems—confirmation prominent, engagement below (account, referrals, related).
        </p>

        <h3>Receipt Delivery: Email vs. Download vs. Both</h3>
        <p>
          Email only (receipt sent to email). Pros: Always accessible (email inbox), searchable (find by email), eco-friendly (no paper). Cons: Delayed (email delivery time), spam risk (goes to spam), requires email (guest checkout issue). Best for: Most e-commerce (standard expectation), registered users (email on file).
        </p>
        <p>
          Download only (receipt on page). Pros: Immediate (no wait), no email needed (guest friendly), printable (download PDF). Cons: Lost if don&apos;t download (no email backup), device-specific (downloaded on this device), not searchable (in downloads folder). Best for: Guest checkout (no email on file), B2B (need immediate receipt), POS (in-store pickup).
        </p>
        <p>
          Both (email + download). Pros: Best of both (immediate + backup), customer choice (download or email), accessible (email + account). Cons: Redundant (same receipt twice), email cost (sending emails), storage cost (storing PDFs). Best for: Most production systems—email (primary), download (immediate backup).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/confirmation-screens/engagement-options.svg"
          alt="Post-Purchase Engagement Options"
          caption="Figure 4: Post-Purchase Engagement Options — Account creation, related products, and referral program"
          width={1000}
          height={450}
        />

        <h3>Account Creation: Pre-Purchase vs. Post-Purchase</h3>
        <p>
          Pre-purchase account creation (during checkout). Pros: Account ready (order linked immediately), full features (tracking, returns from start), data captured (preferences, saved info). Cons: Checkout friction (another step), abandonment risk (don&apos;t want account), lower conversion (extra field). Best for: Subscription businesses (account required), high-value orders (account benefits clear).
        </p>
        <p>
          Post-purchase account creation (after checkout). Pros: No friction (checkout fast), already converted (already bought), incentive clear (10% off next order). Cons: Account not linked to order (guest order), may not create (forget, don&apos;t care), data not captured (checkout info not saved). Best for: Most e-commerce (guest checkout option), low-friction businesses.
        </p>
        <p>
          Hybrid: guest checkout, post-purchase invite. Pros: Best of both (fast checkout, account option), incentive (create for benefits), no friction (guest first). Cons: Account not linked automatically (need to merge), may not convert (ignore invite). Best for: Most production systems—guest checkout, post-purchase email (&quot;Create account for 10% off&quot;).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Show clear confirmation:</strong> Large heading (&quot;Order Confirmed&quot;), checkmark icon (green, success), order/booking number (prominent, copyable). Reassure (&quot;You&apos;re all set&quot;, &quot;Thank you for your order&quot;).
          </li>
          <li>
            <strong>Display order/booking summary:</strong> Items (thumbnail, name, quantity, price), service (name, description, duration), totals (subtotal, shipping, tax, total). Collapsible (show/hide details), printable (print receipt).
          </li>
          <li>
            <strong>Set clear expectations:</strong> Shipping timeline (&quot;Ships by Dec 20, arrives Dec 22-24&quot;), preparation instructions (&quot;Fast for 8 hours&quot;, &quot;Bring ID&quot;), contact info (email, phone, hours).
          </li>
          <li>
            <strong>Provide receipt access:</strong> Email receipt (sent to email), download receipt (PDF button), account access (order history). &quot;Resend receipt&quot; link (if email lost).
          </li>
          <li>
            <strong>Enable next steps:</strong> Track order (tracking link), modify booking (change date/time), contact support (email, phone, chat). Clear CTAs (&quot;Track Order&quot;, &quot;Modify Booking&quot;).
          </li>
          <li>
            <strong>Encourage account creation:</strong> Post-purchase (&quot;Create account for 10% off&quot;), pre-filled form (from checkout), clear benefits (tracking, faster checkout, easy returns).
          </li>
          <li>
            <strong>Display related products:</strong> Complementary (bought X, need Y), upgrades (premium version), consumables (refills). &quot;Add to order before ships&quot; (if before ships).
          </li>
          <li>
            <strong>Promote referral program:</strong> &quot;Give $20, Get $20&quot;, share link (copy, email, social), rewards tracker (how many referred). Clear terms (minimum purchase, expiry).
          </li>
          <li>
            <strong>Optimize for mobile:</strong> Responsive design (fits mobile), large buttons (touch-friendly), SMS receipt (opt-in), mobile wallet (add to Apple Wallet/Google Pay).
          </li>
          <li>
            <strong>Track analytics:</strong> Conversion completed (revenue tracked), email opens (receipt opened), link clicks (track order clicked), account creation (guest to registered).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Unclear confirmation:</strong> Customer unsure if order went through. Solution: Large heading, checkmark icon, order number, &quot;Thank you&quot; message.
          </li>
          <li>
            <strong>Missing order details:</strong> Customer doesn&apos;t know what they ordered. Solution: Display items (thumbnail, name, quantity, price), totals, shipping address.
          </li>
          <li>
            <strong>No next steps:</strong> Customer doesn&apos;t know what happens next. Solution: Shipping timeline, preparation instructions, tracking link, contact info.
          </li>
          <li>
            <strong>No receipt access:</strong> Customer can&apos;t get receipt. Solution: Email receipt, download PDF, account access, &quot;Resend receipt&quot; link.
          </li>
          <li>
            <strong>Too much engagement:</strong> Overwhelming with offers, CTAs. Solution: Confirmation first, engagement below fold, optional (not forced).
          </li>
          <li>
            <strong>No account creation:</strong> Missed opportunity to convert guest. Solution: Post-purchase invite, incentive (10% off), pre-filled form.
          </li>
          <li>
            <strong>No related products:</strong> Missed upsell opportunity. Solution: Complementary products, &quot;Add to order before ships&quot;, &quot;Frequently bought together&quot;.
          </li>
          <li>
            <strong>No referral program:</strong> Missed referral opportunity. Solution: &quot;Refer a Friend&quot; section, share link, rewards tracker.
          </li>
          <li>
            <strong>Poor mobile support:</strong> Can&apos;t view on mobile. Solution: Responsive design, large buttons, SMS receipt, mobile wallet.
          </li>
          <li>
            <strong>No analytics:</strong> Don&apos;t track confirmation performance. Solution: Track conversion, email opens, link clicks, account creation.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Amazon Order Confirmation</h3>
        <p>
          Amazon order confirmation: comprehensive order details. Features: order number, items (thumbnails, names, quantities), prices, shipping address, payment method, totals. Next steps: &quot;Arrives by [date]&quot;, &quot;Track package&quot; link, &quot;View order details&quot; link. Receipt: email receipt, download invoice, account order history. Engagement: &quot;Buy again&quot;, &quot;Related products&quot;, &quot;Write a review&quot; (after delivery).
        </p>

        <h3 className="mt-6">OpenTable Booking Confirmation</h3>
        <p>
          OpenTable booking confirmation: restaurant reservation details. Features: booking number, restaurant (name, address, map), date/time, party size, confirmation code. Next steps: &quot;We&apos;ll remind you 24 hours before&quot;, &quot;Add to calendar&quot;, &quot;Get directions&quot;. Receipt: email confirmation, download confirmation. Engagement: &quot;Book another restaurant&quot;, &quot;Leave a review&quot; (after dining), referral program.
        </p>

        <h3 className="mt-6">Stripe Payment Confirmation</h3>
        <p>
          Stripe payment confirmation: payment receipt. Features: transaction ID, amount, payment method (card last 4), date/time, payer/payee info. Next steps: &quot;Receipt sent to email&quot;, &quot;Transaction complete&quot;, &quot;Contact support if issue&quot;. Receipt: email receipt, download PDF, view transaction. Engagement: &quot;Subscribe to updates&quot;, &quot;Contact merchant&quot;.
        </p>

        <h3 className="mt-6">Airbnb Booking Confirmation</h3>
        <p>
          Airbnb booking confirmation: reservation details. Features: booking number, property (name, photos, address), dates (check-in/out), guests, price (nightly, cleaning, service, total). Next steps: &quot;Check-in instructions sent 48 hours before&quot;, &quot;Contact host&quot;, &quot;Get directions&quot;. Receipt: email confirmation, download receipt, account trip history. Engagement: &quot;Book experiences&quot;, &quot;Refer friends&quot;, &quot;Leave a review&quot; (after stay).
        </p>

        <h3 className="mt-6">Uber Ride Confirmation</h3>
        <p>
          Uber ride confirmation: trip receipt. Features: trip ID, date/time, route (pickup, dropoff, map), fare (base, time, distance, tip, total), payment method. Next steps: &quot;Receipt sent to email&quot;, &quot;Rate your driver&quot;, &quot;Report an issue&quot;. Receipt: email receipt, download PDF, account trip history. Engagement: &quot;Schedule next ride&quot;, &quot;Try Uber Eats&quot;, &quot;Refer friends&quot;.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What should be on a confirmation screen?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Confirmation message (&quot;Order Confirmed&quot;, checkmark), order/booking summary (items, prices, totals), confirmation number (copyable), next steps (shipping timeline, preparation), contact info (support channels), receipt access (email, download), post-purchase engagement (account creation, related products, referrals). Prioritize: confirmation first, details second, engagement last.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce post-purchase anxiety?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Clear confirmation (&quot;You&apos;re all set&quot;, checkmark), order details (what bought, how much), next steps (when ships, when arrives), tracking (track order link), support access (contact info, FAQ), receipt (email, download). Reassurance: &quot;Order confirmed&quot;, &quot;We&apos;ll email you when it ships&quot;, &quot;Free returns within 30 days&quot;.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you encourage account creation post-purchase?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Incentive (&quot;Create account for 10% off next order&quot;), benefits (track orders, faster checkout, easy returns), pre-filled form (from checkout), password setup only (email already have). Timing: post-purchase (already converted), email follow-up (&quot;Create account to track your order&quot;). Display: modal (overlay), inline (on confirmation page), email (post-purchase email).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle guest checkout confirmation?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Email receipt (sent to checkout email), download receipt (PDF button), order lookup (order number + email), account creation invite (&quot;Create account to track orders&quot;). No account required: guest order lookup (order number + email/phone), support access (order number for support). Conversion: post-purchase email (&quot;Create account for 10% off&quot;).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize confirmation for mobile?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Responsive design (fits mobile), large buttons (touch-friendly, 44x44px), SMS receipt (opt-in, mobile-friendly), mobile wallet (add to Apple Wallet/Google Pay), simplified content (key info only, details in email), fast load (minimal images, lazy load). Actions: tap to call (tel: link), tap to email (mailto: link), tap to track (tracking link).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you track confirmation page effectiveness?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Conversion tracking (revenue tracked on confirmation), email opens (receipt opened), link clicks (track order clicked, related products clicked), account creation (guest to registered conversion), referral signups (referral link clicked, friend referred). Analytics: conversion rate (checkout to confirmation), bounce rate (leave confirmation page), time on page (engagement), return visits (repeat customers).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/order-confirmation-pages/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Order Confirmation Pages Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://baymard.com/blog/order-confirmation-usability"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Baymard Institute — Order Confirmation Page Usability
            </a>
          </li>
          <li>
            <a
              href="https://www.shopify.com/enterprise/blog/order-confirmation-page"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shopify — Order Confirmation Page Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://stripe.com/docs/payments/receipts"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe — Payment Receipts Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.opentable.com/how-it-works"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenTable — Booking Confirmation Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.airbnb.com/help/article/2623"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Airbnb — Booking Confirmation and Receipts
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
