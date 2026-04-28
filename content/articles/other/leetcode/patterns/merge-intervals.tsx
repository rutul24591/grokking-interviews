"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "merge-intervals-pattern",
  title: "Merge Intervals Pattern",
  description:
    "Sort by start time, walk once, merge or append — the universal scaffold for problems where the input is a list of intervals and the question is about their union, overlap, or scheduling.",
  category: "other",
  subcategory: "patterns",
  slug: "merge-intervals",
  wordCount: 4500,
  readingTime: 22,
  lastUpdated: "2026-04-26",
  tags: ["merge-intervals", "scheduling", "sweep-line", "heap"],
  relatedTopics: ["greedy", "heap", "sliding-window"],
};

export default function MergeIntervalsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <h2 className="text-2xl font-bold mt-8 mb-4">Definition & Context</h2>
      <p>
        The merge-intervals pattern handles problems where the input is a list of pairs{" "}
        <em>[start, end]</em> representing time ranges, numeric ranges, or any one-dimensional
        intervals, and the question concerns their union, intersection, conflict, or coverage.
        The unifying technique is to sort the intervals by an appropriate boundary — typically
        start time — and then sweep through the sorted list, deciding at each step whether to
        merge the current interval with the previous one or to start a new group.
      </p>
      <p>
        It is among the highest-leverage patterns in the Leetcode canon. A single mental
        template — sort, walk, merge or append — solves a dozen named problems and forms the
        basis for the more advanced sweep-line and interval-tree algorithms used in calendar
        systems, resource schedulers, geometry libraries, and version control conflict
        detectors. The pattern earns its keep by combining a single sort (O(n log n)) with a
        linear sweep (O(n)) for total cost <em>O(n log n)</em> and constant or linear extra
        space.
      </p>
      <p>
        Recognition signals are obvious in retrospect but easy to miss in the heat of an
        interview. The input is a list of two-element pairs that mean &quot;a continuous range
        from start to end&quot;. The question involves overlap, union, gaps, conflict
        detection, or scheduling. Sometimes the intervals are explicit (a list of meetings);
        sometimes they are implicit and you must construct them (timestamps with durations,
        rectangle x-projections in the skyline problem). When you see this shape, default to
        the merge-intervals scaffold before reaching for anything more elaborate.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Core Concepts</h2>
      <p>
        The pattern&apos;s correctness rests on a single observation: if you sort intervals by
        start time, then any interval that overlaps a previous one must overlap the most
        recently kept interval, because the sort guarantees no earlier-starting interval can
        appear later. This means the sweep only needs to compare each new interval to the last
        one in the result list, not to every previously kept interval. That comparison is what
        keeps the sweep linear.
      </p>
      <p>
        The merge condition is <em>current.start ≤ last.end</em>. Note the inclusive
        comparison: in problems where touching intervals are considered to overlap (a meeting
        ending at 10 and another starting at 10 share the room), use <em>≤</em>; in problems
        where touching intervals are disjoint (the second meeting can start immediately after
        the first ends), use <em>&lt;</em>. The problem statement specifies which; misreading
        it produces an off-by-one bug that is invisible on small examples and obvious on
        adversarial ones.
      </p>
      <p>
        When intervals merge, the new <em>end</em> is <em>max(last.end, current.end)</em> — not
        just <em>current.end</em>. This is the second classic bug. An interval can be wholly
        contained inside a previous one (start later, end earlier), in which case the merge
        does not extend the result at all. Always max the ends; do not assume monotonicity.
      </p>
      <p>
        For variants beyond plain merge, the sort key may differ. <em>Non-overlapping
        Intervals</em> and <em>Min Arrows to Burst Balloons</em> sort by <em>end</em>; the
        greedy choice is to keep the earliest-finishing interval to maximise room for the rest.{" "}
        <em>Remove Covered Intervals</em> sorts by start ascending and end descending so that
        the longer covering interval comes first, then sweeps once. The sort key is the
        algorithmic insight; the sweep is the boilerplate.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Architecture & Flow</h2>
      <p>
        The plain-merge skeleton runs as follows. Sort the input by start ascending. Initialise
        the result list with the first interval. For each subsequent interval, compare its
        start to the last interval&apos;s end in the result. If they overlap, extend the last
        interval&apos;s end to the max of the two ends. Otherwise, append the new interval as
        a fresh group. After the loop, the result list holds the merged disjoint intervals.
      </p>
      <p>
        Variant one is <em>Insert Interval</em> (Leetcode 57). The input is pre-sorted and
        already disjoint; you insert a single new interval. Three phases: append intervals
        ending strictly before the new one&apos;s start (no overlap possible); absorb
        overlapping intervals into the new one by extending its bounds; append the absorbed new
        interval and the remaining intervals. The whole thing runs in O(n) without an extra
        sort.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/merge-intervals-diagram-1.svg"
        alt="Merge intervals overview"

      />
      <p>
        Variant two is <em>sweep-line</em>. Convert each interval into two events: <em>+1</em>{" "}
        at start and <em>−1</em> at end. Sort events by position (with a tie-breaker that puts
        ends before starts when overlap-touching counts as disjoint, or starts before ends
        otherwise). Sweep, maintaining a running active count. The maximum active count is the
        peak overlap. Variations: track which intervals are active in a balanced tree, emit
        events at every change, accumulate area or coverage. Sweep-line generalises naturally
        to 2D (skyline problem) and to many event types (open, close, point query).
      </p>
      <p>
        Variant three is the <em>heap-of-ends</em> pattern, used for <em>Meeting Rooms II</em>{" "}
        and similar resource-allocation questions. Sort intervals by start. Maintain a min-heap
        of end times for currently-allocated resources. For each new interval, pop ends ≤ the
        new start (those resources are now free), then push the new end. The maximum heap size
        ever observed is the answer. Heap-of-ends is conceptually equivalent to sweep-line for
        room-counting problems; both run in O(n log n).
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/merge-intervals-diagram-2.svg"
        alt="Variants"

      />

      <h2 className="text-2xl font-bold mt-8 mb-4">Trade-offs & Comparisons</h2>
      <p>
        Merge-intervals versus brute-force pairwise comparison. Brute force checks every pair
        for overlap in O(n²), which is acceptable for n ≤ a few hundred but unworkable beyond.
        The sort-and-sweep template is O(n log n), the standard for any non-trivial input size.
        The trade-off rarely favours brute force; sort-and-sweep is the default.
      </p>
      <p>
        Sweep-line versus heap-of-ends. Both solve the room-counting problem. Sweep-line is
        more general — it handles arbitrary event types and works for problems beyond
        resource counting. Heap-of-ends is more direct for problems that explicitly ask
        &quot;how many rooms?&quot; and is sometimes easier to code under time pressure.
        Choose by matching the variant to the question; both are correct.
      </p>
      <p>
        Merge-intervals versus interval trees. For static problems where intervals are fixed
        and queried once, sort-and-sweep wins on simplicity. For dynamic problems where
        intervals are inserted and queried online, an interval tree (segment tree, BIT) gives
        per-operation O(log n) and is the production choice. Calendar systems, version-control
        conflict detection, and resource schedulers all use interval trees in production.
      </p>
      <p>
        Within sort-and-sweep, sort by start versus sort by end. Plain merge sorts by start.
        Greedy non-overlapping selection sorts by end. The choice depends on what the algorithm
        needs to maintain as it sweeps; pick the key that lets you make the right local
        decision.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Best Practices</h2>
      <p>
        Read the problem statement twice for the meaning of overlap. Touching at endpoints is
        sometimes overlap and sometimes not; the comparison operator (<em>≤</em> vs.{" "}
        <em>&lt;</em>) hinges on this. State the convention aloud before coding.
      </p>
      <p>
        Always max the ends when merging. <em>last.end = max(last.end, current.end)</em>, never
        just <em>last.end = current.end</em>. The covered-interval case (current ends earlier
        than last) is the silent bug that produces wrong answers on a quarter of test cases.
      </p>
      <p>
        Decide whether to mutate input or to build a new result list. Mutating in place can
        save memory but produces unreadable code; building a fresh result list is almost always
        clearer for interview purposes. In production, mutation may be justified by profiling.
      </p>
      <p>
        For Insert Interval, do not sort. The input is pre-sorted; re-sorting wastes time and
        is a code-smell that signals you missed the precondition. The O(n) three-phase
        algorithm is the expected solution.
      </p>
      <p>
        For sweep-line, define the event-comparator carefully. Two events at the same position
        — does the start come before the end, or vice versa? The choice depends on whether
        touching counts as overlap. Get this wrong and the maximum-active count is off by one
        on a knife-edge input.
      </p>
      <p>
        For heap-of-ends, remember to pop before pushing. The order matters: a meeting whose
        end equals the next start should free its room before the new meeting books one. Pop
        first, push second.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Common Pitfalls</h2>
      <p>
        Off-by-one on overlap definition. The single most common bug across all interval
        problems. Treat <em>[1, 3]</em> and <em>[3, 5]</em>: do they merge or not? The answer
        depends on the problem; pick the right comparison and stay consistent.
      </p>
      <p>
        Forgetting to max the ends. As discussed; the covered-interval case is the silent
        failure mode. Always <em>max(last.end, current.end)</em>.
      </p>
      <p>
        Re-sorting inside the loop. After sorting once, the data is sorted; do not sort again.
        Beginners sometimes re-sort the result list after each merge, blowing the algorithm to
        O(n² log n). The merged result remains sorted by construction.
      </p>
      <p>
        Confusing &quot;overlap&quot; with &quot;cover&quot;. Overlap is partial; cover is one
        interval contained in another. <em>Remove Covered Intervals</em> tests cover, not
        overlap, and the sort key is start ascending plus end descending — different from
        plain merge.
      </p>
      <p>
        Heap-of-ends with stale entries. If you push every end and never pop the freed ones,
        the heap can grow beyond the actual number of rooms. The pop-before-push step is
        essential.
      </p>
      <p>
        Sweep-line with the wrong tie-breaker. At <em>Meeting Rooms II</em>, simultaneous start
        and end at the same time should free first, then book — the comparator must put ends
        before starts at equal positions.
      </p>
      <p>
        Treating intervals as points in 1D problems where they should be 2D. The skyline
        problem is 2D — intervals on the x-axis with a height value. Sweep-line generalises
        cleanly, but trying to plain-merge skyline x-intervals loses the height information
        and gives wrong answers.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Real-World Use Cases</h2>
      <p>
        Calendar systems use the merge-intervals pattern (or its dynamic interval-tree
        equivalent) to detect double-bookings, suggest free slots, and merge contiguous busy
        ranges across multiple calendars. Google Calendar&apos;s &quot;find a meeting time&quot;
        feature is exactly the <em>Employee Free Time</em> Leetcode problem at scale.
      </p>
      <p>
        Resource schedulers — Kubernetes pod admission control, GPU allocation, container
        orchestrators — count concurrent resource demand using sweep-line variants. The
        algorithm that decides &quot;can this new pod fit?&quot; is heap-of-ends translated
        into resource units.
      </p>
      <p>
        On the Leetcode side, the canonical problems are tightly clustered. <em>56. Merge
        Intervals</em> is the canonical problem, the one to solve first and from which every
        other problem in the family is a variant. <em>57. Insert Interval</em> is the O(n)
        pre-sorted variant. <em>986. Interval List Intersections</em> walks two sorted lists
        in parallel to find common ranges.
      </p>
      <ArticleImage
        src="/diagrams/other/leetcode/patterns/merge-intervals-diagram-3.svg"
        alt="Canonical Leetcode problems"

      />
      <p>
        For scheduling and counting, <em>252. Meeting Rooms</em> (can-attend-all?), <em>253.
        Meeting Rooms II</em> (minimum rooms), and the Calendar trilogy <em>729 / 731 / 732</em>
        cover the spectrum from simple booking to k-overlap detection. <em>435. Non-overlapping
        Intervals</em> and <em>452. Min Arrows to Burst Balloons</em> are greedy variants that
        sort by end. <em>218. The Skyline Problem</em> is the apex — sweep-line over rectangle
        edges with a heap of active heights, the closest interview problem to a real
        production sweep-line algorithm. Mastering 56, 57, 253, 435, and 218 covers the
        pattern&apos;s full surface area.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4">Common Interview Questions</h2>
      <ol className="list-decimal pl-6 mb-4 space-y-2">
        <li><strong>Implement Merge Intervals.</strong> Sort by start, walk, merge or append. Handle
        the touching-at-endpoint convention as specified.</li>
        <li><strong>Why is sort-by-start sufficient for the merge step?</strong> Because any
        interval that overlaps an earlier one must overlap the most recently kept interval —
        the sort precludes any other configuration.</li>
        <li><strong>Implement Insert Interval in O(n).</strong> Three phases without re-sorting:
        append before, absorb during, append after.</li>
        <li><strong>Solve Meeting Rooms II two different ways.</strong> Heap-of-ends: sort by start,
        push ends, pop when freed, track max heap size. Sweep-line: events ±1 at start and
        end, sort, sweep, track max active.</li>
        <li><strong>Why is the greedy for Non-overlapping Intervals correct?</strong> Sort by end;
        always keep the earliest-finishing interval that does not conflict with the previous
        kept one. Exchange argument: any optimal selection can be transformed into one that
        starts with the earliest-finishing interval without decreasing the count.</li>
        <li><strong>Walk through the Skyline Problem.</strong> Sweep-line over building edges
        (left and right). Active set is a multiset of heights; on left edge, add height; on
        right edge, remove. Emit a key point whenever the max of the active set changes.</li>
        <li><strong>How does the Calendar problem differ from Merge Intervals?</strong> Calendar
        is dynamic: bookings arrive online and must be accepted or rejected. The static merge
        algorithm does not apply; you need a balanced BST keyed by start time or a segment
        tree.</li>
        <li><strong>Edge cases to test:</strong> empty input, single interval, all intervals
        identical, all intervals disjoint, one interval covers all others, intervals touching
        at endpoints. Tracing each case validates both the sort and the merge logic.</li>
      </ol>
