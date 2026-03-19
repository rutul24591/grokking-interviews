"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-advanced-slo-error-budget-management-extensive",
  title: "SLO / Error Budget Management",
  description:
    "Comprehensive guide to Service Level Objectives, error budgets, burn rate analysis, and availability management for staff/principal engineer interviews.",
  category: "advanced-topics",
  subcategory: "nfr",
  slug: "slo-error-budget-management",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-19",
  tags: [
    "advanced",
    "nfr",
    "slo",
    "error-budget",
    "sre",
    "availability",
    "monitoring",
  ],
  relatedTopics: [
    "high-availability",
    "latency-slas",
    "monitoring-observability",
  ],
};

export default function SloErrorBudgetManagementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Service Level Objectives (SLOs)</strong> are internal targets
          for service reliability, expressed as a percentage of successful
          requests over a time window. <strong>Error Budgets</strong>
          are the inverse of SLOs — the acceptable amount of failure or
          unavailability within a period.
        </p>
        <p>
          These concepts, popularized by Google&apos;s Site Reliability
          Engineering (SRE) practice, provide a quantitative framework for
          balancing reliability with feature velocity. Instead of aiming for
          perfection (which is infinitely expensive), teams aim for &quot;good
          enough&quot; reliability and use remaining error budget for
          innovation.
        </p>
        <p>
          <strong>Key relationships:</strong>
        </p>
        <ul>
          <li>
            <strong>SLI (Service Level Indicator):</strong> What you measure
            (latency, error rate, throughput).
          </li>
          <li>
            <strong>SLO (Service Level Objective):</strong> Target for the SLI
            (99.9% of requests {"<"} 200ms).
          </li>
          <li>
            <strong>SLA (Service Level Agreement):</strong> Contractual
            commitment with consequences (credits, penalties).
          </li>
          <li>
            <strong>Error Budget:</strong> 100% - SLO. For 99.9% SLO, error
            budget is 0.1% (acceptable failure).
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">
            Key Insight: Error Budgets Enable Risk-Taking
          </h3>
          <p>
            Error budgets flip the reliability conversation. Instead of
            &quot;never break things,&quot; the question becomes &quot;how can
            we spend our error budget wisely?&quot; Teams with remaining budget
            can take risks (launch new features, try risky deployments). Teams
            that exhaust budget focus on reliability.
          </p>
          <p className="mt-3">
            <strong>This aligns incentives:</strong> Product teams want to ship
            features; SRE teams want stability. Error budgets provide objective
            criteria for balancing both.
          </p>
        </div>

        <p>
          This article covers SLO definition, error budget calculation, burn
          rate analysis, alerting strategies, and organizational practices for
          SLO-driven operations.
        </p>
      </section>

      <section>
        <h2>SLO Definition & Selection</h2>
        <p>
          Choosing the right SLOs is critical — too strict and you&apos;ll
          exhaust budget constantly; too loose and users suffer.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Choosing SLIs</h3>
        <p>Select indicators that reflect user experience:</p>
        <ul>
          <li>
            <strong>Availability:</strong> Percentage of successful requests.
            Good for APIs, web services.
          </li>
          <li>
            <strong>Latency:</strong> Percentage of requests under threshold.
            Use percentiles (P50, P95, P99).
          </li>
          <li>
            <strong>Quality:</strong> Percentage of valid/correct responses.
            Good for data pipelines.
          </li>
          <li>
            <strong>Freshness:</strong> Data age. Good for real-time systems,
            dashboards.
          </li>
          <li>
            <strong>Throughput:</strong> Requests processed per second. Good for
            batch systems.
          </li>
        </ul>
        <p>
          <strong>Best practice:</strong> Choose 1-3 SLIs per service. More than
          that dilutes focus.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Setting SLO Targets</h3>
        <p>Common SLO targets and their implications:</p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">SLO</th>
                <th className="p-2 text-left">Error Budget (Monthly)</th>
                <th className="p-2 text-left">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">99% (Two Nines)</td>
                <td className="p-2">~7.3 hours downtime</td>
                <td className="p-2">Internal tools, dev environments</td>
              </tr>
              <tr>
                <td className="p-2">99.9% (Three Nines)</td>
                <td className="p-2">~44 minutes downtime</td>
                <td className="p-2">Standard production services</td>
              </tr>
              <tr>
                <td className="p-2">99.95%</td>
                <td className="p-2">~22 minutes downtime</td>
                <td className="p-2">Business-critical services</td>
              </tr>
              <tr>
                <td className="p-2">99.99% (Four Nines)</td>
                <td className="p-2">~4.4 minutes downtime</td>
                <td className="p-2">Payment, authentication, core APIs</td>
              </tr>
              <tr>
                <td className="p-2">99.999% (Five Nines)</td>
                <td className="p-2">~26 seconds downtime</td>
                <td className="p-2">Telecom, emergency services</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Recommendation:</strong> Start with 99.9% for most services.
          Adjust based on user impact and operational burden.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Window Selection</h3>
        <p>SLOs are measured over time windows:</p>
        <ul>
          <li>
            <strong>Rolling Window:</strong> Always look back X days. Smooths
            out bursts, but alerts may lag.
          </li>
          <li>
            <strong>Calendar Window:</strong> Reset each month/quarter. Clear
            boundaries, but edge effects at boundaries.
          </li>
        </ul>
        <p>
          <strong>Recommendation:</strong> Use 30-day rolling windows for
          operational SLOs. Monthly calendar windows for business reporting.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/slo-error-budget-concepts.svg"
          alt="SLO and Error Budget Concepts"
          caption="SLO Concepts — showing relationship between SLI, SLO, SLA, error budget, and availability tiers"
        />
      </section>

      <section>
        <h2>Error Budget Calculation</h2>
        <p>Calculate and track error budget consumption.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Budget Calculation</h3>
        <p>For a 99.9% SLO over 30 days:</p>
        <ul>
          <li>
            <strong>Total requests:</strong> Assume 1 million requests/month.
          </li>
          <li>
            <strong>Allowed failures:</strong> 0.1% × 1M = 1,000 failed
            requests.
          </li>
          <li>
            <strong>Time budget:</strong> 0.1% × 30 days = 43.2 minutes of
            downtime.
          </li>
        </ul>
        <p>
          Track remaining budget: If 500 requests have failed, 500 remain (50%
          budget consumed).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Burn Rate</h3>
        <p>
          Burn rate measures how quickly you&apos;re consuming error budget:
        </p>
        <ul>
          <li>
            <strong>Burn Rate = 1:</strong> Consuming budget at expected rate.
            Will hit 100% at end of window.
          </li>
          <li>
            <strong>Burn Rate {">"} 1:</strong> Consuming faster than expected.
            Will exhaust budget early.
          </li>
          <li>
            <strong>Burn Rate {"<"} 1:</strong> Consuming slower than expected.
            Budget surplus.
          </li>
        </ul>
        <p>
          <strong>Example:</strong> If you&apos;ve consumed 50% of budget in 25%
          of the window, burn rate is 2×. At this rate, you&apos;ll exhaust
          budget in half the window duration.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Multi-Window Burn Rate
        </h3>
        <p>Monitor burn rate across multiple windows:</p>
        <ul>
          <li>
            <strong>Short window (1 hour):</strong> Detect sudden spikes. High
            burn rate = page immediately.
          </li>
          <li>
            <strong>Medium window (6 hours):</strong> Detect sustained issues.
            Moderate burn rate = ticket.
          </li>
          <li>
            <strong>Long window (30 days):</strong> Track overall trend. Low
            burn rate = review in planning.
          </li>
        </ul>
        <p>
          <strong>Google&apos;s alerting strategy:</strong> Page if budget
          exhausted in 1 hour OR 5% budget consumed in 5 minutes.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/error-budget-burn-rate.svg"
          alt="Error Budget Burn Rate"
          caption="Error Budget Burn Rate — showing budget consumption over time, burn rate calculation, and multi-window alerting"
        />
      </section>

      <section>
        <h2>SLO-Driven Alerting</h2>
        <p>Use SLOs to drive intelligent alerting that reduces noise.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Alerting on Budget Exhaustion
        </h3>
        <p>Alert when error budget is at risk:</p>
        <ul>
          <li>
            <strong>Critical:</strong> Budget exhausted. Immediate page.
          </li>
          <li>
            <strong>Warning:</strong> Budget will be exhausted in X days at
            current burn rate.
          </li>
          <li>
            <strong>Info:</strong> Budget consumption trending up. Review in
            next planning cycle.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Alerting on Burn Rate
        </h3>
        <p>Alert based on burn rate thresholds:</p>
        <ul>
          <li>
            <strong>Burn Rate {">"} 14.4:</strong> Budget exhausted in 1 hour.
            Page immediately.
          </li>
          <li>
            <strong>Burn Rate {">"} 6:</strong> Budget exhausted in 6 hours.
            Page on-call.
          </li>
          <li>
            <strong>Burn Rate {">"} 3:</strong> Budget exhausted in 2 days.
            Ticket for review.
          </li>
          <li>
            <strong>Burn Rate {">"} 1:</strong> Budget will be exhausted this
            window. Monitor closely.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Alert Suppression</h3>
        <p>Reduce alert fatigue:</p>
        <ul>
          <li>
            <strong>Group alerts:</strong> One alert per service, not per
            instance.
          </li>
          <li>
            <strong>Cooldown:</strong> Don&apos;t re-alert for same issue within
            X minutes.
          </li>
          <li>
            <strong>Escalation:</strong> Start with chat notification, escalate
            to page if unresolved.
          </li>
          <li>
            <strong>Business Hours:</strong> Non-critical alerts during business
            hours only.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/advanced-topics/slo-alerting-strategy.svg"
          alt="SLO Alerting Strategy"
          caption="SLO Alerting — showing burn rate thresholds, alert escalation, and multi-window alerting strategy"
        />
      </section>

      <section>
        <h2>Organizational Practices</h2>
        <p>SLOs are as much cultural as technical.</p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Error Budget Policy</h3>
        <p>Define what happens when budget is exhausted:</p>
        <ul>
          <li>
            <strong>Feature Freeze:</strong> No new features until reliability
            improves.
          </li>
          <li>
            <strong>Change Freeze:</strong> No risky deployments (can still
            deploy bug fixes).
          </li>
          <li>
            <strong>Reliability Sprint:</strong> Dedicate next sprint to
            reliability improvements.
          </li>
          <li>
            <strong>Post-Mortem:</strong> Required for budget exhaustion.
            Document learnings.
          </li>
        </ul>
        <p>
          <strong>Key:</strong> Policy must be enforced consistently, or SLOs
          become meaningless.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SLO Reviews</h3>
        <p>Regular SLO review cadence:</p>
        <ul>
          <li>
            <strong>Weekly:</strong> Review burn rate, discuss trends in team
            standup.
          </li>
          <li>
            <strong>Monthly:</strong> Review SLO attainment, adjust targets if
            needed.
          </li>
          <li>
            <strong>Quarterly:</strong> Deep dive on SLO effectiveness,
            add/remove SLIs.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">SLO Hierarchy</h3>
        <p>Cascade SLOs through organization:</p>
        <ul>
          <li>
            <strong>System SLOs:</strong> End-to-end user experience (homepage
            load, checkout completion).
          </li>
          <li>
            <strong>Service SLOs:</strong> Individual service reliability (API
            latency, error rate).
          </li>
          <li>
            <strong>Infrastructure SLOs:</strong> Underlying infrastructure
            (node availability, network latency).
          </li>
        </ul>
        <p>
          <strong>Relationship:</strong> Infrastructure SLOs should be stricter
          than service SLOs, which should be stricter than system SLOs. This
          provides margin for failure at each layer.
        </p>

        <h3
          className="
          mt-8
          mb-4
          text-xl
          font-semibold"
        >
          SLO Anti-Patterns
        </h3>
        <p>Avoid these common mistakes:</p>
        <ul>
          <li>
            <strong>Too Many SLOs:</strong> More than 3-5 per service dilutes
            focus.
          </li>
          <li>
            <strong>Vanity SLOs:</strong> Targets so loose they&apos;re always
            met (99.999% when actual is 99%).
          </li>
          <li>
            <strong>SLOs Without Action:</strong> No policy for budget
            exhaustion.
          </li>
          <li>
            <strong>Set and Forget:</strong> Not reviewing/adjusting SLOs over
            time.
          </li>
          <li>
            <strong>Blame Tool:</strong> Using SLOs to punish teams rather than
            improve systems.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the difference between SLI, SLO, and SLA?
            </p>
            <p className="mt-2 text-sm">
              A: SLI (Service Level Indicator) is what you measure (latency,
              error rate). SLO (Service Level Objective) is the target for that
              measurement (99.9% of requests {"<"} 200ms). SLA (Service Level
              Agreement) is a contractual commitment with consequences (credits,
              penalties) if not met. SLIs feed SLOs; SLOs inform SLAs.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you calculate error budget?
            </p>
            <p className="mt-2 text-sm">
              A: Error Budget = 100% - SLO. For 99.9% SLO over 30 days: 0.1% ×
              30 days = 43.2 minutes of acceptable downtime. Or in requests:
              0.1% × total requests = allowed failures. Track consumption over
              time; alert when burn rate indicates early exhaustion.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is burn rate and why does it matter?
            </p>
            <p className="mt-2 text-sm">
              A: Burn rate measures how quickly you&apos;re consuming error
              budget relative to expected rate. Burn rate of 2× means
              you&apos;ll exhaust budget in half the window. It matters because
              it enables proactive alerting — you know you&apos;ll run out of
              budget before it happens, giving time to intervene.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you set appropriate SLO targets?
            </p>
            <p className="mt-2 text-sm">
              A: Start with user expectations — what latency/error rate do users
              notice? Consider business impact of failures. Look at historical
              performance — SLOs should be achievable but require effort. Start
              conservative (99.9%) and adjust. Critical services (payment, auth)
              need stricter SLOs than internal tools.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What happens when a team exhausts their error budget?
            </p>
            <p className="mt-2 text-sm">
              A: Should trigger predefined policy: feature freeze (no new
              features until reliability improves), change freeze (no risky
              deployments), reliability sprint dedicated to fixing issues, and
              post-mortem to understand root cause. Policy must be enforced
              consistently or SLOs become meaningless.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you alert on SLOs without causing alert fatigue?
            </p>
            <p className="mt-2 text-sm">
              A: Alert on burn rate, not raw error rate. Use multi-window burn
              rate (1 hour, 6 hours, 30 days) to detect both sudden spikes and
              sustained issues. Set appropriate thresholds (page at 14.4× burn
              rate, ticket at 3×). Group alerts by service. Implement cooldown
              and escalation policies.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://sre.google/sre-book/monitoring-distributed-systems/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google SRE Book — Monitoring Distributed Systems
            </a>
          </li>
          <li>
            <a
              href="https://sre.google/workbook/implementing-slos/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google SRE Workbook — Implementing SLOs
            </a>
          </li>
          <li>
            <a
              href="https://landing.google.com/sre/resources/fieldguide-to-slos/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google SRE — Field Guide to SLOs
            </a>
          </li>
          <li>
            <a
              href="https://www.atlassian.com/incident-management/kpis/sla-slo-sli"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Atlassian — SLA vs SLO vs SLI
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
