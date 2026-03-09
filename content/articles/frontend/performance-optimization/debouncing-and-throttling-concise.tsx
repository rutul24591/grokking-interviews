"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-debouncing-throttling-concise",
  title: "Debouncing and Throttling",
  description: "Quick overview of debouncing and throttling techniques for controlling event frequency in frontend applications.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "debouncing-and-throttling",
  version: "concise",
  wordCount: 2800,
  readingTime: 11,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "debounce", "throttle", "events", "optimization"],
  relatedTopics: ["memoization-and-react-memo", "request-deduplication", "web-vitals"],
};

export default function DebouncingThrottlingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Debouncing</strong> and <strong>throttling</strong> are rate-limiting techniques that control how
          often a function executes in response to frequent events. Without them, events like scrolling (fires
          60+ times/second), typing (fires on every keystroke), or window resizing (fires continuously) can
          trigger expensive operations hundreds of times per second — causing jank, excessive API calls, and
          wasted computation.
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Debounce:</strong> Wait until the event <em>stops firing</em> for a specified delay, then
            execute once. Like an elevator door — it waits for people to stop entering before closing.
          </li>
          <li>
            <strong>Throttle:</strong> Execute at most once per specified interval, no matter how often the event
            fires. Like a train schedule — it runs at fixed intervals regardless of passengers arriving.
          </li>
        </ul>
      </section>

      <section>
        <h2>Debouncing</h2>
        <p>
          Debounce delays execution until the event stops firing for a specified period. Each new event resets
          the timer. The function only executes once — after the "quiet period."
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Implementation from scratch ===
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// === React hook ===
import { useState, useEffect, useRef, useCallback } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// === Usage: Search input ===
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      fetchSearchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

// User types "react hooks" quickly:
// Keystrokes: r → re → rea → reac → react → react  → react h → ...
// API calls:  (none until 300ms after last keystroke)
// Result: 1 API call with "react hooks" instead of 11`}</code>
        </pre>

        <p className="mt-4"><strong>Best use cases:</strong></p>
        <ul className="space-y-1">
          <li>Search/autocomplete inputs (wait for user to finish typing)</li>
          <li>Form auto-save (save after user stops editing)</li>
          <li>Window resize handlers (recalculate layout after resize stops)</li>
          <li>API calls triggered by user input</li>
        </ul>
      </section>

      <section>
        <h2>Throttling</h2>
        <p>
          Throttle ensures a function executes at most once per specified interval. Unlike debounce, it fires
          at regular intervals during continuous events — so the user gets feedback while they're interacting.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Implementation from scratch ===
function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// === React hook ===
function useThrottle(value, interval) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdated.current >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdated.current));
      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

// === Usage: Scroll position tracking ===
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollY(window.scrollY);
    }, 100); // Update at most every 100ms (10 times/sec)

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <ProgressBar progress={scrollY / maxScroll} />;
}

// Scroll fires ~60 events/sec → throttle reduces to 10/sec
// User still sees smooth progress bar updates`}</code>
        </pre>

        <p className="mt-4"><strong>Best use cases:</strong></p>
        <ul className="space-y-1">
          <li>Scroll handlers (infinite scroll, parallax, progress bars)</li>
          <li>Mouse move handlers (tooltips, drag and drop)</li>
          <li>Real-time updates (analytics events, position tracking)</li>
          <li>API polling rate limiting</li>
        </ul>
      </section>

      <section>
        <h2>When to Use Which</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Scenario</th>
              <th className="p-3 text-left">Debounce</th>
              <th className="p-3 text-left">Throttle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Search input</td>
              <td className="p-3">✅ Wait for typing to stop</td>
              <td className="p-3">—</td>
            </tr>
            <tr>
              <td className="p-3">Window resize</td>
              <td className="p-3">✅ Recalculate after resize stops</td>
              <td className="p-3">—</td>
            </tr>
            <tr>
              <td className="p-3">Auto-save form</td>
              <td className="p-3">✅ Save after editing stops</td>
              <td className="p-3">—</td>
            </tr>
            <tr>
              <td className="p-3">Scroll position</td>
              <td className="p-3">—</td>
              <td className="p-3">✅ Regular updates while scrolling</td>
            </tr>
            <tr>
              <td className="p-3">Mouse move tracking</td>
              <td className="p-3">—</td>
              <td className="p-3">✅ Smooth updates during movement</td>
            </tr>
            <tr>
              <td className="p-3">Button click (prevent double)</td>
              <td className="p-3">—</td>
              <td className="p-3">✅ Allow one click per interval</td>
            </tr>
            <tr>
              <td className="p-3">Analytics events</td>
              <td className="p-3">—</td>
              <td className="p-3">✅ Rate-limit event batching</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4">
          <strong>Rule of thumb:</strong> Use <strong>debounce</strong> when you want the final value (after
          activity stops). Use <strong>throttle</strong> when you want regular updates during ongoing activity.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Creating new debounced functions each render:</strong> Defining the debounced function inside
            the component body creates a new instance every render, losing the timer. Use useRef or define it
            outside the component.
          </li>
          <li>
            <strong>Too long a delay:</strong> A 1000ms debounce on search feels unresponsive. 150-300ms is the
            sweet spot for search; 500-1000ms for auto-save.
          </li>
          <li>
            <strong>Not canceling on unmount:</strong> Debounced timers can fire after the component unmounts,
            causing state updates on unmounted components. Always clean up in useEffect.
          </li>
          <li>
            <strong>Using debounce where throttle is needed:</strong> Debouncing a scroll handler means no
            updates while scrolling — the user sees nothing until they stop. Throttle is correct for
            continuous feedback.
          </li>
          <li>
            <strong>Not using passive event listeners:</strong> Scroll and touch handlers should use
            <code>{'{ passive: true }'}</code> to avoid blocking scrolling.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            <strong>Debounce</strong> waits for activity to stop, then executes once. Best for: search input,
            auto-save, resize handlers. Delay: 150-300ms for search, 500-1000ms for save.
          </li>
          <li>
            <strong>Throttle</strong> executes at regular intervals during activity. Best for: scroll handlers,
            mouse tracking, real-time updates. Interval: 50-200ms.
          </li>
          <li>
            Implementation: debounce uses <code>clearTimeout</code>/<code>setTimeout</code>; throttle tracks
            last execution time and uses a time-based gate.
          </li>
          <li>
            In React, use custom hooks (<code>useDebounce</code>, <code>useThrottle</code>) that handle
            cleanup on unmount and maintain stable references.
          </li>
          <li>
            Key distinction: debounce gives you the <em>final</em> value after a burst; throttle gives you
            <em>regular samples</em> during a burst.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
