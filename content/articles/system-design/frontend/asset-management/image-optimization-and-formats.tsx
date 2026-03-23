"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-image-optimization-and-formats-extensive",
  title: "Image Optimization and Formats",
  description:
    "Comprehensive guide to image formats, compression strategies, responsive images, lazy loading, image CDNs, LQIP placeholders, and CLS prevention for staff/principal engineer interviews.",
  category: "frontend",
  subcategory: "asset-management",
  slug: "image-optimization-and-formats",
  version: "extensive",
  wordCount: 4800,
  readingTime: 20,
  lastUpdated: "2026-03-21",
  tags: [
    "image-optimization",
    "webp",
    "avif",
    "responsive-images",
    "lazy-loading",
    "performance",
    "cls",
    "lqip",
    "blurhash",
    "image-cdn",
  ],
  relatedTopics: [
    "performance-optimization",
    "lazy-loading",
    "cdn-caching",
    "above-the-fold-optimization",
  ],
};

export default function ImageOptimizationAndFormatsArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ── Section 1: Definition & Context ── */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Image optimization</strong> is the discipline of delivering
          the highest visual quality at the lowest byte cost, matched precisely
          to each user&apos;s device, viewport, and network conditions. Images
          typically account for 40-60% of a page&apos;s total weight, making
          them the single largest lever for frontend performance improvement.
        </p>
        <p>
          At staff/principal level, image optimization is not just about
          shrinking files. It is an architectural concern that intersects build
          pipelines, CDN configuration, HTML semantics, runtime rendering
          behavior, and Core Web Vitals (specifically LCP, CLS, and INP). A
          poorly optimized image strategy can single-handedly tank Lighthouse
          scores, increase bounce rates, and inflate infrastructure costs.
        </p>
        <p>
          Modern image optimization requires understanding the full spectrum:
          choosing the right format per use case, encoding at the optimal quality
          level, serving responsive variants via <code>srcset</code> and{" "}
          <code>&lt;picture&gt;</code>, lazy loading below-the-fold content,
          preventing Cumulative Layout Shift (CLS) with proper sizing, and
          leveraging image CDNs for on-demand transformation. This article
          covers each of these areas with production-grade depth.
        </p>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">
            Key Insight: Images Are an Architectural Decision
          </h3>
          <p>
            The choice between build-time optimization (sharp, imagemin) and
            runtime optimization (Cloudinary, Imgix) fundamentally shapes your
            deployment pipeline, storage costs, and time-to-first-byte. This is
            not a CSS concern&mdash;it is a systems design decision that
            affects infrastructure, CI/CD, and operational cost at scale.
          </p>
        </div>
      </section>

      {/* ── Section 2: Core Concepts ── */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>Lossy compression:</strong> Permanently discards visual data
            deemed imperceptible (JPEG, WebP lossy, AVIF). Quality parameter
            (q) controls the trade-off: q=80 JPEG is typically indistinguishable
            from the original for photographs. AVIF achieves comparable quality
            at q=50-65 due to superior perceptual encoding.
          </li>
          <li>
            <strong>Lossless compression:</strong> Reduces file size without any
            data loss (PNG, WebP lossless, SVG with SVGO). Essential when pixel
            accuracy matters: screenshots, diagrams, text overlays, or images
            that will undergo further editing.
          </li>
          <li>
            <strong>Chroma subsampling (4:2:0):</strong> Exploits human vision&apos;s
            lower sensitivity to color detail versus luminance. JPEG and AVIF
            default to 4:2:0, halving chrominance resolution in both dimensions
            for ~50% compression gain with near-invisible quality loss on photographs.
          </li>
          <li>
            <strong>Progressive rendering:</strong> Progressive JPEG transmits
            multiple passes of increasing quality, allowing the browser to
            display a low-quality preview before the full download completes.
            AVIF supports progressive decoding natively. This improves perceived
            performance even if total byte size is slightly larger.
          </li>
          <li>
            <strong>Content negotiation:</strong> The browser sends an{" "}
            <code>Accept: image/avif, image/webp</code> header. The server or
            CDN inspects this to serve the optimal format without any client-side
            JavaScript. Requires <code>Vary: Accept</code> in response headers
            to prevent cache poisoning.
          </li>
          <li>
            <strong>Device Pixel Ratio (DPR):</strong> A 2x Retina display
            needs a source image 2x the CSS pixel dimensions to appear sharp.
            Serving a 2x image to a 1x display wastes 75% of the pixels.{" "}
            <code>srcset</code> with width descriptors lets the browser pick the
            right variant.
          </li>
          <li>
            <strong>Cumulative Layout Shift (CLS):</strong> When an image loads
            without reserved space, surrounding content shifts, degrading UX
            and Core Web Vitals. Prevention requires explicit{" "}
            <code>width</code>/<code>height</code> attributes or CSS{" "}
            <code>aspect-ratio</code> on every <code>&lt;img&gt;</code> element.
          </li>
          <li>
            <strong>LQIP (Low Quality Image Placeholder):</strong> A tiny
            preview (typically 20-40px wide, base64-inlined) displayed instantly
            while the full image loads. Variants include BlurHash (a compact
            hash decoded to a gradient), dominant color (a single hex value),
            and SVG trace (an outlined silhouette).
          </li>
        </ul>
      </section>

      {/* ── Section 3: Architecture & Flow ── */}
      <section>
        <h2>Architecture &amp; Flow</h2>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Image Format Decision Tree
        </h3>
        <p>
          Choosing the right format is the first and highest-impact optimization
          decision. The decision depends on content type (photograph vs. vector
          vs. transparency needs), browser support, and whether animation is
          required.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/image-optimization-and-formats-diagram-1.svg"
          alt="Image format decision tree showing when to use JPEG, PNG, WebP, AVIF, or SVG based on content type"
          caption="Image Format Decision Tree: Start with content type, then negotiate the most efficient supported format via the <picture> element."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Format Characteristics Deep Dive
        </h3>
        <ul className="space-y-3">
          <li>
            <strong>JPEG:</strong> The universal workhorse. Lossy only, no
            transparency, no animation. Excellent for photographs at q=80-85.
            Progressive JPEG shows a blurry preview first. Supported by 100% of
            browsers. MozJPEG encoder achieves 5-10% better compression than
            libjpeg at equivalent quality.
          </li>
          <li>
            <strong>PNG:</strong> Lossless with full alpha transparency. PNG-8
            (indexed, up to 256 colors) is excellent for simple graphics and
            icons. PNG-24/32 supports millions of colors with alpha but produces
            large files for photographs. Use tools like pngquant for lossy PNG
            compression (quantizes to 256 colors with dithering).
          </li>
          <li>
            <strong>WebP:</strong> Developed by Google, supports both lossy and
            lossless modes, transparency, and animation. Lossy WebP is 25-35%
            smaller than JPEG at equivalent SSIM quality. Browser support
            exceeds 97% globally (2026). The go-to modern format when AVIF is
            not supported.
          </li>
          <li>
            <strong>AVIF:</strong> Based on the AV1 video codec. Achieves 50%
            size reduction versus JPEG and 20% versus WebP at equivalent quality.
            Supports HDR, wide color gamut, and film grain synthesis. Trade-off:
            encoding is 10-100x slower than JPEG (use for pre-generated assets,
            not real-time). Browser support ~93% (2026), with Safari 16+ support.
          </li>
          <li>
            <strong>SVG:</strong> XML-based vector format. Resolution-independent,
            styleable with CSS, animatable, and typically tiny for icons and
            logos. Run through SVGO to strip editor metadata (often 30-60%
            savings). Inline for critical icons to eliminate HTTP requests.
          </li>
          <li>
            <strong>GIF:</strong> Legacy animation format. Limited to 256 colors,
            no alpha blending. For animated content, prefer WebP animation (50%+
            smaller) or MP4/WebM video (90%+ smaller for long sequences). GIF
            is only acceptable for very short, simple animations where broad
            compatibility matters (email, SMS).
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Responsive Images Pipeline
        </h3>
        <p>
          Responsive images ensure each device downloads only the pixels it
          needs. The HTML specification provides three mechanisms:{" "}
          <code>srcset</code> with width descriptors for resolution switching,{" "}
          <code>&lt;picture&gt;</code> with <code>type</code> for format
          negotiation, and <code>&lt;picture&gt;</code> with{" "}
          <code>media</code> for art direction (serving entirely different
          crops per breakpoint).
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/image-optimization-and-formats-diagram-2.svg"
          alt="Responsive images pipeline showing srcset, sizes, picture element, and art direction"
          caption="Responsive Images Pipeline: The browser evaluates format support, media queries, viewport width, and DPR to select the optimal image variant."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Image Optimization Build Pipeline
        </h3>
        <p>
          A production image pipeline processes uploads through metadata
          stripping, resizing into multiple width variants, encoding into
          multiple formats, generating placeholders, and finally storing
          results in object storage behind a CDN. Understanding this pipeline
          is critical for architecting systems that handle user-generated
          content at scale.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/asset-management/image-optimization-and-formats-diagram-3.svg"
          alt="Image optimization build pipeline showing upload, processing, variant generation, and CDN delivery"
          caption="Image Optimization Pipeline: From raw upload through processing, variant generation, and CDN delivery. Each stage reduces bytes while preserving perceived quality."
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Lazy Loading Strategies
        </h3>
        <p>
          Lazy loading defers image downloads until they are near the viewport,
          reducing initial page weight and time-to-interactive. Two primary
          approaches exist:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Native lazy loading (<code>loading=&quot;lazy&quot;</code>):</strong>{" "}
            Built into all modern browsers. Zero JavaScript required. The
            browser uses internal heuristics (typically 1250-2500px from viewport
            depending on network speed) to trigger loading. Apply to all images
            except those above the fold (LCP candidates should use{" "}
            <code>loading=&quot;eager&quot;</code> and{" "}
            <code>fetchpriority=&quot;high&quot;</code>).
          </li>
          <li>
            <strong>Intersection Observer API:</strong> JavaScript-based approach
            offering fine-grained control over trigger thresholds, root margins,
            and loading behavior. Necessary when you need custom placeholder
            transitions (blur-up effect), loading priority queues, or analytics
            on image visibility. Use <code>rootMargin: &quot;200px&quot;</code>{" "}
            to start loading before images enter the viewport. Production
            implementations typically combine Intersection Observer with a
            blur-up pattern: a tiny LQIP or BlurHash placeholder is displayed
            instantly, then cross-faded to the full image once loaded. The
            component tracks loaded and in-view state, decodes the BlurHash to
            a canvas placeholder, and applies smooth opacity transitions between
            placeholder and full image.
          </li>
        </ul>
      </section>

      {/* ── Section 4: Trade-offs & Comparisons ── */}
      <section>
        <h2>Trade-offs &amp; Comparisons</h2>

        <div className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-4 py-3 text-left font-semibold text-theme">Format</th>
                <th className="px-4 py-3 text-left font-semibold text-theme">Compression</th>
                <th className="px-4 py-3 text-left font-semibold text-theme">Transparency</th>
                <th className="px-4 py-3 text-left font-semibold text-theme">Animation</th>
                <th className="px-4 py-3 text-left font-semibold text-theme">Browser Support</th>
                <th className="px-4 py-3 text-left font-semibold text-theme">Encode Speed</th>
                <th className="px-4 py-3 text-left font-semibold text-theme">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-3 font-medium">JPEG</td>
                <td className="px-4 py-3">Lossy</td>
                <td className="px-4 py-3">No</td>
                <td className="px-4 py-3">No</td>
                <td className="px-4 py-3">100%</td>
                <td className="px-4 py-3">Fast</td>
                <td className="px-4 py-3">Photos (fallback)</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-3 font-medium">PNG</td>
                <td className="px-4 py-3">Lossless</td>
                <td className="px-4 py-3">Yes (alpha)</td>
                <td className="px-4 py-3">APNG</td>
                <td className="px-4 py-3">100%</td>
                <td className="px-4 py-3">Fast</td>
                <td className="px-4 py-3">Screenshots, UI</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-3 font-medium">WebP</td>
                <td className="px-4 py-3">Both</td>
                <td className="px-4 py-3">Yes</td>
                <td className="px-4 py-3">Yes</td>
                <td className="px-4 py-3">97%+</td>
                <td className="px-4 py-3">Medium</td>
                <td className="px-4 py-3">General purpose</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-3 font-medium">AVIF</td>
                <td className="px-4 py-3">Both</td>
                <td className="px-4 py-3">Yes</td>
                <td className="px-4 py-3">Yes</td>
                <td className="px-4 py-3">93%</td>
                <td className="px-4 py-3">Very slow</td>
                <td className="px-4 py-3">Best quality/size</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-3 font-medium">SVG</td>
                <td className="px-4 py-3">Lossless (vector)</td>
                <td className="px-4 py-3">Yes</td>
                <td className="px-4 py-3">SMIL/CSS</td>
                <td className="px-4 py-3">100%</td>
                <td className="px-4 py-3">N/A</td>
                <td className="px-4 py-3">Icons, logos</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">GIF</td>
                <td className="px-4 py-3">Lossless (256 colors)</td>
                <td className="px-4 py-3">Binary only</td>
                <td className="px-4 py-3">Yes</td>
                <td className="px-4 py-3">100%</td>
                <td className="px-4 py-3">Fast</td>
                <td className="px-4 py-3">Legacy / email</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="px-4 py-3 text-left font-semibold text-theme">Approach</th>
                <th className="px-4 py-3 text-left font-semibold text-theme">Pros</th>
                <th className="px-4 py-3 text-left font-semibold text-theme">Cons</th>
                <th className="px-4 py-3 text-left font-semibold text-theme">When to Use</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-3 font-medium">Build-time (sharp)</td>
                <td className="px-4 py-3">Zero runtime cost, deterministic</td>
                <td className="px-4 py-3">Longer builds, all variants pre-generated</td>
                <td className="px-4 py-3">Static sites, known image set</td>
              </tr>
              <tr className="border-b border-theme/30">
                <td className="px-4 py-3 font-medium">Runtime CDN (Imgix)</td>
                <td className="px-4 py-3">On-demand, no build overhead</td>
                <td className="px-4 py-3">First-hit latency, vendor cost</td>
                <td className="px-4 py-3">UGC, dynamic catalogs</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Hybrid (Next.js Image)</td>
                <td className="px-4 py-3">Auto srcset, lazy loading, blur placeholder</td>
                <td className="px-4 py-3">Framework-coupled, server required</td>
                <td className="px-4 py-3">Next.js applications</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 5: Best Practices ── */}
      <section>
        <h2>Best Practices</h2>
        <ol className="space-y-4">
          <li>
            <strong>1. Serve modern formats with fallback:</strong> Always use{" "}
            <code>&lt;picture&gt;</code> with AVIF source, WebP source, and JPEG{" "}
            <code>&lt;img&gt;</code> fallback. This single pattern typically
            saves 40-60% bandwidth versus JPEG-only.
          </li>
          <li>
            <strong>2. Always specify width and height:</strong> Every{" "}
            <code>&lt;img&gt;</code> must have explicit <code>width</code> and{" "}
            <code>height</code> attributes (or CSS <code>aspect-ratio</code>)
            to let the browser reserve layout space before the image loads. This
            is the primary CLS prevention mechanism.
          </li>
          <li>
            <strong>3. Prioritize the LCP image:</strong> The Largest Contentful
            Paint image must use <code>loading=&quot;eager&quot;</code>,{" "}
            <code>fetchpriority=&quot;high&quot;</code>, and ideally be
            discoverable via a <code>&lt;link rel=&quot;preload&quot;&gt;</code>{" "}
            with <code>imagesrcset</code>. Never lazy-load the LCP element.
          </li>
          <li>
            <strong>4. Generate 5-6 width breakpoints:</strong> Common set:
            400w, 640w, 800w, 1200w, 1600w, 2000w. More granularity has
            diminishing returns. Multiply by format count (3 formats = 15-18
            variants per image).
          </li>
          <li>
            <strong>5. Use content-aware quality:</strong> Not all images need
            the same quality. Thumbnails can use q=60, hero images q=80-85.
            Tools like Butteraugli or SSIM can automate quality selection to
            meet a perceptual target.
          </li>
          <li>
            <strong>6. Implement LQIP for perceived performance:</strong>{" "}
            BlurHash (20-30 bytes, client-decoded) or inline base64 LQIP
            (~200-500 bytes) provide instant visual feedback while the full
            image loads. Medium, Unsplash, and Pinterest all use this pattern.
          </li>
          <li>
            <strong>7. Set aggressive cache headers:</strong> Images are
            immutable once generated. Use{" "}
            <code>Cache-Control: public, max-age=31536000, immutable</code>{" "}
            with content-hashed filenames (e.g., <code>hero-a1b2c3.webp</code>).
          </li>
          <li>
            <strong>8. Compress SVGs with SVGO:</strong> Remove editor metadata,
            unnecessary attributes, and empty groups. Typical savings: 30-60%.
            Inline critical SVGs (icons, logos) to eliminate HTTP requests.
          </li>
        </ol>
      </section>

      {/* ── Section 6: Common Pitfalls ── */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Lazy loading the LCP image:</strong> Applying{" "}
            <code>loading=&quot;lazy&quot;</code> to the hero image delays LCP
            because the browser won&apos;t start the request until the image
            enters the viewport threshold. Always audit which image is the LCP
            element and mark it eager.
          </li>
          <li>
            <strong>Missing <code>sizes</code> attribute:</strong> Without{" "}
            <code>sizes</code>, the browser assumes the image will be 100vw
            wide and may download a larger variant than needed. If an image
            only occupies 50% of the viewport on desktop, specify{" "}
            <code>sizes=&quot;(min-width: 1024px) 50vw, 100vw&quot;</code>.
          </li>
          <li>
            <strong>Serving WebP/AVIF without <code>Vary: Accept</code>:</strong>{" "}
            If a CDN caches a WebP response and serves it to a browser that
            sent <code>Accept: image/jpeg</code>, the image breaks. Always
            include <code>Vary: Accept</code> in image response headers.
          </li>
          <li>
            <strong>Over-compressing text-heavy images:</strong> Screenshots,
            UI mockups, and images containing text suffer visibly from lossy
            compression artifacts. Use PNG or lossless WebP for these; lossy
            JPEG/WebP creates blurry halos around text edges.
          </li>
          <li>
            <strong>Using GIF for animations:</strong> A 5-second GIF can be
            3-5MB. The same content as an MP4 or WebM video is typically under
            500KB. Replace animated GIFs with{" "}
            <code>&lt;video autoplay muted loop playsinline&gt;</code> for
            dramatic savings.
          </li>
          <li>
            <strong>No width/height on images (CLS):</strong> Browser cannot
            reserve space without dimensions. Content shifts as images load,
            pushing CLS above the 0.1 threshold. This is the most common
            avoidable CLS issue in production.
          </li>
          <li>
            <strong>Ignoring EXIF orientation:</strong> Camera phones embed
            rotation data in EXIF. If your pipeline strips EXIF without
            applying the orientation transform first, images appear rotated.
            Always auto-orient before stripping metadata.
          </li>
        </ul>
      </section>

      {/* ── Section 7: Real-World Use Cases ── */}
      <section>
        <h2>Real-World Use Cases</h2>
        <ul className="space-y-3">
          <li>
            <strong>Pinterest:</strong> Serves WebP with LQIP placeholders.
            Uses a dominant-color background computed at upload time. Serves
            different crops for mobile (square) and desktop (original aspect
            ratio) using art direction via <code>&lt;picture&gt;</code>.
            Reports 30%+ bandwidth reduction after WebP migration.
          </li>
          <li>
            <strong>Instagram:</strong> Generates 6+ resolution variants per
            uploaded photo. Uses progressive JPEG for feed images. Implements
            BlurHash placeholders in the mobile app. Feed images use
            content-aware cropping to center on detected faces.
          </li>
          <li>
            <strong>Unsplash:</strong> Serves images via Imgix (runtime image
            CDN). URL parameters control width, quality, format, and crop:{" "}
            <code>?w=800&amp;q=80&amp;fm=webp&amp;fit=crop</code>. Inlines a tiny
            base64 LQIP (30px wide) with CSS blur filter in the initial HTML.
            Transitions to the full image with a CSS opacity animation.
          </li>
          <li>
            <strong>Shopify:</strong> Automatically generates AVIF and WebP
            variants for all product images. Uses{" "}
            <code>&lt;picture&gt;</code> with format fallback. Merchants upload
            once; the platform handles all optimization. Reports measurable
            conversion improvement from faster product page loads.
          </li>
          <li>
            <strong>Next.js (Vercel):</strong> The <code>next/image</code>{" "}
            component automatically generates srcset, applies lazy loading,
            serves WebP/AVIF based on Accept header, and generates BlurHash
            placeholders at build time for static imports. Demonstrates how
            framework-level integration eliminates developer-facing complexity.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">
          Production Image Component with Next.js
        </h3>
        <p>
          Framework-level integration like Next.js Image component automates most
          optimization concerns. The <code>next.config.js</code> configuration
          specifies allowed image formats (AVIF, WebP), device sizes, and remote
          patterns for external images. For static imports, the component
          automatically generates width, height, and blurDataURL from the image
          file. Using <code>placeholder=&quot;blur&quot;</code> enables the
          blur-up effect, <code>priority</code> adds a preload hint for LCP
          images, and <code>sizes</code> tells the browser the expected display
          size for proper srcset selection. For dynamic remote images where
          dimensions are unknown, explicit width and height props are required
          along with <code>loading=&quot;lazy&quot;</code> for non-LCP images.
          This framework-level integration eliminates developer-facing complexity
          while ensuring consistent optimization across the application.
        </p>
      </section>

      {/* ── Section 8: Common Interview Questions ── */}
      <section>
        <h2>Common Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: You&apos;re designing the image pipeline for a social media
              app with 10M daily photo uploads. How do you architect the
              optimization pipeline?
            </p>
            <p className="mt-2 text-sm text-muted">
              Use an async processing pipeline: uploads go to object storage
              (S3) and trigger a queue (SQS/Kafka) message. Worker services
              pull messages and generate variants using sharp: 5 widths (400,
              800, 1200, 1600, 2000) x 3 formats (AVIF, WebP, JPEG) = 15
              variants per image. Compute BlurHash and store it in the image
              metadata database. Serve via CDN with content negotiation
              (Accept header + Vary: Accept). Use a dead letter queue for
              failed processing. For cost optimization, generate AVIF lazily
              on first request rather than eagerly for all images, since AVIF
              encoding is CPU-intensive.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How do you prevent CLS from images while still lazy loading
              them?
            </p>
            <p className="mt-2 text-sm text-muted">
              Three mechanisms work together: (1) Always include width and
              height attributes on the img element so the browser calculates
              the aspect ratio and reserves space in the layout before the
              image downloads. (2) Use CSS aspect-ratio as a fallback for
              dynamic images where dimensions come from an API. (3) Display a
              LQIP (BlurHash or base64 placeholder) in the reserved space
              while the full image loads, providing visual continuity. For the
              LCP image specifically, skip lazy loading entirely and use
              fetchpriority=&quot;high&quot; plus a preload link tag.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: When would you choose AVIF over WebP, and what are the
              trade-offs?
            </p>
            <p className="mt-2 text-sm text-muted">
              Choose AVIF when file size is the primary concern and encoding
              time is acceptable (pre-generated assets, not real-time). AVIF
              achieves ~20% better compression than WebP at equivalent quality
              and supports HDR/wide gamut. Trade-offs: AVIF encoding is
              10-100x slower than WebP, making it impractical for real-time
              image transforms. Browser support is ~93% vs WebP&apos;s 97%+.
              AVIF also has a maximum dimension limit (8193x4320 in some
              implementations). The pragmatic approach: serve AVIF as the
              preferred source in a picture element, with WebP as the first
              fallback and JPEG as the universal fallback.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: How does content negotiation work for serving different image
              formats without client-side JavaScript?
            </p>
            <p className="mt-2 text-sm text-muted">
              The browser sends an Accept header listing supported formats
              (e.g., Accept: image/avif, image/webp, image/*). The server or
              CDN reads this header and responds with the best supported
              format. Critically, the response must include Vary: Accept to
              tell caches that the response varies by Accept header; without
              this, a cache might serve a WebP response to a client that only
              accepts JPEG. This can be implemented at the CDN edge (Cloudflare
              Polish, Fastly Image Optimizer), at the origin (Nginx with
              image_filter), or via an image CDN (Imgix, Cloudinary) that
              handles negotiation automatically.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: What is the difference between srcset with width descriptors
              (w) and pixel density descriptors (x)? When would you use each?
            </p>
            <p className="mt-2 text-sm text-muted">
              Width descriptors (400w, 800w, 1200w) tell the browser the
              intrinsic width of each source. Combined with sizes, the browser
              calculates which source best matches the rendered size multiplied
              by DPR. Pixel density descriptors (1x, 2x, 3x) directly specify
              which source to use at each DPR, but assume a fixed rendered
              size. Use width descriptors for responsive images whose rendered
              size changes with the viewport (most images). Use density
              descriptors for fixed-size images like logos or avatars that are
              always displayed at e.g., 48x48 CSS pixels regardless of
              viewport width.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel p-4">
            <p className="font-semibold text-theme">
              Q: An e-commerce site has 2M product images. Build-time
              optimization takes 6 hours. How do you fix this?
            </p>
            <p className="mt-2 text-sm text-muted">
              Migrate to on-demand (runtime) optimization: store original
              images in object storage and use an image CDN (Imgix, Cloudinary,
              or a self-hosted solution with sharp behind a CDN). Images are
              transformed on first request and cached at the edge. This
              eliminates build-time processing entirely. For a self-hosted
              approach: deploy a Node.js service with sharp that accepts URL
              parameters (/img/product-123.jpg?w=800&amp;fmt=webp&amp;q=80),
              transforms on-the-fly, and caches results in a CDN with
              immutable cache headers. The first request has ~200-500ms
              processing latency; subsequent requests are served from CDN
              cache in ~50ms.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 9: References & Further Reading ── */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://web.dev/learn/images/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              web.dev &mdash; Learn Images (Google)
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              MDN &mdash; Responsive Images
            </a>
          </li>
          <li>
            <a
              href="https://nextjs.org/docs/app/api-reference/components/image"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              Next.js Image Component Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.smashingmagazine.com/2021/09/modern-image-formats-avif-webp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              Smashing Magazine &mdash; Modern Image Formats: AVIF and WebP
            </a>
          </li>
          <li>
            <a
              href="https://blurha.sh/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              BlurHash &mdash; Compact Image Placeholder Encoding
            </a>
          </li>
          <li>
            <a
              href="https://sharp.pixelplumbing.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:no-underline"
            >
              Sharp &mdash; High-Performance Node.js Image Processing
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
