"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-trans-backend-subscription-billing",
  title: "Subscription Billing",
  description:
    "Comprehensive guide to implementing subscription billing covering recurring charges, proration handling, dunning management, subscription lifecycle, plan changes, and payment retry strategies for SaaS and membership businesses.",
  category: "functional-requirements",
  subcategory: "transactions-state",
  slug: "subscription-billing",
  version: "extensive",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: [
    "requirements",
    "functional",
    "transactions",
    "subscription",
    "billing",
    "backend",
    "recurring-payments",
    "dunning",
  ],
  relatedTopics: ["payment-processing", "subscription-management", "dunning-management", "proration"],
};

export default function SubscriptionBillingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Subscription billing manages recurring charges for subscription-based businesses (SaaS, streaming, memberships, boxes). Unlike one-time purchases, subscriptions require automated recurring charges, proration for plan changes, dunning management for failed payments, and subscription lifecycle management (trial → active → past_due → cancelled → expired). For staff and principal engineers, subscription billing involves payment gateway integration (recurring charges, card updater), state machine design (subscription states and transitions), and revenue recognition (ASC 606 compliance for accrual accounting).
        </p>
        <p>
          The complexity of subscription billing extends beyond simple recurring charges. Proration handles plan changes mid-cycle (upgrade/downgrade with credit for unused time). Dunning management handles failed payments (retry logic, customer notification, grace periods, suspension, cancellation). Subscription metrics (MRR, ARR, churn rate, expansion revenue) require accurate billing data. Tax compliance (sales tax, VAT, GST) varies by jurisdiction and subscription type. The system must handle high volume (millions of subscriptions), provide self-service management (plan changes, payment method updates), and integrate with accounting systems (revenue recognition, invoicing).
        </p>
        <p>
          For staff and principal engineers, subscription billing architecture involves distributed systems patterns. Event-driven architecture enables loose coupling (subscription created → invoice generated → payment charged → receipt sent). Idempotency prevents duplicate charges (network retry doesn&apos;t charge twice). Saga pattern coordinates distributed transactions (charge payment → activate subscription → send welcome email, with compensating transactions on failure). The system must support multiple billing models (per-seat, usage-based, tiered, flat-rate), billing frequencies (weekly, monthly, annual), and trial types (free trial, freemium, money-back guarantee).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Subscription Lifecycle States</h3>
        <p>
          Subscription states represent distinct phases in subscription lifecycle. Trial: subscription active, no charges (free trial period). Active: subscription active, recurring charges succeeding. Past_due: subscription active, payment failed (grace period for retry). Suspended: subscription paused (no access, retry continues). Cancelled: user-initiated cancellation (access until period end). Expired: subscription ended (payment failed after retries or period end). Each state has specific access rights and billing behavior.
        </p>
        <p>
          State transitions are triggered by events. Trial → Active: trial ends, first charge succeeds. Active → Past_due: payment fails (card expired, insufficient funds). Past_due → Active: payment succeeds (retry or customer updates card). Past_due → Suspended: max retries exceeded, grace period ends. Suspended → Active: payment succeeds. Any state → Cancelled: user cancels (voluntary churn). Cancelled → Expired: period ends, subscription terminates.
        </p>
        <p>
          State metadata enriches subscription information. Current period start/end (billing cycle dates). Trial start/end (trial period dates). Cancelled at (timestamp), cancelled by (user/system), cancellation reason (too expensive, not using, switched competitor). Past_due since (when payment first failed). Retry count (how many payment attempts). Metadata enables analytics (churn reasons, retry success rate) and customer communication (&quot;your subscription ends in 3 days&quot;).
        </p>

        <h3 className="mt-6">Billing Cycle and Invoicing</h3>
        <p>
          Billing cycle defines when charges occur. Anchor date: day of month for billing (e.g., 15th of each month). Frequency: weekly, monthly, quarterly, annual. Billing period: start date to end date (monthly: Jan 15 - Feb 14). Charge date: when payment is attempted (period start or end). Invoice generation: create invoice before charge (email to customer) or after charge (receipt). Annual billing often offers discount (10-20% off monthly rate).
        </p>
        <p>
          Invoice structure includes line items and adjustments. Subscription line item: plan name, quantity (seats), unit price, period, line total. Add-ons: extra features, additional seats, overage charges. Discounts: promo codes, annual discount, loyalty discount. Taxes: sales tax, VAT, GST (based on customer location, product taxability). Total: subtotal + taxes - discounts. Invoice delivered via email (PDF), customer portal (download), or API (for B2B integration).
        </p>
        <p>
          Payment collection timing varies. Prepaid: charge at period start (SaaS standard). Postpaid: charge at period end (utilities, usage-based). Hybrid: base fee prepaid, usage postpaid. Prepaid improves cash flow, reduces churn (customer already paid). Postpaid aligns with value received, better for usage-based models.
        </p>

        <h3 className="mt-6">Proration for Plan Changes</h3>
        <p>
          Proration handles plan changes mid-cycle. Upgrade: customer moves to higher-tier plan mid-cycle. Credit for unused time on old plan, charge for remaining time on new plan. Example: monthly plan ($30/month), upgrade on day 15. Credit: $15 (unused 15 days), charge: $25 (new plan $50/month × 15/30 days). Net charge: $10. Downgrade: customer moves to lower-tier plan. Credit for difference, applied to next invoice (or refunded if cancellation).
        </p>
        <p>
          Proration calculation methods vary. Exact day proration: credit/charge based on exact days remaining (most accurate, complex). Monthly average: credit/charge based on 30-day month (simpler, slight variance). Full period: no proration, change takes effect next period (simplest, customer may overpay/underpay). Proration policy should be documented (customer expectations, accounting compliance).
        </p>
        <p>
          Proration timing options. Immediate: change takes effect now, proration charged/credited now (customer gets immediate access, immediate charge). Next period: change scheduled, takes effect next billing cycle (no proration, customer waits). Immediate with credit: change takes effect now, credit applied to next invoice (customer gets access, charge deferred). Policy depends on business model (SaaS: immediate, subscriptions: next period).
        </p>

        <h3 className="mt-6">Dunning Management</h3>
        <p>
          Dunning manages failed payment recovery. Payment failure reasons: card expired, insufficient funds, card reported lost/stolen, bank decline, gateway error. Retry strategy: exponential backoff (day 1, 3, 7, 14, 21), fixed schedule (every 3 days), smart retry (optimal timing based on failure reason). Max retries: 3-5 attempts over 2-4 weeks. Each retry attempt logged (timestamp, reason, result).
        </p>
        <p>
          Customer notification keeps customer informed. Email 1 (day 1): &quot;Payment failed, please update card&quot; (soft tone, assume temporary issue). Email 2 (day 7): &quot;Subscription at risk, update payment method&quot; (urgent tone, consequences clear). Email 3 (day 14): &quot;Final notice, subscription will suspend&quot; (final warning, deadline). Email 4 (day 21): &quot;Subscription suspended&quot; (access revoked, recovery instructions). SMS/push for time-sensitive alerts (opt-in).
        </p>
        <p>
          Grace period balances recovery with customer experience. Grace period: subscription remains active during dunning (customer retains access, higher recovery rate). No grace period: subscription suspends immediately on failure (lower recovery, prevents free usage). Hybrid: grace period for good customers (long history, high LTV), immediate suspension for new/high-risk. Grace period length: 7-14 days typical.
        </p>

        <h3 className="mt-6">Subscription Metrics</h3>
        <p>
          MRR (Monthly Recurring Revenue) measures predictable revenue. MRR = sum of all active subscription monthly values. Annual subscriptions: annual price / 12. Usage-based: average of last 3 months. MRR movements: new MRR (new subscriptions), expansion MRR (upgrades, add-ons), contraction MRR (downgrades), churn MRR (cancellations). Net MRR change = new + expansion - contraction - churn. MRR growth rate = (current MRR - prior MRR) / prior MRR.
        </p>
        <p>
          Churn rate measures subscription loss. Customer churn: cancellations / active customers (percentage of customers lost). Revenue churn: churn MRR / total MRR (percentage of revenue lost). Gross churn: total churn (no offset). Net churn: churn minus expansion (can be negative if expansion &gt; churn, indicates healthy growth). Churn by cohort (signup month), by plan, by reason (cancellation survey).
        </p>
        <p>
          LTV (Lifetime Value) measures customer value. LTV = ARPU (average revenue per user) / churn rate. Example: ARPU = $50/month, churn = 5%/month. LTV = $50 / 0.05 = $1,000. LTV:CAC ratio (LTV / customer acquisition cost) should be 3:1 or higher. Payback period: months to recover CAC (CAC / ARPU). Shorter payback = faster ROI.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Subscription billing architecture spans subscription management, billing engine, payment integration, and dunning service. Subscription management handles lifecycle (create, update, cancel, reactivate). Billing engine generates invoices, calculates proration, applies discounts/taxes. Payment integration charges payment methods, handles retries, updates subscription state. Dunning service manages failed payment recovery (retry logic, notifications, suspension).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/subscription-billing/subscription-billing-architecture.svg"
          alt="Subscription Billing Architecture"
          caption="Figure 1: Subscription Billing Architecture — Subscription management, billing engine, payment integration, and dunning service"
          width={1000}
          height={500}
        />

        <h3>Subscription Management</h3>
        <p>
          Subscription data model stores subscription details. Subscription ID, customer ID, plan ID, status (trial, active, past_due, suspended, cancelled, expired). Current period start/end, trial start/end, cancelled at, cancellation reason. Payment method ID (tokenized). Quantity (seats, units). Billing frequency (weekly, monthly, annual). Next billing date. Metadata (source, campaign, sales rep).
        </p>
        <p>
          Subscription lifecycle API handles state changes. Create subscription: validate plan, set trial (if applicable), schedule first billing. Update subscription: plan change (proration), quantity change (seat add/remove), billing frequency change. Cancel subscription: immediate (refund prorated) or end of period (no refund). Reactivate subscription: restore cancelled subscription (if within window, same plan available).
        </p>
        <p>
          Subscription state machine manages transitions. States: trial → active → past_due → suspended → expired, or any state → cancelled. Transitions triggered by events (payment success, payment failure, user cancel, period end). Guards validate transitions (can&apos;t reactivate expired subscription). Actions execute side effects (send email, update access, notify accounting).
        </p>

        <h3 className="mt-6">Billing Engine</h3>
        <p>
          Invoice generation creates billing documents. Trigger: billing date reached (scheduled job). Query: all subscriptions with billing date = today. For each: calculate amount (plan price × quantity + add-ons - discounts + taxes). Create invoice (PDF, email). Schedule payment (immediate or send invoice first). Log invoice (invoice ID, amount, status). Invoice numbering: sequential (INV-001, INV-002), per-customer (CUST1-001, CUST1-002).
        </p>
        <p>
          Proration calculation handles mid-cycle changes. Input: old plan, new plan, change date, period start/end. Calculate: days remaining in period, credit (old plan unused), charge (new plan remaining). Net: charge - credit. Create proration line item on next invoice (or charge immediately). Proration policy: documented, consistent, compliant (accounting rules).
        </p>
        <p>
          Tax calculation applies correct taxes. Tax jurisdiction: based on customer location (billing address, IP address, nexus rules). Product taxability: some products exempt (education, non-profit). Tax rates: sales tax (US), VAT (EU), GST (Australia, Canada). Tax exemption: valid exemption certificate (B2B, non-profit). Integration with tax service (Avalara, TaxJar) for accurate calculation, compliance filing.
        </p>

        <h3 className="mt-6">Payment Integration</h3>
        <p>
          Recurring charge automation charges payment methods. Scheduled job: query subscriptions with billing date = today. For each: retrieve payment method (token), charge payment gateway (amount, customer ID, subscription ID). Handle response: success (update subscription, send receipt), failure (trigger dunning, notify customer). Idempotency: same subscription not charged twice (idempotency key per billing cycle).
        </p>
        <p>
          Payment method management stores and updates payment methods. Tokenization: payment method tokenized (gateway vault, PCI compliance). Multiple payment methods: primary (default), backup (retry on failure). Card updater: automatic update on card reissue (Visa VAU, Mastercard ABU, Amex SafeKey). Expiry notification: email customer before card expires (&quot;card expires in 30 days, please update&quot;).
        </p>
        <p>
          Retry logic handles payment failures. Retry schedule: day 1 (immediate retry), day 3, day 7, day 14, day 21. Max retries: 3-5 attempts. Smart retry: optimal timing based on failure reason (insufficient funds → retry near payday, card expired → wait for update). Retry notification: inform customer (&quot;we&apos;ll retry in 3 days&quot;). Recovery rate: percentage of failed payments recovered (industry average: 30-50%).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/subscription-billing/subscription-lifecycle.svg"
          alt="Subscription Lifecycle"
          caption="Figure 2: Subscription Lifecycle — States, transitions, and dunning workflow from trial to expiration"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Dunning Service</h3>
        <p>
          Dunning workflow manages failed payment recovery. Trigger: payment failure webhook from gateway. Create dunning case: subscription ID, failure reason, failure date, retry count = 0. Schedule retry: based on retry schedule (day 1, 3, 7, 14, 21). Send notification: email/SMS based on dunning stage (soft → urgent → final). Update subscription: past_due on first failure, suspended after max retries.
        </p>
        <p>
          Dunning communication templates vary by stage. Stage 1 (day 1): &quot;Payment Update Needed&quot; (friendly, assume temporary issue). Stage 2 (day 7): &quot;Subscription at Risk&quot; (urgent, consequences clear). Stage 3 (day 14): &quot;Final Notice&quot; (deadline, suspension warning). Stage 4 (day 21): &quot;Subscription Suspended&quot; (access revoked, recovery instructions). Each template includes update payment link, support contact.
        </p>
        <p>
          Dunning metrics track recovery effectiveness. Recovery rate: percentage of failed payments recovered (by stage, by failure reason). Time to recovery: average days from failure to successful payment. Churn from dunning: percentage of dunning cases that result in cancellation. Dunning cost: support tickets, manual intervention. Optimization: A/B test email copy, retry timing, grace period length.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/subscription-billing/dunning-workflow.svg"
          alt="Dunning Workflow"
          caption="Figure 3: Dunning Workflow — Payment failure, retry schedule, notifications, and suspension"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Subscription billing design involves trade-offs between recovery rate, customer experience, cash flow, and operational complexity. Understanding these trade-offs enables informed decisions aligned with business model and customer expectations.
        </p>

        <h3>Grace Period: With vs. Without</h3>
        <p>
          Grace period (subscription active during dunning). Pros: Higher recovery rate (customer retains access, motivated to update), better customer experience (no service interruption). Cons: Revenue risk (customer uses without paying), delayed churn recognition (subscription still active, not really). Best for: B2B SaaS (high LTV, trust relationship), established customers (long history, low risk).
        </p>
        <p>
          No grace period (subscription suspends on failure). Pros: No revenue risk (no free usage), clear churn signal (subscription inactive). Cons: Lower recovery rate (customer loses access, less motivated), worse customer experience (service interruption). Best for: B2C (low LTV, high volume), new customers (no history, higher risk), digital goods (easy to restrict access).
        </p>
        <p>
          Hybrid: grace period for good customers, immediate suspension for new/high-risk. Pros: Balances recovery with risk. Cons: Complexity (customer segmentation, policy enforcement). Best for: Most production systems—tiered dunning based on customer segment.
        </p>

        <h3>Proration: Immediate vs. Next Period</h3>
        <p>
          Immediate proration (change now, charge/credit now). Pros: Customer gets immediate access, accurate billing (pay for what you use). Cons: Unexpected charges (customer may not expect mid-cycle charge), complexity (proration calculation). Best for: B2B SaaS (seat changes, immediate need), usage-based (pay as you go).
        </p>
        <p>
          Next period proration (change scheduled, effective next cycle). Pros: No surprise charges, simpler (no mid-cycle calculation). Cons: Customer waits for change, may overpay/underpay for current period. Best for: B2C subscriptions (plan changes, predictable billing), annual subscriptions (change at renewal).
        </p>
        <p>
          Hybrid: immediate for upgrades (customer gets access, charged now), next period for downgrades (no credit, change at renewal). Pros: Balances customer satisfaction with revenue protection. Cons: Complexity (different policies for upgrade/downgrade). Best for: Most SaaS businesses—encourage upgrades, minimize downgrade friction.
        </p>

        <h3>Billing Frequency: Monthly vs. Annual</h3>
        <p>
          Monthly billing. Pros: Lower commitment (easier to start), predictable cash flow (monthly revenue), lower churn perception (cancel anytime). Cons: Higher churn (monthly decision point), more transactions (higher processing fees), lower LTV (shorter average lifetime). Best for: B2C, new products (low barrier to entry), price-sensitive customers.
        </p>
        <p>
          Annual billing. Pros: Lower churn (committed for year), higher LTV (longer lifetime), fewer transactions (lower processing fees), better cash flow (upfront payment). Cons: Higher commitment (harder to start), refund risk (mid-year cancellation), revenue recognition complexity (accrual over year). Best for: B2B, established products, discount incentive (10-20% off monthly).
        </p>
        <p>
          Hybrid: offer both monthly and annual (annual with discount). Pros: Customer choice, annual discount incentivizes commitment. Cons: Complexity (two billing models, proration for mid-cycle changes). Best for: Most SaaS businesses—monthly for flexibility, annual for savings.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/transactions-state/subscription-billing/billing-models.svg"
          alt="Billing Models Comparison"
          caption="Figure 4: Billing Models Comparison — Flat-rate, per-seat, usage-based, and tiered pricing"
          width={1000}
          height={450}
        />

        <h3>Retry Strategy: Aggressive vs. Conservative</h3>
        <p>
          Aggressive retry (many attempts, frequent retries). Pros: Higher recovery rate (more chances to succeed), maximizes revenue. Cons: Customer annoyance (multiple failure notifications), higher processing fees (more attempts), gateway flags (excessive retries). Best for: High LTV customers, temporary failures (insufficient funds).
        </p>
        <p>
          Conservative retry (few attempts, spaced retries). Pros: Lower customer annoyance, lower processing fees, gateway-friendly. Cons: Lower recovery rate (fewer chances), revenue loss. Best for: Low LTV customers, permanent failures (card expired, stolen).
        </p>
        <p>
          Smart retry: retry timing based on failure reason. Insufficient funds: retry near payday (day 1, 15). Card expired: wait for card updater (30 days). Gateway error: immediate retry (temporary issue). Pros: Optimizes recovery, minimizes annoyance. Cons: Complexity (failure reason classification, timing logic). Best for: Most production systems—intelligent retry based on data.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Implement dunning with grace period:</strong> Grace period for good customers (7-14 days). Retry schedule: day 1, 3, 7, 14, 21. Email notifications at each stage. Suspend after max retries. Recovery rate target: 30-50%.
          </li>
          <li>
            <strong>Use card updater services:</strong> Visa VAU, Mastercard ABU, Amex SafeKey. Automatic card update on reissue. Reduces involuntary churn (card expired, not cancelled). Enrollment automatic, opt-out available.
          </li>
          <li>
            <strong>Offer annual billing with discount:</strong> Annual option (10-20% off monthly). Improves cash flow (upfront payment). Reduces churn (committed for year). Show monthly equivalent (&quot;$10/month billed annually&quot;).
          </li>
          <li>
            <strong>Implement proration for plan changes:</strong> Immediate proration for upgrades (access now, charge now). Next period for downgrades (no credit, change at renewal). Document proration policy (customer expectations).
          </li>
          <li>
            <strong>Send invoice before charge:</strong> Invoice email 1-3 days before charge. Customer knows amount, date. Reduces disputes (&quot;I didn&apos;t authorize this&quot;). B2B requirement (accounts payable needs invoice).
          </li>
          <li>
            <strong>Track subscription metrics:</strong> MRR (monthly recurring revenue). Churn rate (customer, revenue). LTV (lifetime value). Dunning recovery rate. Dashboard for visibility, alerts for anomalies.
          </li>
          <li>
            <strong>Implement self-service management:</strong> Customer portal (plan changes, payment method update, cancellation). Reduces support tickets. Customer control (better experience). Cancellation flow with retention offers.
          </li>
          <li>
            <strong>Handle tax compliance:</strong> Tax calculation by jurisdiction (sales tax, VAT, GST). Exemption handling (B2B, non-profit). Integration with tax service (Avalara, TaxJar). Compliance filing (automated or manual).
          </li>
          <li>
            <strong>Implement revenue recognition:</strong> Accrual accounting (ASC 606). Recognize revenue over subscription period (not upfront). Deferred revenue liability (unearned revenue). Integration with accounting system (QuickBooks, Xero, NetSuite).
          </li>
          <li>
            <strong>Monitor payment failures:</strong> Track failure reasons (expired, insufficient funds, fraud). Alert on failure rate spikes (gateway issue, fraud attack). Analyze by card type, issuer, geography. Optimize retry strategy based on data.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No dunning management:</strong> Failed payments not retried, silent churn. Solution: Implement dunning workflow, retry schedule, customer notifications.
          </li>
          <li>
            <strong>No grace period:</strong> Immediate suspension on failure, lost recovery opportunity. Solution: Grace period for good customers (7-14 days), immediate for new/high-risk.
          </li>
          <li>
            <strong>No card updater:</strong> Card expires, subscription cancels (involuntary churn). Solution: Enroll in VAU/ABU/SafeKey, automatic card updates.
          </li>
          <li>
            <strong>No proration:</strong> Plan changes only at period end, customer frustration. Solution: Immediate proration for upgrades, next period for downgrades.
          </li>
          <li>
            <strong>No invoice before charge:</strong> Customer surprised by charge, disputes. Solution: Send invoice 1-3 days before charge, clear amount and date.
          </li>
          <li>
            <strong>No metrics tracking:</strong> Churn, MRR, recovery rate unknown. Solution: Track subscription metrics, dashboard, alerts for anomalies.
          </li>
          <li>
            <strong>No self-service:</strong> All changes via support, high ticket volume. Solution: Customer portal (plan changes, payment update, cancellation).
          </li>
          <li>
            <strong>No tax compliance:</strong> Incorrect taxes, compliance risk. Solution: Tax service integration, jurisdiction calculation, exemption handling.
          </li>
          <li>
            <strong>No revenue recognition:</strong> Recognize upfront (incorrect), audit risk. Solution: Accrual accounting, recognize over period, deferred revenue.
          </li>
          <li>
            <strong>No failure analysis:</strong> Payment failures not analyzed, missed optimization. Solution: Track failure reasons, analyze by card/issuer, optimize retry.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Netflix Subscription Billing</h3>
        <p>
          Netflix billing: monthly recurring charges, multiple plans (basic, standard, premium). Proration for plan changes (immediate, credit for unused). Dunning: payment failure → retry → suspend (no grace period, immediate). Card updater for expired cards. Self-service: plan changes, payment update, cancellation. No annual option (monthly only).
        </p>

        <h3 className="mt-6">Salesforce B2B SaaS Billing</h3>
        <p>
          Salesforce billing: per-seat pricing, annual contracts. Proration for seat changes (immediate, credit/charge). Invoice before charge (B2B requirement). Payment terms (net 30, net 60). Dunning: payment failure → notify → escalate (account manager). Self-service: seat changes, payment update. Cancellation: contract terms, early termination fee.
        </p>

        <h3 className="mt-6">Spotify Freemium to Premium</h3>
        <p>
          Spotify billing: freemium (free tier) → premium (paid tier). Free trial (30 days premium, no charge). Trial → active: automatic charge (no reminder). Dunning: payment failure → retry → suspend (7-day grace). Self-service: plan changes, payment update, cancellation. Student discount (verified, annual recertification).
        </p>

        <h3 className="mt-6">Box Cloud Storage Billing</h3>
        <p>
          Box billing: per-user, per-month. Tiers (personal, business, enterprise). Proration for user changes (immediate, credit/charge). Overage charges (storage over limit). Annual discount (10-20% off). Dunning: payment failure → retry → suspend (14-day grace). Self-service: user changes, payment update, cancellation.
        </p>

        <h3 className="mt-6">Amazon Prime Membership</h3>
        <p>
          Amazon Prime: annual or monthly billing. Annual discount (~$139/year vs. $14.99/month). Free trial (30 days). Auto-renewal (annual or monthly). Proration: cancellation mid-year (refund prorated). Dunning: payment failure → retry → cancel (no grace, annual upfront). Self-service: plan changes, payment update, cancellation.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle failed subscription payments?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Dunning workflow: payment failure → retry schedule (day 1, 3, 7, 14, 21) → notifications (email/SMS at each stage) → suspend after max retries. Grace period for good customers (7-14 days, retain access). Card updater for expired cards. Recovery rate target: 30-50%. Track failure reasons (expired, insufficient funds, fraud) for optimization.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you calculate proration for plan changes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Proration = credit for unused time on old plan + charge for remaining time on new plan. Example: monthly plan ($30/month), upgrade on day 15 to $50/month. Credit: $30 × 15/30 = $15. Charge: $50 × 15/30 = $25. Net: $10. Policy: immediate for upgrades (access now, charge now), next period for downgrades (no credit, change at renewal).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you reduce involuntary churn?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Card updater services (VAU, ABU, SafeKey) for expired cards. Dunning with grace period (retry failed payments). Expiry notifications (&quot;card expires in 30 days&quot;). Multiple payment methods (primary + backup). Smart retry (timing based on failure reason). Self-service payment update (customer portal). Target: reduce involuntary churn from 20-25% to 5-10%.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle subscription metrics?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> MRR = sum of all active subscription monthly values. Churn rate = cancellations / active customers (customer churn) or churn MRR / total MRR (revenue churn). LTV = ARPU / churn rate. Track MRR movements (new, expansion, contraction, churn). Dashboard for visibility, alerts for anomalies (churn spike, MRR decline). Cohort analysis (churn by signup month).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement revenue recognition for subscriptions?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Accrual accounting (ASC 606). Recognize revenue over subscription period (not upfront). Annual subscription: $1,200 upfront → $100/month recognized. Deferred revenue liability (unearned revenue). Monthly journal entry: debit deferred revenue, credit revenue. Integration with accounting system (QuickBooks, Xero, NetSuite). Compliance: audit trail, revenue schedules.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle subscription cancellation?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Self-service cancellation (customer portal). Cancellation flow: reason survey (too expensive, not using, switched), retention offer (discount, pause), confirm cancellation. Access until period end (prepaid) or immediate (refund prorated). Cancellation logged (timestamp, reason, retention offer result). Win-back campaign (30-60 days later, special offer).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://stripe.com/docs/billing/subscriptions/overview"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stripe — Subscription Billing Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.chargebee.com/docs/2.0/subscriptions.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chargebee — Subscription Management Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.fasb.org/standards/asc-606"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FASB — ASC 606 Revenue Recognition
            </a>
          </li>
          <li>
            <a
              href="https://www.profitwell.com/recur/all/subscription-metrics"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ProfitWell — Subscription Metrics Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.recurly.com/publish/dunning/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Recurly — Dunning Management Best Practices
            </a>
          </li>
          <li>
            <a
              href="https://www.visa.com/en_us/support/business/accept-visa/visa-account-updater.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visa — Visa Account Updater (VAU)
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