<h2 className="text-2xl font-bold mt-8 mb-4">References & Further Reading</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
        <li>The Algorithm Design Manual by Steven Skiena, chapter on geometric algorithms,
        introduces sweep-line as the universal framework for interval problems and points to
        the closest-pair and segment-intersection applications. de Berg et al.,{" "}
        <em>Computational Geometry: Algorithms and Applications</em>, treats sweep-line in
        depth — the right reference if you want to go beyond Leetcode into industrial
        geometric computing.</li>
        <li>Cormen et al., <em>Introduction to Algorithms</em>, chapter 14 covers interval trees —
        the dynamic data structure underlying production calendar and scheduling systems.
        Read after the static sort-and-sweep template feels comfortable; the interval tree is
        a generalisation that retains the pattern&apos;s spirit.</li>
        <li>For Leetcode practice, the &quot;intervals&quot; tag has 50+ problems; the dozen named
        in the use-cases section span the pattern&apos;s surface area. NeetCode&apos;s
        intervals playlist walks through 57, 56, 435, 252, 253, and 1851 — solid two-week
        coverage. Pair the videos with reading the original solutions at top-coder and
        Codeforces blog posts for the sweep-line and interval-tree variants used in
        competitive programming, where the pattern is taken to its logical extreme.</li>
      </ul>
</ArticleLayout>
  );
}
