"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-client-sid-concise",
  title: "Client-Side Rendering (CSR)",
  description: "Quick overview of Client-Side Rendering pattern for interviews and rapid learning.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "client-side-rendering",
  version: "concise",
  wordCount: 850,
  readingTime: 4,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "CSR", "SPA", "JavaScript"],
  relatedTopics: ["server-side-rendering", "static-site-generation", "progressive-hydration"],
};

export default function ClientSideRenderingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Client-Side Rendering (CSR)</strong> is a pattern where the browser receives minimal HTML and JavaScript
          takes full responsibility for rendering the UI. The server sends an empty HTML shell, the browser downloads
          JS bundles, executes them, fetches data via APIs, and dynamically builds the DOM at runtime.
        </p>
        <p>
          Common in Single Page Applications (SPAs) built with React, Vue, or Angular. The entire application runs
          in the browser after initial load, providing native app-like experiences with smooth client-side routing.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Empty HTML Shell:</strong> Server returns minimal HTML (just a div#root) with script tags.
            No content in initial response.
          </li>
          <li>
            <strong>JavaScript Boot-up:</strong> Browser downloads, parses, and executes JS bundles (often 200KB-2MB).
            Framework initializes and takes control of the page.
          </li>
          <li>
            <strong>Runtime Data Fetching:</strong> App makes API calls after mounting. Content appears after data
            loads, not in initial HTML.
          </li>
          <li>
            <strong>Client-Side Routing:</strong> Navigation handled by JS router. URL changes without server requests.
            Uses History API for pushState/replaceState.
          </li>
          <li>
            <strong>Virtual DOM:</strong> Framework maintains virtual representation, diffs changes, and efficiently
            updates real DOM.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// index.html - Minimal HTML
<!DOCTYPE html>
<html>
  <head><title>App</title></head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>

// React Entry Point
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(
  document.getElementById('root')
).render(<App />);

// Component with Data Fetching
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{users.map(u => u.name)}</div>;
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Pros</th>
              <th className="p-3 text-left">Cons</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                ✓ Fast navigation after initial load<br/>
                ✓ Rich interactivity & smooth UX<br/>
                ✓ Reduced server load<br/>
                ✓ Clear frontend/backend separation<br/>
                ✓ Easy CDN deployment<br/>
                ✓ Great developer experience
              </td>
              <td className="p-3">
                ✗ Slow initial load (blank screen)<br/>
                ✗ Poor SEO (content not in HTML)<br/>
                ✗ Large JavaScript bundles<br/>
                ✗ Bad for slow networks/devices<br/>
                ✗ No social media previews<br/>
                ✗ Requires loading states everywhere
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Perfect for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Authenticated web applications (dashboards, admin panels)</li>
          <li>• Rich interactive apps (Gmail, Figma, Notion)</li>
          <li>• Real-time collaboration tools</li>
          <li>• Progressive Web Apps (PWAs)</li>
          <li>• Internal enterprise software</li>
        </ul>

        <p><strong>Avoid for:</strong></p>
        <ul className="space-y-1">
          <li>• Content-driven sites (blogs, news, docs) - use SSG/SSR</li>
          <li>• E-commerce product pages - poor SEO hurts revenue</li>
          <li>• Marketing landing pages - slow load = high bounce rate</li>
          <li>• Public content requiring social sharing</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            <strong>Key Trade-off:</strong> CSR sacrifices initial load performance and SEO for faster subsequent
            navigation and richer interactivity. Know when this trade-off makes sense.
          </li>
          <li>
            <strong>Bundle Size Matters:</strong> Mention code splitting, lazy loading, and tree shaking. Target
            {'<'}200KB initial JS. Use dynamic imports: <code className="text-sm">React.lazy(() =&gt; import('./Heavy'))</code>
          </li>
          <li>
            <strong>SEO Solutions:</strong> Be ready to discuss workarounds: prerendering (prerender.io), dynamic
            rendering (separate crawlers), or switching to SSR/SSG.
          </li>
          <li>
            <strong>Performance Metrics:</strong> CSR typically has slow FCP (First Contentful Paint) and TTI
            (Time to Interactive). Fast LCP requires optimization. Mention Core Web Vitals.
          </li>
          <li>
            <strong>Compare with SSR:</strong> CSR = fast after load, poor SEO. SSR = fast initial load, good SEO,
            but more server cost. Hybrid approaches (Next.js) combine both.
          </li>
          <li>
            <strong>Real Examples:</strong> Reference apps like Vercel Dashboard (CSR makes sense - authenticated,
            no SEO needs) vs. blog (CSR would be wrong choice).
          </li>
          <li>
            <strong>Optimization Techniques:</strong> Service workers for caching, skeleton screens for perceived
            performance, prefetching for predicted routes, and optimistic UI updates.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: Why is CSR bad for SEO?</p>
            <p className="mt-2 text-sm">
              A: Search engine crawlers receive empty HTML. Content only appears after JavaScript executes and data
              loads. While Googlebot can render JS, it's slow and unreliable. Other crawlers (Bing, social media
              bots) often can't execute JS at all, seeing no content.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you optimize CSR performance?</p>
            <p className="mt-2 text-sm">
              A: Code splitting by route, tree shaking unused code, lazy loading images/components, service worker
              caching, compression (Brotli), using CDN, prefetching likely routes, skeleton screens, and keeping
              initial bundle under 200KB.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: CSR vs SSR - when to use each?</p>
            <p className="mt-2 text-sm">
              A: Use CSR for authenticated apps where SEO doesn't matter and interactivity is critical (dashboards,
              tools). Use SSR for public content, e-commerce, or marketing sites where SEO and fast initial load
              matter. Or use hybrid (Next.js) to get benefits of both.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
