"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-debouncing-throttling-extensive",
  title: "Debouncing and Throttling",
  description: "Comprehensive guide to debouncing and throttling techniques for controlling event frequency, with implementations from scratch, React hooks, AbortController integration, and real-world patterns.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "debouncing-and-throttling",
  version: "extensive",
  wordCount: 10500,
  readingTime: 42,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "debounce", "throttle", "events", "optimization", "react-hooks", "rate-limiting"],
  relatedTopics: ["memoization-and-react-memo", "web-vitals", "virtualization-windowing"],
};

export default function DebouncingThrottlingExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Debouncing</strong> and <strong>throttling</strong> are rate-limiting techniques that control how
          frequently a function executes in response to rapidly firing events. They are foundational tools in the
          frontend performance toolkit, addressing one of the most common sources of wasted computation: high-frequency
          browser events triggering expensive operations on every firing.
        </p>
        <p>
          The concepts originate from electronics and signal processing. In electrical engineering, a "debounce" circuit
          filters out the rapid on/off transitions (bouncing) that occur when a mechanical switch is pressed — ensuring
          the signal registers as a single clean press rather than multiple noisy pulses. Similarly, a "throttle"
          controls flow rate, derived from the throttle valve in engines that regulates how much fuel enters the
          combustion chamber per unit time.
        </p>
        <p>
          These metaphors translate directly to software. Consider what happens when a user types "react hooks" into
          a search box: the <code>input</code> event fires 11 times (once per character including the space). Without
          rate limiting, each keystroke triggers an API call — 11 network requests for a single query, 10 of which are
          immediately obsolete. At scale, this wastes server resources, increases costs, and can degrade the user
          experience through UI flicker as outdated results briefly appear.
        </p>
        <p>
          Browser events like <code>scroll</code>, <code>resize</code>, <code>mousemove</code>, and <code>pointermove</code>{" "}
          fire at the display refresh rate — typically 60 times per second (every ~16.67ms). A scroll handler that
          recalculates layout or queries the DOM on every event execution causes the browser to spend its frame budget
          on JavaScript rather than painting, resulting in dropped frames and visible jank. Debouncing and throttling
          provide the mechanism to reconcile the frequency of browser events with the actual rate at which meaningful
          work needs to happen.
        </p>

        <MermaidDiagram
          chart={`flowchart LR
    A["Browser Events<br/>(60+ per second)"] --> B{"Rate Limiter"}
    B -->|Debounce| C["Execute once<br/>after activity stops"]
    B -->|Throttle| D["Execute at fixed<br/>intervals during activity"]
    B -->|None| E["Execute on<br/>every single event"]

    style A fill:#ff6b6b,color:#fff
    style B fill:#339af0,color:#fff
    style C fill:#51cf66,color:#fff
    style D fill:#51cf66,color:#fff
    style E fill:#ffa94d,color:#fff`}
          caption="Rate-limiting strategies: debounce waits for silence, throttle enforces intervals, no limiter fires on every event"
        />
      </section>

      <section>
        <h2>Visual Timeline: Debounce vs Throttle</h2>
        <p>
          Understanding the difference between debounce and throttle is best illustrated with timelines. Consider a
          user typing characters over a period of time, where each vertical bar represents an event firing:
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant U as User Events
    participant D as Debounce (300ms)
    participant T as Throttle (300ms)

    Note over U: Events fire rapidly
    U->>D: Event 1 (t=0ms)
    U->>T: Event 1 (t=0ms)
    Note over T: Execute immediately
    T-->>T: fn() fires

    U->>D: Event 2 (t=100ms)
    U->>T: Event 2 (t=100ms)
    Note over D: Timer reset
    Note over T: Suppressed (within 300ms)

    U->>D: Event 3 (t=200ms)
    U->>T: Event 3 (t=200ms)
    Note over D: Timer reset
    Note over T: Suppressed

    U->>D: Event 4 (t=350ms)
    U->>T: Event 4 (t=350ms)
    Note over D: Timer reset
    Note over T: Execute (300ms elapsed)
    T-->>T: fn() fires

    U->>D: Event 5 (t=500ms)
    U->>T: Event 5 (t=500ms)
    Note over D: Timer reset
    Note over T: Suppressed

    Note over U: User stops (pause > 300ms)

    Note over D: 300ms silence elapsed
    D-->>D: fn() fires once

    Note over T: 650ms — Execute trailing
    T-->>T: fn() fires`}
          caption="Debounce fires once after the last event plus delay. Throttle fires at regular intervals throughout the burst."
        />

        <p>
          The key distinction: <strong>debounce</strong> collapses a burst of events into a single execution at the
          end (or beginning) of the burst. <strong>Throttle</strong> samples the burst at regular intervals, providing
          periodic updates throughout the activity. This fundamental difference dictates which technique to use in any
          given scenario.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A{"Do you need updates<br/>DURING the activity?"} -->|Yes| B["Use Throttle<br/>(scroll, drag, resize feedback)"]
    A -->|No, only the final result| C{"Does the user expect<br/>immediate feedback?"}
    C -->|Yes| D["Use Leading-Edge Debounce<br/>(button clicks, first keystroke)"]
    C -->|No, final value is fine| E["Use Trailing-Edge Debounce<br/>(search input, auto-save)"]

    style A fill:#339af0,color:#fff
    style B fill:#51cf66,color:#fff
    style C fill:#339af0,color:#fff
    style D fill:#ffa94d,color:#fff
    style E fill:#51cf66,color:#fff`}
          caption="Decision tree for choosing the right rate-limiting strategy"
        />
      </section>

      <section>
        <h2>Debouncing: Implementation from Scratch</h2>
        <p>
          A debounce function works by delaying execution until a quiet period has elapsed. Every time the debounced
          function is called, any pending timer is cleared and a new one is set. The underlying function only executes
          when no new calls arrive within the delay window.
        </p>

        <h3 className="mt-6 font-semibold">Trailing-Edge Debounce (Default)</h3>
        <p>
          The most common variant. The function fires <em>after</em> the delay has elapsed since the last invocation.
          This is the default behavior of lodash's <code>_.debounce</code> and the one most people mean when they
          say "debounce."
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Trailing-edge debounce — fires AFTER the quiet period
function debounce(fn, delay) {
  let timeoutId = null;

  function debounced(...args) {
    // Clear any pending execution
    clearTimeout(timeoutId);

    // Schedule new execution after delay
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  }

  // Allow manual cancellation
  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  // Check if a call is pending
  debounced.pending = () => timeoutId !== null;

  return debounced;
}

