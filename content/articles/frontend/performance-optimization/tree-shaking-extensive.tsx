"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { MermaidDiagram } from "@/components/articles/MermaidDiagram";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-tree-shaking-extensive",
  title: "Tree Shaking",
  description: "Comprehensive guide to tree shaking, dead code elimination, and optimizing JavaScript bundles through static analysis.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "tree-shaking",
  version: "extensive",
  wordCount: 10800,
  readingTime: 43,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "tree-shaking", "dead-code", "webpack", "bundling"],
  relatedTopics: ["code-splitting", "bundle-size-optimization", "minification-and-uglification"],
};

export default function TreeShakingExtensiveArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition & Context</h2>
        <p>
          <strong>Tree shaking</strong> is a form of dead code elimination that leverages the static structure of
          ES2015 module syntax to detect and remove unused exports from JavaScript bundles at build time. The term
          was popularized by the Rollup bundler and is now a core optimization in all major bundlers — Webpack,
          Vite, Rollup, esbuild, and Parcel.
        </p>
        <p>
          The name comes from the mental image of a module dependency tree: if you "shake" the tree, dead leaves
          (unused exports) fall off. Unlike traditional dead code elimination that operates on individual files,
          tree shaking works across module boundaries — it can determine that an exported function in file A
          is never imported by any other module in the entire application, and therefore the function (and all code
          it depends on) can be safely removed from the final bundle.
        </p>
        <p>
          The impact is substantial. Consider a UI library with 200 components: if your application uses 15 of them,
          tree shaking removes the other 185 components from your bundle. For a library like lodash, which exports
          ~300 utility functions, importing just <code>map</code> and <code>filter</code> with proper tree shaking
          reduces the bundled size from ~70KB to ~4KB — a 94% reduction.
        </p>
        <p>
          Tree shaking is fundamentally enabled by ES modules' static structure: all <code>import</code> and
          <code>export</code> statements must appear at the top level of a module, can't be conditional, and their
          identifiers are known at parse time. This is what makes tree shaking possible — and why it doesn't work
          with CommonJS's dynamic <code>require()</code>.
        </p>
      </section>

      <section>
        <h2>How Tree Shaking Works Internally</h2>
        <p>
          Tree shaking operates in three phases during the bundling process. Understanding these phases helps you
          write code that tree-shakes effectively.
        </p>

        <MermaidDiagram
          chart={`flowchart TD
    A[Parse all modules] --> B[Build dependency graph]
    B --> C[Mark Phase: trace used exports from entry points]
    C --> D{Is export referenced?}
    D -->|Yes| E[Mark as USED]
    D -->|No| F[Mark as UNUSED]
    E --> G[Include in output]
    F --> H{Has side effects?}
    H -->|Yes| I[Keep the side-effectful code]
    H -->|No| J[Remove entirely]
    G --> K[Minification Phase]
    I --> K
    K --> L[Final Bundle]`}
          caption="Tree shaking phases — from parsing to final dead code removal"
        />

        <h3 className="mt-6 font-semibold">Phase 1: Module Parsing & Graph Construction</h3>
        <p>
          The bundler starts from entry points and follows every <code>import</code> statement to discover all
          modules in the application. It builds a dependency graph where each node is a module and each edge
          is an import relationship. Crucially, it records which specific exports each import references.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// The bundler sees these relationships:

// entry.js
import { Button } from './components';  // References: Button
import { formatDate } from './utils';   // References: formatDate

// components/index.js (barrel file)
export { Button } from './Button';       // Re-exports: Button
export { Input } from './Input';         // Re-exports: Input (unreferenced!)
export { Select } from './Select';       // Re-exports: Select (unreferenced!)

// utils.js
export function formatDate() { ... }     // Referenced by entry.js
export function formatCurrency() { ... } // Unreferenced!
export function parseDate() { ... }      // Unreferenced!

// Dependency graph with usage info:
// entry.js → Button (from components) ✓
// entry.js → formatDate (from utils) ✓
// components → Button ✓, Input ✗, Select ✗
// utils → formatDate ✓, formatCurrency ✗, parseDate ✗`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Phase 2: Mark & Sweep</h3>
        <p>
          Starting from used exports, the bundler traces all internal references to determine the complete set
          of code needed. Anything not reachable from a used export is a candidate for removal.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// utils.js — detailed trace example

