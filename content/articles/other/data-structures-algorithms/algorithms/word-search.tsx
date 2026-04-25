"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "word-search",
  title: "Word Search",
  description:
    "Word Search — backtracking DFS on a 2D grid for word existence, Word Search II with trie-pruned multi-word search, and the broader grid-search pattern family.",
  category: "other",
  subcategory: "algorithms",
  slug: "word-search",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["word-search", "backtracking", "grid", "trie", "dfs"],
  relatedTopics: ["backtracking-fundamentals", "n-queens", "permutations-and-combinations"],
};

export default function WordSearchArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          The <span className="font-semibold">Word Search</span> problem asks whether a
          target word can be constructed from sequentially adjacent (horizontally or
          vertically) cells in a 2D grid of letters, where each cell can be used at most
          once per path. Word Search II generalizes to a list of target words, returning
          all that exist.
        </p>
        <p className="mb-4">
          The problem is the canonical grid-DFS-with-backtracking exercise. It exposes
          three crucial patterns: visited bookkeeping with mark-on-enter / unmark-on-leave,
          early termination when the prefix doesn't match, and trie-driven multi-target
          search. Variants underlie Boggle solvers, OCR + lexicon validation, and
          pathfinding in constrained domains.
        </p>
        <p className="mb-4">
          Interview ubiquity reflects its pedagogical density: pure DFS, recursion with
          state restoration, pruning on character mismatch, and the leap from one-target
          to many-target via tries. Staff rounds often ask for both Word Search I and II,
          probing the trie optimization explicitly.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/word-search-diagram-1.svg"
          alt="Word search DFS skeleton"
          caption='Finding "ABCCED" in a 3×4 grid via DFS with mark-and-unmark; the boilerplate skeleton and complexity bound.'
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Grid DFS.</span> From each starting cell that
          matches the first character, depth-first explore neighbors. At depth k, the next
          cell must contain word[k]. Backtrack on mismatch, out-of-bounds, or revisit.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Visited bookkeeping.</span> A path can't reuse a
          cell, but different DFS branches must be allowed to. Mark on enter, unmark on
          leave — a per-path "used" state, not a global visited. Two cheap encodings: a
          parallel boolean grid, or temporarily overwriting <code>grid[r][c]</code> to a
          sentinel like <code>'#'</code> (no extra space).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pruning by character match.</span> Reject the
          branch immediately when <code>grid[r][c] != word[k]</code>. This is critical:
          it caps branching at the first mismatch rather than continuing fruitlessly.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Complexity.</span> For each starting cell, worst
          case is 4 · 3^(L−1) (4 directions on first step, 3 thereafter, since we can't go
          back to the just-visited cell). Across all m·n starting cells, total time is
          O(m · n · 4 · 3^(L−1)). For 10×10 grid and L = 10, ~6M operations — instant.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Word Search II — multi-word search.</span> Naive:
          run Word Search I once per dictionary word — O(|D| · m · n · 4 · 3^(L−1)). For
          |D| = 10⁴ and L = 10, that's hundreds of billions of ops.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Trie-pruned DFS.</span> Build a trie of the
          dictionary. Walk the grid once carrying a trie pointer. At each step, descend
          into the trie child for grid[r][c]; if no child exists, prune the entire DFS
          subtree. When a trie node has a terminal mark, record the word and clear the
          mark to dedupe.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Aggressive trie pruning.</span> When a trie node
          has no children left after recursion, delete it from its parent. This removes
          dead branches from future searches. Empirically the search space collapses
          dramatically as words are found.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Diagonal Boggle.</span> Standard Boggle uses
          8-directional adjacency (including diagonals). Same skeleton, eight neighbors
          instead of four. Branching factor jumps to 8 then 7, but pruning still
          dominates.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/word-search-diagram-2.svg"
          alt="Word Search II with trie"
          caption="Word Search II: a trie shares prefixes across thousands of words, letting one DFS pass find them all."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Outer loop, inner DFS.</span> The driver
          iterates all m · n cells; at each, invoke DFS with k = 0. On first success,
          return true (Word Search I) or accumulate matches (Word Search II).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Direction array.</span> Hard-coded 4 (or 8)
          directions as a (dr, dc) pair list. Loop over this list inside the DFS for
          neighbor exploration. Keeps the hot loop tight.
        </p>
        <p className="mb-4">
          <span className="font-semibold">In-place visited via sentinel.</span> Replace
          grid[r][c] with a non-letter character before recursing; restore on return. Saves
          the visited grid's m·n booleans. Limitation: not thread-safe, breaks if the grid
          is shared.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Iterative version.</span> Convert recursion to
          an explicit stack of (r, c, k, dir-iter) tuples. Useful for very large words or
          when language stack limits are tight (Python default 1000).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Trie node design.</span> 26-element child array
          for English; HashMap for Unicode. For Word Search II, store the full word string
          on terminal nodes — saves reconstructing it from the path.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Multi-DFS fusion.</span> All starting cells can
          run in parallel since each DFS only mutates its own visited state. For very
          large grids, partition starting cells across threads.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">DFS vs BFS.</span> BFS finds the shortest path;
          word search needs an exact-length path matching a string, so DFS with depth
          equal to word length is appropriate. BFS would carry the entire path in each
          frontier element and use exponentially more memory.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Visited grid vs in-place sentinel.</span>{" "}
          Sentinel saves space but mutates input. For interviews, mention both; production
          code usually prefers explicit visited for clarity.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Per-word vs trie-based.</span> For a single
          word, trie has overhead and offers no benefit. For 2 or more words, trie
          dramatically reduces redundant prefix exploration.
        </p>
        <p className="mb-4">
          <span className="font-semibold">DFS vs A* / heuristic search.</span> Word Search
          has no metric on cells — there's no cost to minimize, only existence to verify.
          Heuristics like first-letter rarity (start DFS only from rare-letter cells) can
          prune many starts, but the exponential character of long-word search remains.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Word Search vs regex on flattened grid.</span>{" "}
          Cannot — grid adjacency isn't linear. The 2D structure forces a search-based
          approach.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Prune on first-character mismatch.</span> Skip
          DFS entirely from cells whose letter doesn't match word[0]. Easy 4× to 26×
          speedup on natural-language grids.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use a trie for ≥ 2 target words.</span> Even
          two words share most of their path-walking work; the threshold for trie
          benefit is low.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Mark and unmark in the same recursive
          call.</span> One mark on entry, one unmark on exit — never spread across helper
          functions.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Return early on first success.</span> Word
          Search I doesn't need all paths — just one. Propagate success up the call
          stack and short-circuit other branches.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Aggressive trie pruning in Word Search
          II.</span> After a word is found, delete the trie path. Subsequent DFS skips
          the now-dead branch entirely.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Start from rarest first character.</span>{" "}
          Statistical optimization — e.g., grid has only 2 'Q's; start DFS at those.
          Cuts work substantially for words beginning with rare letters.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Forgetting to unmark.</span> The classic bug.
          Path leaks across siblings; subsequent DFS branches see fictional walls and miss
          valid solutions.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Sharing visited across starting cells.</span>{" "}
          The visited state is per-DFS, not global. Reset (or use sentinel) at each
          start.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Diagonal vs orthogonal confusion.</span> Word
          Search uses 4 directions; Boggle uses 8. Mixing them up gives wrong answers.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Reusing the same cell within a path.</span>{" "}
          The problem statement explicitly forbids reuse. Without visited tracking the
          algorithm finds words like "AAAA" using a single 'A' four times.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Returning duplicates in Word Search II.</span>{" "}
          Multiple paths can reach the same trie terminal. Clear the terminal mark or use
          a result set.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Stack overflow on long words.</span> L = 10⁴
          recursion depth blows Python's default stack. Convert to iterative or increase
          limit.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Building trie inefficiently.</span> Per-node
          HashMap allocation is slow; use a 26-array for English and pool nodes if
          building millions of tries.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Boggle / Wordament solvers.</span> Mobile games
          asking the user to find words in a 4×4 letter grid against a timer. The solver
          (and the AI opponent) runs Word Search II with a 200k-word dictionary trie. Must
          be fast enough to enumerate all valid words in &lt; 100ms.
        </p>
        <p className="mb-4">
          <span className="font-semibold">OCR with lexicon validation.</span> When OCR
          produces uncertain character predictions in a 2D layout (e.g., scanned table
          cells), trie-driven traversal of confidence-weighted neighbors finds the most
          plausible word matching a lexicon. Used in document AI pipelines.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Crossword construction.</span> Filling crossword
          slots with valid words under intersection constraints uses a similar
          trie-augmented backtracking — at each slot, the candidate word must match
          letters already placed at crossings.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Image segmentation flood fill.</span> Number of
          islands, connected component labeling — same DFS-with-visited pattern, no word
          to match. The grid-DFS muscle from word search transfers directly.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Pathfinding in constrained domains.</span> Maze
          solvers, rat in a maze, knight's tour — DFS + backtracking on grid with cell
          reuse forbidden. Same skeleton, different success condition.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cipher / puzzle CTFs.</span> Hidden-word
          challenges in security CTFs often present a grid of seemingly random letters
          encoding a flag along a non-trivial path. Trie-based search finds known
          dictionary words; flag candidates surface as outliers.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/word-search-diagram-3.svg"
          alt="Grid search pattern family"
          caption="Word Search alongside the broader grid-search family — and applications across games, OCR, segmentation, and pathfinding."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">"Word Search I — does this word exist in the
          grid?"</span> DFS from each cell matching word[0], 4-directional, mark/unmark,
          short-circuit on first success.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Word Search II — return all words from a
          dictionary that exist."</span> Build trie, single grid DFS carrying trie
          pointer, prune on missing child, dedupe via terminal-mark clearing.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"What's the time complexity?"</span> O(m · n ·
          4 · 3^(L−1)) for Word Search I. For II, dominated by trie pruning; worst case
          O(m · n · 4 · 3^(Lmax − 1)) but in practice the trie collapses search.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"Can the same cell be reused?"</span> No, per
          path — that's why visited is needed. Across different paths, yes.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"How would you parallelize?"</span> Each
          starting cell yields an independent DFS; partition cells across threads. Slight
          contention if writing results to a shared structure; use thread-local
          accumulators.
        </p>
        <p className="mb-4">
          <span className="font-semibold">"What changes for diagonal moves
          (Boggle)?"</span> Direction array becomes 8-element. Branching factor up,
          pruning still dominates. Same overall structure.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          LeetCode #79 (Word Search) and #212 (Word Search II) for the canonical interview
          problems. Knuth on tries (TAOCP Vol 3, Section 6.3). Boggle solver
          implementations in open source (e.g., Stanford CS106B assignments). For
          production OCR + lexicon, see the Tesseract dictionary integration. The general
          backtracking framework underlying Word Search is covered in CLRS chapter on
          Greedy Algorithms (which discusses DFS-based search) and in any modern
          algorithms textbook's chapter on graph traversal.
        </p>
      </section>
    </ArticleLayout>
  );
}
