"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-dsa-algorithms-suffix-array",
  title: "Suffix Array & LCP Array",
  description:
    "Suffix arrays provide O(n log n) construction and O(P log n) pattern matching for string problems — the practical alternative to suffix trees with lower memory overhead and better cache behavior.",
  category: "other",
  subcategory: "data-structures-algorithms",
  slug: "suffix-array",
  wordCount: 2800,
  readingTime: 11,
  lastUpdated: "2026-05-15",
  tags: ["suffix-array", "lcp-array", "string-algorithms", "pattern-matching"],
  relatedTopics: ["strings", "kmp", "rabin-karp", "binary-search"],
};

export default function SuffixArrayArticle() {
  return (
    <ArticleLayout metadata={metadata}><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: Suffix Array &amp; LCP Array should be explained through a correctness invariant first, then through the implementation technique.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview focus: In interviews, the decisive point is why this approach is valid under the stated constraints, not just what API or algorithm is used.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Interview lens: frame Suffix Array &amp; LCP Array around problem constraints, correctness proof, complexity class, data-structure choice, and degradation strategy. This is what turns the article from concept notes into interview-ready reasoning.</HighlightBlock><HighlightBlock as="p" tier="crucial" className="mb-4">Core invariant to defend: the chosen algorithm must match the input constraints and expose why it is correct, not only why it passes sample cases.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Decision quality comes from naming the constraint, the chosen technique, the proof boundary, and the cost model before discussing implementation details.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Failure modes to call out: choosing a familiar algorithm without proving fit, ignoring worst-case complexity, missing edge cases, and failing to switch to approximation or heuristics when exact solutions are infeasible.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Useful signals or metrics: time complexity, space complexity, approximation quality, preprocessing cost, query cost, and worst-case failure behavior.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Compare the simple approach with the production/interview approach: what gets faster, what gets safer, and what new complexity appears.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">For staff/principal depth, explain how this topic behaves under scale, partial failure, adversarial input, migration pressure, and observability gaps.</HighlightBlock><HighlightBlock as="p" tier="important" className="mb-4">Close the answer with edge cases and tests: smallest input, largest input, invalid input, concurrent or repeated operations, and rollback or recovery behavior.</HighlightBlock>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: a suffix array is the foundational structure behind substring search,
          longest repeated substring, and number of distinct substrings. Interviewers at senior and
          staff levels expect you to explain construction complexity, the role of the LCP array, and
          why suffix arrays beat suffix trees in practice.
        </HighlightBlock>
        <p className="mb-4">
          A suffix array (SA) for a string T of length n is the array of integers giving the starting
          positions of all suffixes of T, sorted in lexicographic order. For example, with T =
          "banana$", the suffixes are: 0:"banana$", 1:"anana$", 2:"nana$", 3:"ana$", 4:"na$",
          5:"a$", 6:"$". After lexicographic sorting, the starting indices are [6, 5, 3, 1, 0, 4, 2],
          so SA = [6, 5, 3, 1, 0, 4, 2]. The value SA[i] tells you which suffix sits at rank i in
          sorted order.
        </p>
        <p className="mb-4">
          The suffix array was introduced by Manber and Myers in 1990 as a space-efficient alternative
          to suffix trees. A suffix tree represents all suffixes in a compressed trie with O(n) nodes
          but needs roughly 20 times more memory per character than a suffix array due to pointer
          overhead, child arrays, and edge label storage. A suffix array stores just n integers — one
          per suffix — making it cache-friendly and practical for strings in the tens of millions of
          characters (genome assemblies, large document corpora).
        </p>
        <p className="mb-4">
          The sentinel character $ is appended to T before constructing the SA. $ must be strictly
          smaller than every character in the alphabet. This trick ensures no suffix is a prefix of
          another suffix (a prerequisite for a clean lexicographic sort), makes the LCP between any
          two distinct suffixes well-defined, and simplifies boundary conditions throughout. In
          competitive programming the dollar sign is conventional; in production you may use a null
          byte or a value below the minimum alphabet code point.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Building the Suffix Array</h2>
        <p className="mb-4">
          Three construction algorithms appear in practice, each representing a different point on the
          complexity-simplicity curve.
        </p>
        <p className="mb-4">
          The naive approach enumerates all n suffixes as explicit strings and sorts them with a
          comparison-based sort. Each comparison costs O(n) character checks in the worst case, and
          sorting n elements takes O(n log n) comparisons, giving O(n&sup2; log n) total time. For
          n = 10&sup5; this is already borderline; for n = 10&sup6; it is completely infeasible. The
          naive approach is useful only for understanding and unit testing on small inputs.
        </p>
        <p className="mb-4">
          Prefix doubling (also called Skew algorithm variant or the DC3 precursor) achieves O(n log n)
          and is the standard algorithm expected in interviews. The core idea: instead of comparing full
          suffix strings, assign each suffix a numeric rank based on progressively longer prefixes. Start
          with ranks by single characters. Then in each round, combine the rank of position i with the
          rank of position i + k (where k doubles each round) to form a 2-tuple rank, re-sort on this
          2-tuple, and reassign new ranks. After O(log n) rounds, ranks are unique and the sort is
          complete. Each round takes O(n log n) with comparison sort or O(n) with radix sort, giving
          O(n log&sup2; n) or O(n log n) total respectively.
        </p>
        <p className="mb-4">
          SA-IS (Suffix Array Induced Sorting), introduced by Nong, Zhang, and Chan in 2009, achieves
          true O(n) construction. It classifies each position as S-type (suffix[i] &lt; suffix[i+1]
          lexicographically) or L-type (suffix[i] &gt; suffix[i+1]), identifies LMS (leftmost S-type)
          suffixes, recursively sorts a reduced problem, then induces the full sorted order. SA-IS is
          the reference implementation in many production libraries (libdivsufsort, sais-java). For
          interview purposes you are not expected to derive SA-IS from scratch, but you should know
          it exists, state its complexity, and explain the S-type/L-type classification at a high level.
        </p>
        <HighlightBlock as="p" tier="important">
          For interviews, prefix doubling is the algorithm to know in depth. Be prepared to walk
          through 2–3 doubling rounds on a 6–8 character example string, explain rank assignment,
          and state the O(n log n) complexity. SA-IS earns bonus points if you can explain the
          S/L-type intuition without deriving the full algorithm.
        </HighlightBlock>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Prefix Doubling Algorithm</h2>
        <p className="mb-4">
          Prefix doubling works by maintaining a rank array where rank[i] represents the current
          lexicographic rank of the suffix starting at position i among all suffixes, based on a
          prefix of length k. The invariant is that if rank[i] == rank[j], the suffixes at i and j
          are identical for their first k characters.
        </p>
        <p className="mb-4">
          Initialization: set rank[i] = T[i] (the character code) for all i. Set k = 1. All suffixes
          are initially ranked by their first character alone. Sort indices by rank to get an initial
          order.
        </p>
        <p className="mb-4">
          Each doubling round: for each position i, form the 2-tuple (rank[i], rank[i + k]) where
          rank[i + k] is defined as -1 if i + k &gt;= n (past the end of string). Sort all positions
          by their 2-tuples. Assign new ranks: two positions get the same new rank only if their
          2-tuples are identical. If all n ranks are now distinct, stop — the suffix array is the
          current sorted order. Otherwise double k and repeat.
        </p>
        <p className="mb-4">
          The algorithm terminates in at most O(log n) rounds because k doubles each round and once
          k &gt;= n every suffix comparison is complete. Using a comparison sort for each round gives
          O(n log n) per round and O(n log&sup2; n) total. Replacing the comparison sort with a
          two-pass radix sort (first on the second element of the tuple, then on the first) brings
          each round to O(n) and total complexity to O(n log n).
        </p>
        <p className="mb-4">
          Consider T = "abaab$" (n = 6). Initial character ranks: a=1, b=2, $=0, so rank =
          [1, 2, 1, 1, 2, 0] for positions 0–5. Round 1 with k=1: 2-tuples are
          (rank[0], rank[1])=(1,2), (rank[1],rank[2])=(2,1), (rank[2],rank[3])=(1,1),
          (rank[3],rank[4])=(1,2), (rank[4],rank[5])=(2,0), (rank[5],beyond)=(0,-1).
          Sort these tuples lexicographically, assign new ranks, continue until all ranks are
          unique. The final order of positions gives the suffix array directly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. LCP Array</h2>
        <p className="mb-4">
          The LCP (Longest Common Prefix) array is a companion structure of length n where LCP[i]
          stores the length of the longest common prefix between the suffix at rank i-1 and the
          suffix at rank i in the sorted suffix array. By convention LCP[0] = 0 since there is no
          previous suffix. The LCP array is essential for many applications that go beyond simple
          pattern matching.
        </p>
        <p className="mb-4">
          For T = "banana$" with SA = [6, 5, 3, 1, 0, 4, 2], the sorted suffixes are: "$", "a$",
          "ana$", "anana$", "banana$", "na$", "nana$". The LCP values are LCP = [0, 1, 3, 0, 0, 2, 0]:
          LCP[1]=1 because "$" and "a$" share no characters (0 would be correct — actually "$" and "a$"
          share 0), LCP[2]=1 because "a$" and "ana$" share "a" (length 1), LCP[3]=3 because "ana$" and
          "anana$" share "ana" (length 3), LCP[4]=0 because "anana$" and "banana$" share nothing, and
          so on. The example values illustrate the structure; exact values depend on careful character
          comparison.
        </p>
        <p className="mb-4">
          Kasai's algorithm computes the LCP array in O(n) time given the suffix array. The key insight
          is the following lemma: if the suffix starting at position i has LCP value L with its neighbor
          in sorted order, then the suffix starting at position i+1 has LCP at least L-1 with its
          neighbor in sorted order. This is because dropping the first character of both suffixes
          reduces their common prefix by at most one. The algorithm maintains a running value h and
          iterates through text positions in text order (not sorted order), exploiting the lemma to
          avoid redundant character comparisons. Total work across all positions is O(n) because h
          increments at most n times total and decrements at most once per position.
        </p>
        <HighlightBlock as="p" tier="important">
          The LCP array unlocks a range of O(n) or O(n log n) algorithms that would otherwise require
          O(n&sup2;) brute force: longest repeated substring, number of distinct substrings, longest
          common substring of multiple strings. Knowing Kasai's algorithm and its O(n) proof is a
          strong signal of depth at senior/staff interviews.
        </HighlightBlock>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Pattern Matching</h2>
        <p className="mb-4">
          Given pattern P of length m and text T of length n with precomputed suffix array SA, finding
          all occurrences of P in T reduces to a range query on a sorted array — binary search.
        </p>
        <p className="mb-4">
          The sorted suffix array is lexicographically ordered, so all suffixes that begin with P form
          a contiguous range [lo, hi] within SA. To find lo, binary search for the leftmost position
          where the suffix T[SA[mid]..] is lexicographically &gt;= P. To find hi, binary search for
          the rightmost position where T[SA[mid]..] starts with P (equivalently, T[SA[mid]..
          SA[mid]+m-1] == P). Both binary searches take O(log n) iterations, and each iteration
          compares up to m characters, giving O(m log n) total time per query.
        </p>
        <p className="mb-4">
          All occurrences of P are then at positions SA[lo], SA[lo+1], ..., SA[hi] in T. The count of
          occurrences is simply hi - lo + 1, computed in O(m log n) without enumerating any positions.
          No preprocessing of P is required, making this approach ideal when patterns vary at query
          time and only the text is fixed.
        </p>
        <p className="mb-4">
          LCP-accelerated binary search reduces complexity to O(m + log n) per query. The idea: maintain
          the LCP between P and the current left/right boundary of the search. When advancing the midpoint,
          use the precomputed LCP array (with RMQ) to skip characters already known to match. This matches
          the O(m + log n) time of suffix tree search, making SA + LCP + RMQ fully equivalent to a suffix
          tree for pattern queries.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Architecture &amp; Flow</h2>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/suffix-array-architecture.svg"
          alt="Suffix Array and LCP Array — construction, LCP, pattern matching, and advanced applications"
          caption="Suffix array architecture — construction via prefix doubling, Kasai LCP, binary-search pattern matching, and advanced string applications"
        />
        <p className="mb-4">
          The diagram above shows the four pillars of suffix array usage. Section A covers construction
          from enumeration through prefix doubling to SA-IS. Section B shows the LCP array alongside
          Kasai's O(n) algorithm. Section C demonstrates binary search for pattern matching. Section D
          lists advanced applications including BWT and longest common substring across multiple strings.
          The arrows indicate the dependency order: construction precedes LCP computation, which enables
          both search acceleration and the applications in Section D.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Applications</h2>
        <p className="mb-4">
          <strong>Longest repeated substring.</strong> The maximum value in the LCP array is the length
          of the longest substring that appears at least twice in T. The position where this maximum
          occurs gives two overlapping occurrences via SA[i-1] and SA[i]. This is a linear scan of the
          LCP array after O(n log n) SA construction — total O(n log n). LeetCode 1044 asks for exactly
          this, making suffix arrays the clean O(n log n) solution versus the O(n log n) binary search
          + rolling hash approach that is more commonly taught.
        </p>
        <p className="mb-4">
          <strong>Number of distinct substrings.</strong> A string of length n has n(n+1)/2 total
          substrings (including duplicates). Each suffix at rank i in the SA introduces LCP[i]
          substrings that duplicate prefixes already counted. Therefore the number of distinct
          substrings equals n(n+1)/2 minus the sum of all LCP values. This reduces a potentially
          O(n&sup2;) enumeration problem to a single O(n) sum after SA and LCP construction.
        </p>
        <p className="mb-4">
          <strong>Longest common substring of multiple strings.</strong> Concatenate all k strings with
          distinct sentinel characters (characters that are unique and smaller than any real character)
          between them. Build a unified suffix array over the concatenated string. Walk through the LCP
          array and find the longest window of consecutive SA entries such that the corresponding
          suffixes originate from at least k distinct input strings (or all k strings for the strictest
          variant). The length of the longest such common substring is the minimum LCP across this window,
          queryable in O(1) with RMQ.
        </p>
        <p className="mb-4">
          <strong>Burrows-Wheeler Transform.</strong> The BWT of a string T is the last column of the
          conceptual matrix of all cyclic rotations of T, sorted lexicographically. Using a suffix array
          on T$, the BWT can be read directly: BWT[i] = T[(SA[i] - 1 + n) mod n]. BWT is the foundation
          of bzip2 and several genome compression formats because it clusters repeated characters,
          dramatically improving run-length encoding and subsequent entropy coding.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Sparse Table + RMQ on LCP</h2>
        <p className="mb-4">
          A fundamental observation: the LCP of any two suffixes SA[i] and SA[j] (i &lt; j) equals the
          minimum value in LCP[i+1 .. j]. This is because as you walk from rank i to rank j in the
          sorted order, the LCP can only decrease or stay the same — the minimum along the path is the
          final shared prefix length between the two endpoints. This connection turns arbitrary suffix
          LCP queries into Range Minimum Queries on the LCP array.
        </p>
        <p className="mb-4">
          A Sparse Table supports static RMQ in O(1) per query after O(n log n) preprocessing and O(n
          log n) space. The table stores, for each position i and each power k, the minimum of
          LCP[i..i+2^k-1]. A query for the minimum in [l, r] is answered by overlapping two precomputed
          ranges of length 2^(floor(log2(r-l+1))) — both cover the range, and the minimum of their
          precomputed values is the answer.
        </p>
        <p className="mb-4">
          Combining SA + LCP + Sparse Table RMQ: given any two positions p and q in T, find their ranks
          rp = ISA[p] and rq = ISA[q] in O(1) using the inverse suffix array ISA (where ISA[SA[i]] = i).
          Then the LCP of the suffixes starting at p and q is RMQ(LCP, min(rp,rq)+1, max(rp,rq)) in
          O(1). The total setup cost is O(n log n) for SA construction and Sparse Table, and O(n) for
          Kasai LCP. Every subsequent suffix LCP query is O(1). This brings the SA to full parity with
          suffix trees for the complete suite of suffix-based queries.
        </p>
        <HighlightBlock as="p" tier="important">
          The SA + ISA + LCP + Sparse Table stack is the production-grade suffix index. It matches
          suffix tree expressiveness with far lower constant factors and implementation complexity.
          At staff-level interviews, describing this full stack — including ISA for O(1) rank lookup
          and the RMQ-to-LCP-min reduction — demonstrates mastery of the topic.
        </HighlightBlock>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. Trade-offs vs Suffix Tree</h2>
        <p className="mb-4">
          Suffix trees and suffix arrays solve the same family of string problems but with meaningfully
          different characteristics. Understanding the trade-off is important because interviewers may
          ask why you would choose one over the other.
        </p>
        <p className="mb-4">
          <strong>Construction complexity.</strong> Suffix trees can be built in O(n) time via
          Ukkonen's online algorithm, which is asymptotically optimal. Suffix arrays via prefix
          doubling take O(n log n), and via SA-IS also O(n). In practice, SA-IS with its excellent
          cache behavior often outperforms Ukkonen's suffix tree construction despite the same
          asymptotic complexity.
        </p>
        <p className="mb-4">
          <strong>Pattern search complexity.</strong> Suffix trees support O(|P|) pattern search
          directly: walk the trie following pattern characters, arrive at a subtree, count leaves.
          Suffix arrays with naive binary search need O(|P| log n). With LCP-accelerated binary
          search and RMQ, suffix arrays match O(|P| + log n), which is effectively O(|P|) for
          large texts where |P| dominates.
        </p>
        <p className="mb-4">
          <strong>Memory footprint.</strong> A suffix tree node requires a label (start, length),
          parent pointer, child pointers (or a hash map of children), and suffix link. For a
          typical implementation this costs 40–60 bytes per node, and there are O(n) nodes. A
          suffix array stores n integers, typically 4 bytes each. For n = 10^7 characters: suffix
          tree ≈ 400–600 MB, suffix array ≈ 40 MB. The 10× to 15× memory advantage of suffix
          arrays is decisive for large-scale applications.
        </p>
        <p className="mb-4">
          <strong>Implementation complexity.</strong> Ukkonen's algorithm is notoriously difficult
          to implement correctly. Prefix doubling for suffix arrays is 30–50 lines of code that a
          prepared engineer can write in an interview. SA-IS is more involved but widely available
          as a library. For production use, libdivsufsort provides a fast, well-tested C
          implementation of suffix array construction.
        </p>
        <p className="mb-4">
          <strong>Practical recommendation.</strong> Use suffix arrays as the default. Add the LCP
          array via Kasai and a Sparse Table for RMQ to handle the full suite of string problems.
          Reach for suffix trees only if you need the implicit tree structure for algorithms that
          traverse the tree (e.g., certain generalized suffix tree algorithms) and memory is not
          a constraint.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">10. Best Practices</h2>
        <p className="mb-4">
          Always append a sentinel character that is strictly smaller than any character in the
          alphabet before building the suffix array. This prevents any suffix from being a prefix
          of another suffix, which would cause ties in the sort that are difficult to break
          correctly and lead to incorrect LCP values. In practice, append a null byte (0x00) or
          a specially chosen out-of-band character. Count the sentinel in n so your arrays are
          sized correctly.
        </p>
        <p className="mb-4">
          Use 0-indexed arrays consistently throughout implementation. The suffix array SA[i] = j
          means the suffix starting at index j is at rank i. The inverse suffix array ISA[j] = i
          is the rank of the suffix starting at j. Mixing up SA and ISA is a common bug. Build ISA
          immediately after constructing SA with a single pass: ISA[SA[i]] = i for all i.
        </p>
        <p className="mb-4">
          When building the LCP array with Kasai's algorithm, iterate through text positions in
          text order (not sorted order). Maintain the running variable h initialized to 0 and
          never reset it to 0 explicitly — allow it to decrement naturally at the start of each
          position. This ensures the O(n) total work bound holds.
        </p>
        <p className="mb-4">
          For the Sparse Table, precompute log2 values for indices 1 through n using a linear
          sieve to avoid calling the math library in query hot paths. Store the Sparse Table as a
          2D array table[k][i] where k is the power (up to log2(n)) and i is the start index,
          to enable cache-friendly row traversal during queries.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">11. Common Pitfalls</h2>
        <p className="mb-4">
          <strong>Forgetting the sentinel character.</strong> Without $, suffix "ana" is a prefix
          of "anana", creating an ambiguous sort order. The resulting suffix array will have
          incorrect ranks and the LCP array will be meaningless for those entries. Always append
          the sentinel before any processing.
        </p>
        <p className="mb-4">
          <strong>Off-by-one in LCP construction.</strong> LCP[0] should always be 0 (no previous
          suffix). The loop in Kasai's algorithm fills LCP[ISA[i]] for each text position i, but
          only when ISA[i] &gt; 0. Attempting to write LCP[0] in this context is an off-by-one
          that corrupts the array and causes incorrect results for the lowest-ranked suffix's neighbor.
        </p>
        <p className="mb-4">
          <strong>Confusing SA[i] and ISA[i].</strong> SA[i] is a text position (where does rank-i
          suffix start?). ISA[j] is a rank (what rank does the suffix at position j have?). Pattern
          matching uses SA to read text positions from ranks. RMQ-based LCP queries use ISA to
          convert text positions to ranks before calling RMQ. Using SA where ISA is needed (or vice
          versa) produces silently wrong answers.
        </p>
        <p className="mb-4">
          <strong>Not handling single-character alphabets or very short strings.</strong> For strings
          of length 1 or 2, the sentinel and the doubling rounds interact in edge cases. Always test
          your implementation against T = "$", T = "a$", and T = "aa$" before trusting it on longer
          inputs.
        </p>
        <p className="mb-4">
          <strong>Comparing full suffixes in binary search instead of just m characters.</strong>
          During pattern matching binary search, the comparison function must compare at most |P|
          characters of the text suffix. Comparing the full suffix produces wrong results when the
          suffix extends beyond the pattern length and happens to differ at position m.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">12. Real-World Use Cases</h2>
        <p className="mb-4">
          <strong>Genome sequencing and bioinformatics.</strong> Assembling a genome requires finding
          all repeated k-mers across millions of sequencing reads. Tools such as BWA (Burrows-Wheeler
          Aligner) build a suffix array or FM-index (a compressed SA derivative) over the reference
          genome and align short reads against it. The FM-index compresses the SA using the BWT and
          wavelet trees, enabling gigabyte-scale genomes to be searched in tens of milliseconds per
          read.
        </p>
        <p className="mb-4">
          <strong>Data compression.</strong> The bzip2 compressor applies the Burrows-Wheeler
          Transform, which is computed directly from the suffix array. After BWT, a move-to-front
          transform and Huffman coding produce compressed files that are typically 10–15% smaller
          than gzip on text. The suffix array is not stored in the compressed file — it is a
          construction artifact — but it is critical to the algorithm's correctness and speed.
        </p>
        <p className="mb-4">
          <strong>Plagiarism detection and document similarity.</strong> Concatenate all documents
          with sentinels, build a suffix array, and scan the LCP array for long common substrings
          spanning different documents. Windows longer than a threshold that appear across document
          boundaries are candidate plagiarized passages. Systems like MOSS (Measure of Software
          Similarity) use suffix-array-like techniques at their core.
        </p>
        <p className="mb-4">
          <strong>Full-text search indexes.</strong> Apache Lucene uses an inverted index but
          augments it with suffix-array-derived structures for phrase queries, wildcard searches,
          and fuzzy matching. ElasticSearch inherits this through Lucene. For specialized
          databases where SQL LIKE '%pattern%' queries are common, suffix arrays built on
          column values dramatically accelerate containment searches that otherwise require
          full table scans.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">13. Interview Questions</h2>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Q1: What is a suffix array and how does it differ from a suffix tree? (Junior–Mid)
        </h3>
        <HighlightBlock as="div" tier="important">
          <p className="mb-2">
            A suffix array is the array of starting indices of all suffixes of a string, sorted in
            lexicographic order. For "banana$" of length 7, SA is an array of 7 integers in [0,6].
            A suffix tree is a compressed trie of all suffixes: each leaf represents a suffix, each
            internal node represents a branching point, and each edge label is a substring of T.
          </p>
          <p className="mb-2">
            The key differences are memory and implementation complexity. A suffix tree has O(n)
            nodes each with multiple pointers — roughly 40–60 bytes per node — totaling 20× or more
            memory versus a suffix array which uses 4 bytes per entry. Suffix tree construction via
            Ukkonen's algorithm is O(n) but notoriously hard to implement; suffix array construction
            via prefix doubling is O(n log n) and straightforward. For pattern search, suffix trees
            achieve O(|P|) while suffix arrays need O(|P| log n), reducible to O(|P| + log n) with
            LCP and RMQ. In practice, suffix arrays + LCP + RMQ match suffix trees for virtually
            all string problems with far better memory and simpler code.
          </p>
        </HighlightBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Q2: Walk through prefix doubling construction for "abaab$". (Mid)
        </h3>
        <HighlightBlock as="div" tier="important">
          <p className="mb-2">
            T = "abaab$" (n=6, positions 0–5). Map characters to ranks: $ → 0, a → 1, b → 2.
            Initial rank array R = [1, 2, 1, 1, 2, 0] for positions 0–5.
          </p>
          <p className="mb-2">
            Round 1, k=1: form 2-tuples (R[i], R[i+1]) — treating out-of-bounds as -1.
            Position 0: (1,2), 1: (2,1), 2: (1,1), 3: (1,2), 4: (2,0), 5: (0,-1).
            Sort positions by tuple: 5:(0,-1), 2:(1,1), 0:(1,2), 3:(1,2), 4:(2,0), 1:(2,1).
            Assign new ranks — ties share a rank: 5→0, 2→1, 0→2, 3→2, 4→3, 1→4.
            New R = [2, 4, 1, 2, 3, 0].
          </p>
          <p className="mb-2">
            Round 2, k=2: 2-tuples (R[i], R[i+2]). Position 0: (2,1), 1: (4,2), 2: (1,3),
            3: (2,0), 4: (3,-1), 5: (0,-1). Sort: 5:(0,-1), 2:(1,3), 3:(2,0), 0:(2,1),
            4:(3,-1), 1:(4,2). All tuples distinct → SA = [5, 2, 3, 0, 4, 1].
            Verification: suffixes in SA order: "$", "aab$", "ab$", "abaab$", "b$", "baab$" —
            lexicographically sorted, correct.
          </p>
        </HighlightBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Q3: Given a suffix array and LCP array, how do you find the longest repeated substring? (Mid)
        </h3>
        <HighlightBlock as="div" tier="important">
          <p className="mb-2">
            The longest repeated substring is the substring that appears as a prefix of at least two
            different suffixes — which is exactly what the LCP array encodes. LCP[i] = length of the
            longest common prefix between the suffix at rank i-1 and rank i. So the length of the
            longest repeated substring is the maximum value in the LCP array.
          </p>
          <p className="mb-2">
            To find the actual substring, locate the index i* = argmax(LCP). The substring starts at
            position SA[i*] in T and has length LCP[i*]. Equivalently it starts at SA[i*-1] with the
            same length. Both are valid starting positions of the repeated substring.
          </p>
          <p className="mb-2">
            Time: O(n log n) for SA construction, O(n) for LCP via Kasai, O(n) linear scan for max
            LCP. Total O(n log n). This is LeetCode 1044 solved cleanly. The alternative (binary
            search on length + rolling hash) has the same asymptotic complexity but higher constant
            factors and collision risk.
          </p>
        </HighlightBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Q4: How do you find all occurrences of pattern P in text T using a suffix array? What is the
          complexity? (Mid–Senior)
        </h3>
        <HighlightBlock as="div" tier="important">
          <p className="mb-2">
            Binary search twice on the suffix array. First, find lo: the leftmost rank where the
            suffix T[SA[mid]..] is lexicographically &gt;= P. Concretely, compare T[SA[mid]..
            SA[mid]+|P|-1] with P and adjust lo/hi until lo converges. Second, find hi: the rightmost
            rank where T[SA[mid]..SA[mid]+|P|-1] == P (i.e., T[SA[mid]..] starts with P).
          </p>
          <p className="mb-2">
            If lo &gt; hi, P does not appear in T. Otherwise, P appears exactly hi - lo + 1 times,
            at text positions SA[lo], SA[lo+1], ..., SA[hi]. Collecting all positions is O(count)
            additional time.
          </p>
          <p className="mb-2">
            Complexity: each binary search does O(log n) iterations, each with an O(|P|) string
            comparison. Total O(|P| log n). With LCP-accelerated binary search using precomputed
            LCP and Sparse Table RMQ, each comparison amortizes to O(1) using the known LCP with
            the current boundary, reducing total to O(|P| + log n).
          </p>
        </HighlightBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Q5: How do you find the longest common substring of two strings using a suffix array? (Senior)
        </h3>
        <HighlightBlock as="div" tier="important">
          <p className="mb-2">
            Concatenate the two strings with distinct sentinel characters: construct T = S1 + "$" + S2 + "#"
            where $ and # are both smaller than any real character but $ &lt; #. Build the suffix array
            and LCP array over T.
          </p>
          <p className="mb-2">
            Walk through the LCP array. For each pair of adjacent suffixes (SA[i-1], SA[i]), their LCP
            is LCP[i]. But we only care about pairs where one suffix starts in S1 and the other starts
            in S2. Check: SA[i-1] &lt; |S1| (starts in S1) and SA[i] &gt; |S1| (starts in S2), or
            vice versa. For such valid pairs, LCP[i] gives a common substring of both original strings
            (as long as the common prefix does not cross the sentinel — which the sentinel ensures
            cannot happen). Track the maximum such LCP[i]; the corresponding substring is the answer.
          </p>
          <p className="mb-2">
            This extends naturally to k strings: concatenate all with distinct sentinels, then find the
            longest LCP window [l, r] in SA such that the suffixes in that window originate from all k
            strings. The LCP of the window is min(LCP[l+1..r]), queryable with RMQ. The longest common
            substring of all k strings is the max such window minimum.
          </p>
        </HighlightBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Q6: Design an O(1) query system for "what is the longest common prefix of any two suffixes?"
          (Staff)
        </h3>
        <HighlightBlock as="div" tier="crucial">
          <p className="mb-2">
            Interview focus: this question tests whether you know the full SA + ISA + LCP + Sparse Table
            stack and can articulate why each component is necessary and how they compose.
          </p>
          <p className="mb-2">
            The system has two phases: preprocessing and query.
          </p>
          <p className="mb-2">
            Preprocessing (one-time, O(n log n)):
            (1) Build suffix array SA in O(n log n) via prefix doubling, or O(n) via SA-IS.
            (2) Build inverse suffix array ISA in O(n): for all i, ISA[SA[i]] = i.
            (3) Build LCP array in O(n) via Kasai's algorithm using SA and ISA.
            (4) Build Sparse Table over LCP in O(n log n) time and space: for each power k and
            position i, store the minimum of LCP[i .. i+2^k-1].
            (5) Precompute log2 values for indices 1..n in O(n) for O(1) power lookup during queries.
          </p>
          <p className="mb-2">
            Query (per query, O(1)): given text positions p and q, compute their SA ranks as
            rp = ISA[p] and rq = ISA[q]. WLOG assume rp &lt; rq. The LCP of the suffixes at p
            and q equals RMQ(LCP, rp+1, rq) = min of LCP in the range [rp+1, rq]. Answer this
            with the Sparse Table in O(1): let k = log2(rq - rp), return min(table[k][rp+1],
            table[k][rq - 2^k + 1]).
          </p>
          <p className="mb-2">
            Total space: O(n log n) for the Sparse Table (dominant term). Total preprocessing
            time: O(n log n). Query time: O(1). This is the canonical solution and is how
            production genome alignment tools answer repetitive substring queries at scale.
          </p>
        </HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
