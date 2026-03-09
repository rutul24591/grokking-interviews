"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-memoization-react-memo-extensive",
  title: "Memoization and React.memo",
  description: "Comprehensive guide to memoization in React including React.memo, useMemo, useCallback, and the React Compiler.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "memoization-and-react-memo",
  version: "extensive",
  wordCount: 10800,
  readingTime: 43,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "react", "memoization", "React.memo", "useMemo", "useCallback"],
  relatedTopics: ["virtualization-windowing", "debouncing-and-throttling", "code-splitting"],
};

export default function MemoizationExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Memoization</strong> is a specific form of caching where the return value of a function is cached
          based on its arguments. If the function is called again with the same arguments, the cached result is
          returned instead of recomputing. The term was coined by Donald Michie in 1968, derived from the Latin
          word "memorandum" (to be remembered).
        </p>
        <p>
          In React, memoization addresses a fundamental characteristic of the rendering model: when a component's
          state changes, React re-renders that component <em>and all of its descendants</em>, regardless of whether
          their props changed. This is by design — React prioritizes correctness over performance, ensuring the UI
          always reflects the current state. But for expensive components, this default behavior can cause
          performance problems.
        </p>
        <p>
          React provides three memoization primitives: <code>React.memo</code> (memoize a component's render output
          based on its props), <code>useMemo</code> (memoize an expensive computation result), and
          <code>useCallback</code> (memoize a function reference). Together, they give developers fine-grained
          control over when components re-render and when expensive work is redone.
        </p>
        <p>
          With the introduction of the React Compiler in React 19, manual memoization is becoming less necessary.
          The compiler automatically analyzes your code and inserts memoization where it's beneficial — but
          understanding the underlying concepts remains essential for interviews and for working with existing
          codebases.
        </p>
      </section>

      <section>
        <h2>How React Re-Renders</h2>
        <p>
          Before understanding memoization, you need to understand React's re-render cascade.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A[State change in Parent] --> B[Parent re-renders]
    B --> C[Child A re-renders]
    B --> D[Child B re-renders]
    C --> E[Grandchild 1 re-renders]
    C --> F[Grandchild 2 re-renders]
    D --> G[Grandchild 3 re-renders]

    style A fill:#ff6b6b,color:#fff
    style B fill:#ffa94d,color:#fff
    style C fill:#ffa94d,color:#fff
    style D fill:#ffa94d,color:#fff
    style E fill:#ffa94d,color:#fff
    style F fill:#ffa94d,color:#fff
    style G fill:#ffa94d,color:#fff`}
          caption="Without memoization: a state change at the top triggers re-renders of ALL descendants"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Every component in this tree re-renders when count changes
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>

      {/* These ALL re-render on every click, even though
          their props haven't changed */}
      <ExpensiveChart data={chartData} />     {/* 50ms render */}
      <UserList users={users} />              {/* 30ms render */}
      <Sidebar items={navItems} />            {/* 20ms render */}
    </div>
  );
}

// Total: 100ms of wasted rendering on every click
// At 60fps, you only have 16ms per frame — this causes jank`}</code>
        </pre>

        <MermaidDiagram
          chart={`flowchart TD
    A[State change in Parent] --> B[Parent re-renders]
    B --> C["Child A (memo'd) — props unchanged"]
    B --> D["Child B (memo'd) — props unchanged"]
    C -.->|SKIPPED| E[Grandchild 1]
    C -.->|SKIPPED| F[Grandchild 2]
    D -.->|SKIPPED| G[Grandchild 3]

    style A fill:#ff6b6b,color:#fff
    style B fill:#ffa94d,color:#fff
    style C fill:#51cf66,color:#fff
    style D fill:#51cf66,color:#fff
    style E fill:#51cf66,color:#fff
    style F fill:#51cf66,color:#fff
    style G fill:#51cf66,color:#fff`}
          caption="With React.memo: children with unchanged props skip re-rendering entirely"
        />
      </section>

      <section>
        <h2>React.memo — Component Memoization</h2>
        <p>
          <code>React.memo</code> is a higher-order component that wraps a function component and memoizes its
          rendered output. On subsequent renders, React performs a shallow comparison of the new props against
          the previous props. If all props are equal (by reference for objects, by value for primitives), the
          component skips rendering and reuses the last rendered output.
        </p>

        <h3 className="mt-6 font-semibold">Basic Usage</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { memo } from 'react';

