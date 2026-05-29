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
  wordCount: 6200,
  readingTime: 37,
  lastUpdated: "2026-05-20",
  tags: ["hld", "checkout", "payments", "state-machine", "idempotency", "stripe"],
  relatedTopics: ["payment-ui-system", "shopping-cart-system"],
};

export default function MultiStepCheckoutFlowArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Checkout is the highest-risk revenue path in an e-commerce product. It coordinates cart pricing, inventory,
          shipping, tax, fraud, payment, order creation, notifications, and analytics across multiple services that can
          fail independently. A good checkout design optimizes conversion, but it must never trade away correctness:
          no duplicate charges, no phantom orders, no oversold inventory, and no card data touching application servers.
        </HighlightBlock>
        <p>
          A multi-step checkout usually includes cart review, address, shipping, payment, order review, and
          confirmation. The step structure reduces cognitive load and lets each stage validate only the information it
          needs. The trade-off is state management. Users may go backward, refresh the page, close the tab, fail 3DS
          authentication, lose inventory reservation, or retry after a network timeout. The system must treat checkout
          as a durable server-authoritative workflow, not a local form wizard.
        </p>
        <p>
          Assume a first-party commerce store with guest checkout, physical and digital goods, Stripe PaymentIntents,
          third-party tax calculation, shipping-rate calculation, and soft inventory reservation. The browser uses
          hosted payment fields so raw card numbers never touch product JavaScript or backend services. The user should
          resume an active checkout session after refresh, but expired reservations should send the user back to cart
          or attempt safe re-reservation.
        </p>
        <p>
          A staff or principal answer should frame checkout as a state machine with external side effects. Every step
          transition has validation, state persistence, idempotency, and recovery semantics. The hardest part is not
          drawing the UI steps; it is defining exactly when inventory is reserved, when payment intent is created, when
          the order becomes authoritative, and how retries behave after partial success.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Server-Authoritative Checkout Session</h3>
        <p>
          The checkout session is the canonical workflow record. It stores session ID, user or guest token, cart
          snapshot, price snapshot, current step, validated address, shipping method, tax amount, inventory
          reservation, PaymentIntent ID, idempotency keys, expiry, and state transitions. The client renders this state
          and requests transitions. It should not unilaterally advance to later steps after local validation only.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Inventory Reservation Is Temporary</h3>
        <p>
          Inventory is often soft-reserved when the user reaches payment or review, not when they add an item to cart.
          The reservation holds available inventory for a bounded TTL such as 15 minutes. On payment success, reserved
          inventory becomes sold. On expiry, cancellation, or payment failure beyond retry, the reservation is released.
          The UI must handle the case where re-reservation fails because another customer bought the last item.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Payments Require Idempotency Across Boundaries</h3>
        <p>
          Checkout needs idempotency at the payment provider, order service, and client retry layers. A PaymentIntent
          should be created once for a checkout session. Order creation should be keyed by the successful payment or
          session completion ID. If a webhook retries, a server crashes after charging, or a user double-clicks, the
          system should converge on one charge and one order.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3DS and SCA Are Asynchronous Flow States</h3>
        <p>
          Strong Customer Authentication can interrupt the normal payment flow with bank challenge screens, redirects,
          timeouts, and user cancellation. The checkout state machine should include "payment requires action" and
          "authentication failed" states. The user should be able to retry using the same payment intent where allowed,
          without losing cart, address, shipping, tax, or reservation context.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-step-checkout-flow-architecture.svg"
          alt="Multi-step checkout architecture showing checkout session service, inventory reservation, tax service, shipping service, payment service, order service, Stripe PaymentIntent, and analytics"
          caption="Architecture: server-authoritative checkout session coordinates inventory, tax, shipping, payment, order creation, and analytics."
        />
        <p>
          Checkout begins by creating a session from a cart snapshot. The snapshot freezes item IDs, quantities, prices,
          promotions, currency, and seller context for the checkout window. Freezing prices avoids surprising users if
          catalog prices change mid-checkout. The platform can still reject invalid promotions or expired inventory,
          but the user-facing flow should not silently mutate totals without explanation.
        </p>
        <p>
          Address submission validates deliverability, shipping eligibility, tax jurisdiction, fraud hints, and country
          restrictions. Shipping methods depend on address, cart weight, inventory location, seller constraints, and
          service availability. Tax is computed server-side because it is jurisdiction-specific and may depend on item
          category, destination, seller nexus, exemptions, and digital-versus-physical fulfillment.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-step-checkout-flow-workflow.svg"
          alt="Checkout workflow showing cart review, address validation, shipping, PaymentIntent, 3DS action, order creation, confirmation, and failure retries"
          caption="Workflow: each checkout step is a validated state transition with explicit failure recovery paths."
        />
        <p>
          Payment setup should use a payment service wrapper rather than calling the provider directly from many
          product services. The wrapper owns PaymentIntent creation, idempotency key construction, provider errors,
          webhook verification, and mapping provider states into internal checkout states. Hosted payment fields or
          provider elements keep card data out of application systems and reduce PCI scope.
        </p>
        <p>
          The authoritative completion path should be backend-driven. Once payment succeeds, the backend creates or
          confirms the order exactly once, converts reserved inventory into sold inventory, persists payment references,
          emits confirmation events, and marks the checkout session complete. Payment provider webhooks should be able
          to complete the order even if the user's browser closes after payment success.
        </p>
        <p>
          Analytics should be part of the design, not a later tag-manager patch. Every step view, validation error,
          retry, payment failure, 3DS challenge, inventory expiry, and completion should produce funnel data. However,
          analytics must never become part of the correctness path; dropped analytics should not block checkout.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/core-product-systems/multi-step-checkout-flow-failover.svg"
          alt="Checkout failure and failover paths showing duplicate submit protection, payment webhook recovery, inventory expiry, tax service fallback, and order idempotency"
          caption="Failure handling: duplicate submits, payment webhooks, expired reservations, external service failures, and idempotent order creation must converge safely."
        />
        <p>
          Multi-step checkout reduces cognitive load and creates natural validation boundaries, but it increases state
          management complexity and network round trips. Single-page checkout is faster for returning users with saved
          address and payment details. A mature product often supports express checkout for trusted returning users and
          multi-step checkout for first-time or high-friction purchases.
        </p>
        <p>
          Server-authoritative state costs latency but protects correctness and resume behavior. Client-only checkout
          feels instant between steps but struggles with refresh, partial validation, inventory expiry, and payment
          recovery. For checkout, correctness dominates. The UI can use optimistic presentation for non-financial
          fields, but authoritative step completion should come from the server.
        </p>
        <p>
          Reserving inventory early reduces sellout disappointment but increases hoarding and abandoned reservation
          cost. Reserving late improves inventory utilization but may let an item sell out while the user enters
          payment. Many systems reserve at payment or review, use a short TTL, and clearly show reservation expiry.
          Scarce inventory products may reserve earlier with stricter timers.
        </p>
        <p>
          Creating PaymentIntents at the payment step allows provider-side fraud checks and payment method preparation
          before final review. Creating them only on final submit reduces unused provider objects but adds latency and
          complexity to the most sensitive click. The right choice depends on provider behavior, fraud requirements,
          and how often users abandon after entering payment.
        </p>
        <p>
          Webhook-driven completion is more reliable than browser-only completion because the browser can close after
          payment succeeds. The trade-off is that the system must handle races between browser completion calls and
          webhook retries. Idempotency keys and state-machine guards make both paths converge on the same order.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Principal-level decision frame</h3>
        <p>
          The checkout design should classify every dependency by whether it is correctness-critical or experience-only.
          Payment authorization, inventory reservation, tax obligations, fraud decisions, and order creation are
          correctness-critical. Promotions, recommendations, analytics, and some shipping estimates can degrade without
          blocking a valid order. This classification determines timeout behavior, retries, fallbacks, and whether the
          user can proceed during partial outages.
        </p>
        <p>
          A principal answer should also explain reconciliation. Payment providers, inventory systems, warehouses,
          tax services, and order databases can disagree temporarily. The system needs durable state transitions,
          replayable events, idempotency records, webhook verification, and back-office repair tools. The happy-path UI
          is only one part of checkout; the operational system must resolve charged-without-order, order-without-stock,
          duplicated-submit, and webhook-late cases without manual data surgery.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Model checkout as explicit states and transitions. Avoid ambiguous booleans such as "paid" and "ordered"
          without transition history. States should include address pending, shipping selected, reservation active,
          payment requires action, payment processing, payment succeeded, order created, complete, expired, and failed.
        </p>
        <p>
          Generate idempotency keys deterministically from checkout session, payment intent, and action type. User
          double-clicks, browser retries, webhook retries, and server restarts should all reuse the same keys for the
          same logical action. Store idempotency results long enough to cover provider retry windows.
        </p>
        <p>
          Keep card data out of the application. Use hosted provider fields, tokenize through the provider, verify
          webhooks, and treat payment provider status as external truth that must be reconciled into internal state.
          Never log payment secrets, client secrets, or full card data.
        </p>
        <p>
          Separate user-facing failure messages from internal causes. "Payment authentication timed out," "Item is no
          longer available," and "Tax calculation unavailable" require different UI recovery. Internal logs should
          include provider error codes, correlation IDs, and checkout state, but the user should see actionable and
          safe messages.
        </p>
        <p>
          Instrument the funnel with both conversion and reliability metrics: abandonment by step, validation error
          rates, payment authorization failures, 3DS challenge rate, reservation expiry, webhook lag, duplicate-submit
          dedupe count, order creation failures, and tax or shipping provider latency.
        </p>
        <p>
          Build reconciliation and support tooling as part of checkout, not after launch. Operators need to inspect a
          checkout session, payment intent, reservation, tax quote, shipment quote, order record, webhook history, and
          notification side effects in one place. Principal-level systems assume some orders will land in exceptional
          states and make those states repairable with audited workflows.
        </p>
        <p>
          Checkout should be modeled as an order intent state machine, not a sequence of pages. Cart validation, inventory holds, shipping quotes, tax calculation, promotions, payment authorization, fraud checks, and order creation can all expire or change independently. A principal-level design records which version of each decision was used and revalidates critical assumptions before payment capture and final order placement.
        </p>
        <p>
          Payment integration requires careful idempotency. Users refresh, browsers retry, payment providers send duplicate webhooks, and mobile apps can resume after network loss. The frontend should show clear pending states, while the backend uses idempotency keys and durable order/payment state so a retry cannot double-charge or create two orders. The UI should recover from ambiguous payment states by polling a trusted order status rather than asking the user to pay again.
        </p>
        <p>
          Fraud and risk review should be modeled as a first-class asynchronous branch. Some orders can complete immediately, some require 3-D Secure or identity challenge, and some enter manual review after payment authorization. The checkout UI should preserve the user&apos;s order intent, show truthful pending state, avoid duplicate payment attempts, and let support reconcile provider events with internal order state.
        </p>
        <p>
          Checkout observability should follow the order intent across services. Track cart version, inventory hold id, quote id, tax request, payment intent, fraud decision, order id, and provider webhook correlation. When a user reports a failed checkout, support should reconstruct the decision chain without guessing from disconnected logs.
        </p>
        <p>
          Guest checkout and account checkout also need different recovery rules. A signed-in user can resume from durable cart and order state, while a guest may depend on email links, browser storage, and payment-provider callbacks. The design should preserve conversion without weakening fraud, privacy, or support traceability.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The biggest pitfall is treating payment success and order creation as one browser callback. If the user closes
          the tab after the card is charged but before order creation, the system creates a support incident. Provider
          webhooks and idempotent order creation are required.
        </p>
        <p>
          Another pitfall is missing idempotency at one layer. Stripe may deduplicate charges, but the order database
          can still create two orders from two completion events. Idempotency must exist at payment confirmation, order
          creation, inventory finalization, and notification side effects.
        </p>
        <p>
          Inventory reservation expiry can be mishandled. If payment succeeds after a reservation expired and inventory
          was sold to another user, the system must have a deterministic policy: reject before confirmation, attempt
          re-reservation before payment, or compensate with backorder. The worst outcome is charging without a
          fulfillable order.
        </p>
        <p>
          Tax and shipping errors are often underdesigned. These services fail or return slow results. The UI should
          not let users pay against stale totals. If totals change after address or shipping updates, the user must see
          the updated total before payment confirmation.
        </p>
        <p>
          Finally, analytics can leak sensitive data when implemented casually. Funnel events should include step and
          error categories, not raw addresses, payment details, or full cart contents unless privacy policy and
          minimization rules explicitly allow it.
        </p>
        <p>
          Another pitfall is treating checkout as a single service boundary. In reality, checkout coordinates catalog,
          inventory, pricing, tax, shipping, payment, fraud, orders, notifications, and analytics. If each dependency
          has independent retries and side effects without a shared state machine, failures become duplicate charges,
          oversold inventory, inconsistent totals, and support-only recovery.
        </p>
        <p>
          Teams often treat checkout errors as form validation only. Real failures include inventory race, address normalization changes, payment authentication challenges, tax service timeout, fraud review, coupon revocation, and shipping carrier outage. The frontend should classify recovery paths so users know whether to edit input, wait, choose another method, or contact support.
        </p>
        <p>
          Another pitfall is hiding price changes until the last step. Taxes, shipping, discounts, currency conversion, and inventory substitutions can alter totals. The design should show recalculation triggers and preserve user trust by making material changes explicit before authorization or capture.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Retail e-commerce uses multi-step checkout for physical goods, promotions, taxes, shipping options, guest
          checkout, and saved payment methods. The flow needs both conversion optimization and strong consistency
          around inventory and payment.
        </p>
        <p>
          Travel and ticketing systems use similar concepts with scarcer inventory and stricter reservation timers.
          Seats, rooms, or tickets may be held temporarily while the user completes payment. Expiry messaging and
          re-pricing are central to the experience.
        </p>
        <p>
          Digital goods and subscription products can skip shipping but add entitlement activation, trial eligibility,
          plan changes, proration, tax, and fraud controls. The same idempotency and webhook recovery principles apply.
        </p>
        <p>
          Marketplace checkout adds seller splits, multi-merchant fulfillment, escrow, dispute handling, and per-seller
          tax/shipping rules. This article assumes first-party inventory, but the state-machine approach extends to
          marketplace flows with more complex settlement and fulfillment states.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Why should checkout state be server-authoritative?
        </h3>
        <p>
          Checkout coordinates inventory, tax, shipping, payment, and order creation. The server must be the source of
          truth for validated state, current step, totals, reservations, and payment references. This lets users resume
          after refresh, prevents clients from skipping validation, and keeps external side effects consistent. The UI
          can cache local inputs, but step completion should come from server transition results.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How do you prevent duplicate charges and duplicate orders?
        </h3>
        <p>
          Create one PaymentIntent per checkout session and reuse it across retries. Generate idempotency keys for
          payment confirmation and order creation. The order service should use a unique key based on payment intent or
          checkout completion ID so webhook retries and browser retries return the existing order. The submit button is
          disabled for UX, but server-side idempotency is the real protection.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          When would you reserve inventory?
        </h3>
        <p>
          For typical commerce, reserve when the user reaches payment or review, with a clear TTL. Reserving at add to
          cart wastes inventory and enables hoarding. Reserving only after payment risks charging for unavailable
          items. Scarce inventory products may reserve earlier with stricter timers. Payment should not be confirmed
          unless reservation is active or successfully renewed.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          How should the system handle 3DS authentication?
        </h3>
        <p>
          Treat 3DS as an explicit payment state. The client invokes the provider SDK and shows an authentication
          pending state. If the user succeeds, completion continues. If they cancel or fail, the checkout returns to
          payment with the same session context and a retry option. The PaymentIntent should be reused where provider
          rules allow, and the order should not be created until payment is confirmed.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What happens if payment succeeds but the browser closes?
        </h3>
        <p>
          The payment provider webhook should complete the backend flow. The webhook verifies payment status, calls
          idempotent order creation, finalizes inventory, and emits confirmation events. If the browser later calls the
          complete endpoint, it receives the already-created order. This avoids charging without an order.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">
          What metrics matter for checkout?
        </h3>
        <p>
          Track step abandonment, validation errors, tax and shipping latency, reservation expiry, payment failure
          reasons, 3DS challenge and completion rate, duplicate-submit dedupe count, webhook lag, order creation
          failure, and conversion by device and payment method. These metrics reveal both revenue friction and
          correctness risks.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://docs.stripe.com/payments/payment-intents" target="_blank" rel="noreferrer">
              Stripe PaymentIntents documentation
            </a>
            , payment lifecycle and confirmation model.
          </li>
          <li>
            <a href="https://docs.stripe.com/payments/3d-secure" target="_blank" rel="noreferrer">
              Stripe 3D Secure authentication
            </a>
            , SCA and requires-action handling.
          </li>
          <li>
            <a href="https://docs.stripe.com/api/idempotent_requests" target="_blank" rel="noreferrer">
              Stripe idempotent requests
            </a>
            , duplicate request protection.
          </li>
          <li>
            <a href="https://docs.stripe.com/security/guide" target="_blank" rel="noreferrer">
              Stripe security guide
            </a>
            , card-data handling and PCI scope.
          </li>
          <li>
            <a href="https://stripe.com/guides/strong-customer-authentication" target="_blank" rel="noreferrer">
              Stripe guide to Strong Customer Authentication
            </a>
            , regulatory context for European card payments.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
