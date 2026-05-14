"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-hld-frontend-for-a-no-code-low-code-builder",
  title: "Design a Frontend for a No-Code / Low-Code Builder",
  description:
    "Architecture for a no-code / low-code builder: canvas rendering, drag-and-drop, component schema, live preview, formula engine, and extensibility for custom code.",
  category: "high-level-design",
  subcategory: "platform-sdk-infra-systems",
  slug: "frontend-for-a-no-code-low-code-builder",
  wordCount: 5500,
  readingTime: 33,
  lastUpdated: "2026-05-10",
  tags: ["hld", "no-code", "low-code", "builder", "drag-and-drop", "formula-engine"],
  relatedTopics: ["frontend-architecture-for-an-internal-developer-platform", "plugin-extension-marketplace-ui"],
};

export default function FrontendForANoCodeLowCodeBuilderArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Problem Clarification</h2>
        <HighlightBlock as="p" tier="crucial">A no-code / low-code builder lets non-engineers (and optionally engineers) create functional applications by composing UI components on a visual canvas, connecting them to data sources, and expressing logic through visual programming constructs (formulas, event handlers, conditional visibility rules) rather than imperative code. Examples: Retool (low-code internal tools), Webflow (no-code website builder), Airtable (no-code database + views), Bubble (full-stack no-code). The builder must solve two distinct frontend problems simultaneously: the builder UI (the environment where users create and edit their apps) and the runtime UI (the environment where end users use the created apps).</HighlightBlock>
        <HighlightBlock as="p" tier="important">The builder UI challenges: a drag-and-drop canvas that supports responsive layout, overlapping z-layers, nested containers, and pixel-precise or grid-snapped positioning; a formula engine that evaluates expressions binding UI components to data source values; a live preview that shows the runtime UI as users edit; undo/redo with operation granularity; and a component property panel for configuring selected components. The runtime UI challenges: rendering the app definition (a JSON schema) into functional UI, evaluating formula bindings, handling user interactions (button clicks, form submissions), and fetching/mutating data from connected data sources.</HighlightBlock>
        <p><strong>Explicit assumptions:</strong> The platform targets building internal tools (dashboards, admin panels, data entry forms). The primary personas are developers who want to move fast without writing boilerplate, and non-engineers who can manage simple data workflows. The builder supports a fixed set of built-in components (table, form, button, chart, image, text, input). Custom component extensibility uses a code editor (TypeScript/React) for low-code users. The app definition is stored as a JSON document. Apps are deployed to a platform-hosted runtime URL or exported as a Next.js project.</p>
      </section>

      <section>
        <h2>Requirements</h2>
        <h3 className="mt-6 mb-3 text-lg font-semibuild">Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Visual canvas:</strong> Users drag components from a palette onto a canvas. Components can be resized, repositioned, nested in containers, and aligned using grid snapping or pixel positioning.</li>
          <li><strong>Component configuration:</strong> Selecting a component opens a property panel showing all configurable properties. Properties accept literal values or formula expressions binding to data source values or other component states.</li>
          <li><strong>Formula engine:</strong> A JavaScript-subset formula language (similar to spreadsheet formulas) binds component properties to dynamic values: table.data[0].name, button.disabled = form.loading, text.color = input.value === 'error' ? 'red' : 'black'.</li>
          <li><strong>Data sources:</strong> Built-in connectors for REST APIs, GraphQL, PostgreSQL, MySQL, Google Sheets. Query results are available as data source objects in formulas.</li>
          <li><strong>Live preview:</strong> A preview panel renders the runtime UI in real-time as the user edits, showing the app as end users will see it with real data.</li>
          <li><strong>Undo/redo:</strong> All canvas edits are undoable (Ctrl+Z) with granularity at the individual action level (each drag, resize, property change is one undo step).</li>
        </ul>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Non-Functional Requirements</h3>
        <ul className="space-y-2">
          <li><strong>Canvas performance:</strong> Apps with 100 components on the canvas must render at 60fps during drag operations.</li>
          <li><strong>Formula evaluation latency:</strong> Formula re-evaluation on user input must complete in under 16ms (one frame) for formulas with up to 50 bindings.</li>
          <li><strong>App definition size:</strong> Apps with 200 components must have an app definition JSON under 500KB.</li>
        </ul>
      </section>

      <section>
        <h2>High-Level Architecture</h2>
        <HighlightBlock as="p" tier="crucial">The builder has two co-running UIs: the builder canvas (the editing environment) and the preview iframe (the runtime environment). The app definition—a JSON document describing all components, their properties, layout, and data source bindings—is the shared state between them. The builder canvas edits the app definition; the preview iframe renders it. Changes to the app definition are transmitted to the preview iframe via postMessage; the runtime re-renders the changed components. The separation of builder and runtime into different JavaScript contexts (the preview runs in a sandboxed iframe) prevents the runtime's components from interfering with the builder's UI and vice versa.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-for-a-no-code-low-code-builder-architecture.svg"
          alt="No-code builder architecture showing builder canvas (drag-and-drop, component palette, property panel, formula editor), app definition JSON (single source of truth, versioned), preview iframe (sandboxed runtime, renders app definition, evaluates formulas, fetches data sources), postMessage protocol (definition updates → runtime re-render; runtime events → builder selection sync), formula engine (AST parser, dependency graph, topological evaluation), and undo/redo stack (operation log with inverse operations)."
          caption="Builder architecture: canvas edits app definition JSON → postMessage to preview iframe runtime, formula engine with dependency graph, operation log for undo/redo"
        />
      </section>

      <section>
        <h2>Detailed Design</h2>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">App Definition Schema</h3>
        <p>The app definition is a JSON document with three top-level sections: components (a flat map of componentId to component descriptor), layout (a tree structure defining the spatial arrangement and nesting of components), and dataSources (a map of dataSourceId to connector configuration and query definition). Each component descriptor has: id, type (table, button, input, chart), properties (a map of property name to either a literal value or a formula string), and style (position, size, z-index in the layout grid).</p>
        <HighlightBlock as="p" tier="important">The flat component map (rather than a tree) is a deliberate design choice. Trees are natural for representing nested layouts but make certain operations expensive: finding all components of a type requires a depth-first traversal of the tree; moving a component from one parent to another requires mutations at two tree nodes. The flat map makes both operations O(1): looking up a component is a dictionary lookup; reparenting requires updating only the layout tree (not the component map). The layout tree stores componentId references, not component descriptors, so it is small and fast to traverse. This two-data-structure approach (flat map for component data, tree for layout) is used by Figma's design document model for the same reasons.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Versioning: each save of the app definition creates a new version in the version history, stored as a binary diff against the previous version (using the Myers diff algorithm on the JSON lines). This allows compact version storage (a small property change creates a small diff) and fast version viewing (apply diffs forward/backward from any checkpoint). The version history is used for undo/redo (in-session, in-memory), version history browsing (cross-session, database-backed), and collaborative editing (merging concurrent changes from multiple editors).</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Canvas Drag-and-Drop and Layout</h3>
        <HighlightBlock as="p" tier="important">The canvas uses a CSS grid layout for alignment: an invisible grid overlay with configurable cell size (default 8px) provides snap-to-grid alignment. During drag operations, the component being dragged is positioned absolutely using CSS transform: translate(x, y) (not top/left—transforms do not cause layout reflow and are GPU-accelerated). The snap calculation happens in the mousemove handler: the raw mouse coordinates are rounded to the nearest grid cell before being applied as the transform values. This produces a smooth snapping effect at 60fps because transform changes are handled by the compositor thread without triggering layout.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Nested containers: a component can be a container (a group that holds other components). Drag-and-drop into a container changes the component's parent in the layout tree. During a drag, the canvas detects hover over container components (by checking which container's bounding box contains the cursor) and highlights the target container. On drop, the component is reparented to the highlighted container. Container components clip their children (overflow: hidden) so children outside the container bounds are not visible.</HighlightBlock>
        <p>Multi-select: users can select multiple components by drawing a selection rectangle (lasso select) or by Shift-clicking individual components. The selection rectangle is drawn as an SVG element overlaid on the canvas. All components whose bounding boxes intersect the selection rectangle are added to the selection set. Multi-selected components can be moved, resized, grouped, or deleted as a unit. The property panel shows only properties that are common to all selected component types when multiple components are selected.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Formula Engine</h3>
        <p>The formula engine evaluates expressions that bind component properties to dynamic values. Formulas are strings that look like JavaScript expressions: &#123;&#123;table1.selectedRow.name&#125;&#125; in a text component's content property means "the name field of table1's currently selected row." The formula engine parses each formula into an AST, extracts the dependencies (which component states and data source fields the formula reads), and registers the formula as a subscriber to those dependencies.</p>
        <HighlightBlock as="p" tier="important">Dependency graph: the formula engine maintains a directed dependency graph where edges represent "formula F reads from state S." When state S changes (a user interacts with a component, or a data source fetch returns new data), the formula engine performs a topological traversal of the dependency graph starting from S and re-evaluates all formulas that transitively depend on S, in topological order (so a formula that depends on another formula's output is evaluated after its dependency). This ensures consistent evaluation regardless of the order in which subscriptions fire and prevents infinite loops (topological sort detects cycles and reports them as formula errors).</HighlightBlock>
        <HighlightBlock as="p" tier="important">Formula sandbox: formulas are evaluated in a sandboxed JavaScript execution context (a restricted eval or a custom interpreter) that has access only to the component state object and a set of allowed functions (math operations, string utilities, date formatting). The sandbox does not have access to window, document, fetch, or any global that could be used to make network requests, read cookies, or exfiltrate data. This sandbox is essential for user-generated formulas in a multi-tenant environment—a formula written by one user cannot affect other users' data or the platform's security.</HighlightBlock>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Runtime Rendering in the Preview Iframe</h3>
        <p>The preview iframe loads the runtime engine: a React application that reads the app definition (passed via postMessage from the builder) and renders it as functional UI. Each component type has a runtime renderer: the table type renders a data grid connected to its data source; the button type renders an HTML button with an onClick handler that triggers the configured action (run a query, navigate, set a component's state). The runtime renders the app definition recursively from the layout tree root.</p>
        <p>Incremental updates: when the user edits a property in the builder, only the changed component's renderer is re-evaluated in the runtime, not the entire app. The builder sends a targeted update message (&#123;type: 'UPDATE_COMPONENT', componentId, property, value&#125;) to the runtime iframe. The runtime applies the update to its local copy of the app definition and triggers a React state update only for the affected component, using React's reconciliation to avoid full re-renders. For formula-bound properties, the formula engine in the runtime re-evaluates only the affected formula and any transitively dependent formulas.</p>

        <h3 className="mt-6 mb-3 text-lg font-semibuild">Undo/Redo and Collaboration</h3>
        <p>Undo/redo is implemented as an operation log: each canvas action (move component, resize, change property, add component, delete component) appends an operation to the log with the forward operation and its inverse. Undo applies the inverse of the last operation; redo applies the forward operation of the most recently undone step. The log is in-memory (cleared on page refresh) and bounded to the last 100 operations. Operations are designed to be composable: a "move component 20px to the right" operation has a clean inverse ("move component 20px to the left"), making the undo/redo implementation straightforward.</p>
        <HighlightBlock as="p" tier="important">Collaborative editing: when multiple builders edit the same app simultaneously, changes from one builder must be merged with the other's in-progress edits. This is the same problem as the collaborative editor, and the solution is similar: operations are OT-transformed (for simple property changes, last-write-wins is sufficient; for structural changes like add/delete component, OT is needed to avoid conflicts). For most no-code builders, collaborative editing is a premium feature with limited concurrent editor counts (2–5 simultaneous editors), making simpler conflict resolution (optimistic last-write-wins with a "someone else made a change" notification and a refresh option) sufficient for the initial implementation.</HighlightBlock>
      </section>

      <section>
        <ArticleImage
          src="/diagrams/system-design-problems/high-level-design/platform-sdk-infra-systems/frontend-for-a-no-code-low-code-builder-workflow.svg"
          alt="No-code builder workflow showing app definition JSON as shared state, builder canvas → edit operation → operation log (undo/redo) → app definition update → postMessage to preview iframe, formula engine dependency graph (AST parse → dependency extraction → topological re-evaluation on state change), data source fetch (query execution on backend, results injected into formula context), and runtime iframe rendering (component type → renderer → React tree, incremental UPDATE_COMPONENT messages)."
          caption="Builder workflow: edit → operation log → app definition → postMessage → runtime re-render, formula dependency graph topological evaluation, incremental component updates"
        />
      </section>

      <section>
        <h2>Trade-offs and Considerations</h2>
        <HighlightBlock as="p" tier="important">Sandboxed formula evaluation: a custom interpreter (evaluating the formula AST in JavaScript without calling eval) is safer than eval-in-iframe but more complex to implement and slower for complex expressions. A Web Worker-based sandbox (running eval in a Worker with no DOM access) is simpler to implement than a custom interpreter but still allows some dangerous operations (Workers can make fetch requests). The recommended approach: a custom interpreter for formulas (it can enforce arbitrary restrictions and is the industry standard for spreadsheet formula engines), with the Worker sandbox as a fallback for the escape hatch "run custom JavaScript" feature available to low-code users. The formula language should be intentionally limited—if users need arbitrary code, the escape hatch is there for that.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Canvas rendering approach: rendering the canvas in React (with CSS for layout) is the most familiar approach but has performance limits—React's reconciliation is not designed for 60fps drag operations over 100+ components. An alternative is a canvas-rendered UI (all components drawn to a 2D canvas), which is faster for large component counts but loses native browser interactions (text selection, accessibility, form inputs must all be custom-implemented). The hybrid approach used by Figma (DOM for interactive elements, canvas for decorative elements) provides the best of both: form inputs and text are native DOM elements (accessible, native behavior), while selection handles and alignment overlays are canvas-drawn (no DOM overhead). For a no-code builder, pure React with CSS transforms is sufficient for up to 100 components; beyond that, progressive rendering (only rendering visible components based on the canvas viewport) keeps performance acceptable.</HighlightBlock>
        <HighlightBlock as="p" tier="important">Export versus hosted runtime: allowing users to export their app as a Next.js project (extracting the app definition into static React components) provides escape velocity—users who outgrow the no-code platform can take their work with them. However, exported apps immediately diverge from the platform's runtime (they no longer receive platform updates), and users cannot import the exported project back into the builder. The hosted runtime (apps always run on the platform) avoids divergence and allows the platform to update the runtime seamlessly, but creates vendor lock-in. Most commercial platforms offer export as a premium feature while emphasizing the hosted runtime for the majority of users.</HighlightBlock>
      </section>

      <section>
        <h2>Summary</h2>
        <HighlightBlock as="p" tier="important">A no-code / low-code builder frontend has two co-running UIs: the builder canvas (editing environment) and a sandboxed preview iframe (runtime environment), connected by the app definition JSON as shared state transmitted via postMessage. The app definition uses a flat component map (O(1) lookup) plus a separate layout tree (for nesting relationships), which separates component data from spatial structure. Canvas drag-and-drop uses CSS transform for 60fps GPU-accelerated movement with grid snap (8px cell rounding in the mousemove handler). The formula engine maintains a dependency graph (AST parse → dependency extraction), re-evaluating only affected formulas in topological order when component state changes. Formulas run in a custom interpreter sandbox (no fetch, no DOM, no globals) for security in a multi-tenant context. The runtime iframe renders the app definition recursively by component type; incremental UPDATE_COMPONENT messages trigger targeted React state updates (not full re-renders). Undo/redo uses an in-memory operation log with forward and inverse operations. The fundamental architectural decision is the builder-runtime separation via iframe: it isolates builder JavaScript from runtime JavaScript, prevents runtime component code from breaking the builder, and allows the runtime to be upgraded independently of the builder canvas.</HighlightBlock>
      </section>
    </ArticleLayout>
  );
}
