"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-payment-gateways",
  title: "Payment Gateways",
  description:
    "Comprehensive guide to implementing payment gateway integration covering gateway selection criteria, multi-gateway routing, failover strategies, cost optimization, geographic considerations, and compliance requirements for payment processing infrastructure.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "payment-gateways",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "payment-gateways",
    "backend",
    "payment-processing",
    "multi-gateway",
    "failover",
  ],
  relatedTopics: ["payment-processing", "payment-ui", "fraud-detection", "billing-platforms"],
};

export default function PaymentGatewaysArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Payment gateways are the infrastructure that processes credit card and digital payments: Stripe, PayPal, Braintree, Adyen, Square. Gateway selection impacts conversion (supported payment methods), cost (processing fees), reliability (uptime, failover), and compliance (PCI DSS, regional regulations). For staff and principal engineers, payment gateway architecture involves multi-gateway routing (optimize for cost, success rate), failover strategies (gateway downtime), and compliance requirements (PCI DSS, PSD2, regional regulations).
        </p>
        <p>
          The complexity of payment gateway integration extends beyond simple API calls. Different gateways have different APIs (REST, GraphQL, SDK), different features (3D Secure, tokenization, recurring billing), different fees (interchange++, flat rate), and different geographic coverage (US, EU, Asia). Multi-gateway routing optimizes for cost (route to cheapest gateway), success rate (route to highest auth rate), and geography (route to local gateway). Failover strategies handle gateway downtime (automatic failover, retry logic). Compliance requirements vary by region (PCI DSS globally, PSD2 in Europe, local regulations in Asia).
        </p>
        <p>
          For staff and principal engineers, payment gateway architecture involves abstraction layers (unified gateway interface), routing logic (cost, success rate, geography), and monitoring (success rates, latency, costs). The system must support multiple gateways (Stripe, PayPal, Adyen), multiple payment methods (cards, wallets, bank transfer), and multiple regions (US, EU, Asia). Analytics track gateway performance (auth rate, latency, cost), routing effectiveness (cost savings, success rate improvement), and compliance (PCI DSS audits, regional compliance).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Gateway Selection Criteria</h3>
        <p>
          Processing fees impact profitability. Fee structures: flat rate (2.9% + $0.30), interchange++ (interchange + markup), tiered (different rates for different cards). Volume discounts: high volume (&gt;$1M/month) negotiates lower rates. Hidden fees: chargeback fees ($15-25), international fees (+1%), currency conversion (+1%). Display: fee calculator (estimate costs), comparison (gateway vs. gateway), optimization (route to cheapest).
        </p>
        <p>
          Authorization rates impact revenue. Factors: gateway fraud filters (stricter = lower auth), card network relationships (better relationships = higher auth), regional optimization (local gateway = higher auth). Monitoring: auth rate per gateway, per card type, per region. Optimization: route to highest auth rate, A/B test gateways, negotiate with gateways (improve auth rate).
        </p>
        <p>
          Geographic coverage impacts international sales. Coverage: domestic (US only), regional (US + EU), global (worldwide). Local payment methods: cards (US, EU), wallets (Alipay in China, Paytm in India), bank transfer (SEPA in EU, iDEAL in Netherlands). Compliance: regional regulations (PSD2 in EU, local regulations in Asia), data residency (data stored in region).
        </p>

        <h3 className="mt-6">Multi-Gateway Routing</h3>
        <p>
          Cost-based routing routes to cheapest gateway. Calculation: gateway fees (percentage + fixed), interchange fees (card type, region), total cost (gateway + interchange). Routing: route to lowest total cost, respect customer preference (saved payment method), fallback to second cheapest (if first fails). Savings: 0.5-1% of transaction volume (significant at scale).
        </p>
        <p>
          Success rate routing routes to highest auth rate gateway. Calculation: auth rate per gateway (historical data), per card type (Visa vs. Mastercard), per region (US vs. EU). Routing: route to highest auth rate, respect customer preference, fallback to second highest (if first fails). Revenue impact: 1-2% increase in auth rate (significant revenue).
        </p>
        <p>
          Geographic routing routes to local gateway. Calculation: customer location (IP, billing address), gateway coverage (which gateways in region), local payment methods (which payment methods in region). Routing: route to local gateway (higher auth rate), support local payment methods (Alipay, iDEAL), comply with regional regulations (PSD2, data residency).
        </p>

        <h3 className="mt-6">Failover Strategies</h3>
        <p>
          Automatic failover switches gateway on failure. Triggers: gateway downtime (HTTP 5xx errors), high latency (&gt;5 seconds), high decline rate (sudden spike). Failover: switch to backup gateway (pre-configured), retry transaction (on backup gateway), notify team (alert on failover). Recovery: switch back when primary recovers (health check), gradual traffic shift (not all at once).
        </p>
        <p>
          Retry logic retries failed transactions. Retry on: transient errors (network timeout, gateway error), not on: permanent errors (card declined, fraud decline). Retry strategy: immediate retry (on backup gateway), exponential backoff (1s, 2s, 4s), max retries (3 attempts). Idempotency: prevent duplicate charges (idempotency key), track retry attempts (retry count).
        </p>
        <p>
          Health monitoring monitors gateway health. Metrics: latency (response time), error rate (HTTP errors), auth rate (authorization success), volume (transactions per minute). Alerts: latency spike (&gt;5 seconds), error rate spike (&gt;5%), auth rate drop (&gt;10%). Dashboard: real-time metrics (current status), historical trends (performance over time), comparison (gateway vs. gateway).
        </p>

        <h3 className="mt-6">Compliance Requirements</h3>
        <p>
          PCI DSS compliance required for card processing. Levels: Level 1 (&gt;6M transactions/year, annual audit), Level 2 (1-6M transactions, annual assessment), Level 3/4 (&lt;1M transactions, self-assessment). Requirements: secure network (firewalls, encryption), cardholder data protection (encryption, tokenization), vulnerability management (antivirus, secure systems), access control (need-to-know, unique IDs).
        </p>
        <p>
          PSD2 compliance required in Europe. SCA (Strong Customer Authentication): 3D Secure 2.0 (biometric, 2FA), exemptions (low value &lt;€30, recurring, trusted beneficiary). Enforcement: European transactions require SCA, non-compliant transactions declined. Implementation: 3D Secure integration, exemption logic (check if exempt), fallback (decline if SCA fails).
        </p>
        <p>
          Regional compliance varies by region. US: PCI DSS, state regulations (NYDFS, CCPA). EU: PCI DSS, PSD2, GDPR (data privacy). Asia: PCI DSS, local regulations (China: PBOC, India: RBI). Data residency: data stored in region (EU data in EU, China data in China), cross-border transfer restrictions (GDPR restrictions, China restrictions).
        </p>

        <h3 className="mt-6">Gateway Integration</h3>
        <p>
          Gateway abstraction provides unified interface. Interface: charge(amount, card, metadata), refund(transaction_id, amount), void(transaction_id), capture(transaction_id, amount). Implementation: StripeAdapter, PayPalAdapter, AdyenAdapter (each implements interface). Benefits: swap gateways (change adapter), test gateways (mock adapter), multi-gateway (route to different adapters).
        </p>
        <p>
          Tokenization stores cards securely. Process: card data → gateway vault → token (card_abc123), store token (not card data). Benefits: PCI scope reduced (SAQ A, not SAQ D), secure (card data not on server), portable (token works across gateways if same provider). Implementation: gateway-specific tokens (Stripe tokens, PayPal tokens), token mapping (map tokens to customers).
        </p>
        <p>
          Webhook handling processes async events. Events: payment.succeeded (charge succeeded), payment.failed (charge failed), refund.succeeded (refund processed), dispute.opened (chargeback opened). Processing: verify signature (prevent spoofing), idempotent processing (prevent duplicates), update order (update order status), notify customer (email/SMS notification).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Payment gateway architecture spans gateway abstraction, routing logic, failover handling, and compliance. Gateway abstraction provides unified interface (charge, refund, void). Routing logic routes to optimal gateway (cost, success rate, geography). Failover handling handles gateway downtime (automatic failover, retry). Compliance ensures regulatory compliance (PCI DSS, PSD2, regional).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-gateways/gateway-architecture.svg"
          alt="Payment Gateway Architecture"
          caption="Figure 1: Payment Gateway Architecture — Gateway abstraction, routing logic, failover handling, and compliance"
          width={1000}
          height={500}
        />

        <h3>Gateway Abstraction Layer</h3>
        <p>
          Unified gateway interface defines common operations. Operations: charge (authorize + capture), capture (capture authorized charge), refund (refund charge), void (void authorized charge), verify (verify card without charge). Request: amount, currency, card/payment_method, metadata (order_id, customer_id). Response: success/failure, transaction_id, error_code, error_message.
        </p>
        <p>
          Gateway adapters implement unified interface. Adapters: StripeAdapter (Stripe API), PayPalAdapter (PayPal API), AdyenAdapter (Adyen API). Implementation: translate unified request to gateway-specific request, translate gateway-specific response to unified response, handle gateway-specific errors (map to unified errors). Benefits: swap gateways (change adapter), test gateways (mock adapter), multi-gateway (route to different adapters).
        </p>
        <p>
          Gateway configuration manages gateway credentials. Credentials: API keys (publishable, secret), webhook secrets (verify webhooks), merchant IDs (gateway merchant account). Storage: secrets manager (AWS Secrets Manager, HashiCorp Vault), environment variables (development), rotated regularly (security best practice). Access: service accounts (gateway service), restricted access (need-to-know).
        </p>

        <h3 className="mt-6">Routing Logic</h3>
        <p>
          Routing rules determine gateway selection. Rules: cost-based (route to cheapest), success rate-based (route to highest auth), geographic (route to local), customer preference (route to saved gateway). Priority: customer preference first (saved gateway), then optimization (cost, success rate), then fallback (default gateway). Configuration: rule priority (which rule first), rule weights (cost 50%, success rate 50%).
        </p>
        <p>
          Routing engine executes routing logic. Input: transaction details (amount, currency, card type, customer location), gateway status (health, cost, auth rate). Process: evaluate rules (cost, success rate, geography), calculate scores (gateway scores), select gateway (highest score). Output: selected gateway, fallback gateways (if first fails), routing reason (why selected).
        </p>
        <p>
          Routing analytics tracks routing effectiveness. Metrics: routing distribution (% transactions per gateway), cost savings (actual cost vs. single gateway), auth rate improvement (actual auth vs. single gateway). Analysis: A/B test routing (test vs. control), optimize rules (adjust weights), identify issues (gateway underperformance). Dashboard: routing distribution (pie chart), cost savings (line chart), auth rate (bar chart).
        </p>

        <h3 className="mt-6">Failover Handling</h3>
        <p>
          Health check monitors gateway health. Checks: HTTP health endpoint (gateway status), synthetic transactions (test transaction), latency check (response time), error rate check (error percentage). Frequency: every 30 seconds (real-time), every 5 minutes (trend). Thresholds: latency &gt;5 seconds (degraded), error rate &gt;5% (unhealthy), auth rate drop &gt;10% (degraded).
        </p>
        <p>
          Failover logic switches gateway on failure. Triggers: health check failed (gateway unhealthy), high latency (&gt;5 seconds), high error rate (&gt;5%), high decline rate (sudden spike). Failover: switch to backup gateway (pre-configured), retry transaction (on backup gateway), notify team (alert on failover). Recovery: health check passes (gateway recovered), gradual traffic shift (10%, 50%, 100%), notify team (alert on recovery).
        </p>
        <p>
          Retry logic retries failed transactions. Retry on: transient errors (network timeout, gateway error, HTTP 5xx), not on: permanent errors (card declined, fraud decline, HTTP 4xx). Retry strategy: immediate retry (on backup gateway), exponential backoff (1s, 2s, 4s), max retries (3 attempts). Idempotency: prevent duplicate charges (idempotency key), track retry attempts (retry count), log retries (for debugging).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-gateways/routing-logic.svg"
          alt="Routing Logic"
          caption="Figure 2: Routing Logic — Cost-based, success rate, and geographic routing"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Compliance Management</h3>
        <p>
          PCI DSS compliance management ensures card security. Scope: SAQ A (tokenization, minimal scope), SAQ D (full scope, card data). Requirements: secure network (firewalls, encryption), cardholder data protection (encryption, tokenization), vulnerability management (antivirus, secure systems), access control (need-to-know, unique IDs). Audits: annual audit (Level 1), annual assessment (Level 2), self-assessment (Level 3/4).
        </p>
        <p>
          PSD2 compliance management ensures European compliance. SCA enforcement: 3D Secure 2.0 (biometric, 2FA), exemption logic (low value, recurring, trusted), fallback (decline if SCA fails). Monitoring: SCA rate (% transactions with SCA), exemption rate (% transactions exempt), decline rate (SCA failures). Reporting: regulatory reporting (SCA compliance), exemption justification (why exempt).
        </p>
        <p>
          Regional compliance management ensures local compliance. Requirements: data residency (data stored in region), cross-border transfer (restrictions, approvals), local regulations (China PBOC, India RBI). Implementation: regional gateways (local gateway per region), data segregation (data stored in region), compliance checks (verify compliance before processing). Monitoring: compliance status (compliant/non-compliant), audit trail (compliance logs), alerts (compliance violations).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-gateways/gateway-comparison.svg"
          alt="Gateway Comparison"
          caption="Figure 3: Gateway Comparison — Fees, features, and geographic coverage"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Payment gateway design involves trade-offs between cost, reliability, complexity, and compliance. Understanding these trade-offs enables informed decisions aligned with business requirements and operational capabilities.
        </p>

        <h3>Single vs. Multi-Gateway</h3>
        <p>
          Single gateway (one gateway for all transactions). Pros: Simple integration (one API), simple compliance (one gateway to comply), simple operations (one dashboard). Cons: Single point of failure (gateway down = no payments), no optimization (can&apos;t route for cost/success), gateway lock-in (hard to switch). Best for: Small businesses (&lt;$1M/year), simple businesses (one region, one currency).
        </p>
        <p>
          Multi-gateway (multiple gateways for routing). Pros: Redundancy (gateway down = failover), optimization (route for cost/success), negotiation leverage (can switch gateways). Cons: Complex integration (multiple APIs), complex compliance (multiple gateways to comply), complex operations (multiple dashboards). Best for: Large businesses (&gt;$1M/year), international businesses (multiple regions), high-availability requirements.
        </p>
        <p>
          Hybrid: primary + backup gateway. Pros: Balance (simple + redundancy), failover (backup if primary down), optimization (limited). Cons: Some complexity (two gateways), partial optimization (only two gateways). Best for: Most production systems—primary gateway (main traffic), backup gateway (failover).
        </p>

        <h3>Routing: Cost vs. Success Rate vs. Geography</h3>
        <p>
          Cost-based routing (route to cheapest). Pros: Lower costs (0.5-1% savings), predictable (cost optimization), measurable (cost savings). Cons: May lower auth rate (cheaper gateway = lower auth), may increase latency (cheaper gateway = slower). Best for: Cost-sensitive businesses (low margins), high volume (&gt;$10M/year, savings significant).
        </p>
        <p>
          Success rate routing (route to highest auth). Pros: Higher revenue (1-2% auth improvement), customer satisfaction (fewer declines), measurable (auth rate improvement). Cons: May increase costs (higher auth gateway = more expensive), may increase latency (best auth gateway = slower). Best for: Revenue-focused businesses (high margins), high decline rates (need improvement).
        </p>
        <p>
          Geographic routing (route to local gateway). Pros: Higher auth rate (local gateway = higher auth), local payment methods (Alipay, iDEAL), compliance (data residency, regional regulations). Cons: Complexity (multiple gateways per region), cost (may not be cheapest). Best for: International businesses (multiple regions), local payment methods required, compliance required.
        </p>

        <h3>Compliance: Self-Managed vs. Gateway-Managed</h3>
        <p>
          Self-managed compliance (handle compliance yourself). Pros: Control (full control over compliance), flexibility (customize compliance), cost (may be cheaper at scale). Cons: Responsibility (you handle compliance), complexity (PCI DSS audits, PSD2 enforcement), risk (non-compliance penalties). Best for: Large businesses (&gt;$10M/year, compliance team), specific requirements (custom compliance).
        </p>
        <p>
          Gateway-managed compliance (gateway handles compliance). Pros: Simplicity (gateway handles compliance), reduced scope (SAQ A, not SAQ D), reduced risk (gateway liable). Cons: Cost (gateway charges for compliance), less control (gateway controls compliance), dependency (gateway compliance = your compliance). Best for: Small/medium businesses (&lt;$10M/year, no compliance team), tokenization (reduced scope).
        </p>
        <p>
          Hybrid: gateway-managed + self-managed. Pros: Balance (gateway handles tokenization, you handle rest), reduced scope (SAQ A/B, not SAQ D), flexibility (control what matters). Cons: Some complexity (split responsibility), coordination (gateway + your compliance). Best for: Most production systems—gateway tokenization (reduced scope), self-managed (business compliance).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/payment-gateways/failover-flow.svg"
          alt="Failover Flow"
          caption="Figure 4: Failover Flow — Health monitoring, automatic failover, and recovery"
          width={1000}
          height={450}
        />

        <h3>Integration: Direct vs. Aggregator</h3>
        <p>
          Direct integration (integrate directly with gateway). Pros: Full features (all gateway features), direct support (gateway support team), better rates (direct negotiation). Cons: More work (integrate each gateway), more maintenance (maintain multiple integrations), more compliance (multiple gateways to comply). Best for: Large businesses (integration team), specific requirements (need full features).
        </p>
        <p>
          Aggregator integration (use payment orchestration platform). Pros: Simplified integration (one API for multiple gateways), built-in routing (routing logic provided), reduced maintenance (platform maintains integrations). Cons: Additional cost (platform fees), less control (platform controls routing), dependency (platform dependency). Best for: Medium businesses (want multi-gateway, no integration team), fast deployment (need quickly).
        </p>
        <p>
          Hybrid: direct for primary, aggregator for backup. Pros: Balance (direct control + aggregator simplicity), primary features (full features for primary), backup simplicity (aggregator for backup). Cons: Some complexity (two integrations), coordination (direct + aggregator). Best for: Most production systems—direct primary (full control), aggregator backup (simplicity).
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Use gateway abstraction:</strong> Unified interface (charge, refund, void), adapters per gateway (StripeAdapter, PayPalAdapter), easy to swap (change adapter). Benefits: swap gateways, test gateways, multi-gateway routing.
          </li>
          <li>
            <strong>Implement multi-gateway routing:</strong> Route by cost (cheapest gateway), success rate (highest auth), geography (local gateway). Benefits: cost savings (0.5-1%), auth improvement (1-2%), geographic optimization (local payment methods).
          </li>
          <li>
            <strong>Implement automatic failover:</strong> Health monitoring (latency, errors, auth rate), automatic failover (switch on failure), retry logic (retry on backup). Benefits: high availability (gateway down = failover), reduced downtime (automatic recovery).
          </li>
          <li>
            <strong>Use tokenization:</strong> Store tokens (not card data), reduce PCI scope (SAQ A, not SAQ D), secure (card data not on server). Benefits: security (no card data), compliance (reduced scope), portability (tokens work across gateways).
          </li>
          <li>
            <strong>Monitor gateway performance:</strong> Track latency (response time), error rate (HTTP errors), auth rate (authorization success), cost (gateway fees). Benefits: identify issues (gateway underperformance), optimize routing (adjust weights), negotiate rates (performance data).
          </li>
          <li>
            <strong>Ensure compliance:</strong> PCI DSS (card security), PSD2 (European SCA), regional regulations (data residency, local regulations). Benefits: avoid penalties (non-compliance fines), maintain processing (compliance required), customer trust (secure processing).
          </li>
          <li>
            <strong>Handle webhooks securely:</strong> Verify signatures (prevent spoofing), idempotent processing (prevent duplicates), update order (update order status), notify customer (email/SMS). Benefits: security (verified webhooks), reliability (no duplicates), customer experience (timely notifications).
          </li>
          <li>
            <strong>Optimize for geography:</strong> Local gateways (higher auth rate), local payment methods (Alipay, iDEAL), data residency (data stored in region). Benefits: higher auth (local gateway), customer preference (local payment methods), compliance (data residency).
          </li>
          <li>
            <strong>Negotiate gateway rates:</strong> Volume discounts (&gt;$1M/month), interchange optimization (level 2/3 data), competitive bidding (multiple gateways). Benefits: lower costs (0.5-1% savings), better terms (negotiated rates), leverage (can switch gateways).
          </li>
          <li>
            <strong>Test failover regularly:</strong> Synthetic transactions (test failover), chaos engineering (simulate gateway failure), recovery testing (test recovery). Benefits: confidence (failover works), identify issues (before production), compliance (testing required).
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Single gateway dependency:</strong> Gateway down = no payments. Solution: Multi-gateway (primary + backup), automatic failover, retry logic.
          </li>
          <li>
            <strong>No routing optimization:</strong> Paying more than needed. Solution: Cost-based routing, success rate routing, geographic routing.
          </li>
          <li>
            <strong>No health monitoring:</strong> Gateway issues undetected. Solution: Health checks (latency, errors, auth rate), alerts (threshold breaches), dashboard (real-time status).
          </li>
          <li>
            <strong>Storing card data:</strong> PCI scope increased (SAQ D). Solution: Tokenization (store tokens, not cards), gateway vaults (gateway stores cards), reduced scope (SAQ A).
          </li>
          <li>
            <strong>No webhook verification:</strong> Spoofed webhooks (fraud risk). Solution: Verify signatures (prevent spoofing), idempotent processing (prevent duplicates), logging (audit trail).
          </li>
          <li>
            <strong>Ignoring regional compliance:</strong> Non-compliance penalties. Solution: Regional gateways (local compliance), data residency (data in region), compliance checks (verify before processing).
          </li>
          <li>
            <strong>No retry logic:</strong> Transient errors = lost revenue. Solution: Retry on transient errors (timeout, gateway error), idempotency (prevent duplicates), backup gateway (retry on backup).
          </li>
          <li>
            <strong>No gateway testing:</strong> Failover doesn&apos;t work when needed. Solution: Regular testing (synthetic transactions), chaos engineering (simulate failure), recovery testing (test recovery).
          </li>
          <li>
            <strong>Ignoring local payment methods:</strong> Lost international sales. Solution: Local gateways (support local methods), Alipay (China), iDEAL (Netherlands), SEPA (EU).
          </li>
          <li>
            <strong>No cost optimization:</strong> Paying higher fees than needed. Solution: Negotiate rates (volume discounts), interchange optimization (level 2/3 data), routing optimization (cheapest gateway).
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Stripe Multi-Gateway Setup</h3>
        <p>
          Stripe as primary gateway: full features (cards, wallets, recurring), high auth rate (good relationships), global coverage (135+ currencies). Backup gateway: PayPal (alternative payment method), Adyen (enterprise features). Routing: Stripe primary (main traffic), PayPal backup (if Stripe down), Adyen for enterprise (high-value transactions). Failover: automatic (Stripe down = PayPal), retry logic (retry on backup), health monitoring (latency, errors, auth rate).
        </p>

        <h3 className="mt-6">Adyen Global Gateway</h3>
        <p>
          Adyen as single global gateway: global coverage (worldwide), local payment methods (Alipay, iDEAL, SEPA), single platform (one integration). Benefits: simplified integration (one API), local optimization (local gateways), compliance (regional compliance). Use cases: international businesses (multiple regions), local payment methods required, compliance required (data residency).
        </p>

        <h3 className="mt-6">PayPal + Stripe Combination</h3>
        <p>
          PayPal + Stripe combination: Stripe for cards (Visa, Mastercard, Amex), PayPal for PayPal accounts (PayPal balance, bank transfer). Benefits: customer preference (choose payment method), higher conversion (more payment methods), redundancy (if one down, other works). Implementation: payment method selection (customer chooses), routing (based on payment method), failover (if one down, suggest other).
        </p>

        <h3 className="mt-6">Braintree (PayPal) Multi-Gateway</h3>
        <p>
          Braintree multi-gateway: Braintree primary (PayPal, cards), PayPal backup (PayPal only), Venmo (US only). Routing: Braintree primary (main traffic), PayPal backup (if Braintree down), Venmo for US mobile (US only). Benefits: PayPal ecosystem (PayPal, Venmo), redundancy (multiple gateways), optimization (route by payment method).
        </p>

        <h3 className="mt-6">Square Omnichannel Gateway</h3>
        <p>
          Square omnichannel: online (e-commerce), in-person (POS, card readers), invoices (email invoices). Benefits: unified platform (one gateway for all channels), unified reporting (all transactions in one place), simplified compliance (one gateway to comply). Use cases: omnichannel businesses (online + in-store), simplified operations (one platform), unified reporting (all transactions).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you select payment gateways?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Criteria: processing fees (flat rate vs. interchange++), authorization rates (gateway auth rate), geographic coverage (regions, payment methods), features (3D Secure, tokenization, recurring), compliance (PCI DSS, PSD2, regional). Evaluation: trial period (test gateway), negotiation (volume discounts), comparison (gateway vs. gateway). Decision: primary gateway (main traffic), backup gateway (failover), regional gateways (local optimization).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement multi-gateway routing?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Abstraction: unified interface (charge, refund, void), adapters per gateway (StripeAdapter, PayPalAdapter). Routing: cost-based (route to cheapest), success rate-based (route to highest auth), geographic (route to local). Implementation: routing engine (evaluate rules, calculate scores, select gateway), fallback gateways (if first fails), routing analytics (track effectiveness).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle gateway failover?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Health monitoring: latency (response time), error rate (HTTP errors), auth rate (authorization success). Failover triggers: health check failed, high latency (&gt;5s), high error rate (&gt;5%), high decline rate (sudden spike). Failover: switch to backup gateway, retry transaction (on backup), notify team (alert on failover). Recovery: health check passes, gradual traffic shift (10%, 50%, 100%), notify team (alert on recovery).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure PCI DSS compliance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Tokenization: store tokens (not card data), gateway vaults (gateway stores cards), reduced scope (SAQ A, not SAQ D). Requirements: secure network (firewalls, encryption), cardholder data protection (encryption, tokenization), vulnerability management (antivirus, secure systems), access control (need-to-know, unique IDs). Audits: annual audit (Level 1), annual assessment (Level 2), self-assessment (Level 3/4).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize gateway costs?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Negotiation: volume discounts (&gt;$1M/month), interchange optimization (level 2/3 data), competitive bidding (multiple gateways). Routing: cost-based routing (route to cheapest), gateway comparison (fees vs. fees), fee analysis (hidden fees, international fees). Monitoring: cost tracking (per gateway, per transaction), cost analytics (actual vs. expected), cost alerts (cost spikes).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle international payments?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Local gateways: regional gateways (higher auth rate), local payment methods (Alipay, iDEAL, SEPA), data residency (data stored in region). Compliance: regional regulations (PSD2 in EU, PBOC in China, RBI in India), cross-border transfer (restrictions, approvals), currency conversion (multi-currency support). Implementation: gateway per region (US gateway, EU gateway, Asia gateway), routing by geography (route to local gateway), compliance checks (verify before processing).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/payments/payment-methods/overview"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe — Payment Methods Overview
            </a>
          </li>
          <li>
            <a
              href="https://www.adyen.com/knowledge-hub/payment-gateway"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Adyen — Payment Gateway Guide
            </a>
          </li>
          <li>
            <a
              href="https://developer.paypal.com/docs/checkout/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PayPal — Checkout Integration
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
              href="https://www.ecb.europa.eu/paym/retail/sepa/html/index.en.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              European Central Bank — PSD2 and SCA
            </a>
          </li>
          <li>
            <a
              href="https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-payments"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              McKinsey — The Future of Payments
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
