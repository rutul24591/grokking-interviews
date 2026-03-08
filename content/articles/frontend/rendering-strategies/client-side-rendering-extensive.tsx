"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-client-sid-extensive",
  title: "Client-Side Rendering (CSR)",
  description: "Comprehensive guide to Client-Side Rendering (CSR) covering concepts, implementation, and best practices.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "client-side-rendering",
  version: "extensive",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "CSR", "SPA", "JavaScript"],
  relatedTopics: ["server-side-rendering", "static-site-generation", "progressive-hydration"],
};

export default function ClientSideRenderingExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Client-Side Rendering (CSR)</strong> is a rendering pattern where the browser downloads a minimal HTML page,
          and JavaScript is responsible for dynamically rendering content on the client. The server sends a nearly empty
          HTML shell with JavaScript bundles, and the application builds the DOM entirely in the browser.
        </p>
        <p>
          CSR emerged with the rise of Single Page Applications (SPAs) around 2010-2012, pioneered by frameworks like
          AngularJS, Backbone.js, and later React, Vue, and Angular. This approach shifted rendering responsibility from
          servers to browsers, enabling rich, interactive experiences that felt more like native desktop applications.
        </p>
        <p>
          The paradigm shift was driven by several factors: improving browser JavaScript engines (V8, SpiderMonkey),
          the need for highly interactive web applications, reduced server costs by offloading computation to clients,
          and the desire for faster subsequent navigation after initial load.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>Understanding CSR requires grasping several fundamental concepts that define how it operates:</p>
        <ul>
          <li>
            <strong>Initial HTML Shell:</strong> The server returns minimal HTML (often just a div with id="root")
            with script tags that reference JavaScript bundles. This HTML contains no meaningful content.
          </li>
          <li>
            <strong>JavaScript Hydration:</strong> Once JS downloads and executes, it takes over the page, fetches data
            via APIs, and dynamically constructs the DOM tree in the browser.
          </li>
          <li>
            <strong>Runtime Rendering:</strong> All rendering happens at runtime in the browser. Components mount,
            state updates trigger re-renders, and the virtual DOM reconciles changes to the actual DOM.
          </li>
          <li>
            <strong>Client-Side Routing:</strong> Navigation is handled by JavaScript routers (React Router, Vue Router)
            without full page reloads. The URL changes via History API, but no server request is made.
          </li>
          <li>
            <strong>API-Driven Architecture:</strong> CSR apps typically consume REST or GraphQL APIs, making them
            backend-agnostic and enabling true separation of concerns between frontend and backend.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>The CSR architecture follows a distinct request-response pattern:</p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">CSR Request Flow</h3>
          <ol className="space-y-3">
            <li><strong>1. User Request:</strong> Browser requests example.com</li>
            <li><strong>2. Server Response:</strong> Returns minimal HTML (~2-5KB) with CSS/JS links</li>
            <li><strong>3. Parse HTML:</strong> Browser parses HTML and discovers script tags</li>
            <li><strong>4. Download JavaScript:</strong> Fetches app bundles (vendor.js, main.js) - often 200KB-2MB</li>
            <li><strong>5. Execute JavaScript:</strong> JS engine parses and executes code, initializes framework</li>
            <li><strong>6. Render Initial UI:</strong> App renders loading state or skeleton UI</li>
            <li><strong>7. Fetch Data:</strong> Makes API calls to backend (fetch/axios)</li>
            <li><strong>8. Re-render with Data:</strong> Updates UI with fetched data</li>
            <li><strong>9. Interactive:</strong> App becomes fully interactive (TTI)</li>
          </ol>
        </div>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/csr-flow-sequence.svg"
          alt="CSR Request Flow Sequence Diagram"
          caption="Client-Side Rendering Request Flow - Sequential steps showing the multi-stage loading process"
        />

        <p>
          This multi-step process means users may experience a "blank screen" or loading spinner during steps 2-7,
          which can take 3-10 seconds on slower networks or devices. The First Contentful Paint (FCP) is delayed
          until JavaScript executes and renders content.
        </p>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/csr-architecture-flow.svg"
          alt="CSR Architecture Flow Diagram"
          caption="CSR Architecture Flow - Shows the dependency chain from initial request to interactivity"
        />
      </section>

      <section>
        <h2>Implementation Examples</h2>
        <p>Here's how CSR is implemented across popular frameworks:</p>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 font-semibold">React CSR Application</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// index.html - Minimal HTML shell
