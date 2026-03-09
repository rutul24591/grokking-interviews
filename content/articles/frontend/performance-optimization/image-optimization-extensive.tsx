"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-image-optimization-extensive",
  title: "Image Optimization (WebP, AVIF, responsive images, srcset)",
  description: "Comprehensive guide to image optimization including modern formats, responsive strategies, CDN delivery, and build-time pipelines.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "image-optimization",
  version: "extensive",
  wordCount: 11200,
  readingTime: 45,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "images", "WebP", "AVIF", "responsive", "srcset"],
  relatedTopics: ["lazy-loading", "critical-css", "above-the-fold-optimization"],
};

export default function ImageOptimizationExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Image optimization</strong> encompasses all techniques used to reduce the size and delivery cost
          of images on the web while maintaining acceptable visual quality. Images are the single largest contributor
          to page weight — according to the HTTP Archive, they account for approximately 50% of total transfer size
          on the median web page, with the 90th percentile page loading over 5MB of images alone.
        </p>
        <p>
          The web has undergone a format revolution in recent years. JPEG, the dominant photo format since 1992,
          is being supplanted by WebP (30% smaller, released by Google in 2010, now at 97% browser support) and
          AVIF (50% smaller, derived from the AV1 video codec, at ~92% browser support). Meanwhile, responsive
          images via <code>srcset</code> and <code>sizes</code> solve the problem of serving appropriately-sized
          images across the spectrum from 320px mobile screens to 5K Retina displays.
        </p>
        <p>
          Image optimization directly impacts Core Web Vitals: the Largest Contentful Paint (LCP) element is an
          image on over 70% of pages, and improperly handled images cause Cumulative Layout Shift (CLS) through
          missing dimensions. For e-commerce, every 100ms reduction in LCP correlates with measurable improvements
          in conversion rates.
        </p>
      </section>

      <section>
        <h2>Image Format Deep Dive</h2>

        <MermaidDiagram
          chart={`flowchart TD
    A[Original Image] --> B{What type?}
    B -->|Photo/Complex| C{Browser supports AVIF?}
    B -->|Simple graphic/icon| D{Scalable?}
    B -->|Needs transparency| E{Photo-like?}

    C -->|Yes| F[AVIF<br/>Quality 60-75<br/>Best compression]
    C -->|No| G{Browser supports WebP?}
    G -->|Yes| H[WebP<br/>Quality 75-80<br/>Great compression]
    G -->|No| I[JPEG<br/>Quality 75-85<br/>Universal fallback]

    D -->|Yes| J[SVG<br/>Infinite scaling<br/>CSS stylable]
    D -->|No| K[WebP/PNG<br/>Lossless mode]

    E -->|Yes| L[WebP/AVIF<br/>with alpha channel]
    E -->|No| M[PNG<br/>Lossless transparency]`}
          caption="Image format decision tree — choose the optimal format based on content type and browser support"
        />

        <h3 className="mt-6 font-semibold">JPEG (Joint Photographic Experts Group)</h3>
        <p>
          The workhorse of web photography since 1992. Uses lossy DCT-based compression. Quality scale is 0-100,
          with 75-85 being the sweet spot for web delivery (imperceptible quality loss at 40-60% file reduction).
        </p>
        <ul className="space-y-2">
          <li><strong>Pros:</strong> Universal support, excellent for photos, well-understood tooling</li>
          <li><strong>Cons:</strong> No transparency, no animation, lossy only, larger files than modern formats</li>
          <li><strong>Progressive JPEG:</strong> Loads in multiple passes (blurry → sharp) rather than top-to-bottom. Better perceived performance. Enable with <code>progressive: true</code> in sharp/imagemin.</li>
        </ul>

        <h3 className="mt-6 font-semibold">WebP</h3>
        <p>
          Developed by Google, based on the VP8 video codec. Supports lossy and lossless compression, transparency,
          and animation. At 97% browser support, WebP is the practical default for production use.
        </p>
        <ul className="space-y-2">
          <li><strong>Lossy WebP:</strong> 25-35% smaller than JPEG at equivalent visual quality</li>
          <li><strong>Lossless WebP:</strong> 26% smaller than PNG on average</li>
          <li><strong>Transparency:</strong> Supports alpha channel with lossy compression (unlike PNG which requires lossless)</li>
          <li><strong>Animation:</strong> Replaces animated GIFs with 50-90% file size reduction</li>
        </ul>

        <h3 className="mt-6 font-semibold">AVIF (AV1 Image File Format)</h3>
        <p>
          Derived from the AV1 video codec (developed by the Alliance for Open Media — Google, Netflix, Amazon,
          Mozilla). The most efficient image format available, offering 40-50% size reduction over JPEG.
        </p>
        <ul className="space-y-2">
          <li><strong>Compression:</strong> 40-50% smaller than JPEG, 20% smaller than WebP</li>
          <li><strong>Features:</strong> HDR, wide color gamut, transparency, animation</li>
          <li><strong>Encoding speed:</strong> Slower to encode than WebP/JPEG — important for build times and on-the-fly conversion</li>
          <li><strong>Browser support:</strong> ~92% (Chrome 85+, Firefox 93+, Safari 16.4+). Missing in older Safari and IE.</li>
          <li><strong>Quality settings:</strong> AVIF quality values are different from JPEG. Quality 60-75 in AVIF ≈ Quality 80-90 in JPEG visually.</li>
        </ul>

        <h3 className="mt-6 font-semibold">Format Comparison</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-left">JPEG</th>
              <th className="p-3 text-left">PNG</th>
              <th className="p-3 text-left">WebP</th>
              <th className="p-3 text-left">AVIF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Compression</strong></td>
              <td className="p-3">Lossy</td>
              <td className="p-3">Lossless</td>
              <td className="p-3">Both</td>
              <td className="p-3">Both</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Transparency</strong></td>
              <td className="p-3">No</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Yes</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Animation</strong></td>
              <td className="p-3">No</td>
              <td className="p-3">APNG</td>
              <td className="p-3">Yes</td>
              <td className="p-3">Yes</td>
            </tr>
            <tr>
              <td className="p-3"><strong>HDR</strong></td>
              <td className="p-3">No</td>
              <td className="p-3">No</td>
              <td className="p-3">No</td>
              <td className="p-3">Yes</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Browser Support</strong></td>
              <td className="p-3">100%</td>
              <td className="p-3">100%</td>
              <td className="p-3">~97%</td>
              <td className="p-3">~92%</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Encode Speed</strong></td>
              <td className="p-3">Fast</td>
              <td className="p-3">Fast</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Slow</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Typical Size (800px photo)</strong></td>
              <td className="p-3">120 KB</td>
              <td className="p-3">400 KB</td>
              <td className="p-3">85 KB</td>
              <td className="p-3">60 KB</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Format Negotiation with {'<picture>'}</h2>
        <p>
          The <code>{'<picture>'}</code> element enables serving different formats and sizes based on browser
          capabilities and viewport conditions. The browser evaluates sources top-to-bottom and uses the first
          match.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Full format + responsive negotiation -->
