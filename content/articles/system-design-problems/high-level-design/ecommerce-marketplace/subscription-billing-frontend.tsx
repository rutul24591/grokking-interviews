"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-subscription-billing-frontend",
  title: "Design a Subscription Billing Frontend",
  description:
    "Architecture for a subscription billing frontend: plan selection UI with feature comparison, trial-to-paid conversion flow, payment method management with PCI DSS compliance, subscription state machine (active/paused/cancelled/past_due), proration calculation for plan upgrades, dunning management for failed payments, invoice history, usage-based billing meter UI, and webhook-driven UI state sync.",
  category: "high-level-design",
  subcategory: "ecommerce-marketplace",
  slug: "subscription-billing-frontend",
  wordCount: 4900,
  readingTime: 30,
  lastUpdated: "2026-05-11",
  tags: ["hld", "billing", "subscription", "pci-dss", "dunning", "proration", "payment", "stripe"],
  relatedTopics: ["cart-checkout-concurrency", "dynamic-pricing-ui"],
};

export default function SubscriptionBillingFrontendArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <p>A subscription billing frontend is more complex than a one-time checkout because the financial relationship is ongoing: the user's payment method is charged repeatedly, the plan can change (upgrade, downgrade, pause, cancel), and failed charges trigger a recovery flow (dunning) that the user must interact with to restore service. The frontend must faithfully represent this ongoing relationship — showing the user their current plan, next billing date, what they will be charged, and what happens if they cancel.</p>
        <p>PCI DSS compliance is the first major constraint. The frontend must never handle raw card numbers — if a card number is ever passed through the application server, the server becomes PCI DSS in-scope, which triggers a massive compliance burden. The solution is to use a payment provider's hosted JavaScript SDK (Stripe Elements, Braintree Hosted Fields) where the card input field is an iframe served from the payment provider's domain. The card data flows directly from the user's browser to the payment provider; the application server receives only a token (a short-lived, single-use identifier for the saved payment method). The application server never sees the card number.</p>
        <p><strong>Explicit scope:</strong> Plan selection, trial flow, payment method management, subscription lifecycle (upgrade/downgrade/pause/cancel), dunning, invoice history, and usage-based billing meter. Not in scope: the billing engine itself (Stripe/Chargebee are treated as external services), tax calculation, or multi-currency conversion.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Plan selection:</strong> Feature comparison table across plans (Free, Pro, Enterprise). Dynamic pricing display (monthly/annual toggle with annual discount). CTA leading to checkout or free trial activation.</li>
          <li><strong>Trial flow:</strong> Free trial activation (no credit card required or card required based on plan). Trial expiry countdown in the app header ("7 days left in your trial"). Upgrade prompt at trial end.</li>
          <li><strong>Subscription management:</strong> Current plan display with next billing date and amount. Plan upgrade (immediate, prorated) and downgrade (effective at next billing cycle). Pause subscription (suspend billing for 1–3 months). Cancel (immediate or end-of-period). Reactivation after cancel or expiry.</li>
          <li><strong>Payment methods:</strong> Add new card (Stripe Elements iframe). Set default payment method. Remove payment method (with validation that at least one valid method remains for active subscriptions). Update billing address.</li>
          <li><strong>Dunning:</strong> When a charge fails (expired card, insufficient funds), display a banner in the app UI ("Your subscription is past due — update your payment method to restore access"). Countdown to service suspension. Allow updating payment method and retrying charge inline.</li>
          <li><strong>Invoices:</strong> List of past invoices with date, amount, status (paid/void/uncollectible). Download PDF. View line items (base plan, usage charges, credits, taxes).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>PCI DSS:</strong> Card data must never touch the application server. All card collection via provider-hosted iframe (Stripe Elements).</li>
          <li><strong>Subscription state freshness:</strong> The UI must reflect subscription state changes (upgrade confirmed, payment failed, trial expired) within 30 seconds of the event. State driven by webhooks from the billing provider, not by polling.</li>
          <li><strong>Idempotency:</strong> Duplicate upgrade/cancel requests (network retry, double submit) must not result in double charges or double cancellations.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <p>The billing frontend communicates with a Billing API layer (application-owned) that wraps the payment provider (Stripe/Chargebee) API. The application never calls Stripe directly from the frontend (doing so would require exposing secret API keys in JavaScript). Instead, the frontend calls the application's Billing API, which calls Stripe server-side. Subscription state is stored in the application database and kept in sync with Stripe via webhooks: when Stripe fires a subscription.updated, invoice.payment_failed, or customer.subscription.deleted webhook, the application updates its local subscription record and publishes a SubscriptionStateChanged event that triggers a WebSocket/SSE push to connected clients. This webhook-driven synchronization ensures the UI reflects billing provider state within seconds, not minutes.</p>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/subscription-billing-frontend.svg"
          alt="Subscription billing frontend architecture showing PCI DSS compliant payment collection (Stripe Elements iframe card input direct to Stripe card data never touches app server; app receives payment_method_id token only; Billing API wraps Stripe server-side API never exposes secret keys to frontend), subscription state machine (TRIALING → ACTIVE on payment → PAST_DUE on charge failure 3 retries dunning → CANCELED on explicit cancel or non-payment → PAUSED on pause request 1-3 months → UNPAID suspension; each state transition webhook-driven Stripe webhook → app webhook handler → update DB → WebSocket push to frontend within 30s), plan management UI (plan comparison table monthly/annual toggle; upgrade: immediate + proration calculation days_remaining/billing_period * (new_price - old_price); downgrade: scheduled for next cycle; upgrade confirmation dialog shows exact proration amount; idempotency key prevents double upgrade), dunning flow (invoice.payment_failed webhook → set past_due status → send email + in-app banner countdown to suspension date; user clicks Update Payment Method → Stripe Elements card input → new payment_method_id → POST /billing/retry-charge → success restores ACTIVE; max 3 auto-retries on days 1 3 7 then dunning), invoice history (Stripe invoices API: list invoices pagination cursor; PDF download via Stripe hosted invoice URL signed; line items: base plan + usage charges + credits + taxes; status paid/void/uncollectible), usage-based billing meter (per-cycle usage counter Redis INCRBY on each metered action; batch sync to Stripe Usage Records API every hour; metered UI: progress bar current vs plan limit; overage price display; upgrade prompt at 80% usage), trial expiry (countdown banner days_left = trial_end - now; CTA upgrade prompt; at T=0 webhook customer.subscription.trial_will_end → show paywall; no card on file → require payment method to continue)."
          caption="PCI DSS compliant payment collection (Stripe Elements iframe, token-only to app server), subscription state machine (webhook-driven transitions within 30s), proration calculation for upgrades, dunning flow (3 retry attempts, in-app banner, inline card update), usage-based billing meter, invoice history, and trial expiry countdown"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">PCI DSS Compliant Card Collection</h3>
        <p>Stripe Elements renders card input fields in iframes served from Stripe&apos;s domain (js.stripe.com). From the browser&apos;s security model perspective, the iframe&apos;s content is isolated from the parent page, the application&apos;s JavaScript cannot read the card number typed into the iframe. When the user submits the payment form, the application calls stripe.confirmSetup() (for saving a card without immediate charge) or stripe.confirmPayment() (for immediate charge). Stripe&apos;s SDK communicates directly with Stripe&apos;s servers to tokenize the card. The result is a PaymentMethod ID (pm_xxxx) returned to the application&apos;s JavaScript. The application sends only this token to its Billing API server: POST /billing/payment-methods {"{ paymentMethodId: \"pm_xxxx\" }"}. The Billing API attaches the payment method to the Stripe customer and saves the Stripe payment method ID in the application database. The application never handles, stores, or transmits the card PAN (Primary Account Number).</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Subscription State Machine</h3>
        <p>The application maintains its own subscription state table (not relying solely on Stripe's state) because the application needs to make authorization decisions (is this user allowed to access feature X?) in milliseconds, and calling Stripe's API on every request would add 100–200ms of latency. The local state table is a shadow of Stripe's state, synchronized via webhooks. Relevant Stripe webhooks: customer.subscription.created (new subscription), customer.subscription.updated (plan change, status change), customer.subscription.deleted (cancellation), invoice.payment_failed (charge failure), invoice.payment_succeeded (renewal success), customer.subscription.trial_will_end (3 days before trial ends). Each webhook handler: (1) validates the webhook signature (Stripe-Signature header), (2) updates the local subscription record (status, current_period_end, plan_id, payment_status), (3) publishes a SubscriptionStateChanged event to a Redis Pub/Sub channel, (4) the real-time service (WebSocket/SSE) pushes the update to the connected client within seconds. This ensures the UI reflects billing events promptly — a failed renewal payment triggers the dunning banner within 30 seconds, not on the user's next page load.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Proration for Plan Changes</h3>
        <p>When a user upgrades mid-cycle (e.g., upgrades from $10/month to $30/month on day 15 of a 30-day cycle), the user owes the prorated difference for the remaining 15 days plus the full price for the next cycle. Proration calculation: prorated_amount = (new_price - old_price) × (days_remaining / days_in_period). In this example: ($30 - $10) × (15/30) = $10 immediate charge, then $30/month going forward. Stripe handles proration automatically when proration_behavior=&apos;create_prorations&apos; is set on the subscription update call. The frontend shows the user the exact proration amount before they confirm the upgrade: a &quot;Preview upgrade&quot; API call (POST /billing/preview-upgrade {"{ newPlanId }"}) calls Stripe&apos;s upcoming invoice API and returns the itemized charges. The user sees &quot;You&apos;ll be charged $10 now for the remainder of this period, then $30/month starting on [date]&quot; before clicking Confirm. Idempotency: the upgrade request includes an idempotency key (userId + newPlanId + timestamp_bucket, where timestamp_bucket rounds to the nearest 30 seconds), retrying the same upgrade within 30 seconds returns the cached result, preventing double upgrades.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Dunning Flow</h3>
        <p>When a charge fails (invoice.payment_failed webhook), the subscription enters PAST_DUE state. Stripe automatically retries the charge on a configurable schedule (typically day 1, 3, 7 after first failure — "smart retries" that target times when payment networks report lower decline rates). The application's dunning UI: (1) A full-width warning banner appears in the app header: "Your subscription is past due. Update your payment method to avoid losing access. [Update now]" (2) A countdown shows days until service suspension (configurable, typically 14 days after first failure). (3) Clicking "Update now" opens an inline card update modal (Stripe Elements, same PCI-compliant pattern). On saving a new card, the application calls POST /billing/retry-charge, which calls Stripe's invoice.pay() API. If the retry succeeds, the subscription returns to ACTIVE and the banner disappears (driven by the invoice.payment_succeeded webhook). If all retries fail and the suspension deadline passes, the subscription moves to UNPAID/CANCELED and a paywall is shown instead of the application content.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Usage-Based Billing Meter</h3>
        <p>For plans with metered usage (e.g., $0.10 per API call after 1000 included calls), the frontend must show the user their current usage to avoid surprise charges. Usage tracking: each metered action (API call, file upload, AI generation) increments a Redis counter (INCRBY usage:{"{userId}"}:{"{month}"} 1). A background job syncs the Redis counter to Stripe&apos;s Usage Records API every hour (POST /v1/subscription_items/{"{id}"}/usage_records {"{ quantity: delta, action: 'increment' }"}). The billing page shows: a progress bar (current_usage / included_quota), an overage calculator (how much the overage will cost based on current trajectory), and the expected invoice total for the current period. An upgrade prompt is shown proactively at 80% usage (&quot;You&apos;ve used 800 of 1,000 included API calls. Upgrade to Pro for 10,000 calls/month at no overage&quot;). This reduces bill shock by surfacing usage information before the cycle ends, at the moment the user is most motivated to upgrade.</p>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <p>Local subscription state versus Stripe as source of truth: maintaining a local subscription state table (synchronized via webhooks) adds complexity (webhook delivery failures, retry handling, duplicate webhook processing) but enables fast authorization checks without Stripe API calls on every request. The alternative — calling Stripe's API on every request to check subscription status — adds 100–200ms per request and creates a hard dependency on Stripe's availability (if Stripe's API is slow, every page load in the application is slow). The webhook-driven local shadow is the standard industry practice; the key is handling webhook delivery failures by implementing idempotent webhook handlers and periodically reconciling local state against Stripe's API for any missed events.</p>
        <p>Trial with versus without credit card: requiring a credit card at trial signup reduces spam/abuse (low-intent users don't bother entering card details) and improves trial-to-paid conversion (the payment method is already saved, making the upgrade frictionless). However, it significantly reduces trial signup volume — many users bounce at the card entry step. The industry data shows opposite effects depending on the product: B2B SaaS typically benefits from requiring a card (higher-quality leads, better conversion), while consumer products see significant signup loss. The decision should be A/B tested; the architecture must support both modes (the trial activation API accepts an optional paymentMethodId parameter).</p>
      </section>

      <section>
        <h2>Summary</h2>
        <p>A subscription billing frontend is built around three non-negotiable constraints: PCI DSS compliance (Stripe Elements iframe — card data never touches the app server, app receives payment_method_id token only), webhook-driven state synchronization (Stripe webhooks → app DB → Redis Pub/Sub → WebSocket push, subscription state reflected in UI within 30 seconds), and idempotency (all billing operations include idempotency keys to prevent double-charges on network retry). The subscription state machine (TRIALING → ACTIVE → PAST_DUE → CANCELED/UNPAID) is maintained locally for low-latency authorization checks. Plan upgrades show exact proration via Stripe's upcoming invoice preview API before confirmation. Dunning uses a progressive in-app banner with countdown-to-suspension and inline card update. Usage-based billing exposes a real-time meter (Redis counter → hourly Stripe sync) with an upgrade prompt at 80% quota. The defining architectural pattern: never trust the frontend for billing state — all mutations go through the Billing API to Stripe, and UI state is driven entirely by webhook-triggered pushes from the server.</p>
      </section>
    </ArticleLayout>
  );
}
