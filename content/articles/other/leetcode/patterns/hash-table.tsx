"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "hash-table",
  title: "Hash Table Pattern",
  description:
    "The O(1) average-case lookup that turns repeated linear searches into single passes — the most pervasive interview pattern, underpinning two-sum, anagram grouping, longest consecutive sequence, and most cache designs.",
  category: "other",
  subcategory: "patterns",
  slug: "hash-table",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["hash-table", "leetcode", "patterns", "hashing", "lookup"],
  relatedTopics: ["prefix-sum", "two-pointer", "linked-list"],
};

export default function HashTableArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        The hash-table pattern is the use of a hash-based set, map, or counter as the load-bearing data structure of
        a solution. The structure provides O(1) average-case insert, delete, and membership-test, which collapses
        nested searches into single passes. In interview problems, the hash table rarely is the answer by itself —
        it is the supporting structure that lets a clever observation run in linear time. The art is choosing what
        to store as the key and what to store as the value.
      </p>
      <p className="mb-4">
        Three roles cover the vast majority of uses. As a <strong>set</strong>, the hash table answers &quot;have I
        seen this value before?&quot; — duplicates, cycles, visited nodes. As a <strong>map</strong>, it associates
        a key with metadata: the index where a value last appeared, the count of an occurrence, the head of a
        bucket. As a <strong>counter</strong>, it provides multiset semantics — anagram tests, frequency
        comparisons, sliding-window character counts. Most interview questions reduce to picking one of these three
        and choosing the right key.
      </p>
      <p className="mb-4">
        Recognition signals are unambiguous. &quot;Pair (a, b) with a + b = k&quot; — map of complements. &quot;Group
        these strings by anagram class&quot; — map of signature → bucket. &quot;Longest streak / consecutive run /
        first repeat&quot; — set membership plus a discovery rule. &quot;O(1) get / put / random&quot; — hash plus a
        secondary structure. The signal phrase &quot;in O(1)&quot; almost always means hashing somewhere in the
        solution.
      </p>
      <p className="mb-4">
        For staff interviews, hash tables are table stakes. The interview lift is in choosing the right key
        encoding (tuple? frozen string? canonical form?), in handling hash quality (adversarial input, custom
        objects), and in pairing the hash with another structure (linked list for LRU, dynamic array for O(1)
        random, prefix sum for subarray sums) to hit a non-trivial complexity target. The hash table is rarely the
        whole answer; it is the foundation.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Average vs. worst-case.</strong> Hash tables give O(1) average-case operations under uniform
        hashing assumption. Worst case is O(n) per operation when hashes collide — adversarial inputs can force
        this. Standard library implementations (Java HashMap pre-Java 8, Python dict, Go map) handle this with
        either treeification on long chains (Java 8+ uses a red-black tree above eight collisions per bucket) or
        randomised hash seeds (Python, Rust). On Leetcode the average-case bound is what matters; in
        production-leaning system-design rounds the worst case is fair game.
      </p>
      <p className="mb-4">
        <strong>Choosing the key.</strong> The key must be hashable and must capture exactly the equivalence
        relation of the problem. For anagram grouping, sorted-string is a valid signature but a 26-int count tuple
        is faster (O(n) vs. O(n log n) per word). For visited-node tracking, the node identity (pointer) suffices.
        For coordinate problems, a tuple (row, col) is idiomatic. Bad key choices include floating-point values
        (precision drift), mutable objects (rehash invalidation), and over-coarse signatures (false grouping).
      </p>
      <p className="mb-4">
        <strong>Storing the right value.</strong> The value is what the algorithm needs at lookup time. For
        two-sum, the value is the index (so we can return positions). For sliding-window counters, the value is
        the count. For LRU, the value is the linked-list node so we can splice in O(1). The mistake is storing too
        little — e.g., storing only a boolean when the index is needed — and then re-scanning the array to recover.
      </p>
      <p className="mb-4">
        <strong>Lookup-before-insert vs. insert-before-lookup.</strong> Order matters. In two-sum, lookup must
        precede insert so that A[i] is not used as both halves of the pair. In contains-duplicate-II, insert can
        precede lookup because we want to overwrite the previous index with the current one to maintain the
        nearest-distance invariant. The order encodes whether the current element is allowed to participate in the
        match.
      </p>
      <p className="mb-4">
        <strong>Set vs. map vs. counter.</strong> Set when the metadata is just &quot;present / absent&quot;. Map
        when one piece of metadata is needed (index, head pointer). Counter when frequencies are compared. In
        Python these are distinct types; in Java HashSet vs. HashMap; in C++ unordered_set vs. unordered_map. Mixing
        them up — using a map where a set suffices, or a set where a map is needed — produces correct but
        inefficient or unnecessarily verbose code.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> Insert, delete, lookup: O(1) average, O(n) worst case. Space: O(n) for n
        distinct keys. The constants matter: hashing a long string is O(L) where L is the string length, so
        operations on string keys are O(L) average, not O(1). For 26-letter alphabets, a fixed-size int[26] array
        is faster than a HashMap by a factor of 5–10× and avoids hashing overhead entirely.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/hash-table-diagram-1.svg"
        alt="Hash table roles and recognition signals"
        caption="Three hash-table roles — set, map, counter — and the surface signals that map to each."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>Set-membership template.</strong> Walk the input maintaining a set of values seen so far. For each
        element, if it is in the set, that is the duplicate / cycle / repeat. Otherwise add it. This is the entire
        template for 217 (Contains Duplicate) and the visited-set in cycle detection.
      </p>
      <p className="mb-4">
        <strong>Two-sum template.</strong> Walk i from 0 to n − 1. For each A[i] compute complement = target −
        A[i]. If complement is in the map, return (map[complement], i). Otherwise insert A[i] → i. The lookup
        precedes the insert — that is the discipline.
      </p>
      <p className="mb-4">
        <strong>Group-by-signature template.</strong> For each item, compute a canonical signature (sorted
        characters, count tuple, normalised form) and append the item to a bucket keyed by that signature. After
        the pass, the buckets are the groups. 49 (Group Anagrams) is the canonical instance; many graph problems
        (e.g., grouping nodes by colour) follow the same shape.
      </p>
      <p className="mb-4">
        <strong>Counter equality template.</strong> Build counters for two collections and compare for equality.
        Optimise by mutating one counter as the other is consumed: increment for collection A, decrement for
        collection B; at the end every count must be zero. 242 (Valid Anagram), 567 (Permutation in String) and
        438 (Find All Anagrams) all build on this.
      </p>
      <p className="mb-4">
        <strong>Sliding-window counter.</strong> Maintain a counter of characters in the current window. As R
        advances, increment counter[A[R]]; as L advances, decrement counter[A[L]] (and remove the key if it hits
        zero, to keep the &quot;number of distinct characters&quot; counter accurate). The two operations support
        amortised O(1) sliding for problems like 3 (Longest Substring Without Repeating Characters) and 76
        (Minimum Window Substring).
      </p>
      <p className="mb-4">
        <strong>Hash plus secondary structure.</strong> 146 (LRU Cache) pairs a hash map with a doubly linked list
        — map gives O(1) lookup, list gives O(1) reorder. 380 (Insert Delete GetRandom O(1)) pairs a hash map with
        a dynamic array — map gives O(1) lookup, array gives O(1) random sampling and the swap-with-last trick
        gives O(1) removal. The pattern is recurring: hash for lookup, secondary structure for the operation hash
        cannot do.
      </p>
      <p className="mb-4">
        <strong>Set + discovery rule.</strong> 128 (Longest Consecutive Sequence) builds a set of all values, then
        scans for streak starts (values v where v − 1 is not in the set), expanding each forward until the streak
        breaks. The discovery rule ensures each streak is walked once, giving O(n) overall despite the inner loop.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Hash table vs. sort.</strong> Both can solve duplicate detection, intersection, and pair-finding.
        Sort is O(n log n) time, O(1) extra space (in-place); hash is O(n) time, O(n) space. Default to hash for
        time-bound problems and sort when memory is constrained or when ordering itself matters (sort gives the
        items in a useful order as a side effect; hash does not).
      </p>
      <p className="mb-4">
        <strong>Hash map vs. tree map.</strong> Hash gives O(1) average; tree gives O(log n) worst case. Use a
        tree map (TreeMap, std::map, sorted dict) when ordered iteration, range queries, or floor/ceiling lookups
        are needed — these are O(log n) on a tree, impossible without a full scan on a hash. 729 (My Calendar) and
        352 (Data Stream as Disjoint Intervals) need tree maps; replacing them with hash maps changes the
        complexity from O(log n) to O(n) per operation.
      </p>
      <p className="mb-4">
        <strong>Hash table vs. counting array.</strong> When the key universe is small and known (lowercase
        letters, ASCII bytes, small-int IDs), a fixed-size array beats a hash map: better cache locality, no
        hashing overhead, no allocation. int[26] is the idiomatic counter for lowercase strings; int[256] for
        ASCII; int[26][26] for digraphs. Reach for HashMap only when the key space is large, sparse, or unbounded.
      </p>
      <p className="mb-4">
        <strong>Hash table vs. trie.</strong> For prefix queries, group-by-prefix, and word-search problems with
        many prefixed lookups, a trie wins because it shares prefix structure across keys. Hash map of every
        prefix burns O(L²) memory; trie is O(L) per word with shared edges. 208 (Implement Trie), 211 (Add and
        Search Word), 212 (Word Search II) are trie-shaped, not hash-shaped.
      </p>
      <p className="mb-4">
        <strong>Hash for indices vs. prefix sum + hash for ranges.</strong> Hashing alone solves point queries —
        &quot;does this exact value exist?&quot; For range queries — &quot;does any contiguous subarray sum to k?&quot; —
        the hash needs prefix sums as the keys. The hashing is only the lookup; the prefix structure is the
        algorithmic content.
      </p>
      <p className="mb-4">
        <strong>Hash collision handling.</strong> Built-in hash maps use either open addressing (Python, Go) or
        chaining (Java HashMap, C++ unordered_map). Open addressing has better cache behaviour but worse worst
        case under load; chaining handles high load factors better but allocates. For most interview answers,
        treat the standard library as O(1) and document worst-case O(n) only if asked.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Pick the smallest key encoding that works.</strong> A 26-int tuple beats a sorted string for
        anagram signatures. A frozen tuple beats a JSON-stringified blob for coordinate keys. Smaller keys hash
        faster and avoid the constant-factor traps that turn a &quot;clearly O(n)&quot; solution into a TLE.
      </p>
      <p className="mb-4">
        <strong>Use the standard hash structures.</strong> dict, set, Counter in Python; HashMap, HashSet in Java;
        unordered_map, unordered_set in C++. Counter (or defaultdict(int)) is the right tool for counter
        problems — clearer than manual get-or-default arithmetic.
      </p>
      <p className="mb-4">
        <strong>Pair hash with the right secondary structure.</strong> For ordered constraints, pair with a
        linked list or deque. For random access, with a dynamic array. For ordered iteration, replace with a tree
        map. Recognising the pairing is the difference between the brute force (O(n) per op) and the target
        complexity (O(1) or O(log n)).
      </p>
      <p className="mb-4">
        <strong>Mind the load factor.</strong> Most standard libraries auto-resize at load factor 0.75. For
        tight-loop interview code with large n, pre-size the map (HashMap(initialCapacity), dict via {`{}`} but
        Python is internally amortised) to avoid rehashing pauses. Rarely matters on Leetcode; matters in latency
        rounds.
      </p>
      <p className="mb-4">
        <strong>Prefer typed counters to ad-hoc dicts.</strong> When all values are ints, Counter / Multiset
        semantics make += and -= safe and the &quot;decrement to zero, then remove&quot; pattern explicit. Mixing
        types (sometimes int, sometimes list, sometimes None) signals a confused design.
      </p>
      <p className="mb-4">
        <strong>Frozen / immutable keys only.</strong> Mutating an object after using it as a key invalidates the
        hash and the entry becomes unreachable. Use tuples, strings, or freeze before insert. The most common
        offender is using a list as a coordinate key in Python — list is unhashable, but tuple works.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Inserting before looking up in two-sum.</strong> If A[i] is inserted before the complement check,
        a single element can pair with itself when target = 2 × A[i]. The pair would be (i, i) — invalid. Lookup
        first, insert after.
      </p>
      <p className="mb-4">
        <strong>Forgetting to remove zero-count keys.</strong> In sliding-window counters, the &quot;number of
        distinct keys&quot; is map.size(). If you decrement a count to zero but leave the key, size() lies. Either
        delete on decrement-to-zero, or maintain a separate distinct-count integer that updates explicitly.
      </p>
      <p className="mb-4">
        <strong>Using floating-point as keys.</strong> Floating-point equality is unreliable; two computations
        that should yield 0.1 may differ in the last bit and hash differently. Either round to a fixed precision
        as a string / int, or use a tolerance-based comparison structure (sorted by value with binary search).
      </p>
      <p className="mb-4">
        <strong>Using mutable objects as keys.</strong> Lists in Python (unhashable) raise immediately. Custom
        objects with default identity-hash silently work but compare by reference, not by content — usually wrong.
        Implement equals and hashCode together (Java contract) or use a tuple of fields as the key.
      </p>
      <p className="mb-4">
        <strong>Hash-set scan inside an outer loop.</strong> Scanning for max / min over the set inside an O(n)
        loop turns the algorithm into O(n²). If you need ordered access (max, min, kth), pair with a heap or
        switch to a tree map. For 128 (Longest Consecutive Sequence), the streak-start guard is what avoids this
        trap.
      </p>
      <p className="mb-4">
        <strong>Hash-key string concatenation.</strong> Using a row-comma-col string as a coordinate key
        works but is slower and more error-prone than a tuple. Prefer (row, col) in Python; in Java use a custom
        record or a Long encoding (row * COLS + col).
      </p>
      <p className="mb-4">
        <strong>Adversarial hash collisions.</strong> Python, Go, and Rust default to randomised hashes; Java&apos;s
        String hash is fixed and was historically attackable (deserialisation DoS). For untrusted input in
        production, use hash randomisation or a balanced tree fallback.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>1. Two Sum.</strong> The introductory hash-map pattern. Walk once with a value → index map and
        check for the complement. The lookup-before-insert ordering is the part most candidates muddle.
      </p>
      <p className="mb-4">
        <strong>217. Contains Duplicate.</strong> Hash set, single pass. Compare to the sort-based O(n log n)
        alternative when asked about extra space.
      </p>
      <p className="mb-4">
        <strong>219. Contains Duplicate II.</strong> Map of value → last index. On each visit, check if the
        previous index is within k; either way, overwrite the index. The overwrite is the &quot;insert after&quot;
        — the opposite of two-sum&apos;s discipline.
      </p>
      <p className="mb-4">
        <strong>49. Group Anagrams.</strong> Map of signature → list. The signature can be sorted-string (O(n L
        log L)) or count-tuple (O(n L)). Discuss both in the interview.
      </p>
      <p className="mb-4">
        <strong>242. Valid Anagram.</strong> Counter equality, or a single 26-int array decremented and verified
        all-zero.
      </p>
      <p className="mb-4">
        <strong>128. Longest Consecutive Sequence.</strong> Set + start-guard. Each streak is walked once because
        the inner loop only fires when v − 1 is absent. O(n) total.
      </p>
      <p className="mb-4">
        <strong>146. LRU Cache.</strong> Map + doubly linked list. The map gives O(1) lookup, the list gives O(1)
        promotion to the front and O(1) eviction from the back.
      </p>
      <p className="mb-4">
        <strong>380. Insert Delete GetRandom O(1).</strong> Map + dynamic array. The swap-with-last trick removes
        in O(1) without leaving holes, preserving the array&apos;s O(1)-random property.
      </p>
      <p className="mb-4">
        <strong>290 / 205. Word Pattern / Isomorphic Strings.</strong> Two maps for the bijection — one each
        direction. A single map silently allows non-bijective collisions and produces wrong answers.
      </p>
      <p className="mb-4">
        <strong>3. Longest Substring Without Repeating Characters.</strong> Hash map of character → last index;
        on collision, jump L past the previous occurrence. Pair of sliding window plus hash map is the standard
        sliding-counter pattern.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/hash-table-diagram-2.svg"
        alt="Two-sum trace using a hash map"
        caption="One-pass two-sum trace, showing why lookup must precede insert."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>What is the average and worst-case complexity of a hash-map lookup?</strong> O(1) average under
        uniform hashing; O(n) worst case under collision. Modern implementations mitigate with treeification (Java)
        or randomisation (Python).</li>
        <li><strong>Why does two-sum look up before inserting?</strong> To prevent the same index pairing with itself
        when target = 2 × A[i]. Insert-first counts the current index as a candidate.</li>
        <li><strong>How does LRU cache achieve O(1)?</strong> Hash map for O(1) lookup of nodes, doubly linked list
        for O(1) reorder. The map points at the list node so we can splice without searching.</li>
        <li><strong>How does GetRandom in 380 stay O(1)?</strong> Maintain values in a dynamic array and a map from
        value → index. On remove, swap the target with the last element, pop the last, and update the map.</li>
        <li><strong>Why does 128 (Longest Consecutive Sequence) achieve O(n) despite the inner loop?</strong> The
        inner loop fires only at streak starts (v with v − 1 absent). Each value is visited at most twice —
        once as a candidate start, once as part of one streak.</li>
        <li><strong>When would you use a tree map over a hash map?</strong> When ordered iteration, range queries, or
        floor/ceiling lookups are required — these are O(log n) on a tree and impossible without a full scan on a
        hash.</li>
        <li><strong>How would you handle adversarial hash collisions?</strong> Use a hash with a randomised seed
        (Python, Rust default), treeify long buckets (Java 8+), or use a balanced-tree map for guaranteed O(log n).</li>
        <li><strong>Why is int[26] often faster than HashMap for character counts?</strong> No hashing overhead, no
        allocation, contiguous memory for cache. For fixed alphabets, the array is strictly better.</li>
        <li><strong>What is the difference between a set and a map for visited tracking?</strong> A set answers
        &quot;has this been visited?&quot; A map answers that and stores associated metadata (parent pointer,
        distance, step number). Use the smallest structure that satisfies the queries.</li>
        <li><strong>How do you decide between hashing and sorting?</strong> Hash if time matters more than space and
        no order is needed. Sort if space matters or if subsequent steps benefit from order.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 1, 217, 219, 49, 242, 387, 128, 36, 290, 205, 380, 146, 3, 567, 438,
        76 — the hash-table breadth set. Work them in this order; each adds one new key-encoding or pairing trick.</li>
        <li><strong>CLRS, Chapter 11 (Hash Tables).</strong> Open addressing, chaining, universal hashing — the
        theoretical underpinnings that justify the average-case O(1) bound.</li>
        <li><strong>Java HashMap source (OpenJDK).</strong> Worth reading once — the treeify-bins logic, the resize
        policy, and the hash-spreading function are instructive for understanding standard-library guarantees.</li>
        <li><strong>CPython dict implementation notes.</strong> The compact dict layout (Python 3.6+) and the
        randomised string hash interact in ways that explain why Python dict iteration order is now insertion
        order — useful when counters are iterated.</li>
        <li><strong>Cracking the Coding Interview, Chapter 1 (Arrays and Strings).</strong> The hash-table half of
        the interview canon. 80% of the problems here use a hash map as the load-bearing structure.</li>
        <li><strong>Grokking the Coding Interview — &quot;Hash Maps&quot; module.</strong> Useful framing of the
        recognition signals — &quot;in O(1)&quot;, &quot;duplicate&quot;, &quot;group by&quot; — and the standard
        templates.</li>
      </ul>
    </ArticleLayout>
  );
}
