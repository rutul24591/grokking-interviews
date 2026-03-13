"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-cache-eviction-policies-extensive",
  title: "Cache Eviction Policies",
  description:
    "Detailed guide to eviction algorithms, admission control, and operational trade-offs.",
  category: "backend",
  subcategory: "caching-performance",
  slug: "cache-eviction-policies",  wordCount: 1987,  readingTime: 10,
  lastUpdated: "2026-03-13",
  tags: ["backend", "caching", "eviction", "performance"],
  relatedTopics: ["caching-strategies", "cache-coherence", "cache-warming"],
};

export default function CacheEvictionPoliciesConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Role</h2>
        <p>
          <strong>Eviction policies</strong> decide which items to remove when a cache is full.
          They shape hit rate, tail latency, and stability under load. An eviction policy is
          rarely just an algorithm; it is a set of assumptions about access patterns and the
          cost of misses.
        </p>
      </section>

      <section>
        <h2>Core Policies</h2>
        <ul className="space-y-2">
          <li>
            <strong>LRU:</strong> evict least recently used items. Good for recency-driven
            workloads but vulnerable to scans.
          </li>
          <li>
            <strong>LFU:</strong> evict least frequently used items. Better for skewed access
            patterns but slower to adapt to sudden shifts.
          </li>
          <li>
            <strong>TinyLFU / W-TinyLFU:</strong> uses frequency sketches with admission control
            to resist pollution.
          </li>
          <li>
            <strong>FIFO / Random:</strong> simple but often poor hit rates in real workloads.
          </li>
        </ul>
        <ArticleImage
          src="/diagrams/backend/caching-performance/eviction-policies-overview.svg"
          alt="Overview of eviction policies"
          caption="Eviction choices map to different access patterns"
        />
      </section>

      <section>
        <h2>Admission vs Eviction</h2>
        <p>
          Eviction decides what to remove; admission decides what to let in. Without admission
          control, scans or long-tail traffic can evict hot data. TinyLFU-style policies pair
          a lightweight frequency filter with eviction to keep the working set stable. This is
          critical in workloads with unbounded key diversity.
        </p>
        <ArticleImage
          src="/diagrams/backend/caching-performance/lru-vs-lfu.svg"
          alt="LRU versus LFU behavior"
          caption="Frequency-sensitive policies better protect hot keys"
        />
      </section>

      <section>
        <h2>Working Set & Access Patterns</h2>
        <p>
          Eviction should match access patterns. Recency-heavy workloads (news feeds, social
          timelines) favor LRU. Highly skewed workloads (catalog, auth tokens) favor LFU-like
          policies. If the working set exceeds cache capacity, eviction cannot compensate; you
          either need more cache or tighter admission filters.
        </p>
      </section>

      <section>
        <h2>Fairness & Multi-Tenant Caches</h2>
        <p>
          In multi-tenant systems, global eviction can allow a noisy tenant to evict hot data
          for others. Solutions include partitioned caches, per-tenant quotas, or tiered
          eviction policies that enforce fairness. These mechanisms trade raw hit ratio for
          predictable performance across tenants.
        </p>
      </section>

      <section>
        <h2>Failure Modes & Risk</h2>
        <ul className="space-y-2">
          <li>
            <strong>Cache pollution:</strong> one-time keys displace hot entries. Admission
            control is the primary defense.
          </li>
          <li>
            <strong>Hot key eviction:</strong> premature eviction causes latency spikes and DB
            load. Protect with TTL jitter and pinning for critical keys.
          </li>
          <li>
            <strong>Thrashing:</strong> high churn where hit ratio oscillates. Indicates
            insufficient capacity or mismatched policy.
          </li>
        </ul>
      </section>

      <section>
        <h2>Operational Playbooks</h2>
        <p>
          When hit ratios collapse, first identify whether it is a policy mismatch or a
          capacity issue. If the access pattern changed (seasonal traffic, migration), adjust
          policy or admission control. If capacity is too small, scale cache or reduce key
          diversity via normalization.
        </p>
      </section>

      <section>
        <h2>Observability Signals</h2>
        <ul className="space-y-2">
          <li>Eviction rate and top evicted key classes.</li>
          <li>Miss latency contribution to P95 and P99.</li>
          <li>Hit ratio under steady vs bursty traffic.</li>
          <li>Skew metrics such as top 1% key concentration.</li>
        </ul>
      </section>

      <section>
        <h2>Decision Checklist</h2>
        <ul className="space-y-2">
          <li>Characterize access patterns (recency vs frequency).</li>
          <li>Estimate working set size and traffic skew.</li>
          <li>Decide whether admission control is required.</li>
          <li>Plan fairness if multiple tenants share cache.</li>
        </ul>
      </section>

      <section>
        <h2>Scenario & Decision Path</h2>
        <p>
          Consider a product catalog where 5% of SKUs drive 80% of traffic. An LRU cache can
          perform well until a nightly batch job scans the entire catalog, which pollutes the
          cache and evicts the hot items. In this scenario, pairing LRU with admission control
          or switching to TinyLFU keeps hot items resident even during scans. The decision is
          less about algorithm purity and more about the observed access pattern.
        </p>
        <p>
          For a multi-tenant analytics platform, fairness matters more than absolute hit
          ratio. Partitioned caches with per-tenant quotas may be preferable to a global LFU
          that overfits to the loudest tenants. The right choice is the one that preserves
          predictable performance for all customers.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Alternatives</h2>
        <p>
          LRU is simple and fast but can be fragile under scans. LFU is more stable for skewed
          access but slower to adapt when traffic shifts. Random eviction is sometimes used
          in extremely high-throughput systems because of its low overhead, but it typically
          sacrifices hit ratio. The key trade-off is between adaptiveness, overhead, and
          robustness to adversarial traffic patterns.
        </p>
      </section>

      <section>
        <h2>Scenario & Decision Path</h2>
        <p>
          Consider a product catalog where 5% of SKUs drive 80% of traffic. An LRU cache can
          perform well until a nightly batch job scans the entire catalog, which pollutes the
          cache and evicts the hot items. In this scenario, pairing LRU with admission control
          or switching to TinyLFU keeps hot items resident even during scans. The decision is
          less about algorithm purity and more about the observed access pattern.
        </p>
        <p>
          For a multi-tenant analytics platform, fairness matters more than absolute hit
          ratio. Partitioned caches with per-tenant quotas may be preferable to a global LFU
          that overfits to the loudest tenants. The right choice is the one that preserves
          predictable performance for all customers.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Alternatives</h2>
        <p>
          LRU is simple and fast but can be fragile under scans. LFU is more stable for skewed
          access but slower to adapt when traffic shifts. Random eviction is sometimes used
          in extremely high-throughput systems because of its low overhead, but it typically
          sacrifices hit ratio. The key trade-off is between adaptiveness, overhead, and
          robustness to adversarial traffic patterns.
        </p>
      </section>
