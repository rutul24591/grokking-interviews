"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { Highlight } from "@/components/articles/Highlight";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-tree-shaking",
  title: "Tree Shaking",
  description: "Comprehensive guide to tree shaking for eliminating dead code from JavaScript bundles, covering ES modules, bundler configuration, and library selection.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "tree-shaking",
  wordCount: 6000,
  readingTime: 24,
  lastUpdated: "2026-03-30",
  tags: ["frontend", "performance", "tree-shaking", "dead-code", "webpack", "bundling", "es-modules"],
  relatedTopics: ["code-splitting", "bundle-size-optimization", "minification-and-uglification"],
};

export default function TreeShakingArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition & Context
          ============================================================ */}
      <section>
        <h2>Definition & Context</h2>
        <HighlightBlock as="p" tier="crucial">
          <strong>Tree shaking</strong> is a dead code elimination technique used by JavaScript bundlers to remove 
          unused exports from the final production bundle. The term evokes the mental model of shaking a tree and 
          watching the dead leaves (unused code) fall off, leaving only the living branches (used code). When you 
          import a single function from a library, tree shaking ensures that only that{" "}
          <Highlight tier="important">function and its dependencies</Highlight>{" "}
          end up in your bundle — not the entire library.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Tree shaking relies on the <strong>static structure of ES modules</strong> (import/export syntax) to 
          determine at build time which exports are actually used by your application. The bundler performs static 
          analysis on your code, builds a dependency graph, marks which exports are referenced, and eliminates 
          everything else during the minification phase.
        </HighlightBlock>
        <p>
          The impact of tree shaking on bundle size can be dramatic. Consider these common scenarios:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Lodash:</strong> Importing <code>map</code> from the full lodash library includes all 200+ 
            functions (~70 KB minified). With tree shaking via lodash-es, only <code>map</code> and its dependencies 
            are included (~2 KB).
          </li>
          <li>
            <strong>Date libraries:</strong> Moment.js is a monolithic ~300 KB bundle with no tree shaking support. 
            date-fns, built with ES modules, allows importing only the functions you need (~3 KB per function).
          </li>
          <HighlightBlock as="li" tier="important">
            <strong>UI libraries:</strong> Material UI, Ant Design, and similar component libraries can be 
            tree-shaken to include only the components you actually use, reducing bundle size by 80-90%.
          </HighlightBlock>
        </ul>
        <p>
          Tree shaking is distinct from but complementary to other optimization techniques:
        </p>
        <ul className="space-y-2">
          <li>
            <strong>vs Minification:</strong> Minification removes whitespace, comments, and shortens variable names. 
            Tree shaking removes entire functions and modules that are never used.
          </li>
          <li>
            <strong>vs Code Splitting:</strong> Code splitting defers loading of code until it is needed. Tree shaking 
            removes code entirely from the bundle.
          </li>
          <li>
            <strong>vs Dead Code Elimination:</strong> Tree shaking is a form of dead code elimination, but specifically 
            at the module export level. General dead code elimination also removes unreachable code within functions.
          </li>
        </ul>
        <p>
          In system design interviews, tree shaking demonstrates understanding of build tooling, module systems, 
          bundle optimization, and the trade-offs between developer experience and production performance.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Core concept: tree shaking needs{" "}
          <Highlight tier="important">static analyzability</Highlight> (ESM import/export) and correct side
          effect modeling. Senior answers mention toolchain config and library selection, not just &quot;use
          lodash-es&quot;.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The main interview point: tree shaking is build-time elimination, so runtime wins come from fewer bytes and less parse/execute.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Know the top reasons shaking fails: CommonJS, transpiling modules, side effects flags, and namespace imports/barrels.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/tree-shaking-process.svg"
          alt="Diagram showing tree shaking process from source code with multiple exports through bundler analysis to final bundle with only used exports"
          caption="Tree shaking process: static analysis identifies used exports, unused exports are eliminated from final bundle"
          captionTier="important"
        />

        <h3>How Tree Shaking Works</h3>
        <p>
          Tree shaking operates in three phases during the build process:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Static Analysis (Mark Phase):</strong> The bundler parses all JavaScript files and builds a 
            dependency graph by analyzing <code>import</code> and <code>export</code> statements. Starting from 
            entry points, it traces which exports are actually referenced and marks them as &quot;used.&quot; 
            Exports that are never imported or referenced are marked as &quot;unused.&quot;
          </li>
          <li>
            <strong>Side Effect Analysis:</strong> The bundler determines which modules have side effects — code 
            that runs just by being imported, such as modifying global state, polyfills, or CSS imports. Modules 
            marked as side-effect-free can have their unused exports safely removed.
          </li>
          <li>
            <strong>Code Elimination (Sweep Phase):</strong> During minification, the bundler removes all exports 
            marked as unused, along with any code that is only reachable from those exports. This happens in the 
            final optimization pass, after all other transformations.
          </li>
        </ol>

        <h3>Why ES Modules Are Required</h3>
        <p>
          Tree shaking <strong>only works with ES module syntax</strong> (<code>import</code>/<code>export</code>), 
          not CommonJS (<code>require</code>/<code>module.exports</code>). The fundamental difference is 
          <strong>static vs dynamic resolution</strong>:
        </p>
        <p>
          <strong>ES modules are statically analyzable.</strong> The <code>import</code> statement declares 
          dependencies at the top level of the module, before any code executes. The bundler can parse these 
          statements at build time and determine exactly which exports are needed. The structure is fixed and 
          known before runtime.
        </p>
        <p>
          <strong>CommonJS is dynamically resolved.</strong> The <code>require()</code> function is a runtime 
          function call. It can be conditional, dynamic, or computed:
        </p>
        <ul className="space-y-2">
          <li>
            <code>const lib = require(condition ? &apos;module-a&apos; : &apos;module-b&apos;);</code> — conditional require
          </li>
          <li>
            <code>const lib = require(&apos;module-&apos; + name);</code> — dynamic module name
          </li>
          <li>
            <code>const {'{'} [propName]: value {'}'} = require(&apos;module&apos;);</code> — dynamic destructuring
          </li>
        </ul>
        <p>
          Because <code>require()</code> executes at runtime, the bundler cannot determine which exports are 
          used at build time. The safest approach is to include the entire module, which defeats tree shaking.
        </p>

        <h3>Side Effects and Tree Shaking</h3>
        <p>
          A <strong>side effect</strong> is any code that modifies state outside the local scope just by being 
          executed. Examples include:
        </p>
        <ul className="space-y-2">
          <li>• Modifying global variables or prototypes (<code>Array.prototype.customMethod = ...</code>)</li>
          <li>• Making network requests</li>
          <li>• Writing to the DOM or console</li>
          <li>• Importing CSS files (which modify global styles)</li>
          <li>• Running polyfills that modify native objects</li>
        </ul>
        <p>
          The <code>sideEffects</code> field in <code>package.json</code> tells bundlers whether a module has 
          side effects:
        </p>
        <ul className="space-y-2">
          <li>
            <code>"sideEffects": false</code> — The package has no side effects. All unused exports can be 
            safely tree-shaken.
          </li>
          <li>
            <code>"sideEffects": ["*.css", "*.scss"]</code> — Only the specified file patterns have side 
            effects. JavaScript exports can be tree-shaken.
          </li>
          <li>
            <code>"sideEffects": true</code> (or omitted) — The bundler assumes all code has side effects and 
            conservatively keeps everything.
          </li>
        </ul>
        <p>
          Without <code>sideEffects: false</code>, bundlers must assume that every import might have side effects, 
          so they keep all code even if exports are unused. This is the safe default but prevents tree shaking.
        </p>

        <h3>Pure Functions and Annotations</h3>
        <p>
          Bundlers use <strong>purity annotations</strong> to identify code that can be safely eliminated. The 
          <code>/*#__PURE__*/</code> comment tells the bundler that a function call has no side effects and can 
          be removed if its result is unused:
        </p>
        <ul className="space-y-2">
          <li>
            <code>/*#__PURE__*/ createExpensiveObject()</code> — If the result is unused, the call can be removed.
          </li>
          <li>
            <code>/*#__PURE__*/ someFunction().chain().method()</code> — The entire chain can be removed if unused.
          </li>
        </ul>
        <p>
          Libraries like RxJS and date-fns use these annotations extensively to enable aggressive tree shaking.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture & Flow
          ============================================================ */}
      <section>
        <h2>Architecture & Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          The flow is: build dependency graph → mark used exports → analyze side effects → eliminate in
          minification. You should be able to explain why a bundler keeps code even if you think it&apos;s unused.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Architecture includes packaging: libraries must ship ESM entry points, and your build must preserve ESM until bundling.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Validate with tooling: bundle analyzer + source maps. Don&apos;t assume shaking happened.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/tree-shaking-es-modules.svg"
          alt="Comparison diagram showing ES modules enabling tree shaking through static analysis versus CommonJS preventing tree shaking due to dynamic resolution"
          caption="ES modules enable tree shaking through static analysis; CommonJS prevents it due to dynamic runtime resolution"
        />

        <h3>Bundler Tree Shaking Pipeline</h3>
        <p>
          Modern bundlers implement tree shaking through a multi-stage pipeline:
        </p>
        <ol className="space-y-2">
          <li>
            <strong>Module Parsing:</strong> Each JavaScript file is parsed into an Abstract Syntax Tree (AST). 
            The bundler extracts all <code>import</code> and <code>export</code> declarations, building a map of 
            what each module exports and what it imports.
          </li>
          <li>
            <strong>Dependency Graph Construction:</strong> The bundler builds a graph where nodes are modules 
            and edges are import relationships. Each export is tracked with its usage status.
          </li>
          <li>
            <strong>Entry Point Traversal:</strong> Starting from entry points (e.g., <code>src/index.js</code>), 
            the bundler traverses the graph, marking every imported export as &quot;used.&quot; This propagates 
            transitively — if A imports B, and B imports C, both B and C are marked used.
          </li>
          <li>
            <strong>Side Effect Analysis:</strong> The bundler consults <code>package.json</code> 
            <code>sideEffects</code> fields and analyzes code for side effects. Modules without side effects 
            are candidates for aggressive tree shaking.
          </li>
          <li>
            <strong>Code Generation:</strong> During the output phase, the bundler generates code that includes 
            only the used exports. Unused exports are omitted from the generated bundle.
          </li>
          <li>
            <strong>Minification:</strong> The minifier performs final dead code elimination, removing any 
            remaining unreachable code within the included exports.
          </li>
        </ol>

        <h3>Barrel Files and Re-exports</h3>
        <p>
          <strong>Barrel files</strong> (typically <code>index.js</code> or <code>index.ts</code>) consolidate 
          exports from multiple modules into a single entry point. They can help or hurt tree shaking depending 
          on implementation:
        </p>
        <p>
          <strong>Tree-shakeable barrel:</strong> Uses named re-exports, which preserve the import/export chain 
          for static analysis:
        </p>
        <ul className="space-y-1">
          <li>
            <code>export {'{'} Button {'}'} from &apos;./Button&apos;;</code>
          </li>
          <li>
            <code>export {'{'} Input {'}'} from &apos;./Input&apos;;</code>
          </li>
          <li>
            <code>export {'{'} Select {'}'} from &apos;./Select&apos;;</code>
          </li>
        </ul>
        <p>
          <strong>Non-tree-shakeable barrel:</strong> Imports and re-exports, which can break tree shaking in 
          some bundler configurations:
        </p>
        <ul className="space-y-1">
          <li>
            <code>import {'{'} Button {'}'} from &apos;./Button&apos;;</code>
          </li>
          <li>
            <code>import {'{'} Input {'}'} from &apos;./Input&apos;;</code>
          </li>
          <li>
            <code>export {'{'} Button, Input, Select {'}'};</code>
          </li>
        </ul>
        <p>
          Modern bundlers (Webpack 5+, Rollup, Vite) handle named re-exports well, but direct path imports 
          are always safest for maximum tree shaking.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/performance-optimization/tree-shaking-libraries.svg"
          alt="Comparison table showing bundle sizes of popular libraries with and without tree shaking support"
          caption="Tree-shakeable libraries (lodash-es, date-fns) provide 90%+ size reduction compared to non-tree-shakeable alternatives"
        />
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs & Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs & Comparison</h2>

        <HighlightBlock as="p" tier="crucial">
          Tree shaking is &quot;free&quot; at runtime but fragile at the ecosystem boundary. Senior-level
          correctness is ensuring your toolchain preserves{" "}
          <Highlight tier="important">ES module semantics</Highlight> and that you understand how side effects
          and barrel exports can silently defeat shaking.
        </HighlightBlock>

        <h3>Benefits of Tree Shaking</h3>
        <ul className="space-y-2">
          <li>
            <strong>Dramatic Bundle Size Reduction:</strong> Tree shaking can reduce bundle size by 50-90% for 
            applications that import from large libraries. A single function from lodash-es is ~2 KB vs 70 KB 
            for the full library.
          </li>
          <li>
            <strong>No Runtime Overhead:</strong> Tree shaking happens at build time. The eliminated code never 
            exists in the production bundle, so there is zero runtime cost.
          </li>
          <li>
            <strong>Automatic Optimization:</strong> Once configured, tree shaking works automatically. Developers 
            don&apos;t need to manually optimize imports — the bundler handles it.
          </li>
          <li>
            <strong>Complements Other Optimizations:</strong> Tree shaking works alongside code splitting, 
            minification, and compression for cumulative benefits.
          </li>
        </ul>

        <h3>Trade-offs and Limitations</h3>
        <ul className="space-y-2">
          <HighlightBlock as="li" tier="important">
            <strong>ES Module Requirement:</strong> Tree shaking only works with ES module syntax. Libraries 
            published only in CommonJS format cannot be tree-shaken. This limits library choices.
          </HighlightBlock>
          <HighlightBlock as="li" tier="important">
            <strong>Configuration Sensitivity:</strong> Tree shaking requires correct configuration: 
            <code>sideEffects: false</code> in package.json, proper Babel/TypeScript settings, and production 
            mode. Misconfiguration silently disables tree shaking.
          </HighlightBlock>
          <li>
            <strong>Transpilation Pitfalls:</strong> If Babel or TypeScript transpiles ES modules to CommonJS 
            (for older browser support), tree shaking breaks. The output must preserve ES module syntax for 
            the bundler to analyze.
          </li>
          <li>
            <strong>Namespace Import Issues:</strong> Using <code>import * as utils from './utils'</code> can 
            prevent tree shaking in some bundlers because the entire module namespace is imported. Named imports 
            are safer.
          </li>
          <li>
            <strong>Dynamic Import Limitations:</strong> While <code>import()</code> enables code splitting, 
            it can interfere with tree shaking because the bundler doesn&apos;t know at build time which 
            exports will be used.
          </li>
        </ul>

        <h3>Tree-Shakeable vs Non-Tree-Shakeable Libraries</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-theme">
                <th className="p-3 text-left">Library Type</th>
                <th className="p-3 text-left">Example</th>
                <th className="p-3 text-left">Full Size</th>
                <th className="p-3 text-left">Tree-Shaken</th>
                <th className="p-3 text-left">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme">
              <tr>
                <td className="p-3 font-medium">Utility Libraries</td>
                <td className="p-3">lodash-es</td>
                <td className="p-3">~70 KB</td>
                <td className="p-3">~2 KB/function</td>
                <td className="p-3">✓ Preferred</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Date Libraries</td>
                <td className="p-3">date-fns</td>
                <td className="p-3">~300 KB</td>
                <td className="p-3">~3 KB/function</td>
                <td className="p-3">✓ Preferred</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Date Libraries</td>
                <td className="p-3">moment.js</td>
                <td className="p-3">~300 KB</td>
                <td className="p-3">~300 KB (no shaking)</td>
                <td className="p-3">✗ Avoid</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">UI Component Libraries</td>
                <td className="p-3">@mui/material</td>
                <td className="p-3">~200 KB</td>
                <td className="p-3">~10-30 KB/component</td>
                <td className="p-3">✓ With direct imports</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">HTTP Clients</td>
                <td className="p-3">axios</td>
                <td className="p-3">~13 KB</td>
                <td className="p-3">~13 KB (monolithic)</td>
                <td className="p-3">Acceptable (small)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Reactive Libraries</td>
                <td className="p-3">rxjs</td>
                <td className="p-3">~60 KB</td>
                <td className="p-3">~1-5 KB/operator</td>
                <td className="p-3">✓ Use rxjs/operators</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Best practices: prefer ESM libs, keep modules as ESM through transpilation, set sideEffects flags
          correctly, and avoid barrel exports that defeat shaking.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Prefer named imports, avoid wildcard namespace imports, and keep re-exports explicit so bundlers can prune effectively.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Treat side effects as a correctness feature. Mislabeling can break apps; over-labeling can block shaking.
        </HighlightBlock>

        <h3>Use Named Exports</h3>
        <p>
          Always prefer named exports over default exports for libraries and utilities. Named exports enable 
          selective importing:
        </p>
        <ul className="space-y-1">
          <li>• <strong>Good:</strong> <code>export function formatDate() {}</code></li>
          <li>• <strong>Good:</strong> <code>export {'{'} formatDate, formatCurrency {'}'};</code></li>
          <li>• <strong>Avoid:</strong> <code>export default {'{'} formatDate, formatCurrency {'}'};</code></li>
        </ul>

        <h3>Import Specific Functions</h3>
        <p>
          Import only the functions you need, not the entire module:
        </p>
        <ul className="space-y-1">
          <li>• <strong>Good:</strong> <code>import {'{'} map, filter {'}'} from &apos;lodash-es&apos;;</code></li>
          <li>• <strong>Good:</strong> <code>import map from 'lodash-es/map';</code></li>
          <li>• <strong>Avoid:</strong> <code>import _ from 'lodash';</code></li>
        </ul>

        <h3>Choose Tree-Shakeable Libraries</h3>
        <p>
          When evaluating libraries, check for:
        </p>
        <ul className="space-y-1">
          <li>• ES module format in package.json (<code>"module": "es/index.js"</code>)</li>
          <li>• <code>"sideEffects": false</code> or specific file patterns</li>
          <li>• Documentation mentioning tree shaking support</li>
          <li>• Individual function import paths (e.g., <code>date-fns/format</code>)</li>
        </ul>

        <h3>Configure Babel/TypeScript Correctly</h3>
        <p>
          Ensure your transpiler preserves ES modules for the bundler to analyze:
        </p>
        <ul className="space-y-1">
          <li>• Babel: <code>"modules": false</code> in @babel/preset-env</li>
          <li>• TypeScript: <code>"module": "esnext"</code> in tsconfig.json</li>
          <li>• Let the bundler (Webpack/Vite) handle module transformation</li>
        </ul>

        <h3>Set sideEffects in package.json</h3>
        <p>
          If you publish a library, always include the <code>sideEffects</code> field:
        </p>
        <ul className="space-y-1">
          <li>• <code>"sideEffects": false</code> if your code has no side effects</li>
          <li>• <code>"sideEffects": ["*.css"]</code> if only CSS files have side effects</li>
          <li>• This enables consumers of your library to benefit from tree shaking</li>
        </ul>

        <h3>Verify Tree Shaking is Working</h3>
        <p>
          Use these techniques to confirm tree shaking is active:
        </p>
        <ul className="space-y-1">
          <li>• Run webpack-bundle-analyzer to visualize bundle composition</li>
          <li>• Search the minified bundle for unused function names</li>
          <li>• Compare bundle sizes before and after changing imports</li>
          <li>• Check that lodash-es imports result in ~2 KB, not ~70 KB</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>

        <h3>Using CommonJS Libraries</h3>
        <HighlightBlock as="p" tier="crucial">
          Importing from CommonJS-only libraries (like lodash instead of lodash-es) prevents tree shaking. 
          The entire library is included regardless of which functions you use.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Always prefer ES module versions of libraries. Check the package.json for 
          a <code>"module"</code> field indicating ES module entry point.
        </p>

        <h3>Missing sideEffects Configuration</h3>
        <HighlightBlock as="p" tier="important">
          Without <code>"sideEffects": false</code> in package.json, bundlers conservatively assume all imports 
          have side effects and keep unused code.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Add <code>"sideEffects": false</code> to your library&apos;s package.json, 
          or specify which file patterns have side effects.
        </p>

        <h3>Transpiling to CommonJS</h3>
        <HighlightBlock as="p" tier="important">
          If Babel or TypeScript converts ES modules to CommonJS, tree shaking breaks because the output uses 
          <code>require()</code> instead of <code>import/export</code>.
        </HighlightBlock>
        <p>
          <strong>Solution:</strong> Configure Babel with <code>"modules": false</code> and TypeScript with 
          <code>"module": "esnext"</code>. Let the bundler handle module transformation.
        </p>

        <h3>Namespace Imports</h3>
        <p>
          Using <code>import * as utils from './utils'</code> imports the entire module namespace, which can 
          prevent tree shaking in older bundlers.
        </p>
        <p>
          <strong>Solution:</strong> Use named imports: <code>import {'{'} formatDate, formatCurrency {'}'} from &apos;./utils&apos;;</code>
        </p>

        <h3>Barrel File Bloat</h3>
        <p>
          A barrel file (<code>index.ts</code>) that re-exports 200 components can prevent tree shaking if the 
          bundler can&apos;t determine which imports are pure.
        </p>
        <p>
          <strong>Solution:</strong> Use named re-exports (<code>export {'{'} X {'}'} from &apos;./X&apos;;</code>) or import 
          directly from component files.
        </p>

        <h3>Default Export of Object</h3>
        <p>
          Exporting an object as default (<code>export default {'{'} fn1, fn2, fn3 {'}'};</code>) prevents tree shaking 
          because the entire object is imported together.
        </p>
        <p>
          <strong>Solution:</strong> Use named exports: <code>export function fn1() {}</code>
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-World Use Cases
          ============================================================ */}
      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Use cases: cutting lodash/date lib bloat, reducing vendor chunk size, and making route chunks smaller
          so navigation latency improves.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Use cases should include before/after bundle numbers and whether it improved TBT/INP on mobile.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Mention the ecosystem reality: sometimes the right move is replacing a library that can&apos;t be shaken.
        </HighlightBlock>

        <h3>E-Commerce Site: Lodash Optimization</h3>
        <p>
          An e-commerce site was using lodash throughout the codebase with full imports. Bundle analysis revealed 
          lodash contributed 70 KB to the main bundle, but only 5 functions were actually used (<code>map</code>, 
          <code>filter</code>, <code>groupBy</code>, <code>debounce</code>, <code>throttle</code>).
        </p>
        <p>
          Migration to lodash-es with named imports reduced lodash&apos;s contribution from 70 KB to 8 KB — an 
          89% reduction. The change was straightforward:
        </p>
        <ul className="space-y-1">
          <li>• Replaced <code>import _ from &apos;lodash&apos;;</code> with <code>import {'{'} map, filter, ... {'}'} from &apos;lodash-es&apos;;</code></li>
          <li>• Updated lodash utility calls to use named imports</li>
          <li>• Verified with webpack-bundle-analyzer</li>
        </ul>

        <h3>SaaS Dashboard: Date Library Migration</h3>
        <p>
          A SaaS dashboard used moment.js for date formatting and manipulation. The moment.js bundle was 300 KB, 
          but the application only used 8 functions (<code>format</code>, <code>parse</code>, <code>add</code>, 
          <code>subtract</code>, etc.).
        </p>
        <p>
          Migration to date-fns reduced the date library footprint from 300 KB to ~25 KB (8 functions × ~3 KB 
          each). Additional benefits:
        </p>
        <ul className="space-y-1">
          <li>• Immutable API reduced bugs</li>
          <li>• Better TypeScript support</li>
          <li>• Modern ES module format</li>
        </ul>

        <h3>Design System: Component Library Tree Shaking</h3>
        <p>
          A company&apos;s design system used Material UI with full imports. The component library contributed 
          200+ KB to every page bundle, even though individual pages used only 5-10 components.
        </p>
        <p>
          Switching to direct path imports (<code>import Button from '@mui/material/Button';</code>) enabled 
          tree shaking. Pages now only include the components they actually use:
        </p>
        <ul className="space-y-1">
          <li>• Homepage: 45 KB of MUI components</li>
          <li>• Dashboard: 60 KB of MUI components</li>
          <li>• Settings: 35 KB of MUI components</li>
        </ul>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions & Answers
          ============================================================ */}
      <section>
        <h2>Interview Questions & Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview bar: explain why ESM is required, how side effects affect elimination, and how you verify shaking via build output.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Strong answers talk about tooling (`sideEffects`, module settings) and library selection.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Call out common pitfalls: CommonJS imports, transpiling modules, and barrel files.
        </HighlightBlock>

        <div className="space-y-6">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: What is tree shaking and how does it work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <HighlightBlock as="p" tier="important" className="mb-3">
              Tree shaking is a dead code elimination technique that removes unused exports from JavaScript bundles. 
              It works by:
            </HighlightBlock>
            <ol className="space-y-2">
              <li>
                <strong>Static Analysis:</strong> The bundler parses import/export statements at build time to 
                build a dependency graph.
              </li>
              <li>
                <strong>Marking Used Exports:</strong> Starting from entry points, the bundler traces which 
                exports are actually imported and used.
              </li>
              <li>
                <strong>Elimination:</strong> During minification, unused exports and their associated code are 
                removed from the bundle.
              </li>
            </ol>
            <HighlightBlock as="p" tier="crucial" className="mt-3">
              Tree shaking only works with ES module syntax (<code>import/export</code>) because it requires 
              static analysis. CommonJS (<code>require/module.exports</code>) is dynamically resolved at runtime, 
              preventing tree shaking.
            </HighlightBlock>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: Why doesn't tree shaking work with CommonJS?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Tree shaking doesn&apos;t work with CommonJS because <code>require()</code> is a runtime function 
              call, not a static declaration. The bundler cannot determine at build time which exports will be 
              used because:
            </p>
            <ul className="space-y-1">
              <li>• <code>require()</code> can be conditional: <code>if (condition) require('a'); else require('b');</code></li>
              <li>• <code>require()</code> can be dynamic: <code>require('module-' + name);</code></li>
              <li>• Destructuring happens at runtime: <code>const {'{'} x {'}'} = require(&apos;module&apos;);</code></li>
            </ul>
            <p className="mt-3">
              ES modules use static <code>import/export</code> syntax that is fixed at build time, enabling the 
              bundler to analyze and eliminate unused code.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: What is the sideEffects field in package.json and why does it matter?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              The <code>sideEffects</code> field tells bundlers whether a module has side effects — code that 
              runs just by being imported, like modifying global state or importing CSS.
            </p>
            <p className="mb-3">
              Values:
            </p>
            <ul className="space-y-1">
              <li>• <code>"sideEffects": false</code> — No side effects; all unused exports can be tree-shaken</li>
              <li>• <code>"sideEffects": ["*.css"]</code> — Only CSS files have side effects; JS can be tree-shaken</li>
              <li>• <code>"sideEffects": true</code> (or omitted) — Assume all code has side effects; keep everything</li>
            </ul>
            <p className="mt-3">
              Without <code>"sideEffects": false</code>, bundlers conservatively keep all code even if exports 
              are unused, preventing tree shaking.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: How would you verify that tree shaking is working in your project?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              I would use multiple verification methods:
            </p>
            <ol className="space-y-2">
              <li>
                <strong>Bundle Analyzer:</strong> Run webpack-bundle-analyzer or rollup-plugin-visualizer to 
                see exactly what&apos;s in the bundle. If I import one function from lodash-es and see the 
                entire library, tree shaking isn&apos;t working.
              </li>
              <li>
                <strong>Search Built Output:</strong> Search the minified bundle for unused function names. 
                If they appear, tree shaking failed.
              </li>
              <li>
                <strong>Size Comparison:</strong> Compare bundle sizes before and after changing from full 
                imports to named imports. A significant reduction indicates tree shaking is working.
              </li>
              <li>
                <strong>Configuration Audit:</strong> Verify <code>sideEffects: false</code> in package.json, 
                correct Babel/TypeScript module settings, and production mode is enabled.
              </li>
            </ol>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: What are common mistakes that prevent tree shaking from working?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Common mistakes include:
            </p>
            <ul className="space-y-1">
              <li>• <strong>Using CommonJS libraries:</strong> Importing from lodash instead of lodash-es prevents tree shaking.</li>
              <li>• <strong>Missing sideEffects configuration:</strong> Without <code>"sideEffects": false</code>, bundlers keep all code.</li>
              <li>• <strong>Transpiling to CommonJS:</strong> Babel/TypeScript converting ES modules to CommonJS breaks tree shaking.</li>
              <li>• <strong>Namespace imports:</strong> <code>import * as utils</code> can prevent tree shaking in some bundlers.</li>
              <li>• <strong>Default export of objects:</strong> <code>export default {'{'} fn1, fn2 {'}'}</code> prevents selective importing.</li>
              <li>• <strong>Barrel file bloat:</strong> Poorly structured index files can prevent bundlers from determining unused exports.</li>
            </ul>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 6: Compare moment.js vs date-fns from a tree shaking perspective.</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              <strong>moment.js:</strong>
            </p>
            <ul className="space-y-1">
              <li>• CommonJS module format — not tree-shakeable</li>
              <li>• Monolithic ~300 KB bundle regardless of usage</li>
              <li>• Even using one function includes the entire library</li>
              <li>• Includes all locales by default (~100+ KB extra)</li>
            </ul>
            <p className="mb-3 mt-3">
              <strong>date-fns:</strong>
            </p>
            <ul className="space-y-1">
              <li>• ES module format — fully tree-shakeable</li>
              <li>• Each function is a separate export (~3 KB each)</li>
              <li>• Only imported functions are included in bundle</li>
              <li>• Using 8 functions = ~24 KB vs moment&apos;s 300 KB</li>
            </ul>
            <p className="mt-3">
              For a project using 5-10 date functions, date-fns provides 90%+ bundle size reduction compared 
              to moment.js through tree shaking.
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
              href="https://webpack.js.org/guides/tree-shaking/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Webpack Documentation — Tree Shaking
            </a>
            <p className="text-sm text-muted mt-1">
              Official Webpack guide covering tree shaking implementation and configuration.
            </p>
          </li>
          <li>
            <a 
              href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              MDN — ES Module Imports
            </a>
            <p className="text-sm text-muted mt-1">
              Documentation on ES module syntax and static import/export behavior.
            </p>
          </li>
          <li>
            <a 
              href="https://vitejs.dev/guide/features.html#production" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Vite Documentation — Production Build
            </a>
            <p className="text-sm text-muted mt-1">
              How Vite handles tree shaking in production builds using Rollup.
            </p>
          </li>
          <li>
            <a 
              href="https://date-fns.org/docs/Getting-Started" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              date-fns Documentation
            </a>
            <p className="text-sm text-muted mt-1">
              Example of a tree-shakeable library with ES module exports.
            </p>
          </li>
          <li>
            <a 
              href="https://www.smashingmagazine.com/2020/09/reducing-bundle-size-tree-shaking/" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Smashing Magazine — Reducing Bundle Size with Tree Shaking
            </a>
            <p className="text-sm text-muted mt-1">
              Practical guide to implementing tree shaking in real-world projects.
            </p>
          </li>
          <li>
            <a 
              href="https://github.com/webpack/webpack/tree/main/examples/harmony-unused" 
              className="text-accent hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Webpack Examples — Harmony Unused
            </a>
            <p className="text-sm text-muted mt-1">
              Webpack example demonstrating unused export elimination.
            </p>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
