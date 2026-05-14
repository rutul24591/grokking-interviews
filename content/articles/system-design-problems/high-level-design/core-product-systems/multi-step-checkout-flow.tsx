"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-multi-step-checkout-flow",
  title: "Design a Multi-Step Checkout Flow",
  description:
    "End-to-end checkout architecture: state machine, payment integration, inventory reservation, idempotency, 3DS handling, and failure recovery at scale.",
  category: "high-level-design",
  subcategory: "core-product-systems",
  slug: "multi-step-checkout-flow",
  wordCount: 5600,
  readingTime: 34,
  lastUpdated: "2026-05-10",
  tags: ["hld", "checkout", "payments", "state-machine", "idempotency", "stripe"],
  relatedTopics: ["payment-ui-system", "shopping-cart-system"],
};

export default function MultiStepCheckoutFlowArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>Checkout is the most financially consequential user flow in an e-commerce system. A bug in the cart component loses a session; a bug in checkout loses revenue, creates inventory inconsistencies, and potentially charges customers incorrectly. The checkout flow must be simultaneously the most reliable path in the system and one of the most complex: it coordinates inventory availability checks, shipping rate calculation, tax computation, payment processing, order creation, and confirmation email—across multiple external services—without duplicating charges or creating phantom orders when any step fails.</p>
        <HighlightBlock as="p" tier="crucial">The "multi-step" structure serves conversion optimization: research consistently shows that a single-page checkout with all fields visible simultaneously increases abandonment compared to a stepped flow that reveals complexity progressively. However, multi-step introduces its own challenges: state must persist across steps (so the user can go back and modify their address without losing their payment information), each step must validate independently (can't validate payment until address is entered for tax calculation), and the user may close the tab at any step and expect to resume seamlessly.</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> The platform is a first-party e-commerce store (not a marketplace), so inventory is first-party. Payments are processed via Stripe (PaymentIntents API). Guest checkout is supported (no account required). International orders require tax calculation via a third-party API. The checkout state must survive page reload (stored server-side, accessed via session token). Physical goods require shipping; digital goods skip the shipping step.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Multi-step flow:</strong> Cart review → Address → Shipping method → Payment → Order review → Confirmation. Each step validates before advancing.</li>
          <li><strong>Address validation:</strong> Real-time address autocomplete (Google Places API) and backend validation for shipping eligibility. Tax rate calculated server-side after address is confirmed.</li>
          <li><strong>Payment processing:</strong> Support credit/debit cards (via Stripe Elements), Apple Pay, Google Pay, and saved payment methods for logged-in users.</li>
          <li><strong>Inventory reservation:</strong> Soft-reserve inventory when the user reaches the payment step; release reservation if payment is not completed within 15 minutes.</li>
          <li><strong>Idempotency:</strong> Submitting the order form multiple times (double-click, network retry) must not result in duplicate charges or duplicate orders.</li>
          <li><strong>3DS / SCA handling:</strong> Stripe's requires_action flow (3D Secure authentication) must be surfaced and completed without losing order context.</li>
          <li><strong>Resumable sessions:</strong> If the user abandons checkout and returns, they resume at the last completed step with all entered data restored.</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Reliability:</strong> Zero duplicate charges. The system prefers failing visibly (show an error) over silently retrying and charging twice.</li>
          <li><strong>Latency:</strong> Each step transition must complete within 2 seconds. Payment confirmation (post-charge) within 5 seconds.</li>
          <li><strong>Security:</strong> Card data must never touch the application's servers (PCI DSS SAQ A compliance via Stripe Elements hosted iframes).</li>
          <li><strong>Conversion:</strong> Checkout abandonment should be measurable at each step for funnel analysis. Step-level analytics are a first-class concern.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The checkout flow is modeled as a server-authoritative state machine. The client renders the current step's UI, but the canonical state of the checkout session (which step is active, which data has been validated, the inventory reservation status, the PaymentIntent ID) lives on the server. Every step transition is a server round-trip that validates the step's data and advances the session state. This design means that if the user's browser crashes between steps, the server session can be resumed; the client requests the current session state on page load and renders the appropriate step.</HighlightBlock>
        <p>The three primary backend services are the Checkout Session Service (manages session state, step transitions, and session persistence), the Order Service (creates orders after successful payment), and the Payment Service (an internal wrapper around Stripe's API that handles idempotency key management and webhook processing). These are coordinated by an API layer that the checkout frontend calls at each step transition.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-step-checkout-flow-architecture.svg"
          alt="Multi-step checkout architecture showing session state machine (cart-review → address → shipping → payment → review → confirmation), Stripe PaymentIntent lifecycle, inventory soft-reservation with TTL, tax calculation service, idempotency key flow, and 3DS requires_action handling"
          caption="Checkout architecture: server-authoritative session state machine, Stripe PaymentIntents, soft inventory reservation, and idempotent order creation"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Checkout Session State Machine</h3>
        <HighlightBlock as="p" tier="important">The checkout session is created when the user initiates checkout from the cart. The session record stores: sessionId, userId (or guestToken for guest checkout), cartSnapshot (a point-in-time copy of the cart contents at session creation—prices are locked at this point to prevent price changes during checkout from surprising the user), currentStep, completedSteps (a bitmask or array), shippingAddress, selectedShippingMethod, taxAmount, paymentIntentId, inventoryReservationId, and expiresAt.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Step transitions are server-validated state changes. When the user completes the address step and clicks "Continue to Shipping," the client sends the address data to a server endpoint like POST /checkout/sessions/:sessionId/address. The server validates the address (real address, ships to this country, no PO Box restrictions), calls the tax calculation API to compute tax for this address + cart combination, stores the result in the session, and returns the updated session including available shipping methods. Only if this request succeeds does the client advance the step indicator. If the server rejects the address (undeliverable, unsupported country), the client stays on the address step and shows the validation error. The client never advances the step unilaterally.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Resuming an abandoned session: when the user navigates to /checkout, the client sends the sessionToken (stored in a cookie or localStorage). The server looks up the session. If active and not expired, it returns the current session state and the client renders the correct step. If the session has expired (15-minute inactivity timeout), the client is redirected to the cart with a message: "Your checkout session expired. Your cart is still saved." The cart is preserved; only the reservation and checkout progress are lost.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Inventory Soft Reservation</h3>
        <HighlightBlock as="p" tier="important">When the user reaches the payment step, the server creates a soft inventory reservation: for each item in the cart, the inventory service decrements the available count (not the total stock—reserved + sold = total - available) and stores the reservation with a 15-minute TTL. This prevents another user from purchasing the last unit while the first user is entering payment details. The reservation ID is stored in the checkout session.</HighlightBlock>
        <p>If the user does not complete payment within 15 minutes, a background job (triggered by TTL expiry on the reservation record in Redis, or a scheduled job scanning for expired reservations) releases the reserved inventory. The checkout session is marked expired. If the user returns after expiry and tries to submit payment, the server detects the expired reservation, attempts to re-reserve (if stock is still available), and either succeeds (proceeds normally) or fails (returns an error: "Sorry, this item is no longer available"). This is the same pattern used by airline seat selection: the seat is held for you while you enter payment, released if you don't complete purchase.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Payment Processing and Idempotency</h3>
        <p>The Stripe PaymentIntent is created server-side when the user reaches the payment step (not on the order review step, and not on submit). Creating the PaymentIntent early allows Stripe to perform fraud scoring before the user submits. The PaymentIntent ID is stored in the checkout session. The client_secret from the PaymentIntent is returned to the frontend; Stripe Elements uses the client_secret to collect and tokenize card data directly in a Stripe-hosted iframe, ensuring the raw card number never reaches the application's JavaScript or servers.</p>
        <p>Idempotency against duplicate charges is enforced at two levels. First, the PaymentIntent is created once per checkout session. Submitting the order form calls stripe.confirmCardPayment(client_secret), which is safe to call once; Stripe deduplicates by PaymentIntent ID—confirming an already-confirmed PaymentIntent returns the existing result rather than charging again. Second, the order creation call from the Order Service to the database uses an idempotency key derived from the PaymentIntent ID. If the server creates the order, crashes, and the webhook retries the order creation call, the idempotency key prevents a duplicate order from being written.</p>
        <HighlightBlock as="p" tier="important">The payment submission flow: (1) user clicks "Place Order" on the review step; (2) the submit button is immediately disabled (prevents double-click); (3) the client confirms payment with Stripe using the PaymentIntent client secret and the card element collected by Stripe Elements; (4) Stripe processes and returns either succeeded, requires_action, or error; (5) on succeeded, the client calls a server endpoint like POST /checkout/sessions/:sessionId/complete, which triggers order creation and inventory deduction from reserved to sold; (6) the server returns the orderId and redirects the client to an order confirmation page.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">3D Secure / SCA Handling</h3>
        <HighlightBlock as="p" tier="important">European cards under Strong Customer Authentication (SCA) regulations often require a second factor: the user is redirected to their bank's authentication page to approve the payment. Stripe surfaces this as a requires_action status after confirmCardPayment. The Stripe SDK handles the 3DS redirect automatically when using stripe.confirmCardPayment()—it opens a popup or redirect to the bank's authentication URL. The client awaits the stripe.confirmCardPayment() promise, which does not resolve until the 3DS flow is complete (either authenticated or failed). The checkout UI must show a "Completing authentication..." loading state during this time, which can take 10–60 seconds.</HighlightBlock>
        <HighlightBlock as="p" tier="important">On 3DS completion, the promise resolves with succeeded or error. The frontend proceeds with the normal success or failure path. If the user closes the 3DS popup without completing authentication, Stripe returns requires_action again or an authentication_required error. The checkout UI returns to the payment step with an error message and the user can try again. The PaymentIntent is reusable: the same client_secret can be passed to stripe.confirmCardPayment() again without creating a new PaymentIntent or charge.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Guest Checkout and Account Association</h3>
        <p>Guest checkout issues a guestToken (a signed JWT with the email entered in the address step as the primary identifier) instead of a userId. Guest orders are associated with the email address. After order placement, the confirmation page offers account creation: "Create an account to track your order and save your address for next time." If the user creates an account with the same email, the guest orders are migrated to the new account. This migration is done lazily on first login: the accounts service checks for guest orders with the same email and re-associates them.</p>
        <p>Saved payment methods are only available to logged-in users. Guest users always enter their card details fresh. Offering "Save this card for future purchases" to guests requires an account creation step, which the post-order account creation CTA handles. The cart and checkout state for guest sessions are associated with the guestToken stored in a cookie; if the user creates an account during checkout, the guestToken is exchanged for a userId and the session is migrated.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Funnel Analytics and Abandonment</h3>
        <p>Each step transition fires a checkout_step_completed analytics event with the step name, session duration at this step, and any validation errors encountered. Step abandonment (session expires without completing the next step) is computed from session data: sessions where currentStep is address but completedSteps does not include payment are abandoned at the address step. This step-level funnel data drives A/B testing of checkout UX changes: the team can see exactly which steps have the highest abandonment rates and prioritize optimization accordingly.</p>
        <HighlightBlock as="p" tier="important">Abandoned cart emails (if the user entered their email in the address step but did not complete payment) are triggered by the session expiry job. The email includes the cart contents, a link to resume checkout, and potentially a discount offer. The session resume link encodes the sessionToken so the user returns to the payment step without re-entering address and shipping information. GDPR compliance requires that this email is only sent with the user's consent, obtained via a checkbox on the address step: "Email me if I forget to complete my order."</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-step-checkout-flow-workflow.svg"
          alt="Checkout flow sequence showing happy path (cart → address validation + tax → shipping selection → PaymentIntent creation → Stripe Elements card entry → confirmCardPayment → 3DS if required → order creation → confirmation) and failure paths (inventory expiry, payment failure, network error with retry)"
          caption="Checkout sequence: happy path through all steps plus failure recovery paths for inventory expiry, 3DS authentication, and payment failure"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Single-page checkout versus multi-step: single-page checkout (all fields on one page, submit once) eliminates the complexity of step state management and reduces the number of API round trips. The trade-off is cognitive load: presenting all fields at once (address, shipping, payment, review) is overwhelming for new users. A/B tests consistently show that multi-step checkout performs better for first-time purchasers, while returning users (who have saved addresses and payment methods) prefer the speed of single-page or "express checkout" flows. The optimal solution is to offer both: express checkout (one-click with saved defaults) for returning users and multi-step for new users.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Server-authoritative versus client-managed checkout state: storing checkout state on the server ensures that a browser crash or tab close does not lose the user's progress, and ensures that server-side validations (inventory availability, address verification) are the source of truth. The trade-off is latency: every step transition requires a network round trip, whereas a client-managed state machine can transition steps instantly. For a checkout flow where correctness (no duplicate charges, accurate inventory) is paramount, the server-authoritative approach is correct despite the latency cost.</HighlightBlock>
        <HighlightBlock as="p" tier="important">PaymentIntent creation timing: creating the PaymentIntent at the start of the payment step (rather than on submit) allows Stripe to run fraud scoring before the user submits, potentially blocking fraudulent transactions earlier. However, it means a PaymentIntent is created for every user who reaches the payment step, even those who abandon before submitting. Stripe charges no fee for creating a PaymentIntent that is not charged; the cost is only in created-but-unused records. Creating the PaymentIntent on submit is simpler but loses the fraud scoring benefit and adds latency to the submit path.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A production multi-step checkout flow is a server-authoritative state machine coordinating inventory reservation, tax calculation, and payment processing through validated step transitions. The canonical state (current step, validated data, inventory reservation ID, PaymentIntent ID) lives on the server; the frontend is a renderer of that state that sends transition requests and handles the response. Idempotency is enforced at both the Stripe layer (PaymentIntent ID prevents double charges) and the Order Service layer (idempotency key on order creation). Card data never touches application servers (Stripe Elements iframes, PCI SAQ A compliance). 3DS authentication is handled asynchronously within the stripe.confirmCardPayment() promise. Inventory is soft-reserved when the user reaches payment with a 15-minute TTL. The entire flow is instrumented for funnel analysis at each step, enabling data-driven optimization of abandonment rates.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