// USED (imported by entry.js)
export function formatDate(date) {
  return internalFormat(date, 'date');  // References internalFormat → KEEP
}

// USED (referenced by formatDate)
function internalFormat(value, type) {
  const config = getConfig(type);  // References getConfig → KEEP
  return config.formatter(value);
}

// USED (referenced by internalFormat)
function getConfig(type) {
  return CONFIGS[type];  // References CONFIGS → KEEP
}

// USED (referenced by getConfig)
const CONFIGS = {
  date: { formatter: (d) => d.toLocaleDateString() },
  currency: { formatter: (n) => n.toFixed(2) },
};

// UNUSED (never imported or referenced from used code)
export function formatCurrency(amount) {
  return '$' + internalFormat(amount, 'currency');
}
// Even though formatCurrency uses internalFormat (which IS kept),
// formatCurrency itself is removed because no entry point uses it.

// UNUSED
export function parseDate(str) {
  return new Date(str);
}
// parseDate and all its internal helpers are removed.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Phase 3: Minification & Dead Code Removal</h3>
        <p>
          The actual removal happens during minification (Terser, esbuild, SWC). The bundler annotates unused
          exports, and the minifier removes them along with any code that becomes unreachable. Webpack uses
          the <code>/*#__PURE__*/</code> annotation to help the minifier identify safe-to-remove function calls.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// Webpack's intermediate output (before minification):

/* unused harmony export formatCurrency */
/* unused harmony export parseDate */

// The minifier sees these annotations and removes the exports.
// Without the annotations, the minifier can't know if removal is safe.

// The /*#__PURE__*/ annotation marks function calls as side-effect free:
const Button = /*#__PURE__*/ React.forwardRef((props, ref) => {
  // ...
});
// If Button is unused, the minifier knows React.forwardRef() call
// can be safely removed (it doesn't modify global state).`}</code>
        </pre>
      </section>

      <section>
        <h2>ES Modules vs CommonJS</h2>
        <p>
          Tree shaking's reliance on ES module syntax is the single most important thing to understand. Let's look at
          why CommonJS can't be tree-shaken.
        </p>

        <MermaidDiagram
          chart={`graph TD
    subgraph "ES Modules ✅ Tree-Shakeable"
        A[Static imports at top level] --> B[Known at parse time]
        B --> C[Bundler builds exact usage graph]
        C --> D[Unused exports removed]
    end

    subgraph "CommonJS ❌ NOT Tree-Shakeable"
        E["Dynamic require() calls"] --> F[Resolved at runtime]
        F --> G[Bundler can't determine usage]
        G --> H[Entire module included]
    end`}
          caption="ES Modules enable tree shaking through static analysis; CommonJS prevents it"
        />

        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === ES Modules — Statically Analyzable ===

// These MUST be at the top level, can't be conditional:
import { map } from 'lodash-es';     // ✅ Bundler knows: only 'map' used
import { format } from 'date-fns';   // ✅ Bundler knows: only 'format' used

// These are COMPILE-TIME constructs — the bundler resolves them
// before any code runs.

// === CommonJS — Dynamic, Runtime-Resolved ===

// require() is just a function call — it can appear anywhere:
const _ = require('lodash');           // Imports entire module
const { map } = require('lodash');     // Still imports entire module!

// Can be conditional — bundler can't predict which branch runs:
if (process.env.NODE_ENV === 'production') {
  require('./analytics');
}

// Can be computed — bundler can't know the module path:
const moduleName = getModuleName();
require(moduleName);

// module.exports is an object assignment — any property could be used:
module.exports = { map, filter, reduce };
// Bundler can't know which properties consumers will access

// === Hybrid Approach (some libraries) ===
// Library provides both ESM and CJS versions:
{
  "main": "dist/cjs/index.js",      // CommonJS entry (Node.js)
  "module": "dist/esm/index.js",    // ES module entry (bundlers prefer this)
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    }
  }
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Side Effects</h2>
        <p>
          Side effects are the main challenge for tree shaking. A side effect is any code that affects state
          outside its own module when imported — modifying globals, adding CSS, running polyfills, or mutating
          prototypes. The bundler must keep side-effectful code even if no exports are used.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Examples of Side Effects ===