<section>
  <h2>Design Goals & Constraints</h2>
  <p>
    Eviction should be tuned to protect the working set, not just maximize hit rate. In
    systems with volatile traffic, the goal may be stability rather than absolute
    performance. Policies must also respect memory limits and avoid pathological
    behaviors under scans or bursts.
  </p>
  <p>
    Consider whether eviction needs to be deterministic for debugging and whether
    eviction metadata overhead is acceptable. In ultra-low-latency systems, lightweight
    policies may be preferable even at a modest hit ratio cost.
  </p>
</section>

<section>
  <h2>Operational Playbook</h2>
  <p>
    When hit ratios collapse, identify whether a traffic shift or cache size reduction
    is the root cause. If access skew has changed, adjust policy or admission control.
    If the working set grew, scale cache capacity or reduce key diversity.
  </p>
  <p>
    Maintain dashboards that show eviction rate, top evicted key classes, and access
    pattern changes. These allow you to tune policy proactively instead of reacting
    after performance degrades.
  </p>
</section>

<section>
  <h2>Failure Scenarios</h2>
  <p>
    LRU is vulnerable to scans: a batch job can evict the hottest keys, causing sudden
    latency spikes. LFU is vulnerable to traffic shifts, where once-hot keys remain
    resident while new hot keys are evicted. TinyLFU reduces these risks by filtering
    one-off keys.
  </p>
  <p>
    Another failure mode is unfairness in multi-tenant caches. Without quotas, a noisy
    tenant can push out data for smaller tenants. This surfaces as unpredictable latency
    for otherwise stable workloads.
  </p>
