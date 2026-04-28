"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "trie",
  title: "Trie Pattern",
  description:
    "Prefix tree for string sets — O(L) insert and search, prefix-shared storage, and the substrate for autocomplete, wildcard matching, dictionary-grid search, and bit-trie XOR problems.",
  category: "other",
  subcategory: "patterns",
  slug: "trie",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["trie", "prefix-tree", "leetcode", "patterns", "strings"],
  relatedTopics: ["tree", "hash-table", "string"],
};

export default function TrieArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
      <p className="mb-4">
        A trie (prefix tree) is a rooted tree where each node represents a prefix and each edge is
        labelled with a single character. Walking from the root along a sequence of edges spells out
        the prefix corresponding to that node. A boolean flag at each node marks whether the prefix
        also corresponds to a complete word in the stored set. Insert and search for a string of
        length L are both O(L), independent of the number of stored strings.
      </p>
      <p className="mb-4">
        The trie&apos;s structural property is <strong>shared prefixes</strong>: storing &quot;car&quot;,
        &quot;card&quot;, and &quot;care&quot; uses three nodes for the shared &quot;car&quot; prefix
        plus one node each for &quot;d&quot; and &quot;e&quot;, not three independent strings. This is
        the win over a hash set — for prefix queries (&quot;does any stored word start with X?&quot;,
        &quot;list all words with prefix X&quot;), the trie is O(|X| + |answer|) where a hash needs
        a full scan or per-prefix indexing that bloats memory to O(L²).
      </p>
      <p className="mb-4">
        Recognition signals are concrete. &quot;Implement autocomplete&quot;, &quot;words starting
        with prefix&quot;, &quot;dictionary lookup with wildcards&quot;, &quot;words in grid from a
        word list&quot;, &quot;maximum XOR of two numbers&quot; (bit-trie variant), &quot;longest
        common prefix&quot;. Whenever the question involves many strings and prefix queries, the
        trie is the structural answer.
      </p>
      <p className="mb-4">
        For staff interviews, the lift is composing the trie with a second algorithm — DFS over the
        trie alone (autocomplete suggestions), DFS over a grid in lockstep with the trie (212 Word
        Search II), wildcard recursion across all children for &apos;.&apos; (211), or greedy bit-by-bit
        descent for max XOR (421). The base data structure is mechanical; the engineering is in how
        it integrates with the surrounding algorithm.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
      <p className="mb-4">
        <strong>Node representation.</strong> Three common choices. <em>Fixed array</em> — int[26] or
        TrieNode[26] for lowercase Latin alphabet; fastest, sparse for non-alphabetic. <em>Hash
        map</em> — char → TrieNode; flexible alphabet, slight overhead per access. <em>Compressed
        (radix / Patricia) trie</em> — collapse single-child chains into one edge; saves memory at
        the cost of split logic on insert. For Leetcode-style alphabetic input, int[26] is the
        default.
      </p>
      <p className="mb-4">
        <strong>End-of-word marker.</strong> A boolean isEnd at each node distinguishes &quot;this
        prefix is a stored word&quot; from &quot;this prefix is just a path to other words&quot;.
        Without it, &quot;car&quot; cannot be told apart from a partial path to &quot;card&quot;.
        Some variants store a count or the original word string for richer queries.
      </p>
      <p className="mb-4">
        <strong>Insert and search are walks.</strong> insert(word): walk from root, creating missing
        children, mark final node isEnd = true. search(word): walk; if any child is missing, return
        false; at the end, return isEnd. searchPrefix(prefix): walk; return whether the walk
        completed (no isEnd check). All three are O(L).
      </p>
      <p className="mb-4">
        <strong>Wildcard search.</strong> When the query allows wildcards (211: &apos;.&apos; matches any
        character), the search becomes a DFS — at each &apos;.&apos;, recurse into every existing child.
        Worst case O(26^L), but in practice the trie&apos;s sparsity prunes aggressively.
      </p>
      <p className="mb-4">
        <strong>Trie + DFS over a grid (212).</strong> Build a trie of dictionary words. DFS the
        grid; at each step, advance one trie level. If the trie node has isEnd, record the word; if
        the trie has no child for the next character, prune. The trie eliminates per-word re-search
        across the grid.
      </p>
      <p className="mb-4">
        <strong>Bit-trie for XOR problems (421).</strong> Build a trie keyed by 32-bit binary
        representation, descending one bit at a time from MSB to LSB. To find the max XOR of x with
        any stored value, walk the trie greedily — at each level prefer the child that disagrees
        with x&apos;s bit (yields a 1 in the XOR result); fall back to the agreeing child if the
        opposite is missing. O(32) per query.
      </p>
      <p className="mb-4">
        <strong>Complexity.</strong> Insert and search O(L). Space O(N * L) worst case, much smaller
        with shared prefixes. For an alphabet of size σ, fixed-array nodes use σ * sizeof(pointer)
        per node — for σ = 26 and 64-bit pointers, that&apos;s ~210 bytes per node. Hash-map nodes
        are smaller for sparse use, larger for dense.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/trie-diagram-1.svg"
        alt="Trie structure and node representations"
        caption="Trie structure with shared-prefix storage and the four common node-representation choices."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
      <p className="mb-4">
        <strong>Base trie template (208).</strong> TrieNode has children (array or map) and isEnd.
        insert walks from root creating missing children, sets isEnd at the final node. search walks;
        returns false if any child missing, returns isEnd at end. startsWith walks; returns true if
        the walk completes regardless of isEnd. All O(L).
      </p>
      <p className="mb-4">
        <strong>Wildcard search template (211).</strong> Recursive search(node, word, i). If i == |word|,
        return node.isEnd. If word[i] is a regular char, descend on it. If word[i] is &apos;.&apos;, try
        every existing child recursively; return true if any returns true. Average case is much
        better than the 26^L worst case because most subtrees prune fast.
      </p>
      <p className="mb-4">
        <strong>Word Search II template (212).</strong> Build a trie of all dictionary words. For each
        cell of the grid, run DFS carrying the current trie node. From cell (r, c) with trie node n:
        if n.children has the cell letter, descend in trie; if the descended node has isEnd, record
        the word and clear the flag (avoid duplicates); recurse into 4-neighbour cells with the
        descended trie node. The trie cuts redundant grid traversals.
      </p>
      <p className="mb-4">
        <strong>Autocomplete template (1268).</strong> Insert all products into a trie. For each
        prefix of the search query, walk to the prefix node and DFS the subtree alphabetically,
        collecting up to 3 results. Sort the products before insert so DFS naturally yields
        alphabetic order. O(|query| × |product|) total, much better than re-searching the dictionary
        per prefix.
      </p>
      <p className="mb-4">
        <strong>Bit-trie max-XOR template (421).</strong> Build a trie keyed by 32-bit binary, MSB
        first. For each x: walk the trie greedily, at each bit b, prefer the child labelled (1 − b)
        because that yields a 1 in the XOR; fall back to b if the opposite is missing. After 32
        descents, the path encodes the y that maximises x XOR y. Insert each x after querying for
        an O(n × 32) total.
      </p>
      <p className="mb-4">
        <strong>Compressed trie (radix tree).</strong> Collapse chains of single-child nodes into a
        single edge labelled with the chain&apos;s string. Saves memory dramatically on non-overlapping
        suffixes. Insert and search are still O(L) but with more complex split / merge logic on
        node creation. Used in practice for filesystem path indexes and routers.
      </p>
      <p className="mb-4">
        <strong>Palindrome pairs (336).</strong> Insert each word reversed into a trie. For each
        word w, walk w through the trie. The trie node at any point in the walk represents
        suffixes; check the remaining tail against palindrome rules to find pairs. The full
        algorithm is fiddly but the trie reduces O(n²L) brute force to O(n × L²).
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
      <p className="mb-4">
        <strong>Trie vs. hash set.</strong> Hash set gives O(L) insert and exact-match lookup. It
        cannot answer prefix queries without a full scan or pre-indexing every prefix (O(L²)
        memory). Use a trie when prefix queries are part of the workload.
      </p>
      <p className="mb-4">
        <strong>Trie vs. sorted array + binary search.</strong> Sorted array gives O(L log n) prefix
        lookup (binary-search the lower bound). Trie gives O(L). For static dictionaries,
        sorted-array + binary-search is often simpler and uses less memory. For dynamic insert
        / delete, trie is better — sorted array would be O(n) per insert.
      </p>
      <p className="mb-4">
        <strong>Trie vs. compressed trie.</strong> Plain trie is simpler; compressed trie saves
        memory by an order of magnitude on sparse inputs. For interview implementations, plain trie
        is the default; mention compressed as the production refinement.
      </p>
      <p className="mb-4">
        <strong>Fixed-array nodes vs. hash-map nodes.</strong> Fixed-array is O(σ) memory per node
        even for empty children — wasteful for sparse alphabets. Hash-map is O(actual children)
        memory at the cost of hash overhead. For 26-letter alphabets with dense fan-out, fixed
        array wins; for sparse Unicode, use a map.
      </p>
      <p className="mb-4">
        <strong>Trie + grid DFS vs. brute-force per-word search.</strong> Brute-force is
        O(W × M × N × 4^L). Trie + grid DFS is O(M × N × 4^L) — independent of word count beyond
        the trie&apos;s shared structure. For a dictionary of 10⁴ words, the speedup is 10⁴×.
      </p>
      <p className="mb-4">
        <strong>Trie vs. suffix tree / suffix automaton.</strong> Trie indexes a set of strings;
        suffix tree indexes all suffixes of one string. They are different problems. For Leetcode
        the trie is the relevant tool; suffix structures appear in competitive programming and
        bioinformatics.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
      <p className="mb-4">
        <strong>Pick the node type to match the alphabet.</strong> int[26] for lowercase Latin;
        Map&lt;Character, Node&gt; for arbitrary Unicode; int[2] for bit-tries. The choice affects
        both runtime and memory by 5–10×.
      </p>
      <p className="mb-4">
        <strong>Always include an isEnd flag.</strong> Distinguishing &quot;this prefix is a word&quot;
        from &quot;this prefix is a path to other words&quot; is essential for correctness on any
        non-trivial query.
      </p>
      <p className="mb-4">
        <strong>Sort dictionaries before inserting for autocomplete.</strong> A pre-sorted dictionary
        means DFS through the trie naturally yields alphabetic order — no per-result sort.
      </p>
      <p className="mb-4">
        <strong>Clear isEnd after a 212-style hit.</strong> When DFSing a grid against a trie of
        words and you find a match, clear isEnd at that node to avoid double-recording the same
        word from different starting cells. Mention this — interviewers like the deduplication
        detail.
      </p>
      <p className="mb-4">
        <strong>For bit-tries, fix the bit width.</strong> Always 32 bits for ints, 64 for longs.
        Don&apos;t walk a variable depth — every value contributes exactly the same number of bits, so
        the trie is a balanced tree of fixed depth.
      </p>
      <p className="mb-4">
        <strong>Prune aggressively in DFS over trie.</strong> Whenever the trie has no child for the
        next character, return immediately. The pruning is what makes trie + DFS practical in
        otherwise exponential search spaces.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
      <p className="mb-4">
        <strong>Forgetting isEnd in search.</strong> startsWith returns true at any walk-completion;
        search must additionally check isEnd. Conflating the two passes prefix queries when exact
        matches are needed.
      </p>
      <p className="mb-4">
        <strong>Memory blow-up from int[26] with mostly-empty children.</strong> For a sparse
        100-word dictionary, int[26] uses ~10× the necessary memory. Use a hash map for sparse
        cases.
      </p>
      <p className="mb-4">
        <strong>Recursing into all children for &apos;.&apos; on empty subtrees.</strong> Wildcard
        search must check whether the child exists before recursing. Otherwise it walks null
        references.
      </p>
      <p className="mb-4">
        <strong>Recording duplicates in grid DFS.</strong> Word Search II must clear isEnd on hit or
        deduplicate via a set of found words; otherwise the same word may be found twice from
        different start cells.
      </p>
      <p className="mb-4">
        <strong>Forgetting to backtrack the visited cell in grid DFS.</strong> When DFSing a grid
        with a 4-neighbour visited mark, the mark must be cleared after the recursive call returns
        — otherwise visited cells stay locked across siblings.
      </p>
      <p className="mb-4">
        <strong>Wrong bit order in bit-trie.</strong> Walk MSB to LSB so the greedy &quot;prefer
        opposite bit&quot; choice maximises the XOR&apos;s most significant bit first. Walking LSB
        first gives suboptimal results.
      </p>
      <p className="mb-4">
        <strong>Treating the trie as a balanced tree.</strong> A trie&apos;s height is the longest
        word, not log n. Recursion over a trie can be deep — bounded by L, not by log of word count.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases (Canonical Leetcode Problems)</h2>
      <p className="mb-4">
        <strong>208. Implement Trie.</strong> The base class — insert, search, startsWith. The
        warm-up.
      </p>
      <p className="mb-4">
        <strong>211. Add and Search Word — Data Structure Design.</strong> Wildcard search over
        &apos;.&apos; via DFS over the trie. Tests recursion discipline.
      </p>
      <p className="mb-4">
        <strong>1268. Search Suggestions System.</strong> Autocomplete returning up to 3 suggestions
        per prefix. Sort products first; DFS the trie subtree alphabetically.
      </p>
      <p className="mb-4">
        <strong>642. Design Search Autocomplete System.</strong> Trie + per-node frequency
        aggregation. Streaming version of 1268 with relevance scoring.
      </p>
      <p className="mb-4">
        <strong>720. Longest Word in Dictionary.</strong> Build trie; for each word, walk the trie;
        a word is a candidate iff every prefix is also in the dictionary (every node along the walk
        has isEnd). Take longest, ties broken alphabetically.
      </p>
      <p className="mb-4">
        <strong>14. Longest Common Prefix.</strong> Build trie of all strings; walk down until a
        node has more than one child or isEnd is true. Or, more simply, zip-and-compare without a
        trie.
      </p>
      <p className="mb-4">
        <strong>212. Word Search II.</strong> Trie of words + DFS of grid in lockstep. The flagship
        trie-plus-algorithm problem.
      </p>
      <p className="mb-4">
        <strong>421. Maximum XOR of Two Numbers.</strong> Bit-trie + greedy descent. O(n × 32).
      </p>
      <p className="mb-4">
        <strong>472. Concatenated Words.</strong> Trie + DP — for each word, mark whether it can be
        split into two or more shorter dictionary words; trie speeds the prefix lookups.
      </p>
      <p className="mb-4">
        <strong>745. Prefix and Suffix Search.</strong> Two tries (forward and reversed) plus an
        index intersection at query time, or a single trie keyed by (suffix + &apos;#&apos; + word) to
        merge both queries into one walk.
      </p>

      <ArticleImage
        src="/diagrams/other/leetcode/patterns/trie-diagram-2.svg"
        alt="Trie templates and wildcard search"
        caption="Insert / search templates and the wildcard / grid-DFS extensions that make the trie composable with other algorithms."
      />

      <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Why is trie better than hash for prefix queries?</strong> Hash answers exact match
        in O(L) but cannot list all keys with a given prefix without scanning all keys or
        pre-indexing every prefix (O(L²) memory). Trie does it in O(|prefix| + |answer|).</li>
        <li><strong>What does the isEnd flag distinguish?</strong> Whether a prefix is a stored word or
        only a path to other words. Without it, &quot;car&quot; vs. &quot;card&quot; cannot be told
        apart at the &quot;car&quot; node.</li>
        <li><strong>How do you handle wildcards efficiently?</strong> Recurse over all existing children
        at each &apos;.&apos;. Pruning by missing children keeps the average case far below the 26^L
        worst case.</li>
        <li><strong>How does Word Search II combine trie with grid DFS?</strong> Build a trie of words.
        DFS the grid carrying the current trie node. At each step, advance to the trie child for the
        cell letter; if the child exists and has isEnd, record the word; recurse into neighbours.
        The trie eliminates per-word re-search.</li>
        <li><strong>How does a bit-trie find the maximum XOR?</strong> By greedy descent — at each bit,
        prefer the child whose bit differs from the query bit (because that contributes a 1 to the
        XOR), falling back to the same-bit child if the opposite is missing.</li>
        <li><strong>What is the space complexity of a trie?</strong> O(N × L) worst case for N words of
        length L. Shared prefixes reduce this dramatically — a real-world dictionary of 10⁵ English
        words fits comfortably in a 5 MB trie.</li>
        <li><strong>When would you use a compressed trie?</strong> When memory matters and many nodes
        have only one child — typical of sparse dictionaries. The split / merge logic adds
        complexity but cuts memory significantly.</li>
        <li><strong>How do you delete a word from a trie?</strong> Walk to the end and clear isEnd. If
        the node has no children, walk back up removing childless nodes until a node with isEnd or
        another child is found.</li>
        <li><strong>Why does autocomplete sort the dictionary first?</strong> So that DFS over a trie
        subtree yields suggestions in alphabetical order without per-result sort. The pre-sort is
        a one-time O(N log N) cost.</li>
        <li><strong>How would you support frequency-ranked autocomplete?</strong> Store a frequency at
        each node (max over its subtree). At query time, do best-first search using a heap of
        (frequency, node) — pop the highest-frequency node and push its children.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Leetcode problem set.</strong> 208, 211, 1268, 642, 720, 14, 212, 421, 472, 745, 336.
        The trie syllabus, ordered from base to combination.</li>
        <li><strong>Sedgewick, Algorithms 4th edition, §5.2.</strong> The trie chapter covers R-way
        tries and ternary search trees with rigorous complexity analysis.</li>
        <li><strong>CP-Algorithms — &quot;Trie&quot; and &quot;Aho-Corasick&quot; pages.</strong> Builds
        on the trie to multi-pattern matching, useful for advanced string problems.</li>
        <li><strong>Knuth, TAoCP Volume 3 §6.3 (Digital Searching).</strong> The foundational treatment
        of digital tries and Patricia trees with information-theoretic bounds.</li>
        <li><strong>Editorials for 212 and 421.</strong> Both walk through the trie integration with
        the surrounding algorithm — 212 with grid DFS, 421 with bit-trie greedy descent.</li>
        <li><strong>Grokking the Coding Interview — &quot;Trie&quot; module.</strong> Useful framing of
        the recognition signals and the trie-plus-DFS pattern.</li>
      </ul>
    </ArticleLayout>
  );
}
