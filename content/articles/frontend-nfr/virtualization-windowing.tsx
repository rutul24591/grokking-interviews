"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-virtualization-windowing",
  title: "Virtualization / Windowing",
  description: "Comprehensive guide to list virtualization and windowing techniques for rendering large datasets efficiently. Covers react-window, react-virtual, and custom implementations.",
  category: "frontend",
  subcategory: "nfr",
  slug: "virtualization-windowing",
  version: "extensive",
  wordCount: 10000,
  readingTime: 40,
  lastUpdated: "2026-03-15",
  tags: ["frontend", "nfr", "performance", "virtualization", "windowing", "large-lists", "react"],
  relatedTopics: ["page-load-performance", "memoization", "infinite-scroll"],
};

export default function VirtualizationWindowingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Virtualization</strong> (also called <strong>windowing</strong>) is a performance optimization
          technique that renders only the visible portion of a large list or grid, recycling DOM nodes as users
          scroll. Instead of rendering thousands of items simultaneously, virtualization renders only what fits
          in the viewport plus a small buffer.
        </p>
        <p>
          The performance impact of rendering large lists is severe. Each DOM node consumes memory, increases
          parse time, and slows layout/paint operations. A list with 10,000 items might take 5-10 seconds to
          render initially and cause continuous jank during scrolling. Virtualization reduces this to rendering
          10-20 items regardless of total list size, maintaining 60fps scrolling even with millions of items.
        </p>
        <p>
          Virtualization is essential for:
        </p>
        <ul>
          <li><strong>Data tables:</strong> Admin dashboards, analytics views</li>
          <li><strong>Chat messages:</strong> Slack, Discord, WhatsApp web</li>
          <li><strong>Search results:</strong> Infinite scroll result lists</li>
          <li><strong>File explorers:</strong> Folder contents with many files</li>
          <li><strong>Dropdown selects:</strong> Large option lists</li>
        </ul>
        <p>
          For staff and principal engineers, understanding virtualization is crucial because it&apos;s often the
          difference between a usable and unusable application when dealing with large datasets. The technique
          applies to both vertical lists and 2D grids, and modern libraries make implementation straightforward.
        </p>
      </section>

      <section>
        <h2>How Virtualization Works</h2>
        <p>
          Virtualization works by calculating which items are visible in the viewport and rendering only those
          items, positioned absolutely to appear in their correct locations.
        </p>

        <ArticleImage
          src="/diagrams/frontend-nfr/virtualization-how-it-works.svg"
          alt="How Virtualization Works Diagram"
          caption="Virtualization renders only visible items plus buffer, recycling DOM nodes as users scroll — reducing rendered items from thousands to dozens"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Core Concepts</h3>
        <ul className="space-y-3">
          <li>
            <strong>Viewport:</strong> The visible area of the scrollable container
          </li>
          <li>
            <strong>Overscan:</strong> Extra items rendered beyond viewport (buffer to prevent white space)
          </li>
          <li>
            <strong>Item size:</strong> Height (vertical) or width (horizontal) of each item
          </li>
          <li>
            <strong>Scroll offset:</strong> Current scroll position used to calculate visible range
          </li>
          <li>
            <strong>Spacer:</strong> Invisible element that maintains total scrollable height
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">The Virtualization Algorithm</h3>
        <ol className="space-y-3">
          <li>
            <strong>Measure container:</strong> Get viewport height/width
          </li>
          <li>
            <strong>Calculate scroll offset:</strong> Current scroll position
          </li>
          <li>
            <strong>Determine visible range:</strong> Which items intersect viewport
          </li>
          <li>
            <strong>Add overscan:</strong> Include buffer items above/below viewport
          </li>
          <li>
            <strong>Render visible items:</strong> Only items in calculated range
          </li>
          <li>
            <strong>Position absolutely:</strong> Place items at correct offset using transforms
          </li>
          <li>
            <strong>Recycle on scroll:</strong> Reuse DOM nodes when possible
          </li>
        </ol>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Performance Impact</h3>
          <p>
            Without virtualization: 10,000 items = ~500ms initial render, 30-60fps scroll (janky)
          </p>
          <p>
            With virtualization: 10,000 items = ~20ms initial render, 60fps scroll (smooth)
          </p>
          <p className="mt-2">
            The improvement is dramatic because DOM operations are the bottleneck, not JavaScript computation.
          </p>
        </div>
      </section>

      <section>
        <h2>Implementation Approaches</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">1. Fixed-Size Items</h3>
        <p>
          Simplest approach: all items have the same height. This makes calculation trivial since visible range
          is just <code>scrollOffset / itemSize</code>.
        </p>
        <p>
          <strong>Pros:</strong> Fast calculations, simple implementation, best performance
        </p>
        <p>
          <strong>Cons:</strong> Inflexible, can&apos;t handle dynamic content
        </p>
        <p>
          <strong>Best for:</strong> Uniform lists (contacts, file lists, message threads)
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">2. Dynamic-Size Items</h3>
        <p>
          Items have varying heights. Requires measuring each item and caching measurements for future renders.
        </p>
        <p>
          <strong>Implementation:</strong>
        </p>
        <ul className="space-y-2">
          <li>Use <code>ResizeObserver</code> to measure items as they render</li>
          <li>Cache measurements in a map (item index → size)</li>
          <li>Calculate cumulative offsets for positioning</li>
          <li>Handle measurement changes gracefully</li>
        </ul>
        <p>
          <strong>Pros:</strong> Handles any content, flexible
        </p>
        <p>
          <strong>Cons:</strong> More complex, slight performance overhead for measurements
        </p>
        <p>
          <strong>Best for:</strong> Content with varying heights (comments, feeds, search results)
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">3. Grid Virtualization</h3>
        <p>
          2D virtualization for tables and grids. Calculates visible rows <em>and</em> columns.
        </p>
        <p>
          <strong>Considerations:</strong>
        </p>
        <ul className="space-y-2">
          <li>More complex scroll calculations (both axes)</li>
          <li>Column virtualization often unnecessary (fewer columns than rows)</li>
          <li>Sticky headers/rows require special handling</li>
          <li>Cell recycling more complex</li>
        </ul>
        <p>
          <strong>Best for:</strong> Data tables, spreadsheets, image galleries
        </p>

        <ArticleImage
          src="/diagrams/frontend-nfr/virtualization-types.svg"
          alt="Virtualization Types Comparison"
          caption="Comparison of fixed-size, dynamic-size, and grid virtualization — showing use cases and complexity trade-offs"
        />
      </section>

      <section>
        <h2>Popular Libraries</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">react-window</h3>
        <p>
          Lightweight (~13KB), maintained by Brian Vaughn (React team). Provides <code>FixedSizeList</code>,
          <code>VariableSizeList</code>, <code>FixedSizeGrid</code>, and <code>VariableSizeGrid</code>.
        </p>
        <p>
          <strong>Best for:</strong> Most use cases, best balance of features and size
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">react-virtual</h3>
        <p>
          Hook-based API, framework-agnostic core. More flexible but requires more setup.
        </p>
        <p>
          <strong>Best for:</strong> Custom implementations, non-React frameworks (using core)
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">tanstack-virtual (formerly react-virtual)</h3>
        <p>
          Headless virtualization library with framework support for React, Vue, Svelte. Modern API with
          excellent TypeScript support.
        </p>
        <p>
          <strong>Best for:</strong> Multi-framework projects, type-safe implementations
        </p>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Building Your Own</h3>
        <p>
          For simple cases, custom virtualization is straightforward:
        </p>
        <ul className="space-y-2">
          <li>Listen to scroll events (with requestAnimationFrame throttling)</li>
          <li>Calculate visible range based on scroll offset</li>
          <li>Render only visible items with absolute positioning</li>
          <li>Use <code>transform: translateY()</code> for GPU-accelerated positioning</li>
        </ul>

        <ArticleImage
          src="/diagrams/frontend-nfr/virtualization-libraries.svg"
          alt="Virtualization Libraries Comparison"
          caption="Comparison of react-window, react-virtual, tanstack-virtual, and custom implementations — showing bundle size, features, and complexity"
        />
      </section>

      <section>
        <h2>Advanced Patterns</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Infinite Scrolling with Virtualization</h3>
        <p>
          Combine virtualization with infinite scroll for unbounded lists:
        </p>
        <ul className="space-y-2">
          <li>Virtualize the current loaded items</li>
          <li>Detect when user scrolls near end</li>
          <li>Load more items asynchronously</li>
          <li>Append to list (virtualization handles increased size)</li>
          <li>Preserve scroll position during load</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Search/Filter with Virtualization</h3>
        <p>
          Virtualization works seamlessly with filtered lists:
        </p>
        <ul className="space-y-2">
          <li>Filter the data array</li>
          <li>Pass filtered array to virtualized list</li>
          <li>Virtualization automatically adjusts to new item count</li>
          <li>Reset scroll position on filter change</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Auto-Scrolling to Items</h3>
        <p>
          Programmatically scroll to specific items:
        </p>
        <ul className="space-y-2">
          <li>Calculate item offset (sum of all previous item sizes)</li>
          <li>Use <code>scrollTo(offset)</code> method</li>
          <li>For dynamic sizes, ensure item is measured first</li>
          <li>Consider smooth scrolling for better UX</li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Handling Images in Virtualized Lists</h3>
        <p>
          Images cause measurement issues in dynamic-size lists:
        </p>
        <ul className="space-y-2">
          <li>Set explicit image dimensions</li>
          <li>Use aspect-ratio CSS to reserve space</li>
          <li>Lazy-load images outside viewport</li>
          <li>Consider fixed item height if images are uniform</li>
        </ul>
      </section>

      <section>
        <h2>Performance Optimization</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Optimization</th>
              <th className="p-3 text-left">Impact</th>
              <th className="p-3 text-left">Complexity</th>
              <th className="p-3 text-left">When to Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Fixed item size</strong></td>
              <td className="p-3">High</td>
              <td className="p-3">Low</td>
              <td className="p-3">Whenever possible</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Minimize overscan</strong></td>
              <td className="p-3">Medium</td>
              <td className="p-3">Low</td>
              <td className="p-3">Memory-constrained environments</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Item memoization</strong></td>
              <td className="p-3">High</td>
              <td className="p-3">Low</td>
              <td className="p-3">Complex item components</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Throttle scroll events</strong></td>
              <td className="p-3">Medium</td>
              <td className="p-3">Low</td>
              <td className="p-3">Custom implementations</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Column virtualization</strong></td>
              <td className="p-3">Low</td>
              <td className="p-3">High</td>
              <td className="p-3">Wide grids (50+ columns)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Not setting container height:</strong> Virtualized lists need explicit height to calculate
            viewport. Use <code>height</code> prop or CSS.
          </li>
          <li>
            <strong>Forgetting item keys:</strong> Each item needs a stable <code>key</code> for React to
            efficiently recycle components.
          </li>
          <li>
            <strong>Too much overscan:</strong> Rendering too many buffer items wastes memory. Start with 2-5
            items and adjust based on scroll speed.
          </li>
          <li>
            <strong>Dynamic sizes without measurement:</strong> Variable-size lists require measuring each item.
            Don&apos;t guess sizes.
          </li>
          <li>
            <strong>Ignoring accessibility:</strong> Virtualized lists can break screen readers. Use
            <code>role=&quot;list&quot;</code> and <code>aria-setsize</code>.
          </li>
          <li>
            <strong>Scroll position loss:</strong> When data changes, preserve scroll position or intentionally
            reset it.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When would you use virtualization?</p>
            <p className="mt-2 text-sm">
              A: Use virtualization when rendering large lists (100+ items) where not all items are visible
              simultaneously. Common cases: data tables, chat messages, search results, file explorers. Don&apos;t
              virtualize small lists (&lt;50 items) — the complexity isn&apos;t worth it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What&apos;s the difference between virtualization and lazy loading?</p>
            <p className="mt-2 text-sm">
              A: Virtualization renders only visible items but keeps all data in memory. Lazy loading fetches
              data on demand (often with infinite scroll). They&apos;re complementary — use both for very large
              datasets: virtualize what&apos;s loaded, lazy-load more as user scrolls.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle items of varying heights?</p>
            <p className="mt-2 text-sm">
              A: Use dynamic-size virtualization. Measure each item with ResizeObserver as it renders, cache the
              measurements, and use cumulative offsets for positioning. Libraries like react-window&apos;s
              VariableSizeList handle this automatically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What performance metrics improve with virtualization?</p>
            <p className="mt-2 text-sm">
              A: Initial render time (90%+ reduction), memory usage (proportional to visible items, not total),
              scroll performance (consistent 60fps), and Time to Interactive. The improvement scales with list
              size — 10,000 items might go from 5s to 50ms initial render.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://react-window.vercel.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              react-window Documentation
            </a>
          </li>
          <li>
            <a href="https://tanstack.com/virtual" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              TanStack Virtual (formerly react-virtual)
            </a>
          </li>
          <li>
            <a href="https://web.dev/virtualize-lists-with-webpack-and-react/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Virtualize Lists with React
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