</section>

<section>
  <h2>Trade-offs & Alternatives</h2>
  <p>
    LRU is simple and fast but can be fragile under scans. LFU is more stable for skewed
    access but slower to adapt when traffic shifts. Random eviction minimizes metadata
    overhead but offers weaker hit ratios. The right choice depends on your observed
    traffic distribution and tolerance for churn.
  </p>
  <p>
    Admission control is often more important than eviction policy. Filtering out
    one-time keys can deliver a larger hit ratio improvement than switching from LRU to
    LFU.
  </p>
</section>

<section>
  <h2>Metrics & Alerts</h2>
  <p>
    Key metrics include eviction rate, churn (evictions per new key), and hit ratio
    stability under load. Track the top evicted key namespaces to detect whether a
    specific feature or batch job is polluting the cache.
  </p>
  <p>
    Alerts should trigger when evictions spike or when hit ratios drop sharply without
    corresponding traffic growth. This often signals a scan or policy mismatch.
  </p>
</section>

<section>
  <h2>Scenario Walkthrough</h2>
  <p>
    A media feed uses LRU and performs well until a daily analytics job scans all posts.
    The scan evicts the top posts, and users see slower loads. Switching to TinyLFU or
    adding a “cache on second access” rule prevents the scan from displacing hot data,
    stabilizing performance.
  </p>
  <p>
    In a multi-tenant SaaS, partitioning the cache by tenant prevents a large customer
    from evicting smaller tenants’ data, improving fairness at the cost of some
    utilization efficiency.
  </p>
</section>
<section>
  <h2>Key Mechanics</h2>
  <p>
    Eviction policies rely on metadata such as recency, frequency, or admission scores.
    The overhead of maintaining this metadata can be significant at very high QPS, so
    the algorithm choice must balance hit ratio with CPU and memory costs.
  </p>
</section>

<section>
  <h2>Integration Patterns</h2>
  <p>
    Eviction is influenced by upstream caches and downstream databases. If you have
    multi-level caching, eviction at L1 might cascade to L2. Coordinate policies across
    layers so that hot keys are protected consistently.
  </p>
</section>

<section>
  <h2>Edge Cases & Security</h2>
  <p>
    Traffic anomalies, such as adversarial scans or abusive key patterns, can degrade
    eviction behavior. Admission control and request filtering reduce the impact of
    malicious or unintended traffic on cache stability.
  </p>
</section>

<section>
  <h2>Testing & Validation</h2>
  <p>
    Replay production traffic to compare eviction policies. Measure hit ratio stability
    under bursty loads and simulated scans. Validate that changes do not cause sudden
    spikes in origin load.
  </p>
</section>

<section>
  <h2>Operational Checklist</h2>
  <ul className="space-y-2">
    <li>Measure access skew and working set size before choosing a policy.</li>
    <li>Monitor eviction churn and identify top evicted namespaces.</li>
    <li>Apply admission control when scans are frequent.</li>
    <li>Protect hot keys from accidental eviction during batch jobs.</li>
    <li>Re-evaluate policy after major traffic shifts.</li>
  </ul>
</section>
<section>
  <h2>Capacity & Cost Considerations</h2>
  <p>
    LRU and LFU decisions directly influence memory footprint and cache churn. If
    capacity is undersized, no policy can rescue hit ratio. Size caches around the
    working set and consider cost trade-offs, such as duplication in multi-layer caches
    or network overhead in shared caches.
  </p>
  <p>
    Cost models should include not only cache infrastructure but also downstream impact.
    For example, weak TinyLFU can increase database load, which often costs more than the
    cache itself.
  </p>
