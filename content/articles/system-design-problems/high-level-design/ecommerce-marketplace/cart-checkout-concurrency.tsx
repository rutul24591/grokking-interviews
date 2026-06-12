"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-cart-checkout-concurrency",
  title: "Design Cart and Checkout Concurrency",
  description: "Principal-level ecommerce and marketplace system design covering catalog, inventory, pricing, checkout, subscriptions, returns, fraud, reconciliation, and operational recovery.",
  category: "high-level-design",
  subcategory: "ecommerce-marketplace",
  slug: "cart-checkout-concurrency",
  wordCount: 3500,
  readingTime: 21,
  lastUpdated: "2026-05-29",
  tags: ["hld", "ecommerce", "marketplace", "checkout", "inventory", "payments"],
  relatedTopics: [],
};

const definition = [
  "Design Cart and Checkout Concurrency is a commerce correctness system wrapped in a shopping experience. A principal-ready design treats cart and checkout concurrency as a coordinated set of catalog, pricing, inventory, payment, order, fulfillment, fraud, and support workflows rather than a collection of product cards.",
  "The hardest part is that the user-facing promise is assembled from many independently changing facts: product availability, seller status, delivery promise, promotion eligibility, payment authorization, tax, shipping, subscription entitlement, and return/refund policy.",
  "The design must define which state is authoritative and which state is a projection. Catalog pages, recommendations, facet counts, delivery estimates, and tracking views can lag. Payment, order creation, inventory reservation, subscription entitlement, and refund/return decisions require stronger server-side consistency and auditability.",
  "Marketplaces are adversarial. Sellers can manipulate listings, buyers can abuse returns, bots can attack flash sales, promotion rules can be exploited, and recommendation systems can amplify low-quality inventory. Abuse controls are part of the architecture.",
  "A staff/principal answer should explain how the system handles scale events, provider failures, stale inventory, duplicate checkout attempts, fraud/risk review, customer support reconstruction, and rollback after bad pricing, promotion, or recommendation changes."
];
const concepts = [
  "The first concept is promise integrity. cart snapshot, price validation, and inventory hold produce the promise shown to the customer, but final purchase or refund decisions must revalidate authoritative state.",
  "The second concept is idempotent commerce intent. Add-to-cart, quote, reserve, pay, place order, cancel, return, refund, and subscription change should converge under retries, double-clicks, browser refresh, provider callbacks, and mobile reconnect.",
  "The third concept is inventory and price freshness. Read surfaces can use cached or eventually consistent data, but checkout and refunds need fresh validation with explicit handling when the promise changes.",
  "The fourth concept is lifecycle state. Cart, quote, hold, payment intent, order, shipment, return, refund, subscription, and entitlement each need explicit states, expiry, transition history, and support visibility.",
  "The fifth concept is risk and policy. Fraud scoring, seller trust, return abuse, promotion eligibility, payment risk, regulatory constraints, and marketplace policy should influence flows without making the UI opaque.",
  "The sixth concept is observability. Track conversion, quote mismatch, inventory hold failure, payment pending duration, refund latency, recommendation quality, pricing rollback, carrier lag, and support contact rate."
];
const architecture = [
  "The architecture contains cart snapshot, price validation, inventory hold, payment intent, order finalizer. Read APIs serve fast browse and discovery views. Transaction APIs own authoritative quote, reservation, payment, order, entitlement, and refund transitions. Event streams drive search, recommendations, notifications, analytics, and support timelines.",
  "Every transaction should start from a durable intent: cart snapshot, pricing quote, inventory hold, payment intent, subscription change request, or return authorization. The UI renders that intent and its current state rather than inventing completion locally.",
  "The system should use versioned source facts. Catalog version, price quote version, promotion version, inventory hold ID, payment provider ID, tax/shipping quote, return policy version, and entitlement version allow support and reconciliation to explain outcomes.",
  "Browse surfaces can degrade gracefully. If recommendations fail, show popular or editorial products. If facets lag, show primary results. If delivery estimate is stale, mark it as estimate and revalidate before checkout.",
  "Transactional surfaces should fail safely. Checkout should not double-charge. Dynamic pricing should not show one price and capture another without explanation. Subscription changes should not grant or remove entitlement without durable billing state.",
  "Operations need controls for promotion rollback, pricing kill switch, recommendation demotion, inventory hold release, payment provider failover, refund retry, return fraud review, and customer-visible incident messaging."
];
const tradeoffs = [
  "Caching catalog and listing data improves latency and cost, but stale data can mislead users. The defensible design caches browse state while revalidating price, stock, eligibility, and delivery at transaction boundaries.",
  "Early inventory holds reduce customer disappointment but can reduce inventory utilization and enable hoarding. Late holds improve utilization but increase checkout failure. TTL-based holds at review/payment are usually the compromise.",
  "Personalized recommendations improve conversion but can conflict with business constraints such as inventory health, fairness, ads, seller quality, and safety. Ranking needs guardrails beyond click-through rate.",
  "Dynamic pricing can improve marketplace efficiency but can reduce trust if explanations, quote TTLs, and audit trails are weak. Users should understand whether a price is locked, estimated, personalized, or expired.",
  "Synchronous payment/order completion gives simple UX but breaks when payment providers and banks are asynchronous. Pending states and webhook-driven completion are more reliable, with a more complex UI.",
  "Strict fraud controls reduce loss but create false positives and conversion loss. Risk-based step-up, review queues, and appeal/support flows are better than a single hard threshold."
];
const practices = [
  "Represent commerce workflows as state machines: quote, reserve, authorize, confirm, fulfill, return, refund, renew, cancel, dispute, and reconcile.",
  "Use deterministic idempotency keys for cart mutations, payment attempts, order finalization, subscription changes, refund requests, and return authorizations.",
  "Keep payment and sensitive data out of product JavaScript where possible. Use hosted fields, tokenization, webhook verification, and redacted logs.",
  "Expose truthful UI states: estimate, locked quote, pending payment, inventory hold expired, under review, refund processing, return approved, carrier delayed, or entitlement pending.",
  "Build support reconstruction views. Operators need cart snapshot, quote, hold, payment, order, shipment, return, refund, entitlement, provider callback, and customer notification history.",
  "Design rollback and kill switches for prices, promotions, recommendations, inventory reservations, payment providers, subscription entitlement rules, and return workflows.",
  "Instrument by seller, item, category, payment rail, region, delivery method, promotion, risk bucket, and app version. Commerce incidents are rarely evenly distributed."
];
const pitfalls = [
  "double submit is a product trust failure. It should be handled through authoritative validation, explicit state, and support-visible history instead of silent UI correction.",
  "price drift often appears when browse projections are used as transaction truth. The system should treat cached results as hints, not final commitments.",
  "expired hold requires user-facing recovery. The UI should explain what changed and offer safe next actions rather than forcing a generic retry.",
  "order without payment needs operational tooling. Manual database repair is not an acceptable support workflow for money, inventory, entitlement, or returns.",
  "Another pitfall is optimizing only conversion. Commerce designs also need fraud loss, refund rate, return abuse, support contacts, seller fairness, accessibility, and long-term trust metrics.",
  "Teams also forget regional and regulatory differences. Tax, payment methods, return windows, data retention, invoice rules, and consumer protection obligations vary by market."
];
const useCases = [
  "guest checkout requires browse speed, transactional correctness, risk controls, and support reconstruction to work together.",
  "multi-tab cart requires browse speed, transactional correctness, risk controls, and support reconstruction to work together.",
  "flash sale checkout requires browse speed, transactional correctness, risk controls, and support reconstruction to work together.",
  "During a flash sale, the system should throttle bots, use inventory holds, show truthful scarcity, protect checkout idempotency, and degrade nonessential widgets.",
  "During a bad price or promotion rollout, operators should stop the rule, identify affected quotes and orders, decide honor/cancel policy, notify customers, and preserve audit evidence.",
  "During a provider outage, the UI should show pending or alternate payment options where safe, avoid duplicate captures, and reconcile late callbacks."
];
const questions = [
  {
    "question": "How would you design cart and checkout concurrency end to end?",
    "answer": "I would separate fast browse projections from authoritative transaction workflows. Browse uses catalog, search, recommendations, and cached availability. Transaction boundaries create durable intents for quote, inventory hold, payment, order, entitlement, return, or refund. The backend owns validation, idempotency, risk, ledger/order state, and support history. The UI renders truthful states and safe recovery actions."
  },
  {
    "question": "Why this architecture over directly using catalog/search data for checkout or returns?",
    "answer": "Catalog and search projections are optimized for discovery, not correctness. They can be stale or policy-filtered differently. Checkout, subscription, and returns require fresh authoritative validation and durable transition history. The trade-off is more backend complexity, but it prevents oversell, double charge, bad entitlement, and refund disputes."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are double submit, price drift, expired hold, order without payment, plus flash-sale bot traffic, hot SKUs, provider outages, promotion bugs, fraud rings, recommendation drift, and support overload. Prevention requires cache strategy, authoritative revalidation, idempotency, holds, risk controls, staged rollout, and operational kill switches."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Browse, search, recommendations, facet counts, tracking projections, and analytics can be eventually consistent with freshness indicators. Price capture, inventory hold, payment, order creation, subscription entitlement, refund approval, and return authorization need strong server-owned state and audit. The answer should classify each commerce state explicitly."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled with pending states, idempotent retries, provider callbacks, reconciliation, and support timelines. Rollback uses price/promotion kill switches, recommendation demotion, entitlement correction, refund/reversal, or compensating transactions. Abuse controls include bot defense, risk scoring, rate limits, and return fraud review. Privacy requires redacted payment and customer data. Cost is controlled through caching, async projections, and telemetry sampling. Observability tracks conversion, mismatch, pending, refund, risk, and support metrics."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would defend eventual consistency for browse because it improves latency and cost, but not for money, entitlement, inventory reservation, or refund decisions. I would defend TTL holds because they balance utilization and correctness. I would defend pending payment states because external rails are asynchronous and duplicate charges are worse than waiting."
  }
];
const references = [
  {
    "label": "Stripe PaymentIntents documentation",
    "href": "https://docs.stripe.com/payments/payment-intents"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  },
  {
    "label": "Elasticsearch guide",
    "href": "https://www.elastic.co/guide/index.html"
  },
  {
    "label": "PCI Security Standards Council",
    "href": "https://www.pcisecuritystandards.org/"
  },
  {
    "label": "Shopify engineering blog",
    "href": "https://shopify.engineering/"
  },
  {
    "label": "AWS architecture blog",
    "href": "https://aws.amazon.com/blogs/architecture/"
  }
];

export default function CartCheckoutConcurrencyArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design Cart and Checkout Concurrency around inventory correctness, price consistency, checkout safety, personalization, trust, and conversion under load. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: users must never be misled about payable price, inventory state, order state, or payment completion.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design Cart and Checkout Concurrency, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>{concepts.map((item, index) => index === 2 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: reservation model, pricing source of truth, payment idempotency, cart consistency, recommendation isolation, and order recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/cart-checkout-concurrency.svg" alt="Design Cart and Checkout Concurrency architecture" caption="Architecture view: browse projections, transaction state, risk controls, support history, and operational boundaries." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/cart-checkout-concurrency-flow.svg" alt="Design Cart and Checkout Concurrency flow" caption="Flow view: user intent, validation, hold or quote, payment/order/refund state, and recovery." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/ecommerce-marketplace/cart-checkout-concurrency-operations.svg" alt="Design Cart and Checkout Concurrency operations" caption="Operations view: stale data, provider failure, fraud, rollback, reconciliation, and support reconstruction." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: checkout conversion, payment failure rate, reservation expiry, price mismatch, cart mutation conflicts, and order-status freshness.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: oversell, stale price, double charge, abandoned checkout, inconsistent return state, and personalization delaying critical path.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}