// CSS import — modifies document styles
import './button.css';  // SIDE EFFECT — must keep

// Polyfill — modifies global scope
import 'core-js/features/array/flat';  // SIDE EFFECT — adds Array.flat

// Module-level code that runs on import
let instanceCount = 0;
export class Widget {
  constructor() {
    instanceCount++;  // Side effect happens inside constructor, not on import
  }
}
// BUT if the module has top-level code that runs:
console.log('Widget module loaded');  // SIDE EFFECT — runs on import
registerAnalytics('widget-loaded');    // SIDE EFFECT

// === Marking Side-Effect-Free Packages ===

// package.json — entire package is pure
{
  "name": "my-utils",
  "sideEffects": false
}
// Tells bundler: "If nothing from this module is imported,
// it's safe to skip the entire module."

// package.json — most files are pure, except specific ones
{
  "name": "my-ui-lib",
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js",
    "./src/register-components.js"
  ]
}
// Bundler will ALWAYS include files matching these patterns,
// but tree-shake everything else.

// === Webpack sideEffects optimization ===
// webpack.config.js
module.exports = {
  optimization: {
    sideEffects: true,  // Enable sideEffects flag optimization (default in production)
  },
  module: {
    rules: [
      {
        test: /\\.css$/,
        sideEffects: true,  // CSS files always have side effects
      },
    ],
  },
};`}</code>
        </pre>
      </section>

      <section>
        <h2>Writing Tree-Shakeable Code</h2>

        <h3 className="mt-4 font-semibold">Named Exports Over Default Exports</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ✅ BEST — Named exports, individually tree-shakeable
export function Button() { /* ... */ }
export function Input() { /* ... */ }
export function Select() { /* ... */ }

// ✅ OK — Default export of a single thing
export default function App() { /* ... */ }

// ❌ BAD — Default export of an object (NOT tree-shakeable)
export default {
  Button,
  Input,
  Select,
};
// The entire object is the single export — bundler can't remove
// individual properties. If you import this, you get all three.

// ❌ BAD — Class with static methods (NOT tree-shakeable per-method)
export class StringUtils {
  static capitalize(s) { ... }
  static truncate(s, n) { ... }
  static slugify(s) { ... }
}
// If you use StringUtils.capitalize, you get all methods.

// ✅ GOOD — Individual function exports
export function capitalize(s) { ... }
export function truncate(s, n) { ... }
export function slugify(s) { ... }
// Only the functions you import end up in the bundle.`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Barrel Files (Index Re-Exports)</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ✅ GOOD barrel file — pure re-exports
// components/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';
export { Modal } from './Modal';
export { Tooltip } from './Tooltip';

// Consumer:
import { Button } from './components';
// Only Button's code is included (with proper sideEffects: false)

// ⚠️ RISKY barrel file — imports then re-exports
// components/index.ts
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
export { Button, Input, Select };
// Some bundlers handle this fine; others include everything

// ❌ PROBLEMATIC — barrel file with side effects
// components/index.ts
import { Button } from './Button';
import './Button.css';  // Side effect!
import { Input } from './Input';
import './Input.css';   // Side effect!
// ALL CSS files are included even if only Button is imported

// ✅ BETTER — co-locate CSS with components
// Button.tsx
import './Button.css';  // Side effect stays with its component
export function Button() { /* ... */ }

// === Deep import paths as alternative ===
// Instead of barrel imports:
import { Button } from '@my-lib';

// Use direct paths for guaranteed tree shaking:
import { Button } from '@my-lib/Button';

