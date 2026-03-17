"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-lazy-loading-concise",
  title: "Lazy Loading (Images, Components, Routes)",
  description: "Quick overview of lazy loading techniques for images, components, and routes in frontend applications.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "lazy-loading",
  version: "concise",
  wordCount: 3000,
  readingTime: 12,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "lazy-loading", "images", "intersection-observer"],
  relatedTopics: ["code-splitting", "image-optimization", "virtualization-windowing"],
};

export default function LazyLoadingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Lazy loading</strong> defers the loading of resources until they're actually needed. Instead of
          downloading every image, component, and route upfront, you load them on-demand — typically when they
          enter the viewport or when the user navigates to them. This reduces initial page weight, speeds up
          first paint, and saves bandwidth for resources users may never scroll to.
        </p>
        <p>
          The three primary targets for lazy loading are <strong>images</strong> (the biggest bandwidth consumers),
          <strong>components</strong> (heavy UI elements below the fold), and <strong>routes</strong> (entire pages
          loaded on navigation). Each uses different mechanisms but shares the same core principle: don't load what
          you don't need yet.
        </p>
      </section>

      <section>
        <h2>Lazy Loading Images</h2>
        <p>
          Images typically account for 50-70% of a page's total weight. A page with 30 images shouldn't download
          all of them when only 3 are visible.
        </p>

        <h3 className="mt-4 font-semibold">Native Browser Lazy Loading</h3>
        <p>
          The simplest approach — just add <code>loading="lazy"</code> to your img tags. The browser handles
          everything: it defers loading until the image is near the viewport.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Native lazy loading — supported in all modern browsers
<img
  src="/photos/sunset.jpg"
  alt="Sunset over mountains"
  loading="lazy"           // Defer loading until near viewport
  width={800}              // Always set dimensions to prevent layout shift
  height={600}
/>

// IMPORTANT: Don't lazy-load above-the-fold images!
// Hero images and LCP elements should load immediately
<img
  src="/hero-banner.jpg"
  alt="Welcome"
  loading="eager"          // Default — loads immediately
  fetchPriority="high"     // Prioritize this image
/>

// Next.js Image component handles this automatically
import Image from 'next/image';

<Image
  src="/photos/sunset.jpg"
  alt="Sunset over mountains"
  width={800}
  height={600}
  // lazy by default, eager for priority={true}
/>

// With priority for above-the-fold images
<Image
  src="/hero-banner.jpg"
  alt="Welcome"
  width={1200}
  height={600}
  priority            // Disables lazy loading, adds preload hint
/>`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Intersection Observer Approach</h3>
        <p>
          For more control over loading behavior (custom thresholds, animations, placeholder strategies):
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { useState, useRef, useEffect } from 'react';

function LazyImage({ src, alt, width, height, placeholder }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() =&gt; {
    const observer = new IntersectionObserver(
      ([entry]) =&gt; {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () =&gt; observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} style={{ width, height, position: 'relative' }}>
      {/* Low-quality placeholder or blur-up */}
      {!loaded && (
        <img
          src={placeholder}
          alt=""
          style={{ filter: 'blur(20px)', width: '100%', height: '100%' }}
        />
      )}

      {/* Full image — only start loading when in view */}
      {inView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
        /&gt;
      )}
    </div>
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Lazy Loading Components</h2>
        <p>
          Heavy components that aren't immediately visible (modals, tabs, below-fold content) should be
          code-split and loaded on demand.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { lazy, Suspense, useState, useRef, useEffect } from 'react';

// === Load on user interaction ===
const RichEditor = lazy(() =&gt; import('./RichEditor'));

function PostForm() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div>
      {!showEditor ? (
        <button onClick={() => setShowEditor(true)}&gt;
          Write Post
        </button>
      ) : (
        <Suspense fallback={<EditorSkeleton />}&gt;
          <RichEditor />
        </Suspense>
      )}
    </div>
  );
}

// === Load when scrolled into view ===
const Comments = lazy(() =&gt; import('./Comments'));

function ArticlePage({ article }) {
  const [showComments, setShowComments] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() =&gt; {
    const observer = new IntersectionObserver(([entry]) =&gt; {
      if (entry.isIntersecting) {
        setShowComments(true);
        observer.disconnect();
      }
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () =&gt; observer.disconnect();
  }, []);

  return (
    <div>
      <article>{article.content}</article>
      <div ref={sentinelRef} />
      {showComments && (
        <Suspense fallback={<CommentsSkeleton />}&gt;
          <Comments articleId={article.id} />
        </Suspense>
      )}
    </div>
  );
}

// === Next.js dynamic import ===
import dynamic from 'next/dynamic';

const Map = dynamic(() =&gt; import('./MapView'), {
  loading: () =&gt; <MapSkeleton />,
  ssr: false, // MapboxGL needs browser APIs
});`}</code>
        </pre>
      </section>

      <section>
        <h2>Lazy Loading Routes</h2>
        <p>
          Each route becomes a separate chunk — users only download the JavaScript for pages they visit.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() =&gt; import('./pages/Home'));
const Dashboard = lazy(() =&gt;
  import(/* webpackPrefetch: true */ './pages/Dashboard')
);
const Settings = lazy(() =&gt;
  import(/* webpackPrefetch: true */ './pages/Settings')
);

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}&gt;
      <Routes>
        <Route path="/" element={<Home />} /&gt;
        <Route path="/dashboard" element={<Dashboard />} /&gt;
        <Route path="/settings" element={<Settings />} /&gt;
      </Routes>
    </Suspense>
  );
}

// Next.js handles this automatically — each page.tsx is a separate chunk`}</code>
        </pre>
      </section>

      <section>
        <h2>Key Rules</h2>
        <ul className="space-y-2">
          <li>
            <strong>Never lazy-load above-the-fold content:</strong> Your hero image, LCP element, and primary
            content should load immediately. Lazy loading these hurts Core Web Vitals.
          </li>
          <li>
            <strong>Always set dimensions on images:</strong> Without explicit <code>width</code> and
            <code>height</code>, lazy-loaded images cause layout shifts (bad CLS score).
          </li>
          <li>
            <strong>Provide meaningful fallbacks:</strong> Skeleton screens, blur-up placeholders, or content-sized
            placeholders — never leave blank space.
          </li>
          <li>
            <strong>Use <code>rootMargin</code> for early loading:</strong> Start loading images 100-300px before
            they enter the viewport so they're ready when the user scrolls to them.
          </li>
          <li>
            <strong>Prefetch likely-next routes:</strong> Use <code>webpackPrefetch</code> or hover-based
            prefetching to eliminate navigation latency for lazy routes.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Lazy loading defers resource loading until needed — images via <code>loading="lazy"</code> or
            Intersection Observer, components via <code>React.lazy</code>, routes via dynamic imports.
          </li>
          <li>
            Native <code>loading="lazy"</code> is the simplest approach for images; Intersection Observer gives
            more control over thresholds and placeholder strategies.
          </li>
          <li>
            Never lazy-load above-the-fold/LCP content — it should load eagerly with <code>fetchPriority="high"</code>.
          </li>
          <li>
            Always provide dimensions to prevent CLS, and use skeleton screens as fallbacks for lazy components.
          </li>
          <li>
            Route-based lazy loading is automatic in Next.js; in React Router, use <code>React.lazy</code> with
            Suspense boundaries.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