<picture>
  <!-- AVIF: best compression, for supporting browsers -->
  <source
    type="image/avif"
    srcSet="
      /images/hero-400.avif 400w,
      /images/hero-800.avif 800w,
      /images/hero-1200.avif 1200w,
      /images/hero-1600.avif 1600w
    "
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
  />

  <!-- WebP: great compression, wider support -->
  <source
    type="image/webp"
    srcSet="
      /images/hero-400.webp 400w,
      /images/hero-800.webp 800w,
      /images/hero-1200.webp 1200w,
      /images/hero-1600.webp 1600w
    "
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
  />

  <!-- JPEG fallback -->
  <img
    src="/images/hero-800.jpg"
    srcSet="
      /images/hero-400.jpg 400w,
      /images/hero-800.jpg 800w,
      /images/hero-1200.jpg 1200w,
      /images/hero-1600.jpg 1600w
    "
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
    alt="Hero banner showcasing product"
    width={1600}
    height={900}
    loading="eager"
    fetchPriority="high"
    decoding="async"
  />
</picture>

<!-- Art direction: different crops for different viewports -->
<picture>
  <source media="(max-width: 640px)" srcSet="/images/hero-mobile.webp" />
  <source media="(max-width: 1024px)" srcSet="/images/hero-tablet.webp" />
  <img src="/images/hero-desktop.webp" alt="Hero" width={1600} height={900} />
