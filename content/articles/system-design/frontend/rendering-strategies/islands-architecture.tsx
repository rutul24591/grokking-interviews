"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-islands-ar-extensive",
  title: "Islands Architecture",
  description:
    "Explore islands architecture pattern for building performant web apps with isolated interactive components in a sea of static content.",
  category: "frontend",
  subcategory: "rendering-strategies",
  slug: "islands-architecture",
  wordCount: 3400,
  readingTime: 14,
  lastUpdated: "2026-03-06",
  tags: [
    "frontend",
    "rendering",
    "architecture",
    "Astro",
    "performance",
    "partial-hydration",
  ],
  relatedTopics: [
    "partial-hydration",
    "progressive-hydration",
    "static-site-generation",
  ],
};

export default function IslandsArchitectureConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Islands Architecture</strong> is a rendering pattern that
          combines the benefits of static HTML with islands of interactivity.
          The concept treats interactive components as isolated "islands"
          embedded within a "sea" of static, non-interactive HTML. Each island
          hydrates independently and progressively, rather than requiring the
          entire page to become interactive at once.
        </HighlightBlock>
        <p>
          The term was coined by <strong>Jason Miller</strong> (creator of
          Preact) in his influential 2019 blog post "Islands Architecture."
          Miller observed that most web pages consist primarily of static
          content with small, isolated regions requiring interactivity (forms,
          carousels, modals, search bars). Traditional SPAs hydrate the entire
          page with JavaScript, even when 90% of the page is static. Islands
          Architecture challenges this approach by hydrating only what needs to
          be interactive.
        </p>
        <p>
          The pattern gained mainstream adoption with frameworks like{" "}
          <strong>Astro</strong> (2021), <strong>Fresh</strong>
          (Deno's framework, 2022), <strong>Marko</strong> (eBay's framework),{" "}
          <strong>Qwik</strong>, and
          <strong>11ty + is-land</strong>. Even meta-frameworks like Next.js and
          Remix have incorporated islands-like concepts through Server
          Components and progressive enhancement strategies. Islands
          Architecture represents a fundamental shift: instead of shipping
          JavaScript by default and opting out, you ship static HTML by default
          and opt in to interactivity only where needed.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <p>
          Understanding Islands Architecture requires grasping several
          fundamental concepts:
        </p>
        <ul>
          <HighlightBlock as="li" tier="important">
            <strong>Static-by-Default:</strong> The entire page is rendered as
            static HTML during build or on the server. No JavaScript is shipped
            unless explicitly requested. This is the opposite of traditional
            SPAs where everything is JavaScript-driven by default.
          </HighlightBlock>
          <li>
            <strong>Islands of Interactivity:</strong> Interactive components
            (React, Vue, Svelte, Solid, etc.) are designated as "islands." These
            islands are embedded within static HTML and hydrate independently
            when needed. An island might be a search bar, product carousel,
            comment form, or live chart.
          </li>
          <li>
            <strong>Component-Level Hydration:</strong> Unlike full-page
            hydration where the entire React tree hydrates, islands hydrate one
            component at a time. If a page has 3 islands, each hydrates
            independently with its own JavaScript bundle. Islands can even use
            different frameworks (React island + Vue island).
          </li>
          <li>
            <strong>Partial Hydration:</strong> Islands Architecture is a form
            of partial hydration—only portions of the page become interactive.
            The static HTML remains static, reducing JavaScript execution time,
            memory usage, and bundle size. This is fundamentally different from
            progressive hydration which hydrates the entire tree in stages.
          </li>
          <li>
            <strong>Isolation & Encapsulation:</strong> Each island is isolated
            with its own state, props, and lifecycle. Islands don't share a
            global state tree like traditional SPAs. Communication between
            islands happens via events, shared state managers, or URL
            parameters. This isolation enables framework mixing.
          </li>
          <li>
            <strong>Lazy Hydration Strategies:</strong> Islands can hydrate
            based on different triggers: on page load, on idle
            (requestIdleCallback), on visible (IntersectionObserver), on media
            query, or on interaction (click). For example, a below-the-fold
            carousel might only hydrate when scrolled into view.
          </li>
          <li>
            <strong>Server-First Rendering:</strong> Islands are rendered on the
            server (SSR or SSG) to produce static HTML with data baked in. The
            HTML is immediately visible to users and crawlers. Client-side
            hydration attaches event handlers and enables interactivity after
            the HTML is displayed.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>The Islands Architecture follows this build and runtime pattern:</p>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Islands Build & Runtime Flow
          </h3>
          <div className="mb-6">
            <h4 className="mb-2 font-semibold text-sm">Build Time:</h4>
            <ol className="space-y-2 text-sm">
              <li>
                <strong>1. Identify Islands:</strong> Developer marks components
                as islands (e.g., <code>{"<MyComponent client:load />"}</code>{" "}
                in Astro)
              </li>
              <li>
                <strong>2. Render Static HTML:</strong> All content (including
                island server HTML) is rendered to static HTML
              </li>
              <li>
                <strong>3. Extract Island JavaScript:</strong> Each island{"'"}s
                client code is bundled separately (e.g., island-search.js,
                island-carousel.js)
              </li>
              <li>
                <strong>4. Generate Hydration Markers:</strong> HTML includes
                data attributes marking island boundaries and hydration strategy
              </li>
              <li>
                <strong>5. Optimize Assets:</strong> Tree-shake unused code;
                each island only includes its dependencies
              </li>
              <li>
                <strong>6. Output Static Files:</strong> HTML + per-island JS
                bundles deployed to CDN
              </li>
            </ol>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-sm">
              Runtime (User Request):
            </h4>
            <ol className="space-y-2 text-sm">
              <li>
                <strong>1. Deliver HTML:</strong> CDN serves pre-rendered HTML
                instantly (FCP {"&lt;"}100ms)
              </li>
              <li>
                <strong>2. Parse HTML:</strong> Browser displays static content
                immediately—page is readable
              </li>
              <li>
                <strong>3. Discover Islands:</strong> Framework runtime scans
                for island markers in DOM
              </li>
              <li>
                <strong>4. Evaluate Hydration Strategy:</strong> Check if island
                should hydrate (load, idle, visible, interaction)
              </li>
              <li>
                <strong>5. Load Island JavaScript:</strong> Fetch only the
                required island bundles (10-50KB each)
              </li>
              <li>
                <strong>6. Hydrate Island:</strong> Attach event listeners and
                initialize component state for that island
              </li>
              <li>
                <strong>7. Island Interactive:</strong> That specific island
                becomes interactive; rest of page remains static
              </li>
              <li>
                <strong>8. Repeat for Other Islands:</strong> Each island
                hydrates independently based on its strategy
              </li>
            </ol>
          </div>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/islands-architecture-concept.svg"
          alt="Islands Architecture Concept"
          caption="Islands Architecture Concept - Interactive islands (purple) embedded in static HTML (gray)"
        />

        <HighlightBlock as="p" tier="crucial">
          This architecture provides the best of both worlds: instant content
          display from static HTML plus interactive features where needed.
          Unlike traditional SPAs that ship 500KB+ of JavaScript to make
          everything interactive, Islands might ship{" "}
          <Highlight tier="important">50-100KB total across all islands</Highlight>.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/islands-runtime-flow.svg"
          alt="Islands Architecture Runtime Flow"
          caption="Islands Architecture Runtime Flow - Progressive, on-demand hydration of independent islands"
        />
      </section>

      <section>
        <h2>Hydration Strategies</h2>
        <p>
          Islands Architecture supports multiple hydration strategies to
          optimize when islands become interactive:
        </p>

        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Strategy</th>
              <th className="text-left">Description</th>
              <th className="text-left">Use Case</th>
              <th className="text-left">Astro Directive</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Load</strong>
              </td>
              <td>Hydrate immediately on page load</td>
              <td>Critical interactive elements (search, navigation)</td>
              <td>
                <code>client:load</code>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Idle</strong>
              </td>
              <td>Hydrate when browser is idle (requestIdleCallback)</td>
              <td>
                Important but non-critical (comment forms, social widgets)
              </td>
              <td>
                <code>client:idle</code>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Visible</strong>
              </td>
              <td>
                Hydrate when island enters viewport (IntersectionObserver)
              </td>
              <td>Below-the-fold content (carousels, charts, videos)</td>
              <td>
                <code>client:visible</code>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Media</strong>
              </td>
              <td>Hydrate when media query matches</td>
              <td>Mobile-only or desktop-only components</td>
              <td>
                <code>client:media</code>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Only</strong>
              </td>
              <td>Never hydrate; render HTML only</td>
              <td>Static components that look interactive but aren{"'"}t</td>
              <td>
                <code>client:only</code>
              </td>
            </tr>
          </tbody>
        </table>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/rendering-strategies/islands-hydration-timeline.svg"
          alt="Island Hydration Timeline"
          caption="Island Hydration Timeline - Different strategies optimize when each island becomes interactive"
        />
      </section>

      <section>
        <h2>Trade-offs & Comparisons</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Aspect</th>
              <th className="text-left">Islands Architecture</th>
              <th className="text-left">Traditional SPA</th>
              <th className="text-left">Full SSR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>JavaScript Shipped</strong>
              </td>
              <td>50-150KB (only islands)</td>
              <td>300KB-2MB (entire app)</td>
              <td>300KB-2MB (entire app)</td>
            </tr>
            <tr>
              <td>
                <strong>First Contentful Paint</strong>
              </td>
              <td>Excellent (100-300ms)</td>
              <td>Poor (2-5s blank screen)</td>
              <td>Good (500ms-1s)</td>
            </tr>
            <tr>
              <td>
                <strong>Time to Interactive</strong>
              </td>
              <td>Progressive (800ms-3s per island)</td>
              <td>Slow (3-10s for everything)</td>
              <td>Slow (3-10s for everything)</td>
            </tr>
            <tr>
              <td>
                <strong>SEO</strong>
              </td>
              <td>Excellent (static HTML)</td>
              <td>Poor (requires JS execution)</td>
              <td>Excellent (server-rendered)</td>
            </tr>
            <tr>
              <td>
                <strong>Developer Experience</strong>
              </td>
              <td>Requires planning (mark islands)</td>
              <td>Familiar (everything interactive)</td>
              <td>Familiar (React as usual)</td>
            </tr>
            <tr>
              <td>
                <strong>State Management</strong>
              </td>
              <td>Complex (islands are isolated)</td>
              <td>Simple (global state tree)</td>
              <td>Simple (global state tree)</td>
            </tr>
            <tr>
              <td>
                <strong>Framework Flexibility</strong>
              </td>
              <td>Mix frameworks per island</td>
              <td>Single framework</td>
              <td>Single framework</td>
            </tr>
            <tr>
              <td>
                <strong>Best For</strong>
              </td>
              <td>Content sites with sparse interactivity</td>
              <td>Highly interactive apps</td>
              <td>Dynamic, personalized content</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          To build performant applications with Islands Architecture, follow
          these practices:
        </p>

        <p>
          <strong>Island Identification:</strong> Treat islands as the
          exception, not the rule. Start with static HTML and only add islands
          for truly interactive components. Ask: "Does this component need to
          respond to user input or change dynamically?" If no, keep it static. A
          blog post with 5,000 words of text should have 0 islands—it{"'"}s just
          HTML.
        </p>

        <p>
          <strong>Choose the Right Hydration Strategy:</strong> Don{"'"}t
          default to <code>client:load</code> for everything. Use{" "}
          <code>client:visible</code> for below-the-fold components (carousels,
          charts) to defer loading until needed. Use <code>client:idle</code>{" "}
          for low-priority features (social sharing, comment forms). Reserve{" "}
          <code>client:load</code> for critical interactive elements (search,
          navigation, checkout).
        </p>

        <p>
          <strong>Minimize Island Dependencies:</strong> Each island ships its
          framework runtime and dependencies. Keep islands small by avoiding
          heavy libraries. If an island needs a 200KB charting library, consider
          whether that island could be pre-rendered as an image with progressive
          enhancement, or use a lighter alternative.
        </p>

        <p>
          <strong>Optimize Island Communication:</strong> Islands are isolated,
          so inter-island communication requires intentional design. Options
          include: URL state (query params), custom events (EventTarget /
          CustomEvent), shared state managers (nano-stores, Zustand with
          persistence), or Web Components with attributes. Avoid coupling
          islands tightly—they should work independently.
        </p>

        <p>
          <strong>Progressive Enhancement:</strong> Design islands to degrade
          gracefully. A search island might render a static form that submits to
          the server if JavaScript fails. A carousel could display all images
          vertically without JavaScript, then enhance with swipe gestures once
          hydrated. Never rely solely on JavaScript for core functionality.
        </p>

        <p>
          <strong>Framework Selection:</strong> Islands Architecture lets you
          mix frameworks, but don{"'"}t overuse this. Each framework adds
          runtime overhead. If you have 5 React islands, 2 Vue islands, and 3
          Svelte islands, you{"'"}re shipping 3 framework runtimes. Standardize
          on one primary framework (usually React or Preact) and use others only
          when beneficial (e.g., Svelte for tiny animations).
        </p>

        <p>
          <strong>Measure Performance:</strong> Use Lighthouse, WebPageTest, and
          Core Web Vitals to validate improvements. Track JavaScript bytes
          shipped, TTI per island, and Total Blocking Time. Islands should
          reduce total JS by 60-80% compared to traditional SPAs. If you{"'"}re
          not seeing dramatic improvements, you may be over-using islands.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Avoid these common mistakes when implementing Islands Architecture:
        </p>

        <ul>
          <li>
            <strong>Over-Islanding:</strong> Marking every component as an
            island defeats the purpose. If 80% of your page is islands, you{"'"}
            ve recreated a SPA with extra complexity. Islands should represent{" "}
            {"&lt;"}20% of page content. Be selective.
          </li>
          <li>
            <strong>Tight Island Coupling:</strong> Designing islands that
            depend on each other{"'"}s internal state creates fragile
            architectures. If Island A can{"'"}t function without Island B, they
            should probably be one island. Use event-driven communication or
            shared external state.
          </li>
          <li>
            <strong>Ignoring Accessibility:</strong> Static HTML is naturally
            accessible, but islands may not be. Ensure islands have proper ARIA
            labels, keyboard navigation, and focus management. Test with screen
            readers. Just because it{"'"}s static doesn{"'"}t mean it{"'"}s
            accessible.
          </li>
          <li>
            <strong>Client:Load Everything:</strong> Defaulting all islands to{" "}
            <code>client:load</code> means they all download and hydrate
            immediately, negating performance benefits. Use lazy strategies (
            <code>client:visible</code>, <code>client:idle</code>) for
            non-critical islands.
          </li>
          <li>
            <strong>Forgetting Mobile:</strong> Islands Architecture shines on
            mobile where JavaScript execution is slower. But downloading 5
            island bundles on 3G is still slow. Bundle carefully, use
            code-splitting, and test on real devices with network throttling.
          </li>
          <li>
            <strong>No Fallback for Failed Hydration:</strong> If island
            JavaScript fails to load (CDN down, ad blocker, CSP violation), the
            island becomes non-interactive. Design islands with server-side
            fallbacks or show error states to users.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <p>Islands Architecture excels in specific scenarios:</p>

        <ul>
          <li>
            <strong>Content-Heavy Sites:</strong> Blogs, documentation sites,
            marketing pages, news sites—anywhere content dominates over
            interactivity. The New York Times article page is 95% text and
            images; only the comment section, share buttons, and related
            articles widget need JavaScript.
          </li>
          <li>
            <strong>E-Commerce Product Pages:</strong> Product descriptions,
            specifications, reviews (pre-rendered) are static. Islands handle
            add-to-cart button, size selector, image carousel, and live
            inventory. This reduces JavaScript from 800KB to 80KB while keeping
            critical interactions fast.
          </li>
          <li>
            <strong>Documentation Sites:</strong> Docs are mostly static
            markdown. Islands power search bars, code playgrounds, version
            switchers, and theme toggles. Examples: Astro docs, Fresh docs, Deno
            docs—all use Islands Architecture.
          </li>
          <li>
            <strong>Landing Pages:</strong> Marketing landing pages need fast
            FCP for SEO and conversions. Static hero sections, feature lists,
            testimonials—only the signup form, demo video player, or chatbot are
            islands. This achieves Lighthouse scores of 95-100.
          </li>
          <li>
            <strong>Media Sites:</strong> News, video platforms,
            podcasts—content is king. Islands handle video players, comment
            threads, subscription prompts, and recommendation widgets. The BBC
            and CNN could benefit from Islands Architecture to reduce mobile
            page weight.
          </li>
        </ul>

        <p>
          Islands Architecture is <strong>not ideal</strong> for highly
          interactive applications like Gmail, Figma, Google Docs, or admin
          dashboards where {"&gt;"} 80% of the UI is interactive. These apps
          benefit from SPA architecture with optimized code splitting.
        </p>
      </section>

      <section>
        <h2>Frameworks & Ecosystem</h2>
        <p>
          Several frameworks have embraced Islands Architecture as a core
          pattern:
        </p>

        <ul>
          <li>
            <strong>Astro:</strong> The most popular Islands framework. Supports
            React, Vue, Svelte, Solid, Preact, Lit, Alpine—all as islands.
            Features flexible hydration directives (<code>client:load</code>,{" "}
            <code>client:visible</code>, etc.) and excellent DX. Used by Google,
            Firebase, and The Guardian.
          </li>
          <li>
            <strong>Fresh:</strong> Deno{"'"}s Islands framework.
            Convention-based (components in <code>islands/</code> folder
            auto-hydrate). Uses Preact for small runtime. Zero build step,
            instant refresh. Ideal for Deno Deploy edge deployments.
          </li>
          <li>
            <strong>Marko:</strong> eBay{"'"}s framework with Islands-like
            partial hydration. Fine-grained reactivity with resumability
            (hydration-free approach). Used in production at eBay for years.
            Less known but highly optimized.
          </li>
          <li>
            <strong>Qwik:</strong> Takes Islands further with "resumability"—no
            hydration at all. Serializes application state and listeners to
            HTML, resumes execution without re-running JavaScript. Still
            experimental but promising.
          </li>
          <li>
            <strong>11ty + is-land:</strong> Static site generator 11ty paired
            with <code>is-land</code> web component. Manually mark islands with{" "}
            <code>{"<is-land>"}</code> tags. Good for adding Islands to existing
            11ty sites.
          </li>
          <li>
            <strong>Next.js Server Components:</strong> Not pure Islands but
            similar philosophy. Server Components are static by default; Client
            Components (marked with <code>{"'use client'"}</code>) act as
            islands. Hybrid approach with streaming SSR.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul>
          <li>
            <a
              href="https://jasonformat.com/islands-architecture/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Islands Architecture (Jason Miller, 2019)
            </a>{" "}
            - Original blog post introducing the concept
          </li>
          <li>
            <a
              href="https://docs.astro.build/en/concepts/islands/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Astro Islands Documentation
            </a>{" "}
            - Official guide to implementing Islands in Astro
          </li>
          <li>
            <a
              href="https://fresh.deno.dev/docs/concepts/islands"
              target="_blank"
              rel="noopener noreferrer"
            >
              Fresh Islands Concepts
            </a>{" "}
            - Fresh framework{"'"}s approach to Islands
          </li>
          <li>
            <a
              href="https://www.patterns.dev/posts/islands-architecture"
              target="_blank"
              rel="noopener noreferrer"
            >
              Patterns.dev: Islands Architecture
            </a>{" "}
            - Comprehensive guide with examples and case studies
          </li>
          <li>
            <a
              href="https://docs.astro.build/en/guides/server-side-rendering/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Astro SSR + Islands Hybrid
            </a>{" "}
            - Combining server-side rendering with Islands for dynamic content
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
