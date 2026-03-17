"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-image-optimization-concise",
  title: "Image Optimization (WebP, AVIF, responsive images, srcset)",
  description: "Quick overview of image optimization techniques including modern formats, responsive images, and delivery strategies.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "image-optimization",
  version: "concise",
  wordCount: 3200,
  readingTime: 13,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "images", "WebP", "AVIF", "responsive", "srcset"],
  relatedTopics: ["lazy-loading", "critical-css", "above-the-fold-optimization"],
};

export default function ImageOptimizationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          Images account for <strong>50-70% of total page weight</strong> on most websites. A single unoptimized
          hero image can be 5MB — more than the entire rest of the page. Image optimization is the highest-ROI
          performance technique because the savings are enormous: modern formats (WebP, AVIF) deliver 30-50%
          smaller files than JPEG/PNG, responsive images ensure mobile users don't download desktop-sized files,
          and proper delivery strategies eliminate wasted bandwidth entirely.
        </p>
        <p>
          The three pillars of image optimization are: <strong>format</strong> (use the smallest format the browser
          supports), <strong>size</strong> (serve images at the dimensions they're displayed), and
          <strong>delivery</strong> (lazy load, use CDN, and set proper cache headers).
        </p>
      </section>

      <section>
        <h2>Modern Image Formats</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Format</th>
              <th className="p-3 text-left">Size vs JPEG</th>
              <th className="p-3 text-left">Browser Support</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>JPEG</strong></td>
              <td className="p-3">Baseline</td>
              <td className="p-3">100%</td>
              <td className="p-3">Photos (fallback)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>PNG</strong></td>
              <td className="p-3">2-5x larger</td>
              <td className="p-3">100%</td>
              <td className="p-3">Transparency, screenshots, icons</td>
            </tr>
            <tr>
              <td className="p-3"><strong>WebP</strong></td>
              <td className="p-3">25-35% smaller</td>
              <td className="p-3">~97%</td>
              <td className="p-3">Photos and graphics (production default)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>AVIF</strong></td>
              <td className="p-3">40-50% smaller</td>
              <td className="p-3">~92%</td>
              <td className="p-3">Best compression, photos</td>
            </tr>
            <tr>
              <td className="p-3"><strong>SVG</strong></td>
              <td className="p-3">N/A (vector)</td>
              <td className="p-3">100%</td>
              <td className="p-3">Icons, logos, illustrations</td>
            </tr>
          </tbody>
        </table>

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm mt-4">
          <code>{`<!-- Serve the best format the browser supports --&gt;
<picture>
  <source srcSet="/hero.avif" type="image/avif" />
  <source srcSet="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" alt="Hero banner" width={1200} height={600} />
</picture>

<!-- The browser picks the FIRST <source> it supports:
     AVIF → WebP → JPEG fallback --&gt;`}</code>
        </pre>
      </section>

      <section>
        <h2>Responsive Images with srcset</h2>
        <p>
          A 2400px wide hero image is unnecessary on a 375px mobile screen. <code>srcset</code> lets the browser
          choose the right size based on viewport width and device pixel ratio.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Width-based srcset (most common) --&gt;
<img
  src="/product-800.jpg"
  srcSet="
    /product-400.jpg 400w,
    /product-800.jpg 800w,
    /product-1200.jpg 1200w,
    /product-1600.jpg 1600w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="Product photo"
  width={800}
  height={600}
  loading="lazy"
/>

<!-- How it works:
  1. Browser calculates display width from 'sizes' attribute
  2. Multiplies by device pixel ratio (2x for Retina)
  3. Picks the smallest image from 'srcset' that's >= the result

  Example: 375px mobile (2x Retina)
  - sizes says 100vw = 375px display width
  - 375px × 2 = 750px needed
  - Browser picks product-800.jpg (smallest &gt;= 750)

  Example: 1280px desktop (1x)
  - sizes says 33vw = 422px display width
  - 422px × 1 = 422px needed
  - Browser picks product-800.jpg
--&gt;

<!-- DPR-based srcset (for fixed-size images like avatars) --&gt;
<img
  src="/avatar-48.jpg"
  srcSet="
    /avatar-48.jpg 1x,
    /avatar-96.jpg 2x,
    /avatar-144.jpg 3x
  "
  alt="User avatar"
  width={48}
  height={48}
/>`}</code>
        </pre>
      </section>

      <section>
        <h2>Next.js Image Component</h2>
        <p>
          Next.js <code>Image</code> component handles all of this automatically — format negotiation, responsive
          sizes, lazy loading, and blur placeholders.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`import Image from 'next/image';

// Automatic optimization — serves WebP/AVIF, correct size
<Image
  src="/photos/product.jpg"
  alt="Product"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."
  quality={75}
/>

// Above-the-fold — eager load with preload hint
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // Disables lazy loading, adds <link rel="preload">
  sizes="100vw"
/&gt;

// Fill container (unknown dimensions)
<div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
  <Image
    src="/banner.jpg"
    alt="Banner"
    fill
    style={{ objectFit: 'cover' }}
    sizes="100vw"
  />
</div>`}</code>
        </pre>
      </section>

      <section>
        <h2>Optimization Techniques</h2>
        <ul className="space-y-2">
          <li>
            <strong>Compress aggressively:</strong> Quality 75-80 for JPEG/WebP is visually indistinguishable from
            100 but 40-60% smaller. Use tools like sharp, squoosh, or imagemin.
          </li>
          <li>
            <strong>Serve exact dimensions:</strong> Never serve a 2400px image in a 400px container. Generate
            multiple sizes at build time and use srcset.
          </li>
          <li>
            <strong>Use CDN with image transformation:</strong> Services like Cloudinary, Imgix, or Cloudflare Images
            resize, compress, and format-convert on-the-fly via URL parameters.
          </li>
          <li>
            <strong>Lazy load below-fold images:</strong> Use <code>loading="lazy"</code> for everything below
            the fold. Use <code>fetchPriority="high"</code> for the LCP image.
          </li>
          <li>
            <strong>Use blur placeholders:</strong> Generate tiny (20x15px) base64 placeholders for progressive
            loading. Next.js <code>placeholder="blur"</code> does this automatically for static imports.
          </li>
          <li>
            <strong>Prefer SVG for icons and logos:</strong> Vector graphics scale infinitely, are typically
            smaller than PNGs, and can be styled with CSS. Inline small SVGs to avoid HTTP requests.
          </li>
          <li>
            <strong>Set proper cache headers:</strong> Images rarely change — use <code>Cache-Control: public,
            max-age=31536000, immutable</code> with content-hashed filenames.
          </li>
        </ul>
      </section>

      <section>
        <h2>Build-Time Optimization Pipeline</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Using sharp (Node.js) to generate optimized variants
import sharp from 'sharp';

async function optimizeImage(inputPath, outputDir) {
  const widths = [400, 800, 1200, 1600];
  const formats = ['webp', 'avif', 'jpeg'];

  for (const width of widths) {
    for (const format of formats) {
      await sharp(inputPath)
        .resize(width)
        .toFormat(format, {
          quality: format === 'avif' ? 65 : 75,
          effort: format === 'avif' ? 4 : undefined,
        })
        .toFile(\`\${outputDir}/image-\${width}.\${format}\`);
    }
  }

  // Generate blur placeholder (20px wide)
  const placeholder = await sharp(inputPath)
    .resize(20)
    .blur()
    .toBuffer();

  return \`data:image/jpeg;base64,\${placeholder.toString('base64')}\`;
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Serving original uploads:</strong> User-uploaded images are often 5-15MB. Always process
            uploads through an optimization pipeline before serving.
          </li>
          <li>
            <strong>Missing width/height:</strong> Images without dimensions cause layout shift (CLS). Always
            specify dimensions or use CSS aspect-ratio.
          </li>
          <li>
            <strong>Over-compressing:</strong> Quality below 50 creates visible artifacts. Target 65-80 for most
            use cases. AVIF handles lower quality better than JPEG.
          </li>
          <li>
            <strong>Lazy-loading LCP image:</strong> The hero/LCP image must load eagerly with high priority.
            Lazy loading it adds 1-3 seconds to LCP.
          </li>
          <li>
            <strong>Missing sizes attribute:</strong> Without <code>sizes</code>, the browser assumes images
            are 100vw wide and downloads the largest variant — negating srcset benefits.
          </li>
          <li>
            <strong>Too many breakpoints:</strong> 4-5 srcset widths (400, 800, 1200, 1600, 2000) covers all
            devices. More than that adds complexity without meaningful savings.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Images are 50-70% of page weight. Modern formats (AVIF: 40-50% smaller, WebP: 25-35% smaller than
            JPEG) are the biggest single optimization.
          </li>
          <li>
            Use the <code>{'<picture>'}</code> element with AVIF → WebP → JPEG fallback chain for format
            negotiation. The browser picks the first format it supports.
          </li>
          <li>
            <code>srcset</code> with <code>sizes</code> lets the browser choose the right image dimensions
            based on viewport width and device pixel ratio.
          </li>
          <li>
            Next.js Image component automates format negotiation, responsive sizing, lazy loading, and blur
            placeholders — eliminating manual optimization work.
          </li>
          <li>
            LCP images must be eagerly loaded with <code>fetchPriority="high"</code>. Below-fold images use
            <code>loading="lazy"</code>.
          </li>
          <li>
            CDN image services (Cloudinary, Imgix) enable on-the-fly resizing, format conversion, and
            compression via URL parameters — no build pipeline needed.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