// Package.json exports map to support both:
{
  "exports": {
    ".": "./src/index.ts",
    "./Button": "./src/Button.tsx",
    "./Input": "./src/Input.tsx"
  }
}`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Pure Annotations</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// The /*#__PURE__*/ annotation tells minifiers a function call
// has no side effects and can be removed if its result is unused.

// Without annotation — minifier keeps the call (might have side effects)
const memoized = memoize(expensiveFunction);

// With annotation — minifier can remove if 'memoized' is unused
const memoized = /*#__PURE__*/ memoize(expensiveFunction);

// React uses this extensively:
const Button = /*#__PURE__*/ React.memo(function Button(props) {
  return <button>{props.children}</button>;
});

const StyledButton = /*#__PURE__*/ styled.button\`
  color: blue;
\`;

// Babel plugins add these automatically for common patterns:
// @babel/plugin-transform-react-pure-annotations
// Adds /*#__PURE__*/ to React.createElement, React.forwardRef, etc.

// === Webpack's usedExports optimization ===
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,   // Mark unused exports (default in production)
    minimize: true,       // Remove marked unused exports via minifier
    concatenateModules: true,  // Scope hoisting — enables better elimination
  },
};`}</code>
        </pre>
      </section>

      <section>
        <h2>Bundler-Specific Configuration</h2>

        <h3 className="mt-4 font-semibold">Webpack</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// webpack.config.js
