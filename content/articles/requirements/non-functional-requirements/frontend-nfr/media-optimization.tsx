"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-nfr-media-optimization",
  title: "Media Optimization",
  description:
    "Comprehensive guide to optimizing images, video, and audio for web performance. Covers modern formats, responsive media, lazy loading, video codecs, and CDN delivery.",
  category: "frontend",
  subcategory: "nfr",
  slug: "media-optimization",
  version: "extensive",
  wordCount: 12000,
  readingTime: 48,
  lastUpdated: "2026-03-15",
  tags: [
    "frontend",
    "nfr",
    "performance",
    "images",
    "video",
    "optimization",
    "webp",
    "avif",
    "codecs",
  ],
  relatedTopics: ["page-load-performance", "lazy-loading", "cdn-caching"],
};

export default function MediaOptimizationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Media Optimization</strong> encompasses techniques for
          reducing the size and improving the delivery of images, video, and
          audio without perceptibly degrading quality. Media assets often
          account for 60-80% of total page weight, making optimization critical
          for performance.
        </p>
        <p>
          The impact is measurable: every 100KB reduction in image size improves
          load time by ~400ms on 3G. E-commerce sites see 1% conversion increase
          per 100ms improvement. Media optimization directly affects Core Web
          Vitals, particularly LCP (Largest Contentful Paint), which is often an
          image.
        </p>
        <p>Optimization happens at multiple levels:</p>
        <ul>
          <li>
            <strong>Format selection:</strong> Choosing efficient codecs (AVIF,
            WebP, JPEG)
          </li>
          <li>
            <strong>Compression:</strong> Reducing file size through
            lossy/lossless techniques
          </li>
          <li>
            <strong>Responsive delivery:</strong> Serving appropriate sizes for
            each device
          </li>
          <li>
            <strong>Lazy loading:</strong> Deferring off-screen media
          </li>
          <li>
            <strong>CDN delivery:</strong> Edge-cached, optimized delivery
          </li>
        </ul>
      </section>

      <section>
        <h2>Image Formats Comparison</h2>
        <p>
          Choosing the right format is the highest-impact optimization decision.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/media-formats-comparison.svg"
          alt="Image Formats Comparison"
          caption="Comparison of JPEG, WebP, AVIF, and PNG — showing compression efficiency, quality, and browser support trade-offs"
        />

        <h3 className="mt-8 mb-4 text-xl font-semibold">Modern Formats</h3>
        <ul className="space-y-3">
          <li>
            <strong>AVIF:</strong> Best compression (50% smaller than JPEG),
            supports HDR, wide color gamut. Slower encoding, limited editing
            tool support. Browser support: 85%+.
          </li>
          <li>
            <strong>WebP:</strong> Good compression (25-35% smaller than JPEG),
            fast encoding/decoding. Universal browser support. Best balance of
            size and compatibility.
          </li>
          <li>
            <strong>HEIC/HEIF:</strong> Excellent compression, Apple ecosystem.
            Poor web support.
          </li>
        </ul>

        <h3 className="mt-8 mb-4 text-xl font-semibold">Legacy Formats</h3>
        <ul className="space-y-3">
          <li>
            <strong>JPEG:</strong> Universal support, good for photos. Larger
            files than modern formats.
          </li>
          <li>
            <strong>PNG:</strong> Lossless, supports transparency. Large files,
            use only when necessary.
          </li>
          <li>
            <strong>GIF:</strong> Animation support. Extremely inefficient.
            Replace with video or APNG.
          </li>
          <li>
            <strong>SVG:</strong> Vector graphics. Perfect for icons, logos,
            diagrams.
          </li>
        </ul>

        <div className="my-6 rounded-lg border border-accent/30 bg-accent/10 p-6">
          <h3 className="mb-3 font-semibold">Format Selection Guide</h3>
          <ul className="space-y-2">
            <li>Photos: AVIF with WebP/JPEG fallback</li>
            <li>Screenshots: WebP or PNG</li>
            <li>Graphics with transparency: WebP or PNG</li>
            <li>Icons/logos: SVG</li>
            <li>Animations: Video (MP4/WebM) or Lottie</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Responsive Images</h2>
        <p>
          Serve different image sizes based on device capabilities and viewport.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">srcset Attribute</h3>
        <p>Provide multiple resolutions and let the browser choose the optimal one. Specify image sources with width descriptors (400w, 800w, 1200w) and use sizes attribute to tell the browser which size to use at different viewport widths.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">picture Element</h3>
        <p>Use the picture element for art direction and format switching. Specify multiple source elements with different types (avif, webp) and the browser will use the first format it supports. Always include a fallback img element.</p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/media-responsive-images.svg"
          alt="Responsive Images Diagram"
          caption="Responsive image delivery — serving different sizes and formats based on device viewport and capabilities"
        />
      </section>

      <section>
        <h2>Lazy Loading</h2>
        <p>Defer loading images until they're near the viewport.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Native Lazy Loading</h3>
        <p>Use the loading="lazy" attribute on img elements. Browser support is 85%+. This is simple and requires no JavaScript.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Intersection Observer</h3>
        <p>For more control (blur-up, fade-in, placeholders), use Intersection Observer API. Load low-quality placeholder first, observe when element enters viewport, load full image, and fade in when loaded.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Progressive Image Loading
        </h3>
        <p>Techniques for perceived performance:</p>
        <ul className="space-y-2">
          <li>
            <strong>Blur-up:</strong> Tiny blurred image → full image
          </li>
          <li>
            <strong>LQIP:</strong> Low Quality Image Placeholders
          </li>
          <li>
            <strong>SVG placeholders:</strong> Colored SVG matching aspect ratio
          </li>
          <li>
            <strong>Skeleton screens:</strong> Gray box matching dimensions
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/media-lazy-loading.svg"
          alt="Lazy Loading Techniques"
          caption="Lazy loading patterns — native loading, Intersection Observer, and progressive image loading with blur-up effect"
        />
      </section>

      <section>
        <h2>Video Optimization</h2>
        <p>Video is the largest media type — optimization is critical.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Format Selection</h3>
        <ul className="space-y-2">
          <li>
            <strong>MP4 (H.264):</strong> Universal support, good compression
          </li>
          <li>
            <strong>WebM (VP9):</strong> Better compression, open format
          </li>
          <li>
            <strong>AV1:</strong> Best compression, emerging support
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Optimization Techniques
        </h3>
        <ul className="space-y-2">
          <li>Use multiple resolutions (360p, 720p, 1080p)</li>
          <li>Implement adaptive bitrate streaming (HLS, DASH)</li>
          <li>Lazy-load videos (don&apos;t autoplay off-screen)</li>
          <li>Use poster images for preview</li>
          <li>Consider GIF alternatives (short looping video)</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Video Codec Comparison
        </h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Codec</th>
              <th className="p-3 text-left">Compression</th>
              <th className="p-3 text-left">Quality</th>
              <th className="p-3 text-left">Browser Support</th>
              <th className="p-3 text-left">Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">
                <strong>H.264 (AVC)</strong>
              </td>
              <td className="p-3">Good</td>
              <td className="p-3">High</td>
              <td className="p-3">98%+ (universal)</td>
              <td className="p-3">Maximum compatibility, iOS Safari</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>H.265 (HEVC)</strong>
              </td>
              <td className="p-3">Very Good (50% better than H.264)</td>
              <td className="p-3">Very High</td>
              <td className="p-3">80% (Safari, Edge, no Chrome/Firefox)</td>
              <td className="p-3">4K/HDR content, Apple ecosystem</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>VP9</strong>
              </td>
              <td className="p-3">Very Good (similar to HEVC)</td>
              <td className="p-3">High</td>
              <td className="p-3">90%+ (Chrome, Firefox, Edge)</td>
              <td className="p-3">YouTube, Android, web delivery</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>AV1</strong>
              </td>
              <td className="p-3">Excellent (30% better than VP9)</td>
              <td className="p-3">Very High</td>
              <td className="p-3">85%+ (modern browsers, 2024+)</td>
              <td className="p-3">Next-gen web video, bandwidth-constrained</td>
            </tr>
            <tr>
              <td className="p-3">
                <strong>AVIF (for animated)</strong>
              </td>
              <td className="p-3">Excellent</td>
              <td className="p-3">High</td>
              <td className="p-3">80%+ (2024+ browsers)</td>
              <td className="p-3">GIF replacement, short loops</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-sm text-muted">
          Note: For maximum compatibility, serve MP4 (H.264) as fallback with
          WebM (VP9) or MP4 (AV1/HEVC) as primary sources using the video
          element with multiple source tags.
        </p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">
          Autoplay Considerations
        </h3>
        <ul className="space-y-2">
          <li>Mute required for autoplay in most browsers</li>
          <li>
            Use <code>playsInline</code> for mobile
          </li>
          <li>Provide pause controls</li>
          <li>Consider data usage implications</li>
        </ul>
      </section>

      <section>
        <h2>CDN & Image Services</h2>
        <p>Image CDNs handle optimization automatically.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibold">Popular Services</h3>
        <ul className="space-y-2">
          <li>
            <strong>Cloudinary:</strong> Full-featured, AI-powered optimization
          </li>
          <li>
            <strong>Imgix:</strong> Real-time processing, excellent API
          </li>
          <li>
            <strong>Cloudflare Images:</strong> Integrated with Cloudflare CDN
          </li>
          <li>
            <strong>AWS CloudFront + Lambda@Edge:</strong> Custom optimization
            at edge
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibold">URL Parameters</h3>
        <p>
          Most services support on-the-fly optimization via URL parameters.
          Example:
          <code>
            cdn.example.com/image.jpg?w=800&amp;h=600&amp;fit=crop&amp;fmt=webp&amp;q=80
          </code>
          resizes to 800×600, crops to fit, converts to WebP, and sets quality
          to 80%.
        </p>

        <ArticleImage
          src="/diagrams/requirements/nfr/frontend-nfr/media-cdn-delivery.svg"
          alt="CDN Image Delivery"
          caption="CDN-based image delivery — automatic format selection, resizing, compression, and edge caching"
        />
      </section>

      <section>
        <h2>Performance Metrics</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Optimization</th>
              <th className="p-3 text-left">Impact</th>
              <th className="p-3 text-left">Effort</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3">Format upgrade (JPEG→WebP)</td>
              <td className="p-3">25-35% size reduction</td>
              <td className="p-3">Low</td>
            </tr>
            <tr>
              <td className="p-3">Responsive images</td>
              <td className="p-3">50-70% mobile savings</td>
              <td className="p-3">Medium</td>
            </tr>
            <tr>
              <td className="p-3">Lazy loading</td>
              <td className="p-3">30-50% initial load</td>
              <td className="p-3">Low</td>
            </tr>
            <tr>
              <td className="p-3">CDN delivery</td>
              <td className="p-3">20-40% faster globally</td>
              <td className="p-3">Low</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Interview Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the best image format for web?
            </p>
            <p className="mt-2 text-sm">
              A: AVIF for best compression (50% smaller than JPEG), with WebP
              fallback for compatibility. Use the picture element to serve AVIF
              to supporting browsers, WebP to others. For photos, never use PNG
              unless you need lossless.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you implement responsive images?
            </p>
            <p className="mt-2 text-sm">
              A: Use srcset for resolution switching (same image, different
              sizes) and picture for art direction or format switching. Combine
              both: picture with multiple sources, each having srcset for
              resolutions. Always include a fallback img tag.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What&apos;s the LCP impact of image optimization?
            </p>
            <p className="mt-2 text-sm">
              A: LCP is often the hero image. Optimize it aggressively: use
              modern formats, preload the LCP image, don&apos;t lazy-load it,
              serve appropriately sized version. These changes can improve LCP
              from 4s to under 2.5s.
            </p>
          </div>
        </div>
      </section>
    </ArticleLayout>
  );
}