</picture>`}</code>
        </pre>
      </section>

      <section>
        <h2>Responsive Images with srcset and sizes</h2>

        <MermaidDiagram
          chart={`sequenceDiagram
    participant B as Browser
    participant D as Decision Engine

    Note over B: Parse HTML, find <img srcset sizes>
    B->>D: Viewport width: 375px
    B->>D: Device pixel ratio: 2x
    B->>D: sizes: "(max-width: 640px) 100vw, 50vw"

    D->>D: Match media query: 375px < 640px → 100vw
    D->>D: Display width = 375px
    D->>D: Effective width = 375 × 2 = 750px

    D->>D: Available: 400w, 800w, 1200w, 1600w
    D->>D: Smallest >= 750px → 800w

    D->>B: Fetch image-800.webp
    Note over B: Only downloads 800px variant<br/>not the 1600px desktop version`}
          caption="How the browser selects the right image from srcset — based on viewport, DPR, and sizes"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Understanding the 'sizes' attribute ===

// sizes tells the browser how wide the image will be displayed
// BEFORE it downloads any image. This is critical because the
// browser makes the srcset decision during HTML parsing, before
// CSS is loaded.

<img
  srcSet="
    /photo-400.webp 400w,
    /photo-800.webp 800w,
    /photo-1200.webp 1200w,
    /photo-1600.webp 1600w,
    /photo-2000.webp 2000w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  src="/photo-800.webp"
  alt="Photo"
  width={800}
  height={600}
/>

// Translation of sizes:
// Mobile (≤640px):  Image fills 100% of viewport width
// Tablet (≤1024px): Image fills 50% of viewport width
// Desktop (>1024px): Image fills 33% of viewport width

// === DPR-based srcset (for fixed-size images) ===

// Use 'x' descriptors for images that are always the same CSS size
// (avatars, thumbnails, logos)
<img
  src="/avatar-48.webp"
  srcSet="
    /avatar-48.webp 1x,
    /avatar-96.webp 2x,
    /avatar-144.webp 3x
  "
  alt="User avatar"
  width={48}
  height={48}
/>
// 1x display: 48px image (standard screens)
// 2x display: 96px image (Retina/HiDPI)
// 3x display: 144px image (iPhone Pro, etc.)

// === Choosing breakpoints ===
// Don't match CSS breakpoints — match actual image display sizes
// The goal is ~20KB between each step for photos

// Common widths: 400, 800, 1200, 1600, 2000
// This covers:
// - 400: Mobile 1x
// - 800: Mobile 2x, Tablet 1x
// - 1200: Tablet 2x, Desktop 1x
// - 1600: Desktop 2x
// - 2000: Large desktop 2x`}</code>
        </pre>
      </section>

      <section>
        <h2>Build-Time Optimization Pipeline</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Complete image optimization pipeline with sharp ===
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

const WIDTHS = [400, 800, 1200, 1600, 2000];
const FORMATS = [
  { name: 'avif', options: { quality: 65, effort: 4 } },
  { name: 'webp', options: { quality: 75 } },
  { name: 'jpeg', options: { quality: 80, progressive: true } },
];

