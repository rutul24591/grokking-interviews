"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-islands-ar-concise",
  title: "Islands Architecture",
  description: "Explore islands architecture pattern for building performant web apps with isolated interactive components in a sea of static content.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "islands-architecture",
  version: "concise",
  wordCount: 2100,
  readingTime: 8,
  lastUpdated: "2026-03-06",
  tags: ["frontend", "rendering", "architecture", "Astro", "performance"],
};

export default function IslandsArchitectureConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Islands Architecture</strong> is a rendering pattern where interactive components ("islands") are
          embedded within static HTML ("sea"). Coined by Jason Miller in 2019, this approach ships minimal JavaScript
          by default and only hydrates specific interactive regions. Unlike traditional SPAs that hydrate the entire
          page, Islands Architecture selectively hydrates individual components based on need.
        </p>
        <p>
          <strong>Core Principle:</strong> Start with static HTML; opt-in to interactivity rather than opt-out.
          Each island hydrates independently, reducing total JavaScript by 60-80% compared to SPAs. Popular in
          frameworks like <strong>Astro</strong>, <strong>Fresh</strong>, and Next.js Server Components.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul>
          <li>
            <strong>Static-by-Default:</strong> Everything is static HTML unless explicitly marked as an island.
            No JavaScript shipped for non-interactive content (headers, paragraphs, images, footers).
          </li>
          <li>
            <strong>Islands of Interactivity:</strong> Interactive components (search bars, carousels, forms) are
            "islands" that hydrate independently. Page might have 3-5 islands totaling 50-100KB JS vs. 500KB+ SPA.
          </li>
          <li>
            <strong>Component-Level Hydration:</strong> Each island has its own bundle and hydrates separately.
            If one island fails, others still work. Islands can even use different frameworks (React + Vue + Svelte).
          </li>
          <li>
            <strong>Lazy Hydration:</strong> Islands hydrate based on strategies: on load (<code>client:load</code>),
            on idle (<code>client:idle</code>), when visible (<code>client:visible</code>), or on interaction.
            Optimizes TTI by deferring non-critical islands.
          </li>
          <li>
            <strong>Isolation:</strong> Islands don{'\''}t share global state by default. Communication happens via
            events, URL state, or explicit shared stores. This isolation enables framework mixing and independent
            deployment.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <p><strong>Astro Implementation:</strong></p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- pages/blog.astro -->
---
import Header from '../components/Header.astro'; // Static
import SearchBar from '../components/SearchBar.jsx'; // React Island
import Comments from '../components/Comments.svelte'; // Svelte Island
---

<html>
  <body>
    <!-- Static HTML (no JS) -->
    <Header />

    <main>
      <h1>My Blog</h1>

      <!-- Island 1: Hydrate immediately -->
      <SearchBar client:load />

      <!-- Static article content -->
      <article>
        <h2>Article Title</h2>
        <p>5,000 words of static HTML...</p>
      </article>

      <!-- Island 2: Hydrate when visible -->
      <Comments client:visible postId="123" />
    </main>
  </body>
</html>

// SearchBar.jsx - React Island
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

