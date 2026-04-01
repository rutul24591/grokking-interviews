"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-category-navigation",
  title: "Category Navigation",
  description:
    "Comprehensive guide to category navigation covering hierarchical structures, navigation patterns, breadcrumbs, mega menus, mobile navigation, and SEO best practices for content discovery.",
  category: "functional-requirements",
  subcategory: "discovery-search-feed-browsing",
  slug: "category-navigation",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "navigation",
    "categories",
    "frontend",
    "ux",
    "breadcrumbs",
  ],
  relatedTopics: ["content-categorization", "browsing", "discovery", "information-architecture"],
};

export default function CategoryNavigationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Category Navigation</strong> is the hierarchical browsing structure that
          enables users to explore content by topic, classification, or taxonomy. It is a
          fundamental discovery mechanism—users who browse categories often have different
          intent than search users (exploring vs. finding specific items). Well-designed
          category navigation reduces cognitive load, provides context, and helps users
          understand the scope of content available.
        </p>
        <p>
          Category navigation appears in many forms: e-commerce (Products → Electronics →
          Phones), news sites (News → World → Europe), documentation (Docs → API →
          Authentication), and content platforms (Topics → Technology → AI). The challenge
          is balancing depth (enough granularity) with usability (not too many clicks to
          reach content).
        </p>
        <p>
          For staff-level engineers, category navigation involves information architecture
          (taxonomy design, hierarchy depth), UI patterns (sidebar, mega menu, breadcrumbs),
          state management (expanded/collapsed state, active category), performance
          (lazy loading subcategories), and SEO (URL structure, internal linking, sitemaps).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Hierarchy Depth</h3>
        <p>
          How deep should category hierarchies go:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>1-2 Levels:</strong> Simple sites, small catalogs (&lt;100 items).
            Fast navigation, but limited granularity. Best for: Landing pages, simple
            blogs.
          </li>
          <li>
            <strong>3-4 Levels:</strong> Most production systems. Balanced depth without
            excessive clicks. Example: Electronics → Phones → Smartphones → Android. Best
            for: E-commerce, news sites, documentation.
          </li>
          <li>
            <strong>5+ Levels:</strong> Deep hierarchies cause navigation friction. Users
            lose context, bounce rates increase. Only justified for very large catalogs
            (100K+ items). Use faceted search instead.
          </li>
          <li>
            <strong>Rule of Thumb:</strong> Users should reach any content within 3-4
            clicks. If deeper, reconsider taxonomy or add shortcuts (featured categories,
            search).
          </li>
        </ul>

        <h3 className="mt-6">Navigation Patterns</h3>
        <p>
          Common UI patterns for category navigation:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Sidebar Tree:</strong> Expandable/collapsible category tree. Always
            visible (desktop), shows hierarchy clearly. Best for: Documentation, admin
            dashboards, content-heavy sites.
          </li>
          <li>
            <strong>Mega Menu:</strong> Full-width dropdown showing all subcategories at
            once. Rich content (images, descriptions). Best for: E-commerce homepages,
            large catalogs.
          </li>
          <li>
            <strong>Horizontal Tabs:</strong> Top-level categories as tabs. Subcategories
            in dropdown. Clean, familiar. Best for: Sites with 5-10 top categories.
          </li>
          <li>
            <strong>Breadcrumbs:</strong> Show current path (Home &gt; Tech &gt; Phones).
            Not primary navigation, but context indicator. Always use with other patterns.
          </li>
          <li>
            <strong>Card Grid:</strong> Categories as cards with images. Visual, engaging.
            Best for: Top-level category landing pages.
          </li>
        </ul>

        <h3 className="mt-6">Category Metadata</h3>
        <p>
          What information to store per category:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Basic:</strong> ID, name, slug (URL-friendly), parent_id (for hierarchy).
          </li>
          <li>
            <strong>SEO:</strong> Meta title, meta description, canonical URL. Important
            for search engine visibility.
          </li>
          <li>
            <strong>Display:</strong> Icon/thumbnail, description, featured flag (for
            highlighting).
          </li>
          <li>
            <strong>Analytics:</strong> Content count, view count, engagement metrics.
            Show counts to users ("123 articles").
          </li>
          <li>
            <strong>Ordering:</strong> Sort order (manual, alphabetical, by count).
            Control category display order.
          </li>
        </ul>

        <h3 className="mt-6">URL Structure</h3>
        <p>
          SEO-friendly URL patterns for categories:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Hierarchical:</strong> /electronics/phones/smartphones. Shows hierarchy,
            good for SEO. Best for: Most sites.
          </li>
          <li>
            <strong>Flat:</strong> /category/smartphones. Simpler, but loses hierarchy
            context. Best for: Sites with shallow hierarchies.
          </li>
          <li>
            <strong>ID-based:</strong> /cat/123/subcat/456. Ugly but stable (IDs don't
            change). Use internally, redirect from pretty URLs.
          </li>
          <li>
            <strong>Best Practice:</strong> Hierarchical URLs with slugs. Include category
            ID for stability (/electronics-123/phones-456). Handle slug changes with 301
            redirects.
          </li>
        </ul>

        <h3 className="mt-6">State Management</h3>
        <p>
          Managing navigation state:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Expanded/Collapsed:</strong> Which categories are expanded. Persist
            in localStorage (user preference). Default: expand current category's parent.
          </li>
          <li>
            <strong>Active Category:</strong> Currently selected category. Highlight
            visually. Sync with URL.
          </li>
          <li>
            <strong>Loading State:</strong> Loading subcategories. Show skeleton loaders.
            Prevent duplicate fetches.
          </li>
          <li>
            <strong>Scroll Position:</strong> Restore scroll position when navigating
            back. Store in session storage.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production category navigation involves efficient data loading and state
          management.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/category-navigation/navigation-patterns.svg"
          alt="Category Navigation Patterns"
          caption="Figure 1: Navigation Patterns — Sidebar tree, mega menu, breadcrumbs, and card grid layouts"
          width={1000}
          height={500}
        />

        <h3>Data Loading Strategies</h3>
        <ul className="space-y-3">
          <li>
            <strong>Eager Loading:</strong> Load entire category tree on mount. Simple,
            but slow for large trees (1000+ categories). Best for: Small catalogs
            (&lt;100 categories).
          </li>
          <li>
            <strong>Lazy Loading:</strong> Load subcategories on expand. Fast initial
            load, but loading spinners on expand. Best for: Large catalogs, deep
            hierarchies.
          </li>
          <li>
            <strong>Hybrid:</strong> Load top 2 levels eagerly, lazy load deeper levels.
            Balanced approach. Most production systems use this.
          </li>
          <li>
            <strong>Prefetching:</strong> Prefetch sibling categories when user hovers.
            Reduces perceived latency. Use Intersection Observer for mobile.
          </li>
        </ul>

        <h3 className="mt-6">Component Structure</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Navigation Container:</strong> Main wrapper. Fetches top-level
            categories on mount. Manages global state (expanded categories, active
            category).
          </li>
          <li>
            <strong>Category List:</strong> Renders list of CategoryItem components.
            Virtualized if 100+ items.
          </li>
          <li>
            <strong>Category Item:</strong> Individual category. Shows name, count,
            expand/collapse arrow. Handles click (navigate or expand).
          </li>
          <li>
            <strong>Subcategory List:</strong> Nested list for children. Conditionally
            rendered based on expanded state.
          </li>
          <li>
            <strong>Breadcrumbs:</strong> Separate component. Shows path from root to
            current category.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/category-navigation/hierarchy-management.svg"
          alt="Category Hierarchy Management"
          caption="Figure 2: Hierarchy Management — Tree structure, parent-child relationships, and URL routing"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Mobile Navigation</h3>
        <p>
          Mobile-specific considerations:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Off-Canvas Drawer:</strong> Slide-in navigation from left. Maximizes
            content space. Standard pattern (hamburger menu).
          </li>
          <li>
            <strong>Accordion:</strong> Collapsible categories. One level at a time.
            Prevents overwhelming small screens.
          </li>
          <li>
            <strong>Bottom Navigation:</strong> Top 5 categories in bottom nav. Quick
            access to popular categories.
          </li>
          <li>
            <strong>Gesture Support:</strong> Swipe to open/close drawer. Pull to refresh
            category content.
          </li>
          <li>
            <strong>Touch Targets:</strong> Minimum 44px height for category items.
            Accessible tap targets.
          </li>
        </ul>

        <h3 className="mt-6">SEO Considerations</h3>
        <ul className="space-y-3">
          <li>
            <strong>Internal Linking:</strong> Link to all categories from homepage or
            sitemap. Ensure crawlable paths.
          </li>
          <li>
            <strong>Canonical URLs:</strong> Set canonical URL per category. Prevent
            duplicate content issues.
          </li>
          <li>
            <strong>Schema Markup:</strong> Use BreadcrumbList schema for breadcrumbs.
            Helps search engines understand hierarchy.
          </li>
          <li>
            <strong>XML Sitemap:</strong> Include all category URLs in sitemap. Update
            when categories change.
          </li>
          <li>
            <strong>301 Redirects:</strong> When category URLs change, redirect old URLs.
            Preserve SEO equity.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Category navigation design involves balancing usability, performance, and
          discoverability.
        </p>

        <h3>Loading Strategy Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Strategy</th>
                <th className="text-left p-2 font-semibold">Initial Load</th>
                <th className="text-left p-2 font-semibold">Interaction</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Eager Loading</td>
                <td className="p-2">Slow (all data)</td>
                <td className="p-2">Fast (no loading)</td>
                <td className="p-2">&lt;100 categories</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Lazy Loading</td>
                <td className="p-2">Fast (top level)</td>
                <td className="p-2">Loading spinners</td>
                <td className="p-2">Large catalogs</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Hybrid</td>
                <td className="p-2">Medium (2 levels)</td>
                <td className="p-2">Minimal loading</td>
                <td className="p-2">Most production sites</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/category-navigation/mobile-navigation-patterns.svg"
          alt="Mobile Navigation Patterns"
          caption="Figure 3: Mobile Navigation — Off-canvas drawer, accordion, and bottom navigation patterns"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Hierarchy Depth Trade-offs</h3>
        <p>
          <strong>Shallow (1-2 levels):</strong> Fast navigation, users reach content
          quickly. Risk: Too many categories at top level, overwhelming choice. Best
          for: Small catalogs.
        </p>
        <p>
          <strong>Medium (3-4 levels):</strong> Balanced. Enough granularity without
          excessive clicks. Most users accept 3-4 clicks. Best for: Most production
          systems.
        </p>
        <p>
          <strong>Deep (5+ levels):</strong> Fine granularity, but users get lost,
          bounce rates increase. Only for very large catalogs. Consider faceted search
          instead.
        </p>

        <h3 className="mt-6">Sidebar vs Mega Menu</h3>
        <p>
          <strong>Sidebar:</strong> Always visible, shows hierarchy clearly. Risk: Takes
          horizontal space, less content area. Best for: Documentation, admin dashboards.
        </p>
        <p>
          <strong>Mega Menu:</strong> Shows all options at once, rich content (images,
          descriptions). Risk: Overwhelming, complex to implement. Best for: E-commerce
          homepages.
        </p>
        <p>
          <strong>Hybrid:</strong> Sidebar for main navigation, mega menu for top
          categories. Best of both worlds. Most flexible approach.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Limit Depth:</strong> Max 3-4 levels. If deeper, use faceted search
            or tags for fine-grained classification.
          </li>
          <li>
            <strong>Show Counts:</strong> Display item count per category ("123 articles").
            Helps users gauge category size.
          </li>
          <li>
            <strong>Highlight Active:</strong> Clearly highlight current category. Users
            should always know where they are.
          </li>
          <li>
            <strong>Use Breadcrumbs:</strong> Always show breadcrumb trail. Helps users
            navigate up the hierarchy.
          </li>
          <li>
            <strong>Persist State:</strong> Remember expanded categories in localStorage.
            Users don't have to re-expand on return.
          </li>
          <li>
            <strong>Keyboard Navigation:</strong> Arrow keys to navigate tree, Enter to
            expand/select. Accessibility requirement.
          </li>
          <li>
            <strong>Mobile First:</strong> Design for mobile first (off-canvas, accordion).
            Desktop is enhancement.
          </li>
          <li>
            <strong>SEO URLs:</strong> Hierarchical URLs with slugs. Include ID for
            stability. Handle redirects on slug changes.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Too Deep:</strong> 5+ levels causes navigation friction. Solution:
            Flatten hierarchy, use faceted search for refinement.
          </li>
          <li>
            <strong>No Active State:</strong> Users don't know where they are. Solution:
            Highlight current category, use breadcrumbs.
          </li>
          <li>
            <strong>Slow Loading:</strong> Loading entire tree on mount. Solution: Lazy
            load subcategories, prefetch on hover.
          </li>
          <li>
            <strong>Broken Breadcrumbs:</strong> Breadcrumbs don't match actual hierarchy.
            Solution: Generate breadcrumbs from category tree, not hardcoded.
          </li>
          <li>
            <strong>Mobile Unfriendly:</strong> Desktop sidebar on mobile. Solution:
            Off-canvas drawer, accordion pattern.
          </li>
          <li>
            <strong>SEO Issues:</strong> Category pages not indexed. Solution: Include
            in sitemap, internal linking, proper canonical URLs.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Amazon Category Navigation</h3>
        <p>
          Amazon uses mega menu for top categories (All), sidebar for subcategories.
          Shows product counts, popular subcategories. Breadcrumbs on product pages.
          Handles 10M+ products with 5-6 level hierarchy.
        </p>
        <p>
          <strong>Key Innovation:</strong> Contextual navigation—subcategories change
          based on parent category selected.
        </p>

        <h3 className="mt-6">Documentation Sites (GitBook, Notion)</h3>
        <p>
          Documentation uses sidebar tree navigation. Expandable/collapsible sections.
          Shows current page highlight. Keyboard navigation (arrow keys). Search
          integrates with category navigation.
        </p>
        <p>
          <strong>Key Innovation:</strong> Sync scroll—sidebar highlights current
          section as user scrolls content.
        </p>

        <h3 className="mt-6">News Sites (NYTimes, BBC)</h3>
        <p>
          News sites use horizontal tabs for top categories (World, US, Politics).
          Dropdown for subcategories. Breadcrumbs on article pages. Featured
          subcategories highlighted.
        </p>
        <p>
          <strong>Key Innovation:</strong> Dynamic counts—shows breaking news count
          per category ("US (3 new)").
        </p>

        <h3 className="mt-6">E-commerce (Shopify Stores)</h3>
        <p>
          Shopify stores use sidebar filters + category navigation. Faceted search
          within categories. Collection pages show subcategories as cards. Mobile:
          off-canvas drawer.
        </p>
        <p>
          <strong>Key Innovation:</strong> Visual categories—subcategory cards with
          thumbnail images.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How deep should category hierarchy be?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Max 3-4 levels for most sites. Each level adds
              cognitive load and click friction. If you need more granularity, use
              faceted search (filters within categories) or tags. Exception: Very
              large catalogs (100K+ items) may need 5 levels, but provide shortcuts
              (search, featured categories) to reduce clicks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle category URL changes?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use 301 redirects from old URLs to new URLs. Preserve
              SEO equity. Update internal links, sitemaps. Notify content owners if
              their content's URL changes. Use category IDs in URLs for stability
              (/electronics-123/phones-456), slugs can change but IDs remain constant.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize category navigation performance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Lazy load subcategories (load on expand). Prefetch
              sibling categories on hover. Cache category tree in localStorage. Use
              virtualized lists for 100+ categories. Server-side render top-level
              categories for fast initial load.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make category navigation accessible?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Use semantic HTML (nav, ul, li). ARIA attributes
              (aria-expanded, aria-current). Keyboard navigation (arrow keys, Enter,
              Escape). Focus management (trap focus in mobile drawer). Screen reader
              announcements for expanded/collapsed state. Minimum 44px touch targets.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle category navigation on mobile?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Off-canvas drawer (hamburger menu). Accordion pattern
              for subcategories (one level at a time). Bottom navigation for top 5
              categories. Gesture support (swipe to open/close). Touch targets minimum
              44px. Hide less-used categories behind "More" button.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you measure category navigation success?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Track: Category click-through rate, depth (how many
              levels users navigate), bounce rate from category pages, time to find
              content. A/B test navigation patterns (sidebar vs mega menu). Monitor
              search usage (high search may indicate navigation issues). User testing
              for navigation findability.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/information-architecture/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Information Architecture Basics
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/search/docs/beginner/seo-starter-guide#structure_your_navigation"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google SEO Starter Guide — Site Navigation
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C ARIA — Navigation Menu Pattern
            </a>
          </li>
          <li>
            <a
              href="https://baymard.com/blog/category-navigation-usability"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Baymard Institute — Category Navigation Usability
            </a>
          </li>
          <li>
            <a
              href="https://schema.org/BreadcrumbList"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Schema.org — BreadcrumbList Schema
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
