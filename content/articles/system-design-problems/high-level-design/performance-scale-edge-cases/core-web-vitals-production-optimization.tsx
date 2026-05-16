"use client";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-core-web-vitals-production-optimization",
  title: "Core Web Vitals: LCP, INP, CLS — Production Optimization",
  slug: "core-web-vitals-production-optimization",
  category: "high-level-design",
  subcategory: "performance-scale-edge-cases",
  wordCount: 5400,
  readingTime: 32,
  lastUpdated: "2026-05-16",
  difficulty: "advanced",
  tags: [
    "core web vitals",
    "LCP",
    "INP",
    "CLS",
    "performance",
    "RUM",
    "Lighthouse CI",
  ],
  author: {
    name: "System Design Prep",
    role: "Staff Engineer",
  },
  description:
    "Production-grade approach to measuring, diagnosing, and fixing Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift — including RUM instrumentation, lab/field data correlation, and CI enforcement.",
};

export default function CoreWebVitalsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <p>
        Core Web Vitals (CWV) are Google's user-experience metrics that directly
        influence search ranking and, more importantly, reflect how users
        actually experience your product. Passing all three thresholds — LCP
        under 2.5 s, INP under 200 ms, CLS under 0.1 — at the 75th percentile
        of real-user sessions is the bar for a "Good" rating in Search Console.
        Most production applications are not there, and closing that gap requires
        a structured approach: measure in the field first, reproduce in the lab,
        attribute to root causes, fix with the correct technique, and prevent
        regression with CI enforcement.
      </p>

      <h2>Why Core Web Vitals Are Harder Than They Look</h2>
      <p>
        Lab tools like Lighthouse measure a single synthetic page load on a
        throttled connection with a clean cache. Field data from the Chrome User
        Experience Report (CrUX) or your own Real User Monitoring (RUM) captures
        the full distribution: users on 2G, users with slow Android devices, users
        navigating from a cached page, users with browser extensions that inject
        DOM. The 75th-percentile field score is nearly always worse than the
        Lighthouse score.
      </p>
      <p>
        This gap has a few causes. Lighthouse only measures the initial page load.
        INP captures every interaction across the entire session — a slow click
        handler 30 seconds after load is invisible to Lighthouse. CLS from lazy-
        loaded ads that inject after scroll is invisible to Lighthouse if those
        ads don't fire during the synthetic test. Real users also have pre-existing
        tab overhead (heavy CPU competition from other tabs), which inflates
        interaction latency dramatically on low-end devices.
      </p>
      <p>
        The correct workflow is: deploy RUM instrumentation that sends all three
        metrics on every page load, build dashboards segmented by page type and
        device class, identify the worst-performing cohorts, reproduce them in
        the lab with appropriate throttling, fix, then add a Lighthouse CI budget
        to prevent regression.
      </p>

      <HighlightBlock type="important">
        Always look at field data (75th percentile, segmented by page type) before
        running Lighthouse. Lighthouse is a reproduction tool, not a measurement
        tool. Optimizing for Lighthouse scores while ignoring RUM data leads to
        winning the lab while losing real users.
      </HighlightBlock>

      <h2>RUM Instrumentation with the web-vitals Library</h2>
      <p>
        The <code>web-vitals</code> npm package (maintained by Google) exposes
        individual metric callbacks that fire at the right time in the page
        lifecycle. LCP fires when the element is finalised (after user
        interaction or page hide). INP fires on <code>visibilitychange</code>{" "}
        or page hide, reporting the worst interaction in the session. CLS fires
        continuously and reports the current running score.
      </p>
      <p>
        A production RUM pipeline collects these callbacks, enriches each report
        with page type (extracted from URL pattern), session ID, device class
        (navigator.deviceMemory bucket), connection type (NetworkInformation API),
        and the element attribution data included in newer versions of the library
        (LCP element selector, INP event target, CLS shifted element). The
        enriched payload is sent via <code>navigator.sendBeacon</code> to avoid
        blocking page unload. Batch-sending on a 5-second interval with a max
        queue size of 50 events reduces beacon overhead on high-traffic pages.
      </p>
      <p>
        On the backend, store raw events in a time-series store (ClickHouse or
        BigQuery) and build aggregation queries for percentile computation.
        Percentiles must be computed correctly — averaging CWV scores is wrong
        because the distribution is heavily right-skewed. Use approximate
        quantile algorithms (t-digest or HLL) at query time, or maintain
        pre-aggregated P50/P75/P90/P99 buckets per page type per hour.
      </p>
      <p>
        Dashboard design matters. Segment by: page template (homepage, PDP,
        checkout), device class (mobile/tablet/desktop), connection effective type
        (4g/3g/slow-2g), and geographic region. A P75 LCP of 3.8 s might be
        entirely explained by mobile-3g users in Southeast Asia, while desktop
        users on broadband are at 1.2 s. Knowing this tells you exactly where
        to invest — you may need a regional edge node, not a rendering architecture
        change.
      </p>

      <h2>Largest Contentful Paint (LCP)</h2>
      <p>
        LCP marks when the largest image or text block in the viewport becomes
        visible. The most common LCP elements are hero images, carousel slides,
        and above-the-fold headings on text-heavy pages. The browser's LCP
        candidate is determined purely by rendered area, so a hidden element
        (display:none until animation completes) won't be the candidate, but an
        element that is rendered off-screen then scrolled into view within the
        first few seconds might be.
      </p>
      <p>
        The LCP timeline breaks into four sub-phases: Time to First Byte (TTFB),
        resource load delay (how long after TTFB until the LCP resource request
        starts), resource load duration (how long the LCP image takes to download),
        and element render delay (how long after download until the element is
        painted). Each phase requires a different fix.
      </p>
      <p>
        TTFB fixes: move origin servers closer to users with edge compute (Vercel,
        CloudFront, Fastly), cache rendered HTML at the CDN edge using
        stale-while-revalidate, reduce server processing time by pre-rendering at
        build time (SSG) or using ISR for semi-dynamic content. A P75 TTFB above
        600 ms is the single biggest LCP killer on server-rendered applications.
      </p>
      <p>
        Resource load delay fixes: the LCP image should be discovered as early as
        possible. Avoid placing hero images inside CSS backgrounds (the browser
        can't discover them until CSSOM is built) — use HTML <code>img</code>{" "}
        elements instead. Add a <code>&lt;link rel="preload" as="image"&gt;</code>{" "}
        hint in the document head for the LCP image, especially if it's determined
        server-side (e.g., a product image on a PDP). For responsive images
        managed by a framework's Image component, ensure the preload hint uses the
        correct <code>imagesrcset</code> and <code>imagesizes</code> attributes so
        the browser fetches the right variant.
      </p>
      <p>
        Resource load duration fixes: serve images from a CDN with a PoP close
        to the user, use modern formats (WebP or AVIF with JPEG fallback via
        <code>picture</code>), right-size images to the display size (a 1800px
        image for a 400px thumbnail wastes bandwidth), and enable HTTP/2 or HTTP/3
        on the asset origin. LCP images should never be lazy-loaded — <code>loading="lazy"</code>{" "}
        defers the fetch until the element is near the viewport, which defeats
        the purpose for the element that is already in the initial viewport.
      </p>
      <p>
        Element render delay fixes: eliminate render-blocking resources (inline
        critical CSS, defer non-critical CSS, use <code>async</code>/<code>defer</code>{" "}
        on scripts), reduce main thread blocking before first paint (avoid large
        synchronous scripts in the head), and ensure the LCP element isn't hidden
        by a CSS animation that delays opacity or transform application.
      </p>

      <HighlightBlock type="tip">
        Use the LCP attribution object from web-vitals v3+ to get the LCP element's
        URL, size, and load time directly in your RUM data. This tells you which
        specific image or text block is the LCP candidate per page template, so
        you can apply targeted preload hints instead of guessing.
      </HighlightBlock>

      <h2>Interaction to Next Paint (INP)</h2>
      <p>
        INP replaced First Input Delay (FID) in March 2024. While FID only
        measured the first interaction's input delay, INP captures every
        interaction (click, keydown, pointerdown) across the entire session and
        reports the worst one. An interaction has three phases: input delay (time
        from user action until the event handlers start running), processing time
        (time for all event handlers to complete), and presentation delay (time
        from handlers completing until the next frame is painted).
      </p>
      <p>
        The INP threshold is 200 ms end-to-end. On a low-end Android device where
        JavaScript execution is 4–5x slower than a MacBook, a React re-render
        that takes 30 ms in the lab takes 120–150 ms in the field. Add 50 ms of
        input delay from a long task on the main thread, and you've already
        exceeded the threshold before any painting.
      </p>
      <p>
        Diagnosing INP requires the attribution object from web-vitals, which
        includes the interaction type, the element target (CSS selector), and the
        three sub-phase durations. The most common root causes by sub-phase are:
        long tasks on the main thread (input delay), expensive React reconciliation
        or complex DOM mutations (processing time), and large layout + paint work
        triggered by DOM changes (presentation delay).
      </p>
      <p>
        Fixing input delay centers on eliminating long tasks. Long tasks are any
        JavaScript task over 50 ms. Audit using Chrome DevTools Performance panel
        with CPU 4x throttle. Common culprits: third-party scripts (analytics,
        chat widgets, A/B testing SDKs) that run synchronously during page load,
        large bundle chunks that parse and evaluate on first interaction, and
        timers or polling callbacks that run expensive work on a fixed interval
        regardless of visibility.
      </p>
      <p>
        Fixing processing time requires breaking expensive work out of synchronous
        event handlers. Techniques: use <code>startTransition</code> for
        non-urgent React state updates (this marks the update as interruptible and
        keeps the current frame responsive), use <code>scheduler.postTask</code>{" "}
        with user-blocking priority for the immediate visual response and
        background priority for the expensive side effect, and use Web Workers for
        CPU-intensive computations (data parsing, large filtering operations) that
        don't need DOM access.
      </p>
      <p>
        The <code>isInputPending</code> API (available in Chromium-based browsers)
        lets you check whether a user interaction is waiting in the event queue
        while your code is running a long computation loop. Use it to yield the
        main thread mid-computation: break a 500ms loop into 10ms chunks, checking
        <code>navigator.scheduling.isInputPending()</code> between chunks and
        calling <code>await scheduler.yield()</code> if the user has pending input.
        This converts a "janky" blocked interaction into a responsive one.
      </p>
      <p>
        Fixing presentation delay requires reducing the amount of layout and paint
        work triggered by DOM changes. Stick to CSS properties that trigger only
        compositing (transform, opacity) rather than properties that trigger layout
        (width, height, top, left, margin). Avoid reading layout properties
        (getBoundingClientRect, offsetHeight) immediately after writing to the DOM
        — this forces a synchronous layout flush. Batch DOM reads before DOM writes,
        or use a library like FastDOM for read/write scheduling.
      </p>

      <HighlightBlock type="important">
        INP is disproportionately affected by third-party scripts. A single
        slow third-party tag can inject 200–500ms long tasks during page load,
        causing input delay on the first user interaction. Use a Tag Manager
        audit combined with the Long Tasks API to identify third-party culprits
        and load them with <code>type="module"</code>, <code>defer</code>, or
        async facades that only initialize the real SDK on first user intent.
      </HighlightBlock>

      <h2>Cumulative Layout Shift (CLS)</h2>
      <p>
        CLS measures unexpected layout shifts — elements moving without user
        initiation. The score is the sum of (impact fraction × distance fraction)
        for each shift, windowed and capped so that rapid successive shifts in a
        500ms window are grouped. The threshold is 0.1 for a Good rating; above
        0.25 is Poor. A layout shift of a large element by a large distance
        (e.g., a hero image of 80% viewport height moving down 20% of the
        viewport) produces a score close to 0.16 by itself.
      </p>
      <p>
        The two most common CLS sources are images without explicit dimensions
        and late-injected content (ads, cookie banners, hydration artifacts).
        For images, always specify <code>width</code> and <code>height</code>{" "}
        HTML attributes that match the image's intrinsic aspect ratio. Browsers
        use these to reserve space before the image loads, preventing a shift.
        For responsive images that fill a container, use{" "}
        <code>aspect-ratio</code> CSS on the container alongside{" "}
        <code>width: 100%</code> on the image.
      </p>
      <p>
        Font-induced CLS (FOUT — Flash of Unstyled Text) happens when the web
        font loads and the fallback font is replaced. Use{" "}
        <code>font-display: optional</code> to avoid shifts by not swapping if
        the font isn't cached (you lose the custom font on first load but gain
        stability), or use <code>font-display: swap</code> combined with the
        CSS <code>size-adjust</code>, <code>ascent-override</code>, and{" "}
        <code>descent-override</code> descriptors to make the fallback font
        metrics match the web font metrics so that the swap is invisible.
        The <code>fontaine</code> npm package and Next.js font optimization
        both automate this fallback metric matching.
      </p>
      <p>
        For ads and dynamically injected banners, reserve space with min-height
        placeholders that match the expected ad slot dimensions. If the ad server
        cannot guarantee dimensions, use a fixed-size skeleton that gives way
        to the ad. For cookie consent banners, inject them as a fixed-position
        overlay rather than a document-flow element — this way they don't push
        content down when they appear.
      </p>
      <p>
        Hydration-induced CLS is a common problem in React and Next.js. If the
        server renders a different layout than the client's initial render (e.g.,
        because of conditional rendering based on window.innerWidth or a
        localStorage value), the browser will paint the server HTML and then shift
        it when React hydration corrects it. Fixes: use CSS media queries instead
        of JS-based responsive logic where possible, pass detected values through
        cookies or headers so SSR has access to them, and use{" "}
        <code>suppressHydrationWarning</code> only for genuinely acceptable
        mismatches (timestamps, ads), not for layout-shifting content.
      </p>
      <p>
        The <code>content-visibility: auto</code> CSS property defers rendering
        of off-screen sections until they're near the viewport. This improves
        rendering performance on long pages but can cause CLS if the browser
        initially allocates no space for those sections. Always pair it with
        <code>contain-intrinsic-size</code> to give the browser a size estimate
        for layout purposes.
      </p>

      <HighlightBlock type="tip">
        Use the LayoutShift PerformanceEntry's <code>sources</code> array
        (available in Chromium) to get the CSS selectors and bounding rects of
        the shifted elements. Log this through your RUM pipeline and you can
        identify exactly which element caused each CLS event in production,
        rather than trying to reproduce it in DevTools.
      </HighlightBlock>

      <h2>Field vs. Lab Data: Bridging the Gap</h2>
      <p>
        Field data (CrUX, your RUM) and lab data (Lighthouse, WebPageTest) measure
        different things. Field data reflects real users with warm DNS, browser
        caches, network variance, and device diversity. Lab data reflects one
        synthetic scenario. The strategies for each are different.
      </p>
      <p>
        For field data, focus on segmentation and percentiles. A good field data
        workflow: weekly review of P75 CWV per page template, alert on regression
        (P75 LCP rising more than 300ms week-over-week), drill into segments to
        find the cohort driving the regression, reproduce in the lab with the
        specific device class and network (e.g., Moto G4 + 3G throttle), fix,
        deploy, validate the field data trend.
      </p>
      <p>
        CrUX data lags by 28 days (it's a rolling average of the past 28 days)
        so you won't see the impact of a deploy immediately in CrUX. Your own
        RUM data can show impact within hours of a deploy if you have high enough
        traffic. Use CrUX for Search Console ranking signals and long-term
        baselines; use your own RUM for operational monitoring.
      </p>
      <p>
        WebPageTest provides more granular lab diagnostics than Lighthouse: it
        shows a waterfall, filmstrip, video comparison, and can run from real
        browsers in multiple global locations. Use it when you need to debug a
        specific LCP issue that Lighthouse's throttled Chromium instance doesn't
        fully reproduce. The WebPageTest API can be integrated into CI pipelines
        for more realistic synthetic testing.
      </p>

      <h2>Lighthouse CI in Pull Requests</h2>
      <p>
        Lighthouse CI (<code>@lhci/cli</code>) runs Lighthouse against a deployed
        preview URL in CI and asserts performance budgets. A typical configuration
        asserts P75 LCP under a threshold, total blocking time under a threshold
        (TBT is the lab proxy for INP), and CLS under 0.1. It also asserts bundle
        size via the <code>resourceSizes</code> audit and JavaScript parse time.
      </p>
      <p>
        Configuration example in <code>lighthouserc.js</code>: run 5 Lighthouse
        iterations and take the median to reduce variance, set CPU slowdown factor
        to 4 to simulate mid-range Android devices, configure mobile network
        throttling (30Mbps down, 3G RTT), and run against the three highest-
        traffic page templates (homepage, product detail, checkout). Assert
        individually per route so a regression on the checkout page fails the
        check even if homepage passes.
      </p>
      <p>
        Lighthouse CI server stores historical runs and provides trend charts,
        which makes it easy to see when a specific PR introduced a regression.
        Integrate it as a required PR check (not advisory) so that developers
        can't merge a PR that degrades LCP by more than 200ms or introduces a
        CLS regression above 0.05 on any measured route.
      </p>
      <p>
        Lighthouse CI is a necessary but not sufficient gate. It catches regressions
        in the lab, but it won't catch issues that only manifest in field conditions
        (third-party ad network CLS, mobile-specific long tasks, geographic TTFB
        variance). The CI gate prevents code-driven regressions; your RUM dashboard
        catches everything else.
      </p>

      <h2>JavaScript Bundle Impact on All Three Metrics</h2>
      <p>
        JavaScript is implicated in all three CWV. Large JS bundles delay LCP by
        occupying the main thread during parsing and evaluation, blocking the
        browser from rendering. Long-running JS tasks during page load increase
        INP input delay. Hydration-driven re-renders can cause CLS.
      </p>
      <p>
        Bundle analysis should be a regular practice, not a one-time event. Tools:
        <code>@next/bundle-analyzer</code> for Next.js (visualizes the webpack
        bundle as a treemap), <code>source-map-explorer</code> for any bundler,
        and <code>size-limit</code> for CI enforcement of bundle size budgets.
      </p>
      <p>
        Effective reduction strategies: code-split at route boundaries (Next.js
        does this by default but third-party libraries added to shared chunks can
        bloat every route), lazy-load heavy below-the-fold components with dynamic
        imports and Suspense, replace large libraries with lighter alternatives
        (Luxon → date-fns or native Intl, Lodash → native ES methods), and use
        tree-shakeable imports to avoid importing entire library namespaces.
      </p>
      <p>
        Module federation for micro-frontend architectures requires careful
        bundle overlap analysis. If each remote exposes React as a singleton
        shared dependency but the version resolution fails, teams end up with
        two React copies bundled — a 140kB regression. Automated dependency
        audits in CI (comparing shared module graphs between remotes) catch
        this before it reaches production.
      </p>

      <h2>Image Optimization Pipeline</h2>
      <p>
        Images are the dominant LCP element on most marketing and commerce pages.
        A robust image pipeline has several stages: format conversion at upload
        time (store original, generate WebP and AVIF variants), on-the-fly
        resizing via a CDN image transformation service (Cloudinary, imgix,
        Next.js Image Optimization), responsive serving with srcset and sizes,
        and cache headers that allow edge caching for months (assets are
        content-addressed so stale is never a correctness problem).
      </p>
      <p>
        Next.js Image component handles most of this automatically for static
        images: it generates srcset, adds width/height to prevent CLS, defers
        off-screen images with loading="lazy", and serves WebP/AVIF via the
        built-in image optimization API. For hero/LCP images, always pass
        <code>priority</code> prop to disable lazy loading and add a preload hint.
      </p>
      <p>
        For user-generated content (avatars, product photos uploaded by sellers),
        run them through a serverless image processing pipeline (Sharp in a
        Lambda) at upload time to cap dimensions, strip EXIF metadata, and
        generate format variants. Store in S3 or equivalent, serve via CloudFront
        with long TTLs. Don't let users cause LCP regressions by uploading
        8MB raw photos.
      </p>

      <h2>Third-Party Script Management</h2>
      <p>
        Third-party scripts (analytics, A/B testing, chat, support widgets, ads)
        are often the largest single contributor to INP input delay and CLS in
        production applications. They run on your page but are outside your build
        pipeline and bundle size budgets.
      </p>
      <p>
        The management strategy: audit all third-party tags quarterly using
        WebPageTest (it shows third-party domains in the waterfall with their
        byte sizes and blocking time), measure their Long Task contribution via
        the Long Tasks PerformanceObserver in your RUM, and set a performance
        budget per third-party (e.g., no single third-party script may cause
        more than 100ms of long tasks during load).
      </p>
      <p>
        Defer all non-critical third parties: load them via <code>defer</code>,
        inject them after the <code>load</code> event, or use facade patterns
        (show a static image of the chat widget; only load the real SDK when the
        user hovers or clicks). For A/B testing SDKs that must run before render
        to avoid flicker, use edge-side experimentation via middleware (Vercel
        Edge Config, CloudFront Functions) instead of client-side SDKs — this
        removes the client-side long task entirely.
      </p>
      <p>
        Partytown is an open-source library that moves third-party scripts to a
        Web Worker, isolating their long tasks from the main thread. It works by
        proxying DOM API calls from the worker back to the main thread via
        synchronous SharedArrayBuffer messaging. The trade-off is complexity and
        a requirement for COOP/COEP headers; it's most valuable for heavyweight
        analytics SDKs (Google Tag Manager with many tags, full Segment.io
        analytics).
      </p>

      <h2>CWV for Single-Page Applications</h2>
      <p>
        SPAs have a specific CWV problem: Core Web Vitals are only measured on
        the initial page load in CrUX. Client-side navigations (React Router,
        Next.js client-side transitions) don't reset the CWV measurement. This
        means your CrUX data reflects only the landing page experience, not the
        experience on subsequent navigations.
      </p>
      <p>
        For your own RUM, you can measure "soft navigation" performance by
        wrapping route change events and recording time-to-interactive for each
        navigation. Chrome is experimenting with Soft Navigation API that would
        extend CWV measurements to client-side navigations, but it's not
        standardized yet.
      </p>
      <p>
        INP does capture interactions across the entire session including after
        client-side navigations, so a slow interaction in a route that the user
        navigated to client-side will still contribute to the INP score reported
        at page hide. This makes INP the most practically important CWV for
        heavily interactive SPAs.
      </p>
      <p>
        Prefetching for client-side navigation improves perceived performance:
        use <code>rel="prefetch"</code> hints or the Speculation Rules API for
        next likely pages. Next.js automatically prefetches Link hrefs in the
        viewport. This means the JS chunk for the destination route is already
        parsed when the user clicks, reducing the processing time for the
        navigation interaction.
      </p>

      <HighlightBlock type="important">
        For Next.js App Router applications, the router cache (client-side cache
        of RSC payloads) means navigating back to a visited page is instant.
        But prefetching of dynamic routes is shallow by default — only the loading
        state is prefetched, not the full data. Configure <code>prefetch="true"</code>{" "}
        on high-priority Link elements to prefetch full RSC data, or use{" "}
        <code>router.prefetch()</code> on hover.
      </HighlightBlock>

      <h2>Operational Playbook for CWV Regression</h2>
      <p>
        When a CWV metric regresses in production (detected via RUM alerting),
        the investigation follows a repeatable playbook. Step one: check if the
        regression correlates with a recent deploy or third-party script version
        change. Correlate the timestamp of the metric regression with deploy
        timestamps in your deployment log.
      </p>
      <p>
        Step two: segment by page type, device class, and geography to narrow the
        scope. A CLS regression on mobile only, on the homepage, starting 2 hours
        after the last deploy, almost certainly has a code-level cause.
      </p>
      <p>
        Step three: reproduce in the lab with the identified segment's device
        and network profile. Run Chrome DevTools Performance panel with 4x CPU
        throttle and 3G network; check the Layout Shifts track in the timeline.
        Check for new DOM insertions that push content down or new images without
        dimensions.
      </p>
      <p>
        Step four: if you can reproduce it, fix and validate in the lab. If you
        can't reproduce it, it's likely an external cause (ad network injecting
        new creative sizes, third-party script update). Check your third-party
        audit and compare against the previous version using WebPageTest filmstrip
        comparison.
      </p>
      <p>
        Step five: deploy the fix and watch the RUM trend for 24–48 hours to
        confirm recovery. Because P75 is a rolling metric, recovery will be
        gradual rather than instant — you'll see the P75 trend downward over hours
        as the new session data replaces the regressed data.
      </p>

      <h2>Interview Questions and Answers</h2>

      <h3>Q: Your team's field INP is 280ms at P75. Where do you start investigating?</h3>
      <p>
        First, segment the RUM data: is the regression on all pages or specific
        templates? All device classes or mobile only? Then use the INP attribution
        object (interaction type, element target, sub-phase durations) to identify
        which interactions are slow and whether the time is in input delay,
        processing time, or presentation delay. Input delay points to long tasks
        — audit third-party scripts and large main-thread tasks around load. High
        processing time points to expensive event handlers — profile the React
        render triggered by that interaction and check for unnecessary re-renders
        or synchronous heavy computation. High presentation delay points to layout
        thrash — check for reads after writes and for CSS properties that trigger
        layout in the handler. Use Chrome DevTools with 4x CPU throttle and the
        Performance Insights panel to reproduce the worst interactions.
      </p>

      <h3>Q: How do you prevent CWV regressions from reaching production?</h3>
      <p>
        Three layers: Lighthouse CI runs on every PR against preview URLs, asserting
        LCP, TBT, and CLS budgets per route — PRs that regress any metric beyond
        the threshold are blocked. <code>size-limit</code> asserts JavaScript bundle
        size per route so large third-party additions are caught before they impact
        INP via main thread bloat. And RUM alerting fires within hours of a
        production deploy if P75 INP or LCP regresses above a threshold, enabling
        fast rollback. The CI layer catches code-driven regressions; RUM catches
        external causes (ad network changes, CDN issues, third-party script updates)
        that CI can't simulate.
      </p>

      <h3>Q: A product page has a CLS of 0.3 in field data. What are the most likely causes and how do you diagnose them?</h3>
      <p>
        On a product page, the most common CLS sources are: product images without
        explicit dimensions (especially if served via a CMS that strips width/height
        attributes), ad slots that inject banner creatives with variable heights
        after the page loads, and hydration artifacts where the server-rendered
        layout differs from the client's initial render (e.g., a "Recently Viewed"
        widget that's empty on SSR but populated by React on hydration). To
        diagnose: use the LayoutShift PerformanceEntry sources array from your
        RUM to get the shifted element's CSS selector and bounding rect. Cross-
        reference with a DevTools Performance recording (Timings track shows
        layout shifts) to see what triggered each shift. Fix by adding explicit
        image dimensions, reserving ad slots with min-height placeholders, and
        ensuring SSR and client render output match for above-the-fold content.
      </p>

      <h3>Q: How does CrUX data differ from Lighthouse, and when do you use each?</h3>
      <p>
        CrUX is 28-day rolling P75 from real Chrome users on your pages — it
        reflects field reality including device diversity, network variance, and
        third-party scripts, and it's what Google uses for Search ranking. It lags
        by up to 28 days and you can't segment by page template within CrUX (only
        by URL pattern). Lighthouse is a single synthetic page load from a
        controlled Chromium instance — it's reproducible, debuggable, and runs in
        CI, but it's not representative of field conditions. Use CrUX (or your own
        RUM) for measurement and alerting on real user experience. Use Lighthouse
        for diagnosing root causes and enforcing regressions in CI. Never optimize
        purely for Lighthouse scores — a Lighthouse score of 100 is achievable
        with techniques that have no impact on the P75 field score for a real
        production application with ads, third-party scripts, and diverse user
        devices.
      </p>
    </ArticleLayout>
  );
}