module.exports = {
  mode: 'production', // Enables tree shaking, minification, scope hoisting

  optimization: {
    usedExports: true,        // Mark unused exports
    sideEffects: true,        // Respect sideEffects in package.json
    concatenateModules: true, // Scope hoisting for better dead code elimination
    minimize: true,           // Run Terser to remove dead code
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            dead_code: true,
            drop_console: true,     // Remove console.log
            pure_funcs: ['console.info', 'console.debug'],
          },
          mangle: true,
        },
      }),
    ],
  },

  // Important: don't compile imports to require()
  module: {
    rules: [
      {
        test: /\\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: false, // ← CRITICAL: keep ES modules
              }],
            ],
          },
        },
      },
    ],
  },
};`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">Vite / Rollup</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Rollup handles tree shaking automatically
    // It's the gold standard — aggressive and effective
    rollupOptions: {
      output: {
        // Ensure we're outputting ES modules
        format: 'es',
      },
      // Mark specific modules as external (not bundled)
      external: ['react', 'react-dom'],
    },
    // Target modern browsers for better tree shaking
    target: 'es2020',
    minify: 'terser', // or 'esbuild' (faster but less aggressive)
  },
});

// Rollup is more aggressive than Webpack at tree shaking:
// - Better scope analysis
// - More effective at removing unused class methods
// - Handles re-exports more cleanly`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">TypeScript Configuration</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// tsconfig.json — ensure ESM output
{
  "compilerOptions": {
    "module": "esnext",      // ← Output ES modules (NOT "commonjs")
    "moduleResolution": "bundler", // Let bundler handle resolution
    "target": "es2020",      // Modern JS features
    "isolatedModules": true, // Required for esbuild/SWC compatibility

    // DON'T use these — they break tree shaking:
    // "module": "commonjs"  ← Converts import to require()
    // "esModuleInterop": true + namespace import patterns
  }
}`}</code>
        </pre>
      </section>

      <section>
        <h2>Library Selection for Tree Shaking</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme">
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Not Tree-Shakeable</th>
              <th className="p-3 text-left">Tree-Shakeable Alternative</th>
              <th className="p-3 text-left">Size Difference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            <tr>
              <td className="p-3"><strong>Utilities</strong></td>
              <td className="p-3">lodash (~70KB)</td>
              <td className="p-3">lodash-es (~2KB per fn)</td>
              <td className="p-3">~95% smaller</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Dates</strong></td>
              <td className="p-3">moment (~300KB)</td>
              <td className="p-3">date-fns (~3KB per fn)</td>
              <td className="p-3">~99% smaller</td>
            </tr>
            <tr>
              <td className="p-3"><strong>HTTP</strong></td>
              <td className="p-3">axios (~14KB full)</td>
              <td className="p-3">ky (~3.5KB) or native fetch</td>
              <td className="p-3">~75% smaller</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Validation</strong></td>
              <td className="p-3">joi (~35KB)</td>
              <td className="p-3">zod (~13KB, tree-shakeable)</td>
              <td className="p-3">~63% smaller</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Icons</strong></td>
              <td className="p-3">font-awesome (all icons, ~300KB)</td>
              <td className="p-3">lucide-react (per-icon import, ~1KB each)</td>
              <td className="p-3">~99% smaller</td>
            </tr>
            <tr>
              <td className="p-3"><strong>Animation</strong></td>
              <td className="p-3">gsap (~30KB full)</td>
              <td className="p-3">framer-motion (tree-shakeable)</td>
              <td className="p-3">Depends on usage</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Debugging Tree Shaking Issues</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Step 1: Check if modules are ESM ===
// Look at the library's package.json:
// "module" field → ESM entry (good)
// "type": "module" → ESM package (good)
// Only "main" field → likely CommonJS (bad)

// === Step 2: Check your transpilation ===
// Babel should NOT convert imports to require:
// .babelrc
{
  "presets": [
    ["@babel/preset-env", { "modules": false }]  // ← Keep ES modules
  ]
}

// === Step 3: Use Webpack stats ===
// webpack.config.js
module.exports = {
  stats: {
    usedExports: true,    // Show which exports are used
    optimizationBailout: true,  // Show WHY tree shaking failed
  },
};

// Run: npx webpack --stats-reasons
// Output shows why each module was included

// === Step 4: Bundle Analyzer ===
// Install: pnpm add -D webpack-bundle-analyzer
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};

// Look for:
// - Unexpectedly large modules
// - Libraries you only partially import showing full size
// - node_modules that should be smaller

// === Step 5: Check for scope hoisting ===
// Webpack's ModuleConcatenationPlugin (scope hoisting) enables
// better tree shaking. If it bails out, check the stats:
// "ModuleConcatenation bailout: Module is not an ECMAScript module"
// This means the module uses CommonJS → can't be tree-shaken

// === Step 6: importCost VS Code extension ===
// Shows the import cost inline in your editor
// import { map } from 'lodash';     // 70.7KB (red — full library!)
// import { map } from 'lodash-es';  // 2.1KB  (green — tree-shaken)`}</code>
        </pre>
      </section>

      <section>
        <h2>Advanced: Scope Hoisting</h2>
        <p>
          Scope hoisting (Webpack's <code>ModuleConcatenationPlugin</code>) merges modules into a single scope
          where possible, enabling the minifier to perform better dead code elimination. Without scope hoisting,
          each module is wrapped in a function closure that the minifier can't analyze across.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// === Without scope hoisting (module wrappers) ===

// Webpack wraps each module:
__webpack_modules__["./utils.js"] = function(module, exports) {
  // Module code here — minifier can't see across boundaries
  function formatDate() { ... }
  function unused() { ... }  // Harder to eliminate
  exports.formatDate = formatDate;
  exports.unused = unused;
};

// === With scope hoisting (concatenated) ===

// Webpack inlines modules into one scope:
// (from utils.js)
function formatDate() { ... }
// unused() is gone — minifier can easily see it's unreferenced

// (from entry.js)
console.log(formatDate(new Date()));

// Benefits of scope hoisting:
// 1. Fewer function wrappers → smaller bundle
// 2. Better minification — names can be mangled across modules
// 3. Better dead code elimination — full scope visibility
// 4. Slightly faster runtime — no module lookup overhead`}</code>
        </pre>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Transpiling ES modules to CommonJS:</strong> This is the #1 tree shaking killer. If Babel's
            <code>@babel/preset-env</code> has <code>modules: "auto"</code> or <code>modules: "commonjs"</code>,
            it converts all <code>import</code>/<code>export</code> to <code>require</code>/<code>module.exports</code>,
            completely breaking tree shaking. Always set <code>modules: false</code>.
          </li>
          <li>
            <strong>Missing sideEffects flag:</strong> Without <code>"sideEffects": false</code> in package.json,
            Webpack assumes every file in the package might have side effects and includes them all. This is the
            most common reason barrel file imports don't tree-shake.
          </li>
          <li>
            <strong>Using CommonJS libraries:</strong> Libraries like lodash (CJS), moment (CJS), and jQuery (CJS)
            can't be tree-shaken regardless of your bundler config. Always prefer ESM alternatives.
          </li>
          <li>
            <strong>Barrel file problems:</strong> A <code>components/index.ts</code> that re-exports 100 components
            can cause all 100 to be included if: (a) the barrel file has side effects, (b) <code>sideEffects: false</code>
            is missing, or (c) the re-exports involve complex patterns the bundler can't analyze.
          </li>
          <li>
            <strong>Development mode doesn't tree-shake:</strong> Webpack's development mode (<code>mode: "development"</code>)
            disables tree shaking for faster builds. Always test bundle sizes in production mode.
          </li>
          <li>
            <strong>Default export of objects/classes:</strong> Exporting a single object with many methods
            (<code>export default {'{ fn1, fn2, fn3 }'}</code>) prevents tree shaking of individual methods. Use
            named exports instead.
          </li>
          <li>
            <strong>Dynamic property access:</strong> <code>utils[methodName]()</code> prevents the bundler from
            determining which properties are used. Use explicit named imports.
          </li>
          <li>
            <strong>CSS-in-JS side effects:</strong> Libraries like styled-components create styles as side effects.
            The bundler can't remove unused styled components without explicit <code>/*#__PURE__*/</code> annotations.
          </li>
        </ul>
      </section>

      <section>
        <h2>Best Practices Summary</h2>
        <ol className="space-y-3">
          <li>
            <strong>Use ES module syntax exclusively:</strong> <code>import</code>/<code>export</code> everywhere.
            Configure Babel/TypeScript to preserve ES modules (<code>modules: false</code>, <code>"module": "esnext"</code>).
          </li>
          <li>
            <strong>Set sideEffects in package.json:</strong> Mark your packages as side-effect-free, with
            exceptions for CSS and polyfill files. This is the single most impactful action for tree shaking.
          </li>
          <li>
            <strong>Prefer named exports:</strong> They're individually tree-shakeable. Avoid default exports of
            objects, classes with many methods, or namespace exports.
          </li>
          <li>
            <strong>Choose ESM libraries:</strong> lodash-es over lodash, date-fns over moment, lucide-react
            over font-awesome. Check the library's package.json for a <code>"module"</code> field.
          </li>
          <li>
            <strong>Be careful with barrel files:</strong> Use re-export syntax (<code>export {'{ X }'} from './X'</code>)
            rather than import-then-export. Keep barrel files side-effect-free.
          </li>
          <li>
            <strong>Analyze your bundle regularly:</strong> Use webpack-bundle-analyzer or rollup-plugin-visualizer
            in CI to catch tree-shaking regressions. Set size budgets.
          </li>
          <li>
            <strong>Use pure annotations:</strong> Add <code>/*#__PURE__*/</code> to wrapper function calls
            (React.memo, styled(), memoize()) to help the minifier eliminate unused code.
          </li>
          <li>
            <strong>Enable scope hoisting:</strong> Use Webpack's <code>concatenateModules: true</code> (default in
            production) for better cross-module dead code elimination.
          </li>
        </ol>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-3">
          <li>
            Tree shaking is dead code elimination that works across module boundaries — it removes unused exports
            from the final bundle by analyzing the static structure of ES module <code>import</code>/<code>export</code> statements.
          </li>
          <li>
            It only works with ES modules because they're statically analyzable — imports/exports must be top-level
            and known at parse time. CommonJS <code>require()</code> is dynamic and can't be analyzed.
          </li>
          <li>
            The <code>"sideEffects": false</code> flag in package.json is critical — it tells the bundler that
            unused imports can be safely removed without breaking side effects like CSS or polyfills.
          </li>
          <li>
            Named exports are individually tree-shakeable; default exports of objects are not. This influences
            how libraries should structure their API surface.
          </li>
          <li>
            Library choice has massive impact: lodash (~70KB) vs lodash-es (~2KB per function), moment (~300KB) vs
            date-fns (~3KB per function). ESM versions enable 90%+ size reductions.
          </li>
          <li>
            Common pitfalls: Babel transpiling to CommonJS, missing sideEffects flag, barrel file side effects,
            development mode not tree-shaking, and dynamic property access.
          </li>
          <li>
            Scope hoisting merges modules into a single scope, enabling better dead code elimination by giving
            the minifier full visibility across module boundaries.
          </li>
        </ul>
      </section>

      <section>
        <h2>References & Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://webpack.js.org/guides/tree-shaking/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Webpack — Tree Shaking Guide
            </a>
          </li>
          <li>
            <a href="https://rollupjs.org/introduction/#tree-shaking" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Rollup — Tree Shaking
            </a>
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              MDN — Tree Shaking Glossary
            </a>
          </li>
          <li>
            <a href="https://web.dev/reduce-javascript-payloads-with-tree-shaking/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              web.dev — Reduce JavaScript Payloads with Tree Shaking
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
