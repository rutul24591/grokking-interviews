"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-server-sid-concise",
  title: "Server-Side Rendering (SSR)",
  description: "Quick overview of Server-Side Rendering pattern for interviews and rapid learning.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "server-side-rendering",
  version: "concise",
  wordCount: 920,
  readingTime: 4,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "SSR", "hydration", "performance"],
  relatedTopics: ["client-side-rendering", "static-site-generation", "streaming-ssr"],
};

export default function ServerSideRenderingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Server-Side Rendering (SSR)</strong> is a pattern where the server generates complete HTML for each
          request, including all content and data. The browser receives fully-formed markup, displays it immediately,
          then JavaScript downloads and "hydrates" the page to make it interactive. Unlike CSR's empty shell, SSR
          delivers visible content in the initial response.
        </p>
        <p>
          Modern SSR (Next.js, Nuxt, SvelteKit) combines fast initial load with rich interactivity. The server renders
          components to HTML, serializes data, and sends everything to the browser. After display, JavaScript attaches
          event listeners and state management, transforming static HTML into a dynamic app.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Server Rendering:</strong> Node.js server executes React/Vue components, fetches data, and
            generates HTML string for each request. Content is in the initial response.
          </li>
          <li>
            <strong>Hydration:</strong> After HTML displays, JavaScript "hydrates" the static markup by attaching
            event listeners and making it interactive. React reconciles with existing DOM.
          </li>
          <li>
            <strong>State Serialization:</strong> Server-fetched data is serialized as JSON in a script tag,
            sent with HTML, and reused client-side to avoid refetching.
          </li>
          <li>
            <strong>Double Rendering:</strong> Components render twice - server (for HTML) and client (for hydration).
            Must produce identical output to avoid hydration mismatches.
          </li>
          <li>
            <strong>TTFB vs FCP Trade-off:</strong> SSR has slower Time to First Byte (server processing) but
            faster First Contentful Paint (content in HTML). Opposite of CSR.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Next.js Pages Router - SSR
import type { GetServerSideProps } from 'next';

interface Props {
  user: { id: string; name: string };
}

