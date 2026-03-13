"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-memoization-react-memo-concise",
  title: "Memoization and React.memo",
  description: "Quick overview of memoization techniques in React for preventing unnecessary re-renders and optimizing performance.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "memoization-and-react-memo",
  version: "concise",
  wordCount: 3000,
  readingTime: 12,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "react", "memoization", "React.memo", "useMemo", "useCallback"],
  relatedTopics: ["virtualization-windowing", "debouncing-and-throttling", "code-splitting"],
};

export default function MemoizationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Memoization</strong> is an optimization technique that caches the result of expensive computations
          and returns the cached result when the same inputs occur again. In React, memoization serves two purposes:
          preventing unnecessary re-renders of components (<code>React.memo</code>) and avoiding expensive
          recalculations of derived data (<code>useMemo</code>, <code>useCallback</code>).
        </p>
        <p>
          React re-renders a component whenever its parent re-renders, even if the component's props haven't changed.
          For most components this is fine — React's reconciliation is fast. But for expensive components (large lists,
          complex charts, heavy computations), preventing unnecessary re-renders can make the difference between
          smooth 60fps interactions and janky, unresponsive UI.
        </p>
      </section>

      <section>
        <h2>React.memo — Preventing Re-Renders</h2>
        <p>
          <code>React.memo</code> is a higher-order component that memoizes a component. It does a shallow comparison
          of props and skips re-rendering if they haven't changed.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { memo, useState } from 'react';

// Without memo: re-renders every time parent re-renders
function ExpensiveChart({ data, config }) {
  // Heavy rendering logic — 50ms to render
  return <canvas>{/* ... */}</canvas>;
}

// With memo: only re-renders when data or config change
const MemoizedChart = memo(function ExpensiveChart({ data, config }) {
  return <canvas>{/* ... */}</canvas>;
});

// Parent component
function Dashboard() {
  const [count, setCount] = useState(0);
  const chartData = useChartData();

  return (
    <div>
      {/* This re-renders on every click */}
      <button onClick={() => setCount(c =&gt; c + 1)}&gt;
        Clicked {count} times
      </button>

      {/* Without memo: re-renders on every click (wasted 50ms) */}
      {/* With memo: skips re-render because data/config didn't change */}
      <MemoizedChart data={chartData} config={CHART_CONFIG} />
    </div>
  );
}

// Custom comparison function
const MemoizedList = memo(
  function UserList({ users, filter }) {
    return users.filter(filter).map(u =&gt; <UserCard key={u.id} user={u} />);
  },
  // Only re-render if users array or filter function identity changed
  (prevProps, nextProps) =&gt; {
    return (
      prevProps.users === nextProps.users &&
      prevProps.filter === nextProps.filter
    );
  }
);`}</code>
        </pre>
      </section>

      <section>
        <h2>useMemo — Caching Expensive Computations</h2>
        <p>
          <code>useMemo</code> caches the result of a computation and only recalculates when its dependencies change.
          Use it when deriving data that's expensive to compute.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useMemo, useState } from 'react';

function ProductList({ products, searchTerm, sortBy }) {
  // ❌ BAD: Filters and sorts on EVERY render (even if products didn't change)
  const displayProducts = products
    .filter(p =&gt; p.name.includes(searchTerm))
    .sort((a, b) =&gt; a[sortBy] - b[sortBy]);

  // ✅ GOOD: Only recalculates when dependencies change
  const displayProducts = useMemo(() =&gt; {
    return products
      .filter(p =&gt; p.name.includes(searchTerm))
      .sort((a, b) =&gt; a[sortBy] - b[sortBy]);
  }, [products, searchTerm, sortBy]);

  return displayProducts.map(p =&gt; <ProductCard key={p.id} product={p} />);
}

// Good use cases for useMemo:
// - Filtering/sorting large arrays (1000+ items)
// - Complex object transformations
// - Creating derived data structures (maps, sets, indexes)
// - Expensive math or formatting operations

const stats = useMemo(() =&gt; {
  return {
    total: items.reduce((sum, i) =&gt; sum + i.price, 0),
    average: items.reduce((sum, i) =&gt; sum + i.price, 0) / items.length,
    max: Math.max(...items.map(i =&gt; i.price)),
    grouped: Object.groupBy(items, i =&gt; i.category),
  };
}, [items]);`}</code>
        </pre>
      </section>

      <section>
        <h2>useCallback — Stabilizing Function References</h2>
        <p>
          <code>useCallback</code> returns a memoized version of a callback function that only changes when its
          dependencies change. It's primarily useful when passing callbacks to memoized child components.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useCallback, memo, useState } from 'react';

const MemoizedButton = memo(function Button({ onClick, label }) {
  console.log('Button rendered:', label);
  return <button onClick={onClick}>{label}</button>;
});

