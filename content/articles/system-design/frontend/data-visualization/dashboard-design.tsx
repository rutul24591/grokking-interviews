"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-data-visualization-dashboard-design",
  title: "Dashboard Design",
  description: "Staff-level guide to dashboard design: layout patterns, visual hierarchy, information density, responsive design, and balancing overview with detail for effective data dashboards.",
  category: "frontend",
  subcategory: "data-visualization",
  slug: "dashboard-design",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "data-visualization", "dashboard", "ux", "layout", "responsive", "information-design"],
  relatedTopics: ["interactive-visualizations", "real-time-data-updates", "chart-libraries-integration", "edge-cases-and-user-experience"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Dashboard Design</strong> encompasses the architectural and UX decisions for presenting multiple visualizations in a cohesive interface. Dashboards consolidate key metrics, charts, and tables into a single view for monitoring, analysis, and decision-making. Effective dashboard design balances information density with clarity, overview with detail, and static with interactive elements.
        </p>
        <p>
          For staff/principal engineers, dashboard design requires understanding information architecture, visual hierarchy, and user workflows. Dashboards serve different purposes: monitoring (track metrics), analysis (explore data), and decision support (inform decisions). Each purpose requires different design approaches.
        </p>
        <p>
          Dashboard challenges include <strong>layout</strong> (arranging multiple visualizations effectively), <strong>density</strong> (showing enough information without overwhelming), <strong>responsiveness</strong> (working across screen sizes), <strong>performance</strong> (rendering multiple visualizations efficiently), and <strong>coherence</strong> (making multiple visualizations feel unified).
        </p>
        <p>
          The business impact of effective dashboard design is significant. Well-designed dashboards enable faster decisions, reduce cognitive load, and improve situational awareness. Poorly designed dashboards confuse users, hide important information, and lead to wrong decisions.
        </p>
        <p>
          In system design interviews, dashboard design demonstrates understanding of information architecture, visual design principles, performance optimization, and user-centered design. It shows you think about the complete user experience, not just individual visualizations.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/dashboard-layout-patterns.svg"
          alt="Dashboard layout patterns: grid layout, hierarchical layout, tabbed layout, and drill-down layout with use cases for each"
          caption="Layout patterns — grid for equal importance, hierarchical for priority, tabbed for categories, drill-down for detail. Choose based on information architecture"
        />

        <h3>Dashboard Types</h3>
        <p>
          <strong>Monitoring Dashboards</strong> track key metrics over time. Updated frequently (real-time or near real-time). Designed for quick scanning. Alerts highlight anomalies. Examples: operations dashboards, trading dashboards, system monitoring.
        </p>
        <p>
          <strong>Analysis Dashboards</strong> enable data exploration. Interactive (filter, drill-down, compare). Show more detail than monitoring dashboards. Designed for extended use. Examples: business intelligence, data exploration, research dashboards.
        </p>
        <p>
          <strong>Decision Support Dashboards</strong> inform specific decisions. Show relevant metrics and context. Highlight recommendations. Designed for periodic use. Examples: executive dashboards, strategic planning, investment dashboards.
        </p>
        <p>
          Dashboard type drives design decisions. Monitoring dashboards prioritize real-time updates and alerts. Analysis dashboards prioritize interactivity and detail. Decision dashboards prioritize clarity and recommendations.
        </p>

        <h3>Layout Patterns</h3>
        <p>
          <strong>Grid Layout</strong> arranges visualizations in a grid. Equal-sized or varied-sized cells. Good for dashboards with multiple metrics of equal importance. Easy to scan. Responsive grids adapt to screen size.
        </p>
        <p>
          <strong>Hierarchical Layout</strong> arranges visualizations by importance. Most important at top-left (for LTR languages). Less important below. Good for dashboards with clear priority. Guides user attention.
        </p>
        <p>
          <strong>Tabbed Layout</strong> organizes visualizations into tabs. Each tab shows related visualizations. Good for dashboards with many visualizations or distinct categories. Reduces initial complexity.
        </p>
        <p>
          <strong>Drill-Down Layout</strong> shows overview with ability to drill into detail. Top level shows summary. Click to see detail. Good for hierarchical data. Enables progressive disclosure.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/dashboard-types.svg"
          alt="Dashboard types showing Monitoring (real-time, alerts), Analysis (charts, exploration), and Decision Support (KPIs vs targets) with comparison table"
          caption="Dashboard types — Monitoring for ops (real-time, alerts), Analysis for exploration (interactive charts), Decision Support for strategy (KPIs vs targets). Match type to user needs"
        />

        <h3>Visual Hierarchy</h3>
        <p>
          Visual hierarchy guides user attention. <strong>Size</strong> (larger = more important), <strong>position</strong> (top-left = most important for LTR), <strong>color</strong> (bright = attention), <strong>contrast</strong> (high contrast = prominent), and <strong>white space</strong> (isolation = importance) create hierarchy.
        </p>
        <p>
          Establish clear hierarchy. Most important metrics should be immediately visible. Secondary metrics should be findable. Tertiary metrics should be accessible but not prominent.
        </p>
        <p>
          Use consistent hierarchy across dashboards. Users learn where to find important information. Consistency reduces cognitive load.
        </p>

        <h3>Information Density</h3>
        <p>
          Information density balances showing enough information with avoiding overwhelm. <strong>Low density</strong> (few metrics, large visualizations) is good for monitoring and presentations. <strong>Medium density</strong> (moderate metrics, balanced visualizations) is good for general use. <strong>High density</strong> (many metrics, compact visualizations) is good for expert users and analysis.
        </p>
        <p>
          Match density to user expertise. Novice users need lower density. Expert users prefer higher density. Provide density controls (expand/collapse, show/hide) for flexibility.
        </p>
        <p>
          Avoid chart junk (decorative elements that don't convey information). Every pixel should convey information or enable interaction. Remove unnecessary borders, backgrounds, and decorations.
        </p>

        <h3>Responsive Design</h3>
        <p>
          Dashboards must work across screen sizes. <strong>Desktop</strong> (1920x1080+) shows full dashboard. <strong>Tablet</strong> (768x1024) may require reflow or tabbing. <strong>Mobile</strong> (375x667) requires significant adaptation.
        </p>
        <p>
          Responsive strategies include <strong>reflow</strong> (rearrange grid for screen size), <strong>progressive disclosure</strong> (show less on small screens, expand on tap), <strong>tabbing</strong> (group into tabs on small screens), and <strong>mobile-specific views</strong> (different layout for mobile).
        </p>
        <p>
          Design for mobile from the start. Don't try to squeeze desktop dashboard onto mobile. Identify key metrics for mobile view. Provide full dashboard on desktop.
        </p>

        <h3>Performance Considerations</h3>
        <p>
          Dashboards with multiple visualizations have compounded performance costs. Each visualization has rendering cost, data cost, and update cost. Total cost is sum of all visualizations.
        </p>
        <p>
          Optimize by <strong>lazy loading</strong> (load visualizations as they come into view), <strong>prioritized loading</strong> (load important visualizations first), <strong>shared data</strong> (reuse data across visualizations), and <strong>update batching</strong> (update multiple visualizations in single batch).
        </p>
        <p>
          Monitor dashboard performance. Track load time, render time, and update latency. Set performance budgets (e.g., dashboard loads in 3s, updates in 1s). Alert when budgets exceeded.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Dashboard architecture requires decisions about layout, state management, and data flow.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/responsive-dashboard.svg"
          alt="Responsive dashboard patterns showing Desktop (full dashboard), Tablet (reflow layout), and Mobile (progressive disclosure with tabs)"
          caption="Responsive patterns — reflow (rearrange grid), progressive disclosure (show less, expand on tap), tabbing (group into tabs), mobile-specific views"
        />

        <h3>Layout Architecture</h3>
        <p>
          Implement a grid-based layout system. Define grid columns and rows. Place visualizations in grid cells. Grid system enables consistent spacing, alignment, and responsive behavior.
        </p>
        <p>
          Use CSS Grid or Flexbox for layout. CSS Grid is ideal for 2D layouts (rows and columns). Flexbox is ideal for 1D layouts (row or column). Combine for complex layouts.
        </p>
        <p>
          Support user customization. Allow users to resize, rearrange, and add/remove visualizations. Persist layout preferences. Users should be able to personalize dashboard.
        </p>

        <h3>State Architecture</h3>
        <p>
          Dashboard state includes <strong>layout state</strong> (visualization positions, sizes), <strong>filter state</strong> (active filters, time range), <strong>visualization state</strong> (chart settings, zoom level), and <strong>data state</strong> (cached data, loading state).
        </p>
        <p>
          Use centralized state management for dashboard state. Redux, Zustand, or Context for React. Centralized state enables coordination across visualizations. Filters applied to one visualization can update others.
        </p>
        <p>
          Persist state for return visits. Save layout, filters, and settings. Restore state on return. Users should resume where they left off.
        </p>

        <h3>Data Architecture</h3>
        <p>
          Dashboard data architecture should minimize redundant data fetching. <strong>Shared data layer</strong> fetches data once, shares across visualizations. <strong>Data normalization</strong> transforms data into consistent format. <strong>Data caching</strong> caches fetched data to avoid refetching.
        </p>
        <p>
          Implement data dependencies. Some visualizations depend on data from others. Load dependencies first. Show dependent visualizations when data available.
        </p>
        <p>
          Handle partial failures. If one visualization fails to load data, don't break entire dashboard. Show error for failed visualization, load others successfully.
        </p>

        <h3>Update Coordination</h3>
        <p>
          Coordinate updates across visualizations. When data updates, multiple visualizations may need to update. Batch updates to avoid visual inconsistency.
        </p>
        <p>
          Use synchronized updates for time-based visualizations. All time-based visualizations should show same time range. When user changes time range, update all visualizations together.
        </p>
        <p>
          Implement loading states. Show loading indicators for each visualization. Enable progressive loading (show visualizations as they load). Don't wait for all visualizations to load before showing anything.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Dashboard design involves trade-offs between information density, clarity, and performance.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Pattern</th>
              <th className="p-3 text-left">Information</th>
              <th className="p-3 text-left">Clarity</th>
              <th className="p-3 text-left">Performance</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Single View</td>
              <td className="p-3">Low</td>
              <td className="p-3">Highest</td>
              <td className="p-3">Best</td>
              <td className="p-3">Monitoring, mobile</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Grid Layout</td>
              <td className="p-3">Medium</td>
              <td className="p-3">High</td>
              <td className="p-3">Good</td>
              <td className="p-3">General purpose</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Tabbed Layout</td>
              <td className="p-3">High</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Good</td>
              <td className="p-3">Many visualizations</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">High Density</td>
              <td className="p-3">Highest</td>
              <td className="p-3">Low</td>
              <td className="p-3">Poor</td>
              <td className="p-3">Expert users, analysis</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that dashboard design should match user needs and context. Monitoring dashboards need clarity over density. Analysis dashboards need density over clarity. Design for primary use case, provide flexibility for others.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Start with user goals. What decisions will users make? What questions will they ask? Design dashboard to answer those questions. Don't show data without purpose.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/dashboard-hierarchy.svg"
          alt="Dashboard visual hierarchy showing KPI pyramid (KPIs at top, charts in middle, tables at bottom) with example dashboard layout"
          caption="Visual hierarchy — KPIs at top (largest), charts in middle, tables at bottom. Size, position, and color create hierarchy"
        />

        <p>
          Establish visual hierarchy. Most important metrics should be prominent. Use size, position, and color to create hierarchy. Be consistent across dashboards.
        </p>
        <p>
          Use consistent visualization types. Same metric should use same chart type across dashboards. Users learn chart meanings. Consistency reduces cognitive load.
        </p>
        <p>
          Provide context for metrics. Show targets, trends, and comparisons. A number without context is meaningless. Show whether metric is good or bad.
        </p>
        <p>
          Enable filtering and drill-down. Users should be able to explore data. Provide time range filters, category filters, and drill-down to detail.
        </p>
        <p>
          Test with users. Observe how users interact with dashboard. Identify confusion points. Iterate based on feedback. Dashboard design is iterative.
        </p>
        <p>
          Document dashboard semantics. What does each metric mean? How is it calculated? When is it updated? Documentation reduces support burden.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Showing too many metrics overwhelms users. Every metric should serve a purpose. Remove metrics that don't inform decisions. Less is more.
        </p>
        <p>
          Not establishing visual hierarchy confuses users. All metrics appear equally important. Users don't know where to look. Establish clear hierarchy.
        </p>
        <p>
          Not providing context misleads users. A metric value without context is meaningless. Show targets, trends, and comparisons.
        </p>
        <p>
          Ignoring mobile users excludes users. Design responsive dashboards. Test on mobile devices. Provide mobile-specific views if needed.
        </p>
        <p>
          Not handling loading states frustrates users. Show loading indicators. Enable progressive loading. Don't show blank dashboard while loading.
        </p>
        <p>
          Not persisting user preferences annoys users. Save layout, filters, and settings. Restore on return. Users should be able to personalize dashboard.
        </p>
        <p>
          Not testing performance causes production issues. Test with realistic data volumes. Profile load time and update latency. Optimize before deployment.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Operations Dashboard: Real-Time Monitoring</h3>
        <p>
          An operations team needed to monitor system health across 100+ services. Dashboard needed to show status, alerts, and trends at a glance.
        </p>
        <p>
          <strong>Solution:</strong> Implemented grid layout with service status tiles. Color-coded status (green/yellow/red). Click tile for detail. Real-time updates via WebSocket.
        </p>
        <p>
          <strong>Results:</strong> Operators could identify issues in seconds. Alert response time reduced by 70%. Dashboard became primary operations tool.
        </p>

        <h3>Executive Dashboard: Decision Support</h3>
        <p>
          Executives needed dashboard showing key business metrics. Dashboard needed to be clear, actionable, and mobile-friendly.
        </p>
        <p>
          <strong>Solution:</strong> Implemented hierarchical layout. KPIs at top. Trends below. Context (targets, prior period) for each metric. Mobile-responsive design.
        </p>
        <p>
          <strong>Results:</strong> Executives could make informed decisions quickly. Dashboard used in weekly meetings. Mobile access enabled decisions on the go.
        </p>

        <h3>Analytics Dashboard: Data Exploration</h3>
        <p>
          Analysts needed dashboard for exploring customer data. Dashboard needed flexibility for different analysis scenarios.
        </p>
        <p>
          <strong>Solution:</strong> Implemented tabbed layout by category (acquisition, engagement, retention). Extensive filtering. Drill-down to individual records. Export functionality.
        </p>
        <p>
          <strong>Results:</strong> Analysts could explore data efficiently. Analysis time reduced by 50%. Dashboard replaced multiple ad-hoc queries.
        </p>

        <h3>Trading Dashboard: High-Frequency Monitoring</h3>
        <p>
          Traders needed dashboard showing real-time prices, positions, and P&L. Dashboard needed to update at 60fps with minimal latency.
        </p>
        <p>
          <strong>Solution:</strong> Implemented high-density grid layout. Canvas rendering for price charts. WebSocket for real-time updates. Custom keyboard shortcuts for trading.
        </p>
        <p>
          <strong>Results:</strong> 60fps updates with 100ms latency. Traders could execute trades quickly. Dashboard handled 1000+ updates/second.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: How do you design a dashboard for multiple user types?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Design for primary user type. Provide customization for others. Use role-based views (different default dashboards per role). Enable personalization (users can add/remove visualizations).
            </p>
            <p>
              Implementation: Define user personas. Design dashboard for primary persona. Provide view switching for other personas. Save preferences per user.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you handle dashboard performance with many visualizations?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use lazy loading (load visualizations as they come into view). Prioritize loading (important visualizations first). Share data across visualizations. Batch updates. Use efficient rendering (Canvas for charts).
            </p>
            <p>
              Implementation: IntersectionObserver for lazy loading. Shared data layer for caching. requestAnimationFrame for batched updates. Profile to identify bottlenecks.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you design responsive dashboards?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use CSS Grid for responsive layouts. Define breakpoints for different screen sizes. Reflow grid at breakpoints. Use progressive disclosure (show less on mobile, expand on tap). Consider mobile-specific views.
            </p>
            <p>
              Implementation: CSS Grid with media queries. Mobile-first approach. Test on actual devices. Provide mobile app for complex dashboards.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you establish visual hierarchy in dashboards?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use size (larger = more important), position (top-left = most important), color (bright = attention), contrast (high contrast = prominent), and white space (isolation = importance).
            </p>
            <p>
              Implementation: Place KPIs at top. Use larger fonts for important metrics. Use color sparingly for alerts. Consistent hierarchy across dashboards.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you handle real-time updates in dashboards?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use WebSocket or SSE for push updates. Batch updates to avoid visual chaos. Throttle update rate for visualizations. Show loading/freshness indicators. Handle disconnection gracefully.
            </p>
            <p>
              Implementation: WebSocket for ingestion. Buffer for batching. requestAnimationFrame for render timing. Show "last updated" timestamp. Reconnect on disconnection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you measure dashboard effectiveness?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Track usage metrics (DAU, time on dashboard, most viewed visualizations). Track performance metrics (load time, update latency). Collect user feedback (surveys, interviews). A/B test design changes.
            </p>
            <p>
              Implementation: Analytics for usage tracking. Performance monitoring for load times. User feedback mechanisms. Iterate based on data.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.nngroup.com/articles/dashboard-design/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NN/g: Dashboard Design
            </a> — Usability guidelines for dashboards.
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2020/08/dashboard-design/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine: Dashboard Design
            </a> — Dashboard design best practices.
          </li>
          <li>
            <a href="https://www.tableau.com/learn/articles/dashboard-design" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Tableau: Dashboard Design
            </a> — Dashboard design principles.
          </li>
          <li>
            <a href="https://css-tricks.com/css-grid-layout-guide/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              CSS-Tricks: CSS Grid
            </a> — CSS Grid layout guide.
          </li>
          <li>
            <a href="https://www.bookauthority.org/books/best-data-visualization-books/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Data Visualization Books
            </a> — Recommended books on data visualization.
          </li>
          <li>
            <a href="https://observablehq.com/@observablehq/dashboard-design" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Observable: Dashboard Design
            </a> — Dashboard design examples.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
