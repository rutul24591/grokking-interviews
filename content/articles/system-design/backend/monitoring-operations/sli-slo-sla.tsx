"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-sli-slo-sla-extensive",
  title: "SLI, SLO, and SLA",
  description:
    "Define reliability with measurable indicators and objectives, then align alerting and operational decisions to them.",
  category: "backend",
  subcategory: "monitoring-operations",
  slug: "sli-slo-sla",
  wordCount: 1228,
  readingTime: 5,
  lastUpdated: "2026-03-14",
  tags: ["backend", "monitoring", "slo", "sli", "sla", "reliability"],
  relatedTopics: ["error-budgets", "alerting", "metrics", "dashboards"],
};

export default function SliSloSlaConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definitions (and Why the Distinctions Matter)</h2>
        <p>
          <strong>SLIs</strong>, <strong>SLOs</strong>, and <strong>SLAs</strong> are a reliability vocabulary that turns
          “the system feels slow” into measurable targets and operational decisions. The distinctions matter because they
          map to different audiences and consequences.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/monitoring-operations/sli-slo-sla-diagram-1.svg"
          alt="SLI SLO SLA relationship diagram"
          caption="SLIs measure; SLOs set targets; SLAs are external commitments with consequences."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>SLI (Service Level Indicator):</strong> a measurement of a user-facing property (availability,
            latency, freshness, correctness).
          </li>
          <li>
            <strong>SLO (Service Level Objective):</strong> a target for an SLI over a time window (for example, “99.9%
            of requests succeed over 30 days”).
          </li>
          <li>
            <strong>SLA (Service Level Agreement):</strong> a contractual commitment to customers, often with penalties or
            credits if unmet.
          </li>
        </ul>
        <p className="mt-4">
          In practice, SLOs guide engineering and operations behavior. SLAs are business commitments and are often set
          slightly looser than internal SLOs to reduce contractual risk.
        </p>
      </section>

      <section>
        <h2>Choosing SLIs: Measure What Users Experience</h2>
        <p>
          The hardest part is choosing an SLI that reflects real user experience. An SLI is useful when it is both
          <strong>representative</strong> (captures meaningful impact) and <strong>measurable</strong> (you can compute it
          reliably at scale).
        </p>
        <p>
          The common pattern is to define “good events” and “total events.” For availability, a “good event” might be a
          successful request. For latency, a “good event” might be a request completing under a threshold. For data
          systems, a “good event” might be a read that returns fresh-enough data.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Good SLI Candidates</h3>
          <ul className="space-y-2">
            <li>
              <strong>Request success:</strong> percent of requests that return correct responses (not just HTTP status).
            </li>
            <li>
              <strong>Latency thresholds:</strong> percent of requests below a target for key routes (tail-focused).
            </li>
            <li>
              <strong>Freshness:</strong> percent of reads that meet staleness limits for critical data.
            </li>
            <li>
              <strong>Correctness signals:</strong> mismatch rates, reconciliation errors, or invariant violations.
            </li>
          </ul>
        </div>
        <p>
          Avoid SLIs that are easy to compute but do not reflect user experience. Examples include host-level CPU without
          impact context or “service up” checks that ignore functional correctness.
        </p>
      </section>

      <section>
        <h2>Setting SLO Targets: Precision, Not Perfection</h2>
        <p>
          An SLO is a target that balances reliability and velocity. A stricter SLO reduces user pain but increases
          engineering and operational cost. A looser SLO increases product velocity but accepts more user impact.
        </p>
        <p>
          The practical question is: how much unreliability can the product tolerate before it harms trust or revenue?
          That tolerance becomes the “budget” you spend on deployments, experiments, and operational risk.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/monitoring-operations/sli-slo-sla-diagram-2.svg"
          alt="SLO target and error budget diagram"
          caption="SLO targets imply a limited budget for failures over a time window."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Choose a window:</strong> rolling 28/30 days is common because it smooths daily noise and aligns to
            user expectations.
          </li>
          <li>
            <strong>Choose a scope:</strong> per journey (checkout) often matters more than per service.
          </li>
          <li>
            <strong>Choose a threshold:</strong> latency thresholds should reflect what users perceive, not what is easy
            to measure.
          </li>
        </ul>
        <p className="mt-4">
          Many systems end up with a small set of SLOs for key journeys and a smaller set of supporting SLOs for shared
          dependencies (authentication, payments, search).
        </p>
      </section>

      <section>
        <h2>Measurement Windows and Burn</h2>
        <p>
          SLOs are measured over windows, and the same failure has different meaning depending on how quickly it burns the
          budget. A brief outage might be acceptable if it consumes only a small portion of the monthly budget. A slow
          burn that persists for hours might be more dangerous because it suggests systemic weakness.
        </p>
        <p>
          This leads to the operational concept of <strong>burn rate</strong>: how fast you are consuming the budget
          relative to the objective. Burn rate is useful because it naturally scales sensitivity: large incidents page
          quickly, small blips do not.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Window Design Considerations</h3>
          <ul className="space-y-2">
            <li>
              Short windows detect fast, severe incidents.
            </li>
            <li>
              Longer windows confirm sustained issues and reduce false positives.
            </li>
            <li>
              Using both helps balance sensitivity and noise.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Decomposing SLOs: Journeys, Dependencies, and Ownership</h2>
        <p>
          SLOs are most useful when they map to outcomes users care about, such as “checkout works” or “search returns
          results quickly.” But engineering teams often operate services, not journeys. That creates an ownership tension:
          which team is responsible when a journey SLO burns due to a downstream dependency?
        </p>
        <p>
          The common solution is decomposition. Keep a small set of journey SLOs as the top-level objectives, then define
          a small set of supporting service SLIs that explain where burn is coming from. Supporting SLIs are diagnostic,
          not contractual: they help responders isolate the bottleneck without turning every internal component into an
          external promise.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Journey first:</strong> define the user-facing SLO and use it to drive priorities and change policy.
          </li>
          <li>
            <strong>Support signals:</strong> track dependency latency, error rates, and saturation as leading indicators.
          </li>
          <li>
            <strong>Clear ownership:</strong> document who owns burn response and which mitigations are expected (fallback,
            rate limiting, graceful degradation).
          </li>
        </ul>
        <p className="mt-4">
          This framing avoids two common failure modes: SLO sprawl (hundreds of internal SLOs no one uses) and
          finger-pointing (no team owns the end-to-end experience). The point is to make reliability actionable.
        </p>
      </section>

      <section>
        <h2>SLAs: External Commitments and Risk</h2>
        <p>
          SLAs are agreements with customers. They often include a definition of availability, a measurement method, and
          a remedy (service credits) if the commitment is not met. SLAs introduce legal and financial consequences, so
          they are usually more conservative and simpler than internal SLOs.
        </p>
        <p>
          A common best practice is to keep an internal buffer: set internal SLOs tighter than SLAs so engineering has
          room to recover before contractual targets are threatened. This also reduces incentives to “game” measurements
          near the edge of an SLA.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/monitoring-operations/sli-slo-sla-diagram-3.svg"
          alt="SLA buffer and operational alignment diagram"
          caption="Align internal SLOs and external SLAs with a buffer to reduce contractual risk."
        />
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          SLIs and SLOs fail most often due to measurement mismatch: the indicator does not match user experience or is
          computed inconsistently. Once trust is lost, teams stop using SLOs for decisions.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Wrong “good event” definition:</strong> counting HTTP 200 as success even when responses are wrong.
          </li>
          <li>
            <strong>Sampling bias:</strong> measuring only a subset of traffic that excludes the painful cases.
          </li>
          <li>
            <strong>Ambiguous scope:</strong> an SLO that mixes unrelated journeys makes diagnosis and ownership unclear.
          </li>
          <li>
            <strong>Chasing perfect targets:</strong> overly strict objectives that force constant firefighting.
          </li>
          <li>
            <strong>Data quality gaps:</strong> missing telemetry makes the SLO appear better or worse than reality.
          </li>
        </ul>
      </section>

      <section>
        <h2>Operational Integration: Make SLOs Change Behavior</h2>
        <p>
          SLOs are useful only if they influence decisions. The standard integration is: alert on burn, review budgets
          regularly, and use budget health to decide when to ship, when to slow down, and when to invest in reliability
          work.
        </p>
        <p>
          This is the bridge between monitoring and engineering strategy. With SLOs, incident response and product
          planning share the same language: “we have budget left” or “we are over budget and need to stabilize.”
        </p>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          A team defines an SLO for checkout latency: most requests must complete under a threshold over 30 days. During a
          provider incident, checkout errors spike and the budget burns quickly. Burn-based alerting pages immediately.
        </p>
        <p>
          After mitigation, the team reviews the budget: the incident consumed a large portion of monthly tolerance. The
          team decides to pause risky releases and prioritize adding an alternate provider and better degradation paths.
          The SLO did not just measure the incident; it guided the next decision.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist to build SLIs/SLOs that are trusted and operationally useful.</p>
        <ul className="mt-4 space-y-2">
          <li>Choose SLIs that reflect user experience and correctness, not just infrastructure health.</li>
          <li>Define “good events” clearly and ensure measurement is consistent and auditable.</li>
          <li>Use rolling windows and burn concepts to integrate with alerting and operational response.</li>
          <li>Keep the number of SLOs small and scoped to meaningful journeys with clear ownership.</li>
          <li>Set SLAs conservatively and keep internal buffers to reduce contractual risk.</li>
          <li>Review SLO performance regularly and use it to drive engineering priorities.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Focus on the measurement and decision system, not on definitions alone.</p>
        <ul className="mt-4 space-y-2">
          <li>How do you choose an SLI for a user journey and avoid measurement mismatch?</li>
          <li>How do you set SLO targets and justify trade-offs?</li>
          <li>How do burn concepts change alerting compared to static thresholds?</li>
          <li>How do you keep SLOs trustworthy as systems and traffic evolve?</li>
          <li>How do SLAs differ from SLOs operationally and organizationally?</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