function Toolbar() {
  const [count, setCount] = useState(0);

  // ❌ BAD: New function reference every render → MemoizedButton re-renders
  const handleSave = () =&gt; {
    saveData();
  };

  // ✅ GOOD: Stable function reference → MemoizedButton skips re-render
  const handleSave = useCallback(() =&gt; {
    saveData();
  }, []); // Empty deps: function never changes

  const handleDelete = useCallback((id) =&gt; {
    deleteItem(id);
    setCount(c =&gt; c + 1);
  }, []); // Uses functional updater, no deps needed

  return (
    <div>
      <p>Count: {count}</p>
      <MemoizedButton onClick={handleSave} label="Save" />
      <MemoizedButton onClick={handleDelete} label="Delete" />
    </div>
  );
}

// useCallback is ONLY useful when:
// 1. The function is passed to a memo'd child component
// 2. The function is a dependency of useEffect/useMemo
// 3. You need reference equality for other reasons

// ❌ UNNECESSARY: No memo'd children, no effect dependency
function SimpleForm() {
  const [value, setValue] = useState('');

  // Don't wrap this — it adds overhead with no benefit
  const handleChange = (e) =&gt; setValue(e.target.value);

  return <input onChange={handleChange} value={value} />;
}`}</code>
        </pre>
      </section>

      <section>
        <h2>React Compiler (React 19+)</h2>
        <p>
          The React Compiler (formerly React Forget) automatically memoizes components and hooks at build time,
          making manual <code>React.memo</code>, <code>useMemo</code>, and <code>useCallback</code> largely
          unnecessary. It analyzes your code and inserts memoization where beneficial.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// With React Compiler, you just write normal code:
function ProductList({ products, searchTerm }) {
  // Compiler automatically memoizes this computation
  const filtered = products.filter(p =&gt;
    p.name.includes(searchTerm)
  );

  // Compiler automatically memoizes child renders
  return filtered.map(p =&gt; <ProductCard key={p.id} product={p} />);
}

// No memo(), useMemo(), or useCallback() needed!
// The compiler handles it all at build time.

// babel.config.js — enable the compiler
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {}],
  ],
};`}</code>
        </pre>
      </section>

      <section>
        <h2>When NOT to Memoize</h2>
        <ul className="space-y-2">
          <li>
            <strong>Cheap components:</strong> If a component renders in {'&lt;'}1ms, memoization overhead
            (prop comparison) may cost more than just re-rendering.
          </li>
          <li>
            <strong>Props always change:</strong> If the component receives new object/array props on every
            render (inline objects, unstable references), memo comparison always fails — paying comparison
            cost for zero benefit.
          </li>
          <li>
            <strong>Simple primitives:</strong> <code>useMemo(() =&gt; a + b, [a, b])</code> is slower than
            just computing <code>a + b</code> directly. Only memoize expensive operations.
          </li>
          <li>
            <strong>Root-level components:</strong> Components that always re-render when state changes
            don't benefit from memo since they're the source of the re-render.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Inline objects break memo:</strong> <code>{'<Chart config={{ theme: "dark" }} />'}</code>
            creates a new object every render. Move constants outside the component or use useMemo.
          </li>
          <li>
            <strong>Inline callbacks break memo:</strong> <code>{'<Button onClick={() => save()} /&gt;'}</code>
            creates a new function every render. Use useCallback if Button is memoized.
          </li>
          <li>
            <strong>Premature memoization:</strong> Adding memo/useMemo everywhere "just in case" adds code
            complexity and memory overhead. Profile first, then memoize bottlenecks.
          </li>
          <li>
            <strong>Missing dependencies:</strong> Omitting dependencies from useMemo/useCallback creates
            stale closures — the memoized value uses outdated state.
          </li>
          <li>
            <strong>Memoizing inside the render:</strong> Creating memoized values inside a component that
            unmounts/remounts frequently wastes the cache on every mount.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            <code>React.memo</code> prevents re-renders by shallow-comparing props. Use for expensive components
            that receive stable props from parent re-renders.
          </li>
          <li>
            <code>useMemo</code> caches expensive computations (filtering, sorting, transformations). Only
            recalculates when dependencies change.
          </li>
          <li>
            <code>useCallback</code> stabilizes function references for memoized children and effect dependencies.
            Without it, new function references break <code>React.memo</code> comparisons.
          </li>
          <li>
            Don't memoize everything — the comparison itself has cost. Profile first, and only memoize components
            that are measurably expensive to re-render.
          </li>
          <li>
            The React Compiler (React 19+) automates memoization at build time, making manual memo/useMemo/useCallback
            largely unnecessary in new projects.
          </li>
          <li>
            Common mistake: passing inline objects or callbacks to memoized components defeats the purpose because
            the reference changes every render.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
