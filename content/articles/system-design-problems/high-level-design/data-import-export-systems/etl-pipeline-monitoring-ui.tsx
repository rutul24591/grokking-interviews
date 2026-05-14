"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";

const metadata = {
  id: "article-hld-etl-pipeline-monitoring-ui",
  title: "Design an ETL Pipeline Monitoring UI",
  description:
    "End-to-end design of an ETL observability platform: pipeline DAG execution, Prometheus metrics emission, data quality scoring, SLA breach alerting, Grafana dashboards, PagerDuty routing, and checkpoint-based retry for reliable data pipelines.",
  category: "high-level-design",
  subcategory: "data-import-export-systems",
  slug: "etl-pipeline-monitoring-ui",
  wordCount: 5000,
  readingTime: 18,
  lastUpdated: "2026-05-14",
  readTime: "18 min read",
  difficulty: "Advanced",
  tags: ["ETL", "Prometheus", "Grafana", "PagerDuty", "Data Quality", "SLA Monitoring"],
};

export default function EtlPipelineMonitoringUi() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">
          ETL (Extract, Transform, Load) pipelines are the backbone of data
          infrastructure: they ingest data from operational systems, transform it
          into analytics-ready shapes, and load it into data warehouses or data
          lakes. These pipelines run unattended, often at night or on tight
          schedules, and failures are discovered only when downstream dashboards
          show stale data or analysts report incorrect numbers. The core problem is{" "}
          <em>observability</em>: giving operators and on-call engineers enough
          signal to detect failures in real time, diagnose root causes quickly, and
          recover without re-running the entire pipeline from scratch.
        </HighlightBlock>
        <p>Clarify scope with the interviewer:</p>
        <ul>
          <li>
            <strong>Pipeline types:</strong> Batch (nightly, hourly), micro-batch
            (5-minute windows), or streaming (Kafka/Flink)?
          </li>
          <li>
            <strong>Scale:</strong> How many pipelines? (100 internal vs. 10,000
            customer-facing pipelines.)
          </li>
          <li>
            <strong>SLA requirements:</strong> Which pipelines have hard SLAs?
            What is the p95 baseline?
          </li>
          <li>
            <strong>Data quality:</strong> Should the system enforce schema
            validation, null rates, uniqueness constraints?
          </li>
          <li>
            <strong>Retry semantics:</strong> At-least-once vs. exactly-once?
            Checkpoint-based resume vs. full re-run?
          </li>
          <li>
            <strong>Alerting:</strong> Who is notified and how? PagerDuty, Slack,
            email? Severity levels?
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          For this design: batch and micro-batch pipelines (not streaming); up to
          10,000 pipelines; Prometheus as the metrics backend; Grafana for
          dashboards; PagerDuty for on-call routing; data quality scoring with
          abort threshold; checkpoint-based retry; at-least-once with idempotent
          loads.
        </HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3>Functional</h3>
        <ul>
          <HighlightBlock as="li" tier="important">
            Every pipeline run emits structured metrics (row counts, latency,
            error rates, DQ scores) to a centralised metrics store.
          </HighlightBlock>
          <li>
            Operators can view a real-time dashboard showing pipeline status,
            throughput trend, DQ score trend, and SLA health.
          </li>
          <HighlightBlock as="li" tier="important">
            Alerts fire automatically on: DQ score &lt; threshold, SLA breach
            (&gt;110% of p95 baseline), pipeline failure, 3 consecutive failures
            triggering critical page.
          </HighlightBlock>
          <li>
            Failed pipelines can be retried from the last committed checkpoint
            without re-processing already-loaded data.
          </li>
          <li>
            Operators can inspect per-run logs, row-level error samples, and
            lineage (which source tables were read, which target tables were
            written).
          </li>
        </ul>
        <h3>Non-functional</h3>
        <ul>
          <li>
            <strong>Alert latency:</strong> Alert fires within 60 seconds of the
            condition being met (Prometheus scrape interval: 30s; alert evaluation:
            30s).
          </li>
          <li>
            <strong>Dashboard freshness:</strong> Grafana panels refresh on a
            30-second interval.
          </li>
          <li>
            <strong>Metric retention:</strong> 30 days at 30s resolution;
            1 year at 1-day resolution via downsampling.
          </li>
          <li>
            <strong>Scalability:</strong> 10,000 pipelines × 288 runs/day (5-min
            cadence) = 2.88 M runs/day; metric volume is bounded by time-series
            cardinality controls.
          </li>
        </ul>
      </section>

      <section>
        <h2>High-Level Design</h2>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/data-import-export-systems/etl-pipeline-monitoring-ui.svg"
          alt="ETL Pipeline Monitoring UI sequence diagram"
          caption="Orchestrator triggers worker → metrics emit to Prometheus → Alert Manager routes to PagerDuty/Grafana"
        />
        <p>
          The monitoring system has four layers:
        </p>
        <ol>
          <li>
            <strong>Instrumented workers:</strong> Each pipeline worker emits
            metrics (Prometheus counters/gauges) and structured logs (JSON to
            stdout → log aggregator) during execution.
          </li>
          <li>
            <strong>Metrics store:</strong> Prometheus scrapes worker metrics
            endpoints every 30 seconds. For pipelines that run briefly and then
            exit (batch jobs), workers use the Prometheus Pushgateway to push
            metrics before exiting.
          </li>
          <li>
            <strong>Alert Manager:</strong> Evaluates alerting rules (PromQL
            expressions) and routes firing alerts to PagerDuty (critical) or
            Slack (warning).
          </li>
          <li>
            <strong>Grafana:</strong> Provides operator dashboards querying
            Prometheus via PromQL. Panels show pipeline DAG status, throughput,
            DQ score, SLA %, and error heatmaps.
          </li>
        </ol>
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3>Pipeline Orchestration</h3>
        <p>
          Pipelines are defined as DAGs (Directed Acyclic Graphs) with nodes
          representing extract, transform, and load stages. The orchestrator (e.g.,
          Airflow, Prefect, Dagster, or a custom scheduler) evaluates due DAGs
          based on their cron schedule and emits a trigger event containing:
        </p>
        <ul>
          <li>
            <code>pipelineId</code> — stable identifier for the pipeline
            definition.
          </li>
          <li>
            <code>runId</code> — a unique identifier for this specific execution
            (UUID).
          </li>
          <li>
            <code>scheduledAt</code> — the nominal schedule time (not wall-clock
            time; used for deterministic idempotency keys).
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          The orchestrator records the run in a{" "}
          <code>pipeline_runs</code> table with{" "}
          <code>status=running</code> and the <code>startedAt</code> timestamp.
          The worker is launched as a Kubernetes Job (for batch) or a long-running
          pod (for micro-batch). On Kubernetes, the pod name encodes the runId,
          making log correlation trivial.
        </HighlightBlock>

        <h3>Metric Taxonomy</h3>
        <p>
          Workers emit three classes of metrics:
        </p>
        <h4>Throughput Metrics</h4>
        <ul>
          <li>
            <code>etl_extract_rows_total&#123;pipeline, stage, source&#125;</code> — counter
            incremented per row extracted.
          </li>
          <li>
            <code>etl_load_rows_total&#123;pipeline, stage, target&#125;</code> — counter
            incremented per row successfully loaded.
          </li>
          <li>
            <code>etl_extract_latency_ms&#123;pipeline, stage&#125;</code> — histogram of
            per-page extraction latency.
          </li>
          <li>
            <code>etl_load_latency_ms&#123;pipeline, stage&#125;</code> — histogram of
            per-batch load latency.
          </li>
        </ul>
        <h4>Data Quality Metrics</h4>
        <ul>
          <li>
            <code>etl_dq_score&#123;pipeline, column&#125;</code> — gauge: ratio of
            valid values to total values per column (0.0–1.0).
          </li>
          <li>
            <code>etl_null_rate&#123;pipeline, column&#125;</code> — gauge: fraction of
            null values per column.
          </li>
          <li>
            <code>etl_dup_rate&#123;pipeline&#125;</code> — gauge: fraction of duplicate
            rows detected.
          </li>
          <li>
            <code>etl_dq_violations_total&#123;pipeline, rule&#125;</code> — counter per
            DQ rule that fired.
          </li>
        </ul>
        <h4>SLA and Health Metrics</h4>
        <ul>
          <li>
            <code>etl_run_duration_seconds&#123;pipeline&#125;</code> — gauge set at run
            completion; compared against the SLA baseline stored in the pipeline
            definition.
          </li>
          <li>
            <code>etl_sla_breach_total&#123;pipeline&#125;</code> — counter incremented
            when run duration exceeds 110% of the p95 baseline.
          </li>
          <li>
            <code>etl_run_status&#123;pipeline, status&#125;</code> — gauge: 1 if the last
            run ended in this status (success=1, failed=1, etc.), 0 otherwise.
            This allows Grafana state timelines.
          </li>
          <li>
            <code>etl_consecutive_failures&#123;pipeline&#125;</code> — gauge tracking
            consecutive failure count; reset to 0 on success.
          </li>
        </ul>

        <h3>Data Quality Scoring</h3>
        <p>
          Each pipeline definition includes a DQ rule set defined in YAML:
        </p>
        <ul>
          <li>
            <strong>Not-null rules:</strong>{" "}
            <code>column: email, rule: not_null, severity: error</code>
          </li>
          <li>
            <strong>Type rules:</strong>{" "}
            <code>column: amount, rule: is_numeric, severity: error</code>
          </li>
          <li>
            <strong>Range rules:</strong>{" "}
            <code>column: age, rule: range, min: 0, max: 150</code>
          </li>
          <li>
            <strong>Enum rules:</strong>{" "}
            <code>column: status, rule: enum, values: [active, inactive, pending]</code>
          </li>
          <li>
            <strong>Uniqueness rules:</strong>{" "}
            <code>columns: [tenant_id, external_id], rule: unique</code>
          </li>
          <li>
            <strong>Referential rules:</strong>{" "}
            <code>column: product_id, rule: exists_in, table: products</code>
          </li>
        </ul>
        <p>
          The worker evaluates these rules per micro-batch (5,000 rows). After
          each batch it computes the DQ score:{" "}
          <code>valid_rows / total_rows</code>. If the score falls below the
          pipeline-level threshold (default: 0.95), the worker:
        </p>
        <ol>
          <li>
            Emits a <code>dq_abort</code> event to the pipeline_runs table with
            details of the failing rules.
          </li>
          <li>
            Transitions the run to <code>status=failed_dq</code>.
          </li>
          <li>
            Publishes a sample of failing rows (up to 100) to an error report S3
            key for operator inspection.
          </li>
          <li>Stops processing without loading further rows.</li>
        </ol>
        <p>
          Rows that pass DQ checks but fail with severity{" "}
          <code>warning</code> (rather than <code>error</code>) are loaded and
          flagged with a <code>dq_warning_flags</code> bitmask column in the
          target table.
        </p>

        <h3>SLA Baseline Tracking</h3>
        <p>
          The orchestrator maintains a rolling p95 baseline for each pipeline&rsquo;s
          run duration. On each run completion it executes:
        </p>
        <ul>
          <li>
            Query the last 30 successful runs&rsquo; durations from{" "}
            <code>pipeline_runs</code>.
          </li>
          <li>Compute p95 duration.</li>
          <li>
            Update <code>pipeline_definitions.sla_p95_seconds</code>.
          </li>
          <li>
            The SLA breach threshold is <code>1.1 × sla_p95_seconds</code>
            (configurable per pipeline).
          </li>
        </ul>
        <p>
          For new pipelines with fewer than 5 successful runs, the baseline is
          seeded from the pipeline&rsquo;s declared SLA or from the median of similar
          pipelines in the same category.
        </p>

        <h3>Alerting Rules (PromQL)</h3>
        <p>
          Alert Manager rules are defined as PromQL expressions evaluated on a
          30-second interval:
        </p>
        <ul>
          <li>
            <strong>DQ score alert (warning):</strong>{" "}
            <code>etl_dq_score &lt; 0.95</code> for 1 minute → Slack warning.
          </li>
          <li>
            <strong>SLA breach alert (warning):</strong>{" "}
            <code>increase(etl_sla_breach_total[5m]) &gt; 0</code> → Slack
            warning with pipeline name and actual vs. expected duration.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Run failure alert (warning):</strong>{" "}
            <code>etl_run_status&#123;status="failed"&#125; == 1</code> → Slack.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Consecutive failure alert (critical):</strong>{" "}
            <code>etl_consecutive_failures &gt;= 3</code> → PagerDuty page with
            runbook link.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Heartbeat missing alert (critical):</strong> If a pipeline
            that runs every 5 minutes has not emitted a metric in 10 minutes →
            dead man&rsquo;s switch alert via PagerDuty.
          </HighlightBlock>
        </ul>

        <h3>Checkpoint-Based Retry</h3>
        <HighlightBlock as="p" tier="important">
          Pipelines are designed so each stage commits atomically and records a
          checkpoint before moving on. The checkpoint is a cursor or offset that
          identifies where to resume:
        </HighlightBlock>
        <ul>
          <li>
            <strong>Extract checkpoint:</strong> Last extracted record ID or
            Kafka offset per partition.
          </li>
          <li>
            <strong>Transform checkpoint:</strong> Last row index processed in the
            current micro-batch.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Load checkpoint:</strong> Last committed batch number and the
            resulting target table high-water-mark ID.
          </HighlightBlock>
        </ul>
        <HighlightBlock as="p" tier="important">
          On retry the orchestrator reads the checkpoint from the{" "}
          <code>pipeline_run_checkpoints</code> table and passes it to the worker.
          The worker skips all records at or before the checkpoint. For the load
          stage, idempotency is guaranteed via{" "}
          <code>INSERT … ON CONFLICT DO UPDATE</code> so re-loading an already-
          committed batch is a no-op.
        </HighlightBlock>
        <p>
          Retry policy: up to 3 automatic retries with exponential backoff (5
          min, 15 min, 45 min). After 3 failures the pipeline enters{" "}
          <code>status=dead_lettered</code> and requires manual intervention.
        </p>

        <h3>Grafana Dashboard Design</h3>
        <p>
          The monitoring UI is a Grafana dashboard with the following panel
          layout:
        </p>
        <h4>Row 1: Fleet Overview</h4>
        <ul>
          <li>
            <strong>Stat panels:</strong> Total pipelines running now, pipelines
            failed today, pipelines with SLA breaches in last 24h, pipelines with
            DQ warnings.
          </li>
          <li>
            <strong>Table panel:</strong> Top 10 pipelines by failure count
            (last 7 days), with links to per-pipeline drill-down.
          </li>
        </ul>
        <h4>Row 2: Per-Pipeline Deep Dive (parameterised by &#123;pipeline&#125;)</h4>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Time series:</strong>{" "}
            <code>rate(etl_load_rows_total&#123;pipeline=~"$pipeline"&#125;[5m])</code> —
            row throughput over time, overlaid with run boundaries.
          </HighlightBlock>
          <li>
            <strong>Gauge:</strong>{" "}
            <code>etl_dq_score&#123;pipeline="$pipeline"&#125;</code> — current DQ
            score with colour thresholds (red &lt;0.95, yellow &lt;0.99, green
            ≥0.99).
          </li>
          <li>
            <strong>Bar chart:</strong>{" "}
            <code>etl_dq_violations_total&#123;pipeline="$pipeline"&#125;</code> by rule —
            shows which DQ rules fire most often.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Histogram heatmap:</strong>{" "}
            <code>etl_load_latency_ms_bucket&#123;pipeline="$pipeline"&#125;</code> — shows
            latency distribution and outliers over time.
          </HighlightBlock>
        </ul>
        <h4>Row 3: SLA and Trend</h4>
        <ul>
          <li>
            <strong>Time series:</strong> Run duration per execution vs. p95
            baseline — immediately shows drift.
          </li>
          <li>
            <strong>Stat panel:</strong> SLA compliance % (successful runs ÷
            total runs in 30 days).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>State timeline:</strong>{" "}
            <code>etl_run_status&#123;pipeline="$pipeline"&#125;</code> — colour-coded
            timeline of success/fail/skip per run, easy to spot patterns (always
            fails on Mondays = upstream issue on weekends).
          </HighlightBlock>
        </ul>

        <h3>Cardinality Control</h3>
        <p>
          With 10,000 pipelines each emitting metrics per column (potentially
          100s of columns), label cardinality can explode the Prometheus TSDB.
          Mitigations:
        </p>
        <ul>
          <li>
            Per-column DQ metrics are emitted only for columns with active DQ
            rules, not all columns.
          </li>
          <HighlightBlock as="li" tier="important">
            Column-level DQ metrics use a top-20 column hash if the pipeline has
            &gt;20 columns; remaining columns are aggregated into an{" "}
            <code>other</code> bucket.
          </HighlightBlock>
          <li>
            Pipelines in the same logical group share a{" "}
            <code>pipeline_group</code> label, enabling group-level aggregation
            in addition to per-pipeline queries.
          </li>
          <li>
            High-cardinality debug metrics (per-row error details) go to the log
            aggregator (e.g., Loki), not Prometheus. Grafana correlates Prometheus
            metrics with Loki logs via the Explore view.
          </li>
        </ul>

        <h3>Log Aggregation and Structured Logging</h3>
        <p>
          Workers emit JSON-structured logs to stdout. Each log line includes:
        </p>
        <ul>
          <li>
            <code>pipelineId</code>, <code>runId</code>, <code>stage</code>,{" "}
            <code>level</code> (INFO/WARN/ERROR).
          </li>
          <li>
            For row-level errors: <code>rowIndex</code>, <code>column</code>,{" "}
            <code>value</code> (truncated), <code>rule</code>,{" "}
            <code>message</code>.
          </li>
          <li>
            For performance: <code>batchSize</code>, <code>durationMs</code>,{" "}
            <code>cursor</code>.
          </li>
        </ul>
        <p>
          A Fluent Bit daemonset ships pod logs to a log aggregation backend
          (Loki, OpenSearch, or CloudWatch Logs). Log lines are tagged with
          Kubernetes labels (pod name = runId) for automatic correlation. Retention
          policy: 30 days for ERROR/WARN, 7 days for INFO.
        </p>

        <h3>Lineage Tracking</h3>
        <p>
          Each run records data lineage in a <code>pipeline_lineage</code> table:
        </p>
        <ul>
          <li>
            <code>run_id</code>, <code>source_table</code>,{" "}
            <code>source_query_hash</code> (SHA-256 of the SQL used).
          </li>
          <li>
            <code>target_table</code>, <code>rows_loaded</code>,{" "}
            <code>target_high_watermark_id</code>.
          </li>
        </ul>
        <HighlightBlock as="p" tier="important">
          This enables downstream impact analysis: &ldquo;which pipelines read from
          table X?&rdquo; — answered by querying lineage records. When a source table
          is modified (schema change, data correction), the lineage graph
          identifies all dependent pipelines that may need re-runs.
        </HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Alternatives</h2>
        <h3>Prometheus Pushgateway vs. Scrape</h3>
        <HighlightBlock as="p" tier="crucial">
          Prometheus scraping works well for long-running services but poorly for
          short-lived batch jobs that may complete before the first scrape interval.
          The Pushgateway accepts metric pushes from batch jobs and holds them for
          scraping. The trade-off: Pushgateway becomes a single point of failure,
          and metrics do not expire automatically—stale metrics from failed jobs
          remain until explicitly deleted. Mitigations: use a redundant Pushgateway
          deployment, and have the orchestrator delete job metrics from Pushgateway
          on job completion. Alternatively, use a time-series DB that accepts push
          natively (InfluxDB, VictoriaMetrics).
        </HighlightBlock>

        <h3>Embedded DQ vs. Dedicated DQ Framework</h3>
        <HighlightBlock as="p" tier="important">
          Embedding DQ checks inside the ETL worker is simple but mixes concerns.
          Dedicated DQ frameworks (Great Expectations, dbt tests, Monte Carlo) run
          DQ checks independently of the pipeline, allowing DQ to be enforced on
          data at rest without re-running the ETL. The trade-off: decoupled DQ
          adds latency (data lands in the target, then DQ runs) and requires
          rollback logic if DQ fails post-load. Embedded DQ (pre-load) prevents
          bad data from reaching the target but requires tighter coupling between
          the pipeline and DQ rules.
        </HighlightBlock>

        <h3>Airflow vs. Custom Orchestrator</h3>
        <HighlightBlock as="p" tier="important">
          Apache Airflow is the most widely-adopted ETL orchestrator with a rich
          UI, retry configuration, and SLA miss features built in. The trade-offs:
          Airflow&rsquo;s task-level parallelism model introduces scheduling overhead
          (the scheduler polls the DB every second for due tasks). For 10,000
          pipelines at 5-minute cadence (2,000 tasks/minute) the Airflow scheduler
          can become a bottleneck. Alternatives: Prefect 2 (flow-centric, agent
          model), Dagster (asset-centric, better DQ integration), or a lightweight
          custom cron-based scheduler for simpler use cases.
        </HighlightBlock>

        <h3>Exactly-Once vs. At-Least-Once</h3>
        <HighlightBlock as="p" tier="important">
          Exactly-once ETL requires distributed transactions spanning the source
          read, transform, and target write. This is achievable with Kafka
          transactions + idempotent producers for streaming pipelines, but adds
          significant complexity and latency. For batch ETL the standard approach
          is at-least-once delivery with idempotent loads (ON CONFLICT DO UPDATE
          or MERGE). This is simpler, more performant, and sufficient for all
          analytics use cases where re-processing the same data produces the same
          result (idempotent by nature).
        </HighlightBlock>

        <h3>OpenTelemetry as a Unified Observability Layer</h3>
        <HighlightBlock as="p" tier="important">
          Instead of emitting raw Prometheus metrics, workers can emit
          OpenTelemetry (OTel) signals—traces, metrics, and logs—using the OTel
          SDK. OTel collector exports to Prometheus (metrics), Jaeger/Tempo
          (traces), and Loki (logs). This provides:
        </HighlightBlock>
        <ul>
          <li>Distributed tracing across multi-stage pipelines.</li>
          <li>Correlation between slow stages and specific row ranges.</li>
          <li>
            Vendor-agnostic instrumentation (swap Prometheus for VictoriaMetrics
            or Datadog without changing application code).
          </li>
        </ul>
        <p>
          The trade-off: OTel SDK adds ~10 ms overhead per trace span and
          increases instrumentation code volume. For teams already on OTel it is
          the right choice; for teams starting fresh the Prometheus SDK is simpler.
        </p>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="crucial">
          An ETL monitoring platform must answer three questions in real time: is
          the pipeline running on time (SLA), is the data correct (DQ score), and
          if it failed, where exactly did it fail (checkpoint + logs)? This design
          achieves all three: Prometheus metrics with Grafana dashboards for SLA
          and throughput visibility; per-column DQ scoring with abort thresholds
          for data integrity; and checkpoint-based retry with structured logging
          for fast recovery. The cardinality discipline (column-level metrics only
          for DQ-checked columns) is critical for scaling to thousands of pipelines
          without exploding the metrics store. At staff level, the insight is that
          monitoring is not an afterthought bolted onto a working pipeline—it is
          the mechanism by which you demonstrate correctness in a system where
          failures are invisible until a downstream analyst notices a number that
          does not look right.
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
