"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-dashboards-extensive",
  title: "Dashboards",
  description:
    "Build dashboards that tell an operational story: user impact first, then drilldowns that accelerate diagnosis.",
  category: "backend",
  subcategory: "monitoring-operations",
  slug: "dashboards",
  wordCount: 1122,
  readingTime: 5,
  lastUpdated: "2026-03-14",
  tags: ["backend", "monitoring", "dashboards", "observability", "operations"],
  relatedTopics: ["metrics", "alerting", "logging", "distributed-tracing", "observability"],
};

export default function DashboardsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Purpose</h2>
        <p>
          <strong>Dashboards</strong> are curated views that turn telemetry into situational awareness. They are not a
          random collection of charts. A useful dashboard answers specific questions quickly: “Are users impacted?” “What
          changed?” “Where is the bottleneck?” “Did the mitigation work?”
        </p>
        <p>
          The most important property of a dashboard is not aesthetic quality, it is <strong>decision value</strong>.
          Every panel should either help detect impact, narrow scope, isolate a cause, or verify recovery. If it does
          none of those, it is likely noise.
        </p>
        <p>
          Good defaults matter. Choose a sensible time range, show percentiles (not averages) for latency, and make it
          obvious when data is missing so “no signal” is not misread as “no problem.”
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Dashboards Are an Interface</h3>
          <p className="mb-3">
            In an incident, dashboards are the control panel. If the interface is confusing, slow, or inconsistent,
            responders waste time and make worse decisions.
          </p>
          <ul className="space-y-2">
            <li>Favor clarity over density.</li>
            <li>Use consistent units, naming, and time windows.</li>
            <li>Make drilldowns obvious and fast.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Audience and Layering</h2>
        <p>
          A common failure is trying to serve every audience with one dashboard. The result is a “Christmas tree” of
          panels that nobody can use. Better practice is layering: an overview for impact, then drilldowns for diagnosis.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/monitoring-operations/dashboards-diagram-1.svg"
          alt="Dashboard layering hierarchy from overview to drilldown"
          caption="Layering: overview dashboards show impact; drilldowns isolate a tier, dependency, or region."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Journey overview:</strong> availability and tail latency for the handful of flows users care about.
          </li>
          <li>
            <strong>Service drilldown:</strong> errors, saturation, and dependency overlays for one service or tier.
          </li>
          <li>
            <strong>Dependency drilldown:</strong> downstream health, timeouts, retries, and error fingerprints.
          </li>
          <li>
            <strong>Infrastructure drilldown:</strong> node pressure, storage, network, and resource contention.
          </li>
        </ul>
        <p className="mt-4">
          Layering also creates a consistent incident path: responders start at the overview, identify affected journeys,
          then pivot to the relevant drilldown. This reduces the time spent debating “where do we look first.”
        </p>
      </section>

      <section>
        <h2>Panel Design: Make Comparisons Easy</h2>
        <p>
          Dashboards exist to support comparisons: now vs earlier, this region vs others, this version vs previous, this
          tenant tier vs baseline. Panels should be built so comparisons are natural, not an extra query responders have
          to craft under pressure.
        </p>
        <p>
          Strong dashboards center on a few durable panel types: rates (request volume, error rate), percentiles (p95/p99
          latency), saturation (pool wait, queue depth), and dependency overlays (timeouts, retry rate). These are the
          building blocks of reliable incident diagnosis.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Annotations and Context</h3>
          <p className="mb-3">
            Without context, graphs invite incorrect stories. Add markers that correlate system change to behavior change.
          </p>
          <ul className="space-y-2">
            <li>Deploy and config change markers.</li>
            <li>Known dependency incidents (provider outage windows).</li>
            <li>Traffic events (campaigns, batch backfills, scheduled jobs).</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Drilldowns and Pivots</h2>
        <p>
          The best dashboards are not self-contained. They provide curated pivots: from an impacted journey to the
          service that owns it, from a service to the slow dependency, from a dependency to a trace view, and from a trace
          to the correlated logs. Dashboards are the start of the investigation, not the entire investigation.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Stable filters:</strong> route, region, tenant tier, and version are common first pivots.
          </li>
          <li>
            <strong>Top contributors:</strong> “top routes by error” or “top dependencies by latency contribution.”
          </li>
          <li>
            <strong>Links to runbooks:</strong> panels that require action should link to the relevant playbook.
          </li>
          <li>
            <strong>Cross-signal pivots:</strong> jump to trace/log views with the right filters pre-applied.
          </li>
        </ul>
        <p className="mt-4">
          This pivot design is what turns dashboards from “pretty graphs” into an operational tool. Without pivots,
          dashboards slow responders down by forcing them to manually reconstruct context.
        </p>
      </section>

      <section>
        <h2>Common Anti-Patterns</h2>
        <p>
          Dashboards accumulate over time. Without pruning, they become misleading and hard to operate. Most dashboard
          failures come from too many panels and inconsistent semantics, not from missing data sources.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/monitoring-operations/dashboards-diagram-2.svg"
          alt="Dashboard anti-patterns diagram"
          caption="Anti-patterns: the Christmas tree, inconsistent units, and panels that do not map to decisions."
        />
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Vanity metrics:</strong> CPU or memory charts with no link to user impact and no action threshold.
          </li>
          <li>
            <strong>Too many panels:</strong> responders cannot find the important charts quickly.
          </li>
          <li>
            <strong>Inconsistent units:</strong> milliseconds vs seconds, per-second vs per-minute rates, mixed scales.
          </li>
          <li>
            <strong>Missing “unknown” handling:</strong> gaps look like zeros; outages look like “no traffic.”
          </li>
          <li>
            <strong>Unowned dashboards:</strong> no one updates panels when services change, causing drift.
          </li>
        </ul>
      </section>

      <section>
        <h2>Operational Usage: Detect, Diagnose, Verify</h2>
        <p>
          Dashboards should support the incident lifecycle. For detection, they show impact signals and trends. For
          diagnosis, they show saturation and dependency overlays. For verification, they show recovery in the same
          signals that detected the incident.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">A Consistent Dashboard Path</h3>
          <ol className="space-y-2">
            <li>
              <strong>Start:</strong> journey overview and SLO burn signals to confirm severity and scope.
            </li>
            <li>
              <strong>Narrow:</strong> segment by route/region/version to find blast radius.
            </li>
            <li>
              <strong>Isolate:</strong> move to service and dependency drilldowns; identify the dominant contributor.
            </li>
            <li>
              <strong>Mitigate:</strong> apply safe levers and watch the same panels recover.
            </li>
          </ol>
        </div>
        <p>
          This path is also a training tool. New responders can learn how the system fails by following the same
          dashboard journey during incident drills.
        </p>
      </section>

      <section>
        <h2>Governance: Dashboards as a Maintained Asset</h2>
        <p>
          Dashboards degrade without governance. The strongest pattern is “dashboards as code”: versioned definitions,
          review for semantic correctness, and changes tied to service changes. Even if you build dashboards in a UI, treat
          them like production artifacts with owners and review cadence.
        </p>
        <p>
          Governance also includes cost control and access control. Some dashboards can be expensive to query during
          incidents. A stable set of “incident dashboards” should be designed for fast queries and resilience under
          telemetry spikes.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/monitoring-operations/dashboards-diagram-3.svg"
          alt="Dashboard governance diagram"
          caption="Governance: ownership, review cadence, deprecation, and cost-aware incident dashboards."
        />
        <ul className="mt-4 space-y-2">
          <li>Assign owners and review dashboards after major incidents.</li>
          <li>Deprecate dashboards that are unused or that do not map to decisions.</li>
          <li>Maintain a minimal set of fast incident dashboards with stable filters and semantics.</li>
          <li>Document panel intent: what question it answers and what action it informs.</li>
        </ul>
      </section>

      <section>
        <h2>Scenario Walkthrough</h2>
        <p>
          Users report slowness in search. The journey overview shows elevated p99 latency, concentrated in one region.
          The service drilldown shows increased downstream timeouts from a search index cluster, while CPU on the API tier
          remains stable. That quickly separates “compute saturation” from “dependency failure.”
        </p>
        <p>
          Responders mitigate by shifting traffic away from the affected region and temporarily reducing query fanout. The
          dashboards used for detection are also used for verification: p99 latency and timeout rate return to baseline.
        </p>
        <p>
          In the post-incident review, the team removes three panels that added noise (instance CPU) and adds a better
          diagnostic panel: “top dependencies by latency contribution,” making the next incident faster to isolate.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <p>Use this checklist when creating or reviewing dashboards.</p>
        <ul className="mt-4 space-y-2">
          <li>Define the audience and purpose; do not mix overview and deep drilldown in one dashboard.</li>
          <li>Start with user-impact signals (availability, tail latency) and add diagnostic overlays second.</li>
          <li>Use consistent units, naming, and time windows; ensure comparisons are easy.</li>
          <li>Add annotations for deploys, config changes, and known external events.</li>
          <li>Design pivots to traces/logs/runbooks with filters pre-applied.</li>
          <li>Prune panels that do not inform decisions; keep incident dashboards fast and stable.</li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <p>Explain dashboards as an operational interface, not as a charting tool.</p>
        <ul className="mt-4 space-y-2">
          <li>How do you decide what goes on an overview dashboard vs a drilldown?</li>
          <li>What are the most common dashboard anti-patterns and how do you fix them?</li>
          <li>How do you design dashboards to support incident response end-to-end?</li>
          <li>How do you keep dashboards correct and maintained as services change?</li>
          <li>How do you make dashboards resilient and fast when telemetry volume spikes?</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
