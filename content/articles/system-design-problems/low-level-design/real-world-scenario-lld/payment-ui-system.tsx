"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-payment-ui-system",
  title: "Design a Payment UI System (PCI, Secure Inputs, Third-party Integration)",
  description:
    "Production-grade payment UI with PCI compliance, secure card inputs, payment state machine, and third-party processor integration.",
  category: "low-level-design",
  subcategory: "real-world-scenario-lld",
  slug: "payment-ui-system",
  wordCount: 5400,
  readingTime: 33,
  lastUpdated: "2026-05-06",
  tags: ["lld", "payment", "pci-compliance", "security", "stripe"],
  relatedTopics: ["checkout-flow"],
};

export default function PaymentUISystemArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="important">Payment UI is the most security-critical frontend component an engineering team will build. The core constraint is PCI-DSS: if the application's JavaScript ever touches raw card data (card number, CVV, expiry), the entire application environment falls under strict PCI-DSS audit scope. The standard solution is to use a payment processor's hosted fields—iframes served from the processor's domain where card data is entered and immediately tokenized, never passing through the application's code or servers.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Beyond PCI compliance, payment UIs must handle a complex set of interaction states: real-time card number formatting (insert spaces every 4 digits, switch between card brand icons), CVV field length varying by card brand (3 digits for Visa/Mastercard, 4 for Amex), 3D Secure authentication flows (a modal or redirect to the card issuer for step-up authentication), and recovery from payment failures without allowing double charges through retry.</HighlightBlock>
        <HighlightBlock as="p" tier="important">The payment UI is also the highest-stakes point for user trust. A confusing or broken payment experience is not just a UX problem—it means lost revenue and potentially a user who never returns. Every error message must be clear and actionable. Every loading state must be explicit. The submit button must not allow double submission.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> Stripe is the payment processor. The application uses Stripe's PaymentIntents API (the modern, recommended flow). Card data is entered in Stripe Elements (hosted iframe fields). The application server manages the PaymentIntent creation and confirmation server-to-server. 3DS authentication is handled via Stripe's built-in handleNextAction() flow. The UI must support saved payment methods for returning authenticated users.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Card input via Stripe Elements:</strong> Card number, expiry, and CVV entered in Stripe-hosted iframes. Application code never accesses card data.</li>
          <li><strong>Real-time card validation:</strong> Stripe Elements provides real-time feedback (invalid card number, expiry in the past) without a server round-trip.</li>
          <HighlightBlock as="li" tier="important"><strong>Payment method selection:</strong> For authenticated users with saved cards, show a list of saved payment methods. Allow adding a new card.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Digital wallet support:</strong> Apple Pay and Google Pay via Stripe Payment Request Button. No card input needed; device authenticates payment.</HighlightBlock>
          <li><strong>3DS authentication:</strong> When card issuer requires step-up authentication, present the authentication flow inline (Stripe handles the redirect or modal).</li>
          <li><strong>Error handling:</strong> Card declined, insufficient funds, CVV mismatch, and expired card each have specific, user-comprehensible error messages.</li>
          <HighlightBlock as="li" tier="important"><strong>Double-submit prevention:</strong> Submit button disabled and shows a spinner during payment processing. Idempotency key prevents server-side double charge on retry.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>PCI compliance:</strong> Application achieves PCI-DSS SAQ A compliance; no card data in application code, servers, or logs.</li>
          <HighlightBlock as="li" tier="important"><strong>Idempotency:</strong> Retrying payment after a network failure cannot produce a duplicate charge.</HighlightBlock>
          <li><strong>Performance:</strong> Stripe Elements iframe loads within 1 second of payment form mount. Card tokenization within 500ms of submit.</li>
          <HighlightBlock as="li" tier="crucial"><strong>Accessibility:</strong> Payment form is keyboard-navigable and screen-reader-compatible. Stripe Elements provides ARIA labels for its hosted fields.</HighlightBlock>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="important">The payment flow uses Stripe's PaymentIntents API with a client-server handshake. On form mount, the application server creates a PaymentIntent (specifying amount, currency, and metadata) and returns its client_secret to the frontend. The frontend initializes Stripe Elements with this client_secret.</HighlightBlock>
<HighlightBlock as="p" tier="important">When the user submits, the frontend calls stripe.confirmCardPayment(client_secret, paymentMethodOptions), which sends the card token directly to Stripe's servers. Stripe processes the payment and returns a result. If additional authentication is required (3DS), Stripe presents its authentication UI. On success, the application server is notified via webhook to fulfill the order.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">The client_secret is the key security primitive: it authorizes the frontend to confirm the specific PaymentIntent but cannot be used to create new charges or access other data. It can be safely included in the frontend response—it is scoped to the single PaymentIntent and expires when the intent is confirmed or cancelled.</HighlightBlock>
      </section>

      <section>
                <h2>Diagram Walkthrough</h2>

