"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "bloom-filters",
  title: "Bloom Filters",
  description: "A probabilistic membership test that uses k hash functions and a bit array to answer 'is x in the set?' with no false negatives, bounded false positives, and a fraction of the memory of an exact set.",
  category: "other",
  subcategory: "data-structures",
  slug: "bloom-filters",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-18",
  tags: ["bloom-filter", "probabilistic", "hashing", "membership", "data-structures"],
  relatedTopics: ["hash-tables", "lsm-trees", "count-min-sketch"],
};

export default function BloomFiltersArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition & Context</h2>
        <p className="mb-4">
          A Bloom filter is a space-efficient probabilistic data structure that answers the question &quot;is x a member of this set?&quot; with two possible verdicts: <strong>definitely not</strong>, or <strong>probably yes</strong>. False positives occur with a tunable rate p; false negatives never occur. The structure uses a bit array of m bits and k independent hash functions, requiring roughly 1.44 · log₂(1/p) bits per element — about 10 bits per element for a 1% false-positive rate, regardless of element size.
        </p>
        <p className="mb-4">
          Burton Howard Bloom introduced the structure in 1970 to solve a hyphenation lookup problem at Bell Labs: a 500KB dictionary did not fit in 1960s memory, but a Bloom filter approximating it did, with rare misses falling through to disk. The pattern — use a small probabilistic structure to filter expensive exact lookups — is the canonical Bloom filter use case to this day.
        </p>
        <p>
          Today Bloom filters are everywhere in storage systems and distributed databases. RocksDB, Cassandra, HBase, LevelDB, and BigTable all embed per-SSTable Bloom filters to skip disk seeks for absent keys. CDNs use them to dedupe cache lookups. Web browsers use them for malicious-URL screening. The structure is so foundational to LSM-tree storage that disabling it can degrade point-read latency by 10×.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <p className="mb-4">
          The Bloom filter consists of two things: an m-bit array (initially all zero) and k independent hash functions h₁, h₂, …, hₖ, each mapping elements to indices in [0, m). <strong>Insert(x):</strong> compute h₁(x), …, hₖ(x), and set those k bits to 1. <strong>Contains(x):</strong> check those same k bits — if all are 1, return &quot;probably yes&quot;; if any is 0, return &quot;definitely no&quot;.
        </p>
        <p className="mb-4">
          The two-sided semantics fall directly out of the operation. If x was inserted, the bits at h₁(x)…hₖ(x) were definitely set, so contains(x) returns true — no false negative is possible. Conversely, if contains(x) returns true, it could be because x was inserted, or because k <em>different</em> elements collectively set those bits — that&apos;s the false positive.
        </p>
        <p className="mb-4">
          The false-positive rate after inserting n elements into an m-bit array with k hashes is approximately p ≈ (1 − e^(−kn/m))^k. Three knobs trade off space, accuracy, and CPU: m (bits), k (hashes per operation), and n (load). The optimum k for a given m and n is k* = (m/n) ln 2; common production tuning fixes p (e.g., 1%) and derives m and k from it.
        </p>
        <p>
          The structure does not support deletion in its standard form — clearing a bit might break some other element&apos;s membership claim (multiple elements can hash to the same bit). The <em>counting Bloom filter</em> replaces each bit with a small counter that is incremented on insert and decremented on delete, recovering deletion at the cost of 4–8× more space.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/bloom-filters-diagram-1.svg"
          alt="Bloom filter inserting the string apple by hashing it through three independent hash functions and setting bits at positions 2 7 and 11 of a 16 bit array"
          caption="Figure 1: Insert hashes the element with k functions and sets those k bits. Contains checks the same bits; any zero proves absence, all ones suggests probable presence."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture & Flow</h2>
        <p className="mb-4">
          Production implementations rarely use k actually-independent hash functions; instead they use a technique from Kirsch &amp; Mitzenmacher (2006): compute two strong hashes h_a and h_b, then derive the k indices as h_a + i · h_b mod m for i = 0…k−1. This delivers the same false-positive rate as k independent functions but at the cost of two hashes per operation. MurmurHash3, xxHash, and SipHash are common choices for h_a and h_b.
        </p>
        <p className="mb-4">
          Sizing for a target false-positive rate p with n expected elements: m = −n · ln(p) / (ln 2)² and k = (m/n) · ln 2. For 1M elements at p = 0.01: m ≈ 9.6M bits (~1.2MB) and k = 7. For p = 0.001: m ≈ 14.4M bits and k = 10. A hash set storing 1M 32-byte strings would consume 32MB+ — Bloom filter is 25× smaller for the equivalent membership query.
        </p>
        <p className="mb-4">
          Memory layout matters. A simple bit array indexed by hash mod m has poor cache behavior — k random hashes touch k different cache lines. The <em>blocked Bloom filter</em> partitions the bit array into 64-byte (cacheline-sized) blocks and confines all k bit-sets for a given key to a single block, reducing the operation to one cache miss instead of k. RocksDB uses this variant exclusively.
        </p>
        <p className="mb-4">
          The <strong>cuckoo filter</strong> (Fan et al. 2014) is a near-replacement: similar space, better false-positive rate at high load, and supports deletion. It uses cuckoo hashing over fingerprints rather than bit-setting. Cuckoo filters have largely supplanted Bloom filters in new systems, though Bloom remains the entrenched standard in legacy stacks.
        </p>
        <p>
          For unbounded inserts, a single fixed-size Bloom filter eventually saturates and the false-positive rate degrades to 100%. <strong>Scaled Bloom filters</strong> chain together a sequence of Bloom filters with geometrically growing size and tightening false-positive rates, allowing the structure to grow indefinitely while maintaining a target overall p.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/bloom-filters-diagram-2.svg"
          alt="False positive rate plotted against bits per element showing the canonical 10 bits per element 1 percent rate point and the diminishing returns beyond 14 bits"
          caption="Figure 2: 10 bits per element delivers ~1% false-positive rate with k=7 hashes — the standard production sizing. Beyond ~14 bits/element returns diminish."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs & Comparisons</h2>
        <p className="mb-4">
          <strong>Bloom filter vs hash set.</strong> Hash set is exact (no false positives); Bloom filter is probabilistic. Hash set memory grows linearly with element size (8 bytes minimum per entry, more for the keys themselves); Bloom filter memory depends only on n and p, not on key size. For small sets where memory is not constrained, use a hash set. For 1M+ elements where you can tolerate occasional false positives, Bloom filter is 10–50× smaller.
        </p>
        <p className="mb-4">
          <strong>Bloom filter vs cuckoo filter.</strong> Cuckoo filter offers similar space efficiency, better false-positive rate at high load (because it stores fingerprints rather than just bits), and native deletion support. Bloom filter is simpler, has a longer track record, and has more stable performance during inserts. New systems should default to cuckoo; legacy systems mostly stick with Bloom.
        </p>
        <p className="mb-4">
          <strong>Bloom filter vs Counting Bloom filter.</strong> Counting variant supports deletion at 4–8× space cost (each &quot;bit&quot; becomes a 4-bit or 8-bit counter to absorb collisions). Use only when deletion is required; the space penalty is significant.
        </p>
        <p className="mb-4">
          <strong>Bloom filter vs HyperLogLog.</strong> Different problems. Bloom filter answers &quot;is x in the set?&quot;; HLL answers &quot;how many distinct elements are in the set?&quot;. They&apos;re often confused because both are sketches over a stream — but they don&apos;t replace each other.
        </p>
        <p>
          <strong>When NOT to use a Bloom filter.</strong> When you need to enumerate the set (Bloom filters can&apos;t list members). When you need exact answers and false positives are unacceptable (security verdicts, financial deduplication). When element count is small enough that a hash set fits comfortably. When deletion is needed and you can&apos;t afford a counting variant.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Size for target false-positive rate.</strong> Pick p first (typically 0.01 or 0.001), then derive m and k from n. Don&apos;t pick m and k arbitrarily — you&apos;ll either over-allocate or hit unacceptable FPR.</li>
          <li><strong>Use double-hashing.</strong> Computing k independent hashes is wasteful. Two strong hashes plus the Kirsch-Mitzenmacher derivation gets equivalent FPR at half the work.</li>
          <li><strong>Pick non-cryptographic, fast hashes.</strong> MurmurHash3, xxHash, and CityHash are 10× faster than SHA-256 and just as good for Bloom filter purposes (no adversarial input concern in most cases).</li>
          <li><strong>Use blocked Bloom filters for hot paths.</strong> A single cache miss per operation instead of k matters when querying millions of times per second.</li>
          <li><strong>Always pair with the exact source.</strong> Bloom filter says &quot;probably yes&quot; — confirm with the actual lookup. The structure is a filter, not a verdict.</li>
          <li><strong>Monitor false-positive rate in production.</strong> If actual rate exceeds target, the filter is over-loaded — either resize or add a second-tier scaled Bloom filter.</li>
          <li><strong>Snapshot the filter alongside the data.</strong> If the underlying set is replicated or persisted, persist the Bloom filter alongside it; rebuilding from scratch on startup is expensive at scale.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Treating &quot;maybe&quot; as &quot;yes&quot;.</strong> Acting on a Bloom positive without confirming with the exact source produces incorrect behavior on every false positive. Always treat positive as &quot;needs verification&quot;.</li>
          <li><strong>Deleting elements from a standard Bloom.</strong> Clearing the k bits for a deletion may clear bits that other elements depend on — silently introducing false negatives. Use a counting Bloom filter if deletion is required.</li>
          <li><strong>Underestimating n.</strong> If you size for n = 1M but actually insert 10M, the false-positive rate explodes from 1% to ~50%. Either over-provision or use a scaled Bloom filter that grows.</li>
          <li><strong>Using cryptographic hashes for performance-critical paths.</strong> SHA-256 is wasteful. The hash family doesn&apos;t need cryptographic strength — only good distribution.</li>
          <li><strong>Using fewer than the optimum k.</strong> Too few hashes → many bits unset → fewer false positives but lower load capacity. Too many hashes → bit array saturates → false positives spike. Stick to k* = (m/n) ln 2.</li>
          <li><strong>Sharing one filter across threads without coordination.</strong> Concurrent inserts must use atomic bit operations or per-thread filters merged periodically. Plain bitwise OR isn&apos;t thread-safe in JavaScript across workers without SharedArrayBuffer + Atomics.</li>
          <li><strong>Forgetting to seed the hash functions differently.</strong> If h_a and h_b are the same hash with the same seed, the &quot;k different bits&quot; degenerates into k copies of the same bit. Seed differently or use the standard double-hashing template.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>LSM-tree storage engines.</strong> RocksDB, LevelDB, Cassandra, HBase, and ScyllaDB attach a Bloom filter to every SSTable. On a point read for key k, the engine checks each level&apos;s SSTables; the Bloom filter quickly excludes SSTables that don&apos;t contain k, reducing disk seeks dramatically. For workloads with many missing keys (Cassandra rows that don&apos;t exist), Bloom filters can reduce read latency by 10× or more.
        </p>
        <p className="mb-4">
          <strong>CDN cache deduplication.</strong> Akamai, Cloudflare, and similar CDNs use Bloom filters to track which URLs have been seen recently across edge nodes, deduping requests to origin. The &quot;probably seen&quot; verdict suppresses redundant origin fetches; the rare false positive falls back to a confirmed lookup.
        </p>
        <p className="mb-4">
          <strong>Browser malware screening.</strong> Google Safe Browsing distributes a compact Bloom-filter-like structure (actually a more sophisticated variant) of malicious URLs to Chrome and Firefox. Most navigations get a clean &quot;not in set&quot; verdict instantly; the rare positive falls through to a Google API lookup for confirmation.
        </p>
        <p className="mb-4">
          <strong>Bitcoin wallet SPV nodes.</strong> Simplified Payment Verification clients use Bloom filters (BIP-37) to subscribe to transactions affecting their addresses without downloading the full blockchain. The trade-off — privacy via plausible deniability through false positives — has known weaknesses, but the structural pattern is canonical.
        </p>
        <p>
          <strong>Database query optimization.</strong> Postgres uses Bloom filter indexes (the <code>bloom</code> extension) for multi-column equality queries where any column may be queried. Spark&apos;s BloomFilter aggregator is used to push down filters into shuffles, eliminating data that won&apos;t survive a downstream join. ClickHouse uses Bloom filters as secondary indexes to skip data parts.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/bloom-filters-diagram-3.svg"
          alt="LSM tree read path showing a query consulting four SSTable bloom filters and only seeking disk on the one filter that returns maybe"
          caption="Figure 3: A point read in an LSM tree consults Bloom filters for each SSTable. Only the level whose filter returns &quot;maybe&quot; triggers a disk seek — the other reads stay in RAM."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why doesn&apos;t a standard Bloom filter support deletion?</p>
            <p className="mt-2 text-sm">A: Bits are shared across elements — multiple elements can hash to the same bit. Clearing a bit on delete might break some other element&apos;s membership claim, introducing false negatives (the structure&apos;s one guarantee). The counting Bloom filter replaces each bit with a small counter (4-8 bits) that&apos;s incremented on insert and decremented on delete, supporting deletion at higher space cost.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you size a Bloom filter for 10M elements at 0.1% false-positive rate?</p>
            <p className="mt-2 text-sm">A: m = −n · ln(p) / (ln 2)² = −10⁷ · ln(0.001) / 0.48 ≈ 144M bits ≈ 18MB. k = (m/n) · ln 2 ≈ 10. Compare: a hash set of 10M 32-byte keys = 320MB+ — Bloom filter is ~18× smaller for the same membership query.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When does a Bloom filter beat a hash set?</p>
            <p className="mt-2 text-sm">A: When (a) memory is the dominant constraint, (b) false positives are tolerable (you&apos;ll confirm with an exact source on positives), and (c) you don&apos;t need to enumerate the set or delete elements. The classic case: skipping expensive lookups (disk reads, network calls, cryptographic checks) for keys that almost certainly aren&apos;t there.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the optimum number of hash functions?</p>
            <p className="mt-2 text-sm">A: k* = (m/n) · ln 2, where m is bit array size and n is expected element count. Equivalently, k* ≈ 0.693 × bits-per-element. For the canonical 10 bits/element sizing, that&apos;s k = 7. Too few hashes underutilizes the bit array; too many over-saturates it. Both directions hurt the false-positive rate.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do production systems compute k hashes efficiently?</p>
            <p className="mt-2 text-sm">A: Kirsch-Mitzenmacher double hashing — compute two strong hashes h_a and h_b once, then derive k indices as h_a + i · h_b mod m for i = 0…k−1. This achieves the same false-positive rate as k truly independent hashes at the cost of just two hash computations per operation. MurmurHash3 or xxHash are typical choices.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s a cuckoo filter and when would you use one instead?</p>
            <p className="mt-2 text-sm">A: A cuckoo filter (Fan et al. 2014) stores fingerprints in a cuckoo hash table instead of setting bits. It offers similar space efficiency, better false-positive rate at high load, and native deletion support. New systems should default to cuckoo filters; Bloom filters remain because of legacy entrenchment and slightly more stable insert performance.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References & Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Bloom — &quot;Space/Time Trade-offs in Hash Coding with Allowable Errors&quot; (CACM 1970), the original paper</li>
          <li>Kirsch, Mitzenmacher — &quot;Less Hashing, Same Performance: Building a Better Bloom Filter&quot; (2006)</li>
          <li>Fan, Andersen, Kaminsky, Mitzenmacher — &quot;Cuckoo Filter: Practically Better Than Bloom&quot; (CoNEXT 2014)</li>
          <li>Putze, Sanders, Singler — &quot;Cache-, Hash- and Space-Efficient Bloom Filters&quot; (2007), the blocked variant</li>
          <li>Almeida et al. — &quot;Scalable Bloom Filters&quot; (2007), the variant for unbounded streams</li>
          <li>Mitzenmacher, Upfal — <em>Probability and Computing</em>, Chapter 5 (Probabilistic Data Structures)</li>
          <li>RocksDB documentation — Bloom Filter implementation notes (production reference)</li>
          <li>Broder, Mitzenmacher — &quot;Network Applications of Bloom Filters: A Survey&quot; (2002)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
