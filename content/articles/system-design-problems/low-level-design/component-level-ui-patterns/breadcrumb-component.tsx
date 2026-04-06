"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-lld-breadcrumb-component",
  title: "Design a Breadcrumb Component for Routing Hierarchies",
  description:
    "Complete LLD solution for a production-grade breadcrumb component with auto-generation from routes, manual label overrides, truncation with ellipsis, configurable separators, mobile-responsive collapse, SEO schema markup, keyboard navigation, and full accessibility.",
  category: "low-level-design",
  subcategory: "component-level-ui-patterns",
  slug: "breadcrumb-component",
  wordCount: 3200,
  readingTime: 21,
  lastUpdated: "2026-04-03",
  tags: [
    "lld",
    "breadcrumb",
    "navigation",
    "routing",
    "accessibility",
    "seo",
    "responsive-design",
  ],
  relatedTopics: [
    "pagination-component",
    "tree-view-folder-explorer",
    "context-menu",
    "search-autocomplete",
  ],
};

export default function BreadcrumbComponentArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Problem Clarification */}
      <section>
        <h2>Problem Clarification</h2>
        <p>
          We need to design a reusable breadcrumb navigation component for a large-scale
          web application. Breadcrumbs provide secondary navigation that reflects the
          hierarchical position of the current page within the site structure. They allow
          users to trace their path back through parent categories and navigate to any
          ancestor in a single click. The component must auto-generate the breadcrumb trail
          from the current URL path, support manual label overrides for ambiguous segments,
          truncate long trails with an ellipsis collapse, render configurable separators,
          distinguish the current page from navigable ancestors, and collapse to a compact
          mobile-friendly layout on small screens. Additionally, the component must emit
          structured JSON-LD schema markup for SEO and meet all accessibility requirements
          for keyboard navigation and screen-reader announcement.
        </p>
        <p>
          <strong>Assumptions:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            The application uses file-system-based routing (Next.js App Router or similar),
            where URL segments map directly to route hierarchy.
          </li>
          <li>
            The root path (<code>/</code>) is always the first breadcrumb item (e.g., &quot;Home&quot;).
          </li>
          <li>
            The last breadcrumb item represents the current page and is not a link.
          </li>
          <li>
            URL segments are slugified (kebab-case) and need conversion to human-readable
            labels (e.g., <code>product-categories</code> becomes &quot;Product Categories&quot;).
          </li>
          <li>
            Some segments have ambiguous or technical names that benefit from manual label
            overrides (e.g., <code>/pdp</code> should display &quot;Product Detail&quot; not &quot;Pdp&quot;).
          </li>
          <li>
            Breadcrumb trails exceeding a configurable threshold (default: 5 items) should
            collapse middle items behind an ellipsis, keeping the first N and last M items
            visible.
          </li>
          <li>
            The application supports both light and dark mode.
          </li>
        </ul>
      </section>

      {/* Section 2: Requirements */}
      <section>
        <h2>Requirements</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Auto-generation:</strong> Derive the breadcrumb trail from the current
            route path. Each segment becomes an item with a human-readable label and an href
            pointing to the cumulative path up to that segment.
          </li>
          <li>
            <strong>Manual override:</strong> Accept a configuration map that overrides
            auto-generated labels for specific segments. This map should support nested
            paths for context-sensitive overrides (e.g., <code>/products/electronics</code>
            has a different label than <code>/settings/electronics</code>).
          </li>
          <li>
            <strong>Truncation:</strong> When the trail exceeds the visible item limit,
            collapse middle items into a single ellipsis entry. The first item (Home) and
            the last two items must always remain visible.
          </li>
          <li>
            <strong>Configurable separators:</strong> Support slash (<code>/</code>),
            right chevron (<code>chevron-right</code>), and custom React node separators.
          </li>
          <li>
            <strong>Current item styling:</strong> The last breadcrumb (current page) must
            be visually distinct — bold or muted — and must not be a link.
          </li>
          <li>
            <strong>Mobile responsive:</strong> On small screens, collapse the breadcrumb
            trail to show only the last two items with a dropdown or menu that reveals the
            full trail.
          </li>
          <li>
            <strong>SEO schema markup:</strong> Generate JSON-LD <code>BreadcrumbList</code>
            structured data for each breadcrumb trail and inject it into the document head.
          </li>
          <li>
            <strong>Keyboard navigation:</strong> Each link is focusable via Tab. Enter
            activates navigation. Arrow keys move focus between items.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li>
            <strong>Performance:</strong> Breadcrumb generation must be synchronous and
            sub-millisecond. Label lookups use a Map for O(1) access. Truncation is O(n)
            where n is trail length (typically under 10).
          </li>
          <li>
            <strong>Accessibility:</strong> The component must use <code>nav</code> with
            <code>aria-label=&quot;Breadcrumb&quot;</code>. The current page item must have
            <code>aria-current=&quot;page&quot;</code>. The component must be fully operable
            with keyboard only.
          </li>
          <li>
            <strong>Type safety:</strong> Full TypeScript support for breadcrumb items,
            configuration, separators, and truncation options.
          </li>
          <li>
            <strong>SSR compatibility:</strong> Breadcrumbs must render correctly during
            server-side rendering for SEO. The JSON-LD schema must be present in the
            initial HTML response.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Cases</h3>
        <ul className="space-y-2">
          <li>
            Root path (<code>/</code>) — should render a single breadcrumb item
            (&quot;Home&quot;) with no separators or links.
          </li>
          <li>
            Dynamic route segments with IDs (e.g., <code>/users/12345</code>) — should
            use the ID as the label or resolve it to a human-readable name via a lookup.
          </li>
          <li>
            Catch-all routes (e.g., <code>/docs/[...slug]</code>) — each slug segment
            becomes a breadcrumb item.
          </li>
          <li>
            Trailing slashes in the URL — should not produce an empty breadcrumb item.
          </li>
          <li>
            Query parameters (e.g., <code>/products?sort=price</code>) — should be
            ignored; breadcrumbs derive from the path only.
          </li>
          <li>
            Extremely deep nesting (e.g., 15+ levels) — truncation must prevent overflow
            and the mobile dropdown must handle long lists without layout issues.
          </li>
          <li>
            Internationalization — labels may need translation. The override map should
            support i18n keys or the slug-to-label function should accept a locale.
          </li>
        </ul>
      </section>

      {/* Section 3: High-Level Approach */}
      <section>
        <h2>High-Level Approach</h2>
        <p>
          The core idea is to separate the <strong>breadcrumb data derivation</strong> from
          the <strong>breadcrumb rendering</strong>. A custom hook (<code>useBreadcrumbs</code>)
          accepts the current path and an optional configuration object, auto-generates the
          trail, applies manual label overrides, runs truncation, and returns a structured
          array of breadcrumb items. The rendering layer consumes this array and renders a
          semantic <code>nav</code> element with <code>BreadcrumbItem</code> and
          <code>BreadcrumbSeparator</code> sub-components. A separate <code>BreadcrumbMobile</code>
          component handles the responsive collapse to a dropdown on small viewports.
        </p>
        <p>
          <strong>Alternative approaches considered:</strong>
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Static breadcrumb generation at build time:</strong> Generate breadcrumb
            data during SSR/SSG and pass it as props. This works for static sites but fails
            for client-side navigation where the path changes without a full page reload.
            The hook-based approach re-computes on route change and works for both SSR and
            CSR.
          </li>
          <li>
            <strong>Middleware-based breadcrumb injection:</strong> Use Next.js middleware
            to set breadcrumb data in response headers or cookies. Overly complex for a
            client-side concern and adds latency to every request.
          </li>
          <li>
            <strong>Context-based breadcrumb sharing:</strong> Parent components set
            breadcrumb data via Context, and the breadcrumb component consumes it. This
            requires every route to manually provide breadcrumb data, defeating the
            auto-generation requirement.
          </li>
        </ul>
        <p>
          <strong>Why hook-based auto-generation is optimal:</strong> The hook reads the
          current path (from the router or <code>window.location</code>), derives items
          synchronously, applies overrides, truncates, and returns a plain array. This is
          reactive (re-runs on path change), SSR-safe (uses router-provided path), and
          requires zero manual configuration from route components. The rendering layer is
          a pure function of the hook output, making it trivially testable.
        </p>
      </section>

      {/* Section 4: System Design (LLD) */}
      <section>
        <h2>System Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module Architecture</h3>
        <p>The system consists of six modules:</p>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">1. Breadcrumb Types &amp; Interfaces (<code>breadcrumb-types.ts</code>)</h4>
          <p>
            Defines the core <code>BreadcrumbItem</code> interface with fields for label,
            href, and a boolean flag indicating whether the item is the current page. The
            <code>BreadcrumbConfig</code> interface accepts manual label overrides,
            truncation settings (visible count, keep-first, keep-last), separator type,
            and mobile collapse threshold. See the Example tab for the complete type
            definitions.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">2. Breadcrumb Generator (<code>breadcrumb-generator.ts</code>)</h4>
          <p>
            Pure function that accepts a path string and an optional label override map.
            Splits the path on <code>/</code>, filters empty segments, converts each slug
            to a human-readable label (kebab-case to title case), and looks up any manual
            overrides using a Map for O(1) access. Returns an array of
            <code>BreadcrumbItem</code> objects with cumulative hrefs. Also exports a
            <code>slugToLabel</code> utility that handles edge cases like numeric segments,
            acronyms, and Unicode characters.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">3. Breadcrumb Truncator (<code>breadcrumb-truncator.ts</code>)</h4>
          <p>
            Pure function that accepts an array of breadcrumb items and truncation config.
            If the array length is within the limit, returns it unchanged. Otherwise, keeps
            the first N items, the last M items, and inserts a synthetic ellipsis item
            between them. The ellipsis item is marked as non-navigable and renders as a
            clickable element that expands the full trail (or opens a popover with hidden
            items).
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">4. Breadcrumb SEO (<code>breadcrumb-seo.ts</code>)</h4>
          <p>
            Generates a JSON-LD <code>BreadcrumbList</code> script element following
            Schema.org specification. Each breadcrumb item maps to a <code>ListItem</code>
            with <code>position</code> (1-indexed), <code>name</code> (label), and
            <code>item</code> (full URL). The function accepts a base URL to construct
            absolute URLs for the <code>item</code> field. Returns a string suitable for
            injection into a <code>script</code> tag with
            <code>type=&quot;application/ld+json&quot;</code>.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">5. useBreadcrumbs Hook (<code>use-breadcrumbs.ts</code>)</h4>
          <p>
            React hook that ties everything together. Accepts the current path and optional
            <code>BreadcrumbConfig</code>. Internally calls the generator, applies
            truncation, and returns the final breadcrumb item array. Also exposes the
            JSON-LD schema string for the consuming component to render in
            <code>head</code>. Memoizes results with <code>useMemo</code> to avoid
            re-computation on unrelated re-renders.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">6. Rendering Components</h4>
          <p>
            <strong>Breadcrumb (<code>breadcrumb.tsx</code>):</strong> Root component that
            wraps everything in a <code>nav</code> with <code>aria-label=&quot;Breadcrumb&quot;</code>.
            Renders items with separators. Handles responsive breakpoint detection and
            switches between desktop and mobile variants.
          </p>
          <p className="mt-3">
            <strong>BreadcrumbItem (<code>breadcrumb-item.tsx</code>):</strong> Renders a
            single breadcrumb entry. If the item is the current page, renders as a
            <code>span</code> with <code>aria-current=&quot;page&quot;</code> and muted
            styling. Otherwise, renders as an <code>a</code> link with the href.
          </p>
          <p className="mt-3">
            <strong>BreadcrumbSeparator (<code>breadcrumb-separator.tsx</code>):</strong>
            Renders the configured separator — slash, chevron-right SVG, or a custom React
            node passed via config.
          </p>
          <p className="mt-3">
            <strong>BreadcrumbMobile (<code>breadcrumb-mobile.tsx</code>):</strong> Compact
            mobile variant that shows only the last two items and a dropdown button revealing
            the full trail. Uses a popover/menu pattern for overflow items.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">State Management</h3>
        <p>
          The breadcrumb system is stateless in the traditional sense. All data is derived
          from the current path and configuration, which are inputs to the hook. The hook
          uses <code>useMemo</code> to memoize the generation and truncation results, keyed
          on the path and config reference. No external store is needed because breadcrumbs
          are a pure function of the route.
        </p>
        <p>
          The only stateful concern is the mobile dropdown&apos;s open/closed toggle, which
          is managed locally in the <code>BreadcrumbMobile</code> component via
          <code>useState</code>. This state resets automatically when the path changes
          (detected via a <code>useEffect</code> dependency on the path).
        </p>

        <ArticleImage
          src="/diagrams/system-design-problems/low-level-design/breadcrumb-component-architecture.svg"
          alt="Breadcrumb component architecture showing path parsing, route matching, and mobile overflow handling"
          caption="Component Interaction Flow"
        />

        <h3 className="mt-6 mb-3 text-lg font-semibold">Component Interaction Flow</h3>
        <ol className="space-y-2 list-decimal list-inside">
          <li>
            Route changes (client-side navigation or initial load). The page component
            renders <code>Breadcrumb</code> with the current path.
          </li>
          <li>
            <code>Breadcrumb</code> calls <code>useBreadcrumbs(path, config)</code>.
          </li>
          <li>
            Hook calls <code>generateBreadcrumbs(path, labelOverrides)</code> to derive
            items from the path.
          </li>
          <li>
            Hook calls <code>truncateBreadcrumbs(items, truncationConfig)</code> to
            collapse middle items if the trail exceeds the limit.
          </li>
          <li>
            Hook calls <code>generateBreadcrumbJSONLD(items, baseUrl)</code> to produce
            the SEO schema string.
          </li>
          <li>
            Hook returns memoized result: <code>items</code> array and <code>jsonLD</code>
            string.
          </li>
          <li>
            <code>Breadcrumb</code> detects viewport width. If below the mobile threshold,
            renders <code>BreadcrumbMobile</code>. Otherwise, renders the desktop trail.
          </li>
          <li>
            Desktop trail renders as <code>nav &gt; ol &gt; li &gt; BreadcrumbItem</code>
            with <code>BreadcrumbSeparator</code> between items.
          </li>
          <li>
            JSON-LD string renders inside a <code>script</code> tag in the page head
            (via Next.js <code>Script</code> component or inline <code>script</code>).
          </li>
        </ol>
      </section>

      {/* Section 5: Data Flow / Execution Flow */}
      <section>
        <h2>Data Flow / Execution Flow</h2>
        <p>
          The execution flow follows a pure functional pipeline: path input leads to item
          generation, then truncation, then SEO schema generation, and finally rendering.
          Each step is a pure function or memoized computation, making the system
          predictable and testable in isolation.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Handling in Flow</h3>
        <ul className="space-y-3">
          <li>
            <strong>Root path:</strong> <code>generateBreadcrumbs</code> detects an empty
            segment list and returns a single item: <code>{`{ label: "Home", href: "/", isCurrent: false }`}</code>.
          </li>
          <li>
            <strong>Dynamic ID segments:</strong> Segments matching a numeric or UUID pattern
            are passed through as-is (e.g., <code>12345</code>) or resolved via an optional
            resolver function passed in config (e.g., fetch user name from cache).
          </li>
          <li>
            <strong>Trailing slashes:</strong> The path is split on <code>/</code> and
            empty strings are filtered out, so a trailing slash produces no extra segment.
          </li>
          <li>
            <strong>Query parameters:</strong> The hook strips the query string from the
            path before splitting. Only the pathname portion is used for breadcrumb
            generation.
          </li>
          <li>
            <strong>Extremely deep nesting:</strong> Truncation ensures that even with 15+
            levels, only the first 2, an ellipsis, and the last 2 items render. The mobile
            dropdown shows all items in a scrollable list.
          </li>
          <li>
            <strong>SSR safety:</strong> All functions are pure and synchronous. They run
            identically on server and client. The JSON-LD output is included in the initial
            HTML response, satisfying SEO requirements.
          </li>
        </ul>
      </section>

      {/* Section 6: Implementation */}
      <section>
        <h2>Implementation</h2>
        <p>
          The full production implementation is available in the <strong>Example tab</strong>.
          Below is a high-level overview of each module and its key design decisions.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 text-lg font-semibold">Switch to the Example Tab</h3>
          <p>
            The complete, production-ready implementation consists of 10 files: type
            definitions, path-to-breadcrumb generator, truncation algorithm, JSON-LD SEO
            schema generator, React hook, desktop and mobile components, separator renderer,
            and a full EXPLANATION.md walkthrough. Click the <strong>Example</strong> toggle
            at the top of the article to view all source files.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 1: Breadcrumb Types (breadcrumb-types.ts)</h3>
        <p>
          Defines the <code>BreadcrumbItem</code> interface with <code>label</code> (string),
          <code>href</code> (string), and <code>isCurrent</code> (boolean). The
          <code>BreadcrumbConfig</code> interface includes <code>labelOverrides</code> (a
          Map or Record mapping path segments to custom labels), <code>truncation</code>
          settings (<code>visibleLimit</code>, <code>keepFirst</code>, <code>keepLast</code>),
          <code>separator</code> (enum: <code>slash</code>, <code>chevron</code>, or custom
          React node), and <code>mobileBreakpoint</code> (pixels, default 640).
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 2: Breadcrumb Generator (breadcrumb-generator.ts)</h3>
        <p>
          Pure function that splits the path, filters empty segments, and maps each segment
          to a <code>BreadcrumbItem</code>. The href for each item is the cumulative path
          from root to that segment (e.g., for <code>/products/electronics</code>, the
          &quot;Products&quot; item has href <code>/products</code> and &quot;Electronics&quot;
          has href <code>/products/electronics</code>). The <code>slugToLabel</code> function
          converts kebab-case to title case, handles acronyms (e.g., <code>api-keys</code>
          becomes &quot;API Keys&quot;), and preserves numeric segments. Label overrides are
          applied via a Map lookup keyed by the cumulative path for context sensitivity.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 3: Breadcrumb Truncator (breadcrumb-truncator.ts)</h3>
        <p>
          Accepts the full item array and truncation config. If the item count is at or
          below the visible limit, returns the array unchanged. Otherwise, slices the first
          <code>keepFirst</code> items and the last <code>keepLast</code> items, inserts a
          synthetic ellipsis item between them, and returns the collapsed array. The
          ellipsis item has <code>label: &quot;...&quot;</code>, no href, and a special
          <code>isEllipsis</code> flag. The ellipsis can render as a clickable element that
          expands to show the hidden items inline or opens a dropdown.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 4: Breadcrumb SEO (breadcrumb-seo.ts)</h3>
        <p>
          Generates a JSON-LD string following the Schema.org <code>BreadcrumbList</code>
          type. Iterates the breadcrumb items, maps each to a <code>ListItem</code> object
          with <code>@type: &quot;ListItem&quot;</code>, <code>position</code> (1-indexed
          integer), <code>name</code> (the label), and <code>item</code> (the absolute URL,
          constructed by prepending the base URL to the href). The current page item (last
          item) is included with its label but without a link in the <code>item</code> field.
          The output is a minified JSON string suitable for a <code>script</code> tag.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 5: useBreadcrumbs Hook (use-breadcrumbs.ts)</h3>
        <p>
          React hook that orchestrates the pipeline. Accepts <code>path</code> and optional
          <code>BreadcrumbConfig</code>. Uses <code>useMemo</code> with dependencies on
          <code>path</code> and <code>config</code> to avoid re-computation. Calls the
          generator, then the truncator, then the SEO function. Returns an object with
          <code>items</code> (the final breadcrumb array) and <code>jsonLD</code> (the
          schema string). The hook is pure and can be tested without rendering.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 6: Breadcrumb Component (breadcrumb.tsx)</h3>
        <p>
          Root component that renders the breadcrumb navigation. Accepts <code>path</code>
          and optional config props. Calls <code>useBreadcrumbs</code> to get items and
          JSON-LD. Renders the JSON-LD via a <code>script</code> tag. Detects viewport
          width using a <code>useMediaQuery</code> hook or window resize listener and
          switches between desktop and mobile variants. The desktop variant renders an
          ordered list (<code>ol</code>) with list items for each breadcrumb.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 7: Breadcrumb Item (breadcrumb-item.tsx)</h3>
        <p>
          Renders a single breadcrumb entry. If <code>isCurrent</code> is true, renders a
          <code>span</code> with <code>aria-current=&quot;page&quot;</code>, bold font, and
          muted text color. If <code>isEllipsis</code> is true, renders a clickable button
          that expands the collapsed items. Otherwise, renders an <code>a</code> element
          with the href and standard link styling. Focus management ensures Tab order flows
          naturally through all links.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 8: Breadcrumb Separator (breadcrumb-separator.tsx)</h3>
        <p>
          Renders the separator between breadcrumb items. Accepts a <code>type</code> prop
          (<code>slash</code>, <code>chevron</code>, or <code>custom</code>). For slash,
          renders a text <code>/</code> with muted color and padding. For chevron, renders
          an inline SVG chevron-right icon. For custom, renders the React node passed via
          config. The separator has <code>aria-hidden=&quot;true&quot;</code> since it is
          decorative.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Module 9: Breadcrumb Mobile (breadcrumb-mobile.tsx)</h3>
        <p>
          Compact mobile variant that shows the last two breadcrumb items and a dropdown
          button. The dropdown button opens a popover/menu listing all breadcrumb items in
          order. The current page item is shown at the bottom of the dropdown with muted
          styling. Uses <code>useState</code> for open/close toggle and resets on path
          change via <code>useEffect</code>. The popover renders with a fixed position and
          z-index above other content.
        </p>
      </section>

      {/* Section 7: Performance & Scalability */}
      <section>
        <h2>Performance &amp; Scalability</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Time and Space Complexity</h3>
        <div className="my-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-2 text-left">Operation</th>
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Space</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-2">Path splitting &amp; generation</td>
                <td className="p-2">O(n) — split and map segments</td>
                <td className="p-2">O(n) — stores n breadcrumb items</td>
              </tr>
              <tr>
                <td className="p-2">Label override lookup</td>
                <td className="p-2">O(1) per item — Map lookup</td>
                <td className="p-2">O(m) — m override entries</td>
              </tr>
              <tr>
                <td className="p-2">Truncation</td>
                <td className="p-2">O(n) — slice and concatenate</td>
                <td className="p-2">O(k) — k visible items</td>
              </tr>
              <tr>
                <td className="p-2">JSON-LD generation</td>
                <td className="p-2">O(n) — map and stringify</td>
                <td className="p-2">O(n) — JSON string</td>
              </tr>
              <tr>
                <td className="p-2">Rendering</td>
                <td className="p-2">O(k) — render k visible items</td>
                <td className="p-2">O(k) — DOM nodes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Where <code>n</code> is the total number of path segments (typically under 10)
          and <code>k</code> is the visible item count after truncation (typically 5).
          All operations are linear and sub-millisecond for realistic path depths.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Bottlenecks</h3>
        <ul className="space-y-2">
          <li>
            <strong>Label override Map construction:</strong> If the override map is built
            from a large configuration file or API response, construction cost is O(m) where
            m is the number of entries. Mitigation: build the Map once at app initialization
            and cache it as a module-level singleton.
          </li>
          <li>
            <strong>Viewport detection:</strong> Using a <code>resize</code> event listener
            fires on every pixel change. Mitigation: use <code>ResizeObserver</code> on the
            container or debounce the handler at 100ms intervals. Alternatively, use CSS
            media queries to show/hide desktop and mobile variants without JavaScript
            detection.
          </li>
          <li>
            <strong>JSON-LD re-computation:</strong> The schema string is regenerated on
            every path change. For typical breadcrumb lengths (3-8 items), this is
            negligible. If paths are extremely deep (50+ segments), memoization prevents
            redundant stringification.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Optimization Strategies</h3>
        <ul className="space-y-2">
          <li>
            <strong>Memoization:</strong> The hook wraps all computation in
            <code>useMemo</code> keyed on the path string and config reference. Route
            changes trigger re-computation; unrelated state changes do not.
          </li>
          <li>
            <strong>CSS-only responsive switching:</strong> Instead of JavaScript viewport
            detection, use <code>hidden sm:flex</code> on the desktop variant and
            <code>flex sm:hidden</code> on the mobile variant. This eliminates the resize
            listener entirely and lets the browser handle the breakpoint.
          </li>
          <li>
            <strong>Pre-built label cache:</strong> For applications with known route
            structures, pre-compute the label map at build time and import it as a static
            constant. This avoids runtime slug-to-label conversion entirely.
          </li>
          <li>
            <strong>Virtual scrolling in mobile dropdown:</strong> For extremely deep
            breadcrumb trails (50+ levels), the mobile dropdown can use virtualization to
            render only visible items. In practice, trails rarely exceed 10 levels, so this
            is an optimization for edge cases only.
          </li>
        </ul>
      </section>

      {/* Section 8: Security Considerations */}
      <section>
        <h2>Security Considerations</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Input Sanitization</h3>
        <p>
          Breadcrumb labels derive from URL path segments, which are user-controllable
          input. An attacker could craft a URL with a malicious segment (e.g.,
          <code>/products/%3Cscript%3Ealert(1)%3C/script%3E</code>). If the label is
          rendered as raw HTML, this becomes an XSS vector. The defense is to render labels
          as plain text content (React&apos;s default escaping) and never use
          <code>dangerouslySetInnerHTML</code> for auto-generated labels. Manual override
          labels from a trusted configuration are safe to render as React nodes.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Accessibility (MANDATORY)</h3>
        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>
              Each breadcrumb link is focusable via natural Tab order (native
              <code>&lt;a href&gt;</code> element).
            </li>
            <li>
              Pressing <kbd className="px-1.5 py-0.5 rounded bg-panel text-xs">Enter</kbd>
              activates the link and navigates to the href.
            </li>
            <li>
              The ellipsis expand button is a native <code>&lt;button&gt;</code> element,
              automatically keyboard-accessible.
            </li>
            <li>
              The mobile dropdown toggle is a <code>&lt;button&gt;</code> with
              <code>aria-expanded</code> reflecting its open/closed state.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">Screen Reader Support</h4>
          <ul className="space-y-2">
            <li>
              The root element is a <code>&lt;nav&gt;</code> with
              <code>aria-label=&quot;Breadcrumb&quot;</code>, allowing screen readers to
              identify it as a navigation landmark.
            </li>
            <li>
              The current page item has <code>aria-current=&quot;page&quot;</code>, which
              screen readers announce as &quot;current page&quot; after the label.
            </li>
            <li>
              The ellipsis item has <code>aria-label</code> describing its purpose
              (e.g., &quot;Show collapsed items&quot;).
            </li>
            <li>
              Separators have <code>aria-hidden=&quot;true&quot;</code> to prevent screen
              readers from announcing decorative characters.
            </li>
          </ul>
        </div>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h4 className="mb-3 font-semibold">ARIA Roles and Semantics</h4>
          <p>
            Breadcrumbs are rendered as an ordered list (<code>ol</code>) within a
            <code>nav</code> landmark. Each item is an <code>li</code> containing either
            an <code>a</code> link or a <code>span</code> with
            <code>aria-current=&quot;page&quot;</code>. This follows the WAI-ARIA
            breadcrumb pattern exactly. See the Example tab for the exact markup.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Open Redirect Prevention</h3>
        <p>
          Breadcrumb hrefs are constructed from the path segments, which are inherently
          same-origin URLs. However, if the application supports external redirects or the
          label override map injects arbitrary hrefs, validate that all hrefs start with
          <code>/</code> or the application&apos;s base URL. Reject or sanitize any href
          that points to an external domain to prevent open redirect vulnerabilities.
        </p>
      </section>

      {/* Section 9: Testing Strategy */}
      <section>
        <h2>Testing Strategy</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Unit Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Generator:</strong> Test that <code>generateBreadcrumbs(&quot;/products/electronics/phones&quot;)</code>
            returns three items with correct labels (&quot;Products&quot;, &quot;Electronics&quot;,
            &quot;Phones&quot;), cumulative hrefs, and <code>isCurrent</code> set on the
            last item. Test root path returns a single &quot;Home&quot; item.
          </li>
          <li>
            <strong>Label overrides:</strong> Test that providing an override map for
            <code>/products/electronics</code> replaces the auto-generated label with the
            custom value. Test that context-sensitive overrides work (same segment name at
            different paths gets different labels).
          </li>
          <li>
            <strong>slugToLabel:</strong> Test kebab-case conversion (<code>product-categories</code>
            to &quot;Product Categories&quot;), acronym handling (<code>api-keys</code> to
            &quot;API Keys&quot;), numeric passthrough (<code>12345</code> to &quot;12345&quot;),
            and Unicode preservation.
          </li>
          <li>
            <strong>Truncator:</strong> Test that an array of 8 items with
            <code>visibleLimit: 5, keepFirst: 2, keepLast: 2</code> returns 5 items:
            first 2, ellipsis, last 2. Test that an array within the limit returns
            unchanged. Test edge case: exactly at the limit returns unchanged.
          </li>
          <li>
            <strong>JSON-LD:</strong> Test that <code>generateBreadcrumbJSONLD</code>
            produces valid JSON with <code>@context: &quot;https://schema.org&quot;</code>,
            <code>@type: &quot;BreadcrumbList&quot;</code>, and a <code>itemListElement</code>
            array where each entry has <code>position</code>, <code>name</code>, and
            <code>item</code>.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Integration Tests</h3>
        <ul className="space-y-2">
          <li>
            <strong>Hook output:</strong> Render a test component calling
            <code>useBreadcrumbs</code> with a path and config. Assert the returned items
            match expected labels, hrefs, and truncation. Assert JSON-LD string is valid
            JSON.
          </li>
          <li>
            <strong>Component rendering:</strong> Render the <code>Breadcrumb</code>
            component with a path. Assert <code>nav</code> has <code>aria-label</code>,
            links have correct <code>href</code> attributes, current item has
            <code>aria-current=&quot;page&quot;</code>, and separators are present between
            items.
          </li>
          <li>
            <strong>Truncation rendering:</strong> Render a long trail, assert the ellipsis
            item appears, assert the correct number of items are visible, assert clicking
            the ellipsis reveals hidden items.
          </li>
          <li>
            <strong>Mobile variant:</strong> Set viewport width below breakpoint, assert
            mobile dropdown renders with the last two items visible, assert clicking the
            toggle opens the dropdown with all items listed.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Edge Case Testing</h3>
        <ul className="space-y-2">
          <li>
            Root path: verify single &quot;Home&quot; item renders with no separator.
          </li>
          <li>
            Trailing slash: verify no empty breadcrumb item is created.
          </li>
          <li>
            Query parameters: verify <code>/products?sort=price</code> produces the same
            breadcrumb as <code>/products</code>.
          </li>
          <li>
            Malicious segment: verify <code>&lt;script&gt;</code> tags in path segments
            are escaped and rendered as text, not executed.
          </li>
          <li>
            Accessibility: run axe-core automated checks on rendered breadcrumbs, verify
            <code>nav</code> landmark, <code>aria-current</code>, keyboard Tab order, and
            separator <code>aria-hidden</code>.
          </li>
          <li>
            SSR rendering: verify breadcrumbs render correctly during server-side rendering
            and match client hydration output (no hydration mismatch).
          </li>
        </ul>
      </section>

      {/* Section 10: Interview-Focused Insights */}
      <section>
        <h2>Interview-Focused Insights</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Common Mistakes Candidates Make</h3>
        <ul className="space-y-3">
          <li>
            <strong>Hardcoding breadcrumb labels:</strong> Candidates often manually define
            breadcrumb items in each route component. This defeats the purpose of
            auto-generation and requires updating every route when the hierarchy changes.
            Interviewers expect a derived approach from the URL path.
          </li>
          <li>
            <strong>Forgetting aria-current on the last item:</strong> Rendering the current
            page as a link or omitting <code>aria-current=&quot;page&quot;</code> confuses
            screen reader users about which page they are on. This is a critical
            accessibility oversight.
          </li>
          <li>
            <strong>Not handling truncation:</strong> Deep route hierarchies produce long
            breadcrumb trails that overflow the viewport. Candidates who do not discuss
            truncation or ellipsis strategies miss an important production requirement.
          </li>
          <li>
            <strong>Using divs instead of semantic list elements:</strong> Rendering
            breadcrumbs as <code>div</code> elements instead of <code>ol/li</code> loses
            the semantic ordering that screen readers and search engines rely on. The
            WAI-ARIA breadcrumb pattern specifically requires an ordered list.
          </li>
          <li>
            <strong>Missing JSON-LD for SEO:</strong> Breadcrumbs are one of the few
            navigation patterns that benefit from structured data (Google displays
            breadcrumbs in search results). Candidates who mention this demonstrate
            production-awareness.
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Important Trade-offs Interviewers Expect</h3>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Auto-generation vs Manual Configuration</h4>
          <p>
            Auto-generating breadcrumbs from the URL path is zero-maintenance — adding a new
            route automatically creates the correct trail. The trade-off is that auto-generated
            labels may be ambiguous (e.g., <code>/settings/general</code> vs
            <code>/docs/general</code>). A manual override map solves this but introduces a
            configuration surface that must be maintained. The optimal approach is
            auto-generation as the default with an escape hatch for overrides on a per-path
            basis. This gives the best of both worlds: zero config for simple hierarchies,
            precision control for ambiguous segments.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">Truncation: Inline Ellipsis vs Dropdown</h4>
          <p>
            Inline ellipsis (collapsing middle items into <code>...</code>) keeps the
            breadcrumb on a single line and allows users to see the start and end of the
            trail at a glance. The trade-off is that hidden items are not immediately
            visible — users must click the ellipsis to see them. A dropdown approach (show
            only the current page and a dropdown for the full trail) is more compact but
            hides the entire hierarchy behind an interaction. Inline ellipsis is preferred
            for desktop; dropdown is preferred for mobile.
          </p>
        </div>

        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-6">
          <h4 className="mb-3 font-semibold">CSS-only vs JavaScript Responsive Detection</h4>
          <p>
            Using CSS media queries (<code>hidden sm:flex</code>) to show/hide desktop and
            mobile variants eliminates JavaScript entirely. The trade-off is that both
            variants are present in the DOM, slightly increasing initial page weight.
            JavaScript-based detection (<code>window.innerWidth</code> or
            <code>matchMedia</code>) renders only the active variant, reducing DOM size,
            but introduces a resize listener and potential hydration mismatch if the server
            renders the desktop variant and the client is mobile. CSS-only is the simpler
            and more reliable approach for most applications.
          </p>
        </div>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Possible Follow-up Questions</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you handle breadcrumb trails for non-hierarchical routes (e.g.,
              a flat list of unrelated pages)?
            </p>
            <p className="mt-2 text-sm">
              A: Not all routes fit a hierarchy. For flat routes, the breadcrumb should
              simply show <code>Home &gt; Current Page</code>. The auto-generation logic
              already handles this — a single-segment path produces two items. If the
              application has truly unrelated sections (e.g., <code>/dashboard</code> and
              <code>/settings</code> are peers, not parent-child), the override map can
              specify that both start from <code>Home</code> without intermediate items.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you resolve dynamic ID segments (e.g., <code>/users/abc-123</code>)
              to human-readable names?
            </p>
            <p className="mt-2 text-sm">
              A: Pass a resolver function in the config that accepts a segment and returns
              a label. For IDs, the resolver can look up the name from a cache or API. For
              example, <code>/users/abc-123</code> could resolve to &quot;John Doe&quot; by
              fetching the user record. To avoid blocking breadcrumb rendering on an API
              call, use a cache-first strategy: if the name is cached, use it; otherwise,
              fall back to the ID as the label. The cache can be populated asynchronously
              after the initial render.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you internationalize breadcrumb labels?
            </p>
            <p className="mt-2 text-sm">
              A: The label override map should support locale keys. Instead of mapping
              <code>/products</code> to &quot;Products&quot;, map it to an i18n key like
              <code>breadcrumb.products</code>. The generator then passes the key through
              the i18n translation function (e.g., <code>t(key)</code>) to get the localized
              label. The <code>slugToLabel</code> function can also accept a locale parameter
              for title-case rules that vary by language (e.g., German capitalizes all nouns,
              Spanish has different rules).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you test that the JSON-LD output is valid and parseable by Google?
            </p>
            <p className="mt-2 text-sm">
              A: Use Google&apos;s Rich Results Test tool or the Schema Markup Validator
              to verify the JSON-LD output. In automated tests, parse the JSON string and
              assert the structure matches Schema.org&apos;s BreadcrumbList specification:
              <code>@context</code>, <code>@type</code>, and <code>itemListElement</code>
              array where each entry has <code>@type: &quot;ListItem&quot;</code>,
              <code>position</code> (integer), <code>name</code> (string), and
              <code>item</code> (URL). Additionally, use Playwright to render the page,
              extract the <code>script[type=&quot;application/ld+json&quot;]</code> content,
              and validate it programmatically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does your design handle client-side navigation without re-rendering the
              entire page?
            </p>
            <p className="mt-2 text-sm">
              A: The <code>useBreadcrumbs</code> hook depends on the <code>path</code>
              argument. When the router changes the path (e.g., Next.js <code>usePathname</code>
              hook), the path value changes, triggering <code>useMemo</code> to re-compute.
              Only the breadcrumb component re-renders — the rest of the page is unaffected.
              This is efficient because breadcrumb computation is O(n) and n is small. The
              JSON-LD <code>script</code> tag updates with the new schema, and search engine
              crawlers that execute JavaScript will see the updated structured data.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What if the breadcrumb trail needs to reflect a logical hierarchy that differs
              from the URL structure?
            </p>
            <p className="mt-2 text-sm">
              A: This is where the manual override map becomes essential. For example, the
              URL <code>/settings/billing/invoices</code> might logically belong under
              <code>Home &gt; Account &gt; Billing &gt; Invoices</code> even though the URL
              has no <code>account</code> segment. The override map can inject additional
              items by specifying a path that maps to multiple labels. Alternatively, the
              hook can accept a <code>customItems</code> prop that completely replaces the
              auto-generated trail for specific routes, giving full control when the URL
              hierarchy does not match the logical navigation hierarchy.
            </p>
          </div>
        </div>
      </section>

      {/* Section 11: References */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA Breadcrumb Pattern — Accessibility Guidelines
            </a>
          </li>
          <li>
            <a
              href="https://schema.org/BreadcrumbList"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schema.org BreadcrumbList — Structured Data Specification
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/search/docs/appearance/structured-data/breadcrumb"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Search — Breadcrumb Structured Data Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/breadcrumbs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Breadcrumb Navigation UX Research
            </a>
          </li>
          <li>
            <a
              href="https://design-system.service.gov.uk/components/breadcrumbs/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GOV.UK Design System — Breadcrumbs Component
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/wai-aria-1.2/#aria-current"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WAI-ARIA — aria-current Attribute Specification
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