async function optimizeImage(inputPath, outputDir) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const results = { variants: [], placeholder: '' };

  // Get original dimensions
  const metadata = await sharp(inputPath).metadata();

  for (const width of WIDTHS) {
    // Skip widths larger than the original
    if (width > metadata.width) continue;

    for (const format of FORMATS) {
      const outputName = \`\${filename}-\${width}.\${format.name}\`;
      const outputPath = path.join(outputDir, outputName);

      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .toFormat(format.name, format.options)
        .toFile(outputPath);

      const stats = await fs.stat(outputPath);
      results.variants.push({
        path: outputName,
        width,
        format: format.name,
        size: stats.size,
      });
    }
  }

  // Generate blur placeholder (20px wide, base64)
  const placeholderBuffer = await sharp(inputPath)
    .resize(20)
    .blur(10)
    .jpeg({ quality: 30 })
    .toBuffer();

  results.placeholder = \`data:image/jpeg;base64,\${placeholderBuffer.toString('base64')}\`;

  // Generate dominant color
  const { dominant } = await sharp(inputPath).stats();
  results.dominantColor = \`rgb(\${dominant.r},\${dominant.g},\${dominant.b})\`;

  return results;
}

// === Usage in build script ===
async function processAllImages() {
  const inputDir = './src/images';
  const outputDir = './public/optimized';

  await fs.mkdir(outputDir, { recursive: true });

  const files = await fs.readdir(inputDir);
  const imageFiles = files.filter(f =>
    /\\.(jpg|jpeg|png|tiff)$/i.test(f)
  );

  const manifest = {};

  for (const file of imageFiles) {
    console.log(\`Optimizing: \${file}\`);
    manifest[file] = await optimizeImage(
      path.join(inputDir, file),
      outputDir,
    );
  }

  // Write manifest for use in components
  await fs.writeFile(
    './src/image-manifest.json',
    JSON.stringify(manifest, null, 2),
  );
}

processAllImages();`}</code>
        </pre>
      </section>

      <section>
        <h2>Next.js Image Optimization</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Next.js Image handles all optimization automatically:
// - Format: Serves AVIF/WebP based on Accept header
// - Resize: On-demand resizing via /_next/image endpoint
// - Cache: Optimized images cached on disk and CDN
// - Lazy: loading="lazy" by default
// - Blur: placeholder="blur" with auto-generated blurDataURL

import Image from 'next/image';

// === Static imports (best DX) ===
import heroImage from '../public/hero.jpg';

<Image
  src={heroImage}              // Static import provides dimensions automatically
  alt="Hero banner"
  placeholder="blur"           // Auto-generated blur placeholder
  priority                     // Above-fold: preload + eager
  sizes="100vw"
/>

// === Dynamic/remote images ===
<Image
  src="https://cdn.example.com/photos/product-123.jpg"
  alt="Product"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  placeholder="blur"
  blurDataURL={product.blurHash}  // Provide your own blur hash
/>

// === next.config.js image configuration ===
const nextConfig = {
  images: {
    // Allowed remote image domains
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.example.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
    ],

    // Output formats (ordered by preference)
    formats: ['image/avif', 'image/webp'],

    // Device widths for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image widths for layout="responsive" or fill
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache TTL for optimized images (seconds)
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};`}</code>
        </pre>
      </section>

      <section>
        <h2>CDN Image Services</h2>
        <p>
          Cloud image services handle optimization on the fly — resize, format-convert, and compress images via
          URL parameters. No build pipeline needed, and they handle caching at the edge.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Cloudinary ===
// Original: https://res.cloudinary.com/demo/image/upload/sample.jpg
// Optimized: width 800, auto format, auto quality
const cloudinaryUrl = \`https://res.cloudinary.com/\${cloudName}/image/upload/
  w_800,f_auto,q_auto/\${imageId}.jpg\`;

// React component with Cloudinary
function CloudinaryImage({ publicId, alt, width, height }) {
  const baseUrl = \`https://res.cloudinary.com/\${CLOUD_NAME}/image/upload\`;

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={\`
          \${baseUrl}/w_400,f_avif,q_auto/\${publicId} 400w,
          \${baseUrl}/w_800,f_avif,q_auto/\${publicId} 800w,
          \${baseUrl}/w_1200,f_avif,q_auto/\${publicId} 1200w
        \`}
        sizes="(max-width: 640px) 100vw, 50vw"
      />
      <source
        type="image/webp"
        srcSet={\`
          \${baseUrl}/w_400,f_webp,q_auto/\${publicId} 400w,
          \${baseUrl}/w_800,f_webp,q_auto/\${publicId} 800w,
          \${baseUrl}/w_1200,f_webp,q_auto/\${publicId} 1200w
        \`}
        sizes="(max-width: 640px) 100vw, 50vw"
      />
      <img
        src={\`\${baseUrl}/w_800,f_jpg,q_80/\${publicId}\`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
      />
    </picture>
  );
}

// === Cloudflare Image Resizing ===
// Transforms at the CDN edge via URL path
// /cdn-cgi/image/width=800,format=auto,quality=75/original.jpg

// === Imgix ===
// https://your-source.imgix.net/image.jpg?w=800&auto=format,compress&q=75`}</code>
        </pre>
      </section>

      <section>
        <h2>Placeholder Strategies</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === 1. Blur-up (LQIP — Low Quality Image Placeholder) ===
