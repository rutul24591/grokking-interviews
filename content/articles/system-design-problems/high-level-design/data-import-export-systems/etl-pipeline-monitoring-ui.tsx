"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";

const metadata = {
  id: "article-hld-etl-pipeline-monitoring-ui",
  title: "Design an ETL Pipeline Monitoring UI",
  description:
    "Principal-level design of an ETL observability UI with pipeline DAGs, run timelines, metrics, data quality checks, SLA monitoring, checkpoint retry, lineage, logs, and operator workflows.",
  category: "high-level-design",
  subcategory: "data-import-export-systems",
  slug: "etl-pipeline-monitoring-ui",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-22",
  readTime: "32 min read",
  difficulty: "Advanced",
  tags: ["ETL", "Prometheus", "Grafana", "PagerDuty", "Data Quality", "SLA Monitoring"],
};

export default function EtlPipelineMonitoringUi() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          An ETL pipeline monitoring UI helps data platform teams observe extract, transform, and load workflows across batch, micro-batch, and streaming systems. It shows pipeline DAGs, run history, stage status, throughput, latency, data quality, freshness, SLA breaches, retries, logs, lineage, and downstream impact.
        </p>
        <HighlightBlock as="p" tier="crucial">
          The principal-level goal is not just showing whether a job failed. The UI must help operators answer what failed, why it failed, what data is affected, which downstream dashboards or customers are impacted, whether retry is safe, and how to restore correctness without rerunning unnecessary work.
        </HighlightBlock>
        <p>
          ETL failures often surface indirectly through stale dashboards, bad metrics, missing reports, or analyst complaints. A strong monitoring UI detects issues before consumers do, highlights freshness and quality risk, and provides safe recovery actions such as retry from checkpoint, skip bad partition, quarantine bad rows, or backfill a window.
        </p>
        <p>
          This is a system design problem across orchestration, metrics, logs, lineage, data quality, alerting, and human operations. The UI must turn large amounts of pipeline telemetry into an actionable operating surface.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          A pipeline run is a durable execution of a pipeline definition. It has run id, scheduled time, actual start time, status, stages, attempts, checkpoints, inputs, outputs, row counts, watermarks, quality results, and lineage. Scheduled time matters because a run can start late but still be responsible for a specific data window.
        </p>
        <p>
          The DAG view shows dependencies between stages and datasets. Each node should show status, duration, rows processed, bytes processed, retry count, and quality score. Edges represent data flow or execution dependency. Operators need both current status and historical comparison to detect slowdowns.
        </p>
        <HighlightBlock as="p" tier="important">
          Data quality is first-class telemetry. A pipeline that finishes successfully but loads duplicate, stale, or malformed data is still a failure. Quality checks should produce structured results, thresholds, severity, sample failures, and downstream impact.
        </HighlightBlock>
        <p>
          Freshness and SLA tracking connect pipeline runs to consumer expectations. A run can be technically successful but late enough to break a dashboard SLA. The UI should show expected completion, actual completion, delay, breach severity, and downstream assets affected by stale data.
        </p>
        <p>
          Checkpoint-based retry makes recovery safe and efficient. Instead of rerunning the entire pipeline, operators can restart from the last successful stage, partition, watermark, or batch. Retry must be idempotent because repeated loads can otherwise duplicate rows or corrupt downstream aggregates.
        </p>
        <p>
          Lineage explains blast radius. When a pipeline fails, operators need to know which target tables, dashboards, reports, ML features, and downstream pipelines depend on the affected data.
        </p>
        <p>
          At principal level, the UI must distinguish pipeline orchestration health from data-product health. A DAG can be green because every task ran successfully while the output is wrong, late, duplicated, or missing important segments. Conversely, a task can fail in a non-critical branch without breaking a downstream dashboard. The monitoring experience should show task state, data quality state, freshness SLA, lineage impact, and consumer-facing blast radius as separate but connected signals.
        </p>
        <p>
          The same pipeline may serve very different users. Data engineers need logs, retries, partition keys, backfill controls, and dependency graphs. Analysts need freshness and quality confidence for a dataset. Executives need to know whether a dashboard is trustworthy. A principal-ready answer explains how the UI layers those views without giving every user dangerous operational controls.
        </p>
        <p>
          Schema drift is a first-class monitoring concern. Upstream sources can add columns, remove fields, change types, alter enum values, or change timestamp semantics without breaking the extraction task immediately. The UI should surface drift events, affected transformations, compatibility status, and whether downstream datasets are operating under degraded assumptions. This is often more important than job status because silent schema drift creates wrong analytics while the pipeline stays green.
        </p>
        <p>
          Data ownership should be explicit. A dataset has a producing team, consuming teams, SLA tier, quality rules, escalation path, and business criticality. The monitoring system should not page a generic platform channel for every issue. It should route alerts to the responsible data product owner and show downstream subscribers who need to know whether data is stale or degraded.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          The architecture has five planes. The orchestration plane emits run and stage events. The metrics plane collects throughput, latency, freshness, and quality metrics. The log plane captures structured stage logs. The lineage plane records source-to-target relationships. The UI plane combines these signals into a run dashboard, DAG view, alert surface, and recovery console.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/etl-pipeline-monitoring-ui.svg"
          alt="ETL pipeline monitoring UI architecture with orchestrator, pipeline events, metrics, logs, data quality, lineage, SLA alerts, and dashboard."
          caption="ETL monitoring combines run state, metrics, logs, data quality, lineage, and recovery actions so operators can diagnose and repair pipeline failures safely."
        />
        <p>
          During execution, the orchestrator emits run-started, stage-started, checkpoint-written, quality-check-completed, stage-failed, stage-succeeded, and run-completed events. These events update a run store for the UI and feed metrics and alerting systems. Structured logs are keyed by pipeline, run, stage, and attempt so the UI can show relevant logs without manual searching.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/etl-monitoring-signal-flow.svg"
          alt="ETL monitoring signal flow from orchestrator events to run store, metrics, logs, quality results, lineage graph, alerts, and UI."
          caption="The monitoring UI is a correlation surface over multiple telemetry stores, not a single job-status table."
        />
        <p>
          Data quality checks run during or after transformation. Checks can validate schema, null rate, uniqueness, referential integrity, distribution drift, row count anomaly, freshness, and business rules. Error-severity checks can fail the pipeline or quarantine rows. Warning-severity checks can allow loading while marking the dataset as degraded.
        </p>
        <p>
          Recovery actions are guarded. Retry from checkpoint, rerun stage, backfill partition, skip bad rows, or mark false alarm should require permissions, record audit events, and show expected downstream effects. For sensitive pipelines, destructive actions may require approval.
        </p>
        <p>
          The monitoring plane should be event-driven but queryable. State transitions, validation results, retries, and manual actions are appended as events. Read models are built for DAG views, dataset views, incident views, and SLA views. This lets the UI answer both what is happening right now and why yesterday&apos;s revenue dashboard was wrong without scraping logs or reverse-engineering state from task tables.
        </p>
        <p>
          Dataset-level views are as important as pipeline-level views. A consumer often knows that the "daily revenue" table is stale, not which upstream extraction stage caused it. The UI should let users start from a dataset, see latest successful materialization, quality confidence, upstream lineage, active incidents, owner, SLA, and safe escalation path. This prevents the tool from being useful only to people who already understand the pipeline DAG.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/etl-retry-lineage-flow.svg"
          alt="ETL retry and lineage flow showing checkpoint, failed stage, safe retry, idempotent load, affected datasets, dashboards, and audit trail."
          caption="Checkpoint retry and lineage make recovery targeted: restart only the affected work and show which downstream assets remain stale or degraded."
        />
        <p>
          The UI should support an incident workflow around data failures. When a quality rule fails or freshness SLA breaches, the system can open an incident state with owner, severity, affected datasets, suspected cause, mitigation, and consumer communication. Operator actions such as retry, quarantine, backfill, suppress alert, or mark degraded should attach to that incident. This gives teams a durable narrative instead of scattered chat messages and dashboard screenshots.
        </p>
        <p>
          Source-system protection must be built into recovery actions. Retrying an extraction from a production database, SaaS API, or partner feed can worsen the outage if the source is already unhealthy. The monitoring UI should show source rate limits, current source health, last successful watermark, and retry budget before allowing large backfills or repeated extraction attempts. This turns recovery from a blind button click into a controlled operational decision.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2>
        <p>
          Polling orchestrator state is simple but can miss fine-grained stage events and creates load at scale. Event-driven monitoring gives fresher and more detailed telemetry, but requires durable event ingestion, ordering strategy, and replay for UI consistency.
        </p>
        <p>
          Metrics are excellent for trends and alerts, while logs explain specific failures. A monitoring UI needs both. Metrics show that row throughput dropped. Logs show which source partition or schema field caused the problem.
        </p>
        <HighlightBlock as="p" tier="important">
          Data quality checks trade pipeline availability against correctness. Strict checks prevent bad data from landing but can block downstream consumers. Warning checks preserve availability but require clear degradation labels so consumers know the data is suspect.
        </HighlightBlock>
        <p>
          Exact lineage is powerful but expensive to maintain across dynamic SQL, notebooks, generated jobs, and external tools. Table-level lineage is easier and often sufficient for incident blast radius. Column-level lineage is more precise but requires stronger parsing and governance.
        </p>
        <p>
          Automatic retries improve reliability for transient failures but can hide systemic issues or repeatedly load bad data. Retries should be bounded, idempotent, and visible. Consecutive failures should escalate.
        </p>
        <p>
          A generic dashboard can show many pipelines quickly, but operators often need pipeline-specific runbooks and metrics. The platform should support common primitives while allowing pipeline teams to add contextual panels and links.
        </p>
        <p>
          Real-time streaming updates are valuable for active runs, but historical debugging often needs consistent snapshots. If the UI continuously mutates while an engineer investigates, they can lose context. A strong design provides a live mode for current runs and a frozen investigation view for completed or incident-linked runs. The frozen view should preserve the exact run graph, task attempts, validation results, and lineage impact known at the time.
        </p>
        <p>
          Retry controls have a safety trade-off. Fast self-service retries reduce on-call load, but they can mask systemic failures or overload source systems. The design should support retry budgets, exponential backoff, source-system protection, approval for large backfills, and clear warnings when retrying may create duplicate writes or invalidate downstream datasets.
        </p>
        <p>
          Backfill visibility is a principal-level differentiator. Backfills can run for hours, consume large compute budgets, and temporarily make freshness charts look worse. The UI should distinguish scheduled runs from backfills, show affected windows, isolate backfill metrics from normal SLA metrics where appropriate, and warn when backfill output may overwrite or re-partition data that downstream jobs already consumed.
        </p>
        <p>
          Alerting on freshness can be source-aware or consumer-aware. Source-aware alerts fire when an upstream extraction is late, which helps data engineers fix root causes. Consumer-aware alerts fire when a published dataset or dashboard breaches its SLA, which maps better to business impact. Mature systems use both but route them differently. Otherwise teams either get noisy upstream alerts with no visible user impact or late consumer alerts without enough root-cause context.
        </p>
        <p>
          Lineage precision has operational cost. Table-level lineage is easier to maintain and good for many incidents. Column-level lineage helps explain why one metric changed while the rest of a dashboard is healthy, but it requires stronger SQL parsing, transformation metadata, and governance. A principal-ready answer should explain when table-level lineage is sufficient and when critical finance, compliance, or ML feature pipelines justify deeper lineage.
        </p>
      </section>

      <section>
        <h2>Best practices</h2>
        <p>
          Emit structured lifecycle events from every pipeline run and stage. Include pipeline id, run id, scheduled window, stage id, attempt, input watermark, output watermark, row counts, and status.
        </p>
        <p>
          Standardize quality result schema. Checks should produce rule id, severity, affected column or dataset, observed value, expected threshold, sample failures, and recommended action.
        </p>
        <p>
          Tie alerts to ownership and consumer impact. A failed staging transform with no consumers should not page the same way as a freshness breach on an executive revenue dashboard. The UI should show dataset owner, downstream dashboards, subscribed teams, SLA tier, and active incidents. This transforms the tool from a task monitor into a data reliability control plane.
        </p>
        <p>
          Make freshness visible to consumers. Show when data was expected, when it actually arrived, whether it breached SLA, and which dashboards or reports are stale.
        </p>
        <p>
          Design retries around checkpoints and idempotent writes. Every retry action should state where it will resume and why repeated execution will not duplicate business effects.
        </p>
        <p>
          Correlate logs, metrics, and lineage in one UI. Operators should not copy run ids across multiple tools to understand a failure.
        </p>
        <p>
          Audit manual actions. Retry, skip, backfill, suppress alert, mark resolved, or override quality checks should record actor, reason, timestamp, and affected assets.
        </p>
        <p>
          Make runbooks part of the operating surface. A failure panel should link to owner, recent deploys, schema changes, known incidents, quality rule definitions, and recommended recovery actions. The goal is not to replace human judgment, but to reduce the time from alert to informed action and to keep recovery behavior consistent across on-call rotations.
        </p>
        <p>
          Model data quality rules as versioned contracts. A null-rate threshold, referential-integrity rule, or distribution-drift boundary can change over time. The UI should show which rule version evaluated a run, who changed it, and whether the change relaxed or tightened quality. Without versioned rules, teams cannot explain why a dataset passed last week and failed today under apparently similar input.
        </p>
        <p>
          Provide consumer-facing trust indicators. Analysts and product teams should see freshness, quality status, known incidents, and last successful update near the dataset or dashboard they use. They should not need full operator access to understand whether numbers are safe to use. This reduces unnecessary escalation and keeps dangerous recovery controls limited to trained owners.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          A common pitfall is showing only green or red job status. Operators need stage-level status, quality results, freshness, logs, and lineage to take action.
        </p>
        <p>
          Another pitfall is treating successful completion as data correctness. Pipelines can complete with bad data. Data quality checks and degradation states are required.
        </p>
        <p>
          Retrying from the beginning can waste hours and overload sources. Checkpoint-based retry is essential for large pipelines.
        </p>
        <p>
          Pipeline alerts without downstream impact are hard to prioritize. A failed internal job that affects an executive dashboard is more urgent than one with no active consumers.
        </p>
        <p>
          Manual fixes without audit trail create compliance and debugging gaps. Every operator action should be recorded.
        </p>
        <p>
          Teams often build monitoring only around scheduled batch runs and then struggle with hybrid workloads. Modern data platforms mix streaming ingestion, micro-batch transforms, manual backfills, and ad hoc repair jobs. If the UI cannot represent watermarks, event-time lag, replay windows, and backfill attempts together, operators get an incomplete picture of data correctness.
        </p>
        <p>
          Another pitfall is letting quality checks become unowned noise. If warnings never have owners, expiration, or tuning workflows, users learn to ignore degraded labels. The monitoring system should show rule owner, recent false-positive rate, suppression history, and whether a warning still affects consumer trust.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2>
        <p>
          Data warehouse teams monitor nightly ingestion from product databases into analytics marts. They need freshness, row-count trends, schema drift detection, and downstream dashboard impact.
        </p>
        <p>
          Fintech pipelines reconcile payments, settlements, invoices, and ledger data. Data quality and auditability are critical because silent corruption can create financial discrepancies.
        </p>
        <p>
          ML feature pipelines monitor source freshness, feature distributions, null rates, and training data windows. Quality drift can degrade models even when jobs technically succeed.
        </p>
        <p>
          Marketplace operations monitor catalog, inventory, pricing, and fulfillment feeds. Failed imports or delayed transformations can affect seller operations and customer experience.
        </p>
        <p>
          Data platform teams use ETL monitoring during migrations from batch warehouses to lakehouse or streaming architectures. They compare old and new pipelines, validate row counts and metric parity, monitor lag, and track consumer cutover readiness. The UI becomes a migration control plane because it shows whether both systems are producing equivalent trusted outputs before the old path is retired.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibold">1. What should an ETL monitoring UI show beyond job status?</h3>
        <p>
          It should show DAG stage status, run timeline, duration, throughput, row counts, freshness, SLA breaches, data quality results, logs, retries, checkpoints, lineage, and downstream impact. Operators need enough context to diagnose and recover, not just see that a job failed.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">2. How would you model pipeline run telemetry?</h3>
        <p>
          I would emit structured lifecycle events for run start, stage start, checkpoint, quality result, failure, success, and completion. These update a durable run store, metrics, logs, and lineage records. Each event carries pipeline id, run id, scheduled window, stage, attempt, status, row counts, and watermarks.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">3. How do data quality checks affect pipeline state?</h3>
        <p>
          Quality checks can be error severity or warning severity. Error checks fail or quarantine the run. Warning checks allow the run to complete but mark the output degraded. The UI should show observed values, expected thresholds, sample failures, and downstream assets affected by degraded data.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">4. How would you make retries safe?</h3>
        <p>
          Use checkpoints at stage, partition, or watermark boundaries and make writes idempotent. Retry resumes from a known safe point and uses merge or replace semantics that avoid duplicate rows. Every retry action should record actor, reason, and affected scope.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">5. How do you prioritize pipeline alerts?</h3>
        <p>
          Prioritize by SLA severity, consumer impact, downstream lineage, freshness delay, quality severity, and consecutive failure count. A failed job with no active downstream consumers is less urgent than a stale dataset feeding executive reports or customer-facing features.
        </p>
        <h3 className="mt-6 mb-3 text-lg font-semibold">6. What would you monitor for the monitoring system itself?</h3>
        <p>
          Monitor event ingestion lag, missing heartbeat rate, run-store write latency, metrics freshness, log correlation failures, lineage update failures, alert delivery latency, UI load time, and operator action failure rate.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li><a href="https://airflow.apache.org/docs/apache-airflow/stable/" target="_blank" rel="noreferrer">Apache Airflow Documentation</a></li>
          <li><a href="https://docs.prefect.io/" target="_blank" rel="noreferrer">Prefect Documentation</a></li>
          <li><a href="https://docs.getdbt.com/docs/deploy/job-scheduler" target="_blank" rel="noreferrer">dbt: Jobs and Scheduling</a></li>
          <li><a href="https://greatexpectations.io/gx-oss/" target="_blank" rel="noreferrer">Great Expectations Documentation</a></li>
          <li><a href="https://openlineage.io/docs/" target="_blank" rel="noreferrer">OpenLineage Documentation</a></li>
          <li><a href="https://prometheus.io/docs/practices/instrumentation/" target="_blank" rel="noreferrer">Prometheus: Instrumentation Best Practices</a></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
