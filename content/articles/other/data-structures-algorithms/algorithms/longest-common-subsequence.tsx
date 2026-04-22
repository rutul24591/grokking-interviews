"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "longest-common-subsequence",
  title: "Longest Common Subsequence (LCS)",
  description:
    "LCS — the O(mn) DP underlying diff, git merge, bioinformatics alignment, and version control. State design and Hunt-Szymanski optimization.",
  category: "other",
  subcategory: "algorithms",
  slug: "longest-common-subsequence",
  wordCount: 4800,
  readingTime: 24,
  lastUpdated: "2026-04-20",
  tags: ["lcs", "dynamic-programming", "diff", "sequence-alignment"],
  relatedTopics: ["edit-distance", "longest-increasing-subsequence", "dp-fundamentals", "rabin-karp"],
};

export default function LcsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          The Longest Common Subsequence (LCS) of two sequences A and B is the longest sequence
          appearing in both as a subsequence — elements in order but not necessarily contiguous.
          For A = &ldquo;ABCBDAB&rdquo;, B = &ldquo;BDCABA&rdquo;, one LCS is &ldquo;BCBA&rdquo;
          (length 4). Distinct from longest common substring, which requires contiguity. LCS is
          NP-hard for k sequences; for k = 2 it admits the classical O(mn) DP.
        </p>
        <p className="mb-4">
          LCS is the algorithmic core behind Unix&rsquo;s diff, Git&rsquo;s three-way merge, and
          bioinformatics tools like BLAST and ClustalW. Every time you rebase a branch, resolve a
          merge conflict, or align DNA sequences, an LCS-style DP (often Myers&rsquo; algorithm, a
          space-optimized variant) is running under the hood.
        </p>
        <p className="mb-4">
          LCS also matters because it generalizes: edit distance is LCS with insert/delete/
          substitute costs; shortest common supersequence is m + n − LCS(A, B); longest
          palindromic subsequence is LCS(A, reverse(A)). Recognizing an LCS-shaped problem in
          interviews often reduces exotic-sounding questions to a known 10-line DP.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">State:</span> dp[i][j] = length of LCS of A[0..i) and
          B[0..j). Answer is dp[m][n]. Base case dp[0][*] = dp[*][0] = 0 (empty prefix → empty
          LCS).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Transition:</span> if A[i−1] == B[j−1], dp[i][j] =
          dp[i−1][j−1] + 1 (extend). Else dp[i][j] = max(dp[i−1][j], dp[i][j−1]) (skip one
          character from either prefix). The recurrence encodes the decision: match-and-advance,
          or advance one pointer.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recovery of the subsequence:</span> walk backward from
          dp[m][n]. If A[i−1] == B[j−1], include that character and decrement both. Else move to
          the larger of dp[i−1][j] and dp[i][j−1]. This produces one LCS; there may be multiple
          valid LCSs of the same length, and which one you recover depends on tie-breaking.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Space optimization:</span> dp[i][*] depends only on
          dp[i−1][*] and dp[i][*−1]. Roll to two 1D arrays (prev, curr) or one with careful
          reads. Hirschberg&rsquo;s algorithm achieves O(m + n) space with divide-and-conquer at
          the cost of 2× time — the standard way to align whole genomes that don&rsquo;t fit in
          memory.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/longest-common-subsequence-diagram-1.svg"
          alt="LCS DP table for ABCBDAB and BDCABA"
          caption="Row/column index = prefix length. Diagonal arrow = match; horizontal/vertical = skip. Traceback produces &ldquo;BCBA&rdquo; length 4."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          Fill the (m+1) × (n+1) table row by row. Each cell examines its diagonal neighbor (for
          match) and its left/top neighbors (for skip). The computation is embarrassingly parallel
          along anti-diagonals — GPU implementations exploit this for sequence alignment at
          hardware speed.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Hunt-Szymanski algorithm</span> (1977): instead of the
          full O(mn) DP, precompute for each distinct character c in B the sorted list of its
          positions. For each character of A, update only the positions where it occurs in B.
          Runtime O((r + n) log n) where r is the number of matching pairs. Excellent when
          sequences have few matches — typical for diff of source code, where most lines are
          distinct.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Myers&rsquo; algorithm</span> (1986), what git actually
          uses: reframe LCS as shortest-edit-script on an edit graph. Runtime O((m + n) · d) where
          d is the size of the minimum edit script. For near-identical files (small d), runtime
          is near-linear — the asymptotic that makes git diff fast on typical commits.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/longest-common-subsequence-diagram-2.svg"
          alt="Myers algorithm edit graph view of LCS"
          caption="Myers&rsquo; edit-graph view: LCS = longest path of diagonal edges = minimum insertions+deletions. Git diff runs this."
        />
        <p className="mb-4">
          <span className="font-semibold">Hirschberg&rsquo;s algorithm</span> (1975): classical
          DP in O(mn) time, O(m+n) space via divide and conquer. Split B in half; compute LCS
          lengths from both ends meeting at the midpoint; recurse. Doubles constant factor but
          makes whole-genome alignment feasible — critical for long sequences where O(mn)
          memory is 10 TB but O(m+n) is a few MB.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">LCS vs Edit Distance:</span> edit distance counts
          insert/delete/substitute operations; LCS counts matches. edit = m + n − 2·LCS for
          indel-only cost model. Adding substitute breaks the equivalence, giving a separate DP.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LCS vs Longest Common Substring:</span> substring
          requires contiguity. DP is similar but resets to 0 on mismatch: dp[i][j] = dp[i−1][j−1]
          + 1 on match, 0 otherwise. Answer is max over all cells, not dp[m][n]. Different
          problem, commonly confused.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LCS vs Myers:</span> classical DP is pedagogically
          clear but always O(mn). Myers achieves O((m+n)·d) where d is edit distance — faster for
          similar files, same worst case. Git, mercurial, and most production diff tools use
          Myers.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LCS vs Rabin-Karp &amp; hashing:</span> these find
          exact substring matches, not subsequences. Complementary tools; LCS for
          version-control-style diffs, hashing for plagiarism detection on exact substrings.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          For production diff, use Myers or a battle-tested library (difflib in Python,
          diff-match-patch in JS). Re-implementing LCS for diff is rarely worth it — edge cases
          around line endings, common prefixes/suffixes, and heuristic improvements matter more
          than the core algorithm.
        </p>
        <p className="mb-4">
          For bioinformatics, use BLAST or minimap2. These are heuristic variants (seed-and-
          extend, k-mer matching, banded DP) that skip unpromising regions. Running raw LCS on
          genome-scale data is computationally infeasible.
        </p>
        <p className="mb-4">
          Preprocess by removing common prefixes and suffixes before running the DP. A diff of
          two files that share the first 1000 lines runs the DP only on the actual changes,
          reducing O(mn) to O(m&prime;n&prime;) where primes denote the shortened portions.
        </p>
        <p className="mb-4">
          When memory is tight, use Hirschberg&rsquo;s O(m+n) space variant. On modern hardware,
          LCS on sequences &gt; ~50000 chars starts straining caches; Hirschberg&rsquo;s is the
          standard fix.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Confusing with longest common substring:</span>
          subsequence allows gaps; substring does not. Different DPs, different answers. A common
          error is to write one when asked for the other.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Returning LCS length instead of the LCS itself:</span>
          many problem statements ask for the actual sequence, requiring traceback. Keeping only
          the 1D rolled array loses traceback — you need the full 2D table.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one on prefix length vs index:</span> dp[i][j]
          is the LCS of the first i characters (A[0..i)), not A[0..i]. Mixing half-open and
          closed intervals is a classic source of bugs.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assuming unique LCS:</span> multiple LCSs of the same
          length may exist. Traceback returns one — which depends on tie-breaking. For
          applications that need all LCSs, enumerate explicitly, which can be exponential.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Unix diff and git diff:</span> core version-control
          operation. Myers&rsquo; algorithm (an LCS variant) identifies matching lines and
          inserted/deleted lines. Git&rsquo;s xdiff implements it with further optimizations
          (low-occurrence line prioritization).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Three-way merge:</span> git merge runs LCS between the
          common ancestor and each branch, then combines the non-conflicting portions. Merge
          conflicts arise when both branches modify lines that LCS didn&rsquo;t match up.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DNA and protein alignment:</span> Needleman-Wunsch
          (global) and Smith-Waterman (local) alignments are LCS with substitution-cost
          matrices. Fundamental to comparative genomics, protein homology search, and drug
          discovery.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Code plagiarism detection:</span> Moss (Stanford) and
          similar tools use LCS-style matching on token streams after lexical normalization.
          Identifies reordering-resistant copying that string matching would miss.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Speech recognition evaluation:</span> Word Error Rate
          (WER) is edit distance between reference and hypothesis word sequences, a direct
          LCS/edit variant. Standard metric in ASR benchmarks.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/longest-common-subsequence-diagram-3.svg"
          alt="LCS applications showing diff, alignment, and plagiarism detection"
          caption="Same O(mn) DP powers git diff, DNA alignment, plagiarism detection, and WER scoring. Weight the operations differently per domain."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">Implement LCS.</span> 2D DP with match/skip transitions.
          Expect to derive the recurrence, identify base cases, and analyze O(mn) complexity.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Return the actual LCS.</span> 2D table plus traceback.
          Keep the full table (not rolled 1D) so the traceback works.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LCS in O(m + n) space.</span> Hirschberg&rsquo;s
          divide-and-conquer: split B, compute forward and backward LCS lengths meeting at
          midpoint, recurse. Doubles time constant.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Longest palindromic subsequence.</span> LCS(s,
          reverse(s)). One-line reduction — common interview trap because candidates try to
          write a separate DP.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Shortest common supersequence.</span> Length = m + n −
          LCS. The supersequence itself is built from the LCS plus the non-LCS characters of
          both inputs.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Hirschberg, &ldquo;A linear space algorithm for computing maximal common subsequences&rdquo; (1975).</li>
          <li>Hunt &amp; Szymanski, &ldquo;A fast algorithm for computing longest common subsequences&rdquo; (1977).</li>
          <li>Myers, &ldquo;An O(ND) difference algorithm and its variations&rdquo; (1986) — the basis of git diff.</li>
          <li>Gusfield, <em>Algorithms on Strings, Trees, and Sequences</em> (1997) — comprehensive.</li>
          <li>CLRS, §15.4 — textbook LCS treatment.</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
