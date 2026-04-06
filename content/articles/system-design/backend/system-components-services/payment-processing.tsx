"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-payment-processing",
  title: "Payment Processing",
  description:
    "Design reliable payment infrastructure: authorization, capture, settlement flow, idempotency guarantees, 3D Secure/SCA compliance, webhook reconciliation, multi-processor routing, fraud detection, and PCI DSS compliance.",
  category: "backend",
  subcategory: "system-components-services",
  slug: "payment-processing",
  wordCount: 5500,
  readingTime: 28,
  lastUpdated: "2026-04-06",
  tags: ["backend", "payments", "fintech", "pci-compliance", "idempotency", "fraud-detection"],
  relatedTopics: ["rate-limiting-service", "audit-logging-service", "authentication-service"],
};

export default function PaymentProcessingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          A <strong>payment processing service</strong> is the infrastructure that authorizes, captures, settles, and
          reconciles financial transactions between customers and merchants. It serves as the bridge between the
          merchant&apos;s checkout flow and the global banking network, navigating card networks (Visa, Mastercard,
          Amex), issuing banks, acquiring banks, and payment gateways to move money securely and reliably. Payment
          processing is the most reliability-critical component in any e-commerce or SaaS platform: failures directly
          impact revenue, and errors (double charges, lost payments) create legal liability and erode user trust.
        </p>
        <p>
          The payment processing flow follows a well-defined sequence: authorization (the issuing bank approves or
          declines the transaction and places a hold on the customer&apos;s funds), capture (the merchant claims the
          authorized funds, typically when the order ships), settlement (the banks exchange funds through the card
          network, typically in end-of-day batches), and payout (the acquirer deposits funds into the merchant&apos;s
          bank account, typically within one to seven business days). Each step in this flow has its own failure modes,
          timing characteristics, and reconciliation requirements.
        </p>
        <p>
          The fundamental architectural challenge in payment processing is ensuring exactly-once semantics in a
          distributed system where network failures, timeouts, and partial failures are inevitable. A payment request
          that times out may have succeeded at the processor level, and a retry may create a duplicate charge. A webhook
          event that is missed may leave a payment in a pending state indefinitely. A processor outage during peak
          traffic may cause widespread checkout failures. These challenges require a combination of idempotency
          guarantees, distributed locking, webhook reconciliation, circuit breaker patterns, and daily automated
          reconciliation to ensure that every payment is correctly recorded, every charge is accounted for, and every
          discrepancy is detected and resolved.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/payment-architecture.svg"
          alt="Payment processing architecture showing checkout request, payment gateway, payment processor, bank/issuer, payment state machine, security/compliance layer, webhook processing, and key metrics"
          caption="Payment processing architecture &#8212; checkout flows through gateway validation, processor authorization, bank decision, with webhook event processing and compliance controls."
          width={900}
          height={550}
        />
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          <strong>Authorization</strong> is the first step in payment processing, where the issuing bank verifies that
          the customer has sufficient funds or credit and places a hold on the authorized amount. The authorization
          request includes the payment amount, currency, card details (or token), merchant identifier, and transaction
          metadata. The issuing bank responds with an approval or decline code, an authorization reference, and the
          available balance. Authorization typically completes within two to five seconds and does not transfer funds;
          it merely reserves them. Authorizations expire after a configurable period (typically seven days for card
          networks), after which the hold is released and the funds become available to the customer again.
        </p>
        <p>
          <strong>Capture</strong> is the merchant&apos;s action of claiming the authorized funds. Capture can be full
          (the entire authorized amount) or partial (a subset of the authorized amount, useful for partial shipments or
          tip adjustments). Multiple partial captures are allowed by most processors, enabling merchants to capture
          funds as items ship. Capture must occur before the authorization expires, or the authorization becomes invalid
          and the merchant must re-authorize the payment. The capture request includes the authorization reference and
          the capture amount, and the processor responds with a capture confirmation that initiates the settlement
          process.
        </p>
        <p>
          <strong>Settlement</strong> is the batch process where the processor sends all captured transactions to the
          card networks for clearing, and the card networks facilitate the transfer of funds from the issuing banks to
          the acquiring bank. Settlement typically occurs once per day (end-of-day batch) and involves interchange fees
          (paid to the issuing bank), assessment fees (paid to the card network), and processor fees (paid to the
          payment processor). The net amount after fees is deposited into the merchant&apos;s bank account during the
          payout phase, which occurs one to seven business days after settlement depending on the processor and
          merchant&apos;s risk profile.
        </p>
        <p>
          <strong>Idempotency</strong> is the most critical property of a payment processing system. An idempotent
          payment API ensures that the same payment request, identified by a unique idempotency key, produces the same
          result regardless of how many times it is submitted. This prevents double charges when a client retries a
          request that timed out, or when a webhook event is delivered multiple times. The idempotency key is generated
          by the client (typically a UUID) and included in the payment request header. The server checks whether a
          payment with this key has already been processed: if so, it returns the cached response without re-processing;
          if not, it processes the payment, stores the response keyed by the idempotency key, and returns the result.
          The idempotency key is stored with a database-level unique constraint, ensuring that even if the application
          layer fails, the database prevents duplicate charges.
        </p>
        <p>
          <strong>Tokenization</strong> replaces sensitive card data with a non-sensitive token that can be stored and
          used for future transactions without exposing the actual card number. When a customer enters their card
          details, the information is sent directly to the payment processor (via Elements.js or a hosted payment page),
          which returns a token that represents the card. The merchant stores only the token, not the card number,
          reducing PCI DSS compliance scope. Tokens can be used for recurring payments (subscriptions), one-click
          checkout (returning customers), and cross-device payments (card saved on mobile, used on desktop). Tokens are
          scoped to the processor and cannot be used with a different processor without re-collecting the card details.
        </p>
        <p>
          <strong>3D Secure and Strong Customer Authentication (SCA)</strong> are regulatory requirements in the
          European Economic Area (under PSD2) that require additional authentication for card-not-present transactions.
          3D Secure adds an authentication step where the customer verifies their identity through their issuing bank
          (via a one-time password, biometric verification, or push notification to the bank&apos;s app). 3D Secure
          version two (3DS2) provides a frictionless flow for low-risk transactions (where the bank can authenticate the
          customer in the background using device fingerprinting and transaction risk analysis) and a challenge flow for
          higher-risk transactions. The payment service must integrate with 3DS2 to support SCA-compliant transactions
          in the EEA, and should support 3DS2 globally because it shifts liability for fraudulent transactions from the
          merchant to the issuing bank.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/payment-flow.svg"
          alt="Payment processing flow showing checkout initiation, card tokenization, authorization with issuing bank, 3D Secure challenge, authorization response, post-authorization capture and settlement flow, idempotency details, and webhook event flow"
          caption="Payment flow &#8212; from checkout through tokenization, authorization, 3D Secure if required, with post-authorization capture, settlement, and payout timeline."
          width={900}
          height={550}
        />
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The payment processing architecture consists of a checkout API that receives payment requests, a payment
          gateway that validates requests and performs fraud checks, a payment processor integration layer that
          communicates with external processors (Stripe, Adyen, Braintree), a payment state machine that tracks each
          payment through its lifecycle, a webhook processor that handles asynchronous events from the processor, and a
          reconciliation system that compares internal records with processor settlement reports.
        </p>
        <p>
          The checkout API receives payment requests with the amount, currency, payment method (token or card details),
          customer identifier, order identifier, and an idempotency key. The API validates the request (amount is
          positive, currency is supported, payment method is valid), checks the idempotency key for a cached response,
          and forwards the request to the payment gateway. The payment gateway performs additional validation: it checks
          the customer&apos;s fraud score (based on device fingerprint, IP reputation, purchase history, and velocity
          checks), verifies that the customer has not exceeded their spending limit, and applies any business rules
          (e.g., blocking transactions from sanctioned countries).
        </p>
        <p>
          The processor integration layer translates the internal payment request into the processor&apos;s API format
          and sends the authorization request. For 3DS2-compliant regions, the processor returns a 3DS2 authentication
          challenge that the client must complete before the authorization can proceed. The processor integration layer
          handles the 3DS2 flow: it receives the authentication result from the client, forwards it to the processor,
          and receives the final authorization decision. The authorization response (approved or declined) is recorded
          in the payment state machine with the authorization reference, amount, currency, and timestamp.
        </p>
        <p>
          The webhook processor handles asynchronous events from the payment processor: payment succeeded, payment
          failed, charge refunded, chargeback received, and dispute updated. Each webhook event is verified using the
          processor&apos;s signature (HMAC validation) to ensure authenticity, then processed to update the payment
          state in the database. The webhook processor implements deduplication: if the same event is received multiple
          times (which is common with webhook delivery), it is processed only once based on the event ID. The webhook
          processor also triggers downstream actions: sending order confirmation emails, updating inventory, notifying
          the customer of payment status, and escalating chargebacks to the support team.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/system-components-services/payment-scaling.svg"
          alt="Payment processing scaling strategies showing API gateway horizontal scaling, multi-processor routing by region, database scaling with read replicas, concurrency control for preventing double charges, regional deployment, and scaling targets"
          caption="Scaling strategies &#8212; stateless API tier scales horizontally, multi-processor routing for resilience, strong consistency database with read replicas for queries."
          width={900}
          height={550}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparisons</h2>
        <p>
          The primary trade-off in payment processing architecture is between using a single payment processor versus
          multiple processors. A single processor (e.g., Stripe only) simplifies integration, reduces operational
          complexity, and provides a unified reporting dashboard. However, it creates a single point of failure: if the
          processor experiences an outage, all checkout flows are blocked. Multiple processors (e.g., Stripe for US,
          Adyen for EU, with cross-failover) provide resilience and enable routing optimization (choosing the processor
          with the best authorization rate for a given card type and region), but they increase integration complexity,
          require separate reconciliation for each processor, and complicate reporting. Most production systems start
          with a single processor and add a second processor when the business scale justifies the additional
          complexity.
        </p>
        <p>
          The choice between direct processor integration and using a payment orchestration layer (Primer, Gr4vy,
          Spreedly) involves a trade-off between control and convenience. Direct integration gives full control over the
          payment flow, error handling, and retry logic, but requires building and maintaining integrations with each
          processor. A payment orchestration layer provides a unified API that abstracts over multiple processors,
          enables intelligent routing, and handles failover automatically, but it adds a dependency on the orchestration
          provider and may limit access to processor-specific features. Organizations with a single processor typically
          integrate directly, while organizations with multiple processors benefit from the abstraction provided by an
          orchestration layer.
        </p>
        <p>
          Immediate capture (authorize and capture in a single API call) versus delayed capture (authorize first,
          capture later) involves a trade-off between cash flow speed and operational flexibility. Immediate capture
          transfers funds immediately, improving cash flow, but it does not allow for partial captures (e.g., partial
          shipments) or cancellation after authorization. Delayed capture provides the flexibility to capture only when
          the order ships (reducing the need for refunds on cancelled orders) and to perform partial captures, but it
          delays fund transfer and requires managing authorization expiration. Most e-commerce platforms use delayed
          capture to align payment collection with order fulfillment, while digital goods platforms (where fulfillment
          is immediate) use immediate capture.
        </p>
        <p>
          Building a payment processing service in-house versus using a managed checkout solution (Stripe Checkout,
          Adyen Checkout) involves a build-versus-buy decision. Managed checkout provides a pre-built, PCI-compliant
          checkout experience with support for multiple payment methods, 3DS2, and fraud detection, reducing the
          integration effort to a few API calls. The trade-off is limited customization of the checkout flow, dependency
          on the provider&apos;s hosted pages, and potentially higher fees. Building a custom checkout provides full
          control over the user experience, the ability to integrate with the merchant&apos;s design system, and the
          flexibility to support custom payment flows, but it requires PCI DSS compliance effort and ongoing
          maintenance of the checkout infrastructure. Organizations with standard checkout needs typically use managed
          checkout, while organizations with complex checkout flows (multi-step, custom payment methods, embedded
          financing) build custom checkout.
        </p>
        <p>
          The reconciliation approach (automated daily reconciliation versus manual investigation) involves a trade-off
          between operational cost and accuracy. Automated reconciliation compares internal payment records with
          processor settlement reports daily, flags discrepancies, and auto-corrects simple mismatches (e.g., timing
          differences where a capture occurred after the settlement report was generated). Complex mismatches (e.g., a
          chargeback that does not match any internal record) are escalated for manual investigation. Automated
          reconciliation catches the majority of discrepancies quickly, reducing the time to detect and resolve payment
          errors, but it requires significant engineering investment to build and maintain the reconciliation pipeline.
          Manual reconciliation is simpler to implement but is slower, more error-prone, and does not scale with
          transaction volume.
        </p>
        <p>
          Fraud detection strategy (rule-based versus machine learning-based) involves a trade-off between
          interpretability and accuracy. Rule-based fraud detection uses configurable rules (block transactions above a
          certain amount from new accounts, flag transactions from high-risk countries, limit the number of transactions
          per card per hour) that are transparent and easy to audit. Machine learning-based fraud detection uses models
          trained on historical transaction data to predict the probability of fraud, providing higher accuracy and
          adaptability to new fraud patterns, but with less interpretability (it is harder to explain why a transaction
          was blocked). Most production systems use a hybrid approach: rule-based detection for clear-cut cases
          (sanctioned countries, blacklisted cards) and ML-based scoring for borderline cases where the decision is
          less certain.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Implement idempotency at every layer of the payment processing pipeline. The idempotency key should be
          generated by the client and passed through every layer (API gateway, payment gateway, processor integration,
          database) to ensure that duplicate requests are detected and handled consistently. The database should enforce
          idempotency with a unique constraint on the idempotency key column, ensuring that even if the application
          layer fails to detect a duplicate, the database prevents it. The cached response for an idempotent request
          should include the full payment response (status, amount, currency, processor reference) so that the client
          receives exactly the same response on retry.
        </p>
        <p>
          Implement daily automated reconciliation between internal payment records and processor settlement reports.
          The reconciliation process should fetch the settlement report from the processor (via API or CSV download),
          compare each transaction against internal records, flag discrepancies, and auto-correct simple mismatches.
          Discrepancies that cannot be auto-corrected (e.g., chargebacks without matching internal records) should be
          escalated to the finance team for manual investigation. The reconciliation process should run automatically
          every day and produce a report that is reviewed by the finance team. Any unreconciled amount above a threshold
          should trigger an immediate alert.
        </p>
        <p>
          Use webhooks as the primary mechanism for payment state updates, with API polling as a fallback. Webhooks
          provide real-time notification of payment state changes (authorization, capture, refund, chargeback), but
          they are not guaranteed to be delivered (the webhook endpoint may be down, the network may fail). The webhook
          processor should verify webhook signatures to prevent spoofed events, implement deduplication based on event
          ID, and handle out-of-order events (a capture event may arrive before the authorization event if the webhook
          delivery is delayed). As a fallback, the payment service should periodically poll the processor&apos;s API to
          check the status of payments that are still in a pending state, ensuring that missed webhooks are eventually
          reconciled.
        </p>
        <p>
          Implement circuit breaker protection for processor integrations. If the processor&apos;s API error rate
          exceeds a threshold (e.g., ten percent for two minutes), the circuit breaker should open and the payment
          service should fail fast with a friendly error message to the user, rather than continuing to send requests
          to a failing processor. The circuit breaker should transition to a half-open state after a configurable
          cooldown period, sending a probe request to check if the processor has recovered. If the probe succeeds, the
          circuit breaker closes and normal processing resumes. If the probe fails, the circuit breaker remains open
          and the cooldown period is extended.
        </p>
        <p>
          Never store raw card numbers or CVV codes in your database. Use the processor&apos;s tokenization API to
          convert card details into tokens, and store only the tokens. This reduces PCI DSS compliance scope from the
          highest level (SAQ D) to a lower level (SAQ A) because the merchant&apos;s systems never handle raw card
          data. The tokenization should happen client-side (using Elements.js or a hosted payment page) so that card
          data never touches the merchant&apos;s servers. If you need to support card updates (e.g., when a card
          expires), use the processor&apos;s account updater service that automatically updates expired card tokens.
        </p>
        <p>
          Monitor payment processing metrics continuously: authorization rate (percentage of authorization requests
          that are approved), decline rate (percentage of requests that are declined by the issuing bank), fraud rate
          (percentage of transactions that are fraudulent), chargeback rate (percentage of transactions that result in
          a chargeback), and processing latency (time from authorization request to response). Set up alerts for
          anomalous patterns: a sudden drop in authorization rate may indicate a processor issue, a spike in decline
          rate may indicate a fraud attack, and a rising chargeback rate may indicate product quality issues or
          fraudulent activity. These metrics are leading indicators of payment health that, if unaddressed, directly
          impact revenue and compliance.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Not implementing idempotency at the database level leads to double charges when the application layer fails
          to detect a duplicate request. Even if the application layer checks for duplicate idempotency keys, a race
          condition between the check and the insert can allow two concurrent requests with the same key to both
          proceed to the processor, creating duplicate charges. The fix is to add a unique constraint on the
          idempotency key column in the database, ensuring that the second insert fails at the database level even if
          the application layer check was bypassed by a race condition.
        </p>
        <p>
          Relying solely on webhooks for payment state updates leads to stale payment states when webhook events are
          missed. Webhook delivery is not guaranteed: the webhook endpoint may be down during a deployment, the network
          may drop the request, or the processor may fail to send the webhook. The fix is to implement a polling
          fallback that periodically checks the status of pending payments with the processor&apos;s API, ensuring that
          missed webhooks are eventually reconciled. Additionally, the webhook processor should implement retry logic
          for failed webhook deliveries (the processor typically retries failed webhooks with exponential backoff), and
          the payment service should reconcile its state with the processor&apos;s state at least once per day through
          the automated reconciliation process.
        </p>
        <p>
          Not handling authorization expiration leads to lost revenue when customers complete checkout but the
          authorization expires before capture. Authorizations typically expire after seven days, and if the merchant
          does not capture the funds within this window, the authorization becomes invalid and the customer is not
          charged. The fix is to monitor authorization expiration dates and capture authorized payments before they
          expire. For orders that take longer than the authorization window to fulfill (e.g., pre-orders, back-ordered
          items), the merchant should re-authorize the payment before capture, or use a processor that supports longer
          authorization periods (some processors support up to thirty days for specific industries like travel).
        </p>
        <p>
          Not implementing proper fraud detection leads to high chargeback rates and potential termination by the
          payment processor. Payment processors monitor merchants&apos; chargeback rates, and if the rate exceeds a
          threshold (typically one percent for Visa and Mastercard), the processor may impose fines, increase processing
          fees, or terminate the merchant account. The fix is to implement fraud detection at the payment gateway level,
          using a combination of rule-based checks (velocity limits, geographic restrictions, amount thresholds) and
          machine learning-based scoring (analyzing transaction patterns to identify suspicious activity). Additionally,
          the payment service should monitor chargeback rates and alert when the rate approaches the processor&apos;s
          threshold.
        </p>
        <p>
          Storing raw card data in the application database creates massive PCI DSS compliance burden and security
          risk. Even if the data is encrypted, storing card numbers and CVV codes requires the highest level of PCI DSS
          compliance (SAQ D), which involves extensive security audits, network segmentation, and access controls. The
          fix is to use the processor&apos;s tokenization API, where card data is sent directly from the client to the
          processor (never touching the merchant&apos;s servers), and the processor returns a token that the merchant
          stores. This reduces PCI DSS scope to SAQ A, which is significantly simpler and cheaper to maintain.
        </p>
        <p>
          Not reconciling payments daily leads to undetected discrepancies that accumulate over time. Without daily
          reconciliation, a chargeback that is not matched to an internal payment record, a settlement amount that does
          not match the sum of captured transactions, or a processor fee that is higher than expected may go unnoticed
          for weeks or months, resulting in financial loss that is difficult to trace and recover. The fix is to
          implement automated daily reconciliation that compares internal records with processor settlement reports,
          flags discrepancies, and alerts the finance team for investigation. The reconciliation process should be
          automated, run every day, and produce a report that is reviewed by the finance team.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>
          Stripe powers payments for millions of businesses worldwide, from startups to Fortune 500 companies.
          Stripe&apos;s architecture demonstrates the idempotency pattern at scale: every API request accepts an
          idempotency key that ensures duplicate requests produce the same result, and Stripe&apos;s webhook system
          delivers payment events with at-least-once semantics, requiring consumers to implement deduplication.
          Stripe&apos;s reconciliation API provides settlement reports that merchants can use to reconcile their
          internal records with processed transactions, and Stripe&apos;s Radar product provides machine learning-based
          fraud detection that analyzes transaction patterns to identify suspicious activity.
        </p>
        <p>
          Adyen provides a unified commerce platform that handles online, in-store, and in-app payments for global
          merchants like Uber, Spotify, and McDonald&apos;s. Adyen&apos;s architecture demonstrates multi-processor
          routing at scale: Adyen connects directly to card networks and acquiring banks worldwide, enabling optimal
          routing based on card type, region, and transaction amount to maximize authorization rates and minimize
          processing costs. Adyen&apos;s platform also supports local payment methods (iDEAL in the Netherlands,
          Bancontact in Belgium, SEPA Direct Debit across Europe) that are essential for merchant expansion in specific
          markets.
        </p>
        <p>
          Shopify handles payments for millions of online stores through Shopify Payments (powered by Stripe) and
          integrations with over one hundred payment gateways. Shopify&apos;s payment architecture demonstrates the
          challenge of supporting multiple payment gateways across diverse merchant needs: each gateway has its own API,
          error codes, webhook format, and settlement process. Shopify abstracts these differences through a unified
          payment interface that merchants interact with, while the backend routes transactions to the appropriate
          gateway based on the merchant&apos;s configuration and the customer&apos;s payment method.
        </p>
        <p>
          PayPal provides a payment processing platform that combines a digital wallet (customers store their payment
          methods with PayPal) with direct payment processing (merchants can accept PayPal as a payment method without
          requiring customers to have a PayPal account). PayPal&apos;s architecture demonstrates the complexity of
          supporting multiple payment methods (PayPal balance, linked bank accounts, credit cards, buy-now-pay-later
          through Pay in 4) and the challenge of providing a seamless checkout experience that works across desktop,
          mobile web, and mobile apps. PayPal&apos;s buyer and seller protection programs also demonstrate the
          importance of dispute resolution and chargeback management in payment processing.
        </p>
        <p>
          Square provides payment processing for small businesses, combining point-of-sale hardware (card readers,
          terminals) with software for inventory management, employee management, and analytics. Square&apos;s
          architecture demonstrates the challenge of processing payments in offline environments (where the internet
          connection may be unreliable) through offline payment storage and later synchronization when connectivity is
          restored. Square also handles the complexity of same-day settlement for small businesses that need access to
          their funds quickly, versus the standard one-to-three-day settlement cycle used by most processors.
        </p>
      </section>

      <section>
        <h2>Interview Questions &amp; Answers</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: How do you prevent double charges when a payment request times out and the client retries?
          </h3>
          <p>
            Double charges are prevented through idempotency at every layer of the payment pipeline. The client
            generates a unique idempotency key (UUID v4) for each payment attempt and includes it in the request
            header. The server checks this key against a deduplication store (a database table with a unique constraint
            on the idempotency key column). If the key exists, the server returns the cached response without
            re-processing the payment. If the key does not exist, the server processes the payment, stores the response
            keyed by the idempotency key, and returns the result. The database-level unique constraint ensures that even
            if two concurrent requests with the same key bypass the application-layer check due to a race condition, the
            second insert fails at the database level, preventing the duplicate charge. Additionally, the payment
            processor (Stripe, Adyen) also supports idempotency keys, providing a second layer of protection at the
            processor level. This multi-layer idempotency approach ensures that double charges are prevented even in
            the face of network failures, application crashes, and concurrent retries.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: How would you design the reconciliation process to detect and resolve payment discrepancies?
          </h3>
          <p>
            The reconciliation process runs daily and compares internal payment records with the processor&apos;s
            settlement report. The process begins by fetching the settlement report from the processor&apos;s API (or
            downloading the CSV file) for the previous business day. The report contains all settled transactions with
            their amounts, fees, and net settlement amount. The reconciliation system then compares each transaction in
            the settlement report against internal payment records, matching on the processor&apos;s transaction
            reference. For each match, it verifies that the amounts agree (captured amount equals settled amount minus
            fees). For transactions in the settlement report that do not match any internal record, it creates an
            investigation ticket for the finance team. For internal records that do not match any transaction in the
            settlement report, it checks whether the transaction was captured after the settlement report cutoff time
            (and will appear in the next day&apos;s report) or whether there is a genuine discrepancy requiring
            investigation. The reconciliation process also verifies that the total settled amount matches the expected
            total (sum of captured amounts minus fees). Any discrepancy above a configurable threshold triggers an
            immediate alert. The reconciliation results are stored in a reconciliation report that is reviewed by the
            finance team daily, and unresolved discrepancies are escalated to senior management.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: How do you handle the scenario where the payment processor is experiencing an outage during peak traffic?
          </h3>
          <p>
            The payment service implements a circuit breaker pattern for processor integrations. When the processor&apos;s
            API error rate exceeds a threshold (e.g., ten percent for two minutes), the circuit breaker opens and the
            payment service stops sending requests to the processor. Instead, it returns a friendly error message to the
            user (&quot;Payment processing is temporarily unavailable, please try again in a few minutes&quot;) and
            queues the payment request for later processing. The circuit breaker transitions to a half-open state after
            a configurable cooldown period (e.g., five minutes), sending a probe request to check if the processor has
            recovered. If the probe succeeds, the circuit breaker closes and the queued payment requests are processed.
            If the probe fails, the circuit breaker remains open and the cooldown period is extended. For high-value
            merchants, the payment service can also failover to a backup processor (if configured), routing new
            transactions to the backup processor while the primary processor is down. The failover decision is based on
            the merchant&apos;s configuration and the backup processor&apos;s capability to handle the transaction
            (card type, currency, region). Additionally, the payment service monitors the processor&apos;s status page
            and API health, providing early warning of potential outages before they affect customers.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How do you design the payment state machine to handle all possible transitions?
          </h3>
          <p>
            The payment state machine defines the valid transitions between payment states: created (payment request
            received), processing (authorization request sent to processor), authorized (funds reserved), captured
            (funds claimed), settled (funds transferred through card network), refunded (funds returned to customer),
            failed (authorization declined or processing error), and chargebacked (customer disputed the charge). The
            state machine enforces valid transitions: a payment can only move from authorized to captured (not from
            created to captured), from captured to settled (not from authorized to settled), from settled to refunded
            (not from authorized to refunded). Each state transition is recorded with a timestamp, the actor (system or
            manual), and the reason. Invalid transitions are rejected with an error. The state machine also handles
            edge cases: a payment that is authorized but not captured within the authorization window transitions to
            expired (the authorization is released and the payment is voided). A payment that is captured but the
            settlement fails transitions to settlement_failed (the merchant must investigate with the processor). A
            payment that is chargebacked transitions from settled to chargebacked (the funds are reversed from the
            merchant&apos;s account). The state machine is implemented as a database table with a state column and a
            transitions table that records each state change, providing a complete audit trail of the payment&apos;s
            lifecycle.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: How do you handle 3D Secure authentication while maintaining a smooth checkout experience?
          </h3>
          <p>
            The 3D Secure flow is designed to minimize friction while maintaining compliance. When a payment request is
            submitted, the payment service sends an authorization request to the processor, which determines whether
            3DS2 authentication is required based on the transaction amount, the card-issuing region, and the
            merchant&apos;s risk profile. If 3DS2 is required, the processor returns an authentication challenge that
            the client must complete. The client displays the challenge (a one-time password entry, biometric
            verification, or push notification to the bank&apos;s app) to the user. For low-risk transactions, the
            3DS2 frictionless flow authenticates the user in the background using device fingerprinting and transaction
            risk analysis, with no user interaction required. The payment service handles the 3DS2 flow asynchronously:
            it sends the authorization request, receives the 3DS2 challenge, forwards it to the client, waits for the
            client to complete the challenge, and then sends the authentication result to the processor to complete the
            authorization. The entire flow is designed to complete within thirty seconds for the frictionless path and
            within sixty seconds for the challenge path. If the 3DS2 authentication fails (the user enters the wrong
            OTP or times out), the payment is declined with a clear error message to the user, and the user is given
            the option to try a different payment method. The payment service tracks 3DS2 authentication rates and
            friction rates to optimize the 3DS2 configuration and minimize unnecessary challenges.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ol className="space-y-2">
          <li>
            <strong>Stripe API Documentation</strong> &#8212; Comprehensive guide to payment processing,
            idempotency, webhooks, and reconciliation.
            <span className="block text-sm text-muted">stripe.com/docs/api</span>
          </li>
          <li>
            <strong>PCI DSS Requirements</strong> &#8212; Payment Card Industry Data Security Standard
            specifications for handling card data.
            <span className="block text-sm text-muted">pcisecuritystandards.org</span>
          </li>
          <li>
            <strong>EMV 3-D Secure Protocol</strong> &#8212; Technical specification for 3DS2 authentication
            and strong customer authentication.
            <span className="block text-sm text-muted">3dsecure.io</span>
          </li>
          <li>
            <strong>Adyen Payment Processing Guide</strong> &#8212; Multi-processor routing, authorization,
            capture, and settlement best practices.
            <span className="block text-sm text-muted">docs.adyen.com</span>
          </li>
          <li>
            <strong>PSD2 Strong Customer Authentication</strong> &#8212; European regulatory requirements for
            payment authentication under PSD2.
            <span className="block text-sm text-muted">eur-lex.europa.eu</span>
          </li>
        </ol>
      </section>
    </ArticleLayout>
  );
}