// Usage
const handleSearch = debounce((query) => {
  fetch(\`/api/search?q=\${encodeURIComponent(query)}\`);
}, 300);

input.addEventListener('input', (e) => handleSearch(e.target.value));

// On component teardown:
handleSearch.cancel();`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Leading-Edge Debounce</h3>
        <p>
          Fires on the <em>first</em> call, then ignores subsequent calls until the quiet period elapses. This is
          useful when you want immediate feedback on the first interaction but want to suppress rapid repeated
          actions — like preventing double-clicks on a submit button.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Leading-edge debounce — fires on the FIRST call, then suppresses
function debounceLeading(fn, delay) {
  let timeoutId = null;

  function debounced(...args) {
    const shouldCallImmediately = timeoutId === null;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, delay);

    if (shouldCallImmediately) {
      fn.apply(this, args);
    }
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  return debounced;
}

// Fires immediately on first click, ignores clicks for 500ms after
const handleSubmit = debounceLeading((formData) => {
  submitOrder(formData);
}, 500);`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Both Edges: Leading + Trailing</h3>
        <p>
          Some scenarios benefit from firing on both edges — immediately on the first call AND once more after the
          burst ends. This is what lodash provides with <code>{'{ leading: true, trailing: true }'}</code>.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Combined leading + trailing debounce
function debounceBoth(fn, delay) {
  let timeoutId = null;
  let lastArgs = null;

  function debounced(...args) {
    lastArgs = args;
    const shouldCallImmediately = timeoutId === null;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      // Fire trailing edge only if there were calls after the leading edge
      if (!shouldCallImmediately && lastArgs) {
        fn.apply(this, lastArgs);
      }
      timeoutId = null;
      lastArgs = null;
    }, delay);

    if (shouldCallImmediately) {
      fn.apply(this, args);
    }
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastArgs = null;
  };

  return debounced;
}

// Example: tooltip that shows immediately and updates position after movement stops
const updateTooltipPosition = debounceBoth((x, y) => {
  tooltip.style.transform = \`translate(\${x}px, \${y}px)\`;
}, 150);`}</code>
        </pre>
      </section>

      <section>
        <h2>Throttling: Implementation from Scratch</h2>
        <p>
          A throttle function ensures a function executes at most once per specified interval. Unlike debounce,
          throttle guarantees regular execution during continuous events, making it ideal for scenarios where the
          user needs periodic visual feedback.
        </p>

        <h3 className="mt-6 font-semibold">Timestamp-Based Throttle</h3>
        <p>
          The simplest approach: track the last execution time and only allow execution when the interval has passed.
          This fires on the leading edge (immediately on first call).
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Timestamp-based throttle — leading edge only
function throttle(fn, interval) {
  let lastTime = 0;

  function throttled(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  }

  throttled.cancel = () => {
    lastTime = 0;
  };

  return throttled;
}

// Fires immediately, then at most once per 200ms
const handleScroll = throttle(() => {
  updateProgressBar(window.scrollY);
}, 200);`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Throttle with Trailing Edge</h3>
        <p>
          The timestamp-only approach has a problem: the last event in a burst may be dropped if it arrives before
          the interval elapses. A more complete throttle includes a trailing call to ensure the final value is
          always processed.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Complete throttle with leading + trailing edges
function throttle(fn, interval, options = {}) {
  const { leading = true, trailing = true } = options;
  let lastTime = 0;
  let timeoutId = null;
  let lastArgs = null;
  let lastContext = null;

  function invoke() {
    fn.apply(lastContext, lastArgs);
    lastTime = Date.now();
    timeoutId = null;
    lastArgs = null;
    lastContext = null;
  }

  function throttled(...args) {
    const now = Date.now();
    const elapsed = now - lastTime;
    lastArgs = args;
    lastContext = this;

    // Leading edge: fire immediately if interval has passed
    if (elapsed >= interval) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (leading) {
        invoke();
      } else {
        lastTime = now;
      }
    }

    // Trailing edge: schedule execution for end of interval
    if (trailing && !timeoutId) {
      timeoutId = setTimeout(() => {
        invoke();
      }, interval - elapsed);
    }
  }

  throttled.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastTime = 0;
    lastArgs = null;
    lastContext = null;
  };

  return throttled;
}

// Usage: scroll handler that fires immediately and catches the last position
const handleScroll = throttle(() => {
  const scrollPercent = window.scrollY / (
    document.documentElement.scrollHeight - window.innerHeight
  );
  updateProgressBar(scrollPercent);
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });`}</code>
        </pre>
      </section>

      <section>
        <h2>requestAnimationFrame Throttle</h2>
        <p>
          For visual updates (animations, layout recalculations, canvas drawing), throttling to an arbitrary interval
          like 100ms or 200ms is suboptimal. The browser already has a built-in mechanism for scheduling visual
          updates: <code>requestAnimationFrame</code> (rAF). Using rAF as a throttle mechanism aligns your updates
          with the browser's paint cycle, ensuring smooth 60fps performance without over- or under-sampling.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Throttle using requestAnimationFrame — syncs with browser paint cycle
function throttleRAF(fn) {
  let frameId = null;
  let lastArgs = null;

  function throttled(...args) {
    lastArgs = args;

    if (frameId === null) {
      frameId = requestAnimationFrame(() => {
        fn.apply(this, lastArgs);
        frameId = null;
        lastArgs = null;
      });
    }
  }

  throttled.cancel = () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
      lastArgs = null;
    }
  };

  return throttled;
}

