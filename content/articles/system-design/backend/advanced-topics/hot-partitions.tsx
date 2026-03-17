"use client";

import { ArticleImage } from "@/components/articles/ArticleImage";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-hot-partitions-extensive",
  title: "Hot Partitions",
  description:
    "Recognize and fix skew: why a few partitions dominate load, how it shows up in latency and errors, and mitigation patterns that restore fairness and stability.",
  category: "backend",
  subcategory: "advanced-topics",
  slug: "hot-partitions",
  wordCount: 2800,
  readingTime: 14,
  lastUpdated: "2026-03-14",
  tags: ["backend", "advanced", "scaling", "performance"],
  relatedTopics: ["sharding-strategies", "cache-stampede", "tail-latency"],
};

export default function HotPartitionsConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>What a Hot Partition Is</h2>
        <p>
          A <strong>hot partition</strong> occurs when a small subset of partitions receives a disproportionate share of
          traffic or stores a disproportionate share of data. In a sharded system, partition hotspots are common because
          real workloads are rarely uniform: some users are more active, some keys are more popular, and some tenants
          are larger.
        </p>
        <p>
          Hot partitions hurt reliability in predictable ways: p99 latency rises, error rates increase due to timeouts,
          and the system becomes unstable because retry traffic amplifies load on already-saturated partitions.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/hot-partitions-diagram-1.svg"
          alt="Hot partition diagram showing skewed traffic distribution across shards"
          caption="Sharding assumes load distribution. Hot partitions break that assumption and turn one shard into the system’s bottleneck."
        />
      </section>

      <section>
        <h2>Common Root Causes</h2>
        <p>
          Hot partitions are often caused by key design choices and workload patterns that produce skew.
        </p>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Key-space skew</h3>
            <p className="mt-2 text-sm text-muted">
              A few keys dominate traffic, such as a popular item, a celebrity account, or a shared resource ID.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Time-based clustering</h3>
            <p className="mt-2 text-sm text-muted">
              Writes cluster by time, such as monotonic IDs or time buckets, pushing traffic into a small partition range.
            </p>
          </div>
        </div>
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Tenant imbalance</h3>
            <p className="mt-2 text-sm text-muted">
              A single large tenant outgrows others and saturates the shard that owns its data.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Read amplification</h3>
            <p className="mt-2 text-sm text-muted">
              Cache misses or expensive fanout reads cause high CPU on a small subset of shards, even when traffic is not extreme.
            </p>
          </div>
        </div>
        <p>
          The important point is that hotspots are not always permanent. They can be event-driven (viral content) and
          require mitigations that can be turned on quickly and removed later.
        </p>
      </section>

      <section>
        <h2>How Hot Partitions Show Up Operationally</h2>
        <p>
          Hot partitions create a distinct signature: one shard shows high CPU, queue depth, or disk latency while the
          rest of the cluster looks healthy. End-to-end latency rises because requests are gated by the slowest shard.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/hot-partitions-diagram-2.svg"
          alt="Hot partition observability diagram showing per-shard latency, saturation, and request distribution"
          caption="Cluster averages hide hotspots. Per-partition metrics are required to see skew, identify hot keys, and measure whether mitigations restore fairness."
        />
        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">Metrics That Actually Identify Hot Partitions</h3>
          <ul className="space-y-2">
            <li>
              Per-partition QPS and concurrency, not just total traffic.
            </li>
            <li>
              Per-partition p95 and p99 latency and timeout rates.
            </li>
            <li>
              Saturation signals: CPU, queue depth, disk latency, and thread pool usage by shard.
            </li>
            <li>
              Top keys or top tenants within each shard, sampled to avoid heavy overhead.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Mitigation Patterns</h2>
        <p>
          Fixing hot partitions usually requires changing how work maps to partitions or reducing the work per request.
          There is no single solution because hot partitions arise from different causes.
        </p>
        <ul className="mt-4 space-y-2">
          <li>
            <strong>Key salting:</strong> split a hot key into multiple subkeys and merge results at read time.
          </li>
          <li>
            <strong>Adaptive sharding:</strong> split a hot partition into smaller ones and move them independently.
          </li>
          <li>
            <strong>Read caching:</strong> cache hot reads close to consumers, with request coalescing to avoid stampedes.
          </li>
          <li>
            <strong>Write sharding:</strong> distribute writes for a hot entity and compact later into a canonical view.
          </li>
          <li>
            <strong>Fairness controls:</strong> per-tenant quotas and rate limits so one tenant cannot saturate shared infrastructure.
          </li>
        </ul>
        <p className="mt-4">
          The mitigation should match the failure mode. If the hotspot is a read hotspot, caching and coalescing may be
          enough. If the hotspot is a write hotspot, you need write distribution and a merge strategy. If the hotspot is
          a tenant hotspot, you may need tenant isolation or dedicated shards.
        </p>
      </section>

      <section>
        <h2>Data Movement and Rebalancing</h2>
        <p>
          Long-term hotspot fixes often require moving data. Rebalancing is operationally risky because it can increase
          latency and cause partial availability if not staged. Mature systems support online rebalancing with throttles
          and with a clear plan for traffic cutover and rollback.
        </p>
        <p>
          The hard part is correctness during movement: routing must remain consistent, and clients must not observe
          partial state. Many systems use versioned routing tables and dual reads during transitions, with explicit
          validation before final cutover.
        </p>
      </section>

      <section>
        <h2>Failure Modes and Mitigations</h2>
        <p>
          Hot partition mitigation can itself create incidents if it increases complexity or amplifies load. The goal is
          to reduce hotspot pressure without doubling work.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/advanced-topics/hot-partitions-diagram-3.svg"
          alt="Hot partition mitigation failure modes: over-salting, amplification, and unstable rebalancing"
          caption="Hot partition fixes can backfire if they amplify work or destabilize routing. Mitigations should be staged, observable, and reversible."
        />
        <div className="my-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Amplification from naive salting</h3>
            <p className="mt-2 text-sm text-muted">
              Salting reduces write hotspots but makes reads expensive if each read must fan out to many subkeys.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> keep salt cardinality small, cache merged results, and use coalescing for hot reads.
              </li>
              <li>
                <strong>Signal:</strong> read latency and downstream fanout increase after applying salting.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold">Rebalancing instability</h3>
            <p className="mt-2 text-sm text-muted">
              Data movement and routing changes cause partial outages or inconsistent routing under load.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>
                <strong>Mitigation:</strong> versioned routing, staged movement with throttles, and validation before cutover.
              </li>
              <li>
                <strong>Signal:</strong> error spikes correlated with routing table changes or movement job start times.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Scenario: A Viral Post Saturates One Shard</h2>
        <p>
          A social system shards by post ID. A single post goes viral, and reads and writes (likes, comments) saturate
          the shard that owns that post. A short-term mitigation is to cache the post and aggregate counts, and to
          coalesce update reads. A medium-term mitigation is to shard the interaction stream for that post across
          multiple partitions while preserving a consistent user-visible view.
        </p>
        <p>
          The long-term mitigation is a key design change: avoid sharding solely by object ID when objects can become
          hotspots, or introduce adaptive partition splitting and tenant-aware isolation.
        </p>
      </section>

      <section>
        <h2>Checklist</h2>
        <ul className="space-y-2">
          <li>
            Per-partition metrics exist, and hotspots can be identified without relying on cluster averages.
          </li>
          <li>
            Hot key and hot tenant detection is available to guide mitigation and capacity decisions.
          </li>
          <li>
            Mitigation options exist for both read and write hotspots (caching, coalescing, salting, adaptive splitting).
          </li>
          <li>
            Rebalancing and routing changes are staged, throttled, and reversible with validation gates.
          </li>
          <li>
            Fairness controls prevent one tenant or key from permanently saturating shared infrastructure.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do hot partitions usually show up in p99 latency?</p>
            <p className="mt-2 text-sm text-muted">
              A: Because requests depend on the slowest shard. Even if most partitions are healthy, one saturated partition pushes end-to-end requests into the tail.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is a quick mitigation during an incident?</p>
            <p className="mt-2 text-sm text-muted">
              A: Cache and coalesce reads for hot keys, apply fairness limits, and reduce work per request. Structural partition changes take longer and should be staged.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When does salting help and when does it hurt?</p>
            <p className="mt-2 text-sm text-muted">
              A: It helps distribute write load for a hot key, but it can hurt read performance by increasing fanout unless merged results are cached and the salt cardinality is controlled.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}