// Runs on server for each request
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const userId = ctx.params!.id;
  const response = await fetch(\`https://api.example.com/users/\${userId}\`);
  const user = await response.json();

  return {
    props: { user }, // Serialized to client
  };
};

export default function UserPage({ user }: Props) {
  const [followers, setFollowers] = React.useState(0);

  // Client-side only - runs after hydration
  React.useEffect(() => {
    fetch(\`/api/followers/\${user.id}\`)
      .then(r => r.json())
      .then(data => setFollowers(data.count));
  }, [user.id]);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Followers: {followers}</p>
    </div>
  );
}

// Next.js App Router - SSR
async function UserPage({ params }: { params: { id: string } }) {
  // Data fetching on server
  const user = await fetch(
    \`https://api.example.com/users/\${params.id}\`,
    { cache: 'no-store' } // Force SSR
  ).then(r => r.json());

  return <h1>{user.name}</h1>;
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
                ✓ Fast First Contentful Paint<br/>
                ✓ Perfect SEO (content in HTML)<br/>
                ✓ Social media previews work<br/>
                ✓ Works without JavaScript<br/>
                ✓ Good for slow devices<br/>
                ✓ Better perceived performance
              </td>
              <td className="p-3">
                ✗ Slower Time to First Byte<br/>
                ✗ Requires Node.js server<br/>
                ✗ Higher server costs<br/>
                ✗ Hydration delay before interactive<br/>
                ✗ More complex architecture<br/>
                ✗ Hydration mismatch issues
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Perfect for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• E-commerce product pages (SEO critical, fast load = higher conversion)</li>
          <li>• News and media sites (content must appear fast)</li>
          <li>• Marketing landing pages (Core Web Vitals affect ranking)</li>
          <li>• Social media public pages (link previews, SEO)</li>
          <li>• Personalized content (Netflix, Spotify homepages)</li>
          <li>• Any public content requiring SEO and fast initial render</li>
        </ul>

        <p><strong>Avoid for:</strong></p>
        <ul className="space-y-1">
          <li>• Fully authenticated dashboards - no SEO benefit, use CSR</li>
          <li>• Static content (blogs, docs) - use SSG instead (faster, cheaper)</li>
          <li>• Real-time collaborative apps - too dynamic for SSR</li>
          <li>• Apps with very slow data fetching - blocks TTFB</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            <strong>Core Trade-off:</strong> SSR trades slower TTFB (server processing) for faster FCP (content
            immediately visible). Know when this trade-off makes sense vs CSR or SSG.
          </li>
          <li>
            <strong>Hydration is Critical:</strong> Understand hydration deeply. Server renders HTML, client "hydrates"
            it with JavaScript. If server/client output differs, you get hydration mismatches. Avoid Date.now(),
            Math.random(), browser APIs during render.
          </li>
          <li>
            <strong>Performance Metrics:</strong> SSR has good FCP/LCP but higher TTFB. Mention optimizations:
            streaming SSR (React 18), edge SSR (Vercel Edge), caching strategies, selective hydration.
          </li>
          <li>
            <strong>Compare All Patterns:</strong> Be ready to compare SSR vs CSR vs SSG vs ISR. SSR is middle ground:
            better SEO than CSR, more dynamic than SSG, but higher server cost than both.
          </li>
          <li>
            <strong>Real Examples:</strong> Reference Next.js (most popular), mention Amazon product pages (SSR for
            fast load + SEO), news sites (SSR for content delivery). Contrast with dashboards (CSR better).
          </li>
          <li>
            <strong>Modern Frameworks:</strong> Know that Next.js App Router uses Server Components (different from
            traditional SSR). Mention Nuxt (Vue), SvelteKit (Svelte), Remix (React) as SSR frameworks.
          </li>
          <li>
            <strong>SEO Advantage:</strong> SSR solves CSR's SEO problem. Content is in HTML, crawlers see it
            immediately. Social bots (Facebook, Twitter) generate correct previews.
          </li>
          <li>
            <strong>Common Pitfalls:</strong> Mention hydration mismatches, slow server data fetching blocking TTFB,
            exposing secrets in serialized state, and not handling server/client API differences.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is hydration and why is it needed?</p>
            <p className="mt-2 text-sm">
              A: Hydration is the process where client-side JavaScript attaches event listeners and state to
              server-rendered HTML. It's needed because SSR sends static HTML - the page is visible but not
              interactive. Hydration makes buttons clickable, forms submittable, and state management work.
              React reconciles its virtual DOM with existing DOM instead of replacing it.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: SSR vs CSR - when to use each?</p>
            <p className="mt-2 text-sm">
              A: Use SSR for public content needing SEO and fast initial load (e-commerce, news, marketing pages).
              Use CSR for authenticated apps where SEO doesn't matter and interactivity is key (dashboards, tools).
              SSR has fast FCP but slow TTFB. CSR has slow FCP but fast subsequent navigation. Hybrid approaches
              (Next.js) let you choose per-page.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What are hydration mismatches and how do you prevent them?</p>
            <p className="mt-2 text-sm">
              A: Hydration mismatches occur when server-rendered HTML differs from client-rendered output. Causes:
              using Date.now(), Math.random(), localStorage, or browser APIs during render. Prevent by ensuring
              identical server/client output. Use useEffect for client-only code. Validate that random/time-based
              values are serialized from server. Use suppressHydrationWarning only when necessary (like timestamps).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How would you optimize SSR performance?</p>
            <p className="mt-2 text-sm">
              A: Minimize TTFB by keeping data fetching fast ({'<'}500ms), using caching (Redis, CDN). Implement
              streaming SSR (React 18) to send HTML progressively. Use edge functions (Vercel, Cloudflare) for
              lower latency. Optimize hydration with code splitting and selective hydration. Consider ISR for
              mostly-static pages. Use CDN edge caching with stale-while-revalidate.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
