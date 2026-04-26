"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-selective-hydration-extensive",
  title: "Selective Hydration",
  description:
    "Comprehensive guide to Selective Hydration covering concepts, implementation patterns, and best practices for minimizing JavaScript overhead.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "selective-hydration",
  wordCount: 3150,
  readingTime: 13,
  lastUpdated: "2026-03-05",
  tags: ["frontend", "rendering", "hydration", "React", "performance"],
  relatedTopics: [
    "progressive-hydration",
    "islands-architecture",
    "partial-hydration",
  ],
};

export default function SelectiveHydrationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Selective Hydration</strong> is a rendering optimization
          technique where only interactive components are hydrated with
          JavaScript, while purely static content remains as plain HTML without
          any client-side framework overhead. Unlike traditional SSR where the
          entire page hydrates, selective hydration treats static and
          interactive components differently - shipping zero JavaScript for
          static sections like article text, images, or informational blocks.
        </HighlightBlock>
        <p>
          This approach fundamentally changes how we think about hydration. In
          traditional SSR with React or Angular, even a static paragraph of text
          gets &quot;hydrated&quot; - the framework attaches event listeners,
          builds a virtual DOM representation, and maintains component state,
          despite the content never changing or requiring interactivity. This
          wastes CPU cycles, memory, and JavaScript bundle size.
        </p>
        <p>
          Selective hydration emerged from the &quot;islands architecture&quot;
          pattern popularized by Astro, but the concept predates it. The core
          insight: most web pages are 80-90% static content (text, images,
          layout) and only 10-20% interactive components (buttons, forms,
          modals, carousels). Why hydrate and ship JavaScript for the static
          80%? Selective hydration treats interactive components as
          &quot;islands of interactivity&quot; in a sea of static HTML.
        </p>
        <p>
          This technique is particularly powerful for content-driven sites
          (blogs, documentation, news sites) where the majority of the page is
          static content with occasional interactive elements. Companies like
          The Guardian, Medium, and documentation platforms have adopted
          selective hydration patterns, reporting 60-80% reductions in
          JavaScript payload and corresponding improvements in performance
          metrics.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding selective hydration requires grasping several
          foundational concepts:
        </p>
        <ul>
          <li>
            <strong>Static vs Interactive Distinction:</strong> The fundamental
            decision for each component: Does it need JavaScript? Static content
            (paragraphs, headings, images, layout) gets server-rendered as HTML
            and never hydrates. Interactive components (forms, buttons with
            onClick, modals) hydrate with framework code.
          </li>
          <li>
            <strong>Component Boundaries:</strong> Carefully defining boundaries
            between static and interactive regions. A blog post body is static,
            but a &quot;like button&quot; within it is interactive. The
            framework must know where each boundary lies to selectively hydrate
            only the interactive parts.
          </li>
          <li>
            <strong>Islands Architecture:</strong> The architectural pattern
            underpinning selective hydration. The page is an ocean of static
            HTML with small &quot;islands&quot; of interactivity. Each island is
            independent, hydrates separately, and can use different frameworks
            (React island next to vanilla JS island).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Zero JavaScript for Static Content:</strong> The key benefit
            - static sections ship absolutely zero JavaScript. No framework
            runtime, no virtual DOM, no event listeners. Just HTML and CSS. This
            dramatically reduces bundle size and eliminates unnecessary
            hydration work.
          </HighlightBlock>
          <li>
            <strong>Explicit Interactivity Opt-in:</strong> By default,
            components are static (no hydration). Developers must explicitly
            mark components as interactive using directives (Astro&apos;s
            client:*, Fresh&apos;s islands, Marko&apos;s interactive). This
            inverts the traditional model where everything hydrates by default.
          </li>
          <li>
            <strong>Framework-Agnostic Boundaries:</strong> Because static
            sections have no framework code, each interactive island can use any
            framework. A page might have React islands and vanilla JS islands
            coexisting, each hydrating independently.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Selective hydration follows a distinct rendering and delivery pattern:
        </p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Selective Hydration Flow
          </h3>
          <ol className="space-y-3">
            <li>
              <strong>1. Build Time Analysis:</strong> Build tool analyzes
              components and identifies:
              <ul className="ml-6 mt-2 space-y-1">
                <li>
                  • Static components (no client directive) → compile to HTML
                  only
                </li>
                <li>
                  • Interactive components (with client directive) → compile to
                  HTML + JS
                </li>
              </ul>
            </li>
            <li>
              <strong>2. Server-Side Rendering:</strong> Server renders entire
              page to HTML
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Static sections: pure HTML, no framework markers</li>
                <li>
                  • Interactive sections: HTML + hydration markers
                  (data-island-id)
                </li>
              </ul>
            </li>
            <li>
              <strong>3. HTML Streaming:</strong> Browser receives complete
              HTML, displays immediately (fast FCP)
            </li>
            <li>
              <strong>4. Selective JavaScript Loading:</strong> Only load JS for
              interactive islands
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Static sections: zero JavaScript downloaded</li>
                <li>• Interactive islands: download minimal JS bundles</li>
              </ul>
            </li>
            <li>
              <strong>5. Island Hydration:</strong> Each interactive island
              hydrates independently
              <ul className="ml-6 mt-2 space-y-1">
                <li>• Find island DOM node via data-island-id</li>
                <li>• Initialize framework (React)</li>
                <li>• Attach event listeners and state</li>
                <li>• Island becomes interactive</li>
              </ul>
            </li>
            <li>
              <strong>6. Fully Interactive:</strong> All islands hydrated,
              static content remains static HTML
            </li>
          </ol>
        </div>

        <HighlightBlock as="p" tier="crucial">
          The key difference from traditional SSR: static sections never execute
          framework code. A 2000-word blog post stays as pure HTML - no React
          virtual DOM representation, no framework overhead, no event listeners.
          This eliminates{" "}
          <Highlight tier="important">80-90% of hydration work</Highlight> for
          content-heavy pages.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/selective-hydration-architecture.svg"
          alt="Selective Hydration Architecture"
          caption="Selective Hydration Architecture - Static content (gray) stays as HTML; only islands (purple) hydrate"
        />

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/selective-hydration-flow.svg"
          alt="Selective Hydration Flow"
          caption="Selective Hydration Flow - Only interactive islands download JS and hydrate; static content stays as HTML"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Aspect</th>
              <th className="p-3 text-left">Selective Hydration</th>
              <th className="p-3 text-left">Full Hydration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>JavaScript Payload</strong>
              </td>
              <td className="p-3">
                Minimal (only interactive islands)
                <br />
                60-90% reduction typical
                <br />
                50-200KB for content sites
              </td>
              <td className="p-3">
                Large (entire framework + app)
                <br />
                200KB-2MB typical
                <br />
                Everything downloads
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Hydration Work</strong>
              </td>
              <td className="p-3">
                Minimal CPU usage
                <br />
                Only hydrate interactive parts
                <br />
                Fast TTI
              </td>
              <td className="p-3">
                Heavy CPU usage
                <br />
                Hydrate entire page
                <br />
                Slow TTI
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Memory Usage</strong>
              </td>
              <td className="p-3">
                Low (no framework for static)
                <br />
                No virtual DOM overhead
                <br />
                Scales with interactivity
              </td>
              <td className="p-3">
                High (framework everywhere)
                <br />
                Virtual DOM for all content
                <br />
                Fixed overhead
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Developer Experience</strong>
              </td>
              <td className="p-3">
                Requires explicit marking
                <br />
                Think about boundaries
                <br />
                New mental model
              </td>
              <td className="p-3">
                Everything &quot;just works&quot;
                <br />
                No extra thought needed
                <br />
                Familiar pattern
              </td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>Best Use Case</strong>
              </td>
              <td className="p-3">
                Content-heavy sites
                <br />
                80% static, 20% interactive
                <br />
                Blogs, docs, news
              </td>
              <td className="p-3">
                App-like experiences
                <br />
                Mostly interactive
                <br />
                Dashboards, tools
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/selective-hydration-performance.svg"
          alt="Hydration Performance Comparison"
          caption="Hydration Performance Comparison - Selective hydration achieves 5x faster TTI by skipping static content"
        />

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            Selective vs Progressive vs Partial Hydration
          </h3>
          <ul className="space-y-2">
            <li>
              <strong>Selective:</strong> Only interactive components hydrate.
              Static content never gets JavaScript. Best for content-heavy
              sites. Largest JS savings.
            </li>
            <li>
              <strong>Progressive:</strong> Everything hydrates eventually, just
              in priority order. All components become interactive. Better for
              app-like experiences.
            </li>
            <li>
              <strong>Partial:</strong> Hydrates based on conditions
              (visibility, interaction). Middle ground between selective and
              progressive. Flexible but complex.
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-3">
          <li>
            <strong>Identify True Interactivity:</strong> Be honest about what
            needs JavaScript. Does that paragraph need React? Does that image
            need any framework? Most content doesn&apos;t. Reserve framework
            code for actual interactive components (forms, buttons with
            handlers, dynamic state).
          </li>
          <li>
            <strong>Design Clear Boundaries:</strong> Draw clear lines between
            static and interactive regions. A blog post is static, but a like
            button within it is interactive. Use component boundaries to enforce
            this separation. Avoid mixing static content inside interactive
            components.
          </li>
          <li>
            <strong>Use Framework-Native Solutions:</strong> Prefer frameworks
            with built-in selective hydration (Astro, Fresh, Qwik, Marko) over
            custom implementations. They handle edge cases, optimize bundle
            splitting, and provide better DX.
          </li>
          <li>
            <strong>Minimize Island Size:</strong> Keep interactive islands
            small and focused. A &quot;like button&quot; island should just be
            the button, not the entire article card. Smaller islands = smaller
            JS bundles.
          </li>
          <li>
            <strong>Lazy Load Island Code:</strong> Load each island&apos;s
            JavaScript on-demand. Use dynamic imports to split island code into
            separate bundles. Don&apos;t bundle all islands together.
          </li>
          <li>
            <strong>Consider Framework Choice Per Island:</strong> Take
            advantage of framework-agnostic architecture. Use React for complex
            islands, Preact for simple ones, vanilla JS for trivial ones. Mix
            and match based on needs.
          </li>
          <li>
            <strong>Test Without JavaScript:</strong> Your site should work
            (display content, navigate) with JavaScript disabled. Interactive
            features can degrade gracefully. This ensures accessibility and
            resilience.
          </li>
          <li>
            <strong>Monitor Real Performance:</strong> Track JavaScript payload
            size, TTI, and TBT. Compare before/after selective hydration. Expect
            50-80% JS reduction for content sites. Use lighthouse and RUM tools.
          </li>
          <li>
            <strong>Document Island Boundaries:</strong> Maintain clear
            documentation of which components are islands and why. This helps
            team members understand the architecture and make consistent
            decisions.
          </li>
          <li>
            <strong>Optimize Island Loading:</strong> Use appropriate hydration
            strategies (immediate, visible, idle, interaction) for each island.
            Critical islands load immediately, below-fold islands on visibility.
          </li>
        </ol>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Over-Hydrating Static Content:</strong> Marking too many
            components as interactive defeats the purpose. Be ruthless - if it
            doesn&apos;t have event handlers or state, it&apos;s static. A
            styled button that links to another page doesn&apos;t need React.
          </li>
          <li>
            <strong>Nesting Static Inside Interactive:</strong> Putting large
            static content inside an interactive component forces hydration of
            that content. Extract static content outside the interactive
            boundary.
          </li>
          <li>
            <strong>Sharing State Between Islands:</strong> Islands are
            independent by design. Sharing state between them is complex and
            often requires a global store. Reconsider your architecture if you
            need heavy inter-island communication.
          </li>
          <li>
            <strong>Large Island Bundles:</strong> If an island&apos;s
            JavaScript bundle is 200KB, you&apos;ve negated the benefits. Keep
            islands small, lazy load dependencies, and consider splitting into
            multiple islands.
          </li>
          <li>
            <strong>Ignoring SEO/Accessibility:</strong> Ensure static content
            is proper semantic HTML. Don&apos;t rely on JavaScript for critical
            content or navigation. The static HTML should be fully functional
            and accessible.
          </li>
          <li>
            <strong>Hydration Mismatch Errors:</strong> Server HTML must match
            client expectations. Be careful with timestamps, random values, or
            client-only logic. These cause hydration errors and force
            re-renders.
          </li>
          <li>
            <strong>Not Testing Edge Cases:</strong> What if an island fails to
            load? What if JavaScript is disabled? Ensure graceful degradation.
            Static content should always work, islands failing should be
            non-critical.
          </li>
          <li>
            <strong>Framework Lock-in Mentality:</strong> Thinking in
            traditional &quot;everything is React&quot; terms. Selective
            hydration invites framework diversity - embrace it. Use the right
            tool for each island.
          </li>
          <li>
            <strong>Poor Performance Monitoring:</strong> Not measuring the
            actual benefits. Track JavaScript payload, TTI, TBT before and
            after. Validate that selective hydration is actually improving your
            metrics.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Selective hydration excels in these scenarios:</p>

        <ul className="space-y-3">
          <li>
            <strong>Blogs & Content Sites:</strong> The Guardian and Medium use
            selective hydration patterns. Article text is pure HTML (zero JS),
            while like buttons, comment forms, and newsletters are interactive
            islands. Result: 70-80% reduction in JavaScript, faster load times,
            better reading experience.
          </li>
          <li>
            <strong>Documentation Sites:</strong> Astro docs, Deno docs, and
            Qwik docs use their own frameworks&apos; selective hydration. Main
            content is static, search is an interactive island, code examples
            have copy-to-clipboard islands. Typical JS payload: 30-80KB vs
            300KB+ for traditional SPA docs.
          </li>
          <li>
            <strong>Marketing Sites:</strong> Marketing landing pages are 90%
            static (hero, benefits, testimonials, footer) with small interactive
            islands (newsletter signup, demo request form, video player).
            Selective hydration achieves near-instant load times critical for
            conversion.
          </li>
          <li>
            <strong>E-commerce Product Pages:</strong> Product description,
            specs, and images are static. Add-to-cart button, variant selector,
            and reviews are interactive islands. This keeps page load fast while
            maintaining necessary interactivity for conversion.
          </li>
          <li>
            <strong>News Websites:</strong> Article text, images, and layout are
            static HTML. Comment sections, related articles widgets, and ad
            slots are interactive islands. This prioritizes reading experience
            while deferring secondary interactivity.
          </li>
          <li>
            <strong>Portfolio & Personal Sites:</strong> Profile, work samples,
            and about sections are static. Contact forms and project filters are
            interactive islands. Results in blazing-fast personal sites with
            minimal JS.
          </li>
        </ul>

        <div className="mt-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h3 className="mb-3 font-semibold">
            Case Study: Astro Documentation
          </h3>
          <p>
            Astro&apos;s own documentation site uses selective hydration
            (dogfooding their framework). Analysis shows:
          </p>
          <ul className="mt-2 space-y-1">
            <li>• 92% of page content is static HTML (zero JavaScript)</li>
            <li>
              • Only 3 islands per page: search, theme toggle, mobile menu
            </li>
            <li>
              • Total JavaScript payload: ~45KB (vs ~350KB for typical React doc
              site)
            </li>
            <li>• Time to Interactive: ~400ms (vs ~2.5s for full hydration)</li>
            <li>• Perfect Lighthouse performance score (100/100)</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does selective hydration differ from progressive hydration?
            </p>
            <p className="mt-2 text-sm">
              A: Selective hydration only hydrates interactive components -
              static content never gets JavaScript and stays as HTML forever.
              Progressive hydration hydrates everything eventually, just in
              priority order. For a blog post, selective hydration ships zero JS
              for the article text (static), while progressive would still
              hydrate it eventually. Selective achieves much larger JS
              reductions (60-90% vs 20-40%).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: What is islands architecture?</p>
            <p className="mt-2 text-sm">
              A: Islands architecture is the pattern underpinning selective
              hydration. The page is an ocean of static HTML with small
              &quot;islands&quot; of interactivity scattered throughout. Each
              island is independent, hydrates separately, and can even use
              different frameworks. For example, a blog post (static ocean) with
              a React like button island, a React comment section island, and
              vanilla JS theme toggle island.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: When should you use selective hydration?
            </p>
            <p className="mt-2 text-sm">
              A: Use selective hydration for content-driven sites where 80%+ of
              the page is static (blogs, documentation, news, marketing pages).
              If most content just needs to be displayed (not interactive),
              selective hydration eliminates framework overhead for that
              content. Avoid for highly interactive apps (dashboards, tools)
              where most components need JavaScript anyway.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://docs.astro.build/en/concepts/islands/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Astro Islands Architecture Documentation
            </a>
          </li>
          <li>
            <a
              href="https://fresh.deno.dev/docs/concepts/islands"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fresh (Deno) Islands Documentation
            </a>
          </li>
          <li>
            <a
              href="https://markojs.com/docs/hydration/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Marko Selective Hydration Guide
            </a>
          </li>
          <li>
            <a
              href="https://www.patterns.dev/posts/islands-architecture/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patterns.dev - Islands Architecture Pattern
            </a>
          </li>
          <li>
            <a
              href="https://jasonformat.com/islands-architecture/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Islands Architecture by Jason Miller (Creator)
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/rendering-strategies/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              web.dev - Rendering Strategies Comparison
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
