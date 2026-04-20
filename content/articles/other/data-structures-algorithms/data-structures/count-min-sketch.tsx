"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "count-min-sketch",
  title: "Count-Min Sketch",
  description: "A sublinear-space sketch for approximate frequency counting over high-cardinality streams — bounded error guarantees, mergeable across nodes, and the structure behind heavy-hitter detection in DDoS protection and analytics.",
  category: "other",
  subcategory: "data-structures",
  slug: "count-min-sketch",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-18",
  tags: ["count-min-sketch", "probabilistic", "streaming", "heavy-hitters", "data-structures"],
  relatedTopics: ["bloom-filters", "hyperloglog", "hash-tables"],
};

export default function CountMinSketchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition & Context</h2>
        <p className="mb-4">
          A count-min sketch is a probabilistic data structure that estimates the frequency of items in a stream using sublinear space. It maintains a 2D array of counters with d rows and w columns, plus d independent hash functions. Updates increment d cells; queries return the minimum of d cells. The estimate is a tight upper bound on the true count, with the over-estimate bounded by an additive ε·N error (N = total stream weight) at confidence 1−δ.
        </p>
        <p className="mb-4">
          Graham Cormode and S. Muthukrishnan introduced the structure in 2005. It generalizes the earlier &quot;count sketch&quot; (Charikar et al. 2002) by using min instead of median, sacrificing the ability to handle negative updates in exchange for tighter bounds and simpler analysis. The pair (count sketch / count-min sketch) is the canonical answer to &quot;estimate item frequencies in a stream you can&apos;t store&quot;.
        </p>
        <p>
          Today count-min sketch backs heavy-hitter detection in network monitoring (DDoS attack source identification), trending-topic computation in social media (Twitter), top-K query estimation in databases (Redshift, ClickHouse), word-frequency tables in NLP pipelines, and rate-limiting in API gateways. Apache Spark, Flink, and Druid ship with built-in count-min implementations.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <p className="mb-4">
          The sketch is a 2D array of counters: d rows, w columns, total d·w counters. Each row i has its own hash function hᵢ mapping items to a column in [0, w). The structure stores no items — just collision counts.
        </p>
        <p className="mb-4">
          <strong>Update(x, c):</strong> for each row i ∈ [1, d], increment counter[i][hᵢ(x)] by c. Total work O(d) — typically d = 4 to 8, regardless of stream size. <strong>Query(x):</strong> return min over all rows of counter[i][hᵢ(x)]. The estimate is always ≥ true count because collisions only inflate counters; never deflate them.
        </p>
        <p className="mb-4">
          <strong>Why min?</strong> Each row gives an upper-bound estimate (true count + collisions from other items hashing to the same column). The minimum across rows is the tightest such bound, since a smaller value implies fewer collisions in that row. By the pigeonhole principle and a Markov-style argument, the probability that all d rows are simultaneously inflated by more than ε·N is at most (1/e)^d ≈ δ for d = ln(1/δ).
        </p>
        <p>
          The accuracy guarantee, formally: with probability ≥ 1 − δ, the estimate exceeds the true count by at most ε·N, where N = Σ counts (total stream weight). Sizing (assuming d pairwise-independent hash functions): w = ⌈e/ε⌉, d = ⌈ln(1/δ)⌉. For ε = 0.001 and δ = 0.01: w ≈ 2718, d ≈ 5, total ~14K counters. At 4 bytes per counter, that&apos;s ~56KB to estimate frequencies over arbitrarily many items.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/count-min-sketch-diagram-1.svg"
          alt="Count min sketch 2D counter array with four hash functions mapping the key user42 to four cells across four rows showing the increment pattern"
          caption="Figure 1: A d×w grid of counters. Each row has its own hash function. Update increments d cells; query returns the minimum of d cells."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture & Flow</h2>
        <p className="mb-4">
          Implementation is straightforward: a flat Int32Array (or Uint32Array for higher counter ranges) of size d·w, plus d hash function seeds. Hash function selection matters: pairwise-independent hashes are sufficient for the theoretical guarantee, and MurmurHash3 with d different seeds is the standard choice in practice. SipHash is preferred when adversarial inputs are possible — adversaries who know the hash functions can craft inputs to maximize collisions.
        </p>
        <p className="mb-4">
          <strong>Mergeable across nodes.</strong> Two sketches with the same dimensions (d, w) and the same hash seeds can be merged by element-wise addition: merged[i][j] = a[i][j] + b[i][j]. The merged sketch is exactly the sketch of the union of the two streams. This property is critical for distributed systems — every shard maintains its own sketch, and a coordinator merges them periodically without re-scanning data.
        </p>
        <p className="mb-4">
          <strong>Heavy-hitters via min-heap pairing.</strong> The sketch alone tells you the frequency of any item you query, but doesn&apos;t enumerate items. To find the top-K most frequent items, pair the sketch with a min-heap of size K: on each update, query the sketch for the new estimate; if it exceeds the heap&apos;s minimum, push the item with that estimate. The heap surfaces the top-K with O(d log K) per update.
        </p>
        <p className="mb-4">
          <strong>Conservative update.</strong> A common optimization (Estan-Varghese 2002): instead of incrementing all d cells, find the current minimum across the d cells, then only update cells whose value equals that minimum (or set all d to min + c, equivalently). This tightens the over-estimate dramatically for skewed Zipfian distributions — typical web traffic, search queries, social mentions — at no asymptotic cost.
        </p>
        <p>
          <strong>Sliding-window variants.</strong> The base sketch accumulates forever. To get &quot;heavy hitters in the last 24 hours&quot;, partition time into windows, maintain one sketch per window, and merge or expire as needed. Algorithms like CMS-Decay and exponentially-decaying sketches embed forgetting directly into the counter updates.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/count-min-sketch-diagram-2.svg"
          alt="Update flow incrementing d cells in red across rows alongside query flow reading those cells in purple and returning the minimum value"
          caption="Figure 2: Update increments all d cells; query returns the minimum across d cells. Both are O(d) — typically 4 to 8 — independent of stream size."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs & Comparisons</h2>
        <p className="mb-4">
          <strong>Count-min vs exact hash map.</strong> Hash map is exact but stores every key — O(distinct keys) memory. Count-min is sublinear (independent of distinct count) but only approximate. For 100M unique keys, hash map needs gigabytes; count-min for 0.01% accuracy needs megabytes — a 1000× memory reduction.
        </p>
        <p className="mb-4">
          <strong>Count-min vs Bloom filter.</strong> Different problems entirely. Bloom answers &quot;is x in the set?&quot;; count-min answers &quot;how many times has x been seen?&quot;. They&apos;re both sketches but solve orthogonal problems.
        </p>
        <p className="mb-4">
          <strong>Count-min vs HyperLogLog.</strong> HLL counts distinct items (cardinality); count-min counts occurrences per item (frequency). HLL gives one number per stream; count-min gives a function from item to count. Often used together: HLL for &quot;how many unique URLs?&quot;, count-min for &quot;which URLs are most popular?&quot;.
        </p>
        <p className="mb-4">
          <strong>Count-min vs count sketch.</strong> Count sketch (Charikar 2002) uses signed counters and median; supports negative updates; gives unbiased estimates with tighter bounds in some regimes. Count-min uses unsigned counters and min; only supports non-negative updates; gives biased upper-bound estimates with simpler analysis. Count-min is more popular because it&apos;s simpler to reason about and analyze.
        </p>
        <p>
          <strong>Count-min-mean-min.</strong> A variant by Goyal &amp; Daumé (2011) subtracts a noise estimate from each cell before taking the min, removing the systematic over-estimate bias. Improves accuracy for low-frequency queries at minor cost.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Size by error tolerance, not memory budget.</strong> Pick ε and δ from product requirements (&quot;within 0.1% of total at 99% confidence&quot;), then derive w and d. Backwards sizing produces nonsense guarantees.</li>
          <li><strong>Use conservative update for skewed data.</strong> For Zipfian distributions (web traffic, social activity), conservative update reduces error 2–10× without changing the asymptotic bound.</li>
          <li><strong>Pair with a top-K heap for heavy hitters.</strong> The sketch alone can&apos;t enumerate items. The heap holds candidate heavy hitters; the sketch provides up-to-date estimates.</li>
          <li><strong>Merge sketches across shards.</strong> The mergeability property is the killer feature for distributed systems — exploit it. Each shard maintains a local sketch; a coordinator merges them periodically.</li>
          <li><strong>Use SipHash for adversarial inputs.</strong> Public-facing rate limiters and abuse detection face adversaries who can craft hash collisions if you use weak hashes. SipHash-2-4 is the standard hardened choice.</li>
          <li><strong>Consider sliding-window variants for time-bounded queries.</strong> A monolithic sketch accumulates forever — add windowing or decay if you need recency.</li>
          <li><strong>Cap counter width.</strong> 32-bit counters wrap at ~4B; for very long streams, use 64-bit. Or use saturating arithmetic if you only care about heavy hitters anyway.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Treating estimates as exact.</strong> Count-min returns an upper bound. For low-frequency items, the over-estimate can be a large multiple of the true count. Always factor the error bound into downstream logic.</li>
          <li><strong>Querying for items never inserted.</strong> The sketch will return a non-zero estimate (collisions from other items). For membership-style questions, pair with a Bloom filter — the count-min isn&apos;t designed for absence detection.</li>
          <li><strong>Decrementing cells.</strong> Count-min doesn&apos;t support negative updates correctly — a decremented cell may underestimate other items&apos; counts. Use count sketch (with median) or count-min-log if you need decay.</li>
          <li><strong>Mismatched hash seeds when merging.</strong> Two sketches can only be merged if they use the same d, w, AND the same hash seeds. A subtle bug — silent corruption with no error.</li>
          <li><strong>Sizing for n distinct items rather than total weight N.</strong> The error bound is ε·N (total weight), not ε·n (distinct items). For high-throughput streams these differ by orders of magnitude.</li>
          <li><strong>Ignoring tail events.</strong> δ is the failure probability per query. Across millions of queries, you will see error excursions — handle them in the consuming logic rather than asserting correctness.</li>
          <li><strong>Using fast hashes in adversarial settings.</strong> MurmurHash is fine for benign data; an adversary who knows the seeds can craft inputs to flood specific cells, defeating the bound.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>DDoS detection and rate limiting.</strong> Network monitoring systems use count-min sketches to identify source IPs sending anomalously many packets, without storing per-IP state. Cloudflare, Fastly, and similar edge networks run these sketches inline at line rate; sources whose estimates exceed thresholds get rate-limited or blocked. The mergeability property lets edge nodes combine sketches across the fleet for global views.
        </p>
        <p className="mb-4">
          <strong>Trending topics and heavy-hitter analytics.</strong> Twitter&apos;s trending hashtags and Facebook&apos;s popular pages use count-min variants to track item popularity over rolling windows. Exact counters per topic don&apos;t scale to billions of distinct items; count-min plus top-K heap delivers near-real-time trends in megabytes.
        </p>
        <p className="mb-4">
          <strong>Database query optimization and approximate analytics.</strong> ClickHouse, Spark&apos;s `countMinSketch` aggregator, and Redshift use sketches to estimate join cardinalities, top-K group-by results, and selectivity for query planning. The optimizer doesn&apos;t need exact counts to choose join order — a 1% estimate is plenty.
        </p>
        <p className="mb-4">
          <strong>NLP word-frequency tables.</strong> Building n-gram language models from terabyte-scale corpora doesn&apos;t fit in RAM as exact counts. Count-min sketches with conservative update give compact frequency tables for billions of distinct n-grams; the heavy n-grams (the only ones that matter for language modeling) come out of the sketch with tight bounds.
        </p>
        <p>
          <strong>Caching admission policies.</strong> The W-TinyLFU cache (used by Caffeine in the JVM ecosystem) uses a count-min sketch to estimate access frequency of items, deciding whether a new item should evict an existing one. The sketch lets the cache reason about long-term frequency without storing per-item history.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/count-min-sketch-diagram-3.svg"
          alt="Bar chart comparing exact hash map counts in green to count min sketch estimates in red showing the sketch slightly overestimates each value alongside a memory comparison panel"
          caption="Figure 3: Sketch estimates always upper-bound the true counts. For 100M distinct keys: hash map ~5GB, sketch ~5MB — three orders of magnitude smaller."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why does count-min always over-estimate?</p>
            <p className="mt-2 text-sm">A: Each row&apos;s counter accumulates contributions from all items that hash to that column. Querying item x reads counter[i][hᵢ(x)], which includes x&apos;s true count <em>plus</em> noise from collisions. The minimum across rows is the tightest such over-estimate. There&apos;s no mechanism to subtract collision noise without losing the simple analysis.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you size a count-min sketch?</p>
            <p className="mt-2 text-sm">A: Pick ε (target additive error as a fraction of total stream weight N) and δ (failure probability). Then w = ⌈e/ε⌉ and d = ⌈ln(1/δ)⌉. For ε=0.001 and δ=0.01: w≈2718, d≈5, total ~14K counters ≈ 56KB. Crucially, sizing depends on N (total weight) not on the number of distinct items — that&apos;s the sublinear-space property.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you find heavy hitters with a count-min sketch?</p>
            <p className="mt-2 text-sm">A: Pair the sketch with a min-heap of size K. On each stream item, update the sketch, then query the new estimate. If the estimate exceeds the heap&apos;s minimum, push the item with that estimate (replacing the minimum). After the stream, the heap holds the top-K candidates with their over-estimated counts.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Can you decrement a count-min sketch?</p>
            <p className="mt-2 text-sm">A: Not safely. Decrementing a cell may make estimates for other items inaccurate (under-estimate, breaking the upper-bound guarantee). For decay or deletion, use count sketch (signed counters with median) or count-min-log (decay-aware variant). Or maintain time-windowed sketches that you replace rather than decrement.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between count-min sketch and HyperLogLog?</p>
            <p className="mt-2 text-sm">A: Different questions. HLL estimates cardinality (&quot;how many distinct items?&quot;) — one number per stream. Count-min estimates per-item frequency (&quot;how many times have I seen X?&quot;) — a function from item to count. They&apos;re complementary; analytics pipelines often use both — HLL for unique-visitor counts, count-min for top-page rankings.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does conservative update help?</p>
            <p className="mt-2 text-sm">A: Standard update increments all d cells; conservative update only increments cells that currently equal the minimum across the d cells (or sets all to min + c). This avoids inflating cells that already have higher values from other items. For Zipfian distributions, conservative update reduces the error 2–10× — most stream workloads are Zipfian, so this is nearly always worth doing.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References & Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Cormode, Muthukrishnan — &quot;An Improved Data Stream Summary: The Count-Min Sketch and its Applications&quot; (J. of Algorithms 2005), the original paper</li>
          <li>Charikar, Chen, Farach-Colton — &quot;Finding Frequent Items in Data Streams&quot; (ICALP 2002), the count sketch predecessor</li>
          <li>Estan, Varghese — &quot;New Directions in Traffic Measurement and Accounting&quot; (SIGCOMM 2002), conservative update</li>
          <li>Goyal, Daumé — &quot;Approximate Scalable Bounded Space Sketch for Large Data NLP&quot; (EMNLP 2011), Count-Min-Mean-Min</li>
          <li>Cormode, Muthukrishnan — &quot;Summarizing and Mining Skewed Data Streams&quot; (SDM 2005)</li>
          <li>Apache DataSketches library — production-grade implementations across multiple languages</li>
          <li>Caffeine cache (Java) — W-TinyLFU admission policy using count-min sketch</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
