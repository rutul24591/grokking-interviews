"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-ads-delivery-targeting-ui",
  title: "Design an Ads Delivery & Targeting UI",
  description: "Principal-level design for ads delivery and targeting covering campaign setup, audience targeting, auction inputs, pacing, privacy, policy review, frequency caps, attribution, and operational safeguards.",
  category: "high-level-design",
  subcategory: "ads-monetization-systems",
  slug: "ads-delivery-targeting-ui",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-25",
  tags: ["hld","ads","targeting","auction","privacy","pacing"],
  relatedTopics: ["ads-analytics-dashboard","creator-monetization-dashboard"],
};

export default function AdsDeliveryTargetingUiArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design an Ads Delivery &amp; Targeting UI around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A ads delivery and targeting UI is a monetization control surface used by advertisers, campaign managers, growth teams, policy reviewers, marketplace quality teams, privacy reviewers, ad-serving engineers, and SREs to let advertisers define audiences, budgets, bids, creatives, placements, schedules, and safety constraints while the platform protects privacy, auction quality, user experience, and revenue integrity. At principal level, this is not a CRUD dashboard for campaigns or payments. It is a money-moving, privacy-sensitive, policy-constrained system where incorrect data can harm users, advertisers, creators, finance, and platform trust.
        </HighlightBlock>
        <p>
          Ads and monetization systems combine product UX, low-latency serving paths, finance-grade ledgers, marketplace incentives, privacy regulation, trust and safety, and experimentation. The hardest part is making revenue systems both fast enough for operators and correct enough for billing, payouts, and disputes.
        </p>
        <p>
          The primary entities are campaigns, ad groups, creatives, audiences, targeting rules, placements, bids, budgets, pacing plans, frequency caps, policy states, auction eligibility, conversion events, and audit records. These entities should be modeled separately because serving state, reporting state, policy state, and financial state have different consistency and audit requirements.
        </p>
        <p>
          Non-functional requirements include low dashboard latency, bounded query cost, accurate money reporting, privacy-safe dimensions, clear freshness watermarks, immutable audit, data retention controls, and incident playbooks for overdelivery, underdelivery, incorrect payouts, and policy mistakes.
        </p>
        <p>
          Scope should be explicit. This design focuses on high-level product and platform architecture for monetization operations. It does not implement the full ad auction ranking model, payment processor internals, or tax law logic, but it must integrate with those systems through defensible contracts.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design an Ads Delivery &amp; Targeting UI, the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>
          The first concept is separating operational state from financial truth. Campaign configuration, dashboard aggregates, attribution results, and payout balances may all be derived from the same activity, but finance-grade ledgers and audit trails need stronger guarantees than exploratory charts.
        </p>
        <p>
          The second concept is freshness with caveats. Monetization dashboards often mix real-time estimates, delayed conversions, fraud-filtered results, settled invoices, and payout ledger balances. The UI should label each value by freshness and confidence rather than pretending all numbers have the same reliability.
        </p>
        <p>
          The third concept is privacy-preserving targeting and reporting. Sensitive cohorts, small audiences, user-level conversion paths, and location or demographic dimensions can leak personal information. The platform needs consent, thresholds, aggregation, regional rules, and data minimization.
        </p>
        <p>
          The fourth concept is policy and trust review. Creatives, campaigns, sponsored content, creator eligibility, and external links can violate safety, legal, or brand requirements. Policy state must be part of the workflow, not a separate manual spreadsheet.
        </p>
        <p>
          The fifth concept is pacing and budget correctness. Ads systems must spend smoothly, avoid overspend, respect frequency caps, and recover from serving or event lag. Pacing decisions should be observable and reversible because they directly affect advertiser outcomes.
        </p>
        <p>
          The sixth concept is attribution ambiguity. A conversion can be delayed, duplicated, cross-device, privacy-limited, or claimed by multiple campaigns. The system needs explicit attribution windows, deduplication, model versions, and caveats in the dashboard.
        </p>
        <p>
          The seventh concept is fraud and abuse resistance. Click fraud, impression laundering, fake creator activity, invalid traffic, review manipulation, and account takeovers can distort revenue. Detection should influence reporting and payout state with explainable holds.
        </p>
        <p>
          The eighth concept is explainability. Advertisers and creators need to know why delivery changed, why spend stopped, why revenue was held, or why a metric differs from invoice totals. Support and finance need the same evidence without raw database access.
        </p>
        <p>
          The ninth concept is immutable audit. Money-facing systems need to reconstruct who changed campaign targeting, which rules allocated revenue, which events were filtered, which payout batch included a creator, and which policy reviewer approved an exception.
        </p>
        <p>
          Auction and serving eligibility deserve their own model. A campaign can be approved in the UI but still be ineligible at serve time because the user has hit a frequency cap, the budget is exhausted, the creative is incompatible with the placement, the privacy region blocks the audience, or a pacing controller has throttled delivery. Principal-level designs separate campaign approval from per-request eligibility so the UI can explain why a campaign is live but not spending.
        </p>
        <p>
          Forecasting is also a core concept, not a decorative widget. Reach, spend, and conversion estimates are probabilistic outputs based on historical inventory, audience overlap, seasonality, bid landscape, policy filters, and pacing constraints. The dashboard should show confidence ranges and known exclusions because advertisers make budget commitments from these estimates.
        </p>
        <p>
          Change management matters because ads configuration is revenue-sensitive. Large budget changes, sensitive-category targeting, political or regulated ads, and broad creative updates should use versioned approvals, previewable diffs, and rollback checkpoints. A single accidental publish can spend money quickly or violate policy at scale.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>
          A practical architecture includes campaign UI, targeting service, audience estimator, creative review pipeline, policy engine, budget and pacing service, ad-serving config publisher, auction eligibility index, attribution pipeline, and monitoring. The serving or revenue path should be optimized for scale, while policy, reporting, and finance paths preserve auditability and correctness.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ads-monetization-systems/ads-delivery-targeting-ui.svg"
          alt="Design an Ads Delivery &amp; Targeting UI high-level architecture"
          caption="Ads delivery setup connects campaign authoring, audience estimation, policy review, pacing, serving config, auction eligibility, and attribution feedback."
        />
        <p>
          An advertiser creates a campaign, selects targeting and placements, previews reach, uploads creatives, passes policy and privacy checks, configures bids and pacing, publishes an immutable version, and monitors delivery health.
        </p>
        <p>
          Serving systems read approved campaign snapshots, evaluate targeting eligibility, enforce budget and frequency caps, pass auction candidates to ranking, log impressions and clicks, and feed attribution and pacing loops.
        </p>
        <p>
          The ingestion side should normalize heterogeneous events. Impression, click, conversion, revenue, payout, policy, and eligibility events need idempotency keys, source lineage, timestamps, actor identity, and replay capability. Without this, finance reconciliation becomes guesswork.
        </p>
        <p>
          The serving side should consume approved and versioned snapshots. Low-latency systems should not synchronously call dashboard databases or policy review tools. They should read compact, validated, cacheable snapshots and emit durable telemetry for reporting and control loops.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ads-monetization-systems/ads-delivery-targeting-ui-flow.svg"
          alt="Design an Ads Delivery &amp; Targeting UI publish and reporting flow"
          caption="Campaign publish must validate privacy, policy, budget, pacing, and creative states before serving systems can use the snapshot."
        />
        <p>
          The dashboard API should prefer pre-aggregated metrics for common slices and bounded warehouse queries for deep drilldowns. Query planners should enforce cardinality limits, privacy thresholds, and cost controls so one dashboard cannot overload the analytics platform.
        </p>
        <p>
          Policy and privacy checks should be centralized enough to be consistent but configurable enough to handle regional rules and product-specific risk. The system should support blocked, pending, approved, limited, appealed, and takedown states with clear owner and deadline.
        </p>
        <p>
          Financial integration should use ledger semantics. Money values should be append-only adjustments with reason codes, not mutable counters. Corrections should create new ledger entries, preserving previous state for audit, invoice dispute, payout reconciliation, and compliance.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/ads-monetization-systems/ads-delivery-targeting-ui-operations.svg"
          alt="Design an Ads Delivery &amp; Targeting UI operational safeguards"
          caption="Operational controls protect user experience, advertiser spend, auction integrity, and regional privacy compliance."
        />
        <p>
          Multi-region design should keep money and privacy constraints explicit. Serving may run globally, but billing, conversion logs, and payout records may have regional retention or residency requirements. Cross-region replication must not bypass consent or legal rules.
        </p>
        <p>
          Observability should track delivery, spend, attribution lag, policy backlog, fraud rate, dashboard freshness, ledger reconciliation, payout delay, query cost, and complaint volume. These metrics connect business trust to system health.
        </p>
        <p>
          Campaign publishing should produce a serving manifest with campaign version, eligible placements, targeting predicates, budget ceilings, pacing parameters, creative IDs, policy labels, and privacy restrictions. The manifest is compact enough for ad-serving systems to cache, while the full authoring record remains in the campaign database for audit and review.
        </p>
        <p>
          Budget enforcement should use multiple guards. A fast in-memory or regional counter protects low-latency serving, while an authoritative spend ledger reconciles truth. When counters diverge, the system should fail toward throttling high-risk campaigns and show the advertiser that delivery is limited due to spend protection rather than silently overspending.
        </p>
        <p>
          Emergency operations need first-class controls. Operators should be able to pause one campaign, one advertiser, one creative family, one placement, or one region without disabling the whole ads stack. This geographic and entity-level blast-radius control is essential during policy incidents, privacy incidents, or auction bugs.
        </p>
        <p>
          Auction integration should be observable from the advertiser UI without exposing proprietary ranking internals. The UI can show eligible inventory trends, lost-delivery reason categories, pacing throttle state, policy limitations, bid competitiveness bands, and frequency-cap pressure. This helps advertisers diagnose underdelivery while keeping marketplace algorithms protected and reducing support escalations.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">
          The central trade-off is advertiser control and revenue growth versus privacy, policy safety, and user experience. A principal-ready answer should explain how the system balances growth incentives with safety, correctness, and long-term marketplace trust.
        </HighlightBlock>
        <p>
          Real-time metrics versus correctness is a key trade-off. Real-time estimates help operators react, but late conversions, fraud filtering, and finance reconciliation can change the final number. The dashboard should separate estimated, finalized, and reconciled metrics.
        </p>
        <p>
          Granular targeting or reporting versus privacy risk needs careful treatment. Fine-grained dimensions improve advertiser control and analysis, but small cohorts can reveal user behavior. Thresholding, aggregation, suppression, and differential privacy techniques may be required.
        </p>
        <p>
          Centralized policy versus advertiser or creator velocity is another trade-off. Strict review reduces harm but can slow campaigns and payouts. Risk-based review, automated pre-checks, and clear appeal paths keep the platform usable without removing governance.
        </p>
        <p>
          Precomputed aggregates versus flexible drilldowns affects scalability. Precomputation makes common dashboards fast and predictable. Flexible warehouse queries are useful for investigation but need cost guards, sampling, and query shape limits.
        </p>
        <p>
          Revenue optimization versus user experience matters. More ads, higher frequency, or aggressive targeting may lift short-term revenue while damaging retention or trust. Guardrail metrics should include latency, complaint rate, hide rate, churn, and policy incidents.
        </p>
        <p>
          Fraud prevention versus creator or advertiser transparency is hard. Revealing every fraud signal helps explain holds but can teach attackers how to evade detection. The design should provide reason categories and appeal evidence without exposing detection internals.
        </p>
        <p>
          Ledger immutability versus correction ergonomics is important. Mutable balances are easy but unsafe. Append-only adjustments are auditable but require better UI explanation. For money systems, auditability should win.
        </p>
        <p>
          Build versus buy should be discussed. Managed ad servers, attribution vendors, and payout platforms reduce implementation scope, but they may not satisfy privacy, marketplace, latency, or explainability needs. The integration boundary should be explicit.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Label every metric by state: estimated, delayed, fraud-filtered, privacy-suppressed, finalized, invoiced, settled, held, or paid. This avoids false precision in money-facing dashboards.
        </p>
        <p>
          Use idempotency and deduplication at every event boundary. Duplicate impressions, clicks, conversions, and revenue events are common in distributed systems and directly affect billing or payouts.
        </p>
        <p>
          Preserve source lineage and model versions. Attribution logic, fraud filters, pacing algorithms, and revenue-share rules change over time. Historical reports must know which version produced the result.
        </p>
        <p>
          Make policy state visible and actionable. Pending review, limited delivery, rejected creative, creator hold, appeal deadline, and takedown reason should be first-class states, not hidden support notes.
        </p>
        <p>
          Design for explainable disputes. Advertisers dispute invoices; creators dispute payouts. Support needs event lineage, ledger entries, policy state, fraud categories, and freshness caveats in one safe interface.
        </p>
        <p>
          Protect privacy before data reaches dashboards. Apply consent, aggregation, small-cohort suppression, retention limits, and regional policy checks in pipelines and APIs, not just in client rendering.
        </p>
        <p>
          Use guardrails for monetization experiments. Revenue lift should be balanced against retention, complaint rate, latency, advertiser ROI, creator trust, and policy incident rate.
        </p>
        <p>
          Separate serving availability from analytics availability. Ads can continue to serve from approved snapshots even if the dashboard warehouse is delayed. Conversely, dashboards should clearly show freshness lag.
        </p>
        <p>
          Run reconciliation jobs continuously. Compare serving logs, billing ledgers, aggregate metrics, payout batches, and invoices. Reconciliation should produce explainable deltas and not only nightly alerts.
        </p>
        <p>
          Practice incident drills for overspend, underdelivery, incorrect payout, corrupted attribution, policy bypass, and privacy leakage. These are the incidents monetization systems actually face.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          A common pitfall is treating a ads delivery and targeting UI as a reporting UI over a few tables. That misses over-targeting sensitive cohorts, creative policy bypass, budget overspend, under-delivery, frequency-cap drift, stale campaign snapshot, attribution inflation, auction eligibility bug, and regional privacy violation. Monetization systems need ledgers, policy state, privacy boundaries, and operational recovery.
        </p>
        <p>
          Another pitfall is mixing estimated and finalized money values. If the UI does not distinguish them, users will treat every number as payable or billable and support will inherit the confusion.
        </p>
        <p>
          Teams often ignore late-arriving and duplicate events. This creates drift between dashboards, invoices, and payouts. Event-time processing, deduplication, and reconciliation are required.
        </p>
        <p>
          Privacy thresholds are frequently bolted on after drilldowns already exist. Small cohorts and rare conversions can leak sensitive behavior, especially with many dimensions.
        </p>
        <p>
          Pacing and budget failures can be expensive. A stale cache, delayed spend event, or regional serving bug can overspend an advertiser budget before a dashboard catches up.
        </p>
        <p>
          Fraud and policy holds are often unexplained. Creators and advertisers need enough clarity to understand the state and appeal, while the platform still protects detection logic.
        </p>
        <p>
          High-cardinality analytics can overload warehouses. Creative, placement, location, audience, and time breakdowns need query limits, pre-aggregates, and async export paths.
        </p>
        <p>
          Finally, many designs omit support and finance users. Principal-level systems include the tools needed to investigate disputes and close the books, not just the advertiser or creator view.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Real-world use cases for a ads delivery and targeting UI include self-serve campaign launch, retargeting suppression, regional placement targeting, brand-safety review, budget pacing recovery, frequency-cap enforcement, and emergency campaign takedown. Each use case has different expectations for freshness, privacy, auditability, and money accuracy.
        </p>
        <p>
          A self-serve ads platform needs campaign velocity, audience estimation, policy review, budget controls, auction eligibility, and dashboard trust. Mistakes can spend customer money or expose sensitive targeting.
        </p>
        <p>
          A creator platform needs transparent earnings, policy eligibility, fraud holds, tax compliance, payout scheduling, and dispute handling. Creator trust depends on explainable balances and predictable payout state.
        </p>
        <p>
          A marketplace must protect multiple sides: users do not want abusive ads, advertisers want ROI, creators want fair payouts, and the platform needs compliant revenue. The architecture should make those tensions explicit.
        </p>
        <p>
          Incident scenarios include corrupted attribution, delayed conversion stream, fraud model false positives, overdelivery, underdelivery, tax provider outage, payout batch failure, and accidental approval of prohibited creatives.
        </p>
        <p>
          At principal level, the answer should connect product dashboards to serving systems, event pipelines, ledgers, privacy, policy, finance reconciliation, and incident operations.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3>1. How would you design the high-level architecture for a ads delivery and targeting UI?</h3>
        <p>
          Separate the authoring or dashboard surface from serving, event ingestion, policy, privacy, ledger, and analytics systems. Serving paths should consume compact approved snapshots and emit durable telemetry. Reporting paths should deduplicate, attribute, filter fraud, aggregate, and reconcile with ledgers. Dashboard APIs should show freshness, privacy suppression, and caveats. Finance and support tooling should read immutable evidence rather than mutable counters. This architecture keeps low-latency operations separate from money correctness.
        </p>
        <h3>2. How do you make monetization metrics trustworthy?</h3>
        <p>
          Use durable event ingestion, idempotency keys, deduplication, event-time processing, attribution model versions, fraud labels, freshness watermarks, and reconciliation against billing or payout ledgers. Separate estimated, finalized, invoiced, settled, and paid states. Preserve source lineage so support can explain discrepancies. Trust comes from showing caveats and evidence, not from hiding pipeline complexity.
        </p>
        <h3>3. How do you handle privacy in ads and monetization systems?</h3>
        <p>
          Apply consent and regional policy before targeting, reporting, or attribution. Avoid exposing user-level paths in dashboards. Suppress small cohorts, aggregate sensitive dimensions, minimize retention, and separate raw event access from product analytics. Privacy rules must apply to exports, support tooling, experiments, and logs, not just visible charts.
        </p>
        <h3>4. What happens if events are delayed, duplicated, or corrupted?</h3>
        <p>
          The system should deduplicate by stable event keys, process by event time with allowed lateness, show freshness lag, quarantine suspicious batches, and support replay from durable streams. Derived aggregates can be rebuilt. Ledgers should receive append-only corrections rather than destructive updates. Operators need reconciliation dashboards to compare serving logs, aggregates, invoices, and payouts.
        </p>
        <h3>5. What trade-offs would you highlight in a principal interview?</h3>
        <p>
          I would highlight advertiser control and revenue growth versus privacy, policy safety, and user experience, real-time estimates versus reconciled truth, granular reporting versus privacy, fraud transparency versus evasion risk, precomputed aggregates versus drilldown flexibility, revenue optimization versus user trust, and immutable ledgers versus correction UX. The best answer ties each trade-off to advertiser, creator, user, finance, and regulatory impact.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><a href="https://iabtechlab.com/standards/openrtb/" target="_blank" rel="noreferrer">IAB Tech Lab - OpenRTB standards</a></li>
          <li><a href="https://iabtechlab.com/standards/ads-txt/" target="_blank" rel="noreferrer">IAB Tech Lab - ads.txt and supply-chain transparency</a></li>
          <li><a href="https://developers.google.com/google-ads/api/docs/start" target="_blank" rel="noreferrer">Google Ads API documentation</a></li>
          <li><a href="https://support.google.com/admanager/answer/82242" target="_blank" rel="noreferrer">Google Ad Manager - Forecasting and delivery concepts</a></li>
          <li><a href="https://stripe.com/docs/treasury/moving-money/financial-accounts/ledger" target="_blank" rel="noreferrer">Stripe documentation - Ledger concepts for money movement</a></li>
          <li><a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noreferrer">Google SRE Book - Monitoring Distributed Systems</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
