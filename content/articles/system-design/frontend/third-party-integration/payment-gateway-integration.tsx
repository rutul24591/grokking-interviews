"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-third-party-integration-payment-gateway-integration",
  title: "Payment Gateway Integration",
  description:
    "End-to-end payment gateway integration design: security boundaries, PCI scope reduction, 3DS/SCA flows, webhook reliability, idempotency, and operational readiness for high-scale frontends.",
  category: "frontend",
  subcategory: "third-party-integration",
  slug: "payment-gateway-integration",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: [
    "frontend",
    "payments",
    "security",
    "pci",
    "webhooks",
    "reliability",
    "fraud",
    "3ds",
  ],
  relatedTopics: [
    "oauth-integration",
    "widget-embedding",
    "script-loading-strategies",
    "security-authentication",
  ],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Payment gateway integration</strong> is the system design work
          required to accept online payments by connecting your application to a
          payment service provider (PSP) such as Stripe, PayPal, Adyen, or
          Braintree. From a frontend perspective, this includes collecting
          payment details safely, handling user challenges (3DS/SCA), and
          coordinating the user experience with the backend payment lifecycle.
        </p>
        <p>
          Payments are a third-party integration where the consequences of
          mistakes are unusually severe: compliance risk (PCI scope),
          fraud/chargebacks, user trust, and revenue loss. Unlike many widgets,
          payment flows are often business-critical, which means the integration
          must be secure, reliable, and operable under partial failures.
        </p>
        <p>
          For staff/principal engineers, payment integration requires balancing
          four competing concerns:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Security:</strong> Payment data must be protected. PCI DSS
            compliance is mandatory for handling card data.
          </li>
          <li>
            <strong>Compliance:</strong> Regulations like PSD2/SCA (Europe)
            require strong customer authentication. Non-compliance means
            transactions are declined.
          </li>
          <li>
            <strong>Conversion:</strong> Payment friction directly impacts
            revenue. Every extra field or step increases abandonment.
          </li>
          <li>
            <strong>Reliability:</strong> Payment failures mean lost revenue.
            You need fallback strategies and monitoring.
          </li>
        </ul>
        <p>
          The business impact of payment integration decisions is direct and
          measurable:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Revenue:</strong> Payment failures = lost sales. A 1%
            improvement in payment success rate can mean millions in revenue for
            large merchants.
          </li>
          <li>
            <strong>Compliance:</strong> PCI violations can result in fines up
            to $500,000 per incident. PSD2/SCA non-compliance means transactions
            are declined.
          </li>
          <li>
            <strong>Fraud:</strong> Poor fraud detection leads to chargebacks.
            High chargeback rates (&gt;1%) can result in termination by PSPs.
          </li>
          <li>
            <strong>Trust:</strong> Payment security incidents damage brand
            reputation. Users remember if their card was compromised.
          </li>
        </ul>
        <p>
          In system design interviews, payment gateway integration demonstrates
          understanding of security boundaries, compliance requirements,
          distributed system reliability, and the trade-offs between security
          and conversion. It shows you can design systems that handle sensitive
          data and financial transactions.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/payment-flow.svg"
          alt="Payment gateway integration flow showing customer, frontend, backend, payment gateway, and issuing bank with step-by-step payment process"
          caption="Payment flow — frontend collects payment details via Elements/iframe; backend creates payment intent; gateway handles 3DS; webhook confirms completion"
        />

        <h3>PCI DSS Compliance</h3>
        <p>
          PCI DSS (Payment Card Industry Data Security Standard) is a set of
          security standards for handling card data. Compliance level depends on
          how you handle card data:
        </p>

        <h4>SAQ-A (Lowest Scope — Recommended)</h4>
        <ul className="space-y-2">
          <li>
            <strong>Requirement:</strong> Card data entered directly into
            PSP-hosted fields (Elements, iframe). Your server never touches card
            data.
          </li>
          <li>
            <strong>Frontend:</strong> Use Stripe Elements, Braintree Hosted
            Fields, or similar.
          </li>
          <li>
            <strong>Compliance:</strong> Annual self-assessment questionnaire.
            Minimal burden.
          </li>
          <li>
            <strong>Recommendation:</strong> Always aim for SAQ-A. It's the
            easiest path to compliance.
          </li>
        </ul>

        <h4>SAQ-D (Highest Scope — Avoid)</h4>
        <ul className="space-y-2">
          <li>
            <strong>Requirement:</strong> Your server handles card data
            directly.
          </li>
          <li>
            <strong>Frontend:</strong> Custom card form posting to your server.
          </li>
          <li>
            <strong>Compliance:</strong> Full PCI DSS audit by QSA (Qualified
            Security Assessor). Expensive and complex.
          </li>
          <li>
            <strong>Recommendation:</strong> Never do this unless absolutely
            necessary. Use PSP-hosted fields instead.
          </li>
        </ul>
        <p>
          <strong>Key principle:</strong> Never let card data touch your server.
          Use PSP-hosted fields (Elements, iframe) to keep card data isolated.
          This reduces PCI scope to SAQ-A.
        </p>

        <h3>3DS/SCA Authentication</h3>
        <p>
          3D Secure (3DS) is a protocol for authenticating cardholders. SCA
          (Strong Customer Authentication) is a European regulation requiring
          3DS for most online payments.
        </p>

        <h4>3DS Flow</h4>
        <ul className="space-y-2">
          <li>
            <strong>Step 1:</strong> Customer enters card details and submits
            payment.
          </li>
          <li>
            <strong>Step 2:</strong> Gateway checks if 3DS is required (based on
            amount, region, risk).
          </li>
          <li>
            <strong>Step 3:</strong> If required, customer is redirected to
            bank's 3DS page (or challenge modal).
          </li>
          <li>
            <strong>Step 4:</strong> Customer authenticates (OTP, biometric,
            password).
          </li>
          <li>
            <strong>Step 5:</strong> Bank returns authentication result to
            gateway.
          </li>
          <li>
            <strong>Step 6:</strong> Payment proceeds if authenticated.
          </li>
        </ul>

        <h4>Frictionless vs. Challenge Flow</h4>
        <ul className="space-y-2">
          <li>
            <strong>Frictionless:</strong> Low-risk transactions authenticated
            without user interaction. Best UX.
          </li>
          <li>
            <strong>Challenge:</strong> Higher-risk transactions require user
            authentication (OTP, etc.). More friction but required for
            compliance.
          </li>
        </ul>
        <p>
          <strong>Frontend responsibility:</strong> Handle 3DS
          redirects/challenges gracefully. Don't navigate away during challenge.
          Show loading state. Handle failures.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/3ds-sca-flow.svg"
          alt="3DS SCA authentication flow comparing frictionless flow (low risk, no user action) vs challenge flow (high risk, OTP/biometric required)"
          caption="3DS flow — frictionless for low-risk transactions (best UX); challenge for high-risk (required for SCA compliance)"
        />

        <h3>Webhooks for Async Confirmation</h3>
        <p>
          Payments are asynchronous. The frontend initiates payment, but
          confirmation comes later via webhook:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Frontend:</strong> Initiates payment, shows pending state.
          </li>
          <li>
            <strong>Gateway:</strong> Processes payment, sends webhook to
            backend.
          </li>
          <li>
            <strong>Backend:</strong> Processes webhook, updates order status.
          </li>
          <li>
            <strong>Frontend:</strong> Polls or receives push notification for
            status update.
          </li>
        </ul>
        <p>
          <strong>Key insight:</strong> Never trust frontend payment
          confirmation. Always wait for backend confirmation via webhook.
          Frontend can be tampered with; webhooks are server-to-server.
        </p>

        <h3>Idempotency</h3>
        <p>
          Idempotency ensures that retrying a payment request doesn't charge the
          customer twice:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Problem:</strong> Network timeout → frontend retries →
            customer charged twice.
          </li>
          <li>
            <strong>Solution:</strong> Include idempotency key (UUID) with
            payment request. Backend stores key + result. Duplicate keys return
            cached result.
          </li>
          <li>
            <strong>Key Generation:</strong> Generate UUID on client, include in
            request. Or use order_id as idempotency key.
          </li>
          <li>
            <strong>Storage:</strong> Store keys for 24+ hours to handle late
            retries.
          </li>
        </ul>
        <p>
          <strong>Frontend responsibility:</strong> Generate and include
          idempotency key with payment requests. Retry with same key on failure.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/idempotency.svg"
          alt="Idempotency flow showing duplicate payment requests with same idempotency key returning cached result instead of processing twice"
          caption="Idempotency — same idempotency key returns cached result; prevents duplicate charges on network retry"
        />

        <h3>Payment States</h3>
        <p>Payments have multiple states that frontend must handle:</p>
        <ul className="space-y-2">
          <li>
            <strong>Pending:</strong> Payment initiated, awaiting confirmation.
            Show loading state.
          </li>
          <li>
            <strong>Requires Action:</strong> 3DS challenge required. Redirect
            to challenge.
          </li>
          <li>
            <strong>Succeeded:</strong> Payment confirmed. Show success, fulfill
            order.
          </li>
          <li>
            <strong>Failed:</strong> Payment declined. Show error, allow retry.
          </li>
          <li>
            <strong>Cancelled:</strong> User abandoned payment. Allow retry.
          </li>
        </ul>
        <p>
          <strong>Frontend responsibility:</strong> Handle all states
          gracefully. Don't assume payment succeeds immediately. Poll or wait
          for webhook confirmation.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <p>
          A robust payment architecture treats payments as a{" "}
          <strong>distributed system</strong> with multiple failure points and
          asynchronous confirmation.
        </p>

        <h3>Payment Flow Architecture</h3>
        <p>The complete payment flow involves multiple components:</p>
        <ul className="space-y-2">
          <li>
            <strong>Payment Form:</strong> Collects payment details via
            PSP-hosted fields (Elements, iframe).
          </li>
          <li>
            <strong>Payment Intent:</strong> Backend creates payment intent with
            PSP, receives client_secret.
          </li>
          <li>
            <strong>Confirmation:</strong> Frontend confirms payment with
            client_secret. Handles 3DS if required.
          </li>
          <li>
            <strong>Webhook Handler:</strong> Backend receives webhook, updates
            order status.
          </li>
          <li>
            <strong>Status Poller:</strong> Frontend polls backend for payment
            status until confirmed.
          </li>
        </ul>

        <h3>Error Handling</h3>
        <p>
          Payment errors fall into several categories, each requiring different
          handling:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Card Declined:</strong> Show specific error (insufficient
            funds, expired card). Allow retry with different card.
          </li>
          <li>
            <strong>3DS Failed:</strong> Show authentication failed. Allow
            retry.
          </li>
          <li>
            <strong>Network Error:</strong> Retry with same idempotency key.
            Don't charge twice.
          </li>
          <li>
            <strong>Gateway Error:</strong> Show generic error. Log for
            investigation. Allow retry.
          </li>
          <li>
            <strong>Fraud Block:</strong> Show generic error (don't reveal fraud
            rules). Contact support.
          </li>
        </ul>

        <h3>Retry Strategy</h3>
        <p>Implement retry logic for transient failures:</p>
        <ul className="space-y-2">
          <li>
            <strong>Network Errors:</strong> Retry 2-3 times with exponential
            backoff. Use same idempotency key.
          </li>
          <li>
            <strong>Gateway Timeouts:</strong> Retry after delay. Check payment
            status before retrying.
          </li>
          <li>
            <strong>3DS Timeout:</strong> Allow user to retry 3DS. Don't
            auto-retry.
          </li>
          <li>
            <strong>Card Declined:</strong> Don't retry automatically. User must
            fix card details.
          </li>
        </ul>

        <h3>Webhook Reliability</h3>
        <p>
          Webhooks are critical for payment confirmation. Ensure reliability:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Signature Verification:</strong> Verify webhook signature to
            confirm it's from PSP.
          </li>
          <li>
            <strong>Idempotency:</strong> Handle duplicate webhooks (PSPs retry
            on non-200 responses).
          </li>
          <li>
            <strong>Fast Acknowledgment:</strong> Return 200 quickly. Process
            asynchronously.
          </li>
          <li>
            <strong>Retry Handling:</strong> PSPs retry failed webhooks. Handle
            retries gracefully.
          </li>
          <li>
            <strong>Monitoring:</strong> Alert on webhook failures. Missing
            webhooks mean unconfirmed payments.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/third-party-integration/webhook-delivery.svg"
          alt="Webhook delivery flow showing payment gateway sending webhook, backend verifying signature, checking idempotency, updating order state, and acknowledging"
          caption="Webhook delivery — verify signature, check idempotency, process async, acknowledge quickly; retry on failure"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Payment integration involves trade-offs between security, conversion,
          and complexity.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Integration Pattern</th>
              <th className="p-3 text-left">PCI Scope</th>
              <th className="p-3 text-left">Conversion</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Hosted Fields (Elements)</td>
              <td className="p-3">SAQ-A (lowest)</td>
              <td className="p-3">Best (seamless)</td>
              <td className="p-3">Low</td>
              <td className="p-3">Most use cases</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Redirect to PSP</td>
              <td className="p-3">SAQ-A (lowest)</td>
              <td className="p-3">Fair (context switch)</td>
              <td className="p-3">Lowest</td>
              <td className="p-3">Simple integrations</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Custom Form</td>
              <td className="p-3">SAQ-D (highest)</td>
              <td className="p-3">Best (fully custom)</td>
              <td className="p-3">Highest (PCI audit)</td>
              <td className="p-3">Avoid unless required</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that{" "}
          <strong>
            hosted fields (Stripe Elements, Braintree Hosted Fields) are the
            default choice
          </strong>
          . They provide the best balance: SAQ-A compliance, seamless UX, and
          low complexity.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use Hosted Fields:</strong> Stripe Elements, Braintree
            Hosted Fields, etc. Never handle raw card data.
          </li>
          <li>
            <strong>Implement Idempotency:</strong> Include idempotency key with
            all payment requests. Retry safely.
          </li>
          <li>
            <strong>Handle 3DS Gracefully:</strong> Don't navigate away during
            3DS challenge. Show loading state.
          </li>
          <li>
            <strong>Wait for Webhook Confirmation:</strong> Never trust frontend
            confirmation. Wait for backend webhook confirmation.
          </li>
          <li>
            <strong>Verify Webhook Signatures:</strong> Always verify webhook
            signature to confirm authenticity.
          </li>
          <li>
            <strong>Implement Retry Logic:</strong> Retry network failures with
            exponential backoff. Use same idempotency key.
          </li>
          <li>
            <strong>Show Clear Errors:</strong> Show specific error messages
            (card declined, expired). Allow retry.
          </li>
          <li>
            <strong>Monitor Payment Metrics:</strong> Track success rate,
            failure reasons, 3DS challenge rate. Alert on anomalies.
          </li>
          <li>
            <strong>Test All Scenarios:</strong> Test success, decline, 3DS,
            network failure, webhook failure.
          </li>
          <li>
            <strong>Have Fallback:</strong> If one PSP fails, have backup PSP
            ready. Don't lose revenue.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Handling Raw Card Data:</strong> Never let card data touch
            your server. Use hosted fields for SAQ-A compliance.
          </li>
          <li>
            <strong>No Idempotency:</strong> Without idempotency, network
            retries cause duplicate charges.
          </li>
          <li>
            <strong>Trusting Frontend Confirmation:</strong> Frontend can be
            tampered with. Always wait for webhook confirmation.
          </li>
          <li>
            <strong>Not Verifying Webhooks:</strong> Unverified webhooks can be
            spoofed. Always verify signature.
          </li>
          <li>
            <strong>Ignoring 3DS:</strong> 3DS is required for SCA compliance.
            Handle 3DS challenges gracefully.
          </li>
          <li>
            <strong>No Retry Logic:</strong> Network failures happen. Implement
            retry with idempotency.
          </li>
          <li>
            <strong>Poor Error Messages:</strong> Generic errors frustrate
            users. Show specific errors (card declined, expired).
          </li>
          <li>
            <strong>No Monitoring:</strong> Payment failures cost revenue.
            Monitor success rate and alert on drops.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce: Subscription Billing</h3>
        <p>
          <strong>Problem:</strong> E-commerce site needed recurring billing for
          subscriptions with dunning (retry failed payments).
        </p>
        <p>
          <strong>Solution:</strong> Used Stripe Billing with hosted fields.
          Implemented webhook handlers for payment success/failure. Automated
          dunning with email notifications.
        </p>
        <p>
          <strong>Results:</strong> 95% payment success rate. Automated dunning
          recovered 30% of failed payments. PCI compliance achieved (SAQ-A).
        </p>

        <h3>Marketplace: Split Payments</h3>
        <p>
          <strong>Problem:</strong> Marketplace needed to split payments between
          platform and multiple vendors.
        </p>
        <p>
          <strong>Solution:</strong> Used Stripe Connect with destination
          charges. Platform takes commission, rest goes to vendors. Handled
          vendor onboarding via OAuth.
        </p>
        <p>
          <strong>Results:</strong> Automated split payments. Vendor onboarding
          streamlined. Platform revenue automatically collected.
        </p>

        <h3>SaaS: Multi-Currency Support</h3>
        <p>
          <strong>Problem:</strong> SaaS company needed to accept payments in
          multiple currencies with local payment methods.
        </p>
        <p>
          <strong>Solution:</strong> Used Adyen for multi-currency support.
          Dynamic currency display based on user location. Local payment methods
          (iDEAL, SEPA, etc.).
        </p>
        <p>
          <strong>Results:</strong> 40% increase in international conversions.
          Local payment methods increased trust.
        </p>

        <h3>Mobile App: In-App Purchases</h3>
        <p>
          <strong>Problem:</strong> Mobile app needed in-app purchases with
          receipt validation.
        </p>
        <p>
          <strong>Solution:</strong> Used StoreKit (iOS) and Billing Library
          (Android). Backend validated receipts with Apple/Google. Granted
          access on validation.
        </p>
        <p>
          <strong>Results:</strong> Compliant with App Store guidelines. Receipt
          validation prevented fraud.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 1: What is PCI DSS and how do you achieve SAQ-A
              compliance?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              PCI DSS (Payment Card Industry Data Security Standard) is a set of
              security standards for handling card data. Compliance level
              depends on how you handle card data:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>SAQ-A (Lowest Scope):</strong> Card data entered
                directly into PSP-hosted fields (Stripe Elements, Braintree
                Hosted Fields). Your server never touches card data. Annual
                self-assessment.
              </li>
              <li>
                <strong>SAQ-D (Highest Scope):</strong> Your server handles card
                data directly. Full PCI DSS audit by QSA. Expensive and complex.
              </li>
            </ul>
            <p>
              To achieve SAQ-A: Use PSP-hosted fields (Elements, iframe) for
              card input. Never let card data touch your server. Use tokens for
              backend charges. This is the recommended approach for most
              merchants.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 2: What is 3DS/SCA and how do you handle it in the
              frontend?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>3DS (3D Secure):</strong> Protocol for authenticating
                cardholders. Required for SCA (Strong Customer Authentication)
                in Europe.
              </li>
              <li>
                <strong>Frictionless Flow:</strong> Low-risk transactions
                authenticated without user interaction.
              </li>
              <li>
                <strong>Challenge Flow:</strong> Higher-risk transactions
                require user authentication (OTP, biometric).
              </li>
            </ul>
            <p className="mb-3">Frontend handling:</p>
            <ul className="space-y-2 mb-3">
              <li>Don't navigate away during 3DS challenge.</li>
              <li>Show loading state while challenge is in progress.</li>
              <li>Handle challenge success/failure gracefully.</li>
              <li>Allow retry if challenge fails.</li>
            </ul>
            <p>
              PSPs like Stripe handle 3DS automatically with Elements. You just
              need to handle the redirect/challenge gracefully.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 3: Why are webhooks important for payment confirmation?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Webhooks are critical because payments are asynchronous:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Frontend Initiates:</strong> User submits payment,
                frontend shows pending.
              </li>
              <li>
                <strong>Gateway Processes:</strong> Gateway processes payment,
                may involve 3DS, bank authorization.
              </li>
              <li>
                <strong>Webhook Confirms:</strong> Gateway sends webhook to
                backend with final result.
              </li>
              <li>
                <strong>Backend Updates:</strong> Backend updates order status,
                fulfills order.
              </li>
            </ul>
            <p className="mb-3">Why not trust frontend?</p>
            <ul className="space-y-2 mb-3">
              <li>Frontend can be tampered with.</li>
              <li>User may close browser before confirmation.</li>
              <li>3DS may complete after frontend timeout.</li>
            </ul>
            <p>
              Always wait for webhook confirmation before fulfilling orders.
              Frontend should poll backend for status until confirmed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 4: What is idempotency and why is it critical for
              payments?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <p className="mb-3">
              Idempotency ensures that retrying a request doesn't have duplicate
              effects:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Problem:</strong> Network timeout → frontend retries →
                customer charged twice.
              </li>
              <li>
                <strong>Solution:</strong> Include idempotency key (UUID) with
                payment request. Backend stores key + result. Duplicate keys
                return cached result.
              </li>
              <li>
                <strong>Key Generation:</strong> Generate UUID on client or use
                order_id.
              </li>
              <li>
                <strong>Storage:</strong> Store keys for 24+ hours to handle
                late retries.
              </li>
            </ul>
            <p>
              Idempotency is critical because network failures are common
              (especially on mobile). Without idempotency, retries cause
              duplicate charges, leading to refunds, chargebacks, and angry
              customers.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 5: How do you handle payment errors in the frontend?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Card Declined:</strong> Show specific error
                (insufficient funds, expired card). Allow retry with different
                card.
              </li>
              <li>
                <strong>3DS Failed:</strong> Show authentication failed. Allow
                retry.
              </li>
              <li>
                <strong>Network Error:</strong> Retry with same idempotency key.
                Show "processing" state.
              </li>
              <li>
                <strong>Gateway Error:</strong> Show generic error. Log for
                investigation. Allow retry.
              </li>
              <li>
                <strong>Fraud Block:</strong> Show generic error (don't reveal
                fraud rules). Contact support.
              </li>
            </ul>
            <p>
              Key principle: Show specific errors when user can fix (card
              declined), generic errors when they can't (fraud block). Always
              allow retry unless fraud is suspected.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">
              Question 6: How do you verify webhook authenticity?
            </h3>
            <p className="text-muted mb-3">
              <strong>Answer:</strong>
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Signature Verification:</strong> PSPs sign webhooks with
                a secret. Verify signature before processing.
              </li>
              <li>
                <strong>Stripe Example:</strong> Stripe-Signature header
                contains timestamp and signature. Compute HMAC of payload with
                webhook secret. Compare signatures.
              </li>
              <li>
                <strong>Timing:</strong> Verify signature before any processing.
                Reject if signature doesn't match.
              </li>
              <li>
                <strong>Secret Storage:</strong> Store webhook secret securely
                (environment variable, secret manager). Never commit to code.
              </li>
            </ul>
            <p>
              Signature verification is critical because unverified webhooks can
              be spoofed. Attackers could send fake "payment succeeded" webhooks
              to get free products.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/payments"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe Payments Documentation
            </a>{" "}
            — Comprehensive guide to Stripe payment integration.
          </li>
          <li>
            <a
              href="https://www.pcisecuritystandards.org/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PCI Security Standards Council
            </a>{" "}
            — Official PCI DSS documentation and requirements.
          </li>
          <li>
            <a
              href="https://stripe.com/docs/strong-customer-authentication"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe: Strong Customer Authentication
            </a>{" "}
            — Guide to SCA/3DS compliance in Europe.
          </li>
          <li>
            <a
              href="https://stripe.com/docs/webhooks"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe: Webhooks
            </a>{" "}
            — Webhook integration and signature verification.
          </li>
          <li>
            <a
              href="https://stripe.com/docs/api/idempotent_requests"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe: Idempotent Requests
            </a>{" "}
            — Idempotency key usage for safe retries.
          </li>
          <li>
            <a
              href="https://www.adyen.com/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Adyen Documentation
            </a>{" "}
            — Multi-currency and local payment method support.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
