"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-alerting-anomaly-detection-dashboard",
  title: "Design an Alerting & Anomaly Detection Dashboard",
  description:
    "Principal-level design of an alerting and anomaly detection dashboard with rule evaluation, anomaly baselines, state machines, grouping, inhibition, routing, on-call workflows, replay, and noise reduction.",
  category: "high-level-design",
  subcategory: "data-heavy-systems",
  slug: "alerting-anomaly-detection-dashboard",
  wordCount: 5700,
  readingTime: 33,
  lastUpdated: "2026-05-22",
  tags: ["hld", "alerting", "anomaly-detection", "pagerduty", "oncall", "z-score", "arima", "alert-fatigue"],
  relatedTopics: ["log-monitoring-ui", "time-series-visualization"],
};

export default function AlertingAnomalyDetectionDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          An alerting and anomaly detection dashboard helps teams define alert rules, detect abnormal behavior, route notifications, manage active incidents, and reduce operational noise. The primary user is often an on-call engineer who may be tired, under pressure, and trying to decide within seconds whether a page is real, severe, actionable, and owned by their team.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level design goal is alert quality, not alert volume. A system that pages engineers for noisy, unactionable conditions trains them to ignore alerts. The dashboard must make real alerts actionable while providing tooling to suppress, group, replay, tune, and delete bad rules.
        </HighlightBlock>
        <p>
          The system has two related but different jobs. Alerting evaluates known conditions such as error rate above threshold, no data for a service, or latency burn rate exceeding an SLO. Anomaly detection identifies unexpected deviations from historical or seasonal behavior. Alerting is explainable and reliable for known failure modes. Anomaly detection can catch unknown patterns but often has higher false-positive risk.
        </p>
        <p>
          An interview-ready design must cover evaluation state, rule ownership, routing, deduplication, silences, inhibition, notification delivery, replay against history, on-call escalation, and metrics that measure alert quality. Without these operational controls, the system is only a rule editor, not a production alerting platform.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Alert rules describe a signal, condition, duration, severity, owner, routing policy, and runbook. The condition can be a threshold, rate of change, absence of data, burn-rate expression, or anomaly score. The duration clause prevents one-sample spikes from paging humans.
        </p>
        <p>
          The alert engine evaluates rules on a schedule. Each rule can produce many alert instances because the same expression may match many label sets, such as service, region, cluster, endpoint, or customer tier. The engine must track state per rule and label set, not only per rule.
        </p>
        <HighlightBlock as="p" tier="important">
          Alert state must be durable. Pending, firing, acknowledged, silenced, resolved, and inhibited transitions should survive evaluator restarts and should be auditable. In-memory-only alert state creates duplicate pages, lost acknowledgements, and confusing incident timelines.
        </HighlightBlock>
        <p>
          Grouping reduces notification storms by bundling related alerts that fire close together. Inhibition suppresses downstream alerts when a likely root-cause alert is already firing. Silences suppress known maintenance windows or temporary work. These mechanisms are essential for avoiding alert fatigue in large systems.
        </p>
        <p>
          Anomaly detection needs baseline context. Simple z-score can work for stable metrics. Seasonal baselines work better for daily or weekly patterns. Isolation forests and other models can catch unusual multi-dimensional behavior but are harder to explain. For paging alerts, explainability and low false-positive rate matter more than model sophistication.
        </p>
        <p>
          Routing maps alert labels and severity to destinations such as PagerDuty, Slack, email, ticketing systems, or incident platforms. Routing also resolves on-call schedules, escalation chains, notification throttles, and ownership. A critical alert without a clear owner is operational debt.
        </p>
        <p>
          Principal-level alerting also requires alert lifecycle governance. Rule creation, edits, silences, ownership changes, and routing changes should be reviewed or at least audited. A misconfigured rule can page hundreds of engineers or suppress a real outage. The UI should show rule age, last edited actor, replay result, recent firing history, linked incidents, and whether the rule has ever produced an actionable page.
        </p>
        <p>
          Alert quality must be measured as a product metric. Pages per service, false-positive rate, percentage of pages tied to incidents, acknowledgement delay, auto-resolve-before-acknowledge rate, and stale runbooks are signals that tell platform teams whether alerting is helping or hurting reliability. Without those metrics, organizations accumulate noisy rules indefinitely.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has five planes. The rule plane stores rule definitions, ownership, runbooks, and replay results. The evaluation plane queries metrics and computes state transitions. The anomaly plane trains and applies baselines or models. The routing plane groups, inhibits, silences, deduplicates, and sends notifications. The dashboard plane shows active alerts, timelines, tuning insights, and alert quality metrics.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/alerting-anomaly-detection-dashboard.svg"
          alt="Alerting and anomaly detection dashboard architecture with rule builder, alert engine, anomaly detection, notification routing, grouping, suppression, and dashboard."
          caption="Alerting platforms combine stateful rule evaluation, anomaly baselines, grouping, inhibition, routing, and dashboard workflows for incident response and noise reduction."
        />
        <p>
          The evaluation flow starts with a scheduler that selects due rules. The alert engine queries the metrics backend for each rule, evaluates the condition for each returned label set, updates or creates alert instances, and persists state transitions. When an instance moves to firing, it emits an alert event to the routing pipeline. The router applies silences, inhibition rules, grouping windows, deduplication, and destination policies before notifying humans.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/alerting-state-routing-flow.svg"
          alt="Alert state and routing flow showing scheduler, evaluator, durable state machine, grouping, inhibition, silences, notification router, PagerDuty, Slack, and escalation."
          caption="Durable alert state and routing controls prevent evaluator crashes, duplicate notifications, and downstream alert storms from overwhelming on-call engineers."
        />
        <p>
          Anomaly detection has a separate lifecycle. Historical data is used to train or refresh baselines. The anomaly service computes expected ranges, residuals, or anomaly scores, then emits anomaly candidates with enough explanation for the dashboard. High-confidence anomalies can become warning alerts, while lower-confidence anomalies should usually appear as investigation signals rather than pages.
        </p>
        <p>
          Rule replay should be treated as a pre-production environment for alerts. Before enabling a rule, the owner can run it over recent history and see when it would have fired, how long it would have stayed active, which labels would have grouped together, which silences would have applied, and how many pages would have been sent. This prevents theoretical alert rules from becoming production noise.
        </p>
        <p>
          The dashboard should also support incident-linked rule tuning. After an incident, responders should be able to mark whether alerts were early, late, noisy, missing, or misrouted. That feedback should attach to the rule and inform future tuning. This closes the loop between alert configuration and real operational outcomes instead of relying on subjective memory after the incident has faded.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-heavy-systems/alerting-anomaly-replay-flow.svg"
          alt="Anomaly baseline and replay flow showing historical training, expected bands, anomaly scoring, rule replay, false-positive analysis, and tuning recommendations."
          caption="Rule replay and anomaly baselines let teams estimate false positives before enabling a rule and tune noisy alerts using historical evidence."
        />
        <p>
          Principal-level alerting systems need an explicit signal lifecycle. A candidate alert starts as an experimental detector, graduates to non-paging notification, then becomes paging only after it proves precision, ownership, and remediation value. The dashboard should show detector maturity, recent false-positive rate, owner, runbook, and whether the alert is allowed to wake someone. This prevents teams from turning every anomaly score into a production page.
        </p>
        <p>
          The architecture should separate detection, routing, and incident state. Detection computes whether a signal is abnormal. Routing decides who should know based on ownership, service dependency, time of day, severity, and suppression policy. Incident state records acknowledgement, escalation, linked deploys, mitigation, and resolution. Mixing these concerns makes it difficult to tune noisy detectors without losing incident history.
        </p>
        <p>
          Detector evaluation should also be capacity-aware. A platform with thousands of rules cannot let every rule query broad historical ranges at the same cadence. The scheduler should shard rules, enforce evaluation budgets, prioritize user-impacting pages, and degrade non-paging anomaly scans before critical SLO alerts. The dashboard should show evaluation lag because a late alert evaluation changes how responders interpret detection time.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          Threshold alerts are simple, explainable, and predictable. They are best for well-understood user-impacting signals such as error rate, availability, queue age, SLO burn rate, and failed payment rate. Their weakness is that fixed thresholds often ignore seasonality and changing traffic levels.
        </p>
        <p>
          Anomaly alerts are useful for detecting unexpected behavior in seasonal or poorly understood metrics. Their weakness is false positives, model drift, and lower explainability. For wake-up pages, anomaly detection should usually be conservative and supported by visual baseline evidence. For Slack investigation signals, it can be more exploratory.
        </p>
        <HighlightBlock as="p" tier="important">
          Paging policy is a product decision. Critical pages should be tied to user impact, fast actionability, and a known owner. Warnings can go to Slack. Informational anomalies can go to dashboards. Treating every interesting deviation as a page creates alert fatigue.
        </HighlightBlock>
        <p>
          Centralized alert evaluation gives consistent routing, state, silences, and audit logs, but it can become a scaling bottleneck. Distributed evaluators scale better, but require careful sharding, lease management, idempotent state transitions, and deduplication to avoid duplicate notifications.
        </p>
        <p>
          Grouping waits slightly before sending notifications so related alerts can be batched. This reduces noise but delays the first notification. Critical alerts may use short group waits, while warning notifications can wait longer to accumulate context.
        </p>
        <p>
          Suppression windows reduce noise during planned maintenance, but broad silences can hide real incidents. Silences need explicit scope, expiration, owner, reason, and audit trail. The dashboard should show when alerts are currently silenced.
        </p>
        <p>
          Central model-based anomaly detection is powerful but can create trust issues when users cannot explain the score. Local rule-based anomaly detection per service is easier to own but duplicates effort and may miss cross-service patterns. A mature platform offers explainable shared baselines for common metrics and allows teams to layer service-specific thresholds and runbooks on top.
        </p>
        <p>
          Alert ownership can be centralized or delegated. Central SRE ownership creates consistency but does not scale to every product-specific signal. Team-owned alerts preserve context but can drift into inconsistent severity and routing. A principal-ready platform supports team ownership with central guardrails: required runbooks, severity definitions, replay before paging, stale-rule reviews, and global emergency controls.
        </p>
        <p>
          Model confidence separately from severity. A severe business impact with weak anomaly confidence should be routed differently from a high-confidence infrastructure failure with limited blast radius. The UI should show observed value, expected band, seasonality context, training window, missing-data behavior, and confidence. This lets responders decide whether to investigate, suppress, or wait for corroborating signals.
        </p>
        <p>
          Treat suppressions as auditable policy, not temporary UI state. Maintenance windows, known incidents, deploy suppressions, customer-specific suppressions, and detector warm-up periods should have owner, scope, start, end, and reason. Silent or indefinite suppressions are a common reason important alerts disappear.
        </p>
        <p>
          Automated remediation is another trade-off. Linking an alert to an auto-rollback, traffic shift, cache purge, or queue drain can reduce incident duration, but a false positive can create a larger outage. Mature systems start with human-in-the-loop runbooks, add automation for narrow and reversible actions, and require stronger confidence, blast-radius limits, and audit for self-healing actions.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Require every paging alert to have an owner, runbook, severity, actionability statement, and expected user impact. Alerts without these fields should not be allowed to page humans.
        </p>
        <p>
          Provide rule replay before enabling a rule. Applying the rule to recent history gives estimated firing count, false-positive candidates, noisy time windows, and example incidents. This is one of the best controls for preventing bad rules from entering production.
        </p>
        <p>
          Use SLO burn-rate alerts for user-impacting reliability signals. Multi-window burn-rate alerts are often better than raw error-rate thresholds because they capture both fast outages and slow burns against an error budget.
        </p>
        <p>
          Persist every state transition and notification attempt. Alert timelines should show when the condition started, when the alert fired, who acknowledged it, what notifications were sent, which silences or inhibition rules applied, and when it resolved.
        </p>
        <p>
          Make alert quality visible. Track pages per service, false-positive rate, auto-resolved-within-five-minutes rate, alert-to-incident correlation, MTTA, MTTR, acknowledgement delay, and alerts without runbooks.
        </p>
        <p>
          Keep anomaly detection explainable. Show expected bands, actual value, deviation, seasonality context, and previous similar events. If on-call engineers cannot understand why an anomaly fired, they will not trust it.
        </p>
        <p>
          Connect alerts to incident workflows. A firing page should open directly into relevant dashboards, logs, traces, recent deploys, owners, and runbooks. A resolved alert should update the timeline and support post-incident analysis. Alerting is most valuable when it shortens diagnosis, not just when it sends a notification.
        </p>
        <p>
          Review alert portfolios periodically. The dashboard should identify rules that have not fired in months, rules that fire often without incident links, routes with no active owner, and runbooks that have not been reviewed. Alert debt compounds quietly; portfolio review keeps the system aligned with current architecture and current on-call ownership.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          The most damaging pitfall is creating alerts for symptoms that require no action. Every unactionable page reduces trust in the system. Alerts should map to decisions and owners.
        </p>
        <p>
          Another pitfall is storing alert state only in memory. Evaluator restarts then create duplicate pages or lose pending duration. Durable per-label-set state is required for a reliable alerting platform.
        </p>
        <p>
          Teams often add anomaly detection before cleaning up threshold alert quality. Anomaly detection does not fix poor ownership, missing runbooks, or noisy routing. It can make noise worse if introduced without replay and tuning workflows.
        </p>
        <p>
          Broad silences can hide unrelated incidents. Suppression rules should be narrow, time-bound, auditable, and visible in the dashboard.
        </p>
        <p>
          Alert grouping without careful labels can merge unrelated incidents or fail to merge related ones. Grouping labels should reflect operational ownership and root-cause domains, not arbitrary metric labels.
        </p>
        <p>
          Another pitfall is training anomaly models on bad history. Incident periods, deploy experiments, backfills, and missing-data windows can pollute baselines. The dashboard should let owners exclude ranges, annotate known abnormal periods, and understand when a model is still warming up.
        </p>
        <p>
          Alert dashboards also fail when they do not distinguish no data from healthy data. A missing metric, broken scraper, delayed warehouse job, or disabled integration can look like a normal zero. Principal-ready designs make missing-data policy explicit for every detector.
        </p>
        <p>
          A less obvious pitfall is measuring alert success only by page count. Fewer pages can mean better signal, but it can also mean missing incidents. The dashboard should connect alerts to incidents, customer impact, time to acknowledge, time to mitigate, and post-incident feedback so teams improve reliability rather than merely reducing noise.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          SRE teams use alert dashboards to manage service reliability alerts, SLO burn rates, deployment regressions, dependency outages, and incident response timelines.
        </p>
        <p>
          Payments and commerce teams alert on checkout failure rate, payment authorization drop, fraud decision latency, inventory sync lag, and order processing backlogs. These alerts need low false-positive rates because they often page business-critical on-call rotations.
        </p>
        <p>
          Data platform teams alert on pipeline freshness, failed jobs, schema drift, data quality thresholds, and warehouse cost anomalies. Anomaly detection is useful for unusual cost or volume patterns, but pipeline failure alerts should remain deterministic.
        </p>
        <p>
          Security and abuse teams use anomaly detection for unusual login volume, suspicious traffic spikes, credential stuffing patterns, or sudden changes in moderation queues. These often start as warning-level investigation signals before becoming automated pages.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. How would you design the alert evaluation engine?</h3>
        <p>
          I would run scheduled evaluations for active rules, query the metrics backend, evaluate conditions per label set, and persist state transitions in durable storage. Each alert instance is keyed by rule and label set. The engine supports pending duration before firing, resolved transitions when conditions clear, and idempotent event emission to the routing pipeline.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. How do you reduce alert fatigue?</h3>
        <p>
          Require ownership and runbooks, use pending durations, group related alerts, inhibit downstream alerts when a root-cause alert is firing, support scoped silences, replay rules before activation, and track alert quality metrics. Critical pages should be reserved for actionable user-impacting issues.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. When would you use anomaly detection?</h3>
        <p>
          I would use anomaly detection for seasonal or poorly understood metrics where fixed thresholds are inadequate. For paging, I would use it conservatively and require clear expected bands and low false-positive rates. For exploratory detection, I would route anomalies to Slack or dashboards first and promote only proven signals to paging.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How do grouping and inhibition work?</h3>
        <p>
          Grouping batches related alerts by labels such as service, team, severity, region, or cluster within a short window. Inhibition suppresses target alerts when a source alert is already firing, such as suppressing dependent service alerts when a database-down alert exists in the same region. Both need careful labels and auditability.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How would you validate an alert rule before enabling it?</h3>
        <p>
          I would replay the rule over historical data and show firing count, affected services, firing duration, overlap with known incidents, auto-resolved events, and noise windows. Builders can adjust threshold, duration, labels, or severity before publishing. This prevents rules that would immediately spam on-call.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What metrics would you monitor for the alerting system itself?</h3>
        <p>
          I would monitor evaluator lag, rule evaluation duration, query failures, alert event delivery latency, notification delivery success, duplicate notification rate, routing failures, page volume, false-positive proxies, MTTA, MTTR, silenced alert count, and rules without owners or runbooks.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://prometheus.io/docs/alerting/latest/alertmanager/" target="_blank" rel="noreferrer">Prometheus Alertmanager Documentation</a></li>
          <li><a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noreferrer">Google SRE Book: Monitoring Distributed Systems</a></li>
          <li><a href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noreferrer">Google SRE Workbook: Alerting on SLOs</a></li>
          <li><a href="https://support.pagerduty.com/docs/event-management" target="_blank" rel="noreferrer">PagerDuty Documentation: Event Management</a></li>
          <li><a href="https://grafana.com/docs/grafana/latest/alerting/" target="_blank" rel="noreferrer">Grafana Alerting Documentation</a></li>
          <li><a href="https://otexts.com/fpp3/stl.html" target="_blank" rel="noreferrer">Forecasting: STL Decomposition</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
