"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-intersection-observer-api",
  title: "Intersection Observer API",
  description:
    "Comprehensive guide to Intersection Observer API covering lazy loading, infinite scroll, scroll-based animations, analytics tracking, and production-scale implementation patterns.",
  category: "frontend",
  subcategory: "browser-apis",
  slug: "intersection-observer-api",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-02",
  tags: [
    "frontend",
    "browser API",
    "intersection observer",
    "lazy loading",
    "performance",
    "scroll",
  ],
  relatedTopics: [
    "resize-observer-api",
    "mutation-observer-api",
    "mobile-performance-optimization",
  ],
};

export default function IntersectionObserverAPIArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Intersection Observer API</strong> provides a programmatic way to asynchronously observe changes in the intersection of a target element with an ancestor element or viewport. This API represents a fundamental shift from the traditional approach of listening to scroll events and manually calculating element positions using getBoundingClientRect, which was not only verbose but also performance-problematic due to the frequency of scroll events and the layout thrashing caused by repeated DOM queries.
        </p>
        <p>
          The Intersection Observer API was introduced to address a common need in web development: detecting when elements become visible or invisible within the viewport. Before this API, developers relied on scroll event listeners combined with manual position calculations. This approach had several critical flaws: scroll events fire at the refresh rate of the display (typically 60 times per second), each getBoundingClientRect call forces a synchronous layout recalculation, and the combination could easily cause jank and poor scroll performance, especially on mobile devices with limited CPU resources.
        </p>
        <p>
          Intersection Observer solves these problems by running asynchronously in a separate thread, batching observations, and only invoking callbacks when intersection changes actually occur. The browser can optimize the observation process, deferring calculations until they are actually needed and avoiding unnecessary layout recalculations. This results in significantly better scroll performance and reduced main thread blocking, which is critical for maintaining 60fps scroll performance on all devices.
        </p>
        <p>
          For staff-level engineers, Intersection Observer is essential for implementing modern web performance patterns: lazy loading images (loading images only when they are about to enter the viewport), infinite scroll (loading more content when the user scrolls near the bottom), scroll-based animations (triggering animations when elements become visible), and analytics tracking (tracking when content actually becomes visible to users, not just when it is loaded). Understanding the API's capabilities, limitations, and performance characteristics is essential for building performant, modern web applications.
        </p>
        <p>
          The business case for Intersection Observer is compelling: lazy loading images can reduce initial page load time by 50% or more for image-heavy pages, directly improving Core Web Vitals metrics like Largest Contentful Paint (LCP). Infinite scroll enables seamless content discovery without pagination friction, improving user engagement. Scroll-based animations create engaging experiences without performance degradation. Analytics tracking visibility provides accurate engagement metrics (not just page views, but actual content consumption), enabling better content strategy decisions.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Observer:</strong> The IntersectionObserver instance that watches target elements for intersection changes. Created with a callback function and options object (root, rootMargin, threshold). A single observer can efficiently watch multiple target elements, with the browser batching observations and invoking the callback only when intersection changes occur. The callback receives an array of IntersectionObserverEntry objects, each describing the intersection state of one target element.
          </li>
          <li>
            <strong>Target:</strong> The DOM element(s) being observed for intersection changes. Call observer.observe(element) to start watching an element, and observer.unobserve(element) to stop watching a specific element. Call observer.disconnect() to stop watching all elements and clean up the observer. Multiple targets can be observed with a single observer, which is more efficient than creating multiple observers.
          </li>
          <li>
            <strong>Intersection Ratio:</strong> A number between 0.0 and 1.0 indicating what percentage of the target element is visible within the root or viewport. 0.0 means the target is completely invisible, 1.0 means the target is completely visible, and 0.5 means 50% of the target is visible. This ratio is used to trigger callbacks at specific visibility thresholds.
          </li>
          <li>
            <strong>Threshold:</strong> An array of intersection ratios at which the callback should be invoked. For example, threshold: [0] triggers when any part of the element becomes visible, threshold: [1] triggers when the element becomes fully visible, and threshold: [0, 0.5, 1] triggers at multiple visibility levels (0%, 50%, and 100% visible). Choose thresholds based on your specific use case.
          </li>
          <li>
            <strong>Root:</strong> The ancestor element that is used as the viewport for checking intersection. By default, the browser viewport is used. You can specify a different scrolling ancestor as the root, which is useful for checking intersection within a specific scrolling container rather than the entire viewport.
          </li>
          <li>
            <strong>Root Margin:</strong> A margin around the root element that expands or contracts the root bounding box for intersection calculations. Syntax is like CSS margin (e.g., "100px" for all sides, "100px 0" for vertical only, "50px 100px 50px 100px" for top, right, bottom, left). Positive margins expand the root, negative margins contract it. This is useful for triggering callbacks before an element actually enters the viewport (e.g., rootMargin: "100px" triggers 100 pixels before the element enters the viewport, giving time to preload content).
          </li>
          <li>
            <strong>Entry Object:</strong> The IntersectionObserverEntry object passed to the callback contains properties describing the intersection state: target (the observed element), isIntersecting (boolean indicating if the element is currently intersecting the root), intersectionRatio (the visibility ratio), boundingClientRect (the element's bounding box), intersectionRect (the intersection rectangle), and rootBounds (the root's bounding box). Use these properties to determine the appropriate action based on the intersection state.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/intersection-observer-flow.svg"
          alt="Intersection Observer Flow showing observer watching targets and triggering callback when elements enter viewport"
          caption="Intersection Observer flow — observer watches target elements, callback fires when intersection changes, entry object provides visibility information"
          width={900}
          height={550}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Intersection Observer architecture consists of observer creation (with callback and options), target registration (observe elements), and callback handling (respond to intersection changes). The architecture must handle batching (multiple observations delivered together in a single callback invocation), threshold-based triggering (callback invoked only when crossing specified thresholds), and cleanup (disconnect when done to prevent memory leaks).
        </p>
        <p>
          The observer runs asynchronously in a separate thread from the main JavaScript thread, which means it does not block the main thread and does not cause jank or scroll performance issues. The browser batches observations and invokes the callback only when intersection changes actually occur, rather than on every scroll event. This is fundamentally more efficient than the traditional scroll event listener approach.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/lazy-loading-patterns.svg"
          alt="Lazy Loading Patterns showing image lazy loading, content prefetching, and component lazy loading with Intersection Observer"
          caption="Lazy loading patterns — images load when near viewport, content prefetches before visible, components render when needed; all use Intersection Observer"
          width={900}
          height={500}
        />

        <h3>Common Use Cases</h3>
        <p>
          <strong>Image Lazy Loading:</strong> Observe all images on the page with a rootMargin (e.g., "200px" to start loading 200 pixels before the image enters the viewport). When an image intersects the expanded viewport, load the actual image source by copying the data-src attribute to the src attribute. After the image is loaded, unobserve the image to stop observing it and free up resources. This pattern can reduce initial page load time by 50% or more for image-heavy pages, directly improving Core Web Vitals metrics like Largest Contentful Paint (LCP) and reducing bandwidth usage for users who do not scroll to the bottom of the page.
        </p>
        <p>
          <strong>Infinite Scroll:</strong> Place a sentinel element (an empty div or similar) at the bottom of the content feed. Observe the sentinel element with Intersection Observer. When the sentinel intersects the viewport (meaning the user has scrolled near the bottom), trigger the loading of more content. Maintain a loading state to prevent multiple simultaneous loads (ignore observer callbacks while loading is in progress). After new content is loaded and appended, the sentinel moves to the new bottom, and the process repeats. Handle the empty state (no more content to load) by disconnecting the observer when there is no more content to load.
        </p>
        <p>
          <strong>Scroll Animations:</strong> Observe elements that should animate when they become visible. Set an appropriate threshold (e.g., 0.2 to trigger when 20% of the element is visible). When the element intersects, add a CSS class that triggers the animation (e.g., fade-in, slide-up, scale-up). Combine with CSS transitions for smooth animations. This pattern creates engaging, modern user experiences without the performance cost of scroll event listeners.
        </p>
        <p>
          <strong>Analytics Tracking:</strong> Observe content sections (articles, ads, videos) to track when they become visible to users. When a section intersects the viewport, send an analytics event (impression tracking). This provides more accurate engagement metrics than traditional page view analytics, because it tracks actual content consumption (what users actually saw) rather than just page loads. You can also track how long content stays visible by recording the timestamp when the element becomes visible and when it becomes invisible, then calculating the duration.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/infinite-scroll-architecture.svg"
          alt="Infinite Scroll Architecture showing sentinel element, loading state, and content appending flow"
          caption="Infinite scroll — sentinel at bottom triggers load more when visible, loading state prevents duplicate requests, new content appended seamlessly"
          width={900}
          height={500}
        />
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Intersection Observer involves trade-offs between convenience, control, browser support, and performance. Understanding these trade-offs is essential for making informed decisions about when to use Intersection Observer and when to use alternative approaches.
        </p>

        <h3>Intersection Observer vs. Scroll Events</h3>
        <p>
          <strong>Scroll Events:</strong> The traditional approach of listening to scroll events and manually calculating element positions using getBoundingClientRect. Advantages: full control over when and how calculations are performed, works in all browsers including very old browsers. Limitations: scroll events fire at the refresh rate of the display (typically 60 times per second), each getBoundingClientRect call forces a synchronous layout recalculation, the combination can easily cause jank and poor scroll performance especially on mobile devices with limited CPU resources, requires manual throttling or debouncing to reduce the frequency of calculations. Best for: legacy browser support where Intersection Observer is not available.
        </p>
        <p>
          <strong>Intersection Observer:</strong> The modern approach of asynchronously observing intersection changes. Advantages: efficient (browser optimizes observations and batches callbacks), does not block the main thread, simple API (no manual position calculations needed), no throttling or debouncing required. Limitations: newer API (Internet Explorer not supported, requires polyfill for older browsers), less fine-grained control over when callbacks are invoked (callback is invoked only when intersection changes, not on every scroll). Best for: modern browsers, performance-critical applications where scroll performance is important.
        </p>
        <p>
          <strong>Hybrid Approach:</strong> Use Intersection Observer where available, fall back to scroll events for older browsers. Detect API support using feature detection ('IntersectionObserver' in window). If supported, use Intersection Observer. If not supported, fall back to scroll events with throttling. This provides the best of both worlds: modern performance in modern browsers, compatibility in older browsers. Best for: maximum compatibility while maintaining performance in modern browsers.
        </p>

        <h3>Threshold Strategies</h3>
        <p>
          <strong>Threshold 0 (default):</strong> Callback is invoked when any part of the target element becomes visible (intersection ratio crosses from 0 to greater than 0). Advantages: earliest trigger, good for preloading content before it is fully visible (e.g., lazy loading images with rootMargin). Limitations: may trigger for elements that are barely visible (only a few pixels visible), which may not be desirable for all use cases. Best for: lazy loading images, infinite scroll (trigger when sentinel is barely visible).
        </p>
        <p>
          <strong>Threshold 1:</strong> Callback is invoked when the target element becomes fully visible (intersection ratio crosses to 1.0). Advantages: element is completely in view when callback is invoked, good for analytics tracking (track only when content is fully visible). Limitations: late trigger (element must be fully visible), may miss user attention (user may have already scrolled past the element before the callback is invoked). Best for: analytics tracking (track only when content is fully visible), scroll animations that should trigger only when the element is fully visible.
        </p>
        <p>
          <strong>Multiple Thresholds (e.g., [0, 0.25, 0.5, 0.75, 1]):</strong> Callback is invoked at multiple visibility levels (0%, 25%, 50%, 75%, 100% visible). Advantages: track visibility progression (e.g., track how far users scroll through an article), trigger different actions at different visibility levels. Limitations: more callback invocations (callback is invoked 5 times for the above example), more complex logic to handle multiple invocations. Best for: scroll progress indicators, detailed analytics tracking (track how far users scroll through content).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/browser-apis/intersection-observer-use-cases.svg"
          alt="Intersection Observer Use Cases showing lazy loading, infinite scroll, scroll animations, and analytics tracking"
          caption="Intersection Observer use cases — lazy loading images, infinite scroll, scroll-based animations, analytics impression tracking"
          width={900}
          height={500}
        />
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Unobserve After Trigger:</strong> Once a lazy-loaded element is loaded, call unobserve to stop observing the element. This prevents unnecessary callbacks (the callback will not be invoked again for that element) and frees up resources. For images: load the source (copy data-src to src), wait for the image to load (listen for the load event), then call unobserve. For animations: trigger the animation (add a CSS class), then call unobserve. This pattern ensures that each element is observed only until it is no longer needed, reducing the overhead of the observer.
          </li>
          <li>
            <strong>Use rootMargin for Preloading:</strong> Set rootMargin to expand the root bounding box (e.g., rootMargin: "200px" triggers 200 pixels before the element enters the viewport). This gives time to load content before the user scrolls to it, providing a smoother user experience. For lazy loading images, use rootMargin: "200px" to start loading images 200 pixels before they enter the viewport. This ensures that images are loaded before the user scrolls to them, avoiding the flash of unloaded images. For infinite scroll, use rootMargin: "100px" to start loading more content 100 pixels before the user reaches the bottom, providing a seamless infinite scroll experience.
          </li>
          <li>
            <strong>Handle Loading State:</strong> For infinite scroll, maintain a loading state to prevent multiple simultaneous loads. When the sentinel intersects, check the loading state. If loading is in progress, ignore the callback (do not trigger another load). If loading is not in progress, set loading to true, trigger the load, and reset loading to false when the load is complete. Show a loading indicator (spinner, skeleton, etc.) while loading is in progress. This pattern prevents duplicate requests and provides visual feedback to users.
          </li>
          <li>
            <strong>Cleanup on Unmount:</strong> Call observer.disconnect() when the component unmounts or when observation is no longer needed. This prevents memory leaks (the observer holds references to observed elements, preventing garbage collection) and stale callbacks (the callback will not be invoked for elements that are no longer in the DOM). In React, call disconnect in the useEffect cleanup function. In other frameworks, call disconnect in the appropriate lifecycle hook (e.g., componentWillUnmount in class components).
          </li>
          <li>
            <strong>Use Placeholder Content:</strong> For lazy loading, show placeholder content (gray box, blur-up image, skeleton loader) while the actual content is loading. This improves perceived performance (users see something immediately rather than a blank space) and prevents layout shift (the placeholder reserves space for the actual content, preventing the page from jumping when the actual content loads). For images, use a low-quality placeholder image (blur-up technique) or a solid color placeholder that matches the average color of the actual image.
          </li>
          <li>
            <strong>Combine with Native Lazy Loading:</strong> Modern browsers support native lazy loading for images (img loading="lazy"). Use native lazy loading as the baseline (it is simpler and requires no JavaScript), and use Intersection Observer for advanced patterns (e.g., lazy loading components, lazy loading videos, lazy loading iframes, analytics tracking). This provides the best of both worlds: simple native lazy loading for images, advanced Intersection Observer patterns for other use cases.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Not Unobserving:</strong> Observing elements forever causes memory leaks (the observer holds references to observed elements, preventing garbage collection) and unnecessary callbacks (the callback will be invoked every time the element intersects the viewport, even after it is no longer needed). Always call unobserve after the element is loaded or when observation is no longer needed. Always call disconnect when the component unmounts or when observation is no longer needed.
          </li>
          <li>
            <strong>Ignoring Loading State:</strong> For infinite scroll, not maintaining a loading state causes multiple simultaneous loads (the callback is invoked multiple times while loading is in progress, triggering multiple loads). This wastes bandwidth, overloads the server, and can cause race conditions (the order of responses may not match the order of requests). Always maintain a loading state and ignore callbacks while loading is in progress.
          </li>
          <li>
            <strong>No Placeholder:</strong> Lazy loading without placeholder content causes layout shift (the page jumps when the actual content loads) and poor perceived performance (users see a blank space while the content is loading). Always use placeholder content (gray box, blur-up image, skeleton loader) to reserve space and provide visual feedback.
          </li>
          <li>
            <strong>Wrong Threshold:</strong> Using threshold: 1 for lazy loading triggers too late (the element must be fully visible before the callback is invoked, which means the user will see the unloaded element). Use threshold: 0 with rootMargin for preloading (callback is invoked when any part of the element is visible, and rootMargin expands the viewport to trigger earlier). Choose thresholds based on your specific use case.
          </li>
          <li>
            <strong>Observing Too Many Elements:</strong> Creating one observer per element is inefficient (each observer has overhead, and the browser must manage multiple observers). Use a single observer for multiple targets (call observe on the same observer for multiple elements). Intersection Observer scales well with many targets (a single observer can efficiently observe hundreds or thousands of elements).
          </li>
          <li>
            <strong>No Fallback:</strong> Intersection Observer is not supported in Internet Explorer. If you need to support Internet Explorer, provide a fallback (load all content upfront, or use scroll event-based lazy loading with throttling). Use feature detection ('IntersectionObserver' in window) to detect support and conditionally use Intersection Observer or the fallback.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Image Lazy Loading</h3>
        <p>
          E-commerce sites (Amazon, Shopify stores) lazy load product images on category pages and search results pages. Intersection Observer triggers image load when the product card nears the viewport (using rootMargin to start loading before the image is visible). Placeholder images (gray boxes or blur-up images) are shown while the actual images are loading. Result: 50% or more reduction in initial page load time, faster time to interactive, improved Core Web Vitals metrics (LCP), reduced bandwidth usage for users who do not scroll to the bottom of the page. This directly improves user experience and search engine rankings (Core Web Vitals are a ranking factor).
        </p>

        <h3>Social Media Infinite Scroll</h3>
        <p>
          Social media platforms (Twitter, Instagram, Facebook, TikTok) use infinite scroll for content feeds. A sentinel element is placed at the bottom of the feed. Intersection Observer triggers when the sentinel intersects the viewport (meaning the user has scrolled near the bottom). New content is loaded and appended seamlessly, providing an endless content discovery experience without pagination friction. Loading state prevents multiple simultaneous loads. This pattern improves user engagement (users discover more content) and reduces friction (no need to click "next page" buttons).
        </p>

        <h3>Content Site Scroll Animations</h3>
        <p>
          Content sites (marketing sites, blogs, portfolios) use scroll animations for engagement. Elements (text, images, cards) fade in, slide up, or scale up when they enter the viewport. Intersection Observer triggers CSS class changes when elements become visible. CSS transitions provide smooth animations. This pattern creates engaging, modern user experiences without the performance cost of scroll event listeners. The animations are triggered only when elements are actually visible, avoiding unnecessary animations for elements that are off-screen.
        </p>

        <h3>Analytics Impression Tracking</h3>
        <p>
          Analytics platforms and content sites use Intersection Observer to track content impressions. When an ad, article, or video section becomes visible (intersects the viewport), an analytics event is sent (impression tracking). This provides more accurate engagement metrics than traditional page view analytics, because it tracks actual content consumption (what users actually saw) rather than just page loads. You can also track how long content stays visible by recording the timestamp when the element becomes visible and when it becomes invisible, then calculating the duration. This provides insights into content engagement (which content users actually read vs. which content they scroll past).
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How does Intersection Observer work and why is it more efficient than scroll events?
            </p>
            <p className="mt-2 text-sm">
              A: Intersection Observer asynchronously observes target elements and notifies when intersection with the viewport changes. It is more efficient than scroll events for several reasons: the observer runs in a separate thread from the main JavaScript thread, so it does not block the main thread. The browser batches observations and invokes the callback only when intersection changes actually occur, rather than on every scroll event. There is no need for manual position calculations (getBoundingClientRect), which force synchronous layout recalculations. There is no need for throttling or debouncing, because the browser handles the optimization internally. Scroll events fire at the refresh rate of the display (typically 60 times per second), each getBoundingClientRect call forces a synchronous layout recalculation, and the combination can easily cause jank and poor scroll performance. Intersection Observer avoids all of these problems.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement image lazy loading with Intersection Observer?
            </p>
            <p className="mt-2 text-sm">
              A: Create an Intersection Observer with a callback that checks if the entry is intersecting. For each image, set the actual image URL in a data-src attribute (not the src attribute, to prevent the browser from loading the image immediately). Call observe on the image element. In the callback, when entry.isIntersecting is true, copy the data-src attribute to the src attribute (this triggers the browser to load the image). Wait for the image to load (listen for the load event), then call unobserve on the image element to stop observing it. Use rootMargin (e.g., "200px") to start loading images 200 pixels before they enter the viewport, providing a smoother user experience. Use placeholder images (gray boxes or blur-up images) to prevent layout shift and improve perceived performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement infinite scroll with Intersection Observer?
            </p>
            <p className="mt-2 text-sm">
              A: Place a sentinel element (an empty div or similar) at the bottom of the content feed. Create an Intersection Observer with a callback that checks if the sentinel is intersecting. Call observe on the sentinel element. Maintain a loading state (boolean flag) to prevent multiple simultaneous loads. In the callback, when the sentinel is intersecting, check the loading state. If loading is in progress, ignore the callback (do not trigger another load). If loading is not in progress, set loading to true, show a loading indicator, trigger the load (fetch more content from the API), append the new content to the feed, reset loading to false, and hide the loading indicator. The sentinel moves to the new bottom after content is appended, and the process repeats. Handle the empty state (no more content to load) by calling disconnect on the observer when there is no more content to load.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is rootMargin and when should you use it?
            </p>
            <p className="mt-2 text-sm">
              A: RootMargin expands or contracts the root bounding box for intersection calculations. Syntax is like CSS margin: "100px" for all sides, "100px 0" for vertical only, "50px 100px 50px 100px" for top, right, bottom, left. Positive margins expand the root, negative margins contract it. Use rootMargin for preloading content before it is visible. For lazy loading images, use rootMargin: "200px" to start loading images 200 pixels before they enter the viewport. This gives time to load the image before the user scrolls to it, avoiding the flash of unloaded images. For infinite scroll, use rootMargin: "100px" to start loading more content 100 pixels before the user reaches the bottom, providing a seamless infinite scroll experience. RootMargin is essential for providing a smooth user experience with lazy loading and infinite scroll.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle browser support for Intersection Observer?
            </p>
            <p className="mt-2 text-sm">
              A: Intersection Observer is supported in all modern browsers (Chrome 51+, Firefox 55+, Safari 12.1+, Edge 16+). It is not supported in Internet Explorer. Use feature detection ('IntersectionObserver' in window) to detect support. If supported, use Intersection Observer. If not supported, provide a fallback: for lazy loading, load all images upfront (or use scroll event-based lazy loading with throttling). For infinite scroll, use pagination (click "next page" buttons) instead of infinite scroll. Use a polyfill (intersection-observer polyfill) if you need Intersection Observer functionality in Internet Explorer, but be aware that the polyfill uses scroll events internally, so it does not provide the same performance benefits as native Intersection Observer. For most projects, use Intersection Observer with a fallback for Internet Explorer.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you optimize Intersection Observer for many elements?
            </p>
            <p className="mt-2 text-sm">
              A: Use a single observer for multiple targets (call observe on the same observer for multiple elements). Creating one observer per element is inefficient (each observer has overhead, and the browser must manage multiple observers). Intersection Observer scales well with many targets (a single observer can efficiently observe hundreds or thousands of elements). Use appropriate thresholds (do not use too many threshold values, because each threshold adds callback invocations). Unobserve after trigger (stop observing elements once they are loaded or when observation is no longer needed). Disconnect when done (cleanup on component unmount). These best practices ensure that Intersection Observer remains efficient even when observing many elements.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN — Intersection Observer API
            </a>
          </li>
          <li>
            <a
              href="https://web.dev/intersection-observer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Web.dev — Intersection Observer Guide
            </a>
          </li>
          <li>
            <a
              href="https://css-tricks.com/intersection-observer-thresholds/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              CSS-Tricks — Intersection Observer Thresholds
            </a>
          </li>
          <li>
            <a
              href="https://www.w3.org/TR/intersection-observer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              W3C — Intersection Observer Specification
            </a>
          </li>
          <li>
            <a
              href="https://caniuse.com/intersectionobserver"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Can I Use — Intersection Observer Browser Support
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );

}