</section>

<section>
  <h2>Migration & Evolution</h2>
  <p>
    Cache behavior evolves with product changes. When introducing new fields, switching
    to admission, or changing key structure, use versioned keys or phased rollouts. This
    prevents sudden invalidations and allows safe rollback if correctness issues appear.
  </p>
  <p>
    Regularly revisit assumptions about scans and hot keys. Traffic shifts, new features, or
    incident learnings often require adjusting TTLs, invalidation rules, or cache size.
  </p>
</section>

<section>
  <h2>Common Pitfalls & Anti-patterns</h2>
  <p>
    The most common mistakes are caching without a staleness budget and using cache keys
    that omit critical context. For churn, avoid broad flushes that cause stampedes or
    cache cold starts. For working set, avoid over-optimizing by adding complexity without
    measurable improvements.
  </p>
  <p>
    Another anti-pattern is treating cache metrics as success indicators without tying
    them to user experience. High hit ratios can still produce poor latency if cached
    responses are slow to compute or serialize.
  </p>
</section>

<section>
  <h2>Detailed Notes</h2>
  <ul className="space-y-2">
    <li><strong>LRU:</strong> choose rules that align with correctness budgets and user impact.</li>
    <li><strong>LFU:</strong> tune for traffic shape and avoid pathological patterns.</li>
    <li><strong>TinyLFU:</strong> treat it as a first-class operational control, not an afterthought.</li>
    <li><strong>admission:</strong> monitor it continuously because it often degrades silently.</li>
    <li><strong>scans:</strong> design safeguards to prevent cascading failures or data leaks.</li>
    <li><strong>hot keys:</strong> tie metrics to user-facing latency rather than internal counters.</li>
    <li><strong>churn:</strong> expect it to change as traffic and data evolve.</li>
    <li><strong>working set:</strong> use targeted improvements instead of broad cache flushes.</li>
  </ul>
</section>
<section>
  <h2>Extended Scenario</h2>
  <p>
    Imagine a high-traffic service where LRU and LFU are already in place, but a new
    feature increases churn and creates new access patterns. Suddenly, scans becomes too
    long and stale data appears during peak usage. The team introduces TinyLFU or admission in the
    critical path, reducing staleness but increasing latency. This trade-off forces a
    redesign of cache scopes and TTL budgets.
  </p>
  <p>
    The solution often requires a layered approach: tighten scans for critical keys,
    preserve working set for predictable hot sets, and add operational safeguards so the system
    can fail open without overwhelming the origin. This kind of scenario is typical in
    large systems where caching is both a performance and correctness tool.
  </p>
</section>

<section>
  <h2>Design Review Questions</h2>
  <p>
    A design review for LRU should ask: Which data can tolerate scans? How does LFU affect
    cache key cardinality? What happens if hot keys fails or is delayed? Are there safe
    rollbacks if TinyLFU changes? Do we have monitoring that links churn to user-facing
    latency? These questions anchor the design in correctness and operational reality,
    rather than just performance theory.
  </p>
  <p>
    Reviewers should also ask whether admission introduces new failure modes, whether the
    system can tolerate partial cache loss, and how quickly the team can recover if a
    cache incident occurs. The best designs anticipate those answers before production.
  </p>
</section>

<section>
  <h2>Runbook Steps</h2>
  <ul className="space-y-2">
    <li>Verify that scans values match current freshness expectations.</li>
    <li>Check hot keys health metrics and backlog indicators.</li>
    <li>Inspect churn for unusual spikes or skew.</li>
    <li>Temporarily bypass LRU for critical endpoints if correctness is at risk.</li>
    <li>Apply targeted mitigation using working set or throttling as needed.</li>
    <li>Document root cause and update policy for LFU and TinyLFU.</li>
  </ul>
</section>





      <section>
        <h2>Summary</h2>
        <p>
          Eviction policy is a performance contract. It defines how the cache behaves under
          pressure, and how failures propagate. Select policies based on measured access
          patterns, not intuition.
        </p>
      </section>
    </ArticleLayout>
  );
}