// Result: 5KB HTML + 15KB search island + 12KB comments island (when visible)
// vs. Traditional SPA: 5KB HTML + 500KB full React app`}</code>
        </pre>
      </section>

      <section>
        <h2>Hydration Strategies</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Strategy</th>
              <th className="text-left">When to Use</th>
              <th className="text-left">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>client:load</code></td>
              <td>Critical interactive elements</td>
              <td>Search bar, navigation, checkout button</td>
            </tr>
            <tr>
              <td><code>client:idle</code></td>
              <td>Important but non-critical</td>
              <td>Comment forms, social sharing widgets</td>
            </tr>
            <tr>
              <td><code>client:visible</code></td>
              <td>Below-the-fold content</td>
              <td>Carousels, charts, videos, recommendation widgets</td>
            </tr>
            <tr>
              <td><code>client:media</code></td>
              <td>Conditional on viewport size</td>
              <td>Mobile-only menu, desktop-only sidebar</td>
            </tr>
            <tr>
              <td><code>client:only</code></td>
              <td>Client-only rendering (no SSR)</td>
              <td>Browser-dependent components, canvas animations</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Pros & Cons</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Pros</th>
              <th className="text-left">Cons</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Minimal JavaScript:</strong> Ship 60-80% less JS than SPAs</td>
              <td><strong>Complexity:</strong> Requires planning which components are islands</td>
            </tr>
            <tr>
              <td><strong>Fast FCP:</strong> Static HTML displays instantly (100-300ms)</td>
              <td><strong>State Management:</strong> Islands are isolated; global state is harder</td>
            </tr>
            <tr>
              <td><strong>Excellent SEO:</strong> Pre-rendered HTML visible to crawlers</td>
              <td><strong>Learning Curve:</strong> Different mental model from SPAs</td>
            </tr>
            <tr>
              <td><strong>Progressive TTI:</strong> Critical islands interactive first</td>
              <td><strong>Not for Heavy Apps:</strong> Poor fit for dashboards, editors, tools</td>
            </tr>
            <tr>
              <td><strong>Framework Agnostic:</strong> Mix React, Vue, Svelte in one page</td>
              <td><strong>Build Complexity:</strong> More moving parts at build time</td>
            </tr>
            <tr>
              <td><strong>Better Mobile Perf:</strong> Less JS parsing on slow devices</td>
              <td><strong>Island Communication:</strong> Requires explicit patterns (events, stores)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Ideal Use Cases:</strong></p>
        <ul>
          <li>
            <strong>Content-Heavy Sites:</strong> Blogs, news, documentation, marketing sites where content
            dominates (80%+) and interactivity is sparse (20% or less). Perfect for sites prioritizing FCP and SEO.
          </li>
          <li>
            <strong>E-Commerce Product Pages:</strong> Static product descriptions, specs, reviews. Islands for
            add-to-cart, size selector, image carousel. Reduces JS while keeping key interactions fast.
          </li>
          <li>
            <strong>Landing Pages:</strong> Marketing pages needing 95+ Lighthouse scores. Static hero, features,
            testimonials. Islands for signup forms, demo videos, chatbots.
          </li>
          <li>
            <strong>Documentation Sites:</strong> Mostly markdown/static. Islands for search, theme toggle, code
            playgrounds, version switcher. See Astro docs, Deno docs.
          </li>
        </ul>

        <p><strong>Not Ideal For:</strong></p>
        <ul>
          <li>
            <strong>Highly Interactive Apps:</strong> Dashboards, admin panels, collaborative tools (Figma, Notion,
            Google Docs) where {'>'} 80% of UI is interactive. These benefit from SPA architecture.
          </li>
          <li>
            <strong>Apps with Complex State:</strong> Applications requiring deeply nested global state, real-time
            sync across components, or heavy inter-component communication. Islands make this harder.
          </li>
          <li>
            <strong>Single-Page Workflows:</strong> Multi-step forms, wizards, checkout flows where the entire
            experience is one interactive session. SPAs handle this better.
          </li>
        </ul>
      </section>

      <section>
        <h2>Comparison: Islands vs. SPA vs. SSR</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Metric</th>
              <th className="text-left">Islands</th>
              <th className="text-left">SPA (CSR)</th>
              <th className="text-left">Full SSR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>JavaScript Size</td>
              <td>50-150KB</td>
              <td>300KB-2MB</td>
              <td>300KB-2MB</td>
            </tr>
            <tr>
              <td>First Contentful Paint</td>
              <td>100-300ms</td>
              <td>2-5s</td>
              <td>500ms-1s</td>
            </tr>
            <tr>
              <td>Time to Interactive</td>
              <td>Progressive (800ms-3s)</td>
              <td>3-10s</td>
              <td>3-10s</td>
            </tr>
            <tr>
              <td>SEO</td>
              <td>Excellent</td>
              <td>Poor</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>Best For</td>
              <td>Content + sparse interactivity</td>
              <td>App-like experiences</td>
              <td>Dynamic personalized content</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Popular Frameworks</h2>
        <ul>
          <li>
            <strong>Astro:</strong> Most popular Islands framework. Supports React, Vue, Svelte, Solid, Preact.
            Flexible hydration directives. Used by Google, Firebase, The Guardian.
          </li>
          <li>
            <strong>Fresh:</strong> Deno{'\''}s Islands framework. Convention-based (files in <code>islands/</code> folder).
            Uses Preact. Zero build step. Ideal for edge deployments.
          </li>
          <li>
            <strong>Next.js Server Components:</strong> Hybrid approach. Server Components are static by default;
            Client Components (marked <code>{'\'use client\''}</code>) act as islands.
          </li>
          <li>
            <strong>Marko:</strong> eBay{'\''}s framework with partial hydration. Used in production at eBay for years.
            Fine-grained reactivity.
          </li>
          <li>
            <strong>Qwik:</strong> Experimental. No hydration—"resumability" approach. Serializes state to HTML and
            resumes execution without re-running JavaScript.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul>
          <li>
            <strong>Define the Metaphor:</strong> Explain as "islands of interactivity in a sea of static HTML."
            Emphasize static-by-default vs. interactive-by-default (SPAs).
          </li>
          <li>
            <strong>Know the Origin:</strong> Jason Miller, 2019. Popularized by Astro and Fresh. Related to
            partial hydration but more architectural.
          </li>
          <li>
            <strong>Explain Hydration Strategies:</strong> Be ready to describe <code>client:load</code>,
            <code>client:idle</code>, <code>client:visible</code>. Why defer hydration? (Performance, TTI).
          </li>
          <li>
            <strong>Compare to SPAs:</strong> Islands ship 60-80% less JS. FCP is 5-10x faster. But harder to manage
            global state and less intuitive for developers used to SPAs.
          </li>
          <li>
            <strong>Trade-off Discussion:</strong> Islands excel for content sites but struggle with heavily
            interactive apps. State management between islands is complex. Best for {'<'}20% interactivity.
          </li>
          <li>
            <strong>Real-World Example:</strong> Describe a blog post page: static header/footer/article (no JS),
            islands for search bar (client:load), comments (client:visible), share buttons (client:idle).
            Result: 5KB HTML + 40KB total JS vs. 5KB HTML + 500KB SPA.
          </li>
          <li>
            <strong>Framework Knowledge:</strong> Mention Astro as the leader. Fresh for Deno. Next.js Server
            Components as a hybrid. Show awareness of ecosystem.
          </li>
          <li>
            <strong>Performance Metrics:</strong> Islands improve FCP, TTI, Total Blocking Time, and JavaScript
            bytes. Excellent Lighthouse scores (95-100). Great for SEO and Core Web Vitals.
          </li>
          <li>
            <strong>When NOT to Use:</strong> Be clear: not for dashboards, collaborative tools, or apps where
            {'>'} 80% is interactive. Interviewers appreciate understanding limitations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Key Takeaways</h2>
        <ul>
          <li>Islands Architecture = Static HTML + selective interactive islands</li>
          <li>Reduces JavaScript by 60-80% compared to SPAs</li>
          <li>Each island hydrates independently based on strategy (load, idle, visible)</li>
          <li>Best for content-heavy sites with sparse interactivity ({'<'}20%)</li>
          <li>Astro is the most popular framework; Fresh and Next.js Server Components also support it</li>
          <li>Trade-off: Better performance vs. more complex state management</li>
          <li>Not ideal for highly interactive apps (dashboards, editors, tools)</li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
