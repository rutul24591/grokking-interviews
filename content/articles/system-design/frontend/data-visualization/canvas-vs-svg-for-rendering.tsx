"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-data-visualization-canvas-vs-svg",
  title: "Canvas vs SVG for Rendering",
  description: "Staff-level guide to Canvas vs SVG: performance characteristics, use case selection, accessibility considerations, and hybrid approaches for data visualization at scale.",
  category: "frontend",
  subcategory: "data-visualization",
  slug: "canvas-vs-svg-for-rendering",
  wordCount: 6200,
  readingTime: 25,
  lastUpdated: "2026-03-31",
  tags: ["frontend", "data-visualization", "canvas", "svg", "rendering", "performance", "accessibility"],
  relatedTopics: ["chart-libraries-integration", "large-dataset-rendering", "interactive-visualizations", "performance-optimization"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Canvas and SVG</strong> are the two primary technologies for rendering graphics and data visualizations in the browser. Canvas provides a raster-based, immediate-mode rendering context where you draw pixels directly. SVG provides a vector-based, retained-mode rendering system where you declare shapes as DOM elements. The choice between Canvas and SVG fundamentally affects performance, accessibility, interactivity, and scalability of data visualizations.
        </p>
        <p>
          This decision is critical for staff/principal engineers because it affects the entire visualization architecture. Choosing wrong can lead to performance bottlenecks, accessibility failures, or inability to scale to required data volumes. The choice depends on data volume, interaction requirements, accessibility needs, and visual complexity.
        </p>
        <p>
          Canvas excels at rendering large volumes of data points (thousands to millions) where individual element access isn't needed. It's ideal for heatmaps, particle systems, and real-time data streams. However, Canvas requires manual implementation of interaction handling, accessibility, and scaling.
        </p>
        <p>
          SVG excels at rendering smaller datasets (hundreds to low thousands of elements) where individual element interaction, styling, and accessibility are important. It's ideal for charts, diagrams, and interactive visualizations. However, SVG performance degrades with large element counts due to DOM overhead.
        </p>
        <p>
          The business impact of this decision is significant. Poor rendering choices lead to slow visualizations that users abandon, inaccessible visualizations that exclude users, and visualizations that can't scale with growing data volumes. The right choice enables performant, accessible, scalable visualizations that deliver insights effectively.
        </p>
        <p>
          In system design interviews, Canvas vs SVG demonstrates understanding of rendering technologies, performance trade-offs, accessibility requirements, and the ability to make architectural decisions based on requirements. It shows you think about the full lifecycle of visualizations, not just initial implementation.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/canvas-vs-svg-comparison.svg"
          alt="Comparison of Canvas (raster, immediate mode, pixel-based) vs SVG (vector, retained mode, DOM-based) showing rendering pipeline differences"
          caption="Canvas vs SVG — Canvas draws pixels directly (immediate mode), SVG creates DOM elements (retained mode). Each has distinct performance and accessibility characteristics"
        />

        <h3>Canvas: Raster-Based Rendering</h3>
        <p>
          Canvas provides a bitmap rendering context accessed via JavaScript. You draw directly to a pixel buffer using drawing commands like fillRect, arc, and lineTo. The canvas element has a fixed resolution determined by its width and height attributes.
        </p>
        <p>
          Canvas uses <strong>immediate mode</strong> rendering. Drawing commands execute immediately and the canvas doesn't retain any knowledge of what was drawn. To modify something, you must clear and redraw the entire canvas or affected regions. This makes Canvas efficient for rendering but requires more code for interaction and animation.
        </p>
        <p>
          Canvas performance characteristics include constant rendering cost regardless of element count (you're just drawing pixels), no DOM overhead, efficient for large data volumes, and GPU acceleration via WebGL. However, Canvas requires manual implementation of hit testing for interactions, manual accessibility implementation, and manual handling of scaling and resolution.
        </p>

        <h3>SVG: Vector-Based Rendering</h3>
        <p>
          SVG (Scalable Vector Graphics) is an XML-based markup language for vector graphics. Each shape (circle, rect, path) is a DOM element that can be styled with CSS, manipulated with JavaScript, and accessed via the DOM API.
        </p>
        <p>
          SVG uses <strong>retained mode</strong> rendering. The browser maintains a scene graph of all elements. When you modify an element, the browser handles redrawing only what's needed. This makes SVG easy to work with but creates overhead as element count grows.
        </p>
        <p>
          SVG performance characteristics include per-element overhead (each shape is a DOM node), automatic hit testing for interactions, built-in accessibility via DOM semantics, infinite scalability without quality loss, and CSS styling support. However, SVG performance degrades with large element counts (typically above 1000-5000 elements) due to DOM and rendering overhead.
        </p>

        <h3>Performance Comparison</h3>
        <p>
          Performance is the primary differentiator between Canvas and SVG. Canvas maintains consistent performance regardless of visual complexity because it's just drawing pixels. SVG performance degrades as element count increases because each element is a DOM node with associated overhead.
        </p>
        <p>
          Rule of thumb: Use SVG for up to 1000 elements for interactive visualizations, up to 5000 for static visualizations. Use Canvas for 1000+ elements, especially for real-time updates or complex animations. For 10,000+ elements, Canvas is essentially required.
        </p>
        <p>
          Animation performance differs significantly. Canvas can animate efficiently by redrawing only changed regions or using requestAnimationFrame for smooth 60fps animation. SVG animations via CSS or SMIL can be hardware accelerated but complex SVG animations can cause layout thrashing.
        </p>

        <h3>Accessibility Considerations</h3>
        <p>
          Accessibility is a critical differentiator. SVG has built-in accessibility because each element is in the DOM. You can add title, desc, and aria-label elements to SVG shapes. Screen readers can navigate SVG content. Keyboard navigation works automatically for focusable SVG elements.
        </p>
        <p>
          Canvas has no built-in accessibility because it's just pixels. You must implement accessibility manually via a parallel DOM structure, ARIA live regions, or keyboard navigation handlers. This requires significant additional work but is achievable with careful implementation.
        </p>
        <p>
          For applications with accessibility requirements (government, enterprise, public-facing), SVG is often the default choice unless data volume requires Canvas. If Canvas is required, budget additional time for accessibility implementation.
        </p>

        <h3>Interactivity Patterns</h3>
        <p>
          SVG provides automatic interactivity. Each element can have click, hover, and other event handlers. CSS can style hover and active states. Tooltips are straightforward via title elements or custom implementations.
        </p>
        <p>
          Canvas requires manual hit testing. You must track what was drawn where and implement mouse coordinate to data mapping. Libraries like D3 provide helpers but the complexity remains. Tooltips require manual positioning and management.
        </p>
        <p>
          For highly interactive visualizations with many interactive elements, SVG reduces implementation complexity. For visualizations where interaction is limited (pan, zoom, select), Canvas interactivity overhead is manageable.
        </p>
      </section>

      <section>
        <h2>Architecture & Flow</h2>
        <p>
          Implementing Canvas or SVG visualizations requires architectural decisions about rendering pipelines, state management, and update patterns.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/canvas-rendering-pipeline.svg"
          alt="Canvas rendering pipeline showing Data → Transform → Rasterize → Display flow with code examples for Canvas drawing commands vs SVG DOM elements"
          caption="Canvas pipeline — imperative drawing commands (immediate mode) vs SVG declarative DOM elements (retained mode). Canvas draws pixels, SVG creates DOM nodes"
        />

        <h3>Canvas Rendering Architecture</h3>
        <p>
          Canvas rendering follows an immediate mode pattern. Maintain a data model separate from the visual representation. On each render cycle, clear the canvas and redraw based on current data. Use requestAnimationFrame for smooth animation.
        </p>
        <p>
          Optimize Canvas rendering by dirty rect tracking (only redraw changed regions), layer separation (static background on one canvas, dynamic elements on another), and offscreen canvases for complex elements that can be cached.
        </p>
        <p>
          For interaction, maintain a spatial index (quadtree for 2D, octree for 3D) to efficiently map mouse coordinates to data elements. Update the index when data changes.
        </p>

        <h3>SVG Rendering Architecture</h3>
        <p>
          SVG rendering follows a retained mode pattern. Create DOM elements for data elements. Update element attributes when data changes. Use D3's data join pattern for efficient updates: enter, update, exit.
        </p>
        <p>
          Optimize SVG rendering by limiting DOM element count, using CSS transforms for animations (hardware accelerated), and grouping related elements for batch operations.
        </p>
        <p>
          For large datasets with SVG, consider virtualization (only render visible elements), level of detail (simplify distant elements), or hybrid approaches (SVG for structure, Canvas for dense data regions).
        </p>

        <h3>Hybrid Approaches</h3>
        <p>
          Hybrid approaches combine Canvas and SVG to leverage strengths of each. Use SVG for interactive elements (axes, labels, tooltips) and Canvas for dense data rendering (scatter plots, heatmaps). This provides accessibility for structure with performance for data.
        </p>
        <p>
          Layering architecture places SVG overlay on top of Canvas base. Canvas handles the heavy data rendering. SVG handles interaction, annotations, and accessibility. Coordinate between layers via shared coordinate systems.
        </p>
        <p>
          Progressive enhancement starts with SVG for accessibility and enhances with Canvas for performance-critical views. Or start with Canvas for performance and provide SVG fallback for accessibility-focused users.
        </p>

        <h3>Responsive Scaling</h3>
        <p>
          Canvas requires manual handling of responsive scaling. Listen for resize events, update canvas dimensions, and redraw at new resolution. Handle device pixel ratio for sharp rendering on high-DPI displays.
        </p>
        <p>
          SVG handles responsive scaling automatically via viewBox attribute. Set viewBox to define coordinate system and let SVG scale to container size. This provides resolution independence without additional code.
        </p>
        <p>
          For both technologies, implement debounced resize handlers to avoid excessive redraws during resize operations.
        </p>
      </section>

      <section>
        <h2>Trade-offs & Comparison</h2>
        <p>
          Canvas vs SVG involves fundamental trade-offs between performance, accessibility, and implementation complexity.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-theme">
              <th className="p-3 text-left">Criterion</th>
              <th className="p-3 text-left">Canvas</th>
              <th className="p-3 text-left">SVG</th>
              <th className="p-3 text-left">Winner</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Performance (1000+ elements)</td>
              <td className="p-3">Excellent</td>
              <td className="p-3">Poor</td>
              <td className="p-3">Canvas</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Accessibility</td>
              <td className="p-3">Manual implementation</td>
              <td className="p-3">Built-in via DOM</td>
              <td className="p-3">SVG</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Interactivity</td>
              <td className="p-3">Manual hit testing</td>
              <td className="p-3">Automatic via DOM</td>
              <td className="p-3">SVG</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Scalability</td>
              <td className="p-3">Resolution dependent</td>
              <td className="p-3">Resolution independent</td>
              <td className="p-3">SVG</td>
            </tr>
            <tr className="border-b border-theme">
              <td className="p-3 font-semibold">Implementation Complexity</td>
              <td className="p-3">Higher (manual everything)</td>
              <td className="p-3">Lower (DOM handles much)</td>
              <td className="p-3">SVG</td>
            </tr>
          </tbody>
        </table>
        <p>
          The staff-level insight is that the choice isn't binary. Hybrid approaches often provide the best balance. Use SVG for structure and interaction, Canvas for dense data. Or use SVG for small datasets and switch to Canvas when data volume grows.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>
          Choose based on data volume. For under 1000 elements with interaction needs, use SVG. For over 5000 elements, use Canvas. For 1000-5000 elements, evaluate based on interaction and accessibility requirements.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/data-visualization/accessibility-patterns.svg"
          alt="Accessibility patterns showing visual channels, screen reader support, keyboard navigation, colorblind-safe palettes, and alternative text descriptions"
          caption="Accessibility — use position over color, provide ARIA labels, enable keyboard navigation, use colorblind-safe palettes, write alt text descriptions"
        />

        <p>
          For Canvas, implement proper cleanup. Cancel animation frames on unmount, release WebGL contexts, and remove event listeners. Canvas can leak resources if not properly cleaned up.
        </p>
        <p>
          For SVG, limit DOM element count. Use grouping (g elements) to reduce element count. Use CSS for styling instead of inline attributes. Use transforms instead of recalculating coordinates.
        </p>
        <p>
          Implement accessibility regardless of technology. For SVG, add title and desc elements, use aria-label, ensure keyboard navigation. For Canvas, provide parallel DOM structure or ARIA live regions with text descriptions.
        </p>
        <p>
          Handle high-DPI displays properly. For Canvas, scale canvas dimensions by devicePixelRatio and scale drawing context. For SVG, this is automatic via viewBox.
        </p>
        <p>
          Profile before optimizing. Use browser DevTools to identify bottlenecks. Canvas issues show as long paint times. SVG issues show as layout or style recalculation overhead.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Using SVG for large datasets causes performance degradation. DOM overhead becomes significant above 1000-5000 elements. Symptoms include slow rendering, janky animation, and high memory usage. Solution: switch to Canvas or implement virtualization.
        </p>
        <p>
          Using Canvas without accessibility implementation excludes users with disabilities. Canvas is invisible to screen readers by default. Solution: implement parallel DOM structure, ARIA live regions, or provide text alternatives.
        </p>
        <p>
          Not handling canvas resolution properly causes blurry rendering on high-DPI displays. Canvas defaults to 1:1 pixel mapping. Solution: scale canvas dimensions by devicePixelRatio and adjust drawing context.
        </p>
        <p>
          Redrawing entire canvas on every frame wastes resources. For partial updates, use dirty rect tracking to only redraw changed regions. Or use layer separation with multiple canvases.
        </p>
        <p>
          Creating new DOM elements on every SVG update causes memory leaks and performance issues. Use D3's data join pattern (enter, update, exit) to efficiently update existing elements instead of creating new ones.
        </p>
        <p>
          Not cleaning up resources causes memory leaks. Remove event listeners, cancel animation frames, and release WebGL contexts on component unmount.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>

        <h3>Financial Dashboard: Real-Time Stock Ticker</h3>
        <p>
          A financial dashboard needed to display real-time stock prices for 500+ stocks with updating charts. Each stock had a mini sparkline chart showing price history.
        </p>
        <p>
          <strong>Solution:</strong> Used Canvas for sparklines (500+ charts updating every second) with SVG for axes and labels. Canvas handled the heavy rendering while SVG provided accessible structure.
        </p>
        <p>
          <strong>Results:</strong> Smooth 60fps updates even with 500+ charts. Accessibility maintained via SVG structure. Memory usage stable at 50MB vs 200MB+ with pure SVG.
        </p>

        <h3>Analytics Platform: Interactive Bar Chart</h3>
        <p>
          An analytics platform needed interactive bar charts with drill-down, tooltips, and filtering. Data volume was moderate (50-200 bars per chart).
        </p>
        <p>
          <strong>Solution:</strong> Used SVG for all rendering. D3 for data binding and scales. CSS for hover states. Built-in DOM events for interaction.
        </p>
        <p>
          <strong>Results:</strong> Rich interactivity with minimal code. Full accessibility via DOM. Easy to implement tooltips and drill-down. Performance excellent for data volume.
        </p>

        <h3>Scientific Visualization: Particle System</h3>
        <p>
          A scientific visualization needed to display 100,000+ particles with real-time animation. Each particle had position, velocity, and color.
        </p>
        <p>
          <strong>Solution:</strong> Used Canvas with WebGL acceleration. Particles stored in typed arrays. GPU handled particle updates and rendering.
        </p>
        <p>
          <strong>Results:</strong> Smooth animation of 100,000+ particles at 60fps. SVG would have crashed the browser at this scale. Provided static SVG screenshot for accessibility with text description.
        </p>

        <h3>Mapping Application: Geographic Visualization</h3>
        <p>
          A mapping application needed to display geographic boundaries (countries, states) with interactive hover and click. Data volume was moderate (200-500 regions).
        </p>
        <p>
          <strong>Solution:</strong> Used SVG for geographic paths. Each region was a path element with data attributes. CSS for hover states. Click handlers for interaction.
        </p>
        <p>
          <strong>Results:</strong> Crisp rendering at any zoom level (SVG scalability). Full accessibility via DOM. Easy to implement tooltips and choropleth coloring via CSS.
        </p>
      </section>

      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: When would you choose Canvas over SVG for data visualization?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Choose Canvas when rendering 1000+ elements, especially for real-time updates or complex animations. Canvas is ideal for heatmaps, particle systems, and large scatter plots. Choose Canvas when performance is critical and accessibility can be implemented separately.
            </p>
            <p>
              Specific scenarios: real-time data streams with frequent updates, visualizations with 10,000+ data points, complex animations at 60fps, pixel-level manipulation requirements.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you implement accessibility for Canvas visualizations?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Implement accessibility via parallel DOM structure that mirrors Canvas content. Use ARIA live regions to announce changes. Provide keyboard navigation handlers that map to Canvas coordinates. Offer text descriptions of visual content.
            </p>
            <p>
              Specific techniques: create hidden DOM elements for each Canvas element, use aria-label on canvas element, implement focus management for keyboard users, provide downloadable data as alternative.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What are the performance characteristics of SVG vs Canvas?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SVG has per-element DOM overhead. Performance degrades as element count increases (typically above 1000-5000 elements). Each element is a DOM node with associated memory and rendering cost. Canvas has constant rendering cost regardless of visual complexity because it's just drawing pixels.
            </p>
            <p>
              Animation performance: Canvas can achieve 60fps for complex animations via requestAnimationFrame. SVG animations via CSS can be hardware accelerated but complex SVG animations cause layout thrashing.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you handle high-DPI displays with Canvas?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Scale canvas dimensions by devicePixelRatio. Set canvas width and height attributes to physical pixels (CSS pixels × devicePixelRatio). Scale the drawing context by devicePixelRatio. This ensures sharp rendering on retina displays.
            </p>
            <p>
              Example: If CSS size is 800×600 and devicePixelRatio is 2, set canvas width to 1600 and height to 1200. Then scale context by 2. This renders at 2x resolution and scales down to CSS size, producing sharp output.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are hybrid Canvas/SVG approaches?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Hybrid approaches combine Canvas and SVG to leverage strengths of each. Use SVG for interactive elements (axes, labels, tooltips) and Canvas for dense data rendering (scatter plots, heatmaps). Layer SVG overlay on top of Canvas base.
            </p>
            <p>
              Benefits: accessibility for structure via SVG, performance for data via Canvas, reduced implementation complexity vs pure Canvas. Common in charting libraries like Chart.js and Plotly.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: How do you optimize Canvas rendering for animations?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use requestAnimationFrame for smooth 60fps animation. Implement dirty rect tracking to only redraw changed regions. Use layer separation with multiple canvases (static background on one, dynamic elements on another). Cache complex elements in offscreen canvases.
            </p>
            <p>
              For WebGL-accelerated Canvas, use instanced rendering for repeated elements. Batch draw calls to reduce overhead. Use typed arrays for efficient data transfer to GPU.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: Canvas API
            </a> — Canvas API documentation and tutorials.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/SVG" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN: SVG
            </a> — SVG documentation and examples.
          </li>
          <li>
            <a href="https://www.w3.org/TR/SVG/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SVG Specification
            </a> — Official SVG specification.
          </li>
          <li>
            <a href="https://d3js.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              D3.js
            </a> — Data-Driven Documents library for SVG visualizations.
          </li>
          <li>
            <a href="https://www.khronos.org/webgl/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              WebGL
            </a> — GPU-accelerated Canvas rendering.
          </li>
          <li>
            <a href="https://www.smashingmagazine.com/2020/06/svg-html-css-javascript/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Smashing Magazine: SVG Best Practices
            </a> — SVG optimization and accessibility guide.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
