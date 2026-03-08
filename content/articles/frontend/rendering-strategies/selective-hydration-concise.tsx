"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-selective-hydration-concise",
  title: "Selective Hydration",
  description: "Quick overview of Selective Hydration pattern for interviews and rapid learning.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "selective-hydration",
  version: "concise",
  wordCount: 890,
  readingTime: 4,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "hydration", "React", "performance"],
  relatedTopics: ["progressive-hydration", "islands-architecture", "partial-hydration"],
};

export default function SelectiveHydrationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Selective Hydration</strong> is a rendering optimization where only interactive components get hydrated
          with JavaScript, while static content remains as pure HTML with zero client-side framework overhead. Unlike
          traditional SSR where the entire page hydrates (even static paragraphs), selective hydration treats interactive
          components as &quot;islands&quot; in a sea of static HTML.
        </p>
        <p>
          The core insight: most pages are 80-90% static (text, images, layout) and only 10-20% interactive (buttons,
          forms, modals). Why ship JavaScript for the static 80%? Selective hydration ships zero JavaScript for static
          sections, dramatically reducing bundle size (60-90% reduction typical) and eliminating unnecessary hydration work.
          Perfect for content-driven sites like blogs, docs, news sites.
        </p>
      </section>

      <section>
        <h2>Key Concepts</h2>
        <ul className="space-y-2">
          <li>
            <strong>Static vs Interactive:</strong> The fundamental decision: Does this component need JavaScript?
            Static content (paragraphs, headings, images) = pure HTML, never hydrates. Interactive (forms, buttons
            with onClick) = hydrates with framework code.
          </li>
          <li>
            <strong>Islands Architecture:</strong> The architectural pattern. Page is an ocean of static HTML with
            small &quot;islands&quot; of interactivity. Each island hydrates independently, can use different frameworks
            (React island next to vanilla JS island).
          </li>
          <li>
            <strong>Zero JavaScript for Static:</strong> Static sections ship absolutely no JavaScript. No framework
            runtime, no virtual DOM, no event listeners. Just HTML/CSS. This is the key benefit.
          </li>
          <li>
            <strong>Explicit Opt-in:</strong> By default, components are static (no hydration). Developers explicitly
            mark components as interactive (Astro&apos;s client:*, Fresh islands directory, Marko :interactive).
            Inverts traditional &quot;hydrate everything&quot; model.
          </li>
          <li>
            <strong>Component Boundaries:</strong> Carefully define boundaries between static and interactive regions.
            A blog post is static, but a like button within it is interactive. Framework must know where each boundary
            lies.
          </li>
          <li>
            <strong>Framework-Agnostic:</strong> Because static sections have no framework code, each island can use
            any framework. Mix React islands with vanilla JS islands on same page.
          </li>
        </ul>
      </section>

      <section>
        <h2>Quick Example</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Astro Selective Hydration -->
---
import Header from '../components/Header.astro';
import BlogPost from '../components/BlogPost.astro';
import LikeButton from '../components/LikeButton.tsx';
import CommentSection from '../components/CommentSection.tsx';
import Footer from '../components/Footer.astro';
---

<html>
  <body>
    <!-- Static: zero JavaScript -->
    <Header />

    <!-- Static content -->
    <article>
      <h1>{post.title}</h1>
      <BlogPost content={post.content} />

      <!-- Interactive island: only this gets JS -->
      <LikeButton client:visible postId={post.id} />
    </article>

    <!-- Interactive island: hydrates when visible -->
    <CommentSection client:visible postId={post.id} />

    <!-- Static footer: zero JavaScript -->
    <Footer />
  </body>
</html>

<!-- Fresh (Deno) Islands -->
// routes/blog.tsx - everything static by default
export default function BlogPost({ post }) {
  return (
    <div>
      <header><h1>{post.title}</h1></header>
      <article dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Only islands/ components get JavaScript */}
      <LikeButton postId={post.id} />
      <CommentSection postId={post.id} />

      <footer>© 2026</footer>
    </div>
  );
}

// islands/LikeButton.tsx - auto-interactive
import { signal } from "@preact/signals";

export default function LikeButton({ postId }) {
  const likes = signal(0);
  return (
    <button onClick={() => likes.value++}>
      ❤️ Like ({likes.value})
    </button>
  );
}

