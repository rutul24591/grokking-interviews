"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "tries",
  title: "Tries",
  description: "Prefix trees that exploit shared key prefixes for O(L) lookup independent of n — the structure behind autocomplete, IP routing, and modern key-value indexes.",
  category: "other",
  subcategory: "data-structures",
  slug: "tries",
  wordCount: 4500,
  readingTime: 18,
  lastUpdated: "2026-04-18",
  tags: ["tries", "prefix-tree", "radix-tree", "patricia", "autocomplete", "data-structures"],
  relatedTopics: ["hash-tables", "trees", "strings"],
};

export default function TriesArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Definition & Context</h2>
        <p className="mb-4">
          A trie (pronounced &quot;try&quot;, from re<em>trie</em>val) is a tree-shaped associative array keyed by sequences. Each edge is labeled with a single symbol from the key alphabet, and each path from the root to a marked node spells a stored key. The defining property: <strong>two keys sharing a prefix share the path that spells that prefix</strong>. Lookups, inserts, and deletes all run in O(L) where L is the key length — independent of n, the number of stored keys.
        </p>
        <p className="mb-4">
          Edward Fredkin introduced the structure in 1960 specifically for retrieval over alphabetic keys; Donald Morrison&apos;s 1968 PATRICIA trie added the radix-compression variant that powers most modern systems. The data structure sat in academic obscurity for decades because hash tables generally outperformed it for arbitrary keys — but its prefix semantics turn out to be exactly what autocomplete, IP routing, and string-indexed databases need.
        </p>
        <p>
          Today tries (in their compressed radix-tree form) are the substrate for Linux kernel IP routing, Redis stream IDs, etcd&apos;s key store, React Router&apos;s path matcher, npm&apos;s package registry indexing, and the LSM-tree key indexes inside RocksDB. The trie isn&apos;t taught as much as the hash table, but in any system where keys are strings and prefix queries matter, it&apos;s the right answer.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Core Concepts</h2>
        <p className="mb-4">
          The standard trie represents each node as a map from symbol to child node, plus a boolean (or value) indicating whether the path from root to here spells a complete stored key. The end-of-word marker is essential — without it, you cannot distinguish a stored key from a prefix of some longer key. Storing &quot;car&quot; and &quot;cart&quot; produces a path c-a-r-t where both the &quot;r&quot; node and the &quot;t&quot; node carry the marker.
        </p>
        <p className="mb-4">
          The child map can be a fixed-size array (one slot per alphabet symbol — fast but wasteful: 256 slots per node for byte alphabet), a hash map (flexible alphabet, more overhead per node), or a sorted array of (symbol, child) pairs with binary search (compact, decent locality). The choice dominates memory: a 1M-key dictionary stored as a fixed-array trie can easily consume a gigabyte; the same data in a sorted-array radix trie fits in tens of megabytes.
        </p>
        <p className="mb-4">
          The fundamental complexity statement is <strong>O(L) per operation, independent of n</strong>. Compare this to a balanced BST (O(L log n) — comparing strings of length L at each of log n levels) or hash table (O(L) for hashing, but with constant-factor overhead and no prefix support). For very large n, the trie is asymptotically faster; for prefix queries, it&apos;s qualitatively different.
        </p>
        <p>
          The space cost is the dual: in the worst case, a trie has O(n × L) nodes, one per character of every stored key. The win comes from prefix sharing — when many keys share long prefixes (URLs, dictionary words, IP addresses), a substantial fraction of those nodes are shared. The radix tree (covered in the next section) compresses unbranching chains to recover most of this space without sacrificing semantics.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/tries-diagram-1.svg"
          alt="Trie storing the four words car, cat, cab, and dog with shared prefix nodes for c-a and end-of-word markers on terminal characters"
          caption="Figure 1: The shared prefix &quot;ca&quot; collapses into a single path. End-of-word markers (★) distinguish stored keys from prefixes of longer keys."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Architecture & Flow</h2>
        <p className="mb-4">
          <strong>Insert(key):</strong> walk from the root, character by character. For each character, check whether the current node has a child for that character; if yes, descend; if no, allocate a new node and descend into it. After consuming the last character, mark the final node as end-of-word (and optionally store an associated value). Total work: O(L), with at most L allocations.
        </p>
        <p className="mb-4">
          <strong>Search(key):</strong> walk the same path. At each step, if the expected child is missing, return false. If you reach the end of the key and the current node is marked end-of-word, return true; if not marked, the key is a prefix of stored keys but not itself stored. <strong>Prefix search</strong> (does any stored key start with P?) is the same walk without the end-of-word check at termination — return true if the walk succeeds at all.
        </p>
        <p className="mb-4">
          <strong>Delete(key):</strong> walk to the end-of-word node, unmark it, then walk back up removing nodes that have no other children and aren&apos;t themselves end-of-word for some other key. This bottom-up cleanup is what keeps the trie from accumulating dead paths after many deletions.
        </p>
        <p className="mb-4">
          The radix tree (also called Patricia trie) collapses any unbranching chain of single-child nodes into a single edge labeled with the concatenated string. So the path c-a-r-t becomes a single edge labeled &quot;cart&quot;. Insertion may need to <em>split</em> an edge: inserting &quot;card&quot; into a tree containing only &quot;cart&quot; finds the existing &quot;cart&quot; edge, splits it at the divergence point into &quot;car&quot; → &quot;t&quot; / &quot;d&quot;, and creates the new branch. This is more code than the standard trie but reduces node count by 5–20× on real datasets.
        </p>
        <p>
          A further variant, the <strong>HAT-trie</strong> (Hash Array Mapped Trie), uses a small hash table per node instead of a full alphabet array — combining the cache-friendliness of hashing with trie semantics. It&apos;s the structure behind Clojure&apos;s persistent maps and many functional language implementations.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/tries-diagram-2.svg"
          alt="Trie insert and search both walking character by character, insert allocating missing children and search returning false at first missing edge"
          caption="Figure 2: Insert and search follow the same path. Insert allocates missing children and marks end-of-word; search fails on the first missing edge. Both are O(L) in key length."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Trade-offs & Comparisons</h2>
        <p className="mb-4">
          <strong>Trie vs hash table.</strong> Hash tables are O(L) per lookup (hashing dominates) with a small constant factor and excellent cache behavior, but offer zero prefix support — to find all keys starting with &quot;app&quot;, you must scan all n keys. Tries are also O(L) but support prefix and range queries naturally. For arbitrary lookup-only workloads, hash tables win on raw speed; for prefix-heavy workloads (autocomplete, IP routing, URL routing), tries win qualitatively.
        </p>
        <p className="mb-4">
          <strong>Trie vs balanced BST.</strong> A balanced BST keyed by string is O(L log n) per lookup because every comparison touches up to L characters at each of log n levels. The trie&apos;s O(L) is asymptotically better as n grows. The BST&apos;s advantage is in-order traversal of all keys in lexicographic order — a trie can do this too via DFS, but the BST is more direct.
        </p>
        <p className="mb-4">
          <strong>Standard trie vs radix tree.</strong> The standard trie is conceptually simpler, slightly faster for individual lookups (no string comparison on edges), and easier to implement. The radix tree uses a fraction of the memory and has dramatically better cache behavior because each node corresponds to a real branching decision. For any production use case with non-trivial key counts, choose the radix tree.
        </p>
        <p className="mb-4">
          <strong>Radix tree vs B+ tree.</strong> Both support range queries on string keys. B+ trees are the standard for disk-resident indexes (uniform fanout, friendly to block I/O); radix trees are better for in-memory indexes (no balancing, O(L) lookup). Postgres&apos;s GIN indexes use a B-tree-on-trie hybrid for inverted indexes; LMDB uses radix trees as its primary on-disk structure.
        </p>
        <p>
          <strong>Suffix trie / suffix tree.</strong> A suffix tree stores all suffixes of a single string, enabling substring search in O(m) where m is the pattern length. Built in O(n) using Ukkonen&apos;s algorithm. Used by genome assemblers, plagiarism detectors, and bioinformatics tools. Different problem class from the prefix trie covered here.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Best Practices</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Choose the radix variant for production.</strong> Standard tries are good for teaching but waste 5–20× memory on real workloads. Radix trees deliver the same O(L) lookup with a fraction of the nodes.</li>
          <li><strong>Pick the child map carefully.</strong> Fixed-size array (256 slots) for byte keys with high branching; hash map for large alphabets like Unicode; sorted-array binary search for memory-constrained scenarios. The choice dominates total memory.</li>
          <li><strong>Always use the end-of-word marker.</strong> Without it, you cannot distinguish stored keys from prefixes. Bugs from this omission tend to surface under specific data shapes (one stored key being a prefix of another).</li>
          <li><strong>Pre-build for read-heavy workloads.</strong> If the trie is built once and queried millions of times (autocomplete dictionaries, route tables), build a fully-compacted radix tree at startup and treat it as immutable.</li>
          <li><strong>Use double-array tries for static dictionaries.</strong> A double-array trie packs the entire structure into two flat arrays — incredibly cache-friendly and used by IME engines, kanji dictionaries, and search-engine query parsers.</li>
          <li><strong>Lazy-load deep subtrees.</strong> For million-key tries that don&apos;t fit comfortably in memory, page subtrees from disk on demand. The trie&apos;s natural locality (lookups touch O(L) sequential nodes) makes this practical.</li>
          <li><strong>Profile before optimizing.</strong> A naively-implemented trie can use 100 bytes per node; the optimized radix variant can use 30. The difference matters at scale, but only after correctness.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Forgetting end-of-word marker.</strong> Inserting &quot;app&quot; then searching for &quot;app&quot; returns false (or true incorrectly) depending on which side of the bug you&apos;re on. Mark the terminal node explicitly.</li>
          <li><strong>Memory blow-up with large alphabets.</strong> A fixed-size 256-array per node times 1M nodes is 2GB just for child pointers. Use a hash or sorted array if branching factor is low in practice.</li>
          <li><strong>Not handling the empty key.</strong> If the empty string is a valid stored key, the root node itself must carry the end-of-word marker. Easy to miss.</li>
          <li><strong>Incorrect deletion.</strong> Just unmarking the end-of-word leaves dead chains. After unmarking, walk back up removing nodes that have no children and no end-of-word marker until you hit a branching node or another marker.</li>
          <li><strong>Edge-split bugs in radix trees.</strong> The trickiest part of the radix tree is splitting an existing edge when inserting a key that diverges mid-edge. Get the off-by-one wrong and you&apos;ll lose a character.</li>
          <li><strong>Case sensitivity for autocomplete.</strong> Users type &quot;App&quot; expecting to match &quot;apple&quot;. Either normalize on insert and on query, or store both cases. A trie indexed by raw case rarely matches user expectations.</li>
          <li><strong>Unicode normalization.</strong> &quot;café&quot; can be encoded as four code points (NFC) or five (NFD with combining accent). A trie compares code points, not glyphs — normalize keys to a canonical form before insert and query.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Autocomplete and search suggestions.</strong> Google, Algolia, Elasticsearch&apos;s completion suggester, and every IDE&apos;s symbol search are backed by tries (or trie-like FST structures). The user types each character; the trie walks one node deeper; the subtree under the current node enumerates all possible completions. Ranked autocomplete adds a frequency or score on each end-of-word marker and surfaces the top-k completions per prefix.
        </p>
        <p className="mb-4">
          <strong>IP routing tables.</strong> The Linux kernel uses an LC-trie (level-compressed trie) for IPv4 routing and a radix tree for IPv6. Longest-prefix match — the core operation in routing — is exactly what a trie does naturally. A binary trie over the 32 bits of an IPv4 address resolves a route in at most 32 hops, regardless of how many CIDR blocks are in the table.
        </p>
        <p className="mb-4">
          <strong>URL routing in web frameworks.</strong> React Router, Express, Fastify, and Go&apos;s httprouter all use radix trees to match URL paths. A request for <code>/users/42/posts</code> walks the routing tree, matching path segments and binding parameters. Radix trees handle millions of routes with O(L) match time.
        </p>
        <p className="mb-4">
          <strong>Spell check and predictive text.</strong> A trie of the dictionary supports both exact membership (is this a word?) and approximate match (find all words within edit distance 2 of this typo) by traversing the trie with a virtual edit-distance state. Hunspell, the spell checker behind LibreOffice and Firefox, uses a compact trie variant.
        </p>
        <p>
          <strong>Persistent immutable maps.</strong> Clojure&apos;s persistent hash maps and Scala&apos;s immutable collections use HAMTs (Hash Array Mapped Tries). Every &quot;mutation&quot; creates a new map sharing all unchanged subtrees with the old one — structural sharing that makes immutability practical at scale.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/data-structures/tries-diagram-3.svg"
          alt="Standard trie with many single-child chain nodes alongside the equivalent radix tree where chains are collapsed into single edges labeled with strings"
          caption="Figure 3: The radix tree (Patricia trie) collapses unbranching chains into single edges labeled with strings. Same lookup semantics, a fraction of the nodes."
        />
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use a trie over a hash table?</p>
            <p className="mt-2 text-sm">A: When prefix queries matter — autocomplete, IP longest-prefix match, URL routing, dictionary lookups with wildcard support. A hash table can&apos;t enumerate &quot;all keys starting with X&quot; without a full scan; a trie does it with a single walk to the prefix node followed by a subtree DFS. Also when keys have a lot of shared structure (URLs, file paths, IP addresses), the trie&apos;s prefix sharing reduces memory.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is the end-of-word marker necessary?</p>
            <p className="mt-2 text-sm">A: To distinguish a stored key from a path that&apos;s merely a prefix of some longer stored key. If you store &quot;cart&quot; and someone searches for &quot;car&quot;, you walk to the &quot;r&quot; node successfully — but &quot;car&quot; was never inserted as a complete key. Without the marker, the trie can&apos;t tell the difference between &quot;present as a key&quot; and &quot;present as a prefix&quot;.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between a standard trie and a radix tree?</p>
            <p className="mt-2 text-sm">A: A radix tree (Patricia trie) collapses any chain of single-child nodes into a single edge labeled with the concatenated string. So instead of separate nodes for c-a-r-t, you get one edge labeled &quot;cart&quot;. Same semantics, far fewer nodes, much better cache behavior. Insertion may need to split an existing edge when a new key diverges mid-edge.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you implement autocomplete with a trie?</p>
            <p className="mt-2 text-sm">A: Walk the trie character by character with the user&apos;s prefix. If the walk fails, return zero suggestions. If it succeeds, the subtree rooted at the current node contains all stored keys starting with that prefix. To rank, store a frequency or score on each end-of-word marker; collect the top-k via DFS with a min-heap of size k. For very large dictionaries, precompute and cache the top-k completions at each interior node.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the space complexity of a trie?</p>
            <p className="mt-2 text-sm">A: Worst case O(n × L) — one node per character of every stored key. Best case (heavy prefix sharing) much smaller. The radix variant cuts this dramatically by only allocating nodes at branching points; for typical real-world data the savings are 5–20×. Each node also carries pointer overhead for its children, which is where the choice between fixed-array, hash, and sorted-array representations matters most.</p>
          </div>
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why do IP routers use tries?</p>
            <p className="mt-2 text-sm">A: Longest-prefix match. A routing table contains CIDR blocks like 10.0.0.0/8, 10.1.0.0/16, 10.1.2.0/24, and routing must match the most specific prefix that covers the destination. A binary trie over IP bits naturally encodes this — descend bit by bit, and the deepest matching node is the longest prefix. No other structure does this with the same elegance and worst-case O(32) time.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold">References & Further Reading</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Fredkin — &quot;Trie Memory&quot; (1960), the original paper introducing the structure</li>
          <li>Morrison — &quot;PATRICIA: Practical Algorithm to Retrieve Information Coded in Alphanumeric&quot; (1968)</li>
          <li>Knuth — <em>The Art of Computer Programming, Vol. 3: Sorting and Searching</em>, Section 6.3 (Digital Searching)</li>
          <li>Sedgewick, Wayne — <em>Algorithms, 4th Edition</em>, Chapter 5.2 (Tries)</li>
          <li>Bagwell — &quot;Ideal Hash Trees&quot; (2001), the HAMT paper that powers Clojure&apos;s collections</li>
          <li>Nilsson, Karlsson — &quot;IP-Address Lookup Using LC-Tries&quot; (1999)</li>
          <li>Linux kernel: <code>lib/radix-tree.c</code> — production radix tree implementation</li>
          <li>Leis, Kemper, Neumann — &quot;The Adaptive Radix Tree (ART)&quot; (ICDE 2013) — the modern in-memory radix tree</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
