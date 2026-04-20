"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "hash-tables",
  title: "Hash Tables",
  description:
    "Staff-level deep dive into hash tables — hash function design, chaining versus open addressing, load factor and resizing, Robin Hood hashing, V8 internals, and concurrent hash map strategies.",
  category: "other",
  subcategory: "data-structures",
  slug: "hash-tables",
  wordCount: 4600,
  readingTime: 19,
  lastUpdated: "2026-04-17",
  tags: [
    "hash-tables",
    "hashing",
    "chaining",
    "open-addressing",
    "data-structures",
    "concurrency",
  ],
  relatedTopics: [
    "arrays",
    "singly-linked-lists",
    "bloom-filters",
    "trees",
  ],
};

export default function HashTablesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* SECTION 1 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition &amp; Context</h2>
        <p>
          A <strong>hash table</strong> is an associative container that
          maps keys to values using a hash function to compute an index into
          an underlying array of buckets. The contract it offers is stunning:
          expected O(1) lookup, insert, and delete, independent of the number
          of keys, provided the hash function is well-distributed and the load
          factor stays bounded. That single guarantee — amortized
          constant-time keyed access — is the reason hash tables underpin
          nearly every caching layer, index, and symbol table in modern
          software.
        </p>
        <p>
          The abstraction traces back to 1953 (Hans Peter Luhn&apos;s IBM
          memo) and has weathered more than seventy years of refinement.
          Every mainstream language ships a built-in hash map:
          JavaScript&apos;s <code>Map</code> and object properties, Python&apos;s{" "}
          <code>dict</code>, Java&apos;s <code>HashMap</code>, Go&apos;s
          <code> map</code>, Rust&apos;s <code>HashMap</code>, C++{" "}
          <code>std::unordered_map</code>. Each differs in design choices —
          chaining vs open addressing, probing strategy, growth factor,
          hash function — but they all expose the same associative contract.
        </p>
        <p>
          Underneath every hash table are three interrelated design
          decisions: the hash function, the collision-resolution strategy,
          and the load factor / resize policy. A hash function distributes
          keys pseudo-randomly into buckets; collision resolution defines
          what happens when two keys land in the same bucket; load factor
          governs when the table resizes to keep operations expected-O(1).
          Poor choices in any of the three produce catastrophic
          worst-case behavior — the hash-flooding attacks that took down
          production web frameworks in 2003, 2011, and recurring since
          are direct consequences of weak hash functions on adversarial
          input.
        </p>
        <p>
          Staff-level engineering on hash tables means knowing which
          implementation your runtime uses, when it degrades, and when to
          reach for an alternative. A sorted array plus binary search may
          beat a hash map for small, stable key sets. A trie may beat it
          for prefix-based queries. A B-tree may beat it when iteration in
          key order matters. Understanding the boundaries of the hash
          table&apos;s dominance is as important as understanding its
          internals.
        </p>
      </section>

      {/* SECTION 2 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Hash functions</h3>
        <p>
          A good hash function distributes arbitrary keys uniformly across
          the bucket array. Three properties matter. <strong>Speed</strong>:
          computing the hash must be O(k) in key size with tight constants.{" "}
          <strong>Uniformity</strong>: distinct keys should land in
          different buckets with probability approximately 1/cap.{" "}
          <strong>Resistance to collisions</strong>: no cheap way for an
          adversary to produce many keys that land in the same bucket.
          Production-grade hashes include FNV-1a, MurmurHash3, xxHash, and
          the SipHash family (Python, Ruby, Node use SipHash as the default
          specifically because it has cryptographic collision resistance
          under key-seeded randomization).
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Chaining collision resolution
        </h3>
        <p>
          Each bucket holds a linked list (or small array) of entries that
          hashed to it. Lookup: compute the hash, walk the bucket&apos;s
          chain comparing keys. Insert: prepend (or append) to the chain.
          Delete: unlink. Average chain length is the load factor, so
          operations run in expected O(1 + α) time. Chaining is resilient to
          high load factors but pays for it with per-entry pointer
          overhead and cache-unfriendly traversal. Java&apos;s
          <code> HashMap</code> uses chaining and escalates from linked
          list to balanced tree once a bucket&apos;s chain exceeds 8 entries
          — a defense against both natural skew and hash-flooding attacks.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Open addressing
        </h3>
        <p>
          All entries live directly inside the bucket array. On collision,
          the insert procedure probes further slots according to a
          deterministic sequence until an empty slot is found. Lookup
          follows the same probe sequence. Three common probing strategies:{" "}
          <strong>linear</strong> (next slot — causes clustering),{" "}
          <strong>quadratic</strong> (slot + i² — reduces clustering),
          <strong>double hashing</strong> (slot + i × h₂(key) — best
          distribution). Open addressing is cache-friendly because
          all data is contiguous, but it cannot support high load factors
          — typical production open-addressed tables keep load ≤ 0.75 and
          resize aggressively. Rust&apos;s <code>HashMap</code>,
          Python&apos;s <code>dict</code>, and Google&apos;s SwissTable
          are all open-addressed.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/hash-tables-diagram-1.svg"
          alt="Hash function mapping keys to bucket indices showing the dispersion of strings into a fixed-size bucket array"
          caption="Figure 1: Hash function mapping — keys are hashed to bucket indices modulo capacity; good hashes distribute uniformly."
        />
      </section>

      {/* SECTION 3 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Load factor and resizing
        </h3>
        <p>
          Load factor α = n/cap measures how full the table is. Expected
          operation cost grows with α: chaining gives 1 + α/2 expected
          comparisons per lookup, open addressing gives 1/(1 − α). Most
          implementations keep α below 0.75 (open addressing) or 0.9
          (chaining), resizing the backing array by 2× and rehashing every
          entry when the threshold is crossed. Resizing is an O(n)
          operation, amortized to O(1) per insert over the sequence of
          insertions — the same geometric-growth analysis that applies to
          dynamic arrays.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Robin Hood hashing
        </h3>
        <p>
          An elegant open-addressing variant. Each slot tracks how far its
          current occupant has probed from its ideal position. On insert,
          if the new key has probed further than the occupant, they swap —
          the &quot;richer&quot; (less-probed) entry gets displaced. The
          effect is to equalize probe distances across all entries,
          producing a much tighter variance than plain linear probing.
          Lookup can also early-exit: if you reach a slot whose occupant
          has probed less far than you would have, you know your key
          isn&apos;t in the table. Rust&apos;s <code>HashMap</code> used
          Robin Hood hashing before moving to SwissTable; many modern
          implementations retain it.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Cuckoo hashing
        </h3>
        <p>
          Cuckoo hashing (Pagh &amp; Rodler 2001) gives worst-case O(1)
          lookup by giving each key two (or more) candidate slots under
          independent hash functions. A key resides in one of its candidate
          slots; on insert, if both are occupied, the new key evicts an
          occupant, which is then rehashed to its alternate slot, possibly
          cascading. Lookup examines only the small fixed set of candidate
          slots — constant time in the worst case, not just expected. The
          cost is lower maximum load factor (~50% for two hashes, higher
          for d &gt; 2 variants or with a small bucket size) and the risk
          of insertion failure (cycles) that forces a rehash. It&apos;s
          mostly used where predictable lookup latency matters more than
          density — hardware switch tables, some database engines — and as
          the conceptual basis for cuckoo filters.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          SwissTable and SIMD probing
        </h3>
        <p>
          Google&apos;s SwissTable (the design behind abseil&apos;s{" "}
          <code>flat_hash_map</code> and Rust&apos;s current
          <code> HashMap</code>) groups slots into 16-entry blocks and
          stores one-byte metadata per slot. Probing scans an entire block
          with a single SIMD instruction (<code>pcmpeqb</code> on x86,
          NEON equivalents on ARM), dramatically reducing per-lookup
          instructions. Benchmarks show 2–3× speedups over Robin Hood on
          modern CPUs. This is the current state of the art in
          general-purpose hash table design.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/hash-tables-diagram-2.svg"
          alt="Chaining versus open addressing collision resolution showing how collisions are stored in the two strategies"
          caption="Figure 2: Chaining vs open addressing — chaining stores collisions in per-bucket lists; open addressing probes forward within the same array."
        />
      </section>

      {/* SECTION 4 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          Trade-offs &amp; Comparisons
        </h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Operation complexity
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Lookup / insert / delete</strong>: expected O(1) average
            case; worst case O(n) with adversarial keys or bad hash.
          </li>
          <li>
            <strong>Iteration</strong>: O(n + cap) — must traverse every
            bucket even if only partially full.
          </li>
          <li>
            <strong>Rehash on resize</strong>: O(n) amortized to O(1)
            per insert.
          </li>
          <li>
            <strong>Ordered iteration</strong>: not supported natively —
            order is hash-function-dependent and changes across resizes.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Chaining vs open addressing
        </h3>
        <p>
          Chaining tolerates higher load factors, handles adversarial
          collisions gracefully (bucket chains just grow longer), and is
          simpler to implement. Open addressing wins on memory density
          (no per-entry pointers or allocator headers) and cache behavior
          (sequential probing stays in one cache line for small probe
          distances), at the cost of needing to keep load factor low and
          being more sensitive to hash-function quality. Rust, Go, and
          Python chose open addressing for these reasons; Java and
          older C++ chose chaining for robustness.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Hash table vs balanced tree
        </h3>
        <p>
          Hash maps give expected O(1); trees give worst-case O(log n). For
          random and well-distributed keys, hash tables are faster on
          average and in the amortized sense. For ordered iteration,
          range queries, or adversarial worst-case resistance without
          hash randomization, trees win. Java ships both <code>HashMap</code>
          {" "}and <code>TreeMap</code>; C++ ships <code>unordered_map</code>
          {" "}and <code>map</code>; the choice is workload-driven.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Concurrent hash maps
        </h3>
        <p>
          Java&apos;s <code>ConcurrentHashMap</code> shards the table into
          lock-striped segments. Go&apos;s <code>sync.Map</code> uses a
          read-only snapshot plus a dirty map with per-entry atomics.
          Facebook&apos;s F14 map supports lock-free reads with seqlock-
          style coordination. Every production concurrent hash map trades
          some axis of the design — write throughput, memory overhead,
          read latency, memory ordering guarantees — to avoid a global
          lock. The choice depends on read-write ratio, contention
          pattern, and cross-core synchronization cost.
        </p>
      </section>

      {/* SECTION 5 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Pre-size when the key count is known.</strong> Pass a
            capacity hint (<code>new HashMap(cap)</code>,{" "}
            <code>HashMap::with_capacity(cap)</code>) to skip intermediate
            resizes. The difference can be 2–5× on large bulk loads.
          </li>
          <li>
            <strong>Use immutable, well-hashed keys.</strong> Strings,
            integers, and frozen tuples work well. Mutating a key after
            insertion silently loses the entry because the hash-to-bucket
            mapping stops matching the stored location.
          </li>
          <li>
            <strong>Trust the runtime&apos;s randomization.</strong> Modern
            hashes seed per-process to prevent hash-flooding. Don&apos;t
            disable it or roll your own hash unless you have specific
            numeric requirements.
          </li>
          <li>
            <strong>Prefer typed keys.</strong> In JavaScript, the
            <code> Map</code> class preserves key identity and supports
            arbitrary keys. Plain-object property access coerces keys to
            strings, which collides on numeric vs string keys and loses
            non-serializable references.
          </li>
          <li>
            <strong>Match the hash table variant to the workload.</strong>
            {" "}Open-addressed hash maps beat chained ones for small-value,
            high-throughput workloads. For string-value maps with larger
            payloads, chained can be more memory-efficient.
          </li>
          <li>
            <strong>Benchmark with realistic distributions.</strong> Hash
            table performance depends on key distribution. Testing with
            uniform random keys can miss the clustering that real workloads
            produce.
          </li>
          <li>
            <strong>Use concurrent maps only when needed.</strong> A
            single-threaded hash map is 3–10× faster than any concurrent
            variant. Shard the workload or use per-worker maps when
            possible.
          </li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Mutable keys.</strong> If a key&apos;s hash changes
            after insertion (by mutating the object), subsequent lookups
            return nothing even though the entry is technically still in
            the table. Use immutable types or freeze before insertion.
          </li>
          <li>
            <strong>Hash-flooding attacks.</strong> Before hash
            randomization was standard, POST bodies with many
            same-hash keys could make parsing quadratic and take down web
            servers. Modern languages default to randomized per-process
            hashes, but older systems or custom hashes can still be
            vulnerable.
          </li>
          <li>
            <strong>Assuming iteration order.</strong> Hash map iteration
            order is implementation-defined and changes across versions,
            load factors, and process runs. Use <code>LinkedHashMap</code>,
            {" "}<code>OrderedDict</code>, or sort-on-iteration if stable
            order matters.
          </li>
          <li>
            <strong>Equals/hashCode mismatch.</strong> In Java, two keys
            that are <code>.equals()</code> must have the same{" "}
            <code>.hashCode()</code>. Violating this contract causes silent
            lookup failures. Frameworks like Lombok auto-generate both
            together for this reason.
          </li>
          <li>
            <strong>Excessive resize churn.</strong> Inserting and
            removing around the threshold boundary can trigger repeated
            resizes. Add hysteresis (resize down only at lower load factor
            than up) or simply accept the occasional rehash cost.
          </li>
          <li>
            <strong>Large values holding references in bucket chains.</strong>{" "}
            Bulk-removing entries from a chained map leaves the bucket
            array sized but most buckets empty — memory still retained.
            Call <code>shrink_to_fit</code> or recreate the map if the
            working set has shrunk.
          </li>
          <li>
            <strong>Concurrent read/write without synchronization.</strong>{" "}
            A plain hash map concurrently iterated and modified can enter
            an infinite loop on resize (historical Java bug in{" "}
            <code>HashMap</code>). Use concurrent variants or external
            locking.
          </li>
        </ul>
      </section>

      {/* SECTION 7 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          V8 object shapes and property access
        </h3>
        <p>
          V8 uses hash tables for three distinct purposes. (1) The
          <em> string table</em> interns every JavaScript string used as a
          property key so equality is a pointer compare. (2)
          <em> Hidden classes</em> (maps in V8 terminology) use a hash map
          to remember which hidden class results from adding each property
          — this is what makes repeated object shapes cheap. (3)
          <em> Dictionary mode objects</em> (once an object has too many
          properties or becomes too dynamic) store properties directly in
          a hash table rather than using hidden classes. The performance
          cliff between hidden-class mode and dictionary mode is why
          type-stable object construction matters in hot code.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Redis hash and dictionaries
        </h3>
        <p>
          Redis is, at its core, a distributed hash table server. The
          top-level keyspace is a hash table; hash-typed values (<code>
          HSET</code>/<code>HGET</code>) are per-key hash tables. The
          implementation (in <code>dict.c</code>) uses incremental
          rehashing: during a resize, both old and new tables coexist,
          and each operation migrates one bucket. This amortizes the O(n)
          rehash over subsequent operations, keeping every single request
          bounded in latency — essential for a sub-millisecond-SLA system.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Database indexes
        </h3>
        <p>
          Most database systems offer hash indexes for equality-only
          workloads: PostgreSQL&apos;s <code>HASH</code> index, MySQL&apos;s
          <code> MEMORY</code> engine, Redis (again), DynamoDB partitions.
          They beat B-tree indexes for pure equality lookup but can&apos;t
          support range queries. In distributed databases, hashing the
          key to a node (consistent hashing) is the foundation of
          partitioning — Cassandra, DynamoDB, and Kafka all use it.
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Compiler symbol tables
        </h3>
        <p>
          Every compiler&apos;s symbol table — V8 parser, TypeScript
          compiler, LLVM, Rust rustc — is a hash table mapping names to
          AST nodes, types, or IR values. Lexical scopes stack these
          hash tables; name resolution walks the stack looking up each
          name. The choice of hash function in compilers is often tuned
          for the distribution of source-code identifiers, not general
          uniformity.
        </p>

        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/hash-tables-diagram-3.svg"
          alt="Hash table resize and rehash lifecycle showing the doubling of backing array and redistribution of entries"
          caption="Figure 3: Resize and rehash — crossing the load factor threshold doubles the bucket array and redistributes entries with the new modulus."
        />
      </section>

      {/* SECTION 8 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does a hash table achieve amortized O(1) insert despite
              resizing?
            </p>
            <p className="mt-2 text-sm">
              A: Geometric growth. Each time load factor crosses the
              threshold, the backing array doubles and every entry is
              rehashed — an O(n) cost. But doubling means the next rehash
              happens only after another n inserts, so across n inserts
              the total rehash work is O(n), giving O(1) amortized per
              insert. The same amortized analysis that justifies dynamic
              array append applies here. Worst-case single insert is still
              O(n) during the rehash; for latency-critical systems,
              incremental rehashing (Redis) spreads the work over many
              subsequent operations.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is a hash-flooding attack and how do modern runtimes
              defend?
            </p>
            <p className="mt-2 text-sm">
              A: An attacker crafts many keys that hash to the same bucket,
              turning every lookup and insert into an O(n) chain walk. In
              web servers, this converts a parsing operation into a
              quadratic DoS. Modern defenses: (1) per-process randomized
              hash seeds so collisions vary across deployments, (2) SipHash
              as the default string hash (cryptographically hard to
              produce collisions without the seed), (3) tree-fallback for
              long chains (Java 8+ escalates long chains to balanced
              trees). Together they convert the worst case from O(n) per
              operation to O(log n).
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When would you choose open addressing over chaining?
            </p>
            <p className="mt-2 text-sm">
              A: When cache locality matters, values are small, load factor
              can be kept below 0.75, and the hash function is known to be
              strong. Open addressing wins on memory density (no per-entry
              pointers or heap nodes) and cache behavior (sequential
              probing). Chaining wins when entries are large enough that
              bucket pointers are a rounding error, when load factor may
              exceed 0.9, or when adversarial keys are possible. Rust,
              Go, Python chose open addressing; Java chose chaining with
              tree fallback.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Describe Robin Hood hashing.
            </p>
            <p className="mt-2 text-sm">
              A: An open-addressing insertion rule: each slot tracks the
              probe distance from its ideal slot. On insert, if the
              candidate slot holds an entry with a smaller probe distance
              than the new entry would have, swap them and continue
              inserting the displaced entry. The net effect is that probe
              distances across all entries are approximately equal rather
              than long-tailed. Lookup can early-exit when it encounters a
              slot whose occupant has probed less far than it would have.
              Variance of probe distance is vastly lower than plain linear
              probing, yielding more predictable latency.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does a concurrent hash map avoid a single bottleneck?
            </p>
            <p className="mt-2 text-sm">
              A: Typical strategies: (1) lock striping — divide the table
              into N segments, each with its own lock; only operations on
              the same segment contend. Java&apos;s{" "}
              <code>ConcurrentHashMap</code> pre-Java-8 used this with 16
              segments. (2) Per-bucket or per-entry CAS — Java 8&apos;s
              <code>ConcurrentHashMap</code> uses a CAS on the bucket
              head pointer for lock-free inserts, falling back to fine-
              grained locking for tree-bin operations. (3) Read-write
              split — Go&apos;s <code>sync.Map</code> serves reads from an
              atomic snapshot and writes to a dirty map with a lock.
            </p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: Why does iterating a hash map not return keys in
              insertion order?
            </p>
            <p className="mt-2 text-sm">
              A: Iteration walks the bucket array in index order and
              follows each bucket&apos;s chain. The bucket index is hash(key)
              mod capacity, which is essentially random. Across resizes the
              modulus changes, so the &quot;order&quot; even changes for
              the same key set. Languages that want insertion order
              (JavaScript <code>Map</code>, Python 3.7+ <code>dict</code>,
              Java <code>LinkedHashMap</code>) maintain an auxiliary
              ordered linked list overlaid on the hash table. Python&apos;s
              compact-dict layout merges the two structures to reduce
              memory overhead.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9 */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">
          References &amp; Further Reading
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Knuth, D.E. — <em>The Art of Computer Programming, Volume 3:
            Sorting and Searching</em>, Section 6.4 on hashing theory and
            probing strategies.
          </li>
          <li>
            Cormen, Leiserson, Rivest, Stein — <em>Introduction to
            Algorithms</em>, 4th Edition, Chapter 11 on hash tables, with
            universal hashing and perfect hashing.
          </li>
          <li>
            Pagh, R., Rodler, F. — <em>Cuckoo Hashing</em>, Journal of
            Algorithms, 2004: an open-addressing variant with worst-case
            O(1) lookup.
          </li>
          <li>
            Celis, P. — <em>Robin Hood Hashing</em>, PhD thesis,
            University of Waterloo, 1986: the original analysis of
            probe-distance equalization.
          </li>
          <li>
            Google abseil — <em>Swiss Tables and absl::flat_hash_map
            Design Notes</em>: the SIMD-accelerated open-addressing design
            underpinning modern hash maps.
          </li>
          <li>
            Aumasson, J.-P., Bernstein, D.J. — <em>SipHash: a fast
            short-input PRF</em>, 2012: the cryptographic hash that
            defended Python, Ruby, and Node against hash-flooding
            attacks.
          </li>
          <li>
            V8 Blog — <em>Fast Properties in V8</em> and <em>Hash Tables
            in V8</em>: the engine&apos;s treatment of object shapes,
            dictionary mode, and interned strings.
          </li>
          <li>
            Redis source — <code>src/dict.c</code>: reference
            implementation of incremental rehashing with clear comments
            on the single-process amortization strategy.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
