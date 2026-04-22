"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-minification-uglification",
  title: "Minification and Uglification",
  description: "Comprehensive guide to JavaScript and CSS minification techniques for reducing bundle sizes through code transformation and optimization.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "minification-and-uglification",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "minification", "uglification", "terser", "esbuild", "bundling", "optimization"],
  relatedTopics: ["compression", "tree-shaking", "bundle-size-optimization", "code-splitting"],
};

export default function MinificationUglificationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Minification</strong> removes unnecessary characters from source code (whitespace, 
          comments, newlines) without changing functionality. <strong>Uglification</strong> (or 
          mangling) goes further by renaming variables and functions to shorter names. Together, they 
          typically reduce JavaScript bundle size by{" "}
          <Highlight tier="important">30-60%</Highlight> and CSS by{" "}
          <Highlight tier="important">20-40%</Highlight> before compression.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          These are build-time transformations — your source code stays readable and maintainable, 
          but the production output is compact and optimized. Every modern bundler (Webpack, Vite, 
          Rollup, esbuild) performs minification automatically in production builds, but understanding 
          the underlying techniques helps you configure optimal settings and debug issues.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/minification-pipeline.svg"
          alt="Diagram showing minification pipeline from source code through parsing, transformation, mangling, and output with size reduction percentages"
          caption="Minification pipeline: source code is parsed, transformed, mangled, and output as compact bundle"
          captionTier="important"
        />

        <p>
          Minification operates at several levels:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Whitespace Removal:</strong> Remove spaces, tabs, newlines that are only for 
            human readability. Code remains functionally identical.
          </li>
          <li>
            <strong>Comment Removal:</strong> Strip all comments (unless preserved by license 
            comments). Reduces size without affecting execution.
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>Variable Mangling:</strong> Rename variables and functions to shorter names 
            (<code>userData</code> → <code>a</code>, <code>calculateTotal</code> → <code>b</code>). 
            This is where &quot;uglification&quot; gets its name — the output is ugly but functional.
          </HighlightBlock>
          <li>
            <strong>Dead Code Elimination:</strong> Remove unreachable code (after return statements, 
            in false conditionals), unused variables, and unused exports.
          </li>
          <li>
            <strong>Expression Optimization:</strong> Simplify expressions (<code>1 + 2</code> → 
            <code>3</code>), inline constants, and apply other algebraic simplifications.
          </li>
        </ul>

        <p>
          The performance impact of minification is significant:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Reduced Transfer Size:</strong> A 500KB JavaScript bundle minifies to 250-350KB 
            (30-50% reduction). After Gzip/Brotli compression, the transfer size is even smaller.
          </li>
          <li>
            <strong>Faster Parsing:</strong> Less code to parse means faster JavaScript parsing and 
            compilation. This directly improves Time to Interactive (TTI).
          </li>
          <li>
            <strong>Lower Memory Usage:</strong> Smaller bundles consume less memory, especially 
            important on mobile devices with limited RAM.
          </li>
        </ul>

        <p>
          Minification complements other optimization techniques:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Tree Shaking:</strong> Removes unused exports from bundles. Minification then 
            shrinks the remaining code.
          </li>
          <li>
            <strong>Compression:</strong> Minification removes redundancy in source code; Gzip/Brotli 
            removes redundancy in byte patterns. Both should be used together.
          </li>
          <li>
            <strong>Code Splitting:</strong> Split bundles into smaller chunks; minification reduces 
            each chunk&apos;s size.
          </li>
        </ul>

        <p>
          In system design interviews, minification demonstrates understanding of build tooling, 
          code transformation, and the trade-offs between development experience and production 
          performance. It&apos;s a foundational technique that applies beyond JavaScript — CSS, 
          HTML, and even server-side code can benefit from similar optimization principles.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Core concept: minification is not just whitespace. It relies on AST transforms (dead code
          elimination, constant folding, mangling) and can break boundary contracts if you use globals or
          reflection.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Treat minification as a correctness-sensitive optimization: anything referenced by name (globals, string property access) is a hazard.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Minification works best when combined with tree shaking and compression; don&apos;t evaluate it in isolation.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/minification-techniques.svg"
          alt="Comparison showing before/after code examples for whitespace removal, comment removal, variable mangling, and dead code elimination"
          caption="Minification techniques: whitespace removal, comment stripping, variable mangling, and dead code elimination"
        />

        <h3>JavaScript Minification Process</h3>
        <p>
          JavaScript minification involves several transformation passes:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Parsing:</strong> The minifier parses JavaScript into an Abstract Syntax Tree (AST). 
            This ensures transformations preserve semantics — it&apos;s not just regex-based text 
            replacement.
          </li>
          <li>
            <strong>Whitespace Removal:</strong> All unnecessary whitespace is removed. This includes 
            spaces around operators, between statements, and blank lines.
          </li>
          <li>
            <strong>Comment Removal:</strong> All comments are stripped except license comments 
            (preserved by convention with <code>/*! ... */</code> or <code>@preserve</code>).
          </li>
          <li>
            <strong>Variable Renaming:</strong> Local variables and function names are renamed to 
            short identifiers (<code>a</code>, <code>b</code>, <code>c</code>...). Global variables 
            and exported names are preserved.
          </li>
          <li>
            <strong>Expression Simplification:</strong> Constant expressions are evaluated at build 
            time (<code>2 + 2</code> → <code>4</code>). Dead code is eliminated.
          </li>
          <li>
            <strong>Output Generation:</strong> The transformed AST is printed as compact JavaScript 
            with minimal whitespace.
          </li>
        </ol>

        <h3>CSS Minification Process</h3>
        <p>
          CSS minification applies similar techniques:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Whitespace Removal:</strong> Remove spaces, newlines, and indentation from CSS 
            rules.
          </li>
          <li>
            <strong>Comment Removal:</strong> Strip all comments from CSS.
          </li>
          <li>
            <strong>Color Simplification:</strong> Convert long hex colors to short form 
            (<code>#ffffff</code> → <code>#fff</code>, <code>rgba(255, 0, 0, 1)</code> → <code>red</code>).
          </li>
          <li>
            <strong>Unit Simplification:</strong> Remove unnecessary units (<code>0px</code> → 
            <code>0</code>, <code>1000ms</code> → <code>1s</code>).
          </li>
          <li>
            <strong>Shorthand Properties:</strong> Combine properties into shorthand 
            (<code>margin-top: 1px; margin-right: 2px; margin-bottom: 3px; margin-left: 4px;</code> → 
            <code>margin: 1px 2px 3px 4px;</code>).
          </li>
        </ul>

        <h3>HTML Minification</h3>
        <p>
          HTML minification is less common but still beneficial:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Whitespace Removal:</strong> Collapse whitespace in text content and between tags.
          </li>
          <li>
            <strong>Comment Removal:</strong> Strip HTML comments (<code>&lt;!-- ... --&gt;</code>).
          </li>
          <li>
            <strong>Attribute Optimization:</strong> Remove optional quotes, default attribute values.
          </li>
          <li>
            <strong>Optional Tag Removal:</strong> Omit optional closing tags (<code>&lt;/p&gt;</code>, 
            <code>&lt;/li&gt;</code>).
          </li>
        </ul>
        <p>
          HTML minification typically achieves 20-30% size reduction. Most frameworks (Next.js, 
          Vite) handle this automatically in production builds.
        </p>

        <h3>Minifiers Compared</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Tool</th>
                <th className="p-3 text-left">Language</th>
                <th className="p-3 text-left">Speed</th>
                <th className="p-3 text-left">Compression</th>
                <th className="p-3 text-left">Used By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Terser</td>
                <td className="p-3">JavaScript</td>
                <td className="p-3">Moderate</td>
                <td className="p-3">Best (most aggressive)</td>
                <td className="p-3">Webpack (default), Next.js</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">esbuild</td>
                <td className="p-3">JavaScript</td>
                <td className="p-3">Fastest (10-100x)</td>
                <td className="p-3">Good (slightly larger)</td>
                <td className="p-3">Vite (default), Bun</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">SWC</td>
                <td className="p-3">JavaScript/TypeScript</td>
                <td className="p-3">Very fast (Rust)</td>
                <td className="p-3">Good</td>
                <td className="p-3">Next.js (optional), Parcel</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">cssnano</td>
                <td className="p-3">CSS</td>
                <td className="p-3">Moderate</td>
                <td className="p-3">Best for CSS</td>
                <td className="p-3">PostCSS, most frameworks</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Lightning CSS</td>
                <td className="p-3">CSS</td>
                <td className="p-3">Very fast (Rust)</td>
                <td className="p-3">Good</td>
                <td className="p-3">Parcel, Vite (optional)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/minification-tool-comparison.svg"
          alt="Comparison chart showing Terser vs esbuild vs SWC for speed, compression ratio, and bundle size output"
          caption="Minifier comparison: Terser provides best compression, esbuild provides fastest speed, SWC offers balance"
        />
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          The flow you should describe: parse → transform → mangle → emit + source maps, and how your build
          tooling integrates this with tree shaking and compression.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Your architecture includes source maps: they must exist for ops/debugging but be handled safely (upload to error tools, protect access).
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Be able to explain what changes at build time vs runtime: minification is build-time, so runtime gains come from fewer bytes/less parse.
        </HighlightBlock>

        <h3>Build Pipeline Integration</h3>
        <p>
          Minification is typically integrated into the build pipeline:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Source Code:</strong> Developers write readable, well-formatted code with 
            meaningful variable names and comments.
          </li>
          <li>
            <strong>Bundling:</strong> The bundler (Webpack, Vite, Rollup) combines all modules 
            into one or more bundles.
          </li>
          <li>
            <strong>Tree Shaking:</strong> Unused exports are removed from bundles.
          </li>
          <li>
            <strong>Minification:</strong> The minifier transforms the bundle: removes whitespace, 
            mangles names, eliminates dead code.
          </li>
          <li>
            <strong>Source Map Generation:</strong> A source map is generated to map minified 
            code back to original source for debugging.
          </li>
          <li>
            <strong>Compression:</strong> The minified bundle is compressed with Gzip or Brotli 
            for transfer.
          </li>
        </ol>

        <h3>Webpack with Terser</h3>
        <p>
          Webpack uses Terser as the default minifier in production mode:
        </p>
        <ul className="space-y-1">
          <li>• <code>mode: &apos;production&apos;</code> enables minification automatically</li>
          <li>• TerserPlugin can be configured for custom optimization</li>
          <li>• Options include dead code elimination, console removal, passes</li>
          <li>• Source maps generated for debugging</li>
        </ul>

        <h3>Vite with esbuild</h3>
        <p>
          Vite uses esbuild for minification by default:
        </p>
        <ul className="space-y-1">
          <li>• esbuild is 10-100x faster than Terser</li>
          <li>• Slightly larger output than Terser (1-5%)</li>
          <li>• Can switch to Terser with <code>build.minify: &apos;terser&apos;</code></li>
          <li>• Lightning CSS available for CSS minification</li>
        </ul>

        <h3>Next.js Configuration</h3>
        <p>
          Next.js handles minification automatically:
        </p>
        <ul className="space-y-1">
          <li>• Production builds are minified by default</li>
          <li>• Uses SWC for fast compilation and minification</li>
          <li>• Terser available as fallback</li>
          <li>• Source maps can be enabled for production debugging</li>
        </ul>

        <h3>Source Maps</h3>
        <p>
          Source maps bridge the gap between minified production code and original source:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>What They Are:</strong> A source map (<code>.map</code> file) contains mappings 
            from minified positions to original source positions.
          </li>
          <li>
            <strong>How They Work:</strong> When an error occurs in production, error reporting 
            tools (Sentry, LogRocket) use source maps to show the original source code and line 
            numbers.
          </li>
          <li>
            <strong>Security Consideration:</strong> Don&apos;t deploy source maps to production 
            servers where users can access them. Upload to error reporting tools only, or host 
            behind authentication.
          </li>
          <li>
            <strong>Source Map Types:</strong> <code>source-map</code> (full, best for debugging), 
            <code>hidden-source-map</code> (separate file), <code>inline-source-map</code> (embedded 
            in bundle, larger).
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <HighlightBlock as="p" tier="crucial">
          Minification is a build-time optimization with two big senior-level concerns:
          <Highlight tier="important"> operational debuggability</Highlight> (source maps, stack traces) and
          <Highlight tier="important"> correctness at boundaries</Highlight> (globals, reflection, property
          access). The best minifier choice is usually a trade between build time and the last few percent of
          compression.
        </HighlightBlock>

        <h3>Minifier Trade-offs</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Minifier</th>
                <th className="p-3 text-left">Speed</th>
                <th className="p-3 text-left">Compression</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Terser</td>
                <td className="p-3">Moderate (slower)</td>
                <td className="p-3">
                  <Highlight tier="important">Best compression</Highlight>
                </td>
                <td className="p-3">Production builds where size matters most</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">esbuild</td>
                <td className="p-3">
                  <Highlight tier="important">Fastest (10-100x)</Highlight>
                </td>
                <td className="p-3">Good (1-5% larger)</td>
                <td className="p-3">Fast builds, development, large projects</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">SWC</td>
                <td className="p-3">Very fast (Rust)</td>
                <td className="p-3">Good</td>
                <td className="p-3">TypeScript projects, Next.js</td>
              </tr>
            </tbody>
          </table>
        </div>
        <HighlightBlock as="p" tier="important" className="mt-4">
          If you ship source maps, treat them as production artifacts: store them securely, upload to an error tracker,
          and avoid exposing them publicly unless you accept the reverse-engineering trade-off. Staff-level answers mention
          both developer ergonomics and security/IP considerations.
        </HighlightBlock>

        <h3>Minification Level Trade-offs</h3>
        <p>
          Aggressive minification settings provide better compression but may cause issues:
        </p>
        <HighlightBlock as="p" tier="important">
          The most dangerous knob is property mangling. Only use it if you can constrain the surface area (reserved names,
          no reflection/dynamic access, and strong test coverage) because failures are usually runtime-only and hard to detect.
        </HighlightBlock>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Option</th>
                <th className="p-3 text-left">Conservative</th>
                <th className="p-3 text-left">Aggressive</th>
                <th className="p-3 text-left">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Variable Mangling</td>
                <td className="p-3">Keep some names</td>
                <td className="p-3">Mangle everything</td>
                <td className="p-3">Breaking external APIs</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Property Mangling</td>
                <td className="p-3">Never mangle</td>
                <td className="p-3">Mangle all properties</td>
                <td className="p-3">High (breaks object access)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Dead Code Elimination</td>
                <td className="p-3">Basic only</td>
                <td className="p-3">Aggressive</td>
                <td className="p-3">Removing needed code</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Console Removal</td>
                <td className="p-3">Keep console.error</td>
                <td className="p-3">Remove all console</td>
                <td className="p-3">Losing production logs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>When Minification Isn&apos;t Worth It</h3>
        <ul className="space-y-2">
          <li>
            <strong>Development Builds:</strong> Minification slows down builds and makes debugging 
            harder. Only minify production builds.
          </li>
          <li>
            <strong>Already-Minified Libraries:</strong> Some libraries ship pre-minified. Re-minifying 
            provides minimal benefit.
          </li>
          <li>
            <strong>Small Scripts:</strong> For scripts under 10KB, minification provides negligible 
            benefit.
          </li>
          <li>
            <strong>Code Requiring Debugging:</strong> If you need to debug production code frequently, 
            consider less aggressive minification or ensure source maps are available.
          </li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices: always ship source maps safely, reserve external API names when needed, and pick a
          minifier based on build-time constraints vs size wins.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Don&apos;t minify dev builds. Keep prod minification deterministic so you can reproduce issues.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Validate integration boundaries: if a third-party script expects `window.foo`, protect that name from mangling.
        </HighlightBlock>

        <h3>Use Production Mode</h3>
        <p>
          Always build with production mode for deployment:
        </p>
        <ul className="space-y-1">
          <li>• Webpack: <code>mode: &apos;production&apos;</code></li>
          <li>• Vite: <code>vite build</code> (defaults to production)</li>
          <li>• Next.js: <code>next build</code> (production by default)</li>
          <li>• Rollup: <code>--environment NODE_ENV:production</code></li>
        </ul>

        <h3>Generate Source Maps</h3>
        <p>
          Always generate source maps for production:
        </p>
        <ul className="space-y-1">
          <li>• Enables debugging production errors</li>
          <li>• Upload to error reporting tools (Sentry, Datadog)</li>
          <li>• Don&apos;t deploy source maps to public servers</li>
          <li>• Use <code>devtool: &apos;source-map&apos;</code> for best quality</li>
        </ul>

        <h3>Configure Terser for Production</h3>
        <p>
          Optimize Terser settings for production builds:
        </p>
        <ul className="space-y-1">
          <li>• <code>drop_console: true</code> — Remove console.log statements</li>
          <li>• <code>drop_debugger: true</code> — Remove debugger statements</li>
          <li>• <code>pure_funcs</code> — Mark pure functions for elimination</li>
          <li>• <code>passes: 2</code> — Multiple passes for better compression</li>
          <li>• <code>comments: false</code> — Remove all comments (or preserve licenses)</li>
        </ul>

        <h3>Preserve Required Names</h3>
        <p>
          Some names must be preserved:
        </p>
        <ul className="space-y-1">
          <li>• Global variables accessed by external scripts</li>
          <li>• Function names called by string (<code>obj[&quot;methodName&quot;]()</code>)</li>
          <li>• Component names for debugging (React DevTools)</li>
          <li>• Use Terser&apos;s <code>reserved</code> option to protect specific names</li>
        </ul>

        <h3>Keep console.error in Production</h3>
        <p>
          Consider keeping console.error for production debugging:
        </p>
        <ul className="space-y-1">
          <li>• <code>pure_funcs: [&apos;console.log&apos;, &apos;console.debug&apos;]</code></li>
          <li>• This removes log/debug but keeps warn/error</li>
          <li>• Helps with production debugging via browser console</li>
        </ul>

        <h3>Verify Minification</h3>
        <p>
          Always verify minification is working:
        </p>
        <ul className="space-y-1">
          <li>• Check bundle size before/after minification</li>
          <li>• Inspect minified output to ensure it&apos;s valid</li>
          <li>• Test application functionality after minification</li>
          <li>• Use bundle analyzer to verify composition</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Mangling Breaking External APIs</h3>
        <HighlightBlock as="p" tier="important">
          If your code accesses <code>window.myGlobal</code> or uses string-based property access 
          (<code>obj[&quot;propertyName&quot;]</code>), mangling can rename the variable but not the 
          string:
        </HighlightBlock>
        <p>
          <strong>Problem:</strong> <code>window.appData</code> gets mangled to <code>window.a</code>, 
          but external code still expects <code>window.appData</code>.
        </p>
        <p>
          <strong>Solution:</strong> Use Terser&apos;s <code>reserved</code> option to protect specific 
          names. Or use consistent property access patterns.
        </p>

        <h3>Not Generating Source Maps</h3>
        <HighlightBlock as="p" tier="crucial">
          Minified code is unreadable. Without source maps, debugging production errors is nearly 
          impossible:
        </HighlightBlock>
        <p>
          <strong>Problem:</strong> Error stack traces show minified line/column numbers.
        </p>
        <p>
          <strong>Solution:</strong> Always generate source maps (<code>devtool: &quot;source-map&quot;</code>). 
          Upload to error reporting tools.
        </p>

        <h3>Minifying in Development</h3>
        <p>
          Minifying development builds slows down builds and makes debugging hard:
        </p>
        <p>
          <strong>Problem:</strong> Slow rebuilds, unreadable errors in browser.
        </p>
        <p>
          <strong>Solution:</strong> Only minify production builds. Use development mode for local 
          development.
        </p>

        <h3>Dropping All Console Statements</h3>
        <HighlightBlock as="p" tier="important">
          Removing all console statements including console.error can hinder production debugging:
        </HighlightBlock>
        <p>
          <strong>Problem:</strong> No way to see errors in browser console.
        </p>
        <p>
          <strong>Solution:</strong> Use <code>pure_funcs: [&apos;console.log&apos;, &apos;console.debug&apos;]</code> 
          to keep warn/error.
        </p>

        <h3>Property Mangling Without Care</h3>
        <p>
          Aggressive property mangling can break code that uses dynamic property access:
        </p>
        <p>
          <strong>Problem:</strong> <code>obj[&quot;dynamicKey&quot;]</code> breaks if property names 
          are mangled.
        </p>
        <p>
          <strong>Solution:</strong> Avoid property mangling unless you control all access patterns. 
          Use <code>mangle.properties: false</code> or reserve specific property names.
        </p>

        <h3>Not Testing After Minification</h3>
        <p>
          Minification can introduce subtle bugs. Always test minified builds:
        </p>
        <p>
          <strong>Problem:</strong> Code works in development but fails in production.
        </p>
        <p>
          <strong>Solution:</strong> Test production builds before deployment. Use E2E tests on 
          minified output.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Use cases should show pragmatic choices: fast CI builds for large repos vs maximum compression for
          consumer traffic, plus how you validate correctness in production.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use cases should include operational readiness: source maps in Sentry/Datadog, and guardrails to prevent breaking releases.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Mention what you measured: transfer size and parse/execute improvements, plus whether it moved INP/TBT.
        </HighlightBlock>

        <h3>E-Commerce: Terser Optimization</h3>
        <p>
          An e-commerce site&apos;s JavaScript bundle was 600KB uncompressed. Initial load time on 
          mobile was 4+ seconds.
        </p>
        <p>
          <strong>Solution:</strong> Configured Terser with aggressive settings: <code>passes: 2</code>, 
          <code>drop_console: true</code>, <code>dead_code: true</code>.
        </p>
        <p>
          <strong>Results:</strong> Bundle reduced to 280KB (53% reduction). Mobile load time decreased 
          to 2.5 seconds. Conversion rate increased 12%.
        </p>

        <h3>SaaS Platform: esbuild Migration</h3>
        <p>
          A SaaS platform&apos;s build time was 2-3 minutes with Terser. This slowed down CI/CD 
          pipelines and developer productivity.
        </p>
        <p>
          <strong>Solution:</strong> Migrated from Terser to esbuild for minification.
        </p>
        <p>
          <strong>Results:</strong> Build time reduced from 180s to 25s (86% faster). Bundle size 
          increased by 3% (negligible trade-off). Developer productivity improved significantly.
        </p>

        <h3>News Publisher: CSS Minification</h3>
        <p>
          A news publisher&apos;s CSS was 150KB uncompressed. Critical CSS inlining was affected by 
          the large stylesheet size.
        </p>
        <p>
          <strong>Solution:</strong> Implemented cssnano with aggressive preset. Enabled shorthand 
          optimization, color simplification, and whitespace removal.
        </p>
        <p>
          <strong>Results:</strong> CSS reduced to 60KB (60% reduction). Critical CSS size decreased, 
          improving FCP by 200ms.
        </p>

        <h3>Web App: Source Map Debugging</h3>
        <p>
          A web application had frequent production errors that were impossible to debug without 
          source maps.
        </p>
        <p>
          <strong>Solution:</strong> Enabled source map generation. Uploaded maps to Sentry. 
          Configured Sentry to symbolicate errors automatically.
        </p>
        <p>
          <strong>Results:</strong> Production debugging time reduced from hours to minutes. Error 
          resolution improved significantly.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview bar: explain what minification does, how it can break boundaries, and why source maps are non-negotiable for prod debugging.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Strong answers compare minifiers (Terser/esbuild/SWC) and justify based on size vs build speed.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Call out pitfalls: mangling globals, missing source maps, and dropping useful logs/errors.
        </HighlightBlock>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is minification and how does it reduce bundle size?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="important" className="mb-3">
              Minification removes unnecessary characters from source code without changing 
              functionality:
            </HighlightBlock>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Whitespace Removal:</strong> Spaces, tabs, newlines for readability are removed.
              </li>
              <li>
                <strong>Comment Removal:</strong> All comments stripped (except license comments).
              </li>
              <li>
                <strong>Variable Mangling:</strong> Variables renamed to short names (<code>userData</code> 
                → <code>a</code>).
              </li>
              <li>
                <strong>Dead Code Elimination:</strong> Unreachable code and unused variables removed.
              </li>
              <li>
                <strong>Expression Optimization:</strong> Constant expressions evaluated at build time.
              </li>
            </ul>
            <HighlightBlock as="p" tier="important">
              Together, these techniques reduce JavaScript by 30-60% and CSS by 20-40% before compression.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What's the difference between Terser, esbuild, and SWC?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Terser:</strong> Best compression, moderate speed. Default in Webpack and 
                Next.js. Written in JavaScript.
              </li>
              <li>
                <strong>esbuild:</strong> Fastest (10-100x), good compression (1-5% larger than Terser). 
                Default in Vite. Written in Go.
              </li>
              <li>
                <strong>SWC:</strong> Very fast (Rust-based), good compression. Optional in Next.js. 
                Written in Rust.
              </li>
            </ul>
            <HighlightBlock as="p" tier="important">
              Choose Terser for smallest bundles, esbuild for fastest builds, SWC for TypeScript 
              projects.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: Why are source maps important?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Source maps map minified code back to original source. They&apos;re essential for 
              debugging production:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Error Debugging:</strong> Stack traces show original line numbers and source 
                code instead of minified gibberish.
              </li>
              <li>
                <strong>Browser DevTools:</strong> You can set breakpoints and step through original 
                source code even in production.
              </li>
              <li>
                <strong>Error Reporting:</strong> Tools like Sentry use source maps to symbolicate 
                errors automatically.
              </li>
            </ul>
            <p>
              Security note: Don&apos;t deploy source maps to public servers. Upload to error 
              reporting tools only.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What are common minification pitfalls?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Mangling breaking external APIs:</strong> Property mangling can break code 
                that uses string-based property access.
              </li>
              <li>
                <strong>Missing source maps:</strong> Debugging production without source maps is 
                nearly impossible.
              </li>
              <li>
                <strong>Minifying in development:</strong> Slows builds and makes debugging hard.
              </li>
              <li>
                <strong>Dropping all console:</strong> Removing console.error hinders production 
                debugging.
              </li>
              <li>
                <strong>Not testing minified output:</strong> Minification can introduce bugs. Always 
                test production builds.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How does minification complement compression?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Minification and compression (Gzip/Brotli) work at different levels:
            </p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>Minification:</strong> Removes redundancy in source code (whitespace, comments, 
                long names). Happens at build time.
              </li>
              <li>
                <strong>Compression:</strong> Removes redundancy in byte patterns. Happens at 
                request/response time.
              </li>
            </ul>
            <p>
              Together they provide cumulative benefits: a 500KB bundle might minify to 250KB, then 
              compress to 80KB. Both should be used for optimal performance.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: What Terser options would you configure for production?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <ul className="space-y-2 mb-3">
              <li>
                <strong>compress.drop_console:</strong> Remove console.log statements.
              </li>
              <li>
                <strong>compress.drop_debugger:</strong> Remove debugger statements.
              </li>
              <li>
                <strong>compress.pure_funcs:</strong> Mark pure functions for elimination.
              </li>
              <li>
                <strong>compress.passes:</strong> Multiple passes (2) for better compression.
              </li>
              <li>
                <strong>format.comments:</strong> false (or preserve licenses with regex).
              </li>
              <li>
                <strong>mangle.reserved:</strong> Protect names that must not be mangled.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://terser.org/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Terser Documentation
            </a> — Official Terser minifier documentation with configuration options.
          </li>
          <li>
            <a href="https://esbuild.github.io/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              esbuild Documentation
            </a> — Fast JavaScript bundler and minifier.
          </li>
          <li>
            <a href="https://swc.rs/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              SWC Documentation
            </a> — Rust-based JavaScript/TypeScript compiler.
          </li>
          <li>
            <a href="https://cssnano.co/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              cssnano Documentation
            </a> — CSS minification with PostCSS.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Source Maps
            </a> — Guide to using source maps for debugging.
          </li>
          <li>
            <a href="https://webpack.js.org/plugins/terser-webpack-plugin/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack — Terser Plugin
            </a> — Webpack integration for Terser minification.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
