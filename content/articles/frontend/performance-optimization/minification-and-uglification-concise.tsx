"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-minification-uglification-concise",
  title: "Minification and Uglification",
  description: "Quick overview of JavaScript and CSS minification techniques for reducing bundle sizes.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "minification-and-uglification",
  version: "concise",
  wordCount: 2500,
  readingTime: 10,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "minification", "uglification", "terser", "bundling"],
  relatedTopics: ["compression", "tree-shaking", "bundle-size-optimization"],
};

export default function MinificationConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Minification</strong> removes unnecessary characters from source code (whitespace, comments,
          newlines) without changing functionality. <strong>Uglification</strong> (or mangling) goes further by
          renaming variables and functions to shorter names. Together, they typically reduce JavaScript bundle
          size by <strong>30-60%</strong> and CSS by <strong>20-40%</strong> before compression.
        </p>
        <p>
          These are build-time transformations — your source code stays readable, but the production output is
          compact and optimized. Every modern bundler (Webpack, Vite, Rollup, esbuild) performs minification
          automatically in production builds.
        </p>
      </section>

      <section>
        <h2>What Minification Does</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Before minification (readable source) ===
function calculateTotalPrice(items, taxRate) {
  // Sum up all item prices
  let subtotal = 0;

  for (const item of items) {
    const itemPrice = item.price * item.quantity;
    subtotal += itemPrice;
  }

  // Apply tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    subtotal: subtotal,
    tax: tax,
    total: total,
  };
}

// === After minification + uglification ===
function c(t,r){let e=0;for(const o of t)e+=o.price*o.quantity;const n=e*r;return{subtotal:e,tax:n,total:e+n}}

