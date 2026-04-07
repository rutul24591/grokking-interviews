"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-batch-processing-extensive",
  title: "Batch Processing",
  description:
    "Process data in scheduled chunks with strong reproducibility, backfills, and data-quality controls that keep pipelines correct as volumes grow.",
  category: "backend",
  subcategory: "data-processing-analytics",
  slug: "batch-processing",
  wordCount: 5560,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "data", "batch", "pipelines", "analytics"],
  relatedTopics: ["stream-processing", "etl-elt-pipelines", "data-pipelines", "apache-spark"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Batch processing</strong> is the computation model where data is processed in discrete, scheduled
          chunks &mdash; typically hourly, daily, or weekly &mdash; rather than continuously as events arrive. Each batch run
          processes a complete slice of data (for example, all events from the previous day) from ingestion through
          transformation to output, producing results that are deterministic and reproducible given the same input and
          code. Batch processing is the oldest and most mature data processing paradigm, forming the backbone of data
          warehousing, ETL pipelines, financial reporting, compliance auditing, and machine learning training pipelines.
        </p>
        <p>
          The defining characteristic of batch processing is reproducibility: running the same batch job on the same
          input data with the same code produces the same output, regardless of when or where the job runs. This
          property is essential for debugging, auditing, and compliance &mdash; if a batch job produces incorrect results,
          the root cause can be identified by rerunning the job with debugging enabled, and the fix can be verified by
          comparing the new output against the expected output. Reproducibility also enables backfills: when a bug is
          discovered in the batch logic, the fix can be applied and the job rerun on the affected date range,
          correcting the historical data without requiring a complex migration.
        </p>
        <p>
          Batch processing contrasts with stream processing, which processes events continuously as they arrive,
          trading reproducibility and simplicity for lower latency. The choice between batch and stream is not
          either-or: most production data platforms use both, with batch processing providing the authoritative,
          accurate data layer (the &quot;source of truth&quot;) and stream processing providing low-latency operational
          visibility on top of it. This hybrid pattern &mdash; sometimes called the Lambda Architecture &mdash; uses streaming for
          fast signals and batch for accuracy and backfills, with a reconciliation layer that ensures the two agree.
        </p>
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Batch Processing Design Principles</h3>
          <p className="mb-3">
            Four principles govern robust batch pipeline design. First, idempotency: running the same batch job
            multiple times on the same input produces the same output without duplication or corruption. This enables
            safe retries, backfills, and reprocessing. Second, atomicity: the output of a batch job is either fully
            written and correct or not written at all &mdash; there is no partial output visible to consumers. Third,
            reproducibility: the same input and code always produce the same output, enabling debugging and auditing.
            Fourth, validation: the output is checked against invariants and expected properties before being published
            to consumers, catching silent correctness failures before they propagate downstream.
          </p>
          <p>
            These principles are not optional &mdash; they are the minimum requirements for a batch pipeline that can be
            operated safely at scale. A batch pipeline that violates idempotency will produce corrupted data on rerun.
            A pipeline that violates atomicity will expose consumers to partial output. A pipeline that is not
            reproducible cannot be debugged. A pipeline that does not validate its output will propagate silent
            correctness failures to downstream systems.
          </p>
        </div>
        <p>
          The modern batch processing ecosystem is built on distributed compute engines &mdash; Apache Spark being the
          dominant choice &mdash; running on cloud infrastructure (AWS EMR, GCP Dataproc, Azure Databricks) or Kubernetes.
          The compute engine handles distributed execution, fault tolerance, and optimization, while the orchestration
          layer (Apache Airflow, Prefect, Dagster) handles scheduling, dependency management, retry logic, and
          monitoring. The storage layer (S3, GCS, ADLS) provides durable, scalable input and output storage with
          partitioned data layouts that enable efficient parallel reads.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Data partitioning is the foundation of efficient batch processing. Input data is organized into partitions
          &mdash; typically by date, hour, or another time-based dimension &mdash; so that each batch run can read only the
          partitions it needs rather than scanning the entire dataset. Partitioning enables two critical optimizations:
          partition pruning, where the compute engine skips partitions that are not needed for the current batch run,
          and parallelism, where multiple workers can read and process different partitions simultaneously without
          coordination.
        </p>
        <p>
          The choice of partition key and granularity affects both query efficiency and operational cost. Partitioning
          by day is the most common choice for daily batch jobs because it aligns the partition layout with the batch
          schedule &mdash; each run reads exactly one day&apos;s partition. However, for very large daily volumes, partitioning
          by hour or by a combination of date and another dimension (such as region or event type) can reduce the data
          volume per partition and increase parallelism. Over-partitioning &mdash; creating too many small partitions &mdash;
          increases metadata overhead and file system costs, while under-partitioning &mdash; creating too few large
          partitions &mdash; reduces parallelism and increases the blast radius of partition-level failures.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/batch-processing-diagram-1.svg"
          alt="Batch processing pipeline architecture showing ingest, transform, aggregate, and output stages with schedule trigger and validation gate"
          caption="Batch pipeline architecture: ingest from source, transform and clean, aggregate and summarize, then write output &mdash; all triggered on a schedule with a validation gate before publishing."
        />
        <p>
          Schema evolution is a critical concept in batch processing because the schemas of source systems change over
          time &mdash; columns are added, removed, renamed, or have their types changed. A robust batch pipeline must handle
          schema evolution gracefully: detecting schema changes at ingestion, applying migration logic to adapt the
          transformation, and either failing with a clear error message or falling back to a compatible behavior when
          an incompatible schema change is detected. Schema validation at the ingestion stage &mdash; checking that the
          input data conforms to the expected schema before processing begins &mdash; catches schema drift early and prevents
          the pipeline from producing silently incorrect output.
        </p>
        <p>
          Data quality validation is the safety net that catches incorrect or incomplete data before it reaches
          downstream consumers. Validation checks include row count verification (does the output have the expected
          number of rows?), checksum validation (do the aggregate sums match the expected totals?), invariant checking
          (do the derived metrics satisfy known mathematical properties?), and completeness checks (are all expected
          partitions present and non-empty?). When a validation check fails, the pipeline should alert the operations
          team, halt the output publication, and optionally quarantine the affected data for investigation.
        </p>
        <p>
          The output publication pattern determines how batch results become visible to consumers. The safest pattern
          is atomic publication: the batch job writes its output to a temporary location, validates it, and then
          atomically swaps the temporary output into the production location (using a RENAME operation on the file
          system or a partition swap in a table format like Apache Iceberg or Delta Lake). This ensures that consumers
          never see partial or corrupt output &mdash; they either see the complete, validated output or they see the previous
          batch&apos;s output.
        </p>
        <p>
          Backfill and reprocessing capability is a defining feature of batch processing. When a bug is discovered in
          the batch logic or the source data is corrected, the pipeline can be rerun on the affected date range to
          produce corrected output. This requires idempotent writes (rerunning does not duplicate or corrupt data) and
          atomic publication (the corrected output replaces the incorrect output atomically). Backfills are a routine
          operational activity in mature data platforms, and the pipeline should be designed to support them from the
          start rather than retrofitting idempotency after a data quality incident.
        </p>
      </section>

      <section>
        <h2>Architecture and Flow</h2>
        <p>
          A batch processing pipeline follows a consistent flow: ingest, transform, aggregate, validate, and publish.
          The ingest stage reads data from source systems &mdash; object storage (S3, GCS, ADLS), databases (via CDC or
          export), message queues (Kafka), or APIs &mdash; and writes it to the pipeline&apos;s working storage in a
          consistent, partitioned format (typically Parquet or ORC). The ingest stage performs schema validation,
          deduplication, and initial data quality checks, rejecting or quarantining records that do not meet the
          expected standards.
        </p>
        <p>
          The transform stage applies business logic to the ingested data: filtering out invalid records, normalizing
          formats, enriching with reference data from dimension tables, joining across multiple sources, and deriving
          new columns from existing ones. The transform stage is where most of the business logic lives, and it is
          typically implemented as a series of DataFrame operations in Spark or SQL queries in a data warehouse. The
          key design principle for the transform stage is composability: each transformation should be a discrete,
          testable unit that takes a well-defined input and produces a well-defined output, enabling unit testing and
          incremental debugging.
        </p>
        <p>
          The aggregate stage computes summary statistics, rollups, and derived metrics from the transformed data.
          This stage typically involves group-by operations, window functions, and joins that produce aggregated tables
          at multiple granularities (per-minute, per-hour, per-day, per-week). The output of the aggregate stage is
          the data that powers dashboards, reports, and downstream analytical queries. The aggregate stage is where
          shuffle costs are highest &mdash; group-by and join operations redistribute data across the cluster &mdash; so
          optimization at this stage (broadcast joins for small dimension tables, pre-aggregation to reduce shuffle
          volume, and partition pruning) has the greatest impact on job performance.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/batch-processing-diagram-2.svg"
          alt="Comparison of batch vs stream processing showing latency, correctness, cost, complexity, and use case trade-offs"
          caption="Batch vs stream trade-offs: batch offers exact correctness and reproducibility with higher latency, while stream offers low latency with eventually consistent results and higher operational complexity."
        />
        <p>
          The validation stage runs a suite of data quality checks on the aggregate output before it is published to
          consumers. Validation checks are defined declaratively as a set of rules &mdash; row count within expected range,
          no null values in required columns, aggregate sums match expected totals, partition completeness &mdash; and
          executed as a final step in the pipeline. If all checks pass, the pipeline proceeds to publication. If any
          check fails, the pipeline alerts the operations team, quarantines the output, and optionally falls back to
          the previous batch&apos;s output for consumers that require continuous availability.
        </p>
        <p>
          The publication stage makes the validated output available to consumers through atomic publication: the output
          is written to a temporary location during processing, and once validated, it is atomically swapped into the
          production location. On file systems that support atomic rename (S3 with multi-part upload, HDFS, GCS), this
          is a simple RENAME operation. On table formats like Apache Iceberg or Delta Lake, this is a snapshot commit
          that makes the new data visible to readers atomically. The key property is that consumers never see partial
          or in-progress output &mdash; they see either the complete new output or the previous output.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/data-processing-analytics/batch-processing-diagram-3.svg"
          alt="Batch processing failure modes and recovery patterns including idempotent rerun and backfill patterns"
          caption="Failure modes and recovery: schema drift, data quality violations, and compute failures are detected and recovered through idempotent reruns with temporary output, validation, and atomic swap."
        />
        <p>
          The orchestration layer manages the scheduling, dependency resolution, retry logic, and monitoring of the
          batch pipeline. Apache Airflow is the most widely used orchestrator, defining pipelines as Directed Acyclic
          Graphs (DAGs) of tasks with explicit dependencies. The orchestrator triggers the pipeline on schedule (or in
          response to an event), waits for dependencies to complete (for example, the ingest stage must complete before
          the transform stage begins), retries failed tasks with exponential backoff, and sends alerts on failures or
          SLA violations. The orchestrator also provides a UI for monitoring pipeline health, viewing logs, and
          manually triggering backfills or reruns.
        </p>
        <p>
          Storage format choice significantly impacts batch processing performance. Columnar formats like Parquet and
          ORC store data by column rather than by row, enabling efficient reads for analytical queries that access only
          a subset of columns. Parquet also supports predicate pushdown, where the compute engine reads only the row
          groups that satisfy the query&apos;s filter conditions, reducing I/O volume. For batch pipelines that perform
          aggregations and joins on large datasets, columnar formats with appropriate compression (Snappy for balanced
          speed/ratio, Zstandard for better compression) provide the best performance-to-cost ratio.
        </p>
      </section>

      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          The choice of batch interval &mdash; how frequently the pipeline runs &mdash; is a fundamental trade-off between data
          freshness and cost. A daily batch is the most cost-efficient because it processes the largest data slice per
          run, amortizing fixed costs (cluster startup, metadata loading) over more data. However, daily batch means
          the data is up to 24 hours stale, which is unacceptable for operational use cases. An hourly batch provides
          fresher data but at higher cost &mdash; four times the cluster time for four runs instead of one &mdash; and increases
          the risk of runs overlapping if a single run takes longer than an hour. The recommended approach is to match
          the batch interval to the consumer&apos;s freshness requirement: daily for reporting and analytics, hourly for
          operational dashboards, and streaming for alerting and real-time decision-making.
        </p>
        <p>
          Batch versus stream processing is not a binary choice but a spectrum. Batch processing excels at correctness,
          reproducibility, and cost efficiency for large data volumes. Stream processing excels at low latency and
          incremental processing. Most production data platforms use both: stream processing for real-time operational
          visibility and alerting, batch processing for authoritative, accurate data that powers reporting, billing,
          and compliance. The two layers are reconciled periodically &mdash; the batch pipeline corrects any inaccuracies in
          the streaming layer&apos;s output &mdash; ensuring that consumers have both fast signals and accurate data.
        </p>
        <p>
          The compute engine choice &mdash; Spark versus cloud data warehouse (BigQuery, Snowflake, Redshift) versus
          serverless compute (AWS Glue, GCP Dataflow) &mdash; is a trade-off between control, cost, and operational burden.
          Spark provides maximum control over execution, partitioning, and optimization, but requires operational
          expertise in cluster management, tuning, and monitoring. Cloud data warehouses provide a managed SQL
          interface with automatic optimization, but at a higher per-query cost and with less control over execution.
          Serverless compute eliminates cluster management entirely, but may have less predictable performance and
          higher cost for large, recurring workloads.
        </p>
        <p>
          The output table format &mdash; raw files versus Apache Iceberg versus Delta Lake versus Apache Hudi &mdash; is a
          trade-off between simplicity and advanced features. Raw Parquet files in a partitioned directory structure
          are the simplest approach: easy to understand, debug, and back up, but lacking support for ACID transactions,
          schema evolution, and time travel. Table formats like Iceberg and Delta Lake add ACID semantics, schema
          evolution with compatibility checks, time travel for debugging and auditing, and efficient upserts and
          deletes. The cost is additional complexity in the storage layer and the need for readers that support the
          table format. For pipelines that require upserts, deletes, or time travel, a table format is essential. For
          append-only pipelines, raw Parquet files are sufficient.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Design every batch pipeline to be idempotent from the start. Write output to a temporary location, validate
          it, and atomically swap it into the production location. This pattern ensures that rerunning the pipeline &mdash;
          whether due to a failure, a bug fix, or a backfill &mdash; does not duplicate or corrupt data. Idempotency should
          be tested explicitly: run the pipeline twice on the same input and verify that the output is identical,
          including file contents, metadata, and partition layout.
        </p>
        <p>
          Partition input data by the batch interval &mdash; daily partitions for daily batches, hourly for hourly &mdash; and
          use partition pruning to read only the partitions needed for the current run. This minimizes I/O cost and
          ensures that the pipeline processes a predictable, bounded amount of data per run. For very large partitions,
          add a secondary partition dimension (such as region or event type) to increase parallelism and reduce the
          blast radius of partition-level failures.
        </p>
        <p>
          Validate output quality before publishing. Define a suite of data quality checks &mdash; row count within expected
          range, no null values in required columns, aggregate totals matching source, partition completeness &mdash; and run
          them as the final stage before publication. If any check fails, alert the operations team and halt
          publication. Do not publish output that has not passed validation, even if the pipeline itself completed
          without errors. Silent data quality failures are more damaging than pipeline failures because they propagate
          incorrect data to downstream systems without alerting anyone.
        </p>
        <p>
          Use columnar formats (Parquet or ORC) with appropriate compression for all intermediate and final output
          data. Columnar formats enable predicate pushdown, reducing I/O for queries that filter on specific columns,
          and compression reduces storage cost and network transfer time. Snappy compression provides the best balance
          of speed and compression ratio for most workloads; Zstandard provides better compression at the cost of
          slightly higher CPU usage.
        </p>
        <p>
          Monitor pipeline health continuously: track job duration, input and output volume, shuffle volume, spill
          rate, and validation check results over time. Set alerts on anomalies &mdash; job duration exceeding two standard
          deviations above the rolling average, input volume dropping below 50 percent of the expected range, or
          validation check failures. These alerts catch issues before they cause downstream data quality incidents.
        </p>
        <p>
          Version the pipeline code and the data schema together. When the pipeline logic changes, the version is
          recorded alongside the output so that consumers can track which version produced which output. When the schema
          changes, the migration logic is versioned and tested against historical data to ensure backward compatibility.
          This enables debugging &mdash; if the output changes unexpectedly, the version history identifies which code change
          caused it &mdash; and compliance &mdash; auditors can verify which logic produced the data used in a specific report.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Schema drift at the source causing silent data corruption is the most common batch pipeline failure. When a
          source system adds, removes, renames, or changes the type of a column without notifying the pipeline, the
          pipeline may process the data incorrectly &mdash; reading the wrong column, interpreting data with the wrong type,
          or silently dropping new columns. The fix is schema validation at ingestion: check that the input schema
          matches the expected schema before processing begins, and fail the pipeline with a clear error message if it
          does not. This catches schema drift early, before it produces incorrect output.
        </p>
        <p>
          Non-idempotent writes causing data corruption on rerun is a design failure that is difficult to recover from.
          If a pipeline writes output directly to the production location without using a temporary location and atomic
          swap, a rerun after a partial failure may produce a mix of old and new records, or duplicate records if the
          pipeline appends rather than overwrites. The fix is to redesign the pipeline to use temporary output and
          atomic publication, and to test idempotency by running the pipeline multiple times on the same input and
          verifying identical output.
        </p>
        <p>
          Missing validation checks allowing incorrect data to propagate downstream is a quality failure that erodes
          trust in the data platform. Without validation, a pipeline can produce output that is technically correct &mdash;
          the pipeline ran without errors &mdash; but semantically wrong &mdash; the output does not match reality. This happens
          when source data contains unexpected values, joins produce cartesian products due to duplicate keys, or
          aggregation logic has a bug that is not caught by the pipeline&apos;s error handling. The fix is a comprehensive
          validation suite that checks output quality against known invariants and expected ranges, with alerts on
          violations.
        </p>
        <p>
          Over-partitioning creating excessive metadata overhead and small file problems is a performance pitfall that
          degrades gradually and is often unnoticed until it becomes severe. When a pipeline creates many small
          partitions (for example, partitioning by date and hour and region when the per-partition volume is only a
          few megabytes), the file system metadata overhead increases, the number of files grows beyond what the name
          node can efficiently manage, and downstream readers spend more time opening and closing files than reading
          data. The fix is to coalesce small partitions before writing, using a partition size target of 128 MB to 1
          GB per file, and to review partition strategy periodically as data volumes change.
        </p>
        <p>
          Pipeline runs overlapping because job duration exceeds the batch interval is a capacity planning failure.
          If a daily batch job takes 26 hours to complete, it overlaps with the next day&apos;s run, causing resource
          contention, potential data corruption if both runs write to the same location, and cascading delays. The fix
          is to monitor job duration trends, alert when duration approaches the batch interval, and optimize the
          pipeline &mdash; increasing parallelism, reducing shuffle volume, or using more powerful compute resources &mdash; to
          keep duration well within the interval.
        </p>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A global retail company runs a daily batch pipeline that processes all sales, inventory, and customer
          transactions from the previous day to produce the company&apos;s authoritative financial and operational reports.
          The pipeline ingests approximately 500 GB of data from 20 source systems, applies 150 transformation steps
          including currency conversion, tax calculation, and inventory reconciliation, and produces 30 aggregated
          tables in a data warehouse. The pipeline runs on a 100-node Spark cluster on AWS EMR, completing in 3 hours
          with a daily schedule at 2 AM. Key design decisions include idempotent writes with atomic partition swap in
          Apache Iceberg, schema validation at ingestion for all 20 sources, and a 50-check validation suite that
          verifies output correctness before publication. The pipeline has a 99.9 percent success rate over two years,
          with failures typically caused by source system outages rather than pipeline bugs.
        </p>
        <p>
          A financial services company runs an hourly batch pipeline that processes trading activity, market data, and
          risk metrics to produce compliance reports required by regulatory authorities. The pipeline must be
          reproducible and auditable &mdash; every output must be traceable to the specific input data, code version, and
          configuration that produced it. The pipeline uses Apache Airflow for orchestration with explicit dependency
          management between 40 tasks, writes output in Parquet format with Zstandard compression to S3, and maintains
          a versioned code repository with the pipeline logic and schema definitions. The hourly schedule ensures that
          compliance reports are no more than one hour stale, meeting regulatory requirements while keeping compute
          costs manageable.
        </p>
        <p>
          A technology company runs a daily batch pipeline that processes application logs, infrastructure metrics, and
          security events to produce operational dashboards and anomaly detection models. The pipeline ingests
          approximately 2 TB of log data and 500 GB of metrics data per day, transforms and enriches the data with
          service metadata and deployment information, aggregates it into time-series summaries at multiple
          granularities, and writes the results to a time-series database. The pipeline uses Spark on Kubernetes for
          distributed execution, with AQE enabled for automatic skew handling and broadcast join optimization. The
          output feeds Grafana dashboards used by on-call engineers and provides the training data for machine learning
          models that detect anomalous behavior in the infrastructure.
        </p>
        <p>
          A healthcare organization runs a weekly batch pipeline that processes genomic sequencing data from hundreds
          of samples to produce variant call reports for clinical use. The pipeline aligns raw sequencing reads to a
          reference genome, calls variants, annotates them with clinical significance databases, and produces a
          structured report for each sample. The pipeline processes approximately 10 TB of raw data per week on a
          GPU-equipped cluster, completing in 12 hours. The batch model is essential because the analysis requires the
          complete dataset for each sample &mdash; partial processing would produce incomplete or inaccurate variant calls &mdash;
          and the weekly schedule aligns with the laboratory&apos;s sample collection and reporting cycle.
        </p>
      </section>

      <section>
        <h2>Interview Questions</h2>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 1: What makes a batch pipeline idempotent, and why is idempotency essential for backfills?
          </h3>
          <p className="mb-3">
            A batch pipeline is idempotent when running it multiple times on the same input produces the same output
            as running it once, without duplication, corruption, or side effects. Idempotency is achieved through two
            mechanisms: atomic publication (writing output to a temporary location and swapping it atomically into the
            production location) and deterministic processing (the same input and code always produce the same output,
            with no dependence on external state such as current time, random numbers, or mutable shared resources).
          </p>
          <p className="mb-3">
            Idempotency is essential for backfills because backfills are reruns of the pipeline on historical data to
            correct a bug or incorporate corrected source data. Without idempotency, a backfill would either duplicate
            data (if the pipeline appends to existing output) or corrupt data (if the pipeline partially overwrites
            existing output). With idempotency, the backfill produces the same output as the original run would have
            if the bug had not existed, and the atomic swap replaces the incorrect output with the corrected output
            without any window of inconsistency.
          </p>
          <p>
            Testing idempotency is straightforward: run the pipeline twice on the same input and compare the outputs
            byte-for-byte. If they differ, the pipeline is not idempotent and the cause &mdash; typically non-deterministic
            processing, external state dependencies, or non-atomic writes &mdash; must be identified and fixed.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 2: How do you handle schema evolution in a batch pipeline that ingests from multiple source systems?
          </h3>
          <p className="mb-3">
            Schema evolution in a multi-source batch pipeline requires a systematic approach. First, define the
            expected schema for each source system, including column names, types, nullability, and constraints. Store
            these schemas in a versioned schema registry so that changes are tracked and auditable. Second, implement
            schema validation at the ingestion stage: when data arrives from a source, check its schema against the
            expected schema and reject or quarantine records that do not match.
          </p>
          <p className="mb-3">
            Third, define a schema evolution policy that specifies how the pipeline responds to different types of
            schema changes. Additive changes (new columns) are typically handled by adding the new columns to the
            expected schema with a default value for historical data. Destructive changes (removed columns) require
            updating the pipeline logic to handle the missing column &mdash; either by removing the column from the
            transformation or by providing a fallback value. Type changes are the most disruptive and typically require
            a pipeline update and a backfill to correct any data that was processed with the old type.
          </p>
          <p>
            Fourth, implement automated schema drift detection that compares the actual source schema against the
            expected schema on each pipeline run and alerts on differences. This catches schema changes that were not
            communicated by the source system team and prevents the pipeline from processing data with an unexpected
            schema. Fifth, maintain backward compatibility in the pipeline&apos;s output schema &mdash; new columns are added
            with null defaults for historical data, and removed columns are preserved with null values &mdash; so that
            downstream consumers are not broken by schema changes in the pipeline.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 3: How do you decide between batch and stream processing for a new data pipeline?
          </h3>
          <p className="mb-3">
            The decision starts with the consumer&apos;s freshness requirement: how stale can the data be before it is no
            longer useful? If the consumer needs data that is seconds or milliseconds old, streaming is required. If
            the consumer can tolerate data that is hours or days old, batch is sufficient and more cost-efficient.
            If the consumer has mixed requirements &mdash; fast visibility for operational decisions and accurate data for
            reporting &mdash; a hybrid approach with both batch and streaming is appropriate.
          </p>
          <p className="mb-3">
            The second factor is the complexity tolerance of the team. Batch pipelines are simpler to design, debug,
            and operate because they process a complete, bounded dataset with deterministic results. Streaming
            pipelines require managing state, handling late data, dealing with ordering guarantees, and operating
            always-on infrastructure. If the team lacks experience with stream processing, starting with batch and
            adding streaming incrementally is a lower-risk approach.
          </p>
          <p>
            The third factor is cost. Batch processing is generally more cost-efficient because it processes data in
            large chunks, amortizing fixed costs over more data, and it can use spot or preemptible instances for
            non-time-sensitive workloads. Streaming processing requires always-on infrastructure, which has a higher
            baseline cost. The cost difference is significant for large data volumes but may be negligible for small
            volumes where the fixed cost of cluster startup dominates.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 4: How do you design a data quality validation suite for a batch pipeline?
          </h3>
          <p className="mb-3">
            A data quality validation suite should cover four categories of checks. Structural checks verify that the
            output has the expected shape: row count within an expected range (for example, within 20 percent of the
            rolling average), all expected partitions present and non-empty, and the output schema matches the expected
            schema with no unexpected missing or extra columns.
          </p>
          <p className="mb-3">
            Content checks verify the quality of individual records: no null values in required columns, values within
            expected ranges (for example, ages between 0 and 150, prices non-negative), referential integrity (foreign
            keys reference valid primary keys in dimension tables), and no duplicate primary keys. Statistical checks
            verify the aggregate properties of the data: sum of transaction amounts matches the source total, count of
            unique customers matches the expected range, and distribution of categorical values is consistent with
            historical patterns.
          </p>
          <p>
            Cross-pipeline checks verify consistency across related pipelines: the sum of per-region totals equals the
            global total, the count of orders in the sales pipeline matches the count in the fulfillment pipeline, and
            the revenue in the financial pipeline matches the revenue in the analytics pipeline. These checks catch
            discrepancies that individual pipeline validation would miss because each pipeline&apos;s output may be
            internally consistent but inconsistent with related pipelines.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Question 5: Describe how you would design a batch pipeline that needs to backfill two months of historical data after a bug fix.
          </h3>
          <p className="mb-3">
            The design starts with the pipeline&apos;s idempotency guarantee: the pipeline must produce the same output
            whether it is run once or multiple times on the same input. With idempotency confirmed, the backfill
            process is straightforward: set the pipeline&apos;s date range parameter to cover the two-month period, run
            the pipeline, and verify that the output is correct.
          </p>
          <p className="mb-3">
            Before running the backfill, I would identify the affected date range precisely &mdash; which specific days or
            hours produced incorrect output due to the bug &mdash; to minimize the backfill scope and reduce compute cost. I
            would also verify that the source data for the affected period is still available and has not been modified
            since the original pipeline run, because the backfill assumes the same input data.
          </p>
          <p>
            During the backfill, I would monitor the pipeline&apos;s output against validation checks in real-time,
            comparing the backfill output against the original output to identify the specific changes made by the bug
            fix. After the backfill completes, I would run a diff between the old and new output to verify that the
            changes are exactly what the bug fix was intended to produce &mdash; no more, no less &mdash; and that no unintended
            data was affected. Once verified, the corrected output would be atomically swapped into the production
            location, replacing the incorrect output.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <strong>Kleppmann, Designing Data-Intensive Applications</strong> &mdash; Chapter on batch processing covering
            MapReduce, distributed sorting, fault tolerance, and the evolution from batch to stream processing.
            O&apos;Reilly Media, 2017.
          </li>
          <li>
            <strong>Dean &amp; Ghemawat, &quot;MapReduce: Simplified Data Processing on Large Clusters&quot;</strong>
            &mdash; The foundational paper on distributed batch processing that introduced the map-reduce paradigm.{' '}
            <a
              href="https://research.google/pubs/mapreduce-simplified-data-processing-large-clusters/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              research.google/pubs/mapreduce-simplified-data-processing
            </a>
          </li>
          <li>
            <strong>Apache Airflow Documentation</strong> &mdash; Best practices for defining, scheduling, and monitoring
            batch data pipelines with Airflow DAGs, including retry logic, dependency management, and backfilling.{' '}
            <a
              href="https://airflow.apache.org/docs/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              airflow.apache.org/docs
            </a>
          </li>
          <li>
            <strong>Apache Spark Documentation &mdash; Batch Processing</strong> &mdash; Covers DataFrame API, Catalyst
            optimization, partitioning, and tuning for batch workloads.{' '}
            <a
              href="https://spark.apache.org/docs/latest/sql-programming-guide.html"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              spark.apache.org/docs/latest/sql-programming-guide
            </a>
          </li>
          <li>
            <strong>Data Quality Best Practices</strong> &mdash; Great Expectations documentation on defining, testing, and
            monitoring data quality in batch pipelines.{' '}
            <a
              href="https://docs.greatexpectations.io/docs/"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs.greatexpectations.io/docs
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}