<!DOCTYPE html>
<html>
  <head>
    <title>My React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>

// index.jsx - Client-side entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// App.jsx - Component with data fetching
function App() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Vue CSR Application</h3>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
              <code>{`// main.js - Vue entry point
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');

// App.vue - Component with data fetching
<template>
  <div>
    <h1>Users</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="user in users" :key="user.id">
        {{ user.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const users = ref([]);
const loading = ref(true);

onMounted(async () => {
  const response = await fetch('/api/users');
  users.value = await response.json();
  loading.value = false;
});
</script>`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Advantages</th>
              <th className="p-3 text-left">Disadvantages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Performance</strong></td>
              <td className="p-3">
                • Fast subsequent navigation (no page reloads)<br/>
                • Rich interactivity with instant feedback<br/>
                • Reduced server load
              </td>
              <td className="p-3">
                • Slow initial load (large JS bundles)<br/>
                • Delayed Time to Interactive (TTI)<br/>
                • Poor on slow networks/devices
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>SEO</strong></td>
              <td className="p-3">
                • Googlebot can render JS<br/>
                • Dynamic meta tags via React Helmet
              </td>
              <td className="p-3">
                • Poor SEO for non-Google crawlers<br/>
                • Content not in initial HTML<br/>
                • Social media preview issues
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Development</strong></td>
              <td className="p-3">
                • Clear separation of frontend/backend<br/>
                • Easy to scale frontend independently<br/>
                • Great developer experience
              </td>
              <td className="p-3">
                • Complex state management<br/>
                • Large bundle sizes to manage<br/>
                • Requires good DevOps for deployments
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>User Experience</strong></td>
              <td className="p-3">
                • App-like feel with smooth transitions<br/>
                • Optimistic UI updates<br/>
                • Offline capabilities with service workers
              </td>
              <td className="p-3">
                • Blank screen on initial load<br/>
                • Requires loading states everywhere<br/>
                • Poor experience on slow connections
              </td>
            </tr>
            <tr>
              <td className="p-3"><strong>Infrastructure</strong></td>
              <td className="p-3">
                • Simple hosting (static files on CDN)<br/>
                • Easy to cache and distribute<br/>
                • Lower server costs
              </td>
              <td className="p-3">
                • Large CDN bandwidth costs<br/>
                • Client devices do all the work<br/>
                • Battery drain on mobile devices
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/frontend/rendering-strategies/csr-performance-gantt.svg"
          alt="CSR vs SSR Performance Timeline"
          caption="Performance comparison: CSR has delayed FCP (6s) but simpler architecture, while SSR has fast FCP (0.9s) but requires server processing"
        />
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>To build performant CSR applications, follow these practices:</p>
        <ol className="space-y-3">
          <li>
            <strong>Code Splitting:</strong> Split bundles by route using dynamic imports. Load only necessary code
            for current page. Use React.lazy() or Vue's defineAsyncComponent().
          </li>
          <li>
            <strong>Aggressive Caching:</strong> Use service workers for offline support. Cache API responses with
            stale-while-revalidate strategy. Leverage HTTP cache headers for static assets.
          </li>
          <li>
            <strong>Optimize Bundle Size:</strong> Tree-shake unused code, minify production builds, use modern
            JavaScript for modern browsers (with fallback), and analyze bundle with webpack-bundle-analyzer.
          </li>
          <li>
            <strong>Loading States:</strong> Show skeleton screens instead of spinners. Implement optimistic UI
            updates. Use Suspense boundaries (React 18+) for granular loading states.
          </li>
          <li>
            <strong>Prefetching Data:</strong> Prefetch data for likely next routes. Use link prefetching for
            critical resources. Implement predictive prefetching based on user behavior.
          </li>
          <li>
            <strong>Critical CSS:</strong> Inline critical CSS in HTML head. Defer non-critical CSS loading.
            Use CSS-in-JS with SSR for automatic critical CSS extraction.
          </li>
          <li>
            <strong>Lazy Load Images:</strong> Use native lazy loading (loading="lazy"). Implement progressive
            image loading with blur-up technique. Use modern formats (WebP, AVIF).
          </li>
          <li>
            <strong>Error Boundaries:</strong> Wrap components in error boundaries. Gracefully handle API failures.
            Provide retry mechanisms for failed requests.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>Avoid these common mistakes when building CSR applications:</p>
        <ul className="space-y-3">
          <li>
            <strong>Ignoring Initial Load Performance:</strong> Shipping massive JavaScript bundles (3MB+) that
            take 10+ seconds to load and parse. Always measure and optimize bundle size. Target {'<'}200KB for
            initial JS payload.
          </li>
          <li>
            <strong>No SEO Strategy:</strong> Building CSR apps without considering SEO needs. If organic traffic
            matters, use SSR, SSG, or prerendering. CSR alone is insufficient for content-driven sites.
          </li>
          <li>
            <strong>Poor Error Handling:</strong> Not handling network failures, showing generic errors, or letting
            the app crash. Implement proper error boundaries and retry logic.
          </li>
          <li>
            <strong>Memory Leaks:</strong> Forgetting to cleanup subscriptions, timers, or event listeners in
            useEffect/lifecycle hooks. Use cleanup functions religiously.
          </li>
          <li>
            <strong>Over-fetching Data:</strong> Fetching more data than needed, making unnecessary API calls, or
            not caching responses. Use GraphQL or optimize REST endpoints. Implement request deduplication.
          </li>
          <li>
            <strong>Blocking the Main Thread:</strong> Performing heavy computations on the main thread, causing
            UI jank. Use Web Workers for CPU-intensive tasks. Implement throttling/debouncing.
          </li>
          <li>
            <strong>No Loading States:</strong> Showing nothing while data loads, creating jarring UX. Always
            provide feedback during async operations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>CSR excels in these scenarios:</p>
        <ul className="space-y-3">
          <li>
            <strong>Dashboard Applications:</strong> Admin panels, analytics dashboards, and internal tools where
            SEO doesn't matter and users are authenticated. Examples: Vercel Dashboard, Netlify UI, Stripe Dashboard.
          </li>
          <li>
            <strong>Web Applications:</strong> Rich interactive apps like Gmail, Figma, Notion, or Linear where the
            experience needs to feel native and responsive.
          </li>
          <li>
            <strong>Real-time Collaboration Tools:</strong> Apps like Google Docs, Miro, or Slack that require
            instant updates and maintain WebSocket connections.
          </li>
          <li>
            <strong>Progressive Web Apps:</strong> Apps that work offline, sync in background, and feel native on
            mobile. CSR + Service Workers enable PWA capabilities.
          </li>
          <li>
            <strong>Internal Enterprise Applications:</strong> CRM systems, inventory management, or HR tools used
            by employees behind authentication where public SEO is irrelevant.
          </li>
          <li>
            <strong>Media Players:</strong> Spotify Web Player, YouTube Music, or Netflix (for authenticated views)
            where interactive playback controls are critical.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">When NOT to Use CSR</h3>
          <p>Avoid CSR for:</p>
          <ul className="mt-2 space-y-2">
            <li>• Content-heavy websites (blogs, news sites, documentation)</li>
            <li>• E-commerce product pages (poor SEO = lost revenue)</li>
            <li>• Marketing landing pages (slow load = high bounce rate)</li>
            <li>• Public-facing content requiring social sharing (no meta tags)</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/rendering-on-the-web/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Rendering on the Web - web.dev
            </a>
          </li>
          <li>
            <a href="https://react.dev/learn/start-a-new-react-project" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              React Documentation - Start a New React Project
            </a>
          </li>
          <li>
            <a href="https://vuejs.org/guide/scaling-up/ssr.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Vue.js Guide - Server-Side Rendering vs Client-Side
            </a>
          </li>
          <li>
            <a href="https://developer.chrome.com/docs/lighthouse/performance/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Chrome DevTools - Performance Auditing
            </a>
          </li>
          <li>
            <a href="https://patterns.dev/posts/client-side-rendering" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              patterns.dev - Client-Side Rendering Pattern
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
