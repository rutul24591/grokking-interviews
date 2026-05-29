"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-payment-gateway-integration-ui",
  title: "Design a Payment Gateway Integration UI",
  description: "Principal-level payments and fintech system design covering idempotency, ledger correctness, reconciliation, provider failures, fraud, privacy, compliance, and operations.",
  category: "high-level-design",
  subcategory: "payments-fintech-systems",
  slug: "payment-gateway-integration-ui",
  wordCount: 3500,
  readingTime: 21,
  lastUpdated: "2026-05-29",
  tags: ["hld", "payments", "fintech", "ledger", "fraud", "reconciliation"],
  relatedTopics: [],
};

const definition = [
  "Design a Payment Gateway Integration UI is a correctness-critical financial system. A principal-ready answer treats a payment gateway integration UI as an audited state machine around money movement, risk, reconciliation, and user trust, not as a payment button or table UI.",
  "The design must separate user-facing status from authoritative financial truth. Providers, banks, wallets, ledgers, risk systems, and webhooks can disagree temporarily. The UI should help users and operators understand pending, succeeded, failed, reversed, disputed, and reconciled states without creating duplicate actions.",
  "Financial systems require idempotency, durable state transitions, auditability, privacy, compliance, fraud controls, and operational repair. Ambiguous outcomes are normal: a provider times out after charging, a bank callback arrives late, a webhook retries, or a user closes the browser after authorization.",
  "The architecture should define what is authoritative. The product ledger should be the internal source of financial truth, provider status is external evidence, and analytics dashboards are derived views. Reconciliation exists because these sources can drift.",
  "A staff/principal answer should explain failure handling, rollback limits, and support tooling. Money movement is often irreversible or externally controlled, so rollback may mean compensating transactions, refunds, holds, disputes, or manual review rather than deleting state."
];
const concepts = [
  "The first concept is payment intent. checkout intent captures actor, amount, currency, merchant, idempotency key, risk context, provider, expiry, and state before external payment work begins.",
  "The second concept is ledger correctness. ledger writer should use append-only entries or clearly audited state transitions. Mutable balances without event history are not defensible in a principal interview.",
  "The third concept is idempotency across boundaries. User retries, browser refreshes, provider retries, bank callbacks, and webhook replay must converge on one logical payment, refund, or risk decision.",
  "The fourth concept is reconciliation. Provider statements, bank settlement files, internal ledger entries, refunds, chargebacks, and adjustments need scheduled comparison and exception workflows.",
  "The fifth concept is risk and compliance. Fraud scoring, velocity checks, sanctions or policy rules, PCI boundaries, PII minimization, and audit trails are product architecture concerns.",
  "The sixth concept is observability. Track authorization rate, pending duration, webhook lag, provider error rate, duplicate suppression, reconciliation breaks, refund latency, chargeback rate, fraud precision, and manual review SLA."
];
const architecture = [
  "The architecture contains checkout intent, payment provider adapter, risk service, ledger writer, webhook processor. The user starts an intent. The payment or risk adapter calls external rails. The ledger records internal state. Webhook or callback processors update evidence. Reconciliation compares internal and external truth. The UI renders state and safe next actions.",
  "Every externally visible operation should be idempotent. Create payment, confirm, cancel, refund, retry, risk decision, and manual adjustment all need stable keys and persisted outcomes. The user should not be asked to pay again when the backend is merely uncertain.",
  "The frontend should show truthful financial states: pending authorization, requires action, processing, succeeded, failed retryable, failed permanent, refunded, disputed, under review, or reconciled. Generic spinners create duplicate payments and support tickets.",
  "Risk decisions should be asynchronous when needed. Low-risk payments can proceed immediately; medium-risk payments may require step-up or 3DS; high-risk cases can be held for review. The UI should preserve the user's intent and explain the next step safely.",
  "Reconciliation and support tools are part of the architecture. Operators need to inspect intent, provider request, provider response, webhook history, ledger entries, settlement status, refund state, dispute state, and user-visible notifications.",
  "Security boundaries matter. Card data should stay with provider-hosted fields or tokenization. Sensitive financial metadata should be redacted from logs, analytics, support views, and client-side telemetry."
];
const tradeoffs = [
  "Synchronous confirmation gives a clean UX but fails when external rails are slow or ambiguous. Asynchronous confirmation is operationally safer but requires pending states, polling, notifications, and support visibility.",
  "Provider abstraction reduces vendor lock-in and centralizes idempotency, webhooks, and error mapping. The downside is that providers differ in subtle state semantics, so the abstraction must not erase important differences.",
  "Failing closed protects money and compliance but can reduce conversion during provider issues. Failing open is rarely acceptable for financial correctness. A mature system degrades noncritical analytics or recommendations, but not ledger writes or risk enforcement.",
  "Aggressive fraud blocking reduces losses but increases false positives and user friction. Risk-based review, step-up authentication, and appeal workflows are better than one global threshold.",
  "Real-time reconciliation improves operational awareness but costs more and can create noise from transient provider delays. Batch reconciliation is cheaper but detects issues later. Critical rails may need both.",
  "Detailed financial logs help forensics but create privacy and compliance risk. Logs should capture identifiers, state, and evidence references without raw card data, secrets, or excessive personal data."
];
const practices = [
  "Model payment, refund, adjustment, dispute, and risk review as explicit state machines with immutable transition history.",
  "Use deterministic idempotency keys and store outcomes for the provider retry window. Duplicate callback and retry handling should be boring and testable.",
  "Make the ledger append-only or audit-preserving. Corrections should be compensating entries, not silent mutation.",
  "Verify webhooks and callbacks. Treat external provider events as evidence that must be authenticated, ordered, deduplicated, and reconciled.",
  "Separate PCI and sensitive data boundaries. Use hosted fields or tokenization; never log raw PAN, CVV, payment secrets, wallet tokens, or full bank identifiers.",
  "Build operator workflows for ambiguous payments, stuck pending states, refund failures, reconciliation breaks, chargebacks, and fraud review.",
  "Instrument by provider, rail, region, currency, app version, risk bucket, and payment method. Average success rate hides rail-specific incidents."
];
const pitfalls = [
  "double charge is the classic fintech failure. It happens when retries are not idempotent or when browser callbacks are treated as the only completion path.",
  "provider timeout should not create duplicate payment attempts. The UI should show pending or uncertain state and rely on authoritative polling or webhook reconciliation.",
  "3DS failure needs explicit state handling. Authentication, provider action, or risk review can pause the payment without losing the user intent.",
  "webhook race occurs when callbacks and retries are not deduped against stable intent and provider identifiers.",
  "Another pitfall is building transaction history directly from provider events. Users and finance teams need the internal ledger view plus reconciliation status, not raw provider status alone.",
  "Teams also forget support and compliance. If support cannot reconstruct a transaction safely, engineering becomes the manual reconciliation system."
];
const useCases = [
  "card checkout requires idempotent intent, external rail handling, ledger correctness, risk controls, user-visible status, and reconciliation.",
  "saved payment method requires idempotent intent, external rail handling, ledger correctness, risk controls, user-visible status, and reconciliation.",
  "marketplace payment collection requires idempotent intent, external rail handling, ledger correctness, risk controls, user-visible status, and reconciliation.",
  "During provider outage, the system should stop unsafe retries, preserve pending intent, show truthful status, route to fallback rails if configured, and reconcile late callbacks.",
  "During fraud spike, the system should raise risk thresholds, route cases to review, step up authentication, and monitor false-positive impact.",
  "During reconciliation breaks, finance operations should see the ledger entry, provider evidence, settlement file, adjustment history, and recommended next action."
];
const questions = [
  {
    "question": "How would you design a payment gateway integration UI end to end?",
    "answer": "I would create a durable intent, call external rails through provider adapters, persist ledger-impacting state with idempotency, process verified webhooks/callbacks, reconcile provider and internal records, and expose safe user/operator states. The UI never assumes success from a browser callback alone. Support and finance operations can inspect intent, provider evidence, ledger entries, and reconciliation status."
  },
  {
    "question": "Why this architecture over calling the provider directly from the UI?",
    "answer": "Direct provider calls from the UI cannot safely own idempotency, risk checks, ledger writes, webhook verification, reconciliation, or support history. Provider-hosted fields are useful for PCI scope, but financial state transitions need backend ownership and auditability."
  },
  {
    "question": "What breaks at scale?",
    "answer": "The main failures are double charge, provider timeout, 3DS failure, webhook race, plus webhook storms, provider-specific outages, reconciliation backlog, chargeback spikes, fraud adaptation, and support overload. Prevention requires idempotency, state machines, provider isolation, append-only ledger, reconciliation workflows, and rail-specific observability."
  },
  {
    "question": "What consistency model applies?",
    "answer": "Ledger-impacting state needs strong internal consistency and audited transitions. External provider state can be eventually consistent and must be reconciled. User-visible history can lag slightly if it exposes pending/reconciliation state. Analytics and dashboards are derived and should not be treated as financial truth."
  },
  {
    "question": "How do you handle failure, rollback, abuse, privacy, cost, and observability?",
    "answer": "Failures are handled with pending states, polling, verified webhooks, retries with idempotency, and reconciliation. Rollback often means refund, reversal, compensating entry, or manual adjustment. Abuse is controlled with risk scoring, velocity rules, step-up, and review. Privacy requires tokenization, redacted logs, and restricted support views. Cost is controlled by provider routing, batching, and review thresholds. Observability tracks authorization, pending, webhook, reconciliation, refund, and fraud metrics."
  },
  {
    "question": "How do you defend trade-offs under interviewer pressure?",
    "answer": "I would defend backend-owned state and idempotency because duplicate or lost money movement is unacceptable. I would accept asynchronous pending UX because external rails are not always synchronous. I would explain that fintech rollback is compensating action, not deletion, and that the ledger is more important than a perfectly smooth UI."
  }
];
const references = [
  {
    "label": "Stripe documentation: PaymentIntents",
    "href": "https://docs.stripe.com/payments/payment-intents"
  },
  {
    "label": "PCI Security Standards Council",
    "href": "https://www.pcisecuritystandards.org/"
  },
  {
    "label": "RBI UPI product statistics and resources",
    "href": "https://www.npci.org.in/what-we-do/upi/product-statistics"
  },
  {
    "label": "OWASP Authentication Cheat Sheet",
    "href": "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html"
  },
  {
    "label": "Google SRE Workbook",
    "href": "https://sre.google/workbook/table-of-contents/"
  }
];

export default function PaymentGatewayIntegrationUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section><h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="important">{definition[0]}</HighlightBlock>{definition.slice(1).map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Core Concepts</h2>{concepts.map((item, index) => index === 1 ? <HighlightBlock as="p" tier="crucial" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section>
        <h2>Architecture &amp; Flow</h2>
        {architecture.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/payments-fintech-systems/payment-gateway-integration-ui.svg" alt="Design a Payment Gateway Integration UI architecture" caption="Architecture view: intent, provider adapter, risk, ledger, webhook, reconciliation, and support surfaces." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/payments-fintech-systems/payment-gateway-integration-ui-flow.svg" alt="Design a Payment Gateway Integration UI flow" caption="Flow view: create intent, authorize, handle pending, process callback, write ledger, reconcile, and notify." />
        <ArticleImage src="/diagrams/system-design-problems/high-level-design/payments-fintech-systems/payment-gateway-integration-ui-operations.svg" alt="Design a Payment Gateway Integration UI operations" caption="Operations view: provider failures, fraud review, reconciliation breaks, refunds, disputes, and auditability." />
      </section>
      <section><h2>Trade offs &amp; Comparison</h2>{tradeoffs.map((item, index) => index === 0 ? <HighlightBlock as="p" tier="important" key={item}>{item}</HighlightBlock> : <p key={item}>{item}</p>)}</section>
      <section><h2>Best practices</h2>{practices.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common Pitfalls</h2>{pitfalls.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Real-world use cases</h2>{useCases.map((item) => <p key={item}>{item}</p>)}</section>
      <section><h2>Common interview question with detailed answer</h2>{questions.map((item) => <div key={item.question} className="mb-6"><h3 className="mb-2 text-lg font-semibold">{item.question}</h3><p>{item.answer}</p></div>)}</section>
      <section><h2>References</h2><ul className="list-disc space-y-2 pl-6">{references.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noreferrer" className="text-blue-600 underline dark:text-blue-400">{item.label}</a></li>)}</ul></section>
    </ArticleLayout>
  );
}
