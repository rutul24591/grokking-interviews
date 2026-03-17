"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-tree-shaking-concise",
  title: "Tree Shaking",
  description: "Quick overview of tree shaking for eliminating dead code from JavaScript bundles.",
  category: "frontend",
  subcategory: "performance-optimization",
  slug: "tree-shaking",
  version: "concise",
  wordCount: 2600,
  readingTime: 11,
  lastUpdated: "2026-03-09",
  tags: ["frontend", "performance", "tree-shaking", "dead-code", "webpack", "bundling"],
  relatedTopics: ["code-splitting", "bundle-size-optimization", "minification-and-uglification"],
};

export default function TreeShakingConciseArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Quick Overview</h2>
        <p>
          <strong>Tree shaking</strong> is a dead code elimination technique used by JavaScript bundlers to remove
          unused exports from your final bundle. When you import a single function from a library, tree shaking
          ensures only that function (and its dependencies) ends up in the output — not the entire library.
        </p>
        <p>
          The term comes from the mental model of "shaking" a dependency tree and watching the dead (unused)
          leaves fall off. Tree shaking relies on the static structure of ES modules (<code>import</code>/<code>export</code>)
          to determine at build time which exports are used and which can be safely removed.
        </p>
      </section>

      <section>
        <h2>How It Works</h2>
        <ul className="space-y-2">
          <li>
            <strong>Static Analysis:</strong> The bundler analyzes all <code>import</code> and <code>export</code>
            statements to build a graph of what's actually used.
          </li>
          <li>
            <strong>Mark Phase:</strong> Starting from entry points, the bundler marks every referenced export
            as "used." Unreferenced exports are marked as "unused."
          </li>
          <li>
            <strong>Sweep Phase:</strong> During minification, unused exports and their associated code are removed
            from the output.
          </li>
        </ul>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// utils.js — library with multiple exports
export function formatDate(date) {   // USED → kept in bundle
  return date.toLocaleDateString();
}

export function formatCurrency(amount) {  // USED → kept in bundle
  return \`$\${amount.toFixed(2)}\`;
}

export function formatPhoneNumber(phone) {  // UNUSED → removed
  return phone.replace(/(\\d{3})(\\d{3})(\\d{4})/, '($1) $2-$3');
}

export function formatSSN(ssn) {  // UNUSED → removed
  return ssn.replace(/(\\d{3})(\\d{2})(\\d{4})/, '$1-$2-$3');
}

// app.js — only imports two functions
import { formatDate, formatCurrency } from './utils';

console.log(formatDate(new Date()));
console.log(formatCurrency(29.99));

// Final bundle only contains formatDate and formatCurrency
// formatPhoneNumber and formatSSN are completely removed`}</code>
        </pre>
      </section>

      <section>
        <h2>Why ES Modules Matter</h2>
        <p>
          Tree shaking <strong>only works with ES module syntax</strong> (<code>import</code>/<code>export</code>),
          not CommonJS (<code>require</code>/<code>module.exports</code>). The key difference:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ✅ ES Modules — statically analyzable
import { map } from 'lodash-es';
// Bundler knows at build time exactly which export is used

// ❌ CommonJS — NOT tree-shakeable
const { map } = require('lodash');
// require() is a runtime function — bundler can't analyze statically
// The entire lodash library (~70KB min) gets included

// ❌ Dynamic imports are NOT tree-shakeable either
const utils = await import('./utils');
// Bundler doesn't know which exports will be used at runtime

// ✅ But named imports from dynamic imports CAN be
const { formatDate } = await import('./utils');
// Some bundlers can optimize this`}</code>
        </pre>
      </section>

      <section>
        <h2>Making Your Code Tree-Shakeable</h2>

        <h3 className="mt-4 font-semibold">1. Use Named Exports</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ✅ GOOD — Named exports are tree-shakeable
export function Button() { /* ... */ }
export function Input() { /* ... */ }
export function Select() { /* ... */ }

// ❌ BAD — Default export of object is NOT tree-shakeable
export default {
  Button: () =&gt; { /* ... */ },
  Input: () =&gt; { /* ... */ },
  Select: () =&gt; { /* ... */ },
};