// Method 1: Wrap the component declaration
const ExpensiveChart = memo(function ExpensiveChart({ data, width, height }) {
  // This only runs when data, width, or height change (by reference)
  const processedData = heavyDataProcessing(data);

  return (
    <canvas width={width} height={height}>
      {renderChart(processedData)}
    </canvas>
  );
});

// Method 2: Wrap an existing component
function UserAvatar({ user, size }) {
  return (
    <img
      src={user.avatarUrl}
      alt={user.name}
      width={size}
      height={size}
      className="rounded-full"
    />
  );
}
const MemoizedAvatar = memo(UserAvatar);

// Method 3: Arrow function (less common)
const ProductCard = memo(({ product, onAddToCart }) => {
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p>\${product.price}</p>
      <button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </button>
    </div>
  );
});`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Shallow Comparison Deep Dive</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// React.memo does SHALLOW comparison (Object.is for each prop)

// Primitives: compared by value ✅
<MemoizedComponent
  name="Alice"      // string — stable ✅
  count={42}        // number — stable ✅
  isActive={true}   // boolean — stable ✅
/>

// Objects: compared by REFERENCE ❌ (usually)
<MemoizedComponent
  // ❌ New object every render — memo always re-renders
  config={{ theme: 'dark', size: 'large' }}

  // ❌ New array every render
  items={products.filter(p => p.inStock)}

  // ❌ New function every render
  onClick={() => handleClick(id)}
/>

// Solutions for stable references:
function Parent() {
  // ✅ Stable object (defined outside or useMemo)
  const config = useMemo(() => ({ theme: 'dark', size: 'large' }), []);

  // ✅ Stable array (only changes when products change)
  const inStockProducts = useMemo(
    () => products.filter(p => p.inStock),
    [products]
  );

  // ✅ Stable function reference
  const handleClick = useCallback((id) => {
    setSelected(id);
  }, []);

  return (
    <MemoizedComponent
      config={config}
      items={inStockProducts}
      onClick={handleClick}
    />
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Custom Comparison Function</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Second argument to memo: custom comparison function
// Return true = props are equal (skip re-render)
// Return false = props changed (re-render)

const HeavyTable = memo(
  function HeavyTable({ rows, columns, onSort, selectedIds }) {
    return (
      <table>
        {rows.map(row => (
          <tr key={row.id} className={selectedIds.has(row.id) ? 'selected' : ''}>
            {columns.map(col => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </table>
    );
  },
  (prevProps, nextProps) => {
    // Deep compare only what matters
    return (
      prevProps.rows === nextProps.rows &&
      prevProps.columns === nextProps.columns &&
      // Deep compare selectedIds (Set doesn't have reference stability)
      prevProps.selectedIds.size === nextProps.selectedIds.size &&
      [...prevProps.selectedIds].every(id => nextProps.selectedIds.has(id))
      // Intentionally ignore onSort — we know it's stable
    );
  }
);

// ⚠️ Custom comparisons are error-prone:
// - Missing a prop comparison means stale renders
// - Deep comparisons can be expensive (defeating the purpose)
// - Usually better to fix prop stability upstream`}</code>
        </pre>
      </section>

      <section>
        <h2>useMemo — Computation Memoization</h2>
        <p>
          <code>useMemo</code> caches the result of an expensive computation. It takes a factory function and a
          dependency array. The factory only re-executes when one of the dependencies changes (compared with
          <code>Object.is</code>).
        </p>

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useMemo } from 'react';

// === Expensive data transformations ===
function AnalyticsDashboard({ events, dateRange, groupBy }) {
  // Without useMemo: runs on EVERY render (even unrelated state changes)
  // With useMemo: only recalculates when events, dateRange, or groupBy change

  const processedData = useMemo(() => {
    console.log('Processing events...'); // Only logs when deps change

    const filtered = events.filter(e =>
      e.timestamp >= dateRange.start && e.timestamp <= dateRange.end
    );

    const grouped = Object.groupBy(filtered, e => e[groupBy]);

    return Object.entries(grouped).map(([key, items]) => ({
      label: key,
      count: items.length,
      total: items.reduce((sum, e) => sum + e.value, 0),
      average: items.reduce((sum, e) => sum + e.value, 0) / items.length,
    }));
  }, [events, dateRange, groupBy]);

  return <Chart data={processedData} />;
}

