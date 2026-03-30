"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-lazy-loading",
  title: "Lazy Loading (Images, Components, Routes)",
  description: "Comprehensive guide to lazy loading techniques for images, components, and routes to optimize frontend performance and reduce initial bundle size.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "lazy-loading",
  wordCount: 6100,
  readingTime: 25,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "lazy-loading", "images", "intersection-observer", "code-splitting", "optimization"],
  relatedTopics: ["code-splitting", "image-optimization", "virtualization-windowing", "web-vitals"],
};

export default function LazyLoadingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Lazy loading</strong> is a design pattern that defers the loading of resources until they are actually 
          needed, rather than loading everything upfront during initial page load. In frontend development, lazy loading 
          applies to three primary targets: <strong>images</strong> (the largest bandwidth consumers), 
          <strong>components</strong> (heavy UI elements not immediately visible), and <strong>routes</strong> (entire 
          pages loaded on navigation).
        </p>
        <p>
          The fundamental insight behind lazy loading is simple but powerful: users rarely consume an entire application 
          in a single session. A visitor to an e-commerce site might browse the homepage and a few product pages but never 
          visit the checkout, account settings, or order history. A user of a SaaS dashboard might spend their entire 
          session in the analytics view without ever opening the settings panel. Loading code and assets for features that 
          users never access is wasted bandwidth, wasted parsing time, and wasted memory.
        </p>
        <p>
          Lazy loading directly addresses this waste by inverting the default loading strategy. Instead of &quot;load 
          everything, then render,&quot; lazy loading follows &quot;render what&apos;s needed, load the rest on demand.&quot; 
          This shift has profound performance implications:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Reduced Initial Payload:</strong> A typical page with 30 images might total 5-10 MB. With lazy loading, 
            only the 3-5 above-fold images (500 KB - 1 MB) load initially. The remaining 80-90% of image data is deferred 
            until the user scrolls.
          </li>
          <li>
            <strong>Faster Time to Interactive:</strong> By deferring non-critical resources, the browser can focus its 
            limited network and CPU resources on loading and executing the code needed for the initial view. This directly 
            improves Time to Interactive (TTI) and Total Blocking Time (TBT).
          </li>
          <li>
            <strong>Improved Core Web Vitals:</strong> Lazy loading images below the fold prevents them from competing 
            with the Largest Contentful Paint (LCP) element for bandwidth. Lazy loading components reduces JavaScript 
            execution time during initial load.
          </li>
          <li>
            <strong>Bandwidth Savings:</strong> Users on mobile or metered connections only download assets they actually 
            view. A user who never scrolls past the hero section never downloads images that are 2000 pixels down the page.
          </li>
        </ul>
        <p>
          The three lazy loading targets employ different mechanisms but share the same core principle:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Images:</strong> Use native <code>loading=&quot;lazy&quot;</code> attribute or Intersection Observer 
            API to defer image downloads until they approach the viewport.
          </li>
          <li>
            <strong>Components:</strong> Use dynamic <code>import()</code> with React.lazy and Suspense to load component 
            code only when the component is about to render.
          </li>
          <li>
            <strong>Routes:</strong> Combine route-based code splitting with lazy loading to fetch entire page bundles 
            only when the user navigates to that route.
          </li>
        </ul>
        <p>
          In system design interviews, lazy loading demonstrates understanding of resource prioritization, progressive 
          enhancement, and the trade-offs between initial load time and on-demand latency. It is a foundational technique 
          for building performant applications at scale.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/lazy-loading-types.svg"
          alt="Diagram comparing three types of lazy loading: images with viewport triggers, components with interaction triggers, and routes with navigation triggers"
          caption="Three primary lazy loading targets: images, components, and routes — each with different trigger mechanisms"
        />

        <h3>The Lazy Loading Spectrum</h3>
        <p>
          Lazy loading exists on a spectrum from &quot;eager&quot; (load immediately) to &quot;lazy&quot; (load only when 
          absolutely necessary). The optimal position depends on the resource type, user behavior patterns, and network 
          conditions:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Eager Loading:</strong> Resources load immediately during initial page load. Appropriate for 
            above-the-fold content, critical CSS, and the LCP element.
          </li>
          <li>
            <strong>Progressive Loading:</strong> Resources load in priority order. Critical resources first, then 
            important resources, then non-essential resources. This is the middle ground.
          </li>
          <li>
            <strong>Lazy Loading:</strong> Resources load only when triggered by user action (scroll, click, navigation). 
            Appropriate for below-fold content and features that may never be used.
          </li>
        </ul>

        <h3>Viewport and Thresholds</h3>
        <p>
          For image lazy loading, the <strong>viewport</strong> is the visible portion of the webpage in the browser 
          window. The <strong>threshold</strong> is the distance from the viewport edge at which loading begins. A 
          threshold of 200 pixels means an image starts loading when it comes within 200 pixels of becoming visible.
        </p>
        <p>
          Choosing the right threshold is critical:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Too small (0-50px):</strong> Images may load visibly as the user scrolls, creating a jarring 
            &quot;pop-in&quot; effect. On slow connections, users see blank spaces.
          </li>
          <li>
            <strong>Too large (500px+):</strong> Images load too early, negating the bandwidth savings of lazy loading. 
            You effectively load most of the page upfront.
          </li>
          <li>
            <strong>Optimal (100-300px):</strong> Images load just before they become visible, providing a seamless 
            experience while maximizing bandwidth savings.
          </li>
        </ul>

        <h3>Placeholder Strategies</h3>
        <p>
          When lazy loading, the space where a resource will appear must be handled carefully to prevent layout shifts 
          and provide visual feedback:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Dimension Placeholders:</strong> Reserve space using explicit <code>width</code> and 
            <code>height</code> attributes or CSS <code>aspect-ratio</code>. This prevents Cumulative Layout Shift (CLS) 
            as images load.
          </li>
          <li>
            <strong>Color Placeholders:</strong> Fill the reserved space with a solid color (often extracted from the 
            image&apos;s dominant color). Provides a clean loading state.
          </li>
          <li>
            <strong>Blur-Up Placeholders:</strong> Display a tiny (20x15 pixel) blurred version of the image that 
            progressively sharpens as the full image loads. Used by Medium, Pinterest, and Instagram.
          </li>
          <li>
            <strong>Skeleton Screens:</strong> Show an animated gray placeholder that mimics the layout of the loading 
            content. Provides perceived performance improvement.
          </li>
          <li>
            <strong>Low-Quality Image Placeholders (LQIP):</strong> Similar to blur-up but uses a small, compressed 
            version of the actual image (e.g., 10% quality JPEG) as the placeholder.
          </li>
        </ul>

        <h3>Intersection Observer API</h3>
        <p>
          The Intersection Observer API is the modern browser API for detecting when elements enter or exit the viewport. 
          It replaced scroll event listeners for lazy loading because it is:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Efficient:</strong> The browser batches intersection checks and fires callbacks asynchronously, 
            avoiding the performance cost of scroll event handlers.
          </li>
          <li>
            <strong>Declarative:</strong> You specify what to observe and the threshold; the browser handles the rest.
          </li>
          <li>
            <strong>Accurate:</strong> Provides precise intersection ratios and bounding box information.
          </li>
        </ul>
        <p>
          The API creates an observer that watches target elements and calls a callback function when their intersection 
          with the viewport (or a specified root element) changes.
        </p>

        <h3>Dynamic Imports</h3>
        <p>
          For component and route lazy loading, the <code>import()</code> function is the core mechanism. Unlike static 
          <code>import</code> statements (which are evaluated at build time), dynamic <code>import()</code> returns a 
          Promise that resolves to the imported module at runtime. This enables conditional and on-demand loading:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Code Splitting:</strong> Bundlers create separate chunks for dynamically imported modules.
          </li>
          <li>
            <strong>Error Handling:</strong> Failed imports can be caught and handled gracefully.
          </li>
          <li>
            <strong>Conditional Loading:</strong> Imports can be wrapped in conditions (user roles, feature flags, 
            device capabilities).
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/lazy-loading-intersection-observer.svg"
          alt="Flow diagram showing how Intersection Observer detects when elements enter viewport threshold and triggers image loading"
          caption="Intersection Observer flow: observer monitors targets, fires callback when threshold is crossed, image loads"
        />

        <h3>Image Lazy Loading Architecture</h3>
        <p>
          Modern image lazy loading follows a well-established pattern:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Initial HTML:</strong> The HTML contains <code>img</code> tags with <code>loading=&quot;lazy&quot;</code> 
            or with a <code>data-src</code> attribute holding the actual image URL. The <code>src</code> attribute either 
            points to a placeholder or is empty.
          </li>
          <li>
            <strong>Observer Registration:</strong> JavaScript creates an Intersection Observer with a threshold of 
            approximately 0.01 (trigger when 1% of the image is visible) and a <code>rootMargin</code> of 200px (start 
            loading 200px before the image enters the viewport).
          </li>
          <li>
            <strong>Scroll Detection:</strong> As the user scrolls, the browser detects when observed images cross the 
            threshold boundary. This detection happens on the compositor thread, not the main thread, avoiding jank.
          </li>
          <li>
            <strong>Callback Execution:</strong> The observer callback fires with an array of IntersectionObserverEntry 
            objects. Each entry indicates whether the target is intersecting and provides intersection ratio data.
          </li>
          <li>
            <strong>Image Loading:</strong> For intersecting entries, JavaScript sets the <code>src</code> attribute to 
            the actual image URL (from <code>data-src</code>). The browser immediately begins downloading the image.
          </li>
          <li>
            <strong>Observer Cleanup:</strong> Once an image has been triggered for loading, it is unobserved to prevent 
            repeated callbacks. The observer connection is severed for that element.
          </li>
        </ol>

        <h3>Component Lazy Loading Architecture</h3>
        <p>
          Component lazy loading in React follows the React.lazy + Suspense pattern:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Component Declaration:</strong> A component is wrapped with <code>React.lazy()</code>, which takes 
            a function returning a dynamic <code>import()</code>. This tells React to split this component into a 
            separate chunk.
          </li>
          <li>
            <strong>Suspense Boundary:</strong> The lazy component is wrapped in a <code>Suspense</code> component with 
            a <code>fallback</code> prop. The fallback is displayed while the component chunk loads.
          </li>
          <li>
            <strong>Render Trigger:</strong> When React encounters the lazy component during render, it checks if the 
            component module is already loaded.
          </li>
          <li>
            <strong>Chunk Fetch:</strong> If not loaded, React suspends rendering of that component and initiates the 
            dynamic import. The fallback UI is displayed.
          </li>
          <li>
            <strong>Module Resolution:</strong> Once the chunk downloads and executes, the Promise resolves. React 
            re-renders the component tree with the actual component.
          </li>
          <li>
            <strong>Subsequent Renders:</strong> The component module is cached. Future renders use the cached module 
            without additional network requests.
          </li>
        </ol>

        <h3>Route Lazy Loading Architecture</h3>
        <p>
          Route lazy loading combines component lazy loading with router integration:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Route Configuration:</strong> Routes are configured with lazy-loaded components. In React Router, 
            this uses the <code>element</code> prop with a lazy component. In Next.js, each file in <code>app/</code> or 
            <code>pages/</code> is automatically a lazy-loaded route.
          </li>
          <li>
            <strong>Navigation Interception:</strong> When the user clicks a navigation link, the router intercepts 
            the click and prevents full page reload.
          </li>
          <li>
            <strong>Route Matching:</strong> The router matches the new URL to the route configuration and identifies 
            the component for that route.
          </li>
          <li>
            <strong>Chunk Loading:</strong> If the route component is lazy, the router triggers the dynamic import. 
            A loading state or transition animation may display.
          </li>
          <li>
            <strong>History Update:</strong> Once the component loads, the router updates the browser history and 
            renders the new route.
          </li>
        </ol>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/lazy-loading-performance.svg"
          alt="Performance comparison chart showing initial load size and timeline metrics with and without lazy loading implementation"
          caption="Performance impact: lazy loading reduces initial payload by 80% and improves LCP from 4.8s to 1.2s"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <h3>Benefits of Lazy Loading</h3>
        <ul className="space-y-2">
          <li>
            <strong>Dramatic Initial Load Reduction:</strong> Lazy loading images can reduce initial page weight by 
            70-90%. For a page with 50 images totaling 10 MB, lazy loading means only 500 KB - 1 MB loads initially.
          </li>
          <li>
            <strong>Improved Core Web Vitals:</strong> By deferring non-critical resources, lazy loading directly 
            improves LCP (less competition for bandwidth), FCP (faster first paint), and TBT (less JavaScript to 
            execute).
          </li>
          <li>
            <strong>Bandwidth Efficiency:</strong> Users only download what they actually view. Analytics show that 
            50-70% of users never scroll past the first screen on content sites. Lazy loading ensures they don&apos;t 
            download content they never see.
          </li>
          <li>
            <strong>Memory Efficiency:</strong> Fewer DOM nodes and images in memory means lower memory pressure, 
            especially important on mobile devices with limited RAM.
          </li>
          <li>
            <strong>Better User Experience on Slow Networks:</strong> Users on 3G or congested networks can interact 
            with above-the-fold content while below-the-fold content loads progressively as they scroll.
          </li>
        </ul>

        <h3>Trade-offs and Costs</h3>
        <ul className="space-y-2">
          <li>
            <strong>Content Delay:</strong> Lazy-loaded content is not immediately available. Users who scroll quickly 
            may see loading placeholders. On slow connections, this can be frustrating.
          </li>
          <li>
            <strong>SEO Considerations:</strong> Search engine crawlers may not execute JavaScript to lazy-load content. 
            Critical content for SEO should be eagerly loaded or use server-side rendering.
          </li>
          <li>
            <strong>Accessibility Challenges:</strong> Screen readers may not announce lazy-loaded content that hasn&apos;t 
            loaded yet. Proper ARIA attributes and loading announcements are required.
          </li>
          <li>
            <strong>Implementation Complexity:</strong> Lazy loading requires careful handling of loading states, error 
            states, and edge cases (rapid scrolling, network failures).
          </li>
          <li>
            <strong>Layout Shift Risk:</strong> Without proper dimension placeholders, lazy-loaded images cause 
            Cumulative Layout Shift as they load. This harms user experience and Core Web Vitals scores.
          </li>
          <li>
            <strong>Browser Support:</strong> While <code>loading=&quot;lazy&quot;</code> is widely supported, older 
            browsers require Intersection Observer polyfills or fallback strategies.
          </li>
        </ul>

        <h3>Native vs Custom Lazy Loading</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Aspect</th>
                <th className="p-3 text-left">Native (loading=&quot;lazy&quot;)</th>
                <th className="p-3 text-left">Custom (Intersection Observer)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Browser Support</td>
                <td className="p-3">~95% (not IE11)</td>
                <td className="p-3">~97% (with polyfill: 100%)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Implementation</td>
                <td className="p-3">Single attribute</td>
                <td className="p-3">10-30 lines of JavaScript</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Threshold Control</td>
                <td className="p-3">Browser-determined</td>
                <td className="p-3">Fully customizable</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Placeholder Support</td>
                <td className="p-3">Manual (CSS/HTML)</td>
                <td className="p-3">Programmatic control</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Performance</td>
                <td className="p-3">Optimized by browser</td>
                <td className="p-3">Depends on implementation</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Best For</td>
                <td className="p-3">Standard image galleries</td>
                <td className="p-3">Complex loading logic</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>When NOT to Lazy Load</h3>
        <ul className="space-y-2">
          <li>
            <strong>Above-the-fold content:</strong> The LCP element and critical above-the-fold images should load 
            eagerly with <code>fetchPriority=&quot;high&quot;</code>. Lazy loading these harms LCP.
          </li>
          <li>
            <strong>SEO-critical content:</strong> Content that must be indexed by search engines should be in the 
            initial HTML or eagerly loaded.
          </li>
          <li>
            <strong>Small images:</strong> Icons, logos, and small decorative images (&lt;10 KB) don&apos;t benefit 
            significantly from lazy loading and may cause visible pop-in.
          </li>
          <li>
            <strong>Single-screen pages:</strong> If the entire page fits in the viewport without scrolling, lazy 
            loading provides no benefit.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>

        <h3>Always Set Explicit Dimensions</h3>
        <p>
          Never lazy-load images without explicit <code>width</code> and <code>height</code> attributes or CSS 
          <code>aspect-ratio</code>. Without dimensions, the browser cannot reserve space, causing layout shifts 
          as images load. This directly harms CLS scores and creates a jarring user experience.
        </p>

        <h3>Use Native Lazy Loading When Possible</h3>
        <p>
          For standard image lazy loading, prefer <code>loading=&quot;lazy&quot;</code> over custom Intersection 
          Observer implementations. Native lazy loading is:
        </p>
        <ul className="space-y-1">
          <li>• Simpler to implement (single attribute)</li>
          <li>• Optimized by browser engineers</li>
          <li>• Automatically disabled for above-the-fold images</li>
          <li>• Integrated with browser&apos;s resource prioritization</li>
        </ul>

        <h3>Implement Fallback for Older Browsers</h3>
        <p>
          For browsers that don&apos;t support <code>loading=&quot;lazy&quot;</code> (IE11, older Safari), provide 
          a JavaScript fallback using Intersection Observer with a polyfill:
        </p>
        <ul className="space-y-1">
          <li>• Detect support using feature detection</li>
          <li>• Load Intersection Observer polyfill conditionally</li>
          <li>• Apply custom lazy loading only when native is unavailable</li>
        </ul>

        <h3>Optimize Threshold for Your Content</h3>
        <p>
          Adjust the loading threshold based on your content type and typical connection speeds:
        </p>
        <ul className="space-y-1">
          <li>• <strong>100-200px:</strong> Standard for most content (text, small images)</li>
          <li>• <strong>300-500px:</strong> For large images or slow connection audiences</li>
          <li>• <strong>0-50px:</strong> Only for very small images or when bandwidth is critical</li>
        </ul>

        <h3>Provide Meaningful Placeholders</h3>
        <p>
          Never leave lazy-loading containers blank. Use one of these placeholder strategies:
        </p>
        <ul className="space-y-1">
          <li>• <strong>Skeleton screens:</strong> Animated gray boxes matching the content layout</li>
          <li>• <strong>Blur-up images:</strong> Tiny blurred versions that sharpen as full images load</li>
          <li>• <strong>Color placeholders:</strong> Dominant color extracted from the image</li>
          <li>• <strong>Loading spinners:</strong> For components and routes (not images)</li>
        </ul>

        <h3>Handle Loading Errors Gracefully</h3>
        <p>
          Images can fail to load due to network errors, broken URLs, or server issues. Implement error handling:
        </p>
        <ul className="space-y-1">
          <li>• Add <code>onError</code> handlers to display fallback images</li>
          <li>• Provide retry mechanisms for transient failures</li>
          <li>• Log errors for monitoring and debugging</li>
        </ul>

        <h3>Combine with Image Optimization</h3>
        <p>
          Lazy loading complements but doesn&apos;t replace image optimization. Always:
        </p>
        <ul className="space-y-1">
          <li>• Serve modern formats (WebP, AVIF) with fallbacks</li>
          <li>• Use responsive images with <code>srcset</code> and <code>sizes</code></li>
          <li>• Compress images appropriately (quality 75-85 for most use cases)</li>
          <li>• Use CDN with image transformation capabilities</li>
        </ul>

        <h3>Monitor Lazy Loading Performance</h3>
        <p>
          Use Real User Monitoring (RUM) to track:
        </p>
        <ul className="space-y-1">
          <li>• Image load times and failure rates</li>
          <li>• Scroll depth distribution (how far users actually scroll)</li>
          <li>• CLS scores to catch layout shift issues</li>
          <li>• LCP to ensure above-the-fold content isn&apos;t affected</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Lazy-Loading the LCP Element</h3>
        <p>
          The most critical mistake is lazy-loading the Largest Contentful Paint element (usually the hero image or 
          main heading). This adds 1-3 seconds to LCP because the image won&apos;t start loading until JavaScript 
          executes and the Intersection Observer triggers.
        </p>
        <p>
          <strong>Solution:</strong> Identify your LCP element using Chrome DevTools or Lighthouse. Load it eagerly 
          with <code>loading=&quot;eager&quot;</code> and <code>fetchPriority=&quot;high&quot;</code>. Only lazy-load 
          images below the fold.
        </p>

        <h3>Missing Dimensions Causing Layout Shift</h3>
        <p>
          Lazy-loading images without explicit dimensions causes the page layout to shift as images load. This creates 
          a jarring experience where text and elements jump around, and directly harms CLS scores.
        </p>
        <p>
          <strong>Solution:</strong> Always specify <code>width</code> and <code>height</code> on images, or use CSS 
          <code>aspect-ratio</code> to reserve space. For responsive images, calculate aspect ratio from the source 
          dimensions.
        </p>

        <h3>Creating New Observers on Every Render</h3>
        <p>
          In React components, creating a new Intersection Observer on every render causes memory leaks and performance 
          issues. Each observer holds references to DOM elements and callbacks.
        </p>
        <p>
          <strong>Solution:</strong> Create the observer once in a <code>useEffect</code> hook with an empty dependency 
          array. Store the observer in a <code>useRef</code> to maintain the reference across renders. Clean up the 
          observer on component unmount.
        </p>

        <h3>Not Unobserving Loaded Images</h3>
        <p>
          Failing to unobserve images after they&apos;ve been triggered for loading means the observer continues to 
          monitor them indefinitely. This wastes memory and can cause callbacks to fire repeatedly.
        </p>
        <p>
          <strong>Solution:</strong> Call <code>observer.unobserve(entry.target)</code> immediately after triggering 
          the image load. This severs the observer connection for that element.
        </p>

        <h3>Ignoring Error States</h3>
        <p>
          Lazy-loaded images can fail to load due to network errors, broken URLs, or server issues. Without error 
          handling, users see blank spaces or broken image icons.
        </p>
        <p>
          <strong>Solution:</strong> Add <code>onError</code> handlers that display fallback images or error messages. 
          Consider implementing retry logic for transient failures.
        </p>

        <h3>Over-Lazy-Loading</h3>
        <p>
          Lazy-loading everything, including small icons and above-the-fold content, creates a poor user experience 
          with constant loading indicators and pop-in effects.
        </p>
        <p>
          <strong>Solution:</strong> Be selective. Only lazy-load resources that are: (1) below the fold, (2) 
          significant in size (&gt;50 KB), and (3) not critical for initial interaction or SEO.
        </p>

        <h3>Breaking Accessibility</h3>
        <p>
          Lazy-loaded content that hasn&apos;t loaded yet is invisible to screen readers. Users navigating with 
          assistive technology may miss content entirely.
        </p>
        <p>
          <strong>Solution:</strong> Use ARIA attributes like <code>aria-busy=&quot;true&quot;</code> on loading 
          containers. Announce loading states with <code>aria-live</code> regions. Ensure lazy-loaded content is 
          still in the DOM (not conditionally rendered) so screen readers can detect it.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Product Listing</h3>
        <p>
          An e-commerce site with product listing pages showing 50+ products implemented lazy loading for product 
          images. Each product card contains a 400x400 pixel image (~80 KB WebP). Without lazy loading, the initial 
          page load was 4.2 MB. With lazy loading, only 8-10 above-the-fold images loaded initially (~800 KB).
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• Initial load time on 3G: 18s → 4.5s (75% improvement)</li>
          <li>• LCP: 3.8s → 1.4s</li>
          <li>• Bounce rate decreased by 22%</li>
          <li>• Users who scrolled past fold loaded additional images seamlessly</li>
        </ul>

        <h3>Social Media Feed</h3>
        <p>
          A social media application with infinite-scroll feed implemented lazy loading combined with virtualization. 
          Posts with images and videos only loaded media when they were within 300 pixels of the viewport. Combined 
          with windowing (only rendering 10 posts at a time), this enabled smooth scrolling through thousands of posts.
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• Memory usage: 800 MB → 150 MB for 1000-post feed</li>
          <li>• Scroll FPS: 25-30fps → 55-60fps</li>
          <li>• Data usage for casual scrollers: reduced by 85%</li>
        </ul>

        <h3>News Article with Image Gallery</h3>
        <p>
          A news publisher implemented lazy loading for article images and an image gallery component. The article 
          text loaded immediately, while images below the fold and the gallery (triggered by user click) loaded 
          on-demand.
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• Article time-to-read: reduced by 40% (text visible immediately)</li>
          <li>• Gallery load: 0 KB for users who didn&apos;t click gallery (60% of users)</li>
          <li>• Mobile traffic increased 28% due to improved performance</li>
        </ul>

        <h3>Dashboard with Heavy Chart Components</h3>
        <p>
          A SaaS dashboard with multiple chart widgets implemented lazy loading for chart components. The dashboard 
          layout loaded immediately with skeleton placeholders. Charts (each ~200 KB including the charting library) 
          loaded as they scrolled into view.
        </p>
        <p>
          Results:
        </p>
        <ul className="space-y-1">
          <li>• Dashboard initial render: 5.2s → 1.8s</li>
          <li>• Users who only viewed top metrics never downloaded bottom chart code</li>
          <li>• Perceived performance improved significantly with skeleton loading states</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is lazy loading and why is it important for performance?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Lazy loading is a design pattern that defers loading of resources until they are actually needed, rather 
              than loading everything during initial page load. It applies to images (below-fold images load as user 
              scrolls), components (heavy UI elements load when triggered), and routes (page bundles load on navigation).
            </p>
            <p className="mb-3">
              It is important for performance because:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Reduces initial payload:</strong> A page with 50 images totaling 10 MB might only load 
              800 KB initially with lazy loading — an 92% reduction.</li>
              <li>• <strong>Improves Core Web Vitals:</strong> Less competition for bandwidth means faster LCP and 
              FCP. Less JavaScript to execute means better TBT.</li>
              <li>• <strong>Saves bandwidth:</strong> Users only download what they actually view. Analytics show 
              50-70% of users never scroll past the first screen.</li>
              <li>• <strong>Reduces memory usage:</strong> Fewer DOM nodes and images in memory means better 
              performance on memory-constrained devices.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What are the different ways to implement lazy loading for images?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              There are three main approaches:
            </p>
            <ol className="space-y-2">
              <li>
                <strong>Native Lazy Loading:</strong> Use the <code>loading=&quot;lazy&quot;</code> attribute on img 
                tags. This is the simplest approach, supported in all modern browsers. The browser handles intersection 
                detection and loading automatically.
              </li>
              <li>
                <strong>Intersection Observer API:</strong> Create an Intersection Observer that watches images and 
                triggers loading when they approach the viewport. This provides more control over thresholds and 
                loading behavior. Works in ~97% of browsers; requires polyfill for IE11.
              </li>
              <li>
                <strong>Scroll Event Listener:</strong> Listen to scroll events and calculate which images are near 
                the viewport. This is the legacy approach and is not recommended due to performance issues (scroll 
                handlers fire 60+ times per second).
              </li>
            </ol>
            <p className="mt-3">
              I recommend native lazy loading for standard use cases, with Intersection Observer as a fallback for 
              older browsers or when custom behavior is needed.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: When should you NOT use lazy loading?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Lazy loading is not appropriate in these scenarios:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Above-the-fold content:</strong> The LCP element and critical above-the-fold images 
              should load eagerly. Lazy loading these adds 1-3 seconds to LCP.</li>
              <li>• <strong>SEO-critical content:</strong> Content that must be indexed by search engines should 
              be in the initial HTML or eagerly loaded. Crawlers may not execute JavaScript to lazy-load content.</li>
              <li>• <strong>Small images:</strong> Icons, logos, and small decorative images (&lt;10 KB) don&apos;t 
              benefit significantly from lazy loading.</li>
              <li>• <strong>Single-screen pages:</strong> If the entire page fits in the viewport without scrolling, 
              lazy loading provides no benefit.</li>
              <li>• <strong>User-triggered content:</strong> Content that appears on user interaction (modals, 
              dropdowns) should use different patterns (dynamic imports) rather than scroll-based lazy loading.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How do you prevent layout shifts when lazy loading images?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Layout shifts occur when images load without reserved space, causing surrounding content to jump. To 
              prevent this:
            </p>
            <ol className="space-y-2">
              <li>
                <strong>Explicit dimensions:</strong> Always specify <code>width</code> and <code>height</code> 
                attributes on images. The browser reserves space based on these dimensions and the image&apos;s 
                aspect ratio.
              </li>
              <li>
                <strong>CSS aspect-ratio:</strong> For responsive images, use CSS <code>aspect-ratio</code> property 
                to maintain the correct proportions as the container resizes.
              </li>
              <li>
                <strong>Placeholder containers:</strong> Create a container with the exact dimensions of the image 
                before the image loads. Fill it with a placeholder (solid color, skeleton, or blur-up image).
              </li>
              <li>
                <strong>Avoid conditionally rendering:</strong> Keep the image container in the DOM even before 
                loading. Don&apos;t conditionally render based on load state.
              </li>
            </ol>
            <p className="mt-3">
              These techniques ensure the layout is stable before images load, achieving a CLS score near 0.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How does React.lazy work with Suspense for component lazy loading?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              <code>React.lazy()</code> is a function that wraps a dynamic <code>import()</code> call. It tells React 
              to split the imported component into a separate chunk and load it on-demand.
            </p>
            <p className="mb-3">
              <code>Suspense</code> is a component that displays a fallback UI while waiting for something to load 
              (like a lazy component). When React encounters a lazy component that hasn&apos;t loaded yet, it 
              &quot;suspends&quot; rendering of that component and displays the Suspense fallback.
            </p>
            <p className="mb-3">
              The pattern is:
            </p>
            <ul className="space-y-1">
              <li>• Wrap the component import with <code>React.lazy(() =&gt; import(&apos;./Component&apos;))</code></li>
              <li>• Wrap the lazy component in a <code>Suspense</code> boundary with a <code>fallback</code> prop</li>
              <li>• When the component renders, React triggers the dynamic import</li>
              <li>• The fallback displays while the chunk loads</li>
              <li>• Once loaded, React re-renders with the actual component</li>
            </ul>
            <p className="mt-3">
              Note: React.lazy doesn&apos;t work with SSR out of the box. For SSR, use Next.js&apos;s dynamic() 
              function or @loadable/component.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What is the Intersection Observer API and how does it enable lazy loading?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The Intersection Observer API is a browser API that asynchronously observes changes in the intersection 
              of a target element with the viewport (or a specified root element). It enables efficient lazy loading 
              by detecting when elements approach the viewport without using scroll event listeners.
            </p>
            <p className="mb-3">
              Key concepts:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Observer:</strong> Created with <code>new IntersectionObserver(callback, options)</code>. 
              The callback fires when observed elements cross the threshold.</li>
              <li>• <strong>Threshold:</strong> A number (0 to 1) indicating what percentage of the element must be 
              visible to trigger. 0.01 means &quot;trigger when 1% is visible.&quot;</li>
              <li>• <strong>rootMargin:</strong> Expands or shrinks the viewport boundary. <code>rootMargin: 
              &apos;200px&apos;</code> triggers loading 200 pixels before the element enters the viewport.</li>
              <li>• <strong>IntersectionObserverEntry:</strong> The callback receives an array of entries, each 
              containing <code>isIntersecting</code>, <code>intersectionRatio</code>, and the target element.</li>
            </ul>
            <p className="mt-3">
              For lazy loading, you observe all images, and when an entry&apos;s <code>isIntersecting</code> becomes 
              true, you set the image&apos;s <code>src</code> attribute and unobserve it.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References</h2>
        <ul className="space-y-3">
          <li>
            <a 
              href="https://web.dev/browser-level-image-lazy-loading/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Browser-Level Image Lazy Loading
            </a>
            <p className="text-sm text-muted mt-1">
              Google&apos;s guide to native lazy loading with the loading attribute.
            </p>
          </li>
          <li>
            <a 
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              MDN — Intersection Observer API
            </a>
            <p className="text-sm text-muted mt-1">
              Complete documentation for the Intersection Observer API with examples.
            </p>
          </li>
          <li>
            <a 
              href="https://react.dev/reference/react/lazy" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              React Documentation — React.lazy
            </a>
            <p className="text-sm text-muted mt-1">
              Official React documentation for lazy loading components with code splitting.
            </p>
          </li>
          <li>
            <a 
              href="https://web.dev/lazy-loading-images/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Lazy Loading Images
            </a>
            <p className="text-sm text-muted mt-1">
              Comprehensive guide covering native lazy loading, Intersection Observer, and best practices.
            </p>
          </li>
          <li>
            <a 
              href="https://addyosmani.com/blog/lazy-loading/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Addy Osmani — Lazy Loading Images and Video
            </a>
            <p className="text-sm text-muted mt-1">
              In-depth article on lazy loading strategies from a Google engineering perspective.
            </p>
          </li>
          <li>
            <a 
              href="https://www.smashingmagazine.com/2019/04/lazy-loading-component-react-typescript/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Smashing Magazine — Lazy Loading Components in React
            </a>
            <p className="text-sm text-muted mt-1">
              Practical guide to implementing lazy loading patterns in React applications.
            </p>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