// ✅ GOOD — Barrel file with named re-exports
// components/index.js
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';

// ❌ BAD — Barrel file that eagerly imports everything
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
export { Button, Input, Select };`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">2. Mark Side-Effect-Free Packages</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// package.json — tells bundler this package has no side effects
{
  "name": "my-ui-library",
  "sideEffects": false
}

// If some files DO have side effects (CSS imports, polyfills):
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}

// A side effect is code that runs just by being imported:
import './global-styles.css';      // Side effect — modifies global styles
import './polyfill';               // Side effect — modifies global scope
import { format } from './utils';  // Pure — only used if format() is called`}</code>
        </pre>

        <h3 className="mt-6 font-semibold">3. Choose Tree-Shakeable Libraries</h3>
        <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
          <code>{`// ❌ lodash — CommonJS, entire library bundled
import { map } from 'lodash';  // ~70KB

// ✅ lodash-es — ES module version, tree-shakeable
import { map } from 'lodash-es';  // ~2KB (just map + deps)

// ✅ Individual lodash packages
import map from 'lodash/map';  // ~2KB

// ❌ moment.js — monolithic, not tree-shakeable (~300KB)
import moment from 'moment';

// ✅ date-fns — ES modules, fully tree-shakeable
import { format, addDays } from 'date-fns';  // ~3KB vs 300KB

// ❌ Full Material UI import
import { Button, TextField } from '@mui/material';
// May still import large chunks depending on bundler

// ✅ Direct path imports (guaranteed minimal)
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';`}</code>
        </pre>
      </section>

      <section>
        <h2>Verifying Tree Shaking</h2>
        <ul className="space-y-2">
          <li>
            <strong>Bundle Analyzer:</strong> Run <code>webpack-bundle-analyzer</code> or Vite's visualizer to see
            what's in your bundle. If you import one function from lodash-es and see the whole library, tree shaking
            isn't working.
          </li>
          <li>
            <strong>Build Output Size:</strong> Compare production bundle sizes before and after changes. A properly
            tree-shaken import should add minimal size.
          </li>
          <li>
            <strong>Search Built Output:</strong> Search the minified output for known function names from libraries
            you only partially import. If unused functions appear, tree shaking failed.
          </li>
        </ul>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-2">
          <li>
            <strong>Using CommonJS libraries:</strong> <code>require()</code> can't be statically analyzed.
            Always prefer ES module versions (lodash-es vs lodash, date-fns vs moment).
          </li>
          <li>
            <strong>Missing <code>sideEffects: false</code>:</strong> Without this flag, bundlers conservatively
            assume all imported files have side effects and keep them.
          </li>
          <li>
            <strong>Barrel file bloat:</strong> A <code>index.ts</code> that re-exports 200 components can prevent
            tree shaking if the bundler can't determine which imports are pure.
          </li>
          <li>
            <strong>Transpiling to CommonJS:</strong> If Babel or TypeScript compiles your ES modules to CommonJS,
            tree shaking breaks. Ensure <code>modules: false</code> in Babel and <code>"module": "esnext"</code> in tsconfig.
          </li>
          <li>
            <strong>Namespace imports:</strong> <code>import * as utils from './utils'</code> can prevent tree shaking
            in older bundlers. Named imports are always safest.
          </li>
        </ul>
      </section>

      <section>
        <h2>Interview Talking Points</h2>
        <ul className="space-y-2">
          <li>
            Tree shaking removes unused exports from bundles by analyzing the static structure of ES modules at
            build time.
          </li>
          <li>
            It only works with ES module syntax (<code>import</code>/<code>export</code>), not CommonJS
            (<code>require</code>). This is because ES modules are statically analyzable.
          </li>
          <li>
            The <code>sideEffects: false</code> field in package.json tells bundlers it's safe to remove unused
            exports — without it, bundlers conservatively keep everything.
          </li>
          <li>
            Library choice matters: lodash-es vs lodash, date-fns vs moment — ES module versions can be 90%+
            smaller after tree shaking.
          </li>
          <li>
            Common tree shaking killers: CommonJS imports, barrel files without proper configuration, Babel
            transpiling to CommonJS, and side-effectful imports.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
