"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-checkout-flow",
  title: "Design a Checkout Flow",
  description:
    "Production-grade checkout experience with multi-step forms, payment processing, error recovery, and order confirmation.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "checkout-flow",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "checkout", "payment", "ecommerce", "form-handling"],
  relatedTopics: ["shopping-cart-system", "payment-ui-system"],
};

export default function CheckoutFlowArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Checkout is the highest-stakes UI flow in e-commerce: it converts browsing intent into revenue, and every friction point is a potential abandonment. Users must provide shipping address, select delivery speed, enter payment details, and confirm an order—all while the underlying cart state is being validated against live inventory and prices. The failure modes are severe: a double charge from a retried network request, an order confirmed for an out-of-stock item, form state lost on back navigation, or a confusing error message after a declined card that causes the user to give up rather than retry.</p>
        <p>The checkout flow is not just a multi-step form. It is a transactional workflow where partial completion is unacceptable: either the order is placed correctly in a single atomic operation, or it is not placed at all. This requires careful state management (preserving form data across steps and navigation), idempotency (ensuring retried payment requests cannot double-charge), PCI compliance (card data must never touch the application server), and recovery UX (users must understand what went wrong and how to proceed when errors occur).</p>
        <p><strong>Explicit assumptions:</strong> The platform uses Stripe for payment processing (hosted fields + payment intents pattern). Users may be authenticated or guests. Address validation is advisory, not blocking (users can override suggestions). Inventory is re-validated at order creation time on the server. Checkout may span multiple minutes (user steps away); session state must survive.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Multi-step wizard:</strong> Shipping address → shipping method → payment → review → confirmation. Each step validates before advancing; user can navigate backwards without losing data.</li>
          <li><strong>Address management:</strong> Autocomplete via Google Places API. Saved addresses for authenticated users. Address normalization and advisory validation (USPS API for US addresses).</li>
          <li><strong>Shipping options:</strong> Dynamic rates from carrier API based on destination and cart weight. Show estimated delivery date per option. Recalculate total on option change.</li>
          <li><strong>Payment:</strong> Credit/debit cards (Stripe Elements, no raw card data on app server). Digital wallets (Apple Pay, Google Pay). Saved payment methods for authenticated users. 3DS authentication when required.</li>
          <li><strong>Order review:</strong> Show full order summary (items, shipping, tax, total) before final confirmation. Last chance to edit any step.</li>
          <li><strong>Guest checkout:</strong> Complete purchase with only an email; prompt account creation post-confirmation.</li>
          <li><strong>Order confirmation:</strong> Immediate confirmation page with order number; trigger confirmation email asynchronously.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Security:</strong> PCI-DSS compliance; card data handled entirely within Stripe's iframe; no card numbers, CVVs, or raw PANs on application servers.</li>
          <li><strong>Idempotency:</strong> Payment submission with a unique idempotency key; retrying after a network failure cannot produce a duplicate charge.</li>
          <li><strong>State durability:</strong> Checkout form state survives page refresh, back navigation, and accidental tab close; restorable within the session.</li>
          <li><strong>Performance:</strong> Each step must render in under 500ms; shipping rate calculation under 2 seconds; payment confirmation under 5 seconds (Stripe's typical processing time).</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <p>The checkout flow is modeled as a linear state machine with steps: cart validation → shipping address → shipping method → payment → review → order creation → confirmation. Each step transition validates the current step's data and only advances if validation passes. The entire checkout state (all entered values, current step, shipping rates, selected method) is persisted to sessionStorage after each mutation, so browser refresh or navigation returns the user to their exact position.</p>
        <p>Payment is the most complex step. The application renders Stripe Elements (an iframe hosted by Stripe) for card input. The user's card data enters Stripe's servers directly—it never touches the application. On submit, Stripe returns a PaymentMethod token or directly confirms the PaymentIntent. The application server receives only the token and the idempotency key, calls Stripe server-to-server to complete the charge, and only creates the order record after receiving Stripe's success confirmation.</p>
        <p>Order creation is a two-phase operation: reserve inventory and finalize price server-side (atomic database transaction), then charge the card. If inventory reservation fails (item went out of stock between cart and checkout), the user is returned to the cart with an error before any payment attempt occurs. This prevents the worst user experience: a successful charge for an item that cannot be shipped.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/checkout-flow.svg"
          alt="Checkout flow showing multi-step form progression, PCI-compliant payment via Stripe hosted fields, idempotency key pattern, 3DS authentication, and order creation state machine"
          caption="Checkout flow showing multi-step form progression, PCI-compliant payment via Stripe hosted fields, idempotency key pattern, 3DS authentication, and order creation state machine"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Checkout State Machine</h3>
        <p>The checkout state is a flat object containing: currentStep (enum), shippingAddress (object), billingAddress (object or "same as shipping" flag), selectedShippingMethodId (string), shippingRates (array), paymentMethodId (string, Stripe token), orderSummary (snapshot of cart items + calculated totals), and submissionState (idle | submitting | succeeded | failed). This entire object is serialized to sessionStorage on every state change.</p>
        <p>On checkout entry, the system restores from sessionStorage if a draft exists and is less than 30 minutes old. This handles the most common abandonment pattern: the user fills in their address, gets distracted, and returns to find their data preserved. The 30-minute TTL prevents stale draft data from causing confusion. If the cart has changed since the draft was created (items added or removed), the draft is discarded and the user starts fresh.</p>
        <p>Step transitions are validated gate functions. Advancing from the shipping address step requires: all required fields populated, no active field validation errors, and a successful address normalization response (or the user explicitly overriding the suggestion). Advancing from the payment step requires: a valid Stripe PaymentMethod ID (proof that Stripe accepted the card details). The review step is the last gate: the user explicitly clicks "Place Order" after seeing the final totals.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Address Autocomplete and Validation</h3>
        <p>Address autocomplete uses the Google Places Autocomplete API (Places API loaded asynchronously on checkout entry). As the user types in the address field, suggestions appear in a dropdown. Selecting a suggestion populates all address fields (street, city, state, zip, country) simultaneously, preventing the tedious tab-through experience of filling fields individually. For US addresses, a secondary USPS Address Validation API call normalizes the entered address (corrects abbreviations, adds zip+4) and presents a "Did you mean..." suggestion if the entered address differs. The user can accept the normalized version or keep what they entered.</p>
        <p>Saved addresses for authenticated users are fetched on checkout entry and shown as selectable cards above the address form. Selecting a saved address populates the form fields directly without triggering the autocomplete or USPS validation flow (the address was already validated when saved). The user can still edit individual fields after selecting a saved address.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Shipping Rate Calculation</h3>
        <p>Shipping rates are fetched from the application server (which in turn queries carrier APIs or a configured rate table) after the shipping address is confirmed. The request includes destination address, package dimensions, and cart weight. The response contains available shipping methods with their rates and estimated delivery dates. Rate fetching is initiated immediately when the user advances from the address step, so rates are loading while the shipping method step is rendering—the user rarely waits for rates to appear.</p>
        <p>If rate fetching fails (carrier API timeout or error), a fallback set of standard rates is presented (pulled from a cached configuration). These may be slightly inaccurate, but they allow the checkout to proceed; the authoritative shipping cost is always confirmed server-side before order creation. The user is never told "we couldn't get rates, please try again"—that's a checkout-killing error message. The fallback rates are labeled "Estimated" to set expectations.</p>
        <p>Shipping cost affects the cart total, which is displayed persistently in a sidebar (desktop) or a collapsible summary (mobile) throughout checkout. When the user changes their shipping method, the displayed total updates immediately. This real-time total update requires the checkout state to include a price calculation function that runs synchronously on the client, using the confirmed line item prices, selected shipping rate, and estimated tax. Tax is calculated server-side (accurate tax requires the destination address and precise product taxability codes) but estimated client-side using the rate last returned by the tax endpoint.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">PCI-Compliant Payment Input</h3>
        <p>Stripe Elements renders card input fields inside a cross-origin iframe hosted on Stripe's domain. The application's JavaScript cannot access the iframe's content. From a browser security perspective, Stripe's servers receive the card number, expiry, and CVV directly; they never pass through the application's JavaScript context or network. This is what achieves PCI-DSS SAQ A compliance: the application is entirely out of the card data flow.</p>
        <p>The integration is: (1) on payment step mount, create a Stripe Elements instance initialized with the publishable key; (2) render CardElement (or separate CardNumberElement, CardExpiryElement, CardCvcElement for custom layouts) mounted into DOM nodes in the application; (3) on form submit, call stripe.createPaymentMethod() or stripe.confirmCardPayment()—both return a token or error without the card data ever being accessible to application code; (4) send the resulting PaymentMethod ID or PaymentIntent client secret to the application server; (5) application server calls Stripe's server-to-server API to confirm the charge.</p>
        <p>Digital wallets (Apple Pay, Google Pay) are implemented via Stripe's Payment Request Button, which presents the native OS wallet interface. These methods do not require the user to enter card details at all—they authenticate with their device biometrics (Face ID, fingerprint) and Stripe receives a device-generated payment token. The integration point is identical from the application's perspective: a PaymentMethod ID is returned on success.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Idempotency and Double-Charge Prevention</h3>
        <p>The single most important safety property of a payment flow is that retrying a failed request cannot produce a duplicate charge. Network errors are the primary risk: the application sends a payment request, the server processes it successfully and charges the card, but the response is lost in transit. The application, seeing no response, might retry—which would attempt a second charge.</p>
        <p>Prevention: generate a UUID idempotency key when the user clicks "Place Order." Include this key in every payment request to both the application server and to Stripe (Stripe supports Idempotency-Key headers natively). If the request is retried with the same idempotency key, Stripe returns the result of the original request without re-charging. The application server also stores the idempotency key with the order record; if a duplicate request arrives (same key, different socket), it returns the existing order rather than creating a new one. The idempotency key is generated fresh only when the user initiates a new payment attempt, not on retries of the same attempt.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">3DS Authentication Flow</h3>
        <p>3D Secure (3DS) is an additional authentication step required by some card issuers, particularly in Europe (Strong Customer Authentication requirement). When Stripe's fraud detection or the card issuer requires 3DS, Stripe returns a PaymentIntent in the "requires_action" state with a redirect URL. The application must redirect the user to their bank's authentication page (or render the bank's iframe) where the user approves the transaction (typically via their banking app or a one-time code).</p>
        <p>After authentication, the bank redirects back to a return URL on the application. The application reads the PaymentIntent ID from the URL, calls stripe.retrievePaymentIntent() to check the result, and proceeds if authentication succeeded. The checkout state must be preserved through this redirect cycle; the return URL handler restores the checkout state from sessionStorage and resumes the flow at the payment confirmation step. This is a multi-page navigation in the middle of the checkout wizard—it requires careful state serialization to avoid losing the entire checkout context.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Order Creation and Confirmation</h3>
        <p>Order creation on the server is a two-phase commit: (1) open a database transaction, check inventory availability for each line item, lock the inventory records, create the order record with status "pending_payment," and capture a price snapshot (current prices from the product catalog); (2) call Stripe to confirm the charge using the PaymentMethod ID; (3) if Stripe succeeds, set order status to "confirmed" and decrement inventory, then commit the transaction. If Stripe fails (card declined, fraud block), roll back the transaction—no order record, no inventory hold, clean slate for the user to retry with a different card.</p>
        <p>The confirmation page must render correctly even if the user refreshes it or shares the URL. The page is driven by orderId, which is passed as a URL parameter. The application fetches the order details by ID (authenticated endpoint for account users, public endpoint with order token for guest orders). The confirmation page is deliberately simple and server-rendered to ensure it loads quickly even on slow connections—the user should see their order number immediately, not spin on a loading state after a tense payment experience.</p>
        <p>The confirmation email is sent asynchronously from a background job queued during order creation. It is never sent synchronously in the request/response cycle; email delivery can take seconds or fail transiently, and those failures should not affect the order creation response. If the email fails to send initially, the job retries. The order is confirmed regardless of email delivery status—the confirmation page always shows the order number.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Error States and Recovery UX</h3>
        <p>Card declined is the most common error. The error message must be specific enough to be actionable without being cryptic: "Your card was declined. Please check your card details or try a different payment method." The Stripe error code can be used to show more specific guidance: "insufficient_funds" → "Your card has insufficient funds," "incorrect_cvc" → "Your card security code is incorrect." Never show raw error codes or Stripe's internal error strings to users.</p>
        <p>After a declined card, the Stripe Elements fields are cleared (never pre-populated with the declined card's details) and the user can enter a new card or select a saved method. The idempotency key is refreshed so that retrying with the new card does not hit the existing idempotency record from the declined attempt.</p>
        <p>Network errors during payment submission show a recoverable error state: "Something went wrong. Your card has not been charged. Please try again." The "try again" button re-submits with the same idempotency key. If the original attempt actually succeeded server-side, the retry hits the idempotency guard and returns the existing order—the user is taken to the confirmation page. If the original attempt genuinely failed, the retry creates a fresh attempt. In both cases, the user is not double-charged. This makes network error recovery safe to expose to the user as a simple retry button.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Multi-step versus single-page checkout: multi-step (one section at a time) reduces cognitive load and allows step-specific validation, but increases navigation steps. Single-page checkout (all fields on one page, collapsible sections) requires only one scroll and one submit button but can feel overwhelming and makes partial validation harder. A/B tests at major retailers have produced contradictory results—the optimal design depends heavily on device type (multi-step performs better on mobile, single-page on desktop with large screens) and on the amount of information required.</p>
        <p>Address validation strictness: requiring a valid USPS-confirmed address prevents failed deliveries but rejects valid international addresses (USPS only validates US addresses), rural addresses that USPS doesn't recognize, and new addresses not yet in the USPS database. Making validation advisory (show suggestion, allow override) is correct for most cases. Only block on clearly malformed input (missing required fields, invalid zip code format).</p>
        <p>Storing payment methods: users expect one-click checkout for repeat purchases, which requires storing a Stripe Customer ID and PaymentMethod ID server-side. This creates a security consideration (payment method records are high-value targets) and a compliance one (GDPR/CCPA require disclosure and the right to delete). The architecture should store Stripe's opaque token identifiers (not any card data) and provide a UI for users to view and delete their saved payment methods. Never store CVVs—Stripe's tokens are intentionally not usable without re-verification for high-value transactions.</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A production checkout flow is a multi-step transactional wizard with strict ordering guarantees: cart validation → address capture → shipping selection → PCI-compliant payment → atomic order creation. The defining technical properties are: state durability (sessionStorage ensures no data loss on navigation or refresh), PCI compliance via Stripe Elements hosted fields (card data never touches application servers), idempotency keys (retried payment requests cannot double-charge), and two-phase order creation (inventory reservation before payment, order commit only on payment success). Error recovery must be user-comprehensible (specific declined card messages, safe retry on network errors) and technically safe (idempotency prevents duplicate charges on retry). Guest checkout, saved addresses, and digital wallets reduce friction at the highest-abandonment stage of the purchase funnel.</p>
      </section>
    </ArticleLayout>
  );
}
