"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-payment-processing",
  title: "Payment Processing",
  description:
    "Comprehensive guide to implementing payment processing covering payment gateway integration, authorization and capture flows, 3D Secure authentication, refund processing, PCI compliance, and handling payment failures at scale.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "payment-processing",
  version: "extensive",
  wordCount: 6400,
  readingTime: 26,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "payments",
    "processing",
    "backend",
    "gateway-integration",
    "pci-compliance",
  ],
  relatedTopics: ["payment-ui", "checkout-flow", "idempotency", "fraud-detection"],
};

export default function PaymentProcessingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Payment processing is the backbone of e-commerce, handling the secure transfer of funds from customer to merchant. The process involves multiple parties: the customer (cardholder), merchant (business), payment gateway (technical intermediary), acquiring bank (merchant&apos;s bank), issuing bank (customer&apos;s bank), and card networks (Visa, Mastercard, etc.). For staff and principal engineers, payment processing involves navigating security requirements (PCI DSS compliance), handling failures gracefully (declined cards, network timeouts), and optimizing for conversion (minimizing friction while preventing fraud).
        </p>
        <p>
          The technical complexity of payment processing extends far beyond simple API calls. Authorization must happen in real-time (&lt;3 seconds typical SLA), with proper handling of 3D Secure challenges (SCA requirements in Europe). Capture timing varies by business model—immediate for digital goods, on-shipment for physical goods, periodic for subscriptions. Refunds and chargebacks require idempotent processing to prevent double-refunds. The system must handle partial authorizations (split tender), recurring billing (card updater services), and cross-border transactions (currency conversion, international fees).
        </p>
        <p>
          For staff and principal engineers, payment architecture involves distributed systems challenges. Payment state must be consistent across services (order service, inventory service, notification service). Webhooks from payment gateways arrive asynchronously and may be delayed or duplicated—idempotency is critical. Retry logic must handle transient failures without duplicate charges. The system must support multiple payment gateways (redundancy, geographic optimization, cost optimization) with a unified abstraction layer. Monitoring must detect authorization rate drops, gateway latency spikes, and fraud pattern changes before they impact revenue.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Payment Lifecycle</h3>
        <p>
          Payment processing follows a defined lifecycle: Authorization → Capture → Settlement → Refund (optional). Authorization verifies the card is valid and has sufficient funds, placing a hold on the amount. The hold reduces the customer&apos;s available credit but doesn&apos;t transfer funds. Authorization expires if not captured (7-30 days depending on card network and issuer). Capture transfers funds from customer to merchant. Capture can be full (entire authorized amount) or partial (less than authorized—remaining amount is released). Settlement is the batch process where captured funds are deposited to the merchant&apos;s bank account (typically 1-3 business days after capture).
        </p>
        <p>
          Authorization types vary by use case. Standard authorization is used for immediate purchases. Pre-authorization (auth-only) verifies funds without immediate capture—used for hotels (incidentals), car rentals (deposits), and restaurants (tips added later). Incremental authorization allows adding to an authorized amount—used when final amount is uncertain (restaurant tips, gas stations). Re-authorization is needed when the original authorization expires before capture (long pre-order windows, backorders).
        </p>
        <p>
          Void vs. refund distinction is critical. Void cancels an uncaptured authorization—no funds change hands, no fees charged. Refund reverses a captured payment—funds return to customer, fees typically not refunded. Void is instantaneous, refund takes 3-10 business days to appear on customer statement. Always void uncaptured authorizations rather than capturing and refunding—saves interchange fees and improves customer experience.
        </p>

        <h3 className="mt-6">Payment Gateway Integration</h3>
        <p>
          Payment gateway selection depends on geography, business model, and volume. Stripe dominates developer-friendly integration and startups. Adyen excels at enterprise and international (single platform for global acquiring). Braintree (PayPal) offers PayPal integration. Authorize.net is legacy but widely used. Regional gateways (Alipay for China, iDEAL for Netherlands) may be required for local payment methods. Multi-gateway strategy provides redundancy (gateway outage doesn&apos;t stop sales) and optimization (route by cost, success rate, geography).
        </p>
        <p>
          Gateway abstraction layer enables switching gateways without business logic changes. Define unified interface: authorize(), capture(), refund(), void(). Implement adapter for each gateway (StripeAdapter, AdyenAdapter). Handle gateway-specific quirks in adapter—Stripe uses payment intent objects, Adyen uses payment method details, Braintree uses nonces. Abstract response codes—map gateway-specific decline codes to unified codes (insufficient_funds, suspected_fraud, invalid_card).
        </p>
        <p>
          Webhook handling processes asynchronous payment events. Gateway sends webhook for authorization success, capture success, refund processed, dispute opened. Webhook verification is critical—verify signature (HMAC) to prevent spoofing. Idempotency prevents duplicate processing—store processed webhook IDs with TTL. Webhook retry handling—gateways retry failed webhooks (exponential backoff). Endpoint must be idempotent and return 200 OK quickly (process asynchronously).
        </p>

        <h3 className="mt-6">3D Secure Authentication</h3>
        <p>
          3D Secure (3DS) adds cardholder authentication to online payments. Customer is redirected to bank&apos;s authentication page (or in-app modal) for verification—password, SMS code, biometric. 3DS 2.0 (EMV 3DS) improves mobile experience, supports frictionless flow (bank approves without challenge based on risk signals). 3DS 1.0 redirects to bank page, high friction, being phased out. 3DS 2.2 adds support for trusted beneficiary, recurring transactions.
        </p>
        <p>
          SCA (Strong Customer Authentication) mandate in Europe requires 3DS for most online card payments. Exemptions exist: low value (&lt;€30), recurring (same amount, same merchant), trusted beneficiary (customer whitelists merchant), transaction risk analysis (bank&apos;s fraud model approves without challenge). SCA applies to customer-present transactions in EEA (European Economic Area). Non-EEA merchants selling to EEA customers must support 3DS.
        </p>
        <p>
          3DS flow integration requires handling redirects and callbacks. Customer enters card details, gateway returns 3DS challenge required. Customer completes challenge (redirect to bank, authenticate). Bank redirects back to merchant&apos;s callback URL with authentication result. Gateway confirms 3DS result, proceeds with authorization. Handle abandonment—customer closes browser during 3DS challenge. Retry logic for 3DS failures (timeout, bank unavailable).
        </p>

        <h3 className="mt-6">Payment Failures and Retry</h3>
        <p>
          Payment decline codes indicate why payment failed. Insufficient_funds—customer lacks credit/balance. Suspected_fraud—issuer&apos;s fraud model flagged transaction. Invalid_card—card number, expiry, or CVV incorrect. Do_not_honor—generic decline, issuer won&apos;t specify reason. Card_expired—card past expiration date. Pickup_card—issuer wants card returned (lost/stolen). Map decline codes to user-friendly messages and retry strategies.
        </p>
        <p>
          Retry strategy depends on decline reason. Soft declines (insufficient_funds, temporary_unavailable) can be retried—exponential backoff (1 minute, 10 minutes, 1 hour). Hard declines (invalid_card, card_expired, suspected_fraud) should not be retried immediately—require customer action (update card, contact bank). Smart retry—schedule retry for optimal time (payday for insufficient funds, evening for business cards). Retry limits prevent harassment (max 3-5 retries per charge).
        </p>
        <p>
          Account updater services automatically update card details. Visa Account Updater (VAU), Mastercard Automatic Billing Updater (ABU), American Express SafeKey. Services provide new card number/expiry when customer&apos;s card is reissued. Reduces involuntary churn for subscriptions (card expired, customer forgets to update). Enrollment is automatic for most cards, opt-out available. Integration via gateway—submit batch of tokens, receive updated tokens.
        </p>

        <h3 className="mt-6">Refund Processing</h3>
        <p>
          Refund types vary by business need. Full refund returns entire captured amount. Partial refund returns portion (restocking fee, used portion). Multiple refunds can be issued against a single capture (return some items now, others later) until total refunded equals captured amount. Refund timing—funds return to customer in 3-10 business days (card network, issuer dependent). Merchant sees refund in next settlement (1-2 days).
        </p>
        <p>
          Refund validation prevents errors. Validate refund amount ≤ captured amount (not authorized, captured). Validate refund window (within 90 days, 1 year, or policy). Validate item eligibility (some items non-refundable). Idempotency prevents double-refunds—refund ID ensures same refund processed once. Refund reason tracking (defective, wrong item, customer changed mind) for analytics and fraud detection.
        </p>
        <p>
          Chargeback handling responds to customer disputes. Customer disputes charge with bank (fraud, not received, defective). Bank initiates chargeback, funds withdrawn from merchant. Merchant can accept or fight (represent with evidence). Chargeback fees ($15-50) charged regardless of outcome. High chargeback rate (&gt;1%) risks termination. Evidence for fighting: delivery confirmation, customer communication, terms of service, prior purchases.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Payment processing architecture spans client-side tokenization, backend payment service, gateway integration, and webhook handling. Client collects card data securely (hosted fields, payment SDK), receives payment method token. Backend payment service orchestrates authorization, capture, refund. Gateway communicates with card networks, issuing banks. Webhooks handle async events (authorization success, capture success, disputes).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-processing/payment-architecture.svg"
          alt="Payment Processing Architecture"
          caption="Figure 1: Payment Processing Architecture — Client tokenization, backend orchestration, gateway integration, and webhook handling"
          width={1000}
          height={500}
        />

        <h3>Client-Side Tokenization</h3>
        <p>
          PCI compliance requires secure card data handling. Never touch raw card data—use hosted fields (Stripe Elements, Braintree Hosted Fields) or payment SDKs (Stripe.js, PayPal SDK). Hosted fields are iframes served from gateway—merchant page never sees card data. SDKs tokenize card data in browser, return payment method token. Token is safe to send to your backend—no PCI scope (SAQ A).
        </p>
        <p>
          Payment method types vary by gateway. Card tokens represent card details (tokenized card number, expiry, CVV verification). Digital wallet tokens represent Apple Pay/Google Pay payment methods (device account number, cryptogram). Bank account tokens represent ACH/SEPA details (account number, routing number). Each token type has different processing flows, fees, and failure modes.
        </p>
        <p>
          Card verification (CVV, AVS) happens during authorization. CVV verification checks 3-digit code on back of card—reduces fraud. AVS (Address Verification Service) checks billing address against issuer records—reduces fraud. CVV and AVS responses affect fraud scoring. Some gateways allow configuring AVS/CVV requirements (require match, allow mismatch with higher risk score).
        </p>

        <h3 className="mt-6">Backend Payment Service</h3>
        <p>
          Payment service orchestrates payment lifecycle. Authorize endpoint accepts payment method token, amount, currency, metadata. Creates payment intent (Stripe) or payment object (Adyen) via gateway. Handles 3DS redirect if required. Returns client secret or redirect URL. Capture endpoint accepts payment ID, amount (for partial capture). Triggers fund transfer. Refund endpoint accepts payment ID, amount, reason. Validates refund eligibility.
        </p>
        <p>
          Payment state machine tracks payment status. States: pending (created, awaiting authorization), authorized (funds held), capturing (capture in progress), captured (funds transferred), refunding (refund in progress), refunded (funds returned), failed (authorization declined), disputed (chargeback opened). State transitions are guarded—can&apos;t capture failed payment, can&apos;t refund pending payment. State changes trigger webhooks to downstream services.
        </p>
        <p>
          Idempotency prevents duplicate charges. Idempotency key (UUID) generated client-side, sent with payment request. Backend stores key with payment ID. Duplicate request with same key returns original payment (not new charge). Key expires after TTL (24 hours). Idempotency is critical for retry logic—network timeout doesn&apos;t mean payment failed, check idempotency key before retrying.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-processing/authorization-capture-flow.svg"
          alt="Authorization and Capture Flow"
          caption="Figure 2: Authorization and Capture Flow — Tokenization, 3DS, authorization, capture, and settlement"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Gateway Integration Layer</h3>
        <p>
          Gateway adapter pattern abstracts gateway-specific APIs. Define PaymentGateway interface: authorize(), capture(), refund(), void(), getPaymentStatus(). Implement adapter per gateway (StripeAdapter, AdyenAdapter, BraintreeAdapter). Adapter handles gateway-specific request/response formats. Business logic uses interface, not concrete adapter. Switch gateways by changing adapter—no business logic changes.
        </p>
        <p>
          Gateway routing optimizes cost and success rate. Route by geography (Adyen for EU, Stripe for US). Route by cost (lower interchange for certain gateways). Route by success rate (gateway with better auth rate for specific card types). Fallback routing—primary gateway fails, retry with secondary. Routing rules configurable (A/B test gateways, gradual migration).
        </p>
        <p>
          Credential storage for gateway API access. API keys (publishable, secret) stored in secrets manager (AWS Secrets Manager, HashiCorp Vault). Rotate keys periodically (quarterly). Webhook secrets for signature verification. Key rotation requires zero-downtime—support multiple keys during transition. Audit key access (who accessed, when).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-processing/webhook-handling.svg"
          alt="Webhook Handling"
          caption="Figure 3: Webhook Handling — Signature verification, idempotency, and async processing"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Webhook Processing</h3>
        <p>
          Webhook endpoint receives async payment events. Gateway sends events: payment.succeeded, payment.failed, refund.completed, dispute.opened. Endpoint verifies webhook signature (HMAC with webhook secret). Rejects unsigned or invalid signatures. Parses event type, extracts payment ID, updates local payment state. Returns 200 OK quickly (&lt;3 seconds)—process asynchronously (queue event, acknowledge).
        </p>
        <p>
          Idempotency for webhooks prevents duplicate processing. Gateway may send same webhook multiple times (retry on timeout, manual resend). Store processed webhook IDs with TTL (7-30 days). Check ID before processing—skip if already processed. Webhook ordering not guaranteed—payment.succeeded may arrive before payment.authorized. Handle out-of-order events (process based on event timestamp, not arrival order).
        </p>
        <p>
          Webhook monitoring detects delivery issues. Track webhook latency (gateway send time to endpoint receive time). Alert on latency spikes (gateway issues, endpoint slow). Track webhook failure rate (non-200 responses). Alert on failure rate increase (endpoint bug, gateway issue). Dead letter queue for failed webhooks—manual review and replay.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Payment processing design involves trade-offs between conversion optimization, fraud prevention, compliance requirements, and operational complexity. Understanding these trade-offs enables informed decisions aligned with business goals and risk tolerance.
        </p>

        <h3>Authorization Timing: Immediate vs. Delayed</h3>
        <p>
          Immediate authorization on checkout. Pros: Confirms payment capability, reduces order cancellations, customer sees charge immediately. Cons: Authorization expires if not captured quickly (7-30 days), may impact customer&apos;s available credit, capture must happen before expiry. Best for: Digital goods (immediate fulfillment), in-stock items (quick shipment), services (immediate access).
        </p>
        <p>
          Delayed authorization on shipment. Pros: Authorization fresh at capture (no expiry risk), charge only for shipped items (no partial captures), better cash flow (authorize when ready to fulfill). Cons: Risk of payment failure after order confirmed (customer expects immediate confirmation), customer may not see charge until shipment (confusion). Best for: Physical goods with fulfillment delay, backorders, pre-orders, custom-made items.
        </p>
        <p>
          Hybrid approach: authorize on checkout for in-stock, authorize on shipment for backorders. Pros: Balances risk with customer experience. Cons: Implementation complexity (split orders, multiple authorizations), customer sees multiple charges (confusion). Best for: Retailers with mixed inventory (in-stock + backorder items), marketplaces (seller fulfills independently).
        </p>

        <h3>Capture Strategy: Full vs. Partial</h3>
        <p>
          Full capture only—capture entire authorized amount. Pros: Simpler implementation, no partial capture fees, customer sees single charge. Cons: Must authorize exact amount (can&apos;t add tips, adjustments), over-authorization looks suspicious (higher interchange), unused authorization expires (customer&apos;s credit tied up). Best for: Fixed-amount transactions (retail, subscriptions), no tip scenarios.
        </p>
        <p>
          Partial capture supported—capture less than authorized. Pros: Flexibility for adjustments (tips, shipping changes, damages), over-authorization ensures funds available, release unused amount promptly. Cons: Partial capture fees (some gateways charge), customer may see multiple charges (auth + capture), complexity in tracking. Best for: Restaurants (tips), hotels (incidentals), rentals (damages), variable shipping costs.
        </p>

        <h3>Gateway Strategy: Single vs. Multi-Gateway</h3>
        <p>
          Single gateway simplicity. Pros: Easier integration, single dashboard, consolidated reporting, single contract. Cons: Single point of failure (gateway outage stops sales), no rate optimization, geographic limitations (some gateways weak in certain regions). Best for: Startups, low volume (&lt;$1M/year), single geography.
        </p>
        <p>
          Multi-gateway redundancy. Pros: Failover (gateway A down, route to B), rate optimization (route by cost), geographic optimization (local acquiring), negotiation leverage (can switch). Cons: Integration complexity (multiple adapters), split reporting (consolidate manually), multiple contracts, higher minimum volumes. Best for: High volume (&gt;$10M/year), international, mission-critical (can&apos;t tolerate downtime).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-processing/gateway-comparison.svg"
          alt="Gateway Comparison"
          caption="Figure 4: Gateway Comparison — Features, pricing, and geographic coverage"
          width={1000}
          height={450}
        />

        <h3>3DS Enforcement: Strict vs. Flexible</h3>
        <p>
          Strict 3DS for all transactions. Pros: Maximum fraud protection, SCA compliance (no fines), liability shift (issuer liable for fraud). Cons: Higher friction (abandonment increases 10-20%), false declines (legitimate customers fail 3DS), customer annoyance. Best for: High-risk categories (electronics, luxury goods), regulatory requirement (SCA in EU), history of fraud.
        </p>
        <p>
          Flexible 3DS (risk-based). Pros: Lower friction (exempt low-risk transactions), better conversion, customer-friendly. Cons: More fraud (some slip through), potential SCA non-compliance (fines), liability on merchant (if no 3DS). Best for: Low-risk categories, trusted customers (repeat buyers, saved cards), subscription/recurring (same amount).
        </p>
        <p>
          Hybrid: 3DS for high-risk, exempt low-risk. Pros: Balances fraud protection with conversion. Cons: Requires fraud scoring (complexity), may misclassify (false positives/negatives). Best for: Most merchants—use gateway&apos;s risk engine (Stripe Radar, Adyen RevenueProtect) to decide dynamically.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Never touch raw card data:</strong> Use hosted fields (Stripe Elements, Braintree Hosted Fields) or payment SDKs. Tokenize in browser, send token to backend. PCI scope reduced to SAQ A (simplest). Never log card data, never store card data (even encrypted).
          </li>
          <li>
            <strong>Implement idempotency everywhere:</strong> Idempotency keys for all payment operations (authorize, capture, refund). Store key with operation result. Duplicate request returns cached result. Critical for retry logic—network timeout doesn&apos;t mean failure.
          </li>
          <li>
            <strong>Handle webhooks asynchronously:</strong> Verify signature, acknowledge quickly (200 OK &lt;3 seconds), queue for processing. Idempotency for duplicate webhooks. Handle out-of-order events (process by timestamp, not arrival). Monitor webhook delivery (latency, failure rate).
          </li>
          <li>
            <strong>Implement smart retry logic:</strong> Retry soft declines (insufficient_funds) with exponential backoff. Don&apos;t retry hard declines (invalid_card, fraud)—require customer action. Schedule retries optimally (payday for insufficient funds). Limit retries (max 3-5) to prevent harassment.
          </li>
          <li>
            <strong>Support multiple payment methods:</strong> Cards (credit, debit), digital wallets (Apple Pay, Google Pay), bank transfer (ACH, SEPA), buy-now-pay-later (Affirm, Klarna). Payment method preference varies by region (iDEAL in Netherlands, Alipay in China). More methods = higher conversion.
          </li>
          <li>
            <strong>Monitor authorization rates:</strong> Track auth rate by gateway, card type, geography, amount. Alert on rate drops (gateway issue, fraud attack). A/B test gateways for best rate. Optimize routing (send to gateway with best rate for specific card).
          </li>
          <li>
            <strong>Implement proper error handling:</strong> Map decline codes to user-friendly messages. Preserve entered data on failure (don&apos;t clear form). Offer alternative payment methods. Clear retry guidance ("Try again in 5 minutes" vs. "Use different card").
          </li>
          <li>
            <strong>Use account updater services:</strong> Visa VAU, Mastercard ABU, Amex SafeKey automatically update expired/reissued cards. Reduces involuntary churn for subscriptions. Enrollment automatic, opt-out available. Integration via gateway (batch submit, receive updated tokens).
          </li>
          <li>
            <strong>Implement fraud scoring:</strong> Use gateway&apos;s fraud tools (Stripe Radar, Adyen RevenueProtect, Braintree Kount). Score based on device, location, velocity, amount. Block high-risk, challenge medium-risk, approve low-risk. Tune thresholds based on false positive/negative rates.
          </li>
          <li>
            <strong>Plan for gateway failover:</strong> Multi-gateway setup with automatic failover. Health check gateways (latency, error rate). Route away from unhealthy gateway. Test failover regularly (chaos engineering). Document manual failover procedure.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Storing card data:</strong> Even encrypted, increases PCI scope dramatically. Solution: Use tokenization, never store raw card data. Gateway vaults store cards securely (PCI DSS Level 1).
          </li>
          <li>
            <strong>No idempotency:</strong> Network retries create duplicate charges. Solution: Idempotency keys for all operations, store with result, return cached result on duplicate.
          </li>
          <li>
            <strong>Ignoring webhooks:</strong> Relying only on synchronous responses misses async events (disputes, refunds). Solution: Implement webhook handlers for all event types, verify signatures, process idempotently.
          </li>
          <li>
            <strong>Blind retry on failure:</strong> Retrying hard declines wastes time, angers customers. Solution: Classify declines (soft vs. hard), retry only soft, require customer action for hard.
          </li>
          <li>
            <strong>No 3DS support:</strong> SCA fines in EU, liability for fraud. Solution: Implement 3DS 2.0, use frictionless flow where possible, exempt low-risk transactions.
          </li>
          <li>
            <strong>Capturing before shipping:</strong> Card network violation (must ship within 7 days of capture). Solution: Capture on shipment, not on order. Authorize on order, capture on ship.
          </li>
          <li>
            <strong>Not voiding uncaptured auths:</strong> Customer&apos;s credit tied up, may cause decline on retry. Solution: Void uncaptured authorizations promptly (when order cancelled, item out of stock).
          </li>
          <li>
            <strong>Ignoring account updater:</strong> Subscriptions churn on card expiry. Solution: Enroll in VAU/ABU, automatically update tokens on card reissue.
          </li>
          <li>
            <strong>No monitoring:</strong> Auth rate drops, gateway issues undetected. Solution: Monitor auth rate, latency, decline codes. Alert on anomalies. Dashboard for real-time visibility.
          </li>
          <li>
            <strong>Single gateway dependency:</strong> Gateway outage stops all sales. Solution: Multi-gateway setup with automatic failover. Test failover regularly.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Stripe Payment Processing</h3>
        <p>
          Stripe uses Payment Intents API for unified payment flow. Payment Intent created with amount, currency, payment method. Handles 3DS automatically (frictionless when possible). Webhooks for async events (payment_intent.succeeded, payment_intent.payment_failed). Smart retries for failed payments (exponential backoff, optimal timing). Account updater for subscription retention.
        </p>

        <h3 className="mt-6">Amazon Pay</h3>
        <p>
          Amazon Pay leverages existing Amazon customer data (shipping address, payment methods). One-click checkout for Amazon customers. Authorization on order, capture on shipment. A-to-Z guarantee protects customers (Amazon handles disputes). Recurring payments for subscriptions. Cross-border (Amazon customers in one country, merchant in another).
        </p>

        <h3 className="mt-6">PayPal Checkout</h3>
        <p>
          PayPal offers multiple flows: redirect (customer to PayPal), in-context (modal overlay), Braintree SDK (native). PayPal balance, bank account, or card funding. Buyer protection (disputes handled by PayPal). Seller protection (eligible transactions protected from chargebacks). Recurring billing for subscriptions. Pay Later options (Pay in 4, Pay Monthly).
        </p>

        <h3 className="mt-6">Adyen Unified Commerce</h3>
          <p>
          Adyen provides single platform for online, mobile, in-store. Token works across channels (online purchase, in-store return). Local acquiring in 50+ countries (better rates, higher auth). Risk management (RevenueProtect) with machine learning. Data-driven optimization (auth rate by BIN, issuer, geography). Unified reporting across channels.
        </p>

        <h3 className="mt-6">Square Omnichannel</h3>
        <p>
          Square integrates online (Square Online) with in-person (Square Terminal, Register). Single dashboard for all sales. Card on file for repeat customers (tokenized, PCI-compliant). Tips handled post-transaction (restaurants, services). Instant deposit (funds in minutes, not days). Inventory sync across channels (online sale reduces in-store stock).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle payment idempotency?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Client generates unique idempotency key (UUID) per payment operation. Key sent in Idempotency-Key header. Backend stores key with payment ID and result. Duplicate request with same key returns cached result (not new charge). Key expires after TTL (24 hours). Storage: Redis with TTL, or database with cleanup job. Critical for retry logic—network timeout doesn&apos;t mean payment failed, check idempotency before retrying.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle 3D Secure authentication?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Gateway returns 3DS required response with redirect URL or client secret. Customer redirected to bank authentication (or in-app modal). Bank verifies customer (password, SMS, biometric). Bank redirects back to merchant callback URL with authentication result (Y/N). Gateway confirms 3DS result, proceeds with authorization. Handle abandonment (customer closes browser during 3DS)—mark payment as pending_3ds, send email reminder. Retry 3DS failures (timeout, bank unavailable) with exponential backoff.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle payment webhook failures?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Webhook endpoint acknowledges quickly (200 OK &lt;3 seconds), queues for async processing. Idempotency prevents duplicate processing (store webhook IDs). Failed processing (bug, downstream service down) retries with exponential backoff (1 min, 10 min, 1 hour). Dead letter queue for permanently failed webhooks—manual review and replay. Monitoring alerts on webhook failure rate increase. Gateway retries failed webhooks (exponential backoff, max 3-5 attempts).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize payment authorization rates?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Multi-gateway routing (send to gateway with best rate for specific card type, geography). Account updater services (reduce expired card declines). Smart retries (retry soft declines with optimal timing). Fraud scoring tuning (reduce false positives). 3DS optimization (frictionless flow, exempt low-risk). Card network optimization (Visa vs. Mastercard rates vary by issuer). Monitor auth rate by BIN, issuer, gateway—identify patterns, adjust routing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle partial refunds?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Validate refund amount ≤ captured amount (not authorized). Track total refunded (multiple partial refunds allowed until total = captured). Idempotency prevents double-refund (refund ID unique). Refund reason tracking (defective, wrong item, customer changed mind) for analytics. Refund to original payment method (required by card networks). Handle refund failures (card expired, account closed)—offer alternative (store credit, bank transfer).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle chargebacks?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Chargeback webhook received, mark order as disputed, freeze account (prevent further purchases). Gather evidence: delivery confirmation, customer communication, terms of service, prior purchases, IP address, device fingerprint. Submit evidence to gateway within deadline (7-30 days). Track chargeback reason (fraud, not received, defective)—address root cause. High chargeback rate (&gt;1%) risks termination—implement fraud prevention, improve product descriptions, enhance customer service.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/payments/payment-intents"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe — Payment Intents API Documentation
            </a>
          </li>
          <li>
            <a
              href="https://docs.adyen.com/online-payments"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Adyen — Online Payments Documentation
            </a>
          </li>
          <li>
            <a
              href="https://developer.paypal.com/docs/checkout/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PayPal — Checkout Integration Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.pcisecuritystandards.org/pci_security/complete-guide-to-pci-dss/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PCI Security Standards Council — PCI DSS Complete Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.emvco.com/emv-technologies/3-d-secure/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              EMVCo — 3D Secure Protocol Documentation
            </a>
          </li>
          <li>
            <a
              href="https://sandbox.braintreegateway.com/merchants/demo/html/accept_credit_cards.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Braintree — Accepting Credit Cards Guide
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
