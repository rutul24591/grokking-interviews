"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-cicd-dashboard",
  title: "Design a CI/CD Dashboard (like GitHub Actions)",
  description:
    "Principal-level architecture for CI/CD dashboards covering run state, live logs, DAG visualization, artifacts, approvals, flaky test intelligence, auditability, and operational scale.",
  category: "high-level-design",
  subcategory: "developer-experience-systems",
  slug: "cicd-dashboard",
  wordCount: 5600,
  readingTime: 32,
  lastUpdated: "2026-05-22",
  tags: ["hld", "cicd", "github-actions", "pipeline", "developer-tools"],
  relatedTopics: ["api-playground", "developer-documentation-system"],
};

export default function CicdDashboardArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2><HighlightBlock as="p" tier="crucial" className="mb-4">System-design interview lens: frame Design a CI/CD Dashboard (like GitHub Actions) around system boundary, state ownership, failure handling, scalability, security, and observable recovery. This is the difference between describing a feature and designing a production system.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Clarify the product promise, the non-negotiable correctness boundary, the main actor, and the failure mode users would actually notice first.</HighlightBlock>
        <HighlightBlock as="p" tier="important">
          A CI/CD dashboard is the control plane and observability surface for software delivery. It shows pipeline runs, job dependency graphs, live logs, test results, artifacts, deployment approvals, and actions such as cancel, retry, and rerun failed jobs. GitHub Actions, GitLab CI, Buildkite, CircleCI, and Jenkins Blue Ocean are representative systems. For principal interviews, the design must cover event streaming, large log handling, permissioned mutations, audit trails, and how the dashboard remains trustworthy when many teams depend on it for production releases.
        </HighlightBlock>
        <p>
          The dashboard is not the build executor itself, but it is often the interface through which developers decide whether a change is safe. That means stale state, missing logs, ambiguous failures, or unsafe approval controls can delay incident recovery or allow a bad deployment. The system should be treated as a high-read, event-driven application with a few high-risk write actions.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Core interview invariant: the design must preserve correctness under latency, concurrency, partial failure, and changing permissions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Name the source of truth, derived state, speculative state, cache state, and audit or telemetry state separately; collapsing them hides most real design bugs.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For Design a CI/CD Dashboard (like GitHub Actions), the interviewer is checking whether you can defend why each subsystem exists, not just list components in a diagram.</HighlightBlock>
        <p>
          The core data model contains pipeline runs, jobs, steps, log chunks, artifacts, checks, deployment environments, approval gates, and actors. Runs and jobs are state machines. Events such as queued, started, step completed, log appended, artifact uploaded, gate waiting, approved, failed, cancelled, and retried are appended by the CI backend and projected into read models for the UI. This event-first model lets the dashboard recover from reconnects by replaying changes from a known cursor.
        </p>
        <p>
          Logs are the highest-volume data path. A single job can produce hundreds of thousands of lines, and a popular repository can have many concurrent viewers during a broken main branch. Logs need chunking, compression, virtualized rendering, search, retention policy, and resume support. The UI must avoid placing every line into React state, and the backend must avoid fanning every byte independently to every viewer when a shared stream can be multiplexed.
        </p>
        <p>
          Mutating actions are safety-critical. Cancel, rerun, approve deployment, reject deployment, mark flaky, and download restricted artifacts all need authorization, idempotency, optimistic UI with reconciliation, and audit logs. A principal-level answer should distinguish read freshness from write correctness: read streams can tolerate brief lag; approval writes cannot tolerate ambiguous ownership or missing audit context.
        </p>
        <p>
          The dashboard also needs multiple views over the same event stream. A developer wants one failing job, the owning step, and a searchable log. A release manager wants environment gates, commit range, approvals, and artifact provenance. A platform team wants fleet-level signals such as queue time, cache hit rate, runner saturation, flaky test rate, and cost by repository. Designing only the run-detail page misses the broader system: CI/CD dashboards become operational control planes once hundreds of teams rely on them for production movement.
        </p>
        <p>
          State freshness has to be explicit. The run list can show eventual updates and reconnect banners. Log tailing can tolerate a missed chunk if replay by cursor works. Deployment approval state must come from committed server state, not local optimism. Artifact downloads need authorization at the moment the signed URL is minted because artifacts often contain binaries, reports, screenshots, or environment-specific metadata. These distinctions make the answer feel principal-level rather than a generic real-time dashboard answer.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Architecture decisions to make explicit: state model, API contracts, cache policy, async workflow, authorization, rollout, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Walk the hard path end to end: permission check, input validation, async work, timeout or partial failure, user-visible fallback, telemetry, and rollback.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Call out which path is synchronous, which path is asynchronous, which artifacts are immutable, and which updates may arrive out of order.</HighlightBlock>
        <p>
          The initial page load reads a paginated run list and the selected run snapshot. The client then subscribes to a server-sent event stream or WebSocket channel keyed by repository and run. Events update the run list, DAG status, gate state, and log cursors. Logs are stored separately as append-only chunks in object storage or a log service, while run metadata is served from a low-latency read model. This separation prevents large log traffic from slowing normal dashboard navigation.
        </p>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/developer-experience-systems/cicd-dashboard.svg"
          alt="CI/CD dashboard high level architecture"
          caption="Run metadata, job DAG, live logs, artifacts, flaky test data, and approval controls are projected from append-only pipeline events."
        />
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/developer-experience-systems/cicd-log-streaming-flow.svg"
          alt="CI/CD live log streaming flow"
          caption="Live logs are chunked, compressed, resumable, and rendered through a virtualized client view rather than a full DOM tree."
        />
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/developer-experience-systems/cicd-approval-audit-flow.svg"
          alt="CI/CD approval and audit flow"
          caption="Deployment approvals require permission checks, idempotent decisions, audit records, and real-time propagation to every run viewer."
        />
        <p>
          For log streaming, server-sent events are often enough because the flow is mostly server-to-client and reconnect support is built in. WebSockets become attractive when the same connection also carries interactive terminal input, agent control, or multi-channel multiplexing. In either case, the client should resume from a cursor rather than replaying the full log on reconnect.
        </p>
        <p>
          The run event store should be append-only, while UI read models are replaceable projections. This allows the dashboard to rebuild corrupted summaries, replay missing transitions, and prove what happened during an audit. Log chunks should be stored separately from run state because they have different retention, volume, and access patterns. A failed job may need logs retained for months for compliance, while a successful ephemeral preview build may only need short retention. The architecture should let retention policy vary by repository, branch protection, and environment criticality.
        </p>
        <p>
          A principal-ready design should also account for multi-tenant fairness. One repository with verbose logs or thousands of matrix jobs should not starve status updates for other teams. The event fanout layer needs per-repository quotas, backpressure, lossy counters for non-critical live metrics, and prioritized delivery for state transitions such as failed, waiting for approval, canceled, and deployed. Logs can lag briefly; a production approval or failed deployment transition should not.
        </p>
        <p>
          The dashboard should make pipeline causality visible. A failed deployment may depend on a failing test, a missing artifact, a blocked approval, an exhausted runner pool, or an external secret provider outage. A principal-level UI correlates run events with runner allocation, cache restore, dependency download, artifact upload, environment lock, and approval state. This lets users distinguish a product regression from platform capacity exhaustion without opening five separate tools.
        </p>
        <p>
          Release environments need stronger modeling than ordinary jobs. Production, staging, preview, and ephemeral test environments have different approval rules, concurrency locks, rollback semantics, and audit requirements. The dashboard should show which environment is locked, which run owns the lock, which commit is currently deployed, which run is waiting, and whether a rerun will reuse or replace prior artifacts. Without this model, users can accidentally deploy an older commit or approve a run whose artifact no longer matches the reviewed source.
        </p>
        <p>
          Artifact provenance is part of the dashboard contract. A release manager should see which source commit, workflow definition, runner image, dependency lockfile, signing key, SBOM, and artifact digest produced a deployable output. If the workflow is rerun after approval, the dashboard must show whether the deploy still points to the reviewed artifact or a newly generated artifact. Principal-level candidates should call out this distinction because many CI/CD failures are not test failures; they are failures to prove what exactly reached production.
        </p>
        <p>
          Runner isolation should be visible enough for operators to reason about risk. Hosted shared runners, self-hosted runners, privileged deployment runners, and ephemeral sandbox runners have different trust models. The dashboard should show runner label, pool health, isolation level, queue age, and policy restrictions without exposing sensitive host details. When a job is blocked by runner policy or capacity, users should see that directly instead of reading through raw logs.
        </p>
      </section>

      <section>
        <h2>Trade offs &amp; Comparison</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Trade-off lens: optimize for correctness and recoverability first, then latency, cost, developer velocity, and UX polish.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare centralized vs distributed ownership, server-authoritative vs client-speculative state, and strong consistency vs eventual consistency where the product allows it.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">A staff/principal answer should state what gets worse when the simpler design is chosen, and what operational burden appears when the more robust design is chosen.</HighlightBlock>
        <p>
          Server-sent events are simpler for one-way status and log updates, work through most enterprise proxies, and support automatic reconnect with a last-event cursor. WebSockets support bidirectional interaction and custom multiplexing, but they require more lifecycle handling and backpressure design. Polling is easy to operate, but it wastes capacity and increases perceived latency for fast pipelines. A good design often uses normal APIs for snapshots, SSE for status and log tailing, and separate artifact download URLs for large immutable outputs.
        </p>
        <p>
          Rendering the DAG on the client keeps the backend simple and supports responsive interactions, but very large DAGs can become visually unusable. Server-computed layout gives stable coordinates and can cache expensive graph layout, but it couples presentation to backend logic. For typical CI graphs, client topological layout is sufficient; for enterprise release trains with hundreds of jobs, precomputed layout plus clustering by stage is more usable.
        </p>
        <p>
          Storing logs in a searchable log platform gives powerful debugging, retention controls, and cross-run queries, but it can be expensive and may expose sensitive build output to broader observability tools. Object storage chunks are cheaper and simple for replay, but weaker for search. Mature systems often use object storage as the source of record and index selected metadata or redacted log excerpts for search.
        </p>
        <p>
          A second major trade-off is fail-open versus fail-closed release gating. If the dashboard cannot reach the approval service, a fail-open system may let emergency releases continue but weakens compliance. A fail-closed system protects production but can block incident mitigation. Most organizations choose fail-closed for production deploy gates, with a documented break-glass path that requires stronger audit evidence, short-lived elevated permission, and post-incident review. That policy belongs in the system design because UI availability and release safety are coupled.
        </p>
        <p>
          Flaky test quarantine also has a product trade-off. Automatically quarantining flaky tests improves developer throughput but can hide real regressions. Keeping every flaky test blocking protects quality but destroys trust in CI. A mature design uses thresholds, owners, expiration dates, and criticality: a flaky visual test for an admin-only page may be quarantined quickly, while a flaky payment test should page an owner and remain release-blocking until triaged.
        </p>
        <p>
          Artifact handling has a separate trust trade-off. Build logs are usually text-heavy and broadly visible to repository contributors, while artifacts may contain binaries, screenshots with customer-like data, SBOMs, signing metadata, or deployable packages. The dashboard should not treat artifact URLs as ordinary static links. It should check authorization at download time, show scanning or provenance status, and distinguish preview artifacts from release artifacts that can reach production.
        </p>
      </section>

      <section>
        <h2>Best practices</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Best practice: make the invariant testable through explicit states, typed events, idempotent operations, scoped permissions, and observable transitions.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Instrument the system around user-visible outcomes: latency, error rate, fallback rate, conversion, stale-state duration, and rollback success.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Keep escape hatches governed. Temporary bypasses, manual overrides, and emergency controls should have owner, reason, expiry, and audit evidence.</HighlightBlock>
        <p>
          Keep run state event-driven and make clients cursor-aware. Use virtualized log rendering, pause auto-scroll when users scroll upward, preserve scroll position per job, and expose log search without forcing a full browser download. Model approvals as durable decisions with actor, permission basis, environment, commit range, comment, timestamp, and resulting pipeline transition.
        </p>
        <p>
          Separate high-frequency visual updates from durable writes. It is acceptable for a duration counter to update locally, but it is not acceptable for a deployment gate to look approved before the server commits the audit event. For reruns and cancels, show optimistic pending state, then reconcile from the stream. For artifacts, use signed URLs with short expiration and authorization checks at issuance time.
        </p>
        <p>
          Build the dashboard with degradation modes. If live streaming is unavailable, the run detail page should fall back to snapshot polling and static log chunk reads. If flaky-test analytics is delayed, it should show data freshness rather than hiding the panel. If artifact scanning is still pending, downloads can be marked unavailable or restricted according to policy. These degraded states are common in real CI systems and are exactly where interviewers test operational maturity.
        </p>
        <p>
          Make release-critical actions boring and explicit. Approval, cancellation, and rerun controls should show the target environment, commit SHA, workflow attempt, actor, and expected consequence before submission. Retrying a failed job is different from rerunning an entire workflow because cached artifacts, generated credentials, and approval gates may change. The UI should reflect those semantics so operators do not accidentally create a new deployment path while trying to recover an old one.
        </p>
        <p>
          Build operational views for platform owners, not only repository users. Platform teams need runner saturation, queue age by label, cache hit rate, secret-provider latency, artifact-store errors, log-ingestion lag, and cost attribution by organization. These signals explain why many pipelines are slow or failing at once. A principal interview answer should include this fleet view because CI/CD dashboards become shared infrastructure as soon as hundreds of repositories rely on them.
        </p>
        <p>
          Support incident-mode navigation. During a broken main branch or failed production deploy, users should land directly on failed or blocked nodes, recent deploy attempts, changed files, responsible owners, rollback candidates, and related incidents. The dashboard should suppress decorative success detail and emphasize the critical path. This is a different experience from normal pull-request debugging and is often what separates mature CI/CD products from build-log viewers.
        </p>
        <p>
          Treat secrets and environment variables as invisible dependencies. A job can fail because a secret expired, an environment was rotated, or a scoped token lost permission. The dashboard should not reveal secret values, but it can show secret version age, rotation event timing, permission-denied classifications, and owner links. That gives developers a safe path to diagnosis without leaking sensitive configuration.
        </p>
        <p>
          Connect CI health to ownership and investment decisions. A dashboard should expose the slowest workflows, highest-cost matrix jobs, noisiest flakes, most frequently retried deployment gates, and repositories with poor cache behavior. Those aggregate signals help platform teams fund improvements and help product teams understand the cost of their pipeline design. Without this layer, the dashboard helps individual developers debug but fails as a principal-level operating system for engineering delivery.
        </p>
        <p>
          Preserve audit evidence even when UI projections are rebuilt. The source-of-record event log should retain approvals, reruns, cancellations, artifact publication, environment locks, and policy overrides. Derived read models can be regenerated, but audit events must remain immutable and queryable by repository, actor, environment, commit, and time window. This matters for regulated organizations and for post-incident reconstruction.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Most dangerous failure modes: stale state, hidden partial failure, unbounded retries, ownership ambiguity, and missing observability.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Do not present a happy-path component graph as the full design. Interviewers will push on retries, stale data, permission changes, overload, deletion, and incident recovery.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Avoid vague words like scalable, secure, and reliable unless you attach them to concrete limits, policies, SLOs, and failure handling behavior.</HighlightBlock>
        <p>
          A common pitfall is treating logs as normal UI text. Large logs need streaming, chunking, virtual scrolling, and memory caps. Another pitfall is showing current run state by repeatedly polling broad run summaries; this creates unnecessary load and still misses fast transitions. Teams also often under-design approval gates, forgetting re-authentication, environment-specific permissions, separation of duties, and audit evidence required by regulated organizations.
        </p>
        <p>
          Flaky test features can also become misleading if they only show a label without statistical context. A test that failed once in thirty runs is different from a test that fails one out of three attempts. The UI should show sample size, recent trend, owner, affected branches, and whether the failure is quarantined, ignored, or still release-blocking.
        </p>
        <p>
          A serious pitfall is letting rerun semantics become ambiguous. Rerunning a failed job, rerunning all failed jobs, and rerunning the whole workflow can produce different artifacts, use different secrets, re-enter approval gates, and deploy different code if branch references moved. The dashboard must show attempt number, commit SHA, artifact identity, and gate reuse policy so users do not confuse a diagnostic retry with a release action.
        </p>
        <p>
          Teams also under-design the failure mode where CI infrastructure is degraded during an incident. If live streams, artifact service, or approval service are partially down, the dashboard should show degraded state and safe fallback actions. Silent partial failure is worse than a hard outage because operators may approve or retry based on incomplete evidence.
        </p>
      </section>

      <section>
        <h2>Real-world use cases</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Real-world relevance: the same design shows up when teams need a reusable, observable, and governable product capability rather than a one-off screen.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Tie the article back to adoption: how multiple teams integrate, how the system rolls out gradually, how migrations happen, and how operators know the feature is healthy.</HighlightBlock>
        <p>
          Developer teams use CI dashboards to debug pull request failures, release managers use them to approve staged deployments, and incident commanders use them to confirm rollback or hotfix progress. Platform teams use aggregate views to find slow pipelines, expensive jobs, flake hotspots, and teams that need help improving build health.
        </p>
        <p>
          In large organizations, the same dashboard becomes a compliance artifact. It must answer who approved production, what commit was deployed, which checks passed, which artifacts were produced, and how long the gate waited. That changes the design from a convenience UI into an operational record.
        </p>
        <p>
          Platform engineering organizations use aggregate CI/CD dashboards to plan capacity and reliability work. Queue-age trends reveal runner shortages, cache misses reveal dependency or build-system problems, and recurring approval delays reveal process bottlenecks. The principal-level design should include this fleet view because delivery reliability is a shared platform outcome, not only a per-pipeline debugging problem.
        </p>
      </section>

      <section>
        <h2>Common interview question with detailed answer</h2><HighlightBlock as="p" tier="crucial" className="mb-4">Strong answer structure: define the invariant, draw the state/data flow, identify the bottleneck, handle failure, name trade-offs, and close with metrics and tests.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">If pressed for staff/principal depth, discuss ownership boundaries, operational runbooks, migration plan, abuse prevention, and how the design fails safely.</HighlightBlock>
        <h3>How would you stream live logs at scale?</h3>
        <p>
          I would store logs as append-only chunks with monotonically increasing cursors, stream new chunks over SSE or WebSocket, and let clients resume from the last seen cursor. The browser would keep chunks outside hot React state, render visible lines through virtualization, and batch updates. The backend would compress chunks, enforce retention, redact known secrets, and provide static chunk fetch for replay so a reconnect does not require the stream service to replay everything from memory.
        </p>
        <h3>How would you design deployment approval gates?</h3>
        <p>
          I would model an approval gate as a stateful resource tied to an environment and commit range. The approve or reject action checks permissions, separation-of-duties rules, gate freshness, and idempotency key. It writes an audit record before unblocking the pipeline and emits a state event to all viewers. The UI should not rely only on optimistic state; it should show pending until the committed gate event arrives.
        </p>
        <h3>Would you use polling, SSE, or WebSockets?</h3>
        <p>
          I would use normal APIs for initial snapshots, SSE for most run status and log tailing because the flow is server-to-client and reconnect semantics are useful, and WebSockets only if the product needs bidirectional interaction such as terminal sessions or agent control. Polling remains useful for low-frequency aggregate pages, but not for live run details.
        </p>
        <h3>How do you keep the dashboard usable for very large pipelines?</h3>
        <p>
          I would cluster jobs by stage, provide search and filtering, collapse successful groups by default, virtualize long lists, and show a compact critical path view. For DAG layout, I would use client layout for normal pipelines and precomputed or library-assisted layout for very large graphs. The UI should guide users to failed, blocked, and waiting nodes first rather than forcing them to inspect the whole graph.
        </p>
        <h3>How would you prove what artifact was deployed?</h3>
        <p>
          I would make artifact identity explicit in the run model. The dashboard should show source commit, workflow attempt, runner image, artifact digest, signing status, SBOM link, provenance attestation, approval event, and deployment environment. Deployment actions should reference immutable artifact IDs, not moving branch names. If a workflow is rerun after approval, the UI should clearly show whether a new artifact was produced and whether it requires fresh approval. This creates an auditable chain from source to production.
        </p>
      </section>

      <section>
        <h2>References</h2>
        <ul>
          <li>GitHub Actions documentation: workflow runs, logs, artifacts, and environments.</li>
          <li>GitLab CI/CD documentation: pipelines, jobs, artifacts, and environments.</li>
          <li>MDN Web Docs: Server-sent events and WebSocket APIs.</li>
          <li>OpenTelemetry semantic conventions for CI/CD observability.</li>
          <li>NIST guidance on audit logging and change control for production systems.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