<ArticleImage
          src="/diagrams/system-design-problems/low-level-design/real-world-scenario-lld/payment-ui-system.svg"
          alt="Payment UI system showing PCI isolation flow through Stripe hosted fields, payment state machine from idle through validating and processing to success or failure, 3DS authentication redirect, and server-side webhook verification"
          caption="Payment UI system showing PCI isolation flow through Stripe hosted fields, payment state machine from idle through validating and processing to success or failure, 3DS authentication redirect, and server-side webhook verification"
        />

        <HighlightBlock as="p" tier="crucial">
          Interview signal: the diagram captures the end-to-end flow for <strong>Design a Payment UI System (PCI, Secure Inputs, Third-party Integration)</strong>. You should be able to explain the happy path and the failure paths (retries, cancellation, backpressure), not just the API surface.
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

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Payment State Machine</h3>
        <HighlightBlock as="p" tier="crucial">The payment UI is driven by a state machine with states: idle (form ready for input), validating (submit clicked, Stripe Elements validation running), processing (confirmCardPayment in flight), requires_action (3DS authentication needed), succeeded (payment confirmed), and failed (payment rejected with error). Transitions are deterministic: the user can only retry from the failed state; the processing state disables all inputs and the submit button; the succeeded state transitions immediately to the confirmation page.</HighlightBlock>
        <p>The failed state must capture the specific error: Stripe returns machine-readable error codes (card_declined, insufficient_funds, incorrect_cvc, expired_card, processing_error) that map to human-readable messages. "insufficient_funds" → "Your card has insufficient funds." "incorrect_cvc" → "The security code you entered is incorrect." "processing_error" → "We couldn't process your payment. Please try again or use a different card." The mapping should be exhaustive for known codes and fall back to a generic message for unknown codes.</p>
        <HighlightBlock as="p" tier="important">From the failed state, the user can retry with the same card (for transient errors like processing_error) or switch to a different payment method (for card-specific errors like card_declined). Each retry generates a fresh Stripe Elements instance (to clear the previous card state) and, critically, uses the same idempotency key if retrying after a network error, or a new idempotency key if the user is intentionally retrying with the same card (a new payment attempt, not a retry of the same attempt).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Stripe Elements Integration</h3>
        <p>Stripe Elements are React components that render Stripe's hosted iframes. The integration requires: (1) loading the Stripe.js SDK asynchronously (loadStripe(publishableKey) returns a promise); (2) wrapping the payment form in an Elements provider (stripe={"{"}stripePromise{"}"} elements={"{"}elements{"}"}) which passes the Stripe context to child elements; (3) rendering CardNumberElement, CardExpiryElement, and CardCvcElement in the form (or the unified CardElement for a simpler integration); (4) calling stripe.confirmCardPayment() on form submit, passing the client_secret and the billing details.</p>
        <p>Styling Stripe Elements: the hosted iframes cannot be styled with the application's CSS directly. Instead, Elements accepts a style prop that applies CSS-in-JS styles to the iframe's contents using Stripe's styling API. Colors, fonts, and placeholder text can be customized. The font family must be listed in the application's Stripe account configuration and loaded via Google Fonts or hosted fonts—Stripe's iframe fetches the font from the configured source. This allows Elements to match the application's design without the application ever having access to the card data.</p>
        <p>The CardElement (unified field) is simpler to integrate but provides less layout flexibility than separate CardNumberElement/CardExpiryElement/CardCvcElement. The unified field shows a single input "4242 4242 4242 4242 | MM/YY | CVV" in one horizontal row. Separate fields allow custom layout (card number on its own row, expiry and CVV side by side on the next row) but require more integration code. The recommendation is to use the PaymentElement (Stripe's newest unified component) which automatically adapts to show the optimal input for the customer's country and card type.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">3DS Authentication Handling</h3>
        <HighlightBlock as="p" tier="important">When stripe.confirmCardPayment() returns a result with status "requires_action", the card issuer requires step-up authentication. Stripe's handleNextAction() function handles this automatically: it opens an iframe (or redirects, depending on the 3DS version and card issuer) where the user authenticates with their bank (typically via a code sent to their phone or through their banking app's biometric authentication). After authentication, Stripe resolves the handleNextAction() promise with either a success or a failure.</HighlightBlock>
        <p>The application UI must handle the "requires_action" state gracefully: show a loading state ("Your bank is requesting verification..."), wait for Stripe to handle the authentication flow, then process the result. The user must not be able to close the authentication flow mid-process (Stripe's iframe is not dismissible by the application), but the application can detect if the user navigates away (pagehide event) and show a "Authentication was interrupted. Please try again" message on return.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Digital Wallet Integration</h3>
        <HighlightBlock as="p" tier="important">Apple Pay and Google Pay use Stripe's PaymentRequestButton component. This component checks whether the user's browser and device support a digital wallet. If supported, it renders a branded button ("Pay with Apple Pay" or the Google Pay button). Clicking the button opens the native OS payment sheet—the device's secure enclave handles authentication (Face ID, Touch ID, fingerprint, or PIN). The user does not enter card details; the device generates a payment token authenticated by the user's biometrics.</HighlightBlock>
        <p>Integration requirements for Apple Pay: the merchant domain must be verified with Apple (a domain verification file hosted at /.well-known/apple-developer-merchantid-domain-association). The Stripe account must have Apple Pay enabled. These are configuration steps done once at setup. Google Pay requires no additional domain verification—enabling it in the Stripe dashboard is sufficient. Both methods work on the same paymentRequest object: the application creates a PaymentRequest with amount and currency, then renders the PaymentRequestButton.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Idempotency and Double-Submit Prevention</h3>
        <HighlightBlock as="p" tier="important">The submit button must be disabled immediately on click (before the Stripe API call completes) and remain disabled until the payment resolves. This is the UI-level double-submit prevention. The server-level protection uses Stripe's native idempotency: each PaymentIntent has a unique ID, and confirming the same PaymentIntent twice (using the same client_secret) returns the existing result rather than attempting a new charge. However, if the network error occurs after the client calls confirmCardPayment but before it receives the response, and the user then tries to retry by creating a new PaymentIntent, a new charge attempt begins.</HighlightBlock>
        <p>The correct pattern for network-error retry: do not create a new PaymentIntent. Instead, call stripe.retrievePaymentIntent(client_secret) to check the existing PaymentIntent's status. If status is "succeeded," show the confirmation page—the payment actually went through. If status is "requires_payment_method" (not yet charged), retry the confirmCardPayment with the same client_secret and a new card entry (the user may want to try a different card). This ensures the user is never charged twice for the same PaymentIntent and never left confused about whether their payment went through.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Saved Payment Methods</h3>
        <p>For authenticated users, Stripe Customers allow attaching PaymentMethods (tokens for saved cards) to a Customer object. The application server stores the Stripe Customer ID per user account. On the payment form, the application fetches the user's attached PaymentMethods from the server (which in turn queries Stripe's API) and displays them as selectable cards: "Visa ending in 4242." The user selects a saved card and clicks pay without re-entering card details.</p>
        <p>Deleting saved payment methods requires the application to call Stripe's API to detach the PaymentMethod from the Customer, then remove the reference from the user's account. The UI for managing saved payment methods belongs in account settings, not in the payment flow—providing management there (with appropriate confirmation for deletion) separates the concern and avoids cluttering the checkout experience.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">PaymentElement versus CardElement: Stripe's newer PaymentElement (a single component for all payment methods) is simpler to integrate and automatically shows the right inputs for the user's context (card, SEPA, iDEAL, etc.). CardElement (card-only input) is simpler and predictable but doesn't support non-card payment methods. For applications that only need card payments, CardElement is appropriate; for applications that may expand to other payment methods (SEPA, Klarna, buy-now-pay-later), starting with PaymentElement is more future-proof.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Client-side validation versus Stripe's built-in validation: Stripe Elements provides real-time validation for card numbers (Luhn algorithm), expiry dates (not in the past), and CVV length (varies by card brand). The application does not need to duplicate this validation logic. The only application-level validation needed is ensuring the card fields are complete (Stripe's complete event fires when all fields are filled without errors) before enabling the submit button.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">Webhook versus synchronous confirmation for order fulfillment: after stripe.confirmCardPayment() succeeds on the client, the application could fulfill the order immediately based on the client-side success. However, the authoritative confirmation should come from Stripe's webhook (payment_intent.succeeded event delivered to the server), because the client-side result can be spoofed or interrupted. The application server should: fulfill the order on webhook receipt, and the client should poll or wait for the server's confirmation of fulfillment (separate from Stripe's payment confirmation) before showing the success page. This prevents showing a "success" page for an order that wasn't actually created.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">The payment state machine (idle → validating → processing → requires_action → succeeded/failed) drives the UI through every state with appropriate loading indicators, clear</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">error messages, and disabled submit to prevent double submission. Idempotency is handled by retrievePaymentIntent on network error rather than creating a new PaymentIntent. Digital wallets (Apple Pay, Google Pay) require domain verification and Stripe account configuration but provide the highest-converting checkout experience for mobile users.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