// Generate a tiny (20px) blurred version as base64
// Inline it in HTML, then fade in the full image

function BlurUpImage({ src, placeholder, alt, width, height }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', width, height }}>
      {/* Tiny placeholder — inlined, no HTTP request */}
      <img
        src={placeholder}  // "data:image/jpeg;base64,/9j/4AAQ..."
        alt=""
        aria-hidden
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: loaded ? 'blur(0)' : 'blur(20px)',
          transition: 'filter 0.5s',
          transform: 'scale(1.1)', // Hide blur edges
        }}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          position: 'absolute',
          inset: 0,
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s',
        }}
      />
    </div>
  );
}

// === 2. Dominant Color ===
// Extract the most prominent color and use as background
function DominantColorPlaceholder({ src, color, alt, width, height }) {
  return (
    <div style={{ backgroundColor: color, width, height }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

// === 3. BlurHash (Wolt's algorithm) ===
// Compact string representation of a blurred image
// "LEHV6nWB2yk8pyo0adR*.7kCMdnj" → renders a blur
// Use: blurhash npm package to decode into canvas

// === 4. CSS Skeleton ===
// Animated gradient placeholder
function SkeletonImage({ width, height }) {
  return (
    <div
      className="animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
      style={{ width, height, backgroundSize: '200% 100%' }}
    />
  );
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Performance Impact & Metrics</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Optimization</th>
              <th className="p-3 text-left">Typical Size Reduction</th>
              <th className="p-3 text-left">Metric Impacted</th>
              <th className="p-3 text-left">Implementation Effort</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>JPEG → WebP</strong></td>
              <td className="p-3">25-35%</td>
              <td className="p-3">LCP, Transfer Size</td>
              <td className="p-3">Low (build tool or CDN)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>JPEG → AVIF</strong></td>
              <td className="p-3">40-50%</td>
              <td className="p-3">LCP, Transfer Size</td>
              <td className="p-3">Low (build tool or CDN)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Responsive srcset</strong></td>
              <td className="p-3">50-80% on mobile</td>
              <td className="p-3">LCP, FCP, Bandwidth</td>
              <td className="p-3">Medium (requires sizes attr)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Lazy loading</strong></td>
              <td className="p-3">60-90% initial transfer</td>
              <td className="p-3">FCP, TTI, Bandwidth</td>
              <td className="p-3">Low (loading="lazy")</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Quality optimization (80→75)</strong></td>
              <td className="p-3">15-25%</td>
              <td className="p-3">Transfer Size</td>
              <td className="p-3">Low</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Proper dimensions</strong></td>
              <td className="p-3">N/A</td>
              <td className="p-3">CLS</td>
              <td className="p-3">Low</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Blur placeholders</strong></td>
              <td className="p-3">N/A</td>
              <td className="p-3">Perceived performance, CLS</td>
              <td className="p-3">Medium</td>
            </tr>
            <tr>
              <td className="p-3"><strong>GIF → WebP/AVIF animation</strong></td>
              <td className="p-3">50-90%</td>
              <td className="p-3">Transfer Size, LCP</td>
              <td className="p-3">Low</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Serving original uploads without processing:</strong> User-uploaded images are often 5-15MB
            JPEGs straight from a camera. Always process uploads through an optimization pipeline before storing
            or serving. Run sharp or an image service on upload, not on request.
          </li>
          <li>
            <strong>Lazy-loading the LCP image:</strong> This is the most impactful single mistake. If your hero
            image has <code>loading="lazy"</code>, the browser defers loading it until layout — adding 1-3 seconds
            to LCP. Use <code>priority</code> (Next.js) or <code>fetchPriority="high"</code> + <code>loading="eager"</code>.
          </li>
          <li>
            <strong>Missing width and height:</strong> Images without explicit dimensions cause layout shifts as they
            load, hurting CLS. Always provide <code>width</code> and <code>height</code> attributes, or use CSS
            <code>aspect-ratio</code>. The browser reserves space before download.
          </li>
          <li>
            <strong>Missing sizes attribute:</strong> Without <code>sizes</code>, the browser assumes <code>100vw</code>
            and downloads the largest srcset variant — negating the entire point of responsive images. Always pair
            <code>srcset</code> with <code>sizes</code>.
          </li>
          <li>
            <strong>Over-compressing:</strong> Quality below 50 for JPEG/WebP creates visible blocking artifacts.
            For user-facing photos, stay at 65+ for AVIF, 75+ for WebP, 75+ for JPEG. Use squoosh.app to
            visually compare quality settings.
          </li>
          <li>
            <strong>Using PNG for photos:</strong> PNG is lossless and 2-5x larger than JPEG/WebP for photographic
            content. Reserve PNG for screenshots, diagrams, and images requiring lossless transparency.
          </li>
          <li>
            <strong>Animated GIFs:</strong> A 10-second GIF can easily be 5-20MB. Convert to WebP animation
            (50-70% smaller) or use HTML5 video (<code>{'<video autoplay muted loop>'}</code>) which is 80-95%
            smaller than GIF.
          </li>
          <li>
            <strong>Not using CDN:</strong> Serving images from the same origin as your app means every request
            goes to your server. CDN image services serve from edge locations globally, reducing latency by
            100-500ms per image.
          </li>
          <li>
            <strong>Too many srcset breakpoints:</strong> More than 5-6 widths adds HTML bloat without meaningful
            savings. Each step should represent a ~20KB difference for the optimization to matter.
          </li>
        </ul>
      </section>

      <section>
        <h2>Advanced: SVG Optimization</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === SVGO — Optimize SVG files ===
// Install: pnpm add -D svgo
// Removes metadata, comments, hidden elements, unnecessary attributes

// svgo.config.js
module.exports = {
  multipass: true,
  plugins: [
    'preset-default',
    'removeDimensions',  // Use viewBox instead of width/height
    {
      name: 'removeAttrs',
      params: { attrs: ['data-name', 'class'] },
    },
  ],
};

// Result: 50-90% SVG size reduction typical

// === Inline small SVGs (< 1KB) to avoid HTTP requests ===
function Icon({ name }) {
  const icons = {
    close: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    ),
  };

  return <span className="w-6 h-6 inline-block">{icons[name]}</span>;
}

// === Use SVG sprites for many icons ===
// Combine icons into one file, reference by id
<svg style={{ display: 'none' }}>
  <symbol id="icon-close" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </symbol>
  <symbol id="icon-menu" viewBox="0 0 24 24">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </symbol>
</svg>

// Usage — one HTTP request for all icons
<svg className="w-6 h-6"><use href="#icon-close" /></svg>`}</code>
        </pre>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Serve modern formats:</strong> Use AVIF → WebP → JPEG fallback chain via <code>{'<picture>'}</code>
            or framework components. AVIF alone saves 40-50% over JPEG.
          </li>
          <li>
            <strong>Use responsive images:</strong> Always pair <code>srcset</code> with <code>sizes</code>.
            Generate 4-5 width variants (400, 800, 1200, 1600, 2000).
          </li>
          <li>
            <strong>Optimize compression:</strong> Quality 65-75 for AVIF, 75-80 for WebP, 75-85 for JPEG.
            Use progressive JPEG for the fallback.
          </li>
          <li>
            <strong>Lazy load below-fold images:</strong> <code>loading="lazy"</code> for everything below the
            fold. <code>fetchPriority="high"</code> + <code>loading="eager"</code> for LCP.
          </li>
          <li>
            <strong>Always set dimensions:</strong> Explicit <code>width</code>/<code>height</code> or CSS
            <code>aspect-ratio</code> prevents CLS.
          </li>
          <li>
            <strong>Use blur placeholders:</strong> LQIP or BlurHash for progressive loading. Match final
            dimensions exactly.
          </li>
          <li>
            <strong>Process uploads:</strong> Never serve raw user uploads. Optimize on upload, not on request.
          </li>
          <li>
            <strong>Use CDN image services:</strong> Cloudinary, Imgix, or Cloudflare Images for on-the-fly
            optimization. Eliminates build-time pipeline complexity.
          </li>
          <li>
            <strong>Prefer SVG for icons/logos:</strong> Optimize with SVGO. Inline small SVGs, use sprites
            for icon sets.
          </li>
          <li>
            <strong>Replace GIFs with video:</strong> <code>{'<video autoplay muted loop playsinline>'}</code> is
            80-95% smaller than GIF for the same content.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Images are 50-70% of page weight. The three optimization pillars are <strong>format</strong> (AVIF/WebP),
            <strong>size</strong> (responsive srcset), and <strong>delivery</strong> (lazy load, CDN, caching).
          </li>
          <li>
            AVIF offers 40-50% compression over JPEG; WebP offers 25-35%. Use <code>{'<picture>'}</code> with
            AVIF → WebP → JPEG fallback for maximum savings with universal support.
          </li>
          <li>
            <code>srcset</code> with <code>sizes</code> lets the browser choose the optimal resolution based on
            viewport width and device pixel ratio — preventing mobile users from downloading desktop images.
          </li>
          <li>
            The LCP element is an image on 70%+ of pages. It must load eagerly with <code>fetchPriority="high"</code>.
            Lazy-loading LCP images is the single most damaging image performance mistake.
          </li>
          <li>
            CDN image services (Cloudinary, Imgix) transform images on-the-fly via URL parameters — format
            conversion, resizing, and quality optimization without a build pipeline.
          </li>
          <li>
            Next.js Image component automates format negotiation, responsive sizing, lazy loading, and blur
            placeholders — representing the state-of-the-art in framework-level image optimization.
          </li>
          <li>
            Always set explicit dimensions to prevent CLS, and use blur/LQIP placeholders for progressive
            loading that maintains visual stability.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://web.dev/choose-the-right-image-format/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Choose the Right Image Format
            </a>
          </li>
          <li>
            <a href="https://web.dev/responsive-images/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Serve Responsive Images
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Responsive Images
            </a>
          </li>
          <li>
            <a href="https://nextjs.org/docs/app/api-reference/components/image" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Next.js — Image Component Documentation
            </a>
          </li>
          <li>
            <a href="https://sharp.pixelplumbing.com/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              sharp — High Performance Node.js Image Processing
            </a>
          </li>
          <li>
            <a href="https://squoosh.app/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Squoosh — Browser-based Image Compression Tool
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
