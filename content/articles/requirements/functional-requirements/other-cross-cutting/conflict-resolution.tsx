"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-cross-functional-conflict-resolution",
  title: "Conflict Resolution",
  description:
    "Comprehensive guide to implementing conflict resolution covering conflict detection, conflict strategies, conflict resolution policies, conflict handling, and conflict management for data consistency and system reliability.",
  category: "functional-requirements",
  subcategory: "other-cross-cutting-functional-requirements",
  slug: "conflict-resolution",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-04-01",
  tags: [
    "requirements",
    "functional",
    "cross-cutting",
    "conflict-resolution",
    "data-consistency",
    "system-reliability",
    "concurrency",
  ],
  relatedTopics: ["duplicate-request-handling", "retry-mechanisms", "idempotent-requests", "data-consistency"],
};

export default function ConflictResolutionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          Conflict Resolution enables systems to detect and resolve conflicts that occur during concurrent operations. Systems can configure conflict detection (configure how to detect conflicts), set conflict strategies (set how to resolve conflicts), implement resolution policies (implement resolution policies), handle conflicts (handle conflicts), and manage conflicts (manage conflict process). Conflict resolution is fundamental to data consistency (maintain data consistency), system reliability (maintain system reliability), and user experience (maintain user experience). For distributed systems, effective conflict resolution is essential for data consistency, system reliability, and user experience.
        </p>
        <p>
          For staff and principal engineers, conflict resolution architecture involves conflict detection (detect conflicts), conflict strategies (define conflict strategies), resolution policies (define resolution policies), conflict handling (handle conflicts), and conflict management (manage conflict process). The implementation must balance consistency (resolve conflicts) with performance (don&apos;t overhead system) and user experience (maintain user experience). Poor conflict resolution leads to data corruption, system failures, and user frustration.
        </p>
        <p>
          The complexity of conflict resolution extends beyond simple conflict detection. Conflict detection (detect conflicts). Conflict strategies (define conflict strategies). Resolution policies (define resolution policies). Conflict handling (handle conflicts). Conflict management (manage conflict process). For staff engineers, conflict resolution is a data consistency infrastructure decision affecting data consistency, system reliability, and user experience.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Conflict Detection</h3>
        <p>
          Version detection detects conflicts by version. Version check (check versions). Version comparison (compare versions). Version conflict (detect version conflict). Version detection enables version detection. Benefits include accuracy (accurate detection), consistency (data consistency). Drawbacks includes detection overhead (detection overhead), complexity (complexity).
        </p>
        <p>
          Timestamp detection detects conflicts by timestamp. Timestamp check (check timestamps). Timestamp comparison (compare timestamps). Timestamp conflict (detect timestamp conflict). Timestamp detection enables timestamp detection. Benefits include accuracy (accurate detection), simplicity (simplicity). Drawbacks includes detection overhead (detection overhead), clock issues (clock issues).
        </p>
        <p>
          Content detection detects conflicts by content. Content check (check content). Content comparison (compare content). Content conflict (detect content conflict). Content detection enables content detection. Benefits include accuracy (accurate detection), completeness (complete detection). Drawbacks includes detection overhead (detection overhead), complexity (complexity).
        </p>

        <h3 className="mt-6">Conflict Strategies</h3>
        <p>
          Last write wins uses last write wins strategy. Last write (use last write). Write comparison (compare writes). Write selection (select write). Last write wins enables last write wins. Benefits include implementation simplicity (straightforward to implement), deterministic behavior (predictable outcomes). Drawbacks includes potential data loss (earlier writes lost), may not be correct (latest write may not be best).
        </p>
        <p>
          First write wins uses first write wins strategy. First write (use first write). Write comparison (compare writes). Write selection (select write). First write wins enables first write wins. Benefits include implementation simplicity (straightforward to implement), data preservation (first write preserved). Drawbacks includes may not be latest (ignores newer updates), may not be correct (first write may be outdated).
        </p>
        <p>
          Merge wins uses merge wins strategy. Merge writes (merge writes). Merge comparison (compare merges). Merge selection (select merge). Merge wins enables merge wins. Benefits include data preservation (all writes preserved), correctness (merged result combines all changes). Drawbacks includes implementation complexity (merge logic is complex), may not be possible (some conflicts cannot be merged).
        </p>

        <h3 className="mt-6">Resolution Policies</h3>
        <p>
          Automatic resolution resolves conflicts automatically. Auto detection (detect automatically). Auto resolution (resolve automatically). Auto notification (notify automatically). Automatic resolution enables automatic resolution. Benefits include no user burden (no user burden), immediate (immediate). Drawbacks includes may not be correct (may not be correct), user frustration (user frustration).
        </p>
        <p>
          Manual resolution resolves conflicts manually. Manual detection (detect manually). Manual resolution (resolve manually). Manual notification (notify manually). Manual resolution enables manual resolution. Benefits include user control (user control), correctness (correctness). Drawbacks includes user burden (user burden), delayed (delayed).
        </p>
        <p>
          Hybrid resolution resolves conflicts with hybrid. Auto detection (detect automatically). Manual resolution (resolve manually). Hybrid notification (notify hybrid). Hybrid resolution enables hybrid resolution. Benefits include best of both (best of both), user control (user control). Drawbacks includes complexity (complexity), may still have issues (may still have issues).
        </p>

        <h3 className="mt-6">Conflict Handling</h3>
        <p>
          Conflict logging logs conflicts. Conflict log (log conflicts). Log storage (store logs). Log analysis (analyze logs). Conflict logging enables conflict logging. Benefits include system visibility (understand conflict patterns), debugging support (troubleshoot issues). Drawbacks includes logging overhead (storage and performance costs), implementation complexity (logging infrastructure needed).
        </p>
        <p>
          Conflict notification notifies of conflicts. Conflict start (notify conflict start). Conflict progress (notify conflict progress). Conflict complete (notify conflict complete). Conflict notification enables conflict notification. Benefits include user awareness (users know about conflicts), transparency (visible conflict handling). Drawbacks includes notification overhead (sending notifications), implementation complexity (notification system needed).
        </p>
        <p>
          Conflict tracking tracks conflicts. Conflict count (count conflicts). Conflict status (track status). Conflict tracking (track conflicts). Conflict tracking enables conflict tracking. Benefits include system transparency (understand conflict frequency), management capability (track resolution progress). Drawbacks includes tracking overhead (storage costs), implementation complexity (tracking infrastructure needed).
        </p>

        <h3 className="mt-6">Conflict Management</h3>
        <p>
          Conflict prevention prevents conflicts. Prevention check (check prevention). Prevention enforcement (enforce prevention). Prevention notification (notify prevention). Conflict prevention enables conflict prevention. Benefits include reduced conflicts (fewer conflicts occur), improved user experience (smoother collaboration). Drawbacks includes prevention overhead (checking costs), may not prevent all (some conflicts inevitable).
        </p>
        <p>
          Conflict resolution resolves conflicts. Resolution check (check resolution). Resolution enforcement (enforce resolution). Resolution notification (notify resolution). Conflict resolution enables conflict resolution. Benefits include conflict resolution (conflicts get resolved), data consistency (maintain consistent state). Drawbacks includes resolution overhead (processing costs), implementation complexity (resolution logic needed).
        </p>
        <p>
          Conflict recovery recovers from conflicts. Recovery check (check recovery). Recovery enforcement (enforce recovery). Recovery notification (notify recovery). Conflict recovery enables conflict recovery. Benefits include system recovery (recover from conflicts), data integrity (maintain data integrity). Drawbacks includes recovery overhead (recovery processing costs), implementation complexity (recovery logic needed).
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Conflict resolution architecture spans detection service, strategy service, policy service, and handling service. Detection service manages detection. Strategy service manages strategies. Policy service manages policies. Handling service manages handling. Each layer has specific responsibilities and integration requirements.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/conflict-resolution/conflict-architecture.svg"
          alt="Conflict Resolution Architecture"
          caption="Figure 1: Conflict Resolution Architecture — Detection service, strategy service, policy service, and handling service"
          width={1000}
          height={500}
        />

        <h3>Detection Service</h3>
        <p>
          Detection service manages detection. Detection storage (store detection). Detection retrieval (retrieve detection). Detection update (update detection). Detection service is the core of conflict resolution. Benefits include centralization (one place for detection), consistency (same detection everywhere). Drawbacks includes complexity (manage detection), coupling (services depend on detection service).
        </p>
        <p>
          Detection policies define detection rules. Default detection (default detection). Detection validation (validate detection). Detection sync (sync detection). Detection policies automate detection management. Benefits include automation (automatic management), consistency (same rules for all). Drawbacks includes complexity (define policies), may not fit all cases.
        </p>

        <h3 className="mt-6">Strategy Service</h3>
        <p>
          Strategy service manages strategies. Strategy registration (register strategy). Strategy delivery (deliver by strategy). Strategy preferences (configure strategy). Strategy service enables strategy management. Benefits include strategy management (manage strategies), delivery (deliver by strategy). Drawbacks includes complexity (manage strategies), strategy failures (may not handle correctly).
        </p>
        <p>
          Strategy preferences define strategy rules. Strategy selection (select strategy). Strategy frequency (configure strategy frequency). Strategy priority (configure strategy priority). Strategy preferences enable strategy customization. Benefits include customization (customize strategies), user control (users control strategies). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/conflict-resolution/conflict-strategies.svg"
          alt="Conflict Strategies"
          caption="Figure 2: Conflict Strategies — Last write, first write, and merge wins"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Policy Service</h3>
        <p>
          Policy service manages policies. Policy registration (register policy). Policy delivery (deliver by policy). Policy preferences (configure policy). Policy service enables policy management. Benefits include policy management (manage policies), delivery (deliver by policy). Drawbacks includes complexity (manage policies), policy failures (may not handle correctly).
        </p>
        <p>
          Policy preferences define policy rules. Policy selection (select policy). Policy frequency (configure policy frequency). Policy priority (configure policy priority). Policy preferences enable policy customization. Benefits include customization (customize policies), user control (users control policies). Drawbacks includes complexity (many options), may be confusing (users may not understand).
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/conflict-resolution/conflict-flow.svg"
          alt="Conflict Flow"
          caption="Figure 3: Conflict Flow — Detection, resolution, and handling"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Conflict resolution design involves trade-offs between strict and lenient detection, automatic and manual resolution, and aggressive and conservative handling. Understanding these trade-offs enables informed decisions aligned with user needs and business requirements.
        </p>

        <h3>Detection: Strict vs. Lenient</h3>
        <p>
          Strict detection (strictly detect). Pros: High accuracy (high accuracy), no missed conflicts (no missed conflicts), data consistency (data consistency). Cons: Overhead (overhead), may detect false (may detect false), complexity (complexity). Best for: High accuracy, data consistency.
        </p>
        <p>
          Lenient detection (leniently detect). Pros: Lower overhead (lower overhead), no false detection (no false detection), simplicity (simplicity). Cons: May miss conflicts (may miss conflicts), data issues (data issues), accuracy issues (accuracy issues). Best for: Lower overhead, simplicity.
        </p>
        <p>
          Hybrid: strict with lenient option. Pros: Best of both (strict with lenient option). Cons: Complexity (strict and lenient), may still have issues. Best for: Most platforms—strict with lenient option.
        </p>

        <h3>Resolution: Automatic vs. Manual</h3>
        <p>
          Automatic resolution (automatically resolve). Pros: No user burden (no user burden), immediate (immediate), comprehensive (comprehensive). Cons: Resolution overhead (resolution overhead), may be unwanted (may be unwanted), performance (performance). Best for: User convenience, immediate resolution.
        </p>
        <p>
          Manual resolution (manually resolve). Pros: User control (user control), on-demand (on-demand), no overhead (no overhead). Cons: User burden (user burden), delayed (delayed), may be forgotten (may be forgotten). Best for: User control, on-demand.
        </p>
        <p>
          Hybrid: automatic with manual option. Pros: Best of both (automatic for convenience, manual for control). Cons: Complexity (automatic and manual), may confuse users. Best for: Most platforms—automatic with manual option.
        </p>

        <h3>Handling: Aggressive vs. Conservative</h3>
        <p>
          Aggressive handling (aggressively handle). Pros: High success rate (high success rate), fast resolution (fast resolution), user satisfaction (user satisfaction). Cons: System load (system load), resource usage (resource usage), may overwhelm (may overwhelm). Best for: High success rate, fast resolution.
        </p>
        <p>
          Conservative handling (conservatively handle). Pros: System protection (protect system), resource management (manage resources), no overwhelm (no overwhelm). Cons: Lower success rate (lower success rate), slower resolution (slower resolution), user frustration (user frustration). Best for: System protection, resource management.
        </p>
        <p>
          Hybrid: aggressive with conservative option. Pros: Best of both (aggressive with conservative option). Cons: Complexity (aggressive and conservative), may still have issues. Best for: Most platforms—aggressive with conservative option.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/other-cross-cutting/conflict-resolution/conflict-comparison.svg"
          alt="Conflict Resolution Approaches Comparison"
          caption="Figure 4: Conflict Resolution Approaches Comparison — Detection, resolution, and handling trade-offs"
          width={1000}
          height={450}
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Provide conflict detection:</strong> Version detection. Timestamp detection. Content detection. Let users choose.
          </li>
          <li>
            <strong>Implement conflict strategies:</strong> Last write wins. First write wins. Merge wins.
          </li>
          <li>
            <strong>Define resolution policies:</strong> Automatic resolution. Manual resolution. Hybrid resolution.
          </li>
          <li>
            <strong>Handle conflicts:</strong> Conflict logging. Conflict notification. Conflict tracking.
          </li>
          <li>
            <strong>Manage conflicts:</strong> Conflict prevention. Conflict resolution. Conflict recovery.
          </li>
          <li>
            <strong>Notify of conflicts:</strong> Notify when conflict detected. Notify of conflict resolution. Notify of conflict handling.
          </li>
          <li>
            <strong>Monitor conflicts:</strong> Monitor conflict usage. Monitor conflict detection. Monitor conflict resolution.
          </li>
          <li>
            <strong>Test conflicts:</strong> Test conflict detection. Test conflict strategies. Test resolution policies.
          </li>
          <li>
            <strong>Ensure consistency:</strong> Meet consistency requirements. Support data integrity. Respect system protection.
          </li>
          <li>
            <strong>Provide support:</strong> Provide user support. Provide documentation. Provide help.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No conflict detection:</strong> Can&apos;t detect conflicts. <strong>Solution:</strong> Provide conflict detection.
          </li>
          <li>
            <strong>No conflict strategies:</strong> No strategies. <strong>Solution:</strong> Implement conflict strategies.
          </li>
          <li>
            <strong>No resolution policies:</strong> No policies. <strong>Solution:</strong> Define resolution policies.
          </li>
          <li>
            <strong>No conflict handling:</strong> Can&apos;t handle conflicts. <strong>Solution:</strong> Handle conflicts.
          </li>
          <li>
            <strong>No conflict management:</strong> Can&apos;t manage conflicts. <strong>Solution:</strong> Manage conflicts.
          </li>
          <li>
            <strong>No conflict tracking:</strong> Can&apos;t track conflicts. <strong>Solution:</strong> Provide conflict tracking.
          </li>
          <li>
            <strong>No notification:</strong> Don&apos;t notify of conflicts. <strong>Solution:</strong> Notify when detected.
          </li>
          <li>
            <strong>No monitoring:</strong> Don&apos;t know conflict usage. <strong>Solution:</strong> Monitor conflicts.
          </li>
          <li>
            <strong>No consistency:</strong> Don&apos;t meet requirements. <strong>Solution:</strong> Ensure consistency.
          </li>
          <li>
            <strong>No testing:</strong> Don&apos;t test conflicts. <strong>Solution:</strong> Test conflict detection and strategies.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Database Conflict Resolution</h3>
        <p>
          Database platforms provide conflict resolution. Write conflicts (resolve write conflicts). Transaction conflicts (resolve transaction conflicts). Replication conflicts (resolve replication conflicts). Users control database conflict resolution.
        </p>

        <h3 className="mt-6">Cloud Service Conflict Resolution</h3>
        <p>
          Cloud services provide conflict resolution. Service conflicts (resolve service conflicts). Resource conflicts (resolve resource conflicts). Operation conflicts (resolve operation conflicts). Users control cloud service conflict resolution.
        </p>

        <h3 className="mt-6">Microservice Conflict Resolution</h3>
        <p>
          Microservices provide conflict resolution. Service conflicts (resolve service conflicts). Call conflicts (resolve call conflicts). Dependency conflicts (resolve dependency conflicts). Users control microservice conflict resolution.
        </p>

        <h3 className="mt-6">Distributed System Conflict Resolution</h3>
        <p>
          Distributed systems provide conflict resolution. Node conflicts (resolve node conflicts). Data conflicts (resolve data conflicts). Operation conflicts (resolve operation conflicts). Users control distributed system conflict resolution.
        </p>

        <h3 className="mt-6">Collaborative Application Conflict Resolution</h3>
        <p>
          Collaborative applications provide conflict resolution. Edit conflicts (resolve edit conflicts). User conflicts (resolve user conflicts). Data conflicts (resolve data conflicts). Users control collaborative application conflict resolution.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you design conflict resolution that balances consistency with performance?</p>
            <p className="mt-2 text-sm">
              Implement conflict resolution with performance because users want consistency (data correct, no lost updates) but want performance (not slow down every write). Detect conflicts: detect conflicts (version conflicts, timestamp conflicts, content conflicts)—identify conflicts before data corruption. Resolve conflicts: resolve conflicts (automatic resolution, manual resolution, merge)—handle conflicts appropriately. Monitor performance: monitor performance (conflict rate, resolution time, performance impact)—identify optimization opportunities, balance consistency with cost. The performance insight: users want consistency but want performance—provide detection (version, timestamp, content), resolution (automatic, manual, merge), monitoring (rate, time, impact), and balance data consistency with performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you implement conflict strategies?</p>
            <p className="mt-2 text-sm">
              Implement conflict strategies because different scenarios need different resolution approaches. Last write wins: use last write (latest timestamp wins, most recent update, simple resolution)—simple, automatic, no user intervention. First write wins: use first write (first update wins, preserve original, prevent overwrite)—preserve original, prevent accidental overwrite. Merge wins: use merge (merge changes, combine updates, preserve both)—preserve all changes, complex but complete. Strategy enforcement: enforce strategy (apply strategy, verify applied, audit strategy)—ensure strategy actually enforced. The strategy insight: strategies need implementation—last write (latest, recent, simple), first write (first, original, prevent), merge (merge, combine, preserve), enforce (apply, verify, audit), and choose appropriate strategy for scenario.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you detect conflicts?</p>
            <p className="mt-2 text-sm">
              Implement conflict detection because conflicts must be detected before resolution. Version detection: detect by version (version numbers, version comparison, version conflict)—detect version conflicts, optimistic locking. Timestamp detection: detect by timestamp (timestamps, time comparison, timestamp conflict)—detect time-based conflicts, last-write detection. Content detection: detect by content (content hash, content comparison, content conflict)—detect content conflicts, semantic conflicts. Detection enforcement: enforce detection (verify detection, check all writes, audit detection)—ensure detection actually happens. The detection insight: detection needs implementation—version (numbers, comparison, conflict), timestamp (timestamps, time, conflict), content (hash, comparison, conflict), enforce (verify, check, audit), and detect all conflict types.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you resolve conflicts?</p>
            <p className="mt-2 text-sm">
              Implement conflict resolution because detected conflicts must be resolved. Automatic resolution: resolve automatically (last-write-wins, first-write-wins, automatic merge)—no user intervention, fast resolution. Manual resolution: resolve manually (user chooses, manual merge, user decision)—user control, complex conflicts. Hybrid resolution: resolve with hybrid (automatic for simple, manual for complex, hybrid approach)—best of both, appropriate resolution. Resolution enforcement: enforce resolution (verify resolved, check applied, audit resolution)—ensure resolution actually happens. The resolution insight: resolution needs implementation—automatic (last-write, first-write, merge), manual (user, merge, decision), hybrid (automatic, manual, appropriate), enforce (verify, check, audit), and resolve conflicts appropriately.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle concurrent writes?</p>
            <p className="mt-2 text-sm">
              Implement concurrent write handling because concurrent writes cause conflicts. Write detection: detect writes (detect concurrent writes, identify conflicts, track writes)—identify concurrent writes before conflict. Write resolution: resolve writes (resolve concurrent, apply strategy, handle conflicts)—handle concurrent writes appropriately. Write enforcement: enforce writes (verify writes, check applied, audit writes)—ensure writes actually handled. Write notification: notify writes (notify of conflicts, inform users, alert on conflicts)—user awareness, manual resolution. The write insight: writes need handling—detect (concurrent, conflicts, track), resolve (concurrent, strategy, handle), enforce (verify, check, audit), notify (conflicts, inform, alert), and handle concurrent writes effectively.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you ensure data consistency?</p>
            <p className="mt-2 text-sm">
              Implement data consistency because conflicts can corrupt data. Conflict detection: support detection (detect conflicts, identify conflicts, track conflicts)—detect before corruption. Conflict resolution: support resolution (resolve conflicts, handle conflicts, fix conflicts)—resolve before corruption. Conflict prevention: support prevention (prevent conflicts, avoid conflicts, reduce conflicts)—prevent conflicts proactively. Consistency enforcement: enforce consistency (verify consistency, check data, audit consistency)—ensure consistency maintained. The consistency insight: consistency is important—support detection (detect, identify, track), resolution (resolve, handle, fix), prevention (prevent, avoid, reduce), enforce (verify, check, audit), and ensure data consistency despite concurrent writes.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              AWS — Conflict Resolution
            </a>
          </li>
          <li>
            <a
              href="https://docs.microsoft.com/en-us/azure/cosmos-db/conflict-resolution"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft — Conflict Resolution
            </a>
          </li>
          <li>
            <a
              href="https://cloud.google.com/spanner/docs/conflict-resolution"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google — Conflict Resolution
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/conflict-resolution/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Conflict Resolution
            </a>
          </li>
          <li>
            <a
              href="https://martinfowler.com/articles/patterns-of-distributed-systems/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Martin Fowler — Distributed Systems Patterns
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Netflix/Hystrix"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Netflix — Hystrix
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
