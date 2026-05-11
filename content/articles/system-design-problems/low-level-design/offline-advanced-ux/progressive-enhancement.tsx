"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import { Highlight } from "@/components/articles/Highlight";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-progressive-enhancement",
  title: "Progressive Enhancement System",
  description: "Building resilient apps with core functionality working without JavaScript, enhanced with JavaScript when available",
  category: "low-level-design",
  subcategory: "offline-advanced-ux",
  slug: "progressive-enhancement",
  wordCount: 6300,
  readingTime: 38,
  lastUpdated: "2026-05-06",
  tags: ["lld", "progressive-enhancement", "resilience", "accessibility", "javascript"],
  relatedTopics: ["offline-first-architecture", "visibility-based-rendering"],
};

export default function ProgressiveEnhancementArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A user visits a single-page application (SPA). JavaScript bundle is 500KB. Slow network (3G) takes 8 seconds to download and parse. For those 8 seconds, the page shows a blank screen. The user sees nothing, thinks the page is broken, and leaves. Even if they wait, perceived latency is high.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Progressive enhancement flips the paradigm: the server renders core content as HTML (no JavaScript required). The page displays immediately (under about 1 second). Core functionality works: users can view content, submit forms, navigate. JavaScript loads asynchronously and enhances the experience: smooth animations, instant form validation, rich interactions. If JavaScript fails to load, the app still works at baseline level.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Key insight: don't make users wait for JavaScript to render basic content. Deliver HTML immediately, enhance with JavaScript. This improves perceived performance, resilience (app works if JavaScript fails), accessibility (semantic HTML works with screen readers), and SEO (server renders content for crawlers).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Challenges: building apps that work with and without JavaScript requires discipline. Forms must post to server (fallback) and also POST via fetch (enhanced). Navigation must use links (fallback) and also use client-side routing (enhanced). State management must sync between server and client.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Explicit assumptions:</strong> Server can render core content. HTML forms are acceptable baseline UX (not ideal, but functional). JavaScript failures won't break core workflows. Progressive loading (prioritize critical JS) is feasible. User tolerance for baseline HTML UX exists.</HighlightBlock>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Server rendering:</strong> Server renders core HTML content without requiring JavaScript on client.</HighlightBlock>
          <HighlightBlock as="li" tier="important"><strong>Form submission:</strong> Forms work via traditional POST (server-side processing). JavaScript enhances with client-side validation and instant feedback (no page reload).</HighlightBlock>
          <li><strong>Navigation:</strong> Links navigate via traditional GET requests (page reload). JavaScript enhances with client-side routing (instant navigation, no reload).</li>
          <li><strong>JavaScript loading:</strong> Core functionality works before JavaScript loads. JavaScript loads asynchronously (non-blocking).</li>
          <li><strong>Graceful degradation:</strong> If JavaScript fails, page still functions (no blank screens, no hung interactions).</li>
          <HighlightBlock as="li" tier="important"><strong>Accessibility:</strong> Semantic HTML ensures screen readers and assistive technology work without JavaScript.</HighlightBlock>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important"><strong>Time to Interactive (TTI):</strong> Core content accessible within 1-2 seconds (HTML only). Full interactivity within 3-5 seconds (with JavaScript).</HighlightBlock>
          <li><strong>Perceived Performance:</strong> Users see content immediately; progressive enhancement creates smooth loading experience.</li>
          <li><strong>Resilience:</strong> App functions even if JavaScript fails to load or execute.</li>
          <HighlightBlock as="li" tier="crucial"><strong>Accessibility:</strong> Works with screen readers and keyboard navigation without JavaScript.</HighlightBlock>
          <li><strong>SEO:</strong> Server-rendered HTML is crawlable and indexable by search engines.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Approach</h2>
        <HighlightBlock as="p" tier="crucial">The architecture uses server-side rendering (SSR) to deliver initial HTML with core content. The server handles form submissions and navigation via traditional HTTP requests. JavaScript loads asynchronously and replaces traditional interactions with client-side equivalents (fetch-based form submission, client-side routing). If JavaScript fails, the traditional flow still works.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Layer 1 (HTML): semantic content and forms. Layer 2 (CSS): styling and layout. Layer 3 (JavaScript): interactivity and polish. Each layer builds on previous; functionality degrades gracefully if later layers fail.</HighlightBlock>
        <HighlightBlock as="p" tier="important">JavaScript strategy: load critical JS (routing, form enhancement) inline or as small bundle. Defer non-critical JS (analytics, tracking, heavy libraries). Prioritize loading by user importance: JavaScript for visible content loads first; off-screen content deferred.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/offline-advanced-ux/progressive-enhancement.svg"
          alt="Progressive enhancement pyramid from HTML baseline through CSS to JavaScript enhancement, with feature detection patterns and offline enhancement levels"
          caption="Progressive enhancement pyramid from HTML baseline through CSS to JavaScript enhancement, with feature detection patterns and offline enhancement levels"
        />

        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Server-Side Rendering</h3>
        <p>The server handles requests and renders full HTML responses with content embedded. For a user viewing a post, the server fetches the post, renders it as HTML (title, body, comments), and sends to client. The browser immediately displays the HTML; users see content without waiting for JavaScript.</p>
        <p>Framework support: frameworks like Next.js (React SSR), Remix, and SvelteKit provide server-side rendering out of the box. These frameworks render components on the server and hydrate on the client (client JS "takes over" the HTML, adding event listeners).</p>
        <p>Content strategy: prioritize server-rendering for above-the-fold content (visible without scroll). Below-fold content can lazy-load via JavaScript or server-side pagination.</p>
        <p><strong>Streaming and Incremental Rendering:</strong> Traditional SSR renders the entire page, then sends to client. For large pages (100+ items), this can take 500ms-1s. Streaming SSR renders content progressively: send above-the-fold HTML immediately, then stream below-fold content as it renders. The browser paints visible content first, then continues rendering off-screen sections. Frameworks like Next.js 13+ and Remix use streaming by default. This improves FCP significantly. Implement streaming by using flush() or flushSync() at strategic points in the render pipeline, sending complete sections as they finish rendering.</p>
        <p><strong>Data Fetching and Hydration Data Embedding:</strong> Server fetches data (e.g., post details, comments), renders HTML, and must also provide this data to the client for hydration. Embed the data in the HTML via a script tag with JSON containing initial state. Client reads this data and uses it to hydrate. This avoids duplicate data fetches (server fetch + client fetch). Ensure the JSON is properly escaped to prevent XSS. Use a serialization library (e.g., superjson) to handle non-JSON types (Dates, Maps). Additionally, minify embedded data to reduce HTML size (large JSON payloads inflate page size). Consider deferring non-critical data: only embed data for above-the-fold; lazy-load below-fold data via fetch after hydration.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Form Handling with Fallback</h3>
        <p>HTML forms have a built-in fallback: form.submit() causes a POST to the server. Traditional flow: user fills form, submits, server processes, renders new page. No JavaScript required. But experience is slow: full page reload, flash of content, loss of scroll position.</p>
        <p>JavaScript enhancement: intercept form submission via JavaScript, POST via fetch, process response, update page without reload. User sees instant feedback: "Comment posted!" without page refresh. But form still works without JavaScript (slower, but functional).</p>
        <p>Implementation: the enhanced path attaches a JavaScript submit handler that posts via fetch and updates the UI without a full reload. The fallback path uses a normal HTML form POST. The server must handle both cases: render a full page for traditional POST and return structured data for fetch-based enhancement.</p>
        <p><strong>Request Content Negotiation and Dual Response Handling:</strong> The server must serve both HTML (for traditional fallback) and JSON (for fetch enhancement). Use the Accept header or a URL parameter to differentiate: `POST /api/comment?format=json` returns JSON for enhanced clients; traditional POST returns HTML. Alternatively, send `Accept: application/json` from the fetch request and check the header on the server. A well-designed API serves the same data in multiple formats. Additionally, handle request bodies consistently: both form POST and fetch send data, but form POST is URL-encoded while fetch can send JSON. The server should parse both. Use a framework abstraction that handles this transparently (e.g., `express.urlencoded()` + `express.json()` middleware).</p>
        <p><strong>Form Validation and Error Presentation:</strong> Dual validation: server validates (required, format, permissions) and returns errors as HTML (fallback) or JSON (enhanced). Client can validate too (for immediate feedback), but server validation is authoritative. For enhanced clients, show validation errors inline (red border, error message below field, no page reload). For fallback clients, server re-renders the form with errors highlighted and data re-filled. Ensure error messages are consistent between paths. Additionally, handle optimistic updates: on enhanced clients, immediately update the UI before the server responds (e.g., show "Comment posted" optimistically). If the server rejects (validation error, permission denied), revert optimistically and show error. This improves perceived responsiveness.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Navigation and Client-Side Routing</h3>
        <p>HTML links navigate via traditional GET, which causes a page reload. User sees loading briefly and content appears. No JavaScript is required, but reload resets scroll position and focus state.</p>
        <p>JavaScript enhancement: intercept link clicks, fetch the page content via fetch, update the DOM, use History API to change the URL. User sees instant navigation (no reload) and smooth transitions. Links still work without JavaScript (reload, but functional).</p>
        <p>Implementation: JavaScript router attaches click handlers to links, intercepts navigation. Server API returns JSON of the new page content (or same HTML, parsed). Developers write navigation code that works both ways: traditional GET (returns HTML) and client-side routing (returns JSON or HTML, parsed).</p>
        <p><strong>History API and Browser Back/Forward Handling:</strong> Use the history.pushState method to update the URL without page reload when client-side routing occurs. This allows back/forward buttons to work correctly: pressing back calls the popstate event, allowing the router to restore the previous page state. Without history management, back/forward navigates to the HTTP-level history (outside your SPA), losing state. Implement a stack of page states: when navigating, push state; on popstate, pop and restore. This maintains bidirectional consistency with the browser history. Additionally, handle external navigations: link elements should use preventDefault only for same-origin links; allow cross-origin navigation to proceed normally (fallback to server). This avoids breaking legitimate external links.</p>
        <p><strong>Scroll Position Preservation and Focus Management:</strong> Full-page navigations reset scroll position to top. Client-side routing can preserve scroll or scroll to the new section. Save scroll position before navigation via sessionStorage. After updating DOM, restore the saved position. Alternatively, scroll to the first heading of the new page. Additionally, manage focus: when content updates, move focus to the main content area or heading. This helps screen reader users and improves UX perception (clear indication that page content changed). Use data attributes to identify content sections and restore exact scroll position even if DOM structure changes.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">JavaScript Loading Strategy</h3>
        <p>Critical path: server renders HTML, browser displays, user can interact. JavaScript loads asynchronously and should not block rendering. The app functions at baseline before JavaScript loads. Once JavaScript loads, it enhances the experience.</p>
        <p>Bundle splitting: split JavaScript into critical (core functionality, form enhancement, routing) and non-critical (analytics, tracking, fancy animations). Load critical inline or as small module. Defer non-critical with async or via code splitting (lazy load when needed).</p>
        <p>Fallback: if JavaScript fails to load (network error), core functionality still works. No blank screens, no hung buttons. The HTML form still submits, links still navigate. Experience degrades to baseline but remains functional.</p>
        <p><strong>Bundle Sizing and Prioritization Strategy:</strong> Keep critical bundle under 50KB (gzipped). Use dynamic imports for route-specific code: load JavaScript for the current page, lazy-load JS for other routes when the user navigates. Example: homepage loads routing and form handler JS (15KB critical). User navigates to /posts/1, dynamic import loads post-specific code (10KB, loaded on demand). This amortizes bundle size across navigation. Additionally, defer third-party scripts (analytics, ads, fonts): use async script loading or preload directives with low priority. If a third-party script fails, it shouldn't block the app. Measure bundle size in CI; alert if critical bundle exceeds 50KB, preventing regression.</p>
        <HighlightBlock as="p" tier="important"><strong>Error Handling and Graceful Degradation:</strong> If JavaScript fails to load (network error, timeout after 10 seconds), the app should still function. Implement a timeout: if JavaScript doesn't load within 10 seconds, consider it failed and enable fallback UI (show a message about potential feature limitations but don't disable the app). Additionally, wrap JavaScript initialization in error handling. If hydration or router initialization fails, log the error and allow the app to continue with fallback behavior. Monitor JavaScript errors via error boundaries or global error handlers; send to observability platform. For critical errors, show a message asking the user to refresh but only after they've tried to interact (avoid scaring users with error messages on initial load if the app is otherwise functional).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Hydration</h3>
        <p>Hydration is when client-side JavaScript "attaches" to server-rendered HTML. The server renders a static &lt;button&gt; element. Client JavaScript loads, finds the button, and attaches an event listener. Now the button is interactive (and works without page reload if JavaScript enhanced it).</p>
        <p>Hydration must match: server renders the same HTML that JavaScript expects. If mismatch (server renders "light mode" button, client renders "dark mode"), React throws hydration error and re-renders, causing flicker.</p>
        <p>Avoid hydration mismatches: don't render different content on server vs client (avoid using Date.now(), Math.random() in server render). Use dehydration/rehydration: server renders with data, embeds data in HTML, client uses same data to render.</p>
        <p><strong>Hydration Mismatch Debugging and Prevention:</strong> Hydration mismatches occur when server and client render different HTML. Common causes: (1) Using `Math.random()` or `Date.now()` in component render (server generates one value, client generates different). (2) Using `window.innerWidth` on server (undefined on server, causes conditional rendering). (3) Browser-specific CSS being applied differently. Debug by: comparing server-rendered HTML (via page source) with client-rendered HTML (via DevTools). Use React's error message (it highlights the mismatched element). Fix by: wrapping client-only code in `useEffect` (doesn't run on server), using suppressHydrationWarning for truly acceptable mismatches (e.g., timestamps), or ensuring server and client use the same data (embed in HTML via script tag). Testing: render the app on the server in a test, save HTML, render on client with same props, verify HTML matches. CI tools like `React Testing Library` can help automate this.</p>
        <p><strong>Partial Hydration and Progressive Enhancement:</strong> Full hydration (attaching JavaScript to every element) is expensive for large pages. Partial hydration only hydrates visible content; off-screen content hydrates on-demand. Example: hydrate above-fold content immediately (affects LCP), defer below-fold. Additionally, Islands Architecture hydrates individual components independently (e.g., a sidebar component hydrates separately from main content). This reduces initial JavaScript and hydration time. Implement by: splitting your app into islands, server-rendering each, embedding hydration instructions (e.g., `data-hydrate-on="visible"`), and hydrating on-demand via IntersectionObserver. This is more complex but significantly improves performance for large pages.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Accessibility Without JavaScript</h3>
        <p>Semantic HTML ensures accessibility: native interactive elements are keyboard navigable and correctly announced to assistive technologies. Forms are usable via keyboard, and structural landmarks provide reliable navigation for screen readers.</p>
        <HighlightBlock as="p" tier="crucial">JavaScript can enhance accessibility: add aria-live regions for dynamic updates, manage focus, provide keyboard shortcuts. But baseline accessibility comes from HTML. An app built with semantic HTML remains usable for screen reader users even without JavaScript.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Semantic HTML and ARIA Usage:</strong> Use semantic elements (button elements rather than divs with button roles), native form controls (select elements rather than custom dropdowns), and anchor tags for navigation. These have built-in keyboard navigation and screen reader announcements. Avoid over-using ARIA: ARIA is a bridge for inaccessible patterns, not a replacement for semantic HTML. When JavaScript is unavailable, ARIA attributes are often ignored by assistive tech. Instead, use server-side rendering to show/hide content. Additionally, ensure form labels are properly associated, help text is descriptive, and error messages are clearly linked to fields.</HighlightBlock>
        <HighlightBlock as="p" tier="important"><strong>Testing Accessibility Without JavaScript:</strong> Disable JavaScript in your browser DevTools and test the app. Can you navigate with keyboard only? Can you read the form with a screen reader? Automated accessibility testing tools can catch missing labels and semantic issues. Additionally, test with actual assistive tech: screen readers (NVDA on Windows, VoiceOver on Mac), keyboard-only navigation. Real user testing with disabled users reveals issues automated tools miss. For progressive enhancement, this testing is critical: the fallback UX must be fully accessible.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Performance Monitoring</h3>
        <p>Measure performance with and without JavaScript: FCP (First Contentful Paint), TTI (Time to Interactive), Largest Contentful Paint (LCP). Progressive enhancement should improve FCP (content visible sooner) and perceived performance (users see content immediately, even if interactivity is delayed).</p>
        <p>Monitor JavaScript failures: track if JavaScript fails to load, and measure if users can still use the app (fallback working). Measure fallback usage: how many users have JavaScript disabled or failing. If this is significant (for example above about 5%), fallback UX is important.</p>
        <p><strong>Web Vitals and Baseline vs Enhanced Metrics:</strong> Track Core Web Vitals separately for baseline (no JS) and enhanced (with JS) experiences. Use Real User Monitoring (RUM) to measure actual user experience. Segment users: measure FCP and LCP for fast networks vs slow; desktop vs mobile. Progressive enhancement should show FCP improvement (baseline is faster) and similar LCP/CLS (no layout shifts if placeholders are sized correctly). If enhancement causes regression in LCP (lots of JS blocking paint), reconsider the bundling strategy. Set targets: baseline FCP under 1s, enhanced LCP under 2.5s, CLS under 0.1. Use tools like Lighthouse CI to track trends over time.</p>
        <HighlightBlock as="p" tier="important"><strong>JavaScript Failure Tracking and Fallback Monitoring:</strong> Monitor if JavaScript fails to load: set a global timer, if no JS runs within 10s, increment a counter (`window.__jsLoadFailed = true`). Send to analytics. If JS fails, the fallback should still work (all forms still POST, links still navigate), but without enhancements. Track this: measure task completion rates for users with JS failures. If completion rate is low, fallback UX needs improvement. Additionally, monitor hydration errors: if React detects mismatches during hydration, log the error count. High error counts indicate a problem with server/client sync. Set alerts: if hydration errors exceed 5% of page loads, or if JS load failure exceeds 2%, investigate.</HighlightBlock>
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Development complexity: building progressive enhancement requires discipline. Every form needs server-side handler and client-side enhancement. Every link is dual-mode (navigate traditional or client-side). This adds complexity. Pure SPA (JavaScript-only) is simpler to code but more fragile.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Server load: server-rendering increases server CPU. Caching (render once, cache HTML) or streaming (render while sending) mitigates. SSG (static site generation) pre-renders HTML at build time, eliminating server CPU.</HighlightBlock>
        <HighlightBlock as="p" tier="important">JavaScript-first assumptions: JavaScript libraries (React, Vue) assume JavaScript is available. Progressive enhancement requires rethinking: JavaScript enhances existing HTML, not the primary interface. Many frameworks are moving toward this (Remix, Fresh) but older frameworks (Vue, CRA) require extra work.</HighlightBlock>
        <HighlightBlock as="p" tier="crucial">User base: if your users have fast networks and modern browsers, progressive enhancement overhead may not be worth it. If your users include slow networks or old browsers, it's essential. Consider your user demographics.</HighlightBlock>
      </section>

      <section>
        <h2>Implementation Patterns</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 1: Dual-Mode Forms</h3>
        <HighlightBlock as="p" tier="important">Form submits to server endpoint (/api/comment). Server validates, processes, returns response. JavaScript intercepts submit, POST via fetch, reads response, updates page without reload. Form still works without JavaScript (traditional POST).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 2: Link Hijacking with History API</h3>
        <HighlightBlock as="p" tier="important">JavaScript intercepts all link clicks, fetches the page, updates content, calls history.pushState to update URL. Browser back/forward still works. Links still work without JavaScript (traditional GET).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Pattern 3: Gradual JavaScript Loading</h3>
        <HighlightBlock as="p" tier="crucial">Critical JS (routing, form handlers) loads inline or as small module. Non-critical (animations, tracking) deferred or lazy-loaded. Monitor for JavaScript failures; if detected, fall back gracefully.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important"><Highlight tier="crucial">Trade-offs include development complexity (dual modes for everything) versus improved resilience, and server load (mitigated by caching/SSG) versus perceived performance gains.</Highlight></HighlightBlock>
<HighlightBlock as="p" tier="important">Real-world systems (GitHub, Basecamp, modern frameworks like Remix) use progressive enhancement. For best results, prioritize server-rendering for above-fold content, load critical JS inline, defer non-critical JS, test thoroughly without JavaScript, and monitor JavaScript failures in production. Progressive enhancement improves FCP, TTI, resilience, and SEO simultaneously.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