// === Creating derived data structures ===
function UserDirectory({ users }) {
  // Build a lookup map — O(n) once instead of O(n) per lookup
  const userById = useMemo(() => {
    return new Map(users.map(u => [u.id, u]));
  }, [users]);

  // Build search index
  const searchIndex = useMemo(() => {
    return users.map(u => ({
      id: u.id,
      searchText: \`\${u.name} \${u.email} \${u.department}\`.toLowerCase(),
    }));
  }, [users]);

  const handleLookup = (id) => {
    return userById.get(id); // O(1) instead of O(n)
  };
}

// === Stabilizing object references for child props ===
function Parent({ theme, locale }) {
  // Without useMemo: new object every render breaks child memo
  // With useMemo: stable reference unless theme or locale change
  const contextValue = useMemo(() => ({
    theme,
    locale,
    colors: getThemeColors(theme),
    formatters: getFormatters(locale),
  }), [theme, locale]);

  return (
    <AppContext.Provider value={contextValue}>
      <MemoizedApp />
    </AppContext.Provider>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">When useMemo Is Worth It</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Scenario</th>
              <th className="p-3 text-left">useMemo?</th>
              <th className="p-3 text-left">Why</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Filtering 10,000 items</td>
              <td className="p-3">✅ Yes</td>
              <td className="p-3">O(n) work on every render adds up</td>
            </tr>
            <tr>
              <td className="p-3">Sorting a large array</td>
              <td className="p-3">✅ Yes</td>
              <td className="p-3">O(n log n) is expensive to repeat</td>
            </tr>
            <tr>
              <td className="p-3">Building a Map/Set from array</td>
              <td className="p-3">✅ Yes</td>
              <td className="p-3">Data structure creation is O(n)</td>
            </tr>
            <tr>
              <td className="p-3">Context provider value</td>
              <td className="p-3">✅ Yes</td>
              <td className="p-3">Prevents re-render of all consumers</td>
            </tr>
            <tr>
              <td className="p-3"><code>a + b</code></td>
              <td className="p-3">❌ No</td>
              <td className="p-3">Cheaper than the hook overhead</td>
            </tr>
            <tr>
              <td className="p-3">String concatenation</td>
              <td className="p-3">❌ No</td>
              <td className="p-3">Trivial computation</td>
            </tr>
            <tr>
              <td className="p-3">JSX creation</td>
              <td className="p-3">❌ Usually no</td>
              <td className="p-3">React is fast at creating elements</td>
            </tr>
            <tr>
              <td className="p-3">Filtering 20 items</td>
              <td className="p-3">❌ No</td>
              <td className="p-3">Too fast to matter</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>useCallback — Function Reference Memoization</h2>
        <p>
          <code>useCallback</code> returns a memoized version of a callback function. It's syntactic sugar for
          <code>useMemo(() =&gt; fn, deps)</code>. Its primary purpose is stabilizing function references so that
          memoized children don't re-render unnecessarily.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useCallback, memo, useState } from 'react';

// === The problem useCallback solves ===
const MemoizedButton = memo(function Button({ onClick, label }) {
  console.log(\`Rendering: \${label}\`);
  return <button onClick={onClick}>{label}</button>;
});

function Toolbar() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // ❌ Without useCallback: every time count or name changes,
  // handleSave is a NEW function → MemoizedButton re-renders
  const handleSave = () => {
    apiSave({ count, name });
  };

  // ✅ With useCallback: function reference stays stable
  // unless count or name change
  const handleSave = useCallback(() => {
    apiSave({ count, name });
  }, [count, name]);

  // ✅ Even better: use functional updaters to reduce deps
  const handleIncrement = useCallback(() => {
    setCount(c => c + 1); // No dependency on count!
  }, []); // Empty deps = never changes

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <MemoizedButton onClick={handleSave} label="Save" />
      <MemoizedButton onClick={handleIncrement} label="+1" />
    </div>
  );
}

// === useCallback with event handlers ===
function List({ items, onItemClick }) {
  // ❌ BAD: New function per item per render
  return items.map(item => (
    <MemoizedItem
      key={item.id}
      item={item}
      onClick={() => onItemClick(item.id)} // New function every render!
    />
  ));
}

// ✅ GOOD: Single stable handler, item passes its own ID
function List({ items, onItemClick }) {
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return items.map(item => (
    <MemoizedItem
      key={item.id}
      item={item}
      onClick={handleClick} // Same reference for all items
    />
  ));
}

// MemoizedItem calls onClick(item.id) internally
const MemoizedItem = memo(function Item({ item, onClick }) {
  return (
    <div onClick={() => onClick(item.id)}>
      {item.name}
    </div>
  );
});`}</code>
        </pre>
      </section>

      <section>
        <h2>React Compiler (React 19+)</h2>
        <p>
          The React Compiler (formerly React Forget) is a build-time tool that automatically adds memoization
          to your components. It analyzes your code, understands which values change between renders, and
          inserts the equivalent of memo, useMemo, and useCallback automatically.
        </p>

        <MermaidDiagram
          chart={`flowchart LR
    subgraph Before Compiler
        A[Write code with<br/>manual memo/useMemo/useCallback] --> B[Complex code<br/>with dependency arrays]
    end

    subgraph With React Compiler
        C[Write plain React code] --> D[Compiler adds<br/>memoization at build time]
        D --> E[Optimized code<br/>without manual effort]
    end`}
          caption="React Compiler eliminates the need for manual memoization"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === What you write (with React Compiler) ===
function TodoList({ todos, filter }) {
  const filteredTodos = todos.filter(t =>
    filter === 'all' ? true : t.completed === (filter === 'completed')
  );

  return (
    <ul>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function TodoItem({ todo }) {
  return (
    <li style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      {todo.text}
    </li>
  );
}

// The compiler automatically:
// 1. Memoizes filteredTodos (equivalent to useMemo)
// 2. Memoizes TodoItem render (equivalent to React.memo)
// 3. Handles stable references for inline styles

// === Setup ===
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Options
    }],
  ],
};

// next.config.js (Next.js 15+)
module.exports = {
  experimental: {
    reactCompiler: true,
  },
};

// === Rules of React the compiler enforces ===
// The compiler requires your code follows the Rules of React:
// 1. Components must be pure (same props → same output)
// 2. Hooks must be called at the top level
// 3. No mutating props, state, or context
// 4. Hook dependencies must be correct

// The compiler will skip optimizing code that breaks these rules
// and emit warnings during build.`}</code>
        </pre>
      </section>

      <section>
        <h2>Patterns & Anti-Patterns</h2>

        <h3 className="mt-4 font-semibold">Pattern: Lifting Content Up</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Instead of memoizing, restructure to avoid unnecessary re-renders

// ❌ Problem: ExpensiveTree re-renders on every count change
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveTree />  {/* Re-renders every time! */}
    </div>
  );
}

// ✅ Solution 1: Move state down
function App() {
  return (
    <div>
      <Counter />         {/* Only this re-renders */}
      <ExpensiveTree />   {/* Never re-renders! */}
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}

// ✅ Solution 2: Lift content up (children pattern)
function CounterWrapper({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {children}  {/* Same JSX reference — doesn't re-render */}
    </div>
  );
}

function App() {
  return (
    <CounterWrapper>
      <ExpensiveTree />  {/* Stable JSX, never re-renders */}
    </CounterWrapper>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Pattern: Context with Selective Subscriptions</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ❌ Problem: All consumers re-render when ANY context value changes
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);

  // Every state change re-renders ALL consumers
  const value = { user, setUser, theme, setTheme, notifications, setNotifications };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ✅ Solution: Split contexts by change frequency
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

// Each context only triggers re-renders in its consumers

// ✅ Also: memoize context values
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const value = useMemo(() => ({
    theme,
    setTheme,
    colors: getThemeColors(theme),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Profiling & Measuring</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === React DevTools Profiler ===
// 1. Open React DevTools → Profiler tab
// 2. Click Record → interact with your app → Stop
// 3. Look for:
//    - Components with frequent re-renders (orange/red)
//    - Components with long render times
//    - Gray components = skipped (memo worked!)

// === why-did-you-render library ===
// Tracks unnecessary re-renders in development
// Install: pnpm add @welldone-software/why-did-you-render --save-dev

// wdyr.js (import before React)
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

// Mark specific components
MyComponent.whyDidYouRender = true;

// Console output:
// "MyComponent re-rendered because props.data changed"
// Shows old vs new value, and whether it was a reference change

// === Performance.mark for timing ===
function ExpensiveComponent({ data }) {
  performance.mark('render-start');

  const result = expensiveComputation(data);

  useEffect(() => {
    performance.mark('render-end');
    performance.measure('ExpensiveComponent render',
      'render-start', 'render-end');

    const measure = performance.getEntriesByName(
      'ExpensiveComponent render'
    ).pop();
    console.log(\`Render time: \${measure.duration.toFixed(2)}ms\`);
  });

  return <div>{result}</div>;
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Memoizing everything:</strong> Adding memo/useMemo/useCallback to every component and value
            creates a "memo tax" — additional memory for cached values, comparison overhead on every render, and
            code complexity. Profile first, optimize the actual bottlenecks.
          </li>
          <li>
            <strong>Inline objects/functions defeating memo:</strong> <code>{'<MemoChild style={{ color: "red" }} />'}</code>
            creates a new object every render, so memo's shallow comparison always returns false. Move constant
            objects outside the component or wrap them in useMemo.
          </li>
          <li>
            <strong>Missing dependencies:</strong> Omitting a dependency from useMemo/useCallback creates a stale
            closure — the memoized value captures an old version of the dependency. This causes subtle bugs where
            the UI shows stale data.
          </li>
          <li>
            <strong>Over-memoizing trivial operations:</strong> <code>useMemo(() =&gt; items.length, [items])</code>
            is more expensive than just <code>items.length</code>. The hook has overhead — comparison, cache storage,
            garbage collection of old values.
          </li>
          <li>
            <strong>Not memoizing context values:</strong> A context provider that passes a new object on every
            render (<code>value={'{{ user, theme }}'}</code>) causes ALL consumers to re-render. Always useMemo
            the context value.
          </li>
          <li>
            <strong>useCallback without memo'd consumer:</strong> <code>useCallback</code> is pointless if the
            child component isn't wrapped in React.memo. The stable reference doesn't help if the child
            re-renders anyway.
          </li>
          <li>
            <strong>Relying on memo for correctness:</strong> Memo is an optimization hint, not a guarantee.
            React may discard cached values under memory pressure. Your code must be correct even without memoization.
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Profile before memoizing:</strong> Use React DevTools Profiler to identify actual bottlenecks.
            Most components render in {'<'}1ms — memoizing them adds complexity for no benefit.
          </li>
          <li>
            <strong>Use React.memo for expensive components:</strong> Components that render large lists, complex
            visualizations, or perform heavy computations during render are prime candidates.
          </li>
          <li>
            <strong>useMemo for expensive computations:</strong> Filtering/sorting large arrays, building data
            structures, and creating context values. Skip for trivial operations.
          </li>
          <li>
            <strong>useCallback paired with memo:</strong> Only use useCallback when passing functions to
            memoized child components or as effect dependencies. It's useless otherwise.
          </li>
          <li>
            <strong>Stabilize prop references:</strong> Move constant objects outside components, use useMemo
            for derived objects, and useCallback for event handlers passed to memo'd children.
          </li>
          <li>
            <strong>Prefer structural solutions:</strong> Moving state down, lifting content up, and splitting
            contexts are often better than adding memo — they eliminate the problem rather than caching around it.
          </li>
          <li>
            <strong>Adopt the React Compiler:</strong> For new projects on React 19+, the compiler handles
            memoization automatically. Write plain code and let the compiler optimize.
          </li>
          <li>
            <strong>Don't memoize for correctness:</strong> React may drop cached values. Memoization is an
            optimization — your component must produce correct output regardless.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            React re-renders a component and all its children when state changes — regardless of whether child
            props changed. <code>React.memo</code> skips re-render via shallow prop comparison.
          </li>
          <li>
            <code>useMemo</code> caches expensive computation results. <code>useCallback</code> caches function
            references. Both recalculate only when dependencies change.
          </li>
          <li>
            useCallback is only useful when paired with React.memo on the child or as an effect dependency.
            Without a memo'd consumer, stable references don't prevent re-renders.
          </li>
          <li>
            Inline objects and functions (<code>{'style={{ color: "red" }}'}</code>) defeat React.memo because
            they create new references every render. Fix with useMemo/useCallback or constant extraction.
          </li>
          <li>
            Don't memoize everything — profile first. Most components render in {'<'}1ms. Memoization has its
            own cost: memory, comparison overhead, and code complexity.
          </li>
          <li>
            Structural solutions (moving state down, children pattern, context splitting) often eliminate the need
            for memoization entirely — they're preferable when applicable.
          </li>
          <li>
            The React Compiler (React 19+) automatically inserts memoization at build time, making manual
            memo/useMemo/useCallback largely unnecessary for new codebases.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://react.dev/reference/react/memo" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation — React.memo
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/useMemo" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation — useMemo
            </a>
          </li>
          <li>
            <a href="https://react.dev/reference/react/useCallback" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation — useCallback
            </a>
          </li>
          <li>
            <a href="https://react.dev/learn/react-compiler" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation — React Compiler
            </a>
          </li>
          <li>
            <a href="https://kentcdodds.com/blog/usememo-and-usecallback" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Kent C. Dodds — When to useMemo and useCallback
            </a>
          </li>
          <li>
            <a href="https://overreacted.io/before-you-memo/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Dan Abramov — Before You memo()
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
