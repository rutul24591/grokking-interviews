"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "job-sequencing",
  title: "Job Sequencing with Deadlines",
  description:
    "Job sequencing — max-profit selection under deadlines via greedy + DSU or min-heap, exchange-argument proof, and scheduling-family comparisons.",
  category: "other",
  subcategory: "algorithms",
  slug: "job-sequencing",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-20",
  tags: ["job-sequencing", "greedy", "scheduling", "union-find", "heap"],
  relatedTopics: ["activity-selection", "greedy-fundamentals", "huffman-coding"],
};

export default function JobSequencingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Definition &amp; Context</h2>
        <p className="mb-4">
          The <span className="font-semibold">job sequencing problem</span> (with deadlines)
          gives n jobs, each with a unit processing time, a deadline dᵢ (a positive integer
          time unit by which it must finish), and a profit pᵢ earned only if completed on
          time. A single machine processes one job per unit time. Goal: choose and schedule a
          subset of jobs to maximize total profit.
        </p>
        <p className="mb-4">
          The classical greedy rule sorts jobs by profit descending and, for each job, assigns
          it to the latest free slot ≤ its deadline. If no such slot exists, the job is
          dropped. The algorithm runs in O(n log n) with a min-heap or union-find
          implementation and is provably optimal via an exchange argument similar to
          activity selection.
        </p>
        <p className="mb-4">
          This is a unit-time, weighted variant of single-machine scheduling. It appears in
          ad-slot allocation, batch-compute reservation systems, cron prioritization, and any
          context with fixed-size tasks and hard cut-offs. It sits inside the broader
          matroid-intersection family; the unit-time assumption is what makes the greedy work
          — variable-length jobs require DP (weighted-interval scheduling) or are NP-hard.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Core Concepts</h2>
        <p className="mb-4">
          <span className="font-semibold">Input model.</span> Jobs (dᵢ, pᵢ) with dᵢ ∈ ℤ⁺, pᵢ
          ≥ 0, unit processing time. Time slots are 1, 2, 3, …. A scheduling is valid if each
          selected job is assigned a distinct slot t ≤ dᵢ.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Greedy rule.</span> Sort jobs by profit descending.
          Maintain an array of slots, all free initially. For each job, find the latest free
          slot ≤ dᵢ; if found, schedule there. Otherwise skip.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Alternative formulation (heap).</span> Sort jobs by
          deadline ascending. Maintain a min-heap of currently-scheduled profits. Process each
          job: push its profit; if the heap size exceeds the deadline, pop the minimum. The
          heap at the end holds the optimal profit set.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Correctness — greedy-choice property.</span> Any
          optimal solution can be transformed into one that includes the highest-profit job
          scheduled at its latest-possible free slot. Exchange argument: if the optimum O
          excludes job j with profit p_j but includes lower-profit j′, we can swap — unless
          O&rsquo;s selected jobs already saturate slot capacity for deadlines ≤ d_j, in
          which case all of O&rsquo;s ≤ d_j jobs must have profit ≥ p_j.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Complexity.</span> Naive: O(n log n) sort + O(n ·
          d_max) slot scan = O(n · d_max). With DSU: O(n log n · α(n)), essentially linear
          after the sort. With heap (deadline-sorted variant): O(n log n).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/job-sequencing-diagram-1.svg"
          alt="Job sequencing example and algorithm pseudocode"
          caption="Sort by profit; assign each job to the latest free slot ≤ its deadline. Greedy produces profit 170 on the example."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Architecture &amp; Flow</h2>
        <p className="mb-4">
          <span className="font-semibold">Naive implementation.</span> Sort jobs by profit
          desc. slots = array of d_max booleans, all false. For each job, for t from dᵢ down
          to 1, if slots[t] is free, set it, record job at slot t, break. O(n · d_max).
        </p>
        <p className="mb-4">
          <span className="font-semibold">DSU speedup.</span> Maintain parent[t] = latest
          free slot ≤ t (itself if free). find(t) returns the latest free slot ≤ t. When slot
          t is filled, link parent[t] = t − 1. Each find is amortized α(n). Works well when
          d_max is large.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Heap (swap-weakest) implementation.</span> Sort by
          deadline ascending. Walk jobs; push each profit onto a min-heap; if the heap grows
          larger than the current deadline, pop the smallest profit (evicting the weakest
          previously scheduled job). At end, the heap holds the optimal set. Elegant, O(n log
          n), no slot array.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Why latest-free-slot?</span> Assigning to the
          latest possible slot leaves earlier slots open for future jobs with tighter
          deadlines. Assigning to the earliest free slot would preempt room we might need.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Tracking which jobs were selected.</span> Both DSU
          and array versions know which slot each job occupies — record (slot, job id) pairs
          during assignment. For the heap variant, keep a (profit, job id) heap and emit the
          survivors.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Variable-length jobs.</span> Once jobs have
          differing processing times, the problem becomes weighted-interval scheduling (DP)
          or, with machine count &gt; 1, NP-hard (1||Σwᵢ Uᵢ is polynomial but the parallel
          version is not).
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/job-sequencing-diagram-2.svg"
          alt="DSU vs min-heap data-structure speedups with pseudocode and complexity table"
          caption="Two production-grade ways to implement job sequencing: union-find for slot queries, or a simpler min-heap for the swap-weakest pattern."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">4. Trade-offs &amp; Comparisons</h2>
        <p className="mb-4">
          <span className="font-semibold">Job sequencing vs activity selection.</span>
          Activity selection maximizes count; sequencing maximizes profit. Both are unit-slot
          scheduling variants with polynomial greedy solutions but with different sort keys.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Job sequencing vs weighted interval
          scheduling.</span> WIS allows variable-length jobs — requires DP. Job sequencing
          requires unit length; that single restriction is what enables the greedy.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Profit-sort greedy vs deadline-sort heap.</span>
          Both are optimal. Profit-sort + DSU is perhaps more intuitive. Deadline-sort +
          heap is more compact code and avoids the slot array. Both are O(n log n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">DSU vs heap implementation.</span> DSU is faster
          per-operation (amortized α(n)); heap is log n. For n ≤ 10⁶, both are fine; heap is
          simpler.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Job sequencing vs matroid intersection.</span> The
          problem is a specific transversal matroid + uniform matroid intersection. Generic
          matroid-intersection algorithms are polynomial but slower; the specialized greedy
          is strictly better.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Offline vs online.</span> Online (jobs arrive one
          at a time) has worst-case competitive ratio Θ(n). The offline greedy sees all
          profits upfront and is optimal; online cannot match it in the worst case.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">5. Best Practices</h2>
        <p className="mb-4">
          <span className="font-semibold">Sort by profit, not by deadline (unless using the
          heap variant).</span> The profit-descending sort is what makes the greedy optimal.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Use DSU when d_max dominates n.</span> The naive
          scan costs O(n · d_max). DSU collapses that to near-linear.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Prefer the heap variant for clarity.</span> It
          reads in 10 lines and has no slot array. For interview whiteboarding it&rsquo;s the
          right default.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Guard against non-positive profits.</span> Zero-
          profit jobs should be skipped; negative-profit means the job is actively harmful
          and should never be scheduled.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Return both profit and schedule.</span> Callers
          often need the assigned jobs, not just the total. Building the schedule during
          assignment costs nothing extra.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Cap d_max if untrusted.</span> A malicious input
          could set d_max = 2³¹ − 1, blowing memory on the slot array. Cap at min(d_max, n)
          — no job can be scheduled beyond slot n regardless of its deadline.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">6. Common Pitfalls</h2>
        <p className="mb-4">
          <span className="font-semibold">Sorting by deadline for the profit-greedy.</span>
          Produces the wrong answer. Deadline-sort is only correct with the heap variant.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Assigning to the earliest free slot instead of the
          latest.</span> Preempts rooms later jobs with tight deadlines would need. Latest-
          first is essential.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Off-by-one on slot indexing.</span> Slot 1 is the
          first unit of time. Using 0-indexed slots confuses d = 1 vs d = 0 semantics.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Allocating d_max when n &lt;&lt; d_max.</span> If
          deadlines range up to 10⁹ but you have 10 jobs, you&rsquo;d allocate a billion
          slots. Bound slot count by min(d_max, n).
        </p>
        <p className="mb-4">
          <span className="font-semibold">Using greedy for variable-length jobs.</span> Only
          unit-time jobs admit this greedy; variable-length breaks the exchange argument.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Not stabilizing ties.</span> When two jobs have
          equal profit and equal deadline, algorithm correctness is preserved, but test
          fixtures can differ. Use a deterministic tie-break.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">7. Real-World Use Cases</h2>
        <p className="mb-4">
          <span className="font-semibold">Ad-slot allocation.</span> Ad exchanges pick the
          set of ads to display in a fixed set of slots — each ad has an expected revenue
          (profit) and a hard display-time deadline. The unit-slot structure matches job
          sequencing exactly.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Batch-compute queue admission.</span> Spot
          instances, GPU pool rentals, and nightly ETL windows: fixed-duration jobs compete
          for slots with SLA deadlines. Profit = compute-credit price; greedy selects the
          highest-value set.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Broadcast and podcast scheduling.</span> Radio /
          podcast timeslots of equal duration, each advertisement or segment with its own
          expected revenue and must-air-by deadline.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Academic course scheduling.</span> Classroom slot
          admission under registration caps and end-of-term deadlines; priority weighted by
          enrollment.
        </p>
        <p className="mb-4">
          <span className="font-semibold">High-frequency trading order submission.</span>
          Exchange throttles limit orders per unit time; strategies score each candidate
          order by expected edge and select the set within deadline windows that maximizes
          total edge.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Printing queues.</span> Unit-page print jobs with
          user-specified deadlines and billed priority; printer firmware greedily selects
          best-paying subset.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Workflow orchestration (cron-like).</span> When
          machine time is oversubscribed, drop lowest-profit job in its deadline window. The
          swap-weakest heap pattern is the one-liner implementation.
        </p>
        <ArticleImage
          src="/diagrams/other/data-structures-algorithms/algorithms/job-sequencing-diagram-3.svg"
          alt="Scheduling family table and list of real-world applications"
          caption="Job sequencing is one of many scheduling-family problems. Know which tool matches which structure — the unit-time, max-profit version is the greedy&rsquo;s sweet spot."
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">8. Common Interview Questions</h2>
        <p className="mb-4">
          <span className="font-semibold">Classic: implement job sequencing.</span> Given
          (deadline, profit) pairs, return max profit and a valid schedule. Expected: sort
          by profit desc, DSU or naive slot scan.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 630 — Course Schedule III.</span> Exactly
          the swap-weakest heap variant. Sort by deadline; push duration; if total duration
          &gt; deadline, pop max.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 1235 — Maximum Profit in Job
          Scheduling.</span> Variable-length variant → DP + binary search, not greedy.
          Tests whether you recognize the distinction.
        </p>
        <p className="mb-4">
          <span className="font-semibold">LeetCode 502 — IPO.</span> Two-heap greedy: pick
          at most k projects by profit subject to capital constraint.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Prove correctness.</span> Exchange argument —
          swap a high-profit job in for a lower-profit one in any optimal schedule.
        </p>
        <p className="mb-4">
          <span className="font-semibold">Follow-ups:</span> what if jobs have variable
          length? (DP / weighted-interval). What if multiple machines? (harder — list
          scheduling, LPT 4/3-approximation). What if preemption is allowed? (EDF).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">9. References &amp; Further Reading</h2>
        <p className="mb-4">
          CLRS chapter 16 touches on the task-scheduling problem with deadlines. GeeksforGeeks
          and CP-Algorithms have detailed walkthroughs of both the DSU and the heap
          implementations.
        </p>
        <p className="mb-4">
          Pinedo&rsquo;s <em>Scheduling: Theory, Algorithms, and Systems</em> (2016) is the
          modern comprehensive reference covering 1||Σwᵢ Uᵢ (this problem) alongside
          dozens of scheduling variants.
        </p>
        <p className="mb-4">
          For matroid-intersection context, see Schrijver&rsquo;s <em>Combinatorial
          Optimization: Polyhedra and Efficiency</em> (2003). The interview standard is to
          know the greedy + heap implementation and be able to prove correctness on demand.
        </p>
      </section>
    </ArticleLayout>
  );
}
