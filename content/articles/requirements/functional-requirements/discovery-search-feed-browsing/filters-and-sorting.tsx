"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-requirements-disc-frontend-filters-sorting",
  title: "Filters and Sorting",
  description:
    "Comprehensive guide to filters and sorting covering filter types, sort options, state management, URL persistence, performance optimization, and UX best practices for search refinement.",
  category: "functional-requirements",
  subcategory: "discovery-search-feed-browsing",
  slug: "filters-and-sorting",
  version: "extensive",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-25",
  tags: [
    "requirements",
    "functional",
    "discovery",
    "filters",
    "sorting",
    "frontend",
    "search",
    "ux",
  ],
  relatedTopics: ["search-results", "faceted-search", "search", "state-management"],
};

export default function FiltersAndSortingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Filters and Sorting</strong> enable users to refine search results and
          browse content by applying criteria (filters) and ordering preferences (sorting).
          They are essential for discovery—users who apply filters have 3x higher conversion
          rates and 2x longer session duration. Filters narrow down results (show me only
          phones under $500), while sorting reorders results (show me cheapest first).
        </p>
        <p>
          The challenge is balancing power with simplicity—too many filters overwhelm users,
          too few frustrate them. Well-designed filter/sort systems anticipate user needs
          (common filters upfront, advanced filters collapsible), provide clear feedback
          (active filter badges, result counts), and maintain state (URL persistence,
          back button support).
        </p>
        <p>
          For staff-level engineers, filters and sorting involve state management (filter
          state, sort order), URL synchronization (query params for sharing/bookmarking),
          performance (debouncing, caching), backend integration (filter APIs, sort
          parameters), and accessibility (keyboard navigation, screen reader support).
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <h3>Filter Types</h3>
        <p>
          Different filter UI patterns for different data types:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Checkboxes:</strong> Multi-select categories, tags, brands. Most
            common pattern. Show count per option ("Electronics (123)"). Allow select all/
            none.
          </li>
          <li>
            <strong>Radio Buttons:</strong> Single-select within group (condition: new/
            used/refurbished). Mutually exclusive options.
          </li>
          <li>
            <strong>Sliders:</strong> Range selection for numeric values (price: $50-$500,
            rating: 3-5 stars). Dual-handle sliders for min/max. Show histogram of
            distribution.
          </li>
          <li>
            <strong>Date Range:</strong> Date pickers for time-based filtering (posted:
            Jan 1 - Jan 31). Preset ranges (Last 24 hours, Last week, Last month).
          </li>
          <li>
            <strong>Dropdowns:</strong> Single-select when space constrained. Less
            discoverable than checkboxes (hidden until clicked).
          </li>
          <li>
            <strong>Toggle Switches:</strong> Binary filters (in stock only, free shipping
            only). Clear on/off state.
          </li>
        </ul>

        <h3 className="mt-6">Sort Options</h3>
        <p>
          Common sorting options:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Relevance:</strong> Default for search results. Based on search
            algorithm (text match, engagement, quality). Often best but opaque to users.
          </li>
          <li>
            <strong>Date:</strong> Newest first (default for news, feeds) or oldest first
            (archives, threads). Chronological ordering.
          </li>
          <li>
            <strong>Popularity:</strong> Most viewed, most liked, best selling. Social
            proof ordering.
          </li>
          <li>
            <strong>Price:</strong> Low to high (budget shoppers) or high to low (premium
            shoppers). E-commerce standard.
          </li>
          <li>
            <strong>Rating:</strong> Highest rated first. Quality-focused ordering.
          </li>
          <li>
            <strong>Name:</strong> Alphabetical (A-Z) or reverse (Z-A). Useful for known
            item lookup.
          </li>
        </ul>

        <h3 className="mt-6">Filter Logic</h3>
        <p>
          How filters combine:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>AND Logic:</strong> Most common. All selected filters must match.
            "Electronics AND Phones AND Under $500". Narrows results.
          </li>
          <li>
            <strong>OR Logic:</strong> Within same filter group. "Electronics OR Fashion".
            Broadens results. Used for category selection.
          </li>
          <li>
            <strong>NOT Logic:</strong> Exclude filter. "NOT Refurbished". Less common,
            advanced feature.
          </li>
          <li>
            <strong>Mixed:</strong> AND across groups, OR within groups. "Electronics OR
            Fashion" AND "Under $500" AND "In Stock". Most flexible approach.
          </li>
        </ul>

        <h3 className="mt-6">State Management</h3>
        <p>
          Managing filter/sort state:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Active Filters:</strong> Currently selected filters. Display as
            removable badges/chips. Show count of active filters.
          </li>
          <li>
            <strong>Sort Order:</strong> Current sort option + direction. Default to
            relevance for search, date for feeds.
          </li>
          <li>
            <strong>Filter Counts:</strong> Show matching result count per filter option.
            Update dynamically as filters change.
          </li>
          <li>
            <strong>Expanded State:</strong> Which filter sections are expanded/collapsed.
            Persist in localStorage.
          </li>
        </ul>

        <h3 className="mt-6">URL Persistence</h3>
        <p>
          Syncing filters with URL:
        </p>
        <ul className="space-y-3">
          <li>
            <strong>Query Params:</strong> Encode filters in URL (?category=electronics&
            price_min=50&price_max=500&sort=price_asc). Shareable, bookmarkable.
          </li>
          <li>
            <strong>Browser History:</strong> Push state on filter change. Back button
            restores previous filters.
          </li>
          <li>
            <strong>Debounce:</strong> Don't update URL on every keystroke (price slider).
            Update on change end.
          </li>
          <li>
            <strong>Canonical URLs:</strong> Ensure same filters produce same URL.
            Prevent duplicate content issues.
          </li>
        </ul>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Production filter/sort system involves efficient state management and API
          integration.
        </p>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/filters-and-sorting/filter-architecture.svg"
          alt="Filters and Sorting Architecture"
          caption="Figure 1: Filter Architecture — State management, URL sync, API integration, and result updates"
          width={1000}
          height={500}
        />

        <h3>Component Structure</h3>
        <ul className="space-y-3">
          <li>
            <strong>Filter Container:</strong> Main wrapper. Manages global filter state.
            Fetches available filters on mount.
          </li>
          <li>
            <strong>Filter Section:</strong> Group of related filters (Price, Category,
            Brand). Expandable/collapsible.
          </li>
          <li>
            <strong>Filter Item:</strong> Individual filter (checkbox, slider, dropdown).
            Handles user interaction.
          </li>
          <li>
            <strong>Active Filters:</strong> Shows selected filters as removable badges.
            Clear all button.
          </li>
          <li>
            <strong>Sort Dropdown:</strong> Sort options selector. Shows current sort +
            direction.
          </li>
          <li>
            <strong>Result Count:</strong> Shows matching results ("123 products"). Updates
            on filter change.
          </li>
        </ul>

        <h3 className="mt-6">Filter Change Flow</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>User Interaction:</strong> User selects filter (checkbox, slider, etc.).
          </li>
          <li>
            <strong>Update State:</strong> Update local filter state. Show loading indicator.
          </li>
          <li>
            <strong>Debounce:</strong> Wait for user to finish (slider: on change end,
            search: 300ms debounce).
          </li>
          <li>
            <strong>Update URL:</strong> Push new query params to URL. Browser history
            updated.
          </li>
          <li>
            <strong>API Request:</strong> Fetch filtered results. Cancel pending requests.
          </li>
          <li>
            <strong>Update Results:</strong> Render new results. Maintain scroll position.
          </li>
          <li>
            <strong>Update Counts:</strong> Update filter option counts based on new
            result set.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/filters-and-sorting/filter-types.svg"
          alt="Filter Types"
          caption="Figure 2: Filter Types — Checkboxes, sliders, date range, dropdowns, and toggle switches"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Performance Optimization</h3>
        <ul className="space-y-3">
          <li>
            <strong>Debouncing:</strong> Delay API calls until user stops interacting.
            Slider: 300ms after release. Search input: 300ms after typing.
          </li>
          <li>
            <strong>Request Cancellation:</strong> Cancel pending requests when new filter
            change occurs. Prevents race conditions.
          </li>
          <li>
            <strong>Caching:</strong> Cache filter results by filter combination. Cache
            filter counts separately.
          </li>
          <li>
            <strong>Lazy Loading:</strong> Load filter options on demand. Don't fetch all
            filter options upfront.
          </li>
          <li>
            <strong>Optimistic Updates:</strong> Update UI immediately, fetch results in
            background. Feels instant.
          </li>
          <li>
            <strong>Virtual Scrolling:</strong> For filter options lists with 100+ items.
            Render only visible options.
          </li>
        </ul>

        <h3 className="mt-6">Accessibility Considerations</h3>
        <ul className="space-y-3">
          <li>
            <strong>Keyboard Navigation:</strong> Tab through filters, Enter/Space to
            toggle, Arrow keys for dropdowns.
          </li>
          <li>
            <strong>Screen Reader Support:</strong> ARIA labels for filters
            (aria-checked, aria-expanded). Announce result count changes.
          </li>
          <li>
            <strong>Focus Management:</strong> Keep focus on filter after toggle. Don't
            lose focus on results update.
          </li>
          <li>
            <strong>Visible Focus:</strong> Clear focus indicators for keyboard users.
            Minimum 3:1 contrast.
          </li>
          <li>
            <strong>Color Independence:</strong> Don't rely solely on color for selected
            state. Use icons, text labels.
          </li>
        </ul>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Filter/sort design involves balancing discoverability, space efficiency, and
          cognitive load.
        </p>

        <h3>Filter Placement Trade-offs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Placement</th>
                <th className="text-left p-2 font-semibold">Discoverability</th>
                <th className="text-left p-2 font-semibold">Space Efficiency</th>
                <th className="text-left p-2 font-semibold">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold">Left Sidebar</td>
                <td className="p-2">High (always visible)</td>
                <td className="p-2">Medium (takes horizontal space)</td>
                <td className="p-2">Desktop e-commerce</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Top Bar</td>
                <td className="p-2">Medium</td>
                <td className="p-2">High (compact)</td>
                <td className="p-2">Mobile, simple filters</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Drawer/Modal</td>
                <td className="p-2">Low (hidden until clicked)</td>
                <td className="p-2">Highest (overlay)</td>
                <td className="p-2">Mobile, many filters</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Collapsible Sections</td>
                <td className="p-2">Medium (expand to see)</td>
                <td className="p-2">High (collapse unused)</td>
                <td className="p-2">Desktop, many filter groups</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/requirements/functional-requirements/discovery-search-feed-browsing/filters-and-sorting/sort-options.svg"
          alt="Sort Options UI"
          caption="Figure 3: Sort Options — Relevance, date, popularity, price, rating with direction indicators"
          width={1000}
          height={450}
        />

        <h3 className="mt-6">Update Strategy Trade-offs</h3>
        <p>
          <strong>Instant Update:</strong> Results update immediately on filter change.
          Feels responsive. Risk: Multiple API calls during interaction (slider dragging).
          Best for: Checkboxes, toggles.
        </p>
        <p>
          <strong>Debounced Update:</strong> Wait for user to stop interacting (300ms).
          Reduces API calls. Risk: Slight delay feels unresponsive. Best for: Sliders,
          search input.
        </p>
        <p>
          <strong>Manual Apply:</strong> "Apply Filters" button. User controls when to
          update. Risk: Extra interaction, users may forget to apply. Best for: Complex
          filters, slow APIs.
        </p>

        <h3 className="mt-6">Sort Direction</h3>
        <p>
          <strong>Single Direction:</strong> Each sort option has fixed direction (price:
          low to high only). Simpler UI. Risk: Users can't reverse.
        </p>
        <p>
          <strong>Toggle Direction:</strong> Click to toggle asc/desc (price: low→high
          or high→low). More flexible. Best practice for most use cases.
        </p>
        <p>
          <strong>Separate Options:</strong> List both as separate options (Price: Low
          to High, Price: High to Low). Most explicit, but longer dropdown.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Show Result Counts:</strong> Display count per filter option
            ("Electronics (123)"). Helps users gauge filter impact.
          </li>
          <li>
            <strong>Active Filter Badges:</strong> Show selected filters as removable
            chips above results. Clear all button.
          </li>
          <li>
            <strong>Disable Empty Filters:</strong> Gray out filter options with 0
            results. Don't let users select dead ends.
          </li>
          <li>
            <strong>Preserve Scroll Position:</strong> Don't jump to top on filter
            change. Maintain user's place in results.
          </li>
          <li>
            <strong>Default to Relevance:</strong> For search, default sort should be
            relevance. For browse, default to popularity or date.
          </li>
          <li>
            <strong>Mobile Optimization:</strong> Use drawer/modal for filters on mobile.
            Large touch targets (44px min).
          </li>
          <li>
            <strong>Clear Filters Option:</strong> "Clear all filters" button. Easy reset
            to unfiltered state.
          </li>
          <li>
            <strong>URL Sync:</strong> Sync filters with URL query params. Enables
            sharing, bookmarking, back button support.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>No Result Counts:</strong> Users don't know how many results per
            filter. Solution: Show counts, update dynamically.
          </li>
          <li>
            <strong>Lost State on Back:</strong> Filters reset when navigating back.
            Solution: Persist in URL, restore from history state.
          </li>
          <li>
            <strong>Scroll Jump:</strong> Page jumps to top on filter change. Solution:
            Preserve scroll position, use CSS scroll-behavior.
          </li>
          <li>
            <strong>Too Many Filters:</strong> Overwhelming filter sidebar. Solution:
            Show top 5, "Show more" expandable section.
          </li>
          <li>
            <strong>Slow Updates:</strong> Results take seconds to update. Solution:
            Optimistic updates, loading skeletons, caching.
          </li>
          <li>
            <strong>Empty Results:</strong> No feedback when filters yield 0 results.
            Solution: Show "0 results" message, suggest removing filters.
          </li>
        </ul>
      </section>

      <section>
        <h2>Real-world Use Cases</h2>

        <h3>Amazon Product Filters</h3>
        <p>
          Amazon shows 20+ filter categories in left sidebar. Each filter shows count.
          Price slider with histogram. Multi-select checkboxes. "Apply" button for some
          filters. Sort dropdown with 10+ options.
        </p>
        <p>
          <strong>Key Innovation:</strong> Filter recommendations—"Customers who filtered
          by X also filtered by Y".
        </p>

        <h3 className="mt-6">Airbnb Search Filters</h3>
        <p>
          Airbnb uses top bar for primary filters (dates, guests, price). "Filters"
          button opens modal with 30+ options. Map updates in real-time as filters
          change. Total price shown (including fees).
        </p>
        <p>
          <strong>Key Innovation:</strong> Price filter shows total price (nightly +
          fees), not just nightly rate.
        </p>

        <h3 className="mt-6">GitHub Code Search</h3>
        <p>
          GitHub uses query-based filters (language:Python stars:&gt;100). Autocomplete
          for filter syntax. Results update as you type. Sort by stars, forks, updated.
        </p>
        <p>
          <strong>Key Innovation:</strong> Query builder UI—click to add filter tokens
          instead of typing syntax.
        </p>

        <h3 className="mt-6">LinkedIn Jobs</h3>
        <p>
          LinkedIn Jobs shows filters in left sidebar. Remote/On-site toggle. Date
          posted (24h, week, month). Experience level. Easy Apply checkbox. Sort by
          relevance, date, salary.
        </p>
        <p>
          <strong>Key Innovation:</strong> Salary filter with estimated ranges (even
          when not posted by employer).
        </p>
      </section>

      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you persist filter state?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Three approaches: (1) URL query params—shareable,
              bookmarkable, back button works. Best for most cases. (2) localStorage—
              persists across sessions, not shareable. Good for user preferences. (3)
              Backend sync—filters saved to user account, works across devices. Best
              for logged-in users. Combine approaches: URL for current session,
              localStorage for preferences, backend for saved searches.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you update results on filter change?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Debounce filter changes (300ms for sliders, instant
              for checkboxes). Show loading state (skeleton screens). Cancel pending
              API requests. Update results without page reload (AJAX). Maintain scroll
              position. Update filter counts based on new result set. Use optimistic
              updates for perceived performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you handle 0 results?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Show clear "0 results" message. Suggest removing some
              filters (highlight filters to remove). Show alternative suggestions
              (similar products, broader categories). Don't show empty page. Log 0-result
              filter combinations for analysis (may indicate missing inventory).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you optimize filter performance?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Debounce rapid changes. Cache filter results by filter
              combination. Lazy load filter options. Virtual scroll for 100+ options.
              Pre-fetch common filter combinations. Use CDN for static filter data.
              Backend: index filter columns, use materialized views for filter counts.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you make filters accessible?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Keyboard navigation (Tab, Enter, Space, Arrow keys).
              ARIA attributes (aria-checked, aria-expanded, aria-label). Screen reader
              announcements for result count changes. Visible focus indicators. Color
              independence (don't rely solely on color for selected state). Minimum
              44px touch targets for mobile.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">Q: How do you decide which filters to show?</p>
            <p className="mt-2 text-sm">
              <strong>A:</strong> Analytics—show most-used filters prominently. User
              research—identify common filtering patterns. Domain knowledge—what filters
              matter for this content type? A/B test filter placement and defaults.
              Show top 5-7 filters expanded, rest collapsible. Personalize based on
              user behavior (frequent price filter user → show price first).
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.nngroup.com/articles/filters-e-commerce/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — E-Commerce Filter Usability
            </a>
          </li>
          <li>
            <a
              href="https://baymard.com/blog/filtering-usability"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Baymard Institute — Filtering Usability Research
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C ARIA — Accessible UI Patterns
            </a>
          </li>
          <li>
            <a
              href="https://developers.google.com/search/docs/beginner/seo-starter-guide#structure_your_navigation"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google SEO Starter Guide — URL Structure for Filters
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/tag/filters/"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Smashing Magazine — Filter Design Articles
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