// Perfect for visual updates — runs at monitor refresh rate (typically 60fps)
const handleMouseMove = throttleRAF((e) => {
  cursor.style.transform = \`translate(\${e.clientX}px, \${e.clientY}px)\`;
});

document.addEventListener('mousemove', handleMouseMove);

// Also great for scroll-linked animations
const handleParallax = throttleRAF(() => {
  const scrollY = window.scrollY;
  hero.style.transform = \`translateY(\${scrollY * 0.5}px)\`;
  clouds.style.transform = \`translateY(\${scrollY * 0.3}px)\`;
});

window.addEventListener('scroll', handleParallax, { passive: true });`}</code>
        </pre>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant E as Events (mousemove)
    participant R as rAF Throttle
    participant B as Browser Paint

    Note over B: Frame 1 (0ms)
    E->>R: mousemove (0ms)
    R->>B: requestAnimationFrame
    E->>R: mousemove (2ms)
    Note over R: Already scheduled, skip
    E->>R: mousemove (5ms)
    Note over R: Update lastArgs only
    B-->>B: Paint with latest args

    Note over B: Frame 2 (16.67ms)
    E->>R: mousemove (17ms)
    R->>B: requestAnimationFrame
    E->>R: mousemove (20ms)
    Note over R: Update lastArgs only
    E->>R: mousemove (25ms)
    Note over R: Update lastArgs only
    B-->>B: Paint with latest args

    Note over B: Frame 3 (33.33ms)
    E->>R: mousemove (34ms)
    R->>B: requestAnimationFrame
    B-->>B: Paint with latest args`}
          caption="rAF throttle: multiple events per frame are collapsed into a single paint-aligned update"
        />

        <p>
          The key advantage of rAF throttling over fixed-interval throttling for visual work: it automatically
          adapts to the device's refresh rate. On a 120Hz display, it runs 120 times per second; on a 60Hz display,
          60 times per second. A fixed 16ms throttle would over-fire on 60Hz and under-fire on 120Hz.
        </p>
      </section>

      <section>
        <h2>React Hooks for Debounce and Throttle</h2>
        <p>
          In React, using debounce and throttle correctly requires careful handling of component lifecycles,
          closures, and stable references. Naive implementations that create new debounced functions on every render
          are one of the most common bugs in React applications.
        </p>

        <h3 className="mt-6 font-semibold">useDebounce: Debounced Value Hook</h3>
        <p>
          The simplest pattern: debounce a <em>value</em> rather than a callback. The hook returns a debounced
          version of the input value that only updates after the specified delay.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage: search input
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
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
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">useDebouncedCallback: Debounced Function Hook</h3>
        <p>
          Sometimes you need to debounce a <em>callback</em> rather than a value — for example, when the callback
          has side effects that should not be triggered on every render, or when you need access to the cancel method.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useRef, useCallback, useEffect } from 'react';

function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep callback ref current without resetting the timer
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [delay]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const isPending = useCallback(() => {
    return timeoutRef.current !== null;
  }, []);

  return { debouncedFn, cancel, isPending };
}

// Usage: auto-save form
function EditableDocument({ documentId }) {
  const [content, setContent] = useState('');

  const { debouncedFn: autoSave, cancel } = useDebouncedCallback(
    async (text: string) => {
      await fetch(\`/api/documents/\${documentId}\`, {
        method: 'PATCH',
        body: JSON.stringify({ content: text }),
      });
    },
    1000
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    autoSave(newContent);
  };

  // Cancel pending save on unmount (e.g., user navigates away)
  useEffect(() => () => cancel(), [cancel]);

  return <textarea value={content} onChange={handleChange} />;
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">useThrottle: Throttled Value Hook</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useState, useEffect, useRef } from 'react';

function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= interval) {
      // Enough time has passed — update immediately
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      // Schedule update for when the interval completes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
        timeoutRef.current = null;
      }, interval - elapsed);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
}

// Usage: live character count with throttled updates
function TextEditor() {
  const [text, setText] = useState('');
  const throttledText = useThrottle(text, 200);

  // Only recalculate stats every 200ms, not on every keystroke
  const stats = useMemo(() => ({
    characters: throttledText.length,
    words: throttledText.split(/\\s+/).filter(Boolean).length,
    readingTime: Math.ceil(throttledText.split(/\\s+/).filter(Boolean).length / 200),
  }), [throttledText]);

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <div>
        {stats.characters} chars | {stats.words} words | {stats.readingTime} min read
      </div>
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">useThrottledCallback: Throttled Function Hook</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useRef, useCallback, useEffect } from 'react';

function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number
) {
  const callbackRef = useRef(callback);
  const lastTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= interval) {
        lastTimeRef.current = now;
        callbackRef.current(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastTimeRef.current = Date.now();
          callbackRef.current(...args);
          timeoutRef.current = null;
        }, interval - elapsed);
      }
    },
    [interval]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { throttledFn, cancel };
}

// Usage: infinite scroll
function InfiniteList({ fetchMore }) {
  const { throttledFn: checkScroll } = useThrottledCallback(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight - scrollTop - clientHeight < 500) {
      fetchMore();
    }
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  return <div>{/* list items */}</div>;
}`}</code>
        </pre>
      </section>

      <section>
        <h2>AbortController Integration</h2>
        <p>
          Debouncing reduces the number of API calls, but there is still a subtle race condition: if the user types
          "rea", pauses, then types "ct", two API calls fire — one for "rea" and one for "react". If the "react"
          response arrives before the "rea" response (due to network variability), the UI briefly shows correct
          results then flashes to outdated "rea" results. The solution is to combine debouncing with{" "}
          <code>AbortController</code> to cancel in-flight requests when a new one starts.
        </p>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server

    U->>C: Types "rea" (debounce triggers)
    C->>S: GET /search?q=rea
    Note over C: Store AbortController #1

    U->>C: Types "react" (debounce triggers)
    C->>C: Abort Controller #1
    Note over S: Server receives abort (or ignores)
    C->>S: GET /search?q=react
    Note over C: Store AbortController #2

    S-->>C: Results for "react"
    Note over C: Render results
    Note over C: No stale "rea" results arrive`}
          caption="AbortController prevents stale responses from overwriting current results"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useState, useEffect, useRef } from 'react';

function useDebouncedSearch(query: string, delay: number) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    async function search() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          \`/api/search?q=\${encodeURIComponent(debouncedQuery)}\`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error('Search failed');

        const data = await res.json();
        setResults(data.results);
      } catch (err) {
        // Ignore abort errors — they're intentional
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(err as Error);
      } finally {
        // Only clear loading if this is still the active request
        if (abortControllerRef.current === controller) {
          setIsLoading(false);
        }
      }
    }

    search();

    // Cleanup: abort on unmount or when query changes
    return () => controller.abort();
  }, [debouncedQuery]);

  return { results, isLoading, error };
}

// Usage
function SearchPage() {
  const [query, setQuery] = useState('');
  const { results, isLoading, error } = useDebouncedSearch(query, 300);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
      />
      {isLoading && <Spinner />}
      {error && <ErrorBanner message={error.message} />}
      <ResultsList results={results} />
    </div>
  );
}`}</code>
        </pre>

        <p>
          This pattern ensures three things: (1) only one request is in-flight at a time, (2) stale responses never
          overwrite fresh results, and (3) the loading state accurately reflects the current request. It is the
          production-grade pattern for search-as-you-type features.
        </p>
      </section>

      <section>
        <h2>Real-World Patterns</h2>

        <h3 className="mt-6 font-semibold">1. Search / Autocomplete</h3>
        <p>
          The canonical debounce use case. Debounce the input value by 200-300ms, then trigger an API call.
          Combine with AbortController for race-condition safety, and display a loading indicator during the
          debounce delay so the user knows their input was registered.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function Autocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    fetch(\`/api/autocomplete?q=\${debouncedQuery}\`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setSuggestions(data.suggestions))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div className="relative">
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0">
          {suggestions.map((s) => (
            <li key={s.id} onClick={() => setQuery(s.text)}>
              {s.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">2. Auto-Save</h3>
        <p>
          Auto-save combines trailing-edge debounce with a "dirty" indicator. The save fires 1-2 seconds after the
          user stops editing. A save-in-progress indicator lets the user know their work is being persisted, and
          a "last saved" timestamp provides reassurance.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function AutoSaveEditor({ documentId, initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { debouncedFn: save, cancel } = useDebouncedCallback(
    async (text: string) => {
      setSaveStatus('saving');
      try {
        await fetch(\`/api/docs/\${documentId}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text }),
        });
        setSaveStatus('saved');
        setLastSaved(new Date());
      } catch {
        setSaveStatus('unsaved');
      }
    },
    1500
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaveStatus('unsaved');
    save(e.target.value);
  };

  // Flush pending save before navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved') {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cancel();
    };
  }, [saveStatus, cancel]);

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {saveStatus === 'saving' && 'Saving...'}
        {saveStatus === 'saved' && \`Saved \${lastSaved?.toLocaleTimeString() ?? ''}\`}
        {saveStatus === 'unsaved' && 'Unsaved changes'}
      </div>
      <textarea value={content} onChange={handleChange} />
    </div>
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">3. Scroll: Infinite Scroll & Progress Bars</h3>
        <p>
          Scroll-based features need throttle (not debounce) because the user needs visual feedback while scrolling,
          not just after they stop. Use rAF throttle for visual updates and time-based throttle for data loading.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Reading progress bar — rAF throttle for smooth visuals
function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = throttleRAF(() => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const totalScrollable = scrollHeight - clientHeight;
      setProgress(totalScrollable > 0 ? scrollTop / totalScrollable : 0);
    });

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      updateProgress.cancel();
    };
  }, []);

  return progress;
}

function ReadingProgressBar() {
  const progress = useReadingProgress();
  return (
    <div
      className="fixed top-0 left-0 h-1 bg-blue-500 transition-none"
      style={{ width: \`\${progress * 100}%\` }}
    />
  );
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">4. Window Resize</h3>
        <p>
          Resize events fire continuously during drag. Debounce is typically correct for layout recalculations
          (expensive and only the final size matters), while throttle works for responsive previews.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Initialize
    setSize({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = debounce(() => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, []);

  return size;
}

// Usage: responsive chart that recalculates dimensions
function ResponsiveChart({ data }) {
  const { width } = useWindowSize();
  const chartWidth = Math.min(width - 48, 800);

  return <BarChart data={data} width={chartWidth} height={400} />;
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">5. Drag and Drop</h3>
        <p>
          During drag operations, <code>mousemove</code> or <code>pointermove</code> events fire at 60+ Hz. Use
          rAF throttle for the visual update (moving the element) and a slower throttle for any associated
          calculations like drop target detection or grid snapping.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`function useDraggable(ref) {
  const [isDragging, setIsDragging] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // rAF-throttled visual update (smooth at monitor refresh rate)
    const updatePosition = throttleRAF((clientX, clientY) => {
      const x = clientX - offsetRef.current.x;
      const y = clientY - offsetRef.current.y;
      positionRef.current = { x, y };
      el.style.transform = \`translate(\${x}px, \${y}px)\`;
    });

    // Slower throttle for drop target detection (100ms is sufficient)
    const checkDropTarget = throttle((clientX, clientY) => {
      const elementBelow = document.elementFromPoint(clientX, clientY);
      // Highlight valid drop targets
      document.querySelectorAll('.drop-zone').forEach((zone) => {
        zone.classList.toggle('active', zone === elementBelow?.closest('.drop-zone'));
      });
    }, 100);

    const handlePointerMove = (e) => {
      if (!isDragging) return;
      updatePosition(e.clientX, e.clientY);
      checkDropTarget(e.clientX, e.clientY);
    };

    const handlePointerDown = (e) => {
      setIsDragging(true);
      offsetRef.current = {
        x: e.clientX - positionRef.current.x,
        y: e.clientY - positionRef.current.y,
      };
      el.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      updatePosition.cancel();
      checkDropTarget.cancel();
    };

    el.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      updatePosition.cancel();
      checkDropTarget.cancel();
    };
  }, [ref, isDragging]);

  return { isDragging };
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Library Options</h2>
        <p>
          While understanding the implementation is essential for interviews, production code typically uses
          battle-tested libraries. Here are the most popular options:
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Library</th>
              <th className="p-3 text-left">Bundle Size</th>
              <th className="p-3 text-left">Features</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><code>lodash.debounce</code></td>
              <td className="p-3">~1.3 KB</td>
              <td className="p-3">Leading/trailing, cancel, flush, maxWait</td>
              <td className="p-3">Non-React JS, full feature set</td>
            </tr>
            <tr>
              <td className="p-3"><code>lodash.throttle</code></td>
              <td className="p-3">~1.3 KB</td>
              <td className="p-3">Leading/trailing, cancel</td>
              <td className="p-3">Non-React JS, full feature set</td>
            </tr>
            <tr>
              <td className="p-3"><code>use-debounce</code></td>
              <td className="p-3">~1 KB</td>
              <td className="p-3">useDebounce, useDebouncedCallback, leading/trailing, maxWait</td>
              <td className="p-3">React projects, SSR-safe</td>
            </tr>
            <tr>
              <td className="p-3"><code>usehooks-ts</code></td>
              <td className="p-3">Tree-shakeable</td>
              <td className="p-3">useDebounceValue, useDebounceCallback</td>
              <td className="p-3">TypeScript-first React projects</td>
            </tr>
            <tr>
              <td className="p-3">Custom hooks</td>
              <td className="p-3">~0.3 KB</td>
              <td className="p-3">Tailored to your needs</td>
              <td className="p-3">When bundle size is critical, minimal needs</td>
            </tr>
          </tbody>
        </table>

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// lodash.debounce with maxWait — guaranteed execution within maxWait ms
import debounce from 'lodash.debounce';

const search = debounce(
  (query) => fetchResults(query),
  300,
  {
    leading: false,   // Don't fire on first call
    trailing: true,   // Fire after quiet period
    maxWait: 1000,    // Guarantee execution within 1s even if user keeps typing
  }
);

// use-debounce — React-optimized
import { useDebounce, useDebouncedCallback } from 'use-debounce';

function SearchComponent() {
  const [query, setQuery] = useState('');

  // Option 1: Debounce the value
  const [debouncedQuery] = useDebounce(query, 300);

  // Option 2: Debounce the callback (more control)
  const debouncedSearch = useDebouncedCallback(
    (q: string) => fetchResults(q),
    300,
    { maxWait: 1000 }
  );

  return (
    <input onChange={(e) => {
      setQuery(e.target.value);
      debouncedSearch(e.target.value);
    }} />
  );
}`}</code>
        </pre>

        <p>
          The <code>maxWait</code> option deserves special attention. It combines debounce with a maximum ceiling:
          the function still waits for a quiet period, but if the events continue beyond <code>maxWait</code>
          milliseconds, it forces execution. This is essentially a hybrid of debounce and throttle — debounce behavior
          with a throttle-like guarantee. Use it for search inputs where you want to wait for the user to pause, but
          also want to show <em>something</em> after a second even if they are still typing.
        </p>
      </section>

      <section>
        <h2>Performance Comparison</h2>
        <p>
          The following table shows the impact of rate limiting on common event-driven operations. Numbers represent
          typical values for a 3-second user interaction (e.g., 3 seconds of continuous typing or scrolling):
        </p>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Scenario</th>
              <th className="p-3 text-left">No Limiting</th>
              <th className="p-3 text-left">Debounce (300ms)</th>
              <th className="p-3 text-left">Throttle (200ms)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Search API calls (typing 30 chars)</td>
              <td className="p-3">30 calls</td>
              <td className="p-3">1 call</td>
              <td className="p-3">~15 calls</td>
            </tr>
            <tr>
              <td className="p-3">Scroll handler executions (3s scroll)</td>
              <td className="p-3">~180 (60/s)</td>
              <td className="p-3">1 (after stop)</td>
              <td className="p-3">~15 (5/s)</td>
            </tr>
            <tr>
              <td className="p-3">Resize layout recalc (2s resize)</td>
              <td className="p-3">~120</td>
              <td className="p-3">1</td>
              <td className="p-3">~10</td>
            </tr>
            <tr>
              <td className="p-3">Mousemove tooltip updates (3s)</td>
              <td className="p-3">~180</td>
              <td className="p-3">1 (unusable)</td>
              <td className="p-3">~15 (smooth)</td>
            </tr>
            <tr>
              <td className="p-3">Auto-save API calls (60s editing)</td>
              <td className="p-3">Hundreds</td>
              <td className="p-3">~5-10 (1.5s delay)</td>
              <td className="p-3">~30 (every 2s)</td>
            </tr>
            <tr>
              <td className="p-3">Drag position updates (2s drag)</td>
              <td className="p-3">~120</td>
              <td className="p-3">1 (broken)</td>
              <td className="p-3">~120 (rAF: matches refresh)</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4">
          Key takeaway: debounce gives the maximum reduction in executions (often to just 1 call) but provides
          zero feedback during the event burst. Throttle provides a balanced reduction while maintaining periodic
          updates. The right choice depends entirely on whether you need intermediate results or only the final
          result.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>1. Creating new debounced functions on every render:</strong> This is the most common bug.
            Defining a debounced function inside a component body or inside a useEffect dependency array creates a
            new debounced instance on every render, each with its own timer. The previous timer is lost, so the
            debounce never actually fires.
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm mt-2">
              <code>{`// BUG: new debounced function every render — debounce never fires
function SearchInput() {
  const [query, setQuery] = useState('');

  // This creates a NEW debounced function on every render
  const debouncedSearch = debounce((q) => fetchResults(q), 300);

  return <input onChange={(e) => debouncedSearch(e.target.value)} />;
}

// FIX 1: useRef to maintain stable reference
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedSearch = useRef(
    debounce((q) => fetchResults(q), 300)
  ).current;

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  return <input onChange={(e) => debouncedSearch(e.target.value)} />;
}

// FIX 2: useDebouncedCallback hook (preferred)
function SearchInput() {
  const [query, setQuery] = useState('');
  const { debouncedFn: search } = useDebouncedCallback(
    (q) => fetchResults(q), 300
  );
  return <input onChange={(e) => search(e.target.value)} />;
}`}</code>
            </pre>
          </li>
          <li>
            <strong>2. Stale closures:</strong> The debounced function captures variables from the render in which it
            was created. If you use <code>useCallback</code> with an empty dependency array, the debounced function
            will always reference the initial state values, not the current ones. Use refs for values that need to be
            current inside the debounced callback.
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm mt-2">
              <code>{`// BUG: stale closure — always reads initial count
function Counter() {
  const [count, setCount] = useState(0);

  const debouncedLog = useCallback(
    debounce(() => {
      console.log('Count:', count); // Always logs 0!
    }, 500),
    [] // Empty deps = stale closure
  );

  // FIX: use a ref for the current value
  const countRef = useRef(count);
  countRef.current = count;

  const debouncedLog = useRef(
    debounce(() => {
      console.log('Count:', countRef.current); // Always current
    }, 500)
  ).current;
}`}</code>
            </pre>
          </li>
          <li>
            <strong>3. Not canceling on unmount:</strong> A debounced timer can fire after the component unmounts,
            causing a state update on an unmounted component. Always cancel pending timers in the useEffect cleanup
            function.
          </li>
          <li>
            <strong>4. Using debounce where throttle is needed:</strong> Debouncing a scroll handler means the user
            gets zero visual feedback until they stop scrolling. A progress bar that only updates after scrolling stops
            defeats its purpose. Use throttle for any scenario requiring feedback during continuous interaction.
          </li>
          <li>
            <strong>5. Too long or too short a delay:</strong> A 1000ms debounce on search feels unresponsive — users
            expect results within 200-300ms of pausing. A 50ms debounce on auto-save fires on every brief pause between
            words, defeating the purpose. General guidelines:
            <ul className="space-y-1 mt-2 ml-4">
              <li>Search / autocomplete: 200-300ms</li>
              <li>Form validation: 300-500ms</li>
              <li>Auto-save: 1000-2000ms</li>
              <li>Scroll throttle: 100-200ms (or rAF)</li>
              <li>Resize: 100-200ms debounce</li>
              <li>Analytics events: 1000-5000ms throttle</li>
            </ul>
          </li>
          <li>
            <strong>6. Not using passive event listeners:</strong> Scroll and touch event listeners that are not
            marked as <code>{'{ passive: true }'}</code> block the browser's compositor thread, adding latency to
            scrolling even if the handler is throttled. Always add the passive option for scroll, touchstart,
            touchmove, and wheel events.
          </li>
          <li>
            <strong>7. Race conditions without AbortController:</strong> Debouncing alone does not prevent
            out-of-order responses. If request A takes 500ms and request B (fired later) takes 100ms, the UI will
            briefly show B's results then overwrite them with A's stale results. Always pair debounced API calls
            with AbortController or a request ID comparison.
          </li>
          <li>
            <strong>8. Forgetting to flush before navigation:</strong> If the user has unsaved changes and navigates
            away, a pending debounced save will be canceled. Use the <code>flush</code> method (available in lodash)
            or the <code>beforeunload</code> event to force the pending save to execute immediately.
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ul className="space-y-2">
          <li>
            <strong>Choose the right tool:</strong> Debounce for final-value scenarios (search, save, resize).
            Throttle for ongoing-feedback scenarios (scroll, drag, mouse tracking). rAF throttle for visual updates.
          </li>
          <li>
            <strong>Always clean up:</strong> Cancel pending timers on unmount. Cancel in-flight requests with
            AbortController. Remove event listeners in cleanup functions.
          </li>
          <li>
            <strong>Use stable references in React:</strong> Store debounced/throttled functions in refs or use
            custom hooks that handle reference stability. Never create new instances in the render body.
          </li>
          <li>
            <strong>Combine with passive listeners:</strong> For scroll and touch events, always use{" "}
            <code>{'{ passive: true }'}</code> to avoid blocking the compositor thread.
          </li>
          <li>
            <strong>Consider maxWait:</strong> For debounced search, add a maxWait of 1-2 seconds so the user sees
            results even if they type continuously without pausing.
          </li>
          <li>
            <strong>Pair with AbortController:</strong> Debouncing reduces calls but does not eliminate race conditions.
            AbortController ensures stale responses never reach the UI.
          </li>
          <li>
            <strong>Test with realistic timing:</strong> Use fake timers in tests (<code>jest.useFakeTimers()</code>)
            to verify debounce/throttle behavior deterministically. Test edge cases: rapid calls, unmount during
            pending timer, and the cancel method.
          </li>
          <li>
            <strong>Show feedback during debounce:</strong> While waiting for the debounce to fire, show a loading
            indicator or "typing..." state so the user knows the system received their input.
          </li>
          <li>
            <strong>Use libraries in production:</strong> Custom hooks are fine for simple cases, but
            production code benefits from <code>use-debounce</code> or <code>lodash.debounce</code> for edge cases
            like maxWait, flush, and leading/trailing options that are tricky to implement correctly.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            <strong>Debounce</strong> collapses a burst of events into a single execution after the burst ends.
            Implementation: <code>clearTimeout</code> + <code>setTimeout</code>. Best for search input (300ms),
            auto-save (1500ms), and resize handlers. The elevator door analogy: it waits for people to stop entering
            before closing.
          </li>
          <li>
            <strong>Throttle</strong> enforces a maximum execution rate during continuous events. Implementation: track
            last execution timestamp and gate with a time comparison. Best for scroll handlers, drag, and mouse
            tracking. The train schedule analogy: it runs at fixed intervals regardless of demand.
          </li>
          <li>
            <strong>Leading vs trailing edge:</strong> Trailing (default) fires after the quiet period — good for
            search. Leading fires immediately on the first event then suppresses — good for button click protection.
            Both edges can be combined for tooltip-style interactions.
          </li>
          <li>
            <strong>requestAnimationFrame throttle:</strong> For visual updates, rAF is the ideal throttle mechanism
            because it syncs with the browser's paint cycle and automatically adapts to the monitor's refresh rate
            (60Hz, 120Hz, etc.).
          </li>
          <li>
            <strong>React integration:</strong> Use <code>useDebounce</code> for debouncing values,{" "}
            <code>useDebouncedCallback</code> for debouncing side effects. Store debounced functions in refs to
            maintain stable references across renders. Always cancel in useEffect cleanup.
          </li>
          <li>
            <strong>AbortController:</strong> Debouncing alone does not prevent race conditions from out-of-order
            responses. Pair debounced API calls with AbortController to cancel in-flight requests and ensure the UI
            always shows results for the most recent query.
          </li>
          <li>
            <strong>maxWait:</strong> A hybrid of debounce and throttle — waits for a quiet period but forces
            execution after a maximum ceiling. Ideal for search inputs where you want to respect pauses but also
            guarantee results within a reasonable time even during continuous typing.
          </li>
          <li>
            <strong>Performance impact:</strong> A 3-second typing burst generates ~30 input events. Without rate
            limiting, that is 30 API calls. Debounce reduces it to 1. Throttle at 200ms reduces it to ~15. For scroll
            events at 60Hz, throttle to 5-10 updates/second for DOM reads, or use rAF for visual updates.
          </li>
          <li>
            <strong>Common bugs:</strong> Creating new debounced functions each render (timer is lost),
            stale closures capturing outdated state, not cleaning up timers on unmount, and using debounce for
            scenarios that need throttle (scroll, drag).
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <strong>CSS-Tricks:</strong>{" "}
            <em>"Debouncing and Throttling Explained Through Examples"</em> by David Corbacho — the definitive visual
            guide with interactive demos.
          </li>
          <li>
            <strong>Lodash Documentation:</strong>{" "}
            <em>_.debounce and _.throttle</em> — reference implementations with leading, trailing, maxWait, cancel,
            and flush options.
          </li>
          <li>
            <strong>use-debounce npm package:</strong>{" "}
            React-specific hooks with TypeScript support, SSR safety, and maxWait support.
          </li>
          <li>
            <strong>MDN Web Docs:</strong>{" "}
            <em>requestAnimationFrame</em> — browser API documentation for frame-aligned throttling.
          </li>
          <li>
            <strong>MDN Web Docs:</strong>{" "}
            <em>AbortController</em> — API for canceling fetch requests and other asynchronous operations.
          </li>
          <li>
            <strong>web.dev:</strong>{" "}
            <em>"Debounce your input handlers"</em> — Google's performance guidance on event handler optimization.
          </li>
          <li>
            <strong>React Documentation:</strong>{" "}
            <em>"You Might Not Need an Effect"</em> — guidance on when to use refs vs effects for debounced callbacks.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
