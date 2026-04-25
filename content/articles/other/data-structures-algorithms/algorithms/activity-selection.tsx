"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "activity-selection",
  title: "Activity Selection",
  description:
    "Activity selection — the canonical greedy: earliest-finish-first for max non-overlapping activities, exchange-argument proof, and variants (min rooms, weighted intervals).",
  category: "other",
  subcategory: "algorithms",
  slug: "activity-selection",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["greedy", "activity-selection", "interval-scheduling"],
  relatedTopics: ["greedy-fundamentals", "job-sequencing", "huffman-coding"],
};

export default function ActivitySelectionArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          The <span className="font-semibold">activity selection problem</span> asks: given n
          activities, each with a start time sᵢ and a finish time fᵢ, select the maximum-size
          subset of mutually non-overlapping activities. Two activities i and j are compatible
          if fᵢ ≤ sⱼ or fⱼ ≤ sᵢ. The classical greedy rule — sort by finishing time, pick the
          earliest-finishing activity compatible with those already chosen — solves it in
          O(n log n) and is provably optimal.
        </p>
        <p className="mb-4">
          Activity selection is the textbook example of how to recognize and prove a greedy
          correct via an exchange argument. The intuition is simple: the earliest-finishing
          activity leaves the most room for everything else. The proof turns that intuition
          into a formal swap that transforms any optimal solution into one containing the
          greedy choice without decreasing its size.
        </p>
        <p className="mb-4">
          The problem appears in scheduling classrooms, operating rooms, TV ad slots, CPU
          tasks on a single core, and any domain where mutually-exclusive time-bounded
          resources must be packed. Its close relatives — minimum rooms (interval
          partitioning), weighted intervals (DP), minimum arrows to burst balloons — form the
          broader interval-scheduling family.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Input model.</span> n activities given by (sᵢ, fᵢ)
          with sᵢ &lt; fᵢ. Overlap is defined on the half-open interval [sᵢ, fᵢ). &ldquo;Back-
          to-back&rdquo; activities where fᵢ = sⱼ are compatible — a common source of off-by-
          one bugs if inequality is strict.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Greedy rule.</span> Sort activities by finish time.
          Pick the first. Then for each subsequent activity (in finish order), pick it if its
          start is ≥ the previously picked activity&rsquo;s finish. Skip otherwise.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Correctness — greedy-choice property.</span> Let a₁
          be the activity with the smallest finish time. There exists an optimal solution
          containing a₁: given any optimal O, if a₁ ∉ O let o be the first activity of O (by
          finish time). Swap o for a₁; the new set is still compatible because everything
          else in O starts at or after finish(o) ≥ finish(a₁). Size is preserved.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Correctness — optimal substructure.</span> After
          picking a₁, the remaining subproblem — activities whose start ≥ finish(a₁) — is an
          activity-selection problem of smaller size. Inductive hypothesis gives optimality
          of the tail, combine with a₁ for global optimum.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Complexity.</span> Θ(n log n) with explicit sort.
          Θ(n) if the input is already sorted by finish time. Space Θ(1) beyond the sort.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/activity-selection-diagram-1.svg"
          alt="Activity selection greedy picking 4 non-overlapping activities on a timeline"
          caption="Sort by finish, walk once. Selected activities leave the most room for the remainder."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Iterative implementation.</span> Sort activities by
          finish time (stable sort preserves input order on ties, which is usually fine).
          Initialize last_end = −∞. Walk the sorted list; for each activity (s, f), if s ≥
          last_end emit the activity and set last_end = f. Output the emitted activities.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Recursive implementation.</span> select(i, last_end):
          scan from i, find first activity j with start ≥ last_end, emit j, recurse on (j +
          1, finish[j]). Easy to read, but the iterative version is strictly preferred in
          production.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Minimum rooms (interval partitioning).</span>
          Different problem: schedule <em>all</em> activities, using as few rooms as possible.
          Sort by start time. Maintain a min-heap of current room end-times. For each
          activity, if the heap&rsquo;s min end-time ≤ start, pop (reuse that room); push
          current finish. Answer = final heap size. O(n log n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Minimum arrows to burst balloons (LC 452).</span>
          Sort by end point. Walk through; if current balloon&rsquo;s start is within the
          current arrow&rsquo;s range, it&rsquo;s burst; otherwise a new arrow is needed.
          Equivalent to activity selection in structure.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Non-overlapping intervals to remove (LC 435).</span>
          Count activities the standard greedy picks (that&rsquo;s the <em>kept</em> set),
          answer = n − kept. Same algorithm, different framing.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Weighted interval scheduling.</span> Not solved by
          greedy — needs DP. Sort by finish, compute p(i) = largest j with finish[j] ≤
          start[i] via binary search, then dp[i] = max(dp[i−1], dp[p(i)] + weight[i]). O(n
          log n).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/activity-selection-diagram-2.svg"
          alt="Counter-examples for wrong greedy rules and exchange-argument proof"
          caption="Shortest-duration and earliest-start rules fail on small inputs. Earliest-finish is the unique rule with a valid exchange argument."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Earliest-finish vs other sort keys.</span> Shortest
          duration fails (a short activity in the middle can block two long compatible ones).
          Earliest-start fails (an early-start-late-finish activity blocks everything). Fewest
          conflicts is intuitive but fails on adversarial inputs. Only earliest-finish has a
          valid exchange argument.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Greedy vs DP for weighted intervals.</span> Equal
          weights: greedy wins (simpler, same complexity). Unequal weights: greedy can be
          arbitrarily bad — a single high-weight long interval outweighs many short ones. Use
          the DP formulation.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Activity selection vs interval partitioning.</span>
          Don&rsquo;t confuse them. AS maximizes a subset on one resource; IP uses the minimum
          number of resources to host all. Same input, completely different algorithm (single
          pass vs heap of ends), completely different answer.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Offline vs online.</span> Online activity selection
          (commit or skip as each arrives) has worst-case competitive ratio Θ(n) — you can be
          made arbitrarily bad. Offline wins decisively; whenever possible batch the
          schedule.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Stable sort vs quicksort.</span> Stable preserves
          insertion order on tied finish times, which matches many domain requirements
          (&ldquo;when equal, first submission wins&rdquo;). Quicksort is faster but requires
          explicit tie-breaking keys.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Sort by finish, not by start.</span> Document this
          decision in code. Someone will &ldquo;helpfully&rdquo; change it to start time.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use half-open intervals.</span> [start, finish)
          makes back-to-back compatible without special cases and matches most calendar
          semantics.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Handle equal finish times deterministically.</span>
          Break ties by start time or by input index. Random tie-breaking makes tests flaky.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Validate s &lt; f on input.</span> Zero-duration or
          inverted intervals are likely user errors; detect and flag at the boundary.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Return the selected set, not just the count.</span>
          Callers often want the IDs; reconstructing from the count requires re-running.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Unit-test against a brute-force selector.</span>
          For n ≤ 15, enumerate all subsets and pick the max-compatible. A mismatch
          immediately shows the bug.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Sorting by start time and calling it greedy.</span>
          The #1 bug. Passes some tests, fails on adversarial interleaving.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Strict vs non-strict comparison.</span> If s &gt;=
          last_end, compatible. Writing s &gt; last_end rejects back-to-back activities that
          should be compatible.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Conflating AS with interval partitioning.</span>
          &ldquo;Minimum rooms&rdquo; and &ldquo;maximum activities&rdquo; are different
          problems with different algorithms. Read the prompt carefully.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Using greedy on weighted intervals.</span> Looks
          like the same problem, isn&rsquo;t. DP is the right tool.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one in the &ldquo;first&rdquo; pick.</span>
          Initialize last_end = −∞; don&rsquo;t special-case the first activity with a
          separate append.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assuming activities are unique.</span> Duplicate
          (s, f) pairs are legal; the algorithm picks at most one instance, which is usually
          correct but worth stating.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Classroom and room scheduling.</span> Universities
          and conference centers run AS as a first-pass filter to maximize hours booked per
          room. Subsequent passes handle preferences and weights.
        </p>
        <p className="mb-4">
          <span className="font-semibold">TV advertising and podcast sponsorship.</span>
          Maximum ad slots bookable in a program block — earliest-finish-first picks a
          packing that leaves the most remaining inventory.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Operating room and clinic scheduling.</span>
          Healthcare optimizers use weighted-interval DP for the priority-case scenario and
          AS for utilization reporting.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Satellite overpass planning.</span> Ground stations
          with line-of-sight windows to multiple satellites treat each window as an activity
          and pick a max-utilization subset.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Single-CPU task scheduling.</span> When tasks are
          fire-and-forget with fixed windows, AS produces the largest batch that fits.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Manufacturing assembly-line slots.</span> Time-
          bounded shared-resource reservations on a production line.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Video transcoding pipelines.</span> Encoders with
          fixed available windows on GPU hardware — AS maximizes throughput per encoder.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/activity-selection-diagram-3.svg"
          alt="Problem variants: min rooms, weighted intervals, erasure, plus heap-based min-rooms pseudocode"
          caption="Activity selection sits at the center of an interval-scheduling family. Know which variant you have and which tool applies."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 435 — Non-overlapping Intervals.</span>
          Minimum erasure. Answer = n − AS result.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 452 — Minimum Arrows.</span> Earliest-end
          greedy.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 253 — Meeting Rooms II.</span> Interval
          partitioning — min-heap of ends.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 1353 — Maximum Number of Events.</span>
          Variant where you attend one event per day — priority queue of end times per day.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 646 — Longest Chain.</span> Sort by second
          endpoint, same pattern.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 1235 — Maximum Profit in Job
          Scheduling.</span> Weighted intervals, DP + binary search.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Follow-ups interviewers favor:</span> prove
          correctness with exchange. Give a counter-example for shortest-duration. Extend to
          weighted — why does greedy fail?
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          CLRS chapter 16.1 is the canonical treatment with the exchange-argument proof.
          Kleinberg &amp; Tardos give especially clean versions of all the interval-scheduling
          variants with proof sketches.
        </p>
        <p className="mb-4">
          Gavril&rsquo;s 1972 paper on interval graphs gives the theoretical foundation
          (interval graphs are perfect, so maximum independent set is polynomial — AS is
          exactly that). Competitive-programming tutorials on CP-Algorithms cover the variant
          family with pseudocode.
        </p>
        <p className="mb-4">
          For real scheduling systems, see Pinedo&rsquo;s <em>Scheduling: Theory, Algorithms,
          and Systems</em> (2016) — a comprehensive reference for the generalizations AS
          builds toward in production.
        </p>
      </section>
    </ArticleLayout>
  );
}