// What happened:
// 1. Comments removed
// 2. Whitespace/newlines removed
// 3. Variables renamed: calculateTotalPrice→c, items→t, taxRate→r, etc.
// 4. Redundant variables eliminated (itemPrice inlined)
// 5. Object shorthand applied where possible
// 6. Dead code eliminated`}</code>
        </pre>
      </section>

      <section>
        <h2>JavaScript Minifiers</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Tool</th>
              <th className="p-3 text-left">Speed</th>
              <th className="p-3 text-left">Compression</th>
              <th className="p-3 text-left">Used By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Terser</strong></td>
              <td className="p-3">Moderate</td>
              <td className="p-3">Best (most aggressive)</td>
              <td className="p-3">Webpack (default), Next.js</td>
            </tr>
            <tr>
              <td className="p-3"><strong>esbuild</strong></td>
              <td className="p-3">Fastest (10-100x)</td>
              <td className="p-3">Good (slightly larger output)</td>
              <td className="p-3">Vite (default)</td>
            </tr>
            <tr>
              <td className="p-3"><strong>SWC</strong></td>
              <td className="p-3">Very fast</td>
              <td className="p-3">Good</td>
              <td className="p-3">Next.js (optional), Parcel</td>
            </tr>
          </tbody>
        </table>

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm mt-4">
          <code>{`// === Webpack with Terser (default in production) ===
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production', // Enables minification automatically
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            dead_code: true,       // Remove unreachable code
            drop_console: true,    // Remove console.log
            drop_debugger: true,   // Remove debugger statements
            pure_funcs: ['console.info', 'console.debug'],
            passes: 2,            // Multiple passes for better compression
          },
          mangle: {
            safari10: true,        // Work around Safari 10 bugs
          },
          format: {
            comments: false,       // Remove all comments
          },
        },
        extractComments: false,
      }),
    ],
  },
};

// === Vite with esbuild (default) ===
export default defineConfig({
  build: {
    minify: 'esbuild', // Default — fast
    // minify: 'terser', // Alternative — smaller output, slower
    terserOptions: {
      compress: { drop_console: true },
    },
  },
});`}</code>
        </pre>
      </section>

      <section>
        <h2>CSS Minification</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`/* Before CSS minification */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem 2rem 1rem;     /* Can be simplified */
  margin: 0px;                       /* 0px → 0 */
  background-color: #ffffff;         /* Can be shortened */
  color: rgb(0, 0, 0);              /* Can be shortened */
  /* This is a comment */
  font-weight: 700;                  /* Can use 'bold' or keep */
}

/* After CSS minification (cssnano) */
.hero-section{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1rem;margin:0;background-color:#fff;color:#000;font-weight:700}

/* CSS minifiers:
   - cssnano (PostCSS plugin, used by most frameworks)
   - Lightning CSS (Rust-based, very fast, used by Parcel/Vite)
   - clean-css (standalone)
*/

// PostCSS config with cssnano
// postcss.config.js
module.exports = {
  plugins: [
    require('cssnano')({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        minifySelectors: true,
        reduceTransforms: true,
      }],
    }),
  ],
};`}</code>
        </pre>
      </section>

      <section>
        <h2>HTML Minification</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`<!-- Before --&gt;
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My App</title>
    <!-- This is a comment --&gt;
  </head>
  <body>
    <div id="root">
      <p>Hello World</p>
    </div>
  </body>
</html>

<!-- After (html-minifier-terser) --&gt;
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>My App</title></head><body><div id="root"><p>Hello World</p></div></body></html>

<!-- Savings: ~30% for HTML
   Most frameworks handle this automatically:
   - Next.js: automatic HTML minification in production
   - Vite: html-minifier-terser plugin available
--&gt;`}</code>
        </pre>
      </section>

      <section>
        <h2>Advanced Minification Techniques</h2>
        <ul className="space-y-2">
          <li>
            <strong>Property mangling:</strong> Rename object properties (<code>{'{ longPropertyName: 1 }'}</code> →
            <code>{'{ a: 1 }'}</code>). Risky — only safe for internal-only properties. Terser's <code>mangle.properties</code> with a regex pattern.
          </li>
          <li>
            <strong>Dead code elimination:</strong> Remove code in <code>if (false)</code> blocks, unused variables,
            and unreachable code after <code>return</code> statements.
          </li>
          <li>
            <strong>Constant folding:</strong> Replace <code>1 + 2</code> with <code>3</code>,
            <code>"hello" + " " + "world"</code> with <code>"hello world"</code> at build time.
          </li>
          <li>
            <strong>Boolean simplification:</strong> <code>!!x</code> → context-dependent optimization,
            <code>x === true</code> → <code>x</code>.
          </li>
          <li>
            <strong>Drop console in production:</strong> <code>drop_console: true</code> removes all
            <code>console.log/warn/error</code> calls. Reduces bundle size and prevents leaking debug info.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Mangling breaking external APIs:</strong> If your code accesses <code>window.myGlobal</code>
            or uses string-based property access (<code>obj["propertyName"]</code>), mangling can rename the
            variable but not the string. Use Terser's <code>reserved</code> option to protect specific names.
          </li>
          <li>
            <strong>Not generating source maps:</strong> Minified code is unreadable. Always generate source maps
            in production (<code>devtool: "source-map"</code>) for debugging via error reporting tools.
          </li>
          <li>
            <strong>Minifying in development:</strong> Slows down builds and makes debugging hard. Only minify
            in production builds.
          </li>
          <li>
            <strong>Dropping all console statements:</strong> <code>console.error</code> in production can be
            valuable for debugging. Use <code>pure_funcs: ['console.log', 'console.debug']</code> to keep
            errors and warnings.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Minification removes whitespace, comments, and newlines. Uglification (mangling) renames variables
            to shorter names. Together they reduce JS by 30-60%, CSS by 20-40%.
          </li>
          <li>
            The three main JS minifiers: <strong>Terser</strong> (best compression, used by Webpack),
            <strong>esbuild</strong> (fastest, used by Vite), and <strong>SWC</strong> (fast, Rust-based).
          </li>
          <li>
            Minification happens at build time — source code stays readable, production output is compact.
            Source maps bridge the gap for debugging.
          </li>
          <li>
            Advanced techniques include dead code elimination, constant folding, and dropping console statements.
            Property mangling is possible but risky.
          </li>
          <li>
            Minification complements compression (Gzip/Brotli). Minification removes redundancy in source code;
            compression removes redundancy in byte patterns. Both should be used together.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