<!-- Qwik (automatic selective hydration) -->
export default component$(() => {
  return (
    <div>
      {/* Static: zero JS */}
      <header><h1>Blog Post</h1></header>
      <article><p>Content...</p></article>

      {/* Interactive: JS loads on click */}
      <LikeButton postId="123" />

      {/* Static footer */}
      <footer>© 2026</footer>
    </div>
  );
});`}</code>
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
                ✓ 60-90% JavaScript reduction<br/>
                ✓ Dramatically faster TTI<br/>
                ✓ Minimal hydration work<br/>
                ✓ Low memory usage<br/>
                ✓ Perfect for content sites<br/>
                ✓ Framework-agnostic islands<br/>
                ✓ Excellent Core Web Vitals
              </td>
              <td className="p-3">
                ✗ Requires explicit marking<br/>
                ✗ New mental model<br/>
                ✗ Limited framework support<br/>
                ✗ Complex inter-island communication<br/>
                ✗ Not ideal for app-like UIs<br/>
                ✗ Careful boundary design needed<br/>
                ✗ More testing complexity
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>When to Use</h2>
        <p><strong>Perfect for:</strong></p>
        <ul className="mb-4 space-y-1">
          <li>• Content-driven sites (blogs, documentation, news)</li>
          <li>• Marketing landing pages (mostly static with few CTAs)</li>
          <li>• E-commerce product pages (description static, add-to-cart interactive)</li>
          <li>• Portfolio sites (projects static, contact form interactive)</li>
          <li>• Any site where 80%+ content is static</li>
          <li>• Sites prioritizing load speed and SEO</li>
        </ul>

        <p><strong>Avoid when:</strong></p>
        <ul className="space-y-1">
          <li>• Building highly interactive apps (dashboards, tools, SaaS)</li>
          <li>• Most content requires interactivity (real-time collaboration)</li>
          <li>• Heavy inter-component communication needed</li>
          <li>• Team unfamiliar with islands architecture</li>
          <li>• Framework doesn&apos;t support it (limited tooling)</li>
        </ul>
      </section>

      <section>
        <h2>Interview Tips</h2>
        <ul className="space-y-3">
          <li>
            <strong>Core Benefit:</strong> Selective hydration eliminates JavaScript for static content. A 2000-word
            blog post stays as pure HTML - no React virtual DOM, no framework overhead, no event listeners. This is 60-90%
            JS reduction for content sites.
          </li>
          <li>
            <strong>Islands Architecture:</strong> Know the term and concept. Static HTML ocean with interactive islands.
            Each island is independent, can use different frameworks, hydrates separately. Popularized by Astro, but
            concept originated from Jason Miller.
          </li>
          <li>
            <strong>vs Progressive vs Partial:</strong> Clear distinctions:
            <ul className="ml-6 mt-1">
              <li>• Selective: Static never hydrates. Only islands get JS.</li>
              <li>• Progressive: Everything hydrates, just in priority order.</li>
              <li>• Partial: Conditional hydration (visibility, interaction).</li>
            </ul>
          </li>
          <li>
            <strong>Framework Support:</strong> Mention Astro (native), Fresh (Deno), Qwik (automatic), Marko (eBay),
            Elder.js. React/Next.js don&apos;t natively support it (everything hydrates), though custom implementations
            possible.
          </li>
          <li>
            <strong>Real-World Impact:</strong> Reference Astro docs case study: 45KB JS vs 350KB for React docs,
            400ms TTI vs 2.5s. The Guardian and Medium use selective hydration patterns for article pages.
          </li>
          <li>
            <strong>Key Trade-off:</strong> Selective hydration sacrifices framework ubiquity for performance. You must
            think about static vs interactive boundaries. In return, you get massive JS savings and faster load times.
            Perfect trade-off for content sites.
          </li>
          <li>
            <strong>Common Pitfall:</strong> Nesting static content inside interactive components forces hydration of
            that content. Extract static content outside interactive boundaries. Keep islands small and focused.
          </li>
          <li>
            <strong>Technical Detail:</strong> At build time, framework analyzes components. Static components compile
            to HTML only. Interactive components compile to HTML + JS with island markers (data-island-id). Client
            finds markers and selectively hydrates only those nodes.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How does selective hydration differ from progressive hydration?</p>
            <p className="mt-2 text-sm">
              A: Selective hydration only hydrates interactive components - static content never gets JavaScript and
              stays as HTML forever. Progressive hydration hydrates everything eventually, just in priority order. For
              a blog post, selective hydration ships zero JS for the article text (static), while progressive would
              still hydrate it eventually. Selective achieves much larger JS reductions (60-90% vs 20-40%).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is islands architecture?</p>
            <p className="mt-2 text-sm">
              A: Islands architecture is the pattern underpinning selective hydration. The page is an ocean of static
              HTML with small &quot;islands&quot; of interactivity scattered throughout. Each island is independent, hydrates
              separately, and can even use different frameworks. For example, a blog post (static ocean) with a React
              like button island, a React comment section island, and vanilla JS theme toggle island.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: When should you use selective hydration?</p>
            <p className="mt-2 text-sm">
              A: Use selective hydration for content-driven sites where 80%+ of the page is static (blogs,
              documentation, news, marketing pages). If most content just needs to be displayed (not interactive),
              selective hydration eliminates framework overhead for that content. Avoid for highly interactive apps
              (dashboards, tools) where most components need JavaScript anyway.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
