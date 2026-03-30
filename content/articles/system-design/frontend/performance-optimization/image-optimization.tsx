"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-image-optimization",
  title: "Image Optimization (WebP, AVIF, responsive images, srcset)",
  description: "Comprehensive guide to image optimization techniques including modern formats, responsive images, lazy loading, and CDN delivery strategies.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "image-optimization",
  wordCount: 6400,
  readingTime: 26,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "images", "WebP", "AVIF", "responsive", "srcset", "lazy-loading", "CDN"],
  relatedTopics: ["lazy-loading", "critical-css", "above-the-fold-optimization", "web-vitals"],
};

export default function ImageOptimizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Image optimization</strong> is the practice of delivering images in the right format, 
          size, and quality to minimize file size while maintaining acceptable visual quality. Images 
          account for <strong>50-70% of total page weight</strong> on most websites, making image 
          optimization the highest-ROI performance technique available.
        </p>
        <p>
          A single unoptimized hero image can be 5 MB — more than the entire rest of the page combined. 
          On a 3G connection, downloading a 5 MB image takes 25+ seconds. On a fast 100 Mbps connection, 
          it still takes 400ms. Meanwhile, an optimized version of the same image might be 150-300 KB — 
          a 95%+ reduction with minimal visible quality loss.
        </p>
        <p>
          The three pillars of image optimization are:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Format:</strong> Use the smallest format the browser supports. Modern formats like 
            WebP and AVIF deliver 30-50% smaller files than JPEG/PNG at equivalent quality.
          </li>
          <li>
            <strong>Size:</strong> Serve images at the dimensions they&apos;re displayed. A 2400px wide 
            image displayed at 400px wastes 95% of its pixels (and bytes).
          </li>
          <li>
            <strong>Delivery:</strong> Lazy load below-fold images, use CDNs with auto-format detection, 
            and set proper cache headers for optimal delivery.
          </li>
        </ul>
        <p>
          The business impact of image optimization is well-documented:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Pinterest:</strong> Reducing image load times increased search engine traffic by 15%.
          </li>
          <li>
            <strong>COOK:</strong> Optimizing images reduced page load time by 0.85 seconds and increased 
            conversions by 7%.
          </li>
          <li>
            <strong>Facebook:</strong> Image optimization saved 800 TB of bandwidth per month (yes, terabytes).
          </li>
        </ul>
        <p>
          In system design interviews, image optimization demonstrates understanding of content delivery, 
          bandwidth constraints, progressive enhancement, and the trade-offs between quality and performance.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/image-formats-comparison.svg"
          alt="Comparison chart of image formats showing JPEG, WebP, AVIF, PNG, and SVG with their compression ratios, browser support, and recommended use cases"
          caption="Image format comparison: AVIF provides 40-50% compression vs JPEG, WebP provides 25-35%, with varying browser support"
        />

        <h3>Modern Image Formats</h3>
        <p>
          Choosing the right format is the single most impactful image optimization decision:
        </p>

        <h4>JPEG</h4>
        <p>
          The universal fallback. JPEG uses lossy compression and is ideal for photographs. While not 
          the most efficient format, it has 100% browser support and should always be included as a 
          fallback for older browsers.
        </p>
        <p>
          <strong>Best for:</strong> Photographs, complex images with gradients.
        </p>
        <p>
          <strong>Compression:</strong> Quality 75-85 provides excellent visual quality with 60-80% 
          size reduction vs original.
        </p>

        <h4>WebP</h4>
        <p>
          Google&apos;s modern format that provides 25-35% better compression than JPEG at equivalent 
          quality. WebP supports both lossy and lossless compression, transparency (like PNG), and 
          animation (like GIF).
        </p>
        <p>
          <strong>Best for:</strong> Production default for all image types.
        </p>
        <p>
          <strong>Browser support:</strong> ~97% (all modern browsers).
        </p>

        <h4>AVIF</h4>
        <p>
          The newest major format, providing 40-50% better compression than JPEG. AVIF is based on 
          the AV1 video codec and offers superior quality at small file sizes. It supports HDR, 
          wide color gamut, transparency, and animation.
        </p>
        <p>
          <strong>Best for:</strong> Best compression for photos where browser support allows.
        </p>
        <p>
          <strong>Browser support:</strong> ~92% (Chrome, Firefox, Edge; Safari 16+).
        </p>

        <h4>PNG</h4>
        <p>
          Lossless format ideal for images requiring transparency or sharp edges (logos, icons, 
          screenshots). PNG files are typically 2-5x larger than JPEG for photographs but provide 
          superior quality for graphics.
        </p>
        <p>
          <strong>Best for:</strong> Images with transparency, screenshots, icons, logos.
        </p>

        <h4>SVG</h4>
        <p>
          Vector format that scales infinitely without quality loss. SVG files are typically very 
          small for simple graphics and can be styled with CSS and animated.
        </p>
        <p>
          <strong>Best for:</strong> Icons, logos, illustrations, simple graphics.
        </p>

        <h3>Responsive Images with srcset</h3>
        <p>
          A 2400px wide hero image is unnecessary on a 375px mobile screen. The <code>srcset</code> 
          attribute lets the browser choose the right image size based on viewport width and device 
          pixel ratio.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/image-responsive-srcset.svg"
          alt="Diagram showing how srcset and sizes attributes work together to serve appropriate image sizes to mobile, tablet, and desktop devices"
          caption="Responsive images: browser calculates display width × pixel ratio and selects appropriate source from srcset"
        />

        <p>
          How srcset works:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Browser calculates display width:</strong> Using the <code>sizes</code> attribute, 
            the browser determines how wide the image will be displayed.
          </li>
          <li>
            <strong>Multiplies by pixel ratio:</strong> For Retina/HiDPI displays, the browser 
            multiplies by the device pixel ratio (2x or 3x).
          </li>
          <li>
            <strong>Selects appropriate source:</strong> The browser picks the smallest image from 
            <code>srcset</code> that&apos;s greater than or equal to the calculated width.
          </li>
        </ol>
        <p>
          Example: On a 375px wide iPhone (2x Retina):
        </p>
        <ul className="space-y-1">
          <li>• Display width: 375px</li>
          <li>• 375px × 2 = 750px needed</li>
          <li>• Browser picks 800w image (smallest ≥ 750px)</li>
        </ul>
        <p>
          Without srcset, the browser would download the largest available image (e.g., 2400px), 
          wasting 80%+ of the bandwidth.
        </p>

        <h3>Lazy Loading</h3>
        <p>
          Lazy loading defers image downloads until images are about to enter the viewport. This 
          reduces initial page weight and speeds up Time to Interactive.
        </p>
        <p>
          <strong>Native lazy loading:</strong> Use <code>loading=&quot;lazy&quot;</code> attribute 
          on img tags. Supported in all modern browsers.
        </p>
        <p>
          <strong>Important:</strong> Never lazy-load the LCP (Largest Contentful Paint) image — 
          this is typically the hero image and should load eagerly with <code>fetchPriority=&quot;high&quot;</code>.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/image-optimization-pipeline.svg"
          alt="Pipeline diagram showing image optimization workflow from upload through processing, variant generation, and CDN delivery with before/after size comparison"
          caption="Image optimization pipeline: systematic approach achieving 95%+ size reduction from original upload"
        />

        <h3>Image Optimization Pipeline</h3>
        <p>
          A complete image optimization pipeline consists of four stages:
        </p>

        <h4>1. Upload</h4>
        <p>
          Users or content creators upload original images. These are typically unoptimized — direct 
          from cameras or design tools, ranging from 2-10 MB each.
        </p>
        <p>
          <strong>Best practice:</strong> Accept uploads asynchronously. Don&apos;t block the user 
          while processing — show a preview immediately and process in the background.
        </p>

        <h4>2. Process</h4>
        <p>
          Automated processing transforms the original into optimized variants:
        </p>
        <ul className="space-y-1">
          <li>• <strong>Resize:</strong> Generate multiple widths (400w, 800w, 1200w, 1600w, 2000w)</li>
          <li>• <strong>Convert:</strong> Create WebP and AVIF versions, keep JPEG fallback</li>
          <li>• <strong>Compress:</strong> Apply quality 75-85 for WebP/AVIF, 80-90 for JPEG</li>
          <li>• <strong>Generate thumbnails:</strong> Create small preview sizes for lazy-load placeholders</li>
        </ul>

        <h4>3. Store Variants</h4>
        <p>
          Store all generated variants with consistent naming:
        </p>
        <ul className="space-y-1">
          <li>• <code>image-400.webp</code>, <code>image-800.webp</code>, <code>image-1200.webp</code></li>
          <li>• <code>image-400.avif</code>, <code>image-800.avif</code>, <code>image-1200.avif</code></li>
          <li>• <code>image-400.jpg</code>, <code>image-800.jpg</code>, <code>image-1200.jpg</code></li>
        </ul>
        <p>
          For a single upload, you might generate 12-15 files (4-5 sizes × 3 formats). This seems 
          like more storage, but the total size is typically 80-90% smaller than the original.
        </p>

        <h4>4. Deliver via CDN</h4>
        <p>
          Serve images from a CDN with the following features:
        </p>
        <ul className="space-y-1">
          <li>• <strong>Auto-format:</strong> Serve WebP/AVIF to supporting browsers, JPEG fallback otherwise</li>
          <li>• <strong>On-the-fly resizing:</strong> Some CDNs can resize images at the edge</li>
          <li>• <strong>Cache headers:</strong> Set <code>Cache-Control: public, max-age=31536000, immutable</code></li>
          <li>• <strong>Content hashing:</strong> Use hashed filenames for cache-busting when images update</li>
        </ul>

        <h3>Next.js Image Component</h3>
        <p>
          Next.js provides a built-in <code>Image</code> component that handles most optimization 
          automatically:
        </p>
        <ul className="space-y-1">
          <li>• Automatic format negotiation (AVIF → WebP → JPEG)</li>
          <li>• Automatic srcset generation</li>
          <li>• Automatic lazy loading (except for priority images)</li>
          <li>• Automatic blur-up placeholders</li>
          <li>• Layout shift prevention with required width/height</li>
        </ul>
        <p>
          For most Next.js projects, the Image component is the simplest way to implement image 
          optimization without manual pipeline setup.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <h3>Format Selection Guide</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Use Case</th>
                <th className="p-3 text-left">Recommended</th>
                <th className="p-3 text-left">Fallback</th>
                <th className="p-3 text-left">Avoid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Photographs</td>
                <td className="p-3">AVIF → WebP</td>
                <td className="p-3">JPEG</td>
                <td className="p-3">PNG (too large)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Images with transparency</td>
                <td className="p-3">WebP → AVIF</td>
                <td className="p-3">PNG</td>
                <td className="p-3">JPEG (no transparency)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Icons, logos</td>
                <td className="p-3">SVG</td>
                <td className="p-3">PNG</td>
                <td className="p-3">JPEG (artifacts on edges)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Animated images</td>
                <td className="p-3">Animated WebP/AVIF</td>
                <td className="p-3">GIF</td>
                <td className="p-3">Video (for simple animations)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Screenshots</td>
                <td className="p-3">PNG</td>
                <td className="p-3">WebP (lossless)</td>
                <td className="p-3">JPEG (text artifacts)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>CDN vs Self-Hosted Optimization</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Aspect</th>
                <th className="p-3 text-left">CDN (Cloudinary, Imgix)</th>
                <th className="p-3 text-left">Self-Hosted (Sharp, build-time)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Setup Complexity</td>
                <td className="p-3">Low (URL parameters)</td>
                <td className="p-3">Medium (build pipeline)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Storage</td>
                <td className="p-3">CDN stores originals + variants</td>
                <td className="p-3">You store all variants</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Flexibility</td>
                <td className="p-3">High (on-the-fly transforms)</td>
                <td className="p-3">Medium (pre-generated only)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Cost</td>
                <td className="p-3">Pay per transformation/GB</td>
                <td className="p-3">Build time + storage only</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Best For</td>
                <td className="p-3">Dynamic content, UGC, frequent updates</td>
                <td className="p-3">Static content, predictable images</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Quality Settings Trade-offs</h3>
        <ul className="space-y-2">
          <li>
            <strong>Quality 90-100:</strong> Visually indistinguishable from original, but file sizes 
            are 2-3x larger than quality 80. Rarely justified for web use.
          </li>
          <li>
            <strong>Quality 75-85:</strong> Sweet spot for most images. Excellent visual quality with 
            60-80% size reduction. Recommended default.
          </li>
          <li>
            <strong>Quality 50-70:</strong> Noticeable artifacts on close inspection, but acceptable 
            for thumbnails or background images. Can achieve 85-95% size reduction.
          </li>
          <li>
            <strong>Quality below 50:</strong> Significant quality loss. Only use for very small 
            thumbnails or when bandwidth is extremely constrained.
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
          Never serve images without <code>width</code> and <code>height</code> attributes or CSS 
          <code>aspect-ratio</code>. Without dimensions, images cause layout shift (CLS) as they load.
        </p>
        <p>
          For responsive images, use CSS <code>aspect-ratio</code> or a wrapper with padding-bottom 
          technique to reserve space before the image loads.
        </p>

        <h3>Use Modern Formats with Fallbacks</h3>
        <p>
          Serve AVIF or WebP with JPEG fallback using the <code>&lt;picture&gt;</code> element:
        </p>
        <ul className="space-y-1">
          <li>• Browser picks first supported format</li>
          <li>• AVIF-supporting browsers get 50% smaller files</li>
          <li>• Older browsers still get working JPEG</li>
        </ul>

        <h3>Implement Responsive Images</h3>
        <p>
          Always use <code>srcset</code> and <code>sizes</code> for content images:
        </p>
        <ul className="space-y-1">
          <li>• Generate 4-5 width variants (400w, 800w, 1200w, 1600w, 2000w)</li>
          <li>• Use <code>sizes</code> to tell browser display width at different breakpoints</li>
          <li>• Mobile users won&apos;t download desktop-sized images</li>
        </ul>

        <h3>Lazy Load Below-Fold Images</h3>
        <p>
          Use <code>loading=&quot;lazy&quot;</code> for all images below the fold:
        </p>
        <ul className="space-y-1">
          <li>• Reduces initial page weight by 50-80%</li>
          <li>• Images load as user scrolls</li>
          <li>• Never lazy-load the LCP element (hero image)</li>
        </ul>

        <h3>Use Blur-Up Placeholders</h3>
        <p>
          Generate tiny (20x15px) blurred placeholders for progressive loading:
        </p>
        <ul className="space-y-1">
          <li>• Placeholder loads instantly (few hundred bytes)</li>
          <li>• Full image loads in background</li>
          <li>• Smooth transition when full image ready</li>
          <li>• Next.js Image component does this automatically</li>
        </ul>

        <h3>Set Proper Cache Headers</h3>
        <p>
          Images rarely change — cache them aggressively:
        </p>
        <ul className="space-y-1">
          <li>• <code>Cache-Control: public, max-age=31536000, immutable</code></li>
          <li>• Use content-hashed filenames for cache-busting</li>
          <li>• CDN edge caching for global delivery</li>
        </ul>

        <h3>Compress Appropriately</h3>
        <p>
          Quality settings by use case:
        </p>
        <ul className="space-y-1">
          <li>• <strong>Hero/LCP images:</strong> Quality 85-90 (prioritize quality)</li>
          <li>• <strong>Content images:</strong> Quality 75-85 (balanced)</li>
          <li>• <strong>Thumbnails:</strong> Quality 60-70 (small size priority)</li>
          <li>• <strong>Background images:</strong> Quality 50-70 (heavily compressed OK)</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Serving Original Uploads</h3>
        <p>
          User-uploaded images are often 5-15 MB from modern phone cameras. Serving these directly 
          is the most common image performance mistake.
        </p>
        <p>
          <strong>Solution:</strong> Always process uploads through an optimization pipeline before 
          serving. Never serve originals directly.
        </p>

        <h3>Missing Width/Height Attributes</h3>
        <p>
          Images without dimensions cause Cumulative Layout Shift (CLS) as they load. This harms 
          user experience and Core Web Vitals scores.
        </p>
        <p>
          <strong>Solution:</strong> Always specify <code>width</code> and <code>height</code>, or 
          use CSS <code>aspect-ratio</code> to reserve space.
        </p>

        <h3>Lazy-Loading the LCP Image</h3>
        <p>
          The hero/LCP image must load eagerly. Lazy-loading it adds 1-3 seconds to LCP because the 
          image won&apos;t start downloading until JavaScript executes and the Intersection Observer 
          triggers.
        </p>
        <p>
          <strong>Solution:</strong> Use <code>fetchPriority=&quot;high&quot;</code> and 
          <code>loading=&quot;eager&quot;</code> for the LCP image. Never lazy-load above-the-fold 
          hero images.
        </p>

        <h3>Missing sizes Attribute</h3>
        <p>
          Without <code>sizes</code>, the browser assumes images are 100vw wide and downloads the 
          largest variant — negating srcset benefits.
        </p>
        <p>
          <strong>Solution:</strong> Always include <code>sizes</code> that accurately describe 
          display width at different breakpoints.
        </p>

        <h3>Over-Compression</h3>
        <p>
          Quality below 50 creates visible artifacts that harm user perception. While file sizes are 
          tiny, the quality loss is often unacceptable.
        </p>
        <p>
          <strong>Solution:</strong> Target quality 65-85 for most use cases. Test on actual devices 
          to verify acceptable quality.
        </p>

        <h3>Too Many Breakpoints</h3>
        <p>
          Generating 10+ width variants adds complexity without meaningful savings. The browser only 
          needs enough options to pick an appropriately sized image.
        </p>
        <p>
          <strong>Solution:</strong> 4-5 breakpoints (400w, 800w, 1200w, 1600w, 2000w) covers all 
          devices. More than that adds storage without benefit.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Product Images</h3>
        <p>
          An e-commerce site with 10,000 products implemented a complete image optimization pipeline:
        </p>
        <ul className="space-y-1">
          <li>• Upload: Original 5-8 MB product photos</li>
          <li>• Process: Resize to 8 widths, convert to WebP/AVIF/JPEG</li>
          <li>• Deliver: CDN with auto-format, lazy loading for gallery</li>
        </ul>
        <p>
          Results: Product page load time decreased from 6.2s to 2.1s. Conversion rate increased 18%.
        </p>

        <h3>News Publisher</h3>
        <p>
          A news site with 50+ images per article implemented responsive images and lazy loading:
        </p>
        <ul className="space-y-1">
          <li>• LCP image: Preloaded, eager loading, AVIF + WebP + JPEG</li>
          <li>• Article images: Lazy loaded, srcset with 5 widths</li>
          <li>• Thumbnails: Quality 65, heavily compressed</li>
        </ul>
        <p>
          Results: Article page weight reduced from 8 MB to 1.2 MB. Bounce rate decreased 22%.
        </p>

        <h3>Social Media Platform</h3>
        <p>
          A social platform with user-generated images implemented on-the-fly optimization:
        </p>
        <ul className="space-y-1">
          <li>• CDN with auto-format detection</li>
          <li>• On-the-fly resizing via URL parameters</li>
          <li>• Blur-up placeholders from dominant color</li>
        </ul>
        <p>
          Results: Image bandwidth reduced 75%. Mobile engagement increased 28%.
        </p>

        <h3>Portfolio Site</h3>
        <p>
          A photography portfolio prioritized image quality while optimizing delivery:
        </p>
        <ul className="space-y-1">
          <li>• High-quality originals (quality 90) for lightbox view</li>
          <li>• Compressed thumbnails (quality 75) for gallery grid</li>
          <li>• AVIF for supporting browsers, WebP fallback</li>
        </ul>
        <p>
          Results: Gallery load time 3.5s → 1.2s. Lightbox quality maintained at original level.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: Why are images the highest-ROI optimization target?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Images typically account for 50-70% of total page weight. A single unoptimized hero 
              image can be 5 MB — more than the rest of the page combined. The optimization potential 
              is enormous:
            </p>
            <ul className="space-y-1">
              <li>• Modern formats (AVIF, WebP) provide 30-50% better compression than JPEG</li>
              <li>• Responsive images ensure mobile users don&apos;t download desktop-sized files</li>
              <li>• Lazy loading defers below-fold images until needed</li>
              <li>• Combined, these techniques can reduce image weight by 80-95%</li>
            </ul>
            <p className="mt-3">
              No other optimization target offers this magnitude of improvement with well-established, 
              low-risk techniques.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: How do you serve modern image formats with fallbacks?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use the <code>&lt;picture&gt;</code> element with multiple <code>&lt;source&gt;</code> 
              elements:
            </p>
            <ul className="space-y-1">
              <li>• Browser picks the FIRST source it supports</li>
              <li>• Order: AVIF → WebP → JPEG (fallback)</li>
              <li>• Each source specifies type and srcset</li>
            </ul>
            <p className="mt-3">
              AVIF-supporting browsers get 50% smaller files. WebP browsers get 30% smaller files. 
              Older browsers still get working JPEG images.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: Explain how srcset and sizes work together.</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              <code>srcset</code> provides a list of image sources with their widths (e.g., 400w, 800w, 1200w). 
              <code>sizes</code> tells the browser how wide the image will be displayed at different 
              viewport widths.
            </p>
            <p className="mb-3">
              The browser:
            </p>
            <ol className="space-y-2">
              <li>
                Evaluates <code>sizes</code> to determine display width
              </li>
              <li>
                Multiplies by device pixel ratio (2x for Retina)
              </li>
              <li>
                Picks the smallest source from <code>srcset</code> that&apos;s ≥ the calculated width
              </li>
            </ol>
            <p className="mt-3">
              Example: 375px mobile (2x Retina) with sizes=&quot;100vw&quot; needs 750px. Browser 
              picks 800w from srcset — not the 2400w original.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: When should you NOT lazy-load an image?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Never lazy-load the LCP (Largest Contentful Paint) element — typically the hero image 
              or main heading. Lazy-loading the LCP adds 1-3 seconds to LCP because:
            </p>
            <ul className="space-y-1">
              <li>• Image won&apos;t start downloading until JavaScript executes</li>
              <li>• Intersection Observer must trigger the load</li>
              <li>• This delays the most important visual element</li>
            </ul>
            <p className="mt-3">
              Also avoid lazy-loading:
            </p>
            <ul className="space-y-1">
              <li>• Above-the-fold content (visible without scrolling)</li>
              <li>• Small images (&lt;10 KB) where lazy-loading overhead exceeds benefit</li>
              <li>• SEO-critical images that should be indexed immediately</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What quality settings do you recommend for different use cases?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Quality settings by use case:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Hero/LCP images (85-90):</strong> Prioritize quality for first-impression images</li>
              <li>• <strong>Content images (75-85):</strong> Balanced quality and size for article images</li>
              <li>• <strong>Thumbnails (60-70):</strong> Small size priority, quality less critical</li>
              <li>• <strong>Background images (50-70):</strong> Heavily compressed acceptable for decorative use</li>
            </ul>
            <p className="mt-3">
              Quality 75-85 is the sweet spot for most images — excellent visual quality with 60-80% 
              size reduction vs original.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: Compare CDN-based vs build-time image optimization.</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              <strong>CDN-based (Cloudinary, Imgix):</strong>
            </p>
            <ul className="space-y-1">
              <li>• Low setup complexity (URL parameters)</li>
              <li>• On-the-fly transformations (resize, format, crop)</li>
              <li>• Pay per transformation/GB served</li>
              <li>• Best for: Dynamic content, UGC, frequent updates</li>
            </ul>
            <p className="mb-3 mt-3">
              <strong>Build-time (Sharp, next/image):</strong>
            </p>
            <ul className="space-y-1">
              <li>• Medium setup (build pipeline integration)</li>
              <li>• Pre-generated variants only</li>
              <li>• Pay only for storage and build time</li>
              <li>• Best for: Static content, predictable images</li>
            </ul>
            <p className="mt-3">
              For most projects, I recommend CDN for user-generated content and build-time for 
              static marketing content.
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
              href="https://web.dev/fast/#optimize-your-images" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              web.dev — Optimize Your Images
            </a>
            <p className="text-sm text-muted mt-1">
              Google&apos;s comprehensive guide to image optimization techniques.
            </p>
          </li>
          <li>
            <a 
              href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              MDN — Responsive Images
            </a>
            <p className="text-sm text-muted mt-1">
              Complete guide to srcset, sizes, and picture element.
            </p>
          </li>
          <li>
            <a 
              href="https://nextjs.org/docs/app/api-reference/components/image" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Next.js — Image Component
            </a>
            <p className="text-sm text-muted mt-1">
              Next.js built-in image optimization component documentation.
            </p>
          </li>
          <li>
            <a 
              href="https://caniuse.com/webp" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Can I Use — WebP Support
            </a>
            <p className="text-sm text-muted mt-1">
              Browser support tables for WebP, AVIF, and other image formats.
            </p>
          </li>
          <li>
            <a 
              href="https://www.smashingmagazine.com/2021/06/modern-image-formats/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Smashing Magazine — Modern Image Formats
            </a>
            <p className="text-sm text-muted mt-1">
              Comparison of AVIF, WebP, JPEG XL, and other modern formats.
            </p>
          </li>
          <li>
            <a 
              href="https://images.guide/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              images.guide
            </a>
            <p className="text-sm text-muted mt-1">
              Practical image optimization techniques and tools.
            </p>